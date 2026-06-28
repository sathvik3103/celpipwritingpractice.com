-- The baseline migration already contains this column. Keep this historical
-- migration safe for both baselined databases and clean installations.
ALTER TABLE "PracticeSession" ADD COLUMN IF NOT EXISTS "timeTakenSeconds" INTEGER;
