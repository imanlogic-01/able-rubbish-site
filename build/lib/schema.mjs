import { site } from '../../src/data/site.mjs';
import { services } from '../../src/data/services.mjs';
import { locations } from '../../src/data/locations.mjs';
import { abs, imageMeta } from './util.mjs';

const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

const imgUrl = (key) => {
  const m = imageMeta(key);
  const w = m.widths.find((x) => x >= 1200) || m.widths[m.widths.length - 1];
  return `${site.url}/img/${m.slug}-${w}.jpg`;
};

export function localBusiness() {
  return {
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: site.name,
    alternateName: [site.shortName],
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    image: [imgUrl('van'), imgUrl('garagesAfter'), imgUrl('gardenAfter')],
    telephone: site.phone.e164,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.locality, postalCode: site.address.postcode, addressCountry: site.address.country },
    areaServed: locations.map((l) => ({ '@type': 'Place', name: l.name })),
    openingHoursSpecification: site.hours.schema.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phone.e164,
      email: site.email,
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'en-GB',
    },
    sameAs: [site.links.facebook, site.links.google],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Waste removal and clearance services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(`/services/${s.slug}`) },
      })),
    },
  };
}

export const website = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: site.url,
  name: site.name,
  inLanguage: 'en-GB',
  publisher: { '@id': BUSINESS_ID },
});

export const webPage = ({ path, title, description, type = 'WebPage' }) => ({
  '@type': type,
  '@id': `${abs(path)}#webpage`,
  url: abs(path),
  name: title,
  description,
  inLanguage: 'en-GB',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': BUSINESS_ID },
});

export const breadcrumbs = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.href),
  })),
});

export const faqPage = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const service = ({ name, description, path, areaServed, imageKey }) => ({
  '@type': 'Service',
  '@id': `${abs(path)}#service`,
  name,
  description,
  url: abs(path),
  serviceType: name,
  provider: { '@id': BUSINESS_ID },
  areaServed: areaServed.map((a) => ({ '@type': 'Place', name: a })),
  image: imgUrl(imageKey),
});

export const graph = (...nodes) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }).replace(/</g, '\\u003c');
