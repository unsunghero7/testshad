import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const wallets = await prisma.wallet.findMany({
      include: { customer: true, transactions: true },
    });
    return NextResponse.json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const wallet = await prisma.wallet.create({
      data: {
        customer: { connect: { id: body.customerId } },
        balance: body.balance || 0,
      },
      include: { customer: true, transactions: true },
    });
    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const wallet = await prisma.wallet.update({
      where: { id },
      data: {
        balance: data.balance,
      },
      include: { customer: true, transactions: true },
    });
    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.wallet.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return NextResponse.json(
      { error: "Failed to delete wallet" },
      { status: 500 }
    );
  }
}
