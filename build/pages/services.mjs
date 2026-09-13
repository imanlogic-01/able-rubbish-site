import { site, reviews } from '../../src/data/site.mjs';
import { services } from '../../src/data/services.mjs';
import { locations, locationPath } from '../../src/data/locations.mjs';
import { picture, icon, tel, esc, stars } from '../lib/util.mjs';
import * as schema from '../lib/schema.mjs';
import { breadcrumb, ctaButtons, proofStrip, numberedServices, processSection, beforeAfter, faqSection, finalCta, serviceLinkCards, areaGroups } from '../lib/components.mjs';

const pad = (n) => String(n).padStart(2, '0');

export function servicesHubPage() {
  const path = '/services';
  const title = 'Our Services | Waste Removal & Clearances | Able Rubbish';
  const description = 'Waste removal, house clearance, builders’ waste and rubble removal, and garden clearance across Basildon, south Essex and east London. Free quotes, 7 days a week.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Services', href: path }];

  const body = `
<section class="page-hero page-hero--split">
  <div class="container page-hero__grid">
    <div class="page-hero__copy">
      ${breadcrumb(crumbs)}
      <p class="label">Our services</p>
      <h1 class="h1">Waste removal and clearance services for homes, trades and gardens</h1>
      <p class="lead">${esc(site.name)} provides four core services across ${site.primaryLocation}, south Essex and east London. Each one comes with the same approach: a free quote, a team that does the lifting and everything taken away in one visit.</p>
      ${ctaButtons({ secondary: { label: `Call ${site.phone.display}`, href: tel } })}
    </div>
    <div class="page-hero__media">${picture('van', { eager: true, sizes: '(min-width: 1024px) 50vw, 100vw' })}</div>
  </div>
</section>

<div class="container proof-wrap">${proofStrip()}</div>

${numberedServices({ heading: 'Choose the service that fits the job', label: 'Services', intro: 'Not sure which you need? Most jobs mix a bit of everything. Describe it when you ask for a quote and we’ll cover it in one visit.' })}

<section class="section section--tint" aria-labelledby="also-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">Also included</p><h2 id="also-h" class="h2">Smaller jobs we take on every week</h2></div>
      <p class="lead">These are handled within our main services, so there’s no job too small to ask about.</p>
    </div>
    <ul class="chip-grid">
      ${['Sofa disposal', 'Mattress removal', 'Fridge and freezer disposal', 'Furniture removal', 'Garage clear-outs', 'Shed and greenhouse removal', 'Office clearance', 'Shop fitting removal', 'Kitchen and bathroom rip-outs', 'Garage and shed demolition', 'Grass cuttings and green waste', 'Hedge and tree cutting', 'Scrap collection', 'Wait and load']
        .map((c) => `<li>${icon.check}${c}</li>`)
        .join('')}
    </ul>
  </div>
</section>

${processSection({ steps: services[0].process, heading: 'The same simple process for every service' })}

${finalCta({ title: 'Tell us about the job', text: 'Describe what needs removing or clearing and we’ll come back with a free, no-obligation quote.', image: 'garagesAfter' })}
`;

  return {
    path, title, description, type: 'Services hub', primaryKeyword: 'rubbish removal services Basildon',
    preloadImage: 'van',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description, type: 'CollectionPage' }), schema.breadcrumbs(crumbs)],
    body,
  };
}

export function servicePage(s) {
  const path = `/services/${s.slug}`;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: s.name, href: path }];
  const review = s.slug === 'garden-clearance' || s.slug === 'builders-waste-removal' ? reviews[2] : s.slug === 'house-clearance' ? reviews[1] : reviews[0];
  const featureAreas = ['basildon', 'billericay', 'southend-on-sea', 'romford', 'brentwood', 'ilford', 'hornchurch', 'stratford'].map((slug) => locations.find((l) => l.slug === slug));

  const body = `
<section class="page-hero page-hero--split">
  <div class="container page-hero__grid">
    <div class="page-hero__copy">
      ${breadcrumb(crumbs)}
      <p class="label">${esc(s.label)}</p>
      <h1 class="h1">${esc(s.h1)}</h1>
      <p class="lead">${esc(s.heroLead)}</p>
      ${ctaButtons({ secondary: { label: `Call ${site.phone.display}`, href: tel } })}
      <p class="hero-note">${stars(5)} Rated ${site.proof.googleRating} from ${site.proof.googleReviewCount} Google reviews</p>
    </div>
    <div class="page-hero__media">${picture(s.image, { eager: true, sizes: '(min-width: 1024px) 50vw, 100vw', position: s.image === 'hallwayBefore' ? '50% 55%' : null })}</div>
  </div>
</section>

<section class="section" aria-labelledby="intro-h">
  <div class="container answer">
    <div class="answer__head"><p class="label">The short answer</p><h2 id="intro-h" class="h2">What is ${esc(s.name.toLowerCase())}?</h2></div>
    <div class="answer__body prose">${s.intro.map((p, i) => `<p${i === 0 ? ' class="answer__lead"' : ''}>${esc(p)}</p>`).join('')}</div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="includes-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">What’s included</p><h2 id="includes-h" class="h2">What does our ${esc(s.name.toLowerCase())} service include?</h2></div>
      <p class="lead">Every job is quoted for free first. Here’s what we regularly handle.</p>
    </div>
    <ol class="includes">
      ${s.includes.map((x, i) => `<li class="reveal"><span class="includes__num" aria-hidden="true">${pad(i + 1)}</span><h3 class="h4">${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="who-h">
  <div class="container split">
    <div class="split__media reveal">${s.beforeAfter ? beforeAfter(s.beforeAfter, { caption: 'Recent work from our Facebook page — drag to compare.' }) : picture(s.featureImage, { sizes: '(min-width: 1024px) 45vw, 100vw' })}</div>
    <div class="split__copy">
      <p class="label">Who it’s for</p>
      <h2 id="who-h" class="h2">Who uses our ${esc(s.name.toLowerCase())} service?</h2>
      <ul class="tick-list tick-list--lg">${s.whoFor.map((w) => `<li>${icon.check}${esc(w)}</li>`).join('')}</ul>
      <h3 class="h3 split__sub">Key benefits</h3>
      <dl class="benefits">
        ${s.benefits.map((b) => `<div><dt>${esc(b.title)}</dt><dd>${esc(b.text)}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
</section>

${processSection({ steps: s.process, heading: `How ${s.name.toLowerCase()} works` })}

<section class="section" aria-labelledby="jobs-h">
  <div class="container jobs">
    <div class="jobs__copy">
      <p class="label">Common jobs</p>
      <h2 id="jobs-h" class="h2">Typical ${esc(s.name.toLowerCase())} jobs</h2>
      <ul class="chip-grid chip-grid--tight">${s.jobTypes.map((j) => `<li>${icon.check}${esc(j)}</li>`).join('')}</ul>
      <figure class="review review--inline">
        ${stars(review.rating)}
        <blockquote><p>“${esc(review.text)}”</p></blockquote>
        <figcaption><strong>${esc(review.name)}</strong><span>Google review</span></figcaption>
      </figure>
    </div>
    <div class="jobs__media reveal">
      ${s.beforeAfterSecondary ? beforeAfter(s.beforeAfterSecondary, { caption: 'Front garden before and after clearance.', sizes: '(min-width: 1024px) 40vw, 100vw' }) : picture(s.featureImage, { sizes: '(min-width: 1024px) 40vw, 100vw', className: 'rounded-media' })}
    </div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="why-h">
  <div class="container why-strip">
    <div><p class="label label--light">Why choose us</p><h2 id="why-h" class="h2">Why book ${esc(site.shortName)} for ${esc(s.name.toLowerCase())}?</h2></div>
    <ul class="why-strip__list">
      <li><strong>${site.proof.googleRating}★ on Google</strong><span>From ${site.proof.googleReviewCount} reviews</span></li>
      <li><strong>Free quotes</strong><span>Price agreed before we start</span></li>
      <li><strong>6am – 11pm</strong><span>7 days a week</span></li>
      <li><strong>We do the lifting</strong><span>Carried out and taken away</span></li>
    </ul>
  </div>
</section>

${serviceLinkCards(s.related, { heading: 'Services that often go together', label: 'Related services' })}

<section class="section" aria-labelledby="areas-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">Areas served</p><h2 id="areas-h" class="h2">${esc(s.name)} across ${site.primaryLocation}, Essex and east London</h2></div>
      <div><p class="lead">We provide ${esc(s.name.toLowerCase())} in all ${locations.length} of our service areas, including ${featureAreas.slice(0, 6).map((l) => `<a href="${locationPath(l)}">${esc(l.name)}</a>`).join(', ')}.</p><a class="text-link" href="/service-areas">View all service areas ${icon.arrow}</a></div>
    </div>
    ${areaGroups({ compact: true })}
  </div>
</section>

${faqSection(s.faqs, { heading: `${s.name} questions`, id: 'svc-faq' })}

${finalCta({ title: `Get a free ${s.name.toLowerCase()} quote`, text: `Tell us what needs doing and we’ll give you a clear price — covering ${site.primaryLocation} and the surrounding areas, 7 days a week.`, image: s.slug === 'garden-clearance' ? 'frontAfter' : s.slug === 'house-clearance' ? 'hallwayAfter' : 'van' })}
`;

  return {
    path, title: s.title, description: s.metaDescription, type: 'Service', primaryKeyword: s.keyword,
    preloadImage: s.image,
    ogImage: s.image,
    schema: [
      schema.localBusiness(),
      schema.webPage({ path, title: s.title, description: s.metaDescription }),
      schema.service({ name: s.name, description: s.intro[0], path, areaServed: locations.map((l) => l.name), imageKey: s.image }),
      schema.breadcrumbs(crumbs),
      schema.faqPage(s.faqs),
    ],
    body,
  };
}
