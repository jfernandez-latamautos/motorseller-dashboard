"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/modules", label: "Módulos", icon: Boxes },
  { href: "/dealers", label: "Agencias", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <Image
          src="/logo-laa.png"
          alt="LatamAutos"
          width={200}
          height={40}
          className="h-8 w-auto object-contain object-left"
          priority
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
