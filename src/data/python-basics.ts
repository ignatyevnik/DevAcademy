import type { Course } from './types';

export const pythonBasicsCourse: Course = {
  slug: 'python-basics',
  title: 'Python: основы',
  subtitle: 'Синтаксис, коллекции, функции и первые программы — фундамент для QA и автоматизации',
  description:
    'Курс для тех, кто впервые программирует на Python. Разберётесь с переменными, операторами, условиями, циклами, коллекциями (списки, кортежи, словари, множества), функциями, файлами и обработкой ошибок. Плюс — list comprehensions и сортировка по ключу. Каждая тема закрепляется практикой: без «Hello, World» на 10 уроков — сразу к делу.',
  level: 'Новичок',
  tags: ['Python', 'Основы', 'Программирование'],
  accent: '#3776ab',
  icon: 'python',
  outcomes: [
    'Писать и запускать простые скрипты на Python',
    'Работать с числами, строками и операторами',
    'Использовать списки, кортежи, словари и множества',
    'Писать функции, разбивать код на модули',
    'Читать и записывать файлы, обрабатывать ошибки',
    'Применять list comprehensions и сортировку по ключу',
  ],
  requirements: ['Установленный Python 3.10+ (для практики)', 'Любой редактор кода'],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы: подробно (было py-m0)
    // ─────────────────────────────────────────────
    {
      id: 'py-b-m1',
      title: 'Основы: подробно',
      lessons: [
        {
          id: 'py-l9',
          title: 'Операторы и выражения',
          minutes: 20,
          steps: [
            {
              id: 'py-l9-s1',
              title: 'Арифметика',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Арифметические операторы',
                  head: ['Оператор', 'Смысл', 'Пример', 'Результат'],
                  rows: [
                    ['+', 'Сложение', '5 + 3', '8'],
                    ['-', 'Вычитание', '5 - 3', '2'],
                    ['*', 'Умножение', '5 * 3', '15'],
                    ['/', 'Деление (всегда float)', '5 / 3', '1.6666…'],
                    ['//', 'Целочисленное деление', '5 // 3', '1'],
                    ['%', 'Остаток от деления', '5 % 3', '2'],
                    ['**', 'Возведение в степень', '2 ** 10', '1024'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Неожиданные места',
                  code: 'print(10 / 2)    # 5.0 — не 5! Деление всегда даёт float\nprint(10 // 3)   # 3\nprint(-7 // 2)   # -4 (округление вниз, не к нулю)\nprint(-7 % 2)    # 1 (результат имеет знак делителя)\n\n# Остаток от деления — мощный инструмент\nprint(7 % 2 == 0)   # False: 7 нечётное\nprint(8 % 2 == 0)   # True:  8 чётное',
                },
                {
                  type: 'note',
                  text: '`5 / 3` всегда float, даже если делится нацело: `4 / 2` → `2.0`. Если нужен именно int — используйте `//`. Исключение — `//` с отрицательными числами: `-7 // 2 = -4`, а не `-3`.',
                },
              ],
            },
            {
              id: 'py-l9-s2',
              title: 'Приоритет операторов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Приоритет почти как в математике, но есть нюанс с `not` и сравнениями. Запомните главное: при сомнении ставьте скобки — это дешевле, чем искать баг.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Приоритет по убыванию',
                  code: '**            # степень\n*, /, //, %   # умножение и деление\n+, -          # сложение и вычитание\nin, not in, <, <=, >, >=, ==, !=, is, is not\nnot           # логическое НЕ\nand           # логическое И\nor            # логическое ИЛИ',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Как это выглядит',
                  code: 'print(2 + 3 * 4)            # 14, не 20\nprint((2 + 3) * 4)          # 20\nprint(2 ** 3 ** 2)          # 512 = 2**(3**2), степень право-ассоциативна\nprint(not True and False)   # False = (not True) and False\nprint(True or False and False)  # True = True or (False and False)',
                },
              ],
            },
            {
              id: 'py-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Что выведет `print(7 // 2 * 2)`?',
                accepted: ['6', '6.0'],
                placeholder: 'число',
                hint: '// выполняется раньше *',
                explanation:
                  '`//` и `*` — равный приоритет, вычисление слева направо. Сначала `7 // 2 = 3`, затем `3 * 2 = 6`. Не наоборот: `7 // 4` было бы неверно.',
              },
            },
            {
              id: 'py-l9-s4',
              title: 'Практика: приоритет операторов',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: '# Вычислите 7 // 2 * 2\n',
                    task: 'Вычислите `7 // 2 * 2` и напечатайте результат. Обратите внимание: это не 7.',
                    solution: 'print(7 // 2 * 2)',
                    expected: { type: 'stdout', value: '6' },
                    hint: '// и * — равный приоритет, вычисление слева направо',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l10',
          title: 'Строки и их методы',
          minutes: 25,
          steps: [
            {
              id: 'py-l10-s1',
              title: 'Срезы и индексы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Строки в Python — неизменяемые последовательности символов. Индексы с нуля, отрицательные — с конца. Срез `s[start:stop:step]` — «от start до stop, не включая stop».',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Срезы',
                  code: 's = "Python"\n\ns[0]      # "P"\ns[-1]     # "n"\ns[1:4]    # "yth"\ns[:3]     # "Pyt" (с 0)\ns[3:]     # "hon" (до конца)\ns[::-1]   # "nohtyP" — разворот\ns[::2]    # "Pto" — каждый второй\ns[1:-1]   # "ytho" — без первого и последнего',
                },
                {
                  type: 'note',
                  text: 'Строки неизменяемы: `s[0] = "p"` вызовет TypeError. Методы вроде `upper()` возвращают новую строку. Если нужно «поменять» — создаёте новую.',
                },
              ],
            },
            {
              id: 'py-l10-s2',
              title: 'Полезные методы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Методы, которые нужны постоянно',
                  code: 's = "  Hello World  "\n\ns.strip()          # "Hello World" — убрать пробелы по краям\ns.lower()          # "  hello world  "\ns.upper()          # "  HELLO WORLD  "\ns.replace("o", "0") # "  Hell0 W0rld  "\ns.split()          # ["Hello", "World"] — по пробелам\n"a,b,c".split(",")  # ["a", "b", "c"]\n", ".join(["a", "b"]) # "a, b" — склеить\n\n"hello".startswith("he")  # True\n"hello".endswith("lo")    # True\n"hello".find("ll")        # 2\n"hello".count("l")        # 2\n"hello".capitalize()      # "Hello"\n"hello world".title()     # "Hello World"\n\n"o" in "hello"            # True — проверка вхождения',
                },
                {
                  type: 'p',
                  text: 'Комбинация `split()` + `join()` — стандартный способ обработать текст: разбить на слова, что-то сделать, собрать обратно.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Пример: убрать двойные пробелы',
                  code: 'text = "это  очень   длинный    текст"\nwords = text.split()          # ["это", "очень", "длинный", "текст"]\nclean = " ".join(words)       # "это очень длинный текст"',
                },
              ],
            },
            {
              id: 'py-l10-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте метод и что он делает',
                pairs: [
                  { left: 'strip()', right: 'Убирает пробелы по краям' },
                  { left: 'split()', right: 'Разбивает строку на список' },
                  { left: 'join()', right: 'Склеивает список в строку' },
                  { left: 'replace()', right: 'Заменяет подстроку' },
                ],
                explanation:
                  'Эти четыре метода закрывают 80% работы со строками. strip — очистка ввода, split/join — обработка текста, replace — замена фрагментов.',
              },
            },
            {
              id: 'py-l10-s4',
              title: 'Практика: срез строки',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: '# Разверните строку "Python"\n',
                    task: 'Разверните строку `"Python"` через срез и напечатайте результат.',
                    solution: 'print("Python"[::-1])',
                    expected: { type: 'stdout', value: 'nohtyP' },
                    hint: 'срез [::-1] разворачивает строку',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l11',
          title: 'Ввод и вывод',
          minutes: 20,
          steps: [
            {
              id: 'py-l11-s1',
              title: 'input и print',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '`input()` всегда возвращает строку. Это главная ловушка: пользователь вводит «25», а получаете вы `"25"`. Для чисел нужно явное преобразование.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Ввод с преобразованием',
                  code: 'name = input("Как вас зовут? ")          # строка\nage = int(input("Ваш возраст? "))         # число\nheight = float(input("Рост в метрах? "))  # дробное\n\nprint(f"{name}, вам {age} лет, рост {height} м")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Опасность',
                  code: '# Если пользователь введёт "двадцать" вместо "20":\n# int("двадцать") → ValueError\n# Без try/except программа упадёт.\n\ntry:\n    age = int(input("Возраст: "))\nexcept ValueError:\n    print("Нужно ввести число")\n    age = 0',
                },
                {
                  type: 'note',
                  text: 'В учебных задачах и на собеседованиях `input()` встречается часто, но в реальных скриптах его используют редко. Основной ввод — аргументы командной строки (`sys.argv`, `argparse`) или файлы.',
                },
              ],
            },
            {
              id: 'py-l11-s2',
              title: 'print без сюрпризов',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Параметры print',
                  code: 'print("a", "b", "c")          # a b c (sep=" " по умолчанию)\nprint("a", "b", sep="-")      # a-b\nprint("line1", end="")         # без перевода строки\nprint("line2")\nprint("no newline", end="\\n")  # явно\n\n# Несколько строк через f-строку\nname = "Анна"\nprint(f"Привет,\\n{name}!")',
                },
                {
                  type: 'list',
                  items: [
                    '`sep` — что вставлять между аргументами (по умолчанию пробел)',
                    '`end` — что добавлять в конце (по умолчанию перевод строки)',
                    '`file=...` — куда печатать (по умолчанию stdout)',
                    'В print можно передавать любые объекты — они приведутся к строке через str()',
                  ],
                },
              ],
            },
            {
              id: 'py-l11-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что вернёт `input("? ")`, если пользователь введёт 42?',
                options: [
                  { id: 'a', text: 'Число 42 (int)' },
                  { id: 'b', text: 'Строку "42"' },
                  { id: 'c', text: 'Строку "? 42"' },
                  { id: 'd', text: 'None' },
                ],
                correct: ['b'],
                explanation:
                  'input() всегда возвращает строку. Для получения числа нужно явное int(input(...)) или float(input(...)). Это самая частая ошибка новичков.',
              },
            },
            {
              id: 'py-l11-s4',
              title: 'Практика: print с разделителем',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: '# Напечатайте a, b, c через дефис\n',
                    task: 'Напечатайте `a`, `b`, `c` через `print` с разделителем `-`. Должно получиться `a-b-c`.',
                    solution: 'print("a", "b", "c", sep="-")',
                    expected: { type: 'stdout', value: 'a-b-c' },
                    hint: 'print(..., sep="-")',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l12',
          title: 'Итерация: enumerate, zip, range',
          minutes: 25,
          steps: [
            {
              id: 'py-l12-s1',
              title: 'enumerate — индекс и значение',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда в цикле нужен и индекс, и значение — не пишите `for i in range(len(lst))`. Есть `enumerate`.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Плохо vs хорошо',
                  code: 'fruits = ["яблоко", "банан", "вишня"]\n\n# Плохо\nfor i in range(len(fruits)):\n    print(i, fruits[i])\n\n# Хорошо\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)\n\n# С enumerate можно задать начальный индекс\nfor i, fruit in enumerate(fruits, start=1):\n    print(f"{i}. {fruit}")',
                },
              ],
            },
            {
              id: 'py-l12-s2',
              title: 'zip — параллельная итерация',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'zip останавливается на самой короткой',
                  code: 'names = ["Анна", "Борис", "Вера"]\nages = [25, 30, 28]\n\nfor name, age in zip(names, ages):\n    print(f"{name}: {age}")\n# Анна: 25\n# Борис: 30\n# Вера: 28\n\n# Три и более итерируемых\ncodes = ["A", "B", "C"]\nfor name, age, code in zip(names, ages, codes):\n    print(f"{name} ({age}) - {code}")',
                },
                {
                  type: 'note',
                  text: '`zip` останавливается, когда заканчивается самый короткий список. Если это нежелательно — `zip(..., strict=True)` (Python 3.10+) выбросит ValueError, если длины разные. Полезно для ловли багов.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Создание словаря из двух списков',
                  code: 'keys = ["name", "age", "city"]\nvalues = ["Анна", 25, "Москва"]\nuser = dict(zip(keys, values))\n# {"name": "Анна", "age": 25, "city": "Москва"}',
                },
              ],
            },
            {
              id: 'py-l12-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая функция даёт в цикле и индекс, и значение сразу? (одно имя)',
                accepted: ['enumerate', 'enumerate()'],
                placeholder: 'имя функции',
                hint: 'От английского «перечислять»',
                explanation:
                  'enumerate(lst) возвращает пары (индекс, значение). Это идиоматичнее, чем `range(len(lst))` — код короче и читается лучше.',
              },
            },
            {
              id: 'py-l12-s4',
              title: 'Практика: enumerate',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'fruits = ["apple", "banana", "cherry"]\n',
                    task: 'Для списка `fruits` напечатайте строки вида `0: apple`, `1: banana`, `2: cherry` через `enumerate`.',
                    solution:
                      'fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")',
                    expected: { type: 'stdout', value: '0: apple\n1: banana\n2: cherry' },
                    hint: 'for i, x in enumerate(lst): print(f"{i}: {x}")',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Основы синтаксиса (было py-m1)
    // ─────────────────────────────────────────────
    {
      id: 'py-b-m2',
      title: 'Основы синтаксиса',
      lessons: [
        {
          id: 'py-l1',
          title: 'Переменные и типы',
          minutes: 15,
          steps: [
            {
              id: 'py-l1-s1',
              title: 'Как Python хранит значения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Python — динамически типизированный язык: переменная не объявляется с типом, тип определяется значением. Имя переменной — это ссылка на объект в памяти. Можно переприсвоить значение другого типа — старая ссылка просто заменится.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Простые типы',
                  code: 'age = 25              # int\npi = 3.14             # float\nname = "Анна"         # str\nis_active = True      # bool\nnothing = None        # NoneType\n\nprint(type(age))      # <class \'int\'>\nprint(age + 5)        # 30',
                },
                {
                  type: 'note',
                  text: 'Имена переменных — snake_case (user_name, not userName). Python чувствителен к регистру: Name и name — разные переменные.',
                },
                {
                  type: 'table',
                  caption: 'Основные типы',
                  head: ['Тип', 'Пример', 'Особенность'],
                  rows: [
                    ['int', '42, -7', 'Целые числа произвольной длины'],
                    ['float', '3.14, 1e-5', 'Числа с плавающей точкой'],
                    ['str', '"привет"', 'Неизменяемая последовательность символов'],
                    ['bool', 'True / False', 'Подкласс int: True == 1'],
                    ['NoneType', 'None', 'Единственное значение — «ничего»'],
                  ],
                },
              ],
            },
            {
              id: 'py-l1-s2',
              title: 'f-строки и вывод',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'f-строки (с версии 3.6) — современный способ форматирования. Внутри фигурных скобок можно писать любые выражения, а не только имена переменных.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'f-строки',
                  code: 'name = "Анна"\nage = 25\nprint(f"{name} — {age} лет")\n# Анна — 25 лет\n\nprint(f"{age * 2 = }")   # age * 2 = 50 (отладка)\nprint(f"{3.14159:.2f}")   # 3.14 (2 знака после точки)',
                },
              ],
            },
            {
              id: 'py-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Что выведет этот код: `x = "5"; print(x + x)`?',
                accepted: ['55'],
                placeholder: 'Введите вывод',
                hint: 'Обратите внимание: "5" — это строка, а не число',
                explanation:
                  'Сложение строк — конкатенация. "5" + "5" = "55". Если нужна арифметика, приводите к int: int(x) + int(x).',
              },
            },{
            id: "py-l1-s4",
            title: "Практика: первая программа",
            type: "theory",
            blocks: [
              {
                type: "python",
                python: {
                  starterCode: "# Напечатайте Hello, World!\n",
                  task: "Напечатайте строку `Hello, World!` с помощью `print()`.",
                  solution: "print('Hello, World!')",
                  expected: { type: "stdout", value: "Hello, World!" },
                  hint: "print('...') — выводит строку в stdout",
                },
              },
            ],
          },
          ],
        },
        {
          id: 'py-l2',
          title: 'Условия и логика',
          minutes: 20,
          steps: [
            {
              id: 'py-l2-s1',
              title: 'if / elif / else',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В Python блок кода выделяется отступами (обычно 4 пробела), а не фигурными скобками. Забудете отступ — получите IndentationError. Проверки идут по порядку: срабатывает первая подходящая ветка.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Условная логика',
                  code: 'score = 78\n\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelif score >= 60:\n    grade = "C"\nelse:\n    grade = "F"\n\nprint(grade)   # B',
                },
                {
                  type: 'list',
                  items: [
                    'Сравнение: ==, !=, <, <=, >, >=',
                    'Логика: and, or, not (ключевые слова, а не && / ||)',
                    'Проверка вхождения: x in [1, 2, 3], "а" in "кот"',
                    'Идентичность: is (тот же объект), is not',
                  ],
                },
                {
                  type: 'note',
                  text: 'Пустые значения ложны в логическом контексте: пустая строка, пустой список, 0, None. Это часто используется как `if items:` вместо `if len(items) > 0:`.',
                },
              ],
            },
            {
              id: 'py-l2-s2',
              title: 'Тернарное выражение',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  code: 'age = 20\nstatus = "взрослый" if age >= 18 else "ребёнок"\nprint(status)   # взрослый',
                },
                {
                  type: 'p',
                  text: 'Читается справа налево: «значение1, если условие, иначе значение2». Если выражение длинное или вложенное — лучше обычный if / else, читаемость важнее краткости.',
                },
              ],
            },
            {
              id: 'py-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что выведет код: `x = 0; if x: print("да"); else: print("нет")`?',
                options: [
                  { id: 'a', text: 'да' },
                  { id: 'b', text: 'нет' },
                  { id: 'c', text: 'Ошибку, 0 нельзя проверять' },
                  { id: 'd', text: 'Ничего' },
                ],
                correct: ['b'],
                explanation:
                  '0 в логическом контексте ложен (falsy), поэтому сработает ветка else. То же — с пустой строкой, пустым списком и None.',
              },
            },
            {
              id: 'py-l2-s4',
              title: 'Практика: if / elif / else',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'score = 80\n# Присвойте grade букву A, B или C\n',
                    task: 'Дано `score = 80`. Присвойте переменной `grade` букву: `A` если `score >= 90`, `B` если `score >= 75`, иначе `C`.',
                    solution:
                      'score = 80\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelse:\n    grade = "C"',
                    expected: { type: 'variable', name: 'grade', value: 'B' },
                    hint: 'if / elif / else, не забудьте отступы',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l3',
          title: 'Циклы',
          minutes: 25,
          steps: [
            {
              id: 'py-l3-s1',
              title: 'for и range',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'for в Python перебирает элементы итерируемого объекта. «Классический» цикл со счётчиком делается через range: range(n) — 0…n-1, range(a, b) — a…b-1, range(a, b, step) — с шагом.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Три цикла',
                  code: 'for i in range(3):\n    print(i)          # 0, 1, 2\n\nfor i in range(2, 5):\n    print(i)          # 2, 3, 4\n\nfor i in range(10, 0, -2):\n    print(i)          # 10, 8, 6, 4, 2',
                },
              ],
            },
            {
              id: 'py-l3-s2',
              title: 'while и break / continue',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'while с управлением',
                  code: 'n = 0\nwhile n < 10:\n    n += 1\n    if n == 3:\n        continue      # пропустить 3\n    if n == 7:\n        break         # остановиться на 7\n    print(n)          # 1, 2, 4, 5, 6',
                },
                {
                  type: 'note',
                  text: 'while опасен бесконечностью. Всегда проверяйте, что условие цикла может стать ложным. Случайный `while True:` без break внутри — типичная ошибка новичка.',
                },
                {
                  type: 'list',
                  items: [
                    'break — выйти из цикла целиком',
                    'continue — пропустить текущую итерацию',
                    'else у цикла — выполняется, если цикл не прервался через break',
                  ],
                },
              ],
            },
            {
              id: 'py-l3-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте конструкцию и что она делает',
                pairs: [
                  { left: 'break', right: 'Выйти из цикла' },
                  { left: 'continue', right: 'Пропустить итерацию' },
                  { left: 'range(3)', right: '0, 1, 2' },
                  { left: 'range(2, 5)', right: '2, 3, 4' },
                ],
                explanation:
                  'break и continue — ключевые слова управления циклом. range — генератор последовательности, который часто используется для счётных циклов.',
              },
            },
           {
              id: 'py-l3-s4',
              title: 'Практика: цикл и сумма',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'total = 0\n# Сложите числа от 1 до 10\n',
                    task: 'Посчитайте сумму чисел от 1 до 10 включительно и сохраните в переменную `total`.',
                    solution: 'total = sum(range(1, 11))',
                    expected: { type: 'variable', name: 'total', value: 55 },
                    hint: 'sum(range(1, 11)) или цикл for',
                  },
                },
              ],
            }, 
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Коллекции (было py-m2)
    // ─────────────────────────────────────────────
    {
      id: 'py-b-m3',
      title: 'Коллекции',
      lessons: [
        {
          id: 'py-l4',
          title: 'Списки и кортежи',
          minutes: 25,
          steps: [
            {
              id: 'py-l4-s1',
              title: 'Списки: изменяемые последовательности',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Список — упорядоченная коллекция любых объектов, самая используемая структура в Python. Поддерживает индексы, срезы и множество методов.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Основные операции',
                  code: 'nums = [3, 1, 4, 1, 5, 9, 2]\n\nnums[0]           # 3\nnums[-1]          # 2 (последний)\nnums[1:3]         # [1, 4] (срез)\nnums[::-1]        # развёрнутый список\n\nnums.append(6)    # добавить в конец\nnums.insert(0, 0) # вставить в начало\nnums.remove(1)    # удалить первое вхождение 1\nnums.sort()       # сортировка на месте\n\nsorted(nums)      # новая отсортированная копия\nlen(nums), sum(nums), min(nums), max(nums)',
                },
                {
                  type: 'note',
                  text: 'nums.sort() сортирует исходный список и возвращает None. sorted(nums) возвращает новый список, исходный не трогает. Классическая путаница: `sorted = sorted(nums)` вместо `nums = sorted(nums)`.',
                },
              ],
            },
            {
              id: 'py-l4-s2',
              title: 'Кортежи: неизменяемые',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Кортеж (tuple) — как список, но изменить нельзя. Используется для фиксированных наборов: координаты, RGB-цвета, возврат нескольких значений из функции. Создаётся через запятую: `t = (1, 2)` или даже `t = 1, 2`.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  code: 'point = (10, 20)\nx, y = point       # распаковка\nprint(x, y)        # 10 20\n\ndef min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max([3, 1, 4, 1, 5])   # lo=1, hi=5',
                },
              ],
            },
            {
              id: 'py-l4-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт при выполнении `t = (1, 2, 3); t[0] = 100`?',
                options: [
                  { id: 'a', text: 'Кортеж станет (100, 2, 3)' },
                  { id: 'b', text: 'Возникнет TypeError' },
                  { id: 'c', text: 'Кортеж станет (1, 2, 3, 100)' },
                  { id: 'd', text: 'Тихо проигнорируется' },
                ],
                correct: ['b'],
                explanation:
                  'Кортежи неизменяемы. Если нужна изменяемость — используйте список. Если фиксированный набор — кортеж, и это гарантия от случайных изменений.',
              },
            },
            {
              id: 'py-l4-s4',
              title: 'Практика: сортировка списка',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'nums = [3, 1, 4, 1, 5, 9]\n',
                    task: 'Отсортируйте `nums` по возрастанию (не меняя исходный список) и напечатайте результат через `print()`.',
                    solution: 'nums = [3, 1, 4, 1, 5, 9]\nprint(sorted(nums))',
                    expected: { type: 'stdout', value: '[1, 1, 3, 4, 5, 9]' },
                    hint: 'sorted(nums) возвращает новый список, nums.sort() меняет на месте',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l5',
          title: 'Словари и множества',
          minutes: 25,
          steps: [
            {
              id: 'py-l5-s1',
              title: 'Словари: ключ → значение',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Словарь — хеш-таблица произвольных ключей. Поиск по ключу — O(1). Ключи должны быть хешируемыми (строки, числа, кортежи — но не списки).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Базовые операции',
                  code: 'user = {"name": "Анна", "age": 25}\n\nuser["name"]              # "Анна"\nuser.get("email", "—")    # "—" (безопасный доступ)\nuser["email"] = "a@b.c"   # добавление\n\n"age" in user             # True\nuser.keys(), user.values(), user.items()\n\nfor key, value in user.items():\n    print(f"{key}: {value}")',
                },
                {
                  type: 'note',
                  text: 'Обращение user["key"] при отсутствии ключа — KeyError. Используйте user.get("key") или user.get("key", default) для безопасного чтения.',
                },
              ],
            },
            {
              id: 'py-l5-s2',
              title: 'Множества: уникальные элементы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Множества и операции над ними',
                  code: 'a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\na | b        # {1, 2, 3, 4, 5, 6} — объединение\na & b        # {3, 4} — пересечение\na - b        # {1, 2} — разность\na ^ b        # {1, 2, 5, 6} — симметричная разность\n\nlist(set([1, 1, 2, 2, 3]))   # [1, 2, 3] — дедупликация',
                },
                {
                  type: 'p',
                  text: 'Множества быстрые для проверки вхождения: `x in s` — O(1), тогда как `x in list` — O(n). Если нужно часто проверять «есть ли элемент» — это правильный выбор.',
                },
              ],
            },
            {
              id: 'py-l5-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой метод словаря безопасно вернёт значение по ключу или значение по умолчанию, если ключа нет? (только имя метода)',
                accepted: ['get'],
                placeholder: 'имя метода',
                hint: 'Такой же, как «получить» по-английски',
                explanation:
                  'user.get("key") вернёт None, если ключа нет; user.get("key", default) — указанное значение. Обращение через [] выбросило бы KeyError.',
              },
            },
            {
              id: 'py-l5-s4',
              title: 'Практика: словарь',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'user = {"name": "Анна", "age": 25}\n',
                    task: 'Напечатайте значение по ключу `age` из словаря `user`.',
                    solution: 'user = {"name": "Анна", "age": 25}\nprint(user["age"])',
                    expected: { type: 'stdout', value: '25' },
                    hint: 'user["age"] или user.get("age")',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Функции, модули, ошибки (было py-m3)
    // ─────────────────────────────────────────────
    {
      id: 'py-b-m4',
      title: 'Функции, модули, ошибки',
      lessons: [
        {
          id: 'py-l6',
          title: 'Функции',
          minutes: 25,
          steps: [
            {
              id: 'py-l6-s1',
              title: 'Объявление и аргументы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Функция со всеми видами аргументов',
                  code: 'def greet(name, greeting="Привет", *, punctuation="!"):\n    return f"{greeting}, {name}{punctuation}"\n\ngreet("Анна")                        # "Привет, Анна!"\ngreet("Борис", "Здравствуйте")        # "Здравствуйте, Борис!"\ngreet("Вера", punctuation=".")        # "Привет, Вера."',
                },
                {
                  type: 'list',
                  items: [
                    'Позиционные — по порядку',
                    'Именованные (keyword) — по имени',
                    'Со значением по умолчанию — greeting="Привет"',
                    'Только keyword — после * (запрещает позиционную передачу)',
                    '*args — любое число позиционных',
                    '**kwargs — любое число именованных',
                  ],
                },
                {
                  type: 'note',
                  text: 'Изменяемые значения по умолчанию — ловушка. `def f(lst=[]):` использует ОДИН список на все вызовы. Всегда используйте `def f(lst=None):` и внутри `lst = lst or []`.',
                },
              ],
            },
            {
              id: 'py-l6-s2',
              title: 'Области видимости и return',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Функция видит глобальные переменные, но изменить их без `global` не может. Возврат значения — через return. Функция без return возвращает None. Можно вернуть несколько значений кортежем.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  code: 'def stats(nums):\n    if not nums:\n        return None\n    return min(nums), max(nums), sum(nums) / len(nums)\n\nresult = stats([1, 2, 3, 4])\n# (1, 4, 2.5)\n\nlo, hi, avg = stats([1, 2, 3, 4])\n# распаковка',
                },
              ],
            },
            {
              id: 'py-l6-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `def f(items=[]):` считается плохой практикой?',
                options: [
                  { id: 'a', text: 'Так нельзя — синтаксическая ошибка' },
                  { id: 'b', text: 'Изменяемое значение по умолчанию создаётся один раз и переиспользуется между вызовами' },
                  { id: 'c', text: 'Список нельзя передать по умолчанию' },
                  { id: 'd', text: 'Это медленнее, чем None' },
                ],
                correct: ['b'],
                explanation:
                  'Значение по умолчанию вычисляется при объявлении функции, а не при каждом вызове. Изменения, сделанные внутри функции, «утекают» между вызовами. Решение: `items=None` и `items = items or []`.',
              },
            },
            {
              id: 'py-l6-s4',
              title: 'Практика: функция',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'def square(n):\n    # верните n в квадрате\n    pass\n',
                    task: 'Допишите функцию `square(n)`, возвращающую `n * n`. Присвойте результат `square(7)` переменной `result`.',
                    solution: 'def square(n):\n    return n * n\n\nresult = square(7)',
                    expected: { type: 'variable', name: 'result', value: 49 },
                    hint: 'return n * n',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l7',
          title: 'Модули и импорты',
          minutes: 20,
          steps: [
            {
              id: 'py-l7-s1',
              title: 'Импорт из стандартной библиотеки',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Часто используемые модули',
                  code: 'import os                         # работа с ОС\nimport json                       # JSON\nfrom pathlib import Path           # файлы\nfrom datetime import datetime      # даты\nimport random                      # случайности\n\nprint(json.dumps({"a": 1}))         # \'{"a": 1}\'\nprint(Path("data.txt").exists())   # True / False\nprint(datetime.now().year)',
                },
                {
                  type: 'list',
                  items: [
                    'import module — весь модуль, доступ через module.func()',
                    'from module import name — только нужное',
                    'import module as alias — псевдоним (import numpy as np)',
                    'Избегайте from module import * — засоряет пространство имён',
                  ],
                },
              ],
            },
            {
              id: 'py-l7-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая конструкция позволяет запустить файл и как скрипт, и импортировать из него функции?',
                options: [
                  { id: 'a', text: 'def main()' },
                  { id: 'b', text: 'if __name__ == "__main__":' },
                  { id: 'c', text: 'import __main__' },
                  { id: 'd', text: 'class Main' },
                ],
                correct: ['b'],
                explanation:
                  'При запуске файла напрямую __name__ == "__main__". При импорте __name__ равен имени модуля. Это позволяет отделить «что делать при запуске» от «что определять».',
              },
            },
            {
              id: 'py-l7-s3',
              title: 'Практика: импорт модуля',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'import math\n\n# Напечатайте math.sqrt(16)\n',
                    task: 'Импортируйте `math` и напечатайте `math.sqrt(16)`.',
                    solution: 'import math\nprint(math.sqrt(16))',
                    expected: { type: 'stdout', value: '4.0' },
                    hint: 'import math в начале, потом print(math.sqrt(16))',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l8',
          title: 'Файлы и ошибки',
          minutes: 25,
          steps: [
            {
              id: 'py-l8-s1',
              title: 'Чтение и запись файлов',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Современный способ: pathlib + контекстный менеджер',
                  code: 'from pathlib import Path\n\np = Path("data.txt")\n\n# Запись\np.write_text("привет\\nмир", encoding="utf-8")\n\n# Чтение\ncontent = p.read_text(encoding="utf-8")\nprint(content)\n\n# Построчно\nwith p.open(encoding="utf-8") as f:\n    for line in f:\n        print(line.rstrip())',
                },
                {
                  type: 'note',
                  text: 'with гарантирует закрытие файла даже при исключении. Без with можно забыть f.close() и получить утечку дескрипторов. Всегда указывайте encoding="utf-8" — по умолчанию на Windows это cp1251.',
                },
              ],
            },
            {
              id: 'py-l8-s2',
              title: 'try / except / finally',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Обработка ошибок',
                  code: 'try:\n    n = int("не число")\nexcept ValueError as e:\n    print(f"Ошибка: {e}")\nfinally:\n    print("Выполнится всегда")',
                },
                {
                  type: 'list',
                  items: [
                    'except ValueError — только конкретное исключение',
                    'except Exception — слишком широко, маскирует баги',
                    'else — если try прошёл без ошибок',
                    'finally — выполнится в любом случае (освобождение ресурсов)',
                    'raise — перевыбросить или создать своё',
                  ],
                },
                {
                  type: 'note',
                  text: 'Не глотайте ошибки молча: `except: pass` — зло. Логируйте или обрабатывайте осознанно. `except Exception` без повторного raise прячет настоящие проблемы.',
                },
              ],
            },
            {
              id: 'py-l8-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда выполняется блок `finally`?',
                options: [
                  { id: 'a', text: 'Только если ошибок не было' },
                  { id: 'b', text: 'Только если была ошибка' },
                  { id: 'c', text: 'Всегда — и при успехе, и при ошибке' },
                  { id: 'd', text: 'Никогда, если ошибка не поймана' },
                ],
                correct: ['c'],
                explanation:
                  'finally выполняется всегда, даже если try выбросил исключение, которое не поймали, или внутри try / except был return. Идеальное место для освобождения ресурсов.',
              },
            },
            {
              id: 'py-l8-s4',
              title: 'Практика: try / except',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: '# Поймайте ValueError от int("abc")\n',
                    task: 'Напишите `try / except ValueError`, который пытается `int("abc")` и в случае ошибки печатает `"не число"`.',
                    solution: 'try:\n    int("abc")\nexcept ValueError:\n    print("не число")',
                    expected: { type: 'stdout', value: 'не число' },
                    hint: 'try: int("abc") except ValueError: print(...)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Коллекции: углублённо (было py-m4)
    // ─────────────────────────────────────────────
    {
      id: 'py-b-m5',
      title: 'Коллекции: углублённо',
      lessons: [
        {
          id: 'py-l13',
          title: 'List comprehensions',
          minutes: 20,
          steps: [
            {
              id: 'py-l13-s1',
              title: 'Однострочные преобразования',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'List comprehension — это способ создать список через «формулу» в одну строку. Читается как «взять каждый элемент и что-то с ним сделать».',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Классический цикл vs comprehension',
                  code: '# Обычный цикл\nsquares = []\nfor x in range(10):\n    squares.append(x ** 2)\n\n# То же самое — comprehension\nsquares = [x ** 2 for x in range(10)]\n\n# С условием\nodds = [x for x in range(20) if x % 2 == 1]\n\n# С преобразованием строк\nnames = ["анна", "борис", "вера"]\ncapitalized = [n.capitalize() for n in names]\n# ["Анна", "Борис", "Вера"]',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Вложенные и словарные',
                  code: '# Словарное включение\nd = {x: x ** 2 for x in range(5)}\n# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}\n\n# Множество\ns = {x % 3 for x in range(10)}\n# {0, 1, 2}\n\n# Двойной for\npairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]\n# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]',
                },
                {
                  type: 'note',
                  text: 'Comprehension — это НЕ всегда лучше. Если внутри сложное условие или несколько for — читаемость падает. Правило: если не влезает в одну строку осмысленно — пишите обычный цикл.',
                },
              ],
            },
            {
              id: 'py-l13-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что вернёт `[x * 2 for x in [1, 2, 3] if x > 1]`?',
                options: [
                  { id: 'a', text: '[2, 4, 6]' },
                  { id: 'b', text: '[4, 6]' },
                  { id: 'c', text: '[2, 4, 6, 8]' },
                  { id: 'd', text: 'Ошибку' },
                ],
                correct: ['b'],
                explanation:
                  'Сначала фильтр `if x > 1` оставляет [2, 3]. Затем каждый умножается на 2 → [4, 6]. Единица отброшена.',
              },
            },
            {
              id: 'py-l13-s3',
              title: 'Практика: list comprehension',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: '# Создайте squares — квадраты чисел от 0 до 9\n',
                    task: 'С помощью list comprehension создайте список `squares` — квадраты чисел от 0 до 9 включительно. Напечатайте результат.',
                    solution: 'squares = [x ** 2 for x in range(10)]\nprint(squares)',
                    expected: {
                      type: 'stdout',
                      value: '[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]',
                    },
                    hint: '[x ** 2 for x in range(10)]',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l14',
          title: 'sorted, key и lambda',
          minutes: 20,
          steps: [
            {
              id: 'py-l14-s1',
              title: 'Сортировка по ключу',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: '`sorted()` сортирует по возрастанию. Параметр `key` позволяет задать «что считать ключом сортировки» — это открывает сортировку по любому правилу.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Сортировка по разным ключам',
                  code: 'words = ["banana", "apple", "cherry"]\n\nsorted(words)                             # ["apple", "banana", "cherry"]\nsorted(words, key=len)                    # ["apple", "banana", "cherry"] (по длине)\nsorted(words, key=len, reverse=True)      # ["banana", "cherry", "apple"]\nsorted(words, key=lambda w: w[-1])        # ["banana", "apple", "cherry"] (по последней букве)\n\nusers = [\n    {"name": "Анна", "age": 25},\n    {"name": "Борис", "age": 30},\n    {"name": "Вера", "age": 20},\n]\nsorted(users, key=lambda u: u["age"])\n# [{"Вера", 20}, {"Анна", 25}, {"Борис", 30}]',
                },
                {
                  type: 'note',
                  text: '`lambda` — это короткая безымянная функция: `lambda x: x["age"]` эквивалентно `def f(x): return x["age"]`. Используйте только для простых выражений в key, sort, filter.',
                },
              ],
            },
            {
              id: 'py-l14-s2',
              title: 'Сортировка по нескольким полям',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Кортеж как ключ',
                  code: 'users = [\n    {"name": "Анна", "age": 25, "city": "Москва"},\n    {"name": "Борис", "age": 30, "city": "Москва"},\n    {"name": "Вера", "age": 25, "city": "Питер"},\n]\n\n# Сначала по городу, потом по возрасту\nsorted(users, key=lambda u: (u["city"], u["age"]))\n# Москва/25, Москва/30, Питер/25',
                },
                {
                  type: 'p',
                  text: 'Кортежи сравниваются лексикографически: сначала первый элемент, при равенстве — второй и т.д. Это позволяет задавать многоуровневую сортировку без сложной логики.',
                },
              ],
            },
            {
              id: 'py-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как отсортировать список строк по убыванию длины?',
                options: [
                  { id: 'a', text: 'sorted(words, reverse=True)' },
                  { id: 'b', text: 'sorted(words, key=len, reverse=True)' },
                  { id: 'c', text: 'words.sort(len)' },
                  { id: 'd', text: 'sorted(words).reverse()' },
                ],
                correct: ['b'],
                explanation:
                  'key=len задаёт ключ «длина», reverse=True — порядок по убыванию. Вариант A сортирует по алфавиту, C — синтаксическая ошибка, D разворачивает алфавитный порядок.',
              },
            },
                        {
              id: 'py-l14-s4',
              title: 'Практика: sorted с key',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode: 'words = ["banana", "apple", "cherry"]\n',
                    task: 'Отсортируйте `words` по длине слова (от короткого к длинному) и напечатайте результат.',
                    solution: 'words = ["banana", "apple", "cherry"]\nprint(sorted(words, key=len))',
                    expected: { type: 'stdout', value: "['apple', 'banana', 'cherry']" },
                    hint: 'sorted(words, key=len)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
  id: 'py-b-m6',
  title: 'Практикум',
  lessons: [
    {
      id: 'py-l35',
      title: 'Практика: операторы, коллекции, функции, ошибки',
      minutes: 35,
      steps: [
        {
          id: 'py-l35-s1',
          title: 'Тип результата деления',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Какой тип вернёт выражение `10 / 2`?',
            options: [
              { id: 'a', text: 'int' },
              { id: 'b', text: 'float' },
              { id: 'c', text: 'str' },
              { id: 'd', text: 'bool' },
            ],
            correct: ['b'],
            explanation: 'Оператор / в Python 3 всегда возвращает float, даже если деление нацело: 10 / 2 = 5.0. Целочисленное деление — это //.',
          },
        },
        {
          id: 'py-l35-s2',
          title: 'Метод strip',
          type: 'quiz',
          quiz: {
            kind: 'fill',
            question: 'Какой метод строки убирает пробельные символы по краям? (только имя метода)',
            accepted: ['strip', 'strip()'],
            placeholder: 'имя метода',
            hint: 'от английского «снимать, очищать»',
            explanation: '"  hello  ".strip() → "hello". Также есть lstrip() и rstrip() — только слева / только справа.',
          },
        },
        {
          id: 'py-l35-s3',
          title: 'enumerate',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Что вернёт `list(enumerate(["a", "b", "c"]))`?',
            options: [
              { id: 'a', text: '["a", "b", "c"]' },
              { id: 'b', text: '[(1, "a"), (2, "b"), (3, "c")]' },
              { id: 'c', text: '[(0, "a"), (1, "b"), (2, "c")]' },
              { id: 'd', text: '[1, 2, 3]' },
            ],
            correct: ['c'],
            explanation: 'enumerate по умолчанию начинает с 0. Возвращает пары (индекс, значение). Начать с 1 можно через enumerate(..., start=1).',
          },
        },
        {
          id: 'py-l35-s4',
          title: 'Порядок действий со списком',
          type: 'quiz',
          quiz: {
            kind: 'sorting',
            question: 'Расставьте операции в правильном порядке',
            items: ['nums = []', 'nums.append(3)', 'nums.append(1)', 'nums.sort()', 'print(nums)'],
            correct: ['nums = []', 'nums.append(3)', 'nums.append(1)', 'nums.sort()', 'print(nums)'],
            explanation: 'Создали список → добавили элементы → отсортировали → вывели. nums.sort() сортирует на месте и возвращает None (классическая ловушка).',
          },
        },
        {
          id: 'py-l35-s5',
          title: 'Truthiness нуля',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Что выведет `x = 0; if x: print("да"); else: print("нет")`?',
            options: [
              { id: 'a', text: 'да' },
              { id: 'b', text: 'нет' },
              { id: 'c', text: 'Ошибку' },
              { id: 'd', text: 'Ничего' },
            ],
            correct: ['b'],
            explanation: '0 в логическом контексте ложен (falsy). То же самое с пустой строкой, пустым списком, None. Поэтому if x: срабатывает только при «непустом» значении.',
          },
        },
        {
          id: 'py-l35-s6',
          title: 'Безопасный доступ к словарю',
          type: 'quiz',
          quiz: {
            kind: 'fill',
            question: 'Какой метод словаря безопасно вернёт значение по ключу или значение по умолчанию, если ключа нет? (только имя метода)',
            accepted: ['get', 'get()'],
            placeholder: 'имя метода',
            hint: 'от английского «получить»',
            explanation: 'user.get("email") вернёт None, если ключа нет; user.get("email", "—") — значение по умолчанию. Обращение через [] выбросит KeyError.',
          },
        },
        {
          id: 'py-l35-s7',
          title: 'Кортеж неизменяем',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Что произойдёт при `t = (1, 2, 3); t[0] = 100`?',
            options: [
              { id: 'a', text: 'Кортеж станет (100, 2, 3)' },
              { id: 'b', text: 'Возникнет TypeError' },
              { id: 'c', text: 'Кортеж станет (1, 2, 3, 100)' },
              { id: 'd', text: 'Тихо проигнорируется' },
            ],
            correct: ['b'],
            explanation: 'Кортежи неизменяемы. Для изменяемости — list. Для фиксированного набора (координаты, RGB) — tuple и гарантия от случайных изменений.',
          },
        },
        {
          id: 'py-l35-s8',
          title: 'Ловушка аргументов',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Почему `def add(item, items=[])` считается плохой практикой?',
            options: [
              { id: 'a', text: 'Синтаксическая ошибка' },
              { id: 'b', text: 'Изменяемое значение по умолчанию создаётся один раз и переиспользуется между вызовами' },
              { id: 'c', text: 'Слишком медленно' },
              { id: 'd', text: 'Работает только в Python 2' },
            ],
            correct: ['b'],
            explanation: 'Значение по умолчанию вычисляется при объявлении функции. Один список — на все вызовы. Правильно: items=None и внутри items = items or [].',
          },
        },
        {
          id: 'py-l35-s9',
          title: 'Функция is_even',
          type: 'quiz',
          quiz: {
            kind: 'code',
            question: 'Напишите функцию `is_even(n)`, возвращающую True для чётных n и False для нечётных.',
            starterCode: 'def is_even(n):\n    ',
            mustInclude: [
              { pattern: 'def is_even\\(n\\)', message: 'Нужна функция is_even(n)' },
              { pattern: 'return', message: 'Нужен return' },
              { pattern: '%\\s*2', message: 'Используйте остаток от деления %' },
            ],
            explanation: 'def is_even(n):\n    return n % 2 == 0',
          },
        },
        {
          id: 'py-l35-s10',
          title: 'List comprehension',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Что вернёт `[x * 2 for x in [1, 2, 3] if x > 1]`?',
            options: [
              { id: 'a', text: '[2, 4, 6]' },
              { id: 'b', text: '[4, 6]' },
              { id: 'c', text: '[2, 4, 6, 8]' },
              { id: 'd', text: 'Ошибку' },
            ],
            correct: ['b'],
            explanation: 'Фильтр if x > 1 оставляет [2, 3]. Каждый умножается на 2 → [4, 6]. Единица отброшена ещё до умножения.',
          },
        },
      ],
    },
  ],
},
  ],
};