-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SELF', 'SPONSORED');

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN "payment_type" "PaymentType" NOT NULL DEFAULT 'SELF';
