#!/usr/bin/env node
/* tools/smoke.mjs — render stations in headless Chrome at every level and report problems.
   usage: node tools/smoke.mjs [station ids…]     (no ids = every station; needs the server on :8830)
   Checks: no script error while drawing (body[data-errors]), a page heading, no "missing" tool,
   no "Unknown block", and that a station meant for that level shows at least Build it and Test yourself. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:8830/labs/write-up-lab/index.html';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let ids = process.argv.slice(2);
if (!ids.length) ids = fs.readdirSync(path.join(ROOT, 'js/stations')).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'wul-smoke-'));
let bad = 0;
function dump(url) {
  try {
    return execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${prof}`, '--timeout=6000', '--dump-dom', url], { encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) { return e.stdout || ''; }
}
for (const id of ids) {
  const src = fs.readFileSync(path.join(ROOT, `js/stations/${id}.js`), 'utf8');
  if (!/WUL\.station\(/.test(src)) { console.log(`–  ${id}: not written yet`); continue; }
  const lv = (src.match(/levels:\s*'([gie]+)'/) || [, 'gie'])[1];
  for (const l of ['g', 'i', 'e']) {
    const dom = dump(`${BASE}?lv=${l}&all=1#/part/${id}`);
    const probs = [];
    const errs = (dom.match(/data-errors="(\d+)"/) || [, '?'])[1];
    if (errs !== '0') probs.push(`script errors: ${errs}`);
    if (!/class="phead__h"/.test(dom)) probs.push('no page heading');
    const miss = (dom.match(/class="missing"/g) || []).length; if (miss) probs.push(`${miss} missing/failed tool or block`);
    if (lv.includes(l)) {
      if (!/id="build"/.test(dom)) probs.push('no Build it section');
      if (!/id="test"/.test(dom)) probs.push('no Test yourself section');
    }
    if (probs.length) { bad++; console.log(`✘  ${id} @${l}: ${probs.join('; ')}`); }
    else console.log(`✔  ${id} @${l}`);
  }
}
fs.rmSync(prof, { recursive: true, force: true });
if (bad) { console.log(`\n${bad} problem page(s)`); process.exit(1); }
console.log('\n✔ smoke test passed');
