/* station: apparatus — what was used, how much of it, and how exactly each instrument measures.
   The scales are drawn here as SVG strings, styled with the site's CSS variables so both themes work.
   Keywords inside {html} use the exact term ([[shown|term]]), so they resolve whatever the load order. */
(function (WUL) {
  'use strict';
  /* inline markup; ± is kept on the same line as its number */
  var md = function (s) { return WUL.md(s, { inline: true }).replace(/± /g, '±\u00a0'); };
  var TXT = 'font-family:var(--sans);fill:var(--ink)';
  var NUM = 'font-family:var(--mono);fill:var(--ink)';
  function svg(w, hh, label, body, max) {
    return '<svg viewBox="0 0 ' + w + ' ' + hh + '" width="100%" style="display:block;max-width:' + (max || w + 60) + 'px;margin:0 auto;height:auto" role="img" aria-label="' + WUL.esc(label) + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  function ln(x1, y1, x2, y2, st) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="' + st + '"/>'; }
  function tx(x, y, t, st, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" style="' + st + '">' + t + '</text>'; }

  /* ---- a 10 cm³ measuring cylinder, 0.2 cm³ divisions, the scale from 6 to 9 cm³; meniscus bottom at 7.4 ---- */
  function cylinder(steps) {
    function y(v) { return +(310 - (v - 6) * 100).toFixed(1); }
    var g = function (el, inner) { return steps ? '<g data-el="' + el + '">' + inner + '</g>' : inner; };
    var s = '';
    s += g('liquid', '<path d="M110 150 Q150 190 190 150 L190 345 L110 345 Z" style="fill:var(--blue-wash);stroke:none"/>' +
      '<path d="M110 150 Q150 190 190 150" style="fill:none;stroke:var(--blue);stroke-width:2.4"/>');
    var sc = '';
    for (var k = 0; k <= 15; k++) {
      var v = 6 + k * 0.2, yy = y(v), major = k % 5 === 0;
      sc += ln(110, yy, major ? 148 : 128, yy, 'stroke:var(--ink);stroke-width:' + (major ? 1.9 : 1.3));
      if (major) sc += tx(100, yy + 6, String(6 + k / 5), NUM + ';font-size:17px', 'end');
    }
    sc += tx(100, 340, 'cm³', TXT + ';font-size:14px;fill:var(--ink-2)', 'end');
    s += g('scale', sc);
    s += g('tube', ln(110, 0, 110, 345, 'stroke:var(--ink);stroke-width:2.2') + ln(190, 0, 190, 345, 'stroke:var(--ink);stroke-width:2.2'));
    if (steps) {
      var dv = '<rect x="111" y="' + y(8) + '" width="44" height="100" style="fill:var(--hl);opacity:.55"/>';
      for (var j = 0; j < 5; j++) dv += tx(166, y(7.1 + j * 0.2) + 4, String(j + 1), NUM + ';font-size:12px;fill:var(--ink-2)');
      s += g('div', dv);
      s += g('eye', '<path d="M292 170 Q318 150 344 170 Q318 190 292 170 Z" style="fill:var(--sheet);stroke:var(--ink);stroke-width:2"/>' +
        '<circle cx="314" cy="170" r="7" style="fill:var(--ink)"/><circle cx="311.5" cy="167.5" r="2" style="fill:var(--sheet)"/>');
      s += g('sight', ln(288, 170, 152, 170, 'stroke:var(--ink-2);stroke-width:1.6;stroke-dasharray:6 5'));
      s += g('bottom', '<circle cx="150" cy="170" r="13" style="fill:none;stroke:var(--amber);stroke-width:2.8"/>' + ln(112, 170, 137, 170, 'stroke:var(--amber);stroke-width:2.4'));
      s += g('reading', tx(276, 238, '7.4 cm³', TXT + ';font-size:24px;font-weight:600') + tx(276, 264, '± 0.1 cm³', TXT + ';font-size:17px;fill:var(--ink-2)'));
    }
    return svg(360, 345, 'Part of the scale of a 10 cm³ measuring cylinder, from 6 to 9 cm³, with water in it. The bottom of the curved surface is at 7.4 cm³.', s, 400);
  }

  /* ---- the same 2 cm³ (4 to 6 cm³) of two scales, to measure 5.0 cm³ ---- */
  function scaleWindow(fine) {
    /* the pipette's scale reads downwards (0 at the top); the cylinder's reads upwards */
    function y(v) { return fine ? 25 + (v - 4) * 120 : 265 - (v - 4) * 120; }
    var x1 = fine ? 108 : 60, x2 = fine ? 148 : 196, s = '';
    var ym = y(5);
    s += '<path d="M' + x1 + ' ' + (ym - 7) + ' Q' + ((x1 + x2) / 2) + ' ' + (ym + 7) + ' ' + x2 + ' ' + (ym - 7) + ' L' + x2 + ' 290 L' + x1 + ' 290 Z" style="fill:var(--blue-wash);stroke:none"/>';
    s += '<path d="M' + x1 + ' ' + (ym - 7) + ' Q' + ((x1 + x2) / 2) + ' ' + (ym + 7) + ' ' + x2 + ' ' + (ym - 7) + '" style="fill:none;stroke:var(--blue);stroke-width:2.2"/>';
    var n = fine ? 20 : 2;
    for (var k = 0; k <= n; k++) {
      var v = 4 + k * (2 / n), yy = y(v), major = Math.abs(v - Math.round(v)) < 1e-9, half = fine && k % 5 === 0 && !major;
      s += ln(x1, yy, x1 + (major ? 30 : half ? 20 : 12), yy, 'stroke:var(--ink);stroke-width:' + (major ? 1.9 : 1.2));
      if (major) s += tx(x1 - 10, yy + 6, String(Math.round(v)), NUM + ';font-size:17px', 'end');
    }
    s += ln(x1, 0, x1, 290, 'stroke:var(--ink);stroke-width:2.2') + ln(x2, 0, x2, 290, 'stroke:var(--ink);stroke-width:2.2');
    s += tx(x2 + 10, ym + 5, '5.0', NUM + ';font-size:14px;fill:var(--ink-2)', 'start');
    return svg(250, 290, fine ? 'The scale of a 10 cm³ graduated pipette from 4 to 6 cm³: marks every 0.1 cm³.' : 'The scale of a 100 cm³ measuring cylinder from 4 to 6 cm³: marks only every 1 cm³.', s, 260);
  }

  /* ---- iodine tested every 10 s on a spotting tile ---- */
  function tile() {
    var s = '<rect x="10" y="46" width="420" height="80" rx="10" style="fill:var(--sheet-2);stroke:var(--rule);stroke-width:1.5"/>';
    [40, 50, 60, 70, 80].forEach(function (t, i) {
      var x = 50 + i * 85, gone = t === 80;
      s += '<circle cx="' + x + '" cy="86" r="25" style="fill:' + (gone ? '#D9A441' : '#1E2440') + ';stroke:var(--ink-3);stroke-width:1.5"/>';
      s += tx(x, 154, t + ' s', NUM + ';font-size:18px');
    });
    s += '<path d="M305 40 V30 H390 V40" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>';
    s += tx(347, 21, 'starch gone in here', TXT + ';font-size:16px;font-weight:600');
    s += tx(220, 190, 'Recorded: 80 s ± 10 s', TXT + ';font-size:19px;font-weight:600');
    return svg(440, 200, 'A spotting tile with drops tested at 40, 50, 60, 70 and 80 s. The first four are blue-black; the drop at 80 s is orange-brown. The starch disappeared at some moment between 70 and 80 s.', s, 520);
  }

  /* ---- a thermometer section, 20 to 30 °C, 1 °C divisions, liquid at 24 °C ---- */
  function thermometer() {
    function y(t) { return 300 - (t - 20) * 27; }
    var s = '<rect x="128" y="4" width="24" height="316" rx="12" style="fill:var(--sheet);stroke:var(--ink);stroke-width:2"/>';
    s += '<rect x="134" y="' + y(24) + '" width="12" height="' + (318 - y(24)) + '" style="fill:var(--blue)"/>';
    for (var t = 20; t <= 30; t++) {
      var big = t % 5 === 0;
      s += ln(152, y(t), big ? 176 : 166, y(t), 'stroke:var(--ink);stroke-width:' + (big ? 1.9 : 1.3));
      if (big) s += tx(184, y(t) + 6, String(t), NUM + ';font-size:17px', 'start');
    }
    s += tx(184, 16, '°C', TXT + ';font-size:14px;fill:var(--ink-2)', 'start');
    return svg(300, 324, 'Part of a thermometer scale from 20 to 30 °C, with a mark every 1 °C. The liquid stops at the 24 °C mark.', s, 300);
  }

  /* ---- a digital balance display ---- */
  function balance() {
    var s = '<ellipse cx="150" cy="30" rx="92" ry="12" style="fill:var(--sheet-2);stroke:var(--ink);stroke-width:1.8"/>' +
      '<rect x="40" y="50" width="220" height="92" rx="10" style="fill:var(--sheet);stroke:var(--ink);stroke-width:2"/>' +
      '<rect x="62" y="66" width="176" height="56" rx="4" style="fill:var(--sheet-2);stroke:var(--ink-3);stroke-width:1.5"/>' +
      tx(150, 106, '2.35 g', NUM + ';font-size:32px;font-weight:600');
    return svg(300, 150, 'A digital balance display reading 2.35 g.', s, 300);
  }

  /* ---- where an uncertainty comes from (a teaching table: sans, left-aligned) ---- */
  function proseTable(head, rows) {
    var th = 'text-align:left;vertical-align:bottom;font:600 .86rem/1.35 var(--sans)';
    var td = 'text-align:left;vertical-align:top;font:400 .93rem/1.45 var(--sans)';
    return '<div class="tscroll"><table class="dt"><thead><tr>' + head.map(function (c) { return '<th style="' + th + '">' + md(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + td + '">' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  var WHERE = proseTable(['What you read', 'Its [[uncertainty]]', 'Example'], [
    ['An analogue scale: a ruler, a thermometer, a measuring cylinder', '± half the smallest division (a common convention)', 'Thermometer with 1 °C divisions: ± 0.5 °C'],
    ['A digital display: a balance, a digital thermometer', '± the last digit', 'A balance showing 2.35 g: ± 0.01 g'],
    ['A stopwatch started and stopped by hand', 'About ± 0.2 s, from reaction time', 'The display shows 0.01 s, but a hand is slower than that'],
    ['A method that samples at intervals', '± the sampling interval', 'Iodine tested every 10 s: ± 10 s']
  ]);

  WUL.station({
    id: 'apparatus', stage: 'plan', order: 5, title: 'Apparatus and materials', levels: 'gie',
    job: {
      g: 'List every piece of equipment and every material, with its size or quantity. Then someone else could repeat the same experiment.',
      i: 'List every item with its size or quantity. State the uncertainty of every measuring instrument, and where it comes from.'
    },
    where: { g: 'After the variables, before the method. A list is fine.', i: 'Not a section of its own: inside your methodology, before the method. A list or a table.', e: 'Inside your methodology section, before the method.' },

    ladder: {
      g: ['Separate [[apparatus]] (equipment) from [[materials]] (what is consumed)', 'A size for every piece of apparatus; a volume and a concentration for every solution', 'Choose the [[measuring instrument]] whose divisions suit the volume, mass or time'],
      i: ['State the [[uncertainty]] of every measuring instrument', 'Say where each uncertainty comes from: half a division, the last digit, or the method', 'Notice when the method, not the instrument, sets the uncertainty'],
      e: ['Justify each instrument against the precision the question needs, often from a pilot run']
    },

    build: [
      { type: 'anatomy', title: 'What each line needs',
        intro: 'Tap a colour. A list with all five parts lets someone else collect exactly the same things.',
        model: '{1:8} {2:test tubes} {3:(15 cm³)} in a rack\n{1:1} {2:graduated pipette} {3:(10 cm³)} with a pipette filler, {5:± 0.05 cm³}\n{1:1} {2:thermometer} {3:(−10 to 110 °C, 1 °C divisions)}, {5:± 0.5 °C}\n{1:1} {2:spotting tile}\n{1:100 cm³} of {4:1.0 %} {2:starch solution}\n{1:50 cm³} of {4:1.0 %} {2:amylase solution}',
        parts: [
          { n: 1, name: 'How many, or how much', note: 'A number for apparatus; a volume or a mass for materials. Never “some”.' },
          { n: 2, name: 'The correct name', note: '“Spotting tile”, not “tile plate”. “Measuring cylinder”, not “measuring jug”.' },
          { n: 3, name: 'Size or range', note: '“A 10 cm³ graduated pipette”, not “a pipette”.' },
          { n: 4, name: 'Concentration', note: 'Every solution needs one.' },
          { n: 5, name: 'Uncertainty', note: 'Required at IB. Good practice at IGCSE: start now.' }
        ],
        after: 'Apparatus is used again. Materials, such as the starch solution, are consumed. Give them as two lists.' },

      { type: 'grid2', title: 'Choose the right instrument', items: [
        { label: '100 cm³ measuring cylinder', tone: 'red', v: { html: scaleWindow(false) }, note: 'Marks 1 cm³ apart: ± 0.5 cm³. That is 10 % of 5.0 cm³.' },
        { label: '10 cm³ graduated pipette', tone: 'g', v: { html: scaleWindow(true) }, note: 'Marks 0.1 cm³ apart: ± 0.05 cm³. That is 1 % of 5.0 cm³. A pipette’s scale reads downwards.' }
      ] },

      { type: 'callout', title: 'How to choose an instrument', label: 'The rule', md: 'Choose the instrument whose smallest division is small compared with what you measure, and say why you chose it.' },

      { type: 'steps', title: 'Read a scale at eye level',
        intro: 'This is part of the scale of a 10 cm³ measuring cylinder. Press Next step.',
        stage: { html: cylinder(true) }, always: ['tube', 'scale', 'liquid'],
        steps: [
          { title: 'Find the value of one small division', show: ['div'], text: 'Between the 7 and the 8 there are five small divisions. So one division is 1 ÷ 5 = 0.2 cm³.' },
          { title: 'Put your eye level with the surface', show: ['eye', 'sight'], text: 'Move your head until your eye is level with the liquid. Seen from above or below, the surface appears against a different mark.' },
          { title: 'Read the bottom of the meniscus', show: ['bottom'], text: 'Water curves upwards where it touches the glass. This curve is the meniscus. Read the __bottom__ of the curve: 7.4 cm³.' },
          { title: 'Write the reading with its uncertainty', show: ['reading'], text: 'Half of a 0.2 cm³ division is 0.1 cm³, so write 7.4 ± 0.1 cm³. The value and its [[uncertainty]] have the same number of decimal places.' }
        ] },

      { type: 'grid2', title: 'Where an uncertainty comes from', items: [
        { label: 'Four common sources', v: { html: WHERE }, note: 'The [[resolution]] of an instrument is the smallest change it can show. It is only the starting point.' }
      ] },

      { type: 'grid2', title: 'When the method sets the uncertainty', items: [
        { label: 'Iodine tested every 10 s', v: { html: tile() }, note: 'The drop at 70 s was still blue-black; the drop at 80 s was not. The starch disappeared at some moment in those 10 s. So the time is ± 10 s, whatever the stopwatch shows.' }
      ] },

      { type: 'table', lv: 'ie', title: 'Every uncertainty and its source',
        spec: {
          caption: 'Table 1. Measuring instruments and their uncertainties for the investigation of the effect of temperature on the time taken for fungal α-amylase to digest starch.', cls: 'wd-table-fixer--prose',
          head: [['Quantity', 'Instrument', 'Uncertainty', 'Where it comes from']],
          rows: [
            ['Volume of starch solution', '10 cm³ graduated pipette', '± 0.05 cm³', 'Half the smallest division (0.1 cm³)'],
            ['Temperature of the water bath', 'Thermometer, 1 °C divisions', '± 0.5 °C', 'Half the smallest division'],
            ['Mass of starch powder', 'Digital balance', '± 0.01 g', 'The last digit of the display'],
            ['Time for the starch to disappear', 'Stopwatch; iodine tested every 10 s', '± 10 s', 'The sampling interval, not the stopwatch (0.01 s)']
          ]
        },
        after: 'Check the last row. The stopwatch reads to 0.01 s, but a drop was tested only every 10 s.' },

      { type: 'note', tone: 'ib', label: 'What the IB guide asks', title: 'What the IB tools ask', lv: 'ie', md: 'Tool 1 asks you to measure mass, volume, time and temperature “to an appropriate level of precision”. Tool 3 asks you to “Record uncertainties in measurements as a range (±) to an appropriate level of precision”. Say where each uncertainty comes from, so that the reader of your report can check it.' },

      { type: 'frames', title: 'Sentence frames for apparatus', items: [
        'The volume of ___ was measured with a ___ cm³ ___ (± ___ cm³), because its smallest division is ___.',
        'The uncertainty of the ___ is ± ___, which is half of the smallest division.',
        'Although the stopwatch reads to 0.01 s, the uncertainty in the time is ± ___ s, because ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this list. Five phrases need the red pen.',
        body: '[!tf-a:Apparatus]: [!tf-b:test tubes], [!tf-c:a pipette], [!tf-d:some starch], iodine solution, [!tf-e:a tile plate] and a stopwatch.',
        notes: {
          'tf-a': { label: 'two lists!', why: 'Starch and iodine are consumed: they are materials. Give apparatus and materials as two lists.' },
          'tf-b': { label: 'size?', why: 'Give the number and the size: 8 test tubes (15 cm³).' },
          'tf-c': { label: 'which one?', why: 'Name the type and the size: a 10 cm³ graduated pipette.' },
          'tf-d': { label: '“some”?', why: '“Some” is not a quantity. Give the volume and the concentration: 100 cm³ of 1.0 % starch solution.' },
          'tf-e': { label: 'name?', why: 'Use the correct name: a spotting tile.' }
        },
        fixed: 'Apparatus: ==8 test tubes (15 cm³)== in a rack, a ==10 cm³ graduated pipette== with a pipette filler, a ==spotting tile==, a thermostatically controlled water bath and a stopwatch.\n\n==Materials==: ==100 cm³ of 1.0 % starch solution==, 50 cm³ of 1.0 % amylase solution and 20 cm³ of iodine solution.',
        fixedNote: 'Two lists. Every item has its correct name, and a number, a size, or a volume and concentration.'
      },
      i: {
        title: 'An IA methodology. Five phrases would keep it out of the top band.',
        body: 'The volume of starch solution was measured with [!tf-a:a pipette] [!tf-b:(± 0.1)]. The temperature was measured with a thermometer [!tf-c:(very accurate)]. The time was measured with a stopwatch [!tf-d:(± 0.01 s)], and [!tf-e:the uncertainties were too small to matter].',
        notes: {
          'tf-a': { label: 'size?', why: 'Name the instrument fully: a 10 cm³ graduated pipette.' },
          'tf-b': { label: 'unit?', why: 'Every uncertainty needs its unit and its source. With 0.1 cm³ divisions, half a division gives ± 0.05 cm³.' },
          'tf-c': { label: 'a number!', why: '“Accurate” is a claim, not an uncertainty. Give the value: ± 0.5 °C, half of the 1 °C division.' },
          'tf-d': { label: 'sampling!', why: 'A drop was tested only every 10 s, so the time is known to ± 10 s. The stopwatch is not the limit.' },
          'tf-e': { label: 'largest?', why: 'Consider the uncertainties. Here ± 10 s is the largest: it is bigger than the standard deviation at 40 °C and at 50 °C.' }
        },
        fixed: 'The volume of starch solution was measured with ==a 10 cm³ graduated pipette (± 0.05 cm³, half the smallest division)==. The temperature was measured with a thermometer ==(± 0.5 °C, half of the 1 °C division)==. The time was measured with a stopwatch, but ==a drop was tested every 10 s, so each time is uncertain by ± 10 s==. ==This is the largest uncertainty: it is bigger than the standard deviation at 40 °C and at 50 °C (5.5 s).==',
        fixedNote: 'Every instrument now has an uncertainty with a unit and a source, and the largest one is named.'
      }
    },

    traps: [
      { bad: 'A pipette, some starch, a thermometer.', good: 'A 10 cm³ graduated pipette, 100 cm³ of 1.0 % starch solution, a thermometer (1 °C divisions).' },
      { bad: '5.0 cm³ measured with a 100 cm³ measuring cylinder.', good: '5.0 cm³ measured with a 10 cm³ graduated pipette: its divisions are ten times finer.' },
      { bad: 'The volume was read at the edge, where the water touches the glass.', good: 'Read the __bottom__ of the meniscus, with your eye level with it.' },
      { bad: 'Tile plate. Measuring jug.', good: 'Spotting tile. Measuring cylinder. Use the correct names.' },
      { bad: 'Stopwatch (± 0.01 s), with iodine tested every 10 s.', good: 'Time ± 10 s: the sampling interval sets the uncertainty.', lv: 'ie' },
      { bad: 'Thermometer: ± 0.5', good: 'Thermometer: ± 0.5 °C (half of the 1 °C division).', lv: 'ie' }
    ],

    test: [
      { type: 'sort', q: 'Sort each item from the amylase experiment.',
        bins: ['Apparatus', 'Materials'],
        items: [
          { t: 'Spotting tile', bin: 0, why: 'It is washed and used again: apparatus.' },
          { t: '100 cm³ of 1.0 % starch solution', bin: 1, why: 'It is consumed in the reaction: a material.' },
          { t: '10 cm³ graduated pipette', bin: 0, why: 'A measuring instrument: apparatus.' },
          { t: '20 cm³ of iodine solution', bin: 1, why: 'It is consumed in the tests: a material.' },
          { t: 'Thermostatically controlled water bath', bin: 0, why: 'Equipment that is used again: apparatus.' },
          { t: '50 cm³ of pH 6.0 buffer solution', bin: 1, why: 'A solution that is consumed: a material.' }
        ] },
      { type: 'choose', q: 'Your eye is level with the water in this 10 cm³ measuring cylinder. What is the volume?',
        show: { html: cylinder(false) },
        opts: [
          { t: '7.4 cm³', ok: true, why: 'The bottom of the meniscus is two small divisions above 7, and each division is 0.2 cm³.' },
          { t: '7.6 cm³', why: 'That is where the water climbs the glass. Read the bottom of the curve.' },
          { t: '7.2 cm³', why: 'Each small division is 0.2 cm³, not 0.1 cm³: there are five between 7 and 8.' },
          { t: '7 cm³', why: 'Read to the scale: it shows steps of 0.2 cm³.' }
        ] },
      { type: 'choose', q: 'Using half the smallest division, what should you record for this thermometer?',
        show: { html: thermometer() },
        opts: [
          { t: '24.0 ± 0.5 °C', ok: true, why: 'The liquid is on the 24 °C mark. Half of the 1 °C division is 0.5 °C, and the value has the same number of decimal places.' },
          { t: '24 ± 1 °C', why: 'That uses a whole division. The convention here is half the smallest division: ± 0.5 °C.' },
          { t: '24.00 ± 0.05 °C', why: 'This scale cannot show hundredths of a degree.' },
          { t: '25.0 ± 0.5 °C', why: 'The long marks are at 20, 25 and 30 °C. The liquid stops one mark below 25.' }
        ] },
      { type: 'choose', q: 'A digital balance shows this reading. What is its uncertainty?',
        show: { html: balance() },
        opts: [
          { t: '± 0.01 g', ok: true, why: 'For a digital display the convention is ± the last digit. The display changes in steps of 0.01 g.' },
          { t: '± 0.1 g', why: 'The display shows hundredths of a gram, so its steps are 0.01 g.' },
          { t: '± 1 g', why: 'That ignores the two decimal places the display shows.' },
          { t: 'No uncertainty: it is digital', why: 'Every measurement has an uncertainty. A digital display is still limited by its last digit.' }
        ] },
      { type: 'choose', q: 'Which instrument is best for measuring 5.0 cm³ of starch solution?',
        opts: [
          { t: 'A 10 cm³ graduated pipette', ok: true, why: 'Its divisions are 0.1 cm³, so the uncertainty is ± 0.05 cm³: 1 % of 5.0 cm³.' },
          { t: 'A 100 cm³ measuring cylinder', why: 'Its divisions are 1 cm³, so the uncertainty is ± 0.5 cm³: 10 % of the volume.' },
          { t: 'A 250 cm³ beaker', why: 'The marks on a beaker are only a rough guide. It is not a measuring instrument.' },
          { t: 'A dropping pipette', why: 'Drops vary in size, so the volume is not known.' }
        ] },
      { type: 'choose', q: 'A drop is tested with iodine every 10 s. The stopwatch reads to 0.01 s. What is the uncertainty in the time?',
        show: { html: tile() },
        opts: [
          { t: '± 10 s', ok: true, why: 'The starch disappeared at some moment between two samples, 10 s apart. The sampling interval sets the uncertainty.' },
          { t: '± 0.01 s', why: 'That is the stopwatch’s resolution. The time is only known to the nearest sample.' },
          { t: '± 0.2 s', why: 'Reaction time matters when a watch is stopped at an exact moment. Here the sampling interval is far larger.' },
          { t: 'None: the drop turned orange-brown at 80 s exactly', why: 'At 70 s it was still blue-black. The change happened somewhere in the 10 s between.' }
        ] },
      { type: 'spot', q: 'Tap the three phrases that would lose marks in this list.',
        text: 'Apparatus: [!a:test tubes], a [?:10 cm³ graduated pipette], a [!b:tile plate] and [?:a thermostatically controlled water bath]. Materials: [!c:some starch].',
        why: { a: 'How many, and what size? 8 test tubes (15 cm³).', b: 'The correct name is spotting tile.', c: '“Some” is not a quantity: 100 cm³ of 1.0 % starch solution.' } },
      { type: 'build', lv: 'ie', q: 'Build the entry for the pipette in an IB apparatus list.',
        chips: ['1 × graduated pipette,', '10 cm³,', '± 0.05 cm³', '(half of the 0.1 cm³ division)', 'which is accurate', 'some'],
        answer: ['1 × graduated pipette,', '10 cm³,', '± 0.05 cm³', '(half of the 0.1 cm³ division)'],
        why: 'The number, the name, the size, the uncertainty with its unit, and where the uncertainty comes from.' },
      { type: 'choose', lv: 'ie', q: 'An IA says “Thermometer (± 0.5 °C)”. What would make this stronger?',
        opts: [
          { t: 'Saying where it comes from: half of the 1 °C division', ok: true, why: 'The reader of your report can check a number that has a source.' },
          { t: 'Naming the company that made the thermometer', why: 'The maker does not say how the uncertainty was found.' },
          { t: 'Adding “the thermometer was accurate”', why: '“Accurate” is a claim, not an uncertainty.' },
          { t: 'Giving it to more decimal places: ± 0.50 °C', why: 'More decimal places add nothing. The source of the number is what is missing.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'A 100 cm³ measuring cylinder (± 0.5 cm³) is used to measure 25.0 cm³ and 5.0 cm³. Which is true?',
        opts: [
          { t: 'The 5.0 cm³ has the larger uncertainty compared with its size: 10 % against 2 %.', ok: true, why: '0.5 ÷ 5.0 = 10 %; 0.5 ÷ 25.0 = 2 %. The same uncertainty matters more for a small volume.' },
          { t: 'Both have the same uncertainty, so both are equally good.', why: 'The uncertainty is the same, but it is a much bigger part of 5.0 cm³.' },
          { t: 'The 25.0 cm³ is worse, because it is a larger volume.', why: 'A larger volume makes the same ± 0.5 cm³ matter less.' },
          { t: 'Neither has an uncertainty, because the cylinder is calibrated.', why: 'Calibration does not remove the uncertainty of reading the scale.' }
        ] }
    ],

    words: [
      { term: 'apparatus', forms: ['equipment'], def: 'The equipment used in an experiment. It can be used again.', eg: 'A 10 cm³ graduated pipette, a spotting tile, a water bath.' },
      { term: 'materials', forms: ['material', 'consumables'], def: 'The substances and living material that are consumed in an experiment.', eg: '100 cm³ of 1.0 % starch solution; 50 cm³ of 1.0 % amylase solution.' },
      { term: 'resolution', def: 'The smallest change a measuring instrument can show.', eg: 'A ruler with millimetre marks has a resolution of 1 mm.' },
      { term: 'uncertainty', forms: ['uncertainties'], def: 'The range, written with ± and a unit, within which the [[true value]] is expected to lie.', eg: '24.0 ± 0.5 °C: the true temperature lies between 23.5 and 24.5 °C.' },
      { term: 'measuring instrument', forms: ['measuring instruments', 'instrument', 'instruments'], def: 'A device that gives a measurement as a reading on a scale or a display.', eg: 'A thermometer, a digital balance, a graduated pipette.' }
    ],

    further: [
      { title: 'Two ways to estimate an uncertainty', lv: 'ie',
        md: 'Metrologists, the scientists of measurement, sort uncertainties by how they were found. A __Type A__ uncertainty comes from the spread of repeated readings, using statistics. A __Type B__ uncertainty comes from anything else: the scale, the last digit, a certificate, or experience. “Half the smallest division” is a Type B estimate.',
        cite: 'Joint Committee for Guides in Metrology. *Evaluation of Measurement Data: Guide to the Expression of Uncertainty in Measurement*. JCGM 100:2008, BIPM, 2008.' }
    ],

    sources: ['Cambridge 0610 syllabus 2026–2028, pp. 51–55', 'IB Biology guide (2025), Tool 1 and Tool 3, pp. 29–31', 'Mompel Riera, “Lab Report Guide” (2026), section 5']
  });
})(window.WUL);
