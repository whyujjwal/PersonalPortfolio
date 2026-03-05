import Link from "next/link";

export function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  const isExternal = href.startsWith("http");
  const Comp = isExternal ? "a" : Link;
  const extra = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Comp href={href} className="mdx-link-card" {...extra}>
      <span className="mdx-link-card-title">{title}</span>
      {description && <span className="mdx-link-card-desc">{description}</span>}
      {isExternal && <span className="mdx-link-card-ext" aria-hidden="true">ext</span>}
    </Comp>
  );
}
