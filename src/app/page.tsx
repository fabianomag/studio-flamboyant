import { getFeaturedProjects } from "@/lib/projects";
import { resolveLang } from "@/lib/i18n";
import { HomePanel } from "@/components/home-panel";

export default function Home({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const featured = getFeaturedProjects();
  const lang = resolveLang(searchParams?.lang);

  return <HomePanel projects={featured} lang={lang} />;
}
