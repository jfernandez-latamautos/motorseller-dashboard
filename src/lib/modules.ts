import { MODULES } from "@/lib/mock-data";
import type { ModuleKey } from "@/lib/types";

const MODULE_KEYS = new Set<string>(MODULES.map((m) => m.key));

export function isModuleKey(
  value: string | null | undefined
): value is ModuleKey {
  return Boolean(value && MODULE_KEYS.has(value));
}
