-- CreateTable
CREATE TABLE "daily_reports" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_report_pr_details" (
    "id" SERIAL NOT NULL,
    "daily_report_id" INTEGER NOT NULL,
    "pull_request_id" INTEGER NOT NULL,
    "repository_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "state" "PullRequestState" NOT NULL,
    "labels" JSONB,
    "created" BOOLEAN NOT NULL DEFAULT false,
    "merged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_report_pr_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_report_review_details" (
    "id" SERIAL NOT NULL,
    "daily_report_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "pull_request_id" INTEGER NOT NULL,
    "repository_id" INTEGER NOT NULL,
    "pr_title" VARCHAR(255),
    "state" "GitHubReviewState" NOT NULL,
    "labels" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_report_review_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_reports_user_id_date_key" ON "daily_reports"("user_id", "date");

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_pr_details" ADD CONSTRAINT "daily_report_pr_details_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_pr_details" ADD CONSTRAINT "daily_report_pr_details_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "daily_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_pr_details" ADD CONSTRAINT "daily_report_pr_details_pull_request_id_fkey" FOREIGN KEY ("pull_request_id") REFERENCES "pull_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_review_details" ADD CONSTRAINT "daily_report_review_details_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "pull_request_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_review_details" ADD CONSTRAINT "daily_report_review_details_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_review_details" ADD CONSTRAINT "daily_report_review_details_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "daily_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report_review_details" ADD CONSTRAINT "daily_report_review_details_pull_request_id_fkey" FOREIGN KEY ("pull_request_id") REFERENCES "pull_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
