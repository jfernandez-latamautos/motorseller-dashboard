"use client";

import { useState } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { useFilters } from "@/components/filters/filter-context";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]";

export function FilterSheet() {
  const { filters, setFilters, resetFilters, filteredDealers } = useFilters();
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.country !== "all",
    filters.accessType !== "panel_preferred",
    filters.platform !== "all",
    filters.rangeDays !== 30,
    Boolean(filters.search.trim()),
  ].filter(Boolean).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-semibold text-[var(--ink)]"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {activeCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar filtros"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-md)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div>
                <p className="text-base font-bold text-[var(--ink)]">Filtros</p>
                <p className="text-xs text-[var(--muted)]">
                  {filteredDealers.length} agencias
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-[var(--bg)]"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
                  Buscar
                </span>
                <input
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  placeholder="Nombre o código de agencia"
                  className={field}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
                  País
                </span>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({
                      country: e.target.value as typeof filters.country,
                    })
                  }
                  className={field}
                >
                  <option value="all">Todos</option>
                  <option value="MX">México · Seminuevos</option>
                  <option value="EC">Ecuador · Patiotuerca</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
                  Acceso
                </span>
                <select
                  value={filters.accessType}
                  onChange={(e) =>
                    setFilters({
                      accessType: e.target.value as typeof filters.accessType,
                    })
                  }
                  className={field}
                >
                  <option value="panel_preferred">Panel (sin CRM)</option>
                  <option value="crm_only">Solo CRM</option>
                  <option value="panel">Solo panel</option>
                  <option value="all">Panel + CRM</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
                  Plataforma
                </span>
                <select
                  value={filters.platform}
                  onChange={(e) =>
                    setFilters({
                      platform: e.target.value as typeof filters.platform,
                    })
                  }
                  className={field}
                >
                  <option value="all">Web + Móvil</option>
                  <option value="web">Solo web</option>
                  <option value="mobile">Solo móvil</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
                  Periodo
                </span>
                <select
                  value={filters.rangeDays}
                  onChange={(e) =>
                    setFilters({
                      rangeDays: Number(
                        e.target.value
                      ) as typeof filters.rangeDays,
                    })
                  }
                  className={field}
                >
                  <option value={7}>Últimos 7 días</option>
                  <option value={30}>Últimos 30 días</option>
                  <option value={90}>Últimos 90 días</option>
                </select>
              </label>
            </div>

            <div className="sticky bottom-0 flex gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-4">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-3 text-sm font-semibold text-[var(--ink)]"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-[1.4] rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Filtros inline para desktop */
export function DesktopFilters() {
  const { filters, setFilters, resetFilters, filteredDealers } = useFilters();
  const chip =
    "rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)]";

  return (
    <div className="hidden flex-wrap items-center gap-2 md:flex">
      <input
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        placeholder="Buscar agencia..."
        className={cn(chip, "w-48")}
      />
      <select
        value={filters.country}
        onChange={(e) =>
          setFilters({ country: e.target.value as typeof filters.country })
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
      >
        <option value="panel_preferred">Panel (sin CRM)</option>
        <option value="crm_only">Solo CRM</option>
        <option value="panel">Solo panel</option>
        <option value="all">Panel + CRM</option>
      </select>
      <select
        value={filters.platform}
        onChange={(e) =>
          setFilters({ platform: e.target.value as typeof filters.platform })
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
        className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
      >
        Limpiar
      </button>
      <span className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)]">
        {filteredDealers.length} agencias
      </span>
    </div>
  );
}
