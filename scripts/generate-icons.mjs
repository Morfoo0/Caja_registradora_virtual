import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const source = resolve(process.cwd(), "app", "icon.svg");
const outDir = resolve(process.cwd(), "public", "icons");

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
  { file: "apple-touch-icon.png", size: 180 },
];

await mkdir(outDir, { recursive: true });

for (const target of targets) {
  await sharp(source)
    .resize(target.size, target.size)
    .png()
    .toFile(resolve(outDir, target.file));
  console.log(`generado ${target.file}`);
}
