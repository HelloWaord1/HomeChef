"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");

  async function handleJoin() {
    if (!session?.user) {
      toast.error("Please log in to join an event");
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
        toast.success("You've joined the event!");
        setShowForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to join event");
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
        Join Event
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

            <h2 className="text-xl font-bold text-stone-900 mb-1">Join Event</h2>
            <p className="text-sm text-stone-500 mb-6">
              ${pricePerGuest} per guest
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-700">Number of Guests</Label>
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
                <Label className="text-stone-700">Notes (optional)</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any dietary requirements or questions..."
                  rows={3}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-500/20 focus:border-warm-500 transition-all resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-warm-50 border border-warm-100">
                <p className="text-sm text-warm-700 font-medium">
                  Total: ${pricePerGuest * guests} for {guests} {guests === 1 ? "guest" : "guests"}
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-warm-700 hover:bg-warm-800 text-white font-medium rounded-xl"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining...</>
                ) : (
                  "Confirm & Join"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
