/* widget: plot-points — "Plot it yourself".
   A short table and an empty grid with labelled, scaled axes. The reader taps where each point
   goes; a small × appears, snapped to the nearest small-square corner. "Check" marks the whole
   answer: points within half a small square are right, and the wrong ones are neither moved nor
   named ("2 of 5 points are in the wrong place: check the scale"). Then: choose how to join the points.
   Keyboard: focus the grid, move with the arrow keys (Shift = a large square), Enter to plot. */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var NS = 'http://www.w3.org/2000/svg';

  function minus(v) { return v < 0 ? '−' + Math.abs(v) : String(v); }
  function signed(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1); }
  /* a table heading may wrap before the solidus, never inside the unit: "Temperature" / "/ °C" */
  function nb(hd) { return hd.replace(/ \/ (.+)$/, function (m, u) { return ' /\u00a0' + u.replace(/ /g, '\u00a0'); }); }

  var JOINS = [
    { id: 'ruled', name: 'Ruled lines, point to point' },
    { id: 'smooth', name: 'A smooth curve' },
    { id: 'best', name: 'A straight line of best fit' },
    { id: 'origin', name: 'A line to the origin' }
  ];
  var VERDICT = { best: '✔ Best here', ok: '✔ Also accepted', no: '✘ Loses the mark', poor: '✘ Not suitable', ask: '✘ Only if the question asks' };

  /* Each grid has square small squares: the plot width and height are in the same ratio as the
     number of small squares along each axis. */
  function sets() {
    var A = WUL.data.amylase, L = WUL.level(), D = L === 'g' ? A.g : A.i;
    return [
      { id: 'amylase', name: 'Amylase',
        caption: L === 'g' ? 'Table 1. Data showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.' : 'Table 2. Processed data showing the effect of temperature (20–60 °C) on the mean time taken for fungal α-amylase to digest starch (n = 5).',
        xh: 'Temperature / °C', yh: 'Mean time / s', xs: D.temps, ys: D.means, fx: String, fy: String,
        spec: { w: 504, h: 354, pad: { l: 64, r: 20, t: 16, b: 58 },
          x: { min: 0, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
          y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' } },
        origin: 'extend',
        joins: {
          ruled: { v: 'ok', t: 'Accepted, but ruled lines suggest the time changes in straight lines between temperatures, and they put the optimum exactly on 50 °C.', g: { v: 'best', t: 'Cambridge advises ruled lines from point to point unless a line of best fit is asked for. The line starts at 20 °C and stops at 60 °C.' } },
          smooth: { v: 'best', t: 'Biology predicts this shape: the rate rises to an optimum, then falls as the enzyme denatures. One thin, smooth curve through the trend shows it best.', ib: 'Do not quote R² for a curve you draw by hand.', g: { v: 'ok', t: 'The points lie on a clear curve, so one thin, smooth curve through them is also accepted. It is harder to draw well than ruled lines.' } },
          best: { v: 'no', t: 'The times fall and then rise again, so no straight line fits them. A straight line hides the minimum at 50 °C.' },
          origin: { v: 'no', t: 'No result was taken at 0 °C, so a line to the origin shows data that do not exist. Examiners report this as the most common graph error.' }
        } },
      { id: 'potato', name: 'Potato and sucrose',
        caption: 'Table 1. ' + (L === 'g' ? 'Data' : 'Processed data') + ' showing the effect of sucrose concentration (0.0–0.5 mol dm⁻³) on the percentage change in mass of potato cylinders.',
        xh: 'Concentration of sucrose / mol dm⁻³', yh: 'Change in mass / %',
        xs: [0, 0.1, 0.2, 0.3, 0.4, 0.5], ys: [12.4, 7.1, 2.6, -2.2, -6.8, -11.3],
        fx: function (v) { return v.toFixed(1); }, fy: signed,
        spec: { w: 414, h: 404, pad: { l: 64, r: 20, t: 16, b: 58 }, tickDpX: 1,
          x: { min: 0, max: 0.6, step: 0.1, minor: 5, label: 'Concentration of sucrose / mol dm⁻³' },
          y: { min: -15, max: 15, step: 5, minor: 5, label: 'Change in mass / %', fmt: minus } },
        zero: true, origin: 'forced',
        joins: {
          ruled: { v: 'ok', t: 'Ruled lines from point to point are always accepted.', g: { v: 'best', t: 'At IGCSE, join the points point to point with a ruler, unless the question asks for a line of best fit.' } },
          smooth: { v: 'poor', t: 'The points lie close to a straight line. A curve through every point adds bends that the trend does not have.' },
          best: { v: 'best', g: { v: 'ask', t: 'The points lie close to a straight line, so a line of best fit would suit them. At IGCSE, draw one only when the question asks for it.' }, t: 'The points lie close to a straight line, so one ruled line of best fit shows the trend. Where it crosses 0 % is the concentration at which the mass does not change.', ib: 'At IB, this fitted straight line is where R² belongs.' },
          origin: { v: 'no', t: 'This line is forced through (0, 0). But at 0.0 mol dm⁻³ the mass increased by 12.4 %, so the origin is not a result.' }
        } },
      { id: 'pondweed', name: 'Pondweed and light',
        caption: 'Table 1. ' + (L === 'g' ? 'Data' : 'Processed data') + ' showing the effect of light intensity (500–3000 lux) on the mean number of bubbles released by pondweed per minute.',
        xh: 'Light intensity / lux', yh: 'Rate / bubbles per minute',
        xs: [500, 1000, 1500, 2000, 2500, 3000], ys: [6, 12, 17, 20, 22, 23], fx: String, fy: String,
        spec: { w: 474, h: 399, pad: { l: 64, r: 20, t: 16, b: 58 },
          x: { min: 0, max: 3000, step: 500, minor: 5, label: 'Light intensity / lux' },
          y: { min: 0, max: 25, step: 5, minor: 5, label: 'Rate / bubbles per minute' } },
        origin: 'extend',
        joins: {
          ruled: { v: 'ok', t: 'Ruled lines from point to point are always accepted.', g: { v: 'best', t: 'At IGCSE, join the points point to point with a ruler, unless the question asks for a curve of best fit.' } },
          smooth: { v: 'best', t: 'The rate rises and then reaches a plateau, so the points clearly lie on a curve. Draw one thin, smooth curve through them.', g: { v: 'ok', t: 'The points lie on a clear curve, so one thin, smooth curve through them is also accepted. It must be smooth: never sketchy or freehand.' } },
          best: { v: 'no', t: 'The rate reaches a plateau at high light intensity. A straight line misses that pattern.' },
          origin: { v: 'no', t: 'No result was taken at 0 lux. The line must start at the first point, 500 lux.' }
        } }
    ];
  }

  var CSS =
    '.wd-plot-points{display:grid;gap:14px}' +
    '.wd-plot-points__sets{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
    '.wd-plot-points .seg{flex-wrap:wrap}' +
    '.wd-plot-points .seg button{min-height:40px}' +
    '.wd-plot-points__main{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr);grid-template-areas:"t g" "c g";grid-template-rows:auto 1fr;gap:12px 18px;align-items:start}' +
    '.wd-plot-points__side{display:grid;gap:12px;grid-area:t}' +
    '.wd-plot-points__ctl{display:grid;gap:10px;grid-area:c}' +
    '.wd-plot-points__g{grid-area:g;min-width:0}' +
    '.wd-plot-points__side table.dt{font-size:.86rem}' +
    '.wd-plot-points__side table.dt td,.wd-plot-points__side table.dt th{padding:5px 8px}' +
    '.wd-plot-points__side table.dt th{font-size:.8rem;line-height:1.25}' +
    '.wd-plot-points__count{font:600 .85rem/1.3 var(--mono);color:var(--ink-2)}' +
    '.wd-plot-points__count b{color:var(--lvl)}' +
    '.wd-plot-points__grid{position:relative;border-radius:var(--r);outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent}' +
    '.wd-plot-points__grid:focus-visible{box-shadow:0 0 0 2px var(--blue)}' +
    '.wd-plot-points__grid svg{cursor:crosshair;max-width:560px}' +
    '.wd-plot-points__grid.is-locked svg{cursor:default}' +
    '.wd-plot-points__ghost path{stroke:var(--lvl);stroke-width:1.6;fill:none;opacity:.55}' +
    '.wd-plot-points__cursor rect{fill:none;stroke:var(--blue);stroke-width:1.2;stroke-dasharray:3 2}' +
    '.wd-plot-points__cursor path{stroke:var(--blue);stroke-width:1.6;fill:none}' +
    '.wd-plot-points__last{fill:none;stroke:var(--lvl);stroke-width:1.3;stroke-dasharray:3 2.5}' +
    '.wd-plot-points__zero{stroke:var(--ink-3);stroke-width:1.3}' +
    '.wd-plot-points__nudge{display:grid;grid-template-columns:repeat(4,44px);gap:6px}' +
    '.wd-plot-points__nudge button{min-height:44px;padding:0;font-size:1.05rem}' +
    '.wd-plot-points__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.wd-plot-points__join{display:grid;gap:10px;border-top:1px dashed var(--rule);padding-top:14px}' +
    '.wd-plot-points__jopts{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}' +
    '.wd-plot-points__jopt{appearance:none;text-align:left;padding:10px 12px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);cursor:pointer;font:600 .93rem/1.3 var(--sans);color:var(--ink);min-height:44px}' +
    '.wd-plot-points__jopt:hover{border-color:var(--ink-3)}' +
    '.wd-plot-points__jopt[aria-pressed="true"]{border-color:var(--lvl);background:var(--lvl-wash)}' +
    '.wd-plot-points__jopt.v-best,.wd-plot-points__jopt.v-ok{border-color:var(--green)}' +
    '.wd-plot-points__jopt.v-no,.wd-plot-points__jopt.v-poor,.wd-plot-points__jopt.v-ask{border-color:var(--red)}' +
    '.wd-plot-points__verdict{padding:10px 14px;border-radius:var(--r);font-size:.97rem;line-height:1.5}' +
    '.wd-plot-points__verdict.v-best,.wd-plot-points__verdict.v-ok{background:var(--green-wash)}' +
    '.wd-plot-points__verdict.v-no,.wd-plot-points__verdict.v-poor,.wd-plot-points__verdict.v-ask{background:var(--red-wash)}' +
    '.wd-plot-points__verdict b{margin-right:4px}' +
    '.wd-plot-points__verdict.v-best b,.wd-plot-points__verdict.v-ok b{color:var(--green)}' +
    '.wd-plot-points__verdict.v-no b,.wd-plot-points__verdict.v-poor b,.wd-plot-points__verdict.v-ask b{color:var(--red)}' +
    '@media (max-width:560px){.wd-plot-points.wd-panel{padding:12px 8px}}' +
    '@media (max-width:700px){.wd-plot-points__main{grid-template-columns:1fr;grid-template-areas:"t" "g" "c"}.wd-plot-points__side table.dt{width:100%}}';

  WUL.widget('plot-points', function (host) {
    WUL.css('plot-points', CSS);
    var L = WUL.level();
    var SETS = sets(), ds = SETS[0];
    var P = [];              /* the reader's points, as small-square indices {ix, iy}, in the order placed */
    var cur = null;          /* keyboard cursor {ix, iy} */
    var checked = false, join = null;
    var svg, sc, nx, ny, xres, yres;

    var root = h('div', { class: 'wd-plot-points wd-panel' });
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Choose a data set' });
    SETS.forEach(function (s) {
      var b = h('button', { type: 'button', 'aria-pressed': s === ds ? 'true' : 'false', text: s.name, 'data-id': s.id });
      b.addEventListener('click', function () { ds = s; seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); reset(); });
      seg.appendChild(b);
    });
    root.appendChild(h('div', { class: 'wd-plot-points__sets' }, [h('span', { class: 'wd-k', text: 'Data' }), seg]));

    var main = h('div', { class: 'wd-plot-points__main' });
    var side = h('div', { class: 'wd-plot-points__side' });
    var tableHost = h('div');
    var count = h('div', { class: 'wd-plot-points__count', 'aria-live': 'polite' });
    var help = h('p', { class: 'hint', html: 'Tap the grid where each point goes. A small cross appears on the nearest small-square corner. Tap a cross again to remove it.' });
    var nudge = h('div', { class: 'wd-plot-points__nudge', role: 'group', 'aria-label': 'Move the last point by one small square' });
    [['←', -1, 0, 'left'], ['→', 1, 0, 'right'], ['↑', 0, 1, 'up'], ['↓', 0, -1, 'down']].forEach(function (d) {
      var b = h('button', { type: 'button', class: 'btn btn--ghost', text: d[0], 'aria-label': 'Move the last point ' + d[3] });
      b.addEventListener('click', function () { move(d[1], d[2]); });
      nudge.appendChild(b);
    });
    /* table · grid · controls: side by side on a wide screen; on a phone the grid comes straight after the table */
    side.appendChild(tableHost);
    var ctl = h('div', { class: 'wd-plot-points__ctl' }, [count, help, h('div', { class: 'wd-k', text: 'Move the last point' }), nudge]);
    var gridWrap = h('div', { class: 'wd-plot-points__g' });
    var grid = h('div', { class: 'wd-plot-points__grid', tabindex: '0', role: 'application', 'aria-label': 'Graph grid. Use the arrow keys to move, Enter to plot or remove a point.' });
    var sr = h('div', { class: 'wd-plot-points__sr', 'aria-live': 'polite' });
    gridWrap.appendChild(grid); gridWrap.appendChild(sr);
    main.appendChild(side); main.appendChild(gridWrap); main.appendChild(ctl);
    root.appendChild(main);

    var undo = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Undo last point' });
    var clear = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Clear' });
    var check = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
    root.appendChild(h('div', { class: 'wd-row' }, [check, undo, clear]));
    var fb = h('div', { 'aria-live': 'polite' });
    root.appendChild(fb);
    var joinBox = h('div', { class: 'wd-plot-points__join', hidden: true });
    root.appendChild(joinBox);
    host.appendChild(root);

    undo.addEventListener('click', function () { if (!P.length) return; P.pop(); unlock(); draw(); say(''); });
    clear.addEventListener('click', function () { P = []; unlock(); draw(); say(''); });
    check.addEventListener('click', doCheck);

    function n() { return ds.xs.length; }
    function unlock() { checked = false; join = null; joinBox.hidden = true; joinBox.innerHTML = ''; }
    function reset() { P = []; cur = null; unlock(); fb.innerHTML = ''; setup(); }
    function say(html, ok) {
      fb.innerHTML = html ? '<div class="fb ' + (ok ? 'fb--ok' : 'fb--no') + '">' + html + '</div>' : '';
    }
    function val(ix, iy) { return [ds.spec.x.min + ix * xres, ds.spec.y.min + iy * yres]; }
    function sorted() { return P.slice().sort(function (a, b) { return a.ix - b.ix; }).map(function (p) { return val(p.ix, p.iy); }); }

    function setup() {
      var X = ds.spec.x, Y = ds.spec.y;
      xres = X.step / X.minor; yres = Y.step / Y.minor;
      nx = Math.round((X.max - X.min) / xres); ny = Math.round((Y.max - Y.min) / yres);
      /* on a phone: a narrower picture, so the numbers are drawn larger; the small squares stay square */
      if (!ds.wide) ds.wide = ds.spec;
      if (window.innerWidth < 560) {
        var pw = 330;
        ds.spec = Object.assign({}, ds.wide, { w: 60 + pw + 10, h: Math.round(12 + pw * ny / nx + 50), pad: { l: 60, r: 10, t: 12, b: 50 } });
      } else ds.spec = ds.wide;
      sc = WUL.plotScale(ds.spec);
      tableHost.innerHTML = WUL.table({ caption: ds.caption, head: [[nb(ds.xh), nb(ds.yh)]], rows: ds.xs.map(function (x, k) { return [ds.fx(x), ds.fy(ds.ys[k])]; }) });
      draw();
    }

    /* the reader's crosses, and the chosen line, are drawn by WUL.plot like every graph on the site */
    function draw() {
      var S = sorted(), series = [];
      if (checked && join) {
        var jl = { ruled: 'ruled', smooth: 'smooth', best: 'best', origin: 'ruled' }[join];
        if (join === 'origin' && ds.origin === 'forced') {
          var sxy = 0, sxx = 0; S.forEach(function (p) { sxy += p[0] * p[1]; sxx += p[0] * p[0]; });
          var m = sxy / sxx, xe = S[S.length - 1][0];
          series.push({ id: 'o', pts: [[0, 0], [xe, m * xe]], line: 'ruled', mark: 'none' });
          series.push({ id: 's', pts: S, mark: 'x' });
        } else {
          series.push({ id: 's', pts: S, mark: 'x', line: jl, tone: 'ink', extend: join === 'origin' ? [0] : null, extendY: join === 'origin' ? [0] : null });
        }
      } else if (P.length) {
        series.push({ id: 's', pts: P.map(function (p) { return val(p.ix, p.iy); }), mark: 'x' });
      }
      grid.innerHTML = WUL.plot(Object.assign({}, ds.spec, { series: series, alt: 'Graph grid for ' + ds.name }));
      svg = grid.querySelector('svg');
      var top = el('g', {});
      if (ds.zero) top.appendChild(el('line', { class: 'wd-plot-points__zero', x1: sc.L, x2: sc.L + sc.pw, y1: sc.py(0), y2: sc.py(0) }));
      if (P.length && !checked) {
        var lp = P[P.length - 1], v = val(lp.ix, lp.iy);
        top.appendChild(el('circle', { class: 'wd-plot-points__last', cx: sc.px(v[0]), cy: sc.py(v[1]), r: 9 }));
      }
      /* the zero line goes under the crosses: put it straight after the paper */
      var paper = svg.querySelector('[data-el="paper"]');
      if (paper && paper.nextSibling) svg.insertBefore(top, paper.nextSibling); else svg.appendChild(top);
      grid.classList.toggle('is-locked', checked);
      count.innerHTML = 'Points plotted: <b>' + P.length + '</b> of ' + n();
      undo.disabled = !P.length; clear.disabled = !P.length;
      nudge.querySelectorAll('button').forEach(function (b) { b.disabled = !P.length || checked; });
      if (cur && kbd()) showCursor();
    }
    function el(tag, attrs) {
      var e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      return e;
    }
    function crossPath(x, y) { return 'M' + (x - 4.5) + ' ' + (y - 4.5) + 'L' + (x + 4.5) + ' ' + (y + 4.5) + 'M' + (x + 4.5) + ' ' + (y - 4.5) + 'L' + (x - 4.5) + ' ' + (y + 4.5); }

    /* screen → small-square indices (null if outside the grid) */
    function snap(evt) {
      var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      var m = svg.getScreenCTM(); if (!m) return null;
      var p = pt.matrixTransform(m.inverse());
      var fx = (p.x - sc.L) / sc.pw * nx, fy = (sc.T + sc.ph - p.y) / sc.ph * ny;
      if (fx < -0.6 || fy < -0.6 || fx > nx + 0.6 || fy > ny + 0.6) return null;
      return { ix: Math.max(0, Math.min(nx, Math.round(fx))), iy: Math.max(0, Math.min(ny, Math.round(fy))) };
    }
    function at(q) { for (var k = 0; k < P.length; k++) if (P[k].ix === q.ix && P[k].iy === q.iy) return k; return -1; }
    function place(q) {
      if (checked) { say('These points are checked. Press <b>Undo last point</b> or <b>Clear</b> to change them.'); return; }
      var k = at(q);
      if (k >= 0) { P.splice(k, 1); draw(); say(''); sr.textContent = 'Point removed.'; return; }
      if (P.length >= n()) { say('All ' + n() + ' points are plotted. Tap a cross to remove it, or press <b>Undo last point</b>.'); return; }
      P.push({ ix: q.ix, iy: q.iy }); draw(); say('');
      sr.textContent = 'Point ' + P.length + ' plotted.';
    }
    function move(dx, dy) {
      if (!P.length || checked) return;
      var lp = P[P.length - 1];
      var q = { ix: Math.max(0, Math.min(nx, lp.ix + dx)), iy: Math.max(0, Math.min(ny, lp.iy + dy)) };
      if (at(q) >= 0) return;
      lp.ix = q.ix; lp.iy = q.iy; draw(); say('');
    }

    grid.addEventListener('click', function (e) {
      if (!svg) return;
      var q = snap(e);
      if (!q) { say('Tap inside the grid.'); return; }
      cur = q; place(q);
    });
    grid.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || checked || !svg) return;
      var q = snap(e), g = svg.querySelector('.wd-plot-points__ghost');
      if (g) g.remove();
      if (!q) return;
      var v = val(q.ix, q.iy), gg = el('g', { class: 'wd-plot-points__ghost' });
      gg.appendChild(el('path', { d: crossPath(sc.px(v[0]), sc.py(v[1])) }));
      svg.appendChild(gg);
    });
    grid.addEventListener('pointerleave', function () { var g = svg && svg.querySelector('.wd-plot-points__ghost'); if (g) g.remove(); });

    /* keyboard */
    function showCursor() {
      var old = svg.querySelector('.wd-plot-points__cursor'); if (old) old.remove();
      if (!cur) return;
      var v = val(cur.ix, cur.iy), x = sc.px(v[0]), y = sc.py(v[1]);
      var g = el('g', { class: 'wd-plot-points__cursor' });
      g.appendChild(el('rect', { x: x - 8, y: y - 8, width: 16, height: 16 }));
      if (!checked) g.appendChild(el('path', { d: crossPath(x, y) }));
      svg.appendChild(g);
    }
    /* the keyboard cursor only shows when the grid was reached by keyboard, not by a tap */
    function kbd() { try { return document.activeElement === grid && grid.matches(':focus-visible'); } catch (e) { return false; } }
    grid.addEventListener('focus', function () { if (!kbd()) return; if (!cur) cur = { ix: Math.round(nx / 2), iy: Math.round(ny / 2) }; showCursor(); });
    grid.addEventListener('blur', function () { var c = svg && svg.querySelector('.wd-plot-points__cursor'); if (c) c.remove(); });
    grid.addEventListener('keydown', function (e) {
      var k = e.key, big = e.shiftKey ? ds.spec.x.minor : 1, bigY = e.shiftKey ? ds.spec.y.minor : 1;
      if (!cur) cur = { ix: Math.round(nx / 2), iy: Math.round(ny / 2) };
      if (k === 'ArrowLeft') cur.ix = Math.max(0, cur.ix - big);
      else if (k === 'ArrowRight') cur.ix = Math.min(nx, cur.ix + big);
      else if (k === 'ArrowUp') cur.iy = Math.min(ny, cur.iy + bigY);
      else if (k === 'ArrowDown') cur.iy = Math.max(0, cur.iy - bigY);
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); place({ ix: cur.ix, iy: cur.iy }); showCursor(); return; }
      else return;
      e.preventDefault();
      showCursor();
      var v = val(cur.ix, cur.iy);
      sr.textContent = ds.xh.split(' / ')[0] + ' ' + (+v[0].toFixed(3)) + ', ' + ds.yh.split(' / ')[0] + ' ' + (+v[1].toFixed(3));
    });

    /* whole-answer marking: each data point needs its own cross within half a small square */
    function doCheck() {
      if (checked) return;
      var N = n();
      if (P.length < N) { say('Plot all ' + N + ' points first. You have ' + P.length + '.'); return; }
      var used = {}, right = 0;
      ds.xs.forEach(function (x, k) {
        var tx = (x - ds.spec.x.min) / xres, ty = (ds.ys[k] - ds.spec.y.min) / yres;
        for (var j = 0; j < P.length; j++) {
          if (used[j]) continue;
          if (Math.abs(P[j].ix - tx) <= 0.5 + 1e-6 && Math.abs(P[j].iy - ty) <= 0.5 + 1e-6) { used[j] = 1; right++; break; }
        }
      });
      var off = N - right;
      if (off) {
        say('<span class="fb__k">✘ Not yet.</span> ' + off + ' of ' + N + ' points ' + (off === 1 ? 'is' : 'are') + ' in the wrong place: check the scale. Your points are kept as you left them.');
        return;
      }
      checked = true; draw();
      say('<span class="fb__k">✔ Right.</span> All ' + N + ' points are within half a small square. Now choose how to join them.', true);
      showJoin();
    }

    function showJoin() {
      joinBox.hidden = false; joinBox.innerHTML = '';
      joinBox.appendChild(h('div', { class: 'wd-k', text: 'Step 2 · How should the points be joined?' }));
      var opts = h('div', { class: 'wd-plot-points__jopts', role: 'group', 'aria-label': 'How to join the points' });
      var out = h('div', { 'aria-live': 'polite' });
      JOINS.forEach(function (j) {
        var b = h('button', { type: 'button', class: 'wd-plot-points__jopt', 'aria-pressed': 'false', text: j.name, 'data-j': j.id });
        b.addEventListener('click', function () {
          join = j.id; draw();
          var J = ds.joins[j.id];
          if (L === 'g' && J.g) J = Object.assign({}, J, J.g);
          opts.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          b.classList.add('v-' + J.v);
          out.innerHTML = '<div class="wd-plot-points__verdict v-' + J.v + '"><b>' + esc(VERDICT[J.v]) + '.</b> ' + md(J.t, { inline: true }) + (J.ib && L !== 'g' ? ' ' + md(J.ib, { inline: true }) : '') + '</div>';
        });
        opts.appendChild(b);
      });
      joinBox.appendChild(opts);
      joinBox.appendChild(out);
      joinBox.appendChild(h('p', { class: 'hint', text: 'Try each one: the graph redraws, and the note explains the choice.' }));
    }

    setup();
  });

  var tool = { name: 'plot-points', title: 'Plot it yourself', blurb: 'Plot the points on a grid, check them, then choose how to join them.', station: 'graphs', lv: 'gie', icon: '×' };
  if (WUL.tool) WUL.tool(tool); else (WUL.TOOLS = WUL.TOOLS || []).push(tool);
})(window.WUL);
