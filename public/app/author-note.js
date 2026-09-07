(() => {
  'use strict';
  const meta = globalThis.SolarCircleProjectMeta;
  const $ = id => document.getElementById(id);
  const copy = {
    ru: { heading:'Слова автора', contact:'Связь с автором', excerpt:'Из авторского эссе', read:'Странник по звёздам: полный авторский текст', context:'Эссе ALEX_DOC о романе Джека Лондона и философии Выбории. Оригинал на русском языке.', contents:'Раздел текста', close:'Свернуть текст', loading:'Загрузка текста...', error:'Не удалось открыть текст.', retry:'Повторить', returnDay:'Вернуться к дню' },
    en: { heading:"Author's Words", contact:'Contact the author', excerpt:'Translated excerpts from the essay', read:'The Star Rover: full author essay (Russian)', context:'An essay by ALEX_DOC on Jack London\'s novel and the philosophy of IFTHENDZEN. Original text in Russian.', contents:'Essay section', close:'Collapse essay', loading:'Loading essay...', error:'The essay could not be opened.', retry:'Retry', returnDay:'Return to day' }
  };
  let language = 'ru', state = 'idle', pending;
  const t = key => copy[language][key];
  function render(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'ru';
    document.querySelectorAll('[data-author-label]').forEach(node => { node.textContent = t(node.dataset.authorLabel); });
    document.querySelectorAll('[data-author-name]').forEach(node => { node.textContent = meta.PUBLIC_CONTACT.name; });
    document.querySelectorAll('[data-author-email]').forEach(node => {
      node.textContent = meta.PUBLIC_CONTACT.email;
      node.href = `mailto:${meta.PUBLIC_CONTACT.email}`;
    });
    $('authorExcerpt').replaceChildren(...meta.AUTHOR_NOTE[language].map(text => {
      const p = document.createElement('p'); p.textContent = text; return p;
    }));
    $('authorEssayStatus').textContent = state === 'loading' ? t('loading') : state === 'error' ? t('error') : '';
    $('authorEssayRetry').title = t('retry');
    $('authorEssayRetry').setAttribute('aria-label', t('retry'));
  }
  function appendEssay(essay) {
    if (essay.schema !== 'solar-year.author-essay.v1' || essay.language !== 'ru' || !Array.isArray(essay.blocks) || !essay.blocks.length) throw new Error('Invalid essay');
    const fragment = document.createDocumentFragment(), options = [];
    for (const [index, block] of essay.blocks.entries()) {
      const tag = { title:'h3', heading:'h4', paragraph:'p' }[block.kind];
      if (!tag || !Array.isArray(block.runs)) throw new Error('Invalid essay block');
      const node = document.createElement(tag);
      for (const run of block.runs) {
        if (typeof run.text !== 'string') throw new Error('Invalid essay text');
        const span = document.createElement(run.strong ? 'strong' : 'span'); span.textContent = run.text; node.append(span);
      }
      node.dataset.authorBlock = index;
      if (block.kind !== 'paragraph') {
        node.id = `author-section-${index}`; node.tabIndex = -1;
        options.push(new Option(node.textContent, node.id));
      }
      fragment.append(node);
    }
    $('authorEssayBody').replaceChildren(fragment);
    $('authorEssayIndex').replaceChildren(...options);
    $('authorEssayIndexLabel').hidden = false;
  }
  async function load() {
    if (state === 'ready') return;
    if (pending) return pending;
    state = 'loading'; $('authorEssayRetry').hidden = true; render(language);
    pending = (async () => {
      try {
        const response = await fetch('data/author/essay.ru.json');
        if (!response.ok) throw new Error('Essay asset unavailable');
        appendEssay(await response.json()); state = 'ready';
      } catch { state = 'error'; $('authorEssayRetry').hidden = false; }
      finally { pending = null; render(language); }
    })();
    return pending;
  }
  function bind() {
    $('authorEssay').addEventListener('toggle', () => { if ($('authorEssay').open) load(); });
    $('authorEssayRetry').addEventListener('click', load);
    $('authorEssayIndex').addEventListener('change', () => {
      const heading = $($('authorEssayIndex').value);
      heading?.focus({preventScroll:true}); heading?.scrollIntoView({block:'start'});
    });
    $('authorEssayClose').addEventListener('click', () => {
      $('authorEssay').open = false;
      const summary = $('authorEssay').querySelector('summary'); summary.focus(); summary.scrollIntoView({block:'center'});
    });
  }
  globalThis.SolarYearAuthorNote = Object.freeze({ render, bind });
})();
