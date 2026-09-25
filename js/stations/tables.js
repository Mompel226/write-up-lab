/* station: tables — one of the two flagship stations. Record every measurement so a reader can check it.
   Numbers: WUL.data.amylase (IGCSE 3 trials, IB 5 trials). Cambridge facts: RESEARCH-cambridge.md "Tables". */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase, G = A.g, I = A.i;
  function ids(p, n) { var a = []; for (var k = 1; k <= n; k++) a.push(p + '-' + k); return a; }
  function f1(v) { return v.toFixed(1); }
  /* a heading may break before the solidus or the ±, never after it: "Time" / "/ s ± 10" */
  function nb(t) { return String(t).replace(/ \/ /g, ' /\u00a0').replace(/ ± /g, ' ±\u00a0').replace(/10⁻³ s⁻¹/g, '10⁻³\u00a0s⁻¹'); }
  function T(spec, cls) {
    (spec.head || []).forEach(function (row) { row.forEach(function (c, k) { if (typeof c === 'string') row[k] = nb(c); else if (c && c.t) c.t = nb(c.t); }); });
    if (cls) spec.cls = cls;
    return spec;
  }
  var RP = 'wd-table-fixer--rp', CMP = 'wd-table-fixer--compact', FIT = 'wd-table-fixer--fit';

  /* ---- the IGCSE table, cell by cell, for the walkthrough ---- */
  var igcseSteps = T({
    caption: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.', capEl: 'title',
    head: [
      [{ t: 'Temperature / °C', rs: 2, el: 'iv-head' }, { t: 'Time for starch to disappear / s', cs: 4, el: 'dv-head' }],
      [{ t: 'Trial 1', el: 'trial-1' }, { t: 'Trial 2', el: 'trial-2' }, { t: 'Trial 3', el: 'trial-3' }, { t: 'Mean', el: 'mean-head' }]
    ],
    rows: G.temps.map(function (T, r) {
      return [{ t: String(T), el: 'iv-' + (r + 1) }]
        .concat(G.trials[r].map(function (v, k) { return { t: String(v), el: 'raw-' + (r * 3 + k + 1) }; }))
        .concat([{ t: String(G.means[r]), el: 'mean-' + (r + 1) }]);
    })
  }, FIT);

  /* ---- the same data, plain (for the side-by-side) ---- */
  var igcsePlain = T({
    caption: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.',
    head: [[{ t: 'Temperature / °C', rs: 2 }, { t: 'Time for starch to disappear / s', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
    rows: G.temps.map(function (T, r) { return [String(T)].concat(G.trials[r].map(String)).concat([String(G.means[r])]); })
  }, CMP);

  /* ---- two maths habits, drawn from the same data: shown only as mistakes ---- */
  function across(k) { return G.temps.map(function (T, r) { return String(k < 3 ? G.trials[r][k] : G.means[r]); }); }
  var sideways = T({
    caption: igcsePlain.caption,
    head: [['Temperature / °C'].concat(G.temps.map(String))],
    rows: [0, 1, 2, 3].map(function (k) { return [{ t: k < 3 ? 'Time, trial ' + (k + 1) + ' / s' : 'Mean time / s', th: true }].concat(across(k)); })
  }, CMP);
  var mathsTable = T({
    caption: igcsePlain.caption,
    head: [[{ diag: ['Temperature / °C', 'Trial'] }].concat(G.temps.map(String))],
    rows: [0, 1, 2, 3].map(function (k) { return [{ t: k < 3 ? String(k + 1) : 'Mean', th: true }].concat(across(k)); })
  }, CMP);

  /* ---- the IB tables: raw data, then processed data ---- */
  function ibRaw(withEl) {
    return T({
      caption: 'Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5).', capEl: withEl ? 'r-title' : null,
      head: [
        [{ t: 'Temperature / °C ± 0.5', rs: 2, el: withEl ? 'r-ivh' : null }, { t: 'Time for starch to disappear / s ± 10', cs: 5, el: withEl ? 'r-dvh' : null }],
        [1, 2, 3, 4, 5].map(function (k) { return { t: 'Trial ' + k, el: withEl ? 'r-trial-' + k : null }; })
      ],
      rows: I.temps.map(function (T, r) {
        return [{ t: f1(T), el: withEl ? 'r-iv-' + (r + 1) : null }]
          .concat(I.trials[r].map(function (v, k) { return { t: String(v), el: withEl ? 'r-raw-' + (r * 5 + k + 1) : null }; }));
      })
    }, withEl ? FIT : CMP);
  }
  function ibProc(withEl) {
    return T({
      caption: 'Table 2. Processed data showing the effect of temperature (20.0–60.0 °C) on the mean time, standard deviation and rate of starch digestion by fungal α-amylase (n = 5).', capEl: withEl ? 'p-title' : null,
      head: [[{ t: 'Temperature / °C ± 0.5', el: withEl ? 'p-ivh' : null }, { t: 'Mean time / s', el: withEl ? 'p-mh' : null },
        { t: 'Standard deviation / s', el: withEl ? 'p-sdh' : null }, { t: 'Rate / 10⁻³ s⁻¹', el: withEl ? 'p-rh' : null }]],
      rows: I.temps.map(function (T, r) {
        var n = r + 1;
        return [{ t: f1(T), el: withEl ? 'p-iv-' + n : null }, { t: String(I.means[r]), el: withEl ? 'p-mean-' + n : null },
          { t: f1(I.sds[r]), el: withEl ? 'p-sd-' + n : null }, { t: f1(I.rates[r]), el: withEl ? 'p-rate-' + n : null }];
      })
    }, withEl ? FIT : CMP);
  }
  var calcLine = '<div class="prose" data-el="calc" style="margin-top:14px;padding:10px 12px;border-left:3px solid var(--lvl);background:var(--sheet-2);font:400 .98rem/1.6 var(--serif)">' +
    WUL.md('**Worked example, 20.0 °C.** Mean = (180 + 170 + 190 + 180 + 170) ÷ 5 = 178 s. Rate = 1 ÷ 178 s = 0.0056 s⁻¹ = 5.6 × 10⁻³ s⁻¹. Repeated for all temperatures.', { inline: true }) + '</div>';
  var ibStage = WUL.table(ibRaw(true)) + '<div style="height:18px"></div>' + WUL.table(ibProc(true)) + calcLine;
  var ibPlain = WUL.table(ibRaw(false)) + '<div style="height:12px"></div>' + WUL.table(ibProc(false));

  WUL.station({
    id: 'tables', stage: 'record', order: 1, title: 'Results tables', levels: 'gie',
    job: {
      g: 'Record every measurement in one clear table, so a reader can check every number.',
      i: 'Record every measurement, then every calculated value, in clear tables, so a reader can check each step.'
    },
    where: {
      g: 'In the Results, straight after the method, before the graph.',
      i: 'Inside your Data analysis, before the graphs.',
      e: 'In the body: the processed tables and a sample of the raw data. Most of the raw data go in an appendix.'
    },

    ladder: {
      g: ['One ruled table, with a numbered title above it that names both variables', 'The [[independent variable]] in the first column; the trials, then the [[mean]], on the right', 'Units once, in each [[column heading]]: Time / s', 'The same number of [[decimal places]] down each column'],
      i: ['[[Raw data]] and [[processed data]] clearly separated (our rule: two labelled tables)', 'The uncertainty in each raw-data heading: Time / s ± 10', 'One [[worked example]] of each calculation', 'Our rule: a table never breaks across a page'],
      e: ['The processed tables in the body; most of the raw data in an [[appendix]]', 'A representative sample of the raw data in the body: examiners are not required to read appendices', 'Tables do not count towards the 4,000 words']
    },

    build: [
      { type: 'steps', title: 'Build a table in 8 steps',
        intro: 'The amylase experiment. Press __Next step__ to add one part at a time.',
        stage: { table: igcseSteps },
        steps: [
          { title: 'Rule the grid', text: 'Use a ruler, or a spreadsheet. One row for the headings, then one row for each temperature.', show: [] },
          { title: 'The independent variable goes first', text: 'It runs __down the first column__, never across the top. Its [[column heading]] is the quantity, a [[solidus]], then the unit: Temperature / °C.', show: ['iv-head'] },
          { title: 'Its values, in increasing order', text: '20, 30, 40, 50, 60. No unit beside the numbers: the heading already gives it.', show: ids('iv', 5) },
          { title: 'The dependent variable spans the time columns', text: 'One heading over all the time columns. The unit, s, is written once, here.', show: ['dv-head'] },
          { title: 'One column for each trial', text: 'Trial 1, Trial 2, Trial 3. Repeats let you spot an [[anomalous result]].', show: ids('trial', 3) },
          { title: 'The raw data', text: 'Every reading, as a number only. All whole seconds, because the iodine was tested every 10 s.', show: ids('raw', 15) },
          { title: 'The mean goes on the right', text: 'It is calculated from the trials, so it comes after them. Whole seconds, like the [[raw data]].', show: ['mean-head'].concat(ids('mean', 5)) },
          { title: 'The title goes above', text: 'Number it, then name both variables: “Table 1. Data showing the effect of ==temperature (20–60 °C)== on ==the time taken for amylase to digest starch==.”', show: ['title'] }
        ] },

      { type: 'compare', title: 'Down the first column, not across the top',
        bad: { table: sideways }, good: { table: igcsePlain },
        badLabel: 'Temperature across the top row', goodLabel: 'Temperature down the first column',
        why: 'In biology, the [[independent variable]] runs __down the first column__, one row for each value. Read across a row: one temperature, its three trials, its mean. Cambridge examiners advise this layout. It also matches the graph: the first column becomes the x-axis.' },

      { type: 'compare', title: 'No diagonal line in the corner',
        bad: { table: mathsTable }, good: { table: igcsePlain },
        badLabel: 'Maths table: a diagonal corner', goodLabel: 'Biology table: one heading per column',
        why: 'A diagonal corner squeezes two headings into one box. Here the time, the thing you measured, has no heading and no unit at all. It works in maths, but never in a biology report: every column gets its own heading, __quantity / unit__.' },

      { type: 'anatomy', title: 'The parts of a table title',
        intro: 'Every table title follows the same pattern. Tap a colour to see each part. The variables in the title match the column headings.',
        model: { table: T({
          caption: '{1:Table 1.} {2:Data} {3:showing the effect of} {4:temperature (20–60 °C)} {3:on} {5:the time taken for amylase to digest starch}.',
          head: [[{ t: '{4:Temperature / °C}', rs: 2 }, { t: '{5:Time for starch to disappear / s}', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
          rows: G.temps.slice(0, 2).map(function (T, r) { return [String(T)].concat(G.trials[r].map(String)).concat([String(G.means[r])]); })
        }, CMP) },
        parts: [
          { n: 1, name: 'Number', note: 'Table 1, Table 2 … in the order the tables appear.' },
          { n: 2, name: 'Data', note: 'One word is enough at IGCSE: your one table holds the readings and the means. At IB, this word becomes __Raw data__ or __Processed data__.' },
          { n: 3, name: 'The joining words', note: '“showing the effect of … on …”: the same words in every title.' },
          { n: 4, name: 'Independent variable, with its range', note: 'What you changed, from the lowest to the highest value. It matches the first column heading.' },
          { n: 5, name: 'Dependent variable', note: 'What you measured, and in what: the time taken for __amylase__ to digest __starch__. It matches the other heading.' }
        ],
        after: 'Only the coloured words change from one experiment to the next. “Results” or “Raw data” on its own tells the reader nothing.' },

      { type: 'anatomy', lv: 'g', title: 'The parts of a column heading',
        intro: 'Tap a colour to see each part.',
        model: { table: {
          head: [['{1:Temperature} {2:/}\u00a0{3:°C}', '{1:Mean time for starch to disappear} {2:/}\u00a0{3:s}']],
          rows: G.temps.map(function (T, r) { return [String(T), String(G.means[r])]; })
        } },
        parts: [
          { n: 1, name: 'Quantity', note: 'What was measured, in full words. Not “Temp” or “Time”: time for what?' },
          { n: 2, name: 'Solidus', note: 'A slash. It means “divided by”, so the numbers below are pure numbers.' },
          { n: 3, name: 'Unit', note: 'The symbol: s, °C, g, cm³. Written once, here, never in the cells.' }
        ],
        after: 'Some books write Time (s). Cambridge papers print Time / s, so write that.' },

      { type: 'anatomy', lv: 'ie', title: 'The parts of a raw-data heading',
        intro: 'At IB a raw-data heading has four parts. Tap a colour to see each one.',
        model: { table: {
          caption: 'Part of Table 1 (trial 1 only)',
          head: [['{1:Temperature} {2:/}\u00a0{3:°C} {4:±\u00a00.5}', '{1:Time for starch to disappear} {2:/}\u00a0{3:s} {4:±\u00a010}']],
          rows: I.temps.map(function (T, r) { return [f1(T), String(I.trials[r][0])]; })
        } },
        parts: [
          { n: 1, name: 'Quantity', note: 'What was measured, in full words.' },
          { n: 2, name: 'Solidus', note: 'It means “divided by”, so the numbers below are pure numbers.' },
          { n: 3, name: 'Unit', note: 'The symbol, written once, here.' },
          { n: 4, name: 'Uncertainty', note: '± 10: the iodine was tested every 10 s, so each time is known only to within 10 s. The stopwatch’s 0.01 s does not matter.' }
        ],
        after: 'The [[uncertainty]] comes from the method, not always from the instrument. It is written once, in the heading, never in the cells.' },

      { type: 'compare', title: 'Where the unit goes',
        bad: { table: { head: [['Temperature', 'Mean time']], rows: G.temps.map(function (T, r) { return [T + '\u00a0==°C==', G.means[r] + '\u00a0==s==']; }) } },
        good: { table: { head: [['Temperature\u00a0==/\u00a0°C==', 'Mean time\u00a0==/\u00a0s==']], rows: G.temps.map(function (T, r) { return [String(T), String(G.means[r])]; }) } },
        badLabel: 'Units in every cell', goodLabel: 'Units once, in the heading',
        why: 'The heading says what every number below it is. Units in the cells is the error Cambridge examiners report most often: in 33 of 34 recent Paper 6 reports.' },

      { type: 'compare', title: 'Same decimal places down a column',
        bad: { table: T({ head: [['Temperature / °C', 'Mean time / s']], rows: [['20', '180'], ['==30.0==', '==116.7=='], ['40', '==73.33=='], ['==50.00==', '53'], ['60', '==93.3==']] }) },
        good: { table: T({ head: [['Temperature / °C', 'Mean time / s']], rows: G.temps.map(function (T, r) { return [String(T), String(G.means[r])]; }) }) },
        badLabel: 'Mixed decimal places', goodLabel: 'The same d.p. all the way down',
        why: '20, 20.0 and 19.95 say different things: measured to the nearest 1, 0.1 and 0.01. One column, one precision: Cambridge marks this. A mean with no more [[decimal places]] than the raw data is our rule.' },

      { type: 'grid2', lv: 'g', title: 'IGCSE and IB tables compared',
        items: [
          { label: 'IGCSE: one table', tone: 'g', v: { table: igcsePlain }, note: 'Raw data and the mean together. The mean is on the right.' },
          { label: 'IB: raw data, then processed data', tone: 'i', v: { html: ibPlain }, note: 'Table 1: every reading, with ± in the headings. Table 2: what was calculated.' }
        ] },

      { type: 'steps', lv: 'ie', title: 'Build the two IB tables',
        intro: 'The fungal amylase data: five trials at each temperature.',
        stage: { html: ibStage },
        steps: [
          { title: 'Table 1 holds the raw data', text: 'Every reading, and nothing calculated. The title says so: “Table 1. Raw data showing the effect of … on … (n = 5).”', show: ['r-title', 'r-ivh'].concat(ids('r-iv', 5)), focus: ['r-title'] },
          { title: 'The uncertainty goes in the heading', text: '± 10 s: the iodine was tested every 10 s. That, not the stopwatch’s 0.01 s, limits each time.', show: ['r-dvh'].concat(ids('r-trial', 5)), focus: ['r-dvh'] },
          { title: 'The raw readings', text: 'Five trials at each temperature. Whole seconds, all multiples of 10.', show: ids('r-raw', 25) },
          { title: 'Table 2 holds the processed data', text: 'A second table with its own number, and a title that starts “Processed data showing the effect of …”. It holds only what was calculated.', show: ['p-title', 'p-ivh', 'p-mh', 'p-sdh', 'p-rh'].concat(ids('p-iv', 5)), focus: ['p-title'] },
          { title: 'Mean and spread', text: 'The mean in whole seconds, like the raw data. The [[standard deviation]] has one more decimal place (our rule).', show: ids('p-mean', 5).concat(ids('p-sd', 5)) },
          { title: 'A derived quantity', text: 'Rate = 1 ÷ mean time. In the heading Rate / 10⁻³ s⁻¹, the value 5.6 means 5.6 × 10⁻³ s⁻¹.', show: ids('p-rate', 5).concat(['p-rh']) },
          { title: 'One worked example', text: 'Each calculation once, with the numbers in it. Then: “Repeated for all temperatures.”', show: ['calc'] }
        ] },

      { type: 'anatomy', lv: 'ie', title: 'The parts of an IB table title',
        intro: 'The IGCSE pattern, with two changes: say which kind of data, and add n at the end. Tap a colour to see each part.',
        model: '{1:Table 1.} {2:Raw data} {3:showing the effect of} {4:temperature (20.0–60.0 °C)} {3:on} {5:the time taken for fungal α-amylase to digest starch} {6:(n = 5)}.\n\n{1:Table 2.} {2:Processed data} {3:showing the effect of} {4:temperature (20.0–60.0 °C)} {3:on} {5:the mean time, standard deviation and rate of starch digestion by fungal α-amylase} {6:(n = 5)}.',
        parts: [
          { n: 1, name: 'Number', note: 'Table 1 for the raw data, Table 2 for the processed data.' },
          { n: 2, name: 'Kind of data', note: '__Raw data__: every reading. __Processed data__: what you calculated from them.' },
          { n: 3, name: 'The joining words', note: '“showing the effect of … on …”, in every title.' },
          { n: 4, name: 'Independent variable, with its range', note: 'Give the range to the same precision as the table: 20.0–60.0 °C.' },
          { n: 5, name: 'Dependent variable', note: 'What you measured, or calculated, and in what system. Name the enzyme and its source when you know it.' },
          { n: 6, name: 'n', note: 'How many trials each value is based on.' }
        ],
        after: 'If you measured two variables and changed neither, write “showing the relationship between … and …” instead.' },

      { type: 'note', tone: 'house', lv: 'ie', title: 'Raw data, then processed data',
        md: 'Table 1 holds every reading. Table 2 holds what was calculated: means, SD, rates. The IB does __not__ require two tables; it asks for processing that is clear. Two tables make each step easy to check, and no number appears twice.' },

      { type: 'note', tone: 'ee', lv: 'e', title: 'Raw data in an appendix',
        md: 'Examiners are __not required to read appendices__. So the body holds every processed table. It also holds a __representative sample__ of the raw data, such as all five trials at one temperature. Tables do not count towards the 4,000 words.' },

      { type: 'rules', title: 'Rules for a results table', items: [
        'A numbered title __above__ the table, always in the same pattern: “Table 1. Data showing the effect of … on …”.',
        'The [[independent variable]] runs __down the first column__, in increasing order. Never across the top row.',
        'No diagonal line in the corner. Every column has its own heading.',
        'Each [[column heading]]: quantity / unit. Time / s, not “Time” or “Time taken (secs)”.',
        '__No units in the cells.__ Numbers only.',
        'The __same number of decimal places__ down each column.',
        'No blank cells. If a reading is lost, write a dash (–) and explain why under the table.',
        'Ruled lines, or a spreadsheet. Never freehand.',
        { t: 'Each title starts with __Raw data__ or __Processed data__, and ends with n: (n = 5).', lv: 'ie' },
        { t: 'Each raw-data heading gives its uncertainty: Time / s ± 10.', lv: 'ie' },
        { t: 'One [[worked example]] of each calculation, with the numbers in it.', lv: 'ie' },
        { t: 'Our rule: each table fits on one page.', lv: 'ie' }
      ] },

      { type: 'widget', title: 'Fix a broken table', name: 'table-fixer' },

      { type: 'frames', lv: 'g', title: 'Sentence frames for table titles', items: [
        'Table ___. Data showing the effect of ___ (___–___) on ___.'
      ] },
      { type: 'frames', lv: 'ie', title: 'Sentence frames for IB table titles', items: [
        'Table 1. Raw data showing the effect of ___ (___–___) on ___ (n = ___).',
        'Table 2. Processed data showing the effect of ___ (___–___) on the mean ___, standard deviation and ___ (n = ___).',
        'Table ___. Raw data showing the relationship between ___ and ___ in ___ (n = ___).'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student drew this table. Six things need the red pen.',
        body: { table: T({
          caption: '[!a:Results]',
          head: [[{ t: '[!b:Temp] / °C', rs: 2 }, { t: '[!c:Time for starch to disappear]', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
          rows: [
            ['20', '180', '170', '190', '180'],
            ['30', '120', '110', '120', '[!e:116.667]'],
            ['40', '[!d:70 s]', '80', '70', '73'],
            ['50', '50', '[!blank:\u2002\u2002\u2002]', '60', '53'],
            ['60', '90', '100', '90', '93']
          ]
        }, RP) },
        notes: {
          a: { label: 'title?', why: '“Results” tells the reader nothing. Number it, and name both variables: __Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.__' },
          b: { label: '“Temp”?', why: 'Write the quantity in full: __Temperature / °C__. An abbreviation makes the reader guess.' },
          c: { label: 'unit?', why: 'Every heading of numbers needs its unit, after a solidus: __Time for starch to disappear / s__.' },
          d: { label: 'no units here', why: 'The unit goes once, in the heading. Cambridge rejects a unit in any data cell: write __70__.' },
          e: { label: 'd.p.!', why: 'Every other value in the column is whole seconds, so this one is too: __117__. The same decimal places down a column is marked.' },
          blank: { label: 'blank!', why: 'A blank cell hides a reading. Record every value. If one is lost, write a dash (–) and explain why under the table.' }
        },
        fixed: { table: T({
          caption: '==Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.==',
          head: [[{ t: '==Temperature== / °C', rs: 2 }, { t: 'Time for starch to disappear ==/ s==', cs: 4 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Mean']],
          rows: [
            ['20', '180', '170', '190', '180'],
            ['30', '120', '110', '120', '==117=='],
            ['40', '==70==', '80', '70', '73'],
            ['50', '50', '==50==', '60', '53'],
            ['60', '90', '100', '90', '93']
          ]
        }, RP) },
        fixedNote: 'A numbered title above that names both variables, and full headings with units. Numbers only in the cells, no blank cells, and the same decimal places down every column.'
      },
      i: {
        title: 'An IA raw-data table. Four things need the red pen.',
        body: { table: T({
          caption: '[!d:Table 1. Time for fungal α-amylase to digest starch at five temperatures]',
          head: [[{ t: 'Temperature / °C ± 0.5', rs: 2 }, { t: 'Time for starch to disappear / s [!a:± 0.01]', cs: 5 }, { t: '[!b:Mean time / s]', rs: 2 }],
            ['Trial 1', 'Trial 2', 'Trial 3', 'Trial 4', 'Trial 5']],
          rows: I.temps.map(function (T, r) {
            var m = I.means[r].toFixed(2);
            return [f1(T)].concat(I.trials[r].map(String)).concat([r === 0 ? '[!c:' + m + ']' : m]);
          })
        }, RP) },
        notes: {
          a: { label: '± 0.01?', why: 'The iodine was tested every 10 s, so each time is uncertain by __± 10 s__. The stopwatch’s 0.01 s is not the limit.' },
          b: { label: 'processed data?', why: 'Our rule: the means go in a second table (Table 2: processed data), with the SD and the rate. The IB does not require two tables, but mixing them makes each step harder to check.' },
          c: { label: 'd.p.?', why: 'The times are whole seconds, so the mean is too: __178__. Setting a spreadsheet to 2 d.p. adds precision that is not there.' },
          d: { label: 'title?', why: 'Say what kind of data the table holds, name both variables with the range, and give n: __Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5).__' }
        },
        fixed: { html: WUL.table(T({
          caption: '==Table 1. Raw data showing the effect of temperature (20.0–60.0 °C)== on the time taken for fungal α-amylase to digest starch ==(n = 5).==',
          head: [[{ t: 'Temperature / °C ± 0.5', rs: 2 }, { t: 'Time for starch to disappear / s ==± 10==', cs: 5 }], ['Trial 1', 'Trial 2', 'Trial 3', 'Trial 4', 'Trial 5']],
          rows: I.temps.map(function (T, r) { return [f1(T)].concat(I.trials[r].map(String)); })
        }, RP)) + '<div style="height:14px"></div>' + WUL.table(T({
          caption: '==Table 2. Processed data== showing the effect of temperature (20.0–60.0 °C) on the mean time, standard deviation and rate of starch digestion by fungal α-amylase (n = 5).',
          head: [['Temperature / °C ± 0.5', 'Mean time / s', 'Standard deviation / s', 'Rate / 10⁻³ s⁻¹']],
          rows: I.temps.map(function (T, r) { return [f1(T), '==' + I.means[r] + '==', f1(I.sds[r]), f1(I.rates[r])]; })
        }, RP)) },
        fixedNote: 'The raw data, with the right uncertainty, in Table 1, under a title that names both variables and n. The means, in whole seconds, in Table 2.'
      },
      e: {
        title: 'An EE results section. Three sentences hide the evidence.',
        body: 'Section 4. Results\n\n[!tf-a:All the raw data are in Appendix A, so none are shown here.]\n\n[!tf-b:The means and standard deviations are in Appendix B.]\n\n[!tf-c:Table 2 was moved to the appendix to save words.]\n\nThe trend is described below.',
        notes: {
          'tf-a': { label: 'sample in the body', why: 'Put a __representative sample__ of the raw data in the body, such as all five trials at one temperature. Then the examiner sees what was measured.' },
          'tf-b': { label: 'body!', why: 'The processed tables are the evidence for the argument. Examiners are not required to read appendices, so these belong in the body.' },
          'tf-c': { label: 'not counted', why: 'Tables do not count towards the 4,000 words. Moving one to an appendix saves nothing and hides it.' }
        },
        fixed: 'Section 4. Results\n\n==Table 1 shows a representative sample of the raw data: all five trials at 40.0 °C.== The full raw data are in Appendix A. ==Table 2 gives the mean time, standard deviation and rate at each temperature==; the analysis depends on it, so it is in the body.',
        fixedNote: 'The evidence the argument needs is in the body. Only the full raw data are in the appendix.'
      }
    },

    traps: [
      { bad: 'Temperature | 20 °C | 30 °C | 40 °C', good: 'Temperature / °C in the heading. Numbers only below it: 20, 30, 40.' },
      { bad: 'Mean: 116.667 (the raw data are whole seconds)', good: 'Mean: 117. No more decimal places than the raw data.' },
      { bad: 'Title: “Results”', good: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.' },
      { bad: 'Table 2. Processed data (n = 5)', good: 'Table 2. Processed data showing the effect of temperature (20.0–60.0 °C) on the mean rate of starch digestion by fungal α-amylase (n = 5).', lv: 'ie' },
      { bad: 'One column holding 20, 30.0 and 40', good: '20, 30 and 40: the same decimal places all the way down.' },
      { bad: 'Temperatures across the top row, and the times along the rows below', good: 'Temperature down the first column: one row for each temperature.' },
      { bad: 'A diagonal line splitting the top-left cell into two headings', good: 'Every column has its own heading: Temperature / °C, then Time for starch to disappear / s.' },
      { bad: 'Time / s ± 0.01 (the stopwatch’s resolution)', good: 'Time / s ± 10: the iodine was tested every 10 s.', lv: 'ie' },
      { bad: 'Every table in the appendix, to save words', good: 'Processed tables and a sample of the raw data in the body. Tables do not count.', lv: 'e' }
    ],

    test: [
      { type: 'choose', q: 'What is wrong with this table?',
        show: { table: { caption: 'Table 1. Data showing the effect of temperature (20–40 °C) on the mean time taken for amylase to digest starch.', head: [['Temperature', 'Mean time']], rows: [['20\u00a0°C', '180\u00a0s'], ['30\u00a0°C', '117\u00a0s'], ['40\u00a0°C', '73\u00a0s']] } },
        opts: [
          { t: 'The units are in every cell instead of in the headings.', ok: true, why: 'Write Temperature / °C and Mean time / s, then numbers only in the cells.' },
          { t: 'The temperature should be in the last column.', why: 'The independent variable is already where it belongs: the first column.' },
          { t: 'The means need more decimal places.', why: 'The raw data were whole seconds, so whole-second means are right.' },
          { t: 'Nothing: it is correct.', why: 'Units in the cells lose marks. They belong in the headings.' }
        ] },
      { type: 'choose', q: 'This table was drawn the way you would in maths. What must change for a biology report?',
        show: { table: T({ caption: 'Table 1. Data showing the effect of distance from the lamp (10–50 cm) on the number of bubbles released by pondweed per minute.',
          head: [[{ diag: ['Distance / cm', 'Trial'] }, '10', '20', '30', '40', '50']],
          rows: [[{ t: '1', th: true }, '48', '31', '20', '12', '7'], [{ t: '2', th: true }, '46', '33', '19', '14', '8'], [{ t: '3', th: true }, '50', '29', '21', '13', '6']] }, CMP) },
        opts: [
          { t: 'Turn it round: distance down the first column, then one column for each trial, each with its own heading and unit.', ok: true, why: 'The independent variable runs down the first column, and a diagonal corner is never used. The number of bubbles now gets a heading too.' },
          { t: 'Nothing: all the numbers are there.', why: 'The numbers are there, but nothing says what they are: the number of bubbles has no heading and no unit.' },
          { t: 'Keep the layout, but write the unit in the corner too.', why: 'The corner would then hold three things. Give every column its own heading instead.' },
          { t: 'Write “bubbles” after every number.', why: 'Words and units go in the heading, never in the cells.' }
        ] },
      { type: 'choose', q: 'Every heading here has a quantity and a unit. What is still wrong?',
        show: { table: T({ caption: 'Table 1. Data showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the percentage change in mass of potato cylinders.',
          head: [['Concentration of sucrose solution / mol dm⁻³', '0.0', '0.2', '0.4', '0.6', '0.8', '1.0']],
          rows: [[{ t: 'Percentage change in mass / %', th: true }, '+8.4', '+4.0', '−1.2', '−8.4', '−12.0', '−14.0']] }, CMP) },
        opts: [
          { t: 'It is turned round: concentration should run down the first column, with the change in mass in the second column.', ok: true, why: 'In a biology table each variable gets a column, and the independent variable comes first.' },
          { t: 'Nothing: each row has a heading and a unit.', why: 'The headings are right, but they label rows. The independent variable belongs down the first column.' },
          { t: 'The units should be in the cells.', why: 'Units belong in the headings. The problem is the layout.' },
          { t: 'The plus signs should be removed.', why: 'The signs show a gain or a loss of mass, so they stay.' }
        ] },
      { type: 'build', q: 'Build the column heading for the time the starch took to disappear.',
        chips: ['Time for starch to disappear', '/', 's', '(seconds)', 'in', 'secs'],
        answer: ['Time for starch to disappear', '/', 's'],
        why: 'Quantity, then a solidus, then the unit symbol.' },
      { type: 'sort', q: 'Where does each thing go: in the heading, or in the cells?',
        bins: ['In the heading', 'In the cells'],
        items: [
          { t: 'The unit, s', bin: 0, why: 'Written once, after the solidus.' },
          { t: 'The name of the quantity', bin: 0, why: 'The heading says what every number below it is.' },
          { t: '“Trial 1”', bin: 0, why: 'It labels the column.' },
          { t: '180', bin: 1, why: 'A reading, as a number only.' },
          { t: 'The mean, 117', bin: 1, why: 'A value, so it goes in a cell, with no unit.' },
          { t: '°C', bin: 0, why: 'A unit: once, in the heading.' }
        ] },
      { type: 'order', q: 'Put the columns of the IGCSE table in order, from left to right.',
        items: ['Temperature / °C', 'Trial 1', 'Trial 2', 'Trial 3', 'Mean'],
        why: 'The independent variable first, then the raw data, then what is calculated from it.' },
      { type: 'spot', q: 'Tap the column headings that would lose marks.',
        text: '[?:Temperature / °C] · [!a:Temp] · [!b:Time taken / secs] · [?:Volume of gas / cm³] · [!c:Time / m] · [?:Mean time / s]',
        why: { a: 'Write the quantity in full, with its unit: Temperature / °C.', b: '“secs” is not a unit symbol: write s.', c: 'm is the symbol for metres. Minutes are min.' } },
      { type: 'choose', q: 'Where does the title of a results table go?',
        opts: [
          { t: 'Above the table, numbered: “Table 1. Data showing the effect of … on …”', ok: true, why: 'A table’s title goes above it. A graph’s caption goes below.' },
          { t: 'Below the table', why: 'That is where a graph’s caption goes. A table’s title goes above.' },
          { t: 'In the first cell of the table', why: 'The first cell holds the heading of the independent variable.' },
          { t: 'Nowhere: a table needs no title', why: 'The reader needs to know what the table shows. Every table gets a numbered title.' }
        ] },
      { type: 'choose', q: 'Which is the best title for the amylase table?',
        opts: [
          { t: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.', ok: true, why: 'Number, “Data showing the effect of”, the independent variable with its range, “on”, then the dependent variable.' },
          { t: 'Table 1. Results', why: 'It says nothing about what was changed or measured.' },
          { t: 'Table 1. Data', why: 'It says the table holds data, but not which variables.' },
          { t: 'Table 1. Amylase and starch', why: 'It names the enzyme and the substrate, but neither variable.' }
        ] },
      { type: 'choose', q: 'What is missing from this title? “Table 1. Data showing the time taken for amylase to digest starch.”',
        opts: [
          { t: 'The independent variable: “showing the effect of temperature (20–60 °C) on …”', ok: true, why: 'The title names what was measured, but not what was changed.' },
          { t: 'The unit, s', why: 'Units go in the column headings, not the title.' },
          { t: 'The word “Results”', why: '“Results” adds nothing. “Data” already says what the table holds.' },
          { t: 'Nothing: it is complete', why: 'A reader cannot tell what was changed. Name the independent variable.' }
        ] },
      { type: 'build', lv: 'g', q: 'Build the title of the pondweed table.',
        chips: ['Table 1.', 'Data', 'showing the effect of', 'lamp distance (10–50 cm)', 'on', 'the volume of gas released by pondweed in 5 minutes.', 'Results:', 'Pondweed', 'Line graph'],
        answer: ['Table 1.', 'Data', 'showing the effect of', 'lamp distance (10–50 cm)', 'on', 'the volume of gas released by pondweed in 5 minutes.'],
        why: 'Number, “Data showing the effect of”, the independent variable with its range, “on”, then the dependent variable.' },
      { type: 'build', lv: 'ie', q: 'Build the title of the IB processed-data table.',
        chips: ['Table 2.', 'Processed data', 'showing the effect of', 'temperature (20.0–60.0 °C)', 'on', 'the mean rate of starch digestion by fungal α-amylase', '(n = 5).', 'Raw data', 'Line graph', 'Results:'],
        answer: ['Table 2.', 'Processed data', 'showing the effect of', 'temperature (20.0–60.0 °C)', 'on', 'the mean rate of starch digestion by fungal α-amylase', '(n = 5).'],
        why: 'The same pattern as every table title, with n at the end.' },
      { type: 'choose', q: 'A reading was lost: the tube was dropped. What goes in its cell?',
        opts: [
          { t: 'A dash (–), with a note under the table saying why', ok: true, why: 'The reader sees that a value is missing, and why. The mean uses the other trials.' },
          { t: 'Leave the cell blank', why: 'A reader cannot tell a lost reading from a forgotten one.' },
          { t: '0', why: '0 s would mean the starch disappeared at once. That is a false result.' },
          { t: 'The mean of the other trials', why: 'That invents a reading. Record only what was measured.' }
        ] },
      { type: 'multi', q: 'Tick every rule this table breaks.',
        show: { table: T({ head: [['Mean time / s', 'Trial 1', 'Trial 2', 'Trial 3', 'Temperature / °C']], rows: [['180', '180', '170', '190', '20'], ['117', '120', '110', '120', '30'], ['73', '70', '80', '70', '40']] }) },
        opts: [
          { t: 'The independent variable is not in the first column', ok: true, why: 'Temperature should come first.' },
          { t: 'The mean is before the trials, not after them', ok: true, why: 'The mean is calculated from the trials, so it goes on the right.' },
          { t: 'There is no title', ok: true, why: 'A numbered title goes above the table.' },
          { t: 'The headings have no units', why: 'Every heading has quantity / unit.' },
          { t: 'The values have different decimal places', why: 'Every column is in whole numbers.' }
        ],
        why: 'Temperature first, then the trials, then the mean, and a title above.' },
      { type: 'choose', q: 'The iodine was tested every 10 s. The stopwatch reads to 0.01 s. Which heading is right for the raw times?', lv: 'ie',
        opts: [
          { t: 'Time for starch to disappear / s ± 10', ok: true, why: 'The starch disappeared at some moment in the 10 s before the sample. So each time can be wrong by up to 10 s.' },
          { t: 'Time for starch to disappear / s ± 0.01', why: 'That is the stopwatch’s resolution. The method, sampling every 10 s, is far less precise.' },
          { t: 'Time for starch to disappear / s ± 0.2', why: 'A reaction time of about 0.2 s is tiny next to the 10 s gap between samples.' },
          { t: 'Time for starch to disappear / s, with ± 10 in every cell', why: 'The uncertainty goes once, in the heading.' }
        ] },
      { type: 'choose', q: 'In an Extended Essay, where do most of the raw data go?', lv: 'e',
        opts: [
          { t: 'In an appendix, with a representative sample in the body', ok: true, why: 'Examiners are not required to read appendices, so the body must show what was measured.' },
          { t: 'All of it in the body', why: 'Tables do not count towards the words, but hundreds of readings make the argument hard to follow.' },
          { t: 'All of it in an appendix', why: 'Then the body shows no raw data at all, and the examiner may never see it.' },
          { t: 'Nowhere: only processed data are needed', why: 'The raw data show what was measured. Keep them, in an appendix, with a sample in the body.' }
        ] }
    ],

    words: [
      { term: 'raw data', forms: ['raw'], def: 'The measurements exactly as they were recorded, before any calculation.', eg: 'The three times at 40 °C: 70, 80 and 70 s.' },
      { term: 'processed data', forms: ['processed'], def: 'Numbers calculated from the raw data, such as a mean, a rate or a standard deviation.', eg: 'The mean time at 40 °C: 73 s.' },
      { term: 'solidus', forms: ['solidi'], def: 'The slash (/) between a quantity and its unit in a column heading.', eg: 'Time / s' },
      { term: 'column heading', forms: ['column headings', 'heading', 'headings'], def: 'The words at the top of a column: the quantity, a solidus, then the unit.', eg: 'Temperature / °C' },
      { term: 'decimal places', forms: ['decimal place', 'd.p.'], def: 'The number of digits after the decimal point. It shows how precisely a value was measured.', eg: '73.3 has one decimal place; 73 has none.' }
    ],

    further: [
      { title: 'Why “Time / s” works like algebra',
        md: 'A measured value is a number times a unit: t = 180 s. Divide both sides by the unit and t / s = 180, a pure number. So the heading “Time / s” above the number 180 reads “time divided by seconds is 180”. The international rules for units write table headings and graph axes this way.',
        cite: 'Bureau International des Poids et Mesures. *The International System of Units (SI)*. 9th ed., BIPM, 2019.' }
    ],

    sources: ['Cambridge 0610 syllabus 2026–2028, p. 55', '0610 Paper 6 mark schemes and examiner reports, 2021–2025', 'IB Biology guide (2025), Data analysis criterion, pp. 120–123', 'IB Extended essay guide, first assessment 2027']
  });
})(window.WUL);
