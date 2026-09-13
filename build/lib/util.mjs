import { readFileSync } from 'node:fs';
import { site } from '../../src/data/site.mjs';

const manifest = JSON.parse(readFileSync(new URL('../../src/data/image-manifest.json', import.meta.url), 'utf8'));

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path) => site.url + (path === '/' ? '' : path);

export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    const v = values[i - 1];
    return out + (Array.isArray(v) ? v.join('') : v ?? '') + str;
  });

export const imageMeta = (key) => {
  const m = manifest[key];
  if (!m) throw new Error(`Unknown image key: ${key}`);
  return m;
};

/**
 * Responsive <picture> with AVIF → WebP → JPEG.
 * @param {string} key image manifest key
 * @param {object} o  sizes, className, eager (LCP), alt override, ratio (CSS aspect-ratio)
 */
export function picture(key, o = {}) {
  const m = imageMeta(key);
  const sizes = o.sizes || '(min-width: 1024px) 50vw, 100vw';
  const set = (ext) => m.widths.map((w) => `/img/${m.slug}-${w}.${ext} ${w}w`).join(', ');
  const fallbackW = m.widths.find((w) => w >= 1200) || m.widths[m.widths.length - 1];
  const alt = o.alt ?? m.alt;
  const loading = o.eager ? 'eager' : 'lazy';
  const priority = o.eager ? ' fetchpriority="high"' : '';
  const style = o.position ? ` style="object-position:${o.position}"` : '';
  return `<picture class="${o.className || ''}"><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="/img/${m.slug}-${fallbackW}.jpg" srcset="${set('jpg')}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" loading="${loading}" decoding="${o.eager ? 'sync' : 'async'}"${priority}${style}></picture>`;
}

export const heroPreload = (key, sizes = '100vw') => {
  const m = imageMeta(key);
  const set = m.widths.map((w) => `/img/${m.slug}-${w}.avif ${w}w`).join(', ');
  return `<link rel="preload" as="image" type="image/avif" imagesrcset="${set}" imagesizes="${sizes}" fetchpriority="high">`;
};

export const addressLine = () => `${site.address.street}, ${site.address.area}, ${site.address.locality} ${site.address.postcode}`;

export const tel = `tel:${site.phone.e164}`;
export const mailto = `mailto:${site.email}`;

export const stars = (n = 5) =>
  `<span class="stars" role="img" aria-label="${n} out of 5 stars">${'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg>'.repeat(n)}</span>`;

export const icon = {
  arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/></svg>',
  clock: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  plus: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  chevron: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  facebook: '<svg class="i i--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10.5H8v3h2.4V21z"/></svg>',
  google: '<svg class="i i--fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>',
};
