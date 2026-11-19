/* Service worker : met le site en cache pour un chargement rapide et hors connexion */
var CACHE = "la-gazelle-v1";
var CORE = [
  "./", "index.html", "boutique.html", "commander.html", "formations.html",
  "assets/css/style.css", "assets/js/main.js",
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

/* Pages : réseau d'abord (contenu à jour), cache en secours. Fichiers : cache d'abord. */
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match("index.html"); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        if (res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
