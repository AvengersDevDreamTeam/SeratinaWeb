# SeratinaWeb

Landing page ufficiale, portale legale e area gestori per l'applicazione mobile **Seratina** (iOS & Android).

## Caratteristiche
- **Zero build step, zero dipendenze npm**: Pagine HTML5 responsive stilizzate con Tailwind CSS via CDN.
- **Caricamento istantaneo**: <50ms su Edge CDN globale (GitHub Pages).
- **SEO & Indicizzazione**: Include `robots.txt` e `sitemap.xml` per i motori di ricerca.
- **Dark Mode Notturna**: Palette coerente con l'app mobile (`#E86D80`, `#6366F1`, `#0B0F17`).
- **Sezione Newsletter Settimanale**: Box macrosezione in `index.html` con geocoding autocompletamento città italiane (OpenStreetMap Nominatim), rilevamento coordinate GPS e integrazione diretta con il backend Seratina.
- **Event Spotlight Modal (Deep Linking)**: Supporto a `?event=ID` per visualizzare un'anteprima interattiva popup della serata (locandina intera `object-contain` + ambient blur, orari, locale, prezzi) con pulsante per aprire l'app nativa (`seratina://event/{id}`) o scaricarla dagli store.

---

## Pagine Incluse

| File | Descrizione | Scopo |
|---|---|---|
| **`index.html`** | Landing page ufficiale & Anteprima Eventi | Presentazione dell'app con mockup, badge Store e modal popup dinamico per anteprime eventi condivisi (`?event=ID`). |
| **`privacy.html`** | Informativa sulla Privacy | Conforme a GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play. |
| **`terms.html`** | Termini di Servizio | Condizioni di utilizzo e clausola di non responsabilità sui dati aggregati. |
| **`delete-account.html`** | Cancellazione Account | Guida e form mailto richiesta obbligatoriamente da Google Play Data Safety. |
| **`gestori.html`** | Area Gestori Locali | Modulo asincrono per i titolari di locali (aggiornamento scheda o opt-out) con invio a `POST /gestori/richiesta`. |
| **`unsubscribe.html`** | Disiscrizione Newsletter | Pagina statica di disiscrizione 1-click conforme a GDPR con chiamata `POST /newsletter/unsubscribe`. |

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

## Pubblicazione su GitHub Pages

1. Crea la repository su GitHub: `AvengersDevDreamTeam/SeratinaWeb` (o `seratina-web`).
2. Collega il remote e pusha il codice:
   ```bash
   git remote add origin https://github.com/AvengersDevDreamTeam/SeratinaWeb.git
   git branch -M main
   git push -u origin main
   ```
3. Su GitHub, vai in **Settings** → **Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/(root)`
   - Clicca **Save**.
4. In pochi secondi il sito sarà accessibile all'indirizzo:
   - Sotto **Custom domain**, inserisci `seratina.org` e clicca **Save**.
   - Spunta **Enforce HTTPS** non appena il certificato TLS viene rilasciato.
4. Il sito è accessibile ufficialmente all'indirizzo:
   `https://seratina.org/`


