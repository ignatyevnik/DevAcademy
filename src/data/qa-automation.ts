import type { Course } from './types';

export const qaAutomationCourse: Course = {
  slug: 'qa-automation',
  title: 'QA Automation',
  subtitle: 'Pytest, Playwright, API, SQL, нагрузка, безопасность и мобильное тестирование',
  description:
    'Курс для тех, кто уже умеет тестировать руками и хочет автоматизировать. Разберём pytest углублённо (фикстуры, mock, схемы), Playwright (локаторы, trace viewer, API-клиент, перехват сети, CI), SQL для проверки данных, нагрузочное тестирование с Locust и метриками, безопасность (OWASP, SQLi, XSS, IDOR, CSRF, Burp/ZAP), мобильное тестирование и accessibility. Каждая тема — с практикой.',
  level: 'Средний',
  tags: ['QA', 'Автоматизация', 'Playwright', 'pytest', 'Безопасность'],
  accent: '#0e9f6e',
  icon: 'flask',
  outcomes: [
    'Писать автотесты на pytest: фикстуры, mock, параметризация, схемы ответа',
    'Автоматизировать UI через Playwright: локаторы, ожидания, Page Object, trace viewer',
    'Комбинировать UI- и API-тесты, перехватывать сеть, запускать параллельно',
    'Проверять данные через SQL: дубли, «сироты», сверка UI и БД',
    'Проводить нагрузочные тесты: RPS, latency, p95/p99, Little\'s Law, Locust',
    'Проверять безопасность: OWASP Top 10, IDOR, SQLi, XSS, CSRF, Burp Suite и ZAP',
    'Тестировать мобильные приложения: эмуляторы, logcat, матрица устройств, Appium',
    'Проверять доступность: WCAG, axe, скринридеры',
  ],
  requirements: [
    'Пройден курс «QA: основы» (или опыт ручного тестирования)',
    'Базовый Python (переменные, функции, списки, словари)',
    'Понимание HTTP: методы, коды, заголовки',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — pytest углублённо (было qa-m6)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m1',
      title: 'Автотесты: pytest углублённо',
      lessons: [
        {
          id: 'qa-l17',
          title: 'Структура проекта и запуск',
          minutes: 20,
          steps: [
            {
              id: 'qa-l17-s1',
              title: 'Как организовать автотесты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Хороший автотест-проект — это не один файл `test.py`. Это структура, где тесты отделены от кода приложения и от тестовых данных.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичная структура',
                  code: 'project/\n├── src/                    ← код приложения\n│   └── cart.py\n├── tests/                  ← автотесты\n│   ├── unit/\n│   │   └── test_cart.py\n│   ├── integration/\n│   │   └── test_api.py\n│   ├── conftest.py         ← общие фикстуры\n│   └── data/               ← тестовые данные (JSON, fixtures)\n├── pytest.ini              ← конфиг\n└── requirements.txt',
                },
                {
                  type: 'list',
                  items: [
                    'Файлы тестов: test_*.py или *_test.py — иначе pytest их не найдёт',
                    'Функции: def test_xxx() — только так',
                    'conftest.py — фикстуры, доступные всем тестам в папке и ниже',
                    'pytest.ini — настройки: пути, маркеры, минимальное покрытие',
                  ],
                },
              ],
            },
            {
              id: 'qa-l17-s2',
              title: 'Конфигурация и маркеры',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'pytest.ini',
                  code: '[pytest]\ntestpaths = tests\naddopts = -v --strict-markers\nmarkers =\n    slow: долгие тесты\n    integration: требуют внешних сервисов\n    smoke: дымовые проверки',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Полезные команды запуска',
                  code: 'pytest                          # все тесты\npytest tests/unit                # только unit\npytest -k "cart"                # все тесты, где в имени есть cart\npytest -m "not slow"            # без медленных\npytest -x                        # останов на первом падении\npytest --lf                      # только упавшие в прошлый раз\npytest --ff                      # сначала падавшие, потом остальные\npytest --co                      # только список тестов, без запуска',
                },
                {
                  type: 'note',
                  text: '--strict-markers заставляет pytest ругаться на неизвестные маркеры. Это защита от опечаток: @pytest.mark.slwo (slwo) не «молча пройдёт», а упадёт с ошибкой.',
                },
              ],
            },
            {
              id: 'qa-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой файл pytest загружает автоматически для общих фикстур в директории?',
                accepted: ['conftest.py', 'conftest'],
                placeholder: 'имя файла',
                hint: 'conftest.…',
                explanation:
                  'conftest.py — специальный файл pytest. Он загружается автоматически, а фикстуры и хуки из него доступны всем тестам в той же директории и ниже. Импортировать его не нужно.',
              },
            },
          ],
        },
        {
          id: 'qa-l18',
          title: 'Фикстуры: области видимости и yield',
          minutes: 25,
          steps: [
            {
              id: 'qa-l18-s1',
              title: 'Уровни фикстур',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Фикстура может создаваться для каждого теста, для модуля, для всей сессии — это называется scope. Правильный scope экономит секунды и минуты: подключение к БД не надо пересоздавать на каждый тест.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Фикстуры с разными scope',
                  code: 'import pytest\n\n@pytest.fixture(scope="function")   # по умолчанию\ndef fresh_user():\n    return {"name": "test", "balance": 100}\n\n@pytest.fixture(scope="module")\ndef db_connection():\n    conn = connect_to_test_db()\n    yield conn\n    conn.close()\n\n@pytest.fixture(scope="session")\ndef api_client():\n    return HttpClient(base_url="https://test.example.com")',
                },
                {
                  type: 'table',
                  caption: 'Scope фикстур',
                  head: ['Scope', 'Когда создаётся', 'Когда уничтожается'],
                  rows: [
                    ['function', 'Перед каждым тестом', 'После каждого теста'],
                    ['class', 'Перед классом тестов', 'После класса'],
                    ['module', 'Перед модулем', 'После модуля'],
                    ['session', 'Перед всей сессией', 'После всей сессии'],
                  ],
                },
              ],
            },
            {
              id: 'qa-l18-s2',
              title: 'yield и автоочистка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Фикстура с yield — это «до / после». Код до yield — setup, после yield — teardown. Гарантируется, что teardown выполнится, даже если тест упал.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Типичный паттерн',
                  code: '@pytest.fixture\ndef temp_file(tmp_path):\n    f = tmp_path / "data.txt"\n    f.write_text("initial")\n    yield f          # тест получает объект f\n    if f.exists():\n        f.unlink()   # cleanup выполнится всегда',
                },
                {
                  type: 'note',
                  text: 'Не оставляйте фикстуру без teardown, если она создаёт ресурсы (подключения, файлы, записи в БД). Это приводит к «загрязнению» состояния между тестами — самая частая причина флакающих тестов.',
                },
              ],
            },
            {
              id: 'qa-l18-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой scope выбрать для подключения к тестовой БД, если все тесты работают с ней?',
                options: [
                  { id: 'a', text: 'function — пересоздавать на каждый тест' },
                  { id: 'b', text: 'session — одно подключение на весь прогон' },
                  { id: 'c', text: 'Без scope — по умолчанию' },
                  { id: 'd', text: 'Не имеет значения' },
                ],
                correct: ['b'],
                explanation:
                  'Подключение к БД дорогое. session создаст его один раз на весь прогон и закроет в конце. Исключение — если тесты меняют данные и изолированное подключение нужно для чистоты.',
              },
            },
          ],
        },
        {
          id: 'qa-l19',
          title: 'Mock и patch: изолируем зависимости',
          minutes: 25,
          steps: [
            {
              id: 'qa-l19-s1',
              title: 'Зачем нужны моки',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Unit-тест должен проверять одну функцию, а не весь мир вокруг неё. Если функция ходит в БД, дёргает API и читает файлы — это уже интеграционный тест. Моки позволяют изолировать: подменить внешнюю зависимость «заглушкой».',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Без мока — тест зависит от сети',
                  code: 'def get_user_name(user_id):\n    r = requests.get(f"https://api.example.com/users/{user_id}")\n    return r.json()["name"]\n\n# Тест: реальный HTTP-запрос, зависит от сети и состояния API',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'С моком — изолированно и быстро',
                  code: 'from unittest.mock import patch, MagicMock\n\ndef test_get_user_name():\n    with patch("requests.get") as mock_get:\n        mock_get.return_value.json.return_value = {"name": "Анна"}\n        assert get_user_name(1) == "Анна"\n        mock_get.assert_called_once_with("https://api.example.com/users/1")',
                },
              ],
            },
            {
              id: 'qa-l19-s2',
              title: 'Правила хорошего мока',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Мокайте то, что НЕ ваше: HTTP, БД, файлы, часы. Свой код — тестируйте по-настоящему.',
                    'Проверяйте вызовы: assert_called_once_with — тест докажет, что зависимость дёрнули правильно.',
                    'Мок должен повторять контракт реального объекта — иначе тест зелёный, а в проде падает.',
                    'Не мокайте всё подряд. Если зависимостей слишком много — это сигнал, что код плохо спроектирован.',
                    'Используйте pytest-mock (mocker) или unittest.mock. monkeypatch — для подмены переменных/атрибутов.',
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'С pytest-mock — короче',
                  code: 'def test_send_email(mocker):\n    mock = mocker.patch("myapp.email.smtp_send")\n    send_welcome("user@example.com")\n    mock.assert_called_once()\n    args, kwargs = mock.call_args\n    assert args[0] == "user@example.com"',
                },
              ],
            },
            {
              id: 'qa-l19-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что из перечисленного стоит мокать в unit-тестах?',
                options: [
                  { id: 'a', text: 'HTTP-запросы к внешнему API' },
                  { id: 'b', text: 'Свою функцию, которая складывает два числа' },
                  { id: 'c', text: 'Подключение к БД' },
                  { id: 'd', text: 'Текущее время — для детерминизма' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'Свою функцию «a + b» мокать бессмысленно: вы её и тестируете. Всё внешнее и недетерминированное (сеть, БД, время) — под замену.',
              },
            },
          ],
        },
        {
          id: 'qa-l20',
          title: 'API-тесты: схема ответа',
          minutes: 25,
          steps: [
            {
              id: 'qa-l20-s1',
              title: 'Не только статус-код',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Проверить «200 OK» недостаточно. API-тест должен валидировать схему: какие поля, какие типы, какие обязательные. Изменение контракта без изменения кода — классический способ сломать клиентов.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Валидация через jsonschema',
                  code: 'import requests\nfrom jsonschema import validate\n\nUSER_SCHEMA = {\n    "type": "object",\n    "required": ["id", "name", "email"],\n    "properties": {\n        "id": {"type": "integer"},\n        "name": {"type": "string"},\n        "email": {"type": "string", "format": "email"},\n    },\n}\n\ndef test_user_schema():\n    r = requests.get("https://api.example.com/users/1")\n    assert r.status_code == 200\n    validate(r.json(), USER_SCHEMA)',
                },
                {
                  type: 'note',
                  text: 'Иногда схема пишется вручную, иногда генерируется из OpenAPI/Swagger. Второй вариант надёжнее: тест автоматически подхватит изменения контракта.',
                },
              ],
            },
            {
              id: 'qa-l20-s2',
              title: 'Негативные сценарии',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Позитивный сценарий — это треть работы. Настоящая ценность — в негативных: что API вернёт на некорректные данные, без токена, с истёкшей сессией, при слишком частых запросах.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Параметризованные негативные тесты',
                  code: 'import pytest, requests\n\n@pytest.mark.parametrize("headers, expected", [\n    ({}, 401),\n    ({"Authorization": "Bearer invalid"}, 401),\n    ({"Authorization": "Bearer expired"}, 401),\n    ({"Authorization": "Bearer valid"}, 200),\n])\ndef test_auth_required(headers, expected):\n    r = requests.get("https://api.example.com/me", headers=headers)\n    assert r.status_code == expected\n\n@pytest.mark.parametrize("payload, expected", [\n    ({"name": ""}, 422),\n    ({"name": "a" * 300}, 422),\n    ({}, 422),\n    ({"name": "valid"}, 201),\n])\ndef test_create_validation(payload, expected):\n    r = requests.post("https://api.example.com/users", json=payload)\n    assert r.status_code == expected',
                },
              ],
            },
            {
              id: 'qa-l20-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что важнее всего проверять в API-тесте помимо статус-кода?',
                options: [
                  { id: 'a', text: 'Время ответа' },
                  { id: 'b', text: 'Схему ответа: обязательные поля и их типы' },
                  { id: 'c', text: 'Размер ответа в байтах' },
                  { id: 'd', text: 'IP-адрес сервера' },
                ],
                correct: ['b'],
                explanation:
                  'Схема — это контракт. Если поле переименовали или изменили тип, клиенты сломаются, даже если статус-код 200. Валидация схемы ловит такие изменения раньше.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Playwright базово (было qa-m7)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m2',
      title: 'UI-автоматизация: Playwright',
      lessons: [
        {
          id: 'qa-l21',
          title: 'Зачем UI-тесты и какой инструмент выбрать',
          minutes: 20,
          steps: [
            {
              id: 'qa-l21-s1',
              title: 'Где UI-тесты в пирамиде',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'UI-тесты (они же E2E, end-to-end) проходят через весь стек — от клика в браузере до записи в БД. Это самый «честный» тип тестов: если он зелёный, пользователь действительно сможет пройти сценарий. Но и самый дорогой: медленный, хрупкий, требует поднятого окружения.',
                },
                {
                  type: 'p',
                  text: 'Поэтому в пирамиде их мало — только критичные пути: логин, оплата, ключевые бизнес-сценарии. Проверять UI-тестами, что «кнопка красная» — плохая идея: это дешевле сделать скриншотным или юнит-тестом.',
                },
                {
                  type: 'table',
                  caption: 'Когда UI-тест оправдан',
                  head: ['Сценарий', 'Стоит ли автоматизировать'],
                  rows: [
                    ['Логин / регистрация', 'Да, критичный путь'],
                    ['Оформление заказа', 'Да, деньги'],
                    ['Восстановление пароля', 'Да, регулярный сценарий'],
                    ['Проверка цвета кнопки', 'Нет — это unit или visual-тест'],
                    ['Форма с 20 полями', 'Частично — API-тесты дешевле'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: если сценарий можно проверить через API — проверяйте через API. UI-тест нужен там, где важна именно связка «браузер + фронтенд + бэкенд».',
                },
              ],
            },
            {
              id: 'qa-l21-s2',
              title: 'Selenium, Playwright, Cypress',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Три главных инструмента UI-автоматизации. Выбор зависит от языка команды и типа приложения.',
                },
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Инструмент', 'Языки', 'Сильная сторона', 'Слабость'],
                  rows: [
                    ['Selenium', 'Python, Java, JS, C#', 'Стандарт индустрии, огромное сообщество', 'Медленный, требует WebDriver, нет auto-waiting'],
                    ['Playwright', 'Python, JS/TS, Java, .NET', 'Быстрый, auto-waiting, trace viewer, несколько браузеров из коробки', 'Моложе, меньше русскоязычных материалов'],
                    ['Cypress', 'JavaScript / TypeScript', 'Отличный DX, быстрая отладка', 'Только JS, ограничен работой в одном табе, слабее на сложных сценариях'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Для Python-команды в 2025 году Playwright — оптимальный выбор. Он обходит Selenium по скорости и надёжности, а Cypress отпадает из-за JS-only. Selenium имеет смысл, если в команде уже есть большая база тестов на нём — переписывать всё ради «модности» не стоит.',
                },
                {
                  type: 'note',
                  text: 'Playwright от Microsoft, Selenium — от сообщества (изначально ThoughtWorks), Cypress — коммерческий продукт с открытым ядром. Все три бесплатны для базового использования.',
                },
              ],
            },
            {
              id: 'qa-l21-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие сценарии оправдано покрывать UI-тестами, а не API-тестами?',
                options: [
                  { id: 'a', text: 'Логин пользователя через форму' },
                  { id: 'b', text: 'Проверка, что API возвращает 404 на несуществующий ID' },
                  { id: 'c', text: 'Оформление заказа: корзина → оплата → подтверждение' },
                  { id: 'd', text: 'Проверка цвета кнопки «Купить»' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'UI-тесты оправданы там, где важна связка «браузер + фронтенд + бэкенд». Проверка 404 — API-тест (быстрее, стабильнее). Цвет кнопки — unit или visual-regression, не E2E.',
              },
            },
          ],
        },
        {
          id: 'qa-l22',
          title: 'Playwright: первые шаги',
          minutes: 25,
          steps: [
            {
              id: 'qa-l22-s1',
              title: 'Установка и первый тест',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка',
                  code: 'pip install pytest-playwright\nplaywright install chromium\n\n# для других браузеров:\nplaywright install firefox webkit',
                },
                {
                  type: 'p',
                  text: 'Плагин pytest-playwright даёт фикстуры page, browser, context и умеет всё, что нужно для старта. Отдельно ставить pytest не надо — он уже стоит, если вы прошли модуль qa-a-m1.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Первый тест: проверяем заголовок',
                  code: 'from playwright.sync_api import Page, expect\n\ndef test_homepage_title(page: Page):\n    page.goto("https://example.com")\n    expect(page).to_have_title("Example Domain")\n    expect(page.get_by_role("heading", name="Example Domain")).to_be_visible()',
                },
                {
                  type: 'list',
                  items: [
                    'page.goto(url) — перейти по адресу',
                    'page.get_by_role(...) — найти элемент по ARIA-роли (лучший способ)',
                    'expect(...) — проверка с auto-waiting: если элемент появится через 2 сек, expect дождётся',
                    'sync_api используется для обычных тестов, async_api — для async-кода',
                  ],
                },
                {
                  type: 'note',
                  text: 'В Playwright почти всегда используют expect(...), а не assert. Причина: expect умеет ждать. Если элемент ещё не отрисовался — expect перепроверит через 100 мс, ещё раз, ещё, пока не истечёт таймаут (по умолчанию 5 сек).',
                },
              ],
            },
            {
              id: 'qa-l22-s2',
              title: 'Локаторы: как найти элемент',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Локатор — это способ сказать «найди мне этот элемент». В Playwright есть иерархия: предпочитайте ролевые локаторы, CSS-селекторы — в последнюю очередь.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Пять способов найти кнопку «Войти»',
                  code: '# 1. По роли (лучший — семантичный, устойчив к смене текста кнопки)\npage.get_by_role("button", name="Войти")\n\n# 2. По тексту (для ссылок, заголовков, простых кнопок)\npage.get_by_text("Войти")\n\n# 3. По label (для полей формы)\npage.get_by_label("Email")\n\n# 4. По placeholder\npage.get_by_placeholder("Введите email")\n\n# 5. По CSS-селектору (последний выбор)\npage.locator("button.submit-btn")',
                },
                {
                  type: 'list',
                  items: [
                    'get_by_role — по ARIA-роли: button, link, heading, textbox, checkbox. Самый устойчивый: не меняется при переименовании',
                    'get_by_label — для input, связанных с <label>',
                    'get_by_text — по видимому тексту',
                    'get_by_placeholder — по placeholder',
                    'get_by_test_id — по data-testid, если разработчики договорились добавлять',
                    'locator("css=...") — CSS/XPath, для случаев, когда ничего другого нет',
                  ],
                },
                {
                  type: 'note',
                  text: 'Если тест приходится держать на CSS-селекторе — попросите разработчиков добавить data-testid. Это не «костыль», а стандартная практика: тест-атрибуты не влияют на UI и не ломаются при рефакторинге вёрстки.',
                },
              ],
            },
            {
              id: 'qa-l22-s3',
              title: 'Действия',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Основные действия',
                  code: 'page.get_by_label("Email").fill("user@example.com")     # ввод\npage.get_by_label("Password").fill("secret")\npage.get_by_role("button", name="Войти").click()         # клик\n\npage.get_by_role("checkbox").check()                     # галочка\npage.get_by_role("checkbox").uncheck()\n\npage.get_by_label("Страна").select_option("RU")          # select\npage.get_by_role("button", name="Отправить").hover()     # наведение\n\npage.keyboard.press("Enter")                             # клавиатура\npage.reload()                                            # перезагрузка',
                },
                {
                  type: 'p',
                  text: 'Каждое действие в Playwright автоматически ждёт, что элемент станет доступен: появится в DOM, станет видимым, перестанет быть disabled, окажется стабильным (не двигается). Не нужно вручную писать sleep или wait — это главное преимущество перед Selenium.',
                },
                {
                  type: 'note',
                  text: 'Не пишите time.sleep() между действиями. Это самая частая ошибка новичков. Playwright сам ждёт нужного состояния. Если тест нестабилен — используйте expect для явного ожидания конкретного состояния, а не фиксированные паузы.',
                },
              ],
            },
            {
              id: 'qa-l22-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Каким локатором лучше всего искать кнопку «Сохранить»?',
                options: [
                  { id: 'a', text: 'locator("button.save-btn")' },
                  { id: 'b', text: 'get_by_role("button", name="Сохранить")' },
                  { id: 'c', text: 'locator("xpath=//button[text()=\'Сохранить\']")' },
                  { id: 'd', text: 'locator(".btn.btn-primary")' },
                ],
                correct: ['b'],
                explanation:
                  'get_by_role — семантичный локатор: остаётся стабильным при смене класса, вёрстки, обёртки. Если кнопку переименуют — тест сломается, но это и есть сигнал, что изменился UX. CSS и XPath хрупкие: рефакторинг вёрстки их ломает.',
              },
            },
          ],
        },
        {
          id: 'qa-l23',
          title: 'Playwright: ожидания и отладка',
          minutes: 25,
          steps: [
            {
              id: 'qa-l23-s1',
              title: 'Auto-waiting и expect',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'expect в Playwright — это не assert. Он перепроверяет условие, пока оно не выполнится или не истечёт таймаут. Это называется «assertion retry» или «auto-waiting».',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Проверки, которые умеют ждать',
                  code: 'expect(page.get_by_text("Добро пожаловать")).to_be_visible()\nexpect(page.get_by_role("button")).to_be_enabled()\nexpect(page.get_by_label("Email")).to_have_value("user@example.com")\nexpect(page.get_by_role("alert")).to_have_text("Ошибка")\nexpect(page).to_have_url("/dashboard")\nexpect(page.locator("li")).to_have_count(3)\n\n# Отключить auto-waiting (только если точно знаете, зачем)\nexpect(page.get_by_text("x")).to_be_visible(timeout=100)',
                },
                {
                  type: 'list',
                  items: [
                    'expect перепроверяет, а не падает сразу — это ключевое',
                    'По умолчанию timeout 5 сек, задаётся в pytest.ini или в expect',
                    'Если нужно проверить, что элемента НЕТ — to_have_count(0) или not_to_be_visible',
                    'Не путайте to_have_text (весь текст) и to_contain_text (содержит подстроку)',
                  ],
                },
              ],
            },
            {
              id: 'qa-l23-s2',
              title: 'Ожидания, которые НЕ надо писать',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В Playwright почти всегда достаточно expect. Явные wait_* нужны в редких случаях: когда вы работаете с сетью или с чем-то, чего expect не покрывает.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Что не надо писать',
                  code: '# ПЛОХО: фиксированная пауза\npage.get_by_role("button").click()\ntime.sleep(2)  # ← не надо\n\n# ХОРОШО: ждём появления элемента\nexpect(page.get_by_text("Заказ оформлен")).to_be_visible()',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Когда wait оправдан',
                  code: '# Ждём сетевой ответ (не покрывается expect)\nwith page.expect_response("**/api/orders") as resp_info:\n    page.get_by_role("button", name="Оформить").click()\nresponse = resp_info.value\nassert response.status == 201\n\n# Ждём событие (например, скачивание файла)\nwith page.expect_download() as download_info:\n    page.get_by_role("link", name="Скачать").click()',
                },
              ],
            },
            {
              id: 'qa-l23-s3',
              title: 'Trace viewer: запись и разбор падений',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Главное преимущество Playwright перед Selenium — trace viewer. Это запись теста, по которой можно «отмотать» любой момент: увидеть, что было на экране, что происходило в DOM, какие были сетевые запросы и логи консоли.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Включить trace для всех тестов',
                  code: '# pytest.ini\n[pytest]\naddopts = --tracing=retain-on-failure',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Открыть trace после падения',
                  code: '# после падения pytest оставит trace.zip в test-results/\nplaywright show-trace test-results/xxx/trace.zip',
                },
                {
                  type: 'list',
                  items: [
                    'retain-on-failure — пишется всегда, сохраняется только для упавших (оптимально)',
                    'on — пишется всегда (медленнее, больше диска)',
                    'off — не пишется',
                    'trace viewer показывает: скриншоты по шагам, DOM-снимки, сеть, консоль, время',
                  ],
                },
                {
                  type: 'note',
                  text: 'В CI trace — критичен: локально можно посмотреть глазами, а на CI — только по записи. Настройте retain-on-failure и загружайте trace.zip как артефакт. Это ускоряет разбор падений в разы.',
                },
              ],
            },
            {
              id: 'qa-l23-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что из перечисленного — плохая практика в Playwright?',
                options: [
                  { id: 'a', text: 'time.sleep(2) между действиями' },
                  { id: 'b', text: 'expect(...).to_be_visible() для проверки появления элемента' },
                  { id: 'c', text: 'Фиксированная пауза в 5 секунд «на всякий случай»' },
                  { id: 'd', text: 'expect(page).to_have_url(...) для проверки навигации' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'Фиксированные паузы — антипаттерн: тест становится медленным и всё равно нестабильным. expect умеет ждать и падает сразу, как только состояние достигнуто или истёк таймаут.',
              },
            },
          ],
        },
        {
          id: 'qa-l24',
          title: 'Playwright + pytest: фикстуры и Page Object',
          minutes: 30,
          steps: [
            {
              id: 'qa-l24-s1',
              title: 'Фикстуры браузера',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Плагин pytest-playwright даёт готовые фикстуры. Их можно переопределять в conftest.py, чтобы задать base_url, viewport, headless-режим, авторизацию.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'conftest.py',
                  code: 'import pytest\nfrom playwright.sync_api import Page\n\n@pytest.fixture(scope="session")\ndef browser_context_args(browser_context_args):\n    return {\n        **browser_context_args,\n        "base_url": "https://staging.example.com",\n        "viewport": {"width": 1440, "height": 900},\n    }\n\n@pytest.fixture\ndef logged_in_page(page: Page) -> Page:\n    page.goto("/login")\n    page.get_by_label("Email").fill("test@example.com")\n    page.get_by_label("Password").fill("secret")\n    page.get_by_role("button", name="Войти").click()\n    expect(page).to_have_url("/dashboard")\n    return page',
                },
                {
                  type: 'p',
                  text: 'base_url в browser_context_args позволяет писать page.goto("/login") вместо полного URL. Это упрощает переключение между staging и локальным окружением — через переменную окружения.',
                },
              ],
            },
            {
              id: 'qa-l24-s2',
              title: 'Page Object в Playwright',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Page Object — класс, который инкапсулирует работу со страницей: локаторы и методы. Тест не знает про селекторы; он говорит «залогинься» или «оформи заказ». При изменении вёрстки правится один класс, а не 20 тестов.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'pages/login_page.py',
                  code: 'from playwright.sync_api import Page, expect\n\nclass LoginPage:\n    def __init__(self, page: Page):\n        self.page = page\n        self.email = page.get_by_label("Email")\n        self.password = page.get_by_label("Password")\n        self.submit = page.get_by_role("button", name="Войти")\n        self.error = page.get_by_role("alert")\n\n    def open(self):\n        self.page.goto("/login")\n        return self\n\n    def login(self, email: str, password: str):\n        self.email.fill(email)\n        self.password.fill(password)\n        self.submit.click()\n        return self\n\n    def expect_error(self, text: str):\n        expect(self.error).to_have_text(text)\n        return self',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'tests/test_login.py',
                  code: 'from pages.login_page import LoginPage\n\ndef test_login_success(logged_in_page):\n    expect(logged_in_page.get_by_role("heading", name="Добро пожаловать")).to_be_visible()\n\ndef test_login_wrong_password(page):\n    LoginPage(page).open().login("test@example.com", "wrong").expect_error("Неверный пароль")',
                },
                {
                  type: 'list',
                  items: [
                    'Методы Page Object возвращают self — можно строить цепочки',
                    'expect_* методы внутри класса — тест остаётся читаемым',
                    'Локаторы — в __init__, а не в каждом методе: одно место для правки',
                    'Page Object не знает, какой тест его использует — тест и страница разделены',
                  ],
                },
              ],
            },
            {
              id: 'qa-l24-s3',
              title: 'Что не должно попасть в Page Object',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Page Object — тонкая обёртка над страницей, а не «божественный объект». Несколько правил, чтобы он не превратился в помойку.',
                },
                {
                  type: 'list',
                  items: [
                    'Бизнес-логика (расчёт скидки, генерация данных) — в helper-модулях, не в Page Object',
                    'Проверки уровня «весь сценарий прошёл» — в тесте, а не в Page Object',
                    'Управление браузером (открытие/закрытие, viewport) — в фикстурах',
                    'Работа с БД, API — в отдельных хелперах: Page Object отвечает только за UI',
                    'Один класс — одна страница или один логический блок (LoginPage, CartPage, CheckoutPage)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Если Page Object разрастается до 500 строк — это сигнал, что страница слишком большая или в класс просочилась бизнес-логика. Разделяйте на компоненты: HeaderComponent, CartWidget, CheckoutForm.',
                },
              ],
            },
            {
              id: 'qa-l24-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что НЕ должно находиться в Page Object?',
                options: [
                  { id: 'a', text: 'Локаторы элементов страницы' },
                  { id: 'b', text: 'Методы вроде login(email, password)' },
                  { id: 'c', text: 'Расчёт итоговой суммы заказа со скидкой' },
                  { id: 'd', text: 'Метод expect_error(text) для проверки сообщения' },
                ],
                correct: ['c'],
                explanation:
                  'Расчёт суммы — бизнес-логика. Она тестируется юнит-тестами на бэкенде и не должна зависеть от UI. Page Object — только про работу со страницей: найти, кликнуть, проверить отображение.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Playwright API и CI (было qa-m8)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m3',
      title: 'Playwright: API, сеть, CI',
      lessons: [
        {
          id: 'qa-l25',
          title: 'Playwright как API-клиент',
          minutes: 25,
          steps: [
            {
              id: 'qa-l25-s1',
              title: 'Зачем API-тесты в Playwright',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Playwright умеет не только браузер, но и HTTP-запросы. Встроенный APIRequestContext заменяет requests + сессии, но даёт то, чего нет в requests: единый контекст с браузером, куки, авторизацию и лаконичный синтаксис.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Базовый API-тест',
                  code: 'from playwright.sync_api import Playwright, expect\n\ndef test_get_user(playwright: Playwright):\n    api = playwright.request.new_context(\n        base_url="https://api.example.com",\n        extra_http_headers={"Authorization": "Bearer token"},\n    )\n    response = api.get("/users/1")\n    expect(response).to_be_ok()\n    body = response.json()\n    assert body["id"] == 1\n    api.dispose()',
                },
                {
                  type: 'list',
                  items: [
                    'new_context() — отдельный «браузер» для запросов: свои куки, заголовки, авторизация',
                    'base_url — тот же, что для UI, не надо писать полный URL в каждом тесте',
                    'dispose() — освобождает ресурсы. Забыть — утечка соединений',
                    'response.to_be_ok() — это expect, а не assert: проверяет статус 2xx и умеет ждать',
                  ],
                },
                {
                  type: 'note',
                  text: 'Для чистых API-тестов Playwright может показаться избыточным — requests проще. Но когда у вас есть и UI-, и API-тесты в одном фреймворке, единый инструмент экономит много сил: одна фикстура, одна авторизация, один CI.',
                },
              ],
            },
            {
              id: 'qa-l25-s2',
              title: 'Смешанные сценарии: UI + API',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Главная сила Playwright — комбинировать. Например, авторизоваться через API (быстро), а проверить UI (визуально). Или создать заказ через API, а в UI проверить, что он отображается. Это резко ускоряет тесты.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Авторизация через API, проверка через UI',
                  code: 'def test_user_dashboard(logged_in_page, api_client):\n    # logged_in_page уже авторизован — но не через UI, а через API\n    response = api_client.get("/api/orders")\n    orders = response.json()\n\n    logged_in_page.goto("/orders")\n    expect(logged_in_page.get_by_role("listitem")).to_have_count(len(orders))\n    expect(logged_in_page.get_by_text(orders[0]["id"])).to_be_visible()',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'conftest.py — фикстуры API и UI',
                  code: 'import pytest\nfrom playwright.sync_api import Page, Playwright\n\n@pytest.fixture(scope="session")\ndef api_client(playwright: Playwright):\n    api = playwright.request.new_context(base_url="https://staging.example.com")\n    yield api\n    api.dispose()\n\n@pytest.fixture\ndef logged_in_page(page: Page, api_client):\n    # логин через API — секунды, а не минуты\n    response = api_client.post("/api/auth/login", data={\n        "email": "test@example.com",\n        "password": "secret",\n    })\n    token = response.json()["token"]\n\n    # передаём токен в браузер\n    page.context.add_cookies([{\n        "name": "auth_token", "value": token,\n        "domain": "staging.example.com", "path": "/",\n    }])\n    page.goto("/dashboard")\n    return page',
                },
                {
                  type: 'note',
                  text: 'Логин через UI на каждом тесте — это 2–3 секунды × 100 тестов = 5 минут. Логин через API — 100 мс × 100 = 10 секунд. Плюс UI-логин проверяется отдельным тестом, а не 100 раз в фикстуре.',
                },
              ],
            },
            {
              id: 'qa-l25-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в смешанных тестах логиниться через API, а не через UI?',
                options: [
                  { id: 'a', text: 'UI-логин не работает в Playwright' },
                  { id: 'b', text: 'API-логин быстрее: не надо кликать по форме на каждом тесте' },
                  { id: 'c', text: 'API-логин надёжнее показывает, что UI работает' },
                  { id: 'd', text: 'Так принято в индустрии' },
                ],
                correct: ['b'],
                explanation:
                  'Сам UI-логин проверяется одним отдельным тестом. Остальным тестам нужен только результат — авторизованное состояние. API-логин даёт его за 100 мс вместо 2–3 сек и избавляет от зависимости от вёрстки формы.',
              },
            },
          ],
        },
        {
          id: 'qa-l26',
          title: 'Перехват и мокирование сети',
          minutes: 30,
          steps: [
            {
              id: 'qa-l26-s1',
              title: 'page.route: подмена ответов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Playwright умеет перехватывать сетевые запросы браузера и подменять их. Это открывает три сценария: тестирование edge-кейсов (ошибка 500, таймаут), ускорение (заглушки вместо реальных запросов) и изоляция (тест не зависит от staging-бэкенда).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Подмена ответа API',
                  code: 'def test_error_message_on_server_error(page):\n    # перехватываем запрос и возвращаем 500\n    page.route("**/api/orders", lambda route: route.fulfill(\n        status=500,\n        body=\'{"error": "Internal error"}\',\n        content_type="application/json",\n    ))\n\n    page.goto("/orders")\n    expect(page.get_by_text("Не удалось загрузить заказы")).to_be_visible()',
                },
                {
                  type: 'list',
                  items: [
                    'page.route(pattern, handler) — перехватить запрос, URL которого совпадает с pattern',
                    '** в pattern — wildcard: **/api/* поймает всё, что содержит /api/',
                    'route.fulfill() — вернуть свой ответ: статус, тело, заголовки',
                    'route.continue_() — пропустить запрос дальше (к реальному серверу)',
                    'route.abort() — оборвать запрос как «нет сети»',
                  ],
                },
              ],
            },
            {
              id: 'qa-l26-s2',
              title: 'Сценарии для моков',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Что мокать — не «всё подряд», а edge-кейсы, которые сложно или опасно воспроизвести на реальном бэкенде.',
                },
                {
                  type: 'table',
                  caption: 'Сценарии, где моки незаменимы',
                  head: ['Сценарий', 'Зачем мок'],
                  rows: [
                    ['HTTP 500', 'Не хотите ронять staging ради проверки обработки ошибки'],
                    ['Таймаут', 'Проверить, что UI покажет «Повторите попытку» через 30 сек'],
                    ['Пустой ответ', 'Проверить empty state («у вас пока нет заказов»)'],
                    ['Медленный ответ', 'Проверить индикатор загрузки'],
                    ['Некорректный JSON', 'Проверить, что фронт не падает'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Медленный ответ: проверяем индикатор',
                  code: 'import time\n\ndef test_loading_indicator(page):\n    def slow_handler(route):\n        time.sleep(2)\n        route.continue_()\n\n    page.route("**/api/orders", slow_handler)\n    page.goto("/orders")\n\n    expect(page.get_by_role("progressbar")).to_be_visible()\n    expect(page.get_by_text("Заказ №1")).to_be_visible(timeout=5000)',
                },
                {
                  type: 'note',
                  text: 'Не мокайте успешные сценарии без причины. Если API реально работает и отвечает быстро — пусть тест проверяет настоящую интеграцию. Моки — для edge-кейсов и ускорения, а не для «изоляции от всего».',
                },
              ],
            },
            {
              id: 'qa-l26-s3',
              title: 'Проверка исходящих запросов',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Проверить, что запрос ушёл с правильными данными',
                  code: 'def test_click_sends_correct_payload(page):\n    captured = {}\n\n    def capture(route):\n        captured["body"] = route.request.post_data_json\n        route.continue_()\n\n    page.route("**/api/orders", capture)\n    page.goto("/checkout")\n    page.get_by_label("Промокод").fill("SAVE10")\n    page.get_by_role("button", name="Оформить").click()\n\n    expect(page.get_by_text("Заказ оформлен")).to_be_visible()\n    assert captured["body"]["promo_code"] == "SAVE10"',
                },
                {
                  type: 'list',
                  items: [
                    'route.request.method, .url, .post_data_json — что было отправлено',
                    'route.request.headers — заголовки',
                    'Так проверяют, что фронт отправляет правильные данные — без моков ответа',
                    'Это «шпион», а не «заглушка»: запрос идёт дальше, но мы его подсмотрели',
                  ],
                },
              ],
            },
            {
              id: 'qa-l26-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие сценарии стоит покрыть через page.route?',
                options: [
                  { id: 'a', text: 'Проверка, что при 500 показывается сообщение об ошибке' },
                  { id: 'b', text: 'Проверка, что успешный заказ создаётся (happy path)' },
                  { id: 'c', text: 'Проверка индикатора загрузки при медленном ответе' },
                  { id: 'd', text: 'Проверка, что фронт отправляет промокод в теле запроса' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'Happy path должен идти к реальному API — так проверяется настоящая интеграция. Моки оправданы для edge-кейсов (500, таймаут, медленно) и для подсматривания запросов (промокод).',
              },
            },
          ],
        },
        {
          id: 'qa-l27',
          title: 'Параллельный запуск и CI',
          minutes: 25,
          steps: [
            {
              id: 'qa-l27-s1',
              title: 'Параллель по умолчанию',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'pytest-playwright по умолчанию запускает тесты последовательно. Для проекта на 100 UI-тестов это 10+ минут. Плагин pytest-xdist включает параллельный запуск — тесты распределяются по воркерам.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка и запуск',
                  code: 'pip install pytest-xdist\n\n# 4 параллельных воркера\npytest -n 4\n\n# автоопределение числа ядер\npytest -n auto\n\n# 4 воркера + останов на первом падении\npytest -n 4 -x',
                },
                {
                  type: 'p',
                  text: 'Параллель — не магия. Чтобы она работала, тесты должны быть независимы: не полагаться на общий стейт (один логин, одна БД), не модифицировать общие данные. Каждая фикстура создаёт своё окружение.',
                },
                {
                  type: 'note',
                  text: 'Если тесты начинают падать только с -n auto, но зелёные последовательно — почти всегда это shared state. Два теста одновременно пишут в одну строку БД, или один удаляет пользователя, которого использует другой. Фикс: уникальные данные на тест (uuid, timestamp в email).',
                },
              ],
            },
            {
              id: 'qa-l27-s2',
              title: 'Стратегии распределения',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как xdist делит тесты',
                  code: '# load — по одному тесту (баланс)\npytest -n 4 --dist=load\n\n# loadscope — целыми классами/модулями (изоляция контекста)\npytest -n 4 --dist=loadscope\n\n# loadfile — по файлам (быстрее старт, менее сбалансированно)\npytest -n 4 --dist=loadfile',
                },
                {
                  type: 'list',
                  items: [
                    'load — оптимально для независимых тестов, но может «разбросать» связанные',
                    'loadscope — все тесты одного класса идут в один воркер (удобно для фикстур уровня class)',
                    'loadfile — все тесты одного файла в одном воркере: минимум setup/teardown',
                    'Выбор зависит от того, что дороже: setup окружения или баланс нагрузки',
                  ],
                },
              ],
            },
            {
              id: 'qa-l27-s3',
              title: 'CI: GitHub Actions для Playwright',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/e2e.yml',
                  code: 'name: e2e\non: [pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        shard: [1, 2, 3, 4]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: "3.12" }\n      - run: pip install -r requirements.txt\n      - run: playwright install --with-deps chromium\n      - run: pytest -n auto --shard=${{ matrix.shard }}/4\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-results-${{ matrix.shard }}\n          path: test-results/',
                },
                {
                  type: 'list',
                  items: [
                    'matrix.shard — разбиение на N независимых джоб, каждая запускает свою «порцию» тестов',
                    '--shard=1/4 — «первая четверть тестов»; xdist внутри джобы добавляет параллель',
                    'if: always() на upload-artifact — артефакты сохранятся даже если тесты упали',
                    'fail-fast: false — если один shard упал, остальные продолжают (полная картина)',
                    '4 shard × 4 воркера = 16 параллельных тестов',
                  ],
                },
                {
                  type: 'note',
                  text: 'Для маленьких проектов шардинг избыточен. Начните с -n auto на одном раннере, добавляйте sharding, когда один прогон перевалит за 10–15 минут. Оптимум — 10 минут на PR, не больше.',
                },
              ],
            },
            {
              id: 'qa-l27-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Тесты зелёные последовательно, но падают с `pytest -n auto`. Что вероятнее всего?',
                options: [
                  { id: 'a', text: 'Playwright не поддерживает параллель' },
                  { id: 'b', text: 'Shared state: тесты мешают друг другу через общие данные' },
                  { id: 'c', text: 'Не хватает памяти' },
                  { id: 'd', text: 'Слишком много воркеров' },
                ],
                correct: ['b'],
                explanation:
                  'Параллель ломает тесты почти всегда из-за shared state: два теста пишут в одну строку БД, один удаляет пользователя другого, общий лог-файл. Фикс — уникальные данные на тест (uuid в email, timestamp в заказе).',
              },
            },
          ],
        },
        {
          id: 'qa-l28',
          title: 'Визуальное тестирование',
          minutes: 25,
          steps: [
            {
              id: 'qa-l28-s1',
              title: 'Скриншотные тесты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Визуальное тестирование — это сравнение скриншота страницы с эталоном. Если пиксели разошлись — тест падает. Ловит регрессии вёрстки, которые не ловятся по DOM: сдвинулась кнопка на 5 px, поменялся цвет, уехал шрифт.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Простейший визуальный тест',
                  code: 'def test_homepage_visual(page):\n    page.goto("/")\n    expect(page).to_have_screenshot()',
                },
                {
                  type: 'p',
                  text: 'При первом запуске Playwright создаст эталон (baseline). При следующих — сравнит. Если есть разница, создаст три файла: actual, expected, diff — их можно посмотреть глазами.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Управление эталонами',
                  code: 'pytest --update-snapshots      # обновить все эталоны\npytest --update-snapshots=changed  # только изменившиеся\n\n# эталоны лежат в tests/__snapshots__/ или рядом с тестом',
                },
                {
                  type: 'note',
                  text: 'Главная боль визуальных тестов — шум: шрифты, антиалиасинг, тултипы, случайные данные. Не снимайте скриншот всей страницы, если можно снять конкретный компонент. И настройте маску для динамических элементов.',
                },
              ],
            },
            {
              id: 'qa-l28-s2',
              title: 'Практические приёмы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Скриншот с маской и допуском',
                  code: 'def test_product_card_visual(page):\n    page.goto("/products/1")\n\n    expect(page.get_by_test_id("product-card")).to_have_screenshot(\n        mask=[page.get_by_test_id("price"), page.get_by_test_id("rating")],\n        max_diff_pixels=100,\n    )',
                },
                {
                  type: 'list',
                  items: [
                    'mask=[...] — закрасить динамические элементы чёрным прямоугольником',
                    'max_diff_pixels — допуск по числу различающихся пикселей (для антиалиасинга)',
                    'max_diff_pixel_ratio — доля различающихся пикселей (0.01 = 1%)',
                    'animations="disabled" — отключить анимации на время скриншота',
                    'caret="hide" — скрыть курсор в input',
                  ],
                },
                {
                  type: 'p',
                  text: 'Что делать с масками: цены, даты, имена пользователей, счётчики, рейтинги — всё, что меняется между запусками. Если маска закрывает полстраницы — скриншот бесполезен: вы тестируете только пустые прямоугольники.',
                },
              ],
            },
            {
              id: 'qa-l28-s3',
              title: 'Когда визуальные тесты оправданы',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Плюсы и минусы',
                  head: ['Стоит автоматизировать', 'Не стоит'],
                  rows: [
                    ['Ключевые страницы (лендинг, главная)', 'Каждую страницу продукта'],
                    ['Компоненты дизайн-системы (кнопки, карточки)', 'Динамический контент (лента, чат)'],
                    ['Состояния ошибок (404, 500)', 'Страницы с персонализацией'],
                    ['Тёмная тема', 'Страницы с рекламой, видео'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'Визуальные тесты — самые хрупкие в наборе. Один лишний сдвиг — десятки ложных падений',
                    'Всегда снимайте компонент, а не всю страницу: проще маскировать, стабильнее',
                    'В CI зафиксируйте viewport, ОС, браузер — иначе эталоны придётся держать для каждой комбинации',
                    'НЕ заменяет функциональные тесты: кнопка визуально на месте, но может не нажиматься',
                  ],
                },
                {
                  type: 'note',
                  text: 'Визуальные тесты — это про регрессии вёрстки, а не про функциональность. У вас должно быть 3–5 визуальных тестов на ключевые страницы и всё. Больше — превратится в «перезаписываю эталоны каждый релиз».',
                },
              ],
            },
            {
              id: 'qa-l28-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно сделать, чтобы визуальные тесты не были шумными?',
                options: [
                  { id: 'a', text: 'Снимать компонент, а не всю страницу целиком' },
                  { id: 'b', text: 'Маскировать динамические элементы (цены, даты, имена)' },
                  { id: 'c', text: 'Снимать каждый тест в разных браузерах для надёжности' },
                  { id: 'd', text: 'Использовать max_diff_pixels для допуска антиалиасинга' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Снимать компонент, маскировать динамику и допускать небольшой diff — три главных приёма против шума. А вот «разные браузеры» — наоборот, увеличивают число эталонов и ложных падений.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — SQL для тестировщика (было qa-m9)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m4',
      title: 'SQL для тестировщика',
      lessons: [
        {
          id: 'qa-l29',
          title: 'SQL: зачем тестировщику и как устроены данные',
          minutes: 20,
          steps: [
            {
              id: 'qa-l29-s1',
              title: 'Пять ситуаций, где нужен SQL',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Тестировщику SQL нужен не для «разработки», а для проверки. Вот типичные ситуации, где без него не обойтись.',
                },
                {
                  type: 'list',
                  items: [
                    'Проверить, что заказ через UI реально записался в БД (а не только «показался на экране»).',
                    'Найти пользователей с аномальными данными: дубли email, отрицательный баланс, заказы без позиций.',
                    'Подготовить тестовые данные: 100 пользователей с разными статусами за один запрос.',
                    'Отладить API-тест: увидеть, что именно вернула БД, а не только ответ API.',
                    'Проверить миграцию: после обновления схемы старые данные не побились.',
                  ],
                },
                {
                  type: 'note',
                  text: 'Тестировщик не пишет продакшн-запросы и не оптимизирует БД. Его SQL — SELECT-ориентированный: посмотреть, проверить, найти. UPDATE/INSERT — только на тестовой БД и с осторожностью.',
                },
              ],
            },
            {
              id: 'qa-l29-s2',
              title: 'Схема, на которой будем учиться',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Все примеры в модуле — на схеме интернет-магазина. Четыре таблицы, связанные по id.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Схема интернет-магазина',
                  code: 'users\n  id          integer primary key\n  email       text\n  name        text\n  created_at  timestamp\n\norders\n  id          integer primary key\n  user_id     integer references users(id)\n  status      text      -- new | paid | shipped | cancelled\n  total       numeric\n  created_at  timestamp\n\nproducts\n  id          integer primary key\n  name        text\n  category    text\n  price       numeric\n\norder_items\n  id          integer primary key\n  order_id    integer references orders(id)\n  product_id  integer references products(id)\n  quantity    integer\n  price       numeric   -- цена на момент заказа (может отличаться от products.price)',
                },
                {
                  type: 'p',
                  text: 'Связи: у пользователя много заказов, у заказа много позиций, у позиции — один товар. Такая структура (users → orders → order_items → products) знакома почти всем, кто работал с бизнес-приложениями.',
                },
                {
                  type: 'note',
                  text: 'Синтаксис примеров — PostgreSQL. В MySQL/MSSQL мелочи отличаются (например, IFNULL vs COALESCE), но принципы одинаковые. SQL учится один раз — дальше меняются нюансы диалекта.',
                },
              ],
            },
            {
              id: 'qa-l29-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что из перечисленного — типичная задача тестировщика в SQL?',
                options: [
                  { id: 'a', text: 'Написать API-эндпоинт для заказов' },
                  { id: 'b', text: 'Проверить, что заказ из UI корректно записался в таблицу orders' },
                  { id: 'c', text: 'Спроектировать новую схему БД для продакшена' },
                  { id: 'd', text: 'Оптимизировать индексы для ускорения отчётов' },
                ],
                correct: ['b'],
                explanation:
                  'Тестировщик использует SQL для проверки данных после действий. Написание эндпоинтов, схем и оптимизация индексов — задачи разработчика и DBA.',
              },
            },
          ],
        },
        {
          id: 'qa-l30',
          title: 'SELECT и WHERE: базовая выборка',
          minutes: 25,
          steps: [
            {
              id: 'qa-l30-s1',
              title: 'Что вернуть и откуда',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'SELECT — это «что взять», FROM — «откуда взять», WHERE — «какие строки подходят». Порядок в запросе именно такой, хотя логически сначала фильтруются строки, а потом выбираются колонки.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Простейший SELECT',
                  code: '-- Все колонки, все строки (осторожно: на большой таблице — долго)\nSELECT * FROM users;\n\n-- Конкретные колонки\nSELECT id, email FROM users;\n\n-- С псевдонимом\nSELECT email AS contact FROM users;\n\n-- Фильтрация\nSELECT id, email FROM users WHERE name = \'Анна\';\n\n-- Несколько условий: AND / OR\nSELECT * FROM orders\nWHERE status = \'paid\' AND total > 1000;\n\nSELECT * FROM orders\nWHERE status = \'paid\' OR status = \'shipped\';',
                },
                {
                  type: 'note',
                  text: 'SELECT * на большой таблице — антипаттерн. Он тянет все колонки, включая blob/text, и ломается, когда в таблицу добавили новую колонку. Для тестов и проверок лучше явно перечислять нужные поля.',
                },
              ],
            },
            {
              id: 'qa-l30-s2',
              title: 'Операторы WHERE: полный арсенал',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Основные операторы',
                  code: '-- Сравнения\nWHERE total = 1000\nWHERE total != 1000\nWHERE total > 500\nWHERE total BETWEEN 500 AND 1000    -- включительно с обеих сторон\n\n-- Списки\nWHERE status IN (\'paid\', \'shipped\')\nWHERE status NOT IN (\'cancelled\', \'deleted\')\n\n-- NULL (ВАЖНО: не работает через =)\nWHERE user_id IS NULL\nWHERE user_id IS NOT NULL\n\n-- LIKE — поиск по шаблону\nWHERE email LIKE \'%@gmail.com\'      -- заканчивается на\nWHERE name LIKE \'Ан%\'               -- начинается на «Ан»\nWHERE name LIKE \'%ова\'              -- заканчивается на «ова»\nWHERE email LIKE \'%@_mail.com\'      -- _ — один любой символ\n\n-- Даты\nWHERE created_at >= \'2025-01-01\'\nWHERE created_at >= NOW() - INTERVAL \'7 days\'',
                },
                {
                  type: 'note',
                  text: 'NULL — это «неизвестно», а не «пустая строка». Любое сравнение с NULL через = даёт NULL (не true и не false), поэтому WHERE user_id = NULL вернёт 0 строк. Используйте IS NULL / IS NOT NULL.',
                },
                {
                  type: 'p',
                  text: 'Регистр: PostgreSQL и MySQL сравнивают строки с учётом регистра (в большинстве коллаций). Чтобы не зависеть — используйте LOWER() или ILIKE (PostgreSQL):',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  code: 'WHERE LOWER(email) LIKE \'%@gmail.com\'    -- универсально\nWHERE email ILIKE \'%@gmail.com\'          -- только PostgreSQL',
                },
              ],
            },
            {
              id: 'qa-l30-s3',
              title: 'ORDER BY, LIMIT, DISTINCT',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Сортировка и ограничение',
                  code: '-- Сортировка по возрастанию (по умолчанию)\nSELECT * FROM orders ORDER BY created_at;\n\n-- По убыванию\nSELECT * FROM orders ORDER BY created_at DESC;\n\n-- По нескольким полям: сначала статус, потом дата\nSELECT * FROM orders ORDER BY status, created_at DESC;\n\n-- Топ-10 последних заказов\nSELECT * FROM orders ORDER BY created_at DESC LIMIT 10;\n\n-- Пропустить 20, взять 10 (пагинация)\nSELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'DISTINCT — уникальные значения',
                  code: '-- Уникальные статусы заказов (какие вообще бывают)\nSELECT DISTINCT status FROM orders;\n\n-- Уникальные категории товаров\nSELECT DISTINCT category FROM products;\n\n-- Уникальные пары (для проверки дублей)\nSELECT DISTINCT user_id, status FROM orders;',
                },
                {
                  type: 'note',
                  text: 'ORDER BY — критичен для LIMIT. Без него СУБД может вернуть любые 10 строк, и результат будет «плавать» между запусками. Всегда сортируйте, если ограничиваете.',
                },
              ],
            },
            {
              id: 'qa-l30-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой оператор использовать, чтобы найти строки, где user_id равно NULL? (напишите только оператор)',
                accepted: ['IS NULL', 'is null', 'is  null'],
                placeholder: 'оператор',
                hint: 'Не =, а два слова через пробел',
                explanation:
                  'WHERE user_id IS NULL. Через = NULL сравнивать нельзя: user_id = NULL вернёт NULL, а не true. IS NULL и IS NOT NULL — единственный корректный способ.',
              },
            },
          ],
        },
        {
          id: 'qa-l31',
          title: 'Агрегаты, GROUP BY, HAVING',
          minutes: 30,
          steps: [
            {
              id: 'qa-l31-s1',
              title: 'Пять агрегатных функций',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Агрегаты сворачивают много строк в одно значение. Это половина всех запросов тестировщика: «сколько», «сумма», «среднее», «максимум».',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'COUNT, SUM, AVG, MIN, MAX',
                  code: '-- Сколько всего пользователей\nSELECT COUNT(*) FROM users;\n\n-- Сколько заказов в статусе paid\nSELECT COUNT(*) FROM orders WHERE status = \'paid\';\n\n-- Сумма всех оплаченных заказов\nSELECT SUM(total) FROM orders WHERE status = \'paid\';\n\n-- Средний чек\nSELECT AVG(total) FROM orders WHERE status = \'paid\';\n\n-- Самый дорогой и самый дешёвый заказ\nSELECT MIN(total), MAX(total) FROM orders;\n\n-- Всё вместе в одном запросе\nSELECT\n    COUNT(*)      AS orders_count,\n    SUM(total)    AS total_revenue,\n    AVG(total)    AS avg_check,\n    MIN(total)    AS min_order,\n    MAX(total)    AS max_order\nFROM orders\nWHERE status = \'paid\';',
                },
                {
                  type: 'note',
                  text: 'COUNT(*) считает все строки. COUNT(column) — только не-NULL значения этого столбца. COUNT(DISTINCT column) — уникальные. Разница критична: COUNT(email) не посчитает пользователей без email.',
                },
              ],
            },
            {
              id: 'qa-l31-s2',
              title: 'GROUP BY: агрегаты по группам',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'GROUP BY группирует строки по значению колонки и применяет агрегат к каждой группе. «Сколько заказов у каждого пользователя», «выручка по месяцам», «средний чек по статусам».',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Сколько заказов у каждого пользователя',
                  code: 'SELECT user_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id\nORDER BY order_count DESC;',
                },
                {
                  type: 'p',
                  text: 'Правило: в SELECT при GROUP BY можно указывать только колонки из GROUP BY и агрегаты. Всё остальное — ошибка (или неопределённость в зависимости от СУБД).',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Сложнее: выручка и средний чек по статусам',
                  code: 'SELECT\n    status,\n    COUNT(*)         AS orders_count,\n    SUM(total)       AS revenue,\n    ROUND(AVG(total), 2) AS avg_check\nFROM orders\nGROUP BY status\nORDER BY revenue DESC;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Группировка по двум полям',
                  code: '-- Сколько заказов по каждой паре (status, user_id)\nSELECT status, user_id, COUNT(*)\nFROM orders\nGROUP BY status, user_id\nORDER BY status, user_id;',
                },
              ],
            },
            {
              id: 'qa-l31-s3',
              title: 'HAVING: фильтр после группировки',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'WHERE фильтрует строки ДО группировки. HAVING — ПОСЛЕ. Если условие содержит агрегат (COUNT, SUM, AVG), его место — в HAVING.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи с 5+ заказами',
                  code: 'SELECT user_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) >= 5\nORDER BY order_count DESC;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'WHERE и HAVING в одном запросе',
                  code: '-- Пользователи с 3+ оплаченными заказами\nSELECT user_id, COUNT(*) AS paid_orders\nFROM orders\nWHERE status = \'paid\'      -- сначала фильтр строк\nGROUP BY user_id\nHAVING COUNT(*) >= 3      -- потом фильтр групп\nORDER BY paid_orders DESC;',
                },
                {
                  type: 'note',
                  text: 'Порядок выполнения: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Если попытаться использовать агрегат в WHERE — ошибка. Если колонку без агрегата в HAVING — тоже ошибка.',
                },
              ],
            },
            {
              id: 'qa-l31-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В каком порядке выполняется запрос в SQL?',
                options: [
                  { id: 'a', text: 'SELECT → FROM → WHERE → GROUP BY → HAVING' },
                  { id: 'b', text: 'FROM → WHERE → GROUP BY → HAVING → SELECT' },
                  { id: 'c', text: 'WHERE → FROM → SELECT → GROUP BY → HAVING' },
                  { id: 'd', text: 'FROM → SELECT → WHERE → GROUP BY → HAVING' },
                ],
                correct: ['b'],
                explanation:
                  'Порядок: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Именно поэтому HAVING может содержать агрегаты (они уже вычислены), а WHERE — нет (агрегатов ещё нет).',
              },
            },
          ],
        },
        {
          id: 'qa-l32',
          title: 'JOIN: соединение таблиц',
          minutes: 35,
          steps: [
            {
              id: 'qa-l32-s1',
              title: 'INNER JOIN: только совпадения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'JOIN соединяет строки двух таблиц по условию. INNER JOIN оставляет только те строки, где есть совпадение с обеих сторон. Пользователь без заказов не попадёт в результат; заказ без пользователя — тоже.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'INNER JOIN: заказы с email пользователей',
                  code: 'SELECT\n    o.id        AS order_id,\n    o.total,\n    u.email     AS user_email\nFROM orders o\nJOIN users u ON u.id = o.user_id\nWHERE o.status = \'paid\';',
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
              ],
            },
            {
              id: 'qa-l32-s2',
              title: 'LEFT JOIN: все из левой + совпадения из правой',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'LEFT JOIN сохраняет все строки левой (первой) таблицы. Если в правой нет совпадения — правая часть заполняется NULL. Это главный способ найти «чего не хватает»: пользователей без заказов, заказов без позиций, товаров без продаж.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи без единого заказа',
                  code: 'SELECT u.id, u.email\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;',
                },
                {
                  type: 'p',
                  text: 'Логика: LEFT JOIN даёт всем пользователям хотя бы одну строку (даже без заказов). Если заказа нет, o.id = NULL. WHERE o.id IS NULL оставляет только таких. Это классический «anti-join».',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы с количеством позиций (включая заказы без позиций)',
                  code: 'SELECT\n    o.id,\n    o.total,\n    COUNT(oi.id) AS items_count\nFROM orders o\nLEFT JOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.total\nORDER BY items_count ASC;',
                },
                {
                  type: 'note',
                  text: 'COUNT(oi.id), а не COUNT(*). COUNT(*) посчитает и заказы без позиций как «1» (потому что строка есть). COUNT(oi.id) считает только не-NULL, то есть реальные позиции.',
                },
              ],
            },
            {
              id: 'qa-l32-s3',
              title: 'RIGHT, FULL и CROSS',
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
                  type: 'p',
                  text: 'RIGHT JOIN используют редко: он эквивалентен LEFT JOIN с переставленными таблицами. FULL — когда нужно найти разрывы в обе стороны. CROSS — для генерации всех комбинаций (например, всех пар «товар × размер»).',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'FULL OUTER: заказы без пользователей + пользователи без заказов',
                  code: 'SELECT u.id AS user_id, o.id AS order_id\nFROM users u\nFULL OUTER JOIN orders o ON o.user_id = u.id\nWHERE u.id IS NULL OR o.id IS NULL;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Три таблицы в одном запросе',
                  code: 'SELECT\n    o.id            AS order_id,\n    u.email,\n    p.name          AS product,\n    oi.quantity,\n    oi.price\nFROM orders o\nJOIN users u        ON u.id = o.user_id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p     ON p.id = oi.product_id\nWHERE o.status = \'paid\'\nORDER BY o.id;',
                },
                {
                  type: 'note',
                  text: 'Чем больше JOIN-ов, тем важнее индексы на полях связи (user_id, order_id, product_id). Для тестировщика это не критично — запросы обычно на маленьких выборках. Но если запрос на проде «висит» — это первое, что стоит проверить через EXPLAIN.',
                },
              ],
            },
            {
              id: 'qa-l32-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие задачи решает LEFT JOIN?',
                options: [
                  { id: 'a', text: 'Найти пользователей без заказов' },
                  { id: 'b', text: 'Показать всех пользователей, включая тех, у кого нет заказов' },
                  { id: 'c', text: 'Оставить только пользователей, у которых есть хотя бы один заказ' },
                  { id: 'd', text: 'Найти заказы, привязанные к удалённому пользователю' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'LEFT JOIN сохраняет всех из левой таблицы. Отсюда три задачи: все пользователи + их заказы (b), найти без заказов через IS NULL (a), найти заказы с несуществующим user_id через перевёрнутый LEFT JOIN (d). Вариант C — это INNER JOIN.',
              },
            },
          ],
        },
        {
          id: 'qa-l33',
          title: 'NULL и COALESCE',
          minutes: 25,
          steps: [
            {
              id: 'qa-l33-s1',
              title: 'Почему NULL — это не пустая строка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'NULL — это «значение неизвестно». Не ноль, не пустая строка, не false. Любая операция с NULL даёт NULL: NULL + 5 = NULL, NULL = NULL → NULL (не true!), NULL || \'текст\' = NULL.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'NULL отравляет арифметику',
                  code: 'SELECT 100 + NULL;         -- NULL, а не 100\nSELECT NULL = NULL;        -- NULL (не true!)\nSELECT NULL != NULL;       -- NULL\nSELECT COALESCE(NULL, 0);  -- 0 (первое не-NULL)\n\n-- В таблице:\nSELECT id, total + bonus FROM orders;  -- если bonus IS NULL, total + bonus = NULL',
                },
                {
                  type: 'p',
                  text: 'Это ловит тестировщиков и разработчиков на реальных багах: сумма заказа «исчезает», если у товара не указана скидка; средний чек занижается, потому что AVG игнорирует NULL-строки.',
                },
                {
                  type: 'note',
                  text: 'Агрегаты игнорируют NULL: SUM, AVG, MIN, MAX не считают NULL-строки. COUNT(*) считает все, COUNT(column) — только не-NULL. Это влияет на цифры в отчётах: AVG(total) при 100 строках с 20 NULL — это сумма / 80, а не / 100.',
                },
              ],
            },
            {
              id: 'qa-l33-s2',
              title: 'COALESCE: первый не-NULL',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'COALESCE(a, b, c, ...) возвращает первое не-NULL значение из списка. Если все NULL — вернёт NULL. Это главный способ подставить «заглушку» вместо NULL.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Типичные применения',
                  code: '-- Заменить NULL на 0 в сумме\nSELECT id, COALESCE(total, 0) AS total FROM orders;\n\n-- Взять имя или email, если имени нет\nSELECT COALESCE(name, email, \'без имени\') AS display FROM users;\n\n-- С безопасной арифметикой\nSELECT total + COALESCE(bonus, 0) AS total_with_bonus\nFROM orders;\n\n-- Сложнее: приоритет источников\nSELECT COALESCE(\n    phone_mobile,\n    phone_home,\n    phone_work,\n    \'нет телефона\'\n) AS contact_phone\nFROM users;',
                },
                {
                  type: 'list',
                  items: [
                    'COALESCE работает во всех СУБД: PostgreSQL, MySQL, SQL Server, Oracle, SQLite',
                    'Принимает любое число аргументов (2 и больше)',
                    'Тип результата — «общий» тип всех аргументов: COALESCE(int, int) → int; COALESCE(int, text) → text',
                    'Все аргументы, кроме первого, вычисляются только если нужно — ленивая семантика',
                  ],
                },
              ],
            },
            {
              id: 'qa-l33-s3',
              title: 'Альтернативы и CASE',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'COALESCE — универсальный, но в разных СУБД есть свои функции с двумя аргументами. И для условной логики (не просто «замена NULL») используется CASE.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'COALESCE и его аналоги',
                  code: '-- PostgreSQL, SQL Server, Oracle, SQLite\nCOALESCE(a, b)\n\n-- MySQL: IFNULL (только 2 аргумента)\nIFNULL(a, b)\n\n-- Oracle: NVL (только 2 аргумента)\nNVL(a, b)\n\n-- PostgreSQL: NVL нет, но есть COALESCE\n-- SQL Server: ISNULL (2 аргумента)\n-- SQLite: IFNULL (2 аргумента)\n\n-- Правило: если сомневаетесь — пишите COALESCE, он работает везде',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'CASE: условная логика (шире, чем NULL)',
                  code: '-- Проверка статуса заказа\nSELECT\n    id,\n    CASE status\n        WHEN \'paid\'      THEN \'Оплачен\'\n        WHEN \'shipped\'   THEN \'Отправлен\'\n        WHEN \'cancelled\' THEN \'Отменён\'\n        ELSE \'Новый\'\n    END AS status_ru\nFROM orders;\n\n-- С условиями и агрегатами: сколько оплачено и отменено\nSELECT\n    COUNT(*) FILTER (WHERE status = \'paid\')      AS paid_count,\n    COUNT(*) FILTER (WHERE status = \'cancelled\') AS cancelled_count\nFROM orders;\n\n-- Универсально (без FILTER): через CASE\nSELECT\n    SUM(CASE WHEN status = \'paid\'      THEN 1 ELSE 0 END) AS paid_count,\n    SUM(CASE WHEN status = \'cancelled\' THEN 1 ELSE 0 END) AS cancelled_count\nFROM orders;',
                },
                {
                  type: 'note',
                  text: 'COALESCE — только про NULL. CASE — про любое условие. Если задача «если А, то Б, иначе В» — это CASE. Если «если NULL, то заглушка» — это COALESCE.',
                },
              ],
            },
            {
              id: 'qa-l33-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая функция вернёт первое не-NULL значение из списка аргументов? (одно имя, заглавными или строчными)',
                accepted: ['coalesce', 'COALESCE', 'Coalesce'],
                placeholder: 'имя функции',
                hint: 'Начинается на CO...',
                explanation:
                  'COALESCE(a, b, c, ...) возвращает первое не-NULL. Это стандарт SQL, работает во всех СУБД. В отличие от IFNULL/NVL/ISNULL, принимает любое число аргументов.',
              },
            },
          ],
        },
        {
          id: 'qa-l34',
          title: 'Подзапросы: IN, EXISTS, скалярные',
          minutes: 30,
          steps: [
            {
              id: 'qa-l34-s1',
              title: 'Скалярный подзапрос',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Скалярный подзапрос возвращает одно значение (одна строка, одна колонка). Используется как обычное значение в SELECT, WHERE или HAVING.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы выше среднего чека',
                  code: 'SELECT id, total\nFROM orders\nWHERE total > (SELECT AVG(total) FROM orders)\nORDER BY total DESC;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'В SELECT: добавить среднее к каждой строке',
                  code: 'SELECT\n    id,\n    total,\n    (SELECT AVG(total) FROM orders) AS avg_total,\n    total - (SELECT AVG(total) FROM orders) AS diff\nFROM orders\nORDER BY diff DESC;',
                },
                {
                  type: 'note',
                  text: 'Скалярный подзапрос в SELECT выполняется для каждой строки — это может быть медленно. В WHERE — один раз (если не коррелированный). Для тестировщика это не критично, но знать полезно.',
                },
              ],
            },
            {
              id: 'qa-l34-s2',
              title: 'IN и NOT IN',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'IN принимает список или подзапрос. Подзапрос должен возвращать одну колонку. Логика: «значение есть во множестве». NOT IN — наоборот.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи, у которых есть оплаченные заказы',
                  code: 'SELECT id, email\nFROM users\nWHERE id IN (\n    SELECT user_id FROM orders WHERE status = \'paid\'\n);',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи, у которых НЕТ отменённых заказов',
                  code: 'SELECT id, email\nFROM users\nWHERE id NOT IN (\n    SELECT user_id FROM orders WHERE status = \'cancelled\'\n);',
                },
                {
                  type: 'note',
                  text: 'ЛОВУШКА NOT IN с NULL. Если подзапрос вернёт хотя бы один NULL, NOT IN вернёт пустой результат. Пример: NOT IN (SELECT user_id FROM orders) — если есть заказ с user_id = NULL, то НИ ОДИН пользователь не попадёт в результат. Всегда проверяйте: либо WHERE user_id IS NOT NULL в подзапросе, либо используйте NOT EXISTS.',
                },
              ],
            },
            {
              id: 'qa-l34-s3',
              title: 'EXISTS и NOT EXISTS',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'EXISTS проверяет, что подзапрос возвращает хотя бы одну строку. Возвращает true/false. Это коррелированный подзапрос: он ссылается на текущую строку внешнего запроса.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи с хотя бы одним заказом',
                  code: 'SELECT u.id, u.email\nFROM users u\nWHERE EXISTS (\n    SELECT 1 FROM orders o WHERE o.user_id = u.id\n);',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Пользователи без заказов (анти-join через NOT EXISTS)',
                  code: 'SELECT u.id, u.email\nFROM users u\nWHERE NOT EXISTS (\n    SELECT 1 FROM orders o WHERE o.user_id = u.id\n);',
                },
                {
                  type: 'table',
                  caption: 'IN vs EXISTS: что выбрать',
                  head: ['Ситуация', 'Лучше'],
                  rows: [
                    ['Подзапрос возвращает мало строк', 'IN (проще читается)'],
                    ['Подзапрос возвращает много строк', 'EXISTS (быстрее)'],
                    ['Есть подозрение на NULL в подзапросе', 'EXISTS (безопаснее)'],
                    ['Нужно проверить существование, а не значение', 'EXISTS (семантически точнее)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'SELECT 1 в EXISTS — не случайность. Значение не используется, важно только «есть ли строка». Можно писать SELECT * — результат тот же, но SELECT 1 явно показывает намерение.',
                },
              ],
            },
            {
              id: 'qa-l34-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему NOT IN (SELECT user_id FROM orders) может вернуть пустой результат, хотя заказы есть?',
                options: [
                  { id: 'a', text: 'NOT IN не работает с подзапросами' },
                  { id: 'b', text: 'Потому что в подзапросе есть NULL: NOT IN с NULL всегда даёт пусто' },
                  { id: 'c', text: 'Нужно использовать NOT EXISTS вместо NOT IN' },
                  { id: 'd', text: 'Подзапрос должен быть в кавычках' },
                ],
                correct: ['b'],
                explanation:
                  'NOT IN (1, 2, NULL) эквивалентно x != 1 AND x != 2 AND x != NULL. Последнее всегда NULL (не true), значит вся конъюнкция false → ни одна строка не пройдёт. Решение: NOT EXISTS или WHERE user_id IS NOT NULL в подзапросе.',
              },
            },
          ],
        },
        {
          id: 'qa-l35',
          title: 'Практика: типичные запросы тестировщика',
          minutes: 30,
          steps: [
            {
              id: 'qa-l35-s1',
              title: 'Поиск аномалий и «плохих» данных',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Самая частая практическая задача — найти данные, которые не должны существовать. Дубли, отрицательные суммы, «висячие» связи. Вот готовые шаблоны.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Дубли по email',
                  code: 'SELECT email, COUNT(*) AS cnt\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY cnt DESC;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы с отрицательной суммой или NULL в обязательном поле',
                  code: 'SELECT id, total, status\nFROM orders\nWHERE total < 0\n   OR total IS NULL\n   OR status IS NULL;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы без позиций (order_items)',
                  code: 'SELECT o.id, o.status, o.total\nFROM orders o\nLEFT JOIN order_items oi ON oi.order_id = o.id\nWHERE oi.id IS NULL;',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Заказы, привязанные к несуществующему пользователю',
                  code: '-- Должно быть 0 строк, если FK работает\nSELECT o.id, o.user_id\nFROM orders o\nLEFT JOIN users u ON u.id = o.user_id\nWHERE u.id IS NULL;',
                },
                {
                  type: 'note',
                  text: 'Первый и четвёртый запросы стоит держать в чек-листе «проверка данных после миграции». Если после миграции они возвращают строки — что-то сломалось. Мини-набор data-integrity проверок.',
                },
              ],
            },
            {
              id: 'qa-l35-s2',
              title: 'Сверка: UI / API / БД',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Классическая проверка: сумма из UI = сумма из API = сумма из БД. Для этого SQL-запрос должен восстановить то, что видит пользователь.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Итоговая сумма заказа по позициям',
                  code: 'SELECT\n    o.id,\n    o.total                    AS stored_total,\n    SUM(oi.quantity * oi.price) AS computed_total,\n    o.total - SUM(oi.quantity * oi.price) AS diff\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.id\nGROUP BY o.id, o.total\nHAVING o.total != SUM(oi.quantity * oi.price);\n-- Если есть строки — сумма в заказе не совпадает с суммой позиций. Это баг.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'История статусов: заказы, которые «прыгнули» через статус',
                  code: '-- Если бы была таблица order_status_history (order_id, status, changed_at):\nSELECT\n    o.id,\n    MAX(CASE WHEN h.status = \'paid\'      THEN h.changed_at END) AS paid_at,\n    MAX(CASE WHEN h.status = \'shipped\'   THEN h.changed_at END) AS shipped_at\nFROM orders o\nJOIN order_status_history h ON h.order_id = o.id\nGROUP BY o.id\nHAVING MAX(CASE WHEN h.status = \'paid\' THEN 1 ELSE 0 END) = 0\n   AND MAX(CASE WHEN h.status = \'shipped\' THEN 1 ELSE 0 END) = 1;\n-- Заказы, которые отправились, не будучи оплаченными',
                },
                {
                  type: 'note',
                  text: 'Запросы «UI vs БД» — половина работы тестировщика с SQL. Сравните число, найденное в UI, с результатом SELECT SUM(...). Если расходятся — баг в коде, который пишет в БД, или в коде, который читает.',
                },
              ],
            },
            {
              id: 'qa-l35-s3',
              title: 'CTE (WITH): читаемость вместо вложенности',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда подзапросов становится 2–3, запрос превращается в матрёшку. CTE (Common Table Expression) выносит каждый подзапрос в именованный блок WITH — читается сверху вниз, как обычный код.',
                },
                {
                  type: 'code',
                  lang: 'sql',
                  caption: 'Топ-3 клиента по выручке с их последним заказом',
                  code: 'WITH paid_totals AS (\n    SELECT user_id, SUM(total) AS revenue\n    FROM orders\n    WHERE status = \'paid\'\n    GROUP BY user_id\n),\ntop_users AS (\n    SELECT user_id, revenue\n    FROM paid_totals\n    ORDER BY revenue DESC\n    LIMIT 3\n)\nSELECT\n    u.email,\n    tu.revenue,\n    (SELECT MAX(created_at) FROM orders WHERE user_id = tu.user_id) AS last_order\nFROM top_users tu\nJOIN users u ON u.id = tu.user_id\nORDER BY tu.revenue DESC;',
                },
                {
                  type: 'p',
                  text: 'Читается как рецепт: «сначала посчитали выручку по клиентам (paid_totals), потом взяли топ-3 (top_users), потом соединили с users». Такой запрос проще отлаживать: каждый CTE можно запустить отдельно.',
                },
                {
                  type: 'list',
                  items: [
                    'WITH name AS (...) — именованный подзапрос',
                    'Несколько CTE разделяются запятыми',
                    'CTE видит предыдущие CTE: top_users может использовать paid_totals',
                    'CTE можно использовать в JOIN, в подзапросах, в других CTE',
                    'Рекурсивные CTE (WITH RECURSIVE) — для иерархий (дерево категорий, оргструктура)',
                  ],
                },
              ],
            },
            {
              id: 'qa-l35-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте задачу тестировщика и SQL-подход',
                pairs: [
                  { left: 'Найти дубли по email', right: 'GROUP BY email HAVING COUNT(*) > 1' },
                  { left: 'Найти заказы без позиций', right: 'LEFT JOIN order_items WHERE oi.id IS NULL' },
                  { left: 'Сверить сумму заказа с суммой позиций', right: 'SUM(quantity * price) + HAVING diff != 0' },
                  { left: 'Пользователи без заказов', right: 'NOT EXISTS или LEFT JOIN WHERE o.id IS NULL' },
                ],
                explanation:
                  'Четыре классических паттерна: группировка+HAVING для дублей, LEFT JOIN + IS NULL для «сирот», SUM + HAVING для сверки итогов, анти-join для «кого нет». Эти четыре конструкции покрывают 80% проверок данных.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Нагрузочное тестирование (было qa-m10)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m5',
      title: 'Нагрузочное тестирование',
      lessons: [
        {
          id: 'qa-l36',
          title: 'Зачем и какие бывают нагрузочные тесты',
          minutes: 25,
          steps: [
            {
              id: 'qa-l36-s1',
              title: 'Пять видов нагрузочных тестов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '«Нагрузочное тестирование» — общее слово для пяти разных сценариев. На собеседовании почти всегда просят назвать их и объяснить разницу. Это первое, что отличает «читал статью» от «реально делал».',
                },
                {
                  type: 'mermaid',
                  caption: 'Пять видов нагрузочных тестов',
                  code: `graph LR
                    Load["Load<br/>постоянная нагрузка<br/>30–60 мин"]
                    Stress["Stress<br/>растём до предела"]
                    Spike["Spike<br/>0→1000 за 10 сек"]
                    Soak["Soak<br/>8–24 часа"]
                    Smoke["Smoke<br/>10–50 users, 5 мин"]`
                },
                {
                  type: 'p',
                  text: 'Load — основной тест: проверяет, что система справляется с ожидаемой нагрузкой. Stress — находит точку, где всё ломается, и смотрит, восстанавливается ли система. Spike — имитация «Чёрной пятницы»: что будет, если за 10 секунд придёт в 10 раз больше пользователей. Soak — ловит утечки памяти, накопление соединений, деградацию за часы.',
                },
                {
                  type: 'note',
                  text: 'На собеседовании спросят: «Чем stress отличается от spike?». Ответ: stress — постепенное увеличение до предела (плавно упираемся в стену). Spike — резкий скачок (проверяем автовосстановление). Оба важны, но по-разному.',
                },
              ],
            },
            {
              id: 'qa-l36-s2',
              title: 'Что НЕ надо тестировать нагрузкой',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Нагрузочное тестирование — дорогое: требует стенда, сопоставимого с продом, времени на прогон и разбор. Поэтому его делают не «для всего подряд».',
                },
                {
                  type: 'list',
                  items: [
                    'НЕ нужно: проверять UI-анимации, вёрстку, цвета — нагрузка не про это',
                    'НЕ нужно: гонять нагрузку на dev-стенде с 1 vCPU — результаты бессмысленны',
                    'НЕ нужно: имитировать нагрузку с одной машины — упрётесь в лимиты клиента',
                    'НЕ нужно: делать нагрузочный тест на каждый PR — только перед релизом или после крупных изменений',
                    'НЕ нужно: гонять нагрузку без baseline — не с чем сравнивать',
                  ],
                },
                {
                  type: 'note',
                  text: 'Нагрузочный стенд должен быть похож на прод: те же ресурсы (CPU, RAM, диск), та же БД, тот же объём данных. Иначе цифры не имеют смысла. «У меня на ноутбуке 100 RPS» — не аргумент для прода.',
                },
              ],
            },
            {
              id: 'qa-l36-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие виды нагрузочных тестов проверяют восстановление системы после перегрузки?',
                options: [
                  { id: 'a', text: 'Stress — система должна вернуться в норму после спада' },
                  { id: 'b', text: 'Smoke — базовая проверка' },
                  { id: 'c', text: 'Spike — проверка автовосстановления после пика' },
                  { id: 'd', text: 'Soak — проверка утечек за часы' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'Stress и spike важны не только «выдержит ли», но и «как падает и восстанавливается». Хорошая система после перегрузки возвращается в норму за секунды, плохая — остаётся в деградации. Smoke и soak проверяют другое.',
              },
            },
          ],
        },
        {
          id: 'qa-l37',
          title: 'Метрики: RPS, latency, p95/p99, Little\u2019s Law',
          minutes: 35,
          steps: [
            {
              id: 'qa-l37-s1',
              title: 'RPS и latency',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Две главные метрики нагрузки: сколько запросов в секунду система обрабатывает (RPS / throughput) и сколько времени уходит на один запрос (latency / response time). На собеседовании это спросят первым делом.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Основные метрики',
                  code: 'RPS (Requests Per Second)   — сколько запросов в секунду обрабатывается\nTPS (Transactions Per Second) — то же для бизнес-транзакций (один «заказ» = 5 HTTP-запросов)\nLatency (Response Time)     — время ответа на ОДИН запрос, в мс\nThroughput                  — сколько данных/операций в единицу времени\nError Rate                  — доля неуспешных ответов, в % (5xx, таймауты)',
                },
                {
                  type: 'note',
                  text: 'RPS и latency — связаны: при постоянном числе одновременных пользователей рост latency ведёт к падению RPS. Нельзя «просто добавить пользователей» — упираешься в обработку. Об этом — Little\'s Law ниже.',
                },
              ],
            },
            {
              id: 'qa-l37-s2',
              title: 'Почему среднее врёт: p95 и p99',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Средняя latency — самая обманчивая метрика. Пример: 100 запросов, 99 по 100 мс, 1 запрос по 10 000 мс. Среднее = 199 мс. «Всё отлично!» — но 1% пользователей ждут 10 секунд и уходят.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Перцентили на том же примере',
                  code: 'p50 (медиана)   = 100 мс   — половина пользователей быстрее\np90             = 100 мс   — 90% быстрее\np95             = 100 мс   — 95% быстрее\np99             = 10 000 мс — 1% ждут 10 секунд\nСреднее         = 199 мс   — «обманчивая» цифра',
                },
                {
                  type: 'list',
                  items: [
                    'p50 — типичный пользователь: если он медленный, всё плохо',
                    'p95 — «медленный хвост»: сюда попадают почти все реальные проблемы',
                    'p99 — экстремалы: чаще всего это тяжёлые запросы, долгие операции',
                    'p99.9 — уже редко используется вне высоконагруженных систем (Google, Netflix)',
                    'Среднее НЕ ИСПОЛЬЗУЙТЕ: оно прячет проблемы в хвосте',
                  ],
                },
                {
                  type: 'note',
                  text: 'На собеседовании спросят: «Что важнее — p50 или p99?». Правильный ответ: зависит от контекста. Для обычного сайта — p95 (5% пользователей уже значимо). Для платёжной системы — p99 (1% = миллионы). Никогда — среднее.',
                },
              ],
            },
            {
              id: 'qa-l37-s3',
              title: 'Little\u2019s Law: связь пользователей, RPS и latency',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Закон Литтла — фундаментальная формула теории массового обслуживания. На собеседовании её любят. Без неё нельзя понять, почему «добавили пользователей, а RPS не вырос».',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Little\u2019s Law',
                  code: 'L = λ × W\n\nL — среднее число одновременных пользователей (concurrent users)\nλ — RPS (throughput, запросов в секунду)\nW — среднее время ответа (latency, в секундах)',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Примеры',
                  code: 'Система обрабатывает 100 RPS, latency = 200 мс (0.2 сек):\n  L = 100 × 0.2 = 20 одновременных пользователей\n\nМы хотим 1000 RPS при той же latency 200 мс:\n  L = 1000 × 0.2 = 200 одновременных пользователей\n  (нужны ресурсы на 200, а не на 20)\n\nЕсли RPS = 50, а latency выросла до 1 сек:\n  L = 50 × 1 = 50 пользователей одновременно\n  (latency выросла — значит, стало больше «в полёте»)',
                },
                {
                  type: 'p',
                  text: 'Из закона следуют выводы, которые спасают на собеседованиях:',
                },
                {
                  type: 'list',
                  items: [
                    'Хотите удвоить RPS при той же latency — нужно вдвое больше «пользователей в полёте» и вдвое больше ресурсов',
                    'Упала latency — при том же числе пользователей вырастет RPS',
                    'Нагрузочный тест задаёт concurrent users, а RPS получается сам — не наоборот',
                    '«Добавили 1000 пользователей, RPS не вырос» = упёрлись в bottleneck (БД, CPU, диск)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Формула Литтла работает для стабильной системы. Если система в деградации — очередь растёт нелинейно, и формула перестаёт предсказывать. Именно поэтому стресс-тест «ломает» систему резко, а не плавно.',
                },
              ],
            },
            {
              id: 'qa-l37-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Система обрабатывает 200 RPS, средняя latency 0.5 сек. Сколько одновременных пользователей по Little\u2019s Law? (только число)',
                accepted: ['100', '100 пользователей'],
                placeholder: 'число',
                hint: 'L = λ × W',
                explanation:
                  'L = 200 × 0.5 = 100. То есть при 200 запросах в секунду и полусекундном ответе «в полёте» одновременно находится 100 запросов. Это и есть concurrent users.',
              },
            },
          ],
        },
        {
          id: 'qa-l38',
          title: 'Инструменты: JMeter, k6, Locust',
          minutes: 25,
          steps: [
            {
              id: 'qa-l38-s1',
              title: 'Четыре инструмента и когда что',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Инструмент', 'Язык', 'Плюсы', 'Минусы'],
                  rows: [
                    ['JMeter', 'Java (GUI)', 'Стандарт индустрии, GUI, плагины, отчёты', 'Тяжёлый, GUI тормозит, «клик-клик» вместо кода'],
                    ['k6', 'JavaScript', 'Современный, CLI-first, отличные отчёты, friendly к разработчикам', 'Только JS, экосистема меньше'],
                    ['Locust', 'Python', 'Код вместо GUI, легко расширить, распределённый из коробки', 'Меньше готовых отчётов, нужен Python'],
                    ['Gatling', 'Scala', 'Очень быстрый, красивый отчёт HTML', 'Только Scala (высокий порог для тестировщика)'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Для тестировщика с Python — Locust оптимален: пишете сценарий как обычный Python-код, легко параметризовать, встроенный веб-интерфейс с графиками. k6 — если команда JS. JMeter — если в компании он уже стандарт, или нужен GUI для нетехнических коллег.',
                },
                {
                  type: 'note',
                  text: 'На собеседовании часто спрашивают: «Каким инструментом вы работали?». Правильный ответ — назвать 1–2 и объяснить, чем они отличаются. «Работал с JMeter и k6, выбирал k6 за code-first подход» звучит лучше, чем «только слышал про JMeter».',
                },
              ],
            },
            {
              id: 'qa-l38-s2',
              title: 'Архитектура нагрузочного теста',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Любой нагрузочный тест — это три компонента, которые надо продумать ДО запуска. Без этого получите цифры, которым нельзя верить.',
                },
                {
                  type: 'list',
                  items: [
                    'Профиль нагрузки (load profile): сколько пользователей, за сколько секунд ramp-up, сколько держим плато, за сколько гасим',
                    'Сценарий (user scenario): что делает виртуальный пользователь — логин, поиск, оформление заказа',
                    'Данные (test data): уникальные пользователи, товары, промокоды — чтобы не упереться в БД на одинаковых данных',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичный профиль нагрузки',
                  code: 'Ramp-up:  0 → 500 пользователей за 60 секунд   (плавно)\nPlateau:  500 пользователей 30 минут             (основной замер)\nRamp-down: 500 → 0 за 30 секунд                   (плавно)\n\nЗамер метрик: только на плато (ramp-up и down искажают)\nОшибки:      5xx считаем, 4xx (валидация) — по сценарию',
                },
                {
                  type: 'note',
                  text: 'Ramp-up — критичен. Если «вбросить» 500 пользователей за секунду — получите spike, а не load-тест. Плавный ramp-up даёт системе прогреться (JIT, кэши, connection pool). На собеседовании это любят спрашивать.',
                },
              ],
            },
            {
              id: 'qa-l38-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая метрика надёжнее всего покажет, что «медленные пользователи страдают»?',
                options: [
                  { id: 'a', text: 'Средняя latency' },
                  { id: 'b', text: 'p95 или p99 latency' },
                  { id: 'c', text: 'RPS' },
                  { id: 'd', text: 'Error rate' },
                ],
                correct: ['b'],
                explanation:
                  'p95 показывает, что 5% пользователей медленнее указанного значения. Среднее прячет хвост: 100 мс среднее при 1% запросов по 10 сек — это «всё хорошо» по среднему и «катастрофа» для тех 1%.',
              },
            },
          ],
        },
        {
          id: 'qa-l39',
          title: 'Locust на практике',
          minutes: 30,
          steps: [
            {
              id: 'qa-l39-s1',
              title: 'Первый нагрузочный тест',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка',
                  code: 'pip install locust',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'locustfile.py — простейший сценарий',
                  code: 'from locust import HttpUser, task, between\n\nclass WebsiteUser(HttpUser):\n    wait_time = between(1, 3)   # пауза между задачами 1–3 сек\n\n    @task(3)                    # вес 3 — выполняется в 3 раза чаще\n    def view_homepage(self):\n        self.client.get("/")\n\n    @task(1)\n    def view_product(self):\n        self.client.get("/products/1")\n\n    def on_start(self):\n        # выполняется один раз в начале для каждого пользователя\n        self.client.post("/login", json={"email": "test@example.com", "password": "secret"})',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск',
                  code: '# С веб-интерфейсом (http://localhost:8089)\nlocust -f locustfile.py --host=https://staging.example.com\n\n# Headless, для CI\nlocust -f locustfile.py \\\n  --host=https://staging.example.com \\\n  --users=500 --spawn-rate=10 --run-time=30m \\\n  --headless --csv=result',
                },
                {
                  type: 'list',
                  items: [
                    'HttpUser — виртуальный пользователь, у каждого свой session',
                    'wait_time = between(1, 3) — пауза между задачами (реалистичнее, чем «долбить нон-стоп»)',
                    '@task(weight) — вес: 3 значит в 3 раза чаще, чем вес 1',
                    'on_start — один раз при старте (логин, прогрев)',
                    '--users=500 --spawn-rate=10 — 500 пользователей, по 10 в секунду (ramp-up 50 сек)',
                  ],
                },
              ],
            },
            {
              id: 'qa-l39-s2',
              title: 'Параметризация и реалистичные сценарии',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Разные пользователи, разные данные',
                  code: 'import random\nfrom locust import HttpUser, task, between, SequentialTaskSet\n\nclass UserFlow(SequentialTaskSet):\n    """Последовательный сценарий: логин → поиск → заказ"""\n\n    def on_start(self):\n        self.email = f"user{random.randint(1, 100000)}@test.com"\n        self.client.post("/api/auth/register", json={\n            "email": self.email,\n            "password": "secret123",\n        })\n        resp = self.client.post("/api/auth/login", json={\n            "email": self.email, "password": "secret123",\n        })\n        self.token = resp.json()["token"]\n\n    @task\n    def search_products(self):\n        self.client.get(\n            "/api/products/search",\n            params={"q": random.choice(["iphone", "laptop", "book"])},\n            headers={"Authorization": f"Bearer {self.token}"},\n        )\n\n    @task\n    def create_order(self):\n        self.client.post(\n            "/api/orders",\n            json={\n                "items": [{"product_id": random.randint(1, 100), "qty": 1}],\n                "promo": random.choice([None, "SAVE10", "WELCOME"]),\n            },\n            headers={"Authorization": f"Bearer {self.token}"},\n        )\n\nclass WebsiteUser(HttpUser):\n    wait_time = between(1, 5)\n    tasks = [UserFlow]',
                },
                {
                  type: 'list',
                  items: [
                    'SequentialTaskSet — задачи идут по порядку (как в жизни), а не случайно',
                    'random.randint для уникальных email — иначе БД задушится уникальным индексом',
                    'Разные q для поиска — разные запросы, разные индексы БД',
                    'promo: None / "SAVE10" / "WELCOME" — разные ветки бизнес-логики',
                    'Каждый виртуальный пользователь = отдельный токен, отдельная сессия',
                  ],
                },
                {
                  type: 'note',
                  text: 'Главная ошибка новичков — все 500 пользователей логинятся одним и тем же test@example.com. Это создаёт contention на одной строке БД, и нагрузка получается нереалистичной. Уникальные данные — обязательны.',
                },
              ],
            },
            {
              id: 'qa-l39-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в нагрузочном тесте нужен ramp-up (постепенный старт)?',
                options: [
                  { id: 'a', text: 'Чтобы сэкономить время теста' },
                  { id: 'b', text: 'Чтобы система прогрелась и не было эффекта spike' },
                  { id: 'c', text: 'Чтобы уменьшить нагрузку' },
                  { id: 'd', text: 'Так требует Locust' },
                ],
                correct: ['b'],
                explanation:
                  'При резком старте 500 пользователей — это spike: система не успевает прогреться (JIT, connection pool, кэши), получаете «ломается сразу». Ramp-up даёт системе прогреться и измеряет поведение на плато, а не переход.',
              },
            },
          ],
        },
        {
          id: 'qa-l40',
          title: 'Анализ результатов и узкие места',
          minutes: 30,
          steps: [
            {
              id: 'qa-l40-s1',
              title: 'Как читать результаты нагрузочного теста',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Запустить тест — половина. Вторая половина — понять, что показали цифры, и найти узкое место. На собеседовании часто дают кейс: «RPS перестал расти, latency растёт. Что делать?».',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичный отчёт Locust (CSV)',
                  code: 'Type   Name              # reqs   # fails   Avg   p50   p95   p99   RPS\nGET    /                  12345     0 (0%)   45    40    80    150   45.2\nGET    /products          8901      12 (0.1%) 120   90    280   450   32.5\nPOST   /api/orders        1523      45 (3%)   850   600   2100  3500  5.6',
                },
                {
                  type: 'p',
                  text: 'Что видно: главная страница быстрая (p95 = 80 мс), товары медленнее (p95 = 280 мс), а создание заказа — катастрофа (p95 = 2.1 сек, 3% ошибок). Именно `/api/orders` — узкое место. Дальше ищем, что там: тяжёлый SQL, вызов внешнего API, блокировки.',
                },
                {
                  type: 'list',
                  items: [
                    'Высокий error rate (> 1%) — сразу смотреть логи и 5xx: таймауты, OOM, дедлоки',
                    'Растущая latency при стабильном RPS — упёрлись в bottleneck',
                    'Падающий RPS при стабильных пользователях — система в деградации (GC, утечки)',
                    'Ровный RPS с ростом p99 — «медленные хвосты»: тяжёлые запросы, полные сканы БД',
                    'p99 намного больше p95 — есть отдельный «жирный» запрос (например, экспорт)',
                  ],
                },
              ],
            },
            {
              id: 'qa-l40-s2',
              title: 'Где искать узкое место',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Нагрузка упирается в 4 базовых ресурса: CPU, память, диск, сеть. Плюс внешние зависимости (БД, кэш, сторонние API). Тестировщику не надо чинить — надо найти и передать разработчику с доказательствами.',
                },
                {
                  type: 'table',
                  caption: 'Симптом → где искать',
                  head: ['Симптом', 'Вероятная причина'],
                  rows: [
                    ['CPU 100% на app-сервере', 'Тяжёлые вычисления, неэффективный код, отсутствие кэша'],
                    ['CPU низкая, latency растёт', 'I/O wait: БД, диск, внешний API'],
                    ['CPU растёт после каждого теста', 'Утечка памяти, неэффективный GC'],
                    ['Много ошибок 5xx, в логах timeout', 'БД не справляется, connection pool исчерпан'],
                    ['RPS падает после часа теста', 'Утечка соединений, накопление логов, деградация кэша'],
                    ['p99 в 10 раз больше p95', 'Отдельный тяжёлый запрос (экспорт, отчёт)'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Диагностика узких мест по метрикам',
                  code: `graph TD
                    Q{"CPU app<br/>сервера?"} -->|"100%"| CPU["Код: тяжёлые<br/>вычисления"]
                    Q -->|"< 50%"| IO{"Latency<br/>растёт?"}
                    IO -->|"Да"| IOWait["I/O wait:<br/>БД, диск, API"]
                    IO -->|"Нет"| OK["Всё в норме"]
                    CPU --> Fix1["Профилировать,<br/>кэшировать"]
                    IOWait --> Fix2["Оптимизировать<br/>SQL, добавить индекс"]`
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Инструменты для поиска bottleneck (тестировщику достаточно знать, что они есть)',
                  code: 'app-сервер:   top, htop, vmstat, iostat, dstat\nБД:           pg_stat_statements (PostgreSQL), slow query log (MySQL)\nAPM:          New Relic, Datadog, Grafana + Prometheus\nПрофилировщик: py-spy (Python), async-profiler (Java)\nСеть:         iftop, nethogs',
                },
                {
                  type: 'note',
                  text: 'Тестировщику важно уметь отличить «проблема в БД» от «проблема в коде» по симптомам. Если CPU app-сервера 100% — код. Если CPU низкая, но latency растёт — БД или сеть. Это простой и рабочий эвристический приём.',
                },
              ],
            },
            {
              id: 'qa-l40-s3',
              title: 'Нагрузочный тест в CI',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions: нагрузочный тест перед релизом',
                  code: 'name: load-test\non:\n  workflow_dispatch:\n  schedule:\n    - cron: \'0 2 * * *\'   # каждую ночь\n\njobs:\n  load:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install locust\n      - name: Run load test\n        run: |\n          locust -f locustfile.py \\\n            --host=${{ secrets.STAGING_URL }} \\\n            --users=500 --spawn-rate=10 --run-time=15m \\\n            --headless --csv=report --html=report.html\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: load-report\n          path: report.*\n      - name: Check SLO\n        run: |\n          python scripts/check_slo.py report_stats.csv \\\n            --max-p95 500 --max-error-rate 0.01',
                },
                {
                  type: 'p',
                  text: 'Ключевой шаг — «Check SLO». Load-тест должен не просто отработать, а упасть с exit code ≠ 0, если p95 или error rate превысили порог. Иначе он превращается в «красивый отчёт, который никто не читает».',
                },
                {
                  type: 'list',
                  items: [
                    'SLO (Service Level Objective) — численный порог: p95 ≤ 500 мс, error rate ≤ 1%',
                    'Скрипт check_slo.py парсит CSV и падает с exit code 1 при превышении',
                    'Только так нагрузочный тест реально защищает прод',
                    'Ночной прогон — стандарт: не мешает разработке, отчёт утром',
                  ],
                },
                {
                  type: 'note',
                  text: 'Не запускайте полноценный нагрузочный тест на каждый PR — это дорого и медленно. Для PR — smoke (10 пользователей, 1 минута). Полный load — nightly или перед релизом. На собеседовании это тоже спрашивают.',
                },
              ],
            },
            {
              id: 'qa-l40-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'RPS перестал расти, latency p95 растёт, CPU app-сервера 30%. Где искать проблему?',
                options: [
                  { id: 'a', text: 'В коде приложения — добавить больше CPU' },
                  { id: 'b', text: 'В БД или внешнем API — приложение ждёт, а не считает' },
                  { id: 'c', text: 'В сети — уменьшить латентность' },
                  { id: 'd', text: 'Это нормальное поведение — RPS всегда упирается' },
                ],
                correct: ['b'],
                explanation:
                  'CPU низкая, но latency растёт — классический признак I/O wait. Приложение ждёт БД, диск или внешний API. Если бы упирались в CPU — было бы 100%. Это первое, что проверяют при анализе bottleneck.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m6 — Тестирование безопасности (было qa-m11)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m6',
      title: 'Тестирование безопасности',
      lessons: [
        {
          id: 'qa-l41',
          title: 'OWASP Top 10',
          minutes: 30,
          steps: [
            {
              id: 'qa-l41-s1',
              title: 'Что такое OWASP и зачем Top 10',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'OWASP (Open Worldwide Application Security Project) — некоммерческая организация, которая публикует открытые материалы по безопасности. Главный из них — OWASP Top 10: список десяти самых критичных рисков веб-приложений. Обновляется раз в 3–4 года, последняя версия — 2021.',
                },
                {
                  type: 'p',
                  text: 'OWASP Top 10 — это НЕ «полный список уязвимостей». Это «на что смотреть в первую очередь». На собеседовании попросят назвать 5–7 из списка и объяснить хотя бы одну. Поэтому — запомнить.',
                },
                {
                  type: 'note',
                  text: 'OWASP Top 10 — про веб-приложения. Для API есть OWASP API Security Top 10 (отдельный список, тоже 2023). Для мобильных — OWASP MASVS. Начинайте с веб — он самый частый.',
                },
              ],
            },
            {
              id: 'qa-l41-s2',
              title: 'Десять рисков 2021 года',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'OWASP Top 10 (2021)',
                  head: ['#', 'Категория', 'Суть'],
                  rows: [
                    ['A01', 'Broken Access Control', 'Пользователь получает доступ к тому, что ему нельзя (IDOR, обход авторизации)'],
                    ['A02', 'Cryptographic Failures', 'Слабые алгоритмы, пароли в открытом виде, HTTP вместо HTTPS'],
                    ['A03', 'Injection', 'SQL, NoSQL, OS, LDAP-инъекции — данные интерпретируются как код'],
                    ['A04', 'Insecure Design', 'Ошибки в архитектуре (не в коде): отсутствие rate limiting, слабая модель угроз'],
                    ['A05', 'Security Misconfiguration', 'Дефолтные пароли, открытые отладочные эндпоинты, лишние сервисы'],
                    ['A06', 'Vulnerable and Outdated Components', 'Устаревшие версии библиотек с известными CVE'],
                    ['A07', 'Identification and Authentication Failures', 'Слабые пароли, отсутствие MFA, слабая логика логина'],
                    ['A08', 'Software and Data Integrity Failures', 'Неподписанные обновления, доверие к данным из CI/CD'],
                    ['A09', 'Security Logging and Monitoring Failures', 'Атаки не логируются, нет оповещений'],
                    ['A10', 'Server-Side Request Forgery (SSRF)', 'Сервер по запросу пользователя делает HTTP-запрос во внутреннюю сеть'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Что изменилось с 2017: Broken Access Control вырвался с 5-го на 1-е место. Добавились Insecure Design (A04), Integrity Failures (A08), SSRF (A10). XSS «растворился» внутри Injection. Ушёл «XML External Entities» (XXE) — его перевели в категорию «для продвинутых».',
                },
                {
                  type: 'note',
                  text: 'На собеседовании: «Что было на первом месте в OWASP Top 10 2021?» — Broken Access Control. Это не инъекции! Многие ошибаются, потому что привыкли думать про SQLi и XSS. Авторизация — самая частая и опасная дыра.',
                },
              ],
            },
            {
              id: 'qa-l41-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая категория стоит на первом месте в OWASP Top 10 2021?',
                options: [
                  { id: 'a', text: 'Injection (SQL, XSS)' },
                  { id: 'b', text: 'Broken Access Control' },
                  { id: 'c', text: 'Cryptographic Failures' },
                  { id: 'd', text: 'Security Misconfiguration' },
                ],
                correct: ['b'],
                explanation:
                  'Broken Access Control. Это изменение относительно 2017 года, когда инъекции были #1. Авторизация — самая частая дыра: пользователи получают доступ к чужим данным через смену ID, обход проверок и т.д.',
              },
            },
          ],
        },
        {
          id: 'qa-l42',
          title: 'SQL-инъекции',
          minutes: 30,
          steps: [
            {
              id: 'qa-l42-s1',
              title: 'Как работает SQLi',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'SQL-инъекция — это когда пользовательский ввод интерпретируется как SQL-код. Происходит, когда запрос «склеивается» из строк вместо использования параметров.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Уязвимый код (псевдокод)',
                  code: '# Python с psycopg2 — плохо\nemail = request.form["email"]\nquery = f"SELECT * FROM users WHERE email = \'{email}\'"\ncursor.execute(query)\n\n# Пользователь вводит: \' OR \'1\'=\'1\' --\n# Итоговый запрос:\n# SELECT * FROM users WHERE email = \'\' OR \'1\'=\'1\' --\'\n# Возвращает ВСЕХ пользователей',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Безопасный код',
                  code: '# Параметризованный запрос — хорошо\nemail = request.form["email"]\ncursor.execute(\n    "SELECT * FROM users WHERE email = %s",\n    (email,),\n)\n# Ввод всегда экранируется, даже если содержит кавычки или "OR 1=1"',
                },
                {
                  type: 'list',
                  items: [
                    'Проверьте поля: логин, поиск, регистрация — все, где ввод идёт в БД',
                    'Простые полезные нагрузки для проверки: \' OR \'1\'=\'1\', \'; DROP TABLE users; --, " OR 1=1 --',
                    'Опасный признак: 500-я ошибка с текстом «SQL syntax error» — значит, запрос ушёл в БД',
                    'Если ошибок нет, но результат странный — тоже подозрительно',
                    'Лучший способ проверки — инструмент, а не вручную: SQLMap (см. урок 47)',
                  ],
                },
                {
                  type: 'note',
                  text: 'SQLi в 2025 всё ещё жив. По OWASP — часть категории A03 Injection. Причина — код, где запросы строятся через f-strings или конкатенацию. Лечится всегда параметризованными запросами или ORM — никакой магии.',
                },
              ],
            },
            {
              id: 'qa-l42-s2',
              title: 'Виды и нагрузка',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три вида SQLi',
                  head: ['Вид', 'Как работает', 'Пример'],
                  rows: [
                    ['In-band (классическая)', 'Результат сразу виден в ответе', '\' OR \'1\'=\'1\' -- возвращает все строки'],
                    ['Blind (слепая)', 'Ответа не видно, но можно задавать true/false вопросы', 'AND SUBSTRING(username,1,1) = \'a\''],
                    ['Out-of-band', 'Данные выгружаются через DNS/HTTP', 'EXTRACTVALUE через внешний сервер'],
                  ],
                },
                {
                  type: 'p',
                  text: 'На собеседовании: «Чем blind SQLi отличается от обычной?». Ответ: при blind результат не возвращается в UI, но можно задавать «да/нет» вопросы через TRUE/FALSE-условия и восстанавливать данные посимвольно. Медленно, но работает.',
                },
                {
                  type: 'note',
                  text: 'Blind SQLi — самый частый случай в реальных API. Возвращается общее «ошибка» без деталей, но запрос всё равно выполняется. Поэтому проверять надо не «выдаёт ли данные», а «ведёт ли себя по-разному при разных нагрузках».',
                },
              ],
            },
            {
              id: 'qa-l42-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как защититься от SQL-инъекций?',
                options: [
                  { id: 'a', text: 'Экранировать кавычки вручную в каждом поле' },
                  { id: 'b', text: 'Использовать параметризованные запросы или ORM' },
                  { id: 'c', text: 'Скрыть сообщения об ошибках БД' },
                  { id: 'd', text: 'Ограничить длину полей ввода' },
                ],
                correct: ['b'],
                explanation:
                  'Параметризованные запросы передают ввод как данные, а не как часть SQL-кода — это единственная надёжная защита. Скрытие ошибок и ограничение длины помогают, но не решают. Ручное экранирование — источник багов.',
              },
            },
          ],
        },
        {
          id: 'qa-l43',
          title: 'XSS: межсайтовый скриптинг',
          minutes: 30,
          steps: [
            {
              id: 'qa-l43-s1',
              title: 'Три вида XSS',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'XSS — когда злоумышленник заставляет браузер жертвы выполнить JavaScript-код. Опасен кражей cookies, токенов, сессий, перенаправлениями, кражи данных форм.',
                },
                {
                  type: 'table',
                  caption: 'Три вида XSS',
                  head: ['Вид', 'Где живёт', 'Пример'],
                  rows: [
                    ['Stored (хранимая)', 'Сохраняется на сервере и показывается всем', 'Комментарий с <script>...</script>'],
                    ['Reflected (отражённая)', 'Возвращается сразу в ответе на запрос', 'Поиск: ?q=<script>alert(1)</script>'],
                    ['DOM-based', 'Выполняется на клиенте, без сервера', 'location.hash → innerHTML'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'html',
                  caption: 'Пример уязвимости',
                  code: '<!-- Уязвимо: вставка пользовательского ввода в innerHTML -->\n<div id="greeting"></div>\n<script>\n  document.getElementById("greeting").innerHTML = location.hash.slice(1);\n</script>\n\n<!-- Жертва открывает:\n     https://example.com/#<img src=x onerror=alert(document.cookie)>\n     И видит куки в alert -->',
                },
                {
                  type: 'list',
                  items: [
                    'Проверяйте поля, которые показываются другим: комментарии, профили, чат, отзывы',
                    'Проверяйте URL-параметры, которые попадают в HTML',
                    'Проверяйте DOM-манипуляции на клиенте (document.write, innerHTML)',
                    'Простые нагрузки: <script>alert(1)</script>, <img src=x onerror=alert(1)>',
                    'XSS работает не только с <script>: <svg>, <iframe>, event-атрибуты (onerror, onload)',
                  ],
                },
              ],
            },
            {
              id: 'qa-l43-s2',
              title: 'Защита и проверка',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'html',
                  caption: 'Три уровня защиты',
                  code: '<!-- 1. Экранирование на выходе (главное!) -->\n<!-- Фреймворки (React, Vue) делают это автоматически -->\n<div>{userInput}</div>   <!-- безопасно -->\n<div dangerouslySetInnerHTML={{__html: userInput}} />   <!-- опасно! -->\n\n<!-- 2. Content Security Policy (CSP) -->\n<meta http-equiv="Content-Security-Policy"\n      content="default-src \'self\'; script-src \'self\'">\n<!-- Запрещает inline-скрипты и внешние источники -->\n\n<!-- 3. HttpOnly cookies -->\nSet-Cookie: session=xxx; HttpOnly; Secure; SameSite=Strict\n<!-- document.cookie не покажет HttpOnly-куки -->',
                },
                {
                  type: 'list',
                  items: [
                    'Экранирование на выходе — главный способ. Вход не надо «чистить» — надо безопасно выводить',
                    'CSP — вторая линия: если XSS проскочил, inline-script не выполнится',
                    'HttpOnly куки — украсть сессию через document.cookie не получится (но XSS всё равно опасен)',
                    'SameSite cookies — защита от CSRF (см. следующий урок)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Проверять XSS надо в контексте. «<script>alert(1)</script>» в поле имени может не сработать (экранируется), но сработает в атрибуте href или в SVG. Реальный XSS-тест — посмотреть, как именно ввод попадает в HTML.',
                },
              ],
            },
            {
              id: 'qa-l43-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры защищают от XSS?',
                options: [
                  { id: 'a', text: 'Экранирование пользовательского ввода при выводе в HTML' },
                  { id: 'b', text: 'Content Security Policy (CSP)' },
                  { id: 'c', text: 'Запрет JavaScript в браузере' },
                  { id: 'd', text: 'Флаг HttpOnly на cookies' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Экранирование — главное. CSP и HttpOnly — оборона в глубину. Запрет JS сломает всё приложение — это не вариант. XSS может эксплуатировать не только <script>, но и <img onerror>, <svg onload> и т.д.',
              },
            },
          ],
        },
        {
          id: 'qa-l44',
          title: 'Broken Access Control и IDOR',
          minutes: 30,
          steps: [
            {
              id: 'qa-l44-s1',
              title: 'Самая частая и опасная дыра',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Broken Access Control (A01 в OWASP 2021) — это про то, что пользователь получает доступ к тому, что ему нельзя. IDOR (Insecure Direct Object Reference) — частный случай: в URL/API есть идентификатор объекта, и его можно подменить.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Пример IDOR',
                  code: 'Пользователь А (id=100) открывает свой профиль:\n  GET /api/users/100/profile\n  → {"id": 100, "email": "a@x.com", "balance": 500}\n\nАтакующий меняет id в URL:\n  GET /api/users/101/profile\n  → {"id": 101, "email": "b@x.com", "balance": 10000}\n\n❌ Если ответ 200 — IDOR. Видим чужой профиль.\n✅ Правильно — 403 Forbidden (или 404, чтобы не раскрывать существование)',
                },
                {
                  type: 'list',
                  items: [
                    'Классический сценарий: /users/123, /orders/456, /invoices/789',
                    'Проверяйте не только profile — заказы, платёжные данные, документы, админские эндпоинты',
                    'Особенно опасно в API: клиент доверяет id из JSON, а сервер не проверяет',
                    'Меняйте id на: чужой, несуществующий, отрицательный, 0, uuid другого пользователя',
                    'Проверяйте не только GET — POST, PUT, DELETE тоже',
                  ],
                },
                {
                  type: 'note',
                  text: 'IDOR — самая частая дыра в реальных API. Часто разработчики проверяют «пользователь залогинен» (аутентификация), но забывают «пользователь имеет право на этот объект» (авторизация). Это разные вещи.',
                },
              ],
            },
            {
              id: 'qa-l44-s2',
              title: 'Как проверять access control',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Чек-лист по access control',
                  code: '1. Горизонтальная эскалация (IDOR):\n   Пользователь А пытается получить доступ к ресурсам пользователя Б\n\n2. Вертикальная эскалация:\n   Обычный пользователь → админские эндпоинты\n   /api/admin/users, /admin/dashboard\n\n3. Обход через параметры:\n   ?role=admin, ?is_admin=true, ?user_id=X\n\n4. Прямые ссылки на файлы:\n   /uploads/document_123.pdf   (можно угадать имя)\n   S3 bucket без подписи\n\n5. Скрытые эндпоинты:\n   UI не показывает, но API доступен\n   (проверять через DevTools → Network на вкладке админа)\n\n6. JWT-манипуляции:\n   Изменить sub / role в токене, попробовать algorithm=none',
                },
                {
                  type: 'p',
                  text: 'Идеальный инструмент — два аккаунта (А и Б) и токены обоих. Берём запросы пользователя А, меняем токен на токен Б. Если ответ 200 с данными А — IDOR. Если 403 — защита работает. Если 404 — тоже приемлемо (не раскрывает существование).',
                },
                {
                  type: 'note',
                  text: 'Access control проверяется на сервере, а не в UI. Если кнопка «Удалить» скрыта для обычных пользователей, но DELETE /api/users/123 доступен — это дыра. Тестировщик всегда проверяет напрямую через API, а не через UI.',
                },
              ],
            },
            {
              id: 'qa-l44-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Пользователь открыл /api/orders/123 и увидел свой заказ. Как проверить IDOR?',
                options: [
                  { id: 'a', text: 'Нажать в UI на другой заказ' },
                  { id: 'b', text: 'Изменить id в URL на 124 и отправить запрос с тем же токеном' },
                  { id: 'c', text: 'Открыть сайт в другом браузере' },
                  { id: 'd', text: 'Перезагрузить страницу' },
                ],
                correct: ['b'],
                explanation:
                  'IDOR проверяется подменой идентификатора в запросе. UI может не показывать чужие заказы, но API может их отдавать. Правильно — менять id через Burp/curl/Postman и смотреть, что вернётся.',
              },
            },
          ],
        },
        {
          id: 'qa-l45',
          title: 'Аутентификация, CSRF, сессии',
          minutes: 30,
          steps: [
            {
              id: 'qa-l45-s1',
              title: 'Что тестировать в аутентификации',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Слабые пароли: принимает ли система «123456», «qwerty»? Есть ли минимальные требования?',
                    'Brute-force: есть ли блокировка после N неудачных попыток? Задержка?',
                    'Перебор логинов: отвечает ли система «пользователь не найден» vs «неверный пароль»? (раскрывает существование)',
                    'Сброс пароля: токен одноразовый? Истекает? Не предсказуем (не 4-значный)?',
                    'MFA: можно ли обойти? Что если ввести неверный код N раз?',
                    'Логаут: инвалидируется ли токен на сервере, или просто удаляется у клиента?',
                    '«Remember me»: что за токен, можно ли его угнать, истекает ли?',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Проверка «пользователь не найден» vs «неверный пароль»',
                  code: 'POST /api/login {"email": "exists@x.com", "password": "wrong"}\n→ 401 {"error": "Invalid password"}       ← раскрывает, что email существует\n\nPOST /api/login {"email": "notexists@x.com", "password": "wrong"}\n→ 401 {"error": "User not found"}         ← раскрывает, что email не существует\n\nПравильно — одинаковый ответ в обоих случаях:\n→ 401 {"error": "Invalid credentials"}\n\nИ одинаковое время ответа (иначе timing attack)',
                },
              ],
            },
            {
              id: 'qa-l45-s2',
              title: 'CSRF: атака через чужой сайт',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'CSRF (Cross-Site Request Forgery) — злоумышленник заставляет браузер жертвы отправить запрос от её имени. Жертва залогинена, куки отправляются автоматически, и действие выполняется без её ведома.',
                },
                {
                  type: 'mermaid',
                  caption: 'Как работает CSRF-атака',
                  code: `sequenceDiagram
                    participant V as Жертва
                    participant E as evil.com
                    participant B as bank.com

                    Note over V,B: Жертва залогинена,<br/>в браузере cookie bank.com
                    V->>E: Открывает evil.com
                    E-->>V: HTML со скрытым img/form
                    Note over V: Браузер автоматически<br/>отправляет запрос на bank.com<br/>с cookie
                    V->>B: POST /transfer (to=evil, amount=10000)<br/>Cookie: session=...
                    B-->>V: 200 OK — перевод выполнен
                    Note over B: Без CSRF-токена сервер<br/>не отличит запрос жертвы<br/>от запроса злоумышленника`
                },
                {
                  type: 'code',
                  lang: 'html',
                  caption: 'Как выглядит CSRF-атака',
                  code: '<!-- Страница злоумышленника evil.com -->\n<h1>Выиграйте iPhone!</h1>\n<img src="https://bank.com/transfer?to=evil&amount=10000"\n     style="display:none">\n\n<!-- Жертва заходит на evil.com, картинка «загружается»,\n     браузер шлёт GET с куками bank.com → перевод выполняется -->\n\n<!-- Или через POST: -->\n<form action="https://bank.com/transfer" method="POST" id="f">\n  <input name="to" value="evil">\n  <input name="amount" value="10000">\n</form>\n<script>document.getElementById("f").submit()</script>',
                },
                {
                  type: 'list',
                  items: [
                    'CSRF-токен: уникальный токен в форме/заголовке, проверяется на сервере',
                    'SameSite cookie: браузер не отправит куки при cross-site запросе (Lax или Strict)',
                    'Проверка Origin / Referer: сервер отвергает запросы с чужого origin',
                    'GET-запросы не должны менять состояние (только POST/PUT/DELETE с CSRF-токеном)',
                    'Проверять: удаётся ли выполнить действие с чужого домена без CSRF-токена',
                  ],
                },
                {
                  type: 'note',
                  text: 'CSRF-защита не нужна для stateless API с Bearer-токеном в заголовке (не в куках) — токен не отправляется автоматически. Но если приложение использует cookies для аутентификации — CSRF обязателен.',
                },
              ],
            },
            {
              id: 'qa-l45-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что считается правильной защитой от CSRF?',
                options: [
                  { id: 'a', text: 'CSRF-токен в форме или заголовке, проверяемый на сервере' },
                  { id: 'b', text: 'Cookie с флагом SameSite=Strict или SameSite=Lax' },
                  { id: 'c', text: 'Запрет JavaScript на сайте' },
                  { id: 'd', text: 'Проверка заголовка Origin или Referer' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'CSRF-токен, SameSite cookies и проверка Origin — три стандартные защиты. Запрет JS сломает приложение и не защитит от form-based CSRF (форму можно отправить без JS).',
              },
            },
          ],
        },
        {
          id: 'qa-l46',
          title: 'Инструменты: Burp Suite и OWASP ZAP',
          minutes: 25,
          steps: [
            {
              id: 'qa-l46-s1',
              title: 'Burp Suite Community',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Burp Suite — стандарт индустрии для ручного тестирования веб-безопасности. Community Edition бесплатен, но с ограничениями (нет автоматического сканера, throttled Intruder). Для обучения и ручных проверок — более чем достаточно.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Основные модули Burp',
                  code: 'Proxy       — перехват и модификация всех запросов (главный модуль)\nRepeater    — «отправить запрос ещё раз с изменениями»\nIntruder    — автоматизация перебора (fuzzing, brute force)\nDecoder     — base64, url-encode, hex\nComparer    — сравнение двух ответов (найти разницу)\nScanner     — в Pro: автоматический поиск уязвимостей',
                },
                {
                  type: 'list',
                  items: [
                    'Скачать: portswigger.net/burp/communitydownload (бесплатно)',
                    'Настроить браузер: прокси 127.0.0.1:8080, установить CA-сертификат Burp',
                    'Или использовать встроенный браузер Burp (проще)',
                    'Repeater — 80% работы: взять запрос из Proxy, изменить, отправить, посмотреть ответ',
                    'Intruder — для перебора id, токенов, паролей (в Community медленный — это ограничение)',
                  ],
                },
                {
                  type: 'note',
                  text: 'На собеседовании по безопасности почти гарантированно спросят: «Каким инструментом работали?». Burp — самый частый ответ. Если не работали — установите и потратьте вечер на Repeater. Это базовый навык.',
                },
              ],
            },
            {
              id: 'qa-l46-s2',
              title: 'OWASP ZAP и автоматизация',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'OWASP ZAP — бесплатный аналог Burp с упором на автоматизацию. Сканирует сайт, находит типовые уязвимости (XSS, SQLi, open redirect, missing headers). Не заменит ручную проверку, но хорош как «первый проход».',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Быстрый старт ZAP (CLI)',
                  code: '# Полное сканирование сайта (5–30 минут в зависимости от размера)\ndocker run -t ghcr.io/zaproxy/zaproxy:stable \\\n  zap-full-scan.py -t https://staging.example.com \\\n  -r report.html\n\n# Baseline: быстрая проверка (1–2 минуты), только пассивные проверки\ndocker run -t ghcr.io/zaproxy/zaproxy:stable \\\n  zap-baseline.py -t https://staging.example.com',
                },
                {
                  type: 'list',
                  items: [
                    'Baseline scan — можно ставить в CI: пассивные проверки, не ломает приложение',
                    'Full scan — на staging перед релизом: активные проверки, может менять данные',
                    'НЕ запускать full scan на проде — реально может что-то сломать',
                    'Отчёт в HTML/JSON — артефакт для разработчика',
                  ],
                },
                {
                  type: 'note',
                  text: 'ZAP и Burp — дополняют друг друга: ZAP — быстрый автоматический проход, Burp — глубокая ручная проверка. На собеседовании упоминание обоих показывает, что вы понимаете разницу между сканером и ручным анализом.',
                },
              ],
            },
            {
              id: 'qa-l46-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой модуль Burp используют чаще всего для ручной проверки уязвимостей?',
                options: [
                  { id: 'a', text: 'Scanner' },
                  { id: 'b', text: 'Repeater' },
                  { id: 'c', text: 'Decoder' },
                  { id: 'd', text: 'Comparer' },
                ],
                correct: ['b'],
                explanation:
                  'Repeater — «отправить запрос ещё раз с изменениями». С его помощью проверяют IDOR, SQLi, XSS вручную: меняют id, вставляют нагрузки, смотрят ответ. Scanner только в Pro, Decoder и Comparer — вспомогательные.',
              },
            },
          ],
        },
        {
          id: 'qa-l47',
          title: 'Чек-лист и этика тестировщика',
          minutes: 25,
          steps: [
            {
              id: 'qa-l47-s1',
              title: 'Практический чек-лист',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Не надо помнить весь OWASP наизусть — держите чек-лист. Эти 15 проверок покрывают 80% реальных дыр, которые находят тестировщики на старте.',
                },
                {
                  type: 'list',
                  items: [
                    '1. SQLi в полях ввода, особенно в поиске и логине',
                    '2. XSS: комментарии, профили, чат, всё что видят другие',
                    '3. IDOR: подмена id в URL/API на чужой объект',
                    '4. Вертикальная эскалация: обычный → админский эндпоинт',
                    '5. Скрытые/отладочные эндпоинты (/debug, /admin, /metrics)',
                    '6. Слабые пароли и отсутствие блокировки после N попыток',
                    '7. Раскрытие существования пользователя через сообщения об ошибке',
                    '8. Сброс пароля: предсказуемый токен, не истекает, многоразовый',
                    '9. Cookies без HttpOnly / Secure / SameSite',
                    '10. Отсутствие CSP или слабая CSP',
                    '11. Прямые ссылки на файлы (/uploads/xxx, S3 без подписи)',
                    '12. CORS: Access-Control-Allow-Origin: *',
                    '13. Раскрытие стека в ошибках (Exception + stack trace)',
                    '14. Rate limiting: отсутствует на логине / API / сбросе пароля',
                    '15. Отладочные заголовки (X-Debug, X-Powered-By, Server)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Начинайте с 3–4 самых важных: IDOR, SQLi, XSS, слабая аутентификация. Если приложение свежее и маленькое — этого хватит. Полный OWASP — для крупных проектов с security-ревью.',
                },
              ],
            },
            {
              id: 'qa-l47-s2',
              title: 'Этика и границы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Тестирование безопасности — единственная область QA, где можно случайно совершить преступление. Правила простые, но критичные.',
                },
                {
                  type: 'list',
                  items: [
                    '✅ Тестировать только свои системы или системы, на которые есть письменное разрешение',
                    '✅ На staging / dev, а не на проде (если не оговорено отдельно)',
                    '✅ Сообщать о найденных уязвимостях по защищённому каналу, а не публично',
                    '✅ Не выгружать реальные данные пользователей — использовать тестовые аккаунты',
                    '✅ Не наносить ущерб: не DROP TABLE, не удалять данные, не делать DoS без разрешения',
                    '❌ НЕ тестировать сайты без разрешения — это статья УК (неправомерный доступ к информации)',
                    '❌ НЕ публиковать PoC до исправления',
                    '❌ НЕ использовать найденные уязвимости для выгоды',
                  ],
                },
                {
                  type: 'p',
                  text: 'Легальные способы найти «полигон» для практики:',
                },
                {
                  type: 'list',
                  items: [
                    'PortSwigger Web Security Academy — бесплатные интерактивные лаборатории (websecurityacademy.com)',
                    'OWASP Juice Shop — уязвимое приложение для практики',
                    'HackTheBox, TryHackMe — легальные «хакерские» песочницы',
                    'Bug bounty: HackerOne, Bugcrowd — компании сами платят за найденные баги',
                    'DVWA (Damn Vulnerable Web App) — старый, но классический тренажёр',
                  ],
                },
                {
                  type: 'note',
                  text: 'В резюме: «Тестирование безопасности: OWASP Top 10, Burp Suite, ZAP, практика на PortSwigger Academy (X лабораторий пройдено)». Это честно, легально и показывает реальный навык.',
                },
              ],
            },
            {
              id: 'qa-l47-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вы нашли SQL-инъекцию на сайте конкурента. Что делать?',
                options: [
                  { id: 'a', text: 'Использовать для получения данных — это же интересно' },
                  { id: 'b', text: 'Опубликовать в Twitter — пусть все знают' },
                  { id: 'c', text: 'Сообщить владельцам по защищённому каналу, если есть контакт для security' },
                  { id: 'd', text: 'Ничего — это не ваша ответственность' },
                ],
                correct: ['c'],
                explanation:
                  'Правильный шаг — responsible disclosure: сообщить владельцам. Публикация без предупреждения — безответственно (и может быть незаконно). Использование — преступление. Если контакта нет, можно обратиться через security@ или форму bug bounty.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m7 — Мобильное тестирование (было qa-m12)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m7',
      title: 'Мобильное тестирование',
      lessons: [
        {
          id: 'qa-l48',
          title: 'Чем мобильное тестирование отличается от веба',
          minutes: 20,
          steps: [
            {
              id: 'qa-l48-s1',
              title: 'iOS и Android: два разных мира',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Веб — один браузер, один стек, кое-как предсказуемая среда. Мобильные — две операционные системы с разными парадигмами, тысячи устройств, три способа установки приложения. Тестировщику нужно помнить о различиях, которые невидимы в вебе.',
                },
                {
                  type: 'table',
                  caption: 'iOS vs Android',
                  head: ['Аспект', 'iOS', 'Android'],
                  rows: [
                    ['Устройств на рынке', '~30 моделей, 2–3 размера экрана', '20 000+ моделей, всё разнообразие'],
                    ['Версии ОС', 'Обычно 2–3 актуальные', 'Актуальны 5–7 версий, старые живут годами'],
                    ['Языки', 'Swift, Objective-C', 'Kotlin, Java'],
                    ['IDE', 'Xcode (только macOS)', 'Android Studio (Windows/Mac/Linux)'],
                    ['Эмулятор', 'Simulator (встроен в Xcode)', 'Android Emulator (встроен в Android Studio)'],
                    ['Магазин', 'App Store (строгие правила)', 'Google Play (мягче) + сторонние сторы'],
                    ['Разрешения', 'Спрашивают по одному, в контексте', 'Спрашивают пачкой при старте (можно отклонить)'],
                    ['Кнопка «Назад»', 'Нет (только жест с края)', 'Есть (системная + жест)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Главная боль Android — фрагментация: разные производители (Samsung, Xiaomi, Huawei) меняют систему, добавляют свои фичи, ломают стандартное поведение. iOS предсказуемее, но версии iOS обновляются агрессивнее — на старой ОС приложение может вести себя иначе.',
                },
              ],
            },
            {
              id: 'qa-l48-s2',
              title: 'Что добавляется к обычному тестированию',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Жесты: тап, свайп, долгое нажатие, пинч (zoom), drag-and-drop',
                    'Ориентация: портрет / ландшафт — вёрстка должна перестраиваться',
                    'Прерывания: звонок, SMS, уведомление, будильник — приложение должно пережить',
                    'Разрешения: камера, геолокация, контакты, уведомления — что будет, если отклонить?',
                    'Сеть: Wi-Fi → 4G → 3G → EDGE → airplane mode — потеря и восстановление',
                    'Батарея и нагрев: приложение не должно жечь телефон в фоне',
                    'Установка / обновление / удаление: с сохранением данных и без',
                    'Глубокие ссылки (deep links): открытие из браузера, push, другого приложения',
                    'Push-уведомления: доставка, тап, поведение в фоне и закрытом состоянии',
                  ],
                },
                {
                  type: 'p',
                  text: 'Веб-тестировщику эти пункты часто незнакомы, но именно они — источник реальных багов. «На моём телефоне не работает» обычно про жест, разрешение или прерывание.',
                },
              ],
            },
            {
              id: 'qa-l48-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что специфично именно для мобильного тестирования?',
                options: [
                  { id: 'a', text: 'Проверка жестов: свайпы, пинч, долгое нажатие' },
                  { id: 'b', text: 'Обработка звонка во время работы приложения' },
                  { id: 'c', text: 'Проверка адаптивной вёрстки под ширину экрана' },
                  { id: 'd', text: 'Запрос разрешений: камера, геолокация, уведомления' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Жесты, прерывания, разрешения — мобильная специфика. Адаптивная вёрстка есть и в вебе. На собеседовании mobile QA ответ на этот вопрос отделяет «читал про тестирование» от «тестировал реально».',
              },
            },
          ],
        },
        {
          id: 'qa-l49',
          title: 'Инструменты: Android Studio, Xcode, эмуляторы',
          minutes: 30,
          steps: [
            {
              id: 'qa-l49-s1',
              title: 'Android Studio и эмулятор',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Android Studio — официальная IDE для Android от Google. Для тестировщика она нужна ради эмулятора, установки APK и логов. Программировать в ней не обязательно — можно использовать как «эмулятор + logcat».',
                },
                {
                  type: 'list',
                  items: [
                    'Скачать: developer.android.com/studio (бесплатно, Windows/Mac/Linux)',
                    'AVD Manager — управление виртуальными устройствами (эмуляторы)',
                    'Создаём AVD: Pixel 7, Android 14 — типичный современный телефон',
                    'Ставим APK: File → Profile or Debug APK, или adb install app.apk',
                    'Logcat — вкладка с логами (главный инструмент отладки)',
                    'Device File Explorer — файлы приложения: данные, кэш, БД, настройки',
                  ],
                },
                {
                  type: 'note',
                  text: 'Эмулятор требует виртуализации: в BIOS должна быть включена VT-x (Intel) или AMD-V. Без неё Android Emulator будет тормозить или не запустится. В Windows — включите Hyper-V или установите Intel HAXM (старое) / Hyper-V (новое).',
                },
              ],
            },
            {
              id: 'qa-l49-s2',
              title: 'Xcode и Simulator (только macOS)',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Xcode — IDE Apple для iOS/macOS. Работает только на Mac. Внутри — Simulator (эмулятор iPhone/iPad). Для тестирования iOS-приложения без Mac не обойтись: облачные сервисы (BrowserStack, Sauce Labs) дают доступ к виртуальным Mac с Xcode за деньги.',
                },
                {
                  type: 'list',
                  items: [
                    'Скачать: apps.apple.com → Xcode (бесплатно, но ~15 ГБ)',
                    'Simulator: Xcode → Open Developer Tool → Simulator',
                    'Устанавливаем .app: перетащить в Simulator, или xcrun simctl install booted app.app',
                    'Console.app — системные логи (аналог logcat для iOS)',
                    'Device & Simulators — управление версиями iOS и моделями',
                  ],
                },
                {
                  type: 'table',
                  caption: 'Когда эмулятор vs реальное устройство',
                  head: ['Ситуация', 'Эмулятор', 'Реальное устройство'],
                  rows: [
                    ['Быстрый смоук после деплоя', '✅', '—'],
                    ['Проверка вёрстки на 5 моделях', '✅ (быстро)', '—'],
                    ['Camera, GPS, биометрия', '⚠️ ограниченно', '✅'],
                    ['Производительность, нагрев', '❌', '✅'],
                    ['Push-уведомления', '⚠️ эмуляция', '✅'],
                    ['Сеть: переключение Wi-Fi → 4G', '⚠️ вручную', '✅ естественно'],
                    ['Реальные баги пользователей', '❌', '✅'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Эмулятор — для 80% проверок: функциональность, вёрстка, базовая логика. Реальное устройство — для специфичного: камера, производительность, батарея, push, биометрия (Face ID, Touch ID), специфичные жесты. Эмулятор НЕ заменит телефон в критичных сценариях.',
                },
              ],
            },
            {
              id: 'qa-l49-s3',
              title: 'Облачные фермы устройств',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Держать 100 телефонов физически невозможно. Облачные сервисы дают доступ к реальным устройствам через браузер: удалённое управление, установка APK/IPA, запуск автотестов параллельно на десятках моделей.',
                },
                {
                  type: 'table',
                  caption: 'Популярные сервисы',
                  head: ['Сервис', 'Плюсы', 'Цена'],
                  rows: [
                    ['BrowserStack', 'Огромный парк (3000+ устройств), хорош для ручного теста', 'От $29/мес'],
                    ['Sauce Labs', 'Мощный для автотестов, хорошая интеграция с CI', 'От $19/мес (по минутам)'],
                    ['Firebase Test Lab', 'Бесплатный для Android, интеграция с Google', 'Бесплатно (ограничения)'],
                    ['AWS Device Farm', 'Для тех, кто уже в AWS, интеграция с их сервисами', 'От $0.17/мин'],
                  ],
                },
                {
                  type: 'p',
                  text: 'На собеседовании спросят: «Как тестируете на разных устройствах?». Правильный ответ: «Эмулятор для 80% задач + 3–5 реальных устройств в офисе для специфики + облачная ферма для широкой матрицы перед релизом». Не «только эмулятор» и не «только BrowserStack».',
                },
                {
                  type: 'note',
                  text: 'Бесплатные альтернативы: Google Firebase Test Lab (Android, ограниченный бесплатный тир), Microsoft App Center (закрывается, но можно успеть), реальные устройства из «ящика» команды. Для стартапа — 3–5 реальных телефонов в офисе дают больше, чем эмулятор.',
                },
              ],
            },
            {
              id: 'qa-l49-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что из перечисленного НЕ проверить на эмуляторе?',
                options: [
                  { id: 'a', text: 'Вёрстку на разных размерах экрана' },
                  { id: 'b', text: 'Производительность и нагрев устройства' },
                  { id: 'c', text: 'Работу с клавиатурой' },
                  { id: 'd', text: 'Базовую навигацию по приложению' },
                ],
                correct: ['b'],
                explanation:
                  'Эмулятор работает на железе компьютера, а не телефона. Он не покажет реальную производительность, нагрев, расход батареи. Это можно проверить только на реальном устройстве. Вёрстка и навигация — можно и на эмуляторе.',
              },
            },
          ],
        },
        {
          id: 'qa-l50',
          title: 'Логи и отладка: logcat, Console, DevTools',
          minutes: 25,
          steps: [
            {
              id: 'qa-l50-s1',
              title: 'Android: logcat',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'logcat — главный инструмент отладки на Android. Это поток системных логов: приложение, система, сеть, ошибки. Через Android Studio или adb. Когда приложение упало или ведёт себя странно — logcat первым делом.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'adb logcat: основные команды',
                  code: '# Всё в консоль\nadb logcat\n\n# Только ошибки и предупреждения\nadb logcat *:E *:W\n\n# Только логи конкретного приложения (нужен PID)\nadb shell pidof com.example.app\nadb logcat --pid=<PID>\n\n# Фильтр по тегу\nadb logcat -s MyAppTag\n\n# Сохранить в файл (для бага-репорта)\nadb logcat -d > logcat.txt\n\n# Очистить перед воспроизведением бага\nadb logcat -c',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Уровни логов',
                  code: 'V — Verbose  (всё подряд, для отладки)\nD — Debug    (отладочная информация)\nI — Info     (информационные сообщения)\nW — Warning  (предупреждения, но не падение)\nE — Error    (ошибки приложения)\nF — Fatal    (критические, приложение упало)',
                },
                {
                  type: 'list',
                  items: [
                    'Перед воспроизведением бага: adb logcat -c (очистить)',
                    'Воспроизвести баг',
                    'adb logcat -d > log.txt (сохранить в файл)',
                    'В файле искать: E, Fatal, stack trace, имя пакета',
                    'Приложить лог к баг-репорту — разработчик скажет спасибо',
                  ],
                },
              ],
            },
            {
              id: 'qa-l50-s2',
              title: 'iOS: Console и Xcode',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'На iOS логи смотрят через Console.app (системные) или Xcode (логи приложения). Если приложение установлено на тестовом устройстве без подключения к Xcode — Console.app. Если запущено из Xcode — прямо в IDE.',
                },
                {
                  type: 'list',
                  items: [
                    'Console.app (macOS) — Applications → Utilities → Console',
                    'Выбрать устройство в левой панели → Start streaming',
                    'Фильтр по процессу: process:MyApp',
                    'Xcode: Window → Devices and Simulators → View Device Logs — краш-логи',
                    'Crash-логи .crash или .ips — для разбора падений (символизация через символические файлы)',
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Xcode Simulator: команды для тестировщика',
                  code: '# Список запущенных эмуляторов\nxcrun simctl list devices\n\n# Установить приложение\nxcrun simctl install booted MyApp.app\n\n# Запустить приложение\nxcrun simctl launch booted com.example.MyApp\n\n# Открыть deep link\nxcrun simctl openurl booted "myapp://profile/123"\n\n# Сделать скриншот экрана\nxcrun simctl io booted screenshot screen.png',
                },
              ],
            },
            {
              id: 'qa-l50-s3',
              title: 'Что искать в логах при багах',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Stack trace — последовательность вызовов, приведшая к падению',
                    'HTTP-ошибки: 4xx, 5xx, timeout — что и куда ушло',
                    'Исключения: NullPointerException, ArrayIndexOutOfBounds — где сломалось',
                    'ANR (Android) — приложение не отвечает > 5 сек, ищите блокирующий вызов',
                    'OOM (Out of Memory) — приложение съело память, ищите утечки',
                    'Timeouts — запросы к бэкенду не уложились',
                    'Permission denied — не хватает разрешения',
                    'Network errors: SSL, DNS, no internet — где именно порвалось',
                  ],
                },
                {
                  type: 'p',
                  text: 'Мобильные баги часто «плавающие»: воспроизводятся не у всех, зависят от модели или версии ОС. Логи в этом случае — единственный способ понять, что реально произошло у пользователя.',
                },
                {
                  type: 'note',
                  text: 'Хороший баг-репорт по мобильному: модель устройства (Samsung Galaxy S23), версия ОС (Android 14), версия приложения (2.3.1), шаги, ожидаемый/фактический результат, скриншот И лог. Без лога «приложение падает» разработчик потратит вдвое больше времени.',
                },
              ],
            },
            {
              id: 'qa-l50-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Куда смотреть в первую очередь при падении Android-приложения?',
                options: [
                  { id: 'a', text: 'В Console.app на Mac' },
                  { id: 'b', text: 'В logcat (adb logcat или вкладка в Android Studio)' },
                  { id: 'c', text: 'В DevTools браузера' },
                  { id: 'd', text: 'В Xcode' },
                ],
                correct: ['b'],
                explanation:
                  'logcat — стандартный инструмент для Android. Console.app и Xcode — для iOS/macOS. DevTools — для веба. На собеседовании проверяют, знаете ли вы стандартный инструмент для каждой платформы.',
              },
            },
          ],
        },
        {
          id: 'qa-l51',
          title: 'Что тестировать: чек-лист мобильных проверок',
          minutes: 35,
          steps: [
            {
              id: 'qa-l51-s1',
              title: 'Функциональность и жесты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Кроме обычных кнопок и полей — мобильные жесты. Они ведут себя по-разному на iOS и Android, и это классический источник багов «у меня работает, у тебя нет».',
                },
                {
                  type: 'list',
                  items: [
                    'Тап (короткое касание) — обычный клик',
                    'Долгое нажатие (long press) — контекстное меню, выделение',
                    'Свайп влево/вправо — навигация назад на iOS, удаление элементов',
                    'Свайп вниз — обновление списка (pull-to-refresh)',
                    'Скролл — инерционный, не должен «залипать»',
                    'Пинч (pinch-to-zoom) — увеличение картинки, карты',
                    'Двойной тап — zoom, лайк',
                    'Drag-and-drop — перетаскивание элементов',
                    'Жест «назад» (Android, с края экрана) — должен работать системно',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что проверять в формах и полях',
                  code: '✓ Клавиатура не перекрывает поле ввода\n✓ Автокоррекция не ломает ввод (email, пароль)\n✓ Emoji и юникод не ломают вёрстку\n✓ Копирование/вставка из буфера обмена работает\n✓ Поле не теряет фокус при скролле\n✓ Кнопка «Далее» на клавиатуре работает\n✓ Ввод в портрете и ландшафте',
                },
              ],
            },
            {
              id: 'qa-l51-s2',
              title: 'Разрешения и приватность',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Разрешения — обязательная проверка. Пользователь может отклонить любое: камеру, геолокацию, контакты, уведомления. Приложение должно работать (или корректно объяснять, что без разрешения нельзя).',
                },
                {
                  type: 'table',
                  caption: 'Что проверять по разрешениям',
                  head: ['Сценарий', 'Ожидание'],
                  rows: [
                    ['Разрешение выдано', 'Функция работает нормально'],
                    ['Разрешение отклонено', 'Приложение объясняет, как включить, не крашится'],
                    ['Разрешение отозвано после выдачи', 'Приложение замечает и обрабатывает'],
                    ['Разрешение только «при использовании»', 'В фоне не работает, но не падает'],
                    ['Запрос повторно после «Больше не спрашивать»', 'Настройки: ссылка в системные настройки'],
                  ],
                },
                {
                  type: 'note',
                  text: 'iOS: разрешения спрашивают по одному, в контексте («Приложению нужна камера, чтобы сделать фото»). Android: часто спрашивают пачкой при старте (с Android 13 — по одному). Проверяйте оба сценария: если пользователь отклонил — не должно быть бесконечного цикла запросов или краша.',
                },
              ],
            },
            {
              id: 'qa-l51-s3',
              title: 'Прерывания, сеть, установка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Мобильное приложение живёт в среде, полной прерываний. Звонок, SMS, уведомление, будильник — всё это может произойти в любой момент. И сеть пропадает регулярно: лифт, метро, самолёт.',
                },
                {
                  type: 'list',
                  items: [
                    'Звонок во время работы — приложение должно вернуться в то же состояние',
                    'SMS/уведомление — верхний баннер не должен ломать ввод',
                    'Свернуть приложение → открыть через 10 минут → состояние сохранилось?',
                    'Заблокировать экран → разблокировать → сессия жива?',
                    'Wi-Fi → 4G → Wi-Fi: приложение не падает, данные догружаются',
                    'Airplane mode во время запроса: показывается ошибка, можно повторить',
                    'Очень медленная сеть (throttling в эмуляторе): не зависает ли UI, есть ли индикатор',
                    'Потеря соединения → восстановление: переподключается автоматически?',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Установка / обновление / удаление',
                  code: '✓ Установка на чистое устройство\n✓ Обновление поверх старой версии — данные сохраняются\n✓ Обновление с 3 версий назад — миграция данных работает\n✓ Удаление — данные приложения стираются (если так задумано)\n✓ Переустановка — чистое состояние, не «мусор» в кэше\n✓ Установка с недостатком места — понятная ошибка, не краш\n✓ Установка на старую версию ОС — понятная ошибка (если минимальная выше)',
                },
              ],
            },
            {
              id: 'qa-l51-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что обязательно проверить при тестировании разрешений?',
                options: [
                  { id: 'a', text: 'Сценарий, когда пользователь отклонил разрешение' },
                  { id: 'b', text: 'Сценарий, когда разрешение отозвано после выдачи' },
                  { id: 'c', text: 'Сценарий, когда пользователь отключил интернет' },
                  { id: 'd', text: 'Сценарий, когда разрешение выдано' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Разрешения — это три сценария: выдано, отклонено, отозвано. Отключение интернета — отдельная проверка (сеть), не про разрешения. На собеседовании проверяют, знаете ли вы про все три состояния.',
              },
            },
          ],
        },
        {
          id: 'qa-l52',
          title: 'Тест-матрица и приоритизация',
          minutes: 25,
          steps: [
            {
              id: 'qa-l52-s1',
              title: 'Как выбрать устройства',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '20 000 моделей Android и 30 моделей iPhone — протестировать всё невозможно. Задача — выбрать 5–15 устройств, которые покрывают 80% реальных пользователей. Это называется test matrix.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Принцип выбора',
                  code: '1. Топ-5 устройств по вашей аналитике (Google Analytics, Firebase)\n   — то, что реально у пользователей\n\n2. Старейшая поддерживаемая ОС (minSdk / min iOS)\n   — «дно» вашей поддержки\n\n3. Новейшая ОС (только вышла — а совместимость?)\n\n4. Маленький экран (iPhone SE, старые Android)\n   — вёрстка ломается тут\n\n5. Большой экран / планшет\n   — если поддерживаете\n\n6. Флагман и бюджетник\n   — производительность и память отличаются в разы\n\n7. Специфичный вендор (Samsung, Xiaomi, Huawei)\n   — они меняют систему',
                },
                {
                  type: 'note',
                  text: 'Спросите аналитику: какие 5 устройств реально у вас в топе? Что-то может удивить: «все на iPhone 15» или «40% на Xiaomi». Матрица строится по данным, а не по интуиции. Если аналитики нет — берите Pixel (эталон Android), iPhone последний, iPhone SE, Samsung среднего класса.',
                },
              ],
            },
            {
              id: 'qa-l52-s2',
              title: 'Приоритизация проверок',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'На 15 устройствах невозможно прогнать все 500 тест-кейсов. Приоритизация — не «что важнее», а «что на каком устройстве». На каждом релизе — ротация, чтобы за квартал покрыть всё.',
                },
                {
                  type: 'table',
                  caption: 'Что тестировать на каком устройстве',
                  head: ['Тип проверки', 'Где'],
                  rows: [
                    ['Smoke (критичные пути)', 'Каждое устройство в матрице'],
                    ['Полная регрессия', 'Одно устройство (эталон) + эмулятор'],
                    ['Вёрстка / UI', 'Маленький экран, большой экран, планшет'],
                    ['Производительность', 'Бюджетный телефон (медленный) и флагман'],
                    ['Специфика ОС', 'Старая ОС (minSdk) и новая'],
                    ['Специфика вендора', 'Samsung, Xiaomi — отдельно'],
                    ['Биометрия, камера, NFC', 'Реальные устройства (эмулятор не покажет)'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Правило ротации: на каждом релизе критичные проверки — везде, полную регрессию — на «эталоне» (одно стабильное устройство), а специфичные — по одному новому устройству в ротации. За 4–6 релизов — полная матрица покрыта.',
                },
              ],
            },
            {
              id: 'qa-l52-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'На чём строить выбор устройств для тест-матрицы?',
                options: [
                  { id: 'a', text: 'На самых дорогих моделях — они «эталон»' },
                  { id: 'b', text: 'На данных аналитики: топ-5 у реальных пользователей + крайние версии ОС' },
                  { id: 'c', text: 'На том, что есть в офисе' },
                  { id: 'd', text: 'На устройствах разработчиков' },
                ],
                correct: ['b'],
                explanation:
                  'Данные аналитики (GA, Firebase) показывают, что реально у пользователей. Плюс крайние версии ОС (minSdk и последняя) и разные размеры экранов. «Что есть в офисе» — не стратегия.',
              },
            },
          ],
        },
        {
          id: 'qa-l53',
          title: 'Автотесты: Appium и альтернативы',
          minutes: 30,
          steps: [
            {
              id: 'qa-l53-s1',
              title: 'Четыре подхода к автоматизации',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Инструменты мобильной автоматизации',
                  head: ['Инструмент', 'Платформа', 'Плюсы', 'Минусы'],
                  rows: [
                    ['Appium', 'iOS + Android + Windows', 'Один код на обе платформы, любой язык', 'Медленнее нативных, требует настройки'],
                    ['Espresso', 'Android', 'Быстрый, нативный, стабильный', 'Только Android, только Kotlin/Java'],
                    ['XCUITest', 'iOS', 'Быстрый, нативный', 'Только iOS, только Swift/Objective-C'],
                    ['Detox', 'React Native', 'Для RN-приложений, быстрый', 'Только React Native'],
                    ['Maestro', 'iOS + Android', 'Очень простой YAML, для смоук-тестов', 'Меньше возможностей, молодой'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Appium — «мобильный Selenium»: один тест на Python/Java/JS работает и на iOS, и на Android. Это главный выбор, если у вас кроссплатформенная команда или хочется один фреймворк. Espresso и XCUITest — если нужна максимальная скорость и нативность (обычно их пишут сами разработчики).',
                },
                {
                  type: 'note',
                  text: 'В 2025 растёт Maestro: YAML-описание тестов, работает без компиляции, отлично для смоук-тестов и UI. Порог входа — минимальный. Для «проверить, что приложение открывается и логин работает» Maestro часто быстрее Appium. Но для сложных сценариев — Appium или нативные.',
                },
              ],
            },
            {
              id: 'qa-l53-s2',
              title: 'Appium: основы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Установка и первый тест',
                  code: 'pip install Appium-Python-Client\nnpm install -g appium\nappium driver install uiautomator2      # Android\nappium driver install xcuitest          # iOS (только на Mac)\n\n# Запуск сервера Appium\nappium',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Тест на Python',
                  code: 'from appium import webdriver\nfrom appium.options.android import UiAutomator2Options\nfrom appium.webdriver.common.appiumby import AppiumBy\n\noptions = UiAutomator2Options()\noptions.platform_name = "Android"\noptions.device_name = "Pixel_7"\noptions.app = "/path/to/app.apk"\noptions.automation_name = "UiAutomator2"\n\ndriver = webdriver.Remote("http://localhost:4723", options=options)\n\n# Локаторы — по accessibility id, id, xpath\ndriver.find_element(AppiumBy.ID, "com.example.app:id/login").click()\ndriver.find_element(AppiumBy.ACCESSIBILITY_ID, "Email").send_keys("test@x.com")\n\ndriver.quit()',
                },
                {
                  type: 'list',
                  items: [
                    'AppiumBy.ID — по resource-id (Android) или name (iOS)',
                    'AppiumBy.ACCESSIBILITY_ID — по accessibility label (лучший, кроссплатформенный)',
                    'AppiumBy.XPATH — медленный, хрупкий, но работает везде',
                    'Appium Inspector — визуальный инструмент для поиска локаторов (аналог DevTools)',
                    'driver.start_recording_screen() — запись видео для отладки',
                  ],
                },
                {
                  type: 'note',
                  text: 'Главная боль Appium — скорость: каждый шаг = HTTP-запрос к серверу Appium → команда → устройство. Один тест может идти 30–60 сек. Это медленнее Espresso в 5–10 раз. Поэтому в CI Appium-тесты обычно на smoke-уровне (5–20 сценариев), а не на полный регресс.',
                },
              ],
            },
            {
              id: 'qa-l53-s3',
              title: 'Что автоматизировать, а что нет',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Мобильная автоматизация хрупкая: эмуляторы долго стартуют, тесты падают из-за таймингов, разные устройства ломают локаторы. Есть смысл автоматизировать не всё подряд, а то, что даёт максимум пользы при минимуме хлопот.',
                },
                {
                  type: 'list',
                  items: [
                    '✅ Smoke (логин, главный экран, ключевые действия) — на каждом релизе, на 2–3 устройствах',
                    '✅ Критичные регрессии (оплата, заказ) — раз в сутки, на эталоне',
                    '✅ Интеграционные сценарии (регистрация → покупка) — если долго и нудно руками',
                    '❌ Проверка вёрстки на 20 моделях — визуальные тесты или ручная ротация',
                    '❌ Специфика устройства (камера, биометрия, NFC) — ручной тест на реальном устройстве',
                    '❌ Одноразовые проверки — не надо тратить время на автотест, если проверка нужна раз в квартал',
                    '❌ Push-уведомления — сложно автоматизировать, обычно вручную',
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: если сценарий выполняется на каждом релизе и занимает > 2 минут руками — автоматизируйте. Если раз в квартал — ручной чек-лист проще и дешевле в поддержке. Мобильная автоматизация — самая дорогая в поддержке из всех видов.',
                },
              ],
            },
            {
              id: 'qa-l53-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой инструмент выбрать для кроссплатформенной автоматизации на Python (iOS + Android)?',
                options: [
                  { id: 'a', text: 'Espresso' },
                  { id: 'b', text: 'XCUITest' },
                  { id: 'c', text: 'Appium' },
                  { id: 'd', text: 'Detox' },
                ],
                correct: ['c'],
                explanation:
                  'Appium — единственный в списке, который работает и на iOS, и на Android, и поддерживает Python. Espresso — только Android/Kotlin, XCUITest — только iOS/Swift, Detox — только React Native.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m8 — Accessibility (было qa-m13)
    // ─────────────────────────────────────────────
    {
      id: 'qa-a-m8',
      title: 'Accessibility (a11y)',
      lessons: [
        {
          id: 'qa-l54',
          title: 'Что такое a11y и зачем она нужна',
          minutes: 20,
          steps: [
            {
              id: 'qa-l54-s1',
              title: 'Доступность для всех',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Accessibility (a11y — от англ. accessibility, где 11 букв между a и y) — это практика создания продуктов, которыми могут пользоваться люди с ограниченными возможностями. Это не только про слепых (скринридеры), но и про людей с моторными нарушениями (навигация только клавиатурой), когнитивными особенностями, временными травмами (сломанная рука) и даже про ситуативные ограничения (яркое солнце на экране, нет звука в метро).`,
                },
                {
                  type: 'p',
                  text: `Стандарт **WCAG** (Web Content Accessibility Guidelines) описывает, как делать доступные интерфейсы. Уровни: A (минимум), AA (стандарт для большинства стран/законов), AAA (максимум).`,
                },
                {
                  type: 'list',
                  items: [
                    'A — базовый уровень (есть alt-тексты, работает клавиатура)',
                    'AA — обязательный по закону во многих странах (контраст 4.5:1, субтитры)',
                    'AAA — экспертный уровень (контраст 7:1, язык жестов)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Принципы POUR: Perceivable (воспринимаемо), Operable (управляемо), Understandable (понятно), Robust (надёжно — работает со скринридерами). На собеседовании QA вопрос «что такое a11y» и «какие принципы» — частый.',
                },
              ],
            },
            {
              id: 'qa-l54-s2',
              title: 'Что проверять в первую очередь',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Клавиатура: можно ли пройти весь сценарий без мыши? Виден ли фокус (outline)?',
                    'Семантика: используются ли правильные теги (button вместо div onClick, label для input)?',
                    'Изображения: есть ли alt-текст? Декоративные картинки — alt=""?',
                    'Контраст: читается ли текст на фоне? (минимум 4.5:1 для текста)',
                    'Формы: связаны ли ошибки с полями? Понятны ли сообщения?',
                    'Видео: есть ли субтитры и расшифровка?',
                  ],
                },
                {
                  type: 'note',
                  text: 'Самый быстрый тест: отключите мышь и попробуйте пройти сценарий только с Tab/Enter/Space. Если не получается — это a11y-баг. Следующий шаг — включить скринридер (NVDA на Windows, VoiceOver на Mac).',
                },
              ],
            },
            {
              id: 'qa-l54-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой уровень WCAG обычно требуется по закону (например, в ЕС и США)?',
                options: [
                  { id: 'a', text: 'Уровень A' },
                  { id: 'b', text: 'Уровень AA' },
                  { id: 'c', text: 'Уровень AAA' },
                  { id: 'd', text: 'Любой на выбор' },
                ],
                correct: ['b'],
                explanation: 'AA — стандарт для законодательства (ADA в США, European Accessibility Act). A — недостаточно (только база). AAA — слишком строго для массового внедрения (контраст 7:1, язык жестов).',
              },
            },
          ],
        },
        {
          id: 'qa-l55',
          title: 'Инструменты a11y-тестирования',
          minutes: 25,
          steps: [
            {
              id: 'qa-l55-s1',
              title: 'Автоматические инструменты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Автоматика находит около 30–40% проблем (контраст, alt, aria-атрибуты). Остальное — ручной тест со скринридером.',
                },
                {
                  type: 'list',
                  items: [
                    'Lighthouse (вкладка в Chrome DevTools) — общий аудит, есть блок Accessibility',
                    'axe DevTools (расширение для Chrome) — самый мощный автоматический сканер',
                    'WAVE (расширение) — визуализация проблем прямо на странице',
                    'Playwright + axe-core — интеграция в автотесты (@axe-core/playwright)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Для CI/CD: @axe-core/playwright или pa11y — запускают a11y-проверку на каждом PR. Падение a11y-теста = блокировка мержа (если настроить).',
                },
              ],
            },
            {
              id: 'qa-l55-s2',
              title: 'Скринридеры',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Чем тестировать',
                  code: 'NVDA (Windows) — бесплатный, самый популярный\nJAWS (Windows) — платный, корпоративный стандарт\nVoiceOver (macOS/iOS) — встроен, Command+F5\nTalkBack (Android) — встроен\nNarrator (Windows) — встроен, но менее популярен',
                },
                {
                  type: 'p',
                  text: `Начинать лучше с NVDA (Windows) или VoiceOver (Mac). Включите, закройте глаза (или монитор) и попробуйте пройти сценарий на слух. Если не получается — это баг.`,
                },
                {
                  type: 'note',
                  text: 'Частые баги: кнопка без имени (скринридер читает «button»), изображение без alt (читает «image» или путь к файлу), модальное окно без focus trap (Tab уходит за его пределы).',
                },
              ],
            },
            {
              id: 'qa-l55-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие инструменты помогают проверять доступность?',
                options: [
                  { id: 'a', text: 'Lighthouse' },
                  { id: 'b', text: 'axe DevTools' },
                  { id: 'c', text: 'Postman' },
                  { id: 'd', text: 'Скринридер (NVDA)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'Lighthouse и axe — автоматические сканеры. Скринридер — ручная проверка. Postman — для API-тестов (к a11y отношения не имеет).',
              },
            },
            {
              id: 'qa-l55-s4',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его роль',
                pairs: [
                  { left: 'Lighthouse', right: 'Общий аудит и метрики' },
                  { left: 'axe DevTools', right: 'Автоматический поиск a11y-ошибок' },
                  { left: 'NVDA', right: 'Скринридер для ручного теста' },
                  { left: '@axe-core/playwright', right: 'a11y-проверка в автотестах' },
                ],
                explanation: 'Lighthouse — общий аудит. axe — точечный поиск ошибок. NVDA — «глаза» для скринридера. axe-core в Playwright — автоматизация a11y в CI.',
              },
            },
          ],
        },
      ],
    },
    {
  id: 'qa-a-m9',
  title: 'Практикум',
  lessons: [
    {
      id: 'qa-l80',
      title: 'Практика: pytest, Playwright, SQL, нагрузка, безопасность',
      minutes: 35,
      steps: [
        {
          id: 'qa-l80-s1',
          title: 'Scope фикстуры',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Какой scope выбрать для фикстуры, которая один раз подключается к тестовой БД на весь прогон?',
            options: [
              { id: 'a', text: 'function' },
              { id: 'b', text: 'class' },
              { id: 'c', text: 'module' },
              { id: 'd', text: 'session' },
            ],
            correct: ['d'],
            explanation: 'session создаёт подключение один раз на всю сессию pytest и закрывает в конце. function — на каждый тест (медленно, но изолированно). Для БД обычно session или module.',
          },
        },
        {
          id: 'qa-l80-s2',
          title: 'Зачем мокать',
          type: 'quiz',
          quiz: {
            kind: 'multiple',
            question: 'Что стоит мокать в unit-тестах?',
            options: [
              { id: 'a', text: 'HTTP-запросы к внешнему API' },
              { id: 'b', text: 'Собственную функцию сложения a + b' },
              { id: 'c', text: 'Подключение к БД' },
              { id: 'd', text: 'Текущее время (для детерминизма)' },
            ],
            correct: ['a', 'c', 'd'],
            explanation: 'Мокаем всё внешнее и недетерминированное: сеть, БД, время. Свою функцию a + b мокать бессмысленно — её и тестируем.',
          },
        },
        {
          id: 'qa-l80-s3',
          title: 'Лучший локатор Playwright',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Какой локатор в Playwright самый устойчивый к изменениям вёрстки?',
            options: [
              { id: 'a', text: 'page.locator("div > button.submit")' },
              { id: 'b', text: 'page.get_by_role("button", name="Отправить")' },
              { id: 'c', text: 'page.locator("xpath=//button")' },
              { id: 'd', text: 'page.locator(".btn-primary")' },
            ],
            correct: ['b'],
            explanation: 'get_by_role ищет по ARIA-роли и доступному имени. Он не ломается при смене CSS-классов или структуры DOM. Если кнопку переименуют — тест сломается, но это и есть сигнал, что изменился UX.',
          },
        },
        {
          id: 'qa-l80-s4',
          title: 'Почему sleep — плохо',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Почему `time.sleep(2)` между действиями в Playwright — плохая практика?',
            options: [
              { id: 'a', text: 'Playwright не поддерживает sleep' },
              { id: 'b', text: 'Тест становится медленным и всё равно нестабильным; expect умеет ждать сам' },
              { id: 'c', text: 'sleep работает только на Linux' },
              { id: 'd', text: 'Это замедляет CI' },
            ],
            correct: ['b'],
            explanation: 'Фиксированная пауза делает тест медленным и не решает проблему таймингов. Playwright сам ждёт нужного состояния в expect/click/fill. Если тест нестабилен — используйте expect для явного ожидания.',
          },
        },
        {
          id: 'qa-l80-s5',
          title: 'Playwright expect',
          type: 'quiz',
          quiz: {
            kind: 'code',
            question: 'Напишите проверку, что элемент с текстом «Добро пожаловать» виден. Используйте get_by_text и expect.',
            starterCode: 'expect(',
            mustInclude: [
              { pattern: 'get_by_text', message: 'Нужен локатор get_by_text' },
              { pattern: 'to_be_visible', message: 'Нужна проверка to_be_visible' },
              { pattern: 'Добро пожаловать', message: 'Нужен текст «Добро пожаловать»' },
            ],
            explanation: 'expect(page.get_by_text("Добро пожаловать")).to_be_visible()',
          },
        },
        {
          id: 'qa-l80-s6',
          title: 'SQL: агрегаты',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'В чём разница между `COUNT(*)` и `COUNT(email)`?',
            options: [
              { id: 'a', text: 'Никакой, это синонимы' },
              { id: 'b', text: 'COUNT(*) считает все строки, COUNT(email) — только где email IS NOT NULL' },
              { id: 'c', text: 'COUNT(*) быстрее' },
              { id: 'd', text: 'COUNT(email) работает только в PostgreSQL' },
            ],
            correct: ['b'],
            explanation: 'COUNT(*) — все строки. COUNT(email) — только не-NULL. Если из 100 пользователей у 10 нет email: COUNT(*) = 100, COUNT(email) = 90.',
          },
        },
        {
          id: 'qa-l80-s7',
          title: 'SQL: поиск дублей',
          type: 'quiz',
          quiz: {
            kind: 'code',
            question: 'Напишите SQL-запрос, который найдёт email, встречающиеся в таблице users более одного раза.',
            starterCode: 'SELECT email, COUNT(*)\nFROM users\n',
            mustInclude: [
              { pattern: 'GROUP BY email', message: 'Нужна группировка по email' },
              { pattern: 'HAVING COUNT\\(\\*\\) > 1', message: 'Нужно условие HAVING COUNT(*) > 1' },
            ],
            explanation: 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;',
          },
        },
        {
          id: 'qa-l80-s8',
          title: 'Little\'s Law',
          type: 'quiz',
          quiz: {
            kind: 'number',
            question: 'Система обрабатывает 300 RPS, средняя latency 0.2 сек. Сколько одновременных запросов «в полёте»? (L = λ × W)',
            correct: 60,
            explanation: 'L = 300 × 0.2 = 60. То есть одновременно в обработке находится 60 запросов. По этому числу планируют ресурсы серверов и connection pool.',
          },
        },
        {
          id: 'qa-l80-s9',
          title: 'OWASP Top 10',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Какая категория стоит на первом месте в OWASP Top 10 2021?',
            options: [
              { id: 'a', text: 'SQL Injection' },
              { id: 'b', text: 'Broken Access Control' },
              { id: 'c', text: 'Cryptographic Failures' },
              { id: 'd', text: 'Security Misconfiguration' },
            ],
            correct: ['b'],
            explanation: 'Broken Access Control — #1 в 2021. Это про авторизацию (кто что может), а не про инъекции. Самая частая и опасная дыра в реальных API.',
          },
        },
        {
          id: 'qa-l80-s10',
          title: 'IDOR',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Как проверить IDOR (Insecure Direct Object Reference)?',
            options: [
              { id: 'a', text: 'Нажать в UI на другой заказ и посмотреть' },
              { id: 'b', text: 'Изменить id в запросе API на чужой и посмотреть ответ (200 = дыра, 403/404 = защита)' },
              { id: 'c', text: 'Открыть сайт в другом браузере' },
              { id: 'd', text: 'Перезагрузить страницу' },
            ],
            correct: ['b'],
            explanation: 'IDOR проверяется на уровне API, а не UI: UI может скрывать чужие объекты, но API может их отдавать. Меняем /users/123 на /users/124 с тем же токеном. Если 200 с чужими данными — дыра.',
          },
        },
      ],
    },
  ],
},
  ],
};