"use client";

import {
  adoptedModulesCount,
  engagementLevel,
  engagementScore,
  formatNumber,
  totalSessions,
} from "@/lib/metrics";
import type { DashboardFilters, Dealer } from "@/lib/types";
import {
  AccessBadge,
  CountryBadge,
  EngagementBadge,
  TierBadge,
} from "@/components/ui/badges";
import { MODULES } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function DealerTable({
  dealers,
  platform,
  compact = false,
}: {
  dealers: Dealer[];
  platform: DashboardFilters["platform"];
  compact?: boolean;
}) {
  const rows = [...dealers].sort(
    (a, b) => totalSessions(b, platform) - totalSessions(a, platform)
  );

  return (
    <>
      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((dealer) => {
          const sessions = totalSessions(dealer, platform);
          return (
            <li
              key={dealer.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-[var(--ink)]">
                    {dealer.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {dealer.city} · {dealer.agencyCode}
                  </p>
                </div>
                <EngagementBadge level={engagementLevel(dealer)} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <CountryBadge country={dealer.country} />
                <AccessBadge access={dealer.accessType} />
                <TierBadge tier={dealer.tier} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Metric
                  label="Inventario"
                  value={formatNumber(dealer.inventoryPublished)}
                />
                <Metric label="Leads" value={formatNumber(dealer.leads30d)} />
                <Metric label="Sesiones" value={formatNumber(sessions)} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>
                  Módulos {adoptedModulesCount(dealer)}/{MODULES.length} · Score{" "}
                  {engagementScore(dealer)}
                </span>
                {!compact && dealer.lastLoginAt ? (
                  <span>
                    {formatDistanceToNow(new Date(dealer.lastLoginAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
        {rows.length === 0 ? (
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-12 text-center text-sm text-[var(--muted)]">
            No hay agencias con estos filtros
          </li>
        ) : null}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg)] text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
              <tr>
                <th className="px-4 py-3">Agencia</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3">Acceso</th>
                <th className="px-4 py-3">Inventario</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Sesiones</th>
                <th className="px-4 py-3">Módulos</th>
                <th className="px-4 py-3">Actividad</th>
                {!compact ? <th className="px-4 py-3">Último login</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((dealer) => {
                const level = engagementLevel(dealer);
                const sessions = totalSessions(dealer, platform);
                return (
                  <tr
                    key={dealer.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]/80"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[var(--ink)]">
                        {dealer.name}
                      </p>
                      <p className="text-[11px] text-[var(--muted)]">
                        {dealer.agencyCode} · {dealer.city}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <CountryBadge country={dealer.country} />
                    </td>
                    <td className="px-4 py-3.5">
                      <AccessBadge access={dealer.accessType} />
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {formatNumber(dealer.inventoryPublished)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {formatNumber(dealer.leads30d)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {formatNumber(sessions)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      {adoptedModulesCount(dealer)}/{MODULES.length}
                    </td>
                    <td className="px-4 py-3.5">
                      <EngagementBadge level={level} />
                    </td>
                    {!compact ? (
                      <td className="px-4 py-3.5 text-[var(--muted)]">
                        {dealer.lastLoginAt
                          ? formatDistanceToNow(new Date(dealer.lastLoginAt), {
                              addSuffix: true,
                              locale: es,
                            })
                          : "Nunca"}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg)] px-2 py-2 text-center">
      <p className="text-[10px] font-medium text-[var(--muted)]">{label}</p>
      <p className="text-sm font-bold text-[var(--ink)]">{value}</p>
    </div>
  );
}
