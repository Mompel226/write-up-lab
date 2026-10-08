/* ============================================================
   app.js — the pages. Hash routes:
     #/                     home: the report to explore, then every part, then the tools
     #/part/<id>[/<tab>]    one part of a report, in tabs: learn · redpen · traps · test · words · further
     #/part/<id>/build/<b>  …with the learn step whose block has id <b> open (the p-value links use it)
     #/start                "Start from zero": the parts in order
     #/tools · #/tool/<n>   the tools
     #/words                every keyword
     #/check                the checklist
     #/hw · #/hw/<id>       homework set by the teacher (account.js brings it; signed-in pupils only)

   ONE REPORT, NOT THREE (Daniel, 24 Sep 2026). There is no level switch in the
   top bar. Every part is shown at IGCSE first; what the IB IA and the IB EE
   change sits beside it, behind buttons marked IB IA / IB EE, so an IGCSE
   student can open it out of curiosity. Parts that exist only at IB are shown
   too, with a dashed outline.

   HOMEWORK (Daniel, 3 Oct 2026). A teacher sets whole parts. A part is finished when every red
   pen in it is done (each level's version) and every question in it is answered, IB ones too
   (track.js). The page records Learn steps opened, red-pen mistakes found, Mistakes to avoid
   opened, every answer and Go further opened, never keyword cards and never time; account.js
   saves them for the teacher once the pupil signs in. A homework part shows a banner with its
   checklist, and its Test yourself opens on a "Homework" set: every question not yet answered,
   IGCSE and IB together.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var main = document.getElementById('main');

  /* the route in, per level (station ids, in order). Every station with IGCSE content is on the IGCSE route:
     Observations and Academic integrity joined it on 1 Oct 2026 (Daniel; the circulation lab sends IGCSE pupils
     to part/integrity). */
  WUL.ROUTE = {
    g: ['report', 'variables', 'question', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'observations', 'graphs', 'analysis', 'conclusion', 'evaluation', 'measurement', 'sources', 'integrity'],
    i: ['report', 'question', 'background', 'variables', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'observations', 'graphs', 'errorbars', 'stats', 'analysis', 'conclusion', 'evaluation', 'measurement', 'sources', 'format', 'integrity'],
    e: ['report', 'question', 'background', 'variables', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'observations', 'graphs', 'errorbars', 'stats', 'analysis', 'discussion', 'conclusion', 'evaluation', 'measurement', 'sources', 'format', 'integrity', 'reflection']
  };

  function prog(id) { return (WUL.store.get('prog', {})[id]) || {}; }
  /* A part's questions: one set per level where the sets differ ({l, ls, qs}). PAGES.part draws them, and
     quiz.js saves each set's score under qid(): the bare id for the set the part shows first, id + '.' + l
     for another. progAt(id, l) is what a reader at level l has done: the part seen (bare id) and the best
     score of THEIR level's set (30 Sep 2026: an IB reader's scores were saved but never shown, and Start from
     zero took its ticks and its next part from the IGCSE set). */
  function questionSets(s) {
    var sets = [];
    ['g', 'i', 'e'].filter(function (l) { return s.levels.indexOf(l) >= 0; }).forEach(function (l) {
      var qs = (s.test || []).filter(function (q) { return WUL.shows(q.lv, l); });
      if (!qs.length) return;
      var same = sets.filter(function (x) { return x.qs.length === qs.length && x.qs.every(function (q, k) { return q === qs[k]; }); })[0];
      if (same) { same.ls.push(l); return; }
      sets.push({ l: l, ls: [l], qs: qs });
    });
    return sets;
  }
  function qid(s, x) { return s.id + (x.l === s.levels.charAt(0) ? '' : '.' + x.l); }
  function progAt(id, l) {
    var s = WUL.stations[id], p = prog(id);
    var x = s && l ? questionSets(s).filter(function (y) { return y.ls.indexOf(l) >= 0; })[0] : null;
    if (!x || qid(s, x) === id) return p;
    var q = prog(qid(s, x));
    return { seen: p.seen, best: q.best, tries: q.tries, last: q.last };
  }
  function seen(id) { var p = WUL.store.get('prog', {}); p[id] = p[id] || {}; if (!p[id].seen) { p[id].seen = Date.now(); WUL.store.set('prog', p); } }

  /* ---------- homework (account.js fills WUL.hw: { signedIn, loaded, list:[{id,title,due,overdue,parts:[ids]}] }) ---------- */
  var HW_WORDS = { none: 'not started', partly: 'part done', done: 'done' };
  function hwList() { return (WUL.hw && WUL.hw.list) || []; }
  function hwFor(id) { return hwList().filter(function (x) { return (x.parts || []).indexOf(id) >= 0; }); }
  /* '' when the part is not homework, else none · partly · done (the labs' red · orange · green) */
  /* What homework counts for a part: the larger of this browser's count and the spreadsheet's (8 Oct 2026: `most` is the
     best of ANY version of the part, so a part rewritten since never turns a finished homework red here while the
     teacher's page says done). Every homework colour and count on the site reads this. */
  function hwDone(id) {
    var st = WUL.partState(id), s = WUL.stations[id], srv = (WUL.hw && WUL.hw.most && Number(WUL.hw.most[id])) || 0;
    var units = st ? st.units : (s ? WUL.partUnits(s) : 0), done = Math.max(st ? st.done : 0, units ? Math.min(srv, units) : srv);
    return { any: !!st || srv > 0, done: done, units: units, state: units && done >= units ? 'done' : (done > 0 ? 'partly' : 'none') };
  }
  function hwState(id) { if (!hwFor(id).length) return ''; var x = hwDone(id); return x.any ? x.state : ''; }
  function hwPill(st) { return st ? '<span class="hwpill hwpill--' + st + '">Homework: ' + HW_WORDS[st] + '</span>' : ''; }
  var HW_KEY = '<p class="hwkey">Your homework parts are marked: <span class="hwdot hwdot--none"></span> red, not started; ' +
    '<span class="hwdot hwdot--partly"></span> orange, part done; <span class="hwdot hwdot--done"></span> green, done.</p>';
  function lvName(l) { return WUL.LEVELS[l] ? WUL.LEVELS[l].name : l; }
  /* What finishing a part takes, in the pupil's words, and where they are. */
  function hwNeeds(s) {
    var rps = WUL.redpensOf(s), n = (s.test || []).length, bits = [];
    if (rps.length) bits.push(rps.length > 1 ? 'find every mistake in each Red pen (' + rps.map(function (y) { return lvName(y.l); }).join(', ') + ')' : 'find every mistake in the Red pen');
    if (n) bits.push('answer all ' + n + ' questions in Test yourself' + ((s.test || []).some(function (q) { return q.lv && q.lv.indexOf('g') < 0; }) && s.levels.indexOf('g') >= 0 ? ', the IB ones too' : ''));
    return 'To finish this part, ' + bits.join(' and ') + '.';
  }
  function hwChecklist(s) {
    var st = WUL.partState(s.id); if (!st) return '';
    var ok = function (b) { return b ? ' class="is-ok"' : ''; };
    var rp = st.redpens.map(function (y) { return (st.redpens.length > 1 ? lvName(y.l) + ' ' : '') + y.found + ' of ' + y.marks + (y.found >= y.marks ? ' ✓' : ''); }).join(' · ');
    var rows = [];
    if (st.redpens.length) rows.push('<li' + ok(st.redpens.every(function (y) { return y.found >= y.marks; })) + '><b>Red pen</b> ' + rp + ' mistakes found</li>');
    if (st.total) rows.push('<li' + ok(st.answered >= st.total) + '><b>Test yourself</b> ' + st.answered + ' of ' + st.total + ' answered' + (st.answered ? ' (' + st.first + ' right first time)' : '') + '</li>');
    var also = '<b>Learn</b> ' + st.learn + ' of ' + st.steps + ' steps opened · <b>Mistakes to avoid</b> ' + (st.traps ? 'opened' : 'not opened yet') +
      (st.panels ? ' · <b>Go further</b> ' + st.further + ' of ' + st.panels + ' opened' : '');
    return '<ul class="hwlist">' + rows.join('') + '</ul><p class="hwalso">Your teacher also sees: ' + also + '.</p>';
  }
  function hwDue(hw) { return hw.due ? 'due ' + esc(hw.due) + (hw.overdue ? ' (past its date)' : '') : 'no due date'; }
  WUL.hwFor = hwFor; WUL.hwState = hwState;
  function stationsByStage(stage) {
    return WUL.stationOrder.map(function (id) { return WUL.stations[id]; }).filter(function (s) { return s.stage === stage; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function lvDots(lv) {
    lv = lv || 'gie';
    return '<span class="dots" aria-label="' + ['g', 'i', 'e'].filter(function (l) { return lv.indexOf(l) >= 0; }).map(function (l) { return WUL.LEVELS[l].name; }).join(', ') + '">' +
      ['g', 'i', 'e'].map(function (l) { return '<i class="' + (lv.indexOf(l) >= 0 ? 'on-' + l : '') + '"></i>'; }).join('') + '</span>';
  }
  function tick(id, l) {
    var p = progAt(id, l);
    if (p.best >= 0.999) return '<span class="tick tick--full">✔</span>';
    if (p.best != null) return '<span class="tick tick--part">' + Math.round(p.best * 100) + '%</span>';
    if (p.seen) return '<span class="tick tick--seen">•</span>';
    return '';
  }
  /* "IB IA", "IB EE" or "IB" for a level string such as 'ie' */
  function ibTag(lv) {
    var i = lv.indexOf('i') >= 0, e = lv.indexOf('e') >= 0;
    if (i && e) return '<span class="ibtag ibtag--i">IB</span>';
    if (i) return '<span class="ibtag ibtag--i">IB IA</span>';
    if (e) return '<span class="ibtag ibtag--e">IB EE</span>';
    return '';
  }
  WUL.ibTag = ibTag;
  /* a segmented IGCSE · IB IA · IB EE control, for the pages that still need one */
  function levelTabs(levels, cur, onPick) {
    var seg = h('div', { class: 'seg seg--lv', role: 'group', 'aria-label': 'Level' });
    levels.forEach(function (l) {
      var b = h('button', { type: 'button', class: 'seg--' + l, 'aria-pressed': l === cur ? 'true' : 'false', text: WUL.LEVELS[l].long });
      b.addEventListener('click', function () { onPick(l); });
      seg.appendChild(b);
    });
    return seg;
  }

  /* ---------- router ---------- */
  function parse() {
    var s = (location.hash || '').replace(/^#\/?/, '');
    var p = s.split('/');
    if (!s) return { page: 'home' };
    if (p[0] === 'part' && p[1]) return { page: 'part', id: p[1], tab: p[2], step: p[3] };
    if (p[0] === 'tool' && p[1]) return { page: 'tool', id: p[1] };
    if (p[0] === 'hw') return { page: 'hw', id: p[1] ? decodeURIComponent(p[1]) : '' };
    return { page: p[0] };
  }
  var lastPart = null;
  function route() {
    var r = parse();
    WUL.closePop();
    document.querySelectorAll('.topnav a').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-page') === r.page); });
    /* the top-left link goes ONE level up: home → the Biology Hub, a tool → Tools, any other page → this site's home */
    var up = document.querySelector('.up');
    if (up) {
      var u = r.page === 'home' || !PAGES[r.page] ? ['https://nlcsbiology.com/biology-hub/', '← Biology Hub'] : r.page === 'tool' ? ['#/tools', '← Tools'] : ['#/', '← Write-Up Lab'];
      up.setAttribute('href', u[0]); up.textContent = u[1];
    }
    /* switching tabs inside the same part does not redraw the page */
    if (r.page === 'part' && lastPart === r.id && main.querySelector('.ptabs')) { showTab(r.tab || 'build'); if (r.step && WUL.openStep) WUL.openStep(r.step); return; }
    lastPart = r.page === 'part' ? r.id : null;
    main.innerHTML = '';
    var f = PAGES[r.page] || PAGES.home;
    f(r);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);
  /* account.js calls this when the homework list or a record arrives from the teacher's spreadsheet. A part page is
     drawn again only when its homework changed (a quiz half done must not start again); otherwise its banner is
     repainted. */
  var lastHwKey = '';
  WUL.homeworkChanged = function () {
    var r = parse(), key = JSON.stringify(hwList().map(function (x) { return [x.id, x.parts]; }));
    var changed = key !== lastHwKey; lastHwKey = key;
    if (r.page === 'part') { if (changed && main.querySelector('.ptabs')) { lastPart = null; route(); } else repaint(); return; }
    if (r.page === 'home' || r.page === 'hw' || r.page === 'start' || !PAGES[r.page]) route();
  };
  /* what an open part page paints from the records (its banner, the Homework set's count, the red-pen ticks),
     painted again after every change to this part's record */
  var pagePaint = [];
  function repaint() { pagePaint.forEach(function (fn) { try { fn(); } catch (e) {} }); }
  WUL.onRecord(function (id) { if (id === curPart) repaint(); });

  var PAGES = {};

  /* ---------- home ---------- */
  PAGES.home = function () {
    document.title = 'Write-Up Lab · lab reports from IGCSE to the IB';
    var hero = h('section', { class: 'hero hero--one wrap' });
    hero.innerHTML =
      '<p class="eyebrow">Lab reports · IGCSE → IB Internal Assessment → Extended Essay</p>' +
      '<h1 class="hero__h">Learn to write a lab report, <span class="hero__u">one part at a time.</span></h1>' +
      '<p class="hero__lede">This is a full lab report. Click any part to open it. A part in a <span class="dash-demo">blue dashed box</span> is added at IB; one in an <span class="dash-demo dash-demo--ee">orange dashed box</span> is only in the Extended Essay.</p>' +
      '<div class="hero__cta"><a class="btn btn--go btn--lg" href="#/start">New to lab reports? Start from zero →</a><a class="btn btn--ghost btn--lg" href="#/check">Check my report</a></div>';
    main.appendChild(hero);
    if (hwList().length) main.appendChild(hwBox());
    var mapWrap = h('section', { class: 'wrap rmapwrap', 'aria-label': 'A full report to explore' });
    main.appendChild(mapWrap);
    WUL.reportMap(mapWrap);

    /* every part */
    var map = h('section', { class: 'wrap mapsec' });
    map.innerHTML = '<div class="sechead"><p class="eyebrow">Every part, in the order you do your investigation</p><h2>All the parts</h2>' +
      '<p class="sechead__p">The dots show which levels need that part: ' + lvDots('g') + ' IGCSE ' + lvDots('i') + ' IB IA ' + lvDots('e') + ' IB EE.</p></div>';
    var grid = h('div', { class: 'map' });
    var stageN = 0;
    WUL.STAGES.forEach(function (sg) {
      var list = stationsByStage(sg.id);
      if (!list.length) return;
      stageN++;
      var col = h('div', { class: 'map__stage' });
      col.innerHTML = '<div class="map__h"><span class="map__n" aria-hidden="true">' + stageN + '</span><span class="map__name">' + esc(sg.name) + '</span><span class="map__blurb">' + esc(sg.blurb) + '</span></div>';
      var ul = h('ul', { class: 'map__list' });
      list.forEach(function (s) {
        var ibOnly = s.levels.indexOf('g') < 0, hs = hwState(s.id);
        ul.appendChild(h('li', { html: '<a class="map__a' + (ibOnly ? ' is-other' + (s.levels.indexOf('i') < 0 ? ' is-ee' : '') : '') + (hs ? ' is-hw is-hw--' + hs : '') + '" href="#/part/' + esc(s.id) + '"' + (hs ? ' title="Homework: ' + HW_WORDS[hs] + '"' : '') + '><span class="map__t">' + (hs ? '<span class="hwdot hwdot--' + hs + '" aria-label="Homework: ' + HW_WORDS[hs] + '"></span>' : '') + esc(s.title) + '</span><span class="map__m">' + lvDots(s.levels) + tick(s.id, WUL.level()) + '</span></a>' }));
      });
      col.appendChild(ul);
      grid.appendChild(col);
    });
    map.appendChild(grid);
    main.appendChild(map);

    if (WUL.TOOLS.length) {
      var tl = h('section', { class: 'wrap toolsec' });
      tl.innerHTML = '<div class="sechead"><p class="eyebrow">Practise on these</p><h2>Tools</h2></div>';
      tl.appendChild(toolGrid());
      main.appendChild(tl);
    }
  };

  /* "Your homework" on the home page: each piece, its date and how much is done */
  function hwBox() {
    var box = h('section', { class: 'wrap hwbox', 'aria-label': 'Your homework' });
    box.appendChild(h('h2', { class: 'hwbox__h', text: 'Your homework' }));
    box.appendChild(h('p', { class: 'hwbox__p', text: 'Your work is saved for your teacher as you go. There is nothing to hand in.' }));
    hwList().forEach(function (hw) {
      var d = 0, t = 0, fin = 0;
      (hw.parts || []).forEach(function (id) { var x = hwDone(id); if (!x.any) return; d += x.done; t += x.units; if (x.state === 'done') fin++; });
      box.appendChild(h('a', { class: 'hwrow', href: '#/hw/' + encodeURIComponent(hw.id), html: '<b>' + esc(hw.title) + '</b><span class="hwrow__due">' + hwDue(hw) + '</span><span class="hwrow__n">' + fin + ' of ' + (hw.parts || []).length + ' parts done</span>' }));
    });
    return box;
  }

  function toolGrid() {
    var g = h('div', { class: 'tools' });
    WUL.TOOLS.forEach(function (t) {
      var ibOnly = t.lv && t.lv.indexOf('g') < 0;
      g.appendChild(h('a', { class: 'tool' + (ibOnly ? ' is-other' + (t.lv.indexOf('i') < 0 ? ' is-ee' : '') : ''), href: '#/tool/' + t.name, html: '<span class="tool__icon" aria-hidden="true">' + (t.icon || '✎') + '</span><span class="tool__t">' + esc(t.title) + '</span><span class="tool__b">' + esc(t.blurb || '') + '</span>' + lvDots(t.lv) }));
    });
    return g;
  }

  /* ---------- one part: tabs, and a list of steps you open one at a time ---------- */
  var TABS = [
    { id: 'build', name: 'Learn' }, { id: 'redpen', name: 'Red pen' }, { id: 'traps', name: 'Mistakes to avoid' },
    { id: 'test', name: 'Test yourself' }, { id: 'words', name: 'Keywords' }, { id: 'further', name: 'Go further' }
  ];
  var FIRST_TAB = 'build', curPart = null;
  function showTab(id) {
    var tabs = main.querySelector('.ptabs'); if (!tabs) return;
    var ok = !!main.querySelector('.pchap[data-tab="' + id + '"]');
    if (!ok) id = FIRST_TAB;
    if (id === 'traps' && curPart) WUL.track.traps(curPart);
    tabs.querySelectorAll('a').forEach(function (a) {
      var on = a.getAttribute('data-tab') === id;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    main.querySelectorAll('.pchap').forEach(function (c) { c.hidden = c.getAttribute('data-tab') !== id; });
    var top = tabs.getBoundingClientRect().top + window.scrollY - 80;
    if (window.scrollY > top) window.scrollTo(0, top);
  }
  /* a plain name for a block, for the list of steps */
  function blockName(b) {
    if (b.title) return b.title;
    if (b.type === 'callout') return b.label || 'Remember';
    if (b.type === 'note') return b.title || b.label || ({ ib: 'At IB', ee: 'For the Extended Essay', igcse: 'At IGCSE', house: 'Our rule', warn: 'Careful', tip: 'Tip' })[b.tone] || 'Note';
    if (b.type === 'frames') return 'Sentence starters';
    if (b.type === 'rules') return 'Remember';
    if (b.type === 'widget') { var t = WUL.TOOLS.filter(function (x) { return x.name === b.name; })[0]; return t ? t.title : 'Try it'; }
    if (b.type === 'compare') return 'Right and wrong';
    return 'Look at this';
  }

  PAGES.part = function (r) {
    var s = WUL.stations[r.id];
    if (!s) { main.appendChild(h('div', { class: 'wrap', html: '<h1>Not found</h1><p><a href="#/">Back to the report</a></p>' })); return; }
    seen(s.id);
    curPart = s.id; pagePaint = [];
    var hws = hwFor(s.id);
    document.title = s.title + ' · Write-Up Lab';
    var base = s.levels.charAt(0);                    /* the first level this part exists at: IGCSE for most */
    var levels = ['g', 'i', 'e'].filter(function (l) { return s.levels.indexOf(l) >= 0; });
    var stage = WUL.STAGES.filter(function (g) { return g.id === s.stage; })[0] || { name: '' };

    var head = h('header', { class: 'phead wrap' });
    head.innerHTML = '<nav class="crumb"><a href="#/">Report</a><span>›</span><span>' + esc(stage.name) + '</span><span>›</span><span>' + esc(s.title) + '</span></nav>' +
      '<div class="phead__row"><h1 class="phead__h">' + esc(s.title) + '</h1>' + (base !== 'g' ? ibTag(s.levels) : lvDots(s.levels)) + '</div>' +
      '<p class="phead__job">' + md(WUL.pick(s.job, base), { inline: true }) + '</p>' +
      (s.where ? '<p class="phead__where"><span>Where it goes</span> ' + md(WUL.pick(s.where, base), { inline: true }) + '</p>' : '');
    main.appendChild(head);

    /* homework: what finishing this part takes, and where the pupil is (repainted as they work) */
    if (hws.length) {
      /* the box sits inside the page column, as the other boxes do */
      var ban = h('div', { class: 'hwban' });
      main.appendChild(h('section', { class: 'wrap hwbanwrap', 'aria-label': 'Homework' }, [ban]));
      var paintBanner = function () {
        var st = hwState(s.id);
        ban.innerHTML = '<p class="hwban__k">' + hwPill(st) + ' <span>' + esc(hws[0].title) + ' · ' + hwDue(hws[0]) + '</span></p>' +
          '<p class="hwban__p">' + esc(hwNeeds(s)) + '</p>' + hwChecklist(s);
      };
      paintBanner();
      pagePaint.push(paintBanner);
    }

    /* compare the levels: one button, then the three columns side by side */
    if (s.ladder) {
      var cmpWrap = h('div', { class: 'wrap' });
      var det = h('details', { class: 'cmpbar' });
      det.appendChild(h('summary', { html: '<span class="cmpbar__t">How this part changes</span><span class="cmpbar__lv"><i class="c-g">IGCSE</i><i class="c-i">IB IA</i><i class="c-e">IB EE</i></span><span class="cmpbar__o">Compare</span>' }));
      var lad = h('div', { class: 'ladder' });
      ['g', 'i', 'e'].forEach(function (l) {
        var items = s.ladder[l];
        var step = h('div', { class: 'ladder__s ladder__s--' + l + (!items || !items.length ? ' is-none' : '') });
        step.innerHTML = '<div class="ladder__k"><span class="ladder__lv">' + esc(WUL.LEVELS[l].long) + '</span></div>' +
          (items && items.length ? '<ul>' + items.map(function (t) { return '<li>' + md(t, { inline: true }) + '</li>'; }).join('') + '</ul>' : '<p class="ladder__none">' + (l === 'g' ? 'Not needed at IGCSE.' : 'Nothing new at this level.') + '</p>');
        lad.appendChild(step);
      });
      det.appendChild(lad);
      cmpWrap.appendChild(det);
      main.appendChild(cmpWrap);
    }

    var wrap = h('div', { class: 'wrap pbody' });
    var tabs = h('nav', { class: 'ptabs', 'aria-label': 'Sections of this part' });
    wrap.appendChild(tabs);
    main.appendChild(wrap);
    var chapters = {};
    function chapter(id, count) {
      var t = TABS.filter(function (x) { return x.id === id; })[0];
      var c = h('section', { class: 'pchap', id: id, 'data-tab': id, hidden: true });
      wrap.appendChild(c);
      tabs.appendChild(h('a', { href: '#/part/' + s.id + '/' + id, 'data-tab': id, html: esc(t.name) + (count ? ' <span class="ptabs__n">' + count + '</span>' : '') }));
      chapters[id] = c;
      return c;
    }

    /* LEARN — the build blocks as steps; IGCSE first, IB steps marked and closed */
    var steps = [];
    (s.build || []).forEach(function (b) {
      var lv = WUL.shows(b.lv, base) ? base : (['i', 'e'].filter(function (l) { return WUL.shows(b.lv, l); })[0] || base);
      steps.push({ b: b, lv: lv, extra: lv !== base, name: blockName(b) });
    });
    var fr = WUL.pick(s.frames, base);
    if (fr && fr.length) steps.push({ b: { type: 'frames', items: fr }, lv: base, extra: false, name: 'Sentence starters' });
    if (steps.length) {
      var learn = chapter('build', steps.length + ' steps');
      learn.appendChild(h('p', { class: 'bintro', html: 'Open one step at a time.' + (steps.some(function (x) { return x.extra; }) ? ' Steps marked ' + ibTag('i') + ' or ' + ibTag('e') + ' show what changes at IB.' : '') }));
      var list = h('ol', { class: 'steps' });
      learn.appendChild(list);
      steps.forEach(function (st, k) {
        var li = h('li', { class: 'step' + (st.extra ? ' step--ib lvscope-' + st.lv : '') });
        var btn = h('button', { type: 'button', class: 'step__h', 'aria-expanded': 'false',
          html: '<span class="step__n">' + (k + 1) + '</span><span class="step__t">' + esc(st.name) + '</span>' + (st.extra ? ibTag(st.b.lv || st.lv) : '') + '<span class="step__chev" aria-hidden="true"></span>' });
        var body = h('div', { class: 'step__b', hidden: true });
        li.appendChild(btn); li.appendChild(body);
        list.appendChild(li);
        st.li = li; st.btn = btn; st.body = body;
        btn.addEventListener('click', function () { open(k, btn.getAttribute('aria-expanded') !== 'true'); });
      });
      function fill(st, k) {
        if (st.filled) return;
        st.filled = true;
        var node = WUL.withLevel(st.lv, function () {
          var b = Object.assign({}, st.b); var t = b.title; delete b.title;   /* the step's own heading already names it */
          var n = WUL.block(b, { level: st.lv, station: s });
          b.title = t;
          return n;
        });
        if (node) st.body.appendChild(node);
        var nx = steps[k + 1];
        var foot = h('div', { class: 'step__f' });
        if (nx) {
          var go = h('button', { type: 'button', class: 'btn btn--go', html: 'Next: ' + esc(nx.name) + ' →' });
          go.addEventListener('click', function () { open(k + 1, true); });
          foot.appendChild(go);
        } else {
          foot.appendChild(h('a', { class: 'btn btn--go', href: '#/part/' + s.id + '/' + (s.redpen ? 'redpen' : 'test'), text: s.redpen ? 'Now try the red pen →' : 'Now test yourself →' }));
        }
        st.body.appendChild(foot);
      }
      function open(k, on) {
        if (on) WUL.track.step(s.id, k);
        steps.forEach(function (st, j) {
          var o = on && j === k;
          if (o) fill(st, j);
          st.btn.setAttribute('aria-expanded', o ? 'true' : 'false');
          st.body.hidden = !o;
          st.li.classList.toggle('is-open', o);
        });
        if (on) {
          var y = steps[k].li.getBoundingClientRect().top;
          if (y < 70 || y > window.innerHeight * 0.6) steps[k].li.scrollIntoView({ block: 'start', behavior: WUL.reduced() ? 'auto' : 'smooth' });
        }
      }
      open(0, true);
      WUL.openStep = function (sid) {
        for (var j = 0; j < steps.length; j++) if (steps[j].b.id === sid) { open(j, true); steps[j].li.scrollIntoView({ block: 'start' }); return true; }
        return false;
      };
      if (r.step) setTimeout(function () { WUL.openStep(r.step); }, 0);
      /* ?all=1 draws every step at once (tools/smoke.mjs uses it to test every block) */
      if (/[?&]all=1/.test(location.search)) steps.forEach(function (st, k) { fill(st, k); });
    }

    /* RED PEN — one tab per level that has its own */
    var rpLevels = s.redpen ? (('g' in s.redpen || 'i' in s.redpen || 'e' in s.redpen) ? levels.filter(function (l) { return s.redpen[l]; }) : [base]) : [];
    if (rpLevels.length) {
      var rpc = chapter('redpen');
      var rpHost = h('div');
      var seg = null;
      /* the mistakes this pupil found before are drawn found; each new one is recorded (track.js) */
      function foundKeys(l) {
        var x = WUL.rec(s.id), y = WUL.redpensOf(s).filter(function (v) { return v.l === l; })[0];
        return y && x ? y.keys.filter(function (k, i) { return (x.r[l] || '').charAt(i) === '1'; }) : [];
      }
      /* with several versions, a version whose mistakes are all found is ticked on its button */
      function paintRpSeg() {
        if (!seg) return;
        var st = WUL.partState(s.id) || { redpens: [] };
        seg.querySelectorAll('button').forEach(function (b) {
          var l = (b.className.match(/seg--([gie])/) || [])[1]; if (!l) return;
          var y = st.redpens.filter(function (v) { return v.l === l; })[0];
          b.textContent = WUL.LEVELS[l].long + (y && y.marks && y.found >= y.marks ? ' ✓' : '');
        });
      }
      function drawRp(l) {
        var rp = WUL.pick(s.redpen, l);
        rpHost.innerHTML = '';
        if (rp.title) rpHost.appendChild(h('p', { class: 'bintro', html: md(rp.title, { inline: true }) }));
        var hh = h('div', { class: 'lvscope-' + l }); rpHost.appendChild(hh);
        WUL.withLevel(l, function () { WUL.redpen(hh, rp, { found: foundKeys(l), onFind: function (k) { WUL.track.redpen(s.id, l, k); paintRpSeg(); } }); });
      }
      if (rpLevels.length > 1) {
        seg = levelTabs(rpLevels, rpLevels[0], function (l) {
          seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.className.indexOf('seg--' + l) >= 0 ? 'true' : 'false'); });
          drawRp(l);
        });
        rpc.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'Red pen for' }), seg]));
        paintRpSeg();
        pagePaint.push(paintRpSeg);
      }
      rpc.appendChild(rpHost);
      drawRp(rpLevels[0]);
    }

    /* MISTAKES — every trap; the IB ones are marked */
    var traps = s.traps || [];
    if (traps.length) {
      var tc = chapter('traps', traps.length);
      var ul = h('ul', { class: 'traps' });
      traps.forEach(function (t) {
        var ib = t.lv && t.lv.indexOf(base) < 0;
        ul.appendChild(h('li', { class: 'trap' + (ib ? ' trap--ib' : ''), html: (ib ? '<div class="trap__tag">' + ibTag(t.lv) + '</div>' : '') + '<div class="trap__bad"><span aria-hidden="true">✘</span><span>' + md(t.bad, { inline: true }) + '</span></div>' + (t.good ? '<div class="trap__good"><span aria-hidden="true">✔</span><span>' + md(t.good, { inline: true }) + '</span></div>' : '') }));
      });
      tc.appendChild(ul);
    }

    /* TEST — a question set per level, when the sets differ */
    var sets = questionSets(s);
    /* homework: a set of every question not yet answered, IGCSE and IB together, offered first */
    if (hws.length && (s.test || []).length) sets = [{ hw: true, l: s.levels.charAt(0), ls: [] }].concat(sets);
    if (sets.length) {
      var qc = chapter('test', sets[0].hw ? (s.test || []).length : sets[0].qs.length);
      var qHost = h('div');
      function hwLeft() { return WUL.questionsLeft(s.id).length; }
      function setName(x) {
        if (x.hw) { var n = hwLeft(); return n ? 'Homework · ' + n + ' left' : 'Homework · all answered ✓'; }
        if (x.ls.length === 3) return 'Questions';
        if (x.ls.join('') === 'ie') return 'IB questions';
        return WUL.LEVELS[x.l].long + ' questions';
      }
      function answered(q, letter) { WUL.track.answer(s.id, q, letter); }
      var qseg = null;
      function paintQSeg() { if (qseg && sets[0].hw) qseg.firstChild.innerHTML = esc(setName(sets[0])); }
      function drawQ(x) {
        qHost.innerHTML = '';
        var hh = h('div', { class: 'lvscope-' + x.l }); qHost.appendChild(hh);
        if (x.hw) {
          /* every question still to answer; when none is left, all of them again, for practice */
          var left = WUL.questionsLeft(s.id), qs = left.length ? left : (s.test || []).slice();
          hh.appendChild(h('p', { class: 'bintro', text: left.length ? 'Your homework: the ' + left.length + ' question' + (left.length === 1 ? '' : 's') + ' you have not answered yet, from every level. Questions marked IB are what the IB asks.' : 'Every question in this part is answered. You can go through them all again.' }));
          WUL.withLevel(s.levels.charAt(s.levels.length - 1), function () {
            WUL.quiz(hh, qs, { all: true, onAnswer: answered, onDone: paintQSeg, next: function () { return nextLink(s.id, 'btn btn--go'); } });
          });
          return;
        }
        WUL.withLevel(x.l, function () {
          WUL.quiz(hh, x.qs, { id: qid(s, x), onAnswer: answered, next: function () { return nextLink(s.id, 'btn btn--go'); } });
        });
      }
      if (sets.length > 1) {
        qseg = h('div', { class: 'seg seg--lv', role: 'group', 'aria-label': 'Question set' });
        sets.forEach(function (x, k) {
          var b = h('button', { type: 'button', class: x.hw ? 'seg--hw' : 'seg--' + x.l, 'aria-pressed': k === 0 ? 'true' : 'false', html: x.hw ? esc(setName(x)) : esc(setName(x)) + ' <span class="ptabs__n">' + x.qs.length + '</span>' });
          b.addEventListener('click', function () { qseg.querySelectorAll('button').forEach(function (y) { y.setAttribute('aria-pressed', y === b ? 'true' : 'false'); }); paintQSeg(); drawQ(x); });
          qseg.appendChild(b);
        });
        qc.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'Choose a set' }), qseg]));
        pagePaint.push(paintQSeg);
      }
      qc.appendChild(qHost);
      drawQ(sets[0]);
    }

    /* KEYWORDS — all of them */
    if ((s.words || []).length) {
      var wc = chapter('words', s.words.length);
      wc.appendChild(h('p', { class: 'bintro', text: 'Tap a card to turn it over.' }));
      var wh = h('div'); wc.appendChild(wh);
      WUL.cards(wh, s.words, { all: true });
    }

    /* GO FURTHER */
    if ((s.further || []).length) {
      var fc = chapter('further');
      s.further.forEach(function (f, k) {
        var d = h('details', { class: 'further' }, [
          h('summary', { html: '<span class="further__k">Beyond the syllabus</span> ' + esc(f.title) }),
          h('div', { class: 'further__b prose', html: md(f.md, { block: true }) + (f.cite ? '<p class="further__c">Source: ' + md(f.cite, { inline: true }) + '</p>' : '') })
        ]);
        d.addEventListener('toggle', function () { if (d.open) WUL.track.further(s.id, k); });
        fc.appendChild(d);
      });
    }

    /* under every tab: sources and the way on */
    var foot = h('div', { class: 'pfoot' });
    if (s.sources && s.sources.length) foot.appendChild(h('div', { class: 'psrc', html: '<span>Checked against</span> ' + s.sources.map(function (x) { return md(x, { inline: true }); }).join(' · ') }));
    var nav = h('div', { class: 'pnext' });
    var pr = neighbour(s.id, -1), nx = neighbour(s.id, 1);
    if (pr) nav.appendChild(h('a', { class: 'pnext__a pnext__a--prev', href: '#/part/' + pr.id, html: '<span>← Before this</span><b>' + esc(pr.title) + '</b>' }));
    if (nx) nav.appendChild(h('a', { class: 'pnext__a pnext__a--next', href: '#/part/' + nx.id, html: '<span>Next part →</span><b>' + esc(nx.title) + '</b>' }));
    foot.appendChild(nav);
    wrap.appendChild(foot);

    showTab(r.tab || 'build');
  };

  function neighbour(id, d) {
    var s = WUL.stations[id];
    var R = WUL.ROUTE[s && s.levels.indexOf('g') < 0 ? s.levels.charAt(0) : 'e'].filter(function (x) { return WUL.stations[x]; });
    var i = R.indexOf(id);
    if (i < 0) {
      var all = WUL.STAGES.reduce(function (a, g) { return a.concat(stationsByStage(g.id).map(function (x) { return x.id; })); }, []);
      i = all.indexOf(id); return all[i + d] ? WUL.stations[all[i + d]] : null;
    }
    var k = R[i + d]; return k ? WUL.stations[k] : null;
  }
  function nextLink(id, cls) {
    var nx = neighbour(id, 1);
    if (!nx) return h('a', { class: cls, href: '#/', text: 'Back to the report' });
    return h('a', { class: cls, href: '#/part/' + nx.id, text: 'Next part: ' + nx.title + ' →' });
  }

  /* ---------- homework: #/hw (all of it) and #/hw/<id> (one piece) ---------- */
  PAGES.hw = function (r) {
    document.title = 'Homework · Write-Up Lab';
    var w = h('section', { class: 'wrap hwpg' });
    main.appendChild(w);
    var H = WUL.hw || {};
    function say(t) { w.appendChild(h('p', { class: 'phead__job', html: t })); }
    w.appendChild(h('p', { class: 'eyebrow', text: 'Homework' }));
    if (!H.signedIn) { w.appendChild(h('h1', { class: 'phead__h', text: 'Your homework' })); say('Sign in with your school Google account (top right) to see your homework.'); return; }
    if (!H.loaded) { w.appendChild(h('h1', { class: 'phead__h', text: 'Your homework' })); say(H.spent ? 'Your sign-in has expired. Sign in again with your school Google account (top right) to see your homework.' : 'Loading your homework…'); return; }
    var list = hwList();
    var one = r.id ? list.filter(function (x) { return String(x.id) === String(r.id); })[0] : (list.length === 1 ? list[0] : null);
    if (!one) {
      w.appendChild(h('h1', { class: 'phead__h', text: 'Your homework' }));
      if (r.id) say('This homework was not found for your account. It may be finished and past its date.');
      if (!list.length) { say('You have no Write-Up Lab homework at the moment.'); return; }
      w.appendChild(hwBox());
      return;
    }
    w.appendChild(h('h1', { class: 'phead__h', text: one.title }));
    say(esc(hwDue(one).replace(/^d/, 'D')) + '. Your work is saved for your teacher as you go. There is nothing to hand in.');
    w.insertAdjacentHTML('beforeend', HW_KEY);
    var grid = h('div', { class: 'hwparts' });
    (one.parts || []).forEach(function (id) {
      var s = WUL.stations[id]; if (!s) return;
      var st = WUL.partState(id), hs = hwDone(id).state;
      var card = h('article', { class: 'hwpart hwpart--' + hs });
      card.innerHTML = '<h2 class="hwpart__h"><a href="#/part/' + esc(id) + '">' + esc(s.title) + '</a>' + hwPill(hs) + '</h2>' +
        '<p class="hwpart__p">' + esc(hwNeeds(s)) + '</p>' + hwChecklist(s) +
        '<p class="hwpart__go"><a class="btn btn--go" href="#/part/' + esc(id) + (st && st.done && st.redpens.every(function (y) { return y.found >= y.marks; }) ? '/test' : '') + '">' + (hs === 'done' ? 'Open it again' : hs === 'partly' ? 'Carry on' : 'Start') + ' →</a></p>';
      grid.appendChild(card);
    });
    w.appendChild(grid);
    if (list.length > 1) w.appendChild(h('p', { html: '<a href="#/hw">All your homework</a>' }));
  };

  /* ---------- start from zero ---------- */
  PAGES.start = function () {
    document.title = 'Start from zero · Write-Up Lab';
    var L = WUL.level();
    var R = WUL.ROUTE[L].filter(function (id) { return WUL.stations[id]; });
    var w = h('section', { class: 'wrap routepg' });
    var firstUndone = R.filter(function (id) { return !(progAt(id, L).best >= 0.999); })[0] || R[0];
    w.innerHTML = '<p class="eyebrow">Start from zero</p><h1 class="phead__h">Your route through a report</h1>' +
      '<p class="phead__job">Do the parts in this order. Each part takes about ten minutes. Read <u>Learn</u>, do the <u>Red pen</u>, then <u>Test yourself</u>. Your progress stays on this device; sign in with your school Google account and it is saved for your teacher too.</p>';
    w.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'I am writing' }), levelTabs(['g', 'i', 'e'], L, function (l) { WUL.store.set('level', l); route(); })]));
    if (firstUndone) w.appendChild(h('p', { html: '<a class="btn btn--go btn--lg" href="#/part/' + firstUndone + '">' + (prog(R[0]).seen ? 'Carry on: ' : 'Begin: ') + esc(WUL.stations[firstUndone].title) + ' →</a>' }));
    var ol = h('ol', { class: 'trail' });
    R.forEach(function (id, k) {
      var s = WUL.stations[id], p = progAt(id, L);
      ol.appendChild(h('li', { class: 'trail__i' + (p.best >= 0.999 ? ' is-done' : p.seen ? ' is-seen' : '') + (id === firstUndone ? ' is-next' : ''), html:
        '<a href="#/part/' + id + '"><span class="trail__n">' + (k + 1) + '</span><span class="trail__t"><b>' + esc(s.title) + (s.levels.indexOf('g') < 0 ? ' ' + ibTag(s.levels) : '') + '</b><span>' + md(WUL.pick(s.job, L), { inline: true }) + '</span></span>' + tick(id, L) + '</a>' }));
    });
    w.appendChild(ol);
    main.appendChild(w);
  };

  /* ---------- tools ---------- */
  PAGES.tools = function () {
    document.title = 'Tools · Write-Up Lab';
    var w = h('section', { class: 'wrap' });
    w.innerHTML = '<p class="eyebrow">Practise on these</p><h1 class="phead__h">Tools</h1><p class="phead__job">You can also find each tool inside its part of the report.</p>';
    w.appendChild(toolGrid());
    main.appendChild(w);
  };
  PAGES.tool = function (r) {
    var t = WUL.TOOLS.filter(function (x) { return x.name === r.id; })[0];
    var w = h('section', { class: 'wrap toolpg' });
    if (!t || !WUL.widgets[r.id]) { w.innerHTML = '<h1>Not found</h1><p><a href="#/tools">All tools</a></p>'; main.appendChild(w); return; }
    document.title = t.title + ' · Write-Up Lab';
    w.innerHTML = '<nav class="crumb"><a href="#/tools">Tools</a><span>›</span><span>' + esc(t.title) + '</span></nav><h1 class="phead__h">' + esc(t.title) + '</h1><p class="phead__job">' + md(t.blurb || '', { inline: true }) + '</p>';
    var tl = ['g', 'i', 'e'].filter(function (l) { return !t.lv || t.lv.indexOf(l) >= 0; });
    var L = tl.indexOf(WUL.level()) >= 0 ? WUL.level() : tl[0];
    var host = h('div', { class: 'widget widget--page' });
    function draw() {
      host.innerHTML = ''; host.className = 'widget widget--page lvscope-' + L;
      try { WUL.withLevel(L, function () { WUL.widgets[r.id](host, t.opts || {}, { level: L }); }); } catch (e) { console.error(e); host.textContent = 'This tool failed to load.'; }
    }
    if (tl.length > 1) {
      var seg = levelTabs(tl, L, function (l) { L = l; WUL.store.set('level', l); seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.className.indexOf('seg--' + l) >= 0 ? 'true' : 'false'); }); draw(); });
      w.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'Level' }), seg]));
    }
    w.appendChild(host);
    if (t.station && WUL.stations[t.station]) w.appendChild(h('p', { class: 'toolpg__back', html: 'Part of <a href="#/part/' + t.station + '">' + esc(WUL.stations[t.station].title) + '</a>.' }));
    main.appendChild(w);
    draw();
  };

  /* ---------- keywords ---------- */
  PAGES.words = function () {
    document.title = 'Keywords · Write-Up Lab';
    var w = h('section', { class: 'wrap' });
    w.innerHTML = '<p class="eyebrow">Keywords</p><h1 class="phead__h">Keywords</h1><p class="phead__job">All the keywords in one place. Tap a card to see what it means.</p>';
    var search = h('input', { type: 'search', id: 'wsearch', class: 'search', placeholder: 'Find a word…', 'aria-label': 'Find a keyword' });
    w.appendChild(search);
    var host = h('div');
    w.appendChild(host);
    main.appendChild(w);
    var all = Object.keys(WUL.words).map(function (k) { return WUL.words[k]; }).sort(function (a, b) { return a.term.localeCompare(b.term); });
    function draw() {
      var q = search.value.trim().toLowerCase();
      WUL.cards(host, all.filter(function (x) { return !q || x.term.toLowerCase().indexOf(q) >= 0 || x.def.toLowerCase().indexOf(q) >= 0; }), { all: true });
    }
    search.addEventListener('input', draw);
    draw();
  };

  /* ---------- checklist ---------- */
  PAGES.check = function () {
    document.title = 'Checklist · Write-Up Lab';
    var L = WUL.level();
    var C = WUL.CHECKLIST || [];
    var ticks = WUL.store.get('check.' + L, {});
    var w = h('section', { class: 'wrap checkpg lvscope-' + L });
    w.innerHTML = '<p class="eyebrow">Checklist</p><h1 class="phead__h">Check my report</h1><p class="phead__job">Read your own report. Tick each box that is true for it. Your ticks stay on this device.</p>';
    w.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'I am writing' }), levelTabs(['g', 'i', 'e'], L, function (l) { WUL.store.set('level', l); route(); })]));
    var bar = h('div', { class: 'checkbar' }, [h('div', { class: 'checkbar__fill' }), h('span', { class: 'checkbar__t' })]);
    var reset = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Clear my ticks' });
    w.appendChild(h('div', { class: 'checktop' }, [bar, reset]));
    var total = 0;
    C.forEach(function (grp) {
      var items = grp.items.filter(function (it) { return WUL.shows(it.lv, L); });
      if (!items.length) return;
      var sec = h('div', { class: 'checkgrp' });
      sec.appendChild(h('h2', { class: 'checkgrp__h', html: esc(grp.title) + (grp.part && WUL.stations[grp.part] ? ' <a class="checkgrp__a" href="#/part/' + grp.part + '">How to write it →</a>' : '') }));
      items.forEach(function (it) {
        total++;
        var id = 'ck-' + L + '-' + it.id;
        var lab = h('label', { class: 'ck', for: id });
        var box = h('input', { type: 'checkbox', id: id });
        box.checked = !!ticks[it.id];
        box.addEventListener('change', function () { ticks[it.id] = box.checked; WUL.store.set('check.' + L, ticks); paintBar(); });
        lab.appendChild(box);
        lab.appendChild(h('span', { class: 'ck__t', html: md(it.t, { inline: true }) + (it.lv && it.lv.indexOf('g') < 0 ? ' ' + ibTag(it.lv) : '') }));
        sec.appendChild(lab);
      });
      w.appendChild(sec);
    });
    function paintBar() {
      var n = w.querySelectorAll('.ck input:checked').length;
      bar.querySelector('.checkbar__fill').style.width = (total ? n / total * 100 : 0) + '%';
      bar.querySelector('.checkbar__t').textContent = n + ' of ' + total + ' ticked';
    }
    reset.addEventListener('click', function () { WUL.store.set('check.' + L, {}); w.querySelectorAll('.ck input').forEach(function (b) { b.checked = false; }); paintBar(); });
    main.appendChild(w);
    paintBar();
  };

  /* ---------- boot ---------- */
  if (WUL.problems && WUL.problems.length) console.warn('Write-Up Lab content problems:\n' + WUL.problems.join('\n'));
  route();
  /* for tools/smoke.mjs: how many script errors happened while this page drew */
  function markErrors() { document.body.setAttribute('data-errors', String((window.__errs || []).length)); }
  window.addEventListener('hashchange', function () { setTimeout(markErrors, 0); });
  markErrors();
})(window.WUL);
