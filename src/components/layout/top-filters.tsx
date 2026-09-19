"use client";

import { Search, RotateCcw } from "lucide-react";
import { useFilters } from "@/components/filters/filter-context";
import { cn } from "@/lib/utils";

const chip =
  "rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

export function TopFilters({ title, subtitle }: { title: string; subtitle: string }) {
  const { filters, setFilters, resetFilters, filteredDealers } = useFilters();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Buscar agencia..."
              className={cn(chip, "w-48 pl-9")}
            />
          </div>

          <select
            value={filters.country}
            onChange={(e) =>
              setFilters({
                country: e.target.value as typeof filters.country,
              })
            }
            className={chip}
          >
            <option value="all">Todos los países</option>
            <option value="MX">México · Seminuevos</option>
            <option value="EC">Ecuador · Patiotuerca</option>
          </select>

          <select
            value={filters.accessType}
            onChange={(e) =>
              setFilters({
                accessType: e.target.value as typeof filters.accessType,
              })
            }
            className={chip}
            title="Las agencias solo con integración CRM no usan el panel"
          >
            <option value="panel_preferred">Panel (sin CRM)</option>
            <option value="crm_only">Solo CRM</option>
            <option value="panel">Solo panel</option>
            <option value="all">Panel + CRM</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) =>
              setFilters({
                platform: e.target.value as typeof filters.platform,
              })
            }
            className={chip}
          >
            <option value="all">Web + Móvil</option>
            <option value="web">Solo web</option>
            <option value="mobile">Solo móvil</option>
          </select>

          <select
            value={filters.rangeDays}
            onChange={(e) =>
              setFilters({
                rangeDays: Number(e.target.value) as typeof filters.rangeDays,
              })
            }
            className={chip}
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpiar
          </button>

          <span className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)]">
            {filteredDealers.length} agencias
          </span>
        </div>
      </div>
    </header>
  );
}
