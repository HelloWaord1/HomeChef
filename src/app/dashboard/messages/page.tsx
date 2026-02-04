import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Get all conversation partners
  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: userId },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const partnerIds = [
    ...new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ]),
  ];

  const conversations = await Promise.all(
    partnerIds.map(async (partnerId) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: partnerId },
            { senderId: partnerId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      const unreadCount = await prisma.message.count({
        where: {
          senderId: partnerId,
          receiverId: userId,
          read: false,
        },
      });

      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true, avatar: true, role: true },
      });

      return {
        partner: partner
          ? { ...partner, role: partner.role as string }
          : null,
        lastMessage: lastMessage
          ? {
              ...lastMessage,
              createdAt: lastMessage.createdAt.toISOString(),
            }
          : null,
        unreadCount,
      };
    })
  );

  const sorted = conversations
    .filter((c) => c.partner)
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() -
        new Date(a.lastMessage?.createdAt || 0).getTime()
    );

  return (
    <MessagesClient
      conversations={sorted}
      currentUserId={userId}
    />
  );
}
