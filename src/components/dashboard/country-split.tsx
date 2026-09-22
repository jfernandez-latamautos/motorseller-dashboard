"use client";

import type { Dealer } from "@/lib/types";
import { formatNumber } from "@/lib/metrics";

export function CountrySplit({ dealers }: { dealers: Dealer[] }) {
  const mx = dealers.filter((d) => d.country === "MX");
  const ec = dealers.filter((d) => d.country === "EC");
  const total = Math.max(dealers.length, 1);

  const data = [
    {
      name: "México",
      value: mx.length,
      inventory: mx.reduce((s, d) => s + d.inventoryPublished, 0),
      color: "#ff385c",
      pct: Math.round((mx.length / total) * 100),
    },
    {
      name: "Ecuador",
      value: ec.length,
      inventory: ec.reduce((s, d) => s + d.inventoryPublished, 0),
      color: "#222222",
      pct: Math.round((ec.length / total) * 100),
    },
  ];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <h2 className="text-sm font-bold text-[var(--ink)]">Por país</h2>
      <p className="mb-2.5 text-xs text-[var(--muted)]">
        Agencias e inventario publicado
      </p>

      <div className="mb-4 flex h-3 overflow-hidden rounded-full">
        {data.map((row) =>
          row.value > 0 ? (
            <div
              key={row.name}
              style={{ width: `${row.pct}%`, background: row.color }}
              title={`${row.name}: ${row.value}`}
            />
          ) : null
        )}
      </div>

      <div className="flex flex-col gap-3">
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
                {row.value} · {row.pct}%
              </span>
            </div>
            <p className="mt-1 pl-4 text-[11px] text-[var(--muted)]">
              {formatNumber(row.inventory)} publicados
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
