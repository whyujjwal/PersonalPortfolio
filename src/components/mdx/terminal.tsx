import type { ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const el = node as { props: { children?: ReactNode } };
    return extractText(el.props.children);
  }
  return "";
}

export function Terminal({
  title = "terminal",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const text = extractText(children);
  const lines = text.trim().split("\n");
  return (
    <div className="mdx-terminal">
      <div className="mdx-terminal-header">
        <span className="mdx-terminal-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="mdx-terminal-title">{title}</span>
      </div>
      <pre className="mdx-terminal-body">{lines.map((line, i) => {
        const isCommand = line.startsWith("$");
        return (
          <span key={i} className={isCommand ? "mdx-terminal-cmd" : "mdx-terminal-out"}>
            {line}{"\n"}
          </span>
        );
      })}</pre>
    </div>
  );
}
