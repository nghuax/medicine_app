import type { PropsWithChildren, ReactNode } from "react";
import { BarChart3, BellDot, ClipboardList, Inbox, MessageSquare, PackageSearch } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@shared/lib/cn";

const navItems = [
  { label: "Overview", to: "/", icon: BarChart3 },
  { label: "Products", to: "/products", icon: PackageSearch },
  { label: "Import", to: "/import", icon: Inbox },
  { label: "Reminders", to: "/reminders", icon: BellDot },
  { label: "Follow-up", to: "/follow-up", icon: ClipboardList },
  { label: "Messages", to: "/messages", icon: MessageSquare },
];

interface AdminShellProps {
  title: string;
  description: string;
  headerActions?: ReactNode;
}

export function AdminShell({
  children,
  title,
  description,
  headerActions,
}: PropsWithChildren<AdminShellProps>) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">
        Skip to content
      </a>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--lime-100)] text-[var(--lime-700)]">
              <PackageSearch size={22} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">MediFlow</div>
              <div className="text-lg font-extrabold text-[var(--text)]">Admin HQ</div>
            </div>
          </div>
          <nav aria-label="Admin sections" className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-[24px] px-4 py-3 text-sm font-semibold text-[var(--muted)] transition-colors",
                      isActive
                        ? "bg-[var(--lime-100)] text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(127,186,30,0.06)]"
                        : "hover:bg-white/70 hover:text-[var(--text)]",
                    )
                  }
                  end={item.to === "/"}
                  key={item.to}
                  to={item.to}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <main className="admin-content" id="admin-main" tabIndex={-1}>
          <header className="admin-hero flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl section-stack">
              <div className="section-kicker">Operations workspace</div>
              <h1 className="hero-title max-w-3xl">{title}</h1>
              <p className="hero-copy">{description}</p>
            </div>
            {headerActions ? <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">{headerActions}</div> : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
