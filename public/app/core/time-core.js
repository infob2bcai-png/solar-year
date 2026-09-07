(() => {
  'use strict';

  const SECONDS_IN_DAY = 86400;
  const Temporal = typeof require === 'function'
    ? require('@js-temporal/polyfill').Temporal : globalThis.temporal.Temporal;

  function validTimezone(value) {
    try { new Intl.DateTimeFormat('en', { timeZone: value }).format(0); return Boolean(value); }
    catch { return false; }
  }

  function zoned(date, timezone = timezoneName('UTC')) {
    return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO(timezone);
  }

  function civilParts(date, timezone = timezoneName('UTC')) {
    const value = zoned(date, timezone);
    return { year: value.year, month: value.month, day: value.day };
  }

  function localDayStart(date, timezone = timezoneName('UTC')) {
    return new Date(zoned(date, timezone).startOfDay().epochMilliseconds);
  }

  function addCalendarDays(date, days, timezone = timezoneName('UTC')) {
    return new Date(zoned(date, timezone).add({ days }).startOfDay().epochMilliseconds);
  }

  function dateFromInput(value, timezone = timezoneName('UTC')) {
    const local = Temporal.PlainDateTime.from(value);
    // Earlier occurrence for a repeated DST time; a skipped wall time is invalid.
    const result = local.toZonedDateTime(timezone, { disambiguation: 'compatible' });
    if (!result.toPlainDateTime().equals(local)) throw new RangeError('This local time does not exist in the selected time zone.');
    return new Date(result.epochMilliseconds);
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function solarTimeFromProgress(progress) {
    const solarSeconds = Math.floor(clamp(progress, 0, 0.999999999) * SECONDS_IN_DAY);
    const hours = Math.floor(solarSeconds / 3600);
    const minutes = Math.floor((solarSeconds % 3600) / 60);
    const seconds = solarSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
      totalSeconds: solarSeconds,
      label: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    };
  }

  function utcOffsetMinutes(date = new Date(), timezone) {
    return timezone ? zoned(date, timezone).offsetNanoseconds / 60000000000 : -date.getTimezoneOffset();
  }

  function formatUtcOffset(date = new Date(), timezone) {
    const minutes = utcOffsetMinutes(date, timezone);
    const sign = minutes >= 0 ? '+' : '-';
    const absolute = Math.abs(minutes);
    return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
  }

  function timezoneName(fallback = 'timezone') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  }

  function isDst(date = new Date(), timezone) {
    if (timezone) {
      const value = zoned(date, timezone);
      const standard = Math.min(utcOffsetMinutes(new Date(Date.UTC(value.year, 0, 1, 12)), timezone), utcOffsetMinutes(new Date(Date.UTC(value.year, 6, 1, 12)), timezone));
      return utcOffsetMinutes(date, timezone) > standard;
    }
    const year = date.getFullYear();
    const januaryOffset = new Date(year, 0, 1).getTimezoneOffset();
    const julyOffset = new Date(year, 6, 1).getTimezoneOffset();
    const standardOffset = Math.max(januaryOffset, julyOffset);

    return date.getTimezoneOffset() < standardOffset;
  }

  function civilTime(date = new Date(), timezone = timezoneName('UTC')) {
    return {
      timestamp: date.toISOString(),
      timezone,
      utcOffset: utcOffsetMinutes(date, timezone),
      dst: isDst(date, timezone)
    };
  }

  function formatDateTime(date, locale, seconds = true, timezone) {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: seconds ? '2-digit' : undefined
    }).format(date);
  }

  function formatCivilDate(date, locale, timezone) {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  function formatClockTime(date, locale, timezone) {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  }

  function formatDuration(ms, language = 'ru') {
    const total = Math.round(ms / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    return language === 'ru'
      ? `${hours} ч ${pad(minutes)} мин ${pad(seconds)} с`
      : `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  }

  function formatPhysicalSecond(ms, language = 'ru') {
    return `${(ms / 1000).toFixed(5)} ${language === 'ru' ? 'с' : 's'}`;
  }

  function inputValue(date, timezone = timezoneName('UTC')) {
    return zoned(date, timezone).toPlainDateTime().toString({ smallestUnit: 'second' });
  }

  function utcStamp(date) {
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }

  const api = Object.freeze({
    SECONDS_IN_DAY,
    validTimezone,
    civilParts,
    localDayStart,
    addCalendarDays,
    dateFromInput,
    pad,
    clamp,
    solarTimeFromProgress,
    utcOffsetMinutes,
    formatUtcOffset,
    timezoneName,
    isDst,
    civilTime,
    formatDateTime,
    formatCivilDate,
    formatClockTime,
    formatDuration,
    formatPhysicalSecond,
    inputValue,
    utcStamp
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleTimeCore = api;
})();
