(() => {
  'use strict';

  const TimeCore = typeof require === 'function'
    ? require('./time-core.js')
    : globalThis.SolarCircleTimeCore;

  if (!TimeCore) throw new Error('SolarCircleTimeCore is required before LocationCore.');

  function normalizeLocation(input = {}) {
    const latitude = Number.isFinite(input.latitude) ? input.latitude : null;
    const longitude = Number.isFinite(input.longitude) ? input.longitude : null;
    const now = input.date instanceof Date ? input.date : new Date();
    const timezone = input.timezone || TimeCore.timezoneName('UTC');
    if (!TimeCore.validTimezone(timezone)) throw new RangeError('Invalid IANA time zone.');

    return {
      latitude,
      longitude,
      altitude: Number.isFinite(input.altitude) ? input.altitude : null,
      timezone,
      utcOffset: TimeCore.utcOffsetMinutes(now, timezone),
      dst: TimeCore.isDst(now, timezone),
      source: input.source || 'device'
    };
  }

  function current(date = new Date()) {
    return normalizeLocation({ date, source: 'device' });
  }

  function manual(latitude, longitude, timezone = TimeCore.timezoneName('UTC'), date = new Date()) {
    return normalizeLocation({ latitude, longitude, timezone, date, source: 'manual' });
  }

  function cached(location, date = new Date()) {
    return normalizeLocation({ ...location, date, source: 'cached' });
  }

  const api = Object.freeze({
    normalizeLocation,
    current,
    manual,
    cached
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleLocationCore = api;
})();
