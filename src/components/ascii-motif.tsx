"use client";

import { useEffect, useMemo, useState } from "react";

type MotifVariant = "about" | "contact" | "about-page";

type MotifConfig = {
  label: string;
  note: string;
  frames: string[];
  interval: number;
};

const ABOUT_FRAMES = [
  [
    "      .-====-.",
    "    .'  __  '.",
    "   /  .-..-.  \\",
    "  |  /  ||  \\  |",
    "  | |   ||   | |",
    "  |  \\__||__/  |",
    "   \\    --    /",
    "    '-.____.-'",
  ].join("\n"),
  [
    "      .-====-.",
    "    .'  __  '.",
    "   /  .-..-.  \\",
    "  |  |  ||  |  |",
    "  | |  _||_  | |",
    "  |  |_/  \\_|  |",
    "   \\    --    /",
    "    '-.____.-'",
  ].join("\n"),
  [
    "      .-====-.",
    "    .'  __  '.",
    "   /  .-..-.  \\",
    "  |  |\\_||_/|  |",
    "  | |  /||\\  | |",
    "  |  |__||__|  |",
    "   \\    --    /",
    "    '-.____.-'",
  ].join("\n"),
];

const CONTACT_FRAMES = [
  [
    "       @ @ @",
    "      @ @ @ @",
    "     @ @ @ @ @",
    "        |||",
    "       [___]",
    "      |     |",
    "      |_____|",
  ].join("\n"),
  [
    "     @ @ @ @ @",
    "    @ @ @ @ @ @",
    "   @ @ @ @ @ @ @",
    "        |||",
    "       [___]",
    "      |     |",
    "      |_____|",
  ].join("\n"),
  [
    "   @ @ @ @ @ @ @",
    "  @ @ @ @ @ @ @ @",
    " @ @ @ @ @ @ @ @ @",
    "        |||",
    "       [___]",
    "      |  *  |",
    "      |_____|",
  ].join("\n"),
  [
    "     @ @ @ @ @",
    "    @ @ @ @ @ @",
    "   @ @ @ @ @ @ @",
    "        |||",
    "       [___]",
    "      | *** |",
    "      |_____|",
  ].join("\n"),
];

const ABOUT_PAGE_FRAMES = [
  [
    "        /\\",
    "       /  \\",
    "      |    |",
    "      | AI |",
    "     /|    |\\",
    "    /_|____|_\\",
    "      |::::|",
    "     /|::::|\\",
    "    /_|::::|_\\",
    "      ^    ^",
  ].join("\n"),
  [
    "        /\\",
    "       /  \\",
    "      |    |",
    "      | AI |",
    "     /|    |\\",
    "    /_|____|_\\",
    "      |::::|",
    "     /|::::|\\",
    "    * |::::| *",
    "     \\|::::|/",
  ].join("\n"),
  [
    "        /\\",
    "       /  \\",
    "      |    |",
    "      | AI |",
    "     /|    |\\",
    "    /_|____|_\\",
    "    * |::::| *",
    "   *  |::::|  *",
    "      \\|::|/",
    "       \\||/",
  ].join("\n"),
  [
    "        /\\",
    "       /  \\",
    "      |    |",
    "      | AI |",
    "     /|    |\\",
    "   * /_|____|_\\ *",
    "  *    |::::|    *",
    "       |::::|",
    "        \\||/",
    "         \\/",
  ].join("\n"),
];

function getConfig(variant: MotifVariant): MotifConfig {
  if (variant === "about") {
    return {
      label: "// profile-signal",
      note: "build mode: active",
      frames: ABOUT_FRAMES,
      interval: 920,
    };
  }

  if (variant === "contact") {
    return {
      label: "// signal-tower",
      note: "status: broadcasting",
      frames: CONTACT_FRAMES,
      interval: 700,
    };
  }

  return {
    label: "// rocket-launch",
    note: "status: ignition",
    frames: ABOUT_PAGE_FRAMES,
    interval: 800,
  };
}

export function AsciiMotif({
  variant,
  className = "",
}: {
  variant: MotifVariant;
  className?: string;
}) {
  const config = useMemo(() => getConfig(variant), [variant]);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    if (reducedMotion || config.frames.length < 2) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % config.frames.length);
    }, config.interval);

    return () => window.clearInterval(id);
  }, [config.frames.length, config.interval, reducedMotion]);

  return (
    <aside className={`ascii-motif ${className}`.trim()} aria-hidden="true">
      <p className="ascii-motif-label">{config.label}</p>
      <pre>{config.frames[index]}</pre>
      <p className="ascii-motif-note">{config.note}</p>
    </aside>
  );
}
