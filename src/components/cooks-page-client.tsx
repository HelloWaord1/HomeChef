"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CookCard } from "@/components/cook-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cuisineTypes } from "@/lib/data";
import { Search, SlidersHorizontal, X, MapPin, Loader2, Star, ArrowUpDown } from "lucide-react";

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
  pricePerHour?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface CooksPageClientProps {
  cooks: CookData[];
}

type SortOption = "rating" | "price-low" | "price-high" | "reviews";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function CooksPageClient({ cooks }: CooksPageClientProps) {
  const t = useTranslations("cooks");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Geolocation state
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [nearMeActive, setNearMeActive] = useState(false);

  const handleNearMe = useCallback(() => {
    if (nearMeActive) {
      setNearMeActive(false);
      return;
    }
    if (userLat !== null && userLng !== null) {
      setNearMeActive(true);
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setNearMeActive(true);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [nearMeActive, userLat, userLng]);

  const filteredCooks = useMemo(() => {
    let result = cooks;

    if (selectedCuisine !== "All") {
      result = result.filter((c) => c.cuisine.includes(selectedCuisine));
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
    if (minRating > 0) {
      result = result.filter((c) => c.rating >= minRating);
    }
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) result = result.filter((c) => (c.pricePerHour ?? 0) >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) result = result.filter((c) => (c.pricePerHour ?? 999) <= max);
    }

    // Calculate distances
    type CookWithDistance = CookData & { distance?: number };
    let withDistance: CookWithDistance[] = result.map((c) => {
      if (userLat !== null && userLng !== null && c.latitude && c.longitude) {
        return { ...c, distance: haversineDistance(userLat, userLng, c.latitude, c.longitude) };
      }
      return { ...c, distance: undefined };
    });

    // Filter near me (within 50km)
    if (nearMeActive) {
      withDistance = withDistance.filter((c) => c.distance !== undefined && c.distance <= 50);
    }

    // Sorting
    if (nearMeActive && userLat !== null) {
      withDistance.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    } else {
      switch (sortBy) {
        case "rating":
          withDistance.sort((a, b) => b.rating - a.rating);
          break;
        case "reviews":
          withDistance.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "price-low":
          withDistance.sort((a, b) => (a.pricePerHour ?? 999) - (b.pricePerHour ?? 999));
          break;
        case "price-high":
          withDistance.sort((a, b) => (b.pricePerHour ?? 0) - (a.pricePerHour ?? 0));
          break;
      }
    }

    return withDistance;
  }, [cooks, selectedCuisine, availableOnly, searchQuery, minRating, priceMin, priceMax, sortBy, nearMeActive, userLat, userLng]);

  const activeFilters =
    (selectedCuisine !== "All" ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    (nearMeActive ? 1 : 0);

  const clearFilters = () => {
    setSelectedCuisine("All");
    setAvailableOnly(false);
    setSearchQuery("");
    setMinRating(0);
    setPriceMin("");
    setPriceMax("");
    setNearMeActive(false);
    setSortBy("rating");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">{t("title")}</h1>
          <p className="text-stone-500 max-w-xl">{t("subtitle")}</p>
        </div>

        <div className="mb-8 space-y-4">
          {/* Search + Near Me + Filters Toggle */}
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
              variant={nearMeActive ? "default" : "outline"}
              onClick={handleNearMe}
              disabled={geoLoading}
              className={`rounded-xl h-11 px-4 ${nearMeActive ? "bg-warm-700 hover:bg-warm-800 text-white" : ""}`}
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-1.5" />
              )}
              {t("nearMe")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl h-11 px-4"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              {t("filters")}
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

              {/* Rating Filter */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("minRating")}</p>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                        minRating === r
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-white text-stone-600 border border-stone-200 hover:border-amber-300"
                      }`}
                    >
                      {r === 0 ? (
                        t("anyRating")
                      ) : (
                        <>
                          <Star className="w-3 h-3 fill-current" />
                          {r}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t("priceRange")}</p>
                <div className="flex items-center gap-2 max-w-xs">
                  <Input
                    type="number"
                    placeholder={t("min")}
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="h-9 rounded-lg text-sm w-24"
                  />
                  <span className="text-stone-400">—</span>
                  <Input
                    type="number"
                    placeholder={t("max")}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="h-9 rounded-lg text-sm w-24"
                  />
                  <span className="text-xs text-stone-400">$/hr</span>
                </div>
              </div>

              {/* Available */}
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
          )}
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
          {!nearMeActive && (
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs text-stone-600 bg-transparent border-none cursor-pointer focus:outline-none font-medium"
              >
                <option value="rating">{t("sortRating")}</option>
                <option value="reviews">{t("sortReviews")}</option>
                <option value="price-low">{t("sortPriceLow")}</option>
                <option value="price-high">{t("sortPriceHigh")}</option>
              </select>
            </div>
          )}
          {nearMeActive && (
            <div className="flex items-center gap-1.5 text-xs text-warm-600 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {t("sortDistance")}
            </div>
          )}
        </div>

        {filteredCooks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCooks.map((cook, i) => (
              <CookCard
                key={cook.id}
                cook={cook as never}
                index={i}
                distance={(cook as CookData & { distance?: number }).distance}
              />
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
