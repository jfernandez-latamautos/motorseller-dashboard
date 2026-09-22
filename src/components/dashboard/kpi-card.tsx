import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  hint,
  delta,
  deltaPositive,
  icon: Icon,
  iconTone = "accent",
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  iconTone?: "accent" | "blue" | "green" | "amber" | "violet";
}) {
  const tones = {
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-sm)] md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-1.5 text-2xl leading-none font-bold tracking-tight text-[var(--ink)]">
            {value}
          </p>
        </div>
        <div className={cn("rounded-lg p-2", tones[iconTone])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        {delta ? (
          <span
            className={cn(
              "font-semibold",
              deltaPositive === true
                ? "text-emerald-600"
                : deltaPositive === false
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)]"
            )}
          >
            {delta}
          </span>
        ) : null}
        {hint ? <span className="text-[var(--muted)]">{hint}</span> : null}
      </div>
    </div>
  );
}
