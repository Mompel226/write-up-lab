/* ============================================================
   quiz.js — "Test yourself" and the flashcards.

   WUL.quiz(host, questions, {id, next, onDone, onAnswer, all})
   next() returns the "next part" link node; onDone(got, total) is called at the end.
   onAnswer(q, letter) (3 Oct 2026, homework): 't' after a wrong check; when the question is finished,
   'f' right at the first check, '1' right later, 's' answer shown. all: draw every question given,
   whatever the level (the homework set holds IGCSE and IB questions together; IB ones are tagged).
   One question at a time. Nothing asks for free writing, so every
   answer is marked by the page.

   Question types (all may carry lv:'gie', and an optional visual
   {table}|{plot}|markup under "show"):
     choose  {q, opts:[{t, ok, why}]}                      one right answer
     multi   {q, opts:[{t, ok, why}]}                      tick every right one
     sort    {q, bins:['A','B'], items:[{t, bin, why}]}    put each into its group
     order   {q, items:['first','second',…], why}          put in order (given in the right order)
     spot    {q, text:'… [!a:wrong] … [?:fine] …', why:{a:'…'}}   tap every mistake
     build   {q, chips:[…], answer:[…] | answers:[[…]…], why}      assemble from chips

   Marking follows the estate's rule for whole answers (sort, order,
   spot, build): right or not right, and the student's arrangement is
   kept as they left it. After three tries "Show me" appears.

   Accommodation (Daniel, 8 Oct 2026): a pupil the teacher gave it (writeup.mine says acc; account.js keeps it in
   WUL.hw.acc) sees, after their SECOND wrong check of a question, why their own choices are wrong: the options they
   ticked that are wrong (multi), the items in a wrong group (sort), the phrases they marked that are fine (spot), or the
   question's why (order, build). Never after the first wrong check, never for anyone else. choose explains every
   choice already, for everyone.

   Redo (Daniel, 8 Oct 2026): the end of a test offers "Redo the N you missed": the questions not right at the first
   check, again, as practice (opts.practice): nothing is recorded, nothing is sent.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var SHOW_AFTER = 3, HELP_AFTER = 2;
  function helpOn() { return !!(WUL.hw && WUL.hw.acc); }
  function helpBox(html) { return html ? '<div class="helpbox"><p class="helpbox__h">Why</p>' + html + '</div>' : ''; }

  function recordScore(id, got, total) {
    if (!id) return;
    var p = WUL.store.get('prog', {}); var r = p[id] || {};
    r.best = Math.max(r.best || 0, got / total); r.tries = (r.tries || 0) + 1; r.last = Date.now();
    p[id] = r; WUL.store.set('prog', p);
  }

  WUL.quiz = function (host, questions, opts) {
    opts = opts || {};
    var L = WUL.level();
    var Q = opts.all || opts.practice ? questions.slice() : questions.filter(function (q) { return WUL.shows(q.lv, L); });
    host.innerHTML = '';
    if (!Q.length) { host.appendChild(h('p', { class: 'muted', text: 'No questions at this level yet.' })); return; }
    var box = h('div', { class: 'quiz' });
    var top = h('div', { class: 'quiz__top' });
    var prog = h('div', { class: 'quiz__prog', 'aria-hidden': 'true' });
    var num = h('div', { class: 'quiz__num' });
    top.appendChild(num); top.appendChild(prog);
    if (opts.practice) top.appendChild(h('div', { class: 'quiz__practice', text: 'Redo · practice: your record does not change' }));
    var card = h('div', { class: 'quiz__card' });
    box.appendChild(top); box.appendChild(card);
    host.appendChild(box);
    var i = 0, firstTry = [], order = Q.map(function (q, k) { return k; });
    Q.forEach(function () { prog.appendChild(h('i')); });

    function paintProg() {
      num.textContent = i < Q.length ? 'Question ' + (i + 1) + ' of ' + Q.length : 'Done';
      prog.querySelectorAll('i').forEach(function (d, k) {
        d.className = k < i ? (firstTry[k] ? 'ok' : 'no') : (k === i ? 'on' : '');
      });
    }
    function nextBtn() {
      var b = h('button', { type: 'button', class: 'btn btn--go', text: i === Q.length - 1 ? 'See my score →' : 'Next question →' });
      b.addEventListener('click', function () { i++; draw(); });
      return b;
    }
    function feedback(ok, html) {
      return h('div', { class: 'fb ' + (ok ? 'fb--ok' : 'fb--no'), role: 'status', html: '<span class="fb__k">' + (ok ? '✔ Right' : '✘ Not yet') + '</span> ' + (html || '') });
    }

    function draw() {
      paintProg();
      card.innerHTML = '';
      if (i >= Q.length) return finish();
      var q = Q[order[i]], tries = 0;
      var kind = q.type || 'choose';
      var kindEl = h('div', { class: 'quiz__kind', text: ({ choose: 'Choose one', multi: 'Tick every correct answer', sort: 'Sort into groups', order: 'Put in order', spot: 'Tap every mistake', build: 'Build it' })[kind] || '' });
      if (opts.all && q.lv && q.lv.indexOf('g') < 0 && WUL.ibTag) kindEl.insertAdjacentHTML('beforeend', ' ' + WUL.ibTag(q.lv));
      card.appendChild(kindEl);
      card.appendChild(h('div', { class: 'quiz__q', html: md(q.q, { inline: true }) }));
      if (q.show) card.appendChild(h('div', { class: 'quiz__show sheet sheet--vis', html: WUL.visual(q.show) }));
      var area = h('div', { class: 'quiz__area' }), foot = h('div', { class: 'quiz__foot' }), fbHost = h('div', { class: 'quiz__fb', 'aria-live': 'polite' });
      card.appendChild(area); card.appendChild(fbHost); card.appendChild(foot);
      var done = false, shown = false;
      function tell(letter) { if (opts.onAnswer && !opts.practice) { try { opts.onAnswer(q, letter); } catch (e) {} } }
      /* the accommodation's help: only after the SECOND wrong check, only for pupils the teacher gave it. A wrong check counts
         as a try only when the answer differs from the last wrong one (the audit, 8 Oct 2026: two presses of Check, with
         nothing changed, reached the help) */
      var helpTries = 0, lastWrong = null;
      function wrongTry(sig) { if (sig !== lastWrong) { helpTries++; lastWrong = sig; } }
      function help(html) { return !helpOn() || helpTries < HELP_AFTER ? '' : helpBox(html); }
      function settle(ok) { if (firstTry[i] == null) firstTry[i] = ok && tries <= 1; if (!ok) tell('t'); }
      function finishQ() { done = true; foot.innerHTML = ''; foot.appendChild(nextBtn()); paintProg(); tell(shown ? 's' : firstTry[i] ? 'f' : '1'); }
      var empties = 0;      /* Checks with nothing ticked, marked or placed: they count towards "Show me" (as they always did), never
                               as an answer, so they cost no "right first time" and send no homework letter (the verification audit) */
      function showMe(fn) {
        if (tries + empties < SHOW_AFTER || done || foot.querySelector('.btn--show')) return;
        var b = h('button', { type: 'button', class: 'btn btn--ghost btn--show', text: 'Show me the answer' });
        b.addEventListener('click', function () { firstTry[i] = false; shown = true; fn(); finishQ(); });
        foot.appendChild(b);
      }

      if (kind === 'choose' || kind === 'multi') {
        var opts2 = q.keep ? q.opts.slice() : WUL.shuffle(q.opts);
        var list = h('div', { class: 'opts' });
        opts2.forEach(function (o) {
          var b = h('button', { type: 'button', class: 'opt', 'aria-pressed': 'false', html: '<span class="opt__box" aria-hidden="true"></span><span class="opt__t">' + md(o.t, { inline: true }) + '</span>' });
          b._o = o;
          list.appendChild(b);
        });
        area.appendChild(list);
        if (kind === 'choose') {
          list.addEventListener('click', function (e) {
            var b = e.target.closest('.opt'); if (!b || done || b.disabled) return;
            tries++;
            var ok = !!b._o.ok;
            b.classList.add(ok ? 'is-ok' : 'is-no'); b.disabled = !ok || true;
            fbHost.innerHTML = ''; fbHost.appendChild(feedback(ok, md(b._o.why || '', { inline: true })));
            settle(ok);
            if (ok) { list.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; }); finishQ(); }
          });
        } else {
          list.addEventListener('click', function (e) {
            var b = e.target.closest('.opt'); if (!b || done) return;
            b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
            list.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('is-ok', 'is-no'); });
          });
          var chk = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
          chk.addEventListener('click', function () {
            if (done) return;
            var picked = [];
            list.querySelectorAll('.opt').forEach(function (x, k) { if (x.getAttribute('aria-pressed') === 'true') picked.push(k); });
            if (!picked.length) {                               /* no answer yet: said plainly, a step towards "Show me", nothing more */
              empties++; fbHost.innerHTML = ''; fbHost.appendChild(feedback(false, 'Tick at least one answer first.'));
              showMe(function () {
                list.querySelectorAll('.opt').forEach(function (x) {
                  x.setAttribute('aria-pressed', x._o.ok ? 'true' : 'false'); x.classList.add(x._o.ok ? 'is-ok' : 'is-dim'); x.disabled = true;
                  if (x._o.why) x.appendChild(h('span', { class: 'opt__why', html: md(x._o.why, { inline: true }) }));
                });
                fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
              });
              return;
            }
            tries++;
            var ok = true;
            list.querySelectorAll('.opt').forEach(function (x) { if ((x.getAttribute('aria-pressed') === 'true') !== !!x._o.ok) ok = false; });
            settle(ok);
            fbHost.innerHTML = '';
            if (ok) {
              list.querySelectorAll('.opt').forEach(function (x) {
                x.classList.add(x._o.ok ? 'is-ok' : 'is-dim'); x.disabled = true;
                if (x._o.why) x.appendChild(h('span', { class: 'opt__why', html: md(x._o.why, { inline: true }) }));
              });
              fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
              finishQ();
            } else {
              wrongTry(picked.join(','));
              var wrongTicks = [];
              list.querySelectorAll('.opt').forEach(function (x) { if (x.getAttribute('aria-pressed') === 'true' && !x._o.ok && x._o.why) wrongTicks.push('<b>' + md(x._o.t, { inline: true }) + '</b> — ' + md(x._o.why, { inline: true })); });
              fbHost.appendChild(feedback(false, 'Your choices are kept as you left them. Look again: ' + (q.hint ? md(q.hint, { inline: true }) : 'which statements are always true?') +
                help(wrongTicks.length ? wrongTicks.join('<br>') : 'Every option you ticked is right: at least one more right answer is not ticked yet.')));
            }
            if (!ok) {
              showMe(function () {
                list.querySelectorAll('.opt').forEach(function (x) {
                  x.setAttribute('aria-pressed', x._o.ok ? 'true' : 'false'); x.classList.add(x._o.ok ? 'is-ok' : 'is-dim'); x.disabled = true;
                  if (x._o.why) x.appendChild(h('span', { class: 'opt__why', html: md(x._o.why, { inline: true }) }));
                });
                fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
              });
            }
          });
          foot.appendChild(chk);
        }
      }

      else if (kind === 'sort') {
        var pool = h('div', { class: 'chips chips--pool', 'aria-label': 'Items to sort' });
        var bins = h('div', { class: 'bins' });
        var sel = null;
        var items = WUL.shuffle(q.items.map(function (it, k) { return Object.assign({ _k: k }, it); }));
        items.forEach(function (it) {
          var c = h('button', { type: 'button', class: 'chip', html: md(it.t, { inline: true }) }); c._it = it; pool.appendChild(c);
        });
        q.bins.forEach(function (bn, bi) {
          var b = h('div', { class: 'bin', 'data-bin': bi, tabindex: '0', role: 'button', 'aria-label': 'Put the chosen item in: ' + bn });
          b.appendChild(h('div', { class: 'bin__h', text: bn }));
          b.appendChild(h('div', { class: 'bin__body chips' }));
          bins.appendChild(b);
        });
        area.appendChild(h('p', { class: 'hint', text: 'Tap an item, then tap the group it belongs to.' }));
        area.appendChild(pool); area.appendChild(bins);
        function place(chip, target) { target.appendChild(chip); chip.classList.remove('is-sel'); sel = null; clearMarks(); }
        function clearMarks() { area.querySelectorAll('.bin').forEach(function (b) { b.classList.remove('is-ok', 'is-no'); }); fbHost.innerHTML = ''; }
        area.addEventListener('click', function (e) {
          if (done) return;
          var chip = e.target.closest('.chip');
          if (chip) {
            if (sel === chip) { chip.classList.remove('is-sel'); sel = null; return; }
            if (sel) sel.classList.remove('is-sel');
            /* a chip already in a bin goes back to the pool when tapped twice */
            sel = chip; chip.classList.add('is-sel'); return;
          }
          var bin = e.target.closest('.bin');
          if (bin && sel) { place(sel, bin.querySelector('.bin__body')); return; }
          if (e.target.closest('.chips--pool') && sel) place(sel, pool);
        });
        area.addEventListener('keydown', function (e) {
          if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('bin') && sel) { e.preventDefault(); place(sel, e.target.querySelector('.bin__body')); }
        });
        var chk2 = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
        chk2.addEventListener('click', function () {
          if (done) return;
          if (pool.querySelector('.chip')) { fbHost.innerHTML = ''; fbHost.appendChild(feedback(false, 'Put every item in a group first.')); return; }
          tries++;
          var ok = true;
          area.querySelectorAll('.bin').forEach(function (b) {
            var bi = +b.getAttribute('data-bin');
            b.querySelectorAll('.chip').forEach(function (c) { if (c._it.bin !== bi) ok = false; });
          });
          settle(ok);
          fbHost.innerHTML = '';
          if (ok) { reveal(); fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : '')); finishQ(); }
          else {
            wrongTry(Array.prototype.map.call(area.querySelectorAll('.bin'), function (b) { return Array.prototype.map.call(b.querySelectorAll('.chip'), function (c) { return c._it._k; }).sort().join('.'); }).join('|'));
            var misplaced = [];
            area.querySelectorAll('.bin').forEach(function (b) { var bi = +b.getAttribute('data-bin');
              b.querySelectorAll('.chip').forEach(function (c) { if (c._it.bin !== bi && c._it.why) misplaced.push('<b>' + md(c._it.t, { inline: true }) + '</b> — ' + md(c._it.why, { inline: true })); }); });
            fbHost.appendChild(feedback(false, 'Your answer is kept as you left it. At least one item is in the wrong group.' + (q.hint ? ' ' + md(q.hint, { inline: true }) : '') + help(misplaced.join('<br>')))); showMe(function () { solve(); reveal(); fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : '')); }); }
        });
        function solve() {
          area.querySelectorAll('.chip').forEach(function (c) { area.querySelector('.bin[data-bin="' + c._it.bin + '"] .bin__body').appendChild(c); });
        }
        function reveal() {
          area.querySelectorAll('.chip').forEach(function (c) {
            c.disabled = true; c.classList.add('is-ok');
            if (c._it.why) c.appendChild(h('span', { class: 'chip__why', html: md(c._it.why, { inline: true }) }));
          });
        }
        foot.appendChild(chk2);
      }

      else if (kind === 'order') {
        var ol = h('ol', { class: 'ordl' });
        var its = q.items.map(function (t, k) { return { t: t, k: k }; });
        var sh = WUL.shuffle(its); var guard = 0;
        while (sh.every(function (x, k) { return x.k === k; }) && guard++ < 10) sh = WUL.shuffle(its);
        sh.forEach(function (it) {
          var li = h('li', { class: 'ordl__i' });
          li._it = it;
          li.appendChild(h('span', { class: 'ordl__t', html: md(it.t, { inline: true }) }));
          var up = h('button', { type: 'button', class: 'ordl__b', 'aria-label': 'Move up', text: '▲' });
          var dn = h('button', { type: 'button', class: 'ordl__b', 'aria-label': 'Move down', text: '▼' });
          li.appendChild(h('span', { class: 'ordl__ctl' }, [up, dn]));
          ol.appendChild(li);
        });
        ol.addEventListener('click', function (e) {
          if (done) return;
          var b = e.target.closest('.ordl__b'); if (!b) return;
          var li = b.closest('li');
          if (b.textContent === '▲' && li.previousElementSibling) ol.insertBefore(li, li.previousElementSibling);
          else if (b.textContent === '▼' && li.nextElementSibling) ol.insertBefore(li.nextElementSibling, li);
          fbHost.innerHTML = ''; ol.classList.remove('is-no');
          b.focus();
        });
        area.appendChild(h('p', { class: 'hint', text: 'Use the arrows to move each line up or down.' }));
        area.appendChild(ol);
        var chk3 = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
        chk3.addEventListener('click', function () {
          if (done) return; tries++;
          var ok = Array.prototype.every.call(ol.children, function (li, k) { return li._it.k === k; });
          settle(ok); fbHost.innerHTML = '';
          if (ok) { ol.classList.add('is-ok'); ol.querySelectorAll('button').forEach(function (x) { x.disabled = true; }); fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : '')); finishQ(); }
          else {
            wrongTry(Array.prototype.map.call(ol.children, function (li) { return li._it.k; }).join(','));
            ol.classList.add('is-no');
            fbHost.appendChild(feedback(false, 'Your order is kept as you left it. Something is still out of place.' + (q.hint ? ' ' + md(q.hint, { inline: true }) : '') + help(q.why ? md(q.why, { inline: true }) : '')));
            showMe(function () {
              var lis = Array.prototype.slice.call(ol.children).sort(function (a, b) { return a._it.k - b._it.k; });
              lis.forEach(function (li) { ol.appendChild(li); }); ol.classList.remove('is-no'); ol.classList.add('is-ok');
              ol.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
              fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
            });
          }
        });
        foot.appendChild(chk3);
      }

      else if (kind === 'spot') {
        var txt = h('div', { class: 'spot sheet', html: md(q.text, { block: true }) });
        area.appendChild(h('p', { class: 'hint', text: 'Tap each phrase that would lose a mark. Tap again to undo.' }));
        area.appendChild(txt);
        var targets = txt.querySelectorAll('.rpm');
        var nErr = 0; targets.forEach(function (t) { if (t.getAttribute('data-k')) nErr++; });
        txt.addEventListener('click', function (e) {
          var t = e.target.closest('.rpm'); if (!t || done) return;
          t.classList.toggle('is-picked'); fbHost.innerHTML = '';
        });
        var chk4 = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
        function revealSpot() {
          targets.forEach(function (t) {
            var k = t.getAttribute('data-k');
            t.disabled = true;
            if (k) { t.classList.add('is-found'); t.classList.remove('is-picked'); }
            else t.classList.add('is-fine');
          });
          var ul = h('ul', { class: 'spot__why' });
          Object.keys(q.why || {}).forEach(function (k) {
            var src = txt.querySelector('.rpm[data-k="' + k + '"]');
            ul.appendChild(h('li', { html: '<b>' + (src ? esc(src.textContent) : k) + '</b> — ' + md(q.why[k], { inline: true }) }));
          });
          return ul;
        }
        chk4.addEventListener('click', function () {
          if (done) return;
          if (!txt.querySelector('.rpm.is-picked')) {        /* no answer yet: said plainly, a step towards "Show me", nothing more */
            empties++; fbHost.innerHTML = ''; fbHost.appendChild(feedback(false, 'Tap at least one phrase first.'));
            showMe(function () { var ul = revealSpot(); fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, 'Here they are.')); fbHost.appendChild(ul); });
            return;
          }
          tries++;
          var right = 0, wrongPicks = 0;
          targets.forEach(function (t) {
            var picked = t.classList.contains('is-picked'), err = !!t.getAttribute('data-k');
            if (picked && err) right++; if (picked && !err) wrongPicks++;
          });
          var ok = right === nErr && wrongPicks === 0;
          settle(ok); fbHost.innerHTML = '';
          if (ok) { var ul = revealSpot(); fbHost.appendChild(feedback(true, 'All ' + nErr + ' found.')); fbHost.appendChild(ul); finishQ(); }
          else {
            wrongTry(Array.prototype.map.call(targets, function (t, k) { return t.classList.contains('is-picked') ? k : ''; }).join(','));
            var fine = []; targets.forEach(function (t) { if (t.classList.contains('is-picked') && !t.getAttribute('data-k')) fine.push('“' + esc(t.textContent) + '” is fine as it is: it loses no mark.'); });
            fbHost.appendChild(feedback(false, 'You found ' + right + ' of ' + nErr + (wrongPicks ? ', and marked ' + wrongPicks + ' that ' + (wrongPicks === 1 ? 'is' : 'are') + ' fine' : '') + '. Your choices are kept.' +
              help(fine.length ? fine.join('<br>') : 'Every phrase you marked loses a mark. ' + (nErr - right) + ' more ' + (nErr - right === 1 ? 'is' : 'are') + ' still unmarked.')));
            showMe(function () { var ul = revealSpot(); fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, 'Here they are.')); fbHost.appendChild(ul); });
          }
        });
        foot.appendChild(chk4);
      }

      else if (kind === 'build') {
        var line = h('div', { class: 'buildl', 'aria-label': 'Your answer' });
        var pool2 = h('div', { class: 'chips chips--pool' });
        WUL.shuffle(q.chips).forEach(function (t) { pool2.appendChild(h('button', { type: 'button', class: 'chip', 'data-t': t, html: md(t, { inline: true }) })); });
        area.appendChild(h('p', { class: 'hint', text: 'Tap the pieces in order. Tap a piece in your answer to send it back.' }));
        area.appendChild(line); area.appendChild(pool2);
        area.addEventListener('click', function (e) {
          if (done) return;
          var c = e.target.closest('.chip'); if (!c) return;
          if (c.parentNode === pool2) line.appendChild(c); else pool2.appendChild(c);
          fbHost.innerHTML = ''; line.classList.remove('is-no');
        });
        var chk5 = h('button', { type: 'button', class: 'btn btn--go', text: 'Check' });
        chk5.addEventListener('click', function () {
          if (done) return;
          var got = Array.prototype.map.call(line.children, function (c) { return c.getAttribute('data-t'); });
          var answers = q.answers || [q.answer];
          if (!got.length) {                                   /* no answer yet: said plainly, a step towards "Show me", nothing more */
            empties++; fbHost.innerHTML = ''; fbHost.appendChild(feedback(false, 'Tap the pieces in order first.'));
            showMe(function () {
              pool2.innerHTML = ''; line.innerHTML = '';
              (answers[0]).forEach(function (t) { line.appendChild(h('span', { class: 'chip is-ok', html: md(t, { inline: true }) })); });
              line.classList.remove('is-no'); line.classList.add('is-ok');
              fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
            });
            return;
          }
          tries++;
          var ok = answers.some(function (a) { return a.length === got.length && a.every(function (x, k) { return x === got[k]; }); });
          settle(ok); fbHost.innerHTML = '';
          if (ok) { line.classList.add('is-ok'); fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : '')); finishQ(); }
          else {
            wrongTry(got.join('|'));
            line.classList.add('is-no');
            fbHost.appendChild(feedback(false, 'Your answer is kept. Not quite.' + (q.hint ? ' ' + md(q.hint, { inline: true }) : '') + help(q.why ? md(q.why, { inline: true }) : '')));
            showMe(function () {
              pool2.innerHTML = ''; line.innerHTML = '';
              (answers[0]).forEach(function (t) { line.appendChild(h('span', { class: 'chip is-ok', html: md(t, { inline: true }) })); });
              line.classList.remove('is-no'); line.classList.add('is-ok');
              fbHost.innerHTML = ''; fbHost.appendChild(feedback(true, q.why ? md(q.why, { inline: true }) : ''));
            });
          }
        });
        foot.appendChild(chk5);
      }
    }

    function finish() {
      var got = firstTry.filter(Boolean).length;
      var missed = [];
      for (var k = 0; k < Q.length; k++) if (!firstTry[k]) missed.push(Q[order[k]]);
      if (!opts.practice) recordScore(opts.id, got, Q.length);
      var pct = got / Q.length;
      var msg = opts.practice ? (missed.length ? 'Read the why of each one you missed, then redo them again.' : 'Every one right first time this time.')
        : pct === 1 ? 'Every one right first time.' : pct >= 0.7 ? 'Good. Look again at the ones you missed.' : 'Read the red pen again, then try again.';
      card.innerHTML = '';
      card.appendChild(h('div', { class: 'quiz__end', html: '<div class="quiz__score"><b>' + got + '</b><span>/ ' + Q.length + '</span></div><div class="quiz__endt">right first time' + (opts.practice ? ' in this redo' : '') + '</div><p>' + esc(msg) + '</p>' }));
      var row = h('div', { class: 'quiz__foot' });
      if (missed.length) {
        var rd = h('button', { type: 'button', class: 'btn btn--go', text: 'Redo the ' + missed.length + ' you missed' + (opts.practice ? ' again' : '') });
        rd.addEventListener('click', function () { WUL.withLevel(L, function () { WUL.quiz(host, missed, { practice: true, all: opts.all, back: opts.back || { q: questions, o: opts, l: L } }); }); });
        row.appendChild(rd);
      }
      if (opts.practice) {
        var bk = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Back to all the questions' });
        bk.addEventListener('click', function () { var b = opts.back; if (b) WUL.withLevel(b.l || L, function () { WUL.quiz(host, b.q, b.o); }); });
        row.appendChild(bk);
      } else {
        var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Try again ↺' });
        again.addEventListener('click', function () { i = 0; firstTry = []; order = WUL.shuffle(order); draw(); });
        row.appendChild(again);
        if (opts.next) row.appendChild(opts.next());
      }
      card.appendChild(row);
      if (missed.length && !opts.practice) card.appendChild(h('p', { class: 'muted', text: 'Redo: practise again the questions you did not get right the first time. A redo does not change your record.' }));
      if (opts.onDone && !opts.practice) opts.onDone(got, Q.length);
    }
    draw();
  };

  /* ---------- flashcards ---------- */
  WUL.cards = function (host, words, opts) {
    host.innerHTML = '';
    var L = WUL.level();
    var list = (opts && opts.all) ? words.slice() : words.filter(function (w) { return WUL.shows(w.lv, L); });
    if (!list.length) return;
    var grid = h('div', { class: 'cards' });
    list.forEach(function (w) {
      var c = h('button', { type: 'button', class: 'card', 'aria-pressed': 'false' });
      c.innerHTML = '<span class="card__in"><span class="card__f"><span class="card__k">Keyword</span><span class="card__term">' + esc(w.term) + '</span><span class="card__hint">Tap to see its meaning</span></span>' +
        '<span class="card__b"><span class="card__term card__term--sm">' + esc(w.term) + '</span><span class="card__def">' + md(w.def, { inline: true }) + '</span>' +
        (w.eg ? '<span class="card__eg">' + md(w.eg, { inline: true }) + '</span>' : '') + '</span></span>';
      c.addEventListener('click', function (e) {
        if (e.target.closest('.kw')) return;
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
      grid.appendChild(c);
    });
    host.appendChild(grid);
  };
})(window.WUL);
