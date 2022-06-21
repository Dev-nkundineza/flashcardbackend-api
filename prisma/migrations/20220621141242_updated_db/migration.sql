/*
  Warnings:

  - You are about to drop the column `title` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Flashcard` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_userId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postedById" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
