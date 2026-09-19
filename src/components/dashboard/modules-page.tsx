"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { MODULES } from "@/lib/mock-data";
import {
  formatNumber,
  formatPercent,
  lowActivityThreshold,
  moduleAdoptionRate,
} from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { Dealer, ModuleCategory, ModuleKey } from "@/lib/types";
import {
  CountryBadge,
  EngagementBadge,
  AccessBadge,
} from "@/components/ui/badges";
import { engagementLevel } from "@/lib/metrics";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronRight, Download } from "lucide-react";
import { DefinitionsBanner } from "@/components/dashboard/definitions-banner";
import { downloadCsv } from "@/lib/export-csv";

const CATEGORY_LABEL: Record<ModuleCategory, string> = {
  inicio: "Inicio",
  comercial: "Comercial",
  inventario: "Inventario",
  reportes: "Reportes",
  administracion: "Administración",
  general: "General",
};

type UsageSegment = "all" | "not_adopted" | "low" | "adopted";
type SortDir = "asc" | "desc";

function moduleUsage(dealer: Dealer, key: ModuleKey) {
  return (
    dealer.modules.find((m) => m.module === key) ?? {
      module: key,
      adopted: false,
      lastUsedAt: null,
      actions30d: 0,
    }
  );
}

export function ModulesPage() {
  const { filteredDealers, filters } = useFilters();
  const panel = useMemo(
    () => filteredDealers.filter((d) => d.accessType === "panel"),
    [filteredDealers]
  );
  const lowThreshold = lowActivityThreshold(filters.rangeDays);

  const [selectedKey, setSelectedKey] = useState<ModuleKey>("perfilador");
  const [segment, setSegment] = useState<UsageSegment>("not_adopted");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const selected = MODULES.find((m) => m.key === selectedKey)!;

  const summary = useMemo(() => {
    return MODULES.map((mod) => {
      const usages = panel.map((d) => ({ dealer: d, usage: moduleUsage(d, mod.key) }));
      const adopted = usages.filter((u) => u.usage.adopted);
      const notAdopted = usages.filter((u) => !u.usage.adopted);
      const low = adopted.filter(
        (u) => u.usage.actions30d > 0 && u.usage.actions30d < lowThreshold
      );
      const rate = moduleAdoptionRate(filteredDealers, mod.key);
      const actions = adopted.reduce((s, u) => s + u.usage.actions30d, 0);
      return {
        mod,
        rate,
        adoptedCount: adopted.length,
        notAdoptedCount: notAdopted.length,
        lowCount: low.length,
        actions,
      };
    }).sort((a, b) => a.rate - b.rate);
  }, [panel, filteredDealers, lowThreshold]);

  const agencyRows = useMemo(() => {
    let rows = panel.map((dealer) => {
      const usage = moduleUsage(dealer, selectedKey);
      return { dealer, usage };
    });

    if (segment === "not_adopted") {
      rows = rows.filter((r) => !r.usage.adopted);
    } else if (segment === "adopted") {
      rows = rows.filter((r) => r.usage.adopted);
    } else if (segment === "low") {
      rows = rows.filter(
        (r) =>
          r.usage.adopted &&
          r.usage.actions30d > 0 &&
          r.usage.actions30d < lowThreshold
      );
    }

    rows.sort((a, b) => {
      const diff = a.usage.actions30d - b.usage.actions30d;
      return sortDir === "asc" ? diff : -diff;
    });

    return rows;
  }, [panel, selectedKey, segment, sortDir, lowThreshold]);

  const selectedStats = summary.find((s) => s.mod.key === selectedKey);

  const exportRows = () => {
    const segmentLabel =
      segment === "not_adopted"
        ? "sin-adoptar"
        : segment === "low"
          ? "baja-actividad"
          : segment === "adopted"
            ? "adoptaron"
            : "todas";
    downloadCsv(
      `motorseller-${selected.key}-${segmentLabel}-${filters.rangeDays}d.csv`,
      [
        "Agencia",
        "Código",
        "País",
        "Ciudad",
        "AM",
        "Estado módulo",
        "Acciones",
        "Último uso",
        "Inventario publicado",
        "Leads",
        "Sesiones web",
        "Sesiones móvil",
      ],
      agencyRows.map(({ dealer, usage }) => [
        dealer.name,
        dealer.agencyCode,
        dealer.country,
        dealer.city,
        dealer.accountManager,
        usage.adopted ? "Activo" : "Sin adoptar",
        usage.actions30d,
        usage.lastUsedAt ?? "",
        dealer.inventoryPublished,
        dealer.leads30d,
        dealer.webSessions30d,
        dealer.mobileSessions30d,
      ])
    );
  };

  return (
    <>
      <TopFilters
        title="Módulos"
        subtitle={`Quién usa cada módulo · periodo ${filters.rangeDays} días · CRM excluido por defecto`}
      />

      <div className="flex flex-1 flex-col gap-5 p-6">
        <DefinitionsBanner />

        <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
          {/* Lista de módulos */}
          <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="text-sm font-bold text-[var(--ink)]">Catálogo</p>
              <p className="text-xs text-[var(--muted)]">
                Clic para ver agencias · ordenado por % adopción
              </p>
            </div>
            <ul className="max-h-[70vh] overflow-y-auto">
              {summary.map((row) => {
                const active = row.mod.key === selectedKey;
                return (
                  <li key={row.mod.key}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedKey(row.mod.key);
                        setSegment("not_adopted");
                        setSortDir("asc");
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-0",
                        active
                          ? "bg-[var(--accent-soft)]"
                          : "hover:bg-[var(--bg)]"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-semibold",
                            active ? "text-[var(--accent)]" : "text-[var(--ink)]"
                          )}
                        >
                          {row.mod.name}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {CATEGORY_LABEL[row.mod.category]} ·{" "}
                          {row.notAdoptedCount} sin usar
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--ink)]">
                          {formatPercent(row.rate)}
                        </p>
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4",
                            active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                          )}
                        />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detalle del módulo */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[var(--muted)] uppercase">
                    {CATEGORY_LABEL[selected.category]}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--ink)]">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {selected.description}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--bg)] px-4 py-3 text-right">
                  <p className="text-[11px] text-[var(--muted)]">Adopción</p>
                  <p className="text-2xl font-bold text-[var(--ink)]">
                    {formatPercent(selectedStats?.rate ?? 0)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniStat
                  label="Con el módulo"
                  value={formatNumber(selectedStats?.adoptedCount ?? 0)}
                  onClick={() => setSegment("adopted")}
                  active={segment === "adopted"}
                />
                <MiniStat
                  label="Sin el módulo"
                  value={formatNumber(selectedStats?.notAdoptedCount ?? 0)}
                  onClick={() => setSegment("not_adopted")}
                  active={segment === "not_adopted"}
                  accent
                />
                <MiniStat
                  label="Baja actividad"
                  value={formatNumber(selectedStats?.lowCount ?? 0)}
                  onClick={() => setSegment("low")}
                  active={segment === "low"}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  ["not_adopted", "Sin adoptar"],
                  ["low", "Menos uso"],
                  ["adopted", "Adoptaron"],
                  ["all", "Todas (panel)"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSegment(key);
                    setSortDir(key === "adopted" || key === "low" ? "asc" : "asc");
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    segment === key
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface)] text-[var(--muted)] ring-1 ring-[var(--border)] hover:text-[var(--ink)]"
                  )}
                >
                  {label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] ring-1 ring-[var(--border)] hover:text-[var(--ink)]"
              >
                Acciones: {sortDir === "asc" ? "menor → mayor" : "mayor → menor"}
              </button>

              <button
                type="button"
                onClick={exportRows}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar CSV ({agencyRows.length})
              </button>
            </div>

            <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--bg)] text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
                  <tr>
                    <th className="px-4 py-3">Agencia</th>
                    <th className="px-4 py-3">País</th>
                    <th className="px-4 py-3">Estado módulo</th>
                    <th className="px-4 py-3">Acciones</th>
                    <th className="px-4 py-3">Último uso</th>
                    <th className="px-4 py-3">Actividad panel</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyRows.map(({ dealer, usage }) => (
                    <tr
                      key={dealer.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]/80"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-[var(--ink)]">
                          {dealer.name}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {dealer.agencyCode} · AM {dealer.accountManager}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <CountryBadge country={dealer.country} />
                      </td>
                      <td className="px-4 py-3.5">
                        {usage.adopted ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Activo
                          </span>
                        ) : (
                          <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                            Sin adoptar
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[var(--ink)]">
                        {formatNumber(usage.actions30d)}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--muted)]">
                        {usage.lastUsedAt
                          ? formatDistanceToNow(new Date(usage.lastUsedAt), {
                              addSuffix: true,
                              locale: es,
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          <AccessBadge access={dealer.accessType} />
                          <EngagementBadge level={engagementLevel(dealer)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {agencyRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-[var(--muted)]"
                      >
                        No hay agencias en este segmento con los filtros actuales
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MiniStat({
  label,
  value,
  onClick,
  active,
  accent,
}: {
  label: string;
  value: string;
  onClick: () => void;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-3 text-left transition-colors",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]"
      )}
    >
      <p className="text-[11px] text-[var(--muted)]">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-bold",
          accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
        )}
      >
        {value}
      </p>
    </button>
  );
}
