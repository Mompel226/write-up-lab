#!/usr/bin/env node
/* ============================================================
   tools/account.mjs — signing in, saving for the teacher, and homework, checked in headless Chrome.
   Google's sign-in and the labs' Apps Script are FAKES served by this file (Chrome's Fetch interception):
   nobody is signed in to anything real, and nothing is written to the teacher's spreadsheet.
   usage: node tools/account.mjs [--shots <folder>]        (needs the server on :8830, as smoke.mjs)

   What it proves (3 Oct 2026, Daniel's homework of whole parts):
   · signed out: the site works as before; Google's button is offered; no homework
   · signed in: writeup.mine is asked; the homework box, the coloured parts and the "Homework (1)" link appear
   · a homework part: its banner says what finishing takes; Test yourself opens on the Homework set
   · every red pen (each version) and every question finish a part; Learn, Mistakes to avoid and Go
     further are recorded but not needed; keyword cards are never recorded
   · a finished homework part is saved at once; leaving the page saves the rest
   · work from another computer comes back; a second account on the same computer does not get the first one's
   · a pupil not on the class list is told so, once, and nothing more is sent
   · nothing is wider than a 375 px phone
   ============================================================ */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'http://127.0.0.1:8830/labs/write-up-lab/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOTS = (() => { const i = process.argv.indexOf('--shots'); return i > 0 ? process.argv[i + 1] : ''; })();
const PARTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parts.json'), 'utf8'));
const P = Object.fromEntries(PARTS.parts.map((p) => [p.id, p]));

/* ---------- the fakes ---------- */
const FAKE_GIS = `
window.google = { accounts: { id: {
  initialize: function (cfg) { window.__gcfg = cfg; },
  renderButton: function (el) {
    el.innerHTML = '<button type="button" id="fakeG">Sign in with Google</button>';
    el.firstChild.onclick = function () { window.__gcfg.callback({ credential: window.__jwt(window.__email || 'pupil.one@nlcsjeju.kr', window.__name || 'Pupil One') }); };
  },
  prompt: function (cb) { if (cb) cb({ isNotDisplayed: function () { return true; }, isSkippedMoment: function () { return true; }, getDismissedReason: function () { return ''; } }); },
  disableAutoSelect: function () {}, cancel: function () {} } } };
window.__jwt = function (email, name) {
  var b = function (o) { return btoa(JSON.stringify(o)).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, ''); };
  return b({ alg: 'RS256' }) + '.' + b({ email: email, name: name, exp: Math.floor(Date.now() / 1000) + 3600 }) + '.sig';
};`;
const HW = { id: 'HW-TEST1', title: 'Plan your report', due: '10 Oct', overdue: false, dueAt: '2026-10-10T14:59:59Z', parts: ['variables', 'hypothesis'] };
const srv = { calls: [], saves: [], parts: {}, most: {}, onList: { 'pupil.one@nlcsjeju.kr': true, 'pupil.two@nlcsjeju.kr': true } };
function emailOf(token) { try { return JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString()).email; } catch (e) { return ''; } }
function fakeScript(body) {
  const d = JSON.parse(body || '{}'), email = emailOf(d.token);
  if (srv.old) return 'unknown lab';            /* the labs script from before 3 Oct 2026 answers this, as text */
  srv.calls.push({ action: d.action, email });
  if (!srv.onList[email]) return d.action === 'writeup.mine' ? { ok: true, name: '', onList: false, cls: '', parts: {}, homework: [] }
                                                            : { ok: false, why: 'not on your teacher’s class list (' + email + ')' };
  if (d.action === 'writeup.mine') return { ok: true, name: 'Pupil', onList: true, cls: '10A', parts: srv.parts[email] || {}, homework: [HW], most: srv.most[email] || {} };
  if (d.action === 'writeup.save') { srv.saves.push({ email, parts: d.parts }); srv.parts[email] = Object.assign({}, srv.parts[email] || {}, d.parts); return { ok: true, saved: Object.keys(d.parts || {}).length }; }
  return { ok: false, why: 'unknown' };
}

/* ---------- a small DevTools driver ---------- */
const port = 9600 + (process.pid % 300);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'wul-account-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run',
  '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
let list = null;
for (let i = 0; i < 150 && !(list && list.length); i++) {
  try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {}
  await new Promise((r) => setTimeout(r, 100));
}
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
let n = 0; const waiting = new Map(); const errors = [];
const send = (method, params = {}) => new Promise((ok, no) => { const id = ++n; waiting.set(id, [ok, no]); ws.send(JSON.stringify({ id, method, params })); });
ws.onmessage = async (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) { const [ok, no] = waiting.get(m.id); waiting.delete(m.id); return m.error ? no(new Error(m.error.message)) : ok(m.result); }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Fetch.requestPaused') {
    const { requestId, request } = m.params;
    let body = '', type = 'application/json';
    if (/accounts\.google\.com\/gsi\/client/.test(request.url)) { body = FAKE_GIS; type = 'text/javascript'; }
    else if (request.method === 'OPTIONS') body = '';
    else { const a = fakeScript(request.postData); body = typeof a === 'string' ? a : JSON.stringify(a); }
    send('Fetch.fulfillRequest', { requestId, responseCode: 200, body: Buffer.from(body).toString('base64'),
      responseHeaders: [{ name: 'Content-Type', value: type }, { name: 'Access-Control-Allow-Origin', value: '*' }] }).catch(() => {});
  }
};
await send('Page.enable'); await send('Runtime.enable');
await send('Fetch.enable', { patterns: [{ urlPattern: '*accounts.google.com/gsi/client*' }, { urlPattern: '*script.google.com/*' }] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function ev(fn, arg) {
  const r = await send('Runtime.evaluate', { expression: `(${fn.toString()})(${JSON.stringify(arg ?? null)})`, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'evaluate failed');
  return r.result.value;
}
let loads = 0;
async function go(hash, reload) {
  /* a new query each time: an address that differs only after # is not a new page, and nothing would load again */
  if (reload) { await send('Page.navigate', { url: BASE + '?load=' + (++loads) + (hash || '#/') }); await wait(1500); }
  else { await ev((h) => { location.hash = h; }, hash); await wait(400); }
}
async function shot(name, full) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!full });
  fs.writeFileSync(path.join(SHOTS, name + '.png'), Buffer.from(r.data, 'base64'));
}
let fails = 0, passes = 0;
async function check(label, fn) {
  try { await fn(); passes++; console.log('  ok   ' + label); }
  catch (e) { fails++; console.log('  FAIL ' + label + '  →  ' + e.message); }
}
const rec = (id) => ev((i) => (JSON.parse(localStorage.getItem('write-up-lab.v1') || '{}').rec || {})[i] || null, id);

/* ---------- the checks ---------- */
try {
  await go('#/', true);
  await check('signed out: Google’s button is offered, no homework, no script error', async () => {
    const s = await ev(() => ({ btn: !document.getElementById('signinBtn').hidden && !!document.getElementById('fakeG'), card: document.getElementById('whoCard').hidden,
      box: !!document.querySelector('.hwbox'), errs: document.body.getAttribute('data-errors') }));
    if (!s.btn || !s.card || s.box || s.errs !== '0') throw new Error(JSON.stringify(s));
  });
  await check('signed out: what a pupil does is still kept in this browser, as before', async () => {
    await go('#/part/report/redpen');
    await ev(() => { document.querySelector('.redpen__sheet .rpm').click(); });
    const x = await rec('report');
    if (!x || !/1/.test(x.r.g)) throw new Error('nothing kept: ' + JSON.stringify(x));
    if (srv.saves.length) throw new Error('a save was sent while signed out');
  });
  await go('#/', true);
  await ev(() => document.getElementById('fakeG').click());
  await wait(1500);
  await check('signing in asks for the pupil’s own work and homework; the box, the coloured parts and the link appear', async () => {
    if (!srv.calls.some((c) => c.action === 'writeup.mine')) throw new Error('writeup.mine was not asked');
    const s = await ev(() => ({ card: document.getElementById('whoCard').textContent, rows: document.querySelectorAll('.hwbox .hwrow').length,
      hw: Array.from(document.querySelectorAll('.map__a.is-hw')).map((a) => a.getAttribute('href') + ' ' + a.className.match(/is-hw--\w+/)[0]) }));
    if (!/Signed in as Pupil/.test(s.card) || !/Homework \(1\)/.test(s.card)) throw new Error('card: ' + s.card);
    if (s.rows !== 1) throw new Error(s.rows + ' homework rows');
    if (s.hw.join(',') !== '#/part/hypothesis is-hw--none,#/part/variables is-hw--none' && s.hw.sort().join(',') !== '#/part/hypothesis is-hw--none,#/part/variables is-hw--none') throw new Error('coloured parts: ' + s.hw);
  });
  await check('signing in sends what this browser did before (the red-pen mark found while signed out)', async () => {
    await wait(1200);
    const s = srv.saves.find((x) => x.parts.report);
    if (!s || !/1/.test(s.parts.report.r.g)) throw new Error('not sent: ' + JSON.stringify(srv.calls) + ' sync: ' + await ev(() => (document.getElementById('syncState') || {}).textContent) + ' rec: ' + JSON.stringify(await ev(() => Object.keys((JSON.parse(localStorage.getItem('write-up-lab.v1') || '{}').rec || {})))));
  });
  await shot('home-signed-in');
  await go('#/hw/HW-TEST1');
  await check('the homework page lists its two parts, each with what finishing takes and where the pupil is', async () => {
    const s = await ev(() => Array.from(document.querySelectorAll('.hwpart')).map((c) => ({ t: c.querySelector('.hwpart__h a').textContent, pill: c.querySelector('.hwpill').className, p: c.querySelector('.hwpart__p').textContent, li: c.querySelectorAll('.hwlist li').length })));
    if (s.length !== 2) throw new Error(s.length + ' parts');
    const v = s.find((x) => x.t === 'Variables');
    if (!v || !/hwpill--none/.test(v.pill) || v.li !== 2) throw new Error(JSON.stringify(v));
    if (v.p !== 'To finish this part, find every mistake in each Red pen (IGCSE, IB IA) and answer all ' + P.variables.questions + ' questions in Test yourself, the IB ones too.') throw new Error('says: ' + v.p);
  });
  await shot('homework-page', true);
  /* 8 Oct 2026: a part rewritten since keeps the pupil's best on the spreadsheet (`most`); the page's colour must agree */
  await check('a part the spreadsheet counts as done (its best, of any version) is green here too, whatever this browser holds', async () => {
    srv.most['pupil.one@nlcsjeju.kr'] = { hypothesis: 999 };
    await go('#/hw/HW-TEST1', true); await wait(1200);
    const pill = await ev(() => { const c = Array.from(document.querySelectorAll('.hwpart')).find((x) => x.querySelector('.hwpart__h a').textContent === 'Hypothesis'); return c ? c.querySelector('.hwpill').className : ''; });
    srv.most = {};
    await go('#/hw/HW-TEST1', true); await wait(1200);
    if (!/hwpill--done/.test(pill)) throw new Error('the page says ' + pill);
  });
  await go('#/part/variables');
  await check('a homework part: the banner, and Test yourself opens on the Homework set of every question not answered', async () => {
    const s = await ev(() => ({ ban: (document.querySelector('.hwban') || {}).textContent || '', set: (document.querySelector('#test .seg button[aria-pressed="true"]') || {}).textContent || '' }));
    if (!/Plan your report/.test(s.ban) || !/Red pen IGCSE 0 of 5 · IB IA 0 of 4 mistakes found/.test(s.ban) || !/Test yourself 0 of \d+ answered/.test(s.ban)) throw new Error('banner: ' + s.ban);
    if (s.set !== 'Homework · ' + P.variables.questions + ' left') throw new Error('set: ' + s.set);
  });
  await shot('part-banner');
  /* the red pens: every mark in every version */
  await go('#/part/variables/redpen');
  for (const l of ['IGCSE', 'IB']) {
    await ev((lv) => {
      const b = Array.from(document.querySelectorAll('#redpen .seg button')).find((x) => x.textContent.indexOf(lv) === 0); if (b) b.click();
      document.querySelectorAll('#redpen .redpen__sheet .rpm, #redpen .redpen__sheet .rp-ring').forEach((m) => m.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    }, l);
    await wait(200);
  }
  await check('every red pen done: each version is ticked on its button, and the record holds every mark', async () => {
    const x = await rec('variables');
    if (x.r.g !== '11111' || x.r.i !== '1111') throw new Error(JSON.stringify(x.r));
    const t = await ev(() => Array.from(document.querySelectorAll('#redpen .seg button')).map((b) => b.textContent).join(' | '));
    if (!/IGCSE report ✓/.test(t) || !/IB Internal Assessment ✓/.test(t)) throw new Error(t);
  });
  await go('#/part/variables/traps');
  await go('#/part/variables/further');
  await ev(() => { const d = document.querySelector('#further details'); if (d) d.open = true; });
  await go('#/part/variables/words');
  await ev(() => document.querySelectorAll('#words .card').forEach((c) => c.click()));
  await go('#/part/variables/test');
  /* every question of the Homework set: a choose is answered right; anything else is checked until "Show me" comes */
  for (let k = 0; k < 40; k++) {
    const st = await ev(() => {
      const card = document.querySelector('#test .quiz__card'); if (!card) return 'none';
      if (card.querySelector('.quiz__end')) return 'end';
      const next = Array.from(card.querySelectorAll('.quiz__foot button')).find((b) => /Next question|See my score/.test(b.textContent));
      if (next) { next.click(); return 'next'; }
      const show = card.querySelector('.btn--show'); if (show) { show.click(); return 'show'; }
      const right = Array.from(card.querySelectorAll('.opt')).find((b) => b._o && b._o.ok && !b.disabled);
      if (card.querySelector('.quiz__kind') && /Choose one/.test(card.querySelector('.quiz__kind').textContent) && right) { right.click(); return 'chose'; }
      /* a sort: every item into its own group (the page's own rule for "right"), then Check */
      const pool = card.querySelector('.chips--pool');
      if (pool && card.querySelector('.bins') && pool.querySelector('.chip')) {
        Array.from(pool.querySelectorAll('.chip')).filter((c) => c._it).forEach((c) => { c.click(); card.querySelector('.bin[data-bin="' + c._it.bin + '"]').click(); });
      }
      const chk = Array.from(card.querySelectorAll('button')).find((b) => b.textContent === 'Check'); if (chk) { chk.click(); return 'checked'; }
      return 'stuck';
    });
    if (st === 'end' || st === 'none' || st === 'stuck') break;
    await wait(60);
  }
  await check('every question answered: the part is finished — Learn, Mistakes to avoid and Go further were not needed for it', async () => {
    const x = await rec('variables');
    if (/0/.test(x.q)) throw new Error('questions left: ' + x.q + ' card: ' + await ev(() => { const c = document.querySelector('#test .quiz__card'); return c ? c.innerText.slice(0, 300) : 'no card; test=' + !!document.getElementById('test'); }));
    if (!/f/.test(x.q)) throw new Error('no right-first-time letter: ' + x.q);
    const s = await ev(() => ({ pill: (document.querySelector('.hwban .hwpill') || {}).className || '', set: (document.querySelector('#test .seg button') || {}).textContent }));
    if (!/hwpill--done/.test(s.pill) || s.set !== 'Homework · all answered ✓') throw new Error(JSON.stringify(s));
  });
  await check('Mistakes to avoid and Go further were recorded; keyword cards were not', async () => {
    const x = await rec('variables');
    if (x.m !== 1 || x.f !== '1') throw new Error(JSON.stringify({ m: x.m, f: x.f }));
    if ('k' in x || 'words' in x) throw new Error('keyword cards were recorded');
  });
  await check('a finished homework part is saved at once, with every mark and every answer', async () => {
    await wait(800);
    const s = srv.saves.filter((x) => x.parts.variables).pop();
    if (!s || /0/.test(s.parts.variables.q) || s.parts.variables.r.g !== '11111' || s.parts.variables.v !== P.variables.v) throw new Error(JSON.stringify(s && s.parts.variables));
  });
  await check('leaving the page sends what is still waiting', async () => {
    const before = srv.saves.length;
    await go('#/part/hypothesis/build');
    await ev(() => { const b = document.querySelectorAll('.step__h')[1]; if (b) b.click(); });
    await ev(() => window.dispatchEvent(new Event('pagehide')));
    await wait(800);
    const s = srv.saves.slice(before).find((x) => x.parts.hypothesis);
    if (!s || s.parts.hypothesis.l.slice(0, 2) !== '11') throw new Error('not sent: ' + JSON.stringify(srv.saves.slice(before)));
  });
  await go('#/', true);
  await check('after a reload: the finished part is green; Learn steps alone leave a part not started', async () => {
    const a = await ev(() => document.querySelector('.map__a[href="#/part/variables"]').className);
    if (!/is-hw--done/.test(a)) throw new Error(a);
    await go('#/hw/HW-TEST1');
    const p = await ev(() => Array.from(document.querySelectorAll('.hwpart')).map((c) => c.querySelector('.hwpart__h a').textContent + ':' + c.querySelector('.hwpill').className.split('--')[1]).join(' '));
    if (p !== 'Variables:done Hypothesis:none') throw new Error(p);
  });
  await check('work from another computer comes back, and only ever adds', async () => {
    const one = 'pupil.one@nlcsjeju.kr', h = P.hypothesis;
    srv.parts[one].hypothesis = { v: h.v, l: '1'.padEnd(h.steps, '0'), r: Object.fromEntries(h.redpens.map((y) => [y.l, '1'.padEnd(y.n, '0')])), m: 0, q: 'ff'.padEnd(h.questions, '0'), f: '0'.repeat(h.further) };
    await go('#/', true);
    await wait(500);
    const x = await rec('hypothesis');
    if (x.q.slice(0, 2) !== 'ff' || x.l.slice(0, 2) !== '11') throw new Error(JSON.stringify(x));
    const t = await ev(() => (document.querySelector('.toast') || {}).textContent || '');
    if (!/another computer is back/.test(t)) throw new Error('toast: ' + t);
  });
  await check('a second account on the same computer does not get the first one’s work', async () => {
    await ev(() => document.querySelector('.who__out').click());
    await wait(300);
    await ev(() => { window.__email = 'pupil.two@nlcsjeju.kr'; window.__name = 'Pupil Two'; document.getElementById('fakeG').click(); });
    await wait(1500);
    const x = await rec('variables');
    if (x && /[1tsf]/.test(x.q)) throw new Error('the first pupil’s answers are still here: ' + x.q);
    if (srv.saves.some((s) => s.email === 'pupil.two@nlcsjeju.kr' && s.parts.variables && /[1f]/.test(s.parts.variables.q))) throw new Error('pupil one’s work was saved for pupil two');
    const t = await ev(() => (document.querySelector('.toast') || {}).textContent || '');
    if (!/another student’s work/.test(t)) throw new Error('toast: ' + t);
  });
  await check('before the teacher’s script knows the Write-Up Lab: the page says the work is kept in this browser, and nothing hangs', async () => {
    srv.old = true;
    await go('#/hw', true);
    await wait(800);
    const s = await ev(() => ({ sync: (document.getElementById('syncState') || {}).textContent || '', pg: document.querySelector('.hwpg').textContent }));
    srv.old = false;
    if (!/kept in this browser/.test(s.sync)) throw new Error('says: ' + s.sync);
    if (/Loading/.test(s.pg)) throw new Error('the homework page still says Loading');
  });
  await check('a pupil not on the class list is told so; nothing is sent for them', async () => {
    await ev(() => document.querySelector('.who__out').click());
    await wait(300);
    await ev(() => { window.__email = 'stranger@gmail.com'; window.__name = 'Stranger'; document.getElementById('fakeG').click(); });
    await wait(1200);
    const before = srv.saves.length;
    await go('#/part/report/redpen');
    await ev(() => document.querySelectorAll('.redpen__sheet .rpm').forEach((m) => m.click()));
    await ev(() => window.dispatchEvent(new Event('pagehide')));
    await wait(600);
    const s = await ev(() => (document.getElementById('syncState') || {}).textContent || '');
    if (!/not on a class list/.test(s)) throw new Error('says: ' + s);
    if (srv.saves.length !== before) throw new Error('a save was sent');
  });
  /* a phone */
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await ev(() => document.querySelector('.who__out') && document.querySelector('.who__out').click());
  await wait(300);
  await ev(() => { window.__email = 'pupil.one@nlcsjeju.kr'; window.__name = 'Pupil One'; document.getElementById('fakeG') && document.getElementById('fakeG').click(); });
  await wait(1200);
  for (const h of ['#/', '#/hw/HW-TEST1', '#/part/variables', '#/part/variables/test']) {
    await go(h, true);
    await check('375 px: ' + h + ' is no wider than the screen', async () => {
      const w = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, bad: Array.from(document.querySelectorAll('.who *, .hwban *, .hwpart *, .hwbox *')).filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1).map((e) => e.className).slice(0, 4) }));
      if (w.sw > w.iw || w.bad.length) throw new Error(JSON.stringify(w));
    });
    await ev(() => window.scrollTo(0, 0));
    await shot('phone' + h.replace(/[#/]+/g, '-'));
  }
  await check('no script error anywhere', async () => { if (errors.length) throw new Error(errors.slice(0, 3).join(' | ')); });
} finally {
  ws.close(); chrome.kill();
  try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
}
console.log(`\n${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
