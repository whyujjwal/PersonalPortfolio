import type { ReactNode } from "react";

export function Comparison({ children }: { children: ReactNode }) {
  return <div className="mdx-comparison">{children}</div>;
}

export function ComparisonSide({
  label,
  type = "neutral",
  children,
}: {
  label: string;
  type?: "good" | "bad" | "neutral";
  children: ReactNode;
}) {
  return (
    <div className={`mdx-comparison-side mdx-comparison-side--${type}`}>
      <span className="mdx-comparison-label">{label}</span>
      <div className="mdx-comparison-body">{children}</div>
    </div>
  );
}
