/* ============================================================
   widget: axis-start — "Where should the y-axis start?"
   The four soils means (WUL.data.soils: 43.0, 43.6, 44.0, 44.3 cm) as a
   bar chart. A slider moves the start of the y-axis from 0 cm up to
   42.5 cm; a switch adds the habit students bring from maths: a 0 at the
   corner and a zigzag. The readout compares how tall bar D LOOKS next
   to bar A with how tall it really is (44.3 ÷ 43.0 = 1.03).

   Evidence for the message: cutting the axis makes differences look
   bigger, and marking the cut does not stop it (Correll et al. 2020,
   CHI, doi:10.1145/3313831.3376222; Yang et al. 2021, JARMAC 10:298,
   doi:10.1016/j.jarmac.2020.10.002).
   Not a tool on the Tools page: it lives on the Graphs page only.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md;
  var NAME = 'axis-start';
  var STOPS = [0, 20, 30, 38, 40, 41, 42, 42.5];

  WUL.css(NAME,
    '.wd-axis-start{display:grid;gap:14px}' +
    '.wd-axis-start__ctl{display:grid;gap:10px;padding:12px 14px;border:1px solid var(--edge);border-radius:var(--r);background:var(--sheet-2)}' +
    '.wd-axis-start__row{display:grid;grid-template-columns:minmax(0,auto) minmax(0,1fr) 5.5em;gap:10px;align-items:center}' +
    '.wd-axis-start__row label{font:600 .95rem/1.3 var(--sans)}' +
    '.wd-axis-start__row input[type=range]{width:100%;accent-color:var(--lvl);min-height:32px;margin:0}' +
    '.wd-axis-start__val{font:650 1rem/1 var(--mono);text-align:right;font-variant-numeric:tabular-nums}' +
    '.wd-axis-start__zig{display:flex;gap:10px;align-items:center;font:500 .95rem/1.35 var(--sans);cursor:pointer}' +
    '.wd-axis-start__zig input{width:20px;height:20px;accent-color:var(--red);margin:0;flex:none}' +
    '.wd-axis-start__zig.is-off{opacity:.5;cursor:default}' +
    '.wd-axis-start__stage{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,15em);gap:16px;align-items:center}' +
    '.wd-axis-start__stage .plot{max-width:440px}' +
    '.wd-axis-start__out{display:grid;gap:8px}' +
    '.wd-axis-start__looks{font:650 1.05rem/1.35 var(--sans)}' +
    '.wd-axis-start__looks b{font:700 1.9rem/1 var(--serif);display:block;margin-top:4px;font-variant-numeric:tabular-nums}' +
    '.wd-axis-start.is-cut .wd-axis-start__looks b{color:var(--red)}' +
    '.wd-axis-start.is-honest .wd-axis-start__looks b{color:var(--green)}' +
    '.wd-axis-start__real{font-size:.93rem;line-height:1.45;color:var(--ink-2)}' +
    '.wd-axis-start__msg{font-size:.95rem;line-height:1.5;padding:9px 12px;border-radius:var(--r)}' +
    '.wd-axis-start.is-cut .wd-axis-start__msg{background:var(--red-wash)}' +
    '.wd-axis-start.is-honest .wd-axis-start__msg{background:var(--green-wash)}' +
    '@media (max-width:640px){.wd-axis-start__stage{grid-template-columns:minmax(0,1fr)}.wd-axis-start__row{grid-template-columns:minmax(0,1fr) 5em}.wd-axis-start__row label{grid-column:1/-1}}'
  );

  function fix(v, dp) { return (+v).toFixed(dp); }

  WUL.widget(NAME, function (host) {
    var S = WUL.data.soils, A = S.means[0], D = S.means[3];
    var st = { k: 0, zig: false };
    var root = h('div', { class: 'wd-axis-start' });
    host.appendChild(root);

    var ctl = h('div', { class: 'wd-axis-start__ctl' });
    var id = 'as' + Math.random().toString(36).slice(2, 7);
    var row = h('div', { class: 'wd-axis-start__row' });
    row.appendChild(h('label', { for: id, text: 'The y-axis starts at' }));
    var slider = h('input', { type: 'range', id: id, min: '0', max: String(STOPS.length - 1), step: '1', value: '0' });
    row.appendChild(slider);
    var val = h('span', { class: 'wd-axis-start__val', 'aria-live': 'polite' });
    row.appendChild(val);
    ctl.appendChild(row);
    var zigL = h('label', { class: 'wd-axis-start__zig' });
    var zig = h('input', { type: 'checkbox' });
    zigL.appendChild(zig);
    zigL.appendChild(h('span', { text: 'Write 0 at the corner and draw a zigzag (the maths habit)' }));
    ctl.appendChild(zigL);
    root.appendChild(ctl);

    var stage = h('div', { class: 'wd-axis-start__stage' });
    var plotHost = h('div');
    var out = h('div', { class: 'wd-axis-start__out' });
    stage.appendChild(plotHost);
    stage.appendChild(out);
    root.appendChild(stage);

    function draw() {
      var start = STOPS[st.k], cut = start > 0, withZig = cut && st.zig;
      var top = cut ? 45 : 50;
      var step = [0.5, 1, 2, 5, 10].filter(function (s) { return (top - start) / s <= 10; })[0];
      if (!cut) step = 10;
      var dp = step < 1 ? 1 : 0;
      val.textContent = fix(start, start % 1 ? 1 : 0) + ' cm';
      zigL.classList.toggle('is-off', !cut);
      zig.disabled = !cut;
      root.classList.toggle('is-cut', cut);
      root.classList.toggle('is-honest', !cut);

      plotHost.innerHTML = WUL.plot({
        w: 420, h: 300, pad: { l: 62, r: 14, t: 14, b: 50 }, axisBreak: withZig,
        x: { cat: S.labels, label: 'Soil' },
        y: { min: start, max: top, step: step, minor: 5, label: 'Mean height / cm',
          fmt: function (v) { return withZig && Math.abs(v - start) < 1e-9 ? '0' : fix(v, dp); } },
        bars: { items: S.labels.map(function (l, i) { return { label: l, v: S.means[i] }; }) },
        caption: 'Figure 1. Bar chart showing the effect of soil type on the mean height of bean seedlings after 21 days.'
      });

      var looks = (D - start) / (A - start), real = D / A;
      var msg;
      if (!cut) msg = '✔ Honest. Each bar’s length matches its mean, so the four soils look almost the same, which they are.';
      else if (withZig) msg = '✘ The 0 and the zigzag do not help. The bars are still cut, and bar D still looks ' + fix(looks, 1) + ' times as tall as bar A. In experiments, people were fooled even when they could see the cut.';
      else msg = '✘ Misleading. The bottom ' + fix(start, start % 1 ? 1 : 0) + ' cm of every bar is cut off, so a 3 % difference looks like ' + Math.round((looks - 1) * 100) + ' %.';
      out.innerHTML = '';
      out.appendChild(h('p', { class: 'wd-axis-start__looks', html: 'Bar D looks<b>' + fix(looks, looks < 1.1 ? 2 : 1) + ' ×</b>as tall as bar A.' }));
      out.appendChild(h('p', { class: 'wd-axis-start__real', html: md('The real means: ' + fix(D, 1) + ' cm and ' + fix(A, 1) + ' cm. Bar D is only __' + fix(real, 2) + ' ×__ as tall.', { inline: true }) }));
      out.appendChild(h('p', { class: 'wd-axis-start__msg', role: 'status', text: msg }));
    }
    slider.addEventListener('input', function () { st.k = +slider.value; draw(); });
    zig.addEventListener('change', function () { st.zig = zig.checked; draw(); });
    draw();
  });
})(window.WUL);
