import { Bell, CalendarDays, Droplets, Footprints, Pill as PillIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { ProgressRing } from "@shared/components/ui/progress-ring";
import { useAppData } from "@shared/data/app-provider";
import { buildReminderPreview, getCurrentProfile, getHydrationProgress, getMedicineAdherence, getTodayMedicineSchedule, getTodayWaterLog, getWeeklySeries } from "@shared/data/selectors";
import { formatMonth } from "@shared/lib/date";
import { formatNumber } from "@shared/lib/format";

export function HomePage() {
  const { state } = useAppData();
  const profile = getCurrentProfile(state);
  const hydration = getTodayWaterLog(state);
  const adherence = getMedicineAdherence(state);
  const todaysSchedule = getTodayMedicineSchedule(state);
  const schedule = todaysSchedule.slice(0, 2);
  const week = getWeeklySeries(state);
  const activeIndex = week.length - 2;
  const hydrationProgress = getHydrationProgress(state);
  const monthLabel = week.at(-1)?.key ? formatMonth(new Date(`${week.at(-1)?.key}T00:00:00`).getTime()) : formatMonth(0);

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="flex items-start justify-between gap-4 min-[400px]:items-center">
        <div className="flex items-center gap-3.5">
          <span className="h-12 w-12 rounded-full border border-white/60 bg-[var(--peach-100)] shadow-[var(--shadow-soft)]" />
          <div>
            <div className="section-kicker">Good morning</div>
            <div className="text-[25px] font-extrabold leading-tight text-[var(--text)]">{profile?.fullName ?? "Nghia Nguyen"}</div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link aria-label="Open status" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/status">
            <CalendarDays size={20} />
          </Link>
          <Link aria-label="Open notifications" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/notifications">
            <Bell size={20} />
          </Link>
        </div>
      </div>

      <Card className="hero-panel grid gap-6 min-[420px]:grid-cols-[minmax(0,1fr)_120px] min-[420px]:items-center" tone="lime">
        <div className="section-stack">
          <div className="section-kicker text-[var(--lime-700)]">Today&apos;s care plan</div>
          <h1 className="hero-title max-w-[13ch]">Keep today steady and easy to follow.</h1>
          <p className="hero-copy max-w-[21rem]">
            {todaysSchedule.length} medicine reminders are in your plan. Hydration is {Math.round(hydrationProgress)}%
            complete so far.
          </p>
          <div className="grid gap-3 min-[360px]:grid-cols-2">
            <div className="metric-chip">
              <div className="section-kicker">Next up</div>
              <div className="text-lg font-extrabold text-[var(--text)]">{schedule[0]?.medicine.name ?? "All caught up"}</div>
            </div>
            <div className="metric-chip">
              <div className="section-kicker">Water goal</div>
              <div className="text-lg font-extrabold text-[var(--text)]">
                {hydration?.cups ?? 0} / {hydration?.goal ?? 10} cups
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto rounded-[28px] bg-white/55 p-3 shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] min-[420px]:mx-0">
          <ProgressRing label="days" size={112} value={adherence} />
        </div>
      </Card>

      <div className="grid gap-4 min-[360px]:grid-cols-2">
        <Card tone="surface">
          <div className="section-stack">
            <div className="flex items-center justify-between gap-4">
              <div className="section-kicker">Movement</div>
              <span className="icon-badge h-8 w-8 bg-[var(--peach-100)] text-[var(--text)]">
                <Footprints size={16} />
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-[30px] font-extrabold leading-none text-[var(--text)]">{formatNumber(week.at(-1)?.steps ?? 0)}</div>
              <div className="pb-1 text-sm text-[var(--muted)]">steps</div>
            </div>
            <div className="text-sm text-[var(--muted)]">A steady walk keeps your care day balanced.</div>
          </div>
        </Card>
        <Card tone="surface">
          <div className="section-stack">
            <div className="flex items-center justify-between gap-4">
              <div className="section-kicker">Hydration</div>
              <span className="icon-badge h-8 w-8 bg-[var(--blue-100)] text-[var(--text)]">
                <Droplets size={16} />
              </span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-[30px] font-extrabold leading-none text-[var(--text)]">{hydration?.cups ?? 0}</div>
              <div className="pb-1 text-sm text-[var(--muted)]">glass</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div className="h-full rounded-full bg-[var(--lime-500)]" style={{ width: `${hydrationProgress}%` }} />
            </div>
          </div>
        </Card>
      </div>

      <Card tone="surface">
        <div className="section-stack">
          <div>
            <div className="section-kicker">This week</div>
            <div className="text-[20px] font-extrabold text-[var(--text)]">{monthLabel}</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[var(--muted)]">
            {["S", "M", "T", "W", "T", "F", "S"].map((letter) => (
              <span key={letter}>{letter}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2.5 text-center text-sm font-semibold">
            {week.map((entry, index) => (
              <span
                className={
                  index === activeIndex
                    ? "rounded-[18px] bg-[var(--lime-500)] px-2 py-2 text-[var(--text)]"
                    : "rounded-[18px] bg-[rgba(245,247,240,0.88)] px-2 py-2 text-[var(--text)]"
                }
                key={entry.key}
              >
                {new Date(`${entry.key}T00:00:00`).getDate()}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="section-stack">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="section-kicker">Medicine plan</div>
              <div className="text-[22px] font-extrabold text-[var(--text)]">Today&apos;s Medicine</div>
            </div>
            <Link className="text-sm font-semibold text-[var(--lime-700)]" to="/medicine">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {schedule.map((entry) => (
              <Link
                className="flex flex-col items-start gap-3 rounded-[26px] border border-white/60 bg-[rgba(245,247,240,0.92)] px-4 py-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between"
                key={`${entry.medicine._id}-${entry.scheduledFor}`}
                to={`/medicine/${entry.medicine._id}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="icon-badge h-10 w-10 bg-[var(--lime-100)] text-[var(--lime-700)]">
                    <PillIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-extrabold text-[var(--text)]">{entry.medicine.name}</div>
                    <div className="text-sm text-[var(--muted)]">{buildReminderPreview(entry.medicine, entry.log)}</div>
                  </div>
                </div>
                <Pill className="shrink-0" tone={entry.log?.status === "taken" ? "lime" : "white"}>
                  {entry.medicine.note ?? "Reminder"}
                </Pill>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </AppFrame>
  );
}
