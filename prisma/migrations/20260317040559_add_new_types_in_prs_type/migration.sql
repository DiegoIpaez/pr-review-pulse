/*
  Warnings:

  - The values [BUGFIX] on the enum `PullRequestType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PullRequestType_new" AS ENUM ('FEATURE', 'FIX', 'HOTFIX', 'REFACTOR', 'DOCS', 'TEST', 'RELEASE', 'CHORE', 'NO_TICKET');
ALTER TABLE "public"."pull_requests" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "pull_requests" ALTER COLUMN "type" TYPE "PullRequestType_new" USING ("type"::text::"PullRequestType_new");
ALTER TYPE "PullRequestType" RENAME TO "PullRequestType_old";
ALTER TYPE "PullRequestType_new" RENAME TO "PullRequestType";
DROP TYPE "public"."PullRequestType_old";
ALTER TABLE "pull_requests" ALTER COLUMN "type" SET DEFAULT 'NO_TICKET';
COMMIT;
