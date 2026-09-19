"use client";

import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { DealerTable } from "@/components/dashboard/dealer-table";
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
        "Inventario",
        "Leads",
        "Web",
        "Móvil",
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
        subtitle={`${filters.rangeDays} días`}
        trailing={
          <button
            type="button"
            onClick={exportDealers}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 text-xs font-semibold text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        }
      />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Stat label="En vista" value={formatNumber(filteredDealers.length)} />
          <Stat label="Panel" value={formatNumber(kpis.panelDealers)} />
          <Stat label="CRM only" value={formatNumber(kpis.crmOnly)} />
          <Stat
            label="Leads"
            value={formatNumber(kpis.leads)}
            hint={`${filters.rangeDays}d`}
          />
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 md:px-4 md:py-4">
      <p className="text-[10px] font-semibold tracking-wide text-[var(--muted)] uppercase md:text-[11px]">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-[var(--ink)] md:text-2xl">
        {value}
      </p>
      {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
