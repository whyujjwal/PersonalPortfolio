import type { Metadata } from "next";
import Link from "next/link";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { BlogTagFilter } from "@/components/blog-tag-filter";
import { getAllPostMeta, getAllTags } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking out loud on production AI systems.",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function WritingPage() {
  const posts = getAllPostMeta();
  const tags = getAllTags();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <TextReveal variant="fade">
            <p className="section-label">{"// writing"}</p>
          </TextReveal>
          <TextReveal variant="chars" stagger={0.02}>
            <h1>thinking out loud</h1>
          </TextReveal>
          <TextReveal variant="words" delay={0.2}>
            <p className="subpage-copy">
              Opinions, postmortems, and field notes from building production AI systems.
            </p>
          </TextReveal>
        </div>
      </section>

      {featured && (
        <section className="section-wrap">
          <div className="site-shell">
            <ScrollReveal>
              <Link href={`/writing/${featured.slug}`} className="blog-featured">
                <div className="blog-featured-cover" />
                <div className="blog-featured-body">
                  <div className="blog-featured-tags">
                    {featured.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="blog-featured-title">{featured.title}</span>
                  <span className="blog-featured-excerpt">{featured.excerpt}</span>
                  <div className="blog-featured-meta">
                    <span>{dateFmt.format(new Date(featured.date))}</span>
                    <span>{featured.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="section-wrap">
        <div className="site-shell">
          <BlogTagFilter posts={rest} tags={tags} />
        </div>
      </section>
    </main>
  );
}
