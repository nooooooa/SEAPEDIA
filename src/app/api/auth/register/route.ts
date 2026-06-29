import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      username,
      email,
      password,
      isSeller,
    } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username atau email sudah digunakan",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ambil role sesuai pilihan
    const role = await prisma.role.findUnique({
      where: {
        name: isSeller ? "Seller" : "Buyer",
      },
    });

    if (!role) {
      return NextResponse.json(
        {
          message: "Role tidak ditemukan",
        },
        {
          status: 500,
        }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    return NextResponse.json(
      {
        message: "Register berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
      },
      {
        status: 500,
      }
    );
  }
}