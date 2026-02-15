"use client";

import { useEffect, useRef, useState } from "react";

type ViewportGrid = {
  cols: number;
  rows: number;
};

const SHADE_CHARS = " .,:;+*?%S#@";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash2D(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 67.9) * 43758.5453;
  return value - Math.floor(value);
}

function glyphForValue(value: number, x: number, y: number, tick: number) {
  const dither = (hash2D(x, y, tick) - 0.5) * 0.045;
  const v = clamp(value + dither, 0, 1);
  if (v < 0.035) {
    return " ";
  }
  const index = clamp(Math.floor(v * SHADE_CHARS.length), 0, SHADE_CHARS.length - 1);
  return SHADE_CHARS[index];
}

function buildSaturnFrame(cols: number, rows: number, tick: number) {
  const isPhone = cols < 104;
  const isTablet = cols >= 104 && cols < 180;
  const phase = tick * (isPhone ? 0.12 : 0.09);

  const centerX = cols * (isPhone ? 0.56 : isTablet ? 0.58 : 0.58);
  const centerY = rows * (isPhone ? 1.05 : 0.56);

  const planetRx = clamp(cols * (isPhone ? 0.14 : isTablet ? 0.104 : 0.098), 11, cols * 0.15);
  const planetRy = planetRx * (isPhone ? 0.66 : 0.6);

  const ringA = clamp(cols * (isPhone ? 0.52 : isTablet ? 0.42 : 0.4), 40, cols * 0.6);
  const ringB = ringA * (isPhone ? 0.22 : isTablet ? 0.185 : 0.17);
  const ringThickness = isPhone ? 0.046 : 0.038;
  const ringFeather = isPhone ? 0.024 : 0.02;
  const tilt = (isPhone ? -0.44 : -0.34) + Math.sin(tick * 0.012) * 0.03;
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  const edgeFadeStart = isPhone ? 0.01 : 0.008;
  const edgeFadeEnd = isPhone ? 0.08 : 0.06;

  const lines: string[] = [];

  for (let y = 0; y < rows; y += 1) {
    let line = "";

    for (let x = 0; x < cols; x += 1) {
      const dx = x + 0.5 - centerX;
      const dy = y + 0.5 - centerY;

      const rx = dx * cosTilt - dy * sinTilt;
      const ry = dx * sinTilt + dy * cosTilt;

      const ringNorm = Math.hypot(rx / ringA, ry / ringB);
      const ringDistance = Math.abs(ringNorm - 1);
      const ringMask = 1 - smoothstep(ringThickness, ringThickness + ringFeather, ringDistance);
      const angle = Math.atan2(ry / ringB, rx / ringA);
      const banding = 0.86 + 0.14 * Math.sin(angle * 6.8 + phase);
      const grain = 0.96 + 0.04 * Math.sin((ringNorm - 1) * 36 - phase * 0.55);
      const frontSide = ry > 0 ? 1 : 0;
      const baseRing = ringMask * 0.26 * grain;
      const backRing = ringMask * (0.16 + 0.1 * banding) * (1 - frontSide) * grain;
      const frontRing = ringMask * (0.25 + 0.13 * banding) * frontSide * grain;

      const px = dx / planetRx;
      const py = dy / planetRy;
      const planetEq = px * px + py * py;

      let planet = 0;
      if (planetEq <= 1) {
        const pz = Math.sqrt(1 - planetEq);
        const diffuse = px * -0.55 + py * -0.34 + pz * 1.02;
        const stripes = Math.sin(py * 17 + phase * 0.42) * 0.07;
        const rim = Math.pow(1 - pz, 2.1) * 0.2;
        planet = clamp((diffuse + 1) * 0.38 + 0.24 + stripes + rim, 0, 1);
      }

      const halo =
        Math.exp(-Math.pow(dx / (planetRx * 2.6), 2) - Math.pow(dy / (planetRy * 2.6), 2)) * 0.04;

      const ringValue = Math.max(baseRing, backRing, frontRing);

      const edge = Math.min(
        (x + 0.5) / cols,
        (cols - x - 0.5) / cols,
        (y + 0.5) / rows,
        (rows - y - 0.5) / rows,
      );
      const edgeFade = smoothstep(edgeFadeStart, edgeFadeEnd, edge);

      // Apply edge fade only to planet and halo, not the ring
      const planetWithFade = planet * edgeFade;
      const haloWithFade = halo * edgeFade;

      const value = Math.max(ringValue, planetWithFade) + haloWithFade;

      line += glyphForValue(clamp(value, 0, 1), x / cols, y / rows, tick);
    }

    lines.push(line);
  }

  return lines.join("\n");
}

export function HeroAsciiOrbit() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportGrid, setViewportGrid] = useState<ViewportGrid>({ cols: 110, rows: 36 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const saturnRef = useRef<HTMLPreElement>(null);
  const tickRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const viewportGridRef = useRef<ViewportGrid>(viewportGrid);
  const inViewRef = useRef(true);
  const isMobileRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    if (!reducedMotion) {
      return;
    }
    tickRef.current = 0;
    if (saturnRef.current) {
      saturnRef.current.textContent = buildSaturnFrame(
        viewportGridRef.current.cols,
        viewportGridRef.current.rows,
        0,
      );
    }
  }, [reducedMotion]);

  useEffect(() => {
    viewportGridRef.current = viewportGrid;
    if (saturnRef.current) {
      saturnRef.current.textContent = buildSaturnFrame(
        viewportGrid.cols,
        viewportGrid.rows,
        tickRef.current,
      );
    }
  }, [viewportGrid]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    const legacyMedia = media as MediaQueryList & {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    legacyMedia.addListener?.(onChange);
    return () => legacyMedia.removeListener?.(onChange);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isMobileRef.current = w <= 820;

      const renderWidth = wrapperRef.current?.clientWidth ?? w;
      const renderHeight = wrapperRef.current?.clientHeight ?? h;
      const computed = saturnRef.current ? window.getComputedStyle(saturnRef.current) : null;
      const fontSize = computed ? parseFloat(computed.fontSize) || 8 : 8;
      const lineHeight = computed
        ? parseFloat(computed.lineHeight) || fontSize * 0.9
        : fontSize * 0.9;
      const letterSpacing = computed ? parseFloat(computed.letterSpacing) || 0 : 0;
      const charWidth = Math.max(fontSize * 0.56 + letterSpacing, 3.5);

      const nextCols = clamp(Math.ceil(renderWidth / charWidth) + 2, 56, 280);
      const nextRows = clamp(Math.ceil(renderHeight / lineHeight) + 2, 34, 140);

      setViewportGrid((current) => {
        if (Math.abs(current.cols - nextCols) < 4 && Math.abs(current.rows - nextRows) < 4) {
          return current;
        }
        return { cols: nextCols, rows: nextRows };
      });
    };

    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.01 },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (saturnRef.current) {
      saturnRef.current.textContent = buildSaturnFrame(
        viewportGridRef.current.cols,
        viewportGridRef.current.rows,
        tickRef.current,
      );
    }
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    const step = () => {
      const delay = isMobileRef.current ? 190 : 220;
      if (!reducedMotionRef.current && inViewRef.current && !document.hidden) {
        tickRef.current += 1;
        if (saturnRef.current) {
          saturnRef.current.textContent = buildSaturnFrame(
            viewportGridRef.current.cols,
            viewportGridRef.current.rows,
            tickRef.current,
          );
        }
      }
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, 120);
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="hero-ascii-wrap" aria-hidden="true">
      <pre ref={saturnRef} className="hero-ascii hero-ascii-saturn" />
    </div>
  );
}
