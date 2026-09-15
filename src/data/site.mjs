// Single source of truth for business details. Everything on the site reads from here.
// Only verified facts are included — sources noted beside each value.

export const site = {
  // Canonical domain used for canonicals, sitemap, Open Graph and schema. Resolved at build time:
  // 1. SITE_URL environment variable (set this in Vercel once the new domain is live), otherwise
  // 2. Vercel's production domain (VERCEL_PROJECT_PRODUCTION_URL — updates automatically when a custom domain is added), otherwise
  // 3. the local preview address.
  url: (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4321')
  ).replace(/\/+$/, ''),

  name: 'Able Rubbish and Gardening Services', // as supplied; used identically on every page
  shortName: 'Able Rubbish',                    // name shown on Google Business Profile
  legalName: 'Able Rubbish Clearance Limited',  // Companies House
  companyNumber: '05919680',                    // supplied; confirmed on Companies House
  businessType: 'rubbish removal and garden clearance company',
  description:
    'Able Rubbish and Gardening Services is a rubbish removal and garden clearance company providing waste removal, house clearances, builders’ waste removal and garden clearance across Basildon, south Essex and east London.',

  phone: { display: '07407 415289', e164: '+447407415289' }, // GBP, van livery, Facebook
  email: 'Pat.ablerubbish@icloud.com',                         // supplied; Facebook intro

  // Facebook page intro and the business's previous website. East Ham is one of the service areas.
  address: { street: '40 Talbot Road', area: 'East Ham', locality: 'London', postcode: 'E6 2RZ', country: 'GB' },

  primaryLocation: 'Basildon',
  region: 'Essex and East London',

  // Business post on Facebook: "We're open from 6AM to 11PM – 7 days a week." GBP: closes 11 pm.
  hours: {
    label: '7 days a week, 6am – 11pm',
    schema: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '06:00', closes: '23:00' }],
  },

  // Verified public proof (Google Business Profile and Facebook page, September 2026)
  proof: {
    googleRating: '4.9',
    googleReviewCount: 40,
    facebookRecommend: '100%',
    facebookReviewCount: 126,
  },

  links: {
    facebook: 'https://www.facebook.com/profile.php?id=61550440191394',
    google: 'https://maps.google.com/?cid=14337911126109558076',
  },

  primaryCta: { label: 'Get a Free Quote', href: '/get-a-quote' }, // "Call for a free quote" — van livery

  // Form submissions: set `endpoint` to a CRM / webhook URL (JSON POST) to capture leads directly.
  // While empty, the form validates and then opens a pre-filled email to the business address.
  form: { endpoint: '', method: 'POST' },

  // Countdown banner shown at the top of every page. Set `enabled: false` to remove it everywhere.
  // `endsAt` is an ISO timestamp with its UTC offset; +01:00 is UK summer time (BST), use Z in winter (GMT).
  disableNotice: {
    enabled: true,
    endsAt: '2026-09-20T23:59:00+01:00',
    text: 'This site will be disabled in',
    shortText: 'Site disabled in',
    expiredText: 'This site has now been disabled.',
  },

  colours: {
    primary: '#1D3288',
    ink: '#0C1530',
    secondary: '#565B66',
    accent: '#2E7A1E',
    accentOnDark: '#93D46C',
    background: '#F4F2ED',
    surface: '#FFFFFF',
    text: '#0C1530',
    textMuted: '#4A5068',
    border: '#D9D5CB',
  },
};

// Genuine Google reviews, quoted verbatim (Google Business Profile, September 2026).
export const reviews = [
  {
    name: 'Hannah Gilbane',
    rating: 5,
    source: 'Google',
    service: 'Rubbish removal',
    text: 'These guys are fantastic! Was given a free quote for my mum and the removal of rubbish, we was very happy with the price but absolutely over the moon with them and the job completed! They came the same day to my mum’s relief…',
  },
  {
    name: 'Markus Lundqvist',
    rating: 5,
    source: 'Google',
    service: null,
    text: 'Best team I’ve used several times. Super helpful, hard working and really great pricing. Could not recommend more.',
  },
  {
    name: 'Kam Khan',
    rating: 5,
    source: 'Google',
    service: 'Building and gardening work',
    text: 'I have used Patrick for various jobs I needed done including building work and gardening work. He is very efficient, good prices and has a friendly services. Highly recommend.',
  },
];

// Services painted on the company van (verified), used in About and schema.
export const vanServices = [
  'Domestic Clearance',
  'Garden Clearance',
  'Trades Clearance',
  'Shop/Commercial',
  'Office Clearance',
  'Strip Outs & Demolition',
  'Wait & Load Service',
];
