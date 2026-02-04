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
import { Lock, X, Loader2, CalendarDays, Users, MessageSquare } from "lucide-react";

interface BookCookButtonProps {
  cookId: string;
  cookName: string;
}

export function BookCookButton({ cookId, cookName }: BookCookButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("bookCook");
  const tc = useTranslations("cooks");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [total, setTotal] = useState(100);

  async function handleBook() {
    if (!session?.user) {
      toast.error(t("loginToBook"));
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
        cookId,
        date: new Date(date),
        guests,
        notes,
        total,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("requestSent"));
        setShowForm(false);
        router.push("/dashboard/bookings");
      }
    } catch {
      toast.error(t("loginToBook"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex gap-2 sm:pb-1">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-stone-200 gap-1.5"
          onClick={() => {
            if (!session?.user) {
              toast.error(t("loginToMessage"));
              router.push("/login");
            } else {
              toast.info(t("messagingComingSoon"));
            }
          }}
        >
          <Lock className="w-3.5 h-3.5" />
          {tc("message")}
        </Button>
        <Button
          size="sm"
          className="rounded-full bg-warm-700 hover:bg-warm-800 text-white"
          onClick={handleBook}
        >
          {tc("bookNow")}
        </Button>
      </div>

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in-up">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-stone-900 mb-1">
              {t("bookTitle", { name: cookName })}
            </h2>
            <p className="text-sm text-stone-500 mb-6">
              {t("bookDesc")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-700 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {t("date")}
                </Label>
                <Input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 rounded-xl border-stone-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {t("numberOfGuests")}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-11 rounded-xl border-stone-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700">{t("budget")}</Label>
                <Input
                  type="number"
                  min={10}
                  step={5}
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  className="h-11 rounded-xl border-stone-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-stone-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t("notes")}
                </Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-warm-700 hover:bg-warm-800 text-white font-medium rounded-xl"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("sending")}</>
                ) : (
                  t("sendRequest")
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
