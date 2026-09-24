/* ============================================================
   widget: ref-builder — "Build a reference".
   Pick a source type, fill the labelled boxes, and the MLA 9 entry is
   built live, colour-coded by core element, with its in-text citation.
   A checklist warns of anything the IB requires that is missing.
   A helper, not a marked question. Every "Load an example" source is
   real and was checked on 23 Sept. 2026 (see js/stations/sources.js).
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, esc = WUL.esc;
  var NAME = 'ref-builder';

  WUL.css(NAME,
    '.wd-ref-builder{display:grid;gap:14px}' +
    '.wd-ref-builder__types{display:flex;flex-wrap:wrap;gap:6px}' +
    '.wd-ref-builder__type{appearance:none;border:1.5px solid var(--rule);background:var(--sheet);color:var(--ink-2);border-radius:999px;padding:8px 13px;min-height:40px;font:600 .86rem/1.2 var(--sans);cursor:pointer}' +
    '.wd-ref-builder__type:hover{border-color:var(--ink-3)}' +
    '.wd-ref-builder__type[aria-pressed="true"]{background:var(--lvl-wash);border-color:var(--lvl);color:var(--lvl)}' +
    '.wd-ref-builder__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;align-items:start}' +
    '.wd-ref-builder__form{display:grid;gap:10px}' +
    '.wd-ref-builder__bar{display:flex;flex-wrap:wrap;gap:8px}' +
    '.wd-ref-builder__f{display:grid;gap:4px}' +
    '.wd-ref-builder__f label{font:600 .8rem/1.3 var(--sans);color:var(--ink-2)}' +
    '.wd-ref-builder__f input,.wd-ref-builder__f select{width:100%;min-height:42px;padding:8px 10px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);color:var(--ink);font:400 .95rem/1.3 var(--sans)}' +
    '.wd-ref-builder__f input:focus,.wd-ref-builder__f select:focus{outline:2px solid var(--lvl);outline-offset:1px;border-color:var(--lvl)}' +
    '.wd-ref-builder__f small{font-size:.78rem;color:var(--ink-3);line-height:1.35}' +
    '.wd-ref-builder__pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}' +
    '.wd-ref-builder__out{display:grid;gap:12px;position:sticky;top:90px}' +
    '.wd-ref-builder__entry{font:400 1.02rem/1.6 var(--serif);padding:14px 14px 14px calc(14px + 2em);text-indent:-2em;overflow-wrap:anywhere;min-height:3.2em}' +
    '.wd-ref-builder__entry:focus{outline:2px solid var(--lvl);outline-offset:2px}' +
    '.wd-ref-builder__gap{color:var(--ink-3);font-style:italic}' +
    '.wd-ref-builder__e{border-radius:2px;padding:0 1px;box-decoration-break:clone;-webkit-box-decoration-break:clone}' +
    '.wd-ref-builder__e--au{background:var(--p1)} .wd-ref-builder__e--ti{background:var(--p2)} .wd-ref-builder__e--co{background:var(--p3)}' +
    '.wd-ref-builder__e--nu{background:var(--p4)} .wd-ref-builder__e--pu{background:color-mix(in srgb,var(--ink-3) 24%,transparent)}' +
    '.wd-ref-builder__e--da{background:var(--p5)} .wd-ref-builder__e--lo{background:var(--p6)}' +
    '.wd-ref-builder__key{display:flex;flex-wrap:wrap;gap:5px 10px;font:500 .74rem/1.2 var(--sans);color:var(--ink-2)}' +
    '.wd-ref-builder__key span{display:inline-flex;align-items:center;gap:5px}' +
    '.wd-ref-builder__key i{width:12px;height:12px;border-radius:2px;display:inline-block}' +
    '.wd-ref-builder__cite{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 10px;padding:10px 12px;border:1px dashed var(--rule);border-radius:var(--r);background:var(--sheet-2)}' +
    '.wd-ref-builder__cite b{font:400 1rem/1.4 var(--serif)}' +
    '.wd-ref-builder__checks{list-style:none;margin:0;padding:0;display:grid;gap:6px}' +
    '.wd-ref-builder__checks li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;align-items:start;font-size:.9rem;line-height:1.4}' +
    '.wd-ref-builder__ic{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font:700 .72rem/1 var(--sans)}' +
    '.wd-ref-builder__checks .is-ok .wd-ref-builder__ic{background:var(--green-wash);color:var(--green)}' +
    '.wd-ref-builder__checks .is-warn .wd-ref-builder__ic{background:var(--amber-wash);color:var(--amber)}' +
    '.wd-ref-builder__checks .is-miss .wd-ref-builder__ic{background:var(--red-wash);color:var(--red)}' +
    '.wd-ref-builder__msg{font-size:.88rem;color:var(--ink-2);min-height:1.3em}' +
    '@media (max-width:760px){.wd-ref-builder__grid{grid-template-columns:1fr}.wd-ref-builder__out{position:static}}' +
    '@media (max-width:420px){.wd-ref-builder__pair{grid-template-columns:1fr}.wd-ref-builder__entry{font-size:.96rem}}'
  );

  var MON = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  /* '2026-09-23' → '23 Sept. 2026' (MLA 9 abbreviates months longer than four letters) */
  function mlaDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return (iso || '').trim();
    return (+m[3]) + ' ' + MON[+m[2] - 1] + ' ' + m[1];
  }
  function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function noEnd(s) { return clean(s).replace(/[.,;:]+$/, ''); }
  function looksLikeUrl(s) { return /^(https?:\/\/|www\.)/i.test(clean(s)) || /^[\w-]+(\.[\w-]+)+\/\S*$/.test(clean(s)); }
  function webUrl(s) { return clean(s).replace(/^https?:\/\//i, '').replace(/\/$/, ''); }
  function doi(s) {
    s = clean(s);
    var m = /^(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,}\/\S+)$/i.exec(s);
    return m ? 'https://doi.org/' + m[1] : webUrl(s);
  }
  function edition(s) { s = noEnd(s); if (!s) return ''; return /ed$/i.test(s) ? s + '.' : s + ' ed.'; }
  function pages(s) { s = clean(s).replace(/\s*[-‐‑–—]\s*/g, '–'); if (!s) return ''; return (/–/.test(s) ? 'pp. ' : 'p. ') + s.replace(/^pp?\.\s*/i, ''); }
  function shortTitle(s, n) {
    var w = noEnd(s).replace(/[?!]$/, '').split(' ');
    return w.slice(0, n).join(' ');
  }

  /* the six source types: their boxes, and a real example for each */
  var F = {
    n: { k: 'n', label: 'How many authors?', type: 'select', opts: [['1', 'One'], ['2', 'Two'], ['3', 'Three or more']] },
    last: { k: 'last', label: 'First author: surname', ph: 'e.g. Cumming' },
    first: { k: 'first', label: 'First author: first name(s)', ph: 'e.g. Geoff' },
    second: { k: 'second', label: 'Second author: first name and surname', ph: 'e.g. Fiona Fidler', when: function (v) { return v.n === '2'; } }
  };
  var TYPES = [
    { id: 'book', name: 'Book', authors: true,
      fields: [
        { k: 'title', label: 'Title of the book', ph: 'e.g. Campbell Biology' },
        { k: 'edition', label: 'Edition (leave empty for the first)', ph: 'e.g. 12th', half: 1 },
        { k: 'year', label: 'Year published', ph: 'e.g. 2020', half: 1 },
        { k: 'publisher', label: 'Publisher', ph: 'e.g. Pearson' },
        { k: 'page', label: 'Page you used (for the in-text citation)', ph: 'e.g. 154' }
      ],
      example: { n: '3', last: 'Urry', first: 'Lisa A.', title: 'Campbell Biology', edition: '12th', year: '2020', publisher: 'Pearson', page: '' },
      exampleNote: 'Add the page of the part you used: it goes in the in-text citation.' },
    { id: 'journal', name: 'Journal article', authors: true,
      fields: [
        { k: 'title', label: 'Title of the article', ph: 'e.g. Error Bars in Experimental Biology' },
        { k: 'container', label: 'Name of the journal', ph: 'e.g. Journal of Cell Biology' },
        { k: 'volume', label: 'Volume', ph: 'e.g. 177', half: 1 },
        { k: 'issue', label: 'Issue', ph: 'e.g. 1', half: 1 },
        { k: 'year', label: 'Year', ph: 'e.g. 2007', half: 1 },
        { k: 'pages', label: 'Pages of the article', ph: 'e.g. 7–11', half: 1 },
        { k: 'doi', label: 'DOI (or URL)', ph: 'e.g. 10.1083/jcb.200611141' },
        { k: 'accessed', label: 'Date you read it online (if online)', type: 'date' },
        { k: 'page', label: 'Page you used (for the in-text citation)', ph: 'e.g. 8' }
      ],
      example: { n: '3', last: 'Cumming', first: 'Geoff', title: 'Error Bars in Experimental Biology', container: 'Journal of Cell Biology', volume: '177', issue: '1', year: '2007', pages: '7–11', doi: '10.1083/jcb.200611141', accessed: '', page: '8' },
      exampleNote: 'Page 8 is where the paper says every figure legend must state what its error bars show.' },
    { id: 'web', name: 'Web page', authors: true, online: true,
      fields: [
        { k: 'title', label: 'Title of the page', ph: 'e.g. 6.5 Enzymes' },
        { k: 'container', label: 'Name of the website', ph: 'e.g. Biology 2e' },
        { k: 'publisher', label: 'Publisher (only if different from the website)', ph: 'e.g. OpenStax' },
        { k: 'date', label: 'Date published', ph: 'e.g. 28 Mar. 2018, or a year', small: 'No date on the page? Check the bottom of the page for a copyright year.' },
        { k: 'url', label: 'URL', ph: 'e.g. openstax.org/books/…' },
        { k: 'accessed', label: 'Date you accessed it', type: 'date' }
      ],
      example: { n: '3', last: 'Clark', first: 'Mary Ann', title: '6.5 Enzymes', container: 'Biology 2e', publisher: 'OpenStax', date: '28 Mar. 2018', url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes', accessed: '2026-09-23' },
      exampleNote: 'OpenStax lists three senior authors, so the entry uses the first one and “et al.”.' },
    { id: 'webna', name: 'Web page, no author', online: true,
      fields: [
        { k: 'title', label: 'Title of the page', ph: 'e.g. Making a Calibration Curve for Starch Concentration' },
        { k: 'container', label: 'Name of the website', ph: 'e.g. Practical Biology' },
        { k: 'publisher', label: 'Publisher (only if different from the website)', ph: 'e.g. Royal Society of Biology' },
        { k: 'date', label: 'Date published', ph: 'e.g. 2019', small: 'No date on the page? Check the bottom of the page for a copyright year.' },
        { k: 'url', label: 'URL', ph: 'e.g. practicalbiology.org/…' },
        { k: 'accessed', label: 'Date you accessed it', type: 'date' }
      ],
      example: { title: 'Making a Calibration Curve for Starch Concentration', container: 'Practical Biology', publisher: 'Royal Society of Biology', date: '2019', url: 'https://practicalbiology.org/standard-techniques/making-a-calibration-curve-for-starch-concentration', accessed: '2026-09-23' },
      exampleNote: 'No author is named, so the entry starts with the title. The date is the page’s copyright year.' },
    { id: 'video', name: 'Video', online: true,
      fields: [
        { k: 'title', label: 'Title of the video', ph: 'e.g. Enzymes (Updated)' },
        { k: 'container', label: 'Platform', ph: 'e.g. YouTube' },
        { k: 'uploader', label: 'Uploaded by (the channel)', ph: 'e.g. Amoeba Sisters' },
        { k: 'date', label: 'Date uploaded', ph: 'e.g. 28 Aug. 2016' },
        { k: 'url', label: 'URL', ph: 'e.g. www.youtube.com/watch?v=…' },
        { k: 'accessed', label: 'Date you watched it', type: 'date' }
      ],
      example: { title: 'Enzymes (Updated)', container: 'YouTube', uploader: 'Amoeba Sisters', date: '28 Aug. 2016', url: 'https://www.youtube.com/watch?v=qgVFkRn8f10', accessed: '2026-09-23' },
      exampleNote: 'The upload date is shown under the video on YouTube.' },
    { id: 'ai', name: 'AI tool',
      fields: [
        { k: 'prompt', label: 'Your prompt, exactly as you typed it', ph: 'e.g. Explain why amylase activity falls above its optimum temperature' },
        { k: 'container', label: 'Name of the AI tool', ph: 'e.g. ChatGPT', half: 1 },
        { k: 'version', label: 'Model or version', ph: 'e.g. GPT-4o', half: 1 },
        { k: 'publisher', label: 'Company', ph: 'e.g. OpenAI' },
        { k: 'generated', label: 'Date the text was generated', type: 'date' },
        { k: 'url', label: 'Link to the chat (or the tool’s address)', ph: 'e.g. chatgpt.com/share/…' }
      ],
      example: { prompt: 'Explain why amylase activity falls above its optimum temperature', container: 'ChatGPT', version: 'GPT-4o', publisher: 'OpenAI', generated: '2025-03-14', url: 'chatgpt.com' },
      exampleNote: 'An example of the format. Use your own prompt and the date you generated the text.' }
  ];
  var BY = {}; TYPES.forEach(function (t) { BY[t.id] = t; });

  /* ---------- building the entry ----------
     returns {parts:[[cls, text, italic]], cite:[text, gapText], checks:[[state, text]]} */
  function build(t, v, level) {
    var P = [], C = [], ck = [];
    function add(cls, text, it, sep) { P.push([cls, text, !!it, sep == null ? '' : sep]); }
    function gap(label) { P.push(['gap', '[' + label + ']', false, '']); }
    var n = v.n || '1', last = noEnd(v.last), first = clean(v.first).replace(/[,;:]+$/, ''), second = noEnd(v.second);
    var authorTxt = '', citeName = '';
    if (t.authors) {
      if (last) {
        if (n === '1') authorTxt = last + (first ? ', ' + first : '');
        else if (n === '2') authorTxt = last + (first ? ', ' + first : '') + ', and ' + (second || '[second author]');
        else authorTxt = last + (first ? ', ' + first : '') + ', et al';
        citeName = n === '1' ? last : n === '2' ? last + ' and ' + (second.split(' ').pop() || '[surname]') : last + ' et al.';
      }
      if (/anonymous/i.test(last + first)) ck.push(['miss', 'Never write “Anonymous”. With no author, choose “Web page, no author”: the entry starts with the title.']);
      else if (!last) ck.push(['miss', 'Author missing. The IB requires the author’s name. No author? Choose “Web page, no author”.']);
      else if (!first) ck.push(['warn', 'Add the first name(s) of the first author.']);
      else ck.push(['ok', 'Author: surname first' + (n === '3' ? ', then “et al.” for three or more.' : '.')]);
    }
    var title = clean(t.id === 'ai' ? v.prompt : v.title);
    var titleIsUrl = looksLikeUrl(title);

    if (t.authors) { if (authorTxt) add('au', authorTxt.replace(/\.$/, '') + '.', false, ' '); else { gap('Author'); P[P.length - 1][3] = ' '; } }
    else if (t.id !== 'ai') ck.push(['ok', 'No author named, so the entry starts with the title. Never “Anonymous”.']);

    if (t.id === 'book') {
      if (title) { add('ti', noEnd(title), true, ''); P.push(['', /[?!]$/.test(title) ? ' ' : '. ', false, '']); } else { gap('Title'); P[P.length - 1][3] = ' '; }
      var tail = [];
      if (clean(v.edition)) tail.push(['nu', edition(v.edition)]);
      if (clean(v.publisher)) tail.push(['pu', noEnd(v.publisher)]);
      if (clean(v.year)) tail.push(['da', noEnd(v.year)]);
      tail.forEach(function (x, i) { add(x[0], x[1].replace(/\.$/, ''), false, ''); P.push(['', i === tail.length - 1 ? '.' : (/\.$/.test(x[1]) ? '., ' : ', '), false, '']); });
      if (!clean(v.publisher)) ck.push(['warn', 'Add the publisher.']);
    } else if (t.id === 'ai') {
      if (title) add('ti', '“' + noEnd(title).replace(/[.]$/, '') + '” prompt.', false, ' '); else { gap('“Your prompt” prompt.'); P[P.length - 1][3] = ' '; }
      var ai = [];
      if (clean(v.container)) ai.push(['co', noEnd(v.container), true]);
      if (clean(v.version)) { var ver = noEnd(v.version); ai.push(['nu', /^(model|version)\b/i.test(ver) || /version$/i.test(ver) ? ver : 'model ' + ver]); }
      if (clean(v.publisher)) ai.push(['pu', noEnd(v.publisher)]);
      if (v.generated) ai.push(['da', mlaDate(v.generated)]);
      if (clean(v.url)) ai.push(['lo', webUrl(v.url)]);
      ai.forEach(function (x, i) { add(x[0], x[1], x[2], ''); P.push(['', i === ai.length - 1 ? '.' : ', ', false, '']); });
    } else {
      /* a part of something larger: the title goes in quotation marks */
      if (title) add('ti', '“' + noEnd(title) + (/[?!]$/.test(title) ? '' : '.') + '”', false, ' ');
      else { gap('“Title.”'); P[P.length - 1][3] = ' '; }
      var el = [];
      if (clean(v.container)) el.push(['co', noEnd(v.container), true]);
      if (t.id === 'video' && clean(v.uploader)) el.push(['nu', 'uploaded by ' + noEnd(v.uploader)]);
      if (t.id === 'journal') {
        if (clean(v.volume)) el.push(['nu', 'vol. ' + noEnd(v.volume)]);
        if (clean(v.issue)) el.push(['nu', 'no. ' + noEnd(v.issue)]);
      }
      if ((t.id === 'web' || t.id === 'webna') && clean(v.publisher) && noEnd(v.publisher).toLowerCase() !== noEnd(v.container).toLowerCase()) el.push(['pu', noEnd(v.publisher)]);
      var d = t.id === 'journal' ? clean(v.year) : clean(v.date);
      if (d) el.push(['da', noEnd(d)]);
      if (t.id === 'journal' && clean(v.pages)) el.push(['lo', pages(v.pages)]);
      if (t.id === 'journal' && clean(v.doi)) el.push(['lo', doi(v.doi)]);
      if (t.id !== 'journal' && clean(v.url)) el.push(['lo', webUrl(v.url)]);
      el.forEach(function (x, i) { add(x[0], x[1], x[2], ''); P.push(['', i === el.length - 1 ? '.' : ', ', false, '']); });
      if (v.accessed) { P.push(['', ' ', false, '']); add('da', 'Accessed ' + mlaDate(v.accessed) + '.', false, ''); }
    }

    /* the in-text citation */
    if (t.authors) {
      var needsPage = t.id === 'book' || t.id === 'journal';
      var pg = clean(v.page);
      if (!citeName) C = ['(', '[author]', ')'];
      else if (needsPage) C = pg ? ['(' + citeName + ' ' + pg + ')'] : ['(' + citeName + ' ', '[page]', ')'];
      else C = ['(' + citeName + ')'];
      if (needsPage && !pg) ck.push(['warn', 'Add the page you used, for the in-text citation.']);
    } else if (title) {
      C = ['(“' + shortTitle(title, t.id === 'ai' ? 3 : 4) + '”)'];
    } else C = ['(', '[short title]', ')'];

    /* the IB's minimum elements */
    if (titleIsUrl) ck.push(['miss', 'The title looks like a web address. A bare URL is not a reference: give the page’s own title.']);
    else if (!title) ck.push(['miss', t.id === 'ai' ? 'The IB requires the exact prompt you gave the AI tool.' : 'Title missing. The IB requires the title of the source.']);
    else ck.push(['ok', t.id === 'ai' ? 'The prompt is given, in quotation marks.' : 'Title given' + (t.id === 'book' ? ', in italics: a whole book.' : ', in quotation marks: a part of something larger.')]);

    if (t.id === 'ai') {
      if (!clean(v.container)) ck.push(['miss', 'Name the AI tool.']);
      if (!v.generated) ck.push(['miss', 'The IB requires the date the text was generated.']);
      else ck.push(['ok', 'The date it was generated is given.']);
      ck.push(['warn', 'In your text, put the AI output inside quotation marks, followed by the in-text citation.']);
    } else {
      var date = t.id === 'book' || t.id === 'journal' ? clean(v.year) : clean(v.date);
      if (!date) ck.push(['miss', 'No date of publication. The IB requires one.' + (t.online ? ' Check the bottom of the page for a copyright year.' : '')]);
      else ck.push(['ok', 'Date of publication given.']);
    }
    if (t.id === 'journal') {
      if (!clean(v.container)) ck.push(['miss', 'Name the journal: it is the container, in italics.']);
      if (!clean(v.pages)) ck.push(['warn', 'Add the page range of the article: the IB asks for page numbers where they apply.']);
      if (clean(v.doi) && !v.accessed) ck.push(['warn', 'If you read it online, the IB asks for the date you accessed it.']);
    }
    if (t.online) {
      if (!clean(v.container)) ck.push(['warn', 'Add the name of the ' + (t.id === 'video' ? 'platform' : 'website') + ', in italics.']);
      if (!v.accessed) ck.push(['miss', 'No access date. The IB requires the date you accessed any online source, although MLA makes it optional.']);
      else ck.push(['ok', 'Access date given: the IB requires it.']);
      if (!clean(v.url)) ck.push([level === 'e' ? 'miss' : 'warn', 'Add the URL. The EE guide requires it for web sources, and MLA recommends it.']);
      else if (!title) ck.push(['miss', 'A URL alone is not a reference: it has no author, title or date.']);
    }
    return { parts: P, cite: C, checks: ck };
  }

  WUL.widget(NAME, function (host, opts, ctx) {
    var uid = NAME + '-' + Math.random().toString(36).slice(2, 7);
    var saved = WUL.store.get(NAME + '.state', null) || {};
    var state = { type: BY[saved.type] ? saved.type : 'journal', vals: saved.vals || {} };
    var level = (ctx && ctx.level) || WUL.level();

    var root = h('div', { class: 'wd-ref-builder' });
    host.appendChild(root);
    var types = h('div', { class: 'wd-ref-builder__types', role: 'group', 'aria-label': 'Type of source' });
    TYPES.forEach(function (t) {
      var b = h('button', { type: 'button', class: 'wd-ref-builder__type', 'data-t': t.id, 'aria-pressed': 'false', text: t.name });
      types.appendChild(b);
    });
    root.appendChild(h('div', { class: 'wd-k', text: '1 · Choose the type of source' }));
    root.appendChild(types);

    var grid = h('div', { class: 'wd-ref-builder__grid' });
    var formPanel = h('div', { class: 'wd-panel wd-ref-builder__form' });
    var outPanel = h('div', { class: 'wd-panel wd-ref-builder__out', 'aria-live': 'polite' });
    grid.appendChild(formPanel); grid.appendChild(outPanel);
    root.appendChild(grid);

    /* form: example + clear buttons, then the boxes */
    var bar = h('div', { class: 'wd-ref-builder__bar' });
    var exBtn = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Load an example' });
    var clrBtn = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Clear' });
    bar.appendChild(exBtn); bar.appendChild(clrBtn);
    var boxes = h('div', { class: 'wd-ref-builder__form' });
    var exNote = h('p', { class: 'hint', style: 'margin:0' });
    formPanel.appendChild(h('div', { class: 'wd-k', text: '2 · Type what the source shows' }));
    formPanel.appendChild(bar); formPanel.appendChild(exNote); formPanel.appendChild(boxes);

    /* output */
    var entry = h('div', { class: 'wd-ref-builder__entry sheet', tabindex: '-1', 'aria-label': 'Your Works Cited entry' });
    var cite = h('div', { class: 'wd-ref-builder__cite' });
    var key = h('div', { class: 'wd-ref-builder__key', 'aria-hidden': 'true' });
    [['au', 'Author'], ['ti', 'Title'], ['co', 'Container'], ['nu', 'Version, number'], ['pu', 'Publisher'], ['da', 'Date'], ['lo', 'Location']].forEach(function (k) {
      key.appendChild(h('span', {}, [h('i', { class: 'wd-ref-builder__e--' + k[0] }), k[1]]));
    });
    var copyRow = h('div', { class: 'wd-ref-builder__bar' });
    var copyBtn = h('button', { type: 'button', class: 'btn btn--go', text: 'Copy the entry' });
    var msg = h('p', { class: 'wd-ref-builder__msg', role: 'status' });
    copyRow.appendChild(copyBtn);
    var checks = h('ul', { class: 'wd-ref-builder__checks' });
    outPanel.appendChild(h('div', { class: 'wd-k', text: '3 · Your Works Cited entry (MLA 9)' }));
    outPanel.appendChild(entry); outPanel.appendChild(key);
    outPanel.appendChild(cite);
    outPanel.appendChild(copyRow); outPanel.appendChild(msg);
    outPanel.appendChild(h('div', { class: 'wd-k', text: 'What the IB requires' }));
    outPanel.appendChild(checks);

    function vals() { state.vals[state.type] = state.vals[state.type] || {}; return state.vals[state.type]; }
    function save() { WUL.store.set(NAME + '.state', { type: state.type, vals: state.vals }); }

    function field(f, v) {
      var id = uid + '-' + f.k;
      var wrap = h('div', { class: 'wd-ref-builder__f' });
      wrap.appendChild(h('label', { for: id, text: f.label }));
      var inp;
      if (f.type === 'select') {
        inp = h('select', { id: id, 'data-k': f.k });
        f.opts.forEach(function (o) { inp.appendChild(h('option', { value: o[0], text: o[1] })); });
        inp.value = v[f.k] || f.opts[0][0];
      } else {
        inp = h('input', { id: id, 'data-k': f.k, type: f.type === 'date' ? 'date' : 'text', placeholder: f.ph || null, autocomplete: 'off', spellcheck: 'false' });
        inp.value = v[f.k] || '';
      }
      wrap.appendChild(inp);
      if (f.small) wrap.appendChild(h('small', { text: f.small }));
      return wrap;
    }
    function drawForm() {
      var t = BY[state.type], v = vals();
      boxes.innerHTML = '';
      var list = (t.authors ? [F.n, F.last, F.first, F.second] : []).concat(t.fields);
      var pair = null;
      list.forEach(function (f) {
        if (f.when && !f.when(v)) return;
        var node = field(f, v);
        if (f.half) {
          if (!pair) { pair = h('div', { class: 'wd-ref-builder__pair' }); boxes.appendChild(pair); }
          pair.appendChild(node);
          if (pair.children.length === 2) pair = null;
        } else { pair = null; boxes.appendChild(node); }
      });
      types.querySelectorAll('.wd-ref-builder__type').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-t') === state.type ? 'true' : 'false'); });
    }
    function drawOut() {
      var t = BY[state.type], r = build(t, vals(), level);
      entry.innerHTML = r.parts.map(function (p) {
        if (p[0] === 'gap') return '<span class="wd-ref-builder__gap">' + esc(p[1]) + '</span>' + esc(p[3]);
        var inner = p[2] ? '<i>' + esc(p[1]) + '</i>' : esc(p[1]);
        return (p[0] ? '<span class="wd-ref-builder__e wd-ref-builder__e--' + p[0] + '">' + inner + '</span>' : inner) + esc(p[3]);
      }).join('');
      cite.innerHTML = '<span class="wd-k">In the text</span><b>' + r.cite.map(function (c, i) { return i === 1 ? '<span class="wd-ref-builder__gap">' + esc(c) + '</span>' : esc(c); }).join('') + '</b>';
      checks.innerHTML = '';
      var v = vals(), empty = !Object.keys(v).some(function (k) { return k !== 'n' && clean(v[k]); });
      if (empty) {
        checks.appendChild(h('li', { class: 'is-warn' }, [h('span', { class: 'wd-ref-builder__ic', 'aria-hidden': 'true', text: '!' }),
          h('span', { text: 'Complete the boxes, or press “Load an example”. Anything the IB requires that is missing will show here.' })]));
        r.checks = [];
      }
      r.checks.forEach(function (c) {
        checks.appendChild(h('li', { class: 'is-' + c[0] }, [h('span', { class: 'wd-ref-builder__ic', 'aria-hidden': 'true', text: c[0] === 'ok' ? '✔' : c[0] === 'warn' ? '!' : '✘' }),
          h('span', { text: c[1] })]));
      });
      var misses = r.checks.filter(function (c) { return c[0] === 'miss'; }).length;
      copyBtn.disabled = !r.parts.some(function (p) { return p[0] && p[0] !== 'gap'; });
      entry.setAttribute('data-miss', String(misses));
    }
    function plain() {
      /* the entry as plain text, for the clipboard (italics are lost: say so) */
      return entry.textContent.replace(/\s+/g, ' ').trim();
    }

    types.addEventListener('click', function (e) {
      var b = e.target.closest('.wd-ref-builder__type'); if (!b) return;
      state.type = b.getAttribute('data-t'); exNote.textContent = ''; msg.textContent = '';
      drawForm(); drawOut(); save();
    });
    boxes.addEventListener('input', function (e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      vals()[k] = e.target.value; msg.textContent = '';
      if (k === 'n') { drawForm(); var s = boxes.querySelector('[data-k="n"]'); if (s) s.focus(); }
      drawOut(); save();
    });
    boxes.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      if (vals()[k] !== e.target.value) { vals()[k] = e.target.value; drawOut(); save(); }
    });
    exBtn.addEventListener('click', function () {
      var t = BY[state.type];
      state.vals[state.type] = Object.assign({}, t.example);
      exNote.textContent = 'A real source. ' + (t.exampleNote || '');
      msg.textContent = '';
      drawForm(); drawOut(); save();
      /* on a phone the entry sits below the boxes: bring it into view */
      if (window.innerWidth < 760 && outPanel.scrollIntoView) outPanel.scrollIntoView({ behavior: WUL.reduced() ? 'auto' : 'smooth', block: 'start' });
    });
    clrBtn.addEventListener('click', function () {
      state.vals[state.type] = {}; exNote.textContent = ''; msg.textContent = '';
      drawForm(); drawOut(); save();
      var first = boxes.querySelector('input,select'); if (first) first.focus();
    });
    copyBtn.addEventListener('click', function () {
      var text = plain();
      function fallback() {
        try {
          var sel = window.getSelection(), range = document.createRange();
          range.selectNodeContents(entry); sel.removeAllRanges(); sel.addRange(range);
          entry.focus();
          msg.textContent = 'The entry is selected. Press Ctrl+C (⌘C on a Mac) to copy it.';
        } catch (err) { msg.textContent = 'Copying is blocked here. Select the entry and copy it yourself.'; }
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            msg.textContent = 'Copied. Italics are lost when you paste: make the italic part italic again in your document.';
          }, fallback);
        } else fallback();
      } catch (err) { fallback(); }
    });

    drawForm(); drawOut();
  });

  /* WUL.tool lives in app.js, which loads after the widget files: queue the entry if it is not there yet */
  var TOOL = { name: NAME, title: 'Build a reference', blurb: 'Complete the boxes to build a colour-coded MLA 9 entry and its in-text citation.', station: 'sources', lv: 'gie', icon: '❝' };
  if (WUL.tool) WUL.tool(TOOL); else (WUL.TOOLS = WUL.TOOLS || []).push(TOOL);
})(window.WUL);
