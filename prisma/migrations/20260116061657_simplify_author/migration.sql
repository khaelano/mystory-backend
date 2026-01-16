/*
  Warnings:

  - You are about to drop the column `authorId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorName` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_authorId_fkey";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "authorId",
ADD COLUMN     "authorName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Author";
