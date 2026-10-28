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

- **Zero Build Step, Zero Dipendenze npm**: Pagine HTML5 native e responsive stilizzate con Tailwind CSS tramite CDN compilato.
- **Caricamento Istantaneo (<50ms TTFB)**: Erogazione globale tramite GitHub Pages Edge CDN su dominio personalizzato `seratina.org` con HTTPS forzato.
- **SEO & Indicizzazione**: Include `robots.txt` e `sitemap.xml` per i motori di ricerca.
- **Dark Mode Notturna**: Palette coerente con l'app mobile (`#E86D80`, `#6366F1`, `#0B0F17`).
- **Sezione Newsletter Settimanale**: Box macrosezione in `index.html` con autocompletamento città (OpenStreetMap Nominatim), rilevamento coordinate GPS e integrazione diretta con `SeratinaBE`.
- **Event Spotlight Modal (Deep Linking)**: Supporto a `?event=ID` per visualizzare un'anteprima interattiva popup della serata (locandina, orari, prezzi, locale) con pulsante per aprire l'app nativa (`seratina://event/{id}`) o scaricarla dagli store.

---

## Pagine Incluse

| File | Scopo | Note |
|---|---|---|
| **`index.html`** | Landing page ufficiale & Anteprima Eventi | Presentazione app, mockup, badge Store e modal popup dinamico per anteprime eventi condivisi (`?event=ID`). |
| **`privacy.html`** | Informativa sulla Privacy | Conforme a GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play Data Safety. |
| **`terms.html`** | Termini di Servizio | Condizioni di utilizzo e clausola di non responsabilità sui dati aggregati. |
| **`delete-account.html`** | Cancellazione Account | Guida e modulo obbligatorio per le policy Google Play e Apple. |
| **`gestori.html`** | Area Gestori Locali | Modulo asincrono per i titolari di locali (aggiornamento scheda o opt-out) con invio a `POST /gestori/richiesta`. |
| **`unsubscribe.html`** | Disiscrizione Newsletter | Pagina statica di disiscrizione 1-click a norma GDPR con chiamata `POST /newsletter/unsubscribe`. |

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
