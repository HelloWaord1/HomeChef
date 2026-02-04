"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

interface ComingSoonButtonProps extends ComponentProps<typeof Button> {
  message?: string;
}

export function ComingSoonButton({
  message = "Coming soon! We're launching this feature shortly.",
  children,
  onClick,
  ...props
}: ComingSoonButtonProps) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        toast.info(message);
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
}
