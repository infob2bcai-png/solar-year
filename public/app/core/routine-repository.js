(() => {
  'use strict';

  const PersonalCore = typeof require === 'function'
    ? require('./personal-core.js')
    : globalThis.SolarCirclePersonalCore;
  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;
  const ReminderRepository = typeof require === 'function'
    ? require('./reminder-repository.js')
    : globalThis.SolarCircleReminderRepository;

  if (!PersonalCore) throw new Error('SolarCirclePersonalCore is required before RoutineRepository.');
  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before RoutineRepository.');
  if (!ReminderRepository) throw new Error('SolarCircleReminderRepository is required before RoutineRepository.');

  const REPOSITORY_VERSION = '0.1.0';
  const ROUTINES_COLLECTION = 'routines';
  const ROUTINE_KINDS = Object.freeze(['habit', 'training', 'recovery', 'ritual', 'task', 'work', 'rest']);
  const COMPLETION_STATUSES = Object.freeze(['planned', 'done', 'skipped']);

  function normalizeKind(value = 'habit') {
    return ROUTINE_KINDS.includes(value) ? value : 'habit';
  }

  function normalizeDuration(value = null) {
    if (value === null || value === undefined || value === '') return null;
    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes <= 0) return null;
    return Math.round(minutes);
  }

  function normalizeTarget(input = null) {
    if (!input || typeof input !== 'object') return null;
    const count = Number(input.count);
    return {
      count: Number.isFinite(count) && count > 0 ? count : null,
      unit: input.unit ? String(input.unit) : null
    };
  }

  function normalizeDateRef(input = null) {
    const fallback = { kind: 'civil', year: 1970, month: 1, day: 1 };
    return PersonalCore.normalizeDateRef(input || fallback);
  }

  function normalizeCompletion(input = {}) {
    return PersonalCore.normalizeCompletion(input);
  }

  function normalizeCompletions(completions = []) {
    if (!Array.isArray(completions)) return [];
    return completions.map(normalizeCompletion);
  }

  function normalizeRoutine(input = {}) {
    const base = PersonalCore.baseRecord(input, 'routine');
    const routine = {
      ...base,
      kind: normalizeKind(input.kind || input.routineKind),
      text: String(input.text || input.body || input.description || ''),
      dateRef: normalizeDateRef(input.dateRef || input.date || input.anchor),
      timeOfDay: ReminderRepository.normalizeTimeOfDay(input.timeOfDay || input.time || null),
      recurrence: ReminderRepository.normalizeRecurrence(input.recurrence || { scope: 'civil', frequency: 'daily' }),
      durationMinutes: normalizeDuration(input.durationMinutes || input.duration),
      target: normalizeTarget(input.target),
      enabled: input.enabled !== false,
      completions: normalizeCompletions(input.completions)
    };
    return PersonalCore.assertOfflineOnly(routine);
  }

  function normalizeRoutines(routines = []) {
    if (!Array.isArray(routines)) throw new TypeError('RoutineRepository routines must be an array.');
    return routines.map(normalizeRoutine);
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

  function completionMatchesDay(completion, query) {
    return sameCivilDay(completion.dateRef, query.civil) || sameSolarDay(completion.dateRef, query.solar);
  }

  function matchesDay(routine, query = {}) {
    const normalizedQuery = query?.civil || query?.solar ? query : ReminderRepository.normalizeQuery(query);
    return ReminderRepository.matchesDay({
      dateRef: routine.dateRef,
      recurrence: routine.recurrence,
      enabled: routine.enabled,
      deletedAt: routine.deletedAt
    }, normalizedQuery);
  }

  function sourceMeta(meta = {}) {
    return {
      type: meta.type || 'offline',
      name: meta.name || 'empty-routine-repository',
      persistence: meta.persistence || 'none',
      version: meta.version || REPOSITORY_VERSION
    };
  }

  function decorateRoutine(routine, query) {
    const completion = routine.completions.find(item => completionMatchesDay(item, query)) || null;
    return {
      ...routine,
      completion,
      todayStatus: completion?.status || 'planned',
      isDone: completion?.status === 'done'
    };
  }

  function queryResult(routines, query, source, hydrated = true) {
    const normalizedQuery = ReminderRepository.normalizeQuery(query);
    const value = routines
      .filter(routine => routine.enabled && !routine.deletedAt && matchesDay(routine, normalizedQuery))
      .map(routine => decorateRoutine(routine, normalizedQuery));
    return {
      status: hydrated ? 'ready' : 'stale',
      value,
      source,
      domain: 'routine',
      count: value.length,
      doneCount: value.filter(routine => routine.isDone).length,
      query: normalizedQuery
    };
  }

  function completionKey(dateRef) {
    if (dateRef.kind === 'civil') return `civil:${dateRef.year || '*'}-${dateRef.month}-${dateRef.day}`;
    return `solar:${dateRef.year || '*'}-${dateRef.totalDay || ((dateRef.month - 1) * 30 + dateRef.day)}`;
  }

  function createMemoryRepository(routines = [], meta = {}) {
    const source = sourceMeta({ name: 'memory-routine-repository', persistence: 'memory', ...meta });
    const normalizedRoutines = normalizeRoutines(routines);
    return Object.freeze({
      source,
      all() {
        return normalizedRoutines.slice();
      },
      queryDay(query = {}) {
        return queryResult(normalizedRoutines, query, source);
      }
    });
  }

  function createEmptyRepository(meta = {}) {
    return createMemoryRepository([], { name: 'empty-routine-repository', persistence: 'none', ...meta });
  }

  function createPersistentRepository(store = LocalPersistenceCore.createJsonStore(), meta = {}) {
    const collection = meta.collection || ROUTINES_COLLECTION;
    const source = sourceMeta({
      name: 'persistent-routine-repository',
      persistence: store.source?.persistence || 'unknown',
      ...meta
    });
    let routines = [];
    let hydrated = false;
    let lastError = null;

    function replace(next = []) {
      routines = normalizeRoutines(next);
      return routines.slice();
    }

    async function persist() {
      await store.save(collection, routines);
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
        return routines.slice();
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
      async saveAll(next = routines) {
        const saved = replace(next);
        await persist();
        hydrated = true;
        lastError = null;
        return saved;
      },
      async upsert(routine) {
        const normalized = normalizeRoutine(routine);
        const index = routines.findIndex(item => item.id === normalized.id);
        if (index >= 0) routines[index] = normalized;
        else routines.push(normalized);
        await persist();
        hydrated = true;
        lastError = null;
        return normalized;
      },
      async mark(id, completionInput = {}) {
        const index = routines.findIndex(item => item.id === String(id));
        if (index < 0) throw new Error(`Unknown routine: ${id}.`);
        const completion = normalizeCompletion(completionInput);
        const key = completionKey(completion.dateRef);
        const nextCompletions = routines[index].completions.filter(item => completionKey(item.dateRef) !== key);
        routines[index] = normalizeRoutine({
          ...routines[index],
          completions: [...nextCompletions, completion],
          updatedAt: new Date().toISOString()
        });
        await persist();
        hydrated = true;
        lastError = null;
        return routines[index];
      },
      async remove(id) {
        const value = String(id);
        const before = routines.length;
        routines = routines.filter(routine => routine.id !== value);
        if (routines.length !== before) await persist();
        return before - routines.length;
      },
      queryDay(query = {}) {
        return queryResult(routines, query, source, hydrated);
      }
    });

    return repository;
  }

  const EMPTY_REPOSITORY = createEmptyRepository();

  const api = Object.freeze({
    REPOSITORY_VERSION,
    ROUTINES_COLLECTION,
    ROUTINE_KINDS,
    COMPLETION_STATUSES,
    normalizeCompletion,
    normalizeCompletions,
    normalizeRoutine,
    normalizeRoutines,
    matchesDay,
    createEmptyRepository,
    createMemoryRepository,
    createPersistentRepository,
    empty: () => EMPTY_REPOSITORY
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleRoutineRepository = api;
})();
