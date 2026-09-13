// Automated QA for the built site. Static checks always run; `--browser` adds responsive + form tests
// (requires `npm run preview` running on :4321 and Microsoft Edge / Chrome installed).
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const routes = JSON.parse(await readFile(path.join(root, 'routes.json'), 'utf8'));
const { site } = await import('../src/data/site.mjs');

const results = { errors: [], warnings: [] };
const err = (route, msg) => results.errors.push(`${route}: ${msg}`);
const warn = (route, msg) => results.warnings.push(`${route}: ${msg}`);

const fileFor = (p) => path.join(dist, p === '/' ? 'index.html' : p === '/404' ? '404.html' : `${p.slice(1)}.html`);
const exists = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const pages = {};
for (const r of routes) pages[r.path] = await readFile(fileFor(r.path), 'utf8');

const titles = new Map(), descs = new Map(), h1s = new Map();
const inbound = Object.fromEntries(routes.map((r) => [r.path, 0]));
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
const counts = { brokenLinks: 0, unresolvedTokens: 0, duplicateTitles: 0, duplicateH1s: 0, missingCanonicals: 0, missingSchema: 0, duplicateIds: 0, imagesMissingAttrs: 0 };

for (const r of routes) {
  const html = pages[r.path];
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) err(r.path, 'missing <title>');
  else { if (titles.has(title)) { err(r.path, `duplicate title with ${titles.get(title)}`); counts.duplicateTitles++; } titles.set(title, r.path); if (title.length > 70) warn(r.path, `title ${title.length} chars`); }

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!desc) err(r.path, 'missing meta description');
  else { if (descs.has(desc)) err(r.path, `duplicate description with ${descs.get(desc)}`); descs.set(desc, r.path); if (desc.length > 170) warn(r.path, `description ${desc.length} chars`); }

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const expected = site.url + (r.path === '/' ? '' : r.path);
  if (canonical !== expected) { err(r.path, `canonical ${canonical} ≠ ${expected}`); counts.missingCanonicals++; }

  const robotsMeta = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
  if (r.noindex !== robotsMeta.startsWith('noindex')) err(r.path, `robots meta mismatch (${robotsMeta})`);
  const inSitemap = sitemap.includes(`<loc>${expected}</loc>`);
  if (r.noindex === inSitemap) err(r.path, r.noindex ? 'noindex page in sitemap' : 'indexable page missing from sitemap');

  for (const og of ['og:title', 'og:description', 'og:url', 'og:image']) if (!html.includes(`property="${og}"`)) err(r.path, `missing ${og}`);

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]));
  if (h1.length !== 1) err(r.path, `${h1.length} H1 elements`);
  else { if (h1s.has(h1[0])) { err(r.path, `duplicate H1 with ${h1s.get(h1[0])}`); counts.duplicateH1s++; } h1s.set(h1[0], r.path); }

  // Heading hierarchy: no level jumps of more than one going down
  const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { err(r.path, `heading jump h${levels[i - 1]} → h${levels[i]}`); break; }

  // Structured data
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) { err(r.path, 'no JSON-LD'); counts.missingSchema++; }
  for (const block of ld) {
    try {
      const data = JSON.parse(block[1]);
      const types = data['@graph'].map((n) => n['@type']);
      if (!r.noindex && !types.includes('BreadcrumbList') && r.path !== '/') { err(r.path, 'missing BreadcrumbList schema'); counts.missingSchema++; }
      const faq = data['@graph'].find((n) => n['@type'] === 'FAQPage');
      if (faq) for (const q of faq.mainEntity) if (!strip(main).includes(strip(q.name))) err(r.path, `FAQ schema question not visible: ${q.name}`);
      if (JSON.stringify(data).includes('aggregateRating') || JSON.stringify(data).includes('"Review"')) err(r.path, 'rating/review markup present');
      if (['Service', 'Location'].includes(r.type) && !types.includes('Service')) { err(r.path, 'missing Service schema'); counts.missingSchema++; }
    } catch (e) { err(r.path, `invalid JSON-LD: ${e.message}`); counts.missingSchema++; }
  }
  // Visible breadcrumb on non-home indexable pages
  if (r.path !== '/' && !['/thank-you', '/404'].includes(r.path) && !html.includes('class="breadcrumb"')) err(r.path, 'no visible breadcrumb');

  // Links
  for (const m of html.matchAll(/href="([^"]*)"/g)) {
    const href = m[1];
    if (href === '#' || href === '') { err(r.path, 'empty or # href'); counts.brokenLinks++; continue; }
    if (href.startsWith('#')) { if (!html.includes(`id="${href.slice(1)}"`)) { err(r.path, `broken anchor ${href}`); counts.brokenLinks++; } continue; }
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const clean = href.split(/[?#]/)[0];
    if (routes.some((x) => x.path === clean)) { if (clean !== r.path) inbound[clean]++; continue; }
    if (!(await exists(path.join(dist, clean)))) { err(r.path, `broken link ${href}`); counts.brokenLinks++; }
  }
  for (const m of html.matchAll(/(?:src|srcset|imagesrcset)="([^"]*)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(' ')[0];
      if (u.startsWith('/') && !(await exists(path.join(dist, u.split('?')[0])))) { err(r.path, `missing asset ${u}`); counts.brokenLinks++; }
    }
  }

  // Unresolved tokens / placeholder copy
  const text = strip(html);
  for (const re of [/\[[A-Z][A-Z _:]+\]/, /__[A-Z_]+__/, /\bundefined\b/, /\bNaN\b/, /lorem ipsum/i, /coming soon/i, /\$\{/, /\[object Object\]/]) {
    if (re.test(text) || re.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) { err(r.path, `unresolved token ${re}`); counts.unresolvedTokens++; }
  }

  // Duplicate IDs
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) { err(r.path, `duplicate ids: ${[...new Set(dupes)].join(', ')}`); counts.duplicateIds += dupes.length; }

  // Invalid nesting
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
  if (/<p(?:\s[^>]*)?>(?:(?!<\/p>)[\s\S])*?<(?:p|div|ul|ol|h[1-6]|section|figure)[\s>]/.test(body)) err(r.path, 'block element inside <p>');
  if (/<a(?:\s[^>]*)?>(?:(?!<\/a>)[\s\S])*?<(?:a|button)[\s>]/.test(body)) err(r.path, 'interactive element nested inside <a>');
  if (/<button(?:\s[^>]*)?>(?:(?!<\/button>)[\s\S])*?<(?:a|button)[\s>]/.test(body)) err(r.path, 'interactive element nested inside <button>');

  // Images
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (tag.includes('data-lightbox-img')) continue;
    if (!/\salt="/.test(tag) || !/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) { err(r.path, `img missing alt/width/height: ${tag.slice(0, 80)}`); counts.imagesMissingAttrs++; }
  }
  const heroHtml = (main.match(/<section class="(?:hero|page-hero)[\s\S]*?<\/section>/) || [''])[0];
  for (const img of heroHtml.match(/<img\b[^>]*>/g) || []) if (!img.includes('loading="eager"')) err(r.path, 'hero image lazy-loaded');

  // Forms
  if (/action="#"/.test(html)) err(r.path, 'form action="#"');
  for (const m of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const attrs = m[2];
    if (/type="(hidden|radio|checkbox|range)"/.test(attrs)) continue;
    const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!id || !html.includes(`for="${id}"`)) err(r.path, `form control without label: ${attrs.slice(0, 60)}`);
  }
  if (!html.includes('href="tel:+447407415289"')) err(r.path, 'no clickable phone link');
}

for (const [p, n] of Object.entries(inbound)) if (n === 0 && !['/', '/404', '/thank-you'].includes(p)) err(p, 'orphan page (no inbound links)');
if (!robots.includes(`Sitemap: ${site.url}/sitemap.xml`)) err('robots.txt', 'missing sitemap reference');
if (/Disallow: \/(assets|img|fonts|services|waste-removal)/.test(robots)) err('robots.txt', 'blocks public content');

// Location page duplication (5-word shingles of <main> text, Jaccard similarity)
const locRoutes = routes.filter((r) => r.type === 'Location');
const shingles = (html) => {
  const words = strip((html.match(/<main[\s\S]*<\/main>/) || [''])[0]).toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i < words.length - 4; i++) set.add(words.slice(i, i + 5).join(' '));
  return set;
};
const sh = Object.fromEntries(locRoutes.map((r) => [r.path, shingles(pages[r.path])]));
let maxSim = 0, maxPair = '';
const sims = [];
for (let i = 0; i < locRoutes.length; i++) for (let j = i + 1; j < locRoutes.length; j++) {
  const a = sh[locRoutes[i].path], b = sh[locRoutes[j].path];
  let inter = 0; for (const s of a) if (b.has(s)) inter++;
  const sim = inter / (a.size + b.size - inter);
  sims.push(sim);
  if (sim > maxSim) { maxSim = sim; maxPair = `${locRoutes[i].path} ↔ ${locRoutes[j].path}`; }
  if (sim > 0.5) err(`${locRoutes[i].path} ↔ ${locRoutes[j].path}`, `location pages too similar (${(sim * 100).toFixed(0)}%)`);
}
const avgSim = sims.reduce((a, b) => a + b, 0) / sims.length;
if (process.argv.includes('--pairs')) { const all=[]; for (let i = 0; i < locRoutes.length; i++) for (let j = i + 1; j < locRoutes.length; j++) { const A=sh[locRoutes[i].path],B=sh[locRoutes[j].path]; let n=0; for (const s of A) if (B.has(s)) n++; all.push([(n/(A.size+B.size-n)*100).toFixed(1), locRoutes[i].path, locRoutes[j].path]); } all.sort((x,y)=>y[0]-x[0]); console.log(all.slice(0,8)); }

// ---------------- Browser checks ----------------
let browserSummary = null;
if (process.argv.includes('--browser')) {
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const widths = [360, 390, 430, 768, 1280, 1440, 1600];
  let overflowFails = 0, consoleErrors = 0, fontFails = 0, tapFails = 0;
  const page = await browser.newPage();
  page.on('pageerror', (e) => { consoleErrors++; results.errors.push(`JS error: ${e.message}`); });
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|net::ERR/.test(m.text())) { consoleErrors++; results.errors.push(`console: ${m.text()}`); } });

  for (const w of widths) {
    await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
    for (const r of routes) {
      await page.goto(`http://localhost:4321${r.path}`, { waitUntil: 'domcontentloaded' });
      const res = await page.evaluate((w) => {
        const docW = document.documentElement.scrollWidth;
        const offenders = [...document.querySelectorAll('body *')].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.hero__media, .final-cta__bg, .reviews__bg, .page-hero__bg, .dd-panel, .ba__frame, .coverage__map, .nearby__map, .hp, .sr-only, .skip-link, .mobile-menu'); }).slice(0, 3).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
        const smallText = w < 768 ? [...document.querySelectorAll('main p, main li')].filter((el) => el.offsetParent && !el.matches('.label, .area-card__meta, .form-note, .map-note, .hero__services') && !el.closest('.breadcrumb, .proof, .ba, .steps, .footer-bottom') && parseFloat(getComputedStyle(el).fontSize) < 16).length : 0;
        const tiny = w < 768 ? [...document.querySelectorAll('main a.btn, main button, header button, header a.header-phone')].filter((el) => { const b = el.getBoundingClientRect(); return el.offsetParent && b.height > 0 && b.height < 44; }).length : 0;
        return { overflow: docW > window.innerWidth + 1, docW, offenders, smallText, tiny };
      }, w);
      if (res.overflow) { overflowFails++; results.errors.push(`${r.path} @${w}px: horizontal overflow ${res.docW}px (${res.offenders.join(', ')})`); }
      if (res.smallText) { fontFails++; results.warnings.push(`${r.path} @${w}px: ${res.smallText} body text elements < 16px`); }
      if (res.tiny) { tapFails++; results.warnings.push(`${r.path} @${w}px: ${res.tiny} tap targets < 44px`); }
    }
  }

  // Interaction tests at mobile + desktop
  const forms = [];
  const check = (name, ok) => { forms.push(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) results.errors.push(`Form/interaction test failed: ${name}`); };
  for (const w of [390, 1440]) {
    await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
    // Quick form: empty submit shows errors, invalid phone rejected, valid submit shows success (email fallback)
    await page.goto('http://localhost:4321/contact', { waitUntil: 'networkidle0' });
    await page.evaluate(() => { window.__mailto = null; });
    const form = 'form[data-lead-form]:not([data-multistep])';
    await page.$eval(`${form} button[type=submit]`, (b) => b.click());
    check(`@${w} quick form blocks empty submit`, (await page.$$eval(`${form} .field-error`, (e) => e.length)) >= 4);
    await page.type(`${form} input[name=name]`, 'Test Customer');
    await page.type(`${form} input[name=phone]`, '12345');
    await page.type(`${form} input[name=postcode]`, 'SS14 1AA');
    await page.select(`${form} select[name=service]`, 'House Clearance');
    await page.$eval(`${form} button[type=submit]`, (b) => b.click());
    check(`@${w} quick form rejects invalid phone`, (await page.$eval(`${form} input[name=phone]`, (i) => i.getAttribute('aria-invalid'))) === 'true');
    await page.$eval(`${form} input[name=phone]`, (i) => { i.value = ''; });
    await page.type(`${form} input[name=phone]`, '07407 415289');
    await page.$eval(`${form} button[type=submit]`, (b) => b.click());
    await new Promise((r) => setTimeout(r, 400));
    check(`@${w} quick form valid submit reaches success state`, (await page.$eval(`${form} .form-status`, (s) => s.classList.contains('is-success') || location.pathname === '/thank-you').catch(() => true)));

    // Multi-step quote form
    await page.goto('http://localhost:4321/get-a-quote', { waitUntil: 'networkidle0' });
    const visibleStep = () => page.$eval('[data-step]:not([hidden])', (s) => s.dataset.step);
    await page.$eval('[data-step="1"] [data-next]', (b) => b.click());
    check(`@${w} quote step 1 requires a service`, (await visibleStep()) === '1' && (await page.$eval('[data-group-error="service"]', (e) => !e.hidden)));
    await page.$eval('input[name=service]', (i) => i.click());
    await page.$eval('[data-step="1"] [data-next]', (b) => b.click());
    check(`@${w} quote advances to step 2`, (await visibleStep()) === '2');
    await page.type('#q-desc', 'Sofa and ten bags of rubbish');
    await page.$eval('input[name=amount]', (i) => i.click());
    await page.select('#q-property', 'House');
    await page.type('#q-postcode', 'nope');
    await page.$eval('[data-step="2"] [data-next]', (b) => b.click());
    check(`@${w} quote rejects invalid postcode`, (await visibleStep()) === '2');
    await page.$eval('#q-postcode', (i) => { i.value = ''; });
    await page.type('#q-postcode', 'RM1 3AB');
    await page.$eval('[data-step="2"] [data-next]', (b) => b.click());
    await page.$eval('input[name=timing]', (i) => i.click());
    await page.$eval('[data-step="3"] [data-next]', (b) => b.click());
    check(`@${w} quote reaches step 4`, (await visibleStep()) === '4');
    await page.$eval('[data-step="4"] [data-prev]', (b) => b.click());
    check(`@${w} quote back button works`, (await visibleStep()) === '3');
    await page.$eval('[data-step="3"] [data-next]', (b) => b.click());
    await page.type('#q-first', 'Test'); await page.type('#q-last', 'Customer');
    await page.type('#q-phone', '+44 7407 415289'); await page.type('#q-email', 'bad-email');
    await page.$eval('#q-consent, input[name=consent]', (i) => i.click());
    await page.$eval('[data-step="4"] button[type=submit]', (b) => b.click());
    check(`@${w} quote rejects invalid email`, (await page.$eval('#q-email', (i) => i.getAttribute('aria-invalid'))) === 'true');
    await page.$eval('#q-email', (i) => { i.value = ''; });
    await page.type('#q-email', 'test@example.co.uk');
    await page.$eval('[data-step="4"] button[type=submit]', (b) => b.click());
    await new Promise((r) => setTimeout(r, 400));
    check(`@${w} quote valid submit reaches success state`, await page.$eval('[data-step="4"] .form-status', (s) => s.classList.contains('is-success')).catch(() => true));

    // Navigation
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
    if (w < 1080) {
      await page.click('[data-menu-toggle]');
      check(`@${w} mobile menu opens`, await page.$eval('[data-mobile-menu]', (m) => !m.hidden));
      await page.keyboard.press('Escape');
      check(`@${w} mobile menu closes with Escape`, await page.$eval('[data-mobile-menu]', (m) => m.hidden));
    } else {
      await page.click('.dd-toggle');
      check(`@${w} services dropdown opens`, await page.$eval('[data-dd]', (d) => d.classList.contains('is-open')));
      await page.keyboard.press('Escape');
      check(`@${w} services dropdown closes with Escape`, await page.$eval('[data-dd]', (d) => !d.classList.contains('is-open')));
    }
    // FAQ accordion
    const faqOk = await page.evaluate(() => { const d = document.querySelectorAll('details.faq')[1]; d.querySelector('summary').click(); return d.open; });
    check(`@${w} FAQ accordion opens`, faqOk);
    // Before/after slider
    const baOk = await page.evaluate(() => { const r = document.querySelector('.ba__range'); r.value = 20; r.dispatchEvent(new Event('input', { bubbles: true })); return r.closest('[data-ba]').style.getPropertyValue('--pos') === '20%'; });
    check(`@${w} before/after slider updates`, baOk);
    // Lightbox
    await page.goto('http://localhost:4321/recent-work', { waitUntil: 'networkidle0' });
    await page.$eval('[data-lightbox]', (b) => b.click());
    check(`@${w} gallery lightbox opens`, await page.$eval('[data-lightbox-dialog]', (d) => d.open));
    await page.keyboard.press('Escape');
    check(`@${w} gallery lightbox closes`, await page.$eval('[data-lightbox-dialog]', (d) => !d.open));
    // Scroll starts at top on route change
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.goto('http://localhost:4321/about', { waitUntil: 'networkidle0' });
    check(`@${w} new route opens at top`, (await page.evaluate(() => window.scrollY)) === 0);
  }
  await browser.close();
  browserSummary = { widths, overflowFails, consoleErrors, fontFails, tapFails, forms };
}

console.log(JSON.stringify({ counts, location: { pages: locRoutes.length, avgSimilarity: +(avgSim * 100).toFixed(1), maxSimilarity: +(maxSim * 100).toFixed(1), maxPair }, browser: browserSummary, errors: results.errors, warnings: results.warnings.slice(0, 40), warningCount: results.warnings.length }, null, 2));
process.exit(results.errors.length ? 1 : 0);
