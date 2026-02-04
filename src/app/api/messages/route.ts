import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages?partnerId=xxx&after=ISO_DATE
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const partnerId = searchParams.get("partnerId");
  const after = searchParams.get("after");

  if (!partnerId) {
    return NextResponse.json({ error: "partnerId required" }, { status: 400 });
  }

  const userId = session.user.id;

  const where: Record<string, unknown> = {
    OR: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId },
    ],
  };

  if (after) {
    where.createdAt = { gt: new Date(after) };
  }

  const messages = await prisma.message.findMany({
    where: where as never,
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark unread messages from partner as read
  await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      receiverId: userId,
      read: false,
    },
    data: { read: true },
  });

  return NextResponse.json(messages);
}

// POST /api/messages
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { receiverId, content } = body;

  if (!receiverId || !content?.trim()) {
    return NextResponse.json(
      { error: "receiverId and content required" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content: content.trim(),
    },
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  return NextResponse.json(message);
}
