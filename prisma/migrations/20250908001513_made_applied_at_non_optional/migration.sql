/*
  Warnings:

  - Made the column `appliedAt` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Application" ALTER COLUMN "appliedAt" SET NOT NULL;
