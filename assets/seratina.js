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
