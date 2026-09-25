/* ============================================================
   core.js — Write-Up Lab's small core. Everything hangs off window.WUL.

   What lives here:
   · h() / esc()           building DOM safely
   · store                 localStorage that never throws
   · level                 the reader's level (g = IGCSE, i = IB IA, e = IB EE)
   · md()                  the tiny markup every content string is written in
   · station() / widget()  the two registries the content and tools fill
   · words                 the keyword list, gathered from every station
   · keyword pop-overs     tap a highlighted keyword, its meaning opens in place

   THE MARKUP (see SPEC.md for the full list)
     [[independent variable]]      keyword, highlighted, tap for its meaning
     [[IV|independent variable]]   shows "IV", opens "independent variable"
     ==text==                      yellow highlighter
     __text__                      underline (house style for emphasis)
     **text**                      bold (use sparingly)
     *Aspergillus*                 italic (species names)
     {1:text} … {6:text}           anatomy part 1–6 (colour-coded)
     [!k:text]                     red-pen mark with key k (red pen / spot)
     [?:text]                      a tappable phrase that is NOT an error (spot)
     ✘ ✔                           used literally
   ============================================================ */
(function (global) {
  'use strict';

  var WUL = global.WUL = global.WUL || {};
  WUL.version = '0.1';

  /* ---------- DOM ---------- */
  function h(tag, attrs, kids) {
    var n = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  WUL.h = h; WUL.esc = esc;

  /* ---------- storage that never throws ---------- */
  var KEY = 'write-up-lab.v1', mem = {};
  function readAll() {
    try { var s = global.localStorage.getItem(KEY); return s ? JSON.parse(s) : {}; }
    catch (e) { return mem; }
  }
  function writeAll(o) {
    mem = o;
    try { global.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  WUL.store = {
    get: function (k, d) { var o = readAll(); return o[k] === undefined ? d : o[k]; },
    set: function (k, v) { var o = readAll(); o[k] = v; writeAll(o); },
    clear: function (prefix) {
      var o = readAll(), k;
      for (k in o) if (!prefix || k.indexOf(prefix) === 0) delete o[k];
      writeAll(o);
    }
  };

  /* ---------- level ---------- */
  var LEVELS = {
    g: { id: 'g', name: 'IGCSE', long: 'IGCSE report', years: 'Years 9–11', color: 'green' },
    i: { id: 'i', name: 'IB IA', long: 'IB Internal Assessment', years: 'Years 12–13', color: 'blue' },
    e: { id: 'e', name: 'IB EE', long: 'IB Extended Essay', years: 'Years 12–13', color: 'ee' }
  };
  var ORDER = ['g', 'i', 'e'];
  var listeners = [];
  WUL.LEVELS = LEVELS; WUL.LEVEL_ORDER = ORDER;
  /* the level a page is being drawn at. Pages set it for the moment they draw a block
     (WUL.withLevel), so a tool placed inside an "At IB" panel behaves as the IB version. */
  var override = null;
  WUL.level = function () { if (override) return override; var l = WUL.store.get('level', 'g'); return LEVELS[l] ? l : 'g'; };
  WUL.withLevel = function (l, fn) { var prev = override; override = LEVELS[l] ? l : prev; try { return fn(); } finally { override = prev; } };
  WUL.setLevel = function (l) {
    if (!LEVELS[l] || l === WUL.level()) return;
    WUL.store.set('level', l);
    document.documentElement.setAttribute('data-level', l);
    listeners.forEach(function (f) { try { f(l); } catch (e) { console.error(e); } });
  };
  WUL.onLevel = function (f) { listeners.push(f); };
  /* ?lv=i in the address sets the level (for links a teacher shares, and for testing) */
  try {
    var q = new URLSearchParams(global.location.search).get('lv');
    if (q && LEVELS[q]) WUL.store.set('level', q);
  } catch (e) {}
  /* does a content item's lv string include this level?  lv 'gie', 'ie', 'g' … ; absent = all */
  WUL.shows = function (lv, l) { return !lv || String(lv).indexOf(l || WUL.level()) >= 0; };
  /* pick a per-level value: {g:…, i:…, e:…} → the one for this level, or the nearest level below it */
  WUL.pick = function (obj, l) {
    if (obj == null || typeof obj !== 'object' || Array.isArray(obj) || !(('g' in obj) || ('i' in obj) || ('e' in obj))) return obj;
    l = l || WUL.level();
    var i = ORDER.indexOf(l);
    for (; i >= 0; i--) if (obj[ORDER[i]] != null) return obj[ORDER[i]];
    for (i = 0; i < ORDER.length; i++) if (obj[ORDER[i]] != null) return obj[ORDER[i]];
    return null;
  };

  /* ---------- keywords ---------- */
  var WORDS = {};            /* key (lower case) → {term, def, eg, lv, station} */
  var FORMS = {};            /* any form (lower case) → key */
  WUL.words = WORDS;
  WUL.addWords = function (list, stationId) {
    (list || []).forEach(function (w) {
      var key = w.term.toLowerCase();
      if (WORDS[key] && WORDS[key].def !== w.def) {
        (WUL.problems = WUL.problems || []).push('keyword "' + w.term + '" is defined twice (' + WORDS[key].station + ', ' + stationId + ')');
      }
      if (!WORDS[key]) WORDS[key] = { term: w.term, def: w.def, eg: w.eg || '', lv: w.lv || '', station: stationId, fig: w.fig || '', hi: w.hi || '' };
      FORMS[key] = key;
      (w.forms || []).forEach(function (f) { FORMS[f.toLowerCase()] = key; });
    });
  };
  WUL.wordKey = function (s) { s = String(s).toLowerCase().trim(); return FORMS[s] || (WORDS[s] ? s : null); };

  /* ---------- markup ---------- */
  function md(src, opts) {
    if (src == null) return '';
    var s = esc(src);
    /* keywords  [[shown|key]]  or  [[key]] */
    s = s.replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, function (m, shown, key) {
      var k = WUL.wordKey(key || shown) || (key || shown).toLowerCase();
      return '<span class="kw" role="button" tabindex="0" data-k="' + esc(k) + '">' + shown + '</span>';
    });
    /* anatomy parts {n:text} — allow one level of nested braces-free text */
    s = s.replace(/\{([1-6]):([^{}]+?)\}/g, function (m, n, t) {
      return '<span class="pt pt' + n + '" data-p="' + n + '"><sup class="ptn" aria-hidden="true">' + n + '</sup>' + t + '</span>';
    });
    /* red-pen marks and spot phrases */
    s = s.replace(/\[!([\w-]+):([^\]]+?)\]/g, function (m, k, t) {
      return '<button type="button" class="rpm" data-k="' + k + '">' + t + '</button>';
    });
    s = s.replace(/\[\?:([^\]]+?)\]/g, function (m, t) {
      return '<button type="button" class="rpm rpm--ok" data-k="">' + t + '</button>';
    });
    /* a link to another page of nlcsbiology.com: [words](https://…), in the same tab */
    s = s.replace(/\[([^\[\]]+?)\]\((https:\/\/[^)\s]+)\)/g, '<a class="xlink" href="$2">$1</a>');
    s = s.replace(/==(.+?)==/g, '<mark class="hl">$1</mark>');
    s = s.replace(/__(.+?)__/g, '<u>$1</u>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(>])\*([^*\s][^*]*?)\*(?=[\s).,;:!?<]|$)/g, '$1<i>$2</i>');
    if (opts && opts.inline) return s.replace(/\n/g, ' ');
    var paras = s.split(/\n{2,}/);
    if (paras.length === 1 && !(opts && opts.block)) return s.replace(/\n/g, '<br>');
    return paras.map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  WUL.md = md;

  /* a data table from a spec:
     {caption, head:[[cell…]…], rows:[[cell…]…], note, cls}
     a cell is a string (markup) or {t, cs (colspan), rs (rowspan), cls, th:true}
     {diag: [across, down]} draws a maths-style corner split by a diagonal line: only ever as a mistake */
  /* a title never breaks inside "n = 5" or "± 1 SD" */
  WUL.capText = function (t) { return String(t).replace(/\bn = /g, 'n\u00a0=\u00a0').replace(/± (\d)/g, '±\u00a0$1'); };

  WUL.diagCell = function (d) {
    return '<svg class="dt-diag__l" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="0" x2="100" y2="100" vector-effect="non-scaling-stroke"/></svg>' +
      '<span class="dt-diag__a">' + md(d[0], { inline: true }) + '</span><span class="dt-diag__b">' + md(d[1], { inline: true }) + '</span>';
  };

  WUL.table = function (spec) {
    function cell(c, tag) {
      if (c == null) c = '';
      if (typeof c !== 'object') c = { t: String(c) };
      var t = c.th ? 'th' : tag, cls = (c.cls || '') + (c.diag ? ' dt-diag' : '');
      var inner = c.diag ? WUL.diagCell(c.diag) : md(c.t, { inline: true });
      return '<' + t + (c.cs ? ' colspan="' + c.cs + '"' : '') + (c.rs ? ' rowspan="' + c.rs + '"' : '') +
        (cls ? ' class="' + esc(cls.trim()) + '"' : '') + (c.el ? ' data-el="' + esc(c.el) + '"' : '') + '>' + inner + '</' + t + '>';
    }
    var html = '<div class="tscroll"><table class="dt' + (spec.cls ? ' ' + esc(spec.cls) : '') + '">';
    if (spec.caption) html += '<caption' + (spec.capEl ? ' data-el="' + esc(spec.capEl) + '"' : '') + '>' + md(WUL.capText(spec.caption), { inline: true }) + '</caption>';
    if (spec.head) html += '<thead>' + spec.head.map(function (r) { return '<tr>' + r.map(function (c) { return cell(c, 'th'); }).join('') + '</tr>'; }).join('') + '</thead>';
    html += '<tbody>' + (spec.rows || []).map(function (r) { return '<tr>' + r.map(function (c) { return cell(c, 'td'); }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    if (spec.note) html += '<p class="tnote">' + md(spec.note, { inline: true }) + '</p>';
    return html;
  };

  /* ---------- registries ---------- */
  WUL.stations = {};            /* id → station */
  WUL.stationOrder = [];
  WUL.station = function (s) {
    if (!s || !s.id) throw new Error('station without id');
    if (WUL.stations[s.id]) (WUL.problems = WUL.problems || []).push('station "' + s.id + '" registered twice');
    WUL.stations[s.id] = s;
    WUL.stationOrder.push(s.id);
    WUL.addWords(s.words, s.id);
    return s;
  };
  WUL.widgets = {};             /* name → function(host, opts, ctx) */
  WUL.TOOLS = WUL.TOOLS || [];  /* the tools list: widgets register themselves with WUL.tool({...}) */
  WUL.tool = function (t) { WUL.TOOLS.push(t); return t; };
  WUL.widget = function (name, fn) { WUL.widgets[name] = fn; return fn; };

  /* the stages of an investigation, in order */
  WUL.STAGES = [
    { id: 'start', name: 'Start', blurb: 'What a report is, and how to write it' },
    { id: 'plan', name: 'Plan', blurb: 'Decide what to measure, and how' },
    { id: 'record', name: 'Record', blurb: 'Record every measurement in a table' },
    { id: 'show', name: 'Show', blurb: 'Show your numbers as a graph' },
    { id: 'sense', name: 'Make sense', blurb: 'Say what the data shows, and why' },
    { id: 'judge', name: 'Judge', blurb: 'How much can you trust your results?' },
    { id: 'finish', name: 'Finish', blurb: 'Name your sources and check the format' }
  ];

  /* ---------- figures a keyword can open with (w.fig), the clicked part lit (w.hi) ----------
     'data': the types of data, after Daniel's Year 7 poster (KS3 Inquiry Skills, week 6, "Types of data"):
     quantitative (numerical) = discrete (counted) or continuous (measured); qualitative (categorical,
     "think of words, not numbers") = nominal (multicategory or binary) or ordinal (in order).
     Biology examples; then which test each kind leads to, and the trap: counting is not χ². */
  /* two tails or one: the t distribution for df = 8 (the worked t-test), the 5 % of chance results shaded.
     Critical t (R: qt): two-tailed 2.306, one-tailed 1.860. The worked t = 5.77 is off the right edge. */
  WUL.tailsSvg = function (kind, mark) {   /* mark: a t value to show (else 'our t = 5.77 →') */
    var W = 300, H = 150, x0 = 14, x1 = 286, yB = 118, yT = 22;
    function xs(t) { return x0 + (t + 4) / 8 * (x1 - x0); }
    function f(t) { return Math.pow(1 + t * t / 8, -4.5); }
    function ys(v) { return yB - (yB - yT) * v; }
    var d = '', i, t;
    for (i = 0; i <= 80; i++) { t = -4 + 8 * i / 80; d += (i ? ' L' : 'M') + xs(t).toFixed(1) + ' ' + ys(f(t)).toFixed(1); }
    function area(a, b) {
      var p = 'M' + xs(a).toFixed(1) + ' ' + yB;
      for (var j = 0; j <= 20; j++) { var u = a + (b - a) * j / 20; p += ' L' + xs(u).toFixed(1) + ' ' + ys(f(u)).toFixed(1); }
      return '<path d="' + p + ' L' + xs(b).toFixed(1) + ' ' + yB + ' Z" class="tails__area"/>';
    }
    function lab(x, y, s, a) { return '<text x="' + x.toFixed(1) + '" y="' + y + '" text-anchor="' + (a || 'middle') + '" class="tails__t">' + s + '</text>'; }
    var c = kind === 'one' ? 1.860 : 2.306, out = '';
    out += kind === 'one' ? area(c, 4) : area(-4, -c) + area(c, 4);
    out += '<path d="' + d + '" class="tails__curve"/><line x1="' + x0 + '" y1="' + yB + '" x2="' + x1 + '" y2="' + yB + '" class="tails__ax"/>';
    out += '<line x1="' + xs(c) + '" y1="' + yB + '" x2="' + xs(c) + '" y2="' + (yB - 44) + '" class="tails__cut"/>' + lab(xs(c), yB - 48, (kind === 'one' ? '' : '+') + c.toFixed(2).replace(/0$/, ''));
    if (kind !== 'one') out += '<line x1="' + xs(-c) + '" y1="' + yB + '" x2="' + xs(-c) + '" y2="' + (yB - 44) + '" class="tails__cut"/>' + lab(xs(-c), yB - 48, '−' + c.toFixed(2).replace(/0$/, ''));
    out += kind === 'one' ? lab(xs(3.1), yB - 10, '5 %') : lab(xs(3.2), yB - 10, '2.5 %') + lab(xs(-3.2), yB - 10, '2.5 %');
    out += lab(xs(0), yB + 16, 't = 0: no difference');
    if (mark == null) out += lab(x1, 14, 'our t = 5.77 →', 'end');
    else if (Math.abs(mark) <= 3.8) out += '<line x1="' + xs(mark) + '" y1="' + yB + '" x2="' + xs(mark) + '" y2="' + (yT - 2) + '" class="tails__mark"/><circle cx="' + xs(mark) + '" cy="' + (yT - 2) + '" r="4" class="tails__dot"/>' + lab(xs(mark) + 7, yT + 2, 't = ' + mark.toFixed(2), 'start');
    else out += '<line x1="' + xs(2.75) + '" y1="' + (yB - 24) + '" x2="' + (x1 - 2) + '" y2="' + (yB - 24) + '" class="tails__mark"/><path d="M' + x1 + ' ' + (yB - 24) + ' l-7 -4 v8 z" class="tails__dot"/>' + lab(x1, 18, 't = ' + mark.toFixed(2) + ':', 'end') + lab(x1, 30, 'further out', 'end') + lab(x1, 42, 'than this edge', 'end');
    return '<svg class="tails" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (kind === 'one' ? 'One-tailed: 5 % of chance results in one tail' : 'Two-tailed: 2.5 % of chance results in each tail') + '">' + out + '</svg>';
  };

  WUL.figs = {
    tails: function () {
      return '<div class="tod">' +
        '<div class="tod__cols">' +
          '<div class="tod__col tod__col--q is-hi"><div class="tod__h">Two-tailed<small>the normal t-test</small></div>' + WUL.tailsSvg('two') + '<p class="tails__p">A difference in <b>either</b> direction counts: 2.5&nbsp;% in each tail.</p></div>' +
          '<div class="tod__col tod__col--c"><div class="tod__h">One-tailed<small>rare in an IA</small></div>' + WUL.tailsSvg('one') + '<p class="tails__p">Only one direction counts: all 5&nbsp;% in one tail. Only if you predicted the direction before collecting any data.</p></div>' +
        '</div>' +
        '<p class="tod__trap">If there were no real difference, chance alone would put t in the red 5&nbsp;% of the time. <b>t in the red: p &lt; 0.05, significant. t in the white: not significant.</b></p>' +
        '<p class="tod__ib">Spreadsheet: =T.TEST(range1, range2, <b>2</b>, 2): the first 2 means two tails. R: t.test() is two-tailed unless you change it.</p>' +
      '</div>';
    },
    data: function (hi) {
      function kid(id, name, what, eg) {
        return '<div class="tod__k' + (hi === id ? ' is-hi' : '') + '"><b>' + name + '</b><span>' + what + '</span><i>' + eg + '</i></div>';
      }
      var q = hi === 'quant' || hi === 'continuous' || hi === 'discrete', c = hi === 'qual' || hi === 'nominal' || hi === 'ordinal';
      return '<div class="tod">' +
        '<div class="tod__root">Types of data</div>' +
        '<div class="tod__cols">' +
          '<div class="tod__col tod__col--q' + (q ? ' is-hi' : '') + '"><div class="tod__h">Quantitative<small>numerical variables: numbers</small></div><div class="tod__kids">' +
            kid('continuous', 'Continuous', 'Measured. Any value in a range.', 'time, length, mass, temperature, rate') +
            kid('discrete', 'Discrete', 'Counted. Whole numbers.', 'stomata in a field of view, seeds in a pod') +
          '</div></div>' +
          '<div class="tod__col tod__col--c' + (c ? ' is-hi' : '') + '"><div class="tod__h">Qualitative<small>categorical variables: words, not numbers</small></div><div class="tod__kids">' +
            kid('nominal', 'Nominal', 'Names, in no order. Binary: only two.', 'blood group, species, flower colour; present / absent') +
            kid('ordinal', 'Ordinal', 'Categories in an order.', 'rare, occasional, frequent, abundant; low, medium, high') +
          '</div></div>' +
        '</div>' +
        '<ul class="tod__tests">' +
          '<li><b>Numbers in two groups</b> → t-test</li>' +
          '<li><b>Two numbers for each individual</b> → correlation</li>' +
          '<li><b>How many fall in each category</b> → χ²</li>' +
        '</ul>' +
        '<p class="tod__trap"><b>Careful:</b> counting does not always mean χ². Stomata counted in each field of view are numbers (discrete): compare two groups of them with a t-test. χ² counts how many individuals fall in each category.</p>' +
        '<p class="tod__ib"><b>Two meanings of “discrete”.</b> In statistics (graphs, tests, your IA), discrete means counted numbers, and blood group is categorical. In genetics, the IB guide (D3.2.14) calls blood group a discrete variable, and Cambridge IGCSE calls it discontinuous variation: separate classes, with nothing in between. Both mean “separate”. Describing variation? Say discrete (discontinuous). Choosing a graph or a test? Say categorical.</p>' +
      '</div>';
    }
  };

  /* ---------- keyword pop-over (instant on tap / Enter; never the title attribute) ---------- */
  var pop = null, popFor = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } if (popFor) popFor.setAttribute('aria-expanded', 'false'); popFor = null; }
  function openPop(el) {
    var k = el.getAttribute('data-k'), w = WORDS[k];
    if (popFor === el) { closePop(); return; }
    closePop();
    pop = h('div', { class: 'kwpop', role: 'dialog', 'aria-label': w ? w.term : k });
    var fig = w && w.fig && WUL.figs[w.fig];
    if (w) {
      pop.innerHTML = '<div class="kwpop__t">' + esc(w.term) + '</div><div class="kwpop__d">' + md(w.def, { inline: true }) + '</div>' +
        (w.eg ? '<div class="kwpop__e"><span>Example</span> ' + md(w.eg, { inline: true }) + '</div>' : '') +
        (fig ? fig(w.hi) : '');
      if (fig) {
        pop.className += ' kwpop--wide';
        var x = h('button', { type: 'button', class: 'kwpop__x', 'aria-label': 'Close', text: '×' });
        x.addEventListener('click', function () { var f = popFor; closePop(); if (f) f.focus(); });
        pop.insertBefore(x, pop.firstChild);
      }
    } else {
      pop.innerHTML = '<div class="kwpop__t">' + esc(k) + '</div><div class="kwpop__d">No definition yet.</div>';
    }
    document.body.appendChild(pop);
    var r = el.getBoundingClientRect(), pw = Math.min(fig ? 640 : 340, window.innerWidth - 24);
    pop.style.width = pw + 'px';
    var left = Math.max(12, Math.min(window.scrollX + r.left + r.width / 2 - pw / 2, window.scrollX + window.innerWidth - pw - 12));
    pop.style.left = left + 'px';
    var below = window.scrollY + r.bottom + 8;
    pop.style.top = below + 'px';
    var ph = pop.getBoundingClientRect().height;
    if (r.bottom + 8 + ph > window.innerHeight && r.top - 8 - ph > 0) pop.style.top = (window.scrollY + r.top - 8 - ph) + 'px';
    popFor = el; el.setAttribute('aria-expanded', 'true');
  }
  document.addEventListener('click', function (e) {
    var kw = e.target.closest && e.target.closest('.kw');
    if (kw) { e.preventDefault(); openPop(kw); return; }
    if (pop && !pop.contains(e.target)) closePop();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePop();
    var kw = e.target.closest && e.target.closest('.kw');
    if (kw && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPop(kw); }
  });
  global.addEventListener('hashchange', closePop);
  /* close on a real resize only: on a phone, scrolling shows and hides the toolbar, which changes only the height */
  var lastW = global.innerWidth;
  global.addEventListener('resize', function () { if (global.innerWidth !== lastW) { lastW = global.innerWidth; closePop(); } });
  WUL.closePop = closePop;

  /* ---------- small helpers other files share ---------- */
  /* a widget's own styles, added once. Use class names that start with the widget's name. */
  WUL.css = function (id, text) {
    if (document.getElementById('css-' + id)) return;
    var st = document.createElement('style'); st.id = 'css-' + id; st.textContent = text;
    document.head.appendChild(st);
  };
  WUL.shuffle = function (a) {
    var r = a.slice(), i, j, t;
    for (i = r.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  };
  WUL.mean = function (a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; };
  WUL.sd = function (a) {           /* sample SD, as =STDEV.S */
    if (a.length < 2) return 0;
    var m = WUL.mean(a);
    return Math.sqrt(a.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / (a.length - 1));
  };
  WUL.fix = function (v, dp) { return (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); };
  WUL.reduced = function () { return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches; };
})(window);
