/* La Gazelle Plomberie — Boutique : catalogue, recherche, panier, commande WhatsApp.
   Le catalogue se modifie dans assets/js/produits.js. */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "2290197445015";
  var CART_KEY = "lagazelle-panier";
  var CATS = window.CATEGORIES || {};
  var PRODUCTS = window.PRODUITS || [];
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  var els = {
    chips: document.getElementById("cat-chips"),
    search: document.getElementById("shop-search"),
    grid: document.getElementById("products"),
    count: document.getElementById("shop-count"),
    empty: document.getElementById("shop-empty"),
    cart: document.getElementById("cart"),
    lines: document.getElementById("cart-lines"),
    cartEmpty: document.getElementById("cart-empty"),
    total: document.getElementById("cart-total"),
    form: document.getElementById("cart-form"),
    badge: document.getElementById("cart-badge"),
    fab: document.getElementById("cart-fab"),
    fabBadge: document.getElementById("cart-fab-badge"),
    backdrop: document.getElementById("cart-backdrop"),
    close: document.getElementById("cart-close"),
    clear: document.getElementById("cart-clear")
  };
  if (!els.grid) return;

  var state = { cat: "tous", q: "", cart: loadCart() };

  /* ---------- Utilitaires ---------- */
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function money(n) {
    return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
  }
  function svgUse(id, cls) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    if (cls) svg.setAttribute("class", cls);
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- Panier (gardé sur cet appareil) ---------- */
  function loadCart() {
    try {
      var c = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      Object.keys(c).forEach(function (id) { if (!byId[id] || !(c[id] > 0)) delete c[id]; });
      return c;
    } catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) { /* ignore */ }
  }
  function setQty(id, qty) {
    qty = Math.max(0, Math.min(999, qty | 0));
    if (qty) state.cart[id] = qty; else delete state.cart[id];
    saveCart();
    renderCart();
    updateCardControls(id);
  }
  function cartCount() {
    return Object.keys(state.cart).reduce(function (s, id) { return s + state.cart[id]; }, 0);
  }

  /* ---------- Catégories ---------- */
  function renderChips() {
    var all = [{ key: "tous", nom: "Tous les articles", icone: "i-grid" }].concat(
      Object.keys(CATS).map(function (k) { return { key: k, nom: CATS[k].nom, icone: CATS[k].icone }; })
    );
    els.chips.innerHTML = "";
    all.forEach(function (c) {
      var b = el("button", "cat-chip");
      b.type = "button";
      b.setAttribute("aria-pressed", String(state.cat === c.key));
      b.appendChild(svgUse(c.icone));
      b.appendChild(document.createTextNode(c.nom));
      b.addEventListener("click", function () {
        state.cat = c.key;
        renderChips();
        renderProducts();
      });
      els.chips.appendChild(b);
    });
  }

  /* ---------- Produits ---------- */
  function visibleProducts() {
    var q = norm(state.q);
    return PRODUCTS.filter(function (p) {
      if (state.cat !== "tous" && p.categorie !== state.cat) return false;
      if (!q) return true;
      return norm(p.nom + " " + p.description + " " + (CATS[p.categorie] || {}).nom).indexOf(q) !== -1;
    });
  }

  function renderProducts() {
    var list = visibleProducts();
    els.grid.innerHTML = "";
    list.forEach(function (p) { els.grid.appendChild(productCard(p)); });
    els.empty.hidden = list.length > 0;
    els.count.textContent = list.length + (list.length > 1 ? " articles" : " article");
  }

  function productCard(p) {
    var cat = CATS[p.categorie] || { nom: "", icone: "i-tools" };
    var card = el("article", "product");
    card.dataset.id = p.id;

    var media = el("div", "product-media cat-" + p.categorie);
    if (p.image) {
      var img = el("img");
      img.src = p.image;
      img.alt = p.nom;
      img.loading = "lazy";
      media.appendChild(img);
    } else {
      media.appendChild(svgUse(cat.icone));
    }
    if (p.badge) media.appendChild(el("span", "product-badge", p.badge));
    card.appendChild(media);

    var body = el("div", "product-body");
    body.appendChild(el("span", "product-cat", cat.nom));
    body.appendChild(el("h3", null, p.nom));
    body.appendChild(el("p", "product-desc", p.description));
    var price = el("p", "product-price");
    if (typeof p.prix === "number") {
      price.appendChild(el("b", null, money(p.prix)));
    } else {
      price.appendChild(el("b", "on-request", "Prix sur demande"));
    }
    if (p.unite) price.appendChild(el("small", null, " / " + p.unite));
    body.appendChild(price);

    var ctrl = el("div", "product-ctrl");
    body.appendChild(ctrl);
    card.appendChild(body);
    fillControls(ctrl, p);
    return card;
  }

  function fillControls(ctrl, p) {
    ctrl.innerHTML = "";
    var qty = state.cart[p.id] || 0;
    if (!qty) {
      var add = el("button", "btn btn-blue btn-add");
      add.type = "button";
      add.appendChild(svgUse("i-plus"));
      add.appendChild(document.createTextNode("Ajouter"));
      add.setAttribute("aria-label", "Ajouter " + p.nom + " au panier");
      add.addEventListener("click", function () { setQty(p.id, 1); pulseFab(); });
      ctrl.appendChild(add);
    } else {
      ctrl.appendChild(stepper(p, qty));
    }
  }

  function stepper(p, qty) {
    var wrap = el("div", "stepper");
    var minus = el("button", "step-btn");
    minus.type = "button";
    minus.setAttribute("aria-label", "Retirer un " + p.nom);
    minus.appendChild(svgUse(qty > 1 ? "i-minus" : "i-trash"));
    minus.addEventListener("click", function () { setQty(p.id, (state.cart[p.id] || 0) - 1); });
    var out = el("output", "step-qty", String(qty));
    out.setAttribute("aria-live", "polite");
    var plus = el("button", "step-btn");
    plus.type = "button";
    plus.setAttribute("aria-label", "Ajouter un " + p.nom);
    plus.appendChild(svgUse("i-plus"));
    plus.addEventListener("click", function () { setQty(p.id, (state.cart[p.id] || 0) + 1); });
    wrap.appendChild(minus);
    wrap.appendChild(out);
    wrap.appendChild(plus);
    return wrap;
  }

  function updateCardControls(id) {
    var card = els.grid.querySelector('.product[data-id="' + id + '"]');
    if (card) fillControls(card.querySelector(".product-ctrl"), byId[id]);
  }

  /* ---------- Rendu du panier ---------- */
  function renderCart() {
    var ids = Object.keys(state.cart);
    var n = cartCount();
    els.badge.textContent = n;
    els.fabBadge.textContent = n;
    els.fab.classList.toggle("has-items", n > 0);
    els.cartEmpty.hidden = ids.length > 0;
    els.form.hidden = ids.length === 0;
    els.lines.innerHTML = "";

    var total = 0, allPriced = true;
    ids.forEach(function (id) {
      var p = byId[id], qty = state.cart[id];
      var li = el("li", "cart-line");
      var info = el("div", "cl-info");
      info.appendChild(el("b", null, p.nom));
      var sub = typeof p.prix === "number" ? money(p.prix * qty) : "Prix sur demande";
      info.appendChild(el("small", null, (p.unite ? p.unite + " · " : "") + sub));
      li.appendChild(info);
      li.appendChild(stepper(p, qty));
      els.lines.appendChild(li);
      if (typeof p.prix === "number") total += p.prix * qty; else allPriced = false;
    });

    if (ids.length) {
      els.total.hidden = false;
      els.total.textContent = allPriced
        ? "Total estimé : " + money(total)
        : (total ? "Sous-total des articles à prix affiché : " + money(total) + ". " : "") +
          "Les prix des autres articles vous seront confirmés sur WhatsApp.";
    } else {
      els.total.hidden = true;
    }
  }

  /* ---------- Panier sur téléphone ---------- */
  function openCart() {
    document.body.classList.add("cart-open");
    els.backdrop.hidden = false;
    els.fab.setAttribute("aria-expanded", "true");
    els.close.focus();
  }
  function closeCart() {
    document.body.classList.remove("cart-open");
    els.backdrop.hidden = true;
    els.fab.setAttribute("aria-expanded", "false");
  }
  function pulseFab() {
    els.fab.classList.remove("pulse");
    void els.fab.offsetWidth;
    els.fab.classList.add("pulse");
  }
  els.fab.addEventListener("click", openCart);
  els.close.addEventListener("click", closeCart);
  els.backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  els.clear.addEventListener("click", function () {
    state.cart = {};
    saveCart();
    renderCart();
    renderProducts();
  });

  /* ---------- Recherche ---------- */
  els.search.addEventListener("input", function () {
    state.q = els.search.value;
    renderProducts();
  });

  /* ---------- Commande ---------- */
  function checkField(field) {
    var input = field.querySelector("input, textarea");
    var rule = field.getAttribute("data-required");
    var ok = rule === "tel" ? input.value.replace(/\D/g, "").length >= 8 : input.value.trim().length > 0;
    field.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }
  els.form.addEventListener("input", function (e) {
    var f = e.target.closest("[data-required]");
    if (f && f.classList.contains("has-error")) checkField(f);
  });

  function makeRef() {
    var d = new Date();
    var pad = function (x) { return String(x).padStart(2, "0"); };
    return "LGB-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) +
      "-" + Math.floor(1000 + Math.random() * 9000);
  }

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = null;
    els.form.querySelectorAll("[data-required]").forEach(function (f) { if (!checkField(f) && !bad) bad = f; });
    if (bad) { bad.querySelector("input").focus(); return; }

    var f = els.form.elements;
    var mode = (els.form.querySelector('input[name="mode"]:checked') || {}).value || "";
    var lines = ["*COMMANDE BOUTIQUE – La Gazelle Plomberie*", "Réf. " + makeRef(), ""];
    var total = 0, allPriced = true;
    Object.keys(state.cart).forEach(function (id) {
      var p = byId[id], qty = state.cart[id];
      var price = typeof p.prix === "number" ? money(p.prix * qty) : "prix à confirmer";
      if (typeof p.prix === "number") total += p.prix * qty; else allPriced = false;
      lines.push("• " + qty + " × " + p.nom + (p.unite ? " (" + p.unite + ")" : "") + " – " + price);
    });
    if (allPriced) lines.push("", "*Total estimé :* " + money(total));
    lines.push("");
    lines.push("*Nom :* " + f.nom.value.trim());
    lines.push("*Téléphone :* " + f.tel.value.trim());
    lines.push("*Ville / quartier :* " + f.ville.value.trim());
    lines.push("*Récupération :* " + mode);
    if (f.note.value.trim()) lines.push("*Précisions :* " + f.note.value.trim());
    lines.push("", "Envoyé depuis la boutique en ligne La Gazelle");

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    var w = window.open(url, "_blank");
    if (!w) location.href = url;
  });

  /* ---------- Démarrage ---------- */
  var cat = new URLSearchParams(location.search).get("categorie");
  if (cat && CATS[cat]) state.cat = cat;
  renderChips();
  renderProducts();
  renderCart();
})();
