/* La Gazelle Plomberie — formulaire « Commander un service ou un chantier »
   Le formulaire prépare un message structuré, envoyé ensuite sur WhatsApp
   (ou par SMS). Aucune donnée n'est envoyée à un serveur. */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "2290197445015";
  var PHONE_INTL = "+2290197445015";
  var DRAFT_KEY = "lagazelle-commande-brouillon";

  var form = document.getElementById("order-form");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".wstep"));
  var indicators = Array.prototype.slice.call(form.querySelectorAll(".wizard-steps li"));
  var bar = form.querySelector(".wizard-bar span");
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var btnSubmit = document.getElementById("btn-submit");
  var card = form.closest(".order-card");
  var done = document.getElementById("order-done");
  var photosInput = document.getElementById("photos");
  var thumbs = document.getElementById("thumbs");
  var current = 1;
  var photos = [];

  form.classList.add("is-wizard");

  /* ---------- Valeurs ---------- */
  function val(name) {
    var els = form.elements[name];
    if (!els) return "";
    if (els instanceof RadioNodeList || (els.length && els[0] && els[0].type === "radio")) {
      for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
      return "";
    }
    if (els.type === "checkbox") return els.checked ? "oui" : "";
    return (els.value || "").trim();
  }

  function isVisible(el) {
    return !el.closest("[hidden]");
  }

  /* ---------- Affichage conditionnel : data-show-if="nom=valeur" ---------- */
  function updateConditionals() {
    form.querySelectorAll("[data-show-if]").forEach(function (el) {
      var parts = el.getAttribute("data-show-if").split("=");
      el.hidden = val(parts[0]) !== parts.slice(1).join("=");
    });
  }

  /* ---------- Validation ---------- */
  function checkField(field) {
    if (!isVisible(field)) return true;
    var rule = field.getAttribute("data-required");
    var ok = true;
    var input = field.querySelector("input:not([type=radio]), textarea, select");
    switch (rule) {
      case "radio":
        ok = val(field.getAttribute("data-name")) !== "";
        break;
      case "text":
        var min = parseInt(field.getAttribute("data-minlength") || "1", 10);
        ok = input && input.value.trim().length >= min;
        break;
      case "tel":
        ok = input && input.value.replace(/\D/g, "").length >= 8;
        break;
      case "email-optional":
        ok = !input.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
        break;
      case "checkbox":
        ok = input && input.checked;
        break;
    }
    field.classList.toggle("has-error", !ok);
    if (input) input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }

  function validateStep(n) {
    var step = steps[n - 1];
    var fields = step.querySelectorAll("[data-required]");
    var firstBad = null;
    fields.forEach(function (f) {
      if (!checkField(f) && !firstBad) firstBad = f;
    });
    if (firstBad) {
      var focusable = firstBad.querySelector("input, textarea, select");
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 250);
      return false;
    }
    return true;
  }

  // Effacer l'erreur dès que la personne corrige
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);
  function onChange(e) {
    var field = e.target.closest("[data-required]");
    if (field && field.classList.contains("has-error")) checkField(field);
    if (e.target.name === "client" || e.target.name === "delai") updateConditionals();
    saveDraft();
  }

  /* ---------- Navigation entre étapes ---------- */
  function goTo(n, scroll) {
    current = n;
    steps.forEach(function (s, i) { s.classList.toggle("is-current", i === n - 1); });
    indicators.forEach(function (li, i) {
      li.classList.toggle("is-active", i === n - 1);
      li.classList.toggle("is-done", i < n - 1);
      if (i === n - 1) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (bar) bar.style.width = ((n - 1) / (steps.length - 1)) * 100 + "%";
    btnPrev.hidden = n === 1;
    btnNext.hidden = n === steps.length;
    btnSubmit.hidden = n !== steps.length;
    if (scroll) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  btnNext.addEventListener("click", function () {
    if (validateStep(current)) goTo(current + 1, true);
  });
  btnPrev.addEventListener("click", function () { goTo(current - 1, true); });

  // Revenir à une étape déjà remplie en touchant son numéro
  indicators.forEach(function (li, i) {
    li.addEventListener("click", function () {
      if (i + 1 < current) goTo(i + 1, true);
    });
  });

  /* ---------- Photos ---------- */
  photosInput.addEventListener("change", function () {
    photos = Array.prototype.slice.call(photosInput.files || []).slice(0, 10);
    renderThumbs();
  });

  function renderThumbs() {
    thumbs.innerHTML = "";
    if (!photos.length) return;
    photos.forEach(function (file) {
      var img = document.createElement("img");
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      img.onload = function () { URL.revokeObjectURL(img.src); };
      thumbs.appendChild(img);
    });
    var info = document.createElement("span");
    info.className = "thumbs-info";
    info.textContent = photos.length + (photos.length > 1 ? " photos ajoutées" : " photo ajoutée");
    var clear = document.createElement("button");
    clear.type = "button";
    clear.className = "linklike";
    clear.textContent = "Retirer";
    clear.addEventListener("click", function () {
      photos = [];
      photosInput.value = "";
      renderThumbs();
    });
    info.appendChild(document.createTextNode(" · "));
    info.appendChild(clear);
    thumbs.appendChild(info);
  }

  /* ---------- Brouillon (sur cet appareil uniquement) ---------- */
  var DRAFT_FIELDS = ["client", "service", "delai", "date", "pays", "ville", "adresse", "batiment", "societe",
    "fonction", "taille", "budget", "visite", "plans", "description", "nom", "tel", "email", "creneau", "contact"];

  function saveDraft() {
    try {
      var data = {};
      DRAFT_FIELDS.forEach(function (n) { data[n] = val(n); });
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) { /* stockage indisponible : on continue sans brouillon */ }
  }

  function setVal(name, value) {
    var els = form.elements[name];
    if (!els || value == null || value === "") return;
    if (els.length && els[0] && els[0].type === "radio") {
      for (var i = 0; i < els.length; i++) els[i].checked = els[i].value === value;
    } else {
      els.value = value;
    }
  }

  function restoreDraft() {
    try {
      var data = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (data) DRAFT_FIELDS.forEach(function (n) { setVal(n, data[n]); });
    } catch (e) { /* ignore */ }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- Pré-sélection par lien : commander.html?service=urgence&client=entreprise ---------- */
  function applyUrlParams() {
    var params = new URLSearchParams(location.search);
    var svc = params.get("service");
    if (svc) {
      var radio = form.querySelector('input[name="service"][data-key="' + svc.replace(/[^a-z]/gi, "") + '"]');
      if (radio) radio.checked = true;
      if (svc === "urgence") setVal("delai", "Urgent, aujourd'hui");
    }
    var client = (params.get("client") || "").toLowerCase();
    if (client === "entreprise") setVal("client", "Entreprise");
    if (client === "particulier") setVal("client", "Particulier");
  }

  /* ---------- Message récapitulatif ---------- */
  function makeRef() {
    var d = new Date();
    var pad = function (x) { return String(x).padStart(2, "0"); };
    return "LGP-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) +
      "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function formatDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  function buildMessage(ref) {
    var lines = [];
    var add = function (label, value) { if (value) lines.push("*" + label + " :* " + value); };
    var isPro = val("client") === "Entreprise";

    lines.push("*NOUVELLE DEMANDE – La Gazelle Plomberie*");
    lines.push("Réf. " + ref);
    lines.push("");
    add("Service", val("service"));
    var delai = val("delai");
    if (delai === "Date précise" && val("date")) delai = "le " + formatDate(val("date"));
    add("Délai", delai);
    add("Client", isPro ? "Entreprise" + (val("societe") ? " – " + val("societe") : "") : "Particulier");
    if (isPro) add("Fonction", val("fonction"));
    lines.push("");
    add("Lieu", [val("ville"), val("pays")].filter(Boolean).join(", "));
    add("Repère", val("adresse"));
    add("Bâtiment", val("batiment"));
    if (isPro) {
      add("Taille du projet", val("taille"));
      add("Budget estimatif", val("budget"));
      add("Visite sur site", val("visite"));
      add("Plans disponibles", val("plans"));
    }
    lines.push("");
    lines.push("*Besoin :*");
    lines.push(val("description"));
    lines.push("");
    add("Nom", val("nom"));
    add("Téléphone", val("tel"));
    add("E-mail", val("email"));
    add("Contact préféré", val("contact"));
    add("Joignable", val("creneau"));
    if (photos.length) {
      lines.push("");
      lines.push(photos.length + (photos.length > 1 ? " photos suivent." : " photo suit."));
    }
    lines.push("");
    lines.push("Envoyé depuis le site La Gazelle Plomberie");
    return lines.join("\n");
  }

  /* ---------- Envoi ---------- */
  var lastMessage = "";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    for (var i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) { goTo(i, false); return; }
    }
    var ref = makeRef();
    lastMessage = buildMessage(ref);

    document.getElementById("order-ref").textContent = ref;
    document.getElementById("order-recap").textContent = lastMessage.replace(/\*/g, "");
    document.getElementById("send-wa").href =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lastMessage);
    document.getElementById("send-sms").href =
      "sms:" + PHONE_INTL + "?body=" + encodeURIComponent(lastMessage.replace(/\*/g, ""));

    var shareBtn = document.getElementById("send-share");
    var canShareFiles = false;
    try {
      canShareFiles = photos.length > 0 && !!navigator.canShare && navigator.canShare({ files: photos });
    } catch (err) { canShareFiles = false; }
    shareBtn.hidden = !canShareFiles;
    document.getElementById("photo-hint").hidden = !photos.length;

    form.hidden = true;
    done.hidden = false;
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    done.focus({ preventScroll: true });
    clearDraft();
  });

  document.getElementById("send-share").addEventListener("click", function () {
    navigator.share({ files: photos, text: lastMessage.replace(/\*/g, "") }).catch(function () {});
  });

  document.getElementById("copy-recap").addEventListener("click", function () {
    var btn = this;
    var label = btn.querySelector("span");
    var text = lastMessage.replace(/\*/g, "");
    var ok = function () {
      label.textContent = "Récapitulatif copié";
      setTimeout(function () { label.textContent = "Copier le récapitulatif"; }, 2500);
    };
    var fallback = function () {
      var details = done.querySelector(".recap");
      details.open = true;
      var range = document.createRange();
      range.selectNodeContents(document.getElementById("order-recap"));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      label.textContent = "Texte sélectionné : copiez-le";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else {
      fallback();
    }
  });

  document.getElementById("btn-edit").addEventListener("click", function () {
    done.hidden = true;
    form.hidden = false;
    goTo(steps.length, true);
    saveDraft();
  });

  /* ---------- Démarrage ---------- */
  restoreDraft();
  applyUrlParams();
  updateConditionals();
  goTo(1, false);
})();
