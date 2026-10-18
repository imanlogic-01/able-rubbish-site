# Able Rubbish and Gardening Services — website

A 45-page static local SEO microsite: 4 service pages, 27 location landing pages, core, trust and utility pages.
No framework and no runtime dependencies. A small Node build script turns the central data files into plain HTML.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dev tools (`sharp` for images, `puppeteer-core` for the audit) |
| `npm run build` | Build every route to `dist/`, plus `sitemap.xml` and `robots.txt` |
| `npm run preview` | Serve `dist/` on http://localhost:4321 with clean URLs, the same way Vercel does |
| `npm run audit` | Static QA: titles, canonicals, H1s, schema, links, orphans, tokens, duplication |
| `node build/audit.mjs --browser` | Adds overflow checks at 7 widths plus form and interaction tests (needs the preview running and Microsoft Edge) |
| `npm run images` | Regenerate responsive AVIF/WebP/JPEG images from `source-images/` |

## Deploying (GitHub → Vercel)

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel. `vercel.json` already sets the build command (`npm run build`), the output folder (`dist`), clean URLs and cache headers.
3. No domain is hard-coded. Canonicals, the sitemap, Open Graph tags and schema use Vercel's production domain automatically (`VERCEL_PROJECT_PRODUCTION_URL`). When the new domain is added in Vercel, redeploy and it is picked up. To force a specific domain, set a `SITE_URL` environment variable in Vercel (for example `https://www.example.co.uk`).

## Where to edit things

Everything is centralised, so a change in one place updates every page:

- `src/data/site.mjs`: name, phone, email, hours, verified review stats, reviews, brand colours, **form endpoint**
- `src/data/services.mjs`: all service page content
- `src/data/locations.mjs`: all 27 location pages (copy, FAQs, images, section order)
- `src/data/faqs.mjs`: general FAQs
- `src/data/image-sources.mjs`: photos, alt text and crops
- `src/styles/site.css` and `src/scripts/site.js`: design system and interactions
- `build/pages/*`: page templates; `build/lib/components.mjs`: shared sections

## Speed-to-lead emails

Forms POST JSON to `/api/lead` (`api/lead.js`, a Vercel function using the Resend HTTP API). Each submission sends Patrick a "New lead" alert (reply goes to the customer) and the customer a confirmation. Set these in Vercel → Settings → Environment Variables, then redeploy:

| Variable | Example |
| --- | --- |
| `RESEND_API_KEY` | from resend.com → API Keys |
| `LEAD_FROM` | `Able Rubbish <quotes@yourdomain.co.uk>` (domain verified in Resend) |
| `LEAD_NOTIFY_TO` | Patrick's email (comma-separate for more people) |
| `LEAD_PHONE` | optional, defaults to 07407 415289 |

Check the logic with `node api/lead.check.mjs`. If `form.endpoint` in `src/data/site.mjs` is emptied, forms fall back to a pre-filled email.

## Connecting the forms

Set `form.endpoint` in `src/data/site.mjs` to a CRM or webhook URL (for example GoHighLevel, Zapier, Make or Formspree). The forms send a JSON `POST` and then redirect to `/thank-you`.

While `endpoint` is empty, the forms still validate. They then open the visitor's email app with a pre-filled message to the business address.

## Photos

Every photo is an owner-uploaded image from the business's Facebook page or Google Business Profile. One front-garden photo is cropped to remove another company's van. To add new photos, drop them into `source-images/`, register them in `image-sources.mjs` and run `npm run images`.
