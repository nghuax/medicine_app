import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";

export function ProductInsightPage() {
  const { barcode } = useParams();
  const { state } = useAppData();
  const product = state.products.find((entry) => entry.barcode === barcode);

  if (!product) {
    return <Navigate replace to="/scan" />;
  }

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <Link aria-label="Back to scan" className="surface-card flex h-11 w-11 items-center justify-center rounded-full" to="/scan">
        <ChevronLeft size={20} />
      </Link>

      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">Product insight</h1>
        <p className="support-copy">Scanned barcode: {product.name}</p>
      </div>

      <Card className="overflow-hidden bg-[#131d33] text-white" tone="surface">
        <div className="space-y-5">
          <div className="text-sm font-semibold">Barcode matched</div>
          <div className="rounded-[28px] bg-[rgba(255,255,255,0.12)] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Matched product</div>
            <div className="mt-2 text-[24px] font-extrabold leading-tight">{product.name}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill pill-white">{product.category}</span>
              <span className="pill border border-white/20 bg-white/10 text-white">{product.barcode}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card tone="surface">
        <div className="grid gap-4 min-[400px]:grid-cols-[auto_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Per serving</div>
            <div className="mt-2 text-[36px] font-extrabold leading-none text-[var(--text)]">{product.calories} kcal</div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-[var(--muted)]">{product.category}</div>
            <div className="flex flex-wrap gap-2">
              <Pill>{product.sugarGrams === 0 ? "Zero sugar" : `${product.sugarGrams}g sugar`}</Pill>
              {product.caffeineMg > 0 ? <Pill tone="soft">Caffeine</Pill> : null}
            </div>
          </div>
        </div>
      </Card>

      <Card tone="peach">
        <div className="space-y-2">
          <div className="text-lg font-extrabold text-[var(--text)]">{product.warningText}</div>
          <div className="text-sm leading-6 text-[var(--muted)]">
            The admin note warns against caffeine near ferrous sulfate doses.
          </div>
        </div>
      </Card>

      <Card tone="mint">
        <div className="text-[15px] font-bold leading-6 text-[var(--text)]">{product.alternativeText}</div>
      </Card>
    </AppFrame>
  );
}
