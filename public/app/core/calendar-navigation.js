(() => {
  'use strict';
  const Calendar = typeof require === 'function' ? require('./calendar-core.js') : globalThis.SolarCircleCalendarCore;
  const Time = typeof require === 'function' ? require('./time-core.js') : globalThis.SolarCircleTimeCore;
  const Day = typeof require === 'function' ? require('./day-context.js') : globalThis.SolarCircleDayContext;
  const astronomy = () => globalThis.Astronomy;
  const cache = new Map();
  const phases = {
    ru: ['Увидеть', 'Выбрать', 'Действовать', 'Удержать', 'Закрепить'],
    en: ['See', 'Choose', 'Act', 'Hold', 'Anchor']
  };
  // Generic daily titles from the owner's IFTHENDZEN pack; no sample personal goal is imported.
  const titles = {
    ru: ['Я выбираю цель','Я понимаю зачем','Я вижу исходную точку','Я вижу, что меня уводит','Я замечаю первый результат','Я хвалю себя и готовлюсь дальше','Я выбираю, каким быть','Я замечаю, что происходит внутри','Я нахожу точку выбора','Я заранее выбираю действие','Я смотрю на первые выборы','Я выбрал направление','Я прохожу трудный момент заранее','Я начинаю','Я остаюсь со сложным','Я завершаю','Я вижу доказательство изменения','Я вижу половину пути','Я действую без нужного настроения','Я сохраняю направление при усталости','Реальность пошла не по плану','Я выбираю: действовать или принять','Я вижу, что выдержало','Я умею продолжать','Я замечаю, что стало легче','Я замечаю, что новое начинает происходить само','Я вижу, где ещё нужна тренировка','Я проверяю себя самостоятельно','Я праздную пройденный путь','Я вижу себя сегодня'],
    en: ['I choose a goal','I understand why','I see my starting point','I notice what pulls me away','I notice the first result','I appreciate myself and prepare to continue','I choose how to be','I notice what is happening inside','I find the choice point','I choose an action in advance','I review my first choices','I have chosen a direction','I rehearse a difficult moment','I begin','I stay with the difficult part','I finish','I see evidence of change','I see the halfway point','I act without waiting for the right mood','I keep my direction when tired','Reality did not follow the plan','I choose: act or accept','I see what held up','I know how to continue','I notice what became easier','I notice the new habit emerging','I see what still needs practice','I test myself independently','I celebrate the journey','I see myself today']
  };
  function validate(year, month) {
    if (!Number.isInteger(year) || year < 1 || year > 3000 || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new RangeError('Calendar year/month out of range');
    }
  }
  function iso(civil) {
    return `${String(civil.year).padStart(4,'0')}-${String(civil.month).padStart(2,'0')}-${String(civil.day).padStart(2,'0')}`;
  }
  function civilDate(civil, timezone, hour = '12:00:00') {
    return Time.dateFromInput(`${iso(civil)}T${hour}`, timezone);
  }
  function moveMonth(cursor, delta) {
    const value = cursor.year * 12 + cursor.month - 1 + delta;
    const next = { ...cursor, year: Math.floor(value / 12), month: ((value % 12) + 12) % 12 + 1 };
    validate(next.year, next.month);
    return next;
  }
  function journey(solar, language = 'ru') {
    const lang = language === 'en' ? 'en' : 'ru';
    const index = Math.floor((solar.day - 1) / 6);
    return { phase: phases[lang][index], index, day: solar.day, soft: (solar.day - 1) % 6 >= 4, title: titles[lang][solar.day - 1] };
  }
  function civilDays(start, end, timezone) {
    const result = [];
    for (let date = Time.localDayStart(start, timezone); date < end; date = Time.addCalendarDays(date, 1, timezone)) {
      const next = Time.addCalendarDays(date, 1, timezone);
      if (next > start) result.push(Time.civilParts(date, timezone));
      if (result.length > 4) throw new RangeError('Unexpected solar sector length');
    }
    return result;
  }
  function solarMonth(year, month, timezone) {
    validate(year, month);
    if (!Time.validTimezone(timezone)) throw new RangeError('Invalid time zone');
    const key = `${year}/${month}/${timezone}`;
    if (cache.has(key)) return cache.get(key);
    const engine = astronomy();
    if (!engine?.SearchSunLongitude) throw new Error('Astronomy Engine unavailable');
    const degree = (month - 1) * 30;
    const near = new Date(0); near.setUTCFullYear(year, 2, 1); near.setUTCHours(0,0,0,0);
    let start = engine.SearchSunLongitude(degree, near, 370)?.date;
    if (!start) throw new Error('Solar month boundary unavailable');
    const rows = [];
    for (let day = 1; day <= 30; day++) {
      const end = engine.SearchSunLongitude((degree + day) % 360, new Date(start.getTime() + 1000), 3)?.date;
      if (!end || end <= start) throw new Error('Solar day boundary unavailable');
      rows.push({ solar: Calendar.solarDateFromDegreeIndex(degree + day - 1, year), start, end,
        date: new Date((start.getTime() + end.getTime()) / 2), civilDates: civilDays(start, end, timezone) });
      start = end;
    }
    if (cache.size >= 24) cache.delete(cache.keys().next().value);
    cache.set(key, rows);
    return rows;
  }
  function civilMonth(year, month, timezone) {
    validate(year, month);
    let date = civilDate({year,month,day:1}, timezone);
    const rows = [];
    while (Time.civilParts(date, timezone).month === month && rows.length < 31) {
      const start = Time.localDayStart(date, timezone);
      const end = Time.addCalendarDays(start, 1, timezone);
      const civil = Time.civilParts(date, timezone);
      const noon = civilDate(civil, timezone);
      rows.push({ civil, date: noon, start, end, solar: Day.solarDateForDate(noon),
        solarStart: Day.solarDateForDate(start), solarEnd: Day.solarDateForDate(new Date(end.getTime() - 1)) });
      date = Time.addCalendarDays(date, 1, timezone);
    }
    return rows;
  }
  const api = Object.freeze({ phases, journey, iso, civilDate, moveMonth, solarMonth, civilMonth });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleCalendarNavigation = api;
})();
