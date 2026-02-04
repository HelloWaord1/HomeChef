import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://freechef.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "ru", "es"];

  // Static routes
  const staticRoutes = [
    "",
    "/cooks",
    "/dishes",
    "/events",
    "/pricing",
    "/about",
    "/for-cooks",
    "/terms",
    "/privacy",
    "/login",
    "/signup",
  ];

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Dynamic cook profiles
  const cooks = await prisma.user.findMany({
    where: { role: "COOK" },
    select: { name: true, updatedAt: true },
  });

  const cookEntries = locales.flatMap((locale) =>
    cooks.map((cook) => {
      const slug = cook.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cook";
      return {
        url: `${BASE_URL}/${locale}/cooks/${slug}`,
        lastModified: cook.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
  );

  // Dynamic events
  const events = await prisma.event.findMany({
    where: { status: { in: ["UPCOMING", "FULL"] } },
    select: { id: true, createdAt: true },
  });

  const eventEntries = locales.flatMap((locale) =>
    events.map((event) => ({
      url: `${BASE_URL}/${locale}/events/${event.id}`,
      lastModified: event.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...cookEntries, ...eventEntries];
}
