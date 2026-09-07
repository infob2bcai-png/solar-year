(() => {
  'use strict';

  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;

  if (!LocationCore) throw new Error('SolarCircleLocationCore is required before GeoMapCore.');

  const GEOMAP_CORE_VERSION = '0.1.0';
  const DEFAULT_VIEWPORT = Object.freeze({
    latitude: 0,
    longitude: 0,
    zoom: 1,
    bearing: 0,
    pitch: 0
  });
  const LAYER_DEFINITIONS = Object.freeze([
    { id: 'base', labelKey: 'mapLayerBase', ownerCore: 'GeoMapCore', status: 'ready' },
    { id: 'location', labelKey: 'mapLayerLocation', ownerCore: 'SavedPlaces', status: 'ready' },
    { id: 'weather', labelKey: 'mapLayerWeather', ownerCore: 'WeatherProvider', status: 'cache-backed' },
    { id: 'wind', labelKey: 'mapLayerWind', ownerCore: 'WindCore', status: 'cache-backed' },
    { id: 'stations', labelKey: 'mapLayerStations', ownerCore: 'StationCore', status: 'planned' }
  ]);
  const PROVIDER_BOUNDARY = Object.freeze({
    mapRuntime: 'not-loaded',
    directUiDependency: false,
    mapLibrePlanned: true
  });

  function numeric(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function validLocation(location = null) {
    if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null;
    return LocationCore.normalizeLocation(location);
  }

  function normalizeViewport(input = {}, fallback = DEFAULT_VIEWPORT) {
    return {
      latitude: numeric(input.latitude, fallback.latitude),
      longitude: numeric(input.longitude, fallback.longitude),
      zoom: Math.min(22, Math.max(0, numeric(input.zoom, fallback.zoom))),
      bearing: ((numeric(input.bearing, fallback.bearing) % 360) + 360) % 360,
      pitch: Math.min(85, Math.max(0, numeric(input.pitch, fallback.pitch)))
    };
  }

  function viewportForLocation(location = null, options = {}) {
    const normalized = validLocation(location);
    if (!normalized) return normalizeViewport(options.viewport || {});
    return normalizeViewport({
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      zoom: numeric(options.zoom, 8),
      bearing: numeric(options.bearing, 0),
      pitch: numeric(options.pitch, 0)
    });
  }

  function layerState(definition, context = {}) {
    const active = new Set(context.activeLayers || ['base', 'location', 'weather', 'wind']);
    let status = definition.status;
    if (definition.id === 'weather') status = context.weather?.value ? context.weather.status : 'empty';
    if (definition.id === 'wind') status = context.wind?.value ? context.wind.status : 'empty';
    return {
      ...definition,
      visible: active.has(definition.id),
      status
    };
  }

  function createMapState(context = {}) {
    const location = validLocation(context.location);
    const viewport = viewportForLocation(location, context);
    const layers = LAYER_DEFINITIONS.map(layer => layerState(layer, context));
    return {
      status: location ? 'ready' : 'needs-location',
      domain: 'geomap',
      viewport,
      location,
      layers,
      providerBoundary: PROVIDER_BOUNDARY,
      source: {
        type: 'local-core',
        name: 'geomap-core',
        version: GEOMAP_CORE_VERSION
      }
    };
  }

  const api = Object.freeze({
    GEOMAP_CORE_VERSION,
    DEFAULT_VIEWPORT,
    LAYER_DEFINITIONS,
    PROVIDER_BOUNDARY,
    normalizeViewport,
    viewportForLocation,
    createMapState
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleGeoMapCore = api;
})();
