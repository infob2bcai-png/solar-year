(() => {
  'use strict';

  const CalendarGrammar = typeof require === 'function'
    ? require('./calendar-grammar.js')
    : globalThis.SolarCircleCalendarGrammar;
  const LegacyProjectionEngine = typeof require === 'function'
    ? require('./legacy-projection-engine.js')
    : globalThis.SolarCircleLegacyProjectionEngine;

  if (!CalendarGrammar) throw new Error('SolarCircleCalendarGrammar is required before EventCore.');
  if (!LegacyProjectionEngine) throw new Error('SolarCircleLegacyProjectionEngine is required before EventCore.');

  const EVENT_CATEGORIES = Object.freeze([
    'holiday',
    'history',
    'memorial',
    'birthday',
    'personal',
    'nature',
    'system'
  ]);

  const RECURRENCE_TYPES = Object.freeze([
    'NONE',
    'SOLAR_WEEKLY',
    'SOLAR_MONTHLY',
    'SOLAR_YEARLY',
    'CIVIL_MONTHLY',
    'CIVIL_YEARLY',
    'CUSTOM'
  ]);

  function localizedText(value, fallback = '') {
    if (typeof value === 'string') return { ru: value, en: value };
    if (value && typeof value === 'object') {
      const ru = typeof value.ru === 'string' ? value.ru : value.en || fallback;
      const en = typeof value.en === 'string' ? value.en : value.ru || fallback;
      return { ru, en };
    }
    return { ru: fallback, en: fallback };
  }

  function cleanSource(source = {}) {
    return {
      type: source.type || 'local',
      name: source.name || null,
      url: source.url || null,
      license: source.license || null,
      version: source.version || null,
      commit: source.commit || null
    };
  }

  function normalizeCivilDate(input) {
    if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) {
      throw new RangeError('Civil event month must be an integer from 1 to 12.');
    }
    if (!Number.isInteger(input.day) || input.day < 1 || input.day > 31) {
      throw new RangeError('Civil event day must be an integer from 1 to 31.');
    }

    return {
      kind: 'civil',
      year: Number.isInteger(input.year) ? input.year : null,
      month: input.month,
      day: input.day,
      projection: null
    };
  }

  function normalizeSolarDate(input) {
    const year = Number.isInteger(input.year) ? input.year : null;
    const totalDay = input.totalDay ?? input.dayOfYear;
    const projection = LegacyProjectionEngine.projectSolarEventDay(totalDay, year);

    return {
      kind: projection.kind === 'legacy-overflow' ? 'legacy-overflow' : 'solar',
      year,
      totalDay,
      month: projection.solarDate.month,
      day: projection.solarDate.day,
      projection: projection.kind === 'legacy-overflow' ? projection : null,
      solarDate: projection.solarDate
    };
  }

  function normalizeLegacyOverflowDate(input) {
    const year = Number.isInteger(input.year) ? input.year : null;
    const legacyDay = input.legacyDay ?? input.totalDay ?? input.dayOfYear;
    const projection = LegacyProjectionEngine.projectLegacyOverflowDay(legacyDay, year);

    return {
      kind: 'legacy-overflow',
      year,
      totalDay: legacyDay,
      month: projection.solarDate.month,
      day: projection.solarDate.day,
      projection,
      solarDate: projection.solarDate
    };
  }

  function normalizeDateRef(input = {}) {
    const kind = input.kind || input.calendar || (Number.isInteger(input.legacyDay) ? 'legacy-overflow' : 'solar');
    if (kind === 'civil') return normalizeCivilDate(input);
    if (kind === 'legacy-overflow') return normalizeLegacyOverflowDate(input);
    if (kind === 'solar') return normalizeSolarDate(input);
    throw new RangeError(`Unsupported event date kind: ${kind}.`);
  }

  function normalizeRecurrence(value = 'NONE') {
    return RECURRENCE_TYPES.includes(value) ? value : 'NONE';
  }

  function normalizeCategory(value = 'history') {
    return EVENT_CATEGORIES.includes(value) ? value : 'history';
  }

  function normalizeEvent(input = {}) {
    if (!input.id) throw new Error('Event id is required.');

    const date = normalizeDateRef(input.date || input.dateRef || input);

    return {
      id: String(input.id),
      title: localizedText(input.title, String(input.id)),
      description: localizedText(input.description, ''),
      category: normalizeCategory(input.category),
      date,
      recurrence: normalizeRecurrence(input.recurrence),
      tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
      source: cleanSource(input.source),
      visibility: input.visibility || 'local',
      createdAt: input.createdAt || null,
      updatedAt: input.updatedAt || null
    };
  }

  function displayDate(event, language = 'ru') {
    const normalized = event.date ? event : normalizeEvent(event);
    const date = normalized.date;

    if (date.kind === 'civil') {
      const year = date.year ? `${date.year}-` : '';
      return `${year}${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    }

    return CalendarGrammar.dayPhrase(date.solarDate, language);
  }

  const api = Object.freeze({
    EVENT_CATEGORIES,
    RECURRENCE_TYPES,
    localizedText,
    normalizeDateRef,
    normalizeEvent,
    displayDate
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleEventCore = api;
})();
