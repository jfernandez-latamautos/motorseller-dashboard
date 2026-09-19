export type Country = "MX" | "EC";
export type Marketplace = "Seminuevos" | "Patiotuerca";
export type AccessType = "panel" | "crm_only";
export type Platform = "web" | "mobile";
export type DealerTier = "enterprise" | "pro" | "basic";
export type EngagementLevel = "high" | "medium" | "low" | "dormant";

/** Módulos reales del panel Motor Seller */
export type ModuleKey =
  | "tablero"
  | "prospectos"
  | "perfilador"
  | "contactos"
  | "leads"
  | "vehiculos"
  | "estadisticas"
  | "usuarios"
  | "facturacion"
  | "configuracion";

export type ModuleCategory =
  | "inicio"
  | "comercial"
  | "inventario"
  | "reportes"
  | "administracion"
  | "general";

export interface ModuleDefinition {
  key: ModuleKey;
  name: string;
  description: string;
  category: ModuleCategory;
}

export interface ModuleUsage {
  module: ModuleKey;
  adopted: boolean;
  lastUsedAt: string | null;
  actions30d: number;
}

export interface QuotaUsage {
  used: number;
  limit: number;
}

export interface Dealer {
  id: string;
  name: string;
  agencyCode: string;
  country: Country;
  marketplace: Marketplace;
  city: string;
  accessType: AccessType;
  tier: DealerTier;
  inventoryCount: number;
  inventoryPublished: number;
  inventoryUnpublished: number;
  inventoryPending: number;
  inventoryVerified: number;
  impressions30d: number;
  visits30d: number;
  leads30d: number;
  ads: QuotaUsage;
  destacados: QuotaUsage;
  nitros: QuotaUsage;
  descuentos: QuotaUsage;
  webSessions30d: number;
  mobileSessions30d: number;
  lastLoginAt: string | null;
  modules: ModuleUsage[];
  accountManager: string;
  createdAt: string;
  teamUsers: number;
}

export interface DashboardFilters {
  country: Country | "all";
  accessType: AccessType | "panel_preferred" | "all";
  platform: Platform | "all";
  rangeDays: 7 | 30 | 90;
  search: string;
}
