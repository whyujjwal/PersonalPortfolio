"use client";

import { useEffect, useMemo, useState } from "react";

function formatCompactViews(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .toLowerCase();
}

type ViewCountProps = {
  slug: string;
  fallback: string;
  increment?: boolean;
};

export function ViewCount({ slug, fallback, increment = false }: ViewCountProps) {
  const [value, setValue] = useState(fallback);

  const safeSlug = useMemo(() => slug.trim().toLowerCase(), [slug]);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = `whyujjwal:viewed:${safeSlug}`;
    const alreadyViewed =
      typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "1";
    const shouldIncrement = increment && !alreadyViewed;
    const method = shouldIncrement ? "POST" : "GET";

    const load = async () => {
      try {
        const response = await fetch(`/api/views?slug=${encodeURIComponent(safeSlug)}`, {
          method,
          cache: "no-store",
        });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { views: number | null; enabled: boolean };
        if (cancelled || !data.enabled || typeof data.views !== "number") {
          return;
        }

        setValue(formatCompactViews(data.views));
        if (shouldIncrement) {
          sessionStorage.setItem(sessionKey, "1");
        }
      } catch {
        // No-op fallback to static values.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [safeSlug, increment]);

  return <>{value}</>;
}
