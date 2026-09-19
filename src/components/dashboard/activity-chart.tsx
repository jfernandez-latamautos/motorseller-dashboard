"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ACTIVITY_TREND } from "@/lib/mock-data";

export function ActivityChart() {
  return (
    <div className="h-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--ink)]">
          Actividad web vs móvil
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Sesiones semanales de agencias con acceso al panel
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ACTIVITY_TREND} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "#717171", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#717171", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #ebebeb",
                fontSize: 12,
                boxShadow: "0 6px 16px rgb(0 0 0 / 8%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="web" name="Web" fill="#222222" radius={[6, 6, 0, 0]} />
            <Bar
              dataKey="mobile"
              name="Móvil"
              fill="#ff385c"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
