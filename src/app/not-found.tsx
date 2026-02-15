import Link from "next/link";

export default function NotFound() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <div className="site-shell" data-reveal>
          <p className="section-label">{"// 404"}</p>
          <h1>nothing here</h1>
          <p className="subpage-copy">The page does not exist yet. The build is still in progress.</p>
          <Link href="/" className="inline-link">
            return home
          </Link>
        </div>
      </section>
    </main>
  );
}
