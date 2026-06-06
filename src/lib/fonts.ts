import localFont from "next/font/local";

export const ppNeueMontreal = localFont({
  src: "../fonts/pp-neue-montreal-variable.woff2",
  variable: "--font-neue-montreal",
  weight: "200 800",
  display: "swap",
  fallback: ["Arial", "Helvetica Neue", "sans-serif"],
});
