"use client";

import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { DealerTable } from "@/components/dashboard/dealer-table";
import { DefinitionsBanner } from "@/components/dashboard/definitions-banner";
import { computeKpis, formatNumber } from "@/lib/metrics";
import { downloadCsv } from "@/lib/export-csv";
import { Download } from "lucide-react";

export function DealersPage() {
  const { filteredDealers, dealers, filters } = useFilters();
  const kpis = computeKpis(filteredDealers, dealers);

  const exportDealers = () => {
    downloadCsv(
      `motorseller-agencias-${filters.rangeDays}d.csv`,
      [
        "Agencia",
        "Código",
        "País",
        "Ciudad",
        "Acceso",
        "Inventario publicado",
        "Leads",
        "Sesiones web",
        "Sesiones móvil",
        "AM",
      ],
      filteredDealers.map((d) => [
        d.name,
        d.agencyCode,
        d.country,
        d.city,
        d.accessType === "panel" ? "Panel" : "CRM only",
        d.inventoryPublished,
        d.leads30d,
        d.webSessions30d,
        d.mobileSessions30d,
        d.accountManager,
      ])
    );
  };

  return (
    <>
      <TopFilters
        title="Agencias"
        subtitle={`Inventario, leads y actividad · últimos ${filters.rangeDays} días`}
      />
      <div className="flex flex-1 flex-col gap-5 p-6">
        <DefinitionsBanner />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid flex-1 gap-4 sm:grid-cols-4">
            <Stat label="En vista" value={formatNumber(filteredDealers.length)} />
            <Stat
              label="Panel"
              value={formatNumber(kpis.panelDealers)}
              hint="usan Motor Seller"
            />
            <Stat
              label="CRM only"
              value={formatNumber(kpis.crmOnly)}
              hint="sin entrar al panel"
            />
            <Stat
              label="Leads"
              value={formatNumber(kpis.leads)}
              hint={`últimos ${filters.rangeDays} días`}
            />
          </div>
          <button
            type="button"
            onClick={exportDealers}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </button>
        </div>
        <DealerTable dealers={filteredDealers} platform={filters.platform} />
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-sm)]">
      <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{value}</p>
      {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
