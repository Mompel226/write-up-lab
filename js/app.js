/* ============================================================
   app.js — the pages. Hash routes:
     #/                     home: the report to explore, then every part, then the tools
     #/part/<id>[/<tab>]    one part of a report, in tabs: learn · redpen · traps · test · words · further
     #/start                "Start from zero": the parts in order
     #/tools · #/tool/<n>   the tools
     #/words                every keyword
     #/check                the checklist

   ONE REPORT, NOT THREE (Daniel, 24 Sep 2026). There is no level switch in the
   top bar. Every part is shown at IGCSE first; what the IB IA and the IB EE
   change sits beside it, behind buttons marked IB IA / IB EE, so an IGCSE
   student can open it out of curiosity. Parts that exist only at IB are shown
   too, with a dashed outline.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var main = document.getElementById('main');

  /* the route in, per level (station ids, in order) */
  WUL.ROUTE = {
    g: ['report', 'variables', 'question', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'graphs', 'analysis', 'conclusion', 'evaluation', 'measurement', 'sources'],
    i: ['report', 'question', 'background', 'variables', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'observations', 'graphs', 'errorbars', 'stats', 'analysis', 'conclusion', 'evaluation', 'measurement', 'sources', 'format', 'integrity'],
    e: ['report', 'question', 'background', 'variables', 'hypothesis', 'apparatus', 'safety', 'method', 'tables', 'processing', 'observations', 'graphs', 'errorbars', 'stats', 'analysis', 'discussion', 'conclusion', 'evaluation', 'measurement', 'sources', 'format', 'integrity', 'reflection']
  };

  function prog(id) { return (WUL.store.get('prog', {})[id]) || {}; }
  function seen(id) { var p = WUL.store.get('prog', {}); p[id] = p[id] || {}; if (!p[id].seen) { p[id].seen = Date.now(); WUL.store.set('prog', p); } }
  function stationsByStage(stage) {
    return WUL.stationOrder.map(function (id) { return WUL.stations[id]; }).filter(function (s) { return s.stage === stage; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function lvDots(lv) {
    lv = lv || 'gie';
    return '<span class="dots" aria-label="' + ['g', 'i', 'e'].filter(function (l) { return lv.indexOf(l) >= 0; }).map(function (l) { return WUL.LEVELS[l].name; }).join(', ') + '">' +
      ['g', 'i', 'e'].map(function (l) { return '<i class="' + (lv.indexOf(l) >= 0 ? 'on-' + l : '') + '"></i>'; }).join('') + '</span>';
  }
  function tick(id) {
    var p = prog(id);
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
    if (p[0] === 'part' && p[1]) return { page: 'part', id: p[1], tab: p[2] };
    if (p[0] === 'tool' && p[1]) return { page: 'tool', id: p[1] };
    return { page: p[0] };
  }
  var lastPart = null;
  function route() {
    var r = parse();
    WUL.closePop();
    document.querySelectorAll('.topnav a').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-page') === r.page); });
    /* switching tabs inside the same part does not redraw the page */
    if (r.page === 'part' && lastPart === r.id && main.querySelector('.ptabs')) { showTab(r.tab || 'build'); return; }
    lastPart = r.page === 'part' ? r.id : null;
    main.innerHTML = '';
    var f = PAGES[r.page] || PAGES.home;
    f(r);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  var PAGES = {};

  /* ---------- home ---------- */
  PAGES.home = function () {
    document.title = 'Write-Up Lab · lab reports from IGCSE to the IB';
    var hero = h('section', { class: 'hero hero--one wrap' });
    hero.innerHTML =
      '<p class="eyebrow">Lab reports · IGCSE → IB Internal Assessment → Extended Essay</p>' +
      '<h1 class="hero__h">Learn to write a lab report, <span class="hero__u">one part at a time.</span></h1>' +
      '<p class="hero__lede">This is a full lab report. Click any part to open it. A part with a <span class="dash-demo">dashed outline</span> is added at IB.</p>' +
      '<div class="hero__cta"><a class="btn btn--go btn--lg" href="#/start">New to lab reports? Start from zero →</a><a class="btn btn--ghost btn--lg" href="#/check">Check my report</a></div>';
    main.appendChild(hero);
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
        var ibOnly = s.levels.indexOf('g') < 0;
        ul.appendChild(h('li', { html: '<a class="map__a' + (ibOnly ? ' is-other' : '') + '" href="#/part/' + esc(s.id) + '"><span class="map__t">' + esc(s.title) + '</span><span class="map__m">' + lvDots(s.levels) + tick(s.id) + '</span></a>' }));
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

  function toolGrid() {
    var g = h('div', { class: 'tools' });
    WUL.TOOLS.forEach(function (t) {
      var ibOnly = t.lv && t.lv.indexOf('g') < 0;
      g.appendChild(h('a', { class: 'tool' + (ibOnly ? ' is-other' : ''), href: '#/tool/' + t.name, html: '<span class="tool__icon" aria-hidden="true">' + (t.icon || '✎') + '</span><span class="tool__t">' + esc(t.title) + '</span><span class="tool__b">' + esc(t.blurb || '') + '</span>' + lvDots(t.lv) }));
    });
    return g;
  }

  /* ---------- one part: tabs, and a list of steps you open one at a time ---------- */
  var TABS = [
    { id: 'build', name: 'Learn' }, { id: 'redpen', name: 'Red pen' }, { id: 'traps', name: 'Mistakes to avoid' },
    { id: 'test', name: 'Test yourself' }, { id: 'words', name: 'Keywords' }, { id: 'further', name: 'Go further' }
  ];
  var FIRST_TAB = 'build';
  function showTab(id) {
    var tabs = main.querySelector('.ptabs'); if (!tabs) return;
    var ok = !!main.querySelector('.pchap[data-tab="' + id + '"]');
    if (!ok) id = FIRST_TAB;
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
      /* ?all=1 draws every step at once (tools/smoke.mjs uses it to test every block) */
      if (/[?&]all=1/.test(location.search)) steps.forEach(function (st, k) { fill(st, k); });
    }

    /* RED PEN — one tab per level that has its own */
    var rpLevels = s.redpen ? (('g' in s.redpen || 'i' in s.redpen || 'e' in s.redpen) ? levels.filter(function (l) { return s.redpen[l]; }) : [base]) : [];
    if (rpLevels.length) {
      var rpc = chapter('redpen');
      var rpHost = h('div');
      function drawRp(l) {
        var rp = WUL.pick(s.redpen, l);
        rpHost.innerHTML = '';
        if (rp.title) rpHost.appendChild(h('p', { class: 'bintro', html: md(rp.title, { inline: true }) }));
        var hh = h('div', { class: 'lvscope-' + l }); rpHost.appendChild(hh);
        WUL.withLevel(l, function () { WUL.redpen(hh, rp); });
      }
      if (rpLevels.length > 1) {
        var seg = levelTabs(rpLevels, rpLevels[0], function (l) {
          seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.className.indexOf('seg--' + l) >= 0 ? 'true' : 'false'); });
          drawRp(l);
        });
        rpc.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'Red pen for' }), seg]));
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
    var sets = [];
    levels.forEach(function (l) {
      var qs = (s.test || []).filter(function (q) { return WUL.shows(q.lv, l); });
      if (!qs.length) return;
      var same = sets.filter(function (x) { return x.qs.length === qs.length && x.qs.every(function (q, k) { return q === qs[k]; }); })[0];
      if (same) { same.ls.push(l); return; }
      sets.push({ l: l, ls: [l], qs: qs });
    });
    if (sets.length) {
      var qc = chapter('test', sets[0].qs.length);
      var qHost = h('div');
      function setName(x) {
        if (x.ls.length === 3) return 'Questions';
        if (x.ls.join('') === 'ie') return 'IB questions';
        return WUL.LEVELS[x.l].long + ' questions';
      }
      function drawQ(x) {
        qHost.innerHTML = '';
        var hh = h('div', { class: 'lvscope-' + x.l }); qHost.appendChild(hh);
        WUL.withLevel(x.l, function () {
          WUL.quiz(hh, x.qs, { id: s.id + (x.l === base ? '' : '.' + x.l), next: function () { return nextLink(s.id, 'btn btn--go'); } });
        });
      }
      if (sets.length > 1) {
        var qseg = h('div', { class: 'seg seg--lv', role: 'group', 'aria-label': 'Question set' });
        sets.forEach(function (x, k) {
          var b = h('button', { type: 'button', class: 'seg--' + x.l, 'aria-pressed': k === 0 ? 'true' : 'false', html: esc(setName(x)) + ' <span class="ptabs__n">' + x.qs.length + '</span>' });
          b.addEventListener('click', function () { qseg.querySelectorAll('button').forEach(function (y) { y.setAttribute('aria-pressed', y === b ? 'true' : 'false'); }); drawQ(x); });
          qseg.appendChild(b);
        });
        qc.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'Choose a set' }), qseg]));
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
      s.further.forEach(function (f) {
        fc.appendChild(h('details', { class: 'further' }, [
          h('summary', { html: '<span class="further__k">Beyond the syllabus</span> ' + esc(f.title) }),
          h('div', { class: 'further__b prose', html: md(f.md, { block: true }) + (f.cite ? '<p class="further__c">Source: ' + md(f.cite, { inline: true }) + '</p>' : '') })
        ]));
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

  /* ---------- start from zero ---------- */
  PAGES.start = function () {
    document.title = 'Start from zero · Write-Up Lab';
    var L = WUL.level();
    var R = WUL.ROUTE[L].filter(function (id) { return WUL.stations[id]; });
    var w = h('section', { class: 'wrap routepg' });
    var firstUndone = R.filter(function (id) { return !(prog(id).best >= 0.999); })[0] || R[0];
    w.innerHTML = '<p class="eyebrow">Start from zero</p><h1 class="phead__h">Your route through a report</h1>' +
      '<p class="phead__job">Do the parts in this order. Each part takes about ten minutes. Read <u>Learn</u>, do the <u>Red pen</u>, then <u>Test yourself</u>. Your progress stays on this device.</p>';
    w.appendChild(h('div', { class: 'pchap__lv' }, [h('span', { class: 'wd-k', text: 'I am writing' }), levelTabs(['g', 'i', 'e'], L, function (l) { WUL.store.set('level', l); route(); })]));
    if (firstUndone) w.appendChild(h('p', { html: '<a class="btn btn--go btn--lg" href="#/part/' + firstUndone + '">' + (prog(R[0]).seen ? 'Carry on: ' : 'Begin: ') + esc(WUL.stations[firstUndone].title) + ' →</a>' }));
    var ol = h('ol', { class: 'trail' });
    R.forEach(function (id, k) {
      var s = WUL.stations[id], p = prog(id);
      ol.appendChild(h('li', { class: 'trail__i' + (p.best >= 0.999 ? ' is-done' : p.seen ? ' is-seen' : '') + (id === firstUndone ? ' is-next' : ''), html:
        '<a href="#/part/' + id + '"><span class="trail__n">' + (k + 1) + '</span><span class="trail__t"><b>' + esc(s.title) + (s.levels.indexOf('g') < 0 ? ' ' + ibTag(s.levels) : '') + '</b><span>' + md(WUL.pick(s.job, L), { inline: true }) + '</span></span>' + tick(id) + '</a>' }));
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
