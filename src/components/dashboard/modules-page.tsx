"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { MODULES } from "@/lib/mock-data";
import { isModuleKey } from "@/lib/modules";
import {
  engagementLevel,
  formatNumber,
  formatPercent,
  lowActivityThreshold,
  topActivityThreshold,
  moduleUsageBand,
  moduleAdoptionRate,
  moduleAdoptionWithGrowth,
  formatDeltaPoints,
  type ModuleUsageBand,
} from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { Dealer, ModuleCategory, ModuleKey } from "@/lib/types";
import { CountryBadge, EngagementBadge } from "@/components/ui/badges";
import { RelativeTime } from "@/components/ui/relative-time";
import { Paginator } from "@/components/ui/paginator";
import { ArrowLeft, ChevronRight, Download } from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";

const CATEGORY_LABEL: Record<ModuleCategory, string> = {
  inicio: "Inicio",
  comercial: "Comercial",
  inventario: "Inventario",
  reportes: "Reportes",
  administracion: "Administración",
  general: "General",
};

const PAGE_SIZE = 8;

type UsageSegment = ModuleUsageBand;
type SortDir = "asc" | "desc";

const SEGMENT_META: Record<
  UsageSegment,
  { label: string; hint: string; help: string; accent?: boolean }
> = {
  none: {
    label: "Sin uso",
    hint: "Demos",
    help: "No activaron el módulo · candidatos a demo",
    accent: true,
  },
  low: {
    label: "Bajo uso",
    hint: "Activar",
    help: "Lo probaron poco · riesgo de abandono",
  },
  moderate: {
    label: "Uso moderado",
    hint: "Crecer",
    help: "Uso estable · oportunidad de profundizar",
  },
  top: {
    label: "Top uso",
    hint: "Champions",
    help: "Power users · entrevistas y casos de éxito",
  },
};

const BAND_LABEL: Record<ModuleUsageBand, string> = {
  none: "Sin uso",
  low: "Bajo uso",
  moderate: "Uso moderado",
  top: "Top uso",
};

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

function ModulesExplorer({
  initialKey,
}: {
  initialKey: ModuleKey | null;
}) {
  const { filteredDealers, filters } = useFilters();
  const [selectedKey, setSelectedKey] = useState<ModuleKey | null>(initialKey);
  const [segment, setSegment] = useState<UsageSegment>("none");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedKey(initialKey);
  }, [initialKey]);

  useEffect(() => {
    setSegment("none");
    setSortDir("asc");
    setPage(1);
  }, [selectedKey]);

  useEffect(() => {
    setPage(1);
  }, [segment, sortDir, filters.search, filters.country, filters.accessType, filters.platform, filters.rangeDays]);

  useEffect(() => {
    if (segment === "top" || segment === "moderate") setSortDir("desc");
    if (segment === "none" || segment === "low") setSortDir("asc");
  }, [segment]);

  const panel = useMemo(
    () => filteredDealers.filter((d) => d.accessType === "panel"),
    [filteredDealers]
  );
  const lowThreshold = lowActivityThreshold(filters.rangeDays);
  const topThreshold = topActivityThreshold(filters.rangeDays);

  const summary = useMemo(() => {
    return MODULES.map((mod) => {
      const usages = panel.map((d) => ({
        dealer: d,
        usage: moduleUsage(d, mod.key),
        band: moduleUsageBand(
          moduleUsage(d, mod.key).adopted,
          moduleUsage(d, mod.key).actions30d,
          filters.rangeDays
        ),
      }));
      const counts = {
        none: usages.filter((u) => u.band === "none").length,
        low: usages.filter((u) => u.band === "low").length,
        moderate: usages.filter((u) => u.band === "moderate").length,
        top: usages.filter((u) => u.band === "top").length,
      };
      return {
        mod,
        rate: moduleAdoptionRate(filteredDealers, mod.key),
        notAdoptedCount: counts.none,
        counts,
      };
    }).sort((a, b) => a.rate - b.rate);
  }, [panel, filteredDealers, filters.rangeDays]);

  const selected = selectedKey
    ? (MODULES.find((m) => m.key === selectedKey) ?? null)
    : null;
  const selectedStats = selectedKey
    ? (summary.find((s) => s.mod.key === selectedKey) ?? null)
    : null;
  const selectedGrowth = selectedKey
    ? (moduleAdoptionWithGrowth(filteredDealers).find(
        (r) => r.mod.key === selectedKey
      ) ?? null)
    : null;

  const agencyRows = useMemo(() => {
    if (!selectedKey) return [];
    let rows = panel.map((dealer) => {
      const usage = moduleUsage(dealer, selectedKey);
      return {
        dealer,
        usage,
        band: moduleUsageBand(
          usage.adopted,
          usage.actions30d,
          filters.rangeDays
        ),
      };
    });

    rows = rows.filter((r) => r.band === segment);

    rows.sort((a, b) => {
      const diff = a.usage.actions30d - b.usage.actions30d;
      return sortDir === "asc" ? diff : -diff;
    });
    return rows;
  }, [panel, selectedKey, segment, sortDir, filters.rangeDays]);

  const pageCount = Math.max(1, Math.ceil(agencyRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedRows = agencyRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const selectModule = (key: ModuleKey) => {
    setSelectedKey(key);
    window.history.pushState(null, "", `/modules/${key}`);
  };

  const clearModule = () => {
    setSelectedKey(null);
    window.history.pushState(null, "", "/modules");
  };

  useEffect(() => {
    const onPopState = () => {
      const parts = window.location.pathname.split("/");
      const maybeKey = parts[2] ?? null;
      setSelectedKey(isModuleKey(maybeKey) ? maybeKey : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const exportRows = () => {
    if (!selected) return;
    downloadCsv(
      `motorseller-${selected.key}-${segment}-${filters.rangeDays}d.csv`,
      [
        "Agencia",
        "ID",
        "País",
        "Ciudad",
        "Ejecutivo cuenta",
        "Nivel de uso",
        "Acciones",
        "Inventario",
        "Leads",
      ],
      agencyRows.map(({ dealer, usage, band }) => [
        dealer.name,
        dealer.id,
        dealer.country,
        dealer.city,
        dealer.accountManager,
        BAND_LABEL[band],
        usage.actions30d,
        dealer.inventoryPublished,
        dealer.leads30d,
      ])
    );
  };

  return (
    <>
      <TopFilters
        title={selected ? selected.name : "Módulos"}
        subtitle={
          selected
            ? `${formatPercent(selectedStats?.rate ?? 0)} adopción`
            : "Elige un módulo"
        }
        trailing={
          selected ? (
            <a
              href="/modules"
              onClick={(e) => {
                e.preventDefault();
                clearModule();
              }}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--border)] px-3 text-sm font-semibold md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </a>
          ) : null
        }
      />

      <div className="flex flex-1 flex-col md:flex-row md:gap-5 md:p-6">
        <div
          className={cn(
            "bg-[var(--surface)] md:flex md:w-[300px] md:shrink-0 md:flex-col md:overflow-hidden md:rounded-2xl md:border md:border-[var(--border)]",
            selected && "hidden md:flex"
          )}
        >
          <div className="hidden border-b border-[var(--border)] px-4 py-3 md:block">
            <p className="text-sm font-bold">Catálogo</p>
            <p className="text-xs text-[var(--muted)]">Ordenado por adopción</p>
          </div>
          <ul className="flex flex-col md:min-h-0 md:flex-1 md:overflow-y-auto">
            {summary.map((row) => (
              <li
                key={row.mod.key}
                className="border-b border-[var(--border)] last:border-0"
              >
                <a
                  href={`/modules/${row.mod.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectModule(row.mod.key);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[var(--bg)]",
                    selectedKey === row.mod.key && "bg-[var(--accent-soft)]"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-[var(--ink)]">
                      {row.mod.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {CATEGORY_LABEL[row.mod.category]} ·{" "}
                      {row.notAdoptedCount} sin uso
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-[var(--ink)]">
                      {formatPercent(row.rate)}
                    </p>
                    <ChevronRight className="ml-auto h-4 w-4 text-[var(--muted)]" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            "min-w-0 flex-1 md:overflow-y-auto",
            !selected && "hidden md:block"
          )}
        >
          {selected && selectedStats ? (
            <div className="flex flex-col gap-4 p-4 md:p-0">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
                <p className="text-[11px] font-bold tracking-wide text-[var(--muted)] uppercase">
                  {CATEGORY_LABEL[selected.category]}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[var(--ink)]">
                  {selected.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {selected.description}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Adopción {formatPercent(selectedStats.rate)}
                  {selectedGrowth ? (
                    <>
                      {" "}
                      ·{" "}
                      <span
                        className={
                          selectedGrowth.deltaPp > 0
                            ? "font-semibold text-emerald-600"
                            : selectedGrowth.deltaPp < 0
                              ? "font-semibold text-[var(--accent)]"
                              : undefined
                        }
                      >
                        {formatDeltaPoints(selectedGrowth.deltaPp)} vs periodo
                        ant.
                      </span>
                    </>
                  ) : null}
                  {` · bajo <${lowThreshold} · top ≥${topThreshold} acciones`}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    ["none", "low", "moderate", "top"] as const
                  ).map((key) => (
                    <SegmentCard
                      key={key}
                      label={SEGMENT_META[key].label}
                      hint={SEGMENT_META[key].hint}
                      value={selectedStats.counts[key]}
                      active={segment === key}
                      accent={SEGMENT_META[key].accent}
                      onClick={() => setSegment(key)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[var(--muted)]">
                  {SEGMENT_META[segment].help}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                    }
                    className="text-xs font-semibold text-[var(--muted)]"
                  >
                    Acciones {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                  <button
                    type="button"
                    onClick={exportRows}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV ({agencyRows.length})
                  </button>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                {pagedRows.map(({ dealer, usage, band }) => (
                  <li
                    key={dealer.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-[var(--ink)]">
                          {dealer.name}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {dealer.id} · Ejecutivo:{" "}
                          {dealer.accountManager}
                        </p>
                      </div>
                      <UsageBandBadge band={band} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <CountryBadge country={dealer.country} />
                      <EngagementBadge level={engagementLevel(dealer)} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-[var(--bg)] py-2">
                        <p className="text-[10px] text-[var(--muted)]">
                          Acciones
                        </p>
                        <p className="font-bold">
                          {formatNumber(usage.actions30d)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[var(--bg)] py-2">
                        <p className="text-[10px] text-[var(--muted)]">
                          Último uso
                        </p>
                        <p className="text-xs font-semibold">
                          <RelativeTime date={usage.lastUsedAt} />
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                {agencyRows.length === 0 ? (
                  <li className="py-12 text-center text-sm text-[var(--muted)]">
                    No hay agencias en este nivel
                  </li>
                ) : null}
              </ul>

              <Paginator
                page={safePage}
                pageCount={pageCount}
                total={agencyRows.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                className="mb-4"
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
              Selecciona un módulo del catálogo
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function UsageBandBadge({ band }: { band: ModuleUsageBand }) {
  const styles: Record<ModuleUsageBand, string> = {
    none: "bg-[var(--accent-soft)] text-[var(--accent)]",
    low: "bg-amber-50 text-amber-700",
    moderate: "bg-sky-50 text-sky-700",
    top: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
        styles[band]
      )}
    >
      {BAND_LABEL[band]}
    </span>
  );
}

function SegmentCard({
  label,
  hint,
  value,
  onClick,
  active,
  accent,
}: {
  label: string;
  hint?: string;
  value: number;
  onClick: () => void;
  active?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-2 py-3 text-center",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--bg)]"
      )}
    >
      <p className="text-[10px] text-[var(--muted)]">{label}</p>
      <p
        className={cn(
          "text-lg font-bold",
          accent ? "text-[var(--accent)]" : "text-[var(--ink)]"
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[9px] font-medium text-[var(--muted)]">
          {hint}
        </p>
      ) : null}
    </button>
  );
}

export function ModulesPage({
  initialKey = null,
}: {
  initialKey?: ModuleKey | null;
}) {
  return <ModulesExplorer initialKey={initialKey} />;
}
