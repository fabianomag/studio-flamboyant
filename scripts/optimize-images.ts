/**
 * Converte uma pasta de imagens brutas em WebP otimizados prontos para o site.
 *
 * Uso:
 *   npm run optimize <pasta-de-entrada> <slug>
 *
 * Exemplos:
 *   npm run optimize _originals/andrade andrade
 *   npm run optimize _originals/sabrina sabrina
 *
 * Convenção de saída (public/images/projetos/<slug>/):
 *   - Primeiro arquivo (ordem alfabética) → cover.webp
 *   - Demais → 01.webp, 02.webp, 03.webp ...
 *
 * Para trocar a capa depois: renomeie cover.webp e o arquivo desejado entre si.
 * O site reflete a mudança imediatamente, sem rodar o script de novo.
 *
 * Após rodar, adicione ou atualize a entrada no projects.json:
 *   "cover": "/images/projetos/<slug>/cover.webp"
 *   "images": ["/images/projetos/<slug>/cover.webp", "/images/projetos/<slug>/01.webp", ...]
 */

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".avif"]);
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

function fmt(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

async function run(inputDir: string, slug: string) {
  const input = path.resolve(inputDir);
  const output = path.resolve("public", "images", "projetos", slug);

  if (!fs.existsSync(input)) {
    console.error(`\nPasta não encontrada: ${input}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(input)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.error(`\nNenhuma imagem em: ${input}`);
    process.exit(1);
  }

  fs.mkdirSync(output, { recursive: true });

  console.log(`\n  entrada : ${input}`);
  console.log(`  saída   : ${output}`);
  console.log(`  imagens : ${files.length}\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (let i = 0; i < files.length; i++) {
    const src = path.join(input, files[i]);
    const name = i === 0 ? "cover.webp" : `${String(i).padStart(2, "0")}.webp`;
    const dest = path.join(output, name);

    const before = fs.statSync(src).size;
    await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dest);
    const after = fs.statSync(dest).size;

    totalBefore += before;
    totalAfter += after;

    const pct = Math.round((1 - after / before) * 100);
    console.log(`  ${name.padEnd(12)} ${fmt(before).padStart(8)} → ${fmt(after).padStart(7)}  (${pct > 0 ? `-${pct}` : `+${Math.abs(pct)}`}%)`);
  }

  const total = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(`\n  total   : ${fmt(totalBefore)} → ${fmt(totalAfter)}  (-${total}%)`);
  console.log(`\n  Próximo passo — adicione ao projects.json:`);
  console.log(`    "cover": "/images/projetos/${slug}/cover.webp"`);

  const imagesList = files.map((_, i) =>
    i === 0 ? `cover.webp` : `${String(i).padStart(2, "0")}.webp`
  );
  const imagesJson = imagesList
    .map((f) => `    "/images/projetos/${slug}/${f}"`)
    .join(",\n");
  console.log(`    "images": [\n${imagesJson}\n    ]\n`);
}

const [, , inputDir, slug] = process.argv;

if (!inputDir || !slug) {
  console.error("\nUso: npm run optimize <pasta-de-entrada> <slug>");
  console.error("Ex:  npm run optimize _originals/andrade andrade\n");
  process.exit(1);
}

run(inputDir, slug).catch((err) => {
  console.error("\nErro:", err.message);
  process.exit(1);
});
