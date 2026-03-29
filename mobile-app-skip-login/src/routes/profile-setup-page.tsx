import { zodResolver } from "@hookform/resolvers/zod";
import { Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { useAppData } from "@shared/data/app-provider";
import { profileSchema } from "@shared/lib/validators";
import type { BloodType } from "@shared/types/domain";

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { currentProfile, saveProfile, syncWearables } = useAppData();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: currentProfile?.fullName ?? "Nghia Nguyen",
      heightCm: currentProfile?.heightCm ?? 174,
      bloodType: (currentProfile?.bloodType as BloodType | undefined) ?? "B+",
      deviceSyncEnabled: currentProfile?.deviceSyncEnabled ?? true,
    },
    resolver: zodResolver(profileSchema),
  });

  const deviceSyncEnabled = watch("deviceSyncEnabled");

  async function onSubmit(values: {
    fullName: string;
    heightCm: number;
    bloodType: string;
    deviceSyncEnabled: boolean;
  }) {
    await saveProfile(values);
    await syncWearables(values.deviceSyncEnabled);
    navigate("/home");
  }

  return (
    <AppFrame>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="section-stack">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-[var(--text)]">Create your health profile</h1>
          <p className="support-copy">
            Name, height, and blood type sync securely to Convex for reminders and long-term tracking.
          </p>
          <div className="flex gap-3 pt-2">
            <span className="h-1.5 flex-1 rounded-full bg-[var(--lime-500)]" />
            <span className="h-1.5 flex-1 rounded-full bg-[var(--surface-soft)]" />
            <span className="h-1.5 flex-1 rounded-full bg-[var(--surface-soft)]" />
          </div>
        </div>

        <InputField error={errors.fullName?.message} label="Full name" {...register("fullName")} />
        <InputField error={errors.heightCm?.message} label="Height" type="number" {...register("heightCm")} />
        <InputField error={errors.bloodType?.message} label="Blood type" {...register("bloodType")} />

        <Card tone="mint">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="icon-badge bg-white text-[var(--lime-700)]">
                <Watch size={18} />
              </span>
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-[var(--text)]">Connect Apple Watch or smartwatch</div>
                <div className="text-sm text-[var(--muted)]">Sync steps, sleep, and activity automatically.</div>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]">
              <input className="accent-[var(--lime-700)]" type="checkbox" {...register("deviceSyncEnabled")} />
              {deviceSyncEnabled ? "On" : "Off"}
            </label>
          </div>
        </Card>

        <Card tone="soft">
          <div className="space-y-3">
            <div className="w-fit">
              <span className="pill pill-white">Sync to Convex</span>
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Your data will power reminders, trends, and doctor follow-up timing.
            </p>
          </div>
        </Card>

        <Button disabled={isSubmitting} type="submit">
          Save profile
        </Button>
      </form>
    </AppFrame>
  );
}
