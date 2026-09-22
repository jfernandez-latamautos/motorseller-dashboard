"use client";

import {
  formatDeltaPercent,
  formatDeltaPoints,
  formatPercent,
  moduleAdoptionWithGrowth,
} from "@/lib/metrics";
import type { Dealer } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function GrowthStrip({
  growth,
}: {
  growth: {
    leads: number;
    sessions: number;
    inventory: number;
    activeDealers: number;
  };
}) {
  const items = [
    { label: "Leads", value: growth.leads },
    { label: "Sesiones", value: growth.sessions },
    { label: "Inventario", value: growth.inventory },
    { label: "Agencias activas", value: growth.activeDealers },
  ];

  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] md:p-5">
      <div className="mb-3">
        <h2 className="text-base font-bold text-[var(--ink)]">
          Growth vs periodo anterior
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Misma duración que el filtro de periodo (7 / 30 / 90)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-[var(--bg)] px-3 py-3 text-center"
          >
            <p className="text-[10px] font-semibold tracking-wide text-[var(--muted)] uppercase">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 text-xl font-bold",
                item.value >= 0 ? "text-emerald-600" : "text-[var(--accent)]"
              )}
            >
              {formatDeltaPercent(item.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ModuleGrowthList({ dealers }: { dealers: Dealer[] }) {
  const rows = moduleAdoptionWithGrowth(dealers).sort(
    (a, b) => a.rate - b.rate
  );

  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[var(--ink)]">
            Adopción · cambio
          </h2>
          <p className="text-xs text-[var(--muted)]">
            pp vs periodo anterior
          </p>
        </div>
        <Link
          href="/modules"
          className="text-xs font-semibold text-[var(--accent)]"
        >
          Ver módulos
        </Link>
      </div>
      <ul className="flex flex-col">
        {rows.map(({ mod, rate, deltaPp }) => (
          <li
            key={mod.key}
            className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-2.5 first:pt-0 last:border-0"
          >
            <Link
              href={`/modules/${mod.key}`}
              className="min-w-0 truncate text-sm font-semibold text-[var(--ink)] hover:text-[var(--accent)]"
            >
              {mod.name}
            </Link>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={cn(
                  "text-xs font-semibold",
                  deltaPp > 0
                    ? "text-emerald-600"
                    : deltaPp < 0
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]"
                )}
              >
                {formatDeltaPoints(deltaPp)}
              </span>
              <span className="w-10 text-right text-sm font-bold text-[var(--ink)]">
                {formatPercent(rate)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
