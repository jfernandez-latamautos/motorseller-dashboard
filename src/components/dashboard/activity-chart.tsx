"use client";

import { ACTIVITY_TREND } from "@/lib/mock-data";

const max = Math.max(
  ...ACTIVITY_TREND.map((d) => Math.max(d.web, d.mobile)),
  1
);

export function ActivityChart() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] md:p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--ink)]">
          Actividad web vs móvil
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Sesiones semanales de agencias con acceso al panel
        </p>
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="inline-block h-2.5 w-2.5 rounded-sm bg-[#222]" /> Web
        </span>
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <i className="inline-block h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />{" "}
          Móvil
        </span>
      </div>

      <div className="flex h-52 items-end gap-2 sm:gap-3">
        {ACTIVITY_TREND.map((row) => (
          <div
            key={row.week}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-40 w-full items-end justify-center gap-1">
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
            <span className="truncate text-[10px] font-medium text-[var(--muted)] sm:text-[11px]">
              {row.week}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
