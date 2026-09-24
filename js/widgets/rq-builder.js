/* ============================================================
   widget: rq-builder — "Build a research question".
   Builds an aim or question from option buttons in slots:
   question word · independent variable · range · dependent
   variable · system · (IB) a context sentence. A live checklist marks
   each part as it appears, and every choice explains itself.
   Level-aware: the system must be named exactly at IB; at EE the
   stem must make it a question. Three experiments, "Try another".
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;

  /* ---------- the content ----------
     ok: the levels at which the option is strong ('' = weak everywhere).
     why: a string, or {g,i,e} (WUL.pick gives the nearest lower level). */
  var STEMS = [
    { t: 'How does', mid: 'affect', end: '?', ok: 'gie', why: 'A clear, open question. The answer will describe the pattern.' },
    { t: 'What is the effect of', mid: 'on', end: '?', ok: 'gie', why: 'A clear, open question.' },
    { t: 'To what extent does', mid: 'affect', end: '?', ok: 'gie', why: { g: 'A question that asks how much. It is common in the Extended Essay.', e: 'It asks how much. So your answer is a careful judgement, not yes or no.' } },
    { t: 'Does', mid: 'affect', end: '?', ok: '', why: { g: 'A yes-or-no question. Ask “how” instead, so that the answer describes the pattern.', e: 'A yes-or-no question with an obvious answer. An EE question must be worth 4,000 words.' } },
    { t: 'To investigate the effect of', mid: 'on', end: '.', ok: 'g', why: { g: 'An aim, not a question. At IGCSE an aim is fine.', i: 'This is an aim. The IA asks for a research __question__, so write it as a question.', e: 'A statement. The EE guide says the research question must be a question, not a statement or a hypothesis.' } },
    { t: '', mid: 'affects', end: '.', label: '… affects …', ok: '', why: 'A claim, not a question: it gives the answer before you investigate. That is a hypothesis.' }
  ];
  var NO_RANGE = { t: '', none: true, label: 'no range', why: 'Without a range, the reader of your report cannot tell which values were tested.' };
  var NO_CTX = { t: '', none: true, soft: true, label: 'no context sentence yet', why: 'The question itself does not need it. But your report must give the context in the sentences straight after it.' };

  var EXPS = [
    { name: 'Amylase and temperature',
      blurb: 'Starch and amylase are mixed at different temperatures. Every 10 s, a drop is tested with iodine solution.',
      iv: [
        { t: 'temperature', ok: 'gie', why: 'The quantity that is changed on purpose, named exactly.' },
        { t: 'heat', why: 'Heat is energy, not a value you set. Name the quantity: __temperature__.' },
        { t: 'the water bath', why: 'That is apparatus, not a variable. Name what it changes: __temperature__.' }
      ],
      range: [
        { t: ', from 20 °C to 60 °C in 10 °C steps,', ok: 'gie', why: 'Five values, evenly spaced, that span the expected optimum.' },
        { t: '(20.0–60.0 °C)', ok: 'gie', why: 'The range, short and precise.' },
        { t: 'at different values', why: 'Which values? Give the range: 20 °C to 60 °C.' },
        NO_RANGE
      ],
      dv: [
        { t: 'the time, in seconds, for iodine to stop turning blue-black', ok: 'gie', why: 'A measurement, with its unit and the end point that is judged.' },
        { t: 'how fast it works', why: 'Not a measurement. What is measured, and in what unit? For example, the time in seconds for iodine to stop turning blue-black.' },
        { t: 'the colour of the iodine', why: 'A colour is an observation, not a number. Time how long the blue-black colour takes to stop appearing.' }
      ],
      sys: [
        { t: ', when starch is digested by fungal α-amylase from *Aspergillus oryzae*', ok: 'gie', why: 'The exact system: the enzyme, its substrate, and the organism the enzyme came from.' },
        { t: ', when starch is digested by amylase', ok: 'g', why: { g: 'The enzyme and its substrate are named. That is enough at IGCSE.', i: '__Which amylase?__ Amylases from different organisms have different optimum temperatures. Name the source.' } },
        { t: ', when starch is digested by enzymes', why: 'Which enzyme? Name it.' }
      ],
      ctx: [
        NO_CTX,
        { t: 'Amylases from different organisms have different optimum temperatures, and this enzyme is used in baking.', ok: 'ie', why: 'Background theory of direct relevance: it explains why the source of the enzyme matters.' },
        { t: 'Enzymes are very interesting and important.', why: 'An opinion, not background theory. Give the science that the question depends on.' }
      ] },

    { name: 'Pondweed and light',
      blurb: 'A lamp is placed at different distances from a pondweed shoot. The gas released is collected and measured.',
      iv: [
        { t: 'light intensity', ok: 'gie', why: 'The property of light that is changed, named exactly.' },
        { t: 'light', why: 'Which property of light: its intensity, its colour, or how long it is on? Name it: __light intensity__.' },
        { t: 'the lamp', why: 'That is apparatus. Name what moving it changes: __light intensity__.' }
      ],
      range: [
        { t: '(lamp 10, 20, 30, 40 and 50 cm away)', ok: 'gie', why: 'Five distances, evenly spaced. Each distance gives a different light intensity.' },
        { t: '(near and far)', why: 'How near, and how far? Give the distances in cm.' },
        NO_RANGE
      ],
      dv: [
        { t: 'the volume of gas, in cm³, released in 5 minutes', ok: 'gie', why: 'A measurement, with its unit and a fixed time.' },
        { t: 'the number of bubbles released per minute', ok: 'g', why: { g: 'A count in a fixed time. It is accepted at IGCSE.', i: 'Weaker at IB: bubbles differ in size, so a count is less precise than a volume of gas collected.' } },
        { t: 'photosynthesis', why: 'A process, not a measurement. What is measured, and in what unit?' }
      ],
      sys: [
        { t: 'by a 10 cm shoot of *Elodea canadensis*', ok: 'gie', why: 'The species, and the size of the sample, are named.' },
        { t: 'by pondweed', ok: 'g', why: { g: 'The organism is named. That is enough at IGCSE.', i: 'Which species? Pondweeds differ. Name it, and the size of the shoot: a 10 cm shoot of *Elodea canadensis*.' } },
        { t: 'by plants', why: 'Which plant? Name the organism.' }
      ],
      ctx: [
        NO_CTX,
        { t: 'Light intensity is a limiting factor: at low intensities, the rate of photosynthesis depends on it.', ok: 'ie', why: 'Background theory of direct relevance: the idea of a limiting factor.' },
        { t: 'Plants are important for the planet.', why: 'True, but it is not the theory this question depends on.' }
      ] },

    { name: 'Potato and osmosis',
      blurb: 'Potato cylinders are left in sucrose solutions of different concentrations for 60 minutes, then weighed again.',
      iv: [
        { t: 'the concentration of sucrose solution', ok: 'gie', why: 'The property that is changed, named exactly.' },
        { t: 'the amount of sugar', why: '“Amount” is not a property. Name it: the __concentration__ of sucrose solution.' },
        { t: 'sugar', why: 'Which property of sugar? Name the quantity: the __concentration__ of sucrose solution.' }
      ],
      range: [
        { t: '(0.0–1.0 mol dm⁻³)', ok: 'gie', why: 'The range, with its unit: from pure water to a concentrated solution.' },
        { t: '(weak to strong)', why: '“Weak” and “strong” are not values. Give the concentrations in mol dm⁻³.' },
        NO_RANGE
      ],
      dv: [
        { t: 'the percentage change in mass, after 60 minutes,', ok: 'gie', why: 'A percentage compares the cylinders fairly, because their starting masses differ.' },
        { t: 'the change in mass, in g, after 60 minutes,', ok: 'g', why: { g: 'A measurement with its unit: accepted at IGCSE. A percentage change is better, because the starting masses differ.', i: 'The cylinders start with different masses, so a change in grams does not compare them fairly. Use the __percentage__ change in mass.' } },
        { t: 'the size', why: 'Which measurement: mass, length or volume? And in what unit?' }
      ],
      sys: [
        { t: 'of cylinders cut from one potato tuber (*Solanum tuberosum*)', ok: 'gie', why: 'The organism and the tissue, from one tuber, so that the cells start alike.' },
        { t: 'of potato', ok: 'g', why: { g: 'The organism is named. That is enough at IGCSE.', i: 'Describe the system: which tissue, from which plant? For example, cylinders cut from one potato tuber (*Solanum tuberosum*).' } },
        { t: 'of vegetables', why: 'Which vegetable? Name the organism.' }
      ],
      ctx: [
        NO_CTX,
        { t: 'Water moves by osmosis. The concentration that causes no change in mass has the same solute concentration as the potato cells.', ok: 'ie', why: 'Background theory of direct relevance: it says what the result will reveal about the cells.' },
        { t: 'Potatoes are a popular food.', why: 'True, but it is not the theory this question depends on.' }
      ] }
  ];

  /* the slots; p = the anatomy colour used for that part everywhere on the site */
  var SLOTS = [
    { k: 'stem', name: 'Question word', p: 6, gap: 'question word' },
    { k: 'iv', name: 'Independent variable', p: 1, gap: 'independent variable' },
    { k: 'range', name: 'Its range', p: 2, gap: 'range' },
    { k: 'dv', name: 'Dependent variable', p: 3, gap: 'dependent variable' },
    { k: 'sys', name: 'System', p: 4, gap: 'system' },
    { k: 'ctx', name: 'Context: the next sentence', p: 5, gap: 'context', lv: 'ie' }
  ];

  function checklist(L) {
    return [
      { k: 'stem', t: L === 'g' ? 'An aim, or a question' : (L === 'e' ? 'Written as a question (the EE guide requires it)' : 'Written as a question') },
      { k: 'iv', t: 'The independent variable, named as a quantity' },
      { k: 'range', t: 'Its range' },
      { k: 'dv', t: 'The dependent variable, with its unit or how it is measured' },
      { k: 'sys', t: L === 'g' ? 'The system: the organism or enzyme' : 'The system, named exactly (the IB asks for it)' },
      L !== 'g' ? { k: 'ctx', t: 'Context: the background theory it depends on', soft: true } : null
    ].filter(Boolean);
  }

  var CSS = [
    '.wd-rq-builder{display:grid;gap:12px;min-width:0}',
    '.wd-rq-builder__head{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;justify-content:space-between}',
    '.wd-rq-builder__exp{display:grid;gap:4px;min-width:0;flex:1 1 260px}',
    '.wd-rq-builder__name{font:600 1.15rem/1.3 var(--serif)}',
    '.wd-rq-builder__blurb{font-size:.93rem;color:var(--ink-2);line-height:1.45}',
    '.wd-rq-builder__grid{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;align-items:start}',
    '.wd-rq-builder__side{display:grid;gap:12px;min-width:0}',
    '@media (min-width:1000px){.wd-rq-builder__grid{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}.wd-rq-builder__side{order:2;position:sticky;top:88px}}',
    '.wd-rq-builder__sheet{padding:14px 16px 16px;border-top:4px solid var(--lvl)}',
    '.wd-rq-builder__q{margin:6px 0 0;font:400 1.12rem/1.8 var(--serif);font-variation-settings:"opsz" 14;overflow-wrap:break-word}',
    '.wd-rq-builder__ctx{margin:8px 0 0;font:400 1rem/1.7 var(--serif);color:var(--ink-2);overflow-wrap:break-word}',
    '.wd-rq-builder__f{border-radius:3px;padding:1px 2px;-webkit-box-decoration-break:clone;box-decoration-break:clone}',
    '.wd-rq-builder__f--1{background:var(--p1)}.wd-rq-builder__f--2{background:var(--p2)}.wd-rq-builder__f--3{background:var(--p3)}',
    '.wd-rq-builder__f--4{background:var(--p4)}.wd-rq-builder__f--5{background:var(--p5)}.wd-rq-builder__f--6{background:var(--p6)}',
    '.wd-rq-builder__f.is-weak{text-decoration:underline wavy var(--red);text-decoration-thickness:1.3px;text-underline-offset:5px}',
    '.wd-rq-builder__gap{display:inline-block;min-width:4em;border-bottom:1.5px dashed var(--ink-3);color:var(--ink-3);font:500 .7rem/1.3 var(--mono);letter-spacing:.04em;text-transform:uppercase;vertical-align:2px;padding:0 3px}',
    '.wd-rq-builder__ck{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:7px}',
    '.wd-rq-builder__ck li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;align-items:start;font-size:.93rem;line-height:1.4;color:var(--ink-3)}',
    '.wd-rq-builder__ci{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font:700 .76rem/1 var(--sans);border:1.5px solid var(--rule);background:var(--sheet);color:#fff}',
    '.wd-rq-builder__ck li.is-ok,.wd-rq-builder__ck li.is-no{color:var(--ink)}',
    '.wd-rq-builder__ck li.is-ok .wd-rq-builder__ci{background:var(--green);border-color:var(--green)}',
    '.wd-rq-builder__ck li.is-no .wd-rq-builder__ci{background:var(--red);border-color:var(--red)}',
    '.wd-rq-builder__ck li.is-soft .wd-rq-builder__ci{border-style:dashed}',
    '.wd-rq-builder__tag{font:600 .62rem/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3);border:1px solid var(--rule);border-radius:2px;padding:2px 4px;margin-left:4px;white-space:nowrap}',
    '.wd-rq-builder__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.wd-rq-builder__slots{display:grid;gap:10px;min-width:0}',
    '.wd-rq-builder__slot{border:1px solid var(--edge);border-radius:var(--r);background:var(--sheet);padding:12px 14px 14px;min-width:0}',
    '.wd-rq-builder__sh{display:flex;align-items:center;gap:8px;margin-bottom:10px;font:650 .72rem/1.2 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}',
    '.wd-rq-builder__sw{width:14px;height:14px;border-radius:3px;flex:none}',
    '.wd-rq-builder__ib{font:700 .6rem/1 var(--mono);color:var(--blue);background:var(--blue-wash);padding:3px 5px;border-radius:2px}',
    '.wd-rq-builder__opts{display:flex;flex-wrap:wrap;gap:8px}',
    '.wd-rq-builder__opt{appearance:none;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink);border-radius:999px;padding:7px 14px;min-height:40px;cursor:pointer;font:inherit;font-size:.94rem;line-height:1.35;text-align:left;max-width:100%}',
    '.wd-rq-builder__opt:hover{border-color:var(--ink-3)}',
    '.wd-rq-builder__opt:focus-visible{outline:2px solid var(--lvl);outline-offset:2px}',
    '.wd-rq-builder__opt--none{font-style:italic;color:var(--ink-2)}',
    '.wd-rq-builder__opt[aria-pressed="true"]{border-color:var(--lvl);box-shadow:0 0 0 1px var(--lvl)}',
    '.wd-rq-builder__opt.is-ok{border-color:var(--green);background:var(--green-wash);box-shadow:0 0 0 1px var(--green)}',
    '.wd-rq-builder__opt.is-no{border-color:var(--red);background:var(--red-wash);box-shadow:0 0 0 1px var(--red)}',
    '.wd-rq-builder__why{margin-top:10px}',
    '.wd-rq-builder__why:empty{display:none}',
    '.wd-rq-builder__soft{background:var(--sheet-2);border:1px dashed var(--rule)}',
    '.wd-rq-builder__btns{display:flex;flex-wrap:wrap;gap:8px}',
    '.wd-rq-builder__done .wd-out{margin-top:6px}'
  ].join('\n');

  function okAt(o, L) { return !!o && !o.soft && !!o.ok && o.ok.indexOf(L) >= 0; }
  function whyOf(o, L) { return WUL.pick(o.why, L) || ''; }
  function labelOf(o, k) {
    if (o.label) return o.label;
    if (k === 'stem') return o.t + ' … ' + o.mid + ' …' + (o.end === '?' ? '?' : '');
    return o.t.replace(/^,\s*/, '').replace(/,$/, '');
  }
  function cap(html) { return html.replace(/^([a-zα-ω])/, function (c) { return c.toUpperCase(); }); }

  WUL.widget('rq-builder', function (host, opts) {
    opts = opts || {};
    WUL.css('rq-builder', CSS);
    var L = WUL.level();
    var ei = opts.exp != null ? opts.exp % EXPS.length : ((+WUL.store.get('rq-builder.exp', 0) || 0) % EXPS.length);
    var slots = SLOTS.filter(function (s) { return WUL.shows(s.lv, L); });
    var pick = {}, els = {};
    var root = h('div', { class: 'wd-rq-builder' });
    host.appendChild(root);

    function list(k) { return k === 'stem' ? STEMS : EXPS[ei][k]; }
    function chosen(k) { var i = pick[k]; return i == null ? null : list(k)[i]; }
    function state(k) {
      var o = chosen(k);
      if (!o) return 'none';
      if (o.soft) return 'soft';
      return okAt(o, L) ? 'ok' : 'no';
    }

    function build() {
      root.innerHTML = '';
      var exp = EXPS[ei];
      pick = {}; els = { slot: {} };

      var head = h('div', { class: 'wd-rq-builder__head' });
      head.appendChild(h('div', { class: 'wd-rq-builder__exp', html: '<span class="wd-k">Experiment ' + (ei + 1) + ' of ' + EXPS.length + '</span><span class="wd-rq-builder__name">' + esc(exp.name) + '</span><span class="wd-rq-builder__blurb">' + md(exp.blurb, { inline: true }) + '</span>' }));
      var another = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Try another experiment ↻' });
      another.addEventListener('click', function () {
        ei = (ei + 1) % EXPS.length; WUL.store.set('rq-builder.exp', ei);
        build(); if (els.another) els.another.focus();
      });
      els.another = another;
      head.appendChild(another);
      root.appendChild(head);
      root.appendChild(h('p', { class: 'hint', text: 'Tap one option in each box. The checklist marks each part as you add it. Each choice tells you why it is strong or weak.' }));

      var grid = h('div', { class: 'wd-rq-builder__grid' });

      /* the question as it grows, the checklist, the verdict */
      var side = h('div', { class: 'wd-rq-builder__side' });
      var sheet = h('div', { class: 'sheet wd-rq-builder__sheet' });
      sheet.appendChild(h('div', { class: 'wd-k', text: L === 'g' ? 'Your aim or question' : 'Your research question' }));
      els.q = h('p', { class: 'wd-rq-builder__q' });
      sheet.appendChild(els.q);
      if (L !== 'g') { els.ctx = h('p', { class: 'wd-rq-builder__ctx' }); sheet.appendChild(els.ctx); }
      side.appendChild(sheet);
      var ckp = h('div', { class: 'wd-panel' });
      ckp.appendChild(h('div', { class: 'wd-k', text: 'Checklist' }));
      els.ck = h('ul', { class: 'wd-rq-builder__ck' });
      ckp.appendChild(els.ck);
      side.appendChild(ckp);
      els.done = h('div', { class: 'wd-rq-builder__done', 'aria-live': 'polite' });
      side.appendChild(els.done);
      var btns = h('div', { class: 'wd-rq-builder__btns' });
      var strong = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Show me a strong one' });
      strong.addEventListener('click', function () {
        slots.forEach(function (s) {
          var L2 = list(s.k), best = null;
          L2.forEach(function (o, i) { if (best == null && okAt(o, L)) best = i; });
          if (s.k === 'stem' && L === 'e') best = 2;          /* “To what extent…?” */
          pick[s.k] = best;
        });
        update();
      });
      var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start again' });
      again.addEventListener('click', function () { pick = {}; update(); });
      btns.appendChild(strong); btns.appendChild(again);
      side.appendChild(btns);

      /* the slots */
      var box = h('div', { class: 'wd-rq-builder__slots' });
      slots.forEach(function (s) {
        var opts2 = list(s.k).map(function (o, i) { return i; });
        if (s.k !== 'stem') {
          var main = opts2.filter(function (i) { return !list(s.k)[i].none; });
          var tail = opts2.filter(function (i) { return list(s.k)[i].none; });
          opts2 = WUL.shuffle(main).concat(tail);
        }
        var slot = h('div', { class: 'wd-rq-builder__slot', role: 'group', 'aria-label': s.name });
        slot.appendChild(h('div', { class: 'wd-rq-builder__sh', html: '<span class="wd-rq-builder__sw wd-rq-builder__f--' + s.p + '" aria-hidden="true"></span>' + esc(s.name) + (s.lv ? ' <span class="wd-rq-builder__ib">IB</span>' : '') }));
        var row = h('div', { class: 'wd-rq-builder__opts' });
        opts2.forEach(function (i) {
          var o = list(s.k)[i];
          var b = h('button', { type: 'button', class: 'wd-rq-builder__opt' + (o.none ? ' wd-rq-builder__opt--none' : ''), 'aria-pressed': 'false', 'data-i': String(i), html: md(labelOf(o, s.k), { inline: true }) });
          b.addEventListener('click', function () { pick[s.k] = pick[s.k] === i ? null : i; update(); });
          row.appendChild(b);
        });
        slot.appendChild(row);
        var why = h('div', { class: 'wd-rq-builder__why', 'aria-live': 'polite' });
        slot.appendChild(why);
        box.appendChild(slot);
        els.slot[s.k] = { row: row, why: why };
      });

      grid.appendChild(side);
      grid.appendChild(box);
      root.appendChild(grid);
      update();
    }

    function sentence() {
      var st = chosen('stem'), toks = [];
      function add(k, p, gap) {
        var o = chosen(k);
        if (!o) { toks.push({ gap: gap }); return; }
        if (!o.t) return;                                  /* "no range": nothing appears */
        toks.push({ t: o.t, p: p, weak: state(k) === 'no' });
      }
      var wk = state('stem') === 'no';
      if (!st) toks.push({ gap: 'question word' });
      else if (st.t) toks.push({ t: st.t, p: 6, weak: wk });
      add('iv', 1, 'independent variable');
      add('range', 2, 'range');
      if (st) toks.push({ t: st.mid, p: 6, weak: wk }); else toks.push({ gap: '…' });
      add('dv', 3, 'dependent variable');
      add('sys', 4, 'system');
      var out = '';
      toks.forEach(function (tk, i) {
        var sep = (i === 0 || (tk.t && /^[,.]/.test(tk.t))) ? '' : ' ';
        if (tk.gap) { out += sep + '<span class="wd-rq-builder__gap">' + esc(tk.gap) + '</span>'; return; }
        var inner = md(tk.t, { inline: true });
        if (i === 0) inner = cap(inner);
        out += sep + '<span class="wd-rq-builder__f wd-rq-builder__f--' + tk.p + (tk.weak ? ' is-weak' : '') + '">' + inner + '</span>';
      });
      if (st) out += esc(st.end);
      return out;
    }

    function update() {
      /* each slot: pressed state, colour, and the reason */
      slots.forEach(function (s) {
        var sl = els.slot[s.k], i = pick[s.k], st = state(s.k);
        sl.row.querySelectorAll('button').forEach(function (b) {
          var on = i != null && +b.getAttribute('data-i') === i;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.classList.toggle('is-ok', on && st === 'ok');
          b.classList.toggle('is-no', on && st === 'no');
        });
        sl.why.innerHTML = '';
        if (i != null) {
          var k = st === 'ok' ? '✔ Strong' : st === 'no' ? '✘ Weak' : '• Optional here';
          sl.why.appendChild(h('div', { class: 'fb ' + (st === 'ok' ? 'fb--ok' : st === 'no' ? 'fb--no' : 'wd-rq-builder__soft'), html: '<span class="fb__k">' + k + '</span> ' + md(whyOf(chosen(s.k), L), { inline: true }) }));
        }
      });

      /* the question as it stands */
      els.q.innerHTML = sentence();
      if (els.ctx) {
        var c = chosen('ctx');
        els.ctx.innerHTML = '<span class="wd-k">Context</span> ' + (!c ? '<span class="wd-rq-builder__gap">context sentence</span>' :
          (c.t ? '<span class="wd-rq-builder__f wd-rq-builder__f--5' + (state('ctx') === 'no' ? ' is-weak' : '') + '">' + md(c.t, { inline: true }) + '</span>' : '<i>none yet</i>'));
      }

      /* the checklist */
      els.ck.innerHTML = '';
      var need = 0, got = 0;
      checklist(L).forEach(function (ln) {
        var st = state(ln.k);
        if (!ln.soft) { need++; if (st === 'ok') got++; }
        var cls = st === 'ok' ? 'is-ok' : st === 'no' ? 'is-no' : (ln.soft ? 'is-soft' : '');
        var icon = st === 'ok' ? '✔' : st === 'no' ? '✘' : '';
        var sr = st === 'ok' ? 'done' : st === 'no' ? 'weak' : 'not yet';
        els.ck.appendChild(h('li', { class: cls, html: '<span class="wd-rq-builder__ci" aria-hidden="true">' + icon + '</span><span>' + esc(ln.t) + (ln.soft ? '<span class="wd-rq-builder__tag">optional here</span>' : '') + '<span class="wd-rq-builder__sr">: ' + sr + '</span></span>' }));
      });

      /* the verdict */
      els.done.innerHTML = '';
      if (got === need) {
        var ctxOk = state('ctx') === 'ok';
        var msg = L === 'g' ? 'It names what was changed, over what range, what was measured, and in which system.'
          : L === 'i' ? 'The system is named exactly.' + (ctxOk ? ' The context sentence gives the background theory it depends on.' : ' Now add the context: the background theory it depends on.')
          : 'One question, about one named system, that asks how, not whether.' + (ctxOk ? ' The context sentence links it to the literature.' : ' Now add the context from your literature review.');
        els.done.appendChild(h('div', { class: 'fb fb--ok', html: '<span class="fb__k">✔ Focused and testable.</span> ' + esc(msg) }));
        els.done.appendChild(h('p', { class: 'wd-out', html: 'Next, name every variable in full: <a href="#/part/variables">Variables →</a>' }));
      } else {
        els.done.appendChild(h('p', { class: 'wd-out', text: got + ' of ' + need + ' parts are strong so far.' }));
      }
    }

    build();
  });

  (WUL.tool || function (t) { (WUL.TOOLS = WUL.TOOLS || []).push(t); return t; })({
    name: 'rq-builder', title: 'Build a research question',
    blurb: 'Build a question one part at a time. See why each choice is strong or weak.',
    station: 'question', lv: 'gie', icon: '?'
  });
})(window.WUL);
