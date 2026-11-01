import type { Course } from './types';

export const designCourse: Course = {
  slug: 'design-patterns',
  title: 'Проектирование и паттерны',
  subtitle: 'SOLID, GoF-паттерны и архитектура — как писать код, который переживёт рефакторинг',
  description:
    'Курс для тех, кто хочет писать код, который легко менять. Разберём принципы SOLID на реальных примерах, 10 самых используемых паттернов GoF, архитектурные паттерны (Repository, Unit of Work), а также монолит vs микросервисы, event-driven и CQRS. Без академизма — только то, что реально используется в проде.',
  level: 'Средний',
  tags: ['Архитектура', 'SOLID', 'Паттерны'],
  accent: '#7c3aed',
  icon: 'design',
  outcomes: [
    'Объяснять каждый из пяти принципов SOLID и узнавать нарушения в коде',
    'Применять 10 ключевых паттернов GoF осознанно (а не «потому что модно»)',
    'Понимать разницу монолит / микросервисы / модульный монолит',
    'Проектировать слой доступа к данным (Repository)',
    'Выбирать архитектуру под задачу, а не под хайп',
  ],
  requirements: ['Опыт ООП (Python или другой язык)', 'Понимание базовых принципов проектирования'],
  modules: [
    {
      id: 'dp-m1',
      title: 'SOLID и принципы проектирования',
      lessons: [
        {
          id: 'dp-l1',
          title: 'Зачем паттерны и что такое «хороший код»',
          minutes: 20,
          steps: [
            {
              id: 'dp-l1-s1',
              title: 'Паттерны — это словарь, а не рецепты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Паттерны проектирования — это не «готовые решения», а общий словарь для типовых проблем. Когда коллега говорит «давай сделаем Strategy для расчёта скидок», он имеет в виду конкретную структуру классов. Паттерн — это не код, это название подхода.',
                },
                {
                  type: 'p',
                  text: 'Паттерны появились из книги «Design Patterns: Elements of Reusable Object-Oriented Software» (1994) — «банды четырёх» (Gang of Four, GoF): Эрих Гамма, Ричард Хелм, Ральф Джонсон, Джон Влиссидес. Оттуда — 23 классических паттерна.',
                },
                {
                  type: 'list',
                  items: [
                    'Паттерн — это название для повторяющегося решения',
                    'Паттерн — не догма: если не подходит к задаче, не надо его «прикручивать»',
                    'Главное — не «применить паттерн», а «решить проблему»',
                    'Плохой код с паттернами — хуже, чем хороший код без паттернов',
                  ],
                },
                {
                  type: 'note',
                  text: 'Паттерны — это побочный продукт принципов SOLID. Если код следует SOLID, паттерны появляются сами. Если пытаться «вставить паттерн» без принципов — получится over-engineering и «соборная архитектура» из классов на каждый чих.',
                },
              ],
            },
            {
              id: 'dp-l1-s2',
              title: 'Три метрики «хорошего кода»',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Есть три классические метрики связности и сцепления (coupling/cohesion), по которым оценивают дизайн:',
                },
                {
                  type: 'table',
                  caption: 'Метрики',
                  head: ['Метрика', 'Что значит', 'Хорошо'],
                  rows: [
                    ['Coupling (сцепление)', 'Насколько модули зависят друг от друга', 'Низкое'],
                    ['Cohesion (связность)', 'Насколько элементы внутри модуля относятся к одному', 'Высокое'],
                    ['Complexity (сложность)', 'Сколько путей выполнения и связей', 'Низкая'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Пример: класс `OrderService`, который знает про БД, отправляет email, считает скидку, генерирует PDF — высокое сцепление (coupling) с кучей всего и низкая связность (cohesion), потому что внутри разнородные задачи. Разделив на `OrderRepository`, `EmailService`, `DiscountCalculator`, `InvoiceGenerator` — получаем низкое coupling и высокую cohesion.',
                },
                {
                  type: 'note',
                  text: 'Именно этими метриками оперируют на code review. «У этого класса слишком много зависимостей» = высокое coupling. «Этот класс делает три разные вещи» = низкая cohesion. Принципы SOLID — конкретные приёмы, как улучшить эти метрики.',
                },
              ],
            },
            {
              id: 'dp-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое coupling (сцепление) в контексте дизайна кода?',
                options: [
                  { id: 'a', text: 'Насколько много кода в модуле' },
                  { id: 'b', text: 'Насколько модули зависят друг от друга' },
                  { id: 'c', text: 'Сколько тестов покрывает модуль' },
                  { id: 'd', text: 'Скорость выполнения кода' },
                ],
                correct: ['b'],
                explanation:
                  'Coupling — это степень зависимости между модулями. Чем меньше модуль знает о других модулях — тем ниже coupling, тем проще менять и тестировать. Противоположность — cohesion (связность), «насколько элементы внутри одного модуля относятся к одной задаче». Хороший дизайн: низкое coupling, высокое cohesion.',
              },
            },
          ],
        },
        {
          id: 'dp-l2',
          title: 'SRP и OCP',
          minutes: 25,
          steps: [
            {
              id: 'dp-l2-s1',
              title: 'SRP: одна причина для изменения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'SRP (Single Responsibility Principle) — «у класса должна быть одна причина для изменения». Не «одна задача», а «одна причина для изменения». Один класс — одна ответственность перед бизнесом.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Нарушение SRP',
                  code: 'class Order:\n    def calculate_total(self):\n        ...\n\n    def save_to_db(self):\n        # знает про БД\n        ...\n\n    def send_email(self):\n        # знает про SMTP\n        ...\n\n    def generate_pdf(self):\n        # знает про PDF\n        ...',
                },
                {
                  type: 'p',
                  text: 'Проблема: если поменяется формат PDF — правим Order. Если поменяется БД — правим Order. Если поменяется email-провайдер — правим Order. Три причины для изменения в одном классе = нарушение SRP. Плюс тесты: чтобы протестировать calculate_total, приходится тянуть БД и SMTP.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Соблюдение SRP',
                  code: 'class Order:\n    def calculate_total(self):\n        ...\n\nclass OrderRepository:\n    def save(self, order):\n        ...\n\nclass EmailService:\n    def send(self, to, subject, body):\n        ...\n\nclass InvoiceGenerator:\n    def generate(self, order):\n        ...',
                },
                {
                  type: 'note',
                  text: 'SRP — самый важный и самый непонятый принцип SOLID. Часто говорят «один класс — одна задача», но правильно — «одна причина для изменения». `Order` может делать много вещей (считать итог, применять скидку) — если они меняются по одной причине (правила расчёта), это одна ответственность.',
                },
              ],
            },
            {
              id: 'dp-l2-s2',
              title: 'OCP: открыт для расширения, закрыт для изменения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'OCP (Open-Closed Principle) — «программные сущности должны быть открыты для расширения, но закрыты для изменения». Проще: новая функциональность добавляется без правки старого кода.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Нарушение OCP',
                  code: 'def calculate_discount(order, customer_type):\n    if customer_type == "regular":\n        return order.total * 0.05\n    elif customer_type == "vip":\n        return order.total * 0.10\n    elif customer_type == "employee":\n        return order.total * 0.20\n    # Хотим добавить "partner" — правим эту функцию',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Соблюдение OCP',
                  code: 'from abc import ABC, abstractmethod\n\nclass DiscountStrategy(ABC):\n    @abstractmethod\n    def calculate(self, order) -> float: ...\n\nclass RegularDiscount(DiscountStrategy):\n    def calculate(self, order):\n        return order.total * 0.05\n\nclass VipDiscount(DiscountStrategy):\n    def calculate(self, order):\n        return order.total * 0.10\n\n# Добавить "partner" — новый класс, старая логика не меняется:\nclass PartnerDiscount(DiscountStrategy):\n    def calculate(self, order):\n        return order.total * 0.15',
                },
                {
                  type: 'note',
                  text: 'OCP работает через полиморфизм: вместо `if/elif` по типу — общий интерфейс и разные реализации. Классический вопрос на собеседовании: «как соблюсти OCP?» — ответ: «через абстракцию и полиморфизм». Это уже задел на паттерн Strategy (модуль 2).',
                },
              ],
            },
            {
              id: 'dp-l2-s3',
              title: 'Проверь себя: SRP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Класс одновременно: считает итог заказа, отправляет email клиенту и пишет лог в файл. Какие принципы нарушены?',
                options: [
                  { id: 'a', text: 'Только SRP' },
                  { id: 'b', text: 'SRP (три причины для изменения) и, вероятно, DIP (зависит от конкретных SMTP и файла)' },
                  { id: 'c', text: 'Только OCP' },
                  { id: 'd', text: 'Нарушений нет' },
                ],
                correct: ['b'],
                explanation:
                  'Нарушение SRP: класс меняется по трём причинам (бизнес-логика, email, логирование). Плюс вероятное нарушение DIP: класс напрямую зависит от конкретного SMTP-сервера и файловой системы — их не подменить и не замокать в тестах. Правильно: разделить на Order, EmailService, Logger и внедрять их как зависимости.',
              },
            },
            {
              id: 'dp-l2-s4',
              title: 'Проверь себя: OCP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что значит «код открыт для расширения, закрыт для изменения»?',
                options: [
                  { id: 'a', text: 'Код можно менять, но только в крайнем случае' },
                  { id: 'b', text: 'Новую функциональность добавляем через новые классы/модули, не правя существующие' },
                  { id: 'c', text: 'Код не должен меняться вообще' },
                  { id: 'd', text: 'Все классы должны быть final' },
                ],
                correct: ['b'],
                explanation:
                  'OCP — про то, что при добавлении новой фичи (например, нового типа скидки) мы создаём новый класс, а не редактируем старый if/elif. Достигается через полиморфизм: общий интерфейс + разные реализации. Классика — паттерны Strategy, Factory, Decorator.',
              },
            },
          ],
        },
        {
          id: 'dp-l3',
          title: 'LSP и ISP',
          minutes: 25,
          steps: [
            {
              id: 'dp-l3-s1',
              title: 'LSP: подстановка без сюрпризов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'LSP (Liskov Substitution Principle) — «объекты подкласса должны быть заменяемы объектами базового класса без нарушения работы программы». Если у вас есть функция, принимающая `Shape`, она должна корректно работать и с `Circle`, и с `Square`.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Классическое нарушение LSP',
                  code: 'class Bird:\n    def fly(self):\n        ...\n\nclass Penguin(Bird):\n    def fly(self):\n        raise NotImplementedError("Пингвины не летают")\n\n# Где-то в коде:\ndef migrate(birds):\n    for bird in birds:\n        bird.fly()  # упадёт на Penguin',
                },
                {
                  type: 'p',
                  text: 'Пингвин — птица, но не летает. Наследование `Penguin : Bird` нарушает LSP, потому что код, ожидающий «любую птицу», рассчитывает на `fly()`. Правильно: вынести `fly()` в отдельный интерфейс `FlyingBird` и наследовать только тех, кто летает.',
                },
                {
                  type: 'note',
                  text: 'LSP — главный аргумент против «наследования ради переиспользования». Если подкласс не может полноценно заменить родителя — не надо наследование. Часто композиция решает лучше: `Penguin` имеет `SwimBehavior`, а не «является летающей птицей».',
                },
              ],
            },
            {
              id: 'dp-l3-s2',
              title: 'ISP: не заставляй реализовывать лишнее',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'ISP (Interface Segregation Principle) — «клиенты не должны зависеть от интерфейсов, которые они не используют». Один большой интерфейс лучше разбить на несколько маленьких.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Нарушение ISP',
                  code: 'class Worker(ABC):\n    @abstractmethod\n    def work(self): ...\n    @abstractmethod\n    def eat(self): ...\n    @abstractmethod\n    def sleep(self): ...\n\nclass Robot(Worker):\n    def work(self):\n        ...\n    def eat(self):\n        raise NotImplementedError("Робот не ест")  # нарушение ISP\n    def sleep(self):\n        raise NotImplementedError("Робот не спит")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Соблюдение ISP',
                  code: 'class Workable(ABC):\n    @abstractmethod\n    def work(self): ...\n\nclass Eatable(ABC):\n    @abstractmethod\n    def eat(self): ...\n\nclass Robot(Workable):\n    def work(self):\n        ...\n\nclass Human(Workable, Eatable):\n    def work(self):\n        ...\n    def eat(self):\n        ...',
                },
                {
                  type: 'note',
                  text: 'ISP — это «не пихай в интерфейс всё, что может пригодиться». Если из 10 методов реализации 8 бросают `NotImplementedError` — это ISP-нарушение. На собеседовании: «чем ISP отличается от SRP?» — SRP про классы, ISP про интерфейсы. Часто идут рука об руку.',
                },
              ],
            },
            {
              id: 'dp-l3-s3',
              title: 'Проверь себя: LSP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём нарушение LSP в примере «Penguin наследует Bird, но fly() бросает ошибку»?',
                options: [
                  { id: 'a', text: 'Пингвин не должен быть птицей' },
                  { id: 'b', text: 'Код, работающий с Bird, ожидает fly(). Penguin не может заменить Bird без сюрпризов' },
                  { id: 'c', text: 'Наследование в Python всегда плохо' },
                  { id: 'd', text: 'NotImplementedError — не исключение' },
                ],
                correct: ['b'],
                explanation:
                  'LSP: подкласс должен вести себя как родитель. Функция `migrate(birds)` вызывает `bird.fly()` для всех. Если туда передать пингвина — программа упадёт. Значит, Penguin не может заменить Bird — наследование некорректно. Правильно: интерфейс FlyingBird отдельно от Bird.',
              },
            },
            {
              id: 'dp-l3-s4',
              title: 'Проверь себя: ISP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой признак нарушения ISP?',
                options: [
                  { id: 'a', text: 'Класс реализует много интерфейсов' },
                  { id: 'b', text: 'Класс вынужден реализовывать методы, которые ему не нужны (часто с NotImplementedError)' },
                  { id: 'c', text: 'В интерфейсе больше трёх методов' },
                  { id: 'd', text: 'Интерфейс наследует другой интерфейс' },
                ],
                correct: ['b'],
                explanation:
                  'ISP: клиент не должен зависеть от того, что не использует. Если класс реализует 10-методный интерфейс, а реально нужны 2 — 8 методов будут пустыми или с NotImplementedError. Это ISP-нарушение. Решение — разбить интерфейс на маленькие по назначению.',
              },
            },
          ],
        },
        {
          id: 'dp-l4',
          title: 'DIP: инверсия зависимостей',
          minutes: 25,
          steps: [
            {
              id: 'dp-l4-s1',
              title: 'Зависимость от абстракций, а не от деталей',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'DIP (Dependency Inversion Principle) — два правила: (1) модули верхнего уровня не должны зависеть от модулей нижнего уровня, оба должны зависеть от абстракций; (2) абстракции не должны зависеть от деталей, детали зависят от абстракций.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Нарушение DIP',
                  code: 'class OrderService:\n    def __init__(self):\n        self.db = PostgresDatabase()  # зависит от конкретного класса\n        self.email = SmtpEmailSender()  # зависит от конкретного класса\n\n    def place(self, order):\n        self.db.save(order)\n        self.email.send(order.user_email, "Order placed")',
                },
                {
                  type: 'p',
                  text: 'Проблема: тестировать `OrderService` без реальной БД и SMTP невозможно. Заменить Postgres на MySQL — правим OrderService. Использовать SendGrid вместо SMTP — правим OrderService.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Соблюдение DIP',
                  code: 'from abc import ABC, abstractmethod\n\nclass OrderRepository(ABC):\n    @abstractmethod\n    def save(self, order): ...\n\nclass EmailSender(ABC):\n    @abstractmethod\n    def send(self, to, subject, body): ...\n\nclass OrderService:\n    def __init__(self, repo: OrderRepository, email: EmailSender):\n        self.repo = repo    # зависит от абстракции\n        self.email = email  # зависит от абстракции\n\n    def place(self, order):\n        self.repo.save(order)\n        self.email.send(order.user_email, "Order placed")\n\n# В проде:\nservice = OrderService(PostgresOrderRepo(), SmtpEmailSender())\n\n# В тестах:\nservice = OrderService(InMemoryOrderRepo(), FakeEmailSender())',
                },
                {
                  type: 'note',
                  text: 'DIP — главный принцип, который делает код тестируемым. «Зависимости передаются снаружи» (dependency injection) — прямое следствие DIP. Если в классе есть `self.db = PostgresDatabase()` — это нарушение DIP: класс сам создаёт зависимость вместо того, чтобы принять её.',
                },
              ],
            },
            {
              id: 'dp-l4-s2',
              title: 'Проверь себя: DIP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой код следует DIP?',
                options: [
                  { id: 'a', text: 'class Service: def __init__(self): self.db = PostgresDB()' },
                  { id: 'b', text: 'class Service: def __init__(self, db: DatabaseInterface): self.db = db' },
                  { id: 'c', text: 'class Service: db = PostgresDB()' },
                  { id: 'd', text: 'class Service: def __init__(self, db): self.db = db' },
                ],
                correct: ['b'],
                explanation:
                  'DIP: зависимость от абстракции (DatabaseInterface), а не от конкретного класса. Вариант D — «утиная типизация», тоже неплохо в Python, но без явного интерфейса DIP не гарантирован. Варианты A и C — прямая зависимость от конкретной БД, ни тестов, ни замены. Вариант B — эталон DIP: получаем абстракцию, передаём снаружи.',
              },
            },
            {
              id: 'dp-l4-s3',
              title: 'Проверь себя: SOLID вместе',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте принцип SOLID и его суть',
                pairs: [
                  { left: 'SRP', right: 'Одна причина для изменения у класса' },
                  { left: 'OCP', right: 'Открыт для расширения, закрыт для изменения' },
                  { left: 'LSP', right: 'Подкласс заменяет родителя без сюрпризов' },
                  { left: 'ISP', right: 'Много маленьких интерфейсов вместо одного большого' },
                  { left: 'DIP', right: 'Зависимость от абстракций, а не от деталей' },
                ],
                explanation:
                  'SRP — одна причина для изменения. OCP — расширяй, не меняй. LSP — подстановка. ISP — маленькие интерфейсы. DIP — зависимость от абстракций. На собеседовании junior/middle спрашивают если не все пять, то 2–3 точно.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m2',
      title: 'Паттерны GoF',
      lessons: [
        {
          id: 'dp-l5',
          title: 'Порождающие: Singleton, Factory, Builder',
          minutes: 30,
          steps: [
            {
              id: 'dp-l5-s1',
              title: 'Три порождающих паттерна',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Порождающие паттерны отвечают за создание объектов. Их три главных: Singleton (единственный экземпляр), Factory (создание через фабрику вместо `new`), Builder (пошаговое построение сложного объекта).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Singleton: единственный экземпляр',
                  code: 'class Config:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n            cls._instance._load()\n        return cls._instance\n\n    def _load(self):\n        self.data = {"db_url": "postgres://..."}\n\na = Config()\nb = Config()\nassert a is b  # True — один и тот же объект',
                },
                {
                  type: 'p',
                  text: 'Singleton оправдан для конфига, логгера, connection pool — то, что должно быть одно на процесс. Но в 80% случаев — антипаттерн: глобальное состояние, скрытые зависимости, проблемы с тестами. В Python чаще используют модуль как singleton (переменная на уровне модуля), а не класс.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Factory: создание через фабрику',
                  code: 'class Notification(ABC):\n    @abstractmethod\n    def send(self, to, msg): ...\n\nclass EmailNotification(Notification):\n    def send(self, to, msg): print(f"Email to {to}: {msg}")\n\nclass SmsNotification(Notification):\n    def send(self, to, msg): print(f"SMS to {to}: {msg}")\n\nclass PushNotification(Notification):\n    def send(self, to, msg): print(f"Push to {to}: {msg}")\n\ndef create_notification(channel: str) -> Notification:\n    if channel == "email":\n        return EmailNotification()\n    if channel == "sms":\n        return SmsNotification()\n    if channel == "push":\n        return PushNotification()\n    raise ValueError(f"Unknown channel: {channel}")\n\n# Клиент не знает про классы — только про интерфейс\nnotifier = create_notification("email")\nnotifier.send("user@x.com", "Hello")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Builder: пошаговое построение',
                  code: 'class QueryBuilder:\n    def __init__(self):\n        self._table = None\n        self._where = []\n        self._order = None\n        self._limit = None\n\n    def table(self, name):\n        self._table = name\n        return self\n\n    def where(self, cond):\n        self._where.append(cond)\n        return self\n\n    def order_by(self, col, dir="ASC"):\n        self._order = f"{col} {dir}"\n        return self\n\n    def limit(self, n):\n        self._limit = n\n        return self\n\n    def build(self) -> str:\n        parts = [f"SELECT * FROM {self._table}"]\n        if self._where:\n            parts.append("WHERE " + " AND ".join(self._where))\n        if self._order:\n            parts.append(f"ORDER BY {self._order}")\n        if self._limit:\n            parts.append(f"LIMIT {self._limit}")\n        return " ".join(parts)\n\nquery = (\n    QueryBuilder()\n    .table("users")\n    .where("age > 18")\n    .where("active = true")\n    .order_by("created_at", "DESC")\n    .limit(10)\n    .build()\n)\n# SELECT * FROM users WHERE age > 18 AND active = true ORDER BY created_at DESC LIMIT 10',
                },
                {
                  type: 'note',
                  text: 'Когда что: Singleton — редко (лучше модуль). Factory — когда есть выбор из нескольких классов по параметру. Builder — когда объект сложный и создаётся пошагово (SQL-конструкторы, HTTP-клиенты, тестовые данные).',
                },
              ],
            },
            {
              id: 'dp-l5-s2',
              title: 'Проверь себя: Singleton',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему Singleton часто считают антипаттерном?',
                options: [
                  { id: 'a', text: 'Он медленный' },
                  { id: 'b', text: 'Он создаёт глобальное состояние и скрытые зависимости — сложно тестировать' },
                  { id: 'c', text: 'Его нельзя реализовать в Python' },
                  { id: 'd', text: 'Он не поддерживается стандартом' },
                ],
                correct: ['b'],
                explanation:
                  'Singleton — это по сути глобальная переменная. Любой код может обратиться к нему, зависимости скрыты, тесты текут между собой (общий экземпляр меняется в одном тесте — ломает другой). Оправдан для логгера, конфига, connection pool. Во всех остальных случаях — обычный класс с dependency injection лучше.',
              },
            },
            {
              id: 'dp-l5-s3',
              title: 'Проверь себя: паттерны',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте паттерн и его назначение',
                pairs: [
                  { left: 'Singleton', right: 'Единственный экземпляр на процесс' },
                  { left: 'Factory', right: 'Создание объекта по параметру через общий интерфейс' },
                  { left: 'Builder', right: 'Пошаговое построение сложного объекта' },
                  { left: 'Strategy', right: 'Взаимозаменяемые алгоритмы' },
                ],
                explanation:
                  'Singleton — один экземпляр. Factory — выбор класса по параметру. Builder — цепочка шагов. Strategy — подмена алгоритма в рантайме (из модуля 2, поведенческий). Все четыре — «рабочие лошадки», которые встречаются в реальных проектах чаще всего.',
              },
            },
          ],
        },
        {
          id: 'dp-l6',
          title: 'Структурные: Adapter, Decorator, Facade',
          minutes: 30,
          steps: [
            {
              id: 'dp-l6-s1',
              title: 'Три структурных паттерна',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Структурные паттерны — про то, как классы и объекты соединяются. Три главных: Adapter (обернуть несовместимый интерфейс), Decorator (добавить поведение без наследования), Facade (упростить сложную систему).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Adapter: обёртка над несовместимым API',
                  code: 'class LegacyPaymentSystem:\n    def make_payment(self, amount_cents, currency_code):\n        # старый API: суммы в центах, валюта числом\n        ...\n\nclass PaymentProcessor(ABC):\n    @abstractmethod\n    def pay(self, amount: float, currency: str): ...\n\nclass LegacyPaymentAdapter(PaymentProcessor):\n    def __init__(self, legacy: LegacyPaymentSystem):\n        self.legacy = legacy\n\n    def pay(self, amount: float, currency: str):\n        cents = int(amount * 100)\n        code = {"USD": 840, "EUR": 978, "RUB": 643}[currency]\n        return self.legacy.make_payment(cents, code)\n\n# Клиент работает с PaymentProcessor, не зная про LegacyPaymentSystem\nprocessor: PaymentProcessor = LegacyPaymentAdapter(LegacyPaymentSystem())\nprocessor.pay(99.99, "USD")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Decorator: добавление поведения без наследования',
                  code: 'class Notifier(ABC):\n    @abstractmethod\n    def send(self, msg): ...\n\nclass EmailNotifier(Notifier):\n    def send(self, msg): print(f"Email: {msg}")\n\nclass LoggingNotifier(Notifier):\n    def __init__(self, wrapped: Notifier):\n        self.wrapped = wrapped\n    def send(self, msg):\n        print(f"[LOG] sending: {msg}")\n        self.wrapped.send(msg)\n\nclass RetryNotifier(Notifier):\n    def __init__(self, wrapped: Notifier, attempts=3):\n        self.wrapped = wrapped\n        self.attempts = attempts\n    def send(self, msg):\n        for i in range(self.attempts):\n            try:\n                return self.wrapped.send(msg)\n            except Exception:\n                if i == self.attempts - 1:\n                    raise\n\n# Композиция декораторов\nnotifier = LoggingNotifier(RetryNotifier(EmailNotifier()))\nnotifier.send("Hello")',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Facade: единая точка входа',
                  code: 'class OrderFacade:\n    """Упрощает работу с 5 сервисами до одного метода"""\n\n    def __init__(self, inventory, payment, shipping, email, logger):\n        self.inventory = inventory\n        self.payment = payment\n        self.shipping = shipping\n        self.email = email\n        self.logger = logger\n\n    def place_order(self, user, cart, payment_info):\n        self.inventory.reserve(cart)\n        self.payment.charge(payment_info, cart.total)\n        shipment = self.shipping.create(cart, user.address)\n        self.email.send_confirmation(user.email, shipment)\n        self.logger.info(f"Order placed: {shipment.id}")\n        return shipment\n\n# Клиент делает одну операцию вместо пяти\nfacade.place_order(user, cart, payment_info)',
                },
                {
                  type: 'note',
                  text: 'Adapter — про несовместимые интерфейсы (старый API, чужая библиотека). Decorator — про добавление поведения (логирование, retry, кэш) без взрыва иерархии. Facade — про упрощение (сложная подсистема → один метод). Не путать Adapter и Facade: Adapter «переводит» интерфейс, Facade «скрывает» сложность.',
                },
              ],
            },
            {
              id: 'dp-l6-s2',
              title: 'Проверь себя: Adapter vs Facade',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Adapter отличается от Facade?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Adapter «переводит» несовместимый интерфейс, Facade «упрощает» сложную систему' },
                  { id: 'c', text: 'Adapter быстрее' },
                  { id: 'd', text: 'Facade работает только с БД' },
                ],
                correct: ['b'],
                explanation:
                  'Adapter оборачивает несовместимый интерфейс и приводит его к нужному (старый API → новый интерфейс). Facade прячет сложность подсистемы за одним простым методом. Adapter — «переводчик», Facade — «швейцар». Оба оборачивают, но цель разная.',
              },
            },
            {
              id: 'dp-l6-s3',
              title: 'Проверь себя: Decorator',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что даёт паттерн Decorator по сравнению с наследованием?',
                options: [
                  { id: 'a', text: 'Работает быстрее' },
                  { id: 'b', text: 'Позволяет комбинировать поведение в рантайме, не создавая N подклассов' },
                  { id: 'c', text: 'Заменяет интерфейсы' },
                  { id: 'd', text: 'Убирает необходимость в тестах' },
                ],
                correct: ['b'],
                explanation:
                  'Наследование: LoggingEmail, RetryEmail, LoggingRetryEmail, RetryLoggingEmail — 2^N комбинаций. Decorator: LoggingNotifier(RetryNotifier(EmailNotifier())) — собирается в рантайме как конструктор. Добавить кэш — ещё один декоратор, без новых классов-комбинаций.',
              },
            },
          ],
        },
        {
          id: 'dp-l7',
          title: 'Поведенческие: Strategy, Observer, Command',
          minutes: 30,
          steps: [
            {
              id: 'dp-l7-s1',
              title: 'Три поведенческих паттерна',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Поведенческие паттерны — про взаимодействие объектов и распределение обязанностей. Три главных: Strategy (взаимозаменяемые алгоритмы), Observer (подписка на события), Command (инкапсуляция действия).',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Strategy: подмена алгоритма',
                  code: 'class SortStrategy(ABC):\n    @abstractmethod\n    def sort(self, items): ...\n\nclass QuickSort(SortStrategy):\n    def sort(self, items): return sorted(items)  # упрощено\n\nclass MergeSort(SortStrategy):\n    def sort(self, items): return sorted(items)\n\nclass Sorter:\n    def __init__(self, strategy: SortStrategy):\n        self.strategy = strategy\n    def sort(self, items):\n        return self.strategy.sort(items)\n    def set_strategy(self, strategy: SortStrategy):\n        self.strategy = strategy\n\nsorter = Sorter(QuickSort())\nsorter.sort([3, 1, 2])\nsorter.set_strategy(MergeSort())  # поменяли в рантайме',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Observer: подписка на события',
                  code: 'class EventEmitter:\n    def __init__(self):\n        self._listeners = {}\n\n    def on(self, event, callback):\n        self._listeners.setdefault(event, []).append(callback)\n\n    def emit(self, event, *args):\n        for cb in self._listeners.get(event, []):\n            cb(*args)\n\nemitter = EventEmitter()\nemitter.on("order_placed", lambda o: print(f"Email: {o}"))\nemitter.on("order_placed", lambda o: print(f"SMS: {o}"))\nemitter.on("order_placed", lambda o: print(f"Log: {o}"))\n\nemitter.emit("order_placed", "Order#42")\n# Email: Order#42\n# SMS: Order#42\n# Log: Order#42',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Command: инкапсуляция действия',
                  code: 'class Command(ABC):\n    @abstractmethod\n    def execute(self): ...\n    @abstractmethod\n    def undo(self): ...\n\nclass CreateUserCommand(Command):\n    def __init__(self, repo, user_data):\n        self.repo = repo\n        self.user_data = user_data\n        self.created_id = None\n    def execute(self):\n        self.created_id = self.repo.create(self.user_data)\n    def undo(self):\n        if self.created_id:\n            self.repo.delete(self.created_id)\n\n# Инкапсулирует действие в объект\n# → можно логировать, откладывать, откатывать, объединять в очередь\ncommand = CreateUserCommand(repo, {"email": "a@x.com"})\ncommand.execute()\ncommand.undo()  # откат',
                },
                {
                  type: 'note',
                  text: 'Strategy — «как делать» (взаимозаменяемые алгоритмы). Observer — «кто узнает» (подписка). Command — «что сделать» (инкапсулированное действие). Strategy часто путают с State — Strategy выбирается снаружи, State переключается сам. Strategy — самый используемый паттерн из трёх.',
                },
              ],
            },
            {
              id: 'dp-l7-s2',
              title: 'Проверь себя: Strategy',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём ключевое отличие Strategy от State?',
                options: [
                  { id: 'a', text: 'Никакого, это одно и то же' },
                  { id: 'b', text: 'Strategy выбирается клиентом снаружи, State переключается автоматически внутри' },
                  { id: 'c', text: 'Strategy быстрее' },
                  { id: 'd', text: 'State работает только с играми' },
                ],
                correct: ['b'],
                explanation:
                  'Strategy: клиент явно выбирает алгоритм (set_strategy(QuickSort())). State: объект сам меняет поведение при смене состояния (например, заказ new → paid → shipped). Структурно похожи, но семантика разная. На собеседовании могут спросить «чем отличается» — это частый каверзный вопрос.',
              },
            },
            {
              id: 'dp-l7-s3',
              title: 'Проверь себя: Observer',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где Observer используется в реальных проектах?',
                options: [
                  { id: 'a', text: 'Только в играх' },
                  { id: 'b', text: 'События в UI (click), event bus, reactive-фреймворки (Vue, React), pub/sub' },
                  { id: 'c', text: 'Только для логирования' },
                  { id: 'd', text: 'Только в базах данных' },
                ],
                correct: ['b'],
                explanation:
                  'Observer — один из самых распространённых паттернов. Event bus, подписки на изменения в UI, reactive-фреймворки (Vue, MobX), pub/sub в брокерах (Kafka, RabbitMQ — это на уровне архитектуры), даже `addEventListener` в браузере — это Observer. Классика, которую нужно знать.',
              },
            },
          ],
        },
        {
          id: 'dp-l8',
          title: 'Repository и Unit of Work',
          minutes: 25,
          steps: [
            {
              id: 'dp-l8-s1',
              title: 'Repository: слой доступа к данным',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Repository — паттерн, который прячет работу с БД за интерфейсом, похожим на коллекцию. Вместо `db.execute("SELECT...")` — `repo.find_by_email("x@y.com")`. Бизнес-логика не знает про SQL, ORM, индексы.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Repository на Python',
                  code: 'class UserRepository(ABC):\n    @abstractmethod\n    def find_by_id(self, user_id: int) -> User | None: ...\n    @abstractmethod\n    def find_by_email(self, email: str) -> User | None: ...\n    @abstractmethod\n    def save(self, user: User) -> User: ...\n    @abstractmethod\n    def delete(self, user_id: int) -> None: ...\n\nclass PostgresUserRepository(UserRepository):\n    def __init__(self, connection):\n        self.conn = connection\n\n    def find_by_id(self, user_id):\n        row = self.conn.execute(\n            "SELECT * FROM users WHERE id = %s", (user_id,)\n        ).fetchone()\n        return User(**row) if row else None\n\n    def save(self, user):\n        if user.id is None:\n            self.conn.execute("INSERT INTO users ...")\n        else:\n            self.conn.execute("UPDATE users SET ...")\n        return user\n\n# В тестах:\nclass InMemoryUserRepository(UserRepository):\n    def __init__(self):\n        self._users = {}\n    def find_by_id(self, uid): return self._users.get(uid)\n    def save(self, user):\n        user.id = user.id or len(self._users) + 1\n        self._users[user.id] = user\n        return user',
                },
                {
                  type: 'list',
                  items: [
                    'Бизнес-логика не знает про БД: только интерфейс',
                    'В тестах — in-memory репозиторий: быстро, без БД',
                    'Легко заменить Postgres на Mongo или файл',
                    'Одна ответственность: репозиторий знает только свой агрегат',
                    'НЕ пытайтесь «универсализировать» репозиторий под все таблицы — это кончится плохо',
                  ],
                },
                {
                  type: 'note',
                  text: 'Repository — это не «обёртка над ORM». Это абстракция уровня домена. В больших проектах Repository возвращает доменные объекты, не модели ORM. В маленьких — можно и модели. Главное — бизнес-логика не знает про SQL и конкретную БД.',
                },
              ],
            },
            {
              id: 'dp-l8-s2',
              title: 'Unit of Work: транзакция на несколько репозиториев',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Unit of Work — паттерн, который отслеживает изменения нескольких репозиториев и коммитит их одной транзакцией. «Сохранить заказ И позиции И обновить склад — атомарно». Без него — пять отдельных `commit()`, и если третий упадёт, данные рассогласованы.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Unit of Work',
                  code: 'class UnitOfWork:\n    def __init__(self, session_factory):\n        self.session_factory = session_factory\n        self.users = None\n        self.orders = None\n        self.products = None\n        self._session = None\n\n    def __enter__(self):\n        self._session = self.session_factory()\n        self.users = UserRepository(self._session)\n        self.orders = OrderRepository(self._session)\n        self.products = ProductRepository(self._session)\n        return self\n\n    def __exit__(self, exc_type, exc, tb):\n        if exc_type is None:\n            self._session.commit()\n        else:\n            self._session.rollback()\n        self._session.close()\n\n# Использование\nwith UnitOfWork(session_factory) as uow:\n    order = uow.orders.create(user_id, items)\n    uow.products.decrement_stock(items)\n    uow.users.add_points(user_id, order.total // 10)\n    # либо всё применилось, либо ничего',
                },
                {
                  type: 'note',
                  text: 'Unit of Work — стандарт в enterprise (особенно в .NET: Entity Framework, в Java: Spring @Transactional). В Python: SQLAlchemy Session — это по сути Unit of Work. Паттерн важен, когда операция затрагивает несколько таблиц и должна быть атомарной. Без него — рассинхронизация данных.',
                },
              ],
            },
            {
              id: 'dp-l8-s3',
              title: 'Проверь себя: Repository',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен Repository, если есть ORM?',
                options: [
                  { id: 'a', text: 'Repository быстрее ORM' },
                  { id: 'b', text: 'Изолирует бизнес-логику от деталей БД; в тестах — in-memory реализация' },
                  { id: 'c', text: 'ORM не работает в Python' },
                  { id: 'd', text: 'Это требование SOLID' },
                ],
                correct: ['b'],
                explanation:
                  'Repository — это DIP в действии: бизнес-логика зависит от абстракции, а не от SQLAlchemy-модели. В тестах подменяем PostgresUserRepository на InMemoryUserRepository — быстро, без БД. И замену СУБД можно сделать в одном месте. ORM при этом никто не отменяет — Repository использует ORM внутри.',
              },
            },
          ],
        },
        {
          id: 'dp-l9',
          title: 'Когда НЕ использовать паттерны',
          minutes: 20,
          steps: [
            {
              id: 'dp-l9-s1',
              title: 'Over-engineering — главный враг',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Паттерны — инструмент, а не цель. «Давайте сделаем абстрактную фабрику фабрик» — типичный over-engineering, который делает код хуже, а не лучше. Признаки:',
                },
                {
                  type: 'list',
                  items: [
                    'Интерфейс с одной реализацией «на будущее» — скорее всего, не нужно',
                    'Абстракция без второго примера — преждевременная',
                    'Фабрика для создания одного объекта — просто конструктор',
                    '5 уровней наследования ради «гибкости» — скорее всего, сломается',
                    'Strategy, которая никогда не переключается — не Strategy',
                  ],
                },
                {
                  type: 'note',
                  text: 'Правило: «не применяй паттерн, пока не увидел проблему дважды». Первый раз — просто код. Второй раз — рефакторинг в паттерн. Так вы избежите «соборной архитектуры», где 10 классов делают то, что делал один метод.',
                },
              ],
            },
            {
              id: 'dp-l9-s2',
              title: 'YAGNI и KISS',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'YAGNI (You Aren\'t Gonna Need It) — «не делай то, что, может быть, понадобится». KISS (Keep It Simple, Stupid) — «делай просто». Вместе они спасают от 90% over-engineering.',
                },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Пример'
                  ,
                  code: '# Плохо: абстрактная фабрика для одного типа уведомлений\nclass NotificationFactory(ABC):\n    @abstractmethod\n    def create(self) -> Notification: ...\n\nclass EmailNotificationFactory(NotificationFactory):\n    def create(self) -> Notification:\n        return EmailNotification()\n\n# Хорошо: пока нужен только email — просто класс\ndef send_email(to, msg):\n    ...\n\n# Когда появятся SMS и push — заменить на Factory (рефакторинг)\n# Не раньше.',
                },
                {
                  type: 'note',
                  text: 'Здесь есть тонкость: «YAGNI» не значит «пиши плохо». Если очевидно, что через месяц будет второй тип уведомлений — Factory оправдана. Но «через год, может быть» — не аргумент. Внедряйте паттерны, когда они решают текущую боль, а не воображаемую.',
                },
              ],
            },
            {
              id: 'dp-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое over-engineering?',
                options: [
                  { id: 'a', text: 'Плохо написанный код' },
                  { id: 'b', text: 'Слишком сложная архитектура для текущей задачи (абстракции «на будущее», фабрики фабрик)' },
                  { id: 'c', text: 'Отсутствие тестов' },
                  { id: 'd', text: 'Использование ООП' },
                ],
                correct: ['b'],
                explanation:
                  'Over-engineering — это когда сложность решения превышает сложность задачи. Абстрактная фабрика для одного класса. 5 уровней наследования для 2 классов. Паттерн «на будущее». YAGNI и KISS — противоядие. Правило: применяй паттерн, когда боль реальна, а не гипотетична.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dp-m3',
      title: 'Архитектура',
      lessons: [
        {
          id: 'dp-l10',
          title: 'Монолит vs микросервисы',
          minutes: 30,
          steps: [
            {
              id: 'dp-l10-s1',
              title: 'Три архитектуры',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Архитектура', 'Плюсы', 'Минусы'],
                  rows: [
                    ['Монолит', 'Простота, один деплой, ACID транзакции', 'Сложно масштабировать команду, единая точка отказа'],
                    ['Модульный монолит', 'Изоляция модулей, один деплой, ACID', 'Границы модулей надо держать руками'],
                    ['Микросервисы', 'Независимые деплои, масштабирование, команды', 'Сложность: сеть, eventual consistency, observability'],
                  ],
                },
                {
                  type: 'p',
                  text: 'Классическая рекомендация 2024–2025: начинать с модульного монолита. Один деплой, но внутри — чёткие модули с интерфейсами. Когда модуль вырастет или станет «болит» — вынести в отдельный сервис. Большинство успешных «микросервисных» систем выросли из монолита, а не родились микросервисами.',
                },
                {
                  type: 'note',
                  text: 'Amazon, Netflix, Google — микросервисы. Но: Amazon начинал с монолита 1994 года. Netflix — с монолита 1997. Shopify, Stack Overflow — большие монолиты и живут отлично. «Микросервисы» — не синоним «хорошо». Это компромисс между сложностью эксплуатации и гибкостью команд.',
                },
              ],
            },
            {
              id: 'dp-l10-s2',
              title: 'Когда что выбирать',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'MVP, стартап, маленькая команда — монолит',
                    'Средний проект, несколько команд — модульный монолит',
                    'Большая система, много команд, разные требования к масштабированию — микросервисы',
                    'Регуляторные требования (PCI DSS, HIPAA) — изоляция критичных сервисов',
                    'Разные языки/технологии для разных задач — микросервисы (или модули на разных ЯП)',
                    'Нет DevOps-культуры и observability — не начинайте с микросервисов',
                  ],
                },
                {
                  type: 'note',
                  text: 'Микросервисы требуют: CI/CD, мониторинг, распределённый трейсинг, service mesh, готовность к eventual consistency, зрелые команды. Если всего этого нет — микросервисы превратятся в «распределённый монолит»: хуже, чем монолит, потому что сеть, таймауты, дублирование данных.',
                },
              ],
            },
            {
              id: 'dp-l10-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое «модульный монолит»?',
                options: [
                  { id: 'a', text: 'Монолит с микросервисами внутри' },
                  { id: 'b', text: 'Один деплой, но внутри — изолированные модули с чёткими интерфейсами' },
                  { id: 'c', text: 'Микросервис, который выглядит как монолит' },
                  { id: 'd', text: 'То же самое, что обычный монолит' },
                ],
                correct: ['b'],
                explanation:
                  'Модульный монолит — один процесс и деплой, но код разделён на модули с явными границами (интерфейсы, отдельные пакеты). Плюсы: ACID-транзакции, простой деплой, но при этом код можно позже вынести в сервисы. Рекомендация 2024–2025 — начинать именно с него.',
              },
            },
          ],
        },
        {
          id: 'dp-l11',
          title: 'Event-driven и очереди',
          minutes: 25,
          steps: [
            {
              id: 'dp-l11-s1',
              title: 'Асинхронность через события',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Event-driven архитектура: сервисы общаются не напрямую, а через события в брокере (Kafka, RabbitMQ, NATS, SQS). «Заказ создан» — событие, которое слушают сервисы доставки, биллинга, аналитики.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Синхронно vs асинхронно',
                  code: 'Синхронно (request/response):\n  OrderService → PaymentService (запрос)\n              → InventoryService (запрос)\n              → EmailService (запрос)\n              → AnalyticsService (запрос)\n  Время ответа = сумма всех, падение любого → падение заказа\n\nАсинхронно (event-driven):\n  OrderService → event "order.created" → Broker\n                                         ├→ PaymentService\n                                         ├→ InventoryService\n                                         ├→ EmailService\n                                         └→ AnalyticsService\n  OrderService отвечает мгновенно, сервисы подписаны\n  Каждый может упасть — событие останется в очереди',
                },
                {
                  type: 'list',
                  items: [
                    'Producer — публикует события, не знает про подписчиков',
                    'Consumer — подписан, обрабатывает независимо',
                    'Broker (Kafka, RabbitMQ) — хранит события, доставляет',
                    'Плюсы: развязка (decoupling), отказоустойчивость, буферизация',
                    'Минусы: eventual consistency, сложнее отладка, дубликаты',
                  ],
                },
              ],
            },
            {
              id: 'dp-l11-s2',
              title: 'Гарантии и идемпотентность',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Гарантии доставки',
                  head: ['Гарантия', 'Что значит', 'Когда'],
                  rows: [
                    ['At-most-once', 'Может потеряться, не дублируется', 'Логи, метрики — потери допустимы'],
                    ['At-least-once', 'Не теряется, может дублироваться', 'Заказы, оплата — стандарт (важнее не потерять)'],
                    ['Exactly-once', 'Ни потерь, ни дублей', 'Дорого, реализуется через Kafka transactions или дедупликацию'],
                  ],
                },
                {
                  type: 'p',
                  text: 'At-least-once — практический стандарт. Потерять заказ нельзя, а дубликат можно обработать. Значит, consumer должен быть идемпотентным: повторная обработка того же события не должна создавать второй заказ. Реализуется через idempotency key (UUID события), unique constraint в БД или таблицу «обработанные события».',
                },
                {
                  type: 'note',
                  text: 'Eventual consistency — «согласованность в конечном счёте». Заказ создан, но email ещё не отправлен — это нормально для event-driven. Через секунду-минуту отправится. В отличие от ACID-транзакций, где всё согласовано сразу. На собеседовании: «в чём разница ACID vs BASE?» — ACID (монолит) vs BASE (event-driven).',
                },
              ],
            },
            {
              id: 'dp-l11-s3',
              title: 'Проверь себя: event-driven',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем consumer-у быть идемпотентным при at-least-once?',
                options: [
                  { id: 'a', text: 'Чтобы работать быстрее' },
                  { id: 'b', text: 'Одно событие может прийти дважды — повторная обработка не должна создавать дубликат' },
                  { id: 'c', text: 'Это требование Kafka' },
                  { id: 'd', text: 'Для безопасности' },
                ],
                correct: ['b'],
                explanation:
                  'При at-least-once гарантии событие может быть доставлено дважды (при сбое после обработки, до подтверждения). Если consumer не идемпотентен — два заказа, двойное списание. Идемпотентность: обработка того же события второй раз даёт тот же результат (уникальный idempotency key, upsert, unique constraint).',
              },
            },
          ],
        },
        {
          id: 'dp-l12',
          title: 'CQRS, DDD и что выбрать',
          minutes: 25,
          steps: [
            {
              id: 'dp-l12-s1',
              title: 'CQRS: разделение чтения и записи',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'CQRS (Command Query Responsibility Segregation) — разделение модели записи (Command) и модели чтения (Query). Запись идёт в одну модель (нормализованную), чтение — из другой (денормализованной, оптимизированной под запросы).',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'CQRS',
                  code: 'Без CQRS:\n  Одна БД, одна модель\n  Read и Write — одни и те же таблицы, JOIN-ы для отчётов\n  Тяжёлые аналитические запросы тормозят запись\n\nCQRS:\n  Write DB (Postgres, нормализованная)\n      ↓ события\n  Read DB (ClickHouse, Elasticsearch, денормализованная)\n  Запросы на чтение — быстрые, не мешают записи\n  Запись — ACID, транзакционная',
                },
                {
                  type: 'list',
                  items: [
                    'Command — изменить состояние (INSERT, UPDATE, DELETE)',
                    'Query — прочитать (SELECT), не меняет',
                    'Разделение позволяет масштабировать чтение и запись независимо',
                    'Event Sourcing — крайний случай CQRS: хранить не состояние, а все события',
                    'Event Sourcing: «+100₽, -50₽» вместо «баланс 50₽». Можно перемотать историю',
                  ],
                },
                {
                  type: 'note',
                  text: 'CQRS — не «обязательно для всех». Оправдано, когда: чтение и запись имеют радикально разные нагрузки (аналитика в проде), разные модели данных (граф для рекомендаций vs таблица для заказов), аудит-требования (Event Sourcing). В 90% проектов — обычная БД работает отлично.',
                },
              ],
            },
            {
              id: 'dp-l12-s2',
              title: 'DDD: кратко',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'DDD (Domain-Driven Design) — подход к проектированию, где код отражает бизнес-домен. Ключевые понятия: Ubiquitous Language (единый язык с бизнесом), Bounded Context (границы модели), Aggregates (группы связанных объектов), Domain Events.',
                },
                {
                  type: 'list',
                  items: [
                    'Ubiquitous Language — «Заказ», «Клиент», «Корзина» — одни и те же слова в коде и в разговоре с бизнесом',
                    'Bounded Context — в «Продажах» и «Доставке» — разные модели «Заказа» (в своих контекстах)',
                    'Aggregate — группа объектов, которая меняется как единое целое (Order + OrderItems)',
                    'Domain Event — «OrderPlaced», «PaymentReceived» — факт, который произошёл в домене',
                    'Repository, Unit of Work — техническая реализация DDD (из модуля 2)',
                  ],
                },
                {
                  type: 'note',
                  text: 'DDD — тяжёлый инструмент. Оправдан в сложных доменах: банки, страхование, логистика, медицина. Для CRUD-приложения «список задач» DDD — over-engineering. Признак: если бизнес-логика — это в основном «валидация полей», DDD не нужен.',
                },
              ],
            },
            {
              id: 'dp-l12-s3',
              title: 'Проверь себя: CQRS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое CQRS?',
                options: [
                  { id: 'a', text: 'База данных с репликацией' },
                  { id: 'b', text: 'Разделение модели чтения (Query) и записи (Command) на разные модели данных' },
                  { id: 'c', text: 'Кэширование запросов' },
                  { id: 'd', text: 'Обязательный паттерн для микросервисов' },
                ],
                correct: ['b'],
                explanation:
                  'CQRS: Command (запись) и Query (чтение) — разные модели. Запись в нормализованную БД (ACID), чтение из денормализованной (быстро). Не обязателен, не «для всех», но оправдан, когда нагрузка на чтение и запись сильно разная или аналитика мешает транзакциям. Event Sourcing — крайний случай CQRS.',
              },
            },
            {
              id: 'dp-l12-s4',
              title: 'Проверь себя: архитектуры',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте архитектуру и её суть',
                pairs: [
                  { left: 'Монолит', right: 'Один процесс, один деплой, ACID' },
                  { left: 'Микросервисы', right: 'Много сервисов, независимые деплои' },
                  { left: 'Event-driven', right: 'Асинхронные события в брокере' },
                  { left: 'CQRS', right: 'Разделение чтения и записи' },
                ],
                explanation:
                  'Монолит — ACID, простота. Микросервисы — независимость, сложность. Event-driven — decoupling, eventual consistency. CQRS — разделение read/write моделей. Начинать с модульного монолита; усложнять, когда есть реальная боль. Не по хайпу.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'dp-m4',
      title: 'Практикум',
      lessons: [
        {
          id: 'dp-l13',
          title: 'Практика: SOLID, паттерны, архитектура',
          minutes: 35,
          steps: [
            {
              id: 'dp-l13-s1',
              title: 'Принцип SRP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что означает принцип Single Responsibility (SRP)?',
                options: [
                  { id: 'a', text: 'У класса должен быть один метод' },
                  { id: 'b', text: 'У класса должна быть одна причина для изменения' },
                  { id: 'c', text: 'Класс должен делать всё сам' },
                  { id: 'd', text: 'Класс должен наследовать один родитель' },
                ],
                correct: ['b'],
                explanation: 'SRP — «одна причина для изменения». Класс может делать много всего, если это меняется по одной причине (например, правила расчёта).',
              },
            },
            {
              id: 'dp-l13-s2',
              title: 'Порядок SOLID',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте принципы SOLID в правильном порядке',
                items: ['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
                correct: ['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
                explanation: 'S.O.L.I.D. — именно в таком порядке.',
              },
            },
            {
              id: 'dp-l13-s3',
              title: 'Принцип OCP',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Продолжите принцип OCP: «Программные сущности должны быть открыты для ____, но закрыты для изменения».',
                accepted: ['расширения', 'extension', 'расширения (extension)'],
                placeholder: 'одно слово',
                hint: 'Добавление нового без правки старого',
                explanation: 'Открыты для расширения (extension), закрыты для изменения (modification). Новый тип скидки — новый класс, а не правка if/else.',
              },
            },
            {
              id: 'dp-l13-s4',
              title: 'Dependency Inversion',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните код, чтобы соблюсти DIP (внедрение зависимости):',
                text: 'class OrderService:\n    def __init__(self, repo: OrderRepository):\n        self.repo = ____',
                blanks: [
                  { accepted: ['repo'], hint: 'переданная зависимость' },
                ],
                explanation: 'Зависимость передаётся через конструктор (repo) и сохраняется в self.repo. Класс не создаёт БД сам.',
              },
            },
            {
              id: 'dp-l13-s5',
              title: 'Типы паттернов',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте паттерн и его категорию',
                pairs: [
                  { left: 'Singleton', right: 'Порождающий' },
                  { left: 'Adapter', right: 'Структурный' },
                  { left: 'Strategy и Observer', right: 'Поведенческий' },
                ],
                explanation: 'Порождающие — про создание (Singleton, Factory, Builder). Структурные — про связи (Adapter, Decorator, Facade). Поведенческие — про взаимодействие (Strategy, Observer, Command).',
              },
            },
            {
              id: 'dp-l13-s6',
              title: 'Комбинации декораторов',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько классов-комбинаций понадобится при наследовании, если есть 3 независимых поведения (логирование, кэш, retry), и мы хотим все возможные комбинации? (2^3)',
                correct: 8,
                explanation: 'С наследованием нужно 2^3 = 8 классов (L, C, R, LC, LR, CR, LCR + базовый). С Decorator — 3 декоратора, комбинируются в рантайме.',
              },
            },
            {
              id: 'dp-l13-s7',
              title: 'Когда НЕ использовать паттерны',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие признаки over-engineering (избыточного проектирования)?',
                options: [
                  { id: 'a', text: 'Абстрактная фабрика для одного класса' },
                  { id: 'b', text: 'Интерфейс с одной реализацией «на будущее»' },
                  { id: 'c', text: '5 уровней наследования ради гибкости' },
                  { id: 'd', text: 'Использование dependency injection' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'Фабрика для одного класса, интерфейсы «на будущее», глубокое наследование — over-engineering. DI (d) — нормальная практика.',
              },
            },
            {
              id: 'dp-l13-s8',
              title: 'Монолит vs Микросервисы',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждой архитектуры',
                columns: ['Монолит', 'Микросервисы'],
                rows: [
                  { label: 'Простой деплой', correct: ['Монолит'] },
                  { label: 'ACID-транзакции из коробки', correct: ['Монолит'] },
                  { label: 'Независимое масштабирование', correct: ['Микросервисы'] },
                  { label: 'Сложнее отладка', correct: ['Микросервисы'] },
                ],
                explanation: 'Монолит — простой, ACID. Микросервисы — масштабирование, но сложность (сеть, eventual consistency, observability).',
              },
            },
            {
              id: 'dp-l13-s9',
              title: 'Паттерн Singleton',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите класс Config (Singleton) на Python, гарантирующий единственный экземпляр.',
                starterCode: 'class Config:\n    ',
                mustInclude: [
                  { pattern: '_instance', message: 'Нужно поле _instance' },
                  { pattern: '__new__', message: 'Нужен метод __new__' },
                  { pattern: 'if cls\\._instance is None', message: 'Нужна проверка на None' },
                ],
                explanation: 'class Config:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance',
              },
            },
            {
              id: 'dp-l13-s10',
              title: 'CQRS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что разделяет паттерн CQRS?',
                options: [
                  { id: 'a', text: 'Фронтенд и бэкенд' },
                  { id: 'b', text: 'Модель чтения (Query) и модель записи (Command)' },
                  { id: 'c', text: 'Базу данных и кэш' },
                  { id: 'd', text: 'Микросервисы и монолит' },
                ],
                correct: ['b'],
                explanation: 'CQRS = Command Query Responsibility Segregation. Чтение и запись используют разные модели данных (часто разные БД).',
              },
            },
          ],
        },
      ],
    },
  ],
};