# SeratinaWeb 🌐

Landing page ufficiale (`https://seratina.org`), portale legale e area gestori per l'applicazione mobile **Seratina** (iOS & Android).

---

## 📚 Documentazione Tecnica

| Documento | Descrizione |
|---|---|
| 🌌 **[Ecosistema Seratina](../../SeratinaBE/docs/ecosystem.md)** | Architettura complessiva dei 6 repository, pipeline di ingestione e flussi dati. |
| 🏗️ **[Architettura Portale Web](docs/architecture.md)** | Architettura statica zero build-step (<50ms TTFB), CDN GitHub Pages, geocoding Nominatim e connessioni API verso SeratinaBE. |
| 🔗 **[Deep Linking & Spotlight Modal](docs/deep-linking.md)** | Gestione universale di condivisione `?event=ID`, handshake con l'app mobile (`seratina://`) e fallback. |

---

## Caratteristiche Principali

- **Zero Build Step, Zero Dipendenze npm**: Pagine HTML5 native e responsive con fogli di stile e moduli vanilla in `assets/` (`system.*`, `layout/layout.*`, `motion/motion.*`, `backgrounds/backgrounds.css`, `ui/ui.js`, `moments/pinned-chapters/`) e tipografia **Outfit** / **DM Mono**.
- **Caricamento Istantaneo (<50ms TTFB)**: Erogazione globale tramite GitHub Pages Edge CDN su dominio personalizzato `seratina.org` con HTTPS forzato.
- **SEO & Indicizzazione**: Include `robots.txt` e `sitemap.xml` per i motori di ricerca.
- **Dark Mode Notturna**: Palette **Ink / Bone / Magenta / Mint** coerente con l'app mobile (`#0F0F14`, `#F2EFE9`, `#FF3D8B`, `#3DDC97`).
- **Struttura Essenziale (`index.html`)**: Hero triptych animato (`Prova la Beta` -> `test.html`), griglia delle 4 schermate dell'app (`#anteprima`), chiusura integrata con iscrizione alla newsletter del giovedì (`#newsletter`, autocompletamento OpenStreetMap Nominatim + GPS) e link legali/piattaforma nel footer.
- **Event Spotlight Modal (Deep Linking)**: Supporto a `?event=ID` per visualizzare un'anteprima interattiva popup della serata (locandina, orari, prezzi, locale) con pulsante per aprire l'app nativa (`seratina://event/{id}`) o passare alla beta (`test.html`).

---

## Pagine Incluse

| File | Scopo | Note |
|---|---|---|
| **`index.html`** | Landing page ufficiale & Anteprima Eventi | Hero triptych, 4 schermate dell'app (`#anteprima`), iscrizione newsletter + footer (`#newsletter`) e modal popup per eventi condivisi (`?event=ID`). |
| **`privacy.html`** | Informativa sulla Privacy | Conforme a GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play Data Safety. |
| **`terms.html`** | Termini di Servizio | Condizioni di utilizzo e clausola di non responsabilità sui dati aggregati. |
| **`delete-account.html`** | Cancellazione Account | Guida e modulo obbligatorio per le policy Google Play e Apple. |
| **`gestori.html`** | Area Gestori Locali | Modulo asincrono per i titolari di locali (aggiornamento scheda o opt-out) con invio a `POST /gestori/richiesta`. |
| **`unsubscribe.html`** | Disiscrizione Newsletter | Pagina statica di disiscrizione 1-click a norma GDPR con chiamata `POST /newsletter/unsubscribe`. |
| **`test.html`** | Closed Beta & Testing iOS / Android | Onboarding per i beta tester: 2 passaggi per Apple TestFlight e 3 passaggi per Google Play Closed Beta. |

---

## Visualizzazione in Locale

Basta fare doppio click su `index.html` per aprirlo in qualsiasi browser, oppure:

```bash
# Con Python
python -m http.server 8080

# Oppure con npx
npx serve .
```

---

## Licenza

Distribuito con licenza **MIT**.
