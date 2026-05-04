import type { Lang } from "@/lib/i18n";

export const studioContent = {
  pt: {
    eyebrow: "Escritório",
    titleTop: "Conceito",
    titleBottom: "& equipe",
    intro: [
      "Um escritório com dinâmica criativa e descontraída, que valoriza um ambiente leve, comprometido e atento aos detalhes. Os projetos nascem da combinação entre personalidade, originalidade, funcionalidade e estética.",
      "O estúdio já carrega uma identidade visual própria e uma marca projetual reconhecível, mesmo quando cada solução é desenhada de forma totalmente personalizada para o cliente. A linguagem é contemporânea, mas sem perder aconchego e receptividade.",
    ],
    quote:
      "A arquitetura ideal tem como objetivo aguçar todos os sentidos do corpo humano, instigando visão, olfato, tato e audição, proporcionando uma experiência marcante e única.",
    quoteAuthor: "Júlia Fonseca",
    teamTitle: "Equipe",
    cta: "Inicie seu projeto",
    homeTitle: "Escritório",
    homeIntro:
      "Uma equipe pequena, autoral e precisa. O escritório combina identidade forte, leitura contemporânea e acompanhamento próximo em cada projeto.",
    homeCta: "Conhecer o escritório",
    officeImageAlt: "Julia Fonseca no escritório",
    team: [
      {
        name: "Júlia Fonseca",
        role: "Sócia-fundadora",
        image: "/images/julia-team.webp",
        bio:
          "Formada em Arquitetura e Urbanismo em 2012 pelo Instituto Metodista Izabela Hendrix, em Belo Horizonte, e pós-graduada em arquitetura, iluminação e interiores pelo IPOG. Após atuar em escritório na capital mineira, retornou para Montes Claros, sua cidade natal, onde fundou o escritório em 2016.",
      },
      {
        name: "Cecília Nogueira",
        role: "Arquiteta coordenadora",
        image: "/images/cecilia-team.webp",
        bio:
          "Formada em Arquitetura e Urbanismo em 2014 pela Faculdade Santo Agostinho, em Montes Claros, e pós-graduanda em Master em Arquitetura e Iluminação pelo IPOG. Depois de anos de atuação em interiores e consultórios, integrou oficialmente a equipe do escritório em 2023.",
      },
      {
        name: "Rayssa Souto",
        role: "Estagiária",
        image: "/images/rayssa-team.webp",
        bio:
          "Estudante de Arquitetura e Urbanismo na UNIFIPMOC, em Montes Claros, e formada em curso técnico de Design de Interiores no Conservatório Lorenzo Fernandez.",
      },
      {
        name: "Andréia Silva",
        role: "Estagiária",
        image: "/images/andreia-team.webp",
        bio:
          "Estudante do curso técnico em Edificações pelo SENAI e formada em Design de Interiores pelo Conservatório de Montes Claros.",
      },
    ],
  },
  en: {
    eyebrow: "Studio",
    titleTop: "Concept",
    titleBottom: "& team",
    intro: [
      "A studio with a creative and relaxed rhythm, shaped by a light but committed atmosphere. Every project is developed through the balance of personality, originality, functionality and aesthetic clarity.",
      "The studio already carries a recognizable visual identity and project language, even when each solution is fully tailored to the client. The approach is contemporary without losing warmth, comfort and receptiveness.",
    ],
    quote:
      "Ideal architecture should awaken every human sense, engaging sight, smell, touch and hearing while creating a unique and memorable experience.",
    quoteAuthor: "Julia Fonseca",
    teamTitle: "Team",
    cta: "Start your project",
    homeTitle: "Studio",
    homeIntro:
      "A small, highly authored team. The studio combines a clear identity, contemporary language and close involvement throughout each project.",
    homeCta: "Discover the studio",
    officeImageAlt: "Julia Fonseca at the studio",
    team: [
      {
        name: "Julia Fonseca",
        role: "Founder",
        image: "/images/julia-team.webp",
        bio:
          "Graduated in Architecture and Urbanism in 2012 at Instituto Metodista Izabela Hendrix in Belo Horizonte, with postgraduate studies in architecture, lighting and interiors at IPOG. After working in architecture studios in Belo Horizonte, she returned to Montes Claros and founded the studio in 2016.",
      },
      {
        name: "Cecília Nogueira",
        role: "Lead architect",
        image: "/images/cecilia-team.webp",
        bio:
          "Graduated in Architecture and Urbanism in 2014 at Faculdade Santo Agostinho in Montes Claros, with postgraduate studies in Architecture and Lighting at IPOG. After years working mainly on interiors and clinics, she formally joined the studio team in 2023.",
      },
      {
        name: "Rayssa Souto",
        role: "Intern",
        image: "/images/rayssa-team.webp",
        bio:
          "Architecture and Urbanism student at UNIFIPMOC in Montes Claros, with a technical degree in Interior Design from Conservatório Lorenzo Fernandez.",
      },
      {
        name: "Andréia Silva",
        role: "Intern",
        image: "/images/andreia-team.webp",
        bio:
          "Technical student in Building Construction at SENAI and graduate in Interior Design from the Conservatory of Montes Claros.",
      },
    ],
  },
} as const;

export function getStudioContent(lang: Lang) {
  return studioContent[lang];
}
