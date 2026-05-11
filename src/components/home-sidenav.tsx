"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { withLang, type Lang } from "@/lib/i18n";
import { LocationBadge } from "@/components/location-badge";

type Section = "projetos" | "publicacao" | "galeria" | "escritorio" | "contato";

interface NavItem {
  id: Section;
  label: string;
}

const copy: Record<Lang, { nav: NavItem[]; intro: string; location: string }> = {
  pt: {
    intro: "Julia Fonseca Arquitetura desenvolve projetos residenciais, comerciais e de interiores com leitura contemporânea, presença visual forte e um senso de permanência.",
    nav: [
      { id: "projetos",   label: "Projetos"      },
      { id: "publicacao", label: "Publicação"     },
      { id: "galeria",    label: "Galeria Tréfle" },
      { id: "escritorio", label: "Escritório"     },
      { id: "contato",    label: "Contato"        },
    ],
    location: "Montes Claros · MG",
  },
  en: {
    intro: "Julia Fonseca Arquitetura develops residential, commercial and interior projects with a contemporary language, strong visual presence and a lasting sense of atmosphere.",
    nav: [
      { id: "projetos",   label: "Projects"      },
      { id: "publicacao", label: "Publication"   },
      { id: "galeria",    label: "Galeria Tréfle"},
      { id: "escritorio", label: "Studio"        },
      { id: "contato",    label: "Contact"       },
    ],
    location: "Montes Claros · MG",
  },
};

// ── SVG masks ──────────────────────────────────────────────────────────────
// Desktop: triângulo base-esquerda, ponta fechada à direita no meio.
// Lados retos, só a ponta tem uma curva pequena.
// Ajuste: ponta mais fechada — controles em 0.995 (quase no limite)
function DesktopMask() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <clipPath id="jf-tri-desktop" clipPathUnits="objectBoundingBox">
          {/* lados retos, curva só na ponta — ponta bem fechada */}
          <path d="M0,0 L0.97,0.44 C0.995,0.47 0.995,0.53 0.97,0.56 L0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function MobileMask() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <clipPath id="jf-tri-mobile" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0.46,0.03 C0.48,0.005 0.52,0.005 0.54,0.03 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ── Wipe layers ────────────────────────────────────────────────────────────
// As camadas entram da ESQUERDA (xPercent: -101 → 0) dentro do container
// triangular — assim o wipe revela o triângulo da esquerda para a direita,
// e cada cor aparece brevemente antes de ser coberta pela próxima.
// Ordem: cyan entra primeiro (delay 0), electric depois, preto por último e fica.
const WIPE_LAYERS = [
  { color: "#73bdd5", delay: 0,    zIndex: 1 }, // cyan claro — primeira a entrar
  { color: "#3a8aa6", delay: 0.12, zIndex: 2 }, // azul médio
  { color: "#111111", delay: 0.24, zIndex: 3 }, // preto  — última, permanece
];

const smoothEase = [0.65, 0.01, 0.05, 0.99] as const;

function desktopPanelVars(delay: number) {
  return {
    hidden:  { x: "-101%" },
    visible: {
      x: "0%",
      transition: { duration: 0.575, ease: smoothEase, delay },
    },
    exit: {
      x: "-101%",
      transition: { duration: 0.35, ease: smoothEase, delay: 0 },
    },
  };
}

function mobilePanelVars(delay: number) {
  return {
    hidden:  { y: "101%" },
    visible: {
      y: "0%",
      transition: { duration: 0.575, ease: smoothEase, delay },
    },
    exit: {
      y: "101%",
      transition: { duration: 0.35, ease: smoothEase, delay: 0 },
    },
  };
}

// Links sobem de yPercent 140 com leve rotação (estilo Osmo)
function linkVars(i: number) {
  return {
    hidden:  { yPercent: 140, rotate: 6, opacity: 0 },
    visible: {
      yPercent: 0, rotate: 0, opacity: 1,
      transition: { duration: 0.5, ease: smoothEase, delay: 0.52 + i * 0.055 },
    },
    exit: { yPercent: 40, opacity: 0, transition: { duration: 0.18 } },
  };
}

const fadeVars = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.85 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ── Indicador ativo: 3 setinhas coloridas ──────────────────────────────────
// Ficam antes do label e empurram o texto para frente.
// Os outros itens têm o mesmo espaço reservado (invisível) para manter alinhamento.
function ActiveArrows() {
  return (
    <span className="flex items-center gap-[2px] mr-2">
      <span style={{ width: 0, height: 0, borderTop: "3.5px solid transparent", borderBottom: "3.5px solid transparent", borderLeft: "5px solid #73bdd5" }} />
      <span style={{ width: 0, height: 0, borderTop: "3.5px solid transparent", borderBottom: "3.5px solid transparent", borderLeft: "5px solid #3a8aa6" }} />
      <span style={{ width: 0, height: 0, borderTop: "3.5px solid transparent", borderBottom: "3.5px solid transparent", borderLeft: "6px solid #ffffff" }} />
    </span>
  );
}


interface HomeSidenavProps {
  lang: Lang;
  active: Section;
  onSelect: (section: Section) => void;
  visible: boolean;
}

export function HomeSidenav({ lang, active, onSelect, visible }: HomeSidenavProps) {
  const t = copy[lang];

  return (
    <>
      <DesktopMask />
      <MobileMask />

      {/* ══ DESKTOP: container triangular com wipe ══════════════════════ */}
      <AnimatePresence>
        {visible && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden overflow-hidden lg:block"
            style={{ width: "460px", clipPath: "url(#jf-tri-desktop)" }}
          >
            {WIPE_LAYERS.map(({ color, delay, zIndex }) => (
              <motion.div
                key={color}
                variants={desktopPanelVars(delay)}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
                style={{ backgroundColor: color, zIndex }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ══ DESKTOP: conteúdo ══════════════════════════════════════════ */}
      <AnimatePresence>
        {visible && (
          // px-10 = 40px — mesmo alinhamento da logo no header (lg:-ml-10 + section-padding px-20 = ~40px efetivo)
          <div
            className="pointer-events-auto absolute inset-y-0 left-0 z-30 hidden flex-col justify-between pb-12 pt-[4.8rem] lg:flex"
            style={{ width: "260px", color: "white" }}
          >
            {/* Espaço superior — empurra nav para o meio */}
            <div />

            {/* Nav no meio + wordmark logo abaixo */}
            <div>
              <nav className="flex flex-col px-10">
                {t.nav.map((item, i) => (
                  <motion.button
                    key={item.id}
                    variants={linkVars(i)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="group flex w-full items-center py-[0.28rem] text-left"
                  >
                    {active === item.id && <ActiveArrows />}
                    {active === item.id ? (
                      <span className="font-display text-[1.3rem] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-white transition-colors duration-300 xl:text-[1.45rem]">
                        {item.label}
                      </span>
                    ) : (
                      <span className="font-display text-[1.3rem] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-white/50 transition-colors duration-300 group-hover:text-white/80 xl:text-[1.45rem]">
                        {item.label}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Wordmark — tamanho natural do arquivo, logo abaixo do nav */}
              <motion.div variants={fadeVars} initial="hidden" animate="visible" exit="exit" className="mt-6 px-10">
                <Link href={withLang("/", lang)} aria-label="JF Arquitetura" className="inline-block transition-opacity hover:opacity-70">
                  <Image
                    src="/images/brand/intro-assets/jf-wordmark-1x.png"
                    alt="JF Arquitetura"
                    width={160}
                    height={22}
                    priority
                    className="brightness-0 invert"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Localização */}
            <motion.div
              variants={fadeVars}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-10 lg:pl-16 xl:pl-20"
            >
              <LocationBadge label={t.location} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ MOBILE: container triangular subindo ════════════════════════ */}
      <AnimatePresence>
        {visible && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden lg:hidden"
            style={{ height: "52vh", clipPath: "url(#jf-tri-mobile)" }}
          >
            {WIPE_LAYERS.map(({ color, delay, zIndex }) => (
              <motion.div
                key={color}
                variants={mobilePanelVars(delay)}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
                style={{ backgroundColor: color, zIndex }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ══ MOBILE: conteúdo ════════════════════════════════════════════ */}
      <AnimatePresence>
        {visible && (
          <div
            className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex flex-col items-center justify-end pb-10 lg:hidden"
            style={{ height: "52vh" }}
          >
            <nav className="flex flex-col items-center">
              {t.nav.map((item, i) => (
                <div key={item.id} className="overflow-hidden">
                  <motion.button
                    variants={linkVars(i)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={`flex items-center py-[0.18rem] font-display text-[1.8rem] font-bold uppercase leading-[1.1] tracking-[-0.02em] transition-colors duration-300 ${
                      active === item.id ? "text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {active === item.id && <ActiveArrows />}
                    {item.label}
                  </motion.button>
                </div>
              ))}
            </nav>
            <motion.div
              variants={fadeVars}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-5"
            >
              <LocationBadge label={t.location} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
