(() => {
  'use strict';

  const TimeCore = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;
  const WIND_CORE_VERSION = '0.2.0';
  const WIND_COLLECTION = 'wind-cache';
  const UNIT_FACTORS = Object.freeze({ 'm/s': 1, 'km/h': 1 / 3.6, kn: 1852 / 3600, mph: 0.44704 });

  function convertSpeed(value, from = 'km/h', to = 'm/s') {
    if (!Number.isFinite(value) || value < 0 || !UNIT_FACTORS[from] || !UNIT_FACTORS[to]) return null;
    return value * UNIT_FACTORS[from] / UNIT_FACTORS[to];
  }

  function flowDirection(direction, speed, unit = 'km/h') {
    const ms = convertSpeed(speed, unit);
    if (ms === null || ms < 0.3 || normalizeDirection(direction) === null) return null;
    // Meteorological bearings describe the origin; the arrow shows where air goes.
    return normalizeDirection(direction + 180);
  }

  function forecastInstant(value, timezone = 'UTC') {
    try {
      if (typeof value !== 'string') return null;
      const date = /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? new Date(value) : TimeCore.dateFromInput(value, timezone);
      return Number.isFinite(date.getTime()) ? date : null;
    } catch { return null; }
  }

  function upcomingHourly(wind, now = new Date(), timezone = 'UTC', limit = 24) {
    return (wind?.forecast?.hourly || []).map(item => ({ ...item, instant: forecastInstant(item.time, timezone) }))
      .filter(item => item.instant && item.instant.getTime() + 3600000 > now.getTime())
      .sort((a, b) => a.instant - b.instant).slice(0, Math.max(0, limit));
  }
  const COMPASS = Object.freeze([
    { from: 348.75, to: 360, ru: 'С', en: 'N' },
    { from: 0, to: 11.25, ru: 'С', en: 'N' },
    { from: 11.25, to: 33.75, ru: 'ССВ', en: 'NNE' },
    { from: 33.75, to: 56.25, ru: 'СВ', en: 'NE' },
    { from: 56.25, to: 78.75, ru: 'ВСВ', en: 'ENE' },
    { from: 78.75, to: 101.25, ru: 'В', en: 'E' },
    { from: 101.25, to: 123.75, ru: 'ВЮВ', en: 'ESE' },
    { from: 123.75, to: 146.25, ru: 'ЮВ', en: 'SE' },
    { from: 146.25, to: 168.75, ru: 'ЮЮВ', en: 'SSE' },
    { from: 168.75, to: 191.25, ru: 'Ю', en: 'S' },
    { from: 191.25, to: 213.75, ru: 'ЮЮЗ', en: 'SSW' },
    { from: 213.75, to: 236.25, ru: 'ЮЗ', en: 'SW' },
    { from: 236.25, to: 258.75, ru: 'ЗЮЗ', en: 'WSW' },
    { from: 258.75, to: 281.25, ru: 'З', en: 'W' },
    { from: 281.25, to: 303.75, ru: 'ЗСЗ', en: 'WNW' },
    { from: 303.75, to: 326.25, ru: 'СЗ', en: 'NW' },
    { from: 326.25, to: 348.75, ru: 'ССЗ', en: 'NNW' }
  ]);

  function numeric(value) {
    return Number.isFinite(value) ? value : null;
  }

  function normalizeDirection(value) {
    if (!Number.isFinite(value)) return null;
    return ((value % 360) + 360) % 360;
  }

  function compassPoint(degrees, language = 'ru') {
    const direction = normalizeDirection(degrees);
    if (direction === null) return null;
    const item = COMPASS.find(point => direction >= point.from && direction < point.to) || COMPASS[0];
    return item[language] || item.ru;
  }

  function sourceMeta(extra = {}) {
    return {
      type: 'derived',
      name: 'wind-core',
      version: WIND_CORE_VERSION,
      ...extra
    };
  }

  function unavailable(status = 'unavailable', weather = null, language = 'ru') {
    return {
      status,
      domain: 'wind',
      value: null,
      forecast: { hourly: [], daily: [] },
      location: weather?.location || null,
      fetchedAt: weather?.fetchedAt || null,
      source: sourceMeta({ weatherSource: weather?.source || null }),
      language,
      error: weather?.error || null
    };
  }

  function windValue(input = {}, language = 'ru') {
    const direction = normalizeDirection(input.windDirection ?? input.direction ?? null);
    const speed = numeric(input.windSpeed ?? input.speed ?? null);
    const gust = numeric(input.windGust ?? input.gust ?? null);
    if (speed === null && direction === null && gust === null) return null;
    return {
      time: input.time || input.date || null,
      speed,
      direction,
      gust,
      compass: compassPoint(direction, language),
      unit: input.units?.windSpeed || input.units?.speed || 'km/h',
      gustUnit: input.units?.windGust || input.units?.gust || input.units?.windSpeed || 'km/h'
    };
  }

  function hourlyForecast(weather = {}, language = 'ru', limit = 168) {
    const forecast = weather.forecast || weather.value?.forecast || {};
    const hourly = Array.isArray(forecast.hourly) ? forecast.hourly : [];
    return hourly.slice(0, Math.max(0, limit)).map(item => windValue(item, language) || {
      time: item.time || null, speed: null, direction: null, gust: null, compass: null,
      unit: item.units?.windSpeed || 'km/h', gustUnit: item.units?.windGust || 'km/h'
    });
  }

  function dailyForecast(weather = {}, language = 'ru', limit = 7) {
    const forecast = weather.forecast || weather.value?.forecast || {};
    const daily = Array.isArray(forecast.daily) ? forecast.daily : [];
    return daily.slice(0, Math.max(0, limit)).map(item => {
      const direction = normalizeDirection(item.windDirectionDominant);
      return {
        date: item.date || null,
        speed: numeric(item.windSpeedMax),
        direction,
        gust: numeric(item.windGustMax),
        compass: compassPoint(direction, language),
        unit: item.units?.windSpeed || 'km/h',
        gustUnit: item.units?.windGust || item.units?.windSpeed || 'km/h'
      };
    }).filter(item => item.speed !== null || item.direction !== null || item.gust !== null);
  }

  function fromWeather(weather = null, language = 'ru') {
    if (!weather || typeof weather !== 'object') return unavailable('deferred', null, language);
    const value = weather.value ? windValue(weather.value, language) : null;
    const forecast = {
      hourly: hourlyForecast(weather, language),
      daily: dailyForecast(weather, language)
    };
    if (!value && forecast.hourly.length === 0 && forecast.daily.length === 0) {
      return unavailable(weather.status || 'unavailable', weather, language);
    }
    return {
      status: weather.status || 'ready',
      domain: 'wind',
      value,
      forecast,
      location: weather.location || null,
      fetchedAt: weather.fetchedAt || null,
      source: sourceMeta({ weatherSource: weather.source || null }),
      language,
      error: weather.error || null
    };
  }

  function formatSpeed(value, from = 'km/h', to = 'm/s', language = 'ru') {
    const speed = convertSpeed(value, from, to);
    if (speed === null) return '—';
    const label = language === 'en' ? to : ({ 'm/s': 'м/с', 'km/h': 'км/ч', kn: 'уз', mph: 'миль/ч' }[to] || to);
    return `${new Intl.NumberFormat(language === 'en' ? 'en-GB' : 'ru-RU', { maximumFractionDigits: 1 }).format(speed)} ${label}`;
  }

  function summary(wind = null, language = 'ru', unit = 'm/s') {
    const value = wind?.value || null;
    if (!value) return language === 'en' ? 'Wind unavailable' : 'Ветер недоступен';
    const speed = convertSpeed(value.speed, value.unit, unit);
    const gust = convertSpeed(value.gust, value.gustUnit, unit);
    const parts = [];
    if (speed !== null) parts.push(formatSpeed(value.speed, value.unit, unit, language));
    if (value.compass) parts.push(value.compass);
    if (gust !== null) parts.push(`${language === 'en' ? 'gust' : 'порыв'} ${formatSpeed(value.gust, value.gustUnit, unit, language)}`);
    return parts.join(' · ');
  }

  const api = Object.freeze({
    WIND_CORE_VERSION,
    WIND_COLLECTION,
    UNIT_FACTORS,
    convertSpeed,
    formatSpeed,
    flowDirection,
    forecastInstant,
    upcomingHourly,
    COMPASS,
    normalizeDirection,
    compassPoint,
    windValue,
    hourlyForecast,
    dailyForecast,
    fromWeather,
    summary
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleWindCore = api;
})();
