"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { BrandHeaderWordmark } from "./brand-mark";
import { FlipLink } from "@/components/ui/flip-links";
import { resolveLang, withLang } from "@/lib/i18n";
import siteConfig from "@/lib/metadata";

const copy = {
  pt: {
    nav: [
      { href: "/escritorio", label: "Escritório" },
      { href: "/projetos", label: "Projetos" },
      { href: "/publicacoes", label: "Publicações" },
      { href: "/galeria-trefle", label: "Galeria" },
      { href: "/contato", label: "Contato" },
    ],
    projectLinks: [
      { href: "/projetos?categoria=residencial", label: "Residencial" },
      { href: "/projetos?categoria=comercial", label: "Comercial" },
      { href: "/projetos?categoria=interiores", label: "Interiores" },
    ],
    contact: "Contato",
    menu: "Menu",
    close: "Fechar",
    open: "Abrir menu",
  },
  en: {
    nav: [
      { href: "/escritorio", label: "Studio" },
      { href: "/projetos", label: "Projects" },
      { href: "/publicacoes", label: "Publications" },
      { href: "/galeria-trefle", label: "Gallery" },
      { href: "/contato", label: "Contact" },
    ],
    projectLinks: [
      { href: "/projetos?categoria=residencial", label: "Residential" },
      { href: "/projetos?categoria=comercial", label: "Commercial" },
      { href: "/projetos?categoria=interiores", label: "Interiors" },
    ],
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    open: "Open menu",
  },
} as const;

function matchesMenuHref(pathname: string, searchKey: string, href: string) {
  const [targetPath, queryString = ""] = href.split("?");

  if (pathname !== targetPath) {
    return false;
  }

  if (!queryString) {
    return true;
  }

  const currentParams = new URLSearchParams(searchKey);
  const targetParams = new URLSearchParams(queryString);

  for (const [key, value] of Array.from(targetParams.entries())) {
    if (key === "lang") continue;
    if (currentParams.get(key) !== value) return false;
  }

  return true;
}

function AnimatedPillText({ label }: { label: string }) {
  return (
    <span aria-hidden="true" className="relative inline-block overflow-hidden whitespace-nowrap leading-[1.3]">
      {Array.from(label).map((char, index) => (
        <span
          key={`${label}-${index}`}
          className="relative inline-block translate-y-0 rotate-[0.001deg] transition-transform duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] [text-shadow:0_1.3em_currentColor] group-hover:-translate-y-[1.3em] group-focus-visible:-translate-y-[1.3em]"
          style={{
            transitionDelay: `${index * 10}ms`,
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

const headerPillClassName =
  "group relative inline-flex h-[2.55rem] items-center justify-center overflow-hidden rounded-full px-[1.05rem] font-display text-[0.84rem] font-[500] uppercase tracking-[0.08em] transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ambient-cyan md:h-[2.7rem] md:px-[1.15rem] md:text-[0.9rem] lg:h-[2.85rem] lg:px-[1.25rem] lg:text-[0.94rem]";

function pillToneClasses(tone: "dark" | "light") {
  return tone === "dark"
    ? {
      root: "text-white",
      bg: "bg-black",
      dot: "border-white/85",
    }
    : {
      root: "text-black",
      bg: "bg-[#f2f0eb]",
      dot: "border-black/85",
    };
}

function HeaderPillLink({
  href,
  label,
  tone,
  showDot,
}: {
  href: string;
  label: string;
  tone: "dark" | "light";
  showDot?: boolean;
}) {
  const toneClasses = pillToneClasses(tone);

  return (
    <Link
      href={href}
      aria-label={label}
      className={clsx(headerPillClassName, toneClasses.root)}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute inset-0 rounded-full transition-[inset] duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:inset-[0.125em] group-focus-visible:inset-[0.125em]",
          "pointer-events-none",
          toneClasses.bg,
        )}
      />
      <span className="relative z-10 flex items-center gap-4">
        <AnimatedPillText label={label} />
        {showDot && <span className={clsx("h-[0.4rem] w-[0.4rem] rounded-full border", toneClasses.dot)} />}
      </span>
    </Link>
  );
}

function HeaderPillButton({
  label,
  ariaLabel,
  tone,
  onClick,
  className,
}: {
  label: string;
  ariaLabel: string;
  tone: "dark" | "light";
  onClick: () => void;
  className?: string;
}) {
  const toneClasses = pillToneClasses(tone);

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(headerPillClassName, "transition-all duration-700", toneClasses.root, className)}
      aria-label={ariaLabel}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute inset-0 rounded-full transition-[inset] duration-[600ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:inset-[0.125em] group-focus-visible:inset-[0.125em]",
          "pointer-events-none",
          toneClasses.bg,
        )}
      />
      <span className="relative z-10 flex items-center">
        <AnimatedPillText label={label} />
      </span>
    </button>
  );
}

function ProjectFilterLink({
  href,
  label,
  lang,
  active,
  onClick,
}: {
  href: string;
  label: string;
  lang: "pt" | "en";
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={withLang(href, lang)}
      onClick={onClick}
      className={clsx(
        "inline-flex w-fit uppercase tracking-[0.14em] transition-colors focus-visible:outline-none",
        active ? "text-white" : "text-white/52 hover:text-white",
      )}
    >
      <span className="text-[0.76rem] font-medium transition-colors duration-300 md:text-[0.84rem]">
        {label}
      </span>
    </Link>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = resolveLang(searchParams.get("lang"));
  const labels = copy[lang];
  const searchKey = searchParams.toString();
  const centerLinks = labels.nav.filter((link) => link.href !== "/contato");
  const navIsCompact = scrolled || isOpen;
  const isProjectDetail = /^\/(?:residencial|comercial|interiores)\/.+/.test(pathname);

  useEffect(() => {
    const showNav = () => setNavReady(true);
    const fallback = window.setTimeout(showNav, 3600);
    window.addEventListener("jf:intro-complete", showNav);
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("jf:intro-complete", showNav);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchKey]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((value) => !value), []);

  const switchLang = (nextLang: "pt" | "en") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    const nextHref = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    setIsOpen(false);
    router.push(nextHref);
  };

  return (
    <>
      <header className="site-shell-padding fixed left-0 right-0 top-0 z-[100] text-white">
        <nav className="site-chrome-grid site-chrome-grid--center h-[3.45rem] md:h-[3.65rem] lg:h-[3.85rem]">
          <div className="relative z-[101] flex min-w-0 items-center">
            <div
              className={clsx(
                "transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                navReady && (!navIsCompact || isOpen) ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0",
              )}
            >
              <BrandHeaderWordmark lang={lang} inverted />
            </div>
          </div>

          <div
            className={clsx(
              "site-nav-links hidden min-w-0 transition-[transform,opacity] duration-700 lg:flex",
              navIsCompact || isOpen ? "pointer-events-none -translate-x-3 opacity-0" : "translate-x-0 opacity-100",
            )}
          >
            {centerLinks.map((link, index) => (
              <div
                key={link.href}
                className={clsx(
                  "flex items-center gap-[0.35rem] transition-all duration-500 ease-out",
                  !navReady && "translate-y-[200%]",
                )}
                style={{
                  transitionDelay: navReady ? (navIsCompact ? `${index * 20}ms` : `${120 + index * 45}ms`) : "0ms",
                }}
              >
                <FlipLink
                  href={withLang(link.href, lang)}
                  label={link.label}
                  lineHeight={1}
                  textClassName={clsx(
                    "site-nav-link",
                    matchesMenuHref(pathname, searchKey, link.href) ? "text-white" : "text-white/82",
                  )}
                  hoverTextClassName="site-nav-link text-ambient-cyan"
                  staggerMs={8}
                />
                {index < centerLinks.length - 1 && (
                  <span aria-hidden="true" className="text-[0.55rem] leading-none text-white/32">
                    ▸
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="relative z-[101] flex items-center justify-end gap-2.5 overflow-hidden">
            <div
              className={clsx(
                "overflow-hidden transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                navReady && !isOpen ? "translate-y-0" : "translate-y-[120%]",
              )}
            >
              <HeaderPillLink href={withLang("/contato", lang)} label={labels.contact} tone="dark" showDot />
            </div>

            <div
              className={clsx(
                "overflow-hidden transition-[max-width,transform,opacity] duration-700 ease-[cubic-bezier(0.625,0.05,0,1)]",
                navIsCompact
                  ? "max-w-[10rem] translate-x-0 opacity-100"
                  : "max-w-[10rem] opacity-100 lg:pointer-events-none lg:max-w-0 lg:translate-x-5 lg:opacity-0",
              )}
            >
              <HeaderPillButton
                label={isOpen ? labels.close : labels.menu}
                onClick={toggleMenu}
                tone="light"
                ariaLabel={isOpen ? labels.close : labels.open}
                className={clsx(
                  "lg:ml-1 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  navReady && navIsCompact ? "translate-y-0" : "translate-y-[120%]",
                )}
              />
            </div>
          </div>
        </nav>

        {isProjectDetail && !navIsCompact && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-8 right-8 top-[5.65rem] h-px bg-white/14 md:left-9 md:right-9 md:top-[5.95rem] lg:left-12 lg:right-12 lg:top-[6.35rem] xl:left-14 xl:right-14 2xl:left-16 2xl:right-16"
          />
        )}
      </header>

      <div
        className={clsx(
          "fixed inset-0 z-[95] overflow-hidden bg-black text-white transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.22,1)]",
          isOpen
            ? "pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
            : "pointer-events-none [clip-path:polygon(0_0,100%_0,100%_0,0_0)]",
        )}
        onClick={close}
      >
        <div
          className={clsx(
            "site-shell-padding relative z-10 flex h-full flex-col pb-10 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.22,1)]",
            isOpen ? "translate-y-0" : "translate-y-6",
          )}
          onClick={(event) => event.stopPropagation()}
        >

          <div className="flex min-h-0 flex-1 items-center justify-start">
            <div className="w-full max-w-[54rem]">
              <div className="relative z-20 flex flex-col items-start gap-3 md:gap-4">
                {labels.nav.map((link) => (
                  <div key={link.href}>
                    <FlipLink
                      href={withLang(link.href, lang)}
                      label={link.label}
                      onClick={close}
                      className="max-w-full"
                      textClassName={clsx(
                        "font-display text-[2rem] font-[450] uppercase leading-[0.92] tracking-[0.01em] sm:text-[2.45rem] lg:text-[3rem] xl:text-[3.25rem]",
                        matchesMenuHref(pathname, searchKey, link.href) ? "text-white" : "text-white/80",
                      )}
                      hoverTextClassName="font-display text-[2rem] font-[450] uppercase leading-[0.92] tracking-[0.01em] text-ambient-cyan sm:text-[2.45rem] lg:text-[3rem] xl:text-[3.25rem]"
                    />

                    {link.href === "/projetos" && (
                      <div className="ml-0 mt-3 flex flex-wrap gap-x-5 gap-y-2 md:mt-4 md:gap-x-6">
                        {labels.projectLinks.map((projectLink) => (
                          <ProjectFilterLink
                            key={projectLink.href}
                            href={projectLink.href}
                            label={projectLink.label}
                            lang={lang}
                            active={matchesMenuHref(pathname, searchKey, projectLink.href)}
                            onClick={close}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-between gap-6 text-[0.74rem] uppercase tracking-normal text-white/62">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ambient-cyan"
            >
              Instagram
            </a>
            <div className="flex items-center gap-3 font-display text-[1rem]">
              <button
                type="button"
                onClick={() => switchLang("pt")}
                className={clsx("transition-colors", lang === "pt" ? "text-white" : "hover:text-ambient-cyan")}
              >
                PT
              </button>
              <span className="text-white/35">/</span>
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={clsx("transition-colors", lang === "en" ? "text-white" : "hover:text-ambient-cyan")}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
