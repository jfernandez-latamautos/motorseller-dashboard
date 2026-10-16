"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

/** Solo términos del README v1 */
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
    text: "Visita al panel (web o app). Filtro de plataforma Web / Móvil.",
  },
  {
    term: "CRM only",
    text: "Agencia contratada sin acceso al panel Motor Seller (solo CRM).",
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
          <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar definiciones"
              onClick={() => setOpen(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="defs-title"
              className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-3xl bg-[var(--surface)] shadow-[var(--shadow-md)] md:max-h-[85vh] md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--accent)]" />
                  <div>
                    <h2
                      id="defs-title"
                      className="text-base font-bold text-[var(--ink)]"
                    >
                      Definiciones
                    </h2>
                    <p className="text-xs text-[var(--muted)] md:hidden">v1</p>
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

              <dl className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:grid md:grid-cols-2 md:gap-4 md:p-6">
                {DEFS.map((d) => (
                  <div key={d.term} className="mb-4 last:mb-0 md:mb-0">
                    <dt className="text-sm font-bold text-[var(--ink)] md:text-xs">
                      {d.term}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-[var(--muted)] md:text-xs">
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--ink)]"
      >
        <Info className="h-3.5 w-3.5" />
        Definiciones
      </button>
      {dialog}
    </>
  );
}
