(() => {
  'use strict';

  const DAYS_IN_YEAR = 360;
  const MONTHS_IN_YEAR = 12;
  const DAYS_IN_MONTH = 30;
  const DAYS_IN_WEEK = 6;
  const WORKDAYS_IN_WEEK = 4;

  const MONTHS = {
    ru: ['Алинин','Анин','Нинин','Макарин','Богданин','Риммин','Лехин','Санин','Настин','Артемин','Юрин','Катин'],
    en: ['Alinin','Anin','Ninin','Makarin','Bogdanin','Rimmin','Lekhin','Sanin','Nastin','Artemin','Yurin','Katin']
  };

  const WEEKDAYS = {
    ru: ['Понедельник','Вторник','Среда','Четверг','Суббота','Воскресенье'],
    en: ['Monday','Tuesday','Wednesday','Thursday','Saturday','Sunday']
  };

  const WEEKDAYS_SHORT = {
    ru: ['Пн','Вт','Ср','Чт','Сб','Вс'],
    en: ['Mon','Tue','Wed','Thu','Sat','Sun']
  };

  function normalizeDegree(value) {
    return ((value % DAYS_IN_YEAR) + DAYS_IN_YEAR) % DAYS_IN_YEAR;
  }

  function assertDegreeIndex(degreeIndex) {
    if (!Number.isInteger(degreeIndex) || degreeIndex < 0 || degreeIndex >= DAYS_IN_YEAR) {
      throw new RangeError(`Solar degree index must be an integer from 0 to ${DAYS_IN_YEAR - 1}.`);
    }
  }

  function isWeekend(weekdayIndex) {
    if (!Number.isInteger(weekdayIndex) || weekdayIndex < 0 || weekdayIndex >= DAYS_IN_WEEK) {
      throw new RangeError(`Weekday index must be an integer from 0 to ${DAYS_IN_WEEK - 1}.`);
    }
    return weekdayIndex >= WORKDAYS_IN_WEEK;
  }

  function solarDateFromDegreeIndex(degreeIndex, year = null) {
    assertDegreeIndex(degreeIndex);

    const totalDay = degreeIndex + 1;
    const month = Math.floor(degreeIndex / DAYS_IN_MONTH) + 1;
    const day = (degreeIndex % DAYS_IN_MONTH) + 1;
    const quarter = Math.floor(degreeIndex / 90) + 1;
    const weekdayIndex = (day - 1) % DAYS_IN_WEEK;
    const week = Math.floor((day - 1) / DAYS_IN_WEEK) + 1;

    return {
      year,
      totalDay,
      month,
      day,
      quarter,
      weekdayIndex,
      week,
      degreeStart: degreeIndex,
      degreeEnd: degreeIndex + 1,
      isWeekend: isWeekend(weekdayIndex)
    };
  }

  function monthName(month, language = 'ru') {
    if (!Number.isInteger(month) || month < 1 || month > MONTHS_IN_YEAR) {
      throw new RangeError(`Solar month must be an integer from 1 to ${MONTHS_IN_YEAR}.`);
    }
    return (MONTHS[language] || MONTHS.ru)[month - 1];
  }

  function weekdayName(weekdayIndex, language = 'ru', short = false) {
    const names = short ? WEEKDAYS_SHORT : WEEKDAYS;
    if (!Number.isInteger(weekdayIndex) || weekdayIndex < 0 || weekdayIndex >= DAYS_IN_WEEK) {
      throw new RangeError(`Weekday index must be an integer from 0 to ${DAYS_IN_WEEK - 1}.`);
    }
    return (names[language] || names.ru)[weekdayIndex];
  }

  const api = Object.freeze({
    DAYS_IN_YEAR,
    MONTHS_IN_YEAR,
    DAYS_IN_MONTH,
    DAYS_IN_WEEK,
    WORKDAYS_IN_WEEK,
    MONTHS,
    WEEKDAYS,
    WEEKDAYS_SHORT,
    normalizeDegree,
    solarDateFromDegreeIndex,
    isWeekend,
    monthName,
    weekdayName
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleCalendarCore = api;
})();
