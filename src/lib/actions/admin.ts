"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.role !== "ADMIN") throw new Error("Not authorized");
  return user;
}

// ── Stats ──
export async function getStats() {
  await requireAdmin();

  const [totalUsers, totalCooks, totalCustomers, totalBookings, totalDishes, totalEvents, totalReviews] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "COOK" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.booking.count(),
      prisma.dish.count(),
      prisma.event.count(),
      prisma.review.count(),
    ]);

  const revenueResult = await prisma.booking.aggregate({
    _sum: { total: true },
    where: { status: { in: ["COMPLETED", "CONFIRMED"] } },
  });
  const totalRevenue = revenueResult._sum.total || 0;

  const bookingsByStatus = await prisma.booking.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true, avatar: true },
  });

  // Signups by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const signupsByMonth = await prisma.user.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: { id: true },
  });

  // Top cooks by rating
  const topCooks = await prisma.user.findMany({
    where: { role: "COOK" },
    orderBy: { rating: "desc" },
    take: 5,
    select: { id: true, name: true, avatar: true, rating: true, reviewCount: true, cuisines: true },
  });

  return {
    totalUsers,
    totalCooks,
    totalCustomers,
    totalBookings,
    totalDishes,
    totalEvents,
    totalReviews,
    totalRevenue,
    bookingsByStatus: bookingsByStatus.map((b) => ({
      status: b.status,
      count: b._count.id,
    })),
    recentUsers,
    topCooks,
  };
}

// ── Users ──
export async function getUsers(search?: string, roleFilter?: string) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (roleFilter && roleFilter !== "ALL") {
    where.role = roleFilter;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      verified: true,
      createdAt: true,
      location: true,
      cuisines: true,
      rating: true,
      reviewCount: true,
      _count: {
        select: { bookings: true, cookBookings: true, dishes: true },
      },
    },
  });

  return users;
}

export async function updateUser(
  userId: string,
  data: { verified?: boolean; role?: string }
) {
  await requireAdmin();

  const updateData: Record<string, unknown> = {};
  if (data.verified !== undefined) updateData.verified = data.verified;
  if (data.role) updateData.role = data.role;

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

// ── Dishes ──
export async function getAdminDishes(search?: string) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { cuisine: { contains: search, mode: "insensitive" } },
    ];
  }

  const dishes = await prisma.dish.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      cook: { select: { name: true, avatar: true } },
    },
  });

  return dishes;
}

export async function toggleDishVisibility(dishId: string) {
  await requireAdmin();

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish) throw new Error("Dish not found");

  await prisma.dish.update({
    where: { id: dishId },
    data: { available: !dish.available },
  });

  revalidatePath("/dashboard/admin/dishes");
  return { success: true, available: !dish.available };
}

export async function adminDeleteDish(dishId: string) {
  await requireAdmin();

  // Remove dish references from bookings first
  await prisma.booking.updateMany({
    where: { dishId },
    data: { dishId: null },
  });

  await prisma.dish.delete({ where: { id: dishId } });

  revalidatePath("/dashboard/admin/dishes");
  return { success: true };
}

// ── Events ──
export async function getAdminEvents(search?: string) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { cuisine: { contains: search, mode: "insensitive" } },
    ];
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      host: { select: { name: true, avatar: true } },
      bookings: { select: { id: true, guests: true } },
    },
  });

  return events;
}

export async function cancelEvent(eventId: string) {
  await requireAdmin();

  await prisma.event.update({
    where: { id: eventId },
    data: { status: "CANCELLED" },
  });

  // Cancel associated bookings
  await prisma.booking.updateMany({
    where: { eventId, status: { in: ["PENDING", "CONFIRMED"] } },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard/admin/events");
  return { success: true };
}

// ── Bookings ──
export async function getAdminBookings(statusFilter?: string) {
  await requireAdmin();

  const where: Record<string, unknown> = {};
  if (statusFilter && statusFilter !== "ALL") {
    where.status = statusFilter;
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, avatar: true, email: true } },
      cook: { select: { name: true, avatar: true, email: true } },
      dish: { select: { name: true } },
      event: { select: { title: true } },
    },
  });

  return bookings;
}

// ── Reports ──
export async function getReportsData() {
  await requireAdmin();

  // Signups over time (last 12 months grouped by month)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const allUsers = await prisma.user.findMany({
    where: { createdAt: { gte: twelveMonthsAgo } },
    select: { createdAt: true, role: true },
    orderBy: { createdAt: "asc" },
  });

  const signupsByMonth: Record<string, number> = {};
  allUsers.forEach((u) => {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, "0")}`;
    signupsByMonth[key] = (signupsByMonth[key] || 0) + 1;
  });

  // Bookings by status
  const bookingsByStatus = await prisma.booking.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  // Top cooks by rating
  const topCooks = await prisma.user.findMany({
    where: { role: "COOK" },
    orderBy: { rating: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      avatar: true,
      rating: true,
      reviewCount: true,
      cuisines: true,
      _count: { select: { cookBookings: true } },
    },
  });

  // Revenue by month
  const allBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["COMPLETED", "CONFIRMED"] },
      createdAt: { gte: twelveMonthsAgo },
    },
    select: { createdAt: true, total: true },
  });

  const revenueByMonth: Record<string, number> = {};
  allBookings.forEach((b) => {
    const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, "0")}`;
    revenueByMonth[key] = (revenueByMonth[key] || 0) + b.total;
  });

  return {
    signupsByMonth,
    bookingsByStatus: bookingsByStatus.map((b) => ({
      status: b.status,
      count: b._count.id,
    })),
    topCooks,
    revenueByMonth,
  };
}
