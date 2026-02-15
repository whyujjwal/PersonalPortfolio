import Image from "next/image";
import Link from "next/link";
import { AsciiGlobe } from "@/components/ascii-globe";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-page-hero">
        <div className="site-shell about-page-grid">
          <div className="about-page-visual-stack">
            <div className="about-page-face" data-reveal>
              <Image
                src="/ujjwal-nobg.png"
                alt="Ujjwal Raj portrait"
                width={560}
                height={670}
                priority
                className="about-page-cutout"
              />
            </div>
          </div>

          <div className="about-page-copy">
            <p className="section-label" data-reveal>
              {"// about me"}
            </p>
            <h1 data-reveal>
              I build reliable
              <br />
              AI systems.
            </h1>
            <p data-reveal>
              I am Ujjwal Raj, an AI engineer focused on backend-first product systems. I care
              about grounded answers, measurable quality, and architecture that keeps working after
              launch day.
            </p>
            <p data-reveal>
              My core focus is production RAG, multi-step agents, and LLM infrastructure that is
              observable, cost-aware, and resilient under real traffic.
            </p>

            <div className="about-page-meta" data-reveal>
              <span>ECE @ BITS Pilani</span>
              <span>India</span>
              <span>Backend + AI</span>
            </div>
            <AsciiGlobe className="about-page-ascii-motif" />

            <div className="about-page-links" data-reveal>
              <Link href="/#lets-talk">book a call</Link>
              <Link href="/writing">read writing</Link>
              <Link href="/proof">view proof</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell about-page-sections">
          <article className="about-page-panel" data-reveal>
            <h2>How I work</h2>
            <p>
              I start with constraints and failure modes, then design the minimum system that can
              be tested quickly. Every build includes quality checks, monitoring, and clear
              handoff.
            </p>
          </article>

          <article className="about-page-panel" data-reveal>
            <h2>What I optimize for</h2>
            <p>
              Correctness first, speed second, polish third. I would rather ship a stable system
              that solves the right problem than a flashy demo that breaks in production.
            </p>
          </article>

          <article className="about-page-panel" data-reveal>
            <h2>Current stack</h2>
            <pre className="stack-block">
              {`~/stack
|-- languages:  Python, TypeScript, Go
|-- ai:         LangChain, LangGraph, PyTorch, HuggingFace
|-- infra:      Docker, AWS, PostgreSQL, Redis
|-- models:     Claude, GPT-4, Llama, Mistral
\\-- currently learning: advanced RAG evaluation, GRPO`}
            </pre>
          </article>
        </div>
      </section>
    </main>
  );
}
