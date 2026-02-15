"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_SETS = [
  " .'`^\",:;Il!i~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  " .,:;-~=+*xX#%@",
  " `'.,:^!il~+_-?1)(|/\\tfjrxnuvczXYUCLQ0OZmwqpkhao*#MW&8%B@$",
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function noise(x: number, y: number, tick: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + tick * 0.0812) * 43758.5453;
  return n - Math.floor(n);
}

export function AsciiProfilePortrait({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dimsRef = useRef({ cols: 84, rows: 52 });
  const reducedMotionRef = useRef(false);
  const inViewRef = useRef(true);
  const [ready, setReady] = useState(false);

  const render = (tick: number) => {
    if (!preRef.current || !canvasRef.current || !imageRef.current) {
      return;
    }

    const { cols, rows } = dimsRef.current;
    const canvas = canvasRef.current;
    canvas.width = cols;
    canvas.height = rows;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return;
    }

    context.clearRect(0, 0, cols, rows);
    context.fillStyle = "#000";
    context.fillRect(0, 0, cols, rows);

    const image = imageRef.current;
    const padX = cols * 0.08;
    const padY = rows * 0.04;
    const targetWidth = cols - padX * 2;
    const targetHeight = rows - padY * 2;
    const scale = Math.min(targetWidth / image.width, targetHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = (cols - drawWidth) * 0.5;
    const drawY = (rows - drawHeight) * 0.5;
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    const imageData = context.getImageData(0, 0, cols, rows).data;
    const charset = CHAR_SETS[tick % CHAR_SETS.length];
    const scanRow = (tick * 2) % rows;
    let output = "";

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const offset = (y * cols + x) * 4;
        const alpha = imageData[offset + 3];

        if (alpha < 12) {
          output += " ";
          continue;
        }

        const r = imageData[offset];
        const g = imageData[offset + 1];
        const b = imageData[offset + 2];
        const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        let lit = 1 - luminance;
        lit = lit * 0.9 + (alpha / 255) * 0.1;

        // Subtle horizontal scan shimmer.
        if (Math.abs(y - scanRow) < 2) {
          lit = clamp(lit + 0.14, 0, 1);
        }

        // Controlled noise so glyphs feel alive without flicker noise.
        lit = clamp(lit + (noise(x, y, tick) - 0.5) * 0.09, 0, 1);

        const index = clamp(Math.floor(lit * (charset.length - 1)), 0, charset.length - 1);
        output += charset[index];
      }
      output += "\n";
    }

    preRef.current.textContent = output;
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;

    const image = new Image();
    image.src = "/ujjwal-nobg.png";
    image.decoding = "async";
    image.onload = () => {
      imageRef.current = image;
      setReady(true);
      render(0);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      reducedMotionRef.current = media.matches;
    };
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
    if (!wrapperRef.current) {
      return;
    }

    const updateSize = () => {
      if (!wrapperRef.current) {
        return;
      }
      const width = wrapperRef.current.clientWidth || 680;
      const cols = clamp(Math.floor(width / 7.4), 52, 126);
      const rows = clamp(Math.floor(cols * 0.72), 32, 78);
      dimsRef.current = { cols, rows };
      render(0);
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(wrapperRef.current);
    window.addEventListener("resize", updateSize, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.02 },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    let tick = 0;

    const step = () => {
      const delay = 180;
      if (ready && !reducedMotionRef.current && inViewRef.current && !document.hidden) {
        tick += 1;
        render(tick);
      }
      timer = window.setTimeout(step, delay);
    };

    if (ready && !reducedMotionRef.current) {
      timer = window.setTimeout(step, 120);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [ready]);

  return (
    <div ref={wrapperRef} className={`ascii-profile ${className}`.trim()} data-reveal>
      <p className="ascii-profile-label">{"// profile_matrix"}</p>
      <pre ref={preRef} className="ascii-profile-pre" aria-hidden="true">
        loading profile matrix...
      </pre>
      <p className="ascii-profile-note">source: /ujjwal-nobg.png</p>
    </div>
  );
}
