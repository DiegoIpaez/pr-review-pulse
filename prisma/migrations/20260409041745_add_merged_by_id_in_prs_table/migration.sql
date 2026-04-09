-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "merged_by_id" INTEGER;

-- CreateIndex
CREATE INDEX "pull_requests_merged_by_id_idx" ON "pull_requests"("merged_by_id");

-- AddForeignKey
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_merged_by_id_fkey" FOREIGN KEY ("merged_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
