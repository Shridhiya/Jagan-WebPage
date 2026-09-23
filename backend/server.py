from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import ipaddress
import uuid
import bcrypt
import jwt
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------- email setup
EMAIL_BASE_URL = "https://integrations.emergentagent.com"  # constant, not env
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Sree Laxmi Automobiles")

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


# ------------------------------------------------------------- email gate (G2/G3)
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> Optional[str]:
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY missing; skipping email send")
        return None
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:
        logger.error(f"Email send error: {e}")
        return None  # never crash the enquiry flow because of email


# ------------------------------------------------------------------- auth utils
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Workshop Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin account seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from env")


EXTERNAL_STAFF_APP_URL = "https://tire-price-manager.preview.emergentagent.com"


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    # Seed default site settings once (admin edits via dashboard)
    existing_settings = await db.settings.find_one({"key": "site"})
    if existing_settings is None:
        await db.settings.insert_one({
            "key": "site", "phone": "", "whatsapp": "", "address": "",
            "hours": "", "alert_email": "", "external_staff_url": EXTERNAL_STAFF_APP_URL,
        })


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ---------------------------------------------------------------------- models
class LoginInput(BaseModel):
    email: str
    password: str


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    vehicle_type: str
    service: str
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=6, max_length=20)
    vehicle_type: str
    service: str
    notes: Optional[str] = ""


class Tyre(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand: str
    size: str
    vehicle_type: str
    price: float
    stock: Optional[str] = ""
    notes: Optional[str] = ""
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TyreUpsert(BaseModel):
    brand: str = Field(min_length=1, max_length=80)
    size: str = Field(min_length=1, max_length=40)
    vehicle_type: str = Field(min_length=1, max_length=60)
    price: float = Field(ge=0)
    stock: Optional[str] = ""
    notes: Optional[str] = ""


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    phone: Optional[str] = ""
    whatsapp: Optional[str] = ""
    address: Optional[str] = ""
    hours: Optional[str] = ""
    alert_email: Optional[str] = ""
    external_staff_url: Optional[str] = ""


async def get_settings() -> dict:
    doc = await db.settings.find_one({"key": "site"}, {"_id": 0})
    return doc or {"key": "site"}


# ---------------------------------------------------------------- auth routes
@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request):
    email = input.email.strip().lower()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_since = datetime.fromisoformat(attempts["updated_at"])
        if datetime.now(timezone.utc) - locked_since < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True)
        raise HTTPException(status_code=401, detail="Invalid username or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], email)
    return {"token": token, "user": {"email": email, "name": user.get("name", ""), "role": user.get("role", "staff")}}


@api_router.get("/auth/me")
async def auth_me(user=Depends(get_current_user)):
    return user


# ----------------------------------------------------------------- public API
@api_router.get("/")
async def root():
    return {"message": "Sree Laxmi Automobiles API"}


@api_router.get("/settings", response_model=SiteSettings)
async def public_settings():
    return await get_settings()


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    enquiry = Enquiry(**input.model_dump())
    doc = enquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)

    settings = await get_settings()
    alert_email = (settings.get("alert_email") or "").strip()
    if alert_email:
        subject = f"New enquiry: {enquiry.service} — {enquiry.name}"
        html = (
            '<table role="presentation" width="100%"><tr><td style="padding:24px;'
            'font-family:Arial,sans-serif;color:#222">'
            f'<h2 style="margin:0 0 12px">New Workshop Enquiry</h2>'
            f'<p><strong>Name:</strong> {escape(enquiry.name)}<br>'
            f'<strong>Phone:</strong> <a href="tel:{escape(enquiry.phone)}">{escape(enquiry.phone)}</a><br>'
            f'<strong>Vehicle:</strong> {escape(enquiry.vehicle_type)}<br>'
            f'<strong>Service:</strong> {escape(enquiry.service)}<br>'
            f'<strong>Notes:</strong> {escape(enquiry.notes or "-")}</p>'
            f'<p style="font-size:12px;color:#888">Sent by {escape(EMAIL_FROM_NAME)} website enquiry form. '
            'We never ask for your password or card details by email.</p>'
            '</td></tr></table>')
        await send_email(to=alert_email, subject=subject, html=html)
    return enquiry


# --------------------------------------------------------------- admin routes
@api_router.get("/enquiries", response_model=List[Enquiry])
async def list_enquiries(user=Depends(get_current_user)):
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for e in enquiries:
        if isinstance(e.get('created_at'), str):
            e['created_at'] = datetime.fromisoformat(e['created_at'])
    return enquiries


@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(input: SiteSettings, user=Depends(get_current_user)):
    doc = {"key": "site", **input.model_dump()}
    await db.settings.update_one({"key": "site"}, {"$set": doc}, upsert=True)
    return input


@api_router.get("/tyres", response_model=List[Tyre])
async def list_tyres(user=Depends(get_current_user)):
    tyres = await db.tyres.find({}, {"_id": 0}).sort("brand", 1).to_list(1000)
    for t in tyres:
        if isinstance(t.get('updated_at'), str):
            t['updated_at'] = datetime.fromisoformat(t['updated_at'])
    return tyres


@api_router.post("/tyres", response_model=Tyre)
async def create_tyre(input: TyreUpsert, user=Depends(get_current_user)):
    tyre = Tyre(**input.model_dump())
    doc = tyre.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.tyres.insert_one(doc)
    return tyre


@api_router.put("/tyres/{tyre_id}", response_model=Tyre)
async def update_tyre(tyre_id: str, input: TyreUpsert, user=Depends(get_current_user)):
    existing = await db.tyres.find_one({"id": tyre_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Tyre not found")
    await db.tyres.update_one({"id": tyre_id}, {"$set": {
        **input.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}})
    updated = await db.tyres.find_one({"id": tyre_id}, {"_id": 0})
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    return Tyre(**updated)


@api_router.delete("/tyres/{tyre_id}")
async def delete_tyre(tyre_id: str, user=Depends(get_current_user)):
    result = await db.tyres.delete_one({"id": tyre_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tyre not found")
    return {"status": "deleted"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
