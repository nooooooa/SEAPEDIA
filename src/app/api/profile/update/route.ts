import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      username,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    } = await req.json();

    if (!username || !email || !currentPassword) {
      return NextResponse.json(
        {
          message:
            "Username, email, and current password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          message: "Current password is incorrect.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
        NOT: {
          id: user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username or email is already in use.",
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          {
            message:
              "New password must be at least 8 characters.",
          },
          {
            status: 400,
          }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          {
            message: "Passwords do not match.",
          },
          {
            status: 400,
          }
        );
      }
    }

    let hashedPassword = user.password;

    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}