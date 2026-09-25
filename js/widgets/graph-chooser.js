/* widget: graph-chooser — "Which graph?" Eight biology experiments, each with its data.
   The reader picks bar chart / histogram / line graph / scatter graph. A wrong pick explains
   why that type does not fit; the right pick draws the data as that graph, with one sentence why.
   Never moves on by itself. */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;

  var TYPES = [
    { id: 'bar', name: 'Bar chart' },
    { id: 'hist', name: 'Histogram' },
    { id: 'line', name: 'Line graph' },
    { id: 'scatter', name: 'Scatter graph' }
  ];

  /* why the type the reader picked does not fit, given the right one */
  var NOT = {
    bar: {
      hist: 'Histogram bars touch because the ranges of a continuous variable meet. These are separate categories, so they need gaps.',
      line: 'A line joins values on a number scale. These are categories: there is nothing halfway between them, so a line would mean nothing.',
      scatter: 'A scatter graph needs a number on both axes. Here the x-axis is a list of categories.'
    },
    line: {
      bar: 'The independent variable is a number scale, not a list of categories. A line graph shows the values in between as well.',
      hist: 'A histogram counts how many values fall in each range. Here each value of the independent variable has one mean, not a count.',
      scatter: 'The values of the independent variable were set, so the points are joined. A scatter graph is for two variables that were both only measured.'
    },
    hist: {
      bar: 'Nearly right: bars are correct. But the ranges are continuous and meet, so the bars touch. That makes it a histogram.',
      line: 'The data are counts in each range, not one measurement at each value. Counts in ranges are drawn as touching bars.',
      scatter: 'A scatter graph pairs two measurements for each individual. Here there is one count for each range.'
    },
    scatter: {
      bar: 'Both variables are numbers on a scale, measured for each individual. A bar chart is for categories.',
      hist: 'A histogram shows one variable in ranges. Here there are two measurements for each individual.',
      line: 'A line graph is for values you set. Here nothing was set: both variables were only measured.'
    }
  };

  var PREV = { w: 420, h: 290, pad: { l: 60, r: 18, t: 12, b: 50 } };
  function minus(v) { return v < 0 ? '−' + Math.abs(v) : String(v); }
  function signed(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1); }
  /* a table heading may wrap before the solidus, never inside the unit */
  function nb(hd) { return hd.replace(/ \/ (.+)$/, function (m, u) { return ' /\u00a0' + u.replace(/ /g, '\u00a0'); }); }

  function cards() {
    var A = WUL.data.amylase, S = WUL.data.soils;
    var L = WUL.level(), D = L === 'g' ? A.g : A.i;
    function bars(labels, vals, touch) { return { touch: !!touch, items: labels.map(function (l, i) { return { label: l, v: vals[i] }; }) }; }
    function xy(xs, ys) { return xs.map(function (x, i) { return [x, ys[i]]; }); }
    var leafL = [5, 8, 12, 15, 20, 26, 30, 35, 42, 50, 58, 65], leafW = [62, 58, 60, 55, 52, 50, 47, 49, 44, 41, 40, 36];
    var hrsX = [0, 1, 1.5, 2, 3, 3.5, 4, 5, 6, 6.5, 7, 8], hrsY = [82, 80, 78, 79, 74, 73, 72, 69, 66, 67, 63, 61];
    var potX = [0, 0.1, 0.2, 0.3, 0.4, 0.5], potY = [12.4, 7.1, 2.6, -2.2, -6.8, -11.3];
    function firstSix(xh, yh, xs, ys, more, fx) {
      var rows = xs.slice(0, 6).map(function (x, i) { return [fx ? fx(x) : String(x), String(ys[i])]; });
      rows.push([{ t: more, cs: 2, cls: 'wd-graph-chooser__more' }]);
      return { head: [[xh, yh]], rows: rows };
    }
    return [
      { id: 'soils', ans: 'bar',
        q: 'Bean seedlings were grown in four soils, A to D. The mean height of 10 seedlings in each soil was measured.',
        table: { head: [['Soil', 'Mean height / cm']], rows: S.labels.map(function (l, i) { return [l, S.means[i].toFixed(1)]; }) },
        why: 'Soil type is a [[categorical variable]]. Each soil has its own bar, and the bars have gaps.',
        spec: { x: { cat: S.labels, label: 'Soil' }, y: { min: 0, max: 50, step: 10, minor: 5, label: 'Mean height / cm' }, bars: bars(S.labels, S.means) } },
      { id: 'amylase', ans: 'line',
        q: 'Amylase was mixed with starch at five temperatures. The mean time for the starch to disappear was recorded.',
        table: { head: [['Temperature / °C', 'Mean time / s']], rows: D.temps.map(function (t, i) { return [String(t), String(D.means[i])]; }) },
        why: 'Temperature is a [[continuous variable]], and its values were set. Plot each mean as a cross, ' + (L === 'g' ? 'and join the crosses with ruled lines.' : 'then draw one smooth curve through the trend: biology predicts a rise to an optimum, then a fall.'),
        spec: { x: { min: 20, max: 60, step: 10, minor: 5, label: 'Temperature / °C' }, y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' }, series: [{ id: 'm', pts: xy(D.temps, D.means), line: L === 'g' ? 'ruled' : 'smooth' }] } },
      { id: 'holly', ans: 'hist',
        q: 'The lengths of 40 holly leaves were measured. The number of leaves in each 10 mm range was counted.',
        table: { head: [['Length / mm', 'Number of leaves']], rows: [['30–39', '3'], ['40–49', '9'], ['50–59', '15'], ['60–69', '10'], ['70–79', '3']] },
        why: 'Length is continuous, and the data are counts in each range. The bars touch, because each range starts where the last one ends.',
        spec: { x: { cat: ['30–39', '40–49', '50–59', '60–69', '70–79'], label: 'Length / mm' }, y: { min: 0, max: 20, step: 5, minor: 5, label: 'Number of leaves' }, bars: bars(['30–39', '40–49', '50–59', '60–69', '70–79'], [3, 9, 15, 10, 3], true) } },
      { id: 'leaves', ans: 'scatter',
        q: 'Twelve leaves were picked in a wood. The light intensity at each leaf and the width of the leaf were both measured.',
        table: firstSix('Light intensity / % of full sunlight', 'Leaf width / mm', leafL, leafW, '… and 6 more leaves'),
        why: 'Neither variable was set: both were only measured. Each leaf is one cross, and the crosses are not joined.',
        spec: { x: { min: 0, max: 70, step: 10, minor: 5, label: 'Light intensity / % of full sunlight' }, y: { min: 30, max: 70, step: 10, minor: 5, label: 'Leaf width / mm' }, series: [{ id: 's', pts: xy(leafL, leafW) }] } },
      { id: 'woodlice', ans: 'bar',
        q: 'Twenty woodlice were placed in a choice chamber with four sections. After 10 minutes, the woodlice in each section were counted.',
        table: { head: [['Section', 'Number of woodlice']], rows: [['Damp and dark', '11'], ['Damp and light', '5'], ['Dry and dark', '3'], ['Dry and light', '1']] },
        why: 'The four sections are categories, not points on a scale. Each has its own bar, with gaps between the bars.',
        spec: { w: 480, x: { cat: ['Damp, dark', 'Damp, light', 'Dry, dark', 'Dry, light'], label: 'Section of the chamber' }, y: { min: 0, max: 12, step: 2, minor: 4, label: 'Number of woodlice' }, bars: bars(['Damp, dark', 'Damp, light', 'Dry, dark', 'Dry, light'], [11, 5, 3, 1]) } },
      { id: 'potato', ans: 'line',
        q: 'Potato cylinders were placed in six concentrations of sucrose solution. The percentage change in mass of each cylinder was calculated.',
        table: { head: [['Concentration of sucrose / mol dm⁻³', 'Change in mass / %']], rows: potX.map(function (x, i) { return [x.toFixed(1), signed(potY[i])]; }) },
        why: 'Concentration is continuous, and its values were chosen. The negative changes are plotted below zero on the y-axis.' + (L === 'g' ? '' : ' The points lie close to a straight line, so draw one line of best fit.'),
        spec: { x: { min: 0, max: 0.5, step: 0.1, minor: 5, label: 'Concentration of sucrose / mol dm⁻³' }, y: { min: -15, max: 15, step: 5, minor: 5, label: 'Change in mass / %', fmt: minus }, tickDpX: 1, series: [{ id: 'm', pts: xy(potX, potY), line: L === 'g' ? 'ruled' : 'best' }] } },
      { id: 'beans', ans: 'hist',
        q: 'Sixty broad bean seeds were weighed. The number of seeds in each 0.5 g range was counted.',
        table: { head: [['Mass / g', 'Number of seeds']], rows: [['0.5–0.9', '4'], ['1.0–1.4', '14'], ['1.5–1.9', '23'], ['2.0–2.4', '15'], ['2.5–2.9', '4']] },
        why: 'Mass is continuous, and the data are counts in each range. This is a frequency distribution: the bars touch.',
        spec: { x: { cat: ['0.5–0.9', '1.0–1.4', '1.5–1.9', '2.0–2.4', '2.5–2.9'], label: 'Mass / g' }, y: { min: 0, max: 25, step: 5, minor: 5, label: 'Number of seeds' }, bars: bars(['0.5–0.9', '1.0–1.4', '1.5–1.9', '2.0–2.4', '2.5–2.9'], [4, 14, 23, 15, 4], true) } },
      { id: 'exercise', ans: 'scatter',
        q: 'Twelve students recorded their hours of exercise per week. The resting heart rate of each student was measured.',
        table: firstSix('Exercise / hours per week', 'Resting heart rate / beats per min', hrsX, hrsY, '… and 6 more students'),
        why: 'Both variables were measured, not set, for each student. A scatter graph shows whether they are correlated.',
        spec: { x: { min: 0, max: 8, step: 1, minor: 5, label: 'Exercise / hours per week' }, y: { min: 60, max: 85, step: 5, minor: 5, label: 'Resting heart rate / beats per min' }, series: [{ id: 's', pts: xy(hrsX, hrsY) }] } }
    ];
  }

  /* a tiny picture of each type, drawn by WUL.plot like every other graph */
  function icon(type) {
    var o = { w: 120, h: 84, pad: { l: 8, r: 6, t: 6, b: 8 }, x: { min: 0, max: 6, step: 1, minor: 1, ticks: false }, y: { min: 0, max: 6, step: 1, minor: 1, ticks: false }, alt: '' };
    if (type === 'bar') o.bars = { width: 0.55, items: [{ label: '', v: 3 }, { label: '', v: 5 }, { label: '', v: 2 }, { label: '', v: 4 }] };
    if (type === 'hist') o.bars = { touch: true, items: [{ label: '', v: 1 }, { label: '', v: 3 }, { label: '', v: 5 }, { label: '', v: 3.5 }, { label: '', v: 1.5 }] };
    if (type === 'line') o.series = [{ id: 'i', pts: [[0.8, 5], [2, 3.2], [3.2, 2], [4.4, 1.6], [5.4, 3]], line: 'ruled' }];
    if (type === 'scatter') o.series = [{ id: 'i', pts: [[0.8, 1.2], [1.4, 2], [2, 1.7], [2.6, 3], [3.1, 2.6], [3.7, 3.8], [4.2, 3.4], [4.8, 4.6], [5.4, 4.3]] }];
    return WUL.plot(o);
  }

  var CSS =
    '.wd-graph-chooser{display:grid;gap:14px}' +
    '.wd-graph-chooser__top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
    '.wd-graph-chooser__dots{display:flex;gap:6px;flex-wrap:wrap}' +
    '.wd-graph-chooser__dot{appearance:none;width:34px;height:34px;border-radius:50%;border:1.5px solid var(--rule);background:var(--sheet);font:600 .8rem/1 var(--mono);color:var(--ink-2);cursor:pointer;padding:0}' +
    '.wd-graph-chooser__dot[aria-current="true"]{border-color:var(--lvl);box-shadow:0 0 0 2px var(--lvl-wash);color:var(--lvl)}' +
    '.wd-graph-chooser__dot.is-ok{background:var(--green-wash);border-color:var(--green);color:var(--green)}' +
    '.wd-graph-chooser__dot.is-late{background:var(--hl-soft)}' +
    '.wd-graph-chooser__score{font:600 .8rem/1.3 var(--mono);color:var(--ink-2)}' +
    '.wd-graph-chooser__card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}' +
    '.wd-graph-chooser__q{font:500 1.08rem/1.5 var(--serif);margin-bottom:10px}' +
    '.wd-graph-chooser__n{font:600 .7rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--lvl);margin-bottom:6px}' +
    '.wd-graph-chooser__data table.dt{font-size:.8rem;width:auto;min-width:60%}' +
    '.wd-graph-chooser__data table.dt td,.wd-graph-chooser__data table.dt th{padding:4px 9px}' +
    '.wd-graph-chooser__more{font:italic .8rem var(--serif);color:var(--ink-3)}' +
    '.wd-graph-chooser__opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}' +
    '.wd-graph-chooser__opt{appearance:none;display:grid;justify-items:center;gap:4px;padding:10px 6px 9px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);cursor:pointer;font:600 .92rem/1.2 var(--sans);color:var(--ink);min-height:44px}' +
    '.wd-graph-chooser__opt:hover:not(:disabled){border-color:var(--ink-3);background:var(--sheet-2)}' +
    '.wd-graph-chooser__opt .plot{width:78px;max-width:78px}' +
    '.wd-graph-chooser__opt .plotfig{pointer-events:none}' +
    '.wd-graph-chooser__opt.is-no{border-color:var(--red);background:var(--red-wash)}' +
    '.wd-graph-chooser__opt.is-ok{border-color:var(--green);background:var(--green-wash);box-shadow:0 0 0 2px var(--green-wash)}' +
    '.wd-graph-chooser__opt:disabled{cursor:default}' +
    '.wd-graph-chooser__opt:disabled:not(.is-ok):not(.is-no){opacity:.55}' +
    '.wd-graph-chooser__prev{display:grid;gap:6px}' +
    '.wd-graph-chooser__prev .plot{max-width:480px}' +
    '.wd-graph-chooser__pk{font:650 .7rem/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--green)}' +
    '.wd-graph-chooser__foot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
    '.wd-graph-chooser__end{text-align:center;padding:10px 0}' +
    '.wd-graph-chooser__end b{font:600 2.4rem/1 var(--serif)}' +
    '@media (max-width:640px){.wd-graph-chooser__card{grid-template-columns:1fr}.wd-graph-chooser__dot{width:32px;height:32px}}';

  WUL.widget('graph-chooser', function (host) {
    WUL.css('graph-chooser', CSS);
    var C = cards(), n = C.length, i = 0;
    var tried = {}, done = {}, picked = {};   /* per card: wrong picks so far, solved, the wrong types tapped */
    var icons = {}; TYPES.forEach(function (t) { icons[t.id] = icon(t.id); });

    var root = h('div', { class: 'wd-graph-chooser wd-panel' });
    var top = h('div', { class: 'wd-graph-chooser__top' });
    var dots = h('div', { class: 'wd-graph-chooser__dots', role: 'group', 'aria-label': 'Choose a card' });
    var score = h('div', { class: 'wd-graph-chooser__score', 'aria-live': 'polite' });
    top.appendChild(dots); top.appendChild(score);
    var body = h('div');
    root.appendChild(top); root.appendChild(body);
    host.appendChild(root);

    C.forEach(function (c, k) {
      var d = h('button', { type: 'button', class: 'wd-graph-chooser__dot', text: String(k + 1), 'aria-label': 'Card ' + (k + 1) });
      d.addEventListener('click', function () { i = k; draw(); });
      dots.appendChild(d);
    });

    function paintTop() {
      dots.querySelectorAll('button').forEach(function (d, k) {
        d.setAttribute('aria-current', k === i ? 'true' : 'false');
        d.classList.toggle('is-ok', !!done[C[k].id] && !tried[C[k].id]);
        d.classList.toggle('is-late', !!done[C[k].id] && !!tried[C[k].id]);
      });
      var nd = C.filter(function (c) { return done[c.id]; }).length;
      var nf = C.filter(function (c) { return done[c.id] && !tried[c.id]; }).length;
      score.innerHTML = nd + ' of ' + n + ' done · <b>' + nf + '</b> right first time';
    }

    function preview(c) {
      var spec = Object.assign({}, PREV, c.spec);
      return h('div', { class: 'wd-graph-chooser__prev' }, [
        h('div', { class: 'wd-graph-chooser__pk', text: '✔ Drawn as a ' + TYPES.filter(function (t) { return t.id === c.ans; })[0].name.toLowerCase() }),
        h('div', { html: WUL.plot(spec) })
      ]);
    }

    function draw() {
      paintTop();
      body.innerHTML = '';
      var c = C[i];
      var card = h('div', { class: 'wd-graph-chooser__card' });
      var data = h('div', { class: 'wd-graph-chooser__data' });
      data.appendChild(h('div', { class: 'wd-graph-chooser__n', text: 'Experiment ' + (i + 1) + ' of ' + n }));
      data.appendChild(h('p', { class: 'wd-graph-chooser__q', html: md(c.q, { inline: true }) }));
      data.appendChild(h('div', { html: WUL.table(Object.assign({}, c.table, { head: [c.table.head[0].map(nb)] })) }));
      var pick = h('div', { class: 'wd-graph-chooser__pick' });
      pick.appendChild(h('div', { class: 'wd-k', text: 'Which graph?' }));
      var opts = h('div', { class: 'wd-graph-chooser__opts' });
      TYPES.forEach(function (t) {
        var b = h('button', { type: 'button', class: 'wd-graph-chooser__opt', 'data-t': t.id, html: icons[t.id] + '<span>' + esc(t.name) + '</span>' });
        opts.appendChild(b);
      });
      pick.appendChild(opts);
      card.appendChild(data); card.appendChild(pick);
      var fb = h('div', { class: 'wd-graph-chooser__fb', 'aria-live': 'polite' });
      var prevHost = h('div');
      var foot = h('div', { class: 'wd-graph-chooser__foot' });
      var back = h('button', { type: 'button', class: 'btn btn--ghost', text: '← Previous' });
      var next = h('button', { type: 'button', class: 'btn btn--go', text: i === n - 1 ? 'See your score →' : 'Next experiment →' });
      back.disabled = i === 0;
      back.addEventListener('click', function () { if (i > 0) { i--; draw(); } });
      next.addEventListener('click', function () { if (i < n - 1) { i++; draw(); } else finish(); });
      foot.appendChild(back); foot.appendChild(next);
      body.appendChild(card); body.appendChild(fb); body.appendChild(prevHost); body.appendChild(foot);

      function settle(t) {
        opts.querySelectorAll('button').forEach(function (b) {
          var id = b.getAttribute('data-t');
          b.disabled = true;
          if (id === c.ans) b.classList.add('is-ok');
          else if ((picked[c.id] || {})[id]) b.classList.add('is-no');
        });
        fb.innerHTML = '';
        fb.appendChild(h('div', { class: 'fb fb--ok', html: '<span class="fb__k">✔ Right</span> ' + md(c.why, { inline: true }) }));
        prevHost.innerHTML = '';
        prevHost.appendChild(preview(c));
      }
      if (done[c.id]) settle();
      else (Object.keys(picked[c.id] || {})).forEach(function (id) { var b = opts.querySelector('[data-t="' + id + '"]'); if (b) b.classList.add('is-no'); });

      opts.addEventListener('click', function (e) {
        var b = e.target.closest('.wd-graph-chooser__opt'); if (!b || b.disabled || done[c.id]) return;
        var id = b.getAttribute('data-t');
        if (id === c.ans) { done[c.id] = true; settle(); paintTop(); return; }
        tried[c.id] = true; (picked[c.id] = picked[c.id] || {})[id] = true;
        b.classList.add('is-no');
        fb.innerHTML = '';
        fb.appendChild(h('div', { class: 'fb fb--no', html: '<span class="fb__k">✘ Not a ' + esc(TYPES.filter(function (t) { return t.id === id; })[0].name.toLowerCase()) + '.</span> ' + md(NOT[c.ans][id], { inline: true }) + ' Try again.' }));
      });
    }

    function finish() {
      paintTop();
      var nd = C.filter(function (c) { return done[c.id]; }).length;
      var nf = C.filter(function (c) { return done[c.id] && !tried[c.id]; }).length;
      body.innerHTML = '';
      var end = h('div', { class: 'wd-graph-chooser__end' });
      end.innerHTML = '<b>' + nf + '</b> <span class="muted">of ' + n + ' right first time</span>' +
        (nd < n ? '<p class="hint">' + (n - nd) + ' experiment' + (n - nd === 1 ? ' is' : 's are') + ' not done yet: tap a number above.</p>' : '') +
        '<p>The rule: <u>categories</u> → bar chart · <u>ranges, counted</u> → histogram · <u>values you set</u> → line graph · <u>both measured</u> → scatter graph.</p>';
      body.appendChild(end);
      var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start again ↺' });
      again.addEventListener('click', function () { tried = {}; done = {}; picked = {}; i = 0; draw(); });
      body.appendChild(h('div', { class: 'wd-graph-chooser__foot' }, [again]));
    }
    draw();
  });

  var tool = { name: 'graph-chooser', title: 'Which graph?', blurb: 'Choose bar chart, histogram, line graph or scatter graph for eight experiments.', station: 'graphs', lv: 'gie', icon: '▥' };
  if (WUL.tool) WUL.tool(tool); else (WUL.TOOLS = WUL.TOOLS || []).push(tool);
})(window.WUL);
