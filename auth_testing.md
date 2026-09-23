# Auth Testing Playbook — Sree Laxmi Automobiles

## Step 1: MongoDB verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Verify: password_hash starts with `$2b$`, unique index on users.email, index on login_attempts.identifier.

## Step 2: API testing
```
curl -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin","password":"admin123"}'
# -> {"token":"<JWT>","user":{...}}
TOKEN=<token from above>
curl http://localhost:8001/api/auth/me -H "Authorization: Bearer $TOKEN"
curl http://localhost:8001/api/tyres -H "Authorization: Bearer $TOKEN"
curl -X PUT http://localhost:8001/api/settings -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"phone":"+91 98111 22233"}'
curl http://localhost:8001/api/settings
```
Login returns token; /me returns user; protected routes return 401 without token.

## Step 3: Brute force
5 failed logins on same email -> 429 lockout for 15 minutes.
