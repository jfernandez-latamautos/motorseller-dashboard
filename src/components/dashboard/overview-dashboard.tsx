"use client";

import {
  Building2,
  Package,
  Smartphone,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useFilters } from "@/components/filters/filter-context";
import { TopFilters } from "@/components/layout/top-filters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ModuleAdoptionChart } from "@/components/dashboard/module-adoption-chart";
import { CountrySplit } from "@/components/dashboard/country-split";
import { DefinitionsBanner } from "@/components/dashboard/definitions-banner";
import { computeKpis, formatNumber } from "@/lib/metrics";
import { ArrowRight } from "lucide-react";

export function OverviewDashboard() {
  const { filteredDealers, dealers, filters } = useFilters();
  const kpis = computeKpis(filteredDealers, dealers);

  return (
    <>
      <TopFilters
        title="Resumen"
        subtitle="Vista rápida · para explorar adopción ve a Módulos"
      />

      <div className="flex flex-1 flex-col gap-5 p-6">
        <DefinitionsBanner />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Agencias panel"
            value={formatNumber(kpis.panelDealers)}
            hint={`${kpis.crmOnly} CRM only · ${kpis.dormantDealers} inactivas`}
            icon={Building2}
          />
          <KpiCard
            label="Inventario"
            value={formatNumber(kpis.inventoryPublished)}
            hint="unidades publicadas"
            icon={Package}
            iconTone="amber"
          />
          <KpiCard
            label="Leads"
            value={formatNumber(kpis.leads)}
            hint={`últimos ${filters.rangeDays} días`}
            icon={Users}
            iconTone="violet"
          />
          <KpiCard
            label="Sesiones"
            value={formatNumber(kpis.webSessions + kpis.mobileSessions)}
            delta={`${kpis.mobileShare}% móvil`}
            deltaPositive
            hint={`web ${formatNumber(kpis.webSessions)} · ${filters.rangeDays}d`}
            icon={Smartphone}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <ActivityChart />
          </div>
          <div className="xl:col-span-2">
            <CountrySplit dealers={filteredDealers} />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">
                Adopción por módulo
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Detalle y listados en Módulos
              </p>
            </div>
            <Link
              href="/modules"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Explorar módulos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ModuleAdoptionChart dealers={filteredDealers} />
        </section>
      </div>
    </>
  );
}
