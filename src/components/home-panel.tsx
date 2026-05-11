"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";
import { withLang, type Lang } from "@/lib/i18n";
import { typographyTokenMap } from "@/lib/typography-system";
import { ContactShowcase } from "@/components/contact-showcase";
import { HomeSidenav } from "@/components/home-sidenav";
import { setPendingRouteShellTransition } from "@/lib/route-shell-transition";
import { getStudioContent } from "@/lib/studio-content";
import TeamShowcase, { type TeamMember } from "@/components/ui/team-showcase";

type Section = "projetos" | "publicacao" | "galeria" | "escritorio" | "contato";
type Copy = typeof copy[keyof typeof copy];
const displaySplitAccentVariants = typographyTokenMap.displaySplitAccent.variants ?? {};
const editorialAccentTitleVariants = typographyTokenMap.editorialAccentTitle.variants ?? {};
const editorialAccentSubtitleVariants = typographyTokenMap.editorialAccentSubtitle.variants ?? {};
const pageLeadVariants = typographyTokenMap.pageLead.variants ?? {};
const pageEyebrowClass =
  typographyTokenMap.pageEyebrow.className ??
  "text-label uppercase text-ambient-canyon/55";

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
  const viewAllHref = withLang("/projetos", lang);

  return (
    <div className="flex h-full flex-col bg-black">
      {/* Grid de projetos com scroll */}
      <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid grid-cols-2 gap-px bg-white/8 xl:grid-cols-3">
          {projects.map((project, i) => (
            <div key={project.slug} className="bg-black">
              <ProjectCard project={project} index={i} lang={lang} />
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex shrink-0 items-center justify-end border-t border-white/10 bg-black px-7 py-4">
        <Link
          href={viewAllHref}
          onClick={(event) => onRouteClick(event, viewAllHref)}
          className="inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-ambient-cyan"
        >
          <span className="block h-px w-6 bg-ambient-cyan" />
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
      <div className="flex flex-1 flex-col justify-center bg-black p-10 lg:p-12">
        <p className={pageEyebrowClass}>Publicação</p>
        <h3 className={editorialAccentSubtitleVariants.publicationPanel ?? "mt-3 font-display text-[2.2rem] uppercase leading-[0.88] tracking-[-0.02em] text-white"}>
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
      <div className="flex flex-1 flex-col justify-center bg-black p-10 lg:p-12">
        <p className={pageEyebrowClass}>Galeria</p>
        <h3 className={editorialAccentSubtitleVariants.galleryPanel ?? "mt-3 max-w-[28rem] font-display text-[3.6rem] uppercase leading-[0.82] tracking-[-0.045em] text-white lg:text-[4.8rem]"}>
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
        <h2 className={displaySplitAccentVariants.homeStudioPanel ?? "mt-2 font-display text-[4rem] font-bold uppercase leading-[0.82] tracking-[-0.05em] text-white sm:text-[5rem] lg:text-[7.5rem]"}>
          Uma equipe
          <span className={displaySplitAccentVariants.accentWord ?? "block italic text-ambient-electric"}>autoral.</span>
        </h2>
      </div>

      {/* Intro */}
      <div className="px-8 pt-8 lg:px-12">
        <p className={pageLeadVariants.homeStudioPanel ?? "max-w-[38rem] border-l-2 border-ambient-electric/40 pl-6 text-[1.05rem] leading-relaxed text-white/70 lg:text-[1.2rem]"}>
          {studio.homeIntro}
        </p>
      </div>
      <TeamShowcase members={members} />

      {/* Lista da equipe */}
      <div className="border-t border-white/10 px-8 py-8 lg:px-12">

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
  const [sidenavKey, setSidenavKey] = useState(0);
  const router = useRouter();
  const t = copy[lang];

  // Força remontagem do sidenav a cada vez que o HomePanel monta,
  // garantindo que a animação de wipe dispara ao voltar para a home.
  useEffect(() => {
    setSidenavKey(k => k + 1);
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
    <div className="relative h-screen overflow-hidden">
      {/* ── Painel trocável — ocupa tela inteira no desktop, topo no mobile ── */}
      <div className="absolute inset-0 lg:inset-0">
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

      {/* ── Sidenav com triângulo e wipe ── */}
      <HomeSidenav
        key={sidenavKey}
        lang={lang}
        active={active}
        onSelect={setActive}
        visible={true}
      />
    </div>
  );
}
