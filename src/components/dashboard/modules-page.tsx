"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { MODULES } from "@/lib/mock-data";
import {
  engagementLevel,
  formatNumber,
  formatPercent,
  lowActivityThreshold,
  moduleAdoptionRate,
} from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { Dealer, ModuleCategory, ModuleKey } from "@/lib/types";
import { CountryBadge, EngagementBadge } from "@/components/ui/badges";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
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

  const [selectedKey, setSelectedKey] = useState<ModuleKey | null>(null);
  const [segment, setSegment] = useState<UsageSegment>("not_adopted");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const summary = useMemo(() => {
    return MODULES.map((mod) => {
      const usages = panel.map((d) => ({
        dealer: d,
        usage: moduleUsage(d, mod.key),
      }));
      const adopted = usages.filter((u) => u.usage.adopted);
      const notAdopted = usages.filter((u) => !u.usage.adopted);
      const low = adopted.filter(
        (u) => u.usage.actions30d > 0 && u.usage.actions30d < lowThreshold
      );
      return {
        mod,
        rate: moduleAdoptionRate(filteredDealers, mod.key),
        adoptedCount: adopted.length,
        notAdoptedCount: notAdopted.length,
        lowCount: low.length,
      };
    }).sort((a, b) => a.rate - b.rate);
  }, [panel, filteredDealers, lowThreshold]);

  const selected = selectedKey
    ? MODULES.find((m) => m.key === selectedKey)!
    : null;
  const selectedStats = selectedKey
    ? summary.find((s) => s.mod.key === selectedKey)
    : null;

  const agencyRows = useMemo(() => {
    if (!selectedKey) return [];
    let rows = panel.map((dealer) => ({
      dealer,
      usage: moduleUsage(dealer, selectedKey),
    }));

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

  const openModule = (key: ModuleKey) => {
    setSelectedKey(key);
    setSegment("not_adopted");
    setSortDir("asc");
  };

  const exportRows = () => {
    if (!selected) return;
    downloadCsv(
      `motorseller-${selected.key}-${segment}-${filters.rangeDays}d.csv`,
      [
        "Agencia",
        "Código",
        "País",
        "Ciudad",
        "AM",
        "Estado",
        "Acciones",
        "Inventario",
        "Leads",
      ],
      agencyRows.map(({ dealer, usage }) => [
        dealer.name,
        dealer.agencyCode,
        dealer.country,
        dealer.city,
        dealer.accountManager,
        usage.adopted ? "Activo" : "Sin adoptar",
        usage.actions30d,
        dealer.inventoryPublished,
        dealer.leads30d,
      ])
    );
  };

  /* —— Lista de módulos (mobile drill + desktop left rail) —— */
  const catalog = (
    <ul className="flex flex-col">
      {summary.map((row) => (
        <li key={row.mod.key} className="border-b border-[var(--border)] last:border-0">
          <button
            type="button"
            onClick={() => openModule(row.mod.key)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-4 text-left active:bg-[var(--bg)]",
              selectedKey === row.mod.key && "bg-[var(--accent-soft)] md:bg-[var(--accent-soft)]"
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-[var(--ink)]">
                {row.mod.name}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {CATEGORY_LABEL[row.mod.category]} · {row.notAdoptedCount} sin
                usar
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-[var(--ink)]">
                {formatPercent(row.rate)}
              </p>
              <ChevronRight className="ml-auto h-4 w-4 text-[var(--muted)]" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );

  const detail = selected && selectedStats ? (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5">
        <p className="text-[11px] font-bold tracking-wide text-[var(--muted)] uppercase">
          {CATEGORY_LABEL[selected.category]}
        </p>
        <h2 className="mt-1 text-xl font-bold text-[var(--ink)]">
          {selected.name}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{selected.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <SegmentCard
            label="Con módulo"
            value={selectedStats.adoptedCount}
            active={segment === "adopted"}
            onClick={() => setSegment("adopted")}
          />
          <SegmentCard
            label="Sin módulo"
            value={selectedStats.notAdoptedCount}
            active={segment === "not_adopted"}
            accent
            onClick={() => setSegment("not_adopted")}
          />
          <SegmentCard
            label="Baja uso"
            value={selectedStats.lowCount}
            active={segment === "low"}
            onClick={() => setSegment("low")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["not_adopted", "Sin adoptar"],
            ["low", "Menos uso"],
            ["adopted", "Adoptaron"],
            ["all", "Todas"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSegment(key)}
            className={cn(
              "rounded-xl px-3 py-2.5 text-xs font-semibold",
              segment === key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--muted)] ring-1 ring-[var(--border)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
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

      <ul className="flex flex-col gap-3">
        {agencyRows.map(({ dealer, usage }) => (
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
                  {dealer.agencyCode} · {dealer.accountManager}
                </p>
              </div>
              {usage.adopted ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Activo
                </span>
              ) : (
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                  Sin adoptar
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <CountryBadge country={dealer.country} />
              <EngagementBadge level={engagementLevel(dealer)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-[var(--bg)] py-2">
                <p className="text-[10px] text-[var(--muted)]">Acciones</p>
                <p className="font-bold">{formatNumber(usage.actions30d)}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg)] py-2">
                <p className="text-[10px] text-[var(--muted)]">Último uso</p>
                <p className="text-xs font-semibold">
                  {usage.lastUsedAt
                    ? formatDistanceToNow(new Date(usage.lastUsedAt), {
                        addSuffix: true,
                        locale: es,
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </li>
        ))}
        {agencyRows.length === 0 ? (
          <li className="py-12 text-center text-sm text-[var(--muted)]">
            No hay agencias en este segmento
          </li>
        ) : null}
      </ul>
    </div>
  ) : null;

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
            <button
              type="button"
              onClick={() => setSelectedKey(null)}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--border)] px-3 text-sm font-semibold md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </button>
          ) : null
        }
      />

      {/* Mobile: drill-down screens */}
      <div className="flex flex-1 flex-col md:hidden">
        {!selected ? (
          <div className="bg-[var(--surface)]">{catalog}</div>
        ) : (
          <div className="flex flex-col gap-4 p-4">{detail}</div>
        )}
      </div>

      {/* Desktop: split */}
      <div className="hidden flex-1 gap-5 p-6 md:flex">
        <div className="w-[300px] shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-bold">Catálogo</p>
            <p className="text-xs text-[var(--muted)]">Ordenado por adopción</p>
          </div>
          {catalog}
        </div>
        <div className="min-w-0 flex-1">
          {selected ? (
            detail
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
              Selecciona un módulo
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SegmentCard({
  label,
  value,
  onClick,
  active,
  accent,
}: {
  label: string;
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
    </button>
  );
}
