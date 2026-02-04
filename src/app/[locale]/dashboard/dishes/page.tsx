import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DishesClient } from "./dishes-client";

export default async function DashboardDishesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "COOK") redirect("/dashboard");

  const dishes = await prisma.dish.findMany({
    where: { cookId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = dishes.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
  }));

  return <DishesClient dishes={serialized} />;
}
