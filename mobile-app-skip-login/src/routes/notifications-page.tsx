import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { getCurrentUser } from "@shared/data/selectors";
import { formatClock } from "@shared/lib/date";

export function NotificationsPage() {
  const { state, markNotification } = useAppData();
  const currentUser = getCurrentUser(state);
  const notifications = state.notifications
    .filter((entry) => entry.userId === currentUser?._id)
    .sort((left, right) => right.dueAt - left.dueAt);

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">Notifications</h1>
        <p className="support-copy">Medicine reminders, drink water nudges, mood checks, and end-of-day warnings.</p>
      </div>

      <Card className="hero-panel" tone="soft">
        <div className="space-y-2">
          <div className="text-lg font-extrabold text-[var(--text)]">2 reminders still need attention today.</div>
          <div className="text-sm text-[var(--muted)]">We can notify again in-app and through Zalo if you need another nudge.</div>
        </div>
      </Card>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification._id} tone={notification.type === "warning" ? "peach" : "surface"}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-lg font-extrabold text-[var(--text)]">{notification.title}</div>
                  <div className="text-sm leading-6 text-[var(--muted)]">{notification.body}</div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{formatClock(notification.dueAt)}</div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={notification.status === "needs-action" ? "lime" : "soft"}>
                  {notification.status === "needs-action" ? "Needs action" : notification.channel}
                </Pill>
                <Button
                  className="min-h-10 px-4"
                  fullWidth={false}
                  onClick={() => markNotification(notification._id, "done")}
                  variant="secondary"
                >
                  Mark done
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppFrame>
  );
}
