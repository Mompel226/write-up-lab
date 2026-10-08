/* ============================================================
   account.js — signing in, saving each pupil's work for their teacher, and their homework.
   (3 Oct 2026, Daniel: "make sure that when I set homework, this is also something I can set
   and that is tracked in the spreadsheet".)

   The same one Google sign-in as the Biology Hub and every lab (js/signin.js, a copy of
   labs-shared/signin.js made by tools/check.mjs --stamp). Signed out, the site works exactly as
   before: everything stays in this browser. Signed in, what track.js records goes to the labs'
   Apps Script (js/config.js submitUrl, the same /exec as Bio English Lab), which keeps it in the
   "📝 Write-Up Lab" tab of the teacher's spreadsheet, and only for pupils on the class list.

   The labs' cadence (memory labs-save-on-their-own): one save two minutes after the last
   change, at once when the page is left, and at sign-in (the records first come back, then
   whatever this browser holds goes). A save the records could not take goes again a minute later.
   Nothing here measures time.
   ============================================================ */
(function (WUL) {
  'use strict';
  var CFG = window.WUL_CONFIG || {};
  var SI = window.SignIn || null, CID = CFG.googleClientId || '';
  var h = WUL.h, esc = WUL.esc;
  var me = SI ? SI.who() : null;
  var server = null;               /* the last writeup.mine answer */
  WUL.hw = { signedIn: !!me, loaded: false, list: [] };

  /* ---------- a small message at the foot of the screen ---------- */
  var toastEl = null, toastTimer = null;
  function toast(t) {
    if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(toastEl); }
    toastEl.textContent = t; toastEl.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 7000);
  }

  /* ---------- who is signed in (top right) ---------- */
  function syncOn() { return !!(CFG.submitUrl && SI); }
  /* What a call to the records carries: Google's sign-in while it is fresh, and the labs script's own pass (6 Oct 2026,
     js/signin.js), which goes on after Google's hour. Only ever for the pupil signed in here; null when there is neither. */
  function sendCreds() { var c = SI && SI.creds ? SI.creds() : null; return (c && me && c.email === me.email) ? c : null; }
  var syncState = 'idle';          /* idle · saving · saved · failed · stale (the sign-in has expired: nothing can be sent) */
  function syncText() {
    if (!syncOn()) return 'progress kept in this browser';
    if (syncState === 'stale') return 'not sent yet: sign in again';
    /* the records did not answer (the teacher's script not updated yet, or offline): nothing is lost, it waits here */
    if (!server) return syncState === 'failed' ? 'could not reach your teacher’s records: kept in this browser' : 'recording…';
    if (!server.onList) return 'not on a class list yet: kept in this browser';
    if (syncState === 'saving') return 'saving…';
    if (syncState === 'failed') return 'could not save: will try again';
    /* "saved" only when the records have everything done here: work waiting for its save says so (6 Oct 2026) */
    if (Object.keys(pending).length) return 'saving…';
    return syncState === 'saved' ? 'saved for your teacher ✓' : 'saves as you go';
  }
  function syncClass() { return 'who__sync' + (syncState === 'stale' ? ' is-no' : ''); }
  function paintSync() { var el = document.getElementById('syncState'); if (el) { el.textContent = syncText(); el.className = syncClass(); } }
  /* into or out of "stale" draws the card again, because Google's button comes or goes with it */
  function setSync(st) { var flip = (syncState === 'stale') !== (st === 'stale'); syncState = st; if (flip) paintWho(); else paintSync(); }
  /* The sign-in has expired (Google's lasts an hour) and Google would not give a new one without a click. Nothing can be
     sent: the card says so, Google's button stands beside it (paintWho), and a message says it once, because the card is
     small. One press sends everything waiting (SI.on). Until 6 Oct 2026 the card went on saying "saved for your teacher". */
  function spent() {
    if (!me || !syncOn()) return;
    var first = syncState !== 'stale';
    setSync('stale');
    /* the homework page waits for the records: it says why, not "Loading" for ever */
    if (!WUL.hw.loaded && !WUL.hw.spent) { WUL.hw.spent = true; WUL.homeworkChanged(); }
    if (first) toast('Your sign-in has expired, so your teacher does not have your latest work. Sign in again with your school Google account (at the top of the page) and your work is sent. Nothing is lost.');
  }
  function paintWho() {
    var btn = document.getElementById('signinBtn'), card = document.getElementById('whoCard');
    if (!btn || !card) return;
    if (!SI || !CID) { btn.hidden = true; card.hidden = true; return; }
    if (me) {
      card.hidden = false;
      var n = (WUL.hw.list || []).length;
      card.innerHTML = '<span class="who__name">Signed in as <b>' + esc((me.name || me.email || '').split(' ')[0]) + '</b></span>' +
        '<span class="' + syncClass() + '" id="syncState">' + esc(syncText()) + '</span>' +
        (n ? '<a class="who__hw" href="#/hw">Homework (' + n + ')</a>' : '') +
        (server && server.teacher && server.teacherPage ? '<a class="who__t" href="' + esc(server.teacherPage) + '" target="_blank" rel="noopener">Teacher page</a>' : '');
      var out = h('button', { type: 'button', class: 'who__out', text: 'Sign out' });
      out.addEventListener('click', function () {
        /* send what is still waiting while this account's sign-in works: once signed out, it cannot be sent */
        if (Object.keys(pending).length && sendCreds()) flush();
        SI.out();
      });
      card.appendChild(out);
      /* the sign-in has expired and Google would not renew it without a click: its button stands beside the line that
         says so, and one press sends everything waiting (SI.on below; 6 Oct 2026) */
      if (syncState === 'stale') googleButton(btn); else { btn.hidden = true; btn.innerHTML = ''; }
    } else {
      card.hidden = true; googleButton(btn);
    }
  }
  function googleButton(btn) {
    btn.hidden = false; btn.innerHTML = '';
    SI.loaded(function (ok) {
      if (!ok || btn.hidden || (me && syncState !== 'stale')) return;
      /* on a phone, Google's small round button: the full one would push the site's name onto two lines */
      var small = window.matchMedia && matchMedia('(max-width: 560px)').matches;
      SI.button(btn, CID, small ? { type: 'icon', theme: 'outline', size: 'medium', shape: 'circle', locale: 'en-GB' }
                                : { theme: 'outline', size: 'medium', text: 'signin_with', shape: 'pill', locale: 'en-GB' });
    }, 10000);
  }

  /* ---------- a shared computer ----------
     This browser's work belongs to the account it was last saved for. Another account signing in must
     not have it pushed into THEIR record (it is safe in its owner's already), so it leaves this browser
     first. Work done signed out, before anybody signed in here, has no owner yet and goes to the first
     account that signs in (Bio English's rule, 30 Sep 2026). */
  var OWNER_KEY = 'write-up-lab.owner', UNSENT_KEY = 'write-up-lab.unsent';
  function markUnsent(on) { try { if (on) localStorage.setItem(UNSENT_KEY, '1'); else localStorage.removeItem(UNSENT_KEY); } catch (e) {} }
  function unsentHere() { try { return !!localStorage.getItem(UNSENT_KEY); } catch (e) { return true; } }
  function workHere() { var all = WUL.allRecs(); return Object.keys(all).some(function (id) { return WUL.hasWork(all[id]); }); }
  function claimFor(email) {
    var was = '';
    try { was = localStorage.getItem(OWNER_KEY) || ''; } catch (e) {}
    if (was && email && was !== email && workHere()) {
      var unsent = unsentHere() || Object.keys(pending).length > 0;
      WUL.store.set('rec', {}); WUL.store.set('prog', {}); pending = {}; markUnsent(false);
      toast(unsent ? 'This computer had another student’s work, and some of it may not have been saved to their record. It has been removed from this computer, and none of it was added to yours.'
                   : 'This computer had another student’s work. It stays in their record; it was not added to yours.');
    }
    try { if (email) localStorage.setItem(OWNER_KEY, email); } catch (e) {}
  }

  /* ---------- saving ---------- */
  function post(body, leaving) {
    var opts = { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) };
    if (leaving) opts.keepalive = true;          /* the page is going: let the request outlive it */
    return fetch(CFG.submitUrl, opts).then(function (r) { return r.ok ? r.json() : null; });
  }
  var SAVE_AFTER = 120000, pending = {}, syncTimer = null, changeGen = 0, notListedSaid = false;
  function notListed() { return !!(server && server.onList === false); }
  function queue(id, now) {
    changeGen++; markUnsent(true);               /* until a save the records take */
    if (!syncOn() || !me || notListed()) return;
    pending[id] = true; paintSync();
    if (now) { clearTimeout(syncTimer); syncTimer = null; flush(); return; }
    if (!syncTimer) syncTimer = setTimeout(function () { syncTimer = null; flush(); }, SAVE_AFTER);
  }
  WUL.onRecord(function (id) {
    /* a part just finished goes at once, as a lab's finished station does */
    var st = WUL.partState(id);
    queue(id, !!(st && st.state === 'done' && WUL.hwFor && WUL.hwFor(id).length));
  });
  function flush(leaving) {
    var ids = Object.keys(pending); if (!ids.length) return;
    if (!me || notListed()) return;              /* signed out: it waits for this browser's owner to sign in again */
    var c = sendCreds(), gen = changeGen;
    if (!c) { SI.renew(CID, function (v) { if (v && sendCreds()) flush(); else spent(); }); return; }   /* never round again on nothing */
    pending = {};
    setSync('saving');
    var parts = {};
    ids.forEach(function (id) { var x = WUL.rec(id); if (x) parts[id] = x; });
    post({ action: 'writeup.save', token: c.token, pass: c.pass, parts: parts }, leaving)
      .then(function (j) {
        if (j && !j.ok && /^not on your teacher/.test(String(j.why || ''))) {
          server = server || {}; server.onList = false; setSync('failed'); paintWho();
          if (!notListedSaid) { notListedSaid = true; toast('Your progress was not recorded: ' + j.why); }
          return;
        }
        if (!j || !j.ok) {
          ids.forEach(function (id) { pending[id] = true; });
          /* the records turned the sign-in away (its hour is up by Google's clock): sign in again. Tried again in a minute too,
             because Google's check can also fail for a moment */
          /* a refused pass (🔑) is dropped; then "sign in again" unless something good is left to send with */
          if (j && j.why === 'not signed in') { if (c.pass && SI.dropPass) SI.dropPass(c.pass); if (sendCreds()) setSync('failed'); else spent(); } else setSync('failed');
          clearTimeout(syncTimer); syncTimer = setTimeout(function () { syncTimer = null; flush(); }, 60000);
          if (j && j.why && j.why !== 'not signed in') toast('Your progress was not recorded: ' + j.why);
        } else { setSync('saved'); if (!Object.keys(pending).length && gen === changeGen) markUnsent(false); }
      })
      .catch(function () {
        ids.forEach(function (id) { pending[id] = true; }); setSync('failed');
        clearTimeout(syncTimer); syncTimer = setTimeout(function () { syncTimer = null; flush(); }, 60000);   /* "will try again" is true */
      });
  }
  addEventListener('pagehide', function () { if (Object.keys(pending).length) flush(true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && Object.keys(pending).length) flush(true); });

  /* ---------- their own work back, and their homework ---------- */
  var mineAsking = '';     /* the account a records call is out for: one call at a time, and an answer for another account is dropped */
  function fetchMine() {
    if (!syncOn() || !me) return;
    var c = sendCreds();
    if (!c) { SI.renew(CID, function (v) { if (v && sendCreds()) fetchMine(); else spent(); }); return; }
    if (mineAsking === c.email) return;
    var asked = mineAsking = c.email;
    function noAnswer() { setSync('failed'); WUL.hw = { signedIn: true, loaded: true, list: [] }; paintWho(); WUL.homeworkChanged(); }
    post({ action: 'writeup.mine', token: c.token, pass: c.pass }).then(function (j) {
      if (mineAsking === asked) mineAsking = '';
      if (!me || me.email !== asked) return;
      if (!j || !j.ok) { if (j && j.why === 'not signed in') { if (c.pass && SI.dropPass) SI.dropPass(c.pass); if (sendCreds()) noAnswer(); else spent(); } else noAnswer(); return; }
      server = j;
      setSync(syncState === 'saving' ? 'saving' : 'saved');
      /* bring back work from another computer: it only ever adds */
      var added = 0;
      Object.keys(j.parts || {}).forEach(function (id) { if (WUL.foldRecord(id, j.parts[id])) added++; });
      if (added) toast('Your work from another computer is back.');
      WUL.hw = { signedIn: true, loaded: true, list: (j.homework || []).filter(function (x) { return x && x.id && (x.parts || []).length; }),
                 most: j.most && typeof j.most === 'object' ? j.most : {},     /* per part, what homework counts (8 Oct 2026) */
                 acc: !!j.acc };   /* the teacher's accommodation for this pupil: help after a second wrong try (quiz.js; 8 Oct 2026) */
      paintWho();
      /* and the other way: work done in this browser before signing in has never been sent */
      if (j.onList) {
        var all = WUL.allRecs(), ids = Object.keys(all).filter(function (id) { return WUL.stations[id] && WUL.hasWork(all[id]); });
        ids.forEach(function (id, i) { queue(id, i === ids.length - 1); });
      }
      WUL.homeworkChanged();
    }).catch(function () {     /* not JSON: a script from before writeup.mine answers "unknown lab" */
      if (mineAsking === asked) mineAsking = '';
      if (me && me.email === asked) noAnswer();
    });
  }

  /* The sign-in changed, here or in another tab of the site. Another account starts afresh; nobody, and the page is signed
     out. The same pupil with a new sign-in (Google's button pressed again, a renewal, the hub in another tab) sends what
     could not be sent while the old one had expired: the records first, then everything this browser holds (fetchMine).
     Until 6 Oct 2026 only another account did, so a pupil whose sign-in had expired had to sign out and in again. */
  if (SI) SI.on(function (v) {
    var was = me && me.email, other = !v || v.email !== was;
    var again = !other && SI.fresh(v) && (syncState === 'stale' || !server || Object.keys(pending).length > 0 || unsentHere());
    me = v;
    if (other || (again && syncState === 'stale')) syncState = 'idle';
    if (v && other) { server = null; notListedSaid = false; WUL.hw = { signedIn: true, loaded: false, list: [] }; claimFor(v.email); paintWho(); fetchMine(); WUL.homeworkChanged(); return; }
    if (!v) { server = null; WUL.hw = { signedIn: false, loaded: false, list: [] }; WUL.homeworkChanged(); }
    paintWho();
    if (again) { if (WUL.hw.spent) { WUL.hw = { signedIn: true, loaded: false, list: [] }; WUL.homeworkChanged(); } fetchMine(); }
  });
  paintWho();
  /* app.js has drawn the page already (this file loads after it): a signed-in pupil's homework page now says it is loading */
  if (SI && SI.passFrom && syncOn()) SI.passFrom(CFG.submitUrl);   /* the labs script's pass, when it is due */
  if (me) { claimFor(me.email); fetchMine(); WUL.homeworkChanged(); }
})(window.WUL);
