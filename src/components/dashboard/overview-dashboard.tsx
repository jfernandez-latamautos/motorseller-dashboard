"use client";

import { Building2, Package, Smartphone, Users, Info } from "lucide-react";
import { useState } from "react";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { CountrySplit } from "@/components/dashboard/country-split";
import { DefinitionsBanner } from "@/components/dashboard/definitions-banner";
import { OutreachQueue } from "@/components/dashboard/outreach-queue";
import { ModuleGrowthList } from "@/components/dashboard/growth-strip";
import {
  computeKpisWithGrowth,
  formatDeltaPercent,
  formatNumber,
} from "@/lib/metrics";

export function OverviewDashboard() {
  const { filteredDealers, dealers, filters } = useFilters();
  const kpis = computeKpisWithGrowth(filteredDealers, dealers);
  const [showDefs, setShowDefs] = useState(false);

  return (
    <>
      <TopFilters title="Resumen" subtitle="Vista rápida del panel" />

      <div className="flex flex-col gap-3 p-4 md:gap-4 md:p-5">
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

        <section className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
          <KpiCard
            label="Agencias panel"
            value={formatNumber(kpis.panelDealers)}
            hint={`${kpis.dormantDealers} inactivas`}
            delta={formatDeltaPercent(kpis.growth.activeDealers)}
            deltaPositive={kpis.growth.activeDealers >= 0}
            icon={Building2}
          />
          <KpiCard
            label="Inventario"
            value={formatNumber(kpis.inventoryPublished)}
            hint="publicados"
            delta={formatDeltaPercent(kpis.growth.inventory)}
            deltaPositive={kpis.growth.inventory >= 0}
            icon={Package}
            iconTone="amber"
          />
          <KpiCard
            label="Leads"
            value={formatNumber(kpis.leads)}
            hint={`${filters.rangeDays} días`}
            delta={formatDeltaPercent(kpis.growth.leads)}
            deltaPositive={kpis.growth.leads >= 0}
            icon={Users}
            iconTone="violet"
          />
          <KpiCard
            label="Sesiones"
            value={formatNumber(kpis.webSessions + kpis.mobileSessions)}
            hint={`${kpis.mobileShare}% móvil · ${filters.rangeDays}d`}
            delta={formatDeltaPercent(kpis.growth.sessions)}
            deltaPositive={kpis.growth.sessions >= 0}
            icon={Smartphone}
          />
        </section>

        <section className="grid gap-3 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ActivityChart />
          </div>
          <div className="lg:col-span-2">
            <CountrySplit dealers={filteredDealers} />
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <ModuleGrowthList dealers={filteredDealers} />
          <OutreachQueue dealers={filteredDealers} />
        </section>
      </div>
    </>
  );
}
