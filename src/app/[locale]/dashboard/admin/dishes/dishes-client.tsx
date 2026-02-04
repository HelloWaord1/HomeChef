"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleDishVisibility, adminDeleteDish } from "@/lib/actions/admin";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  Search,
  Eye,
  EyeOff,
  Trash2,
  ChefHat,
  DollarSign,
} from "lucide-react";

type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  cuisine: string;
  category: string;
  image: string | null;
  available: boolean;
  createdAt: string;
  cook: { name: string | null; avatar: string | null };
};

export function AdminDishesClient({ dishes }: { dishes: Dish[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = dishes.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.cuisine.toLowerCase().includes(search.toLowerCase()) ||
      d.cook.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (dishId: string) => {
    startTransition(async () => {
      try {
        const result = await toggleDishVisibility(dishId);
        toast.success(result.available ? t("dishVisible") : t("dishHidden"));
        router.refresh();
      } catch {
        toast.error(t("actionFailed"));
      }
    });
  };

  const handleDelete = async (dishId: string, name: string) => {
    if (!confirm(`${t("confirmDelete")} "${name}"?`)) return;
    startTransition(async () => {
      try {
        await adminDeleteDish(dishId);
        toast.success(t("dishDeleted"));
        router.refresh();
      } catch {
        toast.error(t("actionFailed"));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("dishesTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("dishesSubtitle")}</p>
      </div>

      {/* Search */}
      <Card className="border-stone-100">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder={t("searchDishes")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dishes Table */}
      <Card className="border-stone-100">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-stone-400" />
            {t("allDishes")} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("dish")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden md:table-cell">{t("cook")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider hidden sm:table-cell">{t("cuisine")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("price")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("status")}</th>
                  <th className="text-left py-2 text-xs font-medium text-stone-500 uppercase tracking-wider">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dish) => (
                  <tr key={dish.id} className="border-b border-stone-50 hover:bg-stone-25">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {dish.image ? (
                          <img src={dish.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                            <UtensilsCrossed className="w-4 h-4 text-stone-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-stone-900">{dish.name}</p>
                          <p className="text-xs text-stone-400">{dish.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {dish.cook.avatar ? (
                          <img src={dish.cook.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center">
                            <ChefHat className="w-3 h-3 text-warm-600" />
                          </div>
                        )}
                        <span className="text-stone-600">{dish.cook.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-stone-500 hidden sm:table-cell">
                      <Badge className="bg-stone-100 text-stone-600 text-xs">{dish.cuisine}</Badge>
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 font-semibold text-stone-900">
                        <DollarSign className="w-3 h-3" />
                        {dish.price}
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge className={`text-xs ${dish.available ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                        {dish.available ? t("visible") : t("hiddenStatus")}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs rounded-lg h-7"
                          onClick={() => handleToggle(dish.id)}
                          disabled={isPending}
                        >
                          {dish.available ? (
                            <><EyeOff className="w-3 h-3 mr-1" />{t("hide")}</>
                          ) : (
                            <><Eye className="w-3 h-3 mr-1" />{t("show")}</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs rounded-lg h-7 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(dish.id, dish.name)}
                          disabled={isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400">{t("noDishesFound")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
