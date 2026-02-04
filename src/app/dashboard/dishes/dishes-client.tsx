"use client";

import { useState, useTransition } from "react";
import { createDish, updateDish, deleteDish } from "@/lib/actions/dishes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Clock,
  Users,
  UtensilsCrossed,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  cuisine: string;
  category: string;
  image: string | null;
  preparationTime: number;
  servingSize: number;
  ingredients: string[];
  allergens: string[];
  available: boolean;
  createdAt: string;
  cookId: string;
};

export function DishesClient({
  dishes: initialDishes,
}: {
  dishes: Dish[];
}) {
  const [dishes, setDishes] = useState(initialDishes);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Dishes</h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage your menu — {dishes.length} dish{dishes.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingDish(null);
            setShowForm(true);
          }}
          className="bg-warm-700 hover:bg-warm-800 text-white rounded-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Dish
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <DishForm
          dish={editingDish}
          onClose={() => {
            setShowForm(false);
            setEditingDish(null);
          }}
          onSaved={(dish) => {
            if (editingDish) {
              setDishes((prev) =>
                prev.map((d) => (d.id === dish.id ? { ...d, ...dish } : d))
              );
            } else {
              setDishes((prev) => [dish, ...prev]);
            }
            setShowForm(false);
            setEditingDish(null);
          }}
        />
      )}

      {/* Dishes Grid */}
      {dishes.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <UtensilsCrossed className="w-12 h-12 text-stone-200 mx-auto mb-3" />
          <p className="text-stone-400 mb-4">No dishes yet. Add your first dish!</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Dish
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={() => {
                setEditingDish(dish);
                setShowForm(true);
              }}
              onDelete={(id) => {
                setDishes((prev) => prev.filter((d) => d.id !== id));
              }}
              onToggle={(id, available) => {
                setDishes((prev) =>
                  prev.map((d) => (d.id === id ? { ...d, available } : d))
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DishCard({
  dish,
  onEdit,
  onDelete,
  onToggle,
}: {
  dish: Dish;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, available: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!confirm("Delete this dish?")) return;
    startTransition(async () => {
      const result = await deleteDish(dish.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Dish deleted");
        onDelete(dish.id);
      }
    });
  }

  async function handleToggle() {
    startTransition(async () => {
      const result = await updateDish(dish.id, {
        available: !dish.available,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        onToggle(dish.id, !dish.available);
        toast.success(
          dish.available ? "Dish hidden from menu" : "Dish is now visible"
        );
      }
    });
  }

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
        dish.available ? "border-stone-100" : "border-stone-200 opacity-60"
      }`}
    >
      {dish.image && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          {!dish.available && (
            <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
              <Badge className="bg-stone-800 text-white">Hidden</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-white/95 backdrop-blur-sm text-stone-900 font-bold px-2 py-1 rounded-full text-xs">
              ${dish.price}
            </span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-900 text-sm">{dish.name}</h3>
          {!dish.image && (
            <span className="text-sm font-bold text-warm-700">
              ${dish.price}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 line-clamp-2 mt-1">
          {dish.description}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {dish.preparationTime}m
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {dish.servingSize}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {dish.cuisine}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-50">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
            onClick={handleToggle}
            disabled={isPending}
          >
            {dish.available ? (
              <>
                <EyeOff className="w-3 h-3 mr-1" /> Hide
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-1" /> Show
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DishForm({
  dish,
  onClose,
  onSaved,
}: {
  dish: Dish | null;
  onClose: () => void;
  onSaved: (dish: Dish) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    price: dish?.price?.toString() || "",
    cuisine: dish?.cuisine || "",
    category: dish?.category || "Main",
    image: dish?.image || "",
    preparationTime: dish?.preparationTime?.toString() || "30",
    servingSize: dish?.servingSize?.toString() || "2",
    ingredients: dish?.ingredients?.join(", ") || "",
    allergens: dish?.allergens?.join(", ") || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      cuisine: form.cuisine,
      category: form.category,
      image: form.image || undefined,
      preparationTime: parseInt(form.preparationTime),
      servingSize: parseInt(form.servingSize),
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      allergens: form.allergens
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    startTransition(async () => {
      if (dish) {
        const result = await updateDish(dish.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Dish updated!");
          onSaved({
            ...dish,
            ...data,
            image: data.image || null,
          });
        }
      } else {
        const result = await createDish(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Dish created!");
          onSaved({
            id: result.dishId!,
            ...data,
            image: data.image || null,
            available: true,
            createdAt: new Date().toISOString(),
            cookId: "",
          });
        }
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-900">
          {dish ? "Edit Dish" : "Add New Dish"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Khinkali (10 pcs)"
              required
              className="border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Price ($)</Label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="16.00"
              required
              className="border-stone-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-stone-700 text-sm">Description</Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your dish..."
            required
            className="border-stone-200 min-h-20"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Cuisine</Label>
            <Input
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="Georgian"
              required
              className="border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Category</Label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full h-9 rounded-md border border-stone-200 bg-transparent px-3 text-sm"
            >
              <option value="Appetizer">Appetizer</option>
              <option value="Main">Main</option>
              <option value="Soup">Soup</option>
              <option value="Dessert">Dessert</option>
              <option value="Side">Side</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Image URL</Label>
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="border-stone-200"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Prep Time (min)</Label>
            <Input
              name="preparationTime"
              type="number"
              value={form.preparationTime}
              onChange={handleChange}
              className="border-stone-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-stone-700 text-sm">Serving Size</Label>
            <Input
              name="servingSize"
              type="number"
              value={form.servingSize}
              onChange={handleChange}
              className="border-stone-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-stone-700 text-sm">
            Ingredients (comma-separated)
          </Label>
          <Input
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            placeholder="Beef, Flour, Onion, Cilantro"
            className="border-stone-200"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-stone-700 text-sm">
            Allergens (comma-separated)
          </Label>
          <Input
            name="allergens"
            value={form.allergens}
            onChange={handleChange}
            placeholder="Gluten, Dairy"
            className="border-stone-200"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full"
            size="sm"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : null}
            {dish ? "Update Dish" : "Add Dish"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
