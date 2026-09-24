/* station: errorbars — what an error bar is, the four kinds, how to draw them, and how to read overlap.
   Every number is computed from WUL.data or from the seven heights below, never typed in by hand:
     seven heights 41.0–44.5 cm: mean 43.0, SD 1.29, SE 0.49 (checked with node, =STDEV.S)
     amylase (IB) 40 °C: 74 ± 5.5 s (68.5–79.5); 50 °C: 54 ± 5.5 s (48.5–59.5) — no overlap
     soils A and D (n = 10): SD bars 41.6–44.4 and 42.8–45.8 overlap; SE bars 42.6–43.4 and 43.8–44.8 do not;
     a t-test gives t = 2.00, df = 18, p = 0.060 (the "Go further" panel). */
(function (WUL) {
  'use strict';
  /* inline markup; ± is kept on the same line as its number */
  var md = function (s) { return WUL.md(s, { inline: true }).replace(/± /g, '±\u00a0'); };
  var A = WUL.data.amylase, S = WUL.data.soils;
  var SEVEN = [41.0, 42.0, 42.5, 43.0, 43.5, 44.5, 44.5];
  var m7 = WUL.mean(SEVEN), sd7 = WUL.sd(SEVEN), se7 = sd7 / Math.sqrt(SEVEN.length);
  var min7 = Math.min.apply(null, SEVEN), max7 = Math.max.apply(null, SEVEN);

  function proseTable(head, rows) {
    var th = 'text-align:left;vertical-align:bottom;font:600 .86rem/1.35 var(--sans)';
    var td = 'text-align:left;vertical-align:top;font:400 .93rem/1.45 var(--sans)';
    return '<div class="tscroll"><table class="dt"><thead><tr>' + head.map(function (c) { return '<th style="' + th + '">' + md(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td style="' + td + (i === 0 ? ';font-weight:600' : '') + '">' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* the same seven values, three bars */
  var threeBars = {
    w: 440, h: 330, pad: { l: 56, r: 12, t: 14, b: 40 }, axisBreak: true,
    x: { cat: ['7 values', 'Range', '± 1 SD', '± 1 SE'] },
    y: { min: 38, max: 48, step: 2, minor: 4, label: 'Height of seedling / cm' },
    series: [
      { id: 'raw', pts: SEVEN.map(function (v, i) { return [0.5 + (i - 3) * 0.09, v]; }), mark: 'circle', line: 'none', tone: 'ink' },
      { id: 'rg', pts: [[1.5, m7]], errLo: [m7 - min7], errHi: [max7 - m7], mark: 'x', line: 'none', tone: 'ink' },
      { id: 'sd', pts: [[2.5, m7]], err: [sd7], mark: 'x', line: 'none', tone: 'blue' },
      { id: 'se', pts: [[3.5, m7]], err: [se7], mark: 'x', line: 'none', tone: 'plum' }
    ],
    caption: 'Figure 1. The heights of seven bean seedlings, and their mean (' + WUL.fix(m7, 1) + ' cm) drawn three times: range ' + WUL.fix(min7, 1) + '–' + WUL.fix(max7, 1) + ' cm; SD = ' + WUL.fix(sd7, 2) + ' cm; SE = ' + WUL.fix(se7, 2) + ' cm.'
  };

  /* the amylase graph, built up step by step */
  var amyPlot = {
    w: 460, h: 330,
    x: { min: 20, max: 60, step: 10, minor: 5, label: 'Temperature / °C' },
    y: { min: 0, max: 200, step: 50, minor: 5, label: 'Mean time / s' },
    series: [{ id: 'm', pts: A.i.temps.map(function (t, i) { return [t, A.i.means[i]]; }), err: A.i.sds, line: 'ruled', mark: 'x' }],
    caption: 'Figure 2. Mean time for fungal α-amylase to digest starch at 20–60 °C (n = 5; error bars = ± 1 SD)'
  };

  /* two pairs, for reading overlap */
  function pairPlot(names, means, errs, y, cap) {
    return { w: 300, h: 270, pad: { l: 58, r: 12, t: 12, b: 34 }, axisBreak: y.min > 0,
      x: { cat: names }, y: y,
      series: [{ id: 'p', pts: [[0.5, means[0]], [1.5, means[1]]], err: errs, mark: 'x', line: 'none', tone: 'blue' }],
      caption: cap };
  }
  var soilsAD = pairPlot(['Soil A', 'Soil D'], [S.means[0], S.means[3]], [S.sds[0], S.sds[3]], { min: 40, max: 47, step: 1, minor: 5, label: 'Mean height / cm' }, 'n = 10 plants per soil; error bars = ± 1 SD.');
  var amy4050 = pairPlot(['40 °C', '50 °C'], [A.i.means[2], A.i.means[3]], [A.i.sds[2], A.i.sds[3]], { min: 40, max: 90, step: 10, minor: 5, label: 'Mean time / s' }, 'n = 5 trials; error bars = ± 1 SD.');
  var soilsAB = pairPlot(['Soil A', 'Soil B'], [S.means[0], S.means[1]], [S.sds[0], S.sds[1]], { min: 40, max: 47, step: 1, minor: 5, label: 'Mean height / cm' }, 'n = 10 plants per soil; error bars = ± 1 SD.');

  var KINDS = proseTable(['Bar', 'What it shows', 'When to use it'], [
    ['[[Range|range]]', 'From the lowest value to the highest. Its two arms can differ in length.', 'Fewer than about five repeats, or IGCSE work. Simple, but one unusual value makes it much longer.'],
    ['[[Standard deviation (SD)|standard deviation]]', 'How far, typically, each value lies from the mean.', 'To show how much the data vary. The usual choice for biological data.'],
    ['[[Standard error (SE)|standard error]]', 'How precisely the mean itself is known: SD ÷ √n.', 'When your claim is about the mean. Always shorter than the SD: never choose it because it looks smaller.'],
    ['[[Interquartile range (IQR)|interquartile range]]', 'The middle half of the data, from the first quartile to the third.', 'Skewed data, or data with outliers. Usually drawn as a box-and-whisker plot.']
  ]);

  WUL.station({
    id: 'errorbars', stage: 'show', order: 2, title: 'Error bars', levels: 'ie',
    job: 'Show how far each mean can be trusted: draw a bar for the spread of the repeats, and name the bar in the caption.',
    where: 'On every graph of means, with the kind of bar and n in the figure caption.',

    ladder: {
      g: [],
      i: ['Draw an [[error bar]] on every mean, calculated from your own repeats', 'Name the bar in the caption: range, SD, SE or IQR, with n', 'Use overlap to say what you can and cannot claim'],
      e: ['Choose the bar that fits your claim, and support any claim of a difference with a statistical test']
    },

    build: [
      { type: 'callout', title: 'What an error bar shows', label: 'The one thing to remember', md: 'The dot is what you measured. The bar is how much you should trust it.' },

      { type: 'note', tone: 'igcse', title: 'Error bars at IGCSE', label: 'At IGCSE', md: 'Error bars are not normally required at IGCSE. The simplest way to show the [[spread]] of repeats is the [[range]]: the lowest and the highest value.' },

      { type: 'plot', title: 'Same data, three different bars', spec: threeBars,
        after: 'Only the __choice__ of bar changed. The reader of your report cannot tell which bar you used by looking. Your caption must say.' },

      { type: 'grid2', title: 'Four kinds of bar', items: [
        { label: 'Each bar answers a different question', v: { html: KINDS }, note: 'SD answers “how much do the values vary?”. SE answers “how well is the mean known?”. They are different questions.' }
      ] },

      { type: 'steps', title: 'Draw the error bars', intro: 'The IB amylase data: five trials at each temperature. Press Next step.',
        stage: { plot: amyPlot },
        steps: [
          { title: 'Plot each mean', show: ['paper', 'axis-x', 'axis-y', 'ticks-x', 'ticks-y', 'label-x', 'label-y', 'pts-m', 'line-m'], text: 'Plot the mean of the five trials at each temperature as a small cross.' },
          { title: 'Draw a bar through each mean', show: ['err-m'], text: 'At 40 °C the SD is 5.5 s, so the bar goes from 68.5 s to 79.5 s. A short cap marks each end.' },
          { title: 'Use one kind of bar for every point', show: [], focus: ['err-m'], text: 'Every bar here is ± 1 SD. Mixing SD and SE on one graph makes the points impossible to compare.' },
          { title: 'Name the bars in the caption', show: ['caption'], text: 'Give n and say what the bars are: “(n = 5; error bars = ± 1 SD)”. If a bar is too small to see, say so. Tiny bars are a result: the repeats agreed closely.' }
        ] },

      { type: 'grid2', title: 'Read the overlap', items: [
        { label: 'The bars overlap', tone: 'red', v: { plot: soilsAD }, note: 'Soils A and D: you __cannot__ claim a difference from this graph.' },
        { label: 'The bars do not overlap', tone: 'g', v: { plot: amy4050 }, note: '40 °C and 50 °C: a difference is __likely__. A statistical test can confirm it.' }
      ] },

      { type: 'anatomy', title: 'Write about the overlap',
        intro: 'Name the points, say whether the bars overlap, and say what you can claim.',
        model: '{1:The ± 1 SD bars for 40 °C and 50 °C} {2:do not overlap}, {3:so the shorter mean time at 50 °C is likely to be a real effect of temperature}.\n\n{1:The ± 1 SD bars for soils A and D} {2:overlap}, {3:so these data do not show a difference in height between the two soils}.',
        parts: [
          { n: 1, name: 'Name the two points', note: 'Which means, and which kind of bar.' },
          { n: 2, name: 'Overlap or not', note: 'Compare the ends of the bars, not the crosses.' },
          { n: 3, name: 'What can be claimed', note: '“Likely” or “do not show”. Never “proves”.' }
        ],
        after: 'Overlap is a hint, not proof: only a statistical test can decide. “The bars are quite big” earns nothing.' },

      { type: 'table', title: 'Calculate them in a spreadsheet',
        spec: {
          caption: 'Table 1. Formulas for the five trials at 40 °C, in cells B2 to F2 (70, 80, 70, 80 and 70 s)',
          head: [['Result', 'Formula']],
          rows: [
            ['Mean: 74 s', '=AVERAGE(B2:F2)'],
            ['SD: 5.5 s', '=STDEV.S(B2:F2)'],
            ['SE: 2.4 s', '=STDEV.S(B2:F2)/SQRT(COUNT(B2:F2))'],
            ['Range: 70–80 s', '=MIN(B2:F2) and =MAX(B2:F2)']
          ],
          cls: 'dt--mini'
        },
        after: 'Do not use Excel’s preset “Standard Deviation” error bars. They are calculated from the plotted means, not from the repeats behind each mean. Choose Custom, and select your column of SDs.' },

      { type: 'note', tone: 'ib', title: 'What the IB guide asks', label: 'What the IB guide asks', md: 'Tool 3 asks you to “Express ranges, degrees of precision, standard error or standard deviations as error bars” and to “Draw and interpret uncertainty/error bars”. In D2.3.4, the guide says you do not need to memorise the formulae for SD and SE. But you must use them to analyse data.' },

      { type: 'widget', title: 'Try the error-bar bench', name: 'errorbar-bench' }
    ],

    redpen: {
      i: {
        title: 'An IA results section. Five phrases would lose marks.',
        body: 'Figure 3 shows the mean height of the seedlings in each soil [!a:with error bars]. The error bars were [!b:drawn by eye from the spread of the data]. The bars for soils A and D overlap, [!c:so soil D grows taller plants]. [!d:SE bars were used because they are shorter and look neater]. [!e:This proves that soil type affects growth].',
        notes: {
          a: { label: 'which bars?', why: 'Give n and name the kind of bar: “(n = 10; error bars = ± 1 SD)”.' },
          b: { label: 'calculate them', why: 'Calculate the bars from your repeats with =STDEV.S. Do not estimate them by eye.' },
          c: { label: 'they overlap', why: 'Overlapping bars mean you cannot claim a difference. Write: these data do not show a difference.' },
          d: { label: 'dishonest', why: 'SE answers a different question from SD. Choosing it because it looks smaller hides how much the plants varied.' },
          e: { label: '“proves”?', why: 'A graph never proves. With overlapping bars, the data do not support this claim at all.' }
        },
        fixed: 'Figure 3 shows the mean height of the seedlings in each soil, ==with error bars of ± 1 standard deviation (n = 10)==. The standard deviations were ==calculated from the ten heights with =STDEV.S==. The bars for soils A and D overlap, ==so these data do not show a difference in height between the two soils==. ==SD bars were used because they show how much the plants varied.== ==The data do not support the claim that soil type affects growth.==',
        fixedNote: 'The bars are named and calculated, and the claim now matches what overlapping bars allow.'
      }
    },

    traps: [
      { bad: 'Figure 1. Mean time at each temperature.', good: 'Figure 1. … (n = 5; error bars = ± 1 SD).' },
      { bad: 'SE bars, chosen because they look smaller.', good: 'SD to show the spread of the data; SE to show how well the mean is known.' },
      { bad: 'The bars overlap, so there is a difference.', good: 'The bars overlap, so a difference cannot be claimed from this graph.' },
      { bad: 'Error bars on points that are single measurements.', good: 'Bars only on means of repeats. One value has no spread.' },
      { bad: 'Excel’s preset “Standard Deviation” error bars.', good: 'Custom error bars, from your own column of =STDEV.S values.' },
      { bad: 'SE calculated from the rounded SD: 5.5 ÷ √5 = 2.5 s.', good: 'Use the unrounded SD: 5.477 ÷ √5 = 2.4 s. Or use a spreadsheet.' }
    ],

    test: [
      { type: 'choose', q: 'What does an error bar on a mean show?',
        opts: [
          { t: 'The spread or uncertainty of the values behind that mean', ok: true, why: 'The dot is the mean; the bar shows the spread or uncertainty of the values behind it.' },
          { t: 'The biggest possible mistake in the experiment', why: 'It shows the spread of your repeats. A systematic error does not appear in it at all.' },
          { t: 'The range of the independent variable', why: 'The bar is on the measured variable. It says nothing about the values of the independent variable.' },
          { t: 'Which point is the most accurate', why: 'A short bar shows that the repeats agreed. It cannot show whether they were close to the true value.' }
        ] },
      { type: 'choose', q: 'In Figure 1, which bar is the shortest?',
        show: { plot: threeBars },
        opts: [
          { t: '± 1 SE', ok: true, why: 'SE = SD ÷ √n, so with more than one value it is always shorter than the SD bar.' },
          { t: '± 1 SD', why: 'The SD is longer than the SE: it is √n times as long.' },
          { t: 'Range', why: 'The range reaches the two most extreme values, so here it is the longest.' },
          { t: 'They are always the same length', why: 'In Figure 1 all three come from the same values, and they differ.' }
        ] },
      { type: 'sort', q: 'Which bar would you use?',
        bins: ['Range', 'SD', 'SE', 'IQR'],
        items: [
          { t: 'Three repeats in an IGCSE report', bin: 0, why: 'With so few repeats, the range is simple and honest.' },
          { t: 'You want to show how much ten seedlings varied', bin: 1, why: 'The SD shows how widely the values are spread.' },
          { t: 'Your claim is about how well the mean time is known', bin: 2, why: 'The SE shows how precisely the mean is known.' },
          { t: 'Skewed data with one very large value', bin: 3, why: 'The IQR ignores the extremes, so one large value does not stretch it.' },
          { t: 'A box-and-whisker plot', bin: 3, why: 'The box of a box-and-whisker plot is the interquartile range.' }
        ] },
      { type: 'choose', q: 'Five trials: 70, 80, 70, 80 and 70 s. What does =STDEV.S give?',
        opts: [
          { t: '5.5 s', ok: true, why: 'The mean is 74 s. The squared differences from it add up to 120; 120 ÷ 4 = 30; √30 = 5.5 s.' },
          { t: '4.9 s', why: 'That divides by n, as =STDEV.P does. =STDEV.S divides by n − 1 = 4.' },
          { t: '10 s', why: 'That is the range: 80 − 70.' },
          { t: '2.4 s', why: 'That is the standard error: 5.477 ÷ √5.' }
        ] },
      { type: 'choose', q: 'The SD of nine trials is 6.0 s. What is the SE?',
        opts: [
          { t: '2.0 s', ok: true, why: 'SE = SD ÷ √n = 6.0 ÷ √9 = 6.0 ÷ 3 = 2.0 s.' },
          { t: '0.67 s', why: 'That divides by n (9). Divide by √n (3).' },
          { t: '18 s', why: 'That multiplies by √n. Divide instead.' },
          { t: '6.0 s', why: 'That is the SD itself.' }
        ] },
      { type: 'choose', q: 'The ± 1 SD bars for soils A and B overlap. What can you write?',
        show: { plot: soilsAB },
        opts: [
          { t: 'These data do not show a difference between soils A and B.', ok: true, why: 'Overlapping bars mean a difference cannot be claimed from the graph.' },
          { t: 'Soil B gives taller seedlings than soil A.', why: 'The bars overlap, so the difference could be due to chance.' },
          { t: 'Soils A and B give exactly the same height.', why: 'Overlap does not prove the means are equal. It only means no difference can be claimed.' },
          { t: 'Soil B is significantly better.', why: '“Significantly” needs a statistical test, and here the bars overlap.' }
        ] },
      { type: 'spot', q: 'Tap the three mistakes.',
        text: 'Figure 2. Mean time at each temperature [!a:with error bars]. [?:The bars at 40 °C and 50 °C do not overlap], [!b:which proves] that the rate was higher at 50 °C. [!c:SE bars were chosen because they are shorter].',
        why: { a: 'Give n and name the kind of bar: “(n = 5; error bars = ± 1 SD)”.', b: 'A graph never proves. Write “which suggests”, and let a test decide.', c: 'Never choose a bar because it looks smaller. SD for the spread, SE for how well the mean is known.' } },
      { type: 'build', q: 'Build the sentence that earns the mark.',
        chips: ['The ± 1 SD bars for 40 °C and 50 °C', 'do not overlap,', 'so the difference is likely to be real.', 'which proves the difference.', 'look quite big,'],
        answer: ['The ± 1 SD bars for 40 °C and 50 °C', 'do not overlap,', 'so the difference is likely to be real.'],
        why: 'It names the points and the bars, says whether they overlap, and claims only what overlap allows.' },
      { type: 'choose', q: 'Excel offers preset “Standard Deviation” error bars. Why not use them?',
        opts: [
          { t: 'They are calculated from the plotted means, not from the repeats behind each mean.', ok: true, why: 'Use Custom error bars and select your own column of SDs.' },
          { t: 'They are too short.', why: 'Length is not the problem: they measure the wrong thing.' },
          { t: 'The IB does not allow spreadsheets.', why: 'Spreadsheets are part of Tool 2. The problem is what the preset measures.' },
          { t: 'They only work on bar charts.', why: 'They can be added to most charts. The problem is what they measure.' }
        ] },
      { type: 'choose', q: 'Do you need to memorise the formula for the standard deviation?',
        opts: [
          { t: 'No. You must use and interpret SD and SE, but the formulae need not be memorised.', ok: true, why: 'The IB Biology guide says this in D2.3.4.' },
          { t: 'Yes, for the exam.', why: 'The guide says you are not required to memorise it.' },
          { t: 'No, because SD is not used in Biology.', why: 'You must use SD and SE, and show them as error bars.' },
          { t: 'Only the SE formula.', why: 'Neither formula needs to be memorised.' }
        ] }
    ],

    words: [
      { term: 'error bar', forms: ['error bars', 'uncertainty bar', 'uncertainty bars'], def: 'A line through a plotted mean that shows the spread or uncertainty of the values behind it.', eg: 'A bar from 68.5 to 79.5 s through the mean of 74 s at 40 °C.' },
      { term: 'standard deviation', forms: ['SD', 'standard deviations'], def: 'A measure of how far, typically, the values lie from their mean.', eg: 'Trials of 70, 80, 70, 80 and 70 s have an SD of 5.5 s.' },
      { term: 'standard error', forms: ['SE', 'standard errors', 'standard error of the mean'], def: 'A measure of how precisely the mean is known: the SD divided by the square root of n.', eg: 'SD 6.0 s from nine trials: SE = 6.0 ÷ √9 = 2.0 s.' },
      { term: 'range', forms: ['range of data'], def: 'The spread of repeated values, from the lowest to the highest.', eg: 'Trials of 50, 50, 60, 50 and 60 s have a range of 50–60 s.' },
      { term: 'interquartile range', forms: ['IQR', 'interquartile ranges'], def: 'The spread of the middle half of the values, from the first quartile to the third.', eg: 'The box of a box-and-whisker plot.' },
      { term: 'spread', forms: ['dispersion'], def: 'How far repeated values are scattered around their mean.', eg: 'Trials of 70–80 s have a small spread; trials of 40–110 s have a large one.' }
    ],

    further: [
      { title: 'How large a gap do SE bars need?',
        md: 'Soils A and D show a problem. Their SE bars do __not__ overlap, yet a t-test gives t = 2.00, df = 18, p = 0.06: not significant. With about ten values in each group, SE bars need a gap of about one SE before p falls to 0.05.\n\nThe same paper gives a second rule: draw error bars only from independent repeats, never from repeat measurements of one sample.',
        cite: 'Cumming, Geoff, Fiona Fidler, and David L. Vaux. “Error Bars in Experimental Biology.” *Journal of Cell Biology*, vol. 177, no. 1, 2007, pp. 7–11.' }
    ],

    sources: ['IB Biology guide (2025), Tool 3, pp. 30–31', 'IB Biology guide (2025), D2.3.4', 'D. Mompel Riera, *Error bars — Biology IGCSE and IB*']
  });
})(window.WUL);
