import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { addDays, formatShortDate } from "@shared/lib/date";

const followUpSchema = z.object({
  name: z.string().min(3),
  triggerType: z.string().min(2),
  triggerLabel: z.string().min(3),
  condition: z.string().min(3),
  delayDays: z.coerce.number().min(1).max(365),
  channel: z.string().min(2),
  status: z.string().min(2),
});

export function FollowUpPage() {
  const { state, saveFollowUpRule } = useAppData();
  const form = useForm({
    defaultValues: {
      name: "High blood sugar result",
      triggerType: "lab",
      triggerLabel: "A1C above threshold",
      condition: "A1C >= 7.0",
      delayDays: 14,
      channel: "app+zalo+clinic",
      status: "active",
    },
    resolver: zodResolver(followUpSchema),
  });

  async function handleSubmit(values: z.infer<typeof followUpSchema>) {
    await saveFollowUpRule(values);
  }

  return (
    <AdminShell
      description="Turn health-check results into clinic or hospital reminders and review upcoming workloads before they reach users."
      title="Follow-up"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card tone="surface">
          <div className="space-y-5">
            <div className="text-[24px] font-extrabold text-[var(--text)]">Rule builder</div>
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <InputField label="Rule name" {...form.register("name")} />
              <InputField label="Trigger type" {...form.register("triggerType")} />
              <InputField label="Trigger label" {...form.register("triggerLabel")} />
              <InputField label="Condition" {...form.register("condition")} />
              <InputField label="Delay days" type="number" {...form.register("delayDays")} />
              <InputField label="Channel" {...form.register("channel")} />
              <InputField label="Status" {...form.register("status")} />
              <Button type="submit">Save rule</Button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              <Card tone="lime">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Trigger</div>
                  <div className="text-lg font-extrabold text-[var(--text)]">High blood sugar result</div>
                  <div className="text-sm text-[var(--muted)]">A1C above threshold</div>
                </div>
              </Card>
              <Card tone="blue">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Action</div>
                  <div className="text-lg font-extrabold text-[var(--text)]">Remind doctor visit in 14 days</div>
                  <div className="text-sm text-[var(--muted)]">App + Zalo + clinic note</div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <Card tone="surface">
          <div className="space-y-5">
            <div className="text-[24px] font-extrabold text-[var(--text)]">Review queue</div>
            <div className="table-header grid-cols-[1.2fr_1fr_0.8fr_1fr_0.8fr] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <span>Patient</span>
              <span>Rule</span>
              <span>Due</span>
              <span>Channel</span>
              <span>Status</span>
            </div>
            {state.healthCheckResults.slice(0, 3).map((result, index) => (
              <div className="table-row" key={result._id}>
                <span className="font-extrabold text-[var(--text)]" data-label="Patient">
                  {["Lan Tran", "Minh Le", "Huyen Pham"][index] ?? "Patient"}
                </span>
                <span className="text-sm text-[var(--muted)]" data-label="Rule">
                  {state.followUpRules[index]?.name ?? result.metric}
                </span>
                <span className="text-sm text-[var(--muted)]" data-label="Due">
                  {formatShortDate(addDays(result.observedAt, state.followUpRules[index]?.delayDays ?? index + 7))}
                </span>
                <span className="text-sm text-[var(--muted)]" data-label="Channel">
                  {state.followUpRules[index]?.channel ?? "app+zalo"}
                </span>
                <span data-label="Status">
                  <Pill tone={index % 2 === 0 ? "lime" : "soft"}>{index % 2 === 0 ? "Ready" : "Pending"}</Pill>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
