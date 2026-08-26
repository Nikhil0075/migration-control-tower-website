"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * Anything that creates a ScrollTrigger **pin** must use this rather than a
 * plain useEffect. A pin re-parents its element into a `.pin-spacer` div that
 * GSAP inserts and React knows nothing about. On unmount React runs useEffect
 * cleanups in the passive phase — after it has already tried to remove those
 * nodes — so it looks for the pinned element under its original parent, does not
 * find it, and throws "removeChild: the node to be removed is not a child of
 * this node", taking the whole route transition down with it.
 *
 * A layout effect's cleanup runs synchronously in the mutation phase, so GSAP
 * unwraps the spacer and restores the original parent before React removes
 * anything. Same reason GSAP's own React helper is built on a layout effect.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
