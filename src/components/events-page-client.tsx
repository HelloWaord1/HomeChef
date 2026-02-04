"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cuisineTypes, cities } from "@/lib/data";
import { Search, SlidersHorizontal, X, CalendarPlus, MapPin, Calendar, Users, DollarSign, MessageSquare, Clock } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  country: string;
  maxGuests: number;
  pricePerGuest: number;
  cuisine: string;
  status: "open" | "in-progress" | "completed";
  hostName: string;
  hostAvatar: string;
  bookingCount: number;
  createdAt: string;
}

export function EventsPageClient({ events }: { events: EventData[] }) {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedCuisine !== "All") {
      result = result.filter((e) => e.cuisine === selectedCuisine);
    }
    if (selectedCity !== "All") {
      result = result.filter((e) => e.city.includes(selectedCity) || e.location.includes(selectedCity));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.cuisine.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, selectedCuisine, selectedCity, searchQuery]);

  const activeFilters = (selectedCuisine !== "All" ? 1 : 0) + (selectedCity !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCuisine("All");
    setSelectedCity("All");
    setSearchQuery("");
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Browse Events</h1>
            <p className="text-stone-500 max-w-xl">
              People looking for cooks for their events. Review the details and submit your bid.
            </p>
          </div>
          <Link href="/events/new">
            <Button className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-5 text-sm">
              <CalendarPlus className="w-4 h-4 mr-1.5" />
              Post an Event
            </Button>
          </Link>
        </div>

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

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">City</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCity === city ? "bg-warm-700 text-white shadow-sm" : "bg-white text-stone-600 border border-stone-200 hover:border-warm-300"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Cuisine</p>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.slice(0, 10).map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCuisine === cuisine ? "bg-warm-700 text-white shadow-sm" : "bg-white text-stone-600 border border-stone-200 hover:border-warm-300"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-stone-500">
              <span className="font-semibold text-stone-700">{filteredEvents.length}</span>{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-700 font-medium">
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort by: Date
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block">
                <article
                  className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:border-stone-200 transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="h-2 bg-gradient-to-r from-warm-400 to-warm-600" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900 group-hover:text-warm-700 transition-colors text-lg leading-snug">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-stone-500">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{event.city}{event.country ? `, ${event.country}` : ""}</span>
                        </div>
                      </div>
                      <Badge className="bg-warm-50 text-warm-700 border-warm-200 border text-xs font-medium ml-2 flex-shrink-0">
                        {event.cuisine}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Calendar className="w-4 h-4 text-stone-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Users className="w-4 h-4 text-stone-400" />
                        <span>{event.maxGuests} people</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <DollarSign className="w-4 h-4 text-stone-400" />
                        <span>${event.pricePerGuest}/person</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        {event.hostAvatar ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image src={event.hostAvatar} alt={event.hostName} width={24} height={24} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs text-stone-500 font-medium">
                            {event.hostName[0]}
                          </div>
                        )}
                        <span className="text-xs text-stone-500">{event.hostName}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <MessageSquare className="w-3 h-3" />
                        {event.bookingCount} {event.bookingCount === 1 ? "booking" : "bookings"}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">No events found</h3>
            <p className="text-sm text-stone-500 mb-4">Try adjusting your filters or search query.</p>
            <button onClick={clearFilters} className="text-sm text-warm-600 hover:text-warm-700 font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
