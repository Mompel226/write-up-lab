/* station: evaluation — errors from the method, their impact, and matched improvements.
   Corrections respected (BRIEF.md): a ± 2 °C fluctuation is RANDOM; a constant offset is systematic;
   extensions earn nothing in the 2025 IA; the top IA band asks for RELATIVE impact (rank the weaknesses).
   Numbers (WUL.data.amylase, IB): SD 8.4 / 8.4 / 5.5 / 5.5 / 8.4 s; sampling interval 10 s > 5.5 s.
   Steepest part of the curve: 178 → 118 s over 10 °C = 6 s per °C, so ± 0.5 °C changes a time by ≤ ± 3 s,
   less than every SD. Means at 40 and 50 °C differ by 20 s = two sampling intervals.
   IGCSE: trials at each temperature differ by ≤ 20 s. */
(function (WUL) {
  'use strict';
  /* the two teaching tables hold sentences, not numbers: left-aligned, in the text font. (No page in tools/check.mjs, hence try.) */
  try {
    WUL.css('evaluation-station', 'table.dt.wd-evaluation-prose{font:400 .88rem/1.4 var(--sans)}' +
      'table.dt.wd-evaluation-prose th,table.dt.wd-evaluation-prose td{text-align:left;vertical-align:top}' +
      'table.dt.wd-evaluation-prose th{font-weight:600}');
  } catch (e) { /* no document */ }

  WUL.station({
    id: 'evaluation', stage: 'judge', order: 1, title: 'Evaluation', levels: 'gie',
    job: { g: 'Name the errors that came from your method, say what each did to the results, and match each with an improvement.', i: 'Explain the weaknesses and limitations of your method, rank them by impact, and give a realistic improvement for each.', e: 'Judge the strengths and limitations of your method and your sources, and explain each one.' },
    where: { g: 'After the conclusion, at the end of the report.', i: 'After the conclusion. It has its own criterion: Evaluation, 6 marks.', e: 'After the discussion, or inside it. It is marked with the discussion, under criterion D.' },

    ladder: {
      g: ['Say whether there were any [[anomalous results|anomalous result]]', 'Name each [[random error]] and [[systematic error]] that came from the method', 'Match each error with an [[improvement]]: what, how and where'],
      i: ['Explain what each [[weakness]] and [[limitation]] did to the data', 'Rank them: the [[relative impact]]', 'Realistic improvements, matched to the weaknesses. [[Extensions|extension]] earn nothing'],
      e: ['[[Evaluate|evaluation]] the method __and__ the sources', 'Strengths as well as limitations, each one explained']
    },

    build: [
      { type: 'table', lv: 'g', title: 'Name the errors in the method',
        spec: {
          caption: 'Each error is a step in the method', cls: 'wd-evaluation-prose',
          head: [['Error in the method', 'Random or systematic?', 'What it did', 'Improvement: what, how, where']],
          rows: [
            ['The end point was judged by eye', 'Random', 'Times scattered: lower precision', 'Compare each drop with a drop of iodine in water, on the same white tile'],
            ['The drops of mixture were different sizes', 'Random', 'The colour was harder to judge the same way each time', 'Transfer the same volume of mixture each time with a syringe'],
            ['The water-bath temperature fluctuated by ± 2 °C', '==Random==', 'Times scattered: lower precision', 'Use a thermostatically controlled bath; check it with a thermometer'],
            ['The bath dial read 2 °C high', 'Systematic', 'Every tube was 2 °C cooler than recorded: lower accuracy', 'Read a thermometer in the tube, not the dial'],
            ['✘ “Human error”', '—', 'Names no step', 'Never credited: name the step instead']
          ]
        },
        after: 'A fluctuation, higher then lower, is __random__. Only a constant offset, the same every time, is __systematic__.' },

      { type: 'anatomy', lv: 'g', title: 'A model evaluation',
        intro: 'Each error is matched with its own improvement. Tap a colour to see each part.',
        model: '{1:No anomalous results were identified: at each temperature, the three times differed by no more than 20 s.} {2:The end point was judged by eye, and the fading blue-black colour was hard to judge in the same way each time. This random error reduced the precision of the times.} {4:It could be reduced by comparing each drop with a drop of iodine in water on the same white tile.}\n\n{3:The water-bath dial read 2 °C higher than a thermometer in the water, so every tube was 2 °C cooler than recorded. This systematic error reduced the accuracy of the temperatures, and repeating the trials would not have revealed it.} {4:The temperature should be read from a thermometer in the tube, not from the dial.} {5:The investigation could be extended by finding the effect of pH on the rate at 50 °C.}',
        parts: [
          { n: 1, name: 'Anomalies', note: 'Name them, or state that there were none.' },
          { n: 2, name: 'A random error, linked to precision', note: 'A step in the method that made the results scatter.' },
          { n: 3, name: 'A systematic error, linked to accuracy', note: 'Something that shifted every result the same way. Repeating does not help.' },
          { n: 4, name: 'The matching improvement', note: 'What to change, how, and where in the method.' },
          { n: 5, name: 'An extension', note: 'A new question to investigate. Fine in a school report; in the IB IA it earns nothing.' }
        ] },

      { type: 'callout', title: 'Three things for every error', label: 'Every error needs three things', md: 'The __step__ that caused it, what it __did__ to the results, and an __improvement__ that matches it.' },

      { type: 'rules', title: 'Random and systematic errors', items: [
        '“Human error” never earns a mark: it names no step. Name __the step__ that caused the error.',
        'A [[random error]] makes results scatter. It reduces [[precision]]. Repeats and a mean reduce its effect.',
        'A [[systematic error]] shifts every result the same way. It reduces [[accuracy]]. Repeating does __not__ help.',
        'A fluctuation (± 2 °C, higher then lower) is random. A constant offset (always 2 °C high) is systematic.',
        '“The stopwatch was not accurate” is rarely the real problem: it reads to 0.01 s. Find the real limit.',
        { t: 'At IB, compare the size of each weakness with the [[standard deviation]] and with the effect you measured.', lv: 'ie' }
      ] },

      { type: 'compare', title: 'Never write “human error”',
        bad: 'Human error made the results inaccurate.',
        good: 'The end point was judged by eye, so the moment the blue-black colour disappeared varied between trials. This random error reduced precision.',
        badLabel: 'Earns nothing', goodLabel: 'Names the step',
        why: 'The first names no step, so nothing can be improved. The second names the step, the type of error and its effect. Cambridge never credits “human error”.' },

      { type: 'anatomy', lv: 'e', title: 'Evaluate the method and sources',
        intro: 'Criterion D asks for strengths as well as limitations. Tap a colour.',
        model: '{1:A strength of the method was that five trials were completed at each temperature, and the SD bars at 40.0, 50.0 and 60.0 °C did not overlap, so the peak near 50.0 °C is well supported.} {2:Its main limitation was the 10 s sampling interval, which was larger than the SD at 40.0 and 50.0 °C, so small differences between these temperatures could not be detected.}\n\n{3:The main published source, Raviyan et al., is a peer-reviewed study of α-amylase from the same species, and it reports its assay conditions in full, so it is a suitable benchmark.} {4:However, it used pH 7.1 and a maltodextrin substrate, and each temperature was assayed only in duplicate, so its value is not a direct measure of the enzyme under the conditions used here.}',
        parts: [
          { n: 1, name: 'A strength of the method', note: 'Explained, with evidence.' },
          { n: 2, name: 'A limitation of the method', note: 'Explained: what it did to the findings.' },
          { n: 3, name: 'A strength of a source', note: 'Why it can be trusted: peer review, the same enzyme, a full method.' },
          { n: 4, name: 'A limitation of a source', note: 'How it differs from this study, and what that means.' }
        ],
        after: 'In IB command terms, *evaluate* means: “Make an appraisal by weighing up the strengths and limitations.”' },

      { type: 'grid2', lv: 'ie', title: 'Weakness or limitation?',
        items: [
          { label: 'Weaknesses: problems in the method', tone: 'i', v: '__Control of variables:__ the bath drifted by ± 0.5 °C.\n\n__Precision of measurement:__ the iodine was sampled only every 10 s.\n\n__Variation in the data:__ SD of up to 8.4 s at 20, 30 and 60 °C.', note: 'The three kinds of weakness named in the IB clarifications.' },
          { label: 'Limitations: how widely the conclusion applies', tone: 'e', v: '__Range of the data:__ 20.0–60.0 °C in 10.0 °C steps, so the optimum lies somewhere between 40.0 and 60.0 °C.\n\n__Confines of the system:__ one batch of *A. oryzae* α-amylase, at pH 6.0.\n\n__Assumptions:__ that each mixture stayed at the bath temperature for the whole reaction.', note: 'The three kinds of limitation named in the IB clarifications.' }
        ] },

      { type: 'table', lv: 'ie', title: 'Rank the weaknesses',
        spec: {
          caption: 'Weaknesses, ranked by impact', cls: 'wd-evaluation-prose',
          head: [['Weakness, largest first', 'What it did to the data', 'Random or systematic?', 'Size compared with the SD', 'Could it change the conclusion?', 'Improvement']],
          rows: [
            ['==1. Iodine sampled every 10 s==', 'Each time was recorded up to 10 s after the true end point', 'Both: always late (systematic), by 0–10 s, different in each trial (random)', '10 s: larger than the 5.5 s SD at 40.0 and 50.0 °C', 'It limits it: differences under 10 s, as near the optimum, cannot be detected', 'Follow the colour with a colorimeter that reads every second'],
            ['2. Bath dial read 2.0 °C high', 'Every tube was 2.0 °C cooler than recorded', 'Systematic: reduces accuracy', 'Moves the whole curve 2.0 °C, less than the 10.0 °C interval', 'No: the optimum stays between the same two temperatures', 'Check the dial against a calibrated thermometer'],
            ['3. Bath drift of ± 0.5 °C', 'Each time changed by at most ± 3 s', 'Random', '± 3 s: smaller than every SD (5.5–8.4 s)', 'No', 'None needed; record the temperature of each tube'],
            ['A limitation: one batch of amylase', 'Nothing measurable', 'A limitation, not an error', 'Unknown: only one batch was tested', 'It limits the scope: the answer applies to this batch', 'Repeat with a second batch: a [[true replicate]]']
          ],
          note: 'Where ± 3 s comes from: between 20.0 and 30.0 °C, the mean time changed by 60 s in 10 °C, so 6 s per °C. Half a degree changes it by 3 s.'
        },
        after: 'Rank each weakness with three questions. How large is it, compared with the SD and the effect? In which direction does it move the data? Could it change the conclusion?' },

      { type: 'anatomy', lv: 'ie', title: 'A model IA evaluation',
        intro: 'The largest weakness first, explained in full; the smaller ones briefly. Tap a colour.',
        model: '{1:The largest weakness was the 10 s sampling interval: each time was recorded up to 10 s after the true end point.} {2:This is larger than the SD at 40.0 and 50.0 °C (5.5 s), so the spread at these temperatures mostly reflects the sampling, not the enzyme.} {3:Differences near the optimum, for example between 45 and 50 °C, are likely to be smaller than 10 s and could not be detected, so this weakness limits how precisely the optimum can be located.} {4:Following the colour with a colorimeter, which gives a reading every second, would reduce this uncertainty to about 1 s.}\n\n{5:The other weaknesses had a smaller impact. The dial read 2.0 °C high, a systematic error that made every temperature 2.0 °C lower than recorded; this is less than the 10.0 °C interval, so the answer stands. The bath drifted by ± 0.5 °C, a random error that changed each time by at most ± 3 s, less than every SD.}\n\n{6:Only one batch of amylase was tested, so the conclusion applies to this preparation; a second batch would show whether it can be generalised.}',
        parts: [
          { n: 1, name: 'The largest weakness, named', note: 'Specific to this method. Never generic.' },
          { n: 2, name: 'Its size, compared with the SD', note: 'This is what makes the impact “relative”.' },
          { n: 3, name: 'What it does to the conclusion', note: 'Could it change the answer, or limit it?' },
          { n: 4, name: 'A realistic, matched improvement', note: 'Explained: how it reduces this weakness.' },
          { n: 5, name: 'Smaller weaknesses, ranked below', note: 'Random or systematic, and why each matters less.' },
          { n: 6, name: 'A limitation of scope', note: 'How widely the conclusion applies.' }
        ] },

      { type: 'note', tone: 'ib', lv: 'i', title: 'What the IB criterion asks', label: 'What the IB criterion asks',
        md: 'Top band (5–6): the report “explains the relative impact of specific methodological weaknesses or limitations”, and realistic improvements “relevant to the identified weaknesses or limitations” are explained. __Generic__ means “general to many methodologies”: a weakness that could be pasted into any report.\n\nExtensions are not in the 2025 criteria, so they earn nothing.' },

      { type: 'frames', lv: 'g', title: 'Sentences for your evaluation', items: [
        'No anomalous results were identified: ___.',
        '___ was a random error, because ___. It reduced the precision of ___.',
        '___ was a systematic error, because every ___ was ___. It reduced the accuracy of ___, and repeating would not have helped.',
        'This could be improved by ___ (what), using ___ (how), at step ___ (where).',
        'The investigation could be extended by ___.'
      ] },
      { type: 'frames', lv: 'i', title: 'Sentences for an IA evaluation', items: [
        'The largest source of uncertainty was ___, because ___ was larger than ___.',
        'This could change the conclusion, because ___.',
        '___ had a smaller impact: it changed ___ by at most ___, less than the SD.',
        'The conclusion is limited to ___, because only ___ was tested.',
        'This could be reduced by ___, which would ___.'
      ] },
      { type: 'frames', lv: 'e', title: 'Sentences for an EE evaluation', items: [
        'A strength of the method was ___, because ___.',
        'The main limitation was ___, which meant that ___.',
        'The largest source of uncertainty was ___, because ___ was larger than ___.',
        '___ is a suitable source because ___; however, ___.'
      ] }
    ],

    redpen: {
      g: {
        title: 'A student wrote this. Five phrases would lose marks.',
        body: '[!a:There were no strange results.]\n\n[!b:The results were accurate.]\n\n[!c:One error was human error.]\n\n[!d:The timer was not very accurate.]\n\nTo improve it:\n\n[!e:more repeats, better equipment.]',
        notes: {
          a: { label: 'anomalous?', why: 'Use the exact term, and give the evidence: no anomalous results were identified, because the trials differed by no more than 20 s.' },
          b: { label: 'accurate?', why: 'Repeats that agree show precision, not accuracy. Accuracy needs a true value to compare with.' },
          c: { label: 'human error?', why: 'Never credited. Name the step: the end point was judged by eye.' },
          d: { label: 'the real limit?', why: 'The stopwatch reads to 0.01 s. The real limit was that iodine was tested only every 10 s.' },
          e: { label: 'what? how? where?', why: 'Match each improvement to one error: compare each drop with a drop of iodine in water; test every 5 s instead of every 10 s.' }
        },
        fixed: '==No anomalous results== were identified: the three trials at each temperature differed by no more than 20 s. The ==end point was judged by eye==, a random error that reduced the ==precision== of the times; comparing each drop with ==a drop of iodine in water== on the same white tile would reduce it. Iodine was tested ==only every 10 s==, so each time could be up to 10 s too long; ==testing every 5 s== would halve this.',
        fixedNote: 'Every error is now a step in the method, with its effect and its own improvement.'
      },
      i: {
        title: 'An IA evaluation. Six phrases would keep it in the bottom band.',
        body: 'Limitations:\n\n[!a:Small sample size.]\n\n[!b:Human error.]\n\n[!c:Not enough time.]\n\n[!d:The equipment was not precise.]\n\n[!e:These made the results unreliable.]\n\nIn future:\n\n[!f:investigate the effect of pH.]',
        notes: {
          a: { label: 'specific?', why: 'Five trials is not small here. Say what the data show: SDs of 5.5–8.4 s. A weakness must be specific to this method.' },
          b: { label: 'human error?', why: 'Name the step: the iodine was sampled only every 10 s.' },
          c: { label: 'generic', why: 'It could be pasted into any report. “Generic” weaknesses are the 1–2 band.' },
          d: { label: 'which? how much?', why: 'Name it and compare its size with the SD: the 10 s sampling interval is larger than the 5.5 s SD at 40.0 and 50.0 °C.' },
          e: { label: 'rank them', why: 'Say which weakness mattered most, and whether it could change the conclusion. That is the relative impact.' },
          f: { label: 'extension', why: 'Extensions earn nothing in the 2025 criteria. Use the words for improvements to this method.' }
        },
        fixed: 'The ==largest weakness was the 10 s sampling interval==: it is larger than the SD at 40.0 and 50.0 °C (5.5 s), so it limits how precisely the optimum can be located. A ==colorimeter reading every second== would reduce it to about 1 s. The ==bath drift of ± 0.5 °C had a smaller impact==: it changed each time by at most ± 3 s, less than every SD. ==Only one batch of amylase== was used, so the conclusion applies to this preparation only.',
        fixedNote: 'Each weakness is now specific, its size is compared with the SD, and the weaknesses are ranked.'
      },
      e: {
        title: 'An EE evaluation. Four phrases would lose marks.',
        body: '[!a:The method was good.]\n\n[!b:There were some errors.]\n\n[!c:The websites were reliable.]\n\n[!d:More repeats should be done.]',
        notes: {
          a: { label: 'why?', why: 'Explain the strength: five trials at each temperature, and SD bars around the peak that do not overlap.' },
          b: { label: 'which? effect?', why: 'Name the limitation and explain its effect: the 10 s sampling interval hid small differences near the optimum.' },
          c: { label: 'why reliable?', why: '“Reliable” needs a reason, and “websites” names no source. Say what makes a source strong (peer review, the same enzyme) and where it differs (pH 7.1).' },
          d: { label: 'how many? why?', why: 'Give a number and a reason, linked to a named limitation. More repeats would not fix a 10 s sampling interval.' }
        },
        fixed: 'A ==strength of the method== was that five trials were completed at each temperature, and the SD bars around the peak did not overlap. Its ==main limitation== was the 10 s sampling interval, which hid small differences near the optimum. The main source, Raviyan et al., is a ==peer-reviewed study of the same species’ α-amylase==, but it ==used pH 7.1==, so its value is not a direct measure under these conditions.',
        fixedNote: 'Strengths and limitations of both the method and the source are now named and explained.'
      }
    },

    traps: [
      { bad: 'Human error.', good: 'The end point was judged by eye: a random error that reduced precision.' },
      { bad: 'The water bath fluctuated by ± 2 °C: a systematic error.', good: 'A fluctuation is random. Only a constant offset is systematic.' },
      { bad: 'Repeat the experiment to make it more accurate.', good: 'Repeats cannot fix a systematic error. To improve accuracy, check the dial against a thermometer.' },
      { bad: 'Use better equipment.', good: 'Use a colorimeter that reads every second, instead of sampling every 10 s.' },
      { bad: 'Limitations: small sample, time, human error.', good: 'Rank specific weaknesses by their impact on the conclusion.', lv: 'ie' },
      { bad: 'The effect of pH could be investigated next.', good: 'In the IA, extensions earn nothing. Improve the method you used.', lv: 'i' }
    ],

    test: [
      { type: 'sort', q: 'Is each error random or systematic?',
        bins: ['Random error', 'Systematic error'],
        items: [
          { t: 'The end point of the iodine test was judged by eye.', bin: 0, why: 'It varies from trial to trial, so the results scatter.' },
          { t: 'The water-bath dial read 2 °C high all the time.', bin: 1, why: 'A constant offset shifts every result the same way.' },
          { t: 'The water-bath temperature fluctuated by ± 2 °C.', bin: 0, why: 'A fluctuation, higher then lower, is random, not systematic.' },
          { t: 'The balance showed 0.2 g with nothing on it.', bin: 1, why: 'A zero error adds the same 0.2 g to every mass.' },
          { t: 'The drops of iodine were different sizes.', bin: 0, why: 'The size varies unpredictably from drop to drop.' },
          { t: 'The thermometer always read 1.5 °C low.', bin: 1, why: 'The same error, in the same direction, every time.' }
        ] },
      { type: 'choose', q: 'Which source of error would a Cambridge examiner credit?',
        opts: [
          { t: 'The end point of the iodine test was judged by eye.', ok: true, why: 'It names a step in the method that causes an error.' },
          { t: 'Human error.', why: 'Never credited: it names no step.' },
          { t: 'The stopwatch was not accurate.', why: 'A stopwatch reads to 0.01 s. That is not the real limit here.' },
          { t: 'Some mistakes were made.', why: 'It names nothing, so it cannot be improved.' }
        ] },
      { type: 'spot', q: 'Tap the two phrases that would lose marks.',
        text: '[!a:Human error] made the times vary. [?:The water-bath dial read 2 °C high, so every temperature was lower than recorded.] [!b:Repeating the experiment would fix this.] [?:The end point was judged by eye, which reduced precision.]',
        why: { a: 'It names no step. Name the step that caused the error.', b: 'Repeating does not remove a systematic error: every repeat is 2 °C out. Check the dial against a thermometer.' } },
      { type: 'build', q: 'Build an improvement that matches its error.',
        chips: ['To reduce the uncertainty from sampling every 10 s,', 'the drops should be tested', 'every 5 s', 'instead of every 10 s.', 'use better equipment.', 'be more careful.'],
        answer: ['To reduce the uncertainty from sampling every 10 s,', 'the drops should be tested', 'every 5 s', 'instead of every 10 s.'],
        why: 'It names the error, and says what to change and how.' },
      { type: 'choose', q: 'Why does repeating not help with a systematic error?',
        opts: [
          { t: 'Every repeat is shifted equally, in the same direction, so the mean is shifted too.', ok: true, why: 'The errors do not cancel: they all push the same way.' },
          { t: 'Repeats take too long.', why: 'Time is not the reason. The errors do not cancel.' },
          { t: 'Random errors are always bigger.', why: 'Not always, and that is not why repeats fail here.' },
          { t: 'It does help: the mean cancels it.', why: 'A mean cancels random scatter, not a shift in one direction.' }
        ] },
      { type: 'multi', q: 'The water-bath temperature fluctuated between 48 and 52 °C, while the dial read 50 °C. Which statements are true?',
        opts: [
          { t: 'This is a random error.', ok: true, why: 'The temperature was sometimes higher and sometimes lower, not always one way.' },
          { t: 'It reduces precision.', ok: true, why: 'It makes the times scatter.' },
          { t: 'Repeats and a mean reduce its effect.', ok: true, why: 'Highs and lows partly cancel.' },
          { t: 'It is a systematic error.', why: 'A fluctuation is random. Only a constant offset is systematic.' },
          { t: 'It shifts every result the same way.', why: 'It makes some results higher and some lower.' }
        ],
        why: 'A fluctuation is random: it reduces precision, and repeats help.' },
      { type: 'order', lv: 'ie', q: 'Rank these weaknesses of the amylase IA, from the largest impact on the conclusion to the smallest.',
        items: [
          'Iodine sampled every 10 s (10 s: larger than the 5.5 s SD)',
          'Bath dial reading 2.0 °C high (every temperature 2.0 °C lower than recorded)',
          'Bath drift of ± 0.5 °C (at most ± 3 s: smaller than every SD)',
          'Stopwatch resolution of 0.01 s (far smaller than every SD)'
        ],
        why: 'The sampling step is larger than the spread it measures, so it limits what can be said near the optimum. The dial moves every temperature by 2.0 °C, less than the 10.0 °C interval. The drift and the stopwatch change times far less than the SD.' },
      { type: 'choose', lv: 'ie', q: 'Which of these is a limitation, not a weakness?',
        opts: [
          { t: 'Only one batch of amylase was tested, so the conclusion applies to that batch.', ok: true, why: 'It limits how widely the conclusion applies: the confines of the system.' },
          { t: 'The bath drifted by ± 0.5 °C.', why: 'A weakness in the control of variables.' },
          { t: 'The iodine was sampled every 10 s.', why: 'A weakness in the precision of measurement.' },
          { t: 'The SD at 60.0 °C was 8.4 s.', why: 'A weakness: variation in the data.' }
        ] },
      { type: 'choose', lv: 'ie', q: 'Which improvement earns credit in the IA?',
        opts: [
          { t: 'Follow the colour with a colorimeter that reads every second, to reduce the largest uncertainty: the 10 s sampling interval.', ok: true, why: 'Realistic, specific, and matched to the weakness that mattered most.' },
          { t: 'Investigate the effect of pH next.', why: 'An extension: it earns nothing in the 2025 criteria.' },
          { t: 'Use a better laboratory.', why: 'Not realistic, and not linked to any weakness.' },
          { t: 'Repeat the experiment more times.', why: 'No number and no weakness: repeats would not fix the 10 s sampling interval.' }
        ] },
      { type: 'multi', lv: 'e', q: 'In an Extended Essay, what should the evaluation cover?',
        opts: [
          { t: 'Strengths of the method, explained', ok: true },
          { t: 'Limitations of the method, explained', ok: true },
          { t: 'Strengths and limitations of the sources', ok: true },
          { t: 'A list of weaknesses with no explanation', why: 'Criterion D asks for evaluation that is explained.' },
          { t: 'Only the sources that agree with the results', why: 'That is not balanced.' }
        ],
        why: 'Criterion D: the method and the sources, strengths as well as limitations.' }
    ],

    words: [
      { term: 'evaluation', forms: ['evaluate', 'evaluations', 'evaluating'], def: 'Judging how far the results can be trusted, by weighing the strengths and weaknesses of the method.', eg: 'The largest weakness was the 10 s sampling interval.' },
      { term: 'weakness', forms: ['weaknesses'], def: 'A problem in the method: in the control of variables, the precision of measurement, or the variation in the data.', eg: 'The iodine was sampled only every 10 s.' },
      { term: 'limitation', forms: ['limitations'], def: 'A limit on how widely the conclusion applies: the range of the data, the system, or the assumptions.', eg: 'One batch of amylase, tested from 20 to 60 °C.' },
      { term: 'improvement', forms: ['improvements'], def: 'A realistic change to the method that reduces a named weakness.', eg: 'A colorimeter that reads every second, instead of sampling every 10 s.' },
      { term: 'relative impact', forms: [], lv: 'ie', def: 'How much each weakness affects the conclusion, compared with the others.', eg: 'The 10 s sampling interval mattered more than the ± 0.5 °C drift.' },
      { term: 'extension', forms: ['extensions'], def: 'A new investigation suggested by the results, such as testing another variable.', eg: 'The effect of pH on the rate at 50 °C.' }
    ],

    sources: ['IB Biology guide (2025), Evaluation criterion and clarifications, pp. 122–123', 'IB Biology guide (2025), Inquiry 3 skills, p. 33; command terms, p. 125', 'Cambridge 0610 examiner reports 61/O/N/22, 62/O/N/23, 52/O/N/24 (“human error”; errors inherent in the method)', 'IB Extended essay guide (first assessment 2027), criterion D']
  });
})(window.WUL);
