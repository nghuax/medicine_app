import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WeeklyPoint {
  key: string;
  intake: number;
  burned: number;
  water: number;
  steps: number;
  sleep: number;
  label: string;
}

interface StatusChartProps {
  view: "daily" | "weekly";
  weekly: WeeklyPoint[];
}

export function StatusChart({ view, weekly }: StatusChartProps) {
  return (
    <ResponsiveContainer height="100%" width="100%">
      {view === "daily" ? (
        <LineChart data={weekly}>
          <CartesianGrid stroke="rgba(229,231,235,0.6)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip />
          <Line dataKey="intake" stroke="#7fba1e" strokeWidth={3} dot={false} />
          <Line dataKey="burned" stroke="#111827" strokeWidth={2} dot={false} opacity={0.55} />
        </LineChart>
      ) : (
        <BarChart data={weekly}>
          <CartesianGrid stroke="rgba(229,231,235,0.6)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="intake" fill="#e4f7b6" radius={[999, 999, 999, 999]} />
          <Bar dataKey="burned" fill="#b9ed53" radius={[999, 999, 999, 999]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
