import type { Metadata } from "next";
import { resolveLang } from "@/lib/i18n";
import { EscritorioClient } from "./escritorio-client";

export const metadata: Metadata = {
  title: "Escritório",
  description:
    "Conceito e equipe do escritório Julia Fonseca Arquitetura. Projetos personalizados com personalidade, funcionalidade e estética.",
};

export default function EscritorioPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = resolveLang(searchParams?.lang);

  return <EscritorioClient lang={lang} />;
}
