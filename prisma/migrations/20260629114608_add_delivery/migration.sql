-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_userId_fkey`;

-- DropIndex
DROP INDEX `order_userId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` ALTER COLUMN `shippingFee` DROP DEFAULT,
    ALTER COLUMN `subtotal` DROP DEFAULT;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `driverId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Waiting Driver',
    `earning` DOUBLE NOT NULL DEFAULT 0,
    `acceptedAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `delivery_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
