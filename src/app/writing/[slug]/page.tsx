import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewCount } from "@/components/view-count";
import { getPost, posts } from "@/lib/content";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: "Post" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// writing"}
          </p>
          <h1 data-reveal>{post.title}</h1>
          <p className="subpage-copy" data-reveal>
            {post.date.toLowerCase()} | {post.minutes} min read |{" "}
            <ViewCount slug={post.slug} fallback={post.views} increment /> views
          </p>
        </div>
      </section>

      <section className="section-wrap">
        <article className="site-shell post-story" data-reveal>
          {post.sections.map((section) => (
            <section key={section.heading} className="post-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.code ? <pre>{section.code}</pre> : null}
            </section>
          ))}

          <div className="post-bottom-links">
            <Link href="/writing">back to writing</Link>
            <Link href="/#lets-talk">let&apos;s talk</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
