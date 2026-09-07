(() => {
  'use strict';
  const pack = {
  "schema": "solar-circle.offline-event-pack",
  "version": "0.2.0",
  "builtAt": "2026-09-06T07:02:45.773Z",
  "localeCoverage": [
    "ru",
    "en"
  ],
  "policy": {
    "runtimeNetwork": false,
    "textBundledFromSources": false,
    "eventTextMode": "local-short-summary",
    "sourceAttributionRequired": true
  },
  "sources": [
    {
      "id": "un-observances",
      "type": "reference",
      "name": "United Nations Observances",
      "url": "https://www.un.org/en/observances/international-days-and-weeks",
      "license": "facts-only citation; source text not redistributed",
      "rights": {
        "mode": "facts-only",
        "textBundled": false
      }
    },
    {
      "id": "nasa-history",
      "type": "reference",
      "name": "NASA History",
      "url": "https://www.nasa.gov/image-article/april-1961-first-human-entered-space/",
      "license": "facts-only citation; source text not redistributed",
      "rights": {
        "mode": "facts-only",
        "textBundled": false
      }
    },
    {
      "id": "unicode-cldr",
      "type": "reference",
      "name": "Unicode CLDR calendar data",
      "url": "https://unicode.org/reports/tr35/tr35-dates.html",
      "license": "Unicode License terms; facts-only date metadata",
      "rights": {
        "mode": "facts-only",
        "textBundled": false
      }
    },
    {
      "id": "solar-circle-canon",
      "type": "project",
      "name": "Solar Year calendar canon",
      "url": "local://solar-circle/calendar-core",
      "license": "Solar Year project-local canon",
      "rights": {
        "mode": "project-local",
        "textBundled": false
      }
    },
    {
      "id": "wikipedia-history-facts",
      "name": "Wikipedia / historical facts",
      "type": "reference",
      "url": "https://en.wikipedia.org/wiki/Main_Page",
      "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
      "version": "verified-2026-09-06",
      "verifiedAt": "2026-09-06",
      "rights": {
        "textBundled": false,
        "eventText": "original-short-factual-summary",
        "sourceLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      }
    }
  ],
  "events": [
    {
      "id": "civil-new-year",
      "title": {
        "ru": "Новый год",
        "en": "New Year's Day"
      },
      "description": {
        "ru": "Первый день года в гражданском григорианском календаре.",
        "en": "The first day of the civil Gregorian calendar year."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 1,
        "day": 1,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "calendar"
      ],
      "source": {
        "type": "reference",
        "name": "Unicode CLDR calendar data",
        "url": "https://unicode.org/reports/tr35/tr35-dates.html",
        "license": "Unicode License terms; facts-only date metadata",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "unicode-cldr"
    },
    {
      "id": "civil-international-womens-day",
      "title": {
        "ru": "Международный женский день",
        "en": "International Women's Day"
      },
      "description": {
        "ru": "Ежегодный день, связанный с правами женщин и равным участием в обществе.",
        "en": "An annual day connected with women's rights and equal participation in society."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 3,
        "day": 8,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "human-rights"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-first-human-spaceflight",
      "title": {
        "ru": "Первый полет человека в космос",
        "en": "First Human Spaceflight"
      },
      "description": {
        "ru": "12 апреля 1961 года Юрий Гагарин совершил орбитальный полет на корабле «Восток-1».",
        "en": "On April 12, 1961, Yuri Gagarin made an orbital flight aboard Vostok 1."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1961,
        "month": 4,
        "day": 12,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "space",
        "history"
      ],
      "source": {
        "type": "reference",
        "name": "NASA History",
        "url": "https://www.nasa.gov/image-article/april-1961-first-human-entered-space/",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "nasa-history"
    },
    {
      "id": "civil-mother-earth-day",
      "title": {
        "ru": "Международный день Матери-Земли",
        "en": "International Mother Earth Day"
      },
      "description": {
        "ru": "День внимания к связи человека, природы и устойчивого развития.",
        "en": "A day focused on the relationship between people, nature, and sustainable development."
      },
      "category": "nature",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 4,
        "day": 22,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "nature"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-world-environment-day",
      "title": {
        "ru": "Всемирный день окружающей среды",
        "en": "World Environment Day"
      },
      "description": {
        "ru": "Ежегодный день экологической осознанности, отмечаемый 5 июня.",
        "en": "An annual day of environmental awareness observed on June 5."
      },
      "category": "nature",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 6,
        "day": 5,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "nature"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-day-of-peace",
      "title": {
        "ru": "Международный день мира",
        "en": "International Day of Peace"
      },
      "description": {
        "ru": "День, посвященный идее мира и снижению насилия.",
        "en": "A day dedicated to peace and the reduction of violence."
      },
      "category": "memorial",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 9,
        "day": 21,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "peace"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-human-rights-day",
      "title": {
        "ru": "День прав человека",
        "en": "Human Rights Day"
      },
      "description": {
        "ru": "Ежегодное напоминание о Всеобщей декларации прав человека и достоинстве каждого человека.",
        "en": "An annual reminder of the Universal Declaration of Human Rights and human dignity."
      },
      "category": "memorial",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 12,
        "day": 10,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "human-rights"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-day-of-happiness",
      "title": {
        "ru": "Международный день счастья",
        "en": "International Day of Happiness"
      },
      "description": {
        "ru": "День, напоминающий о важности благополучия и качества жизни.",
        "en": "A day that highlights well-being and quality of life."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 3,
        "day": 20,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "well-being"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-world-water-day",
      "title": {
        "ru": "Всемирный день водных ресурсов",
        "en": "World Water Day"
      },
      "description": {
        "ru": "День внимания к воде, доступу к ней и бережному отношению к водным ресурсам.",
        "en": "A day focused on water, access to it, and careful stewardship of water resources."
      },
      "category": "nature",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 3,
        "day": 22,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "nature",
        "water"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-world-health-day",
      "title": {
        "ru": "Всемирный день здоровья",
        "en": "World Health Day"
      },
      "description": {
        "ru": "Ежегодная дата, связанная с общественным здоровьем и доступом к заботе о нем.",
        "en": "An annual date connected with public health and access to health care."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 4,
        "day": 7,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "health"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-creativity-innovation-day",
      "title": {
        "ru": "Всемирный день творчества и инновационной деятельности",
        "en": "World Creativity and Innovation Day"
      },
      "description": {
        "ru": "Дата о роли творческого мышления и новых решений в развитии общества.",
        "en": "A date about creative thinking and new solutions in social development."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 4,
        "day": 21,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "creativity"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-world-oceans-day",
      "title": {
        "ru": "Всемирный день океанов",
        "en": "World Oceans Day"
      },
      "description": {
        "ru": "День внимания к океанам и их роли в жизни планеты.",
        "en": "A day focused on oceans and their role in life on Earth."
      },
      "category": "nature",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 6,
        "day": 8,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "nature",
        "ocean"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-day-of-yoga",
      "title": {
        "ru": "Международный день йоги",
        "en": "International Day of Yoga"
      },
      "description": {
        "ru": "День практик, связанных с телом, дыханием и устойчивым вниманием.",
        "en": "A day for practices connected with the body, breath, and steady attention."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 6,
        "day": 21,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "well-being",
        "routine"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-day-of-friendship",
      "title": {
        "ru": "Международный день дружбы",
        "en": "International Day of Friendship"
      },
      "description": {
        "ru": "Дата о человеческих связях, доверии и культуре мирного общения.",
        "en": "A date about human connection, trust, and a culture of peaceful communication."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 7,
        "day": 30,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "peace"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-literacy-day",
      "title": {
        "ru": "Международный день грамотности",
        "en": "International Literacy Day"
      },
      "description": {
        "ru": "День, посвященный грамотности, образованию и доступу к знаниям.",
        "en": "A day dedicated to literacy, education, and access to knowledge."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 9,
        "day": 8,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "education"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-world-food-day",
      "title": {
        "ru": "Всемирный день продовольствия",
        "en": "World Food Day"
      },
      "description": {
        "ru": "Дата о продовольственной безопасности, устойчивости и доступе к пище.",
        "en": "A date about food security, sustainability, and access to food."
      },
      "category": "holiday",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 10,
        "day": 16,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "food",
        "sustainability"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "civil-international-volunteer-day",
      "title": {
        "ru": "Международный день добровольцев",
        "en": "International Volunteer Day"
      },
      "description": {
        "ru": "День признания добровольческого труда и участия людей в жизни сообществ.",
        "en": "A day recognizing volunteer work and people's participation in community life."
      },
      "category": "memorial",
      "date": {
        "kind": "civil",
        "year": null,
        "month": 12,
        "day": 5,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "community"
      ],
      "source": {
        "type": "reference",
        "name": "United Nations Observances",
        "url": "https://www.un.org/en/observances/international-days-and-weeks",
        "license": "facts-only citation; source text not redistributed",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "un-observances"
    },
    {
      "id": "solar-circle-year-start",
      "title": {
        "ru": "Начало солнечного года",
        "en": "Solar Year Opening"
      },
      "description": {
        "ru": "Первый день 360-градусного календарного круга Solar Year.",
        "en": "The first day of the 360-degree Solar Year calendar year."
      },
      "category": "system",
      "date": {
        "kind": "solar",
        "year": null,
        "totalDay": 1,
        "month": 1,
        "day": 1,
        "projection": null,
        "solarDate": {
          "year": null,
          "totalDay": 1,
          "month": 1,
          "day": 1,
          "quarter": 1,
          "weekdayIndex": 0,
          "week": 1,
          "degreeStart": 0,
          "degreeEnd": 1,
          "isWeekend": false
        }
      },
      "recurrence": "SOLAR_YEARLY",
      "tags": [
        "solar",
        "calendar"
      ],
      "source": {
        "type": "project",
        "name": "Solar Year calendar canon",
        "url": "local://solar-circle/calendar-core",
        "license": "Solar Year project-local canon",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "solar-circle-canon"
    },
    {
      "id": "solar-circle-yurin-open",
      "title": {
        "ru": "Открытие Юрина месяца",
        "en": "Yurin Month Opening"
      },
      "description": {
        "ru": "301-й солнечный день: начало одиннадцатого месяца канона.",
        "en": "Solar day 301: the opening of the eleventh canon month."
      },
      "category": "system",
      "date": {
        "kind": "solar",
        "year": null,
        "totalDay": 301,
        "month": 11,
        "day": 1,
        "projection": null,
        "solarDate": {
          "year": null,
          "totalDay": 301,
          "month": 11,
          "day": 1,
          "quarter": 4,
          "weekdayIndex": 0,
          "week": 1,
          "degreeStart": 300,
          "degreeEnd": 301,
          "isWeekend": false
        }
      },
      "recurrence": "SOLAR_YEARLY",
      "tags": [
        "solar",
        "month"
      ],
      "source": {
        "type": "project",
        "name": "Solar Year calendar canon",
        "url": "local://solar-circle/calendar-core",
        "license": "Solar Year project-local canon",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "solar-circle-canon"
    },
    {
      "id": "solar-circle-katin-open",
      "title": {
        "ru": "Открытие Катина месяца",
        "en": "Katin Month Opening"
      },
      "description": {
        "ru": "331-й солнечный день: начало двенадцатого месяца канона.",
        "en": "Solar day 331: the opening of the twelfth canon month."
      },
      "category": "system",
      "date": {
        "kind": "solar",
        "year": null,
        "totalDay": 331,
        "month": 12,
        "day": 1,
        "projection": null,
        "solarDate": {
          "year": null,
          "totalDay": 331,
          "month": 12,
          "day": 1,
          "quarter": 4,
          "weekdayIndex": 0,
          "week": 1,
          "degreeStart": 330,
          "degreeEnd": 331,
          "isWeekend": false
        }
      },
      "recurrence": "SOLAR_YEARLY",
      "tags": [
        "solar",
        "month"
      ],
      "source": {
        "type": "project",
        "name": "Solar Year calendar canon",
        "url": "local://solar-circle/calendar-core",
        "license": "Solar Year project-local canon",
        "version": null,
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "solar-circle-canon"
    },
    {
      "id": "history-wikipedia",
      "title": {
        "ru": "Запуск Википедии",
        "en": "Wikipedia launches"
      },
      "description": {
        "ru": "Начала работу свободная энциклопедия Википедия.",
        "en": "The Wikipedia encyclopedia went online."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 2001,
        "month": 1,
        "day": 15,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Wikipedia",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-gravitational-waves-announcement",
      "title": {
        "ru": "Объявлено об обнаружении гравитационных волн",
        "en": "Gravitational-wave detection announced"
      },
      "description": {
        "ru": "Опубликовано сообщение о регистрации гравитационных волн; сам сигнал был записан 14 сентября 2015 года.",
        "en": "Scientists announced a gravitational-wave observation recorded on September 14, 2015."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 2016,
        "month": 2,
        "day": 11,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/First_observation_of_gravitational_waves",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-first-spacewalk",
      "title": {
        "ru": "Первый выход человека в открытый космос",
        "en": "First human spacewalk"
      },
      "description": {
        "ru": "Алексей Леонов вышел в открытый космос во время полета «Восхода-2».",
        "en": "Alexei Leonov performed a spacewalk during the Voskhod 2 mission."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1965,
        "month": 3,
        "day": 18,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Voskhod_2",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-hubble-launch",
      "title": {
        "ru": "Запуск телескопа «Хаббл»",
        "en": "Hubble telescope launches"
      },
      "description": {
        "ru": "Телескоп «Хаббл» отправился на орбиту на борту шаттла Discovery.",
        "en": "Space shuttle Discovery carried the Hubble telescope into orbit."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1990,
        "month": 4,
        "day": 24,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Hubble_Space_Telescope",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-skylab-launch",
      "title": {
        "ru": "Запуск станции Skylab",
        "en": "Skylab launches"
      },
      "description": {
        "ru": "На орбиту была выведена американская станция Skylab.",
        "en": "The Skylab space station was launched into orbit."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1973,
        "month": 5,
        "day": 14,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Skylab",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-vostok-6",
      "title": {
        "ru": "Полет Валентины Терешковой",
        "en": "Valentina Tereshkova's flight"
      },
      "description": {
        "ru": "Валентина Терешкова отправилась в космос на корабле «Восток-6».",
        "en": "Valentina Tereshkova launched aboard Vostok 6."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1963,
        "month": 6,
        "day": 16,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Vostok_6",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-apollo-11-landing",
      "title": {
        "ru": "Посадка «Аполлона-11» на Луну",
        "en": "Apollo 11 lands on the Moon"
      },
      "description": {
        "ru": "Лунный модуль Eagle совершил посадку на Луну с Нилом Армстронгом и Баззом Олдрином.",
        "en": "Eagle landed on the Moon with Neil Armstrong and Buzz Aldrin aboard."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1969,
        "month": 7,
        "day": 20,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Apollo_11",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-curiosity-landing",
      "title": {
        "ru": "Посадка Curiosity на Марс",
        "en": "Curiosity lands on Mars"
      },
      "description": {
        "ru": "Марсоход Curiosity прибыл в кратер Гейла на Марсе.",
        "en": "The Curiosity rover reached Gale crater on Mars."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 2012,
        "month": 8,
        "day": 6,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Curiosity_(rover)",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-voyager-1-launch",
      "title": {
        "ru": "Запуск «Вояджера-1»",
        "en": "Voyager 1 launches"
      },
      "description": {
        "ru": "Аппарат «Вояджер-1» отправился исследовать внешнюю Солнечную систему.",
        "en": "Voyager 1 began its journey to explore the outer Solar System."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1977,
        "month": 9,
        "day": 5,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Voyager_1",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-sputnik-1-launch",
      "title": {
        "ru": "Запуск первого спутника Земли",
        "en": "First artificial Earth satellite launches"
      },
      "description": {
        "ru": "«Спутник-1» был выведен на орбиту Земли. Дата запуска указана по UTC.",
        "en": "Sputnik 1 entered Earth orbit. The launch date is given in UTC."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1957,
        "month": 10,
        "day": 4,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Sputnik_1",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-zarya-launch",
      "title": {
        "ru": "Первый модуль МКС",
        "en": "First ISS module"
      },
      "description": {
        "ru": "Модуль «Заря» был запущен на орбиту и стал первым модулем Международной космической станции.",
        "en": "Zarya launched as the first module of the International Space Station."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1998,
        "month": 11,
        "day": 20,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Zarya_(ISS_module)",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    },
    {
      "id": "history-wright-flyer",
      "title": {
        "ru": "Полеты братьев Райт",
        "en": "Wright brothers' flights"
      },
      "description": {
        "ru": "Братья Райт выполнили полеты на моторном самолете Flyer у Килл-Девил-Хилс.",
        "en": "The Wright brothers flew their powered Flyer at Kill Devil Hills."
      },
      "category": "history",
      "date": {
        "kind": "civil",
        "year": 1903,
        "month": 12,
        "day": 17,
        "projection": null
      },
      "recurrence": "CIVIL_YEARLY",
      "tags": [
        "civil",
        "history",
        "discovery"
      ],
      "source": {
        "type": "reference",
        "name": "Wikipedia / historical facts",
        "url": "https://en.wikipedia.org/wiki/Wright_Flyer",
        "license": "Source articles: CC BY-SA 4.0. Facts only; original short RU/EN summaries, no article text or images bundled.",
        "version": "verified-2026-09-06",
        "commit": null
      },
      "visibility": "local",
      "createdAt": null,
      "updatedAt": null,
      "sourceId": "wikipedia-history-facts"
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = pack;
  globalThis.SolarCircleOfflineEventPack = Object.freeze(pack);
})();
