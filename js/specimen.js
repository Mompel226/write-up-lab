/* ============================================================
   specimen.js — the report on the front page. One experiment
   (amylase and temperature) written up three times: IGCSE, IB IA,
   IB EE. Point at a part; its job, where marks go, and a door into
   that part's station open beside it.

   THE DATA IS THE SITE'S RUNNING EXAMPLE — see js/data/datasets.js.
   Iodine is sampled every 10 s, so every time is a multiple of 10 s
   and its uncertainty is ± 10 s (the sampling interval), not the
   stopwatch's resolution.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var D = WUL.data.amylase;

  function igTable() {
    return WUL.table({
      caption: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.',
      head: [[{ t: 'Temperature / °C', rs: 2 }, { t: 'Time for starch to disappear / s', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
      rows: D.g.temps.map(function (t, i) { return [t].concat(D.g.trials[i]).concat([D.g.means[i]]); }),
      cls: 'dt--mini'
    });
  }
  function iaRaw() {
    return WUL.table({
      caption: 'Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5; sampled every 10 s).',
      head: [[{ t: 'Temperature / °C ± 0.5', rs: 2 }, { t: 'Time for iodine to stop turning blue-black / s ± 10', cs: 5 }], ['1', '2', '3', '4', '5']],
      rows: D.i.temps.slice(0, 2).map(function (t, i) { return [t.toFixed(1)].concat(D.i.trials[i]); }).concat([[{ t: '… 40.0, 50.0 and 60.0 °C', cs: 6 }]]),
      cls: 'dt--mini'
    });
  }
  function iaProc() {
    return WUL.table({
      caption: 'Table 2. Processed data showing the effect of temperature (20.0–60.0 °C) on the mean time, SD and mean rate of starch digestion by fungal α-amylase (n = 5).',
      head: [['Temperature / °C', 'Mean time / s', 'SD / s', 'Mean rate / 10⁻³ s⁻¹']],
      rows: D.i.temps.map(function (t, i) { return [t.toFixed(1), D.i.means[i], D.i.sds[i].toFixed(1), D.i.rates[i].toFixed(1)]; }),
      cls: 'dt--mini'
    }) + '<p class="spec-cap">Worked example: rate = 1 ÷ mean time = 1 ÷ 178 s = 5.6 × 10⁻³ s⁻¹</p>';
  }
  function graph(lvl) {
    var d = lvl === 'g' ? D.g : D.i;
    return WUL.plot({
      w: 380, h: 250, pad: { l: 52, r: 12, t: 10, b: 44 },
      x: { min: 20, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
      y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' },
      series: [{ id: 'm', pts: d.temps.map(function (t, i) { return [t, d.means[i]]; }), line: lvl === 'g' ? 'ruled' : 'smooth', tone: 'lvl', err: lvl === 'g' ? null : d.sds }],
      caption: lvl === 'g' ? 'Figure 1. Line graph showing the effect of temperature (20–60 °C) on the mean time taken for amylase to digest starch.' :
        'Figure 1. Line graph showing the effect of temperature (20.0–60.0 °C) on the mean time taken for fungal α-amylase to digest starch (n = 5; error bars = ± 1 SD).'
    });
  }

  var P = {
    g: { name: 'IGCSE lab report', len: 'no word limit', parts: [
      { n: 'Title', st: 'question', tx: 'The effect of temperature on the time taken for amylase to digest starch', job: 'Names both variables and the system. The title alone tells the reader what you investigated.', lose: '“Testing enzymes”: it names neither variable.' },
      { n: 'Aim or question', st: 'question', tx: 'How does temperature, from 20 °C to 60 °C, affect the time taken for amylase to digest starch?', job: 'The question the data will answer: the independent variable with its range, the dependent variable with its unit.', lose: '“What is the best temperature for enzymes?”: no range, and nothing measurable.' },
      { n: 'Hypothesis', st: 'hypothesis', tx: 'If the temperature rises from 20 °C, the time will fall to a minimum and then rise, because…', job: 'A prediction with a biological reason. It predicts a shape, not only a direction.', lose: '“…because heat speeds things up”: there is no biology in that reason.' },
      { n: 'Variables', st: 'variables', tx: 'Controlled: volume of starch solution, 5.0 cm³, measured with a graduated pipette, because more starch takes longer to digest…', job: 'Every control variable gets a value, a method, and a reason.', lose: '“Everything else was kept the same.”' },
      { n: 'Apparatus', st: 'apparatus', tx: '10 cm³ graduated pipette · water bath · spotting tile · stopwatch · 1 % starch solution, 100 cm³', job: 'Sizes and quantities for everything.', lose: '“A pipette, some starch.”' },
      { n: 'Risk assessment', st: 'safety', tx: 'Iodine solution: irritant to eyes → wear eye protection…', job: 'Each hazard from this method, with the precaution that matches it.', lose: '“Wear a lab coat”, or “be careful”: the precaution must match a hazard.' },
      { n: 'Method', st: 'method', tx: '1. 5.0 cm³ of 1 % starch solution was measured into a test tube… 2. The tube was left in the water bath for 5 minutes to reach the temperature…', job: 'Numbered, past tense, passive voice. Detailed enough for someone else to repeat.', lose: 'No time for the mixture to reach the test temperature, so the temperature is not what the report says.' },
      { n: 'Results table', st: 'tables', html: igTable, job: 'A title above that names both variables: “Data showing the effect of … on …”. Then one ruled table: the independent variable first, then the trials, then the mean. Units in the headings only.', lose: '“180 s” written in every cell, or a mean written as 116.67 from whole-second data.' },
      { n: 'Graph', st: 'graphs', html: function () { return graph('g'); }, job: 'Independent variable on the x-axis, small crosses, ruled point to point. A title below that starts with the type of graph and names both variables.', lose: 'Large dots, a freehand line, or a line drawn to the origin.' },
      { n: 'Data analysis', st: 'analysis', tx: 'The mean time fell from 180 s at 20 °C to a minimum of 53 s at 50 °C (a 71 % decrease), then rose to 93 s at 60 °C…', job: 'The trend, key values with units, a calculated comparison, and any anomalies. No explanation yet.', lose: '“The graph goes down and then up.”' },
      { n: 'Conclusion', st: 'conclusion', tx: 'The results support the hypothesis. The time was shortest at 50 °C because… above this temperature the active site changes shape…', job: 'Say whether the hypothesis was supported, give the evidence, then explain the biology.', lose: 'Repeating the trend without explaining it.' },
      { n: 'Evaluation', st: 'evaluation', tx: 'The end point was judged by eye every 10 s. This is a random error, which reduced the precision…', job: 'Anomalies, named errors, and an improvement for each one.', lose: '“Human error.”' }
    ]},
    i: { name: 'IB Internal Assessment', len: '3,000 words max', parts: [
      { n: 'Opening lines', st: 'format', crit: 'required', tx: 'Title · candidate code abc123 (group: abc124, abc125) · 2,870 words', job: 'The IB asks for the title, every candidate code, and the word count at the start. No cover page is needed.', lose: 'No word count, or more than 3,000 words.', chg: 'New at IB.' },
      { n: 'Research question in context', st: 'question', crit: 'Research design', tx: 'How does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by fungal α-amylase from *Aspergillus oryzae*?', job: 'The independent and dependent variables, a short description of the system, and the theory it needs.', lose: '“Stated without context” is the 1–2 mark band.', chg: 'The system is now named. Amylases from different sources have different optimum temperatures.' },
      { n: 'Background', st: 'background', crit: 'Research design', tx: 'α-Amylase hydrolyses the α-1,4 glycosidic bonds in starch… (cited)', job: 'Only the theory the question needs, with citations.', lose: 'Two pages of textbook about enzyme structure.', chg: 'New: theory chosen for this question.' },
      { n: 'Methodological choices', st: 'variables', crit: 'Research design', tx: 'Five temperatures at 10 °C intervals span the expected optimum; five trials at each; pH held at 6.0 with a buffer because…', job: 'The range, interval, number of repeats and how each control variable is controlled, each with a reason.', lose: 'Choices listed, but not justified.', chg: 'Every choice now needs a reason.' },
      { n: 'Safety, ethics, environment', st: 'safety', crit: 'Research design', tx: 'Iodine: irritant… Solutions diluted and poured to waste; no organisms used.', job: 'Safety, ethical and environmental issues are part of the methodology.', lose: 'Leaving them out: they are part of the criterion.', chg: 'Ethics and environment are now expected too.' },
      { n: 'Method', st: 'method', crit: 'Research design', tx: '1. 5.00 cm³ of 1.0 % starch in pH 6.0 buffer was pipetted into each of five tubes…', job: 'Specific materials and precise steps, so that it “could in principle” be repeated.', lose: '“The solution was heated to the required temperature.”', chg: 'Instrument uncertainties are stated.' },
      { n: 'Raw data', st: 'tables', crit: 'Data analysis', html: iaRaw, job: 'Every measurement, with the uncertainty in the heading. Here the uncertainty comes from the sampling interval.', lose: 'An uncertainty that cannot be true, such as ± 0.2 s when sampling every 10 s.', chg: 'Raw data gets its own table, with ± uncertainties.' },
      { n: 'Processed data', st: 'processing', crit: 'Data analysis', html: iaProc, job: 'Means, standard deviation and the rate, plus one worked example of each calculation.', lose: 'Calculations with no worked example, so the examiner cannot follow them.', chg: 'SD, a derived quantity and a worked example are new.' },
      { n: 'Graph', st: 'graphs', crit: 'Data analysis', html: function () { return graph('i'); }, job: 'Means with error bars. The title below names the type of graph and both variables, then n and what the bars show.', lose: 'Error bars with no stated meaning.', chg: 'Error bars appear, and the caption names them.' },
      { n: 'Analysis', st: 'analysis', crit: 'Data analysis', tx: 'The SD bars at 40, 50 and 60 °C do not overlap, which suggests the minimum at 50 °C is not due to chance…', job: 'Trend and key values, plus what the uncertainty allows you to claim. A statistical test is optional.', lose: 'Claiming a difference where the error bars overlap.', chg: 'Uncertainty now shapes the claim.' },
      { n: 'Conclusion', st: 'conclusion', crit: 'Conclusion', tx: 'The rate was highest at 50.0 °C (18.5 × 10⁻³ s⁻¹)… This is close to the 55 °C optimum reported for free *A. oryzae* α-amylase (Raviyan et al. 5464).', job: 'Answer the research question with processed data and its uncertainty, then compare with published science.', lose: '“This agrees with the literature”: which literature, and how closely?', chg: 'Answer the question first. A comparison with a published value is required.' },
      { n: 'Evaluation', st: 'evaluation', crit: 'Evaluation', tx: 'The largest weakness was the 10 s sampling interval, because it is larger than the SD at 40 °C and 50 °C… Smaller: the bath drifted by ± 0.5 °C…', job: 'Specific weaknesses, their relative impact (which mattered most), and a realistic improvement for each.', lose: 'A general list: “small sample, human error, time”.', chg: 'New: rank the weaknesses. Extensions earn nothing.' },
      { n: 'Bibliography', st: 'sources', crit: 'integrity', tx: 'Urry, Lisa A., et al. *Campbell Biology*. 12th ed., Pearson, 2020.', job: 'One consistent style, with access dates for online sources. A missing reference is treated as malpractice, not a lost mark.', lose: 'A bare URL, or a source used but not cited.', chg: 'Access dates are required.' }
    ]},
    e: { name: 'IB Extended Essay', len: '4,000 words max', parts: [
      { n: 'Title page', st: 'format', crit: 'A Framework', tx: 'RQ: To what extent does temperature affect the rate of starch hydrolysis by α-amylase from *Aspergillus oryzae*? · Biology · 3,940 words', job: 'Student code, the research question, the subject and the word count. No names anywhere.', lose: 'A research question written as a statement or a hypothesis.', chg: 'It must be a question. “To what extent…?” is common.' },
      { n: 'Contents', st: 'format', crit: 'A Framework', tx: '1 Introduction · 2 Methodology · 3 Results · 4 Analysis · 5 Discussion · 6 Evaluation · 7 Conclusion · References · Appendices', job: 'Part of the required structure. Page numbers start after it.', lose: 'No page numbers.', chg: 'New.' },
      { n: 'Introduction and literature', st: 'background', crit: 'B Knowledge', tx: 'Industrial α-amylases differ widely in their optimum temperature… Published studies report…', job: 'Knowledge built from relevant sources, with terms used accurately. A literature review is required.', lose: 'A textbook summary with no link to the question.', chg: 'The IA’s background grows into a literature review.' },
      { n: 'Methodology', st: 'method', crit: 'A Framework', tx: 'A pilot run showed that sampling every 30 s was too coarse, so the mixture was sampled every 10 s…', job: 'A method suited to the question, explained and justified, including why other methods were rejected.', lose: 'Reusing the IA: nothing may be reused.', chg: 'Now justify why this method, and not another.' },
      { n: 'Results', st: 'graphs', crit: 'C Analysis', html: function () { return graph('i'); }, job: 'Processed tables and graphs in the body, with a sample of the raw data. They do not count towards the word limit.', lose: 'Key results placed in an appendix, which examiners are not required to read.', chg: 'The bulk of the raw data moves to an appendix.' },
      { n: 'Analysis', st: 'stats', crit: 'C Analysis', tx: 'A t-test between 40 °C and 50 °C gave t = 5.77, df = 8, p < 0.001, so the shorter time at 50 °C is unlikely to be due to chance…', job: 'Analysis that produces relevant findings, with statistics where appropriate.', lose: 'Numbers with no line of argument linking them to the question.', chg: 'The analysis must build an argument.' },
      { n: 'Discussion', st: 'discussion', crit: 'D Discussion', tx: 'The peak near 50 °C agrees with the 55 °C reported by Raviyan et al., but at 60 °C the rate fell further than they report, possibly because…', job: 'What the findings mean, compared with published work: agreements and differences, explained.', lose: 'Describing the results again instead of discussing them.', chg: 'New: the longest section in most science essays.' },
      { n: 'Evaluation', st: 'evaluation', crit: 'D Discussion', tx: 'The main strength… The main limitation was… The sources were…', job: 'Strengths and limitations of the method and the sources, explained. Criterion D is worth 8 marks.', lose: 'Limitations listed but not explained.', chg: 'The sources are evaluated too, not only the method.' },
      { n: 'Conclusion', st: 'conclusion', crit: 'C Analysis', tx: 'Temperature affected the rate… to the extent that…', job: 'A synthesis that answers the question, not a repeat of the results.', lose: 'A new argument introduced at the end.', chg: 'It shrinks: the discussion has done the work.' },
      { n: 'References', st: 'sources', crit: 'integrity', tx: 'Every source cited, in one style, with access dates. AI output cited with the prompt and the date.', job: 'Author, date, title, pages where they apply, the access date and the URL.', lose: 'A source that cannot be traced.', chg: 'AI output must be cited with the prompt and the date.' },
      { n: 'Appendices', st: 'format', crit: 'not read', tx: 'Appendix 1: the full raw data (5 trials at each of 5 temperatures)', job: 'Allowed, but examiners are not required to read appendices.', lose: 'Anything the argument needs, placed here.', chg: 'New.' }
    ]}
  };
  WUL.SPECIMEN = P;

  WUL.specimen = function (host) {
    host.innerHTML = '';
    var L = WUL.level(), sel = 0;
    var bench = h('div', { class: 'bench' });
    var left = h('div', { class: 'bench__l' });
    var sheet = h('div', { class: 'spec sheet' });
    var rpf = h('div', { class: 'spec__rpf' });
    var panel = h('aside', { class: 'spec__panel', 'aria-live': 'polite' });
    left.appendChild(sheet); left.appendChild(rpf);
    bench.appendChild(left); bench.appendChild(panel);
    host.appendChild(bench);

    function draw() {
      var S = P[L];
      sheet.innerHTML = '<div class="spec__h"><span class="spec__name">' + esc(S.name) + '</span><span class="spec__len">' + esc(S.len) + '</span></div>';
      var list = h('div', { class: 'spec__parts' });
      S.parts.forEach(function (p, i) {
        var b = h('button', { type: 'button', class: 'spec__part', 'data-i': i, 'aria-pressed': i === sel ? 'true' : 'false' });
        b.innerHTML = '<span class="spec__pl"><span class="spec__pn">' + esc(p.n) + '</span>' + (p.crit ? '<span class="spec__crit">' + esc(p.crit) + '</span>' : '') + '</span>' +
          (p.html ? '<span class="spec__vis">' + p.html() + '</span>' : '<span class="spec__tx">' + md(p.tx, { inline: true }) + '</span>');
        list.appendChild(b);
      });
      sheet.appendChild(list);
      rpf.innerHTML = L === 'e' ? '<div class="spec__rpfk">Uploaded separately · Reflection and Progress Form</div><p>Three reflection sessions, the last one a <b>viva voce</b>, then one statement of up to 500 words. It is the <u>only</u> evidence for criterion E (Reflection, 4 marks). Criteria A–D judge the essay as a whole, so the tags on the sheet show where each one mostly lives.</p>' : '';
      rpf.hidden = L !== 'e';
      paint();
    }
    function paint() {
      var S = P[L], p = S.parts[sel], st = WUL.stations[p.st];
      sheet.querySelectorAll('.spec__part').forEach(function (b, i) { b.setAttribute('aria-pressed', i === sel ? 'true' : 'false'); });
      panel.innerHTML = '<div class="spec__pk">' + esc(S.name) + (p.crit ? ' · ' + esc(p.crit) : '') + '</div>' +
        '<h3 class="spec__pt">' + esc(p.n) + '</h3>' +
        '<dl><dt>Its job</dt><dd>' + md(p.job, { inline: true }) + '</dd>' +
        '<dt>Where marks are lost</dt><dd class="lose">' + md(p.lose, { inline: true }) + '</dd>' +
        (p.chg ? '<dt>What changed from the level below</dt><dd>' + md(p.chg, { inline: true }) + '</dd>' : '') + '</dl>' +
        (st ? '<a class="btn btn--go" href="#/part/' + esc(p.st) + '">Learn to write it →</a>' : '<span class="muted">This part is being written.</span>');
      place();
    }
    /* on a phone the explanation opens under the part that was tapped; on a wide screen it sits beside the sheet */
    function narrow() { return window.innerWidth < 980; }
    function place() {
      if (narrow()) {
        var b = sheet.querySelector('.spec__part[data-i="' + sel + '"]');
        if (b && b.nextSibling !== panel) b.parentNode.insertBefore(panel, b.nextSibling);
        panel.classList.add('spec__panel--in');
      } else if (panel.parentNode !== bench) {
        bench.appendChild(panel); panel.classList.remove('spec__panel--in');
      }
    }
    window.addEventListener('resize', function () { if (host.isConnected) place(); });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('.kw')) return;
      var b = e.target.closest('.spec__part'); if (!b) return;
      sel = +b.getAttribute('data-i'); paint();
      if (narrow()) panel.scrollIntoView({ behavior: WUL.reduced() ? 'auto' : 'smooth', block: 'nearest' });
    });
    WUL.onLevel(function (l) {
      if (!host.isConnected) return;
      var name = P[L].parts[sel].n; L = l;
      var idx = P[L].parts.findIndex(function (p) { return p.n === name; });
      sel = idx >= 0 ? idx : Math.min(sel, P[L].parts.length - 1);
      draw();
    });
    draw();
  };

  /* ============================================================
     WUL.reportMap — the home page. ONE report (IGCSE) laid out as two
     pages. Each part is a small tile; click it and it opens in place:
     the example, its job, where marks are lost, and buttons that show
     how the IB IA and the IB EE change it. Parts that exist only at IB
     sit on the same pages with a dashed outline.
     ============================================================ */
  function find(l, n) { return P[l].parts.filter(function (p) { return p.n === n; })[0] || null; }
  var R = [
    { page: 1, id: 'titlepage', st: 'format', lv: 'ie', name: 'Title page', kind: 'lines', i: 'Opening lines', e: 'Title page' },
    { page: 1, id: 'question', st: 'question', name: 'Title and question', kind: 'lines', g: ['Title', 'Aim or question'], i: 'Research question in context', e: 'Title page' },
    { page: 1, id: 'background', st: 'background', lv: 'ie', name: 'Background', kind: 'lines', i: 'Background', e: 'Introduction and literature' },
    { page: 1, id: 'hypothesis', st: 'hypothesis', name: 'Hypothesis', kind: 'lines', g: 'Hypothesis',
      iTxt: 'A hypothesis is optional in the IA: it is not in the four criteria. If you write one, answer the research question first in the conclusion, then add one sentence about the hypothesis.',
      eTxt: 'Science essays usually test a hypothesis. A result that does not support it is just as valid.' },
    { page: 1, id: 'variables', st: 'variables', name: 'Variables', kind: 'lines', g: 'Variables', i: 'Methodological choices',
      eTxt: 'Justify each choice from published research or from a pilot run.' },
    { page: 1, id: 'apparatus', st: 'apparatus', name: 'Apparatus', kind: 'lines', g: 'Apparatus',
      iTxt: 'State the uncertainty of every measuring instrument, for example ± 0.05 cm³ for a 10 cm³ pipette.' },
    { page: 1, id: 'safety', st: 'safety', name: 'Risk assessment', kind: 'grid', g: 'Risk assessment', i: 'Safety, ethics, environment',
      eTxt: 'The same as the IA. The IB experimentation rules apply: for example, no body fluids of any kind.' },
    { page: 1, id: 'method', st: 'method', name: 'Method', kind: 'list', g: 'Method', i: 'Method', e: 'Methodology' },
    { page: 2, id: 'table', st: 'tables', name: 'Results table', kind: 'table', g: 'Results table', i: ['Raw data', 'Processed data'],
      eTxt: 'Put the processed tables in the body. Most of the raw data goes in an appendix, which examiners do not have to read. Tables do not count towards the 4,000 words.' },
    { page: 2, id: 'calc', st: 'processing', name: 'Calculations', kind: 'lines',
      gEx: 'Mean time at 20 °C = (180 + 170 + 190) ÷ 3 = 180 s', gJob: 'Show how each processed value was worked out.', gLose: 'A mean with more decimal places than the raw data.', i: 'Processed data',
      eTxt: 'The same as the IA: one worked example of each calculation, in the body of the essay.' },
    { page: 2, id: 'graph', st: 'graphs', name: 'Graph', kind: 'graph', g: 'Graph', i: 'Graph', e: 'Results' },
    { page: 2, id: 'stats', st: 'stats', lv: 'ie', name: 'Statistics', kind: 'lines',
      iTxt: 'Optional in the IA. A t-test or a correlation, with the hypotheses named and one sentence on what the result means.', e: 'Analysis' },
    { page: 2, id: 'analysis', st: 'analysis', name: 'Data analysis', kind: 'lines', g: 'Data analysis', i: 'Analysis',
      eTxt: 'Your analysis must build an argument that leads to the answer to your research question.' },
    { page: 2, id: 'discussion', st: 'discussion', lv: 'e', name: 'Discussion', kind: 'lines', e: 'Discussion' },
    { page: 2, id: 'conclusion', st: 'conclusion', name: 'Conclusion', kind: 'lines', g: 'Conclusion', i: 'Conclusion', e: 'Conclusion' },
    { page: 2, id: 'evaluation', st: 'evaluation', name: 'Evaluation', kind: 'lines', g: 'Evaluation', i: 'Evaluation', e: 'Evaluation' },
    { page: 2, id: 'refs', st: 'sources', name: 'References', kind: 'lines',
      gEx: 'Urry, Lisa A., et al. *Campbell Biology*. 12th ed., Pearson, 2020.', gJob: 'List every source you used, in one style.', gLose: 'A bare web address with no author, title or date.', i: 'Bibliography', e: 'References' },
    { page: 2, id: 'appendix', st: 'format', lv: 'e', name: 'Appendices', kind: 'lines', e: 'Appendices' }
  ];
  function partHtml(p) { return p.html ? p.html() : '<p class="rm__tx">' + md(p.tx, { inline: true }) + '</p>'; }
  function preview(kind) {
    if (kind === 'table') return '<span class="sk sk--table" aria-hidden="true">' + new Array(13).join('<i></i>') + '</span>';
    if (kind === 'grid') return '<span class="sk sk--grid" aria-hidden="true">' + new Array(10).join('<i></i>') + '</span>';
    if (kind === 'graph') return '<svg class="sk sk--graph" viewBox="0 0 60 34" aria-hidden="true"><path d="M4 2V30H58" fill="none"/><path d="M8 6L20 16L32 24L44 27L56 19" fill="none" class="sk-l"/></svg>';
    if (kind === 'list') return '<span class="sk sk--list" aria-hidden="true"><i></i><i></i><i></i></span>';
    return '<span class="sk sk--lines" aria-hidden="true"><i></i><i></i><i></i></span>';
  }
  /* what the IB IA / IB EE changes, for one region */
  function diff(rg, l) {
    var txt = rg[l + 'Txt'], names = rg[l] ? (Array.isArray(rg[l]) ? rg[l] : [rg[l]]) : [];
    var ps = names.map(function (n) { return find(l, n); }).filter(Boolean);
    if (!txt && !ps.length) return null;
    var out = '';
    ps.forEach(function (p) { if (p.chg) out += '<p class="rm__chg"><b>What changes:</b> ' + md(p.chg, { inline: true }) + '</p>'; });
    if (txt) out += '<p class="rm__chg">' + md(txt, { inline: true }) + '</p>';
    ps.forEach(function (p) { out += '<p class="rm__job">' + md(p.job, { inline: true }) + '</p><div class="rm__ex rm__ex--' + l + '">' + partHtml(p) + '</div>'; });
    return out;
  }

  WUL.reportMap = function (host) {
    host.innerHTML = '';
    var pages = h('div', { class: 'rmap' });
    var titles = { 1: 'Page 1 · the plan', 2: 'Page 2 · the results and what they mean' };
    var cols = {};
    [1, 2].forEach(function (n) {
      var pg = h('div', { class: 'rpage sheet' });
      pg.appendChild(h('div', { class: 'rpage__h', html: '<span>' + esc(titles[n]) + '</span><span class="rpage__n">' + n + '</span>' }));
      var list = h('div', { class: 'rpage__list' });
      pg.appendChild(list);
      pages.appendChild(pg);
      cols[n] = list;
    });
    R.forEach(function (rg) {
      var ib = rg.lv && rg.lv.indexOf('g') < 0;
      var el = h('div', { class: 'rm' + (ib ? ' rm--ib' : ''), 'data-id': rg.id });
      var btn = h('button', { type: 'button', class: 'rm__tile', 'aria-expanded': 'false',
        html: '<span class="rm__name">' + esc(rg.name) + '</span>' + (ib ? WUL.ibTag(rg.lv) : '') + preview(rg.kind) });
      var body = h('div', { class: 'rm__body', hidden: true });
      el.appendChild(btn); el.appendChild(body);
      cols[rg.page].appendChild(el);
      btn.addEventListener('click', function () { toggle(el, rg); });
    });
    host.appendChild(pages);
    host.appendChild(h('p', { class: 'rmap__note', html: 'The Extended Essay also needs a <a href="#/part/reflection">reflection form</a> (500 words), uploaded on its own.' }));

    function fillBody(el, rg) {
      var body = el.querySelector('.rm__body');
      if (body.getAttribute('data-filled')) return;
      body.setAttribute('data-filled', '1');
      var ib = rg.lv && rg.lv.indexOf('g') < 0;
      var baseL = ib ? rg.lv.charAt(0) : 'g';
      var ex = '', job = '', lose = '';
      if (!ib) {
        var names = Array.isArray(rg.g) ? rg.g : (rg.g ? [rg.g] : []);
        var ps = names.map(function (n) { return find('g', n); }).filter(Boolean);
        ex = ps.length ? ps.map(partHtml).join('') : (rg.gEx ? '<p class="rm__tx">' + md(rg.gEx, { inline: true }) + '</p>' : '');
        job = ps.length ? ps[ps.length - 1].job : rg.gJob;
        lose = ps.length ? ps[ps.length - 1].lose : rg.gLose;
      } else {
        var bp = rg[baseL] ? find(baseL, rg[baseL]) : null;
        if (bp) { ex = partHtml(bp); job = bp.job; lose = bp.lose; }
        else { ex = ''; job = rg[baseL + 'Txt']; }
      }
      var html = '';
      if (ib) html += '<p class="rm__added">Added at ' + (baseL === 'e' ? 'the Extended Essay' : 'IB') + '. You do not need it at IGCSE.</p>';
      if (ex) html += '<div class="rm__ex">' + ex + '</div>';
      html += '<dl class="rm__dl">' + (job ? '<dt>What it does</dt><dd>' + md(job, { inline: true }) + '</dd>' : '') +
        (lose ? '<dt>Where marks are lost</dt><dd class="lose">' + md(lose, { inline: true }) + '</dd>' : '') + '</dl>';
      body.innerHTML = html;
      /* how the IB changes it */
      var diffs = h('div', { class: 'rm__diffs' });
      ['i', 'e'].forEach(function (l) {
        if (ib && l === baseL) return;
        var d = diff(rg, l);
        if (!d) return;
        var det = h('details', { class: 'rm__diff rm__diff--' + l });
        det.appendChild(h('summary', { html: (l === 'i' ? 'How the <b>IB IA</b> changes this' : 'How the <b>IB EE</b> changes this') }));
        det.appendChild(h('div', { class: 'rm__diffb lvscope-' + l, html: d }));
        diffs.appendChild(det);
      });
      if (diffs.children.length) body.appendChild(diffs);
      var st = WUL.stations[rg.st];
      var row = h('div', { class: 'rm__go' });
      if (st) row.appendChild(h('a', { class: 'btn btn--go', href: '#/part/' + rg.st, text: 'Learn this part →' }));
      var close = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Close' });
      close.addEventListener('click', function () { toggle(el, rg, false); el.querySelector('.rm__tile').focus(); });
      row.appendChild(close);
      body.appendChild(row);
    }
    function toggle(el, rg, force) {
      var open = force != null ? force : !el.classList.contains('is-open');
      host.querySelectorAll('.rm.is-open').forEach(function (o) {
        if (o === el) return;
        o.classList.remove('is-open'); o.querySelector('.rm__body').hidden = true; o.querySelector('.rm__tile').setAttribute('aria-expanded', 'false');
      });
      if (open) fillBody(el, rg);
      el.classList.toggle('is-open', open);
      el.querySelector('.rm__body').hidden = !open;
      el.querySelector('.rm__tile').setAttribute('aria-expanded', open ? 'true' : 'false');
      host.querySelector('.rmap').classList.toggle('has-open', !!host.querySelector('.rm.is-open'));
      if (open) {
        var y = el.getBoundingClientRect().top;
        if (y < 70 || y > window.innerHeight * 0.7) el.scrollIntoView({ block: 'start', behavior: WUL.reduced() ? 'auto' : 'smooth' });
      }
    }
    host.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var o = host.querySelector('.rm.is-open'); if (!o) return;
      var rg = R.filter(function (x) { return x.id === o.getAttribute('data-id'); })[0];
      toggle(o, rg, false); o.querySelector('.rm__tile').focus();
    });
  };
})(window.WUL);
