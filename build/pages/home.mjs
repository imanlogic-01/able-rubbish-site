import { site } from '../../src/data/site.mjs';
import { services } from '../../src/data/services.mjs';
import { page } from '../lib/layout.mjs';
import { picture, icon, tel, esc } from '../lib/util.mjs';
import * as schema from '../lib/schema.mjs';
import { proofStrip, numberedServices, processSection, beforeAfter, reviewsSection, faqSection, finalCta, coverageSection } from '../lib/components.mjs';
import { generalFaqs } from '../../src/data/faqs.mjs';

export function homePage() {
  const path = '/';
  const title = 'Waste Removal Basildon | Rubbish & Garden Clearance | Able Rubbish';
  const description = 'Waste removal, house clearances, builders’ waste and garden clearance across Basildon, Essex and east London. Rated 4.9 on Google. Free quotes, 7 days a week.';
  const faqs = generalFaqs.filter((f) => f.home);

  const body = `
<section class="hero" aria-labelledby="hero-h">
  <div class="hero__media">${picture('garagesBefore', { eager: true, sizes: '100vw', position: '62% 50%' })}</div>
  <div class="container hero__inner">
    <div class="hero__copy">
      <p class="label label--light hero__label">Serving ${site.primaryLocation} &amp; surrounding areas</p>
      <p class="hero__services" aria-hidden="true">Household <i>•</i> Clearances <i>•</i> Builders’ waste <i>•</i> Gardens</p>
      <h1 id="hero-h" class="h-display">Rubbish removed. Space reclaimed.<span> Waste removal across ${site.primaryLocation}, Essex &amp; east London.</span></h1>
      <p class="hero__lead">${esc(site.name)} clears household rubbish, whole houses, builders’ waste and overgrown gardens. We do the lifting, take it all away the same visit and quote for free — 7 days a week, 6am to 11pm.</p>
      <div class="cta-row">
        <a class="btn btn--primary btn--lg" href="${site.primaryCta.href}">${site.primaryCta.label} ${icon.arrow}</a>
        <a class="btn btn--light-outline btn--lg" href="/services">View our services</a>
      </div>
    </div>
  </div>
  <div class="hero__proof"><div class="container">${proofStrip({ dark: true })}</div></div>
</section>

<section class="section benefit" aria-labelledby="benefit-h">
  <div class="container benefit__grid">
    <div class="benefit__copy">
      <p class="label">Why people call us</p>
      <h2 id="benefit-h" class="h2 statement">Nobody really wants a skip. They want the garage back, the garden usable and the house ready for what’s next.</h2>
      <ol class="outcomes">
        <li class="reveal"><span class="outcomes__num" aria-hidden="true">01</span><div><h3 class="h4">Your space back, the same day</h3><p>Everything is loaded and driven away in one visit — no pile waiting on the drive for a week.</p></div></li>
        <li class="reveal"><span class="outcomes__num" aria-hidden="true">02</span><div><h3 class="h4">No lifting, no tip runs</h3><p>We carry it out from lofts, flats, gardens and garages. You don’t need a van or a strong back.</p></div></li>
        <li class="reveal"><span class="outcomes__num" aria-hidden="true">03</span><div><h3 class="h4">Fits around your day</h3><p>Collections from 6am to 11pm, 7 days a week — before work, after work or at the weekend.</p></div></li>
      </ol>
    </div>
    <div class="benefit__media reveal">
      ${beforeAfter(['garagesBefore', 'garagesAfter'], { caption: 'Recent work: furniture, flooring and artificial grass cleared from beside a garage block.' })}
    </div>
  </div>
</section>

${numberedServices({ intro: `One company for rubbish removal, clearances and garden work — so you’re not arranging a skip, a gardener and a man with a van separately.` })}

<section class="section section--dark why" aria-labelledby="why-h">
  <div class="container why__grid">
    <div class="why__aside">
      <p class="label label--light">Why choose us</p>
      <h2 id="why-h" class="h2">The reasons customers use us again — in their words and ours</h2>
      <div class="why__media reveal">${picture('van', { sizes: '(min-width: 1024px) 40vw, 100vw' })}</div>
    </div>
    <ol class="why__list">
      <li class="reveal"><span class="why__num" aria-hidden="true">01</span><div><h3 class="h4">Rated ${site.proof.googleRating} on Google</h3><p>From ${site.proof.googleReviewCount} Google reviews, with customers calling the team “super helpful” and “hard working”.</p></div></li>
      <li class="reveal"><span class="why__num" aria-hidden="true">02</span><div><h3 class="h4">Free quotes, fair prices</h3><p>You’re quoted before we start. Reviews regularly mention good prices and being happy with the cost.</p></div></li>
      <li class="reveal"><span class="why__num" aria-hidden="true">03</span><div><h3 class="h4">Same-day when we can</h3><p>If there’s a slot, we’ll come the same day. Call and we’ll tell you the earliest time available.</p></div></li>
      <li class="reveal"><span class="why__num" aria-hidden="true">04</span><div><h3 class="h4">Early starts, late finishes</h3><p>Open 7 days a week from 6am to 11pm, so the job fits your schedule — not the other way round.</p></div></li>
      <li class="reveal"><span class="why__num" aria-hidden="true">05</span><div><h3 class="h4">Rubbish and gardens under one roof</h3><p>Clearances, strip-outs, garden clearance and tree work from one team, in one visit.</p></div></li>
    </ol>
  </div>
</section>

${processSection({
    dark: false,
    heading: 'Four steps from full to cleared',
    intro: 'Most jobs are quoted within a phone call. Photos help us price accurately, especially for larger clearances.',
    steps: [
      { title: 'Call or send photos', text: `Ring ${site.phone.display} or request a quote online. Tell us what’s going and roughly how much there is.` },
      { title: 'Get a free quote', text: 'We price on volume, waste type and access — and agree a collection time that suits you.' },
      { title: 'We load everything', text: 'The team carries items out from inside, the garden, loft or garage and loads the van.' },
      { title: 'Gone. Space back.', text: 'Your rubbish leaves with us the same visit, and you get your space back.' },
    ],
  })}

<section class="section" aria-labelledby="work-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div><p class="label">Recent work</p><h2 id="work-h" class="h2">Drag to see the difference</h2></div>
      <div><p class="lead">Real jobs, photographed by the team and shared on our Facebook page. Slide each image to compare before and after.</p><a class="text-link" href="/recent-work">See more recent work ${icon.arrow}</a></div>
    </div>
    <div class="work-grid">
      <div class="work-grid__item work-grid__item--tall reveal">${beforeAfter(['hallwayBefore', 'hallwayAfter'], { caption: 'House clearance — a hallway emptied of bags, bedding and household items.', sizes: '(min-width: 1024px) 34vw, 100vw' })}</div>
      <div class="work-grid__item work-grid__item--tall reveal">${beforeAfter(['gardenBefore', 'gardenAfter'], { caption: 'Garden clearance — fence panels, timber and rubbish removed and the lawn cut.', sizes: '(min-width: 1024px) 34vw, 100vw' })}</div>
      <div class="work-grid__item reveal">${beforeAfter(['frontBefore', 'frontAfter'], { caption: 'Front garden cleared and finished with slate chippings.', sizes: '(min-width: 1024px) 30vw, 100vw' })}</div>
    </div>
  </div>
</section>

${coverageSection()}

${reviewsSection({ bgImage: 'gardenAfter' })}

${faqSection(faqs, { heading: 'Answers before you pick up the phone' })}

${finalCta({ title: 'Ready to get it cleared?', text: `Tell us what needs to go and get a clear, free quote from a local team serving ${site.primaryLocation} and the surrounding areas.`, withForm: true, context: 'Homepage' })}
`;

  return {
    path,
    title,
    description,
    overHero: true,
    preloadImage: 'garagesBefore',
    preloadSizes: '100vw',
    primaryKeyword: 'waste removal Basildon',
    type: 'Home',
    schema: [schema.localBusiness(), schema.website(), schema.webPage({ path, title, description }), schema.faqPage(faqs)],
    body,
  };
}
