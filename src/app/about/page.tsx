import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { ParallaxLayer } from "@/components/animation/parallax-layer";
import { MagneticElement } from "@/components/animation/magnetic-element";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-page-hero">
        <div className="site-shell about-page-grid">
          <div className="about-page-visual-stack">
            <ParallaxLayer speed={-0.15}>
              <div className="about-page-face about-page-face--cosmic">
                <Image
                  src="/ujjwal.PNG"
                  alt="Ujjwal Raj portrait"
                  width={560}
                  height={800}
                  priority
                  className="about-page-portrait"
                />
              </div>
            </ParallaxLayer>
          </div>

          <div className="about-page-copy">
            <TextReveal variant="fade">
              <p className="section-label">{"// about me"}</p>
            </TextReveal>
            <TextReveal variant="chars" stagger={0.015}>
              <h1>
                I build reliable
                <br />
                AI systems.
              </h1>
            </TextReveal>
            <TextReveal variant="lines" delay={0.2}>
              <p>
                I am Ujjwal Raj — an AI engineer focused on backend-first product systems.
                I care about grounded answers, measurable quality, and architecture that
                keeps working after launch day.
              </p>
            </TextReveal>
            <TextReveal variant="lines" delay={0.3}>
              <p>
                ECE at BITS Pilani. My core focus is production RAG, multi-step agents,
                and LLM infrastructure that is observable, cost-aware, and resilient
                under real traffic.
              </p>
            </TextReveal>

            <ScrollReveal delay={0.4}>
              <div className="about-page-meta">
                <span>BITS Pilani</span>
                <span>India</span>
                <span>Backend + AI</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5} direction="scale">
              <div className="about-page-links">
                <MagneticElement>
                  <Link href="/#lets-talk">book a call</Link>
                </MagneticElement>
                <MagneticElement>
                  <Link href="/writing">read writing</Link>
                </MagneticElement>
                <MagneticElement>
                  <Link href="/proof">view proof</Link>
                </MagneticElement>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="site-shell about-page-sections">
          <ScrollReveal delay={0}>
            <article className="about-page-panel">
              <h2>How I work</h2>
              <p>
                I start with constraints and failure modes, then design the minimum system that can
                be tested quickly. Every build includes quality checks, monitoring, and clear
                handoff.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <article className="about-page-panel">
              <h2>What I optimize for</h2>
              <p>
                Correctness first, speed second, polish third. I would rather ship a stable system
                that solves the right problem than a flashy demo that breaks in production.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <article className="about-page-panel">
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
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
