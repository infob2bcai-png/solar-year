(() => {
  'use strict';

  const KIND = Object.freeze({
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    INTERNAL: 'internal'
  });

  const STATUS = Object.freeze({
    LIVE: 'live',
    MAPPED: 'mapped_to_existing_screen',
    PLANNED: 'planned',
    LATER: 'later',
    INTERNAL: 'internal'
  });

  const NO_RUNTIME_INTEGRATIONS = Object.freeze({
    backend: false,
    google: false,
    matrix: false,
    prometei: false,
    donorRuntime: false
  });

  function defineScreen(definition) {
    return Object.freeze({
      id: definition.id,
      kind: definition.kind,
      status: definition.status || STATUS.PLANNED,
      labelKey: definition.labelKey,
      titleKey: definition.titleKey || definition.labelKey,
      iconKey: definition.iconKey || definition.id,
      domScreenId: definition.domScreenId || null,
      tabIndex: Number.isInteger(definition.tabIndex) ? definition.tabIndex : null,
      localMode: definition.localMode !== false,
      requires: Object.freeze([...(definition.requires || [])]),
      dataPolicy: Object.freeze({ ...NO_RUNTIME_INTEGRATIONS, ...(definition.dataPolicy || {}) }),
      ownerCore: definition.ownerCore || 'AppShell',
      notes: definition.notes || ''
    });
  }

  const SCREEN_DEFINITIONS = Object.freeze([
    defineScreen({
      id: 'today',
      kind: KIND.PRIMARY,
      status: STATUS.LIVE,
      labelKey: 'navClock',
      titleKey: 'brand',
      iconKey: 'today',
      domScreenId: 'clock',
      tabIndex: 0,
      ownerCore: 'DayContext',
      notes: 'Current prototype Today and Time content share the existing clock screen.'
    }),
    defineScreen({
      id: 'calendar',
      kind: KIND.PRIMARY,
      status: STATUS.LIVE,
      labelKey: 'navMonth',
      titleKey: 'monthStructure',
      iconKey: 'calendar',
      domScreenId: 'month',
      tabIndex: 1,
      ownerCore: 'CalendarCore'
    }),
    defineScreen({
      id: 'time',
      kind: KIND.PRIMARY,
      status: STATUS.MAPPED,
      labelKey: 'solarClock',
      titleKey: 'solarClock',
      iconKey: 'time',
      domScreenId: 'clock',
      tabIndex: 2,
      ownerCore: 'TimeCore',
      notes: 'V2 contract reserves a separate Time route; current UI maps it to the clock screen until the shell is split.'
    }),
    defineScreen({
      id: 'dates',
      kind: KIND.PRIMARY,
      status: STATUS.LIVE,
      labelKey: 'navConvert',
      titleKey: 'dateTools',
      iconKey: 'dates',
      domScreenId: 'convert',
      tabIndex: 3,
      ownerCore: 'CalendarGrammar'
    }),
    defineScreen({
      id: 'more',
      kind: KIND.PRIMARY,
      status: STATUS.LIVE,
      labelKey: 'navMore',
      titleKey: 'moreTitle',
      iconKey: 'more',
      domScreenId: 'more',
      tabIndex: 4,
      ownerCore: 'AppShell'
    }),
    defineScreen({ id: 'sun', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'navSun', titleKey: 'sunPanelTitle', iconKey: 'sun', domScreenId: 'sun', ownerCore: 'SunCore' }),
    defineScreen({ id: 'moon', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'navMoon', titleKey: 'moonPanelTitle', iconKey: 'moon', domScreenId: 'moon', ownerCore: 'MoonCore' }),
    defineScreen({ id: 'about', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'navAbout', titleKey: 'aboutProject', iconKey: 'about', domScreenId: 'about', ownerCore: 'ProjectMeta' }),
    defineScreen({ id: 'settings', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'settings', titleKey: 'settings', iconKey: 'more', domScreenId: 'settings', ownerCore: 'AppShell' }),
    defineScreen({ id: 'weather', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'weatherTitle', iconKey: 'weather', domScreenId: 'weather', ownerCore: 'WeatherProvider', notes: 'Explicit refresh only; cached/offline states are handled locally.' }),
    defineScreen({ id: 'wind', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'windTitle', iconKey: 'wind', domScreenId: 'wind', ownerCore: 'WindCore' }),
    defineScreen({ id: 'event-memory', kind: KIND.SECONDARY, labelKey: 'eventMemoryTitle', iconKey: 'event-memory', ownerCore: 'EventCore' }),
    defineScreen({ id: 'notes', kind: KIND.SECONDARY, labelKey: 'notesTitle', iconKey: 'notes', ownerCore: 'NotebookCore' }),
    defineScreen({ id: 'reminders', kind: KIND.SECONDARY, labelKey: 'remindersTitle', iconKey: 'reminders', ownerCore: 'ReminderRepository' }),
    defineScreen({ id: 'routine', kind: KIND.SECONDARY, labelKey: 'routineTitle', iconKey: 'routine', ownerCore: 'RoutineRepository' }),
    defineScreen({ id: 'places', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'savedPlacesTitle', iconKey: 'location', domScreenId: 'places', ownerCore: 'SavedPlacesRepository' }),
    defineScreen({ id: 'search', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'searchTitle', iconKey: 'search', domScreenId: 'search', ownerCore: 'GlobalSearch' }),
    defineScreen({ id: 'backup', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'backupTitle', iconKey: 'backup', domScreenId: 'backup', ownerCore: 'BackupCore' }),
    defineScreen({ id: 'data-sources', kind: KIND.SECONDARY, status: STATUS.LIVE, labelKey: 'dataSourcesTitle', iconKey: 'data-sources', domScreenId: 'sources', ownerCore: 'DataSourceRegistry' }),
    defineScreen({ id: 'offline-data', kind: KIND.SECONDARY, labelKey: 'offlineDataTitle', iconKey: 'offline-data', ownerCore: 'LocalPersistenceCore' }),
    defineScreen({ id: 'transfer', kind: KIND.SECONDARY, labelKey: 'transferTitle', iconKey: 'transfer', ownerCore: 'TransferCore' }),
    defineScreen({ id: 'sync', kind: KIND.SECONDARY, labelKey: 'syncTitle', iconKey: 'sync', ownerCore: 'SyncCore' }),
    defineScreen({ id: 'account', kind: KIND.SECONDARY, labelKey: 'accountTitle', iconKey: 'account', ownerCore: 'AccountCore' }),
    defineScreen({
      id: 'community',
      kind: KIND.SECONDARY,
      status: STATUS.LATER,
      labelKey: 'communityTitle',
      iconKey: 'community',
      ownerCore: 'CommunityCore',
      requires: ['platform-mode-later']
    }),
    defineScreen({
      id: 'admin',
      kind: KIND.INTERNAL,
      status: STATUS.INTERNAL,
      labelKey: 'adminTitle',
      iconKey: 'admin',
      ownerCore: 'AdminCore',
      requires: ['internal-mode']
    })
  ]);

  const ROUTE_BY_ID = new Map(SCREEN_DEFINITIONS.map(route => [route.id, route]));
  const ROUTE_BY_DOM_SCREEN = new Map();
  SCREEN_DEFINITIONS.forEach(route => {
    if (route.domScreenId && !ROUTE_BY_DOM_SCREEN.has(route.domScreenId)) ROUTE_BY_DOM_SCREEN.set(route.domScreenId, route);
  });

  function routesByKind(kind) {
    return SCREEN_DEFINITIONS
      .filter(route => route.kind === kind)
      .sort((left, right) => (left.tabIndex ?? 999) - (right.tabIndex ?? 999) || left.id.localeCompare(right.id));
  }

  function primaryRoutes() {
    return routesByKind(KIND.PRIMARY);
  }

  function secondaryRoutes() {
    return routesByKind(KIND.SECONDARY);
  }

  function resolveRoute(idOrDomScreen) {
    return ROUTE_BY_ID.get(idOrDomScreen) || ROUTE_BY_DOM_SCREEN.get(idOrDomScreen) || null;
  }

  function requireRoute(idOrDomScreen) {
    const route = resolveRoute(idOrDomScreen);
    if (!route) throw new Error(`Unknown Solar Year route: ${idOrDomScreen}`);
    return route;
  }

  function hasRuntimeIntegration(route) {
    return Object.values(route.dataPolicy).some(Boolean);
  }

  function runtimePolicyIsLocalOnly() {
    return SCREEN_DEFINITIONS.every(route => !hasRuntimeIntegration(route));
  }

  const api = Object.freeze({
    KIND,
    STATUS,
    NO_RUNTIME_INTEGRATIONS,
    SCREEN_DEFINITIONS,
    primaryRoutes,
    secondaryRoutes,
    routesByKind,
    resolveRoute,
    requireRoute,
    runtimePolicyIsLocalOnly
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleRouteRegistry = api;
})();
