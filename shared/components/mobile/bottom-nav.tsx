import { Activity, Bell, House, Pill, ScanSearch } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@shared/lib/cn";

const navItems = [
  { label: "Home", to: "/home", icon: House },
  { label: "Medicine", to: "/medicine", icon: Pill },
  { label: "Scan", to: "/scan", icon: ScanSearch, primary: true },
  { label: "Daily", to: "/daily", icon: Activity },
  { label: "Status", to: "/status", icon: Bell },
];

export function BottomNav() {
  return (
    <nav aria-label="Primary mobile navigation" className="bottom-bar">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              "flex min-h-[52px] flex-col items-center justify-center gap-1.5 rounded-[24px] px-0.5 py-1 text-center text-[11px] font-medium leading-none text-[var(--muted)] transition-colors",
              isActive && !item.primary && "text-[var(--text)]",
            )
          }
          key={item.to}
          to={item.to}
          aria-label={item.label}
          end={item.to === "/home"}
        >
          {({ isActive }) => {
            const Icon = item.icon;
            return item.primary ? (
              <>
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(228,247,182,0.65)] text-[var(--lime-700)] shadow-[var(--shadow-soft)] min-[400px]:h-[58px] min-[400px]:w-[58px]",
                    isActive && "bg-[var(--lime-500)] text-[var(--text)]",
                  )}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </span>
                <span className={cn("max-w-[4.5rem] text-[11px] font-semibold", isActive && "text-[var(--text)]")}>{item.label}</span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    isActive && "bg-[var(--surface-soft)] text-[var(--lime-700)]",
                  )}
                >
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
