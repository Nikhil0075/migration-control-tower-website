"use client";

import { useCallback, useState } from "react";
import { SmoothScrollProvider } from "@/providers/SmoothScroll";
import { Header } from "./Header";
import { Loader } from "./Loader";
import { PageTransition } from "./PageTransition";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";

/**
 * One shell wraps every route: smooth scrolling, loader, header, fullscreen
 * menu, route overlay, cursor and footer.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [, setLoaded] = useState(false);
  const onDone = useCallback(() => setLoaded(true), []);

  return (
    <SmoothScrollProvider>
      <Loader onDone={onDone} />
      <PageTransition />
      <CustomCursor />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
