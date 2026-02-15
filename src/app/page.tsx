import Image from "next/image";
import Link from "next/link";
import { AsciiContactRocket } from "@/components/ascii-contact-rocket";
import { HeroAsciiOrbit } from "@/components/hero-ascii-orbit";
import { ViewCount } from "@/components/view-count";
import { liveBuild, posts, projects, shippedRail } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <HeroAsciiOrbit />
        <div className="site-shell hero-inner">
          <p className="hero-kicker" data-reveal>
            why ujjwal
          </p>
          <h1 className="hero-title-static" data-reveal>
            I build.
            <br />
            I break.
            <br />
            I write.
          </h1>
          <p className="hero-subcopy" data-reveal>
            I build what works, break what does not, and write about the tradeoffs in public.
          </p>
          <div className="hero-cta" data-reveal>
            <Link href="/#proof" className="hero-primary-cta">
              view work
            </Link>
            <Link href="/writing" className="hero-secondary-cta">
              read writing
            </Link>
          </div>
        </div>
        <div className="scroll-indicator" aria-hidden="true">
          <span>Explore</span>
          <span className="scroll-track">
            <span className="scroll-dot" />
          </span>
        </div>
      </section>

      <section id="building" className="section-wrap">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// what I'm building right now"}
          </p>
          <div className="build-shell" data-reveal>
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

          <div className="ship-rail" data-reveal>
            {shippedRail.map((item) => (
              <Link key={item.slug} href={`/proof/${item.slug}`} className="ship-pill">
                <span>{item.name}</span>
                <small>{item.tags.join(" | ")}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="writing" className="section-wrap">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// thinking_out_loud"}
          </p>
          <h2 className="section-title" data-reveal>
            /thoughts
          </h2>
          <div className="writing-list">
            {posts.map((post) => (
              <article key={post.slug} className="writing-card" data-reveal>
                <Link href={`/writing/${post.slug}`} className="writing-title">
                  {post.title}
                </Link>
                <p className="writing-excerpt">{post.excerpt}</p>
                <div className="writing-meta">
                  <span>{post.date.toLowerCase()}</span>
                  <span>
                    <ViewCount slug={post.slug} fallback={post.views} /> views
                  </span>
                  <span>
                    {post.minutes} min read
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="writing-archive" data-reveal>
            <Link href="/writing">view archive</Link>
          </div>
        </div>
      </section>

      <section id="proof" className="section-wrap">
        <div className="site-shell">
          <p className="section-label" data-reveal>
            {"// what I've built"}
          </p>
          <h2 className="section-title" data-reveal>
            things that work
          </h2>
          <div className="proof-grid">
            {projects.map((project) => (
              <article key={project.slug} className="proof-card" data-reveal>
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
          </div>
        </div>
      </section>

      <section id="about" className="section-wrap">
        <div className="site-shell about-wrap about-showcase">
          <div className="about-visual-shell">
            <div className="about-visual" data-reveal>
              <Image
                src="/ujjwal-nobg.png"
                alt="Ujjwal Raj portrait"
                width={560}
                height={560}
                className="about-cutout"
              />
            </div>
          </div>

          <div className="about-copy">
            <p className="section-label" data-reveal>
              {"// who I am"}
            </p>
            <h2 className="section-title" data-reveal>
              Builder behind the systems.
            </h2>
            <p data-reveal>
              21. ECE at BITS Pilani. Backend engineer turned AI obsessive.
              <br />
              <br />
              I build AI systems that survive real users, real traffic, and real edge cases.
              RAG, agents, LLM infrastructure. The unglamorous work that makes AI useful in
              production.
              <br />
              <br />
              I write what I learn, open-source what I build, and keep improving the craft.
            </p>
            <pre className="stack-block" data-reveal>
              {`~/stack
|-- languages:  Python, TypeScript, Go
|-- ai:         LangChain, LangGraph, PyTorch, HuggingFace
|-- infra:      Docker, AWS, PostgreSQL, Redis
|-- models:     Claude, GPT-4, Llama, Mistral
\-- currently learning: advanced RAG evaluation, GRPO`}
            </pre>
            <div className="about-actions" data-reveal>
              <Link href="/about" className="about-page-link">
                read full about me
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="lets-talk" className="section-wrap">
        <div className="site-shell">
          <div className="talk-terminal" data-reveal>
            <p className="talk-prompt">root@whyujjwal:~/contact$ cat intent.js</p>
            <h2 className="talk-heading">{"// Let's talk"}</h2>
            <AsciiContactRocket className="talk-rocket" />

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

            <div className="talk-options">
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

              <Link href="mailto:tiwari.rajujjwal@gmail.com" className="talk-option">
                <span className="talk-index">[1]</span>
                <span className="talk-main">Send Email</span>
                <span className="talk-meta">tiwari.rajujjwal@gmail.com</span>
              </Link>

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
            </div>
          </div>
        </div>
      </section>

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
