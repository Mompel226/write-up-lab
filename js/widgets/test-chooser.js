/* ============================================================
   widget: test-chooser — "Which test?"

   Part 1: three or four plain questions lead to a test (t-test,
   chi-squared, correlation / R², or "plan one comparison"). The end
   card gives the test, what its null hypothesis would say, and a
   sentence for the report. Every number in those sentences was
   computed and checked (see the Statistics station):
     t-test, amylase 40 vs 50 °C: t = 5.77, df = 8, p = 0.0004
     woodlice 32 : 8 against 20 : 20: χ² = 14.4, df = 1, p = 0.00015
     species in 50 quadrats (18 / 7 / 5 / 20): χ² = 13.6, df = 1, p = 0.0002
     potato cylinders: r = −0.99, R² = 0.99
   Part 2: six studies; the reader picks the test and is told why.
   Nothing moves on by itself.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var NAME = 'test-chooser', C = 'wd-test-chooser';

  var TOOL = { name: NAME, title: 'Which test?', blurb: 'Answer three questions and find the statistical test that fits your data.', station: 'stats', lv: 'ie', icon: 'χ²' };
  if (WUL.tool) WUL.tool(TOOL); else (WUL.TOOLS = WUL.TOOLS || []).push(TOOL);

  /* ---------- part 1: the questions ---------- */
  var Q = {
    kind: { q: 'What did you record?', opts: [
      { t: 'Counts in categories', sub: 'How many fall into each group. For example, 32 woodlice on the damp side and 8 on the dry side.', go: 'counts' },
      { t: 'Measurements on a scale', sub: 'A value for each trial or individual. For example, a time in seconds or a height in centimetres.', go: 'aim' }
    ] },
    counts: { q: 'What do you compare the counts with?', opts: [
      { t: 'An expected ratio, or an even spread', sub: 'For example 3 : 1 in a genetic cross, or 50 : 50 in a choice chamber.', go: '=chi' },
      { t: 'A second set of categories', sub: 'Are two features found together? For example, two species present or absent in the same quadrats.', go: '=chiA' }
    ] },
    aim: { q: 'What are you looking for?', opts: [
      { t: 'A difference between groups', sub: 'For example, the mean time at 40 °C against the mean time at 50 °C.', go: 'groups' },
      { t: 'A relationship between two variables', sub: 'Two measurements on each individual or sample. For example, sucrose concentration and change in mass.', go: '=corr' }
    ] },
    groups: { q: 'How many groups do you want to compare?', opts: [
      { t: 'Two', sub: 'For example, 40 °C and 50 °C.', go: '=t' },
      { t: 'Three or more', sub: 'For example, all five temperatures.', go: '=many' }
    ] }
  };
  var R = {
    t: { test: 't-test', why: 'You are comparing the means of two groups of measurements.',
      h0: 'There is no difference between the mean time for the starch to disappear at 40 °C and at 50 °C.',
      say: 'A two-tailed t-test showed that the mean time at 50 °C (54 s) was significantly shorter than at 40 °C (74 s) (t = 5.77, df = 8, p < 0.001).',
      care: 'The spread in the two groups should be similar. Our rule: at least five repeats in each group.' },
    chi: { test: 'Chi-squared test', why: 'You are comparing the counts you observed with the counts you expected.',
      h0: 'The woodlice show no preference: they are equally likely to be on the damp side and on the dry side.',
      say: 'Significantly more woodlice were found on the damp side than expected by chance (χ² = 14.4, df = 1, p < 0.001).',
      care: 'Use the counts themselves, never percentages. Each expected count should be at least 5.' },
    chiA: { test: 'Chi-squared test for association', why: 'You are asking whether two sets of categories are linked.',
      h0: 'There is no association between the presence of species A and the presence of species B in a quadrat.',
      say: 'Species A and B were found together in 18 of 50 quadrats, more often than the 11.5 expected by chance (χ² = 13.6, df = 1, p < 0.001).',
      care: 'Count four groups: both species, only A, only B, and neither. An association does not show that one species causes the other.' },
    corr: { test: 'Correlation coefficient (r), and R² for a trend line', why: 'You measured two continuous variables together, and want the strength of the relationship.',
      h0: 'There is no correlation between the concentration of sucrose and the percentage change in mass.',
      say: 'The change in mass decreased as the sucrose concentration increased, and a straight line of best fit matched the points closely (r = −0.99, R² = 0.99).',
      care: 'r measures a straight-line relationship only. A correlation alone does not show that one variable causes the other.' },
    many: { test: 'Plan one comparison, then use a t-test', why: 'Testing every pair makes a false “significant” result likely: at p < 0.05, about 1 test in 20 looks significant by chance alone.',
      h0: 'There is no difference between the mean time at 40 °C and at 50 °C. This one pair was chosen before the data were collected.',
      say: 'A t-test between 40 °C and 50 °C, planned before the data were collected, gave t = 5.77, df = 8, p < 0.001.',
      care: 'To compare three or more groups in one test, scientists use ANOVA. It is beyond the IB course. For a trend across the whole range, the graph with its error bars is the main evidence.' }
  };

  /* ---------- part 2: practice ---------- */
  var KEYS = [['t', 't-test'], ['chi', 'Chi-squared test'], ['r', 'Correlation (r or R²)']];
  var NO = {
    't>chi': 'A t-test compares the means of measurements. Here you have counts in categories.',
    't>r': 'A t-test compares groups. Here each individual gives two measurements, and you want the relationship between them.',
    'chi>t': 'Chi-squared needs counts in categories. Here you have measurements, and two means to compare.',
    'chi>r': 'Chi-squared needs counts in categories. Here you have two continuous measurements on each individual or sample.',
    'r>t': 'A correlation needs two measurements on each individual. Here you have one measurement in each of two groups.',
    'r>chi': 'A correlation needs two continuous variables. Here you have counts in categories.'
  };
  var PRACTICE = [
    { s: 'Woodlice are placed in a choice chamber with a damp side and a dry side. After 10 minutes you count how many are on each side.', ok: 'chi',
      why: 'Counts in two categories, compared with the 50 : 50 split expected if the woodlice had no preference.' },
    { s: 'You measure the length of 15 limpet shells on an exposed shore and 15 on a sheltered shore. Is the mean length different?', ok: 't',
      why: 'Two groups of measurements, and the question is about the difference between their means.' },
    { s: 'In 20 quadrats along a path, you measure the light intensity and the percentage cover of moss.', ok: 'r',
      why: 'Two continuous variables measured in each quadrat: you want the strength and direction of the relationship.' },
    { s: 'A cross between two heterozygous pea plants gives 72 plants with purple flowers and 28 with white flowers. Does this fit a 3 : 1 ratio?', ok: 'chi',
      why: 'Counts in categories against an expected ratio: 75 and 25 of 100.' },
    { s: 'You plot the percentage change in mass of potato cylinders against sucrose concentration and draw a straight line of best fit. How well does the line fit?', ok: 'r',
      why: 'R², the coefficient of determination, says how well a trend line fits the points.' },
    { s: 'On grass, 32 of 50 snails have banded shells. On sand, 20 of 50 do. Is banding linked to the habitat?', ok: 'chi',
      why: 'Counts in categories (banded or not, grass or sand): a chi-squared test for association. Use the counts, not 64 % and 40 %.' }
  ];

  function styles() {
    WUL.css(NAME,
      '.' + C + '{display:grid;gap:18px}' +
      '.' + C + '__part{display:grid;gap:12px}' +
      '.' + C + '__h{font:600 1.08rem/1.3 var(--serif)}' +
      '.' + C + '__trail{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:.85rem;color:var(--ink-2)}' +
      '.' + C + '__trail span{background:var(--sheet-2);border:1px solid var(--rule-2);border-radius:999px;padding:3px 10px}' +
      '.' + C + '__q{font:500 1.15rem/1.4 var(--serif)}' +
      '.' + C + '__opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}' +
      '.' + C + '__opt{appearance:none;display:grid;gap:4px;text-align:left;padding:12px 14px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);cursor:pointer;box-shadow:var(--shadow-sm)}' +
      '.' + C + '__opt:hover{border-color:var(--lvl);background:var(--lvl-wash)}' +
      '.' + C + '__opt b{font-size:1rem}' +
      '.' + C + '__opt span{font-size:.9rem;color:var(--ink-2);line-height:1.45}' +
      '.' + C + '__res{display:grid;gap:10px;border-left:4px solid var(--lvl)}' +
      '.' + C + '__rk{font:650 .7rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}' +
      '.' + C + '__rt{font:600 1.35rem/1.25 var(--serif);color:var(--lvl)}' +
      '.' + C + '__dl{display:grid;gap:10px;margin:0}' +
      '.' + C + '__dl dt{font:650 .7rem/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}' +
      '.' + C + '__dl dd{margin:3px 0 0;font-size:.98rem;line-height:1.5}' +
      '.' + C + '__say{font:400 1rem/1.55 var(--serif);background:var(--sheet-2);border:1px dashed var(--ink-3);border-radius:var(--r);padding:8px 12px}' +
      '.' + C + '__nav{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
      '.' + C + '__prog{font:600 .74rem/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}' +
      '.' + C + '__scen{font:500 1.08rem/1.5 var(--serif)}' +
      '.' + C + '__picks{display:flex;flex-wrap:wrap;gap:8px}' +
      '.' + C + '__picks .btn.is-no{border-color:var(--red);background:var(--red-wash)}' +
      '.' + C + '__picks .btn.is-ok{border-color:var(--green);background:var(--green-wash)}' +
      '.' + C + '__note{font-size:.9rem;color:var(--ink-2)}'
    );
  }

  WUL.widget(NAME, function (host, opts, ctx) {
    styles();
    var level = (ctx && ctx.level) || WUL.level();
    host.innerHTML = '';
    var root = h('div', { class: C });
    host.appendChild(root);
    if (level === 'g') root.appendChild(h('p', { class: C + '__note', text: 'Statistical tests are IB content. At IGCSE you compare the means and the ranges instead.' }));

    /* ----- part 1 ----- */
    var p1 = h('section', { class: C + '__part wd-panel', 'aria-label': 'Find your test' });
    root.appendChild(p1);
    var path = [];                         /* [{node, pick}] */
    function draw1(focusFirst) {
      p1.innerHTML = '';
      p1.appendChild(h('div', { class: C + '__h', text: 'Find your test' }));
      if (path.length) {
        var tr = h('div', { class: C + '__trail', 'aria-label': 'Your answers so far' });
        path.forEach(function (st) { tr.appendChild(h('span', { text: Q[st.node].opts[st.pick].t })); });
        p1.appendChild(tr);
      }
      var node = 'kind';
      if (path.length) node = Q[path[path.length - 1].node].opts[path[path.length - 1].pick].go;
      if (node.charAt(0) === '=') { result(R[node.slice(1)]); return; }
      var q = Q[node];
      p1.appendChild(h('p', { class: C + '__q', text: q.q }));
      var list = h('div', { class: C + '__opts' });
      q.opts.forEach(function (o, i) {
        var b = h('button', { type: 'button', class: C + '__opt' }, [h('b', { text: o.t }), h('span', { text: o.sub })]);
        b.addEventListener('click', function () { path.push({ node: node, pick: i }); draw1(true); });
        list.appendChild(b);
      });
      p1.appendChild(list);
      if (path.length) p1.appendChild(navRow());
      if (focusFirst) { var f = list.querySelector('button'); if (f) f.focus(); }
    }
    function navRow() {
      var back = h('button', { type: 'button', class: 'btn btn--ghost', text: '← Back' });
      back.addEventListener('click', function () { path.pop(); draw1(true); });
      var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start again ↺' });
      again.addEventListener('click', function () { path = []; draw1(true); });
      return h('div', { class: C + '__nav' }, [back, again]);
    }
    function result(r) {
      var box = h('div', { class: C + '__res wd-panel', role: 'status' });
      box.appendChild(h('div', { class: C + '__rk', text: 'Your test' }));
      box.appendChild(h('div', { class: C + '__rt', text: r.test }));
      var dl = h('dl', { class: C + '__dl' });
      dl.appendChild(h('dt', { text: 'Why' })); dl.appendChild(h('dd', { html: md(r.why, { inline: true }) }));
      dl.appendChild(h('dt', { text: 'The null hypothesis would say' })); dl.appendChild(h('dd', { html: md(r.h0, { inline: true }) }));
      dl.appendChild(h('dt', { text: 'In your report' })); dl.appendChild(h('dd', {}, h('div', { class: C + '__say', html: md(r.say, { inline: true }) })));
      dl.appendChild(h('dt', { text: 'Be careful' })); dl.appendChild(h('dd', { html: md(r.care, { inline: true }) }));
      box.appendChild(dl);
      p1.appendChild(box);
      p1.appendChild(navRow());
      var nb = p1.querySelector('.' + C + '__nav button'); if (nb) nb.focus();
    }
    draw1(false);

    /* ----- part 2 ----- */
    var p2 = h('section', { class: C + '__part wd-panel', 'aria-label': 'Practise' });
    root.appendChild(p2);
    var order = PRACTICE.map(function (x, i) { return i; }), k = 0, first = [], tries = 0, done = false;
    function draw2(focus) {
      p2.innerHTML = '';
      p2.appendChild(h('div', { class: C + '__h', text: 'Practise: which test would you use?' }));
      if (k >= order.length) {
        var got = first.filter(Boolean).length;
        p2.appendChild(h('p', { class: C + '__scen', text: got + ' of ' + order.length + ' right first time. ' + (got === order.length ? 'All correct.' : 'Read the reasons again for the ones you missed.') }));
        var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Try again ↺' });
        again.addEventListener('click', function () { order = WUL.shuffle(order); k = 0; first = []; tries = 0; done = false; draw2(true); });
        p2.appendChild(h('div', { class: C + '__nav' }, [again]));
        if (focus) again.focus();
        return;
      }
      var P = PRACTICE[order[k]];
      p2.appendChild(h('div', { class: C + '__prog', text: 'Study ' + (k + 1) + ' of ' + order.length }));
      p2.appendChild(h('p', { class: C + '__scen', text: P.s }));
      var picks = h('div', { class: C + '__picks', role: 'group', 'aria-label': 'Choose a test' });
      var fb = h('div', { 'aria-live': 'polite' });
      KEYS.forEach(function (kk) {
        var b = h('button', { type: 'button', class: 'btn', text: kk[1] });
        b.addEventListener('click', function () {
          if (done) return;
          tries++;
          var ok = kk[0] === P.ok;
          if (first[k] == null && (ok || tries === 1)) first[k] = ok && tries === 1;
          b.classList.add(ok ? 'is-ok' : 'is-no');
          fb.innerHTML = '';
          fb.appendChild(h('div', { class: 'fb ' + (ok ? 'fb--ok' : 'fb--no'), role: 'status', html: '<span class="fb__k">' + (ok ? '✔ Right' : '✘ Not this one') + '</span> ' + esc(ok ? P.why : NO[kk[0] + '>' + P.ok] + ' Try again.') }));
          if (ok) {
            done = true;
            picks.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
            var nx = h('button', { type: 'button', class: 'btn btn--go', text: k === order.length - 1 ? 'See your score →' : 'Next study →' });
            nx.addEventListener('click', function () { k++; tries = 0; done = false; draw2(true); });
            fb.appendChild(h('div', { class: C + '__nav', style: 'margin-top:10px' }, [nx]));
            nx.focus();
          }
        });
        picks.appendChild(b);
      });
      p2.appendChild(picks);
      p2.appendChild(fb);
      if (focus) { var f = picks.querySelector('button'); if (f) f.focus(); }
    }
    draw2(false);
  });
})(window.WUL);
