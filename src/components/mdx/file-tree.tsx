import type { ReactNode } from "react";

export function FileTree({
  content,
  children,
}: {
  content?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mdx-file-tree" role="tree" aria-label="File tree">
      <pre className="mdx-file-tree-pre">
        {content ? content.trim() : children}
      </pre>
    </div>
  );
}
