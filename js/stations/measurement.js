/* station: measurement — accuracy, precision, reliability and validity, taught with pictures.
   The ✓ / ~ / ✗ table follows Daniel's settled vocabulary (the Plants Lab potometer, poWhyHtml / poWhyIgcse):
   each mark answers ONE question — does this kind of repeat IMPROVE it? Repeating MEASURES precision (~);
   neither kind of repeat fixes a systematic error; only different individuals support a claim about the organism.
   Keywords inside {html} use the exact term, so they resolve whatever order the stations load in. */
(function (WUL) {
  'use strict';
  /* inline markup; ± is kept on the same line as its number */
  var md = function (s) { return WUL.md(s, { inline: true }).replace(/± /g, '±\u00a0'); };
  var TXT = 'font-family:var(--sans);fill:var(--ink)';
  var NUM = 'font-family:var(--mono);fill:var(--ink)';
  function svg(w, hh, label, body, max) {
    return '<svg viewBox="0 0 ' + w + ' ' + hh + '" width="100%" style="display:block;max-width:' + (max || w) + 'px;margin:0 auto;height:auto" role="img" aria-label="' + WUL.esc(label) + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  function tx(x, y, t, st, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" style="' + st + '">' + t + '</text>'; }

  /* ---------- dartboards ---------- */
  var BOARDS = {
    a: { n: 1, cx: 150, cy: 140, title: 'Accurate and precise', sub: 'the aim', darts: [[-13, -8], [11, -13], [14, 9], [-10, 14], [2, -2]] },
    b: { n: 2, cx: 450, cy: 140, title: 'Precise, not accurate', sub: 'a systematic error', darts: [[30, -58], [60, -52], [44, -28], [66, -36], [42, -46]] },
    c: { n: 3, cx: 150, cy: 440, title: 'Accurate on average, imprecise', sub: 'a random error', darts: [[-62, -18], [40, -58], [58, 40], [-30, 56], [-6, -20]] },
    d: { n: 4, cx: 450, cy: 440, title: 'Neither', sub: 'both kinds of error', darts: [[-10, 70], [88, 10], [70, 86], [10, 20], [42, 4]] }
  };
  function boardFace(B, cx, cy) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="110" style="fill:var(--sheet-2);stroke:var(--ink-3);stroke-width:1.5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="80" style="fill:var(--sheet);stroke:var(--ink-3);stroke-width:1.4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="50" style="fill:var(--sheet-2);stroke:var(--ink-3);stroke-width:1.4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="20" style="fill:var(--hl);stroke:var(--ink);stroke-width:1.6"/>' +
      (B ? '<circle cx="' + (cx - 100) + '" cy="' + (cy - 96) + '" r="14" style="fill:var(--sheet);stroke:var(--ink);stroke-width:1.5"/>' + tx(cx - 100, cy - 90, String(B.n), TXT + ';font-size:16px;font-weight:700') : '');
  }
  function darts(B, cx, cy) {
    return B.darts.map(function (d) {
      var x = cx + d[0], y = cy + d[1];
      return '<path d="M' + (x - 7) + ' ' + (y - 7) + 'L' + (x + 7) + ' ' + (y + 7) + 'M' + (x + 7) + ' ' + (y - 7) + 'L' + (x - 7) + ' ' + (y + 7) + '" style="fill:none;stroke:var(--ink);stroke-width:3.2;stroke-linecap:round"/>';
    }).join('');
  }
  function dartMean(B, cx, cy) {
    var mx = 0, my = 0;
    B.darts.forEach(function (d) { mx += d[0] / B.darts.length; my += d[1] / B.darts.length; });
    return '<circle cx="' + (cx + mx).toFixed(1) + '" cy="' + (cy + my).toFixed(1) + '" r="10" style="fill:none;stroke:var(--blue);stroke-width:3.4"/>';
  }
  function dartboards() {
    var s = '<g data-el="boards">', k;
    for (k in BOARDS) s += boardFace(BOARDS[k], BOARDS[k].cx, BOARDS[k].cy);
    s += '</g>';
    for (k in BOARDS) {
      var B = BOARDS[k];
      s += '<g data-el="darts-' + k + '">' + darts(B, B.cx, B.cy) + tx(B.cx, B.cy + 140, B.title, TXT + ';font-size:19px;font-weight:600') + tx(B.cx, B.cy + 163, B.sub, TXT + ';font-size:16px;fill:var(--ink-2)') + '</g>';
      s += '<g data-el="mean-' + k + '">' + dartMean(B, B.cx, B.cy) + '</g>';
    }
    return svg(600, 612, 'Four dartboards. 1: darts close together on the centre. 2: darts close together but off-centre. 3: darts scattered around the centre. 4: darts scattered and off-centre.', s, 520);
  }
  function oneBoard(k) {
    var B = BOARDS[k];
    return svg(240, 240, 'A dartboard with five darts.', boardFace(null, 120, 120) + darts(B, 120, 120), 240);
  }

  /* ---------- one seedling five times, five seedlings once ---------- */
  function seedling(x, base, hCm, small) {
    var top = base - hCm * 3.6, lw = small ? 11 : 14;
    return '<path d="M' + (x - 20) + ' ' + base + ' L' + (x + 20) + ' ' + base + ' L' + (x + 15) + ' ' + (base + 30) + ' L' + (x - 15) + ' ' + (base + 30) + ' Z" style="fill:var(--sheet-2);stroke:var(--ink);stroke-width:1.6"/>' +
      '<path d="M' + x + ' ' + base + ' Q' + (x - 3) + ' ' + ((base + top) / 2) + ' ' + x + ' ' + top + '" style="fill:none;stroke:var(--green);stroke-width:2.6"/>' +
      '<ellipse cx="' + (x - lw + 2) + '" cy="' + (top + 6) + '" rx="' + lw + '" ry="' + (lw / 2.3).toFixed(1) + '" transform="rotate(-28 ' + (x - lw + 2) + ' ' + (top + 6) + ')" style="fill:var(--green-wash);stroke:var(--green);stroke-width:1.6"/>' +
      '<ellipse cx="' + (x + lw - 2) + '" cy="' + (top + 6) + '" rx="' + lw + '" ry="' + (lw / 2.3).toFixed(1) + '" transform="rotate(28 ' + (x + lw - 2) + ' ' + (top + 6) + ')" style="fill:var(--green-wash);stroke:var(--green);stroke-width:1.6"/>' +
      '<ellipse cx="' + (x - lw + 3) + '" cy="' + (top + 62) + '" rx="' + (lw - 2) + '" ry="' + ((lw - 2) / 2.3).toFixed(1) + '" transform="rotate(-20 ' + (x - lw + 3) + ' ' + (top + 62) + ')" style="fill:var(--green-wash);stroke:var(--green);stroke-width:1.5"/>' +
      '<ellipse cx="' + (x + lw - 3) + '" cy="' + (top + 62) + '" rx="' + (lw - 2) + '" ry="' + ((lw - 2) / 2.3).toFixed(1) + '" transform="rotate(20 ' + (x + lw - 3) + ' ' + (top + 62) + ')" style="fill:var(--green-wash);stroke:var(--green);stroke-width:1.5"/>';
  }
  function technical() {
    var base = 210, top = base - 43.1 * 3.6, s = seedling(70, base, 43.1, false);
    s += '<rect x="112" y="' + (top - 16) + '" width="14" height="' + (base - top + 16) + '" style="fill:var(--amber-wash);stroke:var(--ink);stroke-width:1.4"/>';
    for (var y = base; y > top - 14; y -= 18) s += '<line x1="112" y1="' + y + '" x2="119" y2="' + y + '" style="stroke:var(--ink);stroke-width:1.2"/>';
    s += '<line x1="72" y1="' + top + '" x2="112" y2="' + top + '" style="stroke:var(--ink-2);stroke-width:1.4;stroke-dasharray:4 4"/>';
    s += tx(150, 58, 'Measured 5 times', TXT + ';font-size:15px;font-weight:600', 'start');
    ['43.1', '43.0', '43.2', '43.1', '43.0'].forEach(function (v, i) { s += tx(150, 88 + i * 25, v + ' cm', NUM + ';font-size:15px', 'start'); });
    s += tx(150, 232, 'n = 1', TXT + ';font-size:22px;font-weight:700', 'start');
    return svg(300, 250, 'One seedling in a pot, measured five times with a ruler: 43.1, 43.0, 43.2, 43.1 and 43.0 cm. n = 1.', s, 340);
  }
  function trueReps() {
    var base = 200, s = '', H = [41.0, 44.5, 42.0, 45.5, 43.0];
    H.forEach(function (hc, i) {
      var x = 32 + i * 59;
      s += seedling(x, base, hc, true);
      s += tx(x, base - hc * 3.6 - 14, hc.toFixed(1), NUM + ';font-size:13px');
    });
    s += tx(150, 258, 'n = 5', TXT + ';font-size:22px;font-weight:700');
    return svg(300, 266, 'Five different seedlings, each measured once: 41.0, 44.5, 42.0, 45.5 and 43.0 cm. n = 5.', s, 340);
  }

  /* ---------- tables in the site's teaching style (sans, left-aligned) ---------- */
  var TH = 'text-align:left;vertical-align:bottom;font:600 .86rem/1.35 var(--sans)';
  var TD = 'text-align:left;vertical-align:top;font:400 .93rem/1.45 var(--sans)';
  function proseTable(head, rows) {
    return '<div class="tscroll"><table class="dt"><thead><tr>' + head.map(function (c) { return '<th style="' + TH + '">' + md(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td style="' + TD + (i === 0 ? ';font-weight:600' : '') + '">' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  var ERRORS = proseTable(['', 'Systematic error', 'Random error'], [
    ['What it does', 'Shifts every reading the __same__ way: all too high, or all too low.', 'Scatters readings __unpredictably__: some too high, some too low.'],
    ['On the dartboard', 'Moves the whole group off-centre (board 2).', 'Scatters the group around the centre (board 3).'],
    ['What it reduces', '[[Accuracy|accuracy]]', '[[Precision|precision]]'],
    ['Biology examples', 'A balance that reads 0.3 g with nothing on it: a [[zero error]]. A thermometer that reads 1 °C too high: it needs [[calibration]].', 'Judging by eye when the iodine stops turning blue-black. A water bath whose temperature fluctuates by about ± 2 °C.'],
    ['Does repeating help?', '__No.__ Repeating gives the same wrong answer. Find the cause and fix it.', '__Partly.__ A mean cancels much of it. The spread itself stays.']
  ]);
  function mark(k) {
    var c = k === 'y' ? 'var(--green)' : k === 'p' ? 'var(--amber)' : 'var(--red)';
    return '<b style="color:' + c + ';font:700 1.15em/1 var(--sans);margin-right:5px" aria-label="' + (k === 'y' ? 'improves it' : k === 'p' ? 'in between' : 'does not improve it') + '">' + (k === 'y' ? '✓' : k === 'p' ? '~' : '✗') + '</b>';
  }
  function cell(parts) { return '<td style="' + TD + '">' + parts.map(function (p) { return '<div style="margin-bottom:4px">' + mark(p[0]) + md(p[1]) + '</div>'; }).join('') + '</td>'; }
  var REPEAT_ROWS = [
    ['Precision', 'how close repeated measurements are to each other',
      [['p', 'Repeating lets you judge it: you can only see how close your readings are after measuring more than once.']],
      [['n', 'The spread between plants is natural variation between individuals, not imprecise measuring.']]],
    ['Repeatability', 'same person, same method, same equipment',
      [['p', 'This is exactly what it measures.']],
      [['n', 'Each plant has its own true value, so a new plant does not test your measuring.']]],
    ['Reproducibility', 'a different person or different apparatus',
      [['n', 'It needs a different person or different apparatus.']],
      [['n', 'A new plant is not a new laboratory.']]],
    ['Accuracy', 'how close a measurement is to the true value',
      [['n', 'Repeating cannot fix a systematic error. A mean does cancel random error.']],
      [['n', 'A systematic error shifts the reading of every plant the same way.']]],
    ['Reliability', 'how far the results can be trusted',
      [['y', 'At IGCSE: “repeat and calculate a mean” makes the results more reliable, for this experiment.'], ['p', 'In the fuller view: it is true only for that one sample.']],
      [['y', 'For the mean of the species: enough different individuals.']]],
    ['Validity', 'can the method answer the question?',
      [['n', 'One plant cannot answer a question about plants, even if you measure it very carefully.']],
      [['y', 'The strongest reason: only different individuals let you make a claim about the organism.']]]
  ];
  var REPEATS = '<div class="tscroll"><table class="dt"><thead><tr>' +
    '<th style="' + TH + ';width:22%">The word</th>' +
    '<th style="' + TH + ';width:39%">' + md('Repeat on the __same__ sample: a [[technical replicate]]') + '</th>' +
    '<th style="' + TH + ';width:39%">' + md('A __new__ individual: a [[true replicate]]') + '</th></tr></thead><tbody>' +
    REPEAT_ROWS.map(function (r) {
      return '<tr><td style="' + TD + ';font-weight:600">' + r[0] + '<div style="font-weight:400;font-size:.76rem;line-height:1.3;color:var(--ink-3);margin-top:2px">' + r[1] + '</div></td>' + cell(r[2]) + cell(r[3]) + '</tr>';
    }).join('') + '</tbody></table></div>';

  WUL.station({
    id: 'measurement', stage: 'judge', order: 2, title: 'Accuracy, precision, reliability, validity', levels: 'gie',
    job: 'Use the measurement words exactly, so that every error and weakness you name is the right kind.',
    where: { g: 'In the evaluation, when you judge your results and your method.', i: 'In the evaluation, and wherever you discuss uncertainties.', e: 'In the discussion and the evaluation.' },

    ladder: {
      g: ['Tell [[accuracy]] from [[precision]]', 'Name each error as a [[random error]] or a [[systematic error]]', 'Say why you repeated: to identify anomalous results and to calculate a mean'],
      i: ['Say whether your repeats were [[technical replicate]]s or [[true replicate]]s', 'Count n honestly: avoid [[pseudoreplication]]', 'Assess accuracy, precision, reliability and validity, as Inquiry 2 asks'],
      e: ['Judge [[validity]] with all three questions, and say how far it limits the conclusion']
    },

    build: [
      { type: 'steps', title: 'Accuracy and precision on a dartboard',
        intro: 'Each board is one experiment. Each dart is one measurement. Press Next step.',
        stage: { html: dartboards() },
        steps: [
          { title: 'The centre is the true value', show: ['boards'], text: 'The yellow centre is the [[true value]]: the value a perfect measurement would give. You try to hit it again and again.' },
          { title: 'Board 1: accurate and precise', show: ['darts-a'], text: 'The darts are close to the centre: [[accurate|accuracy]]. They are close to each other: [[precise|precision]].' },
          { title: 'Board 2: precise, but not accurate', show: ['darts-b'], text: 'The darts are close to each other, but far from the centre. A [[systematic error]] moved every one the same way. This board is the most misleading: it looks consistent, and every reading is wrong.' },
          { title: 'Board 3: accurate on average, but imprecise', show: ['darts-c'], text: 'The darts are scattered, but centred on the true value. A [[random error]] scatters readings high and low.' },
          { title: 'Board 4: neither', show: ['darts-d'], text: 'Scattered and off-centre: both kinds of error together.' },
          { title: 'Now take the mean of each board', show: ['mean-a', 'mean-b', 'mean-c', 'mean-d'], text: 'The blue ring is the mean of the five darts. On board 3 it is on the centre: a mean does cancel random error. On board 2 it stays off-centre: repeating cannot fix a systematic error.' }
        ] },

      { type: 'grid2', title: 'The two kinds of error', items: [
        { label: 'They affect results in different ways', v: { html: ERRORS }, note: 'A temperature that fluctuates by ± 2 °C is a __random__ error. A bath that is always 2 °C too hot has a __systematic__ error.' }
      ] },

      { type: 'compare', title: 'Resolution is not precision',
        bad: { table: { caption: 'Digital thermometer (0.01 °C) in an unstirred water bath', head: [['Reading', 'Temperature / °C']], rows: [['1', '37.12'], ['2', '36.48'], ['3', '37.90']], cls: 'dt--mini' } },
        good: { table: { caption: 'Thermometer with 1 °C divisions in a stirred water bath', head: [['Reading', 'Temperature / °C ± 0.5']], rows: [['1', '37'], ['2', '37'], ['3', '37']], cls: 'dt--mini' } },
        badLabel: 'Fine resolution, poor precision', goodLabel: 'Coarse resolution, good precision',
        why: '[[Resolution|resolution]] is what the instrument can show. [[Precision|precision]] is what your repeats actually show. More decimal places do not make readings precise.' },

      { type: 'grid2', title: 'Repeatable and reproducible', items: [
        { label: 'Repeatable', v: 'The __same__ person, with the __same__ method and equipment, repeats the measurements and obtains the same results.', note: 'You repeat your own trials at 50 °C and obtain the same times again.' },
        { label: 'Reproducible', v: 'A __different__ person, or __different__ equipment, follows the method and still obtains the same results. This is the stronger test.', note: 'Another class follows your method and finds the same optimum.' }
      ] },

      { type: 'grid2', title: 'Technical and true replicates', items: [
        { label: 'Technical replicates: one seedling, five times', v: { html: technical() }, note: 'Five measurements of one seedling give a better value for that one sample, and nothing else.' },
        { label: 'True replicates: five seedlings, once each', v: { html: trueReps() }, note: 'Only different individuals contain the natural variation between individuals.' }
      ] },

      { type: 'note', tone: 'warn', label: 'Warning', title: 'Avoid pseudoreplication', md: 'Measuring one seedling five times and writing n = 5 is [[pseudoreplication]]. You have one plant. Counting it as five makes a conclusion look far stronger than the evidence allows. Both kinds of repeat are useful: say which you did.' },

      { type: 'grid2', title: 'What each repeat improves', items: [
        { label: 'Each mark answers one question', v: { html: REPEATS }, note: '✓ improves it · ~ in between: repeating lets you judge it · ✗ does not improve it' }
      ] },

      { type: 'rules', title: 'Validity: more than a fair test', items: [
        { icon: '1', t: 'Did __only__ the independent variable affect the results? This is the [[fair test]] part.' },
        { icon: '2', t: 'Did you measure the __right thing__? If the question is about growth, is height alone a good measure?' },
        { icon: '3', t: 'Can your __design__ answer the question? One temperature cannot show a trend. One plant cannot represent a species.' },
        { icon: '!', t: 'A fair test can still be invalid: counting leaves cannot answer “does fertiliser make plants taller?”. A small imperfection does not make a method invalid: bubbles of different sizes still show whether light changes the rate.' }
      ] },

      { type: 'compare', title: 'Why were the repeats done?',
        bad: '“To make the results more accurate.”\n\n“To calculate an average.” (alone)\n\n“To reduce human error.”',
        good: '“To identify anomalous results, and exclude them from the mean.”\n\n“To calculate a mean, which makes the results more reliable.”',
        badLabel: 'Not credited', goodLabel: 'Credited',
        why: 'Recent Cambridge mark schemes credit the first answer; older ones credited the second. “More accurate” is rejected: repeats cannot fix a systematic error. “Human error” is never credited: name the error instead.' },

      { type: 'note', tone: 'ib', title: 'What the IB guide asks', label: 'What the IB guide asks', lv: 'ie', md: 'Inquiry 2 asks you to “Assess accuracy, precision, reliability and validity”. Inquiry 3 asks you to “Identify and discuss sources and impacts of random and systematic errors”. The guide’s own summary: random errors “lead to imprecision and uncertainty, whereas systematic errors lead to inaccuracy”. Say whether your repeats were technical or true replicates, so the reader of your report knows what n counts.' },

      { type: 'frames', title: 'Sentences that use these words', items: [
        'This is a random error, because ___; it reduced the precision of ___.',
        'This is a systematic error, because every ___ was too ___ by the same value; repeating would not have removed it.',
        'Each ___ was measured ___ times (technical replicates), and ___ different ___ were used (true replicates), so n = ___.',
        'The method was valid for the question, because ___; however, ___ limits the conclusion to ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'An IGCSE evaluation. Five phrases would lose marks.',
        body: 'The results were [!a:accurate because the repeats were close together]. [!b:Human error] may have affected the timing. The water bath went up and down by about 2 °C, [!c:which is a systematic error]. The experiment was repeated three times [!d:to make it more accurate]. [!e:It was a fair test, so it was valid.]',
        notes: {
          a: { label: 'precise, not accurate', why: 'Close repeats show precision. Accuracy is how close the readings are to the true value.' },
          b: { label: 'human error?', why: 'Never credited. Name the error: the end point was judged by eye, which is a random error.' },
          c: { label: 'random, not systematic', why: 'A temperature that rises and falls unpredictably is a random error. A bath that is always 2 °C too hot would be systematic.' },
          d: { label: 'not accuracy', why: 'Repeats cannot fix a systematic error. Write: to identify anomalous results, and to calculate a mean.' },
          e: { label: 'fair ≠ valid', why: 'A fair test is one part of validity. Also ask: was the right thing measured, and can the design answer the question?' }
        },
        fixed: 'The results were ==precise, because the three repeats at each temperature were close together==. ==The end point was judged by eye, which is a random error== and reduced the precision of the times. ==The temperature of the water bath fluctuated by about ± 2 °C, which is a random error==. The experiment was repeated three times ==to identify anomalous results and to calculate a mean==. ==Only the temperature was changed, and the time for the starch to disappear is a suitable measure of how fast amylase works, so the method was valid for the question.==',
        fixedNote: 'Every word now names the right idea, and each error is named and classified.'
      },
      i: {
        title: 'An IA evaluation. Five phrases would lose marks.',
        body: 'Each seedling was measured five times, [!a:so n = 5]. [!b:The five measurements made the results reliable for all bean plants.] The balance read 0.3 g with nothing on it; [!c:taking more repeats reduced this error]. [!d:The results were accurate, because the standard deviation was small.] [!e:The method was reproducible, because it was repeated three times.]',
        notes: {
          a: { label: 'n = 1', why: 'Five measurements of one seedling are technical replicates: n = 1. n counts different individuals.' },
          b: { label: 'one plant only', why: 'Technical replicates give a better value for that one sample and nothing else. Only different individuals contain the natural variation between individuals.' },
          c: { label: 'systematic', why: 'A zero error adds 0.3 g to every mass. Repeating gives the same wrong answer: zero the balance, or subtract 0.3 g.' },
          d: { label: 'precise, not accurate', why: 'A small SD shows that the readings agree with each other: precision. Accuracy needs a comparison with the true value.' },
          e: { label: 'repeatable', why: 'The same person repeating the method shows it is repeatable. Reproducible needs a different person or different apparatus.' }
        },
        fixed: 'Each seedling was measured five times ==(technical replicates), and ten seedlings were used (true replicates), so n = 10==. ==The five measurements gave a better value for each seedling; the ten seedlings contain the natural variation between individuals.== The balance read 0.3 g with nothing on it; ==this zero error is a systematic error, so 0.3 g was subtracted from every mass==. ==The small standard deviation shows that the measurements were precise.== ==The method was repeatable; it would be reproducible if another person obtained the same results with it.==',
        fixedNote: 'n now counts individuals, the zero error is corrected, and each word means what it should.'
      }
    },

    traps: [
      { bad: 'The repeats were close, so the results were accurate.', good: 'The repeats were close, so the results were __precise__.' },
      { bad: 'Human error.', good: 'Name it: the end point was judged by eye, a random error.' },
      { bad: 'Repeating made the results more accurate.', good: 'Repeating cannot fix a systematic error. Repeats let you identify anomalous results.' },
      { bad: 'The bath fluctuated by ± 2 °C: a systematic error.', good: 'A fluctuation is a __random__ error. A constant offset is systematic.' },
      { bad: 'One plant measured five times: n = 5.', good: 'n = 1. That is pseudoreplication: n counts different individuals.' },
      { bad: 'It was a fair test, so it was valid.', good: 'A fair test is one part. Also the right measure, and a design that can answer the question.' }
    ],

    test: [
      { type: 'choose', q: 'Which words describe these five darts?',
        show: { html: oneBoard('b') },
        opts: [
          { t: 'Precise, but not accurate', ok: true, why: 'The darts are close to each other, but all off the centre: a systematic error.' },
          { t: 'Accurate, but not precise', why: 'Accurate would mean close to the centre. These are all off to one side.' },
          { t: 'Accurate and precise', why: 'They are close together, but not on the centre.' },
          { t: 'Neither accurate nor precise', why: 'They are close together, so they are precise.' }
        ] },
      { type: 'sort', q: 'Sort each error.',
        bins: ['Random error', 'Systematic error'],
        items: [
          { t: 'A balance reads 0.3 g with nothing on it', bin: 1, why: 'A zero error adds the same 0.3 g to every mass.' },
          { t: 'Judging by eye when the iodine stops turning blue-black', bin: 0, why: 'The end point is not sharp, so the judgement varies from trial to trial.' },
          { t: 'The temperature of a water bath fluctuates by about ± 2 °C', bin: 0, why: 'It rises and falls unpredictably: random.' },
          { t: 'A thermometer reads 1 °C too high at every temperature', bin: 1, why: 'Every reading is shifted the same way.' },
          { t: 'Drops from a dropping pipette vary in size', bin: 0, why: 'Some drops are bigger, some smaller, unpredictably.' },
          { t: 'Every volume is read from the top of the meniscus', bin: 1, why: 'Every reading is too high by the same volume.' }
        ] },
      { type: 'choose', q: 'Three repeats agree closely: 50, 50 and 50 s. What does this show?',
        opts: [
          { t: 'The readings are precise.', ok: true, why: 'Close agreement between repeats is precision.' },
          { t: 'The readings are accurate.', why: 'A systematic error could make all three wrong by the same number of seconds.' },
          { t: 'There was no error at all.', why: 'A systematic error does not appear as spread.' },
          { t: 'The method is reproducible.', why: 'Reproducible needs a different person or different equipment.' }
        ] },
      { type: 'choose', q: 'An exam asks: “Why were the repeats done?” Which answer earns the mark in recent Cambridge mark schemes?',
        opts: [
          { t: 'To identify anomalous results, and exclude them from the mean', ok: true, why: 'Recent mark schemes credit this answer.' },
          { t: 'To make the results more accurate', why: 'Rejected: repeats cannot fix a systematic error.' },
          { t: 'To reduce human error', why: '“Human error” is never credited. Name the error.' },
          { t: 'To calculate an average', why: 'On its own, this is rejected in recent reports. Say what the mean is for.' }
        ] },
      { type: 'choose', q: 'Another class follows your method and finds the same optimum temperature. What does this show?',
        opts: [
          { t: 'The results are reproducible.', ok: true, why: 'Different people, same method, same result: reproducible, the stronger test.' },
          { t: 'The results are repeatable.', why: 'Repeatable means the same person repeating with the same equipment.' },
          { t: 'The results are accurate.', why: 'Both classes could share the same systematic error.' },
          { t: 'The results are precise.', why: 'Precision is about how close your own repeats are.' }
        ] },
      { type: 'choose', q: 'One seedling was measured five times. What is n?',
        show: { html: technical() },
        opts: [
          { t: 'n = 1', ok: true, why: 'n counts different individuals. These are technical replicates of one seedling.' },
          { t: 'n = 5', why: 'Counting five measurements of one plant as five plants is pseudoreplication.' },
          { t: 'n = 43.1', why: 'n is a count of individuals, not a measurement.' },
          { t: 'It cannot be known', why: 'One seedling was used, so n = 1.' }
        ] },
      { type: 'spot', q: 'Tap the three phrases that would lose marks.',
        text: 'The results were [!a:accurate because the three repeats were close]. [!b:Human error] affected the end point. [?:The water bath varied by about ± 2 °C, which is a random error.] The experiment was repeated [!c:to make it more accurate].',
        why: { a: 'Close repeats show precision, not accuracy.', b: '“Human error” is never credited. Name the error: the end point was judged by eye.', c: 'Repeats cannot fix a systematic error. Write: to identify anomalous results, and to calculate a mean.' } },
      { type: 'multi', q: 'Which questions does validity ask?',
        opts: [
          { t: 'Did only the independent variable affect the results?', ok: true, why: 'The fair test part.' },
          { t: 'Was the right thing measured?', ok: true, why: 'Height alone may not measure growth.' },
          { t: 'Can the design answer the question?', ok: true, why: 'One plant cannot represent a species.' },
          { t: 'Were the repeats close together?', why: 'That is precision.' },
          { t: 'Did the results match the hypothesis?', why: 'A valid method can give any result.' }
        ],
        why: 'A fair test is only the first of the three.' },
      { type: 'choose', lv: 'ie', q: 'Five different seedlings are measured once each, instead of one seedling five times. What does this improve most?',
        opts: [
          { t: 'Validity: the result can support a claim about this kind of plant', ok: true, why: 'Only different individuals contain the natural variation between individuals.' },
          { t: 'Accuracy', why: 'Neither kind of repeat fixes a systematic error.' },
          { t: 'Precision', why: 'The spread between plants is natural variation, not imprecise measuring.' },
          { t: 'Reproducibility', why: 'A new plant is not a new person or new apparatus.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'Five measurements of the same leaf give…',
        opts: [
          { t: 'a better value for that one leaf, and nothing else.', ok: true, why: 'Technical replicates are about one sample.' },
          { t: 'a result that holds for the whole species.', why: 'Only different individuals contain the natural variation between individuals.' },
          { t: 'n = 5.', why: 'That is pseudoreplication: n = 1.' },
          { t: 'a more accurate result.', why: 'A mean cancels random error, but it cannot fix a systematic error.' }
        ] }
    ],

    words: [
      { term: 'accuracy', forms: ['accurate', 'inaccurate', 'inaccuracy'], def: 'How close a measurement is to the true value.', eg: 'A thermometer that reads 40.0 °C in a bath whose true temperature is 40.0 °C.' },
      { term: 'precision', forms: ['precise', 'imprecise', 'imprecision'], def: 'How close repeated measurements are to each other.', eg: 'Trials of 70, 80 and 70 s are more precise than 40, 110 and 70 s.' },
      { term: 'reliability', forms: ['reliable', 'unreliable'], def: 'How far results can be trusted; at IGCSE, repeating and calculating a mean makes them more reliable.', eg: 'Three trials at each temperature, with anomalous results excluded from the mean.' },
      { term: 'validity', forms: ['valid', 'invalid'], def: 'Whether the whole method is suitable for answering the question asked.', eg: 'Counting leaves cannot answer a question about plant height.' },
      { term: 'random error', forms: ['random errors'], def: 'An error that makes readings vary unpredictably: some too high, some too low.', eg: 'Judging by eye when the iodine stops turning blue-black.' },
      { term: 'systematic error', forms: ['systematic errors'], def: 'An error that shifts every reading in the same direction.', eg: 'A balance that reads 0.3 g with nothing on it.' },
      { term: 'repeatable', forms: ['repeatability'], def: 'Giving the same results when the same person repeats the method with the same equipment.', eg: 'You repeat your own trials at 50 °C and obtain the same times again.' },
      { term: 'reproducible', forms: ['reproducibility'], def: 'Giving the same results when a different person, or different equipment, follows the method.', eg: 'Another class follows your method and finds the same optimum.' },
      { term: 'true value', forms: ['true values'], def: 'The value that a perfect measurement would give.', eg: 'The real temperature of the water bath, which no thermometer shows exactly.' },
      { term: 'technical replicate', forms: ['technical replicates'], def: 'A repeat measurement of the same sample or individual.', eg: 'Measuring the height of one seedling five times.' },
      { term: 'true replicate', forms: ['true replicates', 'biological replicate', 'biological replicates'], def: 'A measurement of a different individual or independent sample, treated in the same way.', eg: 'Measuring the heights of five different seedlings.' },
      { term: 'pseudoreplication', def: 'The mistake of counting repeat measurements of one individual as if they came from different individuals.', eg: 'One plant measured five times, reported as n = 5.' },
      { term: 'calibration', forms: ['calibrate', 'calibrated'], def: 'Checking an instrument against known values, and correcting it, so that its readings are accurate.', eg: 'Checking a thermometer in melting ice, which is at 0 °C.' },
      { term: 'zero error', forms: ['zero errors'], def: 'A reading that an instrument shows when the true value is zero.', eg: 'A balance that shows 0.3 g with nothing on it.' }
    ],

    further: [
      { title: 'How measurement scientists use these words',
        md: 'The international vocabulary of metrology defines accuracy and precision much as this page does. It never gives accuracy a number: accuracy is a quality, not a quantity. It splits precision by the conditions: __repeatability__ (same person, same instrument, a short time) and __reproducibility__ (different people, instruments or places). The word “reliability” is not in it. Many scientists prefer repeatable or reproducible.',
        cite: 'Joint Committee for Guides in Metrology. *International Vocabulary of Metrology: Basic and General Concepts and Associated Terms (VIM)*. 3rd ed., JCGM 200:2012, BIPM, 2012.' },
      { title: 'Where the word “pseudoreplication” comes from', lv: 'ie',
        md: 'The ecologist Stuart Hurlbert introduced the word in 1984. He reviewed published field experiments and found this mistake in many of them. Typically, several samples from one plot or one tank were treated as if they were independent. It is the same mistake as counting one plant measured five times as five plants.',
        cite: 'Hurlbert, Stuart H. “Pseudoreplication and the Design of Ecological Field Experiments.” *Ecological Monographs*, vol. 54, no. 2, 1984, pp. 187–211.' }
    ],

    sources: ['IB Biology guide (2025), Nature of science p. 7; Inquiry 2 and 3, pp. 32–33', 'Cambridge 0610 Paper 6 mark schemes and examiner reports, 2018–2025', 'D. Mompel Riera, *Accuracy, precision, reliability and validity — IGCSE and IB*']
  });
})(window.WUL);
