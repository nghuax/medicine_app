import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField, TextareaField } from "@shared/components/ui/input";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { directMessageSchema } from "@shared/lib/validators";

export function MessagesPage() {
  const { state, sendDirectMessage } = useAppData();
  const form = useForm({
    defaultValues: {
      phone: state.users[0]?.phone ?? "",
      type: "medicine-reminder",
      channel: "zalo+app",
      body: "Hi Nghia Nguyen, this is a reminder to take Ferrous Sulfate at 8:00 PM and avoid coffee nearby.",
    },
    resolver: zodResolver(directMessageSchema),
  });

  async function handleSubmit(values: { phone: string; type: string; channel: string; body: string }) {
    await sendDirectMessage(values);
  }

  return (
    <AdminShell
      description="Preview customer communication, send direct reminders to a phone number, and monitor delivery states across app and Zalo."
      title="Messages"
    >
      <div className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card tone="surface">
            <div className="space-y-5">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Customer communication preview</div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card tone="soft">
                  <div className="space-y-3">
                    <div className="text-lg font-extrabold text-[var(--text)]">20:00 Take Ferrous Sulfate</div>
                    <div className="text-sm leading-6 text-[var(--muted)]">
                      1 capsule with water only. Avoid coffee, tea, and cola nearby.
                    </div>
                    <Pill tone="white">App notification</Pill>
                  </div>
                </Card>
                <Card tone="soft">
                  <div className="space-y-3">
                    <div className="text-lg font-extrabold text-[var(--text)]">Clinic follow-up reminder</div>
                    <div className="text-sm leading-6 text-[var(--muted)]">
                      Sunrise Medical: please revisit in 14 days based on your latest result.
                    </div>
                    <Pill tone="white">Zalo delivery</Pill>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          <Card tone="surface">
            <div className="space-y-5">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Direct user send</div>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField error={form.formState.errors.phone?.message} label="Phone number" {...form.register("phone")} />
                <InputField error={form.formState.errors.type?.message} label="Message type" {...form.register("type")} />
                <InputField error={form.formState.errors.channel?.message} label="Channel" {...form.register("channel")} />
                <div className="md:col-span-2">
                  <TextareaField error={form.formState.errors.body?.message} label="Preview message" {...form.register("body")} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit">Send now</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        <Card tone="surface">
          <div className="space-y-5">
            <div className="text-[24px] font-extrabold text-[var(--text)]">Delivery status</div>
            <div className="space-y-3">
              {state.directMessages.slice(0, 6).map((message) => (
                <div className="rounded-[24px] bg-[rgba(245,247,240,0.92)] px-5 py-5" key={message._id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="text-lg font-extrabold text-[var(--text)]">{message.type}</div>
                      <div className="text-sm leading-6 text-[var(--muted)]">{message.preview}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {state.messageDeliveries
                        .filter((delivery) => delivery.directMessageId === message._id)
                        .map((delivery) => (
                          <Pill key={delivery._id} tone={delivery.status === "delivered" ? "lime" : "soft"}>
                            {delivery.channel}: {delivery.status}
                          </Pill>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
