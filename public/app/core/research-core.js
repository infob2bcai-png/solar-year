(() => {
  'use strict';
  const CONSENT_VERSION = '2026-09-05-v1';
  const RETENTION_DAYS = 30;
  const defaultConsent = () => ({ status: 'pending', proposedParticipation: true, version: CONSENT_VERSION });

  function snapshot(input, participantId, now = new Date()) {
    const location = input.location;
    const available = Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);
    return {
      schema: 'solar-year.research-snapshot.v1',
      consentVersion: CONSENT_VERSION,
      participantId,
      date: now.toISOString().slice(0, 10),
      area: available ? { latitude: Math.round(location.latitude * 2) / 2, longitude: Math.round(location.longitude * 2) / 2, gridDegrees: 0.5 } : null,
      timezone: input.timezone,
      language: input.language === 'en' ? 'en' : 'ru',
      appVersion: '1.0.0',
      platform: input.platform === 'android' ? 'android' : 'web'
    };
  }

  function createService(store, randomId = () => globalThis.crypto.randomUUID()) {
    let consent = defaultConsent();
    let record = null;
    // No transport exists until the owner supplies an API and approves its contract.
    return Object.freeze({
      get consent() { return { ...consent }; },
      get record() { return record ? JSON.parse(JSON.stringify(record)) : null; },
      async hydrate() {
        consent = await store.load('consent', defaultConsent());
        globalThis.performance?.mark('solar-research-consent-loaded');
        if (consent.version !== CONSENT_VERSION) consent = defaultConsent();
        record = consent.status === 'accepted' ? await store.load('snapshot', null) : null;
        if (record && Date.now() - Date.parse(record.date) > RETENTION_DAYS * 86400000) record = null;
        if (!record) await store.remove('snapshot');
        globalThis.performance?.mark('solar-research-cleaned');
      },
      async decide(accepted, input) {
        consent = { status: accepted ? 'accepted' : 'declined', proposedParticipation: Boolean(accepted), version: CONSENT_VERSION, decidedAt: new Date().toISOString() };
        record = accepted ? snapshot(input, record?.participantId || randomId()) : null;
        await store.save('consent', consent);
        if (record) await store.save('snapshot', record);
        else await store.remove('snapshot');
      },
      async update(input) {
        if (consent.status !== 'accepted') return;
        record = snapshot(input, record?.participantId || randomId());
        await store.save('snapshot', record);
      }
    });
  }
  const api = Object.freeze({ CONSENT_VERSION, RETENTION_DAYS, defaultConsent, snapshot, createService });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleResearchCore = api;
})();
