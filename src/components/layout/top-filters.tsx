"use client";

import Image from "next/image";
import { FilterSheet, DesktopFilters } from "@/components/layout/filter-sheet";
import { useFilters } from "@/components/filters/filter-context";

export function TopFilters({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const { filters, filteredDealers } = useFilters();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      {/* Mobile app bar */}
      <div className="flex items-center gap-3 px-4 py-3 md:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
            />
            <h1 className="truncate text-lg font-bold text-[var(--ink)]">
              {title}
            </h1>
          </div>
          <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
            {filteredDealers.length} agencias · {filters.rangeDays}d
            {subtitle ? ` · ${subtitle}` : ""}
          </p>
        </div>
        <FilterSheet />
        {trailing}
      </div>

      {/* Desktop */}
      <div className="hidden flex-col gap-4 px-6 py-5 md:flex lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DesktopFilters />
          {trailing}
        </div>
      </div>
    </header>
  );
}
