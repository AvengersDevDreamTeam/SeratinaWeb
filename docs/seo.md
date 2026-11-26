# SEO & Indicizzazione — SeratinaWeb 🔎

Questo documento descrive come il sito si presenta ai motori di ricerca e agli assistenti AI.

---

## 1. Meta Tag e Dati Strutturati per Pagina

| Pagina | Canonical | Schema.org |
|---|---|---|
| `index.html` | `https://seratina.org/` | `Organization`, `WebSite`, `SoftwareApplication` (gratuita, iOS e Android) |
| `eventi.html` | `https://seratina.org/eventi.html` | `CollectionPage` |
| `/eventi/ID` | `https://seratina.org/eventi/ID` | `Event` e `BreadcrumbList` (nell'HTML generato dal backend, vedi sezione 2) |
| `evento.html` | — | Template della pagina evento, `noindex` (vedi sezione 2) |

Ogni pagina pubblica ha `title`, meta description, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`), Twitter Card e un solo `<h1>`.

`SoftwareApplication` espone `downloadUrl` con i link App Store e Google Play.

---

## 2. Indicizzazione delle Singole Serate

Ogni serata ha un solo URL: `https://seratina.org/eventi/ID`.

**Pagina renderizzata lato server.** Firebase Hosting inoltra `/eventi/**` al backend su Cloud Run (`GET /eventi/{id}`, `event_page_renderer.py` in SeratinaBE). Il backend riempie il template `evento.html` di questo repo, quindi la pagina ha header, footer e stili del sito. Google riceve già nell'HTML:
- `<title>` (`{titolo} @ {locale} — Seratina`), description, canonical, Open Graph e Twitter Card;
- schema `Event` e `BreadcrumbList` in JSON-LD;
- `<h1>`, locandina, data, orario, locale, indirizzo, prezzo e descrizione;
- link interni: breadcrumb, elenco della città e tutte le prossime serate dello stesso locale (anche quelle nascoste dietro "Mostra tutte", che restano nell'HTML).

Non serve eseguire JavaScript, quindi la pagina si indicizza come una pagina statica. Le risposte restano in cache sulla CDN di Firebase per un'ora (`s-maxage=3600`).

**Stati della pagina:**
- **Evento inesistente**: 404 con `noindex, follow`.
- **Evento passato**: 200 con il badge "Evento concluso". La pagina resta indicizzabile e non perde il valore accumulato.

**Template `evento.html`.** È pubblico (il backend lo scarica da `https://seratina.org/evento.html`), ma il blocco `<!--SSR:HEAD-->` contiene `<meta name="robots" content="noindex">`: il file grezzo non si indicizza, mentre nelle pagine generate il backend sostituisce l'intero blocco.

**Elenco `eventi.html`.** Ha canonical statico verso `eventi.html`. Le card sono link `<a href="/eventi/ID">`, quindi Google le segue senza eseguire JavaScript. La vecchia scheda in modal (`eventi.html?event=ID`) non esiste più.

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
- Modifica ai campi dell'evento mostrati o indicizzati: aggiornare `event_page_renderer.py` in SeratinaBE (pagina evento) e, per le card dell'elenco, il template in `eventi.html` con `escapeHtml()` su ogni nuovo valore.
- Modifica a header, footer o stili della pagina evento: `evento.html` e `assets/site.css`. Il backend rilegge il template entro 10 minuti; le pagine già in cache CDN si aggiornano entro un'ora.
- Le modifiche diventano visibili ai motori di ricerca solo dopo il merge di `develop` in `main` (deploy Firebase Hosting).
