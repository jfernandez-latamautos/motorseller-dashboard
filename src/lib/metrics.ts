import type {
  DashboardFilters,
  Dealer,
  EngagementLevel,
  ModuleKey,
} from "./types";
import { MODULES } from "./mock-data";

/** Los mocks están en base 30 días; se proyectan al rango del filtro */
const BASELINE_DAYS = 30;

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

export function lowActivityThreshold(
  rangeDays: DashboardFilters["rangeDays"]
): number {
  return Math.max(3, Math.round(20 * rangeFactor(rangeDays)));
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

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const haystack = [
          dealer.name,
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

  const daysSinceLogin =
    (Date.now() - new Date(dealer.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceLogin > 21) return "dormant";

  const score = engagementScore(dealer);
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  if (score >= 15) return "low";
  return "dormant";
}

export function moduleAdoptionRate(dealers: Dealer[], module: ModuleKey): number {
  const panel = dealers.filter((d) => d.accessType === "panel");
  if (panel.length === 0) return 0;
  const adopted = panel.filter((d) =>
    d.modules.some((m) => m.module === module && m.adopted)
  ).length;
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
