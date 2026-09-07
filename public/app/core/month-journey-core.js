(() => {
  'use strict';

  const Navigation = typeof require === 'function'
    ? require('./calendar-navigation.js') : globalThis.SolarCircleCalendarNavigation;
  const RULE_VERSION = 'vyboria-month-v2';
  const invisible = /[\p{White_Space}\p{Default_Ignorable_Code_Point}\p{Cc}]/gu;
  const templateLines = new Set([
    '\u041c\u043e\u044f \u0446\u0435\u043b\u044c \u043d\u0430 \u043c\u0435\u0441\u044f\u0446:',
    '\u0421\u0435\u0433\u043e\u0434\u043d\u044f\u0448\u043d\u0438\u0439 \u0448\u0430\u0433:',
    '\u0427\u0442\u043e \u0432\u044b\u0431\u0438\u0440\u0430\u044e \u0438\u043b\u0438 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u0438\u0440\u0443\u044e:',
    'My goal for the month:', "Today's step:", 'What I choose or adjust:'
  ].map(line => line.replace(invisible, '')));

  function integer(value, min, max) {
    if (!Number.isInteger(value) || value < min || value > max) throw new RangeError('Invalid solar date field.');
    return value;
  }

  function journeyKey(solarYear, monthId) {
    return `${integer(solarYear, 1, 3000)}:${integer(monthId, 1, 12)}`;
  }

  function parseJourneyKey(key) {
    if (typeof key !== 'string' || !/^\d{1,4}:\d{1,2}$/.test(key)) throw new TypeError('Invalid journey key.');
    const [solarYear, monthId] = key.split(':').map(Number);
    if (journeyKey(solarYear, monthId) !== key) throw new TypeError('Noncanonical journey key.');
    return { solarYear, monthId };
  }

  function isoTime(value) {
    if (typeof value !== 'string' || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) {
      throw new TypeError('Expected a canonical UTC ISO timestamp.');
    }
    return value;
  }

  function createJourney(solarYear, monthId, now) {
    const key = journeyKey(solarYear, monthId);
    isoTime(now);
    return { key, solarYear, monthId, days: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, detailsViewedAt: null })),
      startedAt: now, updatedAt: now };
  }

  function validateJourney(journey) {
    if (!journey || journeyKey(journey.solarYear, journey.monthId) !== journey.key) throw new TypeError('Journey identity mismatch.');
    isoTime(journey.startedAt);
    isoTime(journey.updatedAt);
    if (!Array.isArray(journey.days) || journey.days.length !== 30) throw new TypeError('Expected 30 journey days.');
    const seen = new Set();
    for (const item of journey.days) {
      integer(item.day, 1, 30);
      if (seen.has(item.day)) throw new TypeError('Duplicate journey day.');
      seen.add(item.day);
      if (item.detailsViewedAt !== null) isoTime(item.detailsViewedAt);
    }
    return journey;
  }

  function hasUserBody(text) {
    if (typeof text !== 'string') return false;
    return text.split(/\r\n|[\n\r\u0085\u2028\u2029]/u).some(line => {
      const visible = line.normalize('NFC').replace(invisible, '');
      return visible.length > 0 && !templateLines.has(visible);
    });
  }

  function qualifyingSolarRef(note) {
    if (!note || note.type !== 'note' || typeof note.id !== 'string' || !note.id.trim() || note.deletedAt
      || note.source?.type !== 'personal' || !hasUserBody(note.text) || !Array.isArray(note.dateRefs)) return null;
    const refs = new Map();
    for (const ref of note.dateRefs) {
      if (ref?.kind === 'civil') continue;
      if (ref?.kind !== 'solar') return null;
      try {
        const key = journeyKey(ref.year, ref.month);
        integer(ref.day, 1, 30);
        if (ref.totalDay !== (ref.month - 1) * 30 + ref.day) return null;
        refs.set(`${key}:${ref.day}`, ref);
      } catch { return null; }
    }
    return refs.size === 1 ? refs.values().next().value : null;
  }

  // The repository must supply an acknowledged snapshot, never its optimistic working array.
  function deriveJourney(journey, committedNotes) {
    validateJourney(journey);
    if (!Array.isArray(committedNotes)) throw new TypeError('Committed notes snapshot required.');
    const notesByDay = Array.from({ length: 30 }, () => new Set());
    for (const note of committedNotes) {
      const ref = qualifyingSolarRef(note);
      if (ref && ref.year === journey.solarYear && ref.month === journey.monthId) notesByDay[ref.day - 1].add(note.id);
    }
    const days = journey.days.slice().sort((a, b) => a.day - b.day).map(item => {
      const qualifyingNoteIds = [...notesByDay[item.day - 1]].sort();
      const detailsViewed = item.detailsViewedAt !== null;
      const hasUserNote = qualifyingNoteIds.length > 0;
      return { day: item.day, detailsViewed, qualifyingNoteIds, hasUserNote, complete: detailsViewed && hasUserNote };
    });
    const phases = Array.from({ length: 5 }, (_, index) => ({ index,
      names: { ru: Navigation.journey({ day: index * 6 + 1 }, 'ru').phase,
        en: Navigation.journey({ day: index * 6 + 1 }, 'en').phase },
      completeCount: days.slice(index * 6, index * 6 + 6).filter(day => day.complete).length }));
    const completeCount = days.filter(day => day.complete).length;
    return { key: journey.key, days, phases, completeCount,
      viewedCount: days.filter(day => day.detailsViewed).length,
      notedCount: days.filter(day => day.hasUserNote).length, eligible: completeCount === 30 };
  }

  const api = Object.freeze({ RULE_VERSION, integer, journeyKey, parseJourneyKey, isoTime,
    createJourney, validateJourney, hasUserBody, qualifyingSolarRef, deriveJourney });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleMonthJourneyCore = api;
})();
