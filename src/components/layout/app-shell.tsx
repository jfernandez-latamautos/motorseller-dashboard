import { Sidebar } from "@/components/layout/sidebar";
import { FilterProvider } from "@/components/filters/filter-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </FilterProvider>
  );
}
