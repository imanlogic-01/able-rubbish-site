// Run: node api/lead.check.mjs — mocks Resend and checks both emails are built and sent.
import assert from 'node:assert/strict';
import handler, { parseLead, validate } from './lead.js';

process.env.RESEND_API_KEY = 'k';
process.env.LEAD_FROM = 'Able Rubbish <quotes@example.co.uk>';
process.env.LEAD_NOTIFY_TO = 'patrick@example.com';
const sent = [];
globalThis.fetch = async (url, o) => { sent.push(JSON.parse(o.body)); return { ok: true, text: async () => '' }; };
const call = async (body, method = 'POST') => {
  let out;
  await handler({ method, body }, { setHeader() {}, status: (c) => ({ json: (j) => (out = { c, j }) }) });
  return out;
};

let r = await call({ name: 'Sam <b>Lee</b>', phone: '07700 900123', email: 'sam@example.com', postcode: 'SS14 1AA', service: 'Garden Clearance' });
assert.equal(r.c, 200);
assert.equal(sent.length, 2);
assert.equal(sent[0].to[0], 'patrick@example.com');
assert.equal(sent[0].reply_to, 'sam@example.com');
assert.ok(sent[0].subject.includes('Garden Clearance'));
assert.equal(sent[1].to, 'sam@example.com');
assert.ok(!sent[0].html.includes('<b>Lee'), 'html must be escaped');
assert.ok(sent[0].html.includes('Manrope') && sent[1].html.includes('Manrope'), 'brand font present');
assert.ok(sent[0].text && sent[1].text, 'plain-text part present for both');
assert.ok(sent[1].html.includes('No job too big or small'), 'slogan present');

sent.length = 0;
r = await call({ name: 'No Email', phone: '07700900123' });
assert.equal(r.c, 200);
assert.equal(sent.length, 1, 'alert only when no email');
assert.equal((await call({ name: 'x', phone: '123' })).c, 400);
assert.equal((await call({}, 'GET')).c, 405);
assert.equal(validate(parseLead({ firstName: 'A', lastName: 'B', phone: '+447407415289' })), '');
console.log('lead api checks passed');
