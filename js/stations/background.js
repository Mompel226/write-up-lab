/* station: background — the theory the research question needs, and nothing else. IB IA and EE. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase.i;
  var best = A.rates.indexOf(Math.max.apply(null, A.rates));
  var idx = A.temps.map(function (t, k) { return k; });
  function all(p) { return idx.map(function (k) { return p + '-' + k; }); }

  /* the path from raw data to the answer, drawn from the running example */
  var PATH = {
    caption: 'Table 1. Raw and processed data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch, with the rate calculated from each mean (n = 5).',
    head: [['Temperature / °C ± 0.5', 'Times of the five trials / s ± 10', 'Mean time / s', 'Rate / 10⁻³ s⁻¹']],
    rows: idx.map(function (k) {
      return [
        k === best ? { t: A.temps[k].toFixed(1), el: 'iv-' + k } : A.temps[k].toFixed(1),
        { t: A.trials[k].join(', '), el: 'raw-' + k },
        { t: String(A.means[k]), el: 'mean-' + k },
        { t: A.rates[k].toFixed(1), el: 'rate-' + k }
      ];
    })
  };

  WUL.station({
    id: 'background', keepV: { v: 'qbjkv6', now: '1oixrrj', on: '2026-10-07', why: 'wrong options rewritten in the third answers audit (8 Oct 2026)' }, stage: 'plan', order: 2, title: 'Background', levels: 'ie',
    job: {
      i: 'Give only the theory your research question needs, with sources, and say how your data will answer it.',
      e: 'Show what is already known, from good sources, and where your question fits.'
    },
    where: { i: 'Not a section of its own: part of your introduction, straight after the research question. It gives the question its context, marked under Research design.', e: 'Not a section of its own: in the introduction, as a literature review.' },

    ladder: {
      g: [],
      i: ['Only the [[background theory]] the question needs, each idea or value from a source with a [[citation]]', 'Why the question is worth asking', 'How the [[raw data]] will become the answer'],
      e: ['A [[literature review]] from relevant, reliable sources', 'Where published results agree, where they disagree, and what is not known', 'Terms and concepts used accurately (criterion B)']
    },

    build: [
      { type: 'anatomy', title: 'The parts of a background section',
        intro: 'Five jobs, in about five sentences. Tap a colour to see each one.',
        model: '{1:α-Amylase hydrolyses the α-1,4 glycosidic bonds in starch, producing maltose (Urry et al.).} {2:As temperature rises, enzyme and substrate molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form per second. Above the optimum, hydrogen and ionic bonds in the tertiary structure break, and the active site changes shape.} {3:Amylases from different organisms have different optimum temperatures (Gupta et al.). Raviyan et al. report an optimum of 55 °C for α-amylase from *Aspergillus oryzae* (5464).} {4:This enzyme is added to bread dough, so how its activity changes between 20 and 60 °C matters in baking.} {5:The mean time for iodine to stop turning blue-black was converted to a rate (1 ÷ mean time), and the temperature with the highest rate showed where the optimum lies.}',
        parts: [
          { n: 1, name: 'The theory the question needs', note: 'What the enzyme does, with a citation.' },
          { n: 2, name: 'The link between the variables', note: 'Why temperature should change the rate: collisions, then denaturation.' },
          { n: 3, name: 'Why this system', note: 'The published context for this exact enzyme.' },
          { n: 4, name: 'Why the question is worth asking', note: 'One sentence is enough.' },
          { n: 5, name: 'How the raw data become the answer', note: 'Our advice, not an IB rule: it shows how the data will answer the question.' }
        ] },

      { type: 'callout', title: 'The deletion test', label: 'The deletion test', md: 'If a paragraph still makes sense with the [[research question]] deleted, it is doing no work.' },

      { type: 'compare', title: 'Keep it or cut it?',
        badLabel: 'Cut it', goodLabel: 'Keep it',
        bad: 'Enzymes are biological catalysts made of protein.\nThe word “enzyme” comes from Greek.\nLipase digests fats; protease digests proteins.\nEnzymes are used in washing powders.',
        good: 'Why the rate rises with temperature: collisions.\nWhy it falls above the optimum: denaturation.\nWhy the source of the enzyme matters.\nHow the raw data become the answer.',
        why: 'Delete the question about amylase and temperature. Everything on the left still makes sense, so it is doing no work.' },

      { type: 'steps', title: 'From raw data to the answer',
        intro: 'Say this plan in the background, before any data exist. Press Next step.',
        stage: { table: PATH },
        steps: [
          { title: 'The raw data', text: 'Five times at each temperature. Each is a multiple of 10 s, because a drop was tested every 10 s.', show: all('raw') },
          { title: 'A mean for each temperature', text: 'The mean of the five trials, to the same precision as the data.', show: all('mean') },
          { title: 'A rate from each mean', text: 'Rate = 1 ÷ mean time: 1 ÷ 178 s = 5.6 × 10⁻³ s⁻¹. A shorter time means a faster reaction.', show: all('rate') },
          { title: 'The answer to the question', text: 'The highest rate, ' + A.rates[best].toFixed(1) + ' × 10⁻³ s⁻¹, was at ' + A.temps[best] + ' °C. So the optimum lies between ' + A.temps[best - 1] + ' and ' + A.temps[best + 1] + ' °C, probably close to ' + A.temps[best] + ' °C.', show: ['rate-' + best], focus: ['rate-' + best, 'iv-' + best] }
        ],
        always: ['iv-' + best] },

      { type: 'note', tone: 'ib', label: 'It earns nothing on its own', title: 'Background earns no marks alone',
        md: 'No IA criterion gives marks for theory alone. Background counts as the “context” of the research question, in Research design.\n\nTheory that the question does not need only wastes words. The limit is 3,000.' },

      { type: 'note', tone: 'ee', lv: 'e', label: 'For the Extended Essay', title: 'A literature review is required',
        md: 'In a science essay, the EE guide requires a literature review. Criterion B, Knowledge and understanding (6 marks), judges two things: the knowledge you take from relevant sources, and how accurately you use terms and concepts.\n\nStart with a textbook. Then read reviews and research papers.' },

      { type: 'rules', lv: 'e', title: 'What a literature review shows', items: [
        { t: 'What is already known, with a source for each claim.', lv: 'e' },
        { t: 'Where published results __disagree__, and why they might.', lv: 'e' },
        { t: 'What is __not yet known__: the gap your question fills.', lv: 'e' },
        { t: 'Which methods others used, and which one you chose.', lv: 'e' }
      ] },

      { type: 'frames', lv: 'i', title: 'Sentence frames for background', items: [
        '___ is known to ___ (___).',
        'This matters for this question because ___.',
        'The raw data (___) were processed into ___, and the ___ with the highest ___ answered the question.'
      ] },
      { type: 'frames', lv: 'e', title: 'Sentence frames for a review', items: [
        'Studies of ___ agree that ___ (___; ___).',
        'However, ___ reported ___, which suggests ___.',
        'No published study was found that ___, so this essay ___.'
      ] }
    ],

    redpen: {
      i: {
        title: 'An IA background. Five phrases do no work, or the wrong work.',
        body: '[!tf-a:Enzymes are biological catalysts. The word “enzyme” comes from Greek.] Amylase [!tf-b:breaks down] starch. Temperature affects enzymes because [!tf-c:heat makes them work faster]. [!tf-d:The optimum temperature of amylase is 37 °C.] [!tf-e:The results will show the answer.]',
        notes: {
          'tf-a': { label: 'does no work', why: 'Delete the question, and this still makes sense. It does no work here, so cut it.' },
          'tf-b': { label: 'hydrolyses', why: 'Name the process precisely: α-amylase __hydrolyses__ the glycosidic bonds in starch.' },
          'tf-c': { label: 'no biology', why: 'Give the mechanism: molecules gain kinetic energy, collide more often, and form more enzyme–substrate complexes per second.' },
          'tf-d': { label: 'which amylase? source?', why: '37 °C is quoted for __human__ salivary amylase. Give the value for the enzyme used, with a citation.' },
          'tf-e': { label: 'how, exactly?', why: 'Say how the raw data become the answer: time → mean time → rate → the temperature with the highest rate.' }
        },
        fixed: 'α-Amylase ==hydrolyses== the glycosidic bonds in starch, producing maltose (Urry et al.). As temperature rises, ==enzyme and substrate molecules gain kinetic energy and collide more often==, so more enzyme–substrate complexes form per second. ==Amylases from different organisms have different optimum temperatures (Gupta et al.). Raviyan et al. report an optimum of 55 °C for α-amylase from *Aspergillus oryzae* (5464).== ==The mean time for iodine to stop turning blue-black was converted to a rate (1 ÷ mean time), and the temperature with the highest rate showed where the optimum lies.==',
        fixedNote: 'Every sentence now serves the question. Every fact from outside has a source. The path from data to answer is stated.'
      },
      e: {
        title: 'The start of an EE literature review. Four phrases would weaken criterion B.',
        body: '[!tf-a:According to Wikipedia,] amylase is an enzyme. [!tf-b:Many studies show that temperature affects enzymes.] [!tf-c:Amylase from any source works best at 37 °C.] [!tf-d:My experiment will prove this.]',
        notes: {
          'tf-a': { label: 'cite the original', why: 'An open encyclopaedia is a place to start, not a source to cite. Follow its references to the textbook or paper, and cite that.' },
          'tf-b': { label: 'which studies?', why: 'Name them and cite them: who found what, in which organism. A vague claim shows no reading.' },
          'tf-c': { label: 'not true', why: 'Optimum temperatures differ between organisms (Gupta et al.). Say where published values differ, and why.' },
          'tf-d': { label: 'prove? “my”?', why: 'Write impersonally. Data can support a hypothesis or fail to support it. They never prove it.' }
        },
        fixed: 'α-Amylases hydrolyse the glycosidic bonds in starch (Urry et al.). ==Their optimum temperatures differ between organisms (Gupta et al.).== ==Daniel and Danson proposed that, as temperature rises, an enzyme first changes reversibly to an inactive form, before it denatures.== ==This essay tests how closely the activity of α-amylase from *Aspergillus oryzae* between 20 and 60 °C matches the optimum of 55 °C reported by Raviyan et al. (5464).==',
        fixedNote: 'Each claim now comes from a named source, and the review shows a debate. The last sentence says where the essay fits.'
      }
    },

    traps: [
      { bad: 'Two pages on enzyme structure.', good: 'Only the theory that links the independent variable to the dependent variable.' },
      { bad: '“The optimum is 55 °C.” (no source)', good: '“Raviyan et al. report an optimum of 55 °C (5464).” Every idea or value from a source is cited.' },
      { bad: 'A published value for a different organism, used as the expected value.', good: 'A value for the same enzyme source, so that the conclusion compares two values for one enzyme.' },
      { bad: 'A review built from one textbook.', good: 'Textbooks for the basics, then reviews and research papers.', lv: 'e' }
    ],

    test: [
      { type: 'choose', q: 'What is the deletion test for a background section?',
        opts: [
          { t: 'If a paragraph still makes sense with the research question deleted, it is doing no work.', ok: true, why: 'Relevant theory needs the question to make sense.' },
          { t: 'If a paragraph has no numbers, it is doing no work for the research question.', why: 'Theory often has no numbers. Relevance to the research question is the test.' },
          { t: 'If the report is over 3,000 words, the background is the first section to delete.', why: 'Some background is needed. Cut only what the research question does not need.' },
          { t: 'If a paragraph cites a source, it is not your own work, so it should be deleted.', why: 'Citations are needed: they make the background traceable. Cited ideas are allowed when the source is given.' }
        ] },
      { type: 'sort', q: 'The question is: how does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by fungal α-amylase? Keep it or cut it?',
        bins: ['Keep', 'Cut'],
        items: [
          { t: 'Amylases from different organisms have different optimum temperatures.', bin: 0, why: 'It explains why the source of the enzyme matters.' },
          { t: 'The word “enzyme” comes from Greek.', bin: 1, why: 'True, but the question does not need it.' },
          { t: 'Above the optimum, bonds in the tertiary structure break and the active site changes shape.', bin: 0, why: 'It explains the shape the data should show.' },
          { t: 'Lipase digests fats into fatty acids and glycerol.', bin: 1, why: 'A different enzyme, doing a different job.' },
          { t: 'The rate was calculated as 1 ÷ the mean time.', bin: 0, why: 'It says how the raw data become the answer.' },
          { t: 'Enzymes are used in biological washing powders.', bin: 1, why: 'Interesting, but no use to this question.' }
        ] },
      { type: 'choose', q: 'Which sentence says how the raw data will become the answer?',
        opts: [
          { t: 'The mean time at each temperature was converted to a rate (1 ÷ mean time), and the temperature with the highest rate showed where the optimum lies.', ok: true, why: 'It names each step, from the measurement to the answer.' },
          { t: 'The data were analysed carefully in a spreadsheet, and the results of this analysis were then used to answer the research question in full.', why: 'How were they analysed? It names no step between the measurement and the answer.' },
          { t: 'A graph was drawn of the results at each temperature, with a title and labelled axes, so that the pattern in the data could be seen.', why: 'A graph of what, and what will it show? It names no processing step and does not say how the answer is found.' },
          { t: 'The mean time at each temperature was calculated from the repeats, and these means proved that the hypothesis about the optimum was correct.', why: 'Data never prove a hypothesis, and it does not say how the means will give the optimum.' }
        ] },
      { type: 'spot', q: 'Tap the two sentences that would weaken this IA background.',
        text: '[?:α-Amylase hydrolyses the glycosidic bonds in starch (Urry et al.).] [!a:Enzymes were first studied a long time ago.] [?:Amylases from different organisms have different optimum temperatures (Gupta et al.).] [!b:The optimum of amylase is 37 °C.]',
        why: { a: 'It does no work for this question, and it has no source. Cut it.', b: 'Which amylase? 37 °C is quoted for the human enzyme. Give the value for this source, with a citation.' } },
      { type: 'build', q: 'Build a background sentence with a citation.',
        chips: ['Amylases from different organisms', 'have different optimum temperatures', '(Gupta et al.).', 'are all the same', '(Wikipedia).'],
        answer: ['Amylases from different organisms', 'have different optimum temperatures', '(Gupta et al.).'],
        why: 'A claim that matters to the question, with a traceable source. No page is given here because the claim comes from the whole paper, not from one page.' },
      { type: 'multi', q: 'Why does an IA need background at all?',
        opts: [
          { t: 'It is part of the research question’s context, in Research design', ok: true },
          { t: 'It explains why this system and this range were chosen', ok: true },
          { t: 'It gives published values to compare with in the conclusion', ok: true },
          { t: 'It earns marks on its own, whatever it says about the topic', why: 'No criterion gives marks for theory alone. Background earns credit when it supports the research question.' },
          { t: 'It makes the report longer, and longer reports score higher', why: 'Length earns no marks, and the report has a limit of 3,000 words.' }
        ],
        why: 'Background is there to serve the question, and the conclusion.' },
      { type: 'choose', q: 'A background quotes 37 °C for “amylase”. The experiment used fungal α-amylase and found its optimum near 50 °C. What went wrong?',
        opts: [
          { t: 'The published value was for a different enzyme source: human salivary amylase.', ok: true, why: 'A result near 50 °C fits the published 55 °C for this fungal enzyme. The comparison used a value for a different enzyme.' },
          { t: 'The experiment gave a wrong optimum: amylase works best at 37 °C, which is body temperature.', why: 'Amylases from different organisms have different optima. A result near 50 °C fits the published 55 °C for this fungal enzyme.' },
          { t: 'The thermometer in the water bath read 13 °C too high, so the true optimum was 37 °C.', why: 'Nothing suggests a faulty thermometer. The published value is for a different enzyme.' },
          { t: 'The two values agree: a difference of 13 °C is small enough to ignore in a school experiment.', why: 'A 13 °C difference is large, and it has a real cause: the two values are for different enzymes.' }
        ] },
      { type: 'choose', lv: 'e', q: 'What does the EE guide require in a science essay that an IA report does not?',
        opts: [
          { t: 'A literature review', ok: true, why: 'Knowledge from relevant sources is judged in criterion B.' },
          { t: 'A stated hypothesis', why: 'Neither guide requires a hypothesis. The EE needs a research question; a hypothesis is optional in both.' },
          { t: 'A risk-assessment table', why: 'Neither guide asks for a risk-assessment table. Safety, ethical and environmental issues are recognised in the method.' },
          { t: 'At least ten sources', why: 'No number of sources is set. The sources must be relevant and reliable.' }
        ] }
    ],

    words: [
      { term: 'background theory', forms: ['background theories', 'background'], def: 'The scientific ideas a research question depends on, each supported by a source.', eg: 'Collision theory and denaturation, for a question about amylase and temperature.' },
      { term: 'scientific context', forms: ['context', 'accepted scientific context'], def: 'The published science a question sits in: what is known, and why the question matters.', eg: 'Amylases from different organisms have different optimum temperatures.' },
      { term: 'literature review', forms: ['literature reviews'], lv: 'e', def: 'A survey of published research on a topic: what is known, where results disagree, and what is not known.', eg: 'Several papers report different optimum temperatures for fungal and bacterial α-amylases.' }
    ],

    further: [
      { title: 'Review articles: the best place to start', lv: 'ie',
        md: 'A review article summarises many research papers on one topic. Read one first. It shows what is known, where results disagree, and which papers to read next.\n\nUse its reference list to find the main papers.',
        cite: 'Gupta, Rani, et al. “Microbial α-Amylases: A Biotechnological Perspective.” *Process Biochemistry*, vol. 38, no. 11, 2003, pp. 1599–1616.' }
    ],

    sources: ['IB Biology guide (2025), Research design clarifications, p. 120', 'IB Extended essay guide (first assessment 2027), sciences guidance', 'Mompel Riera, “IB IA: The Unwritten Rules” (house guidance)']
  });
})(window.WUL);
