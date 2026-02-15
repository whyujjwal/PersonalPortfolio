"use client";

import { useEffect, useState } from "react";

type HeroTypewriterProps = {
  text: string;
  speed?: number;
};

export function HeroTypewriter({ text, speed = 26 }: HeroTypewriterProps) {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const immediate = setTimeout(() => {
        setValue(text);
        setDone(true);
      }, 0);
      return () => clearTimeout(immediate);
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      index += 1;
      setValue(text.slice(0, index));

      if (index >= text.length) {
        setDone(true);
        return;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 320);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [speed, text]);

  return (
    <p className={`hero-typewriter ${done ? "is-done" : ""}`} aria-live="polite">
      {value}
      <span className="type-caret" aria-hidden="true">
        |
      </span>
    </p>
  );
}
