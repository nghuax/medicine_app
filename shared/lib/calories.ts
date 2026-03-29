const burnPerMinute: Record<string, number> = {
  walk: 5.1,
  bike: 8.7,
  swim: 9.1,
  run: 10.6,
  yoga: 3.4,
  stretch: 2.6,
  custom: 5.8,
};

export function estimateBurnedCalories(type: string, durationMin: number) {
  const rate = burnPerMinute[type] ?? burnPerMinute.custom;
  return Math.round(rate * durationMin);
}
