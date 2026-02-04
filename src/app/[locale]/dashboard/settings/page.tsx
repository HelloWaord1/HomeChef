import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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
    },
  });

  if (!user) redirect("/login");

  return (
    <SettingsClient
      user={{
        ...user,
        role: user.role as string,
        bio: user.bio || "",
        phone: user.phone || "",
        location: user.location || "",
        avatar: user.avatar || "",
        pricePerHour: user.pricePerHour || 0,
      }}
    />
  );
}
