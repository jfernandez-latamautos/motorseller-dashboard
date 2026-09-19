"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEALERS } from "@/lib/mock-data";
import { filterDealers } from "@/lib/metrics";
import type { DashboardFilters, Dealer } from "@/lib/types";

const defaultFilters: DashboardFilters = {
  country: "all",
  accessType: "panel_preferred",
  platform: "all",
  rangeDays: 30,
  search: "",
};

type FilterContextValue = {
  filters: DashboardFilters;
  setFilters: (next: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  dealers: Dealer[];
  filteredDealers: Dealer[];
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardFilters>(defaultFilters);

  const setFilters = (next: Partial<DashboardFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  };

  const resetFilters = () => setFiltersState(defaultFilters);

  const filteredDealers = useMemo(
    () => filterDealers(DEALERS, filters),
    [filters]
  );

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      dealers: DEALERS,
      filteredDealers,
    }),
    [filters, filteredDealers]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
