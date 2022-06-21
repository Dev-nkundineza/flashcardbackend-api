-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_userId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
