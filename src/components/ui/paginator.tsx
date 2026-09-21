"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Paginator({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (total === 0 || pageCount <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5",
        className
      )}
    >
      <p className="text-xs text-[var(--muted)]">
        <span className="font-semibold text-[var(--ink)]">
          {from}–{to}
        </span>{" "}
        de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[4.5rem] text-center text-xs font-semibold text-[var(--ink)]">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          aria-label="Página siguiente"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
