/* station: reflection — the EE's Reflection and Progress Form (RPF), criterion E.
   Facts: IB Extended essay guide (first assessment 2027) pp. 13–14, 41–42, 107–112, 113–114:
   three mandatory sessions (first/initial, interim, final = viva voce); one reflective statement of no more than
   500 words, written at the end, in the language of the essay (else E = 0); a blank or missing RPF scores 0;
   criterion E (4 marks) applies ONLY to the statement; strands "evaluative" and "growth"; the researcher's
   reflection space is "strongly recommended", not compulsory.
   First-person examples live in compare/note/frames blocks only: the reflection is the one place "I" is expected,
   and check.mjs rightly bans first person in anatomy models and red-pen fixes. There is no red pen here for that reason. */
(function (WUL) {
  'use strict';

  /* the timeline of the RPF, drawn as a spine */
  var P = 'var(--ee)';
  function step(n, title, sub, dashed) {
    return '<li style="display:flex;gap:12px;align-items:flex-start;margin-left:-14px;padding:5px 0">' +
      '<span style="flex:none;width:26px;height:26px;border-radius:50%;background:var(--sheet);border:2px ' + (dashed ? 'dashed var(--ink-3)' : 'solid ' + P) + ';color:' + (dashed ? 'var(--ink-3)' : P) +
      ';display:grid;place-items:center;font:700 .7rem/1 var(--mono);position:relative;z-index:1">' + n + '</span>' +
      '<span style="display:grid;gap:2px;padding-top:2px"><b style="font:600 .95rem/1.3 var(--sans);color:var(--ink)">' + title + '</b>' +
      '<span style="font:400 .86rem/1.4 var(--sans);color:var(--ink-2)">' + sub + '</span></span></li>';
  }
  var TIMELINE = '<ol style="list-style:none;margin:0 0 0 13px;padding:0;border-left:2px solid var(--rule)">' +
    step('1', 'First reflection session', 'Your ideas, your topic and your first plans, with your supervisor.') +
    step('2', 'Interim reflection session', 'Your progress, the problems you met, and possible solutions.') +
    step('·', 'One draft, read by your supervisor', 'Written comments on one full draft only. No editing.', true) +
    step('·', 'The final essay is submitted', 'No changes after this point.', true) +
    step('3', 'Final session: the viva voce', 'A short interview that celebrates the finished essay and checks the work is yours.') +
    step('✎', 'Your reflective statement', 'Up to 500 words, written at the end, on the RPF.') +
    '</ol>' +
    '<div style="margin:12px 0 0;border:1.5px dashed ' + P + ';border-radius:4px;padding:8px 10px;font:500 .88rem/1.4 var(--sans);color:var(--ink)">The RPF is uploaded with the essay. It is the only evidence for criterion E: Reflection, 4 marks.</div>';

  WUL.station({
    id: 'reflection', stage: 'finish', order: 4, title: 'The EE reflection', levels: 'e',
    job: 'Show, in one statement of up to 500 words, how the Extended Essay changed you as a learner.',
    where: 'On the Reflection and Progress Form, uploaded separately from the essay.',

    ladder: {
      g: [],
      i: ['No reflection form: the IA has no reflection criterion'],
      e: ['Three reflection sessions: first, interim and final (the [[viva voce]])', 'One [[reflective statement]], up to 500 words, written at the end', 'Evaluate what changed in you, and where you will use it: criterion E, 4 marks']
    },

    build: [
      { type: 'grid2', title: 'The RPF from start to finish',
        items: [
          { label: 'Reflection and Progress Form (RPF)', tone: 'e', v: { html: TIMELINE },
            note: 'The [[Reflection and Progress Form]] replaced the old RPPF (Reflections on planning and progress form). Your supervisor records the three sessions on it.' }
        ] },

      { type: 'rules', title: 'The rules of the RPF', items: [
        'Three sessions with your supervisor are compulsory: the first (initial), the interim and the final session.',
        'The final session is the [[viva voce]], after the finished essay is submitted.',
        'One [[reflective statement]] of __no more than 500 words__, written at the end. Examiners do not read beyond 500.',
        'Write it in the __same language as your essay__. In any other language, criterion E scores 0.',
        'A blank form, or no form, also scores 0 for criterion E.',
        'A [[Researcher’s reflection space|RRS]] is strongly recommended, not compulsory. Record your decisions there as they happen.'
      ] },

      { type: 'note', tone: 'ee', title: 'Write in the first person', label: 'The one place for “I”', md: 'Everywhere in the essay, you write in the third person. The reflective statement is about __you__ as a learner, so here “I” is expected and correct.' },

      { type: 'compare', title: 'Descriptive or evaluative?',
        bad: 'I went to the library and found three papers. Then I did my experiment and wrote it up.',
        good: { md: 'My first three papers all used human salivary amylase. That taught me to check the source of an enzyme before comparing its optimum with mine. I now check the source of every published value, in Chemistry too.' },
        badLabel: 'Descriptive: a diary', goodLabel: 'Evaluative: what changed in you',
        why: 'Criterion E looks for reflection that is “consistently evaluative and includes specific examples”, and that shows “growth and transfer of learning”. A list of what happened is at the bottom of the scale.' },

      { type: 'note', tone: 'tip', title: 'A pattern to follow', label: 'A pattern to use', md: '__What happened__ → __what it changed in you__ → __where you will use it next__.\n\n“In the pilot run, testing with iodine every 30 s gave times too coarse to compare. ==I saw that the sampling interval limited the precision, so I sampled every 10 s.== ==I will run a pilot before fixing the method of any investigation.==”' },

      { type: 'note', tone: 'ee', title: 'What criterion E rewards', label: 'What the examiner asks', md: 'For criterion E, the examiner asks whether you evaluate how the Extended Essay experience affected you as a learner. Two strands are marked: __evaluative__, and __growth__. Criteria A–D judge the essay; E judges only this statement.' },

      { type: 'frames', title: 'Sentences in your own voice', items: [
        'At first I ___, but ___ showed me that ___.',
        'This changed how I ___, because ___.',
        'If I started again, I would ___, because ___.',
        'I will use this again when ___.'
      ] }
    ],

    traps: [
      { bad: 'A diary: “First I chose a topic, then I did the experiment.”', good: 'What a decision taught you, and where you will use it.' },
      { bad: 'A statement of 620 words.', good: 'No more than 500: examiners do not read beyond 500.' },
      { bad: 'A statement in Korean, for an essay written in English.', good: 'The same language as the essay, or criterion E scores 0.' },
      { bad: '“I learned a lot and improved my skills.”', good: 'Name the skill, the moment it changed, and where it transfers.' },
      { bad: 'Nothing recorded until the viva voce.', good: 'Decisions recorded in a Researcher’s reflection space as they happen.' }
    ],

    test: [
      { type: 'choose', q: 'How many reflection sessions are compulsory?',
        opts: [
          { t: 'Three: first, interim and final', ok: true, why: 'All three are recorded on the RPF.' },
          { t: 'One, at the end', why: 'There are three. The last one is the viva voce.' },
          { t: 'Two', why: 'There are three.' },
          { t: 'None: they are recommended', why: 'The three sessions are mandatory. The researcher’s reflection space is the recommended part.' }
        ] },
      { type: 'choose', q: 'What is the viva voce?',
        opts: [
          { t: 'The final reflection session: a short interview with your supervisor after the essay is finished', ok: true, why: 'It celebrates the finished essay, and helps confirm the work is yours.' },
          { t: 'An oral exam with an IB examiner', why: 'It is with your own supervisor, not an examiner.' },
          { t: 'The first meeting, to choose a topic', why: 'That is the first reflection session.' },
          { t: 'A presentation to your class', why: 'It is a conversation with your supervisor.' }
        ] },
      { type: 'choose', q: 'What is the word limit for the reflective statement?',
        opts: [
          { t: '500 words', ok: true, why: 'Examiners do not read or assess beyond 500 words.' },
          { t: '4,000 words', why: 'That is the limit for the essay.' },
          { t: '300 words', why: 'The limit is 500.' },
          { t: 'There is no limit', why: 'The limit is 500 words.' }
        ] },
      { type: 'multi', q: 'Which would score 0 for criterion E?',
        opts: [
          { t: 'A statement in Korean, for an essay written in English', ok: true, why: 'The RPF must be in the language of the essay.' },
          { t: 'A blank form', ok: true, why: 'A blank RPF scores 0.' },
          { t: 'A form that was never submitted', ok: true, why: 'No RPF, no evidence for criterion E.' },
          { t: 'A statement of 480 words', why: 'Within the 500-word limit.' },
          { t: 'A statement that uses “I”', why: 'The reflection is personal: “I” is expected.' }
        ],
        why: 'The RPF is the only evidence for criterion E, so these three leave nothing to mark.' },
      { type: 'sort', q: 'Descriptive, or evaluative?',
        bins: ['Descriptive', 'Evaluative'],
        items: [
          { t: 'I went to the library and found three papers.', bin: 0, why: 'What happened, with no judgement.' },
          { t: 'I met my supervisor three times.', bin: 0, why: 'A fact about the process, nothing more.' },
          { t: 'Then I did the experiment and wrote it up.', bin: 0, why: 'A diary entry.' },
          { t: 'Checking the enzyme’s source changed which papers I trusted.', bin: 1, why: 'It says what changed in the writer.' },
          { t: 'The pilot run taught me to test a method before relying on it; I now do this in Chemistry.', bin: 1, why: 'Growth, with transfer to another subject.' },
          { t: 'Justifying each choice in writing made my IA method clearer too.', bin: 1, why: 'It evaluates a habit and shows where it transferred.' }
        ] },
      { type: 'choose', q: 'Which criterion does the RPF give evidence for?',
        opts: [
          { t: 'E, Reflection (4 marks), and only E', ok: true, why: 'Criterion E applies only to the reflective statement on the RPF.' },
          { t: 'A to D', why: 'A–D judge the essay itself.' },
          { t: 'All five criteria', why: 'Only E.' },
          { t: 'None: it is not marked', why: 'It is the only evidence for criterion E.' }
        ] },
      { type: 'choose', q: 'Is a researcher’s reflection space compulsory?',
        opts: [
          { t: 'No. It is strongly recommended, as a record to write the statement from.', ok: true, why: 'The EE guide recommends it; it is not submitted.' },
          { t: 'Yes, it is uploaded with the essay.', why: 'Only the essay and the RPF are uploaded.' },
          { t: 'Yes, the examiner marks it.', why: 'The examiner marks only the essay and the statement on the RPF.' },
          { t: 'Only for science essays.', why: 'It is recommended for every essay, and required for none.' }
        ] },
      { type: 'build', q: 'Build an evaluative sentence.',
        chips: ['The pilot run', 'showed me that', 'the sampling interval limited the precision,', 'so I now run a pilot', 'before fixing any method.', 'was fun', 'and I liked it.'],
        answer: ['The pilot run', 'showed me that', 'the sampling interval limited the precision,', 'so I now run a pilot', 'before fixing any method.'],
        why: 'It names what happened, what it taught, and where the lesson transfers.' }
    ],

    words: [
      { term: 'Reflection and Progress Form', forms: ['RPF', 'Reflection and Progress Forms'], def: 'The IB form that records three reflection sessions and holds one reflective statement of up to 500 words.', eg: 'It replaced the RPPF, and is uploaded separately from the essay.' },
      { term: 'viva voce', forms: ['viva'], def: 'The final reflection session: a short interview with your supervisor after the finished essay is submitted.', eg: 'You discuss what you learned; your supervisor confirms the work is yours.' },
      { term: 'reflective statement', forms: ['reflective statements'], def: 'Your text on the RPF, up to 500 words, evaluating how the EE changed you as a learner.', eg: '“Checking the enzyme’s source changed which papers I trusted.”' },
      { term: 'Researcher’s reflection space', forms: ['RRS', 'researcher’s reflection space', "researcher's reflection space"], def: 'A personal journal, on paper or digital, for recording ideas and decisions during the EE. Recommended, not compulsory.', eg: 'A dated note of why the sampling interval was cut from 30 s to 10 s.' }
    ],

    sources: ['IB Extended essay guide (first assessment 2027), pp. 13–14, 41–42, 107–112; criterion E, p. 113']
  });
})(window.WUL);
