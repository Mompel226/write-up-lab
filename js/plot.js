/* ============================================================
   plot.js — WUL.plot(): every graph on the site is drawn by this one
   function, on graph paper, so they all look like the same pencil
   drew them. It returns an SVG string.

   Every part carries data-el="…" so a walkthrough can reveal it step
   by step, or a red-pen exercise can circle it:
     paper · axis-x · axis-y · ticks-x · ticks-y · label-x · label-y ·
     title · caption · key · break · bars · bar-<i> · err-bars ·
     pts-<id> · line-<id> · err-<id>

   o = {
     w, h                    viewBox size (default 540 × 380)
     pad {l,r,t,b}           room for tick labels and axis labels
     paper: true             graph-paper grid inside the plot area
     x: {min,max,step,minor,label,cat:[…], fmt}   y: {…}
     series: [{ id, pts:[[x,y]…], mark:'x'|'circle'|'dot'|'blob'|'none',
                line:'ruled'|'smooth'|'free'|'best'|'none',
                tone:'ink'|'lvl'|'red'|'green'|'blue'|'plum'|'grey',
                err:[±…] or errLo/errHi:[…], extend:[x0,x1], label, dash }]
     bars: { items:[{label,v,err,tone}], width:.6, touch:false }
             an item may also take at (category index), off (shift, in categories),
             w (width), dash:true (an outline: "expected"), solid:true, el (its data-el)
     texts: [{x, y, t, tone, el, dy, anchor, cls}]   words placed in data units
             (on a category axis, x = category index + 0.5)
     caption, title, key:true, keyAt:'tl'|'tr'|'bl'|'br', axisBreak:true,
     hl: ['label-y', …]      elements to ring in yellow
     marks: [{el, text}]     red-pen circles (used by the graph doctor)
     tickDp                  decimal places on tick labels
   }
   ============================================================ */
(function (WUL) {
  'use strict';
  var esc = WUL.esc;

  function niceNum(v, dp) {
    if (dp != null) return (+v).toFixed(dp);
    var r = Math.round(v * 1e6) / 1e6;
    return String(r);
  }

  /* Catmull–Rom through the points, as cubic Béziers */
  function smoothPath(P) {
    if (P.length < 2) return '';
    var d = 'M' + P[0][0].toFixed(2) + ' ' + P[0][1].toFixed(2), i, p0, p1, p2, p3;
    for (i = 0; i < P.length - 1; i++) {
      p0 = P[i - 1] || P[i]; p1 = P[i]; p2 = P[i + 1]; p3 = P[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + c1x.toFixed(2) + ' ' + c1y.toFixed(2) + ' ' + c2x.toFixed(2) + ' ' + c2y.toFixed(2) + ' ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2);
    }
    return d;
  }
  /* a hand-drawn line: the ruled path, wobbled a little, deterministically */
  function freePath(P) {
    var seed = 7, out = [], i, k;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; }
    for (i = 0; i < P.length - 1; i++) {
      var a = P[i], b = P[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / L, ny = dx / L;
      for (k = 0; k < 6; k++) {
        var t = k / 6, off = (k === 0 ? 0 : rnd() * 5.5);
        out.push([a[0] + dx * t + nx * off, a[1] + dy * t + ny * off]);
      }
    }
    out.push(P[P.length - 1]);
    return smoothPath(out);
  }
  function linFit(pts) {
    var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach(function (p) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
    var m = (n * sxy - sx * sy) / (n * sxx - sx * sx), c = (sy - m * sx) / n;
    return { m: m, c: c };
  }
  WUL.linFit = linFit;

  WUL.plot = function (o) {
    o = o || {};
    var W = o.w || 540, H = o.h || 380;
    var pad = o.pad || {}, L = pad.l != null ? pad.l : 64, R = pad.r != null ? pad.r : 20,
        T = pad.t != null ? pad.t : (o.title ? 38 : 16), B = pad.b != null ? pad.b : 58;
    var X = o.x || { min: 0, max: 10, step: 1 }, Y = o.y || { min: 0, max: 10, step: 1 };
    var cat = X.cat || (o.bars && o.bars.items.map(function (b) { return b.label; }));
    if (cat) { X = Object.assign({}, X, { min: 0, max: cat.length, step: 1 }); }
    var pw = W - L - R, ph = H - T - B;
    function px(v) { return L + (v - X.min) / (X.max - X.min) * pw; }
    function py(v) { return T + (1 - (v - Y.min) / (Y.max - Y.min)) * ph; }
    var hl = o.hl || [];
    function g(el, cls, inner) {
      return '<g data-el="' + el + '" class="' + (cls || '') + (hl.indexOf(el) >= 0 ? ' is-hl' : '') + '">' + inner + '</g>';
    }
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.alt || o.caption || 'Graph') + '" xmlns="http://www.w3.org/2000/svg">';

    /* graph paper */
    if (o.paper !== false) {
      var gp = '', stepX = X.step, stepY = Y.step, mx = X.minor || (cat ? 1 : 5), my = Y.minor || 5, v;
      var dxm = stepX / mx, dym = stepY / my;
      if (cat) dxm = 0.2;
      for (v = X.min; v <= X.max + 1e-9; v += dxm) {
        var major = Math.abs(((v - X.min) / (cat ? 1 : stepX)) - Math.round((v - X.min) / (cat ? 1 : stepX))) < 1e-6;
        gp += '<line class="' + (major ? 'gp-maj' : 'gp-min') + '" x1="' + px(v).toFixed(2) + '" y1="' + T + '" x2="' + px(v).toFixed(2) + '" y2="' + (T + ph) + '"/>';
      }
      for (v = Y.min; v <= Y.max + 1e-9; v += dym) {
        var majY = Math.abs(((v - Y.min) / stepY) - Math.round((v - Y.min) / stepY)) < 1e-6;
        gp += '<line class="' + (majY ? 'gp-maj' : 'gp-min') + '" x1="' + L + '" y1="' + py(v).toFixed(2) + '" x2="' + (L + pw) + '" y2="' + py(v).toFixed(2) + '"/>';
      }
      s += g('paper', 'pl-paper', gp);
    }

    if (o.title) s += g('title', 'pl-title', '<text x="' + (L + pw / 2) + '" y="22" text-anchor="middle">' + esc(o.title) + '</text>');

    /* bars */
    if (o.bars) {
      var bw = (o.bars.width || (o.bars.touch ? 1 : 0.6)), bs = '';
      o.bars.items.forEach(function (b, i) {
        var mid = (b.at != null ? b.at : i) + 0.5 + (b.off || 0), w = b.w || bw;
        var x0 = px(mid - w / 2), x1 = px(mid + w / 2);
        var yTop = py(b.v), yBase = py(Y.min > 0 ? Y.min : 0);
        bs += '<g data-el="' + esc(b.el || 'bar-' + i) + '"><rect class="pl-bar tone-' + (b.tone || o.bars.tone || 'ink') + (b.dash ? ' pl-bar--dash' : '') + (b.solid ? ' pl-bar--solid' : '') + '" x="' + x0.toFixed(2) + '" y="' + Math.min(yTop, yBase).toFixed(2) + '" width="' + (x1 - x0).toFixed(2) + '" height="' + Math.abs(yBase - yTop).toFixed(2) + '"/></g>';
      });
      s += g('bars', 'pl-bars', bs);
      if (o.bars.items.some(function (b) { return b.err != null; })) {
        var eb = '';
        o.bars.items.forEach(function (b, i) {
          if (b.err == null) return;
          var cx = px((b.at != null ? b.at : i) + 0.5 + (b.off || 0)), a = py(b.v + b.err), c = py(b.v - b.err);
          eb += '<line x1="' + cx + '" y1="' + a + '" x2="' + cx + '" y2="' + c + '"/><line x1="' + (cx - 7) + '" y1="' + a + '" x2="' + (cx + 7) + '" y2="' + a + '"/><line x1="' + (cx - 7) + '" y1="' + c + '" x2="' + (cx + 7) + '" y2="' + c + '"/>';
        });
        s += g('err-bars', 'pl-err tone-ink', eb);
      }
    }

    /* axes */
    s += g('axis-x', 'pl-axis', '<line x1="' + L + '" y1="' + (T + ph) + '" x2="' + (L + pw) + '" y2="' + (T + ph) + '"/>');
    s += g('axis-y', 'pl-axis', '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + ph) + '"/>');
    if (o.axisBreak) {
      var by = T + ph - 14;
      s += g('break', 'pl-break', '<path d="M' + (L - 7) + ' ' + (by + 5) + ' l7 -5 l-7 -5 l7 -5" /><rect x="' + (L - 3) + '" y="' + (by - 12) + '" width="6" height="4" class="pl-gap"/>');
    }

    /* ticks + numbers */
    var tx = '', ty = '', v2;
    if (cat) {
      cat.forEach(function (c, i) {
        tx += '<text class="pl-tick" x="' + px(i + 0.5) + '" y="' + (T + ph + 18) + '" text-anchor="middle">' + esc(c) + '</text>';
      });
    } else if (X.ticks !== false) {
      for (v2 = X.min; v2 <= X.max + 1e-9; v2 += X.step) {
        tx += '<line x1="' + px(v2) + '" y1="' + (T + ph) + '" x2="' + px(v2) + '" y2="' + (T + ph + 5) + '"/>' +
          '<text class="pl-tick" x="' + px(v2) + '" y="' + (T + ph + 19) + '" text-anchor="middle">' + esc(X.fmt ? X.fmt(v2) : niceNum(v2, o.tickDpX)) + '</text>';
      }
    }
    if (Y.ticks !== false) {
      for (v2 = Y.min; v2 <= Y.max + 1e-9; v2 += Y.step) {
        ty += '<line x1="' + (L - 5) + '" y1="' + py(v2) + '" x2="' + L + '" y2="' + py(v2) + '"/>' +
          '<text class="pl-tick" x="' + (L - 9) + '" y="' + (py(v2) + 4) + '" text-anchor="end">' + esc(Y.fmt ? Y.fmt(v2) : niceNum(v2, o.tickDp)) + '</text>';
      }
    }
    s += g('ticks-x', 'pl-ticks', tx);
    s += g('ticks-y', 'pl-ticks', ty);
    if (X.label != null) s += g('label-x', 'pl-label', '<text x="' + (L + pw / 2) + '" y="' + (H - 12) + '" text-anchor="middle">' + esc(X.label) + '</text>');
    if (Y.label != null) s += g('label-y', 'pl-label', '<text transform="translate(16 ' + (T + ph / 2) + ') rotate(-90)" text-anchor="middle">' + esc(Y.label) + '</text>');

    /* series */
    var keyItems = [];
    (o.series || []).forEach(function (se, si) {
      var id = se.id || ('s' + si), tone = se.tone || 'ink';
      var P = (se.pts || []).map(function (p) { return [px(p[0]), py(p[1])]; });
      var line = '';
      if (se.line && se.line !== 'none' && P.length > 1) {
        var d = '';
        if (se.line === 'ruled') d = 'M' + P.map(function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' L');
        else if (se.line === 'smooth') d = smoothPath(P);
        else if (se.line === 'free') d = freePath(P);
        else if (se.line === 'best') {
          var f = linFit(se.pts), xa = se.extend ? se.extend[0] : se.pts[0][0], xb = se.extend ? se.extend[1] : se.pts[se.pts.length - 1][0];
          d = 'M' + px(xa).toFixed(2) + ' ' + py(f.m * xa + f.c).toFixed(2) + ' L' + px(xb).toFixed(2) + ' ' + py(f.m * xb + f.c).toFixed(2);
        }
        if (se.extend && se.line !== 'best') {
          /* a line carried beyond the data — drawn only to show the mistake */
          var a0 = [px(se.extend[0]), py(se.extendY ? se.extendY[0] : se.pts[0][1])];
          d = 'M' + a0[0].toFixed(2) + ' ' + a0[1].toFixed(2) + ' L' + d.slice(1);
        }
        line = '<path class="pl-line tone-' + tone + '" d="' + d + '"' + (se.dash ? ' stroke-dasharray="6 5"' : '') + '/>';
      }
      if (line) s += g('line-' + id, 'pl-lines', line);
      var errLo = se.errLo || se.err, errHi = se.errHi || se.err;
      if (errLo) {
        var eb2 = '';
        se.pts.forEach(function (p, i) {
          if (errLo[i] == null) return;
          var cx = px(p[0]), a = py(p[1] + errHi[i]), c = py(p[1] - errLo[i]);
          eb2 += '<line x1="' + cx + '" y1="' + a.toFixed(2) + '" x2="' + cx + '" y2="' + c.toFixed(2) + '"/><line x1="' + (cx - 6) + '" y1="' + a.toFixed(2) + '" x2="' + (cx + 6) + '" y2="' + a.toFixed(2) + '"/><line x1="' + (cx - 6) + '" y1="' + c.toFixed(2) + '" x2="' + (cx + 6) + '" y2="' + c.toFixed(2) + '"/>';
        });
        s += g('err-' + id, 'pl-err tone-' + tone, eb2);
      }
      var mk = '', m = se.mark || 'x';
      P.forEach(function (p) {
        var x = p[0].toFixed(2), y = p[1].toFixed(2);
        if (m === 'x') mk += '<path class="pl-mk" d="M' + (p[0] - 4.5) + ' ' + (p[1] - 4.5) + 'L' + (p[0] + 4.5) + ' ' + (p[1] + 4.5) + 'M' + (p[0] + 4.5) + ' ' + (p[1] - 4.5) + 'L' + (p[0] - 4.5) + ' ' + (p[1] + 4.5) + '"/>';
        else if (m === 'circle') mk += '<circle class="pl-mk pl-mk--o" cx="' + x + '" cy="' + y + '" r="4.5"/><circle class="pl-mk pl-mk--dot" cx="' + x + '" cy="' + y + '" r="1.2"/>';
        else if (m === 'dot') mk += '<circle class="pl-mk pl-mk--dot" cx="' + x + '" cy="' + y + '" r="2"/>';
        else if (m === 'blob') mk += '<circle class="pl-mk pl-mk--blob" cx="' + x + '" cy="' + y + '" r="7"/>';
        else if (m === 'plus') mk += '<path class="pl-mk" d="M' + (p[0] - 5) + ' ' + p[1] + 'H' + (p[0] + 5) + 'M' + p[0] + ' ' + (p[1] - 5) + 'V' + (p[1] + 5) + '"/>';
      });
      if (m !== 'none') s += g('pts-' + id, 'pl-pts tone-' + tone, mk);
      if (se.label) keyItems.push({ tone: tone, m: m, line: se.line, label: se.label, dash: se.dash });
    });

    /* words placed on the plot */
    (o.texts || []).forEach(function (t) {
      var tt = '<text class="' + (t.cls || 'pl-txt') + (t.tone ? ' tone-' + t.tone : '') + '" x="' + px(t.x).toFixed(2) + '" y="' + (py(t.y) + (t.dy || 0)).toFixed(2) + '" text-anchor="' + (t.anchor || 'middle') + '">' + esc(t.t) + '</text>';
      s += t.el ? '<g data-el="' + esc(t.el) + '">' + tt + '</g>' : tt;
    });

    /* the key shows each series' own mark */
    function keyMark(k, x, y) {
      var t = ' tone-' + k.tone;
      if (k.m === 'none') return '';
      if (k.m === 'circle') return '<g class="pl-pts' + t + '"><circle class="pl-mk pl-mk--o" cx="' + x + '" cy="' + y + '" r="4.5"/><circle class="pl-mk pl-mk--dot" cx="' + x + '" cy="' + y + '" r="1.2"/></g>';
      if (k.m === 'dot') return '<g class="pl-pts' + t + '"><circle class="pl-mk pl-mk--dot" cx="' + x + '" cy="' + y + '" r="2"/></g>';
      if (k.m === 'blob') return '<g class="pl-pts' + t + '"><circle class="pl-mk pl-mk--blob" cx="' + x + '" cy="' + y + '" r="6"/></g>';
      if (k.m === 'plus') return '<path class="pl-mk' + t + '" d="M' + (x - 5) + ' ' + y + 'H' + (x + 5) + 'M' + x + ' ' + (y - 5) + 'V' + (y + 5) + '"/>';
      return '<path class="pl-mk' + t + '" d="M' + (x - 4) + ' ' + (y - 4) + 'L' + (x + 4) + ' ' + (y + 4) + 'M' + (x + 4) + ' ' + (y - 4) + 'L' + (x - 4) + ' ' + (y + 4) + '"/>';
    }
    /* key */
    if (o.key && keyItems.length) {
      var kw = 170, kh = 12 + keyItems.length * 20, at = o.keyAt || 'tr';
      var kx = at.indexOf('l') >= 0 ? L + 12 : L + pw - kw - 10, ky = at.indexOf('b') >= 0 ? T + ph - kh - 10 : T + 10;
      var ks = '<rect class="pl-keybox" x="' + kx + '" y="' + ky + '" width="' + kw + '" height="' + kh + '" rx="3"/>';
      keyItems.forEach(function (k, i) {
        var yy = ky + 16 + i * 20;
        ks += '<line class="pl-line tone-' + k.tone + '" x1="' + (kx + 10) + '" y1="' + yy + '" x2="' + (kx + 36) + '" y2="' + yy + '"' + (k.dash ? ' stroke-dasharray="6 5"' : '') + '/>' +
          keyMark(k, kx + 23, yy) +
          '<text class="pl-keyt" x="' + (kx + 44) + '" y="' + (yy + 4) + '">' + esc(k.label) + '</text>';
      });
      s += g('key', 'pl-key', ks);
    }

    /* red-pen rings (graph doctor, red pen) */
    (o.marks || []).forEach(function (mk2) {
      if (!mk2.box) return;
      var b = mk2.box;
      s += '<g class="pl-ring" data-ring="' + esc(mk2.k || '') + '"><ellipse cx="' + (b[0] + b[2] / 2) + '" cy="' + (b[1] + b[3] / 2) + '" rx="' + (b[2] / 2 + 8) + '" ry="' + (b[3] / 2 + 8) + '"/></g>';
    });

    s += '</svg>';
    var out = '<figure class="plotfig">' + s;
    if (o.caption) out += '<figcaption data-el="caption" class="pl-cap' + (hl.indexOf('caption') >= 0 ? ' is-hl' : '') + '">' + WUL.md(WUL.capText(o.caption), { inline: true }) + '</figcaption>';
    return out + '</figure>';
  };

  /* expose the scale maths so a widget can place its own marks on a plot */
  WUL.plotScale = function (o) {
    var W = o.w || 540, H = o.h || 380, pad = o.pad || {};
    var L = pad.l != null ? pad.l : 64, R = pad.r != null ? pad.r : 20, T = pad.t != null ? pad.t : (o.title ? 38 : 16), B = pad.b != null ? pad.b : 58;
    var X = o.x, Y = o.y, pw = W - L - R, ph = H - T - B;
    if (X && X.cat) X = { min: 0, max: X.cat.length };
    return {
      L: L, T: T, pw: pw, ph: ph, W: W, H: H,
      px: function (v) { return L + (v - X.min) / (X.max - X.min) * pw; },
      py: function (v) { return T + (1 - (v - Y.min) / (Y.max - Y.min)) * ph; }
    };
  };
})(window.WUL);
