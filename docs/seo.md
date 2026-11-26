# SEO & Indicizzazione — SeratinaWeb 🔎

Questo documento descrive come il sito si presenta ai motori di ricerca e agli assistenti AI.

---

## 1. Meta Tag e Dati Strutturati per Pagina

| Pagina | Canonical | Schema.org |
|---|---|---|
| `index.html` | `https://seratina.org/` | `Organization`, `WebSite`, `SoftwareApplication` (gratuita, iOS e Android) |
| `eventi.html` | `https://seratina.org/eventi.html` | `CollectionPage` |
| `/eventi/ID` | `https://seratina.org/eventi/ID` | `Event` (nell'HTML generato dal backend, vedi sezione 2) |
| `eventi.html?event=ID` | `https://seratina.org/eventi/ID` | `Event` (aggiunto via JavaScript) |

Ogni pagina pubblica ha `title`, meta description, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`), Twitter Card e un solo `<h1>`.

`SoftwareApplication` espone `downloadUrl` con i link App Store e Google Play.

---

## 2. Indicizzazione delle Singole Serate

Ogni serata ha un URL proprio: `https://seratina.org/eventi/ID`.

**Pagina renderizzata lato server.** Firebase Hosting inoltra `/eventi/**` al backend su Cloud Run (`GET /eventi/{id}`, `share_renderer.py` in SeratinaBE). Google riceve già nell'HTML:
- `<title>` (`{titolo} @ {locale} — Seratina`), description, canonical, Open Graph e Twitter Card;
- schema `Event` in JSON-LD;
- `<h1>`, locandina, data, locale, indirizzo e descrizione.

Non serve eseguire JavaScript, quindi la pagina si indicizza come una pagina statica. Le risposte restano in cache sulla CDN di Firebase per un'ora (`s-maxage=3600`).

**Stati della pagina:**
- **Evento inesistente**: 404 con `noindex, follow`.
- **Evento passato**: 200 con il badge "Evento concluso". La pagina resta indicizzabile e non perde il valore accumulato.

**Scheda in `eventi.html`.** `eventi.html?event=ID` resta per la navigazione: apre la scheda in modal, aggiorna title, description, Open Graph e schema `Event` via JavaScript (`applyEventSeo()`). Canonical e `og:url` puntano a `/eventi/ID`, così Google consolida i due indirizzi sulla pagina server.

Il canonical di `eventi.html` non è nell'HTML statico: lo crea uno script in testa alla `<head>`, verso `/eventi/ID` se c'è `?event=ID`, altrimenti verso `eventi.html`. Se la serata non esiste, lo script aggiunge `<meta name="robots" content="noindex">` insieme alla schermata "Evento non trovato".

**Scoperta degli URL**: le card dell'elenco sono link `<a href="/eventi/ID">` e la sitemap degli eventi (sezione 3) elenca tutte le serate future.

---

## 3. Sitemap e Robots

- **`sitemap.xml`** (statica): home, `eventi.html`, `gestori.html`, `privacy.html`, `terms.html`.
- **Sitemap degli eventi** (`https://seratina.org/sitemap-eventi.xml`): generata dal backend e servita tramite il rewrite di Firebase Hosting; contiene un URL `/eventi/ID` per ogni serata di oggi e dei giorni successivi. Il `lastmod` è la data di inserimento dell'evento (`scraped_at`), mai la data della serata: Google ignora i `lastmod` futuri. È sullo stesso host del sito, quindi si invia dalla proprietà `seratina.org` di Google Search Console.
- **`robots.txt`**: consente tutto tranne `delete-account.html` e `unsubscribe.html`; autorizza esplicitamente i crawler AI (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`) e dichiara entrambe le sitemap.

---

## 4. Contenuti per Assistenti AI

- **`llms.txt`**: panoramica del servizio, copertura geografica e link principali.
- **`llms-full.txt`**: documentazione estesa delle funzionalità (mappa, scheda serata, filtri per categoria, locali seguiti e notifiche, newsletter, area gestori, privacy).

Entrambi descrivono le categorie reali degli eventi (Club, Musica, Festival, Aperitivo, Arte & Spettacolo): Seratina non gestisce i generi musicali, quindi non vanno citati né qui né nei meta tag.

---

## 5. Checklist per le Modifiche

- Nuova pagina pubblica: canonical, title, description, Open Graph, un `<h1>`, voce in `sitemap.xml`.
- Pagina di servizio da non indicizzare: `Disallow` in `robots.txt` e nessuna voce in `sitemap.xml`.
- Nuova funzionalità del prodotto: aggiornare `llms.txt` e `llms-full.txt`.
- Modifica ai campi dell'evento mostrati o indicizzati: aggiornare `applyEventSeo()` in `eventi.html` e applicare `escapeHtml()` a ogni nuovo valore inserito nel template delle card.
- Le modifiche diventano visibili ai motori di ricerca solo dopo il merge di `develop` in `main` (deploy Firebase Hosting).
