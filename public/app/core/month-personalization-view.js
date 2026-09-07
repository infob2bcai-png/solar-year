(() => {
  'use strict';
  const Core = globalThis.SolarCircleMonthPersonalizationCore;
  const Journey = globalThis.SolarCircleMonthJourneyCore;
  function createView(options) {
    const { repository, notes } = options;
    const $ = id => document.getElementById(id);
    const text = (ru, en) => options.language() === 'en' ? en : ru;
    const node = (tag, content, className) => { const el = document.createElement(tag); if (content !== undefined) el.textContent = content; if (className) el.className = className; return el; };
    const button = (label, action) => { const el = node('button', label, 'sc-btn-secondary compact-action'); el.type = 'button'; el.addEventListener('click', action); return el; };
    const image = (month, pixels = 32) => { const el = node('img', undefined, 'month-tree-image'); el.src = `assets/svg/months/tree-life-month-${String(month).padStart(2, '0')}.svg`; el.width = pixels; el.height = pixels; el.alt = ''; return el; };
    const panel = node('section', undefined, 'month-journey-panel'); panel.id = 'monthJourneyPanel';
    $('calendarCivilRange').before(panel);
    const headerTree = image(1, 40); headerTree.id = 'monthHeaderTree'; $('monthTitle').before(headerTree);
    const canonical = node('p', undefined, 'month-canonical'); canonical.id = 'monthCanonical'; $('monthTitle').after(canonical);
    const headerCustom = node('span', undefined, 'month-secondary-icon'); $('monthTitle').before(headerCustom);
    const nameLine = node('div', undefined, 'month-name-line'), nameCopy = node('div', undefined, 'month-name-copy');
    $('monthTitle').before(nameLine); nameCopy.append($('monthTitle'), canonical); nameLine.append(headerTree, nameCopy, headerCustom);
    const dayPersonal = node('p', undefined, 'month-personal-name'); dayPersonal.id = 'dayPersonalMonth'; $('dayDetailTitle').before(dayPersonal);
    const todayPersonal = node('p', undefined, 'month-personal-name'); todayPersonal.id = 'todayPersonalMonth'; $('todayHeroSolarDate').before(todayPersonal);
    const overview = node('details', undefined, 'month-overview'); overview.id = 'monthOverview';
    const summary = node('summary'); overview.append(summary);
    const toggleLabel = node('label'), toggle = node('input'); toggle.type = 'checkbox'; toggle.id = 'vyboriaEnabled';
    const toggleText = node('span'); toggleLabel.append(toggle, toggleText); overview.append(toggleLabel);
    const overviewGrid = node('div', undefined, 'month-overview-grid'); overview.append(overviewGrid); $('moreScreen').append(overview);
    const settingsButton = button('', () => { options.openMore(); overview.open = true; overview.scrollIntoView({ block: 'start' }); summary.focus(); });
    $('settingsScreen').append(settingsButton);
    const notice = node('p', undefined, 'month-completion-notice'); notice.id = 'monthCompletionNotice'; notice.setAttribute('role', 'status'); notice.hidden = true; panel.before(notice);
    const dialog = node('dialog', undefined, 'month-editor'); dialog.id = 'monthEditor';
    const form = node('form'); form.method = 'dialog';
    const heading = node('h2'); heading.id = 'monthEditorTitle'; dialog.setAttribute('aria-labelledby', heading.id);
    const close = button('', () => dialog.close()); close.className = 'round-button'; close.textContent = '\u00d7';
    const head = node('header'); head.append(heading, close); form.append(head);
    const localeLabel = node('label'), localeText = node('span'), locale = node('select'); locale.id = 'monthNameLocale';
    locale.append(new Option('Русский', 'ru'), new Option('English', 'en')); localeLabel.append(localeText, locale);
    const nameLabel = node('label'), nameText = node('span'), input = node('input'); input.id = 'monthNameInput'; input.type = 'text'; nameLabel.append(nameText, input);
    const save = node('button', undefined, 'primary-button'); save.type = 'submit';
    const reset = button('', () => perform(() => repository.restoreCanonicalName(editMonth), true));
    const file = node('input'); file.type = 'file'; file.accept = '.svg,image/svg+xml'; file.id = 'monthSvgInput'; file.hidden = true;
    const chooseFile = button('', () => file.click());
    const fileLabel = node('div', undefined, 'month-file-field'), fileText = node('span'), fileRules = node('p'); fileRules.id = 'monthSvgRules';
    file.setAttribute('aria-describedby', fileRules.id); chooseFile.setAttribute('aria-describedby', fileRules.id);
    fileLabel.append(fileText, fileRules, chooseFile, file);
    const custom = node('img'); custom.width = 48; custom.height = 48; custom.hidden = true; custom.id = 'monthCustomSvgPreview';
    const removeIcon = button('', () => perform(() => repository.assignAsset(editMonth, null)));
    const history = node('details'), historyTitle = node('summary'), historyList = node('ol'); history.append(historyTitle, historyList);
    const status = node('p'); status.id = 'monthEditorStatus'; status.setAttribute('role', 'status');
    form.append(localeLabel, nameLabel, save, reset, fileLabel, custom, removeIcon, history, status); dialog.append(form); document.body.append(dialog);
    let editMonth = null, busy = false, blobUrl = null;
    const assetUrls = new Map();
    const state = () => repository.hydrated ? repository.snapshot() : null;
    const display = month => Core.resolveMonthDisplay(month, options.language(), state());
    function personalIcon(month) {
      const snapshot = state(), asset = snapshot?.assets[snapshot.months[month]?.customSvgAssetId];
      if (!asset) return null;
      if (!assetUrls.has(asset.id)) assetUrls.set(asset.id, URL.createObjectURL(new Blob([asset.sanitizedSvg], { type: 'image/svg+xml' })));
      const icon = node('img', undefined, 'month-personal-icon'); icon.src = assetUrls.get(asset.id); icon.width = icon.height = 32; icon.alt = text('Личная иконка', 'Personal icon');
      icon.addEventListener('error', () => { icon.hidden = true; }); return icon;
    }
    function journey(solarYear, monthId) {
      const snapshot = state();
      if (!snapshot || !notes.hydrated) return null;
      return Journey.deriveJourney(snapshot.journeys[Journey.journeyKey(solarYear, monthId)] || Journey.createJourney(solarYear, monthId, '2000-01-01T00:00:00.000Z'), notes.committedSnapshot());
    }
    function statusLabel(day) {
      return day.complete ? text('Шаг завершён', 'Step complete') : day.detailsViewed ? text('Прочитано, нужна заметка', 'Read; note needed')
        : day.hasUserNote ? text('Заметка есть, нужны подробности', 'Note saved; reading needed') : text('Не начат', 'Not started');
    }
    function errorMessage() { return text('Не удалось сохранить. Данные не удалены. Повторите попытку.', 'Could not save. No data was deleted. Please retry.'); }
    function ring(month, view) {
      const wrap = node('div', undefined, 'month-tree-progress'); wrap.append(image(month, 96));
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 120 120'); svg.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 30; i++) {
        const line = document.createElementNS(ns, 'line');
        for (const [key, value] of Object.entries({ x1: 60, y1: 3, x2: 60, y2: 8, transform: `rotate(${Math.floor(i / 6) * 72 + (i % 6) * 10} 60 60)`, class: view.days[i].complete ? 'complete' : 'pending' })) line.setAttribute(key, value);
        svg.append(line);
      }
      wrap.append(svg); return wrap;
    }
    function renderMonth(cursor) {
      panel.replaceChildren(); headerCustom.replaceChildren(); const solar = cursor?.system === 'solar'; panel.hidden = !solar; headerTree.hidden = !solar; canonical.hidden = true;
      if (!options.enabled()) notice.hidden = true;
      if (!solar) return;
      const model = display(cursor.month); headerTree.src = image(cursor.month).src;
      const icon = personalIcon(cursor.month); if (icon) headerCustom.append(icon);
      $('monthTitle').textContent = `${model.title} ${cursor.year}`;
      if (!repository.hydrated) { panel.append(node('p', text('Путь месяца недоступен', 'Month journey unavailable')), button(text('Повторить', 'Retry'), () => retry())); return; }
      const view = journey(cursor.year, cursor.month);
      if (options.enabled()) {
        const content = node('div'); content.append(node('strong', `${text('Путь месяца', 'Month journey')}: ${view.completeCount}/30`),
          node('p', `${text('Подробности', 'Readings')}: ${view.viewedCount}/30 · ${text('Заметки', 'Notes')}: ${view.notedCount}/30`));
        const stages = node('div', undefined, 'month-stage-progress');
        view.phases.forEach(stage => stages.append(node('span', `${stage.names[options.language()]} ${stage.completeCount}/6`)));
        content.append(stages); panel.append(ring(cursor.month, view), content);
        for (const cell of $('monthGrid').querySelectorAll('[data-day]')) {
          const day = view.days[Number(cell.dataset.day) - 1]; cell.dataset.journeyState = day.complete ? 'complete' : day.detailsViewed ? 'read' : day.hasUserNote ? 'note' : 'empty';
          cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')}; ${statusLabel(day)}`);
        }
      }
      if (model.canCustomize) {
        panel.append(node('span', text('Персонализация открыта', 'Personalization unlocked'), 'month-unlocked'),
          button(text(model.personalName ? 'Изменить имя месяца' : 'Назвать месяц', model.personalName ? 'Edit month name' : 'Name this month'), () => openEditor(cursor.month)));
      }
      if (repository.lastError) panel.append(node('p', errorMessage()), button(text('Повторить', 'Retry'), () => retry()));
    }
    function renderOverview(year) {
      summary.textContent = text('Выбория · мои месяцы', 'IFTHENDZEN · my months');
      toggle.checked = options.enabled(); toggleText.textContent = text('Выбория включена', 'IFTHENDZEN enabled');
      settingsButton.textContent = text('Имена месяцев и Выбория', 'Month names and IFTHENDZEN');
      overviewGrid.replaceChildren();
      for (let month = 1; month <= 12; month++) {
        const model = display(month), view = journey(year, month);
        const item = button('', () => options.openMonth(year, month)); item.className = 'month-overview-row';
        const copy = node('span'); copy.append(node('strong', model.title), node('small', `${year}`));
        const progress = model.canCustomize ? text('Открыт', 'Unlocked') : options.enabled() && view ? `${view.completeCount}/30` : '';
        item.append(image(month), copy); const icon = personalIcon(month); if (icon) item.append(icon); item.append(node('small', progress)); overviewGrid.append(item);
      }
    }
    function renderDay(data) {
      dayPersonal.replaceChildren(); dayPersonal.hidden = true;
      const icon = personalIcon(data.month); if (icon) { dayPersonal.append(icon); dayPersonal.hidden = false; }
      if (!options.enabled()) return;
      const root = $('dayDetailContent').querySelector('.journey-detail'); if (!root) return;
      root.querySelector('.month-day-state')?.remove();
      const view = journey(data.year, data.month), day = view?.days[data.day - 1];
      const label = node('p', day ? statusLabel(day) : text('Путь месяца недоступен', 'Month journey unavailable'), 'month-day-state'); label.setAttribute('role', 'status'); root.prepend(label);
      root.dataset.journeyKey = Journey.journeyKey(data.year, data.month); root.dataset.journeyDay = data.day;
      const action = root.querySelector('[data-record-choice]');
      if (day?.qualifyingNoteIds.length && action) { action.dataset.choiceNoteId = day.qualifyingNoteIds[0]; action.textContent = text('Изменить заметку', 'Edit note'); }
    }
    function renderCurrent(data) {
      todayPersonal.replaceChildren(); todayPersonal.hidden = true;
      $('todayHeroSolarDate').closest('.today-hero').classList.toggle('has-personal-month', Boolean(display(data.month).personalName));
      const snapshot = state();
      for (const [id, url] of assetUrls) if (!snapshot?.assets[id]) { URL.revokeObjectURL(url); assetUrls.delete(id); }
      const icon = personalIcon(data.month); if (icon) { todayPersonal.append(icon); todayPersonal.hidden = false; }
      renderOverview(data.year);
    }
    function notifyChanged(previous) {
      const next = state();
      if (previous && !previous.course && next?.course) {
        notice.textContent = text('Выбория пройдена. Теперь каждый солнечный месяц можно сделать личным.', 'IFTHENDZEN completed. Each solar month can now become personal.'); notice.hidden = false;
      }
      options.refresh();
    }
    async function reconcile() {
      const previous = state();
      try { await repository.reconcile(); notifyChanged(previous); } catch { notice.textContent = errorMessage(); notice.hidden = false; }
    }
    async function retry() {
      try { await repository.hydrate(); await reconcile(); } catch { notice.textContent = errorMessage(); notice.hidden = false; }
      options.refresh();
    }
    function refreshEditor() {
      const snapshot = state(), profile = snapshot?.months[editMonth];
      heading.textContent = display(editMonth).title; input.value = profile?.customNames[locale.value] || display(editMonth).personalName || '';
      localeText.textContent = text('Язык имени', 'Name language'); nameText.textContent = text('Личное имя', 'Personal name');
      close.title = close.ariaLabel = text('Закрыть', 'Close'); save.textContent = text('Сохранить', 'Save'); reset.textContent = text('Вернуть каноническое имя', 'Restore canonical name');
      fileText.textContent = text('Дополнительная SVG-иконка', 'Additional SVG icon'); removeIcon.textContent = text('Удалить личную иконку', 'Remove personal icon');
      chooseFile.textContent = text('Выбрать SVG', 'Choose SVG');
      fileRules.textContent = text('SVG до 32 КиБ (32 768 байт), с viewBox. Рекомендуется квадратная иконка. В календаре: 32 × 32 px, предпросмотр: 48 × 48 px; пропорции сохраняются. Без растровых изображений, скриптов, анимации и внешних ссылок. До 256 элементов и 16 уровней вложенности.', 'SVG up to 32 KiB (32,768 bytes), with a viewBox. A square icon is recommended. Calendar: 32 × 32 px; preview: 48 × 48 px, preserving proportions. No raster images, scripts, animation or external links. Up to 256 elements and 16 nesting levels.');
      historyTitle.textContent = text('История имён', 'Name history'); historyList.replaceChildren();
      for (const item of (profile?.renameHistory || []).slice().reverse()) historyList.append(node('li', `${item.locale.toUpperCase()} · ${item.nextName || display(editMonth).canonicalName} · ${new Date(item.changedAt).toLocaleString(options.language() === 'en' ? 'en-GB' : 'ru-RU')}`));
      if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = null;
      const asset = snapshot?.assets[profile?.customSvgAssetId]; custom.hidden = !asset; removeIcon.disabled = !asset;
      if (asset) { blobUrl = URL.createObjectURL(new Blob([asset.sanitizedSvg], { type: 'image/svg+xml' })); custom.src = blobUrl; custom.alt = text('Личная иконка', 'Personal icon'); }
    }
    function openEditor(month) { if (!display(month).canCustomize) return; editMonth = month; locale.value = options.language(); status.textContent = ''; refreshEditor(); dialog.showModal(); input.focus(); }
    async function perform(action, closeAfter = false) {
      if (busy) return; busy = true; status.textContent = ''; const selected = editMonth;
      for (const el of form.querySelectorAll('button,input,select')) el.disabled = true;
      try { await action(); options.refresh(); if (editMonth === selected) { refreshEditor(); status.textContent = text('Сохранено', 'Saved'); if (closeAfter) dialog.close(); } }
      catch { status.textContent = text('Не сохранено. Проверьте имя или SVG-файл; прежние данные сохранены.', 'Not saved. Check the name or SVG file; previous data is intact.'); }
      finally { busy = false; for (const el of form.querySelectorAll('button,input,select')) el.disabled = false; removeIcon.disabled = !state()?.months[editMonth]?.customSvgAssetId; }
    }
    form.addEventListener('submit', event => {
      event.preventDefault(); const month = editMonth, language = locale.value, name = input.value;
      perform(() => !name.trim() && !display(month).personalName ? Promise.resolve() : repository.rename(month, language, name), true);
    });
    locale.addEventListener('change', refreshEditor);
    file.addEventListener('change', async () => {
      const selected = file.files[0], month = editMonth; file.value = ''; if (!selected) return;
      await perform(async () => {
        if (selected.size > 32768) throw new Error('SVG size');
        const value = new TextDecoder('utf-8', { fatal: true }).decode(await selected.arrayBuffer());
        const asset = await globalThis.SolarCircleMonthSvgAssets.importSvg(value);
        await repository.assignAsset(month, asset);
      });
    });
    custom.addEventListener('error', () => { custom.hidden = true; status.textContent = text('Иконка недоступна', 'Icon unavailable'); });
    dialog.addEventListener('close', () => { if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = null; });
    dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
    toggle.addEventListener('change', () => options.setEnabled(toggle.checked));
    $('dayDetailContent').addEventListener('click', event => {
      const target = event.target.closest('.journey-more > summary');
      const details = target?.parentElement, root = target?.closest('.journey-detail');
      if (!event.isTrusted || !root || details.open || !options.enabled() || $('dayDetailSheet').hidden || document.hidden || !target.getClientRects().length) return;
      const { solarYear, monthId } = Journey.parseJourneyKey(root.dataset.journeyKey);
      const day = Number(root.dataset.journeyDay), previous = state();
      // Wait for the summary default action; capture the original card, not the ticking Today date.
      setTimeout(async () => {
        if (!details.isConnected || !details.open || $('dayDetailSheet').hidden || document.hidden || !options.enabled() || !target.getClientRects().length) return;
        try {
          await repository.recordView({ solarYear, monthId, day }, { trusted: true, visible: true, enabled: true });
          // Preserve the opened reading instead of replacing dayDetailContent on a view-only update.
          const next = state();
          if (previous && !previous.course && next.course) { notice.textContent = text('Выбория пройдена. Месяц открыт.', 'IFTHENDZEN completed. Month unlocked.'); notice.hidden = false; }
          options.refreshCalendar(); if (root.isConnected) renderDay(options.selected());
        } catch { const label = root.querySelector('.month-day-state'); if (label) label.textContent = errorMessage(); }
      }, 0);
    });
    return Object.freeze({ renderMonth, renderDay, renderCurrent, reconcile, retry, display,
      fullSolarDate: data => Core.fullSolarDate(data, options.language(), state()) });
  }
  globalThis.SolarCircleMonthPersonalizationView = Object.freeze({ createView });
})();
