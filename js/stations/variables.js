/* station: variables — the reference station. Every other station follows this shape (SPEC.md). */
WUL.station({
  id: 'variables', stage: 'plan', order: 3, title: 'Variables', levels: 'gie',
  job: 'Name what you change, what you measure, and everything you keep the same. Then only one thing can affect the result.',
  where: { g: 'Straight after the aim or question.', i: 'In the methodology, straight after the research question.', e: 'In the methodology section.' },

  ladder: {
    g: ['Name the [[independent variable]] and the values used', 'Name the [[dependent variable]], its unit, and how it was measured', 'Every [[control variable]]: a __value__, a __method__ and a __reason__'],
    i: ['Justify the range, the [[interval]] and the number of repeats', 'Explain how each control variable was controlled', 'Name any variable that could not be controlled, and [[monitor|monitored variable]] it'],
    e: ['Justify the choices from published research or a pilot run', 'Explain why another design was rejected']
  },

  build: [
    { type: 'anatomy', title: 'Three kinds of variable',
      intro: 'Every experiment has all three. Tap a colour to see where each one is.',
      model: '{1:Temperature} was changed: 20, 30, 40, 50 and 60 °C.\n\n{2:The time for the starch to disappear} was measured, in seconds.\n\n{3:The volume of starch solution}, {3:the concentration of amylase} and {3:the pH} were kept the same.',
      parts: [
        { n: 1, name: 'Independent variable', note: 'The one thing you change on purpose. First column of the table; x-axis of the graph.' },
        { n: 2, name: 'Dependent variable', note: 'What you measure to see the effect. On the y-axis of the graph.' },
        { n: 3, name: 'Control variables', note: 'Everything else that could change the result. Each one is kept the same.' }
      ] },

    { type: 'callout', title: 'The fair test rule', label: 'The rule', md: 'Change __one__ thing. Measure __one__ thing. Keep __everything else__ the same. That is a [[fair test]].' },

    { type: 'anatomy', title: 'How to write one control variable',
      intro: 'A control variable earns the mark only with all four parts.',
      model: '{1:Volume of starch solution}: {2:5.0 cm³}, {3:measured with a 10 cm³ graduated pipette}, {4:because more starch takes longer to digest}.\n\n{1:pH}: {2:6.0}, {3:kept with 2.0 cm³ of pH 6.0 buffer in every tube}, {4:because amylase activity changes with pH}.\n\n{1:Temperature of the mixture}: {2:40 °C}, {3:kept in a thermostatically controlled water bath}, {4:because temperature changes the rate of reaction}.',
      parts: [
        { n: 1, name: 'Which variable', note: 'Name the property: volume, mass, concentration, temperature. Never “amount”.' },
        { n: 2, name: 'Its value', note: 'The number and the unit.' },
        { n: 3, name: 'How it was kept the same', note: 'The equipment or method. “Water bath” alone is not enough: say thermostatically controlled.' },
        { n: 4, name: 'Why it matters', note: 'How it would change the dependent variable if it changed.' }
      ],
      after: 'The third example is from a different experiment, where temperature is a control variable, not the independent variable.' },

    { type: 'rules', title: 'Rules for variables', items: [
      'The independent variable goes in the __first column__ of the table and on the __x-axis__.',
      'The dependent variable goes on the __y-axis__. Say __how__ it was measured and its __unit__.',
      'Name the property (volume, mass, concentration). Never write “amount of”.',
      { t: 'Our rule: at least __five values__ of the independent variable, so that you can see the shape of the pattern. Exam planning questions accept fewer.' },
      { t: 'At IB, give a __reason__ for the range, the interval and the number of repeats.', lv: 'ie' }
    ] },

    { type: 'table', lv: 'ie', title: 'A variables table saves words',
      spec: {
        caption: 'Table 1. Control variables for the investigation of the effect of temperature on the time taken for fungal α-amylase to digest starch, and how each was controlled.',
        head: [['Control variable', 'Value', 'How it was kept the same', 'Why it matters']],
        rows: [
          ['Volume of starch solution', '5.00 cm³', '10 cm³ graduated pipette (± 0.05 cm³)', 'More starch takes longer to digest'],
          ['Concentration of amylase', '1.0 %', 'One stock solution, made at the start', 'More enzyme gives more collisions per second'],
          ['pH', '6.0', '2.0 cm³ of pH 6.0 buffer in every tube', 'Activity falls on either side of the optimum pH'],
          ['Room temperature', '21–23 °C', 'Not controlled: recorded each hour (monitored)', 'Samples cool slightly on the spotting tile']
        ]
      },
      after: 'Tables do not count towards the 3,000 words. So a table like this gives your reasons without using words from your limit.' },

    { type: 'note', tone: 'ib', label: 'What the IB guide asks', title: 'What the IB guide lists', md: 'The IB lists, among “methodological considerations”: the choice of how to measure the independent and dependent variables; the range, interval and number of repeats; and “the identification of control variables and the choice of method of their control”. A list with no reasons is the most common way to lose these marks.', lv: 'ie' },

    { type: 'frames', title: 'Sentence frames for variables', items: [
      'The independent variable was ___, which was changed from ___ to ___ in steps of ___.',
      'The dependent variable was ___, measured in ___ using ___.',
      '___ was kept at ___ by ___, because ___.'
    ] }
  ],

  redpen: {
    g: {
      title: 'A student wrote this. Five phrases would lose marks.',
      body: 'Independent variable: [!a:heat].\n\nDependent variable: [!b:how fast it works].\n\nControl variables: [!c:the amount of starch], [!d:the same enzyme], and [!e:everything else was kept the same].',
      notes: {
        a: { label: 'which heat?', why: 'Name the quantity and give the values: __temperature of the water bath__, 20, 30, 40, 50 and 60 °C.' },
        b: { label: 'measured how?', why: 'Say what was measured and its unit: __time for the starch to disappear, in seconds__.' },
        c: { label: '“amount”?', why: 'Name the property and give its value: __volume__ of starch solution, 5.0 cm³.' },
        d: { label: 'value? method? reason?', why: 'A control variable needs a value, a method and a reason: concentration of amylase, 1.0 %, from one stock solution, because more enzyme digests starch faster.' },
        e: { label: 'earns nothing', why: 'This names no variable at all, so it cannot earn a mark. Name each one.' }
      },
      fixed: 'Independent variable: ==temperature of the water bath==: 20, 30, 40, 50 and 60 °C.\n\nDependent variable: ==time for the starch to disappear==, in seconds, measured with a stopwatch.\n\nControl variables: ==volume of starch solution==, 5.0 cm³, measured with a graduated pipette, because more starch takes longer to digest; ==concentration of amylase==, 1.0 %, from one stock solution, because more enzyme digests starch faster.',
      fixedNote: 'Every variable is now named as a quantity, and every control variable has its value, method and reason.'
    },
    i: {
      title: 'An IA draft. Four phrases would keep it out of the top band.',
      body: 'Temperature was varied from 20.0 to 60.0 °C [!a:because this range was used in class]. [!b:Three trials] were carried out at each temperature. The pH was controlled [!c:by keeping it the same]. [!d:Room temperature could not be controlled, so the results are unreliable.]',
      notes: {
        a: { label: 'justify!', why: 'Give a biological reason: the range spans the expected optimum of this fungal amylase and reaches the temperatures where it starts to denature.' },
        b: { label: 'why three?', why: 'Justify the number: for example, five trials, because a pilot run showed a spread of about 10 s at each temperature.' },
        c: { label: 'how?', why: 'Name the method: 2.0 cm³ of pH 6.0 buffer in every tube.' },
        d: { label: 'monitor it', why: 'Say what was done about it: room temperature was recorded (21–23 °C), and the reaction ran in a water bath, so its effect was small. Say what it did to the result, not “unreliable”.' }
      },
      fixed: 'Temperature was varied from 20.0 to 60.0 °C in 10.0 °C steps, ==because this range spans the expected optimum of the fungal amylase and includes temperatures at which it begins to denature==. ==Five trials== were carried out at each temperature, because a pilot run showed a spread of about 10 s. The pH was kept at 6.0 ==with 2.0 cm³ of buffer in every tube==. Room temperature could not be controlled, so it was ==monitored== (21–23 °C); the reaction ran in a water bath, so its effect was small.',
      fixedNote: 'Every choice now has a reason, and the uncontrolled variable is monitored rather than blamed.'
    }
  },

  traps: [
    { bad: 'Control variable: the __amount__ of enzyme.', good: 'Concentration of amylase: 1.0 %, from one stock solution.' },
    { bad: 'Everything else was kept the same.', good: 'Name each control variable, with its value, method and reason.' },
    { bad: 'Temperature was kept the same using a water bath.', good: '…using a __thermostatically controlled__ water bath at 40 °C, checked with a thermometer.' },
    { bad: 'Independent variable: enzyme.', good: 'Independent variable: concentration of amylase, 0.2 to 1.0 %.' },
    { bad: 'The range was 20–60 °C.', good: '20–60 °C spans the expected optimum and the start of denaturation.', lv: 'ie' }
  ],

  test: [
    { type: 'sort', q: 'Pondweed is used to find the effect of light intensity on the rate of photosynthesis. Sort each variable.',
      bins: ['Independent', 'Dependent', 'Control'],
      items: [
        { t: 'Distance of the lamp from the pondweed', bin: 0, why: 'Changing the distance changes the light intensity: this is what is changed on purpose.' },
        { t: 'Number of bubbles released per minute', bin: 1, why: 'This is measured to see the effect.' },
        { t: 'Temperature of the water', bin: 2, why: 'Temperature changes the rate of photosynthesis too, so it is kept the same.' },
        { t: 'Concentration of hydrogencarbonate', bin: 2, why: 'It supplies carbon dioxide, which changes the rate, so it is kept the same.' },
        { t: 'Length of the pondweed', bin: 2, why: 'More leaf means more photosynthesis, so the same length is used each time.' }
      ] },
    { type: 'choose', q: 'Which control variable would earn the mark?',
      opts: [
        { t: 'The volume of hydrogen peroxide, 10.0 cm³, measured with a 10 cm³ measuring cylinder, because more substrate would release more oxygen.', ok: true, why: 'It has all four parts: the variable, its value, the method and the reason.' },
        { t: 'The amount of hydrogen peroxide was kept the same.', why: '“Amount” is not a property, and there is no value, method or reason.' },
        { t: 'The same catalase was used.', why: 'No value, method or reason.' },
        { t: 'Everything else was kept the same.', why: 'It names no variable, so it earns nothing.' }
      ] },
    { type: 'choose', q: 'Where does the independent variable go in a results table?',
      opts: [
        { t: 'In the first column', ok: true, why: 'The independent variable always comes first; the measurements follow to its right.' },
        { t: 'In the last column', why: 'The last columns hold the measurements and the mean.' },
        { t: 'Only in the title', why: 'It belongs in the title and in the first column.' },
        { t: 'Anywhere, as long as it is labelled', why: 'Convention matters: a reader looks for it in the first column.' }
      ] },
    { type: 'spot', q: 'Tap the two phrases that would lose marks.',
      text: 'Independent variable: [!a:heat]. Dependent variable: [?:time for the iodine to stop turning blue-black, in seconds]. Control variables: [!b:the same amount of starch], and [?:pH 6.0, kept with 2.0 cm³ of buffer, because amylase activity changes with pH].',
      why: { a: 'Name the quantity: temperature, with its values.', b: '“Amount” is not a property, and there is no value, method or reason.' } },
    { type: 'build', q: 'Build a sentence that names the independent variable properly.',
      chips: ['The independent variable was', 'temperature,', 'set at 20, 30, 40, 50 and 60 °C', 'using a thermostatically controlled water bath.', 'heat,', 'some different temperatures'],
      answer: ['The independent variable was', 'temperature,', 'set at 20, 30, 40, 50 and 60 °C', 'using a thermostatically controlled water bath.'],
      why: 'It names the quantity, the values and how they were set.' },
    { type: 'choose', q: 'Why is “a thermostatically controlled water bath” better than “a water bath”?',
      opts: [
        { t: 'It keeps the water at a set temperature by itself.', ok: true, why: 'Exam mark schemes credit the controlled bath, not a plain one, which slowly cools.' },
        { t: 'It makes the reaction faster.', why: 'The bath controls the temperature; it does not speed anything up by itself.' },
        { t: 'You no longer need a thermometer.', why: 'You should still check the temperature with a thermometer.' },
        { t: 'It is bigger.', why: 'Size is not the point: holding the temperature steady is.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'An IA says: “Five temperatures were used, with three trials at each.” What is missing for the top band?',
      opts: [
        { t: 'A reason for the range, the interval and the number of trials', ok: true, why: 'The top band asks for methodological considerations to be explained, not only stated.' },
        { t: 'A longer list of apparatus', why: 'More apparatus does not justify the choices.' },
        { t: 'The word “fair test”', why: 'Naming the idea is not the same as justifying the design.' },
        { t: 'A graph of the pilot run', why: 'A pilot run can supply the reason, but it is the reason that earns the credit.' }
      ] },
    { type: 'multi', lv: 'ie', q: 'Which of these are “methodological considerations” in the IB guide?',
      opts: [
        { t: 'The range and interval of the independent variable', ok: true },
        { t: 'The control variables and how each was controlled', ok: true },
        { t: 'Safety, ethical and environmental issues', ok: true },
        { t: 'Why the topic is personally interesting', why: 'Personal interest is not in the 2025 criteria.' },
        { t: 'The colours used on the graph', why: 'Presentation belongs to Data analysis, not Research design.' }
      ],
      why: 'All three are listed in the Research design clarifications (IB Biology guide, p. 120).' }
  ],

  words: [
    { term: 'independent variable', forms: ['IV', 'independent variables'], def: 'The variable you change on purpose, to see its effect.', eg: 'Temperature, set at 20, 30, 40, 50 and 60 °C.' },
    { term: 'dependent variable', forms: ['DV', 'dependent variables'], def: 'The variable you measure, to see the effect of the change.', eg: 'The time for the starch to disappear, in seconds.' },
    { term: 'control variable', forms: ['control variables', 'controlled variable', 'controlled variables'], def: 'A variable that could change the result, so it is kept the same.', eg: 'pH, kept at 6.0 with a buffer.' },
    { term: 'fair test', forms: ['fair tests'], def: 'An investigation in which only the independent variable is allowed to affect the dependent variable.', eg: 'Only the temperature differs between the tubes.' },
    { term: 'interval', forms: ['intervals'], def: 'The step between one value of the independent variable and the next.', eg: '10 °C, in 20, 30, 40, 50 and 60 °C.' },
    { term: 'monitored variable', forms: ['monitored variables', 'monitor', 'monitored'], lv: 'ie', def: 'A variable that could not be controlled, so it was measured and recorded instead.', eg: 'Room temperature, recorded as 21–23 °C.' }
  ],

  further: [
    { title: 'Confounding variables, and why scientists randomise', lv: 'gie',
      md: 'A variable that changes __together with__ the independent variable can create an effect that is not real. For example, suppose every 60 °C trial were done on Friday with a new batch of starch. Then the batch, not the temperature, might explain the result. Scientists do the trials in a __random order__, so that no hidden variable changes together with the one being tested.',
      cite: 'Ruxton, Graeme D., and Nick Colegrave. *Experimental Design for the Life Sciences*. 4th ed., Oxford University Press, 2016.' }
  ],

  sources: ['IB Biology guide (2025), Research design clarifications, p. 120', 'Cambridge 0610 syllabus 2026–2028, p. 51', '0610 Paper 6 planning mark schemes, 2021–2025']
});
