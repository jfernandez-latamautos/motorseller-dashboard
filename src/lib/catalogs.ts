export type CatalogId = string;

export interface ModuleCatalogItem {
  id: CatalogId;
  key: string;
  name: string;
  description: string;
  category: string;
  priority: boolean;
  active: boolean;
}

export interface DefinitionCatalogItem {
  id: CatalogId;
  term: string;
  text: string;
  active: boolean;
}

/** Solo catálogos del README v1 */
export type CatalogKey = "modulos" | "definiciones";

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
    hint: "Catálogo del panel Motor Seller",
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

/** Catálogo de módulos (README v1) */
export const SEED_MODULOS: ModuleCatalogItem[] = [
  {
    id: "mod_tablero",
    key: "tablero",
    name: "Tablero",
    description: "Home del panel: KPIs, cuotas y acciones rápidas",
    category: "inicio",
    priority: false,
    active: true,
  },
  {
    id: "mod_prospectos",
    key: "prospectos",
    name: "Prospectos",
    description: "Pipeline de oportunidades comerciales",
    category: "comercial",
    priority: true,
    active: true,
  },
  {
    id: "mod_perfilador",
    key: "perfilador",
    name: "Perfilador express",
    description: "Motorfy · precalificación de crédito",
    category: "comercial",
    priority: true,
    active: true,
  },
  {
    id: "mod_contactos",
    key: "contactos",
    name: "Contactos",
    description: "Directorio de personas del equipo comercial",
    category: "comercial",
    priority: false,
    active: true,
  },
  {
    id: "mod_leads",
    key: "leads",
    name: "Leads",
    description: "Leads entrantes (WhatsApp, web, etc.)",
    category: "comercial",
    priority: true,
    active: true,
  },
  {
    id: "mod_vehiculos",
    key: "vehiculos",
    name: "Vehículos",
    description: "Inventario publicado, destacados, nitros y descuentos",
    category: "inventario",
    priority: false,
    active: true,
  },
  {
    id: "mod_estadisticas",
    key: "estadisticas",
    name: "Estadísticas",
    description: "Impresiones, visitas, leads y rendimiento",
    category: "reportes",
    priority: true,
    active: true,
  },
  {
    id: "mod_usuarios",
    key: "usuarios",
    name: "Usuarios",
    description: "Miembros del equipo de la agencia",
    category: "administracion",
    priority: false,
    active: true,
  },
  {
    id: "mod_facturacion",
    key: "facturacion",
    name: "Facturación",
    description: "Historial de facturas y pagos",
    category: "administracion",
    priority: false,
    active: true,
  },
  {
    id: "mod_config",
    key: "configuracion",
    name: "Configuración",
    description: "Datos de agencia, plan, logos y leads",
    category: "general",
    priority: false,
    active: true,
  },
];

/** Definiciones fijas del README v1 */
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

export const CATALOG_STORAGE_KEY = "ms-dashboard-catalogs-v2";

export type CatalogState = {
  modulos: ModuleCatalogItem[];
  definiciones: DefinitionCatalogItem[];
};

export function defaultCatalogState(): CatalogState {
  return {
    modulos: SEED_MODULOS,
    definiciones: SEED_DEFINICIONES,
  };
}

export function newModule(
  partial?: Partial<ModuleCatalogItem>
): ModuleCatalogItem {
  return {
    id: id("mod"),
    key: "",
    name: "",
    description: "",
    category: "comercial",
    priority: false,
    active: true,
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
