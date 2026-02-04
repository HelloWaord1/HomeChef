"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { DishCard } from "@/components/dish-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cuisineTypes, dietaryOptions } from "@/lib/data";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface DishData {
  id: string;
  cookId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cuisine: string;
  dietary: string[];
  category?: string;
  preparationTime?: string;
  servingSize?: string;
  cookName?: string;
  cookSlug?: string;
}

interface DishesPageClientProps {
  dishes: DishData[];
}

type SortOption = "default" | "price-low" | "price-high" | "name-az" | "name-za";

export function DishesPageClient({ dishes }: DishesPageClientProps) {
  const t = useTranslations("dishes");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [excludeAllergens, setExcludeAllergens] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  const allergenOptions = ["Gluten-Free", "Dairy-Free", "Nut-Free", "Halal"];

  const filteredDishes = useMemo(() => {
    let result = dishes;

    if (selectedCuisine !== "All") {
      result = result.filter((d) => d.cuisine === selectedCuisine);
    }
    if (selectedDietary.length > 0) {
      result = result.filter((d) =>
        selectedDietary.every((tag) => d.dietary.includes(tag))
      );
    }
    // Exclude allergens: hide dishes that DON'T have these allergen-free labels
    if (excludeAllergens.length > 0) {
      result = result.filter((d) =>
        excludeAllergens.every((allergen) => d.dietary.includes(allergen))
      );
    }
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) result = result.filter((d) => d.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) result = result.filter((d) => d.price <= max);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.cuisine.toLowerCase().includes(q) ||
          (d.cookName && d.cookName.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [dishes, selectedCuisine, selectedDietary, excludeAllergens, priceMin, priceMax, searchQuery, sortBy]);

  const toggleDietary = (tag: string) =>
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  const toggleAllergen = (tag: string) =>
    setExcludeAllergens((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const activeFilters =
    (selectedCuisine !== "All" ? 1 : 0) +
    selectedDietary.length +
    excludeAllergens.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const clearAll = () => {
    setSelectedCuisine("All");
    setSelectedDietary([]);
    setExcludeAllergens([]);
    setPriceMin("");
    setPriceMax("");
    setSearchQuery("");
    setSortBy("default");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">{t("title")}</h1>
          <p className="text-stone-500 max-w-xl">{t("subtitle")}</p>
        </div>

        <div className="mb-8 space-y-4">
          {/* Search + Filters toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white border-stone-200 text-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl h-11 px-4"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              {t("filtersLabel")}
              {activeFilters > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-warm-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </Button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 animate-fade-in-up">
              {/* Cuisine */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("cuisineLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {cuisineTypes.map((cuisine) => (
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

              {/* Dietary Preferences */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("dietary")}</p>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleDietary(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedDietary.includes(tag)
                          ? "bg-sage-600 text-white shadow-sm"
                          : "bg-white text-stone-600 border border-stone-200 hover:border-sage-300 hover:text-sage-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergen-free filter */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("allergenFree")}</p>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleAllergen(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        excludeAllergens.includes(tag)
                          ? "bg-red-500 text-white shadow-sm"
                          : "bg-white text-stone-600 border border-stone-200 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("price")}</p>
                <div className="flex items-center gap-2 max-w-xs">
                  <Input
                    type="number"
                    placeholder={t("minPrice")}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="h-9 rounded-lg text-sm w-24"
                  />
                  <span className="text-stone-400">—</span>
                  <Input
                    type="number"
                    placeholder={t("maxPrice")}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="h-9 rounded-lg text-sm w-24"
                  />
                  <span className="text-xs text-stone-400">$</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">{filteredDishes.length}</span>{" "}
              {t("dishFound", { count: filteredDishes.length })}
            </p>
            {activeFilters > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-700 font-medium"
              >
                <X className="w-3 h-3" />
                {t("clearAll")}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs text-stone-600 bg-transparent border-none cursor-pointer focus:outline-none font-medium"
            >
              <option value="default">{t("sortDefault")}</option>
              <option value="price-low">{t("sortPriceLow")}</option>
              <option value="price-high">{t("sortPriceHigh")}</option>
              <option value="name-az">{t("sortNameAZ")}</option>
              <option value="name-za">{t("sortNameZA")}</option>
            </select>
          </div>
        </div>

        {filteredDishes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">{t("noDishes")}</h3>
            <p className="text-sm text-stone-500 mb-4">{t("noDishesHint")}</p>
            <button onClick={clearAll} className="text-sm text-warm-600 hover:text-warm-700 font-medium">
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
