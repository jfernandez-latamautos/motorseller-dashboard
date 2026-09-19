import { cn } from "@/lib/utils";
import type { Country, EngagementLevel, AccessType, DealerTier } from "@/lib/types";

export function CountryBadge({ country }: { country: Country }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        country === "MX"
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[#f0f0f0] text-[#222]"
      )}
    >
      {country === "MX" ? "MX · Seminuevos" : "EC · Patiotuerca"}
    </span>
  );
}

export function EngagementBadge({ level }: { level: EngagementLevel }) {
  const styles: Record<EngagementLevel, string> = {
    high: "bg-emerald-50 text-emerald-700",
    medium: "bg-sky-50 text-sky-700",
    low: "bg-amber-50 text-amber-700",
    dormant: "bg-[#f0f0f0] text-[#717171]",
  };
  const labels: Record<EngagementLevel, string> = {
    high: "Alto",
    medium: "Medio",
    low: "Bajo",
    dormant: "Inactivo",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
        styles[level]
      )}
    >
      {labels[level]}
    </span>
  );
}

export function AccessBadge({ access }: { access: AccessType }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
        access === "panel"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-violet-50 text-violet-700"
      )}
    >
      {access === "panel" ? "Panel" : "CRM only"}
    </span>
  );
}

export function TierBadge({ tier }: { tier: DealerTier }) {
  return (
    <span className="inline-flex rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-semibold text-[#717171] capitalize">
      {tier}
    </span>
  );
}
