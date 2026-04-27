/*
  Warnings:

  - You are about to drop the column `approved_at` on the `pull_requests` table. All the data in the column will be lost.
  - You are about to drop the column `inserted_at` on the `pull_requests` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `pull_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PullRequestState" AS ENUM ('open', 'closed', 'merged');

-- AlterTable
ALTER TABLE "pull_requests" DROP COLUMN "approved_at",
DROP COLUMN "inserted_at",
ADD COLUMN     "body" VARCHAR(255),
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "merged_at" TIMESTAMP(3),
ADD COLUMN     "state" "PullRequestState" NOT NULL DEFAULT 'open',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
