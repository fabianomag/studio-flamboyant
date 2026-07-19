"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { routeMaps } from "@/content/site";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const isStudio =
      pathname === routeMaps.en.studio || pathname === routeMaps.pt.studio;

    if (reducedMotion.matches || coarsePointer.matches || isStudio) return;

    const lenis = new Lenis({
      lerp: 0.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    let frame = 0;

    const onScroll = () => window.dispatchEvent(new Event("studio:scroll"));
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    lenis.on("scroll", onScroll);
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
