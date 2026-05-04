import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import TeamShowcase, { type TeamMember } from "@/components/ui/team-showcase";
import { resolveLang, withLang } from "@/lib/i18n";
import { typographyTokenMap } from "@/lib/typography-system";
import { getStudioContent } from "@/lib/studio-content";
import { getImageBlurDataURL } from "@/lib/image-placeholder";

export const metadata: Metadata = {
  title: "Escritório",
  description:
    "Conheça Julia Fonseca, arquiteta especializada em projetos residenciais, comerciais e de interiores de alto padrão.",
};

export default function SobrePage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = resolveLang(searchParams?.lang);
  const t = getStudioContent(lang);
  const displaySplitAccentVariants = typographyTokenMap.displaySplitAccent.variants ?? {};
  const pageLeadVariants = typographyTokenMap.pageLead.variants ?? {};
  const pageEyebrowClass =
    typographyTokenMap.pageEyebrow.className ??
    "text-label uppercase text-ambient-canyon/55";
  const members: TeamMember[] = t.team.map((member, index) => ({
    id: `${index + 1}`,
    name: member.name,
    role: member.role,
    image: member.image,
  }));

  return (
    <div className="min-h-screen bg-ambient-micro text-ambient-dark">
      <section className="section-padding mx-auto w-full max-w-[118rem] pb-20 pt-40 md:pb-24 md:pt-52">
        <Reveal>
          <div className="mb-12 flex flex-col items-center gap-5">
            <span className="accent-line block h-12 w-[2px]" />
            <p className={pageEyebrowClass}>{t.eyebrow}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className={displaySplitAccentVariants.studioPage ?? "mx-auto max-w-[72rem] text-center font-display text-[4.5rem] uppercase leading-[0.82] tracking-[0.03em] text-ambient-dark sm:text-[6rem] md:text-[7rem]"}>
            {t.titleTop}
            <span className={displaySplitAccentVariants.accentWord ?? "block italic text-ambient-electric"}>{t.titleBottom}</span>
          </h1>
        </Reveal>
      </section>

      <section className="section-padding pb-24 md:pb-28">
        <div className="mx-auto grid max-w-[118rem] gap-14 xl:grid-cols-[0.47fr_0.53fr] xl:items-start">
          <Reveal>
            <div className="max-w-[40rem] xl:pt-10">
              <div className={pageLeadVariants.studioPage ?? "space-y-8 border-l border-ambient-stone pl-8 text-[1.22rem] leading-[1.85] text-ambient-dark/78"}>
                {t.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-14 max-w-[36rem]">
                <blockquote className="font-serif text-[1.65rem] leading-[1.7] text-ambient-dark">
                  “{t.quote}”
                </blockquote>
                <p className="mt-6 text-right text-label text-ambient-muted">{t.quoteAuthor}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-[38rem] xl:ml-auto">
              <div className="relative isolate overflow-hidden border border-ambient-stone/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(214,230,236,0.88))] p-4 shadow-[0_28px_70px_rgba(17,25,40,0.12)] md:p-5">
                <div className="pointer-events-none absolute inset-x-[8%] top-0 h-16 border-x border-b border-ambient-electric/18 bg-white/55 backdrop-blur-[2px]" />
                <div className="pointer-events-none absolute left-4 top-4 h-24 w-24 border-l border-t border-white/85 md:left-5 md:top-5 md:h-28 md:w-28" />
                <div className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 border-b border-r border-ambient-electric/45 md:bottom-5 md:right-5 md:h-28 md:w-28" />
                <div className="pointer-events-none absolute right-0 top-[18%] h-[34%] w-[18%] bg-[linear-gradient(180deg,rgba(33,179,225,0.22),rgba(33,179,225,0))]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[22%] w-[34%] bg-[linear-gradient(90deg,rgba(255,255,255,0.42),rgba(255,255,255,0))]" />

                <div className="relative aspect-[0.82/1] overflow-hidden bg-ambient-linen">
                  <div
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 24%, rgba(19,120,153,0.10) 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-10 h-[24%] w-[28%] border-r border-b border-white/60 bg-white/12 backdrop-blur-[1.5px]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute bottom-0 right-0 z-10 h-[22%] w-[30%] border-l border-t border-ambient-electric/28 bg-ambient-electric/8"
                    style={{
                      clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />

                  <Image
                    src="/images/julia-portrait.png"
                    alt={t.officeImageAlt}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 36rem"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={getImageBlurDataURL("#d6e5ea", "#7ea7b8", "#f3f7f8")}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding pb-28 md:pb-36">
        <div className="mx-auto max-w-[118rem]">
          <div className="mb-12 flex flex-col items-center gap-5">
            <span className="accent-line block h-12 w-[2px]" />
            <p className={pageEyebrowClass}>{t.teamTitle}</p>
          </div>

          <Reveal delay={0.06}>
            <TeamShowcase members={members} />
          </Reveal>

          <div className="mt-20 flex justify-end">
            <Link
              href={withLang("/contato", lang)}
              className="inline-flex items-center gap-5 text-xl uppercase tracking-[0.12em] text-ambient-muted transition-colors hover:text-ambient-electric"
            >
              <span className="block h-[2px] w-14 bg-ambient-electric" />
              {t.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
