"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import type { PostMeta } from "@/lib/mdx";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function BlogTagFilter({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: string[];
}) {
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? posts
    : posts.filter((p) => p.tags.includes(active));

  return (
    <>
      <div className="blog-tag-bar">
        <button
          type="button"
          className={`blog-tag-pill${active === "all" ? " is-active" : ""}`}
          onClick={() => setActive("all")}
        >
          all
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`blog-tag-pill${active === tag ? " is-active" : ""}`}
            onClick={() => setActive(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="blog-card-grid">
        {filtered.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 0.06}>
            <Link href={`/writing/${post.slug}`} className="blog-card">
              <div className="blog-card-cover" />
              <div className="blog-card-body">
                <div className="blog-card-tags">
                  {post.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="blog-card-title">{post.title}</span>
                <span className="blog-card-excerpt">{post.excerpt}</span>
                <div className="blog-card-meta">
                  <span>{dateFmt.format(new Date(post.date))}</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
