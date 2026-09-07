(() => {
  'use strict';

  const CalendarCore = typeof require === 'function'
    ? require('./calendar-core.js')
    : globalThis.SolarCircleCalendarCore;

  if (!CalendarCore) throw new Error('SolarCircleCalendarCore is required before CalendarGrammar.');

  const MONTH_PREPOSITIONAL_RU = CalendarCore.MONTHS.ru.reduce((forms, name) => {
    forms[name] = `${name}ом`;
    return forms;
  }, {});

  function languageOf(language) {
    return CalendarCore.MONTHS[language] ? language : 'ru';
  }

  function monthName(month, language = 'ru') {
    return CalendarCore.monthName(month, languageOf(language));
  }

  function weekdayName(weekdayIndex, language = 'ru', short = false) {
    return CalendarCore.weekdayName(weekdayIndex, languageOf(language), short);
  }

  function compactSolarDate(solarDate, language = 'ru') {
    return `${solarDate.day} ${monthName(solarDate.month, language)}`;
  }

  function displaySolarYear(year) {
    if (!Number.isInteger(year)) throw new TypeError('An integer solar year is required.');
    return year;
  }

  function fullSolarDate(solarDate, language = 'ru') {
    const lang = languageOf(language);
    const weekday = weekdayName(solarDate.weekdayIndex, lang);
    const year = displaySolarYear(solarDate.year);
    return lang === 'ru'
      ? `${weekday.toLocaleLowerCase('ru-RU')}, ${compactSolarDate(solarDate, lang)} ${year} г.`
      : `${weekday}, ${compactSolarDate(solarDate, lang)} ${year}`;
  }

  function monthPhrase(month, language = 'ru') {
    const name = monthName(month, language);
    return languageOf(language) === 'ru' ? `${name} месяц` : `${name} month`;
  }

  function dayPhrase(solarDate, language = 'ru') {
    const name = monthName(solarDate.month, language);
    return languageOf(language) === 'ru'
      ? `${name} ${solarDate.day}-й день`
      : `${name} day ${solarDate.day}`;
  }

  function inDayPhrase(solarDate, language = 'ru') {
    const name = monthName(solarDate.month, language);
    if (languageOf(language) !== 'ru') return `in ${name} day ${solarDate.day}`;

    return `в ${MONTH_PREPOSITIONAL_RU[name]} ${solarDate.day}-м дне`;
  }

  function weekdayStatusLabel(solarDate, language, workdayLabel, weekendLabel) {
    const status = solarDate.isWeekend ? weekendLabel : workdayLabel;
    return `${weekdayName(solarDate.weekdayIndex, language)} · ${status}`;
  }

  function weekdayHeaders(language = 'ru') {
    return Array.from({ length: CalendarCore.DAYS_IN_WEEK }, (_, index) => ({
      index,
      label: weekdayName(index, language, true),
      isWeekend: CalendarCore.isWeekend(index)
    }));
  }

  const api = Object.freeze({
    monthName,
    weekdayName,
    compactSolarDate,
    displaySolarYear,
    fullSolarDate,
    monthPhrase,
    dayPhrase,
    inDayPhrase,
    weekdayStatusLabel,
    weekdayHeaders
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleCalendarGrammar = api;
})();
