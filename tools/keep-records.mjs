#!/usr/bin/env node
/* ============================================================
   tools/keep-records.mjs — a part whose options were reworded WITHOUT changing what any question asks keeps its records.

   WHY (Daniel, 7 Oct 2026): pupils found that the right option was nearly always the longest, and the wrong options were
   rewritten. A part's fingerprint (WUL.partV, js/track.js) covers every question's words and options, and a part whose
   fingerprint changed "starts again, here and in the spreadsheet" (the page's fit() and the labs script's _wuFit_ and
   _wuMerge_). Daniel's rule: fixing the questions must not touch the work pupils have already done.

   HOW: the part carries `keepV: { v, now, on, why }` in its station file. `v` is the fingerprint its records were saved
   under; `now` is the fingerprint of the wording it was declared for. WUL.partV returns `v` while the part still reads
   exactly as `now` says (and so do data/parts.json, written by tools/check.mjs --stamp, and the spreadsheet, which reads
   it). Reword the part again and it starts again, as any rewritten part does. (Not `keep`: on a question, `keep` already
   means "keep these options in their order".)

   This tool writes `keepV` only after checking that every question of the part still asks the same thing: the same
   number of questions, each of the same type, with the same question, the same levels, the same figure, items, groups,
   text, chips and answers, the same number of options, each still right or wrong as before, and the same red pens. Only
   the options' words (and their `why`) may differ. Anything else changed is reported, and that part starts again.

   usage (from write-up-lab/), after editing the station files:
     node tools/keep-records.mjs --was <a folder holding js/stations/ from before the edit> [--why "<one line>"] [--write]
   Without --write it only reports. With --write it writes the keeps and proves that every kept part reads as its old
   fingerprint; then node tools/check.mjs --stamp (it writes data/parts.json). To reword a kept part again: take its keepV
   out, reword it, and run this tool with the station files from before: the new keepV carries the FIRST fingerprint on.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const WAS = opt('--was'), WRITE = args.includes('--write');
const WHY = opt('--why') || 'the options reworded without changing what any question asks';
const ON = new Date().toISOString().slice(0, 10);
if (!WAS) { console.error('usage: node tools/keep-records.mjs --was <old folder with js/stations/> [--why "…"] [--write]'); process.exit(2); }

/* the site's data side, loaded the way tools/check.mjs loads it, with the station files from `stations` */
function load(stations) {
  const noop = () => {};
  const fakeEl = () => ({ addEventListener: noop, setAttribute: noop, appendChild: noop, classList: { add: noop, remove: noop, toggle: noop }, style: {}, querySelectorAll: () => [] });
  const sb = { console, document: { addEventListener: noop, createElement: fakeEl, createTextNode: fakeEl, documentElement: fakeEl(), getElementById: () => null, querySelectorAll: () => [] },
               localStorage: { getItem: () => null, setItem: noop }, matchMedia: () => ({ matches: false }), addEventListener: noop, setTimeout, clearTimeout };
  sb.window = sb; sb.globalThis = sb;
  vm.createContext(sb);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1]).filter(s => !/^https?:/.test(s));
  for (const s of scripts) {
    if (/js\/(app|specimen|blocks|quiz|plot|account|signin|config)\.js$/.test(s) || s.startsWith('js/widgets/')) continue;
    const p = s.startsWith('js/stations/') ? path.join(stations, path.basename(s)) : path.join(ROOT, s);
    vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: s });
  }
  return sb.WUL;
}
const OLD = load(path.resolve(WAS, 'js/stations')), NOW = load(path.join(ROOT, 'js/stations'));
const contentV = (W, s) => W.partV(Object.assign({}, s, { keepV: undefined }));

/* the same questions, in other words: only the options' t and why may differ */
const pick = q => JSON.stringify({ type: q.type, q: q.q, lv: q.lv, keep: q.keep, show: q.show, items: q.items, bins: q.bins, text: q.text,
  chips: q.chips, answers: q.answers, answer: q.answer, n: Array.isArray(q.opts) ? q.opts.length : -1,
  ok: Array.isArray(q.opts) ? q.opts.map(o => !!o.ok) : null, rest: Array.isArray(q.opts) ? q.opts.map(o => { const { t, why, ok, ...r } = o; return r; }) : null });
function sameQuestions(a, b) {
  if (!a || !b) return 'not in both versions';
  const ta = a.test || [], tb = b.test || [];
  if (ta.length !== tb.length) return 'the number of questions changed';
  for (let i = 0; i < ta.length; i++) if (pick(ta[i]) !== pick(tb[i])) return 'question ' + (i + 1) + ' changed beyond its options’ words';
  const red = (W, s) => JSON.stringify(W.redpensOf(s).map(x => x.l + ':' + x.keys.join(',')));
  if (red(OLD, a) !== red(NOW, b)) return 'its red pens changed';
  return '';
}

const keep = [], refuse = [];
for (const id of Object.keys(NOW.stations)) {
  const was = OLD.stations[id], s = NOW.stations[id];
  if (!was) continue;
  const old = OLD.partV(was), now = contentV(NOW, s);
  if (old === now || NOW.partV(s) === old) continue;               /* unchanged, or kept already */
  const why = sameQuestions(was, s);
  if (why) refuse.push(id + ': ' + why); else keep.push({ id, v: old, now });
}
console.log(`${keep.length} part(s) reworded within the rules: they keep their records` + (WRITE ? '' : ' (dry run: --write writes the keeps)'));
keep.forEach(k => console.log('  keepV ' + k.id.padEnd(14) + ' ' + k.now + ' → ' + k.v));
if (refuse.length) { console.log(`${refuse.length} part(s) changed beyond the options' words: they start again for every pupil`); refuse.forEach(r => console.log('  ✗ ' + r)); }
if (!WRITE || !keep.length) process.exit(refuse.length ? 1 : 0);

/* write each keepV just after its part's id, in the one station file that declares it */
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const dir = path.join(ROOT, 'js/stations');
for (const k of keep) {
  const re = new RegExp("WUL\\.station\\(\\{\\s*id:\\s*(['\"])" + k.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\1\\s*,", 'g');
  const hits = fs.readdirSync(dir).filter(f => f.endsWith('.js')).flatMap(f => [...fs.readFileSync(path.join(dir, f), 'utf8').matchAll(re)].map(m => ({ f, m })));
  if (hits.length !== 1) { console.error(`✗ ${k.id}: declared ${hits.length} times in js/stations; nothing written for it`); process.exitCode = 1; continue; }
  const p = path.join(dir, hits[0].f), text = fs.readFileSync(p, 'utf8'), at = hits[0].m.index + hits[0].m[0].length;
  fs.writeFileSync(p, text.slice(0, at) + ` keepV: { v: '${esc(k.v)}', now: '${esc(k.now)}', on: '${ON}', why: '${esc(WHY)}' },` + text.slice(at));
}

/* the proof: every kept part reads as its old fingerprint */
const AFTER = load(dir);
let wrong = 0;
keep.forEach(k => { const v = AFTER.partV(AFTER.stations[k.id]); if (v !== k.v) { wrong++; console.error(`✗ ${k.id}: reads as ${v}, not ${k.v}`); } });
console.log(`${keep.length - wrong} of ${keep.length} kept parts read as their old fingerprint. Now: node tools/check.mjs --stamp`);
process.exit(wrong || refuse.length ? 1 : 0);
