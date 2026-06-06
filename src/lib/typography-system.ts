export type SemanticTag =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "span"
  | "a"
  | "button"
  | "dt"
  | "dd";

export type TypographyTokenGroup =
  | "page-structure"
  | "display-split-accent"
  | "editorial-accent"
  | "detail-micro"
  | "home-overlay"
  | "project-detail"
  | "project-navigation";

export interface TypographyToken {
  id: string;
  group: TypographyTokenGroup;
  purpose: string;
  recommendedTags: SemanticTag[];
  seoNote: string;
  currentStyle: string;
  className?: string;
  variants?: Record<string, string>;
  currentExamples: string[];
  currentReferences: string[];
  notes?: string[];
}

export const typographySystemGuidelines = [
  "Visual pattern and semantic tag are separate decisions.",
  "The real page subject should own the H1, not necessarily the small eyebrow text.",
  "This file is an inventory-first source of truth. It should not be wired globally until each token is approved in context.",
  "Sidebar institutional copy is an intentional exception and should not be merged into the main page lead by default.",
  "Project detail pages are already highly standardized; changes there should stay local unless the same pattern clearly repeats elsewhere.",
] as const;

export const typographyTokens: TypographyToken[] = [
  {
    id: "pageEyebrow",
    group: "page-structure",
    purpose: "Small page label above the main heading area.",
    recommendedTags: ["p", "span"],
    seoNote: "Do not use as H1 by default. It is a context label, not the main page topic.",
    currentStyle: [
      'Contact: "text-label uppercase text-ambient-canyon/55"',
      'Gallery: "text-label text-ambient-muted"',
      'Home panel kicker anchor: ".home-ui-kicker" in globals.css',
    ].join(" | "),
    currentExamples: ["Contato", "Galeria", "Publicacao"],
    currentReferences: [
      "src/components/contact-showcase.tsx",
      "src/app/galeria-trefle/page.tsx",
      "src/app/globals.css",
    ],
    notes: [
      "We want this family standardized even if exact color differs per page.",
      "Publication page currently lacks a dedicated eyebrow block and may adopt this token later.",
    ],
    className: "text-label uppercase text-ambient-canyon/55",
  },
  {
    id: "pageHeroTitle",
    group: "page-structure",
    purpose: "Main heading of a standalone page.",
    recommendedTags: ["h1"],
    seoNote: "Preferred H1 for standalone pages such as gallery, publications index, contact, and studio.",
    currentStyle:
      'Varies by page. Typical base is "font-display uppercase" with large scale and tight tracking.',
    currentExamples: ["Galeria Trefle", "Publicacoes", "Contato"],
    currentReferences: [
      "src/app/galeria-trefle/page.tsx",
      "src/app/publicacoes/page.tsx",
      "src/components/contact-showcase.tsx",
    ],
    notes: [
      "In Contact, the visual hero may be different from the semantic H1.",
      "We may later render one visual pattern with different semantic tags depending on context.",
    ],
  },
  {
    id: "pageLead",
    group: "page-structure",
    purpose: "Main descriptive paragraph for a page intro.",
    recommendedTags: ["p"],
    seoNote: "Primary supporting copy under the page heading; important for page clarity and keyword context.",
    currentStyle: [
      'Preferred reference: Contact lead uses border-left inside the floating white card: page "mt-6 max-w-[36rem] border-l border-black/14 pl-5 text-[1rem] leading-relaxed text-black/68 sm:text-[1.08rem]"; panel "mt-6 max-w-[34rem] border-l border-black/14 pl-5 text-[1rem] leading-relaxed text-black/68 sm:text-[1.05rem]"',
      'Related utility: ".quiet-serif" exists but is a different editorial voice.',
    ].join(" | "),
    currentExamples: [
      "Cada projeto comeca com uma conversa...",
      "Uma extensao curatorial do escritorio...",
      "Veja os cadernos do estudio...",
    ],
    currentReferences: [
      "src/components/contact-showcase.tsx",
      "src/app/galeria-trefle/page.tsx",
      "src/components/publications-gallery.tsx",
    ],
    notes: [
      "Contact is the preferred size reference for future unification.",
      "Sidebar intro should stay separate from this token.",
    ],
    variants: {
      contactPage:
        "mt-5 max-w-[32rem] border-l border-black/14 pl-5 text-[0.96rem] leading-relaxed text-black/68 sm:text-[1.02rem]",
      contactPanel:
        "mt-5 max-w-[30rem] border-l border-black/14 pl-5 text-[0.95rem] leading-relaxed text-black/68 sm:text-[1rem]",
      homeStudioPanel:
        "mt-7 max-w-[48rem] border-l border-ambient-stone pl-6 text-[1rem] leading-relaxed text-ambient-canyon/82 sm:text-[1.12rem] xl:text-[1.2rem]",
      homeEditorialPanel:
        "mt-7 max-w-[48rem] border-l border-ambient-stone pl-6 text-[1rem] leading-relaxed text-ambient-canyon/82 sm:text-[1.12rem] xl:text-[1.2rem]",
      publicationsIndexIntro:
        "mx-auto max-w-2xl border-l border-ambient-stone pl-8 text-xl leading-relaxed text-white/78 sm:text-2xl",
      studioPage:
        "space-y-8 border-l border-ambient-stone pl-8 text-[1.22rem] leading-[1.85] text-white/78",
      galleryPageIntro:
        "mt-6 font-serif text-[1.18rem] leading-[1.9] text-white/76",
      galleryPageBody:
        "font-serif text-[1.18rem] leading-[1.9] text-white/76",
    },
  },
  {
    id: "sidebarIntro",
    group: "page-structure",
    purpose: "Compact institutional paragraph used persistently in the left sidebar of the home.",
    recommendedTags: ["p"],
    seoNote: "Useful brand context, but not a hero lead. Keep secondary in hierarchy.",
    currentStyle: 'Utility ".home-ui-copy" in globals.css',
    currentExamples: [
      "Julia Fonseca Arquitetura desenvolve projetos residenciais...",
    ],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/app/globals.css",
    ],
    notes: [
      "Intentional exception from pageLead.",
      "If another compact institutional intro appears elsewhere, it should likely join this family.",
    ],
    className: "home-ui-copy mt-5",
  },
  {
    id: "displaySplitAccent",
    group: "display-split-accent",
    purpose: "Large split title with accent-colored italic second line.",
    recommendedTags: ["h1", "h2"],
    seoNote: "Use as H1 on standalone pages when it is the real page subject; use as H2 inside home panels or secondary narrative sections.",
    currentStyle: [
      'Contact hero base inside white card: "font-display uppercase leading-[0.8] tracking-[-0.08em] text-black"',
      'Contact sizes: page "text-[3.35rem] sm:text-[4.6rem] lg:text-[5.3rem]"; panel "text-[3rem] sm:text-[3.8rem] xl:text-[4.6rem]"',
      'Studio panel title: "mt-2 font-display text-[4rem] font-bold uppercase leading-[0.82] tracking-[-0.05em] text-white sm:text-[5rem] lg:text-[7.5rem]"',
      'Accent word: "block italic text-ambient-electric"',
      'Project narrative title: "mb-8 font-display text-4xl uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.8rem]"',
    ].join(" | "),
    currentExamples: [
      "Vamos / conversar.",
      "Uma equipe / autoral.",
      "Materia, luz / e permanencia.",
    ],
    currentReferences: [
      "src/components/contact-showcase.tsx",
      "src/components/home-panel.tsx",
      "src/components/project-page.tsx",
    ],
    notes: [
      "This is the strongest candidate for a shared runtime component later.",
    ],
    variants: {
      contactPage:
        "mt-6 font-display uppercase leading-[0.82] tracking-normal text-black text-[2.75rem] sm:text-[3.35rem]",
      contactPanel:
        "mt-6 font-display uppercase leading-[0.82] tracking-normal text-black text-[2.55rem] sm:text-[3.1rem]",
      homeStudioPanel:
        "font-display uppercase leading-[0.78] tracking-[-0.08em] text-white text-[16vw] sm:text-[5.2rem] xl:text-[6.4rem]",
      studioPage:
        "mx-auto max-w-[72rem] text-center font-display text-[4.5rem] uppercase leading-[0.82] tracking-[0.03em] text-white sm:text-[6rem] md:text-[7rem]",
      projectNarrative:
        "mb-8 font-display text-4xl uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.8rem]",
      accentWord: "block italic text-ambient-electric",
    },
  },
  {
    id: "editorialAccentTitle",
    group: "editorial-accent",
    purpose: "Large artistic title placed inside the publication or gallery visual cover.",
    recommendedTags: ["h2"],
    seoNote: "Inside the home it should act as a section-level heading, not the page H1.",
    currentStyle:
      'Home cover title: "font-display text-[5rem] uppercase font-bold leading-[0.82] tracking-[-0.05em] lg:text-[7rem]" + colored accent mark',
    currentExamples: ["Galeria Trefle*", "Caderno Azul*"],
    currentReferences: [
      "src/components/home-panel.tsx",
    ],
    notes: [
      "Text changes, but scale logic and accent mark behavior should stay aligned.",
    ],
    variants: {
      publicationCover:
        "font-display text-[5rem] uppercase font-bold leading-[0.82] tracking-[-0.05em] lg:text-[7rem]",
      galleryCover:
        "font-display text-[5rem] uppercase font-bold leading-[0.82] tracking-[-0.05em] lg:text-[7rem]",
    },
  },
  {
    id: "editorialAccentSubtitle",
    group: "editorial-accent",
    purpose: "Artistic supporting title shown beside the large cover visual in the home panel.",
    recommendedTags: ["h3", "p"],
    seoNote: "Use h3 only when it adds real structure; if it merely repeats the same concept, a paragraph or span may be cleaner.",
    currentStyle: [
      'Publication panel: "mt-3 font-display text-[2.2rem] uppercase leading-[0.88] tracking-[-0.02em] text-white"',
      'Gallery panel: "mt-3 max-w-[28rem] font-display text-[3.6rem] uppercase leading-[0.82] tracking-[-0.045em] text-white lg:text-[4.8rem]"',
    ].join(" | "),
    currentExamples: ["Trefle*", "Caderno Azul*"],
    currentReferences: [
      "src/components/home-panel.tsx",
    ],
    notes: [
      "Same family, but current scale is not identical between Publication and Gallery.",
    ],
    variants: {
      publicationPanel:
        "mt-3 max-w-[28rem] font-display text-[3.6rem] uppercase leading-[0.82] tracking-[-0.045em] text-white lg:text-[4.8rem]",
      galleryPanel:
        "mt-3 max-w-[28rem] font-display text-[3.6rem] uppercase leading-[0.82] tracking-[-0.045em] text-white lg:text-[4.8rem]",
    },
  },
  {
    id: "accentMark",
    group: "editorial-accent",
    purpose: "Colored accent marker attached to an artistic title.",
    recommendedTags: ["span"],
    seoNote: "Purely visual accent; should never carry heading responsibility on its own.",
    currentStyle: 'Gallery uses "text-ambient-limao"; Publication uses "text-ambient-cyan"',
    currentExamples: ["*", "*"],
    currentReferences: [
      "src/components/home-panel.tsx",
    ],
  },
  {
    id: "detailMicroLabel",
    group: "detail-micro",
    purpose: "Small uppercase label for context, section detail, or inline support metadata.",
    recommendedTags: ["p", "span", "dt"],
    seoNote: "Supportive only; should not replace the main heading hierarchy.",
    currentStyle: [
      'Common references: "text-xs uppercase tracking-[0.3em]" and "text-[0.72rem] uppercase tracking-[0.22em]"',
      'Home anchors: ".home-ui-kicker", ".home-ui-meta", ".home-ui-location", ".home-ui-overlay-meta"',
    ].join(" | "),
    currentExamples: [
      "Arquitetura & Interiores",
      "Julia",
      "Arte & Interiores",
      "Edicao 01",
      "2026",
      "Colecao 2026",
      "Clique para copiar",
    ],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/components/contact-action-rows.tsx",
      "src/components/project-page.tsx",
      "src/app/globals.css",
    ],
  },
  {
    id: "detailMicroMeta",
    group: "detail-micro",
    purpose: "Small uppercase metadata line with multiple items or bullet separators.",
    recommendedTags: ["p", "span"],
    seoNote: "Metadata support for cards and editorial modules.",
    currentStyle:
      'Examples include "mt-3 text-xs uppercase tracking-[0.16em] text-white/75" and utility ".home-ui-overlay-meta"',
    currentExamples: [
      "Arquitetura • Interiores • Escritorio",
      "Residencial · 2024",
      "Interiores · 2024",
    ],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/app/globals.css",
    ],
  },
  {
    id: "detailMicroAction",
    group: "detail-micro",
    purpose: "Small uppercase action text used in buttons and lightweight links.",
    recommendedTags: ["a", "button", "span"],
    seoNote: "Navigation and action affordance only.",
    currentStyle: [
      'Action buttons in contact rows use "text-[0.72rem] uppercase tracking-[0.2em]" with responsive tweaks',
      'Home action utilities: ".home-ui-action" and ".home-ui-overlay-action"',
      'Project strip action text: "text-[0.72rem] uppercase tracking-[0.18em]"',
    ].join(" | "),
    currentExamples: [
      "Copiar numero",
      "Abrir WhatsApp",
      "Ver projeto",
      "Ver todos os projetos",
    ],
    currentReferences: [
      "src/components/contact-action-rows.tsx",
      "src/components/home-panel.tsx",
      "src/components/project-strip-carousel.tsx",
      "src/components/project-page.tsx",
      "src/app/globals.css",
    ],
  },
  {
    id: "detailMicroRole",
    group: "detail-micro",
    purpose: "Role and function label under a person name.",
    recommendedTags: ["p", "span"],
    seoNote: "Team metadata only.",
    currentStyle:
      'Team showcase role line: "mt-1.5 pl-[27px] text-[7px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"',
    currentExamples: [
      "Socio-fundadora",
      "Arquiteta coordenadora",
      "Estagiaria",
    ],
    currentReferences: [
      "src/components/ui/team-showcase.tsx",
    ],
    notes: [
      "Likely same family as other micro detail labels, but currently bolder and smaller.",
    ],
  },
  {
    id: "detailMicroLocation",
    group: "detail-micro",
    purpose: "Small location label.",
    recommendedTags: ["p", "span", "dd"],
    seoNote: "Geographic support copy only.",
    currentStyle: 'Utility ".home-ui-location" in globals.css',
    currentExamples: ["Montes Claros, MG"],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/app/globals.css",
    ],
  },
  {
    id: "detailMicroHint",
    group: "detail-micro",
    purpose: "Small hint text used to teach or confirm an interaction.",
    recommendedTags: ["span", "p"],
    seoNote: "Interaction support only.",
    currentStyle:
      'Contact hint line: "mt-3 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-ambient-muted"',
    currentExamples: [
      "Clique para copiar",
      "Copiado para a area de transferencia",
    ],
    currentReferences: [
      "src/components/contact-action-rows.tsx",
    ],
  },
  {
    id: "homeProjectOverlayTitle",
    group: "home-overlay",
    purpose: "Project title on the home hero image, lower-left corner.",
    recommendedTags: ["h2"],
    seoNote: "Section-level heading within the home project carousel.",
    currentStyle:
      'Current class: "mt-1 font-display text-[1.8rem] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[2.2rem]"',
    className:
      "mt-1 font-display text-[3rem] font-bold uppercase leading-[0.82] tracking-[-0.05em] text-white sm:text-[3.6rem] lg:text-[4.8rem]",
    currentExamples: ["Rosiris", "Arquitetonico"],
    currentReferences: [
      "src/components/home-panel.tsx",
    ],
    notes: [
      "Approved runtime token. User wants this title larger and bolder for readability.",
    ],
  },
  {
    id: "projectMetaDetail",
    group: "home-overlay",
    purpose: "Small meta line above the home project overlay title.",
    recommendedTags: ["p", "span"],
    seoNote: "Support metadata only.",
    currentStyle: 'Utility ".home-ui-overlay-meta" in globals.css',
    currentExamples: ["Interiores · 2024", "Residencial · 2024"],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/app/globals.css",
    ],
    notes: [
      "User also wants this family to remain readable and not too tiny.",
    ],
  },
  {
    id: "overlayActionLink",
    group: "home-overlay",
    purpose: "Action link shown over the home hero image.",
    recommendedTags: ["a"],
    seoNote: "Navigation affordance only.",
    currentStyle: 'Utility ".home-ui-overlay-action" in globals.css',
    currentExamples: ["Ver projeto"],
    currentReferences: [
      "src/components/home-panel.tsx",
      "src/app/globals.css",
    ],
    notes: [
      "This is the preferred size reference for the smaller project back link inside detail pages.",
    ],
  },
  {
    id: "projectBackLink",
    group: "project-navigation",
    purpose: "Back link on project detail hero.",
    recommendedTags: ["a"],
    seoNote: "Secondary navigation only.",
    currentStyle:
      'Current class: "group mb-10 inline-flex items-center gap-4 text-detail uppercase text-[#dbe7ea] transition-colors hover:text-white"',
    currentExamples: ["Todos os projetos"],
    currentReferences: [
      "src/components/project-page.tsx",
    ],
    notes: [
      "User wants this visually closer to the home overlay action size and presence.",
    ],
  },
  {
    id: "projectHeroCategory",
    group: "project-detail",
    purpose: "Category label above the project title in the detail hero.",
    recommendedTags: ["p", "span"],
    seoNote: "Support label only.",
    currentStyle:
      'Current class: "mb-4 text-label uppercase text-[#dbe7ea]/85"',
    currentExamples: ["Residencial", "Comercial", "Interiores"],
    currentReferences: [
      "src/components/project-page.tsx",
    ],
    notes: [
      "User flagged this as too small in the current project pages.",
    ],
  },
  {
    id: "projectHeroTitle",
    group: "project-detail",
    purpose: "Main project title in the detail hero.",
    recommendedTags: ["h1"],
    seoNote: "Primary H1 of the project detail page.",
    currentStyle:
      'Current class: "font-display text-[18vw] uppercase leading-[0.8] tracking-[-0.06em] text-[#eef6f8] sm:text-[13vw] lg:text-[9rem]"',
    currentExamples: ["Arquitetonico", "Rosiris", "Andrade"],
    currentReferences: [
      "src/components/project-page.tsx",
    ],
  },
  {
    id: "projectNarrativeTitle",
    group: "project-detail",
    purpose: "Narrative split-accent heading inside the project page body.",
    recommendedTags: ["h2"],
    seoNote: "Secondary heading inside the project narrative section.",
    currentStyle:
      'Current class: "mb-8 font-display text-4xl uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-[4.8rem]" + accent word "block italic text-ambient-electric"',
    currentExamples: ["Materia, luz / e permanencia."],
    currentReferences: [
      "src/components/project-page.tsx",
    ],
    notes: [
      "Same family logic as Contact and Studio split-accent display, but used as H2 in project pages.",
    ],
  },
  {
    id: "projectStripCardTitle",
    group: "project-navigation",
    purpose: "Title inside the related-projects strip carousel.",
    recommendedTags: ["h3"],
    seoNote: "Card-level heading for related project navigation.",
    currentStyle:
      'Current class: "mt-1.5 font-display text-[1.45rem] uppercase leading-[1.1] tracking-[-0.03em] text-ambient-micro md:text-[1.55rem]"',
    currentExamples: ["Rosiris", "Arquitetonico"],
    currentReferences: [
      "src/components/project-strip-carousel.tsx",
    ],
  },
];

export const typographyTokenMap = Object.fromEntries(
  typographyTokens.map((token) => [token.id, token])
) as Record<string, TypographyToken>;
