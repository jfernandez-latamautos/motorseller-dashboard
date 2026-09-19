import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { FilterProvider } from "@/components/filters/filter-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </FilterProvider>
  );
}
