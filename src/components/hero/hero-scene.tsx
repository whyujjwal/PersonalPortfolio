"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConstellationSphere } from "./constellation-sphere";

gsap.registerPlugin(ScrollTrigger);

function HeroSceneFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(60% 50% at 65% 45%, rgba(168, 180, 200, 0.06), transparent)",
      }}
    />
  );
}

export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tween = gsap.to(el, {
      scale: 0.6,
      y: -100,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hero-scene-wrap"
      aria-hidden="true"
    >
      <Suspense fallback={<HeroSceneFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ConstellationSphere />
        </Canvas>
      </Suspense>
    </div>
  );
}
