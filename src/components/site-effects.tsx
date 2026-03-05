"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __whyujjwalNoteShown?: boolean;
  }
}

export function SiteEffects() {
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
