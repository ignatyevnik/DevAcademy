import type { Course } from './types';

export const dockerCourse: Course = {
  slug: 'docker-basics',
  title: 'Docker с нуля',
  subtitle: 'Контейнеры, образы, Dockerfile и docker-compose на практике',
  description:
    'Практический курс по Docker: поймёте, чем контейнер отличается от виртуальной машины, научитесь собирать собственные образы, управлять данными через volumes и поднимать многосервисные приложения одной командой docker compose up.',
  level: 'Новичок',
  tags: ['Docker', 'DevOps', 'Контейнеры'],
  accent: '#1d63ed',
  icon: 'docker',
  outcomes: [
    'Объяснять разницу между образом и контейнером',
    'Писать эффективные Dockerfile с кэшированием слоёв',
    'Управлять данными через volumes и сетями между контейнерами',
    'Описывать стек приложения в docker-compose.yml',
  ],
  requirements: ['Уверенная работа в командной строке', 'Установленный Docker Desktop (для практики)'],
  modules: [
    {
      id: 'dk-m1',
      title: 'Контейнеры и образы',
      lessons: [
        {
          id: 'dk-l1',
          title: 'Что такое контейнер',
          minutes: 15,
          steps: [
            {
              id: 'dk-l1-s1',
              title: 'Контейнер vs виртуальная машина',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Контейнер — это изолированный процесс в вашей операционной системе. В отличие от виртуальной машины, он не запускает отдельное ядро ОС: все контейнеры делят ядро хоста, а изоляцию обеспечивают механизмы Linux — namespaces (своё дерево процессов, сеть, файловая система) и cgroups (лимиты CPU и памяти).',
                },
                {
                  type: 'h3',
                  text: 'Почему это важно',
                },
                {
                  type: 'list',
                  items: [
                    'Старт за миллисекунды вместо минут у ВМ.',
                    'Одинаковое окружение у разработчика, в CI и на проде: «работает у меня» исчезает.',
                    'Образ — переносимый артефакт: собрал один раз, запускаешь где угодно.',
                  ],
                },
                {
                  type: 'note',
                  text: 'Образ (image) — неизменяемый шаблон со слоями. Контейнер — запущенный экземпляр образа с тонким записываемым слоем поверх. Один образ → много контейнеров.',
                },
              ],
            },
            {
              id: 'dk-l1-s2',
              title: 'Базовый рабочий цикл',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: 'docker run -d -p 8080:80 --name web nginx   # запуск\ndocker ps                                  # работающие контейнеры\ndocker logs -f web                         # смотрим логи\ndocker exec -it web sh                     # зайти внутрь\ndocker stop web && docker rm web           # остановить и удалить',
                },
                {
                  type: 'p',
                  text: 'Флаг -p 8080:80 пробрасывает порт 80 контейнера на порт 8080 хоста. Флаг -d запускает контейнер в фоне (detached). Без --name Docker придумает случайное имя вроде happy_bohr.',
                },
                {
                  type: 'p',
                  text: 'Команда docker exec -it … sh открывает shell внутри работающего контейнера — главный инструмент отладки: можно посмотреть файлы, проверить переменные окружения, попинговать соседние сервисы.',
                },
              ],
            },
            {
              id: 'dk-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем контейнер принципиально отличается от виртуальной машины?',
                options: [
                  { id: 'a', text: 'Контейнер всегда работает быстрее по CPU' },
                  { id: 'b', text: 'Контейнеры делят ядро ОС с хостом и не запускают отдельную ОС' },
                  { id: 'c', text: 'Контейнеры нельзя ограничить по памяти' },
                  { id: 'd', text: 'ВМ не изолируют процессы' },
                ],
                correct: ['b'],
                explanation:
                  'Ключевое отличие — архитектурное: контейнер — изолированный процесс на общем ядре (namespaces + cgroups), а ВМ виртуализирует железо и гоняет собственную ОС целиком.',
              },
            },
          ],
        },
        {
          id: 'dk-l2',
          title: 'Собираем свой образ: Dockerfile',
          minutes: 25,
          steps: [
            {
              id: 'dk-l2-s1',
              title: 'Слои и кэширование',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Dockerfile — рецепт сборки образа. Каждая инструкция создаёт слой. Docker кэширует слои: если инструкция и её входные данные не изменились, слой берётся из кэша. Отсюда главное правило: то, что меняется редко, — выше, то, что меняется часто (ваш код), — ниже.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Dockerfile для Python-приложения',
                  code: 'FROM python:3.12-slim\n\nWORKDIR /app\n\n# Зависимости меняются редко — ставим их раньше\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Код меняется часто — копируем последним\nCOPY . .\n\nCMD ["python", "main.py"]',
                },
                {
                  type: 'p',
                  text: 'Если поменять COPY . . местами с установкой зависимостей, каждая правка кода будет заново ставить все пакеты — сборка растянется с секунд до минут.',
                },
              ],
            },
            {
              id: 'dk-l2-s2',
              title: 'Хорошие практики',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Базовый образ — минимальный: python:3.12-slim вместо полного образа, alpine где возможно.',
                    'Многоступенчатые сборки (multi-stage): собираем в тяжёлом образе с компиляторами, копируем артефакт в лёгкий финальный.',
                    'Не храните секреты в слоях образа — они остаются в истории даже после удаления в следующем слое.',
                    'Один контейнер = один процесс. Контейнер должен умирать вместе с приложением, чтобы оркестратор мог его перезапустить.',
                  ],
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Multi-stage для фронтенда',
                  code: 'FROM node:20 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html',
                },
              ],
            },
            {
              id: 'dk-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему COPY requirements.txt и pip install ставят ДО копирования исходного кода?',
                options: [
                  { id: 'a', text: 'Так требует синтаксис Dockerfile' },
                  { id: 'b', text: 'Чтобы изменения кода не сбрасывали кэш слоя с зависимостями' },
                  { id: 'c', text: 'Иначе pip не найдёт файл' },
                  { id: 'd', text: 'Чтобы образ был безопаснее' },
                ],
                correct: ['b'],
                explanation:
                  'Docker кэширует каждый слой. Зависимости меняются редко, код — постоянно. Если код копировать раньше, любая его правка инвалидирует кэш, и pip install будет выполняться заново при каждой сборке.',
              },
            },
            {
              id: 'dk-l2-s4',
              title: 'Проверь себя: секреты',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вы добавили пароль в образ командой ENV PASSWORD=secret, а в следующем слое «удалили» его через ENV PASSWORD="". Безопасно ли это?',
                options: [
                  { id: 'a', text: 'Да, финальное значение пустое' },
                  { id: 'b', text: 'Нет, значение осталось в истории слоёв образа' },
                  { id: 'c', text: 'Да, Docker шифрует ENV' },
                  { id: 'd', text: 'Зависит от базового образа' },
                ],
                correct: ['b'],
                explanation:
                  'Слои образа аддитивны: «удаление» в новом слое не стирает данные из предыдущих. Пароль виден через docker history. Секреты нужно передавать при запуске или через механизмы секретов оркестратора.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dk-m2',
      title: 'Данные, сети и compose',
      lessons: [
        {
          id: 'dk-l3',
          title: 'Volumes и сети',
          minutes: 20,
          steps: [
            {
              id: 'dk-l3-s1',
              title: 'Куда писать данные',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Записываемый слой контейнера исчезает вместе с ним: удалил контейнер — потерял данные. Для баз данных, загрузок пользователей и логов нужны volumes — управляемые Docker\'ом каталоги, которые живут независимо от жизни контейнера.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Named volume для PostgreSQL',
                  code: 'docker volume create pgdata\ndocker run -d --name db \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v pgdata:/var/lib/postgresql/data \\\n  postgres:16',
                },
                {
                  type: 'h3',
                  text: 'Сети',
                },
                {
                  type: 'p',
                  text: 'Контейнеры в одной пользовательской сети (docker network create) резолвят друг друга по имени: приложение может подключаться к БД просто по адресу db:5432. Стандартная сеть bridge этого не умеет — всегда создавайте свою.',
                },
              ],
            },
            {
              id: 'dk-l3-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где должны храниться данные production-базы, запущенной в контейнере?',
                options: [
                  { id: 'a', text: 'В записываемом слое контейнера — там быстрее всего' },
                  { id: 'b', text: 'В named volume или на примонтированном каталоге хоста' },
                  { id: 'c', text: 'Внутри образа, чтобы бэкапился вместе с ним' },
                  { id: 'd', text: 'В /tmp контейнера' },
                ],
                correct: ['b'],
                explanation:
                  'Volume живёт независимо от контейнера: его можно пересоздавать, обновлять и удалять без потери данных. Записываемый слой исчезает вместе с контейнером, а данные в образе недоступны для изменения.',
              },
            },
          ],
        },
        {
          id: 'dk-l4',
          title: 'docker compose: стек одной командой',
          minutes: 25,
          steps: [
            {
              id: 'dk-l4-s1',
              title: 'Описываем приложение декларативно',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда сервисов несколько — приложение, база, кэш, очередь — запускать их руками утомительно. Docker Compose описывает весь стек в одном YAML-файле: сервисы, сети, volumes. Команда docker compose up поднимает всё сразу и в правильном порядке.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'docker-compose.yml',
                  code: 'services:\n  app:\n    build: .\n    ports:\n      - "8080:8000"\n    environment:\n      DATABASE_URL: postgres://app:secret@db:5432/appdb\n    depends_on:\n      - db\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_USER: app\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:',
                },
                {
                  type: 'p',
                  text: 'Compose автоматически создаёт общую сеть, поэтому app обращается к базе по имени сервиса — db.',
                },
              ],
            },
            {
              id: 'dk-l4-s2',
              title: 'Повседневные команды',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Шпаргалка',
                  code: 'docker compose up -d        # поднять стек в фоне\ndocker compose ps           # статус сервисов\ndocker compose logs -f app  # логи одного сервиса\ndocker compose exec app sh  # shell внутри сервиса\ndocker compose down         # остановить и удалить контейнеры\ndocker compose down -v      # …и volumes тоже (осторожно: данные!)',
                },
                {
                  type: 'note',
                  text: 'depends_on ждёт только запуска контейнера, а не готовности сервиса внутри. Для ожидания готовности БД используйте healthcheck + condition: service_healthy.',
                },
              ],
            },
            {
              id: 'dk-l4-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что делает команда docker compose down -v? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'Останавливает и удаляет контейнеры стека' },
                  { id: 'b', text: 'Удаляет volumes вместе с данными' },
                  { id: 'c', text: 'Удаляет образы, из которых собраны сервисы' },
                  { id: 'd', text: 'Удаляет сеть проекта' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'down удаляет контейнеры и сеть проекта, флаг -v добавляет к этому именованные volumes — данные базы будут потеряны. Образы команда down не трогает (для этого есть --rmi).',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dk-m3',
      title: 'Оптимизация и безопасность',
      lessons: [
        {
          id: 'dk-l5',
          title: '.dockerignore и размер образа',
          minutes: 20,
          steps: [
            {
              id: 'dk-l5-s1',
              title: 'Что не должно попадать в контекст сборки',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Команда `docker build .` отправляет в демон ВСЁ содержимое каталога — включая `node_modules`, `.git`, `venv`. Это замедляет сборку и «пухнет» образ. Файл `.dockerignore` (как `.gitignore`) исключает лишнее.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: '.dockerignore',
                  code: '.git\nnode_modules\nvenv\n__pycache__\n*.pyc\n.env\n*.log\n.DS_Store',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Что занимает место',
                  code: 'docker image history myapp:latest      # какие слои большие\ndocker scout quickview myapp:latest     # уязвимости и размер\ndocker image prune                      # удалить неиспользуемые',
                },
              ],
            },
            {
              id: 'dk-l5-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен .dockerignore?',
                options: [
                  { id: 'a', text: 'Чтобы Docker не отправлял в контекст сборки лишние файлы' },
                  { id: 'b', text: 'Чтобы уменьшить образ после COPY . .' },
                  { id: 'c', text: 'Это обязательный файл, без него docker build упадёт' },
                  { id: 'd', text: 'Он ускоряет контейнер при запуске' },
                ],
                correct: ['a'],
                explanation:
                  'Исключённые файлы не попадают в контекст и не копируются внутрь образа. Это и ускоряет сборку, и уменьшает размер. Синтаксис — как у .gitignore.',
              },
            },
          ],
        },
        {
          id: 'dk-l6',
          title: 'Non-root и безопасность',
          minutes: 25,
          steps: [
            {
              id: 'dk-l6-s1',
              title: 'Почему root в контейнере — плохо',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'По умолчанию процесс в контейнере — root. Если злоумышленник выйдет из контейнера (например, через уязвимость в ядре), он получит root на хосте. Даже если выйдет не полностью — root внутри контейнера позволит установить пакеты, изменить системные файлы.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Non-root в Dockerfile',
                  code: 'FROM node:20-alpine\n\n# создаём отдельного пользователя\nRUN addgroup -S app && adduser -S app -G app\n\nWORKDIR /app\nCOPY --chown=app:app package*.json ./\nRUN npm ci\nCOPY --chown=app:app . .\n\nUSER app\n\nCMD ["node", "server.js"]',
                },
                {
                  type: 'note',
                  text: 'USER app ставьте ПОСЛЕ установки пакетов. Если поставить раньше — не хватит прав на npm install или apt-get. Идея: всё, что требует root (установка), — на этапе сборки; всё, что работает в рантайме, — от non-root.',
                },
              ],
            },
            {
              id: 'dk-l6-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где в Dockerfile правильно ставить USER app?',
                options: [
                  { id: 'a', text: 'В самом начале, сразу после FROM' },
                  { id: 'b', text: 'После установки пакетов и копирования файлов, перед CMD' },
                  { id: 'c', text: 'После CMD' },
                  { id: 'd', text: 'USER в Dockerfile не используется' },
                ],
                correct: ['b'],
                explanation:
                  'USER переключает пользователя для всех последующих инструкций. Если поставить слишком рано — не хватит прав на npm install / apt. Правильно: установили, скопировали, переключились, запустили.',
              },
            },
          ],
        },
        {
          id: 'dk-l7',
          title: 'Multi-stage: сборка отдельно от запуска',
          minutes: 25,
          steps: [
            {
              id: 'dk-l7-s1',
              title: 'Зачем разделять build и runtime',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Для сборки нужны компиляторы, dev-зависимости, исходники. Для запуска — только артефакт и runtime. Multi-stage позволяет собрать в тяжёлом образе, а в финальный положить только результат — образ уменьшается в разы.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Go: 900 MB → 15 MB',
                  code: '# Сборка\nFROM golang:1.23 AS build\nWORKDIR /src\nCOPY go.* ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app ./cmd/server\n\n# Runtime\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /app /app\nUSER nonroot:nonroot\nEXPOSE 8080\nENTRYPOINT ["/app"]',
                },
                {
                  type: 'note',
                  text: '--from=build копирует только артефакт. Всё остальное — исходники, компилятор, кэш — остаётся в промежуточном образе и в финальный не попадает. Промежуточные образы можно чистить: docker builder prune.',
                },
              ],
            },
            {
              id: 'dk-l7-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что попадает в финальный образ при multi-stage сборке?',
                options: [
                  { id: 'a', text: 'Всё из всех стадий' },
                  { id: 'b', text: 'Только то, что явно скопировано через COPY --from' },
                  { id: 'c', text: 'Только последняя инструкция' },
                  { id: 'd', text: 'Исходники и компилятор — для отладки' },
                ],
                correct: ['b'],
                explanation:
                  'Финальный образ содержит только то, что вы явно перенесли в него. Всё остальное (компиляторы, dev-зависимости, кэш) остаётся в промежуточных стадиях и в финальный образ не попадает.',
              },
            },
          ],
        },
        {
          id: 'dk-l8',
          title: 'Compose: healthcheck, профили, деплой',
          minutes: 25,
          steps: [
            {
              id: 'dk-l8-s1',
              title: 'Продвинутые возможности Compose',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Боевой docker-compose.yml',
                  code: 'services:\n  app:\n    build:\n      context: .\n      target: runtime\n    depends_on:\n      db:\n        condition: service_healthy\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]\n      interval: 10s\n      retries: 3\n    restart: unless-stopped\n    profiles: ["prod"]\n\n  db:\n    image: postgres:16\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U app"]\n      interval: 5s\n      retries: 5\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\n  adminer:\n    image: adminer\n    ports: ["8080:8080"]\n    profiles: ["dev"]\n\nvolumes:\n  pgdata:',
                },
                {
                  type: 'list',
                  items: [
                    'condition: service_healthy — ждать готовности БД, а не просто «контейнер запущен»',
                    'profiles — группировка сервисов: dev поднимает adminer, prod — нет',
                    'restart: unless-stopped — перезапуск упавших, кроме случая явной остановки',
                    'healthcheck обязателен для БД, очередей, кэша — иначе приложение стартует раньше инфраструктуры',
                  ],
                },
                {
                  type: 'note',
                  text: 'В продакшене Compose — не всегда лучший выбор: нет автомасштабирования, самовосстановления и rolling-обновлений. Для односерверных проектов и dev-окружений — идеален. Для реального прода — Kubernetes, Nomad, ECS.',
                },
              ],
            },
            {
              id: 'dk-l8-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен condition: service_healthy в depends_on?',
                options: [
                  { id: 'a', text: 'Чтобы сервис запускался в фоне' },
                  { id: 'b', text: 'Чтобы дождаться готовности БД, а не только старта контейнера' },
                  { id: 'c', text: 'Чтобы перезапустить сервис при падении' },
                  { id: 'd', text: 'Чтобы поднять сервис в отдельном profile' },
                ],
                correct: ['b'],
                explanation:
                  'depends_on без condition ждёт только запуска контейнера. Postgres запущен, но ещё инициализирует БД — и приложение упадёт с «connection refused». service_healthy ждёт, пока пройдёт healthcheck, и только тогда стартует приложение.',
              },
            },
          ],
        },
      ],
        },     // ← конец dk-m3
    {
      id: 'dk-m4',
      title: 'Registry и публикация образов',
      lessons: [
        {
          id: 'dk-l9',
          title: 'Docker Hub и другие registry',
          minutes: 20,
          steps: [
            {
              id: 'dk-l9-s1',
              title: 'Что такое registry',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Registry — это сервер, который хранит Docker-образы. Docker Hub — самый популярный, но не единственный. Когда вы делаете `docker push myapp:1.0`, образ уходит в registry, а на другом сервере `docker pull` забирает его оттуда. Это и есть «собрал один раз — запускай везде».',
                },
                {
                  type: 'table',
                  caption: 'Популярные registry',
                  head: ['Registry', 'Кто', 'Цена', 'Особенность'],
                  rows: [
                    ['Docker Hub', 'Docker Inc.', 'Бесплатно (1 приватный), от $9/мес', 'Стандарт де-факто, огромное сообщество'],
                    ['GitHub Container Registry (ghcr.io)', 'GitHub', 'Бесплатно для public, для private — по лимитам', 'Интеграция с GitHub Actions из коробки'],
                    ['GitLab Container Registry', 'GitLab', 'Входит в тариф', 'Интеграция с GitLab CI'],
                    ['AWS ECR', 'Amazon', 'Оплата за хранение', 'Нативная интеграция с ECS/EKS'],
                    ['Google Artifact Registry', 'Google', 'Оплата за хранение', 'Нативная интеграция с GKE'],
                    ['Harbor', 'Open-source', 'Бесплатно (self-hosted)', 'Свой registry в закрытой сети'],
                  ],
                },
                {
                  type: 'note',
                  text: 'В продакшене Docker Hub используют редко для приватных образов: rate limits (100 pull / 6 часов для анонимных), нет гарантий SLA. Для приватных образов — ghcr.io, ECR, GAR или self-hosted Harbor.',
                },
              ],
            },
            {
              id: 'dk-l9-s2',
              title: 'Анатомия имени образа',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Полное имя',
                  code: 'registry.example.com:5000/team/myapp:1.4.0\n└───────┬──────────┘ └─┬─┘└──┬──┘ └─┬─┘\n     registry           team  name  tag\n\nЕсли registry не указан → Docker Hub:\n  nginx → docker.io/library/nginx:latest\n  myuser/myapp → docker.io/myuser/myapp:latest\n\nЕсли tag не указан → :latest (плохо!)',
                },
                {
                  type: 'list',
                  items: [
                    'registry — домен (docker.io, ghcr.io, свой)',
                    'namespace / team — пользователь или группа (для Docker Hub — ваш username)',
                    'name — имя образа',
                    'tag — версия (1.4.0, latest, sha-abc1234)',
                    'digest — хэш (sha256:...), уникальный и неизменный',
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: 'docker login                       # логин в Docker Hub\ndocker login ghcr.io               # логин в GitHub registry\ndocker login registry.example.com  # логин в свой registry\n\ndocker pull nginx:1.27\n\ndocker tag myapp:latest myuser/myapp:1.0.0\ndocker push myuser/myapp:1.0.0\n\ndocker pull myuser/myapp:1.0.0',
                },
              ],
            },
            {
              id: 'dk-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'В какое место уйдёт образ, если выполнить `docker push myuser/myapp:1.0` без указания registry?',
                accepted: ['docker.io', 'Docker Hub', 'dockerhub', 'docker hub'],
                placeholder: 'название registry',
                hint: 'Публичный registry по умолчанию',
                explanation:
                  'Без явного registry Docker использует Docker Hub (docker.io). Полное имя: docker.io/myuser/myapp:1.0. Для других registry — явно указывать домен: ghcr.io/myuser/myapp:1.0.',
              },
            },
          ],
        },
        {
          id: 'dk-l10',
          title: 'Теги и версионирование',
          minutes: 25,
          steps: [
            {
              id: 'dk-l10-s1',
              title: 'Почему :latest — это плохо',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '`:latest` — это просто «тег по умолчанию», не «самый новый». Он не обновляется автоматически и не защищает от скатывания. Один и тот же `myapp:latest` сегодня и завтра — это два разных образа. В проде это приводит к «на проде обновилось само», «на staging не та версия», «откатить нельзя».',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Почему :latest опасен',
                  code: 'День 1:  docker build -t myapp:latest .\n         docker push myapp:latest           # sha256:abc...\n\nДень 2:  docker build -t myapp:latest .\n         docker push myapp:latest           # sha256:def... (перезаписал!)\n\nНа проде: docker pull myapp:latest\n         → получает тот, что был на день 2\n         → «кто это сделал?» — непонятно\n         → откатить нельзя — старая версия перезаписана',
                },
                {
                  type: 'note',
                  text: '`:latest` допустим только для локальной разработки и для образов, которые не идут в прод (например, dev-контейнер). В проде — только явные версии или digest.',
                },
              ],
            },
            {
              id: 'dk-l10-s2',
              title: 'Три уровня тегов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Хорошая стратегия — три тега на каждый образ. Не «один тег на всё», а набор, который отвечает на разные вопросы.',
                },
                {
                  type: 'table',
                  caption: 'Стратегия тегирования',
                  head: ['Тег', 'Пример', 'Зачем'],
                  rows: [
                    ['Точная версия', 'myapp:1.4.2', 'Никогда не перезаписывается. Прод-деплой и откат — по нему.'],
                    ['Минорная версия', 'myapp:1.4', 'Последний патч в ветке 1.4. Клиенты могут тянуть «последний 1.4.x».'],
                    ['Мажорная версия', 'myapp:1', 'Последняя 1.x. Для «долгоживущих» интеграций.'],
                    ['Git SHA', 'myapp:sha-abc1234', 'Точная привязка к коммиту — для трассировки багов.'],
                    ['latest', 'myapp:latest', 'Только для разработки. В проде — не использовать.'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Публикация набора тегов',
                  code: 'VERSION=1.4.2\nMINOR=1.4\nMAJOR=1\nSHA=$(git rev-parse --short HEAD)\n\n# Собираем один образ\nIMAGE=myuser/myapp\n\ndocker build -t $IMAGE:$VERSION .\n\n# Публикуем с 4 тегами\ndocker tag $IMAGE:$VERSION $IMAGE:$MINOR\ndocker tag $IMAGE:$VERSION $IMAGE:$MAJOR\ndocker tag $IMAGE:$VERSION $IMAGE:sha-$SHA\ndocker push $IMAGE:$VERSION\ndocker push $IMAGE:$MINOR\ndocker push $IMAGE:$MAJOR\ndocker push $IMAGE:sha-$SHA',
                },
                {
                  type: 'list',
                  items: [
                    'Точная версия — единственный «источник правды», не перезаписывается',
                    'Минорная и мажорная — «подвижные» указатели, перезаписываются при каждом релизе',
                    'sha-XXXXXXXX — для трассировки: «в каком коммите появился баг?»',
                    'Digest (sha256:...) — неизменный: даже если тег перезаписали, digest остался',
                  ],
                },
              ],
            },
            {
              id: 'dk-l10-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Почему не стоит деплоить в прод образ с тегом :latest?',
                options: [
                  { id: 'a', text: 'Тег :latest может быть перезаписан новым образом' },
                  { id: 'b', text: 'Невозможно понять, какая версия задеплоена' },
                  { id: 'c', text: 'Docker Hub не разрешает пушить latest' },
                  { id: 'd', text: 'Откат к предыдущей версии невозможен — она перезаписана' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'latest — это просто «тег по умолчанию», не «последний». Он перезаписывается при каждом push, что убивает трассировку и откат. Docker Hub разрешает latest (это не проблема платформы, а плохая практика).',
              },
            },
          ],
        },
        {
          id: 'dk-l11',
          title: 'Приватные registry и аутентификация',
          minutes: 20,
          steps: [
            {
              id: 'dk-l11-s1',
              title: 'Как Docker хранит учётные данные',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Docker хранит логины/пароли в `~/.docker/config.json` (на Windows — `%USERPROFILE%\\.docker\\config.json`). Пароли кодируются в base64, а не шифруются — это НЕ безопасно. Для CI/CD используют токены и credential helpers.',
                },
                {
                  type: 'code',
                  lang: 'json',
                  caption: '~/.docker/config.json',
                  code: '{\n  "auths": {\n    "https://index.docker.io/v1/": {\n      "auth": "dXNlcjpwYXNz"   // base64(user:pass), не шифрование!\n    }\n  }\n}',
                },
                {
                  type: 'list',
                  items: [
                    'docker login — сохраняет в config.json',
                    'docker logout — удаляет',
                    'Для CI — токены (Personal Access Token), не пароли',
                    'Для ghcr.io — GitHub PAT с правами write:packages',
                    'Credential helpers (docker-credential-osxkeychain и др.) — хранят в системном keychain, безопаснее',
                  ],
                },
                {
                  type: 'note',
                  text: 'Никогда не коммитьте ~/.docker/config.json в Git. В CI — передавайте через secrets (GitHub Secrets, GitLab CI variables). Даже base64 «пароль» — это фактически пароль в открытом виде.',
                },
              ],
            },
            {
              id: 'dk-l11-s2',
              title: 'Аутентификация в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions → GHCR',
                  code: '- name: Login to GHCR\n  uses: docker/login-action@v3\n  with:\n    registry: ghcr.io\n    username: ${{ github.actor }}\n    password: ${{ secrets.GITHUB_TOKEN }}\n\n- name: Build and push\n  uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: |\n      ghcr.io/${{ github.repository }}:1.4.2\n      ghcr.io/${{ github.repository }}:1.4\n      ghcr.io/${{ github.repository }}:latest',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Альтернатива: docker login через stdin (без файла)',
                  code: 'echo "$REGISTRY_PASSWORD" | docker login registry.example.com \\\n  -u "$REGISTRY_USER" --password-stdin\n\n# --password-stdin — пароль не попадёт в историю команд и процессы',
                },
                {
                  type: 'note',
                  text: 'В GitHub Actions GITHUB_TOKEN выдаётся автоматически с правами на пакеты. Не надо хранить личный PAT — используйте его. Для других registry — secrets (CI/CD variables).',
                },
              ],
            },
            {
              id: 'dk-l11-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как безопаснее всего передать пароль registry в CI?',
                options: [
                  { id: 'a', text: 'Записать в Dockerfile через ENV' },
                  { id: 'b', text: 'Закоммитить в репозиторий как config.json' },
                  { id: 'c', text: 'Через secrets CI и --password-stdin' },
                  { id: 'd', text: 'В docker-compose.yml открытым текстом' },
                ],
                correct: ['c'],
                explanation:
                  'Secrets CI (GitHub Secrets, GitLab variables) + --password-stdin — не оставляет пароль в истории команд и файле ~/.docker/config.json. Всё остальное — утечка.',
              },
            },
          ],
        },
        {
          id: 'dk-l12',
          title: 'Практика: собираем и публикуем',
          minutes: 25,
          steps: [
            {
              id: 'dk-l12-s1',
              title: 'Полный сценарий',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'От кода до registry',
                  code: '# 1. Собираем образ с тегом версии\nIMAGE=ghcr.io/myorg/myapp\nVERSION=1.4.2\nSHA=$(git rev-parse --short HEAD)\n\ndocker build -t $IMAGE:$VERSION -t $IMAGE:sha-$SHA .\n\n# 2. Локально проверяем, что образ запускается\ndocker run --rm -p 8000:8000 $IMAGE:$VERSION\n\n# 3. Логин в registry\necho "$GH_TOKEN" | docker login ghcr.io -u myusername --password-stdin\n\n# 4. Публикуем\ndocker push $IMAGE:$VERSION\ndocker push $IMAGE:sha-$SHA\n\n# 5. Обновляем «плавающие» теги\ndocker tag $IMAGE:$VERSION $IMAGE:1.4\ndocker tag $IMAGE:$VERSION $IMAGE:1\ndocker push $IMAGE:1.4\ndocker push $IMAGE:1\n\n# 6. Проверяем, что образ реально в registry\ndocker pull $IMAGE:$VERSION',
                },
                {
                  type: 'list',
                  items: [
                    'Проверка локально ПЕРЕД push — обязательно: не публикуйте то, что не запускается',
                    'Порядок тегов: сначала точный (immutable), потом плавающие',
                    'docker pull обратно — финальная проверка «registry получил образ»',
                    'Один образ может иметь много тегов — это просто указатели',
                  ],
                },
              ],
            },
            {
              id: 'dk-l12-s2',
              title: 'Диагностика типичных проблем',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Что может пойти не так',
                  head: ['Проблема', 'Причина', 'Решение'],
                  rows: [
                    ['denied: requested access to the resource is denied', 'Нет прав на namespace или не залогинен', 'docker login + проверить права'],
                    ['unauthorized: authentication required', 'Токен истёк или без нужных scope', 'Перевыпустить с write:packages'],
                    ['no space left on device', 'Локальный диск переполнен', 'docker system prune -a'],
                    ['manifest unknown', 'Опечатка в имени или теге', 'docker pull без push — проверить существование'],
                    ['timeout при push', 'Большой образ, медленный канал', 'Собрать меньше (multi-stage) или пушить по слоям'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверить, что образ реально в registry',
                  code: '# Через docker\ndocker pull myuser/myapp:1.4.2\n\n# Через API (Docker Hub)\ncurl -s https://hub.docker.com/v2/repositories/myuser/myapp/tags/1.4.2\n\n# Через API (GHCR)\ngh api /user/packages/container/myapp/versions',
                },
              ],
            },
            {
              id: 'dk-l12-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что стоит сделать перед `docker push`?',
                options: [
                  { id: 'a', text: 'Запустить образ локально и убедиться, что работает' },
                  { id: 'b', text: 'Поставить точный тег версии' },
                  { id: 'c', text: 'Удалить локальный образ — он же будет в registry' },
                  { id: 'd', text: 'Проверить, что размер образа адекватный' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Проверить локально, поставить правильный тег, оценить размер — обязательные шаги. Удалять локальный образ не нужно: он может пригодиться для отладки, и это не влияет на registry.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'dk-m5',
      title: 'Buildx, кэш и multi-arch',
      lessons: [
        {
          id: 'dk-l13',
          title: 'Зачем buildx',
          minutes: 20,
          steps: [
            {
              id: 'dk-l13-s1',
              title: 'BuildKit и buildx',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Современный `docker build` использует BuildKit — новый движок сборки. `docker buildx` — это расширение: multi-platform сборки, продвинутое кэширование, параллельная сборка стадий. Фактически, buildx — это «docker build для продакшена».',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка и создание builder',
                  code: '# Проверить, что buildx доступен\ndocker buildx version\n\n# Создать «продвинутый» builder (docker-container driver)\ndocker buildx create --name mybuilder --use --bootstrap\n\n# Посмотреть доступные builders\ndocker buildx ls\n\n# Теперь docker buildx build — с полными возможностями\ndocker buildx build -t myapp:1.0 .',
                },
                {
                  type: 'note',
                  text: 'На Docker Desktop buildx уже включён по умолчанию. На Linux-сервере без Docker Desktop — надо `docker buildx create`. Драйвер `docker-container` даёт multi-platform и registry-cache, драйвер `docker` — проще, но без этих возможностей.',
                },
              ],
            },
            {
              id: 'dk-l13-s2',
              title: 'Параллельная сборка стадий',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'BuildKit анализирует граф зависимостей между стадиями и запускает независимые стадии параллельно. В multi-stage Dockerfile это может ускорить сборку в 2–3 раза.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Независимые стадии собираются параллельно',
                  code: 'FROM node:20 AS build-frontend\nWORKDIR /frontend\nCOPY frontend/package*.json ./\nRUN npm ci\nCOPY frontend/ .\nRUN npm run build\n\n# Эта стадия не зависит от build-frontend\nFROM node:20 AS build-backend\nWORKDIR /backend\nCOPY backend/package*.json ./\nRUN npm ci\nCOPY backend/ .\nRUN npm run build\n\n# Финальная — ждёт обе\nFROM node:20-alpine\nCOPY --from=build-frontend /frontend/dist /app/public\nCOPY --from=build-backend /backend/dist /app/server\nCMD ["node", "/app/server/index.js"]',
                },
                {
                  type: 'note',
                  text: 'Параллельность работает автоматически — не надо ничего указывать. BuildKit сам понимает, что build-frontend и build-backend не зависят друг от друга.',
                },
              ],
            },
            {
              id: 'dk-l13-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем buildx отличается от обычного docker build?',
                options: [
                  { id: 'a', text: 'Это то же самое, просто новое имя' },
                  { id: 'b', text: 'Добавляет multi-platform, продвинутый кэш и параллельную сборку стадий' },
                  { id: 'c', text: 'Работает только на Windows' },
                  { id: 'd', text: 'Использует другой формат Dockerfile' },
                ],
                correct: ['b'],
                explanation:
                  'buildx — расширение с BuildKit: multi-platform (amd64 + arm64), кэш в registry или GHA, параллельная сборка независимых стадий. Синтаксис Dockerfile тот же.',
              },
            },
          ],
        },
        {
          id: 'dk-l14',
          title: 'Кэш сборки: где хранить и как ускорять',
          minutes: 30,
          steps: [
            {
              id: 'dk-l14-s1',
              title: 'Проблема: кэш локален',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Обычный BuildKit-кэш хранится на машине, где идёт сборка. На CI каждый джоб — чистая машина, кэша нет, все слои собираются заново. Для проекта на 5 минут сборки это 5 минут × 20 пушей в день = 100 минут простоя.',
                },
                {
                  type: 'p',
                  text: 'Решение — вынести кэш наружу: в registry или в хранилище CI. Тогда следующий джоб забирает готовые слои.',
                },
              ],
            },
            {
              id: 'dk-l14-s2',
              title: 'Registry cache и GHA cache',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Кэш в registry (универсально)',
                  code: 'docker buildx build \\\n  --cache-from type=registry,ref=ghcr.io/myorg/myapp:buildcache \\\n  --cache-to type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max \\\n  -t ghcr.io/myorg/myapp:1.4.2 \\\n  --push \\\n  .',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Кэш в GitHub Actions (быстрее, нативный)',
                  code: '- uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: ghcr.io/${{ github.repository }}:1.4.2\n    cache-from: type=gha\n    cache-to: type=gha,mode=max',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Кэш в GitLab CI',
                  code: 'build:\n  script:\n    - docker buildx build\n        --cache-from type=registry,ref=$CI_REGISTRY_IMAGE:cache\n        --cache-to type=registry,ref=$CI_REGISTRY_IMAGE:cache,mode=max\n        --push -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .',
                },
                {
                  type: 'list',
                  items: [
                    'type=registry — кэш хранится как специальный образ в registry',
                    'type=gha — кэш в GitHub Actions cache (быстрее, но только в GitHub)',
                    'type=local — кэш на диске (для self-hosted CI с persistent storage)',
                    'type=inline — минимальный кэш внутри самого образа (только последний слой)',
                    'mode=max — кэшировать все слои (включая промежуточные стадии). Без max — только финальные',
                  ],
                },
                {
                  type: 'note',
                  text: 'mode=max даёт лучший hit rate, но и размер кэша больше. Для multi-stage Dockerfile — обязательно max, иначе промежуточные стадии не кэшируются. Для одностадийного Dockerfile достаточно default.',
                },
              ],
            },
            {
              id: 'dk-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем выносить кэш сборки в registry при работе с CI?',
                options: [
                  { id: 'a', text: 'Чтобы образ был меньше' },
                  { id: 'b', text: 'Чтобы каждый CI-джоб не собирал всё заново на чистой машине' },
                  { id: 'c', text: 'Чтобы Docker Hub не блокировал' },
                  { id: 'd', text: 'Это требование BuildKit' },
                ],
                correct: ['b'],
                explanation:
                  'CI-джобы стартуют на чистых машинах. Без внешнего кэша каждый джоб собирает все слои заново — 5 минут на каждый push. Registry или GHA cache даёт готовые слои.',
              },
            },
          ],
        },
        {
          id: 'dk-l15',
          title: 'Build secrets и безопасные аргументы',
          minutes: 25,
          steps: [
            {
              id: 'dk-l15-s1',
              title: 'Почему ARG и ENV не годятся для секретов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В прошлом модуле мы говорили: секреты в ENV остаются в истории слоёв. С ARG та же проблема: `--build-arg TOKEN=xxx` попадёт в `docker history` и в кэш. Для токенов, паролей и ключей нужен специальный механизм — BuildKit secrets.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Правильно: секрет только на время RUN',
                  code: '# Синтаксис BuildKit обязателен\n# syntax=docker/dockerfile:1.7\nFROM python:3.12-slim\n\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Секрет монтируется только в этот RUN\n# После RUN он исчезает — не остаётся ни в одном слое\nRUN --mount=type=secret,id=pypi_token \\\n    PIP_INDEX_URL=https://$(cat /run/secrets/pypi_token)@pypi.example.com/simple \\\n    pip install --no-cache-dir -r requirements-extra.txt\n\nCOPY . .\nCMD ["python", "main.py"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Передача секрета при сборке',
                  code: 'echo "$PYPI_TOKEN" > /tmp/pypi_token\ndocker buildx build \\\n  --secret id=pypi_token,src=/tmp/pypi_token \\\n  -t myapp:1.0 .\nrm /tmp/pypi_token\n\n# Или из переменной окружения:\ndocker buildx build \\\n  --secret id=pypi_token,env=PYPI_TOKEN \\\n  -t myapp:1.0 .',
                },
                {
                  type: 'list',
                  items: [
                    '--mount=type=secret,id=NAME — монтирует секрет в /run/secrets/NAME на время RUN',
                    'После RUN файл исчезает, в слое его нет',
                    'Секрет не попадает в `docker history`',
                    '--secret id=...,src=... — из файла; --secret id=...,env=... — из переменной окружения',
                    'Директива # syntax=docker/dockerfile:1.7 обязательна для --mount=type=secret',
                  ],
                },
              ],
            },
            {
              id: 'dk-l15-s2',
              title: 'SSH-агент и git clone',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Клонирование приватного репозитория',
                  code: '# syntax=docker/dockerfile:1.7\nFROM node:20-alpine\n\n# Монтируем SSH-агент хоста — ключ не копируется в образ\nRUN apk add --no-cache openssh-client git\nRUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts\n\nRUN --mount=type=ssh \\\n    git clone git@github.com:myorg/private-repo.git /app\n\nWORKDIR /app\nRUN npm ci\nCMD ["node", "index.js"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Сборка с SSH-агента',
                  code: '# Требуется ssh-agent на хосте и загруженный ключ\neval $(ssh-agent -s)\nssh-add ~/.ssh/id_ed25519\n\ndocker buildx build --ssh default -t myapp:1.0 .',
                },
                {
                  type: 'note',
                  text: 'SSH-ключ не попадает в образ и не остаётся в слоях. Монтируется через SSH-агент хоста и исчезает после RUN. Это единственный безопасный способ клонировать приватные репозитории во время сборки.',
                },
              ],
            },
            {
              id: 'dk-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `--build-arg PASSWORD=xxx` — плохая передача секрета?',
                options: [
                  { id: 'a', text: 'BuildKit не поддерживает --build-arg' },
                  { id: 'b', text: 'Значение попадёт в docker history и в кэш слоёв' },
                  { id: 'c', text: 'Слишком медленно' },
                  { id: 'd', text: 'Пароль будет в открытом виде в терминале — только это' },
                ],
                correct: ['b'],
                explanation:
                  '--build-arg записывается в историю слоёв и в кэш, его видно через docker history <image>. Для секретов — только --mount=type=secret, который не оставляет следов.',
              },
            },
          ],
        },
        {
          id: 'dk-l16',
          title: 'Multi-arch: один образ на все архитектуры',
          minutes: 25,
          steps: [
            {
              id: 'dk-l16-s1',
              title: 'Зачем multi-arch',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Образ, собранный на Intel/AMD (amd64), не запустится на Apple Silicon (arm64) и на Raspberry Pi (arm64/armv7) — и наоборот. Multi-arch образ содержит несколько вариантов под одной «крышей» (manifest list), и Docker сам выбирает нужный.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Сборка под две архитектуры',
                  code: 'docker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  -t myuser/myapp:1.4.2 \\\n  --push \\\n  .\n\n# Теперь на любом устройстве:\ndocker pull myuser/myapp:1.4.2\n# Docker сам выберет amd64 или arm64',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка manifest list',
                  code: 'docker manifest inspect myuser/myapp:1.4.2\n\n# Вывод покажет два манифеста:\n#   linux/amd64\n#   linux/arm64',
                },
                {
                  type: 'note',
                  text: 'Для multi-arch нужен buildx с драйвером docker-container (не docker). На Apple Silicon/Windows — эмуляция через QEMU замедляет arm64-сборку в 2–5 раз. В CI — отдельный arm-раннер (GitHub: ubuntu-latest-arm, но это платно) или cross-compile.',
                },
              ],
            },
            {
              id: 'dk-l16-s2',
              title: 'Dockerfile для multi-arch',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если базовый образ и бинарники уже multi-arch (Python, Node, Go — скомпилировать под целевую архитектуру), Dockerfile переписывать не нужно. Проблемы начинаются, если внутри вы ставите системные пакеты с предкомпилированными бинарниками.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Multi-arch Go — правильный подход',
                  code: 'FROM --platform=$BUILDPLATFORM golang:1.23 AS build\nARG TARGETOS TARGETARCH\nWORKDIR /src\nCOPY go.* ./\nRUN go mod download\nCOPY . .\n\n# Кросс-компиляция под целевую платформу\nRUN GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /out/app ./cmd/server\n\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /out/app /app\nENTRYPOINT ["/app"]',
                },
                {
                  type: 'list',
                  items: [
                    'FROM --platform=$BUILDPLATFORM — собираем на родной архитектуре сборщика',
                    'ARG TARGETOS TARGETARCH — куда собирать, задаётся buildx автоматически',
                    'GOOS=$TARGETOS GOARCH=$TARGETARCH — кросс-компиляция вместо эмуляции',
                    'Для Python и Node такой трюк не сработает — там нужна эмуляция через QEMU или кросс-базовый образ',
                  ],
                },
                {
                  type: 'note',
                  text: 'Кросс-компиляция (Go, Rust, C++ с готовым toolchain) — быстрая. Эмуляция через QEMU (Python, Node с pip/npm install) — медленная, но универсальная. Для Python-образов multi-arch в CI — 10–20 минут на arm64.',
                },
              ],
            },
            {
              id: 'dk-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно для сборки multi-arch образа?',
                options: [
                  { id: 'a', text: 'Buildx с драйвером docker-container' },
                  { id: 'b', text: 'Флаг --platform linux/amd64,linux/arm64' },
                  { id: 'c', text: 'Два разных Dockerfile для каждой архитектуры' },
                  { id: 'd', text: 'QEMU или кросс-компиляция для целевой архитектуры' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Buildx + --platform + QEMU/кросс-компиляция. Один Dockerfile — это и есть смысл multi-arch: одинаковый рецепт, разные бинарники под капотом. Два разных Dockerfile — антипаттерн.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'dk-m6',
      title: 'Безопасность образов',
      lessons: [
        {
          id: 'dk-l17',
          title: 'Сканирование уязвимостей: Trivy, Docker Scout',
          minutes: 25,
          steps: [
            {
              id: 'dk-l17-s1',
              title: 'Зачем сканировать',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Любой базовый образ содержит десятки пакетов: openssl, libc, glibc, curl. В них регулярно находят CVE (уязвимости). Сканирование показывает, что именно в вашем образе уязвимо и насколько критично. Это первый шаг supply-chain security.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Trivy: быстрый старт',
                  code: '# Сканирование образа\ntrivy image nginx:1.27\n\n# Только критичные и high\ntrivy image --severity HIGH,CRITICAL myapp:1.4.2\n\n# Выход с ошибкой при найденных уязвимостях (для CI)\ntrivy image --exit-code 1 --severity HIGH,CRITICAL myapp:1.4.2\n\n# JSON-отчёт для парсинга\ntrivy image -f json -o report.json myapp:1.4.2',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Docker Scout (встроен в Docker Desktop)',
                  code: '# Быстрый обзор\ndocker scout quickview myapp:1.4.2\n\n# Подробный отчёт по CVE\ndocker scout cves myapp:1.4.2\n\n# Рекомендации по обновлению базового образа\ndocker scout recommendations myapp:1.4.2',
                },
                {
                  type: 'list',
                  items: [
                    'Trivy (Aqua Security) — open-source, быстрый, поддержка всех языков и ОС',
                    'Docker Scout — встроен в Docker Desktop, красивый UI, интеграция с Hub',
                    'Grype (Anchore) — альтернатива Trivy, тоже open-source',
                    'Snyk Container — коммерческий, глубокий анализ, интеграции',
                    'GitHub Dependabot — обновляет зависимости, но не сканирует готовые образы',
                  ],
                },
              ],
            },
            {
              id: 'dk-l17-s2',
              title: 'Что с уязвимостями делать',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Найти CVE — полдела. Реальная проблема — их количество. В образе на 500 МБ может быть 200+ CVE, и 90% из них — в пакетах, которые вы не используете. Задача не «устранить всё», а приоритизировать.',
                },
                {
                  type: 'table',
                  caption: 'Приоритизация',
                  head: ['Severity', 'Действие', 'Срок'],
                  rows: [
                    ['Critical', 'Чинить или обосновать, почему нельзя', 'Немедленно / блокер релиза'],
                    ['High', 'Чинить в текущем спринте', '1–2 недели'],
                    ['Medium', 'Плановое обновление', 'Месяц'],
                    ['Low', 'Игнорировать или обновить с базовым образом', 'Когда удобно'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Три способа уменьшить количество CVE',
                  code: '1. Меньше образ = меньше пакетов = меньше CVE\n   alpine, slim, distroless вместо полных образов\n\n2. Свежий базовый образ\n   nginx:1.27-alpine вместо nginx:1.19-alpine\n   (в старых версиях накапливаются CVE)\n\n3. Multi-stage + минимальный runtime\n   сборка в тяжёлом образе, копирование артефакта в лёгкий\n   → компиляторы, pip, npm остаются в build-стадии',
                },
                {
                  type: 'note',
                  text: 'CVE в пакетах, которые не используются в вашем приложении (например, git в базовом образе, если вы не делаете git-операции) — формально уязвимость, но фактически не эксплуатируется. Trivy показывает их все — фильтруйте по реальному использованию.',
                },
              ],
            },
            {
              id: 'dk-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой практический шаг уменьшит количество CVE в образе сильнее всего?',
                options: [
                  { id: 'a', text: 'Игнорировать все low-severity' },
                  { id: 'b', text: 'Перейти на минимальный базовый образ (alpine/distroless) и multi-stage' },
                  { id: 'c', text: 'Сканировать чаще' },
                  { id: 'd', text: 'Использовать другой scanner' },
                ],
                correct: ['b'],
                explanation:
                  'Меньше пакетов = меньше CVE. Alpine (5 МБ, ~20 пакетов) vs ubuntu (77 МБ, ~200 пакетов) — разница в разы. Multi-stage убирает компиляторы и dev-зависимости из финального образа.',
              },
            },
          ],
        },
        {
          id: 'dk-l18',
          title: 'SBOM и подпись образов',
          minutes: 25,
          steps: [
            {
              id: 'dk-l18-s1',
              title: 'SBOM: что внутри образа',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'SBOM (Software Bill of Materials) — «состав» образа: все пакеты и их версии. Нужен для аудита, безопасности и compliance: «а есть ли у нас log4j 2.14?», «какие версии библиотек в проде?». Отвечать на такие вопросы без SBOM — дни, с SBOM — секунды.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Генерация SBOM через Trivy',
                  code: '# CycloneDX (стандарт OWASP)\ntrivy image -f cyclonedx -o sbom.cdx.json myapp:1.4.2\n\n# SPDX (стандарт Linux Foundation)\ntrivy image -f spdx-json -o sbom.spdx.json myapp:1.4.2\n\n# Присоединить SBOM к образу в registry (Trivy + cosign)\ntrivy image -f cyclonedx -o sbom.cdx.json myapp:1.4.2\ncosign attach sbom --sbom sbom.cdx.json myapp:1.4.2',
                },
                {
                  type: 'list',
                  items: [
                    'CycloneDX (OWASP) — популярный, компактный JSON',
                    'SPDX (Linux Foundation) — старше, более формальный',
                    'Syft (Anchore) — альтернативный генератор SBOM',
                    'SBOM прикрепляется к образу в registry (cosign attach)',
                    'При сборке — публикуйте SBOM как артефакт: для аудита',
                  ],
                },
              ],
            },
            {
              id: 'dk-l18-s2',
              title: 'Подпись через cosign',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Подпись образа гарантирует, что образ собран именно вами и не был подменён. При деплое проверяется подпись — если не совпала, деплой блокируется. Это защита от supply-chain атак: злоумышленник не сможет подменить образ в registry.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Cosign: подпись и проверка',
                  code: '# Генерация ключевой пары\ncosign generate-key-pair\n# Создаст cosign.key (приватный, хранить в secrets) и cosign.pub (публичный)\n\n# Подпись образа\ncosign sign --key cosign.key ghcr.io/myorg/myapp:1.4.2\n\n# Проверка подписи (например, в admission controller K8s)\ncosign verify --key cosign.pub ghcr.io/myorg/myapp:1.4.2',
                },
                {
                  type: 'note',
                  text: 'Cosign — часть проекта Sigstore (Linux Foundation). Для open-source проектов можно использовать «keyless» подпись через OIDC (без хранения ключей). Для приватных — key-based проще. На собеседовании по DevSecOps это спросят.',
                },
              ],
            },
            {
              id: 'dk-l18-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что даёт подпись образа (cosign)?',
                options: [
                  { id: 'a', text: 'Уменьшает размер образа' },
                  { id: 'b', text: 'Гарантирует, что образ собран вами и не подменён' },
                  { id: 'c', text: 'Ускоряет pull из registry' },
                  { id: 'd', text: 'Сканирует уязвимости' },
                ],
                correct: ['b'],
                explanation:
                  'Подпись — криптографическое подтверждение авторства. При деплое проверяется публичным ключом: если подпись не сходится — образ не наш или подменён. Не путать со сканированием (CVE) и SBOM (состав).',
              },
            },
          ],
        },
        {
          id: 'dk-l19',
          title: 'Distroless и минимальные образы',
          minutes: 20,
          steps: [
            {
              id: 'dk-l19-s1',
              title: 'Что такое distroless',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Distroless — образы Google без пакетного менеджера, без shell, без стандартных утилит. Внутри — только runtime приложения и минимальные зависимости. Размер — 2–20 МБ. Площадь атаки — минимальная: нет `sh`, `apt`, `curl`, которые обычно эксплуатируют злоумышленники.',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Go в distroless (5 МБ)',
                  code: 'FROM golang:1.23 AS build\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 GOOS=linux go build -o /app ./cmd/server\n\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /app /app\nUSER nonroot:nonroot\nENTRYPOINT ["/app"]',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Python в distroless (сложнее: нужен интерпретатор)',
                  code: 'FROM python:3.12-slim AS build\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\n\nFROM gcr.io/distroless/python3-debian12\nCOPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages\nCOPY --from=build /app /app\nWORKDIR /app\nUSER nonroot:nonroot\nENTRYPOINT ["python", "main.py"]',
                },
                {
                  type: 'note',
                  text: 'Distroless не подходит, если нужен shell для отладки или bash-скрипты. Альтернатива — alpine (есть sh, но ~5 МБ и musl libc, с которым бывают проблемы) или slim-образы Debian (30–50 МБ, есть shell). Для Go/Rust distroless — стандарт. Для Python/Node — чуть сложнее из-за интерпретатора.',
                },
              ],
            },
            {
              id: 'dk-l19-s2',
              title: 'Non-root, read-only, capabilities',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Оборонительный Dockerfile',
                  code: 'FROM python:3.12-slim\n\n# Non-root пользователь\nRUN groupadd -r app && useradd -r -g app app\n\nWORKDIR /app\nCOPY --chown=app:app . .\n\nUSER app\n\n# Read-only файловая система (если приложению не нужно писать)\n# Это не в Dockerfile, а при запуске:\n# docker run --read-only --tmpfs /tmp myapp:1.4.2\n\n# Только нужные capabilities\n# docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp:1.4.2\n\nENTRYPOINT ["python", "main.py"]',
                },
                {
                  type: 'list',
                  items: [
                    'USER app — процесс работает не от root',
                    '--read-only — корневая ФС только на чтение (защита от подмены файлов)',
                    '--tmpfs /tmp — временный каталог в памяти для временных файлов',
                    '--cap-drop=ALL — убрать все Linux capabilities',
                    '--cap-add=NET_BIND_SERVICE — добавить только ту, что нужна (порт < 1024)',
                    '--security-opt=no-new-privileges — запрет на повышение привилегий',
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск «по-взрослому»',
                  code: 'docker run -d \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --cap-drop=ALL \\\n  --security-opt=no-new-privileges \\\n  --user 1000:1000 \\\n  --memory 256m \\\n  --cpus 1 \\\n  -p 8000:8000 \\\n  myapp:1.4.2',
                },
              ],
            },
            {
              id: 'dk-l19-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры уменьшают площадь атаки контейнера?',
                options: [
                  { id: 'a', text: 'Использование distroless-образа' },
                  { id: 'b', text: 'Запуск от non-root пользователя' },
                  { id: 'c', text: '--read-only для корневой ФС' },
                  { id: 'd', text: 'Запуск с --privileged' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'Distroless, non-root, read-only — три кита безопасности. --privileged — наоборот, даёт контейнеру почти полный доступ к хосту, это максимальный риск. Никогда не используйте его без крайней необходимости.',
              },
            },
          ],
        },
        {
          id: 'dk-l20',
          title: 'Security в CI: pipeline с проверками',
          minutes: 25,
          steps: [
            {
              id: 'dk-l20-s1',
              title: 'Что проверять на каждом этапе',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/build.yml — полный security-pipeline',
                  code: 'name: build-and-secure\non: [push, pull_request]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n      id-token: write   # для keyless cosign\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: docker/setup-buildx-action@v3\n\n      - name: Login to GHCR\n        uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - name: Build and push\n        uses: docker/build-push-action@v6\n        with:\n          context: .\n          push: true\n          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n          provenance: true    # SLSA provenance\n          sbom: true          # SBOM встроен в манифест\n\n      - name: Scan for vulnerabilities\n        uses: aquasecurity/trivy-action@0.28.0\n        with:\n          image-ref: ghcr.io/${{ github.repository }}:${{ github.sha }}\n          format: table\n          exit-code: 1\n          severity: HIGH,CRITICAL\n          ignore-unfixed: true\n\n      - name: Generate SBOM\n        run: |\n          trivy image -f cyclonedx -o sbom.cdx.json \\\n            ghcr.io/${{ github.repository }}:${{ github.sha }}\n\n      - uses: actions/upload-artifact@v4\n        with:\n          name: sbom\n          path: sbom.cdx.json\n\n      - name: Sign image with cosign (keyless)\n        uses: sigstore/cosign-installer@v3\n\n      - run: |\n          cosign sign --yes ghcr.io/${{ github.repository }}:${{ github.sha }}',
                },
                {
                  type: 'list',
                  items: [
                    'provenance: true — SLSA provenance (кто, когда, из какого коммита собрал)',
                    'sbom: true — SBOM встроен в манифест образа (не отдельный файл)',
                    'trivy с exit-code: 1 — падает при HIGH/CRITICAL (блокирует merge)',
                    'ignore-unfixed: true — игнорировать CVE, для которых нет патча',
                    'cosign keyless — подпись через OIDC GitHub, без хранения ключей',
                  ],
                },
              ],
            },
            {
              id: 'dk-l20-s2',
              title: 'Практические рекомендации',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Сканирование — на каждом PR, но не блокируйте merge на MEDIUM/LOW (слишком много шума)',
                    'Блокируйте только HIGH/CRITICAL без фикса — остальное в issue',
                    'Автоматическое обновление базовых образов: Dependabot / Renovate',
                    'Периодическая пересборка (weekly), даже если код не менялся — обновление CVE',
                    'SBOM — артефакт сборки, не «когда-нибудь потом»',
                    'Подпись — для прод-образов, не для dev',
                    'Разделение: PR-пайплайн (быстрый) vs nightly (полный)',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Dependabot для Docker',
                  code: '# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: "docker"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n    # Автоматически создаст PR с обновлением базового образа',
                },
                {
                  type: 'note',
                  text: 'На собеседовании по DevSecOps спросят: «Как вы управляете CVE в образах?». Хороший ответ: «Trivy на каждый PR, блокируем HIGH/CRITICAL, Dependabot обновляет базовые образы weekly, еженедельная пересборка для свежих патчей, SBOM публикуем как артефакт». Это показывает зрелый процесс.',
                },
              ],
            },
            {
              id: 'dk-l20-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему стоит пересобирать образы раз в неделю, даже если код не менялся?',
                options: [
                  { id: 'a', text: 'Docker требует регулярной сборки' },
                  { id: 'b', text: 'Чтобы подтянуть свежие патчи безопасности из базового образа' },
                  { id: 'c', text: 'Чтобы уменьшить размер' },
                  { id: 'd', text: 'Это миф, пересборка не нужна' },
                ],
                correct: ['b'],
                explanation:
                  'Базовые образы обновляются с патчами CVE. Если код не менялся, но базовый образ получил патч — пересборка подтянет его. Weekly — стандарт: не слишком часто, но достаточно для безопасности.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'dk-m7',
      title: 'Логи, отладка, мониторинг',
      lessons: [
        {
          id: 'dk-l21',
          title: 'Логи контейнеров и драйверы',
          minutes: 25,
          steps: [
            {
              id: 'dk-l21-s1',
              title: 'Куда пишут контейнеры',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Контейнер должен писать логи в stdout и stderr — это фундаментальное правило 12-factor. Docker перехватывает их через logging driver: json-file (по умолчанию), journald, syslog, fluentd, gelf и другие.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: 'docker logs mycontainer           # все логи\ndocker logs -f mycontainer        # follow (tail -f)\ndocker logs --tail 100 mycontainer  # последние 100 строк\ndocker logs --since 10m mycontainer # за последние 10 минут\ndocker logs --timestamps mycontainer # с метками времени\ndocker logs mycontainer 2>&1 | grep ERROR   # только ошибки',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Драйверы логирования',
                  code: 'docker run --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 nginx\n\n# Другие драйверы:\n#   journald       → journalctl -u docker\n#   syslog         → /var/log/syslog\n#   fluentd        → в Elasticsearch / Loki\n#   gelf           → в Graylog\n#   awslogs        → в CloudWatch',
                },
                {
                  type: 'note',
                  text: 'Дефолтный json-file не имеет ротации! Через месяц /var/lib/docker/containers/ съест весь диск. Всегда указывайте --log-opt max-size=10m --log-opt max-file=3, либо используйте другой драйвер. Это классический инцидент «диск на проде забился логами».',
                },
              ],
            },
            {
              id: 'dk-l21-s2',
              title: 'Структурированные логи',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Логи должны быть JSON-строками, а не plaintext. Парсить «[INFO] user 123 logged in at 2024-01-01» сложно, а `{"level":"info","user_id":123,"action":"login"}` — тривиально. В продакшене structured logs — обязательны.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Python: structlog или json-логи',
                  code: 'import logging\nimport json\nimport sys\n\nclass JsonFormatter(logging.Formatter):\n    def format(self, record):\n        return json.dumps({\n            "level": record.levelname,\n            "msg": record.getMessage(),\n            "logger": record.name,\n            "time": self.formatTime(record),\n        })\n\nhandler = logging.StreamHandler(sys.stdout)  # stdout, не файл!\nhandler.setFormatter(JsonFormatter())\nlogging.basicConfig(level=logging.INFO, handlers=[handler])\n\nlogging.info("user logged in", extra={"user_id": 123})',
                },
                {
                  type: 'list',
                  items: [
                    'Писать в stdout/stderr, а не в файлы внутри контейнера',
                    'JSON-формат: level, timestamp, message, поля контекста',
                    'Уровни: DEBUG, INFO, WARN, ERROR — не всё в INFO',
                    'Не логировать секреты (пароли, токены, номера карт)',
                    'Один лог = одна строка (не многострочные), чтобы парсилось',
                  ],
                },
              ],
            },
            {
              id: 'dk-l21-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если не настроить ротацию логов на json-file драйвере?',
                options: [
                  { id: 'a', text: 'Docker сам удалит старые логи' },
                  { id: 'b', text: 'Файлы логов будут расти, пока не закончится место на диске' },
                  { id: 'c', text: 'Логи не будут записываться' },
                  { id: 'd', text: 'Приложение упадёт' },
                ],
                correct: ['b'],
                explanation:
                  'json-file без max-size и max-file растёт бесконечно. Через месяцы /var/lib/docker/containers/ забивает диск, и весь сервер встаёт. Классическая проблема, которую ловят слишком поздно.',
              },
            },
          ],
        },
        {
          id: 'dk-l22',
          title: 'Отладка: exec, inspect, diff, cp',
          minutes: 25,
          steps: [
            {
              id: 'dk-l22-s1',
              title: 'Как попасть внутрь',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker exec — главный инструмент',
                  code: 'docker exec -it mycontainer sh        # shell внутри\ndocker exec -it mycontainer bash      # если есть bash\ndocker exec mycontainer ps aux        # одна команда, без shell\ndocker exec -it -u root mycontainer sh  # от root (если контейнер non-root)\ndocker exec mycontainer cat /etc/os-release\ndocker exec -it mycontainer env       # переменные окружения',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker inspect — метаданные',
                  code: 'docker inspect mycontainer                    # всё\ndocker inspect -f \'{{.State.Status}}\' mycontainer\ndocker inspect -f \'{{.NetworkSettings.IPAddress}}\' mycontainer\ndocker inspect -f \'{{json .Config.Env}}\' mycontainer | jq\ndocker inspect -f \'{{.State.ExitCode}}\' mycontainer\ndocker inspect -f \'{{.HostConfig.Memory}}\' mycontainer\ndocker inspect mycontainer | jq \'.[0].NetworkSettings.Ports\'',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Файлы и diff',
                  code: 'docker cp mycontainer:/app/config.yml ./config.yml   # из контейнера\ndocker cp ./local.txt mycontainer:/tmp/                # в контейнер\n\ndocker diff mycontainer   # что изменилось в ФС относительно образа\ndocker commit mycontainer myimage:snapshot   # «снимок» состояния (антипаттерн!)',
                },
              ],
            },
            {
              id: 'dk-l22-s2',
              title: 'Отладка проблем: алгоритм',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Контейнер не запускается или падает',
                  code: '1. docker ps -a → какой exit code?\n   Exit 0 — приложение завершилось «нормально» (не должно в проде)\n   Exit 1 — ошибка приложения (смотреть логи)\n   Exit 137 → SIGKILL (OOMKilled или docker kill)\n   Exit 143 → SIGTERM (graceful shutdown)\n\n2. docker logs mycontainer → что приложение говорит\n\n3. docker inspect mycontainer | jq \'.[0].State\'\n   → OOMKilled? Error? ExitCode?\n\n4. docker inspect -f \'{{.HostConfig.Memory}}\' — хватает ли памяти?\n\n5. Если контейнер стартует и падает — попробовать с shell:\n   docker run --rm -it myimage sh\n   (если distroless — шелла нет, сложнее)\n\n6. docker exec в живой контейнер — проверить сеть, DNS, файлы',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка сети и зависимостей',
                  code: '# Запускаем отдельный контейнер в сети контейнера\ndocker run --rm -it --network container:mycontainer alpine sh\n\n# Внутри — проверяем связь с БД, DNS, порты:\nnslookup db\ntelnet db 5432\nwget -qO- http://api:8000/health\n\n# Или просто:\ndocker exec mycontainer nslookup db\ndocker exec mycontainer ping db',
                },
                {
                  type: 'note',
                  text: 'Если distroless (нет sh) — `docker run --rm -it --network container:mycontainer alpine sh` запустит отдельный alpine-контейнер в той же сети. Это стандартный трюк для отладки distroless.',
                },
              ],
            },
            {
              id: 'dk-l22-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Контейнер упал с exit code 137. Что это значит?',
                options: [
                  { id: 'a', text: 'Приложение вернуло ошибку' },
                  { id: 'b', text: 'SIGKILL: обычно OOMKilled или docker kill' },
                  { id: 'c', text: 'Приложение завершилось нормально' },
                  { id: 'd', text: 'Порт уже занят' },
                ],
                correct: ['b'],
                explanation:
                  '137 = 128 + 9 = SIGKILL. Чаще всего OOMKilled: контейнеру не хватило памяти, ядро убило процесс. Проверьте docker inspect → State.OOMKilled и Memory limit. Реже — docker kill.',
              },
            },
          ],
        },
        {
          id: 'dk-l23',
          title: 'Мониторинг: docker stats и cAdvisor',
          minutes: 20,
          steps: [
            {
              id: 'dk-l23-s1',
              title: 'docker stats: живые метрики',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker stats',
                  code: 'docker stats                          # все контейнеры в реальном времени\ndocker stats --no-stream              # один снимок, без обновления\ndocker stats mycontainer              # один контейнер\ndocker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что показывают колонки',
                  code: 'CPU %       — использование CPU относительно лимита\nMEM USAGE   — сколько памяти занято\nMEM %       — относительно лимита\nNET I/O     — сетевая активность (read / write)\nBLOCK I/O   — дисковая активность\nPIDS        — сколько процессов внутри контейнера',
                },
                {
                  type: 'note',
                  text: 'docker stats показывает только запущенные контейнеры. Для истории и алертов — cAdvisor + Prometheus + Grafana. docker stats — для «глянуть прямо сейчас», а не для мониторинга в проде.',
                },
              ],
            },
            {
              id: 'dk-l23-s2',
              title: 'cAdvisor и Prometheus',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'cAdvisor (Google) — стандартный инструмент для сбора метрик Docker-контейнеров. Собирает CPU, память, диск, сеть по каждому контейнеру и отдаёт в формате Prometheus. В продакшене — cAdvisor + Prometheus + Grafana — классический стек.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск cAdvisor',
                  code: 'docker run -d \\\n  --name=cadvisor \\\n  --volume=/:/rootfs:ro \\\n  --volume=/var/run:/var/run:ro \\\n  --volume=/sys:/sys:ro \\\n  --volume=/var/lib/docker/:/var/lib/docker:ro \\\n  --volume=/dev/disk/:/dev/disk:ro \\\n  --publish=8080:8080 \\\n  --detach=true \\\n  --privileged \\\n  --device=/dev/kmsg \\\n  gcr.io/cadvisor/cadvisor:latest\n\n# Метрики доступны на http://localhost:8080/metrics\n# UI на http://localhost:8080/',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'prometheus.yml: собираем метрики',
                  code: 'global:\n  scrape_interval: 15s\n\nscrape_configs:\n  - job_name: cadvisor\n    static_configs:\n      - targets: [\'cadvisor:8080\']',
                },
                {
                  type: 'note',
                  text: 'Для одного сервера cAdvisor + Prometheus + Grafana — это 3 контейнера. Для K8s — Prometheus Operator, node-exporter и kube-state-metrics покрывают то же самое. На собеседовании по DevOps спросят: «Как мониторите контейнеры?» — правильный ответ именно такой.',
                },
              ],
            },
            {
              id: 'dk-l23-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что из перечисленного — инструменты мониторинга контейнеров?',
                options: [
                  { id: 'a', text: 'docker stats' },
                  { id: 'b', text: 'cAdvisor + Prometheus + Grafana' },
                  { id: 'c', text: 'Dockerfile' },
                  { id: 'd', text: 'docker logs' },
                ],
                correct: ['a', 'b'],
                explanation:
                  'docker stats — быстрый взгляд. cAdvisor + Prometheus + Grafana — стандартный стек. Dockerfile — рецепт сборки, не мониторинг. docker logs — логи, а не метрики (хотя иногда используется для отладки).',
              },
            },
          ],
        },
        {
          id: 'dk-l24',
          title: 'Healthcheck и restart policies в проде',
          minutes: 25,
          steps: [
            {
              id: 'dk-l24-s1',
              title: 'HEALTHCHECK в Dockerfile',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'HEALTHCHECK',
                  code: 'FROM python:3.12-slim\n\n# ... приложение ...\n\nHEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\n  CMD python -c "import urllib.request; urllib.request.urlopen(\'http://localhost:8000/health\').read()" || exit 1',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Что покажет docker ps',
                  code: 'docker ps\n# CONTAINER ID   IMAGE         STATUS                    NAMES\n# abc123         myapp:1.4.2   Up 5 minutes (healthy)     web\n# def456         myapp:1.4.2   Up 2 minutes (unhealthy)   api\n# ghi789         myapp:1.4.2   Up 1 minute (health: starting)  worker',
                },
                {
                  type: 'list',
                  items: [
                    'HEALTHCHECK — команда, которая проверяет «жив ли сервис»',
                    '--interval=30s — как часто проверять',
                    '--timeout=3s — таймаут на проверку',
                    '--start-period=5s — сколько подождать до первой проверки (прогрев)',
                    '--retries=3 — сколько подряд неудач до статуса unhealthy',
                  ],
                },
                {
                  type: 'note',
                  text: 'HEALTHCHECK сам по себе НЕ перезапускает контейнер. Он только помечает статус. Перезапуск — задача оркестратора (docker swarm, Kubernetes, docker compose) или restart policy. На собеседовании это любят спрашивать: «HEALTHCHECK и restart — это одно и то же?» — нет.',
                },
              ],
            },
            {
              id: 'dk-l24-s2',
              title: 'Restart policies',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Четыре политики',
                  head: ['Политика', 'Когда перезапускает', 'Для чего'],
                  rows: [
                    ['no', 'Никогда (по умолчанию)', 'Одноразовые задачи, batch'],
                    ['on-failure[:max]', 'Только exit != 0', 'Джобы, фоновые обработчики'],
                    ['always', 'Всегда, даже после docker restart', 'Долгоживущие сервисы'],
                    ['unless-stopped', 'Всегда, кроме явной остановки', 'Стандарт для прода'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Примеры',
                  code: '# Прод-сервис\n# --restart unless-stopped: перезапустится после падения и после reboot\n# но не после docker stop (если вы явно остановили — так и надо)\ndocker run -d --restart unless-stopped --name web myapp:1.4.2\n\n# Batch-джоба — не перезапускать\n# --restart no: упал — упал, следующая попытка по крону\ndocker run --rm --restart no mybatch:1.0\n\n# С лимитом попыток\ndocker run -d --restart on-failure:5 --name worker myworker:1.0',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'В docker compose',
                  code: 'services:\n  web:\n    image: myapp:1.4.2\n    restart: unless-stopped\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]\n      interval: 30s\n      timeout: 3s\n      retries: 3\n      start_period: 5s',
                },
                {
                  type: 'note',
                  text: 'Комбинация, которую используют в проде: --restart unless-stopped + HEALTHCHECK + depends_on: condition: service_healthy (в compose). Тогда сервис перезапускается при падении И при провале healthcheck (compose сам убивает unhealthy и перезапускает, если restart policy позволяет).',
                },
              ],
            },
            {
              id: 'dk-l24-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая restart policy лучше всего для долгоживущего прод-сервиса?',
                options: [
                  { id: 'a', text: 'no' },
                  { id: 'b', text: 'always' },
                  { id: 'c', text: 'on-failure' },
                  { id: 'd', text: 'unless-stopped' },
                ],
                correct: ['d'],
                explanation:
                  'unless-stopped = «перезапускай всегда, кроме явной остановки». always тоже перезапускает после docker stop при следующем docker start — что иногда нежелательно. unless-stopped — стандарт для прода.',
              },
            },
          ],
        },
      ],
    },
  ],
};