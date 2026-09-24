/* station: analysis — describe the pattern, with numbers. The why belongs in the conclusion.
   Numbers from WUL.data.amylase (checked twice):
   IGCSE 180 → 53 s = 71 % decrease; 53 → 93 s = 75 % increase; 180 → 117 s over 10 °C = −6.3 s per °C.
   IB 178 → 54 s = 70 % decrease; 54 → 98 s = 81 % increase; rate 18.5 ÷ 5.6 = 3.3 times.
   Trials differ by ≤ 20 s at every temperature (both levels), so there are no anomalies.
   IB SD bars (± 1 SD) at 40/50/60 °C: 68.5–79.5, 48.5–59.5, 89.6–106.4 s: no overlap.
   Unpaired t-test 40 °C v 50 °C (5 trials each): t = 5.77, df = 8, p = 0.0004 (< 0.001).
   Pondweed anomaly example (not amylase): 12, 25, 14 at 40 cm; repeat 13; mean (12 + 14 + 13) ÷ 3 = 13. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase, S = WUL.data.soils;
  function pts(lv, key) { return A[lv].temps.map(function (t, i) { return [t, A[lv][key][i]]; }); }

  var AXES = ['paper', 'axis-x', 'axis-y', 'ticks-x', 'ticks-y', 'label-x', 'label-y', 'caption'];
  var X = { min: 20, max: 60, step: 10, minor: 2, label: 'Temperature / °C' };
  var Y = { min: 0, max: 200, step: 20, minor: 2, label: 'Mean time for starch to disappear / s' };

  var plotG = {
    w: 540, h: 360, x: X, y: Y,
    series: [
      { id: 'm', pts: pts('g', 'means'), line: 'ruled', mark: 'x', tone: 'ink' },
      { id: 'k', pts: [[20, 180], [50, 53], [60, 93]], line: 'none', mark: 'circle', tone: 'red' }
    ],
    caption: 'Figure 1. Effect of temperature on the mean time for amylase to digest starch (n = 3)'
  };
  var plotI = {
    w: 540, h: 360, x: X, y: Y,
    series: [
      { id: 'm', pts: pts('i', 'means'), line: 'ruled', mark: 'x', tone: 'ink', err: A.i.sds },
      { id: 'k', pts: [[20, 178], [50, 54], [60, 98]], line: 'none', mark: 'circle', tone: 'red' }
    ],
    caption: 'Figure 1. Mean time for *A. oryzae* α-amylase to digest starch (n = 5; error bars = ± 1 SD)'
  };
  var plotSoils = {
    w: 380, h: 290, pad: { l: 58, r: 14, t: 14, b: 50 }, axisBreak: true,
    x: { cat: S.labels, label: 'Soil' },
    y: { min: 40, max: 47, step: 1, minor: 2, label: 'Mean height / cm' },
    series: [{ id: 's', pts: S.means.map(function (m, i) { return [i + 0.5, m]; }), err: S.sds, line: 'none', mark: 'x', tone: 'ink' }],
    caption: 'Mean height of bean seedlings after 21 days (n = 10; error bars = ± 1 SD)'
  };
  var plotAmyl = {
    w: 380, h: 290, pad: { l: 58, r: 14, t: 14, b: 50 },
    x: { min: 20, max: 60, step: 10, minor: 2, label: 'Temperature / °C' },
    y: { min: 0, max: 200, step: 40, minor: 4, label: 'Mean time / s' },
    series: [{ id: 'a', pts: pts('i', 'means'), err: A.i.sds, line: 'ruled', mark: 'x', tone: 'ink' }],
    caption: 'Mean time for *A. oryzae* α-amylase to digest starch (n = 5; error bars = ± 1 SD)'
  };
  var pondTable = {
    caption: 'Table 1. The effect of distance from the lamp on the number of bubbles released by pondweed',
    head: [[{ t: 'Distance from lamp / cm', rs: 2 }, { t: 'Number of bubbles per minute', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
    rows: [['10', '48', '46', '50', '48'], ['20', '31', '33', '29', '31'], ['30', '20', '19', '21', '20'], ['40', '12', '==25== *', '14', '13'], ['50', '7', '8', '6', '7']],
    note: '* Anomalous result: excluded from the mean. A repeat gave 13, so the mean at 40 cm is (12 + 14 + 13) ÷ 3 = 13.'
  };

  WUL.station({
    id: 'analysis', stage: 'sense', order: 1, title: 'Data analysis', levels: 'gie',
    job: { g: 'Describe the pattern in your results, with numbers. Do not explain it yet.', i: 'Describe the pattern in the processed data, and say what the uncertainties allow you to claim.', e: 'Describe each finding, and show how it helps to answer the research question.' },
    where: { g: 'After the graph, before the conclusion.', i: 'After the processed data and the graph, before the conclusion.', e: 'In the analysis section, after the results.' },

    ladder: {
      g: ['The overall [[trend]], with both variables named', 'Key values, with both coordinates and units', 'One calculated comparison, and any [[anomalous results|anomalous result]]'],
      i: ['Say whether the [[error bars|error bar]] overlap, and what that allows you to claim', 'Report a statistical test if one was done, and say what it means', 'Describe the pattern, not every point'],
      e: ['Build a line of argument: link each finding to the research question (criterion C)', 'Choose the processing that answers the question, and say why']
    },

    build: [
      { type: 'anatomy', lv: 'g', title: 'The four parts of an analysis',
        intro: 'Always in this order. Tap a colour to see each part.',
        model: '{1:As the temperature increased from 20 °C to 50 °C, the mean time for the starch to disappear decreased. Above 50 °C, it increased again.} {2:The mean time fell from 180 s at 20 °C to a minimum of 53 s at 50 °C, then rose to 93 s at 60 °C.} {3:This is a 71 % decrease from 20 °C to 50 °C, followed by a 75 % increase from 50 °C to 60 °C.} {4:No anomalous results were identified: at each temperature, the three trials differed by no more than 20 s.}',
        parts: [
          { n: 1, name: 'Overall trend', note: 'Does the dependent variable rise, fall, peak or reach a [[plateau]]? Name both variables.' },
          { n: 2, name: 'Key values', note: 'The start, the peak or lowest point, and the end. Both coordinates, with units.' },
          { n: 3, name: 'A calculated comparison', note: 'A [[percentage change|percentage change]], a ratio or a [[gradient]].' },
          { n: 4, name: 'Anomalies', note: 'Name them, or state that there were none.' }
        ] },

      { type: 'anatomy', lv: 'ie', title: 'The parts of an IB analysis',
        intro: 'The same four parts, then one more: what the uncertainty allows you to claim.',
        model: '{1:As the temperature increased from 20.0 °C to 50.0 °C, the mean time for the starch to disappear decreased; above 50.0 °C, it increased again.} {2:The mean time fell from 178 s at 20.0 °C to a minimum of 54 s at 50.0 °C, then rose to 98 s at 60.0 °C.} {3:This is a 70 % decrease, followed by an 81 % increase. The mean rate at 50.0 °C (18.5 × 10⁻³ s⁻¹) was 3.3 times the rate at 20.0 °C.} {4:No anomalous results were identified: at each temperature, the five trials differed by no more than 20 s.} {5:The ± 1 SD error bars at 40.0, 50.0 and 60.0 °C do not overlap. A t-test comparing 40.0 °C with 50.0 °C gave t = 5.77, df = 8, p < 0.001, so this difference is statistically significant.}',
        parts: [
          { n: 1, name: 'Overall trend', note: 'Rise, fall, peak or [[plateau]], with both variables named.' },
          { n: 2, name: 'Key values', note: 'Processed data: means, with both coordinates and units.' },
          { n: 3, name: 'A calculated comparison', note: 'A [[percentage change]], a ratio or a [[gradient]].' },
          { n: 4, name: 'Anomalies', note: 'Name them, or state that there were none.' },
          { n: 5, name: 'What the uncertainty allows', note: 'Do the [[error bars|error bar]] overlap? Report a [[t-test]] if one was done. Do not define it here.' }
        ] },

      { type: 'anatomy', lv: 'e', title: 'Build a line of argument',
        intro: 'Criterion C (Analysis and line of argument) rewards a clear line of argument. Each step links a finding to the research question.',
        model: '{1:The first step is to establish whether temperature changed the rate at all.} {2:It did: the mean rate rose from 5.6 × 10⁻³ s⁻¹ at 20.0 °C to 18.5 × 10⁻³ s⁻¹ at 50.0 °C, a 3.3-fold increase.} {3:Across this range, temperature therefore has a large effect.} {1:The next step is to locate the peak.} {2:The rate fell by 45 % between 50.0 and 60.0 °C, and the ± 1 SD bars at 40.0, 50.0 and 60.0 °C do not overlap.} {3:The optimum therefore lies between 40.0 and 60.0 °C.}',
        parts: [
          { n: 1, name: 'The step in the argument', note: 'Which part of the research question this finding answers.' },
          { n: 2, name: 'The evidence', note: 'Processed data, with its uncertainty.' },
          { n: 3, name: 'What it shows', note: 'One sentence that adds one step to the argument. Give the full explanation in the discussion.' }
        ],
        after: 'A list of numbers with no link to the question is not an argument, even if the numbers are accurate.' },

      { type: 'callout', title: 'Describe, do not explain', label: 'Describe, do not explain', md: 'The analysis says __what__ the data show. The [[conclusion]] says __why__.' },

      { type: 'compare', lv: 'g', title: 'Keep reasons for the conclusion',
        bad: 'The time fell as the temperature rose, because the molecules had more kinetic energy. Above 50 °C, the enzyme was denatured.',
        good: 'The mean time fell from 180 s at 20 °C to 53 s at 50 °C, then rose to 93 s at 60 °C.',
        badLabel: 'Explains too early', goodLabel: 'Describes, with numbers',
        why: 'The biology in the first box is correct, but it belongs in the conclusion. Here, give only the pattern and the numbers.' },

      { type: 'steps', lv: 'g', title: 'Describe a graph',
        intro: 'Press Next to build the description one part at a time.',
        stage: { plot: plotG },
        steps: [
          { title: 'Name the variables', text: 'Your first sentence names both: temperature (x-axis) and the mean time for the starch to disappear (y-axis).', show: AXES, focus: ['label-x', 'label-y'] },
          { title: 'The overall trend', text: 'Follow the line from left to right. The mean time __decreases__ to a lowest point at 50 °C, then __increases__.', show: ['pts-m', 'line-m'] },
          { title: 'The key values', text: 'Quote the start, the lowest point and the end, each with both coordinates and units: 180 s at 20 °C, 53 s at 50 °C and 93 s at 60 °C.', show: ['pts-k'] },
          { title: 'A calculated comparison', text: '(180 − 53) ÷ 180 × 100 = a 71 % decrease. (93 − 53) ÷ 53 × 100 = a 75 % increase. Always divide by the __starting__ value.', show: [], focus: ['pts-k'] },
          { title: 'Anomalies', text: 'Check the trials in the table, not only the means. Here the three trials at each temperature differ by no more than 20 s, so no result is anomalous.', show: [], focus: [] }
        ] },

      { type: 'steps', lv: 'ie', title: 'Describe a graph with error bars',
        intro: 'Press Next to build the description one part at a time.',
        stage: { plot: plotI },
        steps: [
          { title: 'Name the variables', text: 'Your first sentence names both: temperature (x-axis) and the mean time for the starch to disappear (y-axis).', show: AXES, focus: ['label-x', 'label-y'] },
          { title: 'The overall trend', text: 'Follow the line from left to right. The mean time __decreases__ to a lowest point at 50.0 °C, then __increases__.', show: ['pts-m', 'line-m'] },
          { title: 'The key values', text: 'Quote the start, the lowest point and the end: 178 s at 20.0 °C, 54 s at 50.0 °C and 98 s at 60.0 °C.', show: ['pts-k'] },
          { title: 'A calculated comparison', text: '(178 − 54) ÷ 178 × 100 = a 70 % decrease. (98 − 54) ÷ 54 × 100 = an 81 % increase.', show: [], focus: ['pts-k'] },
          { title: 'What the error bars allow', text: 'The ± 1 SD bars at 40.0, 50.0 and 60.0 °C do not overlap, so the differences between these three means are probably real. A [[t-test]] can test this.', show: ['err-m'] },
          { title: 'Anomalies', text: 'Check the raw data table. The five trials at each temperature differ by no more than 20 s, so no result is anomalous.', show: [], focus: [] }
        ] },

      { type: 'compare', lv: 'ie', title: 'The pattern, not every point',
        bad: 'At 20.0 °C the mean was 178 s. At 30.0 °C the mean was 118 s. At 40.0 °C the mean was 74 s. At 50.0 °C the mean was 54 s. At 60.0 °C the mean was 98 s.',
        good: 'The mean time fell by 70 %, from 178 s at 20.0 °C to a minimum of 54 s at 50.0 °C, then rose by 81 % to 98 s at 60.0 °C.',
        badLabel: 'A list', goodLabel: 'A pattern',
        why: 'The table already gives every value. The analysis selects the trend, the key values and one comparison.' },

      { type: 'table', title: 'Spot an anomalous result',
        spec: pondTable,
        after: 'If you included it, the mean at 40 cm would be 17. This still fits the trend, so the mean would hide the anomaly. Always check the trials, not only the means.' },

      { type: 'rules', title: 'What to do with an anomaly', items: [
        { t: '__Spot it:__ an [[anomalous result]] does not fit the pattern or trend in the other data points.', icon: '1' },
        { t: '__Repeat__ that trial, if you can.', icon: '2' },
        { t: '__Report both values__ in the raw data table. Never delete a result.', icon: '3' },
        { t: 'If you exclude it from a [[mean]], __say which value and why__, under the table.', icon: '4' },
        { t: 'Cambridge credits “to identify (and exclude) anomalous results” as a reason for repeating.', lv: 'g', icon: '✔' },
        { t: 'The IB skills list asks you to “identify and justify the removal or inclusion of outliers”.', lv: 'ie', icon: '✔' }
      ] },

      { type: 'grid2', lv: 'ie', title: 'What error bars let you claim',
        items: [
          { label: 'Error bars overlap', v: { plot: plotSoils }, note: 'The four soils differ by only 1.3 cm (3 %), and every SD bar overlaps. The soils __cannot be separated__.' },
          { label: 'Error bars do not overlap', v: { plot: plotAmyl }, note: 'No pair of SD bars overlaps. The differences are probably real; a [[t-test]] can test whether they are [[statistically significant]].' }
        ] },

      { type: 'frames', lv: 'g', title: 'Sentences for your analysis', items: [
        'As the ___ increased from ___ to ___, the mean ___ decreased from ___ to ___.',
        'The mean ___ reached a minimum of ___ at ___, then increased to ___ at ___.',
        'This is a ___ % decrease between ___ and ___.',
        'No anomalous results were identified: ___.',
        'The result of ___ at ___ was anomalous, because ___. It was repeated, and the repeat gave ___.'
      ] },
      { type: 'frames', lv: 'ie', title: 'Sentences for an IA analysis', items: [
        'As the ___ increased from ___ to ___, the mean ___ decreased from ___ to ___.',
        'This is a ___ % decrease, followed by a ___ % increase.',
        'The error bars at ___ and ___ overlap, so these two conditions cannot be separated.',
        'The error bars at ___ and ___ do not overlap, which suggests a real difference.',
        'A ___ comparing ___ with ___ gave t = ___, df = ___, p ___, so the difference is / is not statistically significant.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this. Five phrases would lose marks.',
        body: '[!a:The graph goes down and then up.]\n\n[!b:The enzyme was denatured.]\n\n[!c:The fastest was 50.]\n\n[!e:It changed a lot.]\n\n[!d:The results were quite accurate.]',
        notes: {
          a: { label: 'which variables?', why: 'Name both variables and the direction: “As the temperature increased from 20 °C to 50 °C, the mean time decreased.”' },
          b: { label: 'too early', why: 'This is an explanation. It belongs in the conclusion. The analysis only describes.' },
          c: { label: 'units? which value?', why: 'Give both coordinates, with units: the shortest mean time was 53 s, at 50 °C.' },
          e: { label: 'calculate it', why: 'Give a calculated comparison: a 71 % decrease from 20 °C to 50 °C.' },
          d: { label: 'anomalies?', why: 'Accuracy is judged in the evaluation. Here, state whether any result was anomalous.' }
        },
        fixed: '==As the temperature increased from 20 °C to 50 °C, the mean time decreased==; above 50 °C, it increased. The mean time fell from 180 s at 20 °C to ==53 s at 50 °C==, then rose to 93 s at 60 °C. This is a ==71 % decrease==, followed by a 75 % increase. ==No anomalous results were identified==: at each temperature, the trials differed by no more than 20 s.',
        fixedNote: 'The four parts are now there, in order, and the explanation has moved to the conclusion.'
      },
      i: {
        title: 'An IA analysis. Five phrases would lose marks.',
        body: '[!a:At 20.0 °C the mean was 178 s.] At 30.0 °C it was 118 s, at 40.0 °C 74 s, at 50.0 °C 54 s and at 60.0 °C 98 s.\n\n[!b:The error bars show accuracy.]\n\nThe rate fell at 60.0 °C.\n\n[!c:The active site changed shape.]\n\n[!d:A t-test was done: p = 0.0004.]\n\n[!e:The data had no problems.]',
        notes: {
          a: { label: 'pattern, not every point', why: 'Listing every mean repeats the table. Give the trend, the key values and one comparison: a 70 % decrease to 54 s at 50.0 °C, then an 81 % increase.' },
          b: { label: 'overlap?', why: 'SD bars show the spread of the trials, not accuracy. Say whether they overlap, and what that allows you to claim.' },
          c: { label: 'too early', why: 'An explanation of why the rate fell. It belongs in the conclusion.' },
          d: { label: 'which test? meaning?', why: 'Name the test and the two groups, and say what p means: a t-test comparing 40.0 °C with 50.0 °C gave t = 5.77, df = 8, p < 0.001, so the difference is statistically significant.' },
          e: { label: 'anomalies?', why: 'Say it precisely: no anomalous results were identified, because the five trials at each temperature differed by no more than 20 s.' }
        },
        fixed: 'The mean time ==fell by 70 %==, from 178 s at 20.0 °C to ==54 s at 50.0 °C==, then ==rose by 81 %== to 98 s at 60.0 °C. ==The ± 1 SD bars at 40.0, 50.0 and 60.0 °C do not overlap==, and ==a t-test comparing 40.0 °C with 50.0 °C gave t = 5.77, df = 8, p < 0.001==, so this difference is statistically significant. ==No anomalous results were identified==: the five trials at each temperature differed by no more than 20 s.',
        fixedNote: 'It now describes the pattern, says what the uncertainty allows, and leaves the reasons for the conclusion.'
      }
    },

    traps: [
      { bad: 'The graph goes down and then up.', good: 'As the temperature increased from 20 °C to 50 °C, the mean time decreased from 180 s to 53 s.', lv: 'g' },
      { bad: 'The graph goes down and then up.', good: 'As the temperature increased from 20.0 °C to 50.0 °C, the mean time decreased from 178 s to 54 s.', lv: 'ie' },
      { bad: '…because the enzyme was denatured.', good: 'Keep every reason for the conclusion. The analysis only describes.' },
      { bad: 'The fastest was 50.', good: 'The shortest mean time was 53 s, at 50 °C.', lv: 'g' },
      { bad: 'The fastest was 50.', good: 'The shortest mean time was 54 s, at 50.0 °C.', lv: 'ie' },
      { bad: 'There were no problems with the data.', good: 'No anomalous results were identified: the trials differed by no more than 20 s.' },
      { bad: 'The error bars are small, so the results are accurate.', good: 'The SD bars at 40.0 and 50.0 °C do not overlap, so the difference is probably real.', lv: 'ie' },
      { bad: 'Five sentences, one for each mean.', good: 'The trend, the key values, one comparison and the anomalies. Then stop.', lv: 'ie' }
    ],

    test: [
      { type: 'order', q: 'Put these four sentences of a data analysis in the right order.',
        items: [
          'As the temperature increased from 20 °C to 50 °C, the mean time decreased; above 50 °C, it increased.',
          'The mean time fell from 180 s at 20 °C to 53 s at 50 °C, then rose to 93 s at 60 °C.',
          'This is a 71 % decrease, followed by a 75 % increase.',
          'No anomalous results were identified.'
        ],
        why: 'Trend, then key values, then a calculated comparison, then anomalies.' },
      { type: 'choose', q: 'Which description fits this graph?', show: { plot: plotG },
        opts: [
          { t: 'The mean time fell from 180 s at 20 °C to a minimum of 53 s at 50 °C, then rose to 93 s at 60 °C.', ok: true, why: 'It gives the trend in both directions, with both coordinates and units.' },
          { t: 'The mean time decreased steadily as the temperature increased.', why: 'It misses the rise above 50 °C.' },
          { t: 'The mean time was shortest at 60 °C.', why: 'Read the graph again: the lowest point is at 50 °C.' },
          { t: 'The mean time rose from 53 s at 20 °C to 180 s at 50 °C.', why: 'The values are swapped: 180 s is at 20 °C, and the time falls.' }
        ] },
      { type: 'sort', q: 'Is each sentence a description (analysis) or an explanation (conclusion)?',
        bins: ['Description: analysis', 'Explanation: conclusion'],
        items: [
          { t: 'The mean time was shortest at 50 °C.', bin: 0, why: 'It says what the data show.' },
          { t: 'More enzyme–substrate complexes formed per second.', bin: 1, why: 'It gives a reason: that is the conclusion’s job.' },
          { t: 'The time increased by 75 % between 50 °C and 60 °C.', bin: 0, why: 'A calculated comparison describes the data.' },
          { t: 'The active site changed shape.', bin: 1, why: 'This explains why the time increased.' },
          { t: 'No anomalous results were identified.', bin: 0, why: 'A statement about the data, not a reason.' },
          { t: 'The molecules had more kinetic energy.', bin: 1, why: 'A reason from biology: it belongs in the conclusion.' }
        ] },
      { type: 'spot', q: 'Tap the three phrases that would lose marks in a data analysis.',
        text: '[?:As the temperature increased from 20 °C to 50 °C, the mean time decreased from 180 s to 53 s.] [!a:This is because the molecules gained kinetic energy.] [?:Above 50 °C, the mean time increased to 93 s.] [!b:The enzyme was denatured.] [!c:The lowest was 53.] [?:No anomalous results were identified.]',
        why: { a: 'An explanation: keep it for the conclusion.', b: 'Also an explanation, which belongs in the conclusion.', c: 'Give both coordinates and the unit: 53 s at 50 °C.' } },
      { type: 'choose', q: 'The mean time fell from 180 s at 20 °C to 53 s at 50 °C. What is the percentage decrease?',
        opts: [
          { t: '71 %', ok: true, why: '(180 − 53) ÷ 180 × 100 = 70.6, so 71 %. Divide by the starting value.' },
          { t: '240 %', why: 'That divides by the final value (127 ÷ 53). Always divide by the starting value.' },
          { t: '29 %', why: 'That is 53 as a percentage of 180, not the decrease.' },
          { t: '127 %', why: '127 s is the difference. Divide it by the starting value, then multiply by 100.' }
        ] },
      { type: 'choose', q: 'Which result in this table is anomalous?', show: { table: { caption: 'Table 1. Bubbles released by pondweed per minute', head: [['Distance / cm', 'Trial 1', 'Trial 2', 'Trial 3']], rows: [['10', '48', '46', '50'], ['20', '31', '33', '29'], ['30', '20', '19', '21'], ['40', '12', '25', '14'], ['50', '7', '8', '6']] } },
        opts: [
          { t: '25 bubbles per minute at 40 cm', ok: true, why: 'The other two trials at 40 cm gave 12 and 14, and 25 is higher than every trial at 30 cm. It does not fit the trend.' },
          { t: '48 bubbles per minute at 10 cm', why: 'It is the highest value, but it fits the trend: the nearer the lamp, the more bubbles.' },
          { t: '6 bubbles per minute at 50 cm', why: 'It is the lowest value, but it fits the trend and agrees with the other trials.' },
          { t: 'None of them', why: 'Look at 40 cm: one trial is about twice the other two.' }
        ] },
      { type: 'multi', q: 'You decide that 25 bubbles per minute at 40 cm is anomalous. What should you do?',
        opts: [
          { t: 'Repeat that trial', ok: true, why: 'A repeat shows whether the value happens again.' },
          { t: 'Keep 25 in the raw data table', ok: true, why: 'Report every result, even one that you do not use.' },
          { t: 'State under the table that 25 was excluded from the mean, and why', ok: true, why: 'The reader of your report must be able to see what was excluded.' },
          { t: 'Delete it, so the table looks neat', why: 'Deleting a result without saying so looks like choosing the results you want.' },
          { t: 'Change it to 13, so it fits the trend', why: 'Changing a result is never allowed: it is falsifying data.' }
        ],
        why: 'Repeat it, report both values, and state what was excluded from the mean.' },
      { type: 'build', q: 'Build the trend sentence of a data analysis.',
        chips: ['As the temperature increased', 'from 20 °C to 50 °C,', 'the mean time decreased', 'from 180 s to 53 s.', 'because of kinetic energy.', 'the graph went down'],
        answer: ['As the temperature increased', 'from 20 °C to 50 °C,', 'the mean time decreased', 'from 180 s to 53 s.'],
        why: 'It names both variables, the direction and the values, and it gives no reason.' },
      { type: 'choose', lv: 'ie', q: 'Every SD bar on this graph overlaps. Which statement is justified?', show: { plot: plotSoils },
        opts: [
          { t: 'The four soils cannot be separated: the means differ by only 1.3 cm, and every SD bar overlaps.', ok: true, why: 'Overlapping SD bars mean the difference could be due to variation between plants.' },
          { t: 'Soil D is the best soil, because its mean is highest.', why: 'Its mean is highest, but the overlap means that difference may not be real.' },
          { t: 'The error bars are small, so the results are accurate.', why: 'SD bars show spread, not accuracy.' },
          { t: 'Soil A reduced growth by 3 %, which is statistically significant.', why: 'Significance needs a statistical test, and the overlap suggests it would not be significant.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'Which sentence reports a statistical test properly in an analysis?',
        opts: [
          { t: 'A t-test comparing 40.0 °C with 50.0 °C gave t = 5.77, df = 8, p < 0.001, so the difference is statistically significant.', ok: true, why: 'It names the test and the groups, gives t, df and p, and says what they mean.' },
          { t: 'p = 0.0004.', why: 'No test, no groups and no meaning: a number alone is not analysis.' },
          { t: 'The t-test proved the hypothesis.', why: 'A test does not prove anything, and the hypothesis belongs in the conclusion.' },
          { t: 'The t-test showed that the error bars were small.', why: 'A t-test compares two means. It says nothing about the size of the error bars.' }
        ] }
    ],

    words: [
      { term: 'trend', forms: ['trends', 'pattern'], def: 'The general direction of change in the data as the independent variable increases.', eg: 'The mean time decreased from 20 °C to 50 °C, then increased.' },
      { term: 'anomalous result', forms: ['anomalous results', 'anomaly', 'anomalies', 'anomalous'], def: 'A result that does not fit the pattern or trend in the other data points.', eg: '25 bubbles per minute at 40 cm, when the other trials gave 12 and 14.' },
      { term: 'gradient', forms: ['gradients', 'slope'], def: 'How steeply a line rises or falls: the change in y divided by the change in x.', eg: 'From 20 °C to 30 °C, the mean time fell by 63 s: −6.3 s per °C.' },
      { term: 'plateau', forms: ['plateaus', 'plateaux'], def: 'A part of a graph where the line becomes flat, because the dependent variable remains constant.', eg: 'At high light intensity, the rate of photosynthesis reaches a plateau.' }
    ],

    sources: ['Cambridge 0610 examiner report 61/O/N/22 (definition of an anomalous result)', 'Cambridge 0610 mark schemes 2021–2025 (“why repeat?”)', 'IB Biology guide (2025), Inquiry 2 skills, p. 32', 'IB Extended essay guide (first assessment 2027), criterion C']
  });
})(window.WUL);
