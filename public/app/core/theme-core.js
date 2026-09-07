(() => {
  'use strict';

  const THEME_MODES = Object.freeze(['light', 'dark', 'auto-sun']);
  const RESOLVED_THEMES = Object.freeze(['light', 'dark']);

  function normalizeResolvedTheme(value, fallback = 'dark') {
    return RESOLVED_THEMES.includes(value) ? value : fallback;
  }

  function normalizeMode(value, fallback = 'dark') {
    return THEME_MODES.includes(value) ? value : fallback;
  }

  function resolveTheme(input = {}) {
    const mode = normalizeMode(input.mode);
    const previousResolvedTheme = normalizeResolvedTheme(input.previousResolvedTheme);
    const themeSignal = input.themeSignal || null;

    if (mode === 'light' || mode === 'dark') {
      return {
        mode,
        resolvedTheme: mode,
        source: 'manual',
        status: 'ready',
        reason: 'manual',
        themeSignal,
        warnings: []
      };
    }

    if (themeSignal?.status === 'ready' && RESOLVED_THEMES.includes(themeSignal.recommendedTheme)) {
      return {
        mode,
        resolvedTheme: themeSignal.recommendedTheme,
        source: themeSignal.source || 'astronomy',
        status: 'ready',
        reason: themeSignal.reason || themeSignal.daylightStatus || 'auto-sun',
        themeSignal,
        warnings: Array.isArray(themeSignal.warnings) ? [...themeSignal.warnings] : []
      };
    }

    return {
      mode,
      resolvedTheme: previousResolvedTheme,
      source: themeSignal?.source || 'unavailable',
      status: 'degraded',
      reason: themeSignal?.reason || 'theme-signal-unavailable',
      themeSignal,
      warnings: [
        ...(Array.isArray(themeSignal?.warnings) ? themeSignal.warnings : []),
        'auto-sun-kept-previous-theme'
      ]
    };
  }

  const api = Object.freeze({
    THEME_MODES,
    RESOLVED_THEMES,
    normalizeMode,
    normalizeResolvedTheme,
    resolveTheme
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleThemeCore = api;
})();
