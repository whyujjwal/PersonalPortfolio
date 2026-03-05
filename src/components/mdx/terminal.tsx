import type { ReactNode } from "react";

export function Terminal({
  title = "terminal",
  content,
  children,
}: {
  title?: string;
  content?: string;
  children?: ReactNode;
}) {
  // Support both content prop (preferred) and children
  const text = content ?? "";
  const lines = text ? text.trim().split("\n") : [];

  return (
    <div className="mdx-terminal">
      <div className="mdx-terminal-header">
        <span className="mdx-terminal-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="mdx-terminal-title">{title}</span>
      </div>
      <pre className="mdx-terminal-body">
        {lines.length > 0
          ? lines.map((line, i) => {
              const isCommand = line.startsWith("$");
              return (
                <span key={i} className={isCommand ? "mdx-terminal-cmd" : "mdx-terminal-out"}>
                  {line}{"\n"}
                </span>
              );
            })
          : children}
      </pre>
    </div>
  );
}
