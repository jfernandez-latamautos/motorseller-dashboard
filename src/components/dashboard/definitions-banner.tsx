import { Info } from "lucide-react";

const DEFS = [
  {
    term: "Adopción",
    text: "% de agencias panel con el módulo activo (al menos 1 acción en el periodo).",
  },
  {
    term: "Lead",
    text: "Contacto entrante a la agencia (WhatsApp, web, etc.) en el periodo filtrado.",
  },
  {
    term: "Sesión",
    text: "Visita al panel Motor Seller (web o app). Se filtra con Web / Móvil.",
  },
  {
    term: "CRM only",
    text: "Agencia con feed/integración que no entra al panel. Excluida por defecto.",
  },
];

export function DefinitionsBanner() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-[var(--accent)]" />
        <p className="text-sm font-bold text-[var(--ink)]">Definiciones v1</p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DEFS.map((d) => (
          <div key={d.term}>
            <dt className="text-xs font-bold text-[var(--ink)]">{d.term}</dt>
            <dd className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
              {d.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
