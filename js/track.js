/* ============================================================
   track.js — what a pupil has done in each part, and the list of parts the teacher's
   spreadsheet scores homework against (data/parts.json, written by tools/check.mjs --stamp
   from WUL.partsManifest() below, so the page and the spreadsheet count the same things).

   Daniel, 3 Oct 2026: homework is whole parts. A part is FINISHED when every red pen in it is
   done (every version it has: IGCSE, IB IA, IB EE) and every question in it is answered, IB ones
   too ("even if they're IGCSE students, it's important for them to understand what they need to
   do at IB level"). Learn steps, Mistakes to avoid and Go further are kept and shown to the
   teacher, but a part does not need them to finish. Keyword cards are NOT kept ("swapping the
   cards might be very misguiding": a pupil who knows a word does not turn its card). No time is
   measured anywhere (his rule for ⏱️ Homework habits).

   One record per part, WUL.store('rec')[partId]:
     v   the part's fingerprint (its questions and its red-pen marks: WUL.partV). A part whose
         questions or marks were rewritten since starts again, here and in the spreadsheet.
     l   Learn steps opened: one letter per step, '1' opened, '0' not
     r   { g: '10110', i: … }: red-pen mistakes found, one letter per mark, in the order of that
         red pen's notes
     m   1 once Mistakes to avoid has been opened
     q   one letter per question of the part, in its test order: 0 untouched, t tried, s answer
         shown, 1 right, f right at the first attempt (only ever the FIRST attempt at that
         question: a second go can make it 1, never f)
     f   Go further panels opened: one letter per panel
   Nothing here touches the page, so tools/check.mjs can load it.
   ============================================================ */
(function (WUL) {
  'use strict';

  var RANK = { '0': 0, 't': 1, 's': 2, '1': 3, 'f': 4 };
  var DONE = { 's': 1, '1': 1, 'f': 1 };

  /* FNV-1a, 32 bits, written out in base 36: the same answer in every browser and in node */
  function fnv(s) {
    var x = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(36);
  }
  /* What a question IS: its prompt and its options, items, groups, text or chips, and which are
     right. Never its explanations: a better `why` must not make a pupil start a part again. */
  function qText(q) {
    var p = [q.type || 'choose', q.q || ''];
    (q.opts || []).forEach(function (o) { p.push((o.ok ? '*' : '') + o.t); });
    (q.bins || []).forEach(function (b) { p.push('#' + b); });
    (q.items || []).forEach(function (it) { p.push(typeof it === 'string' ? it : (it.t + '>' + it.bin)); });
    if (q.text) p.push(q.text);
    (q.chips || []).forEach(function (c) { p.push('~' + c); });
    (q.answers || (q.answer ? [q.answer] : [])).forEach(function (a) { p.push('=' + a.join('|')); });
    return p.join(' || ');
  }

  /* The red pens a part has, as its page shows them: one per level that has its own, else one. */
  WUL.redpensOf = function (s) {
    if (!s || !s.redpen) return [];
    var levels = ['g', 'i', 'e'].filter(function (l) { return s.levels.indexOf(l) >= 0; });
    var per = ('g' in s.redpen) || ('i' in s.redpen) || ('e' in s.redpen);
    var ls = per ? levels.filter(function (l) { return s.redpen[l]; }) : [s.levels.charAt(0)];
    return ls.map(function (l) {
      var rp = per ? s.redpen[l] : s.redpen;
      return { l: l, rp: rp, keys: Object.keys((rp && rp.notes) || {}) };
    });
  };
  /* The Learn steps, counted as the part page draws them: every build block, then the sentence
     starters when the part has some at its first level. */
  WUL.learnCount = function (s) {
    var fr = WUL.pick(s.frames, s.levels.charAt(0));
    return (s.build || []).length + (fr && fr.length ? 1 : 0);
  };
  WUL.partV = function (s) {
    var t = (s.test || []).map(qText).join(' ## ');
    var r = WUL.redpensOf(s).map(function (x) { return x.l + ':' + x.keys.join(','); }).join(' ## ');
    var v = fnv(s.id + ' @@ ' + t + ' @@ ' + r);
    /* `keepV` (7 Oct 2026, the practice-questions audit): a part whose options were reworded WITHOUT changing what any
       question asks keeps the fingerprint its records were saved under, here and in the spreadsheet (Daniel: the options
       were rewritten so that the right one is no longer the longest, and the work pupils had done was not to be lost).
       keepV = { v: the old fingerprint, now: the fingerprint of the wording it was declared for }. It holds only while the
       part reads exactly as declared: reword it again and it starts again, as any rewritten part does. Written by
       tools/keep-records.mjs after it has checked that only the options' words changed, never by hand. (Not `keep`: on a
       question, `keep` already means "keep these options in their order".) */
    var kp = s.keepV;
    return kp && kp.now === v && typeof kp.v === 'string' ? kp.v : v;
  };
  /* What finishing a part takes: every red-pen mark of every version, and every question. */
  WUL.partUnits = function (s) {
    return WUL.redpensOf(s).reduce(function (a, x) { return a + x.keys.length; }, 0) + (s.test || []).length;
  };

  /* The parts in the order of the report (the home page's "All the parts"), for data/parts.json. */
  WUL.partsInOrder = function () {
    var out = [];
    WUL.STAGES.forEach(function (g) {
      WUL.stationOrder.map(function (id) { return WUL.stations[id]; })
        .filter(function (s) { return s.stage === g.id; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
        .forEach(function (s) { out.push(s); });
    });
    return out;
  };
  WUL.partsManifest = function () {
    return {
      v: 1,
      stages: WUL.STAGES.map(function (g) { return { id: g.id, name: g.name }; }),
      parts: WUL.partsInOrder().map(function (s) {
        return {
          id: s.id, title: s.title, stage: s.stage, levels: s.levels, v: WUL.partV(s),
          steps: WUL.learnCount(s),
          redpens: WUL.redpensOf(s).map(function (x) { return { l: x.l, n: x.keys.length }; }),
          questions: (s.test || []).length,
          further: (s.further || []).length,
          units: WUL.partUnits(s)
        };
      })
    };
  };

  /* ---------- the records ---------- */
  function pad(str, n) { str = String(str || '').slice(0, n); while (str.length < n) str += '0'; return str; }
  function blank(s) {
    var r = {};
    WUL.redpensOf(s).forEach(function (x) { r[x.l] = pad('', x.keys.length); });
    return { v: WUL.partV(s), l: pad('', WUL.learnCount(s)), r: r, m: 0, q: pad('', (s.test || []).length), f: pad('', (s.further || []).length) };
  }
  /* Bring a stored record into the part's present shape. A part rewritten since starts again. */
  function fit(s, x) {
    var b = blank(s);
    if (!x || x.v !== b.v) return b;
    b.l = pad(String(x.l || '').replace(/[^01]/g, '0'), b.l.length);
    Object.keys(b.r).forEach(function (l) { b.r[l] = pad(String((x.r || {})[l] || '').replace(/[^01]/g, '0'), b.r[l].length); });
    b.m = x.m ? 1 : 0;
    b.q = pad(String(x.q || '').replace(/[^0tsf1]/g, '0'), b.q.length);
    b.f = pad(String(x.f || '').replace(/[^01]/g, '0'), b.f.length);
    return b;
  }
  WUL.rec = function (id) {
    var s = WUL.stations[id]; if (!s) return null;
    return fit(s, (WUL.store.get('rec', {}) || {})[id]);
  };
  WUL.allRecs = function () { return WUL.store.get('rec', {}) || {}; };
  function put(id, x) {
    var all = WUL.store.get('rec', {}) || {};
    all[id] = x;
    WUL.store.set('rec', all);
    (WUL.recordHooks || []).forEach(function (fn) { try { fn(id); } catch (e) {} });   /* saving (account.js) and the page */
  }
  /* WUL.onRecord(fn): fn(partId) after every change to a record */
  WUL.onRecord = function (fn) { (WUL.recordHooks = WUL.recordHooks || []).push(fn); };
  function setAt(str, k, c) { return str.slice(0, k) + c + str.slice(k + 1); }
  function better(a, b) { return (RANK[b] || 0) > (RANK[a] || 0) ? b : a; }
  /* letter by letter, the better of two: the merge for every record kept here */
  WUL.mergeLetters = function (a, b) {
    a = String(a || ''); b = String(b || '');
    var out = '';
    for (var i = 0; i < Math.max(a.length, b.length); i++) out += better(a.charAt(i) || '0', b.charAt(i) || '0');
    return out;
  };

  WUL.track = {
    step: function (id, k) {
      var x = WUL.rec(id); if (!x || k < 0 || k >= x.l.length || x.l.charAt(k) === '1') return;
      x.l = setAt(x.l, k, '1'); put(id, x);
    },
    redpen: function (id, l, key) {
      var s = WUL.stations[id], x = WUL.rec(id); if (!x || !(l in x.r)) return;
      var rp = WUL.redpensOf(s).filter(function (y) { return y.l === l; })[0];
      var k = rp ? rp.keys.indexOf(key) : -1;
      if (k < 0 || x.r[l].charAt(k) === '1') return;
      x.r[l] = setAt(x.r[l], k, '1'); put(id, x);
    },
    traps: function (id) { var x = WUL.rec(id); if (!x || x.m) return; x.m = 1; put(id, x); },
    further: function (id, k) {
      var x = WUL.rec(id); if (!x || k < 0 || k >= x.f.length || x.f.charAt(k) === '1') return;
      x.f = setAt(x.f, k, '1'); put(id, x);
    },
    /* q: the question object itself (from the part's test). letter: 't' after a wrong check; on
       finishing, 'f' (right at the first check), '1' (right later) or 's' (answer shown). A question
       answered before keeps its first-time letter: a later go can raise it to 1, never to f. */
    answer: function (id, q, letter) {
      var s = WUL.stations[id], x = WUL.rec(id); if (!x || !s) return;
      var k = (s.test || []).indexOf(q); if (k < 0) return;
      var cur = x.q.charAt(k) || '0', next = letter;
      if (letter === 'f' && cur !== '0') next = '1';
      next = better(cur, next);
      if (next === cur) return;
      x.q = setAt(x.q, k, next); put(id, x);
    }
  };

  /* Where a part stands, by the homework rule. found/marks per red pen; answered/first/total for
     the questions. state: none · partly · done (the labs' colours: red · orange · green). */
  WUL.partState = function (id) {
    var s = WUL.stations[id], x = WUL.rec(id); if (!s || !x) return null;
    var count = function (str, set) { var n = 0; for (var i = 0; i < str.length; i++) if (set[str.charAt(i)]) n++; return n; };
    var one = { '1': 1 };
    var rps = WUL.redpensOf(s).map(function (y) { return { l: y.l, found: count(x.r[y.l] || '', one), marks: y.keys.length }; });
    var answered = count(x.q, DONE), first = count(x.q, { f: 1 }), total = x.q.length;
    var units = WUL.partUnits(s);
    var done = rps.reduce(function (a, y) { return a + y.found; }, 0) + answered;
    /* the spreadsheet's rule (the labs script's _hwScoreOne_): part done as soon as one unit is done */
    return {
      units: units, done: done,
      state: units && done >= units ? 'done' : (done > 0 ? 'partly' : 'none'),
      redpens: rps, answered: answered, first: first, total: total,
      learn: count(x.l, one), steps: x.l.length,
      traps: !!x.m, further: count(x.f, one), panels: x.f.length
    };
  };
  /* the question indexes not yet answered, in test order (the homework question set) */
  WUL.questionsLeft = function (id) {
    var s = WUL.stations[id], x = WUL.rec(id); if (!s || !x) return [];
    return (s.test || []).filter(function (q, k) { return !DONE[x.q.charAt(k)]; });
  };

  /* Fold a record from the teacher's spreadsheet into this browser's (another computer, a cleared
     browser). It only ever adds. Returns true when something new arrived. */
  WUL.foldRecord = function (id, srv) {
    var s = WUL.stations[id]; if (!s || !srv || srv.v !== WUL.partV(s)) return false;
    var here = WUL.rec(id), them = fit(s, srv), out = fit(s, here);
    out.l = WUL.mergeLetters(here.l, them.l);
    Object.keys(out.r).forEach(function (l) { out.r[l] = WUL.mergeLetters(here.r[l], them.r[l]); });
    out.m = here.m || them.m ? 1 : 0;
    out.q = WUL.mergeLetters(here.q, them.q);
    out.f = WUL.mergeLetters(here.f, them.f);
    var changed = JSON.stringify(out) !== JSON.stringify(here);
    if (changed) { var all = WUL.store.get('rec', {}) || {}; all[id] = out; WUL.store.set('rec', all); }
    return changed;
  };
  /* a part with anything in it: what is sent at sign-in */
  WUL.hasWork = function (x) { return !!x && (/1/.test(x.l || '') || /[1tsf]/.test(x.q || '') || /1/.test(x.f || '') || !!x.m || Object.keys(x.r || {}).some(function (l) { return /1/.test(x.r[l]); })); };
})(window.WUL);
