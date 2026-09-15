(() => {
  // Replaced at build time from src/data/site.mjs → form.endpoint / email
  const FORM_ENDPOINT = '__FORM_ENDPOINT__';
  const FORM_EMAIL = '__FORM_EMAIL__';
  const PHONE = '07407 415289';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Countdown banner: ticks down to data-countdown, then switches to the expired message
  const notice = $('[data-countdown]');
  if (notice) {
    const end = Date.parse(notice.dataset.countdown);
    const parts = Object.fromEntries($$('[data-cd]', notice).map((el) => [el.dataset.cd, el]));
    const two = (n) => String(n).padStart(2, '0');
    let timer;
    const tick = () => {
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      if (!left) { notice.classList.add('is-expired'); clearInterval(timer); return; }
      parts.d.textContent = Math.floor(left / 86400);
      parts.h.textContent = two(Math.floor(left / 3600) % 24);
      parts.m.textContent = two(Math.floor(left / 60) % 60);
      parts.s.textContent = two(left % 60);
    };
    tick();
    if (!notice.classList.contains('is-expired')) timer = setInterval(tick, 1000);
  }

  // Header state over the hero
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Services dropdown
  $$('[data-dd]').forEach((dd) => {
    const btn = $('.dd-toggle', dd);
    const set = (open) => { dd.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!dd.classList.contains('is-open')));
    dd.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) set(false); });
  });

  // Mobile menu
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu';
      document.body.classList.toggle('menu-open', open);
      if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-visible')); $('a', menu).focus(); }
      else { menu.classList.remove('is-visible'); menu.hidden = true; }
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
      if (e.key === 'Tab' && !menu.hidden) {
        const focusables = [toggle, ...$$('a, button', menu)];
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', (m) => m.matches && setMenu(false));
  }

  // Reveal on scroll
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('is-in'));

  // Hide the mobile call bar over the footer and forms
  const callBar = $('[data-mobile-call]');
  if (callBar && 'IntersectionObserver' in window) {
    const hideZones = $$('.site-footer, .quote-form, .quick-form');
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      callBar.classList.toggle('is-hidden', visible.size > 0);
    });
    hideZones.forEach((z) => io.observe(z));
  }

  // Before / after sliders
  $$('[data-ba]').forEach((ba) => {
    const range = $('.ba__range', ba);
    const update = () => ba.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });

  // Lightbox
  const dialog = $('[data-lightbox-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    const img = $('[data-lightbox-img]', dialog);
    let opener = null;
    $$('[data-lightbox]').forEach((btn) => btn.addEventListener('click', () => {
      opener = btn;
      img.src = btn.dataset.lightbox; img.alt = btn.dataset.alt; img.width = btn.dataset.w; img.height = btn.dataset.h;
      dialog.showModal();
    }));
    $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => opener && opener.focus());
  }

  // Current year
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  // ---------------- Forms ----------------
  const validators = {
    phone: (v) => /^(?:\+44|0044|0)\d{9,10}$/.test(v.replace(/[\s()-]/g, '')),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    postcode: (v) => /^[A-Z]{1,2}\d[A-Z\d]?(\s*\d[A-Z]{2})?$/i.test(v.trim()),
  };
  const messages = {
    required: 'This field is required.',
    phone: 'Please enter a valid UK phone number.',
    email: 'Please enter a valid email address.',
    postcode: 'Please enter a valid UK postcode.',
  };

  const setFieldError = (input, msg) => {
    const field = input.closest('.field') || input.parentElement;
    let err = field.querySelector(':scope > .field-error');
    if (msg) {
      if (!err) {
        err = document.createElement('p');
        err.className = 'field-error';
        err.id = `${input.id || input.name}-error`;
        field.appendChild(err);
      }
      err.textContent = msg;
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    } else {
      if (err) err.remove();
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };

  const validateScope = (scope) => {
    let firstInvalid = null;
    $$('input:not([type=radio]):not([type=checkbox]):not([type=hidden]), select, textarea', scope).forEach((input) => {
      if (input.closest('.hp')) return;
      const v = input.value;
      let msg = '';
      if (input.required && !v.trim()) msg = messages.required;
      else if (v.trim() && input.dataset.validate && !validators[input.dataset.validate](v)) msg = messages[input.dataset.validate];
      setFieldError(input, msg);
      if (msg && !firstInvalid) firstInvalid = input;
    });
    const groups = new Set($$('input[type=radio][required], input[type=checkbox][required]', scope).map((i) => i.name));
    groups.forEach((name) => {
      const ok = $$(`input[name="${name}"]`, scope).some((i) => i.checked);
      const err = $(`[data-group-error="${name}"]`, scope);
      if (err) err.hidden = ok;
      if (!ok && !firstInvalid) firstInvalid = $(`input[name="${name}"]`, scope);
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  // Live re-validation once a field has been flagged
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.classList && t.classList.contains('is-invalid')) {
      const v = t.value;
      const ok = (!t.required || v.trim()) && (!v.trim() || !t.dataset.validate || validators[t.dataset.validate](v));
      if (ok) setFieldError(t, '');
    }
    if (t.type === 'radio' || t.type === 'checkbox') {
      const err = document.querySelector(`[data-group-error="${t.name}"]`);
      if (err && t.checked) err.hidden = true;
    }
  });

  const serialise = (form) => {
    const fd = new FormData(form);
    const data = {};
    for (const [k, v] of fd.entries()) {
      if (k === 'website') continue;
      data[k] = data[k] ? `${data[k]}, ${v}` : v;
    }
    data.form = form.dataset.formName || 'Enquiry';
    data.page = location.pathname;
    data.submittedAt = new Date().toISOString();
    return data;
  };

  const labels = { form: 'Form', context: 'Page', service: 'Service', description: 'Job description', message: 'Message', amount: 'Amount', property: 'Property type', postcode: 'Postcode', access: 'Access notes', timing: 'When', date: 'Preferred date', time: 'Preferred time', name: 'Name', firstName: 'First name', lastName: 'Last name', phone: 'Phone', email: 'Email', contactPreference: 'Contact preference' };

  const submitLead = async (form) => {
    const status = $('.form-status', form);
    const button = $('button[type=submit]', form);
    const hp = $('input[name=website]', form);
    if (hp && hp.value) { location.href = '/thank-you'; return; }
    const data = serialise(form);
    status.className = 'form-status';
    button.setAttribute('aria-busy', 'true');

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        try { sessionStorage.setItem('lead-sent', 'endpoint'); } catch {}
        location.href = '/thank-you';
      } catch {
        status.textContent = `Sorry, your request didn’t send. Please try again or call ${PHONE}.`;
        status.classList.add('is-error');
        button.removeAttribute('aria-busy');
      }
      return;
    }

    // No endpoint configured: open a pre-filled email to the business.
    const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ');
    const subject = `Quote request: ${data.service || 'Enquiry'}${data.postcode ? ` (${data.postcode.toUpperCase()})` : ''}`;
    const body = Object.entries(labels)
      .filter(([k]) => data[k])
      .map(([k, l]) => `${l}: ${data[k]}`)
      .join('\n');
    try { sessionStorage.setItem('lead-sent', 'email'); } catch {}
    window.location.href = `mailto:${FORM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nSent from the website by ${name}.`)}`;
    status.innerHTML = `Almost done — your email app has opened with your request ready. Press send to submit it. No email app? Call <a href="tel:+447407415289">${PHONE}</a>.`;
    status.classList.add('is-success');
    button.removeAttribute('aria-busy');
  };

  $$('[data-lead-form]').forEach((form) => {
    if (form.hasAttribute('data-multistep')) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateScope(form)) submitLead(form);
    });
  });

  // Multi-step quote form
  $$('[data-multistep]').forEach((form) => {
    const steps = $$('[data-step]', form);
    const indicators = $$('[data-step-indicator]', form);
    const bar = $('[data-progress]', form);
    const announcer = $('[data-step-announcer]', form);
    let current = 0;

    const show = (i) => {
      steps.forEach((s, n) => { s.hidden = n !== i; s.classList.toggle('is-active', n === i); });
      indicators.forEach((ind, n) => { ind.classList.toggle('is-active', n === i); ind.classList.toggle('is-done', n < i); if (n === i) ind.setAttribute('aria-current', 'step'); else ind.removeAttribute('aria-current'); });
      bar.style.width = `${((i + 1) / steps.length) * 100}%`;
      announcer.textContent = `Step ${i + 1} of ${steps.length}: ${$('legend', steps[i]).textContent}`;
      current = i;
      const legend = $('legend', steps[i]);
      legend.setAttribute('tabindex', '-1');
      legend.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    form.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) { if (validateScope(steps[current])) show(current + 1); }
      if (e.target.closest('[data-prev]')) show(current - 1);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateScope(steps[current])) submitLead(form);
    });
  });

  // Thank-you page message
  const thanks = $('[data-thanks-message]');
  if (thanks) {
    try {
      if (sessionStorage.getItem('lead-sent') === 'email') thanks.textContent = 'Once you’ve pressed send in your email app, we’ll get back to you to confirm the details and give you a free quote.';
      sessionStorage.removeItem('lead-sent');
    } catch {}
  }
})();
