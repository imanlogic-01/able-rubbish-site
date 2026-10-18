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

export function buildEmails(l, { from, notifyTo, phone, siteName = 'Able Rubbish and Gardening Services', slogan = 'No job too big or small' }) {
  const first = l.name.split(/\s+/)[0];
  const details = FIELDS.filter(([k]) => l[k]).map(([k, label]) => [label, l[k]]);
  const detailsHtml = details.map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#566;vertical-align:top"><strong>${esc(k)}</strong></td><td style="padding:6px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const detailsText = details.map(([k, v]) => `${k}: ${v}`).join('\n');
  const telHref = `tel:${l.phone.replace(/[^\d+]/g, '')}`;

  const alert = {
    from,
    to: notifyTo,
    ...(l.email ? { reply_to: l.email } : {}),
    subject: `New lead: ${l.service || 'Enquiry'} — ${l.name}${l.postcode ? ` (${l.postcode.toUpperCase()})` : ''}`,
    text: `New enquiry from the website\n\nName: ${l.name}\nPhone: ${l.phone}\nEmail: ${l.email || '—'}\n${detailsText}\n\nCall them back as soon as you can.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#0C1530">
<p style="font-size:18px;margin:0 0 12px"><strong>New lead from the website</strong></p>
<p style="margin:0 0 16px"><a href="${esc(telHref)}" style="display:inline-block;background:#2E7A1E;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px">Call ${esc(l.name)}: ${esc(l.phone)}</a></p>
<table style="border-collapse:collapse;font-size:15px"><tr><td style="padding:6px 14px 6px 0;color:#566"><strong>Name</strong></td><td>${esc(l.name)}</td></tr>
<tr><td style="padding:6px 14px 6px 0;color:#566"><strong>Phone</strong></td><td><a href="${esc(telHref)}">${esc(l.phone)}</a></td></tr>
<tr><td style="padding:6px 14px 6px 0;color:#566"><strong>Email</strong></td><td>${l.email ? `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : '—'}</td></tr>${detailsHtml}</table>
<p style="color:#566;font-size:13px;margin-top:18px">The fastest reply wins the job. Replying to this email goes straight to the customer.</p></div>`,
  };

  const confirmation = l.email
    ? {
        from,
        to: l.email,
        reply_to: notifyTo,
        subject: `Thanks ${first} — we've got your request`,
        text: `Hi ${first},\n\nThanks for getting in touch with ${siteName}. ${slogan}.\n\nWe'll call you on ${l.phone} to confirm the details and give you a free quote. No work starts until you're happy with the price.\n\n${detailsText ? `What you told us:\n${detailsText}\n\n` : ''}Need us sooner? Call ${phone} (7 days a week, 6am to 11pm).\n\n${siteName}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#0C1530;line-height:1.5">
<p style="font-size:18px">Hi ${esc(first)},</p>
<p>Thanks for getting in touch with <strong>${esc(siteName)}</strong>. <em>${esc(slogan)}.</em></p>
<p>We'll call you on <strong>${esc(l.phone)}</strong> to confirm the details and give you a free quote. No work starts until you're happy with the price.</p>
${details.length ? `<p style="margin-bottom:4px"><strong>What you told us</strong></p><table style="border-collapse:collapse;font-size:15px">${detailsHtml}</table>` : ''}
<p>Need us sooner? Call <a href="tel:${esc(phone.replace(/\s/g, ''))}"><strong>${esc(phone)}</strong></a> — 7 days a week, 6am to 11pm.</p>
<p style="color:#566">${esc(siteName)}</p></div>`,
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
  const { alert, confirmation } = buildEmails(lead, { from, notifyTo, phone: process.env.LEAD_PHONE || '07407 415289' });
  const [a, c] = await Promise.allSettled([send(alert, key), confirmation ? send(confirmation, key) : Promise.resolve()]);
  if (c.status === 'rejected') console.error('lead confirmation failed', c.reason?.message);
  if (a.status === 'rejected') { console.error('lead alert failed', a.reason?.message); return res.status(502).json({ ok: false, error: 'Could not send' }); }
  return res.status(200).json({ ok: true });
}
