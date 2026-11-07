(function initNewsletter() {
      const form = document.getElementById('newsletterForm');
      if (!form) return;

      const emailInput = document.getElementById('newsletterEmail');
      const cityInput = document.getElementById('newsletterCityInput');
      const cityHidden = document.getElementById('selectedCityValue');
      const cityDropdown = document.getElementById('cityDropdown');
      const cityStatusBadge = document.getElementById('cityStatusBadge');
      const cityChevron = document.getElementById('cityChevron');

      const gpsBtn = document.getElementById('newsletterGpsBtn');
      const gpsBtnText = document.getElementById('gpsBtnText');
      const gpsActivePill = document.getElementById('gpsActivePill');
      const gpsDescription = document.getElementById('gpsDescription');
      const gpsContainer = document.getElementById('gpsContainer');

      const feedback = document.getElementById('newsletterFeedback');
      const submitBtn = document.getElementById('newsletterSubmitBtn');

      let userCoords = null;
      let cityCoords = { latitude: 45.4642, longitude: 9.1896 }; // Coordinate città (default Milano)
      let validSelectedCity = 'Milano';
      let debounceTimer = null;
      let abortController = null;

      // Filtro rigoroso: solo città, comuni e frazioni italiane (NO regioni, NO nazioni, NO province/confini)
      const CITY_TYPES = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'suburb']);
      const REJECTED_TYPES = new Set(['country', 'state', 'region', 'county', 'continent', 'sea', 'ocean', 'water', 'island']);

      function isOnlyItalianCity(item) {
        const addr = item.address || {};
        const addresstype = (item.addresstype || '').toLowerCase();
        const type = (item.type || '').toLowerCase();

        if (REJECTED_TYPES.has(addresstype) || REJECTED_TYPES.has(type)) {
          return false;
        }

        const cityName = addr.city || addr.town || addr.village || addr.municipality;
        if (!cityName && !CITY_TYPES.has(addresstype) && !CITY_TYPES.has(type)) {
          return false;
        }

        return true;
      }

      function hideDropdown() {
        cityDropdown.classList.add('hidden');
        if (cityChevron) cityChevron.style.transform = 'rotate(0deg)';
      }

      function showLoadingDropdown() {
        cityDropdown.innerHTML = `
          <div class="px-4 py-3 text-xs text-slate-400 flex items-center justify-center gap-2">
            <svg class="w-3.5 h-3.5 animate-spin text-brand-pink" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Ricerca città in corso...</span>
          </div>
        `;
        cityDropdown.classList.remove('hidden');
        if (cityChevron) cityChevron.style.transform = 'rotate(180deg)';
      }

      async function searchOpenStreetMap(query) {
        if (cityInput.disabled) return;

        const cleanQuery = query.trim();
        if (cleanQuery.length < 2) {
          hideDropdown();
          return;
        }

        if (abortController) {
          abortController.abort();
        }
        abortController = new AbortController();

        showLoadingDropdown();

        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=it&limit=10&addressdetails=1&q=${encodeURIComponent(cleanQuery)}`;
          const res = await fetch(url, {
            signal: abortController.signal,
            headers: { 'Accept': 'application/json' }
          });

          if (!res.ok) throw new Error('Errore risposta OpenStreetMap');
          const data = await res.json();

          const cityOnlyResults = (data || []).filter(isOnlyItalianCity);
          renderDropdownResults(cityOnlyResults);
        } catch (err) {
          if (err.name === 'AbortError') return;
          console.warn('[SeratinaWeb] Errore Nominatim OpenStreetMap:', err);
          cityDropdown.innerHTML = `
            <div class="px-4 py-3 text-xs text-rose-400 text-center">
              Impossibile caricare le città al momento. Riprova tra poco.
            </div>
          `;
        }
      }

      function renderDropdownResults(items) {
        if (cityInput.disabled) return;
        cityDropdown.innerHTML = '';

        if (!items || items.length === 0) {
          const noMatch = document.createElement('div');
          noMatch.className = 'px-4 py-3 text-xs text-slate-400 italic text-center';
          noMatch.textContent = 'Nessuna città trovata. Inserisci il nome di un comune o città italiana (es. Milano, Roma, Monza).';
          cityDropdown.appendChild(noMatch);
          cityDropdown.classList.remove('hidden');
          return;
        }

        const header = document.createElement('div');
        header.className = 'px-3.5 py-2 text-[10px] uppercase font-extrabold tracking-wider text-slate-400 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between';
        header.innerHTML = `<span>Città trovate</span><span class="text-[9px] text-brand-pink lowercase">seleziona dall'elenco</span>`;
        cityDropdown.appendChild(header);

        const seen = new Set();

        items.forEach(item => {
          const addr = item.address || {};
          const cityName = addr.city || addr.town || addr.village || addr.municipality || item.name;
          const province = addr.county || addr['ISO3166-2-lvl6'] || '';
          const region = addr.state || '';
          const subInfo = [province, region].filter(Boolean).join(', ');

          const key = `${cityName.toLowerCase()}|${province.toLowerCase()}`;
          if (seen.has(key)) return;
          seen.add(key);

          const opt = document.createElement('button');
          opt.type = 'button';
          opt.className = 'w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-brand-pink/20 hover:text-white flex items-center justify-between transition-colors cursor-pointer group';
          opt.innerHTML = `
            <div class="flex items-center gap-2 truncate">
              <svg class="w-3.5 h-3.5 text-brand-pink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="font-bold text-white group-hover:text-brand-pink transition-colors truncate">${cityName}</span>
              ${subInfo ? `<span class="text-[10px] text-slate-400 font-normal truncate">(${subInfo})</span>` : ''}
            </div>
            <span class="text-[10px] text-emerald-400 font-medium shrink-0 ml-2">Seleziona</span>
          `;

          opt.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectCity(cityName, parseFloat(item.lat), parseFloat(item.lon));
          });

          cityDropdown.appendChild(opt);
        });

        cityDropdown.classList.remove('hidden');
        if (cityChevron) cityChevron.style.transform = 'rotate(180deg)';
      }

      function selectCity(cityName, lat, lon) {
        validSelectedCity = cityName;
        cityInput.value = cityName;
        cityHidden.value = cityName;

        if (!isNaN(lat) && !isNaN(lon)) {
          cityCoords = { latitude: lat, longitude: lon };
        }

        hideDropdown();

        if (cityStatusBadge) {
          cityStatusBadge.textContent = 'Città verificata';
          cityStatusBadge.className = 'text-[10px] text-emerald-400 font-bold';
          cityStatusBadge.classList.remove('hidden');
        }
        cityInput.classList.remove('border-rose-500');
        cityInput.classList.add('border-emerald-500/50');
      }

      // --- Funzioni di Blocco/Sblocco Selezione Città se GPS attivo ---
      function disableCitySelection(detectedCityName) {
        cityInput.disabled = true;
        cityInput.classList.add('opacity-50', 'cursor-not-allowed', 'bg-slate-950/80', 'border-brand-pink/40');
        cityInput.classList.remove('cursor-pointer');
        cityInput.value = detectedCityName ? `Posizione GPS (${detectedCityName})` : 'Posizione GPS rilevata';
        hideDropdown();

        if (cityStatusBadge) {
          cityStatusBadge.textContent = 'Coordinate GPS attive';
          cityStatusBadge.className = 'text-[10px] text-brand-pink font-bold';
          cityStatusBadge.classList.remove('hidden');
        }
        if (cityChevron) cityChevron.classList.add('hidden');
      }

      function enableCitySelection() {
        cityInput.disabled = false;
        cityInput.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-950/80', 'border-brand-pink/40');
        cityInput.classList.add('cursor-pointer');
        cityInput.value = validSelectedCity;
        cityHidden.value = validSelectedCity;

        if (cityStatusBadge) {
          cityStatusBadge.textContent = 'Città verificata';
          cityStatusBadge.className = 'text-[10px] text-emerald-400 font-bold';
          cityStatusBadge.classList.remove('hidden');
        }
        if (cityChevron) cityChevron.classList.remove('hidden');
      }

      cityInput.addEventListener('input', () => {
        if (cityInput.disabled) return;
        if (cityStatusBadge) cityStatusBadge.classList.add('hidden');
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchOpenStreetMap(cityInput.value);
        }, 280);
      });

      cityInput.addEventListener('focus', () => {
        if (cityInput.disabled) return;
        if (cityInput.value.trim().length >= 2) {
          searchOpenStreetMap(cityInput.value);
        }
      });

      cityInput.addEventListener('blur', () => {
        if (cityInput.disabled) return;
        setTimeout(() => {
          hideDropdown();
          if (cityInput.value.trim().toLowerCase() !== validSelectedCity.toLowerCase()) {
            cityInput.value = validSelectedCity;
            cityHidden.value = validSelectedCity;
          }
          if (cityStatusBadge) cityStatusBadge.classList.remove('hidden');
        }, 200);
      });

      // Inizializza città default (Milano)
      selectCity('Milano', 45.4642, 9.1896);

      // --- 2. Gestione Chiara della Posizione Attuale (GPS) ---
      if (gpsBtn && navigator.geolocation) {
        gpsBtn.addEventListener('click', () => {
          // Se era già attivo, rimuove GPS e riabilita la selezione città
          if (userCoords) {
            userCoords = null;
            enableCitySelection();
            gpsActivePill.classList.add('hidden');
            gpsBtnText.textContent = 'Usa posizione attuale';
            gpsBtn.className = 'btn btn--secondary';
            gpsDescription.textContent = 'Attiva la posizione per ordinare gli eventi partendo da quelli a pochi minuti da te.';
            gpsContainer.classList.remove('border-emerald-500/40', 'bg-emerald-950/20');
            return;
          }

          gpsBtnText.textContent = 'Rilevamento in corso...';
          gpsBtn.disabled = true;

          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              userCoords = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              };

              gpsBtn.disabled = false;
              gpsBtnText.textContent = 'Rimuovi GPS';
              gpsBtn.className = 'btn btn--secondary';

              gpsActivePill.classList.remove('hidden');
              gpsDescription.innerHTML = `Coordinate GPS attive (<strong class="text-white">${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}</strong>). Selezione città disattivata: gli eventi ti verranno mostrati direttamente per vicinanza.`;
              gpsContainer.classList.add('border-emerald-500/40', 'bg-emerald-950/20');

              // Tenta di ricavare il comune dalle coordinate per valorizzare cityHidden
              let detectedTown = null;
              try {
                const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                if (revRes.ok) {
                  const revData = await revRes.json();
                  const rAddr = revData.address || {};
                  detectedTown = rAddr.city || rAddr.town || rAddr.village || rAddr.municipality;
                }
              } catch (_) {}

              if (detectedTown) {
                cityHidden.value = detectedTown;
              }

              // Disattiva e blocca la selezione della città
              disableCitySelection(detectedTown);
            },
            (err) => {
              gpsBtn.disabled = false;
              gpsBtnText.textContent = 'Usa posizione attuale';
              console.warn('[SeratinaWeb] Errore GPS:', err);
              let msg = 'Permesso non concesso. Continua selezionando la tua città.';
              if (err.code === 1) msg = 'Permesso di geolocalizzazione negato dal browser.';
              else if (err.code === 2) msg = 'Posizione GPS non disponibile al momento.';
              gpsDescription.textContent = msg;
            },
            { timeout: 10000, enableHighAccuracy: false }
          );
        });
      }

      // --- 3. Invio del Form Newsletter ---
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const city = cityHidden.value || validSelectedCity || 'Milano';

        if (!email) {
          feedback.className = 'p-3.5 rounded-xl text-xs sm:text-sm font-medium text-center bg-rose-500/15 border border-rose-500/30 text-rose-300';
          feedback.textContent = 'Inserisci un indirizzo email valido.';
          feedback.classList.remove('hidden');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Iscrizione in corso...
        `;

        feedback.className = 'p-3.5 rounded-xl text-xs sm:text-sm font-medium text-center bg-slate-800 text-slate-300 border border-slate-700';
        feedback.textContent = 'Registrazione su Seratina...';
        feedback.classList.remove('hidden');

        const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:8080'
          : 'https://seratina-be-265028543407.europe-west8.run.app';

        try {
          const payload = { email, city };
          const coords = userCoords || cityCoords;
          if (coords) {
            payload.latitude = coords.latitude;
            payload.longitude = coords.longitude;
          }

          const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok && data.success) {
            feedback.className = 'p-3.5 rounded-xl text-xs sm:text-sm font-medium text-center bg-emerald-500/15 border border-emerald-500/35 text-emerald-300';
            const locationInfo = userCoords ? 'posizione GPS rilevata' : city;
            feedback.innerHTML = `<strong>Iscrizione completata con successo!</strong> Riceverai la prima selezione giovedì alle 18:00 basata su <strong>${locationInfo}</strong>.`;
            form.reset();
            enableCitySelection();
            selectCity(city, coords ? coords.latitude : 45.4642, coords ? coords.longitude : 9.1896);
          } else {
            throw new Error(data.detail || data.message || "Errore durante l'iscrizione");
          }
        } catch (err) {
          feedback.className = 'p-3.5 rounded-xl text-xs sm:text-sm font-medium text-center bg-rose-500/15 border border-rose-500/30 text-rose-300';
          feedback.textContent = err.message || 'Si è verificato un errore di rete. Riprova più tardi.';
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Iscriviti alla Newsletter</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          `;
        }
      });
    })();
