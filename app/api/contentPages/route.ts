import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const contentPages = await prisma.contentPage.findMany();
    return NextResponse.json(contentPages);
  } catch (error) {
    console.error("Error fetching content pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch content pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contentPage = await prisma.contentPage.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        isPublished: body.isPublished || true,
      },
    });
    return NextResponse.json(contentPage, { status: 201 });
  } catch (error) {
    console.error("Error creating content page:", error);
    return NextResponse.json(
      { error: "Failed to create content page" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const contentPage = await prisma.contentPage.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        isPublished: data.isPublished,
      },
    });
    return NextResponse.json(contentPage);
  } catch (error) {
    console.error("Error updating content page:", error);
    return NextResponse.json(
      { error: "Failed to update content page" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.contentPage.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Content page deleted successfully" });
  } catch (error) {
    console.error("Error deleting content page:", error);
    return NextResponse.json(
      { error: "Failed to delete content page" },
      { status: 500 }
    );
  }
}
