import { getAdminDishes } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { AdminDishesClient } from "./dishes-client";

export default async function AdminDishesPage() {
  const t = await getTranslations("admin");

  let dishes;
  try {
    dishes = await getAdminDishes();
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const serialized = dishes.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
  }));

  return <AdminDishesClient dishes={serialized} />;
}
