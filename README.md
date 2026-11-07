# SeratinaWeb 🌐

Landing page ufficiale (`https://seratina.org`), portale legale e area gestori per l'applicazione mobile **Seratina** (iOS & Android).

---

## 📚 Documentazione Tecnica

| Documento | Descrizione |
|---|---|
| 🌌 **[Ecosistema Seratina](../../SeratinaBE/docs/ecosystem.md)** | Architettura complessiva dei 6 repository, pipeline di ingestione e flussi dati. |
| 🏗️ **[Architettura Portale Web](docs/architecture.md)** | Architettura statica zero build-step (<50ms TTFB), CDN GitHub Pages, geocoding Nominatim e connessioni API verso SeratinaBE. |
| 🔗 **[Deep Linking & Spotlight Modal](docs/deep-linking.md)** | Gestione universale di condivisione `?event=ID`, handshake con l'app mobile (`seratina://`) e fallback. |
| 🔍 **[Analisi iniziale](ANALISI.md)** | Problemi e verifiche relativi alla versione iniziale; gli interventi rinviati restano documentati. |
| 🎨 **[Piano grafico](docs/design-plan.md)** | Palette, composizione e materiali della nuova home. |
| ✅ **[Verifiche del redesign](docs/design-review.md)** | Esiti di layout, interazione, prestazioni e limiti dei controlli. |

---

## Caratteristiche Principali

- **Zero Build Step, Zero Dipendenze npm**: Pagine HTML5 statiche. La home usa CSS, moduli JavaScript e font locali; la pagina beta conserva il runtime Tailwind da CDN.
- **Hosting Statico**: Pubblicazione tramite GitHub Pages sul dominio personalizzato `seratina.org`.
- **SEO & Indicizzazione**: Include `robots.txt` e `sitemap.xml` per i motori di ricerca.
- **Tema Chiaro e Scuro nella Home**: Palette ink `#0F0F14`, bone `#F2EFE9`, magenta `#FF3D8B` e mint `#3DDC97`, con font Outfit locali e preferenza di sistema o manuale.
- **Nuove Schermate dell'App**: Anteprime responsive di Eventi e Mappa, Dettaglio e Calendario, più un video silenzioso di 8 secondi con play/pausa, contatore e supporto al movimento ridotto.
- **Sezione Newsletter Settimanale**: Box macrosezione in `index.html` con autocompletamento città (OpenStreetMap Nominatim), rilevamento coordinate GPS e integrazione diretta con `SeratinaBE`.
- **Event Spotlight Modal (Deep Linking)**: Supporto a `?event=ID` per visualizzare un'anteprima interattiva popup della serata (locandina, orari, prezzi, locale) con pulsante per aprire l'app nativa (`seratina://event/{id}`) o scaricarla dagli store.

---

## Pagine Incluse

| File | Scopo | Note |
|---|---|---|
| **`index.html`** | Landing page ufficiale & Anteprima Eventi | Schermate attuali dell'app, video, selettore Eventi/Mappa, accesso alla beta e popup per eventi condivisi (`?event=ID`). |
| **`privacy.html`** | Informativa sulla Privacy | Conforme a GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play Data Safety. |
| **`terms.html`** | Termini di Servizio | Condizioni di utilizzo e clausola di non responsabilità sui dati aggregati. |
| **`delete-account.html`** | Cancellazione Account | Guida e modulo obbligatorio per le policy Google Play e Apple. |
| **`gestori.html`** | Area Gestori Locali | Modulo asincrono per i titolari di locali (aggiornamento scheda o opt-out) con invio a `POST /gestori/richiesta`. |
| **`unsubscribe.html`** | Disiscrizione Newsletter | Pagina statica di disiscrizione 1-click a norma GDPR con chiamata `POST /newsletter/unsubscribe`. |
| **`test.html`** | Closed Beta & Testing iOS / Android | Onboarding per i beta tester: 2 passaggi per Apple TestFlight e 3 passaggi per Google Play Closed Beta. |

---

## Visualizzazione in Locale

Avvia un server dalla cartella `SeratinaWeb`: la home carica moduli JavaScript e richiede HTTP.

```bash
# Con Python
python3 -m http.server 3000 --bind 127.0.0.1

# Oppure con npx
npx serve .
```

Con il comando Python, apri [http://localhost:3000](http://localhost:3000). Le API locali usano ancora la porta `8080`: per provare newsletter ed eventi condivisi serve anche SeratinaBE. La sola anteprima grafica non richiede il backend.

Le catture dell'app e la loro provenienza sono descritte in [assets/screenshots/current/README.md](assets/screenshots/current/README.md). Report e screenshot locali dei controlli restano in `.taste-skill/`, esclusa dal versionamento.

---

## Licenza

Distribuito con licenza **MIT**.
