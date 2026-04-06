/*
  Warnings:

  - Made the column `github_id` on table `pull_request_reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `github_id` on table `pull_requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `github_id` on table `repositories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `github_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pull_request_reviews" ALTER COLUMN "github_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "pull_requests" ALTER COLUMN "github_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "repositories" ALTER COLUMN "github_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" VARCHAR(255),
ALTER COLUMN "github_id" SET NOT NULL;
