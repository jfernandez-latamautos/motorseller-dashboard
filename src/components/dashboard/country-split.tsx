"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Dealer } from "@/lib/types";
import { formatNumber } from "@/lib/metrics";

export function CountrySplit({ dealers }: { dealers: Dealer[] }) {
  const mx = dealers.filter((d) => d.country === "MX");
  const ec = dealers.filter((d) => d.country === "EC");

  const data = [
    {
      name: "México",
      value: mx.length,
      inventory: mx.reduce((s, d) => s + d.inventoryPublished, 0),
      color: "#ff385c",
    },
    {
      name: "Ecuador",
      value: ec.length,
      inventory: ec.reduce((s, d) => s + d.inventoryPublished, 0),
      color: "#222222",
    },
  ];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <h2 className="text-base font-bold text-[var(--ink)]">Por país</h2>
      <p className="mb-2 text-sm text-[var(--muted)]">
        Agencias e inventario publicado
      </p>
      <div className="flex items-center gap-4">
        <div className="h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ebebeb",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {data.map((row) => (
            <div key={row.name} className="rounded-xl bg-[var(--bg)] px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <i
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: row.color }}
                  />
                  {row.name}
                </span>
                <span className="text-sm font-bold text-[var(--ink)]">
                  {row.value}
                </span>
              </div>
              <p className="mt-1 pl-4 text-[11px] text-[var(--muted)]">
                {formatNumber(row.inventory)} publicados
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
