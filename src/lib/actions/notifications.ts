"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      linkUrl: data.linkUrl || null,
    },
  });

  return notification;
}

export async function getNotifications() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications;
}

export async function getUnreadNotificationCount() {
  const session = await auth();

  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  return count;
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: { read: true },
  });

  return { success: true };
}
