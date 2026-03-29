import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField, TextareaField } from "@shared/components/ui/input";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { hoursFromNow } from "@shared/lib/date";
import { reminderSchema } from "@shared/lib/validators";

export function RemindersPage() {
  const { state, saveAdminNote, saveReminder } = useAppData();
  const reminderForm = useForm({
    defaultValues: {
      title: "Drink water reminder",
      body: "You are 2 cups away from today's goal.",
      channel: "app",
      type: "water",
      repeatRule: "daily",
    },
    resolver: zodResolver(reminderSchema),
  });

  const noteForm = useForm({
    defaultValues: {
      title: "What to avoid consume",
      body: "Caffeine-heavy drinks should stay away from iron and sleep reminders.",
      type: "avoid-guidance",
      createdBy: "Admin Linh",
    },
  });

  async function handleReminder(values: { title: string; body: string; channel: string; type: string; repeatRule?: string }) {
    const user = state.users[0];
    await saveReminder({
      userId: user?._id,
      medicineId: undefined,
      title: values.title,
      body: values.body,
      channel: values.channel,
      type: values.type,
      dueAt: hoursFromNow(1),
      repeatRule: values.repeatRule,
      isActive: true,
    });
  }

  async function handleNote(values: { title: string; body: string; type: string; createdBy: string }) {
    await saveAdminNote(values);
  }

  return (
    <AdminShell
      description="Manage recurring customer reminders, note authoring, and avoid-consume guidance without breaking the calm health-focused UI."
      title="Reminders"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="grid gap-6">
          <Card tone="surface">
            <div className="space-y-5">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Reminder management</div>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={reminderForm.handleSubmit(handleReminder)}>
                <InputField error={reminderForm.formState.errors.title?.message} label="Title" {...reminderForm.register("title")} />
                <InputField error={reminderForm.formState.errors.type?.message} label="Type" {...reminderForm.register("type")} />
                <InputField error={reminderForm.formState.errors.channel?.message} label="Channel" {...reminderForm.register("channel")} />
                <InputField error={reminderForm.formState.errors.repeatRule?.message} label="Repeat rule" {...reminderForm.register("repeatRule")} />
                <TextareaField className="md:col-span-2" error={reminderForm.formState.errors.body?.message} label="Body" {...reminderForm.register("body")} />
                <div className="md:col-span-2">
                  <Button type="submit">Save reminder</Button>
                </div>
              </form>
            </div>
          </Card>

          <Card tone="surface">
            <div className="space-y-5">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Customer note management</div>
              <form className="grid gap-4" onSubmit={noteForm.handleSubmit(handleNote)}>
                <InputField label="Note title" {...noteForm.register("title")} />
                <InputField label="Type" {...noteForm.register("type")} />
                <TextareaField label="Message" {...noteForm.register("body")} />
                <Button type="submit">Save note</Button>
              </form>
            </div>
          </Card>
        </div>

        <Card tone="surface">
          <div className="space-y-5">
            <div className="text-[24px] font-extrabold text-[var(--text)]">What to avoid consume</div>
            <div className="flex flex-wrap gap-2">
              {state.products.flatMap((product) => product.avoidItems).slice(0, 12).map((item) => (
                <Pill key={item} tone="soft">
                  {item}
                </Pill>
              ))}
            </div>
            <div className="space-y-3">
              {state.adminNotes.slice(0, 4).map((note) => (
                <div className="rounded-[20px] bg-[rgba(245,247,240,0.92)] px-4 py-4" key={note._id}>
                  <div className="text-sm font-extrabold text-[var(--text)]">{note.title}</div>
                  <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{note.body}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
