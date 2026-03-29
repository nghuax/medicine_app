import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, ShieldCheck, Watch } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";

const verifySchema = z.object({
  code: z.string().min(4).max(6),
});

export function VerifyPage() {
  const navigate = useNavigate();
  const { state, verifyOtpCode, currentUser, currentProfile } = useAppData();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof verifySchema>>({
    defaultValues: { code: state.session.demoOtpCode },
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    const ok = await verifyOtpCode(values.code);
    if (!ok) {
      setError("code", { message: "The OTP code does not match the mock flow." });
      return;
    }
    navigate("/profile");
  }

  return (
    <AppFrame>
      <div className="space-y-4">
        <div className="section-stack">
          <h1 className="text-[30px] font-extrabold leading-[1.1] text-[var(--text)]">Verify &amp; connect</h1>
          <p className="support-copy">
            Confirm your phone number, enable reminders, and connect your health devices before starting.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            error={errors.code?.message}
            helper={`OTP sent to ${state.session.phone}. Use 4826 in this mock flow.`}
            label="Verification code"
            maxLength={6}
            placeholder="4826"
            {...register("code")}
          />
          <Button disabled={isSubmitting} type="submit">
            Start app setup
          </Button>
        </form>

        <Card tone="surface">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
                <BellRing size={18} />
              </span>
              <div>
                <div className="text-sm font-extrabold text-[var(--text)]">Notifications enabled</div>
                <div className="text-sm text-[var(--muted)]">Medicine, water, and mood reminders stay on schedule.</div>
              </div>
            </div>
            <Pill>Recommended</Pill>
          </div>
        </Card>

        <div className="grid gap-4 min-[400px]:grid-cols-2">
          <Card tone="mint">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="icon-badge bg-white text-[var(--lime-700)]">
                  <Watch size={18} />
                </span>
                <div className="text-sm font-extrabold text-[var(--text)]">Health device access</div>
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">Pull steps, workouts, sleep, and heart trends.</p>
              <Pill tone="white">Apple Watch</Pill>
            </div>
          </Card>
          <Card tone="soft">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="icon-badge bg-white text-[var(--lime-700)]">
                  <ShieldCheck size={18} />
                </span>
                <div className="text-sm font-extrabold text-[var(--text)]">Zalo linked</div>
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">Back-up delivery for clinic follow-up and missed doses.</p>
              <Pill tone={currentUser?.zaloConnected ? "lime" : "soft"}>{currentUser?.zaloConnected ? "Connected" : "Ready"}</Pill>
            </div>
          </Card>
        </div>

        <Card tone="surface">
          <div className="space-y-2">
            <div className="text-sm font-extrabold text-[var(--text)]">You are ready to personalize your medicine schedule.</div>
            <div className="text-sm text-[var(--muted)]">
              Current profile: {currentProfile?.fullName ?? "New member"} • {currentProfile?.bloodType ?? "O+"}
            </div>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}
