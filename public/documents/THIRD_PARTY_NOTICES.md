# Third-party notices

Solar Year сохраняет благодарности и технический реестр отдельно.

Публичная подпись проекта: `@ALEX_DOC`  
Контакт: `petrovav024026@gmail.com`

Упоминание проекта или автора означает признание технологического или информационного вклада через open-source работу. Оно не означает официального партнерства, трудовых отношений, спонсорства или одобрения Solar Year авторами этих проектов, если такое сотрудничество отдельно не объявлено.

## Astronomy Engine

- Package: `astronomy-engine` 2.1.19
- Author: Don Cross / CosineKitty
- License: MIT
- Project: https://github.com/cosinekitty/astronomy
- Role in Solar Year: astronomical foundation and source of calculation mechanisms.

## Capacitor

- Packages: `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`, `@capacitor/preferences`, `@capacitor/status-bar`, `@capacitor/local-notifications`, `@capacitor/geolocation` 8.2.2
- License: MIT
- Project: https://capacitorjs.com/
- Role in Solar Year: native Android shell and plugin bridge.

Local Notifications 8.3.1 has an app-maintained Android recovery patch in
`patches/local-notifications-8.3.1.patch`: distinguish actual delivery from a due
time missed during reboot. Original MIT attribution is retained. The patch is
version/hash checked and applied by postinstall and Capacitor sync.

## Open-Meteo

- Service: Open-Meteo Forecast API
- Data license: CC BY 4.0
- Project: https://open-meteo.com/
- Documentation: https://open-meteo.com/en/docs
- Role in Solar Year: optional current weather and forecast refresh by manually saved or active saved-place coordinates, with offline cache fallback. Wind values are derived from the same Open-Meteo weather response.
- Attribution: Weather data by Open-Meteo.com
- Current release: free non-commercial direct APK, no ads, subscriptions or paid features. `FREE_NONCOMMERCIAL_API = ACCEPTED`; `PAID_PLAN = NOT_REQUIRED_FOR_CURRENT_RELEASE`. Retain attribution and comply with Free API limits. Reassess only if usage becomes commercial/promotional or exceeds limits. [Open-Meteo terms](https://open-meteo.com/en/terms).

## Location and timezone dependencies

- `@js-temporal/polyfill` 0.5.1, ISC: https://github.com/js-temporal/temporal-polyfill
- `@photostructure/tz-lookup` 11.6.1, CC0: https://github.com/photostructure/tz-lookup
- Browser copies and licenses: `www/vendor/`; prepared by `npm run build:web`.
- Offline coordinate-to-IANA lookup is approximate near borders. Manual IANA override remains available.
- Open-Meteo Geocoding API is queried only after an explicit city search: https://open-meteo.com/en/docs/geocoding-api

## Lucide control icons

- `refresh-cw`, `map-pin`, `download`, `folder-open`, `chevron-left`, `chevron-right`: https://github.com/lucide-icons/lucide
- ISC, Copyright (c) 2026 Lucide Icons and Contributors.
- Local symbols: `www/assets/svg/icons/wind-controls.svg`, `www/assets/svg/icons/file-controls.svg`, `www/assets/svg/icons/calendar-controls.svg`; license: `www/vendor/lucide-LICENSE.txt`.
- No remote icon loader or Lucide runtime is included.

## Solar Year local map boundary

- Package: project-local `GeoMapCore`
- External map runtime: not bundled in this version
- Role in Solar Year: viewport and layer contract for future map, weather, wind, and station visualization.

## Historical facts and monthly choice cycle

- Offline pack 0.2.0 includes twelve historical facts checked against Wikipedia on 2026-09-06, in addition to the twenty existing events. Article URLs, original dates and verification dates are recorded in `data/offline-events/history-facts.json`.
- Source articles: CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/. No article text, photographs or illustrations are bundled; the RU/EN entries are original brief factual summaries. Runtime has no Wikipedia requests.
- The stable asset filename `solar-circle-events-pack.v0.1.0` is retained for compatibility; the authoritative pack metadata version is 0.2.0.
- IFTHENDZEN / Выбория: five stages and thirty daily readings by ALEX_DOC from the owner's `IFTHENDZEN_VYBORIA_30D_Solar_Prometei_pack_v0.1.0.zip`. Imported as plain text by `scripts/import-vyboria.ps1`, with source SHA-256 in `www/data/vyboria-reading.js`. Bilingual daily introductions are editorial adaptations; the full original reading is Russian and labelled as such in English UI. No example personal goal, executable prompt or Prometei connection is imported. The separately audited General Path v0.2.0 is not silently substituted for this goal-oriented cycle.

## Personal SVG Sanitization

- DOMPurify 3.4.15, https://github.com/cure53/DOMPurify, used under Apache-2.0 (upstream offers Apache-2.0 OR MPL-2.0). Unmodified browser distribution and full license are bundled at `www/vendor/dompurify.js` and `www/vendor/dompurify-LICENSE.txt`.
- Pinned in package-lock.json. Imported SVGs pass a separate restrictive local XML/value/resource validation before and after DOMPurify; no user SVG is inserted as application HTML.
- The default Tree of Life is the owner's supplied vector, with twelve approved leaf-visibility variants. It does not replace the application icon or astronomical dial.

## Future / audited donors

The following projects are tracked as part of the Solar Year open-source ecosystem and will be versioned in this notice when their code or data is integrated into the app:

- MapLibre
- maplibre-gl-wind
- Earth / earth.nullschool
- Breezy Weather
- Meteostat
- Vacanza Holidays
- HistoryLabs events-api
- dopecodez / Wikipedia client
