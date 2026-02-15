import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/content";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Proof" };
  }

  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProofStoryPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// proof story"}
          </p>
          <h1 data-reveal>{project.name}</h1>
          <p className="subpage-copy" data-reveal>
            {project.summary}
          </p>
          <div className="proof-metrics" data-reveal>
            <span>{project.stars} stars</span>
            <span>
              {project.metricValue} {project.metricLabel.toLowerCase()}
            </span>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <article className="site-shell post-story" data-reveal>
          <section className="post-section">
            <h2>What problem I saw</h2>
            <p>{project.story.problem}</p>
          </section>
          <section className="post-section">
            <h2>How I thought about solving it</h2>
            <p>{project.story.approach}</p>
          </section>
          <section className="post-section">
            <h2>What broke</h2>
            <p>{project.story.broke}</p>
          </section>
          <section className="post-section">
            <h2>What worked</h2>
            <p>{project.story.worked}</p>
          </section>
          <section className="post-section">
            <h2>What I would do differently</h2>
            <p>{project.story.next}</p>
          </section>

          <div className="post-bottom-links">
            <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
              source
            </Link>
            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              demo
            </Link>
            <Link href="/proof">back to proof</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
