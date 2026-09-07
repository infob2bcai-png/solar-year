(() => {
  'use strict';

  const CalendarCore = typeof require === 'function'
    ? require('./calendar-core.js')
    : globalThis.SolarCircleCalendarCore;

  if (!CalendarCore) throw new Error('SolarCircleCalendarCore is required before LegacyProjectionEngine.');

  const LEGACY_OVERFLOW_START = 361;
  const LEGACY_OVERFLOW_END = 366;
  const PROJECTED_DAY_OFFSET = 6;

  function isLegacyOverflowDay(day) {
    return Number.isInteger(day) && day >= LEGACY_OVERFLOW_START && day <= LEGACY_OVERFLOW_END;
  }

  function assertLegacyOverflowDay(day) {
    if (!isLegacyOverflowDay(day)) {
      throw new RangeError(`Legacy overflow day must be an integer from ${LEGACY_OVERFLOW_START} to ${LEGACY_OVERFLOW_END}.`);
    }
  }

  function projectLegacyOverflowDay(legacyDay, year = null) {
    assertLegacyOverflowDay(legacyDay);

    const projectedTotalDay = legacyDay - PROJECTED_DAY_OFFSET;
    const solarDate = CalendarCore.solarDateFromDegreeIndex(projectedTotalDay - 1, year);

    return {
      kind: 'legacy-overflow',
      sourceCalendar: 'legacy-366',
      targetCalendar: 'solar-circle-360',
      legacyDay,
      projectedTotalDay,
      solarDate,
      note: 'event-only projection'
    };
  }

  function projectSolarEventDay(totalDay, year = null) {
    if (!Number.isInteger(totalDay)) {
      throw new RangeError('Solar event day must be an integer.');
    }

    if (totalDay >= 1 && totalDay <= CalendarCore.DAYS_IN_YEAR) {
      return {
        kind: 'canonical',
        sourceCalendar: 'solar-circle-360',
        targetCalendar: 'solar-circle-360',
        legacyDay: null,
        projectedTotalDay: totalDay,
        solarDate: CalendarCore.solarDateFromDegreeIndex(totalDay - 1, year),
        note: null
      };
    }

    if (isLegacyOverflowDay(totalDay)) {
      return projectLegacyOverflowDay(totalDay, year);
    }

    throw new RangeError(`Solar event day must be 1-${CalendarCore.DAYS_IN_YEAR} or legacy overflow ${LEGACY_OVERFLOW_START}-${LEGACY_OVERFLOW_END}.`);
  }

  const api = Object.freeze({
    LEGACY_OVERFLOW_START,
    LEGACY_OVERFLOW_END,
    isLegacyOverflowDay,
    projectLegacyOverflowDay,
    projectSolarEventDay
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleLegacyProjectionEngine = api;
})();
