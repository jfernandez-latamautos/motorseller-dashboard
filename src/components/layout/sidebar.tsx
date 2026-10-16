"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { CATALOG_SECTIONS } from "@/lib/catalogs";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/modules", label: "Módulos", icon: Boxes },
  { href: "/dealers", label: "Agencias", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const configActive = pathname.startsWith("/config");
  const [configOpen, setConfigOpen] = useState(configActive);

  useEffect(() => {
    if (configActive) setConfigOpen(true);
  }, [configActive]);

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
      <div className="border-b border-[var(--border)] px-5 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-laa.png"
          alt="LatamAutos"
          width={200}
          height={40}
          className="h-8 w-auto object-contain object-left"
        />
        <p className="mt-2 text-[11px] font-semibold text-[var(--muted)]">
          Motor Seller · Dashboard v1
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                  : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-1">
          <button
            type="button"
            onClick={() => setConfigOpen((o) => !o)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
              configActive
                ? "font-semibold text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
            )}
            aria-expanded={configOpen}
          >
            <Settings2 className="h-4 w-4" />
            <span className="flex-1 text-left">Configuración</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                configOpen && "rotate-180"
              )}
            />
          </button>

          {configOpen ? (
            <ul className="mt-0.5 ml-3 flex flex-col gap-0.5 border-l border-[var(--border)] pl-2">
              {CATALOG_SECTIONS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                          : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <p className="text-[11px] leading-relaxed text-[var(--muted)]">
          Seminuevos · México
          <br />
          Patiotuerca · Ecuador
        </p>
      </div>
    </aside>
  );
}
