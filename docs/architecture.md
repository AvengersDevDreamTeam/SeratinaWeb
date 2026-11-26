# Architettura del Portale Web — SeratinaWeb 🌐

Questo documento descrive l'architettura del sito statico **SeratinaWeb** (`https://seratina.org`), ospitato su **Firebase Hosting**.

---

## 1. Principi Architetturali

1. **Zero Build Step, Zero Dipendenze npm**: Nessun bundler, nessun `package.json`, nessun runtime Node.js. Le pagine HTML5 usano CSS/JS statici in `assets/`, font Google **Outfit** e **DM Mono**, e immagini `.webp` multi-risoluzione (`320w`/`560w`/`760w`).
2. **Hosting**: Il sito è servito da Firebase Hosting con HTTPS. Le pagine evento `/eventi/{id}` sono generate dal backend (vedi sezione 5).
3. **Pagine sempre disponibili**: Le pagine legali, informative e di opt-out sono statiche e restano consultabili anche se le API non rispondono.

---

## 2. Pagine e Moduli Inclusi

| File | Scopo | API usate |
|---|---|---|
| **`index.html`** | Landing page: Hero triptych (pulsanti `App Store` / `Google Play`, ancora `#scarica`), 4 schermate app (`#anteprima`), sezione "Tutta la vita notturna a portata di mappa" (`#scopri`), newsletter + footer (`#newsletter`). Reindirizza i link legacy `/?event=ID` a `eventi.html?event=ID`. | `POST /newsletter/subscribe` |
| **`eventi.html`** | Ricerca eventi: elenco paginato con ricerca, filtri (zona, data, categoria), ordinamento GPS e scheda evento su `?event=ID`. | `GET /events`, `GET /events/zones`, `GET /events/{id}` |
| **`gestori.html`** | Modulo per i titolari dei locali: verifica o correzione dei dati, rivendicazione della scheda o diritto di opposizione (Opt-Out GDPR Art. 21). | `POST /gestori/richiesta` |
| **`privacy.html`** | Informativa sul trattamento dei dati personali (GDPR, Apple App Store, Google Play Data Safety). | — |
| **`terms.html`** | Termini di servizio e clausola di non responsabilità sui dati aggregati. | — |
| **`delete-account.html`** | Istruzioni per richiedere la cancellazione dell'account, richieste dalle policy di Google Play e Apple. | — |
| **`unsubscribe.html`** | Disiscrizione 1-click dalla newsletter dal link presente nelle email (`?token=...`). | `POST /newsletter/unsubscribe` |

Tutte le chiamate vanno all'API pubblica di Seratina, il cui indirizzo è definito negli script di ogni pagina.

---

## 3. Newsletter con Geocoding (`index.html`)

- **Posizione GPS**: `navigator.geolocation` per latitudine e longitudine correnti (opzionale).
- **Ricerca del comune**: OpenStreetMap Nominatim limitato all'Italia (`countrycodes=it`), con selezione della città dall'elenco dei risultati.
- **Invio**: `POST /newsletter/subscribe` con email, città e coordinate.

---

## 4. Ricerca Eventi (`eventi.html`)

- **Elenco**: `GET /events` con parametri `category`, `zone`, `date` (`oggi`, `domani`, `weekend`), `search`, `latitude`/`longitude` (pulsante "Vicino a me"), `page`, `page_size`. "Carica altre serate" richiede la pagina successiva.
- **Zone**: `GET /events/zones` popola il selettore della città.
- **Scheda evento**: un click su una card apre la scheda in un modal e aggiorna l'URL in `?event=ID`; aprendo direttamente `eventi.html?event=ID` la pagina chiama `GET /events/{id}`.
- **Card come link**: ogni card è un `<a href="/eventi/ID">`, così i motori di ricerca seguono i link verso le pagine evento renderizzate lato server. Un click normale apre il modal; Ctrl/Cmd+click apre la pagina `/eventi/ID` in una nuova scheda.
- **Prezzo**: se l'evento ha più tariffe diverse, la scheda mostra "A partire da €X" con il prezzo minimo; l'elenco delle tariffe resta sotto.
- **Menu mobile**: sotto 769px i link della barra sono sostituiti dal pulsante ☰, che apre il menu a schermo intero di `system.css`.

### Sicurezza dei dati mostrati

I dati degli eventi (titoli, locali, città, immagini) provengono da fonti esterne. Le card sono generate da un template HTML, quindi ogni valore passa da `escapeHtml()` prima di essere inserito; nella scheda evento i valori sono assegnati con `textContent`. Qualsiasi nuovo campo mostrato in pagina deve seguire la stessa regola: mai inserire dati dell'API in `innerHTML` senza escape.

Il comportamento SEO della scheda evento è descritto in [seo.md](seo.md).

---

## 5. Hosting e Deploy

Firebase Hosting (progetto `gen-lang-client-0131025154`) serve `https://seratina.org` con HTTPS; `www` e `http` sono reindirizzati a `https://seratina.org`. Il workflow `.github/workflows/firebase-hosting.yml` pubblica a ogni push su `main` con il secret `FIREBASE_SERVICE_ACCOUNT`. Lo sviluppo avviene su `develop`: le modifiche vanno online solo dopo il merge in `main`.

`firebase.json` pubblica la radice del repo (esclusi `docs/`, `README.md` e i file nascosti) e inoltra al servizio Cloud Run `seratina-be` (`europe-west8`), con il path invariato:
- `/eventi/**`: pagina evento renderizzata lato server.
- `/sitemap-eventi.xml`: sitemap degli eventi.

I file statici hanno la precedenza sui rewrite, quindi `eventi.html` resta servito come file. Le risposte del backend sono messe in cache dalla CDN di Firebase (`s-maxage=3600`).
