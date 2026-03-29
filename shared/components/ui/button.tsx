import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth = true,
  type = "button",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime-700)] transition-[transform,background-color,border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-60 min-[400px]:min-h-[54px]",
        fullWidth && "w-full",
        variant === "primary" && "cta-primary",
        variant === "secondary" && "cta-secondary",
        variant === "ghost" &&
          "border border-[rgba(17,24,39,0.06)] bg-white/75 px-4 text-[var(--text)] shadow-[var(--shadow-soft)]",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
