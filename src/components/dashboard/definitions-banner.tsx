"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

const DEFS = [
  {
    term: "Adopción",
    text: "% de agencias panel con ≥1 acción en el módulo (periodo).",
  },
  {
    term: "Lead",
    text: "Contacto entrante a la agencia en el periodo filtrado.",
  },
  {
    term: "Sesión",
    text: "Visita al panel (web o app). Filtro Web / Móvil.",
  },
  {
    term: "Ejecutivo (AM)",
    text: "Account Manager de LatamAutos a cargo de la agencia.",
  },
  {
    term: "Demo / entrevista",
    text: "Demo = gap en módulo clave. Entrevista = champion.",
  },
  {
    term: "Growth",
    text: "Variación vs el periodo anterior de igual duración.",
  },
];

export function DefinitionsButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dialog =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100]">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar definiciones"
              onClick={() => setOpen(false)}
            />

            {/* Móvil: bottom sheet nativo */}
            <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-md)] md:hidden">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--accent)]" />
                  <div>
                    <p className="text-base font-bold text-[var(--ink)]">
                      Definiciones
                    </p>
                    <p className="text-xs text-[var(--muted)]">v1</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 hover:bg-[var(--bg)]"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <dl className="flex flex-col gap-4 p-4">
                {DEFS.map((d) => (
                  <div key={d.term}>
                    <dt className="text-sm font-bold text-[var(--ink)]">
                      {d.term}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-[var(--muted)]">
                      {d.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Desktop: modal centrado */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="defs-title"
              className="absolute top-1/2 left-1/2 hidden w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] md:block"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--accent)]" />
                  <h2
                    id="defs-title"
                    className="text-base font-bold text-[var(--ink)]"
                  >
                    Definiciones
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--bg)]"
                >
                  <X className="h-4 w-4 text-[var(--muted)]" />
                </button>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                {DEFS.map((d) => (
                  <div key={d.term}>
                    <dt className="text-xs font-bold text-[var(--ink)]">
                      {d.term}
                    </dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                      {d.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--ink)] md:h-9"
      >
        <Info className="h-3.5 w-3.5" />
        Definiciones
      </button>
      {dialog}
    </>
  );
}
