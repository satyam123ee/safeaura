# SafeAura — Women's Safety App

Full-stack MERN application: real-time location sharing, emergency SOS, community alerts, and safety scoring.

## Stack

- **Backend:** Node.js, Express, MongoDB, Redis, Socket.IO, BullMQ
- **Frontend:** React (Vite), Tailwind CSS, React Router, Leaflet, Axios

## Quick Start

### 1. Start MongoDB & Redis (Docker)

```bash
docker compose up -d
```

### 2. Backend

```bash
npm install
cp .env.example .env   # edit if needed
npm run dev
```

API runs at `http://localhost:3000`

### 3. Frontend

```bash
cd safeaura-frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Features

- User registration & login (JWT auth)
- Dashboard with safety score & quick access
- Live location sharing via Socket.IO + Leaflet map
- Emergency SOS (press-and-hold) with geolocation
- Community alerts with tab filters
- Trusted contacts management
- Dark purple/pink theme matching Figma design

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Sign in |
| GET | `/api/v1/contacts` | List trusted contacts |
| POST | `/api/v1/contacts` | Add contact |
| POST | `/api/v1/alerts/sos` | Trigger SOS |
| GET | `/api/v1/community-alerts` | List community alerts |
| GET | `/api/v1/users/safety-score` | Get safety score |

## Production

- Deploy backend to Render/Railway
- Deploy frontend (`safeaura-frontend/dist`) to Vercel/Netlify
- Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend URL
- Update backend `CLIENT_URL` for CORS

---

## Backend-only (archive) — how to run

This archive is a backend-only snapshot containing the server code and required backend files. Frontend sources and docker-compose for the full-stack project are not included here.

Required environment variables (minimum):

- JWT_SECRET — secret for signing JWTs (required)
- MONGODB_URL — MongoDB connection URI, or set `USE_MEMORY_DB=true` to use an in-memory MongoDB for development
- REDIS_URL — Redis connection URI, or set `REDIS_URL=false` to disable Redis/queues
- CLIENT_URL — the frontend origin (optional, used for CORS)
- PORT — optional (defaults to 3000)

Quick steps:

```bash
# inside the extracted archive
npm install
cp .env.example .env   # or create .env with values described above
# start backend in dev mode (nodemon)
npm run dev
# or start production server
npm start
# run background worker (if using Redis + BullMQ)
npm run worker
```

Notes:
- The package.json in this archive had common frontend scripts/deps removed to simplify a backend-only setup — verify `package.json` before installing if you have custom needs.
- If you don't want to run Redis, set `REDIS_URL=false` to disable queue features; the app logs a warning and continues without queues.
- Ensure `JWT_SECRET` is set before starting — the server will fail fast when it is missing.

If you want a branch or a repo with these backend files (instead of a ZIP), I can create one for you.
