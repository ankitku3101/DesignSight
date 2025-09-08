# DesignSight

A full‑stack app for collecting automated and AI‑assisted feedback on design screenshots, organized by projects and screens. Backed by Node.js/Express + MongoDB, with a modern Next.js frontend styled with Tailwind.

## Architecture

- Backend: Express (TypeScript), MongoDB (Mongoose), Multer for uploads
- AI:
  - Google Cloud Vision: extracts regions/objects/text + coordinates
  - Gemini (Google Generative AI): generates structured UX/UI suggestions
- Frontend: Next.js App Router, Tailwind, role‑based filtering in UI

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud) or Docker if using docker-compose
- Google Cloud project with Vision API enabled
- Gemini API key via Google AI Studio (or Vertex AI)

## Environment variables

Create a .env file for the backend (`apps/backend/.env`) and frontend (`apps/frontend/.env.local`).

Backend (`apps/backend/.env`):
- MONGO_URI: MongoDB connection string (e.g., mongodb://localhost:27017/designsight)
- PORT: Backend port (default 5000)
- BE_URL: Public/base URL of the backend used to build file URLs (e.g., http://localhost:5000)
- GEMINI_API_KEY: API key from Google AI Studio for Gemini
- GOOGLE_APPLICATION_CREDENTIALS: Absolute path to the Vision service account JSON (optional if using explicit keyFilename in code)

Frontend (`apps/frontend/.env.local`):
- NEXT_PUBLIC_BE_URL: Base URL of the backend (e.g., http://localhost:5000)

Service account JSON for Vision:
- Place your Google Cloud Vision service account key JSON at `apps/backend/secrets/google-api.json`
- Ensure the service account has Vision permissions; keep this file secret

## Provider setup and costs

- Google Cloud Vision
  - Enable Vision API in your Google Cloud project
  - Create a service account and download the JSON key
  - Pricing: Vision is billed per feature usage (e.g., object/label/text detection). New Google Cloud users often get free credits (~$300) that can offset usage while evaluating. See Google Cloud Vision pricing for current rates and free credit eligibility.
- Gemini (Google AI Studio)
  - Get an API key at Google AI Studio
  - Free tier typically available with rate limits; paid usage (or Vertex AI) is billed by tokens. Check current pricing docs for exact numbers.

Estimated cost (example scenario):
- Light evaluation (e.g., 100 screen analyses/month using basic Vision + a few Gemini prompts) often fits within free credits or low single‑digit USD. Exact costs depend on features called per image and Gemini prompt sizes. Always review current pricing pages before production.

## Running locally

- Install dependencies (from repo root):
  - npm install
- Backend:
  - cd apps/backend
  - npm run dev
  - The server starts on PORT (default 5000)
- Frontend:
  - cd apps/frontend
  - npm run dev
  - App runs on Next.js dev server (default 3000)

Ensure `NEXT_PUBLIC_BE_URL` points to the backend (http://localhost:5000 in local dev).

## Running with Docker

- docker-compose up -d
- Access frontend at http://localhost:3000 and backend at http://localhost:5000
- Make sure your Vision service account JSON is mounted or present at `apps/backend/secrets/google-api.json` inside the container per your compose/Dockerfile setup

## File uploads

- Images are stored on the backend filesystem in `apps/backend/dist/uploads` at runtime and served via `/uploads/*`
- The API builds absolute URLs using `BE_URL`

## API overview

- POST /api/projects: create a project
- GET /api/projects: list projects
- POST /api/projects/:id/screens: upload image (multipart/form-data, field name: image); runs Vision then Gemini
- GET /api/projects/:id/screens: list screens for a project
- GET /api/projects/:id/screens/:screenId: fetch a screen with feedback + suggestions
- GET /api/screens/:screenId/export: export structured data (JSON)

## Design note (tradeoffs)

We kept provider prompts and Vision usage straightforward to maintain determinism in shape (type/message/coordinates) while allowing semantic variability in wording. Coordinates from Vision are favored when available and passed through to the UI for contextualization. The system uses simple local disk storage for uploads to keep infra minimal; this can be swapped for cloud storage later. We avoided extra UI libraries to keep the footprint small and retain control over styling with Tailwind.

## End‑to‑end process flow

1. Upload a screen image in the project’s Screens page (frontend → backend `/api/projects/:id/screens`).
2. Backend stores the image, runs Google Vision (objects/labels/text) and generates region‑aware feedback.
3. Backend calls Gemini with the Vision context + image to produce structured UI/UX suggestions.
4. Backend saves a `Screen` document with `imageUrl`, `feedbackItems` (Vision), and `geminiSuggestions`.
5. Frontend screen detail fetches the `Screen`, applies role‑based filtering, and renders:
   - Image card
   - Regions Referenced (x/y/w/h from either source when present)
   - Vision Feedback cards
   - AI Suggestions cards
6. Export endpoint returns a JSON bundle with image reference and all feedback for review/share.

## Turborepo / Monorepo structure

- `apps/backend`: Express API in TypeScript
  - `src/index.ts`: app bootstrap and routes wiring
  - `src/routes/`: `projectRoutes.ts`, `screenRoutes.ts`
  - `src/models/`: `Project.ts`, `Screen.ts`
  - `src/services/`: `googleVision.ts`, `gemini.ts`
  - `secrets/`: place Vision service account JSON here
  - `dist/`: compiled output and runtime `uploads/`
- `apps/frontend`: Next.js (App Router)
  - `app/`: pages and routes (projects, screens, detail)
  - `components/`: UI components (cards, uploader, role switcher, comments, export)
  - `public/`, Tailwind config and globals
- `packages/`: shared configs
  - `eslint-config/`, `typescript-config/`, `ui/`
- Root: `turbo.json` and workspace scripts (`dev`, `build`, `lint`)

Notes:
- Use `npm run dev` at the root to run both apps via Turborepo (or run each app separately).
- Frontend expects `NEXT_PUBLIC_BE_URL` to reach backend; CORS is enabled by default on the API.
