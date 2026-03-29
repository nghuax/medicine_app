import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@shared/lib/cn";

type CardTone = "surface" | "lime" | "mint" | "blue" | "peach" | "soft";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
}

export function Card({ children, className, tone = "surface", ...props }: PropsWithChildren<CardProps>) {
  return (
    <div
      className={cn(
        "card-shell",
        tone === "surface" && "surface-card",
        tone === "lime" && "lime-card",
        tone === "mint" && "mint-card",
        tone === "blue" && "blue-card",
        tone === "peach" && "peach-card",
        tone === "soft" && "soft-card",
        "p-5 min-[400px]:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
