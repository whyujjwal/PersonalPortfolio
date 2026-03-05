import Link from "next/link";
import { TextReveal } from "@/components/animation/text-reveal";
import { MagneticElement } from "@/components/animation/magnetic-element";

export default function NotFound() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell">
          <TextReveal variant="fade">
            <p className="section-label">{"// 404"}</p>
          </TextReveal>
          <TextReveal variant="chars" stagger={0.03}>
            <h1>nothing here</h1>
          </TextReveal>
          <TextReveal variant="words" delay={0.3}>
            <p className="subpage-copy">
              The page does not exist yet. The build is still in progress.
            </p>
          </TextReveal>
          <MagneticElement>
            <Link href="/" className="inline-link">
              return home
            </Link>
          </MagneticElement>
        </div>
      </section>
    </main>
  );
}
