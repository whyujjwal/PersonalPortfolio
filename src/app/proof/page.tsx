import type { Metadata } from "next";
import Link from "next/link";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Proof",
  description: "Things that work. Project stories and production outcomes.",
};

export default function ProofPage() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <TextReveal variant="fade">
            <p className="section-label">{"// proof"}</p>
          </TextReveal>
          <TextReveal variant="chars" stagger={0.02}>
            <h1>things that work</h1>
          </TextReveal>
          <TextReveal variant="words" delay={0.2}>
            <p className="subpage-copy">
              Projects with outcomes, tradeoffs, and what broke along the way.
            </p>
          </TextReveal>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell proof-grid">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.1} direction="scale">
              <article className="proof-card">
                <div className="proof-preview" aria-hidden="true" />
                <Link href={`/proof/${project.slug}`} className="proof-name">
                  {project.name}
                </Link>
                <p className="proof-summary">{project.summary}</p>
                <div className="proof-tags">
                  {project.tags.map((tag) => (
                    <span key={`${project.slug}-${tag}`}>{tag}</span>
                  ))}
                </div>
                <div className="proof-metrics">
                  <span>{project.stars} stars</span>
                  <span>
                    {project.metricValue} {project.metricLabel.toLowerCase()}
                  </span>
                </div>
                <div className="proof-links">
                  <Link href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                    source
                  </Link>
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    demo
                  </Link>
                  <Link href={`/proof/${project.slug}`}>story</Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
