import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/animation/text-reveal";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { ParallaxLayer } from "@/components/animation/parallax-layer";
import { ScrollProgress } from "@/components/animation/scroll-progress";
import { CustomCursor } from "@/components/animation/custom-cursor";
import { MagneticElement } from "@/components/animation/magnetic-element";
import { HeroSceneLoader } from "@/components/hero/hero-scene-loader";
import { ViewCount } from "@/components/view-count";
import { liveBuild, projects, shippedRail } from "@/lib/content";
import { getAllPostMeta } from "@/lib/mdx";

export default function Home() {
  const posts = getAllPostMeta();
  return (
    <main>
      <ScrollProgress />
      <CustomCursor />

      {/* ── Hero ── */}
      <section className="hero" id="top">
        <HeroSceneLoader />
        <div className="site-shell hero-inner">
          <TextReveal variant="fade" delay={0.2} className="hero-kicker">
            why ujjwal
          </TextReveal>
          <TextReveal variant="chars" delay={0.4} className="hero-title-static">
            I build. I break. I write.
          </TextReveal>
          <TextReveal variant="words" delay={1.2} className="hero-subcopy">
            I build what works, break what does not, and write about the tradeoffs in public.
          </TextReveal>
          <ScrollReveal direction="up" delay={1.6}>
            <div className="hero-cta">
              <MagneticElement>
                <Link href="/#proof" className="hero-primary-cta" data-cursor="explore">
                  view work
                </Link>
              </MagneticElement>
              <MagneticElement>
                <Link href="/writing" className="hero-secondary-cta" data-cursor="read">
                  read writing
                </Link>
              </MagneticElement>
            </div>
          </ScrollReveal>
        </div>
        <div className="scroll-indicator" aria-hidden="true">
          <span>Explore</span>
          <span className="scroll-track">
            <span className="scroll-dot" />
          </span>
        </div>
      </section>

      {/* ── Currently Building ── */}
      <section id="building" className="section-wrap">
        <div className="site-shell">
          <TextReveal variant="words" className="section-label">
            {"// what I'm building right now"}
          </TextReveal>
          <ScrollReveal direction="up">
            <div className="build-shell">
              <article className="live-card">
                <div className="live-badge">currently_building</div>
                <div className="live-head">
                  <h2>{liveBuild.name}</h2>
                  <span className="live-state">{liveBuild.status}</span>
                </div>
                <p className="live-summary">{liveBuild.summary}</p>

                <div className="live-progress" aria-hidden="true">
                  <span style={{ width: `${liveBuild.progress}%` }} />
                </div>

                <div className="live-grid">
                  <div>
                    <label>week</label>
                    <strong>{liveBuild.weekNumber}</strong>
                  </div>
                  <div>
                    <label>commits</label>
                    <strong>{liveBuild.commits}</strong>
                  </div>
                  <div>
                    <label>stars</label>
                    <strong>{liveBuild.stars}</strong>
                  </div>
                </div>

                <p className="live-stats">{liveBuild.week}</p>
                <div className="live-links">
                  <Link href={liveBuild.githubUrl} target="_blank" rel="noopener noreferrer">
                    follow the build on GitHub
                  </Link>
                  <Link href={liveBuild.logUrl}>read the build log</Link>
                </div>
              </article>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <div className="ship-rail">
              {shippedRail.map((item) => (
                <Link key={item.slug} href={`/proof/${item.slug}`} className="ship-pill">
                  <span>{item.name}</span>
                  <small>{item.tags.join(" | ")}</small>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Writing ── */}
      <section id="writing" className="section-wrap">
        <div className="site-shell">
          <TextReveal variant="words" className="section-label">
            {"// thinking_out_loud"}
          </TextReveal>
          <TextReveal variant="words" className="section-title">
            /thoughts
          </TextReveal>
          <ScrollReveal direction="up" className="writing-list" staggerChildren={0.08}>
            {posts.map((post) => (
              <article key={post.slug} className="writing-card">
                <Link href={`/writing/${post.slug}`} className="writing-title">
                  {post.title}
                </Link>
                <p className="writing-excerpt">{post.excerpt}</p>
                <div className="writing-meta">
                  <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toLowerCase()}</span>
                  <span>
                    <ViewCount slug={post.slug} fallback="0" /> views
                  </span>
                  <span>
                    {post.readingTime} min read
                  </span>
                </div>
              </article>
            ))}
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="writing-archive">
            <MagneticElement>
              <Link href="/writing">view archive</Link>
            </MagneticElement>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Proof ── */}
      <section id="proof" className="section-wrap">
        <div className="site-shell">
          <TextReveal variant="words" className="section-label">
            {"// what I've built"}
          </TextReveal>
          <TextReveal variant="words" className="section-title">
            things that work
          </TextReveal>
          <ScrollReveal direction="up" className="proof-grid" staggerChildren={0.1}>
            {projects.map((project) => (
              <article key={project.slug} className="proof-card">
                <div className="proof-preview" aria-hidden="true" />
                <Link href={`/proof/${project.slug}`} className="proof-name">
                  {project.name}
                </Link>
                <p className="proof-summary">{project.explainLikeFriend}</p>
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── About Preview ── */}
      <section id="about" className="section-wrap">
        <div className="site-shell about-wrap about-showcase">
          <div className="about-visual-shell">
            <ParallaxLayer speed={-0.15}>
              <div className="about-visual about-visual--cosmic">
                <Image
                  src="/ujjwal.PNG"
                  alt="Ujjwal Raj portrait"
                  width={560}
                  height={800}
                  className="about-portrait"
                />
              </div>
            </ParallaxLayer>
          </div>

          <div className="about-copy">
            <TextReveal variant="words" className="section-label">
              {"// who I am"}
            </TextReveal>
            <TextReveal variant="words" className="section-title">
              Builder behind the systems.
            </TextReveal>
            <TextReveal variant="lines">
              ECE at BITS Pilani. Backend engineer turned AI obsessive.
              I build AI systems that survive real users, real traffic, and real edge cases.
              RAG, agents, LLM infrastructure — the unglamorous work that makes AI useful in
              production.
              I write what I learn, open-source what I build, and keep improving the craft.
            </TextReveal>
            <ScrollReveal direction="up">
              <pre className="stack-block">
                {`~/stack
|-- languages:  Python, TypeScript, Go
|-- ai:         LangChain, LangGraph, PyTorch, HuggingFace
|-- infra:      Docker, AWS, PostgreSQL, Redis
|-- models:     Claude, GPT-4, Llama, Mistral
\\-- currently learning: advanced RAG evaluation, GRPO`}
              </pre>
            </ScrollReveal>
            <ScrollReveal direction="up" className="about-actions">
              <MagneticElement>
                <Link href="/about" className="about-page-link">
                  read full about me
                </Link>
              </MagneticElement>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="lets-talk" className="section-wrap">
        <div className="site-shell">
          <ScrollReveal direction="up">
            <div className="talk-terminal">
              <p className="talk-prompt">root@whyujjwal:~/contact$ cat intent.js</p>
              <TextReveal variant="chars" className="talk-heading">
                {"// Let's talk"}
              </TextReveal>

              <div className="talk-code">
                <pre>
                  {`const client_fit = {
  startups: true,
  scale_ups: true,
  hard_problems: true
};`}
                </pre>
              </div>

              <p className="talk-select"># Select connection method:</p>

              <ScrollReveal direction="up" className="talk-options" staggerChildren={0.1}>
                <MagneticElement>
                  <Link
                    href="https://cal.com/ujjwal-tiwari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talk-option"
                  >
                    <span className="talk-index">[0]</span>
                    <span className="talk-main">Book a Call</span>
                    <span className="talk-meta">(cal.com)</span>
                  </Link>
                </MagneticElement>

                <MagneticElement>
                  <Link href="mailto:tiwari.rajujjwal@gmail.com" className="talk-option">
                    <span className="talk-index">[1]</span>
                    <span className="talk-main">Send Email</span>
                    <span className="talk-meta">tiwari.rajujjwal@gmail.com</span>
                  </Link>
                </MagneticElement>

                <MagneticElement>
                  <Link
                    href="https://x.com/whyujjwal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talk-option"
                  >
                    <span className="talk-index">[2]</span>
                    <span className="talk-main">Twitter DM</span>
                    <span className="talk-meta">@whyujjwal</span>
                  </Link>
                </MagneticElement>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Floating Dock ── */}
      <nav className="floating-dock" aria-label="Quick navigation">
        <Link href="/#top" className="dock-link is-home" aria-label="Home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-5h-4v5H5a1 1 0 0 1-1-1v-8.5Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <Link href="/#proof" className="dock-link" aria-label="Proof">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m8 7-4 5 4 5m8-10 4 5-4 5M13 5l-2 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link href="/#writing" className="dock-link" aria-label="Writing">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h10M4 12h8m-8 5h6m8-10-4 4m0 0h4m-4 0V7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <Link href="/#lets-talk" className="dock-link" aria-label="Contact">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 7h16v10H4zM4 8l8 6 8-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </nav>
    </main>
  );
}
