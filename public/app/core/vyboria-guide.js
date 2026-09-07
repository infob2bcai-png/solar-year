(() => {
  'use strict';
  const Reading = typeof require === 'function' ? require('../data/vyboria-reading.js') : globalThis.SolarYearVyboriaReading;
  // Bilingual editorial introductions to the owner's original 30-day goal cycle.
  const introductions = [
    ['Начало солнечного месяца — начало нового пути. Выбери одну важную цель или уточни прежнюю: к какому понятному результату хочешь прийти за этот месяц?', 'A solar month begins a new journey. Choose one meaningful goal or adjust your existing one: what clear result do you want to reach this month?'],
    ['Проверь, зачем тебе выбранная цель. Назови, что она изменит лично для тебя; если ответ не убеждает, сейчас можно уточнить направление.', 'Check why this goal matters to you. Name what it would change in your life; adjust the direction if the answer does not convince you.'],
    ['Чтобы двигаться к цели, нужно увидеть исходную точку. Запиши, что уже получается и чего не хватает, отделяя факты от оценок себя.', 'See your starting point: write down what already works and what is missing. Separate observable facts from judgments about yourself.'],
    ['Заметь, что уводит от выбранного дела. Сегодня не запрещай себе отвлекаться: поймай момент и спроси, помогает новое занятие цели или заменяет шаг к ней.', 'Notice what pulls you away. Catch the moment and ask whether the new activity supports your goal or replaces the next step.'],
    ['Первый лёгкий день: посмотри на четыре дня наблюдений. Что стало понятнее, какой выбор помог? Отметь небольшой результат чем-то приятным.', 'A lighter day: look back at four days of observation. What became clearer, and which choice helped? Enjoy a small celebration.'],
    ['Заверши неделю «Увидеть»: назови то, что понял о цели и о себе. Поблагодари себя за внимание, отдохни и подготовься выбирать новые действия.', 'Close the See stage: name what you learned about your goal and yourself. Appreciate your attention, rest and prepare to choose new actions.'],
    ['Новая неделя — «Выбрать». Определи, каким человеком хочешь быть на пути к цели, и переведи это качество в одно наблюдаемое действие.', 'The Choose stage begins. Decide how you want to be on the way to your goal, then express that quality as one observable action.'],
    ['Перед привычной реакцией замечай мысль, чувство и импульс. Они возникают сами, но следующий поступок можно выбрать осознанно.', 'Before a familiar reaction, notice the thought, feeling and impulse. They arise on their own; your next action can still be a choice.'],
    ['Найди точку выбора между импульсом и действием. Небольшая пауза помогает увидеть другой ответ и сохранить направление к цели.', 'Find the choice point between an impulse and an action. A brief pause helps you see another response and keep your direction.'],
    ['Подготовь правило «если — то» для знакомого трудного момента. Заранее выбери конкретное действие, которое возвращает к цели.', 'Prepare an if-then response for a familiar difficult moment. Choose a concrete action in advance that brings you back to your goal.'],
    ['Лёгкий день второй недели: вспомни первые осознанные выборы. Заметь даже небольшое отличие от прежнего поведения и порадуй себя.', 'A lighter day in week two: review your first deliberate choices. Notice even a small change from your old response and enjoy it.'],
    ['Подведи итог этапа «Выбрать»: какое направление и какие ответы ты выбираешь? Сохрани удачные решения, отдохни перед практикой.', 'Close the Choose stage: which direction and responses have you chosen? Keep the useful decisions and rest before practising them.'],
    ['Начинается этап «Действовать». Мысленно пройди один трудный момент заранее: что произойдёт и какое действие поможет не свернуть?', 'The Act stage begins. Rehearse one difficult moment: what may happen, and which action will help you stay on course?'],
    ['Сегодня важен старт, а не идеальное настроение. Выбери самый маленький реальный шаг и начни то, что приближает к цели.', 'Today is about starting, not waiting for the perfect mood. Choose the smallest real step and begin moving toward your goal.'],
    ['Когда становится сложно, попробуй остаться с выбранным делом. Уменьши шаг до посильного, вместо того чтобы сразу менять направление.', 'When the task becomes difficult, try staying with it. Reduce the step to something manageable instead of immediately changing direction.'],
    ['Доведи один шаг до понятного завершения. Новые идеи запиши отдельно: достаточный законченный результат полезнее бесконечной доработки.', 'Bring one step to a clear finish. Save new ideas separately: a sufficient finished result is more useful than endless polishing.'],
    ['Лёгкий день: найди доказательство изменения в поступках. Что раньше происходило иначе? Отметь конкретный пример и дай себе передышку.', 'A lighter day: find evidence of change in your actions. What used to happen differently? Name one example and take a break.'],
    ['Остановись для промежуточного итога: цель, выборы, действия. Сохрани то, что работает, и уточни следующий шаг перед более трудными условиями.', 'Pause for an interim review of your goal, choices and actions. Keep what works and adjust your next step before testing it in harder conditions.'],
    ['Этап «Удержать» учит продолжать без особого настроения. Выбери доступное действие сегодня, даже если вдохновение не пришло.', 'The Hold stage is about continuing without a special mood. Choose an available action today, even if inspiration has not arrived.'],
    ['При усталости сохрани направление, уменьшив нагрузку. Найди посильный минимум и место для отдыха, а не требуй от себя обычного объёма.', 'When tired, keep your direction by reducing the load. Find a manageable minimum and room for rest instead of demanding your usual output.'],
    ['Если реальность пошла не по плану, это новая точка выбора. Отдели факт от ожиданий, оцени свою зону влияния и скорректируй следующий шаг.', 'When reality differs from the plan, it creates another choice point. Separate facts from expectations, check what you can influence and adjust the next step.'],
    ['Раздели то, что можешь изменить, и то, что уже не зависит от тебя. В первом случае действуй, во втором прими факт и выбери доступный ответ.', 'Separate what you can change from what is outside your control. Act on the first; accept the second and choose an available response.'],
    ['Лёгкий день: посмотри, какие решения выдержали трудные условия. Даже возвращение после срыва — результат, который стоит заметить.', 'A lighter day: see which decisions held up under pressure. Even returning after a setback is a result worth noticing.'],
    ['Заверши этап «Удержать». Вспомни, как возвращался к пути, что можешь принять и где действовать. Отдохни перед закреплением опыта.', 'Close the Hold stage. Review how you returned to your path, what you can accept and where you can act. Rest before consolidating the experience.'],
    ['Этап «Закрепить»: сравни себя с началом месяца. Что стало легче благодаря повторяющимся выборам? Назови конкретное изменение.', 'The final stage is about consolidation. Compare today with the start of the month: what became easier through repeated choices? Name a concrete change.'],
    ['Заметь, где новый ответ уже возникает сам. Это помогает увидеть, какие действия стоит сохранить в следующем месяце.', 'Notice where a new response is beginning to happen naturally. This helps you decide which actions to carry into the next month.'],
    ['Найди ситуацию, где ещё нужна практика. Это не повод обесценивать путь: скорректируй действие или условия, сохранив важную цель.', 'Find a situation that still needs practice. It does not invalidate your progress: adjust the action or conditions while keeping a meaningful goal.'],
    ['Проверь выбор самостоятельно в реальной ситуации. Заметь факт, своё влияние и следующий шаг, не требуя от себя безошибочности.', 'Test your choice independently in a real situation. Notice the facts, your influence and your next step without demanding perfection.'],
    ['Лёгкий день: отпразднуй пройденный путь. Важны не только результаты, но и то, как ты научился замечать, выбирать и возвращаться.', 'A lighter day: celebrate the journey. Value both the results and how you learned to notice, choose and return.'],
    ['Заверши месячный цикл: сравни цель, действия и себя в начале и сейчас. Что сохранить, что изменить, какую цель выбрать или продолжить в новом месяце?', 'Complete the monthly cycle: compare your goal, actions and yourself then and now. What will you keep, change or continue in the next month?']
  ];
  const stages = [
    ['Увидеть цель, исходную точку и то, что уводит с пути.', 'See your goal, starting point and what pulls you away.'],
    ['Выбрать направление и новые ответы вместо автоматических реакций.', 'Choose your direction and new responses instead of automatic reactions.'],
    ['Превратить решения в реальные, посильные и завершённые действия.', 'Turn decisions into real, manageable actions that you can finish.'],
    ['Продолжать при усталости и переменах, различая свою зону влияния.', 'Continue through fatigue and change, recognising what you can influence.'],
    ['Увидеть изменения и выбрать, что взять в следующий цикл.', 'Recognise change and choose what to carry into the next cycle.']
  ];
  function forDay(day, language='ru') {
    if (!Number.isInteger(day) || day<1 || day>30) throw new RangeError('Vyboria day must be 1..30');
    const index=language==='en'?1:0, week=Math.ceil(day/6), dayInWeek=(day-1)%6+1;
    return {week,dayInWeek,intro:introductions[day-1][index],stage:stages[week-1][index],
      reading:Reading.days[day-1].blocks,
      rhythm:index?'Each solar month opens a 30-day cycle: five stages of six days. Four days of practice, a day to notice results and enjoy them, then a day to rest and prepare. You may choose a new goal or continue an existing one; the cycle is not a deadline or a promise of transformation.':'Каждый солнечный месяц открывает цикл из 30 дней: пять этапов по шесть дней. Четыре дня практики, день для результатов и радости, затем день отдыха и перехода дальше. Можно выбрать новую цель или продолжить прежнюю: цикл не обязывает всё успеть и не обещает мгновенного преображения.',
      daily:index?'In the morning: where am I going? Before the main action: what may distract me, and what will I choose then? During the day: notice the thought, feeling and impulse. In the evening: which choice mattered, and what should I adjust?':'Утром: куда я сегодня иду? Перед главным действием: что может увести и что я тогда выберу? В течение дня: замечаю мысль, чувство и импульс. Вечером: какой выбор был важным и что стоит скорректировать?'};
  }
  const api=Object.freeze({forDay});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  globalThis.SolarYearVyboriaGuide=api;
})();
