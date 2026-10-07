/* station: method — numbered steps, past tense, passive voice, detailed enough to repeat. */
WUL.station({
  id: 'method', keepV: { v: '1filylx', now: '7qhva6', on: '2026-10-07', why: 'the options rewritten so the right one is not the longest (7 Oct 2026)' }, stage: 'plan', order: 7, title: 'Method', levels: 'gie',
  job: 'Write the steps so that someone else could repeat the investigation exactly.',
  where: { g: 'After the apparatus and the risk assessment.', i: 'In the methodology, after the variables and safety.', e: 'In the methodology section, with a reason for each choice.' },

  ladder: {
    g: ['Numbered steps, in the past tense and the [[passive voice]]', 'A quantity and an apparatus size in every step', 'The [[equilibration]] step, the number of repeats, and what was done with the data'],
    i: ['Specific materials and precise steps, so that it “could in principle” be repeated', 'No unnecessary or repeated detail', 'A [[pilot run]] to choose the range, the timing and the number of repeats'],
    e: ['Justify the method, and say why other methods were rejected', 'No IA content duplicated: a substantially different angle and focus']
  },

  build: [
    { type: 'anatomy', lv: 'g', title: 'The parts of a method',
      intro: 'The amylase method. Tap a colour to see each part.',
      model: '1. {1:5.0 cm³ of 1.0 % starch solution and 2.0 cm³ of pH 6.0 buffer} were measured into a test tube {2:with a 10 cm³ graduated pipette}.\n2. {1:2.0 cm³ of 1.0 % amylase solution} was measured into a second tube.\n3. {3:Both tubes were placed in a thermostatically controlled water bath at 20 °C for 5 minutes, so that they reached the test temperature.}\n4. {1:One drop of iodine solution} was placed in each well of {2:two spotting tiles}.\n5. {4:The amylase was poured into the starch, the tube was swirled to mix, and a stopwatch was started. The tube stayed in the water bath.}\n6. {4:Every 10 s, one drop of the mixture was transferred to a new well with a dropping pipette.}\n7. {4:The time was recorded for the first drop that did not turn the iodine blue-black.}\n8. {5:Steps 1–7 were performed three times at each of 20, 30, 40, 50 and 60 °C, and a mean time was calculated for each temperature.}',
      parts: [
        { n: 1, name: 'Materials, with quantities', note: 'The volume and the concentration of every solution.' },
        { n: 2, name: 'Apparatus, with its size', note: '“A 10 cm³ graduated pipette”, not “a pipette”.' },
        { n: 3, name: 'Equilibration', note: 'Time for everything to reach the test temperature before timing starts.' },
        { n: 4, name: 'How the dependent variable was measured', note: 'What was done, how often, and when the clock stopped.' },
        { n: 5, name: 'Repeats, and what was done with the data', note: 'A number of repeats, the values of the independent variable, and a mean.' }
      ] },

    { type: 'anatomy', lv: 'ie', title: 'The parts of an IB method',
      intro: 'The same experiment, with the detail that another person needs to repeat it. Tap a colour to see each part.',
      model: '1. {6:A pilot run at 20 °C and 50 °C gave times between about 50 s and 180 s, so drops were sampled every 10 s.}\n2. {1:5.00 cm³ of 1.0 % starch solution in pH 6.0 buffer} was pipetted into each of five test tubes {2:with a 10 cm³ graduated pipette (± 0.05 cm³)}.\n3. {1:2.00 cm³ of 1.0 % fungal α-amylase (*Aspergillus oryzae*)} was pipetted into each of five further tubes.\n4. {3:All ten tubes were held in a thermostatically controlled water bath at 20.0 °C for 5 minutes, and the temperature was checked with a thermometer.}\n5. {4:One enzyme tube was poured into one starch tube and the stopwatch was started. Every 10 s, one drop was transferred to iodine solution on a spotting tile, until a drop no longer turned blue-black.}\n6. {5:Step 5 was repeated with the other four pairs of tubes (five trials), then steps 2–5 at 30.0, 40.0, 50.0 and 60.0 °C. An [[anomalous result]] was repeated, and both values were recorded.}',
      parts: [
        { n: 6, name: 'Pilot run', note: 'The reason for the sampling interval, stated where it applies.' },
        { n: 1, name: 'Specific materials', note: 'Volumes to the precision of the pipette, concentrations, and the enzyme’s source.' },
        { n: 2, name: 'Apparatus, with size and uncertainty', note: 'Only where it matters to the step.' },
        { n: 3, name: 'Equilibration, checked', note: 'The temperature is checked, not assumed.' },
        { n: 4, name: 'How the dependent variable was measured', note: 'The sampling interval sets the uncertainty of the time: ± 10 s.' },
        { n: 5, name: 'Repeats and anomalies', note: 'How many trials, and what was done with a result that did not fit.' }
      ] },

    { type: 'callout', title: 'Reach the test temperature first', label: 'Do not miss this step', md: 'Anything living or enzymatic must reach the test temperature __before__ timing starts. That is [[equilibration]]. Without it, the temperature is not what the report says.' },

    { type: 'compare', title: 'Worksheet style or report style',
      badLabel: 'Worksheet style', goodLabel: 'Report style',
      bad: '1. Measure 5 cm³ of starch into a tube.\n2. Put the tube in the water bath.\n3. Add the amylase and start the clock.',
      good: '1. 5.0 cm³ of 1.0 % starch solution was measured into a test tube with a 10 cm³ graduated pipette.\n2. The tube was placed in a thermostatically controlled water bath at 30 °C for 5 minutes.\n3. 2.0 cm³ of 1.0 % amylase at 30 °C was added, and a stopwatch was started.',
      why: 'In a report, the method is in the past tense and the passive. Every quantity has a number and a unit.' },

    { type: 'table', title: 'Change active into passive',
      spec: {
        caption: 'The same step, written two ways',
        head: [['Active: not in a report', 'Passive: in a report']],
        rows: [
          ['I measured 5.0 cm³ of starch solution.', '5.0 cm³ of starch solution ==was measured==.'],
          ['We placed the tubes in a water bath.', 'The tubes ==were placed== in a water bath.'],
          ['I started the stopwatch.', 'The stopwatch ==was started==.'],
          ['We did three trials at each temperature.', 'Three trials ==were carried out== at each temperature.']
        ]
      },
      after: 'The thing that was acted on moves to the front. Use __was__ with one thing and __were__ with more than one.' },

    { type: 'rules', title: 'Rules for a method', items: [
      'Number every step, in the order it was done.',
      'Past tense, [[passive voice]]: “was measured”, not “measure” or “I measured”.',
      'A number and a unit wherever a quantity is used: “5.0 cm³”, not “some”.',
      'The size of each piece of apparatus: “a 10 cm³ graduated pipette”, not “a pipette”.',
      'The number of repeats, and what was done with the data: a mean, and any [[anomalous result]] repeated.',
      { t: 'No unnecessary or repeated detail: do not copy the apparatus list into every step.', lv: 'ie' }
    ] },

    { type: 'note', tone: 'igcse', lv: 'g', label: 'At IGCSE', title: 'What Paper 6 plans credit',
      md: 'In 0610 Paper 6 plan questions from 2021 to 2025, repeats scored only when a __number__ was given: “repeat the experiment” alone did not. A plain “water bath” did not score; a thermostatically controlled one did.\n\nLeaving time for equilibration was credited in about a third of those mark schemes.' },

    { type: 'note', tone: 'ib', lv: 'ie', label: 'What the IB guide asks', title: 'Detail that lets others repeat it',
      md: 'The 5–6 band: the description of the methodology “allows for the investigation to be reproduced”. The guide asks for “specific materials used and precise procedural steps”, but no “unnecessary or repetitive information”. Then the reader “could in principle repeat the investigation” (IB Biology guide, pp. 120–121).' },

    { type: 'note', tone: 'tip', lv: 'ie', label: 'Pilot run', title: 'Do a pilot run',
      md: 'A [[pilot run]] is a short trial before the real experiment. Use it to choose the range, the sampling interval and the number of repeats, and say so in the method. “Pilot methodologies” is an IB skill (Inquiry 1).' },

    { type: 'note', tone: 'ee', lv: 'e', label: 'For the Extended Essay', title: 'Justify an EE method',
      md: 'Justify the method: why this technique, and why the others were rejected. For example, a colorimeter measures the starch–iodine colour as a number. The spot test depends on judging a colour by eye.\n\nNo IA content may be duplicated in the EE: it needs a substantially different angle and focus.' },

    { type: 'frames', title: 'Sentence frames for a method', items: [
      '___ cm³ of ___ was measured into ___ with ___.',
      'The ___ was placed in ___ at ___ °C for ___ minutes, so that it reached the test temperature.',
      'Every ___ s, ___ was ___.',
      'Steps ___ to ___ were performed ___ times at each ___, and a mean was calculated.'
    ] }
  ],

  redpen: {
    g: {
      title: 'A student wrote this method. Five phrases need the red pen.',
      body: '1. [!tf-a:Some starch] was put in a test tube.\n2. [!tf-b:The amylase was added] and the stopwatch was started.\n3. [!tf-c:I tested it with iodine] [!tf-d:every so often] until it changed colour.\n4. [!tf-e:This was done for each temperature.]',
      notes: {
        'tf-a': { label: 'how much?', why: 'Give the volume, the concentration and the apparatus: 5.0 cm³ of 1.0 % starch solution, measured with a 10 cm³ graduated pipette.' },
        'tf-b': { label: 'equilibration?', why: 'A step is missing. The starch and the amylase were placed in the water bath for 5 minutes __before__ they were mixed. This lets them reach the test temperature.' },
        'tf-c': { label: 'passive; test what?', why: 'Past tense, passive, and exact: one drop of the mixture was tested with iodine solution on a spotting tile.' },
        'tf-d': { label: 'how often?', why: 'Give the interval: every 10 s. It also sets the uncertainty of the time: ± 10 s.' },
        'tf-e': { label: 'repeats? values?', why: 'Say which temperatures, and how many repeats: “Steps 1–4 were performed three times at each of 20, 30, 40, 50 and 60 °C, and a mean was calculated.”' }
      },
      fixed: '1. ==5.0 cm³ of 1.0 % starch solution== was measured into a test tube ==with a 10 cm³ graduated pipette==.\n2. ==The starch, and 2.0 cm³ of 1.0 % amylase in a second tube, were placed in a thermostatically controlled water bath at 20 °C for 5 minutes.==\n3. The amylase was added to the starch and the stopwatch was started.\n4. ==Every 10 s, one drop of the mixture was tested with iodine solution== on a spotting tile, until the iodine no longer turned blue-black.\n5. ==Steps 1–4 were performed three times at each of 20, 30, 40, 50 and 60 °C, and a mean time was calculated.==',
      fixedNote: 'Every step now has a quantity, the equilibration step is there, and the repeats have a number.'
    },
    i: {
      title: 'An IA method. Five phrases would stop a reader repeating it.',
      body: '[!tf-a:The solution was heated to the required temperature.] 5 cm³ of starch was pipetted into a tube [!tf-b:using a pipette]. [!tf-c:The amylase used was bought from a supplier.] Every 10 s, a drop was tested with iodine. [!tf-d:A 10 cm³ graduated pipette, a stopwatch, a spotting tile and iodine solution were used in this step.] [!tf-e:Five trials were done.]',
      notes: {
        'tf-a': { label: 'which? how? how long?', why: 'Which solution, what volume, heated how, checked with what, and for how long? Name the water bath, its temperature and the time.' },
        'tf-b': { label: 'which pipette?', why: 'Give the size and the uncertainty: a 10 cm³ graduated pipette (± 0.05 cm³). Then the volume matches it: 5.00 cm³.' },
        'tf-c': { label: 'which enzyme?', why: 'The specific material: 1.0 % fungal α-amylase from *Aspergillus oryzae*. What it is matters, not where it was bought.' },
        'tf-d': { label: 'repetitive', why: 'The apparatus list already says this. The IB asks for a method that avoids unnecessary or repetitive information.' },
        'tf-e': { label: 'at each? why five?', why: 'Five trials at each temperature, and the reason: the pilot run.' }
      },
      fixed: '==5.00 cm³ of 1.0 % starch solution== was pipetted into a test tube ==with a 10 cm³ graduated pipette (± 0.05 cm³)==. ==The starch and 2.00 cm³ of 1.0 % fungal α-amylase (*Aspergillus oryzae*), in separate tubes, were held in a thermostatically controlled water bath at 20.0 °C for 5 minutes.== ==The enzyme was added to the starch and the stopwatch was started.== Every 10 s, one drop of the mixture was transferred to iodine solution on a spotting tile. ==Five trials were carried out at each temperature, as the pilot run suggested.==',
      fixedNote: 'Specific materials, precise steps, and no repetition: a reader could now repeat it.'
    }
  },

  traps: [
    { bad: 'Heat the starch to the right temperature.', good: 'The starch was held at 30 °C in a thermostatically controlled water bath for 5 minutes.' },
    { bad: 'No time for the tubes to reach the test temperature.', good: '…placed in the water bath for 5 minutes __before__ mixing.' },
    { bad: 'Some starch; a few drops of amylase.', good: '5.0 cm³ of 1.0 % starch solution; 2.0 cm³ of 1.0 % amylase.' },
    { bad: 'The experiment was repeated.', good: 'Three trials were carried out at each temperature, and a mean was calculated.' },
    { bad: 'The apparatus list copied again into each step.', good: 'Each step names only what it needs, with no unnecessary or repeated detail.', lv: 'ie' },
    { bad: 'The IA method and data, copied into the EE.', good: 'A substantially different question and focus. No text, data or graphs copied from the IA.', lv: 'e' }
  ],

  test: [
    { type: 'choose', q: 'Which step is written the way a lab report method should be?',
      opts: [
        { t: '5.0 cm³ of starch solution was measured into a test tube with a 10 cm³ graduated pipette.', ok: true, why: 'Past tense, passive, with a quantity and the apparatus size.' },
        { t: 'Measure 5.0 cm³ of starch solution into a test tube with a 10 cm³ graduated pipette.', why: 'An instruction, like a worksheet. A report says what was done: “…was measured”.' },
        { t: 'The student measured about 5 cm³ of starch solution into a test tube with a pipette.', why: '“About” is not a quantity, and the pipette has no size, so no one could repeat this step exactly.' },
        { t: 'Starch solution was added to a test tube, and then some amylase solution was added to the starch.', why: 'How much of each solution, and measured with what? Without them, the step cannot be repeated.' }
      ] },
    { type: 'build', q: 'Turn this into the passive voice: “We placed the tubes in the water bath for 5 minutes.”',
      chips: ['The tubes', 'were placed', 'in the water bath', 'for 5 minutes.', 'We placed', 'was placed'],
      answer: ['The tubes', 'were placed', 'in the water bath', 'for 5 minutes.'],
      why: 'The tubes, which were acted on, become the subject. “Were” agrees with the plural “tubes”.' },
    { type: 'order', q: 'Put the amylase method in order.',
      items: ['5.0 cm³ of 1.0 % starch solution was measured into a test tube.', 'The starch and the amylase were placed in a water bath at 30 °C for 5 minutes.', 'The amylase was added to the starch, and the stopwatch was started.', 'Every 10 s, one drop of the mixture was tested with iodine solution.', 'The time was recorded when the iodine no longer turned blue-black.', 'Steps 1 to 5 were performed three times at each temperature.'],
      why: 'Measure, equilibrate, mix and start the clock, sample, stop, repeat.' },
    { type: 'choose', q: 'Why were the starch and the amylase left in the water bath for 5 minutes before they were mixed?',
      opts: [
        { t: 'So that both reached the test temperature before timing started.', ok: true, why: 'That is equilibration. Without it, the reaction starts at the wrong temperature.' },
        { t: 'So that the amylase could start to digest the starch before timing started.', why: 'They were in separate tubes, so no reaction had started. Timing starts when they are mixed.' },
        { t: 'So that the amylase reached its optimum temperature before mixing.', why: 'The bath is at the test temperature, and the test temperatures differ. Most of them are not the optimum.' },
        { t: 'So that the heat killed any bacteria in both of the solutions.', why: 'At 20–60 °C for 5 minutes, that is not the purpose. The wait is for the temperature.' }
      ] },
    { type: 'spot', q: 'Tap the two phrases that need more detail.',
      text: '[?:5.0 cm³ of 1.0 % starch solution was measured into a test tube.] [!a:Some amylase] was added and the stopwatch was started. [!b:Every so often], a drop was tested with iodine solution. [?:Three trials were carried out at each temperature.]',
      why: { a: 'Give the volume and concentration: 2.0 cm³ of 1.0 % amylase.', b: 'Give the interval: every 10 s.' } },
    { type: 'sort', q: 'Precise enough to repeat, or too vague? Sort each phrase.',
      bins: ['Precise', 'Too vague'],
      items: [
        { t: '5.0 cm³ of 1.0 % starch solution', bin: 0, why: 'A volume and a concentration.' },
        { t: 'some starch', bin: 1, why: 'How much, and how concentrated?' },
        { t: 'every 10 s', bin: 0, why: 'A sampling interval with a unit.' },
        { t: 'every so often', bin: 1, why: 'How often? Give the interval.' },
        { t: 'a 10 cm³ graduated pipette', bin: 0, why: 'The apparatus and its size.' },
        { t: 'a pipette', bin: 1, why: 'Which size, and which kind?' }
      ] },
    { type: 'multi', q: 'Which belong in the method?',
      opts: [
        { t: 'The number of repeats at each temperature', ok: true },
        { t: 'How long the tubes were left to reach the temperature', ok: true },
        { t: 'The volume and concentration of each solution', ok: true },
        { t: 'The times measured in each tube, and their mean', why: 'Measured values are results: they go in the results table, not the method.' },
        { t: 'Why enzymes work fastest at their optimum temperature', why: 'That is theory: it belongs in the background or the hypothesis.' }
      ],
      why: 'The method says what was done, with enough detail to repeat it.' },
    { type: 'choose', lv: 'ie', q: 'What does the IB mean by a method that “could in principle” be repeated?',
      opts: [
        { t: 'Specific materials and precise steps, without unnecessary or repetitive information.', ok: true, why: 'Those are the words of the Research design clarifications.' },
        { t: 'The full list of apparatus, repeated in each step, so that each step can be read on its own.', why: 'That is the repetition the guide asks you to avoid: “without unnecessary or repetitive information”.' },
        { t: 'The worksheet method, copied exactly, so that the steps match the teacher’s.', why: 'The method must be your own, and a worksheet gives orders, not a record.' },
        { t: 'A method that another student has repeated, and that gave the same results the second time.', why: 'That is about the results being reproduced. “In principle” is about how the method is described.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'A pilot run sampled drops every 30 s. At 50 °C, the starch had gone in under a minute. What should change?',
      opts: [
        { t: 'Sample every 10 s instead, so the time is known to ± 10 s, not ± 30 s.', ok: true, why: 'The sampling interval sets the uncertainty of the time.' },
        { t: 'Remove 50 °C from the range, so no run ends within a minute.', why: '50 °C is where the optimum may be, so it matters most. Change the sampling, not the range.' },
        { t: 'Keep sampling every 30 s, but use a stopwatch that reads to 0.001 s instead.', why: 'The stopwatch is not the problem. With a sample every 30 s, the time is still known only to ± 30 s.' },
        { t: 'Nothing: a pilot run is practice, so its results are not reported.', why: 'Report what the pilot run showed. It justifies the choices in the method.' }
      ] },
    { type: 'choose', lv: 'e', q: 'An EE methodology should also…',
      opts: [
        { t: '…explain why other methods were rejected, such as a colorimeter chosen over judging colour by eye.', ok: true, why: 'Justifying the choice of method is part of the essay’s framework.' },
        { t: '…reuse the method from the IA, with the same apparatus and steps, so that the two pieces of work support each other.', why: 'No IA content may be duplicated in the EE.' },
        { t: '…give less detail than an IA method, since the examiner reads the results and the discussion, not the method.', why: 'The method must still be replicable, and the examiner reads it like any other section.' },
        { t: '…present the results of each trial next to the steps, so that the reader can see what each step produced.', why: 'Results go in the results section. The methodology says what was done, and why.' }
      ] }
  ],

  words: [
    { term: 'method', forms: ['methods', 'procedure', 'methodology'], def: 'The numbered steps that were followed, written so that someone else could repeat them.', eg: '“5.0 cm³ of starch solution was measured into a test tube…”' },
    { term: 'equilibration', forms: ['equilibrate', 'equilibrated'], def: 'Leaving solutions in the water bath until they reach the test temperature, before timing starts.', eg: 'Starch and amylase held in the 30 °C water bath for 5 minutes before mixing.' },
    { term: 'pilot run', forms: ['pilot runs', 'pilot study'], lv: 'ie', def: 'A short trial before the real experiment, used to choose the range, the timings and the repeats.', eg: 'A pilot run showed times of 50–180 s, so drops were sampled every 10 s.' }
  ],

  sources: ['IB Biology guide (2025), Research design, pp. 120–121', 'IB Biology guide (2025), skills p. 31 (Inquiry 1: pilot methodologies)', '0610 Paper 6 planning mark schemes, 2021–2025', 'IB Extended essay guide (first assessment 2027), sciences guidance']
});
