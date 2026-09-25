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
    e: { id: 'e', name: 'IB EE', long: 'IB Extended Essay', years: 'Years 12–13', color: 'plum' }
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
      if (!WORDS[key]) WORDS[key] = { term: w.term, def: w.def, eg: w.eg || '', lv: w.lv || '', station: stationId };
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

  /* ---------- keyword pop-over (instant on tap / Enter; never the title attribute) ---------- */
  var pop = null, popFor = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } if (popFor) popFor.setAttribute('aria-expanded', 'false'); popFor = null; }
  function openPop(el) {
    var k = el.getAttribute('data-k'), w = WORDS[k];
    if (popFor === el) { closePop(); return; }
    closePop();
    pop = h('div', { class: 'kwpop', role: 'dialog', 'aria-label': w ? w.term : k });
    if (w) {
      pop.innerHTML = '<div class="kwpop__t">' + esc(w.term) + '</div><div class="kwpop__d">' + md(w.def, { inline: true }) + '</div>' +
        (w.eg ? '<div class="kwpop__e"><span>Example</span> ' + md(w.eg, { inline: true }) + '</div>' : '');
    } else {
      pop.innerHTML = '<div class="kwpop__t">' + esc(k) + '</div><div class="kwpop__d">No definition yet.</div>';
    }
    document.body.appendChild(pop);
    var r = el.getBoundingClientRect(), pw = Math.min(340, window.innerWidth - 24);
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
  global.addEventListener('resize', closePop);
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
