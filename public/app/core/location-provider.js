(() => {
  'use strict';
  const TimeCore = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;
  const lookup = typeof require === 'function' ? require('@photostructure/tz-lookup') : globalThis.tzlookup;

  function timezoneAt(latitude, longitude) {
    const timezone = lookup(latitude, longitude);
    if (!TimeCore.validTimezone(timezone)) throw new RangeError('Unsupported time zone; choose one manually.');
    return timezone;
  }

  async function currentPosition() {
    const native = globalThis.Capacitor?.Plugins?.Geolocation;
    const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 };
    let position;
    if (native) {
      let permission = await native.checkPermissions();
      if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
        permission = await native.requestPermissions({ permissions: ['location'] });
      }
      if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') throw new Error('permission-denied');
      position = await native.getCurrentPosition(options);
    } else {
      if (!globalThis.navigator?.geolocation) throw new Error('location-unavailable');
      position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
    }
    const { latitude, longitude, accuracy } = position.coords;
    return { latitude, longitude, accuracy, timezone: timezoneAt(latitude, longitude) };
  }

  async function searchCities(query, language = 'ru', fetcher = globalThis.fetch) {
    const name = String(query).trim();
    if (name.length < 2) return [];
    const params = new URLSearchParams({ name, count: '8', language, format: 'json' });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetcher(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Geocoding HTTP ${response.status}`);
      const payload = await response.json();
      return (Array.isArray(payload.results) ? payload.results : []).filter(city =>
        Number.isFinite(city.latitude) && Math.abs(city.latitude) <= 90 &&
        Number.isFinite(city.longitude) && Math.abs(city.longitude) <= 180 && TimeCore.validTimezone(city.timezone)
      ).map(city => ({ title: city.name, region: [city.admin1, city.country].filter(Boolean).join(', '), latitude: city.latitude, longitude: city.longitude, timezone: city.timezone }));
    } finally { clearTimeout(timer); }
  }

  const api = Object.freeze({ timezoneAt, currentPosition, searchCities });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleLocationProvider = api;
})();
