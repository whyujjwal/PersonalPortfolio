"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#building", label: "building" },
  { href: "/#writing", label: "writing" },
  { href: "/#proof", label: "proof" },
  { href: "/about", label: "about" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-visible" : ""}`}>
      <div className="site-nav-inner">
        <Link href="/" className="brand">
          whyujjwal
        </Link>

        <nav className="site-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/#lets-talk" className="nav-cta">
            let&apos;s talk
          </Link>
        </nav>

        <div className="mobile-profile-head" aria-label="Profile header">
          <div className="mobile-profile-avatar">
            <Image src="/ujjwal-nobg.png" alt="Ujjwal Raj" width={46} height={46} />
          </div>
          <div className="mobile-profile-text">
            <strong>Ujjwal Raj</strong>
            <span>AI Engineer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
