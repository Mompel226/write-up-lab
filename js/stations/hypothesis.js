/* station: hypothesis — "If … then … because …", and a predicted SHAPE. */
(function (WUL) {
  'use strict';

  /* a sketch graph: labelled but unscaled axes (IB Tool 3), no grid, no points */
  function sketch(xl, yl, pts, line, more, size) {
    size = size || {};
    return {
      w: size.w || 260, h: size.h || 200, paper: false,
      pad: size.pad || { l: 30, r: 12, t: 12, b: 34 },
      x: { min: 0, max: 10, step: 1, ticks: false, label: xl },
      y: { min: 0, max: 10, step: 1, ticks: false, label: yl },
      series: [{ id: 's', pts: pts, mark: 'none', line: line || 'smooth', tone: 'lvl' }].concat(more || []),
      alt: 'Sketch graph: ' + yl + ' against ' + xl
    };
  }
  var RISE = [[0.3, 1], [2, 1.9], [4, 3.7], [6, 6.1], [7.1, 7.7], [7.8, 8.4]];
  var FALL = [[7.8, 8.4], [8.4, 7.7], [9, 4.8], [9.7, 1]];
  var OPTIMUM = RISE.concat(FALL.slice(1));
  var CMP = { w: 300, h: 220, pad: { l: 32, r: 12, t: 12, b: 36 } };    /* the two sketches compared side by side */
  var PLATEAU = [[0, 0.2], [1, 3], [2, 5.1], [3, 6.5], [4, 7.4], [5.5, 8.1], [7.5, 8.5], [10, 8.7]];

  WUL.station({
    id: 'hypothesis', keepV: { v: '1av3x7c', now: '1szzikw', on: '2026-10-07', why: 'wrong options rewritten in the third answers audit (8 Oct 2026)' }, stage: 'plan', order: 4, title: 'Hypothesis', levels: 'gie',
    job: 'Predict what will happen to the dependent variable, and the shape of the graph, with a biological reason.',
    where: { g: 'After the aim, before the method.', i: 'Inside your introduction, after the background. It is optional in the IA.', e: 'Inside the introduction, after the literature review.' },

    ladder: {
      g: ['“If … then … because …”, with a biological reason', 'A [[prediction]] of the __shape__ of the graph, not only its direction'],
      i: ['Optional: the hypothesis is not in the IA criteria', 'A [[sketch graph]] of the predicted shape helps', 'In the conclusion, answer the research question with processed data; a sentence on the hypothesis may follow'],
      e: ['A hypothesis that the data could show to be false, built from the literature', 'Results that do not support it are as valid as results that do']
    },

    build: [
      { type: 'anatomy', lv: 'g', title: 'The parts of a hypothesis',
        intro: 'Tap a colour to see each part.',
        model: '{1:If the temperature is increased from 20 °C to 60 °C,} {2:then the time taken for the starch to be digested will decrease to a minimum at the optimum, then increase,} {3:because enzyme and substrate molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form per second.} {4:Above the optimum, hydrogen and ionic bonds in the tertiary structure break, the active site changes shape, the substrate no longer fits, and the enzyme is denatured.}',
        parts: [
          { n: 1, name: 'If: the change', note: 'The [[independent variable]] and its range.' },
          { n: 2, name: 'Then: the prediction', note: 'What the [[dependent variable]] will do, including the shape: down, then up.' },
          { n: 3, name: 'Because: below the optimum', note: 'Kinetic energy, collisions, enzyme–substrate complexes.' },
          { n: 4, name: 'Because: above the optimum', note: 'Bonds break, the active site changes shape, the enzyme is denatured.' }
        ] },

      { type: 'anatomy', lv: 'ie', title: 'The parts of an IB hypothesis',
        intro: 'The same structure, for the named enzyme. Tap a colour to see each part.',
        model: '{1:If the temperature is increased from 20.0 to 60.0 °C,} {2:then the rate of starch hydrolysis by fungal α-amylase will increase to a maximum near 55 °C, then fall steeply,} {3:because enzyme and substrate molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form per second.} {4:Above the optimum, hydrogen and ionic bonds in the tertiary structure break, the active site changes shape, and the enzyme is denatured.} {5:Raviyan et al. report an optimum of 55 °C for α-amylase from *Aspergillus oryzae* (5464).}',
        parts: [
          { n: 1, name: 'If: the change', note: 'The independent variable and its range.' },
          { n: 2, name: 'Then: the predicted shape', note: 'A rise, a peak near a stated value, then a steep fall.' },
          { n: 3, name: 'Because: below the optimum', note: 'Collision theory.' },
          { n: 4, name: 'Because: above the optimum', note: 'Denaturation, named with its mechanism.' },
          { n: 5, name: 'Where the number comes from', note: 'A predicted value needs a source.' }
        ] },

      { type: 'callout', title: 'Predict a shape', label: 'Remember', md: 'Predict a __shape__, not only a direction. Many biological responses rise to a [[plateau]] or peak at an [[optimum]].' },

      { type: 'compare', title: 'A direction, or a shape?',
        badLabel: 'A direction only', goodLabel: 'A shape',
        bad: { plot: sketch('Temperature / °C', 'Rate of reaction', [[0.5, 1], [9.5, 9]], 'ruled', null, CMP) },
        good: { plot: sketch('Temperature / °C', 'Rate of reaction', OPTIMUM, 'smooth', null, CMP) },
        why: '“The rate will increase with temperature” ignores denaturation. An enzyme has an optimum, so the prediction is a peak.' },

      { type: 'grid2', title: 'Five shapes a prediction can take',
        items: [
          { label: '1 · Linear increase', v: { plot: sketch('Catalase concentration', 'Rate of reaction', [[0, 0], [9.7, 9.2]], 'ruled') },
            note: 'Catalase and hydrogen peroxide, with plenty of substrate: twice the enzyme gives about twice the rate.' },
          { label: '2 · Increase to a plateau', v: { plot: sketch('Substrate concentration', 'Rate of reaction', PLATEAU) },
            note: 'Catalase and hydrogen peroxide: the rate reaches a [[plateau]] when every active site is occupied (saturation).' },
          { label: '3 · Rise to an optimum, then fall', v: { plot: sketch('Temperature / °C', 'Rate of reaction', OPTIMUM) },
            note: 'Amylase and temperature: the rate rises to the [[optimum]], then falls steeply as the enzyme is denatured.' },
          { label: '4 · Decrease', v: { plot: sketch('Amylase concentration', 'Time taken', [[0.6, 9.4], [1.5, 6.2], [2.5, 4.4], [4, 3.1], [6, 2.2], [8, 1.7], [9.8, 1.4]]) },
            note: 'The time for starch to disappear falls as amylase concentration increases: more active sites, so faster digestion.' },
          { label: '5 · No effect', v: { plot: sketch('Light intensity', 'Rate of CO₂ release', [[0.3, 5], [9.7, 5]], 'ruled') },
            note: 'Yeast and light: yeast cannot photosynthesise, so light should not change its rate of respiration, if temperature is kept the same.' }
        ] },

      { type: 'steps', title: 'Draw the sketch graph for amylase',
        intro: 'A sketch graph shows the predicted shape before any data exist. Press Next step.',
        stage: { plot: sketch('Temperature / °C', 'Rate of starch hydrolysis', RISE, 'smooth', [
          { id: 'fall', pts: FALL, mark: 'none', line: 'smooth', tone: 'lvl' },
          { id: 'opt', pts: [[7.8, 0], [7.8, 8.4]], mark: 'none', line: 'ruled', tone: 'grey', dash: true }
        ], { w: 340, h: 240, pad: { l: 34, r: 14, t: 12, b: 38 } }) },
        steps: [
          { title: 'Label the axes, but add no scale', text: 'The independent variable goes on the x-axis and the dependent variable on the y-axis. There are no numbers: the shape is the prediction.', show: ['axis-x', 'axis-y', 'label-x', 'label-y'] },
          { title: 'Below the optimum, the rate rises', text: 'Enzyme and substrate molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form per second.', show: ['line-s'] },
          { title: 'The peak is the optimum', text: 'The rate is highest at the [[optimum]]. For α-amylase from *Aspergillus oryzae*, a published value is 55 °C (Raviyan et al. 5464).', show: ['line-opt'] },
          { title: 'Above the optimum, the rate falls steeply', text: 'Hydrogen and ionic bonds in the tertiary structure break. The active site changes shape, the substrate no longer fits, and the enzyme is denatured.', show: ['line-fall'] }
        ] },

      { type: 'note', tone: 'igcse', lv: 'g', label: 'At IGCSE', title: 'Not an exam requirement',
        md: 'Cambridge 0610 does not require a hypothesis. In Paper 6 planning questions, predictions earn no marks.\n\nIn a written lab report, a hypothesis is standard practice. It practises a skill that the syllabus lists: to “make reasoned predictions of expected results”.' },

      { type: 'note', tone: 'ib', lv: 'ie', label: 'At IB', title: 'Optional, but an IB skill',
        md: 'The hypothesis is not in the IA criteria, so it is optional. But “formulate research questions and hypotheses” and “evaluate hypotheses” are IB skills (Inquiry 1 and 3). “Sketch graphs, with labelled but unscaled axes” are a Tool 3 skill.\n\nA statistical test needs a different kind of hypothesis, the [[null hypothesis]]: see the Statistics part.' },

      { type: 'note', tone: 'ee', lv: 'e', label: 'For the Extended Essay', title: 'The hypothesis in an EE',
        md: 'A science essay usually states a hypothesis, built from the literature review. It must be testable: your data could show that it is false.\n\nResults that do not support it are as valid as results that do. Explain them.' },

      { type: 'rules', title: 'Rules for a hypothesis', items: [
        'Use the pattern __If … then … because …__, with both variables in it.',
        'The reason is biology: kinetic energy, collisions, the active site, denaturation. Never “heat speeds things up”.',
        'Enzymes are not alive. They are __denatured__; they do not “die”.',
        'A hypothesis is never “proved”. The data __support__ it, or do __not support__ it.',
        { t: 'In the conclusion, answer the research question with processed data. A sentence on the hypothesis may follow.', lv: 'ie' }
      ] },

      { type: 'frames', title: 'Sentence frames for a hypothesis', items: [
        'If ___ is increased from ___ to ___, then ___ will ___, because ___.',
        'Above ___, ___ will ___, because ___.'
      ] },
      { type: 'frames', lv: 'ie', title: 'More sentence frames for IB', items: [
        'The predicted optimum of about ___ comes from ___.',
        'The hypothesis was supported / not supported, because ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this hypothesis. Five phrases need the red pen.',
        body: '[!tf-a:I predict that] if [!tf-b:it gets hotter], [!tf-c:the reaction will get faster] [!tf-d:because heat speeds things up].\n\n[!tf-e:At high temperatures the enzyme dies.]',
        notes: {
          'tf-a': { label: 'no “I”', why: 'Write it impersonally: “If the temperature is increased…”.' },
          'tf-b': { label: 'which variable?', why: 'Name the independent variable and its range: __if the temperature is increased from 20 °C to 60 °C__.' },
          'tf-c': { label: 'shape?', why: 'Only a direction, and “the reaction” is not measured. Predict the shape of what is measured: the time will fall to a minimum, then rise.' },
          'tf-d': { label: 'no biology', why: 'Give the biological reason: molecules gain kinetic energy, collide more often, and form more enzyme–substrate complexes per second.' },
          'tf-e': { label: 'enzymes don’t die', why: 'Enzymes are not alive. Above the optimum, bonds in the tertiary structure break, the active site changes shape, and the enzyme is __denatured__.' }
        },
        fixed: '==If the temperature is increased from 20 °C to 60 °C==, ==then the time taken for the starch to be digested will decrease to a minimum at the optimum, then increase==, ==because enzyme and substrate molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form per second==. ==Above the optimum, the active site changes shape, the substrate no longer fits, and the enzyme is denatured.==',
        fixedNote: 'It is impersonal, names both variables, predicts a shape, and gives the biology for each part of the curve.'
      },
      i: {
        title: 'An IA hypothesis and the conclusion line that answers it. Four phrases need the red pen.',
        body: 'Hypothesis: if the temperature is increased from 20.0 to 60.0 °C, the rate of hydrolysis by fungal α-amylase will increase [!tf-a:up to an optimum at 37 °C], then [!tf-b:decrease because the enzyme stops working]. [!tf-c:Sketch graph: see Figure 1, the mean rates plotted against temperature.]\n\nConclusion: [!tf-d:The hypothesis was correct.]',
        notes: {
          'tf-a': { label: 'which amylase?', why: '37 °C is the value for __human__ salivary amylase. For α-amylase from *Aspergillus oryzae*, predict near 55 °C, and give the source (Raviyan et al. 5464).' },
          'tf-b': { label: 'why?', why: 'Give the mechanism: hydrogen and ionic bonds in the tertiary structure break, the active site changes shape, and the enzyme is denatured.' },
          'tf-c': { label: 'not a sketch', why: 'A sketch graph is drawn __before__ the data, with labelled but unscaled axes. A graph of the results is not a prediction.' },
          'tf-d': { label: 'the RQ? “correct”?', why: 'Answer the research question with data: the rate was highest at 50.0 °C (18.5 × 10⁻³ s⁻¹). A sentence on the hypothesis may follow: the hypothesis was __supported__.' }
        },
        fixed: 'Hypothesis: if the temperature is increased from 20.0 to 60.0 °C, the rate of hydrolysis by fungal α-amylase will increase ==to a maximum near 55 °C (Raviyan et al. 5464)==, then ==fall steeply, because hydrogen and ionic bonds in the tertiary structure break, the active site changes shape and the enzyme is denatured==. ==A sketch graph with labelled, unscaled axes shows the predicted shape.==\n\nConclusion: ==The mean rate was highest at 50.0 °C (18.5 × 10⁻³ s⁻¹).== The hypothesis was ==supported==.',
        fixedNote: 'The prediction fits the enzyme that was used. The sketch comes before the data. The conclusion answers the research question with data, and says whether the hypothesis was supported.'
      }
    },

    traps: [
      { bad: '…because heat speeds things up.', good: '…because molecules gain kinetic energy and collide more often.' },
      { bad: 'The rate will increase with temperature.', good: 'The rate will increase to an optimum, then fall.' },
      { bad: 'The enzyme dies above 50 °C.', good: 'The enzyme is __denatured__: the active site changes shape.' },
      { bad: 'The hypothesis was proved.', good: 'The data __supported__ the hypothesis.' },
      { bad: 'The optimum will be 37 °C. (for a fungal enzyme)', good: 'Near 55 °C: the published value for α-amylase from *Aspergillus oryzae*.', lv: 'ie' },
      { bad: 'A conclusion that judges the hypothesis but never answers the research question.', good: 'The research question answered with processed data. A sentence on the hypothesis may follow.', lv: 'ie' }
    ],

    test: [
      { type: 'choose', q: 'Which hypothesis has the “If … then … because …” structure and a biological reason?',
        opts: [
          { t: 'If light intensity is increased, then the rate of photosynthesis will increase to a plateau, because chlorophyll absorbs more light energy until another factor limits the rate.', ok: true, why: 'Both variables, a predicted shape, and the biology behind it.' },
          { t: 'Plants grow faster in bright light than in dim light, because light gives them more energy, so the plants kept in the brightest light will grow the tallest.', why: 'No “If … then …” structure, and the reason is vague: name the process, such as light energy absorbed by chlorophyll for photosynthesis.' },
          { t: 'If the light intensity is increased, then the plant will photosynthesise faster and faster, because plants like bright light and they grow bigger and healthier when they receive more of it.', why: 'Plants do not “like” anything. Name the process: light energy is absorbed by chlorophyll. And the rate does not keep rising: it reaches a plateau.' },
          { t: 'The rate of photosynthesis depends on the light intensity, and this investigation will measure the rate of oxygen release at several different light intensities to test how they are related.', why: 'A statement of the aim, with no prediction and no biological reason.' }
        ] },
      { type: 'sort', q: 'What shape would you predict? Sort each one.',
        bins: ['Straight line', 'Rises to a plateau', 'Peaks at an optimum'],
        items: [
          { t: 'Rate of catalase activity as catalase concentration increases, with plenty of substrate', bin: 0, why: 'More enzyme, more active sites: the rate rises in proportion.' },
          { t: 'Rate of catalase activity as hydrogen peroxide concentration increases', bin: 1, why: 'Once every active site is occupied, more substrate cannot raise the rate.' },
          { t: 'Rate of amylase activity as temperature increases from 20 to 60 °C', bin: 2, why: 'The rate rises, then falls as the enzyme is denatured.' },
          { t: 'Rate of photosynthesis as light intensity increases', bin: 1, why: 'Another factor, such as carbon dioxide concentration, becomes limiting.' },
          { t: 'Rate of amylase activity as pH increases from 4 to 9', bin: 2, why: 'Each enzyme has an optimum pH; on either side, the active site changes shape.' }
        ] },
      { type: 'choose', q: 'Which prediction does this sketch graph show?',
        show: { plot: sketch('Substrate concentration', 'Rate of reaction', PLATEAU, 'smooth', null, { w: 320, h: 220, pad: { l: 30, r: 12, t: 12, b: 34 } }) },
        opts: [
          { t: 'The rate rises, then reaches a plateau.', ok: true, why: 'Steep at first, then flat: once every active site is occupied, more substrate cannot raise the rate.' },
          { t: 'The rate rises to an optimum, then falls.', why: 'That would be an optimum curve. This one never falls.' },
          { t: 'The substrate concentration has no effect.', why: 'No effect would be a flat line from the start.' },
          { t: 'The rate falls steadily as concentration rises.', why: 'The line rises from left to right.' }
        ] },
      { type: 'spot', q: 'Tap the two phrases a teacher would correct.',
        text: 'If the temperature is increased from 20 °C to 60 °C, [?:the time for the starch to be digested will decrease to a minimum], because [!a:the enzyme gets more energy and works harder]. Above the optimum, [!b:the enzyme dies].',
        why: { a: 'Name the process: molecules gain kinetic energy, collide more often, and form more enzyme–substrate complexes per second.', b: 'Enzymes are not alive, so they cannot die. Above the optimum, the active site changes shape, and the enzyme is denatured.' } },
      { type: 'build', q: 'Build the reason for the fall above the optimum.',
        chips: ['Above the optimum,', 'hydrogen and ionic bonds in the tertiary structure break,', 'the active site changes shape,', 'so the substrate no longer fits.', 'the enzyme dies,', 'the enzyme molecules move too fast to bind,'],
        answer: ['Above the optimum,', 'hydrogen and ionic bonds in the tertiary structure break,', 'the active site changes shape,', 'so the substrate no longer fits.'],
        why: 'Cause, then effect: bonds break, the shape changes, the substrate no longer fits. Faster movement gives more collisions; the fall comes from the change in shape.' },
      { type: 'order', q: 'Put the explanation of the amylase curve in order.',
        items: ['The temperature increases.', 'Molecules gain kinetic energy.', 'Enzyme and substrate collide more often.', 'More enzyme–substrate complexes form per second.', 'Above the optimum, bonds in the tertiary structure break.', 'The active site changes shape, and the enzyme is denatured.'],
        why: 'The first four explain why the rate increases below the optimum; the last two explain why it falls above it.' },
      { type: 'choose', lv: 'g', q: 'Does a Cambridge IGCSE Paper 6 planning question give marks for a prediction?',
        opts: [
          { t: 'No. Plans are not credited for predictions, but a written lab report should still include one.', ok: true, why: 'Mark schemes credit variables, method, controls, repeats and safety.' },
          { t: 'Yes. Two marks are given: one for the prediction and one for a reason that uses biology.', why: 'Recent mark schemes give no marks for a prediction in a plan, with or without a reason.' },
          { t: 'No, unless the prediction includes a sketch graph that shows the shape of the results that are expected.', why: 'Plans are not credited for predictions, and sketch graphs are not credited either.' },
          { t: 'Yes, if the prediction is written with the “If … then … because …” structure, which is what earns the mark.', why: 'The structure is good practice in a report, but plans are not credited for predictions.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'At IB, what must the conclusion do with the research question and the hypothesis?',
        opts: [
          { t: 'Answer the research question with processed data. A sentence on whether the hypothesis was supported may follow.', ok: true, why: 'The Conclusion criterion assesses how well the report answers the research question.' },
          { t: 'Judge the hypothesis with processed data. A sentence that answers the research question is not needed.', why: 'The research question must be answered, with processed data. The sentence on the hypothesis is optional.' },
          { t: 'Remove the hypothesis, as the IB does not allow one. Describe the raw data in the results table.', why: '“Evaluate hypotheses” is an IB skill, so a sentence on it is allowed. The answer needs processed data, not raw data.' },
          { t: 'Repeat each mean from the results table. Then say whether each mean supports the hypothesis.', why: 'A list of means is not an answer. Use the processed data to state the trend and answer the research question; a sentence on the hypothesis may follow.' }
        ] },
      { type: 'multi', lv: 'ie', q: 'Which are features of a sketch graph?',
        opts: [
          { t: 'Labelled axes', ok: true },
          { t: 'No scale on the axes', ok: true },
          { t: 'It shows the predicted shape', ok: true },
          { t: 'Data points with error bars', why: 'Those belong on the graph of the results.' },
          { t: 'A line of best fit through the results', why: 'A sketch is drawn before there are any results.' }
        ],
        why: 'Tool 3: “sketch graphs, with labelled but unscaled axes, to qualitatively describe trends”.' },
      { type: 'choose', lv: 'e', q: 'An EE’s results did not support its hypothesis. What does this mean?',
        opts: [
          { t: 'The result is still valid. Explain why the data differ from the prediction.', ok: true, why: 'Negative results are as valid as positive ones.' },
          { t: 'The essay fails. A hypothesis that is not supported earns no marks.', why: 'An unsupported hypothesis, well explained, is not a failure. No criterion rewards a hypothesis for being supported.' },
          { t: 'The hypothesis was wrong. Change it so that it matches the data.', why: 'Changing the hypothesis afterwards hides what happened. Keep it, and discuss the result.' },
          { t: 'The data are wrong. Remove them from the essay, and use published values instead.', why: 'The data are not wrong because they disagree. Removing them would be dishonest, and the essay would lose its evidence.' }
        ] }
    ],

    words: [
      { term: 'hypothesis', forms: ['hypotheses'], def: 'A testable explanation that predicts what will happen, with a scientific reason.', eg: 'If the temperature rises to the optimum, the rate will increase, because collisions become more frequent.' },
      { term: 'prediction', forms: ['predictions', 'predict', 'predicted'], def: 'What is expected to happen to the dependent variable, including the shape of the graph.', eg: 'The time will fall to a minimum at the optimum, then rise.' },
      { term: 'sketch graph', forms: ['sketch graphs'], def: 'A graph with labelled but unscaled axes that shows the predicted shape of a relationship.', eg: 'Rate against temperature: a rise to a peak, then a steep fall.' },
      { term: 'optimum', forms: ['optima', 'optimum temperature', 'optimum pH'], def: 'The value of a factor, such as temperature or pH, at which the rate is highest.', eg: '55 °C for α-amylase from *Aspergillus oryzae* (Raviyan et al. 5464).' }
    ],

    further: [
      { title: 'Beyond denaturation: an inactive form', lv: 'ie',
        md: 'In the simple model, activity above the optimum falls only because the enzyme denatures. Daniel and Danson proposed a refinement: as temperature rises, enzyme molecules switch quickly and reversibly to an inactive form, before they denature.\n\nThe model fits measured data well. In an IA, explain the fall with denaturation; this refinement is beyond the syllabus.',
        cite: 'Daniel, Roy M., and Michael J. Danson. “A New Understanding of How Temperature Affects the Catalytic Activity of Enzymes.” *Trends in Biochemical Sciences*, vol. 35, no. 10, 2010, pp. 584–591.' }
    ],

    sources: ['IB Biology guide (2025), skills pp. 30–33 (Tool 3; Inquiry 1 and 3)', 'IB Biology guide (2025), C1.1.7–C1.1.8', 'Cambridge 0610 syllabus 2026–2028, p. 51; Paper 6 examiner reports', 'IB Extended essay guide (first assessment 2027)']
  });
})(window.WUL);
