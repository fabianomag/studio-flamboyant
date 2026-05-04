"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from "framer-motion";
import type { Project } from "@/lib/projects";
import { withLang, type Lang } from "@/lib/i18n";
import { typographyTokenMap } from "@/lib/typography-system";
import { ContactShowcase } from "@/components/contact-showcase";
import {
  getPendingRouteShellTransition,
  setPendingRouteShellTransition,
} from "@/lib/route-shell-transition";
import { getStudioContent } from "@/lib/studio-content";
import TeamShowcase, { type TeamMember } from "@/components/ui/team-showcase";
import { getImageBlurDataURL } from "@/lib/image-placeholder";

type Section = "projetos" | "publicacao" | "galeria" | "escritorio" | "contato";
type Copy = typeof copy[keyof typeof copy];
const homeProjectOverlayTitleClass =
  typographyTokenMap.homeProjectOverlayTitle.className ??
  "mt-1 font-display text-[3rem] font-bold uppercase leading-[0.82] tracking-[-0.05em] text-white sm:text-[3.6rem] lg:text-[4.8rem]";
const displaySplitAccentVariants = typographyTokenMap.displaySplitAccent.variants ?? {};
const editorialAccentTitleVariants = typographyTokenMap.editorialAccentTitle.variants ?? {};
const editorialAccentSubtitleVariants = typographyTokenMap.editorialAccentSubtitle.variants ?? {};
const pageLeadVariants = typographyTokenMap.pageLead.variants ?? {};
const pageEyebrowClass =
  typographyTokenMap.pageEyebrow.className ??
  "text-label uppercase text-ambient-canyon/55";
const sidebarIntroClass =
  typographyTokenMap.sidebarIntro.className ?? "home-ui-copy mt-5";

const latestPublication = {
  title: "Caderno Azul",
  date: "07/25",
  href: "/publicacoes",
};

const copy = {
  pt: {
    intro: "Julia Fonseca Arquitetura desenvolve projetos residenciais, comerciais e de interiores com leitura contemporânea, presença visual forte e um senso de permanência que aproxima arquitetura, matéria e atmosfera.",
    nav: [
      { id: "projetos" as Section, label: "Projetos" },
      { id: "publicacao" as Section, label: "Publicação" },
      { id: "galeria" as Section, label: "Galeria Tréfle" },
      { id: "escritorio" as Section, label: "Escritório" },
      { id: "contato" as Section, label: "Contato" },
    ],
    viewProject: "Ver projeto",
    viewAll: "Ver todos os projetos",
    viewAllPublications: "Ver publicações",
    galleryCta: "Conhecer a galeria",
    publicationMeta: "Arquitetura • Interiores • Escritório",
    publicationIntro: "Um caderno editorial para registrar ideias, referências e leituras do escritório. O Caderno Azul organiza arquitetura, interiores e atmosfera em uma linguagem própria.",
    galleryIntro: "Um braço curatorial que aproxima arte, mobiliário e atmosfera. A Galeria Tréfle amplia o repertório do escritório com peças e objetos escolhidos para compor espaços com presença silenciosa e identidade própria.",
    email: "juliafonseca.arquiteta@gmail.com",
  },
  en: {
    intro: "Julia Fonseca Arquitetura develops residential, commercial and interior projects with a contemporary language, strong visual presence and a lasting sense of atmosphere.",
    nav: [
      { id: "projetos" as Section, label: "Projects" },
      { id: "publicacao" as Section, label: "Publication" },
      { id: "galeria" as Section, label: "Galeria Tréfle" },
      { id: "escritorio" as Section, label: "Studio" },
      { id: "contato" as Section, label: "Contact" },
    ],
    viewProject: "View project",
    viewAll: "All projects",
    viewAllPublications: "View publications",
    galleryCta: "Discover the gallery",
    publicationMeta: "Architecture • Interiors • Studio",
    publicationIntro: "An editorial notebook for ideas, references and studio notes. Caderno Azul gathers architecture, interiors and atmosphere into a language of its own.",
    galleryIntro: "A curatorial extension that brings art, objects and atmosphere closer together. Galeria Tréfle expands the studio repertoire with pieces selected for quiet presence and a distinct identity.",
    email: "juliafonseca.arquiteta@gmail.com",
  },
} as const;

const panelVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

// ── Painel: Projetos ──────────────────────────────────────────────
function PanelProjetos({
  projects,
  lang,
  t,
  onRouteClick,
}: {
  projects: Project[];
  lang: Lang;
  t: Copy;
  onRouteClick: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const pausedRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const activeProject = projects[activeIndex];

  const paginate = useCallback((step: number) => {
    setDirection(step);
    setActiveIndex(c => (c + step + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!pausedRef.current) paginate(1);
    }, 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [paginate]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const power = Math.abs(info.offset.x) * Math.sign(info.offset.x) + info.velocity.x * 16;
    if (Math.abs(power) > 140) {
      pausedRef.current = true;
      setTimeout(() => { pausedRef.current = false; }, 10000);
      paginate(power < 0 ? 1 : -1);
    }
  };

  const moveTo = (i: number) => {
    if (i === activeIndex) return;
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
    pausedRef.current = true;
    setTimeout(() => { pausedRef.current = false; }, 10000);
  };

  if (!activeProject) return null;
  const activeProjectHref = withLang(`/${activeProject.section}/${activeProject.slug}`, lang);

  return (
    <div className="flex h-full flex-col">
      {/* Imagem com parallax */}
      <div ref={imageRef} className="relative flex-1 overflow-hidden bg-ambient-linen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeProject.slug}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Link
              href={activeProjectHref}
              onClick={(event) => onRouteClick(event, activeProjectHref)}
              className="block h-full w-full"
            >
              <motion.div style={{ top: "-6%", bottom: "-6%", left: 0, right: 0, y: imageY }} className="absolute">
                <Image
                  src={activeProject.cover}
                  alt={activeProject.title}
                  fill
                  priority
                  sizes="75vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL()}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ambient-dark/30 via-transparent to-transparent" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Info discreta sobre a imagem */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`overlay-${activeProject.slug}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute bottom-6 left-7 right-7 flex items-end justify-between"
          >
            <div>
              <p className="home-ui-overlay-meta">{activeProject.category} · {activeProject.year}</p>
              <h2 className={homeProjectOverlayTitleClass}>
                {activeProject.title}
              </h2>
            </div>
            <Link
              href={activeProjectHref}
              onClick={(event) => onRouteClick(event, activeProjectHref)}
              className="home-ui-overlay-action pointer-events-auto mb-1 ml-6 shrink-0 transition-colors hover:text-white"
            >
              {t.viewProject} →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav inferior */}
      <div className="flex items-center justify-between border-t border-ambient-stone/20 bg-ambient-micro px-7 py-4">
        <div className="flex items-center gap-3">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => moveTo(i)}
              aria-label={p.title}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-0 w-0 transition-all duration-300 ${
                  i % 2 === 0
                    ? "border-x-[4px] border-b-[7px] border-x-transparent"
                    : "border-x-[4px] border-t-[7px] border-x-transparent"
                } ${
                  i === activeIndex
                    ? i % 2 === 0
                      ? "scale-125 border-b-ambient-electric"
                      : "scale-125 border-t-ambient-electric"
                    : i % 2 === 0
                      ? "border-b-ambient-stone group-hover:border-b-ambient-electric/70"
                      : "border-t-ambient-stone group-hover:border-t-ambient-electric/70"
                }`}
              />
            </button>
          ))}
          <span className="home-ui-meta ml-2">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <Link
          href={withLang("/projetos", lang)}
          onClick={(event) => onRouteClick(event, withLang("/projetos", lang))}
          className="home-ui-action inline-flex items-center gap-3 transition-colors hover:text-ambient-electric"
        >
          <span className="block h-px w-6 bg-ambient-electric" />
          {t.viewAll}
        </Link>
      </div>
    </div>
  );
}

// ── Painel: Publicação ────────────────────────────────────────────
function PanelPublicacao({
  lang,
  t,
  onRouteClick,
}: {
  lang: Lang;
  t: Copy;
  onRouteClick: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const publicationHref = withLang(latestPublication.href, lang);

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <Link
        href={publicationHref}
        onClick={(event) => onRouteClick(event, publicationHref)}
        className="relative flex-1 overflow-hidden bg-white lg:max-w-[55%]"
      >
        <div className="accent-line flex h-full w-[14%] items-start justify-center pt-8">
          <span className="rotate-180 text-sm uppercase tracking-[0.18em] text-white [writing-mode:vertical-rl]">Julia</span>
        </div>
        <div className="absolute inset-0 left-[14%] overflow-hidden">
          <div className="absolute inset-0 bg-caderno-azul-cover" />
          <div className="relative flex h-full flex-col justify-between p-8 text-white">
            <div>
              <p className={editorialAccentTitleVariants.publicationCover ?? "font-display text-[5rem] uppercase font-bold leading-[0.82] tracking-[-0.05em] lg:text-[7rem]"}>
                Caderno
                <span className="block">Azul<span className="text-ambient-cyan">*</span></span>
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/75">{t.publicationMeta}</p>
            </div>
            <div className="grid gap-1 text-xs uppercase tracking-[0.18em] text-white/80">
              <span>Edição 01</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-center bg-ambient-micro p-10 lg:p-12">
        <p className={pageEyebrowClass}>Publicação</p>
        <h3 className={editorialAccentSubtitleVariants.publicationPanel ?? "mt-3 font-display text-[2.2rem] uppercase leading-[0.88] tracking-[-0.02em] text-ambient-dark"}>
          Caderno Azul<span className="text-ambient-cyan">*</span>
        </h3>
        <p className={pageLeadVariants.homeEditorialPanel ?? "home-ui-copy mt-5"}>{t.publicationIntro}</p>
        <Link
          href={publicationHref}
          onClick={(event) => onRouteClick(event, publicationHref)}
          className="home-ui-action mt-8 inline-flex items-center gap-3 transition-colors hover:text-ambient-electric"
        >
          <span className="block h-px w-8 bg-ambient-electric" />
          {t.viewAllPublications}
        </Link>
      </div>
    </div>
  );
}

// ── Painel: Galeria Tréfle ────────────────────────────────────────
function PanelGaleria({
  lang,
  t,
  onRouteClick,
}: {
  lang: Lang;
  t: Copy;
  onRouteClick: (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const galleryHref = withLang("/galeria-trefle", lang);

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <Link
        href={galleryHref}
        onClick={(event) => onRouteClick(event, galleryHref)}
        className="relative flex-1 overflow-hidden bg-white lg:max-w-[55%]"
      >
        <div className="accent-line-2 flex h-full w-[14%] items-start justify-center pt-8">
          <span className="rotate-180 text-sm uppercase tracking-[0.18em] text-white [writing-mode:vertical-rl]">Julia</span>
        </div>
        <div className="absolute inset-0 left-[14%] overflow-hidden">
          <div className="absolute inset-0 bg-galeria-trefle-cover" />
          <div className="relative flex h-full flex-col justify-between p-8 text-white">
            <div>
              <p className={editorialAccentTitleVariants.galleryCover ?? "font-display text-[5rem] uppercase font-bold leading-[0.82] tracking-[-0.05em] lg:text-[7rem]"}>
                Galeria
                <span className="block">Tréfle<span className="text-ambient-limao">*</span></span>
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/75">Arte & Interiores</p>
            </div>
            <div className="grid gap-1 text-xs uppercase tracking-[0.18em] text-white/80">
              <span>Coleção 2026</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-center bg-ambient-micro p-10 lg:p-12">
        <p className={pageEyebrowClass}>Galeria</p>
        <h3 className={editorialAccentSubtitleVariants.galleryPanel ?? "mt-3 max-w-[28rem] font-display text-[3.6rem] uppercase leading-[0.82] tracking-[-0.045em] text-ambient-dark lg:text-[4.8rem]"}>
          Tréfle<span className="text-ambient-limao">*</span>
        </h3>
        <p className={pageLeadVariants.homeEditorialPanel ?? "home-ui-copy mt-5"}>{t.galleryIntro}</p>
        <Link
          href={galleryHref}
          onClick={(event) => onRouteClick(event, galleryHref)}
          className="home-ui-action mt-8 inline-flex items-center gap-3 transition-colors hover:text-ambient-electric"
        >
          <span className="block h-px w-8 bg-ambient-electric" />
          {t.galleryCta}
        </Link>
      </div>
    </div>
  );
}

// ── Painel: Escritório ────────────────────────────────────────────
function PanelEscritorio({
  lang,
  onOpenStudio,
}: {
  lang: Lang;
  onOpenStudio: () => void;
}) {
  const studio = getStudioContent(lang);
  const members: TeamMember[] = studio.team.map((member, index) => ({
    id: `${index + 1}`,
    name: member.name,
    role: member.role,
    image: member.image,
  }));

  return (
    <div
      className="flex h-full cursor-pointer flex-col justify-between overflow-auto bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_58%,rgba(29,79,95,0.08)_100%)]"
      onClick={onOpenStudio}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenStudio();
        }
      }}
    >
      {/* Título enorme */}
      <div className="px-8 pt-12 lg:px-12 lg:pt-14">
        <p className={pageEyebrowClass}>{studio.homeTitle}</p>
        <h2 className={displaySplitAccentVariants.homeStudioPanel ?? "mt-2 font-display text-[4rem] font-bold uppercase leading-[0.82] tracking-[-0.05em] text-ambient-dark sm:text-[5rem] lg:text-[7.5rem]"}>
          Uma equipe
          <span className={displaySplitAccentVariants.accentWord ?? "block italic text-ambient-electric"}>autoral.</span>
        </h2>
      </div>

      {/* Intro */}
      <div className="px-8 pt-8 lg:px-12">
        <p className={pageLeadVariants.homeStudioPanel ?? "max-w-[38rem] border-l-2 border-ambient-electric/40 pl-6 text-[1.05rem] leading-relaxed text-ambient-dark/70 lg:text-[1.2rem]"}>
          {studio.homeIntro}
        </p>
      </div>
      <TeamShowcase members={members} />

      {/* Lista da equipe */}
      <div className="border-t border-ambient-stone/30 px-8 py-8 lg:px-12">

      </div>
    </div>
  );
}

// ── Painel: Contato ───────────────────────────────────────────────
function PanelContato({ lang }: { lang: Lang }) {
  return <ContactShowcase lang={lang} variant="panel" animated={false} />;
}

// ── HomePanel principal ───────────────────────────────────────────
export function HomePanel({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const [active, setActive] = useState<Section>("projetos");
  const [isHomeEnterMasked, setIsHomeEnterMasked] = useState(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return false;
    return getPendingRouteShellTransition() === "home-enter";
  });
  const router = useRouter();
  const t = copy[lang];

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (getPendingRouteShellTransition() !== "home-enter") return;

    setIsHomeEnterMasked(true);
    const timer = window.setTimeout(() => {
      setIsHomeEnterMasked(false);
    }, 620);

    return () => window.clearTimeout(timer);
  }, []);

  const handleRouteClick = useCallback((event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (!href.startsWith("/")) return;
    setPendingRouteShellTransition("home-leave");
  }, []);

  const handlePanelRoute = useCallback((href: string) => {
    if (!href.startsWith("/")) return;
    setPendingRouteShellTransition("home-leave");
    router.push(href);
  }, [router]);

  const renderPanel = () => {
    switch (active) {
      case "projetos":    return <PanelProjetos projects={projects} lang={lang} t={t} onRouteClick={handleRouteClick} />;
      case "publicacao":  return <PanelPublicacao lang={lang} t={t} onRouteClick={handleRouteClick} />;
      case "galeria":     return <PanelGaleria lang={lang} t={t} onRouteClick={handleRouteClick} />;
      case "escritorio":  return <PanelEscritorio lang={lang} onOpenStudio={() => handlePanelRoute(withLang("/sobre", lang))} />;
      case "contato":     return <PanelContato lang={lang} />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      {/* ── Coluna esquerda ── */}
      <div
        className={`flex shrink-0 flex-col justify-between border-r border-ambient-stone/15 bg-ambient-micro px-8 pb-10 pt-32 transition-opacity duration-200 lg:w-64 lg:px-10 lg:pb-12 lg:pt-40 xl:w-72 ${
          isHomeEnterMasked ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {/* Intro */}
        <div>
          <p className="home-ui-kicker">
            Arquitetura & Interiores
          </p>
          <p className={sidebarIntroClass}>
            {t.intro}
          </p>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-1">
          {t.nav.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`group flex items-center gap-4 py-2 text-left transition-colors duration-200 ${
                active === item.id ? "text-ambient-dark" : "text-ambient-dark/64 hover:text-ambient-dark/84"
              }`}
            >
              {active === item.id ? (
                <span className="block shrink-0 transition-all duration-300"
                  style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid var(--color-ambient-electric)" }}
                />
              ) : (
                <span className="block h-px w-3 bg-ambient-stone/40 transition-all duration-300 group-hover:w-5 group-hover:bg-ambient-stone" />
              )}
              <span className={`home-ui-nav transition-all duration-300 ${
                active === item.id ? "font-medium text-ambient-electric" : ""
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Localização */}
        <p className="home-ui-location">
          Montes Claros, MG
        </p>
      </div>

      {/* ── Coluna direita: painel trocável ── */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
