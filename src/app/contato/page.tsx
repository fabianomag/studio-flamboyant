import type { Metadata } from "next";
import { resolveLang } from "@/lib/i18n";
import { ContactShowcase } from "@/components/contact-showcase";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Julia Fonseca Arquitetura. Projetos residenciais, comerciais e interiores de alto padrão.",
};

export default function ContatoPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = resolveLang(searchParams?.lang);
  return <ContactShowcase lang={lang} />;
}
