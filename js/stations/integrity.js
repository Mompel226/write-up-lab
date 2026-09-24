/* station: integrity — your own work, cite everything, collaboration vs collusion, AI, and what malpractice leads to.
   Facts: IB Biology guide (2025) pp. 4–5, 114–119; IB Extended essay guide (first assessment 2027) pp. 94–95, 107–108;
   IB Academic integrity policy (2023), appendix 6 ("The IB will not ban the use of AI software"; AI text, images and graphs
   quoted and referenced with the prompt and the date generated). */
WUL.station({
  id: 'integrity', stage: 'finish', order: 3, title: 'Academic integrity and AI', levels: 'gie',
  job: 'Check that every word, idea, number and image is either your own or credited to its source.',
  where: 'Everywhere: in every sentence, every figure and every number you present.',

  ladder: {
    g: ['Your own words; copy nothing', 'Cite every source, including a [[paraphrase]]'],
    i: ['Groups of up to three are allowed, but the question, the [[raw data]] and every word are your own', 'AI output quoted and cited, with the prompt and the date', 'Your teacher reads one draft only'],
    e: ['Nothing reused from your IA', 'Your supervisor reads one draft; the [[viva voce]] checks that the work is yours']
  },

  build: [
    { type: 'callout', title: 'Cite it or quote it', label: 'The rule', md: 'Not your idea? Cite it. Not your words? Quote them, and cite them.' },

    { type: 'rules', title: 'What academic integrity means', items: [
      '[[Academic integrity]]: the ideas, the analysis and the words are __your own__.',
      'Cite every source you use, including ideas you rewrite in your own words: a [[paraphrase]].',
      'Quotation marks around any words you copy, then a citation.',
      'Images, graphs and data you did not make: say where they came from.',
      { t: 'An AI tool’s output is never presented as your own words. Quote it, and cite it with the prompt and the date.', lv: 'ie' },
      { t: 'The same work cannot count as both your IA and your EE.', lv: 'ie' }
    ] },

    { type: 'compare', title: 'Plagiarism or paraphrase?',
      bad: 'A sentence from a website, with a few words changed, and no citation.',
      good: 'Enzymes lower the activation energy of the reactions they catalyse (Clark et al.).',
      badLabel: 'Plagiarism', goodLabel: 'A paraphrase, cited',
      why: 'Changing the words does not make the idea yours: without a citation it is [[plagiarism]]. A [[paraphrase]] needs a citation, as a quotation does.' },

    { type: 'compare', lv: 'ie', title: 'Collaboration or collusion?',
      bad: 'You and two friends collect one set of data together. All three reports present the same raw data and the same method, written together.',
      good: 'You and two friends share the equipment and plan together. Each of you investigates a different variable, records separate raw data, and writes every word alone, including the method.',
      badLabel: 'Collusion', goodLabel: 'Collaboration',
      why: '[[Collaboration]] in IA groups of up to three is allowed. Submitting shared work is [[collusion]]. Each person in your group needs a unique [[research question]]. You must not present the same raw data as anyone else in your group, and you write the whole report alone.' },

    { type: 'note', tone: 'ib', lv: 'ie', title: 'Using AI tools', label: 'AI tools', md: 'The IB will not ban AI tools, but it never counts their output as your own work. Quote AI text, images or graphs, and cite the tool with the prompt and the date it was generated. Check every fact: AI tools can invent facts and sources.' },

    { type: 'note', tone: 'ib', lv: 'ie', title: 'One draft only', label: 'One draft', md: 'Your teacher (IA) or supervisor (EE) reads and comments on __one draft__. They give advice, but they do not edit it. The next version you submit is final.' },

    { type: 'note', tone: 'warn', lv: 'ie', title: 'The penalty for malpractice', label: 'The penalty for malpractice', md: 'The IB investigates every case of [[malpractice]], including a source missing from the bibliography. If malpractice is confirmed, the penalty can be __no grade in the subject__, and without that grade there is no diploma.' },

    { type: 'note', tone: 'house', lv: 'g', title: 'The same rules at IGCSE', md: 'Your IGCSE lab reports are class work, not exam work. The same rules apply now, so that they become habits before you start the IB.' },

    { type: 'frames', title: 'Sentences that cite a source', items: [
      '___ reported that ___ (___).',
      'According to ___, ___ (___).',
      'As ___ explain, “___” (___ ___).'
    ] }
  ],

  redpen: {
    g: {
      title: 'Part of a background. Four problems.',
      body: '[!a:Enzymes lower] the activation energy of the reactions they catalyse.\n\n[!b:A method found online] was used to measure the starch.\n\n[!c:“High temperatures] will eventually cause enzymes … to denature.”\n\n[!d:The method was copied] from a partner’s report.',
      notes: {
        a: { label: 'whose idea?', why: 'This idea comes from a textbook. A paraphrase is still someone else’s idea: cite it, __(Clark et al.)__.' },
        b: { label: 'which method?', why: 'Name the source of the method, so a reader can find it: __(“Making a Calibration Curve”)__.' },
        c: { label: 'quoted from?', why: 'Quotation marks show that the words are not yours. The citation shows whose they are.' },
        d: { label: 'not yours', why: 'A partner’s words are not yours. Copying them is plagiarism; letting someone copy yours is collusion.' }
      },
      fixed: 'Enzymes lower the activation energy of the reactions they catalyse ==(Clark et al.)==.\n\nThe starch concentration was measured with a colorimeter, ==using a published calibration method (“Making a Calibration Curve”)==.\n\n“High temperatures will eventually cause enzymes … to denature” ==(Clark et al.)==.\n\n==Every word of the method was written independently.==',
      fixedNote: 'Every idea, method and quotation now points to its source, and every word of the method is now the writer’s own.'
    },
    i: {
      title: 'Notes from an IA group. Four problems.',
      body: 'The group had three members.\n\n[!a:One set of data] was collected by the group.\n\n[!b:All three reports] present that data.\n\n[!c:An AI tool wrote] two paragraphs of the background, with no citation.\n\n[!d:Two drafts] were corrected by the teacher.',
      notes: {
        a: { label: 'one question each', why: 'Each person in the group needs a unique research question: a different independent variable, a different dependent variable, or different data from a shared set.' },
        b: { label: 'same raw data', why: 'No one in the group may present the same raw data as another person in the group.' },
        c: { label: 'cite it', why: 'AI text is not your own work. Quote it and cite it with the prompt and the date, or do not use it.' },
        d: { label: 'one draft only', why: 'The teacher comments on one draft and does not edit it. The next version is final.' }
      },
      fixed: 'The three members shared the equipment, but ==each investigated a different independent variable==.\n\n==Each report presents its own raw data==.\n\n==AI-generated text is quoted and cited, with the prompt and the date==.\n\n==The teacher commented on one draft==, and the next version was final.',
      fixedNote: 'Collaboration on the practical work, but everything each person submits is their own.'
    }
  },

  traps: [
    { bad: 'Rewording a textbook sentence, with no citation.', good: 'Reworded or not, the idea is cited.' },
    { bad: 'Letting a friend copy your method.', good: 'That is collusion: you and your friend are both responsible.' },
    { bad: 'A graph from a paper, with no source in the caption.', good: 'Attribute every figure you did not make.' },
    { bad: 'Three reports built on one shared set of raw data.', good: 'Each person in your group presents different raw data.', lv: 'ie' },
    { bad: 'An AI tool’s paragraph, presented as your own writing.', good: 'Quoted, and cited with the prompt and the date.', lv: 'ie' },
    { bad: 'Your IA data and text reused in your EE.', good: 'A new question, with a different approach. Nothing is reused.', lv: 'e' }
  ],

  test: [
    { type: 'sort', q: 'Sort each situation.',
      bins: ['Fine', 'Collusion', 'Plagiarism', 'Needs a citation'],
      items: [
        { t: 'You and your partner share a water bath. Each of you records separate data and writes alone.', bin: 0, why: 'Sharing equipment is fine. Each of you has your own data and your own words.' },
        { t: 'Your teacher gives written advice on your one draft.', bin: 0, why: 'Advice on one draft is part of the process.' },
        { t: 'You let a friend copy your method, word for word.', bin: 1, why: 'Helping someone present work that is not theirs is collusion.' },
        { t: 'Your group writes the method together, and each of you submits it.', bin: 1, why: 'Every word of each report, including the method, must be written alone.' },
        { t: 'A sentence from a website is pasted into your background, with no quotation marks or source.', bin: 2, why: 'Someone else’s words, presented as your own.' },
        { t: 'You submit a friend’s old report as your own.', bin: 2, why: 'Someone else’s work, presented as yours.' },
        { t: 'You explain denaturation in your own words, using a textbook.', bin: 3, why: 'A paraphrase is still the textbook’s idea: cite it.' },
        { t: 'You quote two sentences from an AI tool.', bin: 3, why: 'Quote them and cite the tool, with the prompt and the date.' }
      ] },
    { type: 'choose', q: 'You put an idea from a book into your own words. What must you do?',
      opts: [
        { t: 'Cite the book.', ok: true, why: 'The idea is still the author’s, so you must cite it.' },
        { t: 'Nothing: the words are now yours.', why: 'The words are yours, but the idea is not. Cite it.' },
        { t: 'Put it in quotation marks.', why: 'Quotation marks are for exact words. A paraphrase needs the citation only.' },
        { t: 'Leave the book out of the list, to save words.', why: 'The list does not count towards the words, and every source must be in it.' }
      ] },
    { type: 'choose', q: 'What is the difference between collaboration and collusion?',
      opts: [
        { t: 'Collaboration is working together where it is allowed; collusion is helping someone submit work that is not their own.', ok: true, why: 'Sharing equipment and ideas openly is fine. Sharing the words or the data of a report is not.' },
        { t: 'There is no difference.', why: 'One is allowed, the other is misconduct.' },
        { t: 'Collusion is working in a group of more than three.', why: 'Group size is a separate rule. Collusion is about submitting work that is not your own.' },
        { t: 'Collaboration means copying with permission.', why: 'Copying with permission is collusion.' }
      ] },
    { type: 'spot', q: 'Tap the two sentences that need a citation.',
      text: '[?:The time was recorded every 10 s.] [!a:The α-amylase of *Aspergillus oryzae* works best at a higher temperature than human salivary amylase.] [?:The mean time at 50 °C was 53 s.] [!b:Enzymes lower the activation energy of the reactions they catalyse.]',
      why: { a: 'A fact from published work: cite where it came from.', b: 'A textbook idea, even in your own words: cite it.' } },
    { type: 'build', q: 'Build an honest sentence that uses a source.',
      chips: ['Enzymes lower', 'the activation energy', 'of the reactions they catalyse', '(Clark et al.).', '(openstax.org).', 'I think'],
      answer: ['Enzymes lower', 'the activation energy', 'of the reactions they catalyse', '(Clark et al.).'],
      why: 'The idea is in your own words, and the citation names the author. Never a URL in the text.' },
    { type: 'choose', q: 'Your partner asks to copy your method. If you agree, what is it?',
      opts: [
        { t: 'Collusion: you are helping them submit work that is not theirs.', ok: true, why: 'You and your partner are both responsible.' },
        { t: 'Collaboration, because you agreed.', why: 'Agreement does not make copying allowed.' },
        { t: 'Fine, if you change a few words.', why: 'Changed words are still copied work.' },
        { t: 'Plagiarism by you only.', why: 'Your partner plagiarises; you collude.' }
      ] },
    { type: 'choose', lv: 'g', q: 'Your IGCSE class pools its results. What must still be your own?',
      opts: [
        { t: 'Every word of your report', ok: true, why: 'Shared data are fine when your teacher allows it. The writing is yours alone.' },
        { t: 'Nothing: pooled work is shared', why: 'The data may be shared. The report is not.' },
        { t: 'Only the title', why: 'Every word is your own.' },
        { t: 'Only the graph', why: 'Every word, table and graph is your own work.' }
      ] },
    { type: 'choose', lv: 'i', q: 'How large may an IA group be?',
      opts: [
        { t: 'Up to three people', ok: true, why: 'Collaboration is optional; groups are no larger than three.' },
        { t: 'Up to five people', why: 'The limit is three.' },
        { t: 'Two people only', why: 'Up to three are allowed.' },
        { t: 'Groups are not allowed', why: 'Groups of up to three are allowed, with individual reports.' }
      ] },
    { type: 'multi', lv: 'i', q: 'In an IA group of three, what must be different for each person?',
      opts: [
        { t: 'The research question', ok: true, why: 'Each person answers a unique research question.' },
        { t: 'The raw data presented', ok: true, why: 'No one may present the same raw data as another person in the group.' },
        { t: 'Every word of the report, including the method', ok: true, why: 'Each person writes their own report alone.' },
        { t: 'The laboratory used', why: 'Sharing a room and equipment is fine.' },
        { t: 'The teacher', why: 'The same teacher supervises the whole group.' }
      ],
      why: 'Collaboration is on the practical work. The question, the data and the words are each person’s own.' },
    { type: 'choose', lv: 'ie', q: 'Is using an AI tool allowed?',
      opts: [
        { t: 'Yes, if its output is quoted and cited with the prompt and the date', ok: true, why: 'The IB will not ban AI tools, but AI output is never your own work.' },
        { t: 'No, the IB bans all AI tools', why: 'The IB has said it will not ban them.' },
        { t: 'Yes, and it need not be cited if you edit it', why: 'Edited AI text is still not your own work.' },
        { t: 'Only to write the bibliography', why: 'Any AI output you use must be quoted and cited.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'What can confirmed malpractice lead to?',
      opts: [
        { t: 'No grade in the subject, and so no diploma', ok: true, why: 'The IB takes it seriously: the whole subject can be lost.' },
        { t: 'A warning only', why: 'The IB investigates, and the penalty can be the whole subject grade.' },
        { t: 'One mark lost', why: 'It is not a mark deduction.' },
        { t: 'A lower word limit', why: 'The word limit has nothing to do with it.' }
      ] },
    { type: 'choose', lv: 'e', q: 'Can your IA investigation become your EE?',
      opts: [
        { t: 'No: the same work cannot count for both, and nothing may be duplicated.', ok: true, why: 'The EE needs a clearly different approach. If you reuse content, your diploma is at risk.' },
        { t: 'Yes, if you add 1,000 words.', why: 'Length is not the point: nothing may be duplicated.' },
        { t: 'Yes, if your supervisor agrees.', why: 'The rule is the IB’s, not the supervisor’s.' },
        { t: 'Only the data can be reused.', why: 'No content from one submission may appear in another.' }
      ] }
  ],

  words: [
    { term: 'academic integrity', forms: [], def: 'Honest work: your own ideas and words, with every source you used fully acknowledged.', eg: 'Citing the textbook whose idea you paraphrased.' },
    { term: 'plagiarism', forms: ['plagiarise', 'plagiarised', 'plagiarising'], def: 'Presenting someone else’s words, ideas or work as your own, without acknowledging them.', eg: 'A website’s sentence pasted into a background with no citation.' },
    { term: 'collusion', forms: ['collude', 'colluding'], def: 'Helping another person submit work that is not their own, such as letting them copy yours.', eg: 'Two reports with the same method, written together.' },
    { term: 'collaboration', forms: ['collaborate', 'collaborative'], def: 'Working with others openly, where it is allowed, while each person’s work and words stay their own.', eg: 'An IA group of three sharing equipment, with separate questions and data.' },
    { term: 'malpractice', forms: ['academic malpractice', 'misconduct', 'academic misconduct'], def: 'Any action that gives you or anyone else an unfair advantage. The IB investigates it and can withhold the grade.', eg: 'A source used, but missing from the bibliography.' },
    { term: 'paraphrase', forms: ['paraphrases', 'paraphrased', 'paraphrasing'], def: 'Someone else’s idea, written in your own words. It must still be cited.', eg: 'Enzymes lower the activation energy of the reactions they catalyse (Clark et al.).' }
  ],

  sources: ['IB Biology guide (2025), Academic integrity, pp. 4–5; Internal assessment, pp. 114–119', 'IB Extended essay guide (first assessment 2027), “The ethical researcher” and “double-dipping”', 'IB Academic integrity policy (2023), appendix 6, AI tools']
});
