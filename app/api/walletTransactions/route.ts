import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const walletTransactions = await prisma.walletTransaction.findMany({
      include: { wallet: true },
    });
    return NextResponse.json(walletTransactions);
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        wallet: { connect: { id: body.walletId } },
        amount: body.amount,
        type: body.type,
        description: body.description,
      },
      include: { wallet: true },
    });
    return NextResponse.json(walletTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet transaction:", error);
    return NextResponse.json(
      { error: "Failed to create wallet transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const walletTransaction = await prisma.walletTransaction.update({
      where: { id },
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
      },
      include: { wallet: true },
    });
    return NextResponse.json(walletTransaction);
  } catch (error) {
    console.error("Error updating wallet transaction:", error);
    return NextResponse.json(
      { error: "Failed to update wallet transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.walletTransaction.delete({
      where: { id },
    });
    return NextResponse.json({
      message: "Wallet transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wallet transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete wallet transaction" },
      { status: 500 }
    );
  }
}
