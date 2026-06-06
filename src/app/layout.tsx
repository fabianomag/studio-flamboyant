import type { Metadata } from "next";
import { Suspense } from "react";
import { Newsreader } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { FooterController } from "@/components/footer-controller";
import { createMetadata } from "@/lib/metadata";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import { StringTuneCursor } from "@/components/string-tune-cursor";
import { SiteIntro } from "@/components/site-intro";
import { ppNeueMontreal } from "@/lib/fonts";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={cn(ppNeueMontreal.variable, newsreader.variable, "font-sans")}
    >
      <body className="font-sans antialiased bg-[#1a1d21] text-white selection:bg-ambient-electric/20">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <SiteIntro />
        <SmoothScroll>
          <Suspense fallback={null}>
            <Navigation />
          </Suspense>
          <StringTuneCursor />
          <main>{children}</main>
          <Suspense fallback={null}>
            <FooterController />
          </Suspense>
        </SmoothScroll>
      </body>
    </html>
  );
}
