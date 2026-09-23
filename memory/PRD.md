# PRD — Sree Laxmi Automobiles Landing Page

## Original Problem Statement
"Build a landing page: create a website for SREE LAXMI AUTOMOBILES"

## Business Brief (from discovery, verbatim answers)
- Business: tyre shop — wheel alignment (truck & car), wheel balancing, retreading
- Goal: bring in enquiries
- Audience: daily commuters / working professionals
- Differentiator (owner's words): "Genuine parts and honest work; quick service and delivery"
- Reach-out: phone call button + WhatsApp button + short enquiry form (all three)
- Design request: black and gold theme

## Architecture
- Frontend: React (CRA + craco), Tailwind, sonner toasts, lucide-react icons — single-page landing at `/`
- Backend: FastAPI, `/api/enquiries` POST + GET, MongoDB via motor (MONGO_URL/DB_NAME from env)
- Design source: approved direction `/app/design/direction.html` ("The Master Wheelwright"), remapped to black (#0a0906) & gold (#d4af37) per user request; Anton display font + Georgia serif

## User Personas
- Daily commuter needing quick alignment/balancing around work hours
- Working professional comparing genuine tyre prices
- Commercial/truck operator needing fleet alignment & retread

## Implemented (2026-09-23)
- Hero with differentiator quote, CTA, workshop image
- Manifesto (3 principles), Services (2 bays), Technical matrix table, Testimonials (2 placeholder slots + share card), FAQ
- Contact section: call button (tel:), WhatsApp button (wa.me with prefilled text), enquiry form wired to backend, stored in MongoDB
- All interactive elements carry data-testid

## Placeholders Pending From Owner
- Real phone number (currently +91 00000 00000 in /app/frontend/src/constants/site.js)
- Real WhatsApp number (currently wa.me/910000000000)
- Workshop address & opening hours (not yet displayed)

## Backlog
- P0: Wire real phone/WhatsApp numbers once provided; add address + hours + Google Maps embed
- P1: Enquiry email notification to owner (e.g. Resend)
- P1: Admin view of enquiries
- P2: Tyre price list / brand catalogue, service slot booking with date-time picker
