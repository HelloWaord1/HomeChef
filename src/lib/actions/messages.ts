"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "./notifications";

export async function sendMessage(data: {
  receiverId: string;
  content: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to send messages" };
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId: data.receiverId,
      content: data.content,
    },
  });

  // Create notification for the receiver
  try {
    const senderName = session.user?.name || "Someone";
    const preview = data.content.length > 60 ? data.content.substring(0, 60) + "..." : data.content;
    await createNotification({
      userId: data.receiverId,
      type: "MESSAGE_NEW",
      title: "New Message",
      message: `${senderName}: ${preview}`,
      linkUrl: `/dashboard/messages/${session.user.id}`,
    });
  } catch {
    // Don't fail message send if notification fails
  }

  return { success: true, messageId: message.id };
}

export async function getConversation(otherUserId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    },
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: session.user.id,
      read: false,
    },
    data: { read: true },
  });

  return messages;
}

export async function getConversations() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  // Get latest message from each conversation partner
  const sentMessages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const partnerIds = new Set([
    ...sentMessages.map((m) => m.receiverId),
    ...receivedMessages.map((m) => m.senderId),
  ]);

  const conversations = await Promise.all(
    Array.from(partnerIds).map(async (partnerId) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: session.user!.id, receiverId: partnerId },
            { senderId: partnerId, receiverId: session.user!.id },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      const unreadCount = await prisma.message.count({
        where: {
          senderId: partnerId,
          receiverId: session.user!.id,
          read: false,
        },
      });

      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true, avatar: true },
      });

      return {
        partner,
        lastMessage,
        unreadCount,
      };
    })
  );

  return conversations.sort(
    (a, b) =>
      (b.lastMessage?.createdAt.getTime() ?? 0) -
      (a.lastMessage?.createdAt.getTime() ?? 0)
  );
}
