"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function SubmitBidButton({ className }: { className?: string }) {
  return (
    <Button
      className={
        className ||
        "bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6 shadow-md shadow-warm-700/20"
      }
      onClick={() =>
        toast.info("Coming soon! We're launching this feature shortly.")
      }
    >
      <Send className="w-4 h-4 mr-2" />
      Submit Bid
    </Button>
  );
}

export function FirstBidButton() {
  return (
    <Button
      className="bg-warm-700 hover:bg-warm-800 text-white rounded-full px-6"
      onClick={() =>
        toast.info("Coming soon! We're launching this feature shortly.")
      }
    >
      <Send className="w-4 h-4 mr-2" />
      Be the First to Bid
    </Button>
  );
}

export function BidActionButtons() {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-stone-200 text-stone-600 text-xs"
        onClick={() =>
          toast.info("Coming soon! We're launching this feature shortly.")
        }
      >
        Message
      </Button>
      <Button
        size="sm"
        className="rounded-full bg-warm-700 hover:bg-warm-800 text-white text-xs"
        onClick={() =>
          toast.info("Coming soon! We're launching this feature shortly.")
        }
      >
        Accept Bid
      </Button>
    </div>
  );
}
