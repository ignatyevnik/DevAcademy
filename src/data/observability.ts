import type { Course } from './types';

export const observabilityCourse: Course = {
    slug: 'observability',
    title: 'Observability: Prometheus, Grafana, Loki и OpenTelemetry',
    subtitle: 'Метрики, PromQL, логи и LogQL, алерты, дашборды и распределённый трейсинг',
    description:
        'Практический курс по наблюдаемости (Observability) для DevOps-, SRE- и backend-инженеров. Разберём три столпа телеметрии (метрики, логи, трейсы), методологии RED, USE и Four Golden Signals, язык запросов PromQL и LogQL, маршрутизацию алертов в Alertmanager, проектирование дашбордов в Grafana и сквозной трейсинг через OpenTelemetry.',
    level: 'Средний',
    tags: ['Observability', 'Prometheus', 'Grafana', 'Loki', 'OpenTelemetry'],
    accent: '#e6522c',
    icon: 'observability',
    outcomes: [
        'Отличать классический мониторинг от Observability и понимать три столпа телеметрии',
        'Применять методологии RED, USE и Four Golden Signals для выбора метрик и алертов',
        'Писать запросы на PromQL (counter, gauge, histogram_quantile, rate) и LogQL',
        'Настраивать правила алертинга, группировку и подавление шума в Alertmanager',
        'Строить читаемые дашборды в Grafana и анализировать распределённые трейсы в OpenTelemetry',
    ],
    requirements: [
        'Базовое понимание Linux, сетей и HTTP',
        'Опыт работы с Docker или Kubernetes на базовом уровне',
    ],
    modules: [
        {
            id: 'obs-m1',
            title: 'Основы Observability, RED/USE и Golden Signals',
            lessons: [
                {
                    id: 'obs-l1',
                    title: 'Мониторинг vs Observability и три столпа телеметрии',
                    minutes: 25,
                    steps: [
                        {
                            id: 'obs-l1-s1',
                            title: 'Чем Observability отличается от классического мониторинга',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Классический мониторинг отвечает на заранее известные вопросы: «Не закончилось ли место на диске?», «Жив ли процесс nginx?», «Не превышен ли порог CPU 80%?». **Observability (наблюдаемость)** — свойство системы, позволяющее по её внешним сигналам (метрикам, логам и трейсам) понять внутреннее состояние при **неизвестных ранее сбоях** («unknown unknowns»): почему именно сейчас у 3% пользователей в одном регионе вырос p99 при оплате картой определённого банка.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Три столпа телеметрии дополняют друг друга при расследовании инцидента',
                                    code: 'graph TD\n  Alert["Алерт: вырос p99 и 5xx<br/>на /api/checkout"] --> Metrics["1. Метрики (Prometheus)<br/>Когда началось и какой сервис затронут"]\n  Metrics --> Traces["2. Трейсы (OpenTelemetry)<br/>В каком спане / внешнем вызове задержка"]\n  Traces --> Logs["3. Логи (Loki)<br/>Конкретный текст ошибки и контекст запроса"]',
                                },
                                {
                                    type: 'note',
                                    text: 'Типичный путь расследования: метрики показывают «что и когда пошло не так», трейсы сужают круг до конкретного сервиса/операции и `trace_id`, а логи по этому `trace_id` дают детальный стектрейс и причину.',
                                },
                            ],
                        },
                        {
                            id: 'obs-l1-s2',
                            title: 'Три столпа телеметрии: метрики, логи, трейсы',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'table',
                                    caption: 'Сравнение трёх видов телеметрии',
                                    head: ['Столп', 'Суть данных', 'Хранение и стоимость', 'Главная задача'],
                                    rows: [
                                        ['Метрики', 'Числовые временные ряды (значение + метки + timestamp)', 'Компактные, агрегируются, хранятся долго', 'Графики в реальном времени, тренды и алерты'],
                                        ['Логи', 'Дискретные записи событий (текст, JSON, logfmt)', 'Объёмные, требуют индексации/фильтрации', 'Детальный разбор причин конкретного сбоя'],
                                        ['Трейсы (Traces)', 'Дерево связанных операций (Spans) одного запроса через `trace_id`', 'Сэмплируются на высокой нагрузке', 'Поиск узких мест и задержек в цепочке вызовов'],
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l1-s3',
                            title: 'Проблема высокой кардинальности (High Cardinality)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В метриках (Prometheus) каждая уникальная комбинация меток (`labels`) создаёт отдельный временной ряд (Time Series). Если добавить в метку метрики `user_id` (10 млн пользователей) или `request_id` (миллиарды запросов), число рядов взрывается — это **High Cardinality**, которая съедает всю оперативную память TSDB и кладёт мониторинг.',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Безопасные метки vs опасная кардинальность',
                                    code: 'Безопасно (низкая кардинальность):\n  http_requests_total{method="POST", status="200", handler="/checkout"}\n  → десятки / сотни рядов\n\nОпасно (высокая кардинальность):\n  http_requests_total{user_id="8492014", trace_id="9f8a7b6c..."}\n  → миллионы рядов! Уникальные ID кладут в логи и трейсы, а не в метки метрик.',
                                },
                            ],
                        },
                        {
                            id: 'obs-l1-s4',
                            title: 'Проверь себя: три столпа телеметрии',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте тип телеметрии и его основное назначение',
                                pairs: [
                                    { left: 'Метрики (Time Series)', right: 'Числовые агрегаты для графиков, расчёта SLO и срабатывания алертов' },
                                    { left: 'Логи', right: 'Подробные текстовые или структурированные записи об отдельных событиях и ошибках' },
                                    { left: 'Трейсы (Spans)', right: 'Прослеживание пути запроса через несколько сервисов с измерением длительности каждого шага' },
                                    { left: 'High Cardinality', right: 'Резкий рост числа временных рядов из-за меток с уникальными ID (например, user_id)' },
                                ],
                                explanation:
                                    'Метрики дают числовую картину и алерты, трейсы показывают задержки по цепочке вызовов, логи раскрывают детали, а высокая кардинальность меток перегружает память хранилища метрик.',
                            },
                        },
                        {
                            id: 'obs-l1-s5',
                            title: 'Проверь себя: антипаттерн в метриках',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Разработчик добавил в Prometheus-счётчик `http_requests_total` метку `email="ivan@example.com"` для 2 миллионов пользователей. Какой риск это создаёт?',
                                options: [
                                    { id: 'a', text: 'Взрыв кардинальности (High Cardinality): создадутся миллионы временных рядов, что приведёт к росту потребления RAM в Prometheus и замедлению запросов' },
                                    { id: 'b', text: 'HTTP-запросы перестанут доходить до приложения' },
                                    { id: 'c', text: 'Отключится шифрование TLS' },
                                    { id: 'd', text: 'База данных автоматически удалит старые логи' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'Уникальные значения вроде email, UUID или user_id в метках метрик порождают огромное число временных рядов и перегружают память Prometheus.',
                            },
                        },
                        {
                            id: 'obs-l1-s6',
                            title: 'Практика в Python: расчёт доли ошибок (Error Rate) и бюджета ошибок',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Посчитаем в Python процент ошибочных запросов (`error_rate_pct`) по счётчикам успешных (`200`) и серверных (`500`) ответов.',
                                },
                                {
                                    type: 'python',
                                    python: {
                                        starterCode:
                                            'ok_requests = 19_600\nserver_errors_5xx = 400\n\n# Посчитайте общий объём запросов и долю 5xx в процентах:\n# error_rate_pct = (server_errors_5xx / (ok_requests + server_errors_5xx)) * 100\nerror_rate_pct = None  # TODO\n\nprint(f"{error_rate_pct:.1f}%")\n',
                                        task: 'Вычислите долю 5xx-ошибок в процентах (`error_rate_pct`) для `19_600` успешных и `400` ошибочных запросов. Ожидается `2.0%`.',
                                        solution:
                                            'ok_requests = 19_600\nserver_errors_5xx = 400\n\ntotal = ok_requests + server_errors_5xx\nerror_rate_pct = (server_errors_5xx / total) * 100\nprint(f"{error_rate_pct:.1f}%")',
                                        expected: { type: 'stdout', value: '2.0%' },
                                        hint: 'total = 20_000; 400 / 20_000 * 100 = 2.0',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'obs-l2',
                    title: 'Методологии RED, USE и Four Golden Signals',
                    minutes: 25,
                    steps: [
                        {
                            id: 'obs-l2-s1',
                            title: 'RED и Four Golden Signals — для сервисов и API',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Когда система состоит из десятков микросервисов, легко утонуть в сотнях графиков. Методология **RED** (Том Уилки) задаёт три базовые метрики для каждого сервиса/эндпоинта, а **Four Golden Signals** (Google SRE Workbook) добавляет четвёртый сигнал — **Saturation (насыщение)**:',
                                },
                                {
                                    type: 'table',
                                    caption: 'RED и Four Golden Signals',
                                    head: ['Сигнал / Метрика', 'Входит в RED', 'Входит в Golden Signals', 'Что показывает'],
                                    rows: [
                                        ['**Rate** (RPS)', 'Да', 'Да (Traffic)', 'Сколько запросов в секунду получает сервис/эндпоинт'],
                                        ['**Errors**', 'Да', 'Да (Errors)', 'Доля неуспешных запросов (5xx, исключения, проваленные бизнес-операции)'],
                                        ['**Duration** (Latency)', 'Да', 'Да (Latency)', 'Время выполнения запросов (обычно смотрим p95 и p99, отдельно для успешных и ошибок)'],
                                        ['**Saturation** (Насыщение)', 'Нет', 'Да (Saturation)', 'Насколько загружен самый узкий ресурс (длина очереди, пул соединений БД, CPU)'],
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l2-s2',
                            title: 'USE Method — для аппаратных ресурсов и инфраструктуры',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Методология **USE** (Брендан Грегг) применяется к физическим/виртуальным ресурсам: CPU, оперативной памяти, дискам, сетевым интерфейсам. Для каждого ресурса измеряют три показателя:',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Utilization (Утилизация):** доля времени, в течение которого ресурс был занят выполнением работы (например, 75% времени диск обрабатывал запросы).',
                                        '**Saturation (Насыщение):** степень, в которой ресурс имеет дополнительную работу, которую он не может обслужить прямо сейчас и ставит в очередь (например, длина очереди к диску / `load average` выше числа ядер).',
                                        '**Errors (Ошибки):** счётчик ошибок на уровне ресурса (например, ошибки чтения/записи диска, отброшенные сетевые пакеты).',
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l2-s3',
                            title: 'Проверь себя: сопоставление метрик и методологий',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте метрику или подход и его категорию',
                                pairs: [
                                    { left: 'Rate (RPS)', right: 'Частота входящих запросов к сервису (RED / Traffic)' },
                                    { left: 'Duration (p99)', right: 'Длительность обработки запросов (RED / Latency)' },
                                    { left: 'Utilization (USE)', right: 'Доля времени, в течение которого ресурс (CPU, диск) занят работой' },
                                    { left: 'Saturation (USE / Golden Signals)', right: 'Накопление очереди ожидания или исчерпание пула ресурсов при перегрузке' },
                                ],
                                explanation:
                                    'RED фокусируется на поведении сервиса с точки зрения запросов, а USE — на утилизации, очередях и ошибках инфраструктурных ресурсов.',
                            },
                        },
                        {
                            id: 'obs-l2-s4',
                            title: 'Проверь себя: отличия RED и USE',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Какая методология лучше подходит для диагностики узких мест самих ресурсов хоста (диск, CPU, сетевой интерфейс) по формуле «утилизация, очередь, ошибки»?',
                                options: [
                                    { id: 'a', text: 'USE Method' },
                                    { id: 'b', text: 'REST API' },
                                    { id: 'c', text: 'ACID' },
                                    { id: 'd', text: 'FIFO' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'USE (Utilization, Saturation, Errors) создана Бренданом Греггом специально для анализа инфраструктурных ресурсов.',
                            },
                        },
                        {
                            id: 'obs-l2-s5',
                            title: 'Проверь себя: что важно при измерении Latency',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие практики корректны при мониторинге задержек (Latency)?',
                                options: [
                                    { id: 'a', text: 'Отслеживать перцентили p95 и p99 вместо одного среднего значения' },
                                    { id: 'b', text: 'Разделять метрики задержки для успешных запросов (200) и ошибок (500), чтобы быстрые 500-е не занижали время ответа' },
                                    { id: 'c', text: 'Ориентироваться только на среднее арифметическое за сутки' },
                                    { id: 'd', text: 'Проверять, не растёт ли latency вместе с ростом трафика или длины очереди' },
                                ],
                                correct: ['a', 'b', 'd'],
                                explanation:
                                    'Мгновенная ошибка 500 за 2 мс может искусственно «улучшить» среднее время ответа, скрыв деградацию медленных запросов.',
                            },
                        },
                    ],
                },
                {
                    id: 'obs-l3',
                    title: 'Архитектура Prometheus: Pull-модель, экспортёры и Service Discovery',
                    minutes: 30,
                    steps: [
                        {
                            id: 'obs-l3-s1',
                            title: 'Как работает сбор метрик в Prometheus',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В отличие от систем, куда приложения сами отправляют метрики по сети (Push), **Prometheus работает по Pull-модели**: сервер Prometheus по расписанию (`scrape_interval`, например каждые 15 секунд) сам ходит по HTTP на эндпоинт `/metrics` целевых сервисов или **экспортёров** (например, `node_exporter` для метрик Linux-хоста или `postgres_exporter` для PostgreSQL) и забирает текстовый срез метрик.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Pull-модель Prometheus и Service Discovery',
                                    code: 'graph LR\n  SD["Service Discovery<br/>(Kubernetes API / Consul)"] -.->|"Список целей (targets)"| Prom["Prometheus Server<br/>(TSDB + PromQL)"]\n  Prom -->|"GET /metrics (каждые 15s)"| Exp1["node_exporter<br/>(:9100)"]\n  Prom -->|"GET /metrics (каждые 15s)"| App["Приложение<br/>(/metrics)"]\n  Prom -->|"Оценка правил"| AM["Alertmanager"]\n  Grafana["Grafana"] -->|"PromQL"| Prom',
                                },
                            ],
                        },
                        {
                            id: 'obs-l3-s2',
                            title: 'Четыре типа метрик в Prometheus',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'table',
                                    caption: 'Типы метрик Prometheus',
                                    head: ['Тип', 'Как меняется значение', 'Пример'],
                                    rows: [
                                        ['**Counter** (Счётчик)', 'Только растёт монотонно (или сбрасывается в `0` при рестарте процесса)', 'Общее число HTTP-запросов (`http_requests_total`), число ошибок'],
                                        ['**Gauge** (Измеритель)', 'Может как расти, так и падать в любой момент', 'Текущая загрузка памяти, число активных соединений, температура, размер очереди'],
                                        ['**Histogram** (Гистограмма)', 'Накопительные корзины (`_bucket`) + сумма (`_sum`) + счётчик (`_count`) на стороне сервера', 'Время ответа HTTP (`http_request_duration_seconds_bucket`) для расчёта перцентилей через `histogram_quantile`'],
                                        ['**Summary**', 'Считает квантили на клиенте в скользящем окне', 'Реже используется в распределённых системах, так как квантили нельзя усреднить между инстансами'],
                                    ],
                                },
                                {
                                    type: 'note',
                                    text: 'Для **Counter** никогда не смотрят на «сырое» значение само по себе — всегда берут скорость прироста через `rate()` или `irate()`!',
                                },
                            ],
                        },
                        {
                            id: 'obs-l3-s3',
                            title: 'Проверь себя: выбор типа метрики',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Какой тип метрики Prometheus выбрать для измерения «количества задач, прямо сейчас ожидающих обработки в очереди» (значение может и вырасти с 10 до 500, и упасть до 0)?',
                                options: [
                                    { id: 'a', text: 'Gauge' },
                                    { id: 'b', text: 'Counter' },
                                    { id: 'c', text: 'Histogram' },
                                    { id: 'd', text: 'Label' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'Поскольку значение может и расти, и уменьшаться в любой момент, подходит тип Gauge. Counter растёт только монотонно (за исключением сброса при рестарте).',
                            },
                        },
                        {
                            id: 'obs-l3-s4',
                            title: 'Проверь себя: Pull vs Push и экспортёры',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие утверждения об архитектуре Prometheus верны?',
                                options: [
                                    { id: 'a', text: 'Prometheus по умолчанию сам опрашивает эндпоинты /metrics по HTTP (Pull-модель)' },
                                    { id: 'b', text: 'Для систем, которые не умеют отдавать /metrics напрямую (например, Linux-ядро или БД), используют экспортёры (node_exporter)' },
                                    { id: 'c', text: 'Метка /metrics по умолчанию отдаёт метрики в простом текстовом формате' },
                                    { id: 'd', text: 'Counter при перезапуске контейнера никогда не сбрасывается в 0' },
                                ],
                                correct: ['a', 'b', 'c'],
                                explanation:
                                    'Prometheus опрашивает цели по Pull-модели в текстовом формате, а при рестарте процесса Counter сбрасывается в 0 (что корректно обрабатывается функцией rate()).',
                            },
                        },
                        {
                            id: 'obs-l3-s5',
                            title: 'Тренажёр: проверка конфигурации Prometheus через promtool и запрос к API',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'terminal',
                                    terminal: {
                                        prompt: 'sre@monitoring:~$',
                                        task: 'Проверьте синтаксис главного файла конфигурации prometheus.yml утилитой promtool check config, проверьте правила алертов в alerts.yml через promtool check rules и проверьте статус целевых инстансов (targets) через HTTP API Prometheus (/api/v1/targets) с помощью curl.',
                                        commands: [
                                            {
                                                instruction: 'Шаг 1: Проверьте конфигурацию prometheus.yml командой promtool check config prometheus.yml',
                                                acceptedPatterns: ['^promtool\\s+check\\s+config\\s+prometheus\\.ya?ml$'],
                                                output: 'Checking prometheus.yml\n  SUCCESS: 1 rule files found\n SUCCESS: prometheus.yml is valid prometheus config file syntax',
                                            },
                                            {
                                                instruction: 'Шаг 2: Проверьте правила алертов в alerts.yml командой promtool check rules alerts.yml',
                                                acceptedPatterns: ['^promtool\\s+check\\s+rules\\s+alerts\\.ya?ml$'],
                                                output: 'Checking alerts.yml\n  SUCCESS: 4 rules found',
                                            },
                                            {
                                                instruction: 'Шаг 3: Запросите список targets через curl к http://localhost:9090/api/v1/targets',
                                                acceptedPatterns: [
                                                    '^curl\\s+(-s\\s+)?http://localhost:9090/api/v1/targets$',
                                                ],
                                                output: '{"status":"success","data":{"activeTargets":[{"health":"up","labels":{"job":"node"}}]}}',
                                            },
                                        ],
                                        solution: 'promtool check config prometheus.yml\npromtool check rules alerts.yml\ncurl -s http://localhost:9090/api/v1/targets',
                                        hint: 'Используйте promtool check config prometheus.yml, promtool check rules alerts.yml и curl -s http://localhost:9090/api/v1/targets.',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'obs-m2',
            title: 'PromQL, Alertmanager и Grafana',
            lessons: [
                {
                    id: 'obs-l4',
                    title: 'Язык запросов PromQL: Instant vs Range Vector, rate и гистограммы',
                    minutes: 35,
                    steps: [
                        {
                            id: 'obs-l4-s1',
                            title: 'Instant Vector vs Range Vector: зачем нужны квадратные скобки [5m]',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В PromQL есть два ключевых типа выборок: **Instant Vector** (мгновенное значение каждого временного ряда в одну точку времени) и **Range Vector** (массив всех точек ряда за интервал времени, например `[5m]`). Функции скорости вроде `rate()` принимают на вход **только Range Vector**!',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Синтаксис селекторов в PromQL',
                                    code: '# 1. Instant Vector — последнее известное значение:\nhttp_requests_total{job="api", status=~"5..", handler!="/health"}\n# Операторы меток: = (равно), != (не равно), =~ (regex), !~ (не regex)\n\n# 2. Range Vector — все сэмплы за последние 5 минут:\nhttp_requests_total{job="api"}[5m]\n\n# 3. Скорость запросов в секунду (RPS) за 5 минут:\nrate(http_requests_total{job="api"}[5m])',
                                },
                                {
                                    type: 'note',
                                    text: 'Правило выбора интервала в `rate(...[interval])`: окно должно быть минимум в **4 раза больше `scrape_interval`**. Если Prometheus собирает метрики каждые 15 секунд (`15s`), минимальное безопасное окно — `[1m]`, а промышленный стандарт для графиков и алертов — `[5m]` (чтобы не потерять данные при одном пропущенном скрейпе).',
                                },
                            ],
                        },
                        {
                            id: 'obs-l4-s2',
                            title: 'Агрегация (sum, avg, topk) и расчёт перцентилей (histogram_quantile)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В кластере работают 20 подов сервиса, и каждый отдаёт свои ряды. Чтобы сложить RPS по всему сервису или в разрезе эндпоинтов, используют операторы агрегации с модификаторами `by (...)` (оставить указанные метки) или `without (...)` (убрать указанные метки, например `instance` и `pod`).',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Боевые запросы PromQL для RED-метрик',
                                    code: '# 1. Rate: суммарный RPS по каждому эндпоинту (handler)\nsum by (handler) (rate(http_requests_total{job="checkout"}[5m]))\n\n# 2. Errors: доля 5xx-ошибок в процентах (Error Rate %)\n100 * (\n  sum(rate(http_requests_total{job="checkout", status=~"5.."}[5m]))\n  /\n  sum(rate(http_requests_total{job="checkout"}[5m]))\n)\n\n# 3. Duration: 99-й перцентиль задержки (p99) из гистограммы!\nhistogram_quantile(\n  0.99,\n  sum by (le, handler) (rate(http_request_duration_seconds_bucket{job="checkout"}[5m]))\n)',
                                },
                                {
                                    type: 'note',
                                    text: 'Критическая ошибка новичков в `histogram_quantile`: забыть сохранить метку **`le`** (upper bound корзины гистограммы) в `sum by (le, ...)`! Без метки `le` гистограмма схлопнется, и `histogram_quantile` вернёт `NaN`. Также всегда сначала применяют `rate()` к корзинам, а затем `sum by (le)` — но никогда наоборот.',
                                },
                            ],
                        },
                        {
                            id: 'obs-l4-s3',
                            title: 'rate() vs irate() vs increase()',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'table',
                                    caption: 'Три главные функции для счётчиков (Counter)',
                                    head: ['Функция', 'Что считает', 'Когда применять'],
                                    rows: [
                                        ['`rate(v[5m])`', 'Среднюю скорость прироста в секунду по всему окну `[5m]` с учётом рестартов (counter resets)', 'Для алертов, SLO и плавных графиков на длинных интервалах'],
                                        ['`irate(v[5m])`', 'Мгновенную скорость только по **двум последним точкам** внутри окна `[5m]`', 'Для отладки резких пиков на дашбордах в реальном времени (нельзя для алертов — слишком шумная)'],
                                        ['`increase(v[1h])`', 'Абсолютный прирост счётчика за указанный интервал (`rate * секунды`)', 'Сколько всего ошибок или заказов произошло за последний час или сутки'],
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l4-s4',
                            title: 'Проверь себя: функции PromQL',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте конструкцию PromQL и её назначение',
                                pairs: [
                                    { left: 'rate(http_requests_total[5m])', right: 'Среднее количество запросов в секунду за последние 5 минут' },
                                    { left: 'histogram_quantile(0.95, sum by (le) (...))', right: 'Расчёт 95-го перцентиля задержки по корзинам гистограммы' },
                                    { left: 'sum by (handler) (...)', right: 'Суммирование временных рядов с сохранением только метки handler' },
                                    { left: 'increase(orders_created_total[24h])', right: 'Общее количество созданных заказов за последние 24 часа' },
                                ],
                                explanation:
                                    'rate() даёт скорость в секунду, increase() — общий прирост за период, sum by (...) группирует ряды по нужным меткам, а histogram_quantile с обязательной меткой le вычисляет перцентили.',
                            },
                        },
                        {
                            id: 'obs-l4-s5',
                            title: 'Проверь себя: ошибки в PromQL',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Почему запрос `histogram_quantile(0.99, sum by (handler) (rate(http_request_duration_seconds_bucket[5m])))` вернёт `NaN`?',
                                options: [
                                    { id: 'a', text: 'Потому что в sum by (...) забыли включить обязательную метку границ корзин `le`' },
                                    { id: 'b', text: 'Потому что 0.99 нужно передавать как 99' },
                                    { id: 'c', text: 'Потому что rate() нельзя применять к гистограммам' },
                                    { id: 'd', text: 'Потому что окно [5m] слишком маленькое' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'Метка `le` (less than or equal) задаёт верхнюю границу каждой корзины гистограммы. При агрегации через `sum by (...)` её обязательно нужно оставлять: `sum by (le, handler)`.',
                            },
                        },
                        {
                            id: 'obs-l4-s6',
                            title: 'Код: напишите PromQL-запрос для расчёта RPS 5xx-ошибок',
                            type: 'quiz',
                            quiz: {
                                kind: 'code',
                                question: 'Напишите запрос на PromQL, который считает суммарный RPS (`sum` + `rate` за `[5m]`) для метрики `http_requests_total` с фильтром статуса по регулярному выражению `status=~"5.."`.',
                                starterCode: 'sum(rate(',
                                mustInclude: [
                                    { pattern: 'sum\\s*\\(\\s*rate\\s*\\(', message: 'Оберните rate(...) в функцию агрегации sum(...)' },
                                    { pattern: 'http_requests_total', message: 'Укажите метрику http_requests_total' },
                                    { pattern: 'status=~"5\\.\\."', message: 'Отфильтруйте серверные ошибки: status=~"5.."' },
                                    { pattern: '\\[5m\\]', message: 'Укажите диапазон времени [5m]' },
                                ],
                                explanation: 'sum(rate(http_requests_total{status=~"5.."}[5m]))',
                            },
                        },
                    ],
                },
                {
                    id: 'obs-l5',
                    title: 'Алертинг без шума: Alertmanager, маршрутизация и Burn Rate',
                    minutes: 30,
                    steps: [
                        {
                            id: 'obs-l5-s1',
                            title: 'Почему классические алерты «CPU > 80%» вызывают Alert Fatigue',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Когда на дежурного инженера каждую ночь сыплются десятки алертов «CPU вырос до 85%» или «Диск заполнен на 76%», хотя пользователи не испытывают никаких проблем, наступает **Alert Fatigue (усталость от алертов)** — инженеры начинают игнорировать уведомления и пропускают реальную аварию. Главный принцип SRE (Роб Эвасчук): **алертить нужно на симптомы, которые влияют на пользователей (SLO), а не на внутренние причины**.',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Путь алерта: от оценки PromQL-правила до группировки и отправки в Alertmanager',
                                    code: 'graph LR\n  Prom["Prometheus<br/>Rule Evaluation"] -->|"Pending (for: 5m)"| Firing["Firing Alert"]\n  Firing --> AM["Alertmanager"]\n  AM --> Group["1. Grouping<br/>(группировка 50 подов в 1 тикет)"]\n  AM --> Inhibit["2. Inhibition<br/>(подавить шум при падении ДЦ)"]\n  AM --> Silence["3. Silences<br/>(окно плановых работ)"]\n  Group --> Receivers["Telegram / Slack / PagerDuty"]',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Правило алерта в Prometheus (alerts.yml)',
                                    code: 'groups:\n  - name: checkout-slo\n    rules:\n      - alert: HighCheckoutErrorRate\n        expr: |\n          sum(rate(http_requests_total{job="checkout", status=~"5.."}[5m]))\n          /\n          sum(rate(http_requests_total{job="checkout"}[5m])) > 0.02\n        for: 5m\n        labels:\n          severity: critical\n          team: payments\n        annotations:\n          summary: "Высокий уровень 5xx в сервисе checkout ({{ $value | humanizePercentage }})"\n          runbook_url: "https://wiki.example.com/runbooks/checkout-5xx"',
                                },
                            ],
                        },
                        {
                            id: 'obs-l5-s2',
                            title: 'Три суперсилы Alertmanager: Grouping, Inhibition и Silences',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'list',
                                    items: [
                                        '**Grouping (`group_by`):** если в кластере упал сетевой свитч и 40 микросервисов одновременно перестали отвечать, Alertmanager сгруппирует их по меткам `["cluster", "alertname"]` и пришлёт **одно** сводное сообщение вместо 40 ночных звонков.',
                                        '**Inhibition (Ингибирование / Подавление):** если сработал критический алерт высокого уровня (`severity="critical"`, например `ClusterDown` или `PostgresPrimaryDown`), Alertmanager автоматически подавляет более мелкие предупреждения (`severity="warning"`, например `HighApiLatency`) от этого же кластера.',
                                        '**Silences (Заглушки):** временное отключение уведомлений по набору меток (`env="staging"` или `instance="db-02"`) на время планового обслуживания или миграции БД.',
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l5-s3',
                            title: 'Multi-Window Multi-Burn-Rate алерты по SLO',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'В Google SRE используют **Burn Rate (скорость сжигания бюджета ошибок)**. Если наш `SLO = 99.9%` (бюджет ошибок = `0.1%` в месяц), то при текущем уровне ошибок `0.1%` мы сожжём весь месячный бюджет ровно за 30 дней (`burn_rate = 1`). Если уровень ошибок подскочил до `1.44%`, бюджет сгорит в **14.4 раза быстрее** (всего за 2 дня) — такой алерт сразу будит дежурного (`page`), а медленное сжигание (`burn_rate = 3`) создаёт обычный тикет.',
                                },
                            ],
                        },
                        {
                            id: 'obs-l5-s4',
                            title: 'Проверь себя: механизмы Alertmanager',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте механизм Alertmanager или Prometheus и его роль',
                                pairs: [
                                    { left: 'for: 5m (в правиле Prometheus)', right: 'Защита от кратковременных всплесков: алерт станет Firing только если условие держится 5 минут подряд' },
                                    { left: 'Grouping (group_by)', right: 'Объединение десятков однотипных алертов в одно компактное уведомление' },
                                    { left: 'Inhibition (inhibit_rules)', right: 'Автоматическое подавление второстепенных предупреждений при срабатывании критического корневого алерта' },
                                    { left: 'Silences', right: 'Временное отключение алертов по меткам на период плановых технических работ' },
                                ],
                                explanation:
                                    'for: 5m отсекает разовые скачки, Grouping склеивает шторм алертов, Inhibition прячет симптомы при известной первопричине, а Silences глушит уведомления на время maintenance.',
                            },
                        },
                        {
                            id: 'obs-l5-s5',
                            title: 'Проверь себя: хороший алерт в продакшене',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие характеристики отличают качественный алерт в продакшене?',
                                options: [
                                    { id: 'a', text: 'Срабатывает на симптом, угрожающий SLO/пользователям, и требует конкретного действия от дежурного' },
                                    { id: 'b', text: 'Содержит ссылку на Runbook (инструкцию по диагностике и восстановлению)' },
                                    { id: 'c', text: 'Будит инженера в 3 часа ночи при каждом кратковременном скачке CPU на 10 секунд' },
                                    { id: 'd', text: 'Использует параметр `for` для фильтрации однократных сетевых флапов' },
                                ],
                                correct: ['a', 'b', 'd'],
                                explanation:
                                    'Каждый ночной алерт должен быть actionable (требовать реакции), содержать runbook и не срабатывать на мгновенные безопасные всплески.',
                            },
                        },
                    ],
                },
                {
                    id: 'obs-l6',
                    title: 'Проектирование дашбордов в Grafana: Variables, Recording Rules и антипаттерны',
                    minutes: 25,
                    steps: [
                        {
                            id: 'obs-l6-s1',
                            title: 'Как строить читаемые дашборды (иерархия сверху вниз)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Плохой дашборд — это «стена из 60 разноцветных графиков вперемешку», на которой во время аварии невозможно ничего найти. Хороший дашборд проектируется сверху вниз по принципу **от общего к частному**:',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Верхний ряд (Overview / SLO):** крупные индикаторы (`Stat` / `Gauge`) состояния системы в целом — текущий Availability %, Error Budget, суммарный RPS и p99.',
                                        '**Второй ряд (RED-метрики по сервисам):** 3 графика рядом — Rate, Errors, Duration с разбивкой по эндпоинтам.',
                                        '**Нижние ряды (USE / Детализация ресурсов и зависимостей):** пулы соединений PostgreSQL, попадания в кэш Redis, lag в Kafka, CPU/RAM подов.',
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l6-s2',
                            title: 'Template Variables (`$__rate_interval`) и Recording Rules',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Чтобы не плодить 50 копий одного дашборда для каждого окружения и сервиса, в Grafana используют **Variables** (`$env`, `$service`, `$pod`) и встроенную переменную **`$__rate_interval`** (она автоматически подбирает окно для `rate()` в зависимости от масштаба зума на графике и `scrape_interval`).',
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Recording Rules в Prometheus: предрасчёт тяжёлых запросов',
                                    code: '# Если дашборд открывают 50 человек и каждый запрос считает rate() по 10 000 рядов,\n# тяжёлые выражения выносят в Recording Rules (правила записи):\ngroups:\n  - name: api-recording-rules\n    interval: 30s\n    rules:\n      - record: job:http_requests:rate5m\n        expr: sum by (job, handler) (rate(http_requests_total[5m]))',
                                },
                                {
                                    type: 'note',
                                    text: 'По соглашению именования Prometheus имя Recording Rule строится по схеме `level:metric:operations` (например, `job:http_requests:rate5m`). Теперь Grafana запрашивает уже готовый агрегированный ряд за доли миллисекунды!',
                                },
                            ],
                        },
                        {
                            id: 'obs-l6-s3',
                            title: 'Проверь себя: Recording Rules и переменные Grafana',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Зачем в Prometheus настраивают Recording Rules (правила записи)?',
                                options: [
                                    { id: 'a', text: 'Для отправки SMS-сообщений дежурному' },
                                    { id: 'b', text: 'Для периодического предрасчёта тяжёлых PromQL-выражений и сохранения результата в новый компактный временной ряд, чтобы дашборды и алерты работали мгновенно' },
                                    { id: 'c', text: 'Для сжатия Docker-образов' },
                                    { id: 'd', text: 'Для удаления старых логов из Loki' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Recording Rules вычисляют сложные агрегации в фоне по расписанию и записывают готовый временной ряд в TSDB, разгружая Prometheus при открытии тяжёлых дашбордов.',
                            },
                        },
                        {
                            id: 'obs-l6-s4',
                            title: 'Проверь себя: правила хорошего дашборда',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие практики делают дашборд в Grafana эффективным при инциденте?',
                                options: [
                                    { id: 'a', text: 'Использование переменных ($env, $service) и $__rate_interval вместо жёстко зашитых имён серверов' },
                                    { id: 'b', text: 'Единые единицы измерения (секунды, байты, проценты) и осмысленные пороги (Thresholds: зелёный/жёлтый/красный)' },
                                    { id: 'c', text: 'Размещение 80 графиков с разными шкалами на одном экране без группировки' },
                                    { id: 'd', text: 'Размещение ключевых RED/SLO показателей в самом верхнем ряду дашборда' },
                                ],
                                correct: ['a', 'b', 'd'],
                                explanation:
                                    'Иерархия от общего к частному, шаблонные переменные и единые шкалы позволяют оценить масштаб сбоя за первые 10 секунд.',
                            },
                        },
                        {
                            id: 'obs-l6-s5',
                            title: 'Практика в Python: расчёт окна $__rate_interval в Grafana',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Grafana вычисляет `$__rate_interval` по формуле `max(scrape_interval * 4, step)`. Если `scrape_interval = 15` секунд, а шаг графика при крупном зуме `step = 10` секунд, чему будет равен `$__rate_interval` в секундах?',
                                },
                                {
                                    type: 'python',
                                    python: {
                                        starterCode:
                                            'scrape_interval_sec = 15\ngrafana_step_sec = 10\n\n# Вычислите rate_interval_sec = max(scrape_interval_sec * 4, grafana_step_sec)\nrate_interval_sec = None  # TODO\n\nprint(rate_interval_sec)\n',
                                        task: 'Вычислите значение `rate_interval_sec` по формуле `max(scrape_interval_sec * 4, grafana_step_sec)` и выведите его.',
                                        solution:
                                            'scrape_interval_sec = 15\ngrafana_step_sec = 10\n\nrate_interval_sec = max(scrape_interval_sec * 4, grafana_step_sec)\nprint(rate_interval_sec)',
                                        expected: { type: 'stdout', value: '60' },
                                        hint: 'max(15 * 4, 10) = 60 секунд.',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'obs-m3',
            title: 'Grafana Loki, LogQL и OpenTelemetry трейсинг',
            lessons: [
                {
                    id: 'obs-l7',
                    title: 'Grafana Loki и язык запросов LogQL: индексация без переплаты за полнотекст',
                    minutes: 30,
                    steps: [
                        {
                            id: 'obs-l7-s1',
                            title: 'Чем Grafana Loki отличается от Elasticsearch / OpenSearch',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Классические поисковые движки вроде Elasticsearch индексируют **каждое слово** внутри текста каждого лога (обратный индекс). На больших объёмах логов (терабайты в сутки) такой индекс стоит дороже самих логов и требует огромных кластеров с кучей RAM. **Grafana Loki** («Prometheus, но для логов») работает иначе: он индексирует **только компактные метки (Labels)** потока (`{namespace="prod", app="checkout"}`), а сами строки логов сжимает чанками и складывает в дешёвое объектное хранилище (S3 / MinIO).',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Пайплайн сбора логов в Loki: от пода до запроса LogQL',
                                    code: 'graph LR\n  App["Приложение<br/>(JSON в stdout)"] --> Agent["Агент сбора<br/>(Promtail / Grafana Alloy)"]\n  Agent -->|"Push + Labels"| Dist["Loki Distributor & Ingester"]\n  Dist --> Index["Малый индекс меток"]\n  Dist --> S3[("S3 / MinIO<br/>Сжатые чанки логов")]\n  Grafana["Grafana (LogQL)"] --> Dist',
                                },
                                {
                                    type: 'note',
                                    text: 'Золотое правило меток Loki: в labels отправляйте только метаданные с **низкой кардинальностью** (`env`, `cluster`, `namespace`, `app`, `level`). Никогда не делайте `trace_id`, `user_id` или IP клиента меткой потока — их ищут фильтрами внутри текста лога!',
                                },
                            ],
                        },
                        {
                            id: 'obs-l7-s2',
                            title: 'Конвейер LogQL: Stream Selector → Line Filter → Parser → Metric Query',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Запрос в **LogQL** строится как конвейер слева направо. Сначала мы сужаем поток по меткам, затем отсекаем лишние строки быстрым текстовым фильтром (до парсинга JSON!), затем парсим поля и при необходимости превращаем логи в метрику:',
                                },
                                {
                                    type: 'code',
                                    lang: 'text',
                                    caption: 'Примеры запросов на LogQL (Log Queries и Metric Queries)',
                                    code: '# 1. Выбор потока (Stream Selector) + быстрый текстовый фильтр (Line Filter):\n{namespace="prod", app="checkout"} |= "error" != "timeout" |~ "status=(500|502|503)"\n# Операторы фильтров: |= (содержит), != (не содержит), |~ (regex), !~ (не regex)\n\n# 2. Парсинг JSON-логов и фильтрация по распарсенным полям:\n{app="checkout"} |= "payment" | json | status_code >= 500 | duration_ms > 1000\n\n# 3. Metric Query: превращаем поток ошибок в график RPS ошибок по сервисам!\nsum by (app) (rate({namespace="prod"} |= "ERROR" [5m]))',
                                },
                                {
                                    type: 'table',
                                    caption: 'Порядок этапов в LogQL-пайплайне (для максимальной скорости)',
                                    head: ['Этап', 'Пример', 'Зачем на этом месте'],
                                    rows: [
                                        ['1. Stream Selector', `{app="api", env="prod"}`, 'Выбирает нужные чанки из S3 по индексу меток'],
                                        ['2. Line Filter', `|= "500" != "healthcheck"`, 'Отбрасывает 99% строк простым поиском подстроки до дорогого парсинга'],
                                        ['3. Parser (`json` / `logfmt` / `regexp`)', `| json`, 'Превращает поля JSON в временные метки для фильтрации'],
                                        ['4. Label Filter', `| latency > 0.5`, 'Фильтрует по числовым и строковым полям после парсинга'],
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l7-s3',
                            title: 'Проверь себя: архитектура Loki и порядок LogQL',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Расставьте элементы оптимального LogQL-запроса слева направо (от самого быстрого отсечения данных к более тяжёлому)',
                                items: [
                                    'Stream Selector: {namespace="prod", app="billing"}',
                                    'Line Filter: |= "payment_failed"',
                                    'Parser: | json',
                                    'Label Filter: | amount > 10000',
                                ],
                                correct: [
                                    'Stream Selector: {namespace="prod", app="billing"}',
                                    'Line Filter: |= "payment_failed"',
                                    'Parser: | json',
                                    'Label Filter: | amount > 10000',
                                ],
                                explanation:
                                    'Сначала выбираем поток по индексу меток, затем отсекаем ненужные строки простым текстовым фильтром |= (до парсинга JSON!), затем парсим JSON и фильтруем по конкретным полям.',
                            },
                        },
                        {
                            id: 'obs-l7-s4',
                            title: 'Проверь себя: Loki vs Elasticsearch',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'За счёт чего Grafana Loki потребляет значительно меньше памяти и дискового пространства под индексы по сравнению с Elasticsearch?',
                                options: [
                                    { id: 'a', text: 'Loki хранит логи только за последние 5 минут и удаляет остальные' },
                                    { id: 'b', text: 'Loki индексирует только метки потоков (labels), а не каждое слово в тексте логов, храня сжатые чанки в S3' },
                                    { id: 'c', text: 'Loki работает только с бинарными базами данных PostgreSQL' },
                                    { id: 'd', text: 'Loki не поддерживает поиск по регулярным выражениям' },
                                ],
                                correct: ['b'],
                                explanation:
                                    'Отсутствие полнотекстового индекса по содержимому сообщений делает индекс Loki крошечным, а сжатые чанки дёшево лежат в S3.',
                            },
                        },
                        {
                            id: 'obs-l7-s5',
                            title: 'Тренажёр: поиск ошибок в логах через LogQL CLI (logcli)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'terminal',
                                    terminal: {
                                        prompt: 'sre@loki-tools:~$',
                                        task: 'Проверьте список доступных меток в Loki утилитой logcli labels, посмотрите значения метки app (logcli labels app) и выполните запрос ошибок сервиса checkout с помощью logcli query \'{app="checkout"} |= "ERROR"\'.',
                                        commands: [
                                            {
                                                instruction: 'Шаг 1: Выведите список всех меток (labels) в Loki командой logcli labels',
                                                acceptedPatterns: ['^logcli\\s+labels$'],
                                                output: 'app\ncluster\nenv\nlevel\nnamespace',
                                            },
                                            {
                                                instruction: 'Шаг 2: Посмотрите все значения метки app командой logcli labels app',
                                                acceptedPatterns: ['^logcli\\s+labels\\s+app$'],
                                                output: 'auth\ncheckout\nnotifications\norders',
                                            },
                                            {
                                                instruction: 'Шаг 3: Найдите строки с ERROR в логах checkout через logcli query \'{app="checkout"} |= "ERROR"\'',
                                                acceptedPatterns: [
                                                    '^logcli\\s+query\\s+[\'"]\\{app="checkout"\\}\\s*\\|=\\s*"ERROR"[\'"]$',
                                                ],
                                                output: '2026-11-19T22:10:04Z {app="checkout"} level=ERROR trace_id=9f8a1b2c msg="payment gateway timeout"',
                                            },
                                        ],
                                        solution: 'logcli labels\nlogcli labels app\nlogcli query \'{app="checkout"} |= "ERROR"\'',
                                        hint: 'Используйте logcli labels, затем logcli labels app и logcli query \'{app="checkout"} |= "ERROR"\'.',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'obs-l8',
                    title: 'OpenTelemetry (OTel): распределённый трейсинг, спаны и семплирование',
                    minutes: 35,
                    steps: [
                        {
                            id: 'obs-l8-s1',
                            title: 'Как устроен распределённый трейсинг: Trace, Span и Context Propagation',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Когда один клик пользователя «Оплатить заказ» вызывает 8 микросервисов, 3 базы данных и 2 брокера сообщений, обычные логи превращаются в кашу. **OpenTelemetry (OTel)** — единый открытый стандарт CNCF для сбора трейсов, метрик и логов без привязки к конкретному вендору (Jaeger, Grafana Tempo, Datadog).',
                                },
                                {
                                    type: 'mermaid',
                                    caption: 'Waterfall-диаграмма трейса: Trace ID объединяет дерево вложенных Span-ов',
                                    code: 'sequenceDiagram\n  participant GW as API Gateway (Root Span)\n  participant Ord as Order Service (Child Span)\n  participant DB as PostgreSQL (DB Span)\n  participant Pay as Payment API (External Span)\n\n  GW->>Ord: HTTP + Header traceparent: 00-4bf92f35...-01\n  Ord->>DB: SELECT * FROM orders (12 мс)\n  Ord->>Pay: POST /charge (380 мс — узкое место!)\n  Pay-->>Ord: 200 OK\n  Ord-->>GW: 200 OK (общая длительность: 410 мс)',
                                },
                                {
                                    type: 'list',
                                    items: [
                                        '**Trace (Трейс):** весь сквозной путь одного запроса от начала до конца с единым 128-битным **`Trace ID`**.',
                                        '**Span (Спан):** отдельная операция внутри трейса (HTTP-вызов, SQL-запрос, публикация в Kafka). Имеет свой `Span ID`, `Parent Span ID`, время старта/окончания, теги (`Attributes`) и статус (`OK` / `ERROR`).',
                                        '**Context Propagation (W3C Trace Context):** передача `Trace ID` и `Parent Span ID` между сервисами по сети через стандартный HTTP-заголовок **`traceparent`** (или заголовки сообщений в Kafka/RabbitMQ).',
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'obs-l8-s2',
                            title: 'OpenTelemetry Collector и семплирование (Head vs Tail Sampling)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'При нагрузке **20 000 RPS** сохранять 100% успешных трейсов на диск слишком дорого. Поэтому в **OpenTelemetry Collector** настраивают **Sampling (семплирование)** — отбор части трейсов для сохранения:',
                                },
                                {
                                    type: 'table',
                                    caption: 'Head-based vs Tail-based Sampling',
                                    head: ['Стратегия', 'Когда принимается решение', 'Плюсы и минусы'],
                                    rows: [
                                        ['**Head-based Sampling**', 'В самом начале запроса (на API Gateway) бросается монетка, например, сохраняем 5% всех трейсов', 'Очень дёшево (не тратим память на 95% запросов), но **можем потерять редкие ошибки** (500-е), не попавшие в 5%'],
                                        ['**Tail-based Sampling**', 'В конце запроса, когда OTel Collector собрал все спаны трейса: сохраняем **100% трейсов с ошибками или p99 > 1с**, и только 1% обычных быстрых `200 OK`', '**Идеально для продакшена**: не теряем ни одной аварии, но требует больше RAM в OTel Collector и маршрутизации всех спанов одного `Trace ID` на один инстанс коллектора'],
                                    ],
                                },
                                {
                                    type: 'code',
                                    lang: 'yaml',
                                    caption: 'Конфигурация OpenTelemetry Collector (otel-collector-config.yaml)',
                                    code: 'receivers:\n  otlp:\n    protocols:\n      grpc:\n        endpoint: 0.0.0.0:4317\n      http:\n        endpoint: 0.0.0.0:4318\n\nprocessors:\n  batch:\n    timeout: 1s\n  tail_sampling:\n    decision_wait: 10s\n    policies:\n      - name: errors-policy\n        type: status_code\n        status_code: { status_codes: [ERROR] }\n      - name: slow-traces-policy\n        type: latency\n        latency: { threshold_ms: 1000 }\n      - name: probabilistic-1pct\n        type: probabilistic\n        probabilistic: { sampling_percentage: 1 }\n\nexporters:\n  otlp/tempo:\n    endpoint: tempo:4317\n\nservice:\n  pipelines:\n    traces:\n      receivers: [otlp]\n      processors: [tail_sampling, batch]\n      exporters: [otlp/tempo]',
                                },
                            ],
                        },
                        {
                            id: 'obs-l8-s3',
                            title: 'Exemplars: переход в 1 клик с графика Prometheus на конкретный трейс',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: '**Exemplars (экземпляры)** — мостик между метриками и трейсами в Grafana. Когда приложение записывает гистограмму задержки, оно прикрепляет к конкретной точке графика ссылку на `trace_id` запроса, который попал в этот пик. На графике p99 появляется точка — клик по ней сразу открывает полный водопад спанов в Grafana Tempo или Jaeger!',
                                },
                            ],
                        },
                        {
                            id: 'obs-l8-s4',
                            title: 'Проверь себя: понятия OpenTelemetry',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте элемент OpenTelemetry и его функцию',
                                pairs: [
                                    { left: 'traceparent (W3C Trace Context)', right: 'Стандартный HTTP-заголовок для передачи Trace ID и Span ID между микросервисами' },
                                    { left: 'Span', right: 'Отдельная именованная операция внутри трейса (SQL-запрос, HTTP-вызов) со своей длительностью' },
                                    { left: 'Tail-based Sampling', right: 'Отбор трейсов после их завершения: сохраняем 100% ошибок и медленных запросов, но только 1% обычных' },
                                    { left: 'Exemplars', right: 'Привязка конкретного trace_id к точке на графике метрик Prometheus для перехода в 1 клик' },
                                ],
                                explanation:
                                    'traceparent связывает сервисы по сети, Span измеряет конкретный шаг, Tail Sampling экономит место без потери аварий, а Exemplars соединяют графики с трейсами.',
                            },
                        },
                        {
                            id: 'obs-l8-s5',
                            title: 'Проверь себя: порт OTLP gRPC и преимущества OTel Collector',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие задачи решает вынесенный OpenTelemetry Collector в инфраструктуре?',
                                options: [
                                    { id: 'a', text: 'Принимает телеметрию по стандартному протоколу OTLP (gRPC :4317 / HTTP :4318) и разгружает приложения от логики ретраев и батчинга' },
                                    { id: 'b', text: 'Позволяет менять бэкенд хранения (например, перейти с Jaeger на Grafana Tempo) без переписывания кода микросервисов' },
                                    { id: 'c', text: 'Выполняет централизованную очистку персональных данных (PII) и Tail-based Sampling' },
                                    { id: 'd', text: 'Заменяет собой балансировщик Nginx и базу данных PostgreSQL' },
                                ],
                                correct: ['a', 'b', 'c'],
                                explanation:
                                    'OTel Collector выступает единым шлюзом телеметрии: буферизует батчи, маскирует чувствительные данные, семплирует трейсы и маршрутизирует их в нужные хранилища.',
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'obs-m4',
            title: 'Практикум',
            lessons: [
                {
                    id: 'obs-l9',
                    title: 'Практика: Prometheus, PromQL, Alertmanager, Loki и OpenTelemetry',
                    minutes: 35,
                    steps: [
                        {
                            id: 'obs-l9-s1',
                            title: 'Выбор типа метрики Prometheus',
                            type: 'quiz',
                            quiz: {
                                kind: 'single',
                                question: 'Вы инструментируете бэкенд-сервис. Какой тип метрики Prometheus нужно выбрать для подсчёта общего количества обработанных HTTP-запросов (`http_requests_total`)?',
                                options: [
                                    { id: 'a', text: 'Counter (монотонно растущий счётчик)' },
                                    { id: 'b', text: 'Gauge (измеритель текущего состояния)' },
                                    { id: 'c', text: 'Annotation' },
                                    { id: 'd', text: 'Silence' },
                                ],
                                correct: ['a'],
                                explanation:
                                    'Количество запросов за всё время работы процесса только увеличивается (или сбрасывается в 0 при рестарте), поэтому используется Counter.',
                            },
                        },
                        {
                            id: 'obs-l9-s2',
                            title: 'Порядок расследования инцидента по трём столпам',
                            type: 'quiz',
                            quiz: {
                                kind: 'sorting',
                                question: 'Расставьте шаги локализации сбоя в продакшене от первого сигнала до точечной причины в коде',
                                items: [
                                    'Получение сгруппированного уведомления от Alertmanager о нарушении SLO (рост 5xx / p99)',
                                    'Анализ RED-графиков на дашборде Grafana для определения затронутого сервиса и времени начала деградации',
                                    'Переход по Exemplar или фильтрация в Tempo/Jaeger для поиска самого медленного или упавшего Span и копирования Trace ID',
                                    'Поиск детального стектрейса в Grafana Loki по скопированному Trace ID',
                                ],
                                correct: [
                                    'Получение сгруппированного уведомления от Alertmanager о нарушении SLO (рост 5xx / p99)',
                                    'Анализ RED-графиков на дашборде Grafana для определения затронутого сервиса и времени начала деградации',
                                    'Переход по Exemplar или фильтрация в Tempo/Jaeger для поиска самого медленного или упавшего Span и копирования Trace ID',
                                    'Поиск детального стектрейса в Grafana Loki по скопированному Trace ID',
                                ],
                                explanation:
                                    'Алерт → метрики (когда и где) → трейс (в каком спане) → логи по Trace ID (точный стектрейс ошибки).',
                            },
                        },
                        {
                            id: 'obs-l9-s3',
                            title: 'Стандартный порт OTLP gRPC',
                            type: 'quiz',
                            quiz: {
                                kind: 'number',
                                question: 'На каком стандартном TCP-порту по умолчанию принимает данные по протоколу gRPC приёмник `otlp` в OpenTelemetry Collector?',
                                correct: 4317,
                                explanation:
                                    'Порт 4317 — официальный стандарт для OTLP over gRPC, а порт 4318 — для OTLP over HTTP.',
                            },
                        },
                        {
                            id: 'obs-l9-s4',
                            title: 'Формула расчёта перцентиля в PromQL',
                            type: 'quiz',
                            quiz: {
                                kind: 'cloze',
                                question: 'Допишите корректный PromQL-запрос для вычисления 95-го перцентиля времени ответа HTTP-запросов, не забыв сохранить обязательную метку корзин гистограммы:',
                                text: '____(0.95, sum by (____) (rate(http_request_duration_seconds_bucket[5m])))',
                                blanks: [
                                    { accepted: ['histogram_quantile'], hint: 'функция расчёта квантиля по гистограмме' },
                                    { accepted: ['le'], hint: 'метка верхней границы корзины (less or equal)' },
                                ],
                                explanation:
                                    'histogram_quantile(0.95, sum by (le) (rate(..._bucket[5m]))) — каноническая формула расчёта перцентилей в Prometheus.',
                            },
                        },
                        {
                            id: 'obs-l9-s5',
                            title: 'Методологии и инструменты стека Observability',
                            type: 'quiz',
                            quiz: {
                                kind: 'matching',
                                question: 'Сопоставьте термин или компонент и его описание',
                                pairs: [
                                    { left: 'RED Method', right: 'Rate, Errors, Duration — три ключевые метрики любого микросервиса' },
                                    { left: 'USE Method', right: 'Utilization, Saturation, Errors — анализ узких мест ресурсов хоста (CPU, диск, сеть)' },
                                    { left: 'Alertmanager Inhibition', right: 'Подавление вторичных предупреждений при срабатывании более критичного корневого алерта' },
                                    { left: 'Recording Rule', right: 'Предрасчёт тяжёлого PromQL-запроса по расписанию в новый компактный ряд' },
                                ],
                                explanation:
                                    'RED оценивает сервис, USE — ресурсы, Inhibition убирает каскадный шум алертов, а Recording Rules ускоряют тяжёлые дашборды.',
                            },
                        },
                        {
                            id: 'obs-l9-s6',
                            title: 'Стандартный заголовок контекста трассировки W3C',
                            type: 'quiz',
                            quiz: {
                                kind: 'fill',
                                question: 'Как называется стандартный HTTP-заголовок спецификации W3C Trace Context (одно слово слитно), через который микросервисы передают друг другу `Trace ID` и `Parent Span ID`?',
                                accepted: ['traceparent', 'Traceparent'],
                                placeholder: 'одно слово',
                                hint: 'trace + parent',
                                explanation:
                                    'Заголовок traceparent (формата 00-<trace-id>-<parent-id>-<trace-flags>) является стандартом W3C и используется в OpenTelemetry по умолчанию.',
                            },
                        },
                        {
                            id: 'obs-l9-s7',
                            title: 'Сравнение PromQL и LogQL',
                            type: 'quiz',
                            quiz: {
                                kind: 'table',
                                question: 'Отметьте, какая конструкция относится к PromQL (метрики), а какая — к LogQL (логи в Loki)',
                                columns: ['PromQL', 'LogQL'],
                                rows: [
                                    { label: 'histogram_quantile(0.99, sum by (le) (rate(http_duration_bucket[5m])))', correct: ['PromQL'] },
                                    { label: '{namespace="prod", app="api"} |= "error" | json | status >= 500', correct: ['LogQL'] },
                                    { label: 'sum by (app) (rate({namespace="prod"} |= "panic" [5m]))', correct: ['LogQL'] },
                                    { label: 'increase(orders_paid_total[1h])', correct: ['PromQL'] },
                                ],
                                explanation:
                                    'PromQL оперирует именами метрик и корзин гистограмм, тогда как LogQL начинается со Stream Selector в фигурных скобках `{...}` и конвейера фильтров/парсеров `|=`, `| json`.',
                            },
                        },
                        {
                            id: 'obs-l9-s8',
                            title: 'Борьба с High Cardinality и шумом',
                            type: 'quiz',
                            quiz: {
                                kind: 'multiple',
                                question: 'Какие действия защищают систему мониторинга от перегрузки и ложных срабатываний?',
                                options: [
                                    { id: 'a', text: 'Не добавлять уникальные идентификаторы (user_id, order_id, request_id) в метки (labels) метрик Prometheus и потоков Loki' },
                                    { id: 'b', text: 'Использовать Tail-based Sampling в OpenTelemetry Collector для сохранения 100% ошибочных трейсов и лишь малого процента успешных' },
                                    { id: 'c', text: 'Настраивать параметр for: 5m в правилах алертов, чтобы не будить инженера при разовом скачке' },
                                    { id: 'd', text: 'Создавать отдельную метку в Prometheus для каждого IP-адреса посетителя сайта' },
                                ],
                                correct: ['a', 'b', 'c'],
                                explanation:
                                    'Ограничение кардинальности меток, умное семплирование трейсов и выдержка `for` в алертах — основа стабильного продакшн-стека Observability.',
                            },
                        },
                        {
                            id: 'obs-l9-s9',
                            title: 'Код: напишите LogQL-запрос для поиска медленных ошибок в JSON-логах',
                            type: 'quiz',
                            quiz: {
                                kind: 'code',
                                question: 'Напишите запрос на LogQL для потока `{app="payments"}`: отфильтруйте строки, содержащие `"error"` (`|= "error"`), распарсьте JSON (`| json`) и отфильтруйте записи со статусом `status >= 500`.',
                                starterCode: '{app="payments"} ',
                                mustInclude: [
                                    { pattern: '\\{app="payments"\\}', message: 'Начните со Stream Selector {app="payments"}' },
                                    { pattern: '\\|=\\s*"error"', message: 'Добавьте текстовый фильтр |= "error"' },
                                    { pattern: '\\|\\s*json', message: 'Добавьте парсер | json' },
                                    { pattern: 'status\\s*>=\\s*500', message: 'Добавьте фильтр по полю status >= 500' },
                                ],
                                explanation: '{app="payments"} |= "error" | json | status >= 500',
                            },
                        },
                        {
                            id: 'obs-l9-s10',
                            title: 'Практика в Python: расчёт Burn Rate (скорости сжигания Error Budget)',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'p',
                                    text: 'Посчитаем `burn_rate` для сервиса с `SLO = 99.9%` (допустимая доля ошибок `error_budget_ratio = 0.001`). Если за последний час реальная доля ошибок составила `actual_error_ratio = 0.012` (1.2%), во сколько раз быстрее нормы сгорает бюджет ошибок (`burn_rate = actual_error_ratio / error_budget_ratio`)?',
                                },
                                {
                                    type: 'python',
                                    python: {
                                        starterCode:
                                            'error_budget_ratio = 0.001   # для SLO 99.9%\nactual_error_ratio = 0.012   # 1.2% ошибок за последний час\n\n# Вычислите burn_rate = actual_error_ratio / error_budget_ratio\nburn_rate = None  # TODO\n\nprint(int(burn_rate))\n',
                                        task: 'Вычислите `burn_rate` и выведите целое число (`12`).',
                                        solution:
                                            'error_budget_ratio = 0.001\nactual_error_ratio = 0.012\n\nburn_rate = actual_error_ratio / error_budget_ratio\nprint(int(burn_rate))',
                                        expected: { type: 'stdout', value: '12' },
                                        hint: '0.012 / 0.001 = 12 (бюджет сгорит в 12 раз быстрее — за 2.5 дня вместо 30 дней).',
                                    },
                                },
                            ],
                        },
                        {
                            id: 'obs-l9-s11',
                            title: 'Тренажёр: проверка правил Prometheus и перезагрузка конфигурации без рестарта',
                            type: 'theory',
                            blocks: [
                                {
                                    type: 'terminal',
                                    terminal: {
                                        prompt: 'sre@prom-prod:~$',
                                        task: 'Проверьте новый файл правил alerts.yml утилитой promtool check rules alerts.yml, отправьте POST-запрос на эндпоинт перезагрузки Prometheus http://localhost:9090/-/reload с помощью curl -X POST и проверьте активные правила через http://localhost:9090/api/v1/rules.',
                                        commands: [
                                            {
                                                instruction: 'Шаг 1: Провалидируйте файл правил alerts.yml командой promtool check rules alerts.yml',
                                                acceptedPatterns: ['^promtool\\s+check\\s+rules\\s+alerts\\.ya?ml$'],
                                                output: 'Checking alerts.yml\n  SUCCESS: 6 rules found',
                                            },
                                            {
                                                instruction: 'Шаг 2: Перечитайте конфигурацию Prometheus без перезапуска контейнера через curl -X POST http://localhost:9090/-/reload',
                                                acceptedPatterns: [
                                                    '^curl\\s+(-s\\s+)?-X\\s+POST\\s+http://localhost:9090/-/reload$',
                                                ],
                                                output: 'Prometheus configuration reloaded successfully.',
                                            },
                                            {
                                                instruction: 'Шаг 3: Проверьте загруженные правила через curl к http://localhost:9090/api/v1/rules',
                                                acceptedPatterns: [
                                                    '^curl\\s+(-s\\s+)?http://localhost:9090/api/v1/rules$',
                                                ],
                                                output: '{"status":"success","data":{"groups":[{"name":"checkout-slo","rules":[{"name":"HighCheckoutErrorRate","state":"inactive"}]}]}}',
                                            },
                                        ],
                                        solution: 'promtool check rules alerts.yml\ncurl -X POST http://localhost:9090/-/reload\ncurl -s http://localhost:9090/api/v1/rules',
                                        hint: 'Используйте promtool check rules alerts.yml, затем curl -X POST http://localhost:9090/-/reload и curl -s http://localhost:9090/api/v1/rules.',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};