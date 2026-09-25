/* station: processing — from raw data to the numbers that answer the question.
   Means, rates, percentage change, significant figures, one worked example, spreadsheet formulas, anomalies.
   SD itself is taught in the errorbars station: here it is only linked. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase, G = A.g, I = A.i;
  function nb(t) { return String(t).replace(/ \/ /g, ' / ').replace(/ ± /g, ' ± '); }
  function T(spec, cls) {
    (spec.head || []).forEach(function (row) { row.forEach(function (c, k) { if (typeof c === 'string') row[k] = nb(c); else if (c && c.t) c.t = nb(c.t); }); });
    if (cls) spec.cls = cls;
    return spec;
  }
  var FIT = 'wd-table-fixer--fit', CMP = 'wd-table-fixer--compact';

  /* the walkthrough: the 50 °C row, from three trials to a mean */
  var r50 = 3;                                   /* 50 °C in WUL.data.amylase.g */
  var tr = G.trials[r50], sum = tr[0] + tr[1] + tr[2];
  var line = function (el, html) { return '<p data-el="' + el + '" style="margin:0;padding:4px 8px;border-radius:3px;font:500 1.02rem/1.5 var(--mono)">' + html + '</p>'; };
  var meanStage = '<div class="wd-table-fixer--calc">' + WUL.table(T({
    head: [[{ t: 'Temperature / °C', rs: 2, el: 'h-iv' }, { t: 'Time for starch to disappear / s', cs: 4, el: 'h-dv' }],
      [{ t: 'Trial 1', el: 'h-t1' }, { t: 'Trial 2', el: 'h-t2' }, { t: 'Trial 3', el: 'h-t3' }, { t: 'Mean', el: 'h-mean' }]],
    rows: [[{ t: String(G.temps[r50]), el: 'iv' }, { t: String(tr[0]), el: 't-1' }, { t: String(tr[1]), el: 't-2' }, { t: String(tr[2]), el: 't-3' }, { t: String(G.means[r50]), el: 'mean' }]]
  }, FIT)) +
    '<div style="display:grid;gap:4px;margin-top:14px">' +
    line('add', tr[0] + ' + ' + tr[1] + ' + ' + tr[2] + ' = ' + sum) +
    line('div', sum + ' ÷ 3 = ' + (sum / 3).toFixed(3) + '…') +
    line('round', (sum / 3).toFixed(3) + '… → <b>' + G.means[r50] + '</b> <span style="font:400 .92rem var(--sans);color:var(--ink-2)">whole seconds, like the raw data</span>') +
    '</div></div>';

  WUL.station({
    id: 'processing', stage: 'record', order: 2, title: 'Processing data', levels: 'gie',
    job: 'Convert the raw data into the numbers that answer the question: means, rates and percentage changes, each shown once as a worked example.',
    where: {
      g: 'Not a section of its own: inside your Results. The mean goes in the table; any other calculation goes just below it.',
      i: 'Not a section of its own: inside your Data analysis, not the method. Show one worked example of each calculation, between the raw-data table and the processed-data table.',
      e: 'Not a section of its own: in the body, beside the processed tables. Never only in an appendix.'
    },

    ladder: {
      g: ['The [[mean]] of the trials, to the same [[decimal places]] as the raw data (our rule)', 'A [[rate]] or a [[percentage change]] when the question asks for one', 'An [[anomalous result]] excluded from the mean only with a stated reason'],
      i: ['One [[worked example]] of every calculation, then “repeated for all values”', 'Only processing that helps answer the research question', 'The spread as well as the mean: the [[standard deviation]]', '“Identify and justify the removal or inclusion of outliers” (IB skills list)'],
      e: ['Worked examples in the body, next to the tables they explain', 'The spreadsheet formulas named, so every step can be checked']
    },

    build: [
      { type: 'steps', title: 'From three trials to a mean',
        intro: 'The amylase data at 50 °C. Press __Next step__.',
        stage: { html: meanStage },
        always: ['h-iv', 'h-dv', 'h-t1', 'h-t2', 'h-t3', 'h-mean', 'iv'],
        steps: [
          { title: 'Start with the raw data', text: 'Three times at 50 °C: 50, 50 and 60 s. First check: is any one far from the others?', show: ['t-1', 't-2', 't-3'] },
          { title: 'Add them', text: '50 + 50 + 60 = 160.', show: ['add'] },
          { title: 'Divide by the number of trials', text: '160 ÷ 3 = 53.333… A calculator gives more digits than the data can support.', show: ['div'] },
          { title: 'Round to match the raw data', text: 'The raw data are whole seconds, so the [[mean]] is too: 53. Round only at the end.', show: ['round'] },
          { title: 'Write it in the table', text: '53 goes in the Mean column, with no unit. Then do the same for every temperature.', show: ['mean'] }
        ] },

      { type: 'table', title: 'Four calculations you will use',
        spec: T({
          head: [['Calculation', 'Formula', 'Worked example']],
          rows: [
            ['[[Mean]]', 'sum of the values ÷ number of values', '(50 + 50 + 60) ÷ 3 = 53 s'],
            ['[[Rate]] from a time', '1 ÷ time', '1 ÷ 53 s = 0.0189 s⁻¹'],
            ['Rate from a change', 'change ÷ time', '4.9 cm³ ÷ 5 min = 0.98 cm³ min⁻¹'],
            ['[[Percentage change]]', '(new − original) ÷ original × 100', '(2.28 − 2.49) ÷ 2.49 × 100 = −8.4 %']
          ]
        }, CMP),
        after: 'A rate is a [[derived quantity]]: it is calculated, not read from an instrument. Its unit is always “per time”.' },

      { type: 'anatomy', title: 'The parts of a worked example',
        intro: 'Show each calculation once, in full. Tap a colour to see each part.',
        model: '{1:Rate = 1 ÷ mean time}\n{2:= 1 ÷ 73 s}\n{3:= 0.0137 s⁻¹}, {4:given to 4 decimal places, like every rate in the column}.\n\n{5:This was repeated for all five temperatures.}',
        parts: [
          { n: 1, name: 'The formula', note: 'In words or symbols, before any number.' },
          { n: 2, name: 'The numbers, with units', note: 'The values from the table, put into the formula.' },
          { n: 3, name: 'The answer, with its unit', note: 'A rate has a “per time” unit: s⁻¹.' },
          { n: 4, name: 'The right decimal places', note: 'The same as the rest of the column. Round only at the end.' },
          { n: 5, name: '“Repeated for all values”', note: 'One [[worked example]] is enough. Then say it was repeated.' }
        ] },

      { type: 'compare', title: 'Calculate a percentage change',
        bad: 'Percentage change in mass\n= (2.49 − 2.28) ÷ 2.28 × 100\n= 9.2 %',
        good: 'Percentage change in mass\n= (==2.28 − 2.49==) ÷ ==2.49== × 100\n= ==−8.4 %==',
        badLabel: 'Wrong order', goodLabel: 'New minus original, ÷ original',
        why: 'Subtract the original value from the new one, then divide by the __original__. The mass fell, so the change is negative.' },

      { type: 'table', title: 'Counting significant figures',
        spec: T({
          head: [['Number', 'Significant figures', 'Why']],
          rows: [
            ['178', '3', 'Every non-zero digit counts.'],
            ['0.0056', '2', 'Leading zeros do not count.'],
            ['2.08', '3', 'A zero between digits counts.'],
            ['5.60', '3', 'A final zero after the point counts.']
          ]
        }),
        after: '[[Significant figures]] count from the first non-zero digit. [[Decimal places]] count from the point.' },

      { type: 'compare', title: 'When to exclude a result',
        bad: { table: T({ head: [[{ t: 'Distance / cm', rs: 2 }, { t: 'Volume of gas collected in 5 min / cm³', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
          rows: [['10', '4.8', '5.0', '1.2', '==3.7=='], ['20', '3.2', '3.0', '3.3', '3.2']] }, CMP) },
        good: { table: T({ head: [[{ t: 'Distance / cm', rs: 2 }, { t: 'Volume of gas collected in 5 min / cm³', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
          rows: [['10', '4.8', '5.0', '==1.2 *==', '==4.9=='], ['20', '3.2', '3.0', '3.3', '3.2']],
          note: '* Anomalous: the syringe was found to leak. Excluded from the mean.' }, CMP) },
        badLabel: 'Anomaly hidden in the mean', goodLabel: 'Excluded, with a reason',
        why: 'Keep the [[anomalous result]] in the table, mark it, and say why it was excluded. If you can, repeat that trial.' },

      { type: 'table', title: 'Means in a spreadsheet',
        spec: { cls: 'dt--mini',
          head: [['', 'A', 'B', 'C', 'D', 'E']],
          rows: [
            ['1', 'Temperature / °C', 'Trial 1', 'Trial 2', 'Trial 3', 'Mean'],
            ['2', '20', '180', '170', '190', '180'],
            ['3', '30', '120', '110', '120', '===AVERAGE(B3:D3)==']
          ] },
        after: 'The cell shows 116.666… until you set its number format to 0 decimal places. Then it shows 117.' },

      { type: 'rules', title: 'Rules for processing data', items: [
        'A [[mean]] has no more [[decimal places]] than the raw data. (Our rule: Cambridge questions usually state the rounding.)',
        'Round only at the end, never in the middle of a calculation.',
        'A [[rate]] has a “per time” unit: s⁻¹, cm³ min⁻¹.',
        '[[Percentage change]] = (new − original) ÷ original × 100. A decrease is negative.',
        'Exclude an [[anomalous result]] from a mean only with a stated reason. Keep it in the table.',
        'One [[worked example]] of each calculation, then “repeated for all values”.',
        { t: 'In a spreadsheet: =AVERAGE(…) for the mean, =STDEV.S(…) for the [[standard deviation]].', lv: 'ie' },
        { t: 'Process only what helps answer the research question.', lv: 'ie' }
      ] },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'What the IB guide asks', title: 'Accurate and relevant processing',
        md: 'Data analysis, top band: processing relevant to the research question, “carried out appropriately and accurately”. “Precise” means following conventions for units, decimal places and significant figures. The skills list adds: “identify and justify the removal or inclusion of outliers”.' },

      { type: 'frames', title: 'Sentence frames for calculations', items: [
        'The mean ___ at ___ was (___ + ___ + ___) ÷ 3 = ___ ___.',
        'The rate was calculated as 1 ÷ ___ = ___ ___. This was repeated for all values.',
        'The percentage change was (___ − ___) ÷ ___ × 100 = ___ %.',
        'The value of ___ was excluded from the mean because ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student processed the amylase results. Four things need the red pen.',
        body: 'Mean time at 30 °C = (120 + 110 + 120) ÷ 3 = [!tf-a:116.667 s].\n\nRate at 30 °C = [!tf-b:1 ÷ 117 = 0.0085].\n\nFrom 20 °C to 50 °C, the mean time [!tf-c:changed by 70 %].\n\n[!tf-d:Trial 3 at 50 °C (60 s) was not used in the mean.]',
        notes: {
          'tf-a': { label: 'd.p.!', why: 'The raw data are whole seconds, so the mean is too: __117 s__.' },
          'tf-b': { label: 'unit?', why: 'A rate needs its unit: 1 ÷ 117 s = __0.0085 s⁻¹__.' },
          'tf-c': { label: 'up or down?', why: 'Give the direction and the calculation: the mean time __decreased by 71 %__, because (53 − 180) ÷ 180 × 100 = −71 %.' },
          'tf-d': { label: 'why?', why: '60 s is only one sample (10 s) away from the other trials, so it is not anomalous. Exclude a value only with a stated reason.' }
        },
        fixed: 'Mean time at 30 °C = (120 + 110 + 120) ÷ 3 = ==117 s==.\n\nRate at 30 °C = 1 ÷ 117 s = ==0.0085 s⁻¹==.\n\nFrom 20 °C to 50 °C, the mean time ==decreased by 71 %==: (53 − 180) ÷ 180 × 100 = −71 %.\n\n==All three trials at 50 °C were used==: 60 s is within one sample (10 s) of the others.',
        fixedNote: 'The mean matches the raw data, and the rate has its unit. The change has a direction. No value is dropped without a reason.'
      },
      i: {
        title: 'An IA processing section. Five things would keep it out of the top band.',
        body: 'Table 2 shows the processed data. [!tf-a:The means were calculated in Excel.]\n\nRate at 60.0 °C = 1 ÷ 98 = [!tf-b:0.0102].\n\nStandard deviation at 20.0 °C = [!tf-c:8.36660027] s.\n\n[!tf-d:There were no outliers.]\n\n[!tf-e:The mean times were also converted into minutes and into hours.]',
        notes: {
          'tf-a': { label: 'show one!', why: 'Give one worked example of each calculation: mean at 20.0 °C = (180 + 170 + 190 + 180 + 170) ÷ 5 = 178 s. Then write “repeated for all temperatures”.' },
          'tf-b': { label: 'unit?', why: '1 ÷ 98 s = __0.0102 s⁻¹__, which is 10.2 × 10⁻³ s⁻¹.' },
          'tf-c': { label: 'd.p.!', why: 'The means are in whole seconds, so give the SD to one more decimal place: __8.4 s__ (our rule).' },
          'tf-d': { label: 'how do you know?', why: 'Justify it: __no trial was more than 20 s (two sampling intervals) from its mean__. The IB asks for the removal or inclusion of outliers to be justified.' },
          'tf-e': { label: 'relevant?', why: 'The research question is about the time in seconds. Processing that does not help answer it adds nothing.' }
        },
        fixed: 'Table 2 shows the processed data. ==One worked example of each calculation is given==: mean time at 20.0 °C = (180 + 170 + 190 + 180 + 170) ÷ 5 = 178 s; this was repeated for all temperatures.\n\nRate at 60.0 °C = 1 ÷ 98 s = ==0.0102 s⁻¹==.\n\nStandard deviation at 20.0 °C = ==8.4 s== (spreadsheet: =STDEV.S(B2:F2)).\n\n==All trials were included==: no trial was more than 20 s (two sampling intervals) from its mean.',
        fixedNote: 'Every calculation is shown once. Every value has its unit and sensible decimal places. The decision about outliers is justified.'
      }
    },

    traps: [
      { bad: 'Mean = 116.666667 s', good: 'Mean = 117 s: whole seconds, like the raw data.' },
      { bad: 'Rate = 0.0085', good: 'Rate = 0.0085 s⁻¹. A rate always has a “per time” unit.' },
      { bad: '% change = (2.49 − 2.28) ÷ 2.28 × 100 = 9.2 %', good: '(2.28 − 2.49) ÷ 2.49 × 100 = −8.4 %: new minus original, divided by the original.' },
      { bad: '1.2 cm³ was ignored.', good: '1.2 cm³ was excluded from the mean because the syringe leaked. It stays in the table.' },
      { bad: 'The means were calculated in Excel.', good: 'Mean at 20.0 °C = (180 + 170 + 190 + 180 + 170) ÷ 5 = 178 s. Repeated for all.', lv: 'ie' },
      { bad: 'The times were converted to minutes, hours and days.', good: 'Only the processing that helps answer the research question.', lv: 'ie' }
    ],

    test: [
      { type: 'choose', q: 'Three trials: 70, 80 and 70 s. Using our rule (no more decimal places than the raw data), which mean goes in the table?',
        opts: [
          { t: '73', ok: true, why: '220 ÷ 3 = 73.3…, given in whole seconds like the raw data.' },
          { t: '73.3', why: 'One more decimal place than the raw data.' },
          { t: '73.33', why: 'Two more decimal places than the raw data.' },
          { t: '75', why: 'That is halfway between 70 and 80. The mean uses all three values.' }
        ] },
      { type: 'choose', q: 'The mean time at 50 °C is 53 s. What is the rate?',
        opts: [
          { t: '0.0189 s⁻¹', ok: true, why: '1 ÷ 53 = 0.018868…, which is 0.0189 to 4 decimal places.' },
          { t: '53 s⁻¹', why: 'That is the time with a new unit. Rate = 1 ÷ time.' },
          { t: '0.0189 s', why: 'The unit of a rate is “per second”: s⁻¹.' },
          { t: '1.89 s⁻¹', why: '1 ÷ 53 is about 0.02, not about 2.' }
        ] },
      { type: 'choose', q: 'A potato cylinder went from 2.50 g to 2.71 g. What is the percentage change in mass?',
        opts: [
          { t: '+8.4 %', ok: true, why: '(2.71 − 2.50) ÷ 2.50 × 100 = +8.4 %. The mass increased, so it is positive.' },
          { t: '+7.7 %', why: 'That divides by the final mass, 2.71 g. Divide by the original.' },
          { t: '−8.4 %', why: 'The mass increased, so the change is positive.' },
          { t: '0.21 %', why: '0.21 g is the change in mass, not a percentage.' }
        ] },
      { type: 'build', q: 'Build the worked example for the rate at 40 °C (mean time 73 s).',
        chips: ['Rate', '= 1 ÷ mean time', '= 1 ÷ 73 s', '= 0.0137 s⁻¹', '= 0.0137 s', '= 73 ÷ 1'],
        answer: ['Rate', '= 1 ÷ mean time', '= 1 ÷ 73 s', '= 0.0137 s⁻¹'],
        why: 'Formula, numbers with units, then the answer with its unit.' },
      { type: 'order', q: 'Put the steps for a mean in order.',
        items: ['Check the trials for an anomalous result', 'Add the trials', 'Divide by the number of trials', 'Round to the decimal places of the raw data', 'Write the mean in the table, with no unit'],
        why: 'Check first, calculate, round at the end, then record.' },
      { type: 'sort', q: 'Raw data or processed data?',
        bins: ['Raw data', 'Processed data'],
        items: [
          { t: '180 s: trial 1 at 20 °C', bin: 0, why: 'Read straight from the stopwatch.' },
          { t: 'Mean time at 30 °C: 117 s', bin: 1, why: 'Calculated from three trials.' },
          { t: 'Rate at 30 °C: 0.0085 s⁻¹', bin: 1, why: 'Calculated from the mean time.' },
          { t: 'Mass of a cylinder before soaking: 2.49 g', bin: 0, why: 'Read straight from the balance.' },
          { t: 'Percentage change in mass: −8.4 %', bin: 1, why: 'Calculated from two masses.' },
          { t: 'Volume read from the syringe: 4.8 cm³', bin: 0, why: 'Read straight from the scale.' }
        ] },
      { type: 'choose', q: 'How many significant figures does 0.0056 have?',
        opts: [
          { t: '2', ok: true, why: 'Only 5 and 6 count. The zeros before them only place the decimal point.' },
          { t: '4', why: 'Zeros before the first non-zero digit do not count.' },
          { t: '5', why: 'Count from the first non-zero digit, the 5.' },
          { t: '1', why: 'Both the 5 and the 6 count.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'In an IA, one trial is far from the others. What does the IB skills list ask for?',
        opts: [
          { t: 'Identify it, and justify removing it or keeping it', ok: true, why: 'The skills list says: “identify and justify the removal or inclusion of outliers”.' },
          { t: 'Delete it without comment', why: 'Removal must be justified, in the report.' },
          { t: 'Always keep it', why: 'A value with a known cause, such as a leak, can be removed if the reason is given.' },
          { t: 'Replace it with the mean of the others', why: 'That invents data.' }
        ] },
      { type: 'multi', lv: 'ie', q: 'Which belong in the processing section of an IA?',
        opts: [
          { t: 'One worked example of each calculation', ok: true },
          { t: 'The mean and standard deviation at each temperature', ok: true },
          { t: 'The rate, if the conclusion uses it', ok: true },
          { t: 'The times converted to minutes, hours and days', why: 'Not relevant to the research question.' },
          { t: 'Every cell of the spreadsheet, typed out', why: 'One worked example of each calculation is enough.' }
        ],
        why: 'Processing must be relevant to the research question and carried out accurately (IB Biology guide, Data analysis criterion).' }
    ],

    words: [
      { term: 'mean', forms: ['means', 'average', 'averages'], def: 'The sum of the values divided by the number of values.', eg: '(70 + 80 + 70) ÷ 3 = 73 s' },
      { term: 'rate', forms: ['rates', 'rate of reaction'], def: 'How much something changes in one unit of time.', eg: '1 ÷ 73 s = 0.0137 s⁻¹; 4.9 cm³ ÷ 5 min = 0.98 cm³ min⁻¹' },
      { term: 'percentage change', forms: ['percentage changes', '% change'], def: '(new value − original value) ÷ original value × 100. A decrease is negative.', eg: '(2.28 − 2.49) ÷ 2.49 × 100 = −8.4 %' },
      { term: 'significant figures', forms: ['significant figure', 's.f.'], def: 'The digits in a number that carry meaning, counted from the first non-zero digit.', eg: '0.0056 has 2 significant figures.' },
      { term: 'worked example', forms: ['worked examples'], def: 'One calculation written in full: formula, numbers with units, and the answer with its unit.', eg: 'Rate = 1 ÷ 73 s = 0.0137 s⁻¹' },
      { term: 'derived quantity', forms: ['derived quantities'], def: 'A quantity calculated from measured values, rather than read from an instrument.', eg: 'A rate, calculated from a time.' }
    ],

    sources: ['IB Biology guide (2025), Tool 3 and Inquiry 2, pp. 28–33', 'IB Biology guide (2025), Data analysis criterion, pp. 120–123', 'Cambridge 0610 syllabus 2026–2028, pp. 10, 55', '0610 Paper 6 mark schemes, 2021–2025 (anomalous results)']
  });
})(window.WUL);
