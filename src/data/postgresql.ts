import type { Course } from './types';

export const postgresqlDeepCourse: Course = {
  slug: 'postgresql-deep',
  title: 'PostgreSQL: глубоко',
  subtitle: 'MVCC, WAL, VACUUM, EXPLAIN, индексы, партиционирование, репликация, PITR и pgvector',
  description:
    'Третий курс по SQL — теперь про сам PostgreSQL. Разберём внутренности (MVCC, WAL, VACUUM, autovacuum), производительность (EXPLAIN с BUFFERS, индексы GiST/GIN/BRIN, партиционирование), JSONB и полнотекстовый поиск, расширения (pg_stat_statements, pg_trgm, pgvector), репликацию и бэкапы (PITR, pgBackRest), PgBouncer, Row-Level Security и PL/pgSQL. Практикум — комплексный экзамен.',
  level: 'Продвинутый',
  tags: ['PostgreSQL', 'SQL', 'Performance', 'Backend', 'DevOps'],
  accent: '#336791',
  icon: 'sql-advanced',
  outcomes: [
    'Объяснять MVCC и читать xmin/xmax в строках',
    'Настраивать postgresql.conf: shared_buffers, work_mem, effective_cache_size',
    'Читать EXPLAIN ANALYZE с BUFFERS и находить узкие места',
    'Выбирать правильный индекс: B-tree, GIN, GiST, BRIN, partial, covering',
    'Партиционировать большие таблицы (RANGE, LIST, HASH)',
    'Использовать JSONB с jsonpath и полнотекстовый поиск',
    'Подключать расширения: pg_stat_statements, pg_trgm, pgvector',
    'Настраивать streaming replication и PITR-бэкапы',
    'Внедрять PgBouncer и Row-Level Security',
    'Писать PL/pgSQL-функции и триггеры',
  ],
  requirements: [
    'Пройден курс «SQL: продвинуто» (или уверенный опыт с PostgreSQL)',
    'Установленный PostgreSQL 15+ локально или в Docker',
    'Понимание индексов и транзакций на базовом уровне',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Архитектура и MVCC
    // ─────────────────────────────────────────────
    {
      id: 'pg-m1',
      title: 'Архитектура и MVCC',
      lessons: [
{
  id: 'pg-l1',
  title: 'Процессы и память PostgreSQL',
  minutes: 25,
  steps: [
    {
      id: 'pg-l1-s1',
      title: 'Архитектура процессов',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'PostgreSQL использует модель «процесс на соединение» (не потоки). Один главный процесс — postmaster — принимает соединения и порождает по одному backend-процессу на каждое подключение. Плюс фоновые процессы: WAL writer, checkpointer, autovacuum launcher, background writer, stats collector.',
        },
        {
          type: 'mermaid',
          caption: 'Процессы PostgreSQL',
          code: 'graph TD\n  Client1["Клиент 1"] --> Postmaster["postmaster<br/>(слушает порт 5432)"]\n  Client2["Клиент 2"] --> Postmaster\n  Postmaster -->|"fork"| B1["backend 1"]\n  Postmaster -->|"fork"| B2["backend 2"]\n  Postmaster --> BG["Фоновые процессы"]\n  BG --> WAL["WAL writer"]\n  BG --> CP["checkpointer"]\n  BG --> AV["autovacuum launcher"]\n  BG --> BW["background writer"]\n  BG --> ST["stats collector"]',
        },
        {
          type: 'list',
          items: [
            'postmaster — родитель, слушает порт, fork новых backend',
            'backend — обслуживает одно клиентское соединение, 1 процесс = 10 MB RAM',
            'WAL writer — сбрасывает WAL на диск (fsync)',
            'checkpointer — периодически применяет грязные страницы из shared_buffers на диск',
            'background writer — сбрасывает грязные страницы постепенно, чтобы checkpointer не «залипал»',
            'autovacuum launcher — запускает autovacuum на таблицах',
          ],
        },
        {
          type: 'note',
          text: 'Почему это важно: max_connections в PostgreSQL — дорогое удовольствие. 1000 соединений = 1000 процессов × ~10 MB = 10 GB RAM только на бэкенды. Отсюда — PgBouncer (модуль 6) как обязательный компонент в проде.',
        },
      ],
    },
    {
      id: 'pg-l1-s2',
      title: 'Память: shared_buffers и work_mem',
      type: 'theory',
      blocks: [
        {
          type: 'table',
          caption: 'Главные области памяти',
          head: ['Параметр', 'Что это', 'Стартовое значение'],
          rows: [
            ['shared_buffers', 'Кэш страниц (8 KB каждая), общий для всех процессов', '25% RAM'],
            ['work_mem', 'Память на одну операцию сортировки/хэша в одном backend', '4–16 MB'],
            ['maintenance_work_mem', 'Память на VACUUM, CREATE INDEX', '64–256 MB'],
            ['effective_cache_size', 'Оценка кэша ОС (для планировщика, не выделяется)', '50–75% RAM'],
            ['wal_buffers', 'Буфер WAL, редко меняют', '16 MB'],
          ],
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Проверить текущие значения',
          code: 'SHOW shared_buffers;           -- 128MB (по умолчанию)\nSHOW work_mem;                -- 4MB\nSHOW max_connections;         -- 100\nSHOW effective_cache_size;    -- 4GB\n\n-- Все настройки\nSELECT name, setting, unit\nFROM pg_settings\nWHERE name IN (\'shared_buffers\', \'work_mem\', \'effective_cache_size\');',
        },
        {
          type: 'note',
          text: 'work_mem — самый коварный параметр. Это память на ОДНУ операцию в ОДНОМ соединении. Один запрос с 3 сортировками × 100 соединений × 64 MB work_mem = 19 GB. Отсюда OOM и падения. Ставьте 4–16 MB по умолчанию, поднимайте точечно через SET LOCAL в тяжёлых отчётах.',
        },
      ],
    },
    {
      id: 'pg-l1-s3',
      title: 'Проверь себя: почему max_connections — дорого',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Почему в PostgreSQL max_connections = 1000 — плохая идея без PgBouncer?',
        options: [
          { id: 'a', text: 'PostgreSQL не поддерживает больше 100 соединений' },
          { id: 'b', text: 'Каждое соединение — отдельный процесс ~10 MB RAM, 1000 соединений = ~10 GB только на процессы' },
          { id: 'c', text: 'max_connections нельзя менять' },
          { id: 'd', text: 'Это замедляет только SELECT' },
        ],
        correct: ['b'],
        explanation:
          'PostgreSQL — процесс-на-соединение. 1000 соединений = 1000 процессов × ~10 MB = 10+ GB RAM. Плюс каждый работает в своём адресном пространстве. PgBouncer переиспользует соединения — держит сотни клиентских, а к PG — десятки реальных.',
      },
    },
    {
      id: 'pg-l1-s4',
      title: 'pg_stat_activity: смотровое окно в процессы',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: '`pg_stat_activity` — «ps aux для PostgreSQL». Одна строка на каждый backend-процесс. Ключевые колонки: `pid`, `usename`, `state`, `query_start`, `xact_start`, `wait_event`, `query`. Это первое место, куда смотрят при инциденте.',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Активные запросы прямо сейчас',
          code: 'SELECT pid, usename, state, query_start,\n       now() - query_start AS duration,\n       wait_event_type, wait_event,\n       left(query, 60) AS query_preview\nFROM pg_stat_activity\nWHERE state <> \'idle\'\n  AND pid <> pg_backend_pid()\nORDER BY query_start;',
        },
        {
          type: 'table',
          caption: 'Состояния backend-процесса',
          head: ['state', 'Что значит', 'Проблема?'],
          rows: [
            ['active', 'Выполняет запрос', 'Норма, если недолго'],
            ['idle', 'Соединение открыто, ничего не делает', 'Норма'],
            ['idle in transaction', 'Открыл BEGIN и не закрыл', 'ДА: держит snapshot, блокирует VACUUM'],
            ['idle in transaction (aborted)', 'Был BEGIN, потом ошибка, не откатился', 'ДА: то же самое'],
          ],
        },
        {
          type: 'note',
          text: 'Классический инцидент: приложение открыло BEGIN, что-то упало, а ROLLBACK не вызвался. Транзакция «висит» часами. Это блокирует VACUUM — мёртвые версии не удаляются, таблицы растут. Лечится через `pg_terminate_backend(pid)` + фикс в коде (try/finally).',
        },
      ],
    },
    {
      id: 'pg-l1-s5',
      title: 'Практика: посчитай RAM для соединений',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'Прежде чем поднимать `max_connections` — прикиньте, влезет ли это в RAM. Каждый backend — это отдельный процесс, ~10 MB плюс work_mem на активные сортировки. Сделаем простой расчёт в Python.',
        },
        {
          type: 'python',
          python: {
            starterCode:
              'connections = 500\nper_conn_mb = 10          # ~10 MB на процесс backend\n\n# Задача: посчитать, сколько RAM (в GB) займут все backend-процессы.\n# Формула: connections * per_conn_mb / 1024\n# Формат: два знака после точки + " GB"\n\ntotal_gb = None  # TODO\nprint(f"{total_gb:.2f} GB")\n',
            task: 'Посчитайте, сколько RAM (в GB) займут 500 backend-процессов по 10 MB каждый. Выведите результат в формате `X.XX GB`.',
            solution:
              'connections = 500\nper_conn_mb = 10\n\ntotal_gb = connections * per_conn_mb / 1024\nprint(f"{total_gb:.2f} GB")',
            expected: { type: 'stdout', value: '4.88 GB' },
            hint: 'total_gb = connections * per_conn_mb / 1024; print(f"{total_gb:.2f} GB")',
          },
        },
        {
          type: 'note',
          text: 'Плюс к этой цифре: shared_buffers (25% RAM), work_mem на активные сортировки, ОС. При 500 соединениях на сервере 8 GB RAM PostgreSQL «съест» всю память и уйдёт в swap. Отсюда — PgBouncer и max_connections=100–300 в проде.',
        },
      ],
    },
  ],
},
{
  id: 'pg-l2',
  title: 'MVCC: как PostgreSQL изолирует транзакции',
  minutes: 30,
  steps: [
    {
      id: 'pg-l2-s1',
      title: 'xmin и xmax в каждой строке',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'PostgreSQL использует MVCC (Multi-Version Concurrency Control): каждая строка таблицы содержит служебные поля — xmin (ID транзакции, создавшей версию строки) и xmax (ID транзакции, удалившей или обновившей её). При UPDATE создаётся новая версия строки, старая помечается xmax.',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Посмотреть xmin/xmax',
          code: '-- Скрытые системные столбцы видны через ctid, xmin, xmax\nSELECT id, name, xmin, xmax, ctid\nFROM users\nLIMIT 5;\n\n-- id | name  | xmin | xmax | ctid\n-- 1  | Анна  | 745  | 0    | (0,1)   -- живая версия\n-- 2  | Борис | 746  | 0    | (0,2)\n-- 3  | Вера  | 747  | 748  | (0,3)   -- удалена транзакцией 748',
        },
        {
          type: 'mermaid',
          caption: 'UPDATE создаёт новую версию строки',
          code: 'graph LR\n  Row1["Строка v1<br/>xmin=745 xmax=749<br/>(старая версия)"] -.->|"xmax=749<br/>«удалена»"| Dead["Мёртвая версия<br/>(очистит VACUUM)"]\n  Row2["Строка v2<br/>xmin=749 xmax=0<br/>(новая версия)"] --> Live["Живая версия<br/>(её видит SELECT)"]',
        },
        {
          type: 'note',
          text: 'Из этого следует: UPDATE в PostgreSQL — это INSERT + DELETE (новая версия + пометка старой). Поэтому после массовых UPDATE таблицы растут — старые версии нужно очищать VACUUM (следующий модуль).',
        },
      ],
    },
    {
      id: 'pg-l2-s2',
      title: 'Снимок (snapshot) и уровни изоляции',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'Каждая транзакция видит «снимок» (snapshot): набор транзакций, завершённых до её начала. Живые версии строки — те, чей xmin меньше «сейчас» и чей xmax не завершён. Это даёт изоляцию без блокировок чтения.',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Уровни изоляции в PostgreSQL',
          code: 'BEGIN;\nSHOW transaction_isolation;\n-- read committed (по умолчанию)\nROLLBACK;\n\nBEGIN ISOLATION LEVEL REPEATABLE READ;\n-- snapshot фиксируется на момент первого SELECT\nCOMMIT;\n\nBEGIN ISOLATION LEVEL SERIALIZABLE;\n-- + проверка конфликтов, может выбросить serialization_failure\nCOMMIT;',
        },
        {
          type: 'table',
          caption: 'Уровни изоляции (PostgreSQL)',
          head: ['Уровень', 'Dirty read', 'Non-repeatable read', 'Phantom read'],
          rows: [
            ['Read Committed (дефолт)', 'нет', 'да', 'да'],
            ['Repeatable Read', 'нет', 'нет', 'нет (в PG!)'],
            ['Serializable', 'нет', 'нет', 'нет + retry при конфликте'],
          ],
        },
        {
          type: 'note',
          text: 'PostgreSQL в Repeatable Read защищает и от phantom read — через MVCC-snapshot, а не блокировки диапазонов, как в MySQL/InnoDB. Это важное отличие. На собеседовании junior/middle по PG это любят спрашивать.',
        },
      ],
    },
    {
      id: 'pg-l2-s3',
      title: 'Проверь себя: xmax',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Что такое xmax в строке PostgreSQL?',
        options: [
          { id: 'a', text: 'Максимальный ID транзакции в кластере' },
          { id: 'b', text: 'ID транзакции, которая удалила или обновила эту версию строки (0 — живая)' },
          { id: 'c', text: 'Максимальный размер строки' },
          { id: 'd', text: 'Счётчик обновлений строки' },
        ],
        correct: ['b'],
        explanation:
          'xmin — транзакция, создавшая версию. xmax — транзакция, удалившая/обновившая. xmax=0 — версия живая. После UPDATE старая версия получает xmax=актуальная транзакция, а новая — xmin=актуальная, xmax=0.',
      },
    },
    {
      id: 'pg-l2-s4',
      title: 'Проверь себя: MVCC',
      type: 'quiz',
      quiz: {
        kind: 'multiple',
        question: 'Какие следствия MVCC в PostgreSQL?',
        options: [
          { id: 'a', text: 'UPDATE создаёт новую версию строки, старая помечается xmax' },
          { id: 'b', text: 'Без VACUUM таблицы растут — старые версии занимают место' },
          { id: 'c', text: 'SELECT блокирует UPDATE на тех же строках' },
          { id: 'd', text: 'Repeatable Read защищает от phantom read через snapshot' },
        ],
        correct: ['a', 'b', 'd'],
        explanation:
          'MVCC: UPDATE = INSERT + DELETE (новая версия). Без VACUUM мёртвые версии копятся. SELECT не блокирует UPDATE (чтение идёт по snapshot). Phantom read в PG под RR нет.',
      },
    },
    {
      id: 'pg-l2-s5',
      title: 'Проверь себя: долгие транзакции',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Транзакция A: `BEGIN; SELECT * FROM orders;` и ушла на обед, висит 2 часа. Что произойдёт с VACUUM?',
        options: [
          { id: 'a', text: 'VACUUM работает нормально' },
          { id: 'b', text: 'VACUUM не может удалить версии, которые видит транзакция A → таблица растёт (bloat)' },
          { id: 'c', text: 'VACUUM откатит транзакцию A автоматически' },
          { id: 'd', text: 'PostgreSQL убьёт транзакцию через 5 минут' },
        ],
        correct: ['b'],
        explanation:
          'VACUUM не может удалить версии, которые ещё видны хотя бы одной активной транзакции. Открытая транзакция (даже idle in transaction) держит snapshot — мёртвые версии копятся, таблица раздувается. Лечится: idle_in_transaction_session_timeout + pg_terminate_backend для зависших.',
      },
    },
  ],
},
{
  id: 'pg-l3',
  title: 'Настройка: postgresql.conf',
  minutes: 25,
  steps: [
    {
      id: 'pg-l3-s1',
      title: 'Где лежит конфиг',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Найти конфиг',
          code: 'SHOW config_file;\n-- /etc/postgresql/16/main/postgresql.conf\n\nSHOW hba_file;\n-- /etc/postgresql/16/main/pg_hba.conf (аутентификация)\n\n-- Текущие настройки\nSELECT name, setting, unit, source\nFROM pg_settings\nWHERE name LIKE \'%work_mem%\';',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'ALTER SYSTEM — правка без редактирования файла',
          code: '-- Рекомендуемый способ (пишет в postgresql.auto.conf)\nALTER SYSTEM SET work_mem = \'16MB\';\nALTER SYSTEM SET shared_buffers = \'2GB\';\n\n-- Требуется перечитать конфиг\nSELECT pg_reload_conf();    -- для большинства параметров\n\n-- Для shared_buffers нужен РЕСТАРТ PostgreSQL\n-- (shared_buffers — «postmaster context» параметр)\n\n-- Сбросить\nALTER SYSTEM RESET work_mem;\nSELECT pg_reload_conf();',
        },
        {
          type: 'table',
          caption: 'Ключевые параметры',
          head: ['Параметр', 'Стартовое значение', 'Нужен рестарт?'],
          rows: [
            ['shared_buffers', '25% RAM', 'Да'],
            ['effective_cache_size', '50–75% RAM', 'Нет (reload)'],
            ['work_mem', '4–16 MB', 'Нет (per-session)'],
            ['maintenance_work_mem', '64–256 MB', 'Нет'],
            ['max_connections', '100–300 + PgBouncer', 'Да'],
            ['random_page_cost', '1.1 (SSD), 4 (HDD)', 'Нет'],
            ['checkpoint_timeout', '15 min', 'Нет'],
            ['wal_level', 'replica (для репликации)', 'Да'],
          ],
        },
      ],
    },
    {
      id: 'pg-l3-s2',
      title: 'SET vs ALTER SYSTEM',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Три уровня настройки',
          code: '-- 1. Только для текущей сессии (не сохраняется)\nSET work_mem = \'256MB\';\n-- или локально до конца транзакции:\nBEGIN;\nSET LOCAL work_mem = \'256MB\';\n-- тяжёлый отчёт\nCOMMIT;   -- work_mem вернулся к исходному',
        },
        {
          type: 'note',
          text: 'Правило: work_mem поднимайте локально через SET LOCAL только для тяжёлых запросов (отчёты, аналитика). Глобально — не выше 16–32 MB. Иначе OOM при пиковой нагрузке. shared_buffers меняйте через ALTER SYSTEM + рестарт.',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Проверить, что применилось',
          code: 'SELECT name, setting, unit, source\nFROM pg_settings\nWHERE name = \'work_mem\';\n-- source: \'default\' | \'configuration file\' | \'session\' | \'database\'',
        },
      ],
    },
    {
      id: 'pg-l3-s3',
      title: 'Проверь себя: какой параметр требует рестарт',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Какой параметр требует перезапуска PostgreSQL (а не просто pg_reload_conf)?',
        options: [
          { id: 'a', text: 'work_mem' },
          { id: 'b', text: 'shared_buffers' },
          { id: 'c', text: 'effective_cache_size' },
          { id: 'd', text: 'random_page_cost' },
        ],
        correct: ['b'],
        explanation:
          'shared_buffers — «postmaster context»: память выделяется при старте, изменить размер без рестарта нельзя. Остальные (work_mem, effective_cache_size, random_page_cost) — через reload.',
      },
    },
    {
      id: 'pg-l3-s4',
      title: 'Проверь себя: work_mem глобально',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Почему нельзя ставить work_mem = 1GB глобально?',
        options: [
          { id: 'a', text: 'PostgreSQL не поддерживает такие значения' },
          { id: 'b', text: 'work_mem × число одновременных сортировок × число соединений = OOM' },
          { id: 'c', text: 'Это замедляет только INSERT' },
          { id: 'd', text: 'Нужен рестарт' },
        ],
        correct: ['b'],
        explanation:
          'work_mem — на одну операцию в одном соединении. 1 GB × 3 сортировки × 100 соединений = 300 GB. Мгновенный OOM. Ставьте 4–16 MB глобально, а для тяжёлых отчётов — SET LOCAL work_mem = \'256MB\' в рамках транзакции.',
      },
    },
    {
      id: 'pg-l3-s5',
      title: 'Практика: пик памяти под сортировки',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'Реальная задача при настройке: прикинуть, влезет ли `work_mem` при пиковой нагрузке. Формула: `work_mem × соединения × сортировок_на_запрос`. Посчитаем на «плохом» сценарии — work_mem=1GB.',
        },
        {
          type: 'python',
          python: {
            starterCode:
              'work_mem_mb = 1024        # 1 GB (плохая настройка)\nconnections = 100\nsorts_per_query = 3\n\n# Задача: посчитать пиковую RAM в GB.\n# Формула: work_mem_mb * connections * sorts_per_query / 1024\npeak_gb = None  # TODO\nprint(peak_gb)\n',
            task: 'Посчитайте пиковую RAM (в GB) для work_mem=1024 MB, 100 соединений, 3 сортировки на запрос. Формула: `work_mem_mb * connections * sorts_per_query / 1024`.',
            solution:
              'work_mem_mb = 1024\nconnections = 100\nsorts_per_query = 3\n\npeak_gb = work_mem_mb * connections * sorts_per_query / 1024\nprint(peak_gb)',
            expected: { type: 'stdout', value: '300.0' },
            hint: 'peak_gb = work_mem_mb * connections * sorts_per_query / 1024',
          },
        },
        {
          type: 'note',
          text: 'Именно поэтому work_mem=1GB глобально — рецепт OOM. 300 GB не будет ни на одном сервере. Ставьте 4–16 MB, а для тяжёлых запросов — `SET LOCAL work_mem = \'256MB\'` внутри транзакции. Меньше соединений + меньше сортировок = меньше пик.',
        },
      ],
    },
  ],
},
{
  id: 'pg-l4',
  title: 'WAL: write-ahead log',
  minutes: 25,
  steps: [
    {
      id: 'pg-l4-s1',
      title: 'Что такое WAL и зачем',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'WAL (Write-Ahead Log) — журнал изменений, который PostgreSQL пишет ДО того, как изменить страницу на диске. Принцип WAL: сначала запись в журнал (append-only, быстро), потом — в «настоящий» файл таблицы. Если сервер упадёт — при старте WAL «переиграет» незакоммиченные изменения.',
        },
        {
          type: 'mermaid',
          caption: 'WAL: сначала журнал, потом страницы',
          code: 'sequenceDiagram\n  participant C as Клиент\n  participant PG as Backend\n  participant WAL as WAL buffer\n  participant Disk as WAL (диск)\n  participant Heap as Таблица (heap)\n\n  C->>PG: INSERT\n  PG->>WAL: запись изменения\n  Note over PG: commit → fsync WAL\n  PG->>Disk: fsync\n  Disk-->>C: OK (commit)\n  Note over PG,Heap: страница таблицы<br/>обновится позже<br/>(background/checkpointer)',
        },
        {
          type: 'list',
          items: [
            'WAL обеспечивает durability: commit → fsync в WAL → OK клиенту',
            'Страницы таблиц (heap) пишутся на диск позже — асинхронно',
            'WAL нужен для: крэш-восстановления, репликации, PITR-бэкапов',
            'WAL сегменты — файлы по 16 MB в pg_wal/',
          ],
        },
      ],
    },
    {
      id: 'pg-l4-s2',
      title: 'wal_level и checkpoint',
      type: 'theory',
      blocks: [
        {
          type: 'table',
          caption: 'wal_level',
          head: ['Уровень', 'Что пишет', 'Для чего'],
          rows: [
            ['minimal', 'Минимум (только для крэша)', 'Dev, без репликации'],
            ['replica (дефолт)', 'Всё для репликации и PITR', 'Прод, streaming replication'],
            ['logical', 'replica + logical decoding', 'Logical replication, CDC, Debezium'],
          ],
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Checkpoint и статистика WAL',
          code: '-- Когда был последний checkpoint?\nSELECT * FROM pg_control_checkpoint();\n\n-- Сколько WAL сгенерировано?\nSELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), \'0/0\')) AS total_wal;\n\n-- Сколько WAL за последний час (примерно)\nSELECT pg_size_pretty(\n  pg_wal_lsn_diff(pg_current_wal_lsn(), checkpoint_lsn)\n) FROM pg_control_checkpoint();',
        },
        {
          type: 'note',
          text: 'Checkpoint — момент, когда все грязные страницы из shared_buffers сброшены на диск. После checkpoint WAL до этой точки можно удалить (если не архивируется). checkpoint_timeout = 15 min — стандарт. Уменьшать — больше I/O на диск; увеличивать — дольше восстановление после крэша.',
        },
      ],
    },
    {
      id: 'pg-l4-s3',
      title: 'Проверь себя: почему WAL до страниц',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Почему PostgreSQL пишет в WAL до изменения страницы таблицы?',
        options: [
          { id: 'a', text: 'WAL-файлы быстрее читаются' },
          { id: 'b', text: 'Append-only запись в WAL быстрее случайной записи в страницы; durability через fsync WAL' },
          { id: 'c', text: 'Это требование SQL-стандарта' },
          { id: 'd', text: 'Так работает MVCC' },
        ],
        correct: ['b'],
        explanation:
          'WAL — append-only: пишем последовательно, без seek. Страницы таблиц — random write (медленно). Commit подтверждается после fsync WAL, а не страниц. Если крэш — WAL «переиграет» изменения при старте. Принцип из 1980-х, работает до сих пор.',
      },
    },
    {
      id: 'pg-l4-s4',
      title: 'Проверь себя: wal_level',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Какой wal_level нужен для logical replication?',
        options: [
          { id: 'a', text: 'minimal' },
          { id: 'b', text: 'replica' },
          { id: 'c', text: 'logical' },
          { id: 'd', text: 'archive' },
        ],
        correct: ['c'],
        explanation:
          'logical — включает logical decoding: можно подписаться на поток изменений (Debezium, CDC, logical replication). replica — только для streaming replication (физическая копия страниц). minimal — без репликации вообще.',
      },
    },
    {
      id: 'pg-l4-s5',
      title: 'Проверь себя: pg_wal заполнил диск',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'pg_wal/ разросся и занял весь диск. Что произойдёт с PostgreSQL?',
        options: [
          { id: 'a', text: 'Ничего, WAL автоматически удаляется' },
          { id: 'b', text: 'PostgreSQL остановится — не может писать WAL без места' },
          { id: 'c', text: 'PostgreSQL переключится в read-only' },
          { id: 'd', text: 'WAL сожмётся автоматически' },
        ],
        correct: ['b'],
        explanation:
          'Без места под WAL PostgreSQL не может подтверждать транзакции и штатно останавливается. Классический инцидент: забыли включить archiving (архивные WAL-файлы копятся бесконечно) или завысили wal_keep_size. Мониторинг размера pg_wal — обязательный алерт в проде. Решения: archive_mode + archive_command (или pgBackRest), wal_keep_size, max_wal_size.',
      },
    },
  ],
},
{
  id: 'pg-l5',
  title: 'VACUUM, autovacuum и bloat',
  minutes: 30,
  steps: [
    {
      id: 'pg-l5-s1',
      title: 'Зачем VACUUM',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'MVCC оставляет «мёртвые версии» строк (старые xmin/xmax). VACUUM очищает их и освобождает место для переиспользования. Без VACUUM таблицы растут (bloat), индексы пухнут, а транзакции могут «зависнуть» — PostgreSQL не может удалить версии, которые ещё видит хоть одна старая транзакция.',
        },
        {
          type: 'mermaid',
          caption: 'VACUUM: мёртвые версии → свободное место',
          code: 'graph LR\n  A["Таблица<br/>с мёртвыми версиями"] -->|"VACUUM"| B["Мёртвые версии удалены<br/>место помечено как free"]\n  B -->|"INSERT/UPDATE"| C["Новые строки<br/>занимают free-места"]\n  B -.->|"VACUUM FULL"| D["Файл сжат<br/>(блокирует таблицу!)"]',
        },
        {
          type: 'list',
          items: [
            'VACUUM — очищает мёртвые версии, не блокирует чтение/запись',
            'VACUUM FULL — переписывает файл целиком, блокирует таблицу (только для крайних случаев)',
            'VACUUM ANALYZE — + обновляет статистику для планировщика',
            'autovacuum — фоновый процесс, запускается автоматически',
            'VACUUM не освобождает место ОС — только помечает внутри файла',
          ],
        },
        {
          type: 'note',
          text: 'VACUUM не уменьшает файл таблицы на диске (это делает VACUUM FULL, но блокирует). Он лишь делает место доступным для новых строк. Если таблица распухла до 10 GB при реальных 1 GB — поможет pg_repack (онлайн) или VACUUM FULL (с блокировкой).',
        },
      ],
    },
    {
      id: 'pg-l5-s2',
      title: 'autovacuum: настройка и проблемы',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Проверить autovacuum',
          code: 'SHOW autovacuum;                    -- on\nSHOW autovacuum_naptime;            -- 1min (как часто проверяет)\nSHOW autovacuum_vacuum_threshold;   -- 50\nSHOW autovacuum_vacuum_scale_factor; -- 0.2 (20%)\n\n-- Когда запустится: threshold + scale_factor * rows\n-- Для таблицы 1M строк: 50 + 0.2*1M = 200_050 мёртвых строк',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Кто давно не vacuum-ился',
          code: 'SELECT\n  schemaname,\n  relname,\n  n_live_tup,\n  n_dead_tup,\n  ROUND(100.0 * n_dead_tup / GREATEST(n_live_tup + n_dead_tup, 1), 1) AS dead_pct,\n  last_vacuum,\n  last_autovacuum\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 1000\nORDER BY n_dead_tup DESC\nLIMIT 10;',
        },
        {
          type: 'note',
          text: 'Проблема больших таблиц: при 100M строк порог autovacuum = 20M мёртвых. Это слишком много. Решение — per-table настройка: ALTER TABLE big_table SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000).',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Ручной VACUUM',
          code: '-- Обычный VACUUM (не блокирует)\nVACUUM (VERBOSE, ANALYZE) users;\n\n-- Без блокировки таблицы\nVACUUM users;\n\n-- С блокировкой, сжимает файл\nVACUUM FULL users;   -- ОСТОРОЖНО: эксклюзивная блокировка',
        },
      ],
    },
    {
      id: 'pg-l5-s3',
      title: 'Проверь себя: VACUUM',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Почему таблица растёт, если её часто UPDATE-ят и не VACUUM-ят?',
        options: [
          { id: 'a', text: 'PostgreSQL плохо работает с UPDATE' },
          { id: 'b', text: 'UPDATE = INSERT + DELETE (новая версия + мёртвая), без VACUUM мёртвые копятся' },
          { id: 'c', text: 'Нужно пересоздавать таблицу каждый месяц' },
          { id: 'd', text: 'Это баг, исправляется в новой версии' },
        ],
        correct: ['b'],
        explanation:
          'MVCC: UPDATE создаёт новую версию, старая помечается xmax. Без VACUUM мёртвые версии копятся и занимают место. VACUUM очищает их и помечает место для переиспользования — таблица перестаёт расти (но не сжимается — это VACUUM FULL).',
      },
    },
    {
      id: 'pg-l5-s4',
      title: 'Проверь себя: autovacuum',
      type: 'quiz',
      quiz: {
        kind: 'number',
        question: 'Для таблицы 1M строк со scale_factor=0.2 и threshold=50 — при каком числе мёртвых строк запустится autovacuum?',
        correct: 200050,
        explanation:
          'Порог = threshold + scale_factor * rows = 50 + 0.2 * 1_000_000 = 200_050. Для больших таблиц это слишком много — настраивайте per-table через ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = 0.01).',
      },
    },
    {
      id: 'pg-l5-s5',
      title: 'Практика: найди таблицы с bloat',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'Главный навык по VACUUM — увидеть таблицу, где накопилось много мёртвых версий. В реальном PostgreSQL это делается через `pg_stat_user_tables` (n_live_tup, n_dead_tup). В песочнице — та же логика на mock-таблице `stats`.',
        },
        {
          type: 'sandbox',
          sandbox: {
            schema:
              'CREATE TABLE stats (table_name TEXT, live_tup INTEGER, dead_tup INTEGER);\nINSERT INTO stats VALUES\n  (\'orders\', 100000, 50000),\n  (\'users\', 10000, 100),\n  (\'logs\', 5000000, 4000000),\n  (\'products\', 500, 0);',
            task: 'Найдите таблицы, где доля мёртвых строк больше 30%. Колонка: table_name. Отсортируйте по table_name.',
            solution:
              'SELECT table_name\nFROM stats\nWHERE dead_tup * 100.0 / (live_tup + dead_tup) > 30\nORDER BY table_name;',
            expected: {
              columns: ['table_name'],
              rows: [['logs'], ['orders']],
              order: 'order',
            },
            hint: 'dead_tup * 100.0 / (live_tup + dead_tup) > 30 — не забудьте 100.0, иначе целочисленное деление',
          },
        },
        {
          type: 'note',
          text: 'В реальном PostgreSQL: `SELECT relname, n_dead_tup, ROUND(100.0*n_dead_tup/NULLIF(n_live_tup+n_dead_tup,0),1) AS dead_pct FROM pg_stat_user_tables WHERE n_dead_tup > 1000 ORDER BY dead_pct DESC`. Всё, что > 20–30% — кандидат на ручной VACUUM ANALYZE (или pg_repack, если совсем плохо).',
        },
      ],
    },
  ],
},
{
  id: 'pg-l6',
  title: 'Мониторинг: pg_stat_* и pg_stat_statements',
  minutes: 30,
  steps: [
    {
      id: 'pg-l6-s1',
      title: 'pg_stat_activity: что происходит сейчас',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Активные запросы',
          code: 'SELECT\n  pid,\n  usename,\n  state,\n  query_start,\n  EXTRACT(EPOCH FROM (NOW() - query_start))::int AS seconds,\n  LEFT(query, 60) AS query_preview\nFROM pg_stat_activity\nWHERE state != \'idle\'\n  AND pid != pg_backend_pid()\nORDER BY query_start\nLIMIT 10;',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Найти и убить зависший запрос',
          code: '-- Найти запрос, работающий > 5 мин\nSELECT pid, now() - query_start AS duration, query\nFROM pg_stat_activity\nWHERE state = \'active\'\n  AND now() - query_start > interval \'5 minutes\';\n\n-- Мягко (SIGINT, как Ctrl+C)\nSELECT pg_cancel_backend(pid);\n\n-- Жёстко (SIGTERM, рвёт соединение)\nSELECT pg_terminate_backend(pid);',
        },
        {
          type: 'note',
          text: 'pg_stat_activity показывает всё: активные запросы, IDLE-соединения, ожидания (wait_event). Если видите много IDLE с old xact_start — кто-то открыл транзакцию и «забыл» закрыть. Это блокирует VACUUM и раздувает таблицы.',
        },
      ],
    },
    {
      id: 'pg-l6-s2',
      title: 'pg_stat_statements: топ тяжёлых запросов',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Включить расширение',
          code: '-- postgresql.conf\nshared_preload_libraries = \'pg_stat_statements\'\n\n-- После рестарта — в БД:\nCREATE EXTENSION pg_stat_statements;\n\n-- Топ-10 по общему времени\nSELECT\n  substring(query, 1, 80) AS query,\n  calls,\n  ROUND(total_exec_time::numeric, 1) AS total_ms,\n  ROUND(mean_exec_time::numeric, 2) AS mean_ms,\n  rows\nFROM pg_stat_statements\nORDER BY total_exec_time DESC\nLIMIT 10;',
        },
        {
          type: 'list',
          items: [
            'calls — сколько раз вызывался',
            'total_exec_time — суммарное время (мс)',
            'mean_exec_time — среднее время',
            'rows — суммарно обработано строк',
            'shared_blks_hit / read — попадания/промахи кэша',
          ],
        },
        {
          type: 'note',
          text: 'Это главный инструмент поиска «что тормозит прод». Не «все запросы медленные», а «этот запрос вызван 1М раз, среднее 200 мс, суммарно 2 дня CPU». pg_stat_statements должен быть на каждом проде.',
        },
      ],
    },
    {
      id: 'pg-l6-s3',
      title: 'Проверь себя: мониторинг',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Какое расширение показывает топ самых тяжёлых запросов по суммарному времени?',
        options: [
          { id: 'a', text: 'pg_stat_activity' },
          { id: 'b', text: 'pg_stat_statements' },
          { id: 'c', text: 'pg_stat_user_tables' },
          { id: 'd', text: 'pg_stat_replication' },
        ],
        correct: ['b'],
        explanation:
          'pg_stat_statements агрегирует все запросы: calls, total_exec_time, mean_exec_time. Именно по нему ищут «что тормозит прод». pg_stat_activity — текущий момент, pg_stat_user_tables — статистика таблиц (seq scans, dead rows).',
      },
    },
    {
      id: 'pg-l6-s4',
      title: 'Проверь себя: команды',
      type: 'quiz',
      quiz: {
        kind: 'matching',
        question: 'Сопоставьте view/команду и назначение',
        pairs: [
          { left: 'pg_stat_activity', right: 'Что выполняется прямо сейчас' },
          { left: 'pg_stat_statements', right: 'Топ запросов по времени/вызовам' },
          { left: 'pg_stat_user_tables', right: 'Seq scans, dead rows, last vacuum' },
          { left: 'pg_cancel_backend', right: 'Мягко отменить запрос (SIGINT)' },
        ],
        explanation:
          'activity — «сейчас», statements — «агрегат по времени», user_tables — «статистика по таблицам». cancel — мягкая отмена, terminate — жёсткая (SIGTERM).',
      },
    },
    {
      id: 'pg-l6-s5',
      title: 'Практика: найди долгие запросы',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'Первое действие при инциденте — найти активные запросы, которые висят слишком долго. В реальном PostgreSQL это `pg_stat_activity`. В песочнице — та же логика на mock-таблице `activity` со столбцами как у настоящего view.',
        },
        {
          type: 'sandbox',
          sandbox: {
            schema:
              'CREATE TABLE activity (pid INTEGER, usename TEXT, state TEXT, duration_sec INTEGER, query TEXT);\nINSERT INTO activity VALUES\n  (100, \'app\',   \'active\',              2,    \'SELECT * FROM users\'),\n  (101, \'app\',   \'idle\',                300,  \'\'),\n  (102, \'app\',   \'active\',              900,  \'SELECT * FROM orders\'),\n  (103, \'batch\', \'active\',              30,   \'UPDATE stock\'),\n  (104, \'app\',   \'idle in transaction\', 7200, \'BEGIN\');',
            task: 'Найдите активные запросы (state = \'active\'), которые выполняются дольше 5 минут (> 300 секунд). Колонки: pid, query. Отсортируйте по pid.',
            solution:
              'SELECT pid, query\nFROM activity\nWHERE state = \'active\' AND duration_sec > 300\nORDER BY pid;',
            expected: {
              columns: ['pid', 'query'],
              rows: [[102, 'SELECT * FROM orders']],
              order: 'order',
            },
            hint: 'state = \'active\' AND duration_sec > 300. Осторожно: idle in transaction — это НЕ active, хоть и опаснее.',
          },
        },
        {
          type: 'note',
          text: 'В реальном `pg_stat_activity` вместо `duration_sec` — `now() - query_start AS duration` (interval). Тот же запрос: `WHERE state = \'active\' AND now() - query_start > interval \'5 minutes\'`. Дальше — `pg_terminate_backend(pid)` для зависших или `pg_cancel_backend(pid)` для мягкой отмены. А `idle in transaction` (pid 104) — отдельная категория: не active, но держит snapshot и блокирует VACUUM. Отдельный алерт в мониторинге.',
        },
      ],
    },
  ],
},
{
  id: 'pg-l7',
  title: 'EXPLAIN глубоко: BUFFERS, JSON, auto_explain',
  minutes: 30,
  steps: [
    {
      id: 'pg-l7-s1',
      title: 'EXPLAIN ANALYZE + BUFFERS',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Глубокий EXPLAIN',
          code: 'EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT TEXT)\nSELECT * FROM orders WHERE user_id = 42;\n\n-- Seq Scan on orders  (cost=0.00..25478.00 rows=3 width=200)\n--                     (actual time=45.123..45.456 rows=3 loops=1)\n--   Filter: (user_id = 42)\n--   Rows Removed by Filter: 999997\n--   Buffers: shared hit=50 read=4950 dirtied=0   ← ГЛАВНОЕ\n-- Planning Time: 0.2 ms\n-- Execution Time: 45.2 ms',
        },
        {
          type: 'list',
          items: [
            'shared hit — страниц взято из shared_buffers (быстро)',
            'shared read — страниц прочитано с диска (медленно)',
            'shared dirtied — страниц изменено',
            'temp read/written — временные файлы на диске (сортировка не влезла в work_mem)',
            'Высокий read = мало shared_buffers или плохой индекс',
          ],
        },
        {
          type: 'note',
          text: 'BUFFERS — главное дополнение к EXPLAIN ANALYZE. Без него видно «45 мс», с ним — «4500 страниц прочитано с диска». Первое лечится индексом, второе — увеличением кэша или другим планом.',
        },
      ],
    },
    {
      id: 'pg-l7-s2',
      title: 'FORMAT JSON и auto_explain',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'JSON — для программного анализа',
          code: 'EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)\nSELECT * FROM orders WHERE status = \'paid\';\n\n-- Удобно парсить в Python/Go/JS для автоанализа и дашбордов',
        },
        {
          type: 'code',
          lang: 'text',
          caption: 'auto_explain — логирование медленных планов',
          code: '# postgresql.conf\nshared_preload_libraries = \'auto_explain\'\nauto_explain.log_min_duration = \'1s\'       # логировать планы запросов > 1 сек\nauto_explain.log_analyze = on               # + ANALYZE (actual time)\nauto_explain.log_buffers = on               # + BUFFERS\nauto_explain.log_nested_statements = on',
        },
        {
          type: 'note',
          text: 'auto_explain — «чёрный ящик» для прода. Каждый запрос медленнее 1 сек автоматически логируется с полным планом и BUFFERS. Незаменимо для разбора инцидентов «в 3 часа ночи что-то тормозило». Включайте в проде.',
        },
      ],
    },
    {
      id: 'pg-l7-s3',
      title: 'Проверь себя: BUFFERS',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'В EXPLAIN ANALYZE BUFFERS видите `shared read=50000`. Что это значит?',
        options: [
          { id: 'a', text: '50 000 строк прочитано' },
          { id: 'b', text: '50 000 страниц (× 8 KB = 400 MB) прочитано с диска — данные не в кэше' },
          { id: 'c', text: 'Ошибка в плане' },
          { id: 'd', text: '50 000 транзакций' },
        ],
        correct: ['b'],
        explanation:
          'shared read — страницы, которых не было в shared_buffers, читались с диска. 1 страница = 8 KB. 50000 read = 400 MB I/O. Это дорого. Причины: мало shared_buffers, плохой индекс, или запрос реально читает много данных.',
      },
    },
    {
      id: 'pg-l7-s4',
      title: 'Проверь себя: auto_explain',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Зачем включать auto_explain в проде?',
        options: [
          { id: 'a', text: 'Ускоряет запросы' },
          { id: 'b', text: 'Автоматически логирует планы запросов медленнее заданного порога' },
          { id: 'c', text: 'Заменяет pg_stat_statements' },
          { id: 'd', text: 'Блокирует опасные запросы' },
        ],
        correct: ['b'],
        explanation:
          'auto_explain пишет в лог полный план (с BUFFERS) для запросов медленнее log_min_duration. Это «чёрный ящик» для разбора инцидентов. Заменяет ручной EXPLAIN ANALYZE на проде (который бывает опасен на UPDATE).',
      },
    },
    {
      id: 'pg-l7-s5',
      title: 'Практика: во сколько раз индекс ускорил запрос',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'EXPLAIN ANALYZE показывает `Execution Time` в миллисекундах. Самое наглядное — сравнить до и после индекса. Классический пример: Seq Scan на 1M строк с фильтром vs Index Scan. Разница — не «в 2 раза», а на порядки.',
        },
        {
          type: 'python',
          python: {
            starterCode:
              'before_us = 45000   # Execution Time до индекса (45 мс = 45000 μs)\nafter_us  = 50      # Execution Time после индекса (0.05 мс = 50 μs)\n\n# Задача: посчитать, во сколько раз индекс ускорил запрос.\n# speedup = before_us / after_us\n# Формат: округлить до целого, добавить "x" в конце\n\nspeedup = None  # TODO\nprint(f"{speedup:.0f}x")\n',
            task: 'Посчитайте, во сколько раз индекс ускорил запрос: `before_us / after_us`, округлить до целого, вывести с суффиксом `x`. Пример: `900x`.',
            solution:
              'before_us = 45000\nafter_us  = 50\n\nspeedup = before_us / after_us\nprint(f"{speedup:.0f}x")',
            expected: { type: 'stdout', value: '900x' },
            hint: 'speedup = before_us / after_us; print(f"{speedup:.0f}x")',
          },
        },
        {
          type: 'note',
          text: 'В реальном EXPLAIN такие цифры — норма: 45 секунд Seq Scan превращаются в 0.05 мс Index Scan, когда колонка в WHERE получает индекс. Не «в 2 раза быстрее», а «в 900 раз». Поэтому индекс в PostgreSQL — не «оптимизация», а часто «разница между работает и не работает».',
        },
      ],
    },
  ],
},
{
  id: 'pg-l8',
  title: 'Индексы PG: GiST, GIN, BRIN, partial, covering',
  minutes: 30,
  steps: [
    {
      id: 'pg-l8-s1',
      title: 'Типы индексов',
      type: 'theory',
      blocks: [
        {
          type: 'table',
          caption: 'Типы индексов PostgreSQL',
          head: ['Тип', 'Для чего', 'Пример'],
          rows: [
            ['B-tree (дефолт)', '=, <, >, BETWEEN, ORDER BY', 'id, created_at, email'],
            ['Hash', 'Только =', 'Редко (B-tree почти всегда лучше)'],
            ['GIN', 'jsonb, массивы, полнотекст, pg_trgm', 'metadata @> \'{"a": 1}\''],
            ['GiST', 'Геометрия, диапазоны, pg_trgm', 'Полигоны, tsrange'],
            ['BRIN', 'Огромные таблицы с сортированными данными', 'Логи по времени'],
            ['SP-GiST', 'Точечные данные, quadtree', 'IP-адреса'],
          ],
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'Специальные виды B-tree',
          code: '-- Partial — только для подмножества строк (меньше и быстрее)\nCREATE INDEX idx_orders_active ON orders(created_at)\nWHERE status = \'paid\';\n\n-- Covering (INCLUDE) — индекс хранит доп. колонку, чтобы не читать таблицу\nCREATE INDEX idx_orders_user_covering\nON orders(user_id) INCLUDE (total, created_at);\n\n-- Expression — по выражению\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n-- SELECT * FROM users WHERE LOWER(email) = \'a@b.com\';  -- использует индекс\n\n-- Concurrently — не блокирует таблицу (важно для прода!)\nCREATE INDEX CONCURRENTLY idx_big ON big_table(col);',
        },
        {
          type: 'note',
          text: 'CREATE INDEX CONCURRENTLY — единственный способ создать индекс на большой прод-таблице без блокировки записи. Обычный CREATE INDEX берёт SHARE-блокировку: запись (INSERT/UPDATE/DELETE) ждёт, пока индекс строится. Это может быть часы.',
        },
      ],
    },
    {
      id: 'pg-l8-s2',
      title: 'Когда индекс не используется',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'Функция над колонкой ломает индекс',
          code: '-- Плохо: индекс на created_at НЕ работает\nSELECT * FROM orders WHERE DATE(created_at) = \'2025-01-01\';\n\n-- Хорошо: диапазон — использует индекс\nSELECT * FROM orders\nWHERE created_at >= \'2025-01-01\'\n  AND created_at < \'2025-01-02\';\n\n-- Или: expression-индекс\nCREATE INDEX idx_orders_date ON orders(DATE(created_at));',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'LIKE с % в начале',
          code: '-- Плохо: LIKE \'%текст%\' — не использует B-tree\nSELECT * FROM products WHERE name LIKE \'%iphone%\';\n\n-- Решение 1: pg_trgm + GIN\nCREATE EXTENSION pg_trgm;\nCREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);\n-- Теперь LIKE \'%iphone%\' использует индекс\n\n-- Решение 2: полнотекстовый поиск (tsvector)',
        },
        {
          type: 'list',
          items: [
            'Функция над колонкой (DATE(), LOWER()) — нужен expression-индекс',
            'LIKE \'%...%\' — не использует B-tree, нужен pg_trgm/GIN',
            'Несовпадение типов (int = text) — индекс не применится',
            'Маленькая таблица (< 1000 строк) — seq scan дешевле',
            'Низкая селективность (пол/статус на 2 значения) — индекс не поможет',
          ],
        },
        {
          type: 'note',
          text: 'Проверка: EXPLAIN покажет «Index Scan» или «Seq Scan». Если Seq Scan на большой таблице при точечном WHERE — индекса нет или он не подходит. Индекс — не «серебряная пуля»: на низкой селективности он только замедляет.',
        },
      ],
    },
    {
      id: 'pg-l8-s3',
      title: 'Проверь себя: CONCURRENTLY',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Зачем CREATE INDEX CONCURRENTLY на проде?',
        options: [
          { id: 'a', text: 'Индекс получается быстрее' },
          { id: 'b', text: 'Не блокирует INSERT/UPDATE/DELETE на время построения индекса' },
          { id: 'c', text: 'Создаёт индекс в оперативной памяти' },
          { id: 'd', text: 'Работает только в партиционированных таблицах' },
        ],
        correct: ['b'],
        explanation:
          'Обычный CREATE INDEX берёт SHARE-блокировку: запись (INSERT/UPDATE/DELETE) ждёт, пока строится индекс. На большой таблице это часы простоя. CONCURRENTLY строит индекс в фоне, не блокируя запись (медленнее, но безопаснее).',
      },
    },
    {
      id: 'pg-l8-s4',
      title: 'Проверь себя: типы',
      type: 'quiz',
      quiz: {
        kind: 'matching',
        question: 'Сопоставьте тип индекса и типичный use case',
        pairs: [
          { left: 'B-tree', right: '=, <, >, BETWEEN, ORDER BY' },
          { left: 'GIN', right: 'jsonb @>, полнотекст, pg_trgm' },
          { left: 'GiST', right: 'Геометрия, диапазоны' },
          { left: 'BRIN', right: 'Огромные таблицы с сортированными данными (логи)' },
        ],
        explanation:
          'B-tree — универсал. GIN — jsonb/массивы/поиск. GiST — геометрия и диапазоны. BRIN — для логов и метрик (мегабайты вместо гигабайт). SP-GiST и Hash — редко.',
      },
    },
    {
      id: 'pg-l8-s5',
      title: 'Проверь себя: порядок столбцов в составном индексе',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Нужно ускорить два запроса: (A) `WHERE user_id = 5 AND created_at > \'2025-01-01\'` и (B) `WHERE user_id = 5`. Какой составной индекс покроет оба?',
        options: [
          { id: 'a', text: 'CREATE INDEX ON orders(created_at, user_id) — сначала created_at' },
          { id: 'b', text: 'CREATE INDEX ON orders(user_id, created_at) — сначала user_id' },
          { id: 'c', text: 'Только два отдельных индекса' },
          { id: 'd', text: 'Порядок столбцов в индексе не важен' },
        ],
        correct: ['b'],
        explanation:
          'Индекс (user_id, created_at) покрывает оба запроса: для (A) — поиск по user_id, потом диапазон по created_at; для (B) — по первому столбцу (user_id). Индекс (created_at, user_id) НЕ подойдёт для (B), так как user_id — не первый столбец. Правило: «сначала равенство, потом диапазон», а не «как удобно».',
      },
    },
  ],
},
        {
          id: 'pg-l9',
          title: 'Партиционирование',
          minutes: 30,
          steps: [
            {
              id: 'pg-l9-s1',
              title: 'Зачем партиционировать',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Партиционирование разбивает одну логическую таблицу на несколько физических (партиций) по ключу. Зачем: (1) запросы читают только нужные партиции (partition pruning), (2) VACUUM и индексы работают с маленькими таблицами, (3) старые партиции удаляются DROP-ом (мгновенно), а не DELETE (медленно).',
                },
                {
                  type: 'mermaid',
                  caption: 'Declarative partitioning: RANGE по дате',
                  code: `graph TD
                    Orders["orders (логическая таблица)"] --> P1["orders_2025_01<br/>2025-01-01 .. 2025-02-01"]
                    Orders --> P2["orders_2025_02<br/>2025-02-01 .. 2025-03-01"]
                    Orders --> P3["orders_2025_03<br/>..."]
                    Query["SELECT * WHERE created_at >= '2025-02-15'"] -.->|"partition pruning"| P2
                    Query -.-> P3`,
                },
                {
                  type: 'note',
                  text: 'Declarative partitioning (с PG 10) — встроенное, прозрачное. Раньше делали через наследование + триггеры, это было больно. Сейчас — один DDL, и всё работает. Pruning (отсечение партиций) — автоматический по WHERE.',
                },
              ],
            },
            {
              id: 'pg-l9-s2',
              title: 'RANGE, LIST, HASH',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'RANGE по дате',
                  code: `CREATE TABLE orders (\n  id          bigint,\n  created_at  timestamptz NOT NULL,\n  user_id     int,\n  total       numeric\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE orders_2025_01 PARTITION OF orders\n  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');\nCREATE TABLE orders_2025_02 PARTITION OF orders\n  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');\n\n-- DEFAULT-партиция (для «всего остального»)\nCREATE TABLE orders_default PARTITION OF orders DEFAULT;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'LIST и HASH',
                  code: `-- LIST: по значению\nCREATE TABLE events (region text NOT NULL, ...)\nPARTITION BY LIST (region);\nCREATE TABLE events_eu PARTITION OF events FOR VALUES IN ('eu');\nCREATE TABLE events_us PARTITION OF events FOR VALUES IN ('us');\n\n-- HASH: равномерное распределение\nCREATE TABLE metrics (id bigint NOT NULL, ...)\nPARTITION BY HASH (id);\nCREATE TABLE metrics_0 PARTITION OF metrics FOR VALUES WITH (MODULUS 4, REMAINDER 0);\nCREATE TABLE metrics_1 PARTITION OF metrics FOR VALUES WITH (MODULUS 4, REMAINDER 1);\n-- ... 2, 3`,
                },
                {
                  type: 'list',
                  items: [
                    'RANGE — по диапазону (даты, числа): самый частый случай',
                    'LIST — по значению (регион, тип): когда значений мало',
                    'HASH — равномерно по хэшу (id): когда нет «естественного» ключа',
                    'DEFAULT-партиция — для строк, не попавших ни в одну (иначе ошибка)',
                    'Pruning — автоматическое отсечение: WHERE created_at >= \'2025-02-01\' читает только orders_2025_02+',
                  ],
                },
              ],
            },
            {
              id: 'pg-l9-s3',
              title: 'Обслуживание партиций',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Как удалить старые данные',
                  code: `-- Вместо DELETE (медленно, оставляет bloat)\n-- DROP партиции (мгновенно!)\nDROP TABLE orders_2024_01;\n\n-- Автоматическое создание партиций — pg_partman\n-- или cron-задача:\nCREATE TABLE orders_2025_04 PARTITION OF orders\n  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Проверить pruning',
                  code: `EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders WHERE created_at >= '2025-02-15';\n\n-- Append\n--   Subplans Removed: 2          ← pruning: 2 партиции отсечены\n--   ->  Seq Scan on orders_2025_02\n--   ->  Seq Scan on orders_2025_03`,
                },
                {
                  type: 'note',
                  text: 'Партиционирование — стандарт для больших time-series таблиц (логи, метрики, заказы). Обязательные условия: ключ партиционирования в WHERE (иначе pruning не сработает), уникальные индексы включают ключ партиционирования, и автоматическое создание партиций (pg_partman).',
                },
              ],
            },
            {
              id: 'pg-l9-s4',
              title: 'Проверь себя: партиционирование',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое partition pruning?',
                options: [
                  { id: 'a', text: 'Удаление старых партиций' },
                  { id: 'b', text: 'Автоматическое отсечение партиций, которые не нужны для запроса (по WHERE)' },
                  { id: 'c', text: 'Сжатие партиций' },
                  { id: 'd', text: 'Репликация партиций' },
                ],
                correct: ['b'],
                explanation:
                  'Pruning — планировщик смотрит на WHERE и читает только партиции, которые могут содержать подходящие строки. WHERE created_at >= \'2025-02-15\' читает orders_2025_02 и orders_2025_03, но не orders_2025_01. Это главный смысл партиционирования по дате.',
              },
            },
            {
              id: 'pg-l9-s5',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте стратегию и типичный use case',
                pairs: [
                  { left: 'RANGE', right: 'Даты, числа (time-series)' },
                  { left: 'LIST', right: 'Регион, тип (мало значений)' },
                  { left: 'HASH', right: 'Равномерное распределение по id' },
                ],
                explanation:
                  'RANGE — 90% случаев (логи, метрики, заказы). LIST — когда значений мало (регион, тип события). HASH — когда нужно равномерно распределить нагрузку по партициям, и нет естественного ключа.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m4 — JSONB, полнотекст, pg_trgm
    // ─────────────────────────────────────────────
    {
      id: 'pg-m4',
      title: 'JSONB, полнотекст, pg_trgm',
      lessons: [
{
  id: 'pg-l10',
  title: 'JSONB глубоко: jsonpath',
  minutes: 30,
  steps: [
    {
      id: 'pg-l10-s1',
      title: 'jsonpath: SQL-подобный доступ',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'jsonpath — синтаксис запросов к JSON, как XPath для XML. В PostgreSQL 12+ работает в операторах `@?` (существует ли путь) и `@@` (предикат). Позволяет писать запросы к JSONB почти как к SQL-таблице.',
        },
        {
          type: 'code',
          lang: 'sql',
          caption: 'jsonpath',
          code: '-- metadata: {"user": {"age": 25, "tags": ["a","b"]}}\n\n-- @? — существует ли путь\nSELECT * FROM events WHERE metadata @? \'$.user.age\';\n\n-- @@ — предикат\nSELECT * FROM events\nWHERE metadata @@ \'$.user.age > 18\';\n\n-- Сравнение массивов\nSELECT * FROM events\nWHERE metadata @? \'$.user.tags[*] ? (@ == "vip")\';\n\n-- jsonb_path_query — выполнить jsonpath и вернуть результат\nSELECT jsonb_path_query(metadata, \'$.user.tags[*]\')\nFROM events;',
        },
        {
          type: 'note',
          text: 'jsonpath мощнее, чем `->` и `@>`. Если у вас сложные запросы к JSONB (`age > 18 AND has tag "vip"`), jsonpath читается лучше, чем набор `->>` + сравнений. Но `@>` (содержит) всё ещё быстрее для простых случаев.',
        },
      ],
    },
    {
      id: 'pg-l10-s2',
      title: 'Трансформация JSONB в таблицу',
      type: 'theory',
      blocks: [
        {
          type: 'code',
          lang: 'sql',
          caption: 'jsonb_each, jsonb_array_elements',
          code: '-- Развернуть объект в пары ключ-значение\nSELECT * FROM jsonb_each(\'{"a": 1, "b": 2}\'::jsonb);\n-- key | value\n-- a   | 1\n-- b   | 2\n\n-- Развернуть массив в строки\nSELECT * FROM jsonb_array_elements(\'[1,2,3]\'::jsonb);\n-- value\n-- 1\n-- 2\n-- 3\n\n-- Реальный кейс: посчитать, сколько раз каждый тег встречается\nSELECT tag, COUNT(*)\nFROM events,\n     jsonb_array_elements_text(metadata->\'tags\') AS tag\nGROUP BY tag\nORDER BY COUNT(*) DESC;',
        },
        {
          type: 'note',
          text: 'jsonb_array_elements_text — «нормализовать» JSONB в строки для JOIN и GROUP BY. Это классический способ «достать данные из JSONB и работать с ними как с таблицей». На больших объёмах — медленно, но для отчётов — часто единственный путь.',
        },
      ],
    },
    {
      id: 'pg-l10-s3',
      title: 'Проверь себя: jsonpath',
      type: 'quiz',
      quiz: {
        kind: 'single',
        question: 'Чем оператор `@?` отличается от `@>` для JSONB?',
        options: [
          { id: 'a', text: 'Ничем' },
          { id: 'b', text: '`@?` проверяет существование jsonpath-выражения, `@>` — содержит ли JSONB указанный JSONB-фрагмент' },
          { id: 'c', text: '`@?` работает только с массивами' },
          { id: 'd', text: '`@>` медленнее всегда' },
        ],
        correct: ['b'],
        explanation:
          '`@?` — «существует ли путь, удовлетворяющий jsonpath». `@>` — «содержит ли документ указанный фрагмент». Для простых случаев (`metadata @> \'{"a": 1}\'`) `@>` проще и быстрее. Для сложных (`age > 18 AND tags contains vip`) — jsonpath.',
      },
    },
    {
      id: 'pg-l10-s4',
      title: 'Практика: фильтр по JSON',
      type: 'theory',
      blocks: [
        {
          type: 'p',
          text: 'В реальном PostgreSQL фильтр по JSONB — через `->>` или `@>`. В песочнице (SQLite) — `json_extract(metadata, \'$.path\')`, эквивалент `->>`. Смысл тот же: достать значение по пути и сравнить.',
        },
        {
          type: 'sandbox',
          sandbox: {
            schema:
              'CREATE TABLE orders (id INTEGER, metadata TEXT);\nINSERT INTO orders VALUES\n  (1, \'{"promo": "SAVE10", "source": "web"}\'),\n  (2, \'{"source": "mobile"}\'),\n  (3, \'{"promo": "SAVE10", "source": "mobile"}\'),\n  (4, \'{"promo": "WELCOME"}\');',
            task: 'Найдите id заказов, где metadata.promo = \'SAVE10\'. Используйте `json_extract(metadata, \'$.promo\')`. Отсортируйте по id.',
            solution:
              'SELECT id\nFROM orders\nWHERE json_extract(metadata, \'$.promo\') = \'SAVE10\'\nORDER BY id;',
            expected: {
              columns: ['id'],
              rows: [[1], [3]],
              order: 'order',
            },
            hint: 'json_extract(metadata, \'$.promo\') = \'SAVE10\' — обратите внимание на $. перед именем поля',
          },
        },
        {
          type: 'note',
          text: 'В PostgreSQL тот же запрос: `SELECT id FROM orders WHERE metadata ->> \'promo\' = \'SAVE10\'`. Или через «содержит»: `metadata @> \'{"promo": "SAVE10"}\'` — с GIN-индексом работает на много быстрее. Разница: `->>` возвращает text (не использует GIN), `@>` проверяет вложенность (использует GIN).',
        },
      ],
    },
    {
      id: 'pg-l10-s5',
      title: 'Проверь себя: когда JSONB, а когда колонка',
      type: 'quiz',
      quiz: {
        kind: 'multiple',
        question: 'В каких случаях JSONB оправдан, а в каких — лучше обычная колонка?',
        options: [
          { id: 'a', text: 'Поле `status` (3 значения: new/paid/cancelled), участвует в WHERE и JOIN — лучше обычная колонка' },
          { id: 'b', text: 'Метаданные вебхука, разные для разных клиентов — JSONB' },
          { id: 'c', text: 'Настройки пользователя (гибкая схема, 50 разных полей) — JSONB' },
          { id: 'd', text: 'Поле `total`, по которому строятся отчёты и индексы — лучше JSONB' },
        ],
        correct: ['a', 'b', 'c'],
        explanation:
          'JSONB — для «необязательных, разнообразных, редких» данных: метаданные вебхуков (b), гибкие настройки (c). Обычная колонка — для фиксированных полей, участвующих в WHERE/JOIN/агрегатах (a, d): типизация, индексы работают лучше, понятнее схема. Правило: если поле всегда есть и по нему ищут — колонка; если поле редкое и разное — JSONB.',
      },
    },
  ],
},
        {
          id: 'pg-l11',
          title: 'Полнотекстовый поиск',
          minutes: 30,
          steps: [
            {
              id: 'pg-l11-s1',
              title: 'tsvector и tsquery',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Полнотекстовый поиск (Full-Text Search) — поиск по словам с учётом морфологии, стоп-слов и ранжирования. В PostgreSQL: `tsvector` (документ, разбитый на лексемы) и `tsquery` (поисковый запрос).',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Базовый FTS',
                  code: '-- to_tsvector: документ → лексемы\nSELECT to_tsvector(\'english\', \'The quick brown fox jumps over the lazy dog\');\n-- \'brown\':3 \'dog\':9 \'fox\':4 \'jump\':5 \'lazi\':8 \'quick\':2\n\n-- to_tsquery: запрос\nSELECT to_tsquery(\'english\', \'quick & fox\');\n-- \'quick\' & \'fox\'\n\n-- Поиск: @@ — «соответствует»\nSELECT title FROM articles\nWHERE to_tsvector(\'english\', body) @@ to_tsquery(\'english\', \'quick & fox\');',
                },
                {
                  type: 'list',
                  items: [
                    'to_tsvector — нормализует: убирает стоп-слова, стеммит (jumps → jump), приводит к нижнему регистру',
                    'to_tsquery — из строки делает запрос: `quick & fox`, `quick | fox`, `!quick`',
                    'plainto_tsquery — из «обычной» строки без операторов',
                    'phraseto_tsquery — фразовый поиск',
                    'websearch_to_tsquery — «как Google» (кавычки, OR, -)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Для русского — конфиг `russian`: `to_tsvector(\'russian\', text)`. Стемминг работает (книга → книг), но словарь беднее английского. Для сложных случаев — расширения (hunspell, rumorphology).',
                },
              ],
            },
            {
              id: 'pg-l11-s2',
              title: 'GIN-индекс и ранжирование',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Индекс и поиск с рангом',
                  code: '-- Вычисляемый столбец + GIN-индекс\nALTER TABLE articles\nADD COLUMN search_vec tsvector\nGENERATED ALWAYS AS (to_tsvector(\'russian\', coalesce(title,\'\') || \' \' || coalesce(body,\'\'))) STORED;\n\nCREATE INDEX idx_articles_search ON articles USING GIN(search_vec);\n\n-- Поиск с ранжированием\nSELECT\n  title,\n  ts_rank(search_vec, query) AS rank\nFROM articles, websearch_to_tsquery(\'russian\', \'книга -фантастика\') AS query\nWHERE search_vec @@ query\nORDER BY rank DESC\nLIMIT 10;',
                },
                {
                  type: 'list',
                  items: [
                    'GENERATED ALWAYS AS ... STORED — автоматически поддерживает tsvector при INSERT/UPDATE',
                    'GIN — единственный индекс для tsvector',
                    'ts_rank — релевантность (частота, позиция, вес)',
                    'websearch_to_tsquery — «книга -фантастика» → книга & !фантастика',
                    'pg_trgm лучше для «опечаток» и подстрок, FTS — для слов и морфологии',
                  ],
                },
                {
                  type: 'note',
                  text: 'FTS vs pg_trgm. FTS — «поиск по словам с морфологией»: «книги» найдёт «книга». pg_trgm — «поиск по подстроке с опечатками»: «книг» найдёт «книга», «книги», «книжный». В реальном поиске часто комбинируют: FTS для точного, trgm для опечаток.',
                },
              ],
            },
            {
              id: 'pg-l11-s3',
              title: 'Проверь себя: FTS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой индекс нужен для `tsvector`-колонки?',
                options: [
                  { id: 'a', text: 'B-tree' },
                  { id: 'b', text: 'GIN' },
                  { id: 'c', text: 'BRIN' },
                  { id: 'd', text: 'Hash' },
                ],
                correct: ['b'],
                explanation:
                  'tsvector — множество лексем. GIN (Generalized Inverted Index) идеально подходит: хранит «лексема → список строк». B-tree бесполезен (это не одно значение). BRIN — для сортированных данных. Для FTS — только GIN.',
              },
            },
            {
              id: 'pg-l11-s4',
              title: 'Проверь себя: операторы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте функцию и её назначение',
                pairs: [
                  { left: 'to_tsvector', right: 'Документ → лексемы (нормализация)' },
                  { left: 'to_tsquery', right: 'Строка → запрос с операторами (&, |, !)' },
                  { left: 'websearch_to_tsquery', right: 'Строка «как Google» (кавычки, OR, -)' },
                  { left: 'ts_rank', right: 'Релевантность результата' },
                ],
                explanation:
                  'tsvector — нормализованный документ. to_tsquery — запрос с &/|/!. websearch — «человеческий» ввод. ts_rank — вес для сортировки. Всё вместе — рабочий поиск.',
              },
            },
            {
              id: 'pg-l11-s5',
              title: 'Практика: как работает стемминг',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Под капотом `to_tsvector(\'english\', ...)` — стеммер Портера: он отрезает окончания, чтобы «jumps», «jumping», «jumped» → одна лексема «jump». Реализуем простую имитацию: для списка слов вернуть их основу (без хвоста `s`, `ing`, `ed`).',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'words = ["jumps", "jumping", "jumped", "quick", "foxes"]\n\n# Задача: реализовать stem(word) — отрезать суффикс в порядке приоритета:\n#   -ing, -ed, -s (самый длинный сначала)\n# Если после отрезания слово стало короче 3 символов — оставить как было.\n# Вернуть список основ.\ndef stem(word):\n    pass\n\nresult = ",".join(stem(w) for w in words)\nprint(result)\n',
                    task: 'Реализуйте `stem(word)` — отрезать суффикс `ing`, `ed` или `s` (в этом порядке). Если результат короче 3 символов — вернуть исходное слово. Выведите список основ через запятую.',
                    solution:
                      'words = ["jumps", "jumping", "jumped", "quick", "foxes"]\n\ndef stem(word):\n    for suffix in ("ing", "ed", "s"):\n        if word.endswith(suffix):\n            candidate = word[:-len(suffix)]\n            if len(candidate) >= 3:\n                return candidate\n    return word\n\nresult = ",".join(stem(w) for w in words)\nprint(result)',
                    expected: { type: 'stdout', value: 'jump,jump,jump,quick,foxe' },
                    hint: 'for suffix in ("ing", "ed", "s"): if word.endswith(suffix): candidate = word[:-len(suffix)]; if len(candidate) >= 3: return candidate; return word',
                  },
                },
                {
                  type: 'note',
                  text: 'Реальный стеммер Портера сложнее (работает с шагами, окончаниями `-ational`, `-fulness`, `-ization`), но принцип — «отрезать хвост и проверить, что осталось осмысленное» — тот же. Именно поэтому `to_tsvector(\'книги\')` → `книг`, и поиск по «книга» находит «книги».',
                },
              ],
            },
          ],
        },
        {
          id: 'pg-l12',
          title: 'pg_trgm: нечёткий поиск',
          minutes: 30,
          steps: [
            {
              id: 'pg-l12-s1',
              title: 'Триграммы и похожесть',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'pg_trgm разбивает строку на триграммы (последовательности из 3 символов): `книга` → `  к`, ` кн`, `кни`, `ниг`, `ига`, `га `. По пересечению триграмм вычисляется похожесть (0..1). Работает для опечаток, поиска по подстроке, «похожих» названий.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Похожесть',
                  code: 'CREATE EXTENSION pg_trgm;\n\nSELECT similarity(\'книга\', \'книги\');     -- 0.5\nSELECT similarity(\'книга\', \'книжный\');   -- 0.4\nSELECT similarity(\'книга\', \'автомобиль\'); -- 0.0\n\nSELECT \'книга\' % \'книги\';                -- true (порог по умолчанию 0.3)\nSELECT word_similarity(\'книга\', \'новая книга\'); -- 1.0 (подстрока)',
                },
                {
                  type: 'note',
                  text: 'similarity — общая похожесть. word_similarity — «входит ли одно в другое». Для поиска по подстроке в длинном тексте — word_similarity. Для «опечатка в коротком слове» — similarity.',
                },
              ],
            },
            {
              id: 'pg-l12-s2',
              title: 'GIN + pg_trgm для LIKE и поиска',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Индекс, ускоряющий LIKE',
                  code: '-- Без индекса LIKE \'%iphone%\' — seq scan на миллионах строк\nCREATE INDEX idx_products_name_trgm\nON products USING GIN (name gin_trgm_ops);\n\n-- Теперь LIKE \'%iphone%\' использует индекс\nSELECT * FROM products WHERE name LIKE \'%iphone%\';\n\n-- И нечёткий поиск:\nSELECT name, similarity(name, \'айфон\') AS sim\nFROM products\nWHERE name % \'айфон\'\nORDER BY sim DESC\nLIMIT 10;',
                },
                {
                  type: 'list',
                  items: [
                    'gin_trgm_ops — операторный класс для GIN',
                    'Ускоряет LIKE \'%...%\' (в отличие от B-tree)',
                    'Ускоряет % (похожесть) и similarity()',
                    'Индекс больше и медленнее в записи, чем B-tree — только для текстовых полей',
                    'Альтернатива: GiST (gist_trgm_ops) — медленнее в поиске, быстрее в записи',
                  ],
                },
                {
                  type: 'note',
                  text: 'pg_trgm — must-have для любого поиска по имени/названию/email с опечатками. В отличие от FTS, не требует морфологии и работает «по буквам». В реальных проектах FTS + trgm часто вместе: FTS для «слов», trgm для «опечаток и подстрок».',
                },
              ],
            },
            {
              id: 'pg-l12-s3',
              title: 'Проверь себя: pg_trgm',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой индекс ускоряет `LIKE \'%iphone%\'`?',
                options: [
                  { id: 'a', text: 'B-tree на name' },
                  { id: 'b', text: 'GIN с gin_trgm_ops (pg_trgm)' },
                  { id: 'c', text: 'BRIN' },
                  { id: 'd', text: 'Hash' },
                ],
                correct: ['b'],
                explanation:
                  'LIKE \'%...%\' не использует B-tree (нет префикса). GIN с gin_trgm_ops разбивает строку на триграммы и находит по ним — работает для подстроки в любом месте. Это главный use case pg_trgm.',
              },
            },
            {
              id: 'pg-l12-s4',
              title: 'Практика: similarity через триграммы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '`similarity(a, b)` в pg_trgm = `|trigrams(a) ∩ trigrams(b)| / |trigrams(a) ∪ trigrams(b)|`. Реализуйте формулу вручную: разница между «просто одинаковыми триграммами» и «пересечением / объединением» — это и есть коэффициент Жаккара.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'def trigrams(s):\n    padded = "  " + s.lower() + " "\n    return {padded[i:i+3] for i in range(len(padded) - 2)}\n\ndef similarity(a, b):\n    # Задача: |trigrams(a) & trigrams(b)| / |trigrams(a) | trigrams(b)|\n    pass\n\nresult = round(similarity("книга", "книги"), 2)\nprint(result)\n',
                    task: 'Реализуйте `similarity(a, b)` через триграммы: пересечение / объединение. Округлите результат до 2 знаков.',
                    solution:
                      'def trigrams(s):\n    padded = "  " + s.lower() + " "\n    return {padded[i:i+3] for i in range(len(padded) - 2)}\n\ndef similarity(a, b):\n    ta, tb = trigrams(a), trigrams(b)\n    union = ta | tb\n    if not union:\n        return 0.0\n    return len(ta & tb) / len(union)\n\nresult = round(similarity("книга", "книги"), 2)\nprint(result)',
                    expected: { type: 'stdout', value: '0.5' },
                    hint: 'ta = trigrams(a); tb = trigrams(b); return len(ta & tb) / len(ta | tb)',
                  },
                },
                {
                  type: 'note',
                  text: 'Для «книга» / «книги»: 3 общие триграммы (`  к`, ` кн`, `кни`), объединение — 6 → 0.5. Это и есть порог «похожести», с которым работает `SELECT \'книга\' % \'книги\'` (по умолчанию threshold 0.3). Если поднять — больше точности, меньше находок. Если опустить — наоборот.',
                },
              ],
            },
            {
              id: 'pg-l12-s5',
              title: 'Проверь себя: порог похожести',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: '`SELECT \'книга\' % \'книги\'` — что вернёт и почему?',
                options: [
                  { id: 'a', text: 'false — строки разные' },
                  { id: 'b', text: 'true — similarity ≈ 0.5 > порога по умолчанию 0.3' },
                  { id: 'c', text: 'Ошибку — % требует явного числа' },
                  { id: 'd', text: 'NULL' },
                ],
                correct: ['b'],
                explanation:
                  'Оператор `%` возвращает true, если similarity >= pg_trgm.similarity_threshold (по умолчанию 0.3). Для «книга» и «книги» — 3 общие триграммы из 6, similarity ≈ 0.5 > 0.3. Порог настраивается: SET pg_trgm.similarity_threshold = 0.5. Поднять — меньше false positives, больше false negatives.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m5 — Расширения и pgvector
    // ─────────────────────────────────────────────
    {
      id: 'pg-m5',
      title: 'Расширения и pgvector',
      lessons: [
        {
          id: 'pg-l13',
          title: 'Extensions: pg_stat_statements, uuid-ossp, hstore',
          minutes: 25,
          steps: [
            {
              id: 'pg-l13-s1',
              title: 'CREATE EXTENSION',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Управление расширениями',
                  code: '-- Посмотреть доступные\nSELECT * FROM pg_available_extensions ORDER BY name;\n\n-- Установленные\nSELECT extname, extversion FROM pg_extension;\n\n-- Установить\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nCREATE EXTENSION IF NOT EXISTS pg_stat_statements;\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\n\n-- Обновить\nALTER EXTENSION pg_trgm UPDATE;',
                },
                {
                  type: 'note',
                  text: 'Расширения — «плагины» PostgreSQL. Устанавливаются в БД (не в кластер), хранятся в pg_extension. pg_stat_statements требует shared_preload_libraries + рестарт. Остальные — просто CREATE EXTENSION.',
                },
              ],
            },
            {
              id: 'pg-l13-s2',
              title: 'Полезные расширения',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Топ-10 расширений',
                  head: ['Расширение', 'Что даёт'],
                  rows: [
                    ['pg_stat_statements', 'Топ запросов по времени'],
                    ['pg_trgm', 'Нечёткий поиск, LIKE \'%...%\''],
                    ['uuid-ossp / pgcrypto', 'UUID (v1, v4), шифрование'],
                    ['hstore', 'Key-value хранилище (до JSONB)'],
                    ['citext', 'Case-insensitive text'],
                    ['postgis', 'Геометрия, GIS'],
                    ['pgvector', 'Векторный поиск для LLM/RAG'],
                    ['pg_partman', 'Автоматическое управление партициями'],
                    ['pg_repack', 'Онлайн-сжатие таблиц (без VACUUM FULL)'],
                    ['pg_cron', 'Cron внутри PostgreSQL'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Практика: uuid, citext, hstore',
                  code: '-- UUID\nCREATE EXTENSION "uuid-ossp";\nSELECT uuid_generate_v4();\n\n-- Или встроенный gen_random_uuid() (PG 13+, без расширения!)\nSELECT gen_random_uuid();\n\n-- citext — регистронезависимый email\nCREATE EXTENSION citext;\nCREATE TABLE users (email citext UNIQUE);\nINSERT INTO users VALUES (\'A@B.com\');\nSELECT * FROM users WHERE email = \'a@b.com\';   -- найдёт',
                },
              ],
            },
            {
              id: 'pg-l13-s3',
              title: 'Проверь себя: расширения',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте расширение и его назначение',
                pairs: [
                  { left: 'pg_stat_statements', right: 'Статистика запросов' },
                  { left: 'pg_trgm', right: 'Нечёткий поиск, LIKE \'%...%\'' },
                  { left: 'citext', right: 'Регистронезависимый текст' },
                  { left: 'pg_partman', right: 'Автоуправление партициями' },
                ],
                explanation:
                  'stat_statements — мониторинг. trgm — поиск. citext — email/логины без lower(). partman — создание/удаление партиций по расписанию.',
              },
            },
            {
              id: 'pg-l13-s4',
              title: 'Проверь себя: UUID',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В PostgreSQL 13+ можно генерировать UUID без расширения. Какая функция?',
                options: [
                  { id: 'a', text: 'uuid_generate_v4()' },
                  { id: 'b', text: 'gen_random_uuid()' },
                  { id: 'c', text: 'uuid()' },
                  { id: 'd', text: 'random_uuid()' },
                ],
                correct: ['b'],
                explanation:
                  'gen_random_uuid() — встроена с PG 13. uuid_generate_v4() — из расширения uuid-ossp (нужна установка). В новых проектах — gen_random_uuid(), без расширения.',
              },
            },
            {
              id: 'pg-l13-s5',
              title: 'Проверь себя: shared_preload_libraries',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какое из расширений ТРЕБУЕТ правки `shared_preload_libraries` и рестарта PostgreSQL?',
                options: [
                  { id: 'a', text: 'pg_trgm' },
                  { id: 'b', text: 'pg_stat_statements' },
                  { id: 'c', text: 'uuid-ossp' },
                  { id: 'd', text: 'citext' },
                ],
                correct: ['b'],
                explanation:
                  'pg_stat_statements перехватывает все запросы на уровне postmaster — поэтому его библиотека должна загружаться ДО старта PostgreSQL. Порядок: (1) добавить в shared_preload_libraries, (2) рестарт, (3) CREATE EXTENSION. Остальные расширения (trgm, uuid-ossp, citext) — просто CREATE EXTENSION без рестарта.',
              },
            },
          ],
        },
        {
          id: 'pg-l14',
          title: 'pgvector: векторный поиск для RAG',
          minutes: 30,
          steps: [
            {
              id: 'pg-l14-s1',
              title: 'Зачем pgvector',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'pgvector — расширение для хранения и поиска по векторам (embeddings). Главный use case — RAG (Retrieval-Augmented Generation): вы храните эмбеддинги документов в PostgreSQL и ищете ближайшие к эмбеддингу запроса. Альтернатива отдельной векторной БД (Qdrant, Pinecone) — часто избыточна, если у вас уже есть PostgreSQL.',
                },
                {
                  type: 'mermaid',
                  caption: 'RAG на pgvector',
                  code: 'graph LR\n  Doc["Документ"] -->|"embed()"| V1["vector(1536)"]\n  V1 --> PG[("PostgreSQL<br/>+ pgvector<br/>+ HNSW")]\n  Q["Вопрос"] -->|"embed()"| V2["vector(1536)"]\n  V2 -->|"ORDER BY embedding <=> V2<br/>LIMIT 5"| PG\n  PG -->|"5 ближайших чанков"| LLM["LLM + контекст"]\n  LLM --> Ans["Ответ"]',
                },
                {
                  type: 'note',
                  text: 'Правило: «начинайте с pgvector, если уже есть PostgreSQL». До 1–10M векторов работает отлично. Для миллиардов — Qdrant/Milvus. Экономит инфраструктуру, транзакции, бэкапы — всё в одной БД.',
                },
              ],
            },
            {
              id: 'pg-l14-s2',
              title: 'HNSW и ivfflat',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Установка и простой поиск',
                  code: 'CREATE EXTENSION vector;\n\nCREATE TABLE documents (\n  id        bigserial PRIMARY KEY,\n  content   text,\n  embedding vector(1536)       -- размерность = модель embedding\n);\n\n-- Простой поиск (без индекса — seq scan, медленно)\nSELECT id, content\nFROM documents\nORDER BY embedding <=> \'[0.1, 0.2, ...]\'::vector\nLIMIT 5;\n-- <=> — косинусное расстояние',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Индексы: HNSW vs ivfflat',
                  code: '-- HNSW — быстрее поиск, дольше построение, больше RAM\nCREATE INDEX idx_documents_embedding_hnsw\nON documents USING hnsw (embedding vector_cosine_ops)\nWITH (m = 16, ef_construction = 64);\n\n-- ivfflat — быстрее построение, требует данные заранее\nCREATE INDEX idx_documents_embedding_ivf\nON documents USING ivfflat (embedding vector_cosine_ops)\nWITH (lists = 100);\n\n-- После создания ivfflat — настроить probes (точность/скорость)\nSET ivfflat.probes = 10;   -- больше — точнее, но медленнее',
                },
                {
                  type: 'table',
                  caption: 'HNSW vs ivfflat',
                  head: ['Критерий', 'HNSW', 'ivfflat'],
                  rows: [
                    ['Скорость поиска', 'Быстрее', 'Медленнее'],
                    ['Построение', 'Долго', 'Быстро'],
                    ['RAM', 'Много', 'Меньше'],
                    ['Когда строить', 'Можно на пустой таблице', 'Нужны данные (кластеризация)'],
                    ['Точность', 'Высокая', 'Зависит от probes'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Стандарт 2025 — HNSW. Требует памяти (индекс в RAM), но даёт лучший recall. ivfflat — когда данных мало или нет ресурсов на HNSW. После создания HNSW можно настроить `SET hnsw.ef_search = 40` (больше — точнее, медленнее).',
                },
              ],
            },
            {
              id: 'pg-l14-s3',
              title: 'Проверь себя: pgvector',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой оператор в pgvector вычисляет косинусное расстояние?',
                options: [
                  { id: 'a', text: '<->' },
                  { id: 'b', text: '<=>' },
                  { id: 'c', text: '<#>' },
                  { id: 'd', text: '@>' },
                ],
                correct: ['b'],
                explanation:
                  '<=> — косинусное расстояние. <-> — L2 (евклидово). <#> — скалярное произведение (отрицательное). @> — не про векторы (это JSONB «содержит»). Для текстовых эмбеддингов — косинусное.',
              },
            },
            {
              id: 'pg-l14-s4',
              title: 'Проверь себя: индексы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой индекс pgvector выбрать по умолчанию в 2025?',
                options: [
                  { id: 'a', text: 'B-tree' },
                  { id: 'b', text: 'ivfflat' },
                  { id: 'c', text: 'HNSW' },
                  { id: 'd', text: 'GIN' },
                ],
                correct: ['c'],
                explanation:
                  'HNSW — стандарт: быстрее поиск, лучше recall, можно строить на пустой таблице. Требует RAM (индекс в памяти). ivfflat — быстрее строится, но требует данных и настройки probes. B-tree/GIN не работают с векторами.',
              },
            },
            {
              id: 'pg-l14-s5',
              title: 'Практика: cosine similarity',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Под капотом `<=>` в pgvector — косинусное расстояние: `1 - cos(a, b)`. Cosine similarity = скалярное произведение / (|a| × |b|). Чем ближе к 1 — тем «похожее» векторы. Реализуем вручную — это база для понимания RAG.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'import math\n\n# Задача: реализовать cosine(a, b) — косинусное сходство двух векторов.\n# Формула: dot(a, b) / (|a| * |b|)\n# |v| = sqrt(sum(x*x for x in v))\n\ndef cosine(a, b):\n    pass\n\na = [1.0, 2.0, 3.0]\nb = [4.0, 5.0, 6.0]\nresult = cosine(a, b)\nprint(f"{result:.4f}")\n',
                    task: 'Реализуйте `cosine(a, b)` — косинусное сходство двух векторов. Формула: `dot(a, b) / (|a| * |b|)`, где `|v| = sqrt(sum(x²))`. Для примера выведите результат с точностью 4 знака.',
                    solution:
                      'import math\n\ndef cosine(a, b):\n    dot = sum(x * y for x, y in zip(a, b))\n    mag_a = math.sqrt(sum(x * x for x in a))\n    mag_b = math.sqrt(sum(y * y for y in b))\n    return dot / (mag_a * mag_b)\n\na = [1.0, 2.0, 3.0]\nb = [4.0, 5.0, 6.0]\nresult = cosine(a, b)\nprint(f"{result:.4f}")',
                    expected: { type: 'stdout', value: '0.9746' },
                    hint: 'dot = sum(x*y for x,y in zip(a,b)); mag = math.sqrt(sum(x*x for x in v)); dot/(mag_a*mag_b)',
                  },
                },
                {
                  type: 'note',
                  text: 'Для [1,2,3] и [4,5,6] cosine = 32 / (√14 × √77) ≈ 0.9746. Оба вектора «смотрят в одном направлении» (координаты растут пропорционально) — поэтому близко к 1. В RAG: cosine ≈ 1 означает «эмбеддинг документа почти совпадает с эмбеддингом вопроса» — это и есть кандидат на ответ.',
                },
              ],
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m6 — Репликация, бэкапы, пулинг
    // ─────────────────────────────────────────────
    {
      id: 'pg-m6',
      title: 'Репликация, бэкапы, пулинг',
      lessons: [
        {
          id: 'pg-l15',
          title: 'Репликация: streaming и logical',
          minutes: 30,
          steps: [
            {
              id: 'pg-l15-s1',
              title: 'Streaming replication',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Streaming replication — физическая репликация: standby-сервер получает поток WAL от primary и применяет его. Standby — точная копия (байт-в-байт). Используется для отказоустойчивости (failover) и чтения (read replicas).',
                },
                {
                  type: 'mermaid',
                  caption: 'Primary → standby через WAL',
                  code: `graph LR
                    Client["Клиент (write)"] --> Primary[("Primary<br/>wal_level=replica")]
                    Primary -->|"WAL stream"| Standby1[("Standby 1<br/>(read-only)")]
                    Primary -->|"WAL stream"| Standby2[("Standby 2<br/>(read-only)")]
                    ReadClient["Клиент (read)"] -.-> Standby1
                    ReadClient -.-> Standby2`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Настройка primary',
                  code: `# postgresql.conf\nwal_level = replica\nmax_wal_senders = 10\nwal_keep_size = '1GB'\n\n# pg_hba.conf — разрешить standby\nhost replication replicator 10.0.0.0/24 md5\n\n# Создать пользователя\nCREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secret';`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Настройка standby (pg_basebackup)',
                  code: `# На standby: скопировать базу с primary\npg_basebackup -h primary-ip -D /var/lib/postgresql/data \\\n  -U replicator -P -Xs -R\n\n# -R создаёт standby.signal и прописывает primary_conninfo\n# Standby автоматически начнёт применять WAL`,
                },
              ],
            },
            {
              id: 'pg-l15-s2',
              title: 'Синхронная vs асинхронная',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Sync vs async',
                  head: ['Режим', 'Commit ждёт', 'Риск'],
                  rows: [
                    ['Async (дефолт)', 'Только локальный WAL', 'При падении primary — потеря последних транзакций'],
                    ['Sync', 'Подтверждения от standby', 'Медленнее (ждёт сеть), но 0 потерь данных'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Синхронная репликация',
                  code: `-- На primary:\nALTER SYSTEM SET synchronous_standby_names = 'standby1';\nSELECT pg_reload_conf();\n\n-- Commit ждёт, пока standby1 применит WAL\n-- Если standby1 недоступен — primary ЗАВИСНЕТ\n\n-- Компромисс: FIRST 1 (standby1, standby2) — ждать хотя бы один\nALTER SYSTEM SET synchronous_standby_names = 'FIRST 1 (standby1, standby2)';`,
                },
                {
                  type: 'note',
                  text: 'Синхронная репликация — «0 потерь при failover», но primary может зависнуть, если standby недоступен. Стандарт для финансов. Для остальных — async + PITR-бэкапы. На собеседовании: «sync vs async replication» — частый вопрос.',
                },
              ],
            },
            {
              id: 'pg-l15-s3',
              title: 'Logical replication',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Logical replication',
                  code: `-- На primary: wal_level = logical\nCREATE PUBLICATION my_pub FOR TABLE users, orders;\n\n-- На standby:\nCREATE SUBSCRIPTION my_sub\nCONNECTION 'host=primary-ip dbname=app user=replicator password=secret'\nPUBLICATION my_pub;\n\n-- Standby получает изменения таблиц users и orders`,
                },
                {
                  type: 'list',
                  items: [
                    'Logical — на уровне таблиц, а не всего кластера',
                    'Standby может быть другой версии PG (например, 16 → 17)',
                    'Standby может принимать запись (не read-only)',
                    'Используется для: миграции между версиями, CDC (Debezium), шардирования, аналитики',
                    'Slower, чем streaming — не для high-load HA',
                  ],
                },
                {
                  type: 'note',
                  text: 'Выбор: streaming — для HA и read replicas. Logical — для миграций, CDC, разных схем. Оба — через WAL, но с разным уровнем детализации. В 2025 logical replication стала стабильной и широко используется.',
                },
              ],
            },
            {
              id: 'pg-l15-s4',
              title: 'Проверь себя: репликация',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения о logical replication верны?',
                options: [
                  { id: 'a', text: 'Реплицирует отдельные таблицы, а не весь кластер' },
                  { id: 'b', text: 'Требует wal_level = logical' },
                  { id: 'c', text: 'Standby в logical replication всегда read-only' },
                  { id: 'd', text: 'Standby может быть другой версии PostgreSQL' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Logical — по таблицам, требует wal_level=logical, позволяет standby другой версии (и даже запись). Streaming — весь кластер, standby read-only, та же версия. Для HA — streaming, для миграций/CDC — logical.',
              },
            },
            {
              id: 'pg-l15-s5',
              title: 'Проверь себя: sync',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если synchronous_standby_names задан, а standby недоступен?',
                options: [
                  { id: 'a', text: 'Репликация автоматически переключится на async' },
                  { id: 'b', text: 'Commit на primary будет ждать (primary «зависнет»)' },
                  { id: 'c', text: 'Standby автоматически перезапустится' },
                  { id: 'd', text: 'Ничего' },
                ],
                correct: ['b'],
                explanation:
                  'Синхронная репликация ждёт подтверждения от standby. Если standby упал — commit не может завершиться, primary «зависает» на записи. Решение: FIRST 1 (a,b) — ждать хотя бы один, или переключиться в async при инциденте.',
              },
            },
          ],
        },
        {
          id: 'pg-l16',
          title: 'Бэкапы: pg_dump, PITR, pgBackRest',
          minutes: 30,
          steps: [
            {
              id: 'pg-l16-s1',
              title: 'Логический бэкап: pg_dump',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'pg_dump',
                  code: '# Одна база\npg_dump -h localhost -U postgres -d mydb -Fc -f mydb.dump\n\n# -Fc — custom format (сжатый, восстанавливается параллельно)\n# -Fd — directory format (параллельный дамп)\n\n# Восстановление\npg_restore -h localhost -U postgres -d mydb_new -Fc mydb.dump -j 4\n\n# SQL-дамп (текстовый)\npg_dump -h localhost -U postgres mydb > mydb.sql\npsql -h localhost -U postgres mydb_new < mydb.sql',
                },
                {
                  type: 'list',
                  items: [
                    'pg_dump — логический бэкап (SQL-команды, а не файлы)',
                    'Восстанавливается на другую версию PG, другую ОС',
                    'Не даёт point-in-time recovery',
                    'Медленный для больших БД (>100 GB)',
                    'Для регулярных бэкапов — cron + pg_dump в S3',
                  ],
                },
                {
                  type: 'note',
                  text: 'pg_dump — не для HA и не для PITR. Это «снимок» на момент дампа. Если нужно «откатиться на 3 часа назад» — нужен PITR (следующий шаг). pg_dump хорош для небольших БД и миграций между версиями.',
                },
              ],
            },
            {
              id: 'pg-l16-s2',
              title: 'PITR: point-in-time recovery',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'PITR: base backup + WAL → откат на момент',
                  code: 'graph LR\n  BB["pg_basebackup<br/>(воскресенье 00:00)"] --> Restore["Восстановление"]\n  WAL["WAL-архив<br/>(каждые 16 MB)"] --> Restore\n  Restore -->|"replay до 14:35"| Point["Состояние<br/>на 14:35"]\n  Point -.->|"откат"| Before["До ошибочного<br/>DELETE в 14:30"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Настройка WAL archiving',
                  code: '# postgresql.conf\nwal_level = replica\narchive_mode = on\narchive_command = \'aws s3 cp %p s3://my-pg-wal/%f\'\n\n# pg_basebackup — раз в день\npg_basebackup -h localhost -D /backup/base-$(date +%F) -Ft -z -P\n\n# WAL-файлы автоматически уходят в S3',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Восстановление на момент',
                  code: '# 1. Восстановить base backup\n# 2. В postgresql.conf:\nrestore_command = \'aws s3 cp s3://my-pg-wal/%f %p\'\nrecovery_target_time = \'2025-01-15 14:30:00\'\n\n# 3. Создать recovery.signal\ntouch $PGDATA/recovery.signal\n\n# 4. Стартовать PostgreSQL — он применит WAL до 14:30 и остановится\npg_ctl start',
                },
                {
                  type: 'note',
                  text: 'PITR — единственный способ «откатиться на 5 минут назад». Основа — base backup + WAL-архив. В продакшене — pgBackRest или Barman: автоматизируют всё (base, WAL, retention, проверка восстановления). Ручной PITR — только в учебных целях.',
                },
              ],
            },
            {
              id: 'pg-l16-s3',
              title: 'pgBackRest и Barman',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Инструменты бэкапов',
                  head: ['Инструмент', 'Плюсы', 'Минусы'],
                  rows: [
                    ['pg_dump', 'Простой, переносимый', 'Нет PITR, медленный на больших'],
                    ['pgBackRest', 'PITR, инкременты, параллельность, проверка', 'Кривая обучения'],
                    ['Barman', 'PITR, retention, облака', 'Свой сервис'],
                    ['WAL-G', 'Простой, S3-нативный', 'Меньше фич, чем pgBackRest'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'pgBackRest: типичный workflow',
                  code: '# pgbackrest.conf\n[global]\nrepo1-path=/var/lib/pgbackrest\nrepo1-retention-full=4\n\n[mycluster]\npg1-path=/var/lib/postgresql/data\n\n# Full backup раз в неделю\npgbackrest --stanza=mycluster --type=full backup\n\n# Инкремент каждый день\npgbackrest --stanza=mycluster --type=incr backup\n\n# Проверить восстановление (обязательно!)\npgbackrest --stanza=mycluster --type=time \\\n  --target=\'2025-01-15 14:30:00\' restore',
                },
                {
                  type: 'note',
                  text: 'Правило: «бэкап не существует, пока вы не восстановили его». Раз в месяц — тестовое восстановление на отдельный сервер. Иначе в момент инцидента выяснится, что бэкап битый, а WAL не архивировался 3 дня.',
                },
              ],
            },
            {
              id: 'pg-l16-s4',
              title: 'Проверь себя: бэкапы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что нужно для point-in-time recovery (PITR)?',
                options: [
                  { id: 'a', text: 'Только pg_dump' },
                  { id: 'b', text: 'Base backup + архив WAL + recovery_target_time' },
                  { id: 'c', text: 'Только streaming replication' },
                  { id: 'd', text: 'VACUUM FULL' },
                ],
                correct: ['b'],
                explanation:
                  'PITR = base backup + WAL archive. Восстанавливаем базу, потом применяем WAL до нужного момента. Без WAL-архива — только состояние на момент base backup (потеря часов/дней). pgBackRest/Barman автоматизируют это.',
              },
            },
            {
              id: 'pg-l16-s5',
              title: 'Практика: сколько WAL накопится за сутки',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'PITR работает, только если WAL-файлы успевают архивироваться в S3/на диск. Если объём WAL больше пропускной способности архива или свободного места — PITR невозможен (PostgreSQL остановится, когда pg_wal заполнит диск). Реальная задача: прикинуть объём WAL за сутки.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'wal_mb_per_min = 120   # средний объём WAL\nhours = 24\n\n# Задача: посчитать, сколько GB WAL накопится за сутки.\n# Формула: wal_mb_per_min * 60 * hours / 1024\n# Формат: два знака после точки\n\ntotal_gb = None  # TODO\nprint(f"{total_gb:.2f} GB")\n',
                    task: 'Посчитайте, сколько GB WAL накопится за сутки: 120 MB/min × 60 × 24 / 1024. Выведите с точностью до 2 знаков.',
                    solution:
                      'wal_mb_per_min = 120\nhours = 24\n\ntotal_gb = wal_mb_per_min * 60 * hours / 1024\nprint(f"{total_gb:.2f} GB")',
                    expected: { type: 'stdout', value: '168.75 GB' },
                    hint: 'total_gb = wal_mb_per_min * 60 * hours / 1024; print(f"{total_gb:.2f} GB")',
                  },
                },
                {
                  type: 'note',
                  text: '168 GB/сутки — это 5 TB/месяц. Если бэкап-бакет на 1 TB — PITR поедет через неделю. Именно поэтому на проде: retention (сколько хранить), сжатие WAL (wal_compression), инкрементальные base backup (pgBackRest), мониторинг размера pg_wal. «Бэкап настроен» — это не «pg_dump раз в день», это «PITR с проверкой восстановления».',
                },
              ],
            },
          ],
        },
        {
          id: 'pg-l17',
          title: 'PgBouncer и пулинг соединений',
          minutes: 25,
          steps: [
            {
              id: 'pg-l17-s1',
              title: 'Зачем PgBouncer',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'PostgreSQL — процесс-на-соединение. 500 соединений = 500 процессов × 10 MB = 5 GB RAM + конкуренция за CPU. PgBouncer — лёгкий прокси: держит сотни клиентских соединений и десятки реальных к PostgreSQL, переиспользуя их.',
                },
                {
                  type: 'mermaid',
                  caption: 'PgBouncer: 500 клиентов → 20 соединений к PG',
                  code: 'graph LR\n  C1["Клиент 1"] --> PB["PgBouncer<br/>(порт 6432)"]\n  C2["Клиент 2"] --> PB\n  C3["..."] --> PB\n  C500["Клиент 500"] --> PB\n  PB -->|"20 соединений"| PG[("PostgreSQL<br/>max_connections=100")]',
                },
                {
                  type: 'table',
                  caption: 'Режимы пулинга',
                  head: ['Режим', 'Что переиспользует', 'Когда'],
                  rows: [
                    ['session', 'Соединение на всю сессию клиента', 'Осторожно: почти не экономит'],
                    ['transaction', 'Соединение на транзакцию', 'Стандарт для веба/API'],
                    ['statement', 'Соединение на запрос', 'Редко (multi-statement не работает)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'transaction — стандарт. Клиент взял соединение → начал транзакцию → закоммитил → вернул в пул. Между транзакциями соединение свободно. Но: prepared statements (с PG 14+ работают), advisory locks, LISTEN — не дружат с transaction. Учитывайте.',
                },
              ],
            },
            {
              id: 'pg-l17-s2',
              title: 'Настройка и мониторинг',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'pgbouncer.ini',
                  code: '[databases]\nmyapp = host=postgres port=5432 dbname=myapp\n\n[pgbouncer]\nlisten_port = 6432\npool_mode = transaction\nmax_client_conn = 1000\n\ndefault_pool_size = 20          ; соединений к PG на пару (user, db)\nmin_pool_size = 5\nreserve_pool_size = 5\nreserve_pool_timeout = 3\n\nserver_idle_timeout = 600\nquery_wait_timeout = 120',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Мониторинг через admin-консоль PgBouncer',
                  code: '-- Подключиться: psql -p 6432 -U pgbouncer pgbouncer\nSHOW POOLS;       -- клиенты, серверы, ожидания\nSHOW STATS;       -- запросы, время\nSHOW CLIENTS;     -- кто подключён\nSHOW SERVERS;     -- соединения к PG\nSHOW CONFIG;      -- текущий конфиг',
                },
                {
                  type: 'note',
                  text: 'Ошибка новичков: поставить PgBouncer в transaction mode, а приложение использует advisory locks или LISTEN/NOTIFY — сломается. В session mode они работают, но пулинг почти не экономит. Тестируйте режим на staging.',
                },
              ],
            },
            {
              id: 'pg-l17-s3',
              title: 'Проверь себя: PgBouncer',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой режим пулинга PgBouncer стандартен для веб/API?',
                options: [
                  { id: 'a', text: 'session' },
                  { id: 'b', text: 'transaction' },
                  { id: 'c', text: 'statement' },
                  { id: 'd', text: 'connection' },
                ],
                correct: ['b'],
                explanation:
                  'transaction — «соединение на транзакцию»: клиент взял, закоммитил, вернул. Максимальная экономия. session почти не экономит. statement ломает multi-statement. Стандарт — transaction.',
              },
            },
            {
              id: 'pg-l17-s4',
              title: 'Проверь себя: ограничения',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что НЕ работает (или работает плохо) в transaction mode PgBouncer?',
                options: [
                  { id: 'a', text: 'LISTEN/NOTIFY' },
                  { id: 'b', text: 'Advisory locks через сессии' },
                  { id: 'c', text: 'Обычные SELECT/INSERT/UPDATE' },
                  { id: 'd', text: 'Временные таблицы (если живут между транзакциями)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'В transaction mode клиентские транзакции могут попадать на разные серверные соединения. LISTEN/NOTIFY, session-level advisory locks, временные таблицы между транзакциями — не работают. Обычные запросы — работают отлично. Prepared statements — с PG 14+ работают.',
              },
            },
            {
              id: 'pg-l17-s5',
              title: 'Практика: сколько реальных соединений к PG',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Главная формула PgBouncer: `default_pool_size` — сколько реальных соединений к PostgreSQL на каждую пару (user, db). При 1000 клиентах и default_pool_size=20 — к PG пойдёт максимум 20, а не 1000. Реальная задача: посчитать, влезет ли это в `max_connections`.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'clients = 1000           # клиентов в PgBouncer\npool_size = 20           # default_pool_size (соединений к PG)\nadmin_conns = 10         # админские + репликация + мониторинг\nmax_connections = 100    # настройка PostgreSQL\n\n# Задача: посчитать, сколько реальных соединений к PG нужно.\n# Формула: pool_size + admin_conns\n# Вывести: "<нужно> соединений, max_connections=<лимит>, влезает: <да/нет>"\n# да — если нужно <= max_connections, иначе "нет"\n\nneeded = None  # TODO\nfits = None    # TODO (bool)\nprint(f"{needed} соединений, max_connections={max_connections}, влезает: {\'да\' if fits else \'нет\'}")\n',
                    task: 'Посчитайте `needed = pool_size + admin_conns` и `fits = needed <= max_connections`. Выведите в указанном формате.',
                    solution:
                      'clients = 1000\npool_size = 20\nadmin_conns = 10\nmax_connections = 100\n\nneeded = pool_size + admin_conns\nfits = needed <= max_connections\nprint(f"{needed} соединений, max_connections={max_connections}, влезает: {\'да\' if fits else \'нет\'}")',
                    expected: { type: 'stdout', value: '30 соединений, max_connections=100, влезает: да' },
                    hint: 'needed = pool_size + admin_conns; fits = needed <= max_connections',
                  },
                },
                {
                  type: 'note',
                  text: '30 реальных соединений вместо 1000 — вот главная ценность PgBouncer. 30 × 10 MB = 300 MB RAM вместо 10 GB. `max_connections=100` хватает с запасом. Правило: держите `default_pool_size` маленьким (20–30) и измеряйте latency — если запросы стоят в `SHOW POOLS` (cl_waiting > 0), увеличивайте пул. Не «на всякий случай 200».',
                },
              ],
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m7 — Безопасность и PL/pgSQL
    // ─────────────────────────────────────────────
    {
      id: 'pg-m7',
      title: 'Безопасность и PL/pgSQL',
      lessons: [
        {
          id: 'pg-l18',
          title: 'Роли, GRANT, Row-Level Security',
          minutes: 30,
          steps: [
            {
              id: 'pg-l18-s1',
              title: 'Роли и привилегии',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Создание ролей',
                  code: '-- Роль-пользователь (с логином)\nCREATE ROLE app_user LOGIN PASSWORD \'secret\';\n\n-- Роль-группа (без логина, для прав)\nCREATE ROLE app_read;\nCREATE ROLE app_write;\n\n-- Выдать права\nGRANT CONNECT ON DATABASE myapp TO app_user;\nGRANT USAGE ON SCHEMA public TO app_read, app_write;\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO app_read;\nGRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_write;\nGRANT app_read, app_write TO app_user;\n\n-- Права на будущие таблицы\nALTER DEFAULT PRIVILEGES IN SCHEMA public\nGRANT SELECT ON TABLES TO app_read;',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'pg_hba.conf: кто откуда и как',
                  code: '# TYPE  DATABASE  USER      ADDRESS        METHOD\nlocal   all       postgres                 peer\nhost    all       app_user  10.0.0.0/24    scram-sha-256\nhost    replication replicator 10.0.0.0/24 md5\nhost    all       all       0.0.0.0/0      reject',
                },
                {
                  type: 'note',
                  text: 'Принцип наименьших привилегий: app_user получает ровно то, что нужно. Не «всё и superuser». Отдельные роли для миграций (DDL), для приложения (DML), для аналитики (только SELECT). Никогда не используйте postgres/superuser в приложении.',
                },
              ],
            },
            {
              id: 'pg-l18-s2',
              title: 'Row-Level Security (RLS)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'RLS — политики на уровне строк: пользователь видит только «свои» строки. Классика для multi-tenant SaaS: каждый tenant видит только свои данные. Без RLS — фильтровать в каждом запросе (`WHERE tenant_id = ?`), легко забыть и утечь данные.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'RLS для multi-tenant',
                  code: '-- Таблица с tenant_id\nCREATE TABLE documents (\n  id        bigserial PRIMARY KEY,\n  tenant_id int NOT NULL,\n  content   text\n);\n\n-- Включить RLS\nALTER TABLE documents ENABLE ROW LEVEL SECURITY;\n\n-- Политика: видеть только строки своего tenant\nCREATE POLICY tenant_isolation ON documents\nUSING (tenant_id = current_setting(\'app.tenant_id\')::int);\n\n-- Приложение при подключении:\nSET app.tenant_id = \'42\';\nSELECT * FROM documents;   -- вернёт только tenant_id = 42',
                },
                {
                  type: 'list',
                  items: [
                    'ENABLE ROW LEVEL SECURITY — включает политики',
                    'CREATE POLICY — «USING» фильтрует SELECT/UPDATE/DELETE, «WITH CHECK» — INSERT/UPDATE',
                    'current_setting — читает переменную сессии, которую ставит приложение',
                    'По умолчанию — «ничего не видно», нужно явно разрешать',
                    'superuser и BYPASSRLS обходят политику — не давайте приложению',
                  ],
                },
                {
                  type: 'note',
                  text: 'RLS — главный инструмент multi-tenant SaaS на PostgreSQL. Каждый запрос автоматически фильтруется, приложение не может «забыть WHERE». Минус: сложнее отладка, требует передачи tenant_id через SET в каждом соединении (PgBouncer + transaction mode — аккуратно).',
                },
              ],
            },
            {
              id: 'pg-l18-s3',
              title: 'Проверь себя: RLS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `ALTER TABLE documents ENABLE ROW LEVEL SECURITY`?',
                options: [
                  { id: 'a', text: 'Шифрует таблицу' },
                  { id: 'b', text: 'Включает политики на уровне строк (без политик — никто ничего не видит)' },
                  { id: 'c', text: 'Создаёт резервную копию' },
                  { id: 'd', text: 'Запрещает DELETE' },
                ],
                correct: ['b'],
                explanation:
                  'ENABLE RLS включает механизм. Пока нет ни одной CREATE POLICY — никто (кроме superuser/BYPASSRLS) не видит ни одной строки. Дальше вы разрешаете через политики: «tenant_id = current_setting(...)».',
              },
            },
            {
              id: 'pg-l18-s4',
              title: 'Проверь себя: наименьшие привилегии',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Приложению нужно только читать данные. Какой набор прав выдать?',
                options: [
                  { id: 'a', text: 'GRANT ALL ON DATABASE + SUPERUSER' },
                  { id: 'b', text: 'GRANT SELECT ON ALL TABLES IN SCHEMA public' },
                  { id: 'c', text: 'Пароль от postgres в конфиге' },
                  { id: 'd', text: 'Роль с BYPASSRLS' },
                ],
                correct: ['b'],
                explanation:
                  'Принцип наименьших привилегий: только SELECT. SUPERUSER (a) — полный доступ, любая уязвимость = полный compromise. Пароль от postgres (c) — то же. BYPASSRLS (d) обходит политики, которые могут защищать от утечки между tenant-ами. Приложение никогда не должно подключаться как superuser.',
              },
            },
            {
              id: 'pg-l18-s5',
              title: 'Практика: отфильтровать по tenant_id',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '`CREATE POLICY ... USING (tenant_id = current_setting(\'app.tenant_id\')::int)` — под капотом это автодобавление `WHERE tenant_id = <текущий>`. В песочнице (SQLite) `current_setting` нет, но идея та же: фильтр по конкретному tenant. Реализуем через подстановку значения.',
                },
                {
                  type: 'sandbox',
                  sandbox: {
                    schema:
                      'CREATE TABLE documents (id INTEGER, tenant_id INTEGER, content TEXT);\nINSERT INTO documents VALUES\n  (1, 42, \'документ A\'),\n  (2, 42, \'документ B\'),\n  (3, 99, \'секрет конкурента\'),\n  (4, 42, \'документ C\'),\n  (5, 7,  \'чужой\');',
                    task: 'Сымитируйте RLS: выберите id и content только для tenant_id = 42 (как будто current_setting вернул 42). Отсортируйте по id.',
                    solution:
                      'SELECT id, content\nFROM documents\nWHERE tenant_id = 42\nORDER BY id;',
                    expected: {
                      columns: ['id', 'content'],
                      rows: [
                        [1, 'документ A'],
                        [2, 'документ B'],
                        [4, 'документ C'],
                      ],
                      order: 'order',
                    },
                    hint: 'WHERE tenant_id = 42 ORDER BY id — без WHERE увидите «секрет конкурента»',
                  },
                },
                {
                  type: 'note',
                  text: 'Реальный RLS делает то же самое, но на уровне ядра: `USING (tenant_id = current_setting(\'app.tenant_id\')::int)`. Приложение не пишет `WHERE tenant_id = ?` — PostgreSQL добавляет его автоматически ко всем SELECT/UPDATE/DELETE. Даже если разработчик забудет WHERE в коде — утечки не будет. Именно поэтому RLS — стандарт для multi-tenant на PostgreSQL.',
                },
              ],
            },
          ],
        },
        {
          id: 'pg-l19',
          title: 'PL/pgSQL: функции и триггеры',
          minutes: 30,
          steps: [
            {
              id: 'pg-l19-s1',
              title: 'Функции на PL/pgSQL',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Функция',
                  code: 'CREATE OR REPLACE FUNCTION calculate_discount(amount numeric, customer_type text)\nRETURNS numeric\nLANGUAGE plpgsql\nAS $$\nDECLARE\n  discount numeric := 0;\nBEGIN\n  CASE customer_type\n    WHEN \'vip\' THEN discount := 0.10;\n    WHEN \'regular\' THEN discount := 0.05;\n    ELSE discount := 0;\n  END CASE;\n\n  RETURN amount * (1 - discount);\nEND;\n$$;\n\n-- Использование\nSELECT calculate_discount(1000, \'vip\');   -- 900.00',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Функция, возвращающая таблицу',
                  code: 'CREATE OR REPLACE FUNCTION top_customers(min_total numeric)\nRETURNS TABLE(user_id int, total_spent numeric)\nLANGUAGE sql\nAS $$\n  SELECT user_id, SUM(total) AS total_spent\n  FROM orders\n  GROUP BY user_id\n  HAVING SUM(total) >= min_total\n  ORDER BY total_spent DESC;\n$$;\n\nSELECT * FROM top_customers(10000);',
                },
                {
                  type: 'note',
                  text: 'Написание функции на SQL (`LANGUAGE sql`) — быстрее и понятнее, чем PL/pgSQL. Планировщик может инлайнить её в вызывающий запрос. PL/pgSQL — когда нужны циклы, переменные, обработка исключений, триггеры.',
                },
              ],
            },
            {
              id: 'pg-l19-s2',
              title: 'Триггеры',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Триггер на updated_at',
                  code: '-- Функция (то, что выполнит триггер)\nCREATE OR REPLACE FUNCTION set_updated_at()\nRETURNS trigger\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  NEW.updated_at := NOW();\n  RETURN NEW;\nEND;\n$$;\n\n-- Триггер\nCREATE TRIGGER trg_users_updated\nBEFORE UPDATE ON users\nFOR EACH ROW\nEXECUTE FUNCTION set_updated_at();',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Аудит-триггер',
                  code: 'CREATE TABLE audit_log (\n  id         bigserial PRIMARY KEY,\n  table_name text,\n  action     text,\n  row_data   jsonb,\n  changed_at timestamptz DEFAULT NOW()\n);\n\nCREATE OR REPLACE FUNCTION audit_changes()\nRETURNS trigger\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  INSERT INTO audit_log(table_name, action, row_data)\n  VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(NEW));\n  RETURN COALESCE(NEW, OLD);\nEND;\n$$;\n\nCREATE TRIGGER trg_orders_audit\nAFTER INSERT OR UPDATE OR DELETE ON orders\nFOR EACH ROW\nEXECUTE FUNCTION audit_changes();',
                },
                {
                  type: 'note',
                  text: 'Триггеры — мощные, но опасные: сложно отлаживать, легко словить рекурсию, каждый INSERT/UPDATE замедляется. Правило: триггеры для аудита и updated_at — ок. Для бизнес-логики — лучше в коде приложения (явнее).',
                },
              ],
            },
            {
              id: 'pg-l19-s3',
              title: 'Проверь себя: PL/pgSQL',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое NEW в триггере `BEFORE UPDATE ON users FOR EACH ROW`?',
                options: [
                  { id: 'a', text: 'Новый пользователь, созданный триггером' },
                  { id: 'b', text: 'Новая версия строки, которую можно изменить и вернуть' },
                  { id: 'c', text: 'Время создания триггера' },
                  { id: 'd', text: 'Следующая строка таблицы' },
                ],
                correct: ['b'],
                explanation:
                  'В триггере NEW — строка после UPDATE (или INSERT), OLD — до. В BEFORE-триггере можно изменить NEW (например, NEW.updated_at := NOW()) и вернуть его — эта версия запишется. В AFTER — NEW только для чтения.',
              },
            },
            {
              id: 'pg-l19-s4',
              title: 'Проверь себя: LANGUAGE sql',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда лучше `LANGUAGE sql`, а не `LANGUAGE plpgsql`?',
                options: [
                  { id: 'a', text: 'Когда нужны циклы и обработка исключений' },
                  { id: 'b', text: 'Когда функция — это просто SELECT/INSERT, без переменных и условий' },
                  { id: 'c', text: 'Когда нужен триггер' },
                  { id: 'd', text: 'Когда функция возвращает void' },
                ],
                correct: ['b'],
                explanation:
                  'LANGUAGE sql — для простых запросов: быстрее, понятнее, планировщик может инлайнить. PL/pgSQL — для циклов, переменных, CASE, EXCEPTION, триггеров. Правило: «начни с SQL, перейди на PL/pgSQL, только если не хватает выразительности».',
              },
            },
            {
              id: 'pg-l19-s5',
              title: 'Практика: аудит-триггер в песочнице',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Аудит-триггер на PL/pgSQL — «при INSERT/UPDATE/DELETE записать строку в audit_log». SQLite (наша песочница) поддерживает `CREATE TRIGGER ... AFTER INSERT`. Сымитируем логику: после вставки заказа — запись в лог.',
                },
                {
                  type: 'sandbox',
                  sandbox: {
                    schema:
                      "CREATE TABLE orders (id INTEGER, total INTEGER);\nCREATE TABLE audit_log (order_id INTEGER, action TEXT);\nCREATE TRIGGER trg_orders_insert\nAFTER INSERT ON orders\nBEGIN\n  INSERT INTO audit_log (order_id, action) VALUES (NEW.id, 'INSERT');\nEND;\nINSERT INTO orders VALUES (1, 1000), (2, 500);",
                    task: 'Триггер уже сработал на INSERT. Выведите order_id и action из audit_log, отсортируйте по order_id.',
                    solution: 'SELECT order_id, action FROM audit_log ORDER BY order_id;',
                    expected: {
                      columns: ['order_id', 'action'],
                      rows: [
                        [1, 'INSERT'],
                        [2, 'INSERT'],
                      ],
                      order: 'order',
                    },
                    hint: 'SELECT order_id, action FROM audit_log ORDER BY order_id',
                  },
                },
                {
                  type: 'note',
                  text: 'В реальном PostgreSQL логика та же, но на PL/pgSQL: `INSERT INTO audit_log VALUES (NEW.id, TG_OP)`. `TG_OP` — встроенная переменная триггера («INSERT», «UPDATE», «DELETE»). `NEW` — вставляемая строка. На собеседовании middle: «как сделать аудит изменений в PG?» — «AFTER INSERT/UPDATE/DELETE триггер → audit_log с row_data jsonb».',
                },
              ],
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m8 — Практикум
    // ─────────────────────────────────────────────
    {
      id: 'pg-m8',
      title: 'Практикум',
      lessons: [
        {
          id: 'pg-l20',
          title: 'Практика: MVCC, EXPLAIN, индексы, бэкапы',
          minutes: 35,
          steps: [
            {
              id: 'pg-l20-s1',
              title: 'MVCC',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему после массовых UPDATE таблица в PostgreSQL растёт?',
                options: [
                  { id: 'a', text: 'UPDATE всегда перезаписывает файл' },
                  { id: 'b', text: 'UPDATE = INSERT + DELETE (новая версия + мёртвая), без VACUUM мёртвые копятся' },
                  { id: 'c', text: 'PostgreSQL не поддерживает UPDATE' },
                  { id: 'd', text: 'Это баг' },
                ],
                correct: ['b'],
                explanation:
                  'MVCC: UPDATE создаёт новую версию, старую помечает xmax. Мёртвые версии занимают место, пока VACUUM их не очистит. Поэтому массовые UPDATE без VACUUM = bloat.',
              },
            },
            {
              id: 'pg-l20-s2',
              title: 'EXPLAIN: узкое место',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: '`EXPLAIN ANALYZE` показывает Seq Scan на 1M-таблице и `Rows Removed by Filter: 999997`. Что делать?',
                options: [
                  { id: 'a', text: 'Увеличить work_mem' },
                  { id: 'b', text: 'Создать индекс на колонку в WHERE' },
                  { id: 'c', text: 'Сделать VACUUM FULL' },
                  { id: 'd', text: 'Перейти на другую СУБД' },
                ],
                correct: ['b'],
                explanation:
                  'Seq Scan + 999 997 отфильтровано = «прочитали миллион, оставили 3». Это индексная задача: CREATE INDEX на колонку из WHERE. После — Index Scan, и запрос ускорится в сотни раз.',
              },
            },
            {
              id: 'pg-l20-s3',
              title: 'BUFFERS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: '`Buffers: shared hit=10 read=5000`. Что оптимизировать?',
                options: [
                  { id: 'a', text: 'Индекс — 5000 страниц читается с диска' },
                  { id: 'b', text: 'Ничего, это норма' },
                  { id: 'c', text: 'Уменьшить shared_buffers' },
                  { id: 'd', text: 'Удалить все индексы' },
                ],
                correct: ['a'],
                explanation:
                  'read=5000 — 5000 страниц (40 MB) с диска. Причины: мало shared_buffers, плохой индекс, или запрос реально читает много. Сначала — индекс/переписать запрос, потом — кэш.',
              },
            },
            {
              id: 'pg-l20-s4',
              title: 'CREATE INDEX на проде',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какое ключевое слово нужно добавить к CREATE INDEX, чтобы не блокировать запись на большой прод-таблице?',
                accepted: ['CONCURRENTLY', 'concurrently'],
                placeholder: 'KEYWORD',
                hint: 'одно слово, заглавными',
                explanation:
                  'CREATE INDEX CONCURRENTLY — строит индекс в фоне, не блокируя INSERT/UPDATE/DELETE. Обычный CREATE INDEX берёт SHARE-блокировку: запись ждёт, пока строится (часы на больших таблицах).',
              },
            },
            {
              id: 'pg-l20-s5',
              title: 'Типы индексов',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте задачу и тип индекса',
                pairs: [
                { left: 'jsonb @> и tsvector @@ (поиск)', right: 'GIN' },
                { left: 'Геометрия (PostGIS), диапазоны', right: 'GiST' },
                { left: 'Логи по created_at (огромная таблица)', right: 'BRIN' },
                { left: '=, <, >, BETWEEN, ORDER BY', right: 'B-tree' },
                ],
                explanation:
  'GIN — jsonb, FTS, pg_trgm, массивы. GiST — геометрия и диапазоны. BRIN — огромные сортированные данные (логи, метрики). B-tree — универсал для =, <, >, BETWEEN, ORDER BY. На собеседовании по PostgreSQL это стандартный вопрос.',
              },
            },
            {
              id: 'pg-l20-s6',
              title: 'Партиционирование',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой тип партиционирования подходит для таблицы orders по created_at?',
                options: [
                  { id: 'a', text: 'LIST' },
                  { id: 'b', text: 'RANGE' },
                  { id: 'c', text: 'HASH' },
                  { id: 'd', text: 'B-tree' },
                ],
                correct: ['b'],
                explanation:
                  'RANGE — по диапазону. Для дат (created_at) — месяцы/дни. LIST — для малого числа значений (регион). HASH — для равномерного распределения. B-tree — это индекс, не партиционирование.',
              },
            },
            {
              id: 'pg-l20-s7',
              title: 'pgvector',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какое расширение добавляет векторный поиск в PostgreSQL?',
                options: [
                  { id: 'a', text: 'pg_trgm' },
                  { id: 'b', text: 'pgvector' },
                  { id: 'c', text: 'postgis' },
                  { id: 'd', text: 'hstore' },
                ],
                correct: ['b'],
                explanation:
                  'pgvector — векторный поиск (embeddings). До 10M векторов работает отлично — часто хватает, чтобы не тащить Qdrant/Pinecone. HNSW-индекс — стандарт 2025.',
              },
            },
            {
              id: 'pg-l20-s8',
              title: 'PITR',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно для point-in-time recovery?',
                options: [
                  { id: 'a', text: 'pg_basebackup (или pgBackRest full backup)' },
                  { id: 'b', text: 'Архив WAL-файлов' },
                  { id: 'c', text: 'recovery_target_time' },
                  { id: 'd', text: 'VACUUM FULL' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'PITR = base backup + WAL archive + recovery_target_time. Восстанавливаем базу, применяем WAL до момента. VACUUM FULL — про очистку места, к PITR не относится.',
              },
            },
            {
              id: 'pg-l20-s9',
              title: 'PgBouncer',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой режим PgBouncer стандартен для веб-приложений?',
                options: [
                  { id: 'a', text: 'session' },
                  { id: 'b', text: 'transaction' },
                  { id: 'c', text: 'statement' },
                  { id: 'd', text: 'async' },
                ],
                correct: ['b'],
                explanation:
                  'transaction — клиент занимает соединение только на время транзакции. Максимальная экономия. session — почти не экономит. statement — ломает multi-statement.',
              },
            },
            {
              id: 'pg-l20-s10',
              title: 'VACUUM',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите команду: обычный VACUUM (без блокировки) с ANALYZE для таблицы users.',
                starterCode: 'VACUUM ',
                mustInclude: [
                  { pattern: 'VACUUM', message: 'Нужно VACUUM' },
                  { pattern: 'ANALYZE', message: 'Нужен ANALYZE' },
                  { pattern: 'users', message: 'Нужна таблица users' },
                  { pattern: 'FULL', message: 'Нельзя VACUUM FULL (блокирует)' },
                ],
                mustNotInclude: [
                  { pattern: 'FULL', message: 'VACUUM FULL блокирует таблицу — не для этого задания' },
                ],
                explanation:
                  'VACUUM (ANALYZE) users; или VACUUM ANALYZE users; — очищает мёртвые версии и обновляет статистику, не блокируя таблицу. VACUUM FULL — блокирует, не использовать.',
              },
            },
          ],
        },
      ],
    },
  ],
};