(() => {
  'use strict';
  const Wind = globalThis.SolarCircleWindCore;
  const COPY = {
    ru: { now: 'Сейчас', speed: 'Скорость', gust: 'Порывы', from: 'Из', toward: 'К', calm: 'Штиль', unavailable: 'Нет данных', forecast: 'Прогноз', noForecast: 'Нет почасового прогноза', refresh: 'Обновить прогноз', location: 'Изменить местоположение', units: 'Единицы скорости', time: 'Время прогноза', updated: 'Обновлено', days: 'По дням', ms: 'м/с', kmh: 'км/ч', kn: 'уз', hours: 'ч', chart: 'Скорость и порывы ветра', cacheOld: 'Устаревший кэш' },
    en: { now: 'Now', speed: 'Speed', gust: 'Gusts', from: 'From', toward: 'To', calm: 'Calm', unavailable: 'No data', forecast: 'Forecast', noForecast: 'No hourly forecast', refresh: 'Refresh forecast', location: 'Change location', units: 'Speed units', time: 'Forecast time', updated: 'Updated', days: 'Daily', ms: 'm/s', kmh: 'km/h', kn: 'kn', hours: 'h', chart: 'Wind speed and gusts', cacheOld: 'Outdated cache' }
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function createView({ onUnitChange, onRefresh, onLocation }) {
    const $ = id => document.getElementById(id);
    const text = (id, value) => { $(id).textContent = value; };
    let state, hours = [], selectedTime = null, chartWidth = 640;
    const copy = () => COPY[state.language] || COPY.ru;
    const unitLabel = () => ({ 'm/s': copy().ms, 'km/h': copy().kmh, kn: copy().kn }[state.unit]);
    const number = value => Number.isFinite(value) ? new Intl.NumberFormat(state.language, { maximumFractionDigits: 1 }).format(value) : '—';
    const speed = (value, unit) => Wind.convertSpeed(value, unit, state.unit);
    const formatSpeed = (value, unit) => `${number(speed(value, unit))} ${unitLabel()}`;
    const stamp = (date, options) => new Intl.DateTimeFormat(state.language === 'ru' ? 'ru-RU' : 'en-GB', { timeZone: state.timezone, ...options }).format(date);
    const dateTime = date => stamp(date, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const color = (value, unit) => {
      const ms = Wind.convertSpeed(value, unit);
      return ms === null ? 'var(--sc-text-muted)' : ms < 3 ? 'var(--wind-low)' : ms < 8 ? 'var(--wind-medium)' : ms < 15 ? 'var(--wind-high)' : 'var(--wind-severe)';
    };
    function direction(value) {
      const ms = Wind.convertSpeed(value?.speed, value?.unit);
      if (ms !== null && ms < .3) return copy().calm;
      return value?.direction == null ? copy().unavailable : `${copy().from} ${value.compass} · ${Math.round(value.direction)}°`;
    }
    function arrow(item) {
      const angle = Wind.flowDirection(item.direction, item.speed, item.unit);
      return angle === null ? '<span class="wind-no-direction">—</span>' : `<svg class="wind-flow-arrow" viewBox="0 0 24 24" aria-hidden="true"><path transform="rotate(${angle} 12 12)" d="M12 21V3m-6 6 6-6 6 6"/></svg>`;
    }
    function select(time) {
      selectedTime = time;
      const selected = hours.find(item => item.time === selectedTime);
      if (!selected) selectedTime = null;
      const item = selected || state.wind?.value;
      const instant = selected?.instant || Wind.forecastInstant(item?.time, state.timezone);
      text('windSelectedTime', instant ? `${copy().forecast} · ${dateTime(instant)}` : copy().unavailable);
      text('windSpeedValue', formatSpeed(item?.speed, item?.unit));
      text('windGustValue', `${copy().gust} ${formatSpeed(item?.gust, item?.gustUnit)}`);
      text('windDirectionValue', direction(item));
      const index = hours.findIndex(hour => hour.time === selectedTime);
      $('windTimeSlider').value = Math.max(0, index);
      $('windTimeSlider').setAttribute('aria-valuetext', instant ? dateTime(instant) : copy().unavailable);
      $('windNowButton').setAttribute('aria-pressed', String(!selectedTime));
      $('windHourlyList').querySelectorAll('[data-wind-hour]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.windHour === selectedTime)));
      renderCompass(item);
      const cursor = $('windChart').querySelector('.wind-chart-cursor');
      if (cursor) {
        cursor.setAttribute('visibility', index < 0 ? 'hidden' : 'visible');
        cursor.setAttribute('transform', `translate(${chartX(Math.max(0, index))} 0)`);
      }
    }
    function renderCompass(item) {
      const flow = Wind.flowDirection(item?.direction, item?.speed, item?.unit);
      const label = direction(item);
      const ticks = Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15} 100 100)" d="M100 27v${i % 6 ? 4 : 8}"/>`).join('');
      const cardinals = state.language === 'en' ? ['N', 'E', 'S', 'W'] : ['С', 'В', 'Ю', 'З'];
      $('windCompass').innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="${escape(label)}">
        <circle class="wind-compass-ring" cx="100" cy="100" r="76"/>
        <circle class="wind-compass-ring" cx="100" cy="100" r="48"/>
        <g class="wind-compass-ticks">${ticks}</g>
        <g class="wind-cardinals" text-anchor="middle"><text x="100" y="17">${cardinals[0]}</text><text x="191" y="104">${cardinals[1]}</text><text x="100" y="197">${cardinals[2]}</text><text x="9" y="104">${cardinals[3]}</text></g>
        ${flow === null ? '<circle class="wind-calm-dot" cx="100" cy="100" r="7"/>' : `<g transform="rotate(${flow} 100 100)" style="color:${color(item.speed, item.unit)}"><path class="wind-compass-tail" d="M100 155V58"/><path class="wind-compass-head" d="m100 43-14 25 14-5 14 5Z"/><circle class="wind-origin" cx="100" cy="164" r="4"/></g>`}
      </svg>`;
    }
    function chartX(index) { return 38 + index * ((chartWidth - 58) / Math.max(1, hours.length - 1)); }
    function renderChart() {
      chartWidth = Math.max(260, $('windChart').clientWidth || 640);
      if (!hours.length) { $('windChart').innerHTML = `<p class="inline-empty">${escape(copy().noForecast)}</p>`; return; }
      const values = hours.flatMap(item => [speed(item.speed, item.unit), speed(item.gust, item.gustUnit)]).filter(Number.isFinite);
      const ceiling = Math.max(5, Math.ceil(Math.max(0, ...values) / 5) * 5);
      const y = value => 136 - value / ceiling * 112;
      const series = (key, unit) => {
        let connected = false;
        return hours.map((item, index) => {
          const value = speed(item[key], item[unit]);
          if (value === null) { connected = false; return ''; }
          const command = connected ? 'L' : 'M'; connected = true;
          return `${command}${chartX(index).toFixed(2)} ${y(value).toFixed(2)}`;
        }).join(' ');
      };
      const grid = [0, .5, 1].map(ratio => `<path d="M38 ${y(ceiling * ratio)}H${chartWidth - 20}"/><text x="28" y="${y(ceiling * ratio) + 4}" text-anchor="end">${number(ceiling * ratio)}</text>`).join('');
      const times = hours.filter((_, i) => i % Math.max(1, Math.ceil(hours.length / 5)) === 0).map(item => `<text x="${chartX(hours.indexOf(item))}" y="163" text-anchor="middle">${stamp(item.instant, { hour: '2-digit', minute: '2-digit' })}</text>`).join('');
      $('windChart').innerHTML = `<svg viewBox="0 0 ${chartWidth} 176" role="img" aria-label="${escape(`${copy().chart}, ${unitLabel()}`)}"><g class="wind-chart-grid">${grid}${times}</g><path class="wind-chart-gust" d="${series('gust', 'gustUnit')}"/><path class="wind-chart-speed" d="${series('speed', 'unit')}"/>${hours.map((item, i) => { const value = speed(item.speed, item.unit); return value === null ? '' : `<circle cx="${chartX(i)}" cy="${y(value)}" r="3" fill="${color(item.speed, item.unit)}"/>`; }).join('')}<path class="wind-chart-cursor" d="M0 16V140" visibility="hidden"/></svg>`;
    }
    function render(next) {
      const changedPlace = state && (state.locationKey !== next.locationKey || state.timezone !== next.timezone);
      state = next;
      if (changedPlace) selectedTime = null;
      hours = Wind.upcomingHourly(state.wind, state.now, state.timezone, 24);
      $('windUnitSelect').value = state.unit;
      Array.from($('windUnitSelect').options).forEach(option => { option.textContent = ({ 'm/s': copy().ms, 'km/h': copy().kmh, kn: copy().kn })[option.value]; });
      for (const [id, key] of [['windRefreshButton', 'refresh'], ['windLocationButton', 'location'], ['windUnitSelect', 'units'], ['windTimeSlider', 'time']]) {
        $(id).setAttribute('aria-label', copy()[key]); $(id).title = copy()[key];
      }
      text('windLocationName', state.locationLabel);
      text('windTimezone', state.timezone);
      const updated = Wind.forecastInstant(state.wind.fetchedAt, state.timezone);
      const expired = updated && state.now - updated > 3 * 3600000;
      text('windScreenStatus', state.wind.status === 'cached-stale' || (expired && ['fresh','cached-fresh'].includes(state.wind.status)) ? copy().cacheOld : state.statusLabel);
      text('windUpdatedAt', updated ? `${copy().updated} ${dateTime(updated)}` : '');
      $('windRefreshButton').disabled = state.wind.status === 'loading' || !state.locationKey;
      text('windChartUnit', unitLabel());
      text('windHourlyMeta', hours.length ? `${dateTime(hours[0].instant)} → ${dateTime(hours.at(-1).instant)}` : copy().noForecast);
      $('windTimeSlider').max = Math.max(0, hours.length - 1);
      $('windTimeSlider').disabled = !hours.length;
      $('windHourlyList').innerHTML = hours.map(item => `<button type="button" data-wind-hour="${escape(item.time)}" aria-pressed="false" aria-label="${escape(`${dateTime(item.instant)}, ${formatSpeed(item.speed, item.unit)}, ${copy().gust} ${formatSpeed(item.gust, item.gustUnit)}, ${direction(item)}`)}"><small>${stamp(item.instant, { day: 'numeric', month: 'short' })}</small><b>${stamp(item.instant, { hour: '2-digit', minute: '2-digit' })}</b>${arrow(item)}<strong style="border-color:${color(item.speed, item.unit)}">${number(speed(item.speed, item.unit))}</strong><span>${number(speed(item.gust, item.gustUnit))}</span></button>`).join('');
      const today = state.now;
      const dayKey = stamp(today, { year: 'numeric', month: '2-digit', day: '2-digit' });
      const days = (state.wind.forecast?.daily || []).filter(item => {
        const date = Wind.forecastInstant(`${item.date}T12:00`, state.timezone);
        return date && (date >= today || stamp(date, { year: 'numeric', month: '2-digit', day: '2-digit' }) === dayKey);
      });
      $('windDailyList').innerHTML = days.length ? days.map(item => `<div class="wind-day-row"><strong>${stamp(Wind.forecastInstant(`${item.date}T12:00`, state.timezone), { weekday: 'short', day: 'numeric', month: 'short' })}</strong><span>${arrow(item)} ${escape(item.compass || '—')}</span><b>${formatSpeed(item.speed, item.unit)}</b><small>${copy().gust} ${formatSpeed(item.gust, item.gustUnit)}</small></div>`).join('') : `<p class="inline-empty">${copy().unavailable}</p>`;
      renderChart(); select(selectedTime);
    }
    $('windUnitSelect').addEventListener('change', event => onUnitChange(event.target.value));
    $('windRefreshButton').addEventListener('click', onRefresh);
    $('windLocationButton').addEventListener('click', onLocation);
    $('windNowButton').addEventListener('click', () => select(null));
    $('windTimeSlider').addEventListener('input', event => {
      select(hours[Number(event.target.value)]?.time);
      const button = $('windHourlyList').querySelector('[aria-pressed="true"]');
      if (button) button.parentElement.parentElement.scrollLeft = button.offsetLeft - button.parentElement.offsetLeft;
    });
    $('windHourlyList').addEventListener('click', event => { const button = event.target.closest('[data-wind-hour]'); if (button) select(button.dataset.windHour); });
    new ResizeObserver(() => { if (state && $('windChart').clientWidth > 0 && $('windChart').clientWidth !== chartWidth) { renderChart(); select(selectedTime); } }).observe($('windChart'));
    return Object.freeze({ render });
  }
  globalThis.SolarCircleWindView = Object.freeze({ createView });
})();
