/* ============================================================
   widget: test-chooser — "Which test?"

   Follows Daniel's guide 8, "Which statistical test?" (27 Nov 2026: NLCS/Lab reports-IA-EE/
   8) Statistics Decision Tree - Biology IB.pdf; every word is in its source,
   Sources/8) Statistics Decision Tree/build_tree.py): the same three lines (a difference,
   a relationship, counts), the same situations, the same checks and the same labels. A test
   that Tool 3 of the IB guide names (the t-test, χ², r and R²) carries "IB · Tool 3"; every
   other test carries "Beyond the IB guide", in the one extension violet (--ext).

   Part 1: plain questions lead to a test. The end card gives the test, the check it needs and
   where that check goes (each group on its own; the differences for a paired t-test; the
   residuals for Pearson's r; never all the raw data in one pile), the rank test to use if the
   check fails, what its null hypothesis would say, and a sentence for the report.
   Every number was computed in R (27 Nov 2026):
     Welch's t-test, amylase 40 vs 50 °C (70, 80, 70, 80, 70 v 50, 50, 60, 50, 60):
       t = 5.77, df = 8.00, p = 0.00042, the same as Student's here (equal n, equal SD)
     paired t-test, stomata per field of view on the lower and the upper surface of 8 leaves
       (15, 19, 12, 17, 18, 21, 14, 16 v 4, 7, 3, 6, 5, 8, 4, 6): mean difference 11.1,
       t = 21.6, df = 7, p = 1.2 × 10⁻⁷ (Shapiro–Wilk on the differences: p = 0.52)
     one-sample t-test, pH of 12 pond-water samples (6.4, 6.7, 6.5, 6.9, 6.6, 6.3, 6.8, 6.5,
       6.6, 6.7, 6.4, 6.6) against 7.0: mean 6.6 (6.58), t = −8.25, df = 11, p = 4.9 × 10⁻⁶
       (Shapiro–Wilk: p = 0.95)
     one-way ANOVA, seedlings in soils A–D (WUL.data.soils: n = 10, means 43.0, 43.6, 44.0,
       44.3 cm, SD 1.4, 1.6, 1.3, 1.5): F = 1.49, df = 3 and 36, p = 0.23, so no test of the
       pairs; the largest SD ÷ the smallest = 1.23
     Pearson, light intensity and moss cover in 20 quadrats (r = −0.86, as in the Statistics
       station's spot question): t = −7.15, df = 18, p = 1.2 × 10⁻⁶; R² = 0.74
     Spearman, light intensity (0, 100, 200, 400, 600, 800, 1000, 1200 lux) and the rate of
       photosynthesis (0.0, 2.1, 3.8, 6.0, 7.1, 7.4, 7.3, 7.6 cm³ of oxygen per hour):
       rₛ = 0.976, exact p = 0.0004
     woodlice 32 : 8 against 20 : 20: χ² = 14.4, df = 1, p = 0.00015
     heather and moss in 100 quadrats (57 / 7 / 9 / 27, Course Companion pp. 521–522):
       χ² = 42.4 with E rounded to 1 d.p. (42.1 unrounded), df = 1, p < 0.001
     the smallest n for a rank test to reach p < 0.05 (exact, two-tailed): Mann–Whitney 4 + 4
       (p = 0.029) or 3 + 5 (0.036); Wilcoxon signed-rank 6 (0.031); Spearman 5 (0.017)
     10 t-tests between the pairs of 5 groups with no real difference: at least one p < 0.05
       in 27 % (n = 5) and 28 % (n = 10) of 20,000 simulations. 1 − 0.95¹⁰ = 40 % holds only
       for independent tests, so the tool says "more than 25 %", never "about 40 %".
   Part 2: six studies; the reader picks the test and is told why.
   Nothing moves on by itself.
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var NAME = 'test-chooser', C = 'wd-test-chooser';

  var TOOL = { name: NAME, title: 'Which test?', blurb: 'Answer three questions and find the statistical test that fits your data.', station: 'stats', lv: 'ie', icon: 'χ²' };
  if (WUL.tool) WUL.tool(TOOL); else (WUL.TOOLS = WUL.TOOLS || []).push(TOOL);

  var CHECKS = 'https://nlcsbiology.com/write-up-lab/#/part/stats/build/checks';

  /* ---------- part 1: the questions (guide 8: stop 3, then one line: A, B or C) ---------- */
  var Q = {
    kind: { q: 'What did you record?', opts: [
      { t: 'Counts in categories', sub: 'How many fall into each group. For example, 32 woodlice on the damp side and 8 on the dry side.', go: 'counts' },
      { t: 'Measurements on a scale', sub: 'A value for each trial or individual. For example, a time in seconds or a height in centimetres.', go: 'aim' }
    ] },
    counts: { q: 'What do you compare the counts with?', opts: [
      { t: 'An expected ratio, or an even spread', sub: 'For example 3 : 1 in a genetic cross, or 50 : 50 in a choice chamber.', go: '=chi' },
      { t: 'A second set of categories', sub: 'Are two features found together? For example, two species present or absent in the same quadrats.', go: '=chiA' }
    ] },
    aim: { q: 'What are you looking for?', opts: [
      { t: 'A difference between groups', sub: 'For example, the mean time at 40 °C against the mean time at 50 °C.', go: 'groups' },
      { t: 'A relationship between two variables', sub: 'Two measurements on each individual or sample. For example, the light intensity and the moss cover in each quadrat.', go: 'shape' }
    ] },
    groups: { q: 'What do you compare?', opts: [
      { t: 'Two groups, different individuals', sub: 'Each value comes from a different tube, plant or animal. For example, five tubes at 40 °C and five other tubes at 50 °C.', go: '=t' },
      { t: 'The same individuals, twice', sub: 'Two values from each individual: paired values. For example, the stomata on the upper and the lower surface of the same 8 leaves.', go: '=paired' },
      { t: 'One group against a fixed value', sub: 'A number you know before you collect the data. For example, the pH of 12 pond-water samples against pH 7.0.', go: '=one' },
      { t: 'Three or more groups, different individuals', sub: 'For example, seedlings grown in four soils, with different plants in each soil.', go: '=many' },
      { t: 'Three or more conditions, the same individuals', sub: 'For example, the same 10 seedlings measured on day 2, day 4 and day 6.', go: '=rm' }
    ] },
    shape: { q: 'Plot every raw value on a scatter graph, not the means. What shape is the pattern?', opts: [
      { t: 'A straight line', sub: 'The points rise or fall at a steady rate. For example, moss cover decreases steadily as light intensity increases.', go: '=corr' },
      { t: 'A curve that only rises, or only falls', sub: 'Or the data are ranks or scores. For example, the rate of photosynthesis rises with light intensity, then reaches a plateau.', go: '=spear' },
      { t: 'It rises, then falls', sub: 'For example, the rate of an enzyme reaction from 20 °C to 60 °C.', go: '=hump' }
    ] }
  };

  /* ---------- the end cards ----------
     ib: a test Tool 3 names; ext: beyond the IB guide. check: what to check, and WHERE (guide 8, check 1).
     alt: the test to use if the check fails (alt.test, always beyond the IB guide). */
  var R = {
    t: { test: 'Welch’s t-test', ib: true,
      why: 'You compare the means of two groups, and each value comes from a different individual.',
      check: 'Is each group a bell shape (a [[normal distribution]])? Check __each group on its own__, never the two groups in one pile: [how to check](' + CHECKS + ').',
      alt: { test: 'Mann–Whitney U test', md: 'It compares the two groups by the order (rank) of their values, so it needs no bell shape. To reach p < 0.05, it needs at least 4 values in each group, or 3 and 5.' },
      h0: 'There is no difference between the mean time for the starch to disappear at 40 °C and at 50 °C.',
      say: 'A [[two-tailed|two-tailed test]] Welch’s t-test showed that the mean time at 50 °C (54 s) was significantly shorter than at 40 °C (74 s) (t = 5.77, df = 8, p < 0.001).',
      care: 'Welch’s t-test does not need the two groups to have a similar spread. Student’s t-test does, so Welch’s t-test is the safer choice, and you do not test the spread first. In a spreadsheet: =T.TEST(group 1, group 2, 2, 3). Our rule: at least five repeats in each group.' },
    paired: { test: 'Paired t-test', ib: true,
      why: 'You measured the same individuals twice, so the values come in pairs.',
      check: 'Find the difference within each pair. Is the set of __differences__ a bell shape? Check the differences, not the two sets of values.',
      alt: { test: 'Wilcoxon signed-rank test', md: 'It uses the order (rank) of the differences, so it needs no bell shape. To reach p < 0.05, it needs at least 6 pairs.' },
      h0: 'There is no difference between the mean number of stomata on the upper surface and on the lower surface of the leaves.',
      say: 'A [[two-tailed|two-tailed test]] paired t-test showed that the lower surface had significantly more stomata than the upper surface (mean difference 11.1 per field of view, t = 21.6, df = 7, p < 0.001).',
      care: 'Keep the two values of each pair in one row of your table. In a spreadsheet: =T.TEST(first values, second values, 2, 1). The 1 means paired.' },
    one: { test: 'One-sample t-test', ib: true,
      why: 'You compare the mean of one group with a fixed number, such as a published value.',
      check: 'Is the group a bell shape? Check __the values__ of the group.',
      alt: { test: 'Wilcoxon signed-rank test', md: 'Used on the difference between each value and the fixed number. It needs no bell shape. To reach p < 0.05, it needs at least 6 values.' },
      h0: 'There is no difference between the mean pH of the pond water and pH 7.0.',
      say: 'A [[two-tailed|two-tailed test]] one-sample t-test showed that the mean pH of the 12 samples (6.6) was significantly lower than 7.0 (t = −8.25, df = 11, p < 0.001).',
      care: 'The fixed value must come from outside your data, and you choose it before you collect the data. A spreadsheet has no one-sample t-test: in R, t.test(x, mu = 7.0).' },
    many: { test: 'ANOVA, then Tukey’s test', ext: true,
      why: 'ANOVA (analysis of variance) compares the means of three or more groups in one test. It shows only whether at least one group is different.',
      check: 'Is each group a bell shape? Check __each group on its own__. ANOVA also needs a similar spread: the largest SD less than twice the smallest. Very different spreads: Welch’s ANOVA, then the Games–Howell test.',
      alt: { test: 'Kruskal–Wallis test, then Dunn’s test', md: 'The rank version of ANOVA, so it needs no bell shape.' },
      then: 'Only if p < 0.05: Tukey’s test (after ANOVA) or Dunn’s test (after Kruskal–Wallis) shows which pairs of groups differ.',
      h0: 'There is no difference between the mean heights of the seedlings in the four soils.',
      say: 'A one-way ANOVA found no significant difference between the mean heights of the seedlings in the four soils (F = 1.49, df = 3 and 36, p = 0.23), so no test of the pairs was done.',
      care: 'Never a t-test for every pair: with 5 groups (10 pairs), the risk of at least one false “significant” result is more than 25 %, not 5 %. To stay inside the IB guide, choose the two groups that matter before you collect the data, and use Welch’s t-test. To test several pairs, apply a [[correction for multiple comparisons]]: with 10 tests, each p must be below 0.005 (0.05 ÷ 10).' },
    rm: { test: 'Repeated-measures ANOVA', ext: true,
      why: 'You measured the same individuals three or more times, so the values are linked.',
      check: 'This test needs extra checks: ask your teacher.',
      alt: { test: 'Friedman test', md: 'The rank version, so it needs no bell shape.' },
      h0: 'There is no difference between the mean lengths of the seedlings on day 2, day 4 and day 6.',
      care: 'Never a t-test for every pair of conditions. To stay inside the IB guide, choose the two conditions that matter before you collect the data, and use a paired t-test.' },
    corr: { test: 'Pearson’s r and R²', ib: true,
      why: 'The points follow a straight line, and you want the strength and the direction of the relationship.',
      check: 'Draw the line of best fit. The __residuals__ are the distances of the points above (+) or below (−) the line. Do the residuals, all in one pile, form a bell shape, with an even spread along the line? Never check the y values in one pile: their mean changes along the line.',
      alt: { test: 'Spearman’s rank correlation', md: 'It uses the order (rank) of the values, so it needs no straight line and no bell shape. To reach p < 0.05, it needs at least 5 points.' },
      h0: 'There is no correlation between light intensity and moss cover.',
      say: 'There was a strong negative correlation between light intensity and moss cover in the 20 quadrats (Pearson’s r = −0.86, n = 20, p < 0.001). The straight line of best fit explained 74 % of the variation in moss cover (R² = 0.74).',
      care: 'Use every raw value, never the means. r runs from −1 to +1: its sign gives the direction, and its size the strength. A correlation alone does not show that one variable causes the other.' },
    spear: { test: 'Spearman’s rank correlation', ext: true,
      why: 'The points follow a curve that only rises or only falls, or the data are ranks or scores. The test uses the order (rank) of the values, so it needs no straight line.',
      check: 'No bell shape is needed. To reach p < 0.05, it needs at least 5 points.',
      h0: 'There is no correlation between light intensity and the rate of photosynthesis.',
      say: 'Spearman’s rank correlation showed a strong positive correlation between light intensity and the rate of photosynthesis (rₛ = 0.98, n = 8, p < 0.001).',
      care: 'Use every raw value, never the means. rₛ runs from −1 to +1, like r. A correlation alone does not show that one variable causes the other.' },
    hump: { rk: 'Your answer', test: 'No correlation test fits',
      why: 'r and rₛ are for a pattern that only rises or only falls. A rise and then a fall can give r close to 0, even when the relationship is strong.',
      instead: 'With repeats at each value of x, compare the groups: press Start again and choose “A difference between groups”. For five temperatures, that is ANOVA (beyond the IB guide), or two temperatures you choose before you collect the data, with Welch’s t-test.',
      care: 'Describe the rise and the fall with numbers, from the graph and its error bars. For example, the mean rate rose from 5.6 × 10⁻³ s⁻¹ at 20 °C to 18.5 × 10⁻³ s⁻¹ at 50 °C, then fell to 10.2 × 10⁻³ s⁻¹ at 60 °C.' },
    chi: { test: 'Chi-squared test (goodness of fit)', ib: true,
      why: 'You compare the counts you observed with the counts you expected.',
      check: 'Use the raw counts, never percentages or means. Count each individual only once. Every expected count must be 5 or more.',
      alt: { md: 'Collect more data, or combine categories, until every expected count is 5 or more.' },
      h0: 'The woodlice show no preference: they are equally likely to be on the damp side and on the dry side.',
      say: 'A chi-squared test showed that significantly more woodlice were found on the damp side than expected by chance (χ² = 14.4, df = 1, p < 0.001).',
      care: 'df = the number of categories − 1: here 2 − 1 = 1.' },
    chiA: { test: 'Chi-squared test for association', ib: true,
      why: 'You are asking whether two sets of categories are linked.',
      check: 'Use the raw counts, never percentages or means. Count each quadrat only once. Every expected count must be 5 or more.',
      alt: { test: 'Fisher’s exact test', md: 'For a 2 × 2 table with an expected count below 5. Or collect more data, or combine categories.' },
      h0: 'Heather and moss are distributed independently: there is no association between them.',
      say: 'A chi-squared test for association showed that heather and moss were found together in 57 of 100 quadrats, more often than the 42.2 expected if they were independent (χ² = 42.4, df = 1, p < 0.001).',
      care: 'Count four groups: both species, only A, only B, and neither. df = (rows − 1) × (columns − 1): here 1. An association does not show that one species causes the other.' }
  };

  /* guide 8, stops 1 and 2: describe first; error bars as in guide 3 (range, SD, SE, IQR; no confidence intervals) */
  var FIRST = '__Before you choose__, describe your data. A bell shape: the mean and the SD. Skewed data or outliers: the median and the IQR. Fewer than 5 values: the range ([which error bar?](https://nlcsbiology.com/write-up-lab/#/part/errorbars)). Count only independent values: 10 leaves from 1 plant are 1 plant, not 10 repeats. With only 1 or 2 values in a group, no test works: collect more data.';

  function tagHtml(ext) {
    return ext ? '<span class="ibtag ' + C + '__ext">Beyond the IB guide</span>' : '<span class="ibtag ibtag--i">IB · Tool 3</span>';
  }

  /* ---------- part 2: practice ---------- */
  var KEYS = [['t', 't-test'], ['chi', 'Chi-squared test'], ['r', 'Correlation (r or R²)']];
  var NO = {
    't>chi': 'A t-test compares the means of measurements. Here you have counts in categories.',
    't>r': 'A t-test compares groups. Here each individual gives two measurements, and you want the relationship between them.',
    'chi>t': 'Chi-squared needs counts in categories. Here you have measurements, and two means to compare.',
    'chi>r': 'Chi-squared needs counts in categories. Here you have two continuous measurements on each individual or sample.',
    'r>t': 'A correlation needs two measurements on each individual. Here you have one measurement in each of two groups.',
    'r>chi': 'A correlation needs two continuous variables. Here you have counts in categories.'
  };
  var PRACTICE = [
    { s: 'Woodlice are placed in a choice chamber with a damp side and a dry side. After 10 minutes you count how many are on each side.', ok: 'chi',
      why: 'Counts in two categories, compared with the 50 : 50 split expected if the woodlice had no preference.' },
    { s: 'You measure the length of 15 limpet shells on an exposed shore and 15 on a sheltered shore. Is the mean length different?', ok: 't',
      why: 'Two groups of different individuals, and the question is about the difference between their means: Welch’s t-test.' },
    { s: 'In 20 quadrats along a path, you measure the light intensity and the percentage cover of moss.', ok: 'r',
      why: 'Two continuous variables measured in each quadrat: you want the strength and direction of the relationship.' },
    { s: 'A cross between two heterozygous pea plants gives 72 plants with purple flowers and 28 with white flowers. Does this fit a 3 : 1 ratio?', ok: 'chi',
      why: 'Counts in categories against an expected ratio: 75 and 25 of 100.' },
    { s: 'You plot the percentage change in mass of potato cylinders against sucrose concentration and draw a straight line of best fit. How well does the line fit?', ok: 'r',
      why: 'R², the coefficient of determination, says how well a trend line fits the points.' },
    { s: 'On grass, 32 of 50 snails have banded shells. On sand, 20 of 50 do. Is banding linked to the habitat?', ok: 'chi',
      why: 'Counts in categories (banded or not, grass or sand): a chi-squared test for association. Use the counts, not 64 % and 40 %.' }
  ];

  function styles() {
    WUL.css(NAME,
      '.' + C + '{display:grid;gap:18px}' +
      '.' + C + '__part{display:grid;gap:12px}' +
      '.' + C + '__h{font:600 1.08rem/1.3 var(--serif)}' +
      '.' + C + '__first{margin:0;font-size:.92rem;line-height:1.5;color:var(--ink-2);background:var(--sheet-2);border:1px solid var(--rule-2);border-radius:var(--r);padding:8px 12px}' +
      '.' + C + '__trail{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:.85rem;color:var(--ink-2)}' +
      '.' + C + '__trail span{background:var(--sheet-2);border:1px solid var(--rule-2);border-radius:999px;padding:3px 10px}' +
      '.' + C + '__q{font:500 1.15rem/1.4 var(--serif)}' +
      '.' + C + '__opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}' +
      '.' + C + '__opt{appearance:none;display:grid;gap:4px;align-content:start;text-align:left;padding:12px 14px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);color:var(--ink);cursor:pointer;box-shadow:var(--shadow-sm)}' +
      '.' + C + '__opt:hover{border-color:var(--lvl);background:var(--lvl-wash)}' +
      '.' + C + '__opt b{font-size:1rem}' +
      '.' + C + '__opt span{font-size:.9rem;color:var(--ink-2);line-height:1.45}' +
      '.' + C + '__res{display:grid;gap:10px;border-left:4px solid var(--lvl)}' +
      '.' + C + '__res.is-ext{border-left-color:var(--ext)}' +
      '.' + C + '__rk{font:650 .7rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}' +
      '.' + C + '__rt{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font:600 1.35rem/1.25 var(--serif);color:var(--lvl)}' +
      '.' + C + '__res.is-ext .' + C + '__rt{color:var(--ext)}' +
      '.' + C + '__ext{color:var(--ext);background:var(--ext-wash);box-shadow:inset 0 0 0 1px var(--ext)}' +
      '.' + C + '__alt{font-weight:600}' +
      '.' + C + '__dl{display:grid;gap:10px;margin:0}' +
      '.' + C + '__dl dt{font:650 .7rem/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}' +
      '.' + C + '__dl dd{margin:3px 0 0;font-size:.98rem;line-height:1.5}' +
      '.' + C + '__say{font:400 1rem/1.55 var(--serif);background:var(--sheet-2);border:1px dashed var(--ink-3);border-radius:var(--r);padding:8px 12px}' +
      '.' + C + '__nav{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
      '.' + C + '__prog{font:600 .74rem/1 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}' +
      '.' + C + '__scen{font:500 1.08rem/1.5 var(--serif)}' +
      '.' + C + '__picks{display:flex;flex-wrap:wrap;gap:8px}' +
      '.' + C + '__picks .btn.is-no{border-color:var(--red);background:var(--red-wash)}' +
      '.' + C + '__picks .btn.is-ok{border-color:var(--green);background:var(--green-wash)}' +
      '.' + C + '__note{font-size:.9rem;color:var(--ink-2)}'
    );
  }

  WUL.widget(NAME, function (host, opts, ctx) {
    styles();
    var level = (ctx && ctx.level) || WUL.level();
    host.innerHTML = '';
    var root = h('div', { class: C });
    host.appendChild(root);
    if (level === 'g') root.appendChild(h('p', { class: C + '__note', text: 'Statistical tests are IB content. At IGCSE you compare the means and the ranges instead.' }));

    /* ----- part 1 ----- */
    var p1 = h('section', { class: C + '__part wd-panel', 'aria-label': 'Find your test' });
    root.appendChild(p1);
    var path = [];                         /* [{node, pick}] */
    function draw1(focusFirst) {
      p1.innerHTML = '';
      p1.appendChild(h('div', { class: C + '__h', text: 'Find your test' }));
      if (path.length) {
        var tr = h('div', { class: C + '__trail', 'aria-label': 'Your answers so far' });
        path.forEach(function (st) { tr.appendChild(h('span', { text: Q[st.node].opts[st.pick].t })); });
        p1.appendChild(tr);
      } else {
        p1.appendChild(h('p', { class: C + '__first', html: md(FIRST, { inline: true }) }));
      }
      var node = 'kind';
      if (path.length) node = Q[path[path.length - 1].node].opts[path[path.length - 1].pick].go;
      if (node.charAt(0) === '=') { result(R[node.slice(1)]); return; }
      var q = Q[node];
      p1.appendChild(h('p', { class: C + '__q', text: q.q }));
      var list = h('div', { class: C + '__opts' });
      q.opts.forEach(function (o, i) {
        var b = h('button', { type: 'button', class: C + '__opt' }, [h('b', { text: o.t }), h('span', { text: o.sub })]);
        b.addEventListener('click', function () { path.push({ node: node, pick: i }); draw1(true); });
        list.appendChild(b);
      });
      p1.appendChild(list);
      if (path.length) p1.appendChild(navRow());
      if (focusFirst) { var f = list.querySelector('button'); if (f) f.focus(); }
    }
    function navRow() {
      var back = h('button', { type: 'button', class: 'btn btn--ghost', text: '← Back' });
      back.addEventListener('click', function () { path.pop(); draw1(true); });
      var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start again ↺' });
      again.addEventListener('click', function () { path = []; draw1(true); });
      return h('div', { class: C + '__nav' }, [back, again]);
    }
    function result(r) {
      var box = h('div', { class: C + '__res wd-panel' + (r.ext ? ' is-ext' : ''), role: 'status' });
      box.appendChild(h('div', { class: C + '__rk', text: r.rk || 'Your test' }));
      box.appendChild(h('div', { class: C + '__rt', html: '<span>' + esc(r.test) + '</span>' + (r.ib || r.ext ? ' ' + tagHtml(r.ext) : '') }));
      var dl = h('dl', { class: C + '__dl' });
      function row(label, html) { dl.appendChild(h('dt', { text: label })); dl.appendChild(h('dd', { html: html })); }
      row('Why', md(r.why, { inline: true }));
      if (r.check) row('Check first', md(r.check, { inline: true }));
      if (r.alt) row('If the check fails', (r.alt.test ? '<span class="' + C + '__alt">' + esc(r.alt.test) + '</span> ' + tagHtml(true) + ' ' : '') + md(r.alt.md, { inline: true }));
      if (r.then) row('Then', md(r.then, { inline: true }));
      if (r.instead) row('What to do instead', md(r.instead, { inline: true }));
      if (r.h0) row('The null hypothesis would say', md(r.h0, { inline: true }));
      if (r.say) { dl.appendChild(h('dt', { text: 'In your report' })); dl.appendChild(h('dd', {}, h('div', { class: C + '__say', html: md(r.say, { inline: true }) }))); }
      if (r.care) row('Be careful', md(r.care, { inline: true }));
      box.appendChild(dl);
      p1.appendChild(box);
      p1.appendChild(navRow());
      var nb = p1.querySelector('.' + C + '__nav button'); if (nb) nb.focus();
    }
    draw1(false);

    /* ----- part 2 ----- */
    var p2 = h('section', { class: C + '__part wd-panel', 'aria-label': 'Practise' });
    root.appendChild(p2);
    var order = PRACTICE.map(function (x, i) { return i; }), k = 0, first = [], tries = 0, done = false;
    function draw2(focus) {
      p2.innerHTML = '';
      p2.appendChild(h('div', { class: C + '__h', text: 'Practise: which test would you use?' }));
      if (k >= order.length) {
        var got = first.filter(Boolean).length;
        p2.appendChild(h('p', { class: C + '__scen', text: got + ' of ' + order.length + ' right first time. ' + (got === order.length ? 'All correct.' : 'Read the reasons again for the ones you missed.') }));
        var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Try again ↺' });
        again.addEventListener('click', function () { order = WUL.shuffle(order); k = 0; first = []; tries = 0; done = false; draw2(true); });
        p2.appendChild(h('div', { class: C + '__nav' }, [again]));
        if (focus) again.focus();
        return;
      }
      var P = PRACTICE[order[k]];
      p2.appendChild(h('div', { class: C + '__prog', text: 'Study ' + (k + 1) + ' of ' + order.length }));
      p2.appendChild(h('p', { class: C + '__scen', text: P.s }));
      var picks = h('div', { class: C + '__picks', role: 'group', 'aria-label': 'Choose a test' });
      var fb = h('div', { 'aria-live': 'polite' });
      KEYS.forEach(function (kk) {
        var b = h('button', { type: 'button', class: 'btn', text: kk[1] });
        b.addEventListener('click', function () {
          if (done) return;
          tries++;
          var ok = kk[0] === P.ok;
          if (first[k] == null && (ok || tries === 1)) first[k] = ok && tries === 1;
          b.classList.add(ok ? 'is-ok' : 'is-no');
          fb.innerHTML = '';
          fb.appendChild(h('div', { class: 'fb ' + (ok ? 'fb--ok' : 'fb--no'), role: 'status', html: '<span class="fb__k">' + (ok ? '✔ Right' : '✘ Not this one') + '</span> ' + esc(ok ? P.why : NO[kk[0] + '>' + P.ok] + ' Try again.') }));
          if (ok) {
            done = true;
            picks.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
            var nx = h('button', { type: 'button', class: 'btn btn--go', text: k === order.length - 1 ? 'See your score →' : 'Next study →' });
            nx.addEventListener('click', function () { k++; tries = 0; done = false; draw2(true); });
            fb.appendChild(h('div', { class: C + '__nav', style: 'margin-top:10px' }, [nx]));
            nx.focus();
          }
        });
        picks.appendChild(b);
      });
      p2.appendChild(picks);
      p2.appendChild(fb);
      if (focus) { var f = picks.querySelector('button'); if (f) f.focus(); }
    }
    draw2(false);
  });
})(window.WUL);
