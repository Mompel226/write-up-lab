/* ============================================================
   widget: risk-builder — build a risk assessment for a practical.
   1. Pick the real hazards from a list that includes distractors.
   2. Match each hazard with its control measure (IGCSE: precaution)
      and, at IB, its emergency action. Every choice explains itself.
   3. At IB, choose the ethics and environment statement.
   4. The finished risk assessment, as a proper table:
      IGCSE hazard · risk · precaution; IB four columns + ethics row.
   Nothing moves on by itself: each stage opens with a button.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;

  /* ---------- wrong answers that recur, each with its reason ---------- */
  var W = {
    coat: { t: 'Wear a lab coat', why: 'A lab coat is worn in every practical. It does not match this hazard, and Cambridge never credits it.' },
    adult: { t: 'Work under adult supervision', why: 'This does not reduce the risk from this hazard, and Cambridge never credits it.' },
    careful: { t: 'Be careful', why: 'This names no action. Say what is done to reduce the risk.' },
    gloveHot: { t: 'Wear gloves', why: 'Thin gloves do not stop a scald. They can even hold hot water against the skin.' },
    goggleE: { t: 'Wear eye protection', why: 'That reduces the risk before anything happens, so it is a control measure. An emergency action is what to do __after__ harm happens.' },
    ice: { t: 'Hold ice on the burn', why: 'Ice can damage the skin further. Cool the burn under cool running water.' },
    glassHand: { t: 'Collect the broken glass by hand', why: 'That causes cuts. Use a brush and dustpan.' },
    tissueEye: { t: 'Wipe the eye with a tissue', why: 'Wiping can rub the chemical in. Rinse the eye with running water.' },
    carryOn: { t: 'Continue the experiment', why: 'Harm has happened. Treat it first, and tell the teacher.' },
    washCut: { t: 'Rinse the cut and continue cutting', why: 'Tell the teacher first. A deep cut needs first aid.' }
  };
  var RINSE_EYE = { t: 'Rinse the eye with running water for at least 10 minutes; tell the teacher', ok: true, why: 'Running water dilutes and removes the chemical.' };
  var COOL_BURN = { t: 'Cool the burn under cool running water for 20 minutes; tell the teacher', ok: true, why: 'Cool running water stops the burn getting deeper. The NHS advises 20 minutes.' };
  var SWEEP = { t: 'Collect broken glass with a brush and dustpan; tell the teacher', ok: true, why: 'Glass is never collected by hand. It goes in the glass bin.' };
  var DRESS = { t: 'Press a clean dressing on the cut; tell the teacher', ok: true, why: 'Pressure stops the bleeding, and the teacher gives first aid.' };
  var GLASS = { id: 'glass', t: 'Glass tubes and pipettes', real: true, why: 'Broken glass can cut the skin.',
    risk: { g: 'Cuts if the glass breaks', i: 'Low: cuts if a tube is dropped or cracks.' },
    ctrl: [{ t: 'Tubes carried in a rack; chipped glass not used', ok: true, why: 'A rack stops tubes being dropped, and chipped glass breaks more easily.' }, W.coat, W.careful],
    em: [SWEEP, W.glassHand, W.carryOn] };
  var WATCH = { id: 'watch', t: 'The stopwatch', real: false, why: 'A stopwatch cannot cause harm in this method.' };

  var PRACS = [
    { name: 'Amylase and starch', inv: 'the effect of temperature (20–60 °C) on the time taken for amylase to digest starch',
      blurb: 'Starch and amylase are mixed in a water bath at 20–60 °C. Every 10 s, a drop is tested with iodine solution on a spotting tile.',
      items: [
        { id: 'iodine', t: 'Iodine solution, 0.01 mol dm⁻³', real: true, why: 'It can irritate the eyes, and it stains skin.',
          risk: { g: 'Irritation if a drop splashes into an eye', i: 'Low: dilute, used as drops. Irritation if a drop splashes into an eye.' },
          ctrl: [{ t: 'Eye protection worn; iodine used from a dropping bottle', ok: true, why: 'Eye protection matches the hazard, and a dropping bottle keeps the volume small.' }, W.coat, W.adult],
          em: [RINSE_EYE, W.goggleE, W.tissueEye] },
        { id: 'hot', t: 'Water bath at up to 60 °C', real: true, why: 'Hot water can scald the skin.',
          risk: { g: 'Scalding if a tube or the water spills', i: 'Moderate: water at 60 °C scalds within seconds if a tube or the bath is knocked.' },
          ctrl: [{ t: 'Tubes moved with a test-tube holder; the bath is not carried when full', ok: true, why: 'Hands stay out of the hot water, and the bath is not spilled.' }, W.gloveHot, W.careful],
          em: [COOL_BURN, W.ice, W.carryOn] },
        GLASS,
        { id: 'enzyme', lv: 'ie', t: 'Amylase solution', real: true, why: 'Enzymes can cause an allergy if they are inhaled as dust or spray.',
          risk: { g: 'Allergy if inhaled', i: 'Low: a dilute solution, not a powder. Enzymes can cause allergy if inhaled as dust or spray.' },
          ctrl: [{ t: 'Solution prepared by the technician; not shaken or sprayed', ok: true, why: 'No enzyme dust or spray reaches the air, so none is inhaled.' }, W.coat, W.adult],
          em: [{ t: 'Wash skin with water; if breathing is affected, move to fresh air and tell the teacher', ok: true, why: 'Remove the enzyme, and get help quickly if there is a reaction.' }, W.goggleE, W.carryOn] },
        WATCH,
        { id: 'starch', t: 'Starch solution', real: false, why: 'Starch is a food substance. A dilute solution is not a hazard.' },
        { id: 'tile', t: 'The spotting tile', real: false, why: 'A spotting tile is not a hazard. The iodine on it is.' }
      ],
      eth: [
        { t: 'No organisms, human tissue or body fluids were used, so no ethical issues arose. Dilute solutions were poured to waste with plenty of water; broken glass went in the glass bin.', ok: true, why: 'It says what was checked, and how the waste was disposed of.' },
        { t: 'No ethical or environmental issues.', why: 'Say __why__ there are none, and how the waste was disposed of.' },
        { t: 'Saliva was used as the source of amylase, with written consent.', why: 'Not allowed at IB: no body fluids of any kind, not even your own.' }
      ] },

    { name: 'Catalase and hydrogen peroxide', inv: 'the effect of hydrogen peroxide concentration on the volume of oxygen released by catalase in ',
      blurb: 'Pieces of liver or potato are added to hydrogen peroxide solutions of different concentrations, up to 6 %. The oxygen released is collected and measured.',
      tissues: ['liver', 'potato'],
      items: [
        { id: 'h2o2', t: 'Hydrogen peroxide solution, 6 %', real: true, why: 'An irritant: it can damage the eyes and irritate the skin.',
          risk: { g: 'Eye damage if it splashes', i: 'Moderate: froth can splash from the tube as oxygen is released. The eyes are most at risk.' },
          ctrl: [{ t: 'Eye protection worn; small volumes measured with a syringe; a tube big enough for the froth', ok: true, why: 'Each step makes a splash into the eyes less likely.' }, W.coat, W.adult],
          em: [{ t: 'Rinse the eye or skin with plenty of running water for at least 10 minutes; tell the teacher', ok: true, why: 'Running water dilutes and removes the peroxide.' }, W.goggleE, W.tissueEye] },
        { id: 'liver', only: 'liver', t: 'Raw liver', real: true, why: 'Raw meat can carry bacteria that cause food poisoning.',
          risk: { g: 'Infection if bacteria reach the mouth or a cut', i: 'Low: fresh liver from a butcher. Bacteria could reach the mouth or a cut.' },
          ctrl: [{ t: 'Liver handled with forceps and cut on its own tile; hands washed with soap afterwards', ok: true, why: 'Bacteria do not reach the hands or the mouth.' }, W.coat, W.careful],
          em: [{ t: 'Wash the area with soap and water; tell the teacher', ok: true, why: 'Soap and water remove the bacteria quickly.' }, W.goggleE, W.carryOn] },
        { id: 'scalpel', only: 'liver', t: 'Scalpel for cutting the liver', real: true, why: 'A sharp blade can cut the skin.',
          risk: { g: 'Cuts while cutting the liver', i: 'Moderate: raw liver is soft and slippery, so the blade can slip.' },
          ctrl: [{ t: 'Liver cut on a tile, with the blade moving away from the hand', ok: true, why: 'If the blade slips, it moves away from the fingers.' }, W.coat, W.adult],
          em: [DRESS, W.washCut, W.goggleE] },
        { id: 'borer', only: 'potato', t: 'Cork borer and scalpel for cutting potato', real: true, why: 'Sharp edges can cut the skin.',
          risk: { g: 'Cuts while cutting the potato', i: 'Moderate: the borer is pushed with force, and can slip.' },
          ctrl: [{ t: 'Potato cut on a tile; the borer twisted downwards, away from the hand', ok: true, why: 'The tile gives a firm surface, and the hand is never in the path of the blade.' }, W.coat, W.adult],
          em: [DRESS, W.washCut, W.goggleE] },
        GLASS,
        WATCH,
        { id: 'potato', only: 'potato', t: 'The potato', real: false, why: 'Raw potato is a food, and it is not a hazard.' },
        { id: 'trough', t: 'Cold water in the trough', real: false, why: 'Cold tap water is not a hazard.' }
      ],
      eth: {
        liver: [
          { t: 'The liver was bought from a butcher as food, so no animal was killed for the investigation. Liver waste was wrapped and put in the bin; dilute hydrogen peroxide was poured to waste with plenty of water.', ok: true, why: 'An ethical source, and safe disposal of each kind of waste.' },
          { t: 'No ethical issues: it is only liver.', why: 'Say why: the liver came from food, so no animal was killed for the experiment.' },
          { t: 'Liver from an animal killed at school, so that it was fresh.', why: 'Not allowed: no animal is killed for an experiment.' }
        ],
        potato: [
          { t: 'No animals or people were used, so no ethical issues arose. Potato waste was composted; dilute hydrogen peroxide was poured to waste with plenty of water.', ok: true, why: 'It says what was checked, and how the waste was disposed of.' },
          { t: 'No ethical or environmental issues.', why: 'Say __why__ there are none, and how the waste was disposed of.' },
          { t: 'Ethics only matter when people are involved.', why: 'Ethics covers animals and the environment too.' }
        ]
      } },

    { name: 'Beetroot membranes and temperature', inv: 'the effect of temperature (20–70 °C) on the leakage of red pigment from beetroot discs',
      blurb: 'Beetroot discs are held in hot water baths from 20 to 70 °C. The red pigment that leaks from the discs is measured with a colorimeter.',
      items: [
        { id: 'hot', t: 'Water baths at up to 70 °C', real: true, why: 'Hot water can scald the skin.',
          risk: { g: 'Scalding if a tube or the water spills', i: 'Moderate: water at 70 °C scalds in about a second if it is spilled.' },
          ctrl: [{ t: 'Tubes moved with a test-tube holder; baths not carried when full; the hottest bath at the back of the bench', ok: true, why: 'Hands stay out of the hot water, and the hottest bath is hard to knock.' }, W.gloveHot, W.careful],
          em: [COOL_BURN, W.ice, W.carryOn] },
        { id: 'borer', t: 'Cork borer and scalpel', real: true, why: 'Sharp edges can cut the skin.',
          risk: { g: 'Cuts while cutting the discs', i: 'Moderate: the borer is pushed with force, and can slip.' },
          ctrl: [{ t: 'Beetroot cut on a tile; the borer twisted downwards, away from the hand', ok: true, why: 'The tile gives a firm surface, and the hand is never in the path of the blade.' }, W.coat, W.adult],
          em: [DRESS, W.washCut, W.goggleE] },
        GLASS,
        { id: 'juice', t: 'Beetroot juice', real: false, why: 'It stains skin and clothes, but it is a food, not a hazard.' },
        { id: 'cuvette', t: 'Plastic cuvettes', real: false, why: 'Plastic cuvettes hold only water and pigment, and do not break into sharp pieces.' },
        WATCH
      ],
      eth: [
        { t: 'No animals or people were used, so no ethical issues arose. Beetroot waste was composted, and the coloured water was poured to waste.', ok: true, why: 'It says what was checked, and how the waste was disposed of.' },
        { t: 'No ethical or environmental issues.', why: 'Say __why__ there are none, and how the waste was disposed of.' },
        { t: 'The leftover beetroot was thrown into a stream near the school.', why: 'That is not safe disposal. Compost it, or put it in the bin.' }
      ] }
  ];

  var CSS = [
    '.wd-risk-builder{display:grid;gap:14px;min-width:0}',
    '.wd-risk-builder__pick{display:grid;gap:10px}',
    '.wd-risk-builder__seg{display:flex;flex-wrap:wrap;gap:8px}',
    '.wd-risk-builder__segb{appearance:none;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink);border-radius:var(--r);padding:8px 13px;min-height:42px;cursor:pointer;font:600 .9rem/1.25 var(--sans);text-align:left}',
    '.wd-risk-builder__segb[aria-pressed="true"]{background:var(--lvl-wash);border-color:var(--lvl);color:var(--lvl);box-shadow:inset 0 -2px 0 var(--lvl)}',
    '.wd-risk-builder__segb:focus-visible,.wd-risk-builder__opt:focus-visible,.wd-risk-builder__hz:focus-visible{outline:2px solid var(--lvl);outline-offset:2px}',
    '.wd-risk-builder__blurb{font-size:.95rem;color:var(--ink-2);line-height:1.5}',
    '.wd-risk-builder__stage{display:grid;gap:12px}',
    '.wd-risk-builder__h{font:600 1.08rem/1.3 var(--serif);display:flex;gap:10px;align-items:baseline}',
    '.wd-risk-builder__n{font:700 .72rem/1 var(--mono);color:#fff;background:var(--lvl);border-radius:50%;width:22px;height:22px;display:inline-grid;place-items:center;flex:none;transform:translateY(-2px)}',
    '.wd-risk-builder__hzs{display:flex;flex-wrap:wrap;gap:8px}',
    '.wd-risk-builder__hz{appearance:none;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink);border-radius:999px;padding:8px 14px;min-height:42px;cursor:pointer;font:inherit;font-size:.95rem;line-height:1.3;text-align:left}',
    '.wd-risk-builder__hz[aria-pressed="true"]{border-color:var(--lvl);background:var(--lvl-wash);box-shadow:0 0 0 1px var(--lvl)}',
    '.wd-risk-builder__hz.is-ok{border-color:var(--green);background:var(--green-wash);box-shadow:none}',
    '.wd-risk-builder__hz.is-no{border-color:var(--red);background:var(--red-wash);box-shadow:none}',
    '.wd-risk-builder__hz.is-miss{border-style:dashed;border-color:var(--red)}',
    '.wd-risk-builder__list{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-size:.93rem;line-height:1.45}',
    '.wd-risk-builder__list li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:6px}',
    '.wd-risk-builder__list .ok{color:var(--green);font-weight:700}.wd-risk-builder__list .no{color:var(--red);font-weight:700}',
    '.wd-risk-builder__cards{display:grid;gap:12px}',
    '.wd-risk-builder__card{border:1px solid var(--edge);border-left:4px solid var(--lvl);border-radius:var(--r);background:var(--sheet);padding:12px 14px 14px;display:grid;gap:10px;min-width:0}',
    '.wd-risk-builder__card.is-done{border-left-color:var(--green)}',
    '.wd-risk-builder__ch{font:600 1.02rem/1.3 var(--sans)}',
    '.wd-risk-builder__risk{font-size:.9rem;color:var(--ink-2)}',
    '.wd-risk-builder__q{display:grid;gap:7px}',
    '.wd-risk-builder__opts{display:grid;gap:6px}',
    '.wd-risk-builder__opt{appearance:none;display:block;width:100%;text-align:left;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink);border-radius:var(--r);padding:9px 12px;min-height:42px;cursor:pointer;font:inherit;font-size:.94rem;line-height:1.4}',
    '.wd-risk-builder__opt:hover:not(:disabled){border-color:var(--ink-3)}',
    '.wd-risk-builder__opt.is-ok{border-color:var(--green);background:var(--green-wash)}',
    '.wd-risk-builder__opt.is-no{border-color:var(--red);background:var(--red-wash)}',
    '.wd-risk-builder__opt:disabled{cursor:default;opacity:.5}',
    '.wd-risk-builder__opt.is-ok:disabled{opacity:1}',
    '.wd-risk-builder__legend{font-size:.9rem;color:var(--ink-2)}',
    '.wd-risk-builder__foot{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    'table.dt.wd-risk-builder__t{font:400 .88rem/1.4 var(--sans)}',
    'table.dt.wd-risk-builder__t td{text-align:left;vertical-align:top}',
    'table.dt.wd-risk-builder__t td.wd-risk-builder__eth{background:var(--sheet-2)}',
    /* on a phone, each row of the finished table becomes a labelled card, so nothing scrolls sideways */
    '@media (max-width:560px){table.dt.wd-risk-builder__t thead{display:none}',
    'table.dt.wd-risk-builder__t,table.dt.wd-risk-builder__t tbody,table.dt.wd-risk-builder__t tr,table.dt.wd-risk-builder__t td{display:block;width:100%}',
    'table.dt.wd-risk-builder__t caption{display:block}',
    'table.dt.wd-risk-builder__t tr{border:1.2px solid var(--ink);border-radius:var(--r);margin-bottom:8px;overflow:hidden}',
    'table.dt.wd-risk-builder__t td{border:0;border-bottom:1px solid var(--rule);padding:7px 10px}',
    'table.dt.wd-risk-builder__t td:last-child{border-bottom:0}',
    'table.dt.wd-risk-builder__t td::before{content:attr(data-label);display:block;font:650 .64rem/1.3 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:2px}',
    'table.dt.wd-risk-builder__t td:first-child:not(.wd-risk-builder__eth){font-weight:600;background:var(--sheet-2)}',
    'table.dt.wd-risk-builder__t td.wd-risk-builder__eth::before{content:none}}'
  ].join('\n');

  WUL.widget('risk-builder', function (host, opts) {
    opts = opts || {};
    WUL.css('risk-builder', CSS);
    var L = WUL.level(), IB = L !== 'g';
    var pi = opts.prac != null ? opts.prac % PRACS.length : ((+WUL.store.get('risk-builder.prac', 0) || 0) % PRACS.length);
    var tissue = 'liver';
    var root = h('div', { class: 'wd-risk-builder' });
    host.appendChild(root);

    function P() { return PRACS[pi]; }
    function itemsHere() {
      var list = P().items.filter(function (it) { return WUL.shows(it.lv, L) && (!it.only || it.only === tissue); });
      if (!S.mix) S.mix = WUL.shuffle(P().items.map(function (it) { return it.id; }));   /* one shuffle per attempt */
      return list.slice().sort(function (a, b) { return S.mix.indexOf(a.id) - S.mix.indexOf(b.id); });
    }
    function realHere() {
      var list = P().items.filter(function (it) { return it.real && WUL.shows(it.lv, L) && (!it.only || it.only === tissue); });
      return list;                                                                        /* table order: as written */
    }
    function ethHere() { var e = P().eth; return Array.isArray(e) ? e : e[tissue]; }
    function ctrlWord() { return IB ? 'Control measure' : 'Precaution'; }

    var S;   /* state for the current practical */
    function fresh() { S = { sel: {}, tries: 0, stage: 1, got: {}, eth: null }; }

    function draw() {
      root.innerHTML = '';

      /* choose a practical */
      var pick = h('div', { class: 'wd-risk-builder__pick' });
      pick.appendChild(h('div', { class: 'wd-k', text: 'Choose a practical' }));
      var seg = h('div', { class: 'wd-risk-builder__seg', role: 'group', 'aria-label': 'Practical' });
      PRACS.forEach(function (p, k) {
        var b = h('button', { type: 'button', class: 'wd-risk-builder__segb', 'aria-pressed': k === pi ? 'true' : 'false', text: p.name });
        b.addEventListener('click', function () { if (k === pi) return; pi = k; WUL.store.set('risk-builder.prac', pi); fresh(); draw(); focusSeg(); });
        seg.appendChild(b);
      });
      pick.appendChild(seg);
      if (P().tissues) {
        var tseg = h('div', { class: 'wd-risk-builder__seg', role: 'group', 'aria-label': 'Tissue' });
        tseg.appendChild(h('span', { class: 'wd-k', style: 'align-self:center', text: 'Tissue' }));
        P().tissues.forEach(function (t) {
          var b = h('button', { type: 'button', class: 'wd-risk-builder__segb', 'aria-pressed': t === tissue ? 'true' : 'false', text: t.charAt(0).toUpperCase() + t.slice(1) });
          b.addEventListener('click', function () { if (t === tissue) return; tissue = t; fresh(); draw(); });
          tseg.appendChild(b);
        });
        pick.appendChild(tseg);
      }
      pick.appendChild(h('p', { class: 'wd-risk-builder__blurb', html: md(P().blurb, { inline: true }) }));
      root.appendChild(pick);

      root.appendChild(stage1());
      if (S.stage >= 2) root.appendChild(stage2());
      if (S.stage >= 3 && IB) root.appendChild(stage3());
      if (S.stage >= 4) root.appendChild(stage4());
    }
    function focusSeg() { var b = root.querySelector('.wd-risk-builder__segb[aria-pressed="true"]'); if (b) b.focus(); }
    function heading(n, t) { return h('div', { class: 'wd-risk-builder__h', html: '<span class="wd-risk-builder__n" aria-hidden="true">' + n + '</span><span>' + esc(t) + '</span>' }); }

    /* ---- 1. find the real hazards ---- */
    function stage1() {
      var box = h('section', { class: 'wd-panel wd-risk-builder__stage', 'aria-label': 'Step 1: find the hazards' });
      box.appendChild(heading(1, 'Tap every real hazard in this method.'));
      var row = h('div', { class: 'wd-risk-builder__hzs' });
      var items = itemsHere(), done = S.stage >= 2;
      items.forEach(function (it) {
        var on = !!S.sel[it.id];
        var cls = 'wd-risk-builder__hz';
        if (S.checked || done) {
          if (on && it.real) cls += ' is-ok';
          else if (on && !it.real) cls += ' is-no';
        }
        if (S.shown && !on && it.real) cls += ' is-miss';
        var b = h('button', { type: 'button', class: cls, 'aria-pressed': on ? 'true' : 'false', 'data-id': it.id, text: it.t, disabled: done });
        b.addEventListener('click', function () { S.sel[it.id] = !S.sel[it.id]; S.checked = false; draw(); var nb = root.querySelector('.wd-risk-builder__hz[data-id="' + it.id + '"]'); if (nb) nb.focus(); });
        row.appendChild(b);
      });
      box.appendChild(row);
      var fb = h('div', { 'aria-live': 'polite' });
      box.appendChild(fb);
      var foot = h('div', { class: 'wd-risk-builder__foot' });
      box.appendChild(foot);

      if (S.checked || done) {
        var right = items.every(function (it) { return !!S.sel[it.id] === !!it.real; });
        var ul = h('ul', { class: 'wd-risk-builder__list' });
        var missing = items.filter(function (it) { return it.real && !S.sel[it.id]; }).length;
        items.forEach(function (it) {
          var on = !!S.sel[it.id];
          if (!on && !it.real) return;
          if (!on && it.real && !S.shown) return;          /* missed ones stay unnamed until "Show me" */
          var ok = on === !!it.real;
          var lead = it.real ? (on ? '' : 'Missed: ') : 'Not a hazard: ';
          ul.appendChild(h('li', { html: '<span class="' + (ok ? 'ok' : 'no') + '" aria-hidden="true">' + (ok ? '✔' : '✘') + '</span><span><b>' + esc(lead + it.t) + '.</b> ' + md(it.why, { inline: true }) + '</span>' }));
        });
        fb.appendChild(h('div', { class: 'fb ' + (right ? 'fb--ok' : 'fb--no'), html: '<span class="fb__k">' + (right ? '✔ All ' + realHere().length + ' hazards found.' : '✘ Not yet.') + '</span> ' + (right ? '' : 'Your choices are kept.' + (missing ? ' ' + missing + ' real hazard' + (missing === 1 ? ' is' : 's are') + ' still missing.' : '') + (items.some(function (it) { return S.sel[it.id] && !it.real; }) ? ' Untap the ones marked in red.' : '')) }));
        fb.appendChild(ul);
        if (right && !done) {
          var nx = h('button', { type: 'button', class: 'btn btn--go', text: 'Next: match each hazard →' });
          nx.addEventListener('click', function () { S.stage = 2; draw(); var c = root.querySelector('.wd-risk-builder__card .wd-risk-builder__opt'); if (c) c.focus(); });
          foot.appendChild(nx);
        }
      }
      if (!done && !(S.checked && items.every(function (it) { return !!S.sel[it.id] === !!it.real; }))) {
        var chk = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
        chk.addEventListener('click', function () {
          if (!items.some(function (it) { return S.sel[it.id]; })) { fb.innerHTML = ''; fb.appendChild(h('div', { class: 'fb fb--no', html: '<span class="fb__k">✘</span> Tap at least one hazard first.' })); return; }
          S.tries++; S.checked = true; draw();
          var nb = root.querySelector('.wd-risk-builder__stage .btn--go'); if (nb) nb.focus();
        });
        foot.appendChild(chk);
        if (S.tries >= 2) {
          var show = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Show me' });
          show.addEventListener('click', function () { S.shown = true; S.checked = true; draw(); });
          foot.appendChild(show);
        }
      }
      return box;
    }

    /* ---- 2. match each hazard ---- */
    function question(key, label, opts2, it) {
      var q = h('div', { class: 'wd-risk-builder__q' });
      q.appendChild(h('div', { class: 'wd-k', text: label }));
      var list = h('div', { class: 'wd-risk-builder__opts', role: 'group', 'aria-label': label + ' for ' + it.t });
      var why = h('div', { 'aria-live': 'polite' });
      var st = S.got[it.id + '.' + key];
      var order = S['ord.' + it.id + '.' + key] || (S['ord.' + it.id + '.' + key] = WUL.shuffle(opts2.map(function (o, i) { return i; })));
      order.forEach(function (i) {
        var o = opts2[i];
        var cls = 'wd-risk-builder__opt' + (st && st.last === i ? (o.ok ? ' is-ok' : ' is-no') : '') + (st && st.ok && o.ok ? ' is-ok' : '');
        var b = h('button', { type: 'button', class: cls, 'data-i': String(i), disabled: !!(st && st.ok && !o.ok), html: md(o.t, { inline: true }) });
        b.addEventListener('click', function () {
          var cur = S.got[it.id + '.' + key] || {};
          if (cur.ok) return;
          S.got[it.id + '.' + key] = { last: i, ok: !!o.ok };
          draw();
          var nb = root.querySelector('.wd-risk-builder__card[data-id="' + it.id + '"] .wd-risk-builder__opts[data-k="' + key + '"] [data-i="' + i + '"]');
          if (nb) nb.focus();
        });
        list.appendChild(b);
      });
      list.setAttribute('data-k', key);
      q.appendChild(list);
      if (st) why.appendChild(h('div', { class: 'fb ' + (st.ok ? 'fb--ok' : 'fb--no'), html: '<span class="fb__k">' + (st.ok ? '✔ Matches.' : '✘ Not this one.') + '</span> ' + md(opts2[st.last].why, { inline: true }) }));
      q.appendChild(why);
      return q;
    }
    function cardDone(it) { return S.got[it.id + '.ctrl'] && S.got[it.id + '.ctrl'].ok && (!IB || (S.got[it.id + '.em'] && S.got[it.id + '.em'].ok)); }
    function stage2() {
      var box = h('section', { class: 'wd-panel wd-risk-builder__stage', 'aria-label': 'Step 2: match each hazard' });
      box.appendChild(heading(2, IB ? 'For each hazard, choose its control measure and its emergency action.' : 'For each hazard, choose the precaution that matches it.'));
      if (IB) box.appendChild(h('p', { class: 'wd-risk-builder__legend', html: md('A [[control measure]] reduces the risk before harm. An [[emergency action]] is what to do if harm happens.', { inline: true }) }));
      var cards = h('div', { class: 'wd-risk-builder__cards' });
      realHere().forEach(function (it) {
        var c = h('div', { class: 'wd-risk-builder__card' + (cardDone(it) ? ' is-done' : ''), 'data-id': it.id });
        c.appendChild(h('div', { class: 'wd-risk-builder__ch', text: it.t }));
        c.appendChild(h('div', { class: 'wd-risk-builder__risk', html: '<b>Risk:</b> ' + md(WUL.pick(it.risk, L), { inline: true }) }));
        c.appendChild(question('ctrl', ctrlWord(), it.ctrl, it));
        if (IB) c.appendChild(question('em', 'Emergency action', it.em, it));
        cards.appendChild(c);
      });
      box.appendChild(cards);
      var all = realHere().every(cardDone);
      var foot = h('div', { class: 'wd-risk-builder__foot' });
      if (all && S.stage === 2) {
        var nx = h('button', { type: 'button', class: 'btn btn--go', text: IB ? 'Next: ethics and environment →' : 'Show my risk assessment →' });
        nx.addEventListener('click', function () { S.stage = IB ? 3 : 4; draw(); var t = root.querySelector(IB ? '.wd-risk-builder__stage:last-child .wd-risk-builder__opt' : '.wd-risk-builder__stage:last-child .btn'); if (t) t.focus(); });
        foot.appendChild(nx);
      } else if (!all) {
        var left = realHere().filter(function (it) { return !cardDone(it); }).length;
        foot.appendChild(h('span', { class: 'wd-out', text: left + ' of ' + realHere().length + ' hazards still to match.' }));
      }
      box.appendChild(foot);
      return box;
    }

    /* ---- 3. ethics and environment (IB) ---- */
    function stage3() {
      var box = h('section', { class: 'wd-panel wd-risk-builder__stage', 'aria-label': 'Step 3: ethics and environment' });
      box.appendChild(heading(3, 'Choose the ethics and environment statement for this practical.'));
      var fake = { id: 'eth', t: 'this practical' };
      box.appendChild(question('eth', 'Ethics and environment', ethHere(), fake));
      var st = S.got['eth.eth'];
      if (st && st.ok && S.stage === 3) {
        var foot = h('div', { class: 'wd-risk-builder__foot' });
        var nx = h('button', { type: 'button', class: 'btn btn--go', text: 'Show my risk assessment →' });
        nx.addEventListener('click', function () { S.stage = 4; draw(); var t = root.querySelector('.wd-risk-builder__stage:last-child .btn'); if (t) t.focus(); });
        foot.appendChild(nx);
        box.appendChild(foot);
      }
      return box;
    }

    /* ---- 4. the finished table ---- */
    function okOf(opts2) { return opts2.filter(function (o) { return o.ok; })[0]; }
    function stage4() {
      var box = h('section', { class: 'wd-panel wd-risk-builder__stage', 'aria-label': 'Your risk assessment' });
      box.appendChild(heading(IB ? 4 : 3, 'Your risk assessment'));
      var inv = P().inv + (P().tissues ? tissue : '');
      var spec = {
        caption: 'Table 1. Risk assessment for the investigation of ' + inv + '.',
        cls: 'wd-risk-builder__t',
        head: [IB ? ['Hazard', 'Risk', 'Control measure', 'Emergency action'] : ['Hazard', 'Risk', 'Precaution']],
        rows: realHere().map(function (it) {
          var r = [it.t, WUL.pick(it.risk, L), okOf(it.ctrl).t];
          if (IB) r.push(okOf(it.em).t);
          return r;
        }),
        note: IB ? 'Check each chemical and organism against its CLEAPSS Hazcard: the school’s standard.' : 'A table is good practice. In an exam plan, one hazard with the precaution that matches it earns the mark.'
      };
      if (IB) spec.rows.push([{ t: '__Ethics and environment.__ ' + okOf(ethHere()).t, cs: 4, cls: 'wd-risk-builder__eth' }]);
      var sheet = h('div', { class: 'sheet sheet--vis', html: WUL.table(spec) });
      sheet.querySelectorAll('tbody tr').forEach(function (tr) {       /* labels for the phone layout */
        Array.prototype.forEach.call(tr.children, function (td, k) { if (spec.head[0][k] && !td.hasAttribute('colspan')) td.setAttribute('data-label', spec.head[0][k]); });
      });
      box.appendChild(sheet);
      var foot = h('div', { class: 'wd-risk-builder__foot' });
      var again = h('button', { type: 'button', class: 'btn btn--go', text: 'Try another practical ↻' });
      again.addEventListener('click', function () { pi = (pi + 1) % PRACS.length; WUL.store.set('risk-builder.prac', pi); fresh(); draw(); focusSeg(); });
      var redo = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start this one again' });
      redo.addEventListener('click', function () { fresh(); draw(); focusSeg(); });
      foot.appendChild(again); foot.appendChild(redo);
      box.appendChild(foot);
      return box;
    }

    fresh();
    draw();
  });

  (WUL.tool || function (t) { (WUL.TOOLS = WUL.TOOLS || []).push(t); return t; })({
    name: 'risk-builder', title: 'Risk builder',
    blurb: 'Find the real hazards in a practical. Then match each one with what reduces its risk.',
    station: 'safety', lv: 'gie', icon: '⚠'
  });
})(window.WUL);
