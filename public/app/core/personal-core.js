(() => {
  'use strict';

  const EventCore = typeof require === 'function'
    ? require('./event-core.js')
    : globalThis.SolarCircleEventCore;

  if (!EventCore) throw new Error('SolarCircleEventCore is required before PersonalCore.');

  const PERSONAL_CORE_VERSION = '0.1.0';
  const PERSONAL_TYPES = Object.freeze(['note', 'reminder', 'routine', 'personal-date', 'setting']);
  const PRIVATE_FIELDS = Object.freeze(['text', 'body', 'note', 'reminderText', 'routineText', 'date', 'dateRef', 'dateRefs', 'location', 'settings', 'schedule', 'completions']);
  const SYNC_POLICIES = Object.freeze(['offline-only', 'export-only']);

  function isoNow() {
    return new Date().toISOString();
  }

  function normalizeType(type) {
    if (!PERSONAL_TYPES.includes(type)) throw new RangeError(`Unsupported personal data type: ${type}.`);
    return type;
  }

  function normalizeId(id, prefix) {
    if (id === undefined || id === null || String(id).trim() === '') {
      throw new Error(`${prefix} id is required.`);
    }
    return String(id);
  }

  function localizedText(value, fallback = '') {
    return EventCore.localizedText(value, fallback);
  }

  function normalizeTags(tags = []) {
    return Array.isArray(tags) ? tags.map(String).filter(Boolean) : [];
  }

  function normalizePrivacy(input = {}) {
    return {
      visibility: input.visibility || 'private',
      syncPolicy: SYNC_POLICIES.includes(input.syncPolicy) ? input.syncPolicy : 'offline-only',
      encrypted: Boolean(input.encrypted),
      containsPersonalData: true
    };
  }

  function normalizeSource(input = {}) {
    return {
      type: input.type || 'personal',
      name: input.name || null,
      device: input.device || null,
      version: input.version || PERSONAL_CORE_VERSION
    };
  }

  function normalizeDateRef(input = null) {
    if (!input) return null;
    return EventCore.normalizeDateRef(input);
  }

  function normalizeDateRefs(input = []) {
    const list = Array.isArray(input) ? input : [input];
    return list.filter(Boolean).map(normalizeDateRef);
  }

  function normalizeCompletion(input = {}) {
    const status = ['planned','done','skipped'].includes(input.status) ? input.status : 'done';
    return {dateRef:normalizeDateRef(input.dateRef || input.date),status,
      completedAt:input.completedAt || (status==='done'?new Date().toISOString():null),
      amount:Number.isFinite(input.amount)?input.amount:null,note:typeof input.note==='string'?input.note:''};
  }
  function completionKey(ref) {
    if (!ref) throw new Error('Completion date is required.');
    return ref.kind==='civil'?`civil:${ref.year||'*'}-${ref.month}-${ref.day}`:`solar:${ref.year||'*'}-${ref.totalDay||((ref.month-1)*30+ref.day)}`;
  }
  function baseRecord(input = {}, type) {
    const now = isoNow();
    return {
      id: normalizeId(input.id, type),
      type: normalizeType(type),
      title: localizedText(input.title, String(input.id || '')),
      tags: normalizeTags(input.tags),
      privacy: normalizePrivacy(input.privacy || input),
      source: normalizeSource(input.source),
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || input.createdAt || now,
      deletedAt: input.deletedAt || null
    };
  }

  function assertOfflineOnly(record) {
    if (!record?.privacy || record.privacy.syncPolicy !== 'offline-only') {
      throw new Error('Personal records must be offline-only unless an explicit export flow is used.');
    }
    return record;
  }

  function redactForLog(record = {}) {
    const clone = { ...record };
    for (const field of PRIVATE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(clone, field)) clone[field] = '[private]';
    }
    if (clone.privacy) clone.privacy = { ...clone.privacy, containsPersonalData: true };
    return clone;
  }

  const api = Object.freeze({
    PERSONAL_CORE_VERSION,
    PERSONAL_TYPES,
    PRIVATE_FIELDS,
    SYNC_POLICIES,
    localizedText,
    normalizeTags,
    normalizePrivacy,
    normalizeSource,
    normalizeDateRef,
    normalizeDateRefs,
    normalizeCompletion,
    completionKey,
    baseRecord,
    assertOfflineOnly,
    redactForLog
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCirclePersonalCore = api;
})();
