import { Bell, Pill as PillIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { findProductForMedicine, getActiveMedicines, getCurrentUser, getMedicineAdherence, getTodayMedicineSchedule } from "@shared/data/selectors";
import { formatClock } from "@shared/lib/date";

export function MedicinePage() {
  const { state, setMedicineStatus } = useAppData();
  const currentUser = getCurrentUser(state);
  const schedule = getTodayMedicineSchedule(state);
  const activeMedicines = getActiveMedicines(state);
  const nextLogs = state.medicineLogs.filter((entry) => entry.userId === currentUser?._id && entry.status !== "taken").length;
  const adherence = Math.round(getMedicineAdherence(state));
  const takenCount = schedule.filter((entry) => entry.log?.status === "taken").length;

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="flex items-start justify-between gap-4 min-[400px]:items-center">
        <div className="section-stack">
          <div className="section-kicker">Medicine plan</div>
          <h1 className="text-[30px] font-extrabold text-[var(--text)]">Medicine</h1>
          <p className="support-copy">Track doses, reminder context, and what to avoid around each plan.</p>
        </div>
        <Link aria-label="Open notifications" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/notifications">
          <Bell size={20} />
        </Link>
      </div>

      <div className="surface-card inline-flex w-fit gap-2 rounded-full p-1.5">
        <Pill className="min-w-[84px]" tone="lime">
          Today
        </Pill>
        <Pill className="min-w-[84px]" tone="white">
          Upcoming
        </Pill>
      </div>

      <Card className="hero-panel grid gap-5 min-[420px]:grid-cols-[minmax(0,1fr)_minmax(0,164px)] min-[420px]:items-center" tone="lime">
        <div className="section-stack">
          <div className="section-kicker text-[var(--lime-700)]">Today&apos;s adherence</div>
          <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">{nextLogs} doses still waiting</div>
          <p className="hero-copy max-w-[18rem]">Stay consistent to keep your medicine plan on track throughout the week.</p>
        </div>
        <div className="grid gap-3 rounded-[28px] bg-white/55 p-3 shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] min-[420px]:min-w-[164px]">
          <div className="metric-chip">
            <div className="section-kicker">This week</div>
            <div className="text-[28px] font-extrabold leading-none text-[var(--text)]">{adherence}%</div>
          </div>
          <div className="metric-chip">
            <div className="section-kicker">Taken today</div>
            <div className="text-lg font-extrabold text-[var(--text)]">{takenCount}</div>
          </div>
        </div>
      </Card>

      <div className="section-stack">
        <div>
          <div className="section-kicker">Dose list</div>
          <div className="text-xl font-extrabold text-[var(--text)]">Today&apos;s schedule</div>
        </div>
        {schedule.map((entry) => {
          const product = findProductForMedicine(state.products, entry.medicine);
          return (
            <Card className="space-y-4 rounded-[28px]" key={`${entry.medicine._id}-${entry.scheduledFor}`} tone="surface">
              <div className="flex flex-col gap-4 min-[400px]:flex-row min-[400px]:items-start min-[400px]:justify-between">
                <Link className="flex min-w-0 items-start gap-3" to={`/medicine/${entry.medicine._id}`}>
                  <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
                    <PillIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-lg font-extrabold text-[var(--text)]">{entry.medicine.name}</div>
                    <div className="text-sm text-[var(--muted)]">
                      {formatClock(entry.scheduleTime)} • {entry.medicine.dosage}
                    </div>
                  </div>
                </Link>
                <button
                  aria-label={entry.log?.status === "taken" ? `Mark ${entry.medicine.name} as pending` : `Mark ${entry.medicine.name} as taken`}
                  className={
                    entry.log?.status === "taken"
                      ? "inline-flex min-h-11 self-start items-center justify-center rounded-full bg-[var(--lime-100)] px-4 text-sm font-semibold text-[var(--lime-700)] min-[400px]:self-center"
                      : "inline-flex min-h-11 self-start items-center justify-center rounded-full bg-[var(--surface-soft)] px-4 text-sm font-semibold text-[var(--text)] min-[400px]:self-center"
                  }
                  onClick={() =>
                    void setMedicineStatus(
                      entry.medicine._id,
                      entry.scheduledFor,
                      entry.log?.status === "taken" ? "pending" : "taken",
                      entry.medicine.note,
                    )
                  }
                  type="button"
                >
                  {entry.log?.status === "taken" ? "Taken" : "Mark taken"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="soft">{product?.warningText ? product.warningText.split(".")[0] : entry.medicine.note ?? "Reminder"}</Pill>
                {entry.medicine.avoidItems.slice(0, 1).map((avoid) => (
                  <Pill key={avoid} tone="white">
                    {avoid}
                  </Pill>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 min-[400px]:grid-cols-2">
        <Card tone="peach">
          <div className="section-stack">
            <div className="section-kicker">Customer note</div>
            <div className="text-[15px] font-bold leading-6 text-[var(--text)]">
              Avoid candy, cake, and Coke close to your evening iron dose.
            </div>
          </div>
        </Card>

        <Card tone="soft">
          <div className="section-stack">
            <div className="section-kicker">Plan coverage</div>
            <div className="text-lg font-extrabold text-[var(--text)]">Active medicines</div>
            <div className="text-sm text-[var(--muted)]">{activeMedicines.length} products connected to your care plan.</div>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}
