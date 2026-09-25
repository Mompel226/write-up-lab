/* ============================================================
   widget: table-fixer — a broken results table, drawn as a real
   ruled table. Every fault is a button in the table. Tap it, choose
   one of the fixes: the right one repairs the table in place (green)
   and says why; a wrong one says why not and keeps the fault.

   Four tables: amylase and temperature (WUL.data.amylase), catalase drawn
   as a maths table, pondweed and lamp distance, potato cylinders in sucrose solutions.
   At IB level (WUL.level() 'i' or 'e') each table is the IB version:
   raw-data or processed-data tables, with uncertainty faults.

   A table variant:
     cap   caption cell
     head  header rows; rows  body rows (first cell = independent variable)
     order {f, bad:[row order while broken]}   ivLast: fault id (IV column shown last while broken)
     flip  {f, corner:[across, down], across:[…], rows:[[label, …]…]}: while fault f is unfixed the table is
           drawn turned round, maths-style, with a diagonal corner; fixed, it is head + rows
     faults {id: {q, opts:[{t, ok, why}], rule, note}}
   A cell: 'text' | {t, rs, cs} | {f:faultId, bad, good, t, rs, cs, ph, drop}
     bad/good: the text while broken / once fixed (t = the same text in both)
     ph: what the button shows when bad is empty ('' = a blank cell)
     drop: the cell disappears once its fault is fixed (a column moved out)
   ============================================================ */
(function (WUL) {
  'use strict';
  var h = WUL.h, md = WUL.md, esc = WUL.esc;
  var P = 'wd-table-fixer';

  /* a heading may break before the solidus or the ±, never after it */
  function nb(t) { return String(t).replace(/ \/ /g, ' /\u00a0').replace(/ ± /g, ' ±\u00a0'); }

  function X(f, bad, good, more) {
    var o = { f: f, bad: bad, good: good };
    if (more) for (var k in more) o[k] = more[k];
    return o;
  }

  /* ---------- the tables ---------- */
  function buildTables() {
    var A = WUL.data.amylase;
    var TRIAL3 = ['Trial 1', 'Trial 2', 'Trial 3'];
    var TRIAL5 = ['Trial 1', 'Trial 2', 'Trial 3', 'Trial 4', 'Trial 5'];

    /* shared faults */
    var ORDER = function (iv) {
      return { q: 'The rows are not in order. How should they go?',
        opts: [
          { t: 'In increasing order of ' + iv, ok: true, why: 'The independent variable then increases down the first column, so the pattern is easy to see.' },
          { t: 'In the order the trials were done', why: 'The order you worked in does not show the pattern. Sort by the independent variable.' },
          { t: 'In order of the mean', why: 'Sorting by the result hides the pattern. Sort by the independent variable.' }
        ],
        rule: 'The rows go in increasing order of the independent variable.' };
    };
    var WATER = function (dp1) {
      return { q: 'Every cell in this column is a concentration. What should “water” be?',
        opts: [
          { t: '0.0', ok: true, why: 'Distilled water has no sucrose: 0.0 mol dm⁻³, with 1 d.p. like the rest of the column.' },
          { t: '0', why: 'The right value, but the column has 1 d.p.: write 0.0.' },
          { t: 'distilled water', why: 'Words in a column of numbers. Write the concentration: 0.0.' }
        ],
        rule: 'Numbers only in a column of numbers, all with the same d.p.' };
    };

    /* ===== A. Amylase and temperature ===== */
    var ag = A.g, ai = A.i;
    var aG = {
      cap: X('title', 'Results', 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.'),
      head: [
        [X('ivh', 'Temp', 'Temperature / °C', { rs: 2 }), X('dvh', 'Time for starch to disappear', 'Time for starch to disappear / s', { cs: 4 })],
        TRIAL3.concat(['Mean'])
      ],
      rows: ag.temps.map(function (T, r) {
        var cells = [String(T)];
        ag.trials[r].forEach(function (v, k) {
          if (r === 3 && k === 1) cells.push(X('blank', '', String(v)));
          else cells.push(X('units', v + '\u00a0s', String(v)));
        });
        cells.push(r === 1 ? X('mean', '116.667', String(ag.means[r])) : String(ag.means[r]));
        return cells;
      }),
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 1. Data showing the effect of temperature (20–60 °C) on the time taken for amylase to digest starch.', ok: true, why: 'Numbered, above the table. “Data showing the effect of”, then both variables and the range.' },
            { t: 'Results table', why: 'This says nothing about what was changed or what was measured.' },
            { t: 'Table 1. The effect of temperature on the time taken for amylase to digest starch', why: 'Nearly. Start the same way every time: Table 1. Data showing the effect of … on …' }
          ],
          rule: 'Our rule for every table title: “Table 1. Data showing the effect of [independent variable] on [dependent variable].”' },
        ivh: { q: 'What should this heading say?',
          opts: [
            { t: 'Temperature / °C', ok: true, why: 'The quantity in full, a solidus, then the unit.' },
            { t: 'Temp / degrees', why: '“Temp” is an abbreviation, and “degrees” is not a unit symbol: write °C.' },
            { t: 'Temperature', why: 'Better, but the heading still needs its unit: / °C.' }
          ],
          rule: 'Each heading is quantity / unit, with no abbreviations.' },
        dvh: { q: 'This heading has no unit. Which one is right?',
          opts: [
            { t: 'Time for starch to disappear / s', ok: true, why: 'The unit is written once, here, after a solidus.' },
            { t: 'Time for starch to disappear / secs', why: '“secs” is not a unit symbol. The symbol for seconds is s.' },
            { t: 'Time for starch to disappear / m', why: 'm is the symbol for metres. These times are in seconds: s.' }
          ],
          rule: 'Every column of numbers has a unit in its heading. Use the symbol: s, °C, g, cm³.' },
        units: { q: 'These cells have “s” in them. How do you fix them?',
          opts: [
            { t: 'Delete “s” from every cell', ok: true, why: 'The unit belongs once, in the heading. Cambridge rejects a unit in any data cell.' },
            { t: 'Keep “s” in the cells and remove it from the heading', why: 'The heading is where the unit goes. The cells hold numbers only.' },
            { t: 'Keep “s” only in the first row', why: 'Then the column is inconsistent. Numbers only, in every cell.' }
          ],
          rule: 'Numbers only in the cells. The unit is in the heading.' },
        mean: { q: 'The raw data are whole seconds. Which mean is right?',
          opts: [
            { t: '117', ok: true, why: '116.667 rounds to 117: whole seconds, like every other value in the column.' },
            { t: '116.7', why: 'Still more decimal places than every other value in the column.' },
            { t: '120', why: 'Rounded too far. 117 is already whole seconds.' }
          ],
          rule: 'The same decimal places down each column. Our rule: a mean has no more than the raw data.' },
        blank: { q: 'A reading is missing. What should you do?',
          opts: [
            { t: 'Copy the reading from your notes: 50', ok: true, why: 'Every trial has a value. If one is truly lost, write a dash (–) and explain why under the table.' },
            { t: 'Write 0', why: '0 s would mean the starch disappeared at once. That is a false result.' },
            { t: 'Leave it blank', why: 'A reader cannot tell a lost reading from a forgotten one.' }
          ],
          rule: 'No blank cells. A lost reading is shown as a dash (–), explained under the table.' }
      }
    };

    var aI = {
      cap: X('title', 'Table 1. Results', 'Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5).'),
      head: [
        [X('ivh', 'Temp / °C', 'Temperature / °C ± 0.5', { rs: 2 }),
         X('pm', 'Time for starch to disappear / s ± 0.01', 'Time for starch to disappear / s ± 10', { cs: 5 }),
         X('mixed', 'Mean time / s', null, { rs: 2, drop: true })],
        TRIAL5.slice()
      ],
      rows: ai.temps.map(function (T, r) {
        var cells = [X('order', null, null, { t: T.toFixed(1) })];
        ai.trials[r].forEach(function (v, k) { cells.push(r === 0 && k === 0 ? X('dp', '180.0', '180') : String(v)); });
        cells.push(X('mixed', String(ai.means[r]), null, { drop: true }));
        return cells;
      }),
      order: { f: 'order', bad: [2, 0, 4, 1, 3] },
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 1. Raw data showing the effect of temperature (20.0–60.0 °C) on the time taken for fungal α-amylase to digest starch (n = 5).', ok: true, why: 'It says the table holds raw data, names both variables with the range, names the enzyme, and gives n.' },
            { t: 'Table 1. Amylase results', why: 'Which amylase, which variables, and how many trials? Say all three.' },
            { t: 'Table 1. Raw data', why: 'A good start. Now add “showing the effect of …”, with both variables and n.' }
          ],
          rule: 'Our rule for every IB table title: “Table 1. Raw data showing the effect of [independent variable, with its range] on [dependent variable] (n = …).”' },
        ivh: { q: 'What should this heading say?',
          opts: [
            { t: 'Temperature / °C ± 0.5', ok: true, why: 'The quantity in full, its unit, and the thermometer’s uncertainty.' },
            { t: 'Temperature / °C', why: 'Better, but at IB a raw-data heading also gives its uncertainty.' },
            { t: 'Temp / °C ± 0.5', why: '“Temp” is an abbreviation. Write the quantity in full.' }
          ],
          rule: 'A raw-data heading at IB: quantity / unit ± uncertainty.' },
        pm: { q: 'The stopwatch reads to 0.01 s, but the iodine was tested every 10 s. Which uncertainty is right?',
          opts: [
            { t: 'Time for starch to disappear / s ± 10', ok: true, why: 'The starch disappeared somewhere in the 10 s before the sample. The sampling interval, not the stopwatch, limits each time.' },
            { t: 'Time for starch to disappear / s ± 0.2', why: '0.2 s is a typical reaction time. The 10 s gap between samples is far larger.' },
            { t: 'Time for starch to disappear / s ± 0.01', why: 'That is the stopwatch’s resolution. This method cannot time the end point that closely.' }
          ],
          rule: 'The uncertainty comes from the method. Here it is the 10 s sampling interval.' },
        dp: { q: 'The other times are whole seconds. What should 180.0 be?',
          opts: [
            { t: '180', ok: true, why: 'Every time is a multiple of 10 s. 180.0 claims a precision of 0.1 s that the method never had.' },
            { t: '180.00', why: 'Even more decimal places. The column is in whole seconds.' },
            { t: '180 s', why: 'No unit in the cell: the heading already gives it.' }
          ],
          rule: 'The same decimal places down each column, matching what the method can resolve.' },
        mixed: { q: 'The mean is processed data. Where should it go?',
          opts: [
            { t: 'In Table 2, the processed data, with the SD and the rate', ok: true, why: 'Our rule: raw data in one table, processed data in another. The IB does not require it, but each step is then easy to check.' },
            { t: 'Keep it here, but put it before Trial 1', why: 'A mean is calculated from the trials, so it never comes before them.' },
            { t: 'Delete it: the raw data are enough', why: 'The mean is needed for the analysis. It belongs in the processed-data table.' }
          ],
          note: 'The means now go in Table 2, the processed data, with the standard deviation and the rate.',
          rule: 'Our rule at IB: raw data in Table 1, processed data in Table 2.' },
        order: ORDER('temperature')
      }
    };

    /* ===== B. Pondweed and lamp distance ===== */
    var bD = [10, 20, 30, 40, 50];
    var b3 = [['4.8', '5.1', '4.9', '4.9'], ['3.2', '3.0', '3.3', '3.2'], ['2.1', '1.9', '2.2', '2.1'], ['1.4', '1.2', '1.3', '1.3'], ['0.8', '0.9', '0.7', '0.8']];
    var b5 = [['4.8', '5.1', '4.9', '5.0', '4.7'], ['3.2', '3.0', '3.3', '3.1', '3.4'], ['2.1', '1.9', '2.2', '2.0', '2.3'], ['1.4', '1.2', '1.3', '1.5', '1.2'], ['0.8', '0.9', '0.7', '0.8', '1.0']];
    var bDP = { q: 'Two values break the pattern of the column. What should they be?',
      opts: [
        { t: '5.1 and 3.0', ok: true, why: 'Every volume was read to 0.1 cm³, so every value has 1 d.p. “3” and “3.0” do not say the same thing.' },
        { t: '5.10 and 3.00', why: 'Now these two agree with each other, but not with the rest of the column.' },
        { t: '5 and 3', why: 'Rounding loses the 0.1 cm³ to which each volume was read.' }
      ],
      rule: 'The same decimal places down each column: the precision of the instrument.' };
    var bIVPOS = { q: 'The independent variable is in the last column. Where should it go?',
      opts: [
        { t: 'Move it to the first column', ok: true, why: 'Examiners advise it. The reader of your table looks for the independent variable first, then reads across.' },
        { t: 'Leave it last, next to the mean', why: 'The mean is calculated from the trials. The independent variable comes before both.' },
        { t: 'Put it in the title only', why: 'It must be in the table too, with its values, in the first column.' }
      ],
      rule: 'The independent variable goes in the first column.' };
    var bG = {
      cap: X('title', '', 'Table 1. Data showing the effect of lamp distance (10–50 cm) on the volume of gas released by pondweed in 5 minutes.', { ph: '(no title)' }),
      head: [
        [X('ivpos', null, null, { t: 'Distance of lamp from pondweed / cm', rs: 2 }), X('dvh', 'Volume / cm³', 'Volume of gas collected in 5 min / cm³', { cs: 4 })],
        TRIAL3.concat(['Mean'])
      ],
      rows: bD.map(function (d, r) {
        var v = b3[r].slice();
        var cells = [X('order', null, null, { t: String(d) })];
        cells.push(v[0]);
        cells.push(r === 0 ? X('dp', '5.10', '5.1') : r === 1 ? X('dp', '3', '3.0') : v[1]);
        cells.push(v[2]);
        cells.push(r === 2 ? X('round', '2.0', '2.1') : v[3]);
        return cells;
      }),
      order: { f: 'order', bad: [2, 4, 0, 3, 1] },
      ivLast: 'ivpos',
      faults: {
        title: { q: 'This table has no title. Which one is right?',
          opts: [
            { t: 'Table 1. Data showing the effect of lamp distance (10–50 cm) on the volume of gas released by pondweed in 5 minutes.', ok: true, why: 'Numbered, above the table. It names both variables, the range and the organism.' },
            { t: 'Photosynthesis', why: 'A topic, not a title. Say what was changed and what was measured.' },
            { t: 'Table 1. Pondweed', why: 'Name both variables: lamp distance and volume of gas.' }
          ],
          rule: 'Our rule for every table title: “Table 1. Data showing the effect of [independent variable] on [dependent variable].”' },
        ivpos: bIVPOS,
        order: ORDER('distance'),
        dvh: { q: '“Volume” of what, and over what time?',
          opts: [
            { t: 'Volume of gas collected in 5 min / cm³', ok: true, why: 'The heading says exactly what was measured, and over what time.' },
            { t: 'Volume of oxygen / cm³', why: 'The gas is not pure oxygen, and the heading still needs the time: 5 min.' },
            { t: 'Gas / cm³', why: 'Name the quantity: the volume of gas, collected in 5 min.' }
          ],
          rule: 'A heading names the quantity exactly: volume of what, time for what.' },
        dp: bDP,
        round: { q: 'The trials are 2.1, 1.9 and 2.2. What is the mean?',
          opts: [
            { t: '2.1', ok: true, why: '(2.1 + 1.9 + 2.2) ÷ 3 = 2.066…, which rounds to 2.1.' },
            { t: '2.0', why: '2.066… rounds to 2.1, not to 2.0.' },
            { t: '2.07', why: 'One more decimal place than the raw data.' }
          ],
          rule: 'Round the mean correctly, to the decimal places of the raw data.' }
      }
    };
    var bI = {
      cap: X('title', 'Table 1. Results', 'Table 1. Raw data showing the effect of lamp distance (10.0–50.0 cm) on the volume of gas released by *Elodea* in 5 min (n = 5).'),
      head: [
        [X('ivpos', null, null, { t: 'Distance of lamp from pondweed / cm ± 0.1', rs: 2 }), X('pm', 'Volume of gas collected in 5 min / cm³', 'Volume of gas collected in 5 min / cm³ ± 0.1', { cs: 5 })],
        TRIAL5.slice()
      ],
      rows: bD.map(function (d, r) {
        var v = b5[r].slice();
        var cells = [X('order', null, null, { t: d.toFixed(1) })];
        v.forEach(function (x, k) {
          if (k === 1 && r === 0) cells.push(X('dp', '5.10', '5.1'));
          else if (k === 1 && r === 1) cells.push(X('dp', '3', '3.0'));
          else cells.push(x);
        });
        return cells;
      }),
      order: { f: 'order', bad: [2, 4, 0, 3, 1] },
      ivLast: 'ivpos',
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 1. Raw data showing the effect of lamp distance (10.0–50.0 cm) on the volume of gas released by *Elodea* in 5 min (n = 5).', ok: true, why: 'It says the table holds raw data, names both variables with the range, names the organism, and gives n.' },
            { t: 'Table 1. Pondweed data', why: 'Which pondweed, which variables, and how many trials? Say all three.' },
            { t: 'Table 1. Raw data', why: 'A good start. Now add “showing the effect of …”, with both variables and n.' }
          ],
          rule: 'Our rule for every IB table title: “Table 1. Raw data showing the effect of [independent variable, with its range] on [dependent variable] (n = …).”' },
        pm: { q: 'This raw-data heading has no uncertainty. The syringe is marked every 0.2 cm³, and each volume was read to the nearest 0.1 cm³. Which heading is right?',
          opts: [
            { t: 'Volume of gas collected in 5 min / cm³ ± 0.1', ok: true, why: 'Half of the 0.2 cm³ division: each reading is within 0.1 cm³.' },
            { t: 'Volume of gas collected in 5 min / cm³ ± 0.01', why: 'Far smaller than the syringe can read.' },
            { t: 'Keep the heading, and write ± 0.1 in every cell', why: 'The uncertainty goes once, in the heading, like the unit.' }
          ],
          rule: 'At IB, every raw-data heading gives its uncertainty (±).' },
        ivpos: bIVPOS,
        order: ORDER('distance'),
        dp: bDP
      }
    };

    /* ===== C. Potato cylinders in sucrose solutions ===== */
    var cRows = [['0.0', '2.50', '2.71', '+0.21', '+8.4'], ['0.2', '2.48', '2.58', '+0.10', '+4.0'], ['0.4', '2.52', '2.49', '−0.03', '−1.2'],
                 ['0.6', '2.49', '2.28', '−0.21', '−8.4'], ['0.8', '2.51', '2.21', '−0.30', '−12.0'], ['1.0', '2.50', '2.15', '−0.35', '−14.0']];
    var cG = {
      cap: X('title', 'Osmosis', 'Table 1. Data showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the mass of potato cylinders.'),
      head: [[X('ivh', 'Sucrose', 'Concentration of sucrose solution / mol dm⁻³'), X('twin', 'Mass / g', 'Initial mass / g'), X('twin', 'Mass / g', 'Final mass / g'), 'Change in mass / g', 'Percentage change in mass / %']],
      rows: cRows.map(function (row, r) {
        var c = row.slice();
        if (r === 0) c[0] = X('water', 'water', '0.0');
        if (r === 3) c[3] = X('sign', '0.21', '−0.21');
        if (r === 4) c[4] = X('pc', '−11.952', '−12.0');
        return c;
      }),
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 1. Data showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the mass of potato cylinders.', ok: true, why: 'Numbered, above the table. It names both variables, the range and the tissue.' },
            { t: 'Osmosis in potatoes', why: 'That is the topic. Name both variables.' },
            { t: 'Table 1. Potato masses', why: 'Name the independent variable too: sucrose concentration.' }
          ],
          rule: 'Our rule for every table title: “Table 1. Data showing the effect of [independent variable] on [dependent variable].”' },
        ivh: { q: 'What should this heading say?',
          opts: [
            { t: 'Concentration of sucrose solution / mol dm⁻³', ok: true, why: 'It names the property, concentration, and gives its unit.' },
            { t: 'Amount of sucrose', why: '“Amount” is not a property here. Concentration is, with the unit mol dm⁻³.' },
            { t: 'Sugar / mol dm⁻³', why: 'Name the property (concentration) and the sugar (sucrose).' }
          ],
          rule: 'Name the property: concentration, volume, mass. Never “amount”.' },
        twin: { q: 'Two columns have the same heading. What should they say?',
          opts: [
            { t: 'Initial mass / g and Final mass / g', ok: true, why: 'Two columns, two different quantities: each heading says which one.' },
            { t: 'Mass 1 / g and Mass 2 / g', why: 'The reader of your table still has to guess which is before and which is after.' },
            { t: 'Leave both as Mass / g', why: 'Then nobody can tell the mass before from the mass after.' }
          ],
          rule: 'Each heading names one quantity. No two headings are the same.' },
        water: WATER(),
        sign: { q: 'At 0.6 mol dm⁻³ the mass fell from 2.49 g to 2.28 g. What is the change?',
          opts: [
            { t: '−0.21', ok: true, why: 'Mass was lost, so the change is negative: 2.28 − 2.49 = −0.21.' },
            { t: '0.21 (lost)', why: 'No words in a number cell. The minus sign says the mass was lost.' },
            { t: '−0.2', why: 'The balance reads to 0.01 g, so keep 2 d.p.: −0.21.' }
          ],
          rule: 'A decrease is a negative change: write the minus sign.' },
        pc: { q: '−11.952 has too many digits. What should it be?',
          opts: [
            { t: '−12.0', ok: true, why: 'The column has 1 d.p., and −11.952 rounds to −12.0.' },
            { t: '−12', why: 'The right size, but the column has 1 d.p.: write −12.0.' },
            { t: '−11.9', why: '−11.952 rounds to −12.0, not to −11.9.' }
          ],
          rule: 'The same decimal places down each column, even when the last digit is 0.' }
      }
    };
    var cI = {
      cap: X('title', 'Table 2. Mean percentage change in mass', 'Table 2. Processed data showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the mean percentage change in mass of potato cylinders after 60 min (n = 3).'),
      head: [['Concentration of sucrose solution / mol dm⁻³', X('pmcalc', 'Mean percentage change in mass / % ± 0.01', 'Mean percentage change in mass / %'), 'Standard deviation / %']],
      rows: [
        [X('water', 'water', '0.0'), '+8.2', '0.42'],
        ['0.2', '+3.9', '0.51'],
        ['0.4', '−1.3', '0.35'],
        ['0.6', X('sign', '8.5', '−8.5'), '0.60'],
        ['0.8', X('dp', '−12', '−12.0'), '0.48'],
        ['1.0', '−14.1', X('sd', '0.6557', '0.66')]
      ],
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 2. Processed data showing the effect of sucrose concentration (0.0–1.0 mol dm⁻³) on the mean percentage change in mass of potato cylinders after 60 min (n = 3).', ok: true, why: 'It says the table holds processed data, names both variables with the range, names the tissue, and gives n.' },
            { t: 'Table 2. Results', why: 'Say what was processed, what was changed, and how many cylinders each mean is based on.' },
            { t: 'Table 2. Processed data', why: 'A good start. Now add “showing the effect of …”, with both variables and n.' }
          ],
          rule: 'Our rule for every IB table title: “Table 2. Processed data showing the effect of [independent variable, with its range] on [dependent variable] (n = …).”' },
        pmcalc: { q: 'This column is calculated. Does ± 0.01 belong in its heading?',
          opts: [
            { t: 'No: remove it. The standard deviation column shows the spread.', ok: true, why: 'The balance’s ± 0.01 g does not apply to a calculated percentage. Here the SD column shows the spread.' },
            { t: 'Yes, but write ± 0.01 g', why: 'Grams in a percentage heading: the units do not even match.' },
            { t: 'Yes: keep ± 0.01', why: '0.01 g is the balance’s uncertainty. It is not the uncertainty of a calculated percentage.' }
          ],
          rule: 'An instrument’s ± belongs on raw-data headings, not on a calculated column.' },
        water: WATER(),
        sign: { q: 'At 0.6 mol dm⁻³ the cylinders lost mass. What should 8.5 be?',
          opts: [
            { t: '−8.5', ok: true, why: 'A loss of mass is a negative change.' },
            { t: '8.5 (loss)', why: 'No words in a number cell. The minus sign says it.' },
            { t: '+8.5', why: 'A plus sign means the mass increased. It fell.' }
          ],
          rule: 'A decrease is a negative change: write the minus sign.' },
        dp: { q: 'The other means have 1 d.p. What should −12 be?',
          opts: [
            { t: '−12.0', ok: true, why: 'The same decimal places down the column, even when the last digit is 0.' },
            { t: '−12.00', why: 'Now it has one more decimal place than the rest of the column.' },
            { t: '−12 %', why: 'No unit in the cell: the heading gives %.' }
          ],
          rule: 'The same decimal places down each column, even when the last digit is 0.' },
        sd: { q: 'Every other SD has 2 d.p. How should 0.6557 be written?',
          opts: [
            { t: '0.66', ok: true, why: 'Like every SD in the column: 2 d.p., one more than the means (our rule).' },
            { t: '0.7', why: 'Every other SD has 2 d.p. Keep the column consistent: 0.66.' },
            { t: '1', why: 'Rounded far too much, and the column has 2 d.p.' }
          ],
          rule: 'An SD has the same decimal places as the rest of its column: at most one more than the mean (our rule).' }
      }
    };

    /* ===== B. Catalase, drawn as a maths table (turned round, with a diagonal corner) =====
       Potato discs in hydrogen peroxide; oxygen collected for 30 s. Means checked: 2.2, 4.1, 6.1, 7.7, 8.7. */
    var dD = [1, 2, 3, 4, 5];
    var d3 = [['2.1', '2.4', '2.0', '2.2'], ['4.2', '3.9', '4.2', '4.1'], ['6.0', '6.3', '6.1', '6.1'], ['7.6', '7.9', '7.7', '7.7'], ['8.7', '8.9', '8.6', '8.7']];
    function col(k) { return d3.map(function (r) { return r[k]; }); }
    var FLIP = function (ib) {
      return { q: 'This is a maths table: the concentrations run across the top, and a diagonal line splits the corner. What should change?',
        opts: [
          { t: 'Turn it round: concentration down the first column, then one column for each trial' + (ib ? '' : ' and the mean'), ok: true, why: 'In biology, the independent variable runs down the first column, and every column has its own heading with its unit. The volume of oxygen now has a heading too.' },
          { t: 'Keep the layout, but rub out the diagonal line', why: 'The concentrations would still run across the top. Turn the table round.' },
          { t: 'Keep it: the numbers are all there', why: 'The numbers are there, but nothing says what they measure, or in what unit. Turn the table round, and give each column a heading.' }
        ],
        rule: 'The independent variable runs down the first column, never across the top. No diagonal corner: every column has its own heading.' };
    };
    var dG = {
      cap: X('title', '', 'Table 1. Data showing the effect of hydrogen peroxide concentration (1–5 %) on the volume of oxygen released by catalase in potato in 30 s.', { ph: '(no title)' }),
      flip: { f: 'flip', corner: ['Concentration / %', 'Trial'], across: dD.map(String),
        rows: [['1'].concat(col(0)), ['2'].concat(col(1)), ['3'].concat(col(2)), ['Mean'].concat(col(3))] },
      head: [[{ t: 'Concentration of hydrogen peroxide / %', rs: 2 }, { t: 'Volume of oxygen collected in 30 s / cm³', cs: 4 }], TRIAL3.concat(['Mean'])],
      rows: dD.map(function (d, r) { return [String(d)].concat(d3[r]); }),
      faults: {
        title: { q: 'This table has no title. Which one is right?',
          opts: [
            { t: 'Table 1. Data showing the effect of hydrogen peroxide concentration (1–5 %) on the volume of oxygen released by catalase in potato in 30 s.', ok: true, why: 'Numbered, above the table. It names both variables, the range and the enzyme.' },
            { t: 'Catalase', why: 'A topic, not a title. Say what was changed and what was measured.' },
            { t: 'Table 1. Hydrogen peroxide and oxygen', why: 'It names two substances, not the two variables. Use: Data showing the effect of … on …' }
          ],
          rule: 'Our rule for every table title: “Table 1. Data showing the effect of [independent variable] on [dependent variable].”' },
        flip: FLIP(false)
      }
    };
    var dI = {
      cap: X('title', 'Table 1. Catalase results', 'Table 1. Raw data showing the effect of hydrogen peroxide concentration (1.0–5.0 %) on the volume of oxygen released by catalase in potato in 30 s (n = 3).'),
      flip: { f: 'flip', corner: ['Concentration / %', 'Trial'], across: dD.map(function (d) { return d.toFixed(1); }),
        rows: [['1'].concat(col(0)), ['2'].concat(col(1)), ['3'].concat(col(2))] },
      head: [[{ t: 'Concentration of hydrogen peroxide / %', rs: 2 }, { t: 'Volume of oxygen collected in 30 s / cm³ ± 0.1', cs: 3 }], TRIAL3.slice()],
      rows: dD.map(function (d, r) { return [d.toFixed(1)].concat(d3[r].slice(0, 3)); }),
      faults: {
        title: { q: 'What should the title be?',
          opts: [
            { t: 'Table 1. Raw data showing the effect of hydrogen peroxide concentration (1.0–5.0 %) on the volume of oxygen released by catalase in potato in 30 s (n = 3).', ok: true, why: 'It says the table holds raw data, names both variables with the range, names the enzyme, and gives n.' },
            { t: 'Table 1. Catalase results', why: 'Which variables, and how many trials? Say both.' },
            { t: 'Table 1. Raw data', why: 'A good start. Now add “showing the effect of …”, with both variables and n.' }
          ],
          rule: 'Our rule for every IB table title: “Table 1. Raw data showing the effect of [independent variable, with its range] on [dependent variable] (n = …).”' },
        flip: FLIP(true)
      }
    };

    return [
      { id: 'amylase', name: 'Amylase and temperature', g: aG, i: aI },
      { id: 'catalase', name: 'Catalase and hydrogen peroxide: a maths table', g: dG, i: dI },
      { id: 'pondweed', name: 'Pondweed and lamp distance', g: bG, i: bI },
      { id: 'potato', name: 'Potato cylinders in sucrose solutions', g: cG, i: cI }
    ];
  }

  /* ---------- the tool ---------- */
  WUL.widget('table-fixer', function (host, opts) {
    var TABLES = buildTables();
    var ib = WUL.level() !== 'g';
    var st = {};
    var ti = +WUL.store.get('table-fixer.table', 0) || 0;
    if (opts && opts.start != null) ti = opts.start;
    ti = ((ti % TABLES.length) + TABLES.length) % TABLES.length;
    var uid = 'tf' + Math.random().toString(36).slice(2, 7);

    var root = h('div', { class: P });
    host.appendChild(root);

    function V() { var t = TABLES[ti]; return ib ? (t.i || t.g) : t.g; }
    function faultIds() { return Object.keys(V().faults); }
    function reset() {
      st = { fixed: {}, open: null, tried: {}, msg: null, src: '', optOrder: {} };
      faultIds().forEach(function (f) { st.optOrder[f] = WUL.shuffle(V().faults[f].opts.map(function (o, k) { return k; })); st.tried[f] = {}; });
    }

    function cell(tag, c) {
      if (c == null) c = '';
      if (typeof c !== 'object') c = { t: String(c) };
      if (c.f && c.drop && st.fixed[c.f]) return null;
      var el = h(tag);
      if (c.rs) el.rowSpan = c.rs;
      if (c.cs) el.colSpan = c.cs;
      if (!c.f) { el.innerHTML = md(nb(c.t || ''), { inline: true }); return el; }
      if (st.fixed[c.f]) {
        el.className = P + '__ok';
        el.innerHTML = '<span class="' + P + '__okt">' + md(nb(c.good != null ? c.good : c.t), { inline: true }) + '</span>';
        return el;
      }
      var bad = c.bad != null ? c.bad : c.t;
      var blank = bad === '';
      var b = h('button', { type: 'button', class: P + '__f' + (blank ? ' ' + P + '__f--blank' : ''), 'data-f': c.f, 'data-blank': blank ? (c.ph || '') : null,
        'aria-expanded': st.open === c.f ? 'true' : 'false', 'aria-controls': uid + '-panel',
        'aria-label': (blank ? (c.ph ? 'Missing: ' + c.ph : 'Blank cell') : bad) + '. Possible fault: tap to fix.' });
      b.innerHTML = blank ? (c.ph ? '<span class="' + P + '__ph">' + esc(c.ph) + '</span>' : '<span aria-hidden="true">?</span>') : md(nb(bad), { inline: true });
      el.appendChild(b);
      if (st.open === c.f) el.classList.add(P + '__cell--open');
      return el;
    }

    function tableNode() {
      var v = V();
      var t = h('table', { class: 'dt ' + P + '__table' });
      var cap = cell('caption', v.cap); if (cap) t.appendChild(cap);
      if (v.flip && !st.fixed[v.flip.f]) return flipped(t, v.flip);
      var ivLast = v.ivLast && !st.fixed[v.ivLast];
      var thead = h('thead');
      v.head.forEach(function (row, ri) {
        var cells = row.slice();
        if (ri === 0 && ivLast) cells.push(cells.shift());
        var tr = h('tr');
        cells.forEach(function (c) { var n = cell('th', c); if (n) tr.appendChild(n); });
        thead.appendChild(tr);
      });
      t.appendChild(thead);
      var tb = h('tbody');
      var order = v.rows.map(function (r, i) { return i; });
      if (v.order && !st.fixed[v.order.f]) order = v.order.bad;
      order.forEach(function (i) {
        var cells = v.rows[i].slice();
        if (ivLast) cells.push(cells.shift());
        var tr = h('tr');
        cells.forEach(function (c) { var n = cell('td', c); if (n) tr.appendChild(n); });
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      return t;
    }

    /* the maths layout: the independent variable across the top, a diagonal corner, labels down the side */
    function flipped(t, fl) {
      var thead = h('thead'), tr = h('tr');
      var corner = h('th', { class: 'dt-diag' + (st.open === fl.f ? ' ' + P + '__cell--open' : '') });
      var b = h('button', { type: 'button', class: P + '__f ' + P + '__f--diag', 'data-f': fl.f, 'data-src': fl.corner[0] + ' ╲ ' + fl.corner[1],
        'aria-expanded': st.open === fl.f ? 'true' : 'false', 'aria-controls': uid + '-panel',
        'aria-label': 'A corner split by a diagonal line: ' + fl.corner[0] + ' across the top, ' + fl.corner[1] + ' down the side. Possible fault: tap to fix.' });
      b.innerHTML = WUL.diagCell(fl.corner);
      corner.appendChild(b);
      tr.appendChild(corner);
      fl.across.forEach(function (x) { tr.appendChild(h('th', { html: md(String(x), { inline: true }) })); });
      thead.appendChild(tr);
      t.appendChild(thead);
      var tb = h('tbody');
      fl.rows.forEach(function (r) {
        var row = h('tr');
        row.appendChild(h('th', { html: md(String(r[0]), { inline: true }) }));
        r.slice(1).forEach(function (c) { row.appendChild(h('td', { html: md(String(c), { inline: true }) })); });
        tb.appendChild(row);
      });
      t.appendChild(tb);
      return t;
    }

    function draw(focusSel) {
      var v = V(), ids = faultIds();
      var nFixed = ids.filter(function (f) { return st.fixed[f]; }).length, all = nFixed === ids.length;
      root.innerHTML = '';

      /* top bar */
      var top = h('div', { class: P + '__top' });
      top.appendChild(h('div', { class: P + '__which', html: '<span class="' + P + '__k">Broken table ' + (ti + 1) + ' of ' + TABLES.length + (ib ? ' · IB' : '') + '</span><span class="' + P + '__name">' + esc(TABLES[ti].name) + '</span>' }));
      var pips = ids.map(function (f) { return '<i class="' + (st.fixed[f] ? 'on' : '') + '"></i>'; }).join('');
      top.appendChild(h('div', { class: P + '__count' + (all ? ' is-done' : ''), 'aria-live': 'polite', html: '<span><b>' + nFixed + '</b> of <b>' + ids.length + '</b> fixed</span><span class="' + P + '__pips" aria-hidden="true">' + pips + '</span>' }));
      var another = h('button', { type: 'button', class: 'btn btn--ghost ' + P + '__another', text: 'Try another table →' });
      another.addEventListener('click', function () { ti = (ti + 1) % TABLES.length; WUL.store.set('table-fixer.table', ti); reset(); draw('.' + P + '__f'); });
      top.appendChild(another);
      root.appendChild(top);

      /* the table */
      var sheet = h('div', { class: 'sheet sheet--vis ' + P + '__sheet' + (all ? ' is-done' : '') });
      var sc = h('div', { class: 'tscroll' });
      sc.appendChild(tableNode());
      sheet.appendChild(sc);
      ids.forEach(function (f) { var ft = v.faults[f]; if (st.fixed[f] && ft.note) sheet.appendChild(h('p', { class: P + '__note', html: '✔ ' + md(ft.note, { inline: true }) })); });
      root.appendChild(sheet);
      sheet.addEventListener('click', function (e) {
        var b = e.target.closest('.' + P + '__f'); if (!b) return;
        var f = b.getAttribute('data-f');
        st.open = f; st.msg = null;
        st.src = b.hasAttribute('data-src') ? b.getAttribute('data-src') : b.hasAttribute('data-blank') ? b.getAttribute('data-blank') : b.textContent.trim();
        draw('.' + P + '__opt:not([disabled])');
      });

      /* the panel */
      var panel = h('div', { class: P + '__panel' + (st.open ? ' is-open' : ''), id: uid + '-panel' });
      if (!st.open) {
        panel.innerHTML = '<p class="' + P + '__hint">' + (nFixed ? 'Good. Tap the next red wavy line.' : 'Every part with a <span class="' + P + '__wavy">red wavy line</span> is a fault. Tap one, then choose the fix.') + (ib && !nFixed ? ' At IB, check the uncertainties too.' : '') + '</p>';
      } else {
        var ft = v.faults[st.open], done = !!st.fixed[st.open];
        var srcTxt = st.src ? '<span class="' + P + '__was">' + esc(st.src) + '</span>' : '<span class="' + P + '__was ' + P + '__was--blank">blank</span>';
        panel.appendChild(h('p', { class: P + '__q', html: srcTxt + ' <span>' + md(ft.q, { inline: true }) + '</span>' }));
        var list = h('div', { class: P + '__opts', role: 'group', 'aria-label': 'Choose the fix' });
        st.optOrder[st.open].forEach(function (k) {
          var o = ft.opts[k], tried = st.tried[st.open][k];
          var cls = P + '__opt' + (done && o.ok ? ' is-ok' : '') + (tried ? ' is-no' : '');
          var b = h('button', { type: 'button', class: cls, 'data-k': k, html: '<span class="' + P + '__mk" aria-hidden="true">' + (done && o.ok ? '✔' : tried ? '✘' : '') + '</span><span>' + md(o.t, { inline: true }) + '</span>' });
          if (done || tried) b.disabled = true;
          list.appendChild(b);
        });
        panel.appendChild(list);
        list.addEventListener('click', function (e) {
          var b = e.target.closest('.' + P + '__opt'); if (!b || b.disabled) return;
          var k = +b.getAttribute('data-k'), o = ft.opts[k];
          if (o.ok) { st.fixed[st.open] = true; st.msg = { ok: true, why: o.why }; draw('.' + P + '__fb'); }
          else { st.tried[st.open][k] = true; st.msg = { ok: false, why: o.why }; draw('.' + P + '__opt:not([disabled])'); }
        });
        if (st.msg) {
          panel.appendChild(h('div', { class: 'fb ' + P + '__fb ' + (st.msg.ok ? 'fb--ok' : 'fb--no'), tabindex: '-1', role: 'status',
            html: '<span class="fb__k">' + (st.msg.ok ? '✔ Fixed' : '✘ Not this one') + '</span> ' + md(st.msg.why, { inline: true }) + (st.msg.ok ? '' : ' The fault is still there: try again.') }));
        }
        if (done && !all) panel.appendChild(h('p', { class: P + '__hint', text: 'Now tap the next red wavy line.' }));
      }
      root.appendChild(panel);

      /* the end: the rules used */
      if (all) {
        var seen = {}, rules = [];
        ids.forEach(function (f) { var r = v.faults[f].rule; if (r && !seen[r]) { seen[r] = 1; rules.push(r); } });
        var end = h('div', { class: P + '__end' });
        end.appendChild(h('p', { class: P + '__endk', html: '✔ All ' + ids.length + ' fixed. This table now follows every rule.' }));
        end.appendChild(h('p', { class: P + '__endp', text: 'The rules you used:' }));
        var ul = h('ul', { class: P + '__rules' });
        rules.forEach(function (r) { ul.appendChild(h('li', { html: md(r, { inline: true }) })); });
        end.appendChild(ul);
        var row = h('div', { class: 'wd-row' });
        var nx = h('button', { type: 'button', class: 'btn btn--go', text: 'Try another table →' });
        nx.addEventListener('click', function () { another.click(); });
        var again = h('button', { type: 'button', class: 'btn btn--ghost', text: 'Start this table again ↺' });
        again.addEventListener('click', function () { reset(); draw('.' + P + '__f'); });
        row.appendChild(nx); row.appendChild(again);
        end.appendChild(row);
        root.appendChild(end);
      }

      if (focusSel) {
        var fEl = root.querySelector(focusSel);
        if (fEl && root.isConnected) { try { fEl.focus({ preventScroll: true }); } catch (e) { fEl.focus(); } }
        if (st.open && root.isConnected) {
          var pr = panel.getBoundingClientRect();
          if (pr.bottom > window.innerHeight || pr.top < 0) panel.scrollIntoView({ block: 'nearest', behavior: WUL.reduced() ? 'auto' : 'smooth' });
        }
      }
    }

    reset();
    draw();
  });

  (WUL.tool || function (t) { (WUL.TOOLS = WUL.TOOLS || []).push(t); return t; })({
    name: 'table-fixer', title: 'Table fixer', blurb: 'Tap each fault in a broken results table and choose the fix.',
    station: 'tables', lv: 'gie', icon: '▦'
  });

  WUL.css('table-fixer', [
    '.wd-table-fixer{display:grid;gap:12px;min-width:0}',
    '.wd-table-fixer__top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 14px}',
    '.wd-table-fixer__which{display:grid;gap:3px;min-width:0}',
    '.wd-table-fixer__k{font:650 .7rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--lvl)}',
    '.wd-table-fixer__name{font:600 1.12rem/1.25 var(--serif)}',
    '.wd-table-fixer__count{display:flex;align-items:center;gap:8px;font:500 .9rem/1.2 var(--mono);color:var(--ink-2);margin-left:auto}',
    '.wd-table-fixer__count b{color:var(--red)}',
    '.wd-table-fixer__count.is-done b{color:var(--green)}',
    '.wd-table-fixer__pips{display:inline-flex;gap:4px}',
    '.wd-table-fixer__pips i{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--red);background:var(--red-wash)}',
    '.wd-table-fixer__pips i.on{border-color:var(--green);background:var(--green)}',
    '.wd-table-fixer__sheet{border-left:4px solid var(--red);transition:border-color .3s}',
    '.wd-table-fixer__sheet.is-done{border-left-color:var(--green)}',
    '.wd-table-fixer__table caption{padding-bottom:10px}',
    '.wd-table-fixer__table td,.wd-table-fixer__table th{padding:8px 10px;transition:background-color .35s}',
    '.wd-table-fixer__f{appearance:none;-webkit-appearance:none;background:none;border:0;margin:0;padding:3px 4px;min-height:30px;font:inherit;color:inherit;cursor:pointer;border-radius:3px;text-decoration:underline wavy var(--red);text-decoration-thickness:1.4px;text-underline-offset:4px;text-align:inherit;line-height:1.35}',
    '.wd-table-fixer__f:hover{background:var(--red-wash)}',
    '.wd-table-fixer__f.wd-table-fixer__f--diag{position:absolute;inset:0;width:100%;height:100%;padding:0;border-radius:0;text-decoration:none}',
    '.wd-table-fixer__f--diag span{text-decoration:underline wavy var(--red);text-decoration-thickness:1.4px;text-underline-offset:4px}',
    '.wd-table-fixer__table th.dt-diag{padding:0}',
    '.wd-table-fixer__f[aria-expanded="true"]{background:var(--red-wash);box-shadow:0 0 0 2px var(--red)}',
    '.wd-table-fixer__f--blank{min-width:3.2em;border:1.5px dashed var(--red);text-decoration:none;color:var(--red);font-weight:700}',
    '.wd-table-fixer__ph{font:italic 400 .95rem/1.3 var(--serif);color:var(--red)}',
    '.wd-table-fixer__table caption .wd-table-fixer__f--blank{padding:3px 10px}',
    '.wd-table-fixer__table td.wd-table-fixer__ok,.wd-table-fixer__table th.wd-table-fixer__ok{background:var(--green-wash)}',
    '.wd-table-fixer__table caption.wd-table-fixer__ok .wd-table-fixer__okt{background:var(--green-wash);box-shadow:0 0 0 3px var(--green-wash);border-radius:2px}',
    '.wd-table-fixer__okt{color:var(--ink)}',
    '.wd-table-fixer__note{margin-top:10px;font-size:.92rem;color:var(--green)}',
    '.wd-table-fixer__panel{background:var(--sheet-2);border:1px solid var(--edge);border-radius:var(--r);padding:12px 14px 14px;scroll-margin:90px 0 24px}',
    '.wd-table-fixer__panel.is-open{border-color:var(--ink-3);box-shadow:var(--shadow-sm)}',
    '.wd-table-fixer__hint{font-size:.96rem;color:var(--ink-2)}',
    '.wd-table-fixer__panel .wd-table-fixer__hint{margin-top:8px}',
    '.wd-table-fixer__panel>.wd-table-fixer__hint:first-child{margin-top:0}',
    '.wd-table-fixer__wavy{text-decoration:underline wavy var(--red);text-decoration-thickness:1.4px;text-underline-offset:4px;color:var(--red)}',
    '.wd-table-fixer__q{font:600 1.02rem/1.45 var(--sans);display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline}',
    '.wd-table-fixer__was{font:500 .9rem/1.3 var(--mono);background:var(--red-wash);color:var(--red-2);border:1px solid var(--red);border-radius:3px;padding:2px 7px;max-width:100%;overflow-wrap:anywhere}',
    '.wd-table-fixer__was--blank{font-style:italic}',
    '.wd-table-fixer__opts{display:grid;gap:8px;margin-top:10px}',
    '.wd-table-fixer__opt{appearance:none;-webkit-appearance:none;display:grid;grid-template-columns:20px minmax(0,1fr);gap:8px;align-items:start;text-align:left;width:100%;min-height:46px;padding:10px 12px;border:1.5px solid var(--rule);border-radius:var(--r);background:var(--sheet);color:var(--ink);cursor:pointer;font:500 .97rem/1.4 var(--sans)}',
    '.wd-table-fixer__opt:hover:not([disabled]){border-color:var(--ink-3);box-shadow:var(--shadow-sm)}',
    '.wd-table-fixer__opt[disabled]{cursor:default}',
    '.wd-table-fixer__opt.is-ok{border-color:var(--green);background:var(--green-wash)}',
    '.wd-table-fixer__opt.is-no{border-color:var(--red);background:var(--red-wash);color:var(--ink-2)}',
    '.wd-table-fixer__opt.is-no>span:last-child{text-decoration:line-through;text-decoration-color:var(--red)}',
    '.wd-table-fixer__opt[disabled]:not(.is-ok):not(.is-no){opacity:.55}',
    '.wd-table-fixer__mk{font-weight:700;text-align:center}',
    '.wd-table-fixer__opt.is-ok .wd-table-fixer__mk{color:var(--green)}',
    '.wd-table-fixer__opt.is-no .wd-table-fixer__mk{color:var(--red)}',
    '.wd-table-fixer__fb{margin-top:10px}',
    '.wd-table-fixer__fb:focus{outline:none}',
    '.wd-table-fixer__end{background:var(--green-wash);border:1px solid var(--green);border-radius:var(--r);padding:14px 16px 16px;display:grid;gap:8px}',
    '.wd-table-fixer__endk{font:600 1.1rem/1.35 var(--serif);color:var(--green)}',
    '.wd-table-fixer__endp{font:650 .72rem/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}',
    '.wd-table-fixer__rules{margin:0;padding-left:1.2em;display:grid;gap:4px;font-size:.97rem}',
    /* shared with the tables station: compact ruled tables for a side-by-side, and room for red-pen labels in a table */
    'table.dt.wd-table-fixer--compact{font-size:.8rem}',
    'table.dt.wd-table-fixer--compact th,table.dt.wd-table-fixer--compact td{padding:5px 6px}',
    'table.dt.wd-table-fixer--compact caption{font-size:.9rem}',
    /* tables of words (risk assessments, rules): sans, left-aligned, top-aligned, so a sentence reads like a sentence */
    'table.dt.wd-table-fixer--prose{font:400 .9rem/1.45 var(--sans)}',
    'table.dt.wd-table-fixer--prose th{font:600 .86rem/1.3 var(--sans);text-align:left;vertical-align:bottom}',
    'table.dt.wd-table-fixer--prose td{text-align:left;vertical-align:top}',
    /* a four-column risk assessment: on a phone each row becomes a labelled card, so nothing scrolls sideways */
    '@media (max-width:560px){table.dt.wd-table-fixer--risk4 thead{display:none}table.dt.wd-table-fixer--risk4,table.dt.wd-table-fixer--risk4 tbody,table.dt.wd-table-fixer--risk4 tr,table.dt.wd-table-fixer--risk4 td{display:block;width:100%}table.dt.wd-table-fixer--risk4 caption{display:block}' +
      'table.dt.wd-table-fixer--risk4 tr{border:1.2px solid var(--ink);border-radius:var(--r);margin-bottom:8px;overflow:hidden}table.dt.wd-table-fixer--risk4 td{border:0;border-bottom:1px solid var(--rule);padding:7px 10px}table.dt.wd-table-fixer--risk4 td:last-child{border-bottom:0}' +
      'table.dt.wd-table-fixer--risk4 td::before{display:block;font:650 .64rem/1.3 var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:2px}' +
      'table.dt.wd-table-fixer--risk4 td:nth-child(1)::before{content:"Hazard"}table.dt.wd-table-fixer--risk4 td:nth-child(2)::before{content:"Risk"}table.dt.wd-table-fixer--risk4 td:nth-child(3)::before{content:"Control measure"}table.dt.wd-table-fixer--risk4 td:nth-child(4)::before{content:"Emergency action"}' +
      'table.dt.wd-table-fixer--risk4 td[colspan]::before{content:none}table.dt.wd-table-fixer--risk4 td:first-child:not([colspan]){font-weight:600;background:var(--sheet-2)}}',
    /* a stepper or red pen is a one-column grid whose column grows to a wide table; let the table scroll inside it instead */
    '.stepper:has(table.wd-table-fixer--fit)>*,.redpen:has(table.wd-table-fixer--rp)>*,.stepper:has(.wd-table-fixer--fit)>*{min-width:0}',
    '.wd-table-fixer--calc [data-el].st-focus,.wd-table-fixer--figure [data-el].st-focus{background:var(--hl)}',
    /* text red pens whose keys start "tf-" (every text red pen in the plan and record stations): room above each line for the labels */
    '.redpen__sheet:has(.rpm[data-k^="tf-"]){line-height:3.1}',
    '.redpen__sheet .rpm[data-k^="tf-"]{text-align:left;line-height:1.6}',
    '.redpen__sheet:has(.rpm[data-k^="tf-"]) p+p{margin-top:.9em}',
    '.redpen__sheet .tscroll:has(>table.wd-table-fixer--rp){padding:28px 2px 4px}',
    '.redpen__sheet table.wd-table-fixer--rp td,.redpen__sheet table.wd-table-fixer--rp th{vertical-align:top}',
    '.redpen__sheet table.wd-table-fixer--rp td:has(.rpm),.redpen__sheet table.wd-table-fixer--rp th:has(.rpm){padding-bottom:34px}',
    '.redpen__sheet table.wd-table-fixer--rp td .rpm::after,.redpen__sheet table.wd-table-fixer--rp th .rpm::after{transform:translate(-50%,8px) rotate(-3deg)}',
    '.redpen__sheet table.wd-table-fixer--rp .rpm[data-k="blank"]{min-width:3em;min-height:1.5em;border:1.5px dashed var(--red);text-decoration:none;vertical-align:middle}',
    '.redpen__sheet table.wd-table-fixer--rp caption:has(.rpm){padding-top:4px}',
    '.redpen__sheet table.wd-table-fixer--rp .rpm{display:inline-block;min-width:2.4em;margin-top:0}',
    '@media (max-width:520px){.wd-table-fixer__count{margin-left:0}.wd-table-fixer__another{width:100%}' +
      'table.dt.wd-table-fixer__table,table.dt.wd-table-fixer--fit,.redpen__sheet table.dt.wd-table-fixer--rp{font-size:.76rem}' +
      '.wd-table-fixer__table td,.wd-table-fixer__table th,table.dt.wd-table-fixer--fit td,table.dt.wd-table-fixer--fit th{padding:5px 4px}' +
      '.redpen__sheet table.wd-table-fixer--rp td,.redpen__sheet table.wd-table-fixer--rp th{padding-left:4px;padding-right:4px}' +
      'table.dt.wd-table-fixer__table caption,table.dt.wd-table-fixer--fit caption{font-size:.92rem}' +
      'table.dt.wd-table-fixer--compact{font-size:.76rem}table.dt.wd-table-fixer--compact th,table.dt.wd-table-fixer--compact td{padding:4px 4px}}'
  ].join('\n'));
})(window.WUL);
