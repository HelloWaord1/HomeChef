"use client";

import { useState, useMemo } from "react";
import { DishCard } from "@/components/dish-card";
import { Input } from "@/components/ui/input";
import { cuisineTypes, dietaryOptions } from "@/lib/data";
import { Search, X } from "lucide-react";

interface DishData {
  id: string;
  cookId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cuisine: string;
  dietary: string[];
  preparationTime?: string;
  servingSize?: string;
  cookName?: string;
  cookSlug?: string;
}

interface DishesPageClientProps {
  dishes: DishData[];
}

export function DishesPageClient({ dishes }: DishesPageClientProps) {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<"all" | "under10" | "10to20" | "over20">("all");

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

    if (priceRange === "under10") {
      result = result.filter((d) => d.price < 10);
    } else if (priceRange === "10to20") {
      result = result.filter((d) => d.price >= 10 && d.price <= 20);
    } else if (priceRange === "over20") {
      result = result.filter((d) => d.price > 20);
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

    return result;
  }, [dishes, selectedCuisine, selectedDietary, priceRange, searchQuery]);

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeFilters =
    (selectedCuisine !== "All" ? 1 : 0) + selectedDietary.length + (priceRange !== "all" ? 1 : 0);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Browse Dishes</h1>
          <p className="text-stone-500 max-w-xl">
            Explore home-cooked dishes from all our cooks. Filter by cuisine, dietary needs, or price.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search dishes, cooks, or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white border-stone-200 text-sm"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Cuisine</p>
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

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Dietary</p>
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

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Price</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as const, label: "Any Price" },
                { value: "under10" as const, label: "Under $10" },
                { value: "10to20" as const, label: "$10 – $20" },
                { value: "over20" as const, label: "$20+" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriceRange(option.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    priceRange === option.value
                      ? "bg-cream-500 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-cream-300 hover:text-cream-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">{filteredDishes.length}</span>{" "}
              {filteredDishes.length === 1 ? "dish" : "dishes"} found
            </p>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setSelectedCuisine("All");
                  setSelectedDietary([]);
                  setPriceRange("all");
                  setSearchQuery("");
                }}
                className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-700 font-medium"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
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
            <h3 className="text-lg font-semibold text-stone-700 mb-2">No dishes found</h3>
            <p className="text-sm text-stone-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
