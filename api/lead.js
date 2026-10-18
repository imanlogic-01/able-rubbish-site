// Speed-to-lead: receives the website form (JSON POST), emails Patrick and sends the lead a confirmation.
// Uses Resend's HTTP API (no dependencies). Environment variables (set in Vercel):
//   RESEND_API_KEY   Resend API key
//   LEAD_FROM        verified sender, e.g. "Able Rubbish <quotes@ablerubbish.co.uk>"
//   LEAD_NOTIFY_TO   where new-lead alerts go (Patrick); comma-separate for more than one
//   LEAD_PHONE       optional, shown in the lead's email (defaults to the site number)

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clean = (v, max = 500) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/[\r\n]+/g, ' ');

const FIELDS = [
  ['service', 'Service'], ['message', 'Details'], ['description', 'Job description'], ['amount', 'Amount'], ['property', 'Property type'],
  ['postcode', 'Postcode'], ['access', 'Access notes'], ['timing', 'When'], ['date', 'Preferred date'], ['time', 'Preferred time'],
  ['contactPreference', 'Contact preference'], ['context', 'Page / form'],
];
const LONG = new Set(['message', 'description', 'access']);

export function parseLead(body) {
  const b = body && typeof body === 'object' ? body : {};
  const name = oneLine(b.name || [b.firstName, b.lastName].filter(Boolean).join(' '), 100);
  const lead = { name, phone: oneLine(b.phone, 30), email: oneLine(b.email, 120) };
  for (const [k] of FIELDS) lead[k] = LONG.has(k) ? clean(b[k], 1500) : oneLine(b[k], 200);
  return lead;
}

export function validate(l) {
  if (!l.name) return 'Name is required';
  if (!/^(?:\+44|0044|0)\d{9,10}$/.test(l.phone.replace(/[\s()-]/g, ''))) return 'A valid UK phone number is required';
  if (l.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(l.email)) return 'Email looks invalid';
  return '';
}

// ---- Branded email layout (table-based, inline styles: renders in Gmail, Outlook and Apple Mail) ----
// Manrope loads where the client allows web fonts (Apple Mail, iOS Mail); Gmail and Outlook fall back to Arial.
const B = { primary: '#1D3288', ink: '#0C1530', accent: '#2E7A1E', bg: '#F4F2ED', muted: '#4A5068', border: '#D9D5CB' };
const FONT = "'Manrope', Arial, Helvetica, sans-serif";

function layout({ siteUrl, siteName, slogan, phone, hours, preheader, heading, body }) {
  const tel = `tel:${phone.replace(/[^\d+]/g, '')}`;
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(heading)}</title>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap" rel="stylesheet">
<style>@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap');body,td,p,a{font-family:${FONT}}</style></head>
<body style="margin:0;padding:0;background:${B.bg};font-family:${FONT};color:${B.ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${B.bg}">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.bg}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${B.border}">
<tr><td style="background:${B.primary};padding:18px 28px">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:12px"><img src="${esc(siteUrl)}/apple-touch-icon.png" width="44" height="44" alt="" style="display:block;border-radius:10px;border:0"></td>
    <td style="font-family:${FONT};color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;line-height:1.1">Able Rubbish<br><span style="font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.8">&amp; Gardening Services</span></td>
  </tr></table>
</td></tr>
<tr><td style="background:${B.accent};padding:9px 28px;font-family:${FONT};color:#ffffff;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">${esc(slogan)}</td></tr>
<tr><td style="padding:30px 28px 26px;font-family:${FONT};font-size:16px;line-height:1.6;color:${B.ink}">
  <h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${B.ink}">${esc(heading)}</h1>
  ${body}
</td></tr>
<tr><td style="background:${B.bg};padding:20px 28px;font-family:${FONT};font-size:13px;line-height:1.6;color:${B.muted}">
  <strong style="color:${B.ink}">${esc(siteName)}</strong><br>
  <a href="${esc(tel)}" style="color:${B.primary};text-decoration:none;font-weight:700">${esc(phone)}</a> &nbsp;·&nbsp; <a href="${esc(siteUrl)}" style="color:${B.primary};text-decoration:none">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a><br>
  ${esc(hours)}
</td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href, label) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 20px"><tr><td style="background:${B.accent};border-radius:10px"><a href="${esc(href)}" style="display:inline-block;padding:14px 24px;font-family:${FONT};font-size:16px;font-weight:800;color:#ffffff;text-decoration:none">${esc(label)}</a></td></tr></table>`;

export function buildEmails(l, { from, notifyTo, phone, siteUrl = 'https://ablerubbish.co.uk', siteName = 'Able Rubbish and Gardening Services', slogan = 'No job too big or small', hours = '7 days a week, 6am to 11pm' }) {
  const first = l.name.split(/\s+/)[0];
  const details = FIELDS.filter(([k]) => l[k]).map(([k, label]) => [label, l[k]]);
  const rowsHtml = (rows) => rows.map(([k, v]) => `<tr><td style="padding:7px 16px 7px 0;color:${B.muted};vertical-align:top;font-weight:700;font-size:14px;white-space:nowrap">${esc(k)}</td><td style="padding:7px 0;font-size:15px">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const detailsText = details.map(([k, v]) => `${k}: ${v}`).join('\n');
  const telHref = `tel:${l.phone.replace(/[^\d+]/g, '')}`;
  const common = { siteUrl, siteName, slogan, phone, hours };

  const alertRows = [['Name', l.name], ['Phone', l.phone], ['Email', l.email || '—'], ...details];
  const alert = {
    from,
    to: notifyTo,
    ...(l.email ? { reply_to: l.email } : {}),
    subject: `New lead: ${l.service || 'Enquiry'} — ${l.name}${l.postcode ? ` (${l.postcode.toUpperCase()})` : ''}`,
    text: `New enquiry from the website\n\nName: ${l.name}\nPhone: ${l.phone}\nEmail: ${l.email || '—'}\n${detailsText}\n\nCall them back as soon as you can.`,
    html: layout({
      ...common,
      preheader: `${l.name} (${l.phone}) wants a quote${l.service ? ` for ${l.service}` : ''}. Call them back.`,
      heading: 'New lead from the website',
      body: `${button(telHref, `Call ${l.name}: ${l.phone}`)}
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${rowsHtml(alertRows)}</table>
<p style="margin:20px 0 0;font-size:14px;color:${B.muted}">The fastest reply wins the job. Replying to this email goes straight to the customer.</p>`,
    }),
  };

  const confirmation = l.email
    ? {
        from,
        to: l.email,
        reply_to: notifyTo,
        subject: `Thanks ${first} — we've got your request`,
        text: `Hi ${first},\n\nThanks for getting in touch with ${siteName}. ${slogan}.\n\nWe'll call you on ${l.phone} to confirm the details and give you a free quote. No work starts until you're happy with the price.\n\n${detailsText ? `What you told us:\n${detailsText}\n\n` : ''}Need us sooner? Call ${phone} (${hours}).\n\n${siteName}\n${siteUrl}`,
        html: layout({
          ...common,
          preheader: `We'll call you on ${l.phone} to confirm the details and give you a free quote.`,
          heading: `Thanks ${first}, we've got your request`,
          body: `<p style="margin:0 0 14px">We'll call you on <strong>${esc(l.phone)}</strong> to confirm the details and give you a free quote. No work starts until you're happy with the price.</p>
${details.length ? `<p style="margin:18px 0 6px;font-weight:800">What you told us</p><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;border-top:1px solid ${B.border}">${rowsHtml(details)}</table>` : ''}
<p style="margin:22px 0 10px">Need us sooner?</p>
${button(`tel:${phone.replace(/[^\d+]/g, '')}`, `Call ${phone}`)}
<p style="margin:0;font-size:14px;color:${B.muted}">Open ${esc(hours)}.</p>`,
        }),
      }
    : null;
  return { alert, confirmation };
}

async function send(payload, key) {
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  const key = process.env.RESEND_API_KEY, from = process.env.LEAD_FROM, notify = process.env.LEAD_NOTIFY_TO;
  if (!key || !from || !notify) return res.status(500).json({ ok: false, error: 'Email is not configured' });

  const lead = parseLead(req.body);
  const bad = validate(lead);
  if (bad) return res.status(400).json({ ok: false, error: bad });

  const notifyTo = notify.split(',').map((s) => s.trim()).filter(Boolean);
  const siteUrl = (process.env.SITE_URL || 'https://ablerubbish.co.uk').replace(/\/+$/, '');
  const { alert, confirmation } = buildEmails(lead, { from, notifyTo, siteUrl, phone: process.env.LEAD_PHONE || '07407 415289' });
  const [a, c] = await Promise.allSettled([send(alert, key), confirmation ? send(confirmation, key) : Promise.resolve()]);
  if (c.status === 'rejected') console.error('lead confirmation failed', c.reason?.message);
  if (a.status === 'rejected') { console.error('lead alert failed', a.reason?.message); return res.status(502).json({ ok: false, error: 'Could not send' }); }
  return res.status(200).json({ ok: true });
}
