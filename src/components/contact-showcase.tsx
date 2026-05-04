"use client";

import type { ReactNode } from "react";
import siteConfig from "@/lib/metadata";
import { type Lang } from "@/lib/i18n";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ContactActionRows } from "@/components/contact-action-rows";

const copy = {
  pt: {
    eyebrow: "Contato",
    titleTop: "Vamos",
    titleBottom: "conversar.",
    intro:
      "Cada projeto começa com uma conversa. Conte o que você imagina, ou mesmo só uma ideia solta, e a gente descobre juntos se faz sentido.",
    whatsappMessage: "Olá Julia! Vi seu site e gostaria de conversar sobre um projeto.",
    base: "Base",
    copyHint: "Clique para copiar",
    copyEmail: "Copiar e-mail",
    openEmail: "Abrir mail app",
    copyPhone: "Copiar número",
    openWhatsapp: "Abrir WhatsApp",
    copyInstagram: "Copiar @",
    openInstagram: "Abrir Instagram",
  },
  en: {
    eyebrow: "Contact",
    titleTop: "Let's",
    titleBottom: "talk.",
    intro:
      "Every project starts with a conversation. Tell us what you are imagining, or even just a loose idea, and we can see together if it makes sense.",
    whatsappMessage: "Hello Julia! I saw your website and would like to talk about a project.",
    base: "Base",
    copyHint: "Click to copy",
    copyEmail: "Copy e-mail",
    openEmail: "Open mail app",
    copyPhone: "Copy number",
    openWhatsapp: "Open WhatsApp",
    copyInstagram: "Copy @",
    openInstagram: "Open Instagram",
  },
} as const;

function maybeReveal(children: ReactNode, animated: boolean, delay = 0) {
  if (!animated) return <>{children}</>;
  return <Reveal delay={delay}>{children}</Reveal>;
}

const pageEyebrowClass = "text-label uppercase text-ambient-canyon/55";

export function ContactShowcase({
  lang,
  variant = "page",
  animated = variant === "page",
}: {
  lang: Lang;
  variant?: "page" | "panel";
  animated?: boolean;
}) {
  const t = copy[lang];
  const isPanel = variant === "panel";
  const rows = [
    {
      label: "WhatsApp",
      value: "+55 (38) 99266-5556",
      hint: t.copyHint,
      icon: "whatsapp" as const,
      copyValue: "+55 38 99266-5556",
      actions: [
        { type: "copy" as const, label: t.copyPhone, value: "+55 38 99266-5556" },
        {
          type: "link" as const,
          label: t.openWhatsapp,
          href: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`,
        },
      ],
    },
    {
      label: "Email",
      value: siteConfig.email,
      hint: t.copyHint,
      icon: "email" as const,
      copyValue: siteConfig.email,
      actions: [
        { type: "copy" as const, label: t.copyEmail, value: siteConfig.email },
        { type: "link" as const, label: t.openEmail, href: `mailto:${siteConfig.email}` },
      ],
    },
    {
      label: "Instagram",
      value: "@juliafonseca.arq",
      hint: t.copyHint,
      icon: "instagram" as const,
      copyValue: "@juliafonseca.arq",
      actions: [
        { type: "copy" as const, label: t.copyInstagram, value: "@juliafonseca.arq" },
        { type: "link" as const, label: t.openInstagram, href: siteConfig.instagram },
      ],
    },
  ];

  return (
    <div
      className={
        isPanel
          ? "flex h-full overflow-hidden bg-ambient-micro text-ambient-dark"
          : "min-h-screen bg-ambient-micro text-ambient-dark"
      }
    >
      {isPanel && (
        <div className="hidden w-[38%] shrink-0 items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,rgba(29,79,95,0.07)_100%)] px-8 lg:flex">
          <div className="relative w-full max-w-[30rem]">
            <div className="pointer-events-none absolute -left-4 top-[8%] h-32 w-32 rounded-full bg-ambient-electric/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-[12%] h-28 w-28 rounded-full bg-white/80 blur-2xl" />
            <div className="pointer-events-none absolute left-[14%] top-[4%] h-[86%] w-[72%] rounded-[42%_58%_49%_51%/56%_42%_58%_44%] border border-white/45" />
            <Image
              src="/images/julia-office.webp"
              alt="Julia Fonseca"
              width={448}
              height={560}
              className="mx-auto max-w-[28rem] rounded-[42%_58%_49%_51%/56%_42%_58%_44%] object-cover object-center drop-shadow-[0_30px_60px_rgba(17,25,40,0.16)]"
            />
          </div>
        </div>
      )}
      <section
        className={`relative z-10 ${
          isPanel
            ? "flex flex-1 items-center overflow-y-auto px-10 py-14 sm:px-12 lg:px-16 xl:px-20"
            : "pb-28 pt-40 section-padding md:pb-36 md:pt-52"
        }`}
      >
        <div className={`mx-auto w-full ${isPanel ? "max-w-[72rem]" : "max-w-7xl"}`}>
          {maybeReveal(
            <>
              <p className={`mb-6 ${pageEyebrowClass}`}>{t.eyebrow}</p>
              <h1
                className={
                  isPanel
                    ? (splitAccentVariants.contactPanel ??
                      "font-display uppercase leading-[0.78] tracking-[-0.08em] text-ambient-dark text-[16vw] sm:text-[5.2rem] xl:text-[6.4rem]")
                    : (splitAccentVariants.contactPage ??
                      "font-display uppercase leading-[0.78] tracking-[-0.08em] text-ambient-dark text-[22vw] sm:text-[14vw] lg:text-[9rem]")
                }
              >
                {t.titleTop}
                <span className={splitAccentVariants.accentWord ?? "block italic text-ambient-electric"}>{t.titleBottom}</span>
              </h1>
            </>,
            animated,
          )}

          {maybeReveal(
            <p
              className={`border-l border-ambient-stone text-ambient-canyon/82 ${
                isPanel
                  ? (pageLeadVariants.contactPanel ??
                    "mt-7 max-w-[48rem] pl-6 text-[1rem] leading-relaxed sm:text-[1.12rem] xl:text-[1.2rem]")
                  : (pageLeadVariants.contactPage ??
                    "mt-10 max-w-2xl pl-8 text-xl leading-relaxed sm:text-2xl")
              }`}
            >
              {t.intro}
            </p>,
            animated,
            0.15,
          )}

          {maybeReveal(<ContactActionRows lang={lang} rows={rows} variant={variant} />, animated, 0.2)}

          {maybeReveal(
            <div className={isPanel ? "pt-8" : "py-8"}>
              <div className={`flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8`}>
                <span className="w-28 text-xs uppercase tracking-[0.3em] text-ambient-canyon/50">{t.base}</span>
                <span
                  className={`font-display uppercase leading-[0.84] tracking-[-0.05em] text-ambient-dark/75 ${
                    isPanel ? "text-[2rem] sm:text-[3rem] xl:text-[3.6rem]" : "text-[2.6rem] sm:text-[4.5rem]"
                  }`}
                >
                  {siteConfig.location.city}, {siteConfig.location.state}
                </span>
              </div>
            </div>,
            animated,
            0.5,
          )}
        </div>
      </section>
    </div>
  );
}
