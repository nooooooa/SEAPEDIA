import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("Old data deleted");

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
    },
  });

  const sellerRole = await prisma.role.create({
    data: {
      name: "Seller",
    },
  });

  const buyerRole = await prisma.role.create({
    data: {
      name: "Buyer",
    },
  });

  console.log("Roles created");

  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@seapedia.com",
      password,
      fullName: "System Administrator",
      phone: "081111111111",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      address: "Jl. Sudirman No.1",
      postalCode: "12190",
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      username: "seller1",
      email: "seller1@seapedia.com",
      password,
      fullName: "Tech Store",
      phone: "082222222222",
      province: "DKI Jakarta",
      city: "Jakarta Barat",
      address: "Jl. Mangga Besar",
      postalCode: "11180",
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      username: "seller2",
      email: "seller2@seapedia.com",
      password,
      fullName: "Gaming Center",
      phone: "083333333333",
      province: "Jawa Barat",
      city: "Bandung",
      address: "Jl. Asia Afrika",
      postalCode: "40111",
    },
  });

  const buyer1 = await prisma.user.create({
    data: {
      username: "buyer1",
      email: "buyer1@seapedia.com",
      password,
      fullName: "Budi Santoso",
      phone: "081234567891",
      province: "Jawa Timur",
      city: "Surabaya",
      address: "Jl. Pemuda",
      postalCode: "60271",
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      username: "buyer2",
      email: "buyer2@seapedia.com",
      password,
      fullName: "Andi Wijaya",
      phone: "081234567892",
      province: "Jawa Tengah",
      city: "Semarang",
      address: "Jl. Pandanaran",
      postalCode: "50134",
    },
  });

  const buyer3 = await prisma.user.create({
    data: {
      username: "buyer3",
      email: "buyer3@seapedia.com",
      password,
      fullName: "Cindy Natalia",
      phone: "081234567893",
      province: "DI Yogyakarta",
      city: "Yogyakarta",
      address: "Jl. Malioboro",
      postalCode: "55271",
    },
  });

  const buyer4 = await prisma.user.create({
    data: {
      username: "buyer4",
      email: "buyer4@seapedia.com",
      password,
      fullName: "Kevin Tan",
      phone: "081234567894",
      province: "Banten",
      city: "Tangerang",
      address: "Jl. BSD Raya",
      postalCode: "15345",
    },
  });

  const buyer5 = await prisma.user.create({
    data: {
      username: "buyer5",
      email: "buyer5@seapedia.com",
      password,
      fullName: "Michelle Lim",
      phone: "081234567895",
      province: "Bali",
      city: "Denpasar",
      address: "Jl. Teuku Umar",
      postalCode: "80113",
    },
  });

  console.log("Users created");

  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: adminRole.id },
      { userId: seller1.id, roleId: sellerRole.id },
      { userId: seller2.id, roleId: sellerRole.id },
      { userId: buyer1.id, roleId: buyerRole.id },
      { userId: buyer2.id, roleId: buyerRole.id },
      { userId: buyer3.id, roleId: buyerRole.id },
      { userId: buyer4.id, roleId: buyerRole.id },
      { userId: buyer5.id, roleId: buyerRole.id },
    ],
  });

  console.log("User roles created");

  await prisma.product.createMany({
    data: [
      {
        name: "Mechanical Keyboard RK84",
        description: "75% Mechanical Keyboard RGB Hot Swap.",
        price: 899000,
        stock: 35,
        image: "/products/keyboard.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Gaming Mouse Logitech G304",
        description: "Wireless Gaming Mouse HERO Sensor.",
        price: 429000,
        stock: 50,
        image: "/products/mouse.jpg",
        sellerId: seller1.id,
      },
      {
        name: "USB Hub 4 Port",
        description: "USB 3.0 High Speed Hub.",
        price: 149000,
        stock: 80,
        image: "/products/hub.jpg",
        sellerId: seller1.id,
      },
      {
        name: "SSD Samsung 990 EVO 1TB",
        description: "NVMe SSD Gen4.",
        price: 1699000,
        stock: 20,
        image: "/products/ssd.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Corsair DDR5 32GB",
        description: "DDR5 6000MHz RAM.",
        price: 1899000,
        stock: 18,
        image: "/products/ram.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Logitech C920 Webcam",
        description: "Full HD Webcam.",
        price: 1099000,
        stock: 25,
        image: "/products/webcam.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Laptop Stand Aluminum",
        description: "Adjustable Aluminum Stand.",
        price: 249000,
        stock: 40,
        image: "/products/stand.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Bluetooth Speaker JBL",
        description: "Portable Speaker.",
        price: 799000,
        stock: 22,
        image: "/products/speaker.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Power Bank 20000mAh",
        description: "Fast Charging Power Bank.",
        price: 499000,
        stock: 35,
        image: "/products/powerbank.jpg",
        sellerId: seller1.id,
      },
      {
        name: "HDMI Cable 2 Meter",
        description: "HDMI 2.1 Cable.",
        price: 89000,
        stock: 100,
        image: "/products/hdmi.jpg",
        sellerId: seller1.id,
      },
      {
        name: "Gaming Headset HyperX",
        description: "7.1 Surround Gaming Headset.",
        price: 999000,
        stock: 20,
        image: "/products/headset.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Blue Yeti Microphone",
        description: "USB Condenser Microphone.",
        price: 1999000,
        stock: 12,
        image: "/products/mic.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Cooling Pad Laptop",
        description: "5 Fan Cooling Pad.",
        price: 289000,
        stock: 28,
        image: "/products/coolingpad.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Mouse Pad XL",
        description: "Large Gaming Mouse Pad.",
        price: 99000,
        stock: 60,
        image: "/products/mousepad.jpg",
        sellerId: seller2.id,
      },
      {
        name: "24 Inch IPS Monitor",
        description: "Full HD IPS Monitor.",
        price: 2299000,
        stock: 15,
        image: "/products/monitor.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Flashdisk 128GB",
        description: "USB 3.2 Flashdisk.",
        price: 179000,
        stock: 70,
        image: "/products/flashdisk.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Laptop Backpack",
        description: "Water Resistant Backpack.",
        price: 349000,
        stock: 30,
        image: "/products/backpack.jpg",
        sellerId: seller2.id,
      },
      {
        name: "Wireless Charger",
        description: "15W Fast Wireless Charger.",
        price: 259000,
        stock: 40,
        image: "/products/charger.jpg",
        sellerId: seller2.id,
      },
      {
        name: "External HDD 2TB",
        description: "Portable Hard Drive.",
        price: 1499000,
        stock: 16,
        image: "/products/hdd.jpg",
        sellerId: seller2.id,
      },
      {
        name: "WiFi 6 Router",
        description: "Dual Band WiFi 6 Router.",
        price: 899000,
        stock: 18,
        image: "/products/router.jpg",
        sellerId: seller2.id,
      },
    ],
  });

  console.log("Products created");

  const allProducts = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  const buyers = [buyer1, buyer2, buyer3, buyer4, buyer5];

  const comments = [
    "Excellent product!",
    "Very recommended.",
    "Packaging was neat.",
    "Works perfectly.",
    "Good quality.",
    "Fast shipping.",
    "Worth the price.",
    "Exactly as described.",
    "Five stars!",
    "Satisfied with my purchase.",
  ];

  for (let i = 0; i < 30; i++) {
    const buyer = buyers[i % buyers.length];

    await prisma.review
      .create({
        data: {
          userId: buyer.id,
          productId: allProducts[i % allProducts.length].id,
          rating: 4 + (i % 2),
          comment: comments[i % comments.length],
        },
      })
      .catch(() => {});
  }

  console.log("Reviews created");

  for (const buyer of buyers) {
    const cart = await prisma.cart.create({
      data: {
        userId: buyer.id,
      },
    });

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: allProducts[buyer.id % allProducts.length].id,
        quantity: 1,
      },
    });

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: allProducts[(buyer.id + 5) % allProducts.length].id,
        quantity: 2,
      },
    });
  }

  console.log("Carts created");
  console.log("Seed Finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });