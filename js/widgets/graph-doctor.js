/* widget: graph-doctor — a broken graph with 5–7 faults. The reader taps a part of the graph:
   a fault is ringed in red pen with a short handwritten label and a one-sentence reason, and
   "Fix it" redraws that part correctly; a correct part says it is fine. Three graphs (a line
   graph, a bar chart with a cut axis and no gaps, a scatter graph with a line to the origin).
   At IB, faults about error bars and R² replace some IGCSE ones.

   How it works: each graph is a function make(on, lv) → {spec, caption}, where "on" holds the
   faults not yet fixed. The graph is redrawn by WUL.plot after every fix, and an invisible layer
   of tap targets is laid over it (WUL.plotScale gives the positions), one focusable group per part. */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var NS = 'http://www.w3.org/2000/svg';
  function xy(xs, ys) { return xs.map(function (x, i) { return [x, ys[i]]; }); }

  var PARTNAME = {
    'label-x': 'the x-axis label', 'label-y': 'the y-axis label', 'ticks-x': 'the x-axis scale', 'ticks-y': 'the y-axis scale',
    title: 'the title', points: 'the points', lines: 'the line', origin: 'the start of the line', key: 'the key',
    bars: 'the bars', err: 'the error bars', caption: 'the caption', paper: 'the grid'
  };
  var FINE = {
    'label-x': 'The x-axis label gives the quantity and the unit.',
    'label-y': 'The y-axis label gives the quantity and the unit.',
    'ticks-x': 'The x-axis scale rises in even steps.',
    'ticks-y': 'The y-axis scale rises in even steps, and the points fill more than half the grid.',
    points: 'Small crosses, each centred on its value.',
    lines: 'The lines follow the points and stop at the first and last points.',
    key: 'The key names each data set.',
    bars: 'Bars of equal width, with gaps, starting at zero.',
    err: 'The error bars are named in the caption.',
    caption: 'The title is below the graph: the type of graph, then both variables.',
    paper: 'That is the grid. Tap a label, a scale, a point, a line, a bar or the key.'
  };

  /* ---------------- the three broken graphs ---------------- */
  var GRAPHS = [
    { id: 'line', name: 'Line graph', what: 'Pondweed: rate of photosynthesis at two temperatures', keyZone: 'br',
      faults: [
        { k: 'unit', part: 'label-x', label: 'unit?', why: 'An axis label needs the quantity __and__ the unit, as in the table: Light intensity / lux.', fixed: 'The label now reads “Light intensity / lux”.' },
        { k: 'blobs', lv: 'g', part: 'points', label: 'blobs', why: 'A large dot hides the exact value, and large dots are penalised. Plot __small crosses__, each centred on its value.', fixed: 'Small crosses now mark the values.' },
        { k: 'free', lv: 'g', part: 'lines', label: 'use a ruler', why: 'A freehand line loses the mark. Join the crosses with __ruled__ straight lines.', fixed: 'The lines are now ruled.' },
        { k: 'origin', part: 'origin', label: 'not measured', why: 'No result was taken at 0 lux. Each line must start at its __first point__, 500 lux.', fixed: 'Both lines now start at 500 lux.' },
        { k: 'key', lv: 'g', part: 'key', label: 'key?', why: 'Two data sets need a __key__. Without one, a reader cannot tell 20 °C from 30 °C. A key is a Cambridge mark point.', fixed: 'A key now names each line.' },
        { k: 'scale', part: 'ticks-y', label: 'half the grid?', why: 'The highest point is 25, but the axis runs to 60, so the points fill less than half the grid. Use __0 to 30__, in 5s.', fixed: 'The y-axis now runs from 0 to 30.' },
        { k: 'errkind', lv: 'ie', part: 'err', parts: ['caption'], label: '± what?', why: 'The caption never says what the bars show. A reader cannot tell SD from SE by looking. End the caption with __(n = 5; error bars = ± 1 SD)__.', fixed: 'The caption now names the bars: ± 1 SD.' },
        { k: 'r2', lv: 'ie', part: 'key', parts: ['lines'], label: 'R² for a curve?', why: 'R² belongs to an __equation fitted__ to the data. These curves were drawn through every mean, not fitted, so R² shows nothing. The smooth curves are right: the rate rises, then levels off. Keep them, and leave R² out.', fixed: 'The key has no R² now. The smooth curves stay.' }
      ],
      make: function (on, lv) {
        var ib = lv !== 'g';
        var xs = [500, 1000, 1500, 2000, 2500, 3000], a = [5, 9, 12, 14, 15, 15], b = [7, 13, 18, 22, 24, 25];
        /* IGCSE: ruled point to point. IB: smooth curves, because the rate rises and then levels off */
        var line = on.free ? 'free' : (ib ? 'smooth' : 'ruled'), mark = on.blobs ? 'blob' : 'x';
        var series = [];
        if (on.origin) {
          series.push({ id: 'oa', pts: [[0, 0], [xs[0], a[0]]], line: on.free ? 'free' : 'ruled', mark: 'none', part: 'origin' });
          series.push({ id: 'ob', pts: [[0, 0], [xs[0], b[0]]], line: on.free ? 'free' : 'ruled', mark: 'none', dash: true, part: 'origin' });
        }
        series.push({ id: 'a', pts: xy(xs, a), line: line, mark: mark, label: '20 °C' + (on.r2 ? ' (R² = 0.98)' : ''), err: ib ? [0.8, 1.0, 1.2, 1.1, 1.3, 1.2] : null });
        series.push({ id: 'b', pts: xy(xs, b), line: line, mark: mark, dash: true, label: '30 °C' + (on.r2 ? ' (R² = 0.99)' : ''), err: ib ? [0.9, 1.3, 1.5, 1.4, 1.6, 1.5] : null });
        var spec = {
          w: 540, h: 400, pad: { l: 84, r: 20, b: 58 },
          x: { min: 0, max: 3000, step: 500, minor: 5, label: on.unit ? 'Light' : 'Light intensity / lux' },
          y: on.scale ? { min: 0, max: 60, step: 10, minor: 5, label: 'Rate / bubbles per minute' } : { min: 0, max: 30, step: 5, minor: 5, label: 'Rate / bubbles per minute' },
          series: series, key: !on.key, keyAt: 'br'
        };
        var cap = 'Figure 1. Line graph showing the effect of light intensity (500–3000 lux) on the rate of photosynthesis of pondweed at 20\u00a0°C and 30\u00a0°C';
        cap += !ib ? '.' : on.errkind ? ' (n\u00a0=\u00a05).' : ' (n\u00a0=\u00a05; error bars = ±\u00a01\u00a0SD).';
        return { spec: spec, caption: cap };
      },
      fine: { lines: 'At IGCSE, ruled lines point to point. At IB, a smooth curve through each set of means. Both stop at the first and last points.' } },

    { id: 'bar', name: 'Bar chart', what: 'Limpets: mean shell length on four shores',
      faults: [
        { k: 'cut', part: 'ticks-y', label: 'cut axis', why: 'A bar shows its value by its __length__. Cut at 30.5 mm, bar S looks more than three times longer than bar P; the real difference is 1.7 mm, about 5 %. Our rule: bar charts start at 0. The zig-zag does not fix it.', fixed: 'The y-axis now starts at 0, with no zig-zag.' },
        { k: 'touch', part: 'bars', label: 'no gaps?', why: 'The shores are separate categories, so the bars need __gaps__. Touching bars are for a histogram.', fixed: 'The bars now have gaps.' },
        { k: 'unit', part: 'label-y', label: 'unit?', why: 'Give the quantity and the unit: __Mean length of shell / mm__.', fixed: 'The label now reads “Mean length of shell / mm”.' },
        { k: 'nolabel', part: 'label-x', label: 'label?', why: 'Every axis needs a label. This one names the categories: __Shore__.', fixed: 'The x-axis is now labelled “Shore”.' },
        { k: 'title', lv: 'g', part: 'title', label: 'says nothing', why: '“Bar graph” tells the reader nothing. Write the title __below__ the graph: the number, the type of graph, then both variables. __Figure 2. Bar chart showing the effect of the shore (P–S) on the mean length of limpet shells.__', fixed: 'A title below now names the type of graph and both variables.' },
        { k: 'se', lv: 'ie', part: 'err', parts: ['caption'], needs: 'cut', label: 'SE ≠ variation', why: 'The caption says the bars show the variation between shells, but SE shows how precisely each __mean__ is known. To show variation, draw __± 1 SD__.', fixed: 'The bars are now ± 1 SD, and the caption says so.', wait: 'Fix the cut axis first: the SD bars reach below 30.5 mm.' }
      ],
      make: function (on, lv) {
        var ib = lv !== 'g';
        var labs = ['P', 'Q', 'R', 'S'], m = [31.2, 32.0, 31.6, 32.9], sd = [2.1, 2.4, 1.9, 2.2], se = [0.47, 0.54, 0.42, 0.49];
        var ylab = on.unit ? 'Mean length' : 'Mean length of shell / mm';
        var spec = {
          w: 540, h: 400, pad: { l: 84, r: 20, b: 58 },
          x: { cat: labs, label: on.nolabel ? null : 'Shore' },
          y: on.cut ? { min: 30.5, max: 33.5, step: 0.5, minor: 5, label: ylab } : { min: 0, max: 40, step: 5, minor: 5, label: ylab },
          tickDp: on.cut ? 1 : null, axisBreak: !!on.cut,
          bars: { touch: !!on.touch, items: labs.map(function (l, i) { return { label: l, v: m[i], err: ib ? (on.se ? se[i] : sd[i]) : null }; }) },
          title: on.title ? 'Bar graph' : null
        };
        var cap = 'Figure 2. Bar chart showing the effect of the shore (P–S) on the mean length of limpet shells.';
        if (ib) cap = on.se ? 'Figure 2. Bar chart showing the effect of the shore (P–S) on the mean length of limpet shells. The error bars show the variation between shells (n = 20; error bars = ± 1 SE).' : 'Figure 2. Bar chart showing the effect of the shore (P–S) on the mean length of limpet shells (n = 20; error bars = ± 1 SD).';
        return { spec: spec, caption: on.title ? null : cap };
      },
      fine: { 'ticks-x': 'Each bar is labelled with its shore.', 'ticks-y': 'The scale starts at 0 and rises in even steps of 5 mm.', err: 'SD bars show how much the shells vary, and the caption says so.', caption: 'The title is below the graph, and names the type of graph and both variables.' } },

    { id: 'scatter', name: 'Scatter graph', what: 'Arm span and height of 15 students', pointR: 8, linesOverPoints: true,
      faults: [
        { k: 'origin', part: 'origin', label: 'to the origin?', why: 'Nobody is 0 cm tall. A line must stay within the range of the data: never [[extrapolate]] it to the origin.', fixed: 'The line now covers only the range of the data.' },
        { k: 'zig', part: 'lines', label: 'dot to dot?', why: 'In a scatter graph neither variable was set, so the points are not joined in order. Draw one straight [[line of best fit]], or no line.', fixed: 'One straight line of best fit now shows the trend.' },
        { k: 'scale', part: 'ticks-y', parts: ['ticks-x'], needs: 'origin', label: 'tiny corner', why: 'The axes start at 0, so the points fill a small corner of the grid. Start near the lowest values (150 cm and 140 cm), and write those numbers at the start of each axis.', fixed: 'The axes now start at 150 cm and 140 cm, and the points fill most of the grid.', wait: 'Fix the line to the origin first: the new scale does not include 0.' },
        { k: 'unit', part: 'label-y', label: 'unit?', why: 'Give the quantity and the unit: __Arm span / cm__.', fixed: 'The label now reads “Arm span / cm”.' },
        { k: 'title', part: 'title', label: 'says nothing', why: '“Scatter graph” on its own tells the reader nothing. Write the title __below__ the graph: the number, the type of graph, then both variables. __Figure 3. Scatter graph showing the relationship between height and arm span in 15 students.__', fixed: 'A title below now names the type of graph and both variables.' }
      ],
      make: function (on) {
        var hts = [152, 155, 158, 160, 162, 165, 167, 169, 171, 173, 175, 177, 180, 182, 185];
        var arm = [150, 157, 156, 163, 160, 166, 170, 167, 172, 171, 178, 175, 182, 180, 187];
        var d = xy(hts, arm), series = [];
        if (on.origin) series.push({ id: 'o', pts: [[0, 0], d[0]], line: 'ruled', mark: 'none', part: 'origin' });
        series.push({ id: 's', pts: d, mark: 'x', line: on.zig ? 'ruled' : 'none' });
        if (!on.zig) series.push({ id: 'f', pts: d, mark: 'none', line: 'best' });
        var ylab = on.unit ? 'Arm span' : 'Arm span / cm';
        var spec = {
          w: 540, h: 400, pad: { l: 84, r: 20, b: 58 },
          x: on.scale ? { min: 0, max: 200, step: 50, minor: 5, label: 'Height / cm' } : { min: 150, max: 190, step: 10, minor: 5, label: 'Height / cm' },
          y: on.scale ? { min: 0, max: 200, step: 50, minor: 5, label: ylab } : { min: 140, max: 190, step: 10, minor: 5, label: ylab },
          series: series, title: on.title ? 'Scatter graph' : null
        };
        return { spec: spec, caption: on.title ? null : 'Figure 3. Scatter graph showing the relationship between height and arm span in 15 students.' };
      },
      fine: { points: 'Small crosses, one for each person.', lines: 'One straight line of best fit, across the range of the data only.', 'ticks-x': 'The x-axis starts at 150 cm, and its first number shows it.', 'ticks-y': 'The y-axis starts at 140 cm, and the points fill most of the grid.', caption: 'The title below names the type of graph and both variables.' } }
  ];

  /* ---------------- tap targets, from the spec ---------------- */
  function targets(spec, G) {
    var S = WUL.plotScale(spec), L = S.L, T = S.T, pw = S.pw, ph = S.ph, W = S.W, H = S.H, px = S.px, py = S.py;
    var out = [];
    function add(part, shapes) { if (shapes.length) out.push({ part: part, shapes: shapes }); }
    function R(x, y, w, hh, i) { return { tag: 'rect', a: { x: x, y: y, width: Math.max(w, 1), height: Math.max(hh, 1) }, i: i || 0, box: [x, y, w, hh] }; }
    add('paper', [R(L, T, pw, ph)]);
    if (spec.bars) {
      var bw = spec.bars.width || (spec.bars.touch ? 1 : 0.6), y0 = spec.y.min > 0 ? spec.y.min : 0;
      add('bars', spec.bars.items.map(function (b, i) {
        var x0 = px(i + 0.5 - bw / 2), x1 = px(i + 0.5 + bw / 2), top = py(b.v), base = py(y0);
        return R(x0, Math.min(top, base) - 4, x1 - x0, Math.abs(base - top) + 4, i);
      }));
    }
    var lines = { lines: [], origin: [] }, errs = [], points = [], pr = G.pointR || 14;
    (spec.series || []).forEach(function (se) {
      var P = se.pts || [];
      if (se.line && se.line !== 'none' && P.length > 1) {
        var segs = [];
        if (se.line === 'best') {
          var f = WUL.linFit(P), xa = P[0][0], xb = P[P.length - 1][0];
          segs.push([[xa, f.m * xa + f.c], [xb, f.m * xb + f.c]]);
        } else for (var k = 0; k < P.length - 1; k++) segs.push([P[k], P[k + 1]]);
        segs.forEach(function (sg) {
          var a = [px(sg[0][0]), py(sg[0][1])], b = [px(sg[1][0]), py(sg[1][1])];
          lines[se.part || 'lines'].push({ tag: 'path', a: { d: 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) }, i: lines[se.part || 'lines'].length,
            box: [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])], seg: [a, b] });
        });
      }
      if (se.err) P.forEach(function (p, i) {
        var t = py(p[1] + se.err[i]), bt = py(p[1] - se.err[i]);
        errs.push(R(px(p[0]) - 9, t - 3, 18, bt - t + 6, errs.length));
      });
      if (se.mark !== 'none') P.forEach(function (p) {
        points.push({ tag: 'circle', a: { cx: px(p[0]), cy: py(p[1]), r: pr }, i: points.length, box: [px(p[0]) - 7, py(p[1]) - 7, 14, 14] });
      });
    });
    if (spec.bars) spec.bars.items.forEach(function (b, i) {
      if (b.err == null) return;
      var t = py(b.v + b.err), bt = py(b.v - b.err);
      errs.push(R(px(i + 0.5) - 10, t - 3, 20, bt - t + 6, i));
    });
    /* later = on top: an error bar is tapped before the cross it runs through. On the crowded scatter graph
       the line joining the crosses must win, or the dot-to-dot line could not be tapped at all. */
    /* the key (or the empty place where it belongs) lies under the data, so a point inside it can still be tapped */
    if (spec.key || G.keyZone) {
      var nk = (spec.series || []).filter(function (s) { return s.label; }).length || 2;
      var kw = 170, kh = 12 + nk * 20, at = spec.keyAt || G.keyZone || 'tr';
      var kx = at.indexOf('l') >= 0 ? L + 12 : L + pw - kw - 10, ky = at.indexOf('b') >= 0 ? T + ph - kh - 10 : T + 10;
      add('key', [R(kx, ky, kw, kh)]);
    }
    var layers = { lines: lines.lines, origin: lines.origin, points: points, err: errs };
    (G.linesOverPoints ? ['points', 'lines', 'origin', 'err'] : ['lines', 'origin', 'points', 'err']).forEach(function (k) { add(k, layers[k]); });
    add('ticks-x', [R(L - 14, T + ph + 3, pw + 28, 22)]);
    add('ticks-y', [R(24, T - 10, L - 27, ph + 20)]);
    add('label-x', [R(L + pw / 2 - 130, H - 30, 260, 28)]);
    add('label-y', [R(0, T + ph / 2 - 100, 23, 200)]);
    if (spec.title) add('title', [R(L + pw / 2 - 100, 2, 200, T - 6)]);
    /* the data, for keeping handwritten labels clear of it */
    var data = [];
    lines.lines.concat(lines.origin).forEach(function (sh) { data.push({ seg: sh.seg }); });
    points.forEach(function (sh) { data.push({ box: [sh.a.cx - 8, sh.a.cy - 8, 16, 16] }); });
    errs.forEach(function (sh) { data.push({ box: sh.box }); });
    if (spec.bars) (out.filter(function (t) { return t.part === 'bars'; })[0] || { shapes: [] }).shapes.forEach(function (sh) {
      var b = sh.box, x0 = b[0], x1 = b[0] + b[2], y0 = b[1] + 4, y1 = b[1] + b[3];
      data.push({ seg: [[x0, y0], [x1, y0]] }, { seg: [[x0, y0], [x0, y1]] }, { seg: [[x1, y0], [x1, y1]] });   /* the outline of each bar */
    });
    return { list: out, S: S, data: data };
  }

  /* a pen ring round the box b = [x, y, w, h], drawn in one stroke that overshoots its start.
     Round parts get an ellipse. Long, thin parts (a row of axis numbers) get a rounded oblong
     (a superellipse, power 4), which still contains the corners of the box, so the pen never
     crosses the first or last number. */
  function ringSize(b) {
    var long = b[2] > 2 * b[3] || b[3] > 2 * b[2];
    /* margins chosen so (w/2rx)^4 + (h/2ry)^4 < 0.9: the corners stay inside even with the wobble */
    if (long) return { long: true, rx: b[2] / 2 + (b[2] > b[3] ? 14 : 12), ry: b[3] / 2 + (b[3] > b[2] ? 14 : 12) };
    return { long: false, rx: Math.max(16, b[2] / 2 + 10), ry: Math.max(13, b[3] / 2 + 9) };
  }
  /* rot: the ring's long axis, in radians (an oval along a sloping line) */
  function penRing(cx, cy, rx, ry, seed, long, rot) {
    var d = '', n = 72, a0 = -2.3 + (seed % 5) * 0.21, sweep = Math.PI * 2 + 0.45, e = long ? 0.5 : 1;
    var c = Math.cos(rot || 0), sn = Math.sin(rot || 0);
    function pw(v) { return (v < 0 ? -1 : 1) * Math.pow(Math.abs(v), e); }
    for (var k = 0; k <= n; k++) {
      var t = a0 + sweep * k / n, grow = 1 + 0.05 * k / n, wob = 1 + 0.025 * Math.sin(3 * t + seed);
      var u = rx * grow * wob * pw(Math.cos(t)), v = ry * grow * wob * pw(Math.sin(t));
      d += (k ? 'L' : 'M') + (cx + u * c - v * sn).toFixed(1) + ' ' + (cy + u * sn + v * c).toFixed(1);
    }
    return d;
  }

  var CSS =
    '.wd-graph-doctor{display:grid;gap:12px}' +
    '.wd-graph-doctor__top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}' +
    '.wd-graph-doctor__what{font:500 1.02rem/1.35 var(--serif);color:var(--ink-2)}' +
    '.wd-graph-doctor__count{font:600 .86rem/1.3 var(--mono);color:var(--ink-2)}' +
    '.wd-graph-doctor__count b{color:var(--red);font-size:1.05rem}' +
    '.wd-graph-doctor__count .ok{color:var(--green)}' +
    '.wd-graph-doctor__sheet{padding:14px 12px 10px;box-shadow:none}' +
    '.wd-graph-doctor__sheet .plot{max-width:600px;margin:0 auto}' +
    '@media (max-width:560px){.wd-graph-doctor.wd-panel{padding:12px 8px}.wd-graph-doctor__sheet{padding:8px 2px 6px}}' +
    '.wd-graph-doctor__hit{cursor:pointer;outline:none}' +
    '.wd-graph-doctor__hit rect,.wd-graph-doctor__hit circle{fill:transparent;stroke:none}' +
    '.wd-graph-doctor__hit path{fill:none;stroke:transparent;stroke-width:22;stroke-linecap:round}' +
    '.wd-graph-doctor__hit--paper{cursor:default}' +
    '@media (hover:hover){.wd-graph-doctor__hit:not(.wd-graph-doctor__hit--paper):hover rect,.wd-graph-doctor__hit:not(.wd-graph-doctor__hit--paper):hover circle{fill:var(--hl-soft)}.wd-graph-doctor__hit:hover path{stroke:var(--hl-soft)}}' +
    '.wd-graph-doctor__hit:focus-visible rect,.wd-graph-doctor__hit:focus-visible circle{fill:var(--hl-soft);stroke:var(--blue);stroke-width:1.5;stroke-dasharray:4 3}' +
    '.wd-graph-doctor__hit:focus-visible path{stroke:rgba(30,79,168,.18)}' +
    '.wd-graph-doctor__ring{pointer-events:none}' +
    '.wd-graph-doctor__ring path{fill:none;stroke:var(--red);stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}' +
    '.wd-graph-doctor__ring text{font:700 21px var(--hand);fill:var(--red)}' +
    '.wd-graph-doctor__ring path.wd-graph-doctor__lead{stroke-width:1.4}' +
    '.wd-graph-doctor__ring.is-shown path{stroke-dasharray:5 4;opacity:.8}' +
    '.wd-graph-doctor__ring.is-active path{stroke-width:3.2}' +
    '.wd-graph-doctor__cap{appearance:none;display:block;width:100%;max-width:600px;margin:6px auto 0;background:none;border:0;border-radius:3px;padding:4px 6px;font:italic 400 .93rem/1.4 var(--serif);color:var(--ink);text-align:left;cursor:pointer}' +
    '.wd-graph-doctor__cap:hover{background:var(--hl-soft)}' +
    '.wd-graph-doctor__cap.is-found{background:var(--red-wash);box-shadow:0 0 0 2px var(--red)}' +
    '.wd-graph-doctor__caplab{font:700 1.2rem/1 var(--hand);color:var(--red);margin-left:6px;font-style:normal}' +
    '.wd-graph-doctor__msg{min-height:74px;border:1px solid var(--edge);border-radius:var(--r);background:var(--sheet-2);padding:12px 14px;font-size:.98rem;line-height:1.5;display:grid;gap:8px;align-content:start}' +
    '.wd-graph-doctor__msg.is-fault{background:var(--red-wash)}' +
    '.wd-graph-doctor__msg.is-fine{background:var(--green-wash)}' +
    '.wd-graph-doctor__lab{display:block;font:700 1.4rem/1 var(--hand);color:var(--red)}' +
    '.wd-graph-doctor__msg .btn{justify-self:start}' +
    '.wd-graph-doctor__wait{font-size:.88rem;color:var(--ink-2)}' +
    '.wd-graph-doctor__found{display:flex;flex-wrap:wrap;gap:6px;min-height:0}' +
    '.wd-graph-doctor__chip{appearance:none;border:1.5px solid var(--red);background:var(--sheet);border-radius:999px;padding:4px 11px;font:700 1.05rem/1.2 var(--hand);color:var(--red);cursor:pointer}' +
    '.wd-graph-doctor__chip.is-fixed{border-color:var(--green);color:var(--green)}' +
    '.wd-graph-doctor__chip.is-shown{border-style:dashed}';

  WUL.widget('graph-doctor', function (host) {
    WUL.css('graph-doctor', CSS);
    var LV = WUL.level();
    var gi = 0, ST = {};    /* per graph: {found:{k:{i, shown}}, fixed:{k:1}} */
    var active = null;      /* the fault or part last tapped */

    var root = h('div', { class: 'wd-graph-doctor wd-panel' });
    var top = h('div', { class: 'wd-graph-doctor__top' });
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Choose a graph' });
    GRAPHS.forEach(function (G, k) {
      var b = h('button', { type: 'button', 'aria-pressed': k === gi ? 'true' : 'false', text: (k + 1) + '. ' + G.name });
      b.addEventListener('click', function () { go(k); });
      seg.appendChild(b);
    });
    var count = h('div', { class: 'wd-graph-doctor__count', 'aria-live': 'polite' });
    top.appendChild(seg); top.appendChild(count);
    var what = h('p', { class: 'wd-graph-doctor__what' });
    var sheet = h('div', { class: 'sheet wd-graph-doctor__sheet' });
    var msg = h('div', { class: 'wd-graph-doctor__msg', 'aria-live': 'polite' });
    var found = h('div', { class: 'wd-graph-doctor__found' });
    var another = h('button', { type: 'button', class: 'btn btn--go', text: 'Try another graph →' });
    var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start again' });
    var reveal = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Show all the faults' });
    root.appendChild(top); root.appendChild(what); root.appendChild(sheet); root.appendChild(msg); root.appendChild(found);
    root.appendChild(h('div', { class: 'wd-row' }, [another, again, reveal]));
    host.appendChild(root);

    another.addEventListener('click', function () { go((gi + 1) % GRAPHS.length); });
    again.addEventListener('click', function () { ST[GRAPHS[gi].id] = null; active = null; draw(); intro(); });
    reveal.addEventListener('click', function () {
      var s = st();
      faults().forEach(function (f) { if (!s.found[f.k]) s.found[f.k] = { i: null, shown: true }; });
      active = null; draw();
      msg.className = 'wd-graph-doctor__msg';
      msg.innerHTML = '<div>Every fault now has a red ring. Tap a ringed part, or a label below, to read why it is wrong. Then fix it.</div>';
    });

    function G() { return GRAPHS[gi]; }
    function st() { var id = G().id; if (!ST[id]) ST[id] = { found: {}, fixed: {} }; return ST[id]; }
    function faults() { return G().faults.filter(function (f) { return WUL.shows(f.lv, LV); }); }
    function on() { var s = st(), o = {}; faults().forEach(function (f) { if (!s.fixed[f.k]) o[f.k] = true; }); return o; }
    function faultFor(part) {
      var s = st();
      return faults().filter(function (f) { return !s.fixed[f.k] && (f.part === part || (f.parts || []).indexOf(part) >= 0); })[0] || null;
    }
    function go(k) {
      gi = k; active = null;
      seg.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', j === gi ? 'true' : 'false'); });
      draw(); intro();
    }
    function intro() {
      msg.className = 'wd-graph-doctor__msg';
      msg.innerHTML = '<div>Tap any part of the graph that is wrong: a label, a scale, the points, a line, the bars, the key or the caption. Something may also be <u>missing</u>.</div>';
    }

    function paintCount() {
      var F = faults(), s = st();
      var nf = F.filter(function (f) { return s.found[f.k] && !s.found[f.k].shown; }).length;
      var nx = F.filter(function (f) { return s.fixed[f.k]; }).length;
      count.innerHTML = '<b>' + nf + '</b> of ' + F.length + ' found' + (nx ? ' · <span class="ok">' + nx + ' fixed</span>' : '') + (nf === F.length ? ' <span class="ok">— all of them</span>' : '');
      found.innerHTML = '';
      F.forEach(function (f) {
        if (!s.found[f.k]) return;
        var c = h('button', { type: 'button', class: 'wd-graph-doctor__chip' + (s.fixed[f.k] ? ' is-fixed' : '') + (s.found[f.k].shown ? ' is-shown' : ''), text: f.label + (s.fixed[f.k] ? ' ✔' : '') });
        c.addEventListener('click', function () { active = { f: f }; draw(); tell(f); });
        found.appendChild(c);
      });
    }

    var svg, T;
    function draw() {
      var built = G().make(on(), LV), spec = built.spec;
      /* on a phone the same graph gets a narrower picture, so its words and tap targets are drawn larger */
      if (window.innerWidth < 560) { spec.w = 440; spec.h = 380; spec.pad = Object.assign({}, spec.pad, { l: 78, r: 12 }); }
      spec.alt = G().name + ': ' + G().what;
      what.textContent = 'Graph ' + (gi + 1) + ' of ' + GRAPHS.length + ': ' + G().what;
      sheet.innerHTML = WUL.plot(spec);
      svg = sheet.querySelector('svg');
      /* tap targets */
      T = targets(spec, G());
      var layer = document.createElementNS(NS, 'g');
      layer.setAttribute('class', 'wd-graph-doctor__hits');
      T.list.forEach(function (t) {
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'wd-graph-doctor__hit' + (t.part === 'paper' ? ' wd-graph-doctor__hit--paper' : ''));
        g.setAttribute('data-part', t.part);
        if (t.part !== 'paper') { g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', 'Check ' + PARTNAME[t.part]); }
        t.shapes.forEach(function (sh) {
          var e = document.createElementNS(NS, sh.tag);
          Object.keys(sh.a).forEach(function (k) { e.setAttribute(k, typeof sh.a[k] === 'number' ? sh.a[k].toFixed(1) : sh.a[k]); });
          e.setAttribute('data-i', sh.i);
          g.appendChild(e);
        });
        layer.appendChild(g);
      });
      svg.appendChild(layer);
      /* the caption, as a button so it can be tapped too */
      if (built.caption) {
        var s = st(), cf = faultFor('caption');
        var cap = h('button', { type: 'button', class: 'wd-graph-doctor__cap', 'data-part': 'caption', html: md(built.caption, { inline: true }) });
        if (cf && s.found[cf.k]) { cap.classList.add('is-found'); cap.appendChild(h('span', { class: 'wd-graph-doctor__caplab', text: cf.label })); }
        sheet.appendChild(cap);
      }
      rings();
      paintCount();
    }

    /* where to ring a fault: {box} for a part, or {seg} for a sloping line (the ring becomes an oval along it) */
    function ringTarget(f, i) {
      var part = f.part, t = T.list.filter(function (x) { return x.part === part; })[0];
      if (!t) return null;
      var sh = (i != null && t.shapes[i]) ? t.shapes[i] : t.shapes[Math.floor((t.shapes.length - 1) / 2)];
      var S = T.S;
      if (sh.seg) {
        var a = sh.seg[0], b = sh.seg[1], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
        if (part === 'origin' && len > 140) b = [a[0] + dx * 140 / len, a[1] + dy * 140 / len];   /* ring the end at the origin */
        return { seg: [a, b] };
      }
      if (f.k === 'touch' && part === 'bars') {
        /* ring the place where two bars touch, where the gap should be */
        var n = t.shapes.length, j = sh.i < n - 1 ? sh.i : sh.i - 1;
        var A = t.shapes[j].box, B = t.shapes[j + 1].box, xj = A[0] + A[2];
        var top = Math.max(A[1], B[1]) + 4, base = A[1] + A[3];
        return { box: [xj - 7, top - 6, 14, Math.min(base - top, 120) * 0.55 + 6] };
      }
      var elName = { 'label-x': 1, 'label-y': 1, 'ticks-x': 1, 'ticks-y': 1, title: 1, key: 1 }[part] ? part : null;
      if (elName) {
        var real = svg.querySelector('[data-el="' + elName + '"]');
        if (real) { try { var bb = real.getBBox(); if (bb.width || bb.height) return { box: [bb.x, bb.y, bb.width, bb.height] }; } catch (e) { /* not laid out */ } }
        /* nothing drawn there yet: ring the empty place where it belongs */
        if (part === 'key') return { box: [sh.box[0] + 16, sh.box[1] + 10, sh.box[2] - 32, sh.box[3] - 20] };
        if (part === 'label-x') return { box: [S.L + S.pw / 2 - 45, S.H - 24, 90, 14] };
      }
      return { box: sh.box };
    }

    function rings() {
      var s = st(), W = T.S.W, H = T.S.H;
      var layer = document.createElementNS(NS, 'g');
      layer.setAttribute('class', 'wd-graph-doctor__rings');
      svg.appendChild(layer);
      /* words must not cover the axis words and numbers, other rings, other labels, or (if possible) the data */
      var keepOut = [];
      ['label-x', 'label-y', 'ticks-x', 'ticks-y', 'title', 'key'].forEach(function (n) {
        var e = svg.querySelector('[data-el="' + n + '"]');
        if (!e) return;
        try { var bb = e.getBBox(); if (bb.width || bb.height) keepOut.push([bb.x, bb.y, bb.width, bb.height]); } catch (er) { /* not laid out */ }
      });
      var list = faults().filter(function (f) { return s.found[f.k] && !s.fixed[f.k]; });
      var geo = list.map(function (f, n) {
        var tg = ringTarget(f, s.found[f.k].i);
        if (!tg) return null;
        var cx, cy, rx, ry, rot = 0, long = false;
        if (tg.seg) {
          var a = tg.seg[0], b = tg.seg[1], dx = b[0] - a[0], dy = b[1] - a[1];
          cx = (a[0] + b[0]) / 2; cy = (a[1] + b[1]) / 2; rot = Math.atan2(dy, dx);
          rx = Math.sqrt(dx * dx + dy * dy) / 2 + 13; ry = 14;
        } else {
          var bx = tg.box, z = ringSize(bx);
          cx = bx[0] + bx[2] / 2; cy = bx[1] + bx[3] / 2; rx = z.rx; ry = z.ry; long = z.long;
          /* keep the ring inside the picture */
          var x0 = Math.max(3, cx - rx), x1 = Math.min(W - 3, cx + rx), y0 = Math.max(3, cy - ry), y1 = Math.min(H - 3, cy + ry);
          cx = (x0 + x1) / 2; cy = (y0 + y1) / 2; rx = (x1 - x0) / 2; ry = (y1 - y0) / 2;
        }
        var c = Math.cos(rot), sn = Math.sin(rot);
        var hx = Math.sqrt(rx * rx * c * c + ry * ry * sn * sn), hy = Math.sqrt(rx * rx * sn * sn + ry * ry * c * c);
        return { f: f, cx: cx, cy: cy, rx: rx, ry: ry, rot: rot, long: long, hx: hx, hy: hy, n: n, left: cx < T.S.L - 24, box: [cx - hx, cy - hy, 2 * hx, 2 * hy] };
      });
      var labels = [];
      function hit(a, b) { return a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]; }
      function onData(bx) {
        return T.data.some(function (d) {
          if (d.box) return hit(bx, d.box);
          for (var j = 0; j <= 16; j++) {
            var qx = d.seg[0][0] + (d.seg[1][0] - d.seg[0][0]) * j / 16, qy = d.seg[0][1] + (d.seg[1][1] - d.seg[0][1]) * j / 16;
            if (qx > bx[0] - 2 && qx < bx[0] + bx[2] + 2 && qy > bx[1] - 2 && qy < bx[1] + bx[3] + 2) return true;
          }
          return false;
        });
      }
      geo.forEach(function (r) {
        if (!r) return;
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'wd-graph-doctor__ring' + (s.found[r.f.k].shown ? ' is-shown' : '') + (active && active.f === r.f ? ' is-active' : ''));
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', penRing(r.cx, r.cy, r.rx, r.ry, r.n + 1, r.long, r.rot));
        g.appendChild(p);
        var tx = document.createElementNS(NS, 'text');
        tx.textContent = r.f.label;
        g.appendChild(tx);
        layer.appendChild(g);
        /* try places round the ring until the words fit inside the picture and touch no other ring or label.
           [x, y, anchor, vertical]: a ring in the left margin (the y-axis label) gets a note written upwards
           above or below it, like a note in the margin of a page. */
        var tw; try { tw = tx.getComputedTextLength(); } catch (e) { tw = 0; }
        if (!tw) tw = r.f.label.length * 8.5;
        var th = 18, X = r.cx, Y = r.cy, hx = r.hx, hy = r.hy;
        var cands = [];
        if (r.left) cands.push([X + 6, Y - hy - 6, 'start', 1], [X + 6, Y + hy + 6 + tw, 'start', 1]);
        cands.push(
          [X, Y - hy - 6, 'middle'], [X + hx + 6, Y + 6, 'start'], [X - hx - 6, Y + 6, 'end'],
          [X, Y + hy + 19, 'middle'], [X + hx * 0.7, Y - hy - 4, 'start'], [X - hx * 0.7, Y - hy - 4, 'end'],
          [X + hx * 0.7, Y + hy + 17, 'start'], [X - hx * 0.7, Y + hy + 17, 'end'],
          [X + hx + 6, Y - hy * 0.6, 'start'], [X + hx + 6, Y + hy * 0.6 + 12, 'start'],
          [X - hx - 6, Y - hy * 0.6, 'end'], [X - hx - 6, Y + hy * 0.6 + 12, 'end'],
          [X, Y - hy - 24, 'middle'], [X, Y + hy + 37, 'middle']);
        /* further up, into the empty part of the grid, with a pen stroke back to the ring */
        [36, 46, 58, 70, 84, 100, 120].forEach(function (up) {
          cands.push([X, Y - hy - up, 'middle', 0, 1], [X + hx * 0.4, Y - hy - up, 'start', 0, 1], [X - hx * 0.4, Y - hy - up, 'end', 0, 1]);
        });
        function box(c) {
          if (c[3]) return [c[0] - th + 2, c[1] - tw - 2, th + 2, tw + 4];                     /* written upwards from (x, y) */
          var x0 = c[2] === 'middle' ? c[0] - tw / 2 : c[2] === 'end' ? c[0] - tw : c[0];
          return [x0 - 7, c[1] - th - 3, tw + 14, th + 10];                                     /* air round the words, so two notes never read as one */
        }
        function lead(c) { var lb = box(c); return [[Math.max(lb[0] + 8, Math.min(lb[0] + lb[2] - 8, X)), lb[1] + lb[3] - 4], [X, Y - hy + 2]]; }
        function leadOnData(c) {
          var L2 = lead(c);
          for (var j = 1; j < 20; j++) {
            var qx = L2[0][0] + (L2[1][0] - L2[0][0]) * j / 20, qy = L2[0][1] + (L2[1][1] - L2[0][1]) * j / 20;
            var pt = [qx - 2, qy - 2, 4, 4];
            if (onData(pt) || geo.some(function (o) { return o && o !== r && hit(pt, o.box); }) || labels.some(function (q) { return hit(pt, q); })) return true;
          }
          return false;
        }
        function free(c, level) {
          var bx = box(c);
          if (bx[0] < 2 || bx[1] < 2 || bx[0] + bx[2] > W - 2 || bx[1] + bx[3] > H - 2) return false;
          if (labels.some(function (q) { return hit(bx, q); })) return false;
          if (geo.some(function (o) { return o && o !== r && hit(bx, o.box); })) return false;
          if (level >= 1 && keepOut.some(function (q) { return hit(bx, q); })) return false;
          if (level >= 2 && onData(bx)) return false;
          return level < 3 || !(c[4] && leadOnData(c));
        }
        /* 3: words and pen stroke clear of the data · 2: words clear (the stroke may cross a line) · 1: clear of the axis words · 0: anywhere inside */
        var best = null, k, lvl;
        for (lvl = 3; lvl >= 0 && !best; lvl--) for (k = 0; k < cands.length && !best; k++) if (free(cands[k], lvl)) best = cands[k];
        if (best) labels.push(box(best));
        else best = [Math.max(tw / 2 + 2, Math.min(W - tw / 2 - 2, X)), Math.max(th, Y - hy - 6), 'middle'];
        tx.setAttribute('x', best[0].toFixed(1)); tx.setAttribute('y', best[1].toFixed(1)); tx.setAttribute('text-anchor', best[2]);
        tx.setAttribute('transform', 'rotate(' + (best[3] ? -90 : -3) + ' ' + best[0].toFixed(1) + ' ' + best[1].toFixed(1) + ')');
        if (best[4]) {
          /* a note written further up gets a short pen stroke down to its ring */
          var L3 = lead(best), ld = document.createElementNS(NS, 'path');
          ld.setAttribute('d', 'M' + L3[0][0].toFixed(1) + ' ' + L3[0][1].toFixed(1) + 'L' + L3[1][0].toFixed(1) + ' ' + L3[1][1].toFixed(1));
          ld.setAttribute('class', 'wd-graph-doctor__lead');
          g.appendChild(ld);
        }
      });
    }

    function tell(f) {
      var s = st();
      msg.className = 'wd-graph-doctor__msg is-fault';
      msg.innerHTML = '';
      msg.appendChild(h('div', { html: '<span class="wd-graph-doctor__lab">' + esc(f.label) + '</span>' + md(f.why, { inline: true }) }));
      if (s.fixed[f.k]) return;
      var fix = h('button', { type: 'button', class: 'btn btn--go', text: 'Fix it' });
      var blocked = f.needs && !s.fixed[f.needs];
      fix.disabled = !!blocked;
      fix.addEventListener('click', function () {
        s.fixed[f.k] = 1; if (!s.found[f.k]) s.found[f.k] = { i: null };
        active = null; draw();
        msg.className = 'wd-graph-doctor__msg is-fine';
        msg.innerHTML = '<div><b>✔ Fixed.</b> ' + md(f.fixed, { inline: true }) + '</div>';
        var left = faults().filter(function (x) { return !s.found[x.k]; }).length;
        if (!left && faults().every(function (x) { return s.fixed[x.k]; })) msg.innerHTML += '<div>Every fault is fixed. This is how the graph should look. Try another graph.</div>';
      });
      msg.appendChild(fix);
      if (blocked) msg.appendChild(h('div', { class: 'wd-graph-doctor__wait', text: f.wait }));
    }
    function fine(part) {
      var s = st();
      var fixedHere = faults().filter(function (f) { return s.fixed[f.k] && (f.part === part || (f.parts || []).indexOf(part) >= 0); })[0];
      msg.className = 'wd-graph-doctor__msg is-fine';
      msg.innerHTML = '<div><b>✔ ' + (part === 'paper' ? '' : 'This part is fine. ') + '</b>' + md((G().fine || {})[part] || FINE[part] || 'This part is fine.', { inline: true }) +
        (fixedHere ? ' <span class="muted">(You fixed it.)</span>' : '') + '</div>';
    }

    function activate(part, i) {
      var f = faultFor(part);
      if (!f) { active = null; draw(); fine(part); return; }
      var s = st();
      if (!s.found[f.k]) s.found[f.k] = { i: part === f.part ? i : null };
      else if (part === f.part && i != null) s.found[f.k].i = i;   /* a fault shown by "Show all the faults" stays shown, not found */
      active = { f: f };
      draw(); tell(f);
    }

    sheet.addEventListener('click', function (e) {
      var cap = e.target.closest('.wd-graph-doctor__cap');
      if (cap) { activate('caption', null); return; }
      var t = e.target.closest && e.target.closest('.wd-graph-doctor__hit');
      if (!t) return;
      var sh = e.target.getAttribute('data-i');
      activate(t.getAttribute('data-part'), sh == null ? null : +sh);
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target.closest && e.target.closest('.wd-graph-doctor__hit');
      if (!t) return;
      e.preventDefault();
      var part = t.getAttribute('data-part');
      activate(part, null);
      var again2 = svg.querySelector('.wd-graph-doctor__hit[data-part="' + part + '"]');
      if (again2) again2.focus();
    });

    draw(); intro();
  });

  var tool = { name: 'graph-doctor', title: 'Graph doctor', blurb: 'Find every fault in a broken graph, then fix it.', station: 'graphs', lv: 'gie', icon: '✚' };
  if (WUL.tool) WUL.tool(tool); else (WUL.TOOLS = WUL.TOOLS || []).push(tool);
})(window.WUL);
