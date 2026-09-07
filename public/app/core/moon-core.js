(() => {
  'use strict';

  const AstronomyAdapter = typeof require === 'function'
    ? require('./astronomy-adapter.js')
    : globalThis.SolarCircleAstronomyAdapter;
  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;

  if (!AstronomyAdapter) throw new Error('SolarCircleAstronomyAdapter is required before MoonCore.');

  const PHASES = [
    { name: 'new', start: 337.5, end: 22.5 },
    { name: 'waxing-crescent', start: 22.5, end: 67.5 },
    { name: 'first-quarter', start: 67.5, end: 112.5 },
    { name: 'waxing-gibbous', start: 112.5, end: 157.5 },
    { name: 'full', start: 157.5, end: 202.5 },
    { name: 'waning-gibbous', start: 202.5, end: 247.5 },
    { name: 'third-quarter', start: 247.5, end: 292.5 },
    { name: 'waning-crescent', start: 292.5, end: 337.5 }
  ];

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('MoonData date must be a valid Date.');
    return value;
  }

  function phaseName(phaseAngle) {
    if (!Number.isFinite(phaseAngle)) return null;
    const angle = AstronomyAdapter.normalizeDegree(phaseAngle);
    const wrapped = PHASES.find(phase => phase.start > phase.end && (angle >= phase.start || angle < phase.end));
    if (wrapped) return wrapped.name;
    return PHASES.find(phase => angle >= phase.start && angle < phase.end)?.name || null;
  }

  function firstKnownSource(...parts) {
    return parts.find(part => part.source !== 'unavailable')?.source || 'unavailable';
  }

  function latestCalculatedAt(...parts) {
    const timestamps = parts
      .map(part => part?.calculatedAt)
      .filter(date => date instanceof Date && Number.isFinite(date.getTime()))
      .map(date => date.getTime());
    return new Date(Math.max(...timestamps));
  }

  function moonData(date = new Date(), location = null) {
    const moment = validDate(date);
    const phase = AstronomyAdapter.getMoonPhase(moment);
    const illumination = AstronomyAdapter.getMoonIllumination(moment);
    const ecliptic = AstronomyAdapter.getMoonEcliptic(moment);
    const phaseAngle = phase.phaseAngle ?? illumination.phaseAngle;
    const normalizedLocation = location ? LocationCore?.normalizeLocation(location) || location : null;
    const riseSet = AstronomyAdapter.getRiseSet(moment, normalizedLocation, 'Moon');
    const horizontal = AstronomyAdapter.getHorizontalPosition(moment, normalizedLocation, 'Moon');

    return {
      body: 'moon',
      date: new Date(moment.getTime()),
      phaseAngle,
      phaseName: phaseName(phaseAngle),
      illumination: illumination.fraction,
      magnitude: illumination.magnitude,
      ecliptic: {
        longitude: ecliptic.longitude,
        latitude: ecliptic.latitude,
        distanceAu: ecliptic.distanceAu
      },
      location: normalizedLocation,
      rise: riseSet.rise,
      transit: riseSet.transit,
      set: riseSet.set,
      horizontal,
      calculatedAt: latestCalculatedAt(phase, illumination, ecliptic, riseSet, horizontal),
      source: firstKnownSource(phase, illumination, ecliptic, riseSet, horizontal),
      riseSetSource: riseSet.source
    };
  }

  const api = Object.freeze({
    PHASES,
    phaseName,
    moonData
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleMoonCore = api;
})();
