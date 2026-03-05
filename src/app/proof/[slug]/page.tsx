import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { MagneticElement } from "@/components/animation/magnetic-element";
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
          <TextReveal variant="fade">
            <p className="section-label">{"// proof story"}</p>
          </TextReveal>
          <TextReveal variant="chars" stagger={0.015}>
            <h1>{project.name}</h1>
          </TextReveal>
          <TextReveal variant="words" delay={0.2}>
            <p className="subpage-copy">{project.summary}</p>
          </TextReveal>
          <ScrollReveal delay={0.3}>
            <div className="proof-metrics">
              <span>{project.stars} stars</span>
              <span>
                {project.metricValue} {project.metricLabel.toLowerCase()}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-wrap">
        <article className="site-shell post-story">
          {[
            { heading: "What problem I saw", body: project.story.problem },
            { heading: "How I thought about solving it", body: project.story.approach },
            { heading: "What broke", body: project.story.broke },
            { heading: "What worked", body: project.story.worked },
            { heading: "What I would do differently", body: project.story.next },
          ].map((section, i) => (
            <ScrollReveal key={section.heading} delay={i * 0.05}>
              <section className="post-section">
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            </ScrollReveal>
          ))}

          <ScrollReveal>
            <div className="post-bottom-links">
              <MagneticElement>
                <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  source
                </Link>
              </MagneticElement>
              <MagneticElement>
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  demo
                </Link>
              </MagneticElement>
              <MagneticElement>
                <Link href="/proof">back to proof</Link>
              </MagneticElement>
            </div>
          </ScrollReveal>
        </article>
      </section>
    </main>
  );
}
