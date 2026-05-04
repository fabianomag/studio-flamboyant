"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  clearPendingRouteShellTransition,
  getPendingRouteShellTransition,
  type RouteShellTransitionMode,
} from "@/lib/route-shell-transition";

type ActiveTransition = {
  id: number;
  mode: RouteShellTransitionMode;
};

export function RouteShellTransition() {
  const pathname = usePathname();
  const [activeTransition, setActiveTransition] = useState<ActiveTransition | null>(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return null;

    const pending = getPendingRouteShellTransition();
    const currentPath = window.location.pathname;

    if (pending === "home-leave" && currentPath !== "/") {
      return { id: Date.now(), mode: pending };
    }

    if (pending === "home-enter" && currentPath === "/") {
      return { id: Date.now(), mode: pending };
    }

    return null;
  });

  useEffect(() => {
    const pending = getPendingRouteShellTransition();
    if (!pending || window.innerWidth < 1024) return;

    if (pending === "home-leave" && pathname !== "/") {
      setActiveTransition({ id: Date.now(), mode: pending });
      return;
    }

    if (pending === "home-enter" && pathname === "/") {
      setActiveTransition({ id: Date.now(), mode: pending });
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {activeTransition ? (
        <motion.div
          key={activeTransition.id}
          initial={
            activeTransition.mode === "home-leave"
              ? { x: 0, opacity: 1 }
              : { x: "-112%", opacity: 1 }
          }
          animate={
            activeTransition.mode === "home-leave"
              ? { x: "-118%", opacity: 1 }
              : { x: 0, opacity: 1 }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            clearPendingRouteShellTransition();
            setActiveTransition(null);
          }}
          className="pointer-events-none fixed inset-y-0 left-0 z-[92] hidden border-r border-ambient-stone/15 bg-ambient-micro shadow-[24px_0_60px_rgba(6,17,22,0.08)] lg:block lg:w-64 xl:w-72"
        >
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-ambient-electric/40 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))]" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
