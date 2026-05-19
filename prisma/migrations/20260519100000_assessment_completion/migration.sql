-- Daily activity tracking
CREATE TABLE "daily_video_watches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "activity_date" DATE NOT NULL,
    "watched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_video_watches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "daily_quiz_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "activity_date" DATE NOT NULL,
    "value" INTEGER NOT NULL,
    "max_value" INTEGER NOT NULL DEFAULT 100,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_quiz_attempts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "daily_video_watches_user_id_session_id_activity_date_key" ON "daily_video_watches"("user_id", "session_id", "activity_date");
CREATE UNIQUE INDEX "daily_quiz_attempts_user_id_session_id_activity_date_key" ON "daily_quiz_attempts"("user_id", "session_id", "activity_date");

ALTER TABLE "daily_video_watches" ADD CONSTRAINT "daily_video_watches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_video_watches" ADD CONSTRAINT "daily_video_watches_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_video_watches" ADD CONSTRAINT "daily_video_watches_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "daily_quiz_attempts" ADD CONSTRAINT "daily_quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_quiz_attempts" ADD CONSTRAINT "daily_quiz_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_quiz_attempts" ADD CONSTRAINT "daily_quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enrollment fee
ALTER TABLE "enrollments" ADD COLUMN "amount" DECIMAL(12,2) NOT NULL DEFAULT 100;

-- Scores link to session (historical)
ALTER TABLE "scores" ADD COLUMN "session_id" TEXT;
UPDATE "scores" s SET "session_id" = q."session_id" FROM "quizzes" q WHERE s."quiz_id" = q."id";
ALTER TABLE "scores" ALTER COLUMN "session_id" SET NOT NULL;
ALTER TABLE "scores" ADD CONSTRAINT "scores_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
DROP INDEX IF EXISTS "scores_user_id_quiz_id_key";
CREATE INDEX "scores_user_id_idx" ON "scores"("user_id");
CREATE INDEX "scores_session_id_idx" ON "scores"("session_id");

-- Session dates required for 30-day lifecycle
UPDATE "sessions" SET "starts_at" = COALESCE("starts_at", "created_at"), "ends_at" = COALESCE("ends_at", "created_at" + INTERVAL '30 days') WHERE "starts_at" IS NULL OR "ends_at" IS NULL;
ALTER TABLE "sessions" ALTER COLUMN "starts_at" SET NOT NULL;
ALTER TABLE "sessions" ALTER COLUMN "ends_at" SET NOT NULL;
CREATE INDEX "sessions_ends_at_idx" ON "sessions"("ends_at");
