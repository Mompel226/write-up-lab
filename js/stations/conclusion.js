/* station: conclusion — answer, evidence, biology, comparison.
   Published value (verified 23 Sep 2026 from the full text, p. 5464, and Crossref metadata):
   Raviyan, Tang and Rasco (2003), J. Agric. Food Chem. 51 (18): 5462–5466, doi 10.1021/jf020906j.
   Commercial α-amylase from Aspergillus oryzae (Sigma), 0.05 M phosphate buffer pH 7.1, maltodextrin substrate:
   “The optimum temperature of 55 °C for free α-amylase confirms that of prior studies” (p. 5464).
   Numbers (WUL.data.amylase): IGCSE 180 / 53 / 93 s; IB 54 s (SD 5.5 s) at 50 °C; rates 13.5 / 18.5 / 10.2 × 10⁻³ s⁻¹
   at 40 / 50 / 60 °C; SD bars at 40, 50, 60 °C do not overlap; rate 18.5 ÷ 5.6 = 3.3 times. */
(function (WUL) {
  'use strict';
  var A = WUL.data.amylase, S = WUL.data.soils;
  function pts(lv, key, from, to) {
    return A[lv].temps.map(function (t, i) { return [t, A[lv][key][i]]; }).filter(function (p) { return p[0] >= (from || 0) && p[0] <= (to || 99); });
  }
  var CITE = 'Raviyan, Patcharin, et al. “Thermal Stability of α-Amylase from *Aspergillus oryzae* Entrapped in Polyacrylamide Gel.” *Journal of Agricultural and Food Chemistry*, vol. 51, no. 18, 2003, pp. 5462–66, https://doi.org/10.1021/jf020906j.';
  var AXES = ['paper', 'axis-x', 'axis-y', 'ticks-x', 'ticks-y', 'label-x', 'label-y', 'caption'];
  var X = { min: 20, max: 60, step: 10, minor: 2, label: 'Temperature / °C' };

  var plotG = {
    w: 540, h: 340, x: X,
    y: { min: 0, max: 200, step: 20, minor: 2, label: 'Mean time for starch to disappear / s' },
    series: [
      { id: 'up', pts: pts('g', 'means', 20, 50), line: 'ruled', mark: 'none', tone: 'green' },
      { id: 'down', pts: pts('g', 'means', 50, 60), line: 'ruled', mark: 'none', tone: 'red' },
      { id: 'm', pts: pts('g', 'means'), line: 'none', mark: 'x', tone: 'ink' }
    ],
    caption: 'Figure 1. Effect of temperature on the mean time for amylase to digest starch (n = 3)'
  };
  var plotI = {
    w: 540, h: 340, x: X,
    y: { min: 0, max: 20, step: 2, minor: 2, label: 'Mean rate / 10⁻³ s⁻¹' },
    series: [
      { id: 'up', pts: pts('i', 'rates', 20, 50), line: 'ruled', mark: 'none', tone: 'green' },
      { id: 'down', pts: pts('i', 'rates', 50, 60), line: 'ruled', mark: 'none', tone: 'red' },
      { id: 'm', pts: pts('i', 'rates'), line: 'none', mark: 'x', tone: 'ink' }
    ],
    caption: 'Figure 2. Mean rate of starch hydrolysis by *A. oryzae* α-amylase (n = 5; rate = 1 ÷ mean time, plotted in 10⁻³ s⁻¹)'
  };
  var plotShow = {
    w: 480, h: 300, x: X,
    y: { min: 0, max: 200, step: 40, minor: 4, label: 'Mean time / s' },
    series: [{ id: 'm', pts: pts('g', 'means'), line: 'ruled', mark: 'x', tone: 'ink' }],
    caption: 'Mean time for amylase to digest starch (n = 3)'
  };
  var plotSoils = {
    w: 380, h: 290, pad: { l: 58, r: 14, t: 14, b: 50 }, axisBreak: true,
    x: { cat: S.labels, label: 'Soil' },
    y: { min: 40, max: 47, step: 1, minor: 2, label: 'Mean height / cm' },
    series: [{ id: 's', pts: S.means.map(function (m, i) { return [i + 0.5, m]; }), err: S.sds, line: 'none', mark: 'x', tone: 'ink' }],
    caption: 'Mean height of bean seedlings after 21 days (n = 10; error bars = ± 1 SD)'
  };

  WUL.station({
    id: 'conclusion', stage: 'sense', order: 3, title: 'Conclusion', levels: 'gie',
    job: { g: 'Say whether the hypothesis is supported, give the evidence, and explain it with biology.', i: 'Answer the research question with processed data and its uncertainty, then justify the answer against published science.', e: 'A short synthesis that answers the research question. No new evidence and no new argument.' },
    where: { g: 'After the data analysis, before the evaluation.', i: 'After the analysis, before the evaluation. It has its own criterion: Conclusion, 6 marks.', e: 'At the end of the essay, after the discussion and the evaluation.' },

    ladder: {
      g: ['Say whether the results __support__ the [[hypothesis]]', 'Give the key values as evidence', 'Explain the biology with the exact terms', 'Good practice: compare with a [[published value]]'],
      i: ['Answer the [[research question]] first, in its own words', 'Use [[processed data]] and its uncertainty', '[[Justify]] the answer with a cited published value: which source, and how close', 'One line on the hypothesis is allowed, but it earns nothing alone'],
      e: ['A short [[synthesis]] that answers the research question', 'Drawn from the discussion: no new data, no new argument', 'Shorter than an IA conclusion, because the discussion already gives the detail']
    },

    build: [
      { type: 'steps', lv: 'g', title: 'The biology behind the graph',
        intro: 'A conclusion explains the shape of the graph. Press Next.',
        stage: { plot: plotG },
        steps: [
          { title: 'Find the answer', text: 'A shorter time means a faster rate. The time was shortest at 50 °C, so 50 °C was the [[optimum]] __of the temperatures tested__.', show: AXES.concat(['pts-m']), focus: ['pts-m'] },
          { title: 'Up to 50 °C: the time falls', text: 'The amylase and starch molecules gain kinetic energy and move faster. They collide more often, so more successful collisions form more enzyme–substrate complexes per second.', show: ['line-up'] },
          { title: 'Above 50 °C: the time rises', text: 'Hydrogen and ionic bonds in the tertiary structure of the amylase break. The active site changes shape, so starch is no longer complementary to it and cannot bind. More of the enzyme is denatured.', show: ['line-down'] },
          { title: 'Both effects together', text: 'Raising the temperature makes collisions __and__ denaturation faster. Below the optimum, the first effect is larger. Above it, the second is.', show: [], focus: ['line-up', 'line-down'] }
        ] },

      { type: 'steps', lv: 'ie', title: 'The biology behind the rate graph',
        intro: 'The same data as a rate: the higher the line, the faster the reaction. Press Next.',
        stage: { plot: plotI },
        steps: [
          { title: 'Find the answer', text: 'The mean rate was highest at 50.0 °C: 18.5 × 10⁻³ s⁻¹. With a 10.0 °C interval, the [[optimum]] lies between 40.0 and 60.0 °C.', show: AXES.concat(['pts-m']), focus: ['pts-m'] },
          { title: 'Up to the optimum: the rate rises', text: 'The amylase and starch molecules gain kinetic energy. They collide more often, so more successful collisions form more enzyme–substrate complexes per second.', show: ['line-up'] },
          { title: 'Above the optimum: the rate falls', text: 'Hydrogen and ionic bonds in the tertiary structure break. The active site changes shape, so the substrate is no longer complementary to it. A growing proportion of the enzyme is denatured.', show: ['line-down'] },
          { title: 'Both effects together', text: 'Raising the temperature makes collisions __and__ denaturation faster. Below the optimum, the first effect is larger. Above it, the second is.', show: [], focus: ['line-up', 'line-down'] }
        ] },

      { type: 'anatomy', lv: 'e', title: 'An EE conclusion',
        intro: 'Short. It combines the discussion into one answer.',
        model: '{1:Temperature has a large effect on the rate of starch hydrolysis by *A. oryzae* α-amylase, but only up to an optimum between 40.0 and 60.0 °C.} {2:Below the optimum, the gain in successful collisions outweighs denaturation; above it, denaturation outweighs the gain.} {3:This optimum agrees with the 55 °C reported by Raviyan et al., and the steeper fall at 60.0 °C is most probably explained by the time the enzyme was held at that temperature before the reaction began.} {4:The measured effect of temperature on this enzyme therefore depends on how long it is heated, as well as on the temperature itself.}',
        parts: [
          { n: 1, name: 'The answer', note: 'To the research question, in its own words: “to what extent”.' },
          { n: 2, name: 'The main reason, in one sentence', note: 'From the discussion. No new argument.' },
          { n: 3, name: 'How it compares with published work', note: 'Agreements and discrepancies, already discussed, in one sentence.' },
          { n: 4, name: 'What it means', note: 'One sentence on what the finding means. Then stop.' }
        ],
        after: 'Do not repeat the results. Include only what the discussion has already argued.' },

      { type: 'anatomy', lv: 'g', title: 'The four parts of a conclusion',
        intro: 'In this order. Tap a colour to see each part.',
        model: '{1:The results support the hypothesis that the time would decrease to a minimum and then increase.} {2:The mean time was shortest at 50 °C (53 s), compared with 180 s at 20 °C and 93 s at 60 °C.}\n\n{3:Up to 50 °C, the amylase and starch molecules gained kinetic energy, so they collided more often. More successful collisions formed more enzyme–substrate complexes per second, so the starch was digested faster.} {3:Above 50 °C, hydrogen and ionic bonds in the tertiary structure of the amylase broke. The active site changed shape, so starch was no longer complementary to it: some of the amylase was denatured.}\n\n{4:An optimum near 50 °C is close to the 55 °C published for α-amylase from the fungus *Aspergillus oryzae* (Raviyan et al. 5464).}',
        parts: [
          { n: 1, name: 'The answer', note: '“Support” or “do not support”. Never “prove” or “correct”.' },
          { n: 2, name: 'The evidence', note: 'Key values from your own data, with units.' },
          { n: 3, name: 'The biology', note: 'Why it happened, in exact terms. This is what separates a conclusion from an analysis.' },
          { n: 4, name: 'The comparison', note: 'Good practice at IGCSE. Use a value for the same kind of enzyme: amylases from different organisms have different optima.' }
        ],
        after: 'The full reference belongs in the list at the end: ' + CITE },

      { type: 'note', tone: 'house', lv: 'g', title: 'Compare with a published value', label: 'Our rule',
        md: 'Compare your result with a published value, and cite it. Cambridge does not require this, but the IB does, so start now.' },

      { type: 'anatomy', lv: 'i', title: 'An IA conclusion',
        intro: 'Tap a colour to see each part. Part 5 is optional.',
        model: '{1:Within 20.0–60.0 °C, the rate of starch hydrolysis by *A. oryzae* α-amylase was highest at 50.0 °C, so its optimum temperature lies between 40.0 and 60.0 °C, closest to 50.0 °C.} {2:The mean time at 50.0 °C was 54 s (SD 5.5 s), a mean rate of 18.5 × 10⁻³ s⁻¹, compared with 13.5 × 10⁻³ s⁻¹ at 40.0 °C and 10.2 × 10⁻³ s⁻¹ at 60.0 °C. The SD bars of these three temperatures do not overlap, so the peak is not explained by variation between trials.}\n\n{3:Up to the optimum, the molecules gained kinetic energy, so successful collisions and enzyme–substrate complexes formed more often. Above it, hydrogen and ionic bonds in the tertiary structure broke, the active site changed shape and was no longer complementary to the substrate, and a growing proportion of the enzyme was denatured.}\n\n{4:Raviyan et al. report an optimum of 55 °C for α-amylase from *A. oryzae* (5464). This lies inside the 40.0–60.0 °C range found here, so the two agree within the 10.0 °C interval used.} {5:These results support the hypothesis that the rate would rise to an optimum and then fall.}',
        parts: [
          { n: 1, name: 'The answer to the research question', note: 'In the question’s own words: the variables, the system and the range.' },
          { n: 2, name: 'The evidence, with its uncertainty', note: 'Processed data (means, rates, SD), and what the error bars allow you to claim.' },
          { n: 3, name: 'The biology', note: 'Exact terms: kinetic energy, successful collisions, enzyme–substrate complex, active site, tertiary structure, denatured.' },
          { n: 4, name: 'The comparison, cited', note: 'Which source, and how close. The citation must be traceable.' },
          { n: 5, name: 'One line on the hypothesis', note: 'Allowed, and last. It earns nothing alone.' }
        ],
        after: 'Works Cited entry: ' + CITE },

      { type: 'note', tone: 'ib', lv: 'i', title: 'What the IB criterion asks', label: 'What the IB criterion asks',
        md: 'Top band (5–6): the conclusion is “justified” and “fully consistent with the analysis presented”, and it is “justified through relevant comparison to the accepted scientific context”.\n\n“Fully consistent” requires “the interpretation of processed data including associated uncertainties”. Citations must be “sufficiently detailed to allow these sources to be traceable”.' },

      { type: 'note', tone: 'ib', lv: 'i', title: 'The hypothesis at IB', label: 'At IB: and the hypothesis?',
        md: 'You may add one sentence on the hypothesis, after the answer. The IB lists “Evaluate hypotheses” as a skill, but the criterion rewards the answer to the __research question__. So the hypothesis sentence earns nothing alone, and it never replaces the answer.' },

      { type: 'compare', lv: 'ie', title: 'Name the source and the value',
        bad: 'This agrees with the literature.',
        good: 'Raviyan et al. report an optimum of 55 °C for α-amylase from *A. oryzae* (5464), inside the 40.0–60.0 °C range found here.',
        badLabel: 'Earns nothing', goodLabel: 'Traceable and numerical',
        why: 'The first names no source and no number, so nobody can check it. The second names the source, the page and the value, and says how close it is.' },

      { type: 'rules', title: 'Use the exact words', items: [
        'Data __support__ a hypothesis. They never “prove” it.',
        'Enzymes are not alive. They are __denatured__, never “killed”.',
        'Name the process: kinetic energy, successful collisions, enzyme–substrate complexes, active site, denatured.',
        { t: 'Answer the research question __first__, with processed data and its uncertainty.', lv: 'ie' },
        { t: 'Where [[error bars|error bar]] overlap, say that the conditions __cannot be separated__.', lv: 'ie' },
        { t: 'Keep weaknesses and limitations for the [[evaluation]].', lv: 'ie' }
      ] },

      { type: 'frames', lv: 'g', title: 'Sentences for your conclusion', items: [
        'The results support / do not support the hypothesis that ___.',
        'The mean ___ was shortest at ___ (___), compared with ___ at ___ and ___ at ___.',
        'Up to ___, the molecules gained ___, so more ___ formed per second.',
        'Above ___, the ___ bonds in the tertiary structure broke, the active site ___, and the enzyme was ___.',
        'This is close to the ___ published for ___ (___).'
      ] },
      { type: 'frames', lv: 'i', title: 'Sentences for an IA conclusion', items: [
        'Within ___, the ___ was highest at ___, so ___.',
        'The mean ___ at ___ was ___ (SD ___), compared with ___ at ___.',
        'The error bars at ___ and ___ overlap, so these conditions cannot be separated.',
        '___ report ___ for ___ (___); this is ___ the value found here.',
        'These results support / do not support the hypothesis that ___.'
      ] },
      { type: 'frames', lv: 'e', title: 'Sentences for an EE conclusion', items: [
        'To a large / limited extent, ___ affects ___, because ___.',
        'Taken together, these findings show that ___.',
        'This agrees with ___, and the difference from ___ is best explained by ___.',
        'The effect of ___ on ___ therefore depends on ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this. Five phrases would lose marks.',
        body: '[!a:The hypothesis was correct.]\n\n[!b:The reaction was faster.]\n\nIt was fastest at 50 °C.\n\n[!c:That is the best temperature.]\n\n[!d:Above 50 °C, the enzyme died.]\n\n[!e:The heat melted it.]',
        notes: {
          a: { label: 'supported, not correct', why: 'Data support a hypothesis; they never prove it. Write: “The results support the hypothesis that…”.' },
          b: { label: 'numbers?', why: 'Faster than what? Give the evidence: the mean time was 53 s at 50 °C, compared with 180 s at 20 °C and 93 s at 60 °C.' },
          c: { label: 'not a reason', why: '“Best” only repeats the result. Explain it: the molecules had more kinetic energy, so more successful collisions formed more enzyme–substrate complexes per second.' },
          d: { label: 'not alive', why: 'Enzymes are proteins, not living things. Write “denatured”.' },
          e: { label: 'melted?', why: 'Nothing melts. Hydrogen and ionic bonds in the tertiary structure break, the active site changes shape, and starch is no longer complementary to it.' }
        },
        fixed: '==The results support the hypothesis== that the time would decrease to a minimum and then increase. The mean time was shortest at 50 °C (==53 s==), compared with 180 s at 20 °C and 93 s at 60 °C. Up to 50 °C, the molecules had ==more kinetic energy==, so ==more successful collisions== formed enzyme–substrate complexes. Above 50 °C, ==hydrogen and ionic bonds in the tertiary structure broke==, the active site changed shape, and some of the amylase was ==denatured==.',
        fixedNote: 'It now gives the answer, the evidence and the biology, in exact terms.'
      },
      i: {
        title: 'An IA conclusion. Five phrases would keep it out of the top band.',
        body: '[!a:The hypothesis was correct.]\n\n[!b:Amylase works best at 50 °C.]\n\n[!c:The reaction was fastest there.]\n\n[!d:This agrees with the literature.]\n\n[!e:Human error made it unreliable.]',
        notes: {
          a: { label: 'answer the RQ first', why: 'Open with the answer to the research question. One line on the hypothesis may come last, but it earns nothing alone.' },
          b: { label: 'which amylase?', why: 'Name the system and the range: α-amylase from *A. oryzae*, between 20.0 and 60.0 °C. Amylases from other organisms have other optima.' },
          c: { label: 'numbers? SD?', why: 'Use processed data with its uncertainty: a mean rate of 18.5 × 10⁻³ s⁻¹ at 50.0 °C (mean time 54 s, SD 5.5 s), and the SD bars do not overlap.' },
          d: { label: 'which? how close?', why: 'Name the source and compare the numbers: Raviyan et al. report 55 °C (5464), inside the 40.0–60.0 °C range found here.' },
          e: { label: '→ evaluation', why: 'Weaknesses belong in the Evaluation, which has its own criterion. And “human error” names no step in the method.' }
        },
        fixed: '==Within 20.0–60.0 °C, the rate of starch hydrolysis by *A. oryzae* α-amylase was highest at 50.0 °C==, so its optimum lies between 40.0 and 60.0 °C. The mean rate at 50.0 °C was ==18.5 × 10⁻³ s⁻¹ (mean time 54 s, SD 5.5 s)==, compared with 13.5 × 10⁻³ s⁻¹ at 40.0 °C and 10.2 × 10⁻³ s⁻¹ at 60.0 °C, and the SD bars do not overlap. ==Raviyan et al. report an optimum of 55 °C for this enzyme (5464)==, inside that range. These results support the hypothesis.',
        fixedNote: 'The answer comes first, with processed data and its uncertainty, and the comparison is traceable. Limitations go in the evaluation.'
      },
      e: {
        title: 'An EE conclusion. Four phrases would lose marks.',
        body: '[!a:At 20.0 °C the mean was 178 s.] At 30.0 °C it was 118 s, at 40.0 °C 74 s, at 50.0 °C 54 s and at 60.0 °C 98 s.\n\n[!b:This proves] that temperature affects amylase.\n\n[!c:Calcium ions may also matter.]\n\n[!d:All amylases work best at 50 °C.]',
        notes: {
          a: { label: 'a repeat of the results', why: 'The results section has these numbers. A conclusion combines the findings into one answer.' },
          b: { label: 'proves?', why: 'Data support or show; they do not prove. Answer the question: “to what extent”.' },
          c: { label: 'new argument', why: 'A new idea at the end has no evidence behind it. It belongs in the discussion, or nowhere.' },
          d: { label: 'all amylases?', why: 'One enzyme from one species was tested. Keep the answer to that system.' }
        },
        fixed: '==Temperature has a large effect on the rate of starch hydrolysis by *A. oryzae* α-amylase, but only up to an optimum between 40.0 and 60.0 °C==. Below the optimum, the gain in successful collisions outweighs denaturation; above it, ==denaturation outweighs the gain==. This optimum ==agrees with the 55 °C reported by Raviyan et al.==',
        fixedNote: 'It answers the question for this enzyme, combines the argument into one answer, and adds nothing new.'
      }
    },

    traps: [
      { bad: 'The hypothesis was proved.', good: 'The results support the hypothesis.' },
      { bad: 'The enzyme was killed at 60 °C.', good: 'Some of the amylase was denatured: its active site changed shape.' },
      { bad: 'It was fastest at 50 °C because that is the best temperature.', good: '…because the molecules had more kinetic energy, so more successful collisions occurred.' },
      { bad: 'This agrees with the literature.', good: 'Raviyan et al. report 55 °C (5464): inside the 40.0–60.0 °C range found here.' },
      { bad: 'The results may be unreliable because of human error.', good: 'Keep weaknesses for the evaluation. The conclusion answers the question.', lv: 'ie' },
      { bad: 'All amylases work best at 50 °C.', good: 'The optimum of this *A. oryzae* α-amylase lies between 40.0 and 60.0 °C.', lv: 'ie' }
    ],

    test: [
      { type: 'order', q: 'Put the four sentences of this IGCSE conclusion in order.',
        items: [
          'The results support the hypothesis that the time would decrease to a minimum and then increase.',
          'The mean time was shortest at 50 °C (53 s), compared with 180 s at 20 °C and 93 s at 60 °C.',
          'Above 50 °C, bonds in the tertiary structure broke, the active site changed shape, and some amylase was denatured.',
          'This is close to the 55 °C published for α-amylase from *Aspergillus oryzae* (Raviyan et al. 5464).'
        ],
        why: 'The answer, the evidence, the biology, then the comparison.' },
      { type: 'choose', q: 'The hypothesis said: “As the temperature increases from 20 °C to 60 °C, the time will decrease.” Look at the graph. Which conclusion is right?', show: { plot: plotShow },
        opts: [
          { t: 'The results support the hypothesis only up to 50 °C. Above 50 °C, the time increased.', ok: true, why: 'Say how far the data support it, and where they do not.' },
          { t: 'The results support the hypothesis fully.', why: 'Between 50 °C and 60 °C, the time increased, which the hypothesis did not predict.' },
          { t: 'The hypothesis was wrong, so the experiment failed.', why: 'A hypothesis that is not supported is still a valid result. The experiment worked.' },
          { t: 'No conclusion can be drawn.', why: 'The data show a clear pattern: a conclusion can be drawn.' }
        ] },
      { type: 'spot', q: 'Tap the three phrases that are wrong biology.',
        text: '[?:Between 20 °C and 50 °C, the molecules gained kinetic energy], so [!a:the enzyme worked harder]. [?:More enzyme–substrate complexes formed per second.] Above 50 °C, [!b:the enzyme died] because [!c:the heat melted the active site]. [?:The substrate was no longer complementary to the active site.]',
        why: { a: 'Enzymes do not “work harder”. More successful collisions occurred.', b: 'Enzymes are not alive: they are denatured.', c: 'Nothing melts. Hydrogen and ionic bonds in the tertiary structure break, so the active site changes shape.' } },
      { type: 'build', q: 'Build the sentence that explains why the rate fell above 50 °C.',
        chips: ['Above 50 °C,', 'hydrogen and ionic bonds in the tertiary structure broke,', 'so the active site changed shape', 'and starch was no longer complementary to it:', 'the amylase was denatured.', 'the amylase was killed.', 'the starch melted,'],
        answer: ['Above 50 °C,', 'hydrogen and ionic bonds in the tertiary structure broke,', 'so the active site changed shape', 'and starch was no longer complementary to it:', 'the amylase was denatured.'],
        why: 'Bonds break, so the shape changes, so the substrate no longer fits: denaturation.' },
      { type: 'choose', q: 'Which sentence compares with a published value properly?',
        opts: [
          { t: 'This optimum is close to the 55 °C published for α-amylase from *A. oryzae* (Raviyan et al. 5464).', ok: true, why: 'It names the value, the enzyme and a traceable source.' },
          { t: 'This agrees with what the internet says.', why: 'No source, no value: it cannot be checked.' },
          { t: 'Amylase always works best at 37 °C.', why: 'No source, and amylases from different organisms have different optima.' },
          { t: 'The textbook says enzymes denature.', why: 'It names no book and compares no number.' }
        ] },
      { type: 'sort', q: 'Does each sentence belong in the conclusion or the evaluation?',
        bins: ['Conclusion', 'Evaluation'],
        items: [
          { t: 'The rate was highest at 50.0 °C.', bin: 0, why: 'Part of the answer.' },
          { t: 'Raviyan et al. report an optimum of 55 °C.', bin: 0, why: 'The comparison with published science belongs in the conclusion.' },
          { t: 'Above the optimum, the active site changed shape.', bin: 0, why: 'The biology that explains the answer.' },
          { t: 'The iodine was sampled only every 10 s.', bin: 1, why: 'A weakness of the method.' },
          { t: 'Only one batch of amylase was used.', bin: 1, why: 'A limitation of the method.' },
          { t: 'A colorimeter would give a reading every second.', bin: 1, why: 'An improvement belongs in the evaluation.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'The research question: “How does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by *A. oryzae* α-amylase?” Which first sentence is best?',
        opts: [
          { t: 'Within 20.0–60.0 °C, the rate was highest at 50.0 °C, so the optimum lies between 40.0 and 60.0 °C.', ok: true, why: 'It answers the question in its own words, first.' },
          { t: 'The hypothesis was supported.', why: 'Allowed later, in one line, but it does not answer the research question.' },
          { t: 'Enzymes are affected by temperature.', why: 'Too general: it could end any enzyme report.' },
          { t: 'There were several errors in the method.', why: 'Errors belong in the evaluation.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'Every SD bar on this graph overlaps. Which conclusion is justified?', show: { plot: plotSoils },
        opts: [
          { t: 'The four soils cannot be separated: the means differ by only 1.3 cm, and every SD bar overlaps.', ok: true, why: 'Where the bars overlap, say that the conditions cannot be separated.' },
          { t: 'Soil D is the best soil for bean seedlings.', why: 'Its mean is highest, but the overlap means the difference may not be real.' },
          { t: 'Soil type has no effect on the growth of any plant.', why: 'Too wide: one species, four soils, 21 days.' },
          { t: 'Soil A reduced growth by 3 %.', why: 'The 3 % is within the spread of the data, so it cannot be claimed as an effect.' }
        ] },
      { type: 'multi', lv: 'ie', q: 'What does the top band (5–6) of the IA Conclusion criterion need?',
        opts: [
          { t: 'A conclusion relevant to the research question', ok: true },
          { t: 'Interpretation of processed data, including its uncertainties', ok: true },
          { t: 'A comparison with the accepted scientific context, cited so it can be traced', ok: true },
          { t: 'A judgement on whether the hypothesis was right', why: 'Allowed, but it is not in the descriptor.' },
          { t: 'A list of the method’s weaknesses', why: 'Weaknesses are marked by the Evaluation criterion.' }
        ],
        why: 'The three parts of the 5–6 descriptor and its clarifications (IB Biology guide, p. 122).' },
      { type: 'choose', lv: 'e', q: 'What should an Extended Essay conclusion do?',
        opts: [
          { t: 'Combine the findings of the discussion into an answer to the research question, with no new argument', ok: true, why: 'A synthesis: the answer, built from what the essay has already argued.' },
          { t: 'Repeat every result from the results section', why: 'The results are already there. A repeat is not a synthesis.' },
          { t: 'Introduce a new source that supports the answer', why: 'New evidence belongs in the discussion.' },
          { t: 'Be the longest section of the essay', why: 'In an EE, the discussion is long and the conclusion is short.' }
        ] }
    ],

    words: [
      { term: 'conclusion', forms: ['conclusions', 'conclude'], def: 'The part of a report that answers the question, gives the evidence and explains it with biology.', eg: 'The rate was highest at 50 °C, because…' },
      { term: 'published value', forms: ['published values', 'literature value'], def: 'A value reported in a textbook, paper or data sheet, used to check your own result.', eg: 'An optimum of 55 °C for α-amylase from *A. oryzae* (Raviyan et al. 5464).' },
      { term: 'justify', forms: ['justified', 'justifies', 'justification'], def: 'To give valid reasons or evidence that support an answer or conclusion.', eg: 'The optimum was justified with the mean rates and a published value.' }
    ],

    sources: ['IB Biology guide (2025), Conclusion criterion and clarifications, pp. 121–122', 'IB Biology guide (2025), Inquiry 3 skills, p. 33; command terms, p. 125', 'Raviyan et al. (2003), *Journal of Agricultural and Food Chemistry* 51: 5462–66', 'Cambridge 0610 syllabus 2026–2028, AO3, p. 10']
  });
})(window.WUL);
