# Hotel Booking Admin Portal

A simple Admin Portal for a Hotel Booking website (Phase 1 MVP). The app is branded as **Hotel Manager** in the UI.

## Test credentials

| Username | Password |
|---------|----------|
| `admin` | `admin` |

Use these to log in at the login page. Invalid credentials show an error message; successful login redirects to the hotels list.

## Features

- **Login / Logout**: Cookie-based auth. Protected routes redirect to `/login` when unauthenticated.
- **Create account** (dummy): `/create-user` – form only; no backend. Shows success toast and redirects to login. Link from login: “Create account”.
- **Manage Hotels (CRUD)**:
  - **List** all hotels at `/hotels` (table with View, Edit, Delete per row).
  - **Add** hotel via modal (button “Add Hotel”); name and address required.
  - **View** a hotel at `/hotels/:id` (name, address; Edit and Delete buttons).
  - **Edit** hotel via modal (from list or from view page). If opened from view page, Cancel returns to view. Save with no changes shows “No changes to save” and does not call the API.
  - **Delete** hotel via confirmation modal (from list or from view page). After delete, user is on the list; deleted hotel is no longer shown.

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

API base path: `/api` (e.g. `POST /api/auth/login`, `GET /api/hotels`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. Open this URL, log in with **admin** / **admin**, then use the portal to list, add, view, edit, and delete hotels.

### Production-style run

- Backend: `npm start` (from `backend`).
- Frontend: `npm run build` then `npm run preview` (from `frontend`), or serve the `frontend/dist` folder with any static server.

## Assumptions

- Single admin user; credentials are fixed (`admin` / `admin`) for Phase 1. No user table or password hashing.
- Auth is cookie-based: login sets an httpOnly cookie; protected API routes and the frontend redirect to login when unauthenticated.
- Frontend expects the API at **http://localhost:3000/api** by default. Override with `VITE_API_URL` (e.g. `https://your-api.com/api`) if needed.
- SQLite file lives in `backend/` and is created automatically; no separate DB setup step.
- CORS is set for `http://localhost:5173`; change the backend `origin` in `server.js` if you use a different frontend URL.

## Shortcuts / tradeoffs

- **No tests** in this Phase 1 deliverable (optional per spec).
- **No password hashing**: credentials are checked in plain text. Acceptable for a local/demo Phase 1 only.
- **Create account** is UI-only: no backend registration; form validates and shows success then redirects to login.
- **Delete** is implemented (modal on list and on hotel view; API `DELETE /api/hotels/:id`).
