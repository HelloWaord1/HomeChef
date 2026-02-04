"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/lib/actions/bookings";
import { Send, X, Loader2 } from "lucide-react";

interface JoinEventButtonProps {
  eventId: string;
  hostId: string;
  pricePerGuest: number;
  eventDate: string;
}

export function JoinEventButton({ eventId, hostId, pricePerGuest, eventDate }: JoinEventButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("joinEvent");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");

  async function handleJoin() {
    if (!session?.user) {
      toast.error(t("loginRequired"));
      router.push("/login");
      return;
    }
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createBooking({
        cookId: hostId,
        eventId,
        date: new Date(eventDate),
        guests,
        notes,
        total: pricePerGuest * guests,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("joined"));
        setShowForm(false);
        router.push("/events/" + eventId);
      }
    } catch {
      toast.error(t("failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6 shadow-md shadow-warm-700/20"
        onClick={handleJoin}
      >
        <Send className="w-4 h-4 mr-2" />
        {t("title")}
      </Button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in-up">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-stone-900 mb-1">{t("title")}</h2>
            <p className="text-sm text-stone-500 mb-6">
              {t("pricePerGuest", { price: pricePerGuest })}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-700">{t("numberOfGuests")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-11 rounded-xl border-stone-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700">{t("notes")}</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-warm-50 border border-warm-100">
                <p className="text-sm text-warm-700 font-medium">
                  {t("total", { total: pricePerGuest * guests, count: guests })}
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-warm-700 hover:bg-warm-800 text-white font-medium rounded-xl"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("joining")}</>
                ) : (
                  t("confirm")
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
