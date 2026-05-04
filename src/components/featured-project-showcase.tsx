"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from "framer-motion";
import type { Project } from "@/lib/projects";
import { withLang, type Lang } from "@/lib/i18n";
import { getImageBlurDataURL } from "@/lib/image-placeholder";

export function FeaturedProjectShowcase({
  projects,
  lang,
}: {
  projects: Project[];
  lang: Lang;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  // Parallax suave na foto — imagem se move menos que o scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const pausedRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex];

  const paginate = useCallback((step: number) => {
    setDirection(step);
    setActiveIndex((current) => (current + step + projects.length) % projects.length);
  }, [projects.length]);

  const moveTo = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + projects.length) % projects.length;
    if (normalizedIndex === activeIndex) return;
    const delta =
      normalizedIndex > activeIndex ||
      (activeIndex === projects.length - 1 && normalizedIndex === 0) ? 1 : -1;
    setDirection(delta);
    setActiveIndex(normalizedIndex);
    pausedRef.current = true;
    setTimeout(() => { pausedRef.current = false; }, 10000);
  };

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!pausedRef.current) paginate(1);
    }, 5000);
  }, [paginate]);

  useEffect(() => {
    resetAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [resetAutoplay]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) * Math.sign(info.offset.x) + info.velocity.x * 16;
    if (swipePower <= -140 || swipePower >= 140) {
      pausedRef.current = true;
      setTimeout(() => { pausedRef.current = false; }, 10000);
    }
    if (swipePower <= -140) paginate(1);
    else if (swipePower >= 140) paginate(-1);
  };

  const imageVariants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.03 }),
    center: { opacity: 1, scale: 1 },
    exit: (d: number) => ({ opacity: 0, scale: 0.98 }),
  };

  const infoVariants = {
    enter: (d: number) => ({ opacity: 0, y: d >= 0 ? 16 : -16 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d >= 0 ? -12 : 12 }),
  };

  return (
    <div
      ref={containerRef}
      className="relative grid min-h-[92vh] grid-cols-1 lg:grid-cols-[18rem_1fr] xl:grid-cols-[22rem_1fr]"
    >
      {/* ── Coluna esquerda: navegação vertical ── */}
      <div className="relative z-10 flex flex-col justify-between bg-ambient-micro px-8 py-10 lg:px-10 lg:py-12">
        {/* Contador */}
        <div className="flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-ambient-muted">
          <span className="text-ambient-dark font-medium">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-ambient-stone/50" />
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>

        {/* Info do projeto ativo */}
        <div className="my-auto py-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`info-${activeProject.slug}`}
              custom={direction}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeOut" }}
            >
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.2em] text-ambient-canyon/60">
                {activeProject.category} · {activeProject.year}
              </p>
              <h2 className="font-display text-[2.2rem] uppercase leading-[0.88] tracking-[-0.03em] text-ambient-dark xl:text-[2.7rem]">
                {activeProject.title}
              </h2>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-ambient-dark/55 xl:text-[1rem]">
                {activeProject.description}
              </p>
              <Link
                href={withLang(`/${activeProject.section}/${activeProject.slug}`, lang)}
                className="mt-8 inline-flex items-center gap-4 text-[0.78rem] uppercase tracking-[0.18em] text-ambient-dark/50 transition-colors hover:text-ambient-electric"
              >
                <span className="block h-px w-8 bg-ambient-electric" />
                {lang === "pt" ? "Ver projeto" : "View project"}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots de navegação */}
        <div className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => moveTo(index)}
              aria-label={`${lang === "pt" ? "Ir para" : "Go to"} ${project.title}`}
              className="group flex items-center gap-3 text-left"
            >
              <span
                className={`block h-px transition-all duration-400 ${
                  activeIndex === index
                    ? "w-8 bg-ambient-electric"
                    : "w-4 bg-ambient-stone/40 group-hover:w-6 group-hover:bg-ambient-stone"
                }`}
              />
              <span
                className={`text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  activeIndex === index
                    ? "text-ambient-dark"
                    : "text-ambient-muted/50 group-hover:text-ambient-muted"
                }`}
              >
                {project.title}
              </span>
            </button>
          ))}

          <Link
            href={withLang("/projetos", lang)}
            className="mt-6 inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.18em] text-ambient-muted/50 transition-colors hover:text-ambient-electric"
          >
            <span className="block h-px w-6 bg-ambient-electric/60" />
            {lang === "pt" ? "Todos os projetos" : "All projects"}
          </Link>
        </div>
      </div>

      {/* ── Coluna direita: imagem full-height com parallax ── */}
      <div ref={imageRef} className="relative overflow-hidden bg-ambient-linen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeProject.slug}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: "easeOut" }}
            drag={projects.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Link href={withLang(`/${activeProject.section}/${activeProject.slug}`, lang)} className="block h-full w-full">
              {/* Parallax wrapper — imagem maior que o container */}
              <motion.div
                style={{ top: "-8%", bottom: "-8%", left: 0, right: 0, y: imageY }}
                className="absolute"
              >
                <Image
                  src={activeProject.cover}
                  alt={activeProject.title}
                  fill
                  priority={activeIndex === 0}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover object-center"
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL()}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ambient-dark/25 via-transparent to-transparent" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Localização discreta no canto inferior direito */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`loc-${activeProject.slug}`}
            custom={direction}
            variants={infoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: "easeOut", delay: 0.1 }}
            className="pointer-events-none absolute bottom-6 right-6 text-right"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/60">
              {activeProject.location}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
