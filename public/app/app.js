(() => {
  'use strict';

  const CalendarCore = window.SolarCircleCalendarCore;
  const CalendarNavigation = window.SolarCircleCalendarNavigation;
  const CalendarGrammar = window.SolarCircleCalendarGrammar;
  const OrbitViewModel = window.SolarCircleOrbitViewModel;
  const LocationProvider = window.SolarCircleLocationProvider;
  const ResearchCore = window.SolarCircleResearchCore;
  const TimeCore = window.SolarCircleTimeCore;
  const ProjectMeta = window.SolarCircleProjectMeta;
  const LocalPersistenceCore = window.SolarCircleLocalPersistenceCore;
  const DayContext = window.SolarCircleDayContext;
  const ThemeCore = window.SolarCircleThemeCore;
  const RouteRegistry = window.SolarCircleRouteRegistry;
  const EventRepository = window.SolarCircleEventRepository;
  const NotesRepository = window.SolarCircleNotesRepository;
  const ReminderRepository = window.SolarCircleReminderRepository;
  const ReminderNotifications = window.SolarCircleReminderNotifications;
  const RoutineRepository = window.SolarCircleRoutineRepository;
  const OfflineEventPack = window.SolarCircleOfflineEventPack;
  const WeatherProvider = window.SolarCircleWeatherProvider;
  const WindCore = window.SolarCircleWindCore;
  const GeoMapCore = window.SolarCircleGeoMapCore;
  const SavedPlacesRepository = window.SolarCircleSavedPlacesRepository;
  const GlobalSearch = window.SolarCircleGlobalSearch;
  const BackupCore = window.SolarCircleBackupCore;
  if (!CalendarCore) throw new Error('SolarCircleCalendarCore is required before app.js.');
  if (!CalendarGrammar) throw new Error('SolarCircleCalendarGrammar is required before app.js.');
  if (!TimeCore) throw new Error('SolarCircleTimeCore is required before app.js.');
  if (!ProjectMeta) throw new Error('SolarCircleProjectMeta is required before app.js.');
  if (!LocalPersistenceCore) throw new Error('SolarCircleLocalPersistenceCore is required before app.js.');
  if (!DayContext) throw new Error('SolarCircleDayContext is required before app.js.');
  if (!ThemeCore) throw new Error('SolarCircleThemeCore is required before app.js.');
  if (!RouteRegistry) throw new Error('SolarCircleRouteRegistry is required before app.js.');
  if (!EventRepository) throw new Error('SolarCircleEventRepository is required before app.js.');
  if (!NotesRepository) throw new Error('SolarCircleNotesRepository is required before app.js.');
  if (!ReminderRepository) throw new Error('SolarCircleReminderRepository is required before app.js.');
  if (!ReminderNotifications) throw new Error('SolarCircleReminderNotifications is required before app.js.');
  if (!RoutineRepository) throw new Error('SolarCircleRoutineRepository is required before app.js.');
  if (!OfflineEventPack) throw new Error('SolarCircleOfflineEventPack is required before app.js.');
  if (!WeatherProvider) throw new Error('SolarCircleWeatherProvider is required before app.js.');
  if (!WindCore) throw new Error('SolarCircleWindCore is required before app.js.');
  if (!GeoMapCore) throw new Error('SolarCircleGeoMapCore is required before app.js.');
  if (!SavedPlacesRepository) throw new Error('SolarCircleSavedPlacesRepository is required before app.js.');
  if (!GlobalSearch) throw new Error('SolarCircleGlobalSearch is required before app.js.');
  if (!BackupCore) throw new Error('SolarCircleBackupCore is required before app.js.');

  const TEXT = {
    ru:{brand:'Солнечный год',brandSub:'астрономические часы',modeDual:'Оба',modeSolar:'Солнечное',modeCivil:'Обычное',currentDegree:'Текущий градус',solarClock:'Солнечные часы',civilClock:'Обычные часы',degreeProgress:'Прохождение солнечных суток',actualStart:'Начало расчетных суток',actualEnd:'Конец расчетных суток',actualDuration:'Длина солнечных суток',solarSecond:'Одна солнечная секунда',dayLengthClock:'Длина дня',solarHourLength:'1 солнечный час',dayLengthDelta:'К обычным суткам',monthStructure:'Структура месяца',workRule:'Понедельник-четверг — рабочие',restRule:'Суббота-воскресенье — выходные',converterKicker:'Сопоставление систем',converterTitle:'Обычная дата → солнечная',localDateTime:'Местная дата и время',calculate:'Рассчитать',solarDateLabel:'Солнечная дата',solarTimeLabel:'Солнечное время',sunPosition:'Положение Солнца',physicalInterval:'Расчетные солнечные сутки',personalization:'Персонализация',settings:'Настройки',defaultDisplay:'Отображение по умолчанию',defaultDisplayDesc:'Оба времени или только одна система',launchSetting:'Астрономическая заставка',launchSettingDesc:'Показывать текущий градус при запуске',language:'Язык',languageDesc:'Русский используется по умолчанию',appearance:'Оформление',appearanceDesc:'Светлая или тёмная тема',dark:'Тёмная',light:'Светлая',howSolarTimeWorks:'Как работают солнечные часы',howSolarTimeWorksText:'Солнечные сутки остаются привязанными к привычной локальной полуночи. Их астрономическая длина делится на 24 часа, поэтому солнечная секунда немного длиннее или короче обычной, без резкого сдвига времени.',navClock:'Сегодня',navMonth:'Календарь',navSun:'Солнце',navMoon:'Луна',navConvert:'Конвертер',navSettings:'Настройки',navAbout:'О проекте',dateTools:'Даты и конвертер',dateToolsDesc:'Сопоставление обычной и солнечной даты',aboutProject:'О проекте',aboutProjectDesc:'Идея, благодарности, лицензии и контакт',open:'Открыть',sunPanelTitle:'Солнце',sunPathTitle:'Путь Солнца',moonPanelTitle:'Луна',moonCycleTitle:'Лунный цикл',phase:'Фаза',riseSetPendingTitle:'Восход и закат',riseSetPendingText:'Будут подключены отдельным честным SunCore rise/set + ThemeCore шагом, без заглушек.',offlineFirstTitle:'Offline-first',moonNoFakeText:'Лунная модель показывает только рассчитанные или доступные через adapter значения. Недостающие данные не подменяются декоративными числами.',aboutKicker:'О проекте',aboutTitle:'Solar Year',aboutIdeaTitle:'Идея проекта',aboutIdeaText:'Solar Year связывает человека с природным временем, движением Солнца и Луны, погодой и исторической памятью. Это самостоятельный проект, который развивается на основе собственного календарного канона и открытой технологической экосистемы.',aboutTimeCanonTitle:'Зачем нужна новая синхронизация времени',aboutTimeCanonText:'Привычное распределение времени стало культурным архетипом в эпоху механических часов: календарь, часы и движение Солнца существовали рядом, но не могли ежедневно синхронизироваться. Solar Year использует вычисления, чтобы показать календарь, обычное время, солнечное время и длину текущего дня как единую систему.',aboutGratitudeTitle:'Благодарности',aboutGratitudeText:'Solar Year не возник в пустоте. Современное программное обеспечение развивается благодаря разработчикам, исследователям и сообществам, которые открывают исходный код, делятся алгоритмами, создают библиотеки, карты, погодные инструменты и способы визуализации сложных природных процессов.',openSourceTitle:'Open Source / Лицензии',openSourceText:'Упоминание проекта или автора означает признание технологического или информационного вклада через open-source работу. Оно не означает официального партнёрства, трудовых отношений, спонсорства или одобрения Solar Year авторами этих проектов, если такое сотрудничество отдельно не объявлено.',contactTitle:'Контакт и поддержка',publicSignature:'Публичная подпись',publicEmail:'Email',privacyContactText:'Телефон, адрес и другие личные данные в приложение не добавляются.',roleLabel:'Роль в Solar Year',workday:'Рабочий день',weekend:'Выходной',week:'неделя',solarYear:'Солнечный год',launchCalc:'Определяем положение Солнца',launchReady:'Солнечная дата',timezone:'Часовой пояс',physicalSeconds:'обычной секунды',date:'дата'},
    en:{brand:'Solar Year',brandSub:'astronomical clock',modeDual:'Both',modeSolar:'Solar',modeCivil:'Civil',currentDegree:'Current degree',solarClock:'Solar clock',civilClock:'Civil clock',degreeProgress:'Solar day progress',actualStart:'Calculated day start',actualEnd:'Calculated day end',actualDuration:'Solar day length',solarSecond:'One solar second',dayLengthClock:'Day length',solarHourLength:'1 solar hour',dayLengthDelta:'Compared with 24h',monthStructure:'Month structure',workRule:'Monday-Thursday · work',restRule:'Saturday-Sunday · weekend',converterKicker:'System converter',converterTitle:'Civil date → solar date',localDateTime:'Local date and time',calculate:'Calculate',solarDateLabel:'Solar date',solarTimeLabel:'Solar time',sunPosition:'Sun position',physicalInterval:'Calculated solar day',personalization:'Personalization',settings:'Settings',defaultDisplay:'Default display',defaultDisplayDesc:'Both clocks or one time system',launchSetting:'Astronomical launch screen',launchSettingDesc:'Show the current degree at startup',language:'Language',languageDesc:'Russian is used by default',appearance:'Appearance',appearanceDesc:'Light or dark theme',dark:'Dark',light:'Light',howSolarTimeWorks:'How solar time works',howSolarTimeWorksText:'The solar day stays anchored to familiar local midnight. Its astronomical length is divided into 24 hours, so a solar second becomes slightly longer or shorter without a hard time shift.',navClock:'Today',navMonth:'Calendar',navSun:'Sun',navMoon:'Moon',navConvert:'Converter',navSettings:'Settings',navAbout:'About',dateTools:'Dates and converter',dateToolsDesc:'Map civil and solar dates',aboutProject:'About',aboutProjectDesc:'Idea, acknowledgements, licenses, and contact',open:'Open',sunPanelTitle:'Sun',sunPathTitle:'Sun Path',moonPanelTitle:'Moon',moonCycleTitle:'Moon Cycle',phase:'Phase',riseSetPendingTitle:'Sunrise and sunset',riseSetPendingText:'This will be connected in a separate honest SunCore rise/set + ThemeCore step, with no placeholders.',offlineFirstTitle:'Offline-first',moonNoFakeText:'The moon model shows only calculated or adapter-provided values. Missing data is not replaced with decorative numbers.',aboutKicker:'About',aboutTitle:'Solar Year',aboutIdeaTitle:'Project idea',aboutIdeaText:'Solar Year connects people with natural time, the motion of the Sun and Moon, weather, and historical memory. It is an independent project built on its own calendar canon and an open technology ecosystem.',aboutTimeCanonTitle:'Why time needs a new synchronization',aboutTimeCanonText:'The familiar distribution of time became a cultural archetype in the age of mechanical clocks: calendars, clocks, and the Sun moved side by side, but could not be synchronized every day. Solar Year uses computation to show the calendar, civil time, solar time, and the current day length as one system.',aboutGratitudeTitle:'Acknowledgements',aboutGratitudeText:'Solar Year did not appear from nothing. Modern software grows because developers, researchers, and communities open source code, share algorithms, create libraries, maps, weather tools, and ways to visualize complex natural processes.',openSourceTitle:'Open Source / Licenses',openSourceText:'A project or author mention here recognizes a technological or informational contribution through open-source work. It does not imply official partnership, employment, sponsorship, or endorsement of Solar Year by these authors unless such cooperation is announced separately.',contactTitle:'Contact and support',publicSignature:'Public signature',publicEmail:'Email',privacyContactText:'Phone numbers, addresses, and other personal details are not added to the app.',roleLabel:'Role in Solar Year',workday:'Working day',weekend:'Weekend',week:'week',solarYear:'Solar year',launchCalc:'Calculating the Sun position',launchReady:'Solar date',timezone:'Time zone',physicalSeconds:'civil seconds',date:'date'}
  };
  TEXT.ru.autoSun = 'Авто (Солнце)';
  TEXT.ru.appearanceDesc = 'Светлая, темная или авто по Солнцу';
  TEXT.ru.localNotifications = 'Уведомления';
  TEXT.ru.notificationStatusChecking = 'Проверяем статус';
  TEXT.ru.notificationUnavailable = 'Недоступно';
  TEXT.ru.notificationPermissionRequired = 'Нужно разрешение Android';
  TEXT.ru.notificationReady = 'Готово';
  TEXT.ru.notificationNoReminders = 'Нет напоминаний с временем';
  TEXT.ru.notificationError = 'Ошибка уведомлений';
  TEXT.ru.enableNotifications = 'Включить';
  TEXT.ru.syncNotifications = 'Обновить';
  TEXT.en.autoSun = 'Auto Sun';
  TEXT.en.appearanceDesc = 'Light, dark, or automatic by Sun';
  TEXT.en.localNotifications = 'Notifications';
  TEXT.en.notificationStatusChecking = 'Checking status';
  TEXT.en.notificationUnavailable = 'Unavailable';
  TEXT.en.notificationPermissionRequired = 'Android permission needed';
  TEXT.en.notificationReady = 'Ready';
  TEXT.en.notificationNoReminders = 'No timed reminders';
  TEXT.en.notificationError = 'Notification error';
  TEXT.en.enableNotifications = 'Enable';
  TEXT.en.syncNotifications = 'Refresh';
  TEXT.ru.todayIntegratedKicker = 'День целиком';
  TEXT.ru.todayIntegratedTitle = 'Сегодня';
  TEXT.ru.todayIntegratedEmpty = 'Пока пусто';
  TEXT.ru.todayEvents = 'События';
  TEXT.ru.todayNotes = 'Заметки';
  TEXT.ru.todayReminders = 'Напоминания';
  TEXT.ru.todayRoutine = 'Режим';
  TEXT.ru.doneStatus = 'Выполнено';
  TEXT.ru.plannedStatus = 'План';
  TEXT.ru.datesEventsTitle = 'В этот день';
  TEXT.ru.noEventsForDay = 'Нет событий';
  TEXT.ru.eventSources = 'Источники';
  TEXT.ru.locationTitle = 'Местоположение и время';
  TEXT.ru.locationDesc = 'Место не выбрано';
  TEXT.ru.citySearch = 'Город';
  TEXT.ru.getGps = 'Получить GPS';
  TEXT.ru.gpsSaved = 'GPS: сохранённая позиция';
  TEXT.ru.timezoneMode = 'Выбор часового пояса';
  TEXT.ru.timezoneAuto = 'По местоположению';
  TEXT.ru.locationPrivacy = 'GPS только по запросу, без фонового отслеживания. Поиск города отправляет запрос Open-Meteo, обновление погоды отправляет координаты.';
  TEXT.ru.gpsWaiting = 'Определяем координаты...';
  TEXT.ru.gpsFailed = 'GPS недоступен. Проверьте разрешение и геолокацию телефона или укажите место вручную.';
  TEXT.ru.cityWaiting = 'Ищем город...';
  TEXT.ru.cityEmpty = 'Город не найден';
  TEXT.ru.cityFailed = 'Поиск недоступен. Можно указать координаты вручную.';
  TEXT.ru.invalidLocation = 'Проверьте координаты и часовой пояс';
  TEXT.ru.locationMode = 'Режим';
  TEXT.ru.locationAuto = 'Устройство';
  TEXT.ru.locationManual = 'Вручную';
  TEXT.ru.latitude = 'Широта';
  TEXT.ru.longitude = 'Долгота';
  TEXT.ru.saveLocation = 'Сохранить';
  TEXT.ru.locationDeviceMode = 'Используется системный часовой пояс';
  TEXT.ru.locationReady = 'Координаты сохранены';
  TEXT.ru.locationNeedsCoords = 'Нужны широта и долгота';
  TEXT.ru.privacyTitle = 'Приватность';
  TEXT.ru.privacyText = 'Личные данные остаются в локальном хранилище устройства';
  TEXT.ru.offlineOnly = 'Offline-only';
  TEXT.ru.dataSourcesTitle = 'Источники данных';
  TEXT.ru.sourceStatusReady = 'Offline-pack готов';
  TEXT.ru.addNote = 'Заметка';
  TEXT.ru.addReminder = 'Напоминание';
  TEXT.ru.addRoutine = 'Режим';
  TEXT.ru.edit = 'Править';
  TEXT.ru.delete = 'Удалить';
  TEXT.ru.cancel = 'Отмена';
  TEXT.ru.save = 'Сохранить';
  TEXT.ru.titleLabel = 'Название';
  TEXT.ru.noteTextLabel = 'Текст';
  TEXT.ru.reminderTextLabel = 'Текст';
  TEXT.ru.routineTextLabel = 'Описание';
  TEXT.ru.attachTo = 'Привязать к';
  TEXT.ru.attachBoth = 'Обеим датам';
  TEXT.ru.timeLabel = 'Время';
  TEXT.ru.recurrenceScope = 'Календарь';
  TEXT.ru.recurrenceFrequency = 'Повтор';
  TEXT.ru.once = 'Один раз';
  TEXT.ru.daily = 'Ежедневно';
  TEXT.ru.weekly = 'Еженедельно';
  TEXT.ru.monthly = 'Ежемесячно';
  TEXT.ru.yearly = 'Ежегодно';
  TEXT.ru.enabledLabel = 'Активно';
  TEXT.ru.enabledYes = 'Да';
  TEXT.ru.enabledNo = 'Нет';
  TEXT.ru.routineKindLabel = 'Категория';
  TEXT.ru.categoryWork = 'Работа';
  TEXT.ru.categoryRest = 'Отдых';
  TEXT.ru.todayRoutine = 'С отметкой выполнения';
  TEXT.ru.addRoutine = 'Напоминание';
  TEXT.ru.searchTypeRoutine = 'С отметкой выполнения';
  TEXT.ru.habit = 'Привычка';
  TEXT.ru.training = 'Тренировка';
  TEXT.ru.recovery = 'Восстановление';
  TEXT.ru.ritual = 'Ритуал';
  TEXT.ru.durationLabel = 'Минуты';
  TEXT.ru.markDone = 'Выполнено';
  TEXT.ru.markSkipped = 'Пропустить';
  TEXT.ru.dayDetailTitle = 'День';
  TEXT.ru.dayDetailEmpty = 'На этот день пока ничего не добавлено';
  TEXT.ru.sunrise = 'Восход';
  TEXT.ru.sunset = 'Закат';
  TEXT.ru.solarNoon = 'Полдень';
  TEXT.ru.daylightStatus = 'Световой статус';
  TEXT.ru.twilightTitle = 'Сумерки';
  TEXT.ru.civilDawn = 'Гражданский рассвет';
  TEXT.ru.civilDusk = 'Гражданские сумерки';
  TEXT.ru.nauticalDawn = 'Навигационный рассвет';
  TEXT.ru.nauticalDusk = 'Навигационные сумерки';
  TEXT.ru.dataReady = 'Данные готовы';
  TEXT.ru.dataPartial = 'Частично';
  TEXT.ru.dataUnavailable = 'Недоступно';
  TEXT.ru.moonrise = 'Восход Луны';
  TEXT.ru.moonset = 'Заход Луны';
  TEXT.ru.moonTransit = 'Кульминация';
  TEXT.ru.eclipticLongitude = 'Эклиптическая долгота';
  TEXT.ru.eclipticLatitude = 'Эклиптическая широта';
  TEXT.ru.moonDataStatus = 'Статус данных';
  TEXT.ru.weatherTitle = 'Погода';
  TEXT.ru.refreshWeather = 'Обновить';
  TEXT.ru.weatherNeedsLocation = 'Нужна ручная локация';
  TEXT.ru.weatherNoCache = 'Нет кэша';
  TEXT.ru.weatherFresh = 'Свежие данные';
  TEXT.ru.weatherCached = 'Кэш';
  TEXT.ru.weatherOfflineCache = 'Офлайн: кэш';
  TEXT.ru.weatherError = 'Ошибка погоды';
  TEXT.ru.feelsLike = 'Ощущается';
  TEXT.ru.wind = 'Ветер';
  TEXT.ru.humidity = 'Влажность';
  TEXT.ru.precipitation = 'Осадки';
  TEXT.ru.sourcesKicker = 'Реестр';
  TEXT.ru.sourceEvents = 'События';
  TEXT.ru.sourceWeather = 'Погода';
  TEXT.ru.sourceWind = 'Ветер';
  TEXT.ru.sourceGeoMap = 'Карта';
  TEXT.ru.sourceBackup = 'Backup';
  TEXT.ru.sourceAstronomy = 'Астрономия';
  TEXT.ru.sourceLicenses = 'Лицензии';
  TEXT.en.todayIntegratedKicker = 'Whole day';
  TEXT.en.todayIntegratedTitle = 'Today';
  TEXT.en.todayIntegratedEmpty = 'Empty for now';
  TEXT.en.todayEvents = 'Events';
  TEXT.en.todayNotes = 'Notes';
  TEXT.en.todayReminders = 'Reminders';
  TEXT.en.todayRoutine = 'Routine';
  TEXT.en.doneStatus = 'Done';
  TEXT.en.plannedStatus = 'Plan';
  TEXT.en.datesEventsTitle = 'On this day';
  TEXT.en.noEventsForDay = 'No events';
  TEXT.en.eventSources = 'Sources';
  TEXT.en.locationTitle = 'Location and time';
  TEXT.en.locationDesc = 'No location selected';
  TEXT.en.citySearch = 'City';
  TEXT.en.getGps = 'Get GPS location';
  TEXT.en.gpsSaved = 'GPS: saved position';
  TEXT.en.timezoneMode = 'Time zone selection';
  TEXT.en.timezoneAuto = 'From location';
  TEXT.en.locationPrivacy = 'GPS on request only, no background tracking. City search sends a query to Open-Meteo; weather refresh sends coordinates.';
  TEXT.en.gpsWaiting = 'Getting coordinates...';
  TEXT.en.gpsFailed = 'GPS unavailable. Check location permission and device location, or set a place manually.';
  TEXT.en.cityWaiting = 'Searching cities...';
  TEXT.en.cityEmpty = 'No cities found';
  TEXT.en.cityFailed = 'Search unavailable. Coordinates can be entered manually.';
  TEXT.en.invalidLocation = 'Check coordinates and time zone';
  TEXT.en.locationMode = 'Mode';
  TEXT.en.locationAuto = 'Device';
  TEXT.en.locationManual = 'Manual';
  TEXT.en.latitude = 'Latitude';
  TEXT.en.longitude = 'Longitude';
  TEXT.en.saveLocation = 'Save';
  TEXT.en.locationDeviceMode = 'System timezone is used';
  TEXT.en.locationReady = 'Coordinates saved';
  TEXT.en.locationNeedsCoords = 'Latitude and longitude are required';
  TEXT.en.privacyTitle = 'Privacy';
  TEXT.en.privacyText = 'Personal data stays in local device storage';
  TEXT.en.offlineOnly = 'Offline-only';
  TEXT.en.dataSourcesTitle = 'Data sources';
  TEXT.en.sourceStatusReady = 'Offline pack ready';
  TEXT.en.addNote = 'Note';
  TEXT.en.addReminder = 'Reminder';
  TEXT.en.addRoutine = 'Routine';
  TEXT.en.edit = 'Edit';
  TEXT.en.delete = 'Delete';
  TEXT.en.cancel = 'Cancel';
  TEXT.en.save = 'Save';
  TEXT.en.titleLabel = 'Title';
  TEXT.en.noteTextLabel = 'Text';
  TEXT.en.reminderTextLabel = 'Text';
  TEXT.en.routineTextLabel = 'Description';
  TEXT.en.attachTo = 'Attach to';
  TEXT.en.attachBoth = 'Both dates';
  TEXT.en.timeLabel = 'Time';
  TEXT.en.recurrenceScope = 'Calendar';
  TEXT.en.recurrenceFrequency = 'Repeat';
  TEXT.en.once = 'Once';
  TEXT.en.daily = 'Daily';
  TEXT.en.weekly = 'Weekly';
  TEXT.en.monthly = 'Monthly';
  TEXT.en.yearly = 'Yearly';
  TEXT.en.enabledLabel = 'Active';
  TEXT.en.enabledYes = 'Yes';
  TEXT.en.enabledNo = 'No';
  TEXT.en.routineKindLabel = 'Category';
  TEXT.en.categoryWork = 'Work';
  TEXT.en.categoryRest = 'Rest';
  TEXT.en.todayRoutine = 'Completion tracking';
  TEXT.en.addRoutine = 'Reminder';
  TEXT.en.searchTypeRoutine = 'Completion tracking';
  TEXT.en.habit = 'Habit';
  TEXT.en.training = 'Training';
  TEXT.en.recovery = 'Recovery';
  TEXT.en.ritual = 'Ritual';
  TEXT.en.durationLabel = 'Minutes';
  TEXT.en.markDone = 'Done';
  TEXT.en.markSkipped = 'Skip';
  TEXT.en.dayDetailTitle = 'Day';
  TEXT.en.dayDetailEmpty = 'Nothing added for this day yet';
  TEXT.en.sunrise = 'Sunrise';
  TEXT.en.sunset = 'Sunset';
  TEXT.en.solarNoon = 'Solar noon';
  TEXT.en.daylightStatus = 'Daylight status';
  TEXT.en.twilightTitle = 'Twilight';
  TEXT.en.civilDawn = 'Civil dawn';
  TEXT.en.civilDusk = 'Civil dusk';
  TEXT.en.nauticalDawn = 'Nautical dawn';
  TEXT.en.nauticalDusk = 'Nautical dusk';
  TEXT.en.dataReady = 'Ready';
  TEXT.en.dataPartial = 'Partial';
  TEXT.en.dataUnavailable = 'Unavailable';
  TEXT.en.moonrise = 'Moonrise';
  TEXT.en.moonset = 'Moonset';
  TEXT.en.moonTransit = 'Transit';
  TEXT.en.eclipticLongitude = 'Ecliptic longitude';
  TEXT.en.eclipticLatitude = 'Ecliptic latitude';
  TEXT.en.moonDataStatus = 'Data status';
  TEXT.en.weatherTitle = 'Weather';
  TEXT.en.refreshWeather = 'Refresh';
  TEXT.en.weatherNeedsLocation = 'Manual location required';
  TEXT.en.weatherNoCache = 'No cache';
  TEXT.en.weatherFresh = 'Fresh data';
  TEXT.en.weatherCached = 'Cache';
  TEXT.en.weatherOfflineCache = 'Offline cache';
  TEXT.en.weatherError = 'Weather error';
  TEXT.en.feelsLike = 'Feels like';
  TEXT.en.wind = 'Wind';
  TEXT.en.humidity = 'Humidity';
  TEXT.en.precipitation = 'Precipitation';
  TEXT.en.sourcesKicker = 'Registry';
  TEXT.en.sourceEvents = 'Events';
  TEXT.en.sourceWeather = 'Weather';
  TEXT.en.sourceWind = 'Wind';
  TEXT.en.sourceGeoMap = 'Map';
  TEXT.en.sourceBackup = 'Backup';
  TEXT.en.sourceAstronomy = 'Astronomy';
  TEXT.en.sourceLicenses = 'Licenses';
  TEXT.ru.navMore = 'Ещё';
  TEXT.ru.moreKicker = 'Разделы';
  TEXT.ru.moreTitle = 'Ещё';
  TEXT.ru.localMode = 'Локальный режим';
  TEXT.ru.weatherKicker = 'Open-Meteo';
  TEXT.ru.cloudCover = 'Облачность';
  TEXT.ru.updatedAt = 'Обновлено';
  TEXT.ru.hourlyForecast = 'По часам';
  TEXT.ru.dailyForecast = 'По дням';
  TEXT.ru.forecastUnavailable = 'Прогноз недоступен';
  TEXT.ru.windTitle = 'Ветер';
  TEXT.ru.windHeight = 'Прогноз · 10 м';
  TEXT.ru.windNow = 'Сейчас';
  TEXT.ru.windDailyTitle = 'По дням · максимумы';
  Object.assign(TEXT.ru,{windFavoriteOne:'Избранное 1',windFavoriteTwo:'Избранное 2',windFavorites:'Избранные места',windRefreshAll:'Обновить все',windFavorite:'Избранное для погоды и ветра',windCurrentPlace:'Текущая',windChoosePlace:'Выберите место',windFavoritesLimit:'Можно выбрать не более 5 избранных мест',citySearchLabel:'Город'});
  TEXT.ru.windKicker = 'Потоки';
  TEXT.ru.windSpeed = 'Скорость';
  TEXT.ru.windDirection = 'Направление';
  TEXT.ru.windGust = 'Порыв';
  TEXT.ru.windUnavailable = 'Ветер недоступен';
  TEXT.ru.mapLayersTitle = 'Карта';
  TEXT.ru.mapLayerBase = 'Основа';
  TEXT.ru.mapLayerLocation = 'Локация';
  TEXT.ru.mapLayerWeather = 'Погода';
  TEXT.ru.mapLayerWind = 'Ветер';
  TEXT.ru.mapLayerStations = 'Станции';
  TEXT.ru.mapNeedsLocation = 'Нужна локация';
  TEXT.ru.savedPlacesTitle = 'Места';
  TEXT.ru.addPlace = 'Добавить';
  TEXT.ru.placeKind = 'Тип';
  TEXT.ru.placeHome = 'Дом';
  TEXT.ru.placeWork = 'Работа';
  TEXT.ru.placeCustom = 'Место';
  TEXT.ru.activePlace = 'Активное';
  TEXT.ru.activePlaceStatus = 'Активное место';
  TEXT.ru.placeEmpty = 'Места не сохранены';
  TEXT.ru.setActive = 'Активировать';
  TEXT.ru.searchTitle = 'Поиск';
  TEXT.ru.searchInputLabel = 'Запрос';
  TEXT.ru.searchEmpty = 'Ничего не найдено';
  TEXT.ru.searchTypeEvent = 'Событие';
  TEXT.ru.searchTypeNote = 'Заметка';
  TEXT.ru.searchTypeReminder = 'Напоминание';
  TEXT.ru.searchTypeRoutine = 'С отметкой выполнения';
  TEXT.ru.searchTypePlace = 'Место';
  TEXT.ru.searchTypeSource = 'Источник';
  TEXT.ru.searchTypeWeather = 'Погода';
  TEXT.ru.searchTypeWind = 'Ветер';
  TEXT.ru.backupTitle = 'Backup';
  TEXT.ru.exportBackup = 'Экспорт';
  TEXT.ru.importBackup = 'Импорт';
  TEXT.ru.backupPayloadLabel = 'Данные';
  TEXT.ru.backupReady = 'Готово';
  TEXT.ru.backupImported = 'Импортировано';
  TEXT.ru.backupInvalid = 'Ошибка backup';
  TEXT.en.navMore = 'More';
  TEXT.en.moreKicker = 'Sections';
  TEXT.en.moreTitle = 'More';
  TEXT.en.localMode = 'Local mode';
  TEXT.en.weatherKicker = 'Open-Meteo';
  TEXT.en.cloudCover = 'Cloud cover';
  TEXT.en.updatedAt = 'Updated';
  TEXT.en.hourlyForecast = 'Hourly';
  TEXT.en.dailyForecast = 'Daily';
  TEXT.en.forecastUnavailable = 'Forecast unavailable';
  TEXT.en.windTitle = 'Wind';
  TEXT.en.windHeight = 'Forecast · 10 m';
  TEXT.en.windNow = 'Now';
  TEXT.en.windDailyTitle = 'Daily · maximums';
  Object.assign(TEXT.en,{windFavoriteOne:'Favorite 1',windFavoriteTwo:'Favorite 2',windFavorites:'Favorite places',windRefreshAll:'Refresh all',windFavorite:'Weather and wind favorite',windCurrentPlace:'Current',windChoosePlace:'Select a place',windFavoritesLimit:'You can choose up to 5 favorite places',citySearchLabel:'City'});
  TEXT.en.windKicker = 'Airflow';
  TEXT.en.windSpeed = 'Speed';
  TEXT.en.windDirection = 'Direction';
  TEXT.en.windGust = 'Gust';
  TEXT.en.windUnavailable = 'Wind unavailable';
  TEXT.en.mapLayersTitle = 'Map';
  TEXT.en.mapLayerBase = 'Base';
  TEXT.en.mapLayerLocation = 'Location';
  TEXT.en.mapLayerWeather = 'Weather';
  TEXT.en.mapLayerWind = 'Wind';
  TEXT.en.mapLayerStations = 'Stations';
  TEXT.en.mapNeedsLocation = 'Location needed';
  TEXT.en.savedPlacesTitle = 'Places';
  TEXT.en.addPlace = 'Add';
  TEXT.en.placeKind = 'Type';
  TEXT.en.placeHome = 'Home';
  TEXT.en.placeWork = 'Work';
  TEXT.en.placeCustom = 'Place';
  TEXT.en.activePlace = 'Active';
  TEXT.en.activePlaceStatus = 'Active place';
  TEXT.en.placeEmpty = 'No saved places';
  TEXT.en.setActive = 'Set active';
  TEXT.en.searchTitle = 'Search';
  TEXT.en.searchInputLabel = 'Query';
  TEXT.en.searchEmpty = 'No results';
  TEXT.en.searchTypeEvent = 'Event';
  TEXT.en.searchTypeNote = 'Note';
  TEXT.en.searchTypeReminder = 'Reminder';
  TEXT.en.searchTypeRoutine = 'Routine';
  TEXT.en.searchTypePlace = 'Place';
  TEXT.en.searchTypeSource = 'Source';
  TEXT.en.searchTypeWeather = 'Weather';
  TEXT.en.searchTypeWind = 'Wind';
  TEXT.en.backupTitle = 'Backup';
  TEXT.en.exportBackup = 'Export';
  TEXT.en.importBackup = 'Import';
  TEXT.en.backupPayloadLabel = 'Data';
  TEXT.en.backupReady = 'Ready';
  TEXT.en.backupImported = 'Imported';
  TEXT.en.backupInvalid = 'Backup error';
  Object.assign(TEXT.ru, {
    researchTitle:'Маркетинговое исследование',researchInvitation:'Предлагаем принять участие в маркетинговом исследовании.',
    researchFields:'Примерный район с шагом 0,5°, часовой пояс, язык, версия приложения, Android или web, дата и случайный ID участника.',
    researchExclusions:'Без точного GPS, имени, контактов, заметок и напоминаний. Хранится только последняя запись, до 30 дней.',
    researchNoServer:'Сервер ещё не подключён. Сейчас данные остаются на устройстве. Перед первой отправкой потребуется новое согласие с адресом получателя.',
    researchParticipate:'Участвовать',researchConfirm:'Подтвердить выбор',researchDecline:'Не участвовать',researchDelete:'Отключить и удалить данные',researchPreview:'Подготовленные данные',
    researchPending:'Предлагаем принять участие. Данные не собираются до подтверждения.',researchLocal:'Включено локально. Отправка отключена.',researchOff:'Участие отключено. Данных нет.'
  });
  Object.assign(TEXT.en, {
    researchTitle:'Marketing research',researchInvitation:'We invite you to take part in marketing research.',
    researchFields:'Approximate area on a 0.5° grid, time zone, language, app version, Android or web, date and a random participant ID.',
    researchExclusions:'No precise GPS, name, contacts, notes or reminders. Only the latest record is kept, for up to 30 days.',
    researchNoServer:'The server is not connected. Data stays on this device. New consent naming the recipient will be required before any upload.',
    researchParticipate:'Participate',researchConfirm:'Confirm choice',researchDecline:'Do not participate',researchDelete:'Disable and delete data',researchPreview:'Prepared data',
    researchPending:'You are invited to participate. No collection before confirmation.',researchLocal:'Enabled locally. Upload is disabled.',researchOff:'Participation is off. No data stored.'
  });

  const $ = id => document.getElementById(id);
  const setText = (id,value) => { const el=$(id); if(el)el.textContent=value; };
  const pad = TimeCore.pad;
  const settingsStore = LocalPersistenceCore.createJsonStore(LocalPersistenceCore.createAutoAdapter(), { namespace: 'solar-circle-ui' });
  const personalStore = LocalPersistenceCore.createJsonStore(LocalPersistenceCore.createAutoAdapter(), { namespace: 'solar-circle' });
  const weatherStore = LocalPersistenceCore.createJsonStore(LocalPersistenceCore.createAutoAdapter(), { namespace: 'solar-circle-weather' });
  const placesStore = LocalPersistenceCore.createJsonStore(LocalPersistenceCore.createAutoAdapter(), { namespace: 'solar-circle-places' });
  const researchStore = LocalPersistenceCore.createJsonStore(LocalPersistenceCore.createAutoAdapter(), { namespace: 'solar-circle-research' });
  const research = ResearchCore.createService(researchStore);
  const eventRepository = EventRepository.createPackRepository(OfflineEventPack);
  const notesRepository = NotesRepository.createPersistentRepository(personalStore);
  const monthRepository = window.SolarCircleMonthPersonalizationRepository.createRepository(personalStore, { notes: notesRepository });
  let monthView = null;
  let personalRestoreBusy = false;
  const reminderRepository = ReminderRepository.createPersistentRepository(personalStore);
  const routineRepository = RoutineRepository.createPersistentRepository(personalStore);
  const savedPlacesRepository = SavedPlacesRepository.createPersistentRepository(placesStore);
  const weatherProvider = WeatherProvider.createProvider(weatherStore);
  const reminderNotifications = ReminderNotifications.createService({
    reminderRepository,
    dayContext: DayContext,
    language: () => language
  });
  const storedValues = Object.create(null);
  const DEFAULT_SETTINGS = Object.freeze({
    'solar-language': 'ru',
    'solar-theme': 'dark',
    'solar-theme-mode': 'dark',
    'solar-resolved-theme': 'dark',
    'solar-display-mode': 'dual',
    'solar-show-launch': 'true',
    'solar-location-mode': 'device',
    'solar-location-latitude': '',
    'solar-location-longitude': '',
    'solar-location-timezone': '',
    'solar-timezone-mode': 'auto',
    'solar-timezone-override': '',
    'solar-wind-unit': 'm/s',
    'solar-wind-active-slot': '0',
    'solar-wind-slot-1': '',
    'solar-wind-slot-2': '',
    'solar-vyboria-enabled': 'true'
  });
  const hasStored = key => Object.prototype.hasOwnProperty.call(storedValues, key);
  const getStored = key => hasStored(key) ? storedValues[key] : DEFAULT_SETTINGS[key];
  const setStored = (key,value) => {
    if (storedValues[key] === String(value)) return;
    storedValues[key]=String(value);
    settingsStore.save('settings', { ...storedValues }).catch(() => {});
  };

  let language = getStored('solar-language');
  let themeMode = ThemeCore.normalizeMode(getStored('solar-theme-mode') || getStored('solar-theme'));
  let theme = ThemeCore.normalizeResolvedTheme(getStored('solar-resolved-theme') || themeMode);
  let displayMode = getStored('solar-display-mode');
  let showLaunch = getStored('solar-show-launch') !== 'false';
  let latestData = null;
  let latestNotificationSync = null;
  let latestWeather = null;
  let latestWind = null;
  let selectedDayData = null;
  let calendarCursor = null;
  let calendarRows = [];
  Object.assign(TEXT.ru,{calendarYearLabel:'Год',calendarMonthLabel:'Месяц',calendarDayLabel:'День',previousMonth:'Предыдущий месяц',nextMonth:'Следующий месяц',calendarHistory:'События месяца',calendarEmpty:'В offline-паке нет событий на этот месяц',originalDate:'Исходная дата',openOriginalDate:'Открыть исходную дату',recordChoice:'Записать выбор',calendarUnavailable:'Не удалось рассчитать месяц',dateRequired:'Выберите корректную дату',civilDates:'Обычные даты',sourceLink:'Источник'});
  Object.assign(TEXT.en,{calendarYearLabel:'Year',calendarMonthLabel:'Month',calendarDayLabel:'Day',previousMonth:'Previous month',nextMonth:'Next month',calendarHistory:'Month events',calendarEmpty:'No events for this month in the offline pack',originalDate:'Original date',openOriginalDate:'Open original date',recordChoice:'Record a choice',calendarUnavailable:'Could not calculate this month',dateRequired:'Choose a valid date',civilDates:'Civil dates',sourceLink:'Source'});
  let activeRoute = 'today';
  let activeScreen = RouteRegistry.requireRoute(activeRoute).domScreenId;
  let pendingNotificationDate = null;
  let notificationNavigationReady = false;
  let favoritePlaceMode = false;
  let placeCityRequest = 0;
  let favoriteTargetSlot = null;

  const t = key => TEXT[language][key] || TEXT.ru[key] || key;
  const locale = () => language === 'ru' ? 'ru-RU' : 'en-GB';
  const windFavorites = () => savedPlacesRepository.all().filter(place=>place.favorite);
  const windActiveSlot = () => [0,1,2].includes(Number(getStored('solar-wind-active-slot')))?Number(getStored('solar-wind-active-slot')):0;
  function windCurrentPlace(){
    const location=manualLocation(new Date());
    return {location,weather:latestWeather,title:location?(savedPlacesRepository.active()?.title||getStored('solar-location-title')||`${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`):t('weatherNeedsLocation')};
  }
  const windLocations = window.SolarCircleWindLocations.createController({
    provider:weatherProvider,current:windCurrentPlace,favorites:windFavorites,
    selection:()=>[getStored('solar-wind-slot-1'),getStored('solar-wind-slot-2')],
    refreshCurrent:()=>refreshWeather(),onChange:()=>{if(activeScreen==='wind')renderWindPanels();}
  });
  const windView = window.SolarCircleWindView.createView({
    onUnitChange: unit => { setStored('solar-wind-unit',unit);renderWeatherPanels();if(latestData)renderTodayIntegrated(latestData); },
    onRefresh: () => windLocations.refresh(windActiveSlot()),
    onLocation: () => {const context=windLocations.contexts()[windActiveSlot()];if(context.current)openScreen('settings');else{openScreen('places');openPlaceEditor(context.id);}}
  });

  function deviceTimezoneName(){return TimeCore.timezoneName('UTC');}
  function currentTimezoneName(){
    const override=getStored('solar-timezone-override');
    if(getStored('solar-timezone-mode')==='manual'&&TimeCore.validTimezone(override))return override;
    const place=getStored('solar-location-mode')!=='device'?savedPlacesRepository.active():null;
    return place?.timezone||(getStored('solar-location-mode')!=='device'?getStored('solar-location-timezone'):null)||deviceTimezoneName();
  }
  function storedNumber(key){const raw=getStored(key);if(raw===undefined||raw===null||String(raw).trim()==='')return null;const value=Number(raw);return Number.isFinite(value)?value:null;}
  function manualLocation(date){
    if(getStored('solar-location-mode')==='device')return null;
    const activePlace=savedPlacesRepository.active();
    if(activePlace)return {...SavedPlacesRepository.locationFromPlace(activePlace,date),timezone:currentTimezoneName()};
    const latitude=storedNumber('solar-location-latitude'),longitude=storedNumber('solar-location-longitude');
    if(latitude===null||longitude===null||latitude<-90||latitude>90||longitude<-180||longitude>180)return null;
    return {latitude,longitude,timezone:currentTimezoneName(),source:getStored('solar-location-mode'),date};
  }
  function dayContextOptions(date){return {eventRepository,notesRepository,reminderRepository,routineRepository,weather:latestWeather,wind:latestWind,location:manualLocation(date)||{timezone:currentTimezoneName(),source:'device'},language};}
  function defaultSolarData(date){return DayContext.dayContext(date).display.clock;}
  function getSolarData(date){
    return DayContext.dayContext(date,dayContextOptions(date)).display.clock;
  }

  function formatDateTime(date,seconds=true){ return TimeCore.formatDateTime(date,locale(),seconds,currentTimezoneName()); }
  function fullSolarDate(data){ return monthView ? monthView.fullSolarDate(data) : CalendarGrammar.fullSolarDate(data,language); }
  function formatCivilDate(date){ return TimeCore.formatCivilDate(date,locale(),currentTimezoneName()); }
  function formatDuration(ms){return TimeCore.formatDuration(ms,language);}
  function formatSecond(ms){return TimeCore.formatPhysicalSecond(ms,language);}
  function formatDurationClock(ms){const total=Math.max(0,Math.round(ms/1000));const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;return `${pad(h)}:${pad(m)}:${pad(s)}`;}
  function formatSignedDuration(ms){const sign=ms>=0?'+':'-';return `${sign}${formatDurationClock(Math.abs(ms))}`;}
  function preciseDegree(value){const d=Math.floor(value),minutes=(value-d)*60,m=Math.floor(minutes),s=(minutes-m)*60;return `${d}° ${pad(m)}′ ${s.toFixed(1).padStart(4,'0')}″`;}
  function inputValue(date){return TimeCore.inputValue(date,currentTimezoneName());}

  function notificationStatusText(result){
    if(!result||result.status==='checking')return t('notificationStatusChecking');
    if(result.status==='unavailable')return t('notificationUnavailable');
    if(result.status==='permission-required')return t('notificationPermissionRequired');
    if(result.status==='ready')return t('notificationNoReminders');
    if(result.status==='scheduled')return `${t('notificationReady')}: ${result.scheduled}`;
    return t('notificationError');
  }
  function renderNotificationStatus(result){
    latestNotificationSync=result;setText('notificationStatus',notificationStatusText(result));
    const button=$('notificationEnableButton');if(button){button.disabled=result?.status==='checking';button.textContent=result?.permission?.display==='granted'?t('syncNotifications'):t('enableNotifications');}
  }
  function solarForReminderNotificationDate(date){
    try { return DayContext.solarDateForDate(date); } catch { return null; }
  }
  async function syncReminderNotifications(requestPermission=false){
    renderNotificationStatus({status:'checking'});
    try {
      const result=await reminderNotifications.sync({requestPermission,language,timezone:currentTimezoneName(),solarForDate:solarForReminderNotificationDate});
      renderNotificationStatus(result);return result;
    } catch (error) {
      const result={status:'error',permission:{display:'unknown'},scheduled:0,cancelled:0,error};
      renderNotificationStatus(result);return result;
    }
  }

  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function localized(value,fallback=''){
    if(typeof value==='string')return value;
    if(value&&typeof value==='object')return value[language]||value.ru||value.en||fallback;
    return fallback;
  }
  function itemTitle(item){return localized(item?.title,item?.id||'');}
  function eventLine(event){
    const title=escapeHtml(itemTitle(event));const description=escapeHtml(localized(event.description,''));const source=escapeHtml(event.source?.name||event.sourceId||'');
    return `<article class="day-event-item ${event.category||'history'}"><strong>${title}</strong>${description?`<p>${description}</p>`:''}${source?`<small>${source}</small>`:''}</article>`;
  }
  function personalLine(item,meta=''){
    const title=escapeHtml(itemTitle(item));const text=escapeHtml(item.text||'');const small=escapeHtml(meta||item.timeOfDay||'');
    return `<article class="integrated-domain-line"><strong>${title}</strong>${small?`<span>${small}</span>`:''}${text?`<small>${text}</small>`:''}</article>`;
  }
  function renderEventList(root,events){
    if(!root)return;
    root.innerHTML=events.length?events.map(eventLine).join(''):`<p class="inline-empty">${t('noEventsForDay')}</p>`;
  }
  function renderDateEvents(data){
    const events=data?.events||[];
    setText('convertEventMeta',`${t('eventSources')}: ${eventRepository.source.sourceCount||0} · ${OfflineEventPack.version}`);
    setText('convertEventCount',String(events.length));
    renderEventList($('convertEventsList'),events);
  }
  function todayCard(labelKey,items,formatter,extra=''){
    const count=items.length;const body=count?`<div class="integrated-domain-list">${items.slice(0,3).map(formatter).join('')}</div>`:`<p>${t('todayIntegratedEmpty')}</p>`;
    return `<article class="integrated-domain-card ${count?'':'is-empty'}"><div><strong>${t(labelKey)}</strong><span>${extra||count}</span></div>${body}</article>`;
  }
  function locationStatusAction(state,label){
    return state?.status==='needs-location'?`<button type="button" class="location-settings-action" data-open-location-settings title="${escapeHtml(`${t('settings')}: ${t('locationTitle')}`)}">${escapeHtml(label)}</button>`:`<span>${escapeHtml(label)}</span>`;
  }
  function todayWeatherCard(){
    return `<article class="integrated-domain-card ${latestWeather?.value?'':'is-empty'}"><div><strong>${t('weatherTitle')}</strong>${locationStatusAction(latestWeather,weatherStatusText(latestWeather))}</div><div class="integrated-domain-list">${weatherLine(latestWeather)}</div></article>`;
  }
  function renderTodayIntegrated(data){
    const events=data?.events||[],notes=data?.notes||[],reminders=data?.reminders||[],routine=data?.routine||[];
    setText('todayIntegratedMeta',`${formatCivilDate(data.date)} · ${fullSolarDate(data)}`);
    const root=$('todayIntegratedGrid');if(!root)return;
    root.innerHTML=[
      todayCard('todayEvents',events,eventLine),
      todayCard('todayNotes',notes,item=>personalLine(item)),
      todayCard('todayReminders',[...reminders,...routine].sort((a,b)=>(a.timeOfDay||'99').localeCompare(b.timeOfDay||'99')),item=>personalLine(item,[categoryLabel(personalCategory(item)),item.timeOfDay,item.isDone?t('doneStatus'):t('plannedStatus')].filter(Boolean).join(' · '))),
      todayWeatherCard(),
      todayWindCard()
    ].join('');
  }
  function renderSourceStatus(){
    setText('sourceStatus',`${t('sourceStatusReady')}: ${eventRepository.source.eventCount||0} · ${t('eventSources')}: ${eventRepository.source.sourceCount||0}`);
    renderSourceRegistry();
  }
  function renderLocationSettings(){
    const mode=getStored('solar-location-mode')||'device';
    const activePlace=savedPlacesRepository.active();
    if($('locationMode'))$('locationMode').value=mode;
    if($('latitudeInput'))$('latitudeInput').value=activePlace?activePlace.latitude:(getStored('solar-location-latitude')||'');
    if($('longitudeInput'))$('longitudeInput').value=activePlace?activePlace.longitude:(getStored('solar-location-longitude')||'');
    $('locationTitleInput').value=activePlace?.title||'';
    $('timezoneMode').value=getStored('solar-timezone-mode');
    ensureTimezoneOption(currentTimezoneName());$('timezoneInput').value=currentTimezoneName();
    updateLocationControls();
    setText('locationStatus',`${mode!=='device'?(activePlace?activePlace.title:t('locationNeedsCoords')):t('locationDeviceMode')} · ${currentTimezoneName()}`);
    setText('savedPlacesStatus',`${savedPlacesRepository.all().length} · ${activePlace?.title||t('placeEmpty')}`);
  }
  async function saveLocationSettings(timezoneHint=null){
    try {
      const mode=$('locationMode').value,timezoneMode=$('timezoneMode').value;
      const latitudeRaw=$('latitudeInput').value.trim(),longitudeRaw=$('longitudeInput').value.trim();
      const latitude=Number(latitudeRaw),longitude=Number(longitudeRaw);
      if(mode!=='device'&&(!latitudeRaw||!longitudeRaw||!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180))throw new Error('coordinates');
      const timezone=timezoneMode==='manual'?$('timezoneInput').value:mode==='device'?deviceTimezoneName():typeof timezoneHint==='string'?timezoneHint:LocationProvider.timezoneAt(latitude,longitude);
      if(!TimeCore.validTimezone(timezone))throw new Error('timezone');
      if(mode!=='device')await savedPlacesRepository.upsert({id:mode==='gps'?'device-position':'manual-location',title:$('locationTitleInput').value.trim()||(mode==='gps'?'GPS':`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`),latitude,longitude,timezone,active:true});
      setStored('solar-location-mode',mode);
      setStored('solar-location-latitude',latitudeRaw);setStored('solar-location-longitude',longitudeRaw);
      setStored('solar-location-timezone',timezone);setStored('solar-timezone-mode',timezoneMode);
      setStored('solar-timezone-override',timezoneMode==='manual'?timezone:'');
      await locationChanged();
    } catch { setText('locationStatus',t('invalidLocation')); }
  }
  async function locationChanged(){
    await loadCachedWeather();DayContext.resetCache();tick(true);convert();
    $('dateInput').value=inputValue(new Date());
    await syncReminderNotifications(false);
    await research.update(researchInput());renderResearch();
  }
  function researchInput(){return {location:manualLocation(new Date()),timezone:currentTimezoneName(),language,platform:globalThis.Capacitor?.isNativePlatform?.()?'android':'web'};}
  function renderResearch(){
    const status=research.consent.status;
    setText('researchStatus',t(status==='accepted'?'researchLocal':status==='declined'?'researchOff':'researchPending'));
    setText('researchPreview',JSON.stringify(research.record,null,2));
    $('researchDeleteButton').hidden=status!=='accepted';
  }
  function openResearch(){
    $('researchChoice').checked=research.consent.status==='pending'||research.consent.status==='accepted';
    renderResearch();$('researchDialog').showModal();
  }
  async function decideResearch(accepted){
    await research.decide(accepted,researchInput());renderResearch();$('researchDialog').close();
  }
  function ensureTimezoneOption(timezone){
    const select=$('timezoneInput');
    if(!Array.from(select.options).some(option=>option.value===timezone))select.add(new Option(timezone,timezone));
  }
  let timezoneOptionsReady=false;
  function buildTimezoneOptions(){
    if(timezoneOptionsReady)return;
    const select=$('timezoneInput'),selected=select.value;
    const existing=new Set(Array.from(select.options,option=>option.value));
    const fragment=document.createDocumentFragment();
    const zones=Intl.supportedValuesOf?Intl.supportedValuesOf('timeZone'):['Europe/Moscow','Europe/London','America/New_York','Asia/Tokyo'];
    for(const zone of ['UTC',...zones])if(!existing.has(zone)){fragment.append(new Option(zone,zone));existing.add(zone);}
    select.append(fragment);select.value=selected;timezoneOptionsReady=true;
  }
  function updateLocationControls(){
    const device=$('locationMode').value==='device';
    for(const id of ['latitudeInput','longitudeInput','locationTitleInput'])$(id).disabled=device;
    $('timezoneInput').disabled=$('timezoneMode').value!=='manual';
  }
  async function requestGpsLocation(){
    $('gpsLocationButton').disabled=true;setText('gpsStatus',t('gpsWaiting'));
    try {
      const position=await LocationProvider.currentPosition();
      $('locationMode').value='gps';$('locationTitleInput').value='GPS';
      $('latitudeInput').value=position.latitude.toFixed(4);$('longitudeInput').value=position.longitude.toFixed(4);
      updateLocationControls();await saveLocationSettings(position.timezone);
      setText('gpsStatus',`GPS · ${Math.round(position.accuracy)} m · ${currentTimezoneName()}`);
    } catch { setText('gpsStatus',t('gpsFailed')); }
    finally { $('gpsLocationButton').disabled=false; }
  }
  async function searchCities(){
    const query=$('citySearchInput').value.trim();if(query.length<2)return;
    $('citySearchButton').disabled=true;$('citySearchResults').replaceChildren();setText('citySearchStatus',t('cityWaiting'));
    try {
      const cities=await LocationProvider.searchCities(query,language);
      setText('citySearchStatus',cities.length?'Open-Meteo / GeoNames':t('cityEmpty'));
      for(const city of cities){
        const button=document.createElement('button');button.type='button';button.className='city-result';
        const title=document.createElement('strong');title.textContent=city.title;
        const meta=document.createElement('small');meta.textContent=`${city.region} · ${city.timezone}`;button.append(title,meta);
        button.addEventListener('click',async()=>{
          $('locationMode').value='manual';$('locationTitleInput').value=city.title;
          $('latitudeInput').value=city.latitude.toFixed(4);$('longitudeInput').value=city.longitude.toFixed(4);
          updateLocationControls();await saveLocationSettings(city.timezone);$('citySearchResults').replaceChildren();
        });$('citySearchResults').appendChild(button);
      }
    } catch { setText('citySearchStatus',t('cityFailed')); }
    finally { $('citySearchButton').disabled=false; }
  }
  function solarMonthDate(data,day){
    const row=CalendarNavigation.solarMonth(data.year,data.month,currentTimezoneName())[day-1];
    // The current sector follows today's local date; other sectors use their midpoint.
    const date=latestData?.date>=row.start&&latestData.date<row.end?latestData.date:row.date;
    return {...data,...row.solar,civil:TimeCore.civilParts(date,currentTimezoneName()),calendarSystem:'solar',date,degreeIndex:row.solar.totalDay-1,civilDates:undefined,sectorStart:row.start,sectorEnd:row.end};
  }
  function markerCounts(data,day){
    const bundle=dayBundle(solarMonthDate(data,day));
    return Object.fromEntries(Object.entries(bundle).map(([key,value])=>[key,value.length]));
  }
  function appendMarkers(cell,counts){
    const markers=document.createElement('span');markers.className='day-markers';markers.setAttribute('aria-hidden','true');
    ['events','notes','reminders','routine'].forEach(kind=>{if(counts[kind]>0){const dot=document.createElement('span');dot.className=`day-marker day-marker--${kind}`;markers.appendChild(dot);}});
    if(markers.childNodes.length)cell.appendChild(markers);
    cell.title=['events','notes','reminders','routine'].filter(kind=>counts[kind]>0).map(kind=>`${kind}: ${counts[kind]}`).join(' · ');
  }

  function civilDateRef(data){
    if(data?.civil===null)return null;
    const date=data?.date instanceof Date?data.date:new Date();
    const source=data?.civil&&Number.isInteger(data.civil.year)?data.civil:TimeCore.civilParts(date,currentTimezoneName());
    return {kind:'civil',year:source.year,month:source.month,day:source.day};
  }
  function solarDateRef(data){
    if(!data||!Number.isInteger(data.totalDay))return null;
    return {kind:'solar',year:data.year,totalDay:data.totalDay,month:data.month,day:data.day};
  }
  function dateRefsFor(scope,data){
    const civil=civilDateRef(data),solar=solarDateRef(data);
    if(scope==='civil')return civil?[civil]:solar?[solar]:[];
    if(scope==='solar')return solar?[solar]:civil?[civil]:[];
    return [civil,solar].filter(Boolean);
  }
  function dateRefFor(scope,data){
    return dateRefsFor(scope,data)[0] || civilDateRef(data) || solarDateRef(data);
  }
  function noteAttachScope(note){
    if(!note)return 'both';
    const kinds=new Set((note.dateRefs||[]).map(ref=>ref?.kind));
    if(kinds.has('civil')&&kinds.has('solar'))return 'both';
    if(kinds.has('solar'))return 'solar';
    return 'civil';
  }
  function queryForDay(data){
    return {date:data?.date||new Date(),civil:data?.civil===null?null:civilDateRef(data),solar:solarDateRef(data)||data,location:data?.location||manualLocation(data?.date||new Date()),language};
  }
  function dayBundle(data){
    const query=queryForDay(data);
    return Object.fromEntries([['events',eventRepository],['notes',notesRepository],['reminders',reminderRepository],['routine',routineRepository]].map(([key,repository])=>{
      return [key,repository.queryDay(query).value];
    }));
  }
  function formValue(id){return ($(id)?.value||'').trim();}
  function optionalTime(id){return formValue(id)||null;}
  function uid(prefix){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;}
  function existingById(repository,id){return repository.all().find(item=>item.id===id)||null;}
  function hideEditors(){['noteEditor','reminderEditor','routineEditor'].forEach(id=>{const el=$(id);if(el)el.hidden=true;});$('dayDetailContent').hidden=false;}
  function setEditorVisible(id){hideEditors();const el=$(id);if(el){$('dayDetailContent').hidden=true;el.hidden=false;el.scrollIntoView({block:'start',behavior:'instant'});}}
  function formatTimedEvent(event){return event?.time instanceof Date?TimeCore.formatClockTime(event.time,locale(),currentTimezoneName()).slice(0,5):'—';}
  function formatMaybeDegree(value){return Number.isFinite(value)?`${value.toFixed(1)}°`:'—';}
  function dataStatus(status){
    if(status==='available'||status==='ready'||status==='fresh'||status==='cached-fresh')return t('dataReady');
    if(status==='partial'||status==='cached-stale'||status==='offline-cache')return t('dataPartial');
    return t('dataUnavailable');
  }
  function renderSunProduction(data){
    const sun=data.sun||{};const twilight=sun.twilight||{};
    setText('sunRiseTime',formatTimedEvent(sun.rise));
    setText('sunSetTime',formatTimedEvent(sun.set));
    setText('sunTransitTime',formatTimedEvent(sun.transit));
    setText('sunDaylightStatus',dataStatus(sun.daylight?.status));
    setText('sunCivilDawn',formatTimedEvent(twilight.civilDawn));
    setText('sunCivilDusk',formatTimedEvent(twilight.civilDusk));
    setText('sunNauticalDawn',formatTimedEvent(twilight.nauticalDawn));
    setText('sunNauticalDusk',formatTimedEvent(twilight.nauticalDusk));
    setText('sunDataStatus',`${dataStatus(sun.daylight?.status)} · ${sun.riseSetSource||sun.source||'unavailable'}`);
    setText('sunWeatherSummary',weatherSummary(data.weather));
  }
  function renderMoonProduction(data){
    const moon=data.moon||{};
    setText('moonRiseTime',formatTimedEvent(moon.rise));
    setText('moonSetTime',formatTimedEvent(moon.set));
    setText('moonTransitTime',formatTimedEvent(moon.transit));
    setText('moonEclipticLongitude',formatMaybeDegree(moon.ecliptic?.longitude));
    setText('moonEclipticLatitude',formatMaybeDegree(moon.ecliptic?.latitude));
    setText('moonDataStatus',dataStatus(moon.riseSetSource==='astronomy-engine'||moon.source==='astronomy-engine'?'ready':'unavailable'));
  }
  function weatherStatusText(weather){
    if(!weather||weather.status==='loading')return t('notificationStatusChecking');
    if(weather.status==='needs-location')return t('weatherNeedsLocation');
    if(weather.status==='no-cache')return t('weatherNoCache');
    if(weather.status==='fresh')return t('weatherFresh');
    if(weather.status==='cached-fresh'||weather.status==='cached-stale')return t('weatherCached');
    if(weather.status==='offline-cache')return t('weatherOfflineCache');
    return t('weatherError');
  }
  function weatherSummary(weather){
    const value=weather?.value;
    if(!value)return weatherStatusText(weather);
    const code=value.weatherCode;
    const label=WeatherProvider.labelForCode(code,language);
    const temp=Number.isFinite(value.temperature)?`${Math.round(value.temperature)}${value.units.temperature}`:'—';
    return `${temp} · ${label}`;
  }
  function windDisplayUnit(){ return ['m/s','km/h','kn'].includes(getStored('solar-wind-unit'))?getStored('solar-wind-unit'):'m/s'; }
  function weatherLine(weather){
    const value=weather?.value;if(!value)return personalLine({title:weatherStatusText(weather),text:t('weatherNeedsLocation')});
    return `<article class="integrated-domain-line"><strong>${escapeHtml(weatherSummary(weather))}</strong><span>${escapeHtml(`${t('feelsLike')}: ${Number.isFinite(value.apparentTemperature)?Math.round(value.apparentTemperature):'—'}${value.units?.temperature||'°C'}`)}</span><small>${escapeHtml(`${t('windTitle')}: ${WindCore.formatSpeed(value.windSpeed,value.units?.windSpeed||'km/h',windDisplayUnit(),language)} · ${t('humidity')}: ${Number.isFinite(value.humidity)?value.humidity:'—'}${value.units?.humidity||'%'}`)}</small></article>`;
  }
  function windStatusText(wind){
    if(!wind||wind.status==='loading')return t('notificationStatusChecking');
    if(wind.status==='needs-location')return t('weatherNeedsLocation');
    if(wind.status==='no-cache')return t('weatherNoCache');
    if(wind.status==='fresh')return t('weatherFresh');
    if(wind.status==='cached-fresh'||wind.status==='cached-stale')return t('weatherCached');
    if(wind.status==='offline-cache')return t('weatherOfflineCache');
    return t('windUnavailable');
  }
  function windLine(wind){
    const value=wind?.value;if(!value)return personalLine({title:windStatusText(wind),text:t('windUnavailable')});
    return `<article class="integrated-domain-line"><strong>${escapeHtml(WindCore.summary(wind,language,windDisplayUnit()))}</strong><span>${escapeHtml(`${t('windDirection')}: ${value.direction===null?'—':`${Math.round(value.direction)}°`} · ${value.compass||'—'}`)}</span><small>${escapeHtml(`${t('windGust')}: ${WindCore.formatSpeed(value.gust,value.gustUnit,windDisplayUnit(),language)}`)}</small></article>`;
  }
  function todayWindCard(){
    return `<article class="integrated-domain-card ${latestWind?.value?'':'is-empty'}"><div><strong>${t('windTitle')}</strong>${locationStatusAction(latestWind,windStatusText(latestWind))}</div><div class="integrated-domain-list">${windLine(latestWind)}</div></article>`;
  }
  function displayUnit(value,unit=''){
    return Number.isFinite(value)?`${Math.round(value)}${unit}`:'—';
  }
  function compactDateTime(value){
    if(!value)return '—';
    const date=new Date(value);
    if(Number.isFinite(date.getTime()))return formatDateTime(date,false);
    return String(value);
  }
  function compactForecastTime(value){
    if(!value)return '—';
    try { const date=TimeCore.dateFromInput(value,currentTimezoneName());return TimeCore.formatClockTime(date,locale(),currentTimezoneName()).slice(0,5); } catch {}
    return String(value).slice(11,16)||String(value);
  }
  function compactForecastDate(value){
    if(!value)return '—';
    let date;try { date=TimeCore.dateFromInput(`${value}T12:00:00`,currentTimezoneName()); } catch { return String(value); }
    if(Number.isFinite(date.getTime()))return formatCivilDate(date);
    return String(value);
  }
  function weatherForecast(weather){
    return weather?.forecast||weather?.value?.forecast||{hourly:[],daily:[]};
  }
  function weatherHourlyLine(item){
    return `<article class="forecast-row"><strong>${escapeHtml(compactForecastTime(item.time))}</strong><span>${escapeHtml(displayUnit(item.temperature,item.units?.temperature||'°C'))}</span><small>${escapeHtml(`${WeatherProvider.labelForCode(item.weatherCode,language)} · ${t('precipitation')}: ${displayUnit(item.precipitationProbability,item.units?.precipitationProbability||'%')}`)}</small></article>`;
  }
  function weatherDailyLine(item){
    return `<article class="forecast-row"><strong>${escapeHtml(compactForecastDate(item.date))}</strong><span>${escapeHtml(`${displayUnit(item.temperatureMin,item.units?.temperature||'°C')} / ${displayUnit(item.temperatureMax,item.units?.temperature||'°C')}`)}</span><small>${escapeHtml(`${WeatherProvider.labelForCode(item.weatherCode,language)} · ${t('precipitation')}: ${displayUnit(item.precipitationProbabilityMax,item.units?.precipitationProbability||'%')}`)}</small></article>`;
  }
  function renderForecastList(id,items,renderer,emptyKey='forecastUnavailable'){
    const root=$(id);if(!root)return;
    root.innerHTML=items.length?items.map(renderer).join(''):`<p class="inline-empty">${t(emptyKey)}</p>`;
  }
  function renderWeatherScreen(){
    const weather=latestWeather;const value=weather?.value||null;const forecast=weatherForecast(weather);
    setText('weatherScreenStatus',weatherStatusText(weather));
    setText('weatherCurrentTemp',value?displayUnit(value.temperature,value.units?.temperature||'°C'):'—');
    setText('weatherCurrentLabel',value?WeatherProvider.labelForCode(value.weatherCode,language):weatherStatusText(weather));
    setText('weatherFeelsLike',value?displayUnit(value.apparentTemperature,value.units?.temperature||'°C'):'—');
    setText('weatherHumidity',value?displayUnit(value.humidity,value.units?.humidity||'%'):'—');
    setText('weatherPrecipitation',value?displayUnit(value.precipitation,value.units?.precipitation||'mm'):'—');
    setText('weatherCloudCover',value?displayUnit(value.cloudCover,value.units?.cloudCover||'%'):'—');
    setText('weatherWindSummary',WindCore.summary(latestWind,language,windDisplayUnit()));
    setText('weatherUpdatedAt',compactDateTime(weather?.fetchedAt));
    setText('weatherHourlyMeta',`${forecast.hourly?.length||0}`);
    setText('weatherDailyMeta',`${forecast.daily?.length||0}`);
    renderForecastList('weatherHourlyList',(forecast.hourly||[]).slice(0,8),weatherHourlyLine);
    renderForecastList('weatherDailyList',(forecast.daily||[]).slice(0,7),weatherDailyLine);
    const link=$('weatherAttributionLink');if(link)link.href=WeatherProvider.OPEN_METEO_ATTRIBUTION.url;
  }
  function renderWindPanels(){
    latestWind=WindCore.fromWeather(latestWeather,language);
    if(activeScreen!=='wind')return;
    windLocations.ensureCaches();
    const contexts=windLocations.contexts(), favorites=windFavorites();
    let slot=windActiveSlot();
    if(slot&&!contexts[slot].key){slot=0;setStored('solar-wind-active-slot','0');}
    const context=contexts[slot], wind=WindCore.fromWeather(context.weather,language);
    $('windLocationPanel').setAttribute('aria-labelledby',`windLocationTab${slot}`);
    const unit=windDisplayUnit();
    $('windLocationTabs').setAttribute('aria-label',t('savedPlacesTitle'));
    $('windLocationTabs').innerHTML=contexts.map(item=>{
      const state=WindCore.fromWeather(item.weather,language), value=state.value;
      const speed=WindCore.convertSpeed(value?.speed,value?.unit,unit);
      const unitLabel=unit==='m/s'?(language==='ru'?'м/с':'m/s'):unit==='km/h'?(language==='ru'?'км/ч':'km/h'):(language==='ru'?'уз':'kn');
      const summary=Number.isFinite(speed)?`${new Intl.NumberFormat(locale(),{maximumFractionDigits:1}).format(speed)} ${unitLabel}`:windStatusText(state);
      return `<button id="windLocationTab${item.slot}" type="button" role="tab" aria-controls="windLocationPanel" aria-selected="${item.slot===slot}" tabindex="${item.slot===slot?'0':'-1'}" data-wind-slot="${item.slot}" ${!item.current&&!item.key?'disabled':''} title="${escapeHtml(item.title||t('windChoosePlace'))}"><small>${t(item.current?'windCurrentPlace':item.slot===1?'windFavoriteOne':'windFavoriteTwo')}</small><strong>${escapeHtml(item.title||t('windChoosePlace'))}</strong><span>${escapeHtml(summary)}</span></button>`;
    }).join('');
    for(const index of [1,2]){
      const select=$(index===1?'windFavoriteOne':'windFavoriteTwo');
      select.innerHTML=`<option value="" disabled>${t('windChoosePlace')}</option>`+favorites.map(place=>`<option value="${escapeHtml(place.id)}" ${place.id===contexts[index===1?2:1].id?'disabled':''}>${escapeHtml(place.title)}</option>`).join('')+`<option value="__add_place__" data-add-place>${language==='ru'?'Добавить город или координаты':'Add city or coordinates'}</option>`;
      select.value=contexts[index].id||'';select.disabled=false;
    }
    $('windRefreshAllButton').disabled=windLocations.batchPending||!contexts.some(item=>item.key);
    windView.render({ wind, language, now:new Date(), timezone:context.location?.timezone||currentTimezoneName(),
      unit:windDisplayUnit(),
      statusLabel:windStatusText(wind), locationKey:context.key, locationLabel:context.title||t('windChoosePlace') });
  }
  function renderMoreHub(){
    setText('moreWeatherStatus',weatherStatusText(latestWeather));
    setText('moreWindStatus',windStatusText(latestWind));
    setText('moreSourcesStatus',`${OfflineEventPack.events.length} · ${OfflineEventPack.sources.length}`);
    const activePlace=savedPlacesRepository.active();
    setText('morePlacesStatus',`${savedPlacesRepository.all().length} · ${activePlace?.title||t('placeEmpty')}`);
    if(latestData){
      setText('moreSunStatus',dataStatus(latestData.sun?.daylight?.status));
      setText('moreMoonStatus',dataStatus(latestData.moon?.source==='astronomy-engine'?'ready':'partial'));
    }
  }
  function renderWeatherPanels(){
    latestWind=WindCore.fromWeather(latestWeather,language);
    setText('weatherStatus',weatherStatusText(latestWeather));
    const button=$('weatherRefreshButton');if(button)button.disabled=latestWeather?.status==='loading';
    const screenButton=$('weatherScreenRefreshButton');if(screenButton)screenButton.disabled=latestWeather?.status==='loading';
    if(latestData)setText('sunWeatherSummary',weatherSummary(latestWeather));
    renderWeatherScreen();renderWindPanels();renderMoreHub();
  }
  async function loadCachedWeather(){
    windLocations.resetCache();
    latestWeather=await weatherProvider.cached(manualLocation(new Date()),new Date()).catch(error=>({status:'error',domain:'weather',value:null,error:String(error.message||error)}));
    renderWeatherPanels();
  }
  async function refreshWeather(){
    if(latestWeather?.status==='loading')return;
    latestWeather={...latestWeather,status:'loading',domain:'weather'};renderWeatherPanels();
    latestWeather=await weatherProvider.refresh(manualLocation(new Date()),new Date());
    renderWeatherPanels();DayContext.resetCache();tick(true);
  }
  function renderSourceRegistry(){
    const root=$('sourceRegistry');if(!root)return;
    const eventSources=(OfflineEventPack.sources||[]).map(source=>`
      <article class="source-card">
        <strong>${escapeHtml(source.name)}</strong>
        <p>${escapeHtml(source.license||'')}</p>
        <a href="${escapeHtml(source.url||'#')}" rel="noopener">${escapeHtml(source.url||'local')}</a>
      </article>`).join('');
    root.innerHTML=`
      <article class="source-card source-card--summary"><strong>${t('sourceEvents')}</strong><p>${escapeHtml(OfflineEventPack.version)} · ${OfflineEventPack.events.length} · ${t('eventSources')}: ${OfflineEventPack.sources.length}</p></article>
      ${eventSources}
      <article class="source-card"><strong>${language==='ru'?'Погода и ветер':'Weather and wind'}</strong><p>${language==='ru'?'Данные: Open-Meteo. Лицензия данных: CC BY 4.0.':'Data: Open-Meteo. Data license: CC BY 4.0.'}</p><a href="${WeatherProvider.OPEN_METEO_ATTRIBUTION.url}" rel="noopener">Open-Meteo</a></article>
      <article class="source-card"><strong>Lucide</strong><p>refresh-cw, map-pin, download, folder-open · ISC</p><a href="vendor/lucide-LICENSE.txt" target="_blank" rel="noopener">${language==='ru'?'Лицензия иконок':'Icon license'}</a></article>
      <article class="source-card"><strong>${t('sourceWind')}</strong><p>WindCore · local derived state · ${WindCore.WIND_CORE_VERSION}</p></article>
      <article class="source-card"><strong>${t('sourceGeoMap')}</strong><p>GeoMapCore · provider boundary · ${GeoMapCore.GEOMAP_CORE_VERSION}</p></article>
      <article class="source-card"><strong>${t('sourceBackup')}</strong><p>BackupCore · local JSON export/import · ${BackupCore.BACKUP_VERSION}</p></article>
      <article class="source-card"><strong>${t('sourceAstronomy')}</strong><p>Astronomy Engine · MIT</p><a href="https://github.com/cosinekitty/astronomy" rel="noopener">github.com/cosinekitty/astronomy</a></article>
      <article class="source-card"><strong>Temporal polyfill 0.5.1</strong><p>ISC</p><a href="vendor/temporal-LICENSE.txt">${t('sourceLicenses')}</a></article>
      <article class="source-card"><strong>tz-lookup 11.6.1</strong><p>CC0</p><a href="vendor/tz-lookup-LICENSE.txt">${t('sourceLicenses')}</a></article>
      <article class="source-card"><strong>Capacitor Geolocation 8.2.2</strong><p>MIT</p><a href="vendor/geolocation-LICENSE.txt">${t('sourceLicenses')}</a></article>
      <article class="source-card"><strong>DOMPurify 3.4.15</strong><p>Apache-2.0 · ${language==='ru'?'Проверка личных SVG-иконок':'Personal SVG icon sanitization'}</p><a href="vendor/dompurify-LICENSE.txt">${t('sourceLicenses')}</a></article>
      <article class="source-card"><strong>${t('sourceLicenses')}</strong><p>${escapeHtml(t('privacyText'))}</p></article>`;
  }
  function placeKindLabel(kind){
    if(kind==='home')return t('placeHome');
    if(kind==='work')return t('placeWork');
    return t('placeCustom');
  }
  function renderSavedPlaces(){
    const root=$('savedPlacesList');if(!root)return;
    const places=savedPlacesRepository.all();
    root.innerHTML=places.length?places.map(place=>`
      <article class="source-card saved-place-card ${place.active?'is-active':''}">
        <strong>${escapeHtml(place.title)}</strong>
        <p>${escapeHtml(`${placeKindLabel(place.kind)} · ${place.latitude}, ${place.longitude} · ${place.timezone}`)}</p>
        <label class="place-favorite-choice"><input type="checkbox" data-place-favorite="${escapeHtml(place.id)}" ${place.favorite?'checked':''} ${!place.favorite&&windFavorites().length>=SavedPlacesRepository.MAX_FAVORITES?'disabled':''}><span>${t('windFavorite')}</span></label>
        <div class="detail-actions">
          <button type="button" data-place-active="${escapeHtml(place.id)}">${t('setActive')}</button>
          <button type="button" data-place-edit="${escapeHtml(place.id)}">${t('edit')}</button>
          <button type="button" data-place-delete="${escapeHtml(place.id)}">${t('delete')}</button>
        </div>
      </article>`).join(''):`<p class="inline-empty">${t('placeEmpty')}</p>`;
    setText('savedPlacesStatus',`${places.length} · ${savedPlacesRepository.active()?.title||t('placeEmpty')}`);
    setText('favoritePlacesStatus',`${t('windFavorites')}: ${windFavorites().length} / ${SavedPlacesRepository.MAX_FAVORITES}`);
    renderMoreHub();
  }
  function clearPlaceForm(){
    $('placeEditId').value='';$('placeTitleInput').value='';$('placeKindSelect').value='custom';$('placeLatitudeInput').value='';$('placeLongitudeInput').value='';$('placeTimezoneInput').value='';$('placeActiveSelect').value='true';$('deletePlaceButton').hidden=true;
    $('placeTimezoneMode').value='auto';updatePlaceTimezone();
    $('placeActiveSelect').value=favoritePlaceMode?'false':'true';
    $('placeFavoriteInput').checked=favoritePlaceMode&&windFavorites().length<SavedPlacesRepository.MAX_FAVORITES;$('placeCitySearchInput').value='';$('placeCityResults').replaceChildren();placeCityRequest++;
  }
  function openPlaceEditor(id=''){
    favoriteTargetSlot=null;
    placeCityRequest++;
    const place=id?savedPlacesRepository.all().find(item=>item.id===id):null;
    $('placeEditId').value=place?.id||'';$('placeTitleInput').value=place?.title||'';$('placeKindSelect').value=place?.kind||'custom';$('placeLatitudeInput').value=place?.latitude??'';$('placeLongitudeInput').value=place?.longitude??'';$('placeTimezoneInput').value=place?.timezone||currentTimezoneName();$('placeActiveSelect').value=String(place?.active!==false);$('deletePlaceButton').hidden=!place;
    $('placeFavoriteInput').checked=Boolean(place?.favorite);
    $('placeCityResults').replaceChildren();$('placeCitySearchInput').value='';
    $('placeTimezoneMode').value=place?'manual':'auto';updatePlaceTimezone();
    $('placeForm').scrollIntoView({block:'start'});
  }
  function updatePlaceTimezone(){
    const input=$('placeTimezoneInput'), auto=$('placeTimezoneMode').value==='auto';
    input.disabled=auto;input.setCustomValidity('');
    if(!auto)return;
    const latitude=formValue('placeLatitudeInput'),longitude=formValue('placeLongitudeInput');
    input.value='';
    if(latitude===''||longitude==='')return;
    try{input.value=LocationProvider.timezoneAt(Number(latitude),Number(longitude));}catch{/* Invalid coordinates remain unsavable. */}
  }
  function addWindPlace(slot){
    favoriteTargetSlot=slot;openScreen('places');clearPlaceForm();
    $('placeFavoriteInput').checked=true;
    if(windFavorites().length>=SavedPlacesRepository.MAX_FAVORITES)setText('favoritePlacesStatus',t('windFavoritesLimit'));
    $('placeForm').scrollIntoView({block:'start'});
  }
  async function searchPlaceCities(){
    const request=++placeCityRequest, query=$('placeCitySearchInput').value.trim();
    if(query.length<2)return;
    $('placeCitySearchButton').disabled=true;setText('placeCityResults',t('notificationStatusChecking'));
    try {
      const cities=await LocationProvider.searchCities(query,language);
      if(request!==placeCityRequest)return;
      $('placeCityResults').replaceChildren();
      for(const city of cities){
        const button=document.createElement('button');button.type='button';button.className='city-result';
        button.textContent=`${city.title} · ${city.region}`;
        button.addEventListener('click',()=>{
          $('placeTitleInput').value=city.title;$('placeLatitudeInput').value=String(city.latitude);$('placeLongitudeInput').value=String(city.longitude);$('placeTimezoneMode').value='auto';updatePlaceTimezone();$('placeTimezoneInput').value=city.timezone;
          $('placeCityResults').replaceChildren();$('placeTitleInput').focus();
        });$('placeCityResults').appendChild(button);
      }
      if(!cities.length)setText('placeCityResults',t('searchEmpty'));
    }catch{if(request===placeCityRequest)setText('placeCityResults',t('weatherError'));}
    finally{$('placeCitySearchButton').disabled=false;}
  }
  function selectWindSlot(slot){
    if(!windLocations.contexts()[slot]?.key&&slot!==0)return;
    setStored('solar-wind-active-slot',String(slot));renderWindPanels();
  }
  async function savePlace(event){
    event.preventDefault();
    const id=formValue('placeEditId')||uid('place');
    const title=formValue('placeTitleInput')||t('savedPlacesTitle');
    let place;
    try {
      if(!TimeCore.validTimezone(formValue('placeTimezoneInput')))throw new RangeError('Invalid time zone');
      place=await savedPlacesRepository.upsert({id,title,kind:$('placeKindSelect').value,latitude:formValue('placeLatitudeInput'),longitude:formValue('placeLongitudeInput'),timezone:formValue('placeTimezoneInput')||LocationProvider.timezoneAt(Number(formValue('placeLatitudeInput')),Number(formValue('placeLongitudeInput'))),active:$('placeActiveSelect').value==='true',favorite:$('placeFavoriteInput').checked});
    } catch(error) { setText('favoritePlacesStatus',String(error).includes('favorite')?t('windFavoritesLimit'):t('invalidLocation'));return; }
    if(place?.active){
      setStored('solar-location-mode','manual');
      setStored('solar-location-latitude',String(place.latitude));
      setStored('solar-location-longitude',String(place.longitude));
      setStored('solar-location-timezone',place.timezone);
    }
    const targetSlot=favoriteTargetSlot;favoriteTargetSlot=null;
    clearPlaceForm();renderSavedPlaces();if(place.active)await locationChanged();
    if(place.favorite&&targetSlot!==null){setStored(`solar-wind-slot-${targetSlot}`,place.id);setStored('solar-wind-active-slot',String(targetSlot));openScreen('wind');}
  }
  async function setActivePlace(id){
    const place=await savedPlacesRepository.setActive(id);
    setStored('solar-location-mode','manual');setStored('solar-location-latitude',String(place.latitude));setStored('solar-location-longitude',String(place.longitude));setStored('solar-location-timezone',place.timezone);
    renderSavedPlaces();await locationChanged();
  }
  async function deletePlace(id){
    await savedPlacesRepository.remove(id);
    clearPlaceForm();renderSavedPlaces();await loadCachedWeather();renderLocationSettings();DayContext.resetCache();tick(true);convert();
  }
  function searchTypeLabel(type){
    const key=`searchType${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    return t(key);
  }
  function searchContext(){
    return {eventRepository,notesRepository,reminderRepository,routineRepository,savedPlacesRepository,offlineEventPack:OfflineEventPack,weather:latestWeather,wind:latestWind,language};
  }
  function renderSearchResults(){
    const query=$('searchInput')?.value||'';
    const result=GlobalSearch.search(query,searchContext(),{language,limit:50});
    setText('searchSummary',String(result.count));
    const root=$('searchResults');if(!root)return;
    root.innerHTML=result.value.length?result.value.map(item=>`
      <article class="detail-item search-result-item" data-search-type="${escapeHtml(item.type)}">
        <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(searchTypeLabel(item.type))}${item.meta?` · ${escapeHtml(item.meta)}`:''}</span>${item.subtitle?`<small>${escapeHtml(item.subtitle)}</small>`:''}</div>
      </article>`).join(''):`<p class="inline-empty">${query?t('searchEmpty'):t('searchInputLabel')}</p>`;
    renderMoreHub();
  }
  async function exportBackup(){
    const snapshot=await BackupCore.collectFromStores({settingsStore,personalStore,weatherStore,placesStore},{notesRepository,reminderRepository,routineRepository,savedPlacesRepository,monthRepository},{...storedValues});
    $('backupPayload').value=BackupCore.serializeSnapshot(snapshot);
    setText('backupStatus',`${t('backupReady')}: ${snapshot.payload.notes.length}/${snapshot.payload.reminders.length}/${snapshot.payload.routines.length}/${snapshot.payload.savedPlaces.length}`);
    renderMoreHub();
  }
  async function saveBackupFile(){
    const button=$('saveBackupFileButton');button.disabled=true;
    try {
      await exportBackup();
      const data=$('backupPayload').value,plugin=window.Capacitor?.Plugins?.BackupFiles;
      if(plugin){const result=await plugin.save({data});if(result.cancelled)return;}
      else {
        const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
        const link=document.createElement('a');link.href=url;link.download='Solar-Year-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }
      setText('backupStatus',language==='en'?'File saved':'Файл сохранён');
    } catch {setText('backupStatus',language==='en'?'File could not be saved':'Не удалось сохранить файл');}
    finally {button.disabled=false;}
  }
  function loadBackupFileText(data){
    BackupCore.parseSnapshot(data);
    $('backupPayload').value=data;
    setText('backupStatus',language==='en'?'File opened. Import not applied.':'Файл открыт. Импорт не выполнен.');
  }
  async function openBackupFile(){
    const plugin=window.Capacitor?.Plugins?.BackupFiles;
    if(!plugin){$('backupFileInput').click();return;}
    const button=$('openBackupFileButton');button.disabled=true;
    try {const result=await plugin.open();if(!result.cancelled)loadBackupFileText(result.data);}
    catch {setText('backupStatus',t('backupInvalid'));}
    finally {button.disabled=false;}
  }
  async function importBackup(){
    const button=$('importBackupButton');
    if(button.disabled)return;
    button.disabled=true;$('exportBackupButton').disabled=true;
    personalRestoreBusy=true;
    setText('backupStatus',language==='ru'?'Восстановление...':'Restoring...');
    try {
      await notesRepository.whenSettled();await monthRepository.whenSettled();
      const result=await BackupCore.restoreToStores($('backupPayload').value,{settingsStore,personalStore,weatherStore,placesStore});
      await hydrateStoredSettings();
      await Promise.all([notesRepository.hydrate(),reminderRepository.hydrate(),routineRepository.hydrate(),savedPlacesRepository.hydrate(),monthRepository.hydrate()]);
      $('calendarJourney').checked=getStored('solar-vyboria-enabled')!=='false';
      await monthRepository.reconcile();
      await loadCachedWeather();setMode(displayMode);applyLanguage();DayContext.resetCache();tick(true);convert();
      $('launchToggle').checked=showLaunch;$('defaultMode').value=displayMode;
      await syncReminderNotifications(false);
      setText('backupStatus',`${t('backupImported')}: ${result.counts.notes}/${result.counts.reminders}/${result.counts.routines}/${result.counts.savedPlaces}`);
    } catch (error) {
      setText('backupStatus',`${t('backupInvalid')}: ${String(error.message||error)}`);
    } finally {
      personalRestoreBusy=false;
      button.disabled=false;$('exportBackupButton').disabled=false;
    }
  }
  function detailLine(kind,item,meta='',actions=true){
    const id=escapeHtml(item.id);const title=escapeHtml(itemTitle(item));const text=escapeHtml(item.text||localized(item.description,''));const extra=escapeHtml(meta||item.timeOfDay||'');
    const buttons=actions?`<div class="detail-actions"><button type="button" data-edit-${kind}="${id}">${t('edit')}</button></div>`:'';
    return `<article class="detail-item"><div><strong>${title}</strong>${extra?`<span>${extra}</span>`:''}${text?`<small>${text}</small>`:''}</div>${buttons}</article>`;
  }
  function personalCategory(item){return item.category||({recovery:'rest',ritual:'habit',task:'work'}[item.kind])||item.kind||'work';}
  function categoryLabel(category){return t({work:'categoryWork',rest:'categoryRest',habit:'habit',training:'training'}[category]||'categoryWork');}
  function routineDetailLine(item){
    const kind=item.type==='reminder'?'reminder':'routine';
    const id=escapeHtml(item.id);const status=item.isDone?t('doneStatus'):(item.todayStatus==='skipped'?t('markSkipped'):t('plannedStatus'));
    const delivery=kind==='routine'?(language==='ru'?'Без уведомления':'No notification'):'';
    const meta=[categoryLabel(personalCategory(item)),item.timeOfDay,status,delivery].filter(Boolean).join(' · ');
    return `<article class="detail-item"><div><strong>${escapeHtml(itemTitle(item))}</strong><span>${escapeHtml(meta)}</span>${item.text?`<small>${escapeHtml(item.text)}</small>`:''}</div><div class="detail-actions"><button type="button" data-${kind}-mark="${id}" data-status="done">${t('markDone')}</button><button type="button" data-${kind}-mark="${id}" data-status="skipped">${t('markSkipped')}</button><button type="button" data-edit-${kind}="${id}">${t('edit')}</button></div></article>`;
  }
  function detailSection(labelKey,items,renderer){
    const empty=labelKey==='todayEvents'?(language==='ru'?'В офлайн-подборке пока нет событий и праздников для этой даты.':'The offline collection has no events or holidays for this date yet.'):t('todayIntegratedEmpty');
    return `<section class="detail-section"><h3>${t(labelKey)} <span>${items.length}</span></h3>${items.length?items.map(renderer).join(''):`<p class="inline-empty">${empty}</p>`}</section>`;
  }
  function eventDetailLine(event){
    const date=event.date,original=date?.kind==='civil'&&Number.isInteger(date.year);
    const label=date?.kind==='civil'?`${date.year?`${date.year}-`:''}${pad(date.month)}-${pad(date.day)}`:'';
    const source=/^https:\/\//.test(event.source?.url||'')?`<a href="${escapeHtml(event.source.url)}" target="_blank" rel="noopener noreferrer">${t('sourceLink')}</a>`:'';
    return `${detailLine('event',event,[event.source?.name,label?`${t('originalDate')}: ${label}`:''].filter(Boolean).join(' · '),false)}<div class="event-origin-actions">${source}${original?`<button type="button" class="sc-btn-secondary compact-action" data-history-origin="${escapeHtml(event.id)}">${t('openOriginalDate')}</button>`:''}</div>`;
  }
  function journeyDetail(data){
    if(!$('calendarJourney').checked)return '';
    const step=CalendarNavigation.journey(data,language);
    const guide=window.SolarYearVyboriaGuide.forDay(data.day,language),ru=language==='ru';
    const reading=guide.reading.map(block=>`<${block.heading?'h4':'p'}>${escapeHtml(block.text)}</${block.heading?'h4':'p'}>`).join('');
    const phases=CalendarNavigation.phases[language].map((name,index)=>`<li ${index===step.index?'aria-current="step"':''}><strong>${escapeHtml(name)}</strong> · ${index*6+1}–${index*6+6}</li>`).join('');
    return `<section class="detail-section journey-detail"><h3>${ru?'Выбория':'IFTHENDZEN'} · ${escapeHtml(step.phase)}</h3><small>${ru?'Неделя':'Week'} ${guide.week}/5 · ${ru?'День недели':'Day of stage'} ${guide.dayInWeek}/6 · ${ru?'День пути':'Day of journey'} ${data.day}/30</small><h4>${escapeHtml(step.title)}</h4><p class="journey-intro">${escapeHtml(guide.intro)}</p><details class="journey-more"><summary>${ru?'Подробнее':'More details'}</summary><p>${escapeHtml(guide.stage)}</p><p>${escapeHtml(guide.rhythm)}</p><ol class="journey-stage-list">${phases}</ol><p>${escapeHtml(guide.daily)}</p>${ru?reading:`<details><summary>Original daily reading · ALEX_DOC · Russian</summary><div lang="ru">${reading}</div></details>`}</details><button type="button" class="sc-btn-secondary compact-action" data-record-choice>${data.day===1?(ru?'Записать цель':'Write down a goal'):t('recordChoice')}</button><button type="button" class="journey-author-link" data-open-author>${ru?'О выборе: слова ALEX_DOC':'On choice: words from ALEX_DOC'}</button></section>`;
  }
  function renderDayDetail(data=selectedDayData||latestData){
    if(!data)return;
    selectedDayData=data;
    const bundle=dayBundle(data);
    setText('dayDetailTitle',fullSolarDate(data));
    setText('dayDetailMeta',formatCivilDate(data.date));
    $('dayDetailContent').innerHTML=[
      journeyDetail(data),
      detailSection('todayEvents',bundle.events,eventDetailLine),
      detailSection('todayNotes',bundle.notes,note=>detailLine('note',note,'',true)),
      detailSection('todayReminders',[...bundle.reminders,...bundle.routine].sort((a,b)=>(a.timeOfDay||'99').localeCompare(b.timeOfDay||'99')),routineDetailLine)
    ].join('');
    monthView?.renderDay(data);
  }
  function openDayDetail(data=latestData){
    selectedDayData=data||latestData;hideEditors();renderDayDetail(selectedDayData);
    const sheet=$('dayDetailSheet');sheet.hidden=false;sheet.setAttribute('aria-hidden','false');document.body.classList.add('day-sheet-open');
  }
  function closeDayDetail(){const sheet=$('dayDetailSheet');sheet.hidden=true;sheet.setAttribute('aria-hidden','true');document.body.classList.remove('day-sheet-open');hideEditors();}
  function openNoteEditor(id=''){
    const note=id?existingById(notesRepository,id):null;$('noteEditId').value=note?.id||'';$('noteTitleInput').value=itemTitle(note)||'';$('noteTextInput').value=note?.text||'';$('noteAttachSelect').value=noteAttachScope(note);$('deleteNoteButton').hidden=!note;setEditorVisible('noteEditor');
  }
  function openReminderEditor(id=''){
    const reminder=id?existingById(reminderRepository,id):null;$('reminderEditId').value=reminder?.id||'';$('reminderTitleInput').value=itemTitle(reminder)||'';$('reminderTextInput').value=reminder?.text||'';$('reminderTimeInput').value=reminder?.timeOfDay||'';$('reminderScopeSelect').value=reminder?.dateRef?.kind||(selectedDayData?.civil===null?'solar':'civil');$('reminderFrequencySelect').value=reminder?.recurrence?.scope==='none'?'once':(reminder?.recurrence?.frequency||'once');$('reminderEnabledSelect').value=String(reminder?.enabled!==false);$('deleteReminderButton').hidden=!reminder;
    $('reminderCategorySelect').value=reminder?.category||'work';
    if(!reminder)$('reminderScopeSelect').value=selectedDayData?.calendarSystem==='solar'?'solar':'civil';
    const data=selectedDayData||latestData,ref=reminder?.dateRef;
    const civil=ref?.kind==='civil'?ref:(civilDateRef(data)||data.civilDates?.[0]||TimeCore.civilParts(data.date,currentTimezoneName()));
    $('reminderCivilDateInput').value=CalendarNavigation.iso({...civil,year:civil.year||data.date.getFullYear()});
    const solar=ref?.kind==='solar'?CalendarCore.solarDateFromDegreeIndex(ref.totalDay-1,ref.year||data.year):data;
    $('reminderSolarYearInput').value=solar.year;$('reminderSolarMonthInput').replaceChildren(...CalendarCore.MONTHS[language].map((name,index)=>new Option(name,index+1)));$('reminderSolarMonthInput').value=solar.month;$('reminderSolarDayInput').value=solar.day;
    updateReminderDateFields();setEditorVisible('reminderEditor');
  }
  function updateReminderDateFields(){
    const solar=$('reminderScopeSelect').value==='solar';
    $('reminderCivilDateField').hidden=solar;$('reminderSolarDateFields').hidden=!solar;
    $('reminderCivilDateInput').disabled=solar;$('reminderCivilDateInput').required=!solar;
    for(const id of ['reminderSolarYearInput','reminderSolarMonthInput','reminderSolarDayInput']){$(id).disabled=!solar;$(id).required=solar;}
  }
  function openRoutineEditor(id=''){
    const routine=id?existingById(routineRepository,id):null;$('routineEditId').value=routine?.id||'';$('routineTitleInput').value=itemTitle(routine)||'';$('routineTextInput').value=routine?.text||'';$('routineKindSelect').value=personalCategory(routine||{});$('routineTimeInput').value=routine?.timeOfDay||'';$('routineScopeSelect').value=routine?.dateRef?.kind==='solar'?'solar':'civil';$('routineFrequencySelect').value=routine?.recurrence?.frequency||'daily';$('routineEnabledSelect').value=String(routine?.enabled!==false);$('deleteRoutineButton').hidden=!routine;setEditorVisible('routineEditor');
  }
  async function refreshAfterPersonalChange(){
    if(monthRepository.hydrated)await monthView?.reconcile();
    hideEditors();DayContext.resetCache();tick(true);convert();if(selectedDayData)renderDayDetail(selectedDayData);await syncReminderNotifications(false);
  }
  async function saveNote(event){
    event.preventDefault();if(personalRestoreBusy)return;
    const id=formValue('noteEditId')||uid('note');const title=formValue('noteTitleInput')||t('addNote');
    const input=$('noteTextInput');input.setCustomValidity('');
    try {
      await notesRepository.upsert({id,title:{ru:title,en:title},text:formValue('noteTextInput'),dateRefs:dateRefsFor($('noteAttachSelect').value,selectedDayData||latestData)});
      await refreshAfterPersonalChange();
    }catch {input.setCustomValidity(language==='ru'?'Не удалось сохранить заметку. Повторите попытку.':'Could not save the note. Please retry.');input.reportValidity();}
  }
  async function saveReminder(event){
    event.preventDefault();const id=formValue('reminderEditId')||uid('reminder');const title=formValue('reminderTitleInput')||t('addReminder');const scope=$('reminderScopeSelect').value;const frequency=$('reminderFrequencySelect').value;const existing=existingById(reminderRepository,id);
    let dateRef;
    if(scope==='civil'){
      const value=$('reminderCivilDateInput').value;
      const date=TimeCore.dateFromInput(`${value}T12:00:00`,currentTimezoneName());
      dateRef={kind:'civil',...TimeCore.civilParts(date,currentTimezoneName())};
    } else {
      const year=Number(formValue('reminderSolarYearInput')),month=Number(formValue('reminderSolarMonthInput')),day=Number(formValue('reminderSolarDayInput'));
      if(!Number.isInteger(year)||year<1||year>3000||!Number.isInteger(month)||month<1||month>12||!Number.isInteger(day)||day<1||day>30)return;
      dateRef={kind:'solar',year,month,day,totalDay:(month-1)*30+day};
    }
    const recurrence=frequency==='once'?'NONE':existing?.recurrence?.scope===scope&&existing.recurrence.frequency===frequency?existing.recurrence:{scope,frequency};
    await reminderRepository.upsert({...existing,id,title:{ru:title,en:title},category:$('reminderCategorySelect').value,text:formValue('reminderTextInput'),dateRef,timeOfDay:optionalTime('reminderTimeInput'),recurrence,enabled:$('reminderEnabledSelect').value==='true',notification:existing?.notification});
    await refreshAfterPersonalChange();
  }
  async function saveRoutine(event){
    event.preventDefault();const id=formValue('routineEditId')||uid('routine');const title=formValue('routineTitleInput')||t('addRoutine');const scope=$('routineScopeSelect').value;const existing=existingById(routineRepository,id);
    const category=$('routineKindSelect').value,frequency=$('routineFrequencySelect').value;
    const recurrence=existing?.recurrence?.scope===scope&&existing.recurrence.frequency===frequency?existing.recurrence:{scope,frequency};
    await routineRepository.upsert({...existing,id,title:{ru:title,en:title},kind:existing&&personalCategory(existing)===category?existing.kind:category,text:formValue('routineTextInput'),dateRef:existing?.dateRef?.kind===scope?existing.dateRef:dateRefFor(scope,selectedDayData||latestData),timeOfDay:optionalTime('routineTimeInput'),recurrence,enabled:$('routineEnabledSelect').value==='true',completions:existing?.completions||[]});
    await refreshAfterPersonalChange();
  }
  async function deleteCurrent(kind){
    const id=formValue(`${kind}EditId`);if(!id)return;
    if(kind==='note')await notesRepository.remove(id);
    if(kind==='reminder')await reminderRepository.remove(id);
    if(kind==='routine')await routineRepository.remove(id);
    await refreshAfterPersonalChange();
  }
  async function markRoutine(id,status){
    const routine=existingById(routineRepository,id);
    const scope=routine?.dateRef?.kind==='civil'?'civil':'solar';
    await routineRepository.mark(id,{dateRef:dateRefFor(scope,selectedDayData||latestData),status});
    await refreshAfterPersonalChange();
  }
  async function markReminder(id,status){
    const reminder=existingById(reminderRepository,id);if(!reminder)return;
    await reminderRepository.mark(id,{dateRef:dateRefFor(reminder.dateRef.kind,selectedDayData||latestData),status});
    await refreshAfterPersonalChange();
  }

  let appliedTheme=null;
  function applyResolvedTheme(next){
    theme=ThemeCore.normalizeResolvedTheme(next,theme);$('themeSelect').value=themeMode;
    if(appliedTheme===theme)return;
    appliedTheme=theme;document.documentElement.dataset.theme=theme;setStored('solar-resolved-theme',theme);
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='dark'?'#080a10':'#f2efe7';
    try {
      const plugins=window.Capacitor?.Plugins;
      if(plugins?.AppChrome) plugins.AppChrome.setTheme({dark:theme==='dark'}).catch(()=>{});
      else if(plugins?.StatusBar) {
        plugins.StatusBar.setBackgroundColor({color:theme==='dark'?'#080a10':'#f2efe7'}).catch(()=>{});
        plugins.StatusBar.setStyle({style:theme==='dark'?'DARK':'LIGHT'}).catch(()=>{});
      }
    } catch {}
  }
  function resolveAndApplyTheme(themeSignal=null){
    const result=ThemeCore.resolveTheme({mode:themeMode,previousResolvedTheme:theme,themeSignal});
    applyResolvedTheme(result.resolvedTheme);
    return result;
  }
  function setTheme(next,themeSignal=null){
    themeMode=ThemeCore.normalizeMode(next,themeMode);setStored('solar-theme-mode',themeMode);setStored('solar-theme',themeMode);
    return resolveAndApplyTheme(themeSignal||latestData?.themeSignal||null);
  }
  function applyLanguage(){
    for(const [id,ru,en] of [['saveBackupFileButton','Сохранить файл','Save file'],['openBackupFileButton','Открыть файл','Open file']]){const button=$(id);button.title=language==='en'?en:ru;button.setAttribute('aria-label',button.title);}
    document.title=t('brand');
    renderResearch();
    document.documentElement.lang=language;$('languageButton').textContent=language.toUpperCase();$('languageSelect').value=language;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);if(el.tagName==='OPTION')el.textContent=value;else el.textContent=value;});
    buildWeekHeader();renderAbout();renderSourceStatus();renderLocationSettings();renderSavedPlaces();renderWeatherPanels();renderSearchResults();if(latestNotificationSync)renderNotificationStatus(latestNotificationSync);if(latestData){renderStatic(latestData);renderDynamic(latestData);buildMonth(latestData);renderDateEvents(latestData);}
  }
  function setLanguage(next){language=next;setStored('solar-language',language);applyLanguage();if($('dateInput').value)convert();}
  function setMode(next){displayMode=next;setStored('solar-display-mode',next);$('clockGrid').dataset.mode=next;$('defaultMode').value=next;document.querySelectorAll('[data-mode]').forEach(button=>button.classList.toggle('active',button.dataset.mode===next));}
  function buildBottomNav(){
    const nav=document.querySelector('.bottom-nav');if(!nav)return;
    nav.innerHTML=RouteRegistry.primaryRoutes().map(route=>`
      <button type="button" class="${route.id===activeRoute?'active':''}" data-route="${route.id}" data-target="${route.domScreenId||''}">
        <span class="nav-icon nav-icon--${route.iconKey}" aria-hidden="true"></span>
        <small data-i18n="${route.labelKey}">${t(route.labelKey)}</small>
      </button>
    `).join('');
  }

  function renderStatic(data){
    latestData=data;
    monthView?.renderCurrent(data);
    const month=monthView?.display(data.month).title||CalendarGrammar.monthName(data.month,language);
    $('solarDate').textContent=fullSolarDate(data);
    $('solarWeekday').textContent=data.isWeekend?t('weekend'):t('workday');
    $('solarCode').textContent=`AY${CalendarGrammar.displaySolarYear(data.year)} · Q${data.quarter} · M${pad(data.month)} · D${pad(data.day)} · ${t('week')} ${data.week}`;
    $('degreeInteger').textContent=`${data.totalDay}°`;
    $('degreePrecise').textContent=preciseDegree(data.longitude);
    $('actualStart').textContent=formatDateTime(data.start,true);
    $('actualEnd').textContent=formatDateTime(data.end,true);
    $('actualDuration').textContent=formatDuration(data.durationMs);
    $('solarSecond').textContent=`${formatSecond(data.solarSecondMs)} ${t('physicalSeconds')}`;
    $('solarDayLengthClock').textContent=formatDurationClock(data.durationMs);
    $('solarHourLength').textContent=formatDurationClock(data.durationMs/24);
    $('solarDayDelta').textContent=formatSignedDuration(data.durationMs-TimeCore.SECONDS_IN_DAY*1000);
    $('timezone').textContent=data.location?.timezone||t('timezone');
    setText('todayHeroSolarDate',fullSolarDate(data));
    setText('todayHeroDegree',`${data.totalDay}° / 360`);
    setText('sunScreenDate',formatCivilDate(data.date));
    setText('sunScreenDegree',`${data.totalDay}°`);
    setText('sunScreenLongitude',preciseDegree(data.longitude));
    setText('sunScreenDayLength',formatDurationClock(data.durationMs));
    setText('sunScreenSecond',`${formatSecond(data.solarSecondMs)} ${t('physicalSeconds')}`);
    const moon=data.moon||{};
    setText('moonScreenDate',formatCivilDate(data.date));
    setText('moonScreenPhase',moon.phaseName||t('moonPanelTitle'));
    setText('moonScreenIllumination',Number.isFinite(moon.illumination)?`${Math.round(moon.illumination*100)}%`:'—');
    setText('moonScreenSource',moon.source||'—');
    renderSunProduction(data);renderMoonProduction(data);renderWeatherPanels();
    document.documentElement.style.setProperty('--progress-angle',`${data.longitude}deg`);
    document.documentElement.style.setProperty('--planet-angle',`${data.longitude-90}deg`);
    $('launchMarker').style.transform=`rotate(${data.longitude-90}deg)`;
    $('launchDegree').textContent=`${data.longitude.toFixed(3)}°`;
    $('launchCopy').textContent=`${t('launchReady')}: ${data.day} ${month}`;
    renderTodayIntegrated(data);renderSourceStatus();renderLocationSettings();renderSavedPlaces();renderSearchResults();
  }
  function renderDynamic(data){
    latestData=data;
    $('solarTime').textContent=data.solarTime;
    $('civilTime').textContent=TimeCore.formatClockTime(data.date,locale(),currentTimezoneName());
    setText('todayHeroTime',TimeCore.formatClockTime(data.date,locale(),currentTimezoneName()).slice(0,5));
    setText('todayHeroDate',formatCivilDate(data.date));
    $('civilDate').textContent=formatCivilDate(data.date);
    const civilTime=data.civil||TimeCore.civilTime(data.date);
    $('civilMeta').textContent=`UTC${TimeCore.formatUtcOffset(data.date,currentTimezoneName())} · ${TimeCore.utcStamp(data.date)} UTC${civilTime.dst?' · DST':''}`;
    $('solarProgressText').textContent=`${(data.physicalProgress*100).toFixed(4)}%`;
    $('solarProgressBar').style.width=`${data.physicalProgress*100}%`;
    renderOrbit(data);
  }
  function buildOrbitDial(){
    const scale=OrbitViewModel.dialScale();
    const coordinate=value=>value.toFixed(3);
    $('orbitMonthTicks').innerHTML=scale.map(sector=>`<line x1="${coordinate(sector.tickStart.x)}" y1="${coordinate(sector.tickStart.y)}" x2="${coordinate(sector.tickEnd.x)}" y2="${coordinate(sector.tickEnd.y)}"/>`).join('');
    $('orbitDegreeLabels').innerHTML=scale.map(sector=>`<text x="${coordinate(sector.degreeLabel.x)}" y="${coordinate(sector.degreeLabel.y)}">${sector.startDegree===0?'0° / 360°':`${sector.startDegree}°`}</text>`).join('');
    $('orbitMonthLabels').innerHTML=scale.map(sector=>`<text data-month="${sector.month}" x="${coordinate(sector.monthLabel.x)}" y="${coordinate(sector.monthLabel.y)}">${sector.month}</text>`).join('');
  }
  function renderOrbit(data){
    const position=OrbitViewModel.position(data.longitude,data.moon?.phaseAngle);
    $('planetArm').setAttribute('transform',`translate(${position.earth.x} ${position.earth.y})`);
    $('orbitProgress').setAttribute('stroke-dasharray',`${position.degree} 360`);
    if($('orbitMonthLabels').dataset.currentMonth!==String(position.month)){
      $('orbitMonthLabels').dataset.currentMonth=String(position.month);
      $('orbitMonthLabels').querySelectorAll('text').forEach(label=>label.classList.toggle('current',Number(label.dataset.month)===position.month));
    }
    $('moonImage').style.display=position.moon?'':'none';
    if(position.moon)$('moonImage').setAttribute('transform',`translate(${position.moon.x} ${position.moon.y})`);
    $('degreeInteger').textContent=`${data.totalDay}°`;
    $('degreePrecise').textContent=preciseDegree(data.longitude);
    $('orbitVisual').setAttribute('aria-label',language==='ru'
      ?`Солнечный год: 12 месяцев по часовой стрелке от 0° сверху, месяц ${position.month}, Земля на ${data.longitude.toFixed(2)}°, Солнце в центре${position.moon?', Луна рядом с Землёй':''}`
      :`Solar year: 12 months clockwise from 0° at the top, month ${position.month}, Earth at ${data.longitude.toFixed(2)}°, Sun at the center${position.moon?', Moon beside Earth':''}`);
  }
  function buildWeekHeader(){
    $('weekdayHeader').innerHTML=CalendarGrammar.weekdayHeaders(language).map(day=>`<span class="${day.isWeekend?'weekend':''}">${day.label}</span>`).join('');
  }
  function buildMonth(data){
    if(activeScreen!=='month'||!data)return;
    if(!calendarCursor)calendarCursor={system:'solar',year:data.year,month:data.month};
    const cursor=calendarCursor,solar=cursor.system==='solar',timezone=currentTimezoneName();
    const root=$('monthGrid');root.replaceChildren();$('calendarAgenda').replaceChildren();
    $('monthScreen').classList.toggle('civil-calendar',!solar);
    const names=solar?CalendarCore.MONTHS[language].map((name,index)=>monthView?.display(index+1).title||name):Array.from({length:12},(_,index)=>new Intl.DateTimeFormat(locale(),{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2026,index,15))));
    $('calendarMonth').replaceChildren(...names.map((name,index)=>new Option(name,index+1)));
    $('calendarMonth').value=cursor.month;$('calendarYear').value=cursor.year;$('calendarSystem').value=cursor.system;
    $('calendarMonth').setAttribute('aria-label',t('calendarMonthLabel'));$('calendarYear').setAttribute('aria-label',t('calendarYearLabel'));
    for(const [id,key] of [['calendarPrevious','previousMonth'],['calendarNext','nextMonth']]){$(id).title=t(key);$(id).setAttribute('aria-label',t(key));}
    $('calendarPrevious').disabled=cursor.year===1&&cursor.month===1;$('calendarNext').disabled=cursor.year===3000&&cursor.month===12;
    $('monthTitle').textContent=`${names[cursor.month-1]} ${cursor.year}`;$('monthRange').textContent=solar?`${(cursor.month-1)*30}°–${cursor.month*30}°`:t('modeCivil');
    $('calendarJourneyLabel').textContent=language==='ru'?'Выбория':'IFTHENDZEN';
    $('monthScreen').querySelector('.month-note').hidden=!solar;
    if(solar)buildWeekHeader();
    else $('weekdayHeader').innerHTML=Array.from({length:7},(_,index)=>`<span>${new Intl.DateTimeFormat(locale(),{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,5+index)))}</span>`).join('');
    try {calendarRows=solar?CalendarNavigation.solarMonth(cursor.year,cursor.month,timezone):CalendarNavigation.civilMonth(cursor.year,cursor.month,timezone);}
    catch {setText('calendarCivilRange',t('calendarUnavailable'));calendarRows=[];return;}
    setText('calendarCivilRange',`${formatCivilDate(calendarRows[0].start)} — ${formatCivilDate(new Date(calendarRows[calendarRows.length-1].end.getTime()-1))}`);
    const monthEvents=new Map();
    if(!solar){const first=calendarRows[0].civil;const weekday=new Date(`${CalendarNavigation.iso(first)}T12:00:00Z`).getUTCDay();for(let i=0;i<(weekday+6)%7;i++){const empty=document.createElement('span');empty.className='calendar-empty-cell';root.append(empty);}}
    for(const row of calendarRows){
      const item=solar?solarMonthDate({...data,year:cursor.year,month:cursor.month},row.solar.day):{...data,...row.solar,date:row.date,civil:row.civil,civilDates:undefined};
      const bundle=dayBundle(item),counts=Object.fromEntries(Object.entries(bundle).map(([key,value])=>[key,value.length]));
      const current=solar?row.solar.year===data.year&&row.solar.totalDay===data.totalDay:CalendarNavigation.iso(row.civil)===CalendarNavigation.iso(TimeCore.civilParts(data.date,timezone));
      const step=CalendarNavigation.journey(row.solar,language);
      const weekend=solar?CalendarCore.isWeekend(row.solar.weekdayIndex):[0,6].includes(new Date(`${CalendarNavigation.iso(row.civil)}T12:00:00Z`).getUTCDay());
      const cell=document.createElement('div');cell.className=`day-cell ${current?'current':''} ${weekend?'weekend':'workday'}`;cell.tabIndex=0;cell.setAttribute('role','button');
      cell.dataset.day=String(solar?row.solar.day:row.civil.day);
      const label=document.createElement('span');label.className='day-number';label.textContent=cell.dataset.day;cell.append(label);
      const mapped=document.createElement('small');mapped.className='day-mapped-date';
      const mappedDay=document.createElement('span'),mappedMonth=document.createElement('span');
      mappedDay.textContent=solar?`${pad(item.civil.day)}.`:`${row.solar.day}.`;mappedMonth.textContent=solar?pad(item.civil.month):String(row.solar.month);
      mapped.append(mappedDay,mappedMonth);
      cell.append(mapped);appendMarkers(cell,counts);
      if($('calendarJourney').checked){cell.dataset.phase=step.index;const phase=document.createElement('span');phase.className='day-phase';phase.textContent=String(step.index+1);cell.append(phase);}
      cell.setAttribute('aria-label',`${solar?fullSolarDate(row.solar):formatCivilDate(row.date)}; ${mapped.textContent}; ${step.phase}; ${cell.title}`);
      cell.addEventListener('click',()=>openDayDetail(item));cell.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openDayDetail(item);}});root.append(cell);
      for(const event of bundle.events)if(!monthEvents.has(event.id))monthEvents.set(event.id,{event,item});
    }
    $('calendarPhases').hidden=!$('calendarJourney').checked;
    $('calendarPhases').innerHTML=CalendarNavigation.phases[language].map((name,index)=>`<span><b>${index+1}</b> ${name}<small>${index*6+1}–${index*6+6}</small></span>`).join('');
    const heading=document.createElement('h2');heading.textContent=t('calendarHistory');$('calendarAgenda').append(heading);
    if(!monthEvents.size){const empty=document.createElement('p');empty.className='inline-empty';empty.textContent=t('calendarEmpty');$('calendarAgenda').append(empty);}
    for(const {event,item} of monthEvents.values()){
      const button=document.createElement('button');button.type='button';button.className='calendar-event-row';
      const title=document.createElement('strong');title.textContent=itemTitle(event);
      const meta=document.createElement('small');meta.textContent=`${fullSolarDate(item)} · ${event.date.kind==='civil'?(event.date.year?`${event.date.year}-`:'')+`${pad(event.date.month)}-${pad(event.date.day)}`:''}`;
      button.append(title,meta);button.addEventListener('click',()=>openDayDetail(item));$('calendarAgenda').append(button);
    }
    monthView?.renderMonth(cursor);
  }
  function shiftCalendarMonth(delta){try{calendarCursor=CalendarNavigation.moveMonth(calendarCursor,delta);buildMonth(latestData);}catch{/* Navigation stops at the supported year range. */}}
  function renderAbout(){
    window.SolarYearAuthorNote.render(language);
    const contact=ProjectMeta.PUBLIC_CONTACT;
    $('publicHandle').textContent=contact.handle;
    $('publicHandle').href=`https://t.me/${contact.handle.replace('@','')}`;
    $('publicEmail').textContent=contact.email;
    $('publicEmail').href=`mailto:${contact.email}`;
    $('footerSignature').textContent=`${contact.handle} · ${contact.email}`;
    $('creditsList').innerHTML=ProjectMeta.ACKNOWLEDGEMENTS.map(item=>`
      <article class="credit-item">
        <strong>${item.name}</strong>
        <p>${item.thanks[language]||item.thanks.ru}</p>
        <small>${t('roleLabel')}: ${item.role[language]||item.role.ru}</small>
      </article>
    `).join('');
  }

  function convert(){
    const value=$('dateInput').value;if(!value)return;let date;
    try { date=TimeCore.dateFromInput(value,currentTimezoneName());$('dateInput').setCustomValidity(''); }
    catch { $('dateInput').setCustomValidity(language==='ru'?'Этого времени нет в выбранном часовом поясе':'This time does not exist in the selected time zone');$('dateInput').reportValidity();return; }
    DayContext.resetCache();const data=getSolarData(date);DayContext.resetCache();
    $('convertDate').textContent=fullSolarDate(data);
    $('convertTime').textContent=data.solarTime;
    $('convertDegree').textContent=preciseDegree(data.longitude);
    $('convertInterval').textContent=`${formatDateTime(data.start)} — ${formatDateTime(data.end)}`;
    renderDateEvents(data);
  }

  function openRoute(name){
    const route=RouteRegistry.resolveRoute(name);if(!route||!route.domScreenId)return false;
    const target=document.querySelector(`[data-screen="${route.domScreenId}"]`);if(!target)return false;
    if(route.domScreenId==='settings')buildTimezoneOptions();
    if(activeScreen==='places'&&route.domScreenId!=='places')favoriteTargetSlot=null;
    if(route.domScreenId==='places')favoritePlaceMode=activeScreen==='wind';
    activeRoute=route.id;activeScreen=route.domScreenId;document.querySelectorAll('.screen').forEach(screen=>screen.classList.toggle('active',screen.dataset.screen===activeScreen));
    if(activeScreen==='wind')renderWindPanels();
    if(activeScreen==='month')buildMonth(latestData);
    document.querySelectorAll('.bottom-nav button').forEach(button=>button.classList.toggle('active',button.dataset.route===activeRoute));
    window.scrollTo({top:0,behavior:'smooth'});
    return true;
  }
  function openScreen(name){return openRoute(name);}
  function openNotificationDay(action){
    const notification=action?.notification;
    if(!notification||!ReminderNotifications.isSolarCircleNotification(notification))return;
    const extra=notification.extra||notification.data;
    const date=new Date(extra?.occurrenceAt);
    if(!Number.isFinite(date.getTime()))return;
    if(!notificationNavigationReady){pendingNotificationDate=date;return;}
    openRoute('today');openDayDetail(getSolarData(date));
  }
  function hideLaunch(immediate=false){$('launchScreen').classList.toggle('hidden',true);if(immediate)$('launchScreen').style.display='none';performance.mark('solar-launch-hidden');}
  function launchSequence(data){
    if(!showLaunch){hideLaunch(true);return;}
    $('launchCopy').textContent=t('launchCalc');
    requestAnimationFrame(()=>{renderStatic(data);hideLaunch(false);});
  }

  async function hydrateStoredSettings(){
    const stored = await settingsStore.load('settings', {});
    if(!stored||typeof stored!=='object'||Array.isArray(stored)||BackupCore.validateSnapshot(BackupCore.createSnapshot({settings:stored})).status!=='passed')throw new Error('Invalid stored settings');
    Object.keys(storedValues).forEach(key=>delete storedValues[key]);
    Object.assign(storedValues, stored);
    language = getStored('solar-language');
    themeMode = ThemeCore.normalizeMode(getStored('solar-theme-mode') || getStored('solar-theme'));
    theme = ThemeCore.normalizeResolvedTheme(getStored('solar-resolved-theme') || themeMode);
    displayMode = getStored('solar-display-mode');
    showLaunch = getStored('solar-show-launch') !== 'false';
  }

  function bind(){
    window.SolarYearAuthorNote.bind();
    let authorDayReturn=null;
    document.addEventListener('click',event=>{
      if(!event.target.closest('[data-open-author]'))return;
      authorDayReturn=$('dayDetailSheet').hidden?null:{data:selectedDayData,screen:activeScreen};
      closeDayDetail();openRoute('about');$('authorReturnDay').hidden=!authorDayReturn;
      $('authorNoteTitle').focus({preventScroll:true});$('authorNote').scrollIntoView({block:'start'});
    });
    $('authorReturnDay').addEventListener('click',()=>{
      if(!authorDayReturn)return;
      const target=authorDayReturn;authorDayReturn=null;$('authorReturnDay').hidden=true;
      openScreen(target.screen);openDayDetail(target.data);
    });
    $('saveBackupFileButton').addEventListener('click',saveBackupFile);
    $('openBackupFileButton').addEventListener('click',openBackupFile);
    $('backupFileInput').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>16*1024*1024)throw new Error('size');loadBackupFileText(await file.text());}catch{setText('backupStatus',t('backupInvalid'));}finally{event.target.value='';}});
    document.querySelectorAll('.mode-switch button').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
    $('themeButton').addEventListener('click',()=>setTheme(theme==='dark'?'light':'dark'));
    $('languageButton').addEventListener('click',()=>setLanguage(language==='ru'?'en':'ru'));
    document.querySelectorAll('.bottom-nav button').forEach(button=>button.addEventListener('click',()=>openRoute(button.dataset.route||button.dataset.target)));
    document.querySelectorAll('[data-open-screen]').forEach(button=>button.addEventListener('click',()=>openScreen(button.dataset.openScreen)));
    $('todayIntegratedGrid').addEventListener('click',event=>{
      if(!event.target.closest('[data-open-location-settings]'))return;
      openScreen('settings');
      $('locationSettingsTitle').focus({preventScroll:true});
      $('locationSettings').scrollIntoView({block:'start',behavior:'instant'});
    });
    $('convertButton').addEventListener('click',convert);$('dateInput').addEventListener('change',convert);
    $('defaultMode').addEventListener('change',event=>setMode(event.target.value));
    $('launchToggle').addEventListener('change',event=>{showLaunch=event.target.checked;setStored('solar-show-launch',String(showLaunch));});
    $('languageSelect').addEventListener('change',event=>setLanguage(event.target.value));
    $('themeSelect').addEventListener('change',event=>setTheme(event.target.value));
    $('notificationEnableButton').addEventListener('click',()=>syncReminderNotifications(true));
    $('saveLocationButton').addEventListener('click',saveLocationSettings);
    $('locationMode').addEventListener('change',updateLocationControls);
    $('timezoneMode').addEventListener('change',updateLocationControls);
    $('gpsLocationButton').addEventListener('click',requestGpsLocation);
    $('citySearchButton').addEventListener('click',searchCities);
    $('citySearchInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchCities();}});
    $('placeTimezoneInput').addEventListener('input',()=> $('placeTimezoneInput').setCustomValidity(''));
    $('placeTimezoneMode').addEventListener('change',updatePlaceTimezone);
    for(const id of ['placeLatitudeInput','placeLongitudeInput'])$(id).addEventListener('input',updatePlaceTimezone);
    $('researchOpenButton').addEventListener('click',openResearch);
    $('researchConfirmButton').addEventListener('click',()=>decideResearch($('researchChoice').checked));
    $('researchDeclineButton').addEventListener('click',()=>decideResearch(false));
    $('researchDeleteButton').addEventListener('click',()=>decideResearch(false));
    $('weatherRefreshButton').addEventListener('click',refreshWeather);
    $('weatherScreenRefreshButton').addEventListener('click',refreshWeather);
    $('windLocationTabs').addEventListener('click',event=>{const button=event.target.closest('[data-wind-slot]');if(button){const slot=Number(button.dataset.windSlot);selectWindSlot(slot);$(`windLocationTab${slot}`).focus();}});
    $('windLocationTabs').addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const slots=windLocations.contexts().filter(item=>item.current||item.key).map(item=>item.slot);
      const index=slots.indexOf(windActiveSlot());
      const slot=event.key==='Home'?slots[0]:event.key==='End'?slots.at(-1):slots[(index+(event.key==='ArrowRight'?1:-1)+slots.length)%slots.length];
      selectWindSlot(slot);$(`windLocationTab${slot}`).focus();
    });
    for(const [id,slot] of [['windFavoriteOne',1],['windFavoriteTwo',2]])$(id).addEventListener('change',event=>{if(event.target.selectedOptions[0]?.hasAttribute('data-add-place')){addWindPlace(slot);return;}setStored(`solar-wind-slot-${slot}`,event.target.value);selectWindSlot(slot);});
    $('windRefreshAllButton').addEventListener('click',()=>windLocations.refreshAll());
    $('windFavoritesButton').addEventListener('click',()=>{favoriteTargetSlot=null;openScreen('places');clearPlaceForm();});
    $('placeCitySearchButton').addEventListener('click',searchPlaceCities);
    $('placeCitySearchInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchPlaceCities();}});
    $('savedPlacesList').addEventListener('change',async event=>{
      const id=event.target.dataset.placeFavorite;if(!id)return;
      const place=savedPlacesRepository.all().find(item=>item.id===id);if(!place)return;
      try{await savedPlacesRepository.upsert({...place,favorite:event.target.checked});renderSavedPlaces();}
      catch{event.target.checked=place.favorite;setText('favoritePlacesStatus',t('windFavoritesLimit'));}
    });
    $('openTodayDetailButton').addEventListener('click',()=>openDayDetail(latestData));
    $('newPlaceButton').addEventListener('click',()=>{clearPlaceForm();$('placeTitleInput').focus();});
    $('placeForm').addEventListener('submit',savePlace);
    $('clearPlaceFormButton').addEventListener('click',()=>{favoriteTargetSlot=null;clearPlaceForm();});
    $('deletePlaceButton').addEventListener('click',()=>{const id=formValue('placeEditId');if(id)deletePlace(id);});
    $('savedPlacesList').addEventListener('click',event=>{
      const target=event.target.closest('button');if(!target)return;
      if(target.dataset.placeActive)setActivePlace(target.dataset.placeActive);
      if(target.dataset.placeEdit)openPlaceEditor(target.dataset.placeEdit);
      if(target.dataset.placeDelete)deletePlace(target.dataset.placeDelete);
    });
    $('searchInput').addEventListener('input',renderSearchResults);
    $('exportBackupButton').addEventListener('click',exportBackup);
    $('importBackupButton').addEventListener('click',importBackup);
    document.querySelectorAll('[data-close-day-sheet]').forEach(button=>button.addEventListener('click',closeDayDetail));
    document.querySelectorAll('[data-editor-open]').forEach(button=>button.addEventListener('click',()=>({note:openNoteEditor,reminder:openReminderEditor,routine:openRoutineEditor}[button.dataset.editorOpen]?.())));
    document.querySelectorAll('[data-editor-cancel]').forEach(button=>button.addEventListener('click',hideEditors));
    $('noteEditor').addEventListener('submit',saveNote);
    $('reminderEditor').addEventListener('submit',saveReminder);
    $('reminderScopeSelect').addEventListener('change',updateReminderDateFields);
    $('calendarPrevious').addEventListener('click',()=>shiftCalendarMonth(-1));
    $('calendarNext').addEventListener('click',()=>shiftCalendarMonth(1));
    $('calendarMonth').addEventListener('change',()=>{calendarCursor.month=Number($('calendarMonth').value);buildMonth(latestData);});
    $('calendarYear').addEventListener('change',()=>{if($('calendarYear').checkValidity()){const year=Number($('calendarYear').value);if(calendarCursor.year!==year){calendarCursor.year=year;buildMonth(latestData);}}else $('calendarYear').reportValidity();});
    $('calendarToday').addEventListener('click',()=>{const current=$('calendarSystem').value==='solar'?latestData:TimeCore.civilParts(new Date(),currentTimezoneName());calendarCursor={system:$('calendarSystem').value,year:current.year,month:current.month};buildMonth(latestData);});
    $('calendarSystem').addEventListener('change',()=>{const date=calendarRows[0]?.date||new Date(),system=$('calendarSystem').value;const mapped=system==='solar'?DayContext.solarDateForDate(date):TimeCore.civilParts(date,currentTimezoneName());calendarCursor={system,year:mapped.year,month:mapped.month};buildMonth(latestData);});
    $('calendarJourney').addEventListener('change',()=>{setStored('solar-vyboria-enabled',$('calendarJourney').checked);buildMonth(latestData);monthView?.renderCurrent(latestData);if(selectedDayData)renderDayDetail(selectedDayData);});
    let calendarPointer=null,calendarSuppressClickUntil=0;
    $('monthGrid').addEventListener('pointerdown',event=>{if(event.isPrimary){calendarSuppressClickUntil=0;calendarPointer={x:event.clientX,y:event.clientY};}});
    $('monthGrid').addEventListener('pointercancel',()=>{calendarPointer=null;});
    $('monthGrid').addEventListener('pointerup',event=>{if(!calendarPointer)return;const dx=event.clientX-calendarPointer.x,dy=event.clientY-calendarPointer.y;calendarPointer=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){calendarSuppressClickUntil=Date.now()+400;shiftCalendarMonth(dx<0?1:-1);}});
    $('monthGrid').addEventListener('click',event=>{if(Date.now()<calendarSuppressClickUntil){event.preventDefault();event.stopPropagation();}},true);
    $('routineEditor').addEventListener('submit',saveRoutine);
    $('deleteNoteButton').addEventListener('click',()=>deleteCurrent('note'));
    $('deleteReminderButton').addEventListener('click',()=>deleteCurrent('reminder'));
    $('deleteRoutineButton').addEventListener('click',()=>deleteCurrent('routine'));
    $('dayDetailContent').addEventListener('click',event=>{
      const target=event.target.closest('button');if(!target)return;
      if(target.dataset.civilDay){openDayDetail(getSolarData(TimeCore.dateFromInput(`${target.dataset.civilDay}T12:00:00`,currentTimezoneName())));return;}
      if(target.dataset.historyOrigin){const entry=eventRepository.all().find(item=>item.id===target.dataset.historyOrigin);if(entry?.date.kind==='civil'&&entry.date.year){const date=CalendarNavigation.civilDate(entry.date,currentTimezoneName());calendarCursor={system:'civil',year:entry.date.year,month:entry.date.month};openRoute('calendar');openDayDetail(getSolarData(date));}return;}
      if(target.hasAttribute('data-record-choice')){if(target.dataset.choiceNoteId){openNoteEditor(target.dataset.choiceNoteId);return;}openNoteEditor();$('noteTitleInput').value=CalendarNavigation.journey(selectedDayData,language).title;$('noteTextInput').value=language==='ru'?'Моя цель на месяц:\n\nСегодняшний шаг:\n\nЧто выбираю или корректирую:\n':'My goal for the month:\n\nToday\'s step:\n\nWhat I choose or adjust:\n';$('noteAttachSelect').value='solar';return;}
      if(target.dataset.editNote)openNoteEditor(target.dataset.editNote);
      if(target.dataset.editReminder)openReminderEditor(target.dataset.editReminder);
      if(target.dataset.editRoutine)openRoutineEditor(target.dataset.editRoutine);
      if(target.dataset.routineMark)markRoutine(target.dataset.routineMark,target.dataset.status||'done');
      if(target.dataset.reminderMark)markReminder(target.dataset.reminderMark,target.dataset.status||'done');
    });
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){DayContext.resetCache();tick(true);syncReminderNotifications(false);}});
  }

  let lastDegree=-1;
  let lastWindMinute=-1;
  function tick(force=false){
    const now=new Date(),data=getSolarData(now);
    const minute=Math.floor(now.getTime()/60000);
    if(activeScreen==='wind'&&(force||minute!==lastWindMinute)){renderWindPanels();lastWindMinute=minute;}
    resolveAndApplyTheme(data.themeSignal);
    if(force||data.degreeIndex!==lastDegree){renderStatic(data);buildMonth(data);lastDegree=data.degreeIndex;$('clockStage').classList.remove('shake');requestAnimationFrame(()=>$('clockStage').classList.add('shake'));}
    renderDynamic(data);
  }
  async function start(){
    performance.mark('solar-start');
    await BackupCore.recoverInterruptedRestore({settingsStore,personalStore,weatherStore,placesStore});
    performance.mark('solar-restore-recovered');
    await research.hydrate();
    performance.mark('solar-research-ready');
    const notificationPlugin=ReminderNotifications.detectedLocalNotifications();
    if(notificationPlugin?.addListener){
      await notificationPlugin.addListener('localNotificationActionPerformed',openNotificationDay);
    }
    performance.mark('solar-notification-listener');
    await hydrateStoredSettings();
    performance.mark('solar-settings-ready');
    await Promise.all([
      notesRepository.hydrate(),
      reminderRepository.hydrate(),
      routineRepository.hydrate(),
      savedPlacesRepository.hydrate()
    ]);
    performance.mark('solar-personal-ready');
    $('calendarJourney').checked=getStored('solar-vyboria-enabled')!=='false';
    monthView=window.SolarCircleMonthPersonalizationView.createView({repository:monthRepository,notes:notesRepository,
      language:()=>language,enabled:()=>!personalRestoreBusy&&$('calendarJourney').checked,selected:()=>selectedDayData,
      setEnabled:value=>{$('calendarJourney').checked=value;$('calendarJourney').dispatchEvent(new Event('change'));},
      openMore:()=>openRoute('more'),openMonth:(year,month)=>{calendarCursor={system:'solar',year,month};openRoute('month');buildMonth(latestData);},
      refresh:()=>{if(latestData){renderStatic(latestData);buildMonth(latestData);convert();}if(selectedDayData)renderDayDetail(selectedDayData);},
      refreshCalendar:()=>{if(latestData){buildMonth(latestData);monthView.renderCurrent(latestData);}}
    });
    await monthRepository.hydrate().catch(()=>{});
    await loadCachedWeather();
    performance.mark('solar-weather-cache-ready');
    resolveAndApplyTheme(null);setMode(displayMode);buildBottomNav();buildOrbitDial();applyLanguage();buildWeekHeader();
    $('dateInput').value=inputValue(new Date());$('launchToggle').checked=showLaunch;$('defaultMode').value=displayMode;clearPlaceForm();renderSavedPlaces();renderLocationSettings();renderSourceStatus();
    performance.mark('solar-settings-rendered');
    bind();tick(true);convert();launchSequence(latestData);
    if(monthRepository.hydrated)await monthView.reconcile();
    performance.mark('solar-first-render');
    notificationNavigationReady=true;
    if(pendingNotificationDate){openRoute('today');openDayDetail(getSolarData(pendingNotificationDate));pendingNotificationDate=null;}
    syncReminderNotifications(false);
    setInterval(()=>{if(!document.hidden)tick(false);},1000);
  }
  window.SolarCircleAppShell = Object.freeze({ openRoute, openScreen, activeRoute: () => activeRoute, activeScreen: () => activeScreen });
  function startupFailed(){
    const screen=$('launchScreen');screen.classList.remove('hidden');screen.style.display='grid';screen.dataset.state='error';
    $('launchCopy').textContent=language==='en'?'Local data could not be opened. No data was deleted.':'Не удалось открыть локальные данные. Данные не удалены.';
    const retry=document.createElement('button');retry.type='button';retry.className='round-button';retry.id='startupRetry';
    retry.title=language==='en'?'Retry':'Повторить';retry.setAttribute('aria-label',retry.title);
    retry.innerHTML='<svg width="20" height="20" aria-hidden="true"><use href="#refresh-cw"></use></svg>';
    retry.addEventListener('click',()=>location.reload());screen.append(retry);
    performance.mark('solar-startup-failed');
  }
  const boot=()=>start().catch(startupFailed);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
