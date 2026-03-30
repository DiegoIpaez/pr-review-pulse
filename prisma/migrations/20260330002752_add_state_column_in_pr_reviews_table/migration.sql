/*
  Warnings:

  - You are about to drop the column `inserted_at` on the `pull_request_reviews` table. All the data in the column will be lost.
  - Added the required column `state` to the `pull_request_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GitHubReviewState" AS ENUM ('approved', 'changes_requested', 'commented', 'dismissed');

-- AlterTable
ALTER TABLE "pull_request_reviews" DROP COLUMN "inserted_at",
ADD COLUMN     "state" "GitHubReviewState" NOT NULL;

-- RenameColumn
ALTER TABLE "pull_request_reviews"
RENAME COLUMN "note" TO "body";

-- RenameColumn
ALTER TABLE "pull_request_reviews"
RENAME COLUMN "reviewed_at" TO "submitted_at";

-- RenameEnum
ALTER TYPE "PullRequestType" RENAME VALUE 'FEATURE' TO 'feature';
ALTER TYPE "PullRequestType" RENAME VALUE 'FIX' TO 'fix';
ALTER TYPE "PullRequestType" RENAME VALUE 'HOTFIX' TO 'hotfix';
ALTER TYPE "PullRequestType" RENAME VALUE 'REFACTOR' TO 'refactor';
ALTER TYPE "PullRequestType" RENAME VALUE 'DOCS' TO 'docs';
ALTER TYPE "PullRequestType" RENAME VALUE 'TEST' TO 'test';
ALTER TYPE "PullRequestType" RENAME VALUE 'RELEASE' TO 'release';
ALTER TYPE "PullRequestType" RENAME VALUE 'CHORE' TO 'chore';
ALTER TYPE "PullRequestType" RENAME VALUE 'NO_TICKET' TO 'no_ticket';
