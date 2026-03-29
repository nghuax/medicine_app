import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@shared/lib/cn";

type PillTone = "lime" | "soft" | "white";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
}

export function Pill({ children, className, tone = "lime", ...props }: PropsWithChildren<PillProps>) {
  return (
    <span
      className={cn(
        "pill",
        tone === "lime" && "pill-lime",
        tone === "soft" && "pill-soft",
        tone === "white" && "pill-white",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
