/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Product_title_key` ON `Product`;

-- AlterTable
ALTER TABLE `Product` MODIFY `title` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_title_key` ON `Product`(`title`(255));
