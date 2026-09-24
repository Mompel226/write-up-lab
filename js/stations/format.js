/* station: format — the opening lines of an IA, the EE title page, contents and pages, and the word limits.
   Facts: IB Biology guide (2025) pp. 114–117; IB Extended essay guide (first assessment 2027) pp. 87–89, 107, 111–112.
   The IA guide gives NO rule for words beyond 3,000: the page says "never exceed it", not "only the first 3,000 are marked". */
(function (WUL) {
  'use strict';
  /* the side-by-side table holds phrases, not numbers: left-aligned, in the text font. (No page in tools/check.mjs, hence try.) */
  try {
    WUL.css('format-station', 'table.dt.wd-format-prose{font:400 .9rem/1.4 var(--sans)}' +
      'table.dt.wd-format-prose th,table.dt.wd-format-prose td{text-align:left;vertical-align:top}');
  } catch (e) { /* no document */ }

  /* a sheet of paper, drawn in HTML; parts carry data-part so the anatomy legend can light them */
  var PAPER = 'background:var(--sheet);border:1px solid var(--edge);box-shadow:var(--shadow-sm);border-radius:2px;padding:18px 18px 22px;font:400 .84rem/1.5 var(--serif);color:var(--ink);min-width:0';
  function pt(n, html, block) {
    return '<span class="pt pt' + n + '" data-part="' + n + '"' + (block ? ' style="display:block"' : '') + '><sup class="ptn" aria-hidden="true">' + n + '</sup>' + html + '</span>';
  }
  function lines(k, w) {
    var out = '';
    for (var i = 0; i < k; i++) out += '<div aria-hidden="true" style="height:6px;border-radius:2px;background:var(--rule-2);margin:7px 0;width:' + (i === k - 1 ? (w || 62) : 96 - (i % 3) * 4) + '%"></div>';
    return out;
  }
  function h(t) { return '<div style="font:650 .8rem/1.3 var(--sans);margin-top:12px">' + t + '</div>'; }
  function foot(n) { return '<div style="text-align:center;font:500 .7rem/1 var(--mono);color:var(--ink-3);margin-top:12px">' + n + '</div>'; }

  var IA_PAGE = '<div style="max-width:430px;margin:0 auto;' + PAPER + '">' +
    pt(1, '<b style="font:650 1rem/1.35 var(--serif)">The effect of temperature on the rate of starch hydrolysis by fungal α-amylase</b>', true) +
    '<div style="margin-top:8px;font:500 .74rem/1.9 var(--mono)">' +
    pt(2, 'Candidate code: abc123') + '<br>' + pt(3, 'Group members: abc124, abc125') + '<br>' + pt(4, 'Word count: 2,870') + '</div>' +
    h('Research question') +
    '<p style="margin:4px 0 0">How does temperature (20.0–60.0 °C) affect the rate of starch hydrolysis by fungal α-amylase from <i>Aspergillus oryzae</i>?</p>' +
    h('Background') + lines(5) + h('Methodology') + lines(3, 40) + foot('1') + '</div>';

  var EE_PAGES = '<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center">' +
    '<div style="flex:1 1 220px;max-width:300px;' + PAPER + ';text-align:center;display:flex;flex-direction:column;gap:14px">' +
      '<div style="font:600 .66rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)">Title page</div>' +
      pt(1, 'Student code: abc123', true) +
      pt(2, '<b>To what extent does temperature affect the rate of starch hydrolysis by α-amylase from <i>Aspergillus oryzae</i>?</b>', true) +
      pt(3, 'Subject: Biology', true) +
      pt(4, 'Word count: 3,940', true) +
      '<div style="margin-top:auto;font:500 .72rem/1.3 var(--sans);color:var(--ink-3)">No names anywhere</div>' +
    '</div>' +
    '<div style="flex:1 1 220px;max-width:300px;' + PAPER + '">' +
      pt(5, '<b style="font:650 .9rem/1.3 var(--serif)">Contents</b>', true) +
      '<div style="font:400 .8rem/1.9 var(--serif);margin-top:6px">' +
      ['1 Introduction', '2 Methodology', '3 Results', '4 Analysis', '5 Discussion', '6 Evaluation', '7 Conclusion', 'References', 'Appendices'].map(function (t, i) {
        var pg = [1, 4, 6, 8, 10, 13, 14, 15, 17][i];
        return '<div style="display:flex;gap:6px"><span>' + t + '</span><span aria-hidden="true" style="flex:1;border-bottom:1px dotted var(--rule);margin-bottom:6px"></span>' + pt(6, String(pg)) + '</div>';
      }).join('') + '</div>' +
      '<div style="text-align:center;font:500 .7rem/1.3 var(--sans);color:var(--ink-3);margin-top:10px">Page 1 is the introduction</div>' +
    '</div></div>';

  WUL.station({
    id: 'format', stage: 'finish', order: 2, title: 'Format and word count', levels: 'ie',
    job: { i: 'Present the opening lines correctly, and keep within 3,000 words, so nothing the examiner needs is lost.', e: 'Present the title page, contents and page numbers correctly, and keep within 4,000 words: examiners stop reading at the limit.' },
    where: { i: 'The top of page 1, and the length of the whole report.', e: 'The title page, the contents page, and the whole essay.' },

    ladder: {
      g: [],
      i: ['At the start: the title, your [[candidate code]], group members’ codes and the [[word count]]', 'No more than 3,000 words; tables and calculations do not count', 'No cover page and no contents page'],
      e: ['A [[title page]] with no names, and a contents page', '12-point font, 1.5 line spacing, numbered pages', '4,000 words: examiners do not read beyond the limit', 'Appendices allowed, but examiners need not read them']
    },

    build: [
      { type: 'anatomy', lv: 'i', title: 'The first page of an IA',
        intro: 'No cover page. Four details go at the top of page 1. Tap a colour to find each one.',
        model: { html: IA_PAGE },
        parts: [
          { n: 1, name: 'The title', note: 'Names the variables and the system.' },
          { n: 2, name: 'Your candidate code', note: 'Letters and numbers, from the IB. Not your name.' },
          { n: 3, name: 'Group members’ codes', note: 'Only if you collected data in a group (up to three people, including you).' },
          { n: 4, name: 'The word count', note: 'The real number, no more than 3,000.' }
        ],
        after: 'The IA guide asks for these four details at the start, and says no cover page or contents page is needed.' },

      { type: 'anatomy', lv: 'e', title: 'The first pages of an EE',
        intro: 'A [[title page]], then a contents page. Tap a colour to find each part.',
        model: { html: EE_PAGES },
        parts: [
          { n: 1, name: 'Student code', note: 'Your code, never your name.' },
          { n: 2, name: 'The research question', note: 'Written as a question, not a statement or a hypothesis.' },
          { n: 3, name: 'The subject', note: 'Biology. An interdisciplinary essay names both subjects and its framework.' },
          { n: 4, name: 'The word count', note: 'No more than 4,000.' },
          { n: 5, name: 'Contents page', note: 'Required: every section, with its page.' },
          { n: 6, name: 'Page numbers', note: 'They start on the first page after the contents page.' }
        ],
        after: 'Your name, your supervisor’s name and your school’s name must not appear anywhere in the file. Font size 12, 1.5 line spacing.' },

      { type: 'table', title: 'Compare the IA and the EE',
        spec: {
          cls: 'wd-format-prose',
          head: [['', 'IB IA', 'IB EE']],
          rows: [
            [{ t: 'Word limit', th: true }, '3,000', '4,000'],
            [{ t: 'Beyond the limit', th: true }, 'No rule in the guide: never exceed it', 'Not read by examiners'],
            [{ t: 'First page', th: true }, 'Title, codes, word count', 'Title page: code, question, subject, word count'],
            [{ t: 'Contents page', th: true }, 'Not needed', 'Required'],
            [{ t: 'Font and pages', th: true }, 'Not set', '12-point, 1.5 spacing, page numbers'],
            [{ t: 'Appendices', th: true }, 'Not mentioned: keep it all in the report', 'Allowed; examiners need not read them'],
            [{ t: 'Drafts read', th: true }, 'One, by your teacher', 'One, by your supervisor']
          ]
        },
        after: 'Both guides agree on what does __not__ count: tables, graphs and diagrams, equations and calculations, citations, the bibliography and headers.' },

      { type: 'note', tone: 'ib', lv: 'i', title: 'Over 3,000 words', label: 'Words beyond 3,000', md: 'The IA guide sets a maximum of 3,000 words, and says nothing about words beyond it. You may hear “only the first 3,000 are marked”: that is how the __EE__ works, not a sentence in the IA guide. Do not test it: never exceed 3,000.' },

      { type: 'note', tone: 'ee', lv: 'e', title: 'Over 4,000 words', label: 'Words beyond 4,000', md: 'Examiners are told not to read or assess anything beyond 4,000 words. Your conclusion comes last, so it is the first thing lost. The guide says an essay over the limit is “negatively compromised across all assessment criteria”.' },

      { type: 'widget', title: 'Plan your word budget', name: 'word-budget' },

      { type: 'rules', title: 'Word count and drafts', items: [
        'Put numbers in __tables__, not sentences: tables, equations and calculations do not count. One [[worked example]] of each calculation is enough.',
        'Citations and the bibliography do not count, so never cut a reference to save words.',
        'Give the real [[word count]], not “about 3,000”.',
        { t: 'Your teacher reads and comments on __one draft__, and does not edit it. The next version you submit is final.', lv: 'i' },
        { t: 'Your supervisor comments on __one draft__, after the interim session. The final version is submitted before the [[viva voce]].', lv: 'e' },
        { t: 'An [[appendix]] may hold the full raw data. Nothing the argument needs goes there.', lv: 'e' }
      ] },

      { type: 'frames', title: 'The opening lines', items: [
        'The effect of ___ on ___ in ___',
        'Candidate code: ___',
        'Group members: ___, ___',
        'Word count: ___'
      ] }
    ],

    redpen: {
      i: {
        title: 'The top of an IA. Four mistakes.',
        body: '[!a:My Enzyme Experiment]\n\nCandidate code: abc123\n\n[!b:Group: Alex and Sam]\n\n[!c:Word count: about 3,000]\n\n[!d:Contents]: 1 Introduction … 2 Method … 3 Results …',
        notes: {
          a: { label: 'which variables?', why: 'Name the variables and the system: __The effect of temperature on the rate of starch hydrolysis by fungal α-amylase__.' },
          b: { label: 'codes, not names', why: 'The guide asks for the candidate code of every group member: __abc124, abc125__.' },
          c: { label: 'exact number', why: 'Give the real count, at or under the limit: __Word count: 2,870__.' },
          d: { label: 'not needed', why: 'An IA needs no contents page. Start the report on page 1.' }
        },
        fixed: '==The effect of temperature on the rate of starch hydrolysis by fungal α-amylase==\n\nCandidate code: abc123\n\nGroup members: ==abc124, abc125==\n\nWord count: ==2,870==',
        fixedNote: 'Title, codes and the exact word count: all at the top of page 1.'
      },
      e: {
        title: 'An EE title page. Four mistakes.',
        body: '[!a:Alex Kim · NLCS Jeju]\n\nResearch question:\n\n[!b:Temperature affects] the rate of starch hydrolysis by α-amylase.\n\nSubject: Biology\n\n[!c:Word count: 4,350]\n\n[!d:Page 1] (on the title page)',
        notes: {
          a: { label: 'no names', why: 'No names anywhere: not yours, not your supervisor’s, not your school’s. Give your student code: __abc123__.' },
          b: { label: 'a question?', why: 'The research question must be a question: __To what extent does temperature affect…?__' },
          c: { label: 'over 4,000', why: 'Examiners stop reading at 4,000 words, so the last 350, including the conclusion, are not assessed.' },
          d: { label: 'too early', why: 'Page numbers start on the first page __after__ the contents page.' }
        },
        fixed: 'Student code: ==abc123==\n\nResearch question:\n\n==To what extent does temperature affect the rate of starch hydrolysis by α-amylase from *Aspergillus oryzae*?==\n\nSubject: Biology\n\nWord count: ==3,940==\n\n==No page number== on the title page',
        fixedNote: 'A code, a real question, the subject and a word count inside the limit. Numbering starts after the contents page.'
      }
    },

    traps: [
      { bad: 'Word count: about 3,000.', good: 'Word count: 2,870.', lv: 'i' },
      { bad: 'A cover page and a contents page for the IA.', good: 'Title, candidate codes and word count at the top of page 1.', lv: 'i' },
      { bad: 'Means calculated in long sentences.', good: 'Means in a table, with one worked example. Neither counts towards the limit.' },
      { bad: 'A background of 900 words.', good: 'A focused background, and real space for the evaluation: 6 of the 24 marks.', lv: 'i' },
      { bad: 'Your name on the title page.', good: 'Your student code only. No names anywhere.', lv: 'e' },
      { bad: 'The key graph in an appendix.', good: 'The key graph in the body. Only the full raw data can go in an appendix.', lv: 'e' },
      { bad: 'Research question: Temperature affects amylase.', good: 'A question: “To what extent does temperature affect…?”', lv: 'e' }
    ],

    test: [
      { type: 'sort', q: 'Does it count towards the word limit?',
        bins: ['Counts', 'Does not count'],
        items: [
          { t: 'The background', bin: 0, why: 'Your own prose counts.' },
          { t: 'The conclusion', bin: 0, why: 'Your own prose counts.' },
          { t: 'The evaluation', bin: 0, why: 'Your own prose counts.' },
          { t: 'A data table', bin: 1, why: 'Data tables do not count.' },
          { t: 'A graph and its axis labels', bin: 1, why: 'Charts and diagrams do not count.' },
          { t: 'A worked calculation of a mean', bin: 1, why: 'Equations, formulas and calculations do not count.' },
          { t: 'The citation (Cumming et al. 8)', bin: 1, why: 'Citations do not count, in any style.' },
          { t: 'The bibliography', bin: 1, why: 'The bibliography does not count.' },
          { t: 'A section header such as “Method”', bin: 1, why: 'Headers do not count.' }
        ] },
      { type: 'choose', q: 'Why present the means in a table rather than in sentences?',
        opts: [
          { t: 'Tables do not count towards the word limit.', ok: true, why: 'The data can be shown in full, and the words are kept for explaining them.' },
          { t: 'Tables count double.', why: 'Tables do not count at all.' },
          { t: 'Examiners skip sentences with numbers.', why: 'They read them. A table is clearer and does not add to the word count.' },
          { t: 'Tables need no units.', why: 'Tables need units in every heading.' }
        ] },
      { type: 'build', q: 'Build the opening lines of an IA, in order.',
        chips: ['The effect of temperature on the rate of starch hydrolysis by fungal α-amylase', 'Candidate code: abc123', 'Group members: abc124, abc125', 'Word count: 2,870', 'Contents', 'Name: Alex Kim'],
        answers: [
          ['The effect of temperature on the rate of starch hydrolysis by fungal α-amylase', 'Candidate code: abc123', 'Group members: abc124, abc125', 'Word count: 2,870'],
          ['The effect of temperature on the rate of starch hydrolysis by fungal α-amylase', 'Candidate code: abc123', 'Word count: 2,870', 'Group members: abc124, abc125']
        ],
        why: 'The title first, then the codes and the word count. No contents page, and codes instead of names.' },
      { type: 'choose', lv: 'i', q: 'What goes at the start of an IA?',
        opts: [
          { t: 'The title, your candidate code, your group members’ codes and the word count', ok: true, why: 'These four details are listed in the IA guide.' },
          { t: 'A cover page with your name and school', why: 'No cover page is needed, and codes are used, not names.' },
          { t: 'A contents page', why: 'The IA guide says no contents page is needed.' },
          { t: 'An abstract', why: 'The IA guide does not ask for an abstract.' }
        ] },
      { type: 'choose', lv: 'i', q: 'An IA has 3,150 words. What does the IA guide say about the last 150?',
        opts: [
          { t: 'Nothing: it sets 3,000 as the maximum. So never exceed it.', ok: true, why: 'The rule is the maximum. The guide gives no rule for what happens beyond it, so do not test it.' },
          { t: 'Only the first 3,000 are read, as in the EE.', why: 'That is the EE rule. The IA guide does not say it.' },
          { t: 'They are allowed if the tables are small.', why: 'Tables do not count at all; the prose limit is still 3,000.' },
          { t: 'One mark is lost for every 100 words.', why: 'No such rule exists.' }
        ] },
      { type: 'choose', lv: 'i', q: 'Your background is 900 words. Why is that a problem?',
        opts: [
          { t: 'It takes words the evaluation needs, and the evaluation is worth a quarter of the marks.', ok: true, why: 'All four criteria are worth 6 marks. A long background leaves too little for the conclusion and the evaluation.' },
          { t: 'Backgrounds do not count, so it is wasted.', why: 'The background counts towards the limit.' },
          { t: 'Examiners only read the first 500 words.', why: 'No such rule exists.' },
          { t: 'It is not a problem: more theory always earns more.', why: 'Only theory that is directly relevant to the question earns credit.' }
        ] },
      { type: 'choose', lv: 'i', q: 'How many drafts does your teacher read and comment on?',
        opts: [
          { t: 'One. The next version is the final one.', ok: true, why: 'The IA guide: the teacher advises on one draft, without editing it.' },
          { t: 'Two', why: 'One draft only.' },
          { t: 'As many as you need', why: 'One draft only.' },
          { t: 'None', why: 'The teacher reads and advises on one draft.' }
        ] },
      { type: 'choose', lv: 'e', q: 'An EE has 4,200 words. What happens?',
        opts: [
          { t: 'Examiners do not read beyond 4,000 words, so the end of the essay is not assessed.', ok: true, why: 'The conclusion comes last, so it is the first part lost.' },
          { t: 'Nothing, if the tables are small.', why: 'Tables never count. The prose is over the limit.' },
          { t: 'One mark is lost from criterion A.', why: 'It is worse: the part beyond the limit is not read, and this can lower the marks in every criterion.' },
          { t: 'The supervisor must cut it.', why: 'The supervisor may not edit your essay. You must cut it.' }
        ] },
      { type: 'multi', lv: 'e', q: 'Which must be on the EE title page?',
        opts: [
          { t: 'Your student code', ok: true },
          { t: 'The research question', ok: true },
          { t: 'The subject', ok: true },
          { t: 'The word count', ok: true },
          { t: 'Your name', why: 'No names anywhere in the file.' },
          { t: 'Your supervisor’s name', why: 'No names anywhere in the file.' }
        ],
        why: 'Student code, research question, subject and word count.' },
      { type: 'choose', lv: 'e', q: 'You put a key graph in an appendix. What is the risk?',
        opts: [
          { t: 'Examiners are not required to read appendices, so it may never be seen.', ok: true, why: 'Anything the argument needs belongs in the body.' },
          { t: 'Appendices count towards the word limit.', why: 'Graphs never count. The risk is that it is not read.' },
          { t: 'Appendices are not allowed.', why: 'They are allowed, but examiners need not read them.' },
          { t: 'There is no risk.', why: 'An unread graph cannot support your argument.' }
        ] },
      { type: 'choose', lv: 'e', q: 'Where does page 1 start in an EE?',
        opts: [
          { t: 'On the first page after the contents page', ok: true, why: 'Page numbers are required, and they begin after the contents page.' },
          { t: 'On the title page', why: 'The title page and the contents page are not numbered.' },
          { t: 'On the contents page', why: 'Numbering starts after the contents page.' },
          { t: 'Anywhere: page numbers are optional', why: 'Page numbers are required in an EE.' }
        ] }
    ],

    words: [
      { term: 'word count', forms: ['word counts', 'word limit'], def: 'The number of words that count towards the limit; tables, graphs, calculations, citations and headers are excluded.', eg: 'IA: no more than 3,000 words. EE: no more than 4,000.' },
      { term: 'appendix', forms: ['appendices'], def: 'Extra material after the references; EE examiners are not required to read it.', eg: 'The full raw data: five trials at each temperature.' },
      { term: 'candidate code', forms: ['candidate codes', 'student code'], def: 'The code the IB gives you, used instead of your name on assessed work.', eg: 'abc123' },
      { term: 'title page', forms: ['title pages'], def: 'The first page of an Extended Essay: student code, research question, subject and word count. No names.', eg: 'Research question: To what extent does temperature affect…?' }
    ],

    sources: ['IB Biology guide (2025), Internal assessment, pp. 114–117', 'IB Extended essay guide (first assessment 2027), “Writing your extended essay”, pp. 87–89, and supervision, pp. 107–112']
  });
})(window.WUL);
