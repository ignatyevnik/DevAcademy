import type { Course } from './types';

export const nginxEnvoyCourse: Course = {
    slug: 'nginx-envoy',
    title: 'Nginx, Envoy и балансировка трафика',
    subtitle:
        'Reverse proxy, TLS-терминация, HTTP/2 и HTTP/3, кэширование, сжатие, rate limiting, load balancing и современные прокси для продакшена',
    description:
        'Курс для DevOps, SRE и backend-разработчиков: как устроен Nginx, как настраивать TLS и современные протоколы, как кэшировать и сжимать ответы, защищаться от нагрузки и строить отказоустойчивую балансировку. Отдельный блок — Envoy и xDS: динамическая конфигурация, фильтры, retries, circuit breaker, service mesh.',
    level: 'Средний',
    tags: ['Nginx', 'Envoy', 'Proxy', 'TLS', 'HTTP/2', 'HTTP/3', 'Load Balancing', 'DevOps'],
    accent: '#009639',
    icon: 'proxy',
    outcomes: [
        'Понимать, зачем нужен reverse proxy и чем Nginx отличается от Envoy и Apache',
        'Писать корректный nginx.conf: server, location, upstream, try_files, rewrite',
        'Настраивать TLS 1.2/1.3, HSTS, OCSP stapling и HTTP/2 & HTTP/3',
        'Кэшировать ответы с учётом cache key, Vary и инвалидации',
        'Защищать backend rate limiting и connection limits без потери UX',
        'Балансировать трафик между upstream-серверами с health checks',
        'Читать и писать конфиги Envoy: listeners, filters, clusters, xDS',
        'Понимать, когда Nginx, когда Envoy, а когда service mesh',
    ],
    requirements: [
        'Базовое понимание HTTP и DNS',
        'Опыт работы с Linux-командной строкой',
        'Представление о том, что такое TLS-сертификат (на уровне пользователя)',
    ],
    modules: [
        // ═════════════════════════════════════════════════════════════════════
        // Модуль 1. Основы reverse proxy и Nginx
        // ═════════════════════════════════════════════════════════════════════
        {
            id: 'proxy-m1',
            title: 'Основы reverse proxy и Nginx',
            lessons: [
                {
                    id: 'proxy-l1',
                    title: 'Что такое reverse proxy и зачем он нужен',
                    minutes: 15,
                    steps: [
                        {
                            id: 'proxy-l1-s1',
                            title: 'Reverse proxy vs forward proxy',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '**Reverse proxy** — сервер, который стоит между клиентом и backend и отвечает клиенту от имени backend. Клиент не знает, что за прокси стоит пул приложений: он видит один адрес, получает ответ, а прокси сам решает, куда направить запрос и что вернуть.',
                                },
                                {
                                    type: 'p',
                                    text: '**Forward proxy** — наоборот, стоит на стороне клиента и прячет клиента от серверов (корпоративный прокси, VPN-шлюз). Reverse proxy прячет серверы от клиента. Разница простая: кто кого «прячет» от кого.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Reverse proxy: одна точка входа, много backend',
                                    code: 'graph LR\n    C["Client<br/>(browser)"] -->|"HTTPS"| RP["Reverse Proxy<br/>(Nginx / Envoy)"]\n    RP -->|"HTTP"| B1["Backend 1"]\n    RP -->|"HTTP"| B2["Backend 2"]\n    RP -->|"HTTP"| B3["Backend 3"]\n    RP -.->|"cache"| Cache[("Cache")]\n    RP -.->|"metrics"| Mon["Observability"]',
                                },
                                {
                                    type: 'table',
                                    caption: 'Reverse vs forward proxy',
                                    head: ['Характеристика', 'Reverse proxy', 'Forward proxy'],
                                    rows: [
                                        ['Кто настраивает', 'Владелец сервиса', 'Владелец клиента / сетевой админ'],
                                        ['Кого скрывает', 'Backend-серверы', 'Клиентов'],
                                        ['Типичные примеры', 'Nginx, Envoy, HAProxy, Traefik, Cloudflare', 'Squid, корпоративный прокси, VPN-шлюз'],
                                        ['Зачем', 'TLS-терминация, кэш, балансировка, WAF, rate limit', 'Контроль доступа в интернет, обход ограничений, кэш'],
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Cloudflare, Fastly, Akamai — это глобальные reverse proxy (CDN). Браузер клиента общается с edge-сервером CDN, а тот — с вашим origin-сервером. Промежуточный слой решает задачи: защита, кэш, сжатие, TLS, маршрутизация.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l1-s2',
                            title: 'Задачи, которые решает reverse proxy',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Backend-приложения занимаются бизнес-логикой: обрабатывают заказы, считают отчёты, пишут в БД. Всё, что связано с сетью, TLS и трафиком, дешевле и надёжнее вынести на прокси — он спроектирован именно для этого.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**TLS-терминация**: расшифровка HTTPS, работа с сертификатами, обновление Let\'s Encrypt — одна точка для всех backend',
                                        '**Маршрутизация**: /api → backend-1, /admin → backend-2, /static → S3',
                                        '**Балансировка**: распределение запросов между пулом одинаковых backend',
                                        '**Кэширование**: отдача закэшированных ответов без обращения к backend',
                                        '**Сжатие**: gzip / brotli для ответов, чтобы экономить трафик',
                                        '**Rate limiting**: ограничение запросов на IP, токен или пользователя',
                                        '**WAF и защита**: блокировка ботов, OWASP-правила, ограничение размера body',
                                        '**Логирование и метрики**: единая точка для access log и observability',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Каждая из этих задач может быть реализована и в самом приложении — но это плохая идея. Приложение на Python/Node.js тратит CPU на TLS-хендшейки, кэширование и сжатие, а могло бы тратить его на бизнес-логику. Прокси на C/С++ с event-loop справляется с этим в разы эффективнее.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l1-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Чем reverse proxy отличается от forward proxy?',
                                options: [
                                    { id: 'a', text: 'Reverse proxy работает только с HTTPS, forward — с HTTP' },
                                    { id: 'b', text: 'Reverse proxy стоит на стороне сервера и скрывает backend от клиентов, forward — на стороне клиента и скрывает клиентов' },
                                    { id: 'c', text: 'Это одно и то же, разница только в терминологии' },
                                    { id: 'd', text: 'Forward proxy быстрее, потому что ближе к клиенту' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Reverse proxy настраивает владелец сервиса, он скрывает backend и решает задачи трафика. Forward proxy настраивает владелец клиента, он скрывает клиентов от серверов.',
                            },
                        },
                        {
                            id: 'proxy-l1-s4',
                            title: 'Nginx vs Apache vs Envoy',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx появился в 2004 как решение проблемы C10K (десять тысяч одновременных соединений) — Apache с process-per-connection моделью на это не был рассчитан. Nginx построен на **event loop** и асинхронном I/O: одно соединение — небольшой кусок памяти, а не процесс. Это даёт десятки тысяч соединений на одном сервере.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Три прокси — три ниши',
                                    head: ['Свойство', 'Nginx', 'Apache HTTP Server', 'Envoy'],
                                    rows: [
                                        ['Архитектура', 'Event loop, async I/O', 'Process/thread per connection', 'Event loop, C++, Lyft'],
                                        ['Основная ниша', 'Reverse proxy, web server, статика', 'Классический web server с .htaccess', 'Service mesh, edge proxy, API gateway'],
                                        ['Конфигурация', 'Статический nginx.conf', 'httpd.conf / .htaccess', 'Динамическая через xDS API'],
                                        ['Hot reload', 'Да, через SIGHUP', 'Да, graceful restart', 'Полностью динамическая, без restart'],
                                        ['Экосистема', 'Огромная, миллионы статей', 'Огромная, но исторически', 'Быстро растёт, CNCF graduated'],
                                        ['Идеален для', 'Один сервер с понятным конфигом', 'PHP-хостинг, legacy', 'Микросервисы, Kubernetes, mesh'],
                                    ],
                                },
                                {
                                    type: 'p',
                                    text: 'Выбор между Nginx и Envoy — не «кто лучше», а «что нужно». Если у вас один edge-сервер с ручным конфигом — Nginx проще и быстрее в разработке. Если у вас сотни сервисов и конфигурация должна меняться без рестарта — Envoy создан именно для этого.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l1-s5',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'Reverse proxy прячет backend, forward — клиентов.',
                                        'Прокси берёт на себя TLS, маршрутизацию, кэш, сжатие, rate limiting, балансировку.',
                                        'Nginx — статический конфиг, event loop, миллионы деплоев.',
                                        'Envoy — динамическая конфигурация через xDS, service mesh.',
                                        'Выбор — по задаче, а не по хайпу.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'proxy-l2',
                    title: 'Конфигурация nginx.conf: структура и иерархия',
                    minutes: 18,
                    steps: [
                        {
                            id: 'proxy-l2-s1',
                            title: 'Иерархия контекстов',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Конфиг Nginx — это дерево контекстов. Каждая директива живёт в своём контексте и наследуется вложенными. Понимание дерева — половина работы с Nginx.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**main** — корень: user, worker_processes, pid, error_log',
                                        '**events** — параметры сетевого слоя: worker_connections, use epoll',
                                        '**http** — глобальные настройки HTTP: mime types, log_format, gzip, upstreams',
                                        '**server** — виртуальный хост: listen, server_name, SSL',
                                        '**location** — маршрут внутри server: как обрабатывать конкретный префикс URL',
                                    ],
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Дерево контекстов nginx.conf',
                                    code: 'graph TD\n    Main["main<br/>(user, worker_processes)"] --> Events["events<br/>(worker_connections)"]\n    Main --> Http["http<br/>(gzip, mime, upstream)"]\n    Http --> Upstream["upstream<br/>(backend pool)"]\n    Http --> Server1["server<br/>(listen :80)"]\n    Http --> Server2["server<br/>(listen :443 ssl)"]\n    Server1 --> Loc1["location /"]\n    Server1 --> Loc2["location /api/"]\n    Server2 --> Loc3["location /"]',
                                },
                                {
                                    type: 'p',
                                    text: 'Директивы из внешних контекстов **наследуются** во внутренние. Если в http включён gzip, он работает во всех server и location, пока не переопределён. Это удобно, но иногда приводит к сюрпризам: `add_header` в location перезаписывает `add_header` из server, а не дополняет.',
                                },
                                {
                                    type: 'note',
                                    text: 'Классическая ловушка: `add_header X-Frame-Options DENY` в server и `add_header Cache-Control "no-store"` в location — второй **заменит** первый. Наследование add_header работает «всё или ничего». Используйте `add_header ... always` и дублируйте заголовки там, где нужно.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l2-s2',
                            title: 'Минимальный рабочий nginx.conf',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Начнём с базового конфига — reverse proxy для одного backend на :8080. Этот конфиг — отправная точка для всего курса.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: '/etc/nginx/nginx.conf — минимальный reverse proxy',
                                    code: 'user  nginx;\nworker_processes  auto;\nerror_log  /var/log/nginx/error.log warn;\npid        /run/nginx.pid;\n\nevents {\n    worker_connections  4096;\n    use epoll;\n}\n\nhttp {\n    include       /etc/nginx/mime.types;\n    default_type  application/octet-stream;\n    sendfile      on;\n    keepalive_timeout  65;\n\n    upstream backend {\n        server 127.0.0.1:8080;\n        keepalive 32;\n    }\n\n    server {\n        listen 80;\n        server_name example.com;\n\n        location / {\n            proxy_pass http://backend;\n            proxy_set_header Host $host;\n            proxy_set_header X-Real-IP $remote_addr;\n            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n            proxy_set_header X-Forwarded-Proto $scheme;\n        }\n    }\n}',
                                },
                                {
                                    type: 'p',
                                    text: 'Разберём ключевые директивы. `worker_processes auto` — Nginx запустит по одному worker на ядро CPU. `worker_connections 4096` — до 4096 соединений на worker. `keepalive 32` в upstream — держать 32 idle-соединения к backend, чтобы не открывать TCP+TLS каждый раз. Без keepalive каждый запрос — новый handshake, что заметно тормозит.',
                                },
                                {
                                    type: 'note',
                                    text: '`proxy_set_header Host $host` — обязателен. Без него backend получит Host с адресом прокси, и виртуальные хосты бэкенда сломаются. `X-Forwarded-For` — чтобы backend видел реальный IP клиента. `X-Forwarded-Proto` — чтобы знал, был ли исходный запрос http или https.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l2-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'В каком контексте живёт директива worker_connections?',
                                options: [
                                    { id: 'a', text: 'main' },
                                    { id: 'b', text: 'events' },
                                    { id: 'c', text: 'http' },
                                    { id: 'd', text: 'server' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'worker_connections задаёт число соединений на worker и живёт в блоке events. worker_processes — в main, upstream — в http, listen — в server.',
                            },
                        },
                        {
                            id: 'proxy-l2-s4',
                            title: 'Include и организация конфигов',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Держать всё в одном nginx.conf удобно только для примеров. В продакшене конфиг разбивают на файлы: глобальные настройки отдельно, сайты отдельно, upstreams отдельно. Это упрощает git-диффы, code review и откат.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Типичная структура /etc/nginx',
                                    code: '/etc/nginx/\n├── nginx.conf              # main + events + include conf.d\n├── mime.types\n├── conf.d/                 # глобальные куски\n│   ├── gzip.conf\n│   ├── security-headers.conf\n│   └── upstreams.conf\n├── sites-available/        # «выключенные» сайты\n│   └── example.com.conf\n└── sites-enabled/          # symlinks на sites-available\n    └── example.com.conf -> ../sites-available/example.com.conf',
                                },
                                {
                                    type: 'p',
                                    text: 'В `nginx.conf` внутри http-блока: `include /etc/nginx/conf.d/*.conf;` и `include /etc/nginx/sites-enabled/*;`. Так глобальные настройки (gzip, security headers, upstreams) живут в conf.d, а сайты — в sites-enabled. Включается сайт через symlink — легко и обратимо.',
                                },
                                {
                                    type: 'note',
                                    text: 'Правило: `sites-enabled/` — только symlinks, никогда не файлы. Реальные конфиги — в `sites-available/`. Это классический Debian/Ubuntu-паттерн и он удобен для отладки: `ls -la sites-enabled/` сразу показывает, что включено.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l2-s5',
                            title: 'Проверь себя: директивы',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие директивы обязательны в минимальном reverse proxy? (Выберите все подходящие.)',
                                options: [
                                    { id: 'a', text: 'proxy_pass — куда проксировать' },
                                    { id: 'b', text: 'proxy_set_header Host $host — передать оригинальный Host' },
                                    { id: 'c', text: 'root /var/www — для статики' },
                                    { id: 'd', text: 'worker_processes auto — по числу ядер' },
                                ],
                                correct: ['a', 'b', 'd'],
                                explanation:
                                    'proxy_pass и proxy_set_header Host — основа любого reverse proxy. worker_processes auto — базовая оптимизация. root — только если прокси отдаёт статику; для чистого reverse proxy он не нужен.',
                            },
                        },
                    ],
                },
                {
                    id: 'proxy-l3',
                    title: 'location, rewrite, try_files',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l3-s1',
                            title: 'Типы location',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Блок `location` — сердце Nginx-конфига. Именно здесь решается, что делать с конкретным URL: проксировать, отдать файл, вернуть редирект. Тип location определяет, как сопоставляется URL и в каком порядке проверяются конкурирующие блоки.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Типы location',
                                    head: ['Синтаксис', 'Тип', 'Пример', 'Как работает'],
                                    rows: [
                                        ['= /path', 'Точное совпадение', 'location = /health', 'Только ровно /health, приоритет выше всех'],
                                        ['^~ /prefix', 'Prefix с приоритетом', 'location ^~ /static/', 'Префикс, останавливает поиск regex'],
                                        ['/prefix', 'Prefix', 'location /api/', 'Самый длинный префикс, если нет regex'],
                                        ['~ pattern', 'Regex, чувствительный', 'location ~ \\.php$', 'Regex, проверяются по порядку'],
                                        ['~* pattern', 'Regex, без учёта регистра', 'location ~* \\.(jpg|png)$', 'То же, но case-insensitive'],
                                        ['@name', 'Named', 'location @fallback', 'Только для try_files / error_page'],
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Порядок приоритета — источник 90% багов в Nginx. Не «сверху вниз, как в коде», а по строгим правилам. Если не уверены — используйте `= /path` для точных URL и `^~ /prefix` для префиксов, где regex не должен вмешиваться.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l3-s2',
                            title: 'Порядок приоритета',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx выбирает location в строгом порядке. Понимание этого порядка избавляет от «почему мой regex не сработал».',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '1. **Точное совпадение** `= /path` — побеждает всё, если совпало',
                                        '2. **`^~ /prefix`** — самый длинный префикс с `^~`, останавливает поиск regex',
                                        '3. **Regex `~` и `~*`** — по порядку в конфиге, первый совпавший побеждает',
                                        '4. **Обычный префикс `/prefix`** — самый длинный из совпавших',
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Типичный конфликт',
                                    code: 'location / { proxy_pass http://backend; }\nlocation /api/ { proxy_pass http://api; }\nlocation ~ \\.php$ { return 404; }\nlocation ^~ /static/ { root /var/www; }',
                                },
                                {
                                    type: 'p',
                                    text: 'Запрос `/api/users.php` попадёт в regex `\\.php$` — вернёт 404. Запрос `/api/users` попадёт в префикс `/api/` — проксируется в `api`. Запрос `/static/logo.png` попадёт в `^~ /static/` — regex не будет проверяться вовсе. Знание порядка делает конфиг предсказуемым.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l3-s3',
                            title: 'try_files для SPA и статики',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '`try_files` — директива, которая пробует файлы по порядку и на первом найденном останавливается. Идеальна для SPA (React, Vue, Angular): все URL, которых нет в файловой системе, должны вернуть index.html, а маршрутизацией займётся фронтенд.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'SPA: fallback на index.html',
                                    code: 'server {\n    listen 80;\n    root /var/www/app;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    location ~* \\.(js|css|png|jpg|svg|woff2?)$ {\n        expires 1y;\n        add_header Cache-Control "public, immutable";\n        try_files $uri =404;\n    }\n}',
                                },
                                {
                                    type: 'p',
                                    text: 'Логика: сначала пробуем `$uri` (точный файл), потом `$uri/` (директория), потом `index.html`. Статика с хэшами в имени кэшируется на год (`immutable`), потому что при изменении меняется имя файла. Всё остальное отдаётся как index.html — фронтенд-роутер сам разберётся.',
                                },
                                {
                                    type: 'note',
                                    text: '`try_files $uri =404` — важный паттерн для статики. Если файл не найден, вернуть 404, а не fallback на index.html. Иначе браузер может получить HTML вместо отсутствующего .js, и вы потратите час на отладку «почему JS парсится как HTML».',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l3-s4',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Какой location выиграет для запроса /api/users, если есть все четыре варианта?',
                                options: [
                                    { id: 'a', text: 'location / { }' },
                                    { id: 'b', text: 'location /api/ { }' },
                                    { id: 'c', text: 'location ~ ^/api/ { }' },
                                    { id: 'd', text: 'location = /api/users { }' },
                                ],
                                correct: ['d'],
                                explanation:
                                    'Точное совпадение `= /api/users` побеждает все остальные — это высший приоритет в Nginx. Regex и префиксы проверяются только если точного совпадения нет.',
                            },
                        },
                        {
                            id: 'proxy-l3-s5',
                            title: 'Расставьте приоритеты',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Расставьте типы location в порядке приоритета (от высшего к низшему).',
                                items: [
                                    '= /exact',
                                    '^~ /prefix',
                                    '~ regex',
                                    '/prefix',
                                ],
                                correct: [
                                    '= /exact',
                                    '^~ /prefix',
                                    '~ regex',
                                    '/prefix',
                                ],
                                explanation:
                                    'Порядок: точное совпадение → ^~ префикс → regex → обычный префикс. Regex проверяется только если не сработал ^~ и нет точного совпадения.',
                            },
                        },
                    ],
                },
            ],
        },

        // ═════════════════════════════════════════════════════════════════════
        // Модуль 2. TLS и современные протоколы
        // ═════════════════════════════════════════════════════════════════════
        {
            id: 'proxy-m2',
            title: 'TLS и современные протоколы',
            lessons: [
                {
                    id: 'proxy-l4',
                    title: 'TLS-терминация: TLS 1.2, TLS 1.3, HSTS, OCSP',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l4-s1',
                            title: 'Что такое TLS-терминация',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '**TLS-терминация** — это когда HTTPS-соединение расшифровывается на прокси, а до backend запрос идёт по HTTP (внутри доверенной сети) или по новому TLS. Прокси берёт на себя всю тяжёлую работу: TLS-хендшейк, шифрование, ротация сертификатов.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'TLS-терминация: клиент ↔ прокси — TLS, прокси ↔ backend — HTTP',
                                    code: 'sequenceDiagram\n    participant C as Client\n    participant N as Nginx (edge)\n    participant B as Backend\n    C->>N: TLS handshake (HTTPS)\n    N->>N: Decrypt request\n    N->>B: HTTP (plain, internal)\n    B-->>N: HTTP response\n    N-->>C: Encrypted response (HTTPS)',
                                },
                                {
                                    type: 'p',
                                    text: 'Зачем это нужно. Сертификаты Let\'s Encrypt обновляются каждые 60–90 дней. Держать их в каждом из 20 backend-сервисов — это 20 мест, где что-то может сломаться. Один прокси — одно место. Плюс TLS-хендшейк на C-коде Nginx в разы дешевле, чем на Python/Node/PHP.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Плюсы**: одна точка для сертификатов, единая политика TLS, разгрузка backend, единый OCSP stapling',
                                        '**Минусы**: TLS-трафик между прокси и backend нужно защищать отдельно (mTLS или сеть), иначе внутри сети трафик идёт открытым',
                                        '**Kubernetes**: ingress-контроллер делает TLS-терминацию на edge; между сервисами — mTLS через service mesh',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Если backend не доверенный (shared-хостинг, публичная сеть), используйте TLS re-encryption: прокси расшифровывает и **снова шифрует** до backend. Это стандарт для zero-trust архитектур.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l4-s2',
                            title: 'Современный TLS-конфиг (2025)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Минимально допустимый конфиг в 2025 — TLS 1.2 + TLS 1.3 с современными шифрами. TLS 1.0 и 1.1 отключены, слабые шифры (RC4, 3DES, CBC) отключены. Всё это уже дефолт в большинстве дистрибутивов, но явный конфиг — гарантия.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'TLS server-блок с HSTS и OCSP',
                                    code: 'server {\n    listen 443 ssl;\n    listen [::]:443 ssl;\n    http2 on;\n    server_name example.com;\n\n    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_prefer_server_ciphers off;\n    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;\n\n    ssl_session_cache shared:SSL:10m;\n    ssl_session_timeout 1d;\n    ssl_session_tickets off;\n\n    ssl_stapling on;\n    ssl_stapling_verify on;\n    resolver 1.1.1.1 8.8.8.8 valid=300s;\n\n    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n\n    location / {\n        proxy_pass http://backend;\n    }\n}\n\nserver {\n    listen 80;\n    server_name example.com;\n    return 301 https://$host$request_uri;\n}',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`ssl_protocols TLSv1.2 TLSv1.3` — только современные версии',
                                        '`ssl_prefer_server_ciphers off` — клиент выбирает (правильно для TLS 1.3 и AEAD-шифров)',
                                        '`ssl_session_cache shared:SSL:10m` — 10 МБ кэша сессий, ускоряет повторные подключения',
                                        '`ssl_stapling on` — OCSP stapling, отдаём клиенту ответ OCSP без отдельного запроса',
                                        '`Strict-Transport-Security` — HSTS: браузер 2 года ходит только по HTTPS',
                                        '`return 301` с HTTP на HTTPS — единственное, что должно быть на :80',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: '`preload` в HSTS — это заявка в браузерный preload-list. После добавления сайта в список, откатиться **очень** сложно: браузеры будут месяцами требовать HTTPS даже если вы отключили сертификат. Не включайте `preload`, пока не уверены на 100%.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l4-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие директивы обязательны для современного TLS-конфига? (Выберите все подходящие.)',
                                options: [
                                    { id: 'a', text: 'ssl_protocols TLSv1.2 TLSv1.3' },
                                    { id: 'b', text: 'ssl_certificate и ssl_certificate_key' },
                                    { id: 'c', text: 'ssl_protocols SSLv3 TLSv1' },
                                    { id: 'd', text: 'add_header Strict-Transport-Security' },
                                ],
                                correct: ['a', 'b', 'd'],
                                explanation:
                                    'SSLv3 и TLS 1.0/1.1 давно отключены (vulnerable: POODLE, BEAST). TLS 1.2+1.3, сертификаты и HSTS — обязательный минимум для современного сайта.',
                            },
                        },
                        {
                            id: 'proxy-l4-s4',
                            title: 'Let\'s Encrypt и certbot',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Let\'s Encrypt выдаёт бесплатные сертификаты на 90 дней. Certbot — стандартный клиент, который автоматизирует выдачу и продление. Продление — по cron или systemd timer, за 30 дней до истечения.',
                                },
                                {
                                    type: 'code',
                                    lang: 'bash',
                                    caption: 'Выдача и автопродление',
                                    code: '# Первичная выдача (webroot — на :80 должен быть живой nginx)\ncertbot certonly --webroot -w /var/www/html -d example.com -d www.example.com\n\n# Проверить автопродление (dry-run)\ncertbot renew --dry-run\n\n# Продление — в cron (systemd timer обычно уже настроен пакетом)\n# /etc/cron.d/certbot:\n# 0 3 * * * root certbot renew --quiet --deploy-hook "systemctl reload nginx"',
                                },
                                {
                                    type: 'p',
                                    text: '`--deploy-hook` — критично. Без него после успешного продления Nginx продолжит отдавать старый сертификат до ручного reload. С hook — nginx перечитывает конфиг и сразу подхватывает новый сертификат.',
                                },
                                {
                                    type: 'note',
                                    text: 'Мониторинг: ставьте проверку `echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates` в мониторинг. Если сертификат перестал продлеваться (например, webroot сломался) — узнаете за 30 дней, а не когда сайт упадёт.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l4-s5',
                            title: 'Сопоставьте директиву и назначение',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте директиву TLS и её назначение.',
                                pairs: [
                                    { left: 'ssl_protocols', right: 'Разрешённые версии TLS' },
                                    { left: 'ssl_certificate', right: 'Файл сертификата (цепочка)' },
                                    { left: 'ssl_stapling', right: 'OCSP stapling для ускорения проверки' },
                                    { left: 'Strict-Transport-Security', right: 'HSTS: браузер только HTTPS' },
                                ],
                                explanation:
                                    'ssl_protocols — версии. ssl_certificate — сертификат. ssl_stapling — OCSP. HSTS — политика для браузера. Все четыре — базовый набор TLS-конфига.',
                            },
                        },
                    ],
                },
                {
                    id: 'proxy-l5',
                    title: 'HTTP/2 и HTTP/3 (QUIC)',
                    minutes: 18,
                    steps: [
                        {
                            id: 'proxy-l5-s1',
                            title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'За 25 лет HTTP прошёл три большие итерации. Каждая решает проблему предыдущей: HTTP/1.1 — «голова линии» (head-of-line blocking), HTTP/2 — мультиплексирование поверх TCP, HTTP/3 — уход от TCP к QUIC поверх UDP.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Три версии HTTP',
                                    head: ['Характеристика', 'HTTP/1.1', 'HTTP/2', 'HTTP/3 (QUIC)'],
                                    rows: [
                                        ['Транспорт', 'TCP', 'TCP', 'UDP (QUIC)'],
                                        ['Мультиплексирование', 'Нет (один запрос за раз на соединение)', 'Да (streams)', 'Да (streams)'],
                                        ['Head-of-line blocking', 'На уровне HTTP', 'На уровне TCP', 'Устранён (streams независимы)'],
                                        ['Сжатие заголовков', 'Нет', 'HPACK', 'QPACK'],
                                        ['Server Push', 'Нет', 'Есть (устарел, Chrome убрал)', 'Есть, но редко используется'],
                                        ['0-RTT handshake', 'Нет', 'Нет', 'Да, после первого подключения'],
                                        ['Браузеры', 'Все', 'Все', 'Chrome, Firefox, Safari, Edge'],
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'HTTP/2 всё ещё страдает от TCP head-of-line blocking: если один пакет потерян, все streams в соединении ждут его повторной доставки. QUIC решает это на уровне протокола: streams независимы, потеря пакета в одном не блокирует другие.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l5-s2',
                            title: 'HTTP/2 в Nginx',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В современных версиях Nginx (1.25.1+) HTTP/2 включается отдельной директивой `http2 on;`, а не параметром в `listen`. Это связано с поддержкой HTTP/3, где по одному listen может быть несколько протоколов.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'HTTP/2 + HTTP/1.1 на одном порту',
                                    code: 'server {\n    listen 443 ssl;\n    listen [::]:443 ssl;\n    http2 on;\n\n    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    server_name example.com;\n\n    location / {\n        proxy_pass http://backend;\n        proxy_http_version 1.1;\n        proxy_set_header Connection "";\n    }\n}',
                                },
                                {
                                    type: 'p',
                                    text: 'Клиент и сервер согласуют протокол через ALPN в TLS-хендшейке: если клиент поддерживает HTTP/2, будет HTTP/2; иначе HTTP/1.1. `proxy_http_version 1.1` и пустой `Connection` — чтобы Nginx ходил в backend по keepalive, а не открывал новое TCP-соединение каждый раз.',
                                },
                                {
                                    type: 'note',
                                    text: 'Server Push в HTTP/2 признан неудачным и удалён из Chrome в 2022. Не включайте его — вместо него используйте `<link rel="preload">` в HTML. Nginx всё ещё поддерживает `http2_push`, но смысла в этом нет.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l5-s3',
                            title: 'HTTP/3 (QUIC)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'HTTP/3 — это HTTP поверх QUIC (UDP). Основные преимущества: устранён TCP head-of-line blocking, 0-RTT handshake для повторных подключений, встроенное шифрование (TLS 1.3 обязателен). Особенно хорошо работает на мобильных сетях с потерями пакетов.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'HTTP/3 на том же порту 443',
                                    code: 'server {\n    listen 443 ssl;\n    listen 443 quic reuseport;\n    http2 on;\n    http3 on;\n\n    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    add_header Alt-Svc \'h3=":443"; ma=86400\' always;\n    add_header QUIC-Status $http3 always;\n\n    server_name example.com;\n}',
                                },
                                {
                                    type: 'p',
                                    text: '`Alt-Svc` — это заголовок, который говорит браузеру «на этом же хосте по UDP :443 работает HTTP/3, попробуй». После первого HTTP/2-ответа браузер запоминает и следующие запросы идёт по HTTP/3. Если QUIC заблокирован (некоторые корпоративные сети) — браузер откатывается на HTTP/2.',
                                },
                                {
                                    type: 'note',
                                    text: 'HTTP/3 требует UDP :443 в firewall. Если у вас жёсткий файрвол или балансировщик без QUIC (например, AWS NLB до недавнего времени) — HTTP/3 не заработает. Всегда оставляйте HTTP/2 как fallback и мониторьте, какой процент трафика реально идёт по HTTP/3.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l5-s4',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Что решает HTTP/3, чего не может решить HTTP/2?',
                                options: [
                                    { id: 'a', text: 'Сжатие заголовков' },
                                    { id: 'b', text: 'Мультиплексирование запросов' },
                                    { id: 'c', text: 'TCP head-of-line blocking' },
                                    { id: 'd', text: 'Keep-alive соединения' },
                                ],
                                correct: ['c'],
                                explanation:
                                    'HTTP/2 мультиплексирует streams, но они все идут по одному TCP-соединению. Потеря пакета блокирует все streams. HTTP/3 идёт по QUIC (UDP), где streams независимы — потеря пакета в одном не блокирует другие.',
                            },
                        },
                        {
                            id: 'proxy-l5-s5',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'HTTP/2 — мультиплексирование поверх TCP, требует TLS + ALPN.',
                                        'HTTP/3 — QUIC поверх UDP, решает head-of-line blocking и даёт 0-RTT.',
                                        'В Nginx: `http2 on;` и `http3 on;` — отдельные директивы.',
                                        'HTTP/3 требует UDP :443 и заголовок Alt-Svc для обнаружения.',
                                        'Server Push в HTTP/2 мёртв — не включайте.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ═════════════════════════════════════════════════════════════════════
        // Модуль 3. Производительность и защита
        // ═════════════════════════════════════════════════════════════════════
        {
            id: 'proxy-m3',
            title: 'Производительность и защита',
            lessons: [
                {
                    id: 'proxy-l6',
                    title: 'Кэширование ответов',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l6-s1',
                            title: 'Как устроен proxy_cache',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx умеет кэшировать ответы upstream и отдавать их повторно без обращения к backend. Это снимает нагрузку с backend и ускоряет ответ в 10–100 раз. Кэш хранится на диске в отдельной директории, управляется через shared memory zone.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Как proxy_cache обрабатывает запрос',
                                    code: 'graph TD\n    R["Request"] --> K{"Cache key<br/>in cache?"}\n    K -->|"HIT"| H["Return from cache<br/>(backend не трогаем)"]\n    K -->|"MISS"| B["Forward to backend"]\n    K -->|"EXPIRED"| B\n    B --> S["Store in cache<br/>(TTL)"]\n    S --> H2["Return response"]',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Базовый proxy_cache',
                                    code: 'http {\n    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;\n\n    server {\n        listen 80;\n        server_name example.com;\n\n        location /api/ {\n            proxy_cache api_cache;\n            proxy_cache_valid 200 5m;\n            proxy_cache_valid 404 1m;\n            proxy_cache_key "$scheme://$host$request_uri";\n            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;\n            proxy_cache_lock on;\n\n            add_header X-Cache-Status $upstream_cache_status;\n\n            proxy_pass http://backend;\n        }\n    }\n}',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`proxy_cache_path` — где хранить, размер, TTL неактивных (`inactive`)',
                                        '`keys_zone=api_cache:10m` — 10 МБ на метаданные (~80k ключей)',
                                        '`levels=1:2` — двухуровневая директория, чтобы не было миллионов файлов в одной папке',
                                        '`use_temp_path=off` — писать сразу в кэш, без временного файла',
                                        '`proxy_cache_use_stale` — отдавать старый кэш, если backend лежит',
                                        '`proxy_cache_lock on` — при cache miss только один запрос идёт в backend, остальные ждут',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: '`X-Cache-Status` — обязательный заголовок для отладки. Значения: MISS, HIT, EXPIRED, STALE, UPDATING, REVALIDATED, BYPASS. Без него вы не узнаете, работает ли кэш. С ним — видите в DevTools, что реально происходит.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l6-s2',
                            title: 'Cache key и Vary',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Cache key — это «отпечаток» запроса: два запроса с одинаковым ключом получат один закэшированный ответ. По умолчанию Nginx использует `$scheme$proxy_host$request_uri`. Если backend отдаёт разный контент в зависимости от cookie, языка или Accept-Encoding — ключ нужно расширить.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Кэш с учётом языка и авторизации',
                                    code: 'proxy_cache_key "$scheme://$host$request_uri|$http_accept_language|$cookie_session";\n\n# Не кэшировать запросы с авторизацией\nproxy_cache_bypass $http_authorization;\nproxy_no_cache $http_authorization;\n\n# Учесть Vary от backend\nproxy_ignore_headers Cache-Control Expires Set-Cookie;\nproxy_hide_header Set-Cookie;',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`proxy_cache_key` — расширьте, если ответ зависит от Cookie, языка или заголовков',
                                        '`proxy_cache_bypass` — не читать кэш (запрос всегда идёт в backend)',
                                        '`proxy_no_cache` — не писать в кэш (но чтение остаётся)',
                                        '`proxy_ignore_headers Set-Cookie` — игнорировать Set-Cookie от backend (иначе кэш не работает)',
                                        '`proxy_hide_header Set-Cookie` — скрыть заголовок от клиента (кэшированный Set-Cookie — плохо)',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Главная ловушка: backend ставит `Set-Cookie` на каждый ответ. Nginx по умолчанию не кэширует ответы с Set-Cookie. Если вы уверены, что cookie можно кэшировать (например, статичный session ID) — используйте `proxy_ignore_headers Set-Cookie` и `proxy_hide_header Set-Cookie`. Но лучше — не кэшировать авторизованные ответы вообще.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l6-s3',
                            title: 'Инвалидация кэша',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Кэш устаревает: контент изменился, а кэш отдаёт старое. Три стратегии: TTL (просто и грубо), purge (точечно), версионирование URL (правильно, но требует изменений в приложении).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'TTL и purge',
                                    code: '# TTL по кодам ответа\nproxy_cache_valid 200 5m;\nproxy_cache_valid 301 1h;\nproxy_cache_valid 404 1m;\n\n# Purge (нужен модуль ngx_cache_purge, обычно собран в nginx-extras)\nlocation ~ /purge(/.*) {\n    allow 127.0.0.1;\n    deny all;\n    proxy_cache_purge api_cache "$scheme://$host$1";\n}',
                                },
                                {
                                    type: 'p',
                                    text: 'Версионирование URL — самый надёжный подход. Вместо `example.com/app.js` — `example.com/app.abc123.js`, где `abc123` — хэш содержимого. Кэш на год (`immutable`), инвалидация — через смену URL. Это стандарт для фронтенда и для API: `GET /users/42?v=5`.',
                                },
                                {
                                    type: 'note',
                                    text: 'Purge — точечная инвалидация, но требует модуля и часто становится вектором атаки (не оставьте /purge открытым). Версионирование URL + длинный TTL — безопаснее и проще. Используйте purge только когда нельзя менять URL.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l6-s4',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Что делает proxy_cache_lock on?',
                                options: [
                                    { id: 'a', text: 'Блокирует доступ к кэшу из админки' },
                                    { id: 'b', text: 'При cache miss только один запрос идёт в backend, остальные ждут результата' },
                                    { id: 'c', text: 'Блокирует запись в кэш на время обновления' },
                                    { id: 'd', text: 'Защищает от cache poisoning' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Без proxy_cache_lock при cache miss 100 одновременных запросов пойдут в backend — это thundering herd. С lock — первый запрос идёт в backend, остальные ждут его ответа и получают закэшированный результат.',
                            },
                        },
                        {
                            id: 'proxy-l6-s5',
                            title: 'Расставьте порядок обработки запроса с кэшем',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Расставьте шаги обработки запроса с proxy_cache в правильном порядке.',
                                items: [
                                    'Проверить, есть ли ответ в кэше по ключу',
                                    'При HIT — отдать из кэша, backend не трогать',
                                    'При MISS — пойти в backend',
                                    'Сохранить ответ backend в кэш',
                                    'Отдать ответ клиенту',
                                ],
                                correct: [
                                    'Проверить, есть ли ответ в кэше по ключу',
                                    'При HIT — отдать из кэша, backend не трогать',
                                    'При MISS — пойти в backend',
                                    'Сохранить ответ backend в кэш',
                                    'Отдать ответ клиенту',
                                ],
                                explanation:
                                    'Сначала lookup по cache key. HIT — сразу отдать. MISS — запрос в backend, запись в кэш, отдача клиенту. При proxy_cache_lock на MISS остальные запросы ждут, а не идут в backend параллельно.',
                            },
                        },
                    ],
                },
                {
                    id: 'proxy-l7',
                    title: 'Сжатие: gzip, brotli, zstd',
                    minutes: 15,
                    steps: [
                        {
                            id: 'proxy-l7-s1',
                            title: 'Сравнение алгоритмов',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Сжатие экономит трафик и ускоряет загрузку. Но выбор алгоритма — компромисс между степенью сжатия, скоростью CPU и поддержкой браузеров. В 2025 три реальных кандидата: gzip, brotli, zstd.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Сравнение',
                                    head: ['Алгоритм', 'Сжатие', 'Скорость', 'Поддержка браузеров'],
                                    rows: [
                                        ['gzip', 'Среднее (×3–4 на HTML)', 'Быстрый', 'Все, 100%'],
                                        ['brotli', 'Лучшее (×4–5 на HTML)', 'Медленнее gzip', 'Все современные, ~97%'],
                                        ['zstd', 'Сопоставимо с brotli', 'Быстрее brotli', 'Ограниченная (Chrome 123+)'],
                                    ],
                                },
                                {
                                    type: 'p',
                                    text: 'Практический вывод: **brotli для статики** (сжатие заранее, на этапе сборки — нулевая нагрузка на CPU в рантайме), **gzip для динамики** (быстро, поддержка 100%). zstd пока нишевый, но в 2025 браузеры уже поддерживают — если хотите быть на переднем крае, включайте его третьим.',
                                },
                                {
                                    type: 'note',
                                    text: 'Сжимайте только текстовые типы: HTML, CSS, JS, JSON, SVG, XML. Не сжимайте JPEG, PNG, WebP, MP4, ZIP — они уже сжаты, повторное сжатие **увеличивает** размер и жжёт CPU впустую.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l7-s2',
                            title: 'Настройка gzip и brotli',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'gzip + brotli',
                                    code: 'http {\n    # gzip — динамическое сжатие\n    gzip on;\n    gzip_vary on;\n    gzip_comp_level 6;\n    gzip_min_length 256;\n    gzip_proxied any;\n    gzip_types\n        text/plain\n        text/css\n        text/xml\n        text/javascript\n        application/javascript\n        application/json\n        application/xml\n        application/rss+xml\n        image/svg+xml;\n\n    # brotli — если модуль установлен (nginx-module-brotli, nginx-extras)\n    brotli on;\n    brotli_comp_level 6;\n    brotli_static on;   # отдавать заранее собранные .br файлы\n    brotli_types text/plain text/css application/javascript application/json image/svg+xml;\n}',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`gzip_comp_level 6` — баланс: 1 быстрый, 9 максимальный, но 5–6 — разумный выбор',
                                        '`gzip_min_length 256` — не сжимать мелкие ответы (сжатие 50 байт даёт оверхед)',
                                        '`gzip_vary on` — добавить `Vary: Accept-Encoding` (обязательно для CDN)',
                                        '`brotli_static on` — если есть файлы `.br` рядом с `.js`, отдать сразу их, без сжатия в рантайме',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Brotli в Nginx — не модуль из коробки. Нужен `nginx-module-brotli` (Debian/Ubuntu) или собранный вручную. Проверка: `nginx -V 2>&1 | grep -o with-http_brotli_static`. Если пусто — brotli недоступен, оставьте только gzip.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l7-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Стоит ли сжимать JPEG-изображения через gzip?',
                                options: [
                                    { id: 'a', text: 'Да, это сэкономит 30–40% трафика' },
                                    { id: 'b', text: 'Нет, JPEG уже сжат — повторное сжатие увеличит размер и потратит CPU' },
                                    { id: 'c', text: 'Да, но только при gzip_comp_level 9' },
                                    { id: 'd', text: 'Зависит от размера файла' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'JPEG, PNG, WebP, MP4, ZIP — уже сжатые форматы. Повторное gzip-сжатие ничего не уменьшит, а иногда и увеличит размер. Сжимайте только текстовые типы (HTML, CSS, JS, JSON, SVG).',
                            },
                        },
                        {
                            id: 'proxy-l7-s4',
                            title: 'Когда сжатие вредит',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Сжатие — не всегда хорошо. Три типичных случая, когда оно вредит: маленькие ответы, уже сжатые форматы, и высокий comp_level на динамике при высокой нагрузке.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Маленькие ответы** (< 256 байт) — overhead заголовков и CPU больше выигрыша',
                                        '**Уже сжатые форматы** (JPEG, PNG, WebP, MP4, ZIP) — сжатие увеличивает размер',
                                        '**Высокий comp_level на динамике** — CPU-bound при пиковой нагрузке',
                                        '**HTTPS + сжатие** — риск BREACH-атаки, если в ответе есть секреты (CSRF-токен)',
                                    ],
                                },
                                {
                                    type: 'p',
                                    text: 'BREACH — атака, при которой злоумышленник угадывает секрет (например, CSRF-токен) по размеру сжатого ответа. Защита: не сжимать ответы с секретами, использовать `gzip_disable` для запросов с куками, или разделять статику и API на разные location.',
                                },
                                {
                                    type: 'note',
                                    text: 'Правило: статику сжимайте заранее (на этапе сборки — brotli/gzip pre-compression), динамику — gzip comp_level 6. Не сжимайте API-ответы с Set-Cookie или CSRF-токенами. Мониторьте CPU: если Nginx упирается в CPU — снизьте comp_level.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l7-s5',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'brotli для статики (сжатие заранее), gzip для динамики.',
                                        'Сжимайте только текстовые типы. Не сжимайте JPEG/PNG/MP4/ZIP.',
                                        'gzip_comp_level 6 — баланс CPU и размера.',
                                        'gzip_vary on — обязательно для корректной работы CDN.',
                                        'BREACH-защита: не сжимайте ответы с секретами.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'proxy-l8',
                    title: 'Rate limiting и защита от нагрузки',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l8-s1',
                            title: 'limit_req: ограничение скорости запросов',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '`limit_req` ограничивает **скорость** запросов: N запросов в секунду на ключ (IP, пользователь, токен). Работает по алгоритму leaky bucket: запросы «просачиваются» с заданной скоростью, избыточные либо ставятся в очередь (burst), либо отбрасываются (503).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Rate limit по IP',
                                    code: 'http {\n    # Зона на 10 МБ (~160 000 IP)\n    limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;\n\n    server {\n        listen 80;\n        server_name api.example.com;\n\n        location /api/ {\n            limit_req zone=perip burst=20 nodelay;\n            limit_req_status 429;\n            proxy_pass http://backend;\n        }\n    }\n}',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`rate=10r/s` — 10 запросов в секунду на IP',
                                        '`burst=20` — до 20 «лишних» запросов буферизируются',
                                        '`nodelay` — burst-запросы обслуживаются сразу, а не с задержкой',
                                        '`limit_req_status 429` — отдавать 429 (Too Many Requests), а не дефолтный 503',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Без `nodelay` burst-запросы **задерживаются** (throttling), а не отбрасываются: клиент получает ответ медленнее, но не 429. Это правильно для API, которые не хотят резких обрывов. С `nodelay` — резче, но пики не тормозят. Выбор зависит от UX.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l8-s2',
                            title: 'limit_conn: ограничение соединений',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '`limit_req` ограничивает **скорость** запросов, а `limit_conn` — **количество одновременных соединений**. Это разные оси. Rate limit защищает от брутфорса и флуда запросами. Connection limit — от «медленных» клиентов, которые держат открытые соединения и не отдают данные (slow loris).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'limit_conn + таймауты',
                                    code: 'http {\n    limit_conn_zone $binary_remote_addr zone=conn_perip:10m;\n\n    server {\n        listen 80;\n\n        location /download/ {\n            limit_conn conn_perip 10;\n            limit_conn_status 429;\n\n            client_body_timeout 10s;\n            client_header_timeout 10s;\n            send_timeout 10s;\n\n            proxy_pass http://files_backend;\n        }\n    }\n}',
                                },
                                {
                                    type: 'p',
                                    text: 'Таймауты критичны. Дефолтный `client_header_timeout` в Nginx — 60 секунд. Slow loris-атака: открыть 10 000 соединений и отправлять по байту в минуту. Nginx держит 10 000 worker-слотов занятыми. Решение: `client_header_timeout 10s`, `client_body_timeout 10s`, `send_timeout 10s` — все медленные клиенты отваливаются за 10 секунд.',
                                },
                                {
                                    type: 'note',
                                    text: 'Правило: rate limit для скорости запросов, connection limit для одновременных соединений. Оба нужны. Плюс таймауты 10s — базовая защита от slow loris и медленных клиентов.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l8-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Чем limit_req отличается от limit_conn?',
                                options: [
                                    { id: 'a', text: 'limit_req медленнее, limit_conn быстрее' },
                                    { id: 'b', text: 'limit_req ограничивает скорость запросов, limit_conn — количество одновременных соединений' },
                                    { id: 'c', text: 'Это одно и то же, разные названия' },
                                    { id: 'd', text: 'limit_conn работает только с HTTPS' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Это разные оси. limit_req — про частоту запросов (rate), защищает от брутфорса и флуда. limit_conn — про одновременные соединения, защищает от slow loris и удержания ресурсов.',
                            },
                        },
                        {
                            id: 'proxy-l8-s4',
                            title: 'Практика: защита логина от брутфорса',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Типичный сценарий — страница логина. Бот пробует 10 000 паролей в минуту. Rate limit здесь должен быть **жёстче**, чем на обычных API: 5 попыток в минуту на IP + отдельно на username (чтобы не сломать офис за NAT).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Многоуровневая защита',
                                    code: 'http {\n    limit_req_zone $binary_remote_addr zone=login_ip:10m rate=5r/m;\n    limit_req_zone $http_x_forwarded_for zone=login_xff:10m rate=20r/m;\n\n    server {\n        location = /api/login {\n            # 5 попыток в минуту на IP\n            limit_req zone=login_ip burst=3 nodelay;\n            # 20 в минуту на X-Forwarded-For (учитывая CDN)\n            limit_req zone=login_xff burst=5 nodelay;\n            limit_req_status 429;\n\n            # Медленные клиенты — не более 10 секунд\n            client_body_timeout 10s;\n\n            proxy_pass http://auth_backend;\n        }\n    }\n}',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        'Rate 5r/m на IP — 5 попыток в минуту, брутфорс становится неэффективным',
                                        'burst=3 — разрешить небольшой всплеск (человек ошибся 2–3 раза)',
                                        'Отдельная зона по X-Forwarded-For — учитывать CDN (за прокси все IP одинаковые)',
                                        'Таймаут body — медленные попытки отваливаются',
                                        'Мониторинг: алерт на 429 с /api/login — попытка брутфорса',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Rate limit — первая линия, но не единственная. Дополнительно: CAPTCHA после N неудач, account lockout на бэкенде, мониторинг 429, 2FA. Rate limit защищает от простого брутфорса, но не от распределённой атаки с ботнета — там нужна CAPTCHA или WAF с поведенческим анализом.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l8-s5',
                            title: 'Сопоставьте директиву и защиту',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте директиву и от чего она защищает.',
                                pairs: [
                                    { left: 'limit_req', right: 'Слишком частые запросы (брутфорс, флуд)' },
                                    { left: 'limit_conn', right: 'Слишком много одновременных соединений' },
                                    { left: 'client_header_timeout', right: 'Slow loris и медленные клиенты' },
                                    { left: 'client_max_body_size', right: 'Слишком большие тела запросов' },
                                ],
                                explanation:
                                    'limit_req — скорость. limit_conn — соединения. Таймауты — медленные клиенты. client_max_body_size — размер body (защита от переполнения диска или памяти). Все четыре — базовый набор защиты Nginx.',
                            },
                        },
                    ],
                },
                {
                    id: 'proxy-l13',
                    title: 'WAF и ModSecurity: защита от OWASP Top 10',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l13-s1',
                            title: 'Что такое WAF и зачем он нужен',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '**WAF** (Web Application Firewall) — это фильтр HTTP-трафика на уровне приложения. Он смотрит не на IP и порты (как сетевой firewall), а на **содержимое запросов**: SQL в параметрах, XSS-скрипты в формах, path traversal в URL, подозрительные User-Agent. Задача WAF — заблокировать атаку до того, как она дойдёт до backend.',
                                },
                                {
                                    type: 'p',
                                    text: 'Зачем это нужно, если backend сам умеет валидировать вход? Потому что валидация — это **распределённая ответственность**: 20 микросервисов, каждый со своими правилами, и где-то обязательно забудут экранировать кавычку. WAF — единая точка проверки: одно правило защищает все сервисы сразу. Плюс WAF ловит атаки, которые вообще не должны доходить до кода: сканеры уязвимостей, эксплойты известных CVE, автоматические боты.',
                                },
                                {
                                    type: 'p',
                                    text: '**OWASP Top 10** — список самых критичных рисков веб-приложений. WAF с правилами OWASP Core Rule Set (CRS) закрывает большую их часть: SQL Injection, XSS, Path Traversal, Remote Code Execution, Local File Inclusion. Это не «серебряная пуля» — CRS не заменит исправление кода, но как дополнительный слой защиты работает.',
                                },
                                {
                                    type: 'note',
                                    text: 'WAF — это **не** замена валидации в коде, а дополнительный слой. Классическая метафора: кодовые проверки — это замок на двери, WAF — охранник на входе. Если замок сломан, охранник может не успеть. Но без охранника дверь совсем беззащитна от автоматических атак.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l13-s2',
                            title: 'ModSecurity: как это работает',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '**ModSecurity** — самый популярный open-source WAF-движок. Изначально модуль Apache, теперь работает и с Nginx (через `libmodsecurity`). Правила пишутся на собственном языке SecLang: проверка переменной (например, `ARGS:username`), регулярное выражение, действие (deny, allow, log).',
                                },
                                {
                                    type: 'p',
                                    text: 'Модуль работает в **фазах** обработки запроса. Фаза 1 — заголовки запроса, фаза 2 — тело запроса, фаза 3 — заголовки ответа, фаза 4 — тело ответа, фаза 5 — логирование. Правила привязываются к фазам: например, проверка тела POST — в фазе 2, проверка ответа на утечку данных — в фазе 4.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Базовая конфигурация ModSecurity в Nginx',
                                    code: 'server {\n    listen 443 ssl;\n    server_name example.com;\n\n    modsecurity on;\n    modsecurity_rules_file /etc/nginx/modsec/main.conf;\n\n    location / {\n        proxy_pass http://backend;\n    }\n}\n\n# /etc/nginx/modsec/main.conf\n# Include the ModSecurity configuration\nInclude /etc/nginx/modsec/modsecurity.conf\n\n# Include the OWASP Core Rule Set\nInclude /etc/nginx/modsec/coreruleset/crs-setup.conf\nInclude /etc/nginx/modsec/coreruleset/rules/*.conf',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`modsecurity on` — включить модуль в server/location',
                                        '`modsecurity_rules_file` — путь к конфигу',
                                        '`SecRuleEngine On` в `modsecurity.conf` — режим блокировки',
                                        '`SecRuleEngine DetectionOnly` — только логировать, не блокировать (для отладки)',
                                        'OWASP CRS — набор из 200+ правил, покрывает OWASP Top 10',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Начинайте с `DetectionOnly`. CRS агрессивен и на реальном трафике часто даёт false positives. Первые 1–2 недели — только логи, без блокировок. Потом смотрите логи и точечно отключаете правила, которые ломают ваши легитимные запросы.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l13-s3',
                            title: 'DetectionOnly vs On',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'С какого режима ModSecurity безопасно начинать в продакшене?',
                                options: [
                                    { id: 'a', text: 'Сразу On — защиты много не бывает' },
                                    { id: 'b', text: 'DetectionOnly — только логировать, чтобы собрать ложные срабатывания' },
                                    { id: 'c', text: 'Off — чтобы не тормозило' },
                                    { id: 'd', text: 'DetectionOnly на 5 минут, потом сразу On' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'CRS на реальном трафике почти всегда даёт false positives — например, на легитимных SQL-запросах в админке или на поле «комментарий», где есть что-то похожее на атаку. Сразу On = сломанные бизнес-процессы. DetectionOnly позволяет собрать реальные срабатывания за 1–2 недели и потом точечно отключить лишние правила.',
                            },
                        },
                        {
                            id: 'proxy-l13-s4',
                            title: 'False positives и тюнинг CRS',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Главная боль ModSecurity — **ложные срабатывания**. CRS использует **anomaly scoring**: каждое правило даёт запросу «очки», если сумма превышает порог — запрос блокируется. Одно правило редко блокирует — обычно это комбинация нескольких подозрительных признаков. Поэтому «отключить правило X» часто правильнее, чем «отключить всю проверку».',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Полезные настройки для тюнинга',
                                    code: '# /etc/nginx/modsec/modsecurity.conf\n\nSecRuleEngine DetectionOnly\n\n# Порог аномалии (по умолчанию 5 для запроса, 4 для ответа)\nSecAction "id:900110,phase:1,pass,t:none,nolog,setvar:tx.inbound_anomaly_score_threshold=5"\n\n# Отключить конкретное правило для конкретного URL\nSecRule REQUEST_URI "@beginsWith /api/admin" \\\n    "id:1001,phase:1,pass,nolog,ctl:ruleRemoveById=942100"\n\n# Белый список IP (внутренние сервисы, мониторинг)\nSecRule REMOTE_ADDR "@ipMatch 10.0.0.0/8,192.168.0.0/16" \\\n    "id:1002,phase:1,pass,nolog,ctl:ruleEngine=Off"',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`ctl:ruleRemoveById=NNNN` — отключить одно правило для конкретного URL',
                                        '`ctl:ruleEngine=Off` — полностью отключить WAF для whitelisted IP',
                                        '`inbound_anomaly_score_threshold` — порог блокировки (осторожно: снижение = больше false positives)',
                                        '`SecAuditLog` — включить аудит-лог: там видно, какие правила сработали',
                                        '`SecDebugLog` — временно, для отладки конкретного запроса',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Не отключайте CRS полностью «потому что мешает». Правильный путь: DetectionOnly → собираем срабатывания → смотрим аудит-лог → точечно отключаем проблемные правила для конкретных URL/IP. Каждое отключение — задокументировано и обосновано.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l13-s5',
                            title: 'Сопоставьте режим и когда его использовать',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте режим/настройку и типичный сценарий использования.',
                                pairs: [
                                    { left: 'SecRuleEngine DetectionOnly', right: 'Первые 1–2 недели в проде, сбор ложных срабатываний' },
                                    { left: 'SecRuleEngine On', right: 'После тюнинга, боевой режим блокировки' },
                                    { left: 'ctl:ruleRemoveById', right: 'Точечно отключить одно правило для конкретного URL' },
                                    { left: 'ctl:ruleEngine=Off', right: 'Полностью whitelisted IP (внутренние сервисы)' },
                                ],
                                explanation:
                                    'DetectionOnly → сбор данных. On → боевой режим. ruleRemoveById → точечное отключение. ruleEngine=Off → whitelist IP. Классический путь: DetectionOnly на 1–2 недели, тюнинг, потом On.',
                            },
                        },
                        {
                            id: 'proxy-l13-s6',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'WAF — дополнительный слой, не замена валидации в коде.',
                                        'ModSecurity + OWASP CRS — стандартный набор.',
                                        'Начинайте с DetectionOnly, потом On.',
                                        'Аудит-лог — ваш главный инструмент тюнинга.',
                                        'Точечно отключайте правила, не выключайте CRS целиком.',
                                        'Whitelist внутренних IP — обязательная практика.',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'WAF не защищает от бизнес-логических атак (например, IDOR — когда подставляют чужой order_id). Это не его задача. WAF ловит инъекции, XSS, сканеры. От логических дыр — только ревью кода и тесты.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ═════════════════════════════════════════════════════════════════════
        // Модуль 4. Балансировка и Envoy
        // ═════════════════════════════════════════════════════════════════════
        {
            id: 'proxy-m4',
            title: 'Балансировка и Envoy',
            lessons: [
                {
                    id: 'proxy-l9',
                    title: 'Балансировка в Nginx',
                    minutes: 20,
                    steps: [
                        {
                            id: 'proxy-l9-s1',
                            title: 'upstream и методы балансировки',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '`upstream` — блок, описывающий пул backend-серверов. Nginx распределяет запросы между ними по выбранному алгоритму. По умолчанию — round-robin (по кругу).',
                                },
                                {
                                    type: 'table',
                                    caption: 'Методы балансировки',
                                    head: ['Метод', 'Алгоритм', 'Когда'],
                                    rows: [
                                        ['round-robin', 'По кругу, с учётом weight', 'Одинаковые backend, stateless API'],
                                        ['least_conn', 'Туда, где меньше соединений', 'Разная длительность запросов'],
                                        ['ip_hash', 'По хэшу IP клиента', 'Sticky sessions без cookie'],
                                        ['hash $key', 'По произвольному ключу', 'Консистентность по пользователю'],
                                        ['random two', 'Два случайных, потом лучший из двух', 'Большие пулы, power-of-two-choices'],
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'upstream с разными методами',
                                    code: 'upstream api_backend {\n    least_conn;\n    server 10.0.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;\n    server 10.0.1.11:8080 weight=1;\n    server 10.0.1.12:8080 backup;\n    keepalive 32;\n}',
                                },
                                {
                                    type: 'note',
                                    text: '`weight=3` — сервер получит в 3 раза больше запросов (если железо в 3 раза мощнее). `backup` — включается, только если основные упали. `keepalive 32` — держать 32 idle-соединения к каждому backend, чтобы не открывать TCP каждый раз.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l9-s2',
                            title: 'Health checks',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx OSS умеет **пассивные** health checks: если backend вернул ошибку N раз подряд — Nginx временно перестаёт в него ходить (`max_fails`, `fail_timeout`). **Активные** health checks (регулярный GET /health) — только в Nginx Plus (коммерческий).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Пассивный health check',
                                    code: 'upstream api_backend {\n    server 10.0.1.10:8080 max_fails=3 fail_timeout=30s;\n    server 10.0.1.11:8080 max_fails=3 fail_timeout=30s;\n}\n\nserver {\n    location /api/ {\n        proxy_pass http://api_backend;\n        proxy_next_upstream error timeout http_502 http_503 http_504;\n        proxy_next_upstream_tries 2;\n        proxy_next_upstream_timeout 5s;\n    }\n}',
                                },
                                {
                                    type: 'p',
                                    text: '`max_fails=3 fail_timeout=30s` — если 3 раза подряд ошибка, 30 секунд не ходить. `proxy_next_upstream` — при ошибке попробовать другой сервер в upstream. `proxy_next_upstream_tries 2` — не более 2 попыток (защита от бесконечного retry по всем серверам).',
                                },
                                {
                                    type: 'note',
                                    text: 'Активные health checks — только в Nginx Plus. В OSS используйте `proxy_next_upstream` + мониторинг: если backend стабильно падает, passive check быстро его выведет из пула. Для активных проверок — Envoy (там они из коробки) или HAProxy.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l9-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте метод балансировки и типичный сценарий.',
                                pairs: [
                                    { left: 'round-robin', right: 'Одинаковые stateless backend' },
                                    { left: 'least_conn', right: 'Разная длительность запросов' },
                                    { left: 'ip_hash', right: 'Sticky sessions без cookie' },
                                    { left: 'random two', right: 'Большой пул, power-of-two-choices' },
                                ],
                                explanation:
                                    'round-robin — простой цикл, для одинаковых. least_conn — для разной нагрузки. ip_hash — sticky по IP. random two — для больших пулов: из двух случайных выбрать менее загруженный.',
                            },
                        },
                        {
                            id: 'proxy-l9-s4',
                            title: 'Сессии: sticky и stateless',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Если backend хранит сессию в памяти — пользователь должен всегда попадать на тот же сервер. Это «sticky sessions». Проблема: сервер упал — пользователь потерял сессию. Альтернатива: **stateless backend** с сессией в Redis или JWT — тогда любой сервер подходит и балансировка свободная.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Sticky (ip_hash или cookie)**: сессия в памяти сервера, лояльность пользователя к серверу',
                                        '**Stateless (Redis/JWT)**: любая нода, более надёжно, но +1 hop к Redis',
                                        '**Sticky через cookie** (`sticky cookie`) — Nginx Plus, в OSS вручную через hash $cookie_session',
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Sticky через cookie без Nginx Plus',
                                    code: 'upstream backend {\n    hash $cookie_sessionid consistent;\n    server 10.0.1.10:8080;\n    server 10.0.1.11:8080;\n}',
                                },
                                {
                                    type: 'p',
                                    text: '`hash $cookie_sessionid consistent` — стабильный хэш от cookie. `consistent` — при добавлении/удалении сервера перераспределяется минимум ключей (consistent hashing), а не всё сразу.',
                                },
                                {
                                    type: 'note',
                                    text: 'Sticky-сессии — компромисс. Идеально — stateless backend. Но если приложение legacy и сессии в памяти, `hash $cookie` работает надёжнее `ip_hash`: не зависит от мобильных сетей, где IP меняется между запросами.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l9-s5',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Почему ip_hash может быть плохим выбором для мобильных пользователей?',
                                options: [
                                    { id: 'a', text: 'ip_hash медленнее других методов' },
                                    { id: 'b', text: 'Мобильные IP меняются между запросами — пользователь попадает на разные backend и теряет сессию' },
                                    { id: 'c', text: 'ip_hash не работает с IPv6' },
                                    { id: 'd', text: 'ip_hash требует Nginx Plus' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Мобильные сети (4G/5G) часто меняют публичный IP — при переключении между вышками, Wi-Fi ↔ мобильный интернет. Пользователь попадает на разные backend, сессия теряется. Cookie-based sticky надёжнее.',
                            },
                        },
                    ],
                },
                {
                    id: 'proxy-l10',
                    title: 'Envoy: архитектура и xDS',
                    minutes: 22,
                    steps: [
                        {
                            id: 'proxy-l10-s1',
                            title: 'Зачем Envoy, если есть Nginx',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx — статический конфиг. Изменение = правка файла + `nginx -s reload`. Для одного edge-сервера это нормально. Для 500 микросервисов, где pods постоянно создаются и умирают — не масштабируется. Envoy создан Lyft в 2016 именно для этой задачи.',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Динамическая конфигурация** через xDS API — без restart',
                                        '**Первоклассная поддержка HTTP/2 и gRPC** (не просто как downstream, а нативно)',
                                        '**Продвинутые фильтры**: JWT, ext_authz, RBAC, rate limit, fault injection',
                                        '**Наблюдаемость**: детальные метрики Prometheus из коробки, distributed tracing',
                                        '**Service mesh**: Envoy — data plane в Istio, Linkerd (частично), Consul Connect',
                                    ],
                                },
                                {
                                    type: 'p',
                                    text: 'Envoy не заменяет Nginx везде. Если у вас один сервер с ручным конфигом — Nginx проще. Если сотни сервисов, Kubernetes, mesh — Envoy создан для этого. В 2025 оба живут рядом: Nginx на edge (TLS, статика, WAF), Envoy внутри (mesh, east-west трафик).',
                                },
                                {
                                    type: 'note',
                                    text: 'Envoy — CNCF graduated (2023). Крупные пользователи: Lyft, Airbnb, Google (через Istio), Microsoft, AWS (App Mesh). Если вы работаете с Kubernetes и service mesh — Envoy неизбежен.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l10-s2',
                            title: 'Три уровня: listener, filter, cluster',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Конфиг Envoy — это три вложенных уровня. **Listener** слушает порт. **Filter chain** обрабатывает входящий трафик (TLS, HTTP-фильтры). **Cluster** — это пул upstream-серверов, куда уходит запрос. Между filter и cluster — router, который решает, в какой cluster направить.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Envoy: listener → filter chain → cluster → endpoints',
                                    code: 'graph LR\n    L["Listener<br/>:8080"] --> FC["Filter Chain<br/>(HTTP Connection Manager)"]\n    FC --> R["Router"]\n    R -->|"route /api"| C1["Cluster: api"]\n    R -->|"route /web"| C2["Cluster: web"]\n    C1 --> E1["Endpoint 1"]\n    C1 --> E2["Endpoint 2"]\n    C2 --> E3["Endpoint 3"]',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Минимальный envoy.yaml',
                                    code: 'static_resources:\n  listeners:\n    - name: main\n      address:\n        socket_address:\n          address: 0.0.0.0\n          port_value: 8080\n      filter_chains:\n        - filters:\n            - name: envoy.filters.network.http_connection_manager\n              typed_config:\n                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager\n                stat_prefix: ingress_http\n                route_config:\n                  name: local_route\n                  virtual_hosts:\n                    - name: backend\n                      domains: ["*"]\n                      routes:\n                        - match: { prefix: "/" }\n                          route: { cluster: backend_cluster }\n                http_filters:\n                  - name: envoy.filters.http.router\n                    typed_config:\n                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router\n\n  clusters:\n    - name: backend_cluster\n      connect_timeout: 1s\n      type: STRICT_DNS\n      lb_policy: ROUND_ROBIN\n      load_assignment:\n        cluster_name: backend_cluster\n        endpoints:\n          - lb_endpoints:\n              - endpoint:\n                  address:\n                    socket_address:\n                      address: backend\n                      port_value: 8080',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**listener** — порт :8080, filter_chains',
                                        '**http_connection_manager** — HTTP-фильтр верхнего уровня',
                                        '**virtual_hosts + routes** — маршрутизация: `/` → cluster `backend_cluster`',
                                        '**envoy.filters.http.router** — обязательный финальный фильтр',
                                        '**cluster** — пул upstream с `lb_policy: ROUND_ROBIN`',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: '`@type: type.googleapis.com/...` — обязательный синтаксис для typed_config. Это Any-поле из protobuf: имя типа + его содержимое. Без `@type` Envoy не сможет распарсить конфиг.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l10-s3',
                            title: 'xDS: динамическая конфигурация',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Главная сила Envoy — xDS API. Вместо статического YAML, Envoy может получать конфигурацию от **control plane** по gRPC или REST. Control plane знает о всех сервисах и рассылает обновления. Pod создался — Envoy узнал о новом endpoint за миллисекунды. Pod умер — Envoy убрал его из пула.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Пять xDS API',
                                    head: ['API', 'Что конфигурирует', 'Уровень'],
                                    rows: [
                                        ['LDS', 'Listeners', 'Сетевой'],
                                        ['RDS', 'Routes', 'HTTP'],
                                        ['CDS', 'Clusters', 'Upstream'],
                                        ['EDS', 'Endpoints (серверы в cluster)', 'Upstream'],
                                        ['SDS', 'Secrets (TLS-сертификаты)', 'Безопасность'],
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Динамический конфиг через xDS',
                                    code: 'dynamic_resources:\n  lds_config:\n    resource_api_version: V3\n    api_config_source:\n      api_type: GRPC\n      transport_api_version: V3\n      grpc_services:\n        - envoy_grpc:\n            cluster_name: xds_cluster\n  cds_config:\n    resource_api_version: V3\n    api_config_source:\n      api_type: GRPC\n      transport_api_version: V3\n      grpc_services:\n        - envoy_grpc:\n            cluster_name: xds_cluster',
                                },
                                {
                                    type: 'note',
                                    text: 'Control plane для Envoy: Istio (istiod), Envoy Gateway, Consul, Gloo, Ambassador, Cilium. Все они говорят на xDS. Вам не нужно писать xDS-сервер — берите готовый control plane и работайте с его API (Kubernetes CRD, Consul services).',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l10-s4',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте xDS API и что он конфигурирует.',
                                pairs: [
                                    { left: 'LDS', right: 'Listeners (порты и filter chains)' },
                                    { left: 'RDS', right: 'Routes (правила маршрутизации)' },
                                    { left: 'CDS', right: 'Clusters (пулы upstream)' },
                                    { left: 'EDS', right: 'Endpoints (серверы внутри cluster)' },
                                ],
                                explanation:
                                    'LDS — listeners. RDS — routes. CDS — clusters. EDS — endpoints. SDS — secrets (TLS). Пять API — полный контроль над конфигом без restart.',
                            },
                        },
                        {
                            id: 'proxy-l10-s5',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'Envoy — C++ proxy для микросервисов и service mesh.',
                                        'Три уровня: listener → filter chain → cluster.',
                                        'xDS — динамическая конфигурация через gRPC/REST.',
                                        'Пять API: LDS, RDS, CDS, EDS, SDS.',
                                        'Control plane: Istio, Consul, Envoy Gateway, Gloo, Cilium.',
                                        'Envoy не заменяет Nginx — они живут в разных нишах.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'proxy-l11',
                    title: 'Envoy: фильтры, retries, circuit breaker',
                    minutes: 22,
                    steps: [
                        {
                            id: 'proxy-l11-s1',
                            title: 'HTTP-фильтры',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Фильтры Envoy — это middleware, которые обрабатывают запрос/ответ до/после router. Каждый фильтр может изменить заголовки, тело, прервать запрос, добавить логирование. Порядок фильтров в списке имеет значение — они вызываются по цепочке.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Ключевые HTTP-фильтры',
                                    head: ['Фильтр', 'Что делает'],
                                    rows: [
                                        ['router', 'Обязательный финальный — передаёт в cluster'],
                                        ['cors', 'CORS-заголовки и preflight'],
                                        ['jwt_authn', 'Проверка JWT, извлечение claims'],
                                        ['ext_authz', 'Внешний авторизатор (например, OPA, Auth0)'],
                                        ['rbac', 'Role-based access control по IP, header, claim'],
                                        ['local_ratelimit', 'Rate limit на инстансе'],
                                        ['fault', 'Fault injection (delay, abort) для chaos-тестов'],
                                        ['compressor', 'gzip/brotli/zstd'],
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'JWT + CORS + RBAC',
                                    code: 'http_filters:\n  - name: envoy.filters.http.cors\n  - name: envoy.filters.http.jwt_authn\n    typed_config:\n      "@type": type.googleapis.com/envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication\n      providers:\n        auth0:\n          issuer: https://example.auth0.com/\n          remote_jwks:\n            http_uri:\n              uri: https://example.auth0.com/.well-known/jwks.json\n              cluster: auth0_jwks\n              timeout: 5s\n      rules:\n        - match: { prefix: "/api/" }\n          requires: { provider_name: auth0 }\n  - name: envoy.filters.http.rbac\n  - name: envoy.filters.http.router',
                                },
                                {
                                    type: 'note',
                                    text: 'ext_authz — мощный паттерн: каждый запрос идёт в отдельный сервис-авторизатор (OPA, кастомный Go/Python), тот возвращает allow/deny. Позволяет вынести бизнес-логику авторизации из Envoy, менять её без передеплоя прокси. Используется в Istio, Ambassador, Gloo.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l11-s2',
                            title: 'Retries, timeouts, circuit breaker',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Сетевые вызовы падают: таймауты, 502, обрывы. Envoy умеет ретраить, ограничивать время ожидания и «размыкать цепь» при массовых отказах. Всё это — на уровне cluster или route.',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Retry + timeout + circuit breaker',
                                    code: 'clusters:\n  - name: backend_cluster\n    connect_timeout: 1s\n    circuit_breakers:\n      thresholds:\n        - priority: DEFAULT\n          max_connections: 1024\n          max_pending_requests: 1024\n          max_requests: 1024\n          max_retries: 3\n    common_lb_config:\n      healthy_panic_threshold: { value: 10 }\n\nroute_config:\n  virtual_hosts:\n    - name: backend\n      domains: ["*"]\n      routes:\n        - match: { prefix: "/api/" }\n          route:\n            cluster: backend_cluster\n            timeout: 5s\n            retry_policy:\n              retry_on: "5xx,reset,connect-failure"\n              num_retries: 2\n              per_try_timeout: 1s\n              retriable_status_codes: [502, 503, 504]',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`connect_timeout` — таймаут на TCP-соединение',
                                        '`timeout` в route — общий таймаут на запрос',
                                        '`retry_on: 5xx,reset,connect-failure` — при каких ошибках повторять',
                                        '`num_retries: 2` — не более 2 повторов',
                                        '`per_try_timeout: 1s` — таймаут на каждую попытку',
                                        '`circuit_breakers` — сколько соединений/запросов/ретраев держать одновременно',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Circuit breaker в Envoy — не «полное размыкание цепи» как в Hystrix, а ограничение одновременных запросов/соединений. `max_requests: 1024` — если в cluster уже 1024 активных запроса, новые будут отклонены. Это защищает backend от перегрузки.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l11-s3',
                            title: 'Проверь себя',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Что делает circuit_breakers в Envoy?',
                                options: [
                                    { id: 'a', text: 'Размыкает цепь и полностью отключает cluster при N ошибках' },
                                    { id: 'b', text: 'Ограничивает количество одновременных соединений и запросов в cluster' },
                                    { id: 'c', text: 'Блокирует IP после N ошибок' },
                                    { id: 'd', text: 'Заменяет health checks' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'В отличие от Hystrix, circuit breaker в Envoy — это лимиты (max_connections, max_pending_requests, max_requests). Когда лимит достигнут, новые запросы отклоняются, защищая backend от перегрузки. Полное отключение cluster — задача outlier detection и health checks.',
                            },
                        },
                        {
                            id: 'proxy-l11-s4',
                            title: 'Outlier detection: активные health checks',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В отличие от Nginx OSS, в Envoy есть встроенные **активные** health checks: Envoy сам периодически дёргает `/health` у каждого endpoint. Плюс **outlier detection**: если endpoint отвечает хуже других, Envoy временно выводит его из пула — даже без полного падения.',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Активный health check + outlier detection',
                                    code: 'clusters:\n  - name: backend_cluster\n    connect_timeout: 1s\n    health_checks:\n      - timeout: 1s\n        interval: 5s\n        unhealthy_threshold: 3\n        healthy_threshold: 2\n        http_health_check:\n          path: /health\n    outlier_detection:\n      consecutive_5xx: 5\n      interval: 10s\n      base_ejection_time: 30s\n      max_ejection_percent: 50',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`health_checks` — активные HTTP-проверки каждые 5 секунд',
                                        '`unhealthy_threshold: 3` — 3 неудачи подряд → endpoint выведен',
                                        '`outlier_detection.consecutive_5xx: 5` — 5 подряд 5xx → временный вывод',
                                        '`base_ejection_time: 30s` — минимум 30 секунд вне пула',
                                        '`max_ejection_percent: 50` — не выводить больше 50% пула одновременно',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Outlier detection — killer feature Envoy. Представьте: 5 серверов, один начал отвечать на 3 секунды медленнее (перегрелся CPU, тормозит GC). Nginx всё равно шлёт на него запросы (health check проходит). Envoy замечает аномалию и временно выводит из пула — пользователи не страдают.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l11-s5',
                            title: 'Главное',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        'Фильтры: cors, jwt_authn, ext_authz, rbac, local_ratelimit, fault.',
                                        'Порядок фильтров имеет значение, router — всегда последний.',
                                        'Retries: retry_on, num_retries, per_try_timeout.',
                                        'Circuit breaker — лимиты на соединения и запросы.',
                                        'Outlier detection — выводит аномальные endpoint даже без падения.',
                                        'Health checks — активные, каждые N секунд.',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'proxy-l14',
                    title: 'Nginx в Kubernetes: ingress-nginx и аннотации',
                    minutes: 22,
                    steps: [
                        {
                            id: 'proxy-l14-s1',
                            title: 'Зачем нужен ingress-контроллер',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В Kubernetes сервис с типом `LoadBalancer` создаёт **свой** облачный балансировщик для каждого приложения. Три приложения — три ELB, три публичных IP, три счёта от облака. Дорого и неудобно. **Ingress** — это единая точка входа: один балансировщик, один IP, маршрутизация по hostname и pathname к разным сервисам.',
                                },
                                {
                                    type: 'p',
                                    text: 'Ingress — это абстракция Kubernetes (ресурс), а не сам прокси. Чтобы она работала, нужен **ingress-контроллер** — конкретная реализация, которая читает Ingress-объекты и настраивает реальный прокси. Самые популярные: **ingress-nginx** (Nginx-based, де-факто стандарт), **Traefik**, **Contour** (Envoy), **HAProxy Ingress**.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Один ingress-контроллер — много сервисов',
                                    code: 'graph LR\n    Internet["Internet"] -->|":443"| Cloud["Cloud LoadBalancer"]\n    Cloud --> ICNG["ingress-nginx<br/>controller pod"]\n    ICNG -->|"host: shop.*"| S1["Service: shop"]\n    ICNG -->|"host: api.*"| S2["Service: api"]\n    ICNG -->|"host: admin.*"| S3["Service: admin"]\n    S1 --> P1["Pods: shop"]\n    S2 --> P2["Pods: api"]\n    S3 --> P3["Pods: admin"]',
                                },
                                {
                                    type: 'note',
                                    text: 'В 2025 ingress-nginx — самый популярный контроллер (по статистике CNCF, ~60% кластеров). Не путайте с **Nginx Ingress Controller** от Nginx Inc (коммерческий, платный) — `ingress-nginx` это community-проект под эгидой Kubernetes SIG Network, полностью open-source.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l14-s2',
                            title: 'Установка ingress-nginx',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Установка — через Helm (самый распространённый способ) или через манифесты. Helm даёт больше гибкости в настройке values. Для локальных кластеров (kind, minikube, k3s) обычно достаточно дефолтных values.',
                                },
                                {
                                    type: 'code',
                                    lang: 'bash',
                                    caption: 'Установка через Helm',
                                    code: 'helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx\nhelm repo update\n\nhelm install ingress-nginx ingress-nginx/ingress-nginx \\\n  --namespace ingress-nginx \\\n  --create-namespace \\\n  --set controller.replicaCount=2 \\\n  --set controller.metrics.enabled=true \\\n  --set controller.podAnnotations."prometheus\\.io/scrape"="true"\n\n# Проверить, что pod запустился и получил external IP\nkubectl get pods -n ingress-nginx\nkubectl get svc -n ingress-nginx',
                                },
                                {
                                    type: 'p',
                                    text: '`controller.replicaCount=2` — два пода контроллера для отказоустойчивости. `metrics.enabled=true` — включает Prometheus-метрики. После установки проверьте, что сервис `ingress-nginx-controller` получил `EXTERNAL-IP` (в облаке) или `NodePort` (в локальном кластере).',
                                },
                                {
                                    type: 'note',
                                    text: 'В локальных кластерах (kind, minikube) `EXTERNAL-IP` будет `<pending>`. Это нормально: `ingress-nginx` доступен через NodePort или через `kubectl port-forward`. В облаке (EKS, GKE, AKS) — `LoadBalancer` создаст реальный IP за 1–2 минуты.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l14-s3',
                            title: 'Ingress-манифест и аннотации',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Ingress-объект описывает **что** маршрутизировать. Аннотации (`annotations`) — это **как** маршрутизировать: специфичные для контроллера настройки, которых нет в стандартной схеме Ingress. У каждого контроллера свой набор аннотаций.',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Ingress с маршрутизацией по host и path',
                                    code: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: app-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\n    nginx.ingress.kubernetes.io/proxy-body-size: "10m"\n    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - shop.example.com\n      secretName: shop-tls\n  rules:\n    - host: shop.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: shop-service\n                port:\n                  number: 80\n    - host: api.example.com\n      http:\n        paths:\n          - path: /v1\n            pathType: Prefix\n            backend:\n              service:\n                name: api-service\n                port:\n                  number: 8080',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '`ingressClassName: nginx` — какой контроллер обрабатывает этот Ingress',
                                        '`pathType: Prefix` — точное совпадение (`Exact`) или префикс (`Prefix`)',
                                        '`rewrite-target: /` — переписать URL перед отправкой в backend',
                                        '`proxy-body-size: "10m"` — максимальный размер тела запроса',
                                        '`ssl-redirect: "true"` — принудительный HTTPS',
                                        '`cert-manager.io/cluster-issuer` — автоматическая выдача TLS через cert-manager',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Аннотации — это конфиг Nginx, переданный «через Kubernetes». `nginx.ingress.kubernetes.io/proxy-read-timeout` соответствует `proxy_read_timeout` в nginx.conf. Если знаете Nginx-директиву, но не знаете аннотацию — ищите `nginx.ingress.kubernetes.io/<directive-name>` в [документации ingress-nginx](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/).',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l14-s4',
                            title: 'Проверь себя: аннотации',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Что делает аннотация nginx.ingress.kubernetes.io/rewrite-target?',
                                options: [
                                    { id: 'a', text: 'Переписывает URL запроса перед отправкой в backend' },
                                    { id: 'b', text: 'Меняет имя сервиса' },
                                    { id: 'c', text: 'Включает TLS' },
                                    { id: 'd', text: 'Удаляет заголовки' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'rewrite-target переписывает путь до отправки в backend. Например, внешний /api/users превращается в /users, если backend ожидает пути без префикса /api. Часто используется вместе с path: /api и rewrite-target: /, чтобы отрезать префикс.',
                            },
                        },
                        {
                            id: 'proxy-l14-s5',
                            title: 'TLS и cert-manager',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'TLS в Kubernetes обычно делается через **cert-manager** — контроллер, который автоматически получает и обновляет сертификаты. Он смотрит на аннотации Ingress и создаёт `Certificate`-объекты. Let\'s Encrypt-сертификат выдаётся по ACME-протоколу автоматически.',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'ClusterIssuer для Let\'s Encrypt',
                                    code: 'apiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-prod\nspec:\n  acme:\n    server: https://acme-v02.api.letsencrypt.org/directory\n    email: devops@example.com\n    privateKeySecretRef:\n      name: letsencrypt-prod-account-key\n    solvers:\n      - http01:\n          ingress:\n            class: nginx',
                                },
                                {
                                    type: 'p',
                                    text: '`http01` solver — cert-manager создаёт временный `Ingress` с `.well-known/acme-challenge/...`, Let\'s Encrypt приходит по HTTP, проверяет, что домен ваш, и выдаёт сертификат. После этого cert-manager кладёт его в `Secret` (в примере — `shop-tls`), который используется в `spec.tls` вашего Ingress.',
                                },
                                {
                                    type: 'note',
                                    text: 'Перед использованием `letsencrypt-prod` обязательно протестируйте на `letsencrypt-staging`. У staging-сертификата другой CA — браузер будет ругаться на «невалидный», но это правильно: если со staging всё работает, prod тоже заработает. У Let\'s Encrypt строгий rate limit на выдачу (5 ошибок в час), не жгите его на отладке.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l14-s6',
                            title: 'Расставьте шаги диагностики',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Ingress отдаёт 503. Расставьте шаги диагностики в правильном порядке.',
                                items: [
                                    'Проверить, что pod backend запущен: kubectl get pods',
                                    'Проверить, что service backend имеет endpoints: kubectl get endpoints',
                                    'Проверить логи ingress-nginx-controller: kubectl logs',
                                    'Проверить Ingress-манифест: kubectl describe ingress',
                                    'Проверить, что ingressClassName совпадает с установленным контроллером',
                                ],
                                correct: [
                                    'Проверить, что pod backend запущен: kubectl get pods',
                                    'Проверить, что service backend имеет endpoints: kubectl get endpoints',
                                    'Проверить логи ingress-nginx-controller: kubectl logs',
                                    'Проверить Ingress-манифест: kubectl describe ingress',
                                    'Проверить, что ingressClassName совпадает с установленным контроллером',
                                ],
                                explanation:
                                    '503 от ingress — это «нет живого backend» или «контроллер не знает про Ingress». Сначала проверяем pod (жив ли), потом service endpoints (правильно ли селектор), потом логи контроллера (что он думает), потом сам Ingress-манифест, в конце — class name. 90% проблем — где-то в первых двух шагах.',
                            },
                        },
                    ],
                },
            ],
        },

        // ═════════════════════════════════════════════════════════════════════
        // Модуль 5. Практикум
        // ═════════════════════════════════════════════════════════════════════
        {
            id: 'proxy-m5',
            title: 'Практикум: настройка edge-прокси для SaaS',
            lessons: [
                {
                    id: 'proxy-l12',
                    title: 'Собираем всё вместе',
                    minutes: 25,
                    steps: [
                        {
                            id: 'proxy-l12-s1',
                            title: 'Сценарий',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'У нас SaaS-приложение: 3 backend-сервера с API на :8080, статика на S3, публичный домен `app.example.com`, три типа нагрузки — обычные API-запросы, загрузка файлов и страница логина. Нужно настроить edge-прокси на Nginx, чтобы всё работало быстро и безопасно. Пройдём по шагам.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l12-s2',
                            title: 'Шаг 1. Какой протокол выбрать',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие протоколы стоит включить на edge для современного SaaS? (Выберите все подходящие.)',
                                options: [
                                    { id: 'a', text: 'TLS 1.2 и TLS 1.3' },
                                    { id: 'b', text: 'HTTP/2 для всех клиентов' },
                                    { id: 'c', text: 'HTTP/3 (QUIC) как опция через Alt-Svc' },
                                    { id: 'd', text: 'TLS 1.0 для совместимости со старыми браузерами' },
                                ],
                                correct: ['a', 'b', 'c'],
                                explanation:
                                    'TLS 1.2+1.3 — современный минимум. HTTP/2 — для мультиплексирования. HTTP/3 — опционально через Alt-Svc, с fallback на HTTP/2. TLS 1.0/1.1 отключены — уязвимы и не поддерживаются браузерами.',
                            },
                        },
                        {
                            id: 'proxy-l12-s3',
                            title: 'Шаг 2. TLS-конфиг',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие директивы обязательны в TLS-конфиге на edge? (Выберите все подходящие.)',
                                options: [
                                    { id: 'a', text: 'ssl_protocols TLSv1.2 TLSv1.3' },
                                    { id: 'b', text: 'ssl_stapling on и ssl_stapling_verify on' },
                                    { id: 'c', text: 'add_header Strict-Transport-Security "max-age=63072000"' },
                                    { id: 'd', text: 'ssl_protocols SSLv3' },
                                ],
                                correct: ['a', 'b', 'c'],
                                explanation:
                                    'TLS 1.2+1.3, OCSP stapling и HSTS — современный стандарт. SSLv3 отключён из-за POODLE. Без stapling замедляется handshake, без HSTS — браузер может пойти по HTTP.',
                            },
                        },
                        {
                            id: 'proxy-l1-s4',
                            title: 'Nginx vs Apache vs Envoy',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Nginx появился в 2004 как решение проблемы C10K (десять тысяч одновременных соединений) — Apache с process-per-connection моделью на это не был рассчитан. Nginx построен на **event loop** и асинхронном I/O: одно соединение — небольшой кусок памяти, а не процесс. Это даёт десятки тысяч соединений на одном сервере.',
                                },
                                {
                                    type: 'table',
                                    caption: 'Три прокси — три ниши',
                                    head: ['Свойство', 'Nginx', 'Apache HTTP Server', 'Envoy'],
                                    rows: [
                                        ['Архитектура', 'Event loop, async I/O', 'Process/thread per connection', 'Event loop, C++, Lyft'],
                                        ['Основная ниша', 'Reverse proxy, web server, статика', 'Классический web server с .htaccess', 'Service mesh, edge proxy, API gateway'],
                                        ['Конфигурация', 'Статический nginx.conf', 'httpd.conf / .htaccess', 'Динамическая через xDS API'],
                                        ['Hot reload', 'Да, через SIGHUP', 'Да, graceful restart', 'Полностью динамическая, без restart'],
                                        ['Экосистема', 'Огромная, миллионы статей', 'Огромная, но исторически', 'Быстро растёт, CNCF graduated'],
                                        ['Идеален для', 'Один сервер с понятным конфигом', 'PHP-хостинг, legacy', 'Микросервисы, Kubernetes, mesh'],
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'proxy-l12-s5',
                            title: 'Шаг 4. Сжатие',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Что сжимать в SaaS-приложении?',
                                options: [
                                    { id: 'a', text: 'HTML, CSS, JS, JSON, SVG через gzip/brotli' },
                                    { id: 'b', text: 'Всё подряд, включая JPEG и MP4' },
                                    { id: 'c', text: 'Только HTML' },
                                    { id: 'd', text: 'Ничего — трафик дешёвый' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'Текстовые типы сжимаются хорошо. JPEG/PNG/MP4 уже сжаты — повторное сжатие вредит. Сжимайте HTML, CSS, JS, JSON, SVG.',
                            },
                        },
                        {
                            id: 'proxy-l12-s6',
                            title: 'Шаг 5. Rate limiting',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Какая комбинация rate limit правильна для публичного API?',
                                options: [
                                    { id: 'a', text: 'limit_req 1000r/s на IP без burst — «чтобы точно никто не тормозил»' },
                                    { id: 'b', text: 'limit_req 10r/s с burst=20 на IP + отдельно жёсткий rate limit на /login (5r/m)' },
                                    { id: 'c', text: 'Только limit_conn 100 — этого достаточно' },
                                    { id: 'd', text: 'Rate limit не нужен, если backend за CDN' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Разумный rate на API (10r/s с burst), жёсткий на /login (5r/m против брутфорса), лимит на IP. Слишком высокий rate (1000r/s) не защищает ни от чего. Только limit_conn без limit_req — половина защиты. CDN не отменяет rate limit на origin.',
                            },
                        },
                        {
                            id: 'proxy-l12-s7',
                            title: 'Шаг 6. Балансировка',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте тип нагрузки и метод балансировки.',
                                pairs: [
                                    { left: 'Stateless REST API', right: 'round-robin или least_conn' },
                                    { left: 'Загрузка больших файлов', right: 'least_conn' },
                                    { left: 'Legacy с сессией в памяти', right: 'hash $cookie_sessionid' },
                                    { left: 'Большой пул (100+ нод)', right: 'random two' },
                                ],
                                explanation:
                                    'Stateless API — любой метод. Загрузка файлов (долгие соединения) — least_conn. Legacy с сессией — hash по cookie. Большой пул — random two (power-of-two-choices).',
                            },
                        },
                        {
                            id: 'proxy-l12-s8',
                            title: 'Шаг 7. Метрики и алерты',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Без мониторинга прокси — чёрный ящик. Включите `stub_status` и `nginx-prometheus-exporter`, чтобы видеть ключевые метрики. Настройте алерты на аномалии.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'stub_status для Prometheus',
                                    code: 'server {\n    listen 127.0.0.1:8081;\n    location /stub_status {\n        stub_status;\n        allow 127.0.0.1;\n        deny all;\n    }\n}\n\n# nginx-prometheus-exporter --nginx.scrape-uri=http://127.0.0.1:8081/stub_status',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Active connections** — если растёт линейно, что-то держит соединения (slow loris, утечка keepalive)',
                                        '**Requests per second** — аномальный рост = атака, аномальное падение = сломалось',
                                        '**Cache hit rate** — если упал, backend перегружен',
                                        '**Upstream response time p95** — если вырос, backend тормозит',
                                        '**4xx / 5xx rate** — 429 растёт = rate limit срабатывает, 5xx = backend падает',
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Алерты: «5xx > 1% за 5 минут», «cache hit rate < 50% на статике», «active connections > 10k», «429 на /login > 100 в минуту». Три-четыре алерта покрывают 90% инцидентов. Без них вы узнаете о проблеме от пользователей.',
                                },
                            ],
                        },
                        {
                            id: 'proxy-l12-s9',
                            title: 'Шаг 8. Когда добавить Envoy',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'В какой момент SaaS стоит добавить Envoy к существующему Nginx?',
                                options: [
                                    { id: 'a', text: 'Сразу, Envoy всегда лучше Nginx' },
                                    { id: 'b', text: 'Когда появился Kubernetes и нужна динамическая конфигурация без restart, mesh, mTLS между сервисами' },
                                    { id: 'c', text: 'Когда на Nginx закончилась лицензия' },
                                    { id: 'd', text: 'Никогда, Envoy — хайп' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Envoy оправдан в динамической среде: Kubernetes, mesh, частые деплои, mTLS east-west. Для статического edge-прокси на одном сервере Nginx проще и достаточен. Nginx на edge + Envoy внутри — рабочая архитектура.',
                            },
                        },
                        {
                            id: 'proxy-l12-s10',
                            title: 'Шаг 9. Troubleshooting',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Расставьте шаги диагностики «сайт отдаёт 502 Bad Gateway».',
                                items: [
                                    'Проверить error_log Nginx — какая именно ошибка',
                                    'Проверить, что upstream-сервис живой (curl /health)',
                                    'Проверить, что Nginx может достучаться до backend (telnet, ss)',
                                    'Проверить конфиг backend (listen, port, привязка к интерфейсу)',
                                    'Исправить причину и перезагрузить Nginx (nginx -s reload)',
                                ],
                                correct: [
                                    'Проверить error_log Nginx — какая именно ошибка',
                                    'Проверить, что upstream-сервис живой (curl /health)',
                                    'Проверить, что Nginx может достучаться до backend (telnet, ss)',
                                    'Проверить конфиг backend (listen, port, привязка к интерфейсу)',
                                    'Исправить причину и перезагрузить Nginx (nginx -s reload)',
                                ],
                                explanation:
                                    '502 = «bad gateway»: Nginx не смог получить валидный ответ от backend. Сначала логи (там точная причина), потом живой ли сервис, потом сетевая доступность, потом его конфиг. Только после исправления — reload.',
                            },
                        },
                        {
                            id: 'proxy-l12-s11',
                            title: 'Итог',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Вы прошли путь от идеи до почти готового edge-прокси: TLS, HTTP/2 и HTTP/3, кэш статики, сжатие, rate limit, балансировка, мониторинг. Дальше — только практика на реальных сценариях и чтение документации к вашей инфраструктуре.',
                                },
                                {
                                    type: 'note',
                                    text: 'Главный принцип: прокси — не «магия», а набор конкретных задач, каждая из которых решается конкретными директивами. Понимая задачу, вы найдёте директиву. Не наоборот. Начните с простого конфига, добавьте TLS, потом кэш, потом rate limit — по одному изменению за раз, с проверкой каждой итерации.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};