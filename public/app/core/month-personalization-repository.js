(() => {
  'use strict';
  const Core = typeof require === 'function' ? require('./month-personalization-core.js') : globalThis.SolarCircleMonthPersonalizationCore;
  const Journey = typeof require === 'function' ? require('./month-journey-core.js') : globalThis.SolarCircleMonthJourneyCore;
  const COLLECTION = 'month-personalization';
  const clone = value => JSON.parse(JSON.stringify(value));
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const bytes = value => new TextEncoder().encode(JSON.stringify(value)).length;

  function validateState(input) {
    if (!record(input) || input.schema !== Core.SCHEMA || input.version !== Core.VERSION
      || !Number.isSafeInteger(input.revision) || input.revision < 0 || bytes(input) > 2 * 1024 * 1024) throw new Error('Invalid month state.');
    for (const name of ['journeys', 'unlocks', 'months', 'assets']) if (!record(input[name])) throw new Error('Invalid month collection.');
    for (const [key, journey] of Object.entries(input.journeys)) {
      Journey.validateJourney(journey);
      if (journey.key !== key) throw new Error('Journey key mismatch.');
    }
    for (const [key, receipt] of Object.entries(input.unlocks)) {
      if (String(Number(key)) !== key) throw new Error('Invalid month key.');
      Core.validateReceipt(receipt, Number(key));
    }
    if (input.course !== null) {
      const source = Journey.parseJourneyKey(input.course?.sourceJourneyKey);
      if (!Core.canCustomize(input, source.monthId)) throw new Error('Invalid course completion.');
    } else if (Object.keys(input.unlocks).length) throw new Error('Unlock requires course.');
    for (const [key, month] of Object.entries(input.months)) {
      if (!record(month) || String(month.monthId) !== key || !Core.canCustomize(input, month.monthId)
        || !record(month.customNames) || !Array.isArray(month.renameHistory) || month.renameHistory.length > 100) throw new Error('Invalid month profile.');
      Journey.isoTime(month.updatedAt);
      for (const [locale, name] of Object.entries(month.customNames)) {
        if (!['ru', 'en'].includes(locale) || Core.normalizeName(name) !== name) throw new Error('Invalid personal name.');
      }
      const ids = new Set();
      for (const item of month.renameHistory) {
        if (!item || typeof item.id !== 'string' || !item.id || ids.has(item.id) || !['ru', 'en'].includes(item.locale)) throw new Error('Invalid rename history.');
        ids.add(item.id); Journey.isoTime(item.changedAt);
        for (const name of [item.previousName, item.nextName]) if (name !== null && Core.normalizeName(name) !== name) throw new Error('Invalid history name.');
      }
      if (month.customSvgAssetId !== null && !Object.hasOwn(input.assets, month.customSvgAssetId)) throw new Error('Missing SVG asset.');
    }
    if (Object.keys(input.assets).length > 12) throw new Error('Too many SVG assets.');
    for (const [id, asset] of Object.entries(input.assets)) {
      if (!record(asset) || asset.id !== id || !/^[a-f0-9]{64}$/.test(id) || asset.kind !== 'custom-svg'
        || asset.sanitizerPolicyVersion !== 'month-svg-v1' || typeof asset.sanitizedSvg !== 'string'
        || new TextEncoder().encode(asset.sanitizedSvg).length !== asset.utf8Bytes || asset.utf8Bytes > 32768
        || !Array.isArray(asset.viewBox) || asset.viewBox.length !== 4 || !asset.viewBox.every(Number.isFinite)
        || asset.viewBox[2] <= 0 || asset.viewBox[3] <= 0) throw new Error('Invalid SVG metadata.');
      Journey.isoTime(asset.importedAt);
      if (!Object.values(input.months).some(month => month.customSvgAssetId === id)) throw new Error('Orphan SVG asset.');
    }
    return clone(input);
  }

  async function validateAssets(state) {
    const assets = Object.values(state.assets);
    if (!assets.length) return;
    const api = globalThis.SolarCircleMonthSvgAssets;
    if (!api) throw new Error('SVG validation unavailable.');
    for (const asset of assets) await api.validateAsset(asset);
  }

  function reconcile(state, committedNotes, now) {
    const next = clone(state);
    const journeys = Object.values(next.journeys).sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.solarYear - b.solarYear || a.monthId - b.monthId);
    for (const journey of journeys) {
      if (next.unlocks[journey.monthId] || !Journey.deriveJourney(journey, committedNotes).eligible) continue;
      const days = Array.from({ length: 30 }, (_, i) => i + 1);
      next.unlocks[journey.monthId] = { ruleVersion: Journey.RULE_VERSION, journeyKey: journey.key, monthId: journey.monthId,
        grantedAt: now, viewedDays: days, notedDays: days.slice() };
      if (!next.course) next.course = { ruleVersion: Journey.RULE_VERSION, completedAt: now, sourceJourneyKey: journey.key };
    }
    return next;
  }

  function mergeRestore(current, imported) {
    validateState(current); validateState(imported);
    const merged = clone(imported);
    for (const [key, receipt] of Object.entries(current.unlocks)) {
      if (!merged.unlocks[key] || receipt.grantedAt < merged.unlocks[key].grantedAt) merged.unlocks[key] = clone(receipt);
    }
    // Bind the course to a retained receipt, including restores whose first source month differs.
    const first = Object.values(merged.unlocks).sort((a, b) => a.grantedAt.localeCompare(b.grantedAt) || a.monthId - b.monthId)[0];
    merged.course = first ? { ruleVersion: Journey.RULE_VERSION, completedAt: first.grantedAt, sourceJourneyKey: first.journeyKey } : null;
    merged.revision = Math.max(current.revision, imported.revision) + 1;
    return validateState(merged);
  }

  function createRepository(store, { notes, now = () => new Date().toISOString() } = {}) {
    let state = Core.emptyState(), hydrated = false, lastError = null, queue = Promise.resolve();
    function enqueue(operation) {
      const result = queue.then(operation);
      queue = result.catch(() => {});
      return result.catch(error => { lastError = error; throw error; });
    }
    async function commit(next) {
      if (JSON.stringify(next) === JSON.stringify(state)) { lastError = null; return clone(state); }
      next.revision = state.revision + 1;
      const validated = validateState(next);
      await validateAssets(validated);
      await store.save(COLLECTION, validated);
      state = validated; lastError = null;
      return clone(state);
    }
    function transaction(change) {
      return enqueue(async () => {
        if (!hydrated) throw new Error('Month state is not hydrated.');
        return commit(await change(clone(state), Journey.isoTime(now())));
      });
    }
    const api = Object.freeze({
      get hydrated() { return hydrated; }, get lastError() { return lastError; },
      snapshot() { if (!hydrated) throw new Error('Month state is not hydrated.'); return clone(state); },
      whenSettled() { return queue; },
      hydrate() { return enqueue(async () => {
        hydrated = false;
        const value = validateState(await store.load(COLLECTION, Core.emptyState()));
        await validateAssets(value);
        state = value; hydrated = true; lastError = null;
        return api;
      }); },
      reconcile() { return transaction((next, time) => reconcile(next, notes.committedSnapshot(), time)); },
      recordView({ solarYear, monthId, day }, activation) {
        return transaction((next, time) => {
          // UI supplies captured direct-input provenance; this local boundary is not anti-tamper DRM.
          if (activation?.trusted !== true || activation?.visible !== true || activation?.enabled !== true) return next;
          Journey.integer(day, 1, 30);
          const key = Journey.journeyKey(solarYear, monthId);
          const journey = next.journeys[key] || Journey.createJourney(solarYear, monthId, time);
          const item = journey.days.find(item => item.day === day);
          if (!item.detailsViewedAt) {
            item.detailsViewedAt = time; journey.updatedAt = time; next.journeys[key] = journey;
          }
          return reconcile(next, notes.committedSnapshot(), time);
        });
      },
      rename(monthId, locale, input) { return transaction((next, time) => {
        if (!Core.canCustomize(next, monthId) || !['ru', 'en'].includes(locale)) throw new Error('Month is locked.');
        const name = input === null ? null : Core.normalizeName(input);
        const month = next.months[monthId] || { monthId, customNames: {}, customSvgAssetId: null, renameHistory: [], updatedAt: time };
        const previous = month.customNames[locale] || null;
        if (name === previous) return next;
        if (name === null) delete month.customNames[locale]; else month.customNames[locale] = name;
        month.renameHistory.push({ id: `${next.revision + 1}:${monthId}:${locale}`, locale, previousName: previous, nextName: name, changedAt: time });
        month.renameHistory = month.renameHistory.slice(-100); month.updatedAt = time; next.months[monthId] = month;
        return next;
      }); },
      restoreCanonicalName(monthId) { return transaction((next, time) => {
        if (!Core.canCustomize(next, monthId)) throw new Error('Month is locked.');
        const month = next.months[monthId];
        if (!month || !Object.keys(month.customNames).length) return next;
        for (const [locale, previousName] of Object.entries(month.customNames)) {
          month.renameHistory.push({ id: `${next.revision + 1}:${monthId}:${locale}`, locale, previousName, nextName: null, changedAt: time });
        }
        month.customNames = {}; month.renameHistory = month.renameHistory.slice(-100); month.updatedAt = time;
        return next;
      }); },
      assignAsset(monthId, asset) { return transaction(async (next, time) => {
        if (!Core.canCustomize(next, monthId)) throw new Error('Month is locked.');
        if (asset) { await validateAssets({ assets: { [asset.id]: asset } }); next.assets[asset.id] = clone(asset); }
        const month = next.months[monthId] || { monthId, customNames: {}, customSvgAssetId: null, renameHistory: [], updatedAt: time };
        month.customSvgAssetId = asset?.id || null; month.updatedAt = time; next.months[monthId] = month;
        for (const id of Object.keys(next.assets)) if (!Object.values(next.months).some(item => item.customSvgAssetId === id)) delete next.assets[id];
        return next;
      }); }
    });
    return api;
  }
  const api = Object.freeze({ COLLECTION, validateState, validateAssets, reconcile, mergeRestore, createRepository });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleMonthPersonalizationRepository = api;
})();
