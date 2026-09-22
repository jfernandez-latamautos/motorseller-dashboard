import { Info } from "lucide-react";

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

export function DefinitionsBanner() {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-[var(--accent)]" />
        <p className="text-xs font-bold text-[var(--ink)]">Definiciones v1</p>
      </div>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
        {DEFS.map((d) => (
          <div key={d.term} className="min-w-0">
            <dt className="text-[11px] font-bold text-[var(--ink)]">{d.term}</dt>
            <dd className="text-[11px] leading-snug text-[var(--muted)]">
              {d.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
