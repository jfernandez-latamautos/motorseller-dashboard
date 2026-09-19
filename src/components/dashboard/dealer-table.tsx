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
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
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
                    <p className="font-semibold text-[var(--ink)]">{dealer.name}</p>
                    <p className="text-[11px] text-[var(--muted)]">
                      {dealer.agencyCode} · {dealer.city}
                    </p>
                    <div className="mt-1">
                      <TierBadge tier={dealer.tier} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <CountryBadge country={dealer.country} />
                  </td>
                  <td className="px-4 py-3.5">
                    <AccessBadge access={dealer.accessType} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[var(--ink)]">
                      {formatNumber(dealer.inventoryPublished)}
                      <span className="font-normal text-[var(--muted)]">
                        /{formatNumber(dealer.ads.limit)}
                      </span>
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">
                      {dealer.destacados.used} destacados ·{" "}
                      {dealer.inventoryVerified} verif.
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[var(--ink)]">
                    {formatNumber(dealer.leads30d)}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[var(--ink)]">
                      {formatNumber(sessions)}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">
                      W {formatNumber(dealer.webSessions30d)} · M{" "}
                      {formatNumber(dealer.mobileSessions30d)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[var(--ink)]">
                    {adoptedModulesCount(dealer)}/{MODULES.length}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <EngagementBadge level={level} />
                      <span className="text-[11px] text-[var(--muted)]">
                        {engagementScore(dealer)}
                      </span>
                    </div>
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={compact ? 8 : 9}
                  className="px-4 py-10 text-center text-[var(--muted)]"
                >
                  No hay agencias con estos filtros
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
