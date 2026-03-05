"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Stagger children instead of animating container */
  staggerChildren?: number;
}

const directionProps: Record<Direction, { x: number; y: number; scale: number }> = {
  up: { x: 0, y: 30, scale: 1 },
  left: { x: -40, y: 0, scale: 1 },
  right: { x: 40, y: 0, scale: 1 },
  scale: { x: 0, y: 0, scale: 0.95 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  staggerChildren,
}: ScrollRevealProps) {
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

    const props = directionProps[direction];

    if (staggerChildren != null && staggerChildren > 0) {
      const items = Array.from(el.children);

      gsap.set(items, {
        opacity: 0,
        x: props.x,
        y: props.y,
        scale: props.scale,
      });

      gsap.set(el, { opacity: 1 });

      const tl = gsap.to(items, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        delay,
        stagger: staggerChildren,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      return () => {
        tl.kill();
      };
    }

    gsap.set(el, {
      opacity: 0,
      x: props.x,
      y: props.y,
      scale: props.scale,
    });

    const tween = gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });

    return () => {
      tween.kill();
    };
  }, [direction, delay, duration, staggerChildren]);

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
