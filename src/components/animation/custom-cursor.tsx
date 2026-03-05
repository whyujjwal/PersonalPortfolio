"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [label, setLabel] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    if (isTouchDevice) return;
    setIsTouch(false);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor]"
      );
      if (interactive) {
        const cursorLabel =
          interactive.getAttribute("data-cursor") ??
          (interactive.tagName === "A" ? "view" : "click");
        setLabel(cursorLabel);
      } else {
        setLabel(null);
      }
    };

    const tick = () => {
      const lerp = 0.15;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    rafRef.current = requestAnimationFrame(tick);

    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (isTouch) return null;

  const isExpanded = label !== null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width: isExpanded ? 64 : 8,
        height: isExpanded ? 64 : 8,
        borderRadius: "50%",
        border: isExpanded ? "1px solid var(--accent)" : "none",
        background: isExpanded ? "transparent" : "var(--accent)",
        boxShadow: isExpanded
          ? "0 0 20px var(--accent-glow)"
          : "0 0 12px var(--accent-glow)",
        display: "grid",
        placeItems: "center",
        transition: "width 0.25s var(--ease-out-expo), height 0.25s var(--ease-out-expo), background 0.2s ease, border 0.2s ease",
        mixBlendMode: "difference",
      }}
    >
      {isExpanded && (
        <span
          style={{
            color: "var(--accent)",
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-mono)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
