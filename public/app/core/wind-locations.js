(() => {
  'use strict';
  const Weather = typeof require === 'function' ? require('./weather-provider.js') : globalThis.SolarCircleWeatherProvider;

  function chooseFavorites(favorites, ids = []) {
    const first = favorites.find(place => place.id === ids[0]) || favorites.find(place => place.id !== ids[1]);
    const second = favorites.find(place => place.id === ids[1] && place.id !== first?.id) || favorites.find(place => place.id !== first?.id);
    return [first || null, second || null];
  }

  function createController({ provider, current, favorites, selection, onChange, refreshCurrent }) {
    const records = new Map(), pending = new Map();
    let batchPending = false;
    function contexts() {
      const active = current();
      const activeKey = Weather.cacheKey(active.location);
      const places = chooseFavorites(favorites(), selection());
      return [{...active, slot:0, id:'current', current:true, key:Weather.cacheKey(active.location)}, ...places.map((place, i) => {
        const location = place ? {latitude:place.latitude, longitude:place.longitude, timezone:place.timezone, source:'saved-place'} : null;
        const key = Weather.cacheKey(location);
        return {slot:i + 1, id:place?.id || null, title:place?.title || '', location, key, current:false,
          weather:key&&key===activeKey?active.weather:records.get(key) || {status:key?'no-cache':'needs-location', location, value:null}};
      })];
    }
    function ensureCaches() {
      for (const context of contexts().slice(1)) {
        if (!context.key || records.has(context.key)) continue;
        const placeholder = {status:'loading', location:context.location, value:null};
        records.set(context.key, placeholder);
        provider.cached(context.location).catch(error => ({status:'error', value:null, location:context.location, error:String(error)})).then(record => {
          if (records.get(context.key) !== placeholder) return;
          records.set(context.key, record); onChange();
        });
      }
    }
    async function refreshContext(context) {
      if (!context?.key) return;
      if (pending.has(context.key)) return pending.get(context.key);
      const task = (async () => {
        if (context.current) return refreshCurrent();
        records.set(context.key, {...context.weather, status:'loading'});
        onChange();
        let record;
        try { record = await provider.refresh(context.location); }
        catch(error) { record = {...context.weather, status:context.weather?.value?'offline-cache':'error', error:String(error)}; }
        records.set(context.key, record);
        return record;
      })();
      pending.set(context.key, task);
      try { return await task; } finally { pending.delete(context.key); onChange(); }
    }
    async function refreshAll() {
      if (batchPending) return;
      batchPending = true; onChange();
      const selected = contexts(), visited = new Set();
      try {
        for (const context of selected) {
          if (!context.key || visited.has(context.key)) continue;
          visited.add(context.key);
          await refreshContext(context);
        }
      } finally { batchPending = false; onChange(); }
    }
    return Object.freeze({contexts, ensureCaches, refresh:slot => refreshContext(contexts()[slot]), refreshAll,
      get batchPending() { return batchPending; },
      resetCache() { records.clear(); }
    });
  }
  const api = Object.freeze({chooseFavorites, createController});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleWindLocations = api;
})();
