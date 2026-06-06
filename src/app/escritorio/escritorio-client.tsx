"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { getStudioContent } from "@/lib/studio-content";
import { type Lang } from "@/lib/i18n";
import { typographyTokens } from "@/lib/typography-system";
import { getImageBlurDataURL } from "@/lib/image-placeholder";

const studioImages = [
  "/images/studio-gallery-01.jpg",
  "/images/studio-gallery-02.jpg",
  "/images/studio-gallery-03.jpg",
  "/images/studio-gallery-04.jpg",
  "/images/studio-gallery-05.png",
  "/images/studio-gallery-06.jpg",
  "/images/julia escritorio.webp",
];

function tokenClass(id: string, variant?: string, fallback = "") {
  const token = typographyTokens.find((item) => item.id === id);

  if (variant) {
    return token?.variants?.[variant] ?? fallback;
  }

  return token?.className ?? fallback;
}

const titleClass = tokenClass(
  "displaySplitAccent",
  "projectNarrative",
  "mb-8 font-display text-4xl uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.8rem]",
);

const accentTitleClass = tokenClass(
  "displaySplitAccent",
  "accentWord",
  "block italic text-ambient-electric",
);

export function EscritorioClient({ lang }: { lang: Lang }) {
  const content = getStudioContent(lang);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0.055);
  const boostRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;

    const lockPageScroll = () => {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    lockPageScroll();
    const lockFrame = requestAnimationFrame(lockPageScroll);
    window.addEventListener("jf:intro-complete", lockPageScroll);

    const onWheel = (event: WheelEvent) => {
      const target = event.target;
      const isImageWheel =
        target instanceof Element && Boolean(target.closest("[data-studio-rail-image]"));

      if (!isImageWheel) {
        return;
      }

      event.preventDefault();
      boostRef.current = Math.min(0.5, boostRef.current + Math.abs(event.deltaY) * 0.00085);
    };

    const animate = (time: number) => {
      const track = trackRef.current;
      const previous = lastTimeRef.current ?? time;
      const delta = Math.min(48, time - previous);
      lastTimeRef.current = time;

      if (track) {
        const loopHeight = track.scrollHeight / 2;
        const targetVelocity = 0.055 + boostRef.current;
        velocityRef.current += (targetVelocity - velocityRef.current) * 0.075;
        boostRef.current *= 0.965;

        offsetRef.current = (offsetRef.current + velocityRef.current * delta) % loopHeight;
        track.style.transform = `translate3d(0, -${offsetRef.current}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(lockFrame);
      window.removeEventListener("jf:intro-complete", lockPageScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  const team = content.team;
  const titleBottom = lang === "pt"
    ? content.titleBottom.replace(/^e\s+/i, "")
    : content.titleBottom.replace(/^&\s*/, "");

  return (
    <main className="fixed inset-0 h-[100svh] overflow-hidden bg-[#1a1d21] text-white selection:bg-ambient-electric/18">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(0,132,255,0.16),transparent_28%),radial-gradient(circle_at_75%_12%,rgba(91,246,255,0.08),transparent_24%),linear-gradient(115deg,rgba(255,255,255,0.035),transparent_36%)]"
      />

      <section className="site-shell-padding site-chrome-grid relative h-full max-lg:block">
        <aside className="relative -ml-12 hidden h-full w-[calc(100%+3rem)] overflow-hidden border-r border-white/10 bg-black/20 lg:block xl:-ml-14 xl:w-[calc(100%+3.5rem)] 2xl:-ml-16 2xl:w-[calc(100%+4rem)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#1a1d21]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#1a1d21]/80 to-transparent" />

          <div ref={trackRef} className="will-change-transform">
            {[...studioImages, ...studioImages].map((src, index) => (
              <figure
                key={`${src}-${index}`}
                data-studio-rail-image
                className="group relative h-[54svh] w-full overflow-hidden bg-black"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index < 3}
                  className="scale-[1.08] object-cover opacity-[0.72] grayscale transition duration-[900ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-[1.12] group-hover:opacity-100 group-hover:grayscale-0"
                  sizes="40vw"
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL()}
                />
              </figure>
            ))}
          </div>
        </aside>

        <div className="relative col-span-2 col-start-2 flex h-full min-h-0 flex-col pt-[clamp(6rem,10svh,7.4rem)] max-lg:px-0 max-lg:pt-[6.4rem]">
          <div className="max-w-[52rem]">
            <h1
              className={clsx(
                titleClass,
                "!mb-0 !text-[clamp(2.7rem,4.25vw,4.85rem)] !leading-[0.86] !tracking-[-0.055em] whitespace-nowrap",
              )}
            >
              {content.titleTop}
              <span className={clsx(accentTitleClass, "!inline pl-[0.22em] text-ambient-electric")}>
                {titleBottom}
              </span>
            </h1>

            <div className="mt-[clamp(1.35rem,2.2vw,2.1rem)] max-w-[35ch] text-[1.22rem] font-[400] leading-[1.34] tracking-[-0.01em] text-white/78 sm:text-[1.3rem] lg:text-[1.38rem] lg:leading-[1.32]">
              <div className="space-y-5 lg:space-y-6">
                {content.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="my-6 h-px w-full bg-white/24 lg:my-7" />
              <p className="font-display text-[0.88rem] uppercase leading-[1.42] tracking-[0.055em] text-white/54 lg:text-[0.94rem]">
                {content.quote}
                <span className="mt-3 block text-ambient-cyan/70">{content.quoteAuthor}</span>
              </p>
            </div>
          </div>

          <div className="mt-auto grid min-h-0 grid-cols-2 gap-x-[clamp(0.8rem,1.2vw,1.15rem)] gap-y-4 pt-[clamp(1.15rem,2vw,1.9rem)] md:grid-cols-4">
            {team.map((member, index) => (
              <article
                key={member.name}
                className="group grid min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-black/25"
              >
                <div className="relative aspect-[1.05] max-h-[21svh] min-h-[7.6rem] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="scale-[1.04] object-cover opacity-[0.78] grayscale transition duration-[850ms] ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:scale-[1.1] group-hover:opacity-100 group-hover:grayscale-0"
                    sizes="(max-width: 1024px) 50vw, 16vw"
                    placeholder="blur"
                    blurDataURL={getImageBlurDataURL()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent" />
                </div>
                <div className="grid grid-cols-[2.15rem_1fr] gap-x-3 border-t border-white/10 px-3.5 py-3.5">
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pt-[0.12rem] font-display text-[0.62rem] tracking-[0.16em] text-white/34",
                      index === 0 && "text-ambient-cyan/70",
                    )}
                  >
                    0{index + 1}
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="font-display text-[0.9rem] uppercase leading-[1.08] tracking-[-0.01em] text-white">
                      {member.name}
                    </p>
                    <p className="mt-1 font-display text-[0.62rem] uppercase leading-[1.25] tracking-[0.12em] text-white/56">
                      {member.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
