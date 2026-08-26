"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query. Returns false on the server and during the first client
 * render, then settles — so it is used to choose which layout *mounts*, never to
 * hide one with CSS. That matters here because the alternative (rendering both
 * and hiding one) would mount every film twice.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
