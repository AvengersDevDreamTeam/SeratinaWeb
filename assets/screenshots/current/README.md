# Schermate della nuova UI

Acquisite il 6 novembre 2026 dalla versione web responsive dell'app locale nel repository `Seratina`, senza modificarne il codice. Browser headless avviato esclusivamente tramite `design-taste-frontend/scripts/shoot.mjs`.

| File | Percorso app | Viewport |
| --- | --- | --- |
| `events-desktop.webp` | `/home` | 1440 × 900 |
| `events-mobile.webp` | `/home` | 390 × 844 |
| `map-desktop.webp` | `/maps` | 1440 × 900 |
| `map-mobile.webp` | `/maps` | 390 × 844 |
| `calendar-mobile.webp` | `/calendar` | 390 × 844 |
| `detail-mobile.webp` | `/event/DfCKvE7iV0I_1_1793232008` | 390 × 844 |

I file WebP conservano il primo viewport della cattura, senza ricostruire l'interfaccia. Dati e date sono quelli visualizzati dall'app al momento della cattura; le immagini non sono un elenco aggiornato degli eventi.

`event-cover.webp` è il ritaglio della locandina nella cattura del dettaglio e viene usato solo come fallback per il popup evento.

`../../videos/seratina-ui.mp4` contiene un montaggio silenzioso di 8 secondi in H.264, a 390 × 844 e circa 238 KiB. Alterna `events-mobile.webp` e `map-mobile.webp` con dissolvenze. I font Outfit 400/500/600 provengono dai file locali dell’app, con licenza OFL in `assets/fonts`.
