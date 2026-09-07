(() => {
  'use strict';
  const TimeCore = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;

  const NotesRepository = typeof require === 'function'
    ? require('./notes-repository.js')
    : globalThis.SolarCircleNotesRepository;
  const ReminderRepository = typeof require === 'function'
    ? require('./reminder-repository.js')
    : globalThis.SolarCircleReminderRepository;
  const RoutineRepository = typeof require === 'function'
    ? require('./routine-repository.js')
    : globalThis.SolarCircleRoutineRepository;
  const SavedPlacesRepository = typeof require === 'function'
    ? require('./saved-places-repository.js')
    : globalThis.SolarCircleSavedPlacesRepository;
  const WeatherProvider = typeof require === 'function'
    ? require('./weather-provider.js')
    : globalThis.SolarCircleWeatherProvider;

  if (!NotesRepository) throw new Error('SolarCircleNotesRepository is required before BackupCore.');
  if (!ReminderRepository) throw new Error('SolarCircleReminderRepository is required before BackupCore.');
  if (!RoutineRepository) throw new Error('SolarCircleRoutineRepository is required before BackupCore.');
  if (!SavedPlacesRepository) throw new Error('SolarCircleSavedPlacesRepository is required before BackupCore.');
  if (!WeatherProvider) throw new Error('SolarCircleWeatherProvider is required before BackupCore.');

  const MonthRepository = () => typeof require === 'function' ? require('./month-personalization-repository.js') : globalThis.SolarCircleMonthPersonalizationRepository;
  const emptyMonths = () => (typeof require === 'function' ? require('./month-personalization-core.js') : globalThis.SolarCircleMonthPersonalizationCore).emptyState();
  const BACKUP_VERSION = '0.2.0';
  const BACKUP_SCHEMA = 'solar-circle.local-backup';
  const RESTORE_JOURNAL = 'restore-journal';
  const COLLECTIONS = Object.freeze([
    ['settingsStore', 'settings', 'settings'],
    ['personalStore', NotesRepository.NOTES_COLLECTION, 'notes'],
    ['personalStore', ReminderRepository.REMINDERS_COLLECTION, 'reminders'],
    ['personalStore', RoutineRepository.ROUTINES_COLLECTION, 'routines'],
    ['placesStore', SavedPlacesRepository.SAVED_PLACES_COLLECTION, 'savedPlaces'],
    ['weatherStore', WeatherProvider.WEATHER_COLLECTION, 'weatherCache'],
    ['personalStore', 'month-personalization', 'monthPersonalization']
  ]);

  function createSnapshot(payload = {}, meta = {}) {
    return {
      schema: BACKUP_SCHEMA,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      meta: {
        app: 'Solar Year',
        mode: 'offline-export',
        ...meta
      },
      payload: {
        monthPersonalization: payload.monthPersonalization ?? emptyMonths(),
        settings: payload.settings && typeof payload.settings === 'object' && !Array.isArray(payload.settings) ? payload.settings : {},
        notes: Array.isArray(payload.notes) ? payload.notes : [],
        reminders: Array.isArray(payload.reminders) ? payload.reminders : [],
        routines: Array.isArray(payload.routines) ? payload.routines : [],
        savedPlaces: Array.isArray(payload.savedPlaces) ? payload.savedPlaces : [],
        weatherCache: payload.weatherCache && typeof payload.weatherCache === 'object' && !Array.isArray(payload.weatherCache) ? payload.weatherCache : {}
      }
    };
  }

  function validateSnapshot(snapshot = {}) {
    const issues = [];
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return { status: 'failed', issues: ['snapshot'] };
    if (snapshot.schema !== BACKUP_SCHEMA) issues.push('schema');
    if (!['0.1.0', BACKUP_VERSION].includes(snapshot.version)) issues.push('version');
    if (!snapshot.payload || typeof snapshot.payload !== 'object') issues.push('payload');
    if (snapshot.payload) {
      if (snapshot.version === BACKUP_VERSION || Object.hasOwn(snapshot.payload, 'monthPersonalization')) {
        try { MonthRepository().validateState(snapshot.payload.monthPersonalization); } catch { issues.push('monthPersonalization'); }
      }
      if (!Array.isArray(snapshot.payload.notes)) issues.push('notes');
      if (!Array.isArray(snapshot.payload.reminders)) issues.push('reminders');
      if (!Array.isArray(snapshot.payload.routines)) issues.push('routines');
      if (!Array.isArray(snapshot.payload.savedPlaces)) issues.push('savedPlaces');
      for (const name of ['settings', 'weatherCache']) {
        const value = snapshot.payload[name];
        if (!value || typeof value !== 'object' || Array.isArray(value)) issues.push(name);
      }
      for (const name of ['notes', 'reminders', 'routines', 'savedPlaces']) {
        const items = snapshot.payload[name];
        if (!Array.isArray(items)) continue;
        const ids = new Set();
        for (const item of items) {
          if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || ids.has(item.id)) issues.push(`${name}:id`);
          ids.add(item?.id);
        }
      }
      for (const record of Object.values(snapshot.payload.weatherCache || {})) {
        if (!record || typeof record !== 'object' || !WeatherProvider.cacheKey(record.location) || !record.value || typeof record.value !== 'object' || !Number.isFinite(Date.parse(record.fetchedAt))) {
          issues.push('weatherCache:record');
          continue;
        }
        for (const forecast of [record.forecast, record.value.forecast]) {
          if (forecast && (!Array.isArray(forecast.hourly) || !Array.isArray(forecast.daily))) issues.push('weatherCache:forecast');
        }
        if (record.source?.url) {
          try {
            const url = new URL(record.source.url);
            if (url.protocol !== 'https:' || url.username || url.password || !['open-meteo.com', 'api.open-meteo.com'].includes(url.hostname)) issues.push('weatherCache:source');
          } catch { issues.push('weatherCache:source'); }
        }
      }
      const settings = snapshot.payload.settings && typeof snapshot.payload.settings === 'object' ? snapshot.payload.settings : {};
      for (const [key, value] of Object.entries(settings)) {
        if (!key.startsWith('solar-') || typeof value !== 'string') issues.push(`settings:${key}`);
      }
      for (const [key, limit] of [['solar-location-latitude', 90], ['solar-location-longitude', 180]]) {
        if (settings[key] && (!Number.isFinite(Number(settings[key])) || Math.abs(Number(settings[key])) > limit)) issues.push(key);
      }
      for (const key of ['solar-location-timezone', 'solar-timezone-override']) {
        if (settings[key] && !TimeCore.validTimezone(settings[key])) issues.push(key);
      }
      for (const [key, values] of Object.entries({
        'solar-language': ['ru', 'en'],
        'solar-vyboria-enabled': ['true', 'false'],
        'solar-display-mode': ['dual', 'solar', 'civil'],
        'solar-theme-mode': ['dark', 'light', 'system', 'auto-sun'],
        'solar-location-mode': ['device', 'manual', 'gps'],
        'solar-timezone-mode': ['auto', 'manual'],
        'solar-wind-unit': ['m/s', 'km/h', 'kn'],
        'solar-wind-active-slot': ['0', '1', '2']
      })) {
        if (key in settings && !values.includes(settings[key])) issues.push(key);
      }
    }
    return {
      status: issues.length ? 'failed' : 'passed',
      issues
    };
  }

  function serializeSnapshot(snapshot) {
    const validation = validateSnapshot(snapshot);
    if (validation.status !== 'passed') throw new Error(`Invalid Solar Year backup: ${validation.issues.join(', ')}`);
    const text = JSON.stringify(snapshot, null, 2);
    if (new TextEncoder().encode(text).length > 16 * 1024 * 1024) throw new Error('Backup exceeds 16 MiB limit.');
    return text;
  }

  function parseSnapshot(text = '') {
    if (new TextEncoder().encode(String(text)).length > 16 * 1024 * 1024) throw new Error('Backup exceeds 16 MiB limit.');
    const snapshot = JSON.parse(String(text || '{}'));
    const validation = validateSnapshot(snapshot);
    if (validation.status !== 'passed') throw new Error(`Invalid Solar Year backup: ${validation.issues.join(', ')}`);
    return snapshot;
  }

  async function collectFromStores(stores = {}, repositories = {}, settings = {}) {
    await repositories.notesRepository?.whenSettled?.();
    await repositories.monthRepository?.whenSettled?.();
    const notes = repositories.notesRepository?.committedSnapshot?.() || repositories.notesRepository?.all?.() || await stores.personalStore?.load?.(NotesRepository.NOTES_COLLECTION, []) || [];
    const reminders = repositories.reminderRepository?.all?.() || await stores.personalStore?.load?.(ReminderRepository.REMINDERS_COLLECTION, []) || [];
    const routines = repositories.routineRepository?.all?.() || await stores.personalStore?.load?.(RoutineRepository.ROUTINES_COLLECTION, []) || [];
    const savedPlaces = repositories.savedPlacesRepository?.all?.() || await stores.placesStore?.load?.(SavedPlacesRepository.SAVED_PLACES_COLLECTION, []) || [];
    const weatherCache = await stores.weatherStore?.load?.(WeatherProvider.WEATHER_COLLECTION, {}) || {};
    const storedSettings = await stores.settingsStore?.load?.('settings', {}) || {};
    return createSnapshot({
      monthPersonalization: await stores.personalStore?.load?.('month-personalization', emptyMonths()) || emptyMonths(),
      settings: { ...storedSettings, ...settings },
      notes,
      reminders,
      routines,
      savedPlaces,
      weatherCache
    });
  }

  async function restoreToStores(snapshot, stores = {}) {
    const parsed = typeof snapshot === 'string' ? parseSnapshot(snapshot) : snapshot;
    const validation = validateSnapshot(parsed);
    if (validation.status !== 'passed') throw new Error(`Invalid Solar Year backup: ${validation.issues.join(', ')}`);
    const payload = { ...parsed.payload };
    if (payload.monthPersonalization) await MonthRepository().validateAssets(MonthRepository().validateState(payload.monthPersonalization));
    // Validate every collection before the first persistent write.
    NotesRepository.normalizeNotes(payload.notes);
    ReminderRepository.normalizeReminders(payload.reminders);
    RoutineRepository.normalizeRoutines(payload.routines);
    SavedPlacesRepository.normalizePlaces(payload.savedPlaces);
    for (const [name] of COLLECTIONS) {
      if (!stores[name]?.save || !stores[name]?.load || !stores[name]?.remove) throw new Error(`Missing backup store: ${name}`);
    }
    await recoverInterruptedRestore(stores);
    const before = {};
    for (const [name, collection, key] of COLLECTIONS) before[key] = await stores[name].load(collection, null);
    payload.monthPersonalization = payload.monthPersonalization
      ? MonthRepository().mergeRestore(before.monthPersonalization || emptyMonths(), payload.monthPersonalization)
      : (before.monthPersonalization || emptyMonths());
    await MonthRepository().validateAssets(MonthRepository().validateState(payload.monthPersonalization));
    await stores.settingsStore.save(RESTORE_JOURNAL, { schema: 'solar-year.restore-journal.v2', before });
    try {
      for (const [name, collection, key] of COLLECTIONS) await stores[name].save(collection, payload[key]);
      await stores.settingsStore.remove(RESTORE_JOURNAL);
    } catch (error) {
      await recoverInterruptedRestore(stores);
      throw error;
    }
    return {
      status: 'restored',
      counts: {
        notes: payload.notes?.length || 0,
        reminders: payload.reminders?.length || 0,
        routines: payload.routines?.length || 0,
        savedPlaces: payload.savedPlaces?.length || 0,
        weatherCache: Object.keys(payload.weatherCache || {}).length
      }
    };
  }

  async function recoverInterruptedRestore(stores) {
    const journal = await stores.settingsStore.load(RESTORE_JOURNAL, null);
    if (!journal) return false;
    if (!['solar-year.restore-journal.v1', 'solar-year.restore-journal.v2'].includes(journal.schema) || !journal.before) throw new Error('Invalid restore journal.');
    for (const [name, collection, key] of COLLECTIONS) {
      if (journal.schema === 'solar-year.restore-journal.v1' && key === 'monthPersonalization' && !(key in journal.before)) continue;
      if (!(key in journal.before)) throw new Error('Incomplete restore journal.');
      if (journal.before[key] === null) await stores[name].remove(collection);
      else await stores[name].save(collection, journal.before[key]);
    }
    await stores.settingsStore.remove(RESTORE_JOURNAL);
    return true;
  }

  const api = Object.freeze({
    BACKUP_VERSION,
    BACKUP_SCHEMA,
    createSnapshot,
    validateSnapshot,
    serializeSnapshot,
    parseSnapshot,
    collectFromStores,
    restoreToStores,
    recoverInterruptedRestore
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleBackupCore = api;
})();
