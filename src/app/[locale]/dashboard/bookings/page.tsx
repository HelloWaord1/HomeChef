import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookingsClient } from "./bookings-client";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const role = (session.user as { role?: string }).role || "CUSTOMER";

  const bookings = await prisma.booking.findMany({
    where:
      role === "COOK"
        ? { cookId: userId }
        : { customerId: userId },
    include: {
      customer: {
        select: { id: true, name: true, avatar: true, email: true },
      },
      cook: {
        select: { id: true, name: true, avatar: true, email: true },
      },
      dish: {
        select: { id: true, name: true, price: true, image: true },
      },
      event: {
        select: { id: true, title: true, date: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = bookings.map((b) => ({
    ...b,
    date: b.date.toISOString(),
    createdAt: b.createdAt.toISOString(),
    event: b.event
      ? { ...b.event, date: b.event.date.toISOString() }
      : null,
  }));

  return <BookingsClient bookings={serialized} role={role} />;
}
