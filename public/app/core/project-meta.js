(() => {
  'use strict';

  const PUBLIC_CONTACT = Object.freeze({
    name: 'ALEX_DOC',
    handle: '@ALEX_DOC',
    email: 'petrovav024026@gmail.com'
  });

  const AUTHOR_NOTE = Object.freeze({
    ru: [
      'Мы не всегда выбираем то, что происходит с нами. Но выбор помогает нам участвовать в том, что происходящее делает из нас.',
      'Какой бы выбор вы не совершали, помните что мир изменчив и всегда меняется, покоя нет нигде и не в чем и если воспринимать планирование и ожидание из трех вариантов: средний, плохой, хороший, вам при каждом изменении мира остается принять неизбежное или найти варианты, в этом моменте планы к своим целям и тот самый выбор принять или действовать, создает маленькие точки выбора каждый день как небольшие шаги к вершине большой горы.',
      'Мир создаёт обстоятельства. Прошлое создаёт исходную точку. Принципы дают направление. А выбор снова и снова создаёт нас.'
    ],
    en: [
      'We do not always choose what happens to us. But choice lets us take part in shaping who we become through what happens.',
      'Whatever choice you make, remember that the world is changeable and constantly changing; nothing anywhere stands still. When you approach planning and expectations through three possible scenarios - average, bad and good - each change in the world leaves you with a choice: accept the inevitable or find alternatives. In that moment, your plans for reaching your goals and the choice to accept or act create small moments of choice every day, like small steps toward the summit of a great mountain.',
      'The world creates circumstances. The past creates a starting point. Principles give direction. And choice creates us, again and again.'
    ]
  });

  const ACKNOWLEDGEMENTS = Object.freeze([
    {
      name: 'Astronomy Engine',
      role: {
        ru: 'Астрономическая основа и источник расчетных механизмов.',
        en: 'Astronomical foundation and source of calculation mechanisms.'
      },
      thanks: {
        ru: 'Особая благодарность создателям и участникам Astronomy Engine за технологическую основу точных расчетов Солнца, Луны, их положения, фаз и природных циклов.',
        en: 'Special thanks to the creators and contributors of Astronomy Engine for the technology behind precise Sun and Moon calculations, positions, phases, and natural cycles.'
      }
    },
    {
      name: 'MapLibre',
      role: {
        ru: 'Технологическая основа будущих карт погоды, ветра и метеостанций.',
        en: 'Technology foundation for future weather, wind, and station maps.'
      },
      thanks: {
        ru: 'Благодарим разработчиков и сообщество MapLibre за открытую современную картографическую платформу.',
        en: 'Thanks to the MapLibre developers and community for an open modern mapping platform.'
      }
    },
    {
      name: 'maplibre-gl-wind',
      role: {
        ru: 'Технология и архитектурный ориентир для визуализации ветра.',
        en: 'Technology and architecture reference for wind visualization.'
      },
      thanks: {
        ru: 'Благодарим создателей maplibre-gl-wind за работу над визуализацией ветровых полей и движения воздушных потоков.',
        en: 'Thanks to the creators of maplibre-gl-wind for their work on wind-field and airflow visualization.'
      }
    },
    {
      name: 'Earth / earth.nullschool',
      role: {
        ru: 'Алгоритмический и UX-ориентир для Wind-модуля.',
        en: 'Algorithmic and UX reference for the Wind module.'
      },
      thanks: {
        ru: 'Отдельная благодарность создателям Earth за наглядную идею представления движения атмосферы планеты.',
        en: 'Special thanks to the creators of Earth for a vivid way to represent atmospheric motion.'
      }
    },
    {
      name: 'Open-Meteo',
      role: {
        ru: 'Источник архитектурных решений и кандидат на получение актуальных погодных данных.',
        en: 'Architecture reference and candidate source for current weather data.'
      },
      thanks: {
        ru: 'Благодарим команду Open-Meteo за развитие открытых инструментов доступа к метеорологическим данным и прогнозным моделям.',
        en: 'Thanks to the Open-Meteo team for open access tools for meteorological data and forecast models.'
      }
    },
    {
      name: 'Breezy Weather',
      role: {
        ru: 'UX- и функциональный ориентир погодного раздела.',
        en: 'UX and feature reference for the weather section.'
      },
      thanks: {
        ru: 'Благодарим разработчиков Breezy Weather за работу над спокойным и понятным отображением погоды на мобильных устройствах.',
        en: 'Thanks to Breezy Weather developers for thoughtful mobile weather presentation.'
      }
    },
    {
      name: 'Meteostat',
      role: {
        ru: 'Архитектурный и информационный ориентир для слоя метеостанций.',
        en: 'Architecture and information reference for the weather-station layer.'
      },
      thanks: {
        ru: 'Благодарим участников Meteostat за работу с метеорологическими наблюдениями и данными погодных станций.',
        en: 'Thanks to Meteostat contributors for work with meteorological observations and station data.'
      }
    },
    {
      name: 'Vacanza Holidays',
      role: {
        ru: 'Источник публичных и государственных календарных правил.',
        en: 'Source of public and government calendar-rule references.'
      },
      thanks: {
        ru: 'Благодарим создателей Vacanza Holidays за структурирование государственных и общественных праздничных дат разных стран.',
        en: 'Thanks to Vacanza Holidays creators for structuring public holiday rules across countries.'
      }
    },
    {
      name: 'Wikimedia и Wikipedia',
      role: {
        ru: 'Источник и инфраструктурный ориентир исторической информации.',
        en: 'Source and infrastructure reference for historical information.'
      },
      thanks: {
        ru: 'Благодарим международное сообщество Wikimedia и Wikipedia за сохранение исторических событий, дат, биографий и человеческой памяти.',
        en: 'Thanks to the Wikimedia and Wikipedia communities for preserving historical events, dates, biographies, and human memory.'
      }
    },
    {
      name: 'HistoryLabs events-api',
      role: {
        ru: 'Архитектурный ориентир для History Importer.',
        en: 'Architecture reference for the History Importer.'
      },
      thanks: {
        ru: 'Благодарим создателей HistoryLabs events-api за понятный пример структурирования исторических событий для приложений формата "Сегодня в истории".',
        en: 'Thanks to HistoryLabs events-api creators for a clear example of structuring "Today in history" event data.'
      }
    },
    {
      name: 'dopecodez / Wikipedia client',
      role: {
        ru: 'Технический ориентир для интеграции исторических данных.',
        en: 'Technical reference for historical data integration.'
      },
      thanks: {
        ru: 'Благодарим авторов dopecodez/Wikipedia за открытые инструменты и примеры программной работы с данными Wikipedia и On This Day.',
        en: 'Thanks to the authors of dopecodez/Wikipedia for open tools and examples for Wikipedia and On This Day data.'
      }
    }
  ]);

  const api = Object.freeze({
    PUBLIC_CONTACT,
    AUTHOR_NOTE,
    ACKNOWLEDGEMENTS
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleProjectMeta = api;
})();
