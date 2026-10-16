export type CatalogId = string;

export type ModuleCatalogType = "key" | "operational" | "administrative";

/** Catálogo GET /modules — campos del contrato */
export interface ModuleCatalogItem {
  id: CatalogId;
  moduleId: number;
  /** slug interno para cruzar con uso en el dashboard */
  key: string;
  name: string;
  moduleGroup: string;
  type: ModuleCatalogType;
  lowUsageMax30d: number;
  topUsageMin30d: number;
  includeInAdoption: boolean;
  active: boolean;
  updatedAt: string;
}

export interface DefinitionCatalogItem {
  id: CatalogId;
  term: string;
  text: string;
  active: boolean;
}

/** GET /scoring-weights — fila única */
export interface ScoringWeights {
  volumeWeight: number;
  gapWeight: number;
  capacityWeight: number;
  recencyWeight: number;
  updatedAt: string;
  updatedBy: string | null;
}

/** GET /activity-thresholds — fila única (semáforo Alto / Medio / Bajo) */
export interface ActivityThresholds {
  highSessionsMin: number;
  highActiveModulesMin: number;
  lowSessionsMax: number;
  lowDaysWithoutSession: number;
  updatedAt: string;
  updatedBy: string | null;
}

export type CatalogKey =
  | "modulos"
  | "pesos"
  | "umbrales"
  | "definiciones";

export const CATALOG_SECTIONS: {
  key: CatalogKey;
  href: string;
  label: string;
  hint: string;
}[] = [
  {
    key: "modulos",
    href: "/config/modulos",
    label: "Módulos",
    hint: "Catálogo + umbrales de uso por módulo",
  },
  {
    key: "pesos",
    href: "/config/pesos",
    label: "Pesos de scoring",
    hint: "volume · gap · capacity · recency",
  },
  {
    key: "umbrales",
    href: "/config/umbrales",
    label: "Umbrales de actividad",
    hint: "Semáforo Alto / Medio / Bajo",
  },
  {
    key: "definiciones",
    href: "/config/definiciones",
    label: "Definiciones",
    hint: "Adopción, lead, sesión, CRM only",
  },
];

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const NOW = "2026-10-13T14:00:00.000Z";

export const SEED_SCORING_WEIGHTS: ScoringWeights = {
  volumeWeight: 0.4,
  gapWeight: 0.3,
  capacityWeight: 0.2,
  recencyWeight: 0.1,
  updatedAt: NOW,
  updatedBy: null,
};

export const SEED_ACTIVITY_THRESHOLDS: ActivityThresholds = {
  highSessionsMin: 8,
  highActiveModulesMin: 6,
  lowSessionsMax: 2,
  lowDaysWithoutSession: 15,
  updatedAt: NOW,
  updatedBy: null,
};

/** Catálogo de módulos alineado al contrato del doc */
export const SEED_MODULOS: ModuleCatalogItem[] = [
  {
    id: "mod_tablero",
    moduleId: 1,
    key: "tablero",
    name: "Tablero",
    moduleGroup: "Inicio",
    type: "operational",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_prospectos",
    moduleId: 2,
    key: "prospectos",
    name: "Prospectos",
    moduleGroup: "Comercial",
    type: "key",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_perfilador",
    moduleId: 3,
    key: "perfilador",
    name: "Perfilador express",
    moduleGroup: "Comercial",
    type: "key",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_contactos",
    moduleId: 4,
    key: "contactos",
    name: "Contactos",
    moduleGroup: "Comercial",
    type: "operational",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_leads",
    moduleId: 5,
    key: "leads",
    name: "Leads",
    moduleGroup: "Comercial",
    type: "key",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_vehiculos",
    moduleId: 6,
    key: "vehiculos",
    name: "Vehículos",
    moduleGroup: "Inventario",
    type: "operational",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_estadisticas",
    moduleId: 7,
    key: "estadisticas",
    name: "Estadísticas",
    moduleGroup: "Reportes",
    type: "key",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_usuarios",
    moduleId: 8,
    key: "usuarios",
    name: "Usuarios",
    moduleGroup: "Administración",
    type: "administrative",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: false,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_facturacion",
    moduleId: 9,
    key: "facturacion",
    name: "Facturación",
    moduleGroup: "Administración",
    type: "administrative",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: false,
    active: true,
    updatedAt: NOW,
  },
  {
    id: "mod_config",
    moduleId: 10,
    key: "configuracion",
    name: "Configuración",
    moduleGroup: "General",
    type: "administrative",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: false,
    active: true,
    updatedAt: NOW,
  },
];

export const SEED_DEFINICIONES: DefinitionCatalogItem[] = [
  {
    id: "def_adopcion",
    term: "Adopción",
    text: "% de agencias panel con ≥1 acción en el módulo (periodo).",
    active: true,
  },
  {
    id: "def_lead",
    term: "Lead",
    text: "Contacto entrante a la agencia en el periodo filtrado.",
    active: true,
  },
  {
    id: "def_sesion",
    term: "Sesión",
    text: "Visita al panel (web o app). Filtro de plataforma Web / Móvil.",
    active: true,
  },
  {
    id: "def_crm",
    term: "CRM only",
    text: "Agencia contratada sin acceso al panel Motor Seller (solo CRM).",
    active: true,
  },
];

export const CATALOG_STORAGE_KEY = "ms-dashboard-catalogs-v3";

export type CatalogState = {
  modulos: ModuleCatalogItem[];
  definiciones: DefinitionCatalogItem[];
  scoringWeights: ScoringWeights;
  activityThresholds: ActivityThresholds;
};

export function defaultCatalogState(): CatalogState {
  return {
    modulos: SEED_MODULOS.map((m) => ({ ...m })),
    definiciones: SEED_DEFINICIONES.map((d) => ({ ...d })),
    scoringWeights: { ...SEED_SCORING_WEIGHTS },
    activityThresholds: { ...SEED_ACTIVITY_THRESHOLDS },
  };
}

export function newModule(
  partial?: Partial<ModuleCatalogItem>
): ModuleCatalogItem {
  const nextId =
    Math.max(0, ...SEED_MODULOS.map((m) => m.moduleId)) +
    Math.floor(Math.random() * 1000) +
    1;
  return {
    id: id("mod"),
    moduleId: nextId,
    key: "",
    name: "",
    moduleGroup: "Comercial",
    type: "operational",
    lowUsageMax30d: 19,
    topUsageMin30d: 60,
    includeInAdoption: true,
    active: true,
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

export function newDefinition(
  partial?: Partial<DefinitionCatalogItem>
): DefinitionCatalogItem {
  return {
    id: id("def"),
    term: "",
    text: "",
    active: true,
    ...partial,
  };
}

/** 0 ≤ x ≤ 1, máx 3 decimales */
export function clampWeight(value: number): number {
  if (Number.isNaN(value)) return 0;
  const clamped = Math.min(1, Math.max(0, value));
  return Math.round(clamped * 1000) / 1000;
}
