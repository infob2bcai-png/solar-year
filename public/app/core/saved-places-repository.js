(() => {
  'use strict';

  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;
  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;

  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before SavedPlacesRepository.');
  if (!LocationCore) throw new Error('SolarCircleLocationCore is required before SavedPlacesRepository.');

  const REPOSITORY_VERSION = '0.1.0';
  const SAVED_PLACES_COLLECTION = 'saved-places';
  const PLACE_KINDS = Object.freeze(['home', 'work', 'custom']);
  const MAX_FAVORITES = 5;

  function isoNow() {
    return new Date().toISOString();
  }

  function normalizeKind(value = 'custom') {
    return PLACE_KINDS.includes(value) ? value : 'custom';
  }

  function numeric(value) {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function normalizePlace(input = {}) {
    const latitude = numeric(input.latitude);
    const longitude = numeric(input.longitude);
    if (latitude === null || latitude < -90 || latitude > 90) throw new RangeError('Saved place latitude must be between -90 and 90.');
    if (longitude === null || longitude < -180 || longitude > 180) throw new RangeError('Saved place longitude must be between -180 and 180.');
    const now = isoNow();
    const title = String(input.title || input.name || input.id || 'Saved place').trim();
    const timezone = String(input.timezone || '').trim() || 'UTC';
    LocationCore.normalizeLocation({ latitude, longitude, timezone });
    return {
      id: String(input.id || `place-${Date.now().toString(36)}`),
      type: 'saved-place',
      title,
      kind: normalizeKind(input.kind),
      latitude,
      longitude,
      timezone,
      active: Boolean(input.active),
      favorite: Boolean(input.favorite),
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || input.createdAt || now,
      privacy: {
        visibility: 'private',
        syncPolicy: 'offline-only',
        containsPersonalData: true
      },
      source: {
        type: 'personal',
        name: 'saved-places-repository',
        version: REPOSITORY_VERSION
      }
    };
  }

  function normalizePlaces(places = []) {
    if (!Array.isArray(places)) throw new TypeError('Saved places must be an array.');
    const normalized = places.map(normalizePlace);
    if (normalized.filter(place => place.favorite).length > MAX_FAVORITES) throw new RangeError('At most 5 favorite places are allowed.');
    const activeIndex = normalized.findIndex(place => place.active);
    return normalized.map((place, index) => ({ ...place, active: activeIndex >= 0 ? index === activeIndex : false }));
  }

  function locationFromPlace(place = null, date = new Date()) {
    if (!place) return null;
    return LocationCore.normalizeLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
      date,
      source: 'saved-place'
    });
  }

  function sourceMeta(meta = {}) {
    return {
      type: meta.type || 'offline',
      name: meta.name || 'saved-places-repository',
      persistence: meta.persistence || 'none',
      version: meta.version || REPOSITORY_VERSION
    };
  }

  function createMemoryRepository(places = [], meta = {}) {
    const source = sourceMeta({ name: 'memory-saved-places-repository', persistence: 'memory', ...meta });
    let normalizedPlaces = normalizePlaces(places);
    const repository = Object.freeze({
      source,
      all() {
        return normalizedPlaces.slice();
      },
      active() {
        return normalizedPlaces.find(place => place.active) || null;
      },
      location(date = new Date()) {
        return locationFromPlace(repository.active(), date);
      }
    });
    return repository;
  }

  function createPersistentRepository(store = LocalPersistenceCore.createJsonStore(), meta = {}) {
    const collection = meta.collection || SAVED_PLACES_COLLECTION;
    const source = sourceMeta({
      name: 'persistent-saved-places-repository',
      persistence: store.source?.persistence || 'unknown',
      ...meta
    });
    let places = [];
    let hydrated = false;
    let lastError = null;

    function replace(next = []) {
      places = normalizePlaces(next);
      return places.slice();
    }

    async function persist() {
      await store.save(collection, places);
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
        return places.slice();
      },
      active() {
        return places.find(place => place.active) || null;
      },
      location(date = new Date()) {
        return locationFromPlace(repository.active(), date);
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
      async saveAll(next = places) {
        const saved = replace(next);
        await persist();
        hydrated = true;
        lastError = null;
        return saved;
      },
      async upsert(place) {
        const previous = places.find(item => item.id === String(place.id));
        const normalized = normalizePlace({...place, favorite:place.favorite ?? previous?.favorite ?? false});
        const index = places.findIndex(item => item.id === normalized.id);
        const next = index >= 0
          ? places.map(item => item.id === normalized.id ? normalized : item)
          : [...places, normalized];
        places = normalizePlaces(normalized.active ? next.map(item => ({ ...item, active: item.id === normalized.id })) : next);
        await persist();
        hydrated = true;
        lastError = null;
        return places.find(item => item.id === normalized.id);
      },
      async setActive(id) {
        const value = String(id);
        if (!places.some(place => place.id === value)) throw new Error(`Unknown saved place: ${id}.`);
        places = places.map(place => ({ ...place, active: place.id === value, updatedAt: place.id === value ? isoNow() : place.updatedAt }));
        await persist();
        hydrated = true;
        return repository.active();
      },
      async remove(id) {
        const value = String(id);
        const before = places.length;
        places = normalizePlaces(places.filter(place => place.id !== value));
        if (places.length !== before) await persist();
        return before - places.length;
      }
    });

    return repository;
  }

  const api = Object.freeze({
    REPOSITORY_VERSION,
    SAVED_PLACES_COLLECTION,
    PLACE_KINDS,
    MAX_FAVORITES,
    normalizePlace,
    normalizePlaces,
    locationFromPlace,
    createMemoryRepository,
    createPersistentRepository
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleSavedPlacesRepository = api;
})();
