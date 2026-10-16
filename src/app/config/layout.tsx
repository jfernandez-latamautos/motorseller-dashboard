"use client";

import { ConfigShell } from "@/components/config/config-shell";

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfigShell>{children}</ConfigShell>;
}
