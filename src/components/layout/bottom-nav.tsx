"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/modules", label: "Módulos", icon: Boxes },
  { href: "/dealers", label: "Agencias", icon: Building2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="grid h-16 grid-cols-3">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                  active ? "text-[var(--accent)]" : "text-[var(--muted)]"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
