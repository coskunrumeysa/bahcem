// Bahçem service worker: uygulamayı telefonda saklar, internetsiz de açılmasını sağlar.
// index.html'i değiştirdiğinde VERSION'ı bir artır ki telefonlar yeni sürümü alsın.
const VERSION = "bahcem-v5";
const SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.svg",
  "https://cdn.jsdelivr.net/npm/adhan@4.4.3/lib/bundles/adhan.umd.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.10/dist/umd/supabase.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Veritabanı istekleri her zaman ağdan gider, asla önbelleğe alınmaz.
  if (url.hostname.endsWith("supabase.co") || url.hostname.endsWith("supabase.in")) return;

  // config.js her zaman önce ağdan alınır, böylece değişiklikler hemen görünür.
  if (url.origin === self.location.origin && url.pathname.endsWith("/config.js")) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Sayfanın kendisi: önce ağ (güncel sürüm), ağ yoksa önbellek.
  const scopePath = new URL(self.registration.scope).pathname;
  const isApp = url.pathname === scopePath || url.pathname === scopePath + "index.html";
  if (req.mode === "navigate" && isApp) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Diğer dosyalar (yazı tipleri, kütüphaneler, ikonlar): önbellekten hemen ver, arkada tazele.
  event.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
