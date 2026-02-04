"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function CookProfileActions() {
  const t = useTranslations("cooks");
  const tc = useTranslations("common");

  return (
    <div className="flex gap-2 sm:pb-1">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-stone-200 gap-1.5"
        onClick={() => toast.info(tc("comingSoon"))}
      >
        <Lock className="w-3.5 h-3.5" />
        {t("message")}
      </Button>
      <Button
        size="sm"
        className="rounded-full bg-warm-700 hover:bg-warm-800 text-white"
        onClick={() => toast.info(tc("comingSoon"))}
      >
        {t("hireCook")}
      </Button>
    </div>
  );
}
