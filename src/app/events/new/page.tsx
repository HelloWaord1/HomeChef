"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Users,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  ArrowLeft,
  Minus,
  Plus,
  Check,
} from "lucide-react";

const cuisineOptions = [
  "Italian",
  "Japanese",
  "Georgian",
  "Mexican",
  "Indian",
  "Russian",
  "Thai",
  "Mediterranean",
  "French",
  "Korean",
  "Chinese",
  "Other",
];

const mealTypes = [
  { value: "Breakfast", emoji: "🌅", time: "7–11 AM" },
  { value: "Lunch", emoji: "☀️", time: "11 AM–3 PM" },
  { value: "Dinner", emoji: "🌙", time: "5–10 PM" },
];

const dateOptions = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "custom", label: "Pick a date" },
];

export default function PostEventPage() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [dateOption, setDateOption] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [mealType, setMealType] = useState("");
  const [people, setPeople] = useState(4);
  const [budget, setBudget] = useState(30);
  const [cuisine, setCuisine] = useState("");
  const [ingredientsProvided, setIngredientsProvided] = useState(false);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">
              Event Posted! 🎉
            </h1>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Your cooking request is now live. Talented cooks in your area will
              start sending bids soon. We&apos;ll notify you when someone
              responds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/events">
                <Button className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6">
                  Browse Events
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-stone-200"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Post a Cooking Event
          </h1>
          <p className="text-stone-500 max-w-xl">
            Tell us what you need and talented home cooks will send you
            proposals with menus and pricing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-warm-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900">
                Location
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Country
                </label>
                <Input
                  placeholder="e.g. UAE"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  City
                </label>
                <Input
                  placeholder="e.g. Dubai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:bg-white"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Address
                </label>
                <Input
                  placeholder="Street, building, apartment..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* When & What Section */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sage-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900">
                When & What
              </h2>
            </div>

            {/* Date Picker */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Date
              </label>
              <div className="flex flex-wrap gap-2">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDateOption(opt.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      dateOption === opt.value
                        ? "bg-warm-700 text-white shadow-md shadow-warm-700/20"
                        : "bg-stone-50 text-stone-600 border border-stone-200 hover:border-warm-300 hover:text-warm-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {dateOption === "custom" && (
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="mt-3 h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:bg-white max-w-xs"
                  required
                />
              )}
            </div>

            {/* Meal Type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Meal Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {mealTypes.map((meal) => (
                  <button
                    key={meal.value}
                    type="button"
                    onClick={() => setMealType(meal.value)}
                    className={`relative p-4 rounded-xl text-center transition-all ${
                      mealType === meal.value
                        ? "bg-warm-50 border-2 border-warm-500 shadow-sm"
                        : "bg-stone-50 border-2 border-transparent hover:border-stone-200"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{meal.emoji}</span>
                    <span
                      className={`text-sm font-semibold block ${
                        mealType === meal.value
                          ? "text-warm-700"
                          : "text-stone-700"
                      }`}
                    >
                      {meal.value}
                    </span>
                    <span className="text-xs text-stone-400 block">
                      {meal.time}
                    </span>
                    {mealType === meal.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-warm-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Cuisine Type
              </label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger className="w-full h-11 rounded-xl border-stone-200 bg-stone-50/50">
                  <SelectValue placeholder="Select cuisine..." />
                </SelectTrigger>
                <SelectContent>
                  {cuisineOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Group & Budget */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-cream-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-cream-500" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900">
                Group & Budget
              </h2>
            </div>

            {/* People Counter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Number of People
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4 text-stone-600" />
                </button>
                <span className="text-3xl font-bold text-stone-900 w-12 text-center tabular-nums">
                  {people}
                </span>
                <button
                  type="button"
                  onClick={() => setPeople(Math.min(50, people + 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            </div>

            {/* Budget Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-stone-700">
                  Budget per Person
                </label>
                <span className="text-lg font-bold text-warm-700">
                  ${budget}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-warm-600"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-1">
                <span>$5</span>
                <span>$200</span>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-warm-50 border border-warm-100">
                <p className="text-sm text-warm-700 font-medium">
                  Total budget: ${budget * people} for {people} people
                </p>
              </div>
            </div>

            {/* Ingredients Toggle */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Who provides ingredients?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIngredientsProvided(false)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    !ingredientsProvided
                      ? "bg-warm-50 border-2 border-warm-500 shadow-sm"
                      : "bg-stone-50 border-2 border-transparent hover:border-stone-200"
                  }`}
                >
                  <ChefHat
                    className={`w-6 h-6 mx-auto mb-2 ${
                      !ingredientsProvided ? "text-warm-600" : "text-stone-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold block ${
                      !ingredientsProvided ? "text-warm-700" : "text-stone-600"
                    }`}
                  >
                    Cook brings everything
                  </span>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    All-inclusive
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIngredientsProvided(true)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    ingredientsProvided
                      ? "bg-sage-50 border-2 border-sage-500 shadow-sm"
                      : "bg-stone-50 border-2 border-transparent hover:border-stone-200"
                  }`}
                >
                  <UtensilsCrossed
                    className={`w-6 h-6 mx-auto mb-2 ${
                      ingredientsProvided ? "text-sage-600" : "text-stone-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold block ${
                      ingredientsProvided ? "text-sage-700" : "text-stone-600"
                    }`}
                  >
                    I provide ingredients
                  </span>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    Just need a cook
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-warm-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900">
                Tell Cooks More
              </h2>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any special requests? Dietary restrictions? Describe the occasion, your dream menu, allergies, or anything that helps cooks create the perfect proposal..."
              rows={4}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-warm-700 hover:bg-warm-800 text-white rounded-full text-sm font-semibold shadow-lg shadow-warm-700/20 hover:shadow-warm-800/30 transition-all disabled:opacity-70 flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Posting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Post Event
                </span>
              )}
            </Button>
            <Link href="/events">
              <Button
                type="button"
                variant="outline"
                className="h-12 px-6 rounded-full border-stone-200 text-stone-600 w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
