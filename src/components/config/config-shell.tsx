"use client";

import { usePathname, useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { CATALOG_SECTIONS } from "@/lib/catalogs";
import { useCatalogs } from "@/components/config/catalog-context";

function currentSection(pathname: string) {
  return CATALOG_SECTIONS.find((s) => pathname.startsWith(s.href)) ?? null;
}

export function ConfigShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const section = currentSection(pathname);
  const { resetAll } = useCatalogs();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3 px-4 py-4 md:px-6 md:py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
              Configuración
            </p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--ink)] md:text-2xl">
              {section?.label ?? "Catálogos"}
            </h1>
            {section ? (
              <p className="mt-1 hidden text-sm text-[var(--muted)] md:block">
                {section.hint}
              </p>
            ) : null}

            {/* Submenú móvil (en desktop va en el sidebar) */}
            <label className="mt-3 block md:hidden">
              <span className="sr-only">Catálogo</span>
              <select
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm font-semibold text-[var(--ink)] outline-none"
                value={section?.href ?? CATALOG_SECTIONS[0].href}
                onChange={(e) => router.push(e.target.value)}
              >
                {CATALOG_SECTIONS.map((s) => (
                  <option key={s.key} value={s.href}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "¿Restablecer todos los catálogos a los datos semilla?"
                )
              ) {
                resetAll();
              }
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>
      </header>
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  );
}
