/* station: sources — referencing in MLA 9, and what the IB requires whatever the style.
   Every model reference below is REAL and was checked on 23 Sept. 2026:
   · Urry et al., Campbell Biology, 12th ed. (Pearson, 2020) — publisher's catalogue
   · Cumming, Fidler & Vaux (2007), J Cell Biol 177(1):7–11, doi 10.1083/jcb.200611141 — Crossref record;
     Rule 1 ("always describe in the figure legends what they are") is on p. 8; SD/range "show how the data are spread" on p. 7
   · Clark, Douglas & Choi, Biology 2e, OpenStax, 28 Mar. 2018, section 6.5 "Enzymes" — openstax.org
   · "Making a calibration curve for starch concentration", Practical Biology, © 2019 Royal Society of Biology, no author
   · Amoeba Sisters, "Enzymes (Updated)", YouTube, uploaded 28 Aug. 2016 (red pen and reference builder) */
WUL.station({
  id: 'sources', stage: 'finish', order: 1, title: 'Sources and referencing', levels: 'gie',
  job: 'Show where every idea, number and image came from, so that a reader can find the source.',
  where: 'A short citation in the text where each source is used, and the full entry in the list at the end.',

  ladder: {
    g: ['Cite a source in the text where it is used', 'List every source at the end, in one style: MLA 9'],
    i: ['Author, date, title and pages, plus an [[access date]] for online sources', 'Paraphrases, images and data cited too', 'A missing reference is treated as [[malpractice]]', 'AI output cited, with the prompt and the date'],
    e: ['The URL for every web source', 'Sources evaluated in the [[discussion]], not only listed']
  },

  build: [
    { type: 'anatomy', title: 'The parts of one reference',
      intro: 'A journal article, in MLA 9. Tap a colour: the same colours are used in the reference builder below.',
      model: 'In the text:\nEvery figure legend should state what its error bars show ({1:Cumming et al.} {6:8}).\n\nIn the Works Cited list:\n{1:Cumming, Geoff, et al.} {2:“Error Bars in Experimental Biology.”} {3:*Journal of Cell Biology*}, {4:vol. 177, no. 1}, {5:2007}, {6:pp. 7–11, https://doi.org/10.1083/jcb.200611141}.',
      parts: [
        { n: 1, name: 'Author', note: 'Surname first. Three or more authors: the first one, then “et al.”. In the text: surname only.' },
        { n: 2, name: 'Title of the source', note: 'In “quotation marks”, because the article is part of something larger.' },
        { n: 3, name: 'Container', note: 'The larger whole, in *italics*: the journal, the book, the website.' },
        { n: 4, name: 'Number', note: 'The volume and issue of the journal.' },
        { n: 5, name: 'Date', note: 'When it was published. The IB requires a date in every entry.' },
        { n: 6, name: 'Location', note: 'Pages, then the [[DOI]] or URL. In the text: only the page you used.' }
      ],
      after: 'MLA 9 has one template of nine core elements: author, title, container, contributor, version, number, publisher, date, location. Give the ones a source has, in that order. Skip the rest.' },

    { type: 'rules', lv: 'ie', title: 'What the IB requires', items: [
      'The IB does not set a style: each school chooses one. Your school uses __[[MLA]] 9__.',
      'One style, used __consistently__. Never mix two.',
      'Every entry: __author__, __date__, __title__, and __page numbers__ where they apply.',
      'Online sources: the __date you accessed__ them. For the EE, the __URL__ as well.',
      'Quotations in quotation marks. __Paraphrases__ are cited too.',
      'Images, graphs and data you did not make: __attributed__ to their source.'
    ] },

    { type: 'note', tone: 'ib', lv: 'ie', title: 'A missing source is malpractice', label: 'Every source matters more than perfect commas', md: 'The IB says you are “not expected to show faultless expertise in referencing”, but you must show “that all sources have been acknowledged”. A misplaced comma is not the problem. A __missing source__ is: the IA guide treats omitted or improper referencing as academic [[malpractice]].' },

    { type: 'note', tone: 'house', lv: 'g', title: 'Cite sources at IGCSE too', md: 'Cambridge does not mark references in the practical paper. Cite your sources in every report: it is honest, and the IB will require it.' },

    { type: 'compare', title: 'A link is not a reference',
      bad: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
      good: 'Clark, Mary Ann, et al. “6.5 Enzymes.” *Biology 2e*, OpenStax, 28 Mar. 2018, openstax.org/books/biology-2e/pages/6-5-enzymes. Accessed 23 Sept. 2026.',
      badLabel: 'A bare URL', goodLabel: 'A full MLA entry',
      why: 'A URL alone has no author, no title and no date, and links break. A full entry can still be traced. MLA drops “https://” from web addresses, but keeps it in a DOI.' },

    { type: 'grid2', title: 'A Works Cited list',
      items: [
        { label: 'The last page of a report', v: { html:
          '<div style="font:400 .95rem/1.55 var(--serif);color:var(--ink);overflow-wrap:anywhere">' +
          '<div style="text-align:center;font-weight:600;margin-bottom:10px">Works Cited</div>' +
          ['Clark, Mary Ann, et al. “6.5 Enzymes.” <i>Biology 2e</i>, OpenStax, 28 Mar. 2018, openstax.org/books/biology-2e/pages/6-5-enzymes. Accessed 23 Sept. 2026.',
            'Cumming, Geoff, et al. “Error Bars in Experimental Biology.” <i>Journal of Cell Biology</i>, vol. 177, no. 1, 2007, pp. 7–11, https://doi.org/10.1083/jcb.200611141.',
            '“Making a Calibration Curve for Starch Concentration.” <i>Practical Biology</i>, Royal Society of Biology, 2019, practicalbiology.org/standard-techniques/making-a-calibration-curve-for-starch-concentration. Accessed 23 Sept. 2026.',
            'Mompel Riera, Daniel. “Lab Report Guide.” IGCSE Biology, NLCS Jeju, 2026. Class handout.',
            'Urry, Lisa A., et al. <i>Campbell Biology</i>. 12th ed., Pearson, 2020.'
          ].map(function (e) { return '<p style="margin:0 0 8px;padding-left:2em;text-indent:-2em">' + e + '</p>'; }).join('') + '</div>' },
          note: '__Alphabetical__ by the first word. Every line after the first is indented: a __hanging indent__. A web page with no author starts with its title, never “Anonymous”.' }
      ] },

    { type: 'rules', title: 'Cite in the text', items: [
      'Author and page, in brackets, before the full stop: (Cumming et al. 8).',
      'Most web pages have no page number: give the author alone, (Clark et al.).',
      'No author? A short title instead: (“Making a Calibration Curve”).',
      '__Never__ a URL in the text.',
      '*Italics* for a whole work: a book, a journal, a website. “Quotation marks” for a part of one: an article, a chapter, a web page.',
      'MLA makes the access date optional. The IB requires it, so always end a web entry with the date, such as “Accessed 23 Sept. 2026.”'
    ] },

    { type: 'note', tone: 'tip', title: 'Bibliography or Works Cited?', label: 'Bibliography or Works Cited?', md: 'The IB says [[bibliography]]; MLA says [[Works Cited]]. They are the same list. Head it Works Cited, and list only the sources cited in the text.' },

    { type: 'widget', title: 'Build a reference', name: 'ref-builder' },

    { type: 'compare', lv: 'ie', title: 'Cite an AI tool',
      bad: 'Above its optimum, the active site of amylase changes shape, so starch can no longer bind to it.',
      good: '“Above its optimum, the active site of amylase changes shape, so starch can no longer bind to it” (“Explain why amylase”).\n\nWorks Cited: “Explain why amylase activity falls above its optimum temperature” prompt. *ChatGPT*, model GPT-4o, OpenAI, 14 Mar. 2025, chatgpt.com.',
      badLabel: 'Presented as your own words', goodLabel: 'Quoted, cited, prompt and date',
      why: 'The IB [[academic integrity]] policy: quote any text, image or graph made by an AI tool in your text. List it in the bibliography, with the prompt and the date it was generated. This is only an example of the format: give your own prompt and date.' },

    { type: 'note', tone: 'tip', title: 'Check reference generators', label: 'Generators help. Check them.', md: 'ZoteroBib (zbib.org) builds an entry from a URL, DOI or ISBN. Generators often make mistakes in the author, the date and the capital letters. Check every entry by eye: a wrong generated entry is still your mistake.' },

    { type: 'frames', title: 'Sentences that cite a source', items: [
      'According to ___, the optimum temperature of ___ is ___ (___).',
      'This agrees with the value of ___ reported by ___ (___ ___).',
      '___ et al. found that ___ (___).'
    ] }
  ],

  redpen: {
    g: {
      title: 'A student’s Works Cited list. Five mistakes.',
      intro: 'Tap each red mark to see what the IB and MLA require instead.',
      body: 'Works Cited\n\n[!a:https://openstax.org/​books/​biology-2e/​pages/​6-5-enzymes]\n\n[!b:Anonymous.] “Making a Calibration Curve for Starch Concentration.” *Practical Biology*, Royal Society of Biology, 2019, practicalbiology.org/standard-techniques/making-a-calibration-curve-for-starch-concentration. Accessed 23 Sept. 2026.\n\n[!c:“Enzymes (Updated).”] *YouTube*, uploaded by Amoeba Sisters, 28 Aug. 2016.\n\n[!d:Lisa A. Urry], et al. [!e:Campbell Biology.] 12th ed., Pearson, 2020.',
      notes: {
        a: { label: 'bare URL', why: 'Give the whole entry: __Clark, Mary Ann, et al. “6.5 Enzymes.” *Biology 2e*, OpenStax, 28 Mar. 2018, openstax.org/… Accessed 23 Sept. 2026.__' },
        b: { label: 'title first', why: 'Never “Anonymous”. With no author, the entry starts with the title of the page.' },
        c: { label: 'incomplete', why: 'This entry stops at the date. A video online also needs its URL and the date you watched it: __www.youtube.com/watch?v=qgVFkRn8f10. Accessed 23 Sept. 2026.__ The IB requires the access date.' },
        d: { label: 'surname first', why: 'The list is alphabetical by surname, so the first author is written __Urry, Lisa A.__' },
        e: { label: 'italics', why: 'A whole book is in italics, not plain text: __*Campbell Biology*__.' }
      },
      fixed: 'Works Cited\n\n==Clark, Mary Ann, et al. “6.5 Enzymes.” *Biology 2e*, OpenStax, 28 Mar. 2018, openstax.org/books/biology-2e/pages/6-5-enzymes. Accessed 23 Sept. 2026.==\n\n“Enzymes (Updated).” *YouTube*, uploaded by Amoeba Sisters, 28 Aug. 2016, ==www.youtube.com/watch?v=qgVFkRn8f10. Accessed 23 Sept. 2026.==\n\n==“Making a Calibration Curve for Starch Concentration.”== *Practical Biology*, Royal Society of Biology, 2019, practicalbiology.org/standard-techniques/making-a-calibration-curve-for-starch-concentration. Accessed 23 Sept. 2026.\n\n==Urry, Lisa A.==, et al. ==*Campbell Biology*==. 12th ed., Pearson, 2020.',
      fixedNote: 'Every entry is complete, in one style, with surnames first and in alphabetical order.'
    }
  },

  traps: [
    { bad: 'Amylase works best at 37 °C (I found this on a website).', good: 'Every figure legend should state what its error bars show (Cumming et al. 8).' },
    { bad: 'A URL pasted into the list.', good: 'Author, title, website, date, URL and the access date.' },
    { bad: 'Citing only the sentences you quoted.', good: 'Citing paraphrases, images and data too.' },
    { bad: 'A list with one MLA entry and one Harvard entry.', good: 'One style, used consistently.' },
    { bad: 'A textbook in the list that is never cited in the text.', good: 'Works Cited lists only what the text cites.' },
    { bad: 'An AI tool’s paragraph with no citation.', good: 'Quoted, and cited with the prompt and the date it was generated.', lv: 'ie' }
  ],

  test: [
    { type: 'choose', q: 'Which is a correct MLA in-text citation?',
      opts: [
        { t: '(Cumming et al. 8)', ok: true, why: 'Author and page, in brackets, with no comma.' },
        { t: '(https://doi.org/10.1083/jcb.200611141)', why: 'Never a URL in the text. The DOI belongs in the list at the end.' },
        { t: '(Cumming, 2007)', why: 'Author and year is another style (Harvard, APA). MLA uses author and page.' },
        { t: '(Geoff Cumming, Journal of Cell Biology)', why: 'Surname only, then the page. The journal goes in the list.' }
      ] },
    { type: 'choose', q: 'In MLA, what is written in italics?',
      opts: [
        { t: 'The name of the journal, book or website', ok: true, why: 'Italics mark a whole work that stands alone.' },
        { t: 'The title of an article or web page', why: 'A part of a larger work goes in “quotation marks”.' },
        { t: 'The author’s name', why: 'Author names are never in italics.' },
        { t: 'The page numbers', why: 'Page numbers are plain text.' }
      ] },
    { type: 'build', q: 'Build the Works Cited entry for this textbook.',
      chips: ['Urry, Lisa A., et al.', '*Campbell Biology*.', '12th ed.,', 'Pearson,', '2020.', 'Lisa A. Urry', '“Campbell Biology.”', 'www.pearson.com'],
      answer: ['Urry, Lisa A., et al.', '*Campbell Biology*.', '12th ed.,', 'Pearson,', '2020.'],
      why: 'Author (surname first), the title in italics, the edition, the publisher, the year.' },
    { type: 'order', q: 'Put the parts of this web-page entry in MLA order.',
      items: ['Clark, Mary Ann, et al.', '“6.5 Enzymes.”', '*Biology 2e*,', 'OpenStax,', '28 Mar. 2018,', 'openstax.org/books/biology-2e/pages/6-5-enzymes.', 'Accessed 23 Sept. 2026.'],
      why: 'Author, title of the page, the container (the website), the publisher, the date, the location, then the access date.' },
    { type: 'spot', q: 'Tap the three citations that are wrong.',
      text: 'Error bars mean nothing unless the legend says what they show [?:(Cumming et al. 8)]. Enzymes lower the activation energy of the reactions they catalyse [!a:(openstax.org/books/biology-2e)]. The starch was measured with a published calibration method [!b:(Anonymous)]. Standard deviation bars show how the data are spread [!c:(Cumming, 2007)].',
      why: { a: 'Never a URL in the text. Give the author: (Clark et al.).', b: '“Anonymous” is never used. With no author, give a short title: (“Making a Calibration Curve”).', c: 'Author and year is another style. In MLA: (Cumming et al. 7). Never mix two styles.' } },
    { type: 'multi', q: 'Which of these must be cited?',
      opts: [
        { t: 'A textbook idea you rewrote in your own words', ok: true, why: 'A paraphrase is still someone else’s idea.' },
        { t: 'A graph copied from a website', ok: true, why: 'Images, graphs and data you did not make are attributed.' },
        { t: 'A published value compared with your result', ok: true, why: 'The reader of your report must be able to trace it.' },
        { t: 'Text written by an AI tool', ok: true, why: 'It is not your own work: quote it and cite it.' },
        { t: 'Your own raw data', why: 'Data you measured yourself are yours.' }
      ],
      why: 'Cite every idea, number, image and sentence that is not your own.' },
    { type: 'sort', q: 'Sort the parts of this entry into MLA’s core elements.',
      bins: ['Author', 'Title of source', 'Container', 'Date', 'Location'],
      items: [
        { t: 'Cumming, Geoff, et al.', bin: 0, why: 'Surname first, then “et al.” for three or more authors.' },
        { t: '“Error Bars in Experimental Biology.”', bin: 1, why: 'The article: a part, so in quotation marks.' },
        { t: '*Journal of Cell Biology*', bin: 2, why: 'The journal holds the article: the container, in italics.' },
        { t: '2007', bin: 3, why: 'The year of publication.' },
        { t: 'pp. 7–11', bin: 4, why: 'Pages are part of the location.' },
        { t: 'https://doi.org/10.1083/jcb.200611141', bin: 4, why: 'The DOI is the location online.' }
      ] },
    { type: 'choose', lv: 'i', q: 'MLA makes the access date optional. What should an IA do?',
      opts: [
        { t: 'Give it for every online source: the IB requires it.', ok: true, why: 'Where MLA and the IB disagree, follow the IB.' },
        { t: 'Omit it, because MLA allows that.', why: 'The IB rule is the one that is checked.' },
        { t: 'Give it only for books.', why: 'Books are not online sources. The access date is for online sources.' },
        { t: 'Put it in the in-text citation.', why: 'The access date goes at the end of the entry in the list.' }
      ] },
    { type: 'choose', lv: 'e', q: 'The EE guide adds two things to every web entry. Which?',
      opts: [
        { t: 'The date it was accessed and the URL', ok: true, why: 'Both are in the EE guide’s minimum list, with author, date, title and pages.' },
        { t: 'The number of words and the language', why: 'Neither is a referencing requirement.' },
        { t: 'The name of the search engine used', why: 'A search engine is not the source.' },
        { t: 'A summary of the page', why: 'That would be an annotated bibliography, which is not required.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'Two sentences in your background were written by an AI tool. What must you do?',
      opts: [
        { t: 'Quote them, and list the tool with the prompt and the date it was generated', ok: true, why: 'The IB academic integrity policy asks for quotation marks, the prompt and the date.' },
        { t: 'Nothing, if you checked that they are true', why: 'Checking is wise, but the words are still not your own.' },
        { t: 'Reword them, then no citation is needed', why: 'Reworded AI text is still not your own work. Cite it.' },
        { t: 'Name the tool in the acknowledgements only', why: 'It must be quoted in the text and listed with the prompt and the date.' }
      ] },
    { type: 'choose', lv: 'ie', q: 'A source used in an IA is missing from the bibliography. What happens?',
      opts: [
        { t: 'It is treated as academic malpractice and investigated.', ok: true, why: 'The IA guide: omitted or improper referencing is academic malpractice.' },
        { t: 'One mark is lost under Conclusion.', why: 'It is not a mark deduction. It is an academic integrity case.' },
        { t: 'Nothing, if the other references are correct.', why: 'Every source must be acknowledged.' },
        { t: 'The word count increases.', why: 'The bibliography does not count towards the words at all.' }
      ] }
  ],

  words: [
    { term: 'citation', forms: ['citations', 'cite', 'cited', 'citing'], def: 'Credit given to a source: a short note in the text that points to a full entry in the list.', eg: '(Cumming et al. 8) points to the Cumming entry in Works Cited.' },
    { term: 'in-text citation', forms: ['in-text citations'], def: 'The short form of a reference inside a sentence. In MLA: the author and the page, in brackets.', eg: '(Cumming et al. 8)' },
    { term: 'reference list', forms: ['reference lists', 'list of references'], def: 'The full list of sources at the end of a report, one entry per source, in one style.', eg: 'The Works Cited page of an IA.' },
    { term: 'bibliography', forms: ['bibliographies'], def: 'The IB’s word for the list of sources at the end; MLA heads the same list Works Cited.', eg: 'The bibliography does not count towards the IA’s 3,000 words.' },
    { term: 'Works Cited', forms: ['Works Cited list'], def: 'MLA’s heading for the list of sources: alphabetical by surname, and only sources cited in the text.', eg: 'Clark… Cumming… “Making a Calibration Curve…” Urry…' },
    { term: 'MLA', forms: ['MLA 9', 'MLA style'], def: 'The Modern Language Association style: author and page in the text, and a Works Cited list at the end.', eg: '(Urry et al.) in the text; Urry, Lisa A., et al. *Campbell Biology*. in the list.' },
    { term: 'DOI', forms: ['DOIs', 'digital object identifier'], def: 'Digital object identifier: a permanent link to a journal article that works even if its web address changes.', eg: 'https://doi.org/10.1083/jcb.200611141' },
    { term: 'access date', forms: ['date of access', 'date accessed'], def: 'The date you read an online source. The IB requires it, although MLA makes it optional.', eg: 'Accessed 23 Sept. 2026.' }
  ],

  sources: ['IB Biology guide (2025), “Acknowledging the ideas or work of another person”, pp. 4–5; referencing and academic integrity, p. 119', 'IB Extended essay guide (first assessment 2027), referencing requirements', 'IB Academic integrity policy (2023), appendix 6, AI tools', 'MLA Handbook, 9th ed. (2021); MLA Style Center, “How do I cite generative AI in MLA style?” (revised 2025)', 'Mompel Riera, “Referencing Your Sources” (2026)']
});
