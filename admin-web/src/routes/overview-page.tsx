import { CalendarClock, FileSpreadsheet, HeartPulse, ScanSearch } from "lucide-react";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";

export function OverviewPage() {
  const { state } = useAppData();
  const products = state.products.slice(0, 4);
  const workflowHealth = 98.4;
  const activeReminders = state.reminders.filter((reminder) => reminder.isActive).length;

  return (
    <AdminShell
      description="Coordinate product quality, reminder delivery, and follow-up timing from a dashboard that stays calm and readable under real clinic workloads."
      title="Medicine operations dashboard"
    >
      <div className="page-stack">
        <div className="grid gap-4 md:grid-cols-3">
          <Card tone="lime">
            <div className="section-stack">
              <div className="section-kicker text-[var(--lime-700)]">Catalog health</div>
              <div className="text-[32px] font-extrabold leading-none text-[var(--text)]">{state.products.length}</div>
              <div className="text-sm text-[var(--text)]">products ready for reminders and barcode lookup</div>
            </div>
          </Card>
          <Card tone="surface">
            <div className="section-stack">
              <div className="section-kicker">Active reminders</div>
              <div className="text-[32px] font-extrabold leading-none text-[var(--text)]">{activeReminders}</div>
              <div className="text-sm text-[var(--muted)]">live reminder flows covering app and Zalo delivery</div>
            </div>
          </Card>
          <Card tone="soft">
            <div className="section-stack">
              <div className="section-kicker">Follow-up queue</div>
              <div className="text-[32px] font-extrabold leading-none text-[var(--text)]">{state.followUpRules.length}</div>
              <div className="text-sm text-[var(--muted)]">rules currently watching clinic and hospital timing</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_340px]">
          <Card className="section-stack" tone="surface">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="section-stack">
                <div className="section-kicker">Operations snapshot</div>
                <div className="text-[26px] font-extrabold text-[var(--text)]">What the team should act on first</div>
              </div>
              <Pill tone="soft">Updated live</Pill>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4 rounded-[28px] bg-[rgba(245,247,240,0.96)] p-5">
                <div className="table-header grid-cols-[1.4fr_1fr_1fr_0.7fr] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span>Product</span>
                  <span>Reminder</span>
                  <span>Avoid</span>
                  <span>Status</span>
                </div>
                {products.map((product) => (
                  <div className="table-row" key={product._id}>
                    <span className="font-extrabold text-[var(--text)]" data-label="Product">
                      {product.name}
                    </span>
                    <span className="text-sm text-[var(--muted)]" data-label="Reminder">
                      {product.reminderNote ?? "08:00 Daily"}
                    </span>
                    <span className="text-sm text-[var(--muted)]" data-label="Avoid">
                      {product.avoidItems[0] ?? "None"}
                    </span>
                    <span data-label="Status">
                      <Pill>{product.status === "active" ? "Active" : "Review"}</Pill>
                    </span>
                  </div>
                ))}
              </div>
              <Card className="section-stack" tone="soft">
                <div className="section-stack">
                  <div className="section-kicker">Workflow health</div>
                  <div className="text-[52px] font-extrabold leading-none text-[var(--text)]">{workflowHealth}%</div>
                  <div className="text-sm text-[var(--muted)]">Scanner ingestion healthy and reminder delivery stable</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="white">App</Pill>
                  <Pill tone="white">Zalo</Pill>
                  <Pill tone="soft">Clinic export</Pill>
                </div>
              </Card>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card tone="surface">
              <div className="section-stack">
                <div className="flex items-center gap-3">
                  <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
                    <FileSpreadsheet size={18} />
                  </span>
                  <div className="text-lg font-extrabold text-[var(--text)]">Import readiness</div>
                </div>
                <div className="space-y-3 text-sm text-[var(--muted)]">
                  <div className="flex items-center justify-between rounded-[18px] bg-[rgba(245,247,240,0.92)] px-4 py-3">
                    <span>Last Excel import</span>
                    <span className="font-semibold text-[var(--text)]">today 09:12</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[18px] bg-[rgba(245,247,240,0.92)] px-4 py-3">
                    <span>Last scanner update</span>
                    <span className="font-semibold text-[var(--text)]">10 min ago</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card tone="mint">
              <div className="section-stack">
                <div className="flex items-center gap-3">
                  <span className="icon-badge bg-white text-[var(--lime-700)]">
                    <HeartPulse size={18} />
                  </span>
                  <div className="text-lg font-extrabold text-[var(--text)]">Customer reach</div>
                </div>
                <div className="text-sm leading-6 text-[var(--muted)]">
                  {state.directMessages.length} direct sends queued. {state.notifications.length} wellness notifications are ready.
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex items-center gap-4" tone="lime">
            <span className="icon-badge bg-white text-[var(--lime-700)]">
              <ScanSearch size={18} />
            </span>
            <div className="section-stack gap-1">
              <div className="text-sm font-extrabold text-[var(--text)]">Scanner + Excel intake</div>
              <div className="text-sm text-[var(--muted)]">Capture or import product batches cleanly.</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4" tone="blue">
            <span className="icon-badge bg-white text-[var(--text)]">
              <CalendarClock size={18} />
            </span>
            <div className="section-stack gap-1">
              <div className="text-sm font-extrabold text-[var(--text)]">Doctor follow-up reminders</div>
              <div className="text-sm text-[var(--muted)]">Rules, queue reviews, and direct patient outreach.</div>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
