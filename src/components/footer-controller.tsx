"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ProjectDetailFooter } from "./project-detail-footer";
import { resolveLang } from "@/lib/i18n";

export function FooterController() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = resolveLang(searchParams.get("lang"));
  const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  if (pathname === "/" || pathname === "/escritorio" || pathname === "/galeria-trefle") return null;

  return <ProjectDetailFooter lang={lang} pathname={currentHref} />;
}
