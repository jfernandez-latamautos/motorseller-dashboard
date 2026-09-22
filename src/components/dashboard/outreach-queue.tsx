"use client";

import { Download } from "lucide-react";
import {
  formatNumber,
  outreachCandidates,
  type OutreachCandidate,
} from "@/lib/metrics";
import { downloadCsv } from "@/lib/export-csv";
import type { Dealer } from "@/lib/types";
import { cn } from "@/lib/utils";

const VISIBLE = 15;

export function OutreachQueue({ dealers }: { dealers: Dealer[] }) {
  const all = outreachCandidates(dealers);
  const visible = all.slice(0, VISIBLE);
  const demos = all.filter((c) => c.kind === "demo").length;
  const interviews = all.filter((c) => c.kind === "interview").length;

  const exportCsv = () => {
    downloadCsv(
      "motorseller-candidatos-outreach.csv",
      [
        "Tipo",
        "Agencia",
        "ID",
        "País",
        "Ciudad",
        "Ejecutivo cuenta",
        "Motivo",
        "Módulos faltantes",
        "Score",
        "Leads",
      ],
      all.map((c) => [
        c.kind === "demo" ? "Demo" : "Entrevista",
        c.dealer.name,
        c.dealer.id,
        c.dealer.country,
        c.dealer.city,
        c.dealer.accountManager,
        c.reason,
        c.missing.map((m) => m.name).join("; "),
        c.score,
        c.dealer.leads30d,
      ])
    );
  };

  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[var(--ink)]">
            Demo / entrevista
          </h2>
          <p className="truncate text-xs text-[var(--muted)]">
            {demos} demos · {interviews} entrevistas · top {VISIBLE}
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={all.length === 0}
          className="inline-flex h-8 shrink-0 items-center gap-1 text-xs font-semibold text-[var(--accent)] disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          CSV
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--muted)]">
          Sin candidatos con estos filtros
        </p>
      ) : (
        <ul className="max-h-[22rem] overflow-y-auto overscroll-contain pr-1">
          {visible.map((c) => (
            <CandidateRow key={c.dealer.id} candidate={c} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CandidateRow({ candidate }: { candidate: OutreachCandidate }) {
  const { dealer, kind, reason, score } = candidate;

  return (
    <li className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-2.5 first:pt-0 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--ink)]">
          <span
            className={cn(
              "mr-1.5 font-bold",
              kind === "demo" ? "text-[var(--accent)]" : "text-emerald-600"
            )}
          >
            {kind === "demo" ? "Demo" : "Entrevista"}
          </span>
          {dealer.name}
        </p>
        <p className="truncate text-[11px] text-[var(--muted)]">{reason}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-[var(--ink)]">{score}</p>
        <p className="text-[10px] text-[var(--muted)]">
          {formatNumber(dealer.leads30d)} leads
        </p>
      </div>
    </li>
  );
}
