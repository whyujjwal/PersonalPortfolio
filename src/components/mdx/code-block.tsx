"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const { children, className, ...rest } = props;
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const lang =
    (rest as Record<string, unknown>)["data-language"] as string | undefined;
  const filename =
    (rest as Record<string, unknown>)["data-title"] as string | undefined;

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="mdx-code-wrapper">
      {(lang ?? filename) && (
        <div className="mdx-code-header">
          {filename && <span className="mdx-code-filename">{filename}</span>}
          {lang && <span className="mdx-code-lang">{lang}</span>}
        </div>
      )}
      <pre ref={preRef} className={className} {...rest}>
        {children}
      </pre>
      <button
        type="button"
        className="mdx-code-copy"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
