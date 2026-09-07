(() => {
  'use strict';

  const SEARCH_VERSION = '0.1.0';
  const DEFAULT_LIMIT = 40;

  function localized(value, language = 'ru', fallback = '') {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value[language] || value.ru || value.en || fallback;
    return fallback;
  }

  function norm(value) {
    return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function scoreText(query, text) {
    const haystack = norm(text);
    const needle = norm(query);
    if (!needle || !haystack) return 0;
    if (haystack === needle) return 100;
    if (haystack.startsWith(needle)) return 75;
    if (haystack.includes(needle)) return 45;
    const terms = needle.split(' ').filter(Boolean);
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 10 : 0), 0);
  }

  function eventDateMeta(event = {}) {
    const date = event.date || {};
    if (date.kind === 'civil') return `civil ${date.month}/${date.day}${date.year ? `/${date.year}` : ''}`;
    if (date.kind === 'solar' || date.kind === 'legacy-overflow') return `solar ${date.totalDay || `${date.month}/${date.day}`}`;
    return '';
  }

  function pushResult(results, query, item) {
    const text = [item.title, item.subtitle, item.meta, item.searchText].filter(Boolean).join(' ');
    const score = scoreText(query, text);
    if (score > 0) results.push({ ...item, score });
  }

  function repositoryItems(type, repository, language, mapper) {
    if (!repository || typeof repository.all !== 'function') return [];
    return repository.all().map(item => mapper(item, language));
  }

  function sourceItems(pack = {}, language = 'ru') {
    return (pack.sources || []).map(source => ({
      type: 'source',
      id: source.id || source.name,
      title: source.name || source.id,
      subtitle: source.license || '',
      meta: source.url || '',
      searchText: `${source.type || ''} ${source.rights?.mode || ''}`,
      ref: { sourceId: source.id || null }
    }));
  }

  function weatherItems(weather = null, wind = null, language = 'ru') {
    const items = [];
    if (weather?.value) {
      items.push({
        type: 'weather',
        id: 'weather-current',
        title: language === 'en' ? 'Weather' : 'Погода',
        subtitle: weather.value.weatherLabel || '',
        meta: `${Math.round(weather.value.temperature)}${weather.value.units?.temperature || '°C'}`,
        searchText: `${weather.status || ''} Open-Meteo`,
        ref: { route: 'weather' }
      });
    }
    if (wind?.value) {
      items.push({
        type: 'wind',
        id: 'wind-current',
        title: language === 'en' ? 'Wind' : 'Ветер',
        subtitle: wind.value.compass || '',
        meta: `${Math.round(wind.value.speed)} ${wind.value.unit}`,
        searchText: `${wind.status || ''} Open-Meteo`,
        ref: { route: 'wind' }
      });
    }
    return items;
  }

  function search(query, context = {}, options = {}) {
    const language = options.language || context.language || 'ru';
    const limit = Number.isInteger(options.limit) ? options.limit : DEFAULT_LIMIT;
    const results = [];
    const events = repositoryItems('event', context.eventRepository, language, event => ({
      type: 'event',
      id: event.id,
      title: localized(event.title, language, event.id),
      subtitle: localized(event.description, language, ''),
      meta: eventDateMeta(event),
      searchText: `${event.category || ''} ${event.source?.name || event.sourceId || ''}`,
      ref: { date: event.date || null }
    }));
    const notes = repositoryItems('note', context.notesRepository, language, note => ({
      type: 'note',
      id: note.id,
      title: localized(note.title, language, note.id),
      subtitle: note.text || '',
      meta: (note.dateRefs || []).map(ref => ref.kind).join(', '),
      ref: { dateRefs: note.dateRefs || [] }
    }));
    const reminders = repositoryItems('reminder', context.reminderRepository, language, reminder => ({
      type: 'reminder',
      id: reminder.id,
      title: localized(reminder.title, language, reminder.id),
      subtitle: reminder.text || '',
      meta: [reminder.timeOfDay, reminder.recurrence?.frequency].filter(Boolean).join(' · '),
      ref: { dateRef: reminder.dateRef || null }
    }));
    const routine = repositoryItems('routine', context.routineRepository, language, item => ({
      type: 'routine',
      id: item.id,
      title: localized(item.title, language, item.id),
      subtitle: item.text || '',
      meta: [item.kind, item.timeOfDay].filter(Boolean).join(' · '),
      ref: { dateRef: item.dateRef || null }
    }));
    const places = repositoryItems('place', context.savedPlacesRepository, language, place => ({
      type: 'place',
      id: place.id,
      title: place.title,
      subtitle: place.timezone || '',
      meta: `${place.latitude}, ${place.longitude}`,
      searchText: place.kind || '',
      ref: { placeId: place.id }
    }));

    [
      ...events,
      ...notes,
      ...reminders,
      ...routine,
      ...places,
      ...sourceItems(context.offlineEventPack, language),
      ...weatherItems(context.weather, context.wind, language)
    ].forEach(item => pushResult(results, query, item));

    return {
      status: norm(query) ? 'ready' : 'empty-query',
      domain: 'search',
      query: String(query || ''),
      count: results.length,
      value: results
        .sort((left, right) => right.score - left.score || left.type.localeCompare(right.type) || left.title.localeCompare(right.title))
        .slice(0, Math.max(0, limit)),
      source: {
        type: 'local-index',
        name: 'global-search',
        version: SEARCH_VERSION
      }
    };
  }

  const api = Object.freeze({
    SEARCH_VERSION,
    DEFAULT_LIMIT,
    localized,
    scoreText,
    search
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleGlobalSearch = api;
})();
