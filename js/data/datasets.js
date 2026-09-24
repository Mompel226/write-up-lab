/* ============================================================
   datasets.js — THE running examples. Every table, graph and question
   on the site that uses these experiments reads its numbers from here,
   so the numbers can never disagree between two pages.

   Checked by tools/check.mjs: every mean and SD below is recomputed from
   the trials, and the build stops if one disagrees.
   ============================================================ */
(function (WUL) {
  'use strict';
  WUL.data = WUL.data || {};

  /* 1. Amylase and temperature (continuous IV → line graph, an optimum).
        1.0 % starch, amylase added, one drop tested with iodine every 10 s;
        the time recorded is the first sample that no longer turns blue-black.
        So every time is a multiple of 10 s and its uncertainty is ± 10 s.
        IGCSE: 3 trials. IB (IA / EE): 5 trials, fungal α-amylase from Aspergillus oryzae. */
  WUL.data.amylase = {
    iv: 'Temperature', ivUnit: '°C', dv: 'Time for starch to disappear', dvUnit: 's',
    sampling: 10,
    g: {
      temps: [20, 30, 40, 50, 60],
      trials: [[180, 170, 190], [120, 110, 120], [70, 80, 70], [50, 50, 60], [90, 100, 90]],
      means: [180, 117, 73, 53, 93]            /* whole seconds: the raw data are whole seconds */
    },
    i: {
      temps: [20, 30, 40, 50, 60],
      trials: [[180, 170, 190, 180, 170], [120, 110, 120, 130, 110], [70, 80, 70, 80, 70], [50, 50, 60, 50, 60], [90, 100, 90, 100, 110]],
      means: [178, 118, 74, 54, 98],
      sds: [8.4, 8.4, 5.5, 5.5, 8.4],          /* sample SD (=STDEV.S), one more d.p. than the data */
      ses: [3.7, 3.7, 2.4, 2.4, 3.7],          /* SE = SD ÷ √5 */
      rates: [5.6, 8.5, 13.5, 18.5, 10.2]      /* 1 ÷ mean time, given in 10⁻³ s⁻¹ (5.6 means 5.6 × 10⁻³ s⁻¹) */
    }
  };

  /* 2. Seedlings in four soils (categorical IV → bar chart; the truncated-axis lesson).
        Height of bean seedlings after 21 days, 10 plants per soil. */
  WUL.data.soils = {
    iv: 'Soil type', dv: 'Mean height of seedlings', dvUnit: 'cm', n: 10,
    labels: ['A', 'B', 'C', 'D'],
    means: [43.0, 43.6, 44.0, 44.3],
    sds: [1.4, 1.6, 1.3, 1.5]
    /* A to D differ by 1.3 cm out of about 43 cm: 3 %. The SD bars overlap. */
  };
})(window.WUL);
