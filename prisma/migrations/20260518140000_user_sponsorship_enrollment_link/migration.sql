-- Drop legacy org-session-only unique constraint
DROP INDEX IF EXISTS "sponsorships_organization_id_session_id_key";

-- Link sponsorship to a sponsored user and enrollment
ALTER TABLE "sponsorships" ADD COLUMN "user_id" TEXT;
ALTER TABLE "sponsorships" ADD COLUMN "enrollment_id" TEXT;

-- Remove rows that cannot be migrated (none expected in dev)
DELETE FROM "sponsorships";

ALTER TABLE "sponsorships" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "sponsorships" ALTER COLUMN "enrollment_id" SET NOT NULL;

ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_enrollment_id_fkey"
  FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "sponsorships_enrollment_id_key" ON "sponsorships"("enrollment_id");
CREATE UNIQUE INDEX "sponsorships_organization_id_user_id_session_id_key"
  ON "sponsorships"("organization_id", "user_id", "session_id");
CREATE INDEX "sponsorships_user_id_idx" ON "sponsorships"("user_id");

ALTER TABLE "sponsorships" ALTER COLUMN "payment_status" SET DEFAULT 'PAID';
