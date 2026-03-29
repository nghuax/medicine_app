import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

interface AppFrameProps {
  header?: ReactNode;
  bottomNav?: ReactNode;
  className?: string;
}

export function AppFrame({ children, header, bottomNav, className }: PropsWithChildren<AppFrameProps>) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#mobile-main">
        Skip to content
      </a>
      <div className="app-frame">
        <div className={cn("app-screen page-stack", className)}>
          <div aria-hidden="true" className="mb-1 flex items-center justify-between pt-0.5 text-[18px] font-semibold tracking-[-0.02em] text-[var(--text)] min-[400px]:mb-2 min-[400px]:text-[19px]">
            <span>9:41</span>
            <span className="h-[30px] w-[118px] rounded-full bg-[#0f172a] min-[400px]:w-[126px]" />
            <span className="flex items-center gap-2 text-xs">
              <span className="flex gap-1">
                <span className="h-3 w-1 rounded-sm bg-[var(--text)]" />
                <span className="mt-[-2px] h-4 w-1 rounded-sm bg-[var(--text)]" />
                <span className="mt-[-4px] h-5 w-1 rounded-sm bg-[var(--text)]" />
              </span>
              <span className="flex h-3.5 w-6 items-center rounded-md border border-[var(--text)]">
                <span className="ml-0.5 h-2 w-3.5 rounded-sm bg-[var(--text)]" />
              </span>
            </span>
          </div>
          {header}
          <main className="page-stack flex min-h-0 flex-1 pb-1" id="mobile-main" tabIndex={-1}>
            {children}
          </main>
          {bottomNav}
        </div>
      </div>
    </div>
  );
}
