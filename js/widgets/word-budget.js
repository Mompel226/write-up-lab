/* ============================================================
   widget: word-budget — share the word limit between the sections.
   IA: 3,000 words (IB Biology guide 2025, p. 115). EE: 4,000 words, and
   examiners do not read beyond it (EE guide, first assessment 2027, p. 87).
   The suggested split is OUR advice, not an IB rule: it is labelled so.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h;
  var NAME = 'word-budget';

  WUL.css(NAME,
    '.wd-word-budget{display:grid;gap:14px}' +
    '.wd-word-budget__top{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between}' +
    '.wd-word-budget__total{display:grid;gap:8px}' +
    '.wd-word-budget__num{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}' +
    '.wd-word-budget__big{font:650 1.9rem/1 var(--serif);font-variant-numeric:tabular-nums}' +
    '.wd-word-budget__of{font:500 .95rem/1.2 var(--sans);color:var(--ink-2)}' +
    '.wd-word-budget.is-over .wd-word-budget__big{color:var(--red)}' +
    '.wd-word-budget__stack{position:relative;display:flex;height:22px;border:1px solid var(--edge);border-radius:var(--r);background:var(--sheet-2);overflow:hidden}' +
    '.wd-word-budget__seg{height:100%;min-width:0;transition:width .15s}' +
    '.wd-word-budget__limit{position:absolute;top:-1px;bottom:-1px;width:0;border-left:2px dashed var(--ink)}' +
    '.wd-word-budget.is-over .wd-word-budget__limit{border-left-color:var(--red)}' +
    '.wd-word-budget__over{position:absolute;top:0;bottom:0;background:repeating-linear-gradient(135deg,var(--red-wash) 0 6px,transparent 6px 12px);border-left:0}' +
    '.wd-word-budget__status{font-size:.95rem;line-height:1.45;padding:9px 12px;border-radius:var(--r);background:var(--green-wash)}' +
    '.wd-word-budget.is-over .wd-word-budget__status{background:var(--red-wash)}' +
    '.wd-word-budget__status b{font-weight:650}' +
    '.wd-word-budget__rows{display:grid;gap:10px}' +
    '.wd-word-budget__row{display:grid;gap:6px;padding:10px 12px;border:1px solid var(--edge);border-left:5px solid var(--c);border-radius:var(--r);background:var(--sheet)}' +
    '.wd-word-budget__lab{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline;justify-content:space-between}' +
    '.wd-word-budget__name{font:600 .95rem/1.3 var(--sans)}' +
    '.wd-word-budget__crit{font:650 .66rem/1.2 var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3)}' +
    '.wd-word-budget__ctl{display:grid;grid-template-columns:40px minmax(0,1fr) 40px 64px;gap:8px;align-items:center}' +
    '.wd-word-budget__ctl input[type=range]{width:100%;accent-color:var(--lvl);min-height:32px;margin:0}' +
    '.wd-word-budget__pm{appearance:none;width:40px;height:40px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);color:var(--ink);font:600 1.2rem/1 var(--sans);cursor:pointer}' +
    '.wd-word-budget__pm:hover{border-color:var(--ink-3)}' +
    '.wd-word-budget__pm:focus-visible,.wd-word-budget__ctl input:focus-visible{outline:2px solid var(--lvl);outline-offset:2px}' +
    '.wd-word-budget__val{font:600 .95rem/1 var(--mono);font-variant-numeric:tabular-nums;text-align:right}' +
    '.wd-word-budget__advice{list-style:none;margin:0;padding:0;display:grid;gap:6px}' +
    '.wd-word-budget__advice li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;font-size:.93rem;line-height:1.45}' +
    '.wd-word-budget__advice li span:first-child{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font:700 .72rem/1 var(--sans);background:var(--amber-wash);color:var(--amber)}' +
    '.wd-word-budget__advice li.is-ok span:first-child{background:var(--green-wash);color:var(--green)}' +
    '.wd-word-budget__cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}' +
    '.wd-word-budget__cols ul{margin:6px 0 0;padding-left:1.1em;display:grid;gap:3px;font-size:.92rem;line-height:1.4}' +
    '.wd-word-budget__yes{border-top:3px solid var(--ink-2)} .wd-word-budget__no{border-top:3px solid var(--green)}' +
    '.wd-word-budget__why{font-size:.9rem;color:var(--ink-2);line-height:1.5}' +
    '.wd-word-budget .wd-k{margin-bottom:8px}' +
    '@media (max-width:560px){.wd-word-budget__cols{grid-template-columns:1fr}.wd-word-budget__ctl{grid-template-columns:40px minmax(0,1fr) 40px 54px;gap:6px}}'
  );

  var STEP = 50;
  var MODES = {
    ia: { name: 'IB IA', limit: 3000, max: 1500,
      secs: [
        { k: 'bg', name: 'Research question and background', crit: 'Research design', def: 400, c: 'var(--p4k)' },
        { k: 'meth', name: 'Methodology and method', crit: 'Research design', def: 750, c: 'var(--p4k)' },
        { k: 'an', name: 'Data analysis: processing explained', crit: 'Data analysis', def: 550, c: 'var(--p3k)' },
        { k: 'con', name: 'Conclusion, with the published comparison', crit: 'Conclusion', def: 500, c: 'var(--p5k)' },
        { k: 'ev', name: 'Evaluation: weaknesses ranked, improvements', crit: 'Evaluation', def: 700, c: 'var(--p2k)' }
      ],
      why: 'Each criterion is worth 6 of the 24 marks, and 100 words are left spare. Research design is given the most words, because the method must be clear enough to repeat. The evaluation is also given many words, because it is worth as many marks. Data analysis needs fewer words: its tables, graphs and calculations do not count.',
      counts: ['Every sentence of your own prose, in every section', 'Quotations: the IA guide does not exclude them'],
      free: ['Charts and diagrams', 'Data tables', 'Equations, formulas and calculations', 'Citations, in any style', 'The bibliography', 'Headers'],
      over: 'The IA guide sets 3,000 words as the maximum. Cut the extra words before you submit it.',
      advice: function (v) {
        var a = [];
        if (v.bg > 600) a.push('The background is long. Keep only theory that is directly relevant to the question: you need the words later.');
        if (v.meth < 500) a.push('A method under 500 words may not have enough detail for someone to repeat it. Put the control variables in a table: tables do not count.');
        if (v.an > 800) a.push('Most of the analysis belongs in tables, graphs and calculations, which do not count. Use words to explain them.');
        if (v.con < 300) a.push('The conclusion needs room to answer the question and compare the result with a published value.');
        if (v.ev < 450) a.push('The evaluation has fewer than 450 words, but it is worth 6 of the 24 marks: as much as the whole research design.');
        return a;
      } },
    ee: { name: 'IB EE', limit: 4000, max: 2000,
      secs: [
        { k: 'intro', name: 'Introduction and literature review', crit: 'B Knowledge', def: 800, c: 'var(--p6k)' },
        { k: 'meth', name: 'Methodology', crit: 'A Framework', def: 600, c: 'var(--p4k)' },
        { k: 'res', name: 'Results and analysis', crit: 'C Analysis', def: 700, c: 'var(--p3k)' },
        { k: 'disc', name: 'Discussion', crit: 'D Discussion', def: 900, c: 'var(--p2k)' },
        { k: 'ev', name: 'Evaluation', crit: 'D Discussion', def: 500, c: 'var(--p2k)' },
        { k: 'con', name: 'Conclusion', crit: 'C Analysis', def: 300, c: 'var(--p3k)' }
      ],
      why: 'The discussion is usually the longest section of a science essay: it compares the findings with published work. Criterion D, discussion and evaluation, is worth 8 of the 30 marks. The conclusion is short, because the discussion already gives the detail. 200 words are left spare.',
      counts: ['The introduction', 'The main body', 'The conclusion', 'Quotations', 'Footnotes and endnotes that are not references'],
      free: ['The contents page', 'Headers', 'Maps, charts, diagrams and annotated illustrations', 'Tables', 'Equations, formulas and calculations', 'Citations and references', 'The bibliography', 'The Reflection and Progress Form'],
      over: 'Examiners do not read beyond 4,000 words, so the end of the essay, your conclusion, would not be assessed.',
      advice: function (v) {
        var a = [];
        if (v.intro > 1100) a.push('A long introduction leaves less room for the discussion, where criterion D (8 marks) is earned.');
        if (v.disc < 600) a.push('The discussion compares your findings with published work. In a science essay it is usually the longest section.');
        if (v.con > v.disc) a.push('The conclusion is longer than the discussion. A conclusion is a short synthesis, not a new argument.');
        else if (v.con > 500) a.push('A conclusion over 500 words is probably doing the discussion’s job.');
        if (v.ev < 300) a.push('Criterion D also rewards evaluation of the method and of the sources. Give it enough words.');
        if (v.meth < 350) a.push('The methodology must justify the method, including why other methods were rejected.');
        return a;
      } }
  };

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  WUL.widget(NAME, function (host, opts, ctx) {
    var uid = NAME + '-' + Math.random().toString(36).slice(2, 7);
    var level = (ctx && ctx.level) || WUL.level();
    var mode = opts.mode || (level === 'e' ? 'ee' : 'ia');
    var vals = {};
    function load(m) {
      var saved = WUL.store.get(NAME + '.' + m, null), out = {};
      MODES[m].secs.forEach(function (s) { out[s.k] = saved && typeof saved[s.k] === 'number' ? saved[s.k] : s.def; });
      return out;
    }

    var root = h('div', { class: 'wd-word-budget' });
    host.appendChild(root);

    var top = h('div', { class: 'wd-word-budget__top' });
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Which piece of work' });
    ['ia', 'ee'].forEach(function (m) {
      seg.appendChild(h('button', { type: 'button', 'data-m': m, 'aria-pressed': 'false', text: MODES[m].name + ' · ' + fmt(MODES[m].limit) }));
    });
    var reset = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Back to the suggested split' });
    top.appendChild(seg); top.appendChild(reset);
    root.appendChild(top);

    var total = h('div', { class: 'wd-panel wd-word-budget__total' });
    var num = h('div', { class: 'wd-word-budget__num' });
    var stack = h('div', { class: 'wd-word-budget__stack', 'aria-hidden': 'true' });
    var status = h('p', { class: 'wd-word-budget__status', role: 'status', 'aria-live': 'polite' });
    total.appendChild(num); total.appendChild(stack); total.appendChild(status);
    root.appendChild(total);

    var rows = h('div', { class: 'wd-word-budget__rows' });
    root.appendChild(rows);

    var advPanel = h('div', { class: 'wd-panel' });
    var adv = h('ul', { class: 'wd-word-budget__advice', 'aria-live': 'polite' });
    var why = h('p', { class: 'wd-word-budget__why' });
    advPanel.appendChild(h('div', { class: 'wd-k', text: 'How the split looks' }));
    advPanel.appendChild(adv);
    advPanel.appendChild(h('div', { class: 'wd-k', style: 'margin-top:12px', text: 'Our suggested split, and why' }));
    advPanel.appendChild(why);
    root.appendChild(advPanel);

    var cols = h('div', { class: 'wd-word-budget__cols' });
    var yes = h('div', { class: 'wd-panel wd-word-budget__yes' });
    var no = h('div', { class: 'wd-panel wd-word-budget__no' });
    cols.appendChild(yes); cols.appendChild(no);
    root.appendChild(cols);
    root.appendChild(h('div', { class: 'blk-note note--tip', html: '<div class="note__k">Tip</div><div class="note__b">Tables, graphs and calculations do not count. Show the data in full in tables, with one worked example of each calculation, and use your words to explain what the data show.</div>' }));

    function drawMode() {
      var M = MODES[mode];
      vals = load(mode);
      seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === mode ? 'true' : 'false'); });
      rows.innerHTML = '';
      M.secs.forEach(function (s) {
        var id = uid + '-' + s.k;
        var row = h('div', { class: 'wd-word-budget__row', style: '--c:' + s.c });
        row.appendChild(h('div', { class: 'wd-word-budget__lab' }, [h('label', { class: 'wd-word-budget__name', for: id, text: s.name }), h('span', { class: 'wd-word-budget__crit', text: s.crit })]));
        var minus = h('button', { type: 'button', class: 'wd-word-budget__pm', 'data-k': s.k, 'data-d': String(-STEP), 'aria-label': 'Fewer words for ' + s.name, text: '−' });
        var range = h('input', { type: 'range', id: id, min: '0', max: String(M.max), step: String(STEP), 'data-k': s.k });
        range.value = String(vals[s.k]);
        var plus = h('button', { type: 'button', class: 'wd-word-budget__pm', 'data-k': s.k, 'data-d': String(STEP), 'aria-label': 'More words for ' + s.name, text: '+' });
        var out = h('output', { class: 'wd-word-budget__val', for: id, 'data-out': s.k, text: fmt(vals[s.k]) });
        row.appendChild(h('div', { class: 'wd-word-budget__ctl' }, [minus, range, plus, out]));
        rows.appendChild(row);
      });
      yes.innerHTML = '<div class="wd-k">Counts towards the ' + fmt(M.limit) + '</div><ul>' + M.counts.map(function (t) { return '<li>' + WUL.esc(t) + '</li>'; }).join('') + '</ul>';
      no.innerHTML = '<div class="wd-k">Does not count</div><ul>' + M.free.map(function (t) { return '<li>' + WUL.esc(t) + '</li>'; }).join('') + '</ul>';
      why.textContent = M.why;
      paint();
    }
    function paint() {
      var M = MODES[mode];
      var sum = M.secs.reduce(function (a, s) { return a + vals[s.k]; }, 0);
      var over = sum - M.limit, scale = Math.max(sum, M.limit);
      root.classList.toggle('is-over', over > 0);
      num.innerHTML = '<span class="wd-word-budget__big">' + fmt(sum) + '</span><span class="wd-word-budget__of">of ' + fmt(M.limit) + ' words</span>';
      stack.innerHTML = '';
      M.secs.forEach(function (s) { stack.appendChild(h('div', { class: 'wd-word-budget__seg', style: 'width:' + (vals[s.k] / scale * 100) + '%;background:' + s.c + ';opacity:.8' })); });
      if (over > 0) stack.appendChild(h('div', { class: 'wd-word-budget__over', style: 'left:' + (M.limit / scale * 100) + '%;right:0' }));
      stack.appendChild(h('div', { class: 'wd-word-budget__limit', style: 'left:calc(' + (M.limit / scale * 100) + '% - 1px)' }));
      if (over > 0) status.innerHTML = '<b>Over by ' + fmt(over) + ' words.</b> ' + WUL.esc(M.over);
      else if (over === 0) status.innerHTML = '<b>Exactly at the limit.</b> Leave a small margin: edits add words.';
      else status.innerHTML = '<b>' + fmt(-over) + ' words to spare.</b> Keep a small margin: edits add words.';
      rows.querySelectorAll('[data-out]').forEach(function (o) { o.textContent = fmt(vals[o.getAttribute('data-out')]); });
      rows.querySelectorAll('input[type=range]').forEach(function (r) { var v = String(vals[r.getAttribute('data-k')]); if (r.value !== v) r.value = v; r.setAttribute('aria-valuetext', fmt(+v) + ' words'); });
      var a = M.advice(vals);
      adv.innerHTML = '';
      if (!a.length) adv.appendChild(h('li', { class: 'is-ok' }, [h('span', { 'aria-hidden': 'true', text: '✔' }), h('span', { text: 'A balanced split: every section has enough words.' })]));
      a.forEach(function (t) { adv.appendChild(h('li', {}, [h('span', { 'aria-hidden': 'true', text: '!' }), h('span', { text: t })])); });
      WUL.store.set(NAME + '.' + mode, vals);
    }
    function set(k, v) {
      var M = MODES[mode];
      vals[k] = Math.max(0, Math.min(M.max, Math.round(v / STEP) * STEP));
      paint();
    }

    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-m]'); if (!b || b.getAttribute('data-m') === mode) return;
      mode = b.getAttribute('data-m'); drawMode();
    });
    rows.addEventListener('click', function (e) {
      var b = e.target.closest('.wd-word-budget__pm'); if (!b) return;
      var k = b.getAttribute('data-k'); set(k, vals[k] + (+b.getAttribute('data-d')));
    });
    rows.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      set(k, +e.target.value);
    });
    reset.addEventListener('click', function () {
      MODES[mode].secs.forEach(function (s) { vals[s.k] = s.def; });
      paint();
    });

    drawMode();
  });

  /* WUL.tool lives in app.js, which loads after the widget files: queue the entry if it is not there yet */
  var TOOL = { name: NAME, title: 'Word budget', blurb: 'Share 3,000 or 4,000 words between the sections, and see what does not count.', station: 'format', lv: 'ie', icon: '≡' };
  if (WUL.tool) WUL.tool(TOOL); else (WUL.TOOLS = WUL.TOOLS || []).push(TOOL);
})(window.WUL);
