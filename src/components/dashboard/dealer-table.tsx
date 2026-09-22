"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
import { RelativeTime } from "@/components/ui/relative-time";
import { Paginator } from "@/components/ui/paginator";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

export function DealerTable({
  dealers,
  platform,
  compact = false,
}: {
  dealers: Dealer[];
  platform: DashboardFilters["platform"];
  compact?: boolean;
}) {
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      [...dealers].sort(
        (a, b) => totalSessions(b, platform) - totalSessions(a, platform)
      ),
    [dealers, platform]
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedRows = rows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [dealers, platform]);

  return (
    <>
      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {pagedRows.map((dealer) => {
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
                    {dealer.city} · {dealer.id}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    Ejecutivo: {dealer.accountManager}
                  </p>
                </div>
                <EngagementBadge level={engagementLevel(dealer)} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <CountryBadge country={dealer.country} />
                <AccessBadge access={dealer.accessType} />
                <TierBadge tier={dealer.tier} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric
                  label="Inventario"
                  value={formatNumber(dealer.inventoryPublished)}
                />
                <Metric label="Leads" value={formatNumber(dealer.leads30d)} />
                <Metric label="Sesiones" value={formatNumber(sessions)} />
                <Metric label="Alta LAA" value={formatDate(dealer.createdAt)} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Score {engagementScore(dealer)}</span>
                {!compact && dealer.lastLoginAt ? (
                  <RelativeTime date={dealer.lastLoginAt} />
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
                <th className="px-4 py-3">Alta LAA</th>
                <th className="px-4 py-3">Inventario</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Sesiones</th>
                <th className="px-4 py-3">Actividad</th>
                {!compact ? <th className="px-4 py-3">Último login</th> : null}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((dealer) => {
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
                        {dealer.id} · {dealer.city}
                      </p>
                      <p className="text-[11px] text-[var(--muted)]">
                        Ejecutivo: {dealer.accountManager}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <CountryBadge country={dealer.country} />
                    </td>
                    <td className="px-4 py-3.5">
                      <AccessBadge access={dealer.accessType} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[var(--muted)]">
                      {formatDate(dealer.createdAt)}
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
                    <td className="px-4 py-3.5">
                      <EngagementBadge level={level} />
                    </td>
                    {!compact ? (
                      <td className="px-4 py-3.5 text-[var(--muted)]">
                        <RelativeTime
                          date={dealer.lastLoginAt}
                          fallback="Nunca"
                        />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Paginator
        page={safePage}
        pageCount={pageCount}
        total={rows.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
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
