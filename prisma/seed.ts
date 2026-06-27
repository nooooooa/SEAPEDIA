import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const buyerRole = await prisma.role.upsert({
    where: { name: "Buyer" },
    update: {},
    create: { name: "Buyer" },
  });

  const sellerRole = await prisma.role.upsert({
    where: { name: "Seller" },
    update: {},
    create: { name: "Seller" },
  });

  const password = await bcrypt.hash("12345678", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@seapedia.com",
    },
    update: {},
    create: {
      username: "admin",
      email: "admin@seapedia.com",
      password,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  // Buyer
  const buyer = await prisma.user.upsert({
    where: {
      email: "buyer@seapedia.com",
    },
    update: {},
    create: {
      username: "buyer",
      email: "buyer@seapedia.com",
      password,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: buyer.id,
        roleId: buyerRole.id,
      },
    },
    update: {},
    create: {
      userId: buyer.id,
      roleId: buyerRole.id,
    },
  });

  // Seller
  const seller = await prisma.user.upsert({
    where: {
      email: "seller@seapedia.com",
    },
    update: {},
    create: {
      username: "seller",
      email: "seller@seapedia.com",
      password,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: seller.id,
        roleId: sellerRole.id,
      },
    },
    update: {},
    create: {
      userId: seller.id,
      roleId: sellerRole.id,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });