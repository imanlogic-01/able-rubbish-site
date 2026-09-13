import { site, reviews } from '../../src/data/site.mjs';
import { services, serviceBySlug } from '../../src/data/services.mjs';
import { locations, locationGroups, locationPath, locationFaqPool } from '../../src/data/locations.mjs';
import { picture, icon, tel, esc, stars } from '../lib/util.mjs';
import * as schema from '../lib/schema.mjs';
import { breadcrumb, ctaButtons, proofStrip, processSection, faqList, finalCta, coverageMap, areaGroups, nearestLocations, milesFromBasildon, orderedLocations } from '../lib/components.mjs';

const pad = (n) => String(n).padStart(2, '0');

export function serviceAreasHubPage() {
  const path = '/service-areas';
  const title = 'Service Areas | Waste Removal Essex & East London | Able Rubbish';
  const description = `Areas covered by Able Rubbish and Gardening Services: Basildon, Southend-on-Sea, Rayleigh, Brentwood, Romford, Ilford, Stratford, Woolwich and ${locations.length - 8} more. Find your town.`;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Service Areas', href: path }];
  const groupIntro = {
    'south-essex': 'Our home patch. Basildon and the surrounding south Essex towns, from Brentwood in the west to Southend-on-Sea on the coast.',
    havering: 'The eastern edge of London and neighbouring Thurrock — Romford and its surrounding districts, plus Aveley.',
    redbridge: 'Barking and Dagenham, Redbridge and neighbouring Chigwell in Epping Forest District.',
    newham: 'Newham’s busy terraced streets and apartment blocks, and Chingford in Waltham Forest.',
    'south-thames': 'Two areas across the river in south-east London — Woolwich and Erith.',
  };
  const items = orderedLocations();

  const body = `
<section class="page-hero page-hero--plain">
  <div class="container">
    ${breadcrumb(crumbs)}
    <div class="page-hero__row">
      <div>
        <p class="label">Service areas</p>
        <h1 class="h1">Waste removal across ${site.primaryLocation}, south Essex and east London</h1>
      </div>
      <p class="lead">${esc(site.name)} covers ${locations.length} towns and areas, all within roughly 25 miles of ${site.primaryLocation}. Find your area below for local details, or call <a href="${tel}">${site.phone.display}</a> to check your street.</p>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="map-h">
  <div class="container">
    <h2 id="map-h" class="sr-only">Coverage map</h2>
    <div class="coverage coverage--hub">
      <div class="coverage__map">${coverageMap()}<p class="map-note">Numbers match the area list. Rings show straight-line distance from Basildon.</p></div>
      <div class="coverage__facts">
        <dl class="facts">
          <div><dt>${locations.length}</dt><dd>Towns and areas covered</dd></div>
          <div><dt>7 days</dt><dd>A week, 6am to 11pm</dd></div>
          <div><dt>4</dt><dd>Core services in every area</dd></div>
        </dl>
        ${ctaButtons({ secondary: { label: 'View services', href: '/services' } })}
      </div>
    </div>
  </div>
</section>

${locationGroups
  .map(
    (g, gi) => `
<section class="section area-block${gi % 2 === 0 ? ' section--tint' : ''}" aria-labelledby="g-${g.id}">
  <div class="container area-block__grid">
    <div>
      <p class="label">${pad(gi + 1)} / ${pad(locationGroups.length)}</p>
      <h2 id="g-${g.id}" class="h2">${esc(g.name)}</h2>
      <p class="lead">${groupIntro[g.id]}</p>
    </div>
    <ul class="area-cards">
      ${items
        .filter((x) => x.g.id === g.id)
        .map(({ l, n }) => `<li class="area-card reveal"><span class="area-card__num" aria-hidden="true">${n}</span><h3 class="h4"><a class="stretched" href="${locationPath(l)}">Waste removal in ${esc(l.name)}</a></h3><p>${esc(l.label)}</p><p class="area-card__meta">${esc(l.council)}${l.primary ? ' · Primary area' : ` · approx. ${Math.round(milesFromBasildon(l))} miles from Basildon`}</p><span class="area-card__arrow" aria-hidden="true">${icon.arrow}</span></li>`)
        .join('')}
    </ul>
  </div>
</section>`,
  )
  .join('')}

<section class="section" aria-labelledby="svc-h">
  <div class="container">
    <div class="section-head section-head--split"><div><p class="label">Available everywhere we cover</p><h2 id="svc-h" class="h2">Services in every area</h2></div><p class="lead">All four services are available in every town listed above.</p></div>
    <ul class="svc-mini">
      ${services.map((s, i) => `<li><span aria-hidden="true">${pad(i + 1)}</span><a href="/services/${s.slug}">${esc(s.navLabel)}</a><p>${esc(s.summary)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${finalCta({ title: 'Not sure if we cover your street?', text: `Call ${site.phone.display} or send a quote request with your postcode — we’ll confirm straight away.`, image: 'van' })}
`;

  return {
    path, title, description, type: 'Service areas hub', primaryKeyword: 'waste removal Essex east London',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description, type: 'CollectionPage' }), schema.breadcrumbs(crumbs)],
    body,
  };
}

// ---------- Location landing pages ----------

const lower = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const serviceBlurb = (s, l) => {
  if (l.variant === 'a') return s.summary;
  if (l.variant === 'b') return `Includes ${s.includes.slice(0, 3).map((x) => lower(x.title)).join(', ')} and more across ${l.name}.`;
  return `${s.includes[3].text} ${s.includes[4].title} also available.`;
};

const processHeadings = {
  a: (n) => `Booking a collection in ${n}`,
  b: (n) => `How a clearance in ${n} works`,
  c: (n) => `From phone call to clear space in ${n}`,
};
const processSteps = {
  a: (l) => [
    { title: 'Tell us what’s going', text: `Call ${site.phone.display} or request a quote with your ${l.name} postcode and a description or photos.` },
    { title: 'Free quote', text: 'We price on volume, waste type and access, and agree a time — 7 days a week.' },
    { title: 'We load it all', text: 'The team carries everything out and loads the van. No lifting for you.' },
    { title: 'Taken away', text: 'The waste leaves with us the same visit, leaving your space clear.' },
  ],
  b: (l) => [
    { title: 'Send photos or call', text: `Pictures of the rooms, garden or pile help us price a ${l.name} job accurately before we visit.` },
    { title: 'Agree the price', text: 'You get a clear, free quote. Nothing is booked until you’re happy with it.' },
    { title: 'Clearance day', text: 'We arrive at the agreed time, confirm what’s going and start carrying it out.' },
    { title: 'Space back', text: 'Everything is loaded and driven away, and you’re left with a cleared space.' },
  ],
  c: (l) => [
    { title: 'Describe the job', text: `Let us know what needs removing in ${l.name}, roughly how much, and anything about access or parking.` },
    { title: 'Pick a time', text: 'Choose a slot between 6am and 11pm, any day of the week, once the price is agreed.' },
    { title: 'Loaded for you', text: 'Furniture, bags, rubble or garden waste — the team does every bit of the lifting.' },
    { title: 'Nothing left behind', text: 'The van leaves full and your property is left clear, in a single visit.' },
  ],
};

export function locationPage(l, index) {
  const path = locationPath(l);
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Service Areas', href: '/service-areas' }, { name: l.name, href: path }];
  const nearby = nearestLocations(l, 4);
  const miles = Math.round(milesFromBasildon(l));
  const faqs = [...l.localFaqs, ...l.faqPool.map((k) => locationFaqPool[k](l))];
  const review = reviews[index % reviews.length];
  const primary = services[0];
  const emphasised = [primary, ...l.emphasis.map((slug) => serviceBySlug[slug])].filter((s, i, arr) => arr.indexOf(s) === i);

  const heroFull = l.variant === 'a';
  const hero = heroFull
    ? `
<section class="page-hero page-hero--full" aria-labelledby="loc-h1">
  <div class="page-hero__bg">${picture(l.image, { eager: true, sizes: '100vw' })}</div>
  <div class="container page-hero__content">
    ${breadcrumb(crumbs)}
    <p class="label label--light">${esc(l.label)}</p>
    <h1 id="loc-h1" class="h1">${esc(l.h1)}</h1>
    <p class="lead">${esc(l.lead)}</p>
    ${ctaButtons({ light: true, secondary: { label: `Call ${site.phone.display}`, href: tel } })}
  </div>
</section>`
    : `
<section class="page-hero page-hero--split${l.variant === 'c' ? ' page-hero--flip' : ''}" aria-labelledby="loc-h1">
  <div class="container page-hero__grid">
    <div class="page-hero__copy">
      ${breadcrumb(crumbs)}
      <p class="label">${esc(l.label)}</p>
      <h1 id="loc-h1" class="h1">${esc(l.h1)}</h1>
      <p class="lead">${esc(l.lead)}</p>
      ${ctaButtons({ secondary: { label: `Call ${site.phone.display}`, href: tel } })}
    </div>
    <div class="page-hero__media">${picture(l.image, { eager: true, sizes: '(min-width: 1024px) 50vw, 100vw' })}</div>
  </div>
</section>`;

  const sections = {
    intro: `
<section class="section" aria-labelledby="intro-h">
  <div class="container answer">
    <div class="answer__head">
      <p class="label">Do we cover ${esc(l.name)}?</p>
      <h2 id="intro-h" class="h2">Waste removal in ${esc(l.name)} from ${esc(site.shortName)}</h2>
      <dl class="loc-facts">
        <div><dt>Local authority</dt><dd>${esc(l.council)}</dd></div>
        <div><dt>Distance</dt><dd>${l.primary ? 'Our primary service area' : `Approx. ${miles} miles from Basildon`}</dd></div>
        <div><dt>Hours</dt><dd>${site.hours.label}</dd></div>
      </dl>
    </div>
    <div class="answer__body prose">${l.intro.map((p, i) => `<p${i === 0 ? ' class="answer__lead"' : ''}>${esc(p)}</p>`).join('')}</div>
  </div>
</section>`,

    services: `
<section class="section section--tint" aria-labelledby="svcs-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">Services in ${esc(l.name)}</p><h2 id="svcs-h" class="h2">What we clear in ${esc(l.name)}</h2></div>
      <p class="lead">Waste removal is our main service in ${esc(l.name)}, and it’s often combined with the services below in a single visit.</p>
    </div>
    <ol class="loc-services">
      ${emphasised
        .map(
          (s, i) => `<li class="loc-service reveal${i === 0 ? ' loc-service--primary' : ''}"><span class="loc-service__num" aria-hidden="true">${pad(i + 1)}</span><div><h3 class="h4"><a class="stretched" href="/services/${s.slug}">${esc(s.navLabel)}</a></h3><p>${esc(serviceBlurb(s, l))}</p></div><span class="loc-service__arrow" aria-hidden="true">${icon.arrow}</span></li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`,

    context: `
<section class="section" aria-labelledby="ctx-h">
  <div class="container split${l.variant === 'b' ? ' split--flip' : ''}">
    <div class="split__media reveal">${picture(l.secondaryImage, { sizes: '(min-width: 1024px) 45vw, 100vw', className: 'rounded-media' })}</div>
    <div class="split__copy prose">
      <p class="label">Local know-how</p>
      <h2 id="ctx-h" class="h2">${esc(l.contextTitle)}</h2>
      ${l.context.map((p) => `<p>${esc(p)}</p>`).join('')}
      <a class="text-link" href="/get-a-quote">Get a quote for your ${esc(l.name)} property ${icon.arrow}</a>
    </div>
  </div>
</section>`,

    jobs: `
<section class="section${l.variant === 'c' ? ' section--tint' : ''}" aria-labelledby="jobs-h">
  <div class="container jobs-band">
    <div><p class="label">Typical jobs</p><h2 id="jobs-h" class="h2">Types of work we do in ${esc(l.name)}</h2></div>
    <ul class="chip-grid">${l.jobs.map((j) => `<li>${icon.check}${esc(j)}</li>`).join('')}</ul>
  </div>
</section>`,

    process: processSection({
      heading: processHeadings[l.variant](l.name),
      label: 'How it works',
      steps: processSteps[l.variant](l),
    }),

    review: `
<section class="section section--dark" aria-labelledby="rev-h">
  <div class="container review-band">
    <div>
      <p class="label label--light">What customers say</p>
      <h2 id="rev-h" class="h2">Rated ${site.proof.googleRating} from ${site.proof.googleReviewCount} Google reviews</h2>
      <a class="text-link text-link--light" href="${site.links.google}" target="_blank" rel="noopener">Read reviews on Google ${icon.arrow}<span class="sr-only"> (opens in a new tab)</span></a>
    </div>
    <figure class="review review--band">
      ${stars(review.rating)}
      <blockquote><p>“${esc(review.text)}”</p></blockquote>
      <figcaption><strong>${esc(review.name)}</strong><span>Google review</span></figcaption>
    </figure>
  </div>
</section>`,

    nearby: `
<section class="section" aria-labelledby="near-h">
  <div class="container nearby">
    <div>
      <p class="label">Nearby areas</p>
      <h2 id="near-h" class="h2">Also covering areas near ${esc(l.name)}</h2>
      <ul class="nearby__list">
        ${nearby.map((n) => `<li><a href="${locationPath(n)}"><span>Waste removal in ${esc(n.name)}</span>${icon.arrow}</a></li>`).join('')}
      </ul>
      <a class="text-link" href="/service-areas">All ${locations.length} service areas ${icon.arrow}</a>
    </div>
    <div class="nearby__map reveal">${coverageMap({ highlight: l.slug })}</div>
  </div>
</section>`,

    faq: `
<section class="section section--tint" aria-labelledby="loc-faq-h">
  <div class="container faq-layout">
    <div class="faq-layout__aside">
      <p class="label">${esc(l.name)} FAQs</p>
      <h2 id="loc-faq-h" class="h2">Waste removal in ${esc(l.name)}: common questions</h2>
      <p>Anything else? Call <a href="${tel}">${site.phone.display}</a>.</p>
    </div>
    ${faqList(faqs, { id: 'loc-faq' })}
  </div>
</section>`,
  };

  const orders = {
    a: ['intro', 'services', 'context', 'jobs', 'process', 'review', 'nearby', 'faq'],
    b: ['intro', 'context', 'services', 'review', 'jobs', 'nearby', 'process', 'faq'],
    c: ['intro', 'jobs', 'services', 'process', 'context', 'nearby', 'review', 'faq'],
  };

  const body = `
${hero}
<div class="container proof-wrap">${proofStrip()}</div>
${orders[l.variant].map((k) => sections[k]).join('\n')}
${finalCta({ title: l.cta.title, text: l.cta.text, image: l.variant === 'a' ? 'van' : l.image === 'gardenAfter' ? 'frontAfter' : 'garagesAfter', withForm: l.variant !== 'a', context: `Location page: ${l.name}` })}
`;

  return {
    path, title: l.title, description: l.metaDescription, type: 'Location', primaryKeyword: `waste removal ${l.name}`,
    preloadImage: l.image,
    preloadSizes: l.variant === 'a' ? '100vw' : '(min-width: 1024px) 50vw, 100vw',
    ogImage: l.image,
    schema: [
      schema.localBusiness(),
      schema.webPage({ path, title: l.title, description: l.metaDescription }),
      schema.service({ name: `Waste removal in ${l.name}`, description: l.intro[0], path, areaServed: [l.name], imageKey: l.image }),
      schema.breadcrumbs(crumbs),
      schema.faqPage(faqs),
    ],
    body,
  };
}
