import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return <div className="mdx-steps">{children}</div>;
}

export function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mdx-step">
      <span className="mdx-step-number" aria-hidden="true">{number}</span>
      <div className="mdx-step-body">
        <strong className="mdx-step-title">{title}</strong>
        <div className="mdx-step-content">{children}</div>
      </div>
    </div>
  );
}
