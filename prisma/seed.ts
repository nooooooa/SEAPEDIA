import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  console.log("🧹 Cleaning database...");

  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("✅ Database cleaned.");

  // =========================
  // PASSWORD
  // =========================

  const password = await bcrypt.hash("admin123", 10);

  // =========================
  // ROLES
  // =========================

  console.log("📌 Creating roles...");

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
    },
  });

  const buyerRole = await prisma.role.create({
    data: {
      name: "Buyer",
    },
  });

  const sellerRole = await prisma.role.create({
    data: {
      name: "Seller",
    },
  });

  const driverRole = await prisma.role.create({
    data: {
      name: "Driver",
    },
  });

  // =========================
  // HELPER
  // =========================

  async function createUser(data: {
    username: string;
    email: string;
    roleId: number;

    fullName: string;
    phone: string;

    province: string;
    city: string;
    address: string;
    postalCode: string;

    wallet: number;
  }) {

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password,

        fullName: data.fullName,
        phone: data.phone,

        province: data.province,
        city: data.city,
        address: data.address,
        postalCode: data.postalCode,

        wallet: data.wallet,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: data.roleId,
      },
    });

    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    return user;
  }

  // =========================
  // USERS
  // =========================

  console.log("👤 Creating users...");

  const admin = await createUser({
    username: "admin",
    email: "admin@seapedia.com",
    roleId: adminRole.id,

    fullName: "System Administrator",
    phone: "081111111111",

    province: "DKI Jakarta",
    city: "Jakarta",
    address: "Admin Office",
    postalCode: "10110",

    wallet: 0,
  });

  const buyer1 = await createUser({
    username: "buyer1",
    email: "buyer1@seapedia.com",
    roleId: buyerRole.id,

    fullName: "Nicholas Kenneth",
    phone: "081222222222",

    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    address: "Jl. Melati No.1",
    postalCode: "12120",

    wallet: 5000000,
  });

  const buyer2 = await createUser({
    username: "buyer2",
    email: "buyer2@seapedia.com",
    roleId: buyerRole.id,

    fullName: "Michael Jonathan",
    phone: "081333333333",

    province: "Banten",
    city: "Tangerang",
    address: "Jl. Mawar No.8",
    postalCode: "15111",

    wallet: 3000000,
  });

  const seller1 = await createUser({
    username: "seller1",
    email: "seller1@seapedia.com",
    roleId: sellerRole.id,

    fullName: "Tech Store",
    phone: "081444444444",

    province: "DKI Jakarta",
    city: "Jakarta Barat",
    address: "Tech Store Building",
    postalCode: "11510",

    wallet: 0,
  });

  const seller2 = await createUser({
    username: "seller2",
    email: "seller2@seapedia.com",
    roleId: sellerRole.id,

    fullName: "Gaming Store",
    phone: "081555555555",

    province: "Jawa Barat",
    city: "Bandung",
    address: "Gaming Store Center",
    postalCode: "40111",

    wallet: 0,
  });

  const driver = await createUser({
    username: "driver",
    email: "driver@seapedia.com",
    roleId: driverRole.id,

    fullName: "Delivery Driver",
    phone: "081666666666",

    province: "DKI Jakarta",
    city: "Jakarta Timur",
    address: "Driver House",
    postalCode: "13420",

    wallet: 0,
  });

  console.log("✅ Users created.");

  // ============================================
  // PART 2 STARTS HERE
  // Products + Reviews
  // ============================================
    // =========================
  // PRODUCTS
  // =========================

  console.log("📦 Creating products...");

  async function createProduct(data: {
    sellerId: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  }) {
    return prisma.product.create({
      data,
    });
  }

  // Seller 1
  const keyboard = await createProduct({
    sellerId: seller1.id,
    name: "Mechanical Keyboard",
    description: "RGB Mechanical Gaming Keyboard",
    price: 850000,
    stock: 25,
    image: "/products/keyboard.jpg",
  });

  const mouse = await createProduct({
    sellerId: seller1.id,
    name: "Logitech G Pro Mouse",
    description: "Professional Wireless Gaming Mouse",
    price: 1200000,
    stock: 20,
    image: "/products/mouse.jpg",
  });

  const ssd = await createProduct({
    sellerId: seller1.id,
    name: "Samsung SSD 1TB",
    description: "Fast NVMe SSD Storage",
    price: 1750000,
    stock: 15,
    image: "/products/ssd.jpg",
  });

  const ram = await createProduct({
    sellerId: seller1.id,
    name: "Corsair DDR5 32GB",
    description: "High Performance Gaming RAM",
    price: 2200000,
    stock: 12,
    image: "/products/ram.jpg",
  });

  const webcam = await createProduct({
    sellerId: seller1.id,
    name: "Logitech HD Webcam",
    description: "1080P USB Webcam",
    price: 650000,
    stock: 18,
    image: "/products/webcam.jpg",
  });

  // Seller 2
  const monitor = await createProduct({
    sellerId: seller2.id,
    name: "ASUS Gaming Monitor",
    description: "27 Inch 165Hz IPS Monitor",
    price: 3500000,
    stock: 10,
    image: "/products/monitor.jpg",
  });

  const headset = await createProduct({
    sellerId: seller2.id,
    name: "HyperX Cloud II",
    description: "Gaming Headset 7.1 Surround",
    price: 1200000,
    stock: 15,
    image: "/products/headset.jpg",
  });

  const mic = await createProduct({
    sellerId: seller2.id,
    name: "Blue Yeti Microphone",
    description: "USB Streaming Microphone",
    price: 2100000,
    stock: 8,
    image: "/products/mic.jpg",
  });

  const chair = await createProduct({
    sellerId: seller2.id,
    name: "Gaming Chair",
    description: "Ergonomic Gaming Chair",
    price: 2800000,
    stock: 7,
    image: "/products/chair.jpg",
  });

  const router = await createProduct({
    sellerId: seller2.id,
    name: "TP-Link WiFi Router",
    description: "Dual Band WiFi 6 Router",
    price: 900000,
    stock: 20,
    image: "/products/router.jpg",
  });

  console.log("✅ Products created.");

  // =========================
  // REVIEWS
  // =========================

  console.log("⭐ Creating reviews...");

  await prisma.review.createMany({
    data: [
      {
        userId: buyer1.id,
        productId: keyboard.id,
        rating: 5,
        comment: "Excellent keyboard, very comfortable.",
      },
      {
        userId: buyer1.id,
        productId: mouse.id,
        rating: 4,
        comment: "Smooth and responsive.",
      },
      {
        userId: buyer2.id,
        productId: monitor.id,
        rating: 5,
        comment: "Amazing display quality.",
      },
      {
        userId: buyer2.id,
        productId: headset.id,
        rating: 4,
        comment: "Comfortable for long gaming sessions.",
      },
    ],
  });

  console.log("✅ Reviews created.");

  // ============================================
  // PART 3 STARTS HERE
  // Orders + OrderItems + Delivery
  // ============================================
    // =========================
  // ORDERS
  // =========================

  console.log("🛒 Creating orders...");

  async function createOrder(data: {
    buyer: typeof buyer1;
    product: typeof keyboard;
    quantity: number;
    status: string;
    driverAssigned: boolean;
    delivered: boolean;
  }) {

    const subtotal = data.product.price * data.quantity;
    const shippingFee = subtotal >= 500000 ? 0 : 20000;
    const total = subtotal + shippingFee;

    const order = await prisma.order.create({
      data: {
        userId: data.buyer.id,

        receiverName: data.buyer.fullName!,
        phone: data.buyer.phone!,
        province: data.buyer.province!,
        city: data.buyer.city!,
        address: data.buyer.address!,
        postalCode: data.buyer.postalCode!,

        subtotal,
        shippingFee,
        total,

        status: data.status,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: data.product.id,
        quantity: data.quantity,
        price: data.product.price,
      },
    });

    await prisma.product.update({
      where: {
        id: data.product.id,
      },
      data: {
        stock: {
          decrement: data.quantity,
        },
      },
    });

    if (data.status !== "Pending") {

      await prisma.delivery.create({
        data: {
          orderId: order.id,

          driverId: data.driverAssigned
            ? driver.id
            : null,

          earning: 20000,

          status:
            data.status === "Completed"
              ? "Completed"
              : data.status,

          acceptedAt: data.driverAssigned
            ? new Date()
            : null,

          deliveredAt: data.delivered
            ? new Date()
            : null,
        },
      });

    }

    return order;
  }

  // =========================
  // CREATE ORDERS
  // =========================

  await createOrder({
    buyer: buyer1,
    product: keyboard,
    quantity: 1,
    status: "Completed",
    driverAssigned: true,
    delivered: true,
  });

  await createOrder({
    buyer: buyer1,
    product: monitor,
    quantity: 1,
    status: "On Delivery",
    driverAssigned: true,
    delivered: false,
  });

  await createOrder({
    buyer: buyer2,
    product: headset,
    quantity: 1,
    status: "Waiting Driver",
    driverAssigned: false,
    delivered: false,
  });

  await createOrder({
    buyer: buyer2,
    product: mouse,
    quantity: 2,
    status: "Pending",
    driverAssigned: false,
    delivered: false,
  });

  console.log("✅ Orders created.");

  // =========================
  // UPDATE WALLET DEMO
  // =========================

  await prisma.user.update({
    where: {
      id: buyer1.id,
    },
    data: {
      wallet: 2950000,
    },
  });

  await prisma.user.update({
    where: {
      id: buyer2.id,
    },
    data: {
      wallet: 580000,
    },
  });

  await prisma.user.update({
    where: {
      id: seller1.id,
    },
    data: {
      wallet: 765000,
    },
  });

  await prisma.user.update({
    where: {
      id: seller2.id,
    },
    data: {
      wallet: 3150000,
    },
  });

  await prisma.user.update({
    where: {
      id: driver.id,
    },
    data: {
      wallet: 15000,
    },
  });

    console.log("💰 Wallet updated.");

    console.log("================================");
    console.log("🎉 SEAPEDIA Seed Completed");
    console.log("================================");

    console.log("Admin");
    console.log("admin@seapedia.com");
    console.log("admin123");

    console.log("");

    console.log("Buyer");
    console.log("buyer1@seapedia.com");
    console.log("buyer2@seapedia.com");

    console.log("");

    console.log("Seller");
    console.log("seller1@seapedia.com");
    console.log("seller2@seapedia.com");

    console.log("");

    console.log("Driver");
    console.log("driver@seapedia.com");

    console.log("");

    console.log("Password:");
    console.log("admin123");
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
