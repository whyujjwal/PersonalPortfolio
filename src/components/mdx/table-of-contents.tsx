"use client";

import { useEffect, useLayoutEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useLayoutEffect(() => {
    const article = document.querySelector(".mdx-article");
    if (!article) return;

    const els = article.querySelectorAll("h2, h3");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      Array.from(els).map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      }))
    );
  }, []);

  useEffect(() => {
    const article = document.querySelector(".mdx-article");
    if (!article) return;

    const els = article.querySelectorAll("h2, h3");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="mdx-toc" aria-label="Table of contents">
      <span className="mdx-toc-label">On this page</span>
      <ul className="mdx-toc-list">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "mdx-toc-indent" : ""}>
            <a
              href={`#${h.id}`}
              className={`mdx-toc-link${activeId === h.id ? " is-active" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
