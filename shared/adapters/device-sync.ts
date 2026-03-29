import { estimateBurnedCalories } from "@shared/lib/calories";

export async function syncDeviceMetricsMock() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    steps: 6200,
    sleepHours: 7.4,
    activities: [
      {
        type: "walk",
        durationMin: 35,
        caloriesBurned: estimateBurnedCalories("walk", 35),
        distanceKm: 3.2,
        source: "watch-sync",
      },
      {
        type: "bike",
        durationMin: 24,
        caloriesBurned: estimateBurnedCalories("bike", 24),
        distanceKm: 6.4,
        source: "watch-sync",
      },
    ],
  };
}
