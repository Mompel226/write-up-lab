/* station: safety — "Risk, ethics and environment".
   Control measure = what REDUCES the risk; emergency action = what to do IF harm happens.
   IB ethics facts: IB Sciences experimentation guidelines (2023), via docs/lab-reports/RESEARCH-ib.md. */
WUL.station({
  id: 'safety', stage: 'plan', order: 6, title: 'Risk, ethics and environment', levels: 'gie',
  job: {
    g: 'Name each hazard in this method, and the precaution that matches it.',
    i: 'Name the safety, ethical and environmental issues of this method, and show what you did about each one.'
  },
  where: { g: 'After the apparatus, before the method.', i: 'In the methodology, as part of Research design.', e: 'In the methodology section.' },

  ladder: {
    g: ['One [[hazard]] from __this__ method, and the precaution that matches it', 'A table of hazard, [[risk]] and precaution: good practice'],
    i: ['Four columns: hazard, risk, [[control measure]], [[emergency action]]', 'The CLEAPSS Hazcards: the school’s standard', '[[Ethical|ethics]] and [[environmental|environmental impact]] issues too, following the IB guidelines'],
    e: ['The same for every technique used, including fieldwork', 'Secondary data must come from ethically approved research']
  },

  build: [
    { type: 'anatomy', title: 'Four parts of a risk assessment',
      intro: 'One row of a risk assessment, written from top to bottom. Tap a colour to see each part.',
      model: { table: {
        cls: 'wd-table-fixer--prose',
        head: [['Column', 'In the amylase practical']],
        rows: [
          ['{1:Hazard}', '{1:Water bath at 60 °C}'],
          ['{2:Risk}', '{2:Scalding if a tube or the water spills}'],
          ['{3:Control measure}', '{3:Tubes moved with a test-tube holder; the bath is not carried when full}'],
          ['{4:Emergency action}', '{4:Cool the burn under cool running water for 20 minutes; tell the teacher}']
        ]
      } },
      parts: [
        { n: 1, name: 'Hazard', note: 'The thing that can cause harm.' },
        { n: 2, name: 'Risk', note: 'How likely harm is, and how serious it would be.' },
        { n: 3, name: 'Control measure', note: 'What you do to __reduce__ the risk, before anything goes wrong. Cambridge calls it a precaution.' },
        { n: 4, name: 'Emergency action', note: 'What you do __if__ harm happens.' }
      ] },

    { type: 'callout', title: 'Before harm, and after harm', label: 'Do not confuse them', md: 'A [[control measure]] acts __before__ harm, to reduce the risk. An [[emergency action]] acts __after__ harm has happened.' },

    { type: 'note', tone: 'warn', label: 'Careful', title: 'Rinsing is not a control measure', md: 'Some guides call the emergency action a “control measure”. It is not. Rinsing an eye does not reduce the risk of a splash. It treats a splash that has already happened.' },

    { type: 'compare', title: 'Warnings or a risk assessment?',
      badLabel: 'A list of warnings', goodLabel: 'A risk assessment',
      bad: 'Be careful with the hot water.\nWear a lab coat.\nDo not run in the lab.\nIodine is dangerous.',
      good: { table: {
        cls: 'wd-table-fixer--prose',
        head: [['Hazard', 'Risk', 'Precaution']],
        rows: [
          ['Iodine solution', 'Can irritate the eyes if it splashes', 'Eye protection worn'],
          ['Water bath at 60 °C', 'Scalds if a tube spills', 'Tubes moved with a holder']
        ]
      } },
      why: 'Each row names a hazard from __this__ method, and the precaution that matches it. A warning list does neither.' },

    { type: 'note', tone: 'igcse', lv: 'g', label: 'At IGCSE', title: 'What Cambridge credits',
      md: 'In a Paper 6 plan, one hazard from __this__ method, with the precaution that matches it, earns the mark.\n\n“Wear a lab coat” and “adult supervision” never score. Goggles or gloves score only when they fit the hazard. A table is good training, but the exam never asks for one.' },

    { type: 'table', lv: 'g', title: 'A risk assessment for amylase',
      spec: {
        caption: 'Table 1. Risk assessment for the investigation of the effect of temperature on the time taken for amylase to digest starch.', cls: 'wd-table-fixer--prose',
        head: [['Hazard', 'Risk', 'Precaution']],
        rows: [
          ['Iodine solution', 'Irritation if a drop splashes into an eye; stains skin', 'Eye protection worn; iodine used from a dropping bottle'],
          ['Water bath at up to 60 °C', 'Scalding if a tube or the water spills', 'Tubes moved with a test-tube holder; the bath is not carried'],
          ['Glass test tubes', 'Cuts if a tube breaks', 'Tubes carried in a rack; chipped glass not used']
        ]
      },
      after: 'Three hazards, each with the precaution that matches it.' },

    { type: 'table', lv: 'ie', title: 'A four-column IB risk assessment',
      spec: {
        caption: 'Table 1. Risk assessment for the investigation of the effect of temperature on the time taken for fungal α-amylase to digest starch.', cls: 'wd-table-fixer--prose wd-table-fixer--risk4',
        head: [['Hazard', 'Risk', 'Control measure', 'Emergency action']],
        rows: [
          ['Iodine solution, 0.01 mol dm⁻³', 'Low: dilute, used as drops. Irritation if a drop splashes into an eye.', 'Eye protection worn; iodine used from a dropping bottle', 'Rinse the eye with running water for at least 10 minutes; tell the teacher'],
          ['Water bath at up to 60 °C', 'Moderate: water at 60 °C scalds within seconds if a tube or the bath is knocked.', 'Tubes moved with a test-tube holder; the bath is not carried when full', 'Cool the burn under cool running water for 20 minutes; tell the teacher'],
          ['Glass test tubes and pipettes', 'Low: cuts if a tube is dropped or cracks.', 'Tubes carried in a rack; chipped glass not used', 'Collect broken glass with a brush and dustpan; never touch it with bare hands'],
          ['Amylase solution', 'Low: a dilute solution, not a powder. Enzymes can cause allergy if inhaled as dust or spray.', 'Solution prepared by the technician; not shaken or sprayed', 'Wash skin with water; if breathing is affected, move to fresh air and tell the teacher'],
          [{ t: '__Ethics and environment.__ No organisms, human tissue or body fluids were used, so no ethical issues arose. Dilute solutions were poured to waste with plenty of water; broken glass went in the glass bin.', cs: 4 }]
        ]
      },
      after: 'Each hazard is checked against its CLEAPSS Hazcard, which is the school’s standard. The risk says how likely harm is, and how serious it would be: low, moderate or high.' },

    { type: 'table', lv: 'ie', title: 'The IB rules for experiments',
      spec: {
        caption: 'What the IB Sciences experimentation guidelines (2023) allow', cls: 'wd-table-fixer--prose',
        head: [['Area', 'The rule']],
        rows: [
          ['Humans', 'Written informed consent from each participant, and from a parent if under 16. Results kept anonymous; anyone may withdraw. A health questionnaire (PAR-Q) before exercise.'],
          ['Substances', 'Nothing may be given to people to take, including caffeine and energy drinks.'],
          ['Body fluids', 'None of any kind: no saliva, blood, urine or sweat, not even your own.'],
          ['Animals', 'Natural behaviour only, in conditions within their natural range. No pain or undue stress. Returned unharmed; never killed for an experiment.'],
          ['Microorganisms', 'Non-pathogenic strains from a supplier only. Incubated at 25 °C or below. Plates never sealed completely, and never opened again. No swabs from skin or the environment. No antibiotic-resistance tests.'],
          ['Fieldwork', 'Minimal impact: organisms counted where they are, the habitat left as it was found, no protected species or sites.'],
          ['Waste', 'Materials used sparingly. Waste, including biological material, disposed of by local rules, with the least harm to the environment.']
        ]
      },
      after: 'Secondary data from research that was ethically approved is acceptable.' },

    { type: 'widget', title: 'Build a risk assessment', name: 'risk-builder' },

    { type: 'note', tone: 'house', lv: 'ie', label: 'Our rule', title: 'Check the CLEAPSS Hazcards',
      md: 'Check every chemical and organism in its CLEAPSS Hazcard before you write the table. This is the school’s standard, not an IB requirement.\n\nWrite “no ethical or environmental issues” only after checking, and say why.' },

    { type: 'frames', lv: 'g', title: 'Sentence frames for safety', items: [
      'Hazard: ___. Precaution: ___, because ___.',
      '___ can ___, so ___ was worn / used.'
    ] },
    { type: 'frames', lv: 'ie', title: 'Sentence frames for risk and ethics', items: [
      '___ is a hazard because it can ___.',
      'The risk is low / moderate / high, because ___.',
      'This was reduced by ___.',
      'If ___ happened, ___.',
      'No ethical issues arose, because ___.',
      '___ was disposed of by ___.'
    ] }
  ],

  redpen: {
    g: {
      title: 'A student wrote this safety section. Five phrases need the red pen.',
      body: '[!tf-a:Wear a lab coat.] [!tf-b:Be careful with the iodine.] [!tf-c:An adult should supervise.] [!tf-d:Wear gloves] when using the water bath. [!tf-e:The experiment is safe.]',
      notes: {
        'tf-a': { label: 'never scores', why: 'A lab coat is worn in every practical, so it earns nothing. Name a hazard from this method and the precaution that matches it.' },
        'tf-b': { label: 'careful how?', why: 'Name the harm and the precaution: iodine solution can irritate the eyes, so eye protection was worn.' },
        'tf-c': { label: 'never scores', why: '“Adult supervision” is never credited. Say what reduces the risk.' },
        'tf-d': { label: 'doesn’t match', why: 'Thin gloves do not stop a scald. Match the precaution to the hazard: tubes moved with a test-tube holder.' },
        'tf-e': { label: 'no hazards?', why: 'Every practical has hazards. This one has hot water, iodine solution and glassware.' }
      },
      fixed: '==Iodine solution can irritate the eyes==, so ==eye protection was worn==. ==Water at up to 60 °C can scald==, so ==tubes were moved with a test-tube holder== and the bath was not carried.',
      fixedNote: 'Two hazards from this method, each with the precaution that matches it.'
    },
    i: {
      title: 'An IA risk assessment. Five cells need the red pen.',
      body: { table: {
        cls: 'wd-table-fixer--rp wd-table-fixer--prose',
        head: [['Hazard', 'Risk', 'Control measure', 'Emergency action']],
        rows: [
          ['Iodine', '[!a:Unsafe]', 'Goggles worn', '[!b:Wear goggles]'],
          ['[!c:Water bath]', 'Scalds; moderate', 'Tube holder used', 'Cool under cool running water for 20 minutes'],
          ['Glass tubes', 'Cuts; low', '[!d:Lab coat worn]', 'Collect it; tell the teacher'],
          [{ t: 'Ethics and environment: [!e:none].', cs: 4 }]
        ]
      } },
      notes: {
        a: { label: 'how likely?', why: 'Say the harm and how likely it is: low, because it is dilute; irritation if a drop splashes into an eye.' },
        b: { label: 'wrong column', why: 'Goggles reduce the risk, so they are a control measure. The emergency action: rinse the eye with running water for at least 10 minutes; tell the teacher.' },
        c: { label: 'how hot?', why: 'The hazard is the hot water: a water bath at up to 60 °C.' },
        d: { label: 'doesn’t match', why: 'A lab coat does not prevent cuts. Carry tubes in a rack, and do not use chipped glass.' },
        e: { label: 'checked?', why: 'Say what was checked: no organisms, human tissue or body fluids were used. Say how waste was disposed of.' }
      },
      fixed: { table: {
        cls: 'wd-table-fixer--rp wd-table-fixer--prose',
        head: [['Hazard', 'Risk', 'Control measure', 'Emergency action']],
        rows: [
          ['Iodine', '==Low: dilute; can irritate the eyes if splashed==', 'Goggles worn', '==Rinse the eye with running water for at least 10 minutes; tell the teacher=='],
          ['==Water bath at up to 60 °C==', 'Scalds; moderate', 'Tube holder used', 'Cool under cool running water for 20 minutes'],
          ['Glass tubes', 'Cuts; low', '==Tubes carried in a rack; chipped glass not used==', 'Collect it; tell the teacher'],
          [{ t: 'Ethics and environment: ==no organisms, human tissue or body fluids were used; dilute solutions were poured to waste with plenty of water.==', cs: 4 }]
        ]
      } },
      fixedNote: 'Each risk says how likely and how serious. Each control measure matches its hazard. The emergency actions are for after harm.'
    }
  },

  traps: [
    { bad: 'Wear a lab coat.', good: 'Iodine solution can irritate the eyes, so eye protection was worn.' },
    { bad: 'Adult supervision.', good: 'Name a hazard from this method, and what reduces its risk.' },
    { bad: 'Gloves, for a water bath at 60 °C.', good: 'A precaution that matches the hazard: a test-tube holder.' },
    { bad: 'Emergency action listed as a “control measure”.', good: 'Control measure: reduces the risk. Emergency action: what to do if harm happens.' },
    { bad: 'Testing the amylase in your own saliva.', good: 'No body fluids of any kind at IB. Use a supplied amylase.', lv: 'ie' },
    { bad: 'Ethics: none.', good: 'No organisms, human tissue or body fluids were used, so no ethical issues arose.', lv: 'ie' }
  ],

  test: [
    { type: 'sort', q: 'Sort each part of this risk assessment for the catalase practical.',
      bins: ['Hazard', 'Risk', 'Control measure', 'Emergency action'],
      items: [
        { t: 'Hydrogen peroxide solution, 6 %', bin: 0, why: 'The thing that can cause harm.' },
        { t: 'Moderate: froth can splash into the eyes', bin: 1, why: 'How likely harm is, and how serious.' },
        { t: 'Eye protection worn; small volumes used', bin: 2, why: 'It reduces the risk before anything happens.' },
        { t: 'Rinse the eye with running water for at least 10 minutes', bin: 3, why: 'What to do after a splash has happened.' },
        { t: 'A water bath at 60 °C', bin: 0, why: 'The hot water is the thing that can cause harm.' },
        { t: 'Tubes moved with a test-tube holder', bin: 2, why: 'It reduces the risk of a scald.' }
      ] },
    { type: 'choose', q: 'Which safety point would earn the mark in a Paper 6 plan for the amylase experiment?',
      opts: [
        { t: 'Iodine solution can irritate the eyes, so wear eye protection.', ok: true, why: 'A hazard from this method, with the precaution that matches it.' },
        { t: 'Wear a lab coat.', why: 'Worn in every practical: it never scores.' },
        { t: 'Work under adult supervision.', why: 'Never credited: it does not reduce any particular risk.' },
        { t: 'Wear gloves when using the water bath.', why: 'Gloves do not match the hazard: they do not stop a scald.' }
      ] },
    { type: 'choose', q: 'Which precaution matches the hazard “water bath at 60 °C”?',
      opts: [
        { t: 'Tubes are moved with a test-tube holder.', ok: true, why: 'It keeps hands out of the hot water.' },
        { t: 'Wear gloves.', why: 'Thin gloves do not stop a scald, and can hold hot water against the skin.' },
        { t: 'Wear a lab coat.', why: 'Worn in every practical: it does not match this hazard.' },
        { t: 'Work in a fume cupboard.', why: 'A fume cupboard removes harmful gases. Hot water releases none.' }
      ] },
    { type: 'choose', q: 'What is the difference between a control measure and an emergency action?',
      opts: [
        { t: 'A control measure reduces the risk before harm happens; an emergency action is what you do if harm happens.', ok: true, why: 'Before, and after.' },
        { t: 'A control measure is what you do after an accident; an emergency action prevents it.', why: 'This is the wrong way round.' },
        { t: 'They are the same thing.', why: 'One reduces the risk; the other deals with harm that has already happened.' },
        { t: 'A control measure is only for chemicals.', why: 'Hot water, glass and organisms need control measures too.' }
      ] },
    { type: 'spot', q: 'Tap the two precautions that would not score.',
      text: '[!a:Wear a lab coat.] [?:Iodine solution can irritate the eyes, so eye protection was worn.] [!b:Adult supervision.] [?:The water was at 60 °C, so tubes were moved with a test-tube holder.]',
      why: { a: 'A lab coat is worn in every practical and matches no particular hazard.', b: 'Adult supervision is never credited.' } },
    { type: 'multi', q: 'The catalase practical uses liver and hydrogen peroxide. Which are hazards?',
      opts: [
        { t: 'Hydrogen peroxide solution', ok: true, why: 'An irritant: it can damage the eyes.' },
        { t: 'Raw liver', ok: true, why: 'Raw meat can carry bacteria that cause food poisoning.' },
        { t: 'The scalpel used to cut the liver', ok: true, why: 'A sharp blade can cut the skin.' },
        { t: 'The stopwatch', why: 'A stopwatch cannot cause harm.' },
        { t: 'The ruler', why: 'A ruler is not a hazard.' }
      ],
      why: 'Chemicals, organisms and equipment can all be hazards.' },
    { type: 'order', q: 'Put the steps of a risk assessment in order.',
      items: ['Identify the hazards.', 'Assess the risk from each one.', 'Decide the control measures.', 'Prepare the emergency actions.'],
      why: 'This is the order in the IB experimentation guidelines.' },
    { type: 'choose', lv: 'ie', q: 'You want to test the amylase in your own saliva for your IA. What do the IB guidelines say?',
      opts: [
        { t: 'It is not allowed: no body fluids of any kind, not even your own.', ok: true, why: 'The 2023 guidelines removed the old exception for your own saliva.' },
        { t: 'It is allowed, as long as it is your own saliva.', why: 'That exception was in the 2015 policy. It is gone.' },
        { t: 'It is allowed with parental consent.', why: 'Consent does not change it: body fluids are not allowed.' },
        { t: 'It is allowed if the saliva is boiled first.', why: 'Boiling would denature the amylase, and body fluids are still not allowed.' }
      ] },
    { type: 'multi', lv: 'ie', q: 'Which microbiology investigations do the IB guidelines allow?',
      opts: [
        { t: 'A non-pathogenic yeast from a supplier, incubated at 25 °C', ok: true, why: 'A supplier non-pathogen, at 25 °C or below.' },
        { t: 'Plates that are not sealed completely, and are not opened again', ok: true, why: 'Plates are never sealed completely, and never reopened.' },
        { t: 'Swabs taken from people’s hands', why: 'No swabs from skin or the environment.' },
        { t: 'Testing which antibiotics a bacterium resists', why: 'No antibiotic-resistance tests.' },
        { t: 'Incubating plates at 37 °C', why: 'Incubation is at 25 °C or below.' }
      ],
      why: 'IB Sciences experimentation guidelines (2023).' },
    { type: 'choose', lv: 'ie', q: 'An IA counts woodlice under logs in a wood. Which follows the IB guidelines?',
      opts: [
        { t: 'Counting them where they are, then returning each log to its place.', ok: true, why: 'Minimal impact: the habitat is left as it was found.' },
        { t: 'Collecting them to keep in the laboratory.', why: 'Animals are observed in their natural conditions, and returned unharmed.' },
        { t: 'Removing the logs to see better.', why: 'That damages the habitat.' },
        { t: 'Choosing a protected nature reserve, to find more species.', why: 'Protected species and sites are avoided.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'An IA measures heart rate after exercise in 15-year-old students. What is needed?',
      opts: [
        { t: 'Written informed consent from each student and a parent, a PAR-Q first, and the right to withdraw.', ok: true, why: 'Under 16, parental consent is needed too.' },
        { t: 'Spoken agreement is enough.', why: 'Consent must be written.' },
        { t: 'An energy drink, to raise the heart rate.', why: 'No substances may be given, including caffeine.' },
        { t: 'Each student’s name recorded with their results.', why: 'Results are kept anonymous.' }
      ] }
  ],

  words: [
    { term: 'hazard', forms: ['hazards', 'hazardous'], def: 'Anything that could cause harm: a substance, a piece of equipment, or an organism.', eg: 'Iodine solution, which can irritate the eyes.' },
    { term: 'risk', forms: ['risks'], def: 'How likely it is that a hazard causes harm, and how serious that harm would be.', eg: 'Low: a drop of dilute iodine might splash into an eye.' },
    { term: 'control measure', forms: ['control measures', 'precaution', 'precautions'], def: 'What is done to reduce a risk, before anything goes wrong.', eg: 'Moving hot tubes with a test-tube holder.' },
    { term: 'emergency action', forms: ['emergency actions', 'emergency procedure', 'emergency procedures'], def: 'What is done if harm happens, despite the control measures.', eg: 'Rinsing an eye with running water for at least 10 minutes.' },
    { term: 'ethics', forms: ['ethical', 'ethical issues'], def: 'The principles that protect people, animals and the environment from harm or unfair treatment in an investigation.', eg: 'Written consent from each participant, and from a parent if under 16.' },
    { term: 'environmental impact', forms: ['environmental impacts', 'environmental issues'], def: 'The effect of an investigation on living things and habitats, including its waste.', eg: 'Counting woodlice where they are, and returning each log to its place.' }
  ],

  sources: ['IB Sciences experimentation guidelines (2023)', 'IB Biology guide (2025), Research design clarifications, p. 120', '0610 Paper 6 mark schemes 2021–2025 (safety points)', 'CLEAPSS Hazcards (school standard)']
});
