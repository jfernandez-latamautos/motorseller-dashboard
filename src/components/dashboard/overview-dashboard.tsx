"use client";

import {
  Building2,
  Package,
  Smartphone,
  Users,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ModuleAdoptionChart } from "@/components/dashboard/module-adoption-chart";
import { CountrySplit } from "@/components/dashboard/country-split";
import { DefinitionsBanner } from "@/components/dashboard/definitions-banner";
import { computeKpis, formatNumber, moduleAdoptionRate } from "@/lib/metrics";
import { MODULES } from "@/lib/mock-data";
import { formatPercent } from "@/lib/metrics";

export function OverviewDashboard() {
  const { filteredDealers, dealers, filters } = useFilters();
  const kpis = computeKpis(filteredDealers, dealers);
  const [showDefs, setShowDefs] = useState(false);

  const topGaps = MODULES.map((m) => ({
    name: m.name,
    rate: moduleAdoptionRate(filteredDealers, m.key),
  }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 4);

  return (
    <>
      <TopFilters title="Resumen" subtitle="Vista rápida del panel" />

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-6">
        <button
          type="button"
          onClick={() => setShowDefs((v) => !v)}
          className="inline-flex items-center gap-2 self-start text-xs font-semibold text-[var(--muted)] md:hidden"
        >
          <Info className="h-3.5 w-3.5" />
          {showDefs ? "Ocultar definiciones" : "Ver definiciones"}
        </button>
        <div className={showDefs ? "block" : "hidden md:block"}>
          <DefinitionsBanner />
        </div>

        <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          <KpiCard
            label="Agencias panel"
            value={formatNumber(kpis.panelDealers)}
            hint={`${kpis.dormantDealers} inactivas`}
            icon={Building2}
          />
          <KpiCard
            label="Inventario"
            value={formatNumber(kpis.inventoryPublished)}
            hint="publicados"
            icon={Package}
            iconTone="amber"
          />
          <KpiCard
            label="Leads"
            value={formatNumber(kpis.leads)}
            hint={`${filters.rangeDays} días`}
            icon={Users}
            iconTone="violet"
          />
          <KpiCard
            label="Sesiones"
            value={formatNumber(kpis.webSessions + kpis.mobileSessions)}
            delta={`${kpis.mobileShare}% móvil`}
            deltaPositive
            hint={`${filters.rangeDays} días`}
            icon={Smartphone}
          />
        </section>

        {/* Mobile: adoption gaps as tappable list */}
        <section className="md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--ink)]">
              Menor adopción
            </h2>
            <Link
              href="/modules"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            {topGaps.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5 last:border-0"
              >
                <span className="font-semibold text-[var(--ink)]">{row.name}</span>
                <span className="text-sm font-bold text-[var(--accent)]">
                  {formatPercent(row.rate)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hidden gap-5 md:grid xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ActivityChart />
          </div>
          <div className="xl:col-span-2">
            <CountrySplit dealers={filteredDealers} />
          </div>
        </section>

        {/* Mobile compact country */}
        <section className="md:hidden">
          <CountrySplit dealers={filteredDealers} />
        </section>

        <section className="hidden md:block">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">
                Adopción por módulo
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Detalle en Módulos
              </p>
            </div>
            <Link
              href="/modules"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Explorar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ModuleAdoptionChart dealers={filteredDealers} />
        </section>
      </div>
    </>
  );
}
