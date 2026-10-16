"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG_STORAGE_KEY,
  defaultCatalogState,
  type ActivityThresholds,
  type CatalogState,
  type DefinitionCatalogItem,
  type ModuleCatalogItem,
  type ScoringWeights,
} from "@/lib/catalogs";

type CatalogContextValue = {
  ready: boolean;
  state: CatalogState;
  resetAll: () => void;
  upsertModulo: (item: ModuleCatalogItem) => void;
  removeModulo: (id: string) => void;
  upsertDefinicion: (item: DefinitionCatalogItem) => void;
  removeDefinicion: (id: string) => void;
  setScoringWeights: (weights: ScoringWeights) => void;
  setActivityThresholds: (thresholds: ActivityThresholds) => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function loadState(): CatalogState {
  if (typeof window === "undefined") return defaultCatalogState();
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return defaultCatalogState();
    const parsed = JSON.parse(raw) as Partial<CatalogState>;
    const base = defaultCatalogState();
    return {
      modulos: parsed.modulos ?? base.modulos,
      definiciones: parsed.definiciones ?? base.definiciones,
      scoringWeights: parsed.scoringWeights ?? base.scoringWeights,
      activityThresholds:
        parsed.activityThresholds ?? base.activityThresholds,
    };
  } catch {
    return defaultCatalogState();
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(defaultCatalogState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const resetAll = useCallback(() => {
    const next = defaultCatalogState();
    setState(next);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const patch = useCallback(
    <K extends keyof CatalogState>(
      key: K,
      updater: (rows: CatalogState[K]) => CatalogState[K]
    ) => {
      setState((prev) => ({ ...prev, [key]: updater(prev[key]) }));
    },
    []
  );

  const value = useMemo<CatalogContextValue>(
    () => ({
      ready,
      state,
      resetAll,
      upsertModulo: (item) =>
        patch("modulos", (rows) => {
          const i = rows.findIndex((r) => r.id === item.id);
          if (i >= 0) {
            const next = [...rows];
            next[i] = item;
            return next;
          }
          return [...rows, item];
        }),
      removeModulo: (id) =>
        patch("modulos", (rows) => rows.filter((r) => r.id !== id)),
      upsertDefinicion: (item) =>
        patch("definiciones", (rows) => {
          const i = rows.findIndex((r) => r.id === item.id);
          if (i >= 0) {
            const next = [...rows];
            next[i] = item;
            return next;
          }
          return [...rows, item];
        }),
      removeDefinicion: (id) =>
        patch("definiciones", (rows) => rows.filter((r) => r.id !== id)),
      setScoringWeights: (weights) =>
        setState((prev) => ({ ...prev, scoringWeights: weights })),
      setActivityThresholds: (thresholds) =>
        setState((prev) => ({ ...prev, activityThresholds: thresholds })),
    }),
    [ready, state, resetAll, patch]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogs() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalogs must be used within CatalogProvider");
  return ctx;
}
