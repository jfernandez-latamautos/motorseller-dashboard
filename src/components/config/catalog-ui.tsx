"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]";

export function CatalogPageHeader({
  title,
  hint,
  count,
  onAdd,
  addLabel = "Agregar",
}: {
  title: string;
  hint: string;
  count: number;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--muted)]">
        <span className="sr-only">{title}. </span>
        {count} registros · {hint} · simulado
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-[var(--bg)] text-[var(--muted)]"
      )}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

export function CatalogTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg)] text-[11px] font-semibold tracking-wide text-[var(--muted)] uppercase">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-semibold">
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {empty ? (
        <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
          Sin registros. Agrega el primero.
        </p>
      ) : null}
    </div>
  );
}

export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
        aria-label="Editar"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        aria-label="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CatalogFormModal({
  open,
  title,
  onClose,
  onSave,
  children,
  saveLabel = "Guardar",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
  saveLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl bg-[var(--surface)] shadow-[var(--shadow-md)] md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3 md:px-5">
          <h2 className="text-base font-bold text-[var(--ink)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[var(--bg)]"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 md:p-5">
          {children}
        </div>
        <div className="flex shrink-0 gap-2 border-t border-[var(--border)] p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-[1.4] rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export { field as catalogFieldClass };

export function ConfirmDelete({
  open,
  name,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <CatalogFormModal
      open={open}
      title="Eliminar registro"
      onClose={onClose}
      onSave={onConfirm}
      saveLabel="Eliminar"
    >
      <p className="text-sm text-[var(--muted)]">
        ¿Eliminar <span className="font-semibold text-[var(--ink)]">{name}</span>?
        Es solo una simulación local; puedes restaurar con “Restablecer
        catálogos”.
      </p>
    </CatalogFormModal>
  );
}
