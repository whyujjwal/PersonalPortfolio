"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __whyujjwalNoteShown?: boolean;
  }
}

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("js-ready");

    const revealNodes = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (window.__whyujjwalNoteShown) {
      return;
    }

    console.log("Hey, nice - you check the source. I respect that.");
    console.log("If you are reading this, we would probably get along.");
    console.log("-> tiwari.rajujjwal@gmail.com");

    window.__whyujjwalNoteShown = true;
  }, []);

  return null;
}
