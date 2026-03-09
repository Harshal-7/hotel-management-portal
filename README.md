# Hotel Booking Admin Portal

A simple Admin Portal for a Hotel Booking website (Phase 1 MVP).

## Features

- **Admin Login**: Username `admin` / Password `admin`. Successful login redirects to the hotels list; invalid credentials show an error message.
- **Manage Hotels (CRUD-lite)**:
  - List all hotels
  - Add a hotel (name, address required)
  - View a hotel
  - Edit a hotel

Hotel model: `id` (auto-generated), `name` (required), `address` (required). Data is stored in SQLite.

## How to run locally

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at **http://localhost:3000**. The SQLite database file `database.sqlite` is created in the `backend` folder on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. Open this URL in a browser, log in with `admin` / `admin`, then use the portal to list, add, view, and edit hotels.

### Production-style run

- Backend: `npm start` (from `backend`)
- Frontend: `npm run build` then `npm run preview` (from `frontend`), or serve the `frontend/dist` folder with any static server.

## Assumptions

- Single admin user; credentials are fixed (`admin` / `admin`) for Phase 1. No user table or password hashing.
- Auth is cookie-based: login sets an httpOnly cookie; protected API routes and the frontend redirect to login when unauthenticated.
- Frontend expects the API at `http://localhost:3000` by default. Override with `VITE_API_URL` (e.g. `http://localhost:3000/api`) if needed.
- SQLite file lives in `backend/` and is created automatically; no separate DB setup step.

## Shortcuts / tradeoffs

- **No tests** in this Phase 1 deliverable (optional per spec).
- **No password hashing**: credentials are checked in plain text. Acceptable for a local/demo Phase 1 only.
- **No delete hotel**: assignment asked for Add, View, List, Edit only (CRUD-lite).
- **CORS** is set for `http://localhost:5173`; change backend origin if you use a different frontend URL.
