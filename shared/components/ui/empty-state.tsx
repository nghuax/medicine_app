import type { ReactNode } from "react";
import { Card } from "@shared/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center" tone="soft">
      <div className="space-y-3 py-4">
        <h3 className="text-lg font-extrabold text-[var(--text)]">{title}</h3>
        <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--muted)]">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Card>
  );
}
