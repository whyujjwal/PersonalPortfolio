"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const COLS = 60;
const ROWS = 28;

const SATELLITE = [
  "      ╱▔▔▔▔╲",
  "     ╱  ▓▓  ╲",
  "    ╱  ▓▓▓▓  ╲",
  "   ├───────────┤",
  "   │  ░█░█░█  │",
  "   │  ░░░░░░  │",
  "   │  ▓▓▓▓▓▓  │",
  "   ╰───────────╯",
  "        ║",
  "      ╱═╬═╲",
  "     ╱  ║  ╲",
];

function makeGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
}

function setChar(grid: string[][], x: number, y: number, value: string) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
    return;
  }
  grid[y][x] = value;
}

function drawSignalWaves(grid: string[][], tick: number, cx: number, cy: number) {
  const waves = [
    { radius: 4 + (tick % 20) * 0.8, char: "·", opacity: 1 - (tick % 20) / 20 },
    { radius: 4 + ((tick + 7) % 20) * 0.8, char: "∙", opacity: 1 - ((tick + 7) % 20) / 20 },
    { radius: 4 + ((tick + 14) % 20) * 0.8, char: "•", opacity: 1 - ((tick + 14) % 20) / 20 },
  ];

  waves.forEach((wave) => {
    if (wave.opacity < 0.15) return;
    
    const numPoints = Math.floor(wave.radius * 3.5);
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(angle) * wave.radius);
      const y = Math.round(cy + Math.sin(angle) * wave.radius * 0.5);
      
      if (wave.opacity > 0.6) {
        setChar(grid, x, y, wave.char);
      } else if (wave.opacity > 0.3 && i % 2 === 0) {
        setChar(grid, x, y, wave.char);
      }
    }
  });
}

function drawDataStream(grid: string[][], tick: number) {
  const streams = [
    { x: 8, startY: ROWS - 8, chars: ["1", "0", "1", "1", "0"], speed: 0.4 },
    { x: 52, startY: ROWS - 6, chars: ["0", "1", "0", "1", "1"], speed: 0.35 },
  ];

  streams.forEach((stream) => {
    stream.chars.forEach((char, i) => {
      const y = Math.floor((stream.startY + i * 2 - tick * stream.speed) % ROWS);
      if (y >= 0 && y < ROWS - 2) {
        setChar(grid, stream.x, y, char);
      }
    });
  });
}

function drawSatellite(grid: string[][], cx: number, cy: number, tick: number) {
  const startX = cx - Math.floor(SATELLITE[0].length / 2);
  const startY = cy - Math.floor(SATELLITE.length / 2);

  for (let row = 0; row < SATELLITE.length; row++) {
    for (let col = 0; col < SATELLITE[row].length; col++) {
      const char = SATELLITE[row][col];
      if (char !== " ") {
        setChar(grid, startX + col, startY + row, char);
      }
    }
  }

  // Blinking antenna light
  const blink = Math.floor(tick / 8) % 2 === 0;
  if (blink) {
    setChar(grid, cx, startY + 8, "◆");
  }
}

function drawStars(grid: string[][], tick: number) {
  const stars = [
    { x: 5, y: 2 },
    { x: 14, y: 4 },
    { x: 48, y: 3 },
    { x: 55, y: 7 },
    { x: 3, y: ROWS - 4 },
    { x: 56, y: ROWS - 5 },
  ];

  stars.forEach((star, i) => {
    const twinkle = Math.floor(tick / 4 + i * 3) % 3;
    const char = twinkle === 0 ? "✦" : twinkle === 1 ? "✧" : "*";
    setChar(grid, star.x, star.y, char);
  });
}

function buildFrame(tick: number) {
  const grid = makeGrid();
  const cx = Math.floor(COLS * 0.5);
  const cy = Math.floor(ROWS * 0.38);

  drawStars(grid, tick);
  drawSignalWaves(grid, tick, cx, cy + 2);
  drawDataStream(grid, tick);
  drawSatellite(grid, cx, cy, tick);

  return grid.map((line) => line.join("")).join("\n");
}

export function AsciiContactRocket({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isVisibleRef = useRef(true);

  const text = useMemo(() => buildFrame(reducedMotion ? 0 : frame), [frame, reducedMotion]);

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
    const onVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const id = window.setInterval(() => {
      if (!isVisibleRef.current) {
        return;
      }
      setFrame((current) => current + 1);
    }, 100);

    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <aside className={`ascii-rocket ${className}`.trim()} aria-hidden="true">
      <p className="ascii-rocket-label">{"// comms_satellite"}</p>
      <pre>{text}</pre>
      <p className="ascii-rocket-note">status: transmitting</p>
    </aside>
  );
}
