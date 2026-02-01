# CELPIP Writing Practice

A web app to help users practice for the CELPIP writing section. Built with Next.js, Tailwind, NextAuth (email + Google), Prisma/PostgreSQL, and Groq (LLaMA 3.3 70B) for AI evaluation.

**Domain:** [celpipwritingpractice.com](https://celpipwritingpractice.com)

## Features

- **Authentication:** Sign up / log in with email and password, or one-click Google sign-in.
- **Practice:** Task 1 (Email) and Task 2 (Survey Response) with 10 example questions each plus custom prompts.
- **Timer:** 26-minute countdown for realistic test conditions.
- **Evaluation:** AI evaluation aligned to the official CELPIP rubric (Content/Coherence, Vocabulary, Readability, Task Fulfillment), scores 0–12.
- **History:** All sessions saved; list with filters (task type, date range); session detail view.
- **KPIs:** Best, worst, and average scores (overall and per category) on the dashboard.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Auth:** NextAuth.js (Credentials + Google OAuth), JWT sessions
- **DB:** PostgreSQL (Prisma)
- **AI:** Groq API (LLaMA 3.3 70B Versatile)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or e.g. Railway)
- [Groq API key](https://console.groq.com/)
- (Optional) Google OAuth client ID and secret for “Sign in with Google”

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-long-random-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GROQ_API_KEY="your-groq-api-key"
```

- `DATABASE_URL`: PostgreSQL connection string (e.g. from Railway).
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: From [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services → Credentials). Redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`.
- `GROQ_API_KEY`: Required for evaluation.

### 3. Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

`db:seed` populates 10 example questions for Task 1 and 10 for Task 2.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Railway)

1. Create a new project on [Railway](https://railway.app/).
2. Add a PostgreSQL service and note `DATABASE_URL`.
3. Add a new service from your repo (or connect GitHub).
4. Set env vars: `DATABASE_URL`, `NEXTAUTH_URL` (e.g. `https://celpipwritingpractice.com`), `NEXTAUTH_SECRET`, `GROQ_API_KEY`, and optionally `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. Build command: `npm run build`. Start command: `npm start`.
6. Run migrations and seed once (e.g. via Railway shell or a one-off job):
   - `npx prisma db push`
   - `npm run db:seed`
7. Point your domain (celpipwritingpractice.com) to the Railway service.

## Design

UI follows the project’s [design-principles.md](design-principles.md): simple, minimal, modern, readability-first.

## License

Private / use as needed.
