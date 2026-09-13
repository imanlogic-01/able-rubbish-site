// Static site build: renders every route to /dist as clean-URL HTML, plus sitemap.xml and robots.txt.
import { mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.mjs';
import { services } from '../src/data/services.mjs';
import { locations } from '../src/data/locations.mjs';
import { page } from './lib/layout.mjs';
import { abs } from './lib/util.mjs';
import { homePage } from './pages/home.mjs';
import { servicesHubPage, servicePage } from './pages/services.mjs';
import { serviceAreasHubPage, locationPage } from './pages/locations.mjs';
import { aboutPage, contactPage, quotePage, faqPage, recentWorkPage, thankYouPage, notFoundPage, legalPages } from './pages/core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const routes = [
  homePage(),
  aboutPage(),
  servicesHubPage(),
  ...services.map(servicePage),
  serviceAreasHubPage(),
  ...locations.map((l, i) => locationPage(l, i)),
  recentWorkPage(),
  faqPage(),
  contactPage(),
  quotePage(),
  ...legalPages(),
  thankYouPage(),
  notFoundPage(),
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });

// Minimal, safe minification for CSS (comments + whitespace) and JS (comments only).
const css = (await readFile(path.join(root, 'src/styles/site.css'), 'utf8'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
await writeFile(path.join(dist, 'assets/site.css'), css);
const js = (await readFile(path.join(root, 'src/scripts/site.js'), 'utf8')).replace(/^\s*\/\/.*$/gm, '');
await writeFile(path.join(dist, 'assets/site.js'), js.replace(/__FORM_ENDPOINT__/g, site.form.endpoint).replace(/__FORM_EMAIL__/g, site.email));

// Brand SVGs (favicon + logo used in structured data)
const { logoMark } = await import('./lib/layout.mjs');
const mark = logoMark().replace('class="logo-mark "', 'xmlns="http://www.w3.org/2000/svg"').replace(/var\(--logo-accent, #2E7A1E\)/g, '#2E7A1E').replace(/currentColor/g, '#1D3288');
await writeFile(path.join(dist, 'favicon.svg'), mark.replace('aria-hidden="true"', ''));
await writeFile(
  path.join(dist, 'logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 60"><g transform="translate(4 10) scale(1)">${mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g><text x="54" y="34" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="26" fill="#0C1530" letter-spacing="-0.5">ABLE</text><text x="54" y="50" font-family="Manrope, Arial, sans-serif" font-weight="700" font-size="10.5" fill="#565B66" letter-spacing="1">RUBBISH &amp; GARDENING</text></svg>`,
);

for (const r of routes) {
  const out = r.path === '/' ? 'index.html' : r.path === '/404' ? '404.html' : `${r.path.slice(1)}.html`;
  const file = path.join(dist, out);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, page(r));
}

const indexable = routes.filter((r) => !r.noindex);
const today = new Date().toISOString().slice(0, 10);
const priority = (r) => (r.path === '/' ? '1.0' : r.type === 'Service' || r.path === '/get-a-quote' ? '0.9' : r.type === 'Location' ? '0.8' : '0.6');
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((r) => `  <url><loc>${abs(r.path)}</loc><lastmod>${today}</lastmod><priority>${priority(r)}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Route manifest used by the audit script and the handover route table.
await writeFile(
  path.join(root, 'routes.json'),
  JSON.stringify(routes.map((r) => ({ path: r.path, title: r.title, type: r.type, noindex: !!r.noindex, primaryKeyword: r.primaryKeyword })), null, 2),
);

console.log(`Built ${routes.length} routes (${indexable.length} indexable, ${routes.length - indexable.length} noindex) → dist/`);
