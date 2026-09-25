/* station: question — the title, and the aim or research question. */
(function (WUL) {
  'use strict';

  /* the "too broad → focused" ladder: each rung adds one thing */
  /* each rung sits on a dashed placeholder, so the rungs still to come show as empty steps */
  function rung(el, tone, tag, q, pad) {
    return '<li style="margin-left:' + pad + '%;border:1.5px dashed var(--rule);border-radius:var(--r)">' +
      '<div data-el="' + el + '" style="border:1px solid var(--edge);border-left:5px solid var(' + tone + ');border-radius:var(--r);background:var(--sheet);padding:10px 14px 11px;margin:-1.5px">' +
      '<div style="font:650 .68rem/1.2 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(' + tone + ');margin-bottom:5px">' + tag + '</div>' +
      '<div style="font:400 1.02rem/1.55 var(--serif)">' + q + '</div></div></li>';
  }
  var LADDER = '<ol style="list-style:none;margin:0;padding:0;display:grid;gap:10px">' +
    rung('r1', '--red', '✘ Too broad', 'What is the best temperature for enzymes?', 0) +
    rung('r2', '--red', '✘ Still too broad', 'How does <mark class="hl">temperature</mark> affect <mark class="hl">amylase</mark>?', 3) +
    rung('r3', '--green', '✔ Focused: IGCSE', 'How does temperature, <mark class="hl">from 20 °C to 60 °C</mark>, affect <mark class="hl">the time taken for amylase to digest starch</mark>?', 6) +
    rung('r4', '--blue', '✔ Focused, with its system: IB IA', 'How does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by <mark class="hl">fungal α-amylase from <i>Aspergillus oryzae</i></mark>?', 9) +
    rung('r5', '--ee', '✔ A question for 4,000 words: IB EE', '<mark class="hl">To what extent</mark> does temperature (20–60 °C) affect the rate of starch hydrolysis by α-amylase from <i>Aspergillus oryzae</i>?', 12) +
    '</ol>';

  WUL.station({
    id: 'question', stage: 'plan', order: 1, title: 'Title and research question', levels: 'gie',
    job: {
      g: 'Say exactly what was tested: a title and an aim that name what was changed and what was measured.',
      i: 'Ask one focused question, in a specific context, that your data can answer.',
      e: 'Ask one focused question that 4,000 words can answer, and whose answer is not obvious.'
    },
    where: { g: 'At the very top: the title, then the aim or question.', i: 'At the start of the report, straight after the title.', e: 'On the title page, and again in the introduction.' },

    ladder: {
      g: ['A title that names the [[independent variable]], the [[dependent variable]] and the [[system]]', 'An [[aim]] or question with the range and the unit', 'It must be testable: your data can answer it'],
      i: ['Name the system exactly: which species, which source of enzyme', 'Place it in context: the [[background theory]] it depends on', 'It must be unique: no one else may use the same question'],
      e: ['It must be written as a question, not a statement', 'Focused enough for 4,000 words, not double-barrelled, not obvious']
    },

    build: [
      { type: 'compare', title: 'What a title must name',
        bad: 'Enzyme experiment', good: 'The effect of temperature on the time taken for amylase to digest starch',
        badLabel: 'Names nothing', goodLabel: 'Names all three',
        why: 'The reader of your report should know what was investigated from the title alone.' },

      { type: 'anatomy', lv: 'g', title: 'Parts of an aim or question',
        intro: 'Tap a colour to see where each part is.',
        model: '{6:How does} {1:temperature}, {2:from 20 °C to 60 °C}, {6:affect} {3:the time, in seconds, for iodine to stop turning blue-black}, {4:when starch is digested by amylase}?',
        parts: [
          { n: 1, name: 'Independent variable', note: 'Named as a quantity: temperature, not “heat”.' },
          { n: 2, name: 'Its range', note: 'The lowest and highest values tested.' },
          { n: 3, name: 'Dependent variable', note: 'What is measured, with its unit.' },
          { n: 4, name: 'The system', note: 'The enzyme and its substrate, or the organism.' },
          { n: 6, name: 'Question word', note: 'A question or an aim. At IGCSE, “To determine how…” is fine too.' }
        ] },

      { type: 'anatomy', lv: 'i', title: 'Parts of an IA research question',
        intro: 'The IB asks for the variables, a short description of the system, and the theory it depends on.',
        model: '{6:How does} {1:temperature} {2:(20.0–60.0 °C)} {6:affect} {3:the rate of starch hydrolysis} {4:by fungal α-amylase from *Aspergillus oryzae*}?\n\n{5:α-Amylase hydrolyses the glycosidic bonds in starch. Amylases from different organisms have different optimum temperatures (Gupta et al.), so the source of the enzyme is named.}',
        parts: [
          { n: 1, name: 'Independent variable', note: 'The quantity changed on purpose.' },
          { n: 2, name: 'Its range', note: 'The values tested, to the precision used.' },
          { n: 3, name: 'Dependent variable', note: 'The method says how it was measured: the time for iodine to stop turning blue-black, converted to a rate.' },
          { n: 4, name: 'The system', note: 'Which enzyme, from which organism. “Amylase” alone is not enough.' },
          { n: 5, name: 'Context', note: 'Background theory of direct relevance, with a source.' },
          { n: 6, name: 'Question word', note: 'Written as a question.' }
        ] },

      { type: 'anatomy', lv: 'e', title: 'Parts of an EE research question',
        intro: 'The same parts as an IA question. But it must be a question, and it must be worth 4,000 words.',
        model: '{6:To what extent does} {1:temperature} {2:(20–60 °C)} {6:affect} {3:the rate of starch hydrolysis} {4:by α-amylase from *Aspergillus oryzae*}?\n\n{5:Amylases from different organisms have different optimum temperatures (Gupta et al.). This enzyme is added to bread dough, so how it behaves between 20 and 60 °C matters in baking.}',
        parts: [
          { n: 6, name: 'A real question', note: '“To what extent…?” asks how much. So your answer is a careful judgement, not yes or no.' },
          { n: 1, name: 'Independent variable', note: 'One variable, so the question is not double-barrelled.' },
          { n: 2, name: 'Its range', note: 'Wide enough to show the whole pattern.' },
          { n: 3, name: 'Dependent variable', note: 'Measurable, so the question can be answered.' },
          { n: 4, name: 'The system', note: 'Named exactly.' },
          { n: 5, name: 'Context', note: 'Where the question sits in the published research, from the [[literature review]].' }
        ] },

      { type: 'steps', title: 'From too broad to focused',
        intro: 'Each question adds one thing. Press Next step.',
        stage: { html: LADDER },
        steps: [
          { title: 'Too broad', text: 'It names no enzyme, and “best” is not a measurement. Nothing here can be measured, so no data can answer it.', show: ['r1'] },
          { title: 'Name the variable and the enzyme', text: 'Now it names __temperature__ and __amylase__. But it has no range, and nothing is measured.', show: ['r2'] },
          { title: 'Add the range and the measurement', text: 'Now the data can answer it: a range of temperatures, and a time in seconds. This is focused enough for an IGCSE report.', show: ['r3'] },
          { title: 'Name the system exactly', text: 'At IB, “which amylase?” matters. Amylases from different organisms have different optimum temperatures.', show: ['r4'] },
          { title: 'Make it worth 4,000 words', text: '“To what extent…?” asks how much. The EE guide says the research question must be a question.', show: ['r5'] }
        ] },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'Which amylase?', title: 'Name the enzyme’s source',
        md: 'Human salivary amylase works fastest near 37 °C. Fungal α-amylase from *Aspergillus oryzae* works fastest near 55 °C (Raviyan et al. 5464).\n\nIf you compare a result near 50 °C with 37 °C, it looks like an error. The result was right; the comparison was wrong.\n\nSaliva cannot be used at IB anyway: no body fluids of any kind, not even your own.' },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'What the IB guide asks', title: 'The IB rule for context',
        md: 'The 5–6 band asks for a research question “described within a specific and appropriate context” (IB Biology guide, p. 120). The guide lists three parts: the variables, “a concise description of the system”, and “background theory of direct relevance”.\n\nThe measuring instrument is not one of them. It belongs in the method.' },

      { type: 'rules', lv: 'e', title: 'Three tests for an EE question', items: [
        { t: 'It is a __question__, not a statement or a hypothesis. “To what extent…?” and “How…?” are common.', lv: 'e' },
        { t: 'It is __focused__: one question, not two joined by “and”. 4,000 words cannot answer two well.', lv: 'e' },
        { t: 'Its answer is __not obvious__. “Do enzymes denature when heated?” has a textbook answer: yes.', lv: 'e' }
      ] },

      { type: 'widget', title: 'Build a research question', name: 'rq-builder' },

      { type: 'frames', lv: 'g', title: 'Sentence frames for an aim', items: [
        'The effect of ___ on ___ in ___',
        'How does ___, from ___ to ___, affect ___, measured in ___?',
        'The aim was to determine how ___ affects ___.'
      ] },
      { type: 'frames', lv: 'i', title: 'Sentence frames for an IA question', items: [
        'How does ___ (___ to ___) affect ___ in ___?',
        'The system studied was ___, because ___.',
        '___ is known to ___ (___), so ___.'
      ] },
      { type: 'frames', lv: 'e', title: 'Sentence frames for an EE question', items: [
        'To what extent does ___ (___ to ___) affect ___ in ___?',
        'Published studies of ___ report ___, but ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this title and aim. Five phrases need the red pen.',
        body: 'Title: [!tf-a:Enzyme practical]\n\nAim: To see [!tf-b:what the best temperature is] for [!tf-c:enzymes], by [!tf-d:heating them up] and [!tf-e:seeing how fast they work].',
        notes: {
          'tf-a': { label: 'names nothing', why: 'A title names both variables and the system: __The effect of temperature on the time taken for amylase to digest starch__.' },
          'tf-b': { label: 'range?', why: '“Best” cannot be measured. Give the values that will be tested: __from 20 °C to 60 °C__.' },
          'tf-c': { label: 'which enzyme?', why: 'Name it, and its substrate: __amylase__, digesting __starch__.' },
          'tf-d': { label: 'temperature!', why: 'Name the quantity that is changed: __temperature__. “Heating them up” is not a variable.' },
          'tf-e': { label: 'measured how?', why: 'Say what is measured, and its unit: __the time, in seconds, for iodine to stop turning blue-black__.' }
        },
        fixed: 'Title: ==The effect of temperature on the time taken for amylase to digest starch==\n\nAim: To ==determine== how ==temperature, from 20 °C to 60 °C,== affects ==the time, in seconds, for amylase to digest starch==.',
        fixedNote: 'The title and the aim now name the independent variable and its range. They also name the dependent variable with its unit, and the system.'
      },
      i: {
        title: 'An IA opening. Five phrases would keep it out of the top band.',
        body: 'Research question: [!tf-a:How does temperature affect amylase activity]? Amylase is an enzyme that [!tf-b:breaks down] starch. [!tf-c:Enzymes are proteins made of amino acids joined by peptide bonds.] The optimum temperature of amylase is [!tf-d:37 °C], so [!tf-e:the results will be compared with human salivary amylase].',
        notes: {
          'tf-a': { label: 'which amylase? range?', why: 'Name the range and the system: How does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by __fungal α-amylase from *Aspergillus oryzae*__?' },
          'tf-b': { label: 'hydrolyses', why: 'Name the process precisely: α-amylase __hydrolyses__ the glycosidic bonds in starch.' },
          'tf-c': { label: 'does no work', why: 'True, but not of direct relevance to this question. If a sentence still makes sense with the question deleted, cut it.' },
          'tf-d': { label: 'which source?', why: '37 °C is quoted for __human__ salivary amylase. Give a value for the enzyme that was used, with a citation.' },
          'tf-e': { label: 'wrong comparison', why: 'A fungal enzyme compared with a human one makes a good result look wrong. Compare with a value for the same source.' }
        },
        fixed: 'Research question: How does temperature ==(20.0–60.0 °C)== affect the rate of starch hydrolysis by ==fungal α-amylase from *Aspergillus oryzae*==? α-Amylase ==hydrolyses== the glycosidic bonds in starch. ==Amylases from different organisms have different optimum temperatures (Gupta et al.); Raviyan et al. report 55 °C for this enzyme (5464)==, so the range spans the expected optimum.',
        fixedNote: 'The question names its range and its system, and every sentence of context is one the question needs.'
      },
      e: {
        title: 'An EE student’s first ideas. Four phrases would weaken criterion A.',
        body: 'Working question: [!tf-a:Do enzymes stop working at high temperatures?]\n\nFinal version: [!tf-b:An investigation into] the effect of temperature on [!tf-c:amylase] [!tf-d:and of pH on catalase].',
        notes: {
          'tf-a': { label: 'obvious answer', why: 'Any textbook answers this: yes. Ask how much, or under what conditions, so the answer has to be argued.' },
          'tf-b': { label: 'not a question', why: 'The EE guide says the research question must be a question, not a statement or a hypothesis. Start with “To what extent…” or “How…”.' },
          'tf-c': { label: 'which amylase?', why: 'Name the system: α-amylase from *Aspergillus oryzae*.' },
          'tf-d': { label: 'double-barrelled', why: 'Two questions in one. 4,000 words cannot answer both well. Keep one.' }
        },
        fixed: 'Research question: ==To what extent== does temperature ==(20–60 °C)== affect the rate of starch hydrolysis by ==α-amylase from *Aspergillus oryzae*==?',
        fixedNote: 'One question, written as a question, about one named system. It asks how much, not yes or no.'
      }
    },

    traps: [
      { bad: 'Title: Enzyme experiment.', good: 'The effect of temperature on the time taken for amylase to digest starch.' },
      { bad: 'What is the best temperature for enzymes?', good: 'How does temperature, from 20 °C to 60 °C, affect the time taken for amylase to digest starch?' },
      { bad: '…affect how fast amylase works?', good: '…affect the __time, in seconds__, for amylase to digest starch?' },
      { bad: 'Independent variable: heat.', good: 'Name the quantity: __temperature__.' },
      { bad: '…by amylase?', good: '…by __fungal α-amylase from *Aspergillus oryzae*__?', lv: 'ie' },
      { bad: 'The effect of temperature on amylase. (a statement)', good: 'To what extent does temperature (20–60 °C) affect…?', lv: 'e' }
    ],

    test: [
      { type: 'choose', q: 'Which title names both variables and the system?',
        opts: [
          { t: 'The effect of light intensity on the rate of photosynthesis in *Elodea*', ok: true, why: 'Independent variable, dependent variable and organism: all three are named.' },
          { t: 'Photosynthesis practical', why: 'It names no variable at all.' },
          { t: 'Light and plants', why: 'Which property of light? Which plant? What was measured?' },
          { t: 'Does light matter?', why: 'Nothing is named, and “matter” cannot be measured.' }
        ] },
      { type: 'choose', q: 'An aim names the independent variable with its range, and the dependent variable with its unit. Which aim does this?',
        opts: [
          { t: 'To determine how the concentration of sucrose solution, from 0.0 to 1.0 mol dm⁻³, affects the percentage change in mass of potato cylinders.', ok: true, why: 'The independent variable, its range, and a measured dependent variable are all there.' },
          { t: 'To determine how sugar affects potato.', why: 'Which property of sugar, and what is measured?' },
          { t: 'To determine the effect of sucrose concentration.', why: 'The effect on what? No dependent variable.' },
          { t: 'To determine how the mass of potato changes.', why: 'What is changed on purpose? No independent variable.' }
        ] },
      { type: 'sort', q: 'Could data answer each question? Sort them.',
        bins: ['Testable', 'Not testable'],
        items: [
          { t: 'How does temperature (20–60 °C) affect the time taken for amylase to digest starch?', bin: 0, why: 'A variable is changed and a time is measured.' },
          { t: 'Why do enzymes like warm temperatures?', bin: 1, why: 'Enzymes do not “like” anything, and nothing is measured.' },
          { t: 'Is catalase a good enzyme?', bin: 1, why: '“Good” cannot be measured.' },
          { t: 'How does the concentration of hydrogen peroxide (0.5–3.0 %) affect the volume of oxygen released by potato catalase in 60 s?', bin: 0, why: 'A variable is changed and a volume is measured.' },
          { t: 'What is the effect of light on plants?', bin: 1, why: 'Which property of light, which plant, and what is measured?' }
        ] },
      { type: 'spot', q: 'Tap the two phrases that would lose marks in this aim.',
        text: '[?:To determine how] [!a:sugar] affects [!b:the potato] [?:after 60 minutes].',
        why: { a: 'Name the quantity and its range: the concentration of sucrose solution, 0.0–1.0 mol dm⁻³.', b: 'Name what is measured: the percentage change in mass of potato cylinders.' } },
      { type: 'order', q: 'Put these questions in order, from the broadest to the most focused.',
        items: ['What affects enzymes?', 'How does temperature affect enzymes?', 'How does temperature affect amylase?', 'How does temperature (20–60 °C) affect the time taken for amylase to digest starch?'],
        why: 'Each step adds one thing: the variable, then the enzyme, then the range and a measured dependent variable.' },
      { type: 'build', q: 'Build a title that names both variables and the system.',
        chips: ['The effect of', 'light intensity', 'on the rate of photosynthesis', 'in *Elodea*', 'An experiment about', 'light', 'on plants'],
        answer: ['The effect of', 'light intensity', 'on the rate of photosynthesis', 'in *Elodea*'],
        why: 'Independent variable, dependent variable, then the organism.' },
      { type: 'choose', q: 'Why can data not answer “What is the best temperature for enzymes?”',
        opts: [
          { t: 'It names no enzyme, no range and nothing to measure.', ok: true, why: '“Best” is not a measurement, and “enzymes” is not one system.' },
          { t: 'It is too short.', why: 'Length is not the problem. A short question can be focused.' },
          { t: 'It is written as a question.', why: 'Questions are fine. This one names nothing that can be measured.' },
          { t: 'Temperature cannot be controlled.', why: 'It can: with a thermostatically controlled water bath.' }
        ] },
      { type: 'build', q: 'Build an aim for the pondweed experiment.',
        chips: ['To determine how', 'light intensity', '(lamp 10 to 50 cm away)', 'affects the volume of gas released in 5 minutes', 'by *Elodea*.', 'light', 'how much it photosynthesises'],
        answer: ['To determine how', 'light intensity', '(lamp 10 to 50 cm away)', 'affects the volume of gas released in 5 minutes', 'by *Elodea*.'],
        why: 'The independent variable and its range, a measured dependent variable, and the organism.' },
      { type: 'choose', lv: 'ie', q: 'Why does the IB want the system named, and not just “amylase”?',
        opts: [
          { t: 'Amylases from different organisms have different optimum temperatures, so the comparison with published values depends on it.', ok: true, why: 'A fungal result compared with a human value would look wrong when it is right.' },
          { t: 'Longer questions score more marks.', why: 'Length earns nothing. The system is there so the context is specific.' },
          { t: 'The examiner needs to know which shop sold the enzyme.', why: 'What matters is the organism the enzyme came from, not the shop.' },
          { t: 'Because amylase is a protein.', why: 'True, but that is not why the source is named.' }
        ] },
      { type: 'multi', lv: 'i', q: 'According to the IB guide, which belong in a research question “with context”?',
        opts: [
          { t: 'The independent and dependent variables', ok: true },
          { t: 'A concise description of the system', ok: true },
          { t: 'Background theory of direct relevance', ok: true },
          { t: 'The make of the stopwatch', why: 'Instruments belong in the method.' },
          { t: 'Why the topic is personally interesting', why: 'Personal interest is not in the 2025 criteria.' }
        ],
        why: 'All three are in the Research design clarifications (IB Biology guide, p. 120).' },
      { type: 'choose', lv: 'e', q: 'Which is a suitable Extended Essay research question?',
        opts: [
          { t: 'To what extent does the concentration of calcium ions (0–10 mmol dm⁻³) affect the heat stability of α-amylase from *Aspergillus oryzae*?', ok: true, why: 'One question, a named system, a range, and an answer that is not obvious.' },
          { t: 'The effect of temperature on enzymes.', why: 'A statement, not a question, and no system is named.' },
          { t: 'Does boiling denature amylase?', why: 'The answer is obvious: yes.' },
          { t: 'How do temperature and pH affect amylase and catalase?', why: 'Double-barrelled: several questions at once, too many for 4,000 words.' }
        ] }
    ],

    words: [
      { term: 'research question', forms: ['research questions', 'RQ'], def: 'The one focused question that an investigation aims to answer.', eg: 'How does temperature (20–60 °C) affect the time for amylase to digest starch?' },
      { term: 'aim', forms: ['aims'], def: 'One sentence saying what the investigation will determine.', eg: 'To determine how temperature affects the time for amylase to digest starch.' },
      { term: 'system', forms: ['systems', 'the system'], def: 'The organism, tissue or enzyme being studied, named exactly.', eg: 'Fungal α-amylase from *Aspergillus oryzae*, not just “amylase”.' }
    ],

    further: [
      { title: 'How researchers judge a question: FINER', lv: 'ie',
        md: 'Medical researchers check a question against five tests. Is it __Feasible__ with the time and equipment available? __Interesting__? __Novel__? __Ethical__? __Relevant__?\n\nAn IA question does not have to be new to science, but it must be your own. The other four tests fit an IA or an EE well.',
        cite: 'Hulley, Stephen B., et al. *Designing Clinical Research*. 4th ed., Lippincott Williams & Wilkins, 2013.' }
    ],

    sources: ['IB Biology guide (2025), Research design criterion and clarifications, p. 120', 'IB Extended essay guide (first assessment 2027)', 'Cambridge 0610 syllabus 2026–2028, p. 51']
  });
})(window.WUL);
