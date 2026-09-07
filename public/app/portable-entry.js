(() => {
  'use strict';
  for (const source of globalThis.SolarYearPortableIcons || []) {
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (parsed.querySelector('parsererror')) throw new Error('Invalid bundled SVG sprite');
    const sprite = document.importNode(parsed.documentElement, true);
    sprite.setAttribute('width', '0'); sprite.setAttribute('height', '0');
    sprite.style.position = 'absolute'; sprite.setAttribute('aria-hidden', 'true');
    document.body.prepend(sprite);
  }
  // Only the bundled essay needs a file:// fetch bridge. Network requests are unchanged.
  const essayUrl = new URL('data/author/essay.ru.json', location.href).href;
  const fetchOriginal = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href).href;
    if (url === essayUrl && globalThis.SolarYearPortableEssay) {
      return Promise.resolve(new Response(JSON.stringify(globalThis.SolarYearPortableEssay), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return fetchOriginal(input, init);
  };
  const routes = new Set(['today', 'calendar', 'time', 'dates', 'more', 'sun', 'moon', 'weather', 'wind', 'places', 'settings', 'search', 'backup', 'about', 'data-sources']);
  function navigate() {
    if (!performance.getEntriesByName('solar-first-render').length) return false;
    const route = location.hash.slice(1);
    if (routes.has(route)) globalThis.SolarCircleAppShell.openRoute(route);
    return true;
  }
  addEventListener('hashchange', navigate);
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('a'); link.href = '../index.html#guide'; link.textContent = 'О проекте и экранах';
    link.style.cssText = 'display:block;text-align:center;padding:10px;font:14px system-ui;color:inherit';
    document.querySelector('.app-shell').prepend(link);
    let attempts = 0;
    const timer = setInterval(() => { if (navigate() || ++attempts > 300) clearInterval(timer); }, 100);
  });
})();
