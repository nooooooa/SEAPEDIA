/*
  Warnings:

  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `address` TEXT NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `province` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiverName` VARCHAR(191) NOT NULL;
