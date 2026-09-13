// Generates responsive AVIF / WebP / JPEG variants from the original business photographs
// in /source-images and writes a manifest used by the page builder.
// Run with: npm run images   (only needed when source photos change — output is committed)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSources } from '../src/data/image-sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'img');
const WIDTHS = [480, 800, 1200, 1600, 2000];

await mkdir(outDir, { recursive: true });
const manifest = {};

for (const [key, src] of Object.entries(imageSources)) {
  let pipeline = sharp(path.join(root, 'source-images', src.file)).rotate();
  if (src.crop) pipeline = pipeline.extract(src.crop);
  const buffer = await pipeline.toBuffer();
  const meta = await sharp(buffer).metadata();
  const widths = WIDTHS.filter((w) => w < meta.width);
  widths.push(Math.min(meta.width, 2000));
  const unique = [...new Set(widths)];

  for (const w of unique) {
    const base = sharp(buffer).resize({ width: w, withoutEnlargement: true });
    const name = `${src.slug}-${w}`;
    await base.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(outDir, `${name}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(path.join(outDir, `${name}.webp`));
    await base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(path.join(outDir, `${name}.jpg`));
  }

  manifest[key] = {
    slug: src.slug,
    width: meta.width,
    height: meta.height,
    widths: unique,
    alt: src.alt,
    tier: src.tier,
    source: src.source,
  };
  console.log(`✓ ${key} → ${src.slug} (${meta.width}×${meta.height}) [${unique.join(', ')}]`);
}

// Open Graph share image (1200×630)
await sharp(path.join(root, 'source-images', imageSources.van.file))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(outDir, 'og-able-rubbish-and-gardening-services.jpg'));

await writeFile(path.join(root, 'src', 'data', 'image-manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Manifest written.');
