/*
  Warnings:

  - You are about to drop the column `city` on the `Application` table. All the data in the column will be lost.
  - Added the required column `location` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "city",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "resumeUrl" TEXT;
