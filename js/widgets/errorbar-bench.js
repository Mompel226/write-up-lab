/* ============================================================
   widget: errorbar-bench — the error-bar bench.

   Mode 1 "One set of seven": seven seedling heights on a vertical
   number line. Each can be nudged with ▲/▼ (0.1 cm) or dragged. The
   mean is drawn with range, ± 1 SD and ± 1 SE bars side by side, all
   from the same seven values. SD is the sample SD (n − 1), exactly as
   =STDEV.S; SE = SD ÷ √n.

   Mode 2 "Do they differ?": two groups from the site's running
   examples (WUL.data). The reader judges whether the bars overlap and
   is told what can and cannot be claimed. At IB a t-test settles it
   (Student's two-sample t-test, df = n₁ + n₂ − 2; p from the
   regularised incomplete beta function — checked against tables:
   t = 2.306, df = 8 gives p = 0.050).

   Nothing moves on by itself: every change is a button or a drag.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var NAME = 'errorbar-bench', C = 'wd-errorbar-bench';

  /* WUL.tool lives in app.js, which loads after the widgets; push straight onto the list if it is not there yet */
  var TOOL = { name: NAME, title: 'Error-bar bench', blurb: 'Move seven values and watch the range, SD and SE bars change.', station: 'errorbars', lv: 'ie', icon: '±' };
  if (WUL.tool) WUL.tool(TOOL); else (WUL.TOOLS = WUL.TOOLS || []).push(TOOL);

  /* ---------- numbers ---------- */
  var START = [41.0, 42.0, 42.5, 43.0, 43.5, 44.5, 44.5];      /* the seven heights of Figure 1 on the Error bars page */
  var PRESETS = [
    { id: 'tight', label: 'Close together', v: [42.6, 42.8, 43.0, 43.0, 43.1, 43.2, 43.3] },
    { id: 'spread', label: 'Widely spread', v: [40.2, 41.4, 42.5, 43.0, 43.9, 44.7, 45.3] },
    { id: 'anomaly', label: 'One anomaly', v: [42.6, 42.8, 43.0, 43.0, 43.1, 43.2, 48.6] },
    { id: 'start', label: 'Start again', v: START }
  ];
  var YMIN = 36, YMAX = 50, STEP = 0.1;
  var KINDS = [
    { id: 'range', label: 'Range', tone: 'ink', col: 'var(--ink)' },
    { id: 'sd', label: '± 1 SD', tone: 'blue', col: 'var(--blue)' },
    { id: 'se', label: '± 1 SE', tone: 'plum', col: 'var(--plum)' }
  ];

  function r1(v) { return Math.round(v * 10) / 10; }
  function clamp(v) { return Math.min(YMAX, Math.max(YMIN, r1(v))); }
  function stats(v) {
    var n = v.length, s = WUL.sd(v);
    return { n: n, mean: WUL.mean(v), sd: s, se: s / Math.sqrt(n), min: Math.min.apply(null, v), max: Math.max.apply(null, v) };
  }

  /* p for Student's t: two-tailed p = I_{df/(df+t²)}(df/2, 1/2) */
  function gammaln(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, tmp = x + 5.5, ser = 1.000000000190015, j;
    tmp -= (x + 0.5) * Math.log(tmp);
    for (j = 0; j < 6; j++) ser += c[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap, m, m2, aa, del, hh;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    d = 1 / d; hh = d;
    for (m = 1; m <= 200; m++) {
      m2 = 2 * m; aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; hh *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; del = d * c; hh *= del;
      if (Math.abs(del - 1) < 3e-14) break;
    }
    return hh;
  }
  function ibeta(a, b, x) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function tTest(A, B) {
    var df = A.n + B.n - 2;
    var sp2 = ((A.n - 1) * A.sd * A.sd + (B.n - 1) * B.sd * B.sd) / df;
    var t = Math.abs(A.mean - B.mean) / Math.sqrt(sp2 * (1 / A.n + 1 / B.n));
    return { t: t, df: df, p: ibeta(df / 2, 0.5, df / (df + t * t)) };
  }
  function pText(p) {
    if (p < 0.001) return 'p < 0.001';
    return 'p = ' + (p < 0.1 ? p.toFixed(3) : p.toFixed(2));
  }

  /* ---------- styles ---------- */
  function styles() {
    WUL.css(NAME,
      '.' + C + '{display:grid;gap:14px}' +
      '.' + C + '__bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
      '.' + C + '__bar .seg{flex-wrap:wrap}' +
      '.' + C + '__intro{font-size:.97rem;color:var(--ink-2);max-width:70ch}' +
      '.' + C + '__main{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:18px;align-items:start}' +
      '@media (max-width:820px){.' + C + '__main{grid-template-columns:minmax(0,1fr)}}' +
      '.' + C + '__plotwrap{position:relative;width:100%;max-width:520px}' +
      '.' + C + '__plotwrap .plot{max-width:none}' +
      '.' + C + '__drag{position:absolute;touch-action:none;cursor:ns-resize;border-radius:4px}' +
      '.' + C + '__drag:hover{background:var(--hl-soft)}' +
      '.' + C + '__dot{fill:var(--sheet);stroke:var(--ink);stroke-width:2}' +
      '.' + C + '__dot.is-hi{fill:var(--hl);stroke-width:2.8}' +
      '.' + C + '__dot.is-odd{stroke:var(--amber);stroke-width:3}' +
      '.' + C + '__mean{stroke:var(--ink-3);stroke-width:1.3;stroke-dasharray:5 4}' +
      '.' + C + '__strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;max-width:560px}' +
      '.' + C + '__cell{display:grid;justify-items:stretch;gap:3px;padding:4px 3px 5px;border:1px solid var(--rule);border-radius:var(--r);background:var(--sheet);text-align:center}' +
      '.' + C + '__cell.is-hi{border-color:var(--ink);background:var(--hl-soft)}' +
      '.' + C + '__n{font:600 .64rem/1 var(--mono);color:var(--ink-3);padding-top:2px}' +
      '.' + C + '__nb{appearance:none;border:1px solid var(--rule);background:var(--sheet-2);border-radius:3px;min-height:34px;padding:0;cursor:pointer;font-size:.78rem;line-height:1;color:var(--ink)}' +
      '.' + C + '__nb:hover{border-color:var(--ink-3)}' +
      '.' + C + '__v{font:600 .82rem/1.2 var(--mono);font-variant-numeric:tabular-nums}' +
      '.' + C + '__hint{font-size:.84rem;color:var(--ink-3);margin-top:6px}' +
      '.' + C + '__nums{display:grid;gap:8px}' +
      '.' + C + '__row{display:grid;grid-template-columns:14px minmax(0,1fr);gap:9px;align-items:start;padding:8px 11px;border:1px solid var(--rule-2);border-radius:var(--r);background:var(--sheet)}' +
      '.' + C + '__sw{width:12px;height:12px;border-radius:2px;margin-top:6px;background:var(--ink-3)}' +
      '.' + C + '__k{font-weight:600}' +
      '.' + C + '__val{font:600 .95rem/1.4 var(--mono);font-variant-numeric:tabular-nums}' +
      '.' + C + '__f{display:block;font:500 .78rem/1.45 var(--mono);color:var(--ink-2);overflow-wrap:anywhere}' +
      '.' + C + '__note{font-size:.95rem;line-height:1.55;padding:10px 14px;border-radius:var(--r);background:var(--sheet-2);border:1px solid var(--rule-2)}' +
      '.' + C + '__note p+p{margin-top:.5em}' +
      '.' + C + '__note.is-warn{background:var(--amber-wash);border-color:transparent}' +
      '.' + C + '__q{font:500 1.08rem/1.4 var(--serif);margin-bottom:8px}' +
      '.' + C + '__ans{display:flex;flex-wrap:wrap;gap:8px}' +
      '.' + C + '__ans .btn[aria-pressed="true"]{border-color:var(--lvl);background:var(--lvl-wash)}' +
      '.' + C + '__claims{display:grid;gap:8px;margin-top:10px}' +
      '.' + C + '__can,.' + C + '__cannot{padding:9px 12px;border-radius:var(--r);font-size:.96rem;line-height:1.5}' +
      '.' + C + '__can{background:var(--green-wash)}' +
      '.' + C + '__cannot{background:var(--red-wash)}' +
      '.' + C + '__can b{color:var(--green)} .' + C + '__cannot b{color:var(--red)}' +
      '.' + C + '__ends{font:500 .86rem/1.5 var(--mono);color:var(--ink-2);margin-top:6px;overflow-wrap:anywhere}' +
      '.' + C + '__band{fill:var(--hl);opacity:.75}' +
      '.' + C + '__bandt{font:600 12px var(--sans);fill:var(--ink)}' +
      '.' + C + '__tt{margin-top:10px}' +
      '.' + C + '__side{display:grid;gap:12px}'
    );
  }

  /* ---------- the widget ---------- */
  WUL.widget(NAME, function (host, opts, ctx) {
    styles();
    var level = (ctx && ctx.level) || WUL.level();
    var ib = level !== 'g';
    host.innerHTML = '';
    var root = h('div', { class: C });
    host.appendChild(root);

    var modeBar = h('div', { class: C + '__bar' });
    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Choose what to do' });
    var mA = h('button', { type: 'button', 'aria-pressed': 'true', text: 'One set of seven' });
    var mB = h('button', { type: 'button', 'aria-pressed': 'false', text: 'Do they differ?' });
    seg.appendChild(mA); seg.appendChild(mB);
    modeBar.appendChild(seg);
    root.appendChild(modeBar);
    var body = h('div');
    root.appendChild(body);

    function setMode(b) {
      mA.setAttribute('aria-pressed', b ? 'false' : 'true');
      mB.setAttribute('aria-pressed', b ? 'true' : 'false');
      body.innerHTML = '';
      if (b) modeB(body); else modeA(body);
    }
    mA.addEventListener('click', function () { setMode(false); });
    mB.addEventListener('click', function () { setMode(true); });
    setMode(opts && opts.mode === 'differ');

    /* =============== mode 1: one set of seven =============== */
    function modeA(box) {
      var v = START.slice(), hi = -1, preset = 'start';
      var spec = function (st) {
        return {
          w: 420, h: 330, pad: { l: 54, r: 10, t: 12, b: 32 },
          x: { cat: ['7 values', 'Range', '± 1 SD', '± 1 SE'] },
          y: { min: YMIN, max: YMAX, step: 2, minor: 4, label: 'Height of seedling / cm' },
          series: [
            { id: 'rg', pts: [[1.5, st.mean]], errLo: [st.mean - st.min], errHi: [st.max - st.mean], mark: 'x', line: 'none', tone: 'ink' },
            { id: 'sd', pts: [[2.5, st.mean]], err: [st.sd], mark: 'x', line: 'none', tone: 'blue' },
            { id: 'se', pts: [[3.5, st.mean]], err: [st.se], mark: 'x', line: 'none', tone: 'plum' }
          ],
          alt: 'Seven heights of seedlings, with the mean shown three times: with a range bar, a one standard deviation bar and a one standard error bar.'
        };
      };

      box.appendChild(h('p', { class: C + '__intro', html: md('Seven bean seedlings were measured, in cm. Move any value with ▲ and ▼, or drag its circle up and down. All three bars are calculated from the __same__ seven values.', { inline: true }) }));
      var pbar = h('div', { class: C + '__bar' });
      pbar.appendChild(h('span', { class: 'wd-k', text: 'Try' }));
      var pseg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Ready-made sets of values' });
      PRESETS.forEach(function (p) {
        var b = h('button', { type: 'button', 'aria-pressed': p.id === preset ? 'true' : 'false', 'data-p': p.id, text: p.label });
        b.addEventListener('click', function () { preset = p.id; v = p.v.slice(); paintPresets(); draw(true); });
        pseg.appendChild(b);
      });
      pbar.appendChild(pseg);
      box.appendChild(pbar);
      function paintPresets() { pseg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-p') === preset ? 'true' : 'false'); }); }

      var main = h('div', { class: C + '__main' });
      var left = h('div');
      var wrap = h('div', { class: C + '__plotwrap' });
      var holder = h('div');                     /* redrawn on every change */
      var drag = h('div', { class: C + '__drag', 'aria-hidden': 'true' });   /* never redrawn: keeps the pointer during a drag */
      wrap.appendChild(holder); wrap.appendChild(drag);
      left.appendChild(wrap);
      var strip = h('div', { class: C + '__strip', role: 'group', 'aria-label': 'The seven heights. Use the arrows to change each one.' });
      left.appendChild(strip);
      left.appendChild(h('p', { class: C + '__hint', text: 'Each tap moves a value by 0.1 cm.' }));
      var side = h('div', { class: C + '__side' });
      var nums = h('div', { class: C + '__nums', 'aria-live': 'polite' });
      var note = h('div', { class: C + '__note', 'aria-live': 'polite' });
      side.appendChild(nums); side.appendChild(note);
      main.appendChild(left); main.appendChild(side);
      box.appendChild(main);

      /* the strip of ▲ value ▼ controls */
      var cells = [];
      v.forEach(function (val, i) {
        var up = h('button', { type: 'button', class: C + '__nb', 'aria-label': 'Seedling ' + (i + 1) + ': raise by 0.1 cm', text: '▲' });
        var out = h('span', { class: C + '__v', 'aria-live': 'off' });
        var dn = h('button', { type: 'button', class: C + '__nb', 'aria-label': 'Seedling ' + (i + 1) + ': lower by 0.1 cm', text: '▼' });
        var cell = h('div', { class: C + '__cell' }, [h('span', { class: C + '__n', text: String(i + 1) }), up, out, dn]);
        up.addEventListener('click', function () { nudge(i, STEP); });
        dn.addEventListener('click', function () { nudge(i, -STEP); });
        cell.addEventListener('focusin', function () { hi = i; draw(false); });
        cell.addEventListener('mouseenter', function () { hi = i; draw(false); });
        cell.addEventListener('mouseleave', function () { if (!cell.contains(document.activeElement)) { hi = -1; draw(false); } });
        cell.addEventListener('focusout', function (e) { if (!cell.contains(e.relatedTarget)) { hi = -1; draw(false); } });
        strip.appendChild(cell);
        cells.push({ cell: cell, out: out });
      });
      function nudge(i, d) { v[i] = clamp(v[i] + d); preset = ''; paintPresets(); hi = i; draw(true); }

      /* an odd value: more than 4 SD (and at least 1 cm) from the mean of the other six */
      function oddOne() {
        var best = -1, bestZ = 0;
        v.forEach(function (x, i) {
          var o = v.filter(function (y, j) { return j !== i; });
          var m = WUL.mean(o), s = WUL.sd(o), dist = Math.abs(x - m);
          if (dist >= 1 && s > 0 && dist > 4 * s && dist / s > bestZ) { best = i; bestZ = dist / s; }
        });
        return best;
      }

      var sc = null;
      function draw(full) {
        var st = stats(v), sp = spec(st), odd = oddOne();
        sc = WUL.plotScale(sp);
        var ov = '<g aria-hidden="true">';
        ov += '<line class="' + C + '__mean" x1="' + sc.px(0.06).toFixed(1) + '" y1="' + sc.py(st.mean).toFixed(1) + '" x2="' + sc.px(3.94).toFixed(1) + '" y2="' + sc.py(st.mean).toFixed(1) + '"/>';
        v.forEach(function (val, i) {
          ov += '<circle class="' + C + '__dot' + (i === hi ? ' is-hi' : '') + (i === odd ? ' is-odd' : '') + '" cx="' + sc.px(0.5 + (i - 3) * 0.1).toFixed(1) + '" cy="' + sc.py(val).toFixed(1) + '" r="6.5"/>';
        });
        ov += '</g>';
        holder.innerHTML = WUL.plot(sp).replace('</svg>', ov + '</svg>');
        drag.style.left = (sc.px(0) / sc.W * 100) + '%';
        drag.style.width = ((sc.px(1) - sc.px(0)) / sc.W * 100) + '%';
        drag.style.top = (sc.T / sc.H * 100) + '%';
        drag.style.height = (sc.ph / sc.H * 100) + '%';
        cells.forEach(function (c, i) { c.out.textContent = WUL.fix(v[i], 1); c.cell.classList.toggle('is-hi', i === hi); });
        if (!full) return;
        var u = ' cm';
        nums.innerHTML =
          row('var(--ink-3)', 'Mean', WUL.fix(st.mean, 1) + u, '=AVERAGE(B2:B8)') +
          row(KINDS[0].col, 'Range', WUL.fix(st.min, 1) + ' to ' + WUL.fix(st.max, 1) + u + ' (' + WUL.fix(st.max - st.min, 1) + u + ')', '=MIN(B2:B8) and =MAX(B2:B8)') +
          row(KINDS[1].col, 'Standard deviation', '± ' + WUL.fix(st.sd, 2) + u, '=STDEV.S(B2:B8)') +
          row(KINDS[2].col, 'Standard error', '± ' + WUL.fix(st.se, 2) + u + ' = SD ÷ √7', '=STDEV.S(B2:B8)/SQRT(COUNT(B2:B8))');
        var says = [];
        if (odd >= 0) {
          says.push('<p><b>Seedling ' + (odd + 1) + ' (' + WUL.fix(v[odd], 1) + ' cm) is far from the other six.</b> One unusual value changes the __range__ most: one end of the range moves to that value. The SD increases less, because every value counts in it.</p>');
          says.push('<p>Before you use it, check it: is it an anomalous result, or real variation between plants?</p>');
          note.className = C + '__note is-warn';
        } else {
          note.className = C + '__note';
          says.push('<p>The __range__ is set by the two most extreme values only. The __SD__ uses every value. The __SE__ is the SD ÷ √7, so it is always the shortest.</p>');
          says.push('<p>' + (st.sd < 0.5 ? 'The values are close together, so every bar is short.' : st.sd > 1.6 ? 'The values are widely spread, so every bar is long. More seedlings would not reduce the SD, but they would reduce the SE.' : 'Try <b>One anomaly</b> to see which bar one unusual value changes most.') + '</p>');
        }
        note.innerHTML = says.map(function (p) { return p.replace(/__(.+?)__/g, '<u>$1</u>'); }).join('');
      }
      function row(col, k, val, f) {
        return '<div class="' + C + '__row"><span class="' + C + '__sw" style="background:' + col + '"></span><span><span class="' + C + '__k">' + esc(k) + '</span> <span class="' + C + '__val">' + esc(val) + '</span><span class="' + C + '__f">' + esc(f) + '</span></span></div>';
      }

      /* dragging: an HTML layer over the first column, so touch dragging never scrolls the page */
      var dragging = -1;
      function valueAt(clientY) {
        var svg = holder.querySelector('svg'); if (!svg || !sc) return null;
        var r = svg.getBoundingClientRect(); if (!r.height) return null;
        var y = (clientY - r.top) * (sc.H / r.height);
        return clamp(YMIN + (sc.T + sc.ph - y) / sc.ph * (YMAX - YMIN));
      }
      drag.addEventListener('pointerdown', function (e) {
        var svg = holder.querySelector('svg'); if (!svg || !sc) return;
        var r = svg.getBoundingClientRect(), y = (e.clientY - r.top) * (sc.H / r.height);
        var best = -1, bd = 1e9;
        v.forEach(function (val, i) { var d = Math.abs(sc.py(val) - y); if (d < bd) { bd = d; best = i; } });
        dragging = best; hi = best; preset = ''; paintPresets();
        try { drag.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
        var nv = valueAt(e.clientY); if (nv != null) v[best] = nv;
        draw(true);
      });
      drag.addEventListener('pointermove', function (e) {
        if (dragging < 0) return;
        var nv = valueAt(e.clientY); if (nv == null || nv === v[dragging]) return;
        v[dragging] = nv; draw(true);
      });
      function end() { if (dragging >= 0) { dragging = -1; hi = -1; draw(false); } }
      drag.addEventListener('pointerup', end);
      drag.addEventListener('pointercancel', end);
      draw(true);
    }

    /* =============== mode 2: do they differ? =============== */
    function modeB(box) {
      var A = WUL.data.amylase.i, S = WUL.data.soils;
      function fromRaw(t) { var s = stats(t); return { mean: s.mean, sd: s.sd, se: s.se, n: s.n, min: s.min, max: s.max }; }
      function fromSum(m, s, n) { return { mean: m, sd: s, se: s / Math.sqrt(n), n: n, min: null, max: null }; }
      var PAIRS = [
        { id: 'amy', label: 'Amylase: 40 °C and 50 °C', names: ['40 °C', '50 °C'], unit: 's', dp: 0, sdp: 1,
          g: [fromRaw(A.trials[2]), fromRaw(A.trials[3])], y: { min: 40, max: 90, step: 10, minor: 5, label: 'Mean time for starch to disappear / s' },
          claim: 'the mean time at 50 °C is shorter than at 40 °C', src: 'Fungal α-amylase, five trials at each temperature.' },
        { id: 'ad', label: 'Soils A and D', names: ['Soil A', 'Soil D'], unit: 'cm', dp: 1, sdp: 1,
          g: [fromSum(S.means[0], S.sds[0], S.n), fromSum(S.means[3], S.sds[3], S.n)], y: { min: 40, max: 47, step: 1, minor: 5, label: 'Mean height of seedlings / cm' },
          claim: 'soil D gives taller seedlings than soil A', src: 'Bean seedlings after 21 days, ten plants in each soil. Only the mean and SD were recorded.' },
        { id: 'ab', label: 'Soils A and B', names: ['Soil A', 'Soil B'], unit: 'cm', dp: 1, sdp: 1,
          g: [fromSum(S.means[0], S.sds[0], S.n), fromSum(S.means[1], S.sds[1], S.n)], y: { min: 40, max: 47, step: 1, minor: 5, label: 'Mean height of seedlings / cm' },
          claim: 'soil B gives taller seedlings than soil A', src: 'Bean seedlings after 21 days, ten plants in each soil. Only the mean and SD were recorded.' }
      ];
      var pi = 0, kind = 'sd', said = null, tested = false;

      box.appendChild(h('p', { class: C + '__intro', html: md('Two groups, side by side. Compare the bars and decide: __do they overlap?__ Then see what you may write.', { inline: true }) }));
      var bar1 = h('div', { class: C + '__bar' }, [h('span', { class: 'wd-k', text: 'Data' })]);
      var sPair = h('div', { class: 'seg', role: 'group', 'aria-label': 'Which two groups' });
      PAIRS.forEach(function (p, i) {
        var b = h('button', { type: 'button', 'data-i': i, text: p.label });
        b.addEventListener('click', function () { pi = i; if (kind === 'range' && PAIRS[pi].g[0].min == null) kind = 'sd'; said = null; tested = false; paint(); });
        sPair.appendChild(b);
      });
      bar1.appendChild(sPair);
      var bar2 = h('div', { class: C + '__bar' }, [h('span', { class: 'wd-k', text: 'Bars' })]);
      var sKind = h('div', { class: 'seg', role: 'group', 'aria-label': 'Which kind of error bar' });
      KINDS.forEach(function (k) {
        var b = h('button', { type: 'button', 'data-k': k.id, text: k.label });
        b.addEventListener('click', function () { if (b.disabled) return; kind = k.id; said = null; tested = false; paint(); });
        sKind.appendChild(b);
      });
      bar2.appendChild(sKind);
      box.appendChild(bar1); box.appendChild(bar2);

      var main = h('div', { class: C + '__main' });
      var left = h('div');
      var wrap = h('div', { class: C + '__plotwrap' });
      var src = h('p', { class: C + '__hint' });
      left.appendChild(wrap); left.appendChild(src);
      var side = h('div', { class: C + '__side' });
      var qbox = h('div');
      var fb = h('div', { 'aria-live': 'polite' });
      side.appendChild(qbox); side.appendChild(fb);
      main.appendChild(left); main.appendChild(side);
      box.appendChild(main);

      function ends(g) {
        if (kind === 'range') return [g.min, g.max];
        var e = kind === 'sd' ? g.sd : g.se;
        return [g.mean - e, g.mean + e];
      }
      function kindName() { return kind === 'range' ? 'range bars' : kind === 'sd' ? '± 1 SD bars' : '± 1 SE bars'; }

      function paint() {
        var P = PAIRS[pi], K = KINDS.filter(function (k) { return k.id === kind; })[0];
        sPair.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-i') === pi ? 'true' : 'false'); });
        sKind.querySelectorAll('button').forEach(function (b) {
          var noRange = b.getAttribute('data-k') === 'range' && P.g[0].min == null;
          b.disabled = noRange;
          b.setAttribute('aria-pressed', b.getAttribute('data-k') === kind ? 'true' : 'false');
        });
        var e0 = ends(P.g[0]), e1 = ends(P.g[1]);
        var sp = {
          w: 360, h: 320, pad: { l: 58, r: 10, t: 12, b: 32 },
          x: { cat: P.names }, y: P.y,
          series: [{ id: 'm', pts: [[0.5, P.g[0].mean], [1.5, P.g[1].mean]], errLo: [P.g[0].mean - e0[0], P.g[1].mean - e1[0]], errHi: [e0[1] - P.g[0].mean, e1[1] - P.g[1].mean], mark: 'x', line: 'none', tone: K.tone }],
          alt: P.label + ', means with ' + kindName()
        };
        var s = WUL.plot(sp), sc = WUL.plotScale(sp);
        if (said) {
          var lo = Math.max(e0[0], e1[0]), hi2 = Math.min(e0[1], e1[1]);
          var overlap = lo <= hi2;
          var y1 = sc.py(Math.max(lo, hi2)), y2 = sc.py(Math.min(lo, hi2));
          var band = '<g aria-hidden="true"><rect class="' + C + '__band" x="' + sc.px(0.08).toFixed(1) + '" y="' + y1.toFixed(1) + '" width="' + (sc.px(1.92) - sc.px(0.08)).toFixed(1) + '" height="' + Math.max(2, y2 - y1).toFixed(1) + '"/>' +
            '<text class="' + C + '__bandt" x="' + sc.px(1).toFixed(1) + '" y="' + ((y1 + y2) / 2 + 4).toFixed(1) + '" text-anchor="middle">' + (overlap ? 'overlap' : 'gap') + '</text></g>';
          s = s.replace(/(<g data-el="err-m")/, band + '$1');
        }
        wrap.innerHTML = s;
        src.innerHTML = md(P.src + (P.g[0].min == null ? ' So the range cannot be drawn.' : ''), { inline: true });
        drawQ(P, e0, e1);
      }

      function drawQ(P, e0, e1) {
        qbox.innerHTML = '';
        fb.innerHTML = '';
        qbox.appendChild(h('p', { class: C + '__q', text: 'Do the ' + kindName() + ' overlap?' }));
        var ans = h('div', { class: C + '__ans' });
        [['yes', 'Yes, they overlap'], ['no', 'No, there is a gap']].forEach(function (a) {
          var b = h('button', { type: 'button', class: 'btn', 'aria-pressed': said === a[0] ? 'true' : 'false', text: a[1] });
          b.addEventListener('click', function () { said = a[0]; tested = false; paint(); });
          ans.appendChild(b);
        });
        qbox.appendChild(ans);
        if (!said) return;
        var lo = Math.max(e0[0], e1[0]), hi2 = Math.min(e0[1], e1[1]);
        var overlap = lo <= hi2, right = (said === 'yes') === overlap;
        var u = ' ' + P.unit, dp = kind === 'range' ? P.dp : Math.max(P.dp, P.sdp);
        var endsTxt = P.names[0] + ': ' + WUL.fix(e0[0], dp) + ' to ' + WUL.fix(e0[1], dp) + u + ' · ' + P.names[1] + ': ' + WUL.fix(e1[0], dp) + ' to ' + WUL.fix(e1[1], dp) + u;
        var fbx = h('div', { class: 'fb ' + (right ? 'fb--ok' : 'fb--no'), role: 'status' });
        fbx.innerHTML = '<span class="fb__k">' + (right ? '✔ Right' : '✘ Look again') + '</span> ' +
          (overlap ? 'The bars share the band from ' + WUL.fix(lo, dp) + ' to ' + WUL.fix(hi2, dp) + u + ', so they overlap.'
                   : 'There is a gap of ' + WUL.fix(lo - hi2, dp) + u + ' between the end of one bar and the start of the other.') +
          '<div class="' + C + '__ends">' + esc(endsTxt) + '</div>';
        fb.appendChild(fbx);
        var cl = h('div', { class: C + '__claims' });
        var cap = P.claim.charAt(0).toUpperCase() + P.claim.slice(1);
        if (overlap) {
          cl.appendChild(h('div', { class: C + '__can', html: '<b>✔ You can write:</b> “The ' + esc(kindName()) + ' overlap, so the graph alone cannot show whether ' + esc(P.names[0]) + ' and ' + esc(P.names[1]) + ' differ.” Then report the statistical test that decides.' }));
          cl.appendChild(h('div', { class: C + '__cannot', html: '<b>✘ You cannot write:</b> “' + esc(cap) + '.” The difference could be due to chance. You also cannot write “there is no difference” or “no significant difference”: overlap cannot decide that, only a test can.' }));
        } else {
          cl.appendChild(h('div', { class: C + '__can', html: kind === 'se'
            ? '<b>✔ You can write:</b> “The ± 1 SE bars do not overlap, which suggests that ' + esc(P.claim) + '. A statistical test is needed to confirm it.” SE bars are short, so a gap between them is a weaker hint than a gap between SD bars.'
            : '<b>✔ You can write:</b> “The ' + esc(kindName()) + ' do not overlap, so it is likely that ' + esc(P.claim) + '.”' }));
          cl.appendChild(h('div', { class: C + '__cannot', html: '<b>✘ You cannot write:</b> “This proves that ' + esc(P.claim) + '.” A gap between the bars is a hint, not proof. Only a statistical test can decide.' }));
        }
        fb.appendChild(cl);
        if (!ib) {
          fb.appendChild(h('p', { class: C + '__hint', text: 'At IB, a statistical test decides the question. The Statistical tests part shows how.' }));
          return;
        }
        var tb = h('button', { type: 'button', class: 'btn btn--go ' + C + '__tt', text: tested ? 'Hide the t-test' : 'Check it with a t-test' });
        tb.addEventListener('click', function () { tested = !tested; paint(); });
        fb.appendChild(tb);
        if (tested) {
          var r = tTest(P.g[0], P.g[1]), sig = r.p < 0.05;
          fb.appendChild(h('div', { class: 'fb ' + (sig ? 'fb--ok' : 'fb--no'), role: 'status', html:
            '<span class="fb__k">t = ' + r.t.toFixed(2) + ', df = ' + r.df + ', ' + pText(r.p) + '</span> ' +
            (sig ? 'p is below 0.05, so the difference is statistically significant: ' + esc(P.claim) + '.'
                 : 'p is above 0.05, so the difference is not statistically significant. Chance could explain it.') +
            (kind === 'se' && !overlap && !sig ? ' The SE bars had a gap, yet the test finds no significant difference: overlap is a hint, not proof.' : '') +
            (kind === 'sd' && overlap && sig ? ' The SD bars overlapped, yet the test finds a significant difference: overlap is a hint, not proof.' : '') }));
        }
      }
      paint();
    }
  });
})(window.WUL);
