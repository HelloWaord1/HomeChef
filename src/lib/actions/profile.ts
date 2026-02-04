"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  cuisines?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  try {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.cuisines !== undefined) updateData.cuisines = data.cuisines;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      phone: true,
      location: true,
      avatar: true,
      role: true,
      cuisines: true,
      pricePerHour: true,
      createdAt: true,
    },
  });

  return user;
}
