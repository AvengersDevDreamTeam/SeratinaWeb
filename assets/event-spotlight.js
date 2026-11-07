(function initEventSpotlight() {
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get('event');
      if (!eventId) return;

      // Deep link verso l'app Seratina (tentativo automatico immediato all'atterraggio se installata)
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isMobileDevice = isAndroid || isIOS;
      const appUrl = isAndroid
        ? `intent://event/${encodeURIComponent(eventId)}#Intent;scheme=seratina;package=com.seratinaclub.seratina;end;`
        : `seratina://event/${encodeURIComponent(eventId)}`;

      function openNativeApp() {
        try {
          window.location.href = appUrl;
        } catch (_) {}
      }

      // Se atterra da dispositivo mobile, tenta subito di aprire l'app nativa senza attendere il fetch API
      if (isMobileDevice) {
        setTimeout(openNativeApp, 100);
      }

      const modal = document.getElementById('eventSpotlightModal');
      const backdrop = document.getElementById('modalBackdrop');
      const loading = document.getElementById('spotlightLoading');
      const content = document.getElementById('spotlightContent');
      const errorBox = document.getElementById('spotlightError');
      const closeBtn = document.getElementById('closeSpotlightBtn');
      const openAppBtn = document.getElementById('openAppBtn');
      const downloadBtn = document.getElementById('modalDownloadBtn');
      const errorDownloadBtn = document.getElementById('modalErrorDownloadBtn');

      if (!modal) return;

      function openModal() {
        modal.classList.remove('hidden');
        document.documentElement.classList.add('overflow-hidden');
        document.body.classList.add('overflow-hidden');
      }

      function closeModal() {
        modal.classList.add('hidden');
        document.documentElement.classList.remove('overflow-hidden');
        document.body.classList.remove('overflow-hidden');
      }

      closeBtn.addEventListener('click', closeModal);
      backdrop.addEventListener('click', closeModal);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          closeModal();
        });
      }
      if (errorDownloadBtn) {
        errorDownloadBtn.addEventListener('click', () => {
          closeModal();
        });
      }

      openModal();

      const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8080'
        : 'https://seratina-be-265028543407.europe-west8.run.app';

      fetch(`${API_BASE}/events/${encodeURIComponent(eventId)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Event not found');
          return res.json();
        })
        .then((data) => {
          const event = data.data || data.event || data;
          if (!event || !event.title) throw new Error('Dati evento non validi o mancanti');

          // Update text and fields
          document.getElementById('spotlightTitle').textContent = event.title;
          document.getElementById('spotlightVenue').textContent = event.venue || 'Locale Seratina';
          document.getElementById('spotlightAddress').textContent = event.address || (event.city || 'Milano');
          document.getElementById('spotlightDescription').textContent = event.description || '';

          // Date formatting (it-IT)
          try {
            const d = new Date(event.date);
            const formatted = !isNaN(d.getTime())
              ? d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })
              : event.date;
            document.getElementById('spotlightDate').textContent = formatted;
          } catch {
            document.getElementById('spotlightDate').textContent = event.date;
          }

          if (event.startTime) {
            document.getElementById('spotlightTime').textContent = `• ore ${event.startTime}`;
          }

          // Category
          if (event.category) {
            document.getElementById('spotlightCategoryBadge').textContent = event.category;
          }

          // Price badge
          const priceBadge = document.getElementById('spotlightPriceBadge');
          if (event.price === 0) {
            priceBadge.textContent = 'Ingresso Libero';
            priceBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400';
          } else if (event.price && event.price > 0) {
            priceBadge.textContent = `€${event.price}`;
          } else if (event.priceDetails && event.priceDetails.length > 0) {
            priceBadge.textContent = `Da €${event.priceDetails[0].price}`;
          } else {
            priceBadge.textContent = 'Ingresso Serata';
          }

          // Poster Image
          const img = document.getElementById('spotlightImage');
          const posterUrl = event.imageUrl || 'assets/screenshots/current/event-cover.webp';
          img.src = posterUrl;
          const blurImg = document.getElementById('spotlightImageBlur');
          if (blurImg) blurImg.src = posterUrl;

          // Update page title and meta
          document.title = `${event.title} presso ${event.venue} • Seratina`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', `${event.title} - ${event.venue}, ${event.address}. Scopri tutti i dettagli su Seratina.`);

          // Pulsante manuale per aprire nell'app nativa
          openAppBtn.addEventListener('click', openNativeApp);

          loading.classList.add('hidden');
          content.classList.remove('hidden');
        })
        .catch((err) => {
          console.error('[SeratinaWeb] Errore caricamento evento:', err);
          loading.classList.add('hidden');
          errorBox.classList.remove('hidden');
        });
    })();
