/* station: stats — which test when, the null hypothesis, what p means, and how to report a test.
   Every number below was computed and checked twice with node:
     t-test, IB amylase 40 °C (70, 80, 70, 80, 70) vs 50 °C (50, 50, 60, 50, 60):
       means 74 and 54 s; SD² = 30 exactly for both (SD 5.477 s); SE of the difference = √(30/5 + 30/5) = √12 = 3.464;
       t = 20 ÷ √12 = 5.77; df = 8; two-tailed p = 0.00042 (critical t at p = 0.05, df = 8: 2.306)
     woodlice 32 : 8 against 20 : 20: (O − E)²/E = 7.2 + 7.2, χ² = 14.4, df = 1, p = 0.00015 (critical 3.84)
     potato cylinders (0–1.0 mol dm⁻³): straight line of best fit r = −0.993, R² = 0.986 (residuals scatter, no curve) */
(function (WUL) {
  'use strict';
  /* inline markup; ± is kept on the same line as its number */
  var md = function (s) { return WUL.md(s, { inline: true }).replace(/± /g, '±\u00a0'); };
  function proseTable(head, rows) {
    var th = 'text-align:left;vertical-align:bottom;font:600 .86rem/1.35 var(--sans)';
    var td = 'text-align:left;vertical-align:top;font:400 .93rem/1.45 var(--sans)';
    return '<div class="tscroll"><table class="dt"><thead><tr>' + head.map(function (c) { return '<th style="' + th + '">' + md(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td style="' + td + (i === 0 ? ';font-weight:600' : '') + '">' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  var WHICH = proseTable(['Test', 'Use it to ask', 'Example'], [
    ['[[t-test]]', 'Do the means of __two__ groups of [[measurements|measured variable]] differ by more than chance would explain?', 'Mean time at 40 °C against 50 °C'],
    ['[[Chi-squared test|chi-squared test]]', 'Do the __counts__ in [[categories|categorical variable]] differ from the counts expected?', 'Woodlice on the damp and dry sides; a 9 : 3 : 3 : 1 ratio'],
    ['[[Correlation coefficient (r)|correlation coefficient]]', 'How strongly are __two__ [[measured variables|measured variable]] related, and in which direction?', 'Light intensity and moss cover in 20 quadrats'],
    ['[[Coefficient of determination (R²)|coefficient of determination]]', 'How well does a fitted trend line match the points?', 'Change in mass of potato against sucrose concentration']
  ]);
  function minus(v) { return String(v).replace('-', '−'); }
  var POTATO = [[0, 19.0], [0.2, 6.9], [0.4, 2.2], [0.6, -10.3], [0.8, -14.7], [1.0, -26.2]];   /* scatter about a straight line, no curve */
  var potato = {
    w: 460, h: 330, pad: { l: 62, r: 16, t: 14, b: 58 }, tickDpX: 1,
    x: { min: 0, max: 1, step: 0.2, minor: 4, label: 'Concentration of sucrose / mol dm⁻³' },
    y: { min: -30, max: 20, step: 5, minor: 5, label: 'Change in mass / %', fmt: minus },
    series: [{ id: 'p', pts: POTATO, mark: 'x', line: 'best' }],
    caption: 'Figure 1. Line graph showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the mean percentage change in mass of potato cylinders after 24 hours (n = 5), with a straight line of best fit (r = −0.99, R² = 0.99).'
  };

  /* a stage built only in the page (plot.js is not loaded by tools/check.mjs); the stub names its parts for the check */
  function lazy(build, names) {
    var stub = names.map(function (n) { return '<i data-el="' + n + '"></i>'; }).join('');
    return { get html() { return typeof WUL.plot === 'function' ? build() : stub; } };
  }
  /* a plot drawn whole: drop the reveal ids WUL.plot puts on every part, except those matching keep */
  function still(html, keep) {
    return html.replace(/ data-el="([^"]*)"/g, function (m, id) { return keep && keep.test(id) ? m : ''; });
  }

  /* ---------- heather and moss (Course Companion pp. 521–522), the association test ----------
     The table and, beside it, O against E as bars, as in Daniel's C4.1 slide. Each bar shares
     its data-el with its table cell, so a step lights both. */
  var HEATHER_TABLE = {
    cls: 'dt--tight',
    caption: 'Table 3. Raw and processed data showing the distribution of heather (*Calluna vulgaris*) and a moss (*Rhytidiadelphus squarrosus*) in 100 random quadrats on Caer Caradoc, England, with a chi-squared test for association.',
    head: [['', 'Heather present', 'Heather absent', 'Row total']],
    rows: [
      ['Hypotheses', { t: 'H₀: heather and moss are distributed independently. H₁: they are associated.', cs: 3, el: 'h0' }],
      ['Moss present: observed (O)', { t: '57', el: 'o-1' }, { t: '7', el: 'o-2' }, { t: '64', el: 'tot-1' }],
      ['Moss absent: observed (O)', { t: '9', el: 'o-3' }, { t: '27', el: 'o-4' }, { t: '36', el: 'tot-2' }],
      ['Column total', { t: '66', el: 'tot-3' }, { t: '34', el: 'tot-4' }, { t: '100', el: 'tot-5' }],
      ['Moss present: expected (E)', { t: '64 × 66 ÷ 100 = 42.2', el: 'e-1' }, { t: '64 × 34 ÷ 100 = 21.8', el: 'e-2' }, ''],
      ['Moss absent: expected (E)', { t: '36 × 66 ÷ 100 = 23.8', el: 'e-3' }, { t: '36 × 34 ÷ 100 = 12.2', el: 'e-4' }, ''],
      ['χ² = Σ (O − E)² ÷ E', { t: '5.19 + 10.05 + 9.20 + 17.95 = 42.4', cs: 3, el: 'chi' }],
      ['df', { t: '(2 − 1) × (2 − 1) = 1', cs: 3, el: 'df' }],
      ['Decision', { t: '42.4 > 3.84: the null hypothesis is rejected (p < 0.001)', cs: 3, el: 'dec' }]
    ]
  };
  var OE = { o: [57, 7, 9, 27], e: [42.2, 21.8, 23.8, 12.2] }, oeBars = [], oeTexts = [];
  OE.o.forEach(function (o, i) {
    var e = OE.e[i], d = Math.round((o - e) * 10) / 10, k = i + 1;
    oeBars.push({ at: i, off: -0.19, w: 0.36, v: o, tone: 'lvl', solid: true, el: 'o-' + k });
    oeBars.push({ at: i, off: 0.19, w: 0.36, v: e, dash: true, el: 'e-' + k });
    oeTexts.push({ x: i + 0.31, y: o, dy: -6, t: String(o), tone: 'lvl', el: 'o-' + k });
    oeTexts.push({ x: i + 0.69, y: e, dy: -6, t: e.toFixed(1), tone: 'grey', el: 'e-' + k });
    oeTexts.push({ x: i + 0.5, y: Math.max(o, e) + 9, t: (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1), tone: d > 0 ? 'green' : 'red', el: 'd-' + k });
  });
  var HEATHER_STAGE = lazy(function () { return '<div class="oe">' + WUL.table(HEATHER_TABLE) + '<div class="oe__fig">' +
    '<p class="oe__key"><span><span class="oe__sw"></span>observed (O)</span><span><span class="oe__sw oe__sw--e"></span>expected (E), if H₀ is true</span><span data-el="d-5">±14.8 = O − E</span></p>' +
    still(WUL.plot({
      w: 420, h: 320, pad: { l: 54, r: 8, t: 12, b: 56 },
      x: { cat: ['both', 'moss only', 'heather only', 'neither'], label: 'Species in the quadrat' },
      y: { min: 0, max: 70, step: 10, label: 'Number of quadrats' },
      bars: { items: oeBars }, texts: oeTexts,
      caption: 'Figure 2. Bar chart showing the distribution of the 100 quadrats among the four groups, observed (O) and expected (E).'
    }), /^[oed]-\d$/) + '</div></div>'; }, ['h0', 'o-1', 'o-2', 'o-3', 'o-4', 'tot-1', 'tot-2', 'tot-3', 'tot-4', 'tot-5', 'e-1', 'e-2', 'e-3', 'e-4', 'chi', 'df', 'dec', 'd-1', 'd-2', 'd-3', 'd-4', 'd-5']);

  /* ---------- Beyond the IB guide: the two conditions of a t-test ----------
     Drawn as in Daniel's C4.1 slides 52–55. Imagined heather heights: 66 quadrats in 5 cm
     classes (mean 33.3, SD 8.65); with moss 50 quadrats (mean 41.5, SD 3.85) and without
     moss 50 (mean 25.8, SD 3.89), 2 cm classes. The panes take turns in one place. */
  function hist(o) {
    var n = o.f.length, texts = [], k, b;
    for (k = 0; k <= n; k++) { b = o.lo + k * o.cw; if (b % o.every === 0) texts.push({ x: k, y: 0, dy: 18, t: String(b), cls: 'pl-tick' }); }
    return still(WUL.plot({
      w: o.w || 300, h: o.h || 290, pad: { l: 46, r: 10, t: 34, b: 48 }, title: o.title,
      x: { cat: o.f.map(function () { return ''; }), label: 'Height of heather / cm' },
      y: { min: 0, max: o.ymax, step: o.ystep, label: 'Number of quadrats' },
      bars: { touch: true, tone: o.tone, items: o.f.map(function (v) { return { label: '', v: v }; }) }, texts: texts
    }));
  }
  function bell(m, sd) {   /* expected quadrats per 2 cm class, from a normal curve: 50 × 2 × density */
    var pts = [], x;
    for (x = 10; x <= 60; x += 0.5) pts.push([x, 100 / (sd * Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(x - m, 2) / (2 * sd * sd))]);
    return pts;
  }
  function spread(title, sdWith, sdWithout) {
    return still(WUL.plot({
      w: 400, h: 265, pad: { l: 14, r: 12, t: 34, b: 48 }, title: title, paper: true,
      x: { min: 10, max: 60, step: 10, label: 'Height of heather / cm' },
      y: { min: 0, max: 20, step: 5, ticks: false },
      series: [{ id: 'n', pts: bell(26, sdWithout), mark: 'none', line: 'smooth', tone: 'ink' },
               { id: 'm', pts: bell(42, sdWith), mark: 'none', line: 'smooth', tone: 'green' }],
      texts: [{ x: 26, y: 100 / (sdWithout * 2.5066) + 1.2, t: 'without moss' }, { x: 42, y: 100 / (sdWith * 2.5066) + 1.2, t: 'with moss', tone: 'green' }]
    }));
  }
  var WITHOUT = [1, 2, 6, 7, 10, 11, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], WITH = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 8, 11, 9, 7, 4, 1, 1];
  var CHECKS_STAGE = lazy(function () { return '<div class="panes">' +
    '<div class="pane" data-el="nd"><div class="pane__one">' + hist({ w: 460, h: 280, title: 'Heather height in 66 quadrats: one bell', f: [1, 3, 7, 12, 16, 13, 8, 4, 2], lo: 10, cw: 5, every: 10, ymax: 20, ystep: 5, tone: 'lvl' }) + '</div></div>' +
    '<div class="pane" data-el="grp"><div class="pane-3">' +
      '<div>' + hist({ title: 'With moss: one bell ✓', f: WITH, lo: 16, cw: 2, every: 10, ymax: 12, ystep: 4, tone: 'green' }) + '</div>' +
      '<div>' + hist({ title: 'Without moss: one bell ✓', f: WITHOUT, lo: 16, cw: 2, every: 10, ymax: 12, ystep: 4 }) + '</div>' +
      '<div>' + hist({ title: 'Both mixed: two peaks', f: WITH.map(function (v, i) { return v + WITHOUT[i]; }), lo: 16, cw: 2, every: 10, ymax: 12, ystep: 4 }) + '</div>' +
    '</div></div>' +
    '<div class="pane" data-el="spr"><div class="pane-2">' +
      '<div>' + spread('Same spread ✓ (SD 4 and 4 cm)', 4, 4) + '</div>' +
      '<div>' + spread('Different spread ✗ (SD 2.5 and 8 cm)', 2.5, 8) + '</div>' +
    '</div></div>' +
    '<div class="pane" data-el="tst">' + WUL.table({
      head: [['', 'A normal distribution', 'A similar spread']],
      rows: [
        ['Look at', 'a histogram of each group: one bell?', 'the two SDs: is the larger less than twice the smaller?'],
        ['Test', 'Shapiro–Wilk test, on each group', 'F-test'],
        ['In R', 'shapiro.test(x)', 'var.test(x, y)'],
        ['In a spreadsheet', 'not built in', '=F.TEST(B2:B6, C2:C6)'],
        ['If it fails', { t: 'Mann–Whitney U test', el: 'tstf-1' }, { t: 'Welch’s t-test: =T.TEST(B2:B6, C2:C6, 2, 3)', el: 'tstf-2' }]
      ]
    }) + '</div>' +
  '</div>'; }, ['nd', 'grp', 'spr', 'tst', 'tstf-1', 'tstf-2']);

  WUL.station({
    id: 'stats', stage: 'show', order: 3, title: 'Statistical tests', levels: 'ie',
    job: 'Use a statistical test to judge whether a difference or a relationship is likely to be real, then report it in one line.',
    where: { i: 'Not a section of its own: inside your Data analysis, after the processed data and the graphs.', e: 'Not a section of its own: inside your analysis, where statistics are appropriate.' },

    ladder: {
      g: [],
      i: ['Choose the test that fits the data: a [[t-test]], a [[chi-squared test]] or a [[correlation coefficient]]', 'State the [[null hypothesis]] before the test', 'Report the test, the value, df and p, then one sentence of meaning'],
      e: ['Use statistics “where appropriate”, and justify the choice of test']
    },

    build: [
      { type: 'grid2', title: 'Choose the right test', items: [
        { label: 'Match the test to the data', v: { html: WHICH }, note: 'Tool 3 names the t-test and the chi-squared test, and asks you to interpret r and to apply R².' }
      ] },

      { type: 'widget', title: 'Find your test', name: 'test-chooser' },

      { type: 'steps', id: 'checks', title: 'Beyond the IB guide: check your data before a t-test',
        intro: 'The IB does not ask for this. But a t-test assumes two things about your data. If they are false, its p-value can mislead you, so check them first. Press Next step.',
        stage: CHECKS_STAGE,
        steps: [
          { title: 'Condition 1: a normal distribution', show: ['nd'], focus: [], text: 'A [[normal distribution]] is one bell: most values near the middle, fewer and fewer towards both ends, and the two sides roughly the same. These heather heights from 66 quadrats form one bell (imagined data).' },
          { title: 'Check each group on its own', show: ['grp'], hide: ['nd'], focus: [], text: 'A t-test compares two groups, so check each group separately. Heather with moss forms one bell (mean about 42 cm). Heather without moss forms another (about 26 cm). Mixed together, the same 100 heights have two peaks: that only shows the groups differ.' },
          { title: 'Condition 2: a similar spread', show: ['spr'], hide: ['grp'], focus: [], text: 'The standard t-test also needs a similar spread in both groups: similar standard deviations (SD). This is called [[homoscedasticity]]. A rule of thumb: the larger SD is less than twice the smaller. Left: 4 and 4 cm, fine. Right: 8 cm is more than twice 2.5 cm.' },
          { title: 'The two tests', show: ['tst', 'tstf'], hide: ['spr'], focus: [], text: 'Each condition has its own test. In both, H₀ says the condition is met, so p > 0.05 means no evidence of a problem, not proof. With only 5 values in a group, no histogram or test can show much: say in your evaluation that a normal distribution was assumed.' },
          { title: 'If a check fails', show: [], focus: ['tstf'], text: 'Not normal: use the Mann–Whitney U test. Different spreads: use Welch’s t-test, which does not need a similar spread. A χ² test needs neither check, because it uses counts in categories. It needs every expected count to be at least 5.' }
        ] },

      { type: 'anatomy', title: 'How to report a test',
        intro: 'A test does not prove anything. Its p-value says how often chance alone would give a difference this large ([what p means](https://nlcsbiology.com/write-up-lab/#/part/stats/build/pvalue)). Report it in four parts.',
        model: '{1:The null hypothesis was that there is no difference between the mean time at 40 °C and at 50 °C.} {2:A [[two-tailed|two-tailed test]] t-test} gave {3:t = 5.77, df = 8, p < 0.001}. {4:The null hypothesis was rejected: the mean time at 50 °C (54 s) was significantly shorter than at 40 °C (74 s).}',
        parts: [
          { n: 1, name: 'The null hypothesis', note: 'What “no effect” would look like. State it before the test.' },
          { n: 2, name: 'The test', note: 'Its name. [[Two-tailed|two-tailed test]]: a difference in either direction counts. That is the normal choice.' },
          { n: 3, name: 'The numbers', note: 'The value, the degrees of freedom (df) and p.' },
          { n: 4, name: 'The meaning', note: 'One sentence in words, with the means and their units.' }
        ] },

      /* THE p-value explanation of the site: everything else is one line and a link here (#/part/stats/build/pvalue) */
      { type: 'rules', id: 'pvalue', title: 'What the p-value means', items: [
        { t: '__An example:__ an enzyme digests starch in a mean of 74 s at 40 °C, and 54 s at 50 °C. That is 20 s faster. Is the difference real, or just chance?', icon: '?' },
        { t: '__Pretend:__ temperature does nothing, so the 20 s difference is just chance. This is the [[null hypothesis]].', icon: '1' },
        { t: '__Check:__ in that pretend world, how often would chance alone give a difference as big as 20 s? That number is the **p-value**. Here p = 0.0004: 4 times in 10,000. (The worked t-test below shows how it is found.)', icon: '2' },
        { t: '__Decide:__ almost never? Then stop pretending: the difference is [[statistically significant]]. The line is 0.05, or 5 times in 100. At 0.05 or above, keep pretending: not significant, which does not show that there is no difference.', icon: '3' },
        { t: '__To remember:__ “Too rare for chance? Stop pretending.”', icon: '★' },
        { t: 'p is __never__ the chance that your hypothesis is right.', icon: '!' }
      ] },

      { type: 'steps', title: 'A worked t-test',
        intro: 'The IB amylase data, five trials at each temperature. Press Next step.',
        stage: { table: {
          caption: 'Table 1. Processed data showing the effect of temperature (40.0 and 50.0 °C) on the time taken for fungal α-amylase to digest starch, with a two-tailed t-test (n = 5).',
          head: [['', '40 °C', '50 °C']],
          rows: [
            ['Null hypothesis', { t: 'No difference between the two mean times', cs: 2, el: 'h0' }],
            ['Times / s', '70, 80, 70, 80, 70', '50, 50, 60, 50, 60'],
            ['Mean / s', { t: '74', el: 'mean-1' }, { t: '54', el: 'mean-2' }],
            ['SD / s', { t: '5.5', el: 'sd-1' }, { t: '5.5', el: 'sd-2' }],
            ['t', { t: '(74 − 54) ÷ √(30/5 + 30/5) = 20 ÷ √12 = 5.77', cs: 2, el: 't' }],
            ['df', { t: '5 + 5 − 2 = 8', cs: 2, el: 'df' }],
            ['p', { t: '0.0004', cs: 2, el: 'p' }],
            ['Decision', { t: 'p < 0.05: the null hypothesis is rejected', cs: 2, el: 'dec' }]
          ]
        } },
        steps: [
          { title: 'State the null hypothesis', show: ['h0'], text: 'Before testing, say what “no effect” would look like: there is no difference between the mean time at 40 °C and at 50 °C.' },
          { title: 'Find the two means', show: ['mean-1', 'mean-2'], text: '74 s at 40 °C and 54 s at 50 °C: a difference of 20 s.' },
          { title: 'Find the two standard deviations', show: ['sd-1', 'sd-2'], text: 'Both are 5.5 s. Their spreads are similar, which this t-test needs. Keep the unrounded value: SD² = 30 exactly.' },
          { title: 'Calculate t', show: ['t'], text: '**t** compares the difference with chance. The top of the fraction is the difference between the means: 20 s. The bottom is the size of difference that chance alone typically makes, from the spreads (SD) and the number of trials (n): √(30/5 + 30/5) = 3.46 s. So t = 20 ÷ 3.46 = 5.77: the difference is almost 6 times bigger than chance typically makes.' },
          { title: 'Find the degrees of freedom', show: ['df'], text: 'For two groups, df = n₁ + n₂ − 2 = 5 + 5 − 2 = 8.' },
          { title: 'Two tails: either direction', show: [], focus: ['h0'], text: 'The null hypothesis says “no difference”. A real difference could go either way: 50 °C could be faster, or slower, than 40 °C. So a large t at __either__ end, or tail, of the chance results counts. That makes the test **two-tailed**. It is the normal t-test: spreadsheets and R do it unless you ask for something else.' },
          { title: 'Find p, and decide', show: ['p', 'dec'], text: 'In a spreadsheet, =T.TEST(B2:B6, C2:C6, 2, 2) gives p directly ([what p means](https://nlcsbiology.com/write-up-lab/#/part/stats/build/pvalue)). The first 2 means two tails. The second 2 means two separate groups with similar spreads. With a table of critical values: for df = 8, t must be above 2.31 for p < 0.05. Here t is 5.77.' }
        ] },

      { type: 'grid2', title: 'Two tails or one?', items: [
        { label: 'Two-tailed: the normal t-test', tone: 'g', v: { html: WUL.tailsSvg('two') }, note: 'A difference __either way__ counts. The rarest 5 % of chance results is split: 2.5 % at each end. Use this one.' },
        { label: 'One-tailed', v: { html: WUL.tailsSvg('one') }, note: 'Only one direction counts: all 5 % at one end. Only if you predicted the direction before collecting any data. Rare in an IA.' }
      ] },

      { type: 'grid2', title: 'Significant or not? Where t lands', intro: 'The red tails: with no real difference, chance lands there only 5 times in 100. So t in the red means p < 0.05: significant. [What p means](https://nlcsbiology.com/write-up-lab/#/part/stats/build/pvalue).', items: [
        { label: 'Not significant', tone: 'red', v: { html: WUL.tailsSvg('two', 1.15) }, note: 'Means of 70 s and 74 s: t = 1.15, in the white. p = 0.28: __not significant__.' },
        { label: 'Significant', tone: 'g', v: { html: WUL.tailsSvg('two', 5.77) }, note: 'Means of 54 s and 74 s: t = 5.77, beyond the red. p = 0.0004: __significant__.' }
      ] },

      { type: 'table', title: 'A worked chi-squared test: a choice (goodness of fit)',
        spec: {
          caption: 'Table 2. Raw and processed data showing the effect of humidity (damp or dry side) on the number of woodlice on each side of a choice chamber after 10 minutes (n = 40), with a chi-squared test.',
          head: [['', 'Damp side', 'Dry side', 'Total']],
          rows: [
            ['Observed count (O)', '32', '8', '40'],
            ['Expected count (E)', '20', '20', '40'],
            ['(O − E)² ÷ E', '7.2', '7.2', 'χ² = 14.4']
          ]
        },
        after: 'Null hypothesis: the woodlice show no preference, so 20 are expected on each side. With two categories, df = 2 − 1 = 1. For df = 1, χ² must be above 3.84 for p < 0.05. Here χ² = 14.4, so the null hypothesis is rejected (p < 0.001).' },

      { type: 'steps', title: 'A worked chi-squared test: two species (association)',
        intro: 'The other use of χ²: are two species found together more often than chance? This is the ecology test (C4.1.15). The data are the Course Companion’s: heather and a moss in 100 random quadrats. Press Next step.',
        always: ['o-1', 'o-2', 'o-3', 'o-4'],
        stage: HEATHER_STAGE,
        steps: [
          { title: 'State the hypotheses', show: ['h0'], text: 'H₀: heather and moss are distributed independently, so finding one tells you nothing about the other. H₁: the two species are associated.' },
          { title: 'Count the four groups', show: ['tot'], focus: ['o', 'tot'], text: 'Ask two questions of each quadrat: heather? moss? That sorts the 100 quadrats into four groups: both (57), moss only (7), heather only (9) and neither (27). Then add the row and column totals.' },
          { title: 'Calculate the expected counts', show: ['e'], text: 'If H₀ is true, heather is as common in the moss quadrats as everywhere else. Heather grows in 66 of the 100 quadrats, so 66 % of the 64 moss quadrats should have it: 64 × 66 ÷ 100 = 42.2. For every cell: row total × column total ÷ grand total. Each E must be at least 5.' },
          { title: 'Compare O with E', show: ['d'], focus: ['o-1', 'e-1', 'o-4', 'e-4', 'd'], text: 'Both species: 57 observed, 42.2 expected, so O − E = +14.8. Neither: 27 against 12.2, also +14.8. Each species alone: 14.8 fewer than expected. So the two are found together more often than chance predicts. Is the gap too big for chance?' },
          { title: 'Calculate χ²', show: ['chi'], text: 'For each cell, (O − E)² ÷ E. Squaring stops the + and − gaps cancelling out. Dividing by E compares each gap with its expected size. Add the four: χ² = 42.4. (A spreadsheet or R keeps E unrounded and gives 42.1.)' },
          { title: 'Find the degrees of freedom', show: ['df'], text: 'df = (rows − 1) × (columns − 1) = (2 − 1) × (2 − 1) = 1. Once the totals are fixed, one count decides the other three.' },
          { title: 'Decide', show: ['dec'], text: 'For df = 1, χ² must be above 3.84 for p < 0.05. Here χ² = 42.4, so H₀ is rejected: heather and moss are significantly associated. The association is positive: they are found together more often than expected.' },
          { title: 'What it does not show', show: [], focus: ['dec'], text: 'An association is not a cause. The moss may need the shade and damp under the heather, or both may avoid the paths trampled by walkers. Only an experiment, such as removing the heather, could test a cause.' }
        ] },

      { type: 'plot', title: 'Correlation and R²', spec: potato,
        after: 'r = −0.99: a strong negative [[correlation]]. R² = 0.99: the straight line explains 99 % of the variation in the change in mass. Use R² only with a fitted trend line.' },

      { type: 'compare', title: 'Correlation is not causation',
        bad: 'Ponds with more water lilies had more frogs (r = 0.82), ==so water lilies cause the number of frogs to increase==.',
        good: 'There was a strong positive correlation between the number of water lilies and the number of frogs (r = 0.82). ==Both may depend on a third variable, such as the area of the pond.==',
        badLabel: 'Claims a cause', goodLabel: 'Correlation only',
        why: 'A [[correlation]] shows that two variables change together. [[Causation|causation]] needs a controlled experiment, in which only one variable is changed.' },

      { type: 'note', tone: 'ib', label: 'Do it in R', title: 'Run these tests yourself, in R',
        md: 'Every test on this page can be done in R, the free programming language scientists use to analyse data. [Learn R](https://nlcsbiology.com/learn-r/) runs real R in your browser, so there is nothing to install. [Statistics in R](https://nlcsbiology.com/learn-r/ib.html) explains the p-value step by step, then χ², the t-test and correlation. [Starch curves in R](https://nlcsbiology.com/learn-r/starch.html) fits a calibration curve and explains what R² tells you.' },

      { type: 'note', tone: 'ib', title: 'What the IB guide asks', label: 'What the IB guide asks', md: 'Tool 3 lists “Apply the t-test” and “Apply the chi-squared test”, and asks you to “Interpret values of the correlation coefficient (r)”. D3.2.21 adds the p = 0.05 level and the null hypothesis. No criterion requires a test in every IA: use one where it answers your question.' },

      { type: 'frames', title: 'Sentences to report a test', items: [
        'The null hypothesis was that there is no difference between ___ and ___.',
        'A ___ gave ___ = ___, df = ___, p ___ 0.05.',
        'The null hypothesis was ___, so the difference between ___ and ___ is ___.',
        'There was a ___ correlation between ___ and ___ (r = ___), but this does not show that ___ causes ___.'
      ] }
    ],

    redpen: {
      i: {
        title: 'An IA analysis. Five phrases would lose marks.',
        body: '[!e:A t-test was carried out on the data.] It [!a:proved] that the mean time at 50 °C was shorter than at 40 °C [!b:(t = 5.77)]. [!c:So there is a 95 % chance that the hypothesis is correct.] [!d:t-tests were also run between all ten pairs of temperatures, and the most different pair was reported.]',
        notes: {
          e: { label: 'H₀?', why: 'Say what was compared, and state the null hypothesis: there is no difference between the mean time at 40 °C and at 50 °C.' },
          a: { label: '“proved”?', why: 'A test never proves. Write “showed a significant difference”, or “the null hypothesis was rejected”.' },
          b: { label: 'df? p?', why: 'Report the value, the degrees of freedom and p: t = 5.77, df = 8, p < 0.001.' },
          c: { label: 'wrong meaning', why: 'p < 0.05 means: if there were no real difference, a difference this large would happen by chance less than 5 % of the time.' },
          d: { label: 'too many tests', why: 'With many tests at p = 0.05, about 1 in 20 looks significant by chance alone. Plan one comparison before you collect the data. To test several pairs, apply a [[correction for multiple comparisons]]: with 10 tests, each p must be below 0.005 (0.05 ÷ 10).' }
        },
        fixed: '==The null hypothesis was that there is no difference between the mean time at 40 °C and at 50 °C.== A [[two-tailed|two-tailed test]] t-test ==showed== that the mean time at 50 °C (54 s) was significantly shorter than at 40 °C (74 s) ==(t = 5.77, df = 8, p < 0.001)==. ==If there were no real difference, a difference this large would arise by chance less than 0.1 % of the time.== ==This one comparison was planned before the data were collected.== It tests whether the rate still rises between 40 °C and 50 °C, below the published optimum of 55 °C.',
        fixedNote: 'The null hypothesis, the full numbers, a correct meaning of p, and one planned comparison.'
      }
    },

    traps: [
      { bad: 'The t-test proved the hypothesis.', good: 'The t-test showed a significant difference (t = 5.77, df = 8, p < 0.001).' },
      { bad: 'p < 0.05, so there is a 95 % chance the hypothesis is right.', good: 'p < 0.05: chance alone would give a difference this large less than 5 % of the time.' },
      { bad: 't = 5.77.', good: 't = 5.77, df = 8, p < 0.001, then one sentence of meaning.' },
      { bad: 'A strong correlation, so one variable causes the other.', good: 'A strong correlation (r = 0.82). A third variable may explain both.' },
      { bad: 'Chi-squared on percentages: 80 % and 20 %.', good: 'Chi-squared on the counts themselves: 32 and 8 woodlice.' },
      { bad: 't-tests between every pair, reporting the most different.', good: 'One comparison, planned before the data were collected. Or, for several pairs, a [[correction for multiple comparisons]].' }
    ],

    test: [
      { type: 'choose', q: 'Woodlice are placed in a choice chamber. After 10 minutes there are 32 on the damp side and 8 on the dry side. Which test?',
        opts: [
          { t: 'A chi-squared test', ok: true, why: 'Counts in two categories, compared with the 20 : 20 expected if they had no preference.' },
          { t: 'A t-test', why: 'A t-test compares the means of measurements. These are counts.' },
          { t: 'A correlation coefficient', why: 'A correlation needs two measurements on each individual.' },
          { t: 'No test: 32 is bigger than 8', why: 'Chance alone can give uneven counts. A test says how likely that is.' }
        ] },
      { type: 'choose', q: 'You compare the mean time for amylase at 40 °C and at 50 °C, with five trials at each. Which test?',
        opts: [
          { t: 'A t-test', ok: true, why: 'Two groups of measurements, and the question is about their means.' },
          { t: 'A chi-squared test', why: 'Chi-squared needs counts in categories. Times are measurements.' },
          { t: 'R²', why: 'R² says how well a trend line fits. Here you compare two means.' },
          { t: 'The range', why: 'The range describes spread. It is not a test.' }
        ] },
      { type: 'sort', q: 'Sort each study by the test it needs.',
        bins: ['t-test', 'Chi-squared test', 'Correlation'],
        items: [
          { t: 'Mean shell length of limpets on two shores', bin: 0, why: 'Two groups of measurements: compare the means.' },
          { t: 'Numbers of purple and white flowers, against a 3 : 1 ratio', bin: 1, why: 'Counts in categories, against expected counts.' },
          { t: 'Light intensity and moss cover in 20 quadrats', bin: 2, why: 'Two measurements in each quadrat: a relationship.' },
          { t: 'Mean height of seedlings in soil A and in soil D', bin: 0, why: 'Two groups of measurements: compare the means.' },
          { t: 'Snails with and without bands, counted on grass and on sand', bin: 1, why: 'Counts in categories: a test for association.' }
        ] },
      { type: 'choose', q: 'What is the null hypothesis for the amylase t-test?',
        opts: [
          { t: 'There is no difference between the mean time at 40 °C and at 50 °C.', ok: true, why: 'The null hypothesis always says “no difference” or “no relationship”.' },
          { t: 'The time at 50 °C is shorter than at 40 °C.', why: 'That is the effect you expect: the alternative hypothesis.' },
          { t: 'Amylase is denatured at 50 °C.', why: 'That is a biological claim, and 50 °C is close to this enzyme’s optimum.' },
          { t: 'The t-test will be significant.', why: 'The null hypothesis describes no effect. It does not predict the result of the test.' }
        ] },
      { type: 'choose', q: 'A t-test gives p = 0.02. What does this mean?',
        opts: [
          { t: 'If there were no real difference, a difference this large would happen by chance only 2 % of the time.', ok: true, why: 'p is calculated as if the null hypothesis were true.' },
          { t: 'There is a 98 % chance that the hypothesis is right.', why: 'p is not the probability that a hypothesis is true.' },
          { t: 'The two means differ by 2 %.', why: 'p is a probability, not the size of the difference.' },
          { t: 'The results are 98 % accurate.', why: 'p says nothing about accuracy.' }
        ] },
      { type: 'choose', q: 'A t-test compares two groups of five trials. How many degrees of freedom?',
        opts: [
          { t: '8', ok: true, why: 'df = n₁ + n₂ − 2 = 5 + 5 − 2 = 8.' },
          { t: '10', why: 'Subtract 2: one for each group.' },
          { t: '4', why: 'That is for one group. Two groups give 5 + 5 − 2.' },
          { t: '9', why: 'Subtract one for each of the two groups: 10 − 2 = 8.' }
        ] },
      { type: 'choose', q: 'A cross gives 100 offspring, expected in a 3 : 1 ratio. What are the expected counts?',
        opts: [
          { t: '75 and 25', ok: true, why: 'Three quarters and one quarter of 100.' },
          { t: '3 and 1', why: 'Expected values are counts: 3/4 and 1/4 of the total.' },
          { t: '50 and 50', why: 'That is an even spread, not 3 : 1.' },
          { t: '72 and 28', why: 'Those look like observed counts. Expected counts come from the ratio.' }
        ] },
      { type: 'spot', q: 'Tap the three mistakes.',
        text: 'A t-test gave t = 5.77, df = 8, p < 0.001. [!a:This proves the hypothesis.] [?:The mean time at 50 °C was significantly shorter than at 40 °C.] In the field study, moss cover and light intensity [?:were strongly correlated (r = −0.86)], [!b:so light intensity causes moss cover to decrease]. [!c:The chi-squared test was done on the percentages.]',
        why: { a: 'A test never proves: write “the null hypothesis was rejected”.', b: 'A correlation does not show causation. Another variable, such as how damp the ground is, may explain both.', c: 'Chi-squared needs the counts themselves, never percentages.' } },
      { type: 'build', q: 'Build the report line for the woodlice test.',
        chips: ['A chi-squared test gave', 'χ² = 14.4,', 'df = 1,', 'p < 0.001:', 'more woodlice were found on the damp side than expected by chance.', 'which proves that woodlice like damp.', 't = 14.4,'],
        answer: ['A chi-squared test gave', 'χ² = 14.4,', 'df = 1,', 'p < 0.001:', 'more woodlice were found on the damp side than expected by chance.'],
        why: 'The test, the value, df and p, then one sentence of meaning, with no claim of proof.' },
      { type: 'choose', q: 'In Figure 1 the straight line has R² = 0.99. What does this tell you?',
        show: { plot: potato },
        opts: [
          { t: 'The line explains about 99 % of the variation in the change in mass.', ok: true, why: 'R² measures how well the trend line fits the points.' },
          { t: 'The results are 99 % accurate.', why: 'R² says nothing about accuracy. It measures how well the line fits.' },
          { t: 'There is a 99 % chance that the hypothesis is right.', why: 'R² is not a probability.' },
          { t: 'The line may be extended beyond 1.0 mol dm⁻³.', why: 'A good fit does not allow you to go beyond the data.' }
        ] }
    ],

    words: [
      { term: 'two-tailed test', forms: ['two-tailed', 'two tails', 'two-tailed t-test'], def: 'A test in which a difference in either direction counts: it looks at both ends, or tails, of the chance results. The normal choice, and the default in spreadsheets and in R.', eg: '=T.TEST(B2:B6, C2:C6, 2, 2): the first 2 means two tails.', fig: 'tails' },
      { term: 'measured variable', forms: ['measured variables', 'measurement', 'measurements'], def: 'A variable recorded as a number: measured on a scale (continuous) or counted (discrete).', eg: 'Time in s; the number of stomata in a field of view.', fig: 'data', hi: 'quant' },
      { term: 'discrete variable', forms: ['discrete variables', 'discrete', 'discrete data'], def: 'A numerical variable that can take only separate values, usually whole-number counts.', eg: 'The number of seeds in a pod: 4 or 5, never 4.5.', fig: 'data', hi: 'discrete' },
      { term: 't-test', forms: ['t-tests', 't test', "Student's t-test"], def: 'A statistical test of whether the means of two groups differ by more than chance would explain. Its value, t, is the difference divided by the size of difference that chance alone typically makes.', eg: 'Mean time at 40 °C (74 s) against 50 °C (54 s): t = 5.77.' },
      { term: 'chi-squared test', forms: ['chi-squared', 'chi-squared tests', 'chi-square test', 'χ² test'], def: 'A statistical test that compares observed counts in categories with the counts expected. It has two uses: a choice or a ratio (goodness of fit), and two species found together (association).', eg: 'Woodlice: 32 damp and 8 dry, against 20 and 20 expected. Heather and moss together in 57 of 100 quadrats, against 42.2 expected.' },
      { term: 'null hypothesis', forms: ['null hypotheses', 'H₀'], def: 'The statement that there is no difference or no relationship, which a statistical test may reject.', eg: 'There is no difference between the mean time at 40 °C and at 50 °C.' },
      { term: 'p-value', forms: ['p value', 'p-values'], def: 'Pretend there is no real difference: p is how often chance alone would then give a difference as big as yours. Below 0.05: significant. [More](https://nlcsbiology.com/write-up-lab/#/part/stats/build/pvalue)', eg: 'p = 0.0004: 4 times in 10,000.' },
      { term: 'normal distribution', forms: ['normal distributions', 'normally distributed', 'normality', 'bell-shaped'], def: 'A spread of values shaped like one bell: most values near the mean, fewer and fewer towards both ends, the two sides roughly the same. The t-test assumes it in each group.', eg: 'Heather heights in 66 quadrats: most near 33 cm, few below 15 cm or above 50 cm.' },
      { term: 'homoscedasticity', forms: ['homoscedastic', 'equal variance', 'equal variances', 'similar spread'], def: 'When groups have a similar spread: similar standard deviations. The standard t-test assumes it; Welch’s t-test does not.', eg: 'SD 4 cm and 4 cm: similar. SD 2.5 cm and 8 cm: not similar.' },
      { term: 'correction for multiple comparisons', forms: ['corrections for multiple comparisons', 'multiple comparisons', 'Bonferroni correction'], def: 'A stricter line for p when you run several tests on the same data, so a false “significant” result stays rare. The simplest is the Bonferroni correction: divide 0.05 by the number of tests. With 10 tests, each p must be below 0.005.' },
      { term: 'correlation coefficient', forms: ['correlation coefficients', 'r', "Pearson's r"], def: 'A number, r, from −1 to +1, showing the strength and direction of a straight-line relationship.', eg: 'r = −0.99 for potato mass change and sucrose concentration.' },
      { term: 'coefficient of determination', forms: ['R²', 'R2', 'R squared'], def: 'R², from 0 to 1: how well a trend line fits, as the fraction of the variation it explains.', eg: 'R² = 0.99: the line explains 99 % of the variation.' },
      { term: 'statistically significant', forms: ['significant', 'significantly', 'statistical significance', 'significance'], def: 'A result that chance alone would rarely give if there were no real difference: p below 0.05.', eg: 'The mean time at 50 °C was significantly shorter (p < 0.001).' },
      { term: 'correlation', forms: ['correlations', 'correlated', 'positive correlation', 'negative correlation'], def: 'A relationship in which one variable changes as another changes.', eg: 'Ponds with more water lilies had more frogs.' },
      { term: 'causation', forms: ['causal relationship', 'cause and effect'], def: 'When a change in one variable directly produces a change in another.', eg: 'A controlled experiment shows that temperature changes the rate of amylase activity.' }
    ],

    further: [
      { title: 'Why is it called t?',
        md: 'The t-test was published in 1908 by William Gosset, a scientist at the Guinness brewery in Dublin. The brewery asked its staff to use pen names, so he signed it “Student”: that is why it is also called __Student’s t-test__. The letter t itself has no agreed meaning. What matters is what t measures: how many times bigger your difference is than the difference chance typically makes.',
        cite: 'Student. “The Probable Error of a Mean.” *Biometrika*, vol. 6, no. 1, 1908, pp. 1–25.' },
      { title: 'Comparing three or more groups: ANOVA',
        md: 'To compare three or more means in one test, biologists use analysis of variance (ANOVA). It tests all the groups together, so the chance of a false “significant” result stays at 5 %. If ANOVA finds a difference, a second test shows which groups differ, and it corrects for multiple comparisons itself. You do not need any of this for the IB, but you will see it in university research papers.',
        cite: 'Whitlock, Michael C., and Dolph Schluter. *The Analysis of Biological Data*. 3rd ed., Macmillan Learning, 2020.' }
    ],

    sources: ['IB Biology guide (2025), Tool 3, pp. 30–31', 'IB Biology guide (2025), D3.2.21, C4.1.15 and C2.2.4', 'IB Extended essay guide (first assessment 2027), guidance for the sciences', 'Allott, A. and Mindorff, D. (2023) Biology Course Companion, Oxford University Press, pp. 521–522: the heather and moss chi-squared test']
  });
})(window.WUL);
