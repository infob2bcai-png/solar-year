(() => {
  'use strict';

  const ReminderRepository = typeof require === 'function'
    ? require('./reminder-repository.js')
    : globalThis.SolarCircleReminderRepository;
  const TimeCore = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;

  if (!ReminderRepository) throw new Error('SolarCircleReminderRepository is required before ReminderNotifications.');

  const SERVICE_VERSION = '0.1.0';
  const CHANNEL_ID = 'solar-circle-reminders';
  const GROUP_ID = 'solar-circle-reminders';
  const EXTRA_DOMAIN = 'solar-circle-reminder';
  const DEFAULT_HORIZON_DAYS = 45;
  const DEFAULT_MAX_SCHEDULED = 64;
  const DEFAULT_MAX_PER_REMINDER = 8;
  const MS_PER_DAY = 86400000;

  const TEXT = {
    ru: {
      channelName: 'Напоминания Solar Year',
      channelDescription: 'Локальные напоминания Solar Year',
      fallbackTitle: 'Напоминание',
      fallbackBody: 'Время напоминания'
    },
    en: {
      channelName: 'Solar Year reminders',
      channelDescription: 'Local Solar Year reminders',
      fallbackTitle: 'Reminder',
      fallbackBody: 'Reminder time'
    }
  };

  function detectedLocalNotifications() {
    return globalThis.Capacitor?.Plugins?.LocalNotifications || null;
  }

  function validDate(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) throw new RangeError('ReminderNotifications date must be valid.');
    return value;
  }

  function boundedInteger(value, fallback, min, max) {
    return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
  }

  function localDayStart(date) {
    const value = validDate(date);
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  function addDays(date, days) {
    const value = localDayStart(date);
    value.setDate(value.getDate() + days);
    return value;
  }

  function civilFromDate(date, timezone) {
    const value = validDate(date);
    if (timezone) return TimeCore.civilParts(value, timezone);
    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate()
    };
  }

  function civilKey(date, timezone) {
    const civil = civilFromDate(date, timezone);
    return `${civil.year}-${String(civil.month).padStart(2, '0')}-${String(civil.day).padStart(2, '0')}`;
  }

  function dateWithTime(date, timeOfDay, timezone) {
    const value = localDayStart(date);
    const normalized = ReminderRepository.normalizeTimeOfDay(timeOfDay);
    if (!normalized) return null;
    if (timezone) {
      try { return TimeCore.dateFromInput(`${civilKey(date, timezone)}T${normalized}:00`, timezone); }
      catch { return null; }
    }
    const [hour, minute] = normalized.split(':').map(Number);
    value.setHours(hour, minute, 0, 0);
    return value;
  }

  function occurrenceKey(date) {
    return validDate(date).toISOString().slice(0, 16);
  }

  function notificationId(reminderId, occurrenceAt) {
    const input = `${String(reminderId)}:${occurrenceKey(occurrenceAt)}:${EXTRA_DOMAIN}`;
    let hash = 2166136261;
    for (let index = 0; index < input.length; index++) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 2140000000 + 1000000;
  }

  function localized(value, language = 'ru') {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return value[language] || value.ru || value.en || '';
    return '';
  }

  function notificationText(language = 'ru') {
    return TEXT[language] || TEXT.ru;
  }

  function notificationTitle(reminder, language = 'ru') {
    const text = notificationText(language);
    return localized(reminder.title, language).trim() || text.fallbackTitle;
  }

  function notificationBody(reminder, language = 'ru') {
    const text = notificationText(language);
    const body = String(reminder.text || '').trim() || text.fallbackBody;
    return body.length > 180 ? `${body.slice(0, 177)}...` : body;
  }

  function resolveSolarForDate(date, options = {}) {
    const resolver = options.solarForDate;
    if (typeof resolver === 'function') {
      const resolved = resolver(date);
      return resolved?.solar || resolved?.display?.clock || resolved || null;
    }

    const dayContext = options.dayContext || globalThis.SolarCircleDayContext;
    if (dayContext && typeof dayContext.dayContext === 'function') {
      const context = dayContext.dayContext(date, options.dayContextOptions || {});
      return context?.solar || context?.display?.clock || null;
    }

    return null;
  }

  function queryForDate(date, options = {}, solarCache = new Map()) {
    const value = validDate(date);
    const key = civilKey(value, options.timezone);
    if (!solarCache.has(key)) solarCache.set(key, resolveSolarForDate(value, options));
    return ReminderRepository.normalizeQuery({
      date: value,
      civil: civilFromDate(value, options.timezone),
      solar: solarCache.get(key),
      location: options.location || null,
      language: options.language || 'ru'
    });
  }

  function reminderIsSchedulable(reminder) {
    return reminder && reminder.enabled !== false && !reminder.deletedAt && Boolean(reminder.timeOfDay);
  }

  function buildNotification(plan, options = {}) {
    const language = options.language || 'ru';
    return {
      id: plan.notificationId,
      title: notificationTitle(plan.reminder, language),
      body: notificationBody(plan.reminder, language),
      schedule: {
        at: plan.occurrenceAt,
        allowWhileIdle: true
      },
      channelId: CHANNEL_ID,
      group: GROUP_ID,
      autoCancel: true,
      foreground: true,
      isExactNotification: false,
      extra: {
        domain: EXTRA_DOMAIN,
        reminderId: plan.reminder.id,
        occurrenceAt: plan.occurrenceAt.toISOString(),
        recurrenceScope: plan.reminder.recurrence.scope,
        recurrenceFrequency: plan.reminder.recurrence.frequency,
        serviceVersion: SERVICE_VERSION
      }
    };
  }

  function planUpcoming(reminders = [], options = {}) {
    const now = validDate(options.now || new Date());
    const horizonDays = boundedInteger(options.horizonDays, DEFAULT_HORIZON_DAYS, 0, 370);
    const maxScheduled = boundedInteger(options.maxScheduled, DEFAULT_MAX_SCHEDULED, 1, 256);
    const maxPerReminder = boundedInteger(options.maxPerReminder, DEFAULT_MAX_PER_REMINDER, 1, 64);
    const language = options.language || 'ru';
    const normalized = ReminderRepository.normalizeReminders(reminders);
    if (!normalized.some(reminderIsSchedulable)) return [];
    const plans = [];
    const perReminder = new Map();
    const solarCache = new Map();
    const start = options.timezone ? TimeCore.localDayStart(now, options.timezone) : localDayStart(now);

    for (let offset = 0; offset <= horizonDays && plans.length < maxScheduled; offset++) {
      const day = options.timezone ? TimeCore.addCalendarDays(start, offset, options.timezone) : addDays(start, offset);
      for (const reminder of normalized) {
        if (plans.length >= maxScheduled) break;
        if (!reminderIsSchedulable(reminder)) continue;
        const count = perReminder.get(reminder.id) || 0;
        if (count >= maxPerReminder) continue;
        const occurrenceAt = dateWithTime(day, reminder.timeOfDay, options.timezone);
        if (!occurrenceAt || occurrenceAt <= now) continue;
        const query = queryForDate(occurrenceAt, { ...options, language }, solarCache);
        if (!ReminderRepository.matchesDay(reminder, query)) continue;
        const id = notificationId(reminder.id, occurrenceAt);
        const plan = {
          reminder,
          occurrenceAt,
          notificationId: id,
          query
        };
        plans.push({
          ...plan,
          notification: buildNotification(plan, { language })
        });
        perReminder.set(reminder.id, count + 1);
      }
    }

    return plans.sort((left, right) => left.occurrenceAt - right.occurrenceAt || left.reminder.id.localeCompare(right.reminder.id));
  }

  function solarCircleExtra(notification = {}) {
    return notification.extra || notification.data || {};
  }

  function isSolarCircleNotification(notification = {}) {
    return solarCircleExtra(notification).domain === EXTRA_DOMAIN;
  }

  function descriptor(notification) {
    return { id: Number(notification.id) };
  }

  function summarizePlan(plan) {
    return {
      reminderId: plan.reminder.id,
      notificationId: plan.notificationId,
      scheduledAt: plan.occurrenceAt.toISOString(),
      recurrence: plan.reminder.recurrence
    };
  }

  function statusForUnplanned(reminder, fallbackStatus) {
    if (reminder.enabled === false || reminder.deletedAt) return 'not-scheduled';
    if (!reminder.timeOfDay) return 'no-time';
    return fallbackStatus || 'not-scheduled';
  }

  async function updateRepositoryNotifications(repository, plans, fallbackStatus = 'not-scheduled', checkedAt = new Date()) {
    if (!repository || typeof repository.all !== 'function' || typeof repository.saveAll !== 'function') return false;

    const byReminder = new Map();
    for (const plan of plans) {
      const previous = byReminder.get(plan.reminder.id);
      if (!previous || plan.occurrenceAt < previous.occurrenceAt) byReminder.set(plan.reminder.id, plan);
    }

    const lastCheckedAt = validDate(checkedAt).toISOString();
    await repository.saveAll(repository.all().map(reminder => {
      const plan = byReminder.get(reminder.id);
      const status = plan ? 'scheduled' : statusForUnplanned(reminder, fallbackStatus);
      return {
        ...reminder,
        notification: {
          ...(reminder.notification || {}),
          status,
          platformId: plan ? String(plan.notificationId) : null,
          scheduledAt: plan ? plan.occurrenceAt.toISOString() : null,
          lastCheckedAt,
          lastError: null
        }
      };
    }));
    return true;
  }

  async function hydrateRepository(repository, hydrate = true) {
    if (hydrate && repository && repository.hydrated === false && typeof repository.hydrate === 'function') {
      await repository.hydrate();
    }
    return repository && typeof repository.all === 'function' ? repository.all() : [];
  }

  function currentLanguage(options = {}, config = {}) {
    const value = options.language ?? config.language ?? 'ru';
    return typeof value === 'function' ? value() : value;
  }

  async function checkPermissions(localNotifications) {
    if (!localNotifications || typeof localNotifications.checkPermissions !== 'function') {
      return { display: 'unavailable' };
    }
    return localNotifications.checkPermissions();
  }

  async function requestPermissions(localNotifications) {
    if (!localNotifications || typeof localNotifications.requestPermissions !== 'function') {
      return { display: 'unavailable' };
    }
    return localNotifications.requestPermissions();
  }

  async function ensureChannel(localNotifications, language = 'ru') {
    if (!localNotifications || typeof localNotifications.createChannel !== 'function') return { status: 'unavailable' };
    const text = notificationText(language);
    await localNotifications.createChannel({
      id: CHANNEL_ID,
      name: text.channelName,
      description: text.channelDescription,
      importance: 3,
      visibility: 0,
      lights: true,
      lightColor: '#f4b13b',
      vibration: true
    });
    return { status: 'ready', id: CHANNEL_ID };
  }

  async function pendingSolarCircleNotifications(localNotifications) {
    if (!localNotifications || typeof localNotifications.getPending !== 'function') return [];
    const pending = await localNotifications.getPending();
    return (pending.notifications || []).filter(isSolarCircleNotification);
  }

  async function cancelNotifications(localNotifications, notifications = []) {
    if (!localNotifications || typeof localNotifications.cancel !== 'function' || !notifications.length) return 0;
    await localNotifications.cancel({ notifications: notifications.map(descriptor) });
    return notifications.length;
  }

  function createService(config = {}) {
    let configuredLocalNotifications = Object.prototype.hasOwnProperty.call(config, 'localNotifications')
      ? config.localNotifications
      : detectedLocalNotifications();
    let reminderRepository = config.reminderRepository || null;
    let mutation = Promise.resolve();
    function enqueue(operation) {
      const next = mutation.then(operation);
      mutation = next.catch(() => {});
      return next;
    }

    function localNotifications() {
      return configuredLocalNotifications || detectedLocalNotifications();
    }

    async function sync(options = {}) {
      const plugin = localNotifications();
      const now = validDate(options.now || new Date());
      const language = currentLanguage(options, config);

      if (!plugin) {
        return { status: 'unavailable', permission: { display: 'unavailable' }, scheduled: 0, cancelled: 0, plans: [] };
      }

      const reminders = options.reminders || await hydrateRepository(reminderRepository, options.hydrate !== false);
      const permission = options.requestPermission
        ? await requestPermissions(plugin)
        : await checkPermissions(plugin);

      if (permission.display !== 'granted') {
        if (options.updateRepository !== false) {
          await updateRepositoryNotifications(reminderRepository, [], 'permission-required', now);
        }
        return { status: 'permission-required', permission, scheduled: 0, cancelled: 0, plans: [] };
      }

      await ensureChannel(plugin, language);
      const pending = await pendingSolarCircleNotifications(plugin);
      // An inexact alarm can still be waiting after its requested minute has passed.
      const retained = pending.flatMap(notification => {
        const extra = solarCircleExtra(notification);
        const at = new Date(extra.occurrenceAt);
        const reminder = reminders.find(item => item.id === extra.reminderId);
        if (!reminderIsSchedulable(reminder) || !Number.isFinite(at.getTime()) || at > now || now - at > MS_PER_DAY) return [];
        const scheduledTime = dateWithTime(at, reminder.timeOfDay, options.timezone || config.timezone);
        const query = queryForDate(at, { ...config, ...options, language });
        if (scheduledTime?.getTime() !== at.getTime() || !ReminderRepository.matchesDay(reminder, query)) return [];
        return [{ reminder, occurrenceAt: at, notificationId: notification.id, notification, query }];
      });
      const retainedIds = new Set(retained.map(plan => plan.notificationId));
      const cancelled = options.cancelExisting === false ? 0 : await cancelNotifications(plugin, pending.filter(item => !retainedIds.has(item.id)));
      const plans = planUpcoming(reminders, { ...config, ...options, now, language });
      let result = { notifications: [] };
      if (plans.length && typeof plugin.schedule === 'function') {
        result = await plugin.schedule({ notifications: plans.map(plan => plan.notification) });
      }
      plans.push(...retained);

      if (options.updateRepository !== false) {
        await updateRepositoryNotifications(reminderRepository, plans, 'not-scheduled', now);
      }

      return {
        status: plans.length ? 'scheduled' : 'ready',
        permission,
        channelId: CHANNEL_ID,
        scheduled: result.notifications?.length || 0,
        retained: retained.length,
        cancelled,
        warning: result.warning || null,
        plans: plans.map(summarizePlan)
      };
    }

    async function cancelAll(options = {}) {
      const plugin = localNotifications();
      if (!plugin) return { status: 'unavailable', cancelled: 0 };
      const pending = await pendingSolarCircleNotifications(plugin);
      const cancelled = await cancelNotifications(plugin, pending);
      if (options.updateRepository !== false) {
        await updateRepositoryNotifications(reminderRepository, [], 'not-scheduled', options.now || new Date());
      }
      return { status: 'cancelled', cancelled };
    }

    async function cancelReminder(reminderId, options = {}) {
      const plugin = localNotifications();
      if (!plugin) return { status: 'unavailable', cancelled: 0 };
      const id = String(reminderId);
      const pending = (await pendingSolarCircleNotifications(plugin))
        .filter(notification => String(solarCircleExtra(notification).reminderId) === id);
      const cancelled = await cancelNotifications(plugin, pending);
      if (options.updateRepository !== false && reminderRepository && typeof reminderRepository.all === 'function' && typeof reminderRepository.saveAll === 'function') {
        await reminderRepository.saveAll(reminderRepository.all().map(reminder => reminder.id === id
          ? {
              ...reminder,
              notification: {
                ...(reminder.notification || {}),
                status: 'not-scheduled',
                platformId: null,
                scheduledAt: null,
                lastCheckedAt: validDate(options.now || new Date()).toISOString(),
                lastError: null
              }
            }
          : reminder));
      }
      return { status: 'cancelled', cancelled };
    }

    return Object.freeze({
      version: SERVICE_VERSION,
      channelId: CHANNEL_ID,
      setPlugin(next) {
        configuredLocalNotifications = next;
      },
      setReminderRepository(next) {
        reminderRepository = next;
      },
      checkPermissions: () => checkPermissions(localNotifications()),
      requestPermissions: () => requestPermissions(localNotifications()),
      ensureChannel: language => ensureChannel(localNotifications(), language),
      pendingSolarCircleNotifications: () => pendingSolarCircleNotifications(localNotifications()),
      planUpcoming: (reminders, options = {}) => planUpcoming(reminders, { ...config, ...options }),
      sync: options => enqueue(() => sync(options)),
      cancelAll: options => enqueue(() => cancelAll(options)),
      cancelReminder: (id, options) => enqueue(() => cancelReminder(id, options))
    });
  }

  const api = Object.freeze({
    SERVICE_VERSION,
    CHANNEL_ID,
    GROUP_ID,
    EXTRA_DOMAIN,
    DEFAULT_HORIZON_DAYS,
    DEFAULT_MAX_SCHEDULED,
    DEFAULT_MAX_PER_REMINDER,
    detectedLocalNotifications,
    notificationId,
    planUpcoming,
    isSolarCircleNotification,
    createService
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleReminderNotifications = api;
})();
