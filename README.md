# SeratinaWeb 🌐

Landing page ufficiale e documentazione privacy per l'app mobile **Seratina** (iOS & Android).

## 🚀 Caratteristiche
- **Zero build step, zero dipendenze npm**: Singolo file HTML responsive con Tailwind CSS via CDN.
- **Caricamento istantaneo**: <50ms su Edge CDN globale.
- **Privacy Policy inclusa**: Conforme a GDPR e linee guida Apple App Store / Google Play Console (`privacy.html`).
- **Dark Mode**: Grafica allineata all'app Seratina (`#E86D80`, `#6366F1`, neon dark theme).

---

## 💻 Come visualizzare in locale
Basta fare doppio click su `index.html` per aprirlo nel browser, oppure avviare un server locale leggero:
```bash
# Con Python (se installato)
python -m http.server 8080

# Oppure con npx
npx serve .
```

---

## 🚢 Come pubblicare su GitHub Pages (1 Click)

1. Crea la repository su GitHub: `AvengersDevDreamTeam/SeratinaWeb` (o `seratina-landing`).
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
4. In ~60 secondi il sito sarà live all'indirizzo:
   `https://avengersdevdreamteam.github.io/SeratinaWeb/`

*(Opzionale: se in futuro acquisterete un dominio personalizzato come `seratina.it`, basterà inserirlo nella sezione "Custom domain" nella stessa pagina delle impostazioni di GitHub).*
