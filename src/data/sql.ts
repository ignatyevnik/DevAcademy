import type { Course } from './types';

export const sqlCourse: Course = {
  slug: 'sql-basics',
  title: 'SQL с нуля',
  subtitle: 'SELECT, JOIN, агрегаты и подзапросы — от первого запроса до реальных задач',
  description:
    'Курс для тех, кто хочет уверенно писать SQL-запросы: от простого SELECT до JOIN-ов, подзапросов и CTE. Каждая тема закрепляется практикой на реальной схеме интернет-магазина. Без «академического» SQL — только то, что нужно QA, backend-разработчику и аналитику.',
  level: 'Новичок',
  tags: ['SQL', 'Базы данных', 'Backend'],
  accent: '#e38c00',
  icon: 'sql',
  outcomes: [
    'Писать SELECT с фильтрацией, сортировкой и ограничением',
    'Использовать агрегаты, GROUP BY и HAVING',
    'Соединять таблицы через INNER, LEFT и другие JOIN',
    'Писать подзапросы и CTE (WITH)',
    'Менять данные через INSERT, UPDATE, DELETE',
    'Проверять данные после действий: искать дубли, «сирот», аномалии',
  ],
  requirements: ['Любая СУБД для практики (PostgreSQL, SQLite, MySQL)', 'Базовый опыт работы с таблицами'],
  modules: [
    {
      id: 'sql-m1',
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
                {
                  type: 'p',
                  text: `SQL — язык для работы с реляционными базами данных. Данные хранятся в таблицах: строки — записи, столбцы — поля. Таблицы связаны между собой через ключи (id). Зная связи, вы можете «собрать» нужный ответ из нескольких таблиц.`,
                },
                {
                  type: 'p',
                  text: `Все примеры курса — на схеме интернет-магазина. Четыре таблицы, связи users → orders → order_items → products.`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Схема интернет-магазина',
                  code: `users\n  id          integer primary key\n  email       text\n  name        text\n  created_at  timestamp\n\norders\n  id          integer primary key\n  user_id     integer references users(id)\n  status      text      -- new | paid | shipped | cancelled\n  total       numeric\n  created_at  timestamp\n\nproducts\n  id          integer primary key\n  name        text\n  category    text\n  price       numeric\n\norder_items\n  id          integer primary key\n  order_id    integer references orders(id)\n  product_id  integer references products(id)\n  quantity    integer\n  price       numeric   -- цена на момент заказа`,
                },
                {
                  type: 'note',
                  text: `Синтаксис в курсе — PostgreSQL. В MySQL/MSSQL отличия минимальны: например, IFNULL вместо COALESCE, LIMIT vs TOP. Принципы одинаковые — SQL учится один раз.`,
                },
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
                  { id: 'b', text: 'Внешний ключ, ссылающийся на users.id — какой пользователь сделал заказ' },
                  { id: 'c', text: 'Пароль пользователя' },
                  { id: 'd', text: 'Номер заказа' },
                ],
                correct: ['b'],
                explanation:
                  'user_id — это foreign key (внешний ключ), ссылка на users.id. Так таблицы связываются: по user_id можно найти, кто сделал заказ. Без этой связи пришлось бы хранить все данные пользователя в каждой строке заказа — дубли и рассинхрон.',
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
                explanation:
                  'Классическая схема e-commerce. users → orders (один ко многим), orders → order_items (один ко многим), order_items → products (многие к одному). Понимание связей — половина навыка SQL.',
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
                    ['IN (...) / NOT IN (...)','Попадание в список', "status IN ('paid', 'shipped')"],
                    ['BETWEEN a AND b', 'Диапазон (включительно)', 'total BETWEEN 500 AND 1000'],
                    ['LIKE', 'Поиск по шаблону', "email LIKE '%@gmail.com'"],
                    ['IS NULL / IS NOT NULL', 'Проверка NULL', 'user_id IS NULL'],
                  ],
                },
                {
                  type: 'note',
                  text: `LIKE: % — любая последовательность символов, _ — один символ. 'Ан%' — начинается на «Ан», '%ов' — заканчивается на «ов», '%кот%' — содержит «кот». Регистр в PostgreSQL чувствителен, в MySQL — зависит от коллации.`,
                },
              ],
            },
            {
              id: 'sql-l2-s2',
              title: 'Проверь себя: SELECT',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос, который вернёт email всех пользователей (только email, без других колонок).',
                accepted: [
                  'SELECT email FROM users',
                  'SELECT email FROM users;',
                  'select email from users',
                  'select email from users;',
                ],
                placeholder: 'SELECT ...',
                hint: 'Одна колонка, одна таблица',
                explanation:
                  'SELECT email FROM users — «взять колонку email из таблицы users». Регистр не критичен в большинстве СУБД, но принято писать ключевые слова заглавными. `SELECT *` вернул бы все колонки — избыточно, если нужен только email.',
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
                                explanation:
                  'LIKE с шаблоном: % — «любые символы до», @gmail.com — точное окончание. = "gmail.com" искал бы email, равный строке «gmail.com» (а такого нет). IN — для списка значений, не для подстрок. CONTAINS — не стандартный SQL (есть в некоторых СУБД).',
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
                explanation:
                  'IN — список, BETWEEN — диапазон, LIKE — шаблон, IS NULL — проверка на NULL. Именно IS NULL, не = NULL: = NULL в SQL всегда даёт NULL (не true/false), поэтому не работает.',
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
                  code: `-- По возрастанию\nSELECT * FROM orders ORDER BY created_at;\n\n-- По убыванию\nSELECT * FROM orders ORDER BY created_at DESC;\n\n-- По нескольким полям\nSELECT * FROM orders ORDER BY status, created_at DESC;\n\n-- Топ-10 последних заказов\nSELECT * FROM orders ORDER BY created_at DESC LIMIT 10;\n\n-- Пагинация: пропустить 20, взять 10\nSELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;\n\n-- Уникальные статусы (какие вообще бывают)\nSELECT DISTINCT status FROM orders;\n\n-- Уникальные пары (user_id, status)\nSELECT DISTINCT user_id, status FROM orders;`,
                },
                {
                  type: 'note',
                  text: `ORDER BY + LIMIT — всегда вместе. Без ORDER BY СУБД может вернуть «любые 10 строк», и результат будет плавать между запусками. Если ограничиваете — сортируйте.`,
                },
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
                  'SELECT id, total FROM orders ORDER BY total DESC LIMIT 5;',
                ],
                placeholder: 'SELECT ...',
                hint: 'ORDER BY total DESC, потом LIMIT',
                explanation:
                  'SELECT id, total FROM orders ORDER BY total DESC LIMIT 5. DESC — «по убыванию» (самые дорогие сверху). LIMIT 5 — первые 5. Без DESC получили бы 5 самых дешёвых.',
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
                explanation:
                  'DISTINCT убирает дубли. Если в orders 1000 заказов и у них 4 разных статуса (new, paid, shipped, cancelled) — вернётся 4 строки. Для подсчёта по статусам нужен GROUP BY + COUNT (будет в модуле 2).',
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
                {
                  type: 'p',
                  text: `NULL — «значение неизвестно». Не ноль, не пустая строка. Любая операция с NULL даёт NULL: NULL + 5 = NULL, NULL = NULL → NULL. Это ловит на реальных багах: сумма заказа «исчезает», если у товара не указана скидка.`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'NULL в сравнениях и арифметике',
                  code: `SELECT 100 + NULL;         -- NULL, а не 100\nSELECT NULL = NULL;        -- NULL (не true!)\nSELECT NULL != NULL;       -- NULL\n\n-- Правильно: IS NULL / IS NOT NULL\nSELECT * FROM orders WHERE user_id IS NULL;\nSELECT * FROM orders WHERE user_id IS NOT NULL;\n\n-- COALESCE: первое не-NULL значение\nSELECT id, COALESCE(total, 0) AS total FROM orders;\nSELECT COALESCE(phone, email, 'нет контакта') AS contact FROM users;`,
                },
                {
                  type: 'note',
                  text: `Агрегаты (SUM, AVG, MIN, MAX) игнорируют NULL-строки. COUNT(*) считает все строки, COUNT(column) — только не-NULL. Это влияет на отчёты: AVG(total) при 100 строках с 20 NULL = сумма / 80, а не / 100.`,
                },
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
                  { id: 'a', text: 'Потому что нужно писать `WHERE user_id == NULL`' },
                  { id: 'b', text: 'Любое сравнение с NULL даёт NULL (не true/false), поэтому запрос вернёт 0 строк' },
                  { id: 'c', text: 'Потому что user_id — не число' },
                  { id: 'd', text: 'Это работает, ошибки нет' },
                ],
                correct: ['b'],
                explanation:
                  'NULL — «неизвестно». NULL = NULL → NULL (не true!). WHERE оставляет только строки, где условие = true. NULL ≠ true → 0 строк. Правильно: WHERE user_id IS NULL. Это классическая ловушка SQL.',
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
                hint: 'Стандарт SQL, работает во всех СУБД',
                explanation:
                  'COALESCE(a, b, c, ...) — первое не-NULL. COALESCE(total, 0) вернёт 0, если total IS NULL. В отличие от IFNULL (MySQL) и NVL (Oracle), принимает любое число аргументов.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sql-m2',
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
                  code: `-- Сколько всего пользователей\nSELECT COUNT(*) FROM users;\n\n-- Сколько оплаченных заказов\nSELECT COUNT(*) FROM orders WHERE status = 'paid';\n\n-- Сумма всех оплаченных заказов\nSELECT SUM(total) FROM orders WHERE status = 'paid';\n\n-- Средний чек\nSELECT AVG(total) FROM orders WHERE status = 'paid';\n\n-- Всё вместе в одном запросе\nSELECT\n    COUNT(*)        AS orders_count,\n    SUM(total)      AS revenue,\n    AVG(total)      AS avg_check,\n    MIN(total)      AS min_order,\n    MAX(total)      AS max_order\nFROM orders\nWHERE status = 'paid';`,
                },
                {
                  type: 'note',
                  text: `COUNT(*) считает все строки. COUNT(column) — только не-NULL. COUNT(DISTINCT column) — уникальные. Разница критична: COUNT(email) не посчитает пользователей без email. COUNT(*) — надёжнее, когда нужен «сколько всего».`,
                },
              ],
            },
            {
              id: 'sql-l5-s2',
              title: 'Проверь себя: агрегаты',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: сумма (SUM) всех оплаченных заказов из таблицы orders.',
                accepted: [
                  "SELECT SUM(total) FROM orders WHERE status = 'paid'",
                  "SELECT SUM(total) FROM orders WHERE status = 'paid';",
                  "select sum(total) from orders where status = 'paid'",
                  "SELECT SUM(total) FROM orders WHERE status = 'paid';",
                ],
                placeholder: 'SELECT ...',
                hint: 'SUM, FROM, WHERE',
                explanation:
                  "SELECT SUM(total) FROM orders WHERE status = 'paid'. SUM складывает total у всех подходящих строк. Без WHERE — сумма всех заказов, включая отменённые.",
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
                  { id: 'b', text: 'COUNT(*) считает все строки, COUNT(email) — только строки, где email IS NOT NULL' },
                  { id: 'c', text: 'COUNT(*) быстрее' },
                  { id: 'd', text: 'COUNT(email) работает только в PostgreSQL' },
                ],
                correct: ['b'],
                explanation:
                  'COUNT(*) — все строки. COUNT(email) — только не-NULL. Если 100 пользователей, у 10 нет email — COUNT(*) = 100, COUNT(email) = 90. COUNT(DISTINCT email) — уникальные email (ещё меньше, если есть дубли).',
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
                {
                  type: 'p',
                  text: `Правило: WHERE фильтрует строки ДО группировки, HAVING — ПОСЛЕ. Если в условии агрегат (COUNT, SUM, AVG) — место в HAVING. Если обычное условие (status = 'paid') — в WHERE.`,
                },
                {
                  type: 'note',
                  text: `В SELECT при GROUP BY можно использовать только колонки из GROUP BY и агрегаты. "SELECT user_id, email, COUNT(*) ... GROUP BY user_id" — ошибка: email не в GROUP BY и не в агрегате. СУБД не знает, какой email показать, если у пользователя их несколько.`,
                },
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
                  'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;',
                ],
                placeholder: 'SELECT ...',
                hint: 'status + COUNT(*) + GROUP BY status',
                explanation:
                  'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status. Каждая группа = уникальный status. COUNT(*) — сколько строк в группе. AS order_count — псевдоним колонки.',
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
                  { id: 'd', text: 'В любом месте — результат одинаков' },
                ],
                correct: ['b'],
                explanation:
                  'COUNT(*) — агрегат. Агрегаты нельзя в WHERE (WHERE работает до группировки, агрегатов ещё нет). Условие на агрегат — всегда в HAVING. WHERE — для обычных условий (status, даты, диапазоны).',
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
                explanation:
                  'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Именно поэтому HAVING может содержать агрегаты (они уже вычислены), а WHERE — нет (агрегатов ещё нет). Знание порядка — половина понимания SQL.',
              },
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
                {
                  type: 'p',
                  text: `JOIN соединяет строки двух таблиц по условию. INNER JOIN (он же просто JOIN) оставляет только те строки, где есть совпадение с обеих сторон. Пользователь без заказов не попадёт в результат; заказ без пользователя — тоже.`,
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
                    'AS o / AS u — псевдонимы таблиц. Без них придётся писать orders.id, users.email',
                    'ON u.id = o.user_id — условие соединения',
                    'Условие соединения — это НЕ то же самое, что WHERE. Путаница — частая ошибка',
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Три таблицы в одном запросе',
                  code: `SELECT\n    o.id            AS order_id,\n    u.email,\n    p.name          AS product,\n    oi.quantity,\n    oi.price\nFROM orders o\nJOIN users u        ON u.id  = o.user_id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p     ON p.id  = oi.product_id\nWHERE o.status = 'paid'\nORDER BY o.id;`,
                },
                {
                  type: 'note',
                  text: `Чем больше JOIN-ов, тем важнее индексы на полях связи (user_id, order_id, product_id). Для тестировщика это не критично — запросы на маленьких выборках. Но если запрос «висит» — это первое, что проверяют через EXPLAIN.`,
                },
              ],
            },
            {
              id: 'sql-l7-s2',
              title: 'Проверь себя: JOIN',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: id заказа (order_id) и email пользователя из orders и users. Соединение по user_id.',
                accepted: [
                  'SELECT o.id AS order_id, u.email FROM orders o JOIN users u ON u.id = o.user_id',
                  'SELECT o.id AS order_id, u.email FROM orders o JOIN users u ON u.id = o.user_id;',
                  'SELECT o.id, u.email FROM orders o JOIN users u ON u.id = o.user_id',
                  'SELECT o.id, u.email FROM orders o JOIN users u ON u.id = o.user_id;',
                  'select o.id as order_id, u.email from orders o join users u on u.id = o.user_id',
                ],
                placeholder: 'SELECT ...',
                hint: 'FROM orders o JOIN users u ON ...',
                explanation:
                  'SELECT o.id, u.email FROM orders o JOIN users u ON u.id = o.user_id. o и u — псевдонимы, ON — условие связи. Без JOIN (просто FROM orders, users) получили бы декартово произведение — все комбинации строк.',
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
                  { id: 'b', text: 'Чтобы не писать полные имена таблиц (orders.id, users.email), и различать одноимённые колонки' },
                  { id: 'c', text: 'Для ускорения запроса' },
                  { id: 'd', text: 'Для безопасности' },
                ],
                correct: ['b'],
                explanation:
                  'Псевдонимы — это краткость и однозначность. Без них: orders.id, users.id — а если обе таблицы имеют id, придётся писать полные имена везде. С псевдонимами: o.id, u.id. Ускорить запрос псевдонимы не могут — это только синтаксический сахар.',
              },
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
                    ['FULL OUTER JOIN', 'Всё из обеих таблиц, где нет совпадений — NULL с одной стороны'],
                    ['CROSS JOIN', 'Декартово произведение: каждая строка с каждой'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'LEFT JOIN: пользователи без заказов',
                  code: `SELECT u.id, u.email\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;`,
                },
                {
                  type: 'p',
                  text: `Логика: LEFT JOIN даёт всем пользователям хотя бы одну строку (даже без заказов). Если заказа нет, o.id = NULL. WHERE o.id IS NULL оставляет только таких. Это классический «anti-join» — «кого нет».`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы с количеством позиций (включая пустые)',
                  code: `SELECT\n    o.id,\n    o.total,\n    COUNT(oi.id) AS items_count\nFROM orders o\nLEFT JOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.total\nORDER BY items_count ASC;`,
                },
                {
                  type: 'note',
                  text: `COUNT(oi.id), а не COUNT(*). COUNT(*) посчитает и заказы без позиций как «1» (строка же есть). COUNT(oi.id) считает только не-NULL — то есть реальные позиции. Для «сколько у заказа позиций» — всегда COUNT(oi.id).`,
                },
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
                explanation:
                  'LEFT JOIN + WHERE orders.id IS NULL — классический anti-join. LEFT JOIN сохраняет всех пользователей; у кого нет заказов — orders.id = NULL. WHERE оставляет только их. JOIN (INNER) вернул бы только пользователей С заказами.',
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
                  { left: 'INNER JOIN', right: 'Только совпадения с обеих сторон' },
                  { left: 'LEFT JOIN', right: 'Все из левой + совпадения из правой' },
                  { left: 'RIGHT JOIN', right: 'Все из правой + совпадения из левой' },
                  { left: 'FULL OUTER JOIN', right: 'Всё из обеих таблиц' },
                ],
                explanation:
                  'INNER — только совпадения. LEFT — всё из левой. RIGHT — всё из правой. FULL — всё из обеих. На собеседовании «LEFT vs INNER» — стандартный вопрос. RIGHT используется редко: эквивалентен LEFT с переставленными таблицами.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sql-m3',
      title: 'Подзапросы и практика',
      lessons: [
        {
          id: 'sql-l9',
          title: 'Подзапросы: IN, EXISTS, скалярные',
          minutes: 30,
          steps: [
            {
              id: 'sql-l9-s1',
              title: 'Три вида подзапросов',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Скалярный подзапрос (одно значение)',
                  code: `-- Заказы выше среднего чека\nSELECT id, total\nFROM orders\nWHERE total > (SELECT AVG(total) FROM orders)\nORDER BY total DESC;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'IN: значение в множестве',
                  code: `-- Пользователи с хотя бы одним оплаченным заказом\nSELECT id, email\nFROM users\nWHERE id IN (\n    SELECT user_id FROM orders WHERE status = 'paid'\n);`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'EXISTS: проверка существования',
                  code: `-- Пользователи без заказов (безопаснее NOT IN)\nSELECT u.id, u.email\nFROM users u\nWHERE NOT EXISTS (\n    SELECT 1 FROM orders o WHERE o.user_id = u.id\n);`,
                },
                {
                  type: 'note',
                  text: `NOT IN с NULL — ловушка. Если в подзапросе есть хотя бы один NULL, NOT IN вернёт пустой результат (NULL ≠ NULL → NULL, весь AND → false). NOT EXISTS надёжнее. Или WHERE user_id IS NOT NULL в подзапросе.`,
                },
              ],
            },
            {
              id: 'sql-l9-s2',
              title: 'Проверь себя: подзапрос',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что вернёт `SELECT id FROM orders WHERE total > (SELECT AVG(total) FROM orders)`?',
                options: [
                  { id: 'a', text: 'Все заказы' },
                  { id: 'b', text: 'Заказы, у которых total больше среднего по всем заказам' },
                  { id: 'c', text: 'Средний чек' },
                  { id: 'd', text: 'Ошибку' },
                ],
                correct: ['b'],
                explanation:
                  'Скалярный подзапрос `(SELECT AVG(total) FROM orders)` возвращает одно число — средний чек. WHERE total > среднее — оставляет заказы выше среднего. Скалярный = одно значение, одна строка, одна колонка.',
              },
            },
            {
              id: 'sql-l9-s3',
              title: 'Проверь себя: EXISTS vs IN',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему NOT EXISTS предпочтительнее NOT IN?',
                options: [
                  { id: 'a', text: 'NOT EXISTS быстрее' },
                  { id: 'b', text: 'NOT IN с NULL в подзапросе вернёт пустой результат — NOT EXISTS работает корректно' },
                  { id: 'c', text: 'NOT IN не поддерживается в PostgreSQL' },
                  { id: 'd', text: 'Это одно и то же' },
                ],
                correct: ['b'],
                explanation:
                  'NOT IN (1, 2, NULL) = «x ≠ 1 AND x ≠ 2 AND x ≠ NULL». Последнее всегда NULL (не true), значит всё условие false → 0 строк. NOT EXISTS такой проблемы не имеет: он проверяет «есть ли хоть одна строка», а не сравнивает значения.',
              },
            },
          ],
        },
        {
          id: 'sql-l10',
          title: 'CTE: WITH для читаемости',
          minutes: 25,
          steps: [
            {
              id: 'sql-l10-s1',
              title: 'Именованные подзапросы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Когда подзапросов 2–3, запрос превращается в матрёшку. CTE (Common Table Expression) выносит каждый подзапрос в именованный блок WITH — читается сверху вниз, как обычный код.`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Топ-3 клиента по выручке',
                  code: `WITH paid_totals AS (\n    SELECT user_id, SUM(total) AS revenue\n    FROM orders\n    WHERE status = 'paid'\n    GROUP BY user_id\n),\ntop_users AS (\n    SELECT user_id, revenue\n    FROM paid_totals\n    ORDER BY revenue DESC\n    LIMIT 3\n)\nSELECT\n    u.email,\n    tu.revenue\nFROM top_users tu\nJOIN users u ON u.id = tu.user_id\nORDER BY tu.revenue DESC;`,
                },
                {
                  type: 'list',
                  items: [
                    'WITH name AS (...) — именованный подзапрос',
                    'Несколько CTE разделяются запятыми',
                    'CTE видит предыдущие CTE: top_users использует paid_totals',
                    'CTE можно использовать в JOIN, в подзапросах, в других CTE',
                    'Рекурсивные CTE (WITH RECURSIVE) — для иерархий (дерево категорий)',
                  ],
                },
                {
                  type: 'note',
                  text: `Читается как рецепт: «сначала посчитали выручку по клиентам (paid_totals), потом взяли топ-3 (top_users), потом соединили с users». Такой запрос проще отлаживать: каждый CTE можно запустить отдельно.`,
                },
              ],
            },
            {
              id: 'sql-l10-s2',
              title: 'Проверь себя: CTE',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что даёт CTE (WITH) по сравнению с обычными подзапросами?',
                options: [
                  { id: 'a', text: 'Ускоряет запрос' },
                  { id: 'b', text: 'Делает запрос читаемее: каждый шаг — именованный блок, можно отладить отдельно' },
                  { id: 'c', text: 'Позволяет использовать JOIN без ON' },
                  { id: 'd', text: 'Это единственный способ сделать подзапрос' },
                ],
                correct: ['b'],
                explanation:
                  'CTE — про читаемость и отладку, не про скорость. Каждый блок можно запустить отдельно и проверить результат. Вложенные подзапросы читаются «изнутри наружу», CTE — сверху вниз. В некоторых СУБД CTE может быть быстрее (материализация), но это не главная цель.',
              },
            },
            {
              id: 'sql-l10-s3',
              title: 'Проверь себя: синтаксис',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какое ключевое слово начинает CTE (Common Table Expression)?',
                accepted: ['with', 'WITH', 'With'],
                placeholder: 'одно слово',
                hint: 'Английское «с»',
                explanation:
                  'WITH name AS (SELECT ...) SELECT ... FROM name. WITH — «с этим подзапросом, сделай основной». Несколько CTE — через запятую: WITH a AS (...), b AS (...) SELECT ...',
              },
            },
          ],
        },
        {
          id: 'sql-l11',
          title: 'INSERT, UPDATE, DELETE',
          minutes: 25,
          steps: [
            {
              id: 'sql-l11-s1',
              title: 'Изменение данных',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'DML: три команды',
                  code: `-- INSERT: добавить строку\nINSERT INTO users (email, name)\nVALUES ('anna@example.com', 'Анна');\n\n-- Несколько строк одной командой\nINSERT INTO users (email, name) VALUES\n    ('a@example.com', 'Алиса'),\n    ('b@example.com', 'Боб'),\n    ('c@example.com', 'Вера');\n\n-- UPDATE: изменить\nUPDATE orders\nSET status = 'shipped'\nWHERE id = 42;\n\n-- ОПАСНО: UPDATE без WHERE обновит ВСЕ строки!\nUPDATE orders SET status = 'cancelled';  -- отменит все заказы\n\n-- DELETE: удалить\nDELETE FROM orders WHERE id = 42 AND status = 'new';\n\n-- ОПАСНО: DELETE без WHERE удалит ВСЁ\nDELETE FROM orders;  -- очистит таблицу`,
                },
                {
                  type: 'note',
                  text: `Правило: перед UPDATE/DELETE всегда сначала SELECT с тем же WHERE. «SELECT * FROM orders WHERE status = 'new'» — проверьте, что это те строки, которые надо изменить. Только потом меняйте WHERE в UPDATE. Это спасает от «обновил всю таблицу».`,
                },
              ],
            },
            {
              id: 'sql-l11-s2',
              title: 'Проверь себя: безопасность',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если выполнить `UPDATE orders SET status = \'cancelled\'` без WHERE?',
                options: [
                  { id: 'a', text: 'Ошибка — UPDATE требует WHERE' },
                  { id: 'b', text: 'Все заказы в таблице получат статус cancelled' },
                  { id: 'c', text: 'Изменится только первый заказ' },
                  { id: 'd', text: 'Ничего не произойдёт' },
                ],
                correct: ['b'],
                explanation:
                  'UPDATE без WHERE — «применить ко всем строкам». Все заказы станут cancelled. Это классический инцидент: «хотели отменить один, отменили все». Всегда SELECT с WHERE перед UPDATE/DELETE.',
              },
            },
            {
              id: 'sql-l11-s3',
              title: 'Проверь себя: DML',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и что она делает',
                pairs: [
                  { left: 'INSERT INTO', right: 'Добавить новую строку' },
                  { left: 'UPDATE ... SET', right: 'Изменить существующие строки' },
                  { left: 'DELETE FROM', right: 'Удалить строки' },
                  { left: 'SELECT', right: 'Прочитать данные' },
                ],
                explanation:
                  'INSERT — создать, UPDATE — изменить, DELETE — удалить, SELECT — прочитать. Первые три — DML (Data Manipulation Language), меняют данные. SELECT — DQL (Data Query Language), только читает.',
              },
            },
          ],
        },
        {
          id: 'sql-l12',
          title: 'Практика: реальные задачи',
          minutes: 35,
          steps: [
            {
              id: 'sql-l12-s1',
              title: 'Поиск аномалий в данных',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Самая частая практическая задача тестировщика и аналитика — найти данные, которые «не должны существовать». Вот готовые шаблоны.`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Три запроса, которые нужны всегда',
                  code: `-- Дубли по email\nSELECT email, COUNT(*) AS cnt\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;\n\n-- Заказы с отрицательной суммой или NULL в обязательном поле\nSELECT id, total, status\nFROM orders\nWHERE total < 0 OR total IS NULL OR status IS NULL;\n\n-- Заказы без позиций\nSELECT o.id, o.status, o.total\nFROM orders o\nLEFT JOIN order_items oi ON oi.order_id = o.id\nWHERE oi.id IS NULL;\n\n-- Заказы, привязанные к несуществующему пользователю (должно быть 0)\nSELECT o.id, o.user_id\nFROM orders o\nLEFT JOIN users u ON u.id = o.user_id\nWHERE u.id IS NULL;`,
                },
                {
                  type: 'note',
                  text: `Первые три запроса стоит держать в чек-листе «проверка данных после миграции». Если после миграции они возвращают строки — что-то сломалось. Мини-набор data-integrity проверок.`,
                },
              ],
            },
            {
              id: 'sql-l12-s2',
              title: 'Сверка: UI vs БД',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Сумма заказа vs сумма позиций',
                  code: `SELECT\n    o.id,\n    o.total                     AS stored_total,\n    SUM(oi.quantity * oi.price) AS computed_total,\n    o.total - SUM(oi.quantity * oi.price) AS diff\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.total\nHAVING o.total != SUM(oi.quantity * oi.price);\n-- Если есть строки — сумма в заказе не совпадает с суммой позиций. Это баг.`,
                },
                {
                  type: 'p',
                  text: `Классическая проверка: сумма из UI = сумма из API = сумма из БД. SQL-запрос должен восстановить то, что видит пользователь. Если расходятся — баг в коде, который пишет в БД, или в коде, который читает.`,
                },
              ],
            },
            {
              id: 'sql-l12-s3',
              title: 'Проверь себя: дубли',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос: найти email, которые встречаются в users больше одного раза.',
                accepted: [
                  'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1',
                  'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;',
                  'SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1',
                  'SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;',
                  'select email, count(*) from users group by email having count(*) > 1',
                ],
                placeholder: 'SELECT ...',
                hint: 'GROUP BY email + HAVING COUNT(*) > 1',
                explanation:
                  'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1. GROUP BY email — группируем по email, COUNT(*) — сколько в каждой группе, HAVING > 1 — оставляем только дубли. Это шаблон для любой проверки «на уникальность».',
              },
            },
            {
              id: 'sql-l12-s4',
              title: 'Проверь себя: итог',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой запрос найдёт заказы, у которых total не совпадает с суммой позиций?',
                options: [
                  { id: 'a', text: 'SELECT * FROM orders WHERE total != order_items.price' },
                  { id: 'b', text: 'SELECT o.id FROM orders o JOIN order_items oi ON oi.order_id = o.id GROUP BY o.id, o.total HAVING o.total != SUM(oi.quantity * oi.price)' },
                  { id: 'c', text: 'SELECT * FROM orders WHERE total IS NULL' },
                  { id: 'd', text: 'SELECT COUNT(*) FROM orders' },
                ],
                correct: ['b'],
                explanation:
                  'Нужно соединить orders и order_items, сгруппировать по заказу, посчитать SUM(quantity * price) и сравнить с сохранённым total через HAVING. Это классическая проверка data integrity: «сохранённая сумма = вычисленная из позиций».',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'sql-m4',
      title: 'Практикум',
      lessons: [
        {
          id: 'sql-l13',
          title: 'Практика: от простого к сложному',
          minutes: 35,
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
                  'select email from users;',
                ],
                placeholder: 'SELECT ...',
                hint: 'Нужна одна колонка из одной таблицы',
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
                explanation: 'Сначала берём таблицу (FROM), фильтруем строки (WHERE), группируем (GROUP BY), фильтруем группы (HAVING), выбираем колонки (SELECT) и сортируем (ORDER BY).',
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
                question: 'В таблице users 10 строк, в orders 20 строк. Сколько строк вернёт запрос `SELECT * FROM users CROSS JOIN orders`?',
                correct: 200,
                explanation: 'CROSS JOIN создаёт декартово произведение: каждая строка одной таблицы соединяется с каждой строкой другой. 10 * 20 = 200.',
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
                  { id: 'b', text: 'COUNT(column) игнорирует NULL значения' },
                  { id: 'c', text: 'NOT IN с подзапросом, содержащим NULL, вернёт пустой результат' },
                  { id: 'd', text: 'NULL равен пустой строке' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'NULL — это «неизвестно». Сравнение с NULL даёт NULL (a). Агрегаты игнорируют NULL (b). Если в подзапросе NOT IN есть NULL, результат всегда пустой (c). NULL не равен пустой строке (d).',
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
                explanation: 'INNER — только совпадения. LEFT — все из левой + совпадения из правой. FULL — всё из обеих.',
              },
            },
            {
              id: 'sql-l13-s9',
              title: 'Пользователи без заказов',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Напишите запрос, который найдёт email пользователей, у которых нет ни одного заказа.',
                accepted: [
                  'SELECT email FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.id IS NULL',
                  'SELECT email FROM users WHERE id NOT IN (SELECT user_id FROM orders WHERE user_id IS NOT NULL)',
                  'SELECT email FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)',
                ],
                placeholder: 'SELECT ...',
                hint: 'Используйте LEFT JOIN + IS NULL или NOT EXISTS',
                explanation: 'Классический anti-join. LEFT JOIN сохраняет всех пользователей, а WHERE orders.id IS NULL оставляет только тех, у кого нет заказов.',
              },
            },
            {
              id: 'sql-l13-s10',
              title: 'WHERE vs HAVING',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где нужно фильтровать данные по результату агрегатной функции (например, COUNT(*) > 5)?',
                options: [
                  { id: 'a', text: 'В WHERE' },
                  { id: 'b', text: 'В HAVING' },
                  { id: 'c', text: 'В ORDER BY' },
                  { id: 'd', text: 'В SELECT' },
                ],
                correct: ['b'],
                explanation: 'WHERE выполняется до группировки, когда агрегатов ещё нет. Условия на результат агрегатов всегда пишутся в HAVING.',
              },
            },
          ],
        },
      ],
    },
  ],
};