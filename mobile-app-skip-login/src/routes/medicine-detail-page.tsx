import { Bell, ChevronLeft, Pill as PillIcon } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { findProductForMedicine } from "@shared/data/selectors";

export function MedicineDetailPage() {
  const { medicineId } = useParams();
  const { state } = useAppData();
  const medicine = state.medicines.find((entry) => entry._id === medicineId);

  if (!medicine) {
    return <Navigate replace to="/medicine" />;
  }

  const product = findProductForMedicine(state.products, medicine);
  const history = state.medicineLogs
    .filter((entry) => entry.medicineId === medicine._id)
    .sort((left, right) => right.scheduledFor - left.scheduledFor)
    .slice(0, 4);

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="flex items-start justify-between gap-4 min-[400px]:items-center">
        <Link aria-label="Back to medicine list" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/medicine">
          <ChevronLeft size={20} />
        </Link>
        <Link aria-label="Open notifications" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/notifications">
          <Bell size={20} />
        </Link>
      </div>

      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">{medicine.name}</h1>
        <p className="support-copy">{medicine.strength} • {medicine.form} • {product?.brand ?? "Medicine detail"}</p>
      </div>

      <Card className="hero-panel" tone="lime">
        <div className="flex items-start gap-4">
          <span className="icon-badge bg-white text-[var(--lime-700)]">
            <PillIcon size={18} />
          </span>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-[var(--muted)]">Adherence this week</div>
            <div className="text-[42px] font-extrabold leading-none text-[var(--text)]">{medicine.adherenceRate}%</div>
            <div className="text-sm text-[var(--muted)]">{medicine.note}</div>
          </div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Dose schedule</div>
          <div className="flex flex-wrap gap-3">
            {medicine.scheduleTimes.map((time) => (
              <Pill key={time}>{time}</Pill>
            ))}
          </div>
          <div className="text-sm text-[var(--muted)]">{medicine.dosage} each time</div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Care note</div>
          <div className="text-[15px] font-bold leading-6 text-[var(--text)]">
            {product?.warningText ?? medicine.note ?? "Take with your planned routine."}
          </div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="space-y-4">
          <div className="text-xl font-extrabold text-[var(--text)]">Recent intake history</div>
          <div className="space-y-3">
            {history.map((entry) => (
              <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/60 bg-[rgba(245,247,240,0.92)] px-4 py-3" key={entry._id}>
                <div className="min-w-0 text-sm font-semibold text-[var(--text)]">{new Date(entry.scheduledFor).toLocaleString()}</div>
                <div className="text-sm text-[var(--muted)]">{entry.status === "taken" ? "Taken on time" : entry.status}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </AppFrame>
  );
}
