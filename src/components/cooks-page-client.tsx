"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CookCard } from "@/components/cook-card";
import { Input } from "@/components/ui/input";
import { cuisineTypes, cities } from "@/lib/data";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface CookData {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  coverImage: string;
  bio: string;
  city: string;
  country: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  completedEvents: number;
  priceRange: string;
  verified: boolean;
  available: boolean;
}

interface CooksPageClientProps {
  cooks: CookData[];
}

export function CooksPageClient({ cooks }: CooksPageClientProps) {
  const t = useTranslations("cooks");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCooks = useMemo(() => {
    let result = cooks;
    if (selectedCuisine !== "All") {
      result = result.filter((c) => c.cuisine.includes(selectedCuisine));
    }
    if (selectedCity !== "All") {
      result = result.filter((c) => c.city === selectedCity);
    }
    if (availableOnly) {
      result = result.filter((c) => c.available);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.cuisine.some((cu) => cu.toLowerCase().includes(q)) ||
          c.bio.toLowerCase().includes(q)
      );
    }
    return result;
  }, [cooks, selectedCuisine, selectedCity, availableOnly, searchQuery]);

  const activeFilters =
    (selectedCuisine !== "All" ? 1 : 0) +
    (selectedCity !== "All" ? 1 : 0) +
    (availableOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedCuisine("All");
    setSelectedCity("All");
    setAvailableOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">{t("title")}</h1>
          <p className="text-stone-500 max-w-xl">{t("subtitle")}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white border-stone-200 text-sm"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("city")}</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCity === city
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("cuisine")}</p>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.slice(0, 12).map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCuisine === cuisine
                      ? "bg-warm-700 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-warm-300 hover:text-warm-700"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("status")}</p>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                availableOnly
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"
              }`}
            >
              {t("availableNow")}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">{filteredCooks.length}</span>{" "}
              {t("cookFound", { count: filteredCooks.length })}
            </p>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-700 font-medium"
              >
                <X className="w-3 h-3" />
                {t("clearFilters")}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t("sortByRating")}
          </div>
        </div>

        {filteredCooks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCooks.map((cook, i) => (
              <CookCard key={cook.id} cook={cook as never} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">{t("noCooksFound")}</h3>
            <p className="text-sm text-stone-500 mb-4">{t("noCooksHint")}</p>
            <button onClick={clearFilters} className="text-sm text-warm-600 hover:text-warm-700 font-medium">
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
