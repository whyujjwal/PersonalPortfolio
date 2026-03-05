import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewCount } from "@/components/view-count";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { ScrollProgress } from "@/components/animation/scroll-progress";
import { TableOfContents } from "@/components/mdx/table-of-contents";
import {
  getAllPostMeta,
  getCompiledPost,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/mdx";

type Props = { params: Promise<{ slug: string }> };

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function generateStaticParams() {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const all = getAllPostMeta();
  const meta = all.find((p) => p.slug === slug);
  if (!meta) return { title: "Post" };
  return { title: meta.title, description: meta.excerpt };
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params;
  const compiled = await getCompiledPost(slug).catch(() => null);

  if (!compiled) notFound();

  const { content, meta } = compiled;
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug, 3);

  return (
    <main className="subpage-main">
      <ScrollProgress />

      <section className="subpage-hero">
        <div className="site-shell">
          <TextReveal variant="fade">
            <p className="section-label">{"// writing"}</p>
          </TextReveal>

          <div className="blog-post-header">
            <div className="blog-post-tags">
              {meta.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">{tag}</span>
              ))}
            </div>

            <TextReveal variant="chars" stagger={0.015}>
              <h1 className="blog-post-title">{meta.title}</h1>
            </TextReveal>

            <TextReveal variant="words" delay={0.3}>
              <div className="blog-post-meta">
                <span>{dateFmt.format(new Date(meta.date))}</span>
                <span>{meta.readingTime} min read</span>
                <span><ViewCount slug={meta.slug} fallback="0" increment /> views</span>
              </div>
            </TextReveal>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell">
          <div className="blog-post-layout">
            <article className="mdx-article">
              {content}

              {(prev ?? next) && (
                <nav className="blog-post-nav" aria-label="Post navigation">
                  {prev ? (
                    <Link href={`/writing/${prev.slug}`}>
                      <span className="blog-nav-label">previous</span>
                      <span className="blog-nav-title">{prev.title}</span>
                    </Link>
                  ) : <span />}
                  {next ? (
                    <Link href={`/writing/${next.slug}`}>
                      <span className="blog-nav-label">next</span>
                      <span className="blog-nav-title">{next.title}</span>
                    </Link>
                  ) : <span />}
                </nav>
              )}

              {related.length > 0 && (
                <ScrollReveal>
                  <aside className="blog-related">
                    <p className="blog-related-label">Related posts</p>
                    <div className="blog-related-grid">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/writing/${r.slug}`} className="blog-related-card">
                          <span className="blog-related-card-title">{r.title}</span>
                          <span className="blog-related-card-date">
                            {dateFmt.format(new Date(r.date))}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </aside>
                </ScrollReveal>
              )}
            </article>

            <aside className="blog-post-sidebar">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
