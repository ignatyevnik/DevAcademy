import type { Course } from './types';

export const pythonCourse: Course = {
  slug: 'python-basics',
  title: 'Python с нуля',
  subtitle: 'Синтаксис, структуры данных и первые программы — фундамент для QA и автоматизации',
  description:
    'Курс для тех, кто впервые программирует. Разберётесь с переменными, условиями, циклами, коллекциями, функциями и файлами. Каждая тема закрепляется практикой: без «Hello, World» на 10 уроков — сразу к делу.',
  level: 'Новичок',
  tags: ['Python', 'Основы', 'Программирование'],
  accent: '#3776ab',
  icon: 'python',
  outcomes: [
    'Писать и запускать простые скрипты на Python',
    'Работать со списками, словарями и множествами',
    'Писать функции и разбивать код на модули',
    'Читать и записывать файлы, обрабатывать ошибки',
  ],
  requirements: ['Установленный Python 3.10+ (для практики)', 'Любой редактор кода'],
  modules: [
        {
      id: 'py-m0',
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
          ],
        },
      ],
    },
    {
      id: 'py-m1',
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
          ],
        },
      ],
    },
    {
      id: 'py-m2',
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
          ],
        },
      ],
    },
    {
      id: 'py-m3',
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
          ],
        },
      ],
    },
	    {
      id: 'py-m4',
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
          ],
        },
      ],
        },     // ← конец py-m4
    {
      id: 'py-m5',
      title: 'ООП: классы и объекты',
      lessons: [
        {
          id: 'py-l15',
          title: 'Классы и экземпляры',
          minutes: 25,
          steps: [
            {
              id: 'py-l15-s1',
              title: 'Первый класс',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Класс — это шаблон, экземпляр (объект) — конкретная «вещь» по этому шаблону. В автотестах классы нужны постоянно: Page Object, клиент API, фикстуры, тестовые данные. Без ООП код тестов превращается в 500-строчный файл с функциями.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Класс Cart и его экземпляры',
                  code: 'class Cart:\n    def __init__(self):\n        self.items = []      # атрибут экземпляра\n        self.total = 0\n\n    def add(self, name, price, qty=1):\n        self.items.append({"name": name, "price": price, "qty": qty})\n        self.total += price * qty\n\n    def clear(self):\n        self.items = []\n        self.total = 0\n\n# Экземпляры — независимы друг от друга\ncart1 = Cart()\ncart2 = Cart()\n\ncart1.add("яблоко", 100, 2)\nprint(cart1.total)    # 200\nprint(cart2.total)    # 0 — у cart2 свой total',
                },
                {
                  type: 'list',
                  items: [
                    'class Cart: — объявление класса',
                    '__init__(self) — конструктор, вызывается при Cart()',
                    'self — ссылка на текущий экземпляр; без него методы не видят атрибуты',
                    'self.items, self.total — атрибуты экземпляра, у каждого объекта свои',
                    'cart1 и cart2 независимы: изменили один — второй не затронут',
                  ],
                },
                {
                  type: 'note',
                  text: 'Забыть self в параметрах — классическая ошибка новичка: def add(name, price) вместо def add(self, name, price). Python вызовет метод с self, а параметров не хватит → TypeError. Запомните: self — всегда первый параметр метода экземпляра.',
                },
              ],
            },
            {
              id: 'py-l15-s2',
              title: 'Атрибуты класса vs экземпляра',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Опасность изменяемого атрибута класса',
                  code: 'class Cart:\n    items = []         # ← атрибут КЛАССА (общий для всех!)\n\n    def add(self, item):\n        self.items.append(item)   # ← меняет ОБЩИЙ список\n\nc1 = Cart()\nc2 = Cart()\n\nc1.add("яблоко")\nprint(c1.items)   # ["яблоко"]\nprint(c2.items)   # ["яблоко"] — сюрприз! Не пустой\n\n# ПРАВИЛЬНО:\nclass Cart:\n    def __init__(self):\n        self.items = []   # ← у каждого свой',
                },
                {
                  type: 'p',
                  text: 'Это та же ловушка, что `def f(lst=[])` из урока про функции. Изменяемые значения на уровне класса разделяются между всеми экземплярами. Правило: изменяемые (list, dict, set) — всегда в __init__, никогда в теле класса.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Когда атрибут класса уместен',
                  code: 'class User:\n    # Константы — неизменяемые, можно на уровне класса\n    MAX_LOGIN_ATTEMPTS = 5\n    ROLE_ADMIN = "admin"\n    ROLE_USER = "user"\n\n    def __init__(self, name, role=ROLE_USER):\n        self.name = name\n        self.role = role\n        self.attempts = 0    # счётчик — у каждого свой, в __init__',
                },
              ],
            },
            {
              id: 'py-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `items = []` в теле класса Cart — плохо?',
                options: [
                  { id: 'a', text: 'Так нельзя — синтаксическая ошибка' },
                  { id: 'b', text: 'Этот список общий для всех экземпляров: изменения видны у всех' },
                  { id: 'c', text: 'Он медленнее, чем в __init__' },
                  { id: 'd', text: 'Python удалит его при первом же вызове' },
                ],
                correct: ['b'],
                explanation:
                  'Атрибут класса создаётся один раз и разделяется между всеми экземплярами. Если он изменяемый (list, dict), то c1.add() изменит список и у c2. Правило: изменяемые атрибуты — всегда в __init__.',
              },
            },
          ],
        },
        {
          id: 'py-l16',
          title: 'Наследование и композиция',
          minutes: 25,
          steps: [
            {
              id: 'py-l16-s1',
              title: 'Наследование',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Наследование — «частный случай». Есть базовый класс (Page) и наследники (LoginPage, CartPage), которые дополняют или переопределяют поведение. В Playwright Page Object наследование часто используется для общей логики: navigate, wait_for_ready, screenshot.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Базовый класс + наследники',
                  code: 'class Page:\n    def __init__(self, driver):\n        self.driver = driver\n\n    def open(self, url):\n        self.driver.get(url)\n        return self\n\n    def screenshot(self, name):\n        self.driver.save_screenshot(f"{name}.png")\n\nclass LoginPage(Page):\n    def login(self, email, password):\n        self.driver.find_element("id", "email").send_keys(email)\n        self.driver.find_element("id", "password").send_keys(password)\n        self.driver.find_element("id", "submit").click()\n        return self\n\nclass CartPage(Page):\n    def add_item(self, product_id):\n        self.driver.find_element("css", f".add-{product_id}").click()\n        return self\n\n# LoginPage и CartPage унаследовали open и screenshot\nlogin = LoginPage(driver)\nlogin.open("/login").login("test@x.com", "secret").screenshot("after_login")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Переопределение и super()',
                  code: 'class AdminPage(Page):\n    def __init__(self, driver, admin_token):\n        super().__init__(driver)   # вызвать __init__ родителя\n        self.admin_token = admin_token\n\n    def open(self, url):\n        # переопределяем: добавляем токен в URL\n        super().open(f"{url}?token={self.admin_token}")\n        return self',
                },
                {
                  type: 'note',
                  text: 'super().__init__(...) — вызвать родительский конструктор. Без этого self.driver не будет установлен, и методы родителя упадут с AttributeError. Если переопределяете метод — вызывайте super(), если хотите сохранить поведение родителя.',
                },
              ],
            },
            {
              id: 'py-l16-s2',
              title: 'Композиция: «есть» vs «является»',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Наследование — «является» (LoginPage — это Page). Композиция — «есть» (CheckoutPage содержит CartPage). В реальных фреймворках композиция используется чаще: она гибче и не создаёт хрупких иерархий.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Композиция вместо наследования',
                  code: 'class CheckoutPage(Page):\n    def __init__(self, driver):\n        super().__init__(driver)\n        self.cart = CartPage(driver)     # композиция\n        self.payment = PaymentForm(driver)\n\n    def buy(self):\n        self.cart.add_item(42)\n        self.payment.pay("4111 1111 1111 1111")\n\n# Не «CheckoutPage — это CartPage», а\n# «CheckoutPage использует CartPage и PaymentForm»',
                },
                {
                  type: 'list',
                  items: [
                    'Наследование: «X является Y». LoginPage → Page',
                    'Композиция: «X использует Y». CheckoutPage → CartPage, PaymentForm',
                    'Наследование даёт все методы родителя сразу; композиция — только то, что явно вызвано',
                    'Наследование жёстче: изменение родителя ломает всех наследников',
                    'Правило: если сомневаетесь — начинайте с композиции',
                  ],
                },
              ],
            },
            {
              id: 'py-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как вызвать __init__ родительского класса?',
                options: [
                  { id: 'a', text: 'parent().__init__()' },
                  { id: 'b', text: 'super().__init__()' },
                  { id: 'c', text: 'self.parent.__init__()' },
                  { id: 'd', text: 'В Python это делается автоматически' },
                ],
                correct: ['b'],
                explanation:
                  'super().__init__() вызывает конструктор родителя. В Python 3 он автоматически определяет MRO (порядок обхода родителей). Без этого вызова self.driver и другие атрибуты не установятся.',
              },
            },
          ],
        },
        {
          id: 'py-l17',
          title: 'Dataclass и магические методы',
          minutes: 25,
          steps: [
            {
              id: 'py-l17-s1',
              title: 'Dataclass вместо ручного __init__',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Dataclass — декоратор, который сам генерирует __init__, __repr__, __eq__ по аннотациям типов. Идеален для «структур данных»: тестовых данных, DTO, конфигов. Вместо 20 строк — три.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Ручной класс vs dataclass',
                  code: 'from dataclasses import dataclass, field\n\n# Ручной\nclass User:\n    def __init__(self, name, email, age=0):\n        self.name = name\n        self.email = email\n        self.age = age\n\n    def __repr__(self):\n        return f"User(name={self.name!r}, email={self.email!r}, age={self.age})"\n\n    def __eq__(self, other):\n        return (self.name, self.email, self.age) == (other.name, other.email, other.age)\n\n# Dataclass — то же самое, 3 строки\n@dataclass\nclass User:\n    name: str\n    email: str\n    age: int = 0\n\n# Готово: __init__, __repr__, __eq__ уже есть\nu1 = User("Анна", "a@x.com")\nu2 = User("Анна", "a@x.com")\nprint(u1 == u2)      # True — сравнение по полям\nprint(u1)            # User(name=\'Анна\', email=\'a@x.com\', age=0)',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'frozen, field, порядок',
                  code: 'from dataclasses import dataclass, field\n\n@dataclass(frozen=True)         # неизменяемый (как кортеж)\nclass Point:\n    x: int\n    y: int\n\n# p = Point(1, 2)\n# p.x = 10   # ошибка: FrozenInstanceError\n\n@dataclass\nclass Cart:\n    items: list = field(default_factory=list)   # новый список на каждый объект\n    total: float = 0.0',
                },
                {
                  type: 'note',
                  text: 'field(default_factory=list) — правильный способ задать изменяемое значение по умолчанию. items: list = [] вызовет ту же ошибку, что в обычном __init__(lst=[]): один список на все объекты.',
                },
              ],
            },
            {
              id: 'py-l17-s2',
              title: 'Магические методы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Магические методы (dunder methods) — «подписки» на синтаксис Python. Определите __len__ — и len(obj) заработает. __str__ — print. __eq__ — ==. Это делает объекты «естественными» в коде.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Часто используемые',
                  code: 'class Money:\n    def __init__(self, amount, currency="RUB"):\n        self.amount = amount\n        self.currency = currency\n\n    def __str__(self):                 # print(money), str(money)\n        return f"{self.amount} {self.currency}"\n\n    def __repr__(self):                # repr(money), в REPL\n        return f"Money({self.amount!r}, {self.currency!r})"\n\n    def __eq__(self, other):           # ==\n        return self.amount == other.amount and self.currency == other.currency\n\n    def __lt__(self, other):           # <\n        return self.amount < other.amount\n\n    def __add__(self, other):          # +\n        return Money(self.amount + other.amount, self.currency)\n\n    def __len__(self):                 # len()\n        return len(str(self.amount))\n\nm1 = Money(100)\nm2 = Money(250)\nprint(m1 + m2)             # 350 RUB\nprint(m1 < m2)             # True\nprint(m1 == Money(100))    # True',
                },
                {
                  type: 'table',
                  caption: 'Минимальный набор для структуры данных',
                  head: ['Метод', 'Что активирует'],
                  rows: [
                    ['__init__', 'Объект()'],
                    ['__repr__', 'repr(obj), отладчик, логи'],
                    ['__str__', 'print(obj), str(obj), f"{obj}"'],
                    ['__eq__', '==, !='],
                    ['__lt__ / __gt__', '<, > (сортировка)'],
                    ['__hash__', 'hash(obj), использование в set/dict'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Если определяете __eq__ — Python по умолчанию обнулит __hash__ (объект станет нехешируемым). Для использования в set/dict добавьте @dataclass(frozen=True) или определите __hash__ вручную. Для автотестов это важно: тестовые данные часто кладут в set/dict.',
                },
              ],
            },
            {
              id: 'py-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какой магический метод определяет поведение `==` для экземпляров класса? (полное имя с двумя подчёркиваниями)',
                accepted: ['__eq__', 'eq', '__eq__()'],
                placeholder: 'dunder-метод',
                hint: 'от английского «equal»',
                explanation:
                  '__eq__ (equals). Если определить — сравнение через == будет сравнивать то, что вы хотите, а не идентичность объектов в памяти. Dataclass генерирует его автоматически.',
              },
            },
          ],
        },
        {
          id: 'py-l18',
          title: 'Классы в автотестах: Page Object',
          minutes: 30,
          steps: [
            {
              id: 'py-l18-s1',
              title: 'Реальный Page Object',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Соберём всё из модуля в реальный Page Object для Playwright. С классами, self, dataclass для данных, методами-цепочками — как в настоящем проекте автотестов.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'pages/login_page.py',
                  code: 'from dataclasses import dataclass\nfrom playwright.sync_api import Page, expect\n\n@dataclass\nclass Credentials:\n    email: str\n    password: str\n\nclass LoginPage:\n    def __init__(self, page: Page):\n        self.page = page\n        self.email_input = page.get_by_label("Email")\n        self.password_input = page.get_by_label("Password")\n        self.submit = page.get_by_role("button", name="Войти")\n        self.error = page.get_by_role("alert")\n\n    def open(self):\n        self.page.goto("/login")\n        return self\n\n    def login(self, creds: Credentials):\n        self.email_input.fill(creds.email)\n        self.password_input.fill(creds.password)\n        self.submit.click()\n        return self\n\n    def expect_error(self, text: str):\n        expect(self.error).to_have_text(text)\n        return self\n\n    def expect_success(self):\n        expect(self.page).to_have_url("/dashboard")\n        return self',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'tests/test_login.py',
                  code: 'from pages.login_page import LoginPage, Credentials\n\ndef test_login_success(page):\n    creds = Credentials(email="anna@x.com", password="secret")\n    LoginPage(page).open().login(creds).expect_success()\n\ndef test_login_wrong_password(page):\n    creds = Credentials(email="anna@x.com", password="wrong")\n    LoginPage(page).open().login(creds).expect_error("Неверный пароль")',
                },
                {
                  type: 'list',
                  items: [
                    'Credentials — dataclass для тестовых данных (легко сравнивать, печатать)',
                    'LoginPage — класс, инкапсулирующий работу со страницей',
                    'self.page, self.email_input — атрибуты, доступные всем методам',
                    'Методы возвращают self — можно строить цепочки: open().login(...).expect_success()',
                    'expect_error, expect_success — читаемые проверки внутри класса',
                  ],
                },
              ],
            },
            {
              id: 'py-l18-s2',
              title: 'Почему это лучше, чем просто функции',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Тот же тест без ООП — «функциональный» подход',
                  code: 'def test_login_success(page):\n    page.goto("/login")\n    page.get_by_label("Email").fill("anna@x.com")\n    page.get_by_label("Password").fill("secret")\n    page.get_by_role("button", name="Войти").click()\n    expect(page).to_have_url("/dashboard")\n\ndef test_login_wrong(page):\n    page.goto("/login")\n    page.get_by_label("Email").fill("anna@x.com")    # дубль\n    page.get_by_label("Password").fill("wrong")       # дубль\n    page.get_by_role("button", name="Войти").click()  # дубль\n    expect(page.get_by_role("alert")).to_have_text("Неверный пароль")',
                },
                {
                  type: 'list',
                  items: [
                    'Локаторы дублируются в каждом тесте — 100 тестов × 4 локатора = 400 дублей',
                    'Изменился id поля — правка в 100 местах',
                    'Нет переиспользования: сценарий «логин» размазан по каждому тесту',
                    'С ООП: правка локатора — в одном месте (LoginPage), тесты не трогаем',
                    'С ООП: новый тест — 2 строки вместо 6',
                  ],
                },
                {
                  type: 'note',
                  text: 'Это и есть смысл ООП в тестах: не «использовать классы, потому что так принято», а «вынести повторяющееся в одно место». Если тест из 5 строк используется один раз — можно и без класса. Если сценарий повторяется — Page Object оправдан.',
                },
              ],
            },
            {
              id: 'py-l18-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что даёт Page Object в автотестах?',
                options: [
                  { id: 'a', text: 'Локаторы хранятся в одном месте — при изменении вёрстки правится одно место' },
                  { id: 'b', text: 'Тесты становятся короче и читаемее' },
                  { id: 'c', text: 'Тесты выполняются быстрее' },
                  { id: 'd', text: 'Общие сценарии (login) переиспользуются между тестами' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Page Object — про поддерживаемость и переиспользование, не про скорость. Тесты не ускоряются (DOM-операции те же), но правки в одном месте, читаемость выше, сценарии переиспользуются.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'py-m6',
      title: 'Декораторы и генераторы',
      lessons: [
        {
          id: 'py-l19',
          title: 'Функции как объекты',
          minutes: 20,
          steps: [
            {
              id: 'py-l19-s1',
              title: 'Функция — это тоже значение',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В Python функция — такой же объект, как число или строка. Её можно передать в другую функцию, вернуть из функции, сохранить в переменную. Без этого понимания декораторы — магия.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Функции как значения',
                  code: 'def greet(name):\n    return f"Привет, {name}"\n\n# Сохранили в переменную\nhello = greet\nprint(hello("Анна"))    # Привет, Анна\n\n# Передали как аргумент\ndef call_twice(func, arg):\n    return func(arg) + " | " + func(arg)\n\nprint(call_twice(greet, "Борис"))\n# Привет, Борис | Привет, Борис\n\n# Вернули из функции\ndef make_greeter(greeting):\n    def inner(name):\n        return f"{greeting}, {name}"\n    return inner\n\nformal = make_greeter("Здравствуйте")\ncasual = make_greeter("Привет")\nprint(formal("Вера"))    # Здравствуйте, Вера\nprint(casual("Глеб"))    # Привет, Глеб',
                },
                {
                  type: 'note',
                  text: 'inner — замыкание (closure): она «помнит» greeting из внешней функции, даже когда make_greeter уже завершилась. Это основа декораторов, фабрик функций и многого другого.',
                },
              ],
            },
            {
              id: 'py-l19-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое замыкание (closure)?',
                options: [
                  { id: 'a', text: 'Функция, которая завершает программу' },
                  { id: 'b', text: 'Функция, которая «помнит» переменные из внешней функции, даже после её завершения' },
                  { id: 'c', text: 'Приватная функция внутри класса' },
                  { id: 'd', text: 'Функция без аргументов' },
                ],
                correct: ['b'],
                explanation:
                  'inner в примере выше помнит greeting. Это и есть замыкание. Декораторы работают именно на этом: обёртка «помнит» декорируемую функцию.',
              },
            },
          ],
        },
        {
          id: 'py-l20',
          title: 'Декораторы',
          minutes: 30,
          steps: [
            {
              id: 'py-l20-s1',
              title: 'Как устроен декоратор',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Декоратор — это функция, которая принимает функцию и возвращает новую функцию (обёртку). Синтаксис @decorator — просто сахар: f = decorator(f).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Декоратор с нуля',
                  code: 'import time\nimport functools\n\ndef timer(func):\n    @functools.wraps(func)         # сохраняет имя, docstring, аннотации\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} заняла {elapsed:.3f} сек")\n        return result\n    return wrapper\n\n@timer\ndef slow_task(n):\n    time.sleep(n)\n    return n * 2\n\nresult = slow_task(0.5)\n# slow_task заняла 0.502 сек\n# result = 1.0',
                },
                {
                  type: 'list',
                  items: [
                    'timer(func) принимает функцию',
                    'wrapper(*args, **kwargs) — принимает любые аргументы и передаёт их в func',
                    '@functools.wraps(func) — сохраняет __name__, __doc__, аннотации. Без него slow_task.__name__ был бы "wrapper"',
                    'return wrapper — вернуть обёртку',
                    '@timer перед def slow_task — эквивалентно slow_task = timer(slow_task)',
                  ],
                },
              ],
            },
            {
              id: 'py-l20-s2',
              title: 'Декораторы с параметрами',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Декоратор с аргументом — три уровня вложенности',
                  code: 'import functools\nimport time\n\ndef retry(times=3, delay=1):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == times:\n                        raise\n                    print(f"Попытка {attempt} упала: {e}. Повтор через {delay}с")\n                    time.sleep(delay)\n        return wrapper\n    return decorator\n\n@retry(times=5, delay=0.1)\ndef fetch_user(user_id):\n    print(f"Запрос user {user_id}")\n    raise ConnectionError("server unavailable")\n\n# Попытка 1 упала: server unavailable. Повтор через 0.1с\n# ... 5 раз, затем ConnectionError',
                },
                {
                  type: 'p',
                  text: 'С параметрами декоратор становится трёхуровневым: retry(times) → decorator(func) → wrapper(*args). Это стандартный паттерн, который встречается в pytest, Django, FastAPI.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Готовые декораторы из стандартной библиотеки',
                  code: 'import functools\n\n# lru_cache — кэширует результаты\n@functools.lru_cache(maxsize=128)\ndef slow_calc(n):\n    print("считаю...")\n    return n * n\n\nslow_calc(10)   # считаю... 100\nslow_calc(10)   # 100 (из кэша, без print)\n\n# property — превращает метод в атрибут\nclass User:\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n\n    @property\n    def full_name(self):\n        return f"{self.first} {self.last}"\n\nu = User("Анна", "Иванова")\nprint(u.full_name)    # Анна Иванова (без скобок!)\n\n# staticmethod и classmethod\nclass Cart:\n    @staticmethod\n    def validate_price(p):\n        return p >= 0\n\n    @classmethod\n    def empty(cls):\n        return cls()',
                },
              ],
            },
            {
              id: 'py-l20-s3',
              title: 'Декораторы в pytest',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В pytest декораторы используются постоянно: @pytest.fixture, @pytest.mark.parametrize, @pytest.mark.slow, @pytest.mark.skip. Понимание, как они устроены, позволяет писать свои — например, «повторить flaky-тест N раз» или «запускать тест только на CI».',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'pytest: где живут декораторы',
                  code: 'import pytest\n\n# @pytest.fixture — регистрирует функцию как фикстуру\n@pytest.fixture\ndef api_client():\n    return Client(base_url="https://test.example.com")\n\n# @pytest.mark.parametrize — прогоняет тест на наборе данных\n@pytest.mark.parametrize("email, valid", [\n    ("a@b.com", True),\n    ("invalid", False),\n])\ndef test_email(email, valid):\n    assert is_valid_email(email) == valid\n\n# @pytest.mark.slow — кастомный маркер (регистрируется в pytest.ini)\n@pytest.mark.slow\ndef test_heavy_computation():\n    ...\n\n# Свой декоратор: повторять flaky-тест\nimport functools\n\ndef repeat(times):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            last = None\n            for _ in range(times):\n                try:\n                    return func(*args, **kwargs)\n                except AssertionError as e:\n                    last = e\n            raise last\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef test_flaky_ui():\n    ...   # будет выполнен до 3 раз при падении',
                },
                {
                  type: 'note',
                  text: 'В pytest есть готовый плагин pytest-rerunfailures — не надо писать свой repeat. Но на собеседовании «как бы вы написали декоратор для повторного запуска?» — частый вопрос, и ответ требует понимания декораторов.',
                },
              ],
            },
            {
              id: 'py-l20-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен @functools.wraps(func) в декораторе?',
                options: [
                  { id: 'a', text: 'Ускоряет выполнение' },
                  { id: 'b', text: 'Сохраняет имя, docstring и аннотации оригинальной функции' },
                  { id: 'c', text: 'Логирует вызовы' },
                  { id: 'd', text: 'Он обязателен по синтаксису' },
                ],
                correct: ['b'],
                explanation:
                  'Без wraps обёрнутая функция «потеряет лицо»: __name__ станет "wrapper", __doc__ пустой, аннотации пропадут. Для pytest это критично: он собирает тесты по имени и смотрит на аннотации. functools.wraps восстанавливает метаданные.',
              },
            },
          ],
        },
        {
          id: 'py-l21',
          title: 'Генераторы',
          minutes: 25,
          steps: [
            {
              id: 'py-l21-s1',
              title: 'yield вместо return',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Генератор — функция с yield. При вызове она не выполняется сразу, а возвращает объект-генератор, который выдаёт значения по одному. Это экономит память: не надо создавать список из миллиона элементов — можно обрабатывать по одному.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Список vs генератор',
                  code: '# Список: сразу все значения в памяти\nsquares_list = [x * x for x in range(10_000_000)]   # ~80 МБ\n\n# Генератор: значение по требованию\nsquares_gen = (x * x for x in range(10_000_000))     # ~200 байт\n\n# Или функцией\ndef squares(n):\n    for i in range(n):\n        yield i * i\n\nfor val in squares(5):\n    print(val)     # 0, 1, 4, 9, 16',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Практика: чтение большого файла',
                  code: 'def read_lines(path):\n    """Читает файл построчно, не загружая его целиком"""\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            yield line.rstrip()\n\n# Для файла в 10 ГБ — не упадёт по памяти\nfor line in read_lines("huge.log"):\n    if "ERROR" in line:\n        print(line)',
                },
                {
                  type: 'note',
                  text: 'Генератор одноразовый: пройдёт цикл — закончится. Повторно использовать нельзя, надо создавать заново. Это частая ошибка: сохранили gen = squares(5), прошлись в for — второй for уже пустой.',
                },
              ],
            },
            {
              id: 'py-l21-s2',
              title: 'Генераторные выражения и yield from',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Генераторные выражения в действии',
                  code: '# sum, max, min, any, all принимают генераторы\ntotal = sum(x * x for x in range(100))    # без списка\nhas_errors = any("ERROR" in line for line in read_lines("app.log"))\nall_valid = all(is_valid(x) for x in data)\n\n# Цепочка генераторов: ленивая обработка\ndef numbers():\n    yield from range(10)        # yield from — «передать» все значения\n\nnumbers()\n# Эквивалент:\n# for i in range(10): yield i',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Бесконечный генератор',
                  code: 'def fibonacci():\n    a, b = 0, 1\n    while True:                # бесконечно!\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\n# Берём только первые 10 — остальное не вычисляется\nfirst_10 = [next(fib) for _ in range(10)]\n# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
                },
                {
                  type: 'note',
                  text: 'Генератор идеален для обработки логов, потоков данных, пагинации API. Если функция возвращает «потенциально бесконечную» последовательность — это должен быть генератор, не список.',
                },
              ],
            },
            {
              id: 'py-l21-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём главное преимущество генератора перед списком?',
                options: [
                  { id: 'a', text: 'Он быстрее' },
                  { id: 'b', text: 'Он не хранит все значения в памяти — вычисляет по требованию' },
                  { id: 'c', text: 'Его можно использовать повторно' },
                  { id: 'd', text: 'Он работает только с числами' },
                ],
                correct: ['b'],
                explanation:
                  'Генератор выдаёт по одному значению, не создавая список. Для 10 миллионов элементов — разница в 80 МБ vs 200 байт. Скорость примерно та же (а иногда медленнее), зато памяти — в разы меньше. И повторно использовать нельзя — только создать новый.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'py-m7',
      title: 'Async/await: асинхронность',
      lessons: [
        {
          id: 'py-l22',
          title: 'Зачем async и как работает event loop',
          minutes: 25,
          steps: [
            {
              id: 'py-l22-s1',
              title: 'I/O-bound vs CPU-bound',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Программа может «тормозить» по двум причинам: ждёт (сеть, диск, БД) — это I/O-bound, или считает (CPU, математика) — это CPU-bound. Async помогает в первом случае: пока один запрос ждёт ответа, event loop запускает другой. CPU-bound async не ускорит — там нужен multiprocessing.',
                },
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Задача', 'Тип', 'Инструмент'],
                  rows: [
                    ['HTTP-запросы к API', 'I/O', 'async / aiohttp / httpx'],
                    ['Запросы к БД', 'I/O', 'async / asyncpg / aiosqlite'],
                    ['Чтение файлов', 'I/O', 'async / aiofiles'],
                    ['Парсинг огромного JSON', 'CPU', 'multiprocessing'],
                    ['Обработка изображений', 'CPU', 'multiprocessing / C-расширения'],
                    ['Тесты на Selenium/Playwright', 'I/O', 'sync проще (auto-waiting внутри)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Async не «магически ускоряет» — он позволяет делать несколько I/O одновременно в одном потоке. Если задача упирается в CPU (вычисления) — async бесполезен, Python в одном потоке всё равно выполнит одно ядро.',
                },
              ],
            },
            {
              id: 'py-l22-s2',
              title: 'Event loop и корутины',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Первая корутина',
                  code: 'import asyncio\n\nasync def greet(name):\n    print(f"Начинаю для {name}")\n    await asyncio.sleep(1)       # ← await: «жди, не блокируй»\n    print(f"Готово для {name}")\n    return f"Привет, {name}"\n\n# Запуск\nasync def main():\n    result = await greet("Анна")\n    print(result)\n\nasyncio.run(main())\n# Начинаю для Анна\n# (1 секунда паузы, но event loop может делать другое)\n# Готово для Анна\n# Привет, Анна',
                },
                {
                  type: 'list',
                  items: [
                    'async def — объявляет корутину',
                    'await — «подожди, но не блокируй» (передай управление event loop)',
                    'asyncio.run(main()) — запускает event loop и выполняет main',
                    'Внутри корутины НЕЛЬЗЯ вызывать блокирующие функции без await (time.sleep блокирует, asyncio.sleep — нет)',
                    'asyncio.sleep(1) — «подожди секунду, но пусть другие корутины поработают»',
                  ],
                },
                {
                  type: 'note',
                  text: 'Если внутри async def написать time.sleep(1) вместо await asyncio.sleep(1) — весь event loop встанет на секунду. Все остальные корутины ждут. Это главная ошибка новичков в async: блокирующие вызовы в async-коде убивают всю выгоду.',
                },
              ],
            },
            {
              id: 'py-l22-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `await` в асинхронной функции?',
                options: [
                  { id: 'a', text: 'Блокирует выполнение до готовности' },
                  { id: 'b', text: 'Передаёт управление event loop, позволяя выполнять другие корутины' },
                  { id: 'c', text: 'Запускает функцию в отдельном потоке' },
                  { id: 'd', text: 'Ускоряет вычисления' },
                ],
                correct: ['b'],
                explanation:
                  'await не блокирует — он «уступает» управление, пока ждёт результата. Event loop может запустить другую корутину. Именно поэтому 100 HTTP-запросов через await идут параллельно в одном потоке.',
              },
            },
          ],
        },
        {
          id: 'py-l23',
          title: 'Параллельные задачи: gather, TaskGroup',
          minutes: 30,
          steps: [
            {
              id: 'py-l23-s1',
              title: 'asyncio.gather — параллельно',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Последовательно vs параллельно',
                  code: 'import asyncio\nimport time\n\nasync def fetch(url):\n    await asyncio.sleep(1)      # имитация HTTP-запроса\n    return f"data from {url}"\n\nasync def sequential():\n    start = time.perf_counter()\n    results = []\n    for url in ["a", "b", "c"]:\n        results.append(await fetch(url))   # ждём каждый\n    print(f"Последовательно: {time.perf_counter() - start:.1f} сек")\n    return results\n\nasync def concurrent():\n    start = time.perf_counter()\n    results = await asyncio.gather(\n        fetch("a"),\n        fetch("b"),\n        fetch("c"),\n    )\n    print(f"Параллельно: {time.perf_counter() - start:.1f} сек")\n    return results\n\nasyncio.run(sequential())    # ~3.0 сек\nasyncio.run(concurrent())    # ~1.0 сек',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'asyncio.gather с обработкой ошибок',
                  code: 'async def safe_fetch(url):\n    try:\n        return await fetch(url)\n    except Exception as e:\n        return f"ERROR: {e}"\n\n# return_exceptions=True — не падать на первой ошибке\nresults = await asyncio.gather(\n    fetch("a"),\n    fetch("broken"),\n    fetch("c"),\n    return_exceptions=True,\n)\nfor r in results:\n    if isinstance(r, Exception):\n        print(f"Ошибка: {r}")\n    else:\n        print(r)',
                },
                {
                  type: 'note',
                  text: 'gather по умолчанию пробрасывает первое исключение наверх и отменяет остальные задачи. С return_exceptions=True — собирает все результаты, ошибки остаются как объекты Exception в списке. Для тестов это удобнее: видно все проблемы, а не только первую.',
                },
              ],
            },
            {
              id: 'py-l23-s2',
              title: 'asyncio.TaskGroup (Python 3.11+)',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'TaskGroup — более безопасный gather',
                  code: 'async def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(fetch("a"))\n        t2 = tg.create_task(fetch("b"))\n        t3 = tg.create_task(fetch("c"))\n    # здесь все три уже завершены\n    print(t1.result(), t2.result(), t3.result())\n\n# Если одна задача падает — TaskGroup отменяет остальные\n# и выбрасывает ExceptionGroup (все ошибки сразу)',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Ограничение параллельности: Semaphore',
                  code: 'async def fetch_with_limit(url, sem):\n    async with sem:                  # не больше N одновременно\n        return await fetch(url)\n\nasync def main():\n    sem = asyncio.Semaphore(10)      # 10 одновременных\n    tasks = [fetch_with_limit(f"u{i}", sem) for i in range(100)]\n    results = await asyncio.gather(*tasks)\n    # 100 запросов, но не больше 10 в полёте',
                },
                {
                  type: 'note',
                  text: 'Semaphore — стандартный приём для «не убить сервер». 1000 параллельных запросов положат любой сервер — 10–50 одновременных дадут максимальную пропускную способность без риска. Используйте Semaphore в нагрузочных и API-тестах.',
                },
              ],
            },
            {
              id: 'py-l23-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Сколько времени займёт `asyncio.gather(fetch("a"), fetch("b"), fetch("c"))`, если каждый fetch делает `await asyncio.sleep(1)`?',
                options: [
                  { id: 'a', text: '3 секунды — по одной' },
                  { id: 'b', text: '1 секунда — все параллельно' },
                  { id: 'c', text: '0 секунд — вообще без задержки' },
                  { id: 'd', text: 'Зависит от ОС' },
                ],
                correct: ['b'],
                explanation:
                  'gather запускает все три задачи одновременно, все три «ждут» в event loop. Через 1 секунду все три завершатся. Если бы был await в цикле — 3 секунды. Именно поэтому async ускоряет I/O в разы.',
              },
            },
          ],
        },
        {
          id: 'py-l24',
          title: 'Async в автотестах',
          minutes: 25,
          steps: [
            {
              id: 'py-l24-s1',
              title: 'httpx и aiohttp: асинхронные API-клиенты',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'httpx в async-режиме',
                  code: 'import asyncio\nimport httpx\n\nasync def fetch_user(client, user_id):\n    r = await client.get(f"/users/{user_id}")\n    r.raise_for_status()\n    return r.json()\n\nasync def test_all_users(api_client):\n    users = await asyncio.gather(*[\n        fetch_user(api_client, i) for i in range(1, 51)\n    ])\n    assert len(users) == 50\n\nasync def main():\n    async with httpx.AsyncClient(base_url="https://api.example.com") as client:\n        users = await asyncio.gather(*[fetch_user(client, i) for i in range(1, 51)])\n        # 50 запросов параллельно — 1–2 секунды вместо 30+\n        print(f"Получено {len(users)} пользователей")\n\nasyncio.run(main())',
                },
                {
                  type: 'list',
                  items: [
                    'httpx.AsyncClient — аналог requests.Session, но async',
                    'aiohttp.ClientSession — альтернатива, чуть старше',
                    'Параллельные запросы через gather — в 10–30 раз быстрее последовательных',
                    'Не забывайте закрывать клиент: async with или await client.aclose()',
                  ],
                },
              ],
            },
            {
              id: 'py-l24-s2',
              title: 'pytest-asyncio',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Установка и настройка',
                  code: 'pip install pytest-asyncio httpx',
                },
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'pytest.ini',
                  code: '[pytest]\nasyncio_mode = auto    # все async def тесты будут запущены как async',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Async-тесты',
                  code: 'import pytest\nimport httpx\n\n@pytest.fixture\nasync def api_client():\n    async with httpx.AsyncClient(base_url="https://api.example.com") as client:\n        yield client\n\nasync def test_get_user(api_client):\n    r = await api_client.get("/users/1")\n    assert r.status_code == 200\n    assert r.json()["id"] == 1\n\nasync def test_create_many(api_client):\n    import asyncio\n    payloads = [{"name": f"user{i}"} for i in range(20)]\n    responses = await asyncio.gather(*[\n        api_client.post("/users", json=p) for p in payloads\n    ])\n    assert all(r.status_code == 201 for r in responses)',
                },
                {
                  type: 'note',
                  text: 'pytest-asyncio требует либо @pytest.mark.asyncio на каждом async-тесте, либо asyncio_mode = auto в конфиге — тогда все async-тесты запускаются автоматически. Для нового проекта — auto удобнее.',
                },
              ],
            },
            {
              id: 'py-l24-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Когда async даёт реальное ускорение тестов?',
                options: [
                  { id: 'a', text: 'Много независимых HTTP-запросов к API' },
                  { id: 'b', text: 'Много запросов к БД в одном тесте' },
                  { id: 'c', text: 'Тяжёлые вычисления (парсинг, криптография)' },
                  { id: 'd', text: 'UI-тесты на Selenium/Playwright' },
                ],
                correct: ['a', 'b'],
                explanation:
                  'Async ускоряет I/O-bound задачи: HTTP, БД. Для CPU-bound (вычисления) нужен multiprocessing, async не поможет. Для UI-тестов async не нужен — Playwright sync уже использует auto-waiting, async-обёртка только усложнит код.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'py-m8',
      title: 'Типизация и инструменты',
      lessons: [
        {
          id: 'py-l25',
          title: 'Type hints: аннотации типов',
          minutes: 25,
          steps: [
            {
              id: 'py-l25-s1',
              title: 'Базовые аннотации',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Python остаётся динамическим, но с type hints вы получаете статическую проверку через mypy/pyright, автодополнение в IDE и самодокументируемый код. В автотестах это ловит 30–50% ошибок до запуска.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Базовые типы',
                  code: 'def greet(name: str, age: int) -> str:\n    return f"{name}, {age}"\n\ndef total(prices: list[float]) -> float:\n    return sum(prices)\n\ndef find_user(user_id: int) -> dict[str, str] | None:\n    if user_id == 1:\n        return {"name": "Анна", "email": "a@x.com"}\n    return None\n\n# Типы — это подсказки, не проверки во время выполнения\nprint(greet("Анна", 25))     # работает\nprint(greet(123, "25"))       # тоже «работает», но mypy ругнётся',
                },
                {
                  type: 'list',
                  items: [
                    'str, int, float, bool — базовые',
                    'list[int], dict[str, str], tuple[str, int], set[int] — коллекции (Python 3.9+)',
                    'X | None — «X или None» (Python 3.10+, до этого Optional[X])',
                    '-> T — тип возвращаемого значения',
                    'def f() -> None — функция ничего не возвращает',
                  ],
                },
                {
                  type: 'note',
                  text: 'Type hints НЕ проверяются во время выполнения. `greet(123, "25")` не упадёт — Python доверяет вам. Проверка — отдельным инструментом (mypy, pyright) в CI или в IDE. Это не «строгая типизация», а «подсказки + внешняя проверка».',
                },
              ],
            },
            {
              id: 'py-l25-s2',
              title: 'Union, Optional, TypedDict, Protocol',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Продвинутые типы',
                  code: 'from typing import TypedDict, Protocol\n\n# Union: несколько типов\nUserID = int | str\n\ndef get_user(uid: UserID) -> dict | None:\n    ...\n\n# TypedDict: словарь с фиксированными полями\nclass User(TypedDict):\n    id: int\n    name: str\n    email: str\n\ndef process(user: User) -> None:\n    print(user["name"])    # IDE знает поля\n\n# Protocol: «утиная типизация» с проверкой\nclass Closable(Protocol):\n    def close(self) -> None: ...\n\ndef cleanup(resource: Closable) -> None:\n    resource.close()       # работает с любым объектом с методом close\n\n# Callable: функция как аргумент\nfrom collections.abc import Callable\n\ndef apply(func: Callable[[int], int], value: int) -> int:\n    return func(value)',
                },
                {
                  type: 'table',
                  caption: 'Что когда использовать',
                  head: ['Тип', 'Зачем', 'Пример'],
                  rows: [
                    ['list[X]', 'Список', 'list[str]'],
                    ['dict[K, V]', 'Словарь', 'dict[str, int]'],
                    ['X | None', 'Может быть None', 'str | None'],
                    ['X | Y', 'Один из нескольких', 'int | str'],
                    ['TypedDict', 'Словарь с фиксированными ключами', 'JSON-ответ API'],
                    ['Protocol', 'Утиная типизация', 'Любой объект с методом'],
                    ['Callable', 'Функция как аргумент', 'Callable[[int], str]'],
                    ['Generic[T]', 'Параметризованный класс', 'для библиотек'],
                  ],
                },
              ],
            },
            {
              id: 'py-l25-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт при запуске `def f(x: int) -> str: return x` и вызове `f(5)`?',
                options: [
                  { id: 'a', text: 'TypeError: возвращаемое значение не str' },
                  { id: 'b', text: 'Функция вернёт 5 (int) без ошибок — type hints не проверяются в runtime' },
                  { id: 'c', text: 'SyntaxError при определении' },
                  { id: 'd', text: 'Функция вернёт "5" (str)' },
                ],
                correct: ['b'],
                explanation:
                  'Type hints — только подсказки. Python не проверяет их во время выполнения. Функция вернёт 5 (int), несмотря на -> str. Проверка — задача mypy/pyright/IDE. Это частая ошибка новичков: «зачем типы, если они не работают?» — работают, но в статическом анализе.',
              },
            },
          ],
        },
        {
          id: 'py-l26',
          title: 'mypy и pyright: проверка типов',
          minutes: 20,
          steps: [
            {
              id: 'py-l26-s1',
              title: 'Установка и запуск mypy',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка',
                  code: 'pip install mypy\n\n# Проверка\nmypy app.py\nmypy src/\n\n# Строгий режим (рекомендуется для новых проектов)\nmypy --strict src/',
                },
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'pyproject.toml или mypy.ini',
                  code: '[tool.mypy]\npython_version = "3.12"\nstrict = true\nwarn_return_any = true\nwarn_unused_configs = true\ndisallow_untyped_defs = true',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичные ошибки, которые ловит mypy',
                  code: 'error: Argument 1 to "greet" has incompatible type "int"; expected "str"\nerror: Incompatible return value type (got "int", expected "str")\nerror: Item "None" of "dict[str, str] | None" has no attribute "get"\nerror: Function is missing a type annotation',
                },
              ],
            },
            {
              id: 'py-l26-s2',
              title: 'pyright и pre-commit',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Pyright — быстрее mypy, написан на TypeScript. Используется в VS Code (Pylance) и в CI (GitHub Actions через pyright-action). Для автотестов удобно: typecheck в pre-commit ловит опечатки до коммита.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.pre-commit-config.yaml',
                  code: 'repos:\n  - repo: https://github.com/astral-sh/ruff-pre-commit\n    rev: v0.7.0\n    hooks:\n      - id: ruff\n      - id: ruff-format\n\n  - repo: https://github.com/pre-commit/mirrors-mypy\n    rev: v1.13.0\n    hooks:\n      - id: mypy\n        additional_dependencies: [types-requests, types-pyyaml]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка pre-commit',
                  code: 'pip install pre-commit\npre-commit install          # активирует хуки\npre-commit run --all-files  # прогон вручную',
                },
                {
                  type: 'note',
                  text: 'В 2025 стандарт для Python — ruff (замена flake8+isort+black в одном) + mypy/pyright. ruff — в 10–100 раз быстрее flake8 (Rust), мой совет — начинать с него.',
                },
              ],
            },
            {
              id: 'py-l26-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что из перечисленного — проверка типов для Python?',
                options: [
                  { id: 'a', text: 'flake8' },
                  { id: 'b', text: 'mypy' },
                  { id: 'c', text: 'black' },
                  { id: 'd', text: 'isort' },
                ],
                correct: ['b'],
                explanation:
                  'mypy и pyright — проверяют типы. flake8 — стиль и ошибки (не типы). black — форматирование. isort — сортировка импортов. Для проверки типов — только mypy/pyright.',
              },
            },
          ],
        },
        {
          id: 'py-l27',
          title: 'Виртуальные окружения и зависимости',
          minutes: 25,
          steps: [
            {
              id: 'py-l27-s1',
              title: 'venv vs uv: изоляция',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Каждый проект должен иметь свои зависимости. Если поставить requests глобально — один проект получит 2.28, другой 2.31, и начнётся «на моём работает». Виртуальное окружение — изоляция.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'venv (встроен в Python)',
                  code: '# Создать\npython -m venv .venv\n\n# Активировать\n# Windows PowerShell:\n.venv\\Scripts\\Activate.ps1\n\n# Linux/macOS:\nsource .venv/bin/activate\n\n# Проверить\nwhich python   # должен быть .venv/bin/python\n\n# Деактивировать\ndeactivate',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'uv — современный и быстрый (2024+)',
                  code: '# Установка\npip install uv\n\n# Создать окружение\nuv venv\n\n# Установить зависимости — в 10-100 раз быстрее pip\nuv pip install -r requirements.txt\n\n# Или напрямую в проект\nuv add requests pytest playwright',
                },
                {
                  type: 'note',
                  text: 'В 2025 uv — стандарт для новых Python-проектов. Быстрее pip в 10–100 раз (Rust), умеет lock-файлы, работает как pip-замена. Для старых проектов — обычный venv + pip.',
                },
              ],
            },
            {
              id: 'py-l27-s2',
              title: 'requirements.txt и lock-файлы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'requirements.txt — версии должны быть зафиксированы',
                  code: '# Плохо: latest\nrequests\npytest\nplaywright\n\n# Тоже плохо: слишком свободно\nrequests>=2.0\npytest~=8.0\n\n# Хорошо: точные версии\nrequests==2.32.3\npytest==8.3.3\nplaywright==1.48.0\n\n# Компромисс: минорные обновления допустимы\nrequests~=2.32.3       # >=2.32.3, <2.33.0\n',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'requirements-dev.txt — отдельно',
                  code: '# requirements.txt — только то, что нужно в проде\nrequests==2.32.3\nhttpx==0.27.2\n\n# requirements-dev.txt — тесты, линтеры, инструменты\n-r requirements.txt\npytest==8.3.3\npytest-asyncio==0.24.0\npytest-playwright==0.5.0\nmypy==1.13.0\nruff==0.7.0',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка',
                  code: 'pip install -r requirements.txt\npip install -r requirements-dev.txt     # для разработки',
                },
                {
                  type: 'note',
                  text: 'Не устанавливайте «глобально» даже в dev. Каждый проект — свой .venv. В CI — тоже .venv или контейнер. «У меня стояло глобально» — самый частый источник «на CI не работает».',
                },
              ],
            },
            {
              id: 'py-l27-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Зачем нужно виртуальное окружение (venv)?',
                options: [
                  { id: 'a', text: 'Изолировать зависимости проекта от глобальных' },
                  { id: 'b', text: 'Разрешить разным проектам использовать разные версии одной библиотеки' },
                  { id: 'c', text: 'Ускорить выполнение кода' },
                  { id: 'd', text: 'Воспроизводить окружение на CI' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'venv изолирует зависимости (a), позволяет разным версиям сосуществовать (b), обеспечивает воспроизводимость на CI (d). Скорость выполнения — не про venv (c — миф).',
              },
            },
          ],
        },
      ],
        },     // ← конец py-m8
    {
      id: 'py-m9',
      title: 'Многопоточность и многопроцессность',
      lessons: [
        {
          id: 'py-l28',
          title: 'GIL: почему Python "не умеет" в многопоточность',
          minutes: 25,
          steps: [
            {
              id: 'py-l28-s1',
              title: 'Что такое GIL',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'GIL (Global Interpreter Lock) — блокировка, которая не даёт двум потокам одновременно выполнять Python-байткод. Даже на 16-ядерном сервере один Python-процесс в один момент времени использует только одно ядро для Python-кода. Это не баг, а следствие устройства CPython (управление памятью).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Проверка: потоки не ускоряют CPU-bound',
                  code: 'import threading\nimport time\n\ndef cpu_work(n):\n    total = 0\n    for i in range(n):\n        total += i * i\n    return total\n\n# Последовательно\nstart = time.perf_counter()\nfor _ in range(4):\n    cpu_work(10_000_000)\nprint(f"Последовательно: {time.perf_counter() - start:.2f} сек")\n\n# В 4 потока\nstart = time.perf_counter()\nthreads = [threading.Thread(target=cpu_work, args=(10_000_000,)) for _ in range(4)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"В потоках: {time.perf_counter() - start:.2f} сек")\n\n# Результат: примерно одинаково (или хуже!). GIL не даёт ускорить CPU-bound.',
                },
                {
                  type: 'note',
                  text: 'GIL освобождается на I/O-операциях (сеть, диск, sleep) — поэтому threading УСКОРЯЕТ I/O-bound. Но для CPU-bound (вычисления) — не поможет. Для CPU-bound нужен multiprocessing. Это ключевой момент на собеседовании.',
                },
              ],
            },
            {
              id: 'py-l28-s2',
              title: 'Когда GIL всё-таки отпускает',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'I/O-bound vs CPU-bound',
                  head: ['Тип задачи', 'Пример', 'Threading помогает?', 'Multiprocessing?'],
                  rows: [
                    ['I/O-bound', 'HTTP-запросы, БД, файлы, sleep', '✅', '✅ (но оверкилл)'],
                    ['CPU-bound', 'Циклы, шифрование, парсинг JSON', '❌ (GIL)', '✅'],
                    ['C-расширения', 'numpy, scipy, hashlib', '✅ (GIL отпускается)', '✅'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'I/O-bound: потоки ускоряют',
                  code: 'import threading\nimport time\n\ndef fetch(url):\n    time.sleep(1)   # имитация HTTP-запроса\n    return f"data from {url}"\n\n# Последовательно — 4 секунды\nstart = time.perf_counter()\nfor url in ["a", "b", "c", "d"]:\n    fetch(url)\nprint(f"Последовательно: {time.perf_counter() - start:.2f} сек")\n\n# В 4 потока — ~1 секунда\nstart = time.perf_counter()\nthreads = [threading.Thread(target=fetch, args=(u,)) for u in ["a", "b", "c", "d"]]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint(f"В потоках: {time.perf_counter() - start:.2f} сек")\n# В потоках: 1.00 сек — GIL отпускался на sleep',
                },
                {
                  type: 'p',
                  text: 'Почему так: во время `time.sleep(1)` поток освобождает GIL и позволяет другим потокам работать. То же самое происходит при сетевых операциях, чтении диска, любых блокирующих вызовах. Поэтому threading хорошо подходит для «много запросов к API параллельно» — это I/O-bound.',
                },
                {
                  type: 'note',
                  text: 'GIL — это особенность CPython, не самого языка. В PyPy, Jython, IronPython GIL нет. Но 99% Python-разработчиков используют CPython. С 2024 в Python 3.13 появился "no-GIL mode" (PEP 703) — экспериментально, но пока не для продакшена.',
                },
              ],
            },
            {
              id: 'py-l28-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Задача — распараллелить 100 HTTP-запросов к API. Что лучше?',
                options: [
                  { id: 'a', text: 'threading — GIL не помешает, потому что это I/O-bound' },
                  { id: 'b', text: 'multiprocessing — только так обойти GIL' },
                  { id: 'c', text: 'Ничего не ускорит GIL' },
                  { id: 'd', text: 'threading не работает с сетью' },
                ],
                correct: ['a'],
                explanation:
                  'HTTP-запрос — I/O-bound: во время ожидания ответа GIL отпускается. Потоки работают параллельно. multiprocessing тоже сработает, но это оверкилл: процессы дороже в создании, и обмен данными через IPC медленнее. Для I/O — потоки или asyncio.',
              },
            },
          ],
        },
        {
          id: 'py-l29',
          title: 'threading: потоки',
          minutes: 30,
          steps: [
            {
              id: 'py-l29-s1',
              title: 'Базовый поток',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Первый поток',
                  code: 'import threading\nimport time\n\ndef worker(name, seconds):\n    print(f"Поток {name} начал")\n    time.sleep(seconds)\n    print(f"Поток {name} закончил")\n\n# Создать и запустить\nt = threading.Thread(target=worker, args=("A", 2))\nt.start()                 # запускает в фоне\n\n# Основной поток продолжает работу\nprint("Основной поток продолжает")\n\n# Дождаться завершения\nt.join()\nprint("Всё готово")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Несколько потоков',
                  code: 'import threading\nimport time\n\nthreads = []\nfor i in range(5):\n    t = threading.Thread(target=worker, args=(f"T{i}", 1))\n    threads.append(t)\n    t.start()\n\n# Ждём все\nfor t in threads:\n    t.join()\nprint(f"Все {len(threads)} потоков завершены")',
                },
                {
                  type: 'list',
                  items: [
                    'threading.Thread(target=функция, args=(...)) — создать поток',
                    't.start() — запустить, возвращает управление сразу',
                    't.join() — ждать завершения (иначе main может закончиться раньше)',
                    't.is_alive() — жив ли поток',
                    't.daemon = True — «фоновый» поток: не блокирует выход из программы',
                  ],
                },
                {
                  type: 'note',
                  text: 'Если не вызвать join() — главный поток завершится, а дочерние продолжат работать. Программа «зависнет», пока они не закончатся. Или, если они daemon, будут убиты при выходе. Всегда join() для управляемых потоков.',
                },
              ],
            },
            {
              id: 'py-l29-s2',
              title: 'Получение результата: Queue',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Потоки не возвращают значения. Чтобы получить результат из потока — используйте общий контейнер или queue.Queue (потокобезопасная очередь).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Queue для сбора результатов',
                  code: 'import threading\nimport queue\nimport time\n\nresults = queue.Queue()\n\ndef fetch(url):\n    time.sleep(0.5)\n    results.put((url, f"data from {url}"))\n\nthreads = [threading.Thread(target=fetch, args=(u,)) for u in ["a", "b", "c"]]\nfor t in threads: t.start()\nfor t in threads: t.join()\n\n# Забираем результаты\nwhile not results.empty():\n    url, data = results.get()\n    print(f"{url} -> {data}")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Общий список — ОПАСНО',
                  code: 'results = []   # ← небезопасно!\n\ndef worker():\n    results.append("item")   # ← race condition: два потока могут записать одновременно\n\n# Проблема: list.append — атомарна в CPython (благодаря GIL),\n# но только для простых случаев. Для +=, remove, sort — гонки гарантированы.\n# Всегда используйте Queue для потоков.',
                },
                {
                  type: 'note',
                  text: 'queue.Queue — потокобезопасная очередь «из коробки». Используйте её, а не общий list/dict. Queue решает и race condition, и проблему «как собрать результаты из потоков».',
                },
              ],
            },
            {
              id: 'py-l29-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен `t.join()`?',
                options: [
                  { id: 'a', text: 'Чтобы соединить два потока в один' },
                  { id: 'b', text: 'Чтобы дождаться завершения потока, прежде чем продолжить' },
                  { id: 'c', text: 'Чтобы запустить поток' },
                  { id: 'd', text: 'Чтобы остановить поток' },
                ],
                correct: ['b'],
                explanation:
                  'join() блокирует текущий поток до завершения t. Без него main может закончиться раньше, и программа «зависнет» или дочерние потоки будут убиты (если daemon).',
              },
            },
          ],
        },
        {
          id: 'py-l30',
          title: 'ThreadPoolExecutor: практичный threading',
          minutes: 30,
          steps: [
            {
              id: 'py-l30-s1',
              title: 'Пул потоков вместо ручного создания',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Ручное создание 100 потоков — плохо: каждый поток — это системный ресурс, а GIL всё равно даст только одно ядро. ThreadPoolExecutor создаёт фиксированное число потоков и раздаёт им задачи из очереди. Проще и эффективнее.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Базовый ThreadPoolExecutor',
                  code: 'from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef fetch(url):\n    time.sleep(0.5)\n    return f"data from {url}"\n\nurls = ["a", "b", "c", "d", "e", "f", "g", "h"]\n\n# 4 потока, 8 задач — каждая берётся из очереди\nwith ThreadPoolExecutor(max_workers=4) as executor:\n    results = list(executor.map(fetch, urls))\n\nprint(results)\n# 8 задач за ~1 секунду (4 параллельно × 2 волны)',
                },
                {
                  type: 'list',
                  items: [
                    'max_workers=4 — максимум 4 потока одновременно',
                    'executor.map(func, iterable) — как map(), но в потоках',
                    'results — список в порядке исходного iterable (не в порядке завершения)',
                    'with ... — автоматически ждёт завершения и закрывает пул',
                    'max_workers по умолчанию = min(32, CPU + 4) — для I/O часто мало, задавайте явно',
                  ],
                },
              ],
            },
            {
              id: 'py-l30-s2',
              title: 'submit и Future: больше контроля',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'submit возвращает Future',
                  code: 'from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndef fetch(url):\n    time.sleep(1)\n    return f"data from {url}"\n\nurls = [f"u{i}" for i in range(10)]\n\nwith ThreadPoolExecutor(max_workers=5) as executor:\n    # Отправить задачи\n    futures = {executor.submit(fetch, u): u for u in urls}\n\n    # Собирать по мере завершения\n    for future in as_completed(futures):\n        url = futures[future]\n        try:\n            result = future.result()\n            print(f"✓ {url}: {result}")\n        except Exception as e:\n            print(f"✗ {url}: {e}")',
                },
                {
                  type: 'list',
                  items: [
                    'executor.submit(func, *args) — запустить одну задачу, вернуть Future',
                    'future.result() — дождаться результата (блокирует)',
                    'future.result(timeout=5) — с таймаутом',
                    'future.done() — завершена ли',
                    'as_completed(futures) — итератор по мере завершения, не в порядке submit',
                    'future.exception() — исключение, если упало',
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Таймаут на задачу',
                  code: 'from concurrent.futures import ThreadPoolExecutor, TimeoutError\n\nwith ThreadPoolExecutor(max_workers=3) as executor:\n    future = executor.submit(fetch, "slow_url")\n    try:\n        result = future.result(timeout=2)\n    except TimeoutError:\n        print("Задача не уложилась в 2 секунды")',
                },
              ],
            },
            {
              id: 'py-l30-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем `executor.submit()` отличается от `executor.map()`?',
                options: [
                  { id: 'a', text: 'submit — для одной задачи и возвращает Future; map — для iterable и возвращает список' },
                  { id: 'b', text: 'submit быстрее' },
                  { id: 'c', text: 'map параллельный, submit последовательный' },
                  { id: 'd', text: 'Это одно и то же' },
                ],
                correct: ['a'],
                explanation:
                  'submit — одна задача → Future (можно управлять таймаутом, порядком, ошибками). map — пачка задач → список результатов в порядке входа (проще, но меньше контроля). submit используют, когда нужен контроль над каждой задачей.',
              },
            },
          ],
        },
        {
          id: 'py-l31',
          title: 'Lock, RLock и race condition',
          minutes: 30,
          steps: [
            {
              id: 'py-l31-s1',
              title: 'Race condition: когда данные портятся',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Race condition — ситуация, когда два потока одновременно читают и пишут общие данные, и результат зависит от порядка. Классический пример: счётчик, который два потока увеличивают на 1 — а получается не 2, а 1, потому что оба прочитали старое значение до того, как записать новое.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Демонстрация гонки',
                  code: 'import threading\n\ncounter = 0\n\ndef increment():\n    global counter\n    for _ in range(100_000):\n        counter += 1     # НЕ атомарно: read → add → write\n\nthreads = [threading.Thread(target=increment) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\n\nprint(counter)   # ожидалось 500_000, а получится ~487_000 (разное)\n\n# Причина: counter += 1 — три байткода (LOAD, ADD, STORE).\n# Между ними GIL может переключить поток. Два потока читают 10,\n# оба пишут 11 — единица потеряна.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Исправление: Lock',
                  code: 'import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    for _ in range(100_000):\n        with lock:          # ← только один поток входит одновременно\n            counter += 1\n\nthreads = [threading.Thread(target=increment) for _ in range(5)]\nfor t in threads: t.start()\nfor t in threads: t.join()\n\nprint(counter)   # всегда 500_000',
                },
                {
                  type: 'note',
                  text: 'Race condition — самая коварная категория багов: проявляется не всегда, зависит от скорости, нагрузки, удачи. В тестах — то самое «падает через раз». Использование Lock — обязательная практика при работе с общими данными в потоках.',
                },
              ],
            },
            {
              id: 'py-l31-s2',
              title: 'Lock vs RLock vs Semaphore',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Три примитива синхронизации',
                  code: 'import threading\n\n# Lock — простой мьютекс: один поток за раз\nlock = threading.Lock()\nwith lock:\n    ...    # только один поток здесь\n\n# RLock (reentrant) — можно повторно войти из того же потока\nrlock = threading.RLock()\nwith rlock:\n    with rlock:      # не заблокируется\n        ...\n\n# Semaphore — N потоков одновременно\nsem = threading.Semaphore(3)\nwith sem:\n    ...    # до 3 потоков одновременно\n\n# Event — сигнал между потоками\nevent = threading.Event()\n# поток 1: event.wait()  — ждёт\n# поток 2: event.set()   — будит всех',
                },
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Примитив', 'Смысл', 'Когда'],
                  rows: [
                    ['Lock', '1 поток за раз', 'Общий счётчик, файл, БД-соединение'],
                    ['RLock', '1 поток, но можно входить повторно', 'Рекурсивные вызовы с lock'],
                    ['Semaphore(N)', 'N потоков за раз', 'Rate limiting (не больше 5 запросов одновременно)'],
                    ['Event', 'Флаг + оповещение', 'Один поток ждёт сигнала от другого'],
                    ['Condition', 'Ожидание условия', 'Producer-consumer, сложные сценарии'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Rate limiting через Semaphore',
                  code: 'import threading\nimport time\nimport requests\n\nsem = threading.Semaphore(5)   # не больше 5 запросов одновременно\n\ndef fetch(url):\n    with sem:\n        return requests.get(url, timeout=10)\n\nthreads = [threading.Thread(target=fetch, args=(u,)) for u in urls]\nfor t in threads: t.start()\nfor t in threads: t.join()\n# 100 запросов, но не более 5 одновременно — сервер не упадёт',
                },
              ],
            },
            {
              id: 'py-l31-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Два потока увеличивают общий счётчик. Что использовать, чтобы результат был корректным?',
                options: [
                  { id: 'a', text: 'Ничего — GIL защищает от гонок' },
                  { id: 'b', text: 'threading.Lock вокруг counter += 1' },
                  { id: 'c', text: 'time.sleep() между операциями' },
                  { id: 'd', text: 'Добавить больше потоков' },
                ],
                correct: ['b'],
                explanation:
                  'GIL защищает отдельные байткоды, но не составные операции (read → add → write). Между ними поток может быть вытеснен. Lock сериализует доступ: только один поток за раз выполняет counter += 1.',
              },
            },
          ],
        },
        {
          id: 'py-l32',
          title: 'multiprocessing: обход GIL',
          minutes: 30,
          steps: [
            {
              id: 'py-l32-s1',
              title: 'Процессы вместо потоков',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'multiprocessing создаёт отдельные процессы ОС. У каждого процесса — свой Python-интерпретатор, своя память, свой GIL. Это позволяет реально использовать все ядра. Плата — дороже создание (десятки мс против микросекунд), и данные надо явно передавать через IPC (очереди, pipes, shared memory).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Тот же CPU-bound, но в процессах',
                  code: 'from multiprocessing import Pool\nimport time\n\ndef cpu_work(n):\n    return sum(i * i for i in range(n))\n\nif __name__ == "__main__":      # ← обязательно для multiprocessing!\n    data = [10_000_000] * 4\n\n    # Последовательно\n    start = time.perf_counter()\n    list(map(cpu_work, data))\n    print(f"Последовательно: {time.perf_counter() - start:.2f} сек")\n\n    # В 4 процесса — реальное ускорение\n    start = time.perf_counter()\n    with Pool(4) as pool:\n        pool.map(cpu_work, data)\n    print(f"В процессах: {time.perf_counter() - start:.2f} сек")\n    # В процессах: ~4x быстрее на 4 ядрах',
                },
                {
                  type: 'note',
                  text: 'if __name__ == "__main__": — ОБЯЗАТЕЛЬНО для multiprocessing на Windows и macOS. Без этого дочерние процессы при импорте модуля снова создадут процессы — бесконечная рекурсия и краш. Это не прихоть, а требование spawn-модели.',
                },
              ],
            },
            {
              id: 'py-l32-s2',
              title: 'Pool, обмен данными, ограничения',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Pool: параллельные вычисления',
                  code: 'from multiprocessing import Pool\n\ndef process_image(path):\n    # CPU-bound: чтение, обработка, запись\n    return f"processed {path}"\n\nif __name__ == "__main__":\n    files = [f"img_{i}.jpg" for i in range(100)]\n    with Pool() as pool:                    # Pool() = CPU cores\n        results = pool.map(process_image, files)\n    print(f"Обработано {len(results)} файлов")\n\n    # С таймаутом\n    with Pool(4) as pool:\n        try:\n            result = pool.apply_async(process_image, (files[0],)).get(timeout=10)\n        except TimeoutError:\n            print("Не уложилось")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Обмен данными: Queue и Manager',
                  code: 'from multiprocessing import Process, Queue\n\ndef worker(q):\n    q.put("результат из процесса")\n\nif __name__ == "__main__":\n    q = Queue()\n    p = Process(target=worker, args=(q,))\n    p.start()\n    print(q.get())     # "результат из процесса"\n    p.join()\n\n# Для сложных структур — Manager\nfrom multiprocessing import Manager\nwith Manager() as manager:\n    shared_dict = manager.dict()\n    # процессы могут писать в shared_dict',
                },
                {
                  type: 'table',
                  caption: 'Threading vs Multiprocessing',
                  head: ['Критерий', 'threading', 'multiprocessing'],
                  rows: [
                    ['GIL', 'Один на всех', 'У каждого свой'],
                    ['CPU-bound', 'Не ускоряет', 'Ускоряет (реально)'],
                    ['I/O-bound', 'Хорошо', 'Работает, но оверкилл'],
                    ['Создание', 'Микросекунды', 'Десятки миллисекунд'],
                    ['Обмен данными', 'Общая память (нужен Lock)', 'IPC (Queue, Manager, shared memory)'],
                    ['Windows', 'Работает', 'Только через if __name__'],
                  ],
                },
              ],
            },
            {
              id: 'py-l32-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `if __name__ == "__main__":` обязателен в multiprocessing на Windows?',
                options: [
                  { id: 'a', text: 'Это стилистическое требование' },
                  { id: 'b', text: 'Без него дочерние процессы при импорте модуля создадут новые процессы — бесконечная рекурсия' },
                  { id: 'c', text: 'Windows не поддерживает multiprocessing' },
                  { id: 'd', text: 'Это ускоряет выполнение' },
                ],
                correct: ['b'],
                explanation:
                  'Windows/macOS используют spawn-модель: дочерний процесс импортирует ваш модуль заново. Без защиты if __name__ он снова создаст процессы, те — ещё, и так до краша. На Linux (fork) такого не было бы.',
              },
            },
          ],
        },
        {
          id: 'py-l33',
          title: 'Что выбрать: сравнение и практика в тестах',
          minutes: 30,
          steps: [
            {
              id: 'py-l33-s1',
              title: 'Дерево решений',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Алгоритм выбора',
                  code: 'Задача I/O-bound (сеть, диск, БД)?\n├── Мало задач (< 100) → asyncio (проще, легче)\n├── Много задач + нужна совместимость → ThreadPoolExecutor\n└── Уже есть блокирующие библиотеки (requests) → ThreadPoolExecutor\n\nЗадача CPU-bound (вычисления)?\n├── Используется numpy/scipy → threading может помочь (GIL отпускается в C)\n└── Чистый Python → multiprocessing\n\nСмешанная задача?\n→ Разделить: I/O через потоки/async, CPU через процессы',
                },
                {
                  type: 'table',
                  caption: 'Итоговое сравнение',
                  head: ['Инструмент', 'I/O-bound', 'CPU-bound', 'Простота', 'Когда выбирать'],
                  rows: [
                    ['asyncio', '✅✅', '❌', 'Средне', 'Много HTTP/DB, современный код'],
                    ['threading', '✅', '❌', 'Просто', 'Блокирующие библиотеки (requests)'],
                    ['ThreadPoolExecutor', '✅', '❌', 'Просто', 'Пул потоков, стандарт'],
                    ['multiprocessing', '⚠️', '✅✅', 'Сложно', 'CPU-bound: парсинг, крипто, ML'],
                    ['ProcessPoolExecutor', '⚠️', '✅', 'Средне', 'Пул процессов, стандарт'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: если задача — «много запросов к API», asyncio или ThreadPoolExecutor. Если «много вычислений», multiprocessing. Не пытайтесь обойти GIL через threading для CPU — это не работает. И не используйте multiprocessing для I/O — это оверкилл.',
                },
              ],
            },
            {
              id: 'py-l33-s2',
              title: 'Параллельные тесты: pytest-xdist',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Самое частое применение многопоточности в QA — параллельный запуск тестов. pytest-xdist запускает тесты в нескольких процессах (не потоках!) — реальное ускорение на всех ядрах.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка и запуск',
                  code: 'pip install pytest-xdist\n\n# 4 процесса\npytest -n 4\n\n# автоопределение числа ядер\npytest -n auto\n\n# по файлам (-n loadfile — быстрее старт)\npytest -n auto --dist=loadfile',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Что ломается при параллелизме',
                  code: '# ПРОБЛЕМА: все тесты используют одного и того же пользователя test@x.com\n# при параллельном запуске они мешают друг другу — race condition в БД\n\ndef test_update_profile():\n    user = get_or_create("test@x.com")    # ← один пользователь на всех!\n    user.name = "Анна"\n    ...\n\n# РЕШЕНИЕ: уникальные данные на тест\nimport uuid\n\ndef test_update_profile():\n    email = f"user_{uuid.uuid4().hex[:8]}@x.com"    # ← уникальный\n    user = create_user(email=email)\n    user.name = "Анна"\n    ...',
                },
                {
                  type: 'list',
                  items: [
                    'pytest -n N — N процессов (не потоков)',
                    '-n auto — по числу CPU-ядер',
                    'Тесты должны быть независимы: не делить данные, не полагаться на порядок',
                    'Уникальные данные на тест (uuid, timestamp в email) — обязательны',
                    'Фикстуры scope=session создаются один раз на каждый процесс (не на весь прогон)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Если тесты зелёные последовательно, но падают с -n auto — это shared state. 90% случаев: два теста одновременно пишут в одну строку БД или используют один файл. Фикс — уникальные данные на тест. Это одна из самых частых задач в QA-автоматизации.',
                },
              ],
            },
            {
              id: 'py-l33-s3',
              title: 'Playwright: параллельные браузеры',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Параллельные браузеры в Playwright',
                  code: '# pytest-xdist + pytest-playwright\npytest -n 4\n\n# Каждый процесс получит свой браузер (context)\n# 4 браузера параллельно — в 4 раза быстрее',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'conftest.py: один браузер на процесс',
                  code: 'import pytest\nfrom playwright.sync_api import sync_playwright\n\n@pytest.fixture(scope="session")\ndef browser():\n    """Один браузер на весь процесс — не на каждый тест"""\n    with sync_playwright() as p:\n        b = p.chromium.launch(headless=True)\n        yield b\n        b.close()\n\n@pytest.fixture\ndef page(browser):\n    """Свежая страница на каждый тест (но тот же браузер)"""\n    context = browser.new_context()\n    page = context.new_page()\n    yield page\n    context.close()',
                },
                {
                  type: 'list',
                  items: [
                    'scope="session" для browser — создаётся один раз на процесс',
                    'scope="function" для page — новая страница на каждый тест',
                    'context — изолированные куки, хранилище, сессия',
                    'pytest -n 4 → 4 процесса → 4 браузера',
                    'Не создавайте новый браузер на каждый тест — это медленно (2–5 сек на запуск)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Playwright сам по себе поддерживает параллельные контексты в одном браузере (context). Но pytest-xdist с несколькими процессами — быстрее: каждый процесс использует своё ядро. Комбинация: N процессов × M контекстов = N×M параллельных тестов.',
                },
              ],
            },
            {
              id: 'py-l33-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что важно при параллельном запуске тестов через pytest-xdist?',
                options: [
                  { id: 'a', text: 'Уникальные тестовые данные на каждый тест (uuid, timestamp)' },
                  { id: 'b', text: 'Тесты не должны зависеть от порядка выполнения' },
                  { id: 'c', text: 'Использовать threading вместо процессов' },
                  { id: 'd', text: 'Фикстуры scope=session создаются один раз на процесс, а не на весь прогон' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Независимость и уникальные данные — обязательны, иначе race condition. pytest-xdist использует процессы (не потоки) — вариант C неверен. Фикстуры session создаются на каждый процесс — это надо помнить при настройке БД, браузеров и т.д.',
              },
            },
          ],
        },
      ],
    },
          {
      id: 'py-m10',
      title: 'Практикум',
      lessons: [
        {
          id: 'py-l34',
          title: 'Практика: от простого к сложному',
          minutes: 35,
          steps: [
            {
              id: 'py-l34-s1',
              title: 'Типы данных',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой тип данных вернёт выражение `10 / 2`?',
                options: [
                  { id: 'a', text: 'int' },
                  { id: 'b', text: 'float' },
                  { id: 'c', text: 'str' },
                  { id: 'd', text: 'bool' },
                ],
                correct: ['b'],
                explanation: 'Оператор `/` в Python 3 всегда возвращает float, даже если деление нацело (10 / 2 = 5.0). Целочисленное деление — это `//`.',
              },
            },
            {
              id: 'py-l34-s2',
              title: 'Длина списка',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Что выведет `print(len([1, 2, 3]))`?',
                accepted: ['3'],
                placeholder: 'число',
                hint: 'Функция len() считает количество элементов',
                explanation: 'len() возвращает количество элементов в списке. [1, 2, 3] содержит 3 элемента.',
              },
            },
            {
              id: 'py-l34-s3',
              title: 'Сортировка списка',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте действия с списком в правильном порядке',
                items: ['nums = []', 'nums.append(3)', 'nums.append(1)', 'nums.sort()', 'print(nums)'],
                correct: ['nums = []', 'nums.append(3)', 'nums.append(1)', 'nums.sort()', 'print(nums)'],
                explanation: 'Создаём список, добавляем элементы, сортируем, выводим.',
              },
            },
            {
              id: 'py-l34-s4',
              title: 'Цикл for',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в цикле',
                text: '____ i ____ range(3):\n    print(i)',
                blanks: [
                  { accepted: ['for'], hint: 'цикл' },
                  { accepted: ['in'], hint: 'в' },
                ],
                explanation: 'Синтаксис: for i in range(3):',
              },
            },
            {
              id: 'py-l34-s5',
              title: 'Типы коллекций',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип коллекции и его ключевую особенность',
                pairs: [
                  { left: 'list', right: 'Изменяемый, упорядоченный' },
                  { left: 'tuple', right: 'Неизменяемый, упорядоченный' },
                  { left: 'dict', right: 'Ключ-значение' },
                  { left: 'set', right: 'Уникальные элементы' },
                ],
                explanation: 'list — [], изменяемый. tuple — (), неизменяемый. dict — {}, пары ключ-значение. set — {}, уникальные элементы, без порядка.',
              },
            },
            {
              id: 'py-l34-s6',
              title: 'Возведение в степень',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Что выведет `print(2 ** 3)`?',
                correct: 8,
                explanation: 'Оператор `**` — возведение в степень. 2 в 3-й степени = 8.',
              },
            },
            {
              id: 'py-l34-s7',
              title: 'Изменяемые типы',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие из этих типов являются изменяемыми (mutable)?',
                options: [
                  { id: 'a', text: 'list' },
                  { id: 'b', text: 'tuple' },
                  { id: 'c', text: 'dict' },
                  { id: 'd', text: 'set' },
                ],
                correct: ['a', 'c', 'd'],
                explanation: 'list, dict и set можно изменять после создания. tuple — неизменяемый (immutable).',
              },
            },
            {
              id: 'py-l34-s8',
              title: 'Свойства коллекций',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого типа',
                columns: ['list', 'tuple', 'set'],
                rows: [
                  { label: 'Упорядоченный', correct: ['list', 'tuple'] },
                  { label: 'Изменяемый', correct: ['list'] },
                  { label: 'Уникальные элементы', correct: ['set'] },
                  { label: 'Поддерживает индексацию', correct: ['list', 'tuple'] },
                ],
                explanation: 'list — упорядоченный, изменяемый, индексируемый. tuple — упорядоченный, неизменяемый, индексируемый. set — неупорядоченный, изменяемый, уникальные элементы, без индексов.',
              },
            },
            {
              id: 'py-l34-s9',
              title: 'Напишите функцию',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите функцию `is_even(n)`, которая возвращает True, если n чётное, и False в противном случае.',
                starterCode: 'def is_even(n):\n    # ваш код\n    pass',
                mustInclude: [
                  { pattern: '^def is_even\\(n\\):', message: 'Нужна функция is_even(n)' },
                  { pattern: 'return', message: 'Функция должна использовать return' },
                  { pattern: '%\\s*2|//\\s*2', message: 'Используйте остаток от деления (%) или целочисленное деление' },
                ],
                explanation: 'def is_even(n):\n    return n % 2 == 0',
              },
            },
            {
              id: 'py-l34-s10',
              title: 'Ловушка аргументов',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему `def add_item(item, items=[])` считается плохой практикой?',
                options: [
                  { id: 'a', text: 'Так нельзя — SyntaxError' },
                  { id: 'b', text: 'Изменяемое значение по умолчанию создаётся один раз и переиспользуется между вызовами' },
                  { id: 'c', text: 'Список нельзя передать в аргумент' },
                  { id: 'd', text: 'Это медленнее, чем None' },
                ],
                correct: ['b'],
                explanation: 'Значение по умолчанию вычисляется при объявлении функции. Если это список, он будет одним и тем же для всех вызовов, и изменения «утекут» между ними. Правильно: `items=None` и `items = items or []`.',
              },
            },
          ],
        },
      ],
    },
  ],
};