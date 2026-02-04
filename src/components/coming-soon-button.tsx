"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

interface ComingSoonButtonProps extends ComponentProps<typeof Button> {
  message?: string;
}

export function ComingSoonButton({
  message,
  children,
  onClick,
  ...props
}: ComingSoonButtonProps) {
  const t = useTranslations("common");

  return (
    <Button
      {...props}
      onClick={(e) => {
        toast.info(message || t("comingSoon"));
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
}
