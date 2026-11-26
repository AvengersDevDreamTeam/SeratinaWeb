# SeratinaWeb 🌐

Landing page ufficiale (`https://seratina.org`), ricerca eventi, portale legale e area gestori per l'applicazione mobile **Seratina** (iOS & Android).

---

## 📚 Documentazione Tecnica

| Documento | Descrizione |
|---|---|
| 🏗️ **[Architettura Portale Web](docs/architecture.md)** | Sito statico zero build-step su Firebase Hosting, pagine, API usate e sicurezza dei dati mostrati. |
| 🔗 **[Deep Linking & Pagina Evento](docs/deep-linking.md)** | Pagina evento `/eventi/ID` (template `evento.html` riempito da SeratinaBE), apertura dell'app mobile (`seratina://`) e link legacy `/?event=ID`. |
| 🔎 **[SEO & Indicizzazione](docs/seo.md)** | Meta tag, dati strutturati, sitemap, robots, `llms.txt` e indicizzazione delle singole serate. |

---

## Caratteristiche Principali

- **Zero Build Step, Zero Dipendenze npm**: Pagine HTML5 native e responsive con fogli di stile e moduli vanilla in `assets/` (`system.*`, `layout/layout.*`, `motion/motion.*`, `backgrounds/backgrounds.css`, `ui/ui.js`, `moments/pinned-chapters/`) e tipografia **Outfit** / **DM Mono**.
- **Hosting**: Firebase Hosting su dominio personalizzato `seratina.org` con HTTPS (`www` e `http` reindirizzati con 301). I file statici sono serviti così come sono; `/eventi/{id}` e `/sitemap-eventi.xml` sono inoltrati al backend su Cloud Run (`firebase.json`).
- **Ricerca Eventi (`eventi.html`)**: Elenco paginato delle serate dall'API di Seratina con ricerca testuale, filtri per città/zona, data (stasera, domani, weekend) e categoria (Club, Musica, Festival, Aperitivo, Arte & Spettacolo), ordinamento per distanza GPS e scheda evento in modal.
- **SEO & Indicizzazione**: Canonical, Open Graph e dati strutturati Schema.org su ogni pagina; ogni serata ha una pagina renderizzata lato server (`/eventi/ID`) con canonical e schema `Event` propri; `robots.txt`, `sitemap.xml`, sitemap degli eventi, `llms.txt` e `llms-full.txt`. Dettagli in [docs/seo.md](docs/seo.md).
- **Dark Mode Notturna**: Palette **Ink / Bone / Magenta / Mint** coerente con l'app mobile (`#0F0F14`, `#F2EFE9`, `#FF3D8B`, `#3DDC97`).
- **Home (`index.html`)**: Hero triptych animato (pulsanti `App Store` / `Google Play`, ancora `#scarica`), 4 schermate dell'app (`#anteprima`), sezione "Tutta la vita notturna a portata di mappa" (`#scopri`), chiusura con iscrizione alla newsletter del giovedì (`#newsletter`, autocompletamento OpenStreetMap Nominatim + GPS) e link legali/piattaforma nel footer.
- **Pagina Evento (Deep Linking)**: `/eventi/ID` è una pagina completa del sito, generata da SeratinaBE nel template `evento.html`: locandina intera, data, orario, locale, prezzo ("A partire da €X" se ci sono più tariffe), card delle tipologie di ingresso con link d'acquisto, descrizione, blocco del locale con logo e tutte le sue prossime serate (le prime 6 visibili, le altre con "Mostra tutte"). Pulsanti "Apri nell'app Seratina" (`seratina://event/{id}`) e "Condividi serata". Se l'evento non esiste la pagina risponde 404 con "Serata non trovata". Dettagli in [docs/deep-linking.md](docs/deep-linking.md).

---

## Pagine Incluse

| File | Scopo | Note |
|---|---|---|
| **`index.html`** | Landing page ufficiale | Hero triptych, 4 schermate dell'app (`#anteprima`), sezione `#scopri`, newsletter + footer (`#newsletter`). Reindirizza i link legacy `/?event=ID` a `/eventi/ID`. |
| **`eventi.html`** | Ricerca eventi & scheda serata | Elenco con filtri e paginazione, card come link alla pagina evento `/eventi/ID`. Menu mobile sotto 769px. |
| **`gestori.html`** | Area Gestori Locali | Modulo asincrono per i titolari di locali (aggiornamento scheda o opt-out) con invio a `POST /gestori/richiesta`. |
| **`privacy.html`** | Informativa sulla Privacy | Conforme a GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play Data Safety. |
| **`terms.html`** | Termini di Servizio | Condizioni di utilizzo e clausola di non responsabilità sui dati aggregati. |
| **`delete-account.html`** | Cancellazione Account | Guida e modulo obbligatorio per le policy Google Play e Apple. Escluso dall'indicizzazione (`robots.txt`). |
| **`unsubscribe.html`** | Disiscrizione Newsletter | Pagina statica di disiscrizione 1-click a norma GDPR con chiamata `POST /newsletter/unsubscribe`. Esclusa dall'indicizzazione. |

File di supporto: `evento.html` (template della pagina evento, vedi [docs/deep-linking.md](docs/deep-linking.md)), `assets/site.css` (stili condivisi tra elenco e pagina evento), `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `firebase.json`, `.firebaserc`.

---

## Visualizzazione in Locale

Le pagine che chiamano le API (`eventi.html`, la newsletter) vanno servite via HTTP, non aperte con doppio click:

```bash
# Con Python
python -m http.server 8091

# Oppure con npx
npx serve . -l 8091
```

Poi apri `http://localhost:8091/` oppure `http://localhost:8091/eventi.html`. Le pagine `/eventi/ID` le genera il backend: avvia SeratinaBE con `SITE_TEMPLATE_URL=http://localhost:8091/evento.html` e apri `http://localhost:8080/eventi/<ID>` (gli asset del sito si caricano solo dallo stesso host, quindi lì la pagina appare senza stili).

Da `localhost` / `127.0.0.1` le pagine chiamano il backend locale su `http://localhost:8080` (avvia `SeratinaBE`); da qualsiasi altro dominio usano il backend su Cloud Run. Non servire il sito sulla porta 8080, che è quella del backend.

---

## Deploy

Il workflow `.github/workflows/firebase-hosting.yml` pubblica su Firebase Hosting a ogni push su `main` (secret `FIREBASE_SERVICE_ACCOUNT`). Lo sviluppo avviene su `develop`: le modifiche vanno online solo dopo il merge in `main`.

---

## Licenza

Distribuito con licenza **MIT**.
