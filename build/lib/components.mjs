import { site, reviews } from '../../src/data/site.mjs';
import { services, serviceBySlug } from '../../src/data/services.mjs';
import { locations, locationGroups, locationPath, locationBySlug } from '../../src/data/locations.mjs';
import { esc, picture, tel, mailto, icon, stars, imageMeta, addressLine } from './util.mjs';

const pad = (n) => String(n).padStart(2, '0');

export const breadcrumb = (crumbs) => `
<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs
  .map((c, i) => (i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${c.href}">${esc(c.name)}</a></li>`))
  .join('')}</ol></nav>`;

export const ctaButtons = ({ light = false, secondary = { label: 'View our services', href: '/services' } } = {}) => `
<div class="cta-row">
  <a class="btn btn--primary btn--lg" href="${site.primaryCta.href}">${site.primaryCta.label} ${icon.arrow}</a>
  ${secondary ? `<a class="btn ${light ? 'btn--light-outline' : 'btn--outline'} btn--lg" href="${secondary.href}">${esc(secondary.label)}</a>` : ''}
</div>`;

export const proofStrip = ({ dark = false } = {}) => `
<ul class="proof${dark ? ' proof--dark' : ''}" aria-label="Why customers trust us">
  <li><a href="${site.links.google}" target="_blank" rel="noopener"><span class="proof__value">${site.proof.googleRating}${stars(5)}</span><span class="proof__label">Google rating from ${site.proof.googleReviewCount} reviews</span></a></li>
  <li><a href="${site.links.facebook}" target="_blank" rel="noopener"><span class="proof__value">${site.proof.facebookRecommend}</span><span class="proof__label">Recommend us on Facebook (${site.proof.facebookReviewCount} reviews)</span></a></li>
  <li><div><span class="proof__value">7 days</span><span class="proof__label">A week, from 6am to 11pm</span></div></li>
  <li><a href="/service-areas"><span class="proof__value">${locations.length}</span><span class="proof__label">Towns and areas covered</span></a></li>
</ul>`;

export function numberedServices({ heading = 'Four services. One team that does the lifting.', label = 'What we do', intro = '' } = {}) {
  return `
<section class="section" aria-labelledby="svc-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">${label}</p><h2 id="svc-h" class="h2">${heading}</h2></div>
      ${intro ? `<p class="lead">${intro}</p>` : ''}
    </div>
    <ol class="svc-list">
      ${services
        .map(
          (s, i) => `
      <li class="svc-row reveal${i % 2 ? ' svc-row--flip' : ''}">
        <div class="svc-row__media">${picture(s.image, { sizes: '(min-width: 1024px) 46vw, 100vw', position: s.image === 'hallwayBefore' ? '50% 60%' : null })}</div>
        <div class="svc-row__body">
          <span class="svc-row__num" aria-hidden="true">${pad(i + 1)}</span>
          <h3 class="h3"><a href="/services/${s.slug}" class="stretched">${esc(s.navLabel)}</a></h3>
          <p>${esc(s.summary)}</p>
          <ul class="tick-list">${s.includes.slice(0, 3).map((x) => `<li>${icon.check}${esc(x.title)}</li>`).join('')}</ul>
          <span class="text-link" aria-hidden="true">Explore ${esc(s.name.toLowerCase())} ${icon.arrow}</span>
        </div>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`;
}

export function processSection({ steps, heading = 'From first call to cleared space', label = 'How it works', dark = true, intro = '' }) {
  return `
<section class="section ${dark ? 'section--dark' : 'section--tint'} process-section" aria-labelledby="process-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">${label}</p><h2 id="process-h" class="h2">${heading}</h2></div>
      ${intro ? `<p class="lead">${intro}</p>` : ''}
    </div>
    <ol class="process">
      ${steps.map((s, i) => `<li class="process__step reveal"><span class="process__num" aria-hidden="true">${pad(i + 1)}</span><h3 class="h4">${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>`;
}

export const beforeAfter = ([before, after], { caption = '', eager = false, sizes = '(min-width: 1024px) 50vw, 100vw' } = {}) => {
  const b = imageMeta(before);
  return `
<figure class="ba" data-ba style="--ratio:${b.width}/${b.height}">
  <div class="ba__frame">
    <div class="ba__img ba__img--before">${picture(before, { sizes, eager })}<span class="ba__tag">Before</span></div>
    <div class="ba__img ba__img--after">${picture(after, { sizes, eager })}<span class="ba__tag ba__tag--after">After</span></div>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
    <span class="ba__handle" aria-hidden="true"><i></i></span>
  </div>
  ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}
</figure>`;
};

export function reviewsSection({ bgImage = 'gardenAfter', heading = null } = {}) {
  const [feature, ...rest] = reviews;
  return `
<section class="section reviews" aria-labelledby="reviews-h">
  <div class="reviews__bg" aria-hidden="true">${picture(bgImage, { sizes: '100vw', alt: '' })}</div>
  <div class="container reviews__inner">
    <div class="reviews__head">
      <p class="label label--light">Customer reviews</p>
      <h2 id="reviews-h" class="h2">${heading || `Rated ${site.proof.googleRating} from ${site.proof.googleReviewCount} Google reviews`}</h2>
      <a class="text-link text-link--light" href="${site.links.google}" target="_blank" rel="noopener">Read all reviews on Google ${icon.arrow}<span class="sr-only"> (opens in a new tab)</span></a>
    </div>
    <figure class="review review--feature reveal">
      ${stars(feature.rating)}
      <blockquote><p>“${esc(feature.text)}”</p></blockquote>
      <figcaption><strong>${esc(feature.name)}</strong><span>${feature.source} review${feature.service ? ` · ${esc(feature.service)}` : ''}</span></figcaption>
    </figure>
    <div class="reviews__grid">
      ${rest
        .map(
          (r) => `<figure class="review reveal">${stars(r.rating)}<blockquote><p>“${esc(r.text)}”</p></blockquote><figcaption><strong>${esc(r.name)}</strong><span>${r.source} review${r.service ? ` · ${esc(r.service)}` : ''}</span></figcaption></figure>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

export function faqList(faqs, { id = 'faq' } = {}) {
  return `<div class="faq-list">${faqs
    .map(
      (f, i) => `<details class="faq"${i === 0 ? ' open' : ''}><summary><h3 class="faq__q" id="${id}-${i + 1}">${esc(f.q)}</h3><span class="faq__icon" aria-hidden="true">${icon.plus}</span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`,
    )
    .join('')}</div>`;
}

export function faqSection(faqs, { heading = 'Questions people ask before booking', label = 'FAQ', id = 'faq', aside = '' } = {}) {
  return `
<section class="section" aria-labelledby="${id}-h">
  <div class="container faq-layout">
    <div class="faq-layout__aside">
      <p class="label">${label}</p>
      <h2 id="${id}-h" class="h2">${heading}</h2>
      ${aside || `<p>Can’t see your question? Call <a href="${tel}">${site.phone.display}</a> — we’re available 7 days a week, 6am to 11pm.</p>`}
      <a class="btn btn--outline" href="/faq">All FAQs ${icon.arrow}</a>
    </div>
    ${faqList(faqs, { id })}
  </div>
</section>`;
}

export function finalCta({ title = 'Ready to get it cleared?', text = `Tell us what needs to go and get a clear, free quote from a team serving ${site.primaryLocation} and the surrounding areas.`, image = 'van', withForm = false, context = '' } = {}) {
  return `
<section class="final-cta${withForm ? ' final-cta--form' : ''}" aria-labelledby="final-cta-h">
  <div class="final-cta__bg" aria-hidden="true">${picture(image, { sizes: '100vw', alt: '' })}</div>
  <div class="container final-cta__inner">
    <div class="final-cta__copy">
      <p class="label label--light">Free, no-obligation quotes</p>
      <h2 id="final-cta-h" class="h-xl">${esc(title)}</h2>
      <p class="lead">${esc(text)}</p>
      <div class="cta-row">
        <a class="btn btn--primary btn--lg" href="${site.primaryCta.href}">Request a quote ${icon.arrow}</a>
        <a class="btn btn--light-outline btn--lg" href="${tel}">${icon.phone} ${site.phone.display}</a>
      </div>
      <p class="final-cta__hours">${icon.clock} ${site.hours.label}</p>
    </div>
    ${withForm ? quickForm({ context }) : ''}
  </div>
</section>`;
}

export function quickForm({ context = '', heading = 'Quick quote' } = {}) {
  const uid = Math.random().toString(36).slice(2, 7);
  return `
<form class="quick-form" data-lead-form data-form-name="Quick quote" novalidate>
  <p class="quick-form__title">${heading}</p>
  <p class="quick-form__sub">Leave your details and we’ll call you back with a price.</p>
  <input type="hidden" name="context" value="${esc(context)}">
  <div class="hp" aria-hidden="true"><label for="qf-web-${uid}">Leave this field empty</label><input id="qf-web-${uid}" name="website" tabindex="-1" autocomplete="off"></div>
  <div class="field"><label for="qf-name-${uid}">Name</label><input id="qf-name-${uid}" name="name" autocomplete="name" required></div>
  <div class="field-row">
    <div class="field"><label for="qf-phone-${uid}">Phone</label><input id="qf-phone-${uid}" name="phone" type="tel" autocomplete="tel" inputmode="tel" required data-validate="phone"></div>
    <div class="field"><label for="qf-postcode-${uid}">Postcode</label><input id="qf-postcode-${uid}" name="postcode" autocomplete="postal-code" required data-validate="postcode"></div>
  </div>
  <div class="field"><label for="qf-email-${uid}">Email</label><input id="qf-email-${uid}" name="email" type="email" autocomplete="email" inputmode="email" required data-validate="email"></div>
  <div class="field"><label for="qf-service-${uid}">Service</label><select id="qf-service-${uid}" name="service" required><option value="">Choose a service</option>${services.map((s) => `<option>${esc(s.name)}</option>`).join('')}<option>Tree Removal</option><option>Something else</option></select></div>
  <div class="field"><label for="qf-msg-${uid}">What needs removing? <span class="optional">(optional)</span></label><textarea id="qf-msg-${uid}" name="message" rows="3"></textarea></div>
  <button class="btn btn--primary btn--block btn--lg" type="submit">Get my free quote ${icon.arrow}</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  <p class="form-note">By sending this form you agree to be contacted about your enquiry. See our <a href="/privacy-policy">privacy policy</a>.</p>
</form>`;
}

// Two-step animated lead form for the hero: tap a service, then leave contact details.
export function heroForm({ context = '' } = {}) {
  const opts = [...services.map((s) => s.name), 'Tree Removal', 'Something else'];
  return `
<form class="hero-form" data-lead-form data-hero-form data-form-name="Hero quick quote" novalidate aria-labelledby="hf-title">
  <div class="hero-form__bar" aria-hidden="true"><i data-hf-bar></i></div>
  <p class="hero-form__kicker">${esc(site.slogan)}</p>
  <p class="hero-form__title" id="hf-title">Get your free quote in 30 seconds</p>
  <input type="hidden" name="context" value="${esc(context)}">
  <div class="hp" aria-hidden="true"><label for="hf-web">Leave this field empty</label><input id="hf-web" name="website" tabindex="-1" autocomplete="off"></div>
  <div class="hero-form__steps">
    <fieldset class="hf-step is-active" data-hf-step>
      <legend>What needs clearing?</legend>
      <div class="hf-chips">${opts.map((o, i) => `<label class="hf-chip" style="--i:${i}"><input type="radio" name="service" value="${esc(o)}" required><span>${esc(o)}</span></label>`).join('')}</div>
      <p class="hf-hint">Tap one to continue — you can add the details on the phone.</p>
    </fieldset>
    <div class="hf-step" data-hf-step inert>
      <button type="button" class="hf-back" data-hf-back>${icon.arrow}<span>Back</span></button>
      <p class="hf-chosen">Quote for: <strong data-hf-chosen>—</strong></p>
      <div class="field"><label for="hf-name">Name</label><input id="hf-name" name="name" autocomplete="name" required></div>
      <div class="field-row">
        <div class="field"><label for="hf-phone">Phone</label><input id="hf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required data-validate="phone"></div>
        <div class="field"><label for="hf-postcode">Postcode</label><input id="hf-postcode" name="postcode" autocomplete="postal-code" required data-validate="postcode"></div>
      </div>
      <div class="field"><label for="hf-email">Email <span class="optional">(for your confirmation)</span></label><input id="hf-email" name="email" type="email" autocomplete="email" inputmode="email" required data-validate="email"></div>
      <button class="btn btn--primary btn--block btn--lg hf-submit" type="submit"><span>Get my free quote</span> ${icon.arrow}</button>
    </div>
  </div>
  <p class="form-status" role="status" aria-live="polite"></p>
  <p class="form-note">Free, no obligation. By sending this form you agree to be contacted about your enquiry — <a href="/privacy-policy">privacy policy</a>.</p>
</form>`;
}

// Coverage map — plotted from real coordinates, with distance rings around Basildon.
export function coverageMap({ highlight = null } = {}) {
  const base = locationBySlug.basildon;
  const cosLat = Math.cos((51.56 * Math.PI) / 180);
  const K = 1252 / cosLat; // px per degree latitude equivalent
  const minLng = -0.03, maxLat = 51.645;
  const px = (l) => ({ x: 40 + (l.lng - minLng) * cosLat * K, y: 36 + (maxLat - l.lat) * K });
  const b = px(base);
  const milePx = K / 69;
  const numbered = orderedLocations();
  const dots = numbered
    .map(({ l, n }) => {
      const p = px(l);
      const nudge = { wanstead: [-10, 4], redbridge: [8, -6], 'newbury-park': [8, -2], ilford: [2, 6] }[l.slug];
      if (nudge) { p.x += nudge[0]; p.y += nudge[1]; }
      const isBase = l.slug === 'basildon';
      const hl = highlight === l.slug;
      return `<g class="map-dot${isBase ? ' map-dot--base' : ''}${hl ? ' map-dot--hl' : ''}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${isBase ? 20 : 15}"/><text x="${p.x.toFixed(1)}" y="${(p.y + 5).toFixed(1)}">${isBase ? '★' : n}</text></g>`;
    })
    .join('');
  const rings = [10, 20]
    .map((m) => `<circle class="map-ring" cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${(m * milePx).toFixed(1)}"/><text class="map-ring-label" x="${(b.x - Math.sqrt((m * milePx) ** 2 - (366 - b.y) ** 2) + 42).toFixed(1)}" y="366">${m} miles</text>`)
    .join('');
  return `<svg class="coverage-map" viewBox="0 0 1000 380" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Service area map</title><desc id="map-desc">Map of the ${locations.length} towns and areas covered, from Southend-on-Sea in the east to Stratford and Woolwich in the west, with rings showing 10 and 20 miles from Basildon. The numbered list alongside links to each area.</desc><defs><clipPath id="map-clip"><rect width="1000" height="380" rx="0"/></clipPath></defs><g clip-path="url(#map-clip)">${rings}</g>${dots}<text class="map-label" x="${(b.x + 24).toFixed(1)}" y="${(b.y - 20).toFixed(1)}">Basildon</text><text class="map-region" x="700" y="300">SOUTH ESSEX</text><text class="map-region" x="120" y="366">EAST LONDON</text><text class="map-compass" x="985" y="26">N ↑</text></svg>`;
}

export function orderedLocations() {
  let n = 0;
  return locationGroups.flatMap((g) => locations.filter((l) => l.group === g.id).map((l) => ({ l, g, n: l.slug === 'basildon' ? '★' : ++n })));
}

export function areaGroups({ highlight = null, compact = false } = {}) {
  const items = orderedLocations();
  return `<div class="area-groups${compact ? ' area-groups--compact' : ''}">${locationGroups
    .map(
      (g) => `<div class="area-group"><h3 class="area-group__title">${esc(g.name)}</h3><ul>${items
        .filter((x) => x.g.id === g.id)
        .map(({ l, n }) => `<li${highlight === l.slug ? ' class="is-current"' : ''}><a href="${locationPath(l)}"><span class="area-num" aria-hidden="true">${n}</span>${esc(l.name)}</a></li>`)
        .join('')}</ul></div>`,
    )
    .join('')}</div>`;
}

export function coverageSection({ heading = `Based around ${site.primaryLocation}, covering south Essex and east London`, text = null } = {}) {
  return `
<section class="section section--tint" aria-labelledby="coverage-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">Service areas</p><h2 id="coverage-h" class="h2">${heading}</h2></div>
      <div>
        <p class="lead">${text || `We cover ${locations.length} towns and areas — from Southend-on-Sea and Rayleigh, through Basildon, Brentwood and Havering, to Redbridge, Newham and across the river to Woolwich and Erith.`}</p>
        <a class="text-link" href="/service-areas">See every area we cover ${icon.arrow}</a>
      </div>
    </div>
    <div class="coverage">
      <div class="coverage__map reveal">${coverageMap()}</div>
      ${areaGroups({ compact: true })}
    </div>
  </div>
</section>`;
}

export const nearestLocations = (loc, count = 4) =>
  locations
    .filter((l) => l.slug !== loc.slug)
    .map((l) => ({ l, d: Math.hypot((l.lat - loc.lat) * 69, (l.lng - loc.lng) * 69 * Math.cos((loc.lat * Math.PI) / 180)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((x) => x.l);

export const milesFromBasildon = (loc) => {
  const b = locationBySlug.basildon;
  return Math.hypot((loc.lat - b.lat) * 69, (loc.lng - b.lng) * 69 * Math.cos((b.lat * Math.PI) / 180));
};

export const serviceLinkCards = (slugs, { heading = 'Related services', label = 'Also available' } = {}) => `
<section class="section section--tint" aria-labelledby="related-h">
  <div class="container">
    <div class="section-head"><p class="label">${label}</p><h2 id="related-h" class="h2">${heading}</h2></div>
    <ul class="link-cards">
      ${slugs
        .map((slug) => serviceBySlug[slug])
        .map(
          (s) => `<li class="link-card reveal"><div class="link-card__media">${picture(s.image, { sizes: '(min-width: 1024px) 30vw, 100vw' })}</div><div class="link-card__body"><p class="label label--muted">${esc(s.label)}</p><h3 class="h4"><a class="stretched" href="/services/${s.slug}">${esc(s.navLabel)}</a></h3><p>${esc(s.summary)}</p><span class="text-link" aria-hidden="true">Learn more ${icon.arrow}</span></div></li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;

export const contactList = () => `
<ul class="contact-list">
  <li><span class="contact-list__icon">${icon.phone}</span><span><span class="contact-list__label">Call</span><a href="${tel}">${site.phone.display}</a></span></li>
  <li><span class="contact-list__icon">${icon.mail}</span><span><span class="contact-list__label">Email</span><a class="break" href="${mailto}">${site.email}</a></span></li>
  <li><span class="contact-list__icon">${icon.clock}</span><span><span class="contact-list__label">Hours</span>${site.hours.label}</span></li>
  <li><span class="contact-list__icon">${icon.pin}</span><span><span class="contact-list__label">Address</span>${esc(addressLine())}</span></li>
  <li><span class="contact-list__icon">${icon.pin}</span><span><span class="contact-list__label">Coverage</span>${site.primaryLocation}, south Essex &amp; east London — <a href="/service-areas">see all areas</a></span></li>
</ul>`;
