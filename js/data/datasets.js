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

  /* 3. A practice rocky shore: field data (nothing is changed, so a title says "the relationship between").
        Five belt transects up from the low-tide mark, a 0.25 m² quadrat every 2.00 m (distance ± 0.01 m).
        Two measured variables in each quadrat: the number of periwinkles (a count of whole animals, each counted
        when more than half of it is inside the quadrat: no unit and no instrument, so no ±) and the temperature
        of the rock surface (a digital probe, ± 0.1 °C). The repeats are the five transects, so n = 5: the
        quadrats along one transect are positions, not repeats.
        PRACTICE DATA, made up for teaching (Daniel, 16 Oct 2026): never a class's own field data, species or
        numbers (memory never-do-the-assessment). A mean of counts has 1 d.p. (our rule for counts); each SD has
        one more d.p. than its mean. At 8.00 m the counts are skewed: SD 5.61 > mean 3.0, median 1 (errorbars.js).
        Checked by tools/check.mjs: every mean, SD and median is recomputed. */
  WUL.data.shore = {
    dists: [0, 2, 4, 6, 8],                       /* distance from the low-tide mark / m */
    counts: [[2, 4, 1, 3, 2], [6, 9, 5, 8, 7], [14, 11, 17, 12, 15], [9, 16, 7, 12, 10], [0, 1, 13, 0, 1]],
    countMeans: [2.4, 7.0, 13.8, 10.8, 3.0],
    countSds: [1.14, 1.58, 2.39, 3.42, 5.61],
    countMedians: [2, 7, 14, 10, 1],
    temps: [[17.8, 18.3, 18.0, 18.4, 18.1], [19.0, 19.6, 18.9, 19.4, 19.2], [20.3, 20.9, 20.0, 20.6, 20.4], [21.7, 22.4, 21.3, 22.0, 21.9], [23.2, 24.0, 22.9, 23.6, 23.5]],
    tempMeans: [18.1, 19.2, 20.4, 21.9, 23.4],
    tempSds: [0.24, 0.29, 0.34, 0.40, 0.42]
  };
})(window.WUL);
