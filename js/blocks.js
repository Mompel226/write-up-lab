/* ============================================================
   blocks.js — the building blocks a station's "Build it" section is
   made of, plus the red pen and the walkthrough (stepper).

   WUL.block(spec) → a DOM node.  spec.type is one of:
     text · rules · compare · anatomy · note · callout · table · plot ·
     steps · frames · widget · redpen · grid2
   Every block may carry lv:'gie' (which levels see it).
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;

  /* render "something to look at": markup string, {table:spec}, {plot:spec}, {html:'…'} */
  function visual(v) {
    if (v == null) return '';
    if (typeof v === 'string') return '<div class="prose">' + md(v, { block: true }) + '</div>';
    if (v.table) return WUL.table(v.table);
    if (v.plot) return WUL.plot(v.plot);
    if (v.html) return v.html;
    if (v.md) return '<div class="prose">' + md(v.md, { block: true }) + '</div>';
    return '';
  }
  WUL.visual = visual;

  /* run fn once node is in the document (getBBox needs layout). Polls with
     setTimeout, never requestAnimationFrame: rAF does not tick in a hidden tab. */
  WUL.whenLive = function (node, fn, tries) {
    tries = tries == null ? 100 : tries;
    if (node.isConnected) { fn(); return; }
    if (tries <= 0) return;
    setTimeout(function () { WUL.whenLive(node, fn, tries - 1); }, 30);
  };

  var B = {};

  B.text = function (s) {
    return h('div', { class: 'blk-text prose', html: (s.title ? '<h3 class="bh">' + esc(s.title) + '</h3>' : '') + md(s.md, { block: true }) });
  };

  /* the key things to remember */
  B.rules = function (s, ctx) {
    var L = ctx && ctx.level;
    var n = h('div', { class: 'blk-rules' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    var ul = h('ul', { class: 'rules' });
    s.items.forEach(function (it) {
      if (typeof it === 'string') it = { t: it };
      if (!WUL.shows(it.lv, L)) return;
      ul.appendChild(h('li', { class: 'rule' + (it.lv && it.lv.indexOf('g') < 0 ? ' rule--ib' : '') },
        [h('span', { class: 'rule__i', 'aria-hidden': 'true', text: it.icon || '✔' }), h('span', { class: 'rule__t', html: md(it.t, { inline: true }) })]));
    });
    n.appendChild(ul);
    return n;
  };

  /* ✘ then ✔, side by side */
  B.compare = function (s) {
    var n = h('div', { class: 'blk-compare' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    var row = h('div', { class: 'cmp' });
    row.appendChild(h('div', { class: 'cmp__side cmp__side--bad', html: '<div class="cmp__tag">✘ ' + esc(s.badLabel || 'Loses marks') + '</div>' + visual(s.bad) }));
    row.appendChild(h('div', { class: 'cmp__side cmp__side--good', html: '<div class="cmp__tag">✔ ' + esc(s.goodLabel || 'Earns the mark') + '</div>' + visual(s.good) }));
    n.appendChild(row);
    if (s.why) n.appendChild(h('p', { class: 'cmp__why', html: md(s.why, { inline: true }) }));
    return n;
  };

  /* a model with colour-coded parts; the legend lights each part */
  B.anatomy = function (s) {
    var n = h('div', { class: 'blk-anat' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    if (s.intro) n.appendChild(h('p', { class: 'bintro', html: md(s.intro, { inline: true }) }));
    var wrap = h('div', { class: 'anat' });
    var sheet = h('div', { class: 'anat__model sheet', html: visual(s.model) });
    var legend = h('ol', { class: 'anat__legend' });
    s.parts.forEach(function (p) {
      var li = h('li', { class: 'anat__part pk' + p.n, tabindex: '0', 'data-p': p.n },
        [h('span', { class: 'anat__sw', text: String(p.n) }), h('span', { class: 'anat__txt', html: '<b>' + esc(p.name) + '</b>' + (p.note ? '<span>' + md(p.note, { inline: true }) + '</span>' : '') })]);
      legend.appendChild(li);
    });
    function light(p) {
      wrap.classList.toggle('is-isolating', !!p);
      sheet.querySelectorAll('.pt,[data-part]').forEach(function (e) {
        var q = e.getAttribute('data-p') || e.getAttribute('data-part');
        e.classList.toggle('is-lit', !!p && q === p);
      });
      legend.querySelectorAll('.anat__part').forEach(function (e) { e.classList.toggle('is-lit', e.getAttribute('data-p') === p); });
    }
    var pinned = null;
    legend.addEventListener('mouseover', function (e) { var li = e.target.closest('.anat__part'); if (li && !pinned) light(li.getAttribute('data-p')); });
    legend.addEventListener('mouseleave', function () { if (!pinned) light(null); });
    legend.addEventListener('click', function (e) {
      var li = e.target.closest('.anat__part'); if (!li) return;
      var p = li.getAttribute('data-p'); pinned = pinned === p ? null : p; light(pinned);
    });
    legend.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var li = e.target.closest('.anat__part'); if (!li) return;
      e.preventDefault(); var p = li.getAttribute('data-p'); pinned = pinned === p ? null : p; light(pinned);
    });
    sheet.addEventListener('click', function (e) {
      var pt = e.target.closest('.pt,[data-part]'); if (!pt || e.target.closest('.kw')) return;
      var p = pt.getAttribute('data-p') || pt.getAttribute('data-part'); pinned = pinned === p ? null : p; light(pinned);
    });
    wrap.appendChild(sheet); wrap.appendChild(legend);
    n.appendChild(wrap);
    if (s.after) n.appendChild(h('p', { class: 'bafter', html: md(s.after, { inline: true }) }));
    return n;
  };

  B.note = function (s) {
    var tone = s.tone || 'tip';
    var labels = { ib: 'At IB', ee: 'For the Extended Essay', igcse: 'At IGCSE', warn: 'Careful', tip: 'Tip', house: 'Our rule' };
    return h('aside', { class: 'blk-note note--' + tone, html: '<div class="note__k">' + esc(s.label || labels[tone] || 'Note') + '</div>' + (s.title ? '<div class="note__t">' + esc(s.title) + '</div>' : '') + '<div class="note__b prose">' + md(s.md, { block: true }) + '</div>' });
  };

  B.callout = function (s) {
    return h('div', { class: 'blk-callout', html: '<div class="callout__k">' + esc(s.label || 'Remember') + '</div><p class="callout__t">' + md(s.md, { inline: true }) + '</p>' });
  };

  B.table = function (s) {
    var n = h('div', { class: 'blk-vis' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    n.appendChild(h('div', { class: 'sheet sheet--vis', html: WUL.table(s.spec) }));
    if (s.after) n.appendChild(h('p', { class: 'bafter', html: md(s.after, { inline: true }) }));
    return n;
  };
  B.plot = function (s) {
    var n = h('div', { class: 'blk-vis' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    n.appendChild(h('div', { class: 'sheet sheet--vis', html: WUL.plot(s.spec) }));
    if (s.after) n.appendChild(h('p', { class: 'bafter', html: md(s.after, { inline: true }) }));
    return n;
  };

  /* two visuals side by side, each with a label (e.g. IGCSE table | IB tables) */
  B.grid2 = function (s) {
    var n = h('div', { class: 'blk-grid2' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    if (s.intro) n.appendChild(h('p', { class: 'bintro', html: md(s.intro, { inline: true }) }));
    var row = h('div', { class: 'g2' });
    s.items.forEach(function (it) {
      row.appendChild(h('div', { class: 'g2__c' + (it.tone ? ' g2--' + it.tone : ''), html: (it.label ? '<div class="g2__k">' + esc(it.label) + '</div>' : '') + '<div class="sheet sheet--vis">' + visual(it.v) + '</div>' + (it.note ? '<p class="g2__n">' + md(it.note, { inline: true }) + '</p>' : '') }));
    });
    n.appendChild(row);
    return n;
  };

  /* sentence frames — the words to borrow */
  B.frames = function (s) {
    var n = h('div', { class: 'blk-frames' });
    n.appendChild(h('div', { class: 'frames__k', text: s.title || 'Sentence frames: use these to start your sentences' }));
    var ul = h('ul', { class: 'frames' });
    s.items.forEach(function (t) { ul.appendChild(h('li', { html: md(String(t).replace(/_{3,}/g, '\u0007'), { inline: true }).replace(/\u0007/g, '<span class="gap"></span>') })); });
    n.appendChild(ul);
    return n;
  };

  B.widget = function (s, ctx) {
    var host = h('div', { class: 'blk-widget', 'data-widget': s.name });
    if (s.title) host.appendChild(h('h3', { class: 'bh', text: s.title }));
    var body = h('div', { class: 'widget' });
    host.appendChild(body);
    var fn = WUL.widgets[s.name];
    if (!fn) { body.innerHTML = '<p class="missing">Tool “' + esc(s.name) + '” is not built yet.</p>'; return host; }
    try { fn(body, s.opts || {}, ctx || {}); }
    catch (e) { console.error(e); body.innerHTML = '<p class="missing">This tool failed to load.</p>'; }
    return host;
  };

  /* ---------- the walkthrough: builds a table or a graph one step at a time ----------
     { type:'steps', title, stage:{table:spec}|{plot:spec}|{html}, steps:[{title, text, show:[els], focus:[els]}] }
     Every element with data-el starts hidden; each step reveals its "show" list and rings its "focus".
     It never moves on by itself: the reader presses Next. */
  B.steps = function (s, ctx) {
    var L = ctx && ctx.level;
    var n = h('div', { class: 'blk-steps' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    if (s.intro) n.appendChild(h('p', { class: 'bintro', html: md(s.intro, { inline: true }) }));
    var box = h('div', { class: 'stepper' });
    var stage = h('div', { class: 'stepper__stage sheet', html: visual(s.stage) });
    var cap = h('div', { class: 'stepper__cap', 'aria-live': 'polite' });
    var nav = h('div', { class: 'stepper__nav' });
    var back = h('button', { type: 'button', class: 'btn btn--ghost', text: '← Back' });
    var next = h('button', { type: 'button', class: 'btn btn--go', text: 'Next step →' });
    var dots = h('div', { class: 'stepper__dots', 'aria-hidden': 'true' });
    nav.appendChild(back); nav.appendChild(dots); nav.appendChild(next);
    box.appendChild(stage); box.appendChild(cap); box.appendChild(nav);
    n.appendChild(box);
    var steps = s.steps.filter(function (st) { return WUL.shows(st.lv, L); });
    var all = stage.querySelectorAll('[data-el]');
    steps.forEach(function () { dots.appendChild(h('i')); });
    var i = 0;
    function show() {
      var shown = {}, k;
      for (k = 0; k <= i; k++) (steps[k].show || []).forEach(function (e) { shown[e] = 1; });
      var focus = {};
      (steps[i].focus || steps[i].show || []).forEach(function (e) { focus[e] = 1; });
      all.forEach(function (el) {
        var id = el.getAttribute('data-el');
        var base = id.replace(/-\d+$/, '');
        var vis = shown[id] || shown[base] || (s.always || []).indexOf(id) >= 0;
        el.classList.toggle('st-hide', !vis);
        el.classList.toggle('st-focus', !!(focus[id] || focus[base]) && vis);
      });
      var st = steps[i];
      cap.innerHTML = '<div class="stepper__n">Step ' + (i + 1) + ' of ' + steps.length + '</div>' +
        '<div class="stepper__t">' + esc(st.title) + '</div><div class="stepper__x">' + md(st.text, { inline: true }) + '</div>';
      back.disabled = i === 0;
      next.textContent = i === steps.length - 1 ? 'Start again ↺' : 'Next step →';
      dots.querySelectorAll('i').forEach(function (d, j) { d.className = j < i ? 'done' : (j === i ? 'on' : ''); });
    }
    back.addEventListener('click', function () { if (i > 0) { i--; show(); } });
    next.addEventListener('click', function () { i = i === steps.length - 1 ? 0 : i + 1; show(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next.click(); } else if (e.key === 'ArrowLeft') { back.click(); }
    });
    show();
    return n;
  };

  /* ---------- the red pen ----------
     { title, intro, body: markup | {table} | {plot}, notes:{k:{label, why}}, fixed: same kinds, fixedNote }
     Text and tables: marks are written [!k:phrase] in the markup.
     Graphs: notes carry el:'label-y' — the ring is drawn round that part of the SVG. */
  WUL.redpen = function (host, rp) {
    host.innerHTML = '';
    var keys = Object.keys(rp.notes || {});
    var found = {};
    var wrap = h('div', { class: 'redpen' });
    var head = h('div', { class: 'redpen__bar' });
    var count = h('span', { class: 'redpen__count' });
    var tog = h('button', { type: 'button', class: 'btn btn--ghost', 'aria-pressed': 'false', text: 'Show the fixed version' });
    head.appendChild(count); head.appendChild(tog);
    var sheet = h('div', { class: 'redpen__sheet sheet' });
    var note = h('div', { class: 'redpen__note', 'aria-live': 'polite' });
    wrap.appendChild(head); wrap.appendChild(sheet); wrap.appendChild(note);
    host.appendChild(wrap);
    var fixed = false;

    function setCount() {
      var nf = Object.keys(found).length;
      count.innerHTML = fixed ? '<b class="ok">✔ The fixed version</b>' :
        '<b>' + nf + '</b> of <b>' + keys.length + '</b> mistakes found' + (nf === keys.length ? ' <span class="ok">— all of them</span>' : '');
    }
    function say(k) {
      var nt = rp.notes[k];
      if (!nt) return;
      note.className = 'redpen__note is-on';
      note.innerHTML = '<span class="redpen__lab">' + esc(nt.label) + '</span><span class="redpen__why">' + md(nt.why, { inline: true }) + '</span>';
    }
    function ringGraph() {
      var svg = sheet.querySelector('svg'); if (!svg) return;
      keys.forEach(function (k) {
        var nt = rp.notes[k]; if (!nt.el) return;
        var tgt = svg.querySelector('[data-el="' + nt.el + '"]'); if (!tgt) return;
        var bb; try { bb = tgt.getBBox(); } catch (e) { return; }
        if (!bb || (!bb.width && !bb.height)) return;
        var ns = 'http://www.w3.org/2000/svg';
        var gg = document.createElementNS(ns, 'g'); gg.setAttribute('class', 'rp-ring'); gg.setAttribute('data-k', k);
        gg.setAttribute('tabindex', '0'); gg.setAttribute('role', 'button'); gg.setAttribute('aria-label', nt.label);
        if (nt.box) bb = { x: nt.box[0], y: nt.box[1], width: nt.box[2], height: nt.box[3] };
        var ratio = bb.width / Math.max(1, bb.height), el;
        if (ratio > 2 || ratio < 0.5) {
          /* a long, thin part (a row of axis numbers): a rounded oblong, so the ring never cuts the end digits */
          el = document.createElementNS(ns, 'rect');
          el.setAttribute('x', bb.x - 8); el.setAttribute('y', bb.y - 7);
          el.setAttribute('width', bb.width + 16); el.setAttribute('height', bb.height + 14);
          el.setAttribute('rx', Math.min(14, (Math.min(bb.width, bb.height) + 14) / 2));
        } else {
          el = document.createElementNS(ns, 'ellipse');
          el.setAttribute('cx', bb.x + bb.width / 2); el.setAttribute('cy', bb.y + bb.height / 2);
          el.setAttribute('rx', Math.max(14, bb.width / 2 + 9)); el.setAttribute('ry', Math.max(12, bb.height / 2 + 8));
        }
        var tx = document.createElementNS(ns, 'text');
        var lx = nt.lx != null ? nt.lx : bb.x + bb.width / 2, ly = nt.ly != null ? nt.ly : bb.y - 12;
        tx.setAttribute('x', lx); tx.setAttribute('y', ly); tx.setAttribute('text-anchor', nt.anchor || 'middle');
        tx.setAttribute('class', 'rp-ring__t'); tx.textContent = nt.label;
        gg.appendChild(el); gg.appendChild(tx); svg.appendChild(gg);
      });
    }
    function render() {
      sheet.innerHTML = visual(fixed ? rp.fixed : rp.body);
      sheet.classList.toggle('is-fixed', fixed);
      if (!fixed) {
        WUL.whenLive(sheet, ringGraph);
        sheet.querySelectorAll('.rpm').forEach(function (b) {
          var k = b.getAttribute('data-k');
          if (k && rp.notes[k]) b.setAttribute('data-label', rp.notes[k].label);
          if (found[k]) b.classList.add('is-found');
        });
        sheet.querySelectorAll('.rp-ring').forEach(function (r) { if (found[r.getAttribute('data-k')]) r.classList.add('is-found'); });
        note.className = 'redpen__note';
        note.innerHTML = rp.intro ? md(rp.intro, { inline: true }) : 'Every red mark is a mistake. Tap each one to see why.';
      } else {
        note.className = 'redpen__note is-ok';
        note.innerHTML = rp.fixedNote ? md(rp.fixedNote, { inline: true }) : 'Every mistake fixed.';
      }
      tog.textContent = fixed ? 'Show the red pen again' : 'Show the fixed version';
      tog.setAttribute('aria-pressed', fixed ? 'true' : 'false');
      setCount();
    }
    function hit(k, el) {
      if (!k) return;
      found[k] = 1;
      sheet.querySelectorAll('.is-active').forEach(function (x) { x.classList.remove('is-active'); });
      sheet.querySelectorAll('[data-k="' + k + '"]').forEach(function (x) { x.classList.add('is-found', 'is-active'); });
      say(k); setCount();
    }
    sheet.addEventListener('click', function (e) {
      if (fixed) return;
      var m = e.target.closest('.rpm'); if (m) { hit(m.getAttribute('data-k'), m); return; }
      var r = e.target.closest && e.target.closest('.rp-ring'); if (r) hit(r.getAttribute('data-k'), r);
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var r = e.target.closest && e.target.closest('.rp-ring'); if (r) { e.preventDefault(); hit(r.getAttribute('data-k'), r); }
    });
    tog.addEventListener('click', function () { fixed = !fixed; render(); });
    render();
  };
  B.redpen = function (s) {
    var n = h('div', { class: 'blk-redpen' });
    if (s.title) n.appendChild(h('h3', { class: 'bh', text: s.title }));
    var host = h('div'); n.appendChild(host);
    WUL.redpen(host, s);
    return n;
  };

  WUL.block = function (spec, ctx) {
    if (!spec || !WUL.shows(spec.lv, ctx && ctx.level)) return null;
    var f = B[spec.type];
    if (!f) { console.warn('unknown block', spec.type); return h('p', { class: 'missing', text: 'Unknown block: ' + spec.type }); }
    var node = f(spec, ctx);
    if (node && spec.lv && spec.lv.indexOf('g') < 0) node.classList.add('is-ib-only');
    if (node && spec.id) node.id = spec.id;
    return node;
  };
  WUL.BLOCKS = B;
})(window.WUL);
