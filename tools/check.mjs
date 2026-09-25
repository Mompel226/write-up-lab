#!/usr/bin/env node
/* ============================================================
   tools/check.mjs — the gate. Loads every station and data file the
   way the page does, then refuses to pass if anything would break
   or teach something wrong. Run from the site folder:

       node tools/check.mjs            check only
       node tools/check.mjs --stamp    check, then stamp ?v= and version.txt

   What it checks
   · every station: required fields, known stage, known block types
   · every question: exactly one right answer (choose), at least one (multi),
     every sort item in a real group, build answers made of real chips,
     spot questions with a reason for every mistake
   · every red pen: a note for every mark, a mark for every note
   · every [[keyword]] anywhere resolves to a definition
   · no keyword defined twice with different wording
   · model answers contain no I / we / my / our
   · the running-example data: every mean and SD recomputed
   · index.html loads every station and widget file that exists
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errs = [], warns = [];
const E = (m) => errs.push(m), W = (m) => warns.push(m);

/* a page just real enough for the data files */
const noop = () => {};
const fakeEl = () => ({ addEventListener: noop, setAttribute: noop, appendChild: noop, classList: { add: noop, remove: noop, toggle: noop }, style: {}, querySelectorAll: () => [] });
const sandbox = {
  console,
  document: { addEventListener: noop, createElement: fakeEl, createTextNode: fakeEl, documentElement: fakeEl(), getElementById: () => null, querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: noop },
  matchMedia: () => ({ matches: false }),
  addEventListener: noop, setTimeout, clearTimeout
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const load = (rel) => {
  const p = path.join(ROOT, rel);
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: rel }); }
  catch (e) { E(`${rel}: fails to load — ${e.message}`); }
};

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"?]+)/g)].map((m) => m[1]);
/* index.html must list every station and widget file on disk */
for (const dir of ['js/stations', 'js/widgets']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir))) {
    if (f.endsWith('.js') && !scripts.includes(`${dir}/${f}`)) E(`index.html does not load ${dir}/${f}`);
  }
}
for (const s of scripts) if (!fs.existsSync(path.join(ROOT, s))) E(`index.html loads ${s}, which does not exist`);

/* load in page order, but only the data side */
for (const s of scripts) {
  if (/js\/(app|specimen|blocks|quiz|plot)\.js$/.test(s)) continue;   /* DOM code, not data */
  if (s.startsWith('js/widgets/')) continue;                           /* tools are checked by rendering */
  load(s);
}
const WUL = sandbox.WUL;
if (!WUL) { console.error('core.js did not load'); process.exit(1); }
(WUL.problems || []).forEach(E);

const STAGES = new Set(WUL.STAGES.map((s) => s.id));
const BLOCKS = new Set(['text', 'rules', 'compare', 'anatomy', 'note', 'callout', 'table', 'plot', 'steps', 'frames', 'widget', 'redpen', 'grid2']);
const QTYPES = new Set(['choose', 'multi', 'sort', 'order', 'spot', 'build']);
const LV = /^[gie]{1,3}$/;
const markup = [];         /* [where, string] every piece of markup, for keyword + voice checks */
const models = [];         /* model answers: no first person */

function collectVisual(where, v) {
  if (v == null) return;
  if (typeof v === 'string') { markup.push([where, v]); return; }
  if (v.md) markup.push([where, v.md]);
  if (v.table) {
    const t = v.table; if (t.caption) markup.push([where, t.caption]);
    for (const r of [...(t.head || []), ...(t.rows || [])]) for (const c of r) markup.push([where, typeof c === 'object' && c ? String(c.t ?? '') : String(c ?? '')]);
    if (t.note) markup.push([where, t.note]);
  }
  if (v.plot && v.plot.caption) markup.push([where, v.plot.caption]);
}
function lvOk(where, lv) { if (lv != null && !LV.test(lv)) E(`${where}: bad lv "${lv}"`); }

for (const id of WUL.stationOrder) {
  const s = WUL.stations[id], at = `station ${id}`;
  if (!fs.existsSync(path.join(ROOT, `js/stations/${id}.js`))) W(`${at}: registered from a file not named ${id}.js`);
  for (const k of ['stage', 'title', 'levels', 'job']) if (!s[k]) E(`${at}: missing ${k}`);
  if (!STAGES.has(s.stage)) E(`${at}: unknown stage "${s.stage}"`);
  lvOk(at, s.levels);
  for (const f of ['job', 'where']) { const v = s[f]; if (typeof v === 'string') markup.push([`${at}.${f}`, v]); else if (v) Object.values(v).forEach((x) => markup.push([`${at}.${f}`, x])); }
  if (s.ladder) for (const [l, items] of Object.entries(s.ladder)) { if (!'gie'.includes(l)) E(`${at}: ladder key ${l}`); (items || []).forEach((t) => markup.push([`${at}.ladder`, t])); }
  (s.build || []).forEach((b, i) => {
    const w = `${at}.build[${i}]`;
    if (!BLOCKS.has(b.type)) E(`${w}: unknown block type "${b.type}"`);
    lvOk(w, b.lv);
    if (b.md) markup.push([w, b.md]);
    if (b.intro) markup.push([w, b.intro]);
    if (b.after) markup.push([w, b.after]);
    if (b.type === 'rules') (b.items || []).forEach((it) => { markup.push([w, typeof it === 'string' ? it : it.t]); if (it.lv) lvOk(w, it.lv); });
    if (b.type === 'compare') { collectVisual(w, b.bad); collectVisual(w, b.good); if (b.why) markup.push([w, b.why]); if (typeof b.good === 'string') models.push([w + '.good', b.good]); }
    if (b.type === 'anatomy') {
      collectVisual(w, b.model); if (typeof b.model === 'string') models.push([w + '.model', b.model]);
      const used = new Set([...(typeof b.model === 'string' ? b.model : JSON.stringify(b.model)).matchAll(/\{([1-6]):/g)].map((m) => +m[1]));
      const tagged = new Set([...(JSON.stringify(b.model)).matchAll(/data-part=\\?"(\d)/g)].map((m) => +m[1]));
      (b.parts || []).forEach((p) => { if (!used.has(p.n) && !tagged.has(p.n)) E(`${w}: legend part ${p.n} "${p.name}" is not marked in the model`); if (p.note) markup.push([w, p.note]); });
    }
    if (b.type === 'table') collectVisual(w, { table: b.spec });
    if (b.type === 'plot') collectVisual(w, { plot: b.spec });
    if (b.type === 'frames') (b.items || []).forEach((t) => markup.push([w, t]));
    if (b.type === 'grid2') (b.items || []).forEach((it) => { collectVisual(w, it.v); if (it.note) markup.push([w, it.note]); });
    if (b.type === 'steps') {
      if (!b.stage) E(`${w}: steps without a stage`);
      (b.steps || []).forEach((st) => { if (!st.title || !st.text) E(`${w}: a step needs title and text`); markup.push([w, st.text]); lvOk(w, st.lv); });
      const els = new Set([...JSON.stringify(b.stage).matchAll(/"el":"([^"]+)"|capEl":"([^"]+)"/g)].map((m) => m[1] || m[2]));
      if (b.stage && b.stage.plot) ['paper', 'axis-x', 'axis-y', 'ticks-x', 'ticks-y', 'label-x', 'label-y', 'title', 'caption', 'key', 'break', 'bars', 'err-bars'].forEach((e) => els.add(e));
      if (b.stage && b.stage.plot) (b.stage.plot.series || []).forEach((se, si) => { const sid = se.id || 's' + si; ['pts-', 'line-', 'err-'].forEach((p) => els.add(p + sid)); });
      if (b.stage && b.stage.html) [...b.stage.html.matchAll(/data-el="([^"]+)"/g)].forEach((m) => els.add(m[1]));
      (b.steps || []).forEach((st) => [...(st.show || []), ...(st.focus || [])].forEach((e) => { if (!els.has(e) && !els.has(e.replace(/-\d+$/, ''))) W(`${w}: step shows "${e}", which the stage does not have`); }));
    }
    if (b.type === 'widget' && !fs.existsSync(path.join(ROOT, `js/widgets/${b.name}.js`))) E(`${w}: widget "${b.name}" has no file`);
    if (b.type === 'redpen') checkRedpen(w, b);
  });
  if (s.redpen) {
    const byLevel = ('g' in s.redpen || 'i' in s.redpen || 'e' in s.redpen) ? s.redpen : { g: s.redpen };
    for (const [l, rp] of Object.entries(byLevel)) checkRedpen(`${at}.redpen.${l}`, rp);
  }
  (s.traps || []).forEach((t, i) => { lvOk(`${at}.traps[${i}]`, t.lv); markup.push([`${at}.traps`, t.bad]); if (t.good) { markup.push([`${at}.traps`, t.good]); } });
  if (s.frames) (Array.isArray(s.frames) ? s.frames : Object.values(s.frames).flat()).forEach((t) => markup.push([`${at}.frames`, t]));
  (s.test || []).forEach((q, i) => checkQ(`${at}.test[${i}]`, q));
  (s.words || []).forEach((w, i) => { if (!w.term || !w.def) E(`${at}.words[${i}]: needs term and def`); lvOk(`${at}.words`, w.lv); markup.push([`${at}.words`, w.def]); if (w.eg) markup.push([`${at}.words`, w.eg]); });
  (s.further || []).forEach((f, i) => { if (!f.title || !f.md) E(`${at}.further[${i}]: needs title and md`); markup.push([`${at}.further`, f.md]); });
  const nTests = (s.test || []).length;
  if (nTests < 4) W(`${at}: only ${nTests} test questions (aim for 6–10)`);
}

function checkRedpen(w, rp) {
  const body = typeof rp.body === 'string' ? rp.body : JSON.stringify(rp.body || '');
  const marks = new Set([...body.matchAll(/\[!([\w-]+):/g)].map((m) => m[1]));
  const els = rp.body && rp.body.plot ? Object.entries(rp.notes || {}).filter(([, n]) => n.el).map(([k]) => k) : [];
  els.forEach((k) => marks.add(k));
  for (const k of Object.keys(rp.notes || {})) {
    if (!marks.has(k)) E(`${w}: note "${k}" has no mark in the body`);
    const n = rp.notes[k]; if (!n.label || !n.why) E(`${w}: note "${k}" needs label and why`);
    if (n.label && n.label.length > 26) W(`${w}: red-pen label "${n.label}" is long (keep it to a few words)`);
    markup.push([w, n.why]);
  }
  for (const k of marks) if (!(rp.notes || {})[k]) E(`${w}: mark "${k}" has no note`);
  if (!rp.fixed) E(`${w}: no fixed version`);
  if (typeof rp.fixed === 'string') { markup.push([w + '.fixed', rp.fixed]); models.push([w + '.fixed', rp.fixed]); }
  collectVisual(w, rp.fixed); collectVisual(w, rp.body);
}

function checkQ(w, q) {
  const t = q.type || 'choose';
  if (!QTYPES.has(t)) { E(`${w}: unknown type ${t}`); return; }
  if (!q.q) E(`${w}: no question text`);
  lvOk(w, q.lv); markup.push([w, q.q || '']);
  if (q.show) collectVisual(w, q.show);
  if (t === 'choose' || t === 'multi') {
    const ok = (q.opts || []).filter((o) => o.ok).length;
    if (t === 'choose' && ok !== 1) E(`${w}: choose needs exactly one right option (has ${ok})`);
    if (t === 'multi' && ok < 1) E(`${w}: multi needs at least one right option`);
    if ((q.opts || []).length < 3) W(`${w}: fewer than 3 options`);
    (q.opts || []).forEach((o) => { markup.push([w, o.t]); if (o.why) markup.push([w, o.why]); if (t === 'choose' && !o.why) W(`${w}: option "${String(o.t).slice(0, 40)}" has no why`); });
  }
  if (t === 'sort') {
    if (!(q.bins || []).length) E(`${w}: sort without bins`);
    (q.items || []).forEach((it) => { if (!(it.bin >= 0 && it.bin < q.bins.length)) E(`${w}: item "${it.t}" in no real group`); markup.push([w, it.t]); if (it.why) markup.push([w, it.why]); });
  }
  if (t === 'order' && (q.items || []).length < 3) E(`${w}: order needs 3+ items`);
  if (t === 'spot') {
    const ks = [...(q.text || '').matchAll(/\[!([\w-]+):/g)].map((m) => m[1]);
    if (!ks.length) E(`${w}: spot has no mistakes marked`);
    ks.forEach((k) => { if (!(q.why || {})[k]) E(`${w}: spot mistake "${k}" has no why`); });
    markup.push([w, q.text || '']);
  }
  if (t === 'build') {
    const answers = q.answers || [q.answer];
    answers.forEach((a) => (a || []).forEach((c) => { if (!(q.chips || []).includes(c)) E(`${w}: answer chip "${c}" is not among the chips`); }));
  }
}

/* keywords: every [[…]] must resolve */
for (const [where, s] of markup) {
  for (const m of String(s ?? '').matchAll(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g)) {
    const key = (m[2] || m[1]).trim();
    if (!WUL.wordKey(key)) E(`${where}: keyword [[${m[0].slice(2, -2)}]] has no definition in any station`);
  }
}
/* model answers are impersonal */
for (const [where, s] of models) {
  const plain = String(s).replace(/\[[!?][\w-]*:[^\]]*\]/g, '');
  const hit = plain.match(/\b(I|we|We|my|My|our|Our|me|us)\b/);
  if (hit) E(`${where}: model answer uses "${hit[1]}" — write it impersonally`);
}

/* titles of tables and figures: one informative pattern (SPEC.md, Daniel 25 Sep 2026).
   Every string literal in a station, widget or the specimen that starts "Table N." or "Figure N."
   must name what it shows. Strings holding a red-pen mark [!…] are deliberate mistakes and skipped. */
{
  const TYPES = '(Line graph|Bar chart|Scatter graph|Histogram|Box-and-whisker plot|Dot plot)';
  const KIND = '(Data|Raw data|Processed data|Raw and processed data|Data and observations)';
  const tableOk = (t) => new RegExp('^Table \\d+\\. ' + KIND + ' showing the (effect of .+ on |relationship between .+ and |distribution of )').test(t) || /^Table \d+\. .+ for the investigation of the effect of .+ on /.test(t);
  const figOk = (t) => new RegExp('^Figure \\d+\\. ' + TYPES + ' showing the (effect of .+ on |relationship between .+ and |distribution of )').test(t);
  const files = ['js/specimen.js', ...fs.readdirSync(path.join(ROOT, 'js/stations')).map((f) => 'js/stations/' + f), ...fs.readdirSync(path.join(ROOT, 'js/widgets')).map((f) => 'js/widgets/' + f)];
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/(['"`])((?:\\.|(?!\1).)*?)\1/g)) {
      let t = m[2].replace(/^==/, '').replace(/\\u00a0|\\u2060/g, ' ').replace(/==/g, '').trim();
      if (!/^(Table|Figure) \d+\./.test(t)) continue;
      if (/\[!/.test(m[2]) || /\$\{|' \+|" \+/.test(m[2])) continue;          /* a deliberate mistake, or built from parts */
      if (/^(Table|Figure) \d+\.$/.test(t)) continue;                                /* a build chip or a frame stub */
      const before = src.slice(Math.max(0, m.index - 40), m.index), after = src.slice(m.index + m[0].length, m.index + m[0].length + 400);
      if (/(\bbad:|X\('title',)\s*$/.test(before)) continue;
      if (/^\s*\+/.test(after)) continue;                                              /* the start of a title built from parts */                        /* the broken version, on purpose */
      if (/\{\s*t:\s*$/.test(before) && !/^[^}]*\bok:\s*true/.test(after)) continue;  /* a wrong quiz option */
      const ok = t.startsWith('Table') ? tableOk(t) : figOk(t);
      if (!ok) E(`${f}: title does not follow the pattern — "${t.slice(0, 90)}"`);
    }
  }
}

/* the running examples */
const A = WUL.data && WUL.data.amylase;
if (A) {
  A.g.trials.forEach((t, i) => { const m = Math.round(t.reduce((a, b) => a + b) / t.length); if (m !== A.g.means[i]) E(`datasets: IGCSE mean ${i} is ${A.g.means[i]}, trials give ${m}`); });
  A.i.trials.forEach((t, i) => {
    const mean = t.reduce((a, b) => a + b) / t.length;
    const sd = Math.sqrt(t.reduce((a, v) => a + (v - mean) ** 2, 0) / (t.length - 1));
    if (Math.round(mean) !== A.i.means[i]) E(`datasets: IA mean ${i} is ${A.i.means[i]}, trials give ${mean}`);
    if (+sd.toFixed(1) !== A.i.sds[i]) E(`datasets: IA SD ${i} is ${A.i.sds[i]}, trials give ${sd.toFixed(2)}`);
    if (+(sd / Math.sqrt(t.length)).toFixed(1) !== A.i.ses[i]) E(`datasets: IA SE ${i} is ${A.i.ses[i]}, trials give ${(sd / Math.sqrt(t.length)).toFixed(2)}`);
    if (+(1000 / A.i.means[i]).toFixed(1) !== A.i.rates[i]) E(`datasets: IA rate ${i} is ${A.i.rates[i]}, mean gives ${(1000 / A.i.means[i]).toFixed(2)}`);
    t.forEach((v) => { if (v % A.sampling) E(`datasets: ${v} s is not a multiple of the ${A.sampling} s sampling interval`); });
  });
}

/* stamp */
if (process.argv.includes('--stamp') && !errs.length) {
  const v = String(Date.now());
  fs.writeFileSync(path.join(ROOT, 'index.html'), html.replace(/\?v=[A-Za-z0-9]+/g, `?v=${v}`));
  fs.writeFileSync(path.join(ROOT, 'version.txt'), v + '\n');
  console.log(`stamped ${v}`);
}

const n = WUL.stationOrder.length, q = WUL.stationOrder.reduce((a, id) => a + (WUL.stations[id].test || []).length, 0);
console.log(`${n} stations · ${q} questions · ${Object.keys(WUL.words).length} keywords`);
if (warns.length) console.log('\nWarnings:\n  ' + warns.join('\n  '));
if (errs.length) { console.log('\nERRORS:\n  ' + errs.join('\n  ')); process.exit(1); }
console.log('\n✔ all checks passed');
