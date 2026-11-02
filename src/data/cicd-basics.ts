import type { Course } from './types';

export const cicdBasicsCourse: Course = {
  slug: 'cicd-basics',
  title: 'CI/CD: основы',
  subtitle: 'GitHub Actions, GitLab CI, Jenkins, тесты и Docker в пайплайне',
  description:
    'Курс для тех, кто хочет автоматизировать путь кода от коммита до продакшена. Разберём принципы CI/CD, GitHub Actions и GitLab CI, работу с секретами и кэшем, прогон тестов в пайплайне, сборку и публикацию Docker-образов (включая multi-arch через buildx), а также Jenkins для тех компаний, где он ещё в проде. Каждый концепт — с реальным YAML-примером и практикой.',
  level: 'Средний',
  tags: ['CI/CD', 'DevOps', 'GitHub Actions', 'Jenkins'],
  accent: '#2088ff',
  icon: 'cicd',
  outcomes: [
    'Объяснять разницу между CI, CD и pipeline-стадиями',
    'Писать workflow на GitHub Actions и .gitlab-ci.yml',
    'Работать с секретами, кэшем и артефактами',
    'Запускать тесты и линтеры в CI на каждый PR',
    'Собирать и публиковать Docker-образы (включая multi-arch через buildx)',
    'Писать Jenkinsfile (declarative pipeline)',
    'Использовать environments, concurrency и matrix в GitHub Actions',
    'Настраивать self-hosted runners и переиспользуемые workflow',
  ],
  requirements: ['Знание Git (курс Git)', 'Понимание Docker', 'Базовый Linux/CLI'],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы CI/CD (было cd-m1)
    // ─────────────────────────────────────────────
    {
      id: 'cd-b-m1',
      title: 'Основы CI/CD',
      lessons: [
        {
          id: 'cd-l1',
          title: 'Что такое CI/CD',
          minutes: 25,
          steps: [
            {
              id: 'cd-l1-s1',
              title: 'Три буквы — три практики',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'CI/CD — это не одна технология, а набор практик, которые автоматизируют путь кода от коммита до продакшена. Аббревиатура раскрывается по-разному, и это создаёт путаницу.' },
                {
                  type: 'table',
                  caption: 'Что означают буквы',
                  head: ['Аббревиатура', 'Расшифровка', 'Что автоматизирует'],
                  rows: [
                    ['CI', 'Continuous Integration', 'Слияние кода в main + автотесты на каждый коммит'],
                    ['CD', 'Continuous Delivery', 'CI + автоматическая подготовка релиза, деплой — по кнопке'],
                    ['CD', 'Continuous Deployment', 'CI + автоматический деплой в прод без кнопки'],
                  ],
                },
                { type: 'p', text: 'Continuous Integration — практика, при которой разработчики часто сливают код в main, и каждый merge прогоняется через автотесты. Это ловит конфликты и регрессии в первые минуты, а не через недели.' },
                { type: 'p', text: 'Continuous Delivery — CI + автоматическая сборка артефакта и подготовка к релизу. Деплой в прод — по нажатию кнопки. Так работают 90% команд.' },
                { type: 'p', text: 'Continuous Deployment — если все тесты прошли, изменения сразу едут в прод без человека. Так работают Amazon, Google, Netflix — но это требует очень зрелого процесса (feature flags, canary, мониторинг).' },
                { type: 'note', text: 'Главная ценность CI/CD — не «модно», а «быстрая обратная связь». Чем раньше вы узнаёте, что что-то сломали, тем дешевле исправить.' },
              ],
            },
            {
              id: 'cd-l1-s2',
              title: 'Типичный pipeline',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Стадии CI/CD pipeline',
                  code: `graph LR
                    Commit["Commit / PR"] --> Lint["Lint"]
                    Lint --> Unit["Unit-тесты"]
                    Unit --> Build["Build"]
                    Build --> Integ["Integration"]
                    Integ --> E2E["E2E"]
                    E2E --> Publish["Publish<br/>(registry)"]
                    Publish --> Staging["Deploy<br/>staging"]
                    Staging --> Smoke["Smoke<br/>staging"]
                    Smoke --> Prod["Deploy<br/>prod"]`
                },
                {
                  type: 'list',
                  items: [
                    'Fast feedback first: дешёвые проверки (lint) — раньше, дорогие (e2e) — позже',
                    'Fail fast: упало на lint — не тратим 15 минут на e2e',
                    'Параллельно, где можно: unit + lint + typecheck одновременно',
                    'Артефакты: собранный образ/бинарь передаётся между стадиями, а не пересобирается',
                    'Общее время PR-пайплайна — 10–15 минут, не больше',
                  ],
                },
                { type: 'note', text: 'Правило «10–15 минут на PR» — не догма, а эмпирика. Если CI идёт дольше, разработчики перестают ждать и мержат «на глаз». Лучше меньше тестов в PR + полный прогон ночью, чем 40-минутный CI.' },
              ],
            },
            {
              id: 'cd-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Continuous Delivery отличается от Continuous Deployment?',
                options: [
                  { id: 'a', text: 'Ничем, это синонимы' },
                  { id: 'b', text: 'Delivery — деплой по кнопке (approve), Deployment — автоматически без человека' },
                  { id: 'c', text: 'Delivery — только для Docker, Deployment — для всего' },
                  { id: 'd', text: 'Delivery быстрее' },
                ],
                correct: ['b'],
                explanation: 'Delivery = «всё готово к деплою, но прод — по кнопке». Deployment = «прод автоматически, если тесты прошли». 90% команд используют Delivery: прод под контролем человека.',
              },
            },
          ],
        },
        {
          id: 'cd-l2',
          title: 'GitHub Actions: workflow, jobs, steps',
          minutes: 30,
          steps: [
            {
              id: 'cd-l2-s1',
              title: 'Структура workflow',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitHub Actions — встроенный CI/CD в GitHub. Workflow — YAML-файл в .github/workflows/. Он описывает: когда запускаться (триггеры), что делать (jobs), из каких шагов (steps).' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/ci.yml',
                  code: `name: CI\n\n# Когда запускать\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\n# Что делать\njobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: '3.12'\n      - run: pip install ruff\n      - run: ruff check .\n\n  test:\n    runs-on: ubuntu-latest\n    needs: lint                # ждём lint — если упал, test не запустится\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: '3.12'\n      - run: pip install -r requirements.txt\n      - run: pytest -v --junitxml=report.xml\n      - uses: actions/upload-artifact@v4\n        if: always()           # выгрузить отчёт, даже если тесты упали\n        with:\n          name: test-report\n          path: report.xml`,
                },
                {
                  type: 'list',
                  items: [
                    'name — как назвать workflow (видно в UI)',
                    'on — триггеры: push, pull_request, schedule (cron), workflow_dispatch (кнопка), release',
                    'jobs — параллельные задачи. Каждая на своём runner-е',
                    'runs-on — образ runner-а: ubuntu-latest, windows-latest, macos-latest',
                    'steps — последовательные шаги внутри job',
                    'uses — готовый action из Marketplace (actions/checkout)',
                    'run — команда shell',
                    'needs — зависимость: test ждёт lint',
                  ],
                },
              ],
            },
            {
              id: 'cd-l2-s2',
              title: 'Jobs, steps и зависимости',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Матрица версий и параллелизм',
                  code: `jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false        # если одна версия упала, остальные продолжают\n      matrix:\n        python-version: ['3.10', '3.11', '3.12']\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \${{ matrix.python-version }}\n      - run: pip install -r requirements.txt\n      - run: pytest`,
                },
                { type: 'note', text: 'Матрица — главный способ проверить совместимость: несколько версий Python, Node, Go, ОС (ubuntu + windows + macos). Для Open Source — стандарт: PR должен проходить на всех поддерживаемых версиях.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Последовательные и параллельные job',
                  code: `jobs:\n  # Параллельно (по умолчанию)\n  lint: { runs-on: ubuntu-latest, steps: [...] }\n  typecheck: { runs-on: ubuntu-latest, steps: [...] }\n\n  # Ждёт оба\n  test:\n    needs: [lint, typecheck]\n    runs-on: ubuntu-latest\n    steps: [...]\n\n  # Ждёт test\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    steps: [...]`,
                },
              ],
            },
            {
              id: 'cd-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `strategy.matrix.python-version: [3.10, 3.11, 3.12]`?',
                options: [
                  { id: 'a', text: 'Устанавливает все три версии в один runner' },
                  { id: 'b', text: 'Запускает три параллельных job-а, по одному на каждую версию' },
                  { id: 'c', text: 'Проверяет, какая версия новее' },
                  { id: 'd', text: 'Это невалидный синтаксис' },
                ],
                correct: ['b'],
                explanation: 'Matrix — комбинаторный запуск. python-version: [3.10, 3.11, 3.12] = 3 job-а, каждый со своей версией. Fail-fast: false — упала одна, остальные продолжают.',
              },
            },
          ],
        },
        {
          id: 'cd-l3',
          title: 'GitLab CI и .gitlab-ci.yml',
          minutes: 25,
          steps: [
            {
              id: 'cd-l3-s1',
              title: 'Основы GitLab CI',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitLab CI — встроенный CI/CD в GitLab. Конфиг — .gitlab-ci.yml в корне репозитория. Идеология похожа на GitHub Actions, но синтаксис другой: stages (этапы) + jobs внутри них.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.gitlab-ci.yml',
                  code: `stages:\n  - lint\n  - test\n  - build\n  - deploy\n\nvariables:\n  PIP_CACHE_DIR: "\$CI_PROJECT_DIR/.cache/pip"\n\nlint:\n  stage: lint\n  image: python:3.12-slim\n  script:\n    - pip install ruff\n    - ruff check .\n  cache:\n    key: pip\n    paths:\n      - .cache/pip\n\ntest:\n  stage: test\n  image: python:3.12-slim\n  script:\n    - pip install -r requirements.txt\n    - pytest --junitxml=report.xml\n  artifacts:\n    when: always\n    reports:\n      junit: report.xml\n    expire_in: 1 week\n  needs:\n    - lint\n\nbuild:\n  stage: build\n  image: docker:24\n  services:\n    - docker:24-dind\n  script:\n    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .\n    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n\ndeploy:\n  stage: deploy\n  script:\n    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA\n  when: manual\n  only:\n    - main`,
                },
                {
                  type: 'list',
                  items: [
                    'stages — этапы pipeline, job-ы идут по порядку этапов',
                    'Внутри stage — параллельно; между stage — последовательно',
                    'image — Docker-образ для job-а',
                    'services — вспомогательные контейнеры (Docker-in-Docker, PostgreSQL, Redis)',
                    'cache — переиспользовать между job-ами (pip, npm, go)',
                    'artifacts — передать файлы из job-а в следующие / в UI',
                    'needs — ускорить: запустить job, не дожидаясь всего stage',
                    'when: manual — деплой по кнопке',
                  ],
                },
                { type: 'note', text: 'Встроенные переменные GitLab CI: $CI_COMMIT_SHA, $CI_PROJECT_DIR, $CI_REGISTRY_IMAGE, $CI_COMMIT_BRANCH. В GitHub Actions аналог — ${{ github.sha }}, ${{ github.repository }}, ${{ secrets.X }}.' },
              ],
            },
            {
              id: 'cd-l3-s2',
              title: 'GitHub Actions vs GitLab CI',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Аспект', 'GitHub Actions', 'GitLab CI'],
                  rows: [
                    ['Файл', '.github/workflows/*.yml', '.gitlab-ci.yml (один)'],
                    ['Единица', 'workflow → jobs → steps', 'stages → jobs → script'],
                    ['Параллелизм', 'jobs по умолчанию параллельны', 'внутри stage — параллельно'],
                    ['Зависимости', 'needs: [job1]', 'needs: [job] (ускоряет), иначе по stages'],
                    ['Секреты', 'Settings → Secrets → ${{ secrets.X }}', 'Settings → CI/CD → $VAR'],
                    ['Кэш', 'actions/cache@v4', 'cache:'],
                    ['Артефакты', 'actions/upload-artifact@v4', 'artifacts:'],
                    ['Docker', 'просто docker build', 'services: docker:dind'],
                  ],
                },
                { type: 'note', text: 'GitHub Actions — стандарт в Open Source (бесплатно для публичных репозиториев). GitLab CI — часто в enterprise (self-hosted, интеграция с GitLab). Синтаксис разный, идеи одинаковые.' },
              ],
            },
            {
              id: 'cd-l3-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте концепцию GitHub Actions и аналог в GitLab CI',
                pairs: [
                  { left: 'workflow (.github/workflows/*.yml)', right: '.gitlab-ci.yml' },
                  { left: 'job', right: 'job внутри stage' },
                  { left: '${{ secrets.X }}', right: '$X (из CI/CD Settings)' },
                  { left: 'actions/cache@v4', right: 'cache:' },
                ],
                explanation: 'Идеи одинаковые, синтаксис разный. Зная одно, второе — вопрос привычки.',
              },
            },
          ],
        },
        {
          id: 'cd-l4',
          title: 'Секреты, кэш, артефакты',
          minutes: 30,
          steps: [
            {
              id: 'cd-l4-s1',
              title: 'Секреты: как не утечь',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Секреты (токены, пароли, API-ключи) не должны быть в коде. CI/CD даёт механизм «переменных окружения», которые подставляются во время выполнения и маскируются в логах.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions',
                  code: `# 1. Settings → Secrets and variables → Actions → New repository secret\n#    Имя: DATABASE_URL, Значение: postgres://...\n\n# 2. Использование в workflow\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy\n        env:\n          DATABASE_URL: \${{ secrets.DATABASE_URL }}\n          API_KEY: \${{ secrets.API_KEY }}\n        run: |\n          ./deploy.sh\n# В логах значение будет *** (masked)`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitLab CI',
                  code: `# 1. Settings → CI/CD → Variables → Add variable\n#    Ключ: DATABASE_URL, Значение: ..., Masked: ✓, Protected: ✓\n\ndeploy:\n  script:\n    - ./deploy.sh\n  variables:\n    DATABASE_URL: $DATABASE_URL\n\n# Masked — значение скрыто в логах\n# Protected — доступно только в protected branches (main, tags)`,
                },
                { type: 'note', text: 'Правила: (1) никогда не echo секрет — маскирование работает, но лучше не проверять; (2) не передавайте секреты в PR из fork — GitHub по умолчанию их не даёт; (3) ротация раз в N месяцев; (4) OIDC вместо долгоживущих ключей.' },
              ],
            },
            {
              id: 'cd-l4-s2',
              title: 'Кэш и артефакты',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'actions/cache — ускорение установки',
                  code: `- uses: actions/cache@v4\n  with:\n    path: |\n      ~/.cache/pip\n      ~/.cache/uv\n    key: \${{ runner.os }}-pip-\${{ hashFiles('**/requirements*.txt') }}\n    restore-keys: |\n      \${{ runner.os }}-pip-\n\n# key — уникальный ключ кэша\n# hashFiles — хэш файла; изменился requirements.txt — новый кэш\n# restore-keys — fallback: если точного нет, взять частичное совпадение`,
                },
                { type: 'note', text: 'Кэш и артефакты — разные вещи. Кэш — «переиспользовать между запусками» (pip-пакеты, node_modules). Артефакт — «передать из job-а в job / в UI / в релиз» (собранный jar, Docker-образ, отчёт тестов). Не путайте.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Артефакты — передача между job-ами',
                  code: `jobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: pip install build && python -m build\n      - uses: actions/upload-artifact@v4\n        with:\n          name: dist\n          path: dist/\n\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/download-artifact@v4\n        with:\n          name: dist\n          path: dist/\n      - run: ./deploy.sh dist/*.whl`,
                },
              ],
            },
            {
              id: 'cd-l4-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем артефакт отличается от кэша в CI?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Артефакт — результат сборки, передаётся между job-ами; кэш — ускорение повторных запусков' },
                  { id: 'c', text: 'Кэш — для Docker, артефакт — для тестов' },
                  { id: 'd', text: 'Артефакт — платный' },
                ],
                correct: ['b'],
                explanation: 'Артефакт = «продукт»: собранный jar, Docker-образ, отчёт. Кэш = «ускоритель»: pip-пакеты, node_modules. Артефакт передаётся из job-а в job, кэш переиспользуется между запусками.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Тесты, Docker, Jenkins (было cd-m2 + cd-l12 + cd-l18)
    // ─────────────────────────────────────────────
    {
      id: 'cd-b-m2',
      title: 'Тесты, Docker, Jenkins',
      lessons: [
        {
          id: 'cd-l5',
          title: 'Тесты в CI: pytest, Playwright, репорты',
          minutes: 30,
          steps: [
            {
              id: 'cd-l5-s1',
              title: 'pytest в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Полный CI для Python-проекта',
                  code: `name: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        python-version: ['3.11', '3.12']\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \${{ matrix.python-version }}\n          cache: 'pip'\n      - run: pip install -r requirements-dev.txt\n      - name: Lint\n        run: ruff check .\n      - name: Type check\n        run: mypy src/\n      - name: Tests\n        run: pytest -v --junitxml=report.xml --cov=src --cov-report=xml\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: reports-\${{ matrix.python-version }}\n          path: |\n            report.xml\n            coverage.xml`,
                },
                {
                  type: 'list',
                  items: [
                    'cache: pip — встроенный кэш setup-python, не нужен actions/cache',
                    '--junitxml — отчёт в формате JUnit (GitHub/GitLab покажут тесты в UI)',
                    '--cov — покрытие, --cov-report=xml — для Codecov/SonarQube',
                    'if: always() на upload-artifact — сохранить отчёты, даже если тесты упали',
                    'fail-fast: false — упала одна версия Python, остальные продолжают',
                  ],
                },
                { type: 'note', text: 'JUnit XML — стандарт отчётов о тестах. Почти все CI-системы его понимают: показывают «5 passed, 2 failed» в PR, с ссылками на упавшие тесты.' },
              ],
            },
            {
              id: 'cd-l5-s2',
              title: 'Playwright в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'E2E-тесты с Playwright',
                  code: `jobs:\n  e2e:\n    runs-on: ubuntu-latest\n    timeout-minutes: 20\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: '3.12' }\n      - run: pip install -r requirements-dev.txt\n      - name: Install Playwright browsers\n        run: playwright install --with-deps chromium\n      - name: Run E2E tests\n        env:\n          BASE_URL: \${{ secrets.STAGING_URL }}\n        run: pytest tests/e2e/ -n 4 --tracing=retain-on-failure\n      - name: Upload traces\n        if: failure()\n        uses: actions/upload-artifact@v4\n        with:\n          name: playwright-traces\n          path: test-results/\n          retention-days: 7`,
                },
                {
                  type: 'list',
                  items: [
                    'playwright install --with-deps — установить браузеры + системные зависимости',
                    '-n 4 — pytest-xdist, 4 параллельных теста',
                    '--tracing=retain-on-failure — trace сохранится только для упавших',
                    'if: failure() на upload — не тратить место, если тесты прошли',
                    'timeout-minutes — общий таймаут job-а (защита от «зависших» тестов)',
                  ],
                },
                { type: 'note', text: 'Playwright в CI — отдельная боль. Браузеры ~500 МБ, требуют libnss3, libatk, libgtk и т.д. --with-deps ставит их через apt.' },
              ],
            },
            {
              id: 'cd-l5-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в pytest добавлять флаг `--junitxml=report.xml` в CI?',
                options: [
                  { id: 'a', text: 'Ускоряет тесты' },
                  { id: 'b', text: 'CI-система покажет структурированный отчёт: сколько тестов, какие упали, ссылки на ошибки' },
                  { id: 'c', text: 'Заменяет coverage' },
                  { id: 'd', text: 'Это требование pytest' },
                ],
                correct: ['b'],
                explanation: 'Без --junitxml вы видите только «exit code 1» в логе. С JUnit XML GitHub/GitLab парсят отчёт и показывают «5 passed, 2 failed» прямо в PR.',
              },
            },
          ],
        },
        {
          id: 'cd-l6',
          title: 'Docker в CI: сборка и публикация',
          minutes: 30,
          steps: [
            {
              id: 'cd-l6-s1',
              title: 'Сборка и пуш в registry',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'build-push-action в GitHub Actions',
                  code: `name: Build and push\non:\n  push:\n    branches: [main]\n    tags: ['v*']\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/setup-buildx-action@v3\n      - name: Login to GHCR\n        uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: \${{ github.actor }}\n          password: \${{ secrets.GITHUB_TOKEN }}\n      - name: Build and push\n        uses: docker/build-push-action@v6\n        with:\n          context: .\n          push: \${{ github.event_name != 'pull_request' }}\n          tags: |\n            ghcr.io/\${{ github.repository }}:\${{ github.sha }}\n            ghcr.io/\${{ github.repository }}:latest\n          cache-from: type=gha\n          cache-to: type=gha,mode=max`,
                },
                {
                  type: 'list',
                  items: [
                    'permissions: packages: write — GITHUB_TOKEN получает права на GHCR',
                    'setup-buildx — multi-platform и продвинутый кэш',
                    'push: false на PR — не пушить из PR (только проверка сборки)',
                    'cache-from: type=gha — кэш слоёв в GitHub Actions',
                    'Теги: git SHA (неизменный) + latest (плавающий)',
                  ],
                },
                { type: 'note', text: 'Не пушить образ на каждый PR. На PR — build с push: false. Push — только в main и на теги v*.' },
              ],
            },
            {
              id: 'cd-l6-s2',
              title: 'Стратегия тегов и версий',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'docker/metadata-action — авто-теги',
                  code: `- name: Docker metadata\n  id: meta\n  uses: docker/metadata-action@v5\n  with:\n    images: ghcr.io/\${{ github.repository }}\n    tags: |\n      type=ref,event=branch\n      type=ref,event=pr\n      type=semver,pattern={{version}}\n      type=semver,pattern={{major}}.{{minor}}\n      type=sha,prefix=sha-,format=short\n      type=raw,value=latest,enable={{is_default_branch}}\n\n- uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: \${{ steps.meta.outputs.tags }}\n    labels: \${{ steps.meta.outputs.labels }}`,
                },
                {
                  type: 'table',
                  caption: 'Что создаст metadata-action',
                  head: ['Событие', 'Теги'],
                  rows: [
                    ['push в main', 'main, sha-abc1234, latest'],
                    ['push в feature/x', 'feature-x, sha-def5678'],
                    ['PR #42', 'pr-42'],
                    ['тег v1.4.2', '1.4.2, 1.4, sha-ghi9012, latest'],
                  ],
                },
                { type: 'note', text: 'metadata-action — стандарт индустрии. Не пишите теги руками: легко ошибиться, забыть latest, сделать невалидный semver.' },
              ],
            },
            {
              id: 'cd-l6-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему на PR обычно ставят `push: false` при сборке Docker-образа?',
                options: [
                  { id: 'a', text: 'Docker не работает на PR' },
                  { id: 'b', text: 'PR не должен пушить в registry: засоряет место, может сломать latest; достаточно проверить сборку' },
                  { id: 'c', text: 'Это ускоряет сборку в 10 раз' },
                  { id: 'd', text: 'PR не имеет доступа к registry' },
                ],
                correct: ['b'],
                explanation: 'На PR — задача «проверить, что Dockerfile валиден». Push в registry на каждый PR засоряет место, может перезаписать тег latest. Push — только в main и на теги.',
              },
            },
          ],
        },
        {
          id: 'cd-l12',
          title: 'Docker buildx: multi-arch и кэш в CI',
          minutes: 30,
          steps: [
            {
              id: 'cd-l12-s1',
              title: 'Multi-arch: зачем и как',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Образ, собранный на Intel/AMD (amd64), не запустится на Apple Silicon (arm64) и на Raspberry Pi. Multi-arch образ содержит несколько вариантов под одной «крышей» (manifest list), и Docker сам выбирает нужный на конкретной машине.' },
                {
                  type: 'mermaid',
                  caption: 'Multi-arch сборка: один тег — два образа',
                  code: `graph LR
                    Src["Один Dockerfile"] --> Buildx["buildx<br/>--platform amd64,arm64"]
                    Buildx --> A1["linux/amd64"]
                    Buildx --> A2["linux/arm64"]
                    A1 --> Manifest["Manifest list<br/>myapp:1.4.2"]
                    A2 --> Manifest
                    Manifest --> Registry[("Registry")]
                    Registry --> Mac["Mac M3<br/>→ arm64"]
                    Registry --> Server["Linux x86<br/>→ amd64"]`
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Multi-arch в GitHub Actions',
                  code: `- uses: docker/setup-qemu-action@v3      # эмуляция arm64 на amd64-раннере\n- uses: docker/setup-buildx-action@v3\n\n- uses: docker/build-push-action@v6\n  with:\n    context: .\n    platforms: linux/amd64,linux/arm64\n    push: true\n    tags: ghcr.io/myorg/myapp:1.4.2`,
                },
                {
                  type: 'list',
                  items: [
                    'setup-qemu-action — эмулятор для кросс-архитектурной сборки (нужен для arm64 на amd64)',
                    'platforms: linux/amd64,linux/arm64 — две архитектуры в одной сборке',
                    'Готовый тег содержит manifest list — Docker сам выберет нужный вариант при pull',
                    'Эмуляция через QEMU медленнее нативной в 2–5 раз — сборка arm64 займёт в 3 раза больше',
                    'Для CI с self-hosted arm-раннером QEMU не нужен',
                  ],
                },
                { type: 'note', text: 'На собеседовании DevOps: «Как собрать образ под Mac и Linux одновременно?» — ответ: `docker buildx build --platform linux/amd64,linux/arm64 --push`. Без buildx — никак.' },
              ],
            },
            {
              id: 'cd-l12-s2',
              title: 'Кэш между сборками: registry и GHA',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Каждый CI-джоб стартует на чистой машине. Без внешнего кэша все слои собираются заново — 5 минут на каждый push. Решение: вынести кэш в registry или в хранилище CI.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GHA cache (быстро, только в GitHub)',
                  code: `- uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: ghcr.io/myorg/myapp:1.4.2\n    cache-from: type=gha\n    cache-to: type=gha,mode=max\n\n# mode=max — кэшировать все слои, включая промежуточные стадии\n# mode=min (по умолчанию) — только финальные слои`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Registry cache (универсально, любой CI)',
                  code: `- uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: ghcr.io/myorg/myapp:1.4.2\n    cache-from: type=registry,ref=ghcr.io/myorg/myapp:buildcache\n    cache-to: type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max`,
                },
                { type: 'note', text: 'mode=max даёт лучший hit rate для multi-stage Dockerfile: без него промежуточные стадии (build-стадия с компиляторами) не кэшируются, и каждый раз всё пересобирается.' },
              ],
            },
            {
              id: 'cd-l12-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен setup-qemu-action при multi-arch сборке?',
                options: [
                  { id: 'a', text: 'Ускоряет сборку' },
                  { id: 'b', text: 'Позволяет собирать образ для другой архитектуры (arm64) на amd64-раннере через эмуляцию' },
                  { id: 'c', text: 'Нужен для кэша' },
                  { id: 'd', text: 'Заменяет buildx' },
                ],
                correct: ['b'],
                explanation: 'QEMU — эмулятор: на amd64-раннере он позволяет выполнять arm64-инструкции. Без него buildx для linux/arm64 не соберёт. С self-hosted arm-раннером QEMU не нужен — там нативная сборка.',
              },
            },
          ],
        },
        {
          id: 'cd-l18',
          title: 'Jenkins: Jenkinsfile и declarative pipeline',
          minutes: 30,
          steps: [
            {
              id: 'cd-l18-s1',
              title: 'Зачем Jenkins в 2025',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Jenkins — старейший (2011) и до сих пор самый распространённый self-hosted CI/CD в enterprise. Банки, телеком, госсектор, крупные корпорации — часто «у нас Jenkins, потому что так исторически сложилось, и он работает». На собеседовании в таких компаниях Jenkins — обязательный пункт.' },
                {
                  type: 'p', text: 'Плюсы Jenkins: полностью self-hosted (важно для закрытых контуров), огромная экосистема плагинов (1800+), любая кастомизация, бесплатно. Минусы: требует администрирования, устаревший UI, «свой язык» Groovy, безопасность целиком на вас.' },
                {
                  type: 'note', text: 'На собеседовании DevOps/Platform: «С какими CI работали?» — упомянуть Jenkins обязательно. Даже если работали только с GitHub Actions — знать, что такое Jenkinsfile и stages, стоит.' },
              ],
            },
            {
              id: 'cd-l18-s2',
              title: 'Declarative Jenkinsfile',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Стадии типичного Jenkins-пайплайна',
                  code: `graph LR
                    Checkout["Checkout"] --> Lint["Lint"]
                    Lint --> Test["Test"]
                    Test --> Build["Build Docker"]
                    Build --> Push["Push registry"]
                    Push --> Deploy["Deploy"]
                    Deploy --> Smoke["Smoke"]
                    Lint -.->|"fail"| Stop["Pipeline failed"]
                    Test -.->|"fail"| Stop`
                },
                {
                  type: 'code',
                  lang: 'groovy',
                  caption: 'Jenkinsfile (declarative)',
                  code: `pipeline {\n    agent any\n\n    environment {\n        REGISTRY = "ghcr.io/myorg"\n        IMAGE = "myorg/myapp"\n    }\n\n    options {\n        timeout(time: 30, unit: 'MINUTES')\n        buildDiscarder(logRotator(numToKeepStr: '10'))\n        disableConcurrentBuilds()\n    }\n\n    stages {\n        stage('Checkout') {\n            steps { checkout scm }\n        }\n\n        stage('Lint') {\n            agent { docker 'python:3.12-slim' }\n            steps {\n                sh 'pip install ruff'\n                sh 'ruff check .'\n            }\n        }\n\n        stage('Test') {\n            agent { docker 'python:3.12-slim' }\n            steps {\n                sh 'pip install -r requirements-dev.txt'\n                sh 'pytest --junitxml=report.xml --cov=src'\n            }\n            post {\n                always {\n                    junit 'report.xml'\n                }\n            }\n        }\n\n        stage('Build Docker') {\n            steps {\n                script {\n                    def image = docker.build("\${REGISTRY}/\${IMAGE}:\${env.BUILD_NUMBER}")\n                    docker.withRegistry("https://ghcr.io", "ghcr-credentials") {\n                        image.push()\n                        image.push("latest")\n                    }\n                }\n            }\n        }\n\n        stage('Deploy') {\n            when { branch 'main' }\n            steps {\n                sh "kubectl set image deployment/app app=\${REGISTRY}/\${IMAGE}:\${env.BUILD_NUMBER}"\n            }\n        }\n    }\n\n    post {\n        success { echo 'Pipeline succeeded' }\n        failure { echo 'Pipeline failed — check logs' }\n        always { cleanWs() }\n    }\n}`,
                },
                {
                  type: 'list',
                  items: [
                    'agent any — где запускать (любой доступный агент); agent { docker ... } — внутри контейнера',
                    'stages → stage → steps — иерархия',
                    'options — таймауты, ротация сборок, запрет параллельных',
                    'environment — переменные окружения',
                    'when { branch } — условия запуска',
                    'post { always } — cleanup, уведомления, junit-отчёты',
                  ],
                },
                { type: 'note', text: 'Declarative pipeline (с pipeline {}) — современный синтаксис, проще и безопаснее. Scripted pipeline (просто node {}) — старый, гибкий, но легче сломать. В 2025 для новых проектов — только declarative.' },
              ],
            },
            {
              id: 'cd-l18-s3',
              title: 'Jenkins vs GitHub Actions',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Критерий', 'Jenkins', 'GitHub Actions'],
                  rows: [
                    ['Хостинг', 'Только self-hosted', 'Managed (hosted) или self-hosted'],
                    ['Стоимость', 'Бесплатно (но нужен сервер + админ)', 'Бесплатно для public, платно для private'],
                    ['Плагины', '1800+ (всё, что угодно)', 'Marketplace (проще)'],
                    ['Язык конфига', 'Groovy (Jenkinsfile)', 'YAML'],
                    ['Порог входа', 'Высокий (админ + Groovy)', 'Низкий (YAML как в других CI)'],
                    ['Безопасность', 'На вас (патчи, доступы)', 'Managed (обновляется GitHub)'],
                    ['Когда', 'Enterprise, закрытый контур, on-prem', 'Open Source, стартапы, облако'],
                  ],
                },
                { type: 'note', text: 'GitHub Actions выигрывает в простоте, Jenkins — в гибкости и независимости от облака. В РФ — часто Jenkins или GitLab CI (self-hosted, работают без интернета).' },
              ],
            },
            {
              id: 'cd-l18-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что из перечисленного — преимущества Jenkins?',
                options: [
                  { id: 'a', text: 'Полностью self-hosted: работает в закрытом контуре без интернета' },
                  { id: 'b', text: 'Низкий порог входа (YAML как в GitHub Actions)' },
                  { id: 'c', text: '1800+ плагинов под любые задачи' },
                  { id: 'd', text: 'Бесплатен' },
                ],
                correct: ['a', 'c', 'd'],
                explanation: 'Jenkins: self-hosted, плагины, бесплатен. Но порог входа высокий — YAML (b) не про Jenkins, там Groovy (Jenkinsfile). Это его слабое место.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — GitHub Actions глубоко (новый)
    // ─────────────────────────────────────────────
    {
      id: 'cd-b-m3',
      title: 'GitHub Actions глубоко',
      lessons: [
        {
          id: 'cd-l9',
          title: 'Environments, concurrency, matrix',
          minutes: 25,
          steps: [
            {
              id: 'cd-l9-s1',
              title: 'Environments: dev, staging, prod',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В GitHub Actions есть понятие environment — окружение деплоя. Оно позволяет задать свои секреты (например, STAGING_URL и PROD_URL), правила защиты (ручное одобрение, ветки, с которых можно деплоить) и историю деплоев.' },
                {
                  type: 'mermaid',
                  caption: 'Environments и promotion',
                  code: `graph LR
                    PR["PR"] --> Dev["dev<br/>(auto)"]
                    Dev -->|"merge main"| Staging["staging<br/>(auto)"]
                    Staging -->|"approve"| Prod["prod<br/>(manual)"]
                    Prod -.->|"rollback"| Staging`
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Деплой через environment',
                  code: `jobs:\n  deploy-staging:\n    runs-on: ubuntu-latest\n    environment:\n      name: staging\n      url: https://staging.example.com\n    steps:\n      - run: ./deploy.sh\n        env:\n          API_URL: \${{ secrets.STAGING_API_URL }}   # из environment secrets\n\n  deploy-prod:\n    needs: deploy-staging\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://example.com\n    steps:\n      - run: ./deploy.sh\n        env:\n          API_URL: \${{ secrets.PROD_API_URL }}      # только из production\n\n# В GitHub UI → Settings → Environments → production\n# → Required reviewers: 2 человека\n# → Wait timer: 5 минут\n# → Deployment branches: только main`,
                },
                {
                  type: 'list',
                  items: [
                    'environment.name — имя окружения (dev / staging / production)',
                    'environment.url — ссылка на живой URL (отображается в PR)',
                    'Секреты различаются по environment (STAGING_API_URL ≠ PROD_API_URL)',
                    'Required reviewers — деплой в prod ждёт одобрения',
                    'Deployment branches — ограничивает, с какой ветки можно деплоить',
                    'История деплоев — в UI видно, кто и когда',
                  ],
                },
              ],
            },
            {
              id: 'cd-l9-s2',
              title: 'Concurrency: не запускать одновременно',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Если разработчик сделал 5 пушей подряд в одну ветку — по умолчанию GitHub запустит 5 workflow параллельно. Это тратит минуты и иногда приводит к гонкам (два деплоя одновременно). Решение — concurrency.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Concurrency: одна группа — один прогон',
                  code: `name: CI\non: [push, pull_request]\n\nconcurrency:\n  group: \${{ github.workflow }}-\${{ github.ref }}\n  cancel-in-progress: true\n\n# Что происходит:\n# 1. Push A → workflow #1 стартует\n# 2. Push B в ту же ветку → workflow #1 ОТМЕНЯЕТСЯ, стартует #2\n# 3. Push C → #2 отменяется, стартует #3\n# Итог: работает только последний push, экономятся минуты`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Concurrency для деплоя',
                  code: `jobs:\n  deploy:\n    runs-on: ubuntu-latest\n    concurrency:\n      group: deploy-production    # глобально на весь репозиторий\n      cancel-in-progress: false   # деплой НЕ отменять: дать завершиться\n    steps: [...]`,
                },
                { type: 'note', text: 'Правило: для CI — cancel-in-progress: true (не жалко отменить). Для деплоя — false (не отменять в середине). Группа должна быть уникальной на то, что нужно сериализовать.' },
              ],
            },
            {
              id: 'cd-l9-s3',
              title: 'Matrix: include, exclude, fail-fast',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Продвинутая матрица',
                  code: `jobs:\n  test:\n    strategy:\n      fail-fast: false          # одна упала — остальные продолжают\n      max-parallel: 4           # не больше 4 одновременно\n      matrix:\n        os: [ubuntu-latest, windows-latest, macos-latest]\n        python: ['3.11', '3.12']\n        exclude:\n          # Не тестировать 3.11 на Windows\n          - os: windows-latest\n            python: '3.11'\n        include:\n          # Добавить специальную комбинацию\n          - os: ubuntu-latest\n            python: '3.13-dev'\n            experimental: true\n    runs-on: \${{ matrix.os }}\n    continue-on-error: \${{ matrix.experimental || false }}\n    steps: [...]`,
                },
                {
                  type: 'list',
                  items: [
                    'Оси (os × python) дают декартово произведение: 3 × 2 = 6 job-ов',
                    'exclude убирает конкретные комбинации (например, windows + 3.11)',
                    'include добавляет комбинации, которых нет в произведении (например, экспериментальную версию)',
                    'max-parallel — ограничение параллельных job-ов (для платных минут)',
                    'continue-on-error: ${{ matrix.experimental }} — экспериментальные не валят pipeline',
                    'fail-fast: false — увидеть все падения сразу, а не только первое',
                  ],
                },
                { type: 'note', text: 'На собеседовании: «Как протестировать на 3 ОС × 3 версиях Python, но не запускать 9 job-ов, если Windows + 3.11 не поддерживается?» — ответ: matrix с exclude.' },
              ],
            },
            {
              id: 'cd-l9-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен `concurrency` в GitHub Actions?',
                options: [
                  { id: 'a', text: 'Ускоряет отдельный job' },
                  { id: 'b', text: 'Отменяет предыдущий прогон при новом пуше в ту же группу (экономит минуты, избегает гонок)' },
                  { id: 'c', text: 'Разрешает параллельные деплои в prod' },
                  { id: 'd', text: 'Заменяет environments' },
                ],
                correct: ['b'],
                explanation: 'Concurrency группирует прогоны. cancel-in-progress: true отменяет старый при новом push — не тратит минуты на устаревший код. Для деплоя ставят false, чтобы не отменить в середине.',
              },
            },
          ],
        },
        {
          id: 'cd-l10',
          title: 'Self-hosted runners и кэш на масштабе',
          minutes: 25,
          steps: [
            {
              id: 'cd-l10-s1',
              title: 'Когда нужны self-hosted runners',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitHub-hosted runners — это VPS, которые GitHub поднимает на время job-а. Мощные, но с лимитами: 4 CPU / 16 GB RAM / 14 GB диск, лимит минут в месяц (2000 бесплатных для private). Self-hosted — ваш собственный сервер, который GitHub использует для запуска workflow.' },
                {
                  type: 'list',
                  items: [
                    'GPU / ML-задачи: нужен T4/A100, у hosted нет',
                    'Приватная сеть: доступ к внутренним БД/сервисам, которых нет в интернете',
                    'Большие кэши: десятки GB pip/npm/playwright — на hosted не влезет',
                    'Дорогие минуты: если превышаете лимит, self-hosted дешевле',
                    'Специфичное ПО: проприетарные компиляторы, лицензии',
                    'Долгие тесты: hosted ограничен 6 часами на job, self-hosted — без лимита',
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Self-hosted runner: как устроено',
                  code: `graph LR
                    GH["GitHub<br/>(workflow queue)"] -->|"1. poll"| Runner["Runner daemon<br/>(на вашем сервере)"]
                    Runner -->|"2. get job"| Job["Job execution<br/>(в изолированном workspace)"]
                    Job -->|"3. run steps"| Steps["Steps<br/>(build, test, deploy)"]
                    Steps -->|"4. report"| GH
                    Runner -.->|"privileged access"| Private["Внутренняя сеть<br/>(БД, API, K8s)"]`
                },
              ],
            },
            {
              id: 'cd-l10-s2',
              title: 'Установка и безопасность',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка runner (Linux)',
                  code: `# В GitHub: Settings → Actions → Runners → New self-hosted runner\n# Скопировать команды из UI:\n\nmkdir actions-runner && cd actions-runner\ncurl -o actions-runner-linux-x64-2.319.1.tar.gz -L \\\n  https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz\ntar xzf ./actions-runner-linux-x64-2.319.1.tar.gz\n\n# Регистрация (токен из GitHub UI)\n./config.sh --url https://github.com/myorg/myrepo --token ABC123...\n\n# Запуск как сервис\nsudo ./svc.sh install\nsudo ./svc.sh start`,
                },
                { type: 'note', text: '⚠️ ГЛАВНОЕ ПРАВИЛО: никогда не запускать self-hosted runner на публичном репозитории. Любой, кто сделает fork и PR, получит код-выполнение на вашем сервере (потенциально — доступ к внутренней сети). Только private-репозитории с доверенными контрибьюторами.' },
                {
                  type: 'list',
                  items: [
                    'Отдельный пользователь ОС (не root) для runner',
                    'Изолированный workspace (не пересекается с prod)',
                    'Не давать runner доступ к prod-секретам без необходимости',
                    'Ephemeral runners — создаются на один job и удаляются',
                    'Network segmentation: runner в отдельном VLAN',
                  ],
                },
              ],
            },
            {
              id: 'cd-l10-s3',
              title: 'Ephemeral runners и autoscaling',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Один долгоживущий runner — это риск: если он скомпрометирован, злоумышленник получит данные всех job-ов. Решение — ephemeral (одноразовые) runners: каждый job запускается на чистой машине, которая удаляется после завершения. Так работают GitHub-hosted runners под капотом.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Actions Runner Controller (ARC) в Kubernetes',
                  code: `# Установка ARC в K8s-кластер\nhelm install arc \\\n  --namespace arc-systems \\\n  --create-namespace \\\n  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller\n\n# Scale set: min 0, max 20 runners\nhelm install arc-runner-set \\\n  --namespace arc-runners \\\n  --create-namespace \\\n  --set githubConfigUrl="https://github.com/myorg/myrepo" \\\n  --set githubConfigSecret.github_token="\$GITHUB_TOKEN" \\\n  --set minRunners=0 \\\n  --set maxRunners=20 \\\n  oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set\n\n# В workflow:\n# runs-on: arc-runner-set`,
                },
                {
                  type: 'list',
                  items: [
                    'ARC — оператор для K8s, запускает runners как Pod-ы',
                    'minRunners=0 — нет постоянных runners, экономим ресурсы',
                    'maxRunners=20 —上限 на пиковую нагрузку',
                    'Каждый job → отдельный Pod → удаляется после завершения',
                    'KEDA — автоскейлер на основе очереди job-ов в GitHub',
                  ],
                },
                { type: 'note', text: 'В 2025 стандарт для self-hosted на масштабе — ARC (Actions Runner Controller) в Kubernetes. Для маленьких команд — обычный runner на одном сервере.' },
              ],
            },
            {
              id: 'cd-l10-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему нельзя запускать self-hosted runner на публичном репозитории?',
                options: [
                  { id: 'a', text: 'GitHub запрещает' },
                  { id: 'b', text: 'Любой из fork может выполнить код на вашем сервере через PR' },
                  { id: 'c', text: 'Он не работает с public' },
                  { id: 'd', text: 'Слишком медленно' },
                ],
                correct: ['b'],
                explanation: 'Публичный репозиторий → любой может сделать fork и PR. Workflow из PR запустится на вашем runner. Атакующий получит код-выполнение на сервере и потенциально доступ к внутренней сети. Только private с доверенными контрибьюторами.',
              },
            },
          ],
        },
        {
          id: 'cd-l11',
          title: 'Composite actions и reusable workflows',
          minutes: 25,
          steps: [
            {
              id: 'cd-l11-s1',
              title: 'Composite action — переиспользовать шаги',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Composite action — набор шагов, который можно переиспользовать внутри одного workflow или между workflow. Хранится в отдельном репозитории или в `.github/actions/<name>/action.yml`. Отличие от reusable workflow: composite — это про шаги, reusable — про целые job-ы.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/actions/setup-python-with-deps/action.yml',
                  code: `name: Setup Python with deps\ndescription: Устанавливает Python и кэширует pip\n\ninputs:\n  python-version:\n    description: 'Версия Python'\n    required: true\n    default: '3.12'\n  requirements-file:\n    description: 'Файл с зависимостями'\n    default: 'requirements.txt'\n\nruns:\n  using: composite\n  steps:\n    - uses: actions/setup-python@v5\n      with:\n        python-version: \${{ inputs.python-version }}\n        cache: pip\n    - run: pip install -r \${{ inputs.requirements-file }}\n      shell: bash`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Использование composite action',
                  code: `jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ./.github/actions/setup-python-with-deps\n        with:\n          python-version: '3.12'\n      - run: pytest`,
                },
              ],
            },
            {
              id: 'cd-l11-s2',
              title: 'Reusable workflow — переиспользовать job',
              type: 'theory',
              blocks: [
                { type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/reusable-test.yml',
                  code: `name: Reusable test\n\non:\n  workflow_call:\n    inputs:\n      python-version:\n        required: true\n        type: string\n    secrets:\n      CODECOV_TOKEN:\n        required: false\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \${{ inputs.python-version }}\n          cache: pip\n      - run: pip install -r requirements-dev.txt\n      - run: pytest --cov=src\n      - uses: codecov/codecov-action@v4\n        if: \${{ secrets.CODECOV_TOKEN != '' }}\n        with:\n          token: \${{ secrets.CODECOV_TOKEN }}`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/ci.yml — вызов reusable',
                  code: `jobs:\n  test-311:\n    uses: ./.github/workflows/reusable-test.yml\n    with:\n      python-version: '3.11'\n    secrets:\n      CODECOV_TOKEN: \${{ secrets.CODECOV_TOKEN }}\n\n  test-312:\n    uses: ./.github/workflows/reusable-test.yml\n    with:\n      python-version: '3.12'\n    secrets:\n      CODECOV_TOKEN: \${{ secrets.CODECOV_TOKEN }}`,
                },
                { type: 'note', text: 'Reusable workflow вызывается через `jobs.<name>.uses`. Composite action — через `steps[].uses`. Reusable — это целый job на отдельном runner, composite — это шаги внутри существующего job.' },
              ],
            },
            {
              id: 'cd-l11-s3',
              title: 'Что выбрать',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Composite vs Reusable',
                  head: ['Критерий', 'Composite action', 'Reusable workflow'],
                  rows: [
                    ['Единица', 'Шаги внутри одного job', 'Целый job (на своём runner)'],
                    ['Вызов', '`steps[].uses: ./.github/actions/x`', '`jobs.<name>.uses: ./.github/workflows/x.yml`'],
                    ['Секреты', 'Наследуются из job автоматически', 'Передаются явно через `secrets:`'],
                    ['Изоляция', 'Работает в том же runner', 'Свой runner, свой workspace'],
                    ['Когда', 'Повторяющиеся шаги (setup, login, install)', 'Повторяющиеся job-ы (test, deploy)'],
                  ],
                },
                { type: 'note', text: 'На собеседовании: «Как переиспользовать логику CI между репозиториями?» — Reusable workflow в отдельном репозитории (`.github` репозиторий организации). Все репозитории вызывают его через `owner/repo/.github/workflows/x.yml@v1`.' },
              ],
            },
            {
              id: 'cd-l11-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем reusable workflow отличается от composite action?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Composite — это шаги внутри job, reusable — целый job на отдельном runner' },
                  { id: 'c', text: 'Composite быстрее' },
                  { id: 'd', text: 'Reusable не поддерживает secrets' },
                ],
                correct: ['b'],
                explanation: 'Composite action = «функция из шагов», работает в текущем job. Reusable workflow = «функция из job-ов», запускается на своём runner, требует явной передачи secrets.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Практикум (было cd-m3)
    // ─────────────────────────────────────────────
    {
      id: 'cd-b-m4',
      title: 'Практикум',
      lessons: [
        {
          id: 'cd-l8',
          title: 'Практика: пайплайны и деплой',
          minutes: 35,
          steps: [
            {
              id: 'cd-l8-s1',
              title: 'Delivery vs Deployment',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Continuous Delivery отличается от Continuous Deployment?',
                options: [
                  { id: 'a', text: 'Delivery — деплой по кнопке, Deployment — автоматически' },
                  { id: 'b', text: 'Delivery — для Docker, Deployment — для серверов' },
                  { id: 'c', text: 'Ничем' },
                  { id: 'd', text: 'Delivery — это CI' },
                ],
                correct: ['a'],
                explanation: 'Delivery — всё готово, но деплой в прод требует ручного approve. Deployment — автоматом в прод, если тесты прошли.',
              },
            },
            {
              id: 'cd-l8-s2',
              title: 'Стадии pipeline',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте стадии CI/CD в правильном порядке (от самого быстрого к самому долгому)',
                items: ['Lint', 'Unit-тесты', 'Build (Docker)', 'E2E-тесты', 'Deploy'],
                correct: ['Lint', 'Unit-тесты', 'Build (Docker)', 'E2E-тесты', 'Deploy'],
                explanation: 'Сначала быстрые проверки (lint, unit), потом сборка, потом долгие E2E, и только потом деплой.',
              },
            },
            {
              id: 'cd-l8-s3',
              title: 'Триггер GitHub Actions',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните YAML для запуска workflow на push и pull_request',
                text: 'name: CI\n____:\n  ____: [push, pull_request]',
                blanks: [
                  { accepted: ['on'], hint: 'когда запускать' },
                  { accepted: ['on'], hint: 'события' },
                ],
                explanation: 'on: [push, pull_request] — стандартный триггер для проверки каждого пуша и PR.',
              },
            },
            {
              id: 'cd-l8-s4',
              title: 'Секреты',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как обратиться к секрету `DB_PASSWORD` в GitHub Actions?',
                accepted: ['${{ secrets.DB_PASSWORD }}', '${{secrets.DB_PASSWORD}}'],
                placeholder: '${{ ... }}',
                hint: 'secrets и имя',
                explanation: '${{ secrets.DB_PASSWORD }} — стандартный синтаксис. Значение будет замаскировано в логах.',
              },
            },
            {
              id: 'cd-l8-s5',
              title: 'Стратегии деплоя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте стратегию деплоя и её суть',
                pairs: [
                  { left: 'Blue-Green', right: 'Два окружения, переключение трафика' },
                  { left: 'Canary', right: '5% → 25% → 100% трафика' },
                  { left: 'Rolling', right: 'Постепенная замена подов' },
                  { left: 'Feature flag', right: 'Включение фичи в рантайме' },
                ],
                explanation: 'Blue-Green — два окружения. Canary — постепенная раскатка. Rolling — стандарт K8s. Feature flag — деплой ≠ релиз.',
              },
            },
            {
              id: 'cd-l8-s6',
              title: 'Время PR-пайплайна',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Какое максимальное время выполнения CI на PR считается комфортным (в минутах)?',
                correct: 15,
                explanation: 'Оптимум — 10–15 минут. Если дольше, разработчики перестают ждать и мержат вслепую.',
              },
            },
            {
              id: 'cd-l8-s7',
              title: 'Что блокирует merge',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что стоит делать обязательной проверкой (required check) в PR?',
                options: [
                  { id: 'a', text: 'Lint' },
                  { id: 'b', text: 'Unit-тесты' },
                  { id: 'c', text: 'Полный нагрузочный тест (30 минут)' },
                  { id: 'd', text: 'Smoke E2E (5 минут)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'Lint, unit, smoke E2E — быстрые проверки. Полный нагрузочный тест — только ночью, он не должен блокировать PR.',
              },
            },
            {
              id: 'cd-l8-s8',
              title: 'Кэш vs артефакт',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого механизма',
                columns: ['Кэш', 'Артефакт'],
                rows: [
                  { label: 'Ускоряет повторные запуски', correct: ['Кэш'] },
                  { label: 'Передаёт файлы между job-ами', correct: ['Артефакт'] },
                  { label: 'Содержит, например, node_modules', correct: ['Кэш'] },
                  { label: 'Содержит собранный jar/Docker-образ', correct: ['Артефакт'] },
                ],
                explanation: 'Кэш — ускоряет (pip, npm). Артефакт — результат сборки, передаётся между job.',
              },
            },
            {
              id: 'cd-l8-s9',
              title: 'Шаг в GitHub Actions',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите шаг (step) в GitHub Actions, который запускает команду `pytest -v`.',
                starterCode: '- name: Run tests\n  ',
                mustInclude: [
                  { pattern: 'run:\\s*pytest -v', message: 'Нужен ключ run с командой pytest -v' },
                ],
                explanation: '- name: Run tests\n  run: pytest -v',
              },
            },
            {
              id: 'cd-l8-s10',
              title: 'Docker в CI',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем на PR обычно ставят `push: false` при сборке Docker-образа?',
                options: [
                  { id: 'a', text: 'Docker не работает на PR' },
                  { id: 'b', text: 'Чтобы проверить сборку, но не засорять registry и не ломать latest' },
                  { id: 'c', text: 'Это ускоряет сборку в 10 раз' },
                  { id: 'd', text: 'Чтобы не платить за Docker Hub' },
                ],
                correct: ['b'],
                explanation: 'На PR достаточно проверить, что Dockerfile собирается. Push в registry — только для main и тегов.',
              },
            },
          ],
        },
      ],
    },
  ],
};