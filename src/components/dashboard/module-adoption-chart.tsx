"use client";

import { MODULES } from "@/lib/mock-data";
import { formatPercent, moduleAdoptionRate } from "@/lib/metrics";
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
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] md:p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--ink)]">
          Adopción por módulo
        </h2>
        <p className="text-sm text-[var(--muted)]">
          % de agencias panel con el módulo activo · detalle en Módulos
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {data.map((row) => (
          <li key={row.name}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-[var(--ink)]">
                {row.name}
              </span>
              <span className="shrink-0 text-sm font-bold text-[var(--ink)]">
                {formatPercent(row.adoption)}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#f0f0f0]">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.max(row.adoption, row.adoption > 0 ? 2 : 0)}%`,
                  background: CATEGORY_COLOR[row.category],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
