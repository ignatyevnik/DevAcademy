import type { Course } from './types';

export const sqlAdvancedCourse: Course = {
  slug: 'sql-advanced',
  title: 'SQL: продвинуто',
  subtitle: 'Подзапросы, индексы, транзакции, EXPLAIN, оконные функции, JSONB и миграции',
  description:
    'Продвинутый курс по SQL для тех, кто уже уверенно пишет SELECT и JOIN. Разберём подзапросы и CTE, индексы (B-tree, GIN, составные), транзакции и уровни изоляции, EXPLAIN и оптимизацию, оконные функции, рекурсивные CTE, JSONB, представления и миграции схемы. Практикум — комплексный экзамен.',
  level: 'Средний',
  tags: ['SQL', 'PostgreSQL', 'Оптимизация', 'Backend'],
  accent: '#e38c00',
  icon: 'sql-advanced',
  outcomes: [
    'Писать подзапросы: скалярные, IN, EXISTS, коррелированные',
    'Использовать CTE и рекурсивные CTE для иерархий',
    'Проектировать индексы: B-tree, GIN, составные, покрывающие',
    'Понимать транзакции, уровни изоляции и аномалии',
    'Читать EXPLAIN и находить медленные места',
    'Применять оконные функции для аналитики',
    'Хранить и запрашивать JSONB с GIN-индексом',
    'Безопасно проводить миграции схемы (expand-contract)',
  ],
  requirements: [
    'Пройден курс «SQL: основы»',
    'Опыт написания SELECT и JOIN',
    'Любая СУБД (примеры — PostgreSQL)',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Подзапросы и DML (было sql-m3)
    // ─────────────────────────────────────────────
    {
      id: 'sql-a-m1',
      title: 'Подзапросы и DML',
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
                { type: 'p', text: 'Подзапрос — это SELECT внутри другого запроса. Три вида: скалярный (возвращает одно значение), IN (проверка «есть ли во множестве»), EXISTS (проверка «есть ли хоть одна строка»).' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Скалярный подзапрос (одно значение)',
                  code: `-- Заказы выше среднего чека
SELECT id, total
FROM orders
WHERE total > (SELECT AVG(total) FROM orders)
ORDER BY total DESC;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'IN: значение в множестве',
                  code: `-- Пользователи с хотя бы одним оплаченным заказом
SELECT id, email
FROM users
WHERE id IN (
    SELECT user_id FROM orders WHERE status = 'paid'
);`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'EXISTS: проверка существования',
                  code: `-- Пользователи без заказов (безопаснее NOT IN)
SELECT u.id, u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);`,
                },
                { type: 'note', text: 'NOT IN с NULL — ловушка. Если в подзапросе есть хотя бы один NULL, NOT IN вернёт пустой результат (NULL ≠ NULL → NULL, весь AND → false). NOT EXISTS надёжнее. Или WHERE user_id IS NOT NULL в подзапросе.' },
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
                explanation: 'Скалярный подзапрос `(SELECT AVG(total) FROM orders)` возвращает одно число — средний чек. WHERE total > среднее — оставляет заказы выше среднего.',
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
                explanation: 'NOT IN (1, 2, NULL) = «x ≠ 1 AND x ≠ 2 AND x ≠ NULL». Последнее всегда NULL (не true), значит всё условие false → 0 строк. NOT EXISTS такой проблемы не имеет.',
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
                { type: 'p', text: 'Когда подзапросов 2–3, запрос превращается в матрёшку. CTE (Common Table Expression) выносит каждый подзапрос в именованный блок WITH — читается сверху вниз, как обычный код.' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Топ-3 клиента по выручке',
                  code: `WITH paid_totals AS (
    SELECT user_id, SUM(total) AS revenue
    FROM orders
    WHERE status = 'paid'
    GROUP BY user_id
),
top_users AS (
    SELECT user_id, revenue
    FROM paid_totals
    ORDER BY revenue DESC
    LIMIT 3
)
SELECT
    u.email,
    tu.revenue
FROM top_users tu
JOIN users u ON u.id = tu.user_id
ORDER BY tu.revenue DESC;`,
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
                { type: 'note', text: 'Читается как рецепт: «сначала посчитали выручку по клиентам (paid_totals), потом взяли топ-3 (top_users), потом соединили с users». Такой запрос проще отлаживать: каждый CTE можно запустить отдельно.' },
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
                explanation: 'CTE — про читаемость и отладку, не про скорость. Каждый блок можно запустить отдельно и проверить результат.',
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
                explanation: 'WITH name AS (SELECT ...) SELECT ... FROM name. WITH — «с этим подзапросом, сделай основной».',
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
                  code: `-- INSERT: добавить строку
INSERT INTO users (email, name)
VALUES ('anna@example.com', 'Анна');

-- Несколько строк одной командой
INSERT INTO users (email, name) VALUES
    ('a@example.com', 'Алиса'),
    ('b@example.com', 'Боб');

-- UPDATE: изменить
UPDATE orders
SET status = 'shipped'
WHERE id = 42;

-- ОПАСНО: UPDATE без WHERE обновит ВСЕ строки!
UPDATE orders SET status = 'cancelled';

-- DELETE: удалить
DELETE FROM orders WHERE id = 42 AND status = 'new';

-- ОПАСНО: DELETE без WHERE удалит ВСЁ
DELETE FROM orders;`,
                },
                { type: 'note', text: 'Правило: перед UPDATE/DELETE всегда сначала SELECT с тем же WHERE. Проверьте, что это те строки. Это спасает от «обновил всю таблицу».' },
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
                explanation: 'UPDATE без WHERE — «применить ко всем строкам». Все заказы станут cancelled. Всегда SELECT с WHERE перед UPDATE.',
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
                explanation: 'INSERT — создать, UPDATE — изменить, DELETE — удалить, SELECT — прочитать.',
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
                { type: 'p', text: 'Самая частая практическая задача — найти данные, которые не должны существовать. Дубли, отрицательные суммы, «висячие» связи.' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Четыре шаблона',
                  code: `-- Дубли по email
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Заказы с отрицательной суммой или NULL
SELECT id, total, status FROM orders
WHERE total < 0 OR total IS NULL OR status IS NULL;

-- Заказы без позиций
SELECT o.id, o.status, o.total
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE oi.id IS NULL;

-- Заказы с несуществующим пользователем
SELECT o.id, o.user_id
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
WHERE u.id IS NULL;`,
                },
                { type: 'note', text: 'Первый и четвёртый запросы стоит держать в чек-листе «проверка данных после миграции». Если после миграции они возвращают строки — что-то сломалось.' },
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
                  code: `SELECT
    o.id,
    o.total                     AS stored_total,
    SUM(oi.quantity * oi.price) AS computed_total,
    o.total - SUM(oi.quantity * oi.price) AS diff
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.total
HAVING o.total != SUM(oi.quantity * oi.price);
-- Если есть строки — сумма в заказе не совпадает с суммой позиций. Это баг.`,
                },
                { type: 'p', text: 'Классическая проверка: сумма из UI = сумма из API = сумма из БД. SQL-запрос должен восстановить то, что видит пользователь.' },
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
                ],
                placeholder: 'SELECT ...',
                hint: 'GROUP BY email + HAVING COUNT(*) > 1',
                explanation: 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;',
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
                explanation: 'Нужно соединить orders и order_items, сгруппировать по заказу, посчитать SUM(quantity * price) и сравнить с сохранённым total через HAVING.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Индексы, транзакции, оптимизация (новый)
    // ─────────────────────────────────────────────
    {
      id: 'sql-a-m2',
      title: 'Индексы, транзакции, оптимизация',
      lessons: [
        {
          id: 'sql-l13',
          title: 'Индексы: B-tree, GIN, составные',
          minutes: 30,
          steps: [
            {
              id: 'sql-l13-s1',
              title: 'Зачем индексы и как устроен B-tree',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Индекс — структура данных, которая ускоряет поиск. Без индекса СУБД делает Seq Scan (полный перебор). С индексом — Index Scan (логарифмический поиск).' },
                {
                  type: 'mermaid',
                  caption: 'B-tree: корень → ветви → листья',
                  code: `graph TD
                    Root["Root<br/>(50, 100)"]
                    Root --> N1["Ветвь<br/>(10, 30)"]
                    Root --> N2["Ветвь<br/>(70, 90)"]
                    Root --> N3["Ветвь<br/>(110, 130)"]
                    N1 --> L1["Лист: 5, 10"]
                    N1 --> L2["Лист: 30, 45"]
                    N2 --> L3["Лист: 70, 90"]
                    N3 --> L4["Лист: 110, 130"]`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Создание индексов',
                  code: `-- Обычный B-tree: для =, <, >, ORDER BY, BETWEEN
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Составной: для WHERE user_id = X AND status = Y
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Работает: (user_id), (user_id, status)
-- НЕ работает: (status) — только второй столбец

-- Уникальный: гарантирует уникальность + ускоряет поиск
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Частичный: только для подмножества (активные заказы)
CREATE INDEX idx_orders_active ON orders(created_at)
WHERE status = 'paid';`,
                },
                {
                  type: 'list',
                  items: [
                    'B-tree (по умолчанию) — для сравнений и сортировки: =, <, >, BETWEEN, IN, LIKE с префиксом',
                    'Составной — порядок столбцов важен: (a, b) работает для a и (a, b), но не для b',
                    'Уникальный — гарантирует уникальность значений + ускоряет поиск',
                    'Частичный — индекс только для подмножества строк (WHERE status = paid) — меньше и быстрее',
                    'Индекс пишется медленнее: каждый INSERT/UPDATE обновляет индексы',
                  ],
                },
              ],
            },
            {
              id: 'sql-l13-s2',
              title: 'GIN, BRIN и когда НЕ нужен индекс',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Другие типы индексов',
                  code: `-- GIN: для jsonb, массивов, полнотекстового поиска
CREATE INDEX idx_docs_tags ON documents USING GIN(tags);
CREATE INDEX idx_events_data ON events USING GIN(data);   -- jsonb

-- BRIN: для очень больших таблиц с сортированными данными (логи, метрики)
CREATE INDEX idx_logs_time ON logs USING BRIN(created_at);
-- Занимает мегабайты вместо гигабайт. Но работает только для «физически упорядоченных» данных.

-- Посмотреть все индексы таблицы
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';`,
                },
                { type: 'note', text: 'Когда индекс НЕ нужен: маленькая таблица (< 1000 строк), колонка с низкой кардинальностью (пол/статус на 2–3 значения — B-tree не поможет), таблица с перевесом записи над чтением (каждый INSERT обновляет индексы).' },
              ],
            },
            {
              id: 'sql-l13-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Есть индекс `CREATE INDEX ON orders(user_id, status)`. Какой запрос НЕ воспользуется индексом?',
                options: [
                  { id: 'a', text: 'WHERE user_id = 5' },
                  { id: 'b', text: 'WHERE user_id = 5 AND status = \'paid\'' },
                  { id: 'c', text: 'WHERE status = \'paid\'' },
                  { id: 'd', text: 'WHERE user_id = 5 AND status IN (\'paid\', \'shipped\')' },
                ],
                correct: ['c'],
                explanation: 'Составной индекс (user_id, status) работает для запросов, где есть первый столбец. WHERE status без user_id — не использует индекс. Для такого запроса нужен отдельный индекс на (status).',
              },
            },
          ],
        },
        {
          id: 'sql-l14',
          title: 'Транзакции и уровни изоляции',
          minutes: 30,
          steps: [
            {
              id: 'sql-l14-s1',
              title: 'ACID и BEGIN/COMMIT/ROLLBACK',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Транзакция — группа операций, которая либо применяется целиком, либо откатывается целиком. Четыре свойства — ACID: Atomicity, Consistency, Isolation, Durability.' },
                {
                  type: 'mermaid',
                  caption: 'Перевод денег: атомарная транзакция',
                  code: `sequenceDiagram
                    participant C as Клиент
                    participant DB as БД
                    C->>DB: BEGIN
                    C->>DB: UPDATE accounts SET balance = balance - 100 WHERE id = 1
                    C->>DB: UPDATE accounts SET balance = balance + 100 WHERE id = 2
                    alt обе операции успешны
                        C->>DB: COMMIT
                        DB-->>C: OK (деньги переведены)
                    else ошибка (например, constraint)
                        C->>DB: ROLLBACK
                        DB-->>C: откат (балансы как были)
                    end`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Явная транзакция',
                  code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- Если всё ок:
COMMIT;

-- Если что-то пошло не так (например, во втором UPDATE):
ROLLBACK;

-- SAVEPOINT — точка отката внутри транзакции
BEGIN;
UPDATE orders SET status = 'paid' WHERE id = 42;
SAVEPOINT after_payment;
UPDATE inventory SET stock = stock - 1 WHERE product_id = 7;
-- Если склад упал — откатим только до savepoint
ROLLBACK TO SAVEPOINT after_payment;   -- заказ остаётся paid, склад не тронут
COMMIT;`,
                },
              ],
            },
            {
              id: 'sql-l14-s2',
              title: 'Уровни изоляции и аномалии',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Уровни изоляции (SQL-стандарт)',
                  head: ['Уровень', 'Dirty read', 'Non-repeatable read', 'Phantom read', 'Когда'],
                  rows: [
                    ['Read Uncommitted', 'Да', 'Да', 'Да', 'Почти никогда'],
                    ['Read Committed', 'Нет', 'Да', 'Да', 'Дефолт в PostgreSQL'],
                    ['Repeatable Read', 'Нет', 'Нет', 'Да (в стандарте; в PG — нет)', 'Дефолт в MySQL InnoDB'],
                    ['Serializable', 'Нет', 'Нет', 'Нет', 'Финансы, критичные операции'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Установка уровня',
                  code: `BEGIN ISOLATION LEVEL SERIALIZABLE;
-- ... операции ...
COMMIT;

-- Или для всей сессии:
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL REPEATABLE READ;`,
                },
                { type: 'note', text: 'PostgreSQL: дефолт Read Committed. Repeatable Read в PG защищает и от phantom read (через MVCC snapshot). Serializable — самый строгий, но и самый медленный (сериализует конфликты).' },
              ],
            },
            {
              id: 'sql-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `ROLLBACK TO SAVEPOINT after_payment`?',
                options: [
                  { id: 'a', text: 'Откатывает всю транзакцию' },
                  { id: 'b', text: 'Откатывает только операции после savepoint, не закрывая транзакцию' },
                  { id: 'c', text: 'Коммитит транзакцию' },
                  { id: 'd', text: 'Создаёт новый savepoint' },
                ],
                correct: ['b'],
                explanation: 'SAVEPOINT — точка внутри транзакции. ROLLBACK TO откатывает только операции после неё, транзакция остаётся открытой. Позволяет «частично откатить» внутри одной большой транзакции.',
              },
            },
          ],
        },
        {
          id: 'sql-l15',
          title: 'EXPLAIN и оптимизация запросов',
          minutes: 30,
          steps: [
            {
              id: 'sql-l15-s1',
              title: 'EXPLAIN vs EXPLAIN ANALYZE',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'EXPLAIN показывает план запроса (как СУБД собирается его выполнять). EXPLAIN ANALYZE — реально выполняет запрос и показывает фактическое время и количество строк. Второй — точнее, но выполняет запрос (осторожно на UPDATE/DELETE).' },
                {
                  type: 'mermaid',
                  caption: 'Два плана: Seq Scan vs Index Scan',
                  code: `graph TD
                    subgraph Bad["Плохо: Seq Scan"]
                        B1["Seq Scan<br/>cost=0..25000<br/>rows=1000000"] --> B2["Filter: user_id = 5<br/>rows=3"]
                    end
                    subgraph Good["Хорошо: Index Scan"]
                        G1["Index Scan on idx_orders_user_id<br/>cost=0..12<br/>rows=3"] --> G2["rows=3 (без перебора)"]
                    end`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Чтение плана',
                  code: `EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 5;

-- Seq Scan on orders  (cost=0.00..25478.00 rows=3 width=...)
--                     (actual time=45.123..45.123 rows=3 loops=1)
--   Filter: (user_id = 5)
--   Rows Removed by Filter: 999997
-- Planning Time: 0.1 ms
-- Execution Time: 45.2 ms   ← 45 мс на поиск 3 строк из 1M

-- После CREATE INDEX idx_orders_user_id ON orders(user_id):
-- Index Scan using idx_orders_user_id on orders
--   (cost=0.42..12.45 rows=3) (actual time=0.02..0.03 rows=3 loops=1)
-- Execution Time: 0.05 ms   ← в 900 раз быстрее`,
                },
              ],
            },
            {
              id: 'sql-l15-s2',
              title: 'Что искать в плане',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Seq Scan на большой таблице с WHERE — кандидат на индекс',
                    'Rows Removed by Filter: миллионы — индекс не используется или неэффективен',
                    'Cost — оценка СУБД; actual time — реальное время',
                    'Nested Loop vs Hash Join: nested loop хорош для маленьких выборок, hash join — для больших',
                    'Sort с external merge disk — не хватает work_mem, сортировка идёт на диск',
                    'Bitmap Heap Scan — компромисс: индекс + пакетное чтение страниц',
                    'Buffers: shared hit=N read=M — сколько страниц из кэша, сколько с диска',
                  ],
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Типичный медленный запрос',
                  code: `-- Плохо: LIKE '%текст%' не использует B-tree (нет префикса)
SELECT * FROM products WHERE name LIKE '%iphone%';
-- → Seq Scan. Решение: GIN с pg_trgm:
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);

-- Плохо: функция над колонкой
SELECT * FROM orders WHERE DATE(created_at) = '2025-01-01';
-- → Seq Scan (функция ломает индекс). Решение:
SELECT * FROM orders WHERE created_at >= '2025-01-01' AND created_at < '2025-01-02';`,
                },
              ],
            },
            {
              id: 'sql-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Запрос `WHERE DATE(created_at) = \'2025-01-01\'` не использует индекс на created_at. Почему?',
                options: [
                  { id: 'a', text: 'DATE() не поддерживается в PostgreSQL' },
                  { id: 'b', text: 'Функция над колонкой ломает индекс: СУБД не может применить B-tree к результату DATE()' },
                  { id: 'c', text: 'Индекс на created_at не работает с датами' },
                  { id: 'd', text: 'Нужно использовать DATE_TRUNC' },
                ],
                correct: ['b'],
                explanation: 'Индекс B-tree построен по значениям created_at. DATE(created_at) — новое значение на каждую строку, индекс к нему не применим. Решение: переписать как диапазон created_at >= X AND < Y.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Оконные функции и миграции (новый)
    // ─────────────────────────────────────────────
    {
      id: 'sql-a-m3',
      title: 'Оконные функции и миграции',
      lessons: [
        {
          id: 'sql-l16',
          title: 'Оконные функции: OVER, PARTITION BY',
          minutes: 30,
          steps: [
            {
              id: 'sql-l16-s1',
              title: 'Как работает окно',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Оконная функция считает что-то по «окну» строк вокруг текущей — но не схлопывает результат, как GROUP BY, а добавляет колонку к каждой строке. Это позволяет видеть «и значение, и контекст».' },
                {
                  type: 'mermaid',
                  caption: 'Окно: агрегат по группе без схлопывания',
                  code: `graph LR
                    Rows["Все строки<br/>orders"] --> Partition["PARTITION BY user_id<br/>(группы по юзеру)"]
                    Partition --> Calc["SUM(total) OVER<br/>(сумма в группе)"]
                    Calc --> Result["Каждая строка<br/>+ колонка суммы<br/>в её группе"]`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Агрегат по группе без схлопывания',
                  code: `-- GROUP BY: 1 строка на юзера
SELECT user_id, SUM(total) AS revenue
FROM orders GROUP BY user_id;
-- user_id | revenue
-- 1       | 15000
-- 2       | 8000

-- OVER: ВСЕ строки + сумма по группе
SELECT
    id,
    user_id,
    total,
    SUM(total) OVER (PARTITION BY user_id) AS user_total
FROM orders;
-- id | user_id | total | user_total
-- 1  | 1       | 5000  | 15000
-- 2  | 1       | 10000 | 15000
-- 3  | 2       | 8000  | 8000`,
                },
                {
                  type: 'list',
                  items: [
                    'OVER () — окно = все строки результата',
                    'PARTITION BY — разбить на группы (как GROUP BY, но без схлопывания)',
                    'ORDER BY внутри OVER — определяет порядок для ROW_NUMBER, RANK, SUM OVER (накопительно)',
                    'ROWS BETWEEN ... AND ... — границы окна (например, «последние 7 дней»)',
                  ],
                },
              ],
            },
            {
              id: 'sql-l16-s2',
              title: 'ROW_NUMBER, RANK, LAG/LEAD',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Четыре главные функции',
                  code: `-- ROW_NUMBER: 1, 2, 3... (уникальный номер в группе)
SELECT
    user_id,
    id,
    total,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rn
FROM orders;
-- rn=1 — самый дорогой заказ каждого юзера

-- Топ-1 заказ на юзера (через CTE)
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rn
    FROM orders
)
SELECT * FROM ranked WHERE rn = 1;

-- RANK: 1, 1, 3, 4 (при равенстве — одинаковый ранг, следующий пропускается)
-- DENSE_RANK: 1, 1, 2, 3 (без пропусков)
SELECT
    id, total,
    RANK() OVER (ORDER BY total DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY total DESC) AS dense_rank
FROM orders;

-- LAG / LEAD: предыдущая / следующая строка
SELECT
    id,
    total,
    LAG(total) OVER (ORDER BY id) AS prev_total,
    LEAD(total) OVER (ORDER BY id) AS next_total
FROM orders;

-- Накопительная сумма по дням
SELECT
    DATE(created_at) AS day,
    SUM(total) AS daily,
    SUM(SUM(total)) OVER (ORDER BY DATE(created_at)) AS running_total
FROM orders
GROUP BY DATE(created_at);`,
                },
              ],
            },
            {
              id: 'sql-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как найти самый дорогой заказ каждого пользователя?',
                options: [
                  { id: 'a', text: 'SELECT MAX(total) FROM orders GROUP BY user_id' },
                  { id: 'b', text: 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) = 1' },
                  { id: 'c', text: 'ORDER BY total DESC LIMIT 1' },
                  { id: 'd', text: 'DISTINCT ON user_id total' },
                ],
                correct: ['b'],
                explanation: 'ROW_NUMBER с PARTITION BY user_id и ORDER BY total DESC даёт rn=1 для самого дорогого заказа каждого юзера. Затем фильтр WHERE rn = 1 (через CTE).',
              },
            },
          ],
        },
        {
          id: 'sql-l17',
          title: 'Миграции и версионирование схемы',
          minutes: 25,
          steps: [
            {
              id: 'sql-l17-s1',
              title: 'Зачем миграции',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Схема БД меняется: новые колонки, индексы, таблицы. Если менять вручную через psql — на проде забудется, на dev/staging разойдётся, откатить нельзя. Миграции — это файлы изменений схемы, применяемые по порядку и версионируемые в Git.' },
                {
                  type: 'table',
                  caption: 'Инструменты',
                  head: ['Инструмент', 'Язык', 'Плюсы'],
                  rows: [
                    ['Alembic', 'Python (SQLAlchemy)', 'Стандарт для Python/SQLAlchemy'],
                    ['Flyway', 'Java', 'Простой, SQL-файлы, работает с любой БД'],
                    ['Liquibase', 'Java', 'XML/YAML/SQL, много возможностей'],
                    ['Django migrations', 'Python (Django)', 'Встроено в Django'],
                    ['golang-migrate', 'Go', 'Для Go-проектов'],
                    ['dbmate', 'Go', 'Лёгкий, standalone, SQL-файлы'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Alembic: базовый workflow',
                  code: `# 1. Инициализация (один раз)
alembic init migrations

# 2. Автогенерация миграции по моделям SQLAlchemy
alembic revision --autogenerate -m "add status to orders"

# 3. Проверить сгенерированный файл! Автогенерация не всегда точна
# 4. Применить
alembic upgrade head

# 5. Откатить на одну миграцию
alembic downgrade -1

# 6. История
alembic history`,
                },
              ],
            },
            {
              id: 'sql-l17-s2',
              title: 'Expand-contract и опасные миграции',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Опасная миграция — та, что ломает приложение во время деплоя. Пример: переименовать колонку. Пока идёт деплой (30 сек), старый код читает `name`, а новый — `full_name`. В этот момент что-то падает. Решение — expand-contract (3 деплоя).' },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Переименование name → full_name через expand-contract',
                  code: `-- Деплой 1 (expand): добавляем новую колонку, пишем в обе
ALTER TABLE users ADD COLUMN full_name TEXT;
UPDATE users SET full_name = name;
-- Код читает name, пишет в name И full_name

-- Деплой 2 (migrate): код читает full_name, пишет в обе
-- Данные уже синхронизированы

-- Деплой 3 (contract): удаляем старую колонку
ALTER TABLE users DROP COLUMN name;
-- Код читает и пишет только full_name`,
                },
                {
                  type: 'list',
                  items: [
                    'Опасные операции на большой таблице: ADD COLUMN с DEFAULT (переписывает всю таблицу до PG 11), ALTER TYPE, RENAME COLUMN',
                    'Безопасные: ADD COLUMN без DEFAULT, CREATE INDEX CONCURRENTLY, ADD CONSTRAINT NOT VALID',
                    'CREATE INDEX CONCURRENTLY — не блокирует таблицу (обычный CREATE INDEX блокирует запись)',
                    'DROP INDEX CONCURRENTLY — аналогично',
                    'Всегда тестировать миграцию на копии прода с реальным объёмом данных',
                  ],
                },
                { type: 'note', text: 'На собеседовании: «Как переименовать колонку без даунтайма?» — правильный ответ «expand-contract, 3 деплоя». Плохой — «ALTER TABLE RENAME COLUMN» (сломает приложение во время деплоя).' },
              ],
            },
            {
              id: 'sql-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен подход expand-contract при переименовании колонки?',
                options: [
                  { id: 'a', text: 'Он быстрее' },
                  { id: 'b', text: 'Он позволяет деплоить без даунтайма: старая и новая колонки сосуществуют, код постепенно переключается' },
                  { id: 'c', text: 'Он автоматически генерирует миграции' },
                  { id: 'd', text: 'Он работает только в PostgreSQL' },
                ],
                correct: ['b'],
                explanation: 'При обычном RENAME COLUMN старый код (читающий старое имя) сломается во время деплоя. Expand-contract: expand (добавить новую) → migrate (код пишет в обе) → contract (удалить старую). Никакого даунтайма.',
              },
            },
          ],
        },
      ],
    },
        // ─────────────────────────────────────────────
    // m4 — Продвинутые возможности PostgreSQL
    // ─────────────────────────────────────────────
    {
      id: 'sql-a-m4',
      title: 'Продвинутые возможности PostgreSQL',
      lessons: [
        {
          id: 'sql-l14',
          title: 'Рекурсивные CTE: иерархии и деревья',
          minutes: 30,
          steps: [
            {
              id: 'sql-l14-s1',
              title: 'WITH RECURSIVE: как строится дерево',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Обычный CTE выполняется один раз. Рекурсивный (WITH RECURSIVE) — повторяется, пока не перестанет возвращать новые строки. Это единственный способ обойти иерархию в SQL: дерево категорий, оргструктуру, цепочку комментариев, граф зависимостей.',
                },
                {
                  type: 'mermaid',
                  caption: 'Рекурсивный CTE обходит дерево категорий итерация за итерацией',
                  code: `graph TD
                    subgraph Anchor["1. Anchor (стартовый набор)"]
                        A["Electronics<br/>parent_id IS NULL"]
                    end
                    subgraph Step1["2. Первая итерация: дети корня"]
                        B["Phones<br/>parent=Electronics"]
                        C["Laptops<br/>parent=Electronics"]
                    end
                    subgraph Step2["3. Вторая итерация: дети детей"]
                        D["iPhone<br/>parent=Phones"]
                        E["Android<br/>parent=Phones"]
                        F["MacBook<br/>parent=Laptops"]
                    end
                    A --> B
                    A --> C
                    B --> D
                    B --> E
                    C --> F`
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Схема таблицы categories',
                  code: `categories
  id         integer primary key
  name       text
  parent_id  integer references categories(id)  -- NULL для корневых`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Обход всего дерева с уровнем вложенности',
                  code: `WITH RECURSIVE tree AS (
    -- Anchor: корневые категории
    SELECT id, name, parent_id, 1 AS level
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive: дети текущего уровня
    SELECT c.id, c.name, c.parent_id, t.level + 1
    FROM categories c
    JOIN tree t ON c.parent_id = t.id
)
SELECT id, name, level
FROM tree
ORDER BY level, id;`,
                },
                {
                  type: 'list',
                  items: [
                    'Anchor member — стартовый запрос (до UNION ALL), выполняется один раз',
                    'Recursive member — ссылается на сам CTE (tree) и добавляет новые строки',
                    'UNION ALL — обязателен (UNION отбрасывает дубли и работает медленнее)',
                    'Рекурсия останавливается, когда recursive member возвращает 0 строк',
                    'level — вычисляемый столбец, показывает глубину',
                  ],
                },
                {
                  type: 'note',
                  text: 'WITH RECURSIVE — не «рекурсивная функция», а цикл: PostgreSQL выполняет anchor, потом снова recursive с новым набором, пока результат не станет пустым. Глубокие деревья (>1000 уровней) ограничены `max_recursion_depth` в конфиге.',
                },
              ],
            },
            {
              id: 'sql-l14-s2',
              title: 'Практические паттерны: путь до корня и поддерево',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Два главных паттерна: «все потомки категории» (top-down, для навигации) и «путь до корня» (bottom-up, для хлебных крошек). Один и тот же RECURSIVE, но направление разное — смотря куда смотрит JOIN.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Top-down: все потомки «Phones»',
                  code: `WITH RECURSIVE subtree AS (
    -- Anchor: стартовая категория
    SELECT id, name, parent_id
    FROM categories
    WHERE id = 2    -- Phones

    UNION ALL

    -- Recursive: дети текущей ветки
    SELECT c.id, c.name, c.parent_id
    FROM categories c
    JOIN subtree s ON c.parent_id = s.id
)
SELECT * FROM subtree;
-- Phones, iPhone, Android, (и их потомки, если есть)`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Bottom-up: путь от «iPhone» до корня',
                  code: `WITH RECURSIVE path AS (
    -- Anchor: стартовая категория
    SELECT id, name, parent_id, name::text AS full_path, 1 AS depth
    FROM categories
    WHERE id = 4    -- iPhone

    UNION ALL

    -- Recursive: идём к родителю
    SELECT c.id, c.name, c.parent_id,
           c.name || ' > ' || p.full_path,
           p.depth + 1
    FROM categories c
    JOIN path p ON p.parent_id = c.id    -- ← JOIN наоборот: c — родитель
)
SELECT full_path FROM path
ORDER BY depth DESC
LIMIT 1;
-- "Electronics > Phones > iPhone"`,
                },
                {
                  type: 'table',
                  caption: 'Когда какой паттерн',
                  head: ['Задача', 'Направление JOIN', 'Пример'],
                  rows: [
                    ['Все потомки (навигация)', 'c.parent_id = current.id', 'Список товаров в категории + подкатегориях'],
                    ['Путь до корня (хлебные крошки)', 'current.parent_id = c.id', 'Electronics > Phones > iPhone'],
                    ['Проверка циклов', 'Ограничить depth + NOT IN (visited)', 'Не зациклиться, если данные битые'],
                    ['Иерархия комментариев', 'c.parent_id = comment.id', 'Ответы на комментарии любой глубины'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Если в данных возможен цикл (A → B → A), рекурсивный CTE уйдёт в бесконечность. Защита: добавить в SELECT `depth` и в WHERE — `depth < 50`, либо хранить посещённые id в массиве и проверять `NOT (c.id = ANY(visited))`.',
                },
              ],
            },
            {
              id: 'sql-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте части рекурсивного CTE в правильном порядке выполнения',
                items: [
                  'Anchor: выбрать стартовые строки',
                  'UNION ALL',
                  'Recursive: присоединить следующий уровень',
                  'Повторять, пока recursive не вернёт 0 строк',
                ],
                correct: [
                  'Anchor: выбрать стартовые строки',
                  'UNION ALL',
                  'Recursive: присоединить следующий уровень',
                  'Повторять, пока recursive не вернёт 0 строк',
                ],
                explanation: 'Сначала anchor (один раз), потом recursive (в цикле до пустого результата). Между ними UNION ALL. Не UNION: UNION дороже и бессмысленно отбрасывает дубли на каждом шаге.',
              },
            },
          ],
        },
        {
          id: 'sql-l15',
          title: 'JSONB: полуструктурированные данные',
          minutes: 30,
          steps: [
            {
              id: 'sql-l15-s1',
              title: 'JSON vs JSONB и когда это нужно',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'PostgreSQL имеет два типа для JSON: `json` (текст, как пришёл) и `jsonb` (бинарный, разобранный). В 99% случаев нужен JSONB: он быстрее в поиске, поддерживает индексы, канонизирует порядок ключей. `json` — только если нужно сохранить исходный текст байт-в-байт (редко).',
                },
                {
                  type: 'mermaid',
                  caption: 'Реляционная модель vs JSONB',
                  code: `graph LR
                    subgraph Rel["Реляционная: фиксированные колонки"]
                        R1["orders<br/>id, user_id, total,<br/>source, promo,<br/>utm_source, utm_medium"]
                    end
                    subgraph Doc["JSONB: гибкая схема"]
                        D1["orders<br/>id, user_id, total,<br/>metadata jsonb<br/>{ source, promo,<br/>utm: { source, medium } }"]
                    end`
                },
                {
                  type: 'table',
                  caption: 'Когда JSONB, когда обычные колонки',
                  head: ['Ситуация', 'Выбор'],
                  rows: [
                    ['Поля всегда есть и одинаковые', 'Обычные колонки (быстрее, типизация)'],
                    ['Схема часто меняется, разные клиенты шлют разное', 'JSONB'],
                    ['Нужны индексы на поле и фильтры', 'Колонка (или JSONB + GIN, если поле редкое)'],
                    ['Метаданные, вебхуки, настройки, «разное»', 'JSONB'],
                    ['Связи 1:N (много атрибутов)', 'Отдельная таблица (а не JSONB)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'JSONB — не «серебряная пуля». Если поле участвует в JOIN, его лучше вынести в колонку. JSONB хорош для «необязательных, разнообразных, редких» данных. Классика: `orders.metadata` с UTM-метками, `events.payload` с параметрами события, `users.preferences` с настройками.',
                },
              ],
            },
            {
              id: 'sql-l15-s2',
              title: 'Операторы и индексы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Таблица с JSONB',
                  code: `CREATE TABLE orders (
    id serial PRIMARY KEY,
    user_id integer,
    total numeric,
    metadata jsonb
);

INSERT INTO orders (user_id, total, metadata) VALUES
(1, 1000, '{"source": "web", "promo": "SAVE10",
            "utm": {"source": "google", "medium": "cpc"}}');`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Операторы извлечения: -> и ->>',
                  code: `-- -> возвращает JSONB (с кавычками для строк)
SELECT metadata -> 'source' FROM orders;
-- "web"

-- ->> возвращает TEXT (без кавычек)
SELECT metadata ->> 'source' FROM orders;
-- web

-- Вложенное: сначала -> (получить объект), потом ->> (получить строку)
SELECT metadata -> 'utm' ->> 'source' FROM orders;
-- google

-- Или через #>> с путём-массивом
SELECT metadata #>> '{utm,medium}' FROM orders;
-- cpc`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Операторы фильтрации',
                  code: `-- @> : содержит (JSONB слева включает JSONB справа)
SELECT * FROM orders WHERE metadata @> '{"promo": "SAVE10"}';

-- ? : ключ существует на верхнем уровне
SELECT * FROM orders WHERE metadata ? 'promo';

-- ?| : хотя бы один из ключей существует
SELECT * FROM orders WHERE metadata ?| array['promo', 'coupon'];

-- ?& : все ключи существуют
SELECT * FROM orders WHERE metadata ?& array['source', 'utm'];`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Индексы для JSONB',
                  code: `-- GIN по всему JSONB: для @>, ?, ?|, ?&
CREATE INDEX idx_orders_metadata ON orders USING gin (metadata);

-- GIN с jsonb_path_ops: компактнее, только для @>
CREATE INDEX idx_orders_metadata_path
    ON orders USING gin (metadata jsonb_path_ops);

-- B-tree по конкретному полю: если часто фильтруете по нему
CREATE INDEX idx_orders_source
    ON orders ((metadata ->> 'source'));`,
                },
                {
                  type: 'list',
                  items: [
                    '-> и #> — возвращают JSONB (с кавычками для строк)',
                    '->> и #>> — возвращают TEXT (без кавычек, можно сравнивать с обычными строками)',
                    '@> — «содержит»: main инструмент для фильтра по JSONB',
                    'GIN-индекс нужен для @>, ?, ?|, ?&',
                    'B-tree по `(metadata ->> \'field\')` — если фильтруете по одному конкретному полю',
                    'jsonb_path_ops компактнее, но работает только с @>',
                  ],
                },
              ],
            },
            {
              id: 'sql-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём разница между `metadata -> \'source\'` и `metadata ->> \'source\'`?',
                options: [
                  { id: 'a', text: 'Никакой, это синонимы' },
                  { id: 'b', text: '`->` возвращает JSONB (с кавычками для строк), `->>` возвращает TEXT (без кавычек)' },
                  { id: 'c', text: '`->` быстрее, `->>` медленнее' },
                  { id: 'd', text: '`->>` работает только с числами' },
                ],
                correct: ['b'],
                explanation: '-> возвращает jsonb: для строки "web" вы получите `"web"` (с кавычками). ->> возвращает text: `web` (без кавычек). Для сравнения с обычной строкой (`= \'web\'`) нужен ->>.',
              },
            },
          ],
        },
        {
          id: 'sql-l16',
          title: 'Представления и материализованные представления',
          minutes: 30,
          steps: [
            {
              id: 'sql-l16-s1',
              title: 'VIEW vs MATERIALIZED VIEW',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'VIEW — сохранённый SQL-запрос. Каждый раз при обращении к view PostgreSQL пересчитывает его заново. MATERIALIZED VIEW — тот же запрос, но результат сохранён на диске: данные не пересчитываются, пока не сделаете REFRESH.',
                },
                {
                  type: 'mermaid',
                  caption: 'Как работает MATERIALIZED VIEW',
                  code: `graph LR
                    Q["Запрос: SELECT *<br/>FROM daily_revenue"] --> MV[("MATERIALIZED VIEW<br/>~1000 строк на диске")]
                    MV -.->|"REFRESH<br/>пересчёт (медленно)"| Base[("Базовые таблицы<br/>orders, ~1M строк")]
                    Base -.->|"раз в час"| MV`
                },
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Критерий', 'VIEW', 'MATERIALIZED VIEW'],
                  rows: [
                    ['Свежесть данных', 'Всегда актуальные', 'С момента последнего REFRESH'],
                    ['Скорость SELECT', 'Как обычный запрос', 'Мгновенная (данные уже посчитаны)'],
                    ['Стоимость чтения', 'Каждый раз пересчёт', 'Один раз при REFRESH'],
                    ['Когда', 'Простая инкапсуляция логики', 'Тяжёлые агрегаты, отчёты, денормализация'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Не путайте с «обычным представлением» в 1С или MySQL — там VIEW тоже вычисляется на лету. MATERIALIZED — это фишка PostgreSQL (и Oracle, но с нюансами). В MySQL материализованных view нет из коробки.',
                },
              ],
            },
            {
              id: 'sql-l16-s2',
              title: 'Создание, обновление, индексы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Обычное VIEW',
                  code: `CREATE VIEW active_users AS
SELECT id, email, created_at
FROM users
WHERE is_active = true;

-- Использование — как обычная таблица
SELECT * FROM active_users WHERE created_at > '2025-01-01';

-- Удаление
DROP VIEW active_users;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'MATERIALIZED VIEW с агрегатом',
                  code: `CREATE MATERIALIZED VIEW daily_revenue AS
SELECT
    date_trunc('day', created_at) AS day,
    COUNT(*)                      AS orders_count,
    SUM(total)                    AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY 1;

-- Первый SELECT — мгновенно (данные уже на диске)
SELECT * FROM daily_revenue ORDER BY day DESC LIMIT 7;

-- Обновление (пересчёт всего заново, блокирует чтение на время пересчёта)
REFRESH MATERIALIZED VIEW daily_revenue;`,
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'REFRESH CONCURRENTLY — без блокировки',
                  code: `-- CONCURRENTLY работает только если на matview есть UNIQUE INDEX
CREATE UNIQUE INDEX ON daily_revenue (day);

-- Теперь чтение не блокируется во время refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;

-- Плата: refresh идёт медленнее (сравнивает старые и новые строки)
-- Но пользователи видят данные всё время`,
                },
                {
                  type: 'list',
                  items: [
                    'VIEW — «алиас для запроса», всегда актуален',
                    'MATERIALIZED VIEW — «кэш результата», ускоряет тяжёлые запросы',
                    'REFRESH — пересчёт (обычно по расписанию: cron, pg_cron)',
                    'REFRESH CONCURRENTLY — без блокировки, но нужен UNIQUE INDEX и работает медленнее',
                    'На matview можно создавать свои индексы — как на обычную таблицу',
                    'Обновление matview не автоматическое — нужен REFRESH (или pg_cron, или триггер)',
                  ],
                },
              ],
            },
            {
              id: 'sql-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'В каких случаях лучше использовать MATERIALIZED VIEW, а не обычное VIEW?',
                options: [
                  { id: 'a', text: 'Тяжёлый агрегат (GROUP BY по миллиону строк), данные обновляются раз в час' },
                  { id: 'b', text: 'Нужны всегда актуальные данные в реальном времени' },
                  { id: 'c', text: 'Аналитический отчёт, который открывают 100 раз в день, а данные меняются ночью' },
                  { id: 'd', text: 'Таблица на 100 строк, запрос простой' },
                ],
                correct: ['a', 'c'],
                explanation: 'MATERIALIZED VIEW оправдан, когда запрос тяжёлый, а данные меняются редко (a, c). Если нужна мгновенная свежесть (b) или таблица маленькая (d) — обычный VIEW или вообще без view.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Практикум
    // ─────────────────────────────────────────────
    {
      id: 'sql-a-m5',
      title: 'Практикум',
      lessons: [
        {
          id: 'sql-l17',
          title: 'Практика: recursive CTE, JSONB, views',
          minutes: 35,
          steps: [
            {
              id: 'sql-l17-s1',
              title: 'Шаги recursive CTE',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте шаги рекурсивного CTE в правильном порядке',
                items: [
                  'Anchor: выбрать корни (parent_id IS NULL)',
                  'UNION ALL',
                  'Recursive: присоединить детей к текущему уровню',
                  'SELECT * FROM tree',
                ],
                correct: [
                  'Anchor: выбрать корни (parent_id IS NULL)',
                  'UNION ALL',
                  'Recursive: присоединить детей к текущему уровню',
                  'SELECT * FROM tree',
                ],
                explanation: 'Anchor → UNION ALL → Recursive (в цикле) → финальный SELECT. Recursive выполняется, пока не вернёт 0 строк. ORDER BY — отдельно.',
              },
            },
            {
              id: 'sql-l17-s2',
              title: 'Что останавливает рекурсию',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что останавливает рекурсию в WITH RECURSIVE?',
                options: [
                  { id: 'a', text: 'Явное ключевое слово STOP' },
                  { id: 'b', text: 'Recursive member возвращает 0 новых строк' },
                  { id: 'c', text: 'Автоматический таймаут 1 сек' },
                  { id: 'd', text: 'Ограничение max_recursion_depth по умолчанию' },
                ],
                correct: ['b'],
                explanation: 'Рекурсия останавливается естественно, когда recursive member возвращает пустой набор. Если данные содержат цикл — уйдёт в бесконечность, нужна защита (depth + NOT IN visited).',
              },
            },
            {
              id: 'sql-l17-s3',
              title: 'JSONB: извлечь как текст',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой оператор вернёт значение JSONB-поля как TEXT (без кавычек), чтобы сравнить с обычной строкой?',
                options: [
                  { id: 'a', text: '->' },
                  { id: 'b', text: '->>' },
                  { id: 'c', text: '#>' },
                  { id: 'd', text: '@>' },
                ],
                correct: ['b'],
                explanation: '->> возвращает text: `metadata ->> \'source\' = \'web\'` работает. -> возвращает jsonb — сравнение с \'web\' не сработает. #> — вложенный JSONB, @> — «содержит».',
              },
            },
            {
              id: 'sql-l17-s4',
              title: 'JSONB: фильтр по содержимому',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой оператор проверяет, что JSONB-документ содержит указанную пару ключ-значение?',
                options: [
                  { id: 'a', text: '=' },
                  { id: 'b', text: '@>' },
                  { id: 'c', text: '?' },
                  { id: 'd', text: '->>' },
                ],
                correct: ['b'],
                explanation: '@> — «содержит»: `metadata @> \'{"promo": "SAVE10"}\'` вернёт строки, где в metadata есть promo=SAVE10. ? проверяет только существование ключа, -> извлекает.',
              },
            },
            {
              id: 'sql-l17-s5',
              title: 'JSONB: тип индекса',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой тип индекса используется для быстрого поиска по JSONB через операторы @>, ?, ?|, ?&? (три буквы)',
                accepted: ['gin', 'GIN'],
                placeholder: 'три буквы',
                hint: 'Generalized Inverted Index',
                explanation: 'GIN (Generalized Inverted Index) — стандарт для JSONB, массивов, полнотекстового поиска. B-tree не работает с @>. Создание: `CREATE INDEX ... USING gin (metadata)`.',
              },
            },
            {
              id: 'sql-l17-s6',
              title: 'VIEW vs MATERIALIZED VIEW',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Чем MATERIALIZED VIEW отличается от обычного VIEW?',
                options: [
                  { id: 'a', text: 'Хранит результат запроса на диске' },
                  { id: 'b', text: 'Требует REFRESH для обновления данных' },
                  { id: 'c', text: 'Всегда показывает актуальные данные' },
                  { id: 'd', text: 'На него можно создавать индексы' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'MATERIALIZED: результат на диске (a), нужен REFRESH (b), можно индексировать (d). Не актуален всегда (c — это про обычное VIEW). Именно поэтому matview быстрый, но «просроченный».',
              },
            },
            {
              id: 'sql-l17-s7',
              title: 'REFRESH CONCURRENTLY',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что нужно, чтобы работал `REFRESH MATERIALIZED VIEW CONCURRENTLY`?',
                options: [
                  { id: 'a', text: 'Ничего — работает всегда' },
                  { id: 'b', text: 'Уникальный индекс на MATERIALIZED VIEW' },
                  { id: 'c', text: 'Суперпользователь PostgreSQL' },
                  { id: 'd', text: 'Триггер на базовой таблице' },
                ],
                correct: ['b'],
                explanation: 'CONCURRENTLY требует UNIQUE INDEX на matview (обычно на ключевой столбец). Без него PostgreSQL выдаст ошибку. Плата за неблокирующий refresh — медленнее и нужен индекс.',
              },
            },
            {
              id: 'sql-l17-s8',
              title: 'ROW_NUMBER vs RANK',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём разница между ROW_NUMBER() и RANK() в оконных функциях?',
                options: [
                  { id: 'a', text: 'Никакой' },
                  { id: 'b', text: 'ROW_NUMBER даёт уникальные номера (1, 2, 3, 4), RANK при равных значениях даёт одинаковый ранг с пропуском (1, 2, 2, 4)' },
                  { id: 'c', text: 'RANK быстрее' },
                  { id: 'd', text: 'ROW_NUMBER работает только с числами' },
                ],
                correct: ['b'],
                explanation: 'ROW_NUMBER — просто нумерация: 1, 2, 3, 4. RANK — олимпийская система: 1, 2, 2, 4 (два вторых → следующий четвёртый). DENSE_RANK — 1, 2, 2, 3. Для «топ-3 по выручке» — RANK; для пагинации — ROW_NUMBER.',
              },
            },
            {
              id: 'sql-l17-s9',
              title: 'ACID: изоляция',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что означает буква «I» в ACID?',
                options: [
                  { id: 'a', text: 'Index — индексирование' },
                  { id: 'b', text: 'Isolation — изоляция транзакций друг от друга' },
                  { id: 'c', text: 'Integrity — целостность' },
                  { id: 'd', text: 'Identity — идентичность' },
                ],
                correct: ['b'],
                explanation: 'ACID: Atomicity (всё или ничего), Consistency (данные валидны), Isolation (транзакции не видят промежуточные состояния друг друга), Durability (зафиксировано — навсегда). Isolation Levels: READ COMMITTED, REPEATABLE READ, SERIALIZABLE.',
              },
            },
            {
              id: 'sql-l17-s10',
              title: 'Напишите recursive CTE',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите WITH RECURSIVE, который обходит дерево категорий (id, name, parent_id) от корней и добавляет столбец `level` (корень = 1).',
                starterCode: 'WITH RECURSIVE tree AS (\n    ',
                mustInclude: [
                  { pattern: 'WITH RECURSIVE', message: 'Нужен WITH RECURSIVE' },
                  { pattern: 'UNION ALL', message: 'Нужен UNION ALL между anchor и recursive' },
                  { pattern: 'parent_id IS NULL', message: 'Anchor: корневые строки (parent_id IS NULL)' },
                  { pattern: 'JOIN tree', message: 'Recursive member должен JOIN на сам CTE (tree)' },
                  { pattern: 'level', message: 'Нужен столбец level' },
                ],
                explanation: 'WITH RECURSIVE tree AS (\n    SELECT id, name, parent_id, 1 AS level\n    FROM categories\n    WHERE parent_id IS NULL\n    UNION ALL\n    SELECT c.id, c.name, c.parent_id, t.level + 1\n    FROM categories c\n    JOIN tree t ON c.parent_id = t.id\n)\nSELECT * FROM tree ORDER BY level, id;',
              },
            },
          ],
        },
      ],
    },
  ],
};