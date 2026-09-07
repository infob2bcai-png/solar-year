(() => {
  'use strict';

  const STORAGE_VERSION = '0.1.0';
  const ENVELOPE_SCHEMA = 'solar-circle.local-persistence';
  const DEFAULT_NAMESPACE = 'solar-circle';

  function storageKey(namespace, collection) {
    if (!collection || typeof collection !== 'string') throw new Error('Storage collection name is required.');
    return `${namespace || DEFAULT_NAMESPACE}:${collection}`;
  }

  function sourceMeta(overrides = {}) {
    return {
      type: overrides.type || 'local',
      name: overrides.name || 'memory-storage-adapter',
      persistence: overrides.persistence || 'memory',
      version: overrides.version || STORAGE_VERSION
    };
  }

  function envelope(value) {
    return {
      schema: ENVELOPE_SCHEMA,
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      value
    };
  }

  function serialize(value) {
    return JSON.stringify(envelope(value));
  }

  function deserialize(payload, fallback = null) {
    if (payload === null || payload === undefined || payload === '') return fallback;
    const parsed = JSON.parse(payload);
    if (parsed && parsed.schema === ENVELOPE_SCHEMA && Object.prototype.hasOwnProperty.call(parsed, 'value')) return parsed.value;
    return parsed;
  }

  function createMemoryAdapter(initial = {}, meta = {}) {
    const store = new Map(Object.entries(initial));
    const source = sourceMeta({ ...meta, name: meta.name || 'memory-storage-adapter', persistence: 'memory' });

    return Object.freeze({
      source,
      async getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      async setItem(key, value) {
        store.set(key, String(value));
      },
      async removeItem(key) {
        store.delete(key);
      },
      async keys(prefix = '') {
        return [...store.keys()].filter(key => key.startsWith(prefix));
      }
    });
  }

  function createBrowserLocalStorageAdapter(storage = globalThis.localStorage, meta = {}) {
    if (!storage) throw new Error('Browser localStorage is not available.');
    const source = sourceMeta({ ...meta, name: meta.name || 'browser-local-storage-adapter', persistence: 'localStorage' });

    return Object.freeze({
      source,
      async getItem(key) {
        return storage.getItem(key);
      },
      async setItem(key, value) {
        storage.setItem(key, String(value));
      },
      async removeItem(key) {
        storage.removeItem(key);
      },
      async keys(prefix = '') {
        const result = [];
        for (let index = 0; index < storage.length; index++) {
          const key = storage.key(index);
          if (key && key.startsWith(prefix)) result.push(key);
        }
        return result;
      }
    });
  }

  function createCapacitorPreferencesAdapter(preferences, meta = {}) {
    if (!preferences || typeof preferences.get !== 'function' || typeof preferences.set !== 'function') {
      throw new Error('Capacitor Preferences adapter requires get and set methods.');
    }
    const source = sourceMeta({ ...meta, name: meta.name || 'capacitor-preferences-adapter', persistence: 'capacitor-preferences' });

    return Object.freeze({
      source,
      async getItem(key) {
        const result = await preferences.get({ key });
        return result && typeof result.value === 'string' ? result.value : null;
      },
      async setItem(key, value) {
        await preferences.set({ key, value: String(value) });
      },
      async removeItem(key) {
        if (typeof preferences.remove === 'function') await preferences.remove({ key });
      },
      async keys(prefix = '') {
        if (typeof preferences.keys !== 'function') return [];
        const result = await preferences.keys();
        return (result.keys || []).filter(key => key.startsWith(prefix));
      }
    });
  }

  function detectedCapacitorPreferences() {
    return globalThis.Capacitor?.Plugins?.Preferences || null;
  }

  function createAutoAdapter(options = {}) {
    if (options.adapter) return options.adapter;
    if (options.preferences) return createCapacitorPreferencesAdapter(options.preferences, options.meta);
    const preferences = detectedCapacitorPreferences();
    if (preferences) return createCapacitorPreferencesAdapter(preferences, options.meta);
    if (typeof globalThis.localStorage !== 'undefined') return createBrowserLocalStorageAdapter(globalThis.localStorage, options.meta);
    return createMemoryAdapter({}, options.meta);
  }

  function createJsonStore(adapter = createAutoAdapter(), options = {}) {
    const namespace = options.namespace || DEFAULT_NAMESPACE;
    const source = adapter.source || sourceMeta();

    return Object.freeze({
      namespace,
      source,
      key(collection) {
        return storageKey(namespace, collection);
      },
      async load(collection, fallback = null) {
        return deserialize(await adapter.getItem(storageKey(namespace, collection)), fallback);
      },
      async save(collection, value) {
        await adapter.setItem(storageKey(namespace, collection), serialize(value));
        return value;
      },
      async remove(collection) {
        await adapter.removeItem(storageKey(namespace, collection));
      },
      async keys() {
        return adapter.keys(`${namespace}:`);
      }
    });
  }

  const api = Object.freeze({
    STORAGE_VERSION,
    ENVELOPE_SCHEMA,
    DEFAULT_NAMESPACE,
    storageKey,
    serialize,
    deserialize,
    createMemoryAdapter,
    createBrowserLocalStorageAdapter,
    createCapacitorPreferencesAdapter,
    createAutoAdapter,
    createJsonStore
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleLocalPersistenceCore = api;
})();
