import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  req: Request,
  { params }: Props
) {
  try {

    const session = await auth();

    if (!session?.user?.roles?.includes("Admin")) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const userId = Number(id);

    await prisma.userRole.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully.",
    });

  } catch (err) {

    console.error(err);

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