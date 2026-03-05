"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type TextRevealVariant = "chars" | "words" | "lines" | "fade";

interface TextRevealProps {
  children: ReactNode;
  variant?: TextRevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  /** If true, plays on mount instead of scroll-trigger */
  immediate?: boolean;
}

export function TextReveal({
  children,
  variant = "words",
  delay = 0,
  duration,
  stagger,
  className,
  immediate = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.style.opacity = "1";
      return;
    }

    if (variant === "fade") {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: duration ?? 0.6,
        delay,
        ease: "power3.out",
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: "top 85%", once: true },
      });

      return () => {
        tween.kill();
      };
    }

    const splitConfig: Record<TextRevealVariant, "chars" | "words" | "lines"> = {
      chars: "chars",
      words: "words",
      lines: "lines",
      fade: "words",
    };

    const split = new SplitType(el, { types: splitConfig[variant] });
    const targets = split[splitConfig[variant]];

    if (!targets || targets.length === 0) {
      el.style.opacity = "1";
      return;
    }

    const defaults: Record<TextRevealVariant, { duration: number; stagger: number }> = {
      chars: { duration: 0.8, stagger: 0.02 },
      words: { duration: 0.6, stagger: 0.04 },
      lines: { duration: 0.5, stagger: 0.1 },
      fade: { duration: 0.6, stagger: 0.04 },
    };

    const d = duration ?? defaults[variant].duration;
    const s = stagger ?? defaults[variant].stagger;

    gsap.set(el, { opacity: 1 });

    if (variant === "lines") {
      gsap.set(targets, { clipPath: "inset(0 0 100% 0)", opacity: 0 });
    } else {
      gsap.set(targets, { opacity: 0, y: "100%", rotateX: variant === "chars" ? -90 : 0 });
    }

    const tl = gsap.timeline({
      scrollTrigger: immediate
        ? undefined
        : { trigger: el, start: "top 85%", once: true },
      delay,
    });

    if (variant === "lines") {
      tl.to(targets, {
        clipPath: "inset(0 0 0% 0)",
        opacity: 1,
        duration: d,
        stagger: s,
        ease: "power3.inOut",
      });
    } else {
      tl.to(targets, {
        opacity: 1,
        y: "0%",
        rotateX: 0,
        duration: d,
        stagger: s,
        ease: "expo.out",
      });
    }

    return () => {
      tl.kill();
      split.revert();
    };
  }, [variant, delay, duration, stagger, immediate]);

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0, overflow: "hidden" }}>
      {children}
    </div>
  );
}
