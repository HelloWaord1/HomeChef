"use client";

import { useState, useMemo } from "react";
import { EventCard } from "@/components/event-card";
import { Input } from "@/components/ui/input";
import { events, cuisineTypes, mealTypes, cities } from "@/lib/data";
import { Search, SlidersHorizontal, X, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BrowseEventsPage() {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    let result = events;

    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }
    if (selectedCuisine !== "All") {
      result = result.filter((e) => e.cuisine === selectedCuisine);
    }
    if (selectedCity !== "All") {
      result = result.filter((e) => e.city === selectedCity);
    }
    if (selectedMealType) {
      result = result.filter((e) => e.mealType === selectedMealType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.cuisine.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCuisine, selectedCity, selectedMealType, statusFilter, searchQuery]);

  const activeFilters =
    (selectedCuisine !== "All" ? 1 : 0) +
    (selectedCity !== "All" ? 1 : 0) +
    (selectedMealType ? 1 : 0);

  const clearFilters = () => {
    setSelectedCuisine("All");
    setSelectedCity("All");
    setSelectedMealType("");
    setSearchQuery("");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
              Browse Events
            </h1>
            <p className="text-stone-500 max-w-xl">
              People looking for cooks for their events. Review the details and
              submit your bid to get hired.
            </p>
          </div>
          <Link href="/events/new">
            <Button className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-5 text-sm">
              <CalendarPlus className="w-4 h-4 mr-1.5" />
              Post an Event
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-white border-stone-200 text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: "open", label: "Open for Bids" },
              { value: "in-progress", label: "In Progress" },
              { value: "", label: "All" },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  statusFilter === s.value
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* City */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              City
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCity === city
                      ? "bg-warm-700 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-warm-300"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Cuisine */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Cuisine
              </p>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.slice(0, 10).map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCuisine === cuisine
                        ? "bg-warm-700 text-white shadow-sm"
                        : "bg-white text-stone-600 border border-stone-200 hover:border-warm-300"
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Meal Type
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMealType("")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    !selectedMealType
                      ? "bg-sage-600 text-white shadow-sm"
                      : "bg-white text-stone-600 border border-stone-200"
                  }`}
                >
                  Any
                </button>
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedMealType === type
                        ? "bg-sage-600 text-white shadow-sm"
                        : "bg-white text-stone-600 border border-stone-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">
                {filteredEvents.length}
              </span>{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-700 font-medium"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort by: Newest
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              No events found
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-warm-600 hover:text-warm-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
