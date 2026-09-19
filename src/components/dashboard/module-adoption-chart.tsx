"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { MODULES } from "@/lib/mock-data";
import { moduleAdoptionRate } from "@/lib/metrics";
import type { Dealer, ModuleCategory } from "@/lib/types";

const CATEGORY_COLOR: Record<ModuleCategory, string> = {
  inicio: "#222222",
  comercial: "#ff385c",
  inventario: "#3b82f6",
  reportes: "#f59e0b",
  administracion: "#8b5cf6",
  general: "#717171",
};

export function ModuleAdoptionChart({ dealers }: { dealers: Dealer[] }) {
  const data = MODULES.map((m) => ({
    name: m.name,
    adoption: moduleAdoptionRate(dealers, m.key),
    category: m.category,
  })).sort((a, b) => b.adoption - a.adoption);

  return (
    <div className="h-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--ink)]">
          Adopción por módulo
        </h2>
        <p className="text-sm text-[var(--muted)]">
          % de agencias panel con el módulo activo · detalle en Módulos
        </p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#717171", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "#222222", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Adopción"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #ebebeb",
                fontSize: 12,
              }}
            />
            <Bar dataKey="adoption" radius={[0, 6, 6, 0]} barSize={12}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLOR[entry.category as ModuleCategory]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
