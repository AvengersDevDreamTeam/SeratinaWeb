# Architettura del Portale Web — SeratinaWeb 🌐

Questo documento descrive l'architettura tecnica del portale web statico ad alte prestazioni **SeratinaWeb** ospitato su **GitHub Pages Edge CDN** (`https://seratina.org`).

Per l'architettura complessiva dell'ecosistema, consultare:
👉 **[Guida all'Ecosistema Seratina](../../SeratinaBE/docs/ecosystem.md)**

---

## 1. Principi Architetturali

1. **Zero Build Step, Zero Dipendenze npm**: Nessun bundler (Webpack/Vite), nessun `package.json`, nessun runtime Node.js. Le pagine HTML5 usano CSS/JS modulari statici in `assets/` (con fallback CSS/JS per apertura locale via `file://`), font Google **Outfit** e **DM Mono**, e immagini `.webp` multi-risoluzione (`320w`/`560w`/`760w`).
2. **Latenza Ultra-Bassa (<50ms TTFB)**: Servito direttamente dalla rete Edge CDN globale di GitHub Pages con certificato TLS/HTTPS automatico.
3. **Massima Affidabilità**: Anche in caso di riavvio o manutenzione dei container di backend, le pagine legali, informative e di opt-out rimangono sempre accessibili al 100%.

---

## 2. Pagine e Moduli Inclusi

| File | Scopo | Integrazione Backend (`SeratinaBE`) |
|---|---|---|
| **`index.html`** | Landing page: Hero triptych (`Prova la Beta` -> `test.html`), 4 schermate app (`#anteprima`), fascia conclusiva newsletter + footer (`#newsletter`) ed Event Spotlight Modal (`?event=ID`). | `GET /events/{id}` (Spotlight Modal), `POST /newsletter/subscribe` |
| **`privacy.html`** | Informativa estesa sul trattamento dei dati personali a norma GDPR (Art. 6.1.f, 17, 21), Apple App Store (5.1.1) e Google Play Data Safety. | Informativa statica |
| **`terms.html`** | Termini di servizio e condizioni d'uso della piattaforma, clausola di non responsabilità sui dati aggregati. | Informativa statica |
| **`delete-account.html`** | Pagina obbligatoria per le policy di Google Play e Apple per la richiesta di cancellazione dell'account da web per utenti privi dell'app installata. | `DELETE /users/me` (oppure invio modulo assistito) |
| **`gestori.html`** | Area dedicata ai titolari e gestori dei locali per la verifica o correzione dei dati, rivendicazione della scheda o esercizio del diritto di opposizione (Opt-Out GDPR Art. 21). | `POST /gestori/richiesta` (con audit log su Supabase e notifica Telegram) |
| **`unsubscribe.html`** | Pagina di disiscrizione 1-click dalla newsletter settimanale per utenti che cliccano sul link in calce alle email di Brevo (`?token=...`). | `POST /newsletter/unsubscribe` |
| **`test.html`** | Pagina di onboarding per i beta tester: 2 passaggi per Apple TestFlight e 3 passaggi per Google Play Closed Beta con selettore automatico di piattaforma. | Link esterni e deep link store (nessun endpoint backend) |

---

## 3. Modulo Newsletter con Geocoding Dinamico (`index.html`)

La macrosezione newsletter inclusa nella home page consente agli utenti di iscriversi direttamente da browser:
- **Rilevamento GPS Automatico**: interroga l'API HTML5 `navigator.geolocation` per rilevare latitudine e longitudine correnti dell'utente.
- **Autocompletamento Città (OpenStreetMap Nominatim)**:
  - Input di testo con debounce (300ms) collegato alle API pubbliche di geocoding OpenStreetMap Nominatim limitato all'Italia (`countrycodes=it`).
  - Mostra dropdown interattivo con selezione immediata della città e coordinate associate.
- **Sottomissione Asincrona**: invia una chiamata AJAX fetch a `POST /newsletter/subscribe` su `SeratinaBE`.

---

## 4. Hosting su GitHub Pages & Custom Domain

Il sito è configurato con dominio personalizzato tramite il file `CNAME`:
- **Record DNS**:
  - `A` record verso gli IP di GitHub Pages:
    - `185.199.108.153`
    - `185.199.109.153`
    - `185.199.110.153`
    - `185.199.111.153`
  - `CNAME` per `www.seratina.org` -> `seratina.org`.
- **Enforce HTTPS**: TLS gestito automaticamente da GitHub con rinnovo trasparente dei certificati Let's Encrypt.
