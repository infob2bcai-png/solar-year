(() => {
  'use strict';

  const CalendarCore = typeof require === 'function'
    ? require('./calendar-core.js')
    : globalThis.SolarCircleCalendarCore;
  const TimeCore = typeof require === 'function'
    ? require('./time-core.js')
    : globalThis.SolarCircleTimeCore;
  const AstronomyAdapter = typeof require === 'function'
    ? require('./astronomy-adapter.js')
    : globalThis.SolarCircleAstronomyAdapter;
  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;
  const SunCore = typeof require === 'function'
    ? require('./sun-core.js')
    : globalThis.SolarCircleSunCore;
  const MoonCore = typeof require === 'function'
    ? require('./moon-core.js')
    : globalThis.SolarCircleMoonCore;
  const EventRepository = typeof require === 'function'
    ? require('./event-repository.js')
    : globalThis.SolarCircleEventRepository;
  const NotesRepository = typeof require === 'function'
    ? require('./notes-repository.js')
    : globalThis.SolarCircleNotesRepository;
  const ReminderRepository = typeof require === 'function'
    ? require('./reminder-repository.js')
    : globalThis.SolarCircleReminderRepository;
  const RoutineRepository = typeof require === 'function'
    ? require('./routine-repository.js')
    : globalThis.SolarCircleRoutineRepository;

  if (!CalendarCore) throw new Error('SolarCircleCalendarCore is required before DayContext.');
  if (!TimeCore) throw new Error('SolarCircleTimeCore is required before DayContext.');
  if (!AstronomyAdapter) throw new Error('SolarCircleAstronomyAdapter is required before DayContext.');
  if (!LocationCore) throw new Error('SolarCircleLocationCore is required before DayContext.');
  if (!SunCore) throw new Error('SolarCircleSunCore is required before DayContext.');
  if (!MoonCore) throw new Error('SolarCircleMoonCore is required before DayContext.');
  if (!EventRepository) throw new Error('SolarCircleEventRepository is required before DayContext.');
  if (!NotesRepository) throw new Error('SolarCircleNotesRepository is required before DayContext.');
  if (!ReminderRepository) throw new Error('SolarCircleReminderRepository is required before DayContext.');
  if (!RoutineRepository) throw new Error('SolarCircleRoutineRepository is required before DayContext.');

  let boundaryCache = null;

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('DayContext date must be a valid Date.');
    return value;
  }

  function angularDifference(a, b) {
    return ((a - b + 540) % 360) - 180;
  }

  function estimateDateForLongitude(baseDate, target) {
    let delta = AstronomyAdapter.normalizeDegree(target - AstronomyAdapter.solarLongitude(baseDate));
    if (delta > 180) delta -= 360;
    return new Date(baseDate.getTime() + delta * 1.015 * 86400000);
  }

  function findLongitudeCrossing(targetDegrees, nearDate) {
    const target = AstronomyAdapter.normalizeDegree(targetDegrees);
    const center = nearDate.getTime();
    let left = center - 3 * 86400000;
    let right = center + 3 * 86400000;
    const value = stamp => angularDifference(AstronomyAdapter.solarLongitude(new Date(stamp)), target);
    let fl = value(left);
    let fr = value(right);

    for (let i = 0; i < 5 && fl * fr > 0; i++) {
      left -= 2 * 86400000;
      right += 2 * 86400000;
      fl = value(left);
      fr = value(right);
    }

    if (fl * fr > 0) {
      const step = 3 * 3600000;
      let prevT = left;
      let prevF = value(prevT);
      let found = false;
      for (let stamp = left + step; stamp <= right; stamp += step) {
        const f = value(stamp);
        if (prevF === 0 || f === 0 || prevF * f < 0) {
          left = prevT;
          right = stamp;
          fl = prevF;
          found = true;
          break;
        }
        prevT = stamp;
        prevF = f;
      }
      if (!found) return new Date(estimateDateForLongitude(nearDate, target));
    }

    for (let i = 0; i < 64; i++) {
      const mid = (left + right) / 2;
      const fm = value(mid);
      if (Math.abs(fm) < 1e-10 || right - left < 40) return new Date(mid);
      if (fl * fm <= 0) right = mid;
      else {
        left = mid;
        fl = fm;
      }
    }

    return new Date((left + right) / 2);
  }

  function boundaryTime(target, reference) {
    return findLongitudeCrossing(target, estimateDateForLongitude(reference, target));
  }

  function solarYearLabel(date) {
    const year = date.getUTCFullYear();
    const equinox = AstronomyAdapter.marchEquinox(year);
    if (equinox) return date >= equinox ? year : year - 1;
    const current = findLongitudeCrossing(0, new Date(Date.UTC(year, 2, 20, 9)));
    return date >= current ? year : year - 1;
  }

  function ensureBoundaries(date, degreeIndex) {
    const year = date.getUTCFullYear();
    if (
      boundaryCache &&
      boundaryCache.degreeIndex === degreeIndex &&
      boundaryCache.year === year &&
      date >= boundaryCache.start &&
      date < boundaryCache.end
    ) {
      return boundaryCache;
    }

    const start = boundaryTime(degreeIndex, date);
    const end = boundaryTime(degreeIndex + 1, date);
    boundaryCache = { degreeIndex, year, start, end, durationMs: end - start };
    return boundaryCache;
  }

  function resetCache() {
    boundaryCache = null;
  }

  function solarDateForDate(date = new Date()) {
    const moment = validDate(date);
    const degreeIndex = Math.floor(AstronomyAdapter.solarLongitude(moment));
    return CalendarCore.solarDateFromDegreeIndex(degreeIndex, solarYearLabel(moment));
  }

  function localDayStart(date, timezone) {
    return TimeCore.localDayStart(date, timezone);
  }

  function solarDayInterval(date, durationMs, timezone) {
    const start = localDayStart(date, timezone);
    return {
      start,
      end: new Date(start.getTime() + durationMs),
      durationMs
    };
  }

  function deferredDomain(name) {
    return { status: 'deferred', value: null, source: null, domain: name };
  }

  function weatherDomain(options) {
    return options.weather && typeof options.weather === 'object' ? options.weather : deferredDomain('weather');
  }

  function windDomain(options) {
    return options.wind && typeof options.wind === 'object' ? options.wind : deferredDomain('wind');
  }

  function eventDomain(date, civil, solar, location, options) {
    const repository = options.eventRepository || EventRepository.empty();
    return EventRepository.queryDay(repository, { date, civil, solar, location });
  }

  function repositoryDomain(moduleApi, repository, date, civil, solar, location, language) {
    const repo = repository && typeof repository.queryDay === 'function' ? repository : moduleApi.empty();
    return repo.queryDay({ date, civil, solar, location, language });
  }

  function themeSignalFromDaylight(daylight) {
    const warnings = Array.isArray(daylight?.warnings) ? [...daylight.warnings] : [];
    const status = daylight?.status || 'unavailable';
    const source = daylight?.source || 'unavailable';

    if (daylight?.isDaylight === true) {
      return {
        status: 'ready',
        recommendedTheme: 'light',
        reason: status,
        daylightStatus: status,
        phase: daylight.phase || 'daylight',
        source,
        warnings
      };
    }

    if (daylight?.isDaylight === false) {
      return {
        status: 'ready',
        recommendedTheme: 'dark',
        reason: status,
        daylightStatus: status,
        phase: daylight.phase || 'night',
        source,
        warnings
      };
    }

    warnings.push('auto-sun-theme-signal-unavailable');
    return {
      status: 'unavailable',
      recommendedTheme: null,
      reason: status,
      daylightStatus: status,
      phase: daylight?.phase || 'unknown',
      source,
      warnings
    };
  }

  function astronomyDomain(sun, moon, themeSignal) {
    return {
      status: themeSignal.status === 'ready' ? 'ready' : 'degraded',
      domain: 'astronomy',
      source: {
        sun: sun.riseSetSource || sun.source || null,
        moon: moon.riseSetSource || moon.source || null
      },
      sun,
      moon,
      daylight: sun.daylight,
      themeSignal
    };
  }

  function dayContext(date = new Date(), options = {}) {
    const moment = validDate(date);
    const location = options.location
      ? LocationCore.normalizeLocation({ ...options.location, date: moment })
      : LocationCore.current(moment);
    const sun = SunCore.sunData(moment, location);
    const moon = MoonCore.moonData(moment, location);
    const degreeIndex = sun.degreeIndex;
    const bounds = ensureBoundaries(moment, degreeIndex);
    const solarDay = solarDayInterval(moment, bounds.durationMs, location.timezone);
    const physicalProgress = TimeCore.clamp((moment - solarDay.start) / solarDay.durationMs, 0, 0.999999999);
    const solarDate = CalendarCore.solarDateFromDegreeIndex(degreeIndex, solarYearLabel(moment));
    const solarTime = TimeCore.solarTimeFromProgress(physicalProgress);
    const solar = {
      ...solarDate,
      longitude: sun.longitude,
      degreeIndex,
      start: solarDay.start,
      end: solarDay.end,
      durationMs: solarDay.durationMs,
      orbitalStart: bounds.start,
      orbitalEnd: bounds.end,
      orbitalDurationMs: bounds.durationMs,
      physicalProgress,
      solarTime: solarTime.label,
      solarSecondMs: solarDay.durationMs / TimeCore.SECONDS_IN_DAY,
      daylight: sun.daylight
    };
    const civil = {
      ...TimeCore.civilTime(moment, location.timezone),
      ...TimeCore.civilParts(moment, location.timezone)
    };
    const language = options.language || 'ru';
    const events = eventDomain(moment, civil, solar, location, options);
    const notes = repositoryDomain(NotesRepository, options.notesRepository, moment, civil, solar, location, language);
    const reminders = repositoryDomain(ReminderRepository, options.reminderRepository, moment, civil, solar, location, language);
    const routine = repositoryDomain(RoutineRepository, options.routineRepository, moment, civil, solar, location, language);
    const weather = weatherDomain(options);
    const wind = windDomain(options);
    const themeSignal = themeSignalFromDaylight(sun.daylight);
    const astronomy = astronomyDomain(sun, moon, themeSignal);
    const clock = {
      ...solar,
      date: moment,
      location,
      civil,
      sun,
      moon,
      daylight: sun.daylight,
      themeSignal,
      weather,
      wind,
      events: events.value,
      notes: notes.value,
      reminders: reminders.value,
      routine: routine.value,
      routineDoneCount: routine.doneCount || 0,
      nature: null
    };

    return {
      date: moment,
      location,
      civil,
      solar,
      sun,
      moon,
      astronomy,
      themeSignal,
      weather,
      wind,
      events,
      notes,
      reminders,
      routine,
      nature: deferredDomain('nature'),
      display: { clock }
    };
  }

  const api = Object.freeze({
    dayContext,
    solarDateForDate,
    resetCache
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleDayContext = api;
})();
