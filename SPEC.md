# Write-Up Lab — the spec every station and tool follows

A site that teaches students who know almost nothing to write a lab report, then an IB Internal Assessment,
then an IB Extended Essay — **one part at a time**. Built for Dr Daniel Mompel Riera's Biology classes at
NLCS Jeju. **The students are Korean and learn in English**: short sentences, one idea each, the examined word
rather than the everyday one, visual examples wherever something can be shown.

Read first: `docs/lab-reports/BRIEF.md` (what is decided, and the corrections to Daniel's documents),
`docs/lab-reports/RESEARCH-cambridge.md` and `docs/lab-reports/RESEARCH-ib.md` (the facts, with page
numbers), and Daniel's own guides in `docs/lab-reports/source-text/` (his voice and examples — but where the
BRIEF lists a correction, the correction wins). The IB Biology guide's full text is
`docs/lab-reports/source-text/ib-biology-guide-2025.txt`.

**The reference station is `js/stations/variables.js`.** Read it before writing anything. Match its shape,
density and tone.

## Files — who owns what
- Core (do NOT edit; report what you need in your final message): `index.html`, `css/app.css`, `js/core.js`,
  `js/plot.js`, `js/blocks.js`, `js/quiz.js`, `js/app.js`, `js/specimen.js`, `js/data/*`.
- You own only the station files and widget files named in your brief. Each file already exists as a stub and is
  already loaded by `index.html`.
- A widget may add its own CSS with `WUL.css('<widget-name>', '…css…')`. Class names must start with
  `wd-<widget-name>` (e.g. `.wd-graph-doctor__grid`). Use the CSS variables from `css/app.css` (`--ink`, `--ink-2`,
  `--ink-3`, `--sheet`, `--sheet-2`, `--edge`, `--rule`, `--red`, `--red-wash`, `--green`, `--green-wash`,
  `--blue`, `--plum`, `--lvl`, `--lvl-wash`, `--hl`, `--hl-soft`, `--p1…--p6`, `--serif`, `--sans`, `--mono`,
  `--hand`, `--r`, `--shadow`, `--shadow-sm`) so light and dark themes both work. Reusable classes: `.sheet`,
  `.sheet--vis`, `.btn`, `.btn--go`, `.btn--ghost`, `.seg` (segmented buttons with aria-pressed), `.wd-panel`,
  `.wd-row`, `.wd-k`, `.wd-out`, `.chip`, `.chips`, `.fb .fb--ok/.fb--no`, `.hint`, `table.dt`.

## Levels — ONE report, not three (Daniel, 24 Sep 2026)
Level colours: IGCSE green `--green`, IB IA blue `--blue`, IB EE burnt orange `--ee` (#B45309). EE was purple until
25 Sep 2026: at dot size it could not be told from blue. `--plum` is now only a data colour (SE bars in graphs).
There is **no level switch** in the top bar. A part's page shows its first level (IGCSE for most parts) and,
in the SAME list, the IB material marked **IB IA / IB EE** with a dashed outline and a light tint of its level colour (never an
empty box: Daniel, 25 Sep 2026), closed until clicked — so an
IGCSE student meets it and can open it out of curiosity. A build block whose `lv` excludes `g` becomes one of
these IB steps; red pens and question sets with their own IB version get a small IGCSE · IB IA · IB EE switch
inside their tab. Each part's page is **tabs** (Learn · Red pen · Mistakes to avoid · Test yourself · Keywords ·
Go further) and Learn is a **list of steps opened one at a time** — never one long scroll. Give every block a
short plain `title`: it becomes the step's name. The home page is the report itself, two pages of parts you
open in place (`WUL.reportMap` in `js/specimen.js`), each with "How the IB IA / IB EE changes this".
The notes below on `lv` still hold: they decide which steps are IB steps.

`g` IGCSE (Years 9–11) · `i` IB Internal Assessment · `e` IB Extended Essay. The reader picks one in the top bar;
`WUL.level()` returns it. Any content item may carry `lv:'gie'` / `'ie'` / `'g'` … (absent = every level).
`job`, `where`, `redpen`, `frames`, `buildTitle` may be per-level objects `{g:…, i:…, e:…}`; the reader gets
their level's value or the nearest lower one.

## A station
```js
WUL.station({
  id, stage: 'start'|'plan'|'record'|'show'|'sense'|'judge'|'finish', order: <n within stage>,
  title, levels: 'gie',
  job: 'One sentence, ≤ 25 words: what this part is for.',   // or {g,i,e}
  where: 'Where it goes in the report.',                       // or {g,i,e}
  ladder: { g:[…], i:[…], e:[…] },   // what each level ADDS; 1–4 short items each (markup)
  build: [ blocks… ],                // the teaching: 5–10 blocks, visual first
  redpen: { g:{…}, i:{…}, e:{…} },   // a weak example, marked up (see below); one per level where it differs
  traps: [ {bad, good, lv} ],        // 4–6 "where marks are lost": ✘ then ✔, each ≤ 20 words
  frames: [ '…___…' ] or {g,i,e},    // optional sentence frames (a block of type frames is usually better)
  test: [ questions… ],              // 7–10, mixed types; include IB-only ones (lv:'ie') where the station is gie
  words: [ {term, forms:[…], def, eg, lv} ],   // 3–8 keywords THIS station owns (see ownership list)
  further: [ {title, md, cite, lv} ],// 0–2 fenced "beyond the syllabus" panels, each with a real citation
  sources: [ 'IB Biology guide (2025) p. 121', … ]   // what the page was checked against
});
```

### Build blocks (`build: [...]`) — see `js/blocks.js`
- `{type:'anatomy', title, intro, model, parts:[{n,name,note}], after}` — a model answer with colour-coded parts
  `{1:…}`…`{6:…}` in the markup; the legend lights each part. **The best way to teach any written section.**
  `model` may also be `{table:spec}` whose cells use `{n:…}`.
- `{type:'steps', title, intro, stage:{table:spec}|{plot:spec}|{html}, steps:[{title, text, show:[els], focus:[els], lv}], always:[els]}`
  — a walkthrough that BUILDS a table or graph one step at a time. Every element with `data-el` starts hidden; each
  step reveals its `show` list (cumulative) and rings its `focus` list in yellow. It never moves on by itself.
  Table cells get an element id with `{t:'…', el:'iv-head'}`; the caption with `capEl:'title'`.
  Plot element ids are listed at the top of `js/plot.js` (`paper, axis-x, axis-y, ticks-x, ticks-y, label-x,
  label-y, title, caption, key, break, bars, bar-<i>, err-bars, pts-<id>, line-<id>, err-<id>`).
- `{type:'compare', title, bad, good, badLabel, goodLabel, why}` — ✘ and ✔ side by side. `bad`/`good` are markup,
  `{table:spec}`, `{plot:spec}` or `{html}`.
- `{type:'rules', title, items:['markup' | {t, lv, icon}]}` — the key things to remember.
- `{type:'callout', label, md}` — ONE sentence to remember.
- `{type:'note', tone:'ib'|'ee'|'igcse'|'warn'|'tip'|'house', label, title, md}` — use `house` for OUR rules
  (things that are good practice but not an exam requirement — say so honestly).
- `{type:'table', title, spec, after}` · `{type:'plot', title, spec, after}` · `{type:'grid2', title, items:[{label, tone:'g'|'i'|'e'|'red', v, note}]}`
- `{type:'frames', title, items:['… ___ …']}` — sentence frames (`___` becomes a gap). Give every writing station some.
- `{type:'widget', title, name, opts}` — a tool (see below).
- `{type:'text', title, md}` — plain prose. **Use sparingly.** If it can be a picture, a table, a compare or an
  anatomy, it should be.

### Red pen
```js
{ title: 'A student wrote this. Five phrases would lose marks.',
  body: 'markup with [!a:the wrong phrase] …' | {table:spec with [!a:…] in cells} | {plot:spec},
  notes: { a:{label:'2–3 words, handwritten', why:'the reason, and what to write instead'}, … },
  fixed: same kinds, the corrected version (==highlight== what changed),
  fixedNote: 'one sentence' }
```
For a graph, `body:{plot:…}` and each note carries `el:'label-y'` (the plot element to ring), optionally `lx, ly`
(label position in viewBox units). 4–6 marks. Labels are short and blunt, like a teacher's pen: "units!",
"which amylase?", "n = 1", "human error?".

### Questions (`test`) — see `js/quiz.js`. Never free writing.
- `choose` `{q, opts:[{t, ok:true, why}, {t, why}…], show}` — exactly one right; EVERY option has a `why`.
- `multi` `{q, opts:[{t, ok, why}…], why}` — tick all that apply.
- `sort` `{q, bins:[…], items:[{t, bin, why}…]}`
- `order` `{q, items:[in the right order…], why}`
- `spot` `{q, text:'… [!a:mistake] … [?:a fine phrase] …', why:{a:…}}` — include fine phrases too.
- `build` `{q, chips:[…], answer:[…] or answers:[[…],[…]], why}` — include 1–3 distractor chips.
- `show` (optional on any question): a table/plot/markup to look at.
Aim for 7–10 per station, at least four types, easy → harder, IB-only ones last with `lv:'ie'` (or `'e'`).

### Tools (widgets)
```js
WUL.widget('graph-doctor', function (host, opts, ctx) { /* build the DOM inside host */ });
WUL.tool({ name:'graph-doctor', title:'Graph doctor', blurb:'≤ 15 words', station:'graphs', lv:'gie', icon:'✚' });
```
A tool is placed in a station with `{type:'widget', name, opts}` and also gets its own page `#/tool/<name>`.
It must: work by tap and by keyboard (buttons, not bare divs); work at 360 px wide (no fixed widths wider than
the screen; SVG with viewBox and `width:100%`); never move on by itself (the reader presses a button); give
instant feedback that EXPLAINS; read `WUL.level()` when behaviour should differ by level; draw graphs with
`WUL.plot` so every graph on the site looks the same; use `WUL.data` numbers for the running example.
Helpers: `WUL.h(tag, attrs, kids)`, `WUL.md(markup, {inline:true})`, `WUL.table(spec)`, `WUL.plot(spec)`,
`WUL.plotScale(spec)` (→ `px(v)`, `py(v)` to place your own marks), `WUL.mean`, `WUL.sd` (=STDEV.S),
`WUL.fix(v, dp)`, `WUL.shuffle`, `WUL.store.get/set` (per-device memory, key prefix = your widget name),
`WUL.whenLive(node, fn)` (run fn once node is in the page — needed for getBBox).

### The markup (every content string)
`[[keyword]]` or `[[shown words|keyword]]` highlighted, tap for meaning · `==highlight==` ·
`__underline__` (the house style for emphasis — not bold) · `**bold**` sparingly · `*Species name*` ·
`{1:part}`…`{6:part}` anatomy colours · `[!k:mistake]` · `[?:fine phrase]` · blank line = new paragraph.
Units and symbols as real characters: cm³, dm³, s⁻¹, °C, ±, ×, −, µm, α, χ².

## Titles of tables and figures — ONE pattern, everywhere (Daniel, 25 Sep 2026)
"You must lead by example": every table and graph on the site that stands for part of a report carries a
full, informative title, in the SAME pattern, so students copy the pattern. Never "Raw data", "Results",
"Processed data (n = 5)" or "Potato cylinders in sucrose solution" on their own.

**Data tables** (title ABOVE the table):
`Table N. <kind of data> showing the effect of <independent variable (range, unit)> on <dependent variable, and what it was measured on>.`
- kind of data: IGCSE **Data** (one table holds the readings and the means, so there is no need to say which;
  Daniel, 25 Sep 2026) · IB **Raw data** (Table 1) · **Processed data** (Table 2: means, SD, rates) ·
  **Raw and processed data**. Items shown at every level use the IGCSE form.
- IGCSE titles stop after the dependent variable; IB titles end with n (and, for figures, the error bars).
- two measured variables: `… showing the relationship between <X> and <Y> in <organism/sample>.`
- add `(n = 5)` or a condition at the end when it helps: `… (n = 5 at each temperature)`.
- e.g. `Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5).`

**Tables that plan the investigation** (variables, instruments, risks, weaknesses):
`Table N. <what the table lists> for the investigation of the effect of <IV> on <DV>.`

**Figures** (title BELOW the graph):
`Figure N. <type of graph> showing the effect of <IV (range, unit)> on <DV> (n = …; error bars = ± 1 SD).`
- type of graph: **Line graph** · **Bar chart** · **Scatter graph** · **Histogram** · **Box-and-whisker plot** ·
  **Dot plot** (means as crosses above categories, with error bars: used where a bar chart would need a cut axis).
- scatter / correlation: `Figure N. Scatter graph showing the relationship between <X> and <Y> (n = …).`
- histogram: `Figure N. Histogram showing the distribution of <variable> in <sample> (n = …).`
- IB: always say what the error bars are, inside the brackets.

**Rules that go with it**
- An explanation is never the title. "Soil is a category: separate bars" goes in a note or the `why`, and the
  graph keeps a proper figure title.
- In a ✘ example only the mistake being taught is wrong. A wrong-graph-type example still has a proper title;
  only a lesson ABOUT titles shows a bad title (and its fixed version shows the pattern).
- A teaching grid that is not part of a report (e.g. "where each job goes at each level") takes a plain
  heading, not "Table N.".
- `node tools/check.mjs` enforces this on every literal "Table N." / "Figure N." string outside a red-pen mark.

## Where axes start, and how the line is drawn (Daniel, 25 Sep 2026: "it needs to be very, very clear")
Biology rules, taught on the Graphs page (rules block, the `axis-start` widget, wrong examples, test items):
- **Bar chart / histogram:** the y-axis starts at 0. Always. (Cambridge's 9700 learner guide says "usually"; ours
  is stricter because a bar is read by its length: Correll et al. 2020, Yang et al. 2021.)
- **Line / scatter graph:** start at 0 if the points then fill more than half the grid; otherwise start at a round
  number below the lowest value and WRITE it at the corner. 0610 syllabus p. 56: "The axes do not have to include
  (0, 0)". An examiner report (0610 s21 Paper 51) accepts a clearly marked jump from 0, but we never draw one:
  **no zigzag anywhere on the site** except in a ✘ example (`axisBreak` is only for mistakes).
- **The line, IGCSE:** ruled, point to point, first point to last; a line of best fit only when the question asks
  (0610 w23 Paper 52 examiner report); never both kinds; no R² (not in the 0610 syllabus).
- **The line, IA/EE:** means with error bars, then ONE smooth curve or straight line of best fit through the trend
  when biology predicts the shape: the enzyme optimum (rise, then a steep fall) gets a smooth curve, potato osmosis a
  fitted straight line. Point to point only when no shape is expected. (Corrected 25 Sep 2026: Daniel caught
  "point to point, as for an enzyme optimum" — biology DOES predict that shape.) R² only for a line from a fitted
  equation (IB Tool 3; command term Draw); never for a hand-drawn curve. The optimum lies BETWEEN the tested
  temperatures. The EE guide says nothing about graphs. Never R² = 1.000 from a polynomial through every mean.
  IB model enzyme graphs on the site are `line: 'smooth'`; IGCSE ones are `'ruled'`. The conclusion walkthrough's
  green/red segments stay ruled on purpose (they mark the rise and the fall).

## Statistics live INSIDE the data analysis (Daniel, 25 Sep 2026)
Statistics keeps its own part (he likes it separate), but every place says the test goes inside the data analysis:
the Statistics tile ("no section of its own"), the Data analysis tiles (IA and EE), the IA analysis model (part 6,
"The statistical test"), the EE line of argument (a statistics step), a note "No separate statistics section", and
the Statistics page's first block "Where it goes".

## Types of data pop-up (Daniel, 25 Sep 2026, after his Year 7 poster "Types of data")
A keyword can carry `fig: 'data', hi: 'continuous'|'discrete'|'quant'|'qual'|'nominal'|'ordinal'`: its pop-up then
opens wide with `WUL.figs.data` (quantitative = continuous / discrete; qualitative = nominal / ordinal; which test
each leads to; "counting does not always mean χ²"; the IB's D3.2.14 use of "discrete" for blood group). Used by
`measured variable`, `discrete variable` (stats) and `continuous variable`, `categorical variable` (graphs), and
linked from the "Choose the right test" table. Pop-ups close on a WIDTH change only (a phone's toolbar changes height).

## "Two-tailed" is explained where it is used (Daniel, 25 Sep 2026)
The worked t-test has a step "Two tails: either direction" before "Find p"; a grid "Two tails or one?" follows it
(WUL.tailsSvg: t distribution, df = 8, critical t 2.31 two-tailed / 1.86 one-tailed, checked in R). The keyword
`two-tailed test` (fig: 'tails') links every mention: How to report a test, the red pen, the IA and EE models,
Find your test. The two-tailed test IS the normal t-test (=T.TEST(…, 2, …); R's default); one-tailed only when the
direction was predicted before collecting data.
Then "Significant or not? Where t lands": the same curve twice, t = 1.15 in the white (50 °C times 66, 76, 66, 76,
66 s: mean 70 v 74 s, p = 0.28, not significant) and t = 5.77 beyond the red (p = 0.0004); and a callout, "The red
tails and p": with NO real difference, chance alone puts t in the red 5 % of the time (2.5 % at each end).
Wording of p, always: "if there were no real difference, a difference this large would happen by chance less
than 5 % of the time" — NEVER "a less than 5 % chance that the difference is due to chance".

## The p-value has ONE home (Daniel, 25 Sep 2026: "use fewer words; link, don't repeat")
`stats.js` block `id: 'pvalue'`, "What the p-value means", placed BEFORE the worked t-test: one question ("if there
were no real difference, how often would chance alone give a result like yours?"), p read as "times in 100", below /
above 0.05, the rhyme "If p is low, the null must go", a coin-guessing analogy (3 right: 1 in 8; 10 right: about 1 in
1,000), and "never the chance that your hypothesis is right". Everywhere else: one short line and a link to
`#/part/stats/build/pvalue` (app.js opens that step: `#/part/<id>/build/<block id>`). Never write "unlikely to be
due to chance": write "statistically significant" or "chance alone would rarely give a difference this large".

## Overlapping error bars never decide (Daniel, 25 Sep 2026: "fix this, but make sure you explain")
- No overlap (SD, five or more repeats): "a real difference is likely; a test can confirm it".
- Overlap: "the graph **alone** cannot show a difference" + the test's p-value. NEVER "these data do not show a
  difference", "cannot be separated" as a rule, or "no significant difference" from overlap alone.
- The proof on the page (errorbars.js): soils A and D with n = 10 → p = 0.06; the SAME means and SD bars with
  n = 30 → t = 3.47, df = 58, p = 0.001 (Figure 6; checked in R). SD bars show the plants, the test weighs the means.
- Per kind of bar (Cumming, Fidler & Vaux 2007, "Go further"): SD overlap depends on n; SE bars (n ≈ 10+) that
  overlap → p > 0.05, a one-SE gap → p ≈ 0.05; 95 % CIs that do not overlap → p < 0.05, overlap of up to half an
  arm → p ≈ 0.05. Daniel's own IB R tutorial had overlapping CIs (79.4–84.0 vs 75.0–79.8) with t-test p = 0.010.

## The running examples — `js/data/datasets.js` (use these numbers; never invent other amylase data)
- `WUL.data.amylase` — amylase + starch; iodine sampled every **10 s**, so times are multiples of 10 s and their
  uncertainty is **± 10 s** (the sampling interval, NOT the stopwatch's 0.01 s). IGCSE: 3 trials, means
  180/117/73/53/93 s at 20–60 °C. IB: 5 trials, fungal α-amylase from *Aspergillus oryzae*; means
  178/118/74/54/98 s, SD 8.4/8.4/5.5/5.5/8.4 s, SE 3.7/3.7/2.4/2.4/3.7 s, rate (1 ÷ mean time) 5.6/8.5/13.5/18.5/10.2
  ×10⁻³ s⁻¹. Optimum near 50 °C. Temperature ± 0.5 °C.
- `WUL.data.soils` — bean seedlings, 4 soils A–D, n = 10: means 43.0, 43.6, 44.0, 44.3 cm; SD 1.4, 1.6, 1.3, 1.5.
  A to D differ by 1.3 cm (3 %); the SD bars overlap. The bar-chart / truncated-axis example.
- Other examples are fine (pondweed and light, potato cylinders and sucrose, catalase and hydrogen peroxide,
  yeast and sugars, woodlice and humidity with a choice chamber) — biologically correct, realistic numbers.

## Writing rules (Daniel checks every word)
0. **The reader IS the student** (Daniel, 24 Sep 2026). Speak to them as "you". Never write about "a student",
   "students" or "the learner" as if a teacher were reading. Simple words, plain headings, no clever or showy
   introductions. Third persons only for someone else: another student's example, people in an experiment,
   the examiner, members of your group.
1. **Short.** A sentence carries one idea. Most sentences under 20 words. No paragraph over 3 sentences. If a
   block needs more than ~60 words of prose, turn it into a visual, a list, a compare or an anatomy.
2. **The examined word, not the everyday one.** No phrasal verbs (take in, carry out → "was carried out" is the
   one standard exception in methods, used sparingly; go up → increase; find out → determine). "Amount" is never
   a property: volume, mass, concentration, number. Name the process precisely.
3. **Second person, present tense** for teaching text ("You name the…"). **Model answers are impersonal:** third
   person, past tense, passive, never I / we / my / our / you (the checker rejects them).
4. **British spelling**, no exclamation marks, no filler, no emoji. Underline (`__`) for emphasis, not bold.
5. **Keywords:** highlight a keyword the first time it appears in each block. Every `[[keyword]]` must be defined
   by some station (checker enforces). Define only the keywords your station owns (list below); reference the
   rest freely. Definitions: one sentence, ≤ 20 words, at the depth an IGCSE student can use; an `eg` from biology.
6. **Honest about sources.** Distinguish an exam requirement from good practice (`note` tone `house` = "Our
   rule"). Never claim something earns or loses a mark unless RESEARCH-cambridge.md or RESEARCH-ib.md says so.
   Quote the IB criteria only as written there. Never invent a citation: every `cite` must be a real, findable
   source (author, title, year); if unsure, leave `further` out.
7. **Biology must be right.** Enzymes: active site, substrate, enzyme–substrate complex, denaturation (tertiary
   structure, hydrogen/ionic bonds). Do not simplify into something false. Fence university-level material in
   `further`.
8. **Visual first.** Tables and graphs must be SHOWN (WUL.table / WUL.plot), not described. Examples short.
   Highlight the parts that matter with `==…==` or anatomy colours.
9. **Corrections to respect** (from BRIEF.md): a ±2 °C fluctuation is RANDOM error (an offset is systematic);
   control measure = what reduces the risk, emergency action = what to do if it happens; at IB answer the RQ
   first — one line on the hypothesis is allowed ("evaluate hypotheses" is an IB skill) but earns nothing alone;
   IB Evaluation 5–6 = RELATIVE impact (rank the weaknesses); extensions earn nothing in the 2025 IA;
   Cambridge: > half the grid (not ¾), crosses or encircled dots (large dots penalised), axes need not start at 0,
   titles are good practice but never a 0610 mark, a key IS a mark; best-fit lines are allowed at IB (Tool 3) when
   the shape is justified, never beyond the data; R² only for a fitted trend line; no confidence intervals (not in
   the IB course); Campbell 12th ed. = Urry et al.; the new EE: 30 marks, criterion E = Reflection on the RPF.

## Keyword ownership (define only yours; `[[…]]` any)
- variables: independent variable, dependent variable, control variable, fair test, interval, monitored variable
- report: lab report, passive voice, third person, scientific voice
- question: research question, aim, system (as "the system": the organism/tissue/enzyme studied)
- background: scientific context, literature review, background theory
- hypothesis: hypothesis, prediction, sketch graph, optimum
- apparatus: apparatus, materials, resolution, uncertainty, measuring instrument
- safety: hazard, risk, control measure, emergency action, ethics, environmental impact
- method: method, equilibration, pilot run
- tables: raw data, processed data, solidus, column heading, decimal places
- processing: mean, rate, percentage change, significant figures, worked example, derived quantity
- observations: qualitative data, quantitative data, observation
- graphs: line graph, bar chart, histogram, scatter graph, line of best fit, extrapolate, interpolate, key,
  continuous variable, categorical variable, axis, scale
- errorbars: error bar, standard deviation, standard error, range (of data), interquartile range, spread
- stats: t-test, chi-squared test, null hypothesis, p-value, correlation coefficient, coefficient of determination,
  statistically significant, correlation, causation
- analysis: trend, anomalous result, gradient, plateau
- conclusion: conclusion, published value, justify
- discussion: discussion, discrepancy, synthesis
- evaluation: evaluation, weakness, limitation, improvement, relative impact, extension
- measurement: accuracy, precision, reliability, validity, random error, systematic error, repeatable,
  reproducible, true value, technical replicate, true replicate, pseudoreplication, calibration, zero error
- sources: citation, in-text citation, reference list, bibliography, Works Cited, MLA, DOI, access date
- format: word count, appendix, candidate code, title page
- integrity: academic integrity, plagiarism, collusion, collaboration, malpractice, paraphrase
- reflection: Reflection and Progress Form, viva voce, reflective statement, Researcher's reflection space

## Check your work — required before you report
1. `node tools/check.mjs` (from `labs/write-up-lab/`) must print `✔ all checks passed`. Warnings about another
   agent's station are not yours; errors in yours are.
2. A local server runs at `http://127.0.0.1:8830/labs/write-up-lab/index.html` (it serves the whole Biology Hub
   folder). `?lv=g|i|e` before the `#` sets the level, e.g. `index.html?lv=i#/part/tables`.
   - `node tools/smoke.mjs <station-id> [more ids]` renders each station at all three levels in headless Chrome
     and reports script errors, missing tools and empty sections. It must pass.
   - Then LOOK at your pages. Screenshot with
     `/private/tmp/claude-503/-Users-NLCS-Library-CloudStorage-OneDrive-Personal-NLCS-CCA-BioCoders-Claude/d13bf587-264f-4c2e-aadc-b94c7ee1c461/scratchpad/shot.sh "<url>" <out.png> <width> <height>`
     at 1440 × 4000 and at 390 × 6000, and read the PNGs. Save screenshots in that scratchpad folder, never in
     the site. Fix what looks wrong: clipped text, overflow at 390 px, crossed label lines, a graph that is not
     to scale, a legend that covers data. Tools that need tapping: drive them with the Browser tools
     (`mcp__Claude_Browser__*`, the pane is already open at that server) and confirm each button does what it says.
3. Read your own text once more against the Writing rules.
