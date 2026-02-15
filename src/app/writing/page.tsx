import type { Metadata } from "next";
import Link from "next/link";
import { ViewCount } from "@/components/view-count";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking out loud on production AI systems.",
};

export default function WritingPage() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// writing"}
          </p>
          <h1 data-reveal>thinking out loud</h1>
          <p className="subpage-copy" data-reveal>
            Opinions, postmortems, and field notes from building production AI systems.
          </p>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell writing-list">
          {posts.map((post) => (
            <article key={post.slug} className="writing-card" data-reveal>
              <Link href={`/writing/${post.slug}`} className="writing-title">
                {post.title}
              </Link>
              <p className="writing-excerpt">{post.excerpt}</p>
              <div className="writing-meta">
                <span>{post.date.toLowerCase()}</span>
                <span>
                  <ViewCount slug={post.slug} fallback={post.views} /> views
                </span>
                <span>{post.minutes} min read</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
