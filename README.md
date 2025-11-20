# Staff Scheduler — Social Organisation for Unity & Leisure

Lightweight Next.js prototype for staff scheduling and attendance (employee calendar, availability marking, camera-based check-in with location, admin dashboard, exports). Built as a deliverable/prototype you can refine.

Key features
- Email signup / signin (cookie + JWT).
- Employee calendar (mark available/unavailable: green/red).
- Camera-based check-in / check-out (captures live photo + geolocation + timestamp). Late check-ins can request admin approval.
- Admin dashboard: manage staff, shifts, expenses, view & approve attendance.
- Export: CSV, XLSX, DOCX for users, attendances, shifts, expenses.
- Simple JSON file DB (`data/db.json`) for prototype. Photos stored as base64 data URLs.

Quick start (development)
1. Install dependencies:

   npm install

2. Run dev server:

   npm run dev

3. Open http://localhost:3000

Seeded admin account
- Email: `admin`
- Password: `admin`

Important environment
- For production set `JWT_SECRET` environment variable to a secure value.
- Browser permissions: camera and geolocation require user consent; geolocation often requires HTTPS in modern browsers.

Files of interest
- `pages/calendar.js` — employee availability calendar.
- `pages/checkin.js` — camera + geolocation check-in UI.
- `pages/admin/*` — admin UI (staff, shifts, expenses, attendance, exports).
- `pages/api/*` — server APIs (auth, availability, attendance, admin).
- `data/db.json` — simple JSON datastore (development only).

Notes & limitations
- This is a prototype: images are stored inline (base64) in `data/db.json` — for production use object storage (S3) or a proper database.
- Geolocation precision and camera facing selection depend on device/browser support.
- Exports are generated server-side (CSV/XLSX/DOCX) and downloaded directly.
- Currency formatting uses GBP (displayed with `£`).

Deployment hints
- Deploy to Vercel or any Node host. Ensure HTTPS for camera/geolocation on clients.
- Set `JWT_SECRET` in the host environment.
- Replace JSON file DB with a real DB (Postgres/Mongo) and move photos to object storage for scale.

How to update branding/logo
- As an admin POST to `/api/admin/settings` with JSON like:

```json
{ "siteTitle": "Social Organisation for Unity & Leisure", "logo": "data:image/png;base64,..." }
```

Support and next steps
- If you want, I can: add persistent DB integration, S3 photo uploads, email/password reset, move to Next App Router, harden auth, or create a polished UI with your logo and colors.

--- 
Prototype delivered — enjoy. If you want the next polish (production DB + file storage + tests) I can implement that next.


