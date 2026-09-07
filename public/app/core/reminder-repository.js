(() => {
  'use strict';

  const PersonalCore = typeof require === 'function'
    ? require('./personal-core.js')
    : globalThis.SolarCirclePersonalCore;
  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;

  if (!PersonalCore) throw new Error('SolarCirclePersonalCore is required before ReminderRepository.');
  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before ReminderRepository.');

  const REPOSITORY_VERSION = '0.1.0';
  const REMINDERS_COLLECTION = 'reminders';
  const RECURRENCE_SCOPES = Object.freeze(['none', 'civil', 'solar']);
  const RECURRENCE_FREQUENCIES = Object.freeze(['once', 'daily', 'weekly', 'monthly', 'yearly', 'custom']);
  const NOTIFICATION_STATUSES = Object.freeze(['not-scheduled', 'scheduled', 'permission-required', 'unavailable', 'no-time', 'error']);
  const CIVIL_WEEK_DAYS = 7;
  const SOLAR_WEEK_DAYS = 6;
  const CIVIL_MONTHS_IN_YEAR = 12;
  const SOLAR_MONTHS_IN_YEAR = 12;
  const SOLAR_DAYS_IN_YEAR = 360;
  const MS_PER_DAY = 86400000;

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('ReminderRepository query date must be valid.');
    return value;
  }

  function normalizeTimeOfDay(value = null) {
    if (value === null || value === undefined || value === '') return null;
    if (!/^\d{2}:\d{2}$/.test(String(value))) throw new RangeError('Reminder time must use HH:mm format.');
    const [hour, minute] = String(value).split(':').map(Number);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) throw new RangeError('Reminder time must be a valid HH:mm value.');
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function normalizeRecurrence(input = {}) {
    if (typeof input === 'string') {
      if (input === 'NONE') return { scope: 'none', frequency: 'once', interval: 1, until: null, count: null };
      if (input.startsWith('CIVIL_')) return normalizeRecurrence({ scope: 'civil', frequency: input.slice(6).toLowerCase() });
      if (input.startsWith('SOLAR_')) return normalizeRecurrence({ scope: 'solar', frequency: input.slice(6).toLowerCase() });
    }
    if (!input || typeof input !== 'object') input = {};

    const scope = RECURRENCE_SCOPES.includes(input.scope) ? input.scope : 'none';
    const frequency = RECURRENCE_FREQUENCIES.includes(input.frequency) ? input.frequency : (scope === 'none' ? 'once' : 'yearly');
    const interval = Number.isInteger(input.interval) && input.interval > 0 ? input.interval : 1;

    if (scope === 'none') return { scope: 'none', frequency: 'once', interval: 1, until: null, count: null };
    if (frequency === 'once') return { scope, frequency: scope === 'civil' ? 'yearly' : 'yearly', interval, until: input.until || null, count: input.count || null };

    return {
      scope,
      frequency,
      interval,
      until: input.until || null,
      count: Number.isInteger(input.count) && input.count > 0 ? input.count : null
    };
  }

  function normalizeReminder(input = {}) {
    const base = PersonalCore.baseRecord(input, 'reminder');
    const dateRef = PersonalCore.normalizeDateRef(input.dateRef || input.date || null);
    if (!dateRef) throw new Error('Reminder dateRef is required.');

    const reminder = {
      ...base,
      category: ['work','rest','habit','training'].includes(input.category) ? input.category : 'work',
      completions: Array.isArray(input.completions) ? input.completions.map(PersonalCore.normalizeCompletion) : [],
      text: String(input.text || input.body || ''),
      dateRef,
      timeOfDay: normalizeTimeOfDay(input.timeOfDay || input.time || null),
      recurrence: normalizeRecurrence(input.recurrence),
      enabled: input.enabled !== false,
      notification: normalizeNotification(input.notification)
    };
    return PersonalCore.assertOfflineOnly(reminder);
  }

  function normalizeNotification(input = {}) {
    const status = NOTIFICATION_STATUSES.includes(input?.status) ? input.status : 'not-scheduled';
    return {
      status,
      platformId: input?.platformId || null,
      scheduledAt: input?.scheduledAt || null,
      lastCheckedAt: input?.lastCheckedAt || null,
      lastError: input?.lastError || null
    };
  }

  function normalizeReminders(reminders = []) {
    if (!Array.isArray(reminders)) throw new TypeError('ReminderRepository reminders must be an array.');
    return reminders.map(normalizeReminder);
  }

  function normalizeQuery(input = {}) {
    const date = validDate(input.date || new Date());
    const civilInput = input.civil || {};
    return {
      date,
      civil: input.civil === null ? null : {
        ...civilInput,
        year: Number.isInteger(civilInput.year) ? civilInput.year : date.getFullYear(),
        month: Number.isInteger(civilInput.month) ? civilInput.month : date.getMonth() + 1,
        day: Number.isInteger(civilInput.day) ? civilInput.day : date.getDate()
      },
      solar: input.solar || null,
      location: input.location || null,
      language: input.language || 'ru'
    };
  }

  function sameCivilDay(dateRef, civil) {
    if (!civil || dateRef.kind !== 'civil') return false;
    if (dateRef.month !== civil.month || dateRef.day !== civil.day) return false;
    return dateRef.year === null || civil.year === undefined || dateRef.year === civil.year;
  }

  function sameSolarDay(dateRef, solar) {
    if (!solar || (dateRef.kind !== 'solar' && dateRef.kind !== 'legacy-overflow')) return false;
    if (dateRef.month !== solar.month || dateRef.day !== solar.day) return false;
    return dateRef.year === null || solar.year === undefined || dateRef.year === solar.year;
  }

  function civilDayNumber(value) {
    if (!Number.isInteger(value?.year) || !Number.isInteger(value.month) || !Number.isInteger(value.day)) return null;
    return Math.floor(Date.UTC(value.year, value.month - 1, value.day) / MS_PER_DAY);
  }

  function civilMonthNumber(value) {
    if (!Number.isInteger(value?.year) || !Number.isInteger(value.month)) return null;
    return value.year * CIVIL_MONTHS_IN_YEAR + value.month - 1;
  }

  function solarDayNumber(value) {
    if (!Number.isInteger(value?.year) || !Number.isInteger(value.totalDay)) return null;
    return value.year * SOLAR_DAYS_IN_YEAR + value.totalDay - 1;
  }

  function solarMonthNumber(value) {
    if (!Number.isInteger(value?.year) || !Number.isInteger(value.month)) return null;
    return value.year * SOLAR_MONTHS_IN_YEAR + value.month - 1;
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function civilOccurrenceIndex(dateRef, civil, recurrence) {
    if (dateRef.kind !== 'civil' || !civil) return null;
    const interval = recurrence.interval;
    const queryDay = civilDayNumber(civil);
    const anchorDay = civilDayNumber(dateRef);
    const queryMonth = civilMonthNumber(civil);
    const anchorMonth = civilMonthNumber(dateRef);
    const dayDelta = queryDay === null || anchorDay === null ? null : queryDay - anchorDay;
    const monthDelta = queryMonth === null || anchorMonth === null ? null : queryMonth - anchorMonth;
    const yearDelta = Number.isInteger(civil.year) && Number.isInteger(dateRef.year) ? civil.year - dateRef.year : null;

    if (recurrence.frequency === 'daily') {
      if (dayDelta === null) return interval === 1 ? 0 : null;
      return dayDelta >= 0 && dayDelta % interval === 0 ? dayDelta / interval : null;
    }

    if (recurrence.frequency === 'weekly') {
      if (dayDelta === null) return null;
      const span = CIVIL_WEEK_DAYS * interval;
      return dayDelta >= 0 && dayDelta % span === 0 ? dayDelta / span : null;
    }

    if (recurrence.frequency === 'monthly') {
      if (dateRef.day !== civil.day) return null;
      if (monthDelta === null) return interval === 1 ? 0 : null;
      return monthDelta >= 0 && monthDelta % interval === 0 ? monthDelta / interval : null;
    }

    if (recurrence.frequency === 'yearly') {
      if (dateRef.month !== civil.month || dateRef.day !== civil.day) return null;
      if (yearDelta === null) return interval === 1 ? 0 : null;
      return yearDelta >= 0 && yearDelta % interval === 0 ? yearDelta / interval : null;
    }

    return sameCivilDay(dateRef, civil) ? 0 : null;
  }

  function solarOccurrenceIndex(dateRef, solar, recurrence) {
    if (!solar || (dateRef.kind !== 'solar' && dateRef.kind !== 'legacy-overflow')) return null;
    const interval = recurrence.interval;
    const queryDay = solarDayNumber(solar);
    const anchorDay = solarDayNumber(dateRef);
    const queryMonth = solarMonthNumber(solar);
    const anchorMonth = solarMonthNumber(dateRef);
    const dayDelta = queryDay === null || anchorDay === null ? null : queryDay - anchorDay;
    const monthDelta = queryMonth === null || anchorMonth === null ? null : queryMonth - anchorMonth;
    const yearDelta = Number.isInteger(solar.year) && Number.isInteger(dateRef.year) ? solar.year - dateRef.year : null;

    if (recurrence.frequency === 'daily') {
      if (dayDelta === null) {
        if (!Number.isInteger(solar.totalDay) || !Number.isInteger(dateRef.totalDay)) return interval === 1 ? 0 : null;
        const offset = solar.totalDay - dateRef.totalDay;
        return interval === 1 || positiveModulo(offset, interval) === 0 ? 0 : null;
      }
      return dayDelta >= 0 && dayDelta % interval === 0 ? dayDelta / interval : null;
    }

    if (recurrence.frequency === 'weekly') {
      if (dayDelta === null) {
        if (!Number.isInteger(solar.totalDay) || !Number.isInteger(dateRef.totalDay)) return null;
        const offset = solar.totalDay - dateRef.totalDay;
        return positiveModulo(offset, SOLAR_WEEK_DAYS * interval) === 0 ? 0 : null;
      }
      const span = SOLAR_WEEK_DAYS * interval;
      return dayDelta >= 0 && dayDelta % span === 0 ? dayDelta / span : null;
    }

    if (recurrence.frequency === 'monthly') {
      if (dateRef.day !== solar.day) return null;
      if (monthDelta === null) return interval === 1 ? 0 : null;
      return monthDelta >= 0 && monthDelta % interval === 0 ? monthDelta / interval : null;
    }

    if (recurrence.frequency === 'yearly') {
      if (dateRef.month !== solar.month || dateRef.day !== solar.day) return null;
      if (yearDelta === null) return interval === 1 ? 0 : null;
      return yearDelta >= 0 && yearDelta % interval === 0 ? yearDelta / interval : null;
    }

    return sameSolarDay(dateRef, solar) ? 0 : null;
  }

  function normalizeUntil(until) {
    if (!until) return null;
    if (typeof until === 'string') {
      const value = new Date(until);
      return Number.isFinite(value.getTime()) ? { kind: 'civil-date', date: value } : null;
    }
    try {
      return PersonalCore.normalizeDateRef(until);
    } catch {
      return null;
    }
  }

  function compareScopedDate(scope, left, right) {
    if (!right) return null;
    if (scope === 'civil' && right.kind === 'civil') {
      const leftValue = civilDayNumber(left);
      const rightValue = civilDayNumber(right);
      return leftValue === null || rightValue === null ? null : leftValue - rightValue;
    }
    if (scope === 'solar' && (right.kind === 'solar' || right.kind === 'legacy-overflow')) {
      const leftValue = solarDayNumber(left);
      const rightValue = solarDayNumber(right);
      return leftValue === null || rightValue === null ? null : leftValue - rightValue;
    }
    return null;
  }

  function withinRecurrenceEnd(recurrence, query, occurrenceIndex) {
    if (Number.isInteger(recurrence.count) && Number.isInteger(occurrenceIndex) && occurrenceIndex >= recurrence.count) return false;
    const until = normalizeUntil(recurrence.until);
    if (!until) return true;
    if (until.kind === 'civil-date') {
      const endOfDay = new Date(until.date);
      endOfDay.setHours(23, 59, 59, 999);
      return query.date <= endOfDay;
    }
    const scopedQuery = recurrence.scope === 'civil' ? query.civil : query.solar;
    const comparison = compareScopedDate(recurrence.scope, scopedQuery, until);
    return comparison === null ? true : comparison <= 0;
  }

  function occurrenceIndex(reminder, query = {}) {
    query = query?.date && query?.civil ? query : normalizeQuery(query);
    const recurrence = reminder.recurrence || normalizeRecurrence();
    if (recurrence.scope === 'none' || recurrence.frequency === 'once') {
      return sameCivilDay(reminder.dateRef, query.civil) || sameSolarDay(reminder.dateRef, query.solar) ? 0 : null;
    }
    if (recurrence.scope === 'civil') return civilOccurrenceIndex(reminder.dateRef, query.civil, recurrence);
    if (recurrence.scope === 'solar') return solarOccurrenceIndex(reminder.dateRef, query.solar, recurrence);
    return null;
  }

  function matchesDay(reminder, query = {}) {
    const index = occurrenceIndex(reminder, query);
    return index !== null && withinRecurrenceEnd(reminder.recurrence, query, index);
  }

  function sourceMeta(meta = {}) {
    return {
      type: meta.type || 'offline',
      name: meta.name || 'empty-reminder-repository',
      persistence: meta.persistence || 'none',
      version: meta.version || REPOSITORY_VERSION
    };
  }

  function queryResult(reminders, query, source, hydrated = true) {
    const normalizedQuery = normalizeQuery(query);
    const value = reminders.filter(reminder => reminder.enabled && !reminder.deletedAt && matchesDay(reminder, normalizedQuery)).map(reminder=>{
      const completion=reminder.completions.find(item=>item.dateRef && (sameCivilDay(item.dateRef,normalizedQuery.civil)||sameSolarDay(item.dateRef,normalizedQuery.solar)));
      return {...reminder,todayStatus:completion?.status||'planned',isDone:completion?.status==='done'};
    });
    return {
      status: hydrated ? 'ready' : 'stale',
      value,
      source,
      domain: 'reminders',
      count: value.length,
      query: normalizedQuery
    };
  }

  function createMemoryRepository(reminders = [], meta = {}) {
    const source = sourceMeta({ name: 'memory-reminder-repository', persistence: 'memory', ...meta });
    const normalizedReminders = normalizeReminders(reminders);
    return Object.freeze({
      source,
      all() {
        return normalizedReminders.slice();
      },
      queryDay(query = {}) {
        return queryResult(normalizedReminders, query, source);
      }
    });
  }

  function createEmptyRepository(meta = {}) {
    return createMemoryRepository([], { name: 'empty-reminder-repository', persistence: 'none', ...meta });
  }

  function createPersistentRepository(store = LocalPersistenceCore.createJsonStore(), meta = {}) {
    const collection = meta.collection || REMINDERS_COLLECTION;
    const source = sourceMeta({
      name: 'persistent-reminder-repository',
      persistence: store.source?.persistence || 'unknown',
      ...meta
    });
    let reminders = [];
    let hydrated = false;
    let lastError = null;

    function replace(next = []) {
      reminders = normalizeReminders(next);
      return reminders.slice();
    }

    async function persist() {
      await store.save(collection, reminders);
    }

    const repository = Object.freeze({
      source,
      collection,
      get hydrated() {
        return hydrated;
      },
      get lastError() {
        return lastError;
      },
      all() {
        return reminders.slice();
      },
      async hydrate(fallback = []) {
        try {
          replace(await store.load(collection, fallback));
          hydrated = true;
          lastError = null;
          return repository;
        } catch (error) {
          lastError = error;
          throw error;
        }
      },
      async saveAll(next = reminders) {
        const saved = replace(next);
        await persist();
        hydrated = true;
        lastError = null;
        return saved;
      },
      async upsert(reminder) {
        const normalized = normalizeReminder(reminder);
        const index = reminders.findIndex(item => item.id === normalized.id);
        if (index >= 0) reminders[index] = normalized;
        else reminders.push(normalized);
        await persist();
        hydrated = true;
        lastError = null;
        return normalized;
      },
      async mark(id, input) {
        const existing=reminders.find(item=>item.id===String(id));
        if(!existing) throw new Error('Unknown reminder.');
        const completion=PersonalCore.normalizeCompletion(input),key=PersonalCore.completionKey(completion.dateRef);
        return repository.upsert({...existing,updatedAt:new Date().toISOString(),
          completions:[...existing.completions.filter(item=>PersonalCore.completionKey(item.dateRef)!==key),completion]});
      },
      async remove(id) {
        const value = String(id);
        const before = reminders.length;
        reminders = reminders.filter(reminder => reminder.id !== value);
        if (reminders.length !== before) await persist();
        return before - reminders.length;
      },
      queryDay(query = {}) {
        return queryResult(reminders, query, source, hydrated);
      }
    });

    return repository;
  }

  const EMPTY_REPOSITORY = createEmptyRepository();

  const api = Object.freeze({
    REPOSITORY_VERSION,
    REMINDERS_COLLECTION,
    RECURRENCE_SCOPES,
    RECURRENCE_FREQUENCIES,
    NOTIFICATION_STATUSES,
    normalizeTimeOfDay,
    normalizeRecurrence,
    normalizeNotification,
    normalizeReminder,
    normalizeReminders,
    normalizeQuery,
    occurrenceIndex,
    matchesDay,
    createEmptyRepository,
    createMemoryRepository,
    createPersistentRepository,
    empty: () => EMPTY_REPOSITORY
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleReminderRepository = api;
})();
