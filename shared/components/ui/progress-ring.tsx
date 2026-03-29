interface ProgressRingProps {
  value: number;
  label: string;
  size?: number;
}

export function ProgressRing({ value, label, size = 98 }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative" style={{ height: size, width: size }}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} fill="none" r={radius} stroke="rgba(127,186,30,0.18)" strokeWidth="10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="var(--lime-700)"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[28px] font-extrabold leading-none text-[var(--text)]">{Math.round(clamped / 16.6) || 0}</div>
        <div className="mt-1 text-xs font-medium text-[var(--muted)]">{label}</div>
      </div>
    </div>
  );
}
