import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { useAppData } from "@shared/data/app-provider";
import { getTodayActivities, getTodayDailyLog, getTodaySleepLog, getTodayWaterLog } from "@shared/data/selectors";
import { activitySchema } from "@shared/lib/validators";

const quickActivities = [
  { label: "Walk", type: "walk" as const, durationMin: 20 },
  { label: "Bike", type: "bike" as const, durationMin: 25 },
  { label: "Swim", type: "swim" as const, durationMin: 30 },
];

export function DailyPage() {
  const { state, addActivity, changeWaterCups, saveSleepHours, syncWearables } = useAppData();
  const dailyLog = getTodayDailyLog(state);
  const waterLog = getTodayWaterLog(state);
  const sleepLog = getTodaySleepLog(state);
  const activities = getTodayActivities(state);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { type: "custom", durationMin: 20, distanceKm: 0 },
    resolver: zodResolver(activitySchema),
  });

  async function onSubmit(values: { type: string; durationMin: number; distanceKm?: number }) {
    await addActivity({
      type: values.type as never,
      durationMin: values.durationMin,
      distanceKm: values.distanceKm,
    });
    reset({ type: "custom", durationMin: 20, distanceKm: 0 });
  }

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">Daily tracking</h1>
        <p className="support-copy">Hydration, movement, sleep, and custom activities all live in one calm timeline.</p>
      </div>

      <Card tone="mint">
        <div className="flex flex-col gap-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-[var(--text)]">Smartwatch sync-ready</div>
            <div className="text-sm text-[var(--muted)]">Pull fresh steps, sleep, and workouts from your device adapter.</div>
          </div>
          <Button fullWidth={false} onClick={() => void syncWearables(true)}>
            Sync now
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 min-[400px]:grid-cols-2">
        <Card tone="surface">
          <div className="space-y-4">
            <div className="text-sm font-medium text-[var(--muted)]">Drink Water</div>
            <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">
              {waterLog?.cups ?? 0} <span className="text-sm font-medium text-[var(--muted)]">cups</span>
            </div>
            <div className="flex gap-3">
              <Button className="min-h-12 flex-1 px-0" fullWidth={false} onClick={() => void changeWaterCups(-1)} variant="secondary">
                -1
              </Button>
              <Button className="min-h-12 flex-1 px-0" fullWidth={false} onClick={() => void changeWaterCups(1)}>
                +1
              </Button>
            </div>
          </div>
        </Card>
        <Card tone="surface">
          <div className="space-y-4">
            <div className="text-sm font-medium text-[var(--muted)]">Sleep duration</div>
            <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">
              {sleepLog?.durationHours ?? dailyLog?.sleepHours ?? 0}h
            </div>
            <Button className="min-h-12" onClick={() => void saveSleepHours((sleepLog?.durationHours ?? 7) + 0.25)} variant="secondary">
              Add 15 min
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 min-[400px]:grid-cols-3">
        {quickActivities.map((activity) => (
          <Button
            className="min-h-14"
            key={activity.label}
            onClick={() => void addActivity({ type: activity.type, durationMin: activity.durationMin })}
            variant="secondary"
          >
            {activity.label}
          </Button>
        ))}
      </div>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Custom activity</div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField error={errors.type?.message} label="Type" placeholder="custom / yoga / stretch" {...register("type")} />
            <InputField error={errors.durationMin?.message} label="Duration (minutes)" type="number" {...register("durationMin")} />
            <InputField error={errors.distanceKm?.message} label="Distance (km)" type="number" {...register("distanceKm")} />
            <Button disabled={isSubmitting} type="submit">
              Add activity
            </Button>
          </form>
        </div>
      </Card>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Today&apos;s movement</div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/60 bg-[rgba(245,247,240,0.92)] px-4 py-3.5" key={activity._id}>
                <div>
                  <div className="text-sm font-bold text-[var(--text)]">{activity.type}</div>
                  <div className="text-xs text-[var(--muted)]">{activity.durationMin} minutes</div>
                </div>
                <div className="text-sm font-semibold text-[var(--text)]">{activity.caloriesBurned} kcal</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </AppFrame>
  );
}
