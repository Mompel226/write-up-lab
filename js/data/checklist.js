/* ============================================================
   checklist.js — "Check my report". Built from Daniel's
   "Lab Report Checklist — Biology IGCSE and IB" (corrected 23 Sep 2026),
   with the IB IA and EE lines checked against the IB guides.
   lv: which levels see the line (g IGCSE · i IB IA · e IB EE).
   part: the station that teaches that group.
   ============================================================ */
(function (WUL) {
  'use strict';
  WUL.CHECKLIST = [
    { title: 'Throughout', part: 'report', items: [
      { id: 'voice', t: 'Third person, past tense, passive voice: no I, we or my.' },
      { id: 'units', t: 'No vague words: every quantity has a number and a unit.' },
      { id: 'open', lv: 'i', t: 'Title, candidate code(s) and word count at the start. No more than 3,000 words (tables, graphs, equations, calculations, citations and headers do not count).' },
      { id: 'openee', lv: 'e', t: 'Title page: student code, research question, subject and word count. No names anywhere. 12-point font, 1.5 line spacing, page numbers. No more than 4,000 words.' }
    ]},
    { title: 'Title and research question', part: 'question', items: [
      { id: 'title', t: 'The title names both variables and the organism or system.' },
      { id: 'rq', t: 'The question gives the independent variable with its range and the dependent variable with its unit.' },
      { id: 'rqsys', lv: 'ie', t: 'It names the system (which organism, tissue or enzyme source), and is placed in context with background theory and a source.' },
      { id: 'rqee', lv: 'e', t: 'The research question is written as a question, is focused, and can be answered in 4,000 words.' }
    ]},
    { title: 'Variables', part: 'variables', items: [
      { id: 'iv', t: 'Independent variable named, with its unit and the values used.' },
      { id: 'dv', t: 'Dependent variable named, with its unit and how it was measured.' },
      { id: 'cv', t: 'Every control variable has three things: the value it was kept at, how it was kept there, and why it would change the result.' },
      { id: 'cvsame', t: 'Nothing is left as “everything else was kept the same”.' },
      { id: 'just', lv: 'ie', t: 'The range, the interval and the number of repeats are each justified.' }
    ]},
    { title: 'Hypothesis', part: 'hypothesis', items: [
      { id: 'shape', t: 'It predicts a direction and a shape: many biological responses are optimum curves or plateaus.' },
      { id: 'bio', t: 'It is justified with biology, not common sense.' },
      { id: 'sketch', lv: 'ie', t: 'Recommended at IB: a sketch graph of the predicted shape.' }
    ]},
    { title: 'Apparatus, safety and method', part: 'method', items: [
      { id: 'qty', t: 'Quantities, sizes and concentrations given for everything.' },
      { id: 'unc', lv: 'ie', t: 'The uncertainty of every measuring instrument is stated.' },
      { id: 'risk', t: 'Each hazard from this method has a precaution (control measure) that matches it.' },
      { id: 'risk4', lv: 'ie', t: 'Risk assessment: hazard, risk, control measures and emergency action.' },
      { id: 'eth', lv: 'ie', t: 'Ethical and environmental issues addressed, not only safety.' },
      { id: 'steps', t: 'The method is numbered, in the past tense and passive voice, and detailed enough to repeat.' },
      { id: 'equil', t: 'Living or enzyme material was given time to reach the test temperature or pH before timing began.' },
      { id: 'reps', t: 'The number of repeats is stated, and it is clear whether they were of the same sample or of different individuals.' }
    ]},
    { title: 'Results: the table', part: 'tables', items: [
      { id: 'tt', t: 'A title above the table, saying what it shows.' },
      { id: 't1', t: 'The independent variable is in the first column.' },
      { id: 'tu', t: 'Units (and uncertainties) are in the headings only, never in the cells.' },
      { id: 'ts', t: 'Quantity and unit separated by a solidus: Temperature / °C.' },
      { id: 'tdp', t: 'The same number of decimal places all the way down each column.' },
      { id: 'tblank', t: 'No blank cells; anything missing is explained.' },
      { id: 'tig', lv: 'g', t: 'One table: the processed columns (such as the mean) to the right of the raw data.' },
      { id: 'tib', lv: 'ie', t: 'Raw data and processed data are clearly separated (our rule: two labelled tables), and each fits on one page.' },
      { id: 'twork', lv: 'ie', t: 'One worked example of every calculation.' },
      { id: 'tee', lv: 'e', t: 'Bulk raw data in an appendix, with a representative sample in the body: examiners are not required to read appendices.' }
    ]},
    { title: 'Results: the graph', part: 'graphs', items: [
      { id: 'gtype', t: 'The right type: a bar chart for categories (gaps), a histogram for frequencies (bars touching), a line graph or scatter graph for continuous data.' },
      { id: 'gax', t: 'Independent variable on the x-axis. Both axes labelled with the quantity and unit, and numbered.' },
      { id: 'gscale', t: 'Scales rise in even steps (1, 2, 5 or 10 per large square) and the points fill more than half the grid in both directions.' },
      { id: 'gpts', t: 'Points plotted as small crosses: never large dots.' },
      { id: 'gline', lv: 'g', t: 'Points joined with ruled straight lines, or a smooth curve if the points clearly lie on one.' },
      { id: 'gext', t: 'The line does not go beyond the first and last points.' },
      { id: 'gkey', t: 'A key if there is more than one set of data.' },
      { id: 'gcap', t: 'A title that describes the graph (below it, as a figure caption, in a report).' },
      { id: 'gerr', lv: 'ie', t: 'Error bars on every mean, and the caption says what they show (range, SD or SE).' },
      { id: 'gfit', lv: 'ie', t: 'Means joined with ruled lines, or a line or curve of best fit only when the shape is justified. R² only for a fitted trend line.' }
    ]},
    { title: 'Data analysis', part: 'analysis', items: [
      { id: 'atr', t: 'The overall trend described in words.' },
      { id: 'akey', t: 'Key values quoted with both coordinates and units: start, peak or optimum, end.' },
      { id: 'acalc', t: 'At least one calculated comparison: a percentage change, a ratio or a gradient.' },
      { id: 'aanom', t: 'Anomalies identified, or it is stated that there were none.' },
      { id: 'aover', lv: 'ie', t: 'Overlap of error bars discussed for the comparisons that matter.' }
    ]},
    { title: 'Conclusion', part: 'conclusion', items: [
      { id: 'chyp', lv: 'g', t: 'States whether the hypothesis was supported.' },
      { id: 'crq', lv: 'ie', t: 'Answers the research question first, using processed data and its uncertainty.' },
      { id: 'cbio', t: 'Explains the biology behind the trend, not only the trend.' },
      { id: 'clit', t: 'Compares the result with a published value, and cites it.' }
    ]},
    { title: 'Evaluation', part: 'evaluation', items: [
      { id: 'erel', t: 'Reliability: number of repeats, means taken, anomalies repeated.' },
      { id: 'eran', t: 'Random errors named, linked to precision, with a way to reduce them.' },
      { id: 'esys', t: 'Systematic errors named, linked to accuracy, with a way to remove them (repeating does not help).' },
      { id: 'eval', t: 'Validity: was the method suitable for the question, and what limits the conclusion?' },
      { id: 'ehuman', t: '“Human error” does not appear anywhere.' },
      { id: 'en', t: 'Sample size is honest: five measurements of one specimen is n = 1, not n = 5.' },
      { id: 'eimp', t: 'Each improvement is tied to a specific weakness already named.' },
      { id: 'erank', lv: 'ie', t: 'The weaknesses are ranked: it says which one had the largest effect on the conclusion.' }
    ]},
    { title: 'Sources', part: 'sources', items: [
      { id: 'scite', t: 'Every source is cited in the text and listed at the end, in one consistent style.' },
      { id: 'sacc', lv: 'ie', t: 'Every online source has the date it was accessed.' },
      { id: 'sai', lv: 'ie', t: 'Any AI tool used is cited, with the prompt and the date.' }
    ]},
    { title: 'Reflection', part: 'reflection', items: [
      { id: 'rpf', lv: 'e', t: 'Three reflection sessions done, and the Reflection and Progress Form statement is no more than 500 words, evaluative, with specific examples.' }
    ]}
  ];
})(window.WUL);
