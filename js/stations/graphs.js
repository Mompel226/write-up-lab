/* station: graphs — choose the right graph, draw it to scale, caption it. IGCSE → IA → EE.
   Every graph here is drawn by WUL.plot from WUL.data, so it matches the tables on every other page.

   Three visuals (the walkthrough stage, the anatomy and the "which type" compare) combine WUL.plot
   with a table or with numbered pins. They are built when the page draws them, not when this file
   loads, because tools/check.mjs loads this file without plot.js: see lazy() below. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase, S = WUL.data.soils, G0 = A.g;
  var md = WUL.md;

  function pts(xs, ys) { return xs.map(function (x, i) { return [x, ys[i]]; }); }
  /* an {html} visual that is only built in the page; the stub lets check.mjs read its data-el / data-part names */
  function lazy(build, names) {
    var stub = (names || []).map(function (n) { return '<i ' + n + '></i>'; }).join('');
    return { get html() { return typeof WUL.plot === 'function' ? build() : stub; } };
  }

  var CSS =
    '.wd-graphs-anat .plot{max-width:520px;margin:0 auto}' +
    '.wd-graphs-anat .pl-cap{text-align:center;max-width:520px;margin:6px auto 0}' +
    '.wd-graphs-anat svg [data-part]{transition:opacity .15s}' +
    '.anat.is-isolating .wd-graphs-anat svg [data-part]:not(.is-lit){opacity:.2}' +
    '.wd-graphs-anat svg g[data-el].is-lit{filter:drop-shadow(0 0 3px rgba(255,200,0,.95)) drop-shadow(0 0 6px rgba(255,200,0,.6))}' +
    '.wd-graphs-anat__pin{cursor:pointer}' +
    '.wd-graphs-anat__pin line{stroke:var(--ink-2);stroke-width:1.2}' +
    '.wd-graphs-anat__pin circle{fill:var(--ink-2)}' +
    '.wd-graphs-anat__pin rect{stroke-width:1.2}' +
    '.wd-graphs-anat__pin text{font:700 12.5px var(--mono)}' +
    '.wd-graphs-anat__pin.is-lit rect{stroke-width:2.6}' +
    [1, 2, 3, 4, 5].map(function (n) { return '.wd-graphs-anat__pin--' + n + ' rect{fill:var(--p' + n + ');stroke:var(--p' + n + 'k)}.wd-graphs-anat__pin--' + n + ' text{fill:var(--p' + n + 'k)}'; }).join('') +
    '.wd-graphs-pair{display:grid;gap:18px}' +
    '.wd-graphs-pair .plot{max-width:420px}' +
    '.wd-graphs-step{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto);gap:22px;align-items:start}' +
    '.wd-graphs-step .plot{max-width:540px}' +
    '.wd-graphs-step__t table.dt{font-size:.84rem;width:auto}' +
    '.wd-graphs-step__t table.dt caption{font-size:.86rem;padding-bottom:6px}' +
    '.wd-graphs-step__t table.dt td,.wd-graphs-step__t table.dt th{padding:5px 9px}' +
    '@media (max-width:760px){.wd-graphs-step{grid-template-columns:1fr;gap:12px}.wd-graphs-step__t{order:-1}}';
  function css() { WUL.css('graphs-station', CSS); }

  /* ---------- the running example as a graph ---------- */
  function amySpec(ib, extra) {
    var D = ib ? A.i : A.g;
    return Object.assign({
      x: { min: 20, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
      y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' },
      /* IGCSE: ruled point to point. IB: one smooth curve, because biology predicts the shape (a rise to an optimum, then a fall) */
      series: [{ id: 'm', pts: pts(D.temps, D.means), line: ib ? 'smooth' : 'ruled', err: ib ? D.sds : null }]
    }, extra || {});
  }
  var CAP_G = 'Figure 1. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.';
  /* \u00a0 (no-break space) keeps "n = 5" and "± 1 SD" on one line */
  var CAP_I = 'Figure 1. Line graph showing the effect of temperature (20.0–60.0 °C) on the mean time taken for fungal α-\u2060amylase to digest starch (n\u00a0=\u00a05; error bars = ±\u00a01\u00a0SD).';

  /* (b) the walkthrough stage: the table the graph comes from, above the graph itself.
         Square grid: 20 small squares each way, 17 units each. */
  function stepStage(ib) {
    css();
    var D = ib ? A.i : A.g;
    var head = [{ t: 'Temperature / °C', el: 'th-x' }, { t: 'Mean time / s', el: 'th-y' }];
    if (ib) head.push({ t: 'SD / s', el: 'th-sd' });
    var rows = D.temps.map(function (t, k) { var r = [String(t), String(D.means[k])]; if (ib) r.push(D.sds[k].toFixed(1)); return r; });
    var table = WUL.table({ caption: ib ? 'The means and SDs from Table 2' : 'The means from Table 1', head: [head], rows: rows });
    var plot = WUL.plot(amySpec(ib, { w: 440, h: 422, pad: { l: 70, r: 30, t: 18, b: 64 }, caption: ib ? CAP_I : CAP_G }));
    return '<div class="wd-graphs-step">' + plot + '<div class="wd-graphs-step__t">' + table + '</div></div>';
  }
  var STEP_ELS = ['paper', 'axis-x', 'axis-y', 'label-x', 'label-y', 'ticks-x', 'ticks-y', 'pts-m', 'line-m', 'err-m', 'caption', 'th-x', 'th-y', 'th-sd']
    .map(function (e) { return 'data-el="' + e + '"'; });

  /* (c) the anatomy: a finished graph, each part tagged data-part="n" for the legend, with a
         numbered pin at the part's own height. Every leader is ruled horizontally, so no two can cross. */
  function anatomy(ib) {
    css();
    var W = 480, L = 84, T = 18, P = 320, H = T + P + 64;          /* square grid: 16 units per small square */
    var spec = amySpec(ib, { w: W, h: H, pad: { l: L, r: W - L - P, t: T, b: 64 } });
    var sc = WUL.plotScale(spec), px = sc.px, py = sc.py;
    var D = ib ? A.i : A.g;
    var svg = WUL.plot(spec);
    var parts = { 'axis-x': 1, 'label-x': 1, 'axis-y': 2, 'label-y': 2, 'ticks-x': 3, 'ticks-y': 3, 'pts-m': 4 };
    parts[ib ? 'err-m' : 'line-m'] = 5;
    Object.keys(parts).forEach(function (el) {
      svg = svg.replace('data-el="' + el + '"', 'data-el="' + el + '" data-part="' + parts[el] + '"');
    });
    /* a pin: a numbered badge at (bx, y); if ax is given, a ruled horizontal leader runs from the part (ax) to the badge */
    function pin(n, bx, y, ax) {
      var s = '<g class="wd-graphs-anat__pin wd-graphs-anat__pin--' + n + '" data-part="' + n + '">';
      if (ax != null) {
        var edge = bx > ax ? bx - 11 : bx + 11;
        s += '<line x1="' + ax.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + edge.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><circle cx="' + ax.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.2"/>';
      }
      return s + '<rect x="' + (bx - 11).toFixed(1) + '" y="' + (y - 11).toFixed(1) + '" width="22" height="22" rx="4"/>' +
        '<text x="' + bx.toFixed(1) + '" y="' + (y + 4.5).toFixed(1) + '" text-anchor="middle">' + n + '</text></g>';
    }
    var right = L + P + 34, left = 38, i60 = D.temps.length - 1;
    var pins =
      pin(1, right, H - 16.5, L + P / 2 + 64) +                           /* x-axis label: leader from the end of the words */
      pin(2, left, py(87.5)) +                                             /* y-axis label: badge beside the words, between two numbers */
      pin(3, left, py(200)) + pin(3, right, T + P + 15, px(60) + 10) +     /* the scales: beside 200, and after 60 */
      pin(4, right, py(D.means[i60]), px(60) + 8);                         /* the cross at 60 °C */
    if (ib) pins += pin(5, right, py(D.means[3] - D.sds[3]), px(50) + 8);  /* the lower cap of the 50 °C error bar */
    else pins += pin(5, right, py((D.means[3] + D.means[4]) / 2), px(55) + 3); /* the ruled line between 50 and 60 °C */
    svg = svg.replace('</svg>', pins + '</svg>');
    var cap = '<figcaption class="pl-cap">' + md('{6:' + (ib ? CAP_I : CAP_G) + '}', { inline: true }) + '</figcaption>';
    return '<div class="wd-graphs-anat">' + svg.replace('</figure>', cap + '</figure>') + '</div>';
  }
  var ANAT_PARTS = [1, 2, 3, 4, 5, 6].map(function (n) { return 'data-part="' + n + '"'; });

  /* (d) categories get bars, numbers get a line: each side shows the soils and the amylase data */
  var SMALL = { w: 380, h: 262, pad: { l: 60, r: 14, t: 12, b: 50 } };
  function soilsBar(extra) {
    return Object.assign({}, SMALL, {
      x: { cat: S.labels, label: 'Soil' }, y: { min: 0, max: 50, step: 10, minor: 5, label: 'Mean height / cm' },
      bars: { items: S.labels.map(function (l, i) { return { label: l, v: S.means[i] }; }) }
    }, extra || {});
  }
  function typePair(right) {
    css();
    var soils, amy;
    if (right) {
      soils = soilsBar({ caption: 'Figure 1. Bar chart showing the effect of soil type on the mean height of bean seedlings after 21 days.' });
      amy = amySpec(false, Object.assign({}, SMALL, { caption: 'Figure 2. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.' }));
    } else {
      soils = Object.assign({}, SMALL, {
        x: { cat: S.labels, label: 'Soil' }, y: { min: 0, max: 50, step: 10, minor: 5, label: 'Mean height / cm' },
        series: [{ id: 's', pts: S.means.map(function (m, i) { return [i + 0.5, m]; }), line: 'ruled' }],
        caption: 'Figure 1. Line graph showing the effect of soil type on the mean height of bean seedlings after 21 days.'
      });
      amy = Object.assign({}, SMALL, {
        x: { cat: A.g.temps.map(String), label: 'Temperature / °C' }, y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' },
        bars: { items: A.g.temps.map(function (t, i) { return { label: String(t), v: A.g.means[i] }; }) },
        caption: 'Figure 2. Bar chart showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.'
      });
    }
    return '<div class="wd-graphs-pair">' + WUL.plot(soils) + WUL.plot(amy) + '</div>';
  }


  /* (f) a line graph far from zero: mean pulse rate after exercise. Three ways to draw the y-axis. */
  var PULSE_T = [0, 1, 2, 3, 4, 5], PULSE = [128, 112, 98, 88, 80, 76];
  var CAP_P = 'Figure 1. Line graph showing the effect of time after exercise (0–5 min) on the mean pulse rate of ten students.';
  function pulse(y) {
    return { w: 320, h: 270, pad: { l: 58, r: 12, t: 12, b: 50 }, axisBreak: !!y.zig,
      x: { min: 0, max: 5, step: 1, minor: 5, label: 'Time after exercise / min' },
      y: { min: y.min, max: y.max, step: y.step, minor: 5, label: 'Mean pulse rate / beats per min', fmt: y.zig ? function (v) { return v === y.min ? '0' : String(v); } : null },
      series: [{ id: 'p', pts: pts(PULSE_T, PULSE), line: 'ruled' }], caption: CAP_P };
  }
  var PULSE_ZERO = pulse({ min: 0, max: 140, step: 20 });
  var PULSE_ZIG = pulse({ min: 60, max: 130, step: 10, zig: true });
  var PULSE_70 = pulse({ min: 70, max: 130, step: 10 });

  /* (g) how to join the points: the IGCSE amylase means, three ways */
  var SMALL_LINE = { w: 320, h: 270, pad: { l: 58, r: 12, t: 12, b: 50 } };
  var LINE_BEST = amySpec(false, Object.assign({}, SMALL_LINE, { key: true, keyAt: 'tr', caption: CAP_G,
    series: [{ id: 'm', pts: pts(G0.temps, G0.means), line: 'none' }, { id: 'f', pts: pts(G0.temps, G0.means), line: 'best', mark: 'none', label: 'R² = 0.59' }] }));
  var LINE_BOTH = amySpec(false, Object.assign({}, SMALL_LINE, { caption: CAP_G,
    series: [{ id: 'm', pts: pts(G0.temps, G0.means), line: 'ruled' }, { id: 'f', pts: pts(G0.temps, G0.means), line: 'best', mark: 'none', dash: true }] }));
  var LINE_RULED = amySpec(false, Object.assign({}, SMALL_LINE, { caption: CAP_G }));

  /* (h) IB: a spreadsheet polynomial through five means, R² = 1.000 (order 4 through 5 points: always exact) */
  var POLY = amySpec(true, { w: 440, h: 330, pad: { l: 66, r: 16, t: 14, b: 56 }, key: true, keyAt: 'tr', caption: CAP_I,
    series: [{ id: 'm', pts: pts(A.i.temps, A.i.means), line: 'smooth', err: A.i.sds, label: 'Poly. (order 4): R² = 1.000' }] });
  var POLY_FIX = amySpec(true, { w: 440, h: 330, pad: { l: 66, r: 16, t: 14, b: 56 }, caption: CAP_I });

  /* (i) the maths habit on a bar chart: 0 at the corner, a zigzag, then 42.5 */
  var Q_ZIG = soilsBar({ w: 420, h: 280, axisBreak: true, tickDp: 1,
    y: { min: 42, max: 44.5, step: 0.5, minor: 5, label: 'Mean height / cm', fmt: function (v) { return v === 42 ? '0' : v.toFixed(1); } },
    caption: 'Figure 2. Bar chart showing the effect of soil type on the mean height of bean seedlings after 21 days.' });

  /* ---------- red pen graphs ---------- */
  var G = A.g, I = A.i;
  var RP_G = {
    w: 540, h: 400, title: 'Graph 1', pad: { l: 80, r: 24, t: 44, b: 58 },
    /* one large square per 10 °C, all the way across the grid. The 0 is written once, on the y-axis, and the
       last line is not numbered: so the red ring round the numbers passes clear of every digit. */
    x: { min: 0, max: 150, step: 10, minor: 5, label: 'Temperature / °C', fmt: function (v) { return v > 0 && v < 150 ? String(v) : ''; } },
    y: { min: 0, max: 200, step: 50, minor: 5, label: 'Time' },
    series: [
      { id: 'o1', pts: [[0, 0], [10, G.means[0] / 2]], line: 'free', mark: 'none' },          /* drawn on to the origin */
      { id: 'o2', pts: [[10, G.means[0] / 2], [20, G.means[0]]], line: 'free', mark: 'none' },
      { id: 'fa', pts: pts(G.temps.slice(0, 3), G.means.slice(0, 3)), line: 'free', mark: 'none' },
      { id: 'fb', pts: pts(G.temps.slice(2), G.means.slice(2)), line: 'free', mark: 'none' },
      { id: 'p', pts: [0, 2, 3, 4].map(function (k) { return [G.temps[k], G.means[k]]; }), mark: 'blob' },
      { id: 'b', pts: [[G.temps[1], G.means[1]]], mark: 'blob' }
    ]
  };
  var RP_G_FIXED = {
    w: 540, h: 400, pad: { l: 80, r: 24, t: 20, b: 58 },
    x: { min: 0, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
    y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' },
    series: [{ id: 'm', pts: pts(G.temps, G.means), line: 'ruled' }],
    caption: '==' + CAP_G + '==', hl: ['label-y', 'ticks-x']
  };
  var RAW = [], RAW30 = [];
  I.trials.forEach(function (tr, k) { tr.forEach(function (v) { (k === 1 ? RAW30 : RAW).push([I.temps[k], v]); }); });
  function lo(k) { return I.means[k] - Math.min.apply(null, I.trials[k]); }
  function hi(k) { return Math.max.apply(null, I.trials[k]) - I.means[k]; }
  var RP_I = {
    w: 540, h: 400, pad: { l: 70, r: 24, t: 20, b: 58 },
    x: { min: 20, max: 70, step: 10, minor: 5, label: 'Temperature / °C' },
    y: { min: 0, max: 200, step: 50, minor: 5, label: 'Time / s' },
    series: [
      { id: 'rng', pts: [0, 1, 2, 4].map(function (k) { return [I.temps[k], I.means[k]]; }), mark: 'none', errLo: [0, 1, 2, 4].map(lo), errHi: [0, 1, 2, 4].map(hi) },
      { id: 'rng1', pts: [[I.temps[3], I.means[3]]], mark: 'none', errLo: [lo(3)], errHi: [hi(3)] },
      /* the raw trials as small dots, so each range bar reads as an I with its trials along it */
      { id: 'raw', pts: RAW, mark: 'dot' },
      { id: 'raw1', pts: RAW30, mark: 'dot' },
      { id: 'fit', pts: pts(I.temps, I.means), line: 'smooth', mark: 'none', label: 'Poly. trend (R² = 0.97)' },
      { id: 'ext', pts: [[60, I.means[4]], [68, I.means[4] + 35]], line: 'ruled', mark: 'none' }
    ],
    key: true, keyAt: 'tr'
  };
  var RP_I_FIXED = amySpec(true, {
    w: 540, h: 400, pad: { l: 70, r: 24, t: 20, b: 58 },
    caption: 'Figure 1. Line graph showing the effect of temperature (20.0–60.0 °C) on the mean time taken for fungal α-\u2060amylase to digest starch ==(n\u00a0=\u00a05; error bars = ±\u00a01\u00a0SD).==',
    hl: ['pts-m', 'err-m', 'label-y']
  });

  /* ---------- test graphs ---------- */
  var Q_ORIGIN = amySpec(false, {
    w: 460, h: 320, pad: { l: 62, r: 16, t: 14, b: 52 },
    x: { min: 0, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
    series: [{ id: 'm', pts: pts(G.temps, G.means), line: 'ruled', extend: [0], extendY: [0] }],
    caption: 'Figure 1. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.'
  });
  var Q_TOUCH = soilsBar({ w: 420, h: 280, bars: { touch: true, items: S.labels.map(function (l, i) { return { label: l, v: S.means[i] }; }) }, caption: 'Figure 2. Bar chart showing the effect of soil type on the mean height of bean seedlings after 21 days.' });

  WUL.station({
    id: 'graphs', stage: 'show', order: 1, title: 'Graphs', levels: 'gie',
    job: {
      g: 'Turn the results table into a picture that shows the pattern clearly.',
      i: 'Turn the processed data into a picture that shows the pattern, and how far it can be trusted.',
      e: 'Show the analysis in numbered figures, with the one that answers the research question first.'
    },
    where: { g: 'In the results, straight after the table.', i: 'In the data analysis, after the processed-data table.', e: 'In the body of the essay, next to the analysis it supports.' },

    ladder: {
      g: ['Choose the type: [[bar chart]], [[histogram]], [[line graph]] or [[scatter graph]]',
        'The [[independent variable]] on the x-axis; both axes labelled __quantity / unit__, as in the table',
        'An even [[scale]] (1, 2, 5 or 10 per large square); the points fill more than half the grid',
        'Small crosses; ruled lines point to point, never beyond the first and last points; a [[key]] for two data sets',
        'A title below: “Figure 1. Line graph showing the effect of … on …”'],
      i: ['Plot the [[processed data]] (means) with [[error bars|error bar]]; the caption says which kind',
        'A [[line of best fit]] or curve only when theory justifies its shape',
        '[[R²|coefficient of determination]] only for a fitted trend line',
        'Axis labels match the processed-data table headings'],
      e: ['Numbered figures in the body of the essay', 'Statistics where appropriate', 'The graph that answers the question comes first']
    },

    build: [
      { type: 'compare', title: 'Choose the type of graph',
        badLabel: 'Wrong type: a line for soils, bars for temperature', goodLabel: 'Right type: bars for soils, a line for temperature',
        bad: lazy(function () { return typePair(false); }), good: lazy(function () { return typePair(true); }),
        why: 'Soil is a [[categorical variable]]: there is no soil halfway between A and B, so a line between them means nothing. Temperature is a [[continuous variable]]: 35 °C exists, so a line shows the trend between the points.' },

      { type: 'widget', title: 'Practise choosing the graph', name: 'graph-chooser' },

      { type: 'steps', lv: 'g', title: 'Draw a line graph',
        intro: 'The data are the means from the amylase table. Press __Next step__ to add one part at a time.',
        stage: lazy(function () { return stepStage(false); }, STEP_ELS), always: ['th-x', 'th-y'],
        steps: [
          { title: 'Graph paper, a sharp pencil and a ruler', text: 'Plan a graph that fills __more than half__ the grid in both directions.', show: ['paper'] },
          { title: 'Draw the two axes', text: 'Plot the [[independent variable]] on the x-axis, across. Plot the [[dependent variable]] on the y-axis, upwards.', show: ['axis-x', 'axis-y'] },
          { title: 'Label the x-axis', text: 'Copy the [[column heading]] exactly: ==Temperature / °C==. The quantity, a solidus (/), then the unit.', show: ['label-x'], focus: ['label-x', 'th-x'] },
          { title: 'Label the y-axis', text: '==Mean time / s==. The points are means, so the label says __mean__.', show: ['label-y'], focus: ['label-y', 'th-y'] },
          { title: 'Number the x-axis', text: 'An even [[scale]]: 10 °C per large square. This [[axis]] starts at 20, so the first number is __20__, not 0.', show: ['ticks-x'] },
          { title: 'Number the y-axis', text: '0 to 200 s, 50 s per large square. The highest mean, 180 s, fits, and the points fill most of the grid.', show: ['ticks-y'] },
          { title: 'Plot small crosses', text: 'One small cross (×) for each mean, centred exactly on its value. Plot 117 s just below the 120 s line.', show: ['pts-m'] },
          { title: 'Join with ruled lines', text: 'Rule a straight line from each cross to the next. Start at the first cross and stop at the last. Never [[extrapolate]] to the origin.', show: ['line-m'] },
          { title: 'Write the title below', text: 'The figure number, the type of graph, then both variables: ==Figure 1. Line graph showing the effect of== temperature (20–60 °C) ==on== the mean time… It goes below the graph, not above it.', show: ['caption'] }
        ] },

      { type: 'steps', lv: 'ie', title: 'Draw an IA graph',
        intro: 'The data are the processed means and standard deviations for fungal α-amylase. Press __Next step__ to add one part at a time.',
        stage: lazy(function () { return stepStage(true); }, STEP_ELS), always: ['th-x', 'th-y', 'th-sd'],
        steps: [
          { title: 'Graph paper, or a spreadsheet', text: 'Plan a graph that fills __more than half__ the grid in both directions.', show: ['paper'] },
          { title: 'Draw the two axes', text: 'Plot the [[independent variable]] on the x-axis. Plot the [[dependent variable]] on the y-axis.', show: ['axis-x', 'axis-y'] },
          { title: 'Label the x-axis', text: 'Copy the processed-data table heading: ==Temperature / °C==.', show: ['label-x'], focus: ['label-x', 'th-x'] },
          { title: 'Label the y-axis', text: '==Mean time / s==, word for word from the processed-data table.', show: ['label-y'], focus: ['label-y', 'th-y'] },
          { title: 'Number the x-axis', text: 'An even [[scale]]: 10 °C per large square. This [[axis]] starts at 20, so the first number is __20__.', show: ['ticks-x'] },
          { title: 'Number the y-axis', text: '0 to 200 s. The highest mean plus its SD, 186 s, still fits.', show: ['ticks-y'] },
          { title: 'Plot the means', text: 'Plot the [[processed data]]: one small cross for each mean of five trials, not the 25 raw times.', show: ['pts-m'] },
          { title: 'Add the error bars', text: '± 1 [[SD|standard deviation]] at each mean, from the SD column of the table: a vertical line with a short cap at each end.', show: ['err-m'], focus: ['err-m', 'th-sd'] },
          { title: 'Draw a smooth curve', text: 'Biology predicts the shape: the rate rises to an optimum, then falls as the enzyme denatures. So draw one thin, smooth curve through the trend, from the first mean to the last. With no expected shape, join the means with ruled lines instead.', show: ['line-m'] },
          { title: 'Write the title below', text: '“Figure 1. Line graph showing the effect of … on …”, then n and the bars: ==(n = 5; error bars = ± 1 SD)==. The reader cannot tell SD from SE by looking.', show: ['caption'] }
        ] },

      { type: 'anatomy', lv: 'g', title: 'The parts of a graph', intro: 'Tap a number to highlight that part of the graph.',
        model: lazy(function () { return anatomy(false); }, ANAT_PARTS),
        parts: [
          { n: 1, name: 'x-axis: the independent variable', note: 'Labelled __quantity / unit__, exactly as the table heading.' },
          { n: 2, name: 'y-axis: the dependent variable', note: '“Mean time / s”: write __mean__ when the points are means.' },
          { n: 3, name: 'Even scales', note: '10 °C and 50 s per large square. The x-axis starts at 20, and its first number shows it.' },
          { n: 4, name: 'Small crosses', note: 'Each cross is centred on its value, within half a small square.' },
          { n: 5, name: 'Ruled lines, point to point', note: 'From the first cross to the last. Nothing beyond them.' },
          { n: 6, name: 'Title below (the caption)', note: 'Figure 1, the type of graph, then both variables. Our rule: every graph has one, in the same pattern.' }
        ] },

      { type: 'anatomy', lv: 'ie', title: 'The parts of an IA graph', intro: 'Tap a number to highlight that part of the graph.',
        model: lazy(function () { return anatomy(true); }, ANAT_PARTS),
        parts: [
          { n: 1, name: 'x-axis: the independent variable', note: '“Temperature / °C”, as in the processed-data table.' },
          { n: 2, name: 'y-axis: the processed data', note: '“Mean time / s”: the table heading, word for word.' },
          { n: 3, name: 'Even scales', note: '10 °C and 50 s per large square. The x-axis starts at 20, and its first number shows it.' },
          { n: 4, name: 'The means, as small crosses', note: 'One cross per temperature: the mean of five trials, not the raw times.' },
          { n: 5, name: 'Error bars', note: '± 1 SD at each mean, calculated from the five trials, with a cap at each end. The smooth curve runs through them.' },
          { n: 6, name: 'Title below (the caption)', note: 'Figure 1, the type of graph, both variables, then n and the error bars. Without that, the bars mean nothing.' }
        ] },

      { type: 'anatomy', lv: 'g', title: 'The parts of a figure title',
        intro: 'Every graph title follows the same pattern. Tap a colour to see each part.',
        model: '{1:Figure 1.} {2:Line graph} {3:showing the effect of} {4:temperature (20–60 °C)} {3:on} {5:the mean time taken for amylase to digest starch}.',
        parts: [
          { n: 1, name: 'Number', note: 'Figure 1, Figure 2 … in order. Tables and figures are numbered separately.' },
          { n: 2, name: 'Type of graph', note: '__Line graph__, __Bar chart__, __Scatter graph__ or __Histogram__.' },
          { n: 3, name: 'The joining words', note: '“showing the effect of … on …”: the same words in every title.' },
          { n: 4, name: 'Independent variable, with its range', note: 'The x-axis: what you changed, from the lowest to the highest value.' },
          { n: 5, name: 'Dependent variable', note: 'The y-axis: what you measured. Say __mean__ if the points are means.' }
        ],
        after: 'The title goes __below__ the graph. A table’s title goes above the table.' },

      { type: 'anatomy', lv: 'ie', title: 'The parts of an IA figure title',
        intro: 'The same pattern as at IGCSE, with n and the error bars at the end. Tap a colour to see each part.',
        model: '{1:Figure 1.} {2:Line graph} {3:showing the effect of} {4:temperature (20.0–60.0 °C)} {3:on} {5:the mean time taken for fungal α-amylase to digest starch} {6:(n = 5; error bars = ± 1 SD)}.',
        parts: [
          { n: 1, name: 'Number', note: 'Figure 1, Figure 2 … in order. Tables and figures are numbered separately.' },
          { n: 2, name: 'Type of graph', note: '__Line graph__, __Bar chart__, __Scatter graph__, __Histogram__, __Box-and-whisker plot__ or __Dot plot__ (means as crosses above categories).' },
          { n: 3, name: 'The joining words', note: '“showing the effect of … on …”. For two measured variables: “showing the relationship between … and …”.' },
          { n: 4, name: 'Independent variable, with its range', note: 'The x-axis: what you changed, and its range.' },
          { n: 5, name: 'Dependent variable', note: 'The y-axis: what you measured or calculated, and in what system.' },
          { n: 6, name: 'n and the error bars', note: 'How many trials each mean comes from, and what the bars show: range, SD or SE.' }
        ] },

      { type: 'widget', title: 'Plot the points yourself', name: 'plot-points' },

      { type: 'rules', title: 'How to draw the line', items: [
        '__Line graph__: join the points with ruled straight lines, __point to point__ (dot to dot).',
        'Start at the first point and stop at the last. Never go beyond them, and never to the origin unless (0, 0) is one of your results.',
        { t: 'Draw a __line of best fit__ only when the question asks for one: one thin straight line or smooth curve, with the points spread evenly on both sides.', lv: 'g' },
        { t: 'Never both kinds of line on one graph.', lv: 'g' },
        { t: 'No R² at IGCSE. It is not part of the syllabus.', lv: 'g' },
        '__Scatter graph__: never join the points in order. Draw one line of best fit, or no line.',
        { t: 'At IB: plot the means with error bars. When biology tells you the shape, draw one smooth curve or straight line of best fit through the trend: an enzyme’s optimum, or osmosis in potato.', lv: 'ie' },
        { t: 'Join the means point to point only when you have no reason to expect a shape.', lv: 'ie' },
        { t: 'Quote [[R²|coefficient of determination]] only for a line or curve that comes from an equation fitted to the data. A curve you draw by hand, or means joined point to point, have no R².', lv: 'ie' },
        { t: 'In a spreadsheet, never choose a “smoothed line”, or a polynomial with enough bends to pass through every mean.', lv: 'ie' }
      ] },

      { type: 'grid2', lv: 'g', title: 'Three ways to join the same points',
        items: [
          { label: '✘ A line of best fit, with R²', tone: 'red', v: { plot: LINE_BEST }, note: 'Not asked for, and the wrong shape: a straight line hides the minimum at 50 °C. R² is not part of IGCSE.' },
          { label: '✘ Point to point AND a best-fit line', tone: 'red', v: { plot: LINE_BOTH }, note: 'Two lines on one graph. Examiners say: avoid it.' },
          { label: '✔ Ruled lines, point to point', tone: 'g', v: { plot: LINE_RULED }, note: 'What Cambridge advises unless the question asks for a line of best fit.' }
        ] },

      { type: 'compare', lv: 'ie', title: 'R² = 1.000 proves nothing',
        bad: { plot: POLY }, good: { plot: POLY_FIX },
        badLabel: 'The same curve, with R² = 1.000', goodLabel: 'A smooth curve through the trend: no R²',
        why: 'The curve is fine: biology predicts a rise to an optimum, then a fall. The R² is the mistake. A spreadsheet’s order-4 polynomial has enough bends to pass through any five points, so its R² is __always__ 1.000, and that says nothing about your data. Quote R² only for a trend line the points could have missed, such as the straight line through the potato osmosis data (R² = 0.99, on the Statistics page).' },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'At IB', title: 'What the IB guide says about lines',
        md: 'The command term __Draw__: points “joined in a straight line or smooth curve”.\n__Tool 3__: “Draw lines or curves of best fit”, and “Apply the coefficient of determination (R²) to evaluate the fit of a trend line”.\n\nThat is all the guide says. So in an IA, when biology predicts the shape, draw one smooth curve or straight line of best fit through the trend: a rise to an optimum and a fall for an enzyme, a straight line for osmosis in potato. Join the means point to point only when you have no reason to expect a shape. Quote R² only for a line that comes from a fitted equation, such as the potato line; never for a curve drawn by hand. The EE guide adds nothing about graphs: the same rules apply.\n\nWith five temperatures 10 °C apart, the optimum lies __between__ 40 and 60 °C. The curve does not tell you exactly where; more temperatures around the peak would.' },


      { type: 'rules', title: 'Does the axis start at zero?', items: [
        '__Bar chart or histogram__: the y-axis starts at __0__. Always. A bar shows its value by its length.',
        '__Line or scatter graph__: start at 0 if your points then fill more than half the grid.',
        'If starting at 0 would squash the points into a small part of the grid, start at a round number just below your lowest value, such as 70.',
        'Write that first number at the corner, then keep even steps: 70, 80, 90…',
        '__No zigzag.__ If an axis starts at 70, write 70. Never write 0 at the corner and then jump.',
        'The x-axis often starts at 0 anyway, because 0 is one of your values: 0 min, or 0.0 mol dm⁻³.',
        { t: 'The same at IB. The IB guide asks only for “appropriate scales and axes”.', lv: 'ie' }
      ] },

      { type: 'widget', title: 'See how a cut axis fools you', name: 'axis-start' },

      { type: 'grid2', title: 'A line graph far from zero',
        items: [
          { label: '✘ Starts at 0: the points are squashed', tone: 'red', v: { plot: PULSE_ZERO }, note: 'The pulse rates, 76 to 128, spread over only about a third of the grid’s height. Cambridge wants the points to fill more than half.' },
          { label: '✘ 0, a zigzag, then 70', tone: 'red', v: { plot: PULSE_ZIG }, note: 'The first step is not to scale: one square stands for 70, the others for 10. You never need the zigzag.' },
          { label: '✔ Starts at 70, and says so', tone: 'g', v: { plot: PULSE_70 }, note: '70 is written at the corner, the steps are even, and the points fill most of the grid.' }
        ] },

      { type: 'note', tone: 'igcse', label: 'What Cambridge says', title: 'Zero, and the zigzag',
        md: '“The axes do not have to include (0, 0)” (0610 syllabus 2026–2028, p. 56). The points must fill more than half the grid, on an even scale. An examiner report adds that it must be clear where a scale starts: a clearly marked jump from 0 is accepted. You never need that jump. Write the first number instead.\n\nFor bar charts, Cambridge’s A Level guide says the scale “should usually start at 0”. Our rule is stricter: always.' },

      { type: 'widget', title: 'Find the faults in a graph', name: 'graph-doctor' },

      { type: 'rules', title: 'Rules for every graph', items: [
        'The [[independent variable]] on the x-axis. Label both axes __quantity / unit__, as in the table.',
        'An even [[scale]]: 1, 2, 5 or 10 (or 20, 50…) per large square. Never 3s or 7s.',
        'The points fill __more than half__ the grid in both directions.',
        'A line or scatter graph may start above zero: write the first number at the corner (20, not 0). No zigzag.',
        'Small crosses (×), each within half a small square of its value.',
        'Ruled lines from point to point, unless a line of best fit is asked for. Stop at the first and last points: never to the origin.',
        'Two data sets need a [[key]].',
        '[[Bar chart]]: bars of equal width, with gaps, and the y-axis starts at 0. [[Histogram]]: the bars touch.',
        'The title goes __below__ the graph, always in the same pattern: “Figure 1. Line graph showing the effect of … on …”.',
        { t: 'Plot the means with [[error bars|error bar]], and name them in the caption: (n = 5; error bars = ± 1 SD).', lv: 'ie' }
      ] },

      { type: 'note', tone: 'igcse', lv: 'g', label: 'At IGCSE', title: 'What Cambridge marks',
        md: '__Axes__: the right way round, each with the quantity and the unit.\n__Scale__: even steps; the points cover more than half the grid.\n__Plotting__: every point within half a small square. Small crosses or circled dots; large dots are penalised.\n__Line__: ruled point to point, or one smooth line, never beyond the data.\n__Key__: needed for two data sets.\n\nA title is never a mark point in the exam. In your report, every graph still needs one.' },

      { type: 'frames', lv: 'g', title: 'Sentence frames for figure titles', items: [
        'Figure ___. Line graph showing the effect of ___ (___–___) on the mean ___.',
        'Figure ___. Bar chart showing the effect of ___ on the mean ___.'
      ] },
      { type: 'frames', lv: 'ie', title: 'Sentence frames for IA figure titles', items: [
        'Figure ___. Line graph showing the effect of ___ (___–___) on the mean ___ (n = ___; error bars = ± 1 SD).',
        'Figure ___. Bar chart showing the effect of ___ on the mean ___ (n = ___; error bars = ± 1 SD).',
        'Figure ___. Scatter graph showing the relationship between ___ and ___ in ___ (n = ___), with a line of best fit (R² = ___).'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student drew this graph from the amylase table. Tap each red ring to see what is wrong.',
        body: { plot: RP_G },
        notes: {
          a: { el: 'pts-b', label: 'blobs', lx: 192, ly: 160, anchor: 'start', why: 'A large dot hides the exact value, and large dots are penalised. Plot a __small cross__, centred on the value.' },
          b: { el: 'label-y', label: 'unit?', lx: 3, ly: 158, anchor: 'start', why: 'Give the quantity and the unit, as in the table: __Mean time / s__.' },
          c: { el: 'line-fb', label: 'use a ruler', lx: 282, ly: 244, anchor: 'start', why: 'A freehand line loses the mark. Join the crosses with __ruled__ straight lines.' },
          d: { el: 'line-o2', label: 'not measured', lx: 152, ly: 72, anchor: 'start', why: 'No result was taken at 0 °C. The line must start at the first point, 20 °C. Drawing to the origin is the most common graph error.' },
          e: { el: 'title', label: 'says nothing', lx: 340, ly: 28, anchor: 'start', why: '“Graph 1” tells the reader nothing. Write the title __below__ the graph: the number, the type of graph, then both variables. __Figure 1. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.__' },
          f: { el: 'ticks-x', label: 'half the grid?', lx: 330, ly: 300, anchor: 'start', why: 'The temperatures stop at 60 °C, but the axis continues to 150 °C, so the points fill less than half the grid. Use __0 to 60 °C__.' }
        },
        fixed: { plot: RP_G_FIXED },
        fixedNote: 'Small crosses, and ruled lines that stop at 20 °C and 60 °C. A unit on the y-axis, an x-axis that fills more than half the grid, and a title below that names the type of graph and both variables.'
      },
      i: {
        title: 'An IA graph made in a spreadsheet. Four marks would keep it out of the top band.',
        body: { plot: RP_I },
        notes: {
          a: { el: 'pts-raw1', label: 'means?', lx: 142, ly: 205, anchor: 'end', why: 'These are the 25 raw times, five at each temperature. Plot the [[processed data]]: one mean at each temperature.' },
          b: { el: 'err-rng1', label: '± what?', ly: 294, why: 'The bars are never named. A reader cannot tell range, SD and SE apart by looking. Say which in the caption: __error bars = ± 1 SD__.' },
          c: { el: 'key', label: 'R² for a curve?', why: 'A smooth curve suits this enzyme, but R² does not. R² belongs to an equation fitted to the data, and no biology predicts this polynomial: a curve with enough bends fits almost any five points. Keep the curve and leave R² out.' },
          d: { el: 'line-ext', label: 'beyond the data', why: 'No trial was done above 60 °C. The line must stop at the last mean.' }
        },
        fixed: { plot: RP_I_FIXED },
        fixedNote: 'One cross per mean, ± 1 SD bars named in the caption, one smooth curve that stops at 60 °C, and no R².'
      }
    },

    traps: [
      { bad: 'Large dots for the points.', good: 'Small crosses (×), each centred on its value.' },
      { bad: 'The line is drawn back to the origin.', good: 'The line starts at the first point and stops at the last.' },
      { bad: 'Axis label: “Time”.', good: 'Axis label: __Mean time / s__, as in the table heading.' },
      { bad: 'A scale in 3s, or points that fill less than half the grid.', good: '1, 2, 5 or 10 per large square, and points over more than half the grid.' },
      { bad: 'Two lines and no key.', good: 'A [[key]] that names each data set.' },
      { bad: '“Graph 1”, written above the graph.', good: 'Below the graph: Figure 1. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.' },
      { bad: '0 at the corner, a zigzag, then 40, 41, 42…', good: 'Start the axis at 40 and write 40 at the corner. A bar chart starts at 0.' },
      { bad: 'A bar chart whose y-axis starts at 42.5 cm.', good: 'The bars start at 0 cm, so their lengths match the values.' },
      { bad: 'A line of best fit with R², when the question asked for a line graph.', good: 'Ruled lines, point to point. No R² at IGCSE.', lv: 'g' },
            { bad: 'Error bars, but the caption never says what they are.', good: 'End the caption with (n = 5; error bars = ± 1 SD).', lv: 'ie' },
      { bad: 'A spreadsheet polynomial through every mean, with R² = 1.000.', good: 'A smooth curve through the trend with no R², or a fitted straight line with its R².', lv: 'ie' }
    ],

    test: [
      { type: 'choose', q: 'A class recorded the blood group of each student. Which graph should be drawn?',
        show: { table: { head: [['Blood group', 'Number of students']], rows: [['A', '9'], ['B', '6'], ['AB', '2'], ['O', '11']] } },
        opts: [
          { t: 'Bar chart', ok: true, why: 'Blood group is categorical: A, B, AB and O are separate groups, so the bars have gaps.' },
          { t: 'Histogram', why: 'Histogram bars touch because the ranges of a continuous variable meet. Blood groups are not ranges.' },
          { t: 'Line graph', why: 'There is nothing between group A and group B, so a line joining them means nothing.' },
          { t: 'Scatter graph', why: 'A scatter graph needs two measured numbers for each student.' }
        ] },
      { type: 'sort', q: 'Sort each investigation into the graph it needs.',
        bins: ['Bar chart', 'Histogram', 'Line graph', 'Scatter graph'],
        items: [
          { t: 'Mean mass of apples from four varieties of tree', bin: 0, why: 'Variety is a category.' },
          { t: 'Number of daisies per m² in four fields', bin: 0, why: 'Each field is a category.' },
          { t: 'Number of students in each 5 cm height range', bin: 1, why: 'Counts in ranges of a continuous variable: touching bars.' },
          { t: 'Volume of oxygen from pondweed at five light intensities', bin: 2, why: 'Light intensity was set, and it is continuous.' },
          { t: 'Rate of catalase activity at five pH values', bin: 2, why: 'pH was set, and it is continuous.' },
          { t: 'Length and mass of 20 earthworms', bin: 3, why: 'Both were measured; neither was set.' }
        ] },
      { type: 'choose', q: 'The results run from 20 °C to 60 °C. Must the x-axis start at 0 °C?',
        opts: [
          { t: 'No. It may start at 20 °C, if the first number on the axis is 20.', ok: true, why: 'Cambridge accepts an axis that does not start at zero, as long as the axis shows where it starts.' },
          { t: 'Yes. Every axis must start at 0.', why: 'Only a bar chart should start at 0 (our rule), because a bar shows its value by its length.' },
          { t: 'No, but the first number should still be 0.', why: 'A 0 at the start of an axis that begins at 20 makes the scale uneven.' },
          { t: 'Yes, so that the line can reach the origin.', why: 'Never draw the line to the origin, unless (0, 0) is a result.' }
        ] },
      { type: 'choose', q: 'The highest value to plot is 180 s. The y-axis has 10 large squares. Which scale is best?',
        opts: [
          { t: '20 s per large square (0 to 200 s)', ok: true, why: '180 s fits, the steps are easy to read, and the points fill more than half the grid.' },
          { t: '50 s per large square (0 to 500 s)', why: 'The points would fill less than half the grid.' },
          { t: '15 s per large square (0 to 150 s)', why: '180 s would not fit, and steps of 15 are hard to plot.' },
          { t: '30 s per large square (0 to 300 s)', why: 'Steps of 3 (30 s) lead to plotting errors. Use 1, 2 or 5 (× 10).' }
        ] },
      { type: 'choose', q: 'What is wrong with this graph?', show: { plot: Q_ORIGIN },
        opts: [
          { t: 'The line is drawn to the origin, where no result was taken.', ok: true, why: 'The line must start at the first point, 20 °C. This is the most common graph error in Cambridge reports.' },
          { t: 'The x-axis should start at 20 °C.', why: 'An axis may start at 0 or at 20. Starting at 0 is fine here.' },
          { t: 'The points should be dots.', why: 'Small crosses are the safest choice. Large dots are penalised.' },
          { t: 'The y-axis should run to 400 s.', why: 'Then the points would fill less than half the grid.' }
        ] },
      { type: 'choose', q: 'What is wrong with this bar chart?', show: { plot: Q_TOUCH },
        opts: [
          { t: 'The bars touch, but the soils are separate categories.', ok: true, why: 'Bars for categories have gaps between them. Touching bars are for a histogram.' },
          { t: 'The y-axis starts at 0.', why: 'That is right for a bar chart: a bar shows its value by its length.' },
          { t: 'There is no line joining the tops of the bars.', why: 'Bars for categories are never joined by a line.' },
          { t: 'Soil type should be on the y-axis.', why: 'Soil type is the independent variable, so it is plotted on the x-axis.' }
        ] },
      { type: 'choose', q: 'What is wrong with the y-axis of this bar chart?', show: { plot: Q_ZIG },
        opts: [
          { t: 'It jumps from 0 to 42.5 cm, so the bars are cut and the differences look far bigger than they are.', ok: true, why: 'Bar D looks more than twice as tall as bar A. The real means differ by 3 %. A bar chart starts at 0.' },
          { t: 'Nothing: the zigzag shows that the axis was cut.', why: 'The zigzag warns the reader, but people are still misled by cut bars, even when they see the cut.' },
          { t: 'The steps should be 1 cm, not 0.5 cm.', why: 'The steps are even. The problem is where the axis starts.' },
          { t: 'The zigzag should be on the x-axis.', why: 'Soil is a category, so the x-axis has no scale to cut. The y-axis should start at 0.' }
        ] },
      { type: 'choose', q: 'Your mean pulse rates run from 76 to 128 beats per min. The y-axis has 7 large squares. Which scale is best?',
        opts: [
          { t: 'Start at 70, with 10 per large square, and write 70 at the corner.', ok: true, why: 'The points fill most of the grid, and the scale is even from its first number.' },
          { t: 'Start at 0, with 20 per large square.', why: 'The points would sit in the top third of the grid: less than half.' },
          { t: 'Write 0 at the corner, draw a zigzag, then 70, 80, 90…', why: 'The first step is not to scale, and you never need the zigzag: just start at 70.' },
          { t: 'Start at 76, with 7.5 per large square.', why: 'Awkward steps are hard to plot. Use 1, 2 or 5 (× 10), from a round number.' }
        ] },
      { type: 'choose', lv: 'g', q: 'An exam question says: “Plot a line graph of these results.” How do you join the points?',
        opts: [
          { t: 'Ruled straight lines, point to point, from the first point to the last.', ok: true, why: 'Examiners advise point to point unless the question asks for a line of best fit.' },
          { t: 'A straight line of best fit, with its R².', why: 'A line of best fit was not asked for, and R² is not part of IGCSE.' },
          { t: 'Point to point, and a line of best fit as well.', why: 'Never both kinds of line on one graph.' },
          { t: 'A quick freehand line through the points.', why: 'A line that joins points must be ruled. Freehand lines lose the mark.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'A spreadsheet draws an order-4 polynomial through your five means and reports R² = 1.000. What does this show?',
        opts: [
          { t: 'Nothing: a curve with four bends can pass through any five points.', ok: true, why: 'R² is always 1.000 for this curve. Quote R² only for a trend line the data could have missed.' },
          { t: 'That the data fit the theory perfectly.', why: 'The curve was bent to fit the points, not predicted by any theory.' },
          { t: 'That the results are accurate.', why: 'R² says nothing about accuracy, and here it says nothing at all.' },
          { t: 'That the results are repeatable.', why: 'Repeatability comes from the spread of the repeats, not from R².' }
        ] },
      { type: 'order', q: 'Put the steps for drawing a line graph in order.',
        items: ['Choose the type of graph from the data', 'Draw the axes, with the independent variable on the x-axis', 'Label and number each axis: quantity / unit, even steps', 'Plot each point as a small cross', 'Join the crosses with ruled lines, from the first to the last', 'Write the caption below the graph'],
        why: 'Grid and scales first, then the data, then the words below the graph.' },
      { type: 'multi', lv: 'g', q: 'Which of these can earn marks in a Cambridge IGCSE graph question?',
        opts: [
          { t: 'Axes labelled with the quantity and the unit', ok: true },
          { t: 'Every point plotted within half a small square', ok: true },
          { t: 'A key when there are two data sets', ok: true },
          { t: 'A title above the graph', why: 'Not in the exam. In a report, the title goes below the graph, and it must say what the graph shows.' },
          { t: 'A different colour for each line', why: 'Colour earns nothing; a key does.' }
        ],
        why: 'The marks are for the axes, the scale, the plotting, the line and, with two data sets, the key.' },
      { type: 'build', lv: 'g', q: 'Build the title for the amylase graph.',
        chips: ['Figure 1.', 'Line graph', 'showing the effect of', 'temperature (20–60 °C)', 'on', 'the mean time taken for amylase to digest starch.', 'Graph 1:', 'Table 1.', 'temperature vs time'],
        answer: ['Figure 1.', 'Line graph', 'showing the effect of', 'temperature (20–60 °C)', 'on', 'the mean time taken for amylase to digest starch.'],
        why: 'Number, type of graph, “showing the effect of”, the independent variable with its range, “on”, then the dependent variable.' },
      { type: 'build', lv: 'ie', q: 'Build the title for the IA amylase graph.',
        chips: ['Figure 1.', 'Line graph', 'showing the effect of', 'temperature (20.0–60.0 °C)', 'on', 'the mean time taken for fungal α-amylase to digest starch', '(n = 5; error bars = ± 1 SD).', 'Bar chart', 'Table 2.', '(error bars)'],
        answer: ['Figure 1.', 'Line graph', 'showing the effect of', 'temperature (20.0–60.0 °C)', 'on', 'the mean time taken for fungal α-amylase to digest starch', '(n = 5; error bars = ± 1 SD).'],
        why: 'The IGCSE pattern, then n and what the error bars show.' },
      { type: 'choose', q: 'Which title belongs below a graph of the soil data?',
        opts: [
          { t: 'Figure 2. Bar chart showing the effect of soil type on the mean height of bean seedlings after 21 days.', ok: true, why: 'Number, type of graph, then the effect of the independent variable on the dependent variable.' },
          { t: 'Figure 2. Mean height of bean seedlings in four soils', why: 'It gives the result, but not the type of graph, and it does not say that soil type was changed.' },
          { t: 'Figure 2. Line graph showing the effect of soil type on the mean height of bean seedlings after 21 days.', why: 'Soil type is a category, so the graph is a bar chart.' },
          { t: 'Graph of soils', why: 'No number, no type of graph, and neither variable.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'A caption ends: (n = 5; error bars = ± 1 SE). What do the bars show?',
        opts: [
          { t: 'How precisely each mean is known', ok: true, why: 'SE is SD ÷ √n. It describes the mean, not the spread of the trials.' },
          { t: 'The spread of the trials around each mean', why: 'That is what SD bars show. SE bars are always shorter.' },
          { t: 'The lowest and the highest trial', why: 'That is a range bar.' },
          { t: 'That two means are significantly different', why: 'Only a statistical test can show that.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'When is it right to quote R² on an IA graph?',
        opts: [
          { t: 'For a trend line fitted to the data, such as a straight line of best fit', ok: true, why: 'The IB guide applies R² “to evaluate the fit of a trend line”.' },
          { t: 'For five means joined with ruled lines', why: 'Ruled lines through every mean are not a fitted trend line, so there is no R².' },
          { t: 'For a curve drawn by eye through an enzyme optimum', why: 'A curve drawn by eye is not fitted to the data, so it has no R².' },
          { t: 'On every graph, to show that the data are good', why: 'R² on the wrong kind of line proves nothing.' }
        ] }
    ],

    words: [
      { term: 'line graph', forms: ['line graphs'], def: 'A graph of points joined by lines, used when the independent variable is continuous and its values were set.', eg: 'Mean time against temperature, 20–60 °C.' },
      { term: 'bar chart', forms: ['bar charts', 'bar graph', 'bar graphs'], def: 'A graph of separate bars with gaps, used when the independent variable is categorical.', eg: 'Mean height of seedlings in soils A, B, C and D.' },
      { term: 'histogram', forms: ['histograms'], def: 'A graph of touching bars that shows how often values of a continuous variable fall in each range.', eg: 'The number of holly leaves in each 10 mm length range.' },
      { term: 'scatter graph', forms: ['scatter graphs', 'scatter plot', 'scatter plots', 'scattergram'], def: 'A graph of unjoined points for two variables that were both measured, not set.', eg: 'Arm span against height for 15 students.' },
      { term: 'line of best fit', forms: ['lines of best fit', 'best-fit line', 'curve of best fit', 'best fit'], def: 'One thin straight line or smooth curve that shows the trend, with the points spread evenly on both sides.', eg: 'A ruled straight line through the potato osmosis points.' },
      { term: 'extrapolate', forms: ['extrapolated', 'extrapolation', 'extrapolating'], def: 'To extend a line beyond the first or last point, into values that were not measured.', eg: 'Continuing the line to 0 °C, which was never tested.' },
      { term: 'interpolate', forms: ['interpolated', 'interpolation', 'interpolating'], def: 'To read a value from the line between two plotted points.', eg: 'Reading the sucrose concentration at which the change in mass is 0 %.' },
      { term: 'key', forms: ['keys', 'legend'], def: 'A box that shows which symbol or line belongs to each data set on a graph.', eg: 'Solid line = 20 °C; dashed line = 30 °C.' },
      { term: 'continuous variable', forms: ['continuous variables', 'continuous', 'continuous data'], def: 'A variable that can take any value in a range, including values between those measured.', eg: 'Temperature: 35.5 °C is possible.', fig: 'data', hi: 'continuous' },
      { term: 'categorical variable', forms: ['categorical variables', 'categorical', 'categorical data', 'category', 'categories'], def: 'A variable whose values are names or groups, not numbers on a scale.', eg: 'Soil type: A, B, C or D.', fig: 'data', hi: 'qual' },
      { term: 'axis', forms: ['axes', 'x-axis', 'y-axis'], def: 'One of the two ruled lines that carry the scales: the x-axis across, the y-axis up.', eg: 'Temperature on the x-axis; mean time on the y-axis.' },
      { term: 'scale', forms: ['scales'], def: 'The numbers along an axis, rising in equal steps from one large square to the next.', eg: '0, 50, 100, 150, 200 s: 50 s per large square.' }
    ],

    further: [
      { title: 'Why a cut axis misleads, even with a warning', lv: 'gie',
        md: 'In 2020, Correll, Bertini and Franconeri asked people to judge graphs whose y-axis did not start at zero. Readers judged the differences as larger when the axis was cut. This happened in bar charts and in line graphs. It happened even when the cut was marked on the graph, and even when readers reported the numbers correctly.\n\nA bar is read by its __length__, so our rule is that a bar chart starts at zero. A line graph may start at 20 °C, as Cambridge allows, if its first number shows where it starts.',
        cite: 'Correll, Michael, Enrico Bertini, and Steven Franconeri. “Truncating the Y-Axis: Threat or Menace?” *Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems*, ACM, 2020, doi:10.1145/3313831.3376222.' },
      { title: 'Knowing the trick does not protect you', lv: 'gie',
        md: 'In 2021, Yang and colleagues ran five studies with bar charts. 83.5 % of the people judged differences as larger when the y-axis was cut. The effect stayed even when the trick was explained to them just before, although the warning made it smaller. PhD students who work with data every day were fooled too.\n\nSo a cut bar chart misleads the person who drew it as well. Start bars at 0.',
        cite: 'Yang, Brenda W., et al. “Truncating Bar Graphs Persistently Misleads Viewers.” *Journal of Applied Research in Memory and Cognition*, vol. 10, no. 2, 2021, pp. 298–311, doi:10.1016/j.jarmac.2020.10.002.' }
    ],

    sources: ['Cambridge IGCSE Biology 0610 syllabus 2026–2028, p. 56', '0610 Paper 6 mark schemes and examiner reports, 2016–2025', 'IB Biology guide (2025), Tool 3, pp. 30–31', 'Correll, Bertini and Franconeri, CHI 2020, doi:10.1145/3313831.3376222', 'Yang et al., JARMAC 2021, doi:10.1016/j.jarmac.2020.10.002', '0610 examiner reports: s21 Paper 51 (scales), w23 Paper 52 (point to point)', 'IB Biology guide (2025), command term Draw', 'Cambridge AS & A Level Biology 9700 Learner Guide (2013), pp. 24–25']
  });
})(window.WUL);
