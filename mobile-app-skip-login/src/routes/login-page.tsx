import { zodResolver } from "@hookform/resolvers/zod";
import { HeartPulse, ShieldCheck, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { useAppData } from "@shared/data/app-provider";
import { getMedicineAdherence, getTodayDailyLog, getTodayWaterLog } from "@shared/data/selectors";
import { phoneSchema } from "@shared/lib/validators";

const loginFormSchema = z.object({
  phone: phoneSchema,
});

export function LoginPage() {
  const navigate = useNavigate();
  const { requestOtp, connectZalo, state } = useAppData();
  const dailyLog = getTodayDailyLog(state);
  const waterLog = getTodayWaterLog(state);
  const adherence = getMedicineAdherence(state);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginFormSchema>>({
    defaultValues: { phone: state.session.phone },
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    await requestOtp(values.phone);
    navigate("/verify");
  }

  return (
    <AppFrame className="overflow-hidden">
      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute -right-16 top-12 h-40 w-40 rounded-full bg-[rgba(228,247,182,0.95)] blur-xl" />
        <div className="pointer-events-none absolute -left-12 bottom-24 h-36 w-36 rounded-full bg-[rgba(216,241,255,0.9)] blur-xl" />
        <div className="surface-card inline-flex w-fit items-center gap-3 rounded-full px-4 py-3">
          <span className="icon-badge h-10 w-10 bg-[var(--lime-100)] text-[var(--lime-700)]">
            <HeartPulse size={18} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">MediFlow</div>
            <div className="text-sm font-extrabold text-[var(--text)]">Health rhythm companion</div>
          </div>
        </div>

        <div className="section-stack max-w-[22rem] pt-1">
          <div className="section-kicker">Personal care flow</div>
          <h1 className="hero-title">Keep medicine, hydration, and clinic follow-up in one calm routine.</h1>
          <p className="hero-copy">
            Sign in with your phone number to unlock reminders, then connect Zalo when you want an
            extra delivery channel for care updates.
          </p>
        </div>

        <Card className="hero-panel section-stack" tone="lime">
          <div className="section-stack">
            <div className="section-kicker text-[var(--lime-700)]">Your rhythm today</div>
            <div className="text-[44px] font-extrabold leading-none text-[var(--text)] min-[400px]:text-[48px]">{Math.round(adherence)}%</div>
            <div className="text-sm font-semibold text-[var(--text)]">medicine adherence</div>
          </div>
          <div className="grid gap-3 min-[360px]:grid-cols-2">
            <div className="metric-chip">
              <div className="section-kicker">Water</div>
              <div className="text-lg font-extrabold text-[var(--text)]">
                {waterLog?.cups ?? 0} / {waterLog?.goal ?? 10} cups
              </div>
            </div>
            <div className="metric-chip">
              <div className="section-kicker">Sleep</div>
              <div className="text-lg font-extrabold text-[var(--text)]">{dailyLog?.sleepHours ?? 0} hours</div>
            </div>
          </div>
        </Card>

        <Card className="section-stack" tone="surface">
          <div className="section-stack">
            <div className="section-kicker">Phone sign-in</div>
            <div className="text-[22px] font-extrabold leading-tight text-[var(--text)]">
              Use one number for reminders, follow-ups, and progress history.
            </div>
          </div>
          <form className="section-stack" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              autoComplete="tel"
              error={errors.phone?.message}
              label="Phone number"
              placeholder="+84 93 555 0182"
              {...register("phone")}
            />
            <Button disabled={isSubmitting} type="submit">
              Continue with phone
            </Button>
          </form>
        </Card>

        <Card className="section-stack" tone="soft">
          <div className="section-stack">
            <div className="section-kicker">Optional channel</div>
            <div className="text-lg font-extrabold text-[var(--text)]">Add Zalo for backup notification delivery.</div>
            <p className="support-copy">
              This keeps reminder delivery flexible while real Zalo credentials are still connected
              later.
            </p>
          </div>
          <Button className="gap-3" onClick={() => void connectZalo()} variant="secondary">
            <ShieldCheck size={18} />
            Connect Zalo notifications
          </Button>
        </Card>

        <Card tone="mint">
          <div className="flex items-start gap-3">
            <span className="icon-badge h-11 w-11 bg-white text-[var(--lime-700)]">
              <Smartphone size={18} />
            </span>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Notifications can be delivered through the app and Zalo. Demo OTP code:{" "}
              <span className="font-extrabold text-[var(--text)]">4826</span>
            </p>
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}
