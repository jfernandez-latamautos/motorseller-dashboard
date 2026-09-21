"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/** Solo formatea en cliente para no romper hidratación */
export function RelativeTime({
  date,
  fallback = "—",
}: {
  date: string | null | undefined;
  fallback?: string;
}) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    if (!date) {
      setLabel(fallback);
      return;
    }
    setLabel(
      formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es,
      })
    );
  }, [date, fallback]);

  return <span>{label}</span>;
}
