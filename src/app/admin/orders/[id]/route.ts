import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props={
  params:Promise<{
    id:string;
  }>
}

export async function PATCH(
  req:Request,
  {params}:Props
){

  const session=await auth();

  if(!session?.user?.roles?.includes("Admin")){
    return NextResponse.json(
      {message:"Unauthorized"},
      {status:401}
    );
  }

  const {status}=await req.json();

  const {id}=await params;

  await prisma.order.update({

    where:{
      id:Number(id),
    },

    data:{
      status,
    },

  });

  return NextResponse.json({
    message:"Status Updated",
  });

}