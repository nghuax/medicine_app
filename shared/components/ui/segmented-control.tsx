import { useRef, type KeyboardEvent } from "react";
import { cn } from "@shared/lib/cn";

interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function SegmentedControl({ options, value, onChange, ariaLabel = "Segmented control" }: SegmentedControlProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveSelection(index: number) {
    const next = options[index];
    if (!next) {
      return;
    }
    onChange(next.value);
    itemRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection((index + 1) % options.length);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection((index - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveSelection(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveSelection(options.length - 1);
    }
  }

  return (
    <div
      aria-label={ariaLabel}
      className="inline-grid w-full min-w-0 gap-1 rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.76)] p-1.5"
      role="radiogroup"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const index = options.findIndex((item) => item.value === option.value);
        return (
          <button
            aria-checked={active}
            className={cn(
              "min-h-[44px] rounded-full px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime-700)] min-[400px]:text-sm",
              active ? "bg-[var(--lime-100)] text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(127,186,30,0.08)]" : "text-[var(--muted)]",
            )}
            key={option.value}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => onChange(option.value)}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
