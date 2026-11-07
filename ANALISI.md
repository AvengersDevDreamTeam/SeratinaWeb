# Analisi di SeratinaWeb

Data: 6 novembre 2026. Repository: https://github.com/AvengersDevDreamTeam/SeratinaWeb. Branch: `main`. Commit analizzato: `680072cfe38a247ace21ca0f4bfbdb59a4db604e`.

## Valutazione

SeratinaWeb è il portale pubblico dell'app mobile Seratina: presenta il prodotto, accompagna i beta tester, raccoglie iscrizioni alla newsletter e richieste dei gestori, mostra gli eventi condivisi e ospita le pagine informative.

La struttura statica è proporzionata a queste funzioni e semplice da pubblicare. L'identità visiva è coerente: tema scuro, accenti rosa e viola, schermate dell'app e inviti alla beta in evidenza. I problemi principali riguardano l'inserimento di dati esterni nell'HTML, il servizio di ricerca città e alcuni stati del modulo newsletter.

## Struttura e collegamenti

Sono presenti 20 file versionati, di cui sette pagine HTML. Non sono presenti `package.json`, compilazione applicativa, dipendenze npm, test automatici o workflow CI versionati. CSS e JavaScript sono incorporati nelle pagine; home e pagina tester caricano il runtime Tailwind da CDN e font da Google Fonts. Le altre pagine usano CSS incorporato.

| File | Funzione | Integrazione osservata nel codice |
| --- | --- | --- |
| `index.html` | Presentazione, newsletter, anteprima eventi | `GET /events/{id}`, `POST /newsletter/subscribe`, geocoding e reverse geocoding Nominatim |
| `test.html` | Istruzioni beta iOS e Android | TestFlight, Google Groups, Google Play; scelta piattaforma da hash o user agent |
| `gestori.html` | Richieste dei gestori | `POST /gestori/richiesta`; precompilazione da `?club=` o `?locale=` |
| `unsubscribe.html` | Disiscrizione all'apertura del link | `POST /newsletter/unsubscribe` con token nell'URL |
| `delete-account.html` | Procedura di cancellazione account | Istruzioni per l'app e richiesta tramite `mailto:` |
| `privacy.html` | Informativa | Contenuto statico |
| `terms.html` | Condizioni d'uso | Contenuto statico |

`CNAME` indica `seratina.org`; la documentazione descrive GitHub Pages. Configurazione effettiva dell'hosting, DNS e HTTPS non verificati. `robots.txt`, sitemap e metadati sono presenti. Il backend di produzione configurato nel client è un servizio esterno su Cloud Run; questo repository non ne contiene l'implementazione.

## Problemi prioritari

### 1. P1 — Dati esterni interpretati come HTML

**Riferimenti:** `index.html:1083`, `index.html:1296`.

Il nome della città e i dettagli geografici restituiti dal servizio esterno sono interpolati in `innerHTML`. Anche il messaggio di iscrizione inserisce la città come HTML. Con una risposta di geocoding simulata contenente un elemento con gestore `onerror`, il browser ha eseguito il codice del gestore.

Questo conferma un percorso di DOM XSS se un valore malevolo raggiunge la risposta del geocoder. Non è stata dimostrata un'alterazione dei dati reali di Nominatim o uno sfruttamento in produzione.

**Intervento:** costruire gli elementi decorativi separatamente e assegnare i valori esterni con `textContent`; applicare lo stesso criterio al messaggio di conferma.

### 2. P1 — Autocompletamento incompatibile con la policy del servizio pubblico Nominatim

**Riferimenti:** `index.html:1027`, `index.html:1155`.

La ricerca parte mentre l'utente digita, con attesa di 280 ms; anche il focus del campo avvia una ricerca. La [policy ufficiale Nominatim](https://operations.osmfoundation.org/policies/nominatim/) vieta l'autocompletamento sul servizio pubblico e stabilisce un massimo aggregato di una richiesta al secondo per applicazione. Il semplice debounce non risolve questi vincoli.

**Intervento:** scegliere un servizio che supporti esplicitamente l'autocompletamento oppure usare un catalogo locale di comuni e coordinate. Se si mantiene il servizio pubblico per ricerche esplicite, rispettarne policy, attribuzione e limiti aggregati.

### 3. P2 — Avvio locale e backend condividono la porta 8080

**Riferimenti:** `README.md:48`, `index.html:864`, `index.html:1274`, `gestori.html:295`, `unsubscribe.html:168`.

Il comando documentato serve i file statici sulla porta 8080. Su `localhost` e `127.0.0.1`, il codice invia anche le API a `http://localhost:8080`. Il server Python non implementa quelle API: verificati `404` sul caricamento evento e `501` sul POST newsletter. Il browser mostra l'errore evento e un errore di invio newsletter.

**Intervento:** documentare e avviare SeratinaBE separatamente sulla porta prevista, servendo il sito su un'altra porta e configurando CORS; centralizzare la configurazione dell'URL API, oggi ripetuta quattro volte.

### 4. P2 — La newsletter invia email malformate

**Riferimenti:** `index.html:505`, `index.html:1252`.

Il form usa `novalidate`; il controllo JavaScript verifica soltanto che l'email non sia vuota. È stato osservato l'invio di `not-an-email` all'endpoint simulato. La validazione effettiva del backend non è disponibile in questo repository e non è stata verificata.

**Intervento:** ripristinare la validazione HTML o usare `checkValidity()`/`reportValidity()` prima dell'invio. Mantenere comunque la validazione sul backend.

### 5. P2 — Scelta città da tastiera non operativa

**Riferimento:** `index.html:1092`.

La selezione è collegata soltanto a `mousedown`. Portando il focus sul suggerimento Roma e premendo Invio, la città selezionata resta Milano. Il clic con il mouse seleziona correttamente Roma e le sue coordinate.

**Intervento:** gestire l'attivazione con `click` e implementare il comportamento da tastiera dell'autocompletamento, evitando che la perdita di focus ripristini prematuramente il valore precedente.

### 6. P2 — Una risposta GPS tardiva annulla la disattivazione dell'utente

**Riferimenti:** `index.html:1188`, `index.html:1211`, `index.html:1235`.

Il pulsante torna disponibile prima che termini il reverse geocoding. Se l'utente rimuove il GPS durante l'attesa, la risposta ancora in corso blocca di nuovo il campo città. Riprodotto ritardando la risposta simulata: pulsante «Usa posizione attuale», campo città disabilitato.

**Intervento:** annullare la richiesta o ignorarne la risposta se l'utente ha disattivato il GPS; mantenere coerenti coordinate, città e stato dei controlli anche dopo l'iscrizione.

### 7. P2 — Focus della finestra evento non gestito

**Riferimenti:** `index.html:681`, `index.html:831`.

La finestra ha `role="dialog"`, etichetta e chiusura con Escape, ma all'apertura non riceve il focus e il codice non lo trattiene all'interno. Nel controllo eseguito il focus rimaneva fuori dalla finestra.

**Intervento:** spostare il focus all'apertura, mantenerlo nella finestra e ripristinarlo alla chiusura; rendere inerte il contenuto sottostante.

### 8. P2 — Tailwind compilato nel browser

**Riferimenti:** `index.html:24`, `test.html:14`.

Il repository descrive CSS «compilato», ma carica lo script Play CDN, che genera gli stili nel browser. La [documentazione ufficiale Tailwind](https://tailwindcss.com/docs/installation/play-cdn) destina questa modalità allo sviluppo.

**Intervento:** generare un file CSS statico da pubblicare insieme agli HTML. Si può conservare l'hosting statico e una struttura semplice.

## Altre osservazioni

- **Manutenzione:** la home supera 1.300 righe e contiene configurazione, markup, animazioni e due flussi applicativi. Conviene separare almeno CSS, configurazione API e moduli JavaScript; non serve introdurre un framework per queste correzioni.
- **Metadati eventi:** il caricamento evento aggiorna `document.title` e la descrizione standard; `og:title`, `og:image`, `og:url` e canonical restano quelli della home. L'HTML iniziale non contiene metadati specifici dell'evento. Valutare anteprime generate sul server per i link condivisi.
- **Immagini:** gli asset locali occupano circa 1 MB. Le dieci immagini della home non dichiarano `loading="lazy"`; applicarlo a quelle fuori dalla prima schermata e valutare formati più compatti per le schermate dell'app.
- **Documentazione:** la pagina cancellazione usa un link email, senza form o chiamata `DELETE /users/me` dal sito. Nei file versionati non sono presenti il QR code descritto nel flusso desktop né un file `LICENSE`, pur essendo dichiarata la licenza MIT nel README.
- **Prestazioni:** le affermazioni di TTFB inferiore a 50 ms e disponibilità al 100% sono dichiarazioni documentali, non risultati di questa analisi.
- **Perimetro privacy:** i testi sono presenti, ma non è stata svolta una valutazione legale. Il codice invia coordinate GPS al servizio di reverse geocoding; precisione, destinatari e descrizione dei flussi andrebbero confrontati con l'informativa.

## Verifiche eseguite

- Sintassi di tutti e sette gli script incorporati: valida.
- Apertura delle sette pagine in Chrome: nessuna eccezione JavaScript osservata durante il caricamento.
- Home a 1440×1000 e 390×844: nessuno scorrimento orizzontale rilevato nel viewport; immagini locali della home caricate.
- Collegamenti locali e asset: nessun file mancante rilevato. Gli hash `#ios` e `#android` sono usati intenzionalmente dal JavaScript per scegliere la piattaforma.
- Con risposte simulate: caricamento evento e chiusura con Escape, iscrizione con città selezionata tramite mouse, precompilazione e invio gestori, disiscrizione con token, selettore beta iOS/Android.
- Riproduzioni isolate: email malformata inviata, mancata selezione da tastiera, risposta GPS tardiva, esecuzione HTML proveniente da una città simulata, focus esterno alla finestra evento.
- Server statico locale: confermati `404` per l'API evento e `501` per il POST newsletter con l'avvio documentato.

Le prove dinamiche hanno usato dati e risposte simulati. Non sono state inviate iscrizioni, richieste gestori o disiscrizioni al backend di produzione. Non sono stati verificati database, autenticazione, CORS di produzione, consegna email o apertura dell'app su dispositivi reali. Nessun sorgente versionato è stato modificato.

## Ordine di intervento suggerito

1. Rimuovere l'interpretazione HTML dei dati esterni e sostituire l'autocompletamento Nominatim pubblico.
2. Correggere validazione email, selezione da tastiera e gestione dello stato GPS.
3. Sistemare avvio locale e configurazione API condivisa.
4. Pubblicare CSS statico, gestire il focus della finestra evento e migliorare i metadati dei link condivisi.
5. Allineare documentazione e codice; introdurre pochi controlli automatici sui flussi principali.
