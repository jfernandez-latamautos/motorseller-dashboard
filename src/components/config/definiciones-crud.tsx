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
  newDefinition,
  type DefinitionCatalogItem,
} from "@/lib/catalogs";

export function DefinicionesCrud() {
  const { state, upsertDefinicion, removeDefinicion } = useCatalogs();
  const rows = state.definiciones;
  const [draft, setDraft] = useState<DefinitionCatalogItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleting = rows.find((r) => r.id === deleteId) ?? null;

  const save = () => {
    if (!draft || !draft.term.trim() || !draft.text.trim()) return;
    upsertDefinicion({
      ...draft,
      term: draft.term.trim(),
      text: draft.text.trim(),
    });
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <CatalogPageHeader
        title="Definiciones"
        hint="Glosario del dashboard"
        count={rows.length}
        onAdd={() => setDraft(newDefinition())}
        addLabel="Nueva definición"
      />

      <CatalogTable
        columns={["Término", "Definición", "Estado"]}
        empty={rows.length === 0}
      >
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-[var(--border)] last:border-0"
          >
            <td className="px-4 py-3 font-semibold text-[var(--ink)]">
              {row.term}
            </td>
            <td className="max-w-md px-4 py-3 text-[var(--muted)]">
              {row.text}
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
            ? "Editar definición"
            : "Nueva definición"
        }
        onClose={() => setDraft(null)}
        onSave={save}
      >
        {draft ? (
          <>
            <FormField label="Término">
              <input
                className={catalogFieldClass}
                value={draft.term}
                onChange={(e) => setDraft({ ...draft, term: e.target.value })}
              />
            </FormField>
            <FormField label="Definición">
              <textarea
                className={catalogFieldClass}
                rows={4}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              />
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
        name={deleting?.term ?? ""}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeDefinicion(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
