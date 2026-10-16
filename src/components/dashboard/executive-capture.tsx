"use client";

import { useMemo } from "react";
import {
  executiveCapture,
  filterDealers,
  formatNumber,
  formatPercent,
} from "@/lib/metrics";
import { useFilters } from "@/components/filters/filter-context";
import { cn } from "@/lib/utils";

/** Ranking siempre con todos los ejecutivos (respeta país/acceso/periodo; ignora filtro AM). */
export function ExecutiveCapture() {
  const { filters, setFilters, dealers } = useFilters();
  const rows = useMemo(
    () =>
      executiveCapture(
        filterDealers(dealers, { ...filters, accountManager: "all" }),
        filters.rangeDays
      ),
    [dealers, filters]
  );

  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <div className="mb-2.5">
        <h2 className="text-sm font-bold text-[var(--ink)]">
          Captación por ejecutivo
        </h2>
        <p className="text-xs text-[var(--muted)]">
          % promedio en módulos prioritarios (Perfilador, Prospectos,
          Estadísticas, Leads) · clic para filtrar
        </p>
      </div>

      <ul className="flex flex-col">
        {rows.map((row) => {
          const active = filters.accountManager === row.name;
          return (
            <li key={row.name}>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    accountManager: active ? "all" : row.name,
                  })
                }
                className={cn(
                  "flex w-full items-center justify-between gap-3 border-b border-[var(--border)] py-2.5 text-left first:pt-0 last:border-0",
                  active && "bg-[var(--accent-soft)] px-2 -mx-2 rounded-xl"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">
                    {row.name}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    {row.agencies} agencias · {formatNumber(row.leads)} leads
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      row.priorityAdoption < 50
                        ? "text-[var(--accent)]"
                        : "text-[var(--ink)]"
                    )}
                  >
                    {formatPercent(row.priorityAdoption)}
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">
                    {formatPercent(row.adoptedAnyPriority)} con ≥1
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
