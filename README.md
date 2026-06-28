# CELPIP Writing Practice

A Next.js app for practising the CELPIP writing section. It supports timed Task 1 and Task 2 responses, AI evaluation against the CELPIP rubric, score history, and progress dashboards.

**Production domain:** [celpipwritingpractice.com](https://celpipwritingpractice.com)

## Stack

- Next.js 16, React 19, and Tailwind CSS 4
- NextAuth.js with credentials and optional Google OAuth
- Prisma ORM with PostgreSQL
- Groq API using `openai/gpt-oss-20b`
- Vercel for the application and Neon for serverless PostgreSQL

## Local setup

Requirements: Node.js 20.9 or newer, npm, PostgreSQL, and a Groq API key.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

For local PostgreSQL, `DATABASE_URL` and `DATABASE_URL_UNPOOLED` may contain the same connection string. The seed command is intended for a new local or preview database; it deletes and recreates example questions and must not be run against migrated production data.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Pooled PostgreSQL URL used by the application runtime |
| `DATABASE_URL_UNPOOLED` | Yes | Direct PostgreSQL URL used by Prisma migrations and admin tools |
| `NEXTAUTH_URL` | Production | Canonical URL, `https://celpipwritingpractice.com` |
| `NEXTAUTH_SECRET` | Yes | Long random secret used to sign authentication tokens |
| `GROQ_API_KEY` | Yes | Groq API key for writing evaluation |
| `GOOGLE_CLIENT_ID` | No | Enables Google sign-in when paired with `GOOGLE_CLIENT_SECRET` |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `SMTP_USER` | Production email | Gmail address used to send password-reset messages |
| `SMTP_PASSWORD` | Production email | Gmail app password |

Generate an auth secret with `openssl rand -base64 32`. Google OAuth callbacks use `{NEXTAUTH_URL}/api/auth/callback/google`. When Google credentials are absent, the provider and its UI are disabled automatically.

## Deploy to Vercel and Neon

1. Import the GitHub repository into a Vercel Hobby project with the Next.js preset.
2. Use Node.js 20, `npm run build`, and the repository root as the project root.
3. Provision Neon through the Vercel Marketplace in AWS US West (Oregon).
4. Connect the Neon production branch to Vercel Production. The native integration injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.
5. Scope `NEXTAUTH_URL`, production `NEXTAUTH_SECRET`, SMTP, and Google OAuth credentials to Production. Use a different auth secret and a sanitized `preview-base` Neon branch for Preview deployments.
6. Configure Google OAuth with these production callbacks during validation:
   - `https://celpipwritingpractice.com/api/auth/callback/google`
   - `https://<vercel-production-url>/api/auth/callback/google`
7. Deploy and smoke-test the Vercel URL before moving the custom domain.

Vercel functions run in Portland (`pdx1`). The AI evaluation route allows the Hobby-plan maximum of 60 seconds. No database keep-alive cron is required.

For the production data transfer, verification queries, domain cutover, and rollback procedure, follow [docs/vercel-migration.md](docs/vercel-migration.md).

## Checks

```bash
npm run lint
npm run build
npx prisma validate
```

## License

Private / use as needed.
