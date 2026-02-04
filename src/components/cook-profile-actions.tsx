"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function CookProfileActions() {
  return (
    <div className="flex gap-2 sm:pb-1">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-stone-200 gap-1.5"
        onClick={() =>
          toast.info("Coming soon! We're launching this feature shortly.")
        }
      >
        <Lock className="w-3.5 h-3.5" />
        Message
      </Button>
      <Button
        size="sm"
        className="rounded-full bg-warm-700 hover:bg-warm-800 text-white"
        onClick={() =>
          toast.info("Coming soon! We're launching this feature shortly.")
        }
      >
        Hire Cook
      </Button>
    </div>
  );
}
