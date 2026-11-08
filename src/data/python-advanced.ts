import type { Course } from './types';

export const pythonAdvancedCourse: Course = {
  slug: 'python-advanced',
  title: 'Python: продвинуто',
  subtitle: 'ООП, декораторы, генераторы, async, типизация и многопоточность',
  description:
    'Курс для тех, кто уже уверенно пишет на Python и хочет перейти на следующий уровень. Разберём ООП (классы, наследование, dataclass, магические методы, Page Object), декораторы (functools.wraps, декораторы с параметрами, pytest-маркеры), генераторы, async/await (event loop, gather, TaskGroup, httpx, pytest-asyncio), типизацию (Type hints, mypy, pyright, pre-commit), виртуальные окружения (venv, uv), многопоточность (GIL, threading, ThreadPoolExecutor, Lock, multiprocessing) и параллельный запуск тестов (pytest-xdist, Playwright). Практикум — комплексный экзамен.',
  level: 'Средний',
  tags: ['Python', 'ООП', 'Async', 'Типизация'],
  accent: '#3776ab',
  icon: 'python-advanced',
  outcomes: [
    'Проектировать классы: наследование, композиция, dataclass, магические методы',
    'Писать декораторы с параметрами и использовать functools.wraps',
    'Создавать генераторы и понимать, когда они экономят память',
    'Писать асинхронный код: async/await, gather, TaskGroup, Semaphore',
    'Использовать type hints и статическую проверку (mypy, pyright)',
    'Изолировать зависимости через venv и uv',
    'Понимать GIL и выбирать threading vs multiprocessing под задачу',
    'Запускать тесты параллельно через pytest-xdist и Playwright',
  ],
  requirements: [
    'Пройден курс «Python: основы» (или уверенный опыт)',
    'Понимание функций, классов на базовом уровне',
    'Установленный Python 3.10+ и pip',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — ООП (было py-m5)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m1',
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
            {
              id: 'py-l15-s4',
              title: 'Проверь себя: анатомия класса',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте элемент класса и его роль',
                pairs: [
                  { left: 'class Cart:', right: 'Объявление класса' },
                  { left: 'def __init__(self)', right: 'Конструктор, вызывается при Cart()' },
                  { left: 'self.items', right: 'Атрибут экземпляра' },
                  { left: 'Cart()', right: 'Создание экземпляра' },
                ],
                explanation:
                  'Класс — объявление, __init__ — конструктор (срабатывает при создании), self.items — атрибут экземпляра (свой у каждого), Cart() — вызов. Это минимальный словарь, без которого невозможно читать чужой ООП-код.',
              },
            },
            {
              id: 'py-l15-s5',
              title: 'Практика: класс Counter',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment(self):\n        # увеличьте count на 1\n        pass\n',
                    task: 'Допишите `Counter.increment()` — увеличивает `self.count` на 1. Создайте экземпляр, вызовите `increment()` трижды, сохраните `c.count` в переменную `result`.',
                    solution:
                      'class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment(self):\n        self.count += 1\n\nc = Counter()\nc.increment()\nc.increment()\nc.increment()\nresult = c.count',
                    expected: { type: 'variable', name: 'result', value: 3 },
                    hint: 'self.count += 1',
                  },
                },
              ],
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
                  type: 'mermaid',
                  caption: 'Базовый Page и наследники',
                  code: 'graph TD\n  Page["Page<br/>open()<br/>screenshot()"]\n  Login["LoginPage<br/>+ login()"]\n  Cart["CartPage<br/>+ add_item()"]\n  Admin["AdminPage<br/>+ admin_token<br/>open() переопределён,<br/>вызывает super()"]\n  Page --> Login\n  Page --> Cart\n  Page --> Admin',
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
            {
              id: 'py-l16-s4',
              title: 'Проверь себя: is-a vs has-a',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте отношение и предпочтительный механизм',
                pairs: [
                  { left: 'LoginPage и Page', right: 'Наследование (LoginPage является Page)' },
                  { left: 'CheckoutPage и CartPage', right: 'Композиция (CheckoutPage использует CartPage)' },
                  { left: 'Dog и Animal', right: 'Наследование (Dog является Animal)' },
                  { left: 'Car и Engine', right: 'Композиция (Car имеет Engine)' },
                ],
                explanation:
                  '«Является» (is-a) — наследование: LoginPage, Dog. «Использует / имеет» (has-a) — композиция: CheckoutPage, Car. Правило: если не уверены, что дочерний класс — это разновидность родителя, используйте композицию. Наследование — жёсткая связь, композиция — гибкая.',
              },
            },
            {
              id: 'py-l16-s5',
              title: 'Практика: наследование',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    # переопределите speak\n    pass\n',
                    task: 'Класс `Animal` уже есть. Переопределите `Dog.speak()` так, чтобы он возвращал `"Woof"`. Напечатайте `Dog().speak()`.',
                    solution:
                      'class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nprint(Dog().speak())',
                    expected: { type: 'stdout', value: 'Woof' },
                    hint: 'class Dog(Animal): def speak(self): return "Woof"',
                  },
                },
              ],
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
            {
              id: 'py-l17-s4',
              title: 'Проверь себя: dunder-методы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте метод и что он активирует',
                pairs: [
                  { left: '__init__', right: 'Создание объекта Cart()' },
                  { left: '__repr__', right: 'repr(obj), отладчик, логи' },
                  { left: '__eq__', right: 'Сравнение ==' },
                  { left: '__hash__', right: 'hash(obj), set/dict' },
                ],
                explanation:
                  '__init__ — конструктор. __repr__ — «официальное» строковое представление (в отладчике). __eq__ — равенство. __hash__ — хеширование для set/dict. Если определяете __eq__, добавьте и __hash__ (или frozen=True dataclass) — иначе объект перестанет быть хешируемым.',
              },
            },
            {
              id: 'py-l17-s5',
              title: 'Практика: dataclass',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n',
                    task: 'Создайте экземпляр `p = Point(3, 4)` и сохраните `p.x` в переменную `result`.',
                    solution:
                      'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np = Point(3, 4)\nresult = p.x',
                    expected: { type: 'variable', name: 'result', value: 3 },
                    hint: 'Point(3, 4) — конструктор уже сгенерирован @dataclass',
                  },
                },
              ],
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
            {
              id: 'py-l18-s4',
              title: 'Проверь себя: что НЕ в Page Object',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что НЕ должно попадать в Page Object?',
                options: [
                  { id: 'a', text: 'Локаторы элементов страницы' },
                  { id: 'b', text: 'Бизнес-логика (расчёт скидки, генерация тестовых данных)' },
                  { id: 'c', text: 'Работа с БД или API' },
                  { id: 'd', text: 'Метод login(email, password)' },
                ],
                correct: ['b', 'c'],
                explanation:
                  'Локаторы (a) и методы работы со страницей (d) — это норма Page Object. Бизнес-логика (b) — в хелперах/юнит-тестах бэкенда. Работа с БД/API (c) — в отдельных клиентах (api_client, db_helper). Page Object = только UI-слой.',
              },
            },
            {
              id: 'py-l18-s5',
              title: 'Практика: dataclass',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'from dataclasses import dataclass\n\n# Создайте @dataclass Credentials с email и password\n',
                    task: 'Создайте `@dataclass Credentials` с полями `email: str` и `password: str`. Создайте `c = Credentials("a@x.com", "secret")` и напечатайте `c.email`.',
                    solution:
                      'from dataclasses import dataclass\n\n@dataclass\nclass Credentials:\n    email: str\n    password: str\n\nc = Credentials("a@x.com", "secret")\nprint(c.email)',
                    expected: { type: 'stdout', value: 'a@x.com' },
                    hint: '@dataclass над классом + поля с аннотациями типов',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Декораторы и генераторы (было py-m6)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m2',
      title: 'Декораторы и генераторы',
      lessons: [
        {
          id: 'py-l19',
          title: 'Функции как объекты',
          minutes: 25,
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
              title: 'Функции как аргументы: map, filter, sorted',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Главное практическое применение «функции как значения» — передача функции в другую функцию. `sorted(..., key=...)`, `map`, `filter` — везде аргумент-функция. Это прямой мост к декораторам (следующий урок).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'sorted, map, filter',
                  code: 'users = [\n    {"name": "Анна", "age": 30},\n    {"name": "Борис", "age": 25},\n    {"name": "Вера", "age": 35},\n]\n\n# sorted с key — функция определяет правило сортировки\nsorted(users, key=lambda u: u["age"])\n# [{25}, {30}, {35}]\n\n# map — применить функцию к каждому элементу\nlist(map(lambda x: x * 2, [1, 2, 3]))\n# [2, 4, 6]\n\n# filter — оставить подходящие\nlist(filter(lambda x: x > 1, [1, 2, 3]))\n# [2, 3]\n\n# Своя функция высшего порядка\ndef apply_twice(f, x):\n    return f(f(x))\n\napply_twice(lambda x: x * 2, 5)   # 20 = (5*2)*2',
                },
                {
                  type: 'list',
                  items: [
                    'sorted(iter, key=func) — func задаёт «ключ сортировки»',
                    'map(func, iter) — применить func к каждому элементу',
                    'filter(func, iter) — оставить элементы, где func(x) == True',
                    'lambda x: expr — короткая безымянная функция (только одно выражение)',
                    'Функция высшего порядка — функция, принимающая или возвращающая функцию',
                  ],
                },
                {
                  type: 'note',
                  text: 'В 90% случаев `map`/`filter` заменяются list comprehension: `[x * 2 for x in [1, 2, 3]]` читается лучше. `sorted(..., key=...)` — единственное, где функция-аргумент незаменима. На собеседовании junior: «что такое lambda?» — «анонимная функция из одного выражения, у которой неявный return».',
                },
              ],
            },
            {
              id: 'py-l19-s3',
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
            {
              id: 'py-l19-s4',
              title: 'Проверь себя: функции первого класса',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения о функциях в Python верны?',
                options: [
                  { id: 'a', text: 'Функцию можно присвоить переменной' },
                  { id: 'b', text: 'Функцию можно передать в другую функцию как аргумент' },
                  { id: 'c', text: 'Функция — это объект, у неё есть атрибуты (__name__, __doc__)' },
                  { id: 'd', text: 'Функция обязана иметь имя — анонимных функций в Python нет' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'a, b, c — «функции первого класса»: можно присвоить, передать, у функции есть атрибуты. d — неверно: `lambda x: x * 2` — анонимная функция. Именно поэтому можно писать `sorted(users, key=lambda u: u["age"])`.',
              },
            },
            {
              id: 'py-l19-s5',
              title: 'Практика: замыкание',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'def make_greeter(greeting):\n    def inner(name):\n        # верните f"{greeting}, {name}"\n        pass\n    return inner\n',
                    task: 'Допишите `inner` так, чтобы он возвращал `f"{greeting}, {name}"`. Создайте `greet = make_greeter("Hi")` и напечатайте `greet("Anna")`.',
                    solution:
                      'def make_greeter(greeting):\n    def inner(name):\n        return f"{greeting}, {name}"\n    return inner\n\ngreet = make_greeter("Hi")\nprint(greet("Anna"))',
                    expected: { type: 'stdout', value: 'Hi, Anna' },
                    hint: 'inner замыкает greeting из внешней функции',
                  },
                },
              ],
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
                  type: 'mermaid',
                  caption: 'Что происходит при вызове декорированной функции',
                  code: `graph LR
                    Client["@timer<br/>def slow_task()"] --> Wrap["wrapper(*args, **kwargs)"]
                    Wrap -->|"1. start = time"| Timer["замер времени"]
                    Wrap -->|"2. result = func(*args)"| Orig["оригинальная slow_task"]
                    Orig -->|"3. return result"| Wrap
                    Wrap -->|"4. print elapsed"| Log["stdout"]
                    Wrap -->|"5. return result"| Out["Результат клиенту"]`
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
            {
              id: 'py-l20-s5',
              title: 'Практика: декоратор',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'import functools\n\ndef double(func):\n    # верните обёртку, удваивающую результат func\n    pass\n\n@double\ndef add(a, b):\n    return a + b\n',
                    task: 'Допишите декоратор `double` — он вызывает `func(*args, **kwargs)` и удваивает результат. После декорирования `add(2, 3)` должно вернуть `10`. Сохраните результат в переменную `result`.',
                    solution:
                      'import functools\n\ndef double(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs) * 2\n    return wrapper\n\n@double\ndef add(a, b):\n    return a + b\n\nresult = add(2, 3)',
                    expected: { type: 'variable', name: 'result', value: 10 },
                    hint: 'wrapper(*args, **kwargs) вызывает func и умножает результат на 2',
                  },
                },
              ],
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
            {
              id: 'py-l21-s4',
              title: 'Проверь себя: свойства генератора',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения о генераторах верны?',
                options: [
                  { id: 'a', text: 'Генератор одноразовый: пройдя цикл, повторно его не пройти' },
                  { id: 'b', text: 'Генератор экономит память — значения вычисляются по требованию' },
                  { id: 'c', text: 'Генератор поддерживает индексацию: gen[0]' },
                  { id: 'd', text: 'Генератор можно превратить в список через list(gen)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'a — одноразовый, второй `for` пустой. b — ленивый, экономит память. c — неверно: `gen[0]` бросает TypeError, генератор не последовательность. d — `list(gen)` работает, но «съест» всю память, обнулив смысл генератора. Правило: если нужен повторный проход — сохраните в список; если один проход по огромным данным — генератор.',
              },
            },
            {
              id: 'py-l21-s5',
              title: 'Практика: генератор',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'def squares(n):\n    # выдайте i * i для i от 0 до n - 1\n    pass\n',
                    task: 'Допишите генератор `squares(n)`, который выдаёт квадраты чисел от 0 до n-1. Соберите первые 5 значений в список `result` и напечатайте его.',
                    solution:
                      'def squares(n):\n    for i in range(n):\n        yield i * i\n\nresult = list(squares(5))\nprint(result)',
                    expected: { type: 'stdout', value: '[0, 1, 4, 9, 16]' },
                    hint: 'yield i * i внутри for i in range(n)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Async/await (было py-m7)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m3',
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
                  type: 'mermaid',
                  caption: 'Event loop: пока одна корутина ждёт, работает другая',
                  code: 'sequenceDiagram\n  participant EL as Event Loop\n  participant T1 as Task 1\n  participant T2 as Task 2\n  EL->>T1: запустить\n  T1->>EL: await (I/O)\n  EL->>T2: пока T1 ждёт — запустить T2\n  T2->>EL: await (I/O)\n  Note over EL: ждёт завершения I/O\n  EL-->>T1: результат готов\n  T1->>EL: продолжить\n  EL-->>T2: результат готов\n  T2->>EL: продолжить',
                },
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
            {
              id: 'py-l22-s4',
              title: 'Проверь себя: I/O vs CPU',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Для каких задач async даст реальное ускорение? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'Много параллельных HTTP-запросов к API' },
                  { id: 'b', text: 'Много запросов к PostgreSQL' },
                  { id: 'c', text: 'Парсинг 10 GB JSON в памяти' },
                  { id: 'd', text: 'Загрузка 100 файлов по сети' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'a, b, d — I/O-bound: пока один запрос/файл ждёт сеть, event loop запускает следующий. Парсинг JSON в памяти (c) — CPU-bound: тут async не поможет, нужен multiprocessing. Правило: «ждём» — async, «считаем» — процессы.',
              },
            },
            {
              id: 'py-l22-s5',
              title: 'Практика: async / await',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'import asyncio\n\nasync def main():\n    # напечатайте start, подождите 0.1, напечатайте end\n    pass\n\n# asyncio.run(main())\n',
                    task: 'Напишите `async def main()`, которая печатает `start`, ждёт `await asyncio.sleep(0.1)`, печатает `end`. Запустите через `asyncio.run(main())`.',
                    solution:
                      'import asyncio\n\nasync def main():\n    print("start")\n    await asyncio.sleep(0.1)\n    print("end")\n\nasyncio.run(main())',
                    expected: { type: 'stdout', value: 'start\nend' },
                    hint: 'import asyncio, await asyncio.sleep(0.1), asyncio.run(main())',
                  },
                },
              ],
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
                  type: 'mermaid',
                  caption: 'Последовательно vs gather',
                  code: 'graph LR\n  subgraph Seq["Последовательно — 3 сек"]\n    A1["fetch a"] --> A2["fetch b"] --> A3["fetch c"]\n  end\n  subgraph Par["gather — 1 сек"]\n    P1["fetch a"]\n    P2["fetch b"]\n    P3["fetch c"]\n  end',
                },
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
            {
              id: 'py-l23-s4',
              title: 'Проверь себя: gather vs TaskGroup',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие утверждения о `asyncio.gather` и `asyncio.TaskGroup` верны?',
                options: [
                  { id: 'a', text: 'gather возвращает список результатов в порядке переданных задач' },
                  { id: 'b', text: 'TaskGroup при падении одной задачи отменяет остальные и бросает ExceptionGroup' },
                  { id: 'c', text: 'TaskGroup появился в Python 3.11' },
                  { id: 'd', text: 'gather и TaskGroup взаимозаменяемы без разницы в поведении' },
                ],
                correct: ['a', 'b', 'c'],
                explanation:
                  'gather (a) — список в порядке задач. TaskGroup (b, c) — 3.11+, при ошибке отменяет остальные и бросает ExceptionGroup. Они НЕ взаимозаменяемы (d): gather по умолчанию «падает на первой ошибке, но не отменяет» (если не return_exceptions), TaskGroup — «отменяет всё». Для «все задачи важны» — gather(return_exceptions=True); для «одна упала — всё плохо» — TaskGroup.',
              },
            },
            {
              id: 'py-l23-s5',
              title: 'Практика: asyncio.gather',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'import asyncio\n\nasync def fetch_a():\n    return "a"\n\nasync def fetch_b():\n    return "b"\n\nasync def main():\n    # получите обе через asyncio.gather и напечатайте\n    pass\n\nasyncio.run(main())\n',
                    task: 'Через `asyncio.gather` получите результаты `fetch_a()` и `fetch_b()` и напечатайте список.',
                    solution:
                      'import asyncio\n\nasync def fetch_a():\n    return "a"\n\nasync def fetch_b():\n    return "b"\n\nasync def main():\n    results = await asyncio.gather(fetch_a(), fetch_b())\n    print(results)\n\nasyncio.run(main())',
                    expected: { type: 'stdout', value: "['a', 'b']" },
                    hint: 'await asyncio.gather(coro1, coro2)',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l24',
          title: 'Async в автотестах',
          minutes: 30,
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
                  lang: 'bash',
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
            {
              id: 'py-l24-s4',
              title: 'Проверь себя: asyncio_mode',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `asyncio_mode = auto` в pytest.ini?',
                options: [
                  { id: 'a', text: 'Автоматически устанавливает pytest-asyncio при запуске тестов' },
                  { id: 'b', text: 'Запускает все `async def` тесты как async без явного `@pytest.mark.asyncio`' },
                  { id: 'c', text: 'Ускоряет тесты в 10 раз' },
                  { id: 'd', text: 'Отключает async-режим для всех тестов' },
                ],
                correct: ['b'],
                explanation:
                  'asyncio_mode = auto — все `async def test_*` автоматически запускаются в event loop без декоратора. Альтернатива — strict (по умолчанию): тогда нужно писать `@pytest.mark.asyncio` на каждом async-тесте. На новом проекте — auto удобнее, на legacy — strict, чтобы не сломать существующее.',
              },
            },
            {
              id: 'py-l24-s5',
              title: 'Практика: gather-тайминги',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Проверим на числах, почему `gather` быстрее последовательного `await` в цикле. Если каждый запрос «висит» 1 секунду, а запросов 10 — сколько всего времени? Формула: последовательно = N × T, параллельно (gather) = T (при достаточной параллельности).',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'n = 10            # запросов\nt_per = 1.0       # секунд на запрос\n\n# Задача: посчитать, во сколько раз gather быстрее последовательного кода.\n# sequential = n * t_per\n# concurrent = t_per  (при достаточной параллельности)\n# speedup = sequential / concurrent\n# Формат: "<целое>x"\n\nspeedup = None  # TODO\nprint(f"{speedup:.0f}x")\n',
                    task: 'Посчитайте ускорение: `sequential = n × t_per`, `concurrent = t_per`, `speedup = sequential / concurrent`. Выведите с суффиксом `x`, целым числом.',
                    solution:
                      'n = 10\nt_per = 1.0\n\nsequential = n * t_per\nconcurrent = t_per\nspeedup = sequential / concurrent\nprint(f"{speedup:.0f}x")',
                    expected: { type: 'stdout', value: '10x' },
                    hint: 'speedup = (n * t_per) / t_per = n',
                  },
                },
                {
                  type: 'note',
                  text: 'В реальности ускорение чуть меньше `n` — из-за оверхеда на создание задач, ограничений сервера, DNS. На 50 запросах gather даст 10–30×. На 1000 запросах без Semaphore — сервер упадёт, а не ускорится. Правило: Semaphore(10–50) + gather — золотая середина.',
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Типизация и инструменты (было py-m8)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m4',
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
            {
              id: 'py-l25-s4',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип и его назначение',
                pairs: [
                  { left: 'str | None', right: 'Строка или None (может отсутствовать)' },
                  { left: 'TypedDict', right: 'Словарь с фиксированными полями (JSON-ответ API)' },
                  { left: 'Protocol', right: 'Утиная типизация: любой объект с нужным методом' },
                  { left: 'Callable[[int], str]', right: 'Функция, принимающая int, возвращающая str' },
                ],
                explanation:
                  'str | None — «может быть None» (замена Optional). TypedDict — фиксированные ключи, IDE подсказывает. Protocol — «любой с таким методом» без наследования. Callable — «функция с такой сигнатурой». Эти четыре — 90% продвинутой типизации в реальных проектах.',
              },
            },
            {
              id: 'py-l25-s5',
              title: 'Практика: type hints',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'def add(a: int, b: int) -> int:\n    return a + b\n\n# TODO: присвойте результат add(2, 3) переменной result\n',
                    task: 'Присвойте `add(2, 3)` переменной `result`. `add` уже с type hints — просто вызовите её.',
                    solution: 'def add(a: int, b: int) -> int:\n    return a + b\n\nresult = add(2, 3)',
                    expected: { type: 'variable', name: 'result', value: 5 },
                    hint: 'result = add(2, 3)',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l26',
          title: 'mypy и pyright: проверка типов',
          minutes: 25,
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
            {
              id: 'py-l26-s4',
              title: 'pyproject.toml: единый конфиг',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'pyproject.toml — стандарт конфигурации Python-проектов (PEP 518). Один файл вместо mypy.ini + pytest.ini + ruff.toml + black.toml. Все инструменты читают свои секции `[tool.X]`.',
                },
                {
                  type: 'code',
                  lang: 'toml',
                  caption: 'pyproject.toml: mypy + pytest + ruff',
                  code: '[tool.mypy]\npython_version = "3.12"\nstrict = true\nwarn_unused_ignores = true\n\n[tool.pytest.ini_options]\nasyncio_mode = "auto"\ntestpaths = ["tests"]\naddopts = "-v --strict-markers"\n\n[tool.ruff]\nline-length = 100\ntarget-version = "py312"\n\n[tool.ruff.lint]\nselect = ["E", "F", "I", "N", "UP", "B"]',
                },
                {
                  type: 'list',
                  items: [
                    '[tool.mypy] — настройки проверки типов',
                    '[tool.pytest.ini_options] — настройки pytest',
                    '[tool.ruff] — линтер (замена flake8 + isort + pyupgrade)',
                    '[tool.uv] — менеджер пакетов uv (2025)',
                    'CI и IDE читают один файл вместо четырёх',
                  ],
                },
                {
                  type: 'note',
                  text: 'Один pyproject.toml в корне — стандарт 2025. Если проект старый — можно оставить отдельные `mypy.ini`/`pytest.ini`. Но для новых — только pyproject.toml. На собеседовании junior Python: «где настраивается mypy?» — «в pyproject.toml, секция [tool.mypy]».',
                },
              ],
            },
            {
              id: 'py-l26-s5',
              title: 'Практика: type hints',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      '# Напишите функцию greet(name: str) -> str\n',
                    task: 'Напишите функцию `greet(name: str) -> str`, возвращающую `f"Hi, {name}"`. Вызовите с `"Anna"` и напечатайте результат.',
                    solution:
                      'def greet(name: str) -> str:\n    return f"Hi, {name}"\n\nprint(greet("Anna"))',
                    expected: { type: 'stdout', value: 'Hi, Anna' },
                    hint: 'def greet(name: str) -> str: return f"Hi, {name}"',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'py-l27',
          title: 'Виртуальные окружения и зависимости',
          minutes: 30,
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
                  code: '# Плохо: latest\nrequests\npytest\nplaywright\n\n# Тоже плохо: слишком свободно\nrequests>=2.0\npytest~=8.0\n\n# Хорошо: точные версии\nrequests==2.32.3\npytest==8.3.3\nplaywright==1.48.0\n\n# Компромисс: минорные обновления допустимы\nrequests~=2.32.3       # >=2.32.3, <2.33.0',
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
            {
              id: 'py-l27-s4',
              title: 'pyproject.toml и современные менеджеры',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'requirements.txt — самый простой, но не единственный формат. В 2025 стандарт — pyproject.toml + lock-файл. Разные инструменты, разный подход.',
                },
                {
                  type: 'table',
                  caption: 'Инструменты управления зависимостями',
                  head: ['Инструмент', 'Формат', 'Скорость', 'Когда'],
                  rows: [
                    ['pip + venv', 'requirements.txt', 'Медленно', 'Старые проекты, минимализм'],
                    ['uv', 'pyproject.toml + uv.lock', 'Очень быстро (Rust)', 'Новые проекты в 2025'],
                    ['Poetry', 'pyproject.toml + poetry.lock', 'Средне', 'Уже настроено в команде'],
                    ['PDM', 'pyproject.toml + pdm.lock', 'Средне', 'Альтернатива Poetry'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'toml',
                  caption: 'pyproject.toml (uv / Poetry / PDM)',
                  code: '[project]\nname = "myapp"\nversion = "0.1.0"\nrequires-python = ">=3.11"\ndependencies = [\n    "requests==2.32.3",\n    "httpx==0.27.2",\n]\n\n[project.optional-dependencies]\ndev = [\n    "pytest==8.3.3",\n    "pytest-asyncio==0.24.0",\n    "mypy==1.13.0",\n    "ruff==0.7.0",\n]',
                },
                {
                  type: 'list',
                  items: [
                    'pyproject.toml — метаданные + зависимости + настройки инструментов',
                    'lock-файл (uv.lock, poetry.lock) — точные версии всех транзитивных зависимостей',
                    'lock-файл коммитится в Git — для воспроизводимости',
                    'uv — самый быстрый (Rust), стандарт 2025',
                    'requirements.txt — простой, но без lock-файла воспроизводимость хуже',
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: lock-файл — обязательно в Git. Без него CI через месяц поставит другие транзитивные версии — «на моей машине работает, на CI — нет». lock-файл гарантирует, что все получат ровно те же версии. На собеседовании: «чем pyproject.toml отличается от requirements.txt?» — «pyproject — метаданные + все инструменты, requirements — только зависимости, lock-файл — точные версии».',
                },
              ],
            },
            {
              id: 'py-l27-s5',
              title: 'Проверь себя: lock-файлы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем коммитить lock-файл (`uv.lock`, `poetry.lock`, `package-lock.json`) в Git?',
                options: [
                  { id: 'a', text: 'Это ускоряет установку зависимостей' },
                  { id: 'b', text: 'Гарантирует, что все разработчики и CI получат ровно те же версии транзитивных зависимостей' },
                  { id: 'c', text: 'Требуется для публикации в PyPI' },
                  { id: 'd', text: 'Заменяет pyproject.toml' },
                ],
                correct: ['b'],
                explanation:
                  'lock-файл фиксирует точные версии всех зависимостей — включая транзитивные (зависимости зависимостей). Без него через месяц CI может получить другую версию библиотеки — и «всё работает локально, падает на CI». lock-файл коммитится в Git. Без него нет воспроизводимости.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Многопоточность (было py-m9)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m5',
      title: 'Многопоточность и многопроцессность',
      lessons: [
        {
          id: 'py-l28',
          title: 'GIL: почему Python «не умеет» в многопоточность',
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
                  type: 'mermaid',
                  caption: 'GIL: только один поток выполняет Python-код',
                  code: 'graph LR\n  T1["Поток 1"] --> GIL{"GIL"}\n  T2["Поток 2"] --> GIL\n  T3["Поток 3"] --> GIL\n  GIL -->|"только один<br/>одновременно"| Py["Python-байткод"]\n  Py --> CPU["Одно ядро CPU"]\n  GIL -.->|"I/O: GIL<br/>отпускается"| IO["Сеть / диск / sleep"]',
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
            {
              id: 'py-l28-s4',
              title: 'Проверь себя: когда threading НЕ поможет',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Для каких задач threading НЕ даст ускорения? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'Цикл на 10M итераций с арифметикой' },
                  { id: 'b', text: 'Шифрование 100 файлов через hashlib' },
                  { id: 'c', text: 'Загрузка 100 файлов по HTTP' },
                  { id: 'd', text: 'Парсинг 100 больших JSON-строк через json.loads' },
                ],
                correct: ['a', 'd'],
                explanation:
                  'a и d — CPU-bound (чистая арифметика и json.loads на чистом Python), GIL не отпускается — потоки не ускоряют. b — хитрый случай: hashlib — C-расширение, которое отпускает GIL, поэтому threading может помочь. c — I/O-bound, потоки ускоряют. Правило: «чистый Python-код» — GIL держит, «C-расширения» — часто отпускают.',
              },
            },
            {
              id: 'py-l28-s5',
              title: 'Практика: CPU-bound vs I/O-bound',
              type: 'theory',
              blocks: [
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'def cpu_work(n):\n    total = 0\n    for i in range(n):\n        total += i * i\n    return total\n',
                    task: 'Вычислите `cpu_work(1000)` и сохраните результат в переменную `result`.',
                    solution:
                      'def cpu_work(n):\n    total = 0\n    for i in range(n):\n        total += i * i\n    return total\n\nresult = cpu_work(1000)',
                    expected: { type: 'variable', name: 'result', value: 332833500 },
                    hint: 'result = cpu_work(1000)',
                  },
                },
              ],
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
                  type: 'mermaid',
                  caption: 'main thread запускает воркеров и ждёт через join()',
                  code: 'graph TD\n  Main["main thread"] -->|"t.start()"| T1["worker A"]\n  Main -->|"t.start()"| T2["worker B"]\n  Main -->|"t.start()"| T3["worker C"]\n  T1 -.->|"t.join()"| Wait["main ждёт"]\n  T2 -.-> Wait\n  T3 -.-> Wait\n  Wait --> Done["Все потоки завершены"]',
                },
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
              title: 'Проверь себя: методы Thread',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте метод/атрибут Thread и его назначение',
                pairs: [
                  { left: 'start()', right: 'Запустить поток в фоне' },
                  { left: 'join()', right: 'Дождаться завершения' },
                  { left: 'is_alive()', right: 'Проверить, жив ли поток' },
                  { left: 'daemon', right: 'Фоновый поток: не блокирует выход из программы' },
                ],
                explanation:
                  'start() — «побежали». join() — «подожди». is_alive() — «ты жив?». daemon=True — «я фоновый, убей меня при выходе». Эти четыре — минимум для работы с потоками. Без join() main закончится раньше, и результат может быть потерян.',
              },
            },
            {
              id: 'py-l29-s4',
              title: 'Проверь себя: join',
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
            {
              id: 'py-l29-s5',
              title: 'Практика: расчёт порядка потоков',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Потоки выполняются параллельно — порядок print недетерминирован. Но если запускать последовательно с join() — гарантирован. Посчитаем время: `N` потоков по `T` секунд. Без join — main не ждёт, время = 0 (потоки работают в фоне). С join — время = max(T) при параллельности.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'n = 5                # потоков\nt_per = 0.5          # секунд на поток\n\n# Задача: посчитать время выполнения при параллельном запуске с join.\n# При достаточной параллельности: sequential = n * t_per, parallel = t_per.\n# speedup = sequential / parallel\n# Формат: "<целое>x"\n\nspeedup = None  # TODO\nprint(f"{speedup:.0f}x")\n',
                    task: 'Посчитайте ускорение при параллельном запуске: `sequential = n × t_per`, `parallel = t_per`, `speedup = sequential / parallel`. Выведите целым числом с `x`.',
                    solution:
                      'n = 5\nt_per = 0.5\n\nsequential = n * t_per\nparallel = t_per\nspeedup = sequential / parallel\nprint(f"{speedup:.0f}x")',
                    expected: { type: 'stdout', value: '5x' },
                    hint: 'speedup = (n * t_per) / t_per = n',
                  },
                },
                {
                  type: 'note',
                  text: '5 потоков по 0.5 сек = 5× ускорение (в идеале). На практике — 4–4.5× из-за оверхеда на создание, GIL при маленьких операциях. Для I/O-bound (sleep, HTTP) — близко к n. Для CPU-bound — ~1× (GIL). Без join() — вообще 0, но результаты потеряются.',
                },
              ],
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
            {
              id: 'py-l30-s4',
              title: 'Практика: тайминги пула',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Сколько времени займёт N задач в пуле из W воркеров, если каждая задача — T секунд? Формула: `ceil(N / W) × T` (волны параллелизма). Например, 8 задач, 4 воркера, по 0.5 сек — 2 волны × 0.5 = 1 сек.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'import math\n\nn_tasks = 8          # задач\nworkers = 4          # потоков в пуле\nt_per = 0.5          # секунд на задачу\n\n# Задача: посчитать время выполнения.\n# waves = ceil(n_tasks / workers)\n# total = waves * t_per\n# Формат: "<total> сек" (одно число)\n\ntotal = None  # TODO\nprint(f"{total} сек")\n',
                    task: 'Посчитайте время: `waves = ceil(8 / 4) = 2`, `total = 2 × 0.5 = 1.0`. Выведите с суффиксом `сек`.',
                    solution:
                      'import math\n\nn_tasks = 8\nworkers = 4\nt_per = 0.5\n\nwaves = math.ceil(n_tasks / workers)\ntotal = waves * t_per\nprint(f"{total} сек")',
                    expected: { type: 'stdout', value: '1.0 сек' },
                    hint: 'waves = math.ceil(n_tasks / workers); total = waves * t_per',
                  },
                },
                {
                  type: 'note',
                  text: 'Если задач 8, а воркеров 4 — 2 волны по 0.5 сек = 1.0 сек. Если 8 задач, 8 воркеров — 1 волна, 0.5 сек. Но: 8 воркеров ≠ 8× ускорение, если задача — CPU-bound (GIL). Для I/O (sleep, HTTP) — близко к идеалу. На собеседовании: «сколько воркеров ставить?» — «для I/O 10–50, для CPU-bound — не потоки, а процессы».',
                },
              ],
            },
            {
              id: 'py-l30-s5',
              title: 'Проверь себя: map vs submit',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Когда стоит выбрать `submit` вместо `map`?',
                options: [
                  { id: 'a', text: 'Нужен таймаут на отдельную задачу' },
                  { id: 'b', text: 'Нужно обрабатывать результаты по мере завершения (as_completed)' },
                  { id: 'c', text: 'Нужен список результатов в порядке исходного iterable' },
                  { id: 'd', text: 'Нужна разная обработка ошибок для разных задач' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'submit + Future даёт: таймаут (a), as_completed (b), кастомную обработку ошибок (d). А map (c) — проще, но даёт список в порядке iterable и общий try/except на весь список. Для «все задачи простые и одинаковые» — map. Для «нужен контроль над каждой» — submit.',
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
                  type: 'mermaid',
                  caption: 'Потерянное обновление: оба потока читают старый counter',
                  code: 'sequenceDiagram\n  participant T1 as Поток 1\n  participant C as counter = 0\n  participant T2 as Поток 2\n\n  T1->>C: read → 0\n  T2->>C: read → 0\n  Note over T1,T2: Оба потока прочитали<br/>старое значение 0\n  T1->>C: write 1\n  T2->>C: write 1\n  Note over C: Результат: 1<br/>(ожидалось 2)<br/>Одно обновление потеряно',
                },
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
            {
              id: 'py-l31-s4',
              title: 'Проверь себя: примитивы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте примитив синхронизации и его назначение',
                pairs: [
                  { left: 'Lock', right: 'Только один поток за раз' },
                  { left: 'RLock', right: 'Тот же поток может войти повторно' },
                  { left: 'Semaphore(N)', right: 'N потоков одновременно' },
                  { left: 'Event', right: 'Флаг: один поток ждёт, другой будит' },
                ],
                explanation:
                  'Lock — «один за раз». RLock — «один, но можно повторно из того же потока» (например, рекурсивный вызов). Semaphore(N) — «N за раз» (rate limiting). Event — «сигнал» между потоками (один ждёт, другой устанавливает).',
              },
            },
            {
              id: 'py-l31-s5',
              title: 'Практика: симуляция race и Lock',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Сымитируем race condition без реальных потоков: каждый «поток» читает counter, прибавляет 1, пишет обратно. Если два потока «одновременно» прочитали одно и то же значение — одна инкрементация теряется. Посчитаем, сколько получится при N инкрементациях с `lost`-потерями.',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      'total_increments = 100   # инкрементаций\nlost_per_pair = 1        # потерь на пару «одновременных» чтений\n# Сымитируем: каждые 2 инкремента, выполненных «одновременно»,\n# теряют 1 (оба прочитали одно значение).\n# lost = (total_increments // 2) * lost_per_pair\n# final = total_increments - lost\n\nlost = None  # TODO\nfinal = None  # TODO\nprint(f"{final}")\n',
                    task: 'Посчитайте `lost = (total_increments // 2) × lost_per_pair` и `final = total_increments - lost`. Выведите `final`.',
                    solution:
                      'total_increments = 100\nlost_per_pair = 1\n\nlost = (total_increments // 2) * lost_per_pair\nfinal = total_increments - lost\nprint(f"{final}")',
                    expected: { type: 'stdout', value: '50' },
                    hint: 'lost = (total_increments // 2) * lost_per_pair; final = total_increments - lost',
                  },
                },
                {
                  type: 'note',
                  text: '100 инкрементаций «парами» → 50 пар → 50 потеряно → 50 осталось. Это упрощённая модель, но она показывает суть: без Lock результат непредсказуем и обычно меньше ожидаемого. С Lock — всегда 100. Именно поэтому Lock обязателен для счётчиков, буферов, любых общих mutable-структур в потоках.',
                },
              ],
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
                kind: 'multiple',
                question: 'Зачем нужен `if __name__ == "__main__":` в multiprocessing на Windows?',
                options: [
                  { id: 'a', text: 'Без него дочерние процессы при импорте модуля создадут новые процессы — бесконечная рекурсия' },
                  { id: 'b', text: 'Это ускоряет выполнение в 2 раза' },
                  { id: 'c', text: 'Windows использует spawn-модель: дочерний процесс импортирует ваш модуль заново' },
                  { id: 'd', text: 'Это требование PEP 8' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'Windows/macOS используют spawn: дочерний процесс импортирует ваш модуль заново. Без защиты `if __name__` он снова создаст процессы, те — ещё, и так до краша. На Linux (fork) такого не было бы. b — миф (ускорения нет). d — PEP 8 не про multiprocessing.',
              },
            },
            {
              id: 'py-l32-s4',
              title: 'Проверь себя: когда multiprocessing',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'У вас 1000 HTTP-запросов к API. Что выбрать?',
                options: [
                  { id: 'a', text: 'multiprocessing — процессы быстрее' },
                  { id: 'b', text: 'threading/async — I/O-bound, GIL отпускается на I/O' },
                  { id: 'c', text: 'Всё равно — разницы нет' },
                  { id: 'd', text: 'multiprocessing, потому что запросов много' },
                ],
                correct: ['b'],
                explanation:
                  'HTTP — I/O-bound: GIL отпускается, потоки/async работают параллельно. multiprocessing (a, d) — оверкилл: 1000 процессов × ~30 MB RAM = 30 GB, IPC-оверхед. Правило: I/O — потоки/async, CPU-bound (вычисления, парсинг, шифрование) — процессы.',
              },
            },
            {
              id: 'py-l32-s5',
              title: 'Практика: параллельное ускорение',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Сколько времени займёт CPU-bound задача на N ядрах, если последовательно — T секунд? Формула: `T / N` (в идеале, без учёта оверхеда). Реально — `T / N × 1.1` (10% оверхед на IPC и создание процессов).',
                },
                {
                  type: 'python',
                  python: {
                    starterCode:
                      't_sequential = 20.0    # секунд последовательно\ncores = 4              # процессов\noverhead = 1.1         # 10% оверхед\n\n# Задача: посчитать время с multiprocessing.\n# parallel = (t_sequential / cores) * overhead\n# Формат: два знака после точки\n\nparallel = None  # TODO\nprint(f"{parallel:.2f} сек")\n',
                    task: 'Посчитайте `parallel = (t_sequential / cores) × overhead`. Выведите с точностью 2 знака.',
                    solution:
                      't_sequential = 20.0\ncores = 4\noverhead = 1.1\n\nparallel = (t_sequential / cores) * overhead\nprint(f"{parallel:.2f} сек")',
                    expected: { type: 'stdout', value: '5.50 сек' },
                    hint: 'parallel = (t_sequential / cores) * overhead',
                  },
                },
                {
                  type: 'note',
                  text: '20 сек / 4 ядра × 1.1 = 5.5 сек. В идеале было бы 5 сек. Оверхед — создание процессов, передача данных через IPC, синхронизация. Для реальных задач: 4× ускорение на 4 ядрах — уже хорошо. 8× на 8 ядрах — редкость (амдал: не всё параллелится). На собеседовании: «какое ускорение ожидать?» — «2–3× на 4 ядрах — реалистично, 4× — идеал».',
                },
              ],
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
            {
              id: 'py-l33-s5',
              title: 'Проверь себя: задача → инструмент',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте задачу и оптимальный инструмент',
                pairs: [
                  { left: '100 HTTP-запросов к API', right: 'asyncio.gather + httpx' },
                  { left: 'Парсинг 1000 больших JSON', right: 'multiprocessing.Pool' },
                  { left: '100 запросов к БД через блокирующий psycopg2', right: 'ThreadPoolExecutor' },
                  { left: 'Параллельный прогон pytest', right: 'pytest-xdist (-n auto)' },
                ],
                explanation:
                  'HTTP без блокирующих библиотек — asyncio. CPU-bound парсинг — multiprocessing. Блокирующий клиент БД — ThreadPoolExecutor (не переписывать на async). Параллельные тесты — pytest-xdist. Правило: «много ждём» → потоки/async, «много считаем» → процессы, «тесты» → xdist.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m6 — Практикум (было py-m10)
    // ─────────────────────────────────────────────
    {
      id: 'py-a-m6',
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