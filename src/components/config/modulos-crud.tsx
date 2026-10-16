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
import { newModule, type ModuleCatalogItem } from "@/lib/catalogs";

const CATEGORIES = [
  "inicio",
  "comercial",
  "inventario",
  "reportes",
  "administracion",
  "general",
];

export function ModulosCrud() {
  const { state, upsertModulo, removeModulo } = useCatalogs();
  const rows = state.modulos;
  const [draft, setDraft] = useState<ModuleCatalogItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleting = rows.find((r) => r.id === deleteId) ?? null;

  const save = () => {
    if (!draft || !draft.name.trim() || !draft.key.trim()) return;
    upsertModulo({
      ...draft,
      name: draft.name.trim(),
      key: draft.key.trim().toLowerCase().replace(/\s+/g, "_"),
      description: draft.description.trim(),
    });
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <CatalogPageHeader
        title="Módulos"
        hint="Catálogo del panel Motor Seller"
        count={rows.length}
        onAdd={() => setDraft(newModule())}
        addLabel="Nuevo módulo"
      />

      <CatalogTable
        columns={["Módulo", "Key", "Categoría", "Prioridad", "Estado"]}
        empty={rows.length === 0}
      >
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-[var(--border)] last:border-0"
          >
            <td className="px-4 py-3">
              <p className="font-semibold text-[var(--ink)]">{row.name}</p>
              <p className="text-xs text-[var(--muted)] line-clamp-1">
                {row.description}
              </p>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
              {row.key}
            </td>
            <td className="px-4 py-3 capitalize text-[var(--muted)]">
              {row.category}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {row.priority ? "Sí" : "No"}
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
            <FormField label="Nombre">
              <input
                className={catalogFieldClass}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </FormField>
            <FormField label="Key (slug)">
              <input
                className={catalogFieldClass}
                value={draft.key}
                onChange={(e) => setDraft({ ...draft, key: e.target.value })}
                placeholder="perfilador"
              />
            </FormField>
            <FormField label="Descripción">
              <textarea
                className={catalogFieldClass}
                rows={3}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </FormField>
            <FormField label="Categoría">
              <select
                className={catalogFieldClass}
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Prioritario (demos / growth)">
              <select
                className={catalogFieldClass}
                value={draft.priority ? "1" : "0"}
                onChange={(e) =>
                  setDraft({ ...draft, priority: e.target.value === "1" })
                }
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </FormField>
            <FormField label="Estado">
              <select
                className={catalogFieldClass}
                value={draft.active ? "1" : "0"}
                onChange={(e) =>
                  setDraft({ ...draft, active: e.target.value === "1" })
                }
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
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
