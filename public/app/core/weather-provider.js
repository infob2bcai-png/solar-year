(() => {
  'use strict';

  const LocalPersistenceCore = typeof require === 'function'
    ? require('./local-persistence-core.js')
    : globalThis.SolarCircleLocalPersistenceCore;
  const LocationCore = typeof require === 'function'
    ? require('./location-core.js')
    : globalThis.SolarCircleLocationCore;

  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before WeatherProvider.');
  if (!LocationCore) throw new Error('SolarCircleLocationCore is required before WeatherProvider.');

  const PROVIDER_VERSION = '0.1.0';
  const WEATHER_COLLECTION = 'weather-cache';
  const DEFAULT_MAX_AGE_MS = 3 * 60 * 60 * 1000;
  const DEFAULT_FORECAST_DAYS = 7;
  const CURRENT_VARIABLES = Object.freeze([
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'cloud_cover',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m'
  ]);
  const HOURLY_VARIABLES = Object.freeze([
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'is_day',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m'
  ]);
  const DAILY_VARIABLES = Object.freeze([
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
    'sunrise',
    'sunset'
  ]);
  const OPEN_METEO_ATTRIBUTION = Object.freeze({
    name: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    license: 'CC BY 4.0',
    docs: 'https://open-meteo.com/en/docs'
  });

  const WEATHER_LABELS = Object.freeze({
    0: { ru: 'Ясно', en: 'Clear sky' },
    1: { ru: 'Преимущественно ясно', en: 'Mainly clear' },
    2: { ru: 'Переменная облачность', en: 'Partly cloudy' },
    3: { ru: 'Пасмурно', en: 'Overcast' },
    45: { ru: 'Туман', en: 'Fog' },
    48: { ru: 'Инейный туман', en: 'Depositing rime fog' },
    51: { ru: 'Слабая морось', en: 'Light drizzle' },
    53: { ru: 'Морось', en: 'Drizzle' },
    55: { ru: 'Сильная морось', en: 'Dense drizzle' },
    61: { ru: 'Слабый дождь', en: 'Slight rain' },
    63: { ru: 'Дождь', en: 'Rain' },
    65: { ru: 'Сильный дождь', en: 'Heavy rain' },
    71: { ru: 'Слабый снег', en: 'Slight snow' },
    73: { ru: 'Снег', en: 'Snow' },
    75: { ru: 'Сильный снег', en: 'Heavy snow' },
    80: { ru: 'Ливень', en: 'Rain showers' },
    81: { ru: 'Сильный ливень', en: 'Heavy rain showers' },
    82: { ru: 'Очень сильный ливень', en: 'Violent rain showers' },
    95: { ru: 'Гроза', en: 'Thunderstorm' }
  });

  function validDate(date = new Date()) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('WeatherProvider date must be valid.');
    return value;
  }

  function validLocation(location = null) {
    if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null;
    const normalized = LocationCore.normalizeLocation(location);
    if (!Number.isFinite(normalized.latitude) || !Number.isFinite(normalized.longitude)) return null;
    return normalized;
  }

  function rounded(value) {
    return Math.round(value * 10000) / 10000;
  }

  function cacheKey(location) {
    const normalized = validLocation(location);
    if (!normalized) return null;
    return `${normalized.latitude},${normalized.longitude},${normalized.timezone || 'UTC'}`;
  }

  function numeric(value) {
    return Number.isFinite(value) ? value : null;
  }

  function boolDay(value) {
    return typeof value === 'number' ? value === 1 : null;
  }

  function unit(units, name, fallback) {
    return units?.[name] || fallback;
  }

  function seriesAt(series, index) {
    return Array.isArray(series) ? series[index] : undefined;
  }

  function boundedDays(value) {
    const days = Number.isInteger(value) ? value : DEFAULT_FORECAST_DAYS;
    return Math.min(16, Math.max(1, days));
  }

  function endpoint(location, options = {}) {
    const normalized = validLocation(location);
    if (!normalized) return null;
    const params = new URLSearchParams({
      latitude: String(normalized.latitude),
      longitude: String(normalized.longitude),
      current: CURRENT_VARIABLES.join(','),
      hourly: HOURLY_VARIABLES.join(','),
      daily: DAILY_VARIABLES.join(','),
      forecast_days: String(boundedDays(options.forecastDays)),
      timezone: normalized.timezone || 'auto'
    });
    return `https://api.open-meteo.com/v1/forecast?${params}`;
  }

  function sourceMeta(extra = {}) {
    return {
      type: 'network-cache',
      name: 'open-meteo-weather-provider',
      provider: OPEN_METEO_ATTRIBUTION,
      version: PROVIDER_VERSION,
      ...extra
    };
  }

  function labelForCode(code, language = 'ru') {
    const value = WEATHER_LABELS[code] || { ru: 'Погода', en: 'Weather' };
    return value[language] || value.ru;
  }

  function normalizeHourlyForecast(payload = {}, limit = DEFAULT_FORECAST_DAYS * 24) {
    const hourly = payload.hourly || {};
    const units = payload.hourly_units || {};
    const times = Array.isArray(hourly.time) ? hourly.time : [];
    return times.slice(0, Math.max(0, limit)).map((time, index) => {
      const code = numeric(seriesAt(hourly.weather_code, index));
      return {
        time,
        temperature: numeric(seriesAt(hourly.temperature_2m, index)),
        apparentTemperature: numeric(seriesAt(hourly.apparent_temperature, index)),
        humidity: numeric(seriesAt(hourly.relative_humidity_2m, index)),
        precipitationProbability: numeric(seriesAt(hourly.precipitation_probability, index)),
        precipitation: numeric(seriesAt(hourly.precipitation, index)),
        weatherCode: code,
        weatherLabel: labelForCode(code),
        isDay: boolDay(seriesAt(hourly.is_day, index)),
        windSpeed: numeric(seriesAt(hourly.wind_speed_10m, index)),
        windDirection: numeric(seriesAt(hourly.wind_direction_10m, index)),
        windGust: numeric(seriesAt(hourly.wind_gusts_10m, index)),
        units: {
          temperature: unit(units, 'temperature_2m', '°C'),
          windSpeed: unit(units, 'wind_speed_10m', 'km/h'),
          windGust: unit(units, 'wind_gusts_10m', unit(units, 'wind_speed_10m', 'km/h')),
          precipitation: unit(units, 'precipitation', 'mm'),
          precipitationProbability: unit(units, 'precipitation_probability', '%'),
          humidity: unit(units, 'relative_humidity_2m', '%')
        }
      };
    });
  }

  function normalizeDailyForecast(payload = {}, limit = DEFAULT_FORECAST_DAYS) {
    const daily = payload.daily || {};
    const units = payload.daily_units || {};
    const times = Array.isArray(daily.time) ? daily.time : [];
    return times.slice(0, Math.max(0, limit)).map((date, index) => {
      const code = numeric(seriesAt(daily.weather_code, index));
      return {
        date,
        weatherCode: code,
        weatherLabel: labelForCode(code),
        temperatureMax: numeric(seriesAt(daily.temperature_2m_max, index)),
        temperatureMin: numeric(seriesAt(daily.temperature_2m_min, index)),
        precipitationSum: numeric(seriesAt(daily.precipitation_sum, index)),
        precipitationProbabilityMax: numeric(seriesAt(daily.precipitation_probability_max, index)),
        windSpeedMax: numeric(seriesAt(daily.wind_speed_10m_max, index)),
        windGustMax: numeric(seriesAt(daily.wind_gusts_10m_max, index)),
        windDirectionDominant: numeric(seriesAt(daily.wind_direction_10m_dominant, index)),
        sunrise: seriesAt(daily.sunrise, index) || null,
        sunset: seriesAt(daily.sunset, index) || null,
        units: {
          temperature: unit(units, 'temperature_2m_max', '°C'),
          windSpeed: unit(units, 'wind_speed_10m_max', 'km/h'),
          windGust: unit(units, 'wind_gusts_10m_max', unit(units, 'wind_speed_10m_max', 'km/h')),
          precipitation: unit(units, 'precipitation_sum', 'mm'),
          precipitationProbability: unit(units, 'precipitation_probability_max', '%')
        }
      };
    });
  }

  function normalizeOpenMeteo(payload = {}, location = null, fetchedAt = new Date(), options = {}) {
    const current = payload.current || {};
    const units = payload.current_units || {};
    const code = Number.isFinite(current.weather_code) ? current.weather_code : null;
    const forecast = {
      timezone: payload.timezone || validLocation(location)?.timezone || null,
      hourly: normalizeHourlyForecast(payload),
      daily: normalizeDailyForecast(payload, DEFAULT_FORECAST_DAYS)
    };
    return {
      status: 'fresh',
      domain: 'weather',
      value: {
        time: current.time || null,
        temperature: numeric(current.temperature_2m),
        apparentTemperature: numeric(current.apparent_temperature),
        humidity: numeric(current.relative_humidity_2m),
        precipitation: numeric(current.precipitation),
        weatherCode: code,
        weatherLabel: labelForCode(code),
        isDay: boolDay(current.is_day),
        cloudCover: numeric(current.cloud_cover),
        windSpeed: numeric(current.wind_speed_10m),
        windDirection: numeric(current.wind_direction_10m),
        windGust: numeric(current.wind_gusts_10m),
        units: {
          temperature: unit(units, 'temperature_2m', '°C'),
          windSpeed: unit(units, 'wind_speed_10m', 'km/h'),
          windGust: unit(units, 'wind_gusts_10m', unit(units, 'wind_speed_10m', 'km/h')),
          precipitation: unit(units, 'precipitation', 'mm'),
          humidity: unit(units, 'relative_humidity_2m', '%'),
          cloudCover: unit(units, 'cloud_cover', '%')
        },
        forecast
      },
      forecast,
      location: validLocation(location),
      fetchedAt: fetchedAt.toISOString(),
      expiresAt: new Date(fetchedAt.getTime() + DEFAULT_MAX_AGE_MS).toISOString(),
      source: sourceMeta({ url: endpoint(location, options) })
    };
  }

  function unavailable(status = 'unavailable', location = null, error = null) {
    return {
      status,
      domain: 'weather',
      value: null,
      location: validLocation(location),
      fetchedAt: null,
      expiresAt: null,
      source: sourceMeta(),
      forecast: { timezone: null, hourly: [], daily: [] },
      error: error ? String(error.message || error) : null
    };
  }

  function createProvider(store = LocalPersistenceCore.createJsonStore(), options = {}) {
    const fetchFn = options.fetchFn || globalThis.fetch || null;
    const collection = options.collection || WEATHER_COLLECTION;
    const maxAgeMs = Number.isFinite(options.maxAgeMs) ? options.maxAgeMs : DEFAULT_MAX_AGE_MS;
    let cacheWrite = Promise.resolve();
    const inFlight = new Map();
    const timeoutMs = options.timeoutMs || 15000;

    function remember(record, location) {
      // Concurrent refreshes for different places must not overwrite each other's cache.
      const write = cacheWrite.then(async () => {
        const cache = await loadCache();
        cache[cacheKey(location)] = record;
        await saveCache(cache);
      });
      cacheWrite = write.catch(() => {});
      return write;
    }

    async function loadCache() {
      const value = await store.load(collection, {});
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    }

    async function saveCache(cache) {
      await store.save(collection, cache);
      return cache;
    }

    async function cached(location, now = new Date()) {
      const normalized = validLocation(location);
      if (!normalized) return unavailable('needs-location', location);
      const key = cacheKey(normalized);
      const cache = await loadCache();
      // Read older rounded keys only when their stored requested location matches exactly.
      const legacy = cache[`${rounded(normalized.latitude)},${rounded(normalized.longitude)},${normalized.timezone || 'UTC'}`];
      const candidate = cache[key] || legacy;
      const record = candidate && cacheKey(candidate.location) === key ? candidate : null;
      if (!record) return unavailable('no-cache', normalized);
      const ageMs = validDate(now) - new Date(record.fetchedAt || 0);
      return {
        ...record,
        status: ageMs <= maxAgeMs ? 'cached-fresh' : 'cached-stale',
        ageMs
      };
    }

    async function fetchSnapshot(location, now = new Date(), options = {}) {
      const normalized = validLocation(location);
      if (!normalized) return unavailable('needs-location', location);
      if (typeof fetchFn !== 'function') return unavailable('unavailable', normalized, 'fetch is not available');
      const url = endpoint(normalized, options);
      const controller = new AbortController();
      let timer;
      try {
        const payload = await Promise.race([
          (async () => {
            const response = await fetchFn(url, { signal: controller.signal });
            if (!response?.ok) throw new Error(`Weather request failed: ${response?.status || 'unknown'}`);
            return response.json();
          })(),
          new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Weather request timed out')); }, timeoutMs); })
        ]);
        const record = normalizeOpenMeteo(payload, normalized, validDate(now), options);
        await remember(record, normalized);
        return record;
      } catch (error) {
        const fallback = await cached(normalized, now).catch(() => unavailable('no-cache', normalized));
        if (fallback.value) return { ...fallback, status: 'offline-cache', error: String(error.message || error) };
        return unavailable('error', normalized, error);
      } finally {
        clearTimeout(timer);
      }
    }

    function refresh(location, now = new Date(), options = {}) {
      const key = endpoint(location, options);
      if (inFlight.has(key)) return inFlight.get(key);
      const request = fetchSnapshot(location, now, options).finally(() => inFlight.delete(key));
      inFlight.set(key, request);
      return request;
    }

    async function current(location, options = {}) {
      return options.refresh ? refresh(location, options.now, options) : cached(location, options.now);
    }

    async function forecastFor(location, options = {}) {
      return current(location, options);
    }

    return Object.freeze({
      collection,
      source: sourceMeta(),
      cacheKey,
      endpoint,
      cached,
      refresh,
      current,
      forecast: forecastFor
    });
  }

  const api = Object.freeze({
    PROVIDER_VERSION,
    WEATHER_COLLECTION,
    DEFAULT_MAX_AGE_MS,
    DEFAULT_FORECAST_DAYS,
    CURRENT_VARIABLES,
    HOURLY_VARIABLES,
    DAILY_VARIABLES,
    OPEN_METEO_ATTRIBUTION,
    WEATHER_LABELS,
    labelForCode,
    cacheKey,
    endpoint,
    normalizeHourlyForecast,
    normalizeDailyForecast,
    normalizeOpenMeteo,
    createProvider
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleWeatherProvider = api;
})();
