-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "fork" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner_id" INTEGER,
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushed_at" TIMESTAMP(3),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
