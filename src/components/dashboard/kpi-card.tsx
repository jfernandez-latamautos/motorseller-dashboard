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
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-2 text-[28px] leading-none font-bold tracking-tight text-[var(--ink)]">
            {value}
          </p>
        </div>
        <div className={cn("rounded-xl p-2.5", tones[iconTone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta ? (
          <span
            className={cn(
              "font-semibold",
              deltaPositive ? "text-emerald-600" : "text-[var(--muted)]"
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
