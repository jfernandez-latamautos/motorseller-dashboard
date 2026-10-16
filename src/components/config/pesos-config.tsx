"use client";

import { useEffect, useState } from "react";
import { useCatalogs } from "@/components/config/catalog-context";
import {
  FormField,
  catalogFieldClass,
} from "@/components/config/catalog-ui";
import {
  clampWeight,
  type ScoringWeights,
} from "@/lib/catalogs";

const FIELDS: {
  key: keyof Pick<
    ScoringWeights,
    "volumeWeight" | "gapWeight" | "capacityWeight" | "recencyWeight"
  >;
  label: string;
  hint: string;
}[] = [
  {
    key: "volumeWeight",
    label: "volumeWeight",
    hint: "Prioriza agencias con más leads e inventario publicado",
  },
  {
    key: "gapWeight",
    label: "gapWeight",
    hint: "Prioriza agencias que no usan módulos clave",
  },
  {
    key: "capacityWeight",
    label: "capacityWeight",
    hint: "Prioriza agencias con más sesiones y módulos activos",
  },
  {
    key: "recencyWeight",
    label: "recencyWeight",
    hint: "Prioriza agencias que entraron hace poco",
  },
];

export function PesosConfig() {
  const { state, setScoringWeights } = useCatalogs();
  const [draft, setDraft] = useState<ScoringWeights>(state.scoringWeights);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(state.scoringWeights);
  }, [state.scoringWeights]);

  const sum =
    draft.volumeWeight +
    draft.gapWeight +
    draft.capacityWeight +
    draft.recencyWeight;

  const save = () => {
    const next: ScoringWeights = {
      volumeWeight: clampWeight(draft.volumeWeight),
      gapWeight: clampWeight(draft.gapWeight),
      capacityWeight: clampWeight(draft.capacityWeight),
      recencyWeight: clampWeight(draft.recencyWeight),
      updatedAt: new Date().toISOString(),
      updatedBy: "local",
    };
    setScoringWeights(next);
    setDraft(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <p className="text-sm text-[var(--muted)]">
        Tabla de una fila · 0 ≤ peso ≤ 1 · máx. 3 decimales · simulado local
      </p>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="space-y-4 p-4 md:p-5">
          {FIELDS.map((f) => (
            <FormField key={f.key} label={f.label}>
              <input
                className={catalogFieldClass}
                type="number"
                min={0}
                max={1}
                step={0.001}
                value={draft[f.key]}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    [f.key]: Number(e.target.value),
                  })
                }
              />
              <p className="mt-1 text-[11px] text-[var(--muted)]">{f.hint}</p>
            </FormField>
          ))}

          <div className="flex items-center justify-between rounded-xl bg-[var(--bg)] px-3 py-2 text-xs">
            <span className="text-[var(--muted)]">Suma de pesos</span>
            <span
              className={
                Math.abs(sum - 1) < 0.001
                  ? "font-semibold text-emerald-600"
                  : "font-semibold text-[var(--accent)]"
              }
            >
              {sum.toFixed(3)}
              {Math.abs(sum - 1) >= 0.001 ? " · ideal = 1.000" : " · OK"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3">
          <p className="text-[11px] text-[var(--muted)]">
            Actualizado {new Date(draft.updatedAt).toLocaleString("es-MX")}
          </p>
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white"
          >
            {saved ? "Guardado" : "Guardar pesos"}
          </button>
        </div>
      </div>
    </div>
  );
}
