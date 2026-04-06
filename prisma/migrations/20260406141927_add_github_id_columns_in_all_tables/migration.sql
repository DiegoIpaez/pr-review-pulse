/*
  Warnings:

  - A unique constraint covering the columns `[github_id]` on the table `pull_request_reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[github_id]` on the table `pull_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[github_id]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[github_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pull_request_reviews" ADD COLUMN     "github_id" BIGINT;

-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "github_id" BIGINT;

-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "github_id" BIGINT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "github_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "pull_request_reviews_github_id_key" ON "pull_request_reviews"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "pull_requests_github_id_key" ON "pull_requests"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_github_id_key" ON "repositories"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");
