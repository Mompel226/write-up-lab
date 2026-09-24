/* station: report — what a lab report is, the order of its parts at each level, and the scientific voice.
   The parts match the specimen report on the front page (js/specimen.js) exactly. */
(function (WUL) {
  'use strict';

  /* a report's parts drawn as a "spine": numbered circles on one line, grouped or tagged by criterion */
  var C = { g: 'var(--green)', rd: 'var(--p4k)', da: 'var(--p3k)', co: 'var(--p5k)', ev: 'var(--p2k)', no: 'var(--ink-3)',
    A: 'var(--p4k)', B: 'var(--p6k)', Cc: 'var(--p3k)', D: 'var(--p2k)', E: 'var(--p5k)' };
  function dot(n, c) {
    return '<span style="flex:none;width:24px;height:24px;border-radius:50%;background:var(--sheet);border:2px solid ' + c + ';color:' + c +
      ';display:grid;place-items:center;font:700 .68rem/1 var(--mono);position:relative;z-index:1">' + n + '</span>';
  }
  function tag(t, c) {
    return '<span style="margin-left:auto;flex:none;font:700 .66rem/1 var(--mono);color:' + c + ';border:1px solid ' + c + ';border-radius:3px;padding:3px 5px">' + t + '</span>';
  }
  function spine(rows) {
    var n = 0, out = '<ol style="list-style:none;margin:0 0 0 11px;padding:0;border-left:2px solid var(--rule)">';
    rows.forEach(function (r) {
      if (r.h) {
        out += '<li style="margin:12px 0 3px 0;padding-left:16px;font:650 .66rem/1.2 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:' + r.c + '">' + r.h + '</li>';
        return;
      }
      n++;
      out += '<li style="display:flex;align-items:center;gap:10px;margin-left:-13px;padding:3px 0;min-height:30px">' + dot(n, r.c) +
        '<span style="font:500 .93rem/1.3 var(--sans);color:var(--ink)">' + r.t + '</span>' + (r.tag ? tag(r.tag, r.c) : '') + '</li>';
    });
    return out + '</ol>';
  }
  var IGCSE = spine(['Title', 'Aim or question', 'Hypothesis', 'Variables', 'Apparatus', 'Risk assessment', 'Method', 'Results table', 'Graph', 'Data analysis', 'Conclusion', 'Evaluation']
    .map(function (t) { return { t: t, c: C.g }; }));
  var IA = spine([
    { h: 'At the start · required', c: C.no }, { t: 'Opening lines', c: C.no },
    { h: 'Research design · 6', c: C.rd }, { t: 'Research question in context', c: C.rd }, { t: 'Background', c: C.rd }, { t: 'Methodological choices', c: C.rd }, { t: 'Safety, ethics, environment', c: C.rd }, { t: 'Method', c: C.rd },
    { h: 'Data analysis · 6', c: C.da }, { t: 'Raw data', c: C.da }, { t: 'Processed data', c: C.da }, { t: 'Graph', c: C.da }, { t: 'Analysis', c: C.da },
    { h: 'Conclusion · 6', c: C.co }, { t: 'Conclusion', c: C.co },
    { h: 'Evaluation · 6', c: C.ev }, { t: 'Evaluation', c: C.ev },
    { h: 'At the end · required', c: C.no }, { t: 'Bibliography', c: C.no }
  ]);
  var EE = spine([
    { t: 'Title page', c: C.A, tag: 'A' }, { t: 'Contents', c: C.A, tag: 'A' }, { t: 'Introduction and literature', c: C.B, tag: 'B' },
    { t: 'Methodology', c: C.A, tag: 'A' }, { t: 'Results', c: C.Cc, tag: 'C' }, { t: 'Analysis', c: C.Cc, tag: 'C' },
    { t: 'Discussion', c: C.D, tag: 'D' }, { t: 'Evaluation', c: C.D, tag: 'D' }, { t: 'Conclusion', c: C.Cc, tag: 'C' },
    { t: 'References', c: C.no }, { t: 'Appendices', c: C.no, tag: 'not read' }
  ]) + '<div style="margin:12px 0 0;border:1.5px dashed ' + C.E + ';border-radius:4px;padding:8px 10px;display:flex;gap:10px;align-items:center;font:500 .88rem/1.35 var(--sans);color:var(--ink)">' +
    '<span>Uploaded separately: the Reflection and Progress Form</span>' + tag('E', C.E) + '</div>';

  WUL.station({
    id: 'report', stage: 'start', order: 1, title: 'What a lab report is', levels: 'gie',
    job: 'Learn the parts of a report and their order. Learn the scientific voice that you use in every part.',
    where: 'Everywhere: use this order and this voice in the whole report.',

    ladder: {
      g: ['Twelve parts, from the title to the evaluation', '[[Third person]], past tense, [[passive voice]]', 'Every quantity has a number and a unit'],
      i: ['The title, candidate code(s) and word count at the start', 'Four criteria, 6 marks each: every part serves one of them', 'No more than 3,000 words'],
      e: ['A title page, a contents page and numbered pages', 'A [[discussion]] section, and five criteria (30 marks)', 'A separate reflection form: the one place for “I”']
    },

    build: [
      { type: 'grid2', title: 'The parts, in order',
        items: [
          { label: 'IGCSE lab report · 12 parts', tone: 'g', v: { html: IGCSE },
            note: 'Cambridge does not mark lab reports directly. The practical paper tests these same skills in the exam.' },
          { label: 'IB Internal Assessment · 13 parts', tone: 'i', v: { html: IA },
            note: 'Four criteria, __6 marks each__ (24 in total). The opening lines and the bibliography are required, but neither has its own criterion.' },
          { label: 'IB Extended Essay · 11 parts', tone: 'e', v: { html: EE },
            note: 'A Framework 6 · B Knowledge and understanding 6 · C Analysis and line of argument 6 · D Discussion and evaluation 8 · E Reflection 4. Total: 30. E is marked __only__ on the separate form.' }
        ] },

      { type: 'callout', title: 'What a report must do', label: 'Remember', md: 'Write your [[lab report]] so that someone who was not there could repeat the experiment. They should never need to ask “how much?”.' },

      { type: 'anatomy', title: 'Write in the scientific voice',
        intro: 'You build every sentence in a method the same way. Tap a colour to see each part.',
        model: '{1:5.0} {2:cm³} of 1 % starch solution {3:was} {4:transferred} into each test tube.\n\nThe tubes {3:were} {4:placed} in a water bath at {1:40} {2:°C} for {1:5} {2:min}.',
        parts: [
          { n: 1, name: 'A number', note: 'Every quantity is measured, so it has a number. Never “some” or “a bit”.' },
          { n: 2, name: 'A unit', note: 'Straight after the number: cm³, °C, min, s.' },
          { n: 3, name: 'Past tense: was, were', note: 'The experiment is finished, so the report is in the past.' },
          { n: 4, name: 'The passive verb', note: 'Was or were + transferred, placed, heated. The thing is the subject of the sentence, not the person.' }
        ],
        after: 'No person appears in either sentence. That is the [[scientific voice]].' },

      { type: 'compare', title: 'The same step, written twice',
        bad: 'I put some starch in a tube and we heated it up in the water bath for a bit. Then I added the amylase.',
        good: '5.0 cm³ of 1 % starch solution was placed in a test tube. The tube was left in a water bath at 40 °C for 5 min. Then 1.0 cm³ of 1 % amylase solution was added.',
        badLabel: 'Everyday English', goodLabel: 'Scientific voice',
        why: 'The ✔ version names no person, uses the past tense, and gives every quantity a number and a unit.' },

      { type: 'table', title: 'Replace vague words',
        spec: {
          head: [['✘ Vague', '✔ Precise']],
          rows: [
            ['some acid', '5.0 cm³ of 1.0 mol dm⁻³ HCl'],
            ['it went up', 'the rate increased'],
            ['heated it up', 'heated to 40 °C'],
            ['a bit longer', '20 s longer'],
            ['the amount of enzyme', 'the concentration of amylase, 1.0 %'],
            ['a sensible result', 'a mean time of 53 s at 50 °C']
          ]
        },
        after: '“Went up” and “heated up” are phrasal verbs. Replace them with one exact verb: increased, heated, decreased.' },

      { type: 'rules', title: 'Rules for the scientific voice', items: [
        '[[Third person]]: never I, we, my, our or you.',
        '__Past tense__: the experiment has already been done.',
        '[[Passive voice]]: “the solution was heated”, never “I heated the solution”.',
        'Every quantity has a __number and a unit__: 5.0 cm³, 40 °C, 120 s.',
        'Name the property: volume, mass, concentration. Never “amount” or “some”.',
        'A report is not a set of instructions. Not “Heat the tube”, but “The tube was heated”.'
      ] },

      { type: 'note', tone: 'tip', label: 'One exception', title: '“Carried out”: the one exception', md: '“Carried out” is a phrasal verb, but it is standard in methods: “Five trials were carried out at each temperature.” Use it sparingly. Replace every other phrasal verb.' },

      { type: 'note', tone: 'house', title: 'Why reports use the passive', md: 'No exam criterion names the passive voice. It is the usual style of scientific reports. It keeps the reader’s attention on the method, not on you. Write every report this way.' },

      { type: 'note', tone: 'ee', lv: 'e', label: 'The one place for “I”', title: 'Where you may write “I”', md: 'The reflective statement on the [[Reflection and Progress Form]] is about you and your work. So you write “I” there. The essay itself stays in the third person.' },

      { type: 'frames', title: 'Sentences in the scientific voice', items: [
        '___ cm³ of ___ was measured into ___ using ___.',
        'The ___ was left in a water bath at ___ °C for ___ min.',
        'The ___ increased from ___ to ___ as the ___ increased.',
        'Five trials were carried out at each ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this. Five phrases need the red pen.',
        body: '[!tf-a:I put some starch] into a test tube.\n\n[!tf-b:We heated it up] in the water bath.\n\nThen [!tf-c:a bit of amylase] was added and the stopwatch was started.\n\nAt 60 °C [!tf-d:it went up].\n\n[!tf-e:This was a sensible result.]',
        notes: {
          'tf-a': { label: 'who? how much?', why: 'No person, and a number with a unit: __5.0 cm³ of 1 % starch solution was placed__ in a test tube.' },
          'tf-b': { label: 'we? how hot?', why: 'Passive voice, with the value, and no phrasal verb: __the tube was left in a water bath at 60 °C for 5 min__.' },
          'tf-c': { label: 'how much?', why: '“A bit” is not a quantity: __1.0 cm³ of 1 % amylase solution__.' },
          'tf-d': { label: 'what went up?', why: 'Name the quantity and use the examined verb: __the mean time increased__.' },
          'tf-e': { label: 'meaningless', why: '“Sensible” tells the reader nothing. Give the values: __93 s at 60 °C, up from 53 s at 50 °C__.' }
        },
        fixed: '==5.0 cm³ of 1 % starch solution was placed== in a test tube.\n\n==The tube was left in a water bath at 60 °C for 5 min.==\n\nThen ==1.0 cm³ of 1 % amylase solution== was added and the stopwatch was started.\n\nAt 60 °C ==the mean time increased to 93 s==, from 53 s at 50 °C.',
        fixedNote: 'No person, no vague word: every quantity has a number and a unit, and every verb is exact.'
      }
    },

    traps: [
      { bad: 'I heated the solution.', good: 'The solution was heated to 40 °C.' },
      { bad: 'Some acid was added.', good: '5.0 cm³ of 1.0 mol dm⁻³ HCl was added.' },
      { bad: 'The rate went up.', good: 'The rate increased.' },
      { bad: 'Heat the tube for 5 minutes.', good: 'The tube was heated for 5 min. A report is not a set of instructions.' },
      { bad: 'This was a sensible result.', good: 'The mean time was 53 s at 50 °C.' },
      { bad: 'An IA that starts with a cover page and a contents page.', good: 'The title, candidate code(s) and word count at the top of page 1.', lv: 'i' }
    ],

    test: [
      { type: 'choose', q: 'Which sentence is written in the scientific voice?',
        opts: [
          { t: '5.0 cm³ of starch solution was added to the tube.', ok: true, why: 'No person, past tense, passive, and a number with a unit.' },
          { t: 'I added 5.0 cm³ of starch solution to the tube.', why: '“I” is first person. Make the starch the subject: “…was added”.' },
          { t: 'Add 5.0 cm³ of starch solution to the tube.', why: 'This is an instruction in the present tense. A report says what was done.' },
          { t: 'Some starch solution was added to the tube.', why: 'The voice is right, but “some” is not a quantity.' }
        ] },
      { type: 'build', q: 'Rewrite in the passive: “We placed the tubes in a water bath at 40 °C.”',
        chips: ['The tubes', 'were placed', 'in a water bath', 'at 40 °C.', 'We', 'placed', 'was placed', 'at a warm temperature.'],
        answer: ['The tubes', 'were placed', 'in a water bath', 'at 40 °C.'],
        why: 'The tubes become the subject. “Were placed” is the past passive: “were”, because there is more than one tube.' },
      { type: 'spot', q: 'Tap the three phrases that break the scientific voice.',
        text: '[!a:I measured] 5.0 cm³ of starch solution into a test tube. [?:The tube was left in a water bath at 30 °C for 5 min.] Then [!b:some amylase] was added. The time for the starch to disappear [!c:went down a bit] as the temperature [?:increased from 20 °C to 50 °C].',
        why: { a: 'First person. Write “5.0 cm³ of starch solution was measured…”.', b: 'No quantity: “1.0 cm³ of 1 % amylase solution”.', c: 'A phrasal verb and a vague phrase: “decreased from 180 s to 53 s”.' } },
      { type: 'order', q: 'Put these parts of an IGCSE report in order.',
        items: ['Title', 'Aim or question', 'Hypothesis', 'Method', 'Results table', 'Graph', 'Data analysis', 'Conclusion', 'Evaluation'],
        why: 'The report follows the investigation: the question and prediction, what was done, what was found, what it means, and how far it can be trusted.' },
      { type: 'multi', q: 'Tick every phrase you should replace.',
        opts: [
          { t: 'some acid', ok: true, why: 'Give the volume and concentration.' },
          { t: 'a bit longer', ok: true, why: 'Give the difference in seconds.' },
          { t: 'it went up', ok: true, why: 'Name the quantity, and write “increased”.' },
          { t: '42 s', why: 'A number and a unit: already precise.' },
          { t: 'the rate increased', why: 'An exact verb, and the quantity is named.' }
        ],
        why: 'A precise report has no vague words: every quantity has a number and a unit.' },
      { type: 'choose', q: 'Why is a report written in the past tense?',
        opts: [
          { t: 'The experiment has already been done.', ok: true, why: 'A report records what happened, so it is in the past.' },
          { t: 'It sounds more scientific.', why: 'The reason is meaning, not sound: the work is finished.' },
          { t: 'Instructions are always in the past tense.', why: 'Instructions are in the present: “Heat the tube.” A report is not instructions.' },
          { t: 'The examiner reads it later.', why: 'That is true of any writing. The tense shows the work is finished.' }
        ] },
      { type: 'choose', q: 'Which phrasal verb is standard in a method?',
        opts: [
          { t: 'Five trials were carried out at each temperature.', ok: true, why: '“Carried out” is the one standard exception. Use it sparingly.' },
          { t: 'The results were written down.', why: 'Write “recorded”.' },
          { t: 'The solution was heated up.', why: 'Write “heated to 40 °C”.' },
          { t: 'The rate went up.', why: 'Write “increased”.' }
        ] },
      { type: 'sort', lv: 'i', q: 'Which IA criterion does each part mostly serve?',
        bins: ['Research design', 'Data analysis', 'Conclusion', 'Evaluation'],
        items: [
          { t: 'Research question in context', bin: 0, why: 'The question, its system and its theory open Research design.' },
          { t: 'Control variables and how each was controlled', bin: 0, why: 'A methodological consideration: Research design.' },
          { t: 'Safety, ethical and environmental issues', bin: 0, why: 'Also listed under Research design.' },
          { t: 'Raw data with uncertainties', bin: 1, why: 'Recording data is part of Data analysis.' },
          { t: 'Means, SD and one worked example', bin: 1, why: 'Processing is part of Data analysis.' },
          { t: 'Comparison with a published value', bin: 2, why: 'The Conclusion is justified by comparison with the accepted scientific context.' },
          { t: 'Weaknesses ranked by their impact', bin: 3, why: 'Relative impact is the top band of Evaluation.' },
          { t: 'Realistic improvements', bin: 3, why: 'Improvements belong to Evaluation.' }
        ] },
      { type: 'choose', lv: 'i', q: 'How are the 24 marks of the IA shared between the four criteria?',
        opts: [
          { t: '6 marks each', ok: true, why: 'Research design, Data analysis, Conclusion and Evaluation are worth the same. The evaluation deserves real space.' },
          { t: 'Most for Research design', why: 'All four are equal: 6 marks each.' },
          { t: 'Most for Data analysis', why: 'All four are equal: 6 marks each.' },
          { t: '12 for the conclusion', why: 'No criterion is worth more than another.' }
        ] },
      { type: 'sort', lv: 'e', q: 'Which EE criterion does each part mostly serve?',
        bins: ['A Framework', 'B Knowledge', 'C Analysis', 'D Discussion', 'E Reflection'],
        items: [
          { t: 'Title page, contents and structure', bin: 0, why: 'The framework of the essay: criterion A.' },
          { t: 'Research question and methodology', bin: 0, why: 'Criterion A also covers the research methods.' },
          { t: 'Literature review, with terms used accurately', bin: 1, why: 'Knowledge and understanding: criterion B.' },
          { t: 'Statistical analysis that builds an argument', bin: 2, why: 'Analysis and line of argument: criterion C.' },
          { t: 'Agreements and differences with published work', bin: 3, why: 'Discussion: criterion D, worth 8 marks.' },
          { t: 'Strengths and limitations of the method and sources', bin: 3, why: 'Evaluation sits in criterion D.' },
          { t: 'The 500-word statement on the RPF', bin: 4, why: 'Criterion E is marked only on the reflective statement.' }
        ] },
      { type: 'choose', lv: 'e', q: 'The EE is marked out of 30. Which criterion is marked only on a separate form?',
        opts: [
          { t: 'E, Reflection (4 marks), on the Reflection and Progress Form', ok: true, why: 'Criteria A–D judge the essay as a whole. E judges only the reflective statement.' },
          { t: 'D, Discussion and evaluation (8 marks)', why: 'D is marked on the essay itself.' },
          { t: 'A, Framework (6 marks)', why: 'A is marked on the essay itself.' },
          { t: 'None: all five are marked on the essay', why: 'E is marked only on the reflective statement, uploaded separately.' }
        ] }
    ],

    words: [
      { term: 'lab report', forms: ['lab reports', 'laboratory report'], def: 'A formal written account of an experiment: the question, what was done, what was found, and what it means.', eg: 'The IGCSE amylase report has 12 parts, from the title to the evaluation.' },
      { term: 'passive voice', forms: ['passive', 'the passive'], def: 'A sentence form in which the thing acted on is the subject, and the person is not named.', eg: '“The tubes were placed in a water bath”, not “I placed the tubes…”.' },
      { term: 'third person', forms: [], def: 'Writing about things (it, they, the solution), never about yourself (I, we) or the reader (you).', eg: '“The mixture was stirred”, not “We stirred the mixture”.' },
      { term: 'scientific voice', forms: [], def: 'The style of a report: third person, past tense, passive, with a number and a unit for every quantity.', eg: '“5.0 cm³ of 1.0 mol dm⁻³ HCl was added”, not “some acid was added”.' }
    ],

    further: [
      { title: 'Why some scientists now write “we”', lv: 'ie',
        md: 'Some research journals now ask authors to use the __active__ voice (“we performed the experiment”). Readers understand it more easily. In your IA and EE, follow the school convention: third person and passive. At university, follow the rules of the journal or the department.',
        cite: 'Nature Portfolio. “How to Write Your Paper.” *Nature Portfolio*, Springer Nature, www.nature.com/nature-portfolio/for-authors/write. Accessed 23 Sept. 2026.' }
    ],

    sources: ['Mompel Riera, “Lab Report Guide” (2026), “How to write, whatever the section”', 'IB Biology guide (2025), Internal assessment, pp. 114–123', 'IB Extended essay guide (first assessment 2027), criteria and format', 'Cambridge 0610 syllabus 2026–2028, pp. 51–56']
  });
})(window.WUL);
