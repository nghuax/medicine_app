import { Suspense, lazy, useState } from "react";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Card } from "@shared/components/ui/card";
import { SegmentedControl } from "@shared/components/ui/segmented-control";
import { useAppData } from "@shared/data/app-provider";
import { getCurrentUser, getMedicineAdherence, getTodayActivities, getTodayNutrition, getWeeklySeries, sumBurned, sumCalories } from "@shared/data/selectors";
import { formatPercent } from "@shared/lib/format";

const StatusChart = lazy(() =>
  import("@shared/components/mobile/status-chart").then((module) => ({ default: module.StatusChart })),
);

export function StatusPage() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const { state } = useAppData();
  const user = getCurrentUser(state);
  const weekly = getWeeklySeries(state);
  const activities = getTodayActivities(state);
  const nutrition = getTodayNutrition(state);
  const dailyBurned = sumBurned(activities);
  const dailyCalories = sumCalories(nutrition);
  const adherence = getMedicineAdherence(state);
  const latest = weekly.at(-1);

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">Status</h1>
        <p className="support-copy">Daily and weekly views of calories, activity burn, and medicine consistency.</p>
      </div>

      <SegmentedControl
        ariaLabel="Status view"
        onChange={(value) => setView(value as "daily" | "weekly")}
        options={[
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
        ]}
        value={view}
      />

      <Card className="hero-panel" tone="lime">
        <div className="grid gap-4 min-[400px]:grid-cols-[auto_1fr] min-[400px]:items-start">
          <div className="text-[40px] font-extrabold leading-none text-[var(--text)]">↑ 18%</div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-[var(--lime-700)]">Health trend</div>
            <div className="text-sm leading-6 text-[var(--text)]">
              {user?.displayName ?? "You"} are staying consistent with medicine and hydration. Keep it up.
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 min-[400px]:grid-cols-2">
        <Card tone="surface">
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--muted)]">Calories taken</div>
            <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">
              {view === "daily" ? dailyCalories : weekly.reduce((sum, entry) => sum + entry.intake, 0)}
            </div>
            <div className="text-sm text-[var(--muted)]">Across meal entries</div>
          </div>
        </Card>
        <Card tone="surface">
          <div className="space-y-3">
            <div className="text-sm font-medium text-[var(--muted)]">Burned calories</div>
            <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">
              {view === "daily" ? dailyBurned : weekly.reduce((sum, entry) => sum + entry.burned, 0)}
            </div>
            <div className="text-sm text-[var(--muted)]">Movement and workouts</div>
          </div>
        </Card>
      </div>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Calorie balance</div>
          <div className="h-56">
            <Suspense fallback={<div className="h-full rounded-[24px] bg-[rgba(245,247,240,0.82)]" />}>
              <StatusChart view={view} weekly={weekly} />
            </Suspense>
          </div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Highlights</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-[24px] bg-[rgba(245,247,240,0.92)] px-4 py-3">
              <span className="font-bold text-[var(--text)]">Medicine adherence</span>
              <span className="text-sm text-[var(--muted)]">{formatPercent(adherence)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[24px] bg-[rgba(245,247,240,0.92)] px-4 py-3">
              <span className="font-bold text-[var(--text)]">Water goal</span>
              <span className="text-sm text-[var(--muted)]">{weekly.filter((entry) => entry.water >= 8).length}/7 days</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[24px] bg-[rgba(245,247,240,0.92)] px-4 py-3">
              <span className="font-bold text-[var(--text)]">Sleep average</span>
              <span className="text-sm text-[var(--muted)]">{latest?.sleep ?? 7.2} h</span>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            Recommendation: keep evening caffeine away from sleep and iron reminders.
          </div>
        </div>
      </Card>
    </AppFrame>
  );
}
