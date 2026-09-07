(() => {
  'use strict';

  const PersonalCore = typeof require === 'function'
    ? require('./personal-core.js')
    : globalThis.SolarCirclePersonalCore;
  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;

  if (!PersonalCore) throw new Error('SolarCirclePersonalCore is required before NotesRepository.');
  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before NotesRepository.');

  const REPOSITORY_VERSION = '0.1.0';
  const NOTES_COLLECTION = 'notes';

  function normalizeNote(input = {}) {
    const base = PersonalCore.baseRecord(input, 'note');
    const text = typeof input.text === 'string' ? input.text : input.body || '';
    const dateRefs = PersonalCore.normalizeDateRefs(input.dateRefs || input.dateRef || input.date || []);
    const note = {
      ...base,
      text: String(text),
      dateRefs,
      pinned: Boolean(input.pinned)
    };
    return PersonalCore.assertOfflineOnly(note);
  }

  function normalizeNotes(notes = []) {
    if (!Array.isArray(notes)) throw new TypeError('NotesRepository notes must be an array.');
    return notes.map(normalizeNote);
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

  function matchesDay(note, query = {}) {
    return note.dateRefs.some(dateRef => sameCivilDay(dateRef, query.civil) || sameSolarDay(dateRef, query.solar));
  }

  function sourceMeta(meta = {}) {
    return {
      type: meta.type || 'offline',
      name: meta.name || 'empty-notes-repository',
      persistence: meta.persistence || 'none',
      version: meta.version || REPOSITORY_VERSION
    };
  }

  function queryResult(notes, query, source, hydrated = true) {
    const value = notes.filter(note => !note.deletedAt && matchesDay(note, query));
    return {
      status: hydrated ? 'ready' : 'stale',
      value,
      source,
      domain: 'notes',
      count: value.length,
      query
    };
  }

  function createMemoryRepository(notes = [], meta = {}) {
    const source = sourceMeta({ name: 'memory-notes-repository', persistence: 'memory', ...meta });
    const normalizedNotes = normalizeNotes(notes);
    return Object.freeze({
      source,
      all() {
        return normalizedNotes.slice();
      },
      queryDay(query = {}) {
        return queryResult(normalizedNotes, query, source);
      }
    });
  }

  function createEmptyRepository(meta = {}) {
    return createMemoryRepository([], { name: 'empty-notes-repository', persistence: 'none', ...meta });
  }

  function createPersistentRepository(store = LocalPersistenceCore.createJsonStore(), meta = {}) {
    const collection = meta.collection || NOTES_COLLECTION;
    const source = sourceMeta({
      name: 'persistent-notes-repository',
      persistence: store.source?.persistence || 'unknown',
      ...meta
    });
    let notes = [];
    let hydrated = false;
    let lastError = null;
    let queue = Promise.resolve();
    const clone = value => JSON.parse(JSON.stringify(value));
    const enqueue = operation => {
      const result = queue.then(operation);
      queue = result.catch(() => {});
      return result.catch(error => { lastError = error; throw error; });
    };

    function replace(next = []) {
      notes = normalizeNotes(next);
      return notes.slice();
    }

    async function commit(next) {
      const normalized = normalizeNotes(next);
      await store.save(collection, normalized);
      notes = clone(normalized);
      hydrated = true;
      lastError = null;
      return clone(notes);
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
        return clone(notes);
      },
      committedSnapshot() {
        if (!hydrated) throw new Error('Notes are not hydrated.');
        return clone(notes);
      },
      whenSettled() { return queue; },
      async hydrate(fallback = []) {
        return enqueue(async () => {
          hydrated = false;
          replace(await store.load(collection, fallback));
          hydrated = true;
          lastError = null;
          return repository;
        });
      },
      async saveAll(next = notes) {
        const snapshot = clone(next);
        return enqueue(() => commit(snapshot));
      },
      async upsert(note) {
        const normalized = normalizeNote(note);
        return enqueue(async () => {
          const next = clone(notes), index = next.findIndex(item => item.id === normalized.id);
          if (index >= 0) next[index] = normalized;
          else next.push(normalized);
          await commit(next);
          return clone(normalized);
        });
      },
      async remove(id) {
        const value = String(id);
        return enqueue(async () => {
          const next = notes.filter(note => note.id !== value), removed = notes.length - next.length;
          if (removed) await commit(next);
          return removed;
        });
      },
      queryDay(query = {}) {
        return queryResult(clone(notes), query, source, hydrated);
      }
    });

    return repository;
  }

  const EMPTY_REPOSITORY = createEmptyRepository();

  const api = Object.freeze({
    REPOSITORY_VERSION,
    NOTES_COLLECTION,
    normalizeNote,
    normalizeNotes,
    createEmptyRepository,
    createMemoryRepository,
    createPersistentRepository,
    empty: () => EMPTY_REPOSITORY
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleNotesRepository = api;
})();
