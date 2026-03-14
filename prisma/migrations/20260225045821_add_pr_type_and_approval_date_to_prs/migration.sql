/*
  Warnings:

  - You are about to drop the column `task_type` on the `pull_request_reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PullRequestType" AS ENUM ('FEATURE', 'FIX', 'HOTFIX', 'BUGFIX', 'RELEASE', 'CHORE', 'NO_TICKET');

-- DropIndex
DROP INDEX "idx_prr_task_type";

-- AlterTable
ALTER TABLE "pull_request_reviews" DROP COLUMN "task_type";

-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "type" "PullRequestType" NOT NULL DEFAULT 'NO_TICKET';

-- DropEnum
DROP TYPE "TaskType";

-- CreateIndex
CREATE INDEX "pull_requests_type_idx" ON "pull_requests"("type");

-- RenameIndex
ALTER INDEX "idx_prr_pull_request_id" RENAME TO "pull_request_reviews_pull_request_id_idx";

-- RenameIndex
ALTER INDEX "idx_prr_reviewer_id" RENAME TO "pull_request_reviews_reviewer_id_idx";

-- RenameIndex
ALTER INDEX "idx_pr_created_at" RENAME TO "pull_requests_created_at_idx";

-- RenameIndex
ALTER INDEX "idx_pr_creator_id" RENAME TO "pull_requests_creator_id_idx";

-- RenameIndex
ALTER INDEX "idx_pr_repository_id" RENAME TO "pull_requests_repository_id_idx";

-- RenameIndex
ALTER INDEX "uq_pr_repo" RENAME TO "pull_requests_number_repository_id_key";
