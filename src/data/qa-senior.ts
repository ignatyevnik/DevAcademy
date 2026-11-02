import type { Course } from './types';

export const qaSeniorCourse: Course = {
  slug: 'qa-senior',
  title: 'QA Senior',
  subtitle: 'Стратегия, метрики, observability, менторство и качество на уровне процесса',
  description:
    'Курс для тех, кто вырос из автоматизации и хочет влиять на процесс. Разберём тест-стратегию и risk-based подход, DORA-метрики и покрытие vs mutation, архитектуру тестового фреймворка, управление данными и флаки, security и performance на масштабе, quality gates в CI, observability (метрики/логи/трейсы, Sentry), service virtualization, BDD и Three Amigos, Test Impact Analysis. Плюс лидерство: код-ревью тестов, собеседования, документация, менторство. Практикум — комплексный экзамен по всем темам.',
  level: 'Продвинутый',
  tags: ['QA', 'Senior', 'Стратегия', 'Observability', 'Менторство'],
  accent: '#0e9f6e',
  icon: 'qa-senior',
  outcomes: [
    'Строить тест-стратегию по рискам, а не «всё подряд»',
    'Использовать DORA-метрики и понимать, что они говорят о процессе',
    'Проектировать архитектуру тестового фреймворка (слои, данные, фабрики)',
    'Бороться с флакающими тестами системно, а не ретраями',
    'Оценивать security через SAST/DAST/SCA, а нагрузку — через SLO',
    'Настраивать quality gates и политику merge в CI',
    'Читать метрики, логи и трейсы: Grafana, Jaeger, Sentry',
    'Применять BDD и Three Amigos для раннего тестирования',
    'Использовать Test Impact Analysis для ускорения CI',
    'Менторить команду: код-ревью тестов, собеседования, документация',
  ],
  requirements: [
    'Пройдены курсы «QA: основы» и «QA Automation»',
    'Опыт автоматизации тестов (pytest + Playwright)',
    'Понимание CI/CD и базовой observability',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Тест-стратегия и метрики (было qa-m14)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m1',
      title: 'Тест-стратегия и метрики',
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
                  text: `Тест-стратегия — это ответ на вопрос «что и как мы тестируем, чтобы покрыть риски бизнеса». Senior QA не просто пишет тест-кейсы, а определяет приоритеты: где риск потери денег/репутации выше, там и тестируем глубже.`,
                },
                {
                  type: 'list',
                  items: [
                    'Risk-based: оцениваем вероятность сбоя и ущерб. Тестируем то, где «вероятность × ущерб» максимально.',
                    'Shift-left: тестирование начинается на этапе требований (ревью, BDD), а не после кода.',
                    'Shift-right: тестирование в проде (canary, мониторинг, A/B, feature flags).',
                    'Test Pyramid vs Test Trophy: классическая пирамида (много unit, мало e2e) или «трофей» (акцент на интеграционных тестах). Выбор зависит от архитектуры.',
                  ],
                },
                {
                  type: 'note',
                  text: 'На собеседовании Senior: «Как вы выбираете, что автоматизировать в первую очередь?» Ответ — по рискам и частоте регрессий, а не «всё подряд».',
                },
                {
                  type: 'mermaid',
                  caption: 'Из чего состоит тест-стратегия',
                  code: `graph TD
                    Scope["Scope<br/>что тестируем"] --> Risk["Риски<br/>вероятность × ущерб"]
                    Risk --> Approach["Подходы<br/>unit / api / e2e /<br/>нагрузка / security"]
                    Approach --> Env["Окружения<br/>dev → staging → prod"]
                    Env --> Exit["Exit criteria<br/>все P0/P1 закрыты,<br/>smoke зелёный"]
                    Exit --> Release["Релиз"]`
                },
                {
                  type: 'code',
                  lang: 'markdown',
                  caption: 'Шаблон тест-стратегии',
                  code: `# Тест-стратегия: [Название проекта]\n\n## Scope (что тестируем)\n- In scope: оплата, корзина, авторизация\n- Out of scope: админка (тестируется отдельной командой)\n\n## Риски (top-3)\n1. Оплата: деньги, регуляторика — критично\n2. Авторизация: безопасность, доступ к данным\n3. Корзина: конверсия, деньги\n\n## Подходы\n- Unit: 70% (pytest, coverage > 80%)\n- API: 20% (Playwright + requests, все эндпоинты)\n- E2E: 10% (только критичные пути: логин, оплата)\n- Нагрузка: k6, p95 < 500 мс, error < 1%\n- Безопасность: ZAP на staging nightly, SAST на PR\n\n## Окружения\n- dev (моки), staging (реальная БД), prod (canary 5%)\n\n## Exit criteria (когда релизим)\n- Все P0/P1 баги закрыты\n- Smoke на staging зелёный\n- Canary 5% без ошибок 30 минут`,
                },
              ],
            },
            {
              id: 'qa-l56-s2',
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
                  'Shift-left — «сдвиг влево» по временной шкале: тестировать раньше, на этапе требований и дизайна. Дефект в требованиях дешевле исправить, чем в проде. Shift-right — наоборот, тестирование в проде (canary, мониторинг).',
              },
            },
            {
              id: 'qa-l56-s3',
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
                  'Стратегия — про подход и риски (на год-проект). План — про конкретный релиз: кто, когда, что проверяет. Стратегия отвечает «почему именно так», план — «что делаем на этой неделе».',
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
                  type: 'p',
                  text: `DORA (DevOps Research and Assessment) — стандарт измерения эффективности доставки. Senior QA должен знать эти метрики и уметь их улучшать.`,
                },
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
                    MTTR["Failed Deployment Recovery<br/>↓ элита: менее 1 часа"] --> Perf`
                },
                {
                  type: 'note',
                  text: 'Пороги «элита» и «high» — из отчёта DORA 2024. Change Failure Rate 5% — элита, 10% — high, 15% — medium, 64% — low. MTTR переименован в «Failed Deployment Recovery Time» — суть та же (время восстановления после сбоя).',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Инструменты для DORA-метрик',
                  code: `GitHub Insights → метрики репозитория (Lead Time, PR frequency)\nLinearB, Sleuth, Faros AI — специализированные DORA-дашборды\nFour Keys (Google, open-source) — сбор из GitHub/GitLab\nGrafana + Prometheus — кастомные метрики (deploy count, MTTR)\n\nПрактика: раз в спринт смотрим тренд:\n  Deployment Frequency ↑ хорошо\n  Lead Time ↓ хорошо\n  Change Failure Rate ↓ хорошо\n  MTTR ↓ хорошо`,
                },
              ],
            },
            {
              id: 'qa-l57-s2',
              title: 'Проверь себя: DORA',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая DORA-метрика показывает, как быстро мы восстанавливаемся после сбоя?',
                options: [
                  { id: 'a', text: 'Deployment Frequency' },
                  { id: 'b', text: 'Lead Time for Changes' },
                  { id: 'c', text: 'Change Failure Rate' },
                  { id: 'd', text: 'Mean Time to Recover' },
                ],
                correct: ['d'],
                explanation:
                  'MTTR (Mean Time to Recover) — среднее время восстановления. Change Failure Rate — доля сбоев, Deployment Frequency — частота релизов, Lead Time — скорость доставки изменений.',
              },
            },
            {
              id: 'qa-l57-s3',
              title: 'Проверь себя: диагноз по DORA',
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
                  'Высокий CFR + падающая Frequency = релизы «страшно делать». Причины: нет автотестов на регресс, нет feature flags, rollback руками. Нанимать QA — лечить симптом. Senior смотрит на процесс: CI, тесты, безопасность деплоя.',
              },
            },
          ],
        },
        {
          id: 'qa-l58',
          title: 'Метрики покрытия и отчётность',
          minutes: 20,
          steps: [
            {
              id: 'qa-l58-s1',
              title: 'Почему 100% покрытия — миф',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Code coverage (покрытие кода тестами) — полезная метрика, но не цель. 100% покрытия не значит «нет багов» — тесты могут быть пустыми (assert true) или проверять не то. Senior понимает, что важнее покрытие бизнес-сценариев, а не строк кода.`,
                },
                {
                  type: 'list',
                  items: [
                    'Coverage 80% — хороший ориентир, но не догма',
                    'Mutation testing (Stryker, PIT) — проверяет качество тестов, а не количество',
                    'Тест, который не падает при поломке кода — бесполезен',
                    'Отчётность: стейкхолдерам важны риски, а не проценты',
                  ],
                },
                {
                  type: 'note',
                  text: 'Senior QA готовит отчёт, где отвечает на вопросы бизнеса: «Какие риски покрыты?», «Что не тестировали и почему?», «Какие баги нашли и как их приоритизировали?». Проценты — вторичны.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Mutation testing: ловит пустые тесты',
                  code: `# Код\ndef is_adult(age: int) -> bool:\n    return age >= 18\n\n# Тест с 100% coverage и 0% пользы\ndef test_is_adult_bad():\n    is_adult(20)      # вызвали — coverage есть, assert нет\n    assert True       # всегда зелёный\n\n# Mutation testing: mutmut меняет ">=" на ">"\n# Если тест всё равно зелёный — тест плохой\n\n# Хороший тест\ndef test_is_adult_good():\n    assert is_adult(18) is True    # граница\n    assert is_adult(17) is False\n    assert is_adult(100) is True`,
                },
              ],
            },
            {
              id: 'qa-l58-s2',
              title: 'Проверь себя: покрытие',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему 100% code coverage не гарантирует отсутствие багов?',
                options: [
                  { id: 'a', text: 'Покрытие считается только для Python' },
                  { id: 'b', text: 'Тесты могут не проверять логику (пустые assert) или не покрывать граничные случаи' },
                  { id: 'c', text: 'Покрытие всегда врёт' },
                  { id: 'd', text: 'Баги бывают только в проде' },
                ],
                correct: ['b'],
                explanation:
                  'Покрытие показывает, что строка выполнилась, а не что она проверена. Тест с `assert true` даст 100% покрытия и 0 пользы. Mutation testing проверяет качество: если сломать код — упадёт ли тест?',
              },
            },
            {
              id: 'qa-l58-s3',
              title: 'Проверь себя: coverage vs mutation',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Coverage 100%, mutation score 10%. Что это значит?',
                options: [
                  { id: 'a', text: 'Тесты хорошие' },
                  { id: 'b', text: 'Тесты выполняют код, но не проверяют логику — 90% мутаций не ловятся' },
                  { id: 'c', text: 'Ошибка в инструменте' },
                  { id: 'd', text: 'Пора на прод' },
                ],
                correct: ['b'],
                explanation:
                  'Coverage — «код выполнился». Mutation — «тест упал, если сломать код». Если coverage 100%, но mutation 10% — тесты пустые (assert true). Senior смотрит на mutation score, а не на проценты coverage.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Автоматизация на масштабе (было qa-m15)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m2',
      title: 'Автоматизация на масштабе',
      lessons: [
        {
          id: 'qa-l59',
          title: 'Архитектура тестового фреймворка',
          minutes: 30,
          steps: [
            {
              id: 'qa-l59-s1',
              title: 'Слои фреймворка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Хороший фреймворк — это не «папка с тестами». Это слои: тесты (что проверяем), Page Objects / API clients (как взаимодействуем), хелперы (данные, утилиты), конфиги (окружения). Senior проектирует эту структуру, чтобы 1000 тестов оставались поддерживаемыми.`,
                },
                {
                  type: 'mermaid',
                  caption: 'Слои тестового фреймворка',
                  code: `graph TD
                    Tests["tests/<br/>только сценарии и asserts"] --> Pages["pages/<br/>Page Object"]
                    Tests --> API["api_clients/<br/>обёртки над HTTP API"]
                    Tests --> Fix["fixtures/<br/>данные и подготовка"]
                    Tests --> Utils["utils/<br/>хелперы"]
                    Pages --> Base["pages/base.py<br/>BasePage"]
                    Pages --> Config["config/<br/>dev / staging / prod"]
                    API --> Config`
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичная архитектура',
                  code: `tests/            ← только сценарии
  e2e/
  api/
  unit/
pages/            ← Page Object Model
api_clients/      ← обёртки над API
fixtures/         ← тестовые данные, фикстуры
utils/            ← хелперы, генераторы
config/           ← окружения (dev, stage, prod)
conftest.py       ← общие фикстуры pytest`,
                },
                {
                  type: 'note',
                  text: 'Senior QA пишет не только тесты, но и «каркас»: как создаются данные, как мокаются сервисы, как параллелятся тесты. Плохой фреймворк = каждый новый тест пишется 2 дня и падает через неделю.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Скелет фреймворка: conftest.py + Page Object',
                  code: `# conftest.py\nimport pytest\nfrom playwright.sync_api import sync_playwright\nfrom pages.login_page import LoginPage\n\n@pytest.fixture(scope="session")\ndef browser():\n    with sync_playwright() as p:\n        b = p.chromium.launch(headless=True)\n        yield b\n        b.close()\n\n@pytest.fixture\ndef page(browser):\n    ctx = browser.new_context()\n    pg = ctx.new_page()\n    yield pg\n    ctx.close()\n\n@pytest.fixture\ndef login_page(page):\n    return LoginPage(page)\n\n# pages/base.py\nclass BasePage:\n    def __init__(self, page):\n        self.page = page\n\n    def open(self, path):\n        self.page.goto(path)\n        return self\n\n# tests/e2e/test_login.py\ndef test_login_ok(login_page):\n    login_page.open("/login").login("a@x.com", "secret")\n    assert login_page.page.url.endswith("/dashboard")`,
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
                  'Изоляция: тест не знает про CSS-селекторы или URL API. Изменилась кнопка — правим только Page Object. Это главный принцип поддерживаемости на масштабе.',
              },
            },
            {
              id: 'qa-l59-s3',
              title: 'Проверь себя: слои',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте слой и его ответственность',
                pairs: [
                  { left: 'tests/', right: 'Только сценарии и ассерты' },
                  { left: 'pages/', right: 'Локаторы и методы страниц' },
                  { left: 'api_clients/', right: 'Обёртки над HTTP API' },
                  { left: 'fixtures/', right: 'Тестовые данные и подготовка' },
                ],
                explanation:
                  'Тест читается как сценарий: «открыл, залогинился, проверил». Всё остальное — в слоях. Изменилась вёрстка — правим pages/, не тесты. Изменился API — api_clients/.',
              },
            },
          ],
        },
        {
          id: 'qa-l60',
          title: 'Управление тестовыми данными',
          minutes: 25,
          steps: [
            {
              id: 'qa-l60-s1',
              title: 'Генерация, изоляция и очистка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `На масштабе данные — главная боль. Если все тесты используют одного пользователя — они падают при параллельном запуске. Если данные не чистятся — БД растёт, тесты замедляются.`,
                },
                {
                  type: 'list',
                  items: [
                    'Уникальные данные на тест: uuid, timestamp в email/логине',
                    'Фабрики данных (Factory Boy, Faker) вместо хардкода',
                    'API-подготовка данных (быстрее, чем через UI)',
                    'Очистка: teardown фикстуры или «эфемерные» БД (Testcontainers)',
                    'Анонимизация прод-данных для staging (GDPR!)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Testcontainers — поднять реальную БД в Docker на время теста. Senior использует их, чтобы тесты не зависели от «загрязнённого» staging.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Factory Boy + Faker: генерация данных',
                  code: `import factory\nfrom faker import Faker\nfrom myapp.models import User\n\nfake = Faker("ru_RU")\n\nclass UserFactory(factory.Factory):\n    class Meta:\n        model = User\n\n    # Уникальный email на каждый вызов — нет коллизий\n    email = factory.Sequence(lambda n: f"user{n}_{fake.uuid4()[:8]}@test.com")\n    name = factory.LazyFunction(lambda: fake.name())\n    age = factory.LazyFunction(lambda: fake.random_int(min=18, max=80))\n    is_active = True\n\n# Использование в тестах\nuser = UserFactory()                     # уникальные данные\ndmin = UserFactory(is_active=False)      # override поля\nbatch = UserFactory.create_batch(50)     # 50 уникальных пользователей\n\n# С реальным API\nuser = UserFactory()\nresponse = requests.post("/api/users", json=user.to_dict())\nassert response.status_code == 201`,
                },
              ],
            },
            {
              id: 'qa-l60-s2',
              title: 'Проверь себя: данные',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие подходы помогают изолировать тестовые данные?',
                options: [
                  { id: 'a', text: 'Уникальные email с uuid на каждый тест' },
                  { id: 'b', text: 'Testcontainers с чистой БД' },
                  { id: 'c', text: 'Один общий тестовый пользователь для всех' },
                  { id: 'd', text: 'Teardown-фикстуры, удаляющие созданные данные' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Один общий пользователь (c) — источник race condition при параллельных тестах. Уникальные данные, Testcontainers и teardown — три кита изоляции.',
              },
            },
            {
              id: 'qa-l60-s3',
              title: 'Проверь себя: фабрики',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в Factory Boy используется `Sequence` или `uuid` для email?',
                options: [
                  { id: 'a', text: 'Для красоты' },
                  { id: 'b', text: 'Чтобы каждый тест получил уникальные данные — нет коллизий при параллельном запуске' },
                  { id: 'c', text: 'Это требование Faker' },
                  { id: 'd', text: 'Для безопасности' },
                ],
                correct: ['b'],
                explanation:
                  'Хардкод «test@x.com» в 100 тестах при параллельном запуске → race condition. Sequence/uuid гарантирует уникальность: каждый тест создаёт своего пользователя, ни с кем не пересекается.',
              },
            },
          ],
        },
        {
          id: 'qa-l61',
          title: 'Флакающие тесты',
          minutes: 25,
          steps: [
            {
              id: 'qa-l61-s1',
              title: 'Почему тесты падают «через раз»',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Флакающий тест — тот, что падает без изменений в коде. Причины: гонки (race condition), тайминги, зависимость от порядка, общие данные, сеть. На масштабе 10% флаков убивают доверие к CI.`,
                },
                {
                  type: 'list',
                  items: [
                    'Карантин: пометить как flaky и вынести из основного пайплайна',
                    'Ретраи: временное решение (pytest-rerunfailures), не лечение',
                    'Поиск корня: логи, трейсы (Playwright trace), повтор 100 раз',
                    'Стабильность: auto-waiting вместо sleep, уникальные данные, изоляция',
                  ],
                },
                {
                  type: 'note',
                  text: 'Senior не игнорирует флаки. Метрика: «flaky rate» (доля нестабильных тестов). Хорошая команда держит < 2%.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как дебажить флак',
                  code: `# 1. Воспроизвести локально (только упавшие в прошлый раз)\npytest --lf -x\n\n# 2. Прогнать 100 раз — 1 из 100 упадёт\npip install pytest-repeat\npytest tests/test_flaky.py --count=100 -x\n\n# 3. Сохранить trace (Playwright)\npytest --tracing=retain-on-failure\nplaywright show-trace test-results/.../trace.zip\n\n# 4. Изолировать: запустить один, без параллели\npytest tests/test_flaky.py -p no:xdist\n\n# 5. Запустить в цикле с логами\necho "while pytest tests/test_x.py; do :; done" > run.sh`,
                },
              ],
            },
            {
              id: 'qa-l61-s2',
              title: 'Проверь себя: флаки',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая самая частая причина флакающих тестов?',
                options: [
                  { id: 'a', text: 'Медленный интернет' },
                  { id: 'b', text: 'Гонки и общие данные между тестами (race condition)' },
                  { id: 'c', text: 'Плохой синтаксис Python' },
                  { id: 'd', text: 'Мало памяти' },
                ],
                correct: ['b'],
                explanation:
                  'При параллельном запуске или общем стейте (один пользователь, одна запись в БД) тесты мешают друг другу. Лечение — уникальные данные и изоляция.',
              },
            },
            {
              id: 'qa-l61-s3',
              title: 'Проверь себя: дебаг флака',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Тест падает 1 из 10. Какие первые шаги по дебагу?',
                options: [
                  { id: 'a', text: 'Воспроизвести локально через pytest --lf' },
                  { id: 'b', text: 'Прогнать 100 раз с pytest-repeat' },
                  { id: 'c', text: 'Сразу добавить retry в CI' },
                  { id: 'd', text: 'Собрать trace/screenshot с падения' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Retry (c) — не дебаг, а маскировка. Сначала воспроизвести, прогнать много раз, собрать trace. Найти корень (race, таймаут, данные) — только потом решать, ретрай или фикс.',
              },
            },
          ],
        },
        {
          id: 'qa-l62',
          title: 'Контрактное и визуальное тестирование',
          minutes: 25,
          steps: [
            {
              id: 'qa-l62-s1',
              title: 'Pact и визуальные регрессии',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Контрактное тестирование (Pact) проверяет, что клиент и сервер «договорились» о формате данных. Клиент генерирует контракт, сервер его валидирует. Если сервер сломает API — CI упадёт до релиза.`,
                },
                {
                  type: 'p',
                  text: `Визуальное тестирование (Percy, Applitools, Playwright screenshots) ловит регрессии вёрстки, которые не видит DOM: сдвиг кнопки, неверный цвет, наложение текста.`,
                },
                {
                  type: 'note',
                  text: 'На собеседовании Senior: «Как тестируете микросервисы?» — контрактные тесты (Pact) вместо полного E2E, чтобы не поднимать весь кластер для каждого теста.',
                },
              ],
            },
            {
              id: 'qa-l62-s2',
              title: 'Проверь себя: контракты',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что проверяет контрактное тестирование (Pact)?',
                options: [
                  { id: 'a', text: 'Скорость ответа сервера' },
                  { id: 'b', text: 'Соответствие формата API ожиданиям клиента (схема, поля)' },
                  { id: 'c', text: 'Визуальную вёрстку' },
                  { id: 'd', text: 'Безопасность' },
                ],
                correct: ['b'],
                explanation:
                  'Pact проверяет контракт: клиент ожидает поля A, B, C. Если сервер убирает B — контракт нарушен, CI падает. Это дешевле и быстрее, чем поднимать весь E2E.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Security и Performance на Senior-уровне (было qa-m16)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m3',
      title: 'Security и Performance на Senior-уровне',
      lessons: [
        {
          id: 'qa-l63',
          title: 'SAST, DAST, SCA: уровни безопасности',
          minutes: 25,
          steps: [
            {
              id: 'qa-l63-s1',
              title: 'Три подхода к security testing',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Виды security-тестов',
                  head: ['Тип', 'Что проверяет', 'Инструменты'],
                  rows: [
                    ['SAST (Static)', 'Код без запуска — ищет уязвимости в исходниках', 'SonarQube, Semgrep, CodeQL'],
                    ['DAST (Dynamic)', 'Запущенное приложение — как чёрный ящик', 'OWASP ZAP, Burp Suite'],
                    ['SCA (Composition)', 'Зависимости на известные CVE', 'Dependabot, Snyk, Trivy'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'SAST, DAST, SCA — три уровня проверки',
                  code: `graph LR
                    Code["Исходный код"] -->|"SAST"| SAST["SonarQube, Semgrep<br/>уязвимости в коде"]
                    App["Запущенное<br/>приложение"] -->|"DAST"| DAST["ZAP, Burp<br/>уязвимости в рантайме"]
                    Deps["Зависимости<br/>requirements, package.json"] -->|"SCA"| SCA["Dependabot, Snyk<br/>CVE в библиотеках"]
                    SAST --> PR["Проверки в CI<br/>(на каждый PR)"]
                    SCA --> PR
                    DAST --> Nightly["DAST nightly<br/>(на staging)"]`
                },
                {
                  type: 'note',
                  text: 'Senior QA встраивает все три в CI: SAST и SCA — на каждый PR, DAST — на staging nightly. Это не замена ручному пентесту, а первый барьер.',
                },
              ],
            },
            {
              id: 'qa-l63-s2',
              title: 'Проверь себя: SAST vs DAST',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип и инструмент',
                pairs: [
                  { left: 'SAST', right: 'Semgrep, SonarQube' },
                  { left: 'DAST', right: 'OWASP ZAP, Burp' },
                  { left: 'SCA', right: 'Dependabot, Snyk' },
                  { left: 'Ручной пентест', right: 'Burp Suite с экспертизой' },
                ],
                explanation:
                  'SAST — анализ кода. DAST — сканирование приложения. SCA — проверка зависимостей. Пентест — ручной поиск сложных логических уязвимостей.',
              },
            },
          ],
        },
        {
          id: 'qa-l64',
          title: 'Нагрузочное тестирование на масштабе',
          minutes: 30,
          steps: [
            {
              id: 'qa-l64-s1',
              title: 'Распределённая нагрузка и SLO',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Когда один load-generator не справляется — используют распределённую нагрузку (k6 distributed, Locust master/worker, JMeter distributed). Senior проектирует тест так, чтобы метрики отражали реальные SLO.`,
                },
                {
                  type: 'list',
                  items: [
                    'SLO (Service Level Objective): p95 < 500 мс, error rate < 1%',
                    'Ramp-up: плавный вход, чтобы не словить ложный спайк',
                    'Soak test: 8–24 часа под нагрузкой — ловит утечки',
                    'Тест на 1%: можно ли увеличить нагрузку, не меняя систему',
                  ],
                },
                {
                  type: 'note',
                  text: 'Senior связывает нагрузочные тесты с бизнес-метриками: «выдержит ли система Чёрную пятницу». Не просто «RPS вырос», а «при 10x трафика заказы проходят без ошибок».',
                },
              ],
            },
            {
              id: 'qa-l64-s2',
              title: 'Проверь себя: SLO',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое SLO в нагрузочном тестировании?',
                options: [
                  { id: 'a', text: 'Максимальное количество запросов' },
                  { id: 'b', text: 'Численный целевой уровень: например, p95 latency < 500 мс' },
                  { id: 'c', text: 'Тип базы данных' },
                  { id: 'd', text: 'Скрипт Locust' },
                ],
                correct: ['b'],
                explanation:
                  'SLO (Service Level Objective) — измеримая цель: «95% запросов быстрее 500 мс», «ошибок не более 1%». Без SLO нагрузочный тест превращается в «красивый график».',
              },
            },
          ],
        },
        {
          id: 'qa-l65',
          title: 'Chaos Engineering',
          minutes: 20,
          steps: [
            {
              id: 'qa-l65-s1',
              title: 'Ломаем систему специально',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Chaos Engineering — намеренное внесение сбоев (отключение узла, задержка сети, падение БД), чтобы проверить, как система восстанавливается. Netflix Chaos Monkey — родоначальник.`,
                },
                {
                  type: 'list',
                  items: [
                    'Гипотеза: «если убьём один под, сервис продолжит работать»',
                    'Эксперимент: в контролируемой среде (staging) убиваем под',
                    'Наблюдение: проверяем, восстановилось ли (SLO не нарушены)',
                    'Инструменты: Chaos Mesh, LitmusChaos, Gremlin',
                  ],
                },
                {
                  type: 'note',
                  text: 'Senior QA вместе с SRE внедряет Chaos Engineering как регулярную практику (game days). Это ловит проблемы отказоустойчивости, которые не видны в обычных тестах.',
                },
              ],
            },
            {
              id: 'qa-l65-s2',
              title: 'Проверь себя: chaos',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое Chaos Engineering?',
                options: [
                  { id: 'a', text: 'Автоматическое исправление багов' },
                  { id: 'b', text: 'Намеренное внесение сбоев для проверки отказоустойчивости' },
                  { id: 'c', text: 'Хаотичное тестирование без плана' },
                  { id: 'd', text: 'Тип нагрузки' },
                ],
                correct: ['b'],
                explanation:
                  'Chaos Engineering — управляемый эксперимент: «что будет, если упадёт БД?». Проверяем не наличие бага, а способность системы восстановиться. Ключевое слово — «управляемый», а не хаос.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Лидерство и менторство (было qa-m17)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m4',
      title: 'Лидерство и менторство',
      lessons: [
        {
          id: 'qa-l66',
          title: 'Code review тестов и менторство',
          minutes: 25,
          steps: [
            {
              id: 'qa-l66-s1',
              title: 'Как ревьюить тесты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Senior QA ревьюит не только код продукта, но и тесты. Хороший тест — читаемый, независимый, падает при поломке. Плохой — «зелёный всегда» или «падает иногда».`,
                },
                {
                  type: 'list',
                  items: [
                    'Проверяем: есть ли assert? Упадёт ли тест, если сломать код?',
                    'Проверяем: изолирован ли? Не зависит от других тестов?',
                    'Проверяем: понятно ли, что тест проверяет (имя, структура)',
                    'Проверяем: нет ли sleep, хардкода, гонок',
                    'Не придирайтесь к стилю — для этого линтер. Фокус на логике.',
                  ],
                },
                {
                  type: 'note',
                  text: 'Менторство: не «сделай так», а «почему ты выбрал этот подход?». Senior развивает команду, а не пишет всё сам.',
                },
              ],
            },
            {
              id: 'qa-l66-s2',
              title: 'Проверь себя: ревью',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что важно проверять при code review автотеста?',
                options: [
                  { id: 'a', text: 'Есть ли assert' },
                  { id: 'b', text: 'Изолирован ли тест от других' },
                  { id: 'c', text: 'Используется ли пробел вместо таба' },
                  { id: 'd', text: 'Упадёт ли тест, если сломать код' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Assert, изоляция и «тест ловит баг» — суть. Стиль (пробелы, скобки) — задача линтера (ruff, flake8), не ревьюера.',
              },
            },
          ],
        },
        {
          id: 'qa-l67',
          title: 'Собеседования QA: как искать Senior',
          minutes: 25,
          steps: [
            {
              id: 'qa-l67-s1',
              title: 'Что спрашивать на интервью',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Senior QA ищет не «человека с 10 годами опыта», а того, кто умеет принимать решения в условиях неопределённости. На собеседовании важны кейсы, а не заученные термины.`,
                },
                {
                  type: 'list',
                  items: [
                    'Кейс: «Прод упал, что делаешь?» (диагностика, коммуникация, rollback)',
                    'Кейс: «Нужно протестировать за 2 дня, что делаешь?» (риски, приоритизация)',
                    'Кейс: «Как убедить PM, что баг критичен?» (аргументация, бизнес-эффект)',
                    'Вопрос: «Какую метрику улучшил на прошлом месте?» (DORA, flaky rate)',
                    'Вопрос: «Как обучал джунов?» (менторство, документация)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Плохой вопрос: «Что такое эквивалентное разбиение?» — это знает джун. Хороший: «Приведи пример, когда пришлось идти на компромисс с качеством. Почему?».',
                },
              ],
            },
            {
              id: 'qa-l67-s2',
              title: 'Проверь себя: интервью',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой вопрос лучше всего проверяет Senior QA?',
                options: [
                  { id: 'a', text: 'Что такое граничные значения?' },
                  { id: 'b', text: 'Как вы приоритизируете тестирование, когда времени мало?' },
                  { id: 'c', text: 'Какие методы HTTP знаете?' },
                  { id: 'd', text: 'Что такое pytest?' },
                ],
                correct: ['b'],
                explanation:
                  'Вопрос про приоритизацию и компромиссы — про реальный опыт. Остальные — базовые знания джуна.',
              },
            },
          ],
        },
        {
          id: 'qa-l68',
          title: 'Документация и онбординг',
          minutes: 20,
          steps: [
            {
              id: 'qa-l68-s1',
              title: 'Тест-документация, которая работает',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Senior QA отвечает за то, чтобы новые люди быстро включались. Документация — не «ради галочки», а инструмент: как запускать тесты, какие окружения, где данные, кому писать при падении.`,
                },
                {
                  type: 'list',
                  items: [
                    'README для QA: как запустить, как читать отчёт, где конфиги',
                    'Чек-листы для релиза (smoke, security, a11y)',
                    'Confluence/Notion: описание архитектуры тестов',
                    'Onboarding-план: что прочитать, что попробовать в первую неделю',
                  ],
                },
                {
                  type: 'note',
                  text: 'Хорошая документация = новый QA запускает тесты и делает первый PR за 1 день. Плохая = «спроси у Пети, он знает». Senior делает так, чтобы Петя не был единственной точкой отказа.',
                },
              ],
            },
            {
              id: 'qa-l68-s2',
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
                  'Критерий — «время до первого PR» (Time to first PR). Если новый QA неделю разбирается — документация плохая, даже если она красивая и длинная.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Quality Gates и CI-политика (было qa-m18)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m5',
      title: 'Quality Gates и CI-политика',
      lessons: [
        {
          id: 'qa-l69',
          title: 'Что блокирует merge, а что — предупреждает',
          minutes: 25,
          steps: [
            {
              id: 'qa-l69-s1',
              title: 'Required checks vs advisory',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Quality Gate — правило в CI, которое не даёт слить PR, если что-то не прошло. Senior QA решает, какие проверки блокирующие (нельзя мержить), а какие — только информационные. Слишком строгие — команда обходит; слишком мягкие — регрессии в проде.`,
                },
                {
                  type: 'table',
                  caption: 'Типичные проверки и их статус',
                  head: ['Проверка', 'Блокирует?', 'Почему'],
                  rows: [
                    ['Lint (ruff, eslint)', 'Да', 'Стиль легко исправить, дёшево'],
                    ['Type check (mypy)', 'Да', 'Ошибки типов = баги'],
                    ['Unit-тесты', 'Да', '2 минуты, ловят 80% регрессий'],
                    ['Coverage < 80%', 'Иногда', 'Зависит от команды; часто advisory'],
                    ['E2E (Playwright)', 'Да, если < 10 мин', 'Медленные — можно в nightly'],
                    ['Load test', 'Нет', 'Только nightly / перед релизом'],
                    ['SAST (SonarQube)', 'High/Critical — да', 'Low — advisory'],
                    ['A11y (axe)', 'Warning', 'Часто технический долг'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Что блокирует merge, а что нет',
                  code: `graph TD
                    PR["Pull Request"] --> Lint["lint<br/>ruff, eslint"]
                    PR --> Types["typecheck<br/>mypy"]
                    PR --> Unit["unit tests<br/>pytest"]
                    PR --> E2E["E2E smoke<br/>5–10 сценариев"]
                    Lint --> All{"Все checks<br/>зелёные?"}
                    Types --> All
                    Unit --> All
                    E2E --> All
                    All -->|"Да"| Merge["Merge в main"]
                    All -->|"Нет"| Fix["Fix + push<br/>новая итерация"]`
                },
                {
                  type: 'note',
                  text: 'Правило: блокирующих проверок должно быть 3–5. Если 15 — команда начнёт искать обходные пути (--no-verify, merge без CI). Каждая блокирующая проверка должна быть быстрой (< 5 мин) и иметь понятное сообщение об ошибке.',
                },
              ],
            },
            {
              id: 'qa-l69-s2',
              title: 'Branch protection и required checks',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'GitHub: Branch protection для main',
                  code: `Settings → Branches → Add rule → "main"\n\n✓ Require a pull request before merging (1–2 approvals)\n✓ Require status checks to pass before merging\n    - lint\n    - typecheck\n    - test (3.12)\n    - e2e-smoke\n✓ Require branches to be up to date before merging\n✓ Require conversation resolution\n✓ Do not allow bypassing the above settings (для админов тоже)\n\n✗ Require signed commits (опционально)`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/ci.yml — required checks',
                  code: `name: CI\non: [pull_request]\n\njobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install ruff && ruff check .\n\n  typecheck:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install mypy && mypy src/\n\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python: ['3.11', '3.12']\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: '\${{ matrix.python }}' }\n      - run: pip install -r requirements-dev.txt\n      - run: pytest -q --junitxml=report.xml --cov=src --cov-fail-under=80\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: reports-\${{ matrix.python }}\n          path: report.xml`,
                },
                {
                  type: 'note',
                  text: '--cov-fail-under=80 в pytest = блокирующая проверка на coverage. Если упадёт ниже 80% — PR не смержится. Работает, если команда согласна с порогом. Иначе — advisory (без fail-under), смотрят в отчёте.',
                },
              ],
            },
            {
              id: 'qa-l69-s3',
              title: 'Проверь себя: gates',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Сколько блокирующих проверок оптимально в CI для PR?',
                options: [
                  { id: 'a', text: '1 — только unit-тесты' },
                  { id: 'b', text: '3–5 быстрых проверок (lint, typecheck, unit, e2e-smoke)' },
                  { id: 'c', text: '15 — чем больше, тем лучше' },
                  { id: 'd', text: 'Не важно' },
                ],
                correct: ['b'],
                explanation:
                  '3–5 быстрых проверок — золотая середина. Если больше 5–7 блокирующих — CI идёт > 15 минут, команда ищет обходные пути. Остальное (нагрузка, security-скан, a11y) — nightly или перед релизом.',
              },
            },
            {
              id: 'qa-l69-s4',
              title: 'Проверь себя: what blocks',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что стоит сделать блокирующим (required check) в PR?',
                options: [
                  { id: 'a', text: 'Lint и typecheck' },
                  { id: 'b', text: 'Unit-тесты' },
                  { id: 'c', text: 'Полный нагрузочный тест на 30 минут' },
                  { id: 'd', text: 'E2E smoke (5–10 критичных сценариев)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Lint, typecheck, unit, e2e-smoke — быстрые и ловят 90% регрессий. Полный нагрузочный тест (30 мин) — только nightly: он не должен блокировать PR, иначе CI станет невыносимым.',
              },
            },
          ],
        },
        {
          id: 'qa-l70',
          title: 'Исключения и hotfix',
          minutes: 20,
          steps: [
            {
              id: 'qa-l70-s1',
              title: 'Когда gate можно обойти',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Иногда нужно срочно выкатить hotfix, а CI падает из-за флака или несвязанной проблемы. Senior QA заранее продумывает процедуру «аварийного обхода», а не импровизирует в 3 часа ночи.`,
                },
                {
                  type: 'list',
                  items: [
                    'Отдельный label: hotfix — CI автоматически применяет урезанный набор (только smoke)',
                    'Явный approve от tech lead + QA lead в PR',
                    'Обязательный post-mortem после hotfix: почему срочно, что сломалось',
                    'Не более N hotfix в месяц — иначе процесс надо менять',
                    'Skip CI только через override в настройках branch protection (не через --no-verify)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Anti-pattern: разрешить админам мержить без CI. Однажды это приведёт к «пятничному релизу без тестов». Лучше — явная процедура с ограничениями и последующим разбором.',
                },
              ],
            },
            {
              id: 'qa-l70-s2',
              title: 'Проверь себя: hotfix',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что должно быть в процедуре hotfix?',
                options: [
                  { id: 'a', text: 'Просто мерж без CI — доверяем разработчику' },
                  { id: 'b', text: 'Минимальный набор проверок (smoke), явный approve, post-mortem после' },
                  { id: 'c', text: 'Запуск полного CI на 40 минут' },
                  { id: 'd', text: 'Ничего — hotfix не нужен' },
                ],
                correct: ['b'],
                explanation:
                  'Hotfix-процедура: снижаем строгость, но не до нуля. Smoke-тесты (5 минут) + approve от двух лидов + разбор после. Полный CI в hotfix — противоречие: он уже прошёл на основной ветке. Ноль проверок — путь к инцидентам.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m6 — Observability для QA (было qa-m19)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m6',
      title: 'Observability для QA',
      lessons: [
        {
          id: 'qa-l71',
          title: 'Метрики, логи, трейсы',
          minutes: 25,
          steps: [
            {
              id: 'qa-l71-s1',
              title: 'Три столпа observability',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три столпа observability',
                  head: ['Столп', 'Что', 'Инструменты', 'Зачем QA'],
                  rows: [
                    ['Метрики', 'Числа во времени (RPS, latency, error rate)', 'Prometheus + Grafana', 'Увидеть проблему до баг-репорта'],
                    ['Логи', 'Структурированные события', 'Loki, Elasticsearch', 'Разобрать конкретный запрос'],
                    ['Трейсы', 'Путь запроса через все сервисы', 'Jaeger, Tempo, OTEL', 'Найти, в каком сервисе деградация'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Observability: метрики, логи, трейсы и куда они попадают',
                  code: `graph LR
                    App["Приложение"]
                    App --> M["Метрики<br/>RPS, latency, errors"]
                    App --> L["Логи<br/>события с контекстом"]
                    App --> T["Трейсы<br/>путь запроса"]
                    M --> Prom[("Prometheus")]
                    L --> Loki[("Loki / ELK")]
                    T --> Jaeger[("Jaeger / Tempo")]
                    Prom --> G["Grafana"]
                    Loki --> G
                    Jaeger --> G
                    G --> QA["QA видит проблему<br/>до жалоб пользователей"]`
                },
                {
                  type: 'p',
                  text: `Для QA это не «DevOps-штуки», а рабочий инструмент. Проверяя API, вы можете зайти в Grafana и убедиться, что p95 latency реально в норме. Или найти в Jaeger трейс того самого «медленного» запроса.`,
                },
                {
                  type: 'note',
                  text: 'Senior QA умеет сам открыть Grafana, Jaeger или Sentry и ответить на вопрос «что сломалось». Не «передаю разработчику, он смотрит», а «вот трейс, вот ошибка, вот сервис». Это отделяет Senior от Middle.',
                },
              ],
            },
            {
              id: 'qa-l71-s2',
              title: 'Grafana: что смотреть',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что QA смотрит в Grafana',
                  code: `RED (для каждого сервиса):\n  Rate — сколько запросов в секунду\n  Errors — доля 5xx\n  Duration — p50, p95, p99\n\nUSE (для инфраструктуры):\n  Utilization — % загрузки CPU/RAM\n  Saturation — очередь, throttling\n  Errors — OOM, перезапуски\n\nБизнес-метрики:\n  Заказы/мин, регистрации/час, платежи\n  «Сломалось» видно за 1 минуту — до жалоб пользователей`,
                },
                {
                  type: 'note',
                  text: 'Если в Grafana p95 latency вырос с 200 до 800 мс — вы это видите раньше, чем пользователи. Задача QA — заметить и открыть баг-репорт с данными из дашборда, а не «на сайте всё медленно».',
                },
              ],
            },
            {
              id: 'qa-l71-s3',
              title: 'Проверь себя: три столпа',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте столп observability и его назначение',
                pairs: [
                  { left: 'Метрики', right: 'Числа во времени: RPS, latency, errors' },
                  { left: 'Логи', right: 'Конкретные события с контекстом' },
                  { left: 'Трейсы', right: 'Путь запроса через сервисы' },
                  { left: 'Grafana', right: 'Визуализация метрик' },
                ],
                explanation:
                  'Метрики — «что происходит» (числом). Логи — «что сказал сервис» (текст). Трейсы — «где именно тормозит» (путь). Grafana — дашборд поверх метрик.',
              },
            },
          ],
        },
        {
          id: 'qa-l72',
          title: 'Трейсинг и Sentry на практике',
          minutes: 25,
          steps: [
            {
              id: 'qa-l72-s1',
              title: 'Распределённый трейс',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Трейс — это дерево span-ов: один запрос пользователя проходит через API Gateway → Auth → Order → Payment → DB. Если payment тормозит 500 мс, вы это видите в трейсе — а не гадаете.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что видно в Jaeger/Tempo',
                  code: `Трейс запроса POST /api/orders (total 1.2 сек)\n├── [20 мс] API Gateway\n├── [10 мс] Auth Service\n├── [50 мс] Order Service\n│   ├── [10 мс] validate\n│   └── [30 мс] save to DB\n└── [1100 мс] Payment Service   ← вот тут плохо\n    ├── [10 мс] validate card\n    └── [1080 мс] call external PSP   ← внешний провайдер\n\nВывод: тормозит внешний платёжный провайдер. Не наш код.`,
                },
                {
                  type: 'note',
                  text: 'Стандарт — OpenTelemetry (OTEL). Инструментирует всё автоматически (HTTP, gRPC, БД). Отправляет в Jaeger, Tempo, Datadog. QA-задача: открыть трейс, найти самый долгий span, приложить к баг-репорту.',
                },
              ],
            },
            {
              id: 'qa-l72-s2',
              title: 'Sentry: ошибки в проде',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Sentry ловит ошибки в проде с контекстом: stack trace, браузер, user_id, action',
                    'Группирует по «issue» — одна и та же ошибка = один issue, а не тысячи',
                    'Показывает: сколько пользователей затронуто, в каком релизе появилось',
                    'Интеграция с Git: видно коммит, который внёс ошибку',
                    'Alert rules: «> 10 ошибок за 5 минут — пейдж дежурному»',
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Sentry в Python',
                  code: `import sentry_sdk\nfrom sentry_sdk.integrations.fastapi import FastApiIntegration\n\nsentry_sdk.init(\n    dsn="https://...",\n    integrations=[FastApiIntegration()],\n    traces_sample_rate=0.1,    # 10% запросов — с трейсами\n    environment="production",\n)\n\n# Теперь любая необработанная ошибка попадёт в Sentry\n# с контекстом: URL, user, headers, request body (если разрешено)`,
                },
                {
                  type: 'note',
                  text: 'QA читает Sentry так же, как bug tracker. «Ошибка 500 у 200 пользователей за час» — это баг-репорт, уже с stack trace. Не надо спрашивать «а что вы делали?». Senior начинает разбор с Sentry, а не с «попробуйте ещё раз».',
                },
              ],
            },
            {
              id: 'qa-l72-s3',
              title: 'Проверь себя: трейсинг',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В трейсе самый долгий span — «call external payment provider». Что делать?',
                options: [
                  { id: 'a', text: 'Сказать «наш код тормозит»' },
                  { id: 'b', text: 'Открыть баг: деградация внешнего провайдера, приложить трейс, обсудить таймауты и fallback' },
                  { id: 'c', text: 'Увеличить таймаут' },
                  { id: 'd', text: 'Игнорировать — это не наш сервис' },
                ],
                correct: ['b'],
                explanation:
                  'Трейс показывает: проблема во внешнем PSP. Задача QA — не «найти виноватого», а зафиксировать факт: баг-репорт с трейсом, вопрос к команде «какие таймауты и fallback?». Это не «не наш сервис», это «наш риск в проде».',
              },
            },
            {
              id: 'qa-l72-s4',
              title: 'Проверь себя: Sentry',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что даёт Sentry QA-инженеру?',
                options: [
                  { id: 'a', text: 'Stack trace и контекст ошибки' },
                  { id: 'b', text: 'Сколько пользователей затронуто' },
                  { id: 'c', text: 'Автоматически исправляет баги' },
                  { id: 'd', text: 'В каком релизе появилась ошибка' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Sentry даёт stack trace, затронутых пользователей и релиз, в котором появилась ошибка. Он не исправляет баги — это делает разработчик. Но баг-репорт становится в 5 раз точнее.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m7 — Service Virtualization (было qa-m20)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m7',
      title: 'Service Virtualization',
      lessons: [
        {
          id: 'qa-l73',
          title: 'Зачем мокать сервисы',
          minutes: 20,
          steps: [
            {
              id: 'qa-l73-s1',
              title: 'Проблема реальных зависимостей',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Микросервисное приложение зависит от десятка сервисов: платежи, доставка, уведомления, склад. Для тестов нужно, чтобы все они работали. Но: чужой сервис может быть недоступен, может быть дорогим (реальный эквайринг), может не иметь нужных edge-кейсов (таймаут, 500-я ошибка, отказ банка).`,
                },
                {
                  type: 'table',
                  caption: 'Когда service virtualization оправдана',
                  head: ['Ситуация', 'Реальный сервис', 'Виртуализация'],
                  rows: [
                    ['Сервис недоступен на staging', '❌', '✅'],
                    ['Платёжный шлюз (деньги)', 'Дорого', '✅ фейк'],
                    ['Нужен edge-кейс (timeout, 500)', 'Сложно воспроизвести', '✅ 1 строкой'],
                    ['Сервис в разработке', '❌', '✅'],
                    ['Интеграционный тест в CI', 'Медленно', '✅ быстро'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Service virtualization — не «замена интеграционным тестам». Это инструмент для тестирования в изоляции: когда нужно проверить свою логику, а не чужой сервис. Интеграция с реальным сервисом — отдельный набор тестов (staging, e2e).',
                },
              ],
            },
            {
              id: 'qa-l73-s2',
              title: 'WireMock и mountebank',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Инструменты',
                  head: ['Инструмент', 'Язык', 'Плюсы'],
                  rows: [
                    ['WireMock', 'Java, standalone', 'Мощный, много интеграций, запись трафика'],
                    ['mountebank', 'Node.js', 'Лёгкий, простой синтаксис'],
                    ['Prism', 'Node.js', 'По OpenAPI-спеке генерирует моки'],
                    ['pytest-httpserver', 'Python', 'Встроен в pytest, для unit/integration'],
                    ['MSW (Mock Service Worker)', 'JavaScript', 'Для фронтенда, перехватывает fetch'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Выбор — по стеку. Python-проекты: pytest-httpserver (быстро, без отдельного сервиса). Команда с Java/OpenAPI: WireMock + Prism. Фронтенд: MSW. Все они делают одно — подменяют HTTP-ответы по URL.',
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
                explanation:
                  'Виртуализация — для изоляции и edge-кейсов. Если нужно проверить реальную интеграцию — используйте staging и e2e. Замена всех интеграционных тестов моками = «тестируем себя об себя», реальные баги не ловятся.',
              },
            },
          ],
        },
        {
          id: 'qa-l74',
          title: 'WireMock на практике',
          minutes: 25,
          steps: [
            {
              id: 'qa-l74-s1',
              title: 'Мок HTTP-ответа',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'pytest-httpserver: мок для теста',
                  code: `import pytest\nfrom pytest_httpserver import HTTPServer\nimport requests\n\n@pytest.fixture\ndef mock_payments(httpserver: HTTPServer):\n    # Успешный платёж\n    httpserver.expect_request(\n        "/api/payments",\n        method="POST",\n    ).respond_with_json(\n        {"status": "success", "tx_id": "tx-123"},\n        status=200,\n    )\n    return httpserver\n\ndef test_order_success(mock_payments):\n    # Наш сервис ходит на мок, а не на реальный платёжный шлюз\n    response = requests.post(\n        f"{mock_payments.url_for('/api/payments')}",\n        json={"amount": 1000},\n    )\n    assert response.json()["status"] == "success"\n\n# Edge-кейс: таймаут\ndef test_order_timeout(httpserver):\n    httpserver.expect_request("/api/payments").respond_with_data(\n        "Timeout", status=504, content_type="text/plain",\n    )\n    # ... проверяем, как наш сервис обрабатывает 504`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'WireMock: стабы в JSON',
                  code: `# mappings/payments-ok.json\n{\n  "request": {\n    "method": "POST",\n    "url": "/api/payments"\n  },\n  "response": {\n    "status": 200,\n    "jsonBody": {"status": "success", "tx_id": "tx-123"},\n    "headers": {"Content-Type": "application/json"}\n  }\n}\n\n# mappings/payments-error.json\n{\n  "request": { "method": "POST", "url": "/api/payments" },\n  "response": {\n    "status": 500,\n    "jsonBody": {"error": "Internal error"}\n  }\n}\n\n# Запуск:\n# docker run -p 8080:8080 -v $PWD/mappings:/home/wiremock/mappings wiremock/wiremock`,
                },
                {
                  type: 'list',
                  items: [
                    'expect_request — «на этот запрос ответь так»',
                    'respond_with_json / respond_with_data — что вернуть',
                    'Можно симулировать таймаут, 500, пустой ответ, битый JSON',
                    'WireMock умеет записывать реальный трафик (record & replay)',
                    'Запускается как отдельный сервис (Docker) или как библиотека',
                  ],
                },
              ],
            },
            {
              id: 'qa-l74-s2',
              title: 'Проверь себя: синтаксис',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как в pytest-httpserver замокать ответ 504 (timeout)?',
                options: [
                  { id: 'a', text: 'httpserver.expect_request("/api/payments").respond_with_data("Timeout", status=504)' },
                  { id: 'b', text: 'requests.get("/api/payments")' },
                  { id: 'c', text: 'mock.patch("requests.post", side_effect=TimeoutError)' },
                  { id: 'd', text: 'Это невозможно' },
                ],
                correct: ['a'],
                explanation:
                  'expect_request("путь").respond_with_data(..., status=504) — стандартный способ вернуть нужный HTTP-статус. mock.patch (c) работает на уровне Python-вызова, а не HTTP — это другой уровень.',
              },
            },
            {
              id: 'qa-l74-s3',
              title: 'Проверь себя: record & replay',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое record & replay в WireMock?',
                options: [
                  { id: 'a', text: 'Логирование всех запросов' },
                  { id: 'b', text: 'Запись реального трафика к сервису и воспроизведение его как моков' },
                  { id: 'c', text: 'Дублирование сервиса' },
                  { id: 'd', text: 'Резервное копирование' },
                ],
                correct: ['b'],
                explanation:
                  'Record & replay: один раз сходили в реальный сервис, записали ответы — дальше моки отвечают точно так же. Полезно для сложных API, где вручную писать моки долго.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m8 — BDD и Three Amigos (было qa-m21)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m8',
      title: 'BDD и Three Amigos',
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
                  text: `BDD (Behavior-Driven Development) — подход, где требования описываются на языке, понятном и бизнесу, и разработчикам. Формат: Given (дано) — When (когда) — Then (тогда). Это не «ещё один фреймворк», а способ договориться о поведении до кода.`,
                },
                {
                  type: 'code',
                  lang: 'gherkin',
                  caption: 'Сценарий на Gherkin',
                  code: `Feature: Оплата заказа картой\n  Как клиент\n  Я хочу оплатить заказ картой\n  Чтобы получить товар\n\n  Scenario: Успешная оплата\n    Given в корзине товар за 1000₽\n    And у клиента валидная карта\n    When он нажимает "Оплатить"\n    Then заказ переходит в статус "paid"\n    And на почту приходит подтверждение\n\n  Scenario: Отклонённая карта\n    Given в корзине товар за 1000₽\n    And карта отклонена банком\n    When он нажимает "Оплатить"\n    Then заказ остаётся в статусе "new"\n    And показывается ошибка "Карта отклонена"`,
                },
                {
                  type: 'mermaid',
                  caption: 'Three Amigos: обсуждение до кода',
                  code: `sequenceDiagram
                    participant B as Бизнес
                    participant D as Разработчик
                    participant Q as QA
                    participant G as Gherkin

                    Note over B,Q: Three Amigos — 30 минут
                    B->>D: зачем это нужно
                    D->>B: технические ограничения
                    Q->>B: edge-кейсы
                    B->>Q: acceptance criteria
                    Note over B,Q: договорились — пишем Gherkin
                    Q->>G: Scenario:<br/>Given… When… Then…
                    G-->>D: реализация
                    G-->>Q: автотесты`
                },
                {
                  type: 'note',
                  text: 'Важно: Gherkin пишется ДО кода, вместе с бизнесом. Если QA приходит с готовыми сценариями после разработки — это не BDD, а «тесты на Gherkin». Ценность BDD — в обсуждении и едином понимании, а не в синтаксисе.',
                },
              ],
            },
            {
              id: 'qa-l75-s2',
              title: 'Cucumber, Behave, pytest-bdd',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'pytest-bdd: шаги на Python',
                  code: `# features/payment.feature\n# Feature: Оплата заказа\n#   Scenario: Успешная оплата\n#     Given в корзине товар за 1000₽\n#     And у клиента валидная карта\n#     When он нажимает "Оплатить"\n#     Then заказ переходит в статус "paid"\n\n# tests/test_payment.py\nfrom pytest_bdd import scenarios, given, when, then, parsers\n\nscenarios("../features/payment.feature")\n\n@given(parsers.parse("в корзине товар за {price:d}₽"), target_fixture="cart")\ndef _(price):\n    return {"total": price, "status": "new"}\n\n@given("у клиента валидная карта")\ndef _(cart):\n    cart["card"] = {"valid": True}\n\n@when(parsers.parse(\`он нажимает "{action}"\`), target_fixture="result")\ndef _(cart, action):\n    return process_payment(cart)\n\n@then(parsers.parse(\`заказ переходит в статус "{status}"\`))\ndef _(cart, status):\n    assert cart["status"] == status`,
                },
                {
                  type: 'list',
                  items: [
                    'Cucumber (Java, JS) — стандарт де-факто',
                    'Behave — Python-альтернатива',
                    'pytest-bdd — интеграция с pytest (используется в Python-командах)',
                    'Gherkin-файлы (.feature) — общие для бизнеса и QA',
                    'Шаги (given/when/then) — код на Python/Java, реализующий сценарий',
                  ],
                },
              ],
            },
            {
              id: 'qa-l75-s3',
              title: 'Проверь себя: BDD',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что главное в BDD — синтаксис Gherkin или обсуждение?',
                options: [
                  { id: 'a', text: 'Синтаксис — без Given/When/Then BDD не работает' },
                  { id: 'b', text: 'Обсуждение — BDD начинается с разговора бизнеса, разработчика и QA о поведении' },
                  { id: 'c', text: 'Фреймворк (Cucumber)' },
                  { id: 'd', text: 'Автотесты' },
                ],
                correct: ['b'],
                explanation:
                  'BDD — это в первую очередь collaboration (Three Amigos). Gherkin — просто способ зафиксировать договорённости. «Gherkin после разработки» — не BDD, а «тесты в новом синтаксисе».',
              },
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
                  text: `Three Amigos — практика, где Product Owner (бизнес), разработчик и QA собираются на 30 минут перед задачей и обсуждают: «что именно мы делаем, какие edge-кейсы, как поймём, что готово». Это самая дешёвая точка, чтобы поймать недопонимание.`,
                },
                {
                  type: 'list',
                  items: [
                    'Бизнес: «зачем это нужно» — цель и ценность',
                    'Разработчик: «как реализуем» — технические ограничения',
                    'QA: «как проверим» — edge-кейсы и критерии приёмки',
                    'Результат: список acceptance criteria и Gherkin-сценариев',
                    'Время: 30 минут, не 2 часа',
                  ],
                },
                {
                  type: 'note',
                  text: 'Без Three Amigos: QA узнаёт о задаче, когда она уже готова. Баги — в требованиях, а не в коде. С Three Amigos: QA ловит «а что если пользователь отменил оплату?» ещё до первой строчки кода. Дешевле в 10–100 раз.',
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
                explanation:
                  'Три роли: бизнес (зачем), разработчик (как), QA (как проверить). Вместе — разные перспективы, ловят недопонимание на этапе требований.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m9 — Test Impact Analysis (было qa-m22)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m9',
      title: 'Test Impact Analysis',
      lessons: [
        {
          id: 'qa-l77',
          title: 'Что такое TIA и когда нужна',
          minutes: 20,
          steps: [
            {
              id: 'qa-l77-s1',
              title: 'Не запускать всё на каждый PR',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Test Impact Analysis (TIA) — техника, при которой на PR запускаются только те тесты, которые могут быть затронуты изменениями. Изменение в /users — гоняем тесты пользователей; /payments — тесты платежей. Это экономит 50–90% времени CI на больших монорепо.`,
                },
                {
                  type: 'table',
                  caption: 'TIA на практике',
                  head: ['Подход', 'Как работает', 'Инструменты'],
                  rows: [
                    ['Path-based', 'Маппинг модуль → тесты', 'Nx, Turborepo'],
                    ['Coverage-based', 'Какие тесты покрывают изменённые строки', 'jest --onlyChanged, pytest-testmon'],
                    ['Dynamic', 'Запись, что реально покрывал тест в прошлый раз', 'Datadog TIA, Launchable'],
                    ['Manual', 'QA помечает «критичные тесты»', 'label в pytest'],
                  ],
                },
                {
                  type: 'note',
                  text: 'TIA — не «отменить тесты». Полный прогон остаётся: nightly, перед релизом, на main после merge. TIA — только для PR, чтобы обратная связь была быстрее. Иначе рискуем пропустить баг из-за плохой карты зависимостей.',
                },
              ],
            },
            {
              id: 'qa-l77-s2',
              title: 'pytest-testmon: TIA в Python',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'pytest-testmon',
                  code: `pip install pytest-testmon\n\n# Первый прогон — запоминает, что какой тест покрывал\npytest --testmon\n\n# Следующие — только затронутые тесты\npytest --testmon\n\n# В CI:\npytest --testmon\n# Запустит только тесты, чьи покрытые строки изменились`,
                },
                {
                  type: 'list',
                  items: [
                    'testmon хранит маппинг «тест → покрытые строки» в .testmondata',
                    'При изменении файла запускает только тесты, затронутые этим файлом',
                    'Экономия: 50–90% времени на больших проектах',
                    'Полный прогон — nightly (testmon отключаем)',
                    'Ограничение: не ловит баги, не связанные с покрытием (интеграции, окружение)',
                  ],
                },
                {
                  type: 'note',
                  text: 'TIA — продвинутая техника. Внедрять, когда полный прогон CI стал > 15 минут. До этого — оверинжиниринг. Senior QA решает, когда TIA оправдана: большая команда, много PR, монорепо.',
                },
              ],
            },
            {
              id: 'qa-l77-s3',
              title: 'Проверь себя: TIA',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда TIA оправдана?',
                options: [
                  { id: 'a', text: 'Всегда — это лучшая практика' },
                  { id: 'b', text: 'Когда полный прогон CI > 15 минут и много PR; до этого — оверинжиниринг' },
                  { id: 'c', text: 'Только для фронтенда' },
                  { id: 'd', text: 'Вместо nightly-прогона' },
                ],
                correct: ['b'],
                explanation:
                  'TIA — для больших проектов, где CI стал узким местом. На маленьком проекте настройка TIA займёт больше времени, чем сэкономит. И TIA не отменяет полный nightly — иначе рискуем пропустить баг.',
              },
            },
            {
              id: 'qa-l77-s4',
              title: 'Проверь себя: подходы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте подход TIA и инструмент',
                pairs: [
                  { left: 'Path-based', right: 'Nx, Turborepo' },
                  { left: 'Coverage-based', right: 'pytest-testmon' },
                  { left: 'Dynamic', right: 'Datadog TIA, Launchable' },
                  { left: 'Manual', right: 'pytest -m critical' },
                ],
                explanation:
                  'Path-based — по путям файлов. Coverage-based — по покрытым строкам. Dynamic — по реальному трафику тестов. Manual — метки. Для Python-стека проще всего coverage-based (pytest-testmon).',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m10 — Практикум (было qa-m23)
    // ─────────────────────────────────────────────
    {
      id: 'qa-s-m10',
      title: 'Практикум',
      lessons: [
        {
          id: 'qa-l78',
          title: 'Практика: теория, автотесты, безопасность',
          minutes: 35,
          steps: [
            {
              id: 'qa-l78-s1',
              title: 'Принципы ISTQB',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой принцип ISTQB гласит: «Тестирование показывает наличие дефектов, но не может доказать их отсутствие»?',
                options: [
                  { id: 'a', text: 'Исчерпывающее тестирование невозможно' },
                  { id: 'b', text: 'Тестирование демонстрирует наличие дефектов' },
                  { id: 'c', text: 'Раннее тестирование' },
                  { id: 'd', text: 'Кластеризация дефектов' },
                ],
                correct: ['b'],
                explanation: 'Это первый принцип ISTQB. Даже если все тесты зелёные, в системе могут оставаться неизвестные баги.',
              },
            },
            {
              id: 'qa-l78-s2',
              title: 'Пирамида тестирования',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте уровни тестирования от основания пирамиды (самые быстрые и многочисленные) к вершине',
                items: ['Unit-тесты', 'Интеграционные тесты', 'E2E-тесты'],
                correct: ['Unit-тесты', 'Интеграционные тесты', 'E2E-тесты'],
                explanation: 'Unit — быстро, дешево, много. Integration — среднее. E2E — медленно, дорого, мало (только критичные пути).',
              },
            },
            {
              id: 'qa-l78-s3',
              title: 'Структура AAA',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в структуре автотеста (Arrange-Act-Assert):',
                text: 'def test_login():\n    # ____\n    page = LoginPage(driver)\n    # ____\n    page.login("user", "pass")\n    # ____\n    assert page.is_logged_in()',
                blanks: [
                  { accepted: ['Arrange'], hint: 'Подготовка' },
                  { accepted: ['Act'], hint: 'Действие' },
                  { accepted: ['Assert'], hint: 'Проверка' },
                ],
                explanation: 'Arrange (подготовка) → Act (выполнение действия) → Assert (проверка результата).',
              },
            },
            {
              id: 'qa-l78-s4',
              title: 'HTTP-статусы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте код ответа и его значение',
                pairs: [
                  { left: '401', right: 'Не авторизован (нет токена)' },
                  { left: '403', right: 'Доступ запрещён (нет прав)' },
                  { left: '404', right: 'Не найдено' },
                  { left: '500', right: 'Внутренняя ошибка сервера' },
                ],
                explanation: '401 — «кто ты?». 403 — «я знаю, кто ты, но тебе нельзя». 404 — нет ресурса. 500 — сервер сломался.',
              },
            },
            {
              id: 'qa-l78-s5',
              title: 'Расчёт по закону Литтла',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Система обрабатывает 200 RPS, среднее время ответа 0.5 сек. Сколько одновременных пользователей в системе? (L = λ × W)',
                correct: 100,
                explanation: 'L = 200 * 0.5 = 100. В системе одновременно находится 100 запросов (concurrent users).',
              },
            },
            {
              id: 'qa-l78-s6',
              title: 'Что проверяет API-тестировщик',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что проверяет тестировщик при тестировании API?',
                options: [
                  { id: 'a', text: 'Коды ошибок (400, 401, 404)' },
                  { id: 'b', text: 'Схему и типы данных в ответе' },
                  { id: 'c', text: 'Цвет кнопки «Отправить»' },
                  { id: 'd', text: 'Авторизацию (без токена, с чужим токеном)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'Цвет кнопок — это UI-тестирование. API проверяет контракт, обработку ошибок и безопасность.',
              },
            },
            {
              id: 'qa-l78-s7',
              title: 'Виды тестирования',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, для чего используется каждый вид тестирования',
                columns: ['Smoke', 'Регрессия', 'Нагрузочное'],
                rows: [
                  { label: 'Проверка, что приложение вообще запускается', correct: ['Smoke'] },
                  { label: 'Проверка, что новое изменение не сломало старое', correct: ['Регрессия'] },
                  { label: 'Проверка поведения при 1000 RPS', correct: ['Нагрузочное'] },
                ],
                explanation: 'Smoke — базовое здоровье. Регрессия — не сломали ли старое. Нагрузка — выдержит ли трафик.',
              },
            },
            {
              id: 'qa-l78-s8',
              title: 'Поиск дублей (SQL)',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите SQL-запрос, который найдёт email, встречающиеся в таблице users более одного раза.',
                starterCode: 'SELECT email, COUNT(*)\nFROM users\n',
                mustInclude: [
                  { pattern: 'GROUP BY email', message: 'Нужна группировка по email' },
                  { pattern: 'HAVING COUNT\\(\\*\\) > 1', message: 'Нужно условие HAVING COUNT(*) > 1' },
                ],
                explanation: 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;',
              },
            },
            {
              id: 'qa-l78-s9',
              title: 'Уязвимости OWASP',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая категория OWASP Top 10 стоит на первом месте в 2021 году? (два слова)',
                accepted: ['Broken Access Control', 'broken access control'],
                placeholder: 'Название категории',
                hint: 'Проблемы с правами доступа',
                explanation: 'Broken Access Control (нарушение контроля доступа) — на первом месте. Пользователи получают доступ к тому, что им нельзя.',
              },
            },
            {
              id: 'qa-l78-s10',
              title: 'Playwright локаторы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой локатор в Playwright считается самым надежным (семантичным)?',
                options: [
                  { id: 'a', text: 'page.locator("div > button.submit")' },
                  { id: 'b', text: 'page.get_by_role("button", name="Отправить")' },
                  { id: 'c', text: 'page.locator("xpath=//button")' },
                  { id: 'd', text: 'page.locator(".btn-primary")' },
                ],
                correct: ['b'],
                explanation: 'get_by_role ищет по ARIA-роли и доступному имени. Он не ломается при изменении CSS-классов или структуры DOM.',
              },
            },
          ],
        },
      ],
    },
  ],
};