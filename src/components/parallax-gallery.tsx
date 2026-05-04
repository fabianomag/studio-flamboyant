import Image from "next/image";
import { getImageBlurDataURL } from "@/lib/image-placeholder";

export function ParallaxGallery({ images }: { images: string[] }) {
  const rows: Array<{
    layout: "full" | "split-left" | "split-right" | "pair";
    images: Array<{ src: string; index: number }>;
  }> = [];

  if (images.length > 0) {
    rows.push({
      layout: "full",
      images: [{ src: images[0], index: 0 }],
    });
  }

  let cursor = images.length > 0 ? 1 : 0;
  let alternator = 0;

  while (cursor < images.length) {
    const remaining = images.length - cursor;

    if (remaining === 1) {
      rows.push({
        layout: "full",
        images: [{ src: images[cursor], index: cursor }],
      });
      cursor += 1;
      continue;
    }

    const layoutCycle = ["split-left", "pair", "split-right"] as const;
    const layout = layoutCycle[alternator % layoutCycle.length];

    rows.push({
      layout,
      images: [
        { src: images[cursor], index: cursor },
        { src: images[cursor + 1], index: cursor + 1 },
      ],
    });

    cursor += 2;
    alternator += 1;
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {rows.map((row, rowIndex) => {
        if (row.layout === "full") {
          const item = row.images[0];
          return (
            <div key={`${row.layout}-${rowIndex}`} className="relative aspect-[16/9] overflow-hidden bg-[#14323d]/8">
              <Image
                src={item.src}
                alt={`Fotografia do Projeto ${item.index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={getImageBlurDataURL()}
              />
            </div>
          );
        }

        const splitClass =
          row.layout === "split-left"
            ? "grid-cols-1 md:grid-cols-[1.35fr_0.92fr]"
            : row.layout === "split-right"
              ? "grid-cols-1 md:grid-cols-[0.92fr_1.35fr]"
              : "grid-cols-1 md:grid-cols-2";

        return (
          <div
            key={`${row.layout}-${rowIndex}`}
            className={`grid gap-3 md:gap-4 ${splitClass}`}
            style={{ gridAutoRows: "clamp(18rem, 38vw, 36rem)" }}
          >
            {row.images.map((item) => (
              <div key={item.src} className="relative overflow-hidden bg-[#14323d]/8">
                <Image
                  src={item.src}
                  alt={`Fotografia do Projeto ${item.index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={getImageBlurDataURL()}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
