(() => {
  'use strict';
  const $ = id => document.getElementById(id), Story = SolarYearStory, Calendar = SolarCircleCalendarCore, Orbit = SolarCircleOrbitViewModel;
  const element = (tag, text, cls) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (cls) el.className = cls; return el; };
  const paragraph = (parent, text, cls) => parent.append(element('p', text, cls));
  const button = (text, action, cls = 'button secondary') => { const el = element('button', text, cls); el.type = 'button'; el.addEventListener('click', action); return el; };
  const appLink = (text, route = '') => { const a = element('a', text); a.href = `app/index.html${route ? '#' + route : ''}`; return a; };
  const months = Calendar.MONTHS.ru;
  const currentDegree = () => Astronomy.SunPosition(new Date()).elon;
  let previewDegree = null;
  let heroOffset = 0;
  const images = {};
  for (const name of ['sun', 'earth', 'moon']) { const img = new Image(); img.onload = redraw; img.src = `app/assets/svg/orbit/${name}.svg`; images[name] = img; }
  const tree = new Image(); tree.onload = redraw; tree.src = 'app/assets/svg/months/tree-life-month-04.svg';
  function drawHero() {
    const canvas = $('heroScene'), rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return;
    const { width, height } = rect, ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio);
    ctx.fillStyle = '#0b132b'; ctx.fillRect(0, 0, width, height);
    // Full-bleed terrain follows the app's landscape language, without bitmap media.
    for (const [level, color, lift] of [[.69, '#537f91', .12], [.81, '#afd2d0', .10], [.91, '#2c606b', .05]]) {
      ctx.beginPath(); ctx.moveTo(0, height * level);
      ctx.bezierCurveTo(width * .16, height * (level - lift), width * .27, height * (level + lift), width * .46, height * level);
      ctx.bezierCurveTo(width * .65, height * (level - lift), width * .81, height * (level + lift), width, height * (level - lift));
      ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    }
    const top = document.querySelector('.hero-copy').getBoundingClientRect().bottom - rect.top + 14;
    const bottom = document.querySelector('.hero-foot').getBoundingClientRect().top - rect.top - 14;
    const size = Math.max(0, Math.min(290, width * .58, bottom - top));
    if (tree.complete && tree.naturalWidth) ctx.drawImage(tree, (width - size) / 2 + heroOffset, top + (bottom - top - size) / 2, size, size);
  }
  function drawDial(canvas, degree) {
    const { width, height } = canvas.getBoundingClientRect(); if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d'); ctx.scale(ratio, ratio); ctx.clearRect(0, 0, width, height);
    const style = getComputedStyle(canvas.closest('section')), color = name => style.getPropertyValue(name).trim();
    const cx = width / 2, cy = height / 2;
    const scale = Math.min(width, height) / 450;
    ctx.save(); ctx.translate(cx - 220 * scale, cy - 220 * scale); ctx.scale(scale, scale);
    ctx.strokeStyle = color('--line'); ctx.lineWidth = 1.4;
    for (const radius of [126, 154, 182]) { ctx.beginPath(); ctx.arc(220, 220, radius, 0, Math.PI * 2); ctx.stroke(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const item of Orbit.dialScale()) {
      ctx.strokeStyle = color('--line'); ctx.beginPath(); ctx.moveTo(item.tickStart.x, item.tickStart.y); ctx.lineTo(item.tickEnd.x, item.tickEnd.y); ctx.stroke();
      ctx.font = '12px system-ui'; ctx.fillStyle = color('--muted'); ctx.fillText(item.startDegree === 0 ? '0° / 360°' : `${item.startDegree}°`, item.degreeLabel.x, item.degreeLabel.y);
      ctx.font = `${Math.floor(degree / 30) + 1 === item.month ? 700 : 500} 19px system-ui`; ctx.fillStyle = Math.floor(degree / 30) + 1 === item.month ? color('--accent') : color('--text');
      ctx.fillText(String(item.month), item.monthLabel.x, item.monthLabel.y);
    }
    ctx.strokeStyle = color('--accent'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(220, 220, 182, -Math.PI / 2, degree * Math.PI / 180 - Math.PI / 2); ctx.stroke();
    if (images.sun?.complete && images.sun.naturalWidth) ctx.drawImage(images.sun, 153, 153, 134, 134);
    ctx.fillStyle = '#3a2c12'; ctx.font = '13px system-ui'; ctx.fillText('Солнце', 220, 196); ctx.font = '700 30px system-ui'; ctx.fillText(`${Math.floor(degree) + 1}°`, 220, 225);
    ctx.font = '10px system-ui'; ctx.fillText(`${degree.toFixed(2)}°`, 220, 250);
    const pos = Orbit.position(degree, Astronomy.MoonPhase(new Date()));
    if (images.earth?.complete && images.earth.naturalWidth) ctx.drawImage(images.earth, pos.earth.x - 19, pos.earth.y - 19, 38, 38);
    if (pos.moon && images.moon?.complete && images.moon.naturalWidth) ctx.drawImage(images.moon, pos.earth.x + pos.moon.x - 6, pos.earth.y + pos.moon.y - 6, 12, 12);
    ctx.restore();
  }
  function redraw() {
    const live = currentDegree(); drawHero();
    if ($('yearCanvas')) drawDial($('yearCanvas'), previewDegree ?? live);
    $('livePosition').textContent = `${months[Math.floor(live / 30)]} · ${live.toFixed(2)}° · текущий расчёт`;
  }
  function yearTool(section) {
    const root = element('div', undefined, 'year-tool'), canvas = element('canvas'); canvas.id = 'yearCanvas'; canvas.setAttribute('aria-label', 'Двенадцать месяцев на солнечном круге');
    const copy = element('div', undefined, 'year-copy'), label = element('label', 'Положение на круге'); label.htmlFor = 'yearAngle';
    const range = element('input'); range.id = 'yearAngle'; range.type = 'range'; range.min = 0; range.max = 359.99; range.step = .01; range.value = currentDegree();
    const output = element('output'); output.id = 'yearPosition'; output.htmlFor = range.id;
    const state = element('p', undefined, 'example-label');
    function show(live) { const deg = live ? currentDegree() : Number(range.value); previewDegree = live ? null : deg; range.value = deg;
      output.textContent = `${months[Math.floor(deg / 30)]} · день ${Math.floor(deg % 30) + 1}`;
      state.textContent = live ? `Текущий расчёт: ${deg.toFixed(2)}°. Часовой пояс браузера: ${Intl.DateTimeFormat().resolvedOptions().timeZone}.` : `Исследование круга: ${deg.toFixed(2)}°. Это выбранный пример, не текущая дата.`; redraw(); }
    range.addEventListener('input', () => show(false)); copy.append(label, range, output, state, button('К текущему положению', () => show(true)));
    paragraph(copy, 'Один солнечный шаг занимает один градус. Число шага и точное значение долготы различаются: шаг 1 начинается на 0°. Обычную дату для выбранного момента рассчитывает конвертер приложения.');
    root.append(canvas, copy); section.append(root); show(true);
  }
  function stagesTool(section) {
    const tabs = element('div', undefined, 'cycle-stages'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Пять этапов Выбории');
    const body = element('article', undefined, 'stage-body'); body.id = 'stageBody'; body.setAttribute('role', 'tabpanel');
    const controls = Story.stages.map((stage, index) => {
      const item = button('', () => select(index), 'stage-tab'); item.append(element('span', stage[0]), element('small', `Дни ${stage[1]}`)); item.id = `stageTab${index}`; item.setAttribute('role', 'tab'); item.setAttribute('aria-controls', body.id);
      item.addEventListener('keydown', event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (index + (event.key === 'ArrowRight' ? 1 : 4)) % 5; select(next); controls[next].focus(); });
      tabs.append(item); return item;
    });
    function select(index) { controls.forEach((el, i) => { el.setAttribute('aria-selected', i === index); el.tabIndex = i === index ? 0 : -1; }); body.setAttribute('aria-labelledby', controls[index].id); body.replaceChildren(element('h3', Story.stages[index][2]), element('p', Story.stages[index][3])); }
    section.append(tabs, body); select(0);
  }
  function daysTool(section) {
    const picker = element('div', undefined, 'day-picker'), label = element('label', 'День пути'); label.htmlFor = 'journeyDay';
    const range = element('input'); range.type = 'range'; range.min = 1; range.max = 30; range.value = 1; range.id = 'journeyDay';
    const output = element('output'); output.htmlFor = range.id; const reading = element('div', undefined, 'day-reading'); reading.id = 'dailyReading'; reading.setAttribute('aria-live', 'polite');
    const grid = element('div', undefined, 'journey-grid'); grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Тридцать дней месячного пути');
    const days = Array.from({ length: 30 }, (_, i) => { const day = button(String(i + 1), () => { range.value = i + 1; show(); }, 'journey-date'); day.setAttribute('aria-label', `День ${i + 1}: ${Story.stages[Math.floor(i / 6)][0]}`); grid.append(day); return day; });
    function show() { const day = SolarYearPresentationDays[Number(range.value) - 1]; output.textContent = `${day.day} / 30`; reading.replaceChildren(element('h3', Story.stages[Math.floor((day.day - 1) / 6)][0]), element('p', day.intro)); days.forEach((el, i) => el.setAttribute('aria-pressed', i + 1 === day.day)); }
    range.addEventListener('input', show); picker.append(label, range, output); section.append(grid, picker, reading); paragraph(section, 'Настоящие введения к дням из приложения. Здесь можно познакомиться с темами; собственные записи и прохождение сохраняются только в рабочем календаре.', 'example-label'); show();
  }
  const treePath = i => `app/assets/svg/months/tree-life-month-${String(i).padStart(2, '0')}.svg`;
  function treeTool(section) {
    const root = element('div', undefined, 'tree-season'), img = element('img'); img.id = 'seasonTree'; img.width = 140; img.height = 140;
    const copy = element('div'), label = element('label', 'Месяц'); label.htmlFor = 'treeMonth'; const select = element('select'); select.id = 'treeMonth';
    months.forEach((name, i) => select.append(new Option(`${String(i + 1).padStart(2, '0')} · ${name}`, i + 1)));
    const caption = element('p', undefined, 'example-label');
    const counts = [3, 5, 7, 9, 8, 6, 5, 4, 3, 1, 2, 3];
    const show = () => { const value = Number(select.value); img.src = treePath(value); img.alt = `Дерево месяца ${months[value - 1]}`; caption.textContent = `${counts[value - 1]} из 9 исходных листьев. Верхний лист сохранён. Это утверждённый знак месяца, не прогноз местного сезона.`; };
    select.value = '4'; select.addEventListener('change', show); copy.append(label, select, caption); root.append(img, copy); section.append(root); show();
  }
  function yearTrees(section) {
    const names = ['Начало', 'Порядок', 'Смелость', 'Дело', 'Близкие', 'Внимание', 'Дорога', 'Спокойствие', 'Терпение', 'Тишина', 'Благодарность', 'Продолжение'];
    paragraph(section, 'Пример личных имён, не готовая программа и не чужие сохранённые результаты. Ваши названия могут быть совсем другими.', 'example-label');
    const root = element('div', undefined, 'tree-year');
    names.forEach((name, i) => { const figure = element('figure'), img = element('img'); img.src = treePath(i + 1); img.width = 88; img.height = 88; img.alt = `Знак месяца ${i + 1}`;
      const caption = element('figcaption', name); caption.append(element('small', `Месяц ${i + 1}`)); figure.append(img, caption); root.append(figure); }); section.append(root);
  }
  for (const chapter of Story.chapters) {
    const section = element('section', undefined, 'chapter band'); section.id = chapter.id;
    if (['today', 'choice', 'personal'].includes(chapter.id)) section.classList.add('night-band');
    else if (['movement', 'sun-time', 'journey', 'year'].includes(chapter.id)) section.classList.add('mist-band');
    paragraph(section, `${String(chapter.number).padStart(2, '0')} / ${chapter.label}`, 'eyebrow');
    const title = element('h2'); chapter.title.split('\n').forEach((line, i) => { if (i) title.append(element('br')); title.append(document.createTextNode(line)); }); section.append(title);
    const body = element('div', undefined, 'chapter-body'), copy = element('div', undefined, 'chapter-copy'), aside = element('aside', undefined, 'chapter-side');
    chapter.paragraphs.forEach(p => paragraph(copy, p)); aside.append(element('h3', chapter.sideTitle)); const list = element('ul'); chapter.points.forEach(p => list.append(element('li', p))); aside.append(list);
    if (chapter.link) { const a = appLink(chapter.link[0] + ' ↗', chapter.link[1]); a.className = 'chapter-link'; aside.append(a); }
    body.append(copy, aside); section.append(body); $('chapters').append(section);
    addReferenceVisuals(section, chapter, title);
    const buildTool = { year: yearTool, stages: stagesTool, days: daysTool, tree: treeTool, yearTrees }[chapter.tool];
    if (buildTool) {
      const toolHost = element('div', undefined, 'chapter-tool');
      body.before(toolHost); buildTool(toolHost);
    }
    if (chapter.quote) paragraph(section, chapter.quote, 'wide-quote');
  }
  function addReferenceVisuals(section, chapter, title) {
    if (chapter.id === 'movement') {
      const pair = element('div', undefined, 'nature-pair');
      for (const [state, label] of [['day', 'День'], ['night', 'Ночь']]) {
        const figure = element('figure'), img = element('img'); img.src = `app/assets/svg/scenes/solar-circle-scene-${state}.svg`; img.alt = `${label}: пейзаж из приложения`; img.width = 430; img.height = 360;
        figure.append(img, element('figcaption', `${label}. Природный ритм не останавливается.`)); pair.append(figure);
      }
      title.after(pair);
    }
    if (chapter.id === 'today') {
      const opening = element('div', undefined, 'chapter-opening'), figure = element('figure', undefined, 'chapter-visual'), img = element('img');
      img.src = 'app/assets/svg/scenes/solar-circle-scene-day.svg'; img.alt = 'Астрономический пейзаж Солнечного года'; img.width = 430; img.height = 360;
      figure.append(img, element('figcaption', 'Тот же визуальный мир, что и в приложении.'));
      title.before(opening); opening.append(title, figure);
    }
    if (chapter.id === 'calendar') {
      const facts = element('div', undefined, 'calendar-facts');
      for (const [value, label, note] of [['360°', 'Годовой круг', 'Угловые шаги, не 360 обычных суток'], ['12', 'Солнечных месяцев', 'По 30 шагов в каждом'], ['6', 'Дней практики', 'Один этап Выбории; пять этапов за месяц']]) {
        const item = element('article'); item.append(element('strong', value), element('span', label), element('small', note)); facts.append(item);
      }
      title.after(facts);
    }
    if (chapter.id === 'choice') {
      const principle = element('div', undefined, 'choice-principle');
      principle.append(element('h3', 'Принципы дают направление'), element('p', 'Цель говорит, куда идти. Принципы помогают помнить, кем мы не готовы становиться ради результата. Можно менять план, сохраняя честность, достоинство и заботу о себе и других.'));
      section.append(principle);
    }
    if (chapter.id === 'personal') {
      const flow = element('div', undefined, 'unlock-flow');
      for (const [i, value, text] of [[0, '30', 'Подробностей дней открыто'], [1, '30', 'Своих непустых записей'], [2, 'Личное имя', 'После завершённого месячного пути']]) {
        if (i) flow.append(element('b', i === 1 ? '+' : '→'));
        const item = element('div'); item.append(element('strong', value), element('small', text)); flow.append(item);
      }
      const demo = element('div', undefined, 'rename-demo');
      for (const [i, caption, name] of [[0, 'Каноническое имя', 'Санин'], [1, 'Ваше личное имя', 'Месяц спокойствия']]) {
        if (i) demo.append(element('span', '→'));
        const item = element('article'); item.append(element('small', caption), element('strong', name)); demo.append(item);
      }
      const visual = element('div', undefined, 'personal-visual'); visual.append(flow);
      paragraph(visual, 'Пример персонализации. Личное имя заменяет каноническое в отображении; расчёты и порядок месяцев сохраняются.', 'example-label'); visual.append(demo);
      section.querySelector('.chapter-body').before(visual);
    }
  }
  function closePreview() { $('previewHost').hidden = true; $('appPreview').removeAttribute('src'); }
  const guideButtons = [];
  function showGuide(index) {
    const [name, route, question, what, steps, why] = Story.screens[index];
    guideButtons.forEach((el, i) => el.setAttribute('aria-current', i === index)); closePreview();
    const root = $('screenGuide'); root.replaceChildren(element('h3', name), element('p', question, 'guide-question'));
    root.append(element('h4', 'Что здесь'), element('p', what), element('h4', 'Попробуйте')); const ol = element('ol'); steps.split('|').forEach(step => ol.append(element('li', step))); root.append(ol, element('h4', 'Зачем это в общей истории'), element('p', why));
    const actions = element('div', undefined, 'actions'), link = appLink('Открыть в приложении ↗', route); link.className = 'button primary';
    actions.append(link, button('Показать здесь', () => { $('previewTitle').textContent = name; $('previewHost').hidden = false; $('appPreview').src = `app/index.html#${route}`; $('previewHost').scrollIntoView({ block: 'start', behavior: 'smooth' }); })); root.append(actions);
    paragraph(root, 'Это рабочее приложение, не изображение. Карточка дня, заметки и напоминания открываются из выбранного дня календаря.', 'example-label');
  }
  Story.screens.forEach((screen, i) => { const b = button(screen[0], () => showGuide(i), 'guide-tab'); guideButtons.push(b); $('screenNav').append(b); }); showGuide(0);
  $('closePreview').addEventListener('click', closePreview);
  for (const text of SolarYearPresentationAuthor) paragraph($('authorWords'), text);
  const chapters = [['meaning', '01 · Идея'], ...Story.chapters.map(c => [c.id, `${String(c.number).padStart(2, '0')} · ${c.label}`]), ['guide', '13 · Все экраны'], ['privacy', '14 · Приватность'], ['start', '15 · Начать']];
  chapters.forEach(([id, label]) => $('chapterSelect').append(new Option(label, id)));
  $('chapterSelect').addEventListener('change', event => { location.hash = event.target.value; });
  const updateDock = () => {
    document.querySelector('.chapter-dock').hidden = scrollY < 180;
    if (document.activeElement === $('chapterSelect')) return;
    const threshold = document.querySelector('.site-header').getBoundingClientRect().bottom + 160;
    let current = 'meaning';
    for (const [id] of chapters) if ($(id).getBoundingClientRect().top <= threshold) current = id;
    $('chapterSelect').value = current;
  };
  addEventListener('scroll', updateDock, { passive: true }); updateDock();
  try { const saved = localStorage.getItem('solar-year-presentation-theme'); if (['light', 'dark'].includes(saved)) { document.documentElement.dataset.theme = saved; $('lightTheme').checked = saved === 'light'; } } catch { /* File storage may be unavailable; the default stays usable. */ }
  $('lightTheme').addEventListener('change', event => { const theme = event.target.checked ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('solar-year-presentation-theme', theme); } catch {} redraw(); });
  $('home').addEventListener('pointermove', event => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; heroOffset = (event.clientX / innerWidth - .5) * 12; drawHero(); });
  $('home').addEventListener('pointerleave', () => { heroOffset = 0; drawHero(); });
  const resize = new ResizeObserver(redraw); resize.observe($('heroScene')); resize.observe($('yearCanvas'));
  setInterval(() => { if (!document.hidden) redraw(); }, 60000); redraw();
  if (location.hash && $(location.hash.slice(1))) requestAnimationFrame(() => $(location.hash.slice(1)).scrollIntoView());
})();
