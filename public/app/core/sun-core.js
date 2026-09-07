(() => {
  'use strict';

  const CalendarCore = typeof require === 'function'
    ? require('./calendar-core.js')
    : globalThis.SolarCircleCalendarCore;
  const AstronomyAdapter = typeof require === 'function'
    ? require('./astronomy-adapter.js')
    : globalThis.SolarCircleAstronomyAdapter;
  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;

  if (!CalendarCore) throw new Error('SolarCircleCalendarCore is required before SunCore.');
  if (!AstronomyAdapter) throw new Error('SolarCircleAstronomyAdapter is required before SunCore.');

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('SunData date must be a valid Date.');
    return value;
  }

  function solarYearLabel(date) {
    const year = date.getUTCFullYear();
    const equinox = AstronomyAdapter.marchEquinox(year);
    if (equinox) return date >= equinox ? year : year - 1;
    return date.getUTCMonth() >= 2 ? year : year - 1;
  }

  function latestCalculatedAt(...parts) {
    const timestamps = parts
      .map(part => part?.calculatedAt)
      .filter(date => date instanceof Date && Number.isFinite(date.getTime()))
      .map(date => date.getTime());
    return new Date(Math.max(...timestamps));
  }

  function eventTime(event) {
    return event?.time instanceof Date && Number.isFinite(event.time.getTime()) ? event.time : null;
  }

  function daylightProgress(moment, start, end) {
    if (!start || !end || end <= start) return null;
    return Math.max(0, Math.min(1, (moment - start) / (end - start)));
  }

  function twilightPhase(moment, twilight) {
    const astronomicalDawn = eventTime(twilight?.astronomicalDawn);
    const nauticalDawn = eventTime(twilight?.nauticalDawn);
    const civilDawn = eventTime(twilight?.civilDawn);
    const civilDusk = eventTime(twilight?.civilDusk);
    const nauticalDusk = eventTime(twilight?.nauticalDusk);
    const astronomicalDusk = eventTime(twilight?.astronomicalDusk);

    if (astronomicalDawn && moment < astronomicalDawn) return 'night';
    if (astronomicalDawn && nauticalDawn && moment >= astronomicalDawn && moment < nauticalDawn) return 'astronomical-dawn';
    if (nauticalDawn && civilDawn && moment >= nauticalDawn && moment < civilDawn) return 'nautical-dawn';
    if (civilDawn && moment < civilDawn) return 'civil-dawn';
    if (civilDusk && nauticalDusk && moment >= civilDusk && moment < nauticalDusk) return 'civil-dusk';
    if (nauticalDusk && astronomicalDusk && moment >= nauticalDusk && moment < astronomicalDusk) return 'nautical-dusk';
    if (astronomicalDusk && moment >= astronomicalDusk) return 'astronomical-dusk';
    if (civilDusk && moment >= civilDusk) return 'night';
    return null;
  }

  function normalizedDaylight(moment, riseSet, horizontal, twilight) {
    const warnings = [];
    const rise = eventTime(riseSet?.rise);
    const set = eventTime(riseSet?.set);
    const source = riseSet?.source || 'unavailable';
    const altitude = Number.isFinite(horizontal?.altitude) ? horizontal.altitude : null;
    const unavailable = {
      status: 'unavailable',
      isDaylight: null,
      start: null,
      end: null,
      durationMs: null,
      progress: null,
      phase: 'unknown',
      source,
      warnings
    };

    if (source === 'unavailable') {
      warnings.push(!riseSet?.location ? 'missing-location-or-observer' : 'rise-set-engine-unavailable');
      return unavailable;
    }

    if (rise && set && set > rise) {
      const isDaylight = moment >= rise && moment < set;
      return {
        status: 'available',
        isDaylight,
        start: rise,
        end: set,
        durationMs: set - rise,
        progress: daylightProgress(moment, rise, set),
        phase: isDaylight ? 'daylight' : twilightPhase(moment, twilight) || 'night',
        source,
        warnings
      };
    }

    if (rise || set) {
      warnings.push(rise ? 'sunset-missing' : 'sunrise-missing');
      return {
        status: 'partial',
        isDaylight: rise ? moment >= rise : moment < set,
        start: rise,
        end: set,
        durationMs: null,
        progress: null,
        phase: rise ? 'after-sunrise' : 'before-sunset',
        source,
        warnings
      };
    }

    if (altitude !== null) {
      const polarDay = altitude >= 0;
      warnings.push(polarDay ? 'polar-day-no-rise-set' : 'polar-night-no-rise-set');
      return {
        status: polarDay ? 'polar-day' : 'polar-night',
        isDaylight: polarDay,
        start: null,
        end: null,
        durationMs: polarDay ? 86400000 : 0,
        progress: polarDay ? 1 : 0,
        phase: polarDay ? 'daylight' : 'night',
        source,
        warnings
      };
    }

    warnings.push('rise-set-unresolved');
    return unavailable;
  }

  function sunData(date = new Date(), location = null) {
    const moment = validDate(date);
    const longitudeData = AstronomyAdapter.getSolarLongitude(moment);
    const longitude = longitudeData.longitude;
    const degreeIndex = Math.floor(longitude);
    const normalizedLocation = location ? LocationCore?.normalizeLocation(location) || location : null;
    const riseSet = AstronomyAdapter.getRiseSet(moment, normalizedLocation, 'Sun');
    const horizontal = AstronomyAdapter.getHorizontalPosition(moment, normalizedLocation, 'Sun');
    const twilight = AstronomyAdapter.getTwilight(moment, normalizedLocation);
    const daylight = normalizedDaylight(moment, riseSet, horizontal, twilight);

    return {
      body: 'sun',
      date: new Date(moment.getTime()),
      longitude,
      degreeIndex,
      solarDate: CalendarCore.solarDateFromDegreeIndex(degreeIndex, solarYearLabel(moment)),
      location: normalizedLocation,
      rise: riseSet.rise,
      transit: riseSet.transit,
      set: riseSet.set,
      horizontal,
      twilight,
      altitude: horizontal.altitude,
      azimuth: horizontal.azimuth,
      daylight,
      daylightDurationMs: daylight.durationMs,
      warnings: daylight.warnings,
      calculatedAt: latestCalculatedAt(longitudeData, riseSet, horizontal, twilight),
      source: longitudeData.source,
      riseSetSource: riseSet.source
    };
  }

  const api = Object.freeze({
    normalizedDaylight,
    sunData
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleSunCore = api;
})();
