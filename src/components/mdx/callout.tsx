import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "success";

const icons: Record<CalloutType, string> = {
  info: "i",
  warning: "!",
  danger: "x",
  success: "✓",
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`mdx-callout mdx-callout--${type}`} role="note">
      <span className="mdx-callout-icon" aria-hidden="true">{icons[type]}</span>
      <div className="mdx-callout-body">
        {title ? <strong className="mdx-callout-title">{title}</strong> : null}
        {children}
      </div>
    </aside>
  );
}
