import type { Course } from './types';

export const kafkaBasicsCourse: Course = {
  slug: 'kafka-basics',
  title: 'Kafka: event streaming',
  subtitle: 'Topics, partitions, consumer groups, producer, репликация и экосистема',
  description:
    'Kafka — де-факто стандарт event-driven архитектуры: миллионы событий в секунду, гарантии доставки, ретеншен и потоковая обработка. Курс объясняет фундаментальные абстракции (topics, partitions, offsets, consumer groups), архитектуру (broker, репликация, ISR, KRaft), producer и consumer (acks, идемпотентность, транзакции, exactly-once), экосистему (Kafka Connect, Schema Registry, ksqlDB, Kafka Streams) и эксплуатацию (monitoring, security, Strimzi в K8s). Практикум — producer + consumer с DLQ и exactly-once.',
  level: 'Средний',
  tags: ['Kafka', 'Event Streaming', 'Backend', 'DevOps'],
  accent: '#231F20',
  icon: 'kafka',
  outcomes: [
    'Объяснять, чем лог событий отличается от очереди',
    'Работать с topics, partitions, offsets и consumer groups',
    'Понимать порядок и параллелизм внутри партиции',
    'Настраивать producer: acks, идемпотентность, batching',
    'Использовать транзакции и exactly-once семантику',
    'Подключать Kafka Connect, Schema Registry, ksqlDB и Kafka Streams',
    'Мониторить и защищать кластер: JMX, SASL/TLS, ACL',
    'Разворачивать Kafka в K8s через Strimzi',
    'Писать producer и consumer на Python с DLQ',
  ],
  requirements: [
    'Уверенная работа в терминале и Docker (курсы Linux, Docker)',
    'Понимание сетей и TCP (курс Сети)',
    'Базовый Python для практикума',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы
    // ─────────────────────────────────────────────
    {
      id: 'kf-m1',
      title: 'Основы',
      lessons: [
        {
          id: 'kf-l1',
          title: 'Зачем Kafka: лог событий, а не очередь',
          minutes: 20,
          steps: [
            {
              id: 'kf-l1-s1',
              title: 'Очередь vs лог событий',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Классическая очередь (RabbitMQ, SQS): producer положил сообщение — consumer забрал и сообщение удалилось. Один consumer — одно сообщение. Kafka работает иначе: это распределённый append-only лог. Producer пишет в конец, consumer читает со своей позиции (offset), сообщение не удаляется после прочтения. Несколько независимых consumer groups читают один и тот же поток.',
                },
                {
                  type: 'mermaid',
                  caption: 'Очередь vs лог событий',
                  code: `graph LR
                    subgraph Queue["Очередь (RabbitMQ)"]
                        P1["Producer"] --> Q["Queue"]
                        Q -->|"забрал"| C1["Consumer"]
                        Q -.->|"удалено после ack"| X["..."]
                    end
                    subgraph Log["Лог (Kafka)"]
                        P2["Producer"] --> L[("Topic<br/>(append-only log)")]
                        L -->|"offset 0..N"| G1["Group A"]
                        L -->|"offset 0..N"| G2["Group B"]
                    end`,
                },
                {
                  type: 'list',
                  items: [
                    'Append-only: события дописываются в конец, никогда не меняются',
                    'Consumer читает со своего offset — позиция независима для каждой группы',
                    'Сообщение живёт до истечения retention (по умолчанию 7 дней)',
                    'Несколько consumer groups читают один поток независимо',
                    'Replay: можно «перемотать» offset и перечитать историю',
                  ],
                },
                {
                  type: 'note',
                  text: 'Это ключевое отличие. Kafka — «журнал событий», а не «очередь задач». Если нужно «каждое сообщение обработать ровно один раз» — Kafka тоже умеет (exactly-once, модуль 3), но базовая модель — «поток событий, который можно читать с любой точки».',
                },
              ],
            },
            {
              id: 'kf-l1-s2',
              title: 'Когда Kafka, а когда нет',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Kafka vs альтернативы',
                  head: ['Сценарий', 'Kafka', 'RabbitMQ / SQS', 'Postgres / Redis'],
                  rows: [
                    ['Миллионы событий/сек', '✅', '⚠️', '❌'],
                    ['Event sourcing / CDC', '✅', '❌', '⚠️'],
                    ['Простая очередь задач', '⚠️', '✅', '✅'],
                    ['Replay истории', '✅', '❌', '❌'],
                    ['Несколько независимых consumer', '✅', '⚠️', '❌'],
                    ['RPC / request-reply', '❌', '✅', '✅'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'Kafka — когда нужен высокий throughput, replay, event sourcing, несколько consumer groups',
                    'RabbitMQ — простая очередь задач, гибкая маршрутизация, RPC',
                    'SQS — managed-очередь в AWS без эксплуатации',
                    'Postgres/Redis — для маленьких потоков и простых очередей до 10k событий/сек',
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: «если события — это факты о том, что произошло, и их хотят читать несколько сервисов независимо — Kafka». «Если это задача для одного исполнителя — очередь». На собеседовании: «когда Kafka, а когда RabbitMQ?» — это ключевой вопрос.',
                },
              ],
            },
            {
              id: 'kf-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Kafka принципиально отличается от классической очереди (RabbitMQ/SQS)?',
                options: [
                  { id: 'a', text: 'Kafka быстрее' },
                  { id: 'b', text: 'Kafka — append-only лог, сообщения не удаляются после прочтения; consumer groups читают поток независимо' },
                  { id: 'c', text: 'Kafka не поддерживает Python' },
                  { id: 'd', text: 'Kafka работает только в облаке' },
                ],
                correct: ['b'],
                explanation:
                  'Kafka — «журнал событий»: события остаются до retention, offset независим для каждой consumer group. Replay и несколько consumer groups — то, что очередь не умеет.',
              },
            },
            {
  id: 'kf-l1-s4',
  title: 'Проверь себя: Kafka vs RabbitMQ',
  type: 'quiz',
  quiz: {
    kind: 'matching',
    question: 'Сопоставьте сценарий и подходящий инструмент',
    pairs: [
      { left: 'Миллион событий/сек, replay истории, 5 consumer-групп', right: 'Kafka' },
      { left: 'Простая очередь задач, RPC, гибкая маршрутизация', right: 'RabbitMQ' },
      { left: 'Managed-очередь без эксплуатации, AWS', right: 'SQS' },
      { left: 'Маленький поток (< 10k событий/сек), уже есть Postgres', right: 'Postgres (SKIP LOCKED)' },
    ],
    explanation:
      'Правило: «если события — факты, и их читают несколько сервисов независимо — Kafka». «Если задача для одного исполнителя — очередь». Kafka не всегда лучший выбор.',
  },
},
{
  id: 'kf-l1-s5',
  title: 'Проверь себя: retention',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Почему в Kafka можно «перечитать» все события за неделю после исправления бага?',
    options: [
      { id: 'a', text: 'Kafka хранит события в оперативной памяти' },
      { id: 'b', text: 'События не удаляются после прочтения, а живут до истечения retention (по умолчанию 7 дней)' },
      { id: 'c', text: 'Потребитель автоматически перечитывает всё при каждом запуске' },
      { id: 'd', text: 'Это невозможно, Kafka удаляет сразу после прочтения' },
    ],
    correct: ['b'],
    explanation:
      'Kafka — append-only лог. Событие живёт до истечения retention (7 дней по умолчанию), независимо от того, прочитали его или нет. Можно «перемотать» offset и перечитать историю — это и есть replay.',
  },
},
          ],
        },
        {
          id: 'kf-l2',
          title: 'Topics, partitions, offsets',
          minutes: 25,
          steps: [
            {
              id: 'kf-l2-s1',
              title: 'Три фундаментальные абстракции',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Topic — логический поток («orders.created», «payments.processed»). Partition — физический шард топика, единица параллелизма и репликации. Offset — порядковый номер сообщения в партиции (монотонно растёт, начиная с 0). Consumer group читает партиции, запоминая свой offset.',
                },
                {
                  type: 'mermaid',
                  caption: 'Topic с 3 partitions',
                  code: `graph TD
                    T["topic: orders.created"] --> P0["partition 0<br/>offset 0,1,2,3"]
                    T --> P1["partition 1<br/>offset 0,1"]
                    T --> P2["partition 2<br/>offset 0,1,2"]`,
                },
                {
                  type: 'list',
                  items: [
                    'Topic — «категория событий», у топика N партиций',
                    'Partition — единица параллелизма: каждый consumer читает свою партицию',
                    'Offset — позиция сообщения внутри партиции, уникальна в партиции',
                    'Порядок гарантирован только внутри партиции, не между партициями',
                    'Partition — единица репликации: у каждой партиции есть лидер и фолловеры',
                  ],
                },
                {
                  type: 'note',
                  text: 'Количество партиций задаёт максимальный параллелизм: 12 партиций = максимум 12 consumer-ов в группе (больше — простой). Начинают с 6–12 и увеличивают, если упираетесь в throughput. Уменьшить партиции нельзя — только пересоздать топик.',
                },
              ],
            },
            {
              id: 'kf-l2-s2',
              title: 'Управление offset и retention',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'kafka-topics.sh',
                  code: `# Создать топик\nkafka-topics.sh --create \\\n  --topic orders.created \\\n  --partitions 6 \\\n  --replication-factor 3 \\\n  --bootstrap-server localhost:9092\n\n# Список\nkafka-topics.sh --list --bootstrap-server localhost:9092\n\n# Описание (partitions, replicas, ISR)\nkafka-topics.sh --describe --topic orders.created --bootstrap-server localhost:9092\n\n# Увеличить партиции (нельзя уменьшить!)\nkafka-topics.sh --alter --topic orders.created --partitions 12 --bootstrap-server localhost:9092`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Управление consumer offsets',
                  code: `# Позиции consumer groups\nkafka-consumer-groups.sh --describe \\\n  --group orders-service --bootstrap-server localhost:9092\n\n# Перемотать group на начало\nkafka-consumer-groups.sh --reset-offsets --to-earliest \\\n  --group orders-service --topic orders.created --execute \\\n  --bootstrap-server localhost:9092\n\n# На конкретный offset\nkafka-consumer-groups.sh --reset-offsets --to-offset 42 \\\n  --group orders-service --topic orders.created --execute \\\n  --bootstrap-server localhost:9092`,
                },
                {
                  type: 'table',
                  caption: 'retention',
                  head: ['Параметр', 'Значение по умолчанию', 'Что значит'],
                  rows: [
                    ['retention.ms', '7 дней', 'Сколько хранить сообщения'],
                    ['retention.bytes', '-1 (без лимита)', 'Максимальный размер партиции'],
                    ['cleanup.policy', 'delete', 'delete | compact | compact,delete'],
                  ],
                },
                {
                  type: 'note',
                  text: '`--reset-offsets` работает только если группа неактивна (нет активных consumer-ов). Иначе — остановить consumer, перемотать, запустить заново. Replay — мощная штука: «перечитаем все события за неделю после исправления бага».',
                },
              ],
            },
            {
              id: 'kf-l2-s3',
              title: 'Проверь себя: offset',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Гарантирован ли порядок сообщений между разными партициями одного топика?',
                options: [
                  { id: 'a', text: 'Да, Kafka гарантирует глобальный порядок' },
                  { id: 'b', text: 'Нет, порядок гарантирован только внутри одной партиции' },
                  { id: 'c', text: 'Только для одного consumer' },
                  { id: 'd', text: 'Только с acks=all' },
                ],
                correct: ['b'],
                explanation:
                  'Порядок гарантирован только внутри партиции. Разные партиции обрабатываются параллельно — глобального порядка нет. Если нужен порядок по ключу (например, по user_id) — все события этого ключа должны попадать в одну партицию (одинаковый key).',
              },
            },
            {
              id: 'kf-l2-s4',
              title: 'Проверь себя: партиции',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'У топика 6 партиций. Какое максимальное количество consumer-ов в одной группе будет работать параллельно?',
                correct: 6,
                explanation:
                  'Каждая партиция читается одним consumer-ом в группе. 6 партиций → максимум 6 активных consumer-ов. Седьмой будет простаивать. Больше партиций = больше параллелизма, но и больше overhead на брокере.',
              },
            },
            {
  id: 'kf-l2-s5',
  title: 'Проверь себя: retention-политики',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'В чём разница между `cleanup.policy=delete` и `cleanup.policy=compact`?',
    options: [
      { id: 'a', text: 'delete удаляет старые сегменты целиком, compact оставляет только последнее значение по каждому ключу' },
      { id: 'b', text: 'delete — быстрее, compact — медленнее' },
      { id: 'c', text: 'delete работает только в KRaft, compact — только в ZooKeeper' },
      { id: 'd', text: 'Это синонимы' },
    ],
    correct: ['a'],
    explanation:
      'delete — старая стратегия: сегменты старше retention.ms удаляются. compact — «сжатие»: для каждого ключа остаётся только последнее значение. Для event-sourcing — delete, для «таблицы состояния» (последний статус заказа) — compact.',
  },
},
          ],
        },
        {
          id: 'kf-l3',
          title: 'Consumer groups',
          minutes: 25,
          steps: [
            {
              id: 'kf-l3-s1',
              title: 'Как группы распределяют партиции',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Consumer group — набор consumer-ов с одинаковым `group.id`. Kafka распределяет партиции между ними: каждая партиция достаётся ровно одному consumer-у в группе. Разные группы читают один топик независимо (у каждой свои offsets). Это главный механизм масштабирования consumer-ов.',
                },
                {
                  type: 'mermaid',
                  caption: 'Две группы читают один топик независимо',
                  code: `graph TD
                    T["topic orders.created<br/>3 partitions"] --> G1["group: orders-service<br/>offsets независимы"]
                    T --> G2["group: analytics<br/>offsets независимы"]
                    G1 --> C11["consumer 1<br/>partitions 0,1"]
                    G1 --> C12["consumer 2<br/>partition 2"]
                    G2 --> C21["consumer 1<br/>partition 0"]
                    G2 --> C22["consumer 2<br/>partitions 1,2"]`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Работа с группами',
                  code: `# Все группы\nkafka-consumer-groups.sh --list --bootstrap-server localhost:9092\n\n# Описание группы: lag, offsets\nkafka-consumer-groups.sh --describe \\\n  --group orders-service --bootstrap-server localhost:9092\n\n# GROUP          TOPIC            PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG  CONSUMER-ID\n# orders-service orders.created   0          1523            1530            7    consumer-1\n# orders-service orders.created   1          2100            2100            0    consumer-1\n# orders-service orders.created   2          980             985             5    consumer-2`,
                },
                {
                  type: 'note',
                  text: '`LAG` — «отставание»: сколько сообщений ещё не прочитано. Главная метрика здоровья consumer-а. Если lag растёт — consumer не успевает (мало партиций, медленная обработка, упал). Мониторинг lag — must-have в проде.',
                },
              ],
            },
            {
              id: 'kf-l3-s2',
              title: 'Проверь себя: группы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что означает `LAG` в `kafka-consumer-groups.sh --describe`?',
                options: [
                  { id: 'a', text: 'Задержка сети' },
                  { id: 'b', text: 'Количество сообщений, которые ещё не прочитаны consumer-ом (log-end-offset − current-offset)' },
                  { id: 'c', text: 'Размер партиции' },
                  { id: 'd', text: 'Версия Kafka' },
                ],
                correct: ['b'],
                explanation:
                  'LAG = «сколько событий в топике ещё не прочитаны группой». Растущий lag = consumer не успевает. Нулевой lag = consumer в реальном времени. Главная метрика мониторинга Kafka-consumer-ов.',
              },
            },
            {
              id: 'kf-l3-s3',
              title: 'Проверь себя: несколько групп',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что верно про несколько consumer groups на одном топике?',
                options: [
                  { id: 'a', text: 'Каждая группа читает топик с собственными offsets независимо' },
                  { id: 'b', text: 'Одно сообщение может быть прочитано разными группами' },
                  { id: 'c', text: 'Все группы делят одни offsets' },
                  { id: 'd', text: 'Это стандартный паттерн: одна группа для бизнес-логики, другая — для аналитики' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Каждая группа имеет свои offsets. Одно сообщение прочитается всеми группами (по разу каждой). Это стандарт: одна группа для бизнес-логики, другая — для аналитики, третья — для CDC в другую БД.',
              },
            },
            {
  id: 'kf-l3-s4',
  title: 'Проверь себя: partition assignment',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'В группе 3 consumer-а, у топика 6 партиций. Как Kafka распределит партиции?',
    options: [
      { id: 'a', text: 'Все 6 — одному consumer-у' },
      { id: 'b', text: 'По 2 партиции каждому' },
      { id: 'c', text: 'Каждый consumer получит все 6 (дублирование)' },
      { id: 'd', text: 'Kafka откажется: партиций больше, чем consumer-ов' },
    ],
    correct: ['b'],
    explanation:
      'Каждая партиция читается ровно одним consumer-ом в группе. 6 партиций / 3 consumer-а = по 2 каждому. Если consumer-ов больше, чем партиций — лишние простаивают.',
  },
},
{
  id: 'kf-l3-s5',
  title: 'Проверь себя: partition assignment strategy',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Какая стратегия распределения партиций рекомендуется в 2025?',
    options: [
      { id: 'a', text: 'Range' },
      { id: 'b', text: 'RoundRobin' },
      { id: 'c', text: 'CooperativeStickyAssignor' },
      { id: 'd', text: 'Random' },
    ],
    correct: ['c'],
    explanation:
      'CooperativeStickyAssignor — «кооперативный липкий»: при rebalance отдаёт только «лишние» партиции, остальные продолжают читать. В отличие от Eager (Range/RoundRobin), который останавливает всю группу. С 2.4+ рекомендуется как стандарт.',
  },
},
          ],
        },
        {
          id: 'kf-l4',
          title: 'Порядок и параллелизм',
          minutes: 20,
          steps: [
            {
              id: 'kf-l4-s1',
              title: 'Ключ и партиционирование',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Producer решает, в какую партицию отправить сообщение. Если `key` задан — `hash(key) % num_partitions`. Все сообщения с одинаковым key попадают в одну партицию → гарантированный порядок по этому ключу. Без key — round-robin или sticky (producer копит в одну партицию).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Producer с key',
                  code: `from kafka import KafkaProducer\nimport json\n\nproducer = KafkaProducer(\n    bootstrap_servers="localhost:9092",\n    key_serializer=lambda k: k.encode("utf-8"),\n    value_serializer=lambda v: json.dumps(v).encode("utf-8"),\n)\n\n# Все события user_id=42 попадут в одну партицию\n# → порядок гарантирован для этого пользователя\nproducer.send(\n    "orders.created",\n    key="user:42",\n    value={"order_id": 1, "user_id": 42, "total": 1000},\n)`,
                },
                {
                  type: 'list',
                  items: [
                    'key задан → hash(key) % partitions → все события ключа в одной партиции',
                    'key = None → round-robin (или sticky — producer выбирает партицию на batch)',
                    'Порядок гарантирован только для сообщений с одинаковым key',
                    'Плохой key → перекос (одна партиция перегружена, остальные пусты)',
                    'Хороший key → равномерное распределение + нужный порядок',
                  ],
                },
                {
                  type: 'note',
                  text: 'Классика: `key = user_id` для событий заказа (порядок по пользователю). `key = order_id` для событий платежа. Без key — события могут попасть в разные партиции и обработаться не по порядку. Если порядок важен — key обязателен.',
                },
              ],
            },
            {
              id: 'kf-l4-s2',
              title: 'Проверь себя: key',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в producer задавать `key` для сообщений?',
                options: [
                  { id: 'a', text: 'Для шифрования' },
                  { id: 'b', text: 'Все сообщения с одинаковым key попадают в одну партицию — гарантируется порядок по этому ключу' },
                  { id: 'c', text: 'Для сжатия' },
                  { id: 'd', text: 'Для аутентификации' },
                ],
                correct: ['b'],
                explanation:
                  '`hash(key) % partitions` → все события с key=user:42 идут в одну партицию → consumer обрабатывает их последовательно. Без key — могут попасть в разные партиции и обработаться не по порядку.',
              },
            },
            {
  id: 'kf-l4-s3',
  title: 'Практика: какой key выбрать',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'Порядок гарантирован только внутри партиции. Значит, key должен отражать «что должно обрабатываться последовательно».' },
    {
      type: 'table',
      caption: 'Выбор key',
      head: ['Сценарий', 'Key', 'Почему'],
      rows: [
        ['События заказа (created, paid, shipped)', 'order_id', 'Порядок по одному заказу гарантирован'],
        ['Действия пользователя (логин, покупка)', 'user_id', 'Последовательность по пользователю'],
        ['Платёжные транзакции', 'account_id', 'Баланс считается последовательно'],
        ['Логи уровня приложения', 'без key (round-robin)', 'Порядок не важен — важна пропускная способность'],
        ['IoT-метрики с устройства', 'device_id', 'Порядок показаний одного устройства'],
      ],
    },
    { type: 'note', text: 'Правило: если между событиями есть «A должно быть до B» — это key. Если нет — не задавайте key (или задавайте равномерный hash), чтобы избежать перекосов.' },
  ],
},
{
  id: 'kf-l4-s4',
  title: 'Проверь себя: где гарантирован порядок',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Сколько сообщений с одинаковым key попадут в одну партицию?',
    options: [
      { id: 'a', text: 'Все — гарантированно в одну (hash(key) % num_partitions)' },
      { id: 'b', text: 'Только первое' },
      { id: 'c', text: 'Случайно в разные' },
      { id: 'd', text: 'Kafka не даёт такой гарантии' },
    ],
    correct: ['a'],
    explanation:
      'Producer вычисляет hash(key) % num_partitions и шлёт в конкретную партицию. Все сообщения с key=user:42 попадут в одну партицию → consumer обработает их последовательно. Без key — не гарантируется.',
  },
},
{
  id: 'kf-l4-s5',
  title: 'Проверь себя: hot key',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что произойдёт, если 90% событий имеют один и тот же key (например, key="global")?',
    options: [
      { id: 'a', text: 'Kafka перераспределит их по партициям автоматически' },
      { id: 'b', text: 'Все 90% попадут в одну партицию → перекос (hot partition), остальные простаивают' },
      { id: 'c', text: 'Kafka выдаст ошибку' },
      { id: 'd', text: 'Consumer обработает их параллельно' },
    ],
    correct: ['b'],
    explanation:
      'Hash от одного key всегда даёт одну партицию. Остальные партиции простаивают — вы теряете параллелизм и упираетесь в один consumer. Классическая проблема «горячего ключа»: пересмотрите key или добавьте случайный суффикс.',
  },
},
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m2 — Архитектура
    // ─────────────────────────────────────────────
    {
      id: 'kf-m2',
      title: 'Архитектура',
      lessons: [
        {
          id: 'kf-l5',
          title: 'Broker, репликация, ISR',
          minutes: 25,
          steps: [
            {
              id: 'kf-l5-s1',
              title: 'Broker и лидеры партиций',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Кластер Kafka состоит из брокеров (узлов). Каждая партиция имеет одного лидера (leader) и N−1 фолловеров (followers). Producer пишет только в лидера, consumer читает только из лидера. Фолловеры копируют данные с лидера и готовы заменить его при падении.',
                },
                {
                  type: 'mermaid',
                  caption: 'Репликация партиции: лидер + 2 фолловера',
                  code: `graph TD
                    P["producer"] -->|"write"| L["broker 1<br/>LEADER partition 0"]
                    L -->|"replicate"| F1["broker 2<br/>follower"]
                    L -->|"replicate"| F2["broker 3<br/>follower"]
                    C["consumer"] -->|"read"| L
                    F1 -.->|"failover"| L
                    F2 -.->|"failover"| L`,
                },
                {
                  type: 'list',
                  items: [
                    'Broker — узел Kafka-кластера',
                    'Leader — единственный, принимает запись и отдаёт чтение по партиции',
                    'Follower — копирует данные лидера, готов заменить',
                    'Если лидер упал — контроллер выбирает нового из ISR',
                    'Клиенты перенаправляются на нового лидера автоматически',
                  ],
                },
              ],
            },
            {
              id: 'kf-l5-s2',
              title: 'ISR и min.insync.replicas',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'ISR (In-Sync Replicas) — набор реплик, которые «успевают» за лидером. Только реплики из ISR могут стать лидером. Follower выпадает из ISR, если отстал больше `replica.lag.time.max.ms` (по умолчанию 30 сек). `min.insync.replicas` — минимум реплик в ISR, при котором producer с `acks=all` получит подтверждение.',
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Типичные настройки',
                  code: `# На топике\nreplication.factor=3\nmin.insync.replicas=2\n\n# У producer\nacks=all\n\n# Тогда: запись подтверждается, если записали в лидера + минимум 1 ISR-фолловер\n# Если ISR упал ниже 2 — producer с acks=all получит ошибку NOT_ENOUGH_REPLICAS`,
                },
                {
                  type: 'table',
                  caption: 'Что происходит при отказах',
                  head: ['Ситуация', 'ISR', 'Producer с acks=all'],
                  rows: [
                    ['Всё ок', '3 реплики', '✅ OK'],
                    ['1 брокер упал', '2 реплики', '✅ OK'],
                    ['2 брокера упали', '1 реплика (< min.insync=2)', '❌ NOT_ENOUGH_REPLICAS'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: `replication.factor=3`, `min.insync.replicas=2`, `acks=all` — стандарт для прода. Это гарантирует, что при потере одного брокера данные не потеряются и запись не остановится. Потеря двух — потеря кворума, запись встанет (лучше, чем потерять данные).',
                },
              ],
            },
            {
              id: 'kf-l5-s3',
              title: 'Проверь себя: ISR',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'При `replication.factor=3`, `min.insync.replicas=2`, `acks=all` — что произойдёт, если 2 брокера упадут?',
                options: [
                  { id: 'a', text: 'Запись продолжится нормально' },
                  { id: 'b', text: 'Producer получит NOT_ENOUGH_REPLICAS — запись остановится' },
                  { id: 'c', text: 'Kafka потеряет данные' },
                  { id: 'd', text: 'Топик удалится' },
                ],
                correct: ['b'],
                explanation:
                  'Осталась 1 реплика в ISR (нужно 2). Producer с acks=all получит `NOT_ENOUGH_REPLICAS` и остановится. Это выбор в пользу консистентности: лучше остановить запись, чем потерять данные. Такая ситуация — «страховка», а не баг.',
              },
            },
            {
  id: 'kf-l5-s4',
  title: 'Проверь себя: RF=3, один упал',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'replication.factor=3, один брокер упал. Что с producer с acks=all?',
    options: [
      { id: 'a', text: 'Получит ошибку — реплик меньше 3' },
      { id: 'b', text: 'Продолжит писать: осталось 2 реплики (>= min.insync.replicas=2)' },
      { id: 'c', text: 'Автоматически снизит acks до 1' },
      { id: 'd', text: 'Топик удалится' },
    ],
    correct: ['b'],
    explanation:
      'Пока в ISR >= min.insync.replicas (обычно 2), producer с acks=all пишет нормально. Осталось 2 живых реплики — это минимум. Если упадёт второй брокер (1 < 2) — producer получит NOT_ENOUGH_REPLICAS.',
  },
},
{
  id: 'kf-l5-s5',
  title: 'Проверь себя: RF=1',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'Какие настройки репликации НЕ подходят для прода?',
    options: [
      { id: 'a', text: 'replication.factor=3, min.insync.replicas=2, acks=all' },
      { id: 'b', text: 'replication.factor=1, min.insync.replicas=1, acks=1' },
      { id: 'c', text: 'replication.factor=3, min.insync.replicas=2, acks=0' },
      { id: 'd', text: 'replication.factor=3, min.insync.replicas=2, acks=all с idempotence' },
    ],
    correct: ['b', 'c'],
    explanation:
      'RF=1 — нет реплик, потеря брокера = потеря данных. acks=0 — fire-and-forget, потеря при любом сбое. Оба варианта не для прода. Стандарт: RF=3, min.insync=2, acks=all.',
  },
},
          ],
        },
        {
          id: 'kf-l6',
          title: 'KRaft vs ZooKeeper',
          minutes: 20,
          steps: [
            {
              id: 'kf-l6-s1',
              title: 'Архитектурная революция',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'До Kafka 3.3 кластеру требовался внешний ZooKeeper: хранил метаданные (какие топики, партиции, лидеры, ACL). Это два «зоопарка»: Kafka + ZooKeeper, два набора брокеров, два процесса мониторинга. С Kafka 2.8 появился KRaft (Kafka Raft) — метаданные хранятся внутри Kafka, через Raft-консенсус. Начиная с 3.3 KRaft production-ready, а с 4.0 ZooKeeper полностью удалён.',
                },
                {
                  type: 'mermaid',
                  caption: 'ZooKeeper vs KRaft',
                  code: `graph LR
                    subgraph ZK["ZK (старое)"]
                        B1["broker 1"] --> Z[("ZooKeeper<br/>ensemble")]
                        B2["broker 2"] --> Z
                        B3["broker 3"] --> Z
                    end
                    subgraph KR["KRaft (новое)"]
                        B4["broker/controller 1"] -->|"raft"| C1["controller quorum"]
                        B5["broker/controller 2"] -->|"raft"| C1
                        B6["broker/controller 3"] -->|"raft"| C1
                    end`,
                },
                {
                  type: 'list',
                  items: [
                    'ZooKeeper уходит: с Kafka 4.0 его нет',
                    'KRaft: метаданные внутри Kafka, через Raft-консенсус',
                    'Плюсы: один компонент (проще деплой), быстрее failover контроллера, миллионы партиций',
                    'В KRaft есть controller (или controller-quorum) — управляет метаданными',
                    'Брокеры могут совмещать роль broker + controller',
                  ],
                },
                {
                  type: 'note',
                  text: 'В 2025 новые кластеры — только KRaft. Старые миграции с ZK на KRaft — через migration mode (Kafka 3.6+). На собеседовании: «что такое KRaft?» — «Kafka Raft, замена ZooKeeper, с 4.0 ZooKeeper удалён».',
                },
              ],
            },
            {
              id: 'kf-l6-s2',
              title: 'Проверь себя: KRaft',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое KRaft в Kafka?',
                options: [
                  { id: 'a', text: 'Новый протокол для producer' },
                  { id: 'b', text: 'Замена ZooKeeper: метаданные хранятся внутри Kafka через Raft-консенсус' },
                  { id: 'c', text: 'Библиотека для Python' },
                  { id: 'd', text: 'Тип сжатия' },
                ],
                correct: ['b'],
                explanation:
                  'KRaft (Kafka Raft) — встроенный механизм консенсуса для метаданных. Заменяет внешний ZooKeeper. С Kafka 4.0 ZooKeeper полностью удалён. Проще деплой, быстрее failover, миллионы партиций.',
              },
            },
            {
  id: 'kf-l6-s3',
  title: 'Как работает controller quorum в KRaft',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'В KRaft брокеры бывают двух ролей (могут совмещаться): broker (хранит данные) и controller (хранит метаданные). Controller-ы образуют quorum через Raft-консенсус: лидер принимает изменения, фолловеры реплицируют.' },
    {
      type: 'mermaid',
      caption: 'Controller quorum в KRaft (3 controller-а)',
      code: `graph TD
        L["Controller-лидер<br/>(принимает метаданные)"] -->|"replicate"| F1["Controller-фолловер"]
        L -->|"replicate"| F2["Controller-фолловер"]
        B1["Broker 1"] -->|"fetch metadata"| L
        B2["Broker 2"] -->|"fetch metadata"| L`,
    },
    {
      type: 'list',
      items: [
        'Controller quorum — нечётное число (3 или 5) для кворума',
        'Leader election — стандартный Raft: лидер упал, фолловеры выбирают нового',
        'Метаданные: топики, партиции, лидеры, ACL, конфиги',
        'Брокеры могут совмещать роли broker+controller (в dev) или быть раздельно (в prod)',
        'Kafka 3.3+ — KRaft production-ready; 4.0 — ZooKeeper удалён',
      ],
    },
  ],
},
{
  id: 'kf-l6-s4',
  title: 'Проверь себя: KRaft',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'Что нужно для KRaft-кластера (без ZooKeeper)?',
    options: [
      { id: 'a', text: 'Настроить controller_quorum (список controller-ов)' },
      { id: 'b', text: 'Нечётное число controller-ов (3 или 5)' },
      { id: 'c', text: 'Обязательно отдельные серверы для broker и controller' },
      { id: 'd', text: 'Форматирование storage (kafka-storage format) перед первым стартом' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'KRaft: controller_quorum (a), нечётное число (b), storage format (d). Брокеры МОГУТ совмещать роли broker+controller (c — не обязателен), поэтому вариант c неверен.',
  },
},
{
  id: 'kf-l6-s5',
  title: 'Проверь себя: почему ZooKeeper убрали',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Почему с Kafka 4.0 ZooKeeper полностью удалён?',
    options: [
      { id: 'a', text: 'Он был медленнее, чем KRaft' },
      { id: 'b', text: 'KRaft проще: один компонент вместо двух, быстрее failover, поддерживает миллионы партиций' },
      { id: 'c', text: 'ZooKeeper перестал быть open-source' },
      { id: 'd', text: 'Это маркетинговое решение' },
    ],
    correct: ['b'],
    explanation:
      'KRaft проще в эксплуатации (один компонент, а не Kafka+ZooKeeper), быстрее выборы лидера, масштабируется до миллионов партиций. ZooKeeper держал метаданные в памяти, KRaft — через Raft-консенсус.',
  },
},
          ],
        },
        {
          id: 'kf-l7',
          title: 'Retention, compaction, tiered storage',
          minutes: 25,
          steps: [
            {
              id: 'kf-l7-s1',
              title: 'Retention: как долго хранить',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Retention-настройки топика',
                  code: `# Хранить 7 дней (по умолчанию)\nretention.ms=604800000\n\n# Или до 100 GB на партицию\nretention.bytes=107374182400\n\n# Что сработает раньше — то и удалит\n# cleanup.policy=delete (по умолчанию) — старые сегменты удаляются`,
                },
                {
                  type: 'list',
                  items: [
                    'retention.ms — время жизни сегмента',
                    'retention.bytes — размер сегмента',
                    'Сегменты: партиция делится на файлы-сегменты (1 GB по умолчанию)',
                    'Старые сегменты удаляются целиком — не по одному сообщению',
                    'Удаление по времени: раз в `log.retention.check.interval.ms` (5 мин)',
                  ],
                },
              ],
            },
            {
              id: 'kf-l7-s2',
              title: 'Log compaction: последнее значение по ключу',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Compaction — другая стратегия очистки. Kafka не удаляет старые сегменты целиком, а «сжимает»: для каждого ключа остаётся только последнее значение. Идеально для «таблиц состояния»: последняя цена товара, последний статус заказа, профиль пользователя. Replay даст «актуальное состояние», а не всю историю.',
                },
                {
                  type: 'mermaid',
                  caption: 'Compaction: сохраняется только последнее значение по ключу',
                  code: `graph LR
                    subgraph Before["До compaction"]
                        A1["k=user1 v=old"]
                        A2["k=user2 v=a"]
                        A3["k=user1 v=new"]
                        A4["k=user3 v=x"]
                        A5["k=user2 v=b"]
                    end
                    subgraph After["После compaction"]
                        B1["k=user1 v=new"]
                        B2["k=user3 v=x"]
                        B3["k=user2 v=b"]
                    end`,
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Включить compaction',
                  code: `cleanup.policy=compact           # только compaction\ncleanup.policy=compact,delete    # и то, и другое\n\n# Параметры (обычно не трогают)\nmin.cleanable.dirty.ratio=0.5\nmin.compaction.lag.ms=0`,
                },
                {
                  type: 'note',
                  text: 'Compaction — основа Kafka Streams (KTable) и «materialized views». Классика: `topic users` (compacted) хранит последний профиль пользователя. Новый consumer получает актуальное состояние, не перечитывая всю историю. Для event-sourcing (все факты) — `delete`, для state (последнее значение) — `compact`.',
                },
              ],
            },
            {
              id: 'kf-l7-s3',
              title: 'Проверь себя: compaction',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `cleanup.policy=compact`?',
                options: [
                  { id: 'a', text: 'Удаляет старые сегменты целиком' },
                  { id: 'b', text: 'Сжимает сегменты: оставляет только последнее значение для каждого ключа' },
                  { id: 'c', text: 'Архивирует в S3' },
                  { id: 'd', text: 'Сжимает данные через gzip' },
                ],
                correct: ['b'],
                explanation:
                  'Compaction — «последнее значение по ключу». Подходит для «таблиц состояния» (последний профиль, последний статус). Для event-sourcing (все факты) — `delete`. Для обоих — `compact,delete`.',
              },
            },
            {
  id: 'kf-l7-s4',
  title: 'Проверь себя: delete vs compact',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'В каких случаях нужен `cleanup.policy=compact` (или `compact,delete`)?',
    options: [
      { id: 'a', text: 'Хранить «последний профиль» пользователя' },
      { id: 'b', text: 'Хранить все события заказов за неделю' },
      { id: 'c', text: 'KTable в Kafka Streams (таблица состояния)' },
      { id: 'd', text: 'Материализованные представления для быстрого чтения' },
    ],
    correct: ['a', 'c', 'd'],
    explanation:
      'compact оставляет только последнее значение по ключу — для «таблиц состояния» (профили, KTable, materialized views). Для «всех событий» (история заказов) — delete. compact,delete — если нужны и «последнее», и «за период».',
  },
},
{
  id: 'kf-l7-s5',
  title: 'Проверь себя: реальные цифры',
  type: 'quiz',
  quiz: {
    kind: 'number',
    question: 'Сколько дней по умолчанию Kafka хранит сообщения (retention.ms)?',
    correct: 7,
    explanation:
      'По умолчанию retention.ms = 604800000 = 7 дней. Настраивается per-topic. Для аналитики можно 30–90 дней, для event sourcing — 365+ или compact. Для прода — зависит от SLA и объёма.',
  },
},
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m3 — Producer и Consumer
    // ─────────────────────────────────────────────
    {
      id: 'kf-m3',
      title: 'Producer и Consumer',
      lessons: [
        {
          id: 'kf-l8',
          title: 'Producer: acks и идемпотентность',
          minutes: 30,
          steps: [
            {
              id: 'kf-l8-s1',
              title: 'acks: три уровня надёжности',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'acks',
                  head: ['Значение', 'Что ждёт producer', 'Риск потери'],
                  rows: [
                    ['acks=0', 'Ничего (fire-and-forget)', 'Высокий: сообщение может потеряться сразу'],
                    ['acks=1', 'Подтверждения от лидера', 'Средний: если лидер упал до репликации — потеря'],
                    ['acks=all', 'Подтверждения от всех ISR', 'Низкий: только при потере кворума'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'acks=all: ждём подтверждения от всех ISR',
                  code: `sequenceDiagram
                    participant P as Producer
                    participant L as Leader
                    participant F1 as Follower 1
                    participant F2 as Follower 2
                    P->>L: produce
                    L->>F1: replicate
                    L->>F2: replicate
                    F1-->>L: ack
                    F2-->>L: ack
                    L-->>P: ack (все ISR подтвердили)`,
                },
                {
                  type: 'note',
                  text: 'Для прода — `acks=all`, `replication.factor=3`, `min.insync.replicas=2`. Это стандарт: запись подтверждается, только если лидер + минимум 1 фолловер записали. Потеря данных — только при падении 2 брокеров одновременно (что значит потеря кворума).',
                },
              ],
            },
            {
              id: 'kf-l8-s2',
              title: 'Идемпотентность: без дубликатов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'С `acks=all` и `retries>0` есть риск: producer отправил, лидер записал, но ack потерялся в сети. Producer ретраит — лидер записывает второй раз. Дубликат. Решение — `enable.idempotence=true` (Kafka 3.0+ включено по умолчанию): producer получает PID, лидер дедуплицирует по (PID, epoch, sequence).',
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Идемпотентный producer',
                  code: `# С Kafka 3.0 — включено по умолчанию\nenable.idempotence=true\nacks=all                          # обязательно\nretries=Integer.MAX_VALUE         # обязательно\nmax.in.flight.requests.per.connection=5   # ≤5 для идемпотентности`,
                },
                {
                  type: 'list',
                  items: [
                    'enable.idempotence=true — producer не создаёт дубликаты при ретраях',
                    'Требует acks=all, retries>0',
                    'PID (producer id) + sequence number — дедупликация на брокере',
                    'Работает только в рамках одной сессии producer-а (перезапуск — новый PID)',
                    'Для exactly-once между рестартами — транзакции (следующий урок)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Идемпотентность решает 90% проблем с дубликатами. Не «отключить retries» — это потеря данных. Включайте `enable.idempotence=true` (в новых Kafka — по умолчанию) и спите спокойно.',
                },
              ],
            },
            {
              id: 'kf-l8-s3',
              title: 'Проверь себя: acks',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какое значение `acks` выбрать для продакшена, где важна надёжность?',
                options: [
                  { id: 'a', text: 'acks=0 — быстрее' },
                  { id: 'b', text: 'acks=1 — баланс' },
                  { id: 'c', text: 'acks=all — ждём подтверждения от всех ISR' },
                  { id: 'd', text: 'acks=-1' },
                ],
                correct: ['c'],
                explanation:
                  '`acks=all` (он же `-1`) — ждёт подтверждения от лидера и всех ISR. Единственный вариант для прода с `replication.factor=3` и `min.insync.replicas=2`. `acks=0` — потеря данных при любом сбое. `acks=1` — потеря при падении лидера.',
              },
            },
            {
              id: 'kf-l8-s4',
              title: 'Проверь себя: идемпотентность',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что даёт `enable.idempotence=true` в producer?',
                options: [
                  { id: 'a', text: 'Producer не создаёт дубликаты при ретраях' },
                  { id: 'b', text: 'Требует `acks=all`' },
                  { id: 'c', text: 'Гарантирует exactly-once между рестартами producer' },
                  { id: 'd', text: 'Работает в рамках одной сессии producer-а' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Идемпотентность = дедупликация по (PID, epoch, sequence) на брокере. Требует `acks=all`, `retries>0`. Работает в рамках одной сессии — при рестарте новый PID. Для exactly-once между рестартами — транзакции.',
              },
            },
            {
  id: 'kf-l8-s5',
  title: 'Retries, max.in.flight и порядок',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'С acks=all и retries>0 есть тонкость: если producer отправляет несколько батчей параллельно (max.in.flight > 1), а один упал и повторяется — порядок может нарушиться. Первый батч ретраится, второй уже ушёл.' },
    {
      type: 'code',
      lang: 'properties',
      caption: 'Безопасная комбинация',
      code: `enable.idempotence=true
acks=all
retries=Integer.MAX_VALUE
max.in.flight.requests.per.connection=5   # ≤5 — идемпотентность сохраняет порядок`,
    },
    {
      type: 'list',
      items: [
        'max.in.flight ≤ 5 + idempotence=true — порядок сохраняется',
        'max.in.flight > 5 + idempotence — порядок может нарушиться при ретраях',
        'Отключить idempotence — единственный способ потерять порядок при retries',
        'При acks=0/1 retries не помогает — сообщение уже «потеряно»',
      ],
    },
  ],
},
{
  id: 'kf-l8-s6',
  title: 'Проверь себя: acks=all + idempotence + retries',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'Вы включили `enable.idempotence=true`, `acks=all`, `retries=MAX`. Что вы получили?',
    options: [
      { id: 'a', text: 'Producer не создаёт дубликаты при ретраях' },
      { id: 'b', text: 'Producer переживает временные сбои лидера партиции' },
      { id: 'c', text: 'Exactly-once между рестартами producer-а' },
      { id: 'd', text: 'Порядок сообщений с одинаковым key сохраняется' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'a — идемпотентность дедуплицирует по (PID, seq). b — acks=all + retries = переживаем сбой лидера. d — при max.in.flight ≤ 5 порядок сохраняется. c — exactly-once между рестартами требует транзакций (следующий урок).',
  },
},
          ],
        },
        {
          id: 'kf-l9',
          title: 'Транзакции и exactly-once',
          minutes: 30,
          steps: [
            {
              id: 'kf-l9-s1',
              title: 'Exactly-once semantics (EOS)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Exactly-once — «каждое сообщение обработано ровно один раз». В распределённых системах это дорого. Kafka достигает EOS через: идемпотентный producer + транзакции + read_committed consumer. Итог: producer пишет в несколько партиций атомарно, consumer видит только закоммиченные сообщения.',
                },
                {
                  type: 'mermaid',
                  caption: 'Транзакция: атомарно записать в 2 партиции',
                  code: `sequenceDiagram
                    participant P as Producer
                    participant T as Transaction Coordinator
                    participant B as Brokers
                    P->>T: initTransaction
                    P->>B: produce (partition A)
                    P->>B: produce (partition B)
                    P->>B: produce (partition C)
                    alt всё ок
                        P->>T: commitTransaction
                        T->>B: commit markers
                    else ошибка
                        P->>T: abortTransaction
                        T->>B: abort markers
                        Note over B: consumer с read_committed<br/>не увидит эти сообщения
                    end`,
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Настройки producer',
                  code: `transactional.id=my-app-1          # уникальный на инстанс producer\ntransaction.timeout.ms=60000\nenable.idempotence=true            # обязательно для транзакций`,
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Настройки consumer для EOS',
                  code: `isolation.level=read_committed     # видеть только закоммиченные\n# read_uncommitted (по умолчанию) — видеть всё, включая прерванные`,
                },
              ],
            },
            {
              id: 'kf-l9-s2',
              title: 'Практика: транзакции в Python',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Producer с транзакциями',
                  code: `from kafka import KafkaProducer\n\nproducer = KafkaProducer(\n    bootstrap_servers="localhost:9092",\n    transactional_id="orders-service-1",\n    enable_idempotence=True,\n)\n\nproducer.init_transactions()\n\ntry:\n    producer.begin_transaction()\n    producer.send("orders.created", key=b"user:1", value=b'{"order_id": 1}')\n    producer.send("payments.pending", key=b"order:1", value=b'{"amount": 100}')\n    producer.commit_transaction()\nexcept Exception:\n    producer.abort_transaction()\n    raise`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Использование EOS',
                  code: `1. Producer с transactional.id + enable.idempotence
2. Consumer с isolation.level=read_committed
3. Транзакция = «атомарно записать в N партиций»
4. Consumer видит только закоммиченные (прерванные пропускаются)

Плюсы: настоящий exactly-once.
Минусы: дороже (2–3× overhead), нужен Transaction Coordinator,
        работает только в рамках Kafka (не «Kafka + Postgres»).`,
                },
                {
                  type: 'note',
                  text: 'EOS в Kafka работает только между Kafka-топиками. Если consumer читает Kafka и пишет в Postgres — exactly-once не гарантируется (Postgres не участвует в транзакции). Решения: outbox-pattern, идемпотентные записи по key. На собеседовании: «как достичь exactly-once?» — «идемпотентный producer + транзакции + read_committed», с оговоркой про границы.',
                },
              ],
            },
            {
              id: 'kf-l9-s3',
              title: 'Проверь себя: EOS',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно для exactly-once семантики в Kafka?',
                options: [
                  { id: 'a', text: 'Идемпотентный producer' },
                  { id: 'b', text: 'Транзакции (`transactional.id`)' },
                  { id: 'c', text: 'Consumer с `isolation.level=read_committed`' },
                  { id: 'd', text: '`acks=0`' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'EOS = идемпотентный producer + транзакции + read_committed consumer. `acks=0` — наоборот, потеря данных. EOS работает только между Kafka-топиками; при записи в Postgres — нужны другие паттерны (outbox).',
              },
            },
            {
  id: 'kf-l9-s4',
  title: 'Проверь себя: где EOS не работает',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Consumer читает Kafka и пишет в Postgres. Гарантирует ли Kafka exactly-once в этом сценарии?',
    options: [
      { id: 'a', text: 'Да, транзакции Kafka всё гарантируют' },
      { id: 'b', text: 'Нет — Postgres не участвует в транзакции Kafka, нужен outbox-pattern или идемпотентная запись' },
      { id: 'c', text: 'Да, если acks=all' },
      { id: 'd', text: 'Да, если enable.idempotence=true' },
    ],
    correct: ['b'],
    explanation:
      'EOS в Kafka работает только между Kafka-топиками. Как только вы пишете в Postgres — это уже не транзакция Kafka. Решения: outbox-pattern (писать в БД и в Kafka атомарно через outbox), идемпотентные записи по key, two-phase commit (редко).',
  },
},
{
  id: 'kf-l9-s5',
  title: 'Проверь себя: isolation.level',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что должен указать consumer, чтобы видеть только закоммиченные сообщения (не прерванные)?',
    options: [
      { id: 'a', text: 'isolation.level=read_uncommitted (по умолчанию)' },
      { id: 'b', text: 'isolation.level=read_committed' },
      { id: 'c', text: 'transactional.id=consumer-1' },
      { id: 'd', text: 'enable.auto.commit=true' },
    ],
    correct: ['b'],
    explanation:
      'read_committed — видеть только сообщения из закоммиченных транзакций, пропускать прерванные. read_uncommitted (дефолт) — видеть всё, включая прерванные. Для EOS consumer-а — обязателен read_committed.',
  },
},
          ],
        },
        {
          id: 'kf-l10',
          title: 'Batching, compression, tuning',
          minutes: 25,
          steps: [
            {
              id: 'kf-l10-s1',
              title: 'Batching: почему Kafka быстрая',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Kafka оптимизирована под «много мелких сообщений». Producer копит сообщения в batch и отправляет одним запросом — это на порядки быстрее, чем по одному. Сжатие (gzip, snappy, lz4, zstd) сжимает весь batch. Итог: миллионы сообщений/сек на обычном железе.',
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Параметры batch и compression',
                  code: `# Сколько ждать перед отправкой батча\nlinger.ms=10                    # 0 (сразу) — низкая latency; 10–100 — выше throughput\n\n# Максимальный размер батча\nbatch.size=16384                # 16 KB по умолчанию; 64–256 KB для throughput\n\n# Сжатие (zstd — лучший баланс)\ncompression.type=zstd           # none | gzip | snappy | lz4 | zstd\n\n# Сколько батчей в полёте\nmax.in.flight.requests.per.connection=5`,
                },
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Параметр', 'Latency', 'Throughput'],
                  rows: [
                    ['linger.ms=0', 'Минимальная', 'Низкий'],
                    ['linger.ms=10–100', 'Средняя', 'Высокий'],
                    ['compression.type=zstd', 'Средняя', 'Лучший'],
                    ['batch.size=64–256KB', 'Средняя', 'Высокий'],
                  ],
                },
                {
                  type: 'note',
                  text: 'По умолчанию Kafka уже быстрая. Если нужно «максимум throughput» — `linger.ms=10–100`, `compression.type=zstd`, `batch.size=64–256KB`. Если «минимальная latency» (например, real-time) — `linger.ms=0`. Баланс — `linger.ms=10`, `compression=zstd`.',
                },
              ],
            },
            {
              id: 'kf-l10-s2',
              title: 'Проверь себя: batching',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `linger.ms` в producer?',
                options: [
                  { id: 'a', text: 'Задерживает отправку, чтобы накопить batch (выше throughput, выше latency)' },
                  { id: 'b', text: 'Таймаут на подключение' },
                  { id: 'c', text: 'Максимальный размер сообщения' },
                  { id: 'd', text: 'Retention на топике' },
                ],
                correct: ['a'],
                explanation:
                  '`linger.ms` — сколько ждать перед отправкой. Больше — лучше batch, выше throughput, но выше latency. `0` — «отправляй сразу». `10–100` — баланс для throughput. `compression.type=zstd` + `linger.ms=10` — стандарт для high-throughput.',
              },
            },
            {
  id: 'kf-l10-s3',
  title: 'compression.type: что выбрать',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'Сжатие применяется к батчу целиком, а не к каждому сообщению. Меньше данных — быстрее сеть и диск. Но: сильнее сжатие — больше CPU на producer и consumer.' },
    {
      type: 'table',
      caption: 'Алгоритмы сжатия',
      head: ['Алгоритм', 'Степень сжатия', 'CPU', 'Когда'],
      rows: [
        ['none', '0%', '0', 'Не сжимать (редко)'],
        ['gzip', 'Высокая', 'Высокий', 'Мало данных, важна экономия'],
        ['snappy', 'Средняя', 'Низкий', 'Баланс, стандарт'],
        ['lz4', 'Средняя', 'Низкий', 'Быстрее snappy, часто лучше'],
        ['zstd', 'Высокая', 'Средний', 'Лучший баланс в 2025, рекомендуется'],
      ],
    },
    { type: 'note', text: 'В 2025 zstd — стандарт для high-throughput. Даёт сжатие как gzip при CPU как lz4. Для больших сообщений (JSON) — экономия в 5–10 раз. Для маленьких (числа) — почти не помогает.' },
  ],
},
{
  id: 'kf-l10-s4',
  title: 'Проверь себя: compression не поможет',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'В каком случае compression.type=zstd НЕ даст заметного выигрыша?',
    options: [
      { id: 'a', text: 'Большие JSON-сообщения по 10 КБ' },
      { id: 'b', text: 'Маленькие сообщения по 50 байт (числа)' },
      { id: 'c', text: 'Логи с повторяющимися полями' },
      { id: 'd', text: 'Текстовые события с частыми словами' },
    ],
    correct: ['b'],
    explanation:
      'Сжатие работает на «избыточности». В 50-байтном сообщении сжимать нечего — overhead заголовков больше выигрыша. Для маленьких сообщений лучше «набить батч» (linger.ms) и сжимать батч, а не отдельные сообщения.',
  },
},
{
  id: 'kf-l10-s5',
  title: 'Проверь себя: throughput vs latency',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Вам нужна минимальная latency (real-time). Какой `linger.ms` выбрать?',
    options: [
      { id: 'a', text: '0 (отправлять сразу)' },
      { id: 'b', text: '100 (накопить побольше)' },
      { id: 'c', text: '1000 (ждать секунду)' },
      { id: 'd', text: 'Не имеет значения' },
    ],
    correct: ['a'],
    explanation:
      'linger.ms=0 — «отправляй сразу, не жди». Latency минимальная, throughput ниже (меньше батч). linger.ms=10–100 — баланс для high-throughput. Если latency критична (real-time) — 0, если throughput — 10–100 + zstd.',
  },
},
          ],
        },
        {
          id: 'kf-l11',
          title: 'Rebalance и consumer liveness',
          minutes: 25,
          steps: [
            {
              id: 'kf-l11-s1',
              title: 'Что такое rebalance',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Rebalance — перераспределение партиций между consumer-ами группы. Происходит при: подключении нового consumer-а, отключении старого, изменении количества партиций, падении consumer-а по heartbeat. Во время rebalance вся группа «замирает» — не читает.',
                },
                {
                  type: 'mermaid',
                  caption: 'Rebalance: новый consumer забрал партиции',
                  code: `graph LR
                    subgraph Before["До: 2 consumer-а"]
                        C1["consumer 1<br/>P0, P1, P2"]
                        C2["consumer 2<br/>P3, P4, P5"]
                    end
                    subgraph After["После: 3 consumer-а"]
                        C3["consumer 1<br/>P0, P1"]
                        C4["consumer 2<br/>P2, P3"]
                        C5["consumer 3<br/>P4, P5"]
                    end`,
                },
                {
                  type: 'code',
                  lang: 'properties',
                  caption: 'Параметры heartbeat',
                  code: `# Consumer шлёт heartbeat раз в 3 сек\nheartbeat.interval.ms=3000\n\n# Если 45 сек нет heartbeat — consumer считается мёртвым\nsession.timeout.ms=45000\n\n# Максимальное время на обработку batch перед poll()\nmax.poll.interval.ms=300000   # 5 мин`,
                },
                {
                  type: 'note',
                  text: '`max.poll.interval.ms` — критичный параметр. Если consumer обрабатывает batch дольше, чем это значение, Kafka считает его «мёртвым» и запускает rebalance. Классика: тяжёлая обработка 10 минут при лимите 5 → бесконечные rebalance. Решение: уменьшить `max.poll.records` или увеличить `max.poll.interval.ms`.',
                },
              ],
            },
            {
              id: 'kf-l11-s2',
              title: 'Cooperative sticky и static membership',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Eager rebalance (старое) — все consumer-ы отдают партиции, потом получают заново',
                    'Cooperative sticky (новое) — отдаются только «лишние» партиции, остальные продолжают читать',
                    '`partition.assignment.strategy=CooperativeStickyAssignor` — рекомендуется',
                    'Static membership (`group.instance.id`) — consumer не выпадает при рестарте в пределах `session.timeout.ms`',
                    'Static membership — must-have для Kubernetes: pod перезапустился → не rebalance всей группы',
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Кооперативный rebalance в Python',
                  code: `from kafka import KafkaConsumer\n\nconsumer = KafkaConsumer(\n    "orders.created",\n    bootstrap_servers="localhost:9092",\n    group_id="orders-service",\n    auto_offset_reset="earliest",\n    enable_auto_commit=False,\n    partition_assignment_strategy=["CooperativeStickyAssignor"],\n    group_instance_id="orders-service-pod-1",   # static membership\n)`,
                },
                {
                  type: 'note',
                  text: 'Cooperative sticky + static membership — стандарт 2025. Старый eager rebalance останавливает всю группу — на 20 партициях с 10 consumer-ами это заметно. Cooperative отдаёт только «лишние» партиции.',
                },
              ],
            },
            {
              id: 'kf-l11-s3',
              title: 'Проверь себя: rebalance',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если consumer обрабатывает batch дольше `max.poll.interval.ms`?',
                options: [
                  { id: 'a', text: 'Ничего, Kafka подождёт' },
                  { id: 'b', text: 'Kafka запустит rebalance — consumer будет исключён из группы' },
                  { id: 'c', text: 'Consumer получит все партиции' },
                  { id: 'd', text: 'Сообщения удалятся' },
                ],
                correct: ['b'],
                explanation:
                  '`max.poll.interval.ms` — «сколько consumer может не звать poll()». Если обработка дольше — Kafka считает consumer мёртвым и запускает rebalance. Классика: тяжёлая обработка 10 мин при лимите 5 → бесконечные rebalance. Решение: `max.poll.records` меньше или `max.poll.interval.ms` больше.',
              },
            },
            {
  id: 'kf-l11-s4',
  title: 'Проверь себя: static membership',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что даёт `group.instance.id` (static membership)?',
    options: [
      { id: 'a', text: 'Позволяет consumer-у не выпадать из группы при рестарте в пределах session.timeout.ms' },
      { id: 'b', text: 'Ускоряет обработку сообщений' },
      { id: 'c', text: 'Заменяет group.id' },
      { id: 'd', text: 'Отключает heartbeat' },
    ],
    correct: ['a'],
    explanation:
      'Static membership: consumer с group.instance.id при рестарте (например, перезапуск pod в K8s) не выпадает из группы в пределах session.timeout.ms. Нет rebalance — нет простоя. Must-have для Kubernetes.',
  },
},
{
  id: 'kf-l11-s5',
  title: 'Проверь себя: добавление consumer',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что произойдёт при добавлении нового consumer-а в группу?',
    options: [
      { id: 'a', text: 'Ничего, новый consumer будет простаивать' },
      { id: 'b', text: 'Запустится rebalance: партиции перераспределятся между всеми' },
      { id: 'c', text: 'Все существующие consumer-ы упадут' },
      { id: 'd', text: 'Топик пересоздастся' },
    ],
    correct: ['b'],
    explanation:
      'При добавлении consumer-а группа запускает rebalance. С CooperativeSticky — только «лишние» партиции переедут, остальные продолжат читать. С Eager (старое) — вся группа остановится и перераспределится.',
  },
},
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m4 — Экосистема
    // ─────────────────────────────────────────────
    {
      id: 'kf-m4',
      title: 'Экосистема',
      lessons: [
        {
          id: 'kf-l12',
          title: 'Kafka Connect',
          minutes: 25,
          steps: [
            {
              id: 'kf-l12-s1',
              title: 'Что такое Kafka Connect',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Kafka Connect — фреймворк для «перекачки данных» между Kafka и внешними системами без кода. Source connector: внешняя система → Kafka (CDC из Postgres, S3 → Kafka). Sink connector: Kafka → внешняя система (Kafka → S3, Kafka → Elasticsearch). Готовые коннекторы на сотни систем.',
                },
                {
                  type: 'mermaid',
                  caption: 'Connect: source и sink',
                  code: `graph LR
                    PG[("Postgres")] -->|"Debezium source"| K[("Kafka topics")]
                    K -->|"S3 sink"| S3[("S3")]
                    K -->|"Elasticsearch sink"| ES[("Elasticsearch")]
                    K -->|"Snowflake sink"| SF[("Snowflake")]`,
                },
                {
                  type: 'code',
                  lang: 'json',
                  caption: 'Конфиг коннектора (Debezium PostgreSQL)',
                  code: `{
  "name": "orders-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "secret",
    "database.dbname": "app",
    "table.include.list": "public.orders",
    "topic.prefix": "cdc"
  }
}`,
                },
                {
                  type: 'list',
                  items: [
                    'Debezium — стандарт CDC (Change Data Capture) из БД в Kafka',
                    'Source: внешняя система → Kafka',
                    'Sink: Kafka → внешняя система',
                    'REST API для управления коннекторами',
                    'Distributed mode: несколько worker-ов, коннекторы распределяются',
                  ],
                },
                {
                  type: 'note',
                  text: 'Kafka Connect — «ETL без кода». Debezium читает WAL Postgres и отправляет каждое изменение (INSERT/UPDATE/DELETE) в Kafka. Классика: микросервисы слушают изменения БД, аналитика получает поток в S3 без нагрузки на прод-БД.',
                },
              ],
            },
            {
              id: 'kf-l12-s2',
              title: 'Проверь себя: Connect',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает Debezium как source connector?',
                options: [
                  { id: 'a', text: 'Превращает Kafka в БД' },
                  { id: 'b', text: 'Читает WAL/журнал БД и отправляет каждое изменение (INSERT/UPDATE/DELETE) в Kafka (CDC)' },
                  { id: 'c', text: 'Шифрует сообщения' },
                  { id: 'd', text: 'Сжимает топики' },
                ],
                correct: ['b'],
                explanation:
                  'Debezium — CDC: читает WAL Postgres / binlog MySQL и публикует каждое изменение в Kafka. Не нагрузка на БД (читает журнал), не требует триггеров, ловит все изменения — включая удаления.',
              },
            },
            {
  id: 'kf-l12-s3',
  title: 'Source vs Sink, distributed mode',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'Два типа коннекторов и два режима работы Connect. Понимание разницы — половина успеха при выборе.' },
    {
      type: 'table',
      caption: 'Типы коннекторов и режимы',
      head: ['Понятие', 'Что значит'],
      rows: [
        ['Source connector', 'Внешняя система → Kafka (CDC, файлы, API)'],
        ['Sink connector', 'Kafka → внешняя система (S3, ES, Snowflake)'],
        ['Standalone mode', 'Один процесс Connect — для dev/тестов'],
        ['Distributed mode', 'Несколько worker-ов, коннекторы распределяются — для прода'],
      ],
    },
    { type: 'note', text: 'Distributed mode — стандарт прода: несколько worker-ов, при падении одного коннекторы переезжают на живой. Конфиг хранится в Kafka-топиках (connect-configs, connect-offsets, connect-status).' },
  ],
},
{
  id: 'kf-l12-s4',
  title: 'Проверь себя: Connect vs свой код',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Когда стоит использовать Kafka Connect, а не писать свой producer/consumer?',
    options: [
      { id: 'a', text: 'Всегда — Connect быстрее' },
      { id: 'b', text: 'Когда нужна стандартная «перекачка» (БД ↔ Kafka, S3 → Kafka), а не кастомная логика' },
      { id: 'c', text: 'Только для S3' },
      { id: 'd', text: 'Только если у вас Java' },
    ],
    correct: ['b'],
    explanation:
      'Connect — для «трубы» (источник → Kafka → приёмник). Если логика кастомная (трансформация, обогащение, вызовы API) — свой код. Готовые коннекторы: Debezium, S3, Elasticsearch, JDBC, Snowflake.',
  },
},
{
  id: 'kf-l12-s5',
  title: 'Проверь себя: Debezium',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Как Debezium читает изменения из PostgreSQL, не создавая нагрузку на прод-БД?',
    options: [
      { id: 'a', text: 'Триггерами на каждой таблице' },
      { id: 'b', text: 'Читает WAL (write-ahead log) — журнал транзакций Postgres' },
      { id: 'c', text: 'Периодическим SELECT * FROM table' },
      { id: 'd', text: 'Через pg_dump каждые 5 минут' },
    ],
    correct: ['b'],
    explanation:
      'Debezium читает WAL — журнал, куда Postgres пишет все изменения. Это не нагрузка на таблицы (только чтение журнала), не требует триггеров, ловит все изменения включая DELETE. Стандарт CDC.',
  },
},
          ],
        },
        {
          id: 'kf-l13',
          title: 'Schema Registry: Avro, Protobuf, JSON Schema',
          minutes: 25,
          steps: [
            {
              id: 'kf-l13-s1',
              title: 'Зачем Schema Registry',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Проблема: producer отправляет JSON `{"id": 1, "total": "1000"}` — а consumer ждёт `{"id": 1, "total": 1000}` (число). Или producer добавил поле — consumer падает. Schema Registry хранит схемы сообщений и проверяет совместимость: producer не сможет зарегистрировать несовместимое изменение.',
                },
                {
                  type: 'mermaid',
                  caption: 'Schema Registry: producer и consumer сверяются через схемы',
                  code: `graph LR
                    P["Producer"] -->|"register schema v2"| SR[("Schema Registry")]
                    SR -->|"ok / fail (compatibility)"| P
                    P -->|"produce + schema_id"| K[("Kafka")]
                    C["Consumer"] -->|"fetch schema v2"| SR
                    K -->|"message + schema_id"| C`,
                },
                {
                  type: 'table',
                  caption: 'Форматы схем',
                  head: ['Формат', 'Плюсы', 'Минусы'],
                  rows: [
                    ['Avro', 'Компактный, эволюция схем, стандарт', 'Бинарный (не читаем глазами)'],
                    ['Protobuf', 'Быстрый, типизация, gRPC-совместимый', 'Нужны .proto файлы'],
                    ['JSON Schema', 'Читаемый, привычный', 'Больше размер, медленнее парсинг'],
                  ],
                },
                {
                  type: 'note',
                  text: 'В 2025 Avro и Protobuf — стандарт. Avro — дефолт для Kafka, Protobuf — если уже используете gRPC. JSON Schema — для «человекочитаемости». Schema Registry — must-have в проде: без него любое изменение схемы — потенциальный инцидент.',
                },
              ],
            },
            {
              id: 'kf-l13-s2',
              title: 'Совместимость схем',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Уровни совместимости',
                  head: ['Уровень', 'Что разрешено'],
                  rows: [
                    ['BACKWARD (дефолт)', 'Новый consumer читает старые сообщения; можно удалять поля, добавлять опциональные'],
                    ['FORWARD', 'Старый consumer читает новые сообщения; можно добавлять поля, удалять опциональные'],
                    ['FULL', 'И BACKWARD, и FORWARD: только добавлять/удалять опциональные поля'],
                    ['NONE', 'Всё что угодно (не рекомендуется)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'json',
                  caption: 'Avro-схема с эволюцией',
                  code: `{
  "type": "record",
  "name": "OrderCreated",
  "namespace": "com.myapp.events",
  "fields": [
    {"name": "order_id", "type": "long"},
    {"name": "user_id", "type": "long"},
    {"name": "total", "type": ["null", "double"], "default": null},
    {"name": "currency", "type": "string", "default": "RUB"}
  ]
}`,
                },
                {
                  type: 'note',
                  text: 'Правило: новая версия схемы не должна ломать существующих consumer-ов. BACKWARD — дефолт: «добавляй опциональные поля, не удаляй обязательные». В CI — проверка: `schema-registry-check` перед merge. Иначе прод упадёт на первом сообщении с новой схемой.',
                },
              ],
            },
            {
              id: 'kf-l13-s3',
              title: 'Проверь себя: Schema Registry',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен Schema Registry?',
                options: [
                  { id: 'a', text: 'Ускоряет producer' },
                  { id: 'b', text: 'Хранит схемы сообщений и проверяет совместимость — не даёт «сломать» consumer-ов' },
                  { id: 'c', text: 'Шифрует данные' },
                  { id: 'd', text: 'Заменяет Kafka Connect' },
                ],
                correct: ['b'],
                explanation:
                  'Schema Registry хранит версии схем (Avro/Protobuf/JSON Schema) и проверяет совместимость. Producer не сможет зарегистрировать несовместимое изменение. Без него любое изменение формата — потенциальный инцидент в проде.',
              },
            },
            {
  id: 'kf-l13-s4',
  title: 'Проверь себя: без Schema Registry',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что произойдёт, если producer отправит `{"total": "1000"}` (строка), а consumer ждёт `{"total": 1000}` (число)?',
    options: [
      { id: 'a', text: 'Kafka автоматически приведёт типы' },
      { id: 'b', text: 'Consumer упадёт при десериализации (или получит неверное значение) — баг в проде' },
      { id: 'c', text: 'Kafka отклонит сообщение' },
      { id: 'd', text: 'Schema Registry решит проблему' },
    ],
    correct: ['b'],
    explanation:
      'Kafka не проверяет схемы. С Schema Registry producer не смог бы зарегистрировать несовместимую схему — ошибка на этапе публикации. Без SR — баг в проде: consumer падает или получает «строку вместо числа».',
  },
},
{
  id: 'kf-l13-s5',
  title: 'Проверь себя: Avro vs JSON Schema',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Когда выбрать Avro, а когда JSON Schema для Schema Registry?',
    options: [
      { id: 'a', text: 'Avro — компактный бинарный, стандарт для Kafka; JSON Schema — читаемый, но больше и медленнее' },
      { id: 'b', text: 'Avro — только для C++, JSON Schema — для всего' },
      { id: 'c', text: 'Это одно и то же' },
      { id: 'd', text: 'JSON Schema всегда лучше' },
    ],
    correct: ['a'],
    explanation:
      'Avro — компактный бинарный формат, стандарт де-факто в Kafka. Protobuf — если уже есть gRPC. JSON Schema — «человекочитаемо», но больше размер и медленнее парсинг. Для нового проекта — Avro или Protobuf.',
  },
},
          ],
        },
        {
          id: 'kf-l14',
          title: 'ksqlDB и Kafka Streams',
          minutes: 25,
          steps: [
            {
              id: 'kf-l14-s1',
              title: 'Потоковая обработка',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Streams vs ksqlDB',
                  head: ['Инструмент', 'Язык', 'Когда'],
                  rows: [
                    ['Kafka Streams', 'Java/Scala (библиотека)', 'Сложная логика, полный контроль, свой сервис'],
                    ['ksqlDB', 'SQL (движок)', 'Простая логика (фильтры, джойны, агрегаты) SQL-запросом'],
                    ['Flink', 'Java/Python/SQL', 'Сложные stateful-операции, exactly-once, batch+stream'],
                    ['Spark Structured Streaming', 'Python/Scala/SQL', 'Batch + stream, ML, экосистема Spark'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'ksqlDB: топ-10 заказов за час',
                  code: `CREATE STREAM orders (\n  order_id BIGINT,\n  user_id BIGINT,\n  total DOUBLE\n) WITH (KAFKA_TOPIC='orders.created', VALUE_FORMAT='JSON');\n\nCREATE TABLE top_users AS\nSELECT user_id, SUM(total) AS revenue\nFROM orders\nWINDOW TUMBLING (SIZE 1 HOUR)\nGROUP BY user_id\nEMIT CHANGES;`,
                },
                {
                  type: 'list',
                  items: [
                    'Streams: stateless (map, filter) и stateful (join, aggregate, window)',
                    'KTable — «таблица состояния» (compacted topic)',
                    'Windowing: tumbling, hopping, session',
                    'Kafka Streams — библиотека (embedded в ваш сервис), ksqlDB — отдельный сервер',
                    'ksqlDB — SQL поверх Streams; для сложного — Java + Streams',
                  ],
                },
                {
                  type: 'note',
                  text: 'ksqlDB — «SQL для потоков». Идеален для быстрых агрегатов: «сумма за час по пользователю», «фильтр событий». Для сложной логики (несколько источников, кастомные state stores) — Kafka Streams или Flink. В 2025 Flink постепенно вытесняет Streams в новых проектах, но Kafka Streams — стандарт в Kafka-экосистеме.',
                },
              ],
            },
            {
              id: 'kf-l14-s2',
              title: 'Проверь себя: Streams',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем ksqlDB отличается от Kafka Streams?',
                options: [
                  { id: 'a', text: 'ksqlDB — на Python' },
                  { id: 'b', text: 'ksqlDB — SQL-движок поверх Streams, Streams — Java-библиотека для кастомной логики' },
                  { id: 'c', text: 'Это одно и то же' },
                  { id: 'd', text: 'Kafka Streams быстрее всегда' },
                ],
                correct: ['b'],
                explanation:
                  'ksqlDB — SQL-интерфейс (для простых агрегатов и фильтров). Kafka Streams — библиотека (Java/Scala) для сложной логики. ksqlDB внутри использует Streams. Для «топ-10 за час» — ksqlDB, для «кастомного state store» — Streams.',
              },
            },
            {
  id: 'kf-l14-s3',
  title: 'KStream vs KTable',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'В Kafka Streams и ksqlDB есть две абстракции для потоков. Понимание разницы — ключ к правильным запросам.' },
    {
      type: 'table',
      caption: 'KStream vs KTable',
      head: ['Абстракция', 'Что это', 'Аналог'],
      rows: [
        ['KStream', 'Поток событий — каждое новое сообщение = новый факт', 'append-only log'],
        ['KTable', 'Таблица состояния — последнее значение по ключу', 'compacted topic / materialized view'],
      ],
    },
    {
      type: 'code',
      lang: 'sql',
      caption: 'Пример',
      code: `-- KStream: все заказы (append-only)
CREATE STREAM orders (id INT, user_id INT, total DOUBLE) WITH (KAFKA_TOPIC='orders', VALUE_FORMAT='AVRO');

-- KTable: последний профиль пользователя (compacted)
CREATE TABLE users (id INT, name STRING, tier STRING) WITH (KAFKA_TOPIC='users', VALUE_FORMAT='AVRO');

-- JOIN: обогатить заказ данными пользователя
SELECT o.id, o.total, u.name FROM orders o JOIN users u ON o.user_id = u.id EMIT CHANGES;`,
    },
  ],
},
{
  id: 'kf-l14-s4',
  title: 'Проверь себя: Streams vs ksqlDB vs Flink',
  type: 'quiz',
  quiz: {
    kind: 'matching',
    question: 'Сопоставьте инструмент и его сильную сторону',
    pairs: [
      { left: 'ksqlDB', right: 'Быстрые агрегаты и фильтры SQL-запросом' },
      { left: 'Kafka Streams', right: 'Сложная логика на Java/Scala, кастомные state stores' },
      { left: 'Flink', right: 'Exactly-once, batch+stream, сложный state, ML' },
      { left: 'Spark Structured Streaming', right: 'Batch + stream, ML, экосистема Spark' },
    ],
    explanation:
      'ksqlDB — SQL для простого. Streams — Java-библиотека для сложного. Flink — самый мощный (exactly-once, state, ML). Spark — если уже используете Spark для batch/ML.',
  },
},
{
  id: 'kf-l14-s5',
  title: 'Проверь себя: state stores',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что такое state store в Kafka Streams?',
    options: [
      { id: 'a', text: 'Отдельная БД для стримов' },
      { id: 'b', text: 'Локальное хранилище состояния (RocksDB) + changelog-топик в Kafka для восстановления' },
      { id: 'c', text: 'Кэш в Redis' },
      { id: 'd', text: 'Файл на диске без репликации' },
    ],
    correct: ['b'],
    explanation:
      'Kafka Streams хранит состояние локально (RocksDB по умолчанию) и реплицирует изменения в changelog-топик. При падении инстанса состояние восстанавливается из changelog. Это и есть «state store».',
  },
},
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m5 — Эксплуатация
    // ─────────────────────────────────────────────
    {
      id: 'kf-m5',
      title: 'Эксплуатация',
      lessons: [
        {
          id: 'kf-l15',
          title: 'Monitoring: JMX, Exporter, Grafana',
          minutes: 25,
          steps: [
            {
              id: 'kf-l15-s1',
              title: 'Что мониторить',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Ключевые метрики',
                  head: ['Метрика', 'Что значит', 'Тревога'],
                  rows: [
                    ['UnderReplicatedPartitions', 'Партиции с неполным ISR', '> 0'],
                    ['OfflinePartitionsCount', 'Партиции без лидера', '> 0 (критично)'],
                    ['ActiveControllerCount', 'Сколько controller-ов', '≠ 1 (на кластер)'],
                    ['BytesInPerSec / BytesOutPerSec', 'Throughput', 'Резкий спад'],
                    ['ConsumerLag', 'Отставание consumer-ов', 'Растёт'],
                    ['RequestHandlerAvgIdlePercent', 'Загрузка брокера', '< 30%'],
                    ['NetworkProcessorAvgIdlePercent', 'Сетевые потоки', '< 30%'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'JMX — «родной» интерфейс брокера; отдаёт сотни метрик',
                    'Kafka Exporter (Prometheus) — Lag consumer-ов, партиции',
                    'JMX Exporter — метрики JMX → Prometheus',
                    'Grafana — визуализация: дашборды из kafka-lag-exporter и jmx-exporter',
                    'Kafka UI / AKHQ — визуальный браузер топиков и групп',
                  ],
                },
                {
                  type: 'note',
                  text: 'Главная метрика для прода — `UnderReplicatedPartitions`. Если > 0 — репликация «отстаёт», данные в опасности. Вторая — consumer lag. Третья — `RequestHandlerAvgIdlePercent` (загрузка брокера). Остальное — по ситуации.',
                },
              ],
            },
            {
              id: 'kf-l15-s2',
              title: 'Проверь себя: метрики',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая метрика показывает, что репликация партиций отстаёт?',
                options: [
                  { id: 'a', text: 'ConsumerLag' },
                  { id: 'b', text: 'UnderReplicatedPartitions' },
                  { id: 'c', text: 'BytesInPerSec' },
                  { id: 'd', text: 'ActiveControllerCount' },
                ],
                correct: ['b'],
                explanation:
                  '`UnderReplicatedPartitions > 0` — реплики не успевают за лидером (ISR неполный). Данные в опасности. Главная метрика здоровья кластера. ConsumerLag — про consumer-ов, BytesInPerSec — throughput, ActiveControllerCount — про controller.',
              },
            },
            {
  id: 'kf-l15-s3',
  title: 'Пороги алертов',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'Каждая метрика должна иметь порог, при котором будить инженера ночью. Без порогов дашборд — «красивая картинка», а не инструмент.' },
    {
      type: 'table',
      caption: 'Метрика → порог → действие',
      head: ['Метрика', 'Порог', 'Действие'],
      rows: [
        ['UnderReplicatedPartitions', '> 0 дольше 5 мин', 'Проверить брокеры, сеть, диск'],
        ['OfflinePartitionsCount', '> 0', 'Критично: партиция без лидера, смотреть controller'],
        ['ConsumerLag', 'Растёт > 5 мин', 'Consumer не успевает или упал'],
        ['RequestHandlerAvgIdlePercent', '< 30%', 'Брокер перегружен, добавить CPU или брокер'],
        ['ActiveControllerCount', '≠ 1', 'Split-brain: два controller-а или ни одного'],
      ],
    },
    { type: 'note', text: 'Пороги — стартовые. Дальше калибруются по вашей нагрузке: возможно, у вас ConsumerLag до 10k — норма. Главное — не «алертить на всё», а «алертить на то, что требует действий».' },
  ],
},
{
  id: 'kf-l15-s4',
  title: 'Проверь себя: ConsumerLag растёт',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'ConsumerLag растёт 15 минут. Какие причины проверить в первую очередь?',
    options: [
      { id: 'a', text: 'Consumer упал или перезапускается' },
      { id: 'b', text: 'Обработка сообщений стала медленнее (тяжёлый SQL, внешний API)' },
      { id: 'c', text: 'Партиций меньше, чем consumer-ов' },
      { id: 'd', text: 'Producer начал слать больше сообщений (нагрузка выросла)' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'Lag растёт, когда consumer не успевает: упал (a), медленно обрабатывает (b), нагрузка выросла (d). «Партиций меньше, чем consumer-ов» (c) — наоборот, лишние consumer-ы простаивают, но lag не растёт.',
  },
},
{
  id: 'kf-l15-s5',
  title: 'Проверь себя: инструменты',
  type: 'quiz',
  quiz: {
    kind: 'matching',
    question: 'Сопоставьте инструмент и его роль',
    pairs: [
      { left: 'JMX Exporter', right: 'Метрики брокера → Prometheus' },
      { left: 'kafka-lag-exporter', right: 'Consumer lag → Prometheus' },
      { left: 'Grafana', right: 'Визуализация дашбордов' },
      { left: 'AKHQ / Kafka UI', right: 'Визуальный браузер топиков и групп' },
    ],
    explanation:
      'JMX Exporter — метрики брокера. kafka-lag-exporter — lag consumer-ов. Grafana — визуализация. AKHQ — UI для «посмотреть глазами» (топики, сообщения, группы).',
  },
},
          ],
        },
        {
          id: 'kf-l16',
          title: 'Security: SASL, TLS, ACL',
          minutes: 25,
          steps: [
            {
              id: 'kf-l16-s1',
              title: 'Три уровня защиты',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Уровни безопасности',
                  head: ['Уровень', 'Что защищает', 'Протокол'],
                  rows: [
                    ['TLS (SSL)', 'Шифрование трафика, аутентификация брокера', 'SSL / TLS 1.2+'],
                    ['SASL', 'Аутентификация клиента', 'PLAIN, SCRAM, GSSAPI (Kerberos), OAUTHBEARER'],
                    ['ACL', 'Авторизация (кто что может)', 'Через брокер'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'TLS — must-have в любом проде (данные в открытом виде нельзя)',
                    'SASL/SCRAM — стандарт: логин/пароль с хэшем на брокере',
                    'SASL/PLAIN — поверх TLS, но пароль в открытом виде (только с TLS)',
                    'SASL/GSSAPI (Kerberos) — enterprise',
                    'SASL/OAUTHBEARER — интеграция с Keycloak/OIDC',
                    'ACL — `kafka-acls.sh` — «группа X может читать топик Y»',
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'ACL: разрешить чтение',
                  code: `kafka-acls.sh --add \\\n  --allow-principal User:orders-service \\\n  --operation Read \\\n  --topic orders.created \\\n  --group orders-service \\\n  --bootstrap-server localhost:9092\n\n# Список\nkafka-acls.sh --list --bootstrap-server localhost:9092`,
                },
                {
                  type: 'note',
                  text: 'Стандарт прода: TLS + SASL/SCRAM + ACL. Внутри K8s — тоже (не «внутри кластера всё можно»). Zero-trust: каждый клиент имеет свою роль и ACL. `SASL/PLAIN` без TLS — утечка пароля.',
                },
              ],
            },
            {
              id: 'kf-l16-s2',
              title: 'Проверь себя: security',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно для production-безопасности Kafka-кластера?',
                options: [
                  { id: 'a', text: 'TLS для шифрования трафика' },
                  { id: 'b', text: 'SASL для аутентификации клиента' },
                  { id: 'c', text: 'ACL для авторизации' },
                  { id: 'd', text: 'SASL/PLAIN без TLS' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'TLS + SASL + ACL — три уровня. `SASL/PLAIN` без TLS — пароль в открытом виде, не использовать. Стандарт: TLS + SASL/SCRAM + ACL. Zero-trust: даже внутри K8s — аутентификация и авторизация.',
              },
            },
            {
  id: 'kf-l16-s3',
  title: 'TLS-конфиг брокера (упрощённо)',
  type: 'theory',
  blocks: [
    { type: 'p', text: 'Типичный прод-брокер: TLS для трафика клиентов + TLS для inter-broker + SASL/SCRAM для аутентификации + ACL для авторизации. Всё включается в server.properties.' },
    {
      type: 'code',
      lang: 'properties',
      caption: 'server.properties (фрагмент)',
      code: `listeners=INTERNAL://:9092,EXTERNAL://:9093
advertised.listeners=INTERNAL://broker1:9092,EXTERNAL://kafka.example.com:9093
listener.security.protocol.map=INTERNAL:SASL_SSL,EXTERNAL:SASL_SSL
inter.broker.listener.name=INTERNAL

# SASL/SCRAM
sasl.enabled.mechanisms=SCRAM-SHA-512
listener.name.internal.sasl.enabled.mechanisms=SCRAM-SHA-512

# TLS
ssl.keystore.location=/etc/kafka/ssl/broker.keystore.jks
ssl.keystore.password=***
ssl.truststore.location=/etc/kafka/ssl/broker.truststore.jks`,
    },
    { type: 'note', text: 'INTERNAL — для брокеров между собой (в приватной сети), EXTERNAL — для клиентов снаружи. SASL_SSL = SASL (аутентификация) + SSL (шифрование). Для клиентов — свой SSL-сертификат и SCRAM-логин.' },
  ],
},
{
  id: 'kf-l16-s4',
  title: 'Проверь себя: SASL/PLAIN без TLS',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Почему SASL/PLAIN без TLS — плохая идея?',
    options: [
      { id: 'a', text: 'PLAIN работает медленно' },
      { id: 'b', text: 'Пароль передаётся в открытом виде по сети — утечка при перехвате трафика' },
      { id: 'c', text: 'PLAIN не поддерживается в Kafka' },
      { id: 'd', text: 'Это требует root' },
    ],
    correct: ['b'],
    explanation:
      'SASL/PLAIN шлёт логин и пароль в base64 (не шифрование!) — любой, кто перехватит трафик, увидит пароль. Только поверх TLS. Для прода — SASL/SCRAM (пароль хэшируется на брокере) или GSSAPI/OAUTHBEARER.',
  },
},
{
  id: 'kf-l16-s5',
  title: 'Проверь себя: ACL',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Что делает `kafka-acls.sh --add --allow-principal User:orders --operation Read --topic orders.created --group orders-service`?',
    options: [
      { id: 'a', text: 'Создаёт топик orders.created' },
      { id: 'b', text: 'Разрешает пользователю orders читать топик orders.created в рамках группы orders-service' },
      { id: 'c', text: 'Запрещает пользователю orders читать топик' },
      { id: 'd', text: 'Удаляет группу orders-service' },
    ],
    correct: ['b'],
    explanation:
      'ACL разрешает (--allow-principal) пользователю orders операцию Read на топике orders.created с consumer-group orders-service. Без этой ACL — доступ запрещён (после включения authorizer).',
  },
},
          ],
        },
        {
          id: 'kf-l17',
          title: 'Strimzi и tuning в K8s',
          minutes: 25,
          steps: [
            {
              id: 'kf-l17-s1',
              title: 'Strimzi: Kafka в Kubernetes',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Strimzi — оператор Kafka для Kubernetes. Устанавливаете оператор, создаёте CRD `Kafka` — оператор поднимает кластер, настраивает StatefulSet, PVC, Service, TLS, ACL. «Kafka в K8s без боли»: rolling upgrade, авто-восстановление, декларативная конфигурация.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Kafka cluster через Strimzi',
                  code: `apiVersion: kafka.strimzi.io/v1beta2\nkind: Kafka\nmetadata:\n  name: my-cluster\nspec:\n  kafka:\n    version: 3.9.0\n    replicas: 3\n    listeners:\n      - name: plain\n        port: 9092\n        type: internal\n        tls: false\n      - name: tls\n        port: 9093\n        type: internal\n        tls: true\n    config:\n      offsets.topic.replication.factor: 3\n      transaction.state.log.replication.factor: 3\n      min.insync.replicas: 2\n    storage:\n      type: jbod\n      volumes:\n        - id: 0\n          type: persistent-claim\n          size: 100Gi\n          class: fast-ssd\n    resources:\n      requests: { memory: 4Gi, cpu: "1" }\n      limits:   { memory: 8Gi, cpu: "2" }\n  zookeeper:\n    replicas: 0    # KRaft — без ZooKeeper`,
                },
                {
                  type: 'list',
                  items: [
                    'Strimzi — CNCF-проект, стандарт для Kafka в K8s',
                    'Оператор управляет всем: StatefulSet, PVC, Service, TLS, ACL',
                    'KRaft — `zookeeper.replicas: 0` (Kafka 3.9+)',
                    '`persistent-claim` — PVC на каждого брокера',
                    'Rolling update — автоматически при изменении CRD',
                  ],
                },
              ],
            },
            {
              id: 'kf-l17-s2',
              title: 'Tuning: hardware и retention',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Диски: локальные SSD/NVMe, не сетевые (EBS — только с high IOPS)',
                    'Память: не больше 6 GB heap на брокер (Kafka любит page cache ОС)',
                    'CPU: 8–16 cores на брокер для high-throughput',
                    'Сеть: 10 Gbps минимум для больших кластеров',
                    'num.io.threads, num.network.threads — по числу ядер',
                    'log.segment.bytes=1GB, log.retention.hours=168',
                    'auto.create.topics.enable=false — топики создаются явно',
                    'unclean.leader.election.enable=false — не терять данные',
                  ],
                },
                {
                  type: 'note',
                  text: 'Kafka любит page cache: не выделяйте брокеру всю RAM (heap 6 GB, остальное — page cache ОС). Быстрые диски — критичнее CPU: запись в append-only лог упирается в IOPS. Начинайте с 3 брокеров, NVMe, 16 cores, 64 GB RAM.',
                },
              ],
            },
            {
              id: 'kf-l17-s3',
              title: 'Проверь себя: Strimzi',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен Strimzi?',
                options: [
                  { id: 'a', text: 'Ускоряет Kafka' },
                  { id: 'b', text: 'Kubernetes-оператор: управляет Kafka-кластером через CRD (StatefulSet, PVC, TLS, ACL, rolling update)' },
                  { id: 'c', text: 'Заменяет Schema Registry' },
                  { id: 'd', text: 'Работает только с AWS' },
                ],
                correct: ['b'],
                explanation:
                  'Strimzi — оператор: вы создаёте `Kafka` CRD, а оператор поднимает StatefulSet, PVC, Service, TLS, ACL, управляет rolling upgrade. «Kafka в K8s декларативно». Стандарт для Kafka в K8s.',
              },
            },
            {
  id: 'kf-l17-s4',
  title: 'Проверь себя: hardware',
  type: 'quiz',
  quiz: {
    kind: 'multiple',
    question: 'Что критично для продакшн-брокера Kafka?',
    options: [
      { id: 'a', text: 'Быстрые локальные SSD/NVMe (высокий IOPS)' },
      { id: 'b', text: 'Много RAM для page cache (не heap)' },
      { id: 'c', text: 'Один огромный сервер вместо трёх' },
      { id: 'd', text: 'Сеть 10 Gbps минимум' },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'Kafka упирается в IOPS диска (a) и page cache (b). Сеть важна для репликации (d). Один огромный сервер (c) — антипаттерн: нет отказоустойчивости, репликация на том же железе не спасает.',
  },
},
{
  id: 'kf-l17-s5',
  title: 'Проверь себя: heap',
  type: 'quiz',
  quiz: {
    kind: 'number',
    question: 'Какой максимальный heap (в GB) рекомендуется для брокера Kafka, чтобы оставить память page cache?',
    correct: 6,
    explanation:
      'Kafka любит page cache ОС: на 64 GB RAM — heap 6 GB, остальное — page cache. Больше heap — меньше cache, медленнее чтение. На 128 GB RAM — heap всё равно 6–8 GB, остальное — cache.',
  },
},
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m6 — Практикум
    // ─────────────────────────────────────────────
    {
      id: 'kf-m6',
      title: 'Практикум',
      lessons: [
        {
          id: 'kf-l18',
          title: 'Полный сценарий: producer, consumer, DLQ',
          minutes: 35,
          steps: [
            {
              id: 'kf-l18-s1',
              title: 'Producer с гарантиями',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Producer с acks=all, key, DLQ',
                  code: `from kafka import KafkaProducer\nfrom kafka.errors import KafkaError\nimport json\n\nproducer = KafkaProducer(\n    bootstrap_servers="localhost:9092",\n    acks="all",\n    enable_idempotence=True,\n    key_serializer=lambda k: k.encode("utf-8"),\n    value_serializer=lambda v: json.dumps(v).encode("utf-8"),\n    linger_ms=10,\n    compression_type="zstd",\n)\n\ndef publish_order(order: dict) -> None:\n    key = f"user:{order['user_id']}"\n    try:\n        producer.send("orders.created", key=key, value=order).get(timeout=10)\n    except KafkaError as e:\n        # Всё, что не ушло — в DLQ\n        producer.send("orders.failed", key=key, value={**order, "error": str(e)})\n        raise`,
                },
                {
                  type: 'list',
                  items: [
                    '`acks=all` + `enable.idempotence=True` — надёжность + дедупликация',
                    '`key=user:X` — порядок по пользователю (все события одного user в одной партиции)',
                    '`linger_ms=10`, `compression_type=zstd` — throughput',
                    '`.get(timeout=10)` — синхронная отправка (для критичных событий)',
                    'DLQ (`orders.failed`) — туда падают неудачные сообщения',
                  ],
                },
              ],
            },
            {
              id: 'kf-l18-s2',
              title: 'Consumer с offset commit и DLQ',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Consumer с ручным commit и DLQ',
                  code: `from kafka import KafkaConsumer, KafkaProducer\nimport json\n\nconsumer = KafkaConsumer(\n    "orders.created",\n    bootstrap_servers="localhost:9092",\n    group_id="orders-service",\n    enable_auto_commit=False,\n    auto_offset_reset="earliest",\n    value_deserializer=lambda b: json.loads(b.decode("utf-8")),\n    key_deserializer=lambda b: b.decode("utf-8"),\n    max_poll_records=100,\n    max_poll_interval_ms=300000,\n)\n\ndlq = KafkaProducer(\n    bootstrap_servers="localhost:9092",\n    value_serializer=lambda v: json.dumps(v).encode("utf-8"),\n)\n\nfor record in consumer:\n    try:\n        process_order(record.value)\n    except Exception as e:\n        dlq.send("orders.failed", key=record.key.encode(), value={\n            **record.value, "error": str(e),\n            "partition": record.partition, "offset": record.offset,\n        })\n    finally:\n        # commit после обработки (at-least-once)\n        consumer.commit()`,
                },
                {
                  type: 'note',
                  text: 'Ключевой паттерн: `enable_auto_commit=False` + `commit()` после обработки = at-least-once (гарантируем, что не потеряем). Для exactly-once — транзакции consumer-а (`send_offsets_to_transaction`), но это сложнее. DLQ — must-have: «не смогли обработать — отложили, не потеряли».',
                },
              ],
            },
            {
              id: 'kf-l18-s3',
              title: 'Проверь себя: идемпотентный consumer',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем consumer-у нужен DLQ (dead-letter queue)?',
                options: [
                  { id: 'a', text: 'Для ускорения' },
                  { id: 'b', text: 'Чтобы не потерять сообщения, которые не удалось обработать — отложить для разбора' },
                  { id: 'c', text: 'Для сжатия' },
                  { id: 'd', text: 'Для шифрования' },
                ],
                correct: ['b'],
                explanation:
                  'DLQ — «очередь неудачных»: если обработка упала, сообщение не теряется, а уходит в `orders.failed`. Потом можно разобрать вручную или переобработать. Без DLQ — либо падаем на каждом «плохом» сообщении (бесконечный retry), либо теряем его.',
              },
            },
            {
              id: 'kf-l18-s4',
              title: 'Проверь себя: at-least-once',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как consumer достигает at-least-once семантики?',
                options: [
                  { id: 'a', text: '`enable_auto_commit=True`' },
                  { id: 'b', text: '`enable_auto_commit=False` + `commit()` после успешной обработки' },
                  { id: 'c', text: '`acks=0`' },
                  { id: 'd', text: '`isolation.level=read_uncommitted`' },
                ],
                correct: ['b'],
                explanation:
                  '`enable_auto_commit=False` + commit после обработки = at-least-once: если упали до commit, сообщение будет перечитано. Это правильный выбор для большинства: лучше обработать дважды (нужна идемпотентность!), чем потерять.',
              },
            },
            {
              id: 'kf-l18-s5',
              title: 'Проверь себя: команды',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте параметр producer и его назначение',
                pairs: [
                  { left: 'acks=all', right: 'Ждать подтверждения от всех ISR' },
                  { left: 'enable.idempotence=true', right: 'Не создавать дубликаты при ретраях' },
                  { left: 'linger.ms=10', right: 'Копить batch для throughput' },
                  { left: 'compression.type=zstd', right: 'Сжимать батч' },
                ],
                explanation:
                  '`acks=all` — надёжность. `idempotence=true` — без дублей. `linger.ms` — batch. `compression` — сжатие. Это четыре главных параметра producer для прода.',
              },
            },
            {
  id: 'kf-l18-s6',
  title: 'Проверь себя: end-to-end идемпотентность',
  type: 'quiz',
  quiz: {
    kind: 'single',
    question: 'Producer с `enable.idempotence=true` шлёт в Kafka. Consumer читает и делает `INSERT` в Postgres. При рестарте consumer-а — что нужно для end-to-end идемпотентности?',
    options: [
      { id: 'a', text: 'Ничего, Kafka гарантирует' },
      { id: 'b', text: 'Idempotency key (например, `event_id`) + `INSERT ... ON CONFLICT DO NOTHING` в Postgres' },
      { id: 'c', text: 'acks=0' },
      { id: 'd', text: 'Отключить enable.auto.commit' },
    ],
    correct: ['b'],
    explanation:
      'Kafka гарантирует «at least once» между топиками. Для записи в Postgres нужна идемпотентность на стороне потребителя: уникальный `event_id` + `ON CONFLICT DO NOTHING` (или уникальный индекс). Иначе при рестарте consumer-а — дубликаты в БД.',
  },
},
          ],
        },
      ],
    },
  ],
};