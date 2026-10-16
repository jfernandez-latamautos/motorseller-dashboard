import type {
  DashboardFilters,
  Dealer,
  EngagementLevel,
  ModuleKey,
} from "./types";
import { MODULES, PERIOD_GROWTH } from "./mock-data";

/** Módulos prioritarios para demos / growth */
export const PRIORITY_MODULES: ModuleKey[] = [
  "perfilador",
  "prospectos",
  "estadisticas",
  "leads",
];


/** Los mocks están en base 30 días; se proyectan al rango del filtro */
const BASELINE_DAYS = 30;
/** Misma ancla que mock-data / engagementLevel */
const MOCK_NOW_MS = Date.parse("2026-09-21T12:00:00.000Z");

export function rangeFactor(rangeDays: number): number {
  return rangeDays / BASELINE_DAYS;
}

/** Proyecta métricas de periodo al rango seleccionado (prototipo) */
export function withRangeMetrics(
  dealer: Dealer,
  rangeDays: DashboardFilters["rangeDays"]
): Dealer {
  const f = rangeFactor(rangeDays);
  return {
    ...dealer,
    impressions30d: Math.round(dealer.impressions30d * f),
    visits30d: Math.round(dealer.visits30d * f),
    leads30d: Math.round(dealer.leads30d * f),
    webSessions30d: Math.round(dealer.webSessions30d * f),
    mobileSessions30d: Math.round(dealer.mobileSessions30d * f),
    modules: dealer.modules.map((m) => ({
      ...m,
      actions30d: Math.round(m.actions30d * f),
    })),
  };
}

/**
 * Acciones efectivas en el periodo: si el último uso queda fuera del rango,
 * cuenta como 0 (así el filtro de periodo sí mueve segmentos de módulos).
 */
export function moduleActionsInRange(
  adopted: boolean,
  actionsScaled: number,
  lastUsedAt: string | null,
  rangeDays: DashboardFilters["rangeDays"]
): number {
  if (!adopted || actionsScaled <= 0) return 0;
  if (!lastUsedAt) return 0;
  const daysSince =
    (MOCK_NOW_MS - new Date(lastUsedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince > rangeDays) return 0;
  return actionsScaled;
}

/** Umbrales por ventana (no proporcionales al scale de mocks → el periodo cambia bandas) */
export function lowActivityThreshold(
  rangeDays: DashboardFilters["rangeDays"]
): number {
  if (rangeDays <= 7) return 8;
  if (rangeDays <= 30) return 20;
  return 35;
}

/** Umbral para “top uso” del módulo (acciones en el periodo) */
export function topActivityThreshold(
  rangeDays: DashboardFilters["rangeDays"]
): number {
  if (rangeDays <= 7) return 25;
  if (rangeDays <= 30) return 60;
  return 100;
}

export type ModuleUsageBand = "none" | "low" | "moderate" | "top";

export function moduleUsageBand(
  adopted: boolean,
  actions: number,
  rangeDays: DashboardFilters["rangeDays"],
  lastUsedAt: string | null = null
): ModuleUsageBand {
  const effective = moduleActionsInRange(
    adopted,
    actions,
    lastUsedAt,
    rangeDays
  );
  if (!adopted || effective <= 0) return "none";
  const low = lowActivityThreshold(rangeDays);
  const top = topActivityThreshold(rangeDays);
  if (effective < low) return "low";
  if (effective < top) return "moderate";
  return "top";
}


export function filterDealers(
  dealers: Dealer[],
  filters: DashboardFilters
): Dealer[] {
  return dealers
    .filter((dealer) => {
      if (filters.country !== "all" && dealer.country !== filters.country) {
        return false;
      }

      if (filters.accessType === "panel_preferred") {
        if (dealer.accessType !== "panel") return false;
      } else if (filters.accessType !== "all") {
        if (dealer.accessType !== filters.accessType) return false;
      }

      if (
        filters.accountManager !== "all" &&
        dealer.accountManager !== filters.accountManager
      ) {
        return false;
      }

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const haystack = [
          dealer.name,
          dealer.id,
          dealer.agencyCode,
          dealer.city,
          dealer.marketplace,
          dealer.accountManager,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    })
    .map((dealer) => withRangeMetrics(dealer, filters.rangeDays));
}

export function totalSessions(
  dealer: Dealer,
  platform: DashboardFilters["platform"]
) {
  if (platform === "web") return dealer.webSessions30d;
  if (platform === "mobile") return dealer.mobileSessions30d;
  return dealer.webSessions30d + dealer.mobileSessions30d;
}

export function adoptedModulesCount(dealer: Dealer): number {
  return dealer.modules.filter((m) => m.adopted).length;
}

export function engagementScore(dealer: Dealer): number {
  if (dealer.accessType === "crm_only") return 0;

  const sessions = dealer.webSessions30d + dealer.mobileSessions30d;
  const moduleActions = dealer.modules.reduce((sum, m) => sum + m.actions30d, 0);
  const adoption = adoptedModulesCount(dealer) / MODULES.length;
  const inventoryHealth =
    dealer.inventoryCount === 0
      ? 0
      : dealer.inventoryPublished / dealer.inventoryCount;

  const raw =
    sessions * 0.35 +
    moduleActions * 0.25 +
    adoption * 200 +
    inventoryHealth * 80 +
    dealer.leads30d * 0.4;

  return Math.round(Math.min(100, raw / 12));
}

export function engagementLevel(dealer: Dealer): EngagementLevel {
  if (dealer.accessType === "crm_only") return "dormant";
  if (!dealer.lastLoginAt) return "dormant";

  /** Misma ancla que mock-data para SSR estable */
  const now = new Date("2026-09-21T12:00:00.000Z").getTime();
  const daysSinceLogin =
    (now - new Date(dealer.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLogin > 21) return "dormant";

  const score = engagementScore(dealer);
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  if (score >= 15) return "low";
  return "dormant";
}

export function moduleAdoptionRate(
  dealers: Dealer[],
  module: ModuleKey,
  rangeDays: DashboardFilters["rangeDays"] = 30
): number {
  const panel = dealers.filter((d) => d.accessType === "panel");
  if (panel.length === 0) return 0;
  const adopted = panel.filter((d) => {
    const m = d.modules.find((x) => x.module === module);
    if (!m) return false;
    return (
      moduleActionsInRange(m.adopted, m.actions30d, m.lastUsedAt, rangeDays) > 0
    );
  }).length;
  return Math.round((adopted / panel.length) * 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function computeKpis(dealers: Dealer[], allDealers: Dealer[]) {
  const panel = dealers.filter((d) => d.accessType === "panel");
  const crmOnly = dealers.filter((d) => d.accessType === "crm_only");
  const inventory = panel.reduce((s, d) => s + d.inventoryPublished, 0);
  const impressions = panel.reduce((s, d) => s + d.impressions30d, 0);
  const visits = panel.reduce((s, d) => s + d.visits30d, 0);
  const leads = panel.reduce((s, d) => s + d.leads30d, 0);
  const web = panel.reduce((s, d) => s + d.webSessions30d, 0);
  const mobile = panel.reduce((s, d) => s + d.mobileSessions30d, 0);
  const active = panel.filter((d) => engagementLevel(d) !== "dormant").length;
  const dormant = panel.filter((d) => engagementLevel(d) === "dormant").length;
  const destacados = panel.reduce((s, d) => s + d.destacados.used, 0);
  const avgModules =
    panel.length === 0
      ? 0
      : panel.reduce((s, d) => s + adoptedModulesCount(d), 0) / panel.length;

  const totalContracted = allDealers.length;
  const panelShare = Math.round(
    (panel.length / Math.max(totalContracted, 1)) * 100
  );

  return {
    panelDealers: panel.length,
    crmOnly: crmOnly.length,
    activeDealers: active,
    dormantDealers: dormant,
    inventoryPublished: inventory,
    impressions,
    visits,
    leads,
    destacados,
    webSessions: web,
    mobileSessions: mobile,
    mobileShare:
      web + mobile === 0 ? 0 : Math.round((mobile / (web + mobile)) * 100),
    avgModules: Math.round(avgModules * 10) / 10,
    panelShare,
  };
}

export function formatDeltaPercent(fraction: number): string {
  const pct = Math.round(fraction * 100);
  if (pct === 0) return "0%";
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

export function formatDeltaPoints(points: number): string {
  if (points === 0) return "0 pp";
  return points > 0 ? `+${points} pp` : `${points} pp`;
}

/** Growth base por país — al filtrar, los %+ dejan de verse “pegados” */
const GROWTH_BY_COUNTRY = {
  MX: {
    leads: 0.14,
    sessions: 0.1,
    inventory: 0.05,
    activeDealers: 0.08,
  },
  EC: {
    leads: 0.05,
    sessions: 0.03,
    inventory: 0.01,
    activeDealers: 0.02,
  },
} as const;

const MODULE_GROWTH_EC: Partial<Record<ModuleKey, number>> = {
  perfilador: 2,
  prospectos: 1,
  estadisticas: 1,
  leads: 2,
  contactos: 3,
  configuracion: 1,
  vehiculos: 0,
  facturacion: 0,
};

function blendGrowth(
  dealers: Dealer[],
  key: keyof typeof GROWTH_BY_COUNTRY.MX
): number {
  const panel = dealers.filter((d) => d.accessType === "panel");
  if (panel.length === 0) return PERIOD_GROWTH[key];
  const mx = panel.filter((d) => d.country === "MX").length;
  const ec = panel.length - mx;
  return (
    (mx * GROWTH_BY_COUNTRY.MX[key] + ec * GROWTH_BY_COUNTRY.EC[key]) /
    panel.length
  );
}

/** KPIs del periodo + variación vs periodo anterior (según cohorte filtrada) */
export function computeKpisWithGrowth(
  dealers: Dealer[],
  allDealers: Dealer[]
) {
  const kpis = computeKpis(dealers, allDealers);
  return {
    ...kpis,
    growth: {
      leads: blendGrowth(dealers, "leads"),
      sessions: blendGrowth(dealers, "sessions"),
      inventory: blendGrowth(dealers, "inventory"),
      activeDealers: blendGrowth(dealers, "activeDealers"),
    },
  };
}

export function moduleAdoptionWithGrowth(
  dealers: Dealer[],
  rangeDays: DashboardFilters["rangeDays"] = 30
) {
  const panel = dealers.filter((d) => d.accessType === "panel");
  const mxShare =
    panel.length === 0
      ? 0.5
      : panel.filter((d) => d.country === "MX").length / panel.length;

  return MODULES.map((mod) => {
    const rate = moduleAdoptionRate(dealers, mod.key, rangeDays);
    const mxDelta = PERIOD_GROWTH.modules[mod.key] ?? 0;
    const ecDelta = MODULE_GROWTH_EC[mod.key] ?? mxDelta;
    const deltaPp = Math.round(mxShare * mxDelta + (1 - mxShare) * ecDelta);
    return {
      mod,
      rate,
      deltaPp,
      previousRate: Math.max(0, Math.min(100, rate - deltaPp)),
    };
  });
}

export function listAccountManagers(dealers: Dealer[]): string[] {
  return [...new Set(dealers.map((d) => d.accountManager))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

/**
 * Captación por ejecutivo: agencias, leads y % adopción de módulos prioritarios.
 */
export function executiveCapture(
  dealers: Dealer[],
  rangeDays: DashboardFilters["rangeDays"] = 30
) {
  const byAm = new Map<string, Dealer[]>();
  for (const d of dealers) {
    const list = byAm.get(d.accountManager) ?? [];
    list.push(d);
    byAm.set(d.accountManager, list);
  }

  return [...byAm.entries()]
    .map(([name, list]) => {
      const panel = list.filter((d) => d.accessType === "panel");
      const leads = panel.reduce((s, d) => s + d.leads30d, 0);
      const priorityAdoption =
        panel.length === 0
          ? 0
          : Math.round(
              PRIORITY_MODULES.reduce(
                (sum, key) =>
                  sum + moduleAdoptionRate(panel, key, rangeDays),
                0
              ) / PRIORITY_MODULES.length
            );
      const adoptedAnyPriority =
        panel.length === 0
          ? 0
          : Math.round(
              (panel.filter((d) =>
                PRIORITY_MODULES.some((key) => {
                  const m = d.modules.find((x) => x.module === key);
                  if (!m) return false;
                  return (
                    moduleActionsInRange(
                      m.adopted,
                      m.actions30d,
                      m.lastUsedAt,
                      rangeDays
                    ) > 0
                  );
                })
              ).length /
                panel.length) *
                100
            );

      return {
        name,
        agencies: panel.length,
        leads,
        priorityAdoption,
        adoptedAnyPriority,
      };
    })
    .sort((a, b) => a.priorityAdoption - b.priorityAdoption);
}

export type OutreachKind = "demo" | "interview";

export type OutreachCandidate = {
  dealer: Dealer;
  kind: OutreachKind;
  reason: string;
  missing: { key: ModuleKey; name: string }[];
  score: number;
};

/**
 * Cola PM: champions (entrevista) o activos con gaps en módulos clave (demo).
 * Criterio amplio para el prototipo (incluye medium/low con gaps).
 */
export function outreachCandidates(dealers: Dealer[]): OutreachCandidate[] {
  const panel = dealers.filter((d) => d.accessType === "panel");
  const nameByKey = Object.fromEntries(
    MODULES.map((m) => [m.key, m.name])
  ) as Record<ModuleKey, string>;

  const rows: OutreachCandidate[] = [];

  for (const dealer of panel) {
    const level = engagementLevel(dealer);
    const score = engagementScore(dealer);
    const missing = PRIORITY_MODULES.filter(
      (key) => !dealer.modules.some((m) => m.module === key && m.adopted)
    ).map((key) => ({ key, name: nameByKey[key] }));

    if (level === "dormant") continue;

    if (level === "high" && missing.length <= 1) {
      rows.push({
        dealer,
        kind: "interview",
        reason: "Champion · alto uso del panel",
        missing,
        score,
      });
      continue;
    }

    if (missing.length > 0) {
      const topGap = missing[0];
      rows.push({
        dealer,
        kind: "demo",
        reason:
          level === "low"
            ? `Reactivar · no usa ${topGap.name}`
            : `Demo · no usa ${topGap.name}`,
        missing,
        score,
      });
    } else if (level === "high" || level === "medium") {
      rows.push({
        dealer,
        kind: "interview",
        reason: "Champion · buen uso de módulos clave",
        missing,
        score,
      });
    }
  }

  return rows.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "demo" ? -1 : 1;
    return b.score - a.score;
  });
}
