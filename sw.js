/* Service worker di Piano Alimentare: conserva i file dell'app per l'uso senza internet.
 * I dati dell'utente NON passano di qui: restano in IndexedDB. Generato dalla build (vite.config.ts). */
const CACHE = 'piano-alimentare-6b03e7bd01d6'
const FILE = ["./","assets/pdf.worker.min-rsCePomN.mjs","assets/index-dlwnYAyc.css","assets/index-BG94GcHa.js","assets/pdf-Dz54kZCC.js","assets/pdf.worker.min-7WEkucD6.js","assets/jspdf.es.min-Cgm2AwMh.js","assets/vuoto-BkiAkXrA.js","manifest.webmanifest","icone/icona.svg","icone/icona-192.png","icone/icona-512.png","icone/apple-touch-icon.png","icone/favicon-32.png"]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(FILE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((chiavi) => Promise.all(chiavi.filter((k) => k.startsWith('piano-alimentare-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return
  if (r.mode === 'navigate') {
    // Pagina: prima la rete (per gli aggiornamenti), senza rete la copia conservata
    e.respondWith(
      fetch(r)
        .then((risposta) => {
          const copia = risposta.clone()
          if (risposta.ok) caches.open(CACHE).then((c) => c.put('./', copia))
          return risposta
        })
        .catch(() => caches.match('./', { ignoreSearch: true })),
    )
    return
  }
  // File con l'impronta nel nome: non cambiano mai, si servono dalla cache
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((c) => c || fetch(r)))
})
