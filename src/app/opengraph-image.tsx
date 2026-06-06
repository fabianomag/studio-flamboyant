import { ImageResponse } from "next/og";
import siteConfig from "@/lib/metadata";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Border frame */}
        <div
          style={{
            position: "absolute",
            inset: "40px",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
          }}
        />

        {/* Studio name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            marginBottom: 16,
            display: "flex",
          }}
        >
          Julia Fonseca
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: 0.6,
            display: "flex",
          }}
        >
          Arquitetura
        </div>
      </div>
    ),
    size,
  );
}
