/* Kontek Marine header search — brand + product live overlay, product deep-links. No dependencies. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function norm(s) { return String(s == null ? "" : s).toLowerCase(); }

  function matchQuery(q) {
    var data = window.KONTEK_SEARCH || [];
    q = norm(q).trim();
    if (q.length < 2) return [];
    var words = q.split(/\s+/);
    var scored = [];
    for (var i = 0; i < data.length; i++) {
      var d = data[i] || {};
      var name = norm(d.n), cat = norm(d.c), kw = norm(d.k);
      var hay = name + " " + cat + " " + kw;
      var kwWords = kw ? kw.split(" ") : [];
      var ok = true, score = 0;
      for (var w = 0; w < words.length; w++) {
        var word = words[w];
        if (hay.indexOf(word) === -1) { ok = false; break; }
        if (name.split(" ").indexOf(word) !== -1 || name.indexOf(word) === 0) score += 3;
        else if (name.indexOf(word) !== -1) score += 2;
        else if (kwWords.indexOf(word) !== -1 && kwWords.indexOf(word) < 6) score += 2;
        else score += 1;
      }
      if (ok) scored.push({ d: d, s: score, i: i });
    }
    scored.sort(function (a, b) { return (b.s - a.s) || (a.i - b.i); });
    return scored.map(function (x) { return x.d; });
  }
  window.KontekSearchMatch = matchQuery;

  /* ---- product-level matching over window.KONTEK_PRODUCTS ([url, brand, name, model]) ---- */
  function productMatch(q, limit) {
    var P = window.KONTEK_PRODUCTS || [];
    q = norm(q).trim();
    if (q.length < 2 || !P.length) return [];
    var words = q.split(/\s+/);
    var scored = [];
    for (var i = 0; i < P.length; i++) {
      var row = P[i] || [];
      var nm = norm(row[2]), md = norm(row[3]), br = norm(row[1]);
      var hay = nm + " " + md + " " + br;
      var ok = true, score = 0;
      for (var w = 0; w < words.length; w++) {
        var word = words[w];
        if (hay.indexOf(word) === -1) { ok = false; break; }
        if (md && (md === word || md.split(/[\s\-\/]+/).indexOf(word) !== -1)) score += 5;
        else if (md && md.indexOf(word) !== -1) score += 3;
        else if (nm.indexOf(word) === 0) score += 3;
        else if (nm.indexOf(word) !== -1) score += 2;
        else score += 1;
      }
      if (ok) scored.push({ r: row, s: score, i: i });
    }
    scored.sort(function (a, b) { return (b.s - a.s) || (a.i - b.i); });
    return scored.slice(0, limit || 30).map(function (x) { return x.r; });
  }
  window.KontekProductMatch = productMatch;

  function productLink(row, q) {
    var filter = (row[3] && String(row[3]).trim()) ? String(row[3]).trim() : String(row[2]).trim();
    if (!filter) filter = q;
    return row[0] + "#search=" + encodeURIComponent(filter);
  }

  /* ---- lazy product index ---- */
  var prodRequested = false;
  function ensureProducts(cb) {
    if (window.KONTEK_PRODUCTS) { cb(true); return; }
    if (prodRequested) return;
    prodRequested = true;
    var done = false;
    function finish(ok) {
      if (done) return;
      done = true;
      if (!ok && !window.KONTEK_PRODUCTS) window.KONTEK_PRODUCTS = [];
      cb(ok);
    }
    var s = document.createElement("script");
    s.src = "js/product-index.js";
    s.onload = function () { finish(true); };
    s.onerror = function () { finish(false); };
    document.head.appendChild(s);
    /* fallback poll in case onload is swallowed by blockers */
    var iv = setInterval(function () {
      if (window.KONTEK_PRODUCTS) { clearInterval(iv); finish(true); }
    }, 600);
    setTimeout(function () { clearInterval(iv); finish(false); }, 8000);
  }

  function brandRowHtml(d) {
    return '<a class="km-search-row" href="' + esc(d.u) + '">' +
      '<span class="km-search-name">' + esc(d.n) + '</span>' +
      '<span class="km-search-cat">' + esc(d.c) + '</span></a>';
  }
  function productRowHtml(row) {
    var label = row[2] + (row[3] ? " (" + row[3] + ")" : "");
    return '<a class="km-search-row km-search-product" href="' + esc(productLink(row, "")) + '">' +
      '<span class="km-search-name">' + esc(label) + '</span>' +
      '<span class="km-search-cat">' + esc(row[1]) + '</span></a>';
  }

  var overlay = document.createElement("div");
  overlay.className = "km-search-overlay";
  overlay.innerHTML =
    '<div class="km-search-box" role="search">' +
    '<div class="km-search-bar"><i class="fa-solid fa-magnifying-glass"></i>' +
    '<input id="kmSearchInput" type="text" placeholder="Search products, part numbers, brands..." autocomplete="off" aria-label="Site search">' +
    '<button type="button" class="km-search-close" aria-label="Close search">&times;</button></div>' +
    '<div class="km-search-results" id="kmSearchResults"></div></div>';

  function ensureOverlay() {
    if (!overlay.parentNode) document.body.appendChild(overlay);
  }

  var input, resultsBox, lastQ = "", debounce = null;

  function renderAll(q) {
    if (!resultsBox) return;
    lastQ = q;
    var brands = matchQuery(q).slice(0, 8);
    var prods = productMatch(q, 6);
    var h = "";
    for (var i = 0; i < brands.length; i++) h += brandRowHtml(brands[i]);
    if (prods.length) {
      if (brands.length) h += '<div class="km-search-sep">Products</div>';
      for (var j = 0; j < prods.length; j++) h += productRowHtml(prods[j]);
    }
    if (!brands.length && !prods.length) {
      if (q.length >= 2 && !window.KONTEK_PRODUCTS) {
        h = '<div class="km-search-empty">Searching products...</div>';
      } else if (q.length >= 2) {
        h = '<div class="km-search-empty">No matches for &ldquo;' + esc(q) + '&rdquo;. <a href="search.html?q=' + encodeURIComponent(q) + '">See full results</a> or <a href="mailto:sales@kontekmarine.com">send your BOM</a>.</div>';
      }
    } else if (q.length >= 2) {
      h += '<a class="km-search-row km-search-all" href="search.html?q=' + encodeURIComponent(q) + '">' +
        '<span class="km-search-name">See all results for &ldquo;' + esc(q) + '&rdquo;</span>' +
        '<span class="km-search-cat">Search</span></a>';
    }
    resultsBox.innerHTML = h;
    highlight(-1);
  }

  var activeIdx = -1;
  function highlight(idx) {
    activeIdx = idx;
    if (!resultsBox) return;
    var rows = resultsBox.querySelectorAll(".km-search-row");
    for (var i = 0; i < rows.length; i++) {
      if (i === activeIdx) rows[i].classList.add("active");
      else rows[i].classList.remove("active");
    }
    if (rows[activeIdx]) {
      var box = resultsBox;
      var top = rows[activeIdx].offsetTop - box.offsetTop;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + rows[activeIdx].offsetHeight > box.scrollTop + box.clientHeight)
        box.scrollTop = top + rows[activeIdx].offsetHeight - box.clientHeight;
    }
  }

  function openSearch() {
    ensureOverlay();
    overlay.classList.add("open");
    input = overlay.querySelector("#kmSearchInput");
    resultsBox = overlay.querySelector("#kmSearchResults");
    input.value = "";
    renderAll("");
    setTimeout(function () { input.focus(); }, 40);
  }
  function closeSearch() { overlay.classList.remove("open"); }

  function onInput() {
    var q = input.value;
    renderAll(q);
    if (q.trim().length >= 3 && !window.KONTEK_PRODUCTS) {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(function () {
        ensureProducts(function () {
          if (overlay.classList.contains("open") && input && input.value === q) renderAll(q);
        });
      }, 250);
    }
  }

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "kmSearchInput") onInput();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeSearch(); return; }
    if (!overlay.classList.contains("open")) return;
    if (e.target && e.target.id === "kmSearchInput") {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var rows = resultsBox ? resultsBox.querySelectorAll(".km-search-row") : [];
        if (!rows.length) return;
        if (e.key === "ArrowDown") highlight((activeIdx + 1) % rows.length);
        else highlight((activeIdx - 1 + rows.length) % rows.length);
      } else if (e.key === "Enter") {
        var rows2 = resultsBox ? resultsBox.querySelectorAll(".km-search-row") : [];
        if (activeIdx >= 0 && rows2[activeIdx]) window.location.href = rows2[activeIdx].getAttribute("href");
        else if (input.value.trim().length >= 2) window.location.href = "search.html?q=" + encodeURIComponent(input.value.trim());
      }
    }
  });

  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest(".search-btn a") : null;
    if (t) {
      e.preventDefault();
      if (overlay.classList.contains("open")) closeSearch();
      else openSearch();
      return;
    }
    if (e.target && e.target.closest && e.target.closest(".km-search-close")) { closeSearch(); return; }
    if (overlay.classList.contains("open") && e.target === overlay) { closeSearch(); return; }
    if (overlay.classList.contains("open") && e.target && !e.target.closest(".km-search-box")) closeSearch();
  });

  /* ---- product deep-links: #search= filters the product table on brand pages ---- */
  function applyHashSearch() {
    if (!window.location.hash || window.location.hash.indexOf("#search=") !== 0) return;
    var inp = document.querySelector("#productSearch");
    if (!inp) return;
    var val = "";
    try { val = decodeURIComponent(window.location.hash.slice(8).replace(/\+/g, " ")); } catch (err) { return; }
    if (!val) return;
    inp.value = val;
    var ev = null;
    try { ev = new Event("input", { bubbles: true }); }
    catch (err2) { ev = document.createEvent("Event"); ev.initEvent("input", true, true); }
    inp.dispatchEvent(ev);
    setTimeout(function () {
      var tbl = document.getElementById("productTable");
      if (tbl && window.scrollTo) window.scrollTo({ top: tbl.offsetTop - 120, behavior: "smooth" });
    }, 350);
  }
  document.addEventListener("DOMContentLoaded", applyHashSearch);
  window.addEventListener("hashchange", applyHashSearch);
})();
