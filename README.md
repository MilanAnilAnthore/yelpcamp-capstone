# YelpCamp — Full‑Stack Campground App

Live Demo: https://yelpcamp-pearl.vercel.app/

Discover and share the best places to camp. YelpCamp lets users create campgrounds with images and locations, browse an interactive map, and leave ratings and reviews — all with robust security, authentication, and a clean UI.

## Highlights
- **Polished UX:** Clean Bootstrap 5 UI, flash messages, carousel galleries, and validation hints.
- **Interactive Maps:** Clustered map view and per‑campground map using Mapbox GL JS and GeoJSON.
- **Image Uploads:** Cloudinary storage with thumbnails, multi‑image support, and server‑side deletion.
- **Reviews & Ratings:** Authenticated users can rate (1–5 stars) and comment on campgrounds.
- **Secure by Default:** Helmet CSP, server+client sanitization, Mongo sanitize, and Joi validation.
- **Session Auth:** Local auth with Passport, persistent sessions in Mongo via connect‑mongo.

## Tech Stack
- **Frontend:** EJS templates, Bootstrap 5, Mapbox GL JS
- **Backend:** Express 5, Mongoose 8, Passport (local)
- **Database:** MongoDB (Atlas or local)
- **Storage:** Cloudinary via `multer-storage-cloudinary`
- **Validation/Security:** Joi (+ sanitize-html), Helmet, express-mongo-sanitize

## Architecture
- **Routing:** [routes/campground.js](routes/campground.js), [routes/reviews.js](routes/reviews.js), [routes/users.js](routes/users.js)
- **Controllers:** [controllers/campgrounds.js](controllers/campgrounds.js), [controllers/reviews.js](controllers/reviews.js), [controllers/users.js](controllers/users.js)
- **Models:** [models/campground.js](models/campground.js), [models/review.js](models/review.js), [models/user.js](models/user.js)
- **Middleware:** Authz/authn and validation in [middleware.js](middleware.js); Joi schemas in [schemas.js](schemas.js)
- **Security:** CSP and sanitization in [app.js](app.js) and [utils/mongoSanitizeV5.js](utils/mongoSanitizeV5.js)

Flow (example: create campground)
1) Form POST → `POST /campgrounds`
2) Guards: `isLoggedIn`, `upload.array('image')`, `validateCampground`
3) Controller: geocodes with Mapbox, saves `geometry`, pushes Cloudinary images, sets `author`

## Features In Depth
- **Campgrounds CRUD:** Create, edit (add/remove images), show, and delete. GeoJSON `Point` geometry is required and leveraged across maps.
- **Reviews:** Users can create and delete their own reviews; cascade delete on campground removal ensures no orphaned reviews.
- **Maps:**
	- Clustered index map (Mapbox) for all campgrounds
	- Per‑campground map marker + popup
- **Security:**
	- Helmet Content Security Policy with explicit allowlists
	- Server‑side input sanitization for Express 5 (`utils/mongoSanitizeV5.js`)
	- Joi schemas with HTML stripping via `sanitize-html`
	- `httpOnly` cookies; sessions encrypted at rest in store

## Getting Started (Local)

Prerequisites
- Node.js 18+
- MongoDB (local service or MongoDB Atlas connection string)
- Cloudinary account (for image uploads)
- Mapbox token (for geocoding + client maps)

1) Clone and install
```bash
git clone <your-fork-or-repo>
cd yelpcamp-capstone
npm install
```

2) Create a `.env` file
```bash
# Required
DB_URL=mongodb://localhost:27017/yelpcamp-capstone
SECRET=change-this-session-secret

# Mapbox
MAPBOX_TOKEN=your-mapbox-token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

3) Run the app
```bash
node app.js
# optional (add this script in package.json):
#   "start": "node app.js",
#   "dev": "nodemon app.js"
# then run:
# npm run dev
```

App starts on http://localhost:3000

## Seeding (Optional)
There is a seed script in [seeds/index.js](seeds/index.js) that generates 200 campgrounds with geo coordinates and sample images.

Notes:
- It connects to `mongodb://localhost:27017/yelpcamp-capstone` directly.
- It sets a fixed `author` id (`author: '6935b17860cecdbc35d77cd6'`). To avoid reference issues, create a user, copy their `_id`, and replace it before running the seed.

Run:
```bash
node seeds/index.js
```

## Configuration & Environment
Set the following environment variables locally and on your host:
- `DB_URL` — Mongo connection string (Atlas or local)
- `SECRET` — Session secret
- `MAPBOX_TOKEN` — Mapbox access token
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` — Cloudinary credentials

Production tips:
- Behind HTTPS, enable secure cookies and trust proxy (see `app.js`).
- Ensure your CSP image sources include your Cloudinary cloud domain.

## Deployment (Vercel)
Live: https://yelpcamp-pearl.vercel.app/

Environment variables (Vercel → Project → Settings → Environment Variables):
- `DB_URL`
- `SECRET`
- `MAPBOX_TOKEN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`

The project includes [vercel.json](vercel.json) routing to `app.js`. If you move to a serverless handler, export the app or use a serverless adapter; otherwise consider a traditional Node host (Render, Railway) for long‑lived servers.

## Security Notes
- Strict CSP via Helmet with whitelists for scripts, styles, images, and connections
- Request sanitization for body/params/query against NoSQL injection
- Server‑side HTML stripping in Joi schemas
- Session store encryption and `httpOnly` cookies

## License
See [LICENSE](LICENSE).

## Credits
Inspired by the classic YelpCamp project (Colt Steele) with modernized dependencies, security posture, and mapping UX.

---

If you’d like, I can add screenshots, improve CSP for Cloudinary domains, and document API endpoints. Open an issue or ping me.