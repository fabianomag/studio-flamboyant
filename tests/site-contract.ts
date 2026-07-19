export type SiteLocale = "en" | "pt";

export type PublicRoute = {
  path: string;
  locale: SiteLocale;
};

export const PUBLIC_ROUTES: readonly PublicRoute[] = [
  { path: "/", locale: "en" },
  { path: "/projects", locale: "en" },
  { path: "/projects/horizon-pavilion", locale: "en" },
  { path: "/projects/mist-house", locale: "en" },
  { path: "/projects/courtyard-house", locale: "en" },
  { path: "/studio", locale: "en" },
  { path: "/contact", locale: "en" },
  { path: "/privacy", locale: "en" },
  { path: "/pt", locale: "pt" },
  { path: "/pt/projetos", locale: "pt" },
  { path: "/pt/projetos/pavilhao-horizonte", locale: "pt" },
  { path: "/pt/projetos/casa-neblina", locale: "pt" },
  { path: "/pt/projetos/casa-patio", locale: "pt" },
  { path: "/pt/escritorio", locale: "pt" },
  { path: "/pt/contato", locale: "pt" },
  { path: "/pt/privacidade", locale: "pt" },
] as const;

export const RETIRED_ROUTES = [
  "/publicacoes",
  "/galeria-trefle",
  "/produtos",
  "/residencial",
  "/residencial/legacy-project",
  "/comercial",
  "/comercial/legacy-project",
  "/interiores",
  "/interiores/legacy-project",
] as const;

export const RESPONSIVE_ROUTES = [
  "/",
  "/projects",
  "/projects/horizon-pavilion",
  "/studio",
  "/contact",
] as const;

export const ACCESSIBILITY_ROUTES = [
  "/",
  "/projects",
  "/projects/horizon-pavilion",
  "/studio",
  "/contact",
  "/privacy",
  "/pt",
  "/pt/projetos",
  "/pt/escritorio",
  "/pt/contato",
] as const;
