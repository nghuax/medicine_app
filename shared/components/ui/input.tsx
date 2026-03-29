import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@shared/lib/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

export function InputField({ label, helper, error, className, ...props }: InputFieldProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <span className={cn("field-shell px-4 py-3 focus-within:border-[var(--lime-500)]", error && "border-[var(--danger)]", className)}>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          className="w-full border-0 bg-transparent text-[15px] font-semibold text-[var(--text)] outline-none placeholder:text-[var(--muted)]/80"
          id={inputId}
          {...props}
        />
      </span>
      {error ? (
        <span className="text-xs font-medium text-[var(--danger)]" id={`${inputId}-error`}>
          {error}
        </span>
      ) : helper ? (
        <span className="text-xs text-[var(--muted)]" id={`${inputId}-helper`}>
          {helper}
        </span>
      ) : null}
    </label>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
  error?: string;
}

export function TextareaField({ label, helper, error, className, ...props }: TextareaFieldProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <span className={cn("field-shell px-4 py-3 focus-within:border-[var(--lime-500)]", error && "border-[var(--danger)]", className)}>
        <textarea
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          className="min-h-28 w-full resize-none border-0 bg-transparent text-[15px] font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]/80"
          id={inputId}
          {...props}
        />
      </span>
      {error ? (
        <span className="text-xs font-medium text-[var(--danger)]" id={`${inputId}-error`}>
          {error}
        </span>
      ) : helper ? (
        <span className="text-xs text-[var(--muted)]" id={`${inputId}-helper`}>
          {helper}
        </span>
      ) : null}
    </label>
  );
}
