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

export function FileTree({ children }: { children: ReactNode }) {
  const text = extractText(children);
  const lines = text.trim().split("\n");
  return (
    <div className="mdx-file-tree" role="tree" aria-label="File tree">
      <pre className="mdx-file-tree-pre">{lines.map((line, i) => {
        const trimmed = line.replace(/^[\s│├└──]+/, "");
        const isDir = trimmed.endsWith("/");
        return (
          <span key={i} className={`mdx-file-tree-line${isDir ? " is-dir" : ""}`}>
            {line}{"\n"}
          </span>
        );
      })}</pre>
    </div>
  );
}
