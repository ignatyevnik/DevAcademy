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
          minutes: 20,
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
                  type: 'mermaid',
                  caption: 'Разница между виртуальной машиной и контейнером',
                  code: 'graph TD\n    subgraph VM["Виртуальная машина"]\n      App1[Приложение] --> GuestOS1[Гостевая ОС]\n      GuestOS1 --> Hypervisor[Гипервизор]\n    end\n    \n    subgraph Docker["Контейнер (Docker)"]\n      App2[Приложение] --> Engine[Docker Engine]\n    end\n    \n    Hypervisor --> HostOS["Хостовая ОС (Windows/Linux)"]\n    Engine --> HostOS',
                },
                { type: 'h3', text: 'Почему это важно' },
                {
                  type: 'list',
                  items: [
                    'Старт за миллисекунды вместо минут у ВМ.',
                    'Одинаковое окружение у разработчика, в CI и на проде: «работает у меня» исчезает.',
                    'Образ — переносимый артефакт: собрал один раз, запускаешь где угодно.',
                  ],
                },
                { type: 'note', text: 'Образ (image) — неизменяемый шаблон со слоями. Контейнер — запущенный экземпляр образа с тонким записываемым слоем поверх. Один образ → много контейнеров.' },
              ],
            },
            {
              id: 'dk-l1-s2',
              title: 'Namespaces и cgroups',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Изоляция контейнера — не магия, а два механизма ядра Linux. Понимание этих двух слов отличает «слышал про Docker» от «понимаю, как работает».' },
                {
                  type: 'table',
                  caption: 'Два механизма изоляции',
                  head: ['Механизм', 'Что изолирует', 'Пример'],
                  rows: [
                    ['Namespaces', 'Что процесс «видит»: PID, сеть, файловая система, hostname, пользователи', 'В контейнере `ps aux` показывает только его процессы, а не все хоста'],
                    ['cgroups', 'Сколько ресурсов может использовать: CPU, память, I/O', 'Контейнер с `--memory 512m` не съест больше 512 МБ — ядро убьёт'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'PID namespace — свой дерево процессов, контейнер не видит хостовые',
                    'Network namespace — своя сеть, IP, порты',
                    'Mount namespace — своя файловая система',
                    'cgroups v1/v2 — лимиты CPU, памяти, диска',
                    'seccomp / AppArmor — фильтр системных вызовов (защита от эксплойтов)',
                  ],
                },
                { type: 'note', text: 'Namespaces появились в Linux в 2002 (mount) и 2008 (полный набор). Docker в 2013 просто упаковал их в удобный UX — идея была не нова, нова была упаковка. На собеседовании junior DevOps: «на чём основана изоляция контейнеров?» — «namespaces + cgroups».' },
              ],
            },
            {
              id: 'dk-l1-s3',
              title: 'Базовый рабочий цикл',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: 'docker run -d -p 8080:80 --name web nginx   # запуск\ndocker ps                                  # работающие контейнеры\ndocker logs -f web                         # смотрим логи\ndocker exec -it web sh                     # зайти внутрь\ndocker stop web && docker rm web           # остановить и удалить',
                },
                { type: 'p', text: 'Флаг -p 8080:80 пробрасывает порт 80 контейнера на порт 8080 хоста. Флаг -d запускает контейнер в фоне (detached). Без --name Docker придумает случайное имя вроде happy_bohr.' },
                { type: 'p', text: 'Команда docker exec -it … sh открывает shell внутри работающего контейнера — главный инструмент отладки: можно посмотреть файлы, проверить переменные окружения, попинговать соседние сервисы.' },
              ],
            },
            {
              id: 'dk-l1-s4',
              title: 'Проверь себя: изоляция',
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
            {
              id: 'dk-l1-s5',
              title: 'Проверь себя: namespaces и cgroups',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте механизм и его функцию',
                pairs: [
                  { left: 'namespaces', right: 'Изоляция видимости (PID, сеть, FS)' },
                  { left: 'cgroups', right: 'Лимиты ресурсов (CPU, память, I/O)' },
                  { left: 'seccomp', right: 'Фильтр системных вызовов' },
                  { left: 'Docker Engine', right: 'Управляет контейнерами через API' },
                ],
                explanation:
                  'namespaces — «что видит процесс». cgroups — «сколько ресурсов может взять». seccomp — какие syscalls разрешены. Docker Engine — демон, который всем этим управляет.',
              },
            },
          ],
        },
        {
          id: 'dk-l2',
          title: 'Собираем свой образ: Dockerfile',
          minutes: 30,
          steps: [
            {
              id: 'dk-l2-s1',
              title: 'Слои и кэширование',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Dockerfile — рецепт сборки образа. Каждая инструкция создаёт слой. Docker кэширует слои: если инструкция и её входные данные не изменились, слой берётся из кэша. Отсюда главное правило: то, что меняется редко, — выше, то, что меняется часто (ваш код), — ниже.' },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Dockerfile для Python-приложения',
                  code: 'FROM python:3.12-slim\n\nWORKDIR /app\n\n# Зависимости меняются редко — ставим их раньше\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Код меняется часто — копируем последним\nCOPY . .\n\nCMD ["python", "main.py"]',
                },
                { type: 'p', text: 'Если поменять COPY . . местами с установкой зависимостей, каждая правка кода будет заново ставить все пакеты — сборка растянется с секунд до минут.' },
                {
                  type: 'mermaid',
                  caption: 'Какие слои ломают кэш и когда',
                  code: 'graph TD\n  Base["FROM python:3.12-slim"] --> Work["WORKDIR /app"]\n  Work --> Req["COPY requirements.txt"]\n  Req --> Install["RUN pip install"]\n  Install --> Copy["COPY . ."]\n  Copy --> Cmd["CMD python main.py"]\n\n  style Base fill:#90EE90,color:#000\n  style Work fill:#90EE90,color:#000\n  style Req fill:#FFD700,color:#000\n  style Install fill:#FFD700,color:#000\n  style Copy fill:#FF6B6B,color:#000\n  style Cmd fill:#FF6B6B,color:#000',
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
              title: 'Проверь себя: кэш',
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
            {
              id: 'dk-l2-s5',
              title: 'Проверь себя: инструкции Dockerfile',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструкцию Dockerfile и её назначение',
                pairs: [
                  { left: 'FROM', right: 'Базовый образ' },
                  { left: 'WORKDIR', right: 'Рабочая директория внутри образа' },
                  { left: 'COPY', right: 'Скопировать файлы с хоста в образ' },
                  { left: 'CMD', right: 'Команда, запускаемая при старте контейнера' },
                ],
                explanation:
                  'FROM — базовый образ. WORKDIR — рабочая папка. COPY — файлы с хоста. CMD — команда при старте. Ещё важны: RUN (выполнить при сборке), ENV (переменные), ENTRYPOINT (точка входа, в отличие от CMD, не переопределяется аргументами docker run).',
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
          minutes: 30,
          steps: [
            {
              id: 'dk-l3-s1',
              title: 'Куда писать данные',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Записываемый слой контейнера исчезает вместе с ним: удалил контейнер — потерял данные. Для баз данных, загрузок пользователей и логов нужны volumes — управляемые Docker-ом каталоги, которые живут независимо от жизни контейнера.' },
                {
                  type: 'mermaid',
                  caption: 'default bridge vs своя сеть + named volume',
                  code: 'graph LR\n    subgraph Default["default bridge"]\n        A1["app"] -.->|"по имени<br/>не резолвится"| D1["db"]\n    end\n    subgraph Custom["своя сеть"]\n        A2["app"] -->|"db:5432<br/>DNS по имени"| D2["db"]\n    end\n    D2 --> Vol[("volume pgdata")]\n    Vol -.-> Disk["Диск хоста<br/>(переживает<br/>пересоздание)"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Named volume для PostgreSQL',
                  code: 'docker volume create pgdata\ndocker run -d --name db \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v pgdata:/var/lib/postgresql/data \\\n  postgres:16',
                },
                { type: 'h3', text: 'Сети' },
                { type: 'p', text: 'Контейнеры в одной пользовательской сети (docker network create) резолвят друг друга по имени: приложение может подключаться к БД просто по адресу db:5432. Стандартная сеть bridge этого не умеет — всегда создавайте свою.' },
              ],
            },
            {
              id: 'dk-l3-s2',
              title: 'Проверь себя: volume',
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
            {
              id: 'dk-l3-s3',
              title: 'Три типа монтирования',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Docker поддерживает три способа дать контейнеру доступ к данным с хоста. Понимание разницы — обязательный навык: на собеседовании спрашивают «чем volume отличается от bind mount».' },
                {
                  type: 'table',
                  caption: 'Volumes vs bind mounts vs tmpfs',
                  head: ['Тип', 'Где хранится', 'Когда использовать'],
                  rows: [
                    ['Named volume', '/var/lib/docker/volumes/<name>', 'Базы данных, состояние, бэкапы — стандарт для прода'],
                    ['Bind mount', 'Любой путь на хосте (-v ./src:/app)', 'Разработка (live-reload), конфиги, статика'],
                    ['tmpfs', 'В памяти RAM (-v /tmp --tmpfs)', 'Секреты, кэш, временные файлы (не переживают рестарт)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Три синтаксиса',
                  code: '# named volume (production)\n-v pgdata:/var/lib/postgresql/data\n\n# bind mount (development)\n-v $(pwd)/src:/app/src\n\n# tmpfs (секреты, кэш)\n--tmpfs /tmp\n--tmpfs /run/secrets:rw,noexec,nosuid,size=64m',
                },
                { type: 'note', text: 'Правило: в проде — named volume (или managed-хранилище облака), в разработке — bind mount (live-reload), для временных/секретов — tmpfs. Bind mount опасен в проде: контейнер может испортить файлы хоста.' },
              ],
            },
            {
              id: 'dk-l3-s4',
              title: 'Network drivers',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Основные драйверы сетей',
                  head: ['Драйвер', 'Когда', 'Особенность'],
                  rows: [
                    ['bridge', 'По умолчанию, локальная разработка', 'Своя сеть на хосте, DNS по имени в user-defined'],
                    ['host', 'Нужна максимальная скорость', 'Контейнер использует сеть хоста напрямую, без NAT'],
                    ['overlay', 'Docker Swarm, multi-host', 'Контейнеры на разных хостах видят друг друга'],
                    ['macvlan', 'Нужен «настоящий» IP в LAN', 'Контейнер получает MAC-адрес и IP в физической сети'],
                    ['none', 'Полная изоляция', 'Нет сети вообще (batch-задачи, безопасность)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Создание user-defined bridge',
                  code: 'docker network create mynet\ndocker run -d --name db  --network mynet postgres:16\ndocker run -d --name app --network mynet myapp:1.0\n# app может достучаться до db по hostname "db"',
                },
                { type: 'note', text: 'User-defined bridge — «своя сеть». Отличается от дефолтной: внутри неё работает DNS по именам контейнеров. Поэтому docker compose всегда создаёт user-defined bridge для проекта — сервисы находят друг друга по имени.' },
              ],
            },
            {
              id: 'dk-l3-s5',
              title: 'Проверь себя: сети',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте драйвер сети и его особенность',
                pairs: [
                  { left: 'bridge (user-defined)', right: 'DNS по имени контейнера внутри сети' },
                  { left: 'host', right: 'Без NAT, контейнер использует сеть хоста' },
                  { left: 'overlay', right: 'Multi-host, Docker Swarm' },
                  { left: 'none', right: 'Полная изоляция, нет сети' },
                ],
                explanation:
                  'User-defined bridge — DNS по имени. host — без NAT, максимальная скорость, но порты не пробрасываются. overlay — между хостами (Swarm/K8s-подобные сценарии). none — изоляция.',
              },
            },
          ],
        },
        {
          id: 'dk-l4',
          title: 'docker compose: стек одной командой',
          minutes: 30,
          steps: [
            {
              id: 'dk-l4-s1',
              title: 'Описываем приложение декларативно',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда сервисов несколько — приложение, база, кэш, очередь — запускать их руками утомительно. Docker Compose описывает весь стек в одном YAML-файле: сервисы, сети, volumes. Команда docker compose up поднимает всё сразу и в правильном порядке.' },
                {
                  type: 'mermaid',
                  caption: 'Compose: сервисы, сеть, volume',
                  code: 'graph TD\n    User["Пользователь<br/>localhost:8080"] -->|"ports: 8080:8000"| App\n    subgraph Net["Общая сеть (создаёт compose)"\n        App["app:8000<br/>build: ."]\n        DB["db:5432<br/>postgres:16"]\n    end\n    App -->|"DATABASE_URL=<br/>postgres://...@db:5432"| DB\n    DB --> Vol[("volume pgdata<br/>/var/lib/postgresql/data")]',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'docker-compose.yml',
                  code: 'services:\n  app:\n    build: .\n    ports:\n      - "8080:8000"\n    environment:\n      DATABASE_URL: postgres://app:secret@db:5432/appdb\n    depends_on:\n      - db\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_USER: app\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:',
                },
                { type: 'p', text: 'Compose автоматически создаёт общую сеть, поэтому app обращается к базе по имени сервиса — db.' },
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
                { type: 'note', text: 'depends_on ждёт только запуска контейнера, а не готовности сервиса внутри. Для ожидания готовности БД используйте healthcheck + condition: service_healthy.' },
              ],
            },
            {
              id: 'dk-l4-s3',
              title: 'Проверь себя: down -v',
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
            {
              id: 'dk-l4-s4',
              title: 'Переменные окружения и .env',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Хардкодить пароли в docker-compose.yml — плохо: файл попадает в Git. Стандарт — .env-файл рядом с compose, который подхватывается автоматически. Плюс .env.example в Git как шаблон.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'compose с переменными из .env',
                  code: 'services:\n  app:\n    build: .\n    environment:\n      DATABASE_URL: ${DATABASE_URL}\n      SECRET_KEY: ${SECRET_KEY}\n      DEBUG: ${DEBUG:-false}\n\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: ${DB_PASSWORD}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: '.env (НЕ в Git) и .env.example (в Git)',
                  code: '# .env — реальные значения, в .gitignore\nDATABASE_URL=postgres://app:secret@db:5432/appdb\nSECRET_KEY=change-me-in-prod\nDB_PASSWORD=secret\nDEBUG=true\n\n# .env.example — шаблон без значений, в Git\nDATABASE_URL=postgres://user:password@host:5432/dbname\nSECRET_KEY=\nDB_PASSWORD=\nDEBUG=false',
                },
                {
                  type: 'list',
                  items: [
                    '${VAR} — подставить значение из .env или окружения',
                    '${VAR:-default} — значение по умолчанию, если не задано',
                    '${VAR:?error} — ошибка, если не задано (для обязательных)',
                    '.env читается автоматически из папки с compose',
                    '.env — в .gitignore, .env.example — в Git как шаблон',
                  ],
                },
                { type: 'note', text: 'Не путайте: .env (авто-подхват) и env_file: (явное указание). Для прода — не .env, а секреты из окружения CI/CD или Vault. .env — для локальной разработки.' },
              ],
            },
            {
              id: 'dk-l4-s5',
              title: 'Проверь себя: .env',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт с ${DB_PASSWORD}, если в .env нет переменной DB_PASSWORD?',
                options: [
                  { id: 'a', text: 'Compose подставит пустую строку и выдаст warning' },
                  { id: 'b', text: 'Compose упадёт с ошибкой' },
                  { id: 'c', text: 'Compose подставит значение по умолчанию' },
                  { id: 'd', text: 'Compose проигнорирует строку' },
                ],
                correct: ['a'],
                explanation:
                  'Без значения по умолчанию Compose подставит пустую строку и предупредит в логах. Чтобы упасть — используйте ${DB_PASSWORD:?DB_PASSWORD is required}. Чтобы дать дефолт — ${DB_PASSWORD:-changeme}.',
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
          minutes: 25,
          steps: [
            {
              id: 'dk-l5-s1',
              title: 'Что не должно попадать в контекст сборки',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Команда `docker build .` отправляет в демон ВСЁ содержимое каталога — включая `node_modules`, `.git`, `venv`. Это замедляет сборку и «пухнет» образ. Файл `.dockerignore` (как `.gitignore`) исключает лишнее.' },
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
              title: 'Проверь себя: .dockerignore',
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
            {
              id: 'dk-l5-s3',
              title: 'Как уменьшить образ: четыре рычага',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Размер образа влияет на скорость pull, стоимость storage в registry и площадь атаки. Четыре рычага, которые дают 80% экономии:' },
                {
                  type: 'table',
                  caption: 'Как уменьшить образ',
                  head: ['Рычаг', 'Экономия', 'Пример'],
                  rows: [
                    ['Минимальный базовый образ', '100–700 МБ', 'python:3.12-slim (120 МБ) вместо python:3.12 (1 ГБ)'],
                    ['Multi-stage build', '50–90%', 'Компиляторы в build-стадии, артефакт в runtime-стадии'],
                    ['--no-cache-dir / apt clean', '10–30%', 'pip install --no-cache-dir, apt-get clean после install'],
                    ['.dockerignore', 'Зависит от проекта', 'Исключить node_modules, .git, тесты'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'До и после',
                  code: '# Плохо: 1.2 ГБ\nFROM python:3.12\nCOPY . .\nRUN pip install -r requirements.txt\n\n# Хорошо: 150 МБ\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .',
                },
                { type: 'note', text: 'Не гонитесь за «самым маленьким образом». Образ на 50 МБ без shell (distroless) — сложно отлаживать: не зайдёшь через docker exec. Баланс: 100–300 МБ с shell, или distroless для критичной безопасности.' },
              ],
            },
            {
              id: 'dk-l5-s4',
              title: 'Анализ слоёв: docker history',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Прежде чем уменьшать образ, надо понять, что его раздувает. `docker history` показывает каждый слой и его размер — сразу видно, где «жир».' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker history',
                  code: 'docker history myapp:latest\n# IMAGE          CREATED BY                                      SIZE\n# abc123         CMD ["python" "main.py"]                        0B\n# def456         COPY . .                                        150MB  ← вот «жир»\n# ghi789         RUN pip install --no-cache-dir -r requirements…  80MB\n# jkl012         COPY requirements.txt .                         1KB\n# mno345         WORKDIR /app                                    0B\n# pqr678         FROM python:3.12-slim                           120MB',
                },
                {
                  type: 'list',
                  items: [
                    'Каждый слой показывает свой размер',
                    'COPY . . на 150 МБ — вероятно, туда попали node_modules / .git / тесты',
                    'Решение: .dockerignore + copy только нужного',
                    'docker scout quickview — ещё и уязвимости по слоям',
                  ],
                },
                { type: 'note', text: 'Правило: перед оптимизацией — посмотрите docker history. 80% «тяжёлых» образов — это COPY . . без .dockerignore. Один файл .dockerignore часто экономит больше, чем смена базового образа.' },
              ],
            },
            {
              id: 'dk-l5-s5',
              title: 'Проверь себя: оптимизация',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики уменьшают размер образа?',
                options: [
                  { id: 'a', text: 'python:3.12-slim вместо python:3.12' },
                  { id: 'b', text: 'pip install --no-cache-dir' },
                  { id: 'c', text: 'Копировать весь проект через COPY . . без .dockerignore' },
                  { id: 'd', text: 'Multi-stage build (компиляторы в build-стадии)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'slim-образ (a), --no-cache-dir (b) и multi-stage (d) — три рычага. Копирование всего (c) — наоборот, раздувает образ: node_modules, .git, тесты. Всегда .dockerignore.',
              },
            },
          ],
        },
        {
          id: 'dk-l6',
          title: 'Non-root и безопасность',
          minutes: 30,
          steps: [
            {
              id: 'dk-l6-s1',
              title: 'Почему root в контейнере — плохо',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'По умолчанию процесс в контейнере — root. Если злоумышленник выйдет из контейнера (например, через уязвимость в ядре), он получит root на хосте. Даже если выйдет не полностью — root внутри контейнера позволит установить пакеты, изменить системные файлы.' },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Non-root в Dockerfile',
                  code: 'FROM node:20-alpine\n\n# создаём отдельного пользователя\nRUN addgroup -S app && adduser -S app -G app\n\nWORKDIR /app\nCOPY --chown=app:app package*.json ./\nRUN npm ci\nCOPY --chown=app:app . .\n\nUSER app\n\nCMD ["node", "server.js"]',
                },
                { type: 'note', text: 'USER app ставьте ПОСЛЕ установки пакетов. Если поставить раньше — не хватит прав на npm install или apt-get. Идея: всё, что требует root (установка), — на этапе сборки; всё, что работает в рантайме, — от non-root.' },
              ],
            },
            {
              id: 'dk-l6-s2',
              title: 'Проверь себя: USER',
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
            {
              id: 'dk-l6-s3',
              title: 'Capabilities и read-only ФС',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Non-root — не единственная защита. Даже root внутри контейнера можно ограничить: убрать Linux capabilities, сделать корневую ФС read-only, запретить повышение привилегий.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Оборонительный docker run',
                  code: 'docker run -d \\\n  --user 1000:1000 \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --cap-drop=ALL \\\n  --cap-add=NET_BIND_SERVICE \\\n  --security-opt=no-new-privileges \\\n  --memory 256m \\\n  --cpus 1 \\\n  -p 8000:8000 \\\n  myapp:1.4.2',
                },
                {
                  type: 'table',
                  caption: 'Флаги безопасности',
                  head: ['Флаг', 'Что делает'],
                  rows: [
                    ['--user 1000:1000', 'Запустить от конкретного UID/GID (не root)'],
                    ['--read-only', 'Корневая ФС только на чтение (защита от подмены файлов)'],
                    ['--tmpfs /tmp', 'Временный каталог в памяти (для tmp-файлов)'],
                    ['--cap-drop=ALL', 'Убрать все Linux capabilities'],
                    ['--security-opt=no-new-privileges', 'Запрет на повышение привилегий (setuid/setgid)'],
                    ['--memory 256m', 'Лимит памяти (защита от OOM хоста)'],
                  ],
                },
                { type: 'note', text: 'В K8s те же идеи — через securityContext: runAsNonRoot, readOnlyRootFilesystem, capabilities.drop: [ALL], allowPrivilegeEscalation: false. Docker — «низкий уровень», K8s — «высокоуровневая обёртка» над теми же механизмами.' },
              ],
            },
            {
              id: 'dk-l6-s4',
              title: 'Сканирование уязвимостей',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В любом базовом образе есть openssl, glibc, curl — в них регулярно находят CVE. Сканирование показывает, что именно уязвимо и насколько критично. Это первый шаг supply-chain security.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Trivy и Docker Scout',
                  code: '# Trivy — open-source, быстрый\ntrivy image nginx:1.27\ntrivy image --severity HIGH,CRITICAL myapp:1.4.2\n\n# В CI: упасть при HIGH/CRITICAL\ntrivy image --exit-code 1 --severity HIGH,CRITICAL myapp:1.4.2\n\n# Docker Scout (встроен в Docker Desktop)\ndocker scout quickview myapp:1.4.2\ndocker scout cves myapp:1.4.2',
                },
                { type: 'note', text: 'Не пугайтесь 200 CVE в образе. Реальная задача — приоритизировать: Critical и High без фикса — в тикет, High с фиксом — обновить базовый образ, Low — игнорировать. Dependabot / Renovate автоматизируют обновления.' },
              ],
            },
            {
              id: 'dk-l6-s5',
              title: 'Проверь себя: безопасность',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры уменьшают площадь атаки контейнера?',
                options: [
                  { id: 'a', text: 'Запуск от non-root пользователя' },
                  { id: 'b', text: '--cap-drop=ALL --cap-add=NET_BIND_SERVICE' },
                  { id: 'c', text: '--read-only для корневой ФС' },
                  { id: 'd', text: '--privileged для полного доступа' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'Non-root, минимальные capabilities и read-only ФС — три кита безопасности. --privileged — наоборот, даёт контейнеру почти полный доступ к хосту, это максимальный риск. Никогда не используйте его без крайней необходимости.',
              },
            },
          ],
        },
        {
          id: 'dk-l7',
          title: 'Multi-stage: сборка отдельно от запуска',
          minutes: 30,
          steps: [
            {
              id: 'dk-l7-s1',
              title: 'Зачем разделять build и runtime',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Для сборки нужны компиляторы, dev-зависимости, исходники. Для запуска — только артефакт и runtime. Multi-stage позволяет собрать в тяжёлом образе, а в финальный положить только результат — образ уменьшается в разы.' },
                {
                  type: 'mermaid',
                  caption: 'Build stage ~900 MB → runtime stage ~15 MB',
                  code: 'graph LR\n    subgraph Build["Build stage<br/>~900 MB"]\n        Src["Исходники + компилятор"]\n        Bin["/app — бинарник"]\n        Src -->|"go build"| Bin\n    end\n    subgraph Runtime["Runtime stage<br/>~15 MB"]\n        Final["/app"]\n    end\n    Bin -->|"COPY --from=build"| Final',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Go: 900 MB → 15 MB',
                  code: '# Сборка\nFROM golang:1.23 AS build\nWORKDIR /src\nCOPY go.* ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app ./cmd/server\n\n# Runtime\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /app /app\nUSER nonroot:nonroot\nEXPOSE 8080\nENTRYPOINT ["/app"]',
                },
                { type: 'note', text: '--from=build копирует только артефакт. Всё остальное — исходники, компилятор, кэш — остаётся в промежуточном образе и в финальный не попадает. Промежуточные образы можно чистить: docker builder prune.' },
              ],
            },
            {
              id: 'dk-l7-s2',
              title: 'Проверь себя: что попадает в образ',
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
            {
              id: 'dk-l7-s3',
              title: 'Named stages и копирование между ними',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Каждой стадии можно дать имя (AS build) и ссылаться на неё в COPY --from. Это позволяет копировать артефакты из любой предыдущей стадии, а также из внешних образов (COPY --from=nginx:alpine).' },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Три стадии: build, test, runtime',
                  code: '# Стадия 1: сборка\nFROM golang:1.23 AS build\nWORKDIR /src\nCOPY . .\nRUN go build -o /app ./cmd/server\n\n# Стадия 2: тесты (использует артефакт сборки)\nFROM build AS test\nRUN go test ./...\n\n# Стадия 3: финал (только бинарник)\nFROM gcr.io/distroless/static-debian12\nCOPY --from=build /app /app\nENTRYPOINT ["/app"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Сборка только нужной стадии',
                  code: '# Обычная сборка — все стадии, что нужны финалу\n# (test НЕ запустится: до неё не доходит COPY --from)\ndocker build -t myapp:1.0 .\n\n# Запустить тесты в отдельной стадии\ndocker build --target test -t myapp:test .\n\n# Собрать конкретную стадию\ndocker build --target build -t myapp:build .',
                },
                { type: 'note', text: 'В реальных проектах: build → test → lint → runtime. В финал попадает только runtime. Тесты — отдельной командой в CI (--target test), чтобы не тормозить сборку прод-образа.' },
              ],
            },
            {
              id: 'dk-l7-s4',
              title: 'Multi-stage для Python и Node',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Go и Rust — классика для multi-stage (один бинарник). Для Python и Node финальный образ всё равно нужен с интерпретатором, но dev-зависимости и компиляторы можно оставить в build-стадии.' },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Python: build зависимости отдельно',
                  code: '# Build: компиляторы + dev-зависимости\nFROM python:3.12-slim AS build\nWORKDIR /app\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    gcc python3-dev && rm -rf /var/lib/apt/lists/*\nCOPY requirements.txt .\nRUN pip install --prefix=/install -r requirements.txt\n\n# Runtime: только установленные пакеты\nFROM python:3.12-slim\nWORKDIR /app\nCOPY --from=build /install /usr/local\nCOPY . .\nUSER 1000:1000\nCMD ["python", "main.py"]',
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Node: build → runtime',
                  code: '# Build\nFROM node:20 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nRUN npm prune --production\n\n# Runtime\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules\nCOPY package.json ./\nUSER node\nCMD ["node", "dist/index.js"]',
                },
                { type: 'note', text: 'Для Python/Node выигрыш меньше (интерпретатор нужен в runtime), но всё равно значимый: уходят gcc, python3-dev, кэш pip, dev-зависимости. Экономия 200–500 МБ на образ.' },
              ],
            },
            {
              id: 'dk-l7-s5',
              title: 'Проверь себя: стадии',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и её действие',
                pairs: [
                  { left: 'FROM ... AS build', right: 'Именованная стадия сборки' },
                  { left: 'COPY --from=build', right: 'Скопировать артефакт из стадии build' },
                  { left: 'docker build --target test', right: 'Собрать только до стадии test' },
                  { left: '--from=nginx:alpine', right: 'Скопировать файл из внешнего образа' },
                ],
                explanation:
                  'AS — имя стадии. COPY --from — копирование из неё. --target — собрать до конкретной стадии. --from с образом — копировать из внешнего (например, конфиг из nginx:alpine).',
              },
            },
          ],
        },
        {
          id: 'dk-l8',
          title: 'Compose: healthcheck, профили, деплой',
          minutes: 30,
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
                { type: 'note', text: 'В продакшене Compose — не всегда лучший выбор: нет автомасштабирования, самовосстановления и rolling-обновлений. Для односерверных проектов и dev-окружений — идеален. Для реального прода — Kubernetes, Nomad, ECS.' },
              ],
            },
            {
              id: 'dk-l8-s2',
              title: 'Проверь себя: service_healthy',
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
            {
              id: 'dk-l8-s3',
              title: 'Профили и override-файлы',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Compose поддерживает несколько файлов и профили — это позволяет одному docker-compose.yml описывать и dev, и prod. Без дублирования и без «удали строчку перед деплоем».' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'docker-compose.yml + override',
                  code: '# docker-compose.yml (база)\nservices:\n  app:\n    image: myapp:latest\n    environment:\n      DATABASE_URL: postgres://app:secret@db:5432/appdb\n    depends_on:\n      db:\n        condition: service_healthy\n\n  db:\n    image: postgres:16\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready"]\n\n---\n# docker-compose.override.yml (для dev, автоподхват)\nservices:\n  app:\n    build: .\n    volumes:\n      - ./src:/app/src        # live-reload\n    ports:\n      - "8000:8000"\n\n---\n# docker-compose.prod.yml (для прода, явно)\nservices:\n  app:\n    restart: always\n    deploy:\n      resources:\n        limits:\n          memory: 512m',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как запускать',
                  code: '# dev: подхватит docker-compose.yml + docker-compose.override.yml\ndocker compose up\n\n# prod: явно указать оба файла\ndocker compose -f docker-compose.yml -f docker-compose.prod.yml up -d\n\n# профили (если используете profiles:)\ndocker compose --profile dev up      # с adminer\ndocker compose --profile prod up     # без adminer',
                },
                { type: 'note', text: 'docker-compose.override.yml подхватывается автоматически — это «dev по умолчанию». Для прода — явные -f. И не забудьте: в override для dev не должно быть секретов прода (и наоборот).' },
              ],
            },
            {
              id: 'dk-l8-s4',
              title: 'Ресурсы и ограничения',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Без лимитов один контейнер может съесть всю память хоста — и положат всё. В Compose лимиты задаются через deploy.resources (Compose v2) или mem_limit/cpus (старый синтаксис).' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Лимиты ресурсов',
                  code: 'services:\n  app:\n    image: myapp:1.4.2\n    deploy:\n      resources:\n        limits:\n          cpus: "0.5"          # 0.5 ядра\n          memory: 512M\n        reservations:\n          cpus: "0.25"\n          memory: 128M\n\n  # Старый синтаксис (Compose v1):\n  # mem_limit: 512m\n  # cpus: 0.5',
                },
                {
                  type: 'list',
                  items: [
                    'limits — потолок: превысил CPU → троттлинг, превысил память → OOMKilled',
                    'reservations — гарантированный минимум',
                    'Для прода — всегда лимиты, иначе один сервис уронит весь хост',
                    'В K8s — те же concepts: requests/limits в resources',
                  ],
                },
                { type: 'note', text: 'Классический инцидент: на хосте 8 ГБ, три контейнера без лимитов. Один «разогнался» до 7 ГБ — остальные получили OOMKilled. Лимиты — не «на всякий случай», а обязательная практика.' },
              ],
            },
            {
              id: 'dk-l8-s5',
              title: 'Проверь себя: лимиты',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что верно про лимиты ресурсов в Compose?',
                options: [
                  { id: 'a', text: 'limits: memory — потолок, при превышении OOMKilled' },
                  { id: 'b', text: 'limits: cpus — потолок, при превышении троттлинг' },
                  { id: 'c', text: 'Без лимитов один контейнер может уронить весь хост' },
                  { id: 'd', text: 'reservations — гарантированный минимум' },
                ],
                correct: ['a', 'b', 'c', 'd'],
                explanation:
                  'Все четыре верны. CPU — сжимаемый ресурс (троттлинг), память — нет (OOMKilled). reservations — минимум, limits — максимум. Без лимитов — риск «уронить хост» одним контейнером.',
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
          minutes: 25,
          steps: [
            {
              id: 'dk-l9-s1',
              title: 'Что такое registry',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Registry — это сервер, который хранит Docker-образы. Docker Hub — самый популярный, но не единственный. Когда вы делаете `docker push myapp:1.0`, образ уходит в registry, а на другом сервере `docker pull` забирает его оттуда. Это и есть «собрал один раз — запускай везде».' },
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
                { type: 'note', text: 'В продакшене Docker Hub используют редко для приватных образов: rate limits (100 pull / 6 часов для анонимных), нет гарантий SLA. Для приватных образов — ghcr.io, ECR, GAR или self-hosted Harbor.' },
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
              title: 'Проверь себя: имя образа',
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
            {
              id: 'dk-l9-s4',
              title: 'Компоненты имени: что где',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Имя образа — не «просто строка». В нём закодированы registry, namespace, имя и тег. Понимание каждого компонента помогает не путаться, куда пушить и откуда тянуть.' },
                {
                  type: 'table',
                  caption: 'Компоненты',
                  head: ['Часть', 'Что значит', 'Пример'],
                  rows: [
                    ['registry', 'Домен сервера', 'ghcr.io, docker.io, registry.mycompany.com'],
                    ['namespace', 'Владелец / группа', 'myorg, myuser, library'],
                    ['name', 'Имя образа', 'myapp, nginx, postgres'],
                    ['tag', 'Версия', '1.4.2, latest, sha-abc123'],
                    ['digest', 'SHA-хэш манифеста', 'sha256:abc123... (иммутабельный)'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'registry:5000 — если нестандартный порт, указывается через :',
                    'docker.io/library/nginx — официальные образы в namespace library',
                    'ghcr.io/myorg/myapp — GitHub, организация myorg',
                    'По умолчанию tag = latest, registry = docker.io, namespace = library (для официальных)',
                  ],
                },
                { type: 'note', text: 'Два образа с одинаковым именем в разных registry — это ДВА разных образа. `docker.io/myapp:1.0` и `ghcr.io/myapp:1.0` не связаны. Если запушили в один, а тянете из другого — «not found». Частая ошибка в CI.' },
              ],
            },
            {
              id: 'dk-l9-s5',
              title: 'Проверь себя: компоненты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте компонент имени образа и его назначение',
                pairs: [
                  { left: 'registry', right: 'Домен сервера (ghcr.io, docker.io)' },
                  { left: 'namespace', right: 'Владелец или группа (myorg, myuser)' },
                  { left: 'name', right: 'Имя образа (myapp, nginx)' },
                  { left: 'digest', right: 'Неизменяемый SHA-хэш манифеста' },
                ],
                explanation:
                  'registry — где хостится. namespace — чьё. name — что. digest — уникальный SHA (в отличие от tag, который можно перезаписать). Понимание компонентов — база для работы с registry.',
              },
            },
          ],
        },
        {
          id: 'dk-l10',
          title: 'Теги и версионирование',
          minutes: 30,
          steps: [
            {
              id: 'dk-l10-s1',
              title: 'Почему :latest — это плохо',
              type: 'theory',
              blocks: [
                { type: 'p', text: '`:latest` — это просто «тег по умолчанию», не «самый новый». Он не обновляется автоматически и не защищает от скатывания. Один и тот же `myapp:latest` сегодня и завтра — это два разных образа. В проде это приводит к «на проде обновилось само», «на staging не та версия», «откатить нельзя».' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Почему :latest опасен',
                  code: 'День 1:  docker build -t myapp:latest .\n         docker push myapp:latest           # sha256:abc...\n\nДень 2:  docker build -t myapp:latest .\n         docker push myapp:latest           # sha256:def... (перезаписал!)\n\nНа проде: docker pull myapp:latest\n         → получает тот, что был на день 2\n         → «кто это сделал?» — непонятно\n         → откатить нельзя — старая версия перезаписана',
                },
                { type: 'note', text: '`:latest` допустим только для локальной разработки и для образов, которые не идут в прод (например, dev-контейнер). В проде — только явные версии или digest.' },
              ],
            },
            {
              id: 'dk-l10-s2',
              title: 'Три уровня тегов',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Хорошая стратегия — три тега на каждый образ. Не «один тег на всё», а набор, который отвечает на разные вопросы.' },
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
              title: 'Проверь себя: теги',
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
            {
              id: 'dk-l10-s4',
              title: 'SemVer и теги: как связаны',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'SemVer (Semantic Versioning) — MAJOR.MINOR.PATCH. Связь с Docker-тегами: каждая часть — отдельный тег. Это позволяет клиентам выбирать «уровень доверия» к обновлениям.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как SemVer проецируется в теги',
                  code: 'Версия 1.4.2:\n  myapp:1.4.2      ← точная, не перезаписывается\n  myapp:1.4        ← последний патч в 1.4.x (перезаписывается)\n  myapp:1          ← последний минор в 1.x (перезаписывается)\n  myapp:latest     ← последний вообще (плохо для прода)\n\nРелиз 1.4.3 через неделю:\n  myapp:1.4.2      ← не тронут\n  myapp:1.4        ← перезаписан на 1.4.3\n  myapp:1          ← перезаписан на 1.4.3\n  myapp:latest     ← перезаписан на 1.4.3',
                },
                {
                  type: 'list',
                  items: [
                    'MAJOR (1) — ломающие изменения: клиент должен явно согласиться',
                    'MINOR (4) — новая функциональность, обратная совместимость',
                    'PATCH (2) — багфиксы, без изменений API',
                    'Docker: точный тег 1.4.2 — immutable, 1.4 и 1 — floating',
                  ],
                },
                { type: 'note', text: 'Правило: в Kubernetes Deployment пишите точную версию (myapp:1.4.2), не 1.4 и не latest. Обновление — через git commit в манифест (или через ArgoCD Image Updater). Так вы контролируете, когда меняется версия.' },
              ],
            },
            {
              id: 'dk-l10-s5',
              title: 'Проверь себя: SemVer',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тег и его поведение',
                pairs: [
                  { left: 'myapp:1.4.2', right: 'Неизменяемый (не перезаписывается)' },
                  { left: 'myapp:1.4', right: 'Перезаписывается при каждом патче 1.4.x' },
                  { left: 'myapp:latest', right: 'Перезаписывается при каждом push' },
                  { left: 'myapp@sha256:abc...', right: 'Иммутабельный digest' },
                ],
                explanation:
                  'Точная версия и digest — immutable. Минорная и latest — floating. В проде — только immutable (точная версия или digest).',
              },
            },
          ],
        },
        {
          id: 'dk-l11',
          title: 'Приватные registry и аутентификация',
          minutes: 25,
          steps: [
            {
              id: 'dk-l11-s1',
              title: 'Как Docker хранит учётные данные',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Docker хранит логины/пароли в `~/.docker/config.json` (на Windows — `%USERPROFILE%\\.docker\\config.json`). Пароли кодируются в base64, а не шифруются — это НЕ безопасно. Для CI/CD используют токены и credential helpers.' },
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
                { type: 'note', text: 'Никогда не коммитьте ~/.docker/config.json в Git. В CI — передавайте через secrets (GitHub Secrets, GitLab CI variables). Даже base64 «пароль» — это фактически пароль в открытом виде.' },
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
                { type: 'note', text: 'В GitHub Actions GITHUB_TOKEN выдаётся автоматически с правами на пакеты. Не надо хранить личный PAT — используйте его. Для других registry — secrets (CI/CD variables).' },
              ],
            },
            {
              id: 'dk-l11-s3',
              title: 'Проверь себя: безопасность',
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
            {
              id: 'dk-l11-s4',
              title: 'GITHUB_TOKEN vs PAT',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Для GHCR (ghcr.io) есть два способа логина: автоматический GITHUB_TOKEN и личный Personal Access Token (PAT). Senior DevOps знает разницу — она в правах и сроке жизни.' },
                {
                  type: 'table',
                  caption: 'GITHUB_TOKEN vs PAT',
                  head: ['Параметр', 'GITHUB_TOKEN', 'PAT (Personal Access Token)'],
                  rows: [
                    ['Кто выдаёт', 'GitHub Actions автоматически', 'Пользователь вручную в Settings → Tokens'],
                    ['Срок жизни', 'До конца job-а (минуты)', 'От 30 дней до бессрочного'],
                    ['Права', 'По permissions в workflow', 'По scope (write:packages, read:packages)'],
                    ['Утечка', 'Истечёт после job-а', 'Действует, пока не отзовут'],
                    ['Для чего', 'CI/CD, пуш из Actions', 'Локальный пуш, другие системы'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'В GitHub Actions — всегда GITHUB_TOKEN (безопаснее, автоматический)',
                    'GITHUB_TOKEN требует permissions: packages: write в workflow',
                    'PAT — только если пушите не из Actions (локально, из другой CI)',
                    'PAT — минимальные scope (write:packages достаточно)',
                    'Ротируйте PAT раз в 90 дней',
                  ],
                },
                { type: 'note', text: 'Классическая ошибка: положить личный PAT в GitHub Secrets и использовать его в Actions. Это работает, но небезопасно: PAT живёт месяцами, а если утечёт — злоумышленник получит доступ надолго. GITHUB_TOKEN истекает вместе с job-ом.' },
              ],
            },
            {
              id: 'dk-l11-s5',
              title: 'Проверь себя: токены',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте токен и его назначение',
                pairs: [
                  { left: 'GITHUB_TOKEN', right: 'Автоматический, для CI/CD в Actions' },
                  { left: 'PAT (Personal Access Token)', right: 'Личный, для локального push и внешних CI' },
                  { left: '--password-stdin', right: 'Передача пароля без истории команд' },
                  { left: 'docker logout', right: 'Удалить учётные данные из config.json' },
                ],
                explanation:
                  'GITHUB_TOKEN — автоматический, короткоживущий. PAT — личный, долгоживущий (ротировать!). --password-stdin — безопасная передача. docker logout — очистка.',
              },
            },
          ],
        },
        {
          id: 'dk-l12',
          title: 'Практика: собираем и публикуем',
          minutes: 30,
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
              title: 'Проверь себя: перед push',
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
            {
              id: 'dk-l12-s4',
              title: 'Скрипт публикации: автоматизация',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Ручной набор команд (build → tag → push) повторяется на каждый релиз. В реальных проектах его оборачивают в Makefile или скрипт — одна команда `make release VERSION=1.4.2` делает всё.' },
                {
                  type: 'code',
                  lang: 'makefile',
                  caption: 'Makefile',
                  code: 'IMAGE ?= ghcr.io/myorg/myapp\nVERSION ?= $(shell git describe --tags --always)\nSHA := $(shell git rev-parse --short HEAD)\n\n.PHONY: build push release\n\nbuild:\n\tdocker build -t $(IMAGE):$(VERSION) -t $(IMAGE):sha-$(SHA) .\n\npush: build\n\tdocker push $(IMAGE):$(VERSION)\n\tdocker push $(IMAGE):sha-$(SHA)\n\nrelease: push\n\tdocker tag $(IMAGE):$(VERSION) $(IMAGE):$(word 1,$(subst ., ,$(VERSION)))\n\tdocker push $(IMAGE):$(word 1,$(subst ., ,$(VERSION)))',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Использование',
                  code: 'make release VERSION=1.4.2\n# build → push точного + sha → push мажорного',
                },
                { type: 'note', text: 'Makefile — простой и портируемый способ автоматизации. Альтернативы: bash-скрипт (release.sh), Taskfile (YAML), just (Rust). В CI — те же команды через docker/build-push-action@v6, но с кэшем и multi-platform.' },
              ],
            },
            {
              id: 'dk-l12-s5',
              title: 'Проверь себя: автоматизация',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем оборачивать build/tag/push в Makefile или скрипт?',
                options: [
                  { id: 'a', text: 'Docker требует Makefile' },
                  { id: 'b', text: 'Одна команда вместо пяти, одинаково у всех в команде и в CI' },
                  { id: 'c', text: 'Makefile ускоряет сборку' },
                  { id: 'd', text: 'Это обязательное требование registry' },
                ],
                correct: ['b'],
                explanation:
                  'Makefile — про воспроизводимость: одна команда `make release VERSION=1.4.2` вместо ручного набора build/tag/push. Одинаково у всех разработчиков и в CI. Не ускоряет, не требуется Docker — просто удобно.',
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
          minutes: 25,
          steps: [
            {
              id: 'dk-l13-s1',
              title: 'BuildKit и buildx',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Современный `docker build` использует BuildKit — новый движок сборки. `docker buildx` — это расширение: multi-platform сборки, продвинутое кэширование, параллельная сборка стадий. Фактически, buildx — это «docker build для продакшена».' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка и создание builder',
                  code: '# Проверить, что buildx доступен\ndocker buildx version\n\n# Создать «продвинутый» builder (docker-container driver)\ndocker buildx create --name mybuilder --use --bootstrap\n\n# Посмотреть доступные builders\ndocker buildx ls\n\n# Теперь docker buildx build — с полными возможностями\ndocker buildx build -t myapp:1.0 .',
                },
                { type: 'note', text: 'На Docker Desktop buildx уже включён по умолчанию. На Linux-сервере без Docker Desktop — надо `docker buildx create`. Драйвер `docker-container` даёт multi-platform и registry-cache, драйвер `docker` — проще, но без этих возможностей.' },
              ],
            },
            {
              id: 'dk-l13-s2',
              title: 'Параллельная сборка стадий',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'BuildKit анализирует граф зависимостей между стадиями и запускает независимые стадии параллельно. В multi-stage Dockerfile это может ускорить сборку в 2–3 раза.' },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Независимые стадии собираются параллельно',
                  code: 'FROM node:20 AS build-frontend\nWORKDIR /frontend\nCOPY frontend/package*.json ./\nRUN npm ci\nCOPY frontend/ .\nRUN npm run build\n\n# Эта стадия не зависит от build-frontend\nFROM node:20 AS build-backend\nWORKDIR /backend\nCOPY backend/package*.json ./\nRUN npm ci\nCOPY backend/ .\nRUN npm run build\n\n# Финальная — ждёт обе\nFROM node:20-alpine\nCOPY --from=build-frontend /frontend/dist /app/public\nCOPY --from=build-backend /backend/dist /app/server\nCMD ["node", "/app/server/index.js"]',
                },
                { type: 'note', text: 'Параллельность работает автоматически — не надо ничего указывать. BuildKit сам понимает, что build-frontend и build-backend не зависят друг от друга.' },
              ],
            },
            {
              id: 'dk-l13-s3',
              title: 'Проверь себя: buildx',
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
            {
              id: 'dk-l13-s4',
              title: 'Builders и драйверы',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'buildx работает через «builders» — изолированные окружения сборки. Каждый builder использует драйвер (docker, docker-container, kubernetes, remote). Разные драйверы дают разные возможности.' },
                {
                  type: 'table',
                  caption: 'Драйверы buildx',
                  head: ['Драйвер', 'Multi-platform', 'Кэш в registry', 'Когда'],
                  rows: [
                    ['docker', 'Нет', 'Нет', 'Обычная локальная сборка (по умолчанию)'],
                    ['docker-container', 'Да', 'Да', 'Продвинутая сборка (multi-arch, cache)'],
                    ['kubernetes', 'Да', 'Да', 'Сборка в K8s-кластере (большие проекты)'],
                    ['remote', 'Да', 'Да', 'Удалённый buildx-сервер'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Управление builders',
                  code: '# Создать builder на docker-container\ndocker buildx create --name multibuilder --driver docker-container --use\n\n# Активировать (использовать по умолчанию)\ndocker buildx use multibuilder\n\n# Список builders\ndocker buildx ls\n\n# Удалить\ndocker buildx rm multibuilder',
                },
                { type: 'note', text: 'Правило: для прода (multi-arch, кэш) — docker-container. Для локальной быстрой сборки — docker (по умолчанию). Не забудьте переключиться (`--use`), иначе buildx build использует default-драйвер и multi-arch упадёт.' },
              ],
            },
            {
              id: 'dk-l13-s5',
              title: 'Проверь себя: драйверы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте драйвер buildx и его особенность',
                pairs: [
                  { left: 'docker', right: 'Обычная локальная сборка (по умолчанию)' },
                  { left: 'docker-container', right: 'Multi-platform и кэш в registry' },
                  { left: 'kubernetes', right: 'Сборка в K8s-кластере' },
                  { left: 'remote', right: 'Удалённый buildx-сервер' },
                ],
                explanation:
                  'docker — просто, без multi-arch. docker-container — стандарт для прода. kubernetes — сборка внутри K8s. remote — на удалённом сервере. Выбирайте по задаче.',
              },
            },
          ],
        },
        {
          id: 'dk-l14',
          title: 'Кэш сборки: где хранить и как ускорять',
          minutes: 35,
          steps: [
            {
              id: 'dk-l14-s1',
              title: 'Проблема: кэш локален',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Обычный BuildKit-кэш хранится на машине, где идёт сборка. На CI каждый джоб — чистая машина, кэша нет, все слои собираются заново. Для проекта на 5 минут сборки это 5 минут × 20 пушей в день = 100 минут простоя.' },
                { type: 'p', text: 'Решение — вынести кэш наружу: в registry или в хранилище CI. Тогда следующий джоб забирает готовые слои.' },
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
                { type: 'note', text: 'mode=max даёт лучший hit rate, но и размер кэша больше. Для multi-stage Dockerfile — обязательно max, иначе промежуточные стадии не кэшируются. Для одностадийного Dockerfile достаточно default.' },
              ],
            },
            {
              id: 'dk-l14-s3',
              title: 'Проверь себя: кэш в CI',
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
            {
              id: 'dk-l14-s4',
              title: 'Почему кэш не всегда срабатывает',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Кэш ломается чаще, чем кажется. Классические причины: изменился порядок COPY, в Dockerfile добавили ARG перед установкой зависимостей, base image обновился. Понимание, что именно ломает кэш, экономит часы отладки.' },
                {
                  type: 'list',
                  items: [
                    'COPY . . до COPY requirements.txt — любая правка кода ломает кэш зависимостей',
                    'ARG VERSION перед RUN pip install — меняется версия → ломается кэш',
                    'FROM python:3.12 (без версии) — обновился минорный тег → кэш не совпадает',
                    'RUN apt-get update без пиннинга — каждый раз новый кэш apt',
                    'Изменение файла в .dockerignore не ломает кэш, но может ломать сборку',
                    'Порядок COPY: сначала редко меняющиеся файлы, потом часто',
                  ],
                },
                {
                  type: 'code',
                  lang: 'dockerfile',
                  caption: 'Как правильно',
                  code: 'FROM python:3.12.5-slim   # пинить версию\n\nWORKDIR /app\n\n# 1. Сначала зависимости\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# 2. Потом код (меняется часто)\nCOPY src/ ./src/\nCOPY app.py .\n\nCMD ["python", "app.py"]',
                },
                { type: 'note', text: 'Правило: смотрите `docker buildx build --progress=plain` — BuildKit покажет, какие слои CACHED, а какие пересобираются. Это первое, что нужно делать, когда сборка «внезапно» замедлилась.' },
              ],
            },
            {
              id: 'dk-l14-s5',
              title: 'Проверь себя: что ломает кэш',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что ломает кэш слоя с установкой зависимостей (pip install)?',
                options: [
                  { id: 'a', text: 'Изменение requirements.txt' },
                  { id: 'b', text: 'COPY . . перед pip install (код меняется — кэш ломается)' },
                  { id: 'c', text: 'Изменение файла в src/ после COPY . . (код ниже pip install)' },
                  { id: 'd', text: 'ARG VERSION перед pip install (меняется версия)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Кэш ломается, если меняются входные данные: requirements.txt (a), весь код (b — если COPY . . выше pip), ARG (d). Изменение файла ПОСЛЕ pip install (c) не ломает кэш самого pip — только слои ниже.',
              },
            },
          ],
        },
        {
          id: 'dk-l15',
          title: 'Build secrets и безопасные аргументы',
          minutes: 30,
          steps: [
            {
              id: 'dk-l15-s1',
              title: 'Почему ARG и ENV не годятся для секретов',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В прошлом модуле мы говорили: секреты в ENV остаются в истории слоёв. С ARG та же проблема: `--build-arg TOKEN=xxx` попадёт в `docker history` и в кэш. Для токенов, паролей и ключей нужен специальный механизм — BuildKit secrets.' },
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
                { type: 'note', text: 'SSH-ключ не попадает в образ и не остаётся в слоях. Монтируется через SSH-агент хоста и исчезает после RUN. Это единственный безопасный способ клонировать приватные репозитории во время сборки.' },
              ],
            },
            {
              id: 'dk-l15-s3',
              title: 'Проверь себя: build secrets',
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
            {
              id: 'dk-l15-s4',
              title: 'Секреты в CI: build-push-action',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В GitHub Actions build-push-action@v6 поддерживает secrets и ssh из коробки. Секреты передаются из secrets CI, монтируются в RUN, не остаются в образе.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'build-push-action с секретом',
                  code: '- uses: docker/build-push-action@v6\n  with:\n    context: .\n    push: true\n    tags: ghcr.io/myorg/myapp:1.4.2\n    secrets: |\n      pypi_token=${{ secrets.PYPI_TOKEN }}\n      npm_token=${{ secrets.NPM_TOKEN }}\n    ssh: |\n      default=${{ secrets.SSH_PRIVATE_KEY }}',
                },
                {
                  type: 'list',
                  items: [
                    'secrets: — список пар id=value через перевод строки',
                    'ssh: — SSH-ключ для --mount=type=ssh',
                    'Секреты не попадают в docker history',
                    'Секреты не попадают в layer cache (важно: кэш не «запомнит» секрет)',
                    'В Dockerfile — `--mount=type=secret,id=pypi_token`',
                  ],
                },
                { type: 'note', text: 'Старый антипаттерн: `--build-arg GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}`. Токен попадёт в образ (виден через docker history). Правильно — build secrets через `secrets:` в build-push-action.' },
              ],
            },
            {
              id: 'dk-l15-s5',
              title: 'Проверь себя: проверка',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие методы передачи секретов в сборку безопасны (не оставляют следов в образе)?',
                options: [
                  { id: 'a', text: '--mount=type=secret с --secret id=...,env=...' },
                  { id: 'b', text: '--mount=type=ssh для git clone приватного репо' },
                  { id: 'c', text: '--build-arg TOKEN=xxx' },
                  { id: 'd', text: 'ENV TOKEN=xxx в Dockerfile' },
                ],
                correct: ['a', 'b'],
                explanation:
                  'Только --mount=type=secret и --mount=type=ssh не оставляют следов. --build-arg и ENV — оба записываются в docker history и видны через `docker history <image>`.',
              },
            },
          ],
        },
        {
          id: 'dk-l16',
          title: 'Multi-arch: один образ на все архитектуры',
          minutes: 30,
          steps: [
            {
              id: 'dk-l16-s1',
              title: 'Зачем multi-arch',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Образ, собранный на Intel/AMD (amd64), не запустится на Apple Silicon (arm64) и на Raspberry Pi (arm64/armv7) — и наоборот. Multi-arch образ содержит несколько вариантов под одной «крышей» (manifest list), и Docker сам выбирает нужный.' },
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
                { type: 'note', text: 'Для multi-arch нужен buildx с драйвером docker-container (не docker). На Apple Silicon/Windows — эмуляция через QEMU замедляет arm64-сборку в 2–5 раз. В CI — отдельный arm-раннер (GitHub: ubuntu-latest-arm, но это платно) или cross-compile.' },
              ],
            },
            {
              id: 'dk-l16-s2',
              title: 'Dockerfile для multi-arch',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Если базовый образ и бинарники уже multi-arch (Python, Node, Go — скомпилировать под целевую архитектуру), Dockerfile переписывать не нужно. Проблемы начинаются, если внутри вы ставите системные пакеты с предкомпилированными бинарниками.' },
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
                { type: 'note', text: 'Кросс-компиляция (Go, Rust, C++ с готовым toolchain) — быстрая. Эмуляция через QEMU (Python, Node с pip/npm install) — медленная, но универсальная. Для Python-образов multi-arch в CI — 10–20 минут на arm64.' },
              ],
            },
            {
              id: 'dk-l16-s3',
              title: 'Проверь себя: multi-arch',
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
            {
              id: 'dk-l16-s4',
              title: 'QEMU и скорость сборки',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'На amd64-машине собрать arm64-образ можно только через эмуляцию QEMU. Это работает, но медленно: в 2–5 раз медленнее нативной сборки. Особенно больно для Python/Node, где много RUN-шагов.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'setup-qemu в GitHub Actions',
                  code: '- uses: docker/setup-qemu-action@v3    # регистрирует QEMU binfmt\n- uses: docker/setup-buildx-action@v3\n\n- uses: docker/build-push-action@v6\n  with:\n    platforms: linux/amd64,linux/arm64\n    push: true\n    tags: ghcr.io/myorg/myapp:1.4.2',
                },
                {
                  type: 'list',
                  items: [
                    'QEMU — эмулятор, регистрируется через binfmt_misc',
                    'setup-qemu-action ставит QEMU автоматически',
                    'Эмуляция замедляет сборку в 2–5 раз',
                    'Альтернативы: self-hosted arm-раннер (быстро), кросс-компиляция Go/Rust (очень быстро)',
                    'Для Python/Node — QEMU неизбежен, если нет arm-раннера',
                  ],
                },
                { type: 'note', text: 'Совет: если multi-arch нужен только для Apple Silicon разработчиков, но прод — amd64, соберите amd64-образ и запускайте его на Mac через Rosetta (Docker Desktop). Это дешевле, чем QEMU-сборка на каждый push.' },
              ],
            },
            {
              id: 'dk-l16-s5',
              title: 'Проверь себя: QEMU',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему multi-arch сборка с QEMU медленная?',
                options: [
                  { id: 'a', text: 'QEMU использует интерпретацию, а не нативное выполнение — каждый байткод эмулируется' },
                  { id: 'b', text: 'QEMU сжимает образ' },
                  { id: 'c', text: 'Docker не поддерживает QEMU' },
                  { id: 'd', text: 'QEMU работает только на Windows' },
                ],
                correct: ['a'],
                explanation:
                  'QEMU — эмулятор: он интерпретирует arm64-инструкции на amd64-хосте, а не выполняет их нативно. Отсюда замедление в 2–5 раз. Кросс-компиляция (Go, Rust) — обходит это и работает нативно.',
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
          minutes: 30,
          steps: [
            {
              id: 'dk-l17-s1',
              title: 'Зачем сканировать',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Любой базовый образ содержит десятки пакетов: openssl, libc, glibc, curl. В них регулярно находят CVE (уязвимости). Сканирование показывает, что именно в вашем образе уязвимо и насколько критично. Это первый шаг supply-chain security.' },
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
                { type: 'p', text: 'Найти CVE — полдела. Реальная проблема — их количество. В образе на 500 МБ может быть 200+ CVE, и 90% из них — в пакетах, которые вы не используете. Задача не «устранить всё», а приоритизировать.' },
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
                { type: 'note', text: 'CVE в пакетах, которые не используются в вашем приложении (например, git в базовом образе, если вы не делаете git-операции) — формально уязвимость, но фактически не эксплуатируется. Trivy показывает их все — фильтруйте по реальному использованию.' },
              ],
            },
            {
              id: 'dk-l17-s3',
              title: 'Проверь себя: приоритизация',
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
            {
              id: 'dk-l17-s4',
              title: 'Триаж CVE: что делать с отчётом',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Trivy выдаёт 200 строк — что с ними делать? Не надо «чинить все». Нужен процесс триажа: разделить CVE на «реально опасно» и «шум».' },
                {
                  type: 'list',
                  items: [
                    'Критичные (Critical/High) — приоритет 1, чинить или обосновать',
                    'CVE в неиспользуемых пакетах — в тикет с низким приоритетом',
                    'CVE без фикса (unfixed) — не чинится, но и не эксплуатируется (нет патча)',
                    'CVE с фиксом в новом базовом образе — обновить базовый образ',
                    'Используйте .trivyignore для обоснованных исключений (с комментарием!)',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: '.trivyignore',
                  code: '# CVE-2023-12345 — в git, который не используется в runtime\n# Обоснование: git удаляется в multi-stage build, в финальный образ не попадает\nCVE-2023-12345\n\n# CVE-2024-54321 — low severity, нет фикса, не эксплуатируется\nCVE-2024-54321',
                },
                { type: 'note', text: 'Правило: .trivyignore без комментария — зло. Через полгода никто не вспомнит, почему CVE в игноре. Комментарий объясняет решение и срок пересмотра. На собеседовании senior DevOps спросят «как триажите CVE?» — это ответ.' },
              ],
            },
            {
              id: 'dk-l17-s5',
              title: 'Проверь себя: триаж',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики правильного триажа CVE?',
                options: [
                  { id: 'a', text: 'Critical/High — блокер релиза или обоснование' },
                  { id: 'b', text: 'Игнорировать все CVE без разбора — «все равно их много»' },
                  { id: 'c', text: '.trivyignore только с комментарием и обоснованием' },
                  { id: 'd', text: 'Обновлять базовый образ, если для CVE есть фикс' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'Critical/High — блокер (a). Игнор только с обоснованием (c). Обновление базового образа для фиксов (d). «Игнорировать всё» (b) — гарантированный инцидент: очередной Log4Shell пройдёт мимо.',
              },
            },
          ],
        },
        {
          id: 'dk-l18',
          title: 'SBOM и подпись образов',
          minutes: 30,
          steps: [
            {
              id: 'dk-l18-s1',
              title: 'SBOM: что внутри образа',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'SBOM (Software Bill of Materials) — «состав» образа: все пакеты и их версии. Нужен для аудита, безопасности и compliance: «а есть ли у нас log4j 2.14?», «какие версии библиотек в проде?». Отвечать на такие вопросы без SBOM — дни, с SBOM — секунды.' },
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
                { type: 'p', text: 'Подпись образа гарантирует, что образ собран именно вами и не был подменён. При деплое проверяется подпись — если не совпала, деплой блокируется. Это защита от supply-chain атак: злоумышленник не сможет подменить образ в registry.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Cosign: подпись и проверка',
                  code: '# Генерация ключевой пары\ncosign generate-key-pair\n# Создаст cosign.key (приватный, хранить в secrets) и cosign.pub (публичный)\n\n# Подпись образа\ncosign sign --key cosign.key ghcr.io/myorg/myapp:1.4.2\n\n# Проверка подписи (например, в admission controller K8s)\ncosign verify --key cosign.pub ghcr.io/myorg/myapp:1.4.2',
                },
                { type: 'note', text: 'Cosign — часть проекта Sigstore (Linux Foundation). Для open-source проектов можно использовать «keyless» подпись через OIDC (без хранения ключей). Для приватных — key-based проще. На собеседовании по DevSecOps это спросят.' },
              ],
            },
            {
              id: 'dk-l18-s3',
              title: 'Проверь себя: SBOM',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое SBOM?',
                options: [
                  { id: 'a', text: 'Инструмент для подписи образов' },
                  { id: 'b', text: '«Состав» образа: все пакеты и их версии в JSON-формате' },
                  { id: 'c', text: 'Тип Dockerfile' },
                  { id: 'd', text: 'Сканер уязвимостей' },
                ],
                correct: ['b'],
                explanation:
                  'SBOM (Software Bill of Materials) — «накладная» на образ: полный список пакетов с версиями. Нужен для аудита («есть ли log4j 2.14?») и compliance. Не сканер (это Trivy/Grype) и не подпись (это cosign).',
              },
            },
            {
              id: 'dk-l18-s4',
              title: 'Keyless-подпись и SLSA',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Key-based cosign требует хранить приватный ключ. Keyless — новее и безопаснее: подпись через OIDC GitHub Actions, сертификат от Fulcio, лог в Rekor. Никаких ключей — нечего красть.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Keyless cosign в GitHub Actions',
                  code: 'permissions:\n  id-token: write      # OIDC для keyless\n  packages: write\n  contents: read\n\nsteps:\n  - uses: sigstore/cosign-installer@v3\n  - run: |\n      cosign sign --yes ghcr.io/${{ github.repository }}:${{ github.sha }}\n    # Ключ не нужен — cosign берёт OIDC-токен GitHub',
                },
                {
                  type: 'table',
                  caption: 'Key-based vs keyless',
                  head: ['Параметр', 'Key-based', 'Keyless (OIDC)'],
                  rows: [
                    ['Хранение ключа', 'Нужно (cosign.key в secrets)', 'Нет'],
                    ['Утечка ключа', 'Возможна', 'Невозможна (ключа нет)'],
                    ['Проверка', 'cosign verify --key cosign.pub', 'cosign verify --certificate-identity ... --certificate-oidc-issuer ...'],
                    ['Когда', 'Приватные registry, offline', 'GitHub Actions, GitLab CI, OIDC-провайдеры'],
                  ],
                },
                { type: 'note', text: 'SLSA (Supply-chain Levels for Software Artifacts) — уровни гарантий (1–4): 1 — есть provenance, 2 — защищённый раннер, 3 — provenance нельзя подделать, 4 — reproducible builds. Начинайте с 1–2. В 2025 build-push-action умеет `provenance: true` — это SLSA level 2 из коробки.' },
              ],
            },
            {
              id: 'dk-l18-s5',
              title: 'Проверь себя: подпись',
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
          minutes: 25,
          steps: [
            {
              id: 'dk-l19-s1',
              title: 'Что такое distroless',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Distroless — образы Google без пакетного менеджера, без shell, без стандартных утилит. Внутри — только runtime приложения и минимальные зависимости. Размер — 2–20 МБ. Площадь атаки — минимальная: нет `sh`, `apt`, `curl`, которые обычно эксплуатируют злоумышленники.' },
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
                { type: 'note', text: 'Distroless не подходит, если нужен shell для отладки или bash-скрипты. Альтернатива — alpine (есть sh, но ~5 МБ и musl libc, с которым бывают проблемы) или slim-образы Debian (30–50 МБ, есть shell). Для Go/Rust distroless — стандарт. Для Python/Node — чуть сложнее из-за интерпретатора.' },
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
              title: 'Проверь себя: distroless',
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
            {
              id: 'dk-l19-s4',
              title: 'Отладка distroless: docker debug',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Главный минус distroless — нет shell: `docker exec -it app sh` не сработает. Для отладки есть `docker debug` (Docker Desktop 4.27+) — он подключает toolbox с shell, curl, dig и другими утилитами к работающему контейнеру, не меняя образ.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker debug',
                  code: '# Не работает для distroless:\ndocker exec -it myapp sh\n# OCI runtime exec failed: exec: "sh": executable file not found\n\n# Работает — отдельный toolbox-контейнер с shell:\ndocker debug myapp\n# Откроется shell внутри toolbox, но с доступом к файлам и сети myapp\n\n# Полезные команды внутри:\n# ls /app          — файлы приложения\n# cat /proc/1/environ — переменные\n# curl localhost:8000/healthz — проверка health',
                },
                {
                  type: 'list',
                  items: [
                    'distroless — нет shell, нет пакетного менеджера',
                    'docker exec … sh — не работает',
                    'docker debug — подключает toolbox с shell к контейнеру',
                    'Альтернатива — sidecar-контейнер в той же сети K8s (debug-контейнер)',
                    'ephemeral containers (K8s 1.23+) — официальный способ отладки',
                  ],
                },
                { type: 'note', text: 'Не отказывайтесь от distroless только из-за «неудобно отлаживать». Docker debug + ephemeral containers в K8s решают эту проблему. Плюсы (2 МБ образ, минимальная площадь атаки) перевешивают.' },
              ],
            },
            {
              id: 'dk-l19-s5',
              title: 'Проверь себя: отладка',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как отладить distroless-контейнер (в нём нет sh)?',
                options: [
                  { id: 'a', text: 'docker exec -it myapp sh — не сработает, но попробуйте' },
                  { id: 'b', text: 'docker debug myapp — подключает toolbox с shell к контейнеру' },
                  { id: 'c', text: 'Собрать новый образ с shell и задеплоить' },
                  { id: 'd', text: 'distroless нельзя отладить' },
                ],
                correct: ['b'],
                explanation:
                  'docker debug (Docker Desktop 4.27+) запускает отдельный toolbox-контейнер с shell и утилитами, подключая его к работающему distroless-контейнеру. В K8s — ephemeral containers (kubectl debug).',
              },
            },
          ],
        },
        {
          id: 'dk-l20',
          title: 'Security в CI: pipeline с проверками',
          minutes: 30,
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
                { type: 'note', text: 'На собеседовании по DevSecOps спросят: «Как вы управляете CVE в образах?». Хороший ответ: «Trivy на каждый PR, блокируем HIGH/CRITICAL, Dependabot обновляет базовые образы weekly, еженедельная пересборка для свежих патчей, SBOM публикуем как артефакт». Это показывает зрелый процесс.' },
              ],
            },
            {
              id: 'dk-l20-s3',
              title: 'Проверь себя: пересборка',
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
            {
              id: 'dk-l20-s4',
              title: 'Runtime security: Falco и Tetragon',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Сканирование — про образ «до запуска». Но что если образ чистый, а внутри контейнера что-то странное? Runtime security (Falco, Tetragon) мониторит системные вызовы и алертит на подозрительное поведение.' },
                {
                  type: 'list',
                  items: [
                    'Falco (CNCF) — eBPF-based, алерты на аномалии: «процесс запустил shell в контейнере»',
                    'Tetragon (Cilium) — eBPF, наблюдение и enforcement в K8s',
                    'Правила Falco: shell в контейнере, чтение /etc/shadow, запрос к metadata API',
                    'Tetragon умеет блокировать (не только алертить) — kill процесса',
                    'Без runtime security вы узнаете о compromise только когда данные уже утекли',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Пример правила Falco: shell в контейнере',
                  code: '- rule: Shell spawned in a container\n  desc: Обнаружен shell внутри контейнера (типичный признак compromise)\n  condition: >\n    spawned_process\n    and container.id != host\n    and proc.name in (bash, sh, zsh, ash)\n  output: >\n    Shell spawned (user=%user.name container=%container.name shell=%proc.name)\n  priority: WARNING',
                },
                { type: 'note', text: 'Если в вашем проде «shell в контейнере» — это не норма (например, distroless, read-only ФС), то правило Falco на shell — простой и эффективный детект компрометации. В 2025 стандарт для K8s — Tetragon или Falco.' },
              ],
            },
            {
              id: 'dk-l20-s5',
              title: 'Проверь себя: runtime',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его роль',
                pairs: [
                  { left: 'Trivy', right: 'Сканирование CVE в образе (до запуска)' },
                  { left: 'cosign', right: 'Подпись и проверка образа' },
                  { left: 'Falco', right: 'Runtime: алерт на shell в контейнере' },
                  { left: 'Dependabot', right: 'Автообновление базовых образов' },
                ],
                explanation:
                  'Trivy — CVE. cosign — подпись. Falco — runtime-защита (eBPF). Dependabot — автообновление. Полный pipeline: build → scan → sign → deploy → runtime monitor.',
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
                { type: 'p', text: 'Контейнер должен писать логи в stdout и stderr — это фундаментальное правило 12-factor. Docker перехватывает их через logging driver: json-file (по умолчанию), journald, syslog, fluentd, gelf и другие.' },
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
                { type: 'note', text: 'Дефолтный json-file не имеет ротации! Через месяц /var/lib/docker/containers/ съест весь диск. Всегда указывайте --log-opt max-size=10m --log-opt max-file=3, либо используйте другой драйвер. Это классический инцидент «диск на проде забился логами».' },
              ],
            },
            {
              id: 'dk-l21-s2',
              title: 'Структурированные логи',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Логи должны быть JSON-строками, а не plaintext. Парсить «[INFO] user 123 logged in at 2024-01-01» сложно, а `{"level":"info","user_id":123,"action":"login"}` — тривиально. В продакшене structured logs — обязательны.' },
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
              title: 'Проверь себя: ротация',
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
            {
              id: 'dk-l21-s4',
              title: '12-factor: логи как поток событий',
              type: 'theory',
              blocks: [
                { type: 'p', text: '12-factor app, фактор XI «Logs»: приложение не должно заботиться о том, куда пишутся логи. Оно просто пишет в stdout — а среда (Docker, K8s, systemd) решает, что с ними делать: собрать в ELK, отправить в Loki, записать в файл.' },
                {
                  type: 'list',
                  items: [
                    'Приложение пишет только в stdout/stderr — никаких log-файлов внутри',
                    'Среда (Docker) перехватывает поток и маршрутизирует',
                    'Ротация и ретеншн — задача среды, а не приложения',
                    'Не открывайте файлы для логов внутри контейнера',
                    'Не парсите свои же логи внутри приложения — это работа внешних систем',
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Плохо vs хорошо',
                  code: '# ПЛОХО: файл внутри контейнера\nlogging.basicConfig(filename="/var/log/app.log")\n# → при удалении контейнера логи исчезают, диск забивается\n\n# ХОРОШО: stdout, Docker подхватит\nlogging.basicConfig(\n    level=logging.INFO,\n    handlers=[logging.StreamHandler(sys.stdout)],\n)',
                },
                { type: 'note', text: 'Исключение: приложение, которое уже пишет в файл (например, nginx) — файл монтируется в volume и ротация настраивается через logrotate внутри контейнера или через logging driver. Но это скорее legacy-подход; новые приложения — stdout.' },
              ],
            },
            {
              id: 'dk-l21-s5',
              title: 'Проверь себя: 12-factor',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что верно про 12-factor-подход к логам?',
                options: [
                  { id: 'a', text: 'Приложение пишет в stdout/stderr' },
                  { id: 'b', text: 'Среда (Docker, K8s) решает, куда девать логи' },
                  { id: 'c', text: 'Приложение само ротирует и архивирует свои логи' },
                  { id: 'd', text: 'Не надо писать в файлы внутри контейнера' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  '12-factor: приложение — только в stdout (a), среда — маршрутизация (b), файлы внутри контейнера — плохо (d). Ротация и архивация — не задача приложения (c). Docker / K8s / logging driver берут это на себя.',
              },
            },
          ],
        },
        {
          id: 'dk-l22',
          title: 'Отладка: exec, inspect, diff, cp',
          minutes: 30,
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
                { type: 'note', text: 'Если distroless (нет sh) — `docker run --rm -it --network container:mycontainer alpine sh` запустит отдельный alpine-контейнер в той же сети. Это стандартный трюк для отладки distroless.' },
              ],
            },
            {
              id: 'dk-l22-s3',
              title: 'Проверь себя: exit code 137',
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
            {
              id: 'dk-l22-s4',
              title: 'Отладка distroless: docker debug',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Distroless-образы (без shell) не пускают `docker exec -it app sh`. Для отладки Docker Desktop 4.27+ даёт `docker debug` — подключает toolbox-контейнер с shell, curl, dig и другими утилитами, но с доступом к файлам и сети целевого контейнера.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'docker debug в действии',
                  code: '# Не работает для distroless:\ndocker exec -it myapp sh\n# OCI runtime exec failed: exec: "sh": executable file not found\n\n# Работает — toolbox с shell:\ndocker debug myapp\n\n# Внутри toolbox:\n# ls /app              — файлы приложения\n# cat /proc/1/environ  — переменные окружения процесса 1\n# ps aux               — процессы\n# curl localhost:8000  — проверка сети\n# wget ...             — скачать\n# strace -p 1          — трассировка системных вызовов',
                },
                {
                  type: 'list',
                  items: [
                    'docker debug — «отладочный shell» для любого контейнера',
                    'Работает и для distroless, и для scratch-образов',
                    'Toolbox содержит: sh, bash, curl, wget, ps, strace, dig',
                    'Не меняет образ и не оставляет следов',
                    'В K8s — kubectl debug с ephemeral containers',
                  ],
                },
                { type: 'note', text: 'docker debug — не «магия»: это отдельный контейнер, который шарит namespace-ы с целевым (network, PID, filesystem). Внутри toolbox видно файлы приложения и его сеть. Альтернатива в K8s — `kubectl debug -it myapp --image=nicolaka/netshoot`.' },
              ],
            },
            {
              id: 'dk-l22-s5',
              title: 'Проверь себя: инструменты отладки',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и её назначение',
                pairs: [
                  { left: 'docker logs', right: 'Логи контейнера (stdout/stderr)' },
                  { left: 'docker exec', right: 'Выполнить команду внутри работающего контейнера' },
                  { left: 'docker inspect', right: 'Метаданные: state, exit code, network' },
                  { left: 'docker debug', right: 'Toolbox-shell для distroless' },
                ],
                explanation:
                  'logs — что приложение говорит. exec — зайти внутрь (если есть shell). inspect — метаданные (OOMKilled, exit code, IP). debug — toolbox для distroless. Полный набор для отладки.',
              },
            },
          ],
        },
        {
          id: 'dk-l23',
          title: 'Мониторинг: docker stats и cAdvisor',
          minutes: 25,
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
                { type: 'note', text: 'docker stats показывает только запущенные контейнеры. Для истории и алертов — cAdvisor + Prometheus + Grafana. docker stats — для «глянуть прямо сейчас», а не для мониторинга в проде.' },
              ],
            },
            {
              id: 'dk-l23-s2',
              title: 'cAdvisor и Prometheus',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'cAdvisor (Google) — стандартный инструмент для сбора метрик Docker-контейнеров. Собирает CPU, память, диск, сеть по каждому контейнеру и отдаёт в формате Prometheus. В продакшене — cAdvisor + Prometheus + Grafana — классический стек.' },
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
                { type: 'note', text: 'Для одного сервера cAdvisor + Prometheus + Grafana — это 3 контейнера. Для K8s — Prometheus Operator, node-exporter и kube-state-metrics покрывают то же самое. На собеседовании по DevOps спросят: «Как мониторите контейнеры?» — правильный ответ именно такой.' },
              ],
            },
            {
              id: 'dk-l23-s3',
              title: 'Проверь себя: инструменты',
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
            {
              id: 'dk-l23-s4',
              title: 'Ключевые метрики контейнера',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'На что смотреть в первую очередь, когда «контейнер тормозит»? Четыре метрики покрывают 90% инцидентов.' },
                {
                  type: 'table',
                  caption: 'Метрики и что они значат',
                  head: ['Метрика', 'Тревога', 'Причина'],
                  rows: [
                    ['CPU %', 'Стабильно > 80% лимита', 'Тяжёлый код, неэффективный алгоритм, нет кэша'],
                    ['MEM USAGE / LIMIT', 'Растёт к 100%', 'Утечка памяти, мало лимита, нет cleanup'],
                    ['BLOCK I/O', 'Высокий read/write', 'Тяжёлый диск, логи без ротации, БД на медленном диске'],
                    ['PIDS', 'Приближается к лимиту', 'Утечка процессов, fork-bomb в скрипте'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка лимитов',
                  code: '# Лимиты контейнера\ndocker inspect -f \'{{.HostConfig.Memory}}\' mycontainer\ndocker inspect -f \'{{.HostConfig.NanoCpus}}\' mycontainer\ndocker inspect -f \'{{.HostConfig.PidsLimit}}\' mycontainer\n\n# Текущее потребление\ndocker stats --no-stream mycontainer',
                },
                { type: 'note', text: 'Классический инцидент: контейнер без лимитов съедает всю RAM хоста — OOMKilled получают все. Всегда ставьте --memory и --cpus. Для прода — ещё --pids-limit (защита от fork-bomb).' },
              ],
            },
            {
              id: 'dk-l23-s5',
              title: 'Проверь себя: метрики',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Контейнер «тормозит», CPU 20%, MEM 40%, BLOCK I/O высокий. Что вероятнее?',
                options: [
                  { id: 'a', text: 'Не хватает CPU' },
                  { id: 'b', text: 'Проблема с диском: тяжёлые I/O-операции (логи, БД, файлы)' },
                  { id: 'c', text: 'Утечка памяти' },
                  { id: 'd', text: 'Мало процессов (PIDS)' },
                ],
                correct: ['b'],
                explanation:
                  'Высокий BLOCK I/O при низких CPU и MEM — контейнер ждёт диск. Причины: логи без ротации, БД на медленном диске, активная запись/чтение файлов. Решение: ротация, быстрый SSD, кэш.',
              },
            },
          ],
        },
        {
          id: 'dk-l24',
          title: 'Healthcheck и restart policies в проде',
          minutes: 30,
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
                { type: 'note', text: 'HEALTHCHECK сам по себе НЕ перезапускает контейнер. Он только помечает статус. Перезапуск — задача оркестратора (docker swarm, Kubernetes, docker compose) или restart policy. На собеседовании это любят спрашивать: «HEALTHCHECK и restart — это одно и то же?» — нет.' },
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
                { type: 'note', text: 'Комбинация, которую используют в проде: --restart unless-stopped + HEALTHCHECK + depends_on: condition: service_healthy (в compose). Тогда сервис перезапускается при падении И при провале healthcheck (compose сам убивает unhealthy и перезапускает, если restart policy позволяет).' },
              ],
            },
            {
              id: 'dk-l24-s3',
              title: 'Проверь себя: restart policy',
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
            {
              id: 'dk-l24-s4',
              title: 'Healthcheck vs readiness vs liveness',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В K8s есть три вида проверок: liveness, readiness, startup. В Docker — только одна (HEALTHCHECK), но она ближе к liveness. Понимание разницы — must-have для перехода между Docker и K8s.' },
                {
                  type: 'table',
                  caption: 'Три проверки (K8s) и одна (Docker)',
                  head: ['Проверка', 'Что проверяет', 'Действие при провале'],
                  rows: [
                    ['liveness', 'Жив ли процесс', 'Перезапустить контейнер'],
                    ['readiness', 'Готов ли принимать трафик', 'Убрать из endpoints сервиса (не убивать)'],
                    ['startup', 'Стартовал ли', 'Ждать, при провале — перезапуск'],
                    ['HEALTHCHECK (Docker)', 'Жив ли сервис (близко к liveness)', 'Пометить unhealthy (перезапуск — если restart policy)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'K8s: три пробы',
                  code: 'spec:\n  containers:\n    - name: web\n      startupProbe:\n        httpGet: { path: /healthz, port: 8000 }\n        failureThreshold: 30\n      readinessProbe:\n        httpGet: { path: /ready, port: 8000 }\n        periodSeconds: 5\n      livenessProbe:\n        httpGet: { path: /live, port: 8000 }\n        periodSeconds: 10',
                },
                { type: 'note', text: 'Классическая ошибка: liveness на тот же эндпоинт, что readiness. При перегрузке приложение медленно отвечает на readiness — liveness перезапускает его, усугубляя ситуацию. liveness должна проверять «не завис ли процесс», а не «справляется ли с нагрузкой».' },
              ],
            },
            {
              id: 'dk-l24-s5',
              title: 'Проверь себя: liveness vs readiness',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем liveness отличается от readiness в K8s?',
                options: [
                  { id: 'a', text: 'Ничем, это синонимы' },
                  { id: 'b', text: 'liveness перезапускает контейнер, readiness убирает из endpoints (не убивает)' },
                  { id: 'c', text: 'liveness быстрее' },
                  { id: 'd', text: 'readiness — только для баз данных' },
                ],
                correct: ['b'],
                explanation:
                  'liveness: «не завис ли процесс» → перезапуск. readiness: «готов ли принимать трафик» → убрать из балансировки, но не убивать. Пока readiness-проба падает, трафик не идёт, но контейнер живёт и может восстановиться.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'dk-m8',
      title: 'Практикум',
      lessons: [
        {
          id: 'dk-l25',
          title: 'Практика: образы, Dockerfile, compose',
          minutes: 35,
          steps: [
            {
              id: 'dk-l25-s1',
              title: 'Образ vs контейнер',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое Docker-образ?',
                options: [
                  { id: 'a', text: 'Запущенный процесс' },
                  { id: 'b', text: 'Неизменяемый шаблон со слоями' },
                  { id: 'c', text: 'Dockerfile' },
                  { id: 'd', text: 'Volume' },
                ],
                correct: ['b'],
                explanation: 'Образ — шаблон. Контейнер — запущенный экземпляр образа. Из одного образа можно запустить много контейнеров.',
              },
            },
            {
              id: 'dk-l25-s2',
              title: 'Сборка образа',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Соберите образ `myapp` с тегом `1.0` из текущей папки.',
                accepted: ['docker build -t myapp:1.0 .', 'docker build -t myapp:1.0 ./'],
                placeholder: 'docker ...',
                hint: 'build, тег, точка',
                explanation: 'docker build -t myapp:1.0 . — точка в конце означает «текущая директория как контекст сборки».',
              },
            },
            {
              id: 'dk-l25-s3',
              title: 'Порядок слоёв',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте инструкции Dockerfile в правильном порядке (от базового образа до запуска)',
                items: ['FROM python:3.12-slim', 'WORKDIR /app', 'COPY requirements.txt .', 'RUN pip install -r requirements.txt', 'CMD ["python", "main.py"]'],
                correct: ['FROM python:3.12-slim', 'WORKDIR /app', 'COPY requirements.txt .', 'RUN pip install -r requirements.txt', 'CMD ["python", "main.py"]'],
                explanation: 'FROM → WORKDIR → COPY зависимостей → RUN установки → CMD запуска. Зависимости копируем до кода, чтобы кэш работал.',
              },
            },
            {
              id: 'dk-l25-s4',
              title: 'Dockerfile',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в Dockerfile',
                text: '____ python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\n____ pip install -r requirements.txt',
                blanks: [
                  { accepted: ['FROM'], hint: 'базовый образ' },
                  { accepted: ['RUN'], hint: 'выполнить команду' },
                ],
                explanation: 'FROM — базовый образ. RUN — выполнить команду при сборке.',
              },
            },
            {
              id: 'dk-l25-s5',
              title: 'Команды Docker',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и действие',
                pairs: [
                  { left: 'docker build', right: 'Собрать образ' },
                  { left: 'docker run', right: 'Запустить контейнер' },
                  { left: 'docker push', right: 'Отправить в registry' },
                  { left: 'docker pull', right: 'Скачать из registry' },
                ],
                explanation: 'build — сборка, run — запуск, push/pull — обмен с registry.',
              },
            },
            {
              id: 'dk-l25-s6',
              title: 'Multi-stage',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Минимум сколько стадий (FROM) нужно в multi-stage Dockerfile для сборки и запуска?',
                correct: 2,
                explanation: 'Минимум 2: одна для сборки (с компиляторами), вторая — финальная (только артефакт).',
              },
            },
            {
              id: 'dk-l25-s7',
              title: 'Кэш слоёв',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что сбрасывает кэш слоя в Docker?',
                options: [
                  { id: 'a', text: 'Изменение файла, скопированного в этом слое' },
                  { id: 'b', text: 'Изменение предыдущего слоя' },
                  { id: 'c', text: 'Изменение переменной окружения в команде' },
                  { id: 'd', text: 'Простой Dockerfile' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'Кэш инвалидируется, если изменилась инструкция, её аргументы или входные файлы. Изменение предыдущего слоя ломает все последующие.',
              },
            },
            {
              id: 'dk-l25-s8',
              title: 'VM vs контейнер',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого',
                columns: ['VM', 'Контейнер'],
                rows: [
                  { label: 'Отдельное ядро ОС', correct: ['VM'] },
                  { label: 'Делит ядро с хостом', correct: ['Контейнер'] },
                  { label: 'Стартует за миллисекунды', correct: ['Контейнер'] },
                  { label: 'Тяжелее по ресурсам', correct: ['VM'] },
                ],
                explanation: 'VM виртуализирует железо и запускает свою ОС. Контейнер — изолированный процесс на общем ядре.',
              },
            },
            {
              id: 'dk-l25-s9',
              title: 'Напишите Dockerfile',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите Dockerfile для Python-приложения: базовый образ python:3.12-slim, рабочая папка /app, копирование и установка requirements.txt, запуск main.py.',
                starterCode: '# ваш Dockerfile\n',
                mustInclude: [
                  { pattern: '^FROM python:3\\.12-slim', message: 'Нужен базовый образ FROM python:3.12-slim' },
                  { pattern: '^WORKDIR /app', message: 'Нужен WORKDIR /app' },
                  { pattern: '^COPY requirements\\.txt', message: 'Нужно COPY requirements.txt' },
                  { pattern: '^RUN pip install', message: 'Нужен RUN pip install' },
                  { pattern: '^CMD ', message: 'Нужен CMD для запуска' },
                ],
                mustNotInclude: [
                  { pattern: 'password=', message: 'Не храните пароли в Dockerfile' },
                ],
                explanation: 'FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["python", "main.py"]',
              },
            },
            {
              id: 'dk-l25-s10',
              title: 'Volume',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен Docker volume?',
                options: [
                  { id: 'a', text: 'Ускорить сборку' },
                  { id: 'b', text: 'Сохранить данные после удаления контейнера' },
                  { id: 'c', text: 'Уменьшить размер образа' },
                  { id: 'd', text: 'Изолировать сеть' },
                ],
                correct: ['b'],
                explanation: 'Volume живёт независимо от контейнера. Нужен для БД, загрузок, логов — всего, что нельзя потерять.',
              },
            },
          ],
        },
      ],
    },
  ],
};