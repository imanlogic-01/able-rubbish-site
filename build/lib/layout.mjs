import { site } from '../../src/data/site.mjs';
import { services } from '../../src/data/services.mjs';
import { locations, locationPath } from '../../src/data/locations.mjs';
import { esc, abs, tel, mailto, icon, heroPreload, imageMeta, addressLine } from './util.mjs';
import { graph } from './schema.mjs';

const BUILD_YEAR = new Date().getFullYear();

export const logoMark = (cls = '') => `<svg class="logo-mark ${cls}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4a16 16 0 0 1 15.2 11" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M36.5 9.8l-1.2 5.6-5.4-1.9" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M35.6 24A16 16 0 0 1 12 34.2" fill="none" stroke="var(--logo-accent, #2E7A1E)" stroke-width="3.2" stroke-linecap="round"/><path d="M13.4 28.6L11.6 34l5.5 1.4" fill="none" stroke="var(--logo-accent, #2E7A1E)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.2 26.5A16 16 0 0 1 10 7.4" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" opacity=".55"/><path d="M14.5 15h11l-1.4 12.5h-8.2z" fill="currentColor"/><path d="M13 13h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;

export const logo = () => `<a class="logo" href="/" aria-label="${esc(site.name)} — home">${logoMark()}<span class="logo-text"><strong>Able</strong><span>Rubbish &amp; Gardening</span></span></a>`;

// Countdown to the date the site is disabled. Rendered statically (date always readable without JS);
// site.js fills in and ticks the countdown. If the build runs after the deadline, the expired state is baked in.
function disableNotice() {
  const n = site.disableNotice;
  if (!n?.enabled) return '';
  const ends = new Date(n.endsAt);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(ends)
      .map((x) => [x.type, x.value]),
  );
  const when = `${p.hour}:${p.minute} GMT, ${p.weekday} ${p.day} ${p.month} ${p.year}`; // e.g. 23:59 GMT, Sunday 20 September 2026
  const expired = Date.now() >= ends.getTime();
  const unit = (key, label) => `<span class="notice__unit"><b data-cd="${key}">00</b>${label}</span>`;
  return `
<div class="notice${expired ? ' is-expired' : ''}" role="region" aria-label="Site notice" data-countdown="${esc(n.endsAt)}">
  <div class="container notice__inner">
    <p class="notice__sr sr-only">${esc(n.text.replace(/\s+in$/, ''))} at ${esc(when)}.</p>
    <p class="notice__live" aria-hidden="true">
      <span class="notice__text"><span class="notice__long">${esc(n.text)}</span><span class="notice__short">${esc(n.shortText)}</span></span>
      <span class="notice__timer">${unit('d', 'd')}${unit('h', 'h')}${unit('m', 'm')}${unit('s', 's')}</span>
      <span class="notice__when">at <time datetime="${esc(n.endsAt)}">${esc(when)}</time></span>
    </p>
    <p class="notice__done">${esc(n.expiredText)}</p>
  </div>
</div>`;
}

function header({ overHero }) {
  const serviceLinks = services
    .map((s, i) => `<li><a href="/services/${s.slug}"><span class="dd-num">0${i + 1}</span><span><strong>${esc(s.navLabel)}</strong><small>${esc(s.summary.split(' — ')[0])}</small></span></a></li>`)
    .join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
${disableNotice()}
<header class="site-header${overHero ? ' is-over-hero' : ''}" data-header>
  <div class="container header-inner">
    ${logo()}
    <nav class="primary-nav" aria-label="Main">
      <ul>
        <li><a href="/">Home</a></li>
        <li class="has-dd" data-dd>
          <a href="/services" class="dd-link">Services</a>
          <button class="dd-toggle" type="button" aria-expanded="false" aria-controls="dd-services"><span class="sr-only">Show services menu</span>${icon.chevron}</button>
          <div class="dd-panel" id="dd-services">
            <ul>${serviceLinks}</ul>
            <a class="dd-all" href="/services">All services ${icon.arrow}</a>
          </div>
        </li>
        <li><a href="/service-areas">Service Areas</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <div class="header-actions">
      <a class="header-phone" href="${tel}">${icon.phone}<span>${site.phone.display}</span></a>
      <a class="btn btn--primary btn--sm" href="${site.primaryCta.href}">${site.primaryCta.label}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle><span class="sr-only">Open menu</span><span class="burger" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" hidden data-mobile-menu>
  <div class="mobile-menu__inner container">
    <nav aria-label="Mobile">
      <ul class="mm-primary">
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/service-areas">Service Areas</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <p class="label label--muted">Our services</p>
      <ul class="mm-services">
        ${services.map((s) => `<li><a href="/services/${s.slug}">${esc(s.navLabel)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="mm-actions">
      <a class="btn btn--primary btn--lg" href="${site.primaryCta.href}">${site.primaryCta.label} ${icon.arrow}</a>
      <a class="btn btn--outline btn--lg" href="${tel}">${icon.phone} ${site.phone.display}</a>
      <p class="mm-hours">${icon.clock} ${site.hours.label}</p>
    </div>
  </div>
</div>`;
}

function footer() {
  const topAreas = ['basildon', 'southend-on-sea', 'romford', 'ilford', 'brentwood', 'billericay', 'hornchurch', 'dagenham', 'stratford', 'rayleigh'];
  const areaLinks = topAreas
    .map((slug) => locations.find((l) => l.slug === slug))
    .map((l) => `<li><a href="${locationPath(l)}">${esc(l.name)}</a></li>`)
    .join('');
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-cta">
      <p class="footer-cta__title">Rubbish gone. Space back.<br><span>One call to <span class="nowrap">${site.phone.display}</span>.</span></p>
      <div class="footer-cta__actions">
        <a class="btn btn--primary btn--lg" href="${site.primaryCta.href}">${site.primaryCta.label} ${icon.arrow}</a>
        <a class="btn btn--light-outline btn--lg" href="${tel}">${icon.phone} Call now</a>
      </div>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        ${logo()}
        <p>${esc(site.description)}</p>
        <ul class="footer-social">
          <li><a href="${site.links.facebook}" rel="noopener" target="_blank">${icon.facebook}<span class="sr-only">Facebook (opens in a new tab)</span></a></li>
          <li><a href="${site.links.google}" rel="noopener" target="_blank">${icon.google}<span class="sr-only">Google reviews (opens in a new tab)</span></a></li>
        </ul>
      </div>
      <nav class="footer-col" aria-label="Services">
        <p class="footer-title">Services</p>
        <ul>${services.map((s) => `<li><a href="/services/${s.slug}">${esc(s.navLabel)}</a></li>`).join('')}<li><a href="/recent-work">Recent work</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Areas">
        <p class="footer-title">Areas</p>
        <ul>${areaLinks}<li><a href="/service-areas">All ${locations.length} areas</a></li></ul>
      </nav>
      <nav class="footer-col" aria-label="Company">
        <p class="footer-title">Company</p>
        <ul><li><a href="/about">About</a></li><li><a href="/faq">FAQ</a></li><li><a href="/contact">Contact</a></li><li><a href="/get-a-quote">Get a quote</a></li></ul>
      </nav>
      <div class="footer-col">
        <p class="footer-title">Contact</p>
        <ul class="footer-contact">
          <li><a href="${tel}">${icon.phone}${site.phone.display}</a></li>
          <li><a href="${mailto}">${icon.mail}<span class="break">${site.email}</span></a></li>
          <li>${icon.clock}<span>${site.hours.label}</span></li>
          <li>${icon.pin}<span>${esc(addressLine())}<br>Serving ${site.primaryLocation}, south Essex &amp; east London</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span data-year>${BUILD_YEAR}</span> ${esc(site.name)}. ${esc(site.legalName)}, company number ${site.companyNumber}.</p>
      <nav aria-label="Legal"><ul><li><a href="/privacy-policy">Privacy</a></li><li><a href="/terms-and-conditions">Terms</a></li><li><a href="/accessibility">Accessibility</a></li><li><a href="/complaints-policy">Complaints</a></li></ul></nav>
    </div>
  </div>
</footer>
<a class="mobile-call" href="${tel}" data-mobile-call>${icon.phone}<span>Call ${site.phone.display}</span></a>`;
}

export function page({ path, title, description, body, schema = [], noindex = false, overHero = false, preloadImage = null, preloadSizes = '(min-width: 1024px) 50vw, 100vw', ogImage = null, bodyClass = '' }) {
  const canonical = abs(path);
  const og = ogImage ? (() => { const m = imageMeta(ogImage); const w = m.widths.find((x) => x >= 1200) || m.widths.at(-1); return { url: `${site.url}/img/${m.slug}-${w}.jpg`, w, h: Math.round((m.height / m.width) * w) }; })() : { url: `${site.url}/img/og-able-rubbish-and-gardening-services.jpg`, w: 1200, h: 630 };
  return `<!doctype html>
<html lang="en-GB"${site.disableNotice?.enabled ? ' class="has-notice"' : ''}>
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js')</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#0C1530">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og.url}">
<meta property="og:image:width" content="${og.w}">
<meta property="og:image:height" content="${og.h}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/manrope-latin-var.woff2" as="font" type="font/woff2" crossorigin>
${preloadImage ? heroPreload(preloadImage, preloadSizes) : ''}
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_VERSION}">
<script type="application/ld+json">${graph(...schema)}</script>
<script src="/assets/site.js?v=${BUILD_VERSION}" defer></script>
</head>
<body class="${overHero ? 'has-hero ' : ''}${bodyClass}">
${header({ overHero })}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>`;
}

export const BUILD_VERSION = Date.now().toString(36);
