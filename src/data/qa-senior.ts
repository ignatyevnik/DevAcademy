import type { Course } from './types';

export const qaSeniorCourse: Course = {
  slug: 'qa-senior',
  title: 'QA Senior: архитектура качества',
  subtitle: 'Стратегия, экономика качества, архитектура фреймворков, безопасность и Observability',
  description:
    'Продвинутый курс для тех, кто влияет на процесс. Разберём тест-стратегию, DORA-метрики, Cost of Quality (CoQ), архитектурные паттерны (Screenplay), Testcontainers, управление данными (TDM), математику нагрузки (Закон Литтла), глубокий аудит безопасности (SAST/DAST/IAST), Threat Modeling (STRIDE), оптимизацию CI (TIA, Merge Queue), Service Virtualization, BDD и Observability (Sentry, OpenTelemetry).',
  level: 'Продвинутый',
  tags: ['QA', 'Senior', 'Архитектура', 'Стратегия', 'SRE'],
  accent: '#0e9f6e',
  icon: 'qa-senior',
  outcomes: [
    'Строить тест-стратегию по рискам и считать Cost of Quality (CoQ)',
    'Использовать DORA-метрики для оценки здоровья процесса',
    'Проектировать тестовые фреймворки по паттерну Screenplay',
    'Управлять тестовыми данными (Data Masking, Synthetic Data) и изолировать тесты (Testcontainers)',
    'Рассчитывать пропускную способность через Закон Литтла',
    'Применять SAST, DAST, IAST, SCA и STRIDE в пайплайне',
    'Настраивать Test Impact Analysis, Merge Queue и Feature Flags',
    'Применять BDD, Three Amigos и Service Virtualization',
    'Читать трейсы (OpenTelemetry) и триажить ошибки в Sentry',
    'Проводить Code Review тестов и собеседования на позицию Senior',
  ],
  requirements: [
    'Опыт работы QA Automation от 2 лет',
    'Понимание CI/CD и Docker',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Стратегия и экономика качества (3 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m1',
      title: 'Стратегия и экономика качества',
      lessons: [
        {
          id: 'qa-l56',
          title: 'Построение тест-стратегии',
          minutes: 30,
          steps: [
            {
              id: 'qa-l56-s1',
              title: 'Risk-based testing и Shift-left/right',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Тест-стратегия — это ответ на вопрос «что и как мы тестируем, чтобы покрыть риски бизнеса». Senior QA не просто пишет тест-кейсы, а определяет приоритеты: где риск потери денег/репутации выше, там и тестируем глубже.',
                },
                {
                  type: 'list',
                  items: [
                    'Risk-based: оцениваем вероятность сбоя и ущерб. Тестируем то, где «вероятность × ущерб» максимально.',
                    'Shift-left: тестирование начинается на этапе требований (ревью, BDD), а не после кода.',
                    'Shift-right: тестирование в проде (canary, мониторинг, A/B, feature flags).',
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Из чего состоит тест-стратегия',
                  code: `graph TD
                    Scope["Scope<br/>что тестируем"] --> Risk["Риски<br/>вероятность × ущерб"]
                    Risk --> Approach["Подходы<br/>unit / api / e2e /<br/>нагрузка / security"]
                    Approach --> Env["Окружения<br/>dev → staging → prod"]
                    Env --> Exit["Exit criteria<br/>все P0/P1 закрыты,<br/>smoke зелёный"]
                    Exit --> Release["Релиз"]`,
                },
              ],
            },
            {
              id: 'qa-l56-s2',
              title: 'Шаблон тест-стратегии',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Хорошая стратегия умещается на 1–2 страницы и отвечает на вопросы: что делаем, что не делаем и почему. Вот типичный шаблон:',
                },
                {
                  type: 'code',
                  lang: 'markdown',
                  caption: 'Шаблон тест-стратегии',
                  code: `# Тест-стратегия: [Название проекта]\n\n## Scope (что тестируем)\n- In scope: оплата, корзина, авторизация\n- Out of scope: админка (тестируется отдельной командой)\n\n## Риски (top-3)\n1. Оплата: деньги, регуляторика — критично\n2. Авторизация: безопасность, доступ к данным\n3. Корзина: конверсия, деньги\n\n## Подходы\n- Unit: 70% (pytest, coverage > 80%)\n- API: 20% (Playwright + requests, все эндпоинты)\n- E2E: 10% (только критичные пути: логин, оплата)\n- Нагрузка: k6, p95 < 500 мс, error < 1%\n- Безопасность: ZAP на staging nightly, SAST на PR\n\n## Exit criteria (когда релизим)\n- Все P0/P1 баги закрыты\n- Smoke на staging зелёный\n- Canary 5% без ошибок 30 минут`,
                },
              ],
            },
            {
              id: 'qa-l56-s3',
              title: 'Проверь себя: стратегия',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое «Shift-left» в тестировании?',
                options: [
                  { id: 'a', text: 'Перенос тестирования на более ранние этапы (требования, дизайн)' },
                  { id: 'b', text: 'Перенос тестирования в прод' },
                  { id: 'c', text: 'Отказ от ручного тестирования' },
                  { id: 'd', text: 'Увеличение числа тестировщиков' },
                ],
                correct: ['a'],
                explanation:
                  'Shift-left — «сдвиг влево» по временной шкале: тестировать раньше, на этапе требований и дизайна. Дефект в требованиях дешевле исправить, чем в проде.',
              },
            },
            {
              id: 'qa-l56-s4',
              title: 'Проверь себя: стратегия vs план',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем тест-стратегия отличается от тест-плана?',
                options: [
                  { id: 'a', text: 'Это одно и то же' },
                  { id: 'b', text: 'Стратегия — «что и зачем тестируем» (долгосрочно); план — «кто, когда, что конкретно» (на релиз)' },
                  { id: 'c', text: 'План — для ручного, стратегия — для автотестов' },
                  { id: 'd', text: 'Стратегия пишется после релиза' },
                ],
                correct: ['b'],
                explanation:
                  'Стратегия — про подход и риски (на год-проект). План — про конкретный релиз: кто, когда, что проверяет.',
              },
            },
            {
              id: 'qa-l56-s5',
              title: 'Проверь себя: пирамида vs трофей',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чем отличие «Трофея» (Test Trophy) от классической «Пирамиды»?',
                options: [
                  { id: 'a', text: 'В Трофее вообще нет тестов' },
                  { id: 'b', text: 'Трофей делает акцент на интеграционных тестах, а не на Unit-тестах' },
                  { id: 'c', text: 'Трофей используется только для мобильной разработки' },
                  { id: 'd', text: 'Пирамида устарела и больше не используется' },
                ],
                correct: ['b'],
                explanation:
                  'Пирамида Майка Кона опирается на Unit-тесты. Трофей Кента Доддса смещает акцент на интеграционные тесты (UI/API), так как они лучше проверяют стыки компонентов.',
              },
            },
          ],
        },
        {
          id: 'qa-l101',
          title: 'Cost of Quality: сколько стоит баг',
          minutes: 30,
          steps: [
            {
              id: 'qa-l101-s1',
              title: 'Четыре категории затрат (CoQ)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Senior QA мыслит не количеством найденных багов, а деньгами компании. Концепция **Cost of Quality (CoQ)** делит все затраты на качество на четыре категории.',
                },
                {
                  type: 'table',
                  caption: 'Cost of Quality (CoQ)',
                  head: ['Категория', 'Что это', 'Пример'],
                  rows: [
                    ['Prevention (Превентивные)', 'Затраты на предотвращение багов', 'Code Review, написание автотестов, обновление документации'],
                    ['Appraisal (Оценочные)', 'Затраты на поиск багов', 'Ручное тестирование, запуск CI-пайплайнов, аудит безопасности'],
                    ['Internal Failure (Внутренние)', 'Баги, найденные до релиза', 'Переделывание кода, повторный прогон регресса, сорванный дедлайн спринта'],
                    ['External Failure (Внешние)', 'Баги, найденные в проде', 'Потеря клиентов, штрафы, откат релиза (Rollback), репутационный ущерб'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Правило 1-10-100',
                  code: `graph LR
                    P["Prevention<br/>$1"] -->|"если не предотвратили"| A["Appraisal<br/>$10"]
                    A -->|"если не нашли"| F["Failure (в проде)<br/>$100"]`,
                },
              ],
            },
            {
              id: 'qa-l101-s2',
              title: 'ROI автоматизации: когда писать тест?',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Автотест стоит дорого (написание + поддержка). Если тест запускается раз в год — он никогда не окупится. Senior QA считает ROI (Return on Investment) автоматизации.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Формула окупаемости',
                  code: `Затраты на ручной прогон = Время прогона × Частота (в год) × Стоимость часа QA
Затраты на автотест = Время написания + (Время поддержки × Годы)

Если Затраты на ручной прогон > Затраты на автотест → тест выгоден.`,
                },
              ],
            },
            {
              id: 'qa-l101-s3',
              title: 'Проверь себя: CoQ',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'К какой категории Cost of Quality относится автоматический прогон регрессионных тестов в CI на каждый Pull Request?',
                options: [
                  { id: 'a', text: 'Prevention (Превентивные)' },
                  { id: 'b', text: 'Appraisal (Оценочные)' },
                  { id: 'c', text: 'Internal Failure (Внутренние)' },
                  { id: 'd', text: 'External Failure (Внешние)' },
                ],
                correct: ['b'],
                explanation:
                  'Запуск тестов — это оценка (Appraisal). Если баг найден в CI — это Internal Failure. Prevention — это написание тестов и ревью.',
              },
            },
            {
              id: 'qa-l101-s4',
              title: 'Проверь себя: ROI',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'У вас есть ручной тест, который занимает 2 часа и запускается раз в квартал. Стоит ли его автоматизировать, если написание займет 40 часов?',
                options: [
                  { id: 'a', text: 'Да, автоматизация всегда выгодна' },
                  { id: 'b', text: 'Нет, затраты на написание (40ч) превысят затраты на ручной прогон за несколько лет (8ч в год)' },
                  { id: 'c', text: 'Да, потому что ручное тестирование — это зло' },
                  { id: 'd', text: 'Нет, потому что автотесты часто падают' },
                ],
                correct: ['b'],
                explanation:
                  'Ручной прогон 4 раза в год по 2 часа = 8 часов в год. Автотест стоит 40 часов. Окупится только через 5 лет, что экономически нецелесообразно. Лучше оставить ручной чек-лист.',
              },
            },
            {
              id: 'qa-l101-s5',
              title: 'Проверь себя: правило 1-10-100',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Согласно правилу 1-10-100, во сколько раз дороже исправить баг в продакшене (External Failure), чем на этапе требований (Prevention), если Prevention принять за 1?',
                correct: 100,
                explanation:
                  'Правило 1-10-100: Требования ($1) -> QA ($10) -> Продакшен ($100).',
              },
            },
          ],
        },
        {
          id: 'qa-l57',
          title: 'DORA-метрики и Quality Gates',
          minutes: 25,
          steps: [
            {
              id: 'qa-l57-s1',
              title: 'Четыре метрики DORA',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'DORA-метрики (пороги по отчёту 2024)',
                  head: ['Метрика', 'Что измеряет', 'Элита', 'High'],
                  rows: [
                    ['Deployment Frequency', 'Как часто деплоим в прод', 'По требованию', 'От 1 раза в день до 1 раза в неделю'],
                    ['Lead Time for Changes', 'Время от коммита до прода', '< 1 дня', '1 день – 1 неделя'],
                    ['Change Failure Rate', 'Доля деплоев, вызвавших сбой', '~5%', '~10%'],
                    ['Failed Deployment Recovery Time', 'Время восстановления после сбоя', '< 1 часа', '< 1 дня'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Четыре метрики DORA',
                  code: `graph LR
                    DF["Deployment Frequency<br/>↑ элита: по требованию"] --> Perf["DORA:<br/>скорость + стабильность"]
                    LT["Lead Time for Changes<br/>↓ элита: менее 1 дня"] --> Perf
                    CFR["Change Failure Rate<br/>↓ элита: около 5%"] --> Perf
                    MTTR["Failed Deployment Recovery<br/>↓ элита: менее 1 часа"] --> Perf`,
                },
              ],
            },
            {
              id: 'qa-l57-s2',
              title: 'Как QA влияет на DORA',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'QA не может напрямую контролировать деплой, но Senior QA напрямую влияет на **Change Failure Rate (CFR)** и **Failed Deployment Recovery Time (MTTR)**.',
                },
                {
                  type: 'list',
                  items: [
                    '**CFR (Доля сбоев)**: Снижаем через качественные автотесты (особенно интеграционные), Canary Deployments и Feature Flags.',
                    '**MTTR (Время восстановления)**: Снижаем через observability (быстро находим баг по трейсам/Sentry) и автоматизацию откатов (Rollback).',
                  ],
                },
              ],
            },
            {
              id: 'qa-l57-s3',
              title: 'Проверь себя: DORA',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Change Failure Rate 30%, Deployment Frequency упала. Какая первая гипотеза?',
                options: [
                  { id: 'a', text: 'Нанять больше QA' },
                  { id: 'b', text: 'Проблемы в CI/CD: слабые автотесты, нет rollback, ручные деплои' },
                  { id: 'c', text: 'Купить другой облачный провайдер' },
                  { id: 'd', text: 'Уволить разработчиков' },
                ],
                correct: ['b'],
                explanation:
                  'Высокий CFR + падающая Frequency = релизы «страшно делать». Причины: нет автотестов на регресс, нет feature flags, rollback руками.',
              },
            },
            {
              id: 'qa-l57-s4',
              title: 'Проверь себя: MTTR',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что означает метрика Failed Deployment Recovery Time (ранее MTTR)?',
                options: [
                  { id: 'a', text: 'Как часто мы деплоим' },
                  { id: 'b', text: 'Время от обнаружения сбоя в проде до его устранения' },
                  { id: 'c', text: 'Время прохождения тестов в CI' },
                  { id: 'd', text: 'Количество сбоев за месяц' },
                ],
                correct: ['b'],
                explanation:
                  'MTTR (Mean Time to Recover) — среднее время восстановления после сбоя. Это метрика стабильности.',
              },
            },
            {
              id: 'qa-l57-s5',
              title: 'Проверь себя: Quality Gate',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие проверки стоит делать блокирующими (Quality Gate) для Pull Request?',
                options: [
                  { id: 'a', text: 'Lint (стиль кода)' },
                  { id: 'b', text: 'Unit-тесты' },
                  { id: 'c', text: 'Полный регресс (1000 E2E-тестов на 3 часа)' },
                  { id: 'd', text: 'SAST (Критичные уязвимости)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Lint, Unit и SAST (Critical) — быстрые проверки. Полный регресс на 3 часа блокировать нельзя, его запускают ночью (Nightly).',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Архитектура тестовых фреймворков (3 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m2',
      title: 'Архитектура тестовых фреймворков',
      lessons: [
        {
          id: 'qa-l59',
          title: 'Слои фреймворка и Page Object',
          minutes: 30,
          steps: [
            {
              id: 'qa-l59-s1',
              title: 'Зачем выносить слои',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Хороший фреймворк — это не «папка с тестами». Это слои: тесты (что проверяем), Page Objects / API clients (как взаимодействуем), хелперы (данные, утилиты), конфиги (окружения).',
                },
                {
                  type: 'mermaid',
                  caption: 'Слои тестового фреймворка',
                  code: `graph TD
                    Tests["tests/<br/>только сценарии и asserts"] --> Pages["pages/<br/>Page Object"]
                    Tests --> API["api_clients/<br/>обёртки над HTTP API"]
                    Tests --> Fix["fixtures/<br/>данные и подготовка"]
                    Pages --> Base["pages/base.py<br/>BasePage"]
                    API --> Config["config/<br/>dev / staging / prod"]`,
                },
              ],
            },
            {
              id: 'qa-l59-s2',
              title: 'Проверь себя: архитектура',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем выносить Page Objects и API-клиенты в отдельные слои?',
                options: [
                  { id: 'a', text: 'Чтобы тесты шли быстрее' },
                  { id: 'b', text: 'Чтобы при изменении вёрстки/API править одно место, а не сотни тестов' },
                  { id: 'c', text: 'Это требование pytest' },
                  { id: 'd', text: 'Для красоты' },
                ],
                correct: ['b'],
                explanation:
                  'Изоляция: тест не знает про CSS-селекторы или URL API. Изменилась кнопка — правим только Page Object.',
              },
            },
            {
              id: 'qa-l59-s3',
              title: 'Проверь себя: структура',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте папку и её содержимое',
                pairs: [
                  { left: 'tests/', right: 'Сценарии и Assert' },
                  { left: 'pages/', right: 'Локаторы и методы страниц' },
                  { left: 'api_clients/', right: 'HTTP-запросы' },
                  { left: 'fixtures/', right: 'Подготовка данных' },
                ],
                explanation:
                  'Тесты вызывают методы из pages/ и api_clients/, а фикстуры готовят данные.',
              },
            },
            {
              id: 'qa-l59-s4',
              title: 'Когда Page Object становится проблемой',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если в Page Object появляются методы вроде `login_and_add_to_cart_and_checkout()`, значит, он превращается в «божественный объект». Page Object должен описывать **только элементы страницы**, а бизнес-логику нужно выносить выше (в Screenplay или хелперы).',
                },
              ],
            },
            {
              id: 'qa-l59-s5',
              title: 'Проверь себя: антипаттерн',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой метод в Page Object считается антипаттерном?',
                options: [
                  { id: 'a', text: 'def click_submit(self):' },
                  { id: 'b', text: 'def get_error_text(self):' },
                  { id: 'c', text: 'def buy_iphone_with_promo_and_send_email(self):' },
                  { id: 'd', text: 'def open(self, url):' },
                ],
                correct: ['c'],
                explanation:
                  'Page Object должен уметь работать со страницей (клик, ввод, чтение текста). Сквозной бизнес-сценарий (купить + промокод + email) в Page Object — это нарушение ответственности.',
              },
            },
          ],
        },
        {
          id: 'qa-l103',
          title: 'Паттерн Screenplay (Актеры и Задачи)',
          minutes: 35,
          steps: [
            {
              id: 'qa-l103-s1',
              title: 'Проблема Page Object в сложных тестах',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Page Object отлично работает для простых страниц. Но когда бизнес-сценарий разрастается (логин → поиск → корзина → оплата), тесты становятся похожи на «простыни» вызовов методов. Паттерн **Screenplay** решает это, смещая фокус с *страниц* на *актеров и их задачи*.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Сравнение подходов',
                  code: `# Page Object: тест знает про страницы
login_page.open().login(user, pass)
catalog_page.search("iphone")
product_page.add_to_cart()
checkout_page.pay(card)

# Screenplay: тест описывает бизнес-задачу
actor.attempts_to(
    Login(user, pass),
    Search_for_item("iphone"),
    Add_to_cart(),
    Checkout(card)
)`,
                },
              ],
            },
            {
              id: 'qa-l103-s2',
              title: 'Компоненты Screenplay',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Структура Screenplay',
                  code: `graph TD
                    A["Actor (Актер)"] -->|"выполняет"| T["Task (Задача)"]
                    T -->|"состоит из"| I["Interaction (Шаг)"]
                    T -->|"проверяет"| Q["Question (Вопрос)"]
                    A -->|"имеет"| Ab["Abilities (Способности)<br/>например, BrowseTheWeb"]`,
                },
                {
                  type: 'list',
                  items: [
                    '**Actor**: Кто выполняет действия (например, "Покупатель").',
                    '**Ability**: Что он умеет (например, "ходить по сайту" или "делать API-запросы").',
                    '**Task**: Бизнес-шаг (например, "Войти в систему").',
                    '**Question**: Проверка (например, "Видит ли он кнопку?").',
                  ],
                },
              ],
            },
            {
              id: 'qa-l103-s3',
              title: 'Проверь себя: Screenplay',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чем главное отличие Screenplay от Page Object?',
                options: [
                  { id: 'a', text: 'Screenplay работает быстрее' },
                  { id: 'b', text: 'Screenplay моделирует действия пользователя (бизнес-задачи), а не структуру страниц' },
                  { id: 'c', text: 'Screenplay не использует Selenium' },
                  { id: 'd', text: 'Page Object не поддерживает Python' },
                ],
                correct: ['b'],
                explanation:
                  'Screenplay позволяет писать тесты на языке бизнеса («Актер пытается Войти, затем Купить товар»). Это делает тесты читаемыми для Product Owner.',
              },
            },
            {
              id: 'qa-l103-s4',
              title: 'Пример на Python',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Реализация Screenplay',
                  code: `class Login(Task):
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def perform_as(self, actor):
        actor.attempts_to(
            Enter.the_value(self.email).into(LoginPage.EMAIL_FIELD),
            Enter.the_value(self.password).into(LoginPage.PASSWORD_FIELD),
            Click.on(LoginPage.SUBMIT_BUTTON)
        )

# В тесте:
buyer.attempts_to(
    Login("test@x.com", "secret"),
    See.that(Header.WELCOME_TEXT).is_visible()
)`,
                },
              ],
            },
            {
              id: 'qa-l103-s5',
              title: 'Плюсы и минусы',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    '✅ Переиспользование: Задачу `Login` можно вызывать в 100 разных тестах.',
                    '✅ Читаемость: Тест выглядит как бизнес-требование.',
                    '✅ Масштабируемость: Легко комбинировать Задачи в новые сценарии.',
                    '❌ Порог входа: Требует больше абстракций, чем Page Object.',
                    '❌ Избыточность: Для простого сайта на 3 страницы Screenplay будет оверкиллом.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l103-s6',
              title: 'Проверь себя: Actor',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как называется компонент в Screenplay, который представляет собой пользователя (например, "Покупатель"), выполняющего действия? (одно слово)',
                accepted: ['Actor', 'actor', 'Актер'],
                placeholder: 'Название компонента',
                hint: 'От английского «актер»',
                explanation:
                  'Actor (Актер) — это центральная фигура в Screenplay. Он имеет Abilities (Способности) и выполняет Tasks (Задачи).',
              },
            },
          ],
        },
        {
          id: 'qa-l104',
          title: 'Testcontainers: реальные зависимости',
          minutes: 30,
          steps: [
            {
              id: 'qa-l104-s1',
              title: 'Проблема локальных моков БД',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Интеграционные тесты часто используют H2 или моки. В итоге тесты зеленые, а в проде падают из-за специфичного SQL-синтаксиса Postgres. **Testcontainers** поднимает реальный Docker-контейнер с БД (Postgres, Redis, Kafka) прямо во время теста и убивает его после.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Пример на Python (pytest)',
                  code: `from testcontainers.postgres import PostgresContainer
import pytest

@pytest.fixture(scope="session")
def postgres():
    with PostgresContainer("postgres:15-alpine") as postgres:
        yield postgres

def test_user_creation(postgres):
    engine = create_engine(postgres.get_connection_url())
    # ... выполнение теста`,
                },
              ],
            },
            {
              id: 'qa-l104-s2',
              title: 'Проверь себя: Testcontainers',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем использовать Testcontainers вместо H2 или моков БД?',
                options: [
                  { id: 'a', text: 'Они работают быстрее' },
                  { id: 'b', text: 'Они гарантируют совместимость тестов с реальной СУБД (версия, синтаксис)' },
                  { id: 'c', text: 'Они не требуют Docker' },
                  { id: 'd', text: 'Они нужны только для UI-тестов' },
                ],
                correct: ['b'],
                explanation:
                  'H2 или SQLite имеют отличия в SQL-синтаксисе от Postgres. Testcontainers запускает реальный Docker-образ Postgres.',
              },
            },
            {
              id: 'qa-l104-s3',
              title: 'Как это работает под капотом',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Testcontainers использует Docker API. При запуске теста он скачивает образ (если его нет), запускает контейнер, ждёт, пока БД инициализируется, и прокидывает порт (например, 5432) на хост.',
                },
                {
                  type: 'mermaid',
                  caption: 'Жизненный цикл Testcontainer',
                  code: `sequenceDiagram
                    participant Test as pytest
                    participant TC as Testcontainers
                    participant Docker
                    participant DB as Postgres Container

                    Test->>TC: Запусти Postgres:15
                    TC->>Docker: docker run
                    Docker->>DB: Start
                    TC->>DB: Ждём готовности (Healthcheck)
                    DB-->>TC: Ready
                    TC-->>Test: Connection URL
                    Test->>DB: Выполняем SQL
                    Test->>TC: Тест завершен
                    TC->>Docker: docker stop
                    Docker->>DB: Убить контейнер`,
                },
              ],
            },
            {
              id: 'qa-l104-s4',
              title: 'Проблемы производительности',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Запуск контейнера занимает время (1–5 секунд). Если поднимать БД на каждый тест (scope="function"), тесты будут идти вечность. Senior QA использует `scope="session"` для БД и очищает таблицы между тестами (TRUNCATE), либо использует транзакции с откатом (Rollback).',
                },
              ],
            },
            {
              id: 'qa-l104-s5',
              title: 'Проверь себя: оптимизация',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как оптимизировать тесты с Testcontainers, чтобы они не шли слишком долго?',
                options: [
                  { id: 'a', text: 'Запускать контейнер для каждого теста (function scope)' },
                  { id: 'b', text: 'Использовать session scope для контейнера и очищать данные (TRUNCATE) между тестами' },
                  { id: 'c', text: 'Вообще не использовать Testcontainers' },
                  { id: 'd', text: 'Запускать тесты только по ночам' },
                ],
                correct: ['b'],
                explanation:
                  'Запуск контейнера — это секунды. Если в наборе 100 тестов, запуск на каждый = 5 минут оверхеда. Правильно — поднять один контейнер на всю сессию (session scope) и очищать данные между тестами.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Данные и флаки (2 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m3',
      title: 'Тестовые данные и флаки',
      lessons: [
        {
          id: 'qa-l60',
          title: 'Test Data Management (TDM)',
          minutes: 30,
          steps: [
            {
              id: 'qa-l60-s1',
              title: 'Synthetic vs Masked Data',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Тестам нужны данные. Использовать копию прода — плохо (GDPR/152-ФЗ) и опасно. Есть два подхода к генерации данных.',
                },
                {
                  type: 'table',
                  caption: 'Подходы к данным',
                  head: ['Подход', 'Суть', 'Плюсы', 'Минусы'],
                  rows: [
                    ['Synthetic (Синтетика)', 'Генерация данных с нуля (Faker, FactoryBoy)', 'Безопасно, легко создать миллион записей', 'Может не отражать реальные аномалии'],
                    ['Masked (Маскирование)', 'Взять прод-данные и заменить PII (имена, телефоны) на фейки', 'Реалистичные граничные случаи', 'Сложно настроить, риск утечки'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l60-s2',
              title: 'Проверь себя: TDM',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вам нужно протестировать систему с 5 миллионами пользователей. Какой подход к данным выбрать?',
                options: [
                  { id: 'a', text: 'Сгенерировать 5 миллионов пользователей через Faker' },
                  { id: 'b', text: 'Взять дамп прода и загрузить на тестовый стенд' },
                  { id: 'c', text: 'Использовать маскированные данные (Masked Data) с сохранением распределения' },
                  { id: 'd', text: 'Создать одного пользователя и запустить тест 5 миллионов раз' },
                ],
                correct: ['c'],
                explanation:
                  'Для объемных тестов важны паттерны распределения. Faker даст равномерное распределение, что нереалистично. Дамп прода нарушает закон. Masked Data сохраняет паттерны.',
              },
            },
            {
              id: 'qa-l60-s3',
              title: 'Инструменты маскирования',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    '**Delphix**: Коммерческий инструмент, автоматически находит PII и заменяет его.',
                    '**Tonic.ai**: Генерация синтетических данных на основе схемы БД.',
                    '**Faker (Python)**: Библиотека для генерации фейковых имен, адресов, телефонов.',
                    '**Factory Boy**: Создание объектов для тестов с уникальными полями.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l60-s4',
              title: 'Проверь себя: закон',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему нельзя просто скопировать прод-базу на staging для тестов?',
                options: [
                  { id: 'a', text: 'Это занимает много места' },
                  { id: 'b', text: 'Это нарушает законы о персональных данных (GDPR, 152-ФЗ), так как содержит PII реальных людей' },
                  { id: 'c', text: 'Тесты будут работать медленнее' },
                  { id: 'd', text: 'Это запрещено лицензией PostgreSQL' },
                ],
                correct: ['b'],
                explanation:
                  'База содержит имена, телефоны, email реальных людей. Их передача на тестовые стенды без маскирования — это утечка персональных данных.',
              },
            },
            {
              id: 'qa-l60-s5',
              title: 'Стратегия очистки данных',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если тест создает пользователя, он должен его удалить (Teardown). Иначе база распухнет, а тесты начнут падать из-за дублей. Подходы:',
                },
                {
                  type: 'list',
                  items: [
                    '**Teardown**: Удаление созданных записей в блоке `finally` или pytest-фикстуре (yield).',
                    '**Ephemeral DB**: Поднять контейнер (Testcontainers), убить контейнер (все данные удалены).',
                    '**Транзакции**: Начать транзакцию перед тестом, сделать Rollback после теста (данные не сохраняются).',
                  ],
                },
              ],
            },
            {
              id: 'qa-l60-s6',
              title: 'Проверь себя: очистка',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чем главное преимущество использования транзакций (Rollback) для очистки данных после теста?',
                options: [
                  { id: 'a', text: 'Транзакции быстрее, чем DROP TABLE' },
                  { id: 'b', text: 'Не нужно писать SQL-запросы на удаление (DELETE) — база откатывается к состоянию до теста' },
                  { id: 'c', text: 'Транзакции позволяют тестам работать параллельно' },
                  { id: 'd', text: 'Они не требуют подключения к БД' },
                ],
                correct: ['b'],
                explanation:
                  'Вместо того чтобы вручную удалять созданные записи (что легко забыть), можно откатить транзакцию. База вернется в исходное состояние автоматически.',
              },
            },
          ],
        },
        {
          id: 'qa-l61',
          title: 'Flaky Tests: системный подход',
          minutes: 25,
          steps: [
            {
              id: 'qa-l61-s1',
              title: 'Flaky Management Policy',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Флакающий тест хуже, чем отсутствие теста: он подрывает доверие к CI. Senior QA внедряет политику работы с флаками.',
                },
                {
                  type: 'list',
                  items: [
                    '**Rule of 3**: Тест, упавший 3 раза подряд без изменения кода, переводится в статус `@flaky`.',
                    '**Quarantine (Карантин)**: Флаки выносятся из блокирующего CI в отдельную ночную сборку.',
                    '**Ownership**: У каждого флака есть ответственный (автор теста).',
                    '**Metrics**: Метрика `Flaky Rate` (процент флаков). Если > 2%, релиз блокируется до починки.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l61-s2',
              title: 'Проверь себя: флаки',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры помогают эффективно бороться с флакающими тестами?',
                options: [
                  { id: 'a', text: 'Настроить автоматический retry в CI, чтобы тест не падал' },
                  { id: 'b', text: 'Внедрить карантин (quarantine) для нестабильных тестов' },
                  { id: 'c', text: 'Сделать так, чтобы каждый тест генерировал уникальные данные (uuid)' },
                  { id: 'd', text: 'Назначить ответственного за каждый нестабильный тест' },
                ],
                correct: ['b', 'c', 'd'],
                explanation:
                  'Автоматический retry (a) — это антипаттерн, он маскирует проблему. Остальные три (b, c, d) — правильная стратегия.',
              },
            },
            {
              id: 'qa-l61-s3',
              title: 'Причины флаков',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Почему тесты падают «через раз»',
                  head: ['Причина', 'Пример', 'Решение'],
                  rows: [
                    ['Гонки (Race Conditions)', 'Два теста пишут в одну БД', 'Уникальные данные, изоляция'],
                    ['Тайминги', 'Тест ждет 2 секунды, а сервер отвечает за 3', 'Умные ожидания (Playwright expect)'],
                    ['Зависимость от порядка', 'Тест 2 зависит от данных Теста 1', 'Независимые тесты (Arrange для каждого)'],
                    ['Внешние API', 'Сторонний сервис лежит', 'Моки (WireMock) для внешних систем'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l61-s4',
              title: 'Инструменты дебага',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Поиск причины флака',
                  code: `# Запустить только упавшие в прошлый раз тесты
pytest --lf

# Прогнать тест 100 раз (найти закономерность)
pytest tests/test_flaky.py --count=100

# Сохранить Trace (Playwright) при падении
pytest --tracing=retain-on-failure
playwright show-trace trace.zip`,
                },
              ],
            },
            {
              id: 'qa-l61-s5',
              title: 'Проверь себя: правило 3 страйков',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что гласит правило "Rule of 3" для флакающих тестов?',
                options: [
                  { id: 'a', text: 'Тест можно перезапускать 3 раза' },
                  { id: 'b', text: 'Если тест упал 3 раза без изменений в коде, он переводится в карантин (@flaky)' },
                  { id: 'c', text: 'Над тестом должны работать 3 QA' },
                  { id: 'd', text: 'Тест удаляется после 3-го падения' },
                ],
                correct: ['b'],
                explanation:
                  'Если тест падает без изменения кода 3 раза, это флак. Его изолируют, чтобы он не блокировал разработку, и чинят.',
              },
            },
            {
              id: 'qa-l61-s6',
              title: 'Проверь себя: дебаг',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая самая частая причина флакающих тестов в автотестах?',
                options: [
                  { id: 'a', text: 'Медленный интернет' },
                  { id: 'b', text: 'Гонки (race condition) и общие данные между тестами' },
                  { id: 'c', text: 'Плохой синтаксис Python' },
                  { id: 'd', text: 'Мало памяти' },
                ],
                correct: ['b'],
                explanation:
                  'При параллельном запуске или общем стейте (один пользователь, одна запись в БД) тесты мешают друг другу.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Performance & Security (3 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m4',
      title: 'Performance & Security',
      lessons: [
        {
          id: 'qa-l107',
          title: 'Математика нагрузки: Закон Литтла',
          minutes: 30,
          steps: [
            {
              id: 'qa-l107-s1',
              title: 'L = λ × W',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Senior QA понимает физику нагрузки. Закон Литтла связывает три величины:',
                },
                {
                  type: 'list',
                  items: [
                    '**L (Length)**: Среднее число пользователей, одновременно находящихся в системе.',
                    '**λ (Lambda)**: Интенсивность поступления (Throughput, RPS).',
                    '**W (Wait Time)**: Среднее время, которое пользователь проводит в системе (Latency).',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Формула и пример',
                  code: `L = λ × W

Пример: Мы хотим, чтобы система держала 100 RPS (λ = 100).
Среднее время ответа должно быть не более 200 мс (W = 0.2 сек).
L = 100 * 0.2 = 20 (concurrent users).`,
                },
              ],
            },
            {
              id: 'qa-l107-s2',
              title: 'Проверь себя: Law of Little',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Система обрабатывает 300 RPS, среднее время ответа 0.1 сек. Сколько одновременных запросов находится в системе? (L = λ * W)',
                correct: 30,
                explanation: 'L = 300 * 0.1 = 30.',
              },
            },
            {
              id: 'qa-l107-s3',
              title: 'Диагностика боттлнеков',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если при нагрузке RPS растет, а Latency тоже растет — мы уперлись в ресурсы. Смотреть нужно на метрики CPU, Memory и I/O.',
                },
                {
                  type: 'table',
                  caption: 'Где искать узкое место',
                  head: ['Метрика', 'Наблюдение', 'Причина'],
                  rows: [
                    ['CPU App-сервера', '100%', 'Код тормозит (тяжелые вычисления)'],
                    ['CPU App-сервера', 'Низкий, но Latency растет', 'I/O Wait. БД или внешний API тормозит'],
                    ['Memory', 'Растет, потом OOM', 'Утечка памяти'],
                    ['DB Connections', 'Уперлись в лимит', 'Неправильный пул соединений'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l107-s4',
              title: 'Проверь себя: боттлнеки',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'При нагрузочном тесте CPU приложения 20%, но Latency выросла с 200мс до 2 секунд. В чем вероятная причина?',
                options: [
                  { id: 'a', text: 'Не хватает CPU' },
                  { id: 'b', text: 'Утечка памяти' },
                  { id: 'c', text: 'I/O Wait (база данных или внешний API не успевают отвечать)' },
                  { id: 'd', text: 'Ошибка в коде приложения' },
                ],
                correct: ['c'],
                explanation:
                  'Низкий CPU и высокий Latency — классический признак I/O Wait. Приложение ждет ответа от БД или внешнего сервиса, само при этом ничего не вычисляя.',
              },
            },
            {
              id: 'qa-l107-s5',
              title: 'Профилирование',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Чтобы найти, какая именно функция тормозит на сервере, используют профайлеры. Для Python — `py-spy` или `cProfile`. Для Go — `pprof`. Senior QA умеет приложить профиль к баг-репорту.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'py-spy: профилирование без перезапуска',
                  code: `# Профилирование работающего процесса (PID)
py-spy top --pid 1234
py-spy record -o profile.svg --pid 1234`,
                },
              ],
            },
          ],
        },
        {
          id: 'qa-l63',
          title: 'SAST, DAST, IAST и SCA: глубокое погружение',
          minutes: 40,
          steps: [
            {
              id: 'qa-l63-s1',
              title: 'SAST: как статический анализ «видит» уязвимости',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `SAST (Static Application Security Testing) анализирует исходный код без его запуска. Чтобы не искать просто совпадения по регуляркам, современные SAST-сканеры строят абстрактное синтаксическое дерево (AST) и анализируют граф потока данных (DFG).`,
                },
                {
                  type: 'p',
                  text: `Главный механизм поиска инъекций в SAST — это **Taint Analysis**. Сканер ищет три компонента:
                  1. **Source (Источник)**: откуда приходят недоверенные данные (например, \`request.args.get('id')\`).
                  2. **Sink (Сточка)**: куда эти данные попадают (например, \`cursor.execute(query)\`).
                  3. **Sanitizer (Очиститель)**: функция, которая обезвреживает данные (например, \`int()\`).
                  Если данные проходят от Source к Sink **без** Sanitizer'а, сканер поднимает тревогу.`,
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Пример Taint Analysis',
                  code: `# Опасность: Source -> Sink без Sanitizer
def get_user(request):
    user_id = request.GET.get('id')  # SOURCE
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)            # SINK (SQL Injection)

# Безопасно: есть Sanitizer
def get_user_safe(request):
    user_id = int(request.GET.get('id')) # SANITIZER
    cursor.execute("SELECT * FROM users WHERE id = %s", [user_id])`,
                },
              ],
            },
            {
              id: 'qa-l63-s2',
              title: 'Плюсы и минусы SAST',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    '✅ **Работает до запуска кода (Shift-Left)**: на Pull Request.',
                    '✅ **Указывает точную строку**: разработчику легко исправить.',
                    '✅ **Находит ошибки в конфигурациях IaC**: Terraform, Kubernetes YAML.',
                    '❌ **Ложные срабатывания (False Positives)**: если не понимает кастомный Sanitizer.',
                    '❌ **Не находит логические дыры**: например, Broken Access Control (IDOR).',
                  ],
                },
              ],
            },
            {
              id: 'qa-l63-s3',
              title: 'DAST и IAST: динамика',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `DAST (Dynamic Application Security Testing) сканирует запущенное приложение, отправляя тысячи вредоносных HTTP-запросов. Основные этапы: **Spidering** (обход ссылок) и **Fuzzing** (подстановка пейлоадов XSS, SQLi).`,
                },
                {
                  type: 'note',
                  text: `**Проблема SPA (React/Vue)**: DAST-сканеры часто не умеют выполнять JavaScript. Они видят пустой \`<div id="root">\`. Для SPA нужны headless-браузеры внутри DAST (ZAP Ajax Spider). Также сканеру нужна настройка токенов, чтобы ходить под авторизацией.`,
                },
                {
                  type: 'p',
                  text: `**IAST (Interactive Application Security Testing)** — гибрид. Агент внедряется в рантайм приложения. Когда QA гоняет автотесты, агент видит точную строку кода и срабатывает только при реальной атаке. Идеален для CI.`,
                },
              ],
            },
            {
              id: 'qa-l63-s4',
              title: 'SCA и SBOM',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `SCA (Software Composition Analysis) анализирует зависимости (package-lock.json, requirements.txt). В одной из транзитивных библиотек может быть критическая уязвимость (CVE), как это было с Log4Shell.`,
                },
                {
                  type: 'note',
                  text: `**SBOM (Software Bill of Materials)** — это «состав» вашего приложения (JSON-файл со списком всех зависимостей). По новым законам (США, ЕС) наличие SBOM обязательно для госсектора. QA Senior должен уметь генерировать SBOM (через Trivy или Syft) и прикреплять его к артефактам релиза.`,
                },
              ],
            },
            {
              id: 'qa-l63-s5',
              title: 'Сводная таблица',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение подходов',
                  head: ['Критерий', 'SAST', 'DAST', 'IAST', 'SCA'],
                  rows: [
                    ['Что анализирует', 'Исходный код', 'HTTP-запросы/ответы', 'Рантайм во время тестов', 'Зависимости'],
                    ['Когда запускать', 'На каждый PR', 'Nightly / Staging', 'Во время E2E-тестов', 'На каждый PR'],
                    ['Точность указания', 'Файл и строка', 'Только URL', 'Файл, строка, стек', 'Имя библиотеки'],
                    ['Ложные срабатывания', 'Высокие', 'Нулевые', 'Нулевые', 'Средние'],
                    ['Скорость', 'Секунды/минуты', 'Часы', 'Зависит от тестов', 'Секунды'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l63-s6',
              title: 'Проблема триажа (Triage)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Если включить SonarQube на старый проект, он выдаст 5000 ошибок. Если сделать их все блокирующими — разработка остановится. Senior QA внедряет **Baselining** и **Security Gate**.`,
                },
                {
                  type: 'list',
                  items: [
                    '**Baselining**: старые уязвимости фиксируются в базе, новые PR проверяются только на **новые** уязвимости.',
                    '**Gate по критичности**: Блокируем PR только при наличии уязвимостей уровня **Critical** и **High**. Medium/Low — создают тикеты в Jira.',
                    '**False Positive**: если сканер ошибается, в коде ставится комментарий-подавление (например, `// nosemgrep: sql-injection`).',
                  ],
                },
              ],
            },
            {
              id: 'qa-l63-s7',
              title: 'Проверь себя: механизмы SAST',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое Taint Analysis в контексте SAST?',
                options: [
                  { id: 'a', text: 'Поиск запрещенных слов в коде (пароли, токены)' },
                  { id: 'b', text: 'Анализ пути данных от источника (Source) до опасной функции (Sink) без очистки' },
                  { id: 'c', text: 'Сканирование открытых портов на сервере' },
                  { id: 'd', text: 'Проверка лицензий сторонних библиотек' },
                ],
                correct: ['b'],
                explanation: 'Taint Analysis (анализ заражения) отслеживает, как недоверенные данные от пользователя (Source) достигают базы данных или консоли (Sink) без использования очищающих функций (Sanitizer).',
              },
            },
            {
              id: 'qa-l63-s8',
              title: 'Проверь себя: ограничения DAST',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'С какими проблемами сталкивается QA при настройке DAST-сканера?',
                options: [
                  { id: 'a', text: 'Трудности со сканированием SPA-приложений (React/Vue), так как нужен JS-движок' },
                  { id: 'b', text: 'Невозможность сканировать закрытые страницы без настройки авторизации в сканере' },
                  { id: 'c', text: 'Сканер не указывает точную строку в исходном коде' },
                  { id: 'd', text: 'DAST генерирует много ложных срабатываний на безопасный код' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'DAST не видит код (c), плохо работает с SPA (a) и требует настройки токенов (b). У DAST нет ложных срабатываний.',
              },
            },
            {
              id: 'qa-l63-s9',
              title: 'Проверь себя: стратегия внедрения',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вы внедрили SonarQube (SAST), и он выдал 5000 ошибок на легаси-коде. PR стали красными. Что делать?',
                options: [
                  { id: 'a', text: 'Отключить SonarQube' },
                  { id: 'b', text: 'Заставить разработчиков исправить все 5000 ошибок' },
                  { id: 'c', text: 'Внедрить Baselining (зафиксировать старые ошибки) и блокировать только новые Critical/High' },
                  { id: 'd', text: 'Сделать все проверки неблокирующими (warning)' },
                ],
                correct: ['c'],
                explanation: 'Внедрение безопасности в легаси требует компромисса. Baselining (фиксация текущего состояния) позволяет не блокировать разработку из-за старых проблем, но жестко блокирует новые критические уязвимости.',
              },
            },
          ],
        },
        {
          id: 'qa-l108',
          title: 'Threat Modeling (STRIDE)',
          minutes: 35,
          steps: [
            {
              id: 'qa-l108-s1',
              title: 'Моделирование угроз на этапе дизайна',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Искать уязвимости постфактум — дорого. Senior QA участвует в Threat Modeling на этапе проектирования фичи. Фреймворк **STRIDE** (Microsoft):',
                },
                {
                  type: 'table',
                  caption: 'STRIDE',
                  head: ['Угроза', 'Расшифровка', 'Что нарушает', 'Пример'],
                  rows: [
                    ['Spoofing', 'Подмена личности', 'Аутентификация', 'Кража JWT-токена'],
                    ['Tampering', 'Изменение данных', 'Целостность', 'Подмена цены в запросе на оплату'],
                    ['Repudiation', 'Отказ от действий', 'Неоспоримость', 'Нет логов IP и времени заказа'],
                    ['Information Disclosure', 'Утечка информации', 'Конфиденциальность', 'API отдает хэши паролей'],
                    ['Denial of Service', 'Отказ в обслуживании', 'Доступность', 'DDoS или Billion Laughs'],
                    ['Elevation of Privilege', 'Повышение привилегий', 'Авторизация', 'IDOR: юзер получает доступ к админке'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l108-s2',
              title: 'Пример: моделируем загрузку аватара',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Представьте фичу: «Пользователь загружает аватарку». Прогоняем по STRIDE:',
                },
                {
                  type: 'list',
                  items: [
                    '**Spoofing**: Может ли злоумышленник загрузить аватар вместо другого пользователя? (Ответ: да, если нет проверки токена).',
                    '**Tampering**: Может ли он загрузить .exe файл вместо картинки, изменив заголовок? (Нужна проверка MIME-типа).',
                    '**Info Disclosure**: Доступен ли URL картинки по прямому перебору имен (image1.jpg, image2.jpg)? (Нужны UUID-имена).',
                    '**DoS**: Может ли он загрузить файл на 10 ГБ? (Нужен лимит размера).',
                  ],
                },
              ],
            },
            {
              id: 'qa-l108-s3',
              title: 'Проверь себя: STRIDE',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте угрозу STRIDE и уязвимость',
                pairs: [
                  { left: 'Tampering', right: 'IDOR (подмена ID в запросе)' },
                  { left: 'Elevation of Privilege', right: 'Обычный юзер получает доступ к админке' },
                  { left: 'Information Disclosure', right: 'API отдает хэши паролей' },
                  { left: 'Spoofing', right: 'Использование чужого JWT токена' },
                ],
                explanation: 'Tampering — изменение параметра. Elevation — повышение прав. Information Disclosure — утечка. Spoofing — подмена токена.',
              },
            },
            {
              id: 'qa-l108-s4',
              title: 'Как QA проводит Threat Modeling',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Обычно это 1-часовой воркшоп с архитектором и разработчиком. QA рисует диаграмму потоков данных (DFD) и задает вопросы по каждой стрелке и узлу.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Вопросы для каждого компонента',
                  code: `Для каждого узла (база, сервер, клиент) и связи:
- Аутентифицирован ли этот запрос? (Spoofing)
- Можно ли изменить данные в пути? (Tampering)
- Логируются ли действия? (Repudiation)
- Не отдаем ли мы лишние данные? (Info Disclosure)
- Есть ли rate-limiting? (DoS)
- Проверяются ли права на сервере? (Elevation)`,
                },
              ],
            },
            {
              id: 'qa-l108-s5',
              title: 'Проверь себя: моделирование',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'На каком этапе лучше всего проводить Threat Modeling (STRIDE)?',
                options: [
                  { id: 'a', text: 'После релиза в продакшене' },
                  { id: 'b', text: 'На этапе проектирования архитектуры (до написания кода)' },
                  { id: 'c', text: 'Только когда найдена уязвимость' },
                  { id: 'd', text: 'Во время нагрузочного тестирования' },
                ],
                correct: ['b'],
                explanation:
                  'Threat Modeling на этапе дизайна — это Shift-Left в безопасности. Найти ошибку в архитектуре до кода в 100 раз дешевле, чем чинить её после релиза.',
              },
            },
            {
              id: 'qa-l108-s6',
              title: 'Инструменты',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    '**Microsoft Threat Modeling Tool**: Бесплатная программа для рисования DFD и генерации угроз по STRIDE.',
                    '**IriusRisk**: Коммерческий инструмент с автоматизацией.',
                    '**OWASP Threat Dragon**: Open-source веб-инструмент.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l108-s7',
              title: 'Проверь себя: DFD',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое DFD (Data Flow Diagram) в контексте Threat Modeling?',
                options: [
                  { id: 'a', text: 'Схема потоков данных, показывающая, как информация движется между компонентами системы' },
                  { id: 'b', text: 'Формат логов' },
                  { id: 'c', text: 'Тип базы данных' },
                  { id: 'd', text: 'Инструмент для написания автотестов' },
                ],
                correct: ['a'],
                explanation:
                  'DFD (Data Flow Diagram) — это диаграмма, на которой основан STRIDE. На ней рисуют узлы (процессы, хранилища данных) и стрелки (потоки данных), чтобы понять, где злоумышленник может вмешаться.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — CI/CD, TIA и Shift-Right (2 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m5',
      title: 'CI/CD, TIA и Shift-Right',
      lessons: [
        {
          id: 'qa-l109',
          title: 'Test Impact Analysis и Merge Queue',
          minutes: 25,
          steps: [
            {
              id: 'qa-l109-s1',
              title: 'Граф зависимостей вместо полного прогона',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда тестов 5000, они идут 2 часа. PR висит, разработчики злятся. TIA запускает только те тесты, которые затронул коммит.',
                },
                {
                  type: 'list',
                  items: [
                    '**Coverage-based**: `pytest-testmon` запоминает, какие строки кода покрывал тест. Изменили `cart.py` — запустили тесты для `cart.py`.',
                    '**Path-based**: Монорепозитории (Nx) знают граф пакетов. Изменили `ui-button` — запустили тесты `ui-button`.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l109-s2',
              title: 'Проверь себя: TIA',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как TIA (например, pytest-testmon) понимает, какие тесты запускать на PR?',
                options: [
                  { id: 'a', text: 'По названию измененного файла' },
                  { id: 'b', text: 'По графу покрытия: запускает тесты, которые в прошлый раз выполняли измененные строки кода' },
                  { id: 'c', text: 'Запускает все тесты, но с меньшим таймаутом' },
                  { id: 'd', text: 'Спрашивает у разработчика' },
                ],
                correct: ['b'],
                explanation:
                  'Coverage-based TIA (testmon) сохраняет в базу, какой тест какие строки кода покрыл. Если вы изменили функцию в utils.py, он найдет все тесты, которые проходили через эту функцию.',
              },
            },
            {
              id: 'qa-l109-s3',
              title: 'Merge Queue (Очередь слияния)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Проблема: 10 разработчиков сделали PR. Каждый зеленый по отдельности. Мержим первый — остальные 9 ломаются (Semantic Conflict). Merge Queue решает это.',
                },
                {
                  type: 'mermaid',
                  caption: 'Как работает Merge Queue',
                  code: `graph TD
                    PR1["PR 1"] -->|"CI Green"| MQ["Merge Queue"]
                    PR2["PR 2"] -->|"CI Green"| MQ
                    PR3["PR 3"] -->|"CI Green"| MQ
                    MQ -->|"1. Создает временную ветку PR1 + PR2"| CI["Запуск CI"]
                    CI -->|"2. Если Green"| Main["Merge в Main"]
                    CI -->|"3. Если Red (конфликт)"| PR2["Выкинуть PR2 из очереди"]`,
                },
              ],
            },
            {
              id: 'qa-l109-s4',
              title: 'Проверь себя: Merge Queue',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какую проблему решает Merge Queue?',
                options: [
                  { id: 'a', text: 'Ускоряет написание тестов' },
                  { id: 'b', text: 'Предотвращает Semantic Conflicts, когда два зеленых PR ломают друг друга при слиянии' },
                  { id: 'c', text: 'Заменяет Code Review' },
                  { id: 'd', text: 'Автоматически исправляет баги' },
                ],
                correct: ['b'],
                explanation:
                  'Два PR по отдельности зеленые, но вместе — красные. Merge Queue тестирует комбинацию PR перед мержем.',
              },
            },
            {
              id: 'qa-l109-s5',
              title: 'Риски TIA',
              type: 'theory',
              blocks: [
                {
                  type: 'note',
                  text: 'Риск TIA: если тест использует рефлексию или динамическую подгрузку, граф зависимостей может ошибиться. Поэтому полный прогон (Full Regression) оставляют на main-ветку или nightly сборку.',
                },
              ],
            },
          ],
        },
        {
          id: 'qa-l110',
          title: 'Shift-Right: Canary и Feature Flags',
          minutes: 30,
          steps: [
            {
              id: 'qa-l110-s1',
              title: 'Тестирование в продакшене',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Shift-Right означает, что релиз — это не конец тестирования, а его продолжение.',
                },
                {
                  type: 'list',
                  items: [
                    '**Canary Release**: Выкатываем новую версию на 5% серверов. Если метрики в норме — на 100%.',
                    '**Feature Flags (Фича-флаги)**: Код в проде, но «выключен» флагом. QA включает для тестирования, потом для 1% юзеров.',
                    '**Dark Launch**: Отправляем реальный трафик на новый сервис, но игнорируем его ответы.',
                  ],
                },
              ],
            },
            {
              id: 'qa-l110-s2',
              title: 'Проверь себя: Feature Flags',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чем главное преимущество Feature Flags?',
                options: [
                  { id: 'a', text: 'Они ускоряют приложение' },
                  { id: 'b', text: 'Они позволяют отделить деплой (Deploy) от релиза (Release)' },
                  { id: 'c', text: 'Они заменяют CI/CD' },
                  { id: 'd', text: 'Они автоматически пишут документацию' },
                ],
                correct: ['b'],
                explanation: 'Деплой — выкладка кода. Релиз — включение фичи. Флаги позволяют выкатить код и включить его позже (или откатить за секунды).',
              },
            },
            {
              id: 'qa-l110-s3',
              title: 'Как QA тестирует фича-флаги',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'При тестировании Feature Flags проверяются комбинации: флаг включен, флаг выключен, флаг включен только для 50% (если это A/B-тест).',
                },
                {
                  type: 'table',
                  caption: 'Матрица тестирования флага',
                  head: ['Состояние флага', 'Ожидаемое поведение'],
                  rows: [
                    ['ON (для QA)', 'Новая фича видна и работает'],
                    ['OFF', 'Новая фича скрыта, работает старый код'],
                    ['Kill Switch (Аварийный)', 'Фича отключена, даже если код задеплоен'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l110-s4',
              title: 'Проверь себя: тестирование флагов',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что обязательно нужно проверить QA при тестировании фичи за Feature Flag?',
                options: [
                  { id: 'a', text: 'Работу фичи при включенном флаге' },
                  { id: 'b', text: 'Работу старой версии при выключенном флаге' },
                  { id: 'c', text: 'Что фича не сломала другие части приложения (регресс)' },
                  { id: 'd', text: 'Что флаг нельзя переключить из кода' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'Флаг — это две разные ветки кода. Нужно проверить обе (Вкл и Выкл) и убедиться, что обе не ломают систему.',
              },
            },
            {
              id: 'qa-l110-s5',
              title: 'Технический долг флагов',
              type: 'theory',
              blocks: [
                {
                  type: 'note',
                  text: 'Флаги — это технический долг. Если флаг включен для 100% пользователей и фича стабильна, флаг нужно удалить из кода (и из тестов), иначе через год в коде будет 50 мертвых ветвлений.',
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m6 — Observability и Service Virtualization (3 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m6',
      title: 'Observability и Service Virtualization',
      lessons: [
        {
          id: 'qa-l111',
          title: 'OpenTelemetry: распределенный трейсинг',
          minutes: 30,
          steps: [
            {
              id: 'qa-l111-s1',
              title: 'Анатомия трейса',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В микросервисах логи разбросаны по серверам. OpenTelemetry собирает **Трейсы** — путь одного запроса. Senior QA использует трейсы, чтобы найти, где именно тормозит система.',
                },
                {
                  type: 'mermaid',
                  caption: 'Пример трейса (Waterfall)',
                  code: `sequenceDiagram
                    participant Client
                    participant Gateway
                    participant OrderSvc
                    participant PaymentSvc

                    Client->>Gateway: POST /checkout
                    Gateway->>OrderSvc: CreateOrder
                    OrderSvc->>PaymentSvc: POST /charge
                    Note over PaymentSvc: Задержка 2 сек! (Боттлнек)
                    PaymentSvc-->>OrderSvc: 200 OK
                    OrderSvc-->>Gateway: 201 Created`,
                },
              ],
            },
            {
              id: 'qa-l111-s2',
              title: 'Span Attributes и Trace ID',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Каждый шаг в трейсе (Span) содержит атрибуты. QA может искать трейсы по этим атрибутам, чтобы найти проблемы конкретного пользователя.',
                },
                {
                  type: 'code',
                  lang: 'json',
                  caption: 'Атрибуты спана в OTEL',
                  code: `{
  "name": "POST /charge",
  "service.name": "payment-service",
  "http.status_code": 500,
  "user.id": "12345",
  "error": true,
  "duration_ms": 2000
}`,
                },
              ],
            },
            {
              id: 'qa-l111-s3',
              title: 'Проверь себя: трейсы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Пользователь жалуется, что заказ оформлялся 10 секунд. Что нужно попросить, чтобы QA нашел узкое место?',
                options: [
                  { id: 'a', text: 'Скриншот экрана' },
                  { id: 'b', text: 'Trace ID из консоли браузера' },
                  { id: 'c', text: 'Логи сервера базы данных' },
                  { id: 'd', text: 'Название его браузера' },
                ],
                correct: ['b'],
                explanation: 'Trace ID связывает все логи. По нему в Jaeger или Grafana QA найдет точный путь запроса и увидит, какой сервис съел 10 секунд.',
              },
            },
            {
              id: 'qa-l111-s4',
              title: 'Baggage',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '**Baggage** — это данные, которые передаются от сервиса к сервису. Например, `tenant_id` (ID компании-клиента). Если QA ищет баг у конкретного клиента, он фильтрует трейсы по `baggage.tenant_id`.',
                },
              ],
            },
            {
              id: 'qa-l111-s5',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его роль в Observability',
                pairs: [
                  { left: 'Jaeger', right: 'Визуализация трейсов (Waterfall)' },
                  { left: 'Prometheus', right: 'Сбор метрик (RPS, CPU)' },
                  { left: 'Loki', right: 'Агрегация логов' },
                  { left: 'OpenTelemetry', right: 'Стандарт сбора телеметрии' },
                ],
                explanation:
                  'Jaeger — трейсы. Prometheus — метрики. Loki — логи. OpenTelemetry (OTEL) — единый стандарт, который собирает всё это.',
              },
            },
          ],
        },
        {
          id: 'qa-l112',
          title: 'Sentry и алертинг',
          minutes: 25,
          steps: [
            {
              id: 'qa-l112-s1',
              title: 'Работа с ошибками в Sentry',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Логи пишут все, но смотреть в них глазами — долго. Sentry агрегирует ошибки по сигнатурам стектрейсов, объединяя тысячи одинаковых ошибок в один "Issue".',
                },
                {
                  type: 'table',
                  caption: 'Метрики Sentry для QA',
                  head: ['Метрика', 'Значение', 'Действие'],
                  rows: [
                    ['Users Affected', 'Сколько уникальных пользователей затронуто', 'Приоритет: High (если > 1%)'],
                    ['First Seen', 'Когда ошибка появилась впервые', 'Связать с релизом'],
                    ['Release', 'Версия приложения', 'Понять, какой коммит сломал'],
                    ['Breadcrumbs', 'Действия пользователя до ошибки', 'Понять, как воспроизвести'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l112-s2',
              title: 'Проверь себя: Sentry',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие данные из Sentry помогают QA быстрее воспроизвести баг?',
                options: [
                  { id: 'a', text: 'Стектрейс (Stack trace)' },
                  { id: 'b', text: 'Breadcrumbs (действия пользователя)' },
                  { id: 'c', text: 'Информация о браузере и ОС' },
                  { id: 'd', text: 'Исходный код всего проекта' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'Sentry дает стектрейс, breadcrumbs и контекст. Исходный код в Sentry есть, но он не нужен QA для воспроизведения.',
              },
            },
            {
              id: 'qa-l112-s3',
              title: 'SLO и алертинг',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Алерт «CPU > 80%» — плохой алерт, он будит ночью, когда ничего не сломано. Senior QA настраивает алерты на основе SLO (Service Level Objectives).',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Prometheus Alert Rules (пример)',
                  code: `groups:
- name: slo_alerts
  rules:
  - alert: HighErrorRate
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: "Error rate exceeds 5% SLO (burn rate too high)"`,
                },
              ],
            },
            {
              id: 'qa-l112-s4',
              title: 'Проверь себя: алерты',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему алерт "CPU > 80% 5 минут" считается плохим?',
                options: [
                  { id: 'a', text: 'Он не показывает пользовательский опыт (может быть, CPU работает на 80%, но все запросы быстрые)' },
                  { id: 'b', text: 'Он слишком сложный' },
                  { id: 'c', text: 'Он требует покупки софта' },
                  { id: 'd', text: 'Он не работает в Kubernetes' },
                ],
                correct: ['a'],
                explanation:
                  'CPU на 80% — это нормально для многих систем. Если при этом Latency 10мс и нет ошибок, будить инженера ночью незачем. Алертить нужно на SLO (Error Rate, Latency), а не на железо.',
              },
            },
            {
              id: 'qa-l112-s5',
              title: 'Триаж инцидентов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда приходит алерт, Senior QA не паникует, а следует Playbook (инструкции). Первым делом — проверить дашборды (Error Rate, Latency) и Sentry (нет ли новых Issue). Если ошибка в новой версии — откатить (Rollback) или выключить Feature Flag.',
                },
              ],
            },
          ],
        },
        {
          id: 'qa-l73',
          title: 'Service Virtualization: WireMock',
          minutes: 25,
          steps: [
            {
              id: 'qa-l73-s1',
              title: 'Зачем мокать сервисы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Микросервис зависит от платежей, доставки, уведомлений. Для тестов нужно, чтобы они работали. Но: чужой сервис может быть недоступен, может быть дорогим (эквайринг), может не иметь нужных edge-кейсов (таймаут, 500-я).',
                },
              ],
            },
            {
              id: 'qa-l73-s2',
              title: 'WireMock: стабы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'WireMock: стаб для таймаута',
                  code: `# mappings/payments-error.json
{
  "request": { "method": "POST", "url": "/api/payments" },
  "response": {
    "status": 504,
    "fixedDelayMilliseconds": 5000,
    "jsonBody": {"error": "Gateway Timeout"}
  }
}`,
                },
              ],
            },
            {
              id: 'qa-l73-s3',
              title: 'Проверь себя: когда мокать',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда service virtualization оправдана?',
                options: [
                  { id: 'a', text: 'Всегда — не надо ходить в реальные сервисы' },
                  { id: 'b', text: 'Когда нужно проверить свою логику в изоляции или воспроизвести edge-кейс чужого сервиса' },
                  { id: 'c', text: 'Только для фронтенда' },
                  { id: 'd', text: 'Вместо интеграционных тестов' },
                ],
                correct: ['b'],
                explanation: 'Виртуализация — для изоляции и edge-кейсов. Замена всех тестов моками = «тестируем себя об себя».',
              },
            },
            {
              id: 'qa-l73-s4',
              title: 'Record & Replay',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В WireMock есть режим записи (Record & Replay). Вы пускаете тест на реальный API, WireMock записывает ответы. Потом тест гоняется на моках (Replay). Это удобно, когда реальный API сложный, и писать стабы руками долго.',
                },
              ],
            },
            {
              id: 'qa-l73-s5',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его экосистему',
                pairs: [
                  { left: 'WireMock', right: 'Java / Docker' },
                  { left: 'mountebank', right: 'Node.js' },
                  { left: 'pytest-httpserver', right: 'Python / pytest' },
                  { left: 'MSW', right: 'Frontend (JS)' },
                ],
                explanation:
                  'WireMock — мощный для бэкенда. mountebank — Node.js. pytest-httpserver — встроен в тесты Python. MSW (Mock Service Worker) — для моков в браузере (JS).',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m7 — BDD и коллаборация (2 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m7',
      title: 'BDD и коллаборация',
      lessons: [
        {
          id: 'qa-l75',
          title: 'BDD: язык бизнеса и кода',
          minutes: 25,
          steps: [
            {
              id: 'qa-l75-s1',
              title: 'Given-When-Then',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'BDD (Behavior-Driven Development) — подход, где требования описываются на языке, понятном и бизнесу, и разработчикам. Формат: Given (дано) — When (когда) — Then (тогда).',
                },
                {
                  type: 'code',
                  lang: 'gherkin',
                  caption: 'Сценарий на Gherkin',
                  code: `Feature: Оплата заказа картой
  Scenario: Успешная оплата
    Given в корзине товар за 1000₽
    And у клиента валидная карта
    When он нажимает "Оплатить"
    Then заказ переходит в статус "paid"`,
                },
              ],
            },
            {
              id: 'qa-l75-s2',
              title: 'Проверь себя: BDD',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что главное в BDD — синтаксис Gherkin или обсуждение?',
                options: [
                  { id: 'a', text: 'Синтаксис' },
                  { id: 'b', text: 'Обсуждение (Three Amigos) — BDD начинается с разговора о поведении' },
                  { id: 'c', text: 'Фреймворк' },
                  { id: 'd', text: 'Автотесты' },
                ],
                correct: ['b'],
                explanation: 'BDD — это в первую очередь collaboration (Three Amigos). Gherkin — просто способ зафиксировать договорённости.',
              },
            },
            {
              id: 'qa-l75-s3',
              title: 'Антипаттерны Gherkin',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если в Gherkin появляются технические детали (селекторы, кнопки, API-методы), бизнес перестаёт его понимать. Сценарий должен описывать **бизнес-ценность**, а не клики.',
                },
                {
                  type: 'list',
                  items: [
                    '❌ `When я нажимаю на кнопку с id="submit-btn"`',
                    '✅ `When я подтверждаю заказ`',
                    '❌ `Then в базе данных появляется запись с status=paid`',
                    '✅ `Then заказ считается оплаченным`',
                  ],
                },
              ],
            },
            {
              id: 'qa-l75-s4',
              title: 'Проверь себя: антипаттерн',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой Gherkin-сценарий считается антипаттерном?',
                options: [
                  { id: 'a', text: 'When пользователь вводит логин и пароль' },
                  { id: 'b', text: 'Then система показывает сообщение об успехе' },
                  { id: 'c', text: 'When пользователь кликает по div#header > span.username' },
                  { id: 'd', text: 'Given баланс пользователя равен 0' },
                ],
                correct: ['c'],
                explanation:
                  'Gherkin пишется для бизнеса. CSS-селекторы и XPath — это техническая реализация. Шаги должны описывать бизнес-действия.',
              },
            },
            {
              id: 'qa-l75-s5',
              title: 'Инструменты',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    '**Cucumber**: Классика для Java/JS.',
                    '**pytest-bdd**: Интеграция Gherkin в pytest (Python).',
                    '**Behave**: Альтернатива для Python.',
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'qa-l76',
          title: 'Three Amigos: бизнес, разработчик, QA',
          minutes: 20,
          steps: [
            {
              id: 'qa-l76-s1',
              title: 'Зачем три роли',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Three Amigos — практика, где Product Owner, разработчик и QA собираются на 30 минут перед задачей и обсуждают: «что именно мы делаем, какие edge-кейсы, как поймём, что готово».',
                },
                {
                  type: 'note',
                  text: 'Без Three Amigos: QA узнаёт о задаче, когда она уже готова. С Three Amigos: QA ловит «а что если пользователь отменил оплату?» ещё до первой строчки кода.',
                },
              ],
            },
            {
              id: 'qa-l76-s2',
              title: 'Проверь себя: Three Amigos',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Кто участвует в Three Amigos?',
                options: [
                  { id: 'a', text: 'Три QA-инженера' },
                  { id: 'b', text: 'Product Owner, разработчик, QA' },
                  { id: 'c', text: 'Только разработчики' },
                  { id: 'd', text: 'Только менеджеры' },
                ],
                correct: ['b'],
                explanation: 'Три роли: бизнес (зачем), разработчик (как), QA (как проверить).',
              },
            },
            {
              id: 'qa-l76-s3',
              title: 'Структура встречи',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Встреча длится 30 минут. Сначала бизнес объясняет цель. Затем QA задает вопросы про edge-кейсы и негативные сценарии. Разработчик оценивает техническую сложность. Результат — список Acceptance Criteria.',
                },
              ],
            },
            {
              id: 'qa-l76-s4',
              title: 'Проверь себя: цель',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая главная цель Three Amigos?',
                options: [
                  { id: 'a', text: 'Написать код быстрее' },
                  { id: 'b', text: 'Обнаружить недопонимание в требованиях до начала разработки' },
                  { id: 'c', text: 'Проверить знания QA' },
                  { id: 'd', text: 'Составить график релизов' },
                ],
                correct: ['b'],
                explanation:
                  'Три разные перспективы (бизнес, разработка, тестирование) встречаются вместе, чтобы найти «слепые зоны» в требованиях на самом раннем этапе.',
              },
            },
            {
              id: 'qa-l76-s5',
              title: 'Роль QA',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'QA на этой встрече — адвокат пользователя. Задачи QA:',
                },
                {
                  type: 'list',
                  items: [
                    'Задать вопросы «что если?» (что если упадёт сеть? что если данные невалидны?).',
                    'Предложить негативные сценарии.',
                    'Определить, как мы проверим, что фича работает (Acceptance Criteria).',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m8 — Лидерство и менторство (2 урока)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m8',
      title: 'Лидерство и менторство',
      lessons: [
        {
          id: 'qa-l113',
          title: 'Code Review тестов и документация',
          minutes: 25,
          steps: [
            {
              id: 'qa-l113-s1',
              title: 'Что искать на Code Review',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Senior QA ревьюит тесты не на стиль, а на логику. Плохой тест может быть зеленым, но бесполезным.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Антипаттерны в тестах',
                  code: `# Плохо: всегда зеленый
def test_create_user_bad():
    create_user("test")
    assert True  # Нет проверки!

# Хорошо: Arrange, Act, Assert
def test_create_user_good(db_session):
    email = f"test_{uuid4()}@x.com"
    user_id = create_user(email)
    user = db_session.get(User, user_id)
    assert user.email == email`,
                },
              ],
            },
            {
              id: 'qa-l113-s2',
              title: 'Проверь себя: Code Review',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой главный признак ПЛОХОГО автотеста?',
                options: [
                  { id: 'a', text: 'Написан на Python' },
                  { id: 'b', text: 'Не падает, даже если удалить проверяемый код (нет Assert)' },
                  { id: 'c', text: 'Использует переменные' },
                  { id: 'd', text: 'Находится в отдельном файле' },
                ],
                correct: ['b'],
                explanation: 'Тест должен защищать от регрессий. Если удалить логику, а тест зеленый — это ложное чувство безопасности.',
              },
            },
            {
              id: 'qa-l113-s3',
              title: 'Документация: Time to First PR',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Главная метрика хорошей документации — **Time to First PR**. Сколько времени новый QA-инженер тратит, чтобы поднять окружение и сделать первый осмысленный Pull Request.',
                },
              ],
            },
            {
              id: 'qa-l113-s4',
              title: 'Проверь себя: онбординг',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой главный признак хорошей QA-документации?',
                options: [
                  { id: 'a', text: 'Она очень длинная' },
                  { id: 'b', text: 'Новый человек может запустить тесты и сделать первый PR за 1 день' },
                  { id: 'c', text: 'Она написана на английском' },
                  { id: 'd', text: 'Она в Confluence' },
                ],
                correct: ['b'],
                explanation:
                  'Критерий — «время до первого PR» (Time to first PR). Если новый QA неделю разбирается — документация плохая, даже если она красивая.',
              },
            },
            {
              id: 'qa-l113-s5',
              title: 'Чек-лист ревью',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Есть ли Assert?',
                    'Изолирован ли тест (нет зависимости от других)?',
                    'Понятное ли имя (test_login_wrong_password_returns_401)?',
                    'Нет ли sleep() и хардкода?',
                    'Используются ли фикстуры для данных?',
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'qa-l114',
          title: 'Собеседования: поиск Senior',
          minutes: 20,
          steps: [
            {
              id: 'qa-l114-s1',
              title: 'Кейсы вместо заучивания',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'На интервью Senior QA не спрашивают «Что такое регрессия?». Спрашивают про опыт принятия решений в условиях неопределенности.',
                },
                {
                  type: 'list',
                  items: [
                    '«Расскажите про самый сложный баг в карьере»',
                    '«Как вы внедряли автотесты в команду, которая их не хотела?»',
                    '«Релиз сегодня, а тесты падают. Ваши действия?»',
                    '«Как вы измеряете качество своей работы?»',
                  ],
                },
              ],
            },
            {
              id: 'qa-l114-s2',
              title: 'Проверь себя: интервью',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой вопрос лучше всего отличает Senior QA от Middle?',
                options: [
                  { id: 'a', text: 'Знаете ли вы, что такое POM?' },
                  { id: 'b', text: 'Умеете ли вы писать SQL-запросы?' },
                  { id: 'c', text: 'Как вы убедили Product Manager отложить релиз из-за риска?' },
                  { id: 'd', text: 'Знаете ли вы, как работает Playwright?' },
                ],
                correct: ['c'],
                explanation: 'Вопрос про коммуникацию с бизнесом и защиту качества показывает Senior-уровень.',
              },
            },
            {
              id: 'qa-l114-s3',
              title: 'Оценка soft skills',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Senior QA должен уметь говорить «нет» с аргументацией. Если кандидат на вопрос «Релиз сегодня, тесты падают, что делать?» отвечает «пойду к менеджеру и скажу, что всё плохо» — это Junior. Senior предложит альтернативы: «отключим фичу флагом», «раскатим на 5%», «проверим только критичные пути».',
                },
              ],
            },
            {
              id: 'qa-l114-s4',
              title: 'Проверь себя: soft skills',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что показывает зрелость Senior QA при обсуждении багов с Product Manager?',
                options: [
                  { id: 'a', text: 'Умение настоять на своем любой ценой' },
                  { id: 'b', text: 'Умение объяснить бизнес-риски бага и предложить компромисс (например, Feature Flag)' },
                  { id: 'c', text: 'Умение скрыть баг, чтобы релиз состоялся' },
                  { id: 'd', text: 'Угрозы уволиться' },
                ],
                correct: ['b'],
                explanation:
                  'Senior оперирует категориями бизнеса (деньги, репутация) и предлагает инженерные решения (флаги, canary), а не просто блокирует релиз.',
              },
            },
            {
              id: 'qa-l114-s5',
              title: 'Домашнее задание',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'На собеседовании Senior QA часто дают домашнее задание (написать фреймворк или тесты). Оценивается не только то, что тесты зеленые, но и архитектура (слои, фикстуры, читаемость) и наличие README.',
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m9 — Практикум (1 урок)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m9',
      title: 'Практикум',
      lessons: [
        {
          id: 'qa-l115',
          title: 'Комплексный экзамен',
          minutes: 35,
          steps: [
            {
              id: 'qa-l115-s1',
              title: 'Экономика качества (CoQ)',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Компания тратит $10,000 в месяц на автоматизацию (Appraisal). Но в проде 2 инцидента в месяц по $50,000. Что нужно сделать Senior QA?',
                options: [
                  { id: 'a', text: 'Нанять больше тестировщиков' },
                  { id: 'b', text: 'Увеличить инвестиции в Prevention (Code Review, Threat Modeling)' },
                  { id: 'c', text: 'Отказаться от автотестов' },
                  { id: 'd', text: 'Уволить разработчиков' },
                ],
                correct: ['b'],
                explanation: 'Внешние ошибки (Failure) стоят в 100 раз дороже Prevention. Если инциденты часты, проблемы в архитектуре или процессе.',
              },
            },
            {
              id: 'qa-l115-s2',
              title: 'Математика нагрузки',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Если система держит 500 RPS, а среднее время ответа 0.4 сек, сколько concurrent users в системе?',
                correct: 200,
                explanation: 'L = λ * W = 500 * 0.4 = 200.',
              },
            },
            {
              id: 'qa-l115-s3',
              title: 'Threat Modeling',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая угроза STRIDE описывает ситуацию: «Пользователь изменил price=100 на price=1 в запросе»?',
                options: [
                  { id: 'a', text: 'Spoofing' },
                  { id: 'b', text: 'Tampering' },
                  { id: 'c', text: 'Repudiation' },
                  { id: 'd', text: 'Information Disclosure' },
                ],
                correct: ['b'],
                explanation: 'Tampering — нарушение целостности данных. Подмена цены — классический пример.',
              },
            },
            {
              id: 'qa-l115-s4',
              title: 'Test Data Management',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Для нагрузочного теста на 10 млн пользователей какой подход к данным правильный?',
                options: [
                  { id: 'a', text: 'Дамп реальной БД' },
                  { id: 'b', text: 'Сгенерировать через Faker' },
                  { id: 'c', text: 'Маскированные данные (Masked Data) с сохранением распределения' },
                  { id: 'd', text: 'Умножить результат 100 пользователей' },
                ],
                correct: ['c'],
                explanation: 'Для нагрузки нужны паттерны распределения. Faker даст плоское распределение. Masked Data сохраняет паттерны без утечки PII.',
              },
            },
            {
              id: 'qa-l115-s5',
              title: 'Merge Queue и TIA',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужна Merge Queue?',
                options: [
                  { id: 'a', text: 'Для Code Review' },
                  { id: 'b', text: 'Для тестирования комбинации PR перед слиянием (защита от Semantic Conflicts)' },
                  { id: 'c', text: 'Для мержа без тестов' },
                  { id: 'd', text: 'Для ускорения Docker' },
                ],
                correct: ['b'],
                explanation: 'Merge Queue решает проблему, когда PR по отдельности зеленые, но вместе ломают сборку.',
              },
            },
            {
              id: 'qa-l115-s6',
              title: 'Флаки',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Вы видите, что тест падает в 10% запусков. Какие шаги НЕПРАВИЛЬНЫЕ?',
                options: [
                  { id: 'a', text: 'Обернуть в retry, чтобы CI был зеленым' },
                  { id: 'b', text: 'Удалить тест навсегда' },
                  { id: 'c', text: 'Посмотреть трейс и логи' },
                  { id: 'd', text: 'Пометить как @flaky и вынести в карантин' },
                ],
                correct: ['a', 'b'],
                explanation: 'Retry (a) маскирует баг, удаление (b) снижает покрытие. Правильно — дебажить (c) и изолировать (d).',
              },
            },
            {
              id: 'qa-l115-s7',
              title: 'Sentry',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая метрика в Sentry важнее всего для приоритизации бага?',
                options: [
                  { id: 'a', text: 'Длина стектрейса' },
                  { id: 'b', text: 'Количество затронутых пользователей (Users Affected)' },
                  { id: 'c', text: 'Браузер' },
                  { id: 'd', text: 'IP' },
                ],
                correct: ['b'],
                explanation: 'Если ошибка у 10,000 пользователей — это Critical. Sentry помогает понять масштаб.',
              },
            },
            {
              id: 'qa-l115-s8',
              title: 'Правило 1-10-100',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Сколько примерно стоит баг в проде, если на этапе требований он стоит 1 доллар?',
                options: [
                  { id: 'a', text: '10 долларов' },
                  { id: 'b', text: '100 долларов' },
                  { id: 'c', text: '1000 долларов' },
                  { id: 'd', text: '5 долларов' },
                ],
                correct: ['b'],
                explanation: 'Требования ($1) -> QA ($10) -> Продакшен ($100).',
              },
            },
            {
              id: 'qa-l115-s9',
              title: 'Screenplay',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чем преимущество паттерна Screenplay над классическим Page Object?',
                options: [
                  { id: 'a', text: 'Он быстрее выполняется' },
                  { id: 'b', text: 'Он моделирует бизнес-задачи (Task) и способности (Abilities)' },
                  { id: 'c', text: 'Он работает только с Selenium' },
                  { id: 'd', text: 'Он не требует написания локаторов' },
                ],
                correct: ['b'],
                explanation: 'Screenplay позволяет писать `actor.attempts_to(Login(), Checkout())`. Это ближе к языку бизнеса.',
              },
            },
            {
              id: 'qa-l115-s10',
              title: 'SAST vs DAST',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вы хотите найти SQL-инъекцию в коде до деплоя. Какой инструмент выбрать?',
                options: [
                  { id: 'a', text: 'DAST (OWASP ZAP)' },
                  { id: 'b', text: 'SAST (Semgrep)' },
                  { id: 'c', text: 'SCA (Trivy)' },
                  { id: 'd', text: 'Пентест' },
                ],
                correct: ['b'],
                explanation: 'SAST ищет SQL-инъекции прямо в исходном коде (через Taint Analysis) до деплоя.',
              },
            },
          ],
        },
      ],
    },
  ],
};