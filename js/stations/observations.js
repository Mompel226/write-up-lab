/* station: observations — qualitative data: what you see as well as what you measure.
   The iodine swatches follow WUL.data.amylase: a drop is tested every 10 s; the recorded time is the
   first sample that no longer turns blue-black (starch gone, iodine stays orange-brown). */
(function (WUL) {
  'use strict';
  var G = WUL.data.amylase.g;
  function nb(t) { return String(t).replace(/ \/ /g, ' / ').replace(/ ± /g, ' ± '); }
  function T(spec, cls) {
    (spec.head || []).forEach(function (row) { row.forEach(function (c, k) { if (typeof c === 'string') row[k] = nb(c); else if (c && c.t) c.t = nb(c.t); }); });
    if (cls) spec.cls = cls;
    return spec;
  }

  /* a spotting tile: one drop of iodine + reaction mixture every 10 s, from 0 to 80 s.
     Blue-black while starch is present; orange-brown from the end point on.
     parts: true tags the wells and labels for an anatomy block (data-part 1–3). */
  var BLUE = ['#14132A', '#161630', '#191935', '#1C1B3B', '#201E41', '#262247', '#2C264D'];
  var ORANGE = ['#B8661E', '#C2742A'];
  function tile(end, parts) {
    var n = 9, x0 = 46, dx = 58, cy = 72, out = [];
    var W = 560, H = 180;
    var endK = end / 10;
    function pa(p) { return parts ? ' class="pt pt' + p + '" data-part="' + p + '"' : ''; }
    out.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="A spotting tile. Drops sampled every 10 s stay blue-black up to ' + (end - 10) + ' s, then stay orange-brown from ' + end + ' s: the starch has gone." style="display:block;max-width:620px;height:auto">');
    out.push('<rect x="8" y="34" width="544" height="76" rx="12" fill="#F2F1EC" stroke="#9AA3A8" stroke-width="1.5"/>');
    /* part bands under the wells, in the legend colours */
    if (parts) {
      out.push('<g' + pa(1) + '><rect x="' + (x0 - 24) + '" y="114" width="' + (dx * (endK - 1) + 48) + '" height="6" rx="3" fill="var(--p1k)"/></g>');
    }
    var wells1 = [], wells2 = [];
    for (var k = 0; k < n; k++) {
      var cx = x0 + k * dx, t = k * 10, gone = t >= end;
      var col = gone ? ORANGE[Math.min(k - endK, ORANGE.length - 1)] : BLUE[Math.min(Math.round(k / Math.max(1, endK - 1) * (BLUE.length - 1)), BLUE.length - 1)];
      var w = '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="#DEDCD3"/><circle cx="' + cx + '" cy="' + cy + '" r="17" fill="' + col + '"/>' +
        '<ellipse cx="' + (cx - 6) + '" cy="' + (cy - 7) + '" rx="5" ry="3" fill="#fff" opacity=".28"/>';
      (gone ? wells2 : wells1).push(w);
    }
    out.push('<g' + pa(1) + '>' + wells1.join('') + '</g>');
    var ex = x0 + endK * dx;
    out.push('<g' + pa(2) + '>' + wells2.join('') +
      (parts ? '<rect x="' + (ex - 24) + '" y="114" width="' + (dx * (n - 1 - endK) + 48) + '" height="6" rx="3" fill="var(--p2k)"/>' : '') +
      '<path d="M' + ex + ' 30 V44" stroke="var(--ink)" stroke-width="1.6" fill="none"/><path d="M' + (ex - 5) + ' 38 L' + ex + ' 45 L' + (ex + 5) + ' 38" stroke="var(--ink)" stroke-width="1.6" fill="none"/>' +
      '<text x="' + ex + '" y="22" text-anchor="middle" style="font:600 19px var(--sans);fill:var(--ink)">end point: ' + end + ' s</text></g>');
    var labs = [];
    for (k = 0; k < n; k++) labs.push('<text x="' + (x0 + k * dx) + '" y="144" text-anchor="middle" style="font:500 19px var(--mono);fill:var(--ink-2)">' + (k * 10) + '</text>');
    out.push('<g' + pa(3) + '>' + labs.join('') + '<text x="280" y="172" text-anchor="middle" style="font:600 18px var(--sans);fill:var(--ink)">Time of sample / s</text></g>');
    out.push('</svg>');
    return out.join('');
  }

  var potato = [['0.0', '2.50', '2.71', '+8.4', 'Firm; snapped when bent'], ['0.2', '2.48', '2.58', '+4.0', 'Firm'], ['0.4', '2.52', '2.49', '−1.2', 'Slightly soft'],
                ['0.6', '2.49', '2.28', '−8.4', 'Soft; bent easily'], ['0.8', '2.51', '2.21', '−12.0', 'Very soft and limp'], ['1.0', '2.50', '2.15', '−14.0', 'Limp; surface wrinkled']];

  WUL.station({
    id: 'observations', stage: 'record', order: 3, title: 'Observations', levels: 'gie',
    job: 'Record what you see as well as what you measure: colour, cloudiness, bubbles, texture, damage. It can explain the numbers.',
    where: {
      g: 'Not a section of its own: an Observations column in your results table, or a short note under it.',
      i: 'Not a section of its own: inside your Data analysis, beside the raw data: an Observations column, or a short note under the table.',
      e: 'Not a section of its own: in the body, next to the data each observation helps to explain.'
    },

    ladder: {
      g: ['Colour changes, cloudiness, bubbles, texture, firmness, damage', 'In an Observations column, or a short note under the table', 'Only what adds something: “the solution stayed clear” adds nothing'],
      i: ['[[Quantitative data]] “supported by qualitative observations where appropriate” (IB Biology guide, p. 116)', 'An [[observation]] can explain an [[anomalous result]], or show a limit of the method'],
      e: ['Observations that support the argument, placed next to the data they explain']
    },

    build: [
      { type: 'anatomy', title: 'What the iodine showed',
        intro: 'Amylase and starch at 40 °C, trial 1. One drop was tested with iodine every 10 s. Tap a colour.',
        model: { html: '<div class="wd-table-fixer--figure">' + tile(G.trials[2][0], true) + '</div>' },
        parts: [
          { n: 1, name: 'Blue-black', note: 'Starch is still there. Iodine turns blue-black with starch.' },
          { n: 2, name: 'Orange-brown: the end point', note: 'No starch left, so the iodine keeps its own colour. The time recorded is the first of these: 70 s.' },
          { n: 3, name: 'The sample times', note: 'Every 10 s. So the time is only known to the nearest sample.' }
        ],
        after: 'A colour is [[qualitative data]]. The time of the first orange-brown sample, 70 s, is [[quantitative data]].' },

      { type: 'grid2', title: 'Two kinds of data',
        items: [
          { label: 'Quantitative: a number and a unit', v: 'Time for starch to disappear: ==70 s==\nMass of the cylinder: ==2.28 g==\nVolume of gas in 5 min: ==4.8 cm³==', note: 'Measured with an instrument.' },
          { label: 'Qualitative: a description', v: 'From 70 s, the iodine ==stayed orange-brown==.\nThe cylinder was ==limp and wrinkled==.\n==Small bubbles== formed on the leaf.', note: 'Seen, felt or smelt. No number.' }
        ] },

      { type: 'table', title: 'An Observations column',
        spec: T({
          caption: 'Table 1. Data and observations showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the percentage change in mass and the firmness of potato cylinders.',
          head: [['Concentration of sucrose solution / mol dm⁻³', 'Percentage change in mass / %', '==Observations==']],
          rows: potato.map(function (r) { return [r[0], r[3], r[4]]; })
        }, 'wd-table-fixer--compact'),
        after: 'The words agree with the numbers: cylinders that lost mass became soft. Observations that do not fit a column go in a short note under the table.' },

      { type: 'compare', title: 'Observations that add something',
        bad: 'The solution stayed clear.\n\nThe experiment went well.\n\nThe potatoes looked weird.',
        good: 'At 1.0 mol dm⁻³, the cylinder was ==limp and its surface was wrinkled==.\n\n==One cylinder had a bruised, brown patch==, so it was replaced before weighing.',
        badLabel: 'Adds nothing', goodLabel: 'Helps explain the numbers',
        why: 'Include an [[observation]] when it helps explain a number, or shows how the living material varied.' },

      { type: 'rules', title: 'Rules for observations', items: [
        '[[Qualitative data]] are descriptions. [[Quantitative data]] are numbers, usually with units.',
        'Record colour, cloudiness, bubbles, texture, firmness and damage.',
        'Put them in an Observations column, or a short note under the table.',
        'Living material varies: one leaf is damaged, one potato is firmer. Record it.',
        'Include an observation only if it adds something.',
        'Write it as a fact, in the past tense: “turned brown”, not “seemed to go brownish”.'
      ] },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'What the IB guide says', title: 'Observations in the IB guide',
        md: 'The investigation “must involve the collection and analysis of quantitative data that should be supported by qualitative observations where appropriate” (IB Biology guide, p. 116). The skills list also asks you to “identify and record relevant qualitative observations”.' },

      { type: 'frames', title: 'Sentence frames for observations', items: [
        'At ___ °C, the first drop that stayed ___ was at ___ s.',
        'At ___ mol dm⁻³, the cylinder was ___ and ___.',
        'In trial ___, the ___ was ___, which may explain the ___ result.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote these observations. Four add nothing.',
        body: '[!tf-a:The experiment went well.]\n\n[!tf-b:The potatoes changed.]\n\nAt 1.0 mol dm⁻³, the cylinder was limp and its surface was wrinkled.\n\n[!tf-c:The solutions stayed clear.]\n\n[!tf-d:One potato was weird.]',
        notes: {
          'tf-a': { label: 'not an observation', why: 'This is an opinion about the lesson. Describe what was seen.' },
          'tf-b': { label: 'changed how?', why: 'Say how, and at which concentration: __at 0.0 mol dm⁻³, the cylinder was firm and snapped when bent__.' },
          'tf-c': { label: 'adds nothing', why: 'Nothing depends on it. Omit it.' },
          'tf-d': { label: 'weird how?', why: 'Describe it: __one cylinder had a bruised, brown patch, so it was replaced before weighing__.' }
        },
        fixed: '==At 0.0 mol dm⁻³, the cylinder was firm and snapped when bent.==\n\nAt 1.0 mol dm⁻³, the cylinder was limp and its surface was wrinkled.\n\n==One cylinder had a bruised, brown patch, so it was replaced before weighing.==',
        fixedNote: 'Every observation now describes the material and helps explain the numbers.'
      }
    },

    traps: [
      { bad: 'The colour changed.', good: 'From 70 s, the iodine stayed orange-brown: no starch was left.' },
      { bad: 'The solution stayed clear.', good: 'Omit it, unless something depends on it.' },
      { bad: 'The potato felt weird.', good: 'The cylinder was soft and bent easily.' },
      { bad: 'Words inside a number cell: “−8.4 (soft)”', good: 'A separate Observations column, or a note under the table.' },
      { bad: 'Only numbers, and no observations at all.', good: 'Quantitative data supported by qualitative observations where appropriate.', lv: 'ie' }
    ],

    test: [
      { type: 'sort', q: 'Quantitative or qualitative?',
        bins: ['Quantitative', 'Qualitative'],
        items: [
          { t: '70 s', bin: 0, why: 'A number with a unit.' },
          { t: 'The iodine stayed orange-brown', bin: 1, why: 'A description of a colour.' },
          { t: '2.28 g', bin: 0, why: 'A number with a unit.' },
          { t: 'The cylinder was limp', bin: 1, why: 'A description of texture.' },
          { t: 'Small bubbles on the leaf', bin: 1, why: 'A description, with no number.' },
          { t: '12 bubbles in one minute', bin: 0, why: 'A count is a number, so it is quantitative.' }
        ] },
      { type: 'choose', q: 'The iodine was tested every 10 s at 50 °C. When did the starch disappear?',
        show: { html: tile(G.trials[3][2]) },
        opts: [
          { t: '60 s', ok: true, why: 'The first sample that stayed orange-brown: no starch was left.' },
          { t: '50 s', why: 'At 50 s the drop still turned blue-black, so starch was still there.' },
          { t: '70 s', why: 'By 70 s the starch had already gone. Record the first orange-brown sample.' },
          { t: '0 s', why: 'At 0 s all the starch was there: the drop turned blue-black.' }
        ] },
      { type: 'choose', q: 'Which observation adds something to the potato results?',
        opts: [
          { t: 'The cylinder at 1.0 mol dm⁻³ was limp and wrinkled.', ok: true, why: 'It agrees with the mass lost, and describes the tissue.' },
          { t: 'The solutions stayed clear.', why: 'Nothing depends on it, so it adds nothing.' },
          { t: 'The cylinders were cut with a cork borer.', why: 'That belongs in the method. It is not an observation of the result.' },
          { t: 'The experiment was interesting.', why: 'An opinion, not an observation.' }
        ] },
      { type: 'spot', q: 'Tap the two observations that add nothing.',
        text: '[?:At 0.0 mol dm⁻³, the cylinder was firm and snapped when bent.] [!a:The experiment went well.] [?:One cylinder had a bruised, brown patch and was replaced.] [!b:The solutions stayed clear.] [?:At 1.0 mol dm⁻³, the surface was wrinkled.]',
        why: { a: 'An opinion, not an observation of the material.', b: 'Nothing depends on it, so it adds nothing.' } },
      { type: 'choose', q: 'Why record observations of the living material?',
        opts: [
          { t: 'Individuals vary: one leaf may be damaged, one potato firmer, and this can explain a result.', ok: true, why: 'Biological material is never identical, so its differences are worth recording.' },
          { t: 'They make the report longer.', why: 'Length earns nothing. Relevance does.' },
          { t: 'They replace the need for repeats.', why: 'Repeats are still needed. Observations help explain the spread.' },
          { t: 'They prove the hypothesis.', why: 'An observation can support a result, but it proves nothing alone.' }
        ] },
      { type: 'choose', q: 'Where does an observation go?',
        opts: [
          { t: 'In an Observations column, or a short note under the table', ok: true, why: 'Beside the data it explains, but out of the number cells.' },
          { t: 'In the number cells, next to each value', why: 'A cell of numbers holds a number only.' },
          { t: 'Only in the conclusion', why: 'Record it with the data. The conclusion may then use it.' },
          { t: 'Nowhere: only numbers count', why: 'Observations can explain the numbers, so record them.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'What does the IB Biology guide say about qualitative observations in the IA?',
        opts: [
          { t: 'Quantitative data should be supported by them where appropriate.', ok: true, why: 'The guide’s words: “supported by qualitative observations where appropriate” (p. 116).' },
          { t: 'They can replace quantitative data.', why: 'The IA must collect and analyse quantitative data.' },
          { t: 'They are not allowed.', why: 'The skills list asks for relevant qualitative observations.' },
          { t: 'They must fill a whole page.', why: 'Only relevant observations, where appropriate.' }
        ] }
    ],

    words: [
      { term: 'qualitative data', forms: ['qualitative', 'qualitative observation', 'qualitative observations'], def: 'Descriptions of what is seen, felt or smelt, without numbers.', eg: 'The cylinder was limp and wrinkled.' },
      { term: 'quantitative data', forms: ['quantitative'], def: 'Measurements given as numbers, usually with units.', eg: '70 s; 2.28 g; 4.8 cm³' },
      { term: 'observation', forms: ['observations'], def: 'Something noticed and recorded during an experiment, as a number or as a description.', eg: 'At 70 s, the iodine stayed orange-brown.' }
    ],

    sources: ['IB Biology guide (2025), the scientific investigation, p. 116', 'IB Biology guide (2025), Inquiry 2 skills, pp. 32–33', 'Cambridge 0610 syllabus 2026–2028, p. 10 (AO3.3)']
  });
})(window.WUL);
