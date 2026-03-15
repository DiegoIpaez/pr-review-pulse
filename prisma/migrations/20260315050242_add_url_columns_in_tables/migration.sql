-- AlterTable
ALTER TABLE "pull_request_reviews" ADD COLUMN     "url" VARCHAR(255);

-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "url" VARCHAR(255);

-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "url" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" VARCHAR(255),
ADD COLUMN     "url" VARCHAR(255);
