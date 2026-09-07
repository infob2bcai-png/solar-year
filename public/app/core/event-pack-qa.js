(() => {
  'use strict';

  const EventCore = typeof require === 'function'
    ? require('./event-core.js')
    : globalThis.SolarCircleEventCore;

  if (!EventCore) throw new Error('SolarCircleEventCore is required before EventPackQA.');

  const QA_VERSION = '0.1.0';
  const REQUIRED_LANGUAGES = Object.freeze(['ru', 'en']);

  function issue(code, severity, message, id = null) {
    return { code, severity, message, id };
  }

  function sourceById(pack = {}) {
    const map = new Map();
    for (const source of pack.sources || []) {
      if (source?.id) map.set(source.id, source);
    }
    return map;
  }

  function hasLocalizedText(value) {
    return REQUIRED_LANGUAGES.every(language => typeof value?.[language] === 'string' && value[language].trim().length > 0);
  }

  function validateSource(source, issues) {
    if (!source?.id) issues.push(issue('source-id-missing', 'error', 'Source id is required.'));
    if (!source?.name) issues.push(issue('source-name-missing', 'error', 'Source name is required.', source?.id || null));
    if (!source?.url) issues.push(issue('source-url-missing', 'warning', 'Source URL should be present.', source?.id || null));
    if (!source?.license) issues.push(issue('source-license-missing', 'error', 'Source license/rights note is required.', source?.id || null));
    if (source?.rights?.textBundled !== false) {
      issues.push(issue('source-rights-text-bundled', 'error', 'Offline pack must cite sources without bundling source text.', source?.id || null));
    }
  }

  function validateEvent(event, sources, seen, issues) {
    if (!event?.id) {
      issues.push(issue('event-id-missing', 'error', 'Event id is required.'));
      return;
    }
    if (seen.has(event.id)) issues.push(issue('event-id-duplicate', 'error', 'Event id must be unique.', event.id));
    seen.add(event.id);
    if (!hasLocalizedText(event.title)) issues.push(issue('event-title-i18n-missing', 'error', 'Event title must include RU and EN text.', event.id));
    if (!hasLocalizedText(event.description)) issues.push(issue('event-description-i18n-missing', 'error', 'Event description must include RU and EN text.', event.id));
    if (!event.sourceId || !sources.has(event.sourceId)) issues.push(issue('event-source-missing', 'error', 'Event sourceId must point to a declared source.', event.id));
    try {
      EventCore.normalizeEvent(event);
    } catch (error) {
      issues.push(issue('event-normalization-failed', 'error', error.message, event.id));
    }
  }

  function validatePack(pack = {}) {
    const issues = [];
    if (pack.schema !== 'solar-circle.offline-event-pack') {
      issues.push(issue('pack-schema-invalid', 'error', 'Offline event pack schema is invalid.'));
    }
    if (!pack.version) issues.push(issue('pack-version-missing', 'error', 'Offline event pack version is required.'));
    if (!Array.isArray(pack.sources) || pack.sources.length === 0) issues.push(issue('pack-sources-empty', 'error', 'At least one source is required.'));
    if (!Array.isArray(pack.events)) issues.push(issue('pack-events-invalid', 'error', 'Pack events must be an array.'));

    const sources = sourceById(pack);
    for (const source of pack.sources || []) validateSource(source, issues);
    const seen = new Set();
    for (const event of pack.events || []) validateEvent(event, sources, seen, issues);

    const errors = issues.filter(item => item.severity === 'error');
    const warnings = issues.filter(item => item.severity === 'warning');
    return {
      version: QA_VERSION,
      status: errors.length ? 'failed' : 'passed',
      eventCount: Array.isArray(pack.events) ? pack.events.length : 0,
      sourceCount: Array.isArray(pack.sources) ? pack.sources.length : 0,
      errors,
      warnings,
      issues
    };
  }

  const api = Object.freeze({
    QA_VERSION,
    REQUIRED_LANGUAGES,
    validatePack
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleEventPackQA = api;
})();
