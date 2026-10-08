#!/usr/bin/env node
/* ============================================================
   tools/accommodation.mjs — the help a teacher gives some pupils, and the redo every pupil has, in headless Chrome.
   (Daniel, 8 Oct 2026: "after two tries … the explanation of why it was wrong … only for those students that have been
   allowed the accommodation"; "redo the ones I got wrong".) The same fakes as tools/account.mjs: nobody signs in to
   anything real, and nothing reaches a spreadsheet; writeup.mine says acc: 1 only when this file says so.
   usage: node tools/accommodation.mjs        (needs the server on :8830, as smoke.mjs)

   · without the accommodation: no help after any number of wrong checks (multi, sort)
   · with it: nothing after the FIRST wrong check, nor after the same answer checked again, nor for a Check with nothing
     ticked; after a second, DIFFERENT wrong answer, why each option ticked wrongly is wrong (multi) and why each item in a
     wrong group belongs elsewhere (sort); a choose question adds nothing (it explains every click)
   · Back after a redo keeps the set's own level (an IB-only set stays IB)
   · redo: the end of a test offers "Redo the 1 you missed"; the redo plays exactly that question, sends nothing to the
     records and changes no score; "Back to all the questions" returns
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
const srv = { calls: [], saves: [], parts: {}, most: {}, acc: {}, onList: { 'pupil.one@nlcsjeju.kr': true, 'pupil.two@nlcsjeju.kr': true } };
function emailOf(token) { try { return JSON.parse(Buffer.from(String(token).split('.')[1], 'base64url').toString()).email; } catch (e) { return ''; } }
function fakeScript(body) {
  const d = JSON.parse(body || '{}'), email = emailOf(d.token);
  if (srv.old) return 'unknown lab';            /* the labs script from before 3 Oct 2026 answers this, as text */
  srv.calls.push({ action: d.action, email });
  if (!srv.onList[email]) return d.action === 'writeup.mine' ? { ok: true, name: '', onList: false, cls: '', parts: {}, homework: [] }
                                                            : { ok: false, why: 'not on your teacher’s class list (' + email + ')' };
  if (d.action === 'writeup.mine') return { ok: true, name: 'Pupil', onList: true, cls: '10A', parts: srv.parts[email] || {}, homework: [HW], most: srv.most[email] || {}, ...(srv.acc[email] ? { acc: 1 } : {}) };
  if (d.action === 'writeup.save') { srv.saves.push({ email, parts: d.parts }); srv.parts[email] = Object.assign({}, srv.parts[email] || {}, d.parts); return { ok: true, saved: Object.keys(d.parts || {}).length }; }
  return { ok: false, why: 'unknown' };
}

/* ---------- a small DevTools driver ---------- */
const port = 9900 + (process.pid % 90);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'wul-acc-'));
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
const PAGE_KIT = () => {
  const W = window, $$ = (c, s) => Array.from(c.querySelectorAll(s));
  W.__all = () => { const out = []; Object.keys(W.WUL.stations).forEach((id) => (W.WUL.stations[id].test || []).forEach((q) => out.push(Object.assign({ _part: id }, q)))); return out; };
  W.__host = () => { let h = document.getElementById('__qhost'); if (!h) { h = document.createElement('div'); h.id = '__qhost'; document.body.prepend(h); } return h; };
  W.__checkBtn = () => $$(W.__host(), '.quiz__foot button').find((b) => b.textContent === 'Check');
  W.__help = () => { const b = W.__host().querySelector('.helpbox'); return b ? b.textContent : ''; };
};
try {
  await go('#/', true);
  await ev(() => document.getElementById('fakeG').click());
  await wait(1500);
  await ev(PAGE_KIT);
  /* a multi question with a wrong option that has a why, and a sort question with two groups whose items have whys */
  const pick = await ev(() => {
    const all = window.__all();
    const multi = all.find((q) => q.type === 'multi' && q.opts.filter((o) => !o.ok && o.why).length >= 2 && q.opts.some((o) => o.ok));
    const sort = all.find((q) => q.type === 'sort' && q.items.every((i) => i.why) && q.bins.length >= 2);
    const chooses = all.filter((q) => (q.type || 'choose') === 'choose' && q.opts.some((o) => !o.ok)).slice(0, 3);
    /* for Back: choose questions shown ONLY at the IB IA level, and others shown only at IGCSE */
    const ibOnly = all.filter((q) => (q.type || 'choose') === 'choose' && q.lv === 'i' && q.opts.some((o) => !o.ok)).slice(0, 3);
    const gOnly = all.filter((q) => (q.type || 'choose') === 'choose' && q.lv === 'g').slice(0, 2);
    return { multi, sort, chooses, ibOnly, gOnly };
  });
  if (!pick.multi || !pick.sort || pick.chooses.length < 3) throw new Error('no questions to test with: ' + JSON.stringify(Object.keys(pick)));
  /* a wrong answer, checked; then (same: false) a different wrong answer, or (same: true) the same one again, checked */
  const twice = (kind, same) => ev((a) => {
    const W = window, k = a.k, q = W.__pick[k], host = W.__host();
    W.WUL.quiz(host, [q], { all: true });
    const card = host.querySelector('.quiz__card');
    const wrongs = Array.from(card.querySelectorAll('.opt')).filter((b) => b._o && !b._o.ok && b._o.why);
    if (k === 'multi') wrongs[0].click();
    else Array.from(card.querySelectorAll('.chips--pool .chip')).forEach((c) => { c.click(); card.querySelector('.bin[data-bin="' + ((c._it.bin + 1) % q.bins.length) + '"]').click(); });
    W.__checkBtn().click(); const first = W.__help();
    if (!a.same) {
      if (k === 'multi') wrongs[1].click();                 /* a second wrong option ticked as well */
      else { const c = card.querySelector('.bin .chip'); c.click(); card.querySelector('.bin[data-bin="' + c._it.bin + '"]').click(); }   /* one item put right */
    }
    W.__checkBtn().click(); const second = W.__help();
    return { first, second };
  }, { k: kind, same: !!same });
  await ev((p) => { window.__pick = p; }, pick);
  await check('without the accommodation: no help after two wrong checks (multi, sort)', async () => {
    for (const k of ['multi', 'sort']) { const r = await twice(k); if (r.first || r.second) throw new Error(k + ': ' + JSON.stringify(r).slice(0, 160)); }
  });
  /* the accommodation, from the teacher: the page learns it when it loads */
  srv.acc['pupil.one@nlcsjeju.kr'] = true;
  await go('#/', true); await wait(1200);
  await ev(PAGE_KIT); await ev((p) => { window.__pick = p; }, pick);
  await check('with the accommodation: the page knows it', async () => {
    const a = await ev(() => !!(window.WUL.hw && window.WUL.hw.acc));
    if (!a) throw new Error('WUL.hw.acc is not set');
  });
  await check('with the accommodation: the same answer checked twice gets no help (multi, sort)', async () => {
    for (const k of ['multi', 'sort']) { const r = await twice(k, true); if (r.first || r.second) throw new Error(k + ': ' + JSON.stringify(r).slice(0, 160)); }
  });
  await check('with the accommodation: a Check with nothing ticked is no try (it says so); the help still needs two real wrong answers', async () => {
    const r = await ev(() => {
      const W = window, q = W.__pick.multi, host = W.__host();
      W.WUL.quiz(host, [q], { all: true });
      const card = host.querySelector('.quiz__card'), wrongs = Array.from(card.querySelectorAll('.opt')).filter((b) => b._o && !b._o.ok && b._o.why);
      W.__checkBtn().click(); const said = card.querySelector('.quiz__fb').textContent;
      wrongs[0].click(); W.__checkBtn().click();
      return { said, help: W.__help() };
    });
    if (!/Tick at least one answer first/.test(r.said)) throw new Error('an empty Check said: ' + r.said);
    if (r.help) throw new Error('an empty Check counted as a try: help after one real wrong answer');
  });
  await check('an empty Check costs nothing: no "right first time" lost, no homework letter sent, and three of them still bring "Show me"', async () => {
    const r = await ev(() => {
      const W = window, q = W.__pick.multi, host = W.__host(), told = [];
      W.WUL.quiz(host, [q], { all: true, id: '__acc_empty', onAnswer: function (qq, l) { told.push(l); } });
      const card = () => host.querySelector('.quiz__card');
      W.__checkBtn().click();                                                    /* nothing ticked */
      Array.from(card().querySelectorAll('.opt')).forEach((b) => { if (b._o.ok) b.click(); });
      W.__checkBtn().click();                                                    /* the right answer */
      const next = Array.from(card().querySelectorAll('.quiz__foot button')).find((x) => /See my score|Next question/.test(x.textContent)); next.click();
      const end = card().textContent;
      /* and three empty Checks on a fresh card bring "Show me", as before */
      W.WUL.quiz(host, [q], { all: true });
      for (let k = 0; k < 3; k++) W.__checkBtn().click();
      return { told: told.join(','), end, show: !!host.querySelector('.btn--show') };
    });
    if (r.told !== 'f') throw new Error('homework letters sent: ' + r.told);
    if (!/1\s*\/\s*1/.test(r.end) || !/right first time/.test(r.end)) throw new Error('the end reads ' + r.end.slice(0, 120));
    if (!r.show) throw new Error('three empty Checks no longer bring "Show me"');
  });
  await check('with the accommodation: nothing after the FIRST wrong check; after the second, why each wrongly ticked option is wrong (multi)', async () => {
    const r = await twice('multi');
    if (r.first) throw new Error('help after the first check: ' + r.first.slice(0, 80));
    if (!/^Why/.test(r.second) || r.second.length < 20) throw new Error('no help after the second: ' + JSON.stringify(r.second));
  });
  await check('with the accommodation: after the second wrong check, why each item in a wrong group belongs elsewhere (sort)', async () => {
    const r = await twice('sort');
    if (r.first || !/^Why/.test(r.second)) throw new Error(JSON.stringify(r).slice(0, 200));
  });
  await check('with the accommodation: a choose question adds nothing (it explains every click already)', async () => {
    const r = await ev(() => {
      const W = window, q = W.__pick.chooses[0], host = W.__host();
      W.WUL.quiz(host, [q], { all: true });
      const wrongs = Array.from(host.querySelectorAll('.opt')).filter((b) => !b._o.ok);
      wrongs[0].click(); if (wrongs[1]) wrongs[1].click();
      return W.__help();
    });
    if (r) throw new Error('help shown: ' + r.slice(0, 80));
  });
  await check('redo: the end offers "Redo the 1 you missed"; the redo plays that question, records nothing, and goes back', async () => {
    const r = await ev(() => {
      const W = window, host = W.__host(), qs = W.__pick.chooses, told = [];
      const progBefore = JSON.stringify(W.WUL.store.get('prog', {}));
      W.WUL.quiz(host, qs, { all: true, id: '__acc_test', onAnswer: function (q, l) { told.push(l); } });
      const card = () => host.querySelector('.quiz__card');
      const answer = (right) => { const b = Array.from(card().querySelectorAll('.opt')).find((x) => !!x._o.ok === right && !x.disabled); b.click(); };
      const next = () => { const b = Array.from(card().querySelectorAll('.quiz__foot button')).find((x) => /Next question|See my score/.test(x.textContent)); b.click(); };
      const firstQ = card().querySelector('.quiz__q').textContent;
      answer(false); answer(true); next();          /* question 1: missed */
      answer(true); next(); answer(true); next();   /* 2 and 3: right first time */
      const end = card().textContent;
      const progAfterTest = JSON.stringify(W.WUL.store.get('prog', {}));
      const redo = Array.from(card().querySelectorAll('button')).find((x) => /^Redo the/.test(x.textContent));
      const label = redo ? redo.textContent : '';
      const toldBefore = told.length;
      redo.click();
      const top = host.querySelector('.quiz__top').textContent, redoQ = card().querySelector('.quiz__q').textContent;
      answer(true); next();
      const redoEnd = card().textContent, progAfterRedo = JSON.stringify(W.WUL.store.get('prog', {}));
      const back = Array.from(card().querySelectorAll('button')).find((x) => x.textContent === 'Back to all the questions');
      if (back) back.click();
      const backTop = host.querySelector('.quiz__top').textContent;
      return { end, label, top, firstQ, redoQ, redoEnd, toldDuring: told.length - toldBefore, progChanged: progAfterRedo !== progAfterTest, testRecorded: progAfterTest !== progBefore, backTop, hasBack: !!back };
    });
    if (r.label !== 'Redo the 1 you missed') throw new Error('the button reads ' + JSON.stringify(r.label) + ' · end: ' + r.end.slice(0, 120));
    if (!/Redo · practice/.test(r.top) || !/Question 1 of 1/.test(r.top)) throw new Error('the redo says ' + r.top);
    if (r.redoQ !== r.firstQ) throw new Error('the redo played another question');
    if (r.toldDuring) throw new Error('the redo told the records ' + r.toldDuring + ' time(s)');
    if (!r.testRecorded) throw new Error('the test itself did not record its score (the harness is not seeing the store)');
    if (r.progChanged) throw new Error('the redo changed the score');
    if (!/right first time in this redo/.test(r.redoEnd)) throw new Error('the redo end reads ' + r.redoEnd.slice(0, 120));
    if (!r.hasBack || !/Question 1 of 3/.test(r.backTop)) throw new Error('back: ' + r.backTop);
  });
  await check('Back after a redo keeps the set’s own level: an IB set stays IB, never the level saved in the browser', async () => {
    if (!pick.ibOnly || pick.ibOnly.length < 2) throw new Error('no IB-only choose questions to test with');
    const r = await ev((p) => {
      const W = window, host = W.__host(), qs = p.ibOnly.concat(p.gOnly);
      W.WUL.store.set('level', 'g');                        /* the browser's own level is IGCSE */
      W.WUL.withLevel('i', () => W.WUL.quiz(host, qs, { id: '__acc_level' }));
      const card = () => host.querySelector('.quiz__card');
      const top = () => host.querySelector('.quiz__top').textContent;
      const startTop = top();
      const answer = (right) => { const b = Array.from(card().querySelectorAll('.opt')).find((x) => !!x._o.ok === right && !x.disabled); b.click(); };
      const next = () => { const b = Array.from(card().querySelectorAll('.quiz__foot button')).find((x) => /Next question|See my score/.test(x.textContent)); b.click(); };
      answer(false); answer(true); next();
      for (let k = 1; k < p.ibOnly.length; k++) { answer(true); next(); }
      Array.from(card().querySelectorAll('button')).find((x) => /^Redo the/.test(x.textContent)).click();
      answer(true); next();
      Array.from(card().querySelectorAll('button')).find((x) => x.textContent === 'Back to all the questions').click();
      return { startTop, backTop: top(), n: p.ibOnly.length };
    }, pick);
    const want = 'of ' + r.n;
    if (r.startTop.indexOf(want) < 0) throw new Error('set-up: the IB set starts at ' + r.startTop);
    if (r.backTop.indexOf('Question 1 ' + want) < 0) throw new Error('Back redrew the set as ' + r.backTop + ', not ' + want);
  });
  await check('no script error anywhere', async () => { if (errors.length) throw new Error(errors.slice(0, 3).join(' | ')); });
} catch (e) { fails++; console.log('  FAIL (the run) ' + e.message); }
finally {
  ws.close(); chrome.kill();
  try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
}
console.log(`\n${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
