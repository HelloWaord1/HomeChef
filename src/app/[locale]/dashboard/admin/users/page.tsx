import { getUsers } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";
import { AdminUsersClient } from "./users-client";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const t = await getTranslations("admin");
  const params = await searchParams;

  let users;
  try {
    users = await getUsers(params.search, params.role);
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{t("notAuthorized")}</p>
      </div>
    );
  }

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return <AdminUsersClient users={serializedUsers} />;
}
