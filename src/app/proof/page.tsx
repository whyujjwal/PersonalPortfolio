import type { Metadata } from "next";
import Link from "next/link";
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
          <p className="section-label" data-reveal>
            {"// proof"}
          </p>
          <h1 data-reveal>things that work</h1>
          <p className="subpage-copy" data-reveal>
            Projects with outcomes, tradeoffs, and what broke along the way.
          </p>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell proof-grid">
          {projects.map((project) => (
            <article key={project.slug} className="proof-card" data-reveal>
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
          ))}
        </div>
      </section>
    </main>
  );
}
