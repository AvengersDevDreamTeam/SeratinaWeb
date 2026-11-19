# SEO & Indicizzazione — SeratinaWeb 🔎

Questo documento descrive come il sito si presenta ai motori di ricerca e agli assistenti AI.

---

## 1. Meta Tag e Dati Strutturati per Pagina

| Pagina | Canonical | Schema.org |
|---|---|---|
| `index.html` | `https://seratina.org/` | `Organization`, `WebSite`, `SoftwareApplication` (gratuita, iOS e Android) |
| `eventi.html` | `https://seratina.org/eventi.html` | `CollectionPage` |
| `eventi.html?event=ID` | `https://seratina.org/eventi.html?event=ID` | `Event` (aggiunto via JavaScript, vedi sezione 2) |

Ogni pagina pubblica ha `title`, meta description, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`), Twitter Card e un solo `<h1>`.

`SoftwareApplication` non ha ancora `downloadUrl` / `installUrl`: vanno aggiunti quando l'app sarà pubblicata su App Store e Google Play.

---

## 2. Indicizzazione delle Singole Serate

Ogni serata ha un URL proprio: `https://seratina.org/eventi.html?event=ID`.

Quando lo Spotlight Modal si apre (da card o da URL diretto), `eventi.html` aggiorna la `<head>`:
- `link[rel=canonical]` e `og:url` puntano all'URL della serata.
- `<title>`: `{titolo} @ {locale} — Seratina`.
- Meta description e `og:description`: `{data} presso {locale}, {città}: {prima riga della descrizione}`.
- `og:image`: la locandina dell'evento.
- Script `application/ld+json` con id `eventJsonLd` e schema `Event`: nome, `startDate` (orario di inizio, oppure le 22:00 se manca), luogo con indirizzo e coordinate, immagine, descrizione, organizzatore, `Offer` con il prezzo minimo in EUR.

Alla chiusura del modal i tag tornano quelli della pagina elenco e lo script `Event` viene rimosso.

Google esegue il JavaScript prima di indicizzare, quindi legge i tag aggiornati; l'indicizzazione delle pagine generate lato client è però più lenta di quella delle pagine statiche.

**Scoperta degli URL**: le card dell'elenco sono link `<a href="eventi.html?event=ID">` e la sitemap dinamica (sezione 3) elenca tutte le serate future.

---

## 3. Sitemap e Robots

- **`sitemap.xml`** (statica): home, `eventi.html`, `gestori.html`, `privacy.html`, `terms.html`.
- **Sitemap degli eventi**: generata dall'API di Seratina e dichiarata in `robots.txt`; contiene un URL `eventi.html?event=ID` per ogni serata di oggi e dei giorni successivi.
- **`robots.txt`**: consente tutto tranne `test.html`, `delete-account.html` e `unsubscribe.html`; autorizza esplicitamente i crawler AI (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`) e dichiara entrambe le sitemap.

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
- Le modifiche diventano visibili ai motori di ricerca solo dopo il merge di `develop` in `main` (GitHub Pages).
