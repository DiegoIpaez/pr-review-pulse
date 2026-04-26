-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "title" VARCHAR(255),
ALTER COLUMN "body" SET DATA TYPE TEXT;
