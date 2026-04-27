-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('feature', 'fix', 'hotfix', 'bugfix', 'release');

-- CreateTable
CREATE TABLE "repositories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pull_requests" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "repository_id" INTEGER NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "inserted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pull_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pull_request_reviews" (
    "id" SERIAL NOT NULL,
    "pull_request_id" INTEGER NOT NULL,
    "task_type" "TaskType",
    "reviewer_id" INTEGER,
    "note" TEXT,
    "approved_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "inserted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pull_request_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repositories_name_key" ON "repositories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_pr_repository_id" ON "pull_requests"("repository_id");

-- CreateIndex
CREATE INDEX "idx_pr_creator_id" ON "pull_requests"("creator_id");

-- CreateIndex
CREATE INDEX "idx_pr_created_at" ON "pull_requests"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_pr_repo" ON "pull_requests"("number", "repository_id");

-- CreateIndex
CREATE INDEX "idx_prr_pull_request_id" ON "pull_request_reviews"("pull_request_id");

-- CreateIndex
CREATE INDEX "idx_prr_reviewer_id" ON "pull_request_reviews"("reviewer_id");

-- CreateIndex
CREATE INDEX "idx_prr_task_type" ON "pull_request_reviews"("task_type");

-- AddForeignKey
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pull_request_reviews" ADD CONSTRAINT "pull_request_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pull_request_reviews" ADD CONSTRAINT "pull_request_reviews_pull_request_id_fkey" FOREIGN KEY ("pull_request_id") REFERENCES "pull_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
