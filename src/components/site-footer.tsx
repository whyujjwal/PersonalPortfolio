import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p>available for projects | responds within 24hrs | based in India</p>
        <div className="footer-links">
          <Link href="https://github.com/whyujjwal" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          <Link href="https://x.com/whyujjwal" target="_blank" rel="noopener noreferrer">
            Twitter/X
          </Link>
          <Link href="https://www.linkedin.com/in/ujjwal-raj-tiwari-2019b5181/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
