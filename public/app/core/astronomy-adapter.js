(() => {
  'use strict';
  const TimeCore = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;

  function normalizeDegree(value) {
    return ((value % 360) + 360) % 360;
  }

  function rad(value) {
    return value * Math.PI / 180;
  }

  function donorApi() {
    return globalThis.Astronomy || null;
  }

  function bodyName(name) {
    return donorApi()?.Body?.[name] || name;
  }

  function validDate(date, label = 'Astronomy date') {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError(`${label} must be a valid Date.`);
    return value;
  }

  function validLocation(location) {
    if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
      return null;
    }

    const latitude = Math.max(-90, Math.min(90, location.latitude));
    const longitude = Math.max(-180, Math.min(180, location.longitude));
    return {
      latitude,
      longitude,
      altitude: Number.isFinite(location.altitude) ? location.altitude : 0,
      utcOffset: Number.isFinite(location.utcOffset) ? location.utcOffset : 0,
      timezone: location.timezone || 'UTC',
      source: location.source || 'unknown'
    };
  }

  function makeObserver(astronomy, location) {
    const normalized = validLocation(location);
    if (!normalized || !astronomy?.Observer) return null;
    return new astronomy.Observer(normalized.latitude, normalized.longitude, normalized.altitude || 0);
  }

  function dateFromAstroTime(value) {
    const date = value?.date instanceof Date ? value.date : value instanceof Date ? value : null;
    return date && Number.isFinite(date.getTime()) ? new Date(date.getTime()) : null;
  }

  function localDayStart(date, location) {
    if (location?.timezone && TimeCore) return TimeCore.localDayStart(date, location.timezone);
    const offsetMinutes = Number.isFinite(location?.utcOffset) ? location.utcOffset : 0;
    const shifted = new Date(date.getTime() + offsetMinutes * 60000);
    return new Date(Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate()
    ) - offsetMinutes * 60000);
  }

  function inLocalDay(date, start, location) {
    const end = location?.timezone && TimeCore ? TimeCore.addCalendarDays(start, 1, location.timezone) : new Date(start.getTime() + 86400000);
    return date instanceof Date && date >= start && date < end;
  }

  function unavailableResult(body, date, location, fields = {}) {
    return {
      body,
      date: new Date(date.getTime()),
      location: validLocation(location),
      calculatedAt: new Date(),
      source: 'unavailable',
      ...fields
    };
  }

  function approximateSolarLongitude(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545) / 36525;
    const L0 = normalizeDegree(280.46646 + T * (36000.76983 + 0.0003032 * T));
    const M = normalizeDegree(357.52911 + T * (35999.05029 - 0.0001537 * T));
    const C = Math.sin(rad(M)) * (1.914602 - T * (0.004817 + 0.000014 * T))
      + Math.sin(rad(2 * M)) * (0.019993 - 0.000101 * T)
      + Math.sin(rad(3 * M)) * 0.000289;
    const omega = 125.04 - 1934.136 * T;

    return normalizeDegree(L0 + C - 0.00569 - 0.00478 * Math.sin(rad(omega)));
  }

  function getSolarLongitude(date) {
    try {
      const astronomy = donorApi();
      if (astronomy?.SunPosition) {
        return {
          longitude: normalizeDegree(astronomy.SunPosition(date).elon),
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return {
      longitude: approximateSolarLongitude(date),
      calculatedAt: new Date(),
      source: 'approximation'
    };
  }

  function getMoonPhase(date) {
    try {
      const astronomy = donorApi();
      if (astronomy?.MoonPhase) {
        return {
          phaseAngle: normalizeDegree(astronomy.MoonPhase(date)),
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return {
      phaseAngle: null,
      calculatedAt: new Date(),
      source: 'unavailable'
    };
  }

  function getMoonIllumination(date) {
    try {
      const astronomy = donorApi();
      if (astronomy?.Illumination) {
        const illumination = astronomy.Illumination(bodyName('Moon'), date);
        return {
          fraction: Number.isFinite(illumination?.phase_fraction) ? illumination.phase_fraction : null,
          magnitude: Number.isFinite(illumination?.mag) ? illumination.mag : null,
          phaseAngle: Number.isFinite(illumination?.phase_angle) ? normalizeDegree(illumination.phase_angle) : null,
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return {
      fraction: null,
      magnitude: null,
      phaseAngle: null,
      calculatedAt: new Date(),
      source: 'unavailable'
    };
  }

  function getMoonEcliptic(date) {
    try {
      const astronomy = donorApi();
      if (astronomy?.EclipticGeoMoon) {
        const moon = astronomy.EclipticGeoMoon(date);
        return {
          longitude: Number.isFinite(moon?.lon) ? normalizeDegree(moon.lon) : null,
          latitude: Number.isFinite(moon?.lat) ? moon.lat : null,
          distanceAu: Number.isFinite(moon?.dist) ? moon.dist : null,
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return {
      longitude: null,
      latitude: null,
      distanceAu: null,
      calculatedAt: new Date(),
      source: 'unavailable'
    };
  }

  function getHorizontalPosition(date, location, body = 'Sun') {
    const moment = validDate(date, 'Horizontal position date');
    const normalizedLocation = validLocation(location);
    if (!normalizedLocation) {
      return unavailableResult(body, moment, location, {
        azimuth: null,
        altitude: null,
        rightAscension: null,
        declination: null,
        distanceAu: null
      });
    }

    try {
      const astronomy = donorApi();
      const observer = makeObserver(astronomy, normalizedLocation);
      if (astronomy?.Equator && astronomy?.Horizon && observer) {
        const equator = astronomy.Equator(bodyName(body), moment, observer, true, true);
        const horizon = astronomy.Horizon(moment, observer, equator.ra, equator.dec, 'normal');
        return {
          body,
          date: new Date(moment.getTime()),
          location: normalizedLocation,
          azimuth: Number.isFinite(horizon?.azimuth) ? normalizeDegree(horizon.azimuth) : null,
          altitude: Number.isFinite(horizon?.altitude) ? horizon.altitude : null,
          rightAscension: Number.isFinite(horizon?.ra) ? horizon.ra : Number.isFinite(equator?.ra) ? equator.ra : null,
          declination: Number.isFinite(horizon?.dec) ? horizon.dec : Number.isFinite(equator?.dec) ? equator.dec : null,
          distanceAu: Number.isFinite(equator?.dist) ? equator.dist : null,
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return unavailableResult(body, moment, normalizedLocation, {
      azimuth: null,
      altitude: null,
      rightAscension: null,
      declination: null,
      distanceAu: null
    });
  }

  function searchRiseSetEvent(astronomy, body, observer, dateStart, direction) {
    if (!astronomy?.SearchRiseSet) return null;
    return dateFromAstroTime(
      astronomy.SearchRiseSet(bodyName(body), observer, direction, dateStart, 1.5, 0)
    );
  }

  function searchTransitEvent(astronomy, body, observer, dateStart) {
    if (!astronomy?.SearchHourAngle) return null;
    return dateFromAstroTime(astronomy.SearchHourAngle(bodyName(body), observer, 0, dateStart, +1)?.time);
  }

  function normalizeTimedPosition(date, location, body) {
    if (!date) return null;
    const position = getHorizontalPosition(date, location, body);
    return {
      time: new Date(date.getTime()),
      azimuth: position.azimuth,
      altitude: position.altitude
    };
  }

  function getRiseSet(date, location, body = 'Sun') {
    const moment = validDate(date, 'Rise/set date');
    const normalizedLocation = validLocation(location);
    if (!normalizedLocation) {
      return unavailableResult(body, moment, location, { rise: null, transit: null, set: null });
    }

    const dayStart = localDayStart(moment, normalizedLocation);
    try {
      const astronomy = donorApi();
      const observer = makeObserver(astronomy, normalizedLocation);
      if (astronomy?.SearchRiseSet && observer) {
        const riseTime = searchRiseSetEvent(astronomy, body, observer, dayStart, +1);
        const setTime = searchRiseSetEvent(astronomy, body, observer, dayStart, -1);
        const transitTime = searchTransitEvent(astronomy, body, observer, dayStart);
        return {
          body,
          date: new Date(moment.getTime()),
          location: normalizedLocation,
          rise: inLocalDay(riseTime, dayStart, normalizedLocation) ? normalizeTimedPosition(riseTime, normalizedLocation, body) : null,
          transit: inLocalDay(transitTime, dayStart, normalizedLocation) ? normalizeTimedPosition(transitTime, normalizedLocation, body) : null,
          set: inLocalDay(setTime, dayStart, normalizedLocation) ? normalizeTimedPosition(setTime, normalizedLocation, body) : null,
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return unavailableResult(body, moment, normalizedLocation, { rise: null, transit: null, set: null });
  }

  function searchAltitudeEvent(astronomy, observer, dateStart, direction, altitude) {
    if (!astronomy?.SearchAltitude) return null;
    return dateFromAstroTime(
      astronomy.SearchAltitude(bodyName('Sun'), observer, direction, dateStart, 1.5, altitude)
    );
  }

  function twilightEvent(astronomy, observer, dayStart, location, altitude, direction) {
    const time = searchAltitudeEvent(astronomy, observer, dayStart, direction, altitude);
    return inLocalDay(time, dayStart, location) ? normalizeTimedPosition(time, location, 'Sun') : null;
  }

  function getTwilight(date, location) {
    const moment = validDate(date, 'Twilight date');
    const normalizedLocation = validLocation(location);
    if (!normalizedLocation) {
      return unavailableResult('Sun', moment, location, {
        civilDawn: null,
        civilDusk: null,
        nauticalDawn: null,
        nauticalDusk: null,
        astronomicalDawn: null,
        astronomicalDusk: null
      });
    }

    const dayStart = localDayStart(moment, normalizedLocation);
    try {
      const astronomy = donorApi();
      const observer = makeObserver(astronomy, normalizedLocation);
      if (astronomy?.SearchAltitude && observer) {
        return {
          body: 'Sun',
          date: new Date(moment.getTime()),
          location: normalizedLocation,
          civilDawn: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -6, +1),
          civilDusk: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -6, -1),
          nauticalDawn: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -12, +1),
          nauticalDusk: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -12, -1),
          astronomicalDawn: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -18, +1),
          astronomicalDusk: twilightEvent(astronomy, observer, dayStart, normalizedLocation, -18, -1),
          calculatedAt: new Date(),
          source: 'astronomy-engine'
        };
      }
    } catch {}

    return unavailableResult('Sun', moment, normalizedLocation, {
      civilDawn: null,
      civilDusk: null,
      nauticalDawn: null,
      nauticalDusk: null,
      astronomicalDawn: null,
      astronomicalDusk: null
    });
  }

  function solarLongitude(date) {
    return getSolarLongitude(date).longitude;
  }

  function marchEquinox(year) {
    try {
      const astronomy = donorApi();
      const equinox = astronomy?.Seasons?.(year)?.mar_equinox?.date;
      return equinox instanceof Date ? equinox : null;
    } catch {
      return null;
    }
  }

  function hasDonorEngine() {
    return Boolean(donorApi()?.SunPosition);
  }

  function hasMoonEngine() {
    const astronomy = donorApi();
    return Boolean(astronomy?.MoonPhase || astronomy?.Illumination || astronomy?.EclipticGeoMoon);
  }

  function hasRiseSetEngine() {
    const astronomy = donorApi();
    return Boolean(astronomy?.Observer && astronomy?.SearchRiseSet && astronomy?.SearchAltitude && astronomy?.SearchHourAngle);
  }

  const api = Object.freeze({
    normalizeDegree,
    approximateSolarLongitude,
    getSolarLongitude,
    solarLongitude,
    getMoonPhase,
    getMoonIllumination,
    getMoonEcliptic,
    getHorizontalPosition,
    getRiseSet,
    getTwilight,
    marchEquinox,
    hasDonorEngine,
    hasMoonEngine,
    hasRiseSetEngine
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleAstronomyAdapter = api;
})();
