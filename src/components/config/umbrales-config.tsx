"use client";

import { useEffect, useState } from "react";
import { useCatalogs } from "@/components/config/catalog-context";
import {
  FormField,
  catalogFieldClass,
} from "@/components/config/catalog-ui";
import type { ActivityThresholds } from "@/lib/catalogs";

const FIELDS: {
  key: keyof Omit<ActivityThresholds, "updatedAt" | "updatedBy">;
  label: string;
  hint: string;
}[] = [
  {
    key: "highSessionsMin",
    label: "highSessionsMin",
    hint: "Mínimo de sesiones para nivel Alto (defecto ≥ 8)",
  },
  {
    key: "highActiveModulesMin",
    label: "highActiveModulesMin",
    hint: "Mínimo de módulos activos para nivel Alto (defecto ≥ 6)",
  },
  {
    key: "lowSessionsMax",
    label: "lowSessionsMax",
    hint: "Máximo de sesiones para nivel Bajo (defecto ≤ 2)",
  },
  {
    key: "lowDaysWithoutSession",
    label: "lowDaysWithoutSession",
    hint: "Días sin sesión para nivel Bajo (defecto 15)",
  },
];

export function UmbralesConfig() {
  const { state, setActivityThresholds } = useCatalogs();
  const [draft, setDraft] = useState<ActivityThresholds>(
    state.activityThresholds
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(state.activityThresholds);
  }, [state.activityThresholds]);

  const save = () => {
    const next: ActivityThresholds = {
      highSessionsMin: Math.max(0, Math.round(draft.highSessionsMin)),
      highActiveModulesMin: Math.max(0, Math.round(draft.highActiveModulesMin)),
      lowSessionsMax: Math.max(0, Math.round(draft.lowSessionsMax)),
      lowDaysWithoutSession: Math.max(
        0,
        Math.round(draft.lowDaysWithoutSession)
      ),
      updatedAt: new Date().toISOString(),
      updatedBy: "local",
    };
    setActivityThresholds(next);
    setDraft(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <p className="text-sm text-[var(--muted)]">
        Semáforo Alto / Medio / Bajo · tabla de una fila · Medio = todo lo que
        no cae en Alto ni Bajo
      </p>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="space-y-4 p-4 md:p-5">
          {FIELDS.map((f) => (
            <FormField key={f.key} label={f.label}>
              <input
                className={catalogFieldClass}
                type="number"
                min={0}
                step={1}
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

          <div className="rounded-xl bg-[var(--bg)] px-3 py-3 text-xs text-[var(--muted)]">
            <p>
              <span className="font-semibold text-emerald-700">Alto</span> · ≥{" "}
              {draft.highSessionsMin} sesiones y ≥ {draft.highActiveModulesMin}{" "}
              módulos activos
            </p>
            <p className="mt-1">
              <span className="font-semibold text-[var(--accent)]">Bajo</span> ·
              ≤ {draft.lowSessionsMax} sesiones, o sin sesiones en los últimos{" "}
              {draft.lowDaysWithoutSession} días
            </p>
            <p className="mt-1">
              <span className="font-semibold text-sky-700">Medio</span> · resto
            </p>
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
            {saved ? "Guardado" : "Guardar umbrales"}
          </button>
        </div>
      </div>
    </div>
  );
}
