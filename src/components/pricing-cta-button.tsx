"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PricingCtaButtonProps {
  label: string;
  popular: boolean;
  variant: "default" | "outline";
}

export function PricingCtaButton({
  label,
  popular,
  variant,
}: PricingCtaButtonProps) {
  return (
    <Button
      className={`w-full rounded-full h-11 text-sm font-semibold mb-6 ${
        popular
          ? "bg-warm-700 hover:bg-warm-800 text-white shadow-lg shadow-warm-700/20"
          : "border-stone-200"
      }`}
      variant={variant}
      onClick={() =>
        toast.info("Coming soon! We're launching this feature shortly.")
      }
    >
      {label}
      <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
  );
}
