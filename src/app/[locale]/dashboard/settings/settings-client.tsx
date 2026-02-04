"use client";

import { useState, useTransition, useRef } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Camera,
  User,
  MapPin,
  Phone,
  ChefHat,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  bio: string;
  phone: string;
  location: string;
  avatar: string;
  role: string;
  cuisines: string[];
  pricePerHour: number;
};

export function SettingsClient({ user }: { user: UserProfile }) {
  const t = useTranslations("settings");
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio,
    phone: user.phone,
    location: user.location,
    avatar: user.avatar,
    cuisines: user.cuisines.join(", "),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("uploadFailed"));
        return;
      }

      const { url } = await res.json();
      setForm((prev) => ({ ...prev, avatar: url }));

      // Save avatar immediately
      const result = await updateProfile({ avatar: url });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("avatarUpdated"));
      }
    } catch {
      toast.error(t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveAvatar() {
    setForm((prev) => ({ ...prev, avatar: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const cuisinesArray = form.cuisines
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await updateProfile({
        name: form.name,
        bio: form.bio,
        phone: form.phone,
        location: form.location,
        avatar: form.avatar || undefined,
        cuisines: user.role === "COOK" ? cuisinesArray : undefined,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("profileUpdated"));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{t("title")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            {t("profilePhoto")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative group">
              {form.avatar ? (
                <div className="relative">
                  <img
                    src={form.avatar}
                    alt=""
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-stone-100"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-stone-400" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-warm-600" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="w-3 h-3 mr-1" />
                {form.avatar ? t("changePhoto") : t("uploadPhoto")}
              </Button>
              <p className="text-[10px] text-stone-400 mt-1">
                {t("photoHint")}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            {t("personalInfo")}
          </h2>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-stone-700 text-sm">{t("name")}</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border-stone-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-stone-700 text-sm">{t("email")}</Label>
                <Input
                  value={user.email}
                  disabled
                  className="border-stone-200 bg-stone-50 text-stone-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-stone-700 text-sm flex items-center gap-1">
                {t("bio")}
              </Label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder={t("bioPlaceholder")}
                className="border-stone-200 min-h-24"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-stone-700 text-sm flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {t("phone")}
                </Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("phonePlaceholder")}
                  className="border-stone-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-stone-700 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {t("location")}
                </Label>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder={t("locationPlaceholder")}
                  className="border-stone-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cook-specific section */}
        {user.role === "COOK" && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              {t("cookInfo")}
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-stone-700 text-sm">
                  {t("cuisines")}
                </Label>
                <Input
                  name="cuisines"
                  value={form.cuisines}
                  onChange={handleChange}
                  placeholder={t("cuisinesPlaceholder")}
                  className="border-stone-200"
                />
                <p className="text-[10px] text-stone-400">
                  {t("cuisinesHint")}
                </p>
              </div>

              {form.cuisines && (
                <div className="flex flex-wrap gap-1.5">
                  {form.cuisines
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant="secondary"
                        className="bg-warm-50 text-warm-700 text-xs"
                      >
                        {cuisine}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Role badge */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-700">{t("accountType")}</p>
              <p className="text-xs text-stone-400 mt-0.5">{t("accountTypeHint")}</p>
            </div>
            <Badge
              variant="secondary"
              className={`${
                user.role === "COOK"
                  ? "bg-warm-50 text-warm-700"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {user.role === "COOK" ? t("cook") : t("customer")}
            </Badge>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {t("saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
