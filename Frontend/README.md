# FitFlow

FitFlow is a full-stack fitness application that combines:
- User authentication (JWT)
- AI-generated workout plans and diet plans (via OpenRouter/OpenAI-compatible API)
- Progress tracking with streaks and badges
- PDF report export based on logged progress
- AI chat as a fitness coach

Repository layout:
- `Frontend/` – React (Vite) single-page app
- `Backend/` – Node.js (Express) + MongoDB API

> Live API base used by the frontend: `http://localhost:5000/api`

---

## Features

### Authentication
- `POST /api/auth/register` – create account
- `POST /api/auth/login` – login and receive JWT

### Profile
- `GET /api/user/profile` – read user profile
- `PUT /api/user/profile` – update user profile (age/height/weight/goal/etc.)

### AI Plans (OpenRouter)
- Workout plan
  - `POST /api/ai/workout-plan` – generate weekly workout plan (saved to DB)
  - `GET /api/ai/workout-plans` – fetch saved workout plans
- Diet plan
  - `POST /api/diet/generate` – generate diet plan (saved to DB)
  - `GET /api/diet/history` – fetch saved diet plans

### AI Fitness Coach Chat
- `POST /api/chat/ask` – ask the AI a fitness/nutrition question

### Progress Tracking
- `POST /api/progress/` – log weight
- `GET /api/progress/` – fetch weight logs (supports `range` query)
- `GET /api/progress/streak` – current + longest streak
- `GET /api/progress/badges` – badge calculation based on progress

### PDF Report
- `GET /api/report/download` – exports a PDF body-composition report
  - Frontend: `Frontend/src/components/DownloadReport.jsx`

---

## Tech Stack

### Frontend
- React + Vite
- React Router
- TailwindCSS (via `@tailwindcss/vite`)
- Charting: Recharts
- Circular metric: `react-circular-progressbar`
- Animations: `framer-motion`
- HTTP client: Axios

### Backend
- Express
- MongoDB (Mongoose)
- JWT auth
- PDF generation: `pdfkit`
- AI integration: `openai` (configured with OpenRouter base URL)

---

## Prerequisites

- Node.js installed
- MongoDB URI available
- JWT secret available
- OpenRouter/OpenAI API key available

---

## Configuration (.env)

Create a `.env` file inside `Backend/`.

Example:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Setup & Run

### 1) Backend
```bash
cd Backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 2) Frontend
In a new terminal:
```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on Vite’s default dev port (commonly `http://localhost:5173`).

---

## API Overview

All routes are mounted under `/api` in `Backend/server.js`.

### Auth
- `/api/auth/register`
- `/api/auth/login`

### User/Profile
- `/api/user/profile` (GET/PUT)

### AI
- `/api/ai/workout-plan` (POST)
- `/api/ai/workout-plans` (GET)

### Diet
- `/api/diet/generate` (POST)
- `/api/diet/history` (GET)

### Chat
- `/api/chat/ask` (POST)

### Progress
- `/api/progress/` (POST add, GET list with `range`)
- `/api/progress/streak` (GET)
- `/api/progress/badges` (GET)

### Report
- `/api/report/download` (GET)

### Workout history
- `/api/workout/history` (GET)

---

## Frontend Navigation (Routes)

Defined in `Frontend/src/App.jsx`:
- `/login`
- `/signup`
- `/dashboard` (protected)
- `/profile` (protected)
- `/workout-plan` (protected)
- `/diet-plan` (protected)
- `/fitness-chat` (protected)
- `/progress` (protected)
- `/workout-history` (protected)
- `/diet-history` (protected)

---

## Data Models (MongoDB)

Located in `Backend/models/`:
- `User`
- `Progress` (weight logs)
- `WorkoutPlan` (AI-generated workout plans)
- `DietPlan` (AI-generated diet plans)
- `ProgressPhoto` exists but appears to be commented out/incomplete in current routes.

---

## Notes / Known Issues

- There is a backend TODO (`Backend/TODO_fix_auth.md`) describing likely auth-related crash causes (case mismatch in model import, missing env vars, etc.).

---

## Credits

Built with:
- Express + Mongoose
- React + Vite
- OpenRouter/OpenAI-compatible model hosting
- pdfkit for PDF export

