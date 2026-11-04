import type { Course } from './types';

export const sqlBasicsCourse: Course = {
  slug: 'sql-basics',
  title: 'SQL: основы',
  subtitle: 'SELECT, JOIN, агрегаты, строки, даты и UNION — от первого запроса до реальных задач',
  description:
    'Курс для тех, кто хочет уверенно писать SQL-запросы с нуля: от простого SELECT до JOIN-ов, агрегатов, строковых и датовых функций, UNION и CASE. Каждая тема закрепляется практикой на реальной схеме интернет-магазина. Без «академического» SQL — только то, что нужно QA, backend-разработчику и аналитику.',
  level: 'Новичок',
  tags: ['SQL', 'Базы данных', 'Backend'],
  accent: '#e38c00',
  icon: 'sql',
  outcomes: [
    'Понимать разницу между БД и СУБД, ориентироваться в типах баз данных',
    'Использовать DBeaver и читать ER-диаграммы',
    'Писать SELECT с фильтрацией, сортировкой и ограничением',
    'Использовать агрегаты, GROUP BY и HAVING',
    'Соединять таблицы через INNER, LEFT и другие JOIN',
    'Работать с типами данных: numeric, varchar, timestamp, jsonb',
    'Применять строковые функции: UPPER, TRIM, SUBSTRING, LIKE',
    'Работать с датами: DATE_TRUNC, EXTRACT, INTERVAL',
    'Объединять запросы через UNION, INTERSECT, EXCEPT',
    'Писать условную логику через CASE и FILTER',
  ],
  requirements: ['Любая СУБД для практики (PostgreSQL, SQLite, MySQL)', 'Базовый опыт работы с таблицами'],
  modules: [
    // ─────────────────────────────────────────────
    // m0 — Введение в базы данных (НОВЫЙ МОДУЛЬ)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m0',
      title: 'Введение в базы данных',
      lessons: [
        {
          id: 'sql-l0',
          title: 'БД, СУБД, схемы и инструменты',
          minutes: 25,
          steps: [
            {
              id: 'sql-l0-s1',
              title: 'База данных и СУБД: в чём разница',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Новички часто путают эти два понятия, хотя разница принципиальная. **База данных (БД)** — это сами данные, организованные по определённым правилам. **СУБД** (Система Управления Базами Данных) — это программное обеспечение, которое этими данными управляет.',
                },
                {
                  type: 'table',
                  caption: 'Разница на примере',
                  head: ['Понятие', 'Что это', 'Примеры'],
                  rows: [
                    ['База данных (БД)', 'Файлы на диске, где лежат таблицы с данными', 'Файл `app.db` на сервере'],
                    ['СУБД', 'Программа, которая читает, пишет и защищает эти файлы', 'PostgreSQL, MySQL, SQLite, MongoDB'],
                    ['Схема (Schema)', 'Структура данных: какие таблицы, поля, типы и связи', 'Таблицы `users`, `orders`, связи между ними'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Когда вы пишете SQL-запрос, вы общаетесь именно с СУБД. Она решает, как быстрее найти данные, проверяет права доступа и гарантирует, что данные не потеряются при сбое питания.',
                },
                {
                  type: 'note',
                  text: 'В индустрии фразу «база данных» часто используют как синоним СУБД («У нас база на PostgreSQL»). Это нормально в разговоре, но на собеседовании лучше разделять: «PostgreSQL — это СУБД, а база данных — это набор таблиц в ней».',
                },
              ],
            },
            {
              id: 'sql-l0-s2',
              title: 'Какие бывают базы данных и схемы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Базы данных делятся на два больших лагеря: реляционные (SQL) и нереляционные (NoSQL). Главное отличие — в том, насколько строгая у них **схема** (структура).',
                },
                {
                  type: 'list',
                  items: [
                    '**Реляционные (SQL)**: строгая схема. Данные лежат в таблицах, как в Excel. Нельзя добавить поле, не описав его тип заранее. Примеры: PostgreSQL, MySQL, SQLite, Oracle.',
                    '**Документоориентированные (NoSQL)**: гибкая схема (schemaless). Данные лежат как JSON-документы. Можно класть разные поля в разные записи. Примеры: MongoDB, CouchDB.',
                    '**Ключ-значение**: хранят пары «ключ → значение». Очень быстро. Используются для кэша или сессий. Примеры: Redis, Memcached.',
                    '**Графовые**: хранят узлы и связи между ними. Для соцсетей, рекомендаций, антифрода. Примеры: Neo4j, ArangoDB.',
                    '**Колоночные**: для аналитики (миллиарды строк). Примеры: ClickHouse, Cassandra.',
                  ],
                },
                {
                  type: 'note',
                  text: 'Схема (Schema) — это «чертёж» вашей базы. В реляционных БД схема строгая: если в таблице `users` есть только `id` и `name`, вы не сможете записать туда `age`, не изменив схему через `ALTER TABLE`. В NoSQL схема гибкая: один документ может иметь `age`, а другой — нет.',
                },
              ],
            },
            {
              id: 'sql-l0-s3',
              title: 'Что выбрать для старта',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Для 90% задач начинать нужно с **реляционных БД (SQL)**. Вот три причины:',
                },
                {
                  type: 'list',
                  items: [
                    '**Фундаментальность.** Понимание таблиц, связей и JOIN-ов — это база. Освоив SQL, вы легко поймёте NoSQL. Наоборот — не работает.',
                    '**Востребованность.** PostgreSQL, MySQL и SQLite используются в подавляющем большинстве проектов (и в 100% госсектора и банков).',
                    '**Простота входа.** СУБД вроде SQLite не требуют установки сервера — это просто файл.',
                  ],
                },
                {
                  type: 'table',
                  caption: 'Кого выбрать новичку',
                  head: ['СУБД', 'Плюсы', 'Минусы'],
                  rows: [
                    ['SQLite', 'Не нужно ставить сервер, база = 1 файл. Идеально для учебы', 'Не для высоких нагрузок'],
                    ['PostgreSQL', 'Стандарт индустрии, огромные возможности, бесплатно', 'Нужно ставить и настраивать сервер'],
                    ['MySQL', 'Популярен в вебе, чуть проще настройка', 'Меньше продвинутых фич, чем в PostgreSQL'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Рекомендация: начните с SQLite или PostgreSQL. Когда освоите этот курс, вы сможете работать с любой реляционной СУБД, так как стандарт SQL у них общий (различия — в синтаксисе мелких деталей).',
                },
              ],
            },
            {
              id: 'sql-l0-s4',
              title: 'Инструменты: DBeaver и ER-диаграммы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Работать с базой можно прямо из терминала (например, через `psql` для PostgreSQL), но глазами данные и схемы удобнее смотреть в GUI-клиентах. **DBeaver** — это самый популярный бесплатный и универсальный клиент. Он подключается к любой СУБД: PostgreSQL, MySQL, SQLite, Oracle, ClickHouse и сотням других.',
                },
                {
                  type: 'p',
                  text: 'Одна из главных фич DBeaver (и подобных инструментов) — построение **ER-диаграмм** (Entity-Relationship). Это визуальный «чертёж» вашей схемы. Таблицы в виде прямоугольников, а связи между ними (внешние ключи) — в виде стрелок.',
                },
                {
                  type: 'mermaid',
                  caption: 'Пример ER-диаграммы: связь «пользователь — заказы»',
                  code: `erDiagram
    USERS ||--o{ ORDERS : "делает"
    
    USERS {
        int id PK
        string email
        string name
    }
    
    ORDERS {
        int id PK
        int user_id FK
        string status
        numeric total
    }`,
                },
                {
                  type: 'p',
                  text: 'На диаграмме выше: `PK` означает Primary Key (первичный ключ, уникальный ID), а `FK` — Foreign Key (внешний ключ). Символ `||--o{` читается как «одному пользователю соответствует ноль или много заказов» (один-ко-многим).',
                },
                {
                  type: 'note',
                  text: 'В DBeaver, если открыть вкладку «ER Diagram» для базы данных, он сам нарисует такую схему на основе ваших таблиц. Это спасает, когда в базе 50+ таблиц и нужно быстро понять, как они связаны. Также в DBeaver можно выполнять SQL-запросы, смотреть планы выполнения (EXPLAIN) и экспортировать данные.',
                },
              ],
            },
            {
              id: 'sql-l0-s5',
              title: 'Проверь себя: БД vs СУБД',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения верны? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'СУБД — это программа, которая управляет базой данных' },
                  { id: 'b', text: 'Схема данных — это структура таблиц и связей между ними' },
                  { id: 'c', text: 'В NoSQL схема всегда строгая, как в SQL' },
                  { id: 'd', text: 'PostgreSQL — это пример СУБД' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'В NoSQL схема гибкая (schemaless) — это её главное отличие. Всё остальное — базовые определения.',
              },
            },
            {
              id: 'sql-l0-s6',
              title: 'Проверь себя: типы баз данных',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип БД и её типичное применение',
                pairs: [
                  { left: 'Реляционная (SQL)', right: 'Банковские транзакции, учёт заказов' },
                  { left: 'Ключ-значение (Redis)', right: 'Кэш, сессии пользователей' },
                  { left: 'Графовая (Neo4j)', right: 'Социальные графы, рекомендации' },
                  { left: 'Документоориентированная', right: 'Гибкие CMS, профили' },
                ],
                explanation:
                  'SQL — для строгих данных (деньги, заказы). Redis — для скорости (кэш). Графовые — для связей. Документные — для гибких структур. На собеседовании вопрос «какую БД выбрать» — это про понимание этих различий.',
              },
            },
            {
              id: 'sql-l0-s7',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен DBeaver и ER-диаграммы?',
                options: [
                  { id: 'a', text: 'Чтобы писать код на Python' },
                  { id: 'b', text: 'Чтобы визуально смотреть схему таблиц и связи между ними (внешние ключи)' },
                  { id: 'c', text: 'Он заменяет PostgreSQL' },
                  { id: 'd', text: 'Только для создания бэкапов' },
                ],
                correct: ['b'],
                explanation:
                  'DBeaver — универсальный GUI-клиент для баз данных. ER-диаграмма показывает таблицы в виде блоков, а связи между ними (FK) — в виде стрелок. Это быстрый способ понять структуру даже очень большой базы.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m1 — Основы SELECT (было sql-m1)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m1',
      title: 'Основы SELECT',
      lessons: [
        {
          id: 'sql-l1',
          title: 'Что такое SQL и как устроены данные',
          minutes: 20,
          steps: [
            {
              id: 'sql-l1-s1',
              title: 'Реляционная модель и схема',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'SQL — язык для работы с реляционными базами данных. Данные хранятся в таблицах: строки — записи, столбцы — поля. Таблицы связаны между собой через ключи (id). Зная связи, вы можете «собрать» нужный ответ из нескольких таблиц.' },
                { type: 'p', text: 'Все примеры курса — на схеме интернет-магазина. Четыре таблицы, связи users → orders → order_items → products.' },
                {
                  type: 'mermaid',
                  caption: 'Схема базы данных интернет-магазина',
                  code: `erDiagram
                    USERS ||--o{ ORDERS : "делает"
                    ORDERS ||--|{ ORDER_ITEMS : "содержит"
                    PRODUCTS ||--o{ ORDER_ITEMS : "входит в"
                    USERS {
                        int id PK
                        string email
                        string name
                    }
                    ORDERS {
                        int id PK
                        int user_id FK
                        string status
                        numeric total
                    }
                    ORDER_ITEMS {
                        int id PK
                        int order_id FK
                        int product_id FK
                        int quantity
                        numeric price
                    }
                    PRODUCTS {
                        int id PK
                        string name
                        string category
                        numeric price
                    }`
                },
                { type: 'note', text: 'Синтаксис в курсе — PostgreSQL. В MySQL/MSSQL отличия минимальны: например, IFNULL вместо COALESCE, LIMIT vs TOP. Принципы одинаковые.' },
              ],
            },
            {
              id: 'sql-l1-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В таблице orders поле user_id — что это?',
                options: [
                  { id: 'a', text: 'Просто число, не связанное с другими таблицами' },
                  { id: 'b', text: 'Внешний ключ, ссылающийся на users.id' },
                  { id: 'c', text: 'Пароль пользователя' },
                  { id: 'd', text: 'Номер заказа' },
                ],
                correct: ['b'],
                explanation: 'user_id — foreign key на users.id. По нему можно найти, кто сделал заказ. Без этой связи пришлось бы дублировать данные пользователя в каждой строке заказа.',
              },
            },
            {
              id: 'sql-l1-s3',
              title: 'Проверь себя: связи',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте таблицу и что в ней хранится',
                pairs: [
                  { left: 'users', right: 'Пользователи: email, имя' },
                  { left: 'orders', right: 'Заказы: статус, сумма, дата' },
                  { left: 'order_items', right: 'Позиции заказа: товар и количество' },
                  { left: 'products', right: 'Каталог товаров: название, цена' },
                ],
                explanation: 'users → orders (один ко многим), orders → order_items (один ко многим), order_items → products (многие к одному). Понимание связей — половина навыка SQL.',
              },
            },
          ],
        },
        {
          id: 'sql-l2',
          title: 'SELECT и WHERE',
          minutes: 25,
          steps: [
            {
              id: 'sql-l2-s1',
              title: 'Базовый синтаксис',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'SELECT — что, FROM — откуда, WHERE — какие',
                  code: `-- Все колонки, все строки\nSELECT * FROM users;\n\n-- Конкретные колонки\nSELECT id, email FROM users;\n\n-- С фильтром\nSELECT id, email FROM users WHERE name = 'Анна';\n\n-- Несколько условий\nSELECT * FROM orders\nWHERE status = 'paid' AND total > 1000;\n\n-- OR\nSELECT * FROM orders\nWHERE status = 'paid' OR status = 'shipped';`,
                },
                {
                  type: 'table',
                  caption: 'Операторы WHERE',
                  head: ['Оператор', 'Смысл', 'Пример'],
                  rows: [
                    ['=, !=, <, >, <=, >=', 'Сравнение', 'total >= 1000'],
                    ['IN (...) / NOT IN (...)', 'Попадание в список', "status IN ('paid', 'shipped')"],
                    ['BETWEEN a AND b', 'Диапазон (включительно)', 'total BETWEEN 500 AND 1000'],
                    ['LIKE', 'Поиск по шаблону', "email LIKE '%@gmail.com'"],
                    ['IS NULL / IS NOT NULL', 'Проверка NULL', 'user_id IS NULL'],
                  ],
                },
                { type: 'note', text: `LIKE: % — любая последовательность символов, _ — один символ. 'Ан%' — начинается на «Ан», '%ов' — заканчивается на «ов», '%кот%' — содержит «кот».` },
              ],
            },
            {
              id: 'sql-l2-s2',
              title: 'Проверь себя: SELECT',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос, который вернёт email всех пользователей (только email).',
                accepted: [
                  'SELECT email FROM users',
                  'SELECT email FROM users;',
                  'select email from users',
                  'select email from users;',
                ],
                placeholder: 'SELECT ...',
                hint: 'Одна колонка, одна таблица',
                explanation: 'SELECT email FROM users. Регистр не критичен, но ключевые слова принято писать заглавными. SELECT * вернул бы все колонки — избыточно.',
              },
            },
            {
              id: 'sql-l2-s3',
              title: 'Проверь себя: WHERE',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой запрос найдёт пользователей с email на gmail.com?',
                options: [
                  { id: 'a', text: "SELECT * FROM users WHERE email = 'gmail.com'" },
                  { id: 'b', text: "SELECT * FROM users WHERE email LIKE '%@gmail.com'" },
                  { id: 'c', text: "SELECT * FROM users WHERE email IN 'gmail.com'" },
                  { id: 'd', text: "SELECT * FROM users WHERE email CONTAINS 'gmail'" },
                ],
                correct: ['b'],
                explanation: 'LIKE с шаблоном: % — «любые символы до», @gmail.com — точное окончание. = искал бы email, равный строке «gmail.com». IN — для списка значений, не подстрок.',
              },
            },
            {
              id: 'sql-l2-s4',
              title: 'Проверь себя: операторы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте оператор и его смысл',
                pairs: [
                  { left: 'IN (1, 2, 3)', right: 'Значение равно одному из списка' },
                  { left: 'BETWEEN 10 AND 20', right: 'Значение в диапазоне включительно' },
                  { left: "LIKE 'Ан%'", right: 'Начинается на «Ан»' },
                  { left: 'IS NULL', right: 'Значение отсутствует' },
                ],
                explanation: 'IN — список, BETWEEN — диапазон, LIKE — шаблон, IS NULL — проверка на NULL. Именно IS NULL, не = NULL: = NULL в SQL всегда даёт NULL.',
              },
            },
          ],
        },
        {
          id: 'sql-l3',
          title: 'ORDER BY, LIMIT, DISTINCT',
          minutes: 20,
          steps: [
            {
              id: 'sql-l3-s1',
              title: 'Сортировка и ограничение',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'ORDER BY, LIMIT, DISTINCT',
                  code: `-- По возрастанию\nSELECT * FROM orders ORDER BY created_at;\n\n-- По убыванию\nSELECT * FROM orders ORDER BY created_at DESC;\n\n-- По нескольким полям\nSELECT * FROM orders ORDER BY status, created_at DESC;\n\n-- Топ-10 последних заказов\nSELECT * FROM orders ORDER BY created_at DESC LIMIT 10;\n\n-- Пагинация: пропустить 20, взять 10\nSELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;\n\n-- Уникальные статусы\nSELECT DISTINCT status FROM orders;\n\n-- Уникальные пары (user_id, status)\nSELECT DISTINCT user_id, status FROM orders;`,
                },
                { type: 'note', text: 'ORDER BY + LIMIT — всегда вместе. Без ORDER BY СУБД может вернуть «любые 10 строк», и результат будет плавать между запусками. Если ограничиваете — сортируйте.' },
              ],
            },
            {
              id: 'sql-l3-s2',
              title: 'Проверь себя: LIMIT',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: 5 самых дорогих заказов (по total), только id и total.',
                accepted: [
                  'SELECT id, total FROM orders ORDER BY total DESC LIMIT 5',
                  'SELECT id, total FROM orders ORDER BY total DESC LIMIT 5;',
                  'select id, total from orders order by total desc limit 5',
                ],
                placeholder: 'SELECT ...',
                hint: 'ORDER BY total DESC, потом LIMIT',
                explanation: 'SELECT id, total FROM orders ORDER BY total DESC LIMIT 5. DESC — «по убыванию». Без DESC получили бы 5 самых дешёвых.',
              },
            },
            {
              id: 'sql-l3-s3',
              title: 'Проверь себя: DISTINCT',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что вернёт `SELECT DISTINCT status FROM orders`?',
                options: [
                  { id: 'a', text: 'Все статусы всех заказов (с повторами)' },
                  { id: 'b', text: 'Уникальные значения статусов (каждое — один раз)' },
                  { id: 'c', text: 'Количество заказов по каждому статусу' },
                  { id: 'd', text: 'Ошибку' },
                ],
                correct: ['b'],
                explanation: 'DISTINCT убирает дубли. Для подсчёта по статусам нужен GROUP BY + COUNT (следующий модуль).',
              },
            },
          ],
        },
        {
          id: 'sql-l4',
          title: 'NULL: как не сломаться',
          minutes: 20,
          steps: [
            {
              id: 'sql-l4-s1',
              title: 'NULL — это не пустая строка',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'NULL — «значение неизвестно». Не ноль, не пустая строка. Любая операция с NULL даёт NULL: NULL + 5 = NULL, NULL = NULL → NULL. Это ловит на реальных багах: сумма заказа «исчезает», если у товара не указана скидка.' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'NULL в сравнениях и арифметике',
                  code: `SELECT 100 + NULL;         -- NULL, а не 100\nSELECT NULL = NULL;        -- NULL (не true!)\nSELECT NULL != NULL;       -- NULL\n\n-- Правильно: IS NULL / IS NOT NULL\nSELECT * FROM orders WHERE user_id IS NULL;\nSELECT * FROM orders WHERE user_id IS NOT NULL;\n\n-- COALESCE: первое не-NULL значение\nSELECT id, COALESCE(total, 0) AS total FROM orders;\nSELECT COALESCE(phone, email, 'нет контакта') AS contact FROM users;`,
                },
                { type: 'note', text: 'Агрегаты (SUM, AVG, MIN, MAX) игнорируют NULL. COUNT(*) считает все строки, COUNT(column) — только не-NULL. Это влияет на отчёты: AVG(total) при 100 строках с 20 NULL = сумма / 80, а не / 100.' },
              ],
            },
            {
              id: 'sql-l4-s2',
              title: 'Проверь себя: NULL',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `WHERE user_id = NULL` не работает?',
                options: [
                  { id: 'a', text: 'Нужно писать `WHERE user_id == NULL`' },
                  { id: 'b', text: 'Любое сравнение с NULL даёт NULL, поэтому запрос вернёт 0 строк' },
                  { id: 'c', text: 'user_id — не число' },
                  { id: 'd', text: 'Это работает, ошибки нет' },
                ],
                correct: ['b'],
                explanation: 'NULL = NULL → NULL (не true). WHERE оставляет только строки, где условие = true. NULL ≠ true → 0 строк. Правильно: IS NULL.',
              },
            },
            {
              id: 'sql-l4-s3',
              title: 'Проверь себя: COALESCE',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая функция вернёт первое не-NULL значение из списка? (только имя)',
                accepted: ['coalesce', 'COALESCE', 'Coalesce'],
                placeholder: 'имя функции',
                hint: 'Стандарт SQL',
                explanation: 'COALESCE(a, b, c, ...) — первое не-NULL. COALESCE(total, 0) вернёт 0, если total IS NULL.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Агрегация и JOIN (было sql-m2)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m2',
      title: 'Агрегация и JOIN',
      lessons: [
        {
          id: 'sql-l5',
          title: 'Агрегаты: COUNT, SUM, AVG, MIN, MAX',
          minutes: 25,
          steps: [
            {
              id: 'sql-l5-s1',
              title: 'Пять агрегатных функций',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Агрегаты',
                  code: `SELECT COUNT(*) FROM users;\nSELECT COUNT(*) FROM orders WHERE status = 'paid';\nSELECT SUM(total) FROM orders WHERE status = 'paid';\nSELECT AVG(total) FROM orders WHERE status = 'paid';\n\nSELECT\n    COUNT(*)        AS orders_count,\n    SUM(total)      AS revenue,\n    AVG(total)      AS avg_check,\n    MIN(total)      AS min_order,\n    MAX(total)      AS max_order\nFROM orders\nWHERE status = 'paid';`,
                },
                { type: 'note', text: 'COUNT(*) — все строки. COUNT(column) — только не-NULL. COUNT(DISTINCT column) — уникальные. COUNT(email) не посчитает пользователей без email.' },
              ],
            },
            {
              id: 'sql-l5-s2',
              title: 'Проверь себя: агрегаты',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: сумма (SUM) всех оплаченных заказов.',
                accepted: [
                  "SELECT SUM(total) FROM orders WHERE status = 'paid'",
                  "SELECT SUM(total) FROM orders WHERE status = 'paid';",
                  "select sum(total) from orders where status = 'paid'",
                ],
                placeholder: 'SELECT ...',
                hint: 'SUM, FROM, WHERE',
                explanation: "SELECT SUM(total) FROM orders WHERE status = 'paid'. Без WHERE — сумма всех заказов, включая отменённые.",
              },
            },
            {
              id: 'sql-l5-s3',
              title: 'Проверь себя: COUNT',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём разница COUNT(*) и COUNT(email)?',
                options: [
                  { id: 'a', text: 'Никакой' },
                  { id: 'b', text: 'COUNT(*) — все строки, COUNT(email) — только где email IS NOT NULL' },
                  { id: 'c', text: 'COUNT(*) быстрее' },
                  { id: 'd', text: 'COUNT(email) только в PostgreSQL' },
                ],
                correct: ['b'],
                explanation: '100 пользователей, у 10 нет email: COUNT(*) = 100, COUNT(email) = 90. COUNT(DISTINCT email) — уникальные.',
              },
            },
          ],
        },
        {
          id: 'sql-l6',
          title: 'GROUP BY и HAVING',
          minutes: 30,
          steps: [
            {
              id: 'sql-l6-s1',
              title: 'Группировка и фильтр по группам',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'GROUP BY — агрегаты по группам',
                  code: `-- Сколько заказов у каждого пользователя\nSELECT user_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id\nORDER BY order_count DESC;\n\n-- Выручка и средний чек по статусам\nSELECT\n    status,\n    COUNT(*)              AS orders_count,\n    SUM(total)            AS revenue,\n    ROUND(AVG(total), 2)  AS avg_check\nFROM orders\nGROUP BY status\nORDER BY revenue DESC;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'WHERE и HAVING — разные фильтры',
                  code: `-- Пользователи с 3+ оплаченными заказами\nSELECT user_id, COUNT(*) AS paid_orders\nFROM orders\nWHERE status = 'paid'      -- сначала фильтр строк\nGROUP BY user_id\nHAVING COUNT(*) >= 3      -- потом фильтр групп\nORDER BY paid_orders DESC;`,
                },
                { type: 'p', text: `WHERE фильтрует строки ДО группировки, HAVING — ПОСЛЕ. Если в условии агрегат (COUNT, SUM, AVG) — место в HAVING. Если обычное условие — в WHERE.` },
                { type: 'note', text: 'В SELECT при GROUP BY можно использовать только колонки из GROUP BY и агрегаты. "SELECT user_id, email, COUNT(*) ... GROUP BY user_id" — ошибка: email не в GROUP BY.' },
              ],
            },
            {
              id: 'sql-l6-s2',
              title: 'Проверь себя: GROUP BY',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: для каждого status посчитать количество заказов (колонка order_count).',
                accepted: [
                  'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status',
                  'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;',
                  'select status, count(*) as order_count from orders group by status',
                ],
                placeholder: 'SELECT ...',
                hint: 'status + COUNT(*) + GROUP BY status',
                explanation: 'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status. Каждая группа = уникальный status.',
              },
            },
            {
              id: 'sql-l6-s3',
              title: 'Проверь себя: WHERE vs HAVING',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Нужно найти пользователей с 5+ заказами. Где поставить условие COUNT(*) >= 5?',
                options: [
                  { id: 'a', text: 'В WHERE' },
                  { id: 'b', text: 'В HAVING' },
                  { id: 'c', text: 'В ORDER BY' },
                  { id: 'd', text: 'В любом месте' },
                ],
                correct: ['b'],
                explanation: 'COUNT(*) — агрегат. Агрегаты нельзя в WHERE (WHERE работает до группировки). Условие на агрегат — в HAVING.',
              },
            },
            {
              id: 'sql-l6-s4',
              title: 'Проверь себя: порядок выполнения',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В каком порядке SQL выполняет запрос?',
                options: [
                  { id: 'a', text: 'SELECT → FROM → WHERE → GROUP BY → HAVING' },
                  { id: 'b', text: 'FROM → WHERE → GROUP BY → HAVING → SELECT' },
                  { id: 'c', text: 'WHERE → FROM → SELECT → GROUP BY → HAVING' },
                  { id: 'd', text: 'FROM → SELECT → WHERE → GROUP BY → HAVING' },
                ],
                correct: ['b'],
                explanation: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Поэтому HAVING может содержать агрегаты (они уже вычислены), а WHERE — нет.',
              },
            },
            {
              id: 'sql-l6-s5',
              title: 'Практика: агрегаты по группам',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Соберите статистику по статусам: количество заказов и их сумму.',
                },
                {
                  type: 'sandbox',
                  sandbox: {
                    schema: `CREATE TABLE orders (id INTEGER, status TEXT, total INTEGER);
INSERT INTO orders VALUES
  (1, 'paid', 1000),
  (2, 'paid', 2000),
  (3, 'new', 500),
  (4, 'cancelled', 300);`,
                    task: 'Для каждого статуса посчитайте количество заказов (колонка cnt) и сумму (колонка sum). Отсортируйте по статусу по возрастанию.',
                    solution: `SELECT status, COUNT(*) AS cnt, SUM(total) AS sum
FROM orders
GROUP BY status
ORDER BY status;`,
                    expected: {
                      columns: ['status', 'cnt', 'sum'],
                      rows: [
                        ['cancelled', 1, 300],
                        ['new', 1, 500],
                        ['paid', 2, 3000],
                      ],
                      order: 'order',
                    },
                    hint: 'GROUP BY status + COUNT(*) + SUM(total) + ORDER BY status',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'sql-l7',
          title: 'INNER JOIN',
          minutes: 30,
          steps: [
            {
              id: 'sql-l7-s1',
              title: 'Соединение таблиц',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'JOIN соединяет строки двух таблиц по условию. INNER JOIN оставляет только строки, где есть совпадение с обеих сторон. Пользователь без заказов не попадёт в результат.' },
                {
                  type: 'mermaid',
                  caption: 'Логика INNER JOIN (только совпадения)',
                  code: `graph LR
                    subgraph TableA["Таблица users"]
                      A1[Пользователь 1]
                      A2[Пользователь 2]
                      A3[Пользователь без заказов]
                    end
                    subgraph TableB["Таблица orders"]
                      B1[Заказ 1]
                      B2[Заказ 2]
                    end
                    A1 -->|совпадает| B1
                    A2 -->|совпадает| B2
                    A3 -.->|нет пары, отбрасывается| X[Удалено]
                    style X fill:none,stroke:none,color:#888`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'INNER JOIN: заказы с email пользователей',
                  code: `SELECT\n    o.id        AS order_id,\n    o.total,\n    u.email     AS user_email\nFROM orders o\nJOIN users u ON u.id = o.user_id\nWHERE o.status = 'paid';`,
                },
                {
                  type: 'list',
                  items: [
                    'JOIN = INNER JOIN (синонимы)',
                    'AS o / AS u — псевдонимы таблиц',
                    'ON u.id = o.user_id — условие соединения',
                    'Условие соединения — НЕ то же самое, что WHERE',
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Три таблицы в одном запросе',
                  code: `SELECT\n    o.id            AS order_id,\n    u.email,\n    p.name          AS product,\n    oi.quantity,\n    oi.price\nFROM orders o\nJOIN users u        ON u.id  = o.user_id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p     ON p.id  = oi.product_id\nWHERE o.status = 'paid'\nORDER BY o.id;`,
                },
                { type: 'note', text: 'Чем больше JOIN-ов, тем важнее индексы на полях связи (user_id, order_id, product_id). Если запрос «висит» — это первое, что проверяют через EXPLAIN.' },
              ],
            },
            {
              id: 'sql-l7-s2',
              title: 'Проверь себя: JOIN',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: id заказа и email пользователя из orders и users. Соединение по user_id.',
                accepted: [
                  'SELECT o.id AS order_id, u.email FROM orders o JOIN users u ON u.id = o.user_id',
                  'SELECT o.id AS order_id, u.email FROM orders o JOIN users u ON u.id = o.user_id;',
                  'SELECT o.id, u.email FROM orders o JOIN users u ON u.id = o.user_id',
                  'select o.id as order_id, u.email from orders o join users u on u.id = o.user_id',
                ],
                placeholder: 'SELECT ...',
                hint: 'FROM orders o JOIN users u ON ...',
                explanation: 'Без JOIN (просто FROM orders, users) получили бы декартово произведение — все комбинации строк.',
              },
            },
            {
              id: 'sql-l7-s3',
              title: 'Проверь себя: алиасы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужны псевдонимы (AS o, AS u) при JOIN?',
                options: [
                  { id: 'a', text: 'Это требование синтаксиса' },
                  { id: 'b', text: 'Чтобы не писать полные имена таблиц и различать одноимённые колонки' },
                  { id: 'c', text: 'Для ускорения запроса' },
                  { id: 'd', text: 'Для безопасности' },
                ],
                correct: ['b'],
                explanation: 'Псевдонимы — краткость и однозначность. Без них: orders.id, users.id — а если обе таблицы имеют id, придётся писать полные имена везде.',
              },
            },
            {
              id: 'sql-l7-s4',
              title: 'Практика: JOIN + агрегат',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Соедините пользователей с их заказами и посчитайте сумму заказов каждого пользователя. Пользователи без заказов в результат не попадают — это обычный INNER JOIN.',
                },
                {
                  type: 'sandbox',
                  sandbox: {
                    schema: `CREATE TABLE users (id INTEGER, email TEXT);
CREATE TABLE orders (id INTEGER, user_id INTEGER, total INTEGER);
INSERT INTO users VALUES
  (1, 'a@x.com'),
  (2, 'b@x.com'),
  (3, 'c@x.com');
INSERT INTO orders VALUES
  (10, 1, 1000),
  (11, 1, 500),
  (12, 2, 2000);`,
                    task: 'Выведите email пользователя (колонка email) и сумму его заказов (колонка total). Отсортируйте по email.',
                    solution: `SELECT u.email, SUM(o.total) AS total
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.email
ORDER BY u.email;`,
                    expected: {
                      columns: ['email', 'total'],
                      rows: [
                        ['a@x.com', 1500],
                        ['b@x.com', 2000],
                      ],
                      order: 'order',
                    },
                    hint: 'JOIN users u ... orders o ON o.user_id = u.id, затем GROUP BY u.email и SUM(o.total)',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'sql-l8',
          title: 'LEFT, RIGHT, FULL JOIN',
          minutes: 30,
          steps: [
            {
              id: 'sql-l8-s1',
              title: 'Все виды JOIN',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Виды JOIN',
                  head: ['Тип', 'Что оставляет'],
                  rows: [
                    ['INNER JOIN', 'Только совпадения с обеих сторон'],
                    ['LEFT JOIN', 'Все из левой + совпадения из правой (NULL если нет)'],
                    ['RIGHT JOIN', 'Все из правой + совпадения из левой (NULL если нет)'],
                    ['FULL OUTER JOIN', 'Всё из обеих таблиц'],
                    ['CROSS JOIN', 'Декартово произведение'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Логика LEFT JOIN (все из левой таблицы)',
                  code: `graph LR
                    subgraph TableA["users (Левая таблица)"]
                      A1[Пользователь 1]
                      A2[Пользователь 2]
                      A3[Пользователь без заказов]
                    end
                    subgraph TableB["orders (Правая таблица)"]
                      B1[Заказ 1]
                      B2[Заказ 2]
                    end
                    A1 -->|совпадает| B1
                    A2 -->|совпадает| B2
                    A3 -->|нет пары| N[Возвращает NULL]
                    style N fill:#ff9800,color:#000`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'LEFT JOIN: пользователи без заказов',
                  code: `SELECT u.id, u.email\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;`,
                },
                { type: 'p', text: 'LEFT JOIN даёт всем пользователям хотя бы одну строку. Если заказа нет — o.id = NULL. WHERE o.id IS NULL оставляет только таких. Это классический «anti-join».' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы с количеством позиций',
                  code: `SELECT\n    o.id,\n    o.total,\n    COUNT(oi.id) AS items_count\nFROM orders o\nLEFT JOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.total\nORDER BY items_count ASC;`,
                },
                { type: 'note', text: 'COUNT(oi.id), а не COUNT(*). COUNT(*) посчитает и заказы без позиций как «1». COUNT(oi.id) считает только не-NULL — реальные позиции.' },
              ],
            },
            {
              id: 'sql-l8-s2',
              title: 'Проверь себя: LEFT JOIN',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой запрос найдёт пользователей без заказов?',
                options: [
                  { id: 'a', text: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id' },
                  { id: 'b', text: 'SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL' },
                  { id: 'c', text: 'SELECT * FROM users WHERE orders = 0' },
                  { id: 'd', text: 'SELECT * FROM users RIGHT JOIN orders ON users.id = orders.user_id' },
                ],
                correct: ['b'],
                explanation: 'LEFT JOIN + WHERE orders.id IS NULL — классический anti-join. LEFT JOIN сохраняет всех, у кого нет заказов — orders.id = NULL. WHERE оставляет только их.',
              },
            },
            {
              id: 'sql-l8-s3',
              title: 'Проверь себя: виды JOIN',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте JOIN и что он оставляет',
                pairs: [
                  { left: 'INNER JOIN', right: 'Только совпадения' },
                  { left: 'LEFT JOIN', right: 'Все из левой + совпадения' },
                  { left: 'RIGHT JOIN', right: 'Все из правой + совпадения' },
                  { left: 'FULL OUTER JOIN', right: 'Всё из обеих таблиц' },
                ],
                explanation: 'INNER — только совпадения. LEFT — всё из левой. RIGHT — всё из правой (редко). FULL — всё из обеих. На собеседовании «LEFT vs INNER» — стандарт.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Типы, строки, даты (новый)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m3',
      title: 'Типы, строки, даты',
      lessons: [
        {
          id: 'sql-l14',
          title: 'Типы данных PostgreSQL',
          minutes: 25,
          steps: [
            {
              id: 'sql-l14-s1',
              title: 'Зачем типы',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Типы данных — фундамент. Неправильный тип = баги, которые не видны в запросах. Классика: сумма в float вместо numeric — и на 0.1 + 0.2 получаете 0.30000000000000004. Сумма заказа не сходится с позициями.' },
                {
                  type: 'table',
                  caption: 'Ключевые типы PostgreSQL',
                  head: ['Тип', 'Когда использовать', 'Не использовать для'],
                  rows: [
                    ['integer / bigint', 'ID, счётчики, количество', 'Деньги, точные вычисления'],
                    ['numeric(p, s)', 'Деньги, точные вычисления', 'Массовые научные расчёты (медленнее float)'],
                    ['real / double', 'Научные расчёты, координаты', 'Деньги (потеря точности)'],
                    ['varchar(n) / text', 'Строки (text без ограничения — ок в Postgres)', 'Хранение структурированных данных'],
                    ['timestamp / timestamptz', 'Дата+время (timestamptz — с часовым поясом)', 'Только дата (используйте date)'],
                    ['date', 'Только дата (без времени)', 'Дата+время'],
                    ['boolean', 'Флаги (is_active, is_deleted)', 'Флаги с тремя состояниями (null = «неизвестно»)'],
                    ['jsonb', 'Структурированные данные (JSON с индексом)', 'Часто запрашиваемые поля (лучше отдельные колонки)'],
                    ['uuid', 'ID без утечки информации', 'ID, которые нужны «красивыми» (1, 2, 3)'],
                  ],
                },
              ],
            },
            {
              id: 'sql-l14-s2',
              title: 'Пример: правильная схема',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Таблица заказов — правильные типы',
                  code: `CREATE TABLE orders (\n    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    user_id     bigint      NOT NULL REFERENCES users(id),\n    status      text        NOT NULL CHECK (status IN ('new', 'paid', 'shipped', 'cancelled')),\n    total       numeric(12, 2) NOT NULL,\n    metadata    jsonb       NOT NULL DEFAULT '{}',\n    created_at  timestamptz NOT NULL DEFAULT now()\n);\n\n-- numeric(12, 2) — до 12 цифр всего, 2 после точки\n-- Максимум: 9 999 999 999.99 — хватит на любой заказ\n-- timestamptz — хранит UTC, конвертирует в TZ сессии\n-- jsonb — если нужно гибкое поле (например, платёжные детали)`,
                },
                {
                  type: 'note',
                  text: 'Правило: деньги — всегда numeric(p, 2). Никогда float/double. Разница: SELECT 0.1::float + 0.2::float = 0.30000000000000004, а SELECT 0.1::numeric + 0.2::numeric = 0.3.',
                },
              ],
            },
            {
              id: 'sql-l14-s3',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой тип использовать для хранения цены товара?',
                options: [
                  { id: 'a', text: 'float' },
                  { id: 'b', text: 'double precision' },
                  { id: 'c', text: 'numeric(12, 2)' },
                  { id: 'd', text: 'integer' },
                ],
                correct: ['c'],
                explanation: 'Деньги — только numeric. float/double теряют точность (0.1 + 0.2 ≠ 0.3), integer не хранит копейки. numeric(12, 2) — точный, до 12 цифр, 2 после точки.',
              },
            },
            {
              id: 'sql-l14-s4',
              title: 'Проверь себя: timestamptz',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем timestamptz отличается от timestamp?',
                options: [
                  { id: 'a', text: 'timestamptz быстрее' },
                  { id: 'b', text: 'timestamptz хранит дату+время с часовым поясом (нормализует в UTC), timestamp — без пояса' },
                  { id: 'c', text: 'timestamp только для дат' },
                  { id: 'd', text: 'Ничем' },
                ],
                correct: ['b'],
                explanation: 'timestamptz хранит UTC-момент, при выборке конвертирует в TZ сессии. timestamp — «как есть, без пояса». Для событий (created_at, paid_at) — всегда timestamptz.',
              },
            },
          ],
        },
        {
          id: 'sql-l15',
          title: 'Строковые функции',
          minutes: 25,
          steps: [
            {
              id: 'sql-l15-s1',
              title: 'Базовые функции',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Строки — половина реальных запросов. Нормализовать email, склеить ФИО, найти подстроку, обрезать пробелы — без этих функций не обойтись.' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Двенадцать функций, которые нужны всегда',
                  code: `SELECT\n    UPPER('привет')           AS upper,          -- ПРИВЕТ\n    LOWER('ПРИВЕТ')           AS lower,          -- привет\n    TRIM('  привет  ')        AS trimmed,        -- привет\n    LENGTH('привет')          AS len,            -- 6\n    SUBSTRING('привет', 1, 3) AS sub,            -- при\n    LEFT('привет', 3)         AS left3,          -- при\n    RIGHT('привет', 3)        AS right3,         -- вет\n    CONCAT('а', 'б', 'в')     AS concat,         -- абв\n    'а' || 'б' || 'в'         AS pipe,           -- абв\n    REPLACE('кот', 'к', 'б')  AS replaced,       -- бот\n    POSITION('ри' IN 'привет') AS pos,           -- 2\n    REVERSE('привет')         AS rev;            -- тевирп`,
                },
                { type: 'note', text: '|| — стандартный оператор конкатенации в SQL (работает в PostgreSQL, Oracle, SQLite). CONCAT — тоже стандарт, но в MySQL/MSSQL ведёт себя иначе (NULL). Для переносимости — ||.' },
              ],
            },
            {
              id: 'sql-l15-s2',
              title: 'Поиск подстроки: LIKE и ESCAPE',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'LIKE, ILIKE и ESCAPE',
                  code: `-- LIKE — регистрозависимый\nSELECT * FROM users WHERE email LIKE '%@GMAIL.com';\n\n-- ILIKE — регистронезависимый (PostgreSQL)\nSELECT * FROM users WHERE email ILIKE '%@gmail.com';\n\n-- Универсально: LOWER\nSELECT * FROM users WHERE LOWER(email) LIKE '%@gmail.com';\n\n-- _ — один символ\nSELECT * FROM users WHERE phone LIKE '+7_________';\n\n-- ESCAPE — поиск самого символа %\nSELECT * FROM products WHERE name LIKE '%\\%%' ESCAPE '\\';\n-- Ищет товары, в названии которых есть «%»\n\n-- Найти email без @\nSELECT * FROM users WHERE email NOT LIKE '%@%';`,
                },
                {
                  type: 'list',
                  items: [
                    'LIKE — регистрозависимый (в PostgreSQL)',
                    'ILIKE — регистронезависимый (только PostgreSQL)',
                    'LOWER(email) LIKE — универсальный способ',
                    '% — любая последовательность, _ — один символ',
                    'ESCAPE — если нужно искать сам % или _',
                  ],
                },
              ],
            },
            {
              id: 'sql-l15-s3',
              title: 'Проверь себя: строки',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как найти email, в которых нет символа @?',
                options: [
                  { id: 'a', text: "WHERE email != '@'" },
                  { id: 'b', text: "WHERE email NOT LIKE '%@%'" },
                  { id: 'c', text: "WHERE LENGTH(email) = 0" },
                  { id: 'd', text: "WHERE email IS NULL" },
                ],
                correct: ['b'],
                explanation: "NOT LIKE '%@%' — «email, в котором нет @». != '@' искал бы email, равный строке «@», а не «содержащий @». Это частый вопрос на собеседовании QA.",
              },
            },
            {
              id: 'sql-l15-s4',
              title: 'Проверь себя: конкатенация',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой оператор в SQL используется для конкатенации строк? (один или два символа)',
                accepted: ['||', '|| '],
                placeholder: 'оператор',
                hint: 'Две вертикальные черты',
                explanation: "'а' || 'б' = 'аб'. Стандарт SQL, работает в PostgreSQL, Oracle, SQLite. Для совместимости с MySQL/MSSQL иногда используют CONCAT.",
              },
            },
          ],
        },
        {
          id: 'sql-l16',
          title: 'Даты и время',
          minutes: 30,
          steps: [
            {
              id: 'sql-l16-s1',
              title: 'Дата — это не строка',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Даты в SQL — отдельный тип. Сравнивать их со строками можно (PostgreSQL приведёт), но лучше явно. Главное: у дат есть арифметика (прибавить INTERVAL, вычесть дату из даты) и функции (DATE_TRUNC, EXTRACT).' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Базовые функции',
                  code: `SELECT\n    NOW()                    AS now,           -- 2025-11-03 14:23:45+03\n    CURRENT_DATE             AS today,         -- 2025-11-03\n    CURRENT_TIME             AS time,          -- 14:23:45+03\n    DATE_TRUNC('month', NOW()) AS month_start, -- 2025-11-01 00:00:00\n    DATE_TRUNC('day',   NOW()) AS day_start,   -- 2025-11-03 00:00:00\n    EXTRACT(YEAR  FROM NOW()) AS year,         -- 2025\n    EXTRACT(MONTH FROM NOW()) AS month,        -- 11\n    EXTRACT(DOW   FROM NOW()) AS dow;          -- 1 (понедельник, 0=воскресенье)`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Арифметика дат',
                  code: `SELECT\n    NOW() + INTERVAL '1 day'   AS tomorrow,\n    NOW() - INTERVAL '7 days'  AS week_ago,\n    NOW() + INTERVAL '1 hour'  AS in_hour,\n    AGE(NOW(), '2020-01-01')   AS since_2020;   -- 5 years 10 mons 2 days\n\n-- В WHERE:\nSELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '7 days';`,
                },
              ],
            },
            {
              id: 'sql-l16-s2',
              title: 'Заказы по дням и месяцам',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Типовая задача аналитика: «выручка по месяцам», «заказы за последнюю неделю», «средний чек по дням». Решается через DATE_TRUNC + GROUP BY.' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Выручка по месяцам',
                  code: `SELECT\n    DATE_TRUNC('month', created_at) AS month,\n    COUNT(*)                         AS orders_count,\n    SUM(total)                       AS revenue\nFROM orders\nWHERE status = 'paid'\n  AND created_at >= NOW() - INTERVAL '6 months'\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY month DESC;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы за последние 7 дней',
                  code: `SELECT * FROM orders\nWHERE created_at >= NOW() - INTERVAL '7 days'\n  AND created_at < NOW()           -- не включать будущее\nORDER BY created_at DESC;`,
                },
                {
                  type: 'note',
                  text: 'Границы диапазона: `>= начало` и `< конец` — стандарт. Если написать `BETWEEN начало AND конец`, то `конец` включится, и вы захватите лишнюю секунду. Для «за последние 7 дней» — `>= NOW() - INTERVAL \'7 days\'`.',
                },
              ],
            },
            {
              id: 'sql-l16-s3',
              title: 'Проверь себя: даты',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как найти заказы за последние 7 дней?',
                options: [
                  { id: 'a', text: "WHERE created_at = NOW() - 7" },
                  { id: 'b', text: "WHERE created_at >= NOW() - INTERVAL '7 days'" },
                  { id: 'c', text: "WHERE created_at BETWEEN '7 days ago' AND NOW()" },
                  { id: 'd', text: "WHERE created_at > 7" },
                ],
                correct: ['b'],
                explanation: "INTERVAL '7 days' — стандарт для арифметики дат. `created_at = NOW() - 7` вычло бы 7 дней, но не сравнило бы «в диапазоне». BETWEEN работает, но с оговорками (границы включительно).",
              },
            },
            {
              id: 'sql-l16-s4',
              title: 'Проверь себя: DATE_TRUNC',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая функция обрезает дату до начала месяца/дня (например, DATE_TRUNC(..., NOW()))? (только имя)',
                accepted: ['date_trunc', 'DATE_TRUNC', 'Date_trunc'],
                placeholder: 'имя функции',
                hint: 'DATE_ + обрезать',
                explanation: "DATE_TRUNC('month', created_at) — обрезает до 1-го числа месяца. Стандарт для группировки по месяцам/дням/неделям.",
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Множества и условная логика (новый)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m4',
      title: 'Множества и условная логика',
      lessons: [
        {
          id: 'sql-l17',
          title: 'UNION, INTERSECT, EXCEPT',
          minutes: 25,
          steps: [
            {
              id: 'sql-l17-s1',
              title: 'Склеить два запроса',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'UNION — вертикальное склеивание: два SELECT дают одну таблицу. В отличие от JOIN (который склеивает горизонтально по колонкам), UNION добавляет строки. Количество и типы колонок должны совпадать.' },
                {
                  type: 'mermaid',
                  caption: 'JOIN vs UNION: горизонтально vs вертикально',
                  code: `graph TD
                    subgraph Join["JOIN: горизонтально"]
                        J1["users.id, name"] --- J2["orders.user_id, total"]
                        J2 --> JR["name, total"]
                    end
                    subgraph Union["UNION: вертикально"]
                        U1["SELECT email FROM users"] --> UR["все email"]
                        U2["SELECT email FROM leads"] --> UR
                    end`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'UNION: email из двух таблиц',
                  code: `-- UNION: уникальные email из обеих таблиц\nSELECT email FROM users\nUNION\nSELECT email FROM leads;\n\n-- UNION ALL: все email, включая дубли (быстрее — не дедуплицирует)\nSELECT email FROM users\nUNION ALL\nSELECT email FROM leads;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'INTERSECT и EXCEPT',
                  code: `-- INTERSECT: email, которые есть и там, и там\nSELECT email FROM users\nINTERSECT\nSELECT email FROM leads;\n\n-- EXCEPT: email из users, которых НЕТ в leads\nSELECT email FROM users\nEXCEPT\nSELECT email FROM leads;\n\n-- Порядок важен: EXCEPT A B ≠ EXCEPT B A`,
                },
              ],
            },
            {
              id: 'sql-l17-s2',
              title: 'Правила UNION',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Количество колонок в обоих SELECT должно совпадать',
                    'Типы колонок должны быть совместимы (int с int, text с text)',
                    'Имена колонок берутся из первого SELECT',
                    'ORDER BY — в конце, применяется к результату UNION',
                    'UNION дедуплицирует (медленнее), UNION ALL — нет (быстрее)',
                    'LIMIT — в конце, применяется к результату UNION',
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'С ORDER BY и LIMIT',
                  code: `(SELECT id, email, 'user' AS source FROM users)\nUNION ALL\n(SELECT id, email, 'lead' AS source FROM leads)\nORDER BY id DESC\nLIMIT 100;`,
                },
                { type: 'note', text: 'UNION ALL быстрее UNION: дедупликация требует сортировки или хеширования всего результата. Если дубли не важны или их нет — всегда UNION ALL. На собеседовании «UNION vs UNION ALL» — частый вопрос.' },
              ],
            },
            {
              id: 'sql-l17-s3',
              title: 'Проверь себя: UNION',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем UNION отличается от UNION ALL?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'UNION удаляет дубли (медленнее), UNION ALL оставляет все строки (быстрее)' },
                  { id: 'c', text: 'UNION ALL работает только с числами' },
                  { id: 'd', text: 'UNION только для двух таблиц' },
                ],
                correct: ['b'],
                explanation: 'UNION = UNION ALL + DISTINCT. Дедупликация требует сортировки или хеширования — на больших данных разница в разы. Если дубли не важны — всегда UNION ALL.',
              },
            },
          ],
        },
        {
          id: 'sql-l18',
          title: 'CASE и FILTER',
          minutes: 30,
          steps: [
            {
              id: 'sql-l18-s1',
              title: 'CASE: условная логика в SELECT',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'CASE — аналог if/else в SQL. Позволяет вернуть разное значение в зависимости от условия. Часто используется для категоризации: «дешёвый / средний / дорогой», «новый / активный / ушедший».' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'CASE: простая и поисковая форма',
                  code: `-- Простая форма: CASE column WHEN value\nSELECT\n    id,\n    CASE status\n        WHEN 'paid'      THEN 'Оплачен'\n        WHEN 'shipped'   THEN 'Отправлен'\n        WHEN 'cancelled' THEN 'Отменён'\n        ELSE 'Новый'\n    END AS status_ru\nFROM orders;\n\n-- Поисковая форма: CASE WHEN condition\nSELECT\n    id,\n    total,\n    CASE\n        WHEN total < 1000  THEN 'дешёвый'\n        WHEN total < 5000  THEN 'средний'\n        ELSE                    'дорогой'\n    END AS price_category\nFROM orders;`,
                },
                {
                  type: 'note',
                  text: 'CASE выполняется по порядку: срабатывает первое подходящее WHEN. Поэтому «WHEN total < 1000 ... WHEN total < 5000 ...» — правильно, а наоборот — нет (всё меньше 5000 попадёт во вторую ветку).',
                },
              ],
            },
            {
              id: 'sql-l18-s2',
              title: 'FILTER: агрегаты по условию',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Как посчитать в одном запросе сразу «сколько оплачено», «сколько отменено», «сколько новых»? Два подхода: FILTER (PostgreSQL) и SUM(CASE WHEN) (универсально).' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'FILTER — PostgreSQL',
                  code: `SELECT\n    COUNT(*) FILTER (WHERE status = 'paid')      AS paid_count,\n    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_count,\n    COUNT(*) FILTER (WHERE status = 'new')       AS new_count\nFROM orders;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'SUM(CASE WHEN) — универсально (MySQL, MSSQL, SQLite)',
                  code: `SELECT\n    SUM(CASE WHEN status = 'paid'      THEN 1 ELSE 0 END) AS paid_count,\n    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_count,\n    SUM(CASE WHEN status = 'new'       THEN 1 ELSE 0 END) AS new_count\nFROM orders;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'FILTER с GROUP BY: выручка по категориям',
                  code: `SELECT\n    user_id,\n    SUM(total) FILTER (WHERE status = 'paid')      AS paid_revenue,\n    SUM(total) FILTER (WHERE status = 'cancelled') AS cancelled_revenue\nFROM orders\nGROUP BY user_id;`,
                },
                { type: 'note', text: 'FILTER короче и читаемее, но только PostgreSQL с 9.4. SUM(CASE WHEN) — универсально, но длиннее. На собеседовании «как посчитать два статуса в одном запросе?» — оба варианта правильные.' },
              ],
            },
            {
              id: 'sql-l18-s3',
              title: 'Проверь себя: CASE',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В каком порядке выполняются ветки CASE?',
                options: [
                  { id: 'a', text: 'Случайно' },
                  { id: 'b', text: 'По порядку: срабатывает первое подходящее WHEN' },
                  { id: 'c', text: 'Все WHEN выполняются, возвращается последний' },
                  { id: 'd', text: 'WHERE определяет порядок' },
                ],
                correct: ['b'],
                explanation: 'CASE проверяет WHEN по порядку. Первое подходящее — выполняется, остальные игнорируются. Поэтому «WHEN total < 1000 THEN ... WHEN total < 5000 THEN ...» — правильно, иначе все < 5000 попадут во вторую ветку.',
              },
            },
            {
              id: 'sql-l18-s4',
              title: 'Проверь себя: FILTER',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Как можно посчитать количество оплаченных и отменённых заказов в одном запросе?',
                options: [
                  { id: 'a', text: 'Два отдельных SELECT через UNION' },
                  { id: 'b', text: 'COUNT(*) FILTER (WHERE status = ...)' },
                  { id: 'c', text: 'SUM(CASE WHEN status = ... THEN 1 ELSE 0 END)' },
                  { id: 'd', text: 'Только через подзапрос' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'FILTER (PostgreSQL) и SUM(CASE WHEN) (универсально) — стандартные способы. UNION из двух SELECT тоже работает, но медленнее (два прохода). Подзапрос — не единственный вариант.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Практикум (было sql-m4, расширено с 10 до 12 шагов)
    // ─────────────────────────────────────────────
    {
      id: 'sql-b-m5',
      title: 'Практикум',
      lessons: [
        {
          id: 'sql-l13',
          title: 'Практика: SELECT, JOIN, агрегаты, строки, даты',
          minutes: 40,
          steps: [
            {
              id: 'sql-l13-s1',
              title: 'Базовый фильтр',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какое ключевое слово используется для фильтрации строк в SQL?',
                options: [
                  { id: 'a', text: 'FILTER' },
                  { id: 'b', text: 'WHERE' },
                  { id: 'c', text: 'HAVING' },
                  { id: 'd', text: 'IF' },
                ],
                correct: ['b'],
                explanation: 'WHERE фильтрует строки до группировки. HAVING фильтрует уже сгруппированные данные (после GROUP BY).',
              },
            },
            {
              id: 'sql-l13-s2',
              title: 'Простой SELECT',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос, который вернёт email всех пользователей.',
                accepted: [
                  'SELECT email FROM users',
                  'SELECT email FROM users;',
                  'select email from users',
                ],
                placeholder: 'SELECT ...',
                hint: 'Одна колонка из одной таблицы',
                explanation: 'SELECT email FROM users — базовая выборка одной колонки.',
              },
            },
            {
              id: 'sql-l13-s3',
              title: 'Порядок выполнения',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте этапы выполнения SQL-запроса в правильном порядке',
                items: ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
                correct: ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'],
                explanation: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Поэтому HAVING работает с агрегатами (они уже вычислены), а WHERE — нет.',
              },
            },
            {
              id: 'sql-l13-s4',
              title: 'Синтаксис JOIN',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в запросе для соединения таблиц:',
                text: 'SELECT * ____ users u ____ JOIN orders o ____ u.id = o.user_id',
                blanks: [
                  { accepted: ['FROM'], hint: 'откуда' },
                  { accepted: ['LEFT', 'INNER'], hint: 'тип join' },
                  { accepted: ['ON'], hint: 'условие' },
                ],
                explanation: 'FROM users u LEFT JOIN orders o ON u.id = o.user_id — LEFT JOIN сохранит всех пользователей, даже без заказов.',
              },
            },
            {
              id: 'sql-l13-s5',
              title: 'Агрегатные функции',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте функцию и её назначение',
                pairs: [
                  { left: 'COUNT(*)', right: 'Количество строк' },
                  { left: 'SUM(total)', right: 'Сумма значений' },
                  { left: 'AVG(total)', right: 'Среднее значение' },
                  { left: 'MAX(total)', right: 'Максимальное значение' },
                ],
                explanation: 'Агрегаты сворачивают много строк в одно значение. COUNT — количество, SUM — сумма, AVG — среднее, MAX/MIN — экстремумы.',
              },
            },
            {
              id: 'sql-l13-s6',
              title: 'Декартово произведение',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'В таблице users 10 строк, в orders 20 строк. Сколько строк вернёт `SELECT * FROM users CROSS JOIN orders`?',
                correct: 200,
                explanation: 'CROSS JOIN создаёт декартово произведение: каждая строка одной таблицы соединяется с каждой строкой другой. 10 × 20 = 200.',
              },
            },
            {
              id: 'sql-l13-s7',
              title: 'Ловушки NULL',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения о NULL верны?',
                options: [
                  { id: 'a', text: 'NULL = NULL возвращает NULL' },
                  { id: 'b', text: 'COUNT(column) игнорирует NULL' },
                  { id: 'c', text: 'NOT IN с подзапросом, содержащим NULL, вернёт пустой результат' },
                  { id: 'd', text: 'NULL равен пустой строке' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'NULL — «неизвестно». Сравнение с NULL даёт NULL (a). Агрегаты игнорируют NULL (b). NOT IN с NULL — пустой результат (c). NULL ≠ пустая строка (d).',
              },
            },
            {
              id: 'sql-l13-s8',
              title: 'Виды JOIN',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого JOIN',
                columns: ['INNER', 'LEFT', 'FULL'],
                rows: [
                  { label: 'Только совпадения', correct: ['INNER'] },
                  { label: 'Все из левой таблицы', correct: ['LEFT'] },
                  { label: 'Всё из обеих таблиц', correct: ['FULL'] },
                  { label: 'NULL для несовпадений', correct: ['LEFT', 'FULL'] },
                ],
                explanation: 'INNER — только совпадения. LEFT — всё из левой. FULL — всё из обеих.',
              },
            },
            {
              id: 'sql-l13-s9',
              title: 'Пользователи без заказов',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос, который найдёт email пользователей без заказов.',
                accepted: [
                  'SELECT email FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL',
                  'SELECT email FROM users WHERE id NOT IN (SELECT user_id FROM orders WHERE user_id IS NOT NULL)',
                  'SELECT email FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)',
                ],
                placeholder: 'SELECT ...',
                hint: 'LEFT JOIN + IS NULL или NOT EXISTS',
                explanation: 'LEFT JOIN + WHERE orders.id IS NULL — классический anti-join. Если заказа нет, orders.id = NULL.',
              },
            },
            {
              id: 'sql-l13-s10',
              title: 'WHERE vs HAVING',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где фильтровать по результату агрегатной функции (COUNT(*) > 5)?',
                options: [
                  { id: 'a', text: 'В WHERE' },
                  { id: 'b', text: 'В HAVING' },
                  { id: 'c', text: 'В ORDER BY' },
                  { id: 'd', text: 'В SELECT' },
                ],
                correct: ['b'],
                explanation: 'WHERE выполняется до группировки, когда агрегатов ещё нет. Условия на результат агрегатов — в HAVING.',
              },
            },
            {
              id: 'sql-l13-s11',
              title: 'UNION vs UNION ALL',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем UNION отличается от UNION ALL?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'UNION удаляет дубли (медленнее), UNION ALL оставляет все строки (быстрее)' },
                  { id: 'c', text: 'UNION ALL только для двух таблиц' },
                  { id: 'd', text: 'UNION работает только с числами' },
                ],
                correct: ['b'],
                explanation: 'UNION = UNION ALL + DISTINCT. Дедупликация требует сортировки или хеширования — на больших данных разница в разы. Если дубли не важны — UNION ALL.',
              },
            },
            {
              id: 'sql-l13-s12',
              title: 'Заказы за 7 дней',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите запрос: id заказов, созданных за последние 7 дней (created_at, таблица orders).',
                starterCode: 'SELECT id FROM orders\n',
                mustInclude: [
                  { pattern: 'created_at\\s*>=', message: 'Нужно условие created_at >=' },
                  { pattern: "INTERVAL\\s+'7 days'", message: "Нужно INTERVAL '7 days'" },
                ],
                explanation: "SELECT id FROM orders WHERE created_at >= NOW() - INTERVAL '7 days'. Стандарт для «за последние N дней».",
              },
            },
          ],
        },
      ],
    },
  ],
};