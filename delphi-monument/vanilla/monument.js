/*
  Delphi Monument for plain HTML pages (no React): draws the signs into markup that uses monument.css.
  Include after the markup:  <script src="monument/vanilla/monument.js"></script>

  Markup it understands:
    <h1 class="m-inscr" data-inscription>Продажи октябрь</h1>                        words → interpuncts, no dot at line end
    <svg class="m-meander" data-meander="0.97" data-units="24" data-goal role="img" aria-label="Выполнено 97% плана"></svg>
        data-tone="ai" (bronze) or "error" on the svg for other tones
    <svg class="m-colon" data-colonnade='[["1–7 окт",93.5],["29–31",38.6,"partial"],["1–7 ноя",100,"forecast"]]'
         data-mark='{"before":5,"label":"Сегодня"}' role="img" aria-label="…"></svg>
*/
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function el(parent, tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    parent.appendChild(e);
    return e;
  }
  function meanderPath(units) {
    var U = 40, s = 2, y = 2, d = "M0 " + (y + 19 * s) + " H" + U * units;
    for (var i = 0; i < units; i++) {
      var o = i * U;
      d += " M" + (o + s) + " " + (y + 19 * s) + " V" + (y + s) + " H" + (o + 19 * s) + " V" + (y + 15 * s) + " H" + (o + 7 * s) + " V" + (y + 7 * s) + " H" + (o + 13 * s) + " V" + (y + 11 * s);
    }
    return d;
  }
  var clipN = 0;
  function meander(svg) {
    var units = +(svg.getAttribute("data-units") || 24), v = Math.max(0, Math.min(1, +svg.getAttribute("data-meander")));
    var W = 40 * units, d = meanderPath(units), id = "mclip" + (clipN++);
    svg.setAttribute("viewBox", "0 0 " + W + " 44");
    var cp = el(el(svg, "defs", {}), "clipPath", { id: id });
    el(cp, "rect", { x: 0, y: 0, width: W * v, height: 44 });
    el(svg, "path", { d: d, "class": "m-rest", fill: "none", "stroke-width": 3, "stroke-linecap": "square" });
    el(svg, "path", { d: d, "class": "m-done", fill: "none", "stroke-width": 3, "stroke-linecap": "square", "clip-path": "url(#" + id + ")" });
    if (svg.hasAttribute("data-goal")) el(svg, "line", { x1: W, x2: W, y1: 0, y2: 44, "class": "m-goal" });
  }
  function ru(n, d) { return n.toLocaleString("ru-RU", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function colonnade(svg) {
    var rows = JSON.parse(svg.getAttribute("data-colonnade"));
    var mark = svg.getAttribute("data-mark") ? JSON.parse(svg.getAttribute("data-mark")) : null;
    if (rows.length < 3 || rows.length > 10) console.warn("Colonnade works for 3-10 values; use a line chart for longer series.");
    var W = Math.max(400, rows.length * 100), base = 230, top0 = 40, s = W / rows.length;
    var hi = +(svg.getAttribute("data-max") || 0) || Math.max.apply(null, rows.map(function (r) { return r[1]; })) * 1.1;
    var k = (base - top0) / hi;
    var dec = rows.some(function (r) { return r[1] % 1; }) ? 1 : 0;
    svg.setAttribute("viewBox", "0 0 " + W + " 280");
    el(svg, "rect", { x: 0, y: base, width: W, height: 7, "class": "m-stylo" });
    rows.forEach(function (r, i) {
      var cx = s * i + s / 2, top = base - r[1] * k, kind = r[2] || "fact";
      var cls = kind === "forecast" ? "m-fc" : kind === "partial" ? "m-part" : "m-fact";
      el(svg, "rect", { x: cx - 23, y: top, width: 46, height: Math.max(0, base - 9 - top), "class": cls });
      el(svg, "rect", { x: cx - 33, y: top - 1.5, width: 66, height: 3, "class": cls });
      el(svg, "rect", { x: cx - 31, y: base - 9, width: 62, height: 9, "class": cls });
      [-12, 0, 12].forEach(function (fx) { el(svg, "line", { x1: cx + fx, x2: cx + fx, y1: top + 10, y2: base - 15, "class": kind === "forecast" ? "m-flute-fc" : "m-flute" }); });
      el(svg, "text", { x: cx, y: top - 12, "text-anchor": "middle", "class": "m-val" }, ru(r[1], dec));
      el(svg, "text", { x: cx, y: base + 32, "text-anchor": "middle", "class": "m-lab" }, r[0]);
    });
    if (mark) {
      el(svg, "line", { x1: s * mark.before, x2: s * mark.before, y1: 6, y2: base, "class": "m-mark" });
      if (mark.label) el(svg, "text", { x: s * mark.before + 8, y: 20, "class": "m-mark-t" }, mark.label);
    }
  }
  function inscription(h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.textContent = "";
    words.forEach(function (w, i) {
      var group = document.createElement("span");
      group.setAttribute("aria-hidden", "true");
      if (i > 0) { var ip = document.createElement("span"); ip.className = "m-ip"; group.appendChild(ip); group.appendChild(document.createElement("wbr")); }
      var word = document.createElement("span"); word.textContent = w; group.appendChild(word);
      h.appendChild(group);
    });
  }
  function fixDots() {
    document.querySelectorAll(".m-inscr .m-ip").forEach(function (ip) {
      ip.dataset.eol = "false";
      var word = ip.parentElement && ip.parentElement.lastElementChild;
      if (word && word !== ip && word.offsetTop - ip.offsetTop > 4) ip.dataset.eol = "true";
    });
  }
  function init() {
    document.querySelectorAll("[data-inscription]").forEach(inscription);
    document.querySelectorAll("svg[data-meander]").forEach(meander);
    document.querySelectorAll("svg[data-colonnade]").forEach(colonnade);
    fixDots();
    window.addEventListener("resize", fixDots);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fixDots);
  }
  window.Monument = { init: init, meanderPath: meanderPath };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
