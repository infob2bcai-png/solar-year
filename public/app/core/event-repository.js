(() => {
  'use strict';

  const EventCore = typeof require === 'function'
    ? require('./event-core.js')
    : globalThis.SolarCircleEventCore;
  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;

  if (!EventCore) throw new Error('SolarCircleEventCore is required before EventRepository.');
  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before EventRepository.');

  const REPOSITORY_VERSION = '0.1.0';
  const EVENTS_COLLECTION = 'events';

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('EventRepository query date must be valid.');
    return value;
  }

  function sourceMeta(overrides = {}) {
    return {
      type: overrides.type || 'offline',
      name: overrides.name || 'empty-event-repository',
      persistence: overrides.persistence || 'none',
      version: overrides.version || REPOSITORY_VERSION
    };
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

  function sameCivilDay(eventDate, queryCivil) {
    if (!queryCivil || eventDate.kind !== 'civil') return false;
    if (eventDate.month !== queryCivil.month || eventDate.day !== queryCivil.day) return false;
    return eventDate.year === null || queryCivil.year === undefined || eventDate.year === queryCivil.year;
  }

  function sameSolarDay(eventDate, querySolar) {
    if (!querySolar || (eventDate.kind !== 'solar' && eventDate.kind !== 'legacy-overflow')) return false;
    if (eventDate.month !== querySolar.month || eventDate.day !== querySolar.day) return false;
    return eventDate.year === null || querySolar.year === undefined || eventDate.year === querySolar.year;
  }

  function matchesDay(event, query) {
    if (event.recurrence === 'CIVIL_YEARLY') {
      return event.date.kind === 'civil' && query.civil && event.date.month === query.civil.month && event.date.day === query.civil.day
        && (event.date.year === null || query.civil.year >= event.date.year);
    }
    if (event.recurrence === 'CIVIL_MONTHLY') {
      return event.date.kind === 'civil' && query.civil && event.date.day === query.civil.day;
    }
    if (event.recurrence === 'SOLAR_YEARLY') {
      return (event.date.kind === 'solar' || event.date.kind === 'legacy-overflow') && query.solar && event.date.month === query.solar.month && event.date.day === query.solar.day;
    }
    if (event.recurrence === 'SOLAR_MONTHLY') {
      return (event.date.kind === 'solar' || event.date.kind === 'legacy-overflow') && query.solar && event.date.day === query.solar.day;
    }
    if (event.recurrence === 'SOLAR_WEEKLY') {
      return (event.date.kind === 'solar' || event.date.kind === 'legacy-overflow') && query.solar && Number.isInteger(event.date.totalDay) && Number.isInteger(query.solar.totalDay) && ((query.solar.totalDay - event.date.totalDay) % 6 + 6) % 6 === 0;
    }
    return sameCivilDay(event.date, query.civil) || sameSolarDay(event.date, query.solar);
  }

  function normalizeEvents(events = []) {
    if (!Array.isArray(events)) throw new TypeError('EventRepository events must be an array.');
    return events.map(EventCore.normalizeEvent);
  }

  function createEmptyRepository(meta = {}) {
    const source = sourceMeta(meta);
    return Object.freeze({
      source,
      all() {
        return [];
      },
      queryDay(input = {}) {
        const query = normalizeQuery(input);
        return {
          status: 'ready',
          value: [],
          source,
          domain: 'events',
          count: 0,
          query
        };
      }
    });
  }

  function createMemoryRepository(events = [], meta = {}) {
    const source = sourceMeta({ name: 'memory-event-repository', persistence: 'memory', ...meta });
    const normalizedEvents = normalizeEvents(events);
    return Object.freeze({
      source,
      all() {
        return normalizedEvents.slice();
      },
      queryDay(input = {}) {
        const query = normalizeQuery(input);
        const value = normalizedEvents.filter(event => matchesDay(event, query));
        return {
          status: 'ready',
          value,
          source,
          domain: 'events',
          count: value.length,
          query
        };
      }
    });
  }

  function createPackRepository(pack = {}, meta = {}) {
    const source = sourceMeta({
      type: 'offline',
      name: 'offline-event-pack',
      persistence: 'bundle',
      version: pack.version || REPOSITORY_VERSION,
      ...meta
    });
    const normalizedEvents = normalizeEvents(pack.events || []);
    const sources = Array.isArray(pack.sources) ? pack.sources.slice() : [];
    return Object.freeze({
      source: Object.freeze({ ...source, sourceCount: sources.length, eventCount: normalizedEvents.length }),
      packMeta: Object.freeze({
        schema: pack.schema || null,
        version: pack.version || null,
        builtAt: pack.builtAt || null,
        localeCoverage: Array.isArray(pack.localeCoverage) ? pack.localeCoverage.slice() : []
      }),
      sources,
      all() {
        return normalizedEvents.slice();
      },
      queryDay(input = {}) {
        const query = normalizeQuery(input);
        const value = normalizedEvents.filter(event => matchesDay(event, query));
        return {
          status: 'ready',
          value,
          source: this.source,
          domain: 'events',
          count: value.length,
          query
        };
      }
    });
  }

  function createPersistentRepository(store = LocalPersistenceCore.createJsonStore(), meta = {}) {
    const collection = meta.collection || EVENTS_COLLECTION;
    const source = sourceMeta({
      name: 'persistent-event-repository',
      persistence: store.source?.persistence || 'unknown',
      ...meta
    });
    let normalizedEvents = [];
    let hydrated = false;
    let lastError = null;

    function replace(events = []) {
      normalizedEvents = normalizeEvents(events);
      return normalizedEvents.slice();
    }

    async function persist() {
      await store.save(collection, normalizedEvents);
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
        return normalizedEvents.slice();
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
      async saveAll(events = normalizedEvents) {
        const saved = replace(events);
        await persist();
        hydrated = true;
        lastError = null;
        return saved;
      },
      async upsert(event) {
        const normalized = EventCore.normalizeEvent(event);
        const index = normalizedEvents.findIndex(item => item.id === normalized.id);
        if (index >= 0) normalizedEvents[index] = normalized;
        else normalizedEvents.push(normalized);
        await persist();
        hydrated = true;
        lastError = null;
        return normalized;
      },
      async remove(id) {
        const value = String(id);
        const before = normalizedEvents.length;
        normalizedEvents = normalizedEvents.filter(event => event.id !== value);
        if (normalizedEvents.length !== before) await persist();
        return before - normalizedEvents.length;
      },
      queryDay(input = {}) {
        const query = normalizeQuery(input);
        const value = normalizedEvents.filter(event => matchesDay(event, query));
        return {
          status: hydrated ? 'ready' : 'stale',
          value,
          source,
          domain: 'events',
          count: value.length,
          query
        };
      }
    });

    return repository;
  }

  const EMPTY_REPOSITORY = createEmptyRepository();

  function queryDay(repository = EMPTY_REPOSITORY, input = {}) {
    const repo = repository && typeof repository.queryDay === 'function' ? repository : EMPTY_REPOSITORY;
    return repo.queryDay(input);
  }

  const api = Object.freeze({
    REPOSITORY_VERSION,
    EVENTS_COLLECTION,
    createEmptyRepository,
    createMemoryRepository,
    createPackRepository,
    createPersistentRepository,
    normalizeQuery,
    queryDay,
    empty: () => EMPTY_REPOSITORY
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleEventRepository = api;
})();
