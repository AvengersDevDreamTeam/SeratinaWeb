# Revisione della UI promozionale — 6 novembre 2026

## Risultato

Aggiornata la home di `SeratinaWeb` con schermate reali della nuova versione web responsive dell'app `Seratina`. Font Outfit locali, palette ink/bone/magenta/mint e simbolo del brand nelle varianti chiara e scura. App, backend e composizioni video preesistenti non modificati. Le verifiche descritte sono state svolte in locale, prima della preparazione dei commit su un branch separato da `main`.

Le vecchie ricostruzioni HTML del feed e dell'evento sono sostituite da catture dell'app: Eventi e Mappa, con sorgenti diverse per desktop e telefono, più Dettaglio e Calendario. Le due schede della galleria si cambiano con clic, frecce, Home ed End. I preferiti simulati della precedente anteprima sono rimossi.

## Video della home

Il precedente pulsante controllava un effetto shader, non un video. Ora il riquadro contiene `assets/videos/seratina-ui.mp4`: H.264 senza audio, 1280×800, 8 secondi, circa 440 KiB. È un montaggio con dissolvenze delle schermate attuali Eventi e Mappa, non una registrazione di interazioni.

Play/pausa e relativa etichetta seguono gli eventi del video. Contatore e avanzamento seguono il tempo del media. La riproduzione si ferma fuori schermo o quando la scheda del browser non è visibile; una pausa manuale viene conservata. Con movimento ridotto si presenta il poster e si attende il clic. Se JavaScript non parte rimangono i controlli nativi; un errore del media lascia disponibili poster e schermate sottostanti.

## Materiali

- Catture e provenienza: `assets/screenshots/current/README.md`.
- Outfit 400/500/600 e licenza OFL: `assets/fonts/`.
- SVG del brand già presenti: `assets/brand/`.
- Attribuzione OpenStreetMap nel footer per le schermate della mappa.
- Gli originali precedenti sono conservati. Nessuna immagine sostitutiva generata e nessun nuovo dato di evento inventato.

## Verifica

Browser headless avviati solo con gli script della skill `design-taste-frontend`, uno alla volta.

- `layout/check.mjs`: nessun problema a 1440×900, 1024×768, 820×1180, 768×1024 e 390×844, compreso lo stress del titolo. Screenshot ispezionati alle cinque dimensioni.
- Prove funzionali iniziali alle cinque larghezze: play, pausa, pausa fuori schermo, ripresa tornando in vista, mantenimento della pausa manuale, galleria con clic e tastiera, tema, nessun overflow o immagine mancante. Il controllo conclusivo a 1440 e 390 include contatore del video e simbolo adatto al tema.
- Tema chiaro ispezionato a 1440; movimento ridotto a 390: poster fermo, contatore 0:00, pulsante Riproduci anteprima.
- `perf.mjs`, una misura per dimensione: **0 FAIL, 2 WARN**. Trasferimento circa **963 KiB desktop / 842 KiB telefono**; CLS **0,005 / 0,001**; zero richieste fallite e zero contesti WebGL. I due avvisi classificano il logo della navigazione fissa come immagine sotto la piega dopo lo scorrimento.
- Sintassi JavaScript e controllo delle differenze senza errori; nessun ID duplicato o riferimento locale mancante.
- Iscrizioni, login e invii al backend non eseguiti. Newsletter, GPS e collegamenti esistenti conservati. I problemi originari in `ANALISI.md` restano nel lavoro successivo richiesto dall'utente.

## Segnalazioni del checker generale

La verifica rapida sulle cinque larghezze precede la rifinitura dei controlli del player: 9 FAIL euristici e 28 WARN. Il controllo conclusivo su desktop e telefono conserva 5 FAIL euristici e 16 WARN; non è un esito interamente verde. Le segnalazioni FAIL sono motivate così:

| Regola | Occorrenze finali | Valutazione |
| --- | --- | --- |
| `copy-headings` | 1 | Il lessico del checker non riconosce i sostantivi italiani nei titoli di dettagli, orari e calendario. |
| `off-grid` | 2 | I collegamenti iOS/Android nel footer sono rientrati dopo i rispettivi loghi; i contenitori seguono i margini della pagina. |
| `section-gaps` | 1 | La hero mantiene esattamente uno schermo, con il player centrato nella colonna; lo spazio fino al titolo della sezione seguente supera la mediana delle altre sezioni. |
| `text-only` | 1 | La sezione newsletter contiene un modulo operativo, conservato senza aggiungere un'immagine decorativa. |

Fra gli avvisi: etichette italiane, controlli della navigazione, spaziature intenzionali e contatore del player riconosciuto come didascalia. Il contatore è un controllo temporale del video; non è una descrizione dell'immagine. Gli esiti e i ritagli sono in `.taste-skill/current-final-review`, il controllo di layout in `.taste-skill/current-layout` e la misura di prestazioni in `.taste-skill/current-perf.json`.
