import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChatClient } from "./chat-client";

interface ChatPageProps {
  params: Promise<{ userId: string; locale: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId, locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const currentUserId = session.user.id;

  // Get the conversation partner
  const partner = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, avatar: true, role: true },
  });

  if (!partner) {
    redirect(`/${locale}/dashboard/messages`);
  }

  // Get existing messages
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
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
      senderId: userId,
      receiverId: currentUserId,
      read: false,
    },
    data: { read: true },
  });

  // Serialize dates
  const serializedMessages = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <ChatClient
      partner={{ ...partner, role: partner.role as string }}
      initialMessages={serializedMessages}
      currentUserId={currentUserId}
    />
  );
}
