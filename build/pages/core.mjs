import { site, reviews, vanServices } from '../../src/data/site.mjs';
import { services } from '../../src/data/services.mjs';
import { locations } from '../../src/data/locations.mjs';
import { generalFaqs, faqCategories } from '../../src/data/faqs.mjs';
import { picture, icon, tel, mailto, esc, stars, imageMeta } from '../lib/util.mjs';
import * as schema from '../lib/schema.mjs';
import { breadcrumb, ctaButtons, proofStrip, beforeAfter, reviewsSection, faqSection, faqList, finalCta, coverageSection, quickForm, contactList, processSection } from '../lib/components.mjs';

const pad = (n) => String(n).padStart(2, '0');

// ---------------- About ----------------
export function aboutPage() {
  const path = '/about';
  const title = 'About Able Rubbish and Gardening Services | Basildon & East London';
  const description = 'Meet Able Rubbish and Gardening Services — the rubbish removal, clearance and garden team rated 4.9 on Google, covering Basildon, south Essex and east London.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'About', href: path }];

  const body = `
<section class="page-hero page-hero--split">
  <div class="container page-hero__grid">
    <div class="page-hero__copy">
      ${breadcrumb(crumbs)}
      <p class="label">About us</p>
      <h1 class="h1">A clearance team that turns up, lifts everything and leaves your space clear</h1>
      <p class="lead">${esc(site.name)} is a ${site.businessType} covering ${site.primaryLocation}, south Essex and east London. Customers mention great pricing, a hard-working team and jobs done quickly — sometimes the same day.</p>
      ${ctaButtons({ secondary: { label: 'Our services', href: '/services' } })}
    </div>
    <div class="page-hero__media">${picture('van', { eager: true, sizes: '(min-width: 1024px) 50vw, 100vw' })}</div>
  </div>
</section>

<div class="container proof-wrap">${proofStrip()}</div>

<section class="section" aria-labelledby="who-h">
  <div class="container answer">
    <div class="answer__head"><p class="label">Who we are</p><h2 id="who-h" class="h2">What is ${esc(site.name)}?</h2></div>
    <div class="answer__body prose">
      <p class="answer__lead">${esc(site.name)} is a ${site.businessType} that removes household, commercial and builders’ waste, carries out house clearances, and clears and maintains gardens.</p>
      <p>You’ll find us as <strong>${esc(site.shortName)}</strong> on Google and as <strong>Able Garden services &amp; Rubbish removal</strong> on Facebook, and our caged tipper van carries the <strong>Able Waste Clearance</strong> livery. Whatever the name, it’s the same team and the same number: <a href="${tel}">${site.phone.display}</a>.</p>
      <p>Customers mention Patrick by name in their Google reviews, describing him as very efficient, with good prices and a friendly service. The team takes on everything from a single sofa collection to full house clearances, strip-outs and garden work, 7 days a week from 6am to 11pm.</p>
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="van-h">
  <div class="container split">
    <div class="split__media reveal">${picture('garagesBefore', { sizes: '(min-width: 1024px) 45vw, 100vw', className: 'rounded-media' })}</div>
    <div class="split__copy">
      <p class="label">What we do</p>
      <h2 id="van-h" class="h2">No job too big or small</h2>
      <p>It’s written on the side of the van, and it’s how we work. These are the services we offer across every area we cover:</p>
      <ul class="tick-list tick-list--lg tick-list--cols">${vanServices.map((v) => `<li>${icon.check}${esc(v)}</li>`).join('')}<li>${icon.check}Gardening and tree work</li></ul>
      <a class="text-link" href="/services">Explore our services ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="values-h">
  <div class="container">
    <div class="section-head section-head--split"><div><p class="label">How we work</p><h2 id="values-h" class="h2">What you can expect from us</h2></div><p class="lead">These are the things customers tell us matter most — and the standards we hold ourselves to.</p></div>
    <ol class="includes includes--3">
      <li class="reveal"><span class="includes__num" aria-hidden="true">01</span><h3 class="h4">A price before we start</h3><p>Every job begins with a free quote, so you know the cost before anything is loaded.</p></li>
      <li class="reveal"><span class="includes__num" aria-hidden="true">02</span><h3 class="h4">Hard work, done properly</h3><p>We carry, load and clear — from lofts, flats, garages and back gardens — so you don’t have to.</p></li>
      <li class="reveal"><span class="includes__num" aria-hidden="true">03</span><h3 class="h4">Friendly and straightforward</h3><p>Clear communication, no fuss and respect for your home — especially when a clearance is a difficult moment.</p></li>
    </ol>
  </div>
</section>

<section class="section section--dark" aria-labelledby="ba-h">
  <div class="container split split--flip">
    <div class="split__media reveal">${beforeAfter(['hallwayBefore', 'hallwayAfter'], { caption: 'A hallway before and after a house clearance.' })}</div>
    <div class="split__copy">
      <p class="label label--light">Our work</p>
      <h2 id="ba-h" class="h2">The best proof is the after photo</h2>
      <p>We share real jobs on our Facebook page — cleared hallways, emptied garages and gardens brought back into use. Drag the slider to compare.</p>
      <a class="btn btn--light-outline" href="/recent-work">See recent work ${icon.arrow}</a>
    </div>
  </div>
</section>

${coverageSection({ heading: `Where we work: ${site.primaryLocation}, south Essex and east London` })}

${reviewsSection({ bgImage: 'garagesAfter', heading: 'What our customers say' })}

${finalCta({ title: 'Let’s get it cleared', text: 'Call, email or request a quote online — we’ll come back to you with a clear price.' })}
`;
  return {
    path, title, description, type: 'About', primaryKeyword: 'Able Rubbish and Gardening Services',
    preloadImage: 'van',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description, type: 'AboutPage' }), schema.breadcrumbs(crumbs)],
    body,
  };
}

// ---------------- Contact ----------------
export function contactPage() {
  const path = '/contact';
  const title = 'Contact Able Rubbish | Call 07407 415289 | Basildon & East London';
  const description = 'Contact Able Rubbish and Gardening Services for waste removal, clearances and garden work. Call 07407 415289, email or send a quote request — 7 days, 6am–11pm.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Contact', href: path }];
  const faqs = generalFaqs.filter((f) => ['booking'].includes(f.cat)).slice(0, 3);

  const body = `
<section class="page-hero page-hero--plain">
  <div class="container">
    ${breadcrumb(crumbs)}
    <div class="page-hero__row">
      <div><p class="label">Contact</p><h1 class="h1">Talk to us about your clearance</h1></div>
      <p class="lead">The fastest way to a price is a phone call. Prefer to write it down? Send the form or an email and we’ll get back to you.</p>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="contact-h">
  <div class="container contact-grid">
    <div class="contact-card">
      <h2 id="contact-h" class="h3">Contact details</h2>
      ${contactList()}
      <a class="btn btn--primary btn--lg btn--block" href="${tel}">${icon.phone} Call ${site.phone.display}</a>
      <div class="contact-card__media">${picture('van', { sizes: '(min-width: 1024px) 40vw, 100vw' })}</div>
      <ul class="footer-social footer-social--dark">
        <li><a href="${site.links.facebook}" target="_blank" rel="noopener">${icon.facebook}<span>Facebook</span><span class="sr-only"> (opens in a new tab)</span></a></li>
        <li><a href="${site.links.google}" target="_blank" rel="noopener">${icon.google}<span>Google reviews</span><span class="sr-only"> (opens in a new tab)</span></a></li>
      </ul>
    </div>
    <div class="contact-form-wrap">
      ${quickForm({ context: 'Contact page', heading: 'Send us a message' })}
      <p class="contact-alt">Need to tell us more about the job? Use the <a href="/get-a-quote">detailed quote form</a>.</p>
    </div>
  </div>
</section>

${faqSection(faqs, { heading: 'Before you get in touch', id: 'contact-faq' })}
${coverageSection({ heading: 'Areas we cover' })}
`;
  return {
    path, title, description, type: 'Contact', primaryKeyword: 'contact Able Rubbish',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description, type: 'ContactPage' }), schema.breadcrumbs(crumbs), schema.faqPage(faqs)],
    body,
  };
}

// ---------------- Quote (multi-step) ----------------
export function quotePage() {
  const path = '/get-a-quote';
  const title = 'Get a Free Quote | Waste Removal & Clearances | Able Rubbish';
  const description = 'Request a free, no-obligation quote for waste removal, house clearance, builders’ waste or garden clearance in Basildon, Essex and east London. Takes about 2 minutes.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Get a Quote', href: path }];

  const radio = (name, value, label, desc = '', required = false) =>
    `<label class="choice"><input type="radio" name="${name}" value="${esc(value)}"${required ? ' required' : ''}><span class="choice__box"><strong>${esc(label)}</strong>${desc ? `<small>${esc(desc)}</small>` : ''}</span></label>`;

  const body = `
<section class="page-hero page-hero--plain page-hero--compact">
  <div class="container">
    ${breadcrumb(crumbs)}
    <div class="page-hero__row">
      <div><p class="label">Free quote</p><h1 class="h1">Get a free quote in four quick steps</h1></div>
      <p class="lead">Tell us what needs clearing and we’ll come back with a price. No obligation, and nothing is booked until you’re happy. In a hurry? Call <a href="${tel}">${site.phone.display}</a>.</p>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="container quote-layout">
    <form class="quote-form" data-lead-form data-multistep data-form-name="Detailed quote" novalidate>
      <ol class="steps" aria-label="Form progress">
        <li class="is-active" data-step-indicator="1"><span>1</span>Service</li>
        <li data-step-indicator="2"><span>2</span>The job</li>
        <li data-step-indicator="3"><span>3</span>Timing</li>
        <li data-step-indicator="4"><span>4</span>Your details</li>
      </ol>
      <div class="progress" aria-hidden="true"><span data-progress style="width:25%"></span></div>
      <p class="sr-only" aria-live="polite" data-step-announcer>Step 1 of 4</p>
      <div class="hp" aria-hidden="true"><label for="q-website">Leave this field empty</label><input id="q-website" name="website" tabindex="-1" autocomplete="off"></div>
      <input type="hidden" name="context" value="Quote page">

      <fieldset class="step is-active" data-step="1">
        <legend class="h3">What do you need?</legend>
        <p class="step__hint">Choose the closest match — you can add details next.</p>
        <div class="choice-grid">
          ${services.map((s) => radio('service', s.name, s.navLabel, s.summary.split(' — ')[0], true)).join('')}
          ${radio('service', 'Several / not sure', 'Several or not sure', 'A mix of the above, or something else', true)}
        </div>
        <p class="field-error" data-group-error="service" hidden>Please choose a service.</p>
        <div class="step__nav"><span></span><button type="button" class="btn btn--primary btn--lg" data-next>Continue ${icon.arrow}</button></div>
      </fieldset>

      <fieldset class="step" data-step="2" hidden>
        <legend class="h3">Tell us about the job</legend>
        <div class="field"><label for="q-desc">What needs removing or clearing?</label><textarea id="q-desc" name="description" rows="4" required placeholder="For example: a three-seater sofa, two mattresses and around ten bags of rubbish from a first-floor flat."></textarea></div>
        <p class="field-label" id="q-amount-label">Roughly how much is there?</p>
        <div class="choice-grid choice-grid--compact" role="radiogroup" aria-labelledby="q-amount-label">
          ${radio('amount', 'Single item', 'Single item', '', true)}
          ${radio('amount', 'A few items', 'A few items')}
          ${radio('amount', 'About half a van', 'About half a van')}
          ${radio('amount', 'About a full van', 'About a full van')}
          ${radio('amount', 'More than a van', 'More than a van')}
          ${radio('amount', 'Not sure', 'Not sure')}
        </div>
        <p class="field-error" data-group-error="amount" hidden>Please choose an option.</p>
        <div class="field-row">
          <div class="field"><label for="q-property">Property type</label><select id="q-property" name="property" required><option value="">Choose one</option><option>House</option><option>Flat or apartment</option><option>Bungalow</option><option>Garden only</option><option>Garage or lock-up</option><option>Shop or office</option><option>Building site</option><option>Other</option></select></div>
          <div class="field"><label for="q-postcode">Postcode of the job</label><input id="q-postcode" name="postcode" autocomplete="postal-code" required data-validate="postcode"></div>
        </div>
        <fieldset class="checks"><legend class="field-label">Anything we should know about access? <span class="optional">(optional)</span></legend>
          <label><input type="checkbox" name="access" value="Stairs"> Stairs</label>
          <label><input type="checkbox" name="access" value="No lift"> No lift</label>
          <label><input type="checkbox" name="access" value="Limited parking"> Limited parking</label>
          <label><input type="checkbox" name="access" value="Rear garden through the house"> Rear garden through the house</label>
          <label><input type="checkbox" name="access" value="Fridge, freezer or plasterboard included"> Fridge, freezer or plasterboard</label>
        </fieldset>
        <div class="step__nav"><button type="button" class="btn btn--outline" data-prev>Back</button><button type="button" class="btn btn--primary btn--lg" data-next>Continue ${icon.arrow}</button></div>
      </fieldset>

      <fieldset class="step" data-step="3" hidden>
        <legend class="h3">When do you need it done?</legend>
        <div class="choice-grid choice-grid--compact">
          ${radio('timing', 'As soon as possible', 'As soon as possible', 'Same or next day if available', true)}
          ${radio('timing', 'This week', 'This week')}
          ${radio('timing', 'Within two weeks', 'Within two weeks')}
          ${radio('timing', 'I’m flexible', 'I’m flexible')}
        </div>
        <p class="field-error" data-group-error="timing" hidden>Please choose when you need the work done.</p>
        <div class="field-row">
          <div class="field"><label for="q-date">Preferred date <span class="optional">(optional)</span></label><input id="q-date" name="date" type="date"></div>
          <div class="field"><label for="q-time">Preferred time <span class="optional">(optional)</span></label><select id="q-time" name="time"><option value="">Any time (6am – 11pm)</option><option>Early morning</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div>
        </div>
        <div class="step__nav"><button type="button" class="btn btn--outline" data-prev>Back</button><button type="button" class="btn btn--primary btn--lg" data-next>Continue ${icon.arrow}</button></div>
      </fieldset>

      <fieldset class="step" data-step="4" hidden>
        <legend class="h3">Where should we send your quote?</legend>
        <div class="field-row">
          <div class="field"><label for="q-first">First name</label><input id="q-first" name="firstName" autocomplete="given-name" required></div>
          <div class="field"><label for="q-last">Last name</label><input id="q-last" name="lastName" autocomplete="family-name" required></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="q-phone">Phone</label><input id="q-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-validate="phone"></div>
          <div class="field"><label for="q-email">Email</label><input id="q-email" name="email" type="email" autocomplete="email" required data-validate="email"></div>
        </div>
        <div class="field"><label for="q-contact">Best way to contact you</label><select id="q-contact" name="contactPreference"><option>Phone call</option><option>Text message</option><option>Email</option></select></div>
        <label class="consent"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted about this enquiry, as described in the <a href="/privacy-policy">privacy policy</a>.</label>
        <p class="field-error" data-group-error="consent" hidden>Please confirm we can contact you.</p>
        <div class="step__nav"><button type="button" class="btn btn--outline" data-prev>Back</button><button type="submit" class="btn btn--primary btn--lg">Send quote request ${icon.arrow}</button></div>
        <p class="form-status" role="status" aria-live="polite"></p>
      </fieldset>
    </form>

    <aside class="quote-aside" aria-label="Why request a quote">
      <div class="quote-aside__media">${picture('garagesAfter', { sizes: '(min-width: 1024px) 30vw, 100vw' })}</div>
      <ul class="tick-list">
        <li>${icon.check}Free and no obligation</li>
        <li>${icon.check}Rated ${site.proof.googleRating} from ${site.proof.googleReviewCount} Google reviews</li>
        <li>${icon.check}7 days a week, 6am – 11pm</li>
        <li>${icon.check}We do all the lifting</li>
      </ul>
      <figure class="review review--inline">${stars(5)}<blockquote><p>“${esc(reviews[0].text)}”</p></blockquote><figcaption><strong>${esc(reviews[0].name)}</strong><span>Google review</span></figcaption></figure>
      <a class="btn btn--outline btn--block" href="${tel}">${icon.phone} Prefer to call? ${site.phone.display}</a>
    </aside>
  </div>
</section>
`;
  return {
    path, title, description, type: 'Quote', primaryKeyword: 'rubbish removal quote',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description }), schema.breadcrumbs(crumbs)],
    body,
  };
}

// ---------------- FAQ ----------------
export function faqPage() {
  const path = '/faq';
  const title = 'Rubbish Removal FAQs | Prices, Booking & Areas | Able Rubbish';
  const description = 'Answers to common questions about rubbish removal, house and garden clearance: prices, quotes, booking, what we take and the areas we cover.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'FAQ', href: path }];

  const body = `
<section class="page-hero page-hero--plain">
  <div class="container">
    ${breadcrumb(crumbs)}
    <div class="page-hero__row">
      <div><p class="label">Frequently asked questions</p><h1 class="h1">Rubbish removal and clearance questions, answered</h1></div>
      <p class="lead">Straight answers about prices, booking, what we take and where we work. If yours isn’t here, call <a href="${tel}">${site.phone.display}</a>.</p>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="container faq-page">
    <nav class="faq-page__nav" aria-label="FAQ topics">
      <p class="label label--muted">Topics</p>
      <ul>${faqCategories.map((c) => `<li><a href="#${c.id}">${esc(c.name)}</a></li>`).join('')}</ul>
      <a class="btn btn--primary btn--block" href="/get-a-quote">${site.primaryCta.label}</a>
    </nav>
    <div class="faq-page__groups">
      ${faqCategories
        .map(
          (c) => `<section class="faq-group" id="${c.id}" aria-labelledby="${c.id}-h"><h2 id="${c.id}-h" class="h3">${esc(c.name)}</h2>${faqList(generalFaqs.filter((f) => f.cat === c.id), { id: c.id })}</section>`,
        )
        .join('')}
    </div>
  </div>
</section>

${finalCta({ title: 'Still have a question?', text: `Call ${site.phone.display} — we’re available 7 days a week, from 6am to 11pm.`, image: 'gardenAfter' })}
`;
  return {
    path, title, description, type: 'FAQ', primaryKeyword: 'rubbish removal FAQ',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description }), schema.breadcrumbs(crumbs), schema.faqPage(generalFaqs)],
    body,
  };
}

// ---------------- Recent work ----------------
export function recentWorkPage() {
  const path = '/recent-work';
  const title = 'Recent Work | Before & After Clearances | Able Rubbish';
  const description = 'Before and after photos of real rubbish removal, house clearance and garden clearance jobs by Able Rubbish and Gardening Services.';
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Recent Work', href: path }];
  const gallery = ['van', 'buildersBags', 'garagesBefore', 'hallwayAfter', 'gardenAfter', 'frontAfter', 'driveway', 'garagesAfter', 'hallwayBefore', 'gardenBefore', 'frontBefore', 'buildersPile'];

  const body = `
<section class="page-hero page-hero--plain">
  <div class="container">
    ${breadcrumb(crumbs)}
    <div class="page-hero__row">
      <div><p class="label">Recent work</p><h1 class="h1">Before and after: real clearances by our team</h1></div>
      <p class="lead">Every photo here was taken on the job and shared on our Facebook page or Google Business Profile. Drag the sliders to compare, or tap any photo to view it larger.</p>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="ba-h">
  <div class="container">
    <h2 id="ba-h" class="h2 section-title">Before and after</h2>
    <div class="ba-grid">
      <div class="reveal">${beforeAfter(['garagesBefore', 'garagesAfter'], { caption: 'Waste removal — mixed furniture, flooring and artificial grass cleared from a garage block.' })}<p class="ba-grid__service"><a href="/services/waste-removal">Waste removal ${icon.arrow}</a></p></div>
      <div class="reveal">${beforeAfter(['hallwayBefore', 'hallwayAfter'], { caption: 'House clearance — a hallway cleared of bags, bedding and household items.' })}<p class="ba-grid__service"><a href="/services/house-clearance">House clearance ${icon.arrow}</a></p></div>
      <div class="reveal">${beforeAfter(['gardenBefore', 'gardenAfter'], { caption: 'Garden clearance — broken fence panels, timber and rubbish cleared and the lawn cut.' })}<p class="ba-grid__service"><a href="/services/garden-clearance">Garden clearance ${icon.arrow}</a></p></div>
      <div class="reveal">${beforeAfter(['frontBefore', 'frontAfter'], { caption: 'Front garden cleared and finished with slate chippings.' })}<p class="ba-grid__service"><a href="/services/garden-clearance">Garden clearance ${icon.arrow}</a></p></div>
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="gallery-h">
  <div class="container">
    <div class="section-head section-head--split"><div><p class="label">Gallery</p><h2 id="gallery-h" class="h2">On the job</h2></div><p class="lead">Builders’ waste collections, clearances, gardens and the van that takes it all away.</p></div>
    <ul class="masonry" data-gallery>
      ${gallery
        .map((key) => {
          const m = imageMeta(key);
          const big = `/img/${m.slug}-${m.widths.find((w) => w >= 1200) || m.widths.at(-1)}.jpg`;
          return `<li class="masonry__item reveal"><button type="button" class="masonry__btn" data-lightbox="${big}" data-alt="${esc(m.alt)}" data-w="${m.width}" data-h="${m.height}">${picture(key, { sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw' })}<span class="sr-only">View larger: ${esc(m.alt)}</span></button></li>`;
        })
        .join('')}
    </ul>
  </div>
</section>
<dialog class="lightbox" data-lightbox-dialog aria-label="Image viewer"><button type="button" class="lightbox__close" data-lightbox-close>${icon.plus}<span class="sr-only">Close image</span></button><img alt="" data-lightbox-img></dialog>

${finalCta({ title: 'Want results like these?', text: 'Send us photos of your job for a free, no-obligation quote.', image: 'gardenAfter' })}
`;
  return {
    path, title, description, type: 'Gallery', primaryKeyword: 'rubbish clearance before and after',
    schema: [schema.localBusiness(), schema.webPage({ path, title, description, type: 'CollectionPage' }), schema.breadcrumbs(crumbs)],
    body,
  };
}

// ---------------- Thank you (noindex) ----------------
export function thankYouPage() {
  const path = '/thank-you';
  const title = 'Thank You | Able Rubbish and Gardening Services';
  const description = 'Thank you for your enquiry. We’ll be in touch shortly with your free quote.';
  const body = `
<section class="page-hero page-hero--plain page-hero--center">
  <div class="container narrow">
    <span class="big-check" aria-hidden="true">${icon.check}</span>
    <p class="label">Enquiry received</p>
    <h1 class="h1">Thank you — we’ll be in touch shortly</h1>
    <p class="lead" data-thanks-message>We’ve got your request and will contact you to confirm the details and give you a free quote.</p>
    <p>Need us sooner? Call <a href="${tel}">${site.phone.display}</a> — we’re available ${site.hours.label.toLowerCase()}.</p>
    <div class="cta-row cta-row--center"><a class="btn btn--primary btn--lg" href="${tel}">${icon.phone} Call now</a><a class="btn btn--outline btn--lg" href="/">Back to home</a></div>
  </div>
</section>`;
  return { path, title, description, type: 'Utility', primaryKeyword: '—', noindex: true, schema: [schema.webPage({ path, title, description })], body };
}

// ---------------- 404 (noindex) ----------------
export function notFoundPage() {
  const path = '/404';
  const title = 'Page Not Found | Able Rubbish and Gardening Services';
  const description = 'The page you were looking for could not be found.';
  const body = `
<section class="page-hero page-hero--plain page-hero--center">
  <div class="container narrow">
    <p class="label">Error 404</p>
    <h1 class="h1">This page has already been cleared away</h1>
    <p class="lead">The page you’re looking for doesn’t exist or has moved. Try one of these instead:</p>
    <ul class="nearby__list nearby__list--center">
      <li><a href="/"><span>Home</span>${icon.arrow}</a></li>
      <li><a href="/services"><span>Our services</span>${icon.arrow}</a></li>
      <li><a href="/service-areas"><span>Service areas</span>${icon.arrow}</a></li>
      <li><a href="/get-a-quote"><span>Get a free quote</span>${icon.arrow}</a></li>
    </ul>
  </div>
</section>`;
  return { path, title, description, type: 'Utility', primaryKeyword: '—', noindex: true, schema: [schema.webPage({ path, title, description })], body };
}

// ---------------- Legal (noindex) ----------------
const legalShell = ({ path, name, title, description, updated = 'September 2026', content }) => {
  const crumbs = [{ name: 'Home', href: '/' }, { name, href: path }];
  const body = `
<section class="page-hero page-hero--plain page-hero--compact">
  <div class="container narrow">
    ${breadcrumb(crumbs)}
    <p class="label">Legal</p>
    <h1 class="h1">${esc(name)}</h1>
    <p class="muted">Last updated: ${updated}</p>
  </div>
</section>
<section class="section section--flush-top"><div class="container narrow prose legal">${content}</div></section>`;
  return { path, title, description, type: 'Legal', primaryKeyword: '—', noindex: true, schema: [schema.webPage({ path, title, description }), schema.breadcrumbs(crumbs)], body };
};

const who = `${esc(site.name)} (a trading name of ${esc(site.legalName)}, company number ${site.companyNumber})`;

export const legalPages = () => [
  legalShell({
    path: '/privacy-policy', name: 'Privacy Policy', title: 'Privacy Policy | Able Rubbish and Gardening Services',
    description: 'How Able Rubbish and Gardening Services collects, uses and protects your personal information.',
    content: `
<p>This policy explains how ${who} (“we”, “us”) uses personal information when you visit this website or contact us. We are the data controller for that information.</p>
<h2>What we collect</h2>
<p>When you send a quote request or contact form, we collect the details you provide: your name, phone number, email address, the postcode of the job, a description of the work and any timing or access information.</p>
<p>If you phone or email us, we keep a record of the conversation details needed to quote for and carry out the work.</p>
<h2>How we use it</h2>
<ul><li>To respond to your enquiry and provide a quote</li><li>To arrange, carry out and follow up on the work you book</li><li>To keep records we are required to keep by law</li></ul>
<p>Our lawful bases are taking steps at your request before entering into a contract, performing that contract, and meeting legal obligations. We do not sell your information or use it for unrelated marketing.</p>
<h2>Cookies and analytics</h2>
<p>This website does not set advertising or analytics cookies. Our hosting provider may keep standard server logs (such as IP address and browser type) for security and performance.</p>
<h2>Sharing</h2>
<p>We only share information with service providers who help us run the business (for example, email and website hosting), or where the law requires it.</p>
<h2>How long we keep it</h2>
<p>We keep enquiry information for as long as needed to deal with your enquiry and any resulting work, and job records for as long as required for accounting and legal purposes.</p>
<h2>Your rights</h2>
<p>You can ask to access, correct or delete your information, object to or restrict how we use it, or ask for a copy. Email <a href="${mailto}">${site.email}</a> or call <a href="${tel}">${site.phone.display}</a>.</p>
<p>If you’re unhappy with how we’ve handled your information, you can complain to the Information Commissioner’s Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.</p>`,
  }),
  legalShell({
    path: '/terms-and-conditions', name: 'Terms and Conditions', title: 'Terms and Conditions | Able Rubbish and Gardening Services',
    description: 'Terms for using this website and booking services with Able Rubbish and Gardening Services.',
    content: `
<p>These terms apply to your use of this website and to quotes provided by ${who}.</p>
<h2>Quotes</h2>
<p>Quotes are free and based on the information you give us, including the type and amount of waste and access to it. If the job differs from what was described when we arrive — for example, there is more waste or items that need specialist disposal — we will explain the difference and agree any change in price with you before continuing.</p>
<h2>What we can remove</h2>
<p>You must tell us about any hazardous materials, such as asbestos, chemicals, gas bottles or clinical waste. We may decline to remove materials that require specialist handling.</p>
<h2>Your items</h2>
<p>Please make sure that anything you ask us to remove belongs to you or that you have permission to dispose of it, and that anything you want to keep is clearly identified before work starts.</p>
<h2>Access</h2>
<p>You are responsible for providing safe access to the items to be removed and letting us know about any parking restrictions or building rules.</p>
<h2>Website content</h2>
<p>We aim to keep the information on this website accurate but it is provided for general information only. Photos show examples of real jobs. Nothing on this website forms a contract until a price has been agreed.</p>
<h2>Contact</h2>
<p>Questions about these terms: <a href="${mailto}">${site.email}</a> or <a href="${tel}">${site.phone.display}</a>.</p>`,
  }),
  legalShell({
    path: '/accessibility', name: 'Accessibility Statement', title: 'Accessibility Statement | Able Rubbish and Gardening Services',
    description: 'Our commitment to making this website accessible to everyone.',
    content: `
<p>We want everyone to be able to use this website, including people who use screen readers, keyboard navigation, magnification or voice control.</p>
<h2>What we’ve done</h2>
<ul><li>Semantic HTML with clear headings and landmarks</li><li>Full keyboard navigation, with visible focus states and a skip link</li><li>Descriptive alternative text for photographs</li><li>Colour contrast designed to meet WCAG 2.2 AA</li><li>Forms with visible labels and clear error messages</li><li>Animations that respect your device’s reduced-motion setting</li></ul>
<h2>Known limitations</h2>
<p>The before-and-after image sliders can be operated with arrow keys; both images are also described in text.</p>
<h2>Need help?</h2>
<p>If you have difficulty using this website, or need information in another format, call <a href="${tel}">${site.phone.display}</a> or email <a href="${mailto}">${site.email}</a> and we’ll help.</p>`,
  }),
  legalShell({
    path: '/complaints-policy', name: 'Complaints Policy', title: 'Complaints Policy | Able Rubbish and Gardening Services',
    description: 'How to raise a complaint with Able Rubbish and Gardening Services and how we will deal with it.',
    content: `
<p>We work hard to get every job right. If something hasn’t gone the way you expected, we want to hear about it so we can put it right.</p>
<h2>How to complain</h2>
<p>Contact us as soon as possible after the issue, by phone on <a href="${tel}">${site.phone.display}</a> or by email at <a href="${mailto}">${site.email}</a>. Please include your name, the address of the job, the date of the work and a description of the problem. Photos are helpful.</p>
<h2>What happens next</h2>
<ol><li>We will acknowledge your complaint and confirm we’re looking into it.</li><li>We will review what happened, which may include speaking to the team who carried out the work.</li><li>We will contact you with our response and, where appropriate, how we propose to resolve it.</li></ol>
<h2>If you’re still not satisfied</h2>
<p>If we can’t resolve your complaint, you can seek independent advice from Citizens Advice on <a href="https://www.citizensadvice.org.uk/consumer/" rel="noopener">citizensadvice.org.uk</a>.</p>`,
  }),
];
