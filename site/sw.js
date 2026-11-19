/* Service worker : met le site en cache pour un chargement rapide et hors connexion */
var CACHE = "la-gazelle-v3";
var CORE = [
  "./", "index.html", "boutique.html", "commander.html", "formations.html",
  "assets/css/style.css", "assets/js/main.js", "assets/js/commander.js", "assets/js/produits.js", "assets/js/boutique.js",
  "assets/img/logo-sm.webp", "assets/img/logo-sm.png", "assets/img/fondateur.jpg",
  "assets/img/achille-yeye-portrait.jpg", "assets/img/favicon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Réseau d'abord : le contenu est toujours à jour ; le cache sert seulement hors connexion. */
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (r) {
        return r || (req.mode === "navigate" ? caches.match("index.html") : undefined);
      });
    })
  );
});
