# Railway to Vercel and Neon migration runbook

This runbook preserves all production records while moving the application to Vercel Hobby and PostgreSQL to Neon. Keep all connection strings in environment variables or a password manager; never commit them.

## 1. Prepare Vercel and Neon

1. Lower the DNS TTL for `celpipwritingpractice.com` and `www` at least 24 hours before cutover.
2. Import the GitHub repository into Vercel and select Node.js 20.
3. Create a Neon project through the Vercel Marketplace in AWS US West (Oregon).
4. Before importing production, create `preview-base` from the empty Neon `main` branch.
5. Apply migrations and seed only `preview-base`:

   ```bash
   DATABASE_URL="$PREVIEW_POOLED_URL" DATABASE_URL_UNPOOLED="$PREVIEW_DIRECT_URL" npm run db:migrate
   DATABASE_URL="$PREVIEW_POOLED_URL" DATABASE_URL_UNPOOLED="$PREVIEW_DIRECT_URL" npm run db:seed
   ```

6. Connect `main` to Vercel Production and `preview-base` to Vercel Preview. Do not copy production users or practice sessions into Preview.
7. Configure all environment variables listed in the README. Leave `NEXTAUTH_URL` unset for Preview so Vercel's deployment URL is used, and omit production SMTP and Google credentials from Preview.

## 2. Rehearse the database migration

Create a Railway manual backup first. Obtain Railway's externally reachable PostgreSQL URL and Neon's direct, unpooled URL. Confirm that local `pg_dump` is the same major version as, or newer than, the Railway PostgreSQL server.

```bash
pg_dump \
  --format=custom \
  --verbose \
  --no-owner \
  --no-privileges \
  --dbname="$RAILWAY_DATABASE_URL" \
  --file=railway-rehearsal.dump

pg_restore \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname="$NEON_REHEARSAL_DIRECT_URL" \
  railway-rehearsal.dump
```

Use a disposable Neon rehearsal branch, not `preview-base`. Then verify schema state:

```bash
DATABASE_URL="$NEON_REHEARSAL_POOLED_URL" \
DATABASE_URL_UNPOOLED="$NEON_REHEARSAL_DIRECT_URL" \
npx prisma migrate status
```

Run the record-count query below against both Railway and the rehearsal branch and compare every value:

```sql
SELECT 'User' AS table_name, COUNT(*) FROM "User"
UNION ALL SELECT 'Account', COUNT(*) FROM "Account"
UNION ALL SELECT 'Session', COUNT(*) FROM "Session"
UNION ALL SELECT 'VerificationToken', COUNT(*) FROM "VerificationToken"
UNION ALL SELECT 'ExampleQuestion', COUNT(*) FROM "ExampleQuestion"
UNION ALL SELECT 'PracticeSession', COUNT(*) FROM "PracticeSession"
UNION ALL SELECT '_prisma_migrations', COUNT(*) FROM "_prisma_migrations"
ORDER BY table_name;
```

Deploy Vercel against the rehearsal branch and test signup, credentials login, question loading, AI evaluation, score persistence, dashboard, history, and session detail. Test Google OAuth and password-reset delivery from the production-scoped deployment.

## 3. Perform the production cutover

1. Announce the brief maintenance window.
2. Stop or disable the Railway web service so no new database writes can occur. Keep Railway PostgreSQL running.
3. Take and securely retain a final Railway backup:

   ```bash
   pg_dump \
     --format=custom \
     --verbose \
     --no-owner \
     --no-privileges \
     --dbname="$RAILWAY_DATABASE_URL" \
     --file=railway-final.dump
   ```

4. Restore into the clean Neon `main` database:

   ```bash
   pg_restore \
     --verbose \
     --clean \
     --if-exists \
     --no-owner \
     --no-privileges \
     --dbname="$NEON_PRODUCTION_DIRECT_URL" \
     railway-final.dump
   ```

5. Verify and apply any repository migrations. Do not run the seed command:

   ```bash
   DATABASE_URL="$NEON_PRODUCTION_POOLED_URL" DATABASE_URL_UNPOOLED="$NEON_PRODUCTION_DIRECT_URL" npx prisma migrate status
   DATABASE_URL="$NEON_PRODUCTION_POOLED_URL" DATABASE_URL_UNPOOLED="$NEON_PRODUCTION_DIRECT_URL" npm run db:migrate
   ```

6. Compare all table counts between Railway and Neon using the query above. Also inspect several users and historical practice sessions through the application.
7. Promote the verified Vercel deployment and attach `celpipwritingpractice.com` and `www.celpipwritingpractice.com`.
8. Apply the DNS records shown by Vercel, wait for valid HTTPS, and confirm the apex/`www` redirect policy.
9. Verify `/robots.txt`, `/sitemap.xml`, authentication callbacks, password-reset links, and one complete writing evaluation on the custom domain.

## 4. Observe and retire Railway

Monitor Vercel function logs, function duration, Groq failures, Neon connections, and database errors immediately after cutover. Keep the Railway service frozen and its database plus final dump intact for seven days.

Before DNS cutover, rollback by restarting Railway. After Vercel accepts writes, prefer fixing forward. If DNS must return to Railway, freeze Vercel writes first and reconcile any records created in Neon before reopening Railway.

After seven healthy days, take one final Neon backup or snapshot, remove the temporary Google OAuth callback, and delete the Railway app, database, and project.
