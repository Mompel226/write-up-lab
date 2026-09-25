/* station: discussion — the EE's discussion (criterion D, Discussion and evaluation, 8 marks).
   Published comparison (verified 23 Sep 2026 from the full text): Raviyan, Tang and Rasco (2003),
   J. Agric. Food Chem. 51 (18): 5462–5466, doi 10.1021/jf020906j. Commercial A. oryzae α-amylase,
   0.05 M phosphate buffer pH 7.1, maltodextrin substrate, duplicate assays at 5 °C steps.
   p. 5464: optimum 55 °C for the free enzyme. Values READ FROM THEIR FIGURES (approximate):
   Fig. 1 relative activity 35→48, 40→60, 45→72, 50→87, 55→100, 60→74, 65→35, 70→6 %;
   Figs 2–3 (p. 5464): the free enzyme loses activity within minutes at 60 °C (no single % quoted: the figure and Table 1 give different estimates).
   This study (WUL.data.amylase, IB): rate as % of the highest rate = 30, 46, 73, 100, 55 % at 20–60 °C. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase;
  var top = Math.max.apply(null, A.i.rates);
  var here = A.i.temps.map(function (t, i) { return [t, Math.round(A.i.rates[i] / top * 100)]; });
  var pub = [[35, 48], [40, 60], [45, 72], [50, 87], [55, 100], [60, 74], [65, 35], [70, 6]];
  var CITE = 'Raviyan, Patcharin, et al. “Thermal Stability of α-Amylase from *Aspergillus oryzae* Entrapped in Polyacrylamide Gel.” *Journal of Agricultural and Food Chemistry*, vol. 51, no. 18, 2003, pp. 5462–66, https://doi.org/10.1021/jf020906j.';

  var plotCompare = {
    w: 560, h: 360, key: true, keyAt: 'tl',
    x: { min: 20, max: 70, step: 10, minor: 2, label: 'Temperature / °C' },
    y: { min: 0, max: 100, step: 20, minor: 2, label: 'Rate / % of the highest rate' },
    series: [
      { id: 'here', pts: here, line: 'smooth', mark: 'x', tone: 'lvl', label: 'This study' },
      { id: 'pub', pts: pub, line: 'smooth', mark: 'x', tone: 'grey', dash: true, label: 'Raviyan et al.' }
    ],
    caption: 'Figure 3. Line graph showing the effect of temperature on the rate of starch hydrolysis by *A. oryzae* α-amylase, as a percentage of each study’s highest rate (this study: n = 5; Raviyan et al.: values read from their Figure 1, so approximate).'
  };

  WUL.station({
    id: 'discussion', stage: 'sense', order: 2, title: 'Discussion', levels: 'e',
    job: 'Say what the findings mean, compare them with published research, and explain the agreements and the discrepancies.',
    where: 'In the Extended Essay, after the analysis and before the conclusion. An IGCSE report and an IA have no section with this name.',

    ladder: {
      g: ['No discussion section. The conclusion explains the biology and may compare with a [[published value]].'],
      i: ['Still no discussion section. The Conclusion criterion now __requires__ the comparison with published science, so the IA conclusion does part of a discussion’s job.'],
      e: ['A full [[discussion]]: what the findings mean, compared with published research', 'Agreements __and__ [[discrepancies|discrepancy]], each with a possible reason', 'How strong the evidence is (criterion D, 8 marks)']
    },

    build: [
      { type: 'table', title: 'Where each job goes',
        spec: {
          caption: 'The same jobs, different sections',
          head: [['Job', 'IGCSE report', 'IB IA', 'IB EE']],
          rows: [
            ['Describe the pattern', '{1:Analysis}', '{1:Analysis}', '{1:Analysis}'],
            ['Explain what it means', '{2:Conclusion}', '{2:Conclusion}', '{3:Discussion}'],
            ['Compare with published research', '{2:Conclusion} (good practice)', '{2:Conclusion} (required)', '{3:Discussion}, in detail'],
            ['Explain agreements and discrepancies', 'Not expected', '{2:Conclusion}, briefly', '{3:Discussion}'],
            ['Weaknesses and their impact', '{4:Evaluation}', '{4:Evaluation}', '{4:Evaluation}, marked with the discussion'],
            ['Answer the question', '{2:Conclusion}, with the hypothesis', '{2:Conclusion}: the research question first', '{2:Conclusion}, briefly'],
            ['A section called “Discussion”?', 'No', 'No', '{3:Yes}']
          ]
        },
        after: 'Read across a row: the same job moves from the {2:Conclusion} at IGCSE and in the IA to the {3:Discussion} in the EE. Adapted from Daniel Mompel Riera’s “Progression of scientific writing expectations”.' },

      { type: 'callout', title: 'IA conclusion and discussion', label: 'One sentence to remember', md: 'An IA conclusion is closer to a research paper’s __discussion__ than to its conclusion: it has to justify the answer against published science.' },

      { type: 'rules', title: 'The four jobs of a discussion', items: [
        { t: '__What the findings mean:__ explain them with biology.', icon: '1' },
        { t: '__How they compare__ with published research: name the source and the numbers.', icon: '2' },
        { t: '__Agreements and [[discrepancies|discrepancy]]__, each with a possible reason.', icon: '3' },
        { t: '__How strong the evidence is:__ the spread, the statistics, the sources.', icon: '4' }
      ] },

      { type: 'plot', title: 'Compare your data on one graph', spec: plotCompare,
        after: 'Both studies peak between 50 and 55 °C: an agreement. At 60 °C, the rate here fell further: a discrepancy, which needs a reason. Values read from a published graph are approximate, so the caption says so.' },

      { type: 'anatomy', title: 'A model discussion paragraph',
        intro: 'One finding, discussed. Tap a colour to see each part.',
        model: '{1:The peak near 50 °C shows that, up to this temperature, the gain in successful collisions outweighed the loss of active enzyme through denaturation.} {2:Raviyan et al. report an optimum of 55 °C for α-amylase from *A. oryzae* (5464). The data here place the optimum between 40.0 and 60.0 °C, so the two agree within the 10.0 °C interval used.}\n\n{3:However, at 60.0 °C the rate here fell to 55 % of its maximum, whereas their enzyme kept about three-quarters of its peak activity at 60 °C (their Figure 1).} {4:A likely reason is the time spent at the test temperature. In this method, the amylase was held at the test temperature for 5 minutes before the starch was added, and Raviyan et al. found that this enzyme loses activity within a few minutes at 60 °C (5464). The pH also differed: 6.0 here, 7.1 in their study.}\n\n{5:The position of the optimum is therefore well supported, because the SD bars around it do not overlap; the size of the fall at 60.0 °C is less certain, because it depends on how long the enzyme was heated.}',
        parts: [
          { n: 1, name: 'What the finding means', note: 'The biology behind it, in exact terms.' },
          { n: 2, name: 'An agreement with published work', note: 'Name the source, the value and how close it is.' },
          { n: 3, name: 'A discrepancy', note: 'Where the results differ. Do not hide it.' },
          { n: 4, name: 'Possible reasons', note: 'Real differences in method, with evidence. Never “human error”.' },
          { n: 5, name: 'The strength of the evidence', note: 'How far each claim can be trusted, and why.' }
        ],
        after: 'Works Cited entry: ' + CITE },

      { type: 'compare', title: 'Discuss, do not repeat',
        bad: 'The mean time was 178 s at 20.0 °C, 118 s at 30.0 °C, 74 s at 40.0 °C, 54 s at 50.0 °C and 98 s at 60.0 °C. This agrees with the literature.',
        good: 'The rate at 60.0 °C fell further than Raviyan et al. report, most probably because the enzyme was held at the test temperature before the reaction began.',
        badLabel: 'Repeats and claims', goodLabel: 'Compares and explains',
        why: 'The results section already gives the numbers. A discussion says what they mean, where they agree with published work, and why they differ.' },

      { type: 'note', tone: 'ee', title: 'What criterion D asks', label: 'Criterion D: Discussion and evaluation (8 marks)',
        md: 'The largest criterion in the new EE. It asks whether the discussion of the findings is __balanced__ and __supported by appropriate evidence__. It also asks whether the evaluation names strengths as well as limitations.\n\nIn IB command terms, *discuss* means: “Offer a considered and balanced review that includes a range of arguments, factors or hypotheses.” Balanced means that you also discuss the source that disagrees.' },

      { type: 'note', tone: 'ib', title: 'The IA has no discussion', label: 'Writing an IA?',
        md: 'The IA has four criteria: Research design, Data analysis, Conclusion and Evaluation. There is no discussion section. Put the comparison with published science in the __Conclusion__, and the weaknesses in the __Evaluation__.' },

      { type: 'frames', title: 'Sentences for your discussion', items: [
        'This finding suggests that ___, because ___.',
        '___ reported ___ (___), which agrees with the ___ found here.',
        'However, ___ differed: here ___, whereas ___ reported ___.',
        'A possible reason for this discrepancy is ___; this could be tested by ___.',
        'This claim is strongly / only partly supported, because ___.'
      ] }
    ],

    redpen: {
      e: {
        title: 'An EE discussion. Five phrases would lose marks.',
        body: '[!a:The results were as expected.]\n\nThe optimum was 50 °C.\n\n[!b:This agrees with the literature.]\n\nAt 60 °C, the rate was lower than in other studies.\n\n[!c:This was due to human error.]\n\n[!d:At 20 °C the mean was 178 s.] At 30 °C it was 118 s, and at 40 °C it was 74 s.\n\n[!e:This proves the collision theory.]',
        notes: {
          a: { label: 'what does it mean?', why: 'Expected by whom? Say which finding, and what it shows: the peak near 50 °C shows that faster collisions outweighed denaturation up to that temperature.' },
          b: { label: 'which? how close?', why: 'Name the source and compare the numbers: Raviyan et al. report 55 °C (5464), inside the 40.0–60.0 °C range found here.' },
          c: { label: 'human error?', why: 'Give a reason that can be tested: the enzyme was held at 60 °C before the reaction, and Raviyan et al. found that this enzyme loses activity within a few minutes at 60 °C.' },
          d: { label: 'a repeat', why: 'The results section already gives these numbers. Discuss what they mean.' },
          e: { label: 'proves?', why: 'One enzyme cannot prove a theory. The results are consistent with it.' }
        },
        fixed: 'The peak near 50 °C shows that ==faster collisions outweighed denaturation== up to that temperature. ==Raviyan et al. report an optimum of 55 °C (5464)==, inside the 40.0–60.0 °C range found here. However, ==at 60.0 °C the rate here fell to 55 % of its maximum==, against about three-quarters in their study, ==most probably because the enzyme was held at 60 °C before the reaction==. The results are ==consistent with== the collision theory.',
        fixedNote: 'Each sentence now says what a finding means, compares it with a named source, or explains a discrepancy.'
      }
    },

    traps: [
      { bad: 'The results agreed with the literature.', good: 'Raviyan et al. report 55 °C (5464); the data here place the optimum between 40.0 and 60.0 °C.' },
      { bad: 'The rate at 60 °C was different because of human error.', good: 'A possible reason: the enzyme was held at 60 °C before the reaction, so some was denatured.' },
      { bad: 'Every mean from the results table, again.', good: 'Say what the numbers mean. The table already gives them.' },
      { bad: 'Only the sources that agree are mentioned.', good: 'A balanced discussion includes the result that disagrees, and a reason for it.' },
      { bad: 'This proves the collision theory.', good: 'This is consistent with more frequent successful collisions at higher temperatures.' }
    ],

    test: [
      { type: 'choose', q: 'Which of these is NOT one of the four IA criteria?',
        opts: [
          { t: 'Discussion', ok: true, why: 'The IA criteria are Research design, Data analysis, Conclusion and Evaluation. A discussion section first appears in the EE.' },
          { t: 'Conclusion', why: 'Conclusion is an IA criterion, worth 6 marks.' },
          { t: 'Evaluation', why: 'Evaluation is an IA criterion, worth 6 marks.' },
          { t: 'Research design', why: 'Research design is an IA criterion, worth 6 marks.' }
        ] },
      { type: 'sort', q: 'In an Extended Essay, which section does each sentence belong in?',
        bins: ['Analysis', 'Discussion', 'Conclusion'],
        items: [
          { t: 'The rate rose 3.3-fold between 20.0 and 50.0 °C.', bin: 0, why: 'It describes a finding, with a number.' },
          { t: 'The published optimum of 55 °C lies inside the 40.0–60.0 °C range found here.', bin: 1, why: 'A comparison with published work.' },
          { t: 'The steeper fall at 60 °C may be due to heating the enzyme before the reaction.', bin: 1, why: 'A reason for a discrepancy.' },
          { t: 'Temperature has a large effect on the rate, up to an optimum between 40.0 and 60.0 °C.', bin: 2, why: 'The answer to the question, combining the findings.' },
          { t: 'No anomalous results were identified.', bin: 0, why: 'A statement about the data.' }
        ] },
      { type: 'spot', q: 'Tap the three phrases that would lose marks in a discussion.',
        text: '[?:Raviyan et al. report an optimum of 55 °C for α-amylase from *A. oryzae* (5464).] [!a:This agrees with the literature.] [?:At 60 °C, the rate here fell to 55 % of its maximum.] [!b:This was due to human error.] [!c:This proves that enzymes denature.]',
        why: { a: 'Which literature, and how closely? The sentence before already did this properly.', b: 'Name a real, testable difference in method, such as heating the enzyme before the reaction.', c: 'Data support or are consistent with a claim; they do not prove it.' } },
      { type: 'multi', q: 'Which belong in a balanced discussion?',
        opts: [
          { t: 'Agreements with published results', ok: true },
          { t: 'Discrepancies, each with a possible reason', ok: true },
          { t: 'How strong the evidence is', ok: true },
          { t: 'Every mean from the results table, again', why: 'The results section already gives them.' },
          { t: 'Only the sources that agree', why: 'Omitting the source that disagrees makes the discussion unbalanced.' }
        ],
        why: 'Criterion D asks for a balanced discussion, supported by appropriate evidence.' },
      { type: 'order', q: 'Put the parts of a discussion paragraph in order.',
        items: ['What the finding means', 'How it compares with published work', 'Where it differs', 'A possible reason for the difference', 'How strong the evidence is'],
        why: 'Meaning, agreement, discrepancy, reason, then the strength of the evidence.' },
      { type: 'choose', q: 'At 60 °C, the rate here fell to 55 % of its maximum. Raviyan et al. found about 74 %. What is the best possible reason to discuss?',
        opts: [
          { t: 'The amylase was held at 60 °C before the reaction, so some of it was denatured before timing began.', ok: true, why: 'A real difference in method, supported by their own finding that activity falls within 3 min at 60 °C.' },
          { t: 'Human error.', why: 'It names no step, so it cannot be tested or discussed.' },
          { t: 'The published value is wrong.', why: 'Possible, but you would need evidence. Look first for differences between the two methods.' },
          { t: 'The water bath was broken.', why: 'There is no evidence for this, and a broken bath would affect every temperature.' }
        ] },
      { type: 'build', q: 'Build a sentence that states a discrepancy.',
        chips: ['However, at 60 °C', 'the rate here fell to 55 % of its maximum,', 'whereas Raviyan et al. report', 'about three-quarters of peak activity.', 'because of human error.', 'which proves them wrong.'],
        answer: ['However, at 60 °C', 'the rate here fell to 55 % of its maximum,', 'whereas Raviyan et al. report', 'about three-quarters of peak activity.'],
        why: 'It states both values, so the reader of your report can see the size of the difference.' }
    ],

    words: [
      { term: 'discussion', forms: ['discussions', 'discuss'], def: 'The section of an essay that explains what the findings mean and compares them with published research.', eg: 'The optimum agrees with the 55 °C reported by Raviyan et al.' },
      { term: 'discrepancy', forms: ['discrepancies'], def: 'A difference between two results that should agree, such as your value and a published value.', eg: 'At 60 °C: 55 % of the peak rate here, about 74 % in the published study.' },
      { term: 'synthesis', forms: ['synthesise', 'synthesize'], def: 'Combining several findings into one answer.', eg: 'Temperature affects the rate to a large extent, up to an optimum between 40 and 60 °C.' }
    ],

    further: [
      { title: 'Why a measured optimum depends on the timing',
        md: 'Denaturation is not instant. Raviyan et al. held *A. oryzae* α-amylase at 55–70 °C for different times: the longer it was held, the less activity remained, and the loss was faster at higher temperatures (their Figure 3). So each measured optimum depends on the method used. A longer assay gives more time for denaturation, which can make the peak appear at a lower temperature.',
        cite: CITE }
    ],

    sources: ['IB Extended essay guide (first assessment 2027), criterion D', 'IB Biology guide (2025), command terms, p. 125', 'Raviyan et al. (2003), *Journal of Agricultural and Food Chemistry* 51: 5462–66', 'D. Mompel Riera, “Progression of scientific writing expectations”']
  });
})(window.WUL);
