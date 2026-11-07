// Manual navigation through real captures of the current app.
(() => {
  const tabs = [...document.querySelectorAll('[data-view]')];
  const panels = [...document.querySelectorAll('.product-screen')];
  function setView(view) {
    tabs.forEach(tab => {
      const selected = tab.dataset.view === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== `preview-${view}`; });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setView(tab.dataset.view));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setView(tabs[next].dataset.view);
      tabs[next].focus();
    });
  });
})();

// The control reflects HTMLMediaElement events, including a rejected autoplay.
(() => {
  const video = document.getElementById('app-video');
  const button = document.getElementById('video-toggle');
  if (!video || !button) return;
  const progress = document.getElementById('video-progress');
  const time = document.getElementById('video-time');
  const status = document.getElementById('video-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = false;
  let manualPlay = false;
  let request = 0;
  const canRun = () => inView && !document.hidden && !userPaused && (!reduced.matches || manualPlay);
  function sync() {
    const playing = !video.paused && !video.ended;
    button.dataset.playing = String(playing);
    const label = playing ? 'Metti in pausa' : 'Riproduci anteprima';
    button.querySelector('span').textContent = label;
    button.setAttribute('aria-label', label);
  }
  async function play() {
    const current = ++request;
    try {
      await video.play();
      if (current !== request || !canRun()) video.pause();
    } catch (error) {
      // Autoplay may require a click. The poster and play button remain usable.
      if (error.name !== 'AbortError') sync();
    }
  }
  function reconcile() {
    if (canRun()) void play();
    else { request++; video.pause(); }
  }
  button.hidden = false;
  video.controls = false;
  button.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      manualPlay = true;
      void play();
    } else {
      userPaused = true;
      request++;
      video.pause();
    }
  });
  ['playing', 'pause', 'ended', 'emptied'].forEach(name => video.addEventListener(name, sync));
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  function updateTime() {
    progress.value = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
    time.textContent = `${formatTime(video.currentTime)} / ${formatTime(Number.isFinite(video.duration) ? video.duration : 8)}`;
  }
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('error', () => {
    button.hidden = true;
    video.controls = true;
    status.classList.remove('sr-only');
    status.textContent = 'Video non disponibile. Le schermate dell’app sono nella sezione successiva.';
  });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    reconcile();
  }, { threshold: 0.1 }).observe(video);
  document.addEventListener('visibilitychange', reconcile);
  reduced.addEventListener('change', () => { manualPlay = false; reconcile(); });
  sync();
})();

(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const system = window.matchMedia("(prefers-color-scheme: light)");
  let choice;
  try {
    choice =
      new URLSearchParams(location.search).get("theme") ||
      localStorage.getItem("seratina-appearance");
  } catch (_) {}
  const valid = (value) => value === "light" || value === "dark";
  const current = () =>
    root.dataset.theme || (system.matches ? "light" : "dark");
  const label = () => {
    const mode = current();
    root.dataset.tone = mode;
    const symbol = document.querySelector('[data-brand-symbol]');
    const symbolPath = `assets/brand/seratina-simbolo${mode === 'light' ? '-chiaro' : ''}.svg`;
    if (symbol && symbol.getAttribute('src') !== symbolPath) symbol.src = symbolPath;
    if (toggle)
      toggle.textContent = `Attiva tema ${mode === "light" ? "scuro" : "chiaro"}`;
    document.querySelector('meta[name="theme-color"]').content =
      mode === "light" ? "#F2EFE9" : "#0F0F14";
  };
  if (valid(choice)) root.dataset.theme = choice;
  label();
  toggle?.addEventListener("click", () => {
    const next = current() === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("seratina-appearance", next);
    } catch (_) {}
    label();
  });
  system.addEventListener("change", () => {
    if (!root.dataset.theme) label();
  });
})();
