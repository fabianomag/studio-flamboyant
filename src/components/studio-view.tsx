"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale, LocalizedSiteContent } from "@/content/site";

export function StudioView({
  copy,
  locale,
}: {
  copy: LocalizedSiteContent["studio"];
  locale: Locale;
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.body.classList.add("studio-viewport");
    return () => {
      document.body.classList.remove("studio-viewport");
    };
  }, []);

  const loopedMedia = [...copy.media, ...copy.media];
  const mediaControlLabel = paused
    ? locale === "pt" ? "Continuar imagens" : "Resume images"
    : locale === "pt" ? "Pausar imagens" : "Pause images";

  return (
    <article className="studio-page">
      <aside
        className="studio-media"
        aria-label={locale === "pt" ? "Imagens do escritório" : "Studio images"}
      >
        <div className="studio-media__track" data-paused={paused}>
          {loopedMedia.map((media, index) => {
            const duplicate = index >= copy.media.length;
            const leadImage = index % copy.media.length === 0;

            return (
              <figure key={`${media.src}-${index}`} aria-hidden={duplicate || undefined}>
                <Image
                  src={media.src}
                  alt={duplicate ? "" : media.alt}
                  fill
                  priority={index === 0}
                  loading={leadImage ? "eager" : undefined}
                  fetchPriority={index === 0 ? "high" : undefined}
                  sizes="(max-width: 960px) 100vw, 50vw"
                />
                <figcaption className="eyebrow">{media.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </aside>

      <button
        className="studio-media__control"
        type="button"
        data-paused={paused}
        aria-pressed={paused}
        aria-label={mediaControlLabel}
        onClick={() => setPaused((value) => !value)}
      >
        <i aria-hidden="true" />
      </button>

      <section
        className="studio-copy"
        aria-label={locale === "pt" ? "Sobre o escritório" : "About the studio"}
      >
        <div className="studio-copy__inner">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <div className="studio-manifesto">
            {copy.manifesto.slice(0, 1).map((paragraph) => (
              <p key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <section className="studio-principles" aria-label={copy.principlesLabel}>
            {copy.principles.map((principle) => (
              <article key={principle.number}>
                <span className="eyebrow">{principle.number}</span>
                <div>
                  <h2>{principle.title}</h2>
                  <p>{principle.body}</p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </article>
  );
}
