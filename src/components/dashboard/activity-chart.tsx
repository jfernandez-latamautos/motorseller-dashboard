"use client";

import { useMemo } from "react";
import { ACTIVITY_TREND } from "@/lib/mock-data";
import { useFilters } from "@/components/filters/filter-context";

export function ActivityChart() {
  const { filteredDealers } = useFilters();

  const { rows, max } = useMemo(() => {
    const panel = filteredDealers.filter((d) => d.accessType === "panel");
    const webTotal = panel.reduce((s, d) => s + d.webSessions30d, 0);
    const mobileTotal = panel.reduce((s, d) => s + d.mobileSessions30d, 0);

    const shapeWeb = ACTIVITY_TREND.reduce((s, r) => s + r.web, 0) || 1;
    const shapeMobile = ACTIVITY_TREND.reduce((s, r) => s + r.mobile, 0) || 1;

    const scaled = ACTIVITY_TREND.map((row) => ({
      week: row.week,
      web: Math.round(webTotal * (row.web / shapeWeb)),
      mobile: Math.round(mobileTotal * (row.mobile / shapeMobile)),
    }));

    const peak = Math.max(
      ...scaled.map((d) => Math.max(d.web, d.mobile)),
      1
    );
    return { rows: scaled, max: peak };
  }, [filteredDealers]);

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-[var(--ink)]">
          Actividad web vs móvil
        </h2>
        <p className="text-xs text-[var(--muted)]">
          Sesiones semanales · según filtros
        </p>
      </div>

      <div className="mb-2 flex items-center gap-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="inline-block h-2.5 w-2.5 rounded-sm bg-[#222]" /> Web
        </span>
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="inline-block h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />{" "}
          Móvil
        </span>
      </div>

      <div className="flex h-36 items-end gap-2 sm:gap-3">
        {rows.map((row) => (
          <div
            key={row.week}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-28 w-full items-end justify-center gap-1">
              <div
                className="w-[42%] max-w-7 rounded-t-md bg-[#222]"
                style={{ height: `${(row.web / max) * 100}%` }}
                title={`Web: ${row.web}`}
              />
              <div
                className="w-[42%] max-w-7 rounded-t-md bg-[var(--accent)]"
                style={{ height: `${(row.mobile / max) * 100}%` }}
                title={`Móvil: ${row.mobile}`}
              />
            </div>
            <span className="truncate text-[10px] font-medium text-[var(--muted)]">
              {row.week}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
