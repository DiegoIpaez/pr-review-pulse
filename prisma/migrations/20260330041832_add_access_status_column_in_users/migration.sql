/*
  Warnings:

  - You are about to drop the column `disabled` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserAccessStatus" AS ENUM ('pending', 'active', 'blocked');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "disabled",
ADD COLUMN     "access_status" "UserAccessStatus" NOT NULL DEFAULT 'pending';
