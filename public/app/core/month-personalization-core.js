(() => {
  'use strict';

  const Calendar = typeof require === 'function' ? require('./calendar-core.js') : globalThis.SolarCircleCalendarCore;
  const Journey = typeof require === 'function' ? require('./month-journey-core.js') : globalThis.SolarCircleMonthJourneyCore;
  const Grammar = typeof require === 'function' ? require('./calendar-grammar.js') : globalThis.SolarCircleCalendarGrammar;
  const SCHEMA = 'solar-year.month-personalization';
  const VERSION = 1;

  function emptyState() {
    return { schema: SCHEMA, version: VERSION, revision: 0, course: null, journeys: {}, unlocks: {}, months: {}, assets: {} };
  }

  function monthDefinition(monthId) {
    Journey.integer(monthId, 1, 12);
    return Object.freeze({ monthId, canonicalName: Object.freeze({ ru: Calendar.MONTHS.ru[monthId - 1], en: Calendar.MONTHS.en[monthId - 1] }),
      degreeStart: (monthId - 1) * 30, defaultTreeVariantId: `tree-life-month-${String(monthId).padStart(2, '0')}` });
  }

  function normalizeName(input) {
    if (typeof input !== 'string' || /[\p{Cc}\p{Cs}\u2028\u2029\u202a-\u202e\u2066-\u2069]/u.test(input)) {
      throw new TypeError('Month name must be a single line without control characters.');
    }
    const name = input.normalize('NFC').trim();
    if (!name.replace(/[\p{White_Space}\p{Default_Ignorable_Code_Point}]/gu, '')
      || [...name].length > 40 || new TextEncoder().encode(name).length > 160) throw new RangeError('Invalid month name length.');
    return name;
  }

  function validateReceipt(receipt, monthId) {
    Journey.integer(monthId, 1, 12);
    if (!receipt || receipt.ruleVersion !== Journey.RULE_VERSION || receipt.monthId !== monthId
      || Journey.parseJourneyKey(receipt.journeyKey).monthId !== monthId) throw new TypeError('Invalid unlock receipt.');
    Journey.isoTime(receipt.grantedAt);
    for (const list of [receipt.viewedDays, receipt.notedDays]) {
      if (!Array.isArray(list) || list.length !== 30 || new Set(list).size !== 30) throw new TypeError('Incomplete unlock receipt.');
      list.forEach(day => Journey.integer(day, 1, 30));
    }
    return receipt;
  }

  function canCustomize(state, monthId) {
    Journey.integer(monthId, 1, 12);
    try {
      if (state?.schema !== SCHEMA || state.version !== VERSION || state.course?.ruleVersion !== Journey.RULE_VERSION) return false;
      Journey.isoTime(state.course.completedAt);
      const source = Journey.parseJourneyKey(state.course.sourceJourneyKey);
      const sourceReceipt = validateReceipt(state.unlocks?.[source.monthId], source.monthId);
      if (sourceReceipt.journeyKey !== state.course.sourceJourneyKey) return false;
      validateReceipt(state.unlocks?.[monthId], monthId);
      return true;
    } catch { return false; }
  }

  function resolveMonthDisplay(monthId, locale, state) {
    const definition = monthDefinition(monthId);
    const language = locale === 'en' ? 'en' : 'ru';
    const names = canCustomize(state, monthId) ? state.months?.[monthId]?.customNames : null;
    let personalName = null;
    for (const value of [names?.[language], names?.[language === 'en' ? 'ru' : 'en']]) {
      if (value === undefined) continue;
      try { personalName = normalizeName(value); break; } catch { /* Corrupt personal data must not hide the canonical name. */ }
    }
    return { ...definition, canonicalName: definition.canonicalName[language], personalName,
      title: personalName || definition.canonicalName[language], canCustomize: canCustomize(state, monthId) };
  }

  function fullSolarDate(date, locale, state) {
    const language = locale === 'en' ? 'en' : 'ru';
    const model = resolveMonthDisplay(date.month, language, state);
    if (!model.personalName) return Grammar.fullSolarDate(date, language);
    const weekday = Grammar.weekdayName(date.weekdayIndex, language);
    return `${language === 'ru' ? weekday.toLocaleLowerCase('ru-RU') : weekday}, ${date.day} ${model.title} ${Grammar.displaySolarYear(date.year)}${language === 'ru' ? ' г.' : ''}`;
  }

  const api = Object.freeze({ SCHEMA, VERSION, emptyState, monthDefinition, normalizeName, validateReceipt, canCustomize, resolveMonthDisplay, fullSolarDate });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleMonthPersonalizationCore = api;
})();
