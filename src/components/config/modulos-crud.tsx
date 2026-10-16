"use client";

import { useState } from "react";
import { useCatalogs } from "@/components/config/catalog-context";
import {
  CatalogFormModal,
  CatalogPageHeader,
  CatalogTable,
  ConfirmDelete,
  FormField,
  RowActions,
  StatusPill,
  catalogFieldClass,
} from "@/components/config/catalog-ui";
import {
  newModule,
  type ModuleCatalogItem,
  type ModuleCatalogType,
} from "@/lib/catalogs";

const GROUPS = [
  "Inicio",
  "Comercial",
  "Inventario",
  "Reportes",
  "Administración",
  "General",
];

const TYPES: { value: ModuleCatalogType; label: string }[] = [
  { value: "key", label: "key · gap / demos" },
  { value: "operational", label: "operational · se mide, sin demo" },
  { value: "administrative", label: "administrative · uso ~100%" },
];

export function ModulosCrud() {
  const { state, upsertModulo, removeModulo } = useCatalogs();
  const rows = state.modulos;
  const [draft, setDraft] = useState<ModuleCatalogItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleting = rows.find((r) => r.id === deleteId) ?? null;

  const save = () => {
    if (!draft || !draft.name.trim() || !draft.key.trim()) return;
    if (draft.lowUsageMax30d < 0 || draft.topUsageMin30d < 0) return;
    if (draft.topUsageMin30d <= draft.lowUsageMax30d) return;
    upsertModulo({
      ...draft,
      name: draft.name.trim(),
      key: draft.key.trim().toLowerCase().replace(/\s+/g, "_"),
      moduleGroup: draft.moduleGroup.trim(),
      updatedAt: new Date().toISOString(),
    });
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <CatalogPageHeader
        title="Módulos"
        hint="Incluye lowUsageMax30d y topUsageMin30d"
        count={rows.length}
        onAdd={() =>
          setDraft(
            newModule({
              moduleId:
                Math.max(0, ...rows.map((r) => r.moduleId)) + 1,
            })
          )
        }
        addLabel="Nuevo módulo"
      />

      <CatalogTable
        columns={[
          "Módulo",
          "ID",
          "Grupo",
          "Tipo",
          "Bajo ≤",
          "Top ≥",
          "Adopción",
          "Estado",
        ]}
        empty={rows.length === 0}
      >
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-[var(--border)] last:border-0"
          >
            <td className="px-4 py-3">
              <p className="font-semibold text-[var(--ink)]">{row.name}</p>
              <p className="font-mono text-[10px] text-[var(--muted)]">
                {row.key}
              </p>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
              {row.moduleId}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">{row.moduleGroup}</td>
            <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
              {row.type}
            </td>
            <td className="px-4 py-3 tabular-nums text-[var(--ink)]">
              {row.lowUsageMax30d}
            </td>
            <td className="px-4 py-3 tabular-nums text-[var(--ink)]">
              {row.topUsageMin30d}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {row.includeInAdoption ? "Sí" : "No"}
            </td>
            <td className="px-4 py-3">
              <StatusPill active={row.active} />
            </td>
            <td className="px-4 py-3">
              <RowActions
                onEdit={() => setDraft({ ...row })}
                onDelete={() => setDeleteId(row.id)}
              />
            </td>
          </tr>
        ))}
      </CatalogTable>

      <CatalogFormModal
        open={Boolean(draft)}
        title={
          draft && rows.some((r) => r.id === draft.id)
            ? "Editar módulo"
            : "Nuevo módulo"
        }
        onClose={() => setDraft(null)}
        onSave={save}
      >
        {draft ? (
          <>
            <FormField label="moduleId">
              <input
                className={catalogFieldClass}
                type="number"
                min={1}
                value={draft.moduleId}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    moduleId: Number(e.target.value) || 1,
                  })
                }
              />
            </FormField>
            <FormField label="Nombre">
              <input
                className={catalogFieldClass}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </FormField>
            <FormField label="Key (slug interno)">
              <input
                className={catalogFieldClass}
                value={draft.key}
                onChange={(e) => setDraft({ ...draft, key: e.target.value })}
                placeholder="prospectos"
              />
            </FormField>
            <FormField label="moduleGroup">
              <select
                className={catalogFieldClass}
                value={draft.moduleGroup}
                onChange={(e) =>
                  setDraft({ ...draft, moduleGroup: e.target.value })
                }
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="type">
              <select
                className={catalogFieldClass}
                value={draft.type}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    type: e.target.value as ModuleCatalogType,
                  })
                }
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="lowUsageMax30d">
                <input
                  className={catalogFieldClass}
                  type="number"
                  min={0}
                  value={draft.lowUsageMax30d}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      lowUsageMax30d: Number(e.target.value) || 0,
                    })
                  }
                />
              </FormField>
              <FormField label="topUsageMin30d">
                <input
                  className={catalogFieldClass}
                  type="number"
                  min={0}
                  value={draft.topUsageMin30d}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      topUsageMin30d: Number(e.target.value) || 0,
                    })
                  }
                />
              </FormField>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Bajo uso: acciones ≤ lowUsageMax30d · Top: ≥ topUsageMin30d
              (base 30 días). top debe ser mayor que low.
            </p>
            <FormField label="includeInAdoption">
              <select
                className={catalogFieldClass}
                value={draft.includeInAdoption ? "1" : "0"}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    includeInAdoption: e.target.value === "1",
                  })
                }
              >
                <option value="1">true</option>
                <option value="0">false</option>
              </select>
            </FormField>
            <FormField label="active">
              <select
                className={catalogFieldClass}
                value={draft.active ? "1" : "0"}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.value === "1" })
                }
              >
                <option value="1">true</option>
                <option value="0">false (desactiva sin borrar historial)</option>
              </select>
            </FormField>
          </>
        ) : null}
      </CatalogFormModal>

      <ConfirmDelete
        open={Boolean(deleting)}
        name={deleting?.name ?? ""}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeModulo(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
