import type { Course } from './types';

export const terraformBasicsCourse: Course = {
  slug: 'terraform-basics',
  title: 'Terraform: инфраструктура как код',
  subtitle: 'HCL, state, модули, провайдеры, remote backend и CI/CD для облачной инфраструктуры',
  description:
    'Terraform — де-факто стандарт infrastructure-as-code. Курс объясняет, как описывать облачную инфраструктуру декларативно и воспроизводимо: провайдеры и HCL, цикл init/plan/apply, state и его проблемы, remote backend и блокировки, модули и Registry, реальные провайдеры (AWS), импорт существующих ресурсов, best practices (tflint, fmt, validate), Terraform в CI/CD и drift detection. Практикум — комплексная практика.',
  level: 'Средний',
  tags: ['Terraform', 'IaC', 'DevOps', 'Cloud'],
  accent: '#7B42BC',
  icon: 'terraform',
  outcomes: [
    'Объяснять, чем IaC отличается от ручного создания инфраструктуры',
    'Писать HCL: ресурсы, переменные, outputs, locals, for_each, count',
    'Понимать state и настраивать remote backend с блокировками',
    'Создавать и переиспользовать модули, подключать Registry',
    'Импортировать существующие ресурсы и управлять drift',
    'Встраивать Terraform в CI: plan в PR, apply в main, tflint/checkov',
  ],
  requirements: [
    'Уверенная работа в терминале (курс Linux)',
    'Понимание Docker и базового K8s (курсы Docker, K8s: основы)',
    'Аккаунт в облаке (AWS/GCP/Yandex) для практики — опционально',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы IaC
    // ─────────────────────────────────────────────
    {
      id: 'tf-m1',
      title: 'Основы IaC и Terraform',
      lessons: [
        {
          id: 'tf-l1',
          title: 'Что такое IaC и зачем Terraform',
          minutes: 25,
          steps: [
            {
              id: 'tf-l1-s1',
              title: 'Проблема ручной инфраструктуры',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Классический сценарий: разработчик заходит в консоль AWS (или Yandex Cloud) и руками создаёт EC2, VPC, S3, RDS. Через месяц нужно то же самое на staging — повторяет руками. Ещё через месяц — новый регион. Итог: окружения расходятся, никто не помнит, как именно собрано прод, воспроизвести с нуля невозможно.' },
                {
                  type: 'list',
                  items: [
                    'Ручное создание не воспроизводимо — каждое окружение собирается по памяти',
                    'Нет истории изменений: «кто удалил security group?» — ответа нет',
                    'Нельзя проверить изменения до применения — «сначала сломали, потом починили»',
                    'Переезд в другой регион / облако — заново руками',
                  ],
                },
                { type: 'note', text: 'IaC (Infrastructure as Code) — инфраструктура описана в файлах и версионируется в Git. Terraform — самый популярный инструмент IaC (наряду с Pulumi, CloudFormation, OpenTofu). Работает с AWS, GCP, Azure, Yandex, Kubernetes, GitHub, Cloudflare — десятки провайдеров.' },
              ],
            },
            {
              id: 'tf-l1-s2',
              title: 'Декларативный подход',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform — декларативный. Вы не пишете «создай EC2, потом VPC, потом привяжи security group» — вы описываете желаемое состояние: «есть VPC X, в ней subnet Y, в ней EC2 Z с такими-то параметрами». Terraform сам решает, в каком порядке что создавать, и что уже существует.' },
                {
                  type: 'table',
                  caption: 'Императивный vs декларативный',
                  head: ['Подход', 'Пример', 'Проблема'],
                  rows: [
                    ['Императивный', 'Ansible, shell-скрипты: «создай, потом настрой»', 'Повторный запуск ломается, нет «желаемого состояния»'],
                    ['Декларативный', 'Terraform, K8s: «вот что должно быть»', 'Terraform сам считает diff и применяет только изменения'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Желаемое состояние, а не команды',
                  code: '# Не «создай EC2». А «вот EC2, который должен быть».\nresource "aws_instance" "web" {\n  ami           = "ami-0123456789abcdef0"\n  instance_type = "t3.micro"\n  tags = {\n    Name = "web-server"\n  }\n}',
                },
                { type: 'note', text: 'Ключевая идея: Terraform сверяет файл с реальным состоянием облака через state и применяет только разницу. Если EC2 уже есть — ничего не делает. Если удалили руками — пересоздаст (или покажет drift).' },
              ],
            },
            {
              id: 'tf-l1-s3',
              title: 'Проверь себя: декларативность',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём главное отличие декларативного подхода Terraform от императивных скриптов?',
                options: [
                  { id: 'a', text: 'Terraform быстрее' },
                  { id: 'b', text: 'Вы описываете желаемое состояние, а Terraform сам решает, как его достичь' },
                  { id: 'c', text: 'Terraform работает только с AWS' },
                  { id: 'd', text: 'Terraform не требует установки' },
                ],
                correct: ['b'],
                explanation:
                  'Декларативность — главная идея IaC. Terraform хранит модель желаемого состояния (state) и приводит реальность к ней. Императивные скрипты перезапускаются с нуля и ломаются при повторном применении.',
              },
            },
            {
              id: 'tf-l1-s4',
              title: 'Экосистема IaC: кто с кем',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform — не единственный инструмент IaC. Важно понимать, кто с кем и когда что выбирать. На собеседовании DevOps это стандартный блок вопросов.' },
                {
                  type: 'table',
                  caption: 'Инструменты IaC',
                  head: ['Инструмент', 'Подход', 'Провайдеры/облака', 'Когда'],
                  rows: [
                    ['Terraform', 'HCL, декларативный', 'AWS, GCP, Azure, Yandex, K8s, GitHub, Cloudflare', 'Мульти-облако, стандарт индустрии'],
                    ['OpenTofu', 'Форк Terraform (MPL)', 'Те же', 'Если лицензия Terraform (BUSL) не подходит'],
                    ['Pulumi', 'Python/TS/Go, декларативный', 'Те же + свой код', 'Команда хочет код, а не DSL'],
                    ['CloudFormation', 'YAML/JSON, декларативный', 'Только AWS', 'Полностью AWS-нативный стек'],
                    ['AWS CDK', 'TypeScript/Python, декларативный', 'Только AWS', 'AWS + привычный язык программирования'],
                    ['Ansible', 'YAML, императивный', 'Linux, K8s, облака', 'Конфигурация серверов, не инфраструктура'],
                  ],
                },
                { type: 'note', text: 'В 2024 HashiCorp сменила лицензию Terraform на BUSL — это привело к появлению OpenTofu (Linux Foundation). Для 90% команд Terraform всё ещё ок, но для строгих open-source-политик — смотрят на OpenTofu. Синтаксис почти идентичен.' },
              ],
            },
            {
              id: 'tf-l1-s5',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент IaC и его особенность',
                pairs: [
                  { left: 'Terraform', right: 'HCL, мульти-облако, стандарт индустрии' },
                  { left: 'OpenTofu', right: 'Форк Terraform под лицензией MPL (Linux Foundation)' },
                  { left: 'Pulumi', right: 'Инфраструктура на Python/TS/Go, а не на DSL' },
                  { left: 'CloudFormation', right: 'Только AWS, YAML/JSON' },
                ],
                explanation:
                  'Terraform — универсальный HCL. OpenTofu — тот же синтаксис, другая лицензия. Pulumi — если команда хочет писать на «настоящем» языке. CloudFormation — AWS-only, но максимально нативный.',
              },
            },
          ],
        },
        {
          id: 'tf-l2',
          title: 'Первый запуск: init, plan, apply',
          minutes: 25,
          steps: [
            {
              id: 'tf-l2-s1',
              title: 'Установка и первый провайдер',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка Terraform',
                  code: '# Windows (через chocolatey)\nchoco install terraform\n\n# macOS (Homebrew)\nbrew tap hashicorp/tap && brew install hashicorp/tap/terraform\n\n# Linux (Ubuntu/Debian — официальный репозиторий)\nwget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg\necho "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list\nsudo apt update && sudo apt install terraform\n\n# Проверка\nterraform version',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'main.tf — минимальный конфиг',
                  code: 'terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "eu-central-1"\n}\n\nresource "aws_s3_bucket" "demo" {\n  bucket = "my-terraform-demo-bucket-12345"\n}',
                },
                { type: 'note', text: 'required_providers фиксирует версию — чтобы через полгода не сломаться из-за мажорного обновления провайдера. Провайдер скачивается в .terraform/ при init.' },
              ],
            },
            {
              id: 'tf-l2-s2',
              title: 'Цикл: init → plan → apply',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Жизненный цикл Terraform',
                  code: 'graph LR\n  Files["*.tf файлы"] --> Init["terraform init<br/>скачать провайдеры"]\n  Init --> Plan["terraform plan<br/>показать diff"]\n  Plan --> Apply["terraform apply<br/>применить"]\n  Apply --> State[("terraform.tfstate")]\n  State -.->|"сравнение"| Plan\n  State --> Destroy["terraform destroy<br/>удалить всё"]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: '# 1. Инициализация — скачивает провайдеры, создаёт .terraform/\nterraform init\n\n# 2. План — что будет сделано (ничего не меняет)\nterraform plan\nterraform plan -out=tfplan          # сохранить план\nterraform plan -var="region=us-east-1"\n\n# 3. Применение\nterraform apply\nterraform apply tfplan              # применить сохранённый план\nterraform apply -auto-approve       # без подтверждения (для CI)\n\n# 4. Удаление всей инфраструктуры\nterraform destroy\n\n# Полезное\nterraform fmt                        # форматирование\nterraform validate                   # валидация синтаксиса\nterraform show                       # текущий state\nterraform output                     # outputs',
                },
                { type: 'note', text: 'Правило: перед apply всегда смотрите plan. Особенно на проде. plan показывает всё: + создать, ~ изменить, - удалить. Если plan неожиданно удаляет прод-БД — вы вовремя это увидите.' },
              ],
            },
            {
              id: 'tf-l2-s3',
              title: 'Проверь себя: команды',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие команды Terraform НЕ меняют реальную инфраструктуру?',
                options: [
                  { id: 'a', text: 'terraform plan' },
                  { id: 'b', text: 'terraform apply' },
                  { id: 'c', text: 'terraform validate' },
                  { id: 'd', text: 'terraform destroy' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'plan только показывает, что будет сделано. validate проверяет синтаксис. apply и destroy реально меняют инфраструктуру (создают/удаляют).',
              },
            },
            {
              id: 'tf-l2-s4',
              title: 'Чтение вывода plan',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'terraform plan выводит diff в компактном виде. Символы слева от ресурса — это и есть «что произойдёт». Если не научиться их читать, plan превращается в «много текста».' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Символы plan',
                  code: '+  создать (ресурса ещё нет)\n~  изменить на месте (in-place update)\n-  удалить\n-/+ заменить (удалить и создать заново)\n<= прочитать (data source)\n\nИтог внизу:\nPlan: 3 to add, 1 to change, 2 to destroy.',
                },
                {
                  type: 'list',
                  items: [
                    '`+` — новый ресурс, безопасно',
                    '`~` — изменение на месте (например, тег), обычно безопасно',
                    '`-` — удаление, проверьте дважды',
                    '`-/+` — замена: удалить и создать. Опасно для stateful-ресурсов (RDS!)',
                    '`forces replacement` — пометка, что изменение требует пересоздания',
                  ],
                },
                { type: 'note', text: 'Если plan показывает замену (-/+) для БД — это красный флаг. Скорее всего, вы меняете immutable-поле (например, engine_version с major bump). Нужно делать через blue-green, а не через замену в лоб.' },
              ],
            },
            {
              id: 'tf-l2-s5',
              title: 'Проверь себя: символы plan',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В terraform plan ресурс помечен `-/+`. Что это значит?',
                options: [
                  { id: 'a', text: 'Ресурс будет создан' },
                  { id: 'b', text: 'Ресурс будет изменён на месте (in-place update)' },
                  { id: 'c', text: 'Ресурс будет удалён и создан заново (replace)' },
                  { id: 'd', text: 'Ресурс только для чтения' },
                ],
                correct: ['c'],
                explanation:
                  '`-/+` — replace: Terraform удалит старый ресурс и создаст новый (например, при смене immutable-поля). Для RDS/S3 с данными это критично — данные могут потеряться. Всегда читайте plan перед apply.',
              },
            },
          ],
        },
        {
          id: 'tf-l3',
          title: 'State: что это и почему важен',
          minutes: 25,
          steps: [
            {
              id: 'tf-l3-s1',
              title: 'Что хранит state',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform хранит mapping «ресурс в конфиге ↔ реальный ресурс в облаке» в файле terraform.tfstate (JSON). Без state Terraform не знает, что уже создано, и пытается создать всё заново при каждом apply.' },
                {
                  type: 'code',
                  lang: 'json',
                  caption: 'terraform.tfstate — упрощённо',
                  code: '{\n  "version": 4,\n  "terraform_version": "1.9.0",\n  "resources": [\n    {\n      "type": "aws_s3_bucket",\n      "name": "demo",\n      "instances": [\n        {\n          "attributes": {\n            "id": "my-terraform-demo-bucket-12345",\n            "arn": "arn:aws:s3:::my-terraform-demo-bucket-12345",\n            "region": "eu-central-1"\n          }\n        }\n      ]\n    }\n  ]\n}',
                },
                { type: 'note', text: 'State — самое ценное и самое опасное в Terraform. Если потерять state, Terraform «забудет» все созданные ресурсы. Если state попадёт не туда — можно случайно удалить прод. Поэтому state хранят в remote backend (S3, GCS, Terraform Cloud), а не в репозитории.' },
              ],
            },
            {
              id: 'tf-l3-s2',
              title: 'Проблемы локального state',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Файл локальный — у коллеги свой. Два человека применят — получат конфликт',
                    'Попадёт в Git — утечка секретов (в state есть пароли от RDS, токены)',
                    'Потеряется ноутбук — потерян state, инфраструктура «осиротела»',
                    'Нет блокировки — два apply одновременно сломают state',
                    'Нет истории — откатить state к предыдущей версии нельзя',
                  ],
                },
                { type: 'note', text: 'Решение — remote backend: state лежит в S3/GCS/Azure Blob с блокировкой (DynamoDB для AWS, встроенная для GCS/TFC). Это обязательная практика для команд. Соло-проект может жить и с локальным, но недолго.' },
              ],
            },
            {
              id: 'tf-l3-s3',
              title: 'Проверь себя: state',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему terraform.tfstate нельзя коммитить в публичный Git-репозиторий?',
                options: [
                  { id: 'a', text: 'Он слишком большой' },
                  { id: 'b', text: 'В state могут быть секреты (пароли БД, токены), и его потеря/утечка опасна' },
                  { id: 'c', text: 'Git не поддерживает JSON' },
                  { id: 'd', text: 'Terraform не работает с закоммиченным state' },
                ],
                correct: ['b'],
                explanation:
                  'State содержит атрибуты всех ресурсов, включая чувствительные: пароли RDS, ключи, токены. Публичный state = утечка. Для команд — remote backend с шифрованием.',
              },
            },
            {
              id: 'tf-l3-s4',
              title: 'Что делать при потере state',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Потерять state — неприятно, но восстановимо. Terraform может «переимпортировать» существующие ресурсы из облака. Главное — не паниковать и не запускать `apply` на пустом state: это создаст дубликаты или, хуже, пересоздаст ресурсы.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Восстановление state',
                  code: '# 1. Если есть бэкап S3 (versioning) — достать предыдущую версию\naws s3api get-object --bucket my-tf-state --key prod/terraform.tfstate --version-id <id> terraform.tfstate\n\n# 2. Если бэкапа нет — переимпортировать ресурсы\nterraform import aws_s3_bucket.demo my-bucket-name\nterraform import aws_instance.web i-1234567890abcdef0\n\n# 3. Проверить plan — должен быть пустым (No changes)\nterraform plan',
                },
                {
                  type: 'list',
                  items: [
                    'S3 versioning — обязателен для state bucket: всегда есть предыдущая версия',
                    'DynamoDB lock — если «завис», force-unlock (только если уверены, что никто не работает)',
                    'Импорт ресурсов — ручная, но рабочая стратегия',
                    'После импорта — plan должен быть пустым, иначе конфиг расходится с реальностью',
                  ],
                },
                { type: 'note', text: 'Хорошая практика: перед каждым крупным apply — снять бэкап state (aws s3 cp s3://bucket/state ./backup.tfstate). S3 versioning даёт это бесплатно, но локальная копия спасает от «а вдруг в S3 что-то не так».' },
              ],
            },
            {
              id: 'tf-l3-s5',
              title: 'Проверь себя: восстановление',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие способы восстановить state существуют?',
                options: [
                  { id: 'a', text: 'Достать предыдущую версию из S3 versioning' },
                  { id: 'b', text: 'Переимпортировать существующие ресурсы через terraform import' },
                  { id: 'c', text: 'Запустить terraform apply на пустом state — Terraform сам всё найдёт' },
                  { id: 'd', text: 'Использовать бэкап state, снятый перед apply' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'S3 versioning, ручной импорт и локальный бэкап — три рабочих способа. Запуск apply на пустом state (c) — худшее, что можно сделать: Terraform создаст дубликаты или пересоздаст ресурсы «с нуля», что может привести к потере данных.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m2 — HCL: язык Terraform
    // ─────────────────────────────────────────────
    {
      id: 'tf-m2',
      title: 'HCL: язык Terraform',
      lessons: [
        {
          id: 'tf-l4',
          title: 'Синтаксис HCL: блоки и аргументы',
          minutes: 30,
          steps: [
            {
              id: 'tf-l4-s1',
              title: 'Блоки и аргументы',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'HCL (HashiCorp Configuration Language) — язык описания инфраструктуры. Состоит из блоков: resource "тип" "имя" { ... }, variable "имя" { ... }, output "имя" { ... }. Внутри блока — аргументы key = value.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Анатомия блока',
                  code: '#   блок     тип           имя       аргументы\n#     │        │             │           │\nresource "aws_instance" "web" {\n  ami           = "ami-12345"        # аргумент\n  instance_type = "t3.micro"\n\n  tags = {                            # вложенный блок\n    Name = "web-server"\n    Env  = "production"\n  }\n}',
                },
                {
                  type: 'list',
                  items: [
                    'resource — что создать (EC2, S3, VPC, ...)',
                    'data — что прочитать (существующий VPC, AMI, ...)',
                    'variable — входной параметр',
                    'output — выходное значение',
                    'locals — вычисляемые значения',
                    'module — вызов модуля',
                    'provider — настройка провайдера',
                    'terraform — настройки самого Terraform (версия, backend)',
                  ],
                },
                { type: 'note', text: 'Отступы — 2 пробела, terraform fmt приведёт к стандарту. Не пишите ключи в camelCase: в HCL принят snake_case (instance_type, а не instanceType).' },
              ],
            },
            {
              id: 'tf-l4-s2',
              title: 'Провайдеры и версии',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Несколько провайдеров в одном проекте',
                  code: 'terraform {\n  required_version = ">= 1.6.0"      # версия Terraform\n\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"              # >= 5.0, < 6.0\n    }\n    kubernetes = {\n      source  = "hashicorp/kubernetes"\n      version = "~> 2.30"\n    }\n    random = {\n      source  = "hashicorp/random"\n      version = "~> 3.6"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.aws_region\n}',
                },
                {
                  type: 'table',
                  caption: 'Операторы версий',
                  head: ['Оператор', 'Смысл', 'Пример'],
                  rows: [
                    ['= 5.0.0', 'Точно эта версия', 'Жёстко, редко'],
                    ['~> 5.0', '>= 5.0, < 6.0', 'Стандарт для мажорных'],
                    ['~> 5.0.1', '>= 5.0.1, < 5.1.0', 'Более узкий диапазон'],
                    ['>= 5.0', 'Любая от 5.0', 'Опасно — мажорные ломают'],
                  ],
                },
                { type: 'note', text: 'Правило: `~>` (pessimistic constraint) — стандарт. Фиксируйте мажорную версию. Иначе через полгода `terraform init` скачает 6.0, и конфиг сломается. Плюс — lock-файл `.terraform.lock.hcl` фиксирует точные версии для команды.' },
              ],
            },
            {
              id: 'tf-l4-s3',
              title: 'Проверь себя: версии',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что означает версия провайдера `~> 5.0`?',
                options: [
                  { id: 'a', text: 'Ровно 5.0' },
                  { id: 'b', text: 'Любая версия от 5.0 и выше, без ограничений' },
                  { id: 'c', text: 'От 5.0 до 6.0 (не включая 6.0)' },
                  { id: 'd', text: 'Только последняя' },
                ],
                correct: ['c'],
                explanation:
                  '`~> 5.0` — pessimistic constraint: разрешает патчи и минорные обновления (5.1, 5.2, 5.9), но не 6.0. Защищает от ломающих мажорных изменений.',
              },
            },
            {
              id: 'tf-l4-s4',
              title: 'Типы данных в HCL',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'HCL — типизированный язык. Каждый аргумент имеет тип: примитивный (string, number, bool), коллекция (list, set, map) или структурный (object, tuple). Понимание типов критично: 80% ошибок Terraform — «не тот тип в переменной».' },
                {
                  type: 'table',
                  caption: 'Типы HCL',
                  head: ['Тип', 'Пример', 'Где используется'],
                  rows: [
                    ['string', '"t3.micro", "eu-central-1"', 'AMI ID, регион, имена'],
                    ['number', '3, 1.5, 8080', 'count, порты, размеры дисков'],
                    ['bool', 'true / false', 'флаги (encrypted, enabled)'],
                    ['list(T)', '["a", "b", "c"]', 'список подсетей, портов'],
                    ['set(T)', '["a", "b"] (уникальные)', 'for_each с уникальными ключами'],
                    ['map(T)', '{a = 1, b = 2}', 'теги, переменные окружения'],
                    ['object({...})', '{name = string, port = number}', 'сложные конфиги'],
                    ['tuple([...])', '[string, number, bool]', 'фиксированная структура'],
                  ],
                },
                { type: 'note', text: 'Правило: в variable всегда указывайте type. Без него Terraform принимает any, и вы получаете странные ошибки в рантайме (number как string). На собеседовании junior: «чем list отличается от set?» — list упорядочен, set уникален и неупорядочен.' },
              ],
            },
            {
              id: 'tf-l4-s5',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип HCL и его пример',
                pairs: [
                  { left: 'string', right: '"eu-central-1"' },
                  { left: 'number', right: '3 (порты, count, размер)' },
                  { left: 'bool', right: 'true (флаг encrypted)' },
                  { left: 'map(string)', right: '{Name = "web", Env = "prod"} (теги)' },
                ],
                explanation:
                  'string — строка, number — число, bool — флаг, map — словарь (например, теги). list и set — коллекции; object — сложная структура. Указывайте type в variable — это ловит ошибки до apply.',
              },
            },
          ],
        },
        {
          id: 'tf-l5',
          title: 'Переменные, outputs, locals',
          minutes: 30,
          steps: [
            {
              id: 'tf-l5-s1',
              title: 'Input-переменные',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'variables.tf',
                  code: 'variable "aws_region" {\n  description = "Регион AWS"\n  type        = string\n  default     = "eu-central-1"\n}\n\nvariable "instance_count" {\n  description = "Сколько EC2 создать"\n  type        = number\n  default     = 2\n  validation {\n    condition     = var.instance_count > 0 && var.instance_count < 10\n    error_message = "instance_count должен быть от 1 до 9"\n  }\n}\n\nvariable "db_password" {\n  type      = string\n  sensitive = true        # не выводить в логах и плане\n}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как передать значения',
                  code: '# 1. Через -var в командной строке\nterraform apply -var="aws_region=us-east-1"\n\n# 2. Через файл terraform.tfvars (автоподхват)\n#    terraform.tfvars:\n#    aws_region = "us-east-1"\n\n# 3. Через -var-file\nterraform apply -var-file="prod.tfvars"\n\n# 4. Через переменные окружения (TF_VAR_*)\nexport TF_VAR_aws_region=us-east-1',
                },
                { type: 'note', text: 'Чувствительные переменные помечайте `sensitive = true` — Terraform не будет выводить их в plan/log. Но в state они всё равно попадут (state нужно шифровать через remote backend).' },
              ],
            },
            {
              id: 'tf-l5-s2',
              title: 'Outputs и locals',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'outputs.tf',
                  code: 'output "web_public_ip" {\n  description = "Публичный IP веб-сервера"\n  value       = aws_instance.web.public_ip\n}\n\noutput "db_endpoint" {\n  value     = aws_db_instance.main.endpoint\n  sensitive = true\n}',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'locals.tf',
                  code: 'locals {\n  common_tags = {\n    Project   = "myapp"\n    ManagedBy = "terraform"\n    Owner     = "platform-team"\n  }\n\n  env_suffix = var.environment == "prod" ? "" : "-${var.environment}"\n}\n\n# Использование\nresource "aws_instance" "web" {\n  tags = merge(local.common_tags, {\n    Name = "web${local.env_suffix}"\n  })\n}',
                },
                {
                  type: 'list',
                  items: [
                    'variable — входной параметр, меняется между окружениями',
                    'output — выходное значение, «результат» apply',
                    'locals — вычисляемые значения внутри модуля (не передаются извне)',
                    'locals не путать с variable: locals = «внутренние вычисления», variable = «входной API»',
                  ],
                },
              ],
            },
            {
              id: 'tf-l5-s3',
              title: 'Проверь себя: назначение',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте блок и его назначение',
                pairs: [
                  { left: 'variable', right: 'Входной параметр, меняется между окружениями' },
                  { left: 'output', right: 'Выходное значение после apply' },
                  { left: 'locals', right: 'Вычисляемое значение внутри модуля' },
                  { left: 'resource', right: 'Ресурс, который нужно создать' },
                ],
                explanation:
                  'variable — API модуля. output — результат. locals — внутренние вычисления. resource — то, ради чего всё. Понимание разницы — базовый навык Terraform.',
              },
            },
            {
              id: 'tf-l5-s4',
              title: 'Приоритет переменных и tfvars',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Значения переменных могут приходить из пяти источников, и у них есть строгий приоритет. Если не знать порядок, легко «потерять» переменную: задали в tfvars, а оно перебилось env-переменной.' },
                {
                  type: 'table',
                  caption: 'Приоритет (от низшего к высшему)',
                  head: ['Источник', 'Пример', 'Приоритет'],
                  rows: [
                    ['default в variable', 'default = "eu-central-1"', '1 (низший)'],
                    ['terraform.tfvars', 'aws_region = "us-east-1"', '2'],
                    ['*.auto.tfvars', 'prod.auto.tfvars', '3'],
                    ['-var-file', 'terraform apply -var-file=prod.tfvars', '4'],
                    ['-var', 'terraform apply -var="aws_region=us-west-2"', '5'],
                    ['TF_VAR_* env', 'export TF_VAR_aws_region=ap-south-1', '6 (высший)'],
                  ],
                },
                { type: 'note', text: 'Правило: в CI используйте env-переменные (TF_VAR_*) — они перебивают всё и удобны для секретов. Локально — terraform.tfvars. Не смешивайте: если в tfvars одно, а в env другое — победит env, и вы потратите час на отладку.' },
              ],
            },
            {
              id: 'tf-l5-s5',
              title: 'Проверь себя: приоритет',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В variable "region" default = "eu-central-1". В terraform.tfvars region = "us-east-1". В env TF_VAR_region = "ap-south-1". Какое значение будет использовано?',
                options: [
                  { id: 'a', text: 'eu-central-1 (default)' },
                  { id: 'b', text: 'us-east-1 (tfvars)' },
                  { id: 'c', text: 'ap-south-1 (env TF_VAR_region)' },
                  { id: 'd', text: 'Ошибка — нельзя задавать в трёх местах' },
                ],
                correct: ['c'],
                explanation:
                  'Приоритет: default < terraform.tfvars < -var-file < -var < TF_VAR_*. Переменная окружения перебивает всё. Это удобно для CI, но коварно локально: забыли unset — и «почему не моё значение?».',
              },
            },
          ],
        },
        {
          id: 'tf-l6',
          title: 'Функции и итерация: for_each и count',
          minutes: 35,
          steps: [
            {
              id: 'tf-l6-s1',
              title: 'Встроенные функции',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Полезные функции',
                  code: '# Строки\nupper("hello")                    # HELLO\nlower("HELLO")                    # hello\nformat("web-%s", "prod")          # web-prod\njoin(",", ["a", "b", "c"])        # a,b,c\nreplace("a-b-c", "-", "_")        # a_b_c\n\n# Коллекции\nmerge({a=1}, {b=2})               # {a=1, b=2}\nconcat([1,2], [3,4])              # [1,2,3,4]\ncontains(["a","b"], "a")          # true\nlookup({a=1}, "a", 0)             # 1\nlength([1,2,3])                   # 3\n\n# Файлы\nfile("${path.module}/init.sh")\nfilebase64("cert.pem")\n\n# Условия\nvar.env == "prod" ? "m5.large" : "t3.micro"\ncoalesce(null, "", "default")     # "default"\ntry(var.maybe, "fallback")',
                },
                { type: 'note', text: 'Функции вызываются в выражениях: `ami = data.aws_ami.ubuntu.id`, `name = "web-${var.env}"`. Terraform 1.9+ имеет `terraform console` — REPL для проверки выражений.' },
              ],
            },
            {
              id: 'tf-l6-s2',
              title: 'count vs for_each',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'count и for_each: сколько ресурсов и как их адресовать',
                  code: 'graph LR\n  Cnt["count = 3"] --> R1["aws_instance.web[0]"]\n  Cnt --> R2["aws_instance.web[1]"]\n  Cnt --> R3["aws_instance.web[2]"]\n  FE["for_each = tomap({a=1,b=2})"] --> F1["aws_instance.web[\\"a\\"]"]\n  FE --> F2["aws_instance.web[\\"b\\"]"]',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'count — по числу',
                  code: 'resource "aws_instance" "web" {\n  count         = 3\n  ami           = "ami-12345"\n  instance_type = "t3.micro"\n  tags = {\n    Name = "web-${count.index}"\n  }\n}\n\n# Адресация: aws_instance.web[0], aws_instance.web[1], ...',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'for_each — по ключам (лучше для реальных конфигов)',
                  code: 'resource "aws_instance" "web" {\n  for_each      = toset(["api", "worker", "cron"])\n  ami           = "ami-12345"\n  instance_type = "t3.micro"\n  tags = {\n    Name = "web-${each.key}"\n  }\n}\n\n# Адресация: aws_instance.web["api"], aws_instance.web["worker"]',
                },
                { type: 'note', text: 'Правило: count удобен для однородных ресурсов, for_each — когда нужно адресовать по имени. С count удаление среднего элемента сдвигает индексы и пересоздаёт всё после него. С for_each — удаляется только этот ключ. Для прода — почти всегда for_each.' },
              ],
            },
            {
              id: 'tf-l6-s3',
              title: 'Проверь себя: count',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт при count = 3, если удалить средний элемент списка (индекс 1)?',
                options: [
                  { id: 'a', text: 'Ничего' },
                  { id: 'b', text: 'Terraform пересоздаст ресурс с индексом 1 и, возможно, сдвинет индексы' },
                  { id: 'c', text: 'Все ресурсы удалятся' },
                  { id: 'd', text: 'Terraform применит for_each автоматически' },
                ],
                correct: ['b'],
                explanation:
                  'С count адресация по индексам. Удаление среднего сдвигает индексы — Terraform пересоздаст ресурсы. С for_each такого нет: удаляется только конкретный ключ. Поэтому for_each предпочтительнее.',
              },
            },
            {
              id: 'tf-l6-s4',
              title: 'for_each с объектами',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'for_each работает не только с set, но и с map объектов. Это открывает «инфраструктуру как данные»: конфиг в одном месте, ресурсы — генерируются. Классика: 5 окружений × 3 сервиса = 15 ресурсов — одним блоком.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'for_each с map(object)',
                  code: 'variable "services" {\n  type = map(object({\n    port  = number\n    cpu   = number\n  }))\n  default = {\n    api    = { port = 8000, cpu = 256 }\n    worker = { port = 0,    cpu = 512 }\n    cron   = { port = 0,    cpu = 128 }\n  }\n}\n\nresource "aws_ecs_task_definition" "svc" {\n  for_each = var.services\n\n  family = each.key\n  cpu    = each.value.cpu\n  memory = 512\n  container_definitions = jsonencode([{\n    name  = each.key\n    image = "myapp/${each.key}:latest"\n    portMappings = each.value.port > 0 ? [{\n      containerPort = each.value.port\n    }] : []\n  }])\n}',
                },
                {
                  type: 'list',
                  items: [
                    'for_each = var.services — по ключам map (api, worker, cron)',
                    'each.key — имя сервиса, each.value — объект {port, cpu}',
                    'jsonencode — сериализует HCL-объект в JSON (для ECS)',
                    'Условие `each.value.port > 0` — у worker/cron нет портов',
                    'Один блок — 3 ресурса, при добавлении 4-го сервиса — просто дописать в map',
                  ],
                },
                { type: 'note', text: 'Это главный паттерн «инфраструктура как данные». Вместо 15 почти одинаковых resource-блоков — один с for_each. Когда сервисов станет 50 — не будете копипастить 50 раз. На собеседовании senior DevOps спросят именно это.' },
              ],
            },
            {
              id: 'tf-l6-s5',
              title: 'Проверь себя: for_each',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Почему for_each предпочтительнее count в продакшене?',
                options: [
                  { id: 'a', text: 'Удаление ресурса не сдвигает индексы остальных' },
                  { id: 'b', text: 'Адресация по имени (each.key) читаемее, чем [0], [1]' },
                  { id: 'c', text: 'for_each всегда быстрее count' },
                  { id: 'd', text: 'Работает с map(object) — можно описать 20 сервисов одним блоком' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'for_each стабильнее при удалении (a), читаемее (b), поддерживает сложные структуры (d). Скорость (c) — миф: они сопоставимы, выбор про стабильность и читаемость.',
              },
            },
          ],
        },
        {
          id: 'tf-l7',
          title: 'Зависимости и lifecycle',
          minutes: 30,
          steps: [
            {
              id: 'tf-l7-s1',
              title: 'Неявные зависимости',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform сам строит граф зависимостей. Если один ресурс ссылается на атрибут другого, между ними неявная зависимость: EC2 не создастся раньше security group.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Неявная зависимость',
                  code: 'resource "aws_security_group" "web" {\n  name = "web-sg"\n  # ...\n}\n\nresource "aws_instance" "web" {\n  ami             = "ami-12345"\n  instance_type   = "t3.micro"\n  security_groups = [aws_security_group.web.id]   # ← неявная зависимость\n}',
                },
                { type: 'note', text: 'Terraform создаст security group → потом EC2. При destroy — наоборот: EC2 → security group. Граф автоматический, ничего указывать не нужно.' },
              ],
            },
            {
              id: 'tf-l7-s2',
              title: 'depends_on и lifecycle',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Явная зависимость',
                  code: 'resource "aws_instance" "web" {\n  ami           = "ami-12345"\n  instance_type = "t3.micro"\n\n  depends_on = [aws_iam_role_policy.web]   # явная зависимость\n}',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'lifecycle',
                  code: 'resource "aws_instance" "web" {\n  ami           = "ami-12345"\n  instance_type = "t3.micro"\n\n  lifecycle {\n    create_before_destroy = true     # создать новый, потом удалить старый\n    prevent_destroy       = true     # запрет на удаление (для прод-БД)\n    ignore_changes        = [tags]   # игнорировать изменения тегов (управляются извне)\n  }\n}',
                },
                {
                  type: 'table',
                  caption: 'Что делает lifecycle',
                  head: ['Параметр', 'Когда использовать'],
                  rows: [
                    ['create_before_destroy', 'Zero-downtime замена: новый ресурс создаётся до удаления старого'],
                    ['prevent_destroy', 'Защита прод-БД, бакетов: terraform destroy упадёт'],
                    ['ignore_changes', 'Ресурс меняется извне (теги, автоконфиг) — не трогать'],
                    ['replace_triggered_by', 'Пересоздать ресурс при изменении другого'],
                  ],
                },
                { type: 'note', text: 'prevent_destroy — обязательная страховка для прод-БД. Без неё `terraform destroy` снесёт всё, включая базу с данными. Ставьте на RDS, S3, любые stateful-ресурсы.' },
              ],
            },
            {
              id: 'tf-l7-s3',
              title: 'Проверь себя: lifecycle',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие параметры lifecycle полезны для продакшена?',
                options: [
                  { id: 'a', text: 'prevent_destroy = true для RDS' },
                  { id: 'b', text: 'create_before_destroy = true для EC2 без простоя' },
                  { id: 'c', text: 'ignore_changes = all для всего' },
                  { id: 'd', text: 'ignore_changes = [tags] для ресурсов с внешним тегированием' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'prevent_destroy защищает БД. create_before_destroy даёт zero-downtime. ignore_changes для конкретных полей — когда их меняет кто-то извне. ignore_changes = all на всё — антипаттерн: Terraform перестанет управлять ресурсом вообще.',
              },
            },
            {
              id: 'tf-l7-s4',
              title: 'Граф зависимостей: как Terraform планирует',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform строит направленный ациклический граф (DAG) из всех ресурсов и их зависимостей. Порядок apply — топологическая сортировка графа. Понимание этого объясняет, почему «не создаётся ресурс» или «почему порядок не тот».' },
                {
                  type: 'mermaid',
                  caption: 'Граф: VPC → Subnet → EC2 → EIP',
                  code: 'graph LR\n  VPC["aws_vpc"] --> Sub["aws_subnet"]\n  Sub --> EC2["aws_instance"]\n  EC2 --> EIP["aws_eip"]\n  SG["aws_security_group"] --> EC2\n  IAM["aws_iam_role"] --> EC2',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Посмотреть граф',
                  code: '# Текстовый граф зависимостей\nterraform graph | dot -Tsvg > graph.svg\n\n# В плане видно порядок\nterraform plan\n# aws_vpc.main will be created\n# aws_subnet.public will be created\n#   (because aws_vpc.main is not yet created)',
                },
                {
                  type: 'list',
                  items: [
                    'DAG — направленный ациклический граф: циклов быть не может',
                    'Порядок — топологическая сортировка, параллельно где возможно',
                    'Неявная зависимость (ссылка на атрибут) — приоритетный способ',
                    'depends_on — когда ссылки на атрибут нет (например, IAM policy применяется раньше EC2)',
                    'Циклы в графе — ошибка Terraform: A зависит от B, B от A',
                  ],
                },
                { type: 'note', text: 'Если Terraform падает с «Cycle: aws_x depends on aws_y» — где-то кольцевая зависимость. Лечится выносом общего атрибута в locals или пересмотром архитектуры.' },
              ],
            },
            {
              id: 'tf-l7-s5',
              title: 'Проверь себя: зависимости',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда нужен явный depends_on, если Terraform строит граф автоматически?',
                options: [
                  { id: 'a', text: 'Всегда, для надёжности' },
                  { id: 'b', text: 'Когда нет ссылки на атрибут, но порядок важен (например, IAM policy до EC2)' },
                  { id: 'c', text: 'Никогда, это устаревшая практика' },
                  { id: 'd', text: 'Только для ресурсов с count = 0' },
                ],
                correct: ['b'],
                explanation:
                  'depends_on нужен, когда ссылки на атрибут нет, но порядок критичен. Например, IAM policy должна быть навешана до старта EC2. В остальных случаях — неявные зависимости через атрибуты читаемее и точнее.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m3 — State: backend и workspaces
    // ─────────────────────────────────────────────
    {
      id: 'tf-m3',
      title: 'State: remote backend и workspaces',
      lessons: [
        {
          id: 'tf-l8',
          title: 'Remote backend: S3, GCS, Azure',
          minutes: 30,
          steps: [
            {
              id: 'tf-l8-s1',
              title: 'Зачем remote backend',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Локальный state vs remote backend',
                  code: 'graph LR\n  subgraph Local["Локальный state"]\n    D1["Ноутбук A"] --> FS1[("tfstate")]\n    D2["Ноутбук B"] --> FS2[("tfstate")]\n    FS1 -.->|"конфликт"| FS2\n  end\n  subgraph Remote["Remote backend"]\n    D3["Ноутбук A"] --> S3[("S3 + DynamoDB<br/>lock")]\n    D4["Ноутбук B"] --> S3\n  end',
                },
                {
                  type: 'list',
                  items: [
                    'Один источник правды для всей команды',
                    'Блокировка: одновременно apply может только один',
                    'Шифрование at-rest (S3 SSE, GCS encryption)',
                    'Версионирование: можно откатить state к предыдущей версии',
                    'Аудит: кто и когда менял state (CloudTrail, access logs)',
                  ],
                },
                { type: 'note', text: 'Terraform Cloud и Terraform Enterprise — managed backend от HashiCorp: state, блокировки, планирование, UI. Альтернатива — self-hosted: S3 + DynamoDB (AWS), GCS (GCP), Azure Blob + Lease.' },
              ],
            },
            {
              id: 'tf-l8-s2',
              title: 'Настройка S3 + DynamoDB',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: '1. Создать bucket и таблицу (один раз)',
                  code: '# S3 bucket с версионированием\naws s3api create-bucket \\\n  --bucket my-tf-state-bucket \\\n  --region eu-central-1 \\\n  --create-bucket-configuration LocationConstraint=eu-central-1\n\naws s3api put-bucket-versioning \\\n  --bucket my-tf-state-bucket \\\n  --versioning-configuration Status=Enabled\n\n# DynamoDB для блокировок\naws dynamodb create-table \\\n  --table-name terraform-locks \\\n  --attribute-definitions AttributeName=LockID,AttributeType=S \\\n  --key-schema AttributeName=LockID,KeyType=HASH \\\n  --billing-mode PAY_PER_REQUEST',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: '2. backend.tf',
                  code: 'terraform {\n  backend "s3" {\n    bucket         = "my-tf-state-bucket"\n    key            = "prod/network/terraform.tfstate"\n    region         = "eu-central-1"\n    dynamodb_table = "terraform-locks"\n    encrypt        = true\n  }\n}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: '3. Миграция локального state в S3',
                  code: '# Если уже есть локальный terraform.tfstate\nterraform init -migrate-state\n# Terraform спросит: скопировать state в S3? — yes',
                },
                { type: 'note', text: 'Один bucket, много key — стандарт. `key = "prod/network/terraform.tfstate"`, `key = "prod/app/terraform.tfstate"` и т.д. Разные команды/окружения — разные key, но общий bucket. Так удобнее управлять версиями и бэкапами.' },
              ],
            },
            {
              id: 'tf-l8-s3',
              title: 'Проверь себя: DynamoDB',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в AWS-backend нужна DynamoDB-таблица?',
                options: [
                  { id: 'a', text: 'Хранит копию state' },
                  { id: 'b', text: 'Обеспечивает блокировку: одновременно apply может только один' },
                  { id: 'c', text: 'Ускоряет plan' },
                  { id: 'd', text: 'Шифрует state' },
                ],
                correct: ['b'],
                explanation:
                  'DynamoDB — distributed lock. Один процесс берёт lock, остальные ждут. Это защита от гонок: два apply одновременно могут сломать state и создать дубликаты ресурсов. State хранится в S3, lock — в DynamoDB.',
              },
            },
            {
              id: 'tf-l8-s4',
              title: 'Другие backend: GCS, Azure, TFC',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'S3 + DynamoDB — самый популярный, но не единственный. В GCP и Azure блокировка встроена в backend, а Terraform Cloud даёт managed state с UI и планированием.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'GCS backend (GCP)',
                  code: 'terraform {\n  backend "gcs" {\n    bucket = "my-tf-state"\n    prefix = "prod/network"\n  }\n}',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'azurerm backend (Azure)',
                  code: 'terraform {\n  backend "azurerm" {\n    resource_group_name  = "tfstate-rg"\n    storage_account_name = "tfstateprod"\n    container_name       = "tfstate"\n    key                  = "prod.network.tfstate"\n  }\n}',
                },
                {
                  type: 'table',
                  caption: 'Сравнение backend',
                  head: ['Backend', 'Блокировка', 'Managed?', 'Когда'],
                  rows: [
                    ['s3 + dynamodb', 'Через DynamoDB', 'Self-hosted', 'AWS-стек'],
                    ['gcs', 'Встроенная', 'Self-hosted', 'GCP-стек'],
                    ['azurerm', 'Blob lease', 'Self-hosted', 'Azure-стек'],
                    ['remote (Terraform Cloud)', 'Встроенная', 'Managed', 'Хотите UI и audit'],
                    ['local', 'Нет', 'Локально', 'Соло-проект (не прод)'],
                  ],
                },
                { type: 'note', text: 'Terraform Cloud (TFC) — платный managed backend. Даёт UI, audit log, policy-as-code (Sentinel), планирование на стороне TFC. Для маленькой команды без своего AWS — удобнее, чем строить S3+DynamoDB руками.' },
              ],
            },
            {
              id: 'tf-l8-s5',
              title: 'Проверь себя: backend',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте backend и его особенность',
                pairs: [
                  { left: 's3 + dynamodb', right: 'State в S3, блокировка через DynamoDB' },
                  { left: 'gcs', right: 'State в GCS, блокировка встроенная' },
                  { left: 'azurerm', right: 'State в Azure Blob, блокировка через lease' },
                  { left: 'remote (Terraform Cloud)', right: 'Managed: UI, audit, policy-as-code' },
                ],
                explanation:
                  'S3/DynamoDB — AWS-классика. GCS — GCP. azurerm — Azure. remote (TFC) — managed, для тех, кто не хочет строить backend руками. Все дают блокировку, кроме local.',
              },
            },
          ],
        },
        {
          id: 'tf-l9',
          title: 'Блокировки и параллельная работа',
          minutes: 25,
          steps: [
            {
              id: 'tf-l9-s1',
              title: 'State locking',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Пока один процесс применяет изменения, второй не может взять блокировку. Terraform выдаст ошибку «Error acquiring the state lock» и будет ждать или упадёт. Это защита от race condition.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как выглядит lock',
                  code: '# Один разработчик уже делает apply\nterraform apply\n\n# Второй разработчик:\nterraform apply\n# Error: Error acquiring the state lock\n# Lock Info:\n#   ID:        1234-5678-...\n#   Path:      prod/network/terraform.tfstate\n#   Operation: OperationTypeApply\n#   Who:       anna@laptop\n#   Created:   2025-01-15 14:23:11',
                },
                { type: 'note', text: 'Блокировка автоматическая при apply, destroy, plan (если plan с -lock=true). Если план падает и lock остаётся «висящим» — force-unlock. Но только если уверены, что никто не работает параллельно.' },
              ],
            },
            {
              id: 'tf-l9-s2',
              title: 'force-unlock и риски',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Force-unlock',
                  code: '# Если Terraform упал (например, Ctrl+C) и lock остался\nterraform force-unlock 1234-5678-...\n\n# ID берётся из ошибки «Error acquiring the state lock»\n# Или из DynamoDB:\naws dynamodb scan --table-name terraform-locks',
                },
                {
                  type: 'list',
                  items: [
                    'force-unlock — только если уверены, что параллельного apply нет',
                    'Если коллега сейчас делает apply — force-unlock приведёт к race condition',
                    'После force-unlock проверьте state: terraform plan должен быть пустым',
                    'Лучше — подождать: lock автоматически освободится через 10–15 мин после падения процесса',
                  ],
                },
                { type: 'note', text: 'На собеседовании: «Terraform выдал state lock error — что делать?» — «Проверить, не работает ли кто-то параллельно (в Slack/CI). Если нет — force-unlock. Если да — подождать». Не «force-unlock сразу».' },
              ],
            },
            {
              id: 'tf-l9-s3',
              title: 'Проверь себя: lock',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда освобождает «висящую» блокировку state?',
                accepted: ['terraform force-unlock', 'force-unlock'],
                placeholder: 'terraform ...',
                hint: 'force + unlock',
                explanation:
                  'terraform force-unlock <ID> освобождает блокировку. Использовать, только если уверены, что параллельного apply нет. Иначе — race condition и повреждение state.',
              },
            },
            {
              id: 'tf-l9-s4',
              title: 'CI/CD и параллельные apply',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В CI/CD нельзя запускать apply параллельно — иначе два раннера будут бороться за lock. Правило: один pipeline на одно окружение, последовательные стадии. Для разных окружений (dev, staging, prod) — разные state key, они не мешают друг другу.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions: concurrency',
                  code: 'name: terraform-prod\non:\n  push:\n    branches: [main]\n    paths: ["infra/prod/**"]\n\n# Один apply на prod — новый отменяет старый\nconcurrency:\n  group: terraform-prod\n  cancel-in-progress: false   # деплой НЕ отменять\n\njobs:\n  apply:\n    runs-on: ubuntu-latest\n    environment: production\n    defaults: { run: { working-directory: infra/prod } }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: hashicorp/setup-terraform@v3\n      - run: terraform init\n      - run: terraform apply -auto-approve',
                },
                {
                  type: 'list',
                  items: [
                    'concurrency.group — уникальная группа, одна на окружение',
                    'cancel-in-progress: false — не отменять деплой посередине',
                    'Отдельные pipeline для dev/staging/prod — параллельно, но не мешают',
                    'state key в S3 разный (prod/..., staging/...) — изоляция',
                  ],
                },
                { type: 'note', text: 'Классический инцидент: два разработчика запушили в main одновременно, оба CI запустились, второй получил state lock. Решение — concurrency group в GitHub Actions или Resource Lock в GitLab CI.' },
              ],
            },
            {
              id: 'tf-l9-s5',
              title: 'Проверь себя: CI',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Как избежать конфликта state lock в CI/CD?',
                options: [
                  { id: 'a', text: 'Один pipeline на окружение (concurrency group)' },
                  { id: 'b', text: 'Разные state key для dev/staging/prod' },
                  { id: 'c', text: 'Отключить блокировку в backend' },
                  { id: 'd', text: 'cancel-in-progress: false для деплоя (не отменять посередине)' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Concurrency group (a), разные key (b) и запрет отмены (d) — три практики. Отключение блокировки (c) — худшее: race condition и повреждение state. Лучше подождать, чем потерять инфраструктуру.',
              },
            },
          ],
        },
        {
          id: 'tf-l10',
          title: 'Workspaces и окружения',
          minutes: 25,
          steps: [
            {
              id: 'tf-l10-s1',
              title: 'terraform workspace',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Workspaces',
                  code: '# Список workspaces\nterraform workspace list\n# * default\n\n# Создать новый\nterraform workspace new staging\nterraform workspace new prod\n\n# Переключиться\nterraform workspace select prod\n\n# Удалить\nterraform workspace delete staging',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Использование в конфиге',
                  code: 'resource "aws_instance" "web" {\n  ami           = "ami-12345"\n  instance_type = terraform.workspace == "prod" ? "m5.large" : "t3.micro"\n  tags = {\n    Env = terraform.workspace\n  }\n}',
                },
                { type: 'note', text: 'Workspaces хранят отдельные state-файлы в одном backend (например, env:/prod/terraform.tfstate в S3). Удобно для одинаковой конфигурации с разными параметрами. Не путать с «окружениями» в смысле изоляции: у workspaces один backend, один bucket, общая IAM-роль.' },
              ],
            },
            {
              id: 'tf-l10-s2',
              title: 'Альтернативы workspaces',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Как разделять окружения',
                  head: ['Подход', 'Плюсы', 'Минусы'],
                  rows: [
                    ['Workspaces', 'Один конфиг, разные state', 'Одна IAM-роль, общий backend — слабая изоляция'],
                    ['Отдельные каталоги (envs/prod, envs/dev)', 'Полная изоляция, разные backend', 'Дублирование конфига'],
                    ['Terragrunt', 'DRY: общий конфиг для всех окружений', 'Дополнительный инструмент, свой синтаксис'],
                    ['Terraform Cloud Workspaces', 'Managed, UI, audit', 'Платно'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'Workspaces — для быстрых экспериментов и одинаковых окружений',
                    'Отдельные каталоги — стандарт для прода и staging с разными правами',
                    'Terragrunt — когда окружений много и хочется DRY',
                    'Terraform Cloud — если не хотите свой backend',
                  ],
                },
                { type: 'note', text: 'В большинстве реальных проектов — отдельные каталоги: envs/dev/terraform.tfstate, envs/prod/terraform.tfstate, разные IAM-роли и разные S3-bucket. Workspaces — упрощение, у которого есть цена (слабая изоляция).' },
              ],
            },
            {
              id: 'tf-l10-s3',
              title: 'Проверь себя: workspace',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем terraform workspace отличается от «отдельного каталога на окружение»?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Workspace использует один backend и один конфиг с разными state; отдельные каталоги — полная изоляция' },
                  { id: 'c', text: 'Workspace работает только в облаке' },
                  { id: 'd', text: 'Отдельные каталоги не поддерживаются Terraform' },
                ],
                correct: ['b'],
                explanation:
                  'Workspaces — один backend, разные state внутри. Удобно, но слабая изоляция (общая IAM-роль, общий bucket). Отдельные каталоги — полная изоляция: разные роли, разные buckets. Для прода — предпочтительнее каталоги.',
              },
            },
            {
              id: 'tf-l10-s4',
              title: 'Terragrunt: DRY для окружений',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда окружений 3, а модулей 10 — получается 30 почти одинаковых main.tf. Terragrunt (обёртка над Terraform) решает это через root.hcl: общие настройки backend, provider, inputs — один раз, а в каждом окружении — только override.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'terragrunt.hcl (корень)',
                  code: '# root.hcl\nremote_state {\n  backend = "s3"\n  config = {\n    bucket = "my-tf-state"\n    key    = "${path_relative_to_include()}/terraform.tfstate"\n    region = "eu-central-1"\n  }\n}',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'envs/prod/network/terragrunt.hcl',
                  code: 'include "root" {\n  path = find_in_parent_folders("root.hcl")\n}\n\nterraform {\n  source = "../../../modules/network"\n}\n\ninputs = {\n  cidr = "10.0.0.0/16"\n  env  = "prod"\n}',
                },
                {
                  type: 'list',
                  items: [
                    'root.hcl — общие настройки (backend, provider)',
                    'include "root" — каждый модуль наследует',
                    'path_relative_to_include — автоматически даёт key в S3',
                    'inputs — параметры конкретного окружения',
                    'Один раз настроили — 3 окружения × 10 модулей = 30 файлов по 5 строк, а не по 50',
                  ],
                },
                { type: 'note', text: 'Terragrunt — не «официальный» инструмент HashiCorp, но де-факто стандарт в больших проектах. Плюс: DRY и автоматическая генерация backend. Минус: дополнительный слой абстракции, надо понимать и Terraform, и Terragrunt. На собеседовании senior DevOps спросят.' },
              ],
            },
            {
              id: 'tf-l10-s5',
              title: 'Проверь себя: Terragrunt',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какую главную проблему решает Terragrunt?',
                options: [
                  { id: 'a', text: 'Ускоряет terraform apply' },
                  { id: 'b', text: 'DRY: общий конфиг backend/provider для 30 окружений без копипасты' },
                  { id: 'c', text: 'Заменяет Terraform' },
                  { id: 'd', text: 'Работает только в AWS' },
                ],
                correct: ['b'],
                explanation:
                  'Terragrunt — обёртка над Terraform, которая убирает дублирование: root.hcl с общими настройками, каждый модуль подключает его через include. Не заменяет Terraform (использует его под капотом), не ускоряет apply, работает с любым провайдером.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m4 — Модули
    // ─────────────────────────────────────────────
    {
      id: 'tf-m4',
      title: 'Модули и Registry',
      lessons: [
        {
          id: 'tf-l11',
          title: 'Что такое модуль и зачем',
          minutes: 25,
          steps: [
            {
              id: 'tf-l11-s1',
              title: 'Модули: переиспользование',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Модуль — это папка с .tf-файлами, которую можно вызывать из других конфигов. Как функция: принимает переменные, возвращает outputs. Позволяет один раз описать «VPC для приложения» и переиспользовать в 10 проектах.' },
                {
                  type: 'mermaid',
                  caption: 'Модуль принимает переменные, возвращает outputs',
                  code: 'graph LR\n  Caller["main.tf<br/>module vpc"] -->|"cidr, env"| M["modules/vpc/"]\n  M -->|"vpc_id, subnet_ids"| Caller\n  M --> R1["aws_vpc"]\n  M --> R2["aws_subnet"]',
                },
                {
                  type: 'list',
                  items: [
                    'Корневой модуль — папка, где вы запускаете terraform apply',
                    'Дочерний модуль — вызывается через block module',
                    'Локальный модуль — папка внутри репо (./modules/vpc)',
                    'Remote модуль — git, S3, Terraform Registry',
                  ],
                },
              ],
            },
            {
              id: 'tf-l11-s2',
              title: 'Структура модуля',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичный модуль',
                  code: 'modules/vpc/\n├── main.tf         # ресурсы\n├── variables.tf    # входные параметры\n├── outputs.tf      # выходные значения\n├── versions.tf     # required_providers, версия Terraform\n└── README.md       # документация',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'modules/vpc/variables.tf и outputs.tf',
                  code: '# variables.tf\nvariable "cidr" {\n  type    = string\n  default = "10.0.0.0/16"\n}\n\nvariable "env" {\n  type = string\n}\n\n# outputs.tf\noutput "vpc_id" {\n  value = aws_vpc.main.id\n}\n\noutput "subnet_ids" {\n  value = aws_subnet.public[*].id\n}',
                },
                { type: 'note', text: 'Правило: модуль должен быть самодостаточным. Никаких внешних зависимостей — только переменные. Хороший модуль можно опубликовать в Registry и использовать в другом проекте.' },
              ],
            },
            {
              id: 'tf-l11-s3',
              title: 'Проверь себя: структура',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где в модуле описываются входные параметры?',
                options: [
                  { id: 'a', text: 'main.tf' },
                  { id: 'b', text: 'variables.tf (блоки variable)' },
                  { id: 'c', text: 'outputs.tf' },
                  { id: 'd', text: 'README.md' },
                ],
                correct: ['b'],
                explanation:
                  'variables.tf — входные параметры модуля. main.tf — ресурсы. outputs.tf — выходные значения. Разделение — конвенция, но она соблюдается почти везде.',
              },
            },
            {
              id: 'tf-l11-s4',
              title: 'Зачем вообще модули: три причины',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Модули — это не «чтобы было красиво». Три практические причины, из-за которых их используют в реальных проектах.' },
                {
                  type: 'list',
                  items: [
                    'Переиспользование: VPC для 5 проектов — один модуль, разные inputs',
                    'Изоляция: модуль скрывает детали (какие subnet, какой CIDR) за интерфейсом (vpc_id, subnet_ids)',
                    'Тестируемость: модуль можно протестировать отдельно (terratest, terraform test)',
                  ],
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Один модуль — три использования',
                  code: '# dev\nmodule "vpc_dev" {\n  source = "./modules/vpc"\n  cidr   = "10.1.0.0/16"\n  env    = "dev"\n}\n\n# staging\nmodule "vpc_staging" {\n  source = "./modules/vpc"\n  cidr   = "10.2.0.0/16"\n  env    = "staging"\n}\n\n# prod\nmodule "vpc_prod" {\n  source = "./modules/vpc"\n  cidr   = "10.0.0.0/16"\n  env    = "prod"\n}',
                },
                { type: 'note', text: 'Антипаттерн: «модуль на каждый ресурс» (модуль aws_instance, модуль aws_s3). Модуль — это логическая группа (VPC + subnets + route tables + NAT), а не обёртка над одним ресурсом. Иначе получается больше кода, чем без модулей.' },
              ],
            },
            {
              id: 'tf-l11-s5',
              title: 'Проверь себя: зачем модули',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Зачем нужны модули в Terraform?',
                options: [
                  { id: 'a', text: 'Переиспользование: один модуль для VPC в 5 проектах' },
                  { id: 'b', text: 'Изоляция: детали скрыты за интерфейсом (inputs → outputs)' },
                  { id: 'c', text: 'Ускорение apply: модули параллелятся' },
                  { id: 'd', text: 'Тестируемость: можно прогнать terratest на модуле отдельно' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Переиспользование (a), изоляция (b), тестируемость (d) — три реальные причины. Ускорение (c) — миф: модули не параллелятся автоматически, это just группировка.',
              },
            },
          ],
        },
        {
          id: 'tf-l12',
          title: 'Создание и использование модуля',
          minutes: 30,
          steps: [
            {
              id: 'tf-l12-s1',
              title: 'Вызов модуля',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Локальный модуль',
                  code: 'module "vpc" {\n  source = "./modules/vpc"\n\n  cidr = "10.0.0.0/16"\n  env  = "prod"\n}\n\n# Использование outputs\nresource "aws_instance" "web" {\n  ami       = "ami-12345"\n  subnet_id = module.vpc.subnet_ids[0]\n}',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Remote модуль из GitHub / Registry',
                  code: '# GitHub, тег v1.2.0\nmodule "vpc" {\n  source = "git::https://github.com/myorg/terraform-vpc.git?ref=v1.2.0"\n  cidr   = "10.0.0.0/16"\n}\n\n# Terraform Registry (публичный)\nmodule "vpc" {\n  source  = "terraform-aws-modules/vpc/aws"\n  version = "~> 5.0"\n\n  name = "my-vpc"\n  cidr = "10.0.0.0/16"\n}',
                },
                { type: 'note', text: 'Для remote-модуля всегда фиксируйте версию: `?ref=v1.2.0` в Git или `version = "~> 5.0"` для Registry. Иначе завтра `terraform init` подтянет новую версию и сломает инфраструктуру.' },
              ],
            },
            {
              id: 'tf-l12-s2',
              title: 'Публичные модули из Registry',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform Registry (registry.terraform.io) — центральный хаб модулей и провайдеров. Самые популярные модули: terraform-aws-modules/vpc/aws, terraform-aws-modules/eks/aws, terraform-aws-modules/rds/aws. Это не «библиотеки», а готовые рецепты инфраструктуры.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'EKS через registry-модуль',
                  code: 'module "eks" {\n  source  = "terraform-aws-modules/eks/aws"\n  version = "~> 20.0"\n\n  cluster_name    = "prod-eks"\n  cluster_version = "1.30"\n\n  vpc_id     = module.vpc.vpc_id\n  subnet_ids = module.vpc.private_subnets\n\n  eks_managed_node_groups = {\n    default = {\n      instance_types = ["t3.medium"]\n      min_size       = 1\n      max_size       = 10\n      desired_size   = 3\n    }\n  }\n}',
                },
                { type: 'note', text: 'Прежде чем писать свой модуль для VPC/EKS/RDS — проверьте Registry. Официальные модули поддерживаются сообществом, протестированы на сотнях проектов. Свой модуль оправдан только если нужна специфичная логика.' },
              ],
            },
            {
              id: 'tf-l12-s3',
              title: 'Проверь себя: версии модуля',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Почему для remote-модуля важно фиксировать версию?',
                options: [
                  { id: 'a', text: 'Чтобы terraform init скачивал стабильную версию, а не последнюю' },
                  { id: 'b', text: 'Чтобы избежать неожиданных breaking changes' },
                  { id: 'c', text: 'Чтобы ускорить apply' },
                  { id: 'd', text: 'Чтобы была воспроизводимость между разработчиками и CI' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Фиксация версии защищает от неожиданного обновления модуля с breaking change. `?ref=v1.2.0` в Git и `version = "~> 5.0"` в Registry — стандарт. Без этого завтра может прилететь 6.0 и всё сломать.',
              },
            },
            {
              id: 'tf-l12-s4',
              title: 'Тестирование модулей: terraform test',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'С версии 1.6 Terraform имеет встроенный фреймворк для тестирования модулей — terraform test. Пишете .tftest.hcl: «при таких inputs должен создаться vpc с таким cidr». Плюс — не нужен terratest на Go.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'modules/vpc/tests/basic.tftest.hcl',
                  code: 'run "create_vpc" {\n  command = apply\n\n  variables {\n    cidr = "10.0.0.0/16"\n    env  = "test"\n  }\n\n  assert {\n    condition     = output.vpc_cidr == "10.0.0.0/16"\n    error_message = "VPC CIDR не совпадает с входным"\n  }\n\n  assert {\n    condition     = length(output.subnet_ids) == 2\n    error_message = "Должно быть 2 subnet, а не ${length(output.subnet_ids)}"\n  }\n}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск',
                  code: '# Из папки модуля\nterraform init\nterraform test\n# Success! 1 passed, 0 failed.',
                },
                { type: 'note', text: 'terraform test создаёт реальные ресурсы (apply) и удаляет их после теста (destroy). Платно (ресурсы существуют минуты), но ловит баги до прода. Альтернатива — terratest (Go), если нужен больше контроль (например, дождаться, пока EC2 станет running).' },
              ],
            },
            {
              id: 'tf-l12-s5',
              title: 'Проверь себя: тестирование',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает terraform test?',
                options: [
                  { id: 'a', text: 'Проверяет синтаксис .tf-файлов (как validate)' },
                  { id: 'b', text: 'Запускает .tftest.hcl: применяет модуль на реальных ресурсах, проверяет assert, потом удаляет' },
                  { id: 'c', text: 'Сравнивает два state' },
                  { id: 'd', text: 'Скачивает провайдеры' },
                ],
                correct: ['b'],
                explanation:
                  'terraform test (1.6+) — встроенный фреймворк тестирования модулей: apply на реальных облачных ресурсах, assert по outputs, destroy. Не путать с validate (синтаксис) и с plan (показать diff).',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m5 — Реальная работа
    // ─────────────────────────────────────────────
    {
      id: 'tf-m5',
      title: 'Реальные провайдеры и импорт',
      lessons: [
        {
          id: 'tf-l13',
          title: 'AWS: VPC, EC2, S3',
          minutes: 35,
          steps: [
            {
              id: 'tf-l13-s1',
              title: 'Провайдер AWS',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Настройка провайдера',
                  code: 'provider "aws" {\n  region = "eu-central-1"\n\n  # Явные credentials (НЕ в коде — через env vars или IAM role)\n  # access_key = var.aws_access_key      # плохо\n  # secret_key = var.aws_secret_key      # плохо\n\n  default_tags {\n    tags = {\n      ManagedBy = "terraform"\n      Project   = "myapp"\n    }\n  }\n}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Credentials через окружение (правильно)',
                  code: 'export AWS_ACCESS_KEY_ID="..."\nexport AWS_SECRET_ACCESS_KEY="..."\nexport AWS_REGION="eu-central-1"\n\n# Или через AWS CLI profile\naws configure --profile terraform\nexport AWS_PROFILE=terraform\n\n# В CI/EKS — через IAM role (лучше всего, нет ключей вообще)',
                },
                { type: 'note', text: 'Никогда не пишите AWS-ключи в .tf-файлы. Используйте env vars (TF_VAR_aws_access_key_id / AWS_ACCESS_KEY_ID), IAM-роли (для EC2/EKS) или OIDC (для GitHub Actions). default_tags — удобно: теги автоматически на все ресурсы.' },
              ],
            },
            {
              id: 'tf-l13-s2',
              title: 'VPC + EC2 + S3',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Типичная база',
                  code: '# VPC\nresource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n  tags = { Name = "main-vpc" }\n}\n\n# Публичная подсеть\nresource "aws_subnet" "public" {\n  vpc_id                  = aws_vpc.main.id\n  cidr_block              = "10.0.1.0/24"\n  map_public_ip_on_launch = true\n  availability_zone       = "eu-central-1a"\n}\n\n# Security group\nresource "aws_security_group" "web" {\n  vpc_id = aws_vpc.main.id\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = "-1"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\n\n# EC2\nresource "aws_instance" "web" {\n  ami                    = data.aws_ami.ubuntu.id\n  instance_type          = "t3.micro"\n  subnet_id              = aws_subnet.public.id\n  vpc_security_group_ids = [aws_security_group.web.id]\n  tags = { Name = "web-1" }\n}\n\n# S3\nresource "aws_s3_bucket" "static" {\n  bucket = "myapp-static-${random_id.suffix.hex}"\n}\n\nresource "random_id" "suffix" {\n  byte_length = 4\n}',
                },
                { type: 'note', text: 'S3 bucket names глобально уникальны — используйте random_id или добавляйте имя проекта/аккаунта. Иначе `BucketAlreadyExists` от чужого проекта. random_id.suffix.hex даёт 8 случайных символов.' },
              ],
            },
            {
              id: 'tf-l13-s3',
              title: 'Проверь себя: credentials',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как правильно передавать AWS credentials в Terraform?',
                options: [
                  { id: 'a', text: 'Захардкодить в main.tf' },
                  { id: 'b', text: 'Через env vars (AWS_ACCESS_KEY_ID) или IAM-роль' },
                  { id: 'c', text: 'В README.md' },
                  { id: 'd', text: 'В git commit message' },
                ],
                correct: ['b'],
                explanation:
                  'Credentials — только через env vars (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY), ~/.aws/credentials, IAM-роль на EC2/EKS или OIDC в CI. В .tf-файлы и в Git — никогда.',
              },
            },
            {
              id: 'tf-l13-s4',
              title: 'data sources: читать существующее',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'data-блоки читают существующую инфраструктуру, не создавая её. Классика: взять актуальный AMI Ubuntu, найти VPC по тегу, прочитать секрет из Secrets Manager. Data source всегда только читает.' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Три полезных data source',
                  code: '# 1. Актуальный AMI Ubuntu\n data "aws_ami" "ubuntu" {\n  most_recent = true\n  owners      = ["099720109477"]   # Canonical\n  filter {\n    name   = "name"\n    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]\n  }\n}\n\n# 2. Существующий VPC по тегу\n data "aws_vpc" "existing" {\n  tags = { Name = "legacy-vpc" }\n}\n\n# 3. Секрет из Secrets Manager\n data "aws_secretsmanager_secret_version" "db" {\n  secret_id = "prod/db/password"\n}\n\n# Использование:\n# data.aws_ami.ubuntu.id\n# data.aws_vpc.existing.id\n# data.aws_secretsmanager_secret_version.db.secret_string',
                },
                {
                  type: 'list',
                  items: [
                    'data — только читает, никогда не создаёт и не удаляет',
                    'Классика: AMI (актуальный), VPC (существующий), Secrets Manager',
                    'Читается при plan и apply — значение может меняться между запусками',
                    'В state сохраняется только то, что прочитали (не управляется Terraform)',
                  ],
                },
                { type: 'note', text: 'Антипаттерн: `data "aws_ami"` без most_recent = true и без фильтра — вы получите «первую попавшуюся» AMI, и каждый apply может создавать новый EC2. Всегда фильтруйте по имени + owner.' },
              ],
            },
            {
              id: 'tf-l13-s5',
              title: 'Проверь себя: data sources',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что верно про data-блоки в Terraform?',
                options: [
                  { id: 'a', text: 'Только читают существующую инфраструктуру, не создают' },
                  { id: 'b', text: 'Классика: актуальный AMI, существующий VPC, секрет из Secrets Manager' },
                  { id: 'c', text: 'Создают дубликат ресурса в state' },
                  { id: 'd', text: 'Читаются при plan и apply, значение может меняться' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'data — read-only (a), классические примеры (b), значение перечитывается (d). Дубликат в state (c) — неверно: data не управляет ресурсом, только читает. Если нужен «снимок» — `lifecycle { ignore_changes }` на ресурсе, но это другое.',
              },
            },
          ],
        },
        {
          id: 'tf-l14',
          title: 'Импорт существующих ресурсов',
          minutes: 30,
          steps: [
            {
              id: 'tf-l14-s1',
              title: 'terraform import',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Сценарий: в AWS руками создан bucket/EC2. Теперь нужно взять его под управление Terraform, не пересоздавая. terraform import добавляет существующий ресурс в state. Но конфиг .tf всё равно надо написать руками — Terraform не сгенерирует его.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Классический import',
                  code: '# 1. Написать .tf-конфиг вручную\ncat > s3.tf <<EOF\nresource "aws_s3_bucket" "existing" {\n  bucket = "my-existing-bucket"\n}\nEOF\n\n# 2. Импортировать в state\nterraform import aws_s3_bucket.existing my-existing-bucket\n\n# 3. Проверить, что plan пустой\nterraform plan\n# No changes. Your infrastructure matches the configuration.',
                },
                { type: 'note', text: 'Раньше import был болью: импортируешь, а plan показывает кучу diff (потому что конфиг не совпадает с реальностью). Terraform 1.5+ добавил import-блоки — можно импортировать прямо в конфиге.' },
              ],
            },
            {
              id: 'tf-l14-s2',
              title: 'import-блоки (Terraform 1.5+)',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'import-блок',
                  code: '# import.tf\nimport {\n  to = aws_s3_bucket.existing\n  id = "my-existing-bucket"\n}\n\nresource "aws_s3_bucket" "existing" {\n  bucket = "my-existing-bucket"\n}',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверить и применить',
                  code: '# plan покажет: 1 to import, 0 to add, 0 to change, 0 to destroy\nterraform plan\n\n# Применить — ресурс попадёт в state\nterraform apply\n\n# Если plan показывает diff — поправить .tf-конфиг\n# (Terraform 1.7+ умеет генерировать конфиг: terraform plan -generate-config-out=imported.tf)',
                },
                { type: 'note', text: '`terraform plan -generate-config-out=new.tf` — killer feature 1.7+: Terraform сам сгенерирует .tf-конфиг для импортируемого ресурса. Останется только убрать лишнее. Это резко снижает порог входа в import.' },
              ],
            },
            {
              id: 'tf-l14-s3',
              title: 'Проверь себя: import',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает terraform import?',
                options: [
                  { id: 'a', text: 'Создаёт новый ресурс в облаке' },
                  { id: 'b', text: 'Добавляет существующий ресурс в state, чтобы Terraform начал им управлять' },
                  { id: 'c', text: 'Удаляет ресурс из облака' },
                  { id: 'd', text: 'Скачивает конфиг из облака' },
                ],
                correct: ['b'],
                explanation:
                  'import — «взять под управление». Ресурс уже существует (создан руками/другим инструментом), Terraform добавляет его в state. Конфиг .tf пишется отдельно (или генерируется через -generate-config-out).',
              },
            },
            {
              id: 'tf-l14-s4',
              title: 'moved-блоки: переименование без потерь',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Отдельная боль: переименовать ресурс в конфиге (aws_instance.web → aws_instance.frontend). Без moved-блока Terraform увидит «удалить web, создать frontend» — то есть пересоздаст EC2. moved-блок говорит: «это тот же ресурс, просто переименовали».' },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'moved-блок (Terraform 1.1+)',
                  code: '# Было: resource "aws_instance" "web" { ... }\n# Стало: resource "aws_instance" "frontend" { ... }\n\nmoved {\n  from = aws_instance.web\n  to   = aws_instance.frontend\n}\n\n# Terraform при plan покажет:\n# aws_instance.web has moved to aws_instance.frontend',
                },
                {
                  type: 'list',
                  items: [
                    'moved — «переименование без пересоздания»',
                    'Полезно при рефакторинге конфигов (web → frontend)',
                    'Работает для любого ресурса и для module',
                    'Без moved — Terraform пересоздаст ресурс (потенциальная потеря данных)',
                    'После успешного apply moved-блок можно удалить (он уже сработал)',
                  ],
                },
                { type: 'note', text: 'В командах с долгой историей — moved-блоки живут в отдельном файле moved.tf и накапливаются. Это дешёвая страховка от «а почему EC2 пересоздался?». На собеседовании middle DevOps спросят.' },
              ],
            },
            {
              id: 'tf-l14-s5',
              title: 'Проверь себя: moved',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен moved-блок?',
                options: [
                  { id: 'a', text: 'Переместить state между backend' },
                  { id: 'b', text: 'Переименовать ресурс в конфиге без пересоздания' },
                  { id: 'c', text: 'Переместить ресурс в другой регион' },
                  { id: 'd', text: 'Удалить ресурс' },
                ],
                correct: ['b'],
                explanation:
                  'moved сообщает Terraform: «это тот же ресурс, просто новое имя». Без него при переименовании Terraform выполнит `-/+` (удалить и создать). С moved — просто обновит state, ресурс продолжит жить.',
              },
            },
          ],
        },
        {
          id: 'tf-l15',
          title: 'Best practices: fmt, validate, tflint',
          minutes: 30,
          steps: [
            {
              id: 'tf-l15-s1',
              title: 'Встроенные инструменты',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'fmt, validate, plan',
                  code: '# Форматирование (2 пробела, выравнивание =)\nterraform fmt -recursive\n\n# Валидация синтаксиса (без обращения к облаку)\nterraform validate\n\n# Проверка плана\nterraform plan -detailed-exitcode\n# 0 — нет изменений, 1 — ошибка, 2 — есть изменения (для CI)',
                },
                {
                  type: 'list',
                  items: [
                    'terraform fmt — стандартизирует форматирование, убирает разногласия в команде',
                    'terraform validate — ловит синтаксические ошибки и опечатки в аргументах',
                    'terraform plan -detailed-exitcode — удобно в CI: упасть, если есть drift',
                    'Всё это — бесплатно и встроено в Terraform',
                  ],
                },
              ],
            },
            {
              id: 'tf-l15-s2',
              title: 'tflint, checkov, terraform-docs',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Дополнительные инструменты',
                  head: ['Инструмент', 'Что проверяет', 'Установка'],
                  rows: [
                    ['tflint', 'Провайдер-специфичные правила (устаревшие типы EC2, invalid instance types)', 'brew install tflint'],
                    ['checkov', 'Security: открытые S3, публичные security groups', 'pip install checkov'],
                    ['tfsec', 'Security (альтернатива checkov, встроен в trivy)', 'brew install tfsec'],
                    ['terraform-docs', 'Автогенерация README из variables/outputs', 'brew install terraform-docs'],
                    ['infracost', 'Сколько будет стоить apply', 'brew install infracost'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Типичный pre-commit',
                  code: 'terraform fmt -check -recursive\ntflint --recursive\ncheckov -d . --framework terraform\nterraform validate\ntrivy config .   # если используете trivy',
                },
                { type: 'note', text: 'tflint и checkov — самые важные. tflint ловит провайдер-специфичные ошибки (t3.nano не существует в регионе). checkov — security (публичный S3, открытый 22 порт). infracost — «сколько это будет стоить» до apply.' },
              ],
            },
            {
              id: 'tf-l15-s3',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие инструменты проверяют безопасность Terraform-конфигов?',
                options: [
                  { id: 'a', text: 'checkov' },
                  { id: 'b', text: 'tfsec' },
                  { id: 'c', text: 'terraform-docs' },
                  { id: 'd', text: 'tflint' },
                ],
                correct: ['a', 'b'],
                explanation:
                  'checkov и tfsec — security-сканеры: публичные S3, открытые порты, отсутствие шифрования. terraform-docs — генерация документации. tflint — провайдер-специфичные правила (не security в первую очередь).',
              },
            },
            {
              id: 'tf-l15-s4',
              title: 'Структура репозитория Terraform',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Terraform-проект — это не «папка с .tf-файлами». Стандартная структура делает его воспроизводимым между командами и окружениями.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Типичная структура',
                  code: 'infra/\n├── modules/           # переиспользуемые модули\n│   ├── vpc/\n│   ├── eks/\n│   └── rds/\n├── envs/\n│   ├── dev/\n│   │   ├── main.tf\n│   │   ├── backend.tf\n│   │   ├── terraform.tfvars\n│   │   └── versions.tf\n│   ├── staging/\n│   └── prod/\n├── .tflint.hcl\n├── .pre-commit-config.yaml\n└── README.md',
                },
                {
                  type: 'list',
                  items: [
                    'modules/ — без state, только код (переиспользуется)',
                    'envs/<env>/ — со своим backend.tf и terraform.tfvars',
                    'versions.tf — required_providers, версия Terraform',
                    '.tflint.hcl — конфиг линтера',
                    '.pre-commit-config.yaml — fmt + tflint + checkov в git pre-commit',
                  ],
                },
                { type: 'note', text: 'Антипаттерн: всё в одном main.tf на 500 строк. Читать невозможно, править страшно. Разделяйте: backend.tf, providers.tf, variables.tf, main.tf, outputs.tf — по назначению, а не «всё в кучу».' },
              ],
            },
            {
              id: 'tf-l15-s5',
              title: 'Проверь себя: структура',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте папку/файл и его назначение',
                pairs: [
                  { left: 'modules/', right: 'Переиспользуемые модули без state' },
                  { left: 'envs/prod/', right: 'Окружение prod со своим backend.tf' },
                  { left: 'versions.tf', right: 'required_providers и версия Terraform' },
                  { left: '.pre-commit-config.yaml', right: 'fmt + tflint + checkov в pre-commit' },
                ],
                explanation:
                  'modules/ — код. envs/<env>/ — окружение со своим state. versions.tf — версии провайдеров. pre-commit — автоматические проверки до коммита. Стандартная структура — половина успеха при работе в команде.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m6 — CI/CD и безопасность
    // ─────────────────────────────────────────────
    {
      id: 'tf-m6',
      title: 'Terraform в CI/CD',
      lessons: [
        {
          id: 'tf-l16',
          title: 'Pipeline: plan в PR, apply в main',
          minutes: 30,
          steps: [
            {
              id: 'tf-l16-s1',
              title: 'Типичный CI-flow',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'PR: plan, main: apply',
                  code: 'graph LR\n  PR["Pull Request"] --> Plan["terraform plan<br/>(комментарий в PR)"]\n  Plan --> Review["Ревью diff"]\n  Review --> Merge["Merge в main"]\n  Merge --> Apply["terraform apply<br/>(saved plan)"]\n  Apply --> State[("Remote state<br/>S3 + lock")]',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.github/workflows/terraform.yml',
                  code: 'name: Terraform\non:\n  pull_request:\n    paths: ["infra/**"]\n  push:\n    branches: [main]\n    paths: ["infra/**"]\n\njobs:\n  plan:\n    if: github.event_name == \'pull_request\'\n    runs-on: ubuntu-latest\n    defaults: { run: { working-directory: infra } }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: hashicorp/setup-terraform@v3\n        with: { terraform_version: 1.9.0 }\n      - run: terraform init\n      - run: terraform fmt -check -recursive\n      - run: terraform validate\n      - run: terraform plan -out=tfplan\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n      - uses: actions/upload-artifact@v4\n        with: { name: tfplan, path: infra/tfplan }\n\n  apply:\n    if: github.ref == \'refs/heads/main\' && github.event_name == \'push\'\n    runs-on: ubuntu-latest\n    environment: production\n    defaults: { run: { working-directory: infra } }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: hashicorp/setup-terraform@v3\n      - run: terraform init\n      - run: terraform apply -auto-approve\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}',
                },
                { type: 'note', text: 'Правило: plan на PR (для ревью), apply только на main. И apply должен применяться к тому же плану, что ревьюили. С `-out=tfplan` и артефактом — plan и apply гарантированно совпадают.' },
              ],
            },
            {
              id: 'tf-l16-s2',
              title: 'Atlantis и Terraform Cloud',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Atlantis (open-source) — self-hosted бот: `atlantis plan` в PR, `atlantis apply` после approve',
                    'Terraform Cloud / Enterprise — managed: plan/apply в UI, policy as code (Sentinel), audit',
                    'Spacelift, Env0, Scalr — коммерческие альтернативы',
                    'GitLab CI — встроенный Terraform-образ, легко',
                  ],
                },
                { type: 'note', text: 'Atlantis — стандарт для команд, которые хотят «plan в PR» без ручных комментариев. Terraform Cloud — если не хотите свой backend и CI. В маленьких проектах — GitHub Actions + S3 backend работает отлично.' },
              ],
            },
            {
              id: 'tf-l16-s3',
              title: 'Проверь себя: план и apply',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему apply рекомендуется только на main, а не на каждом PR?',
                options: [
                  { id: 'a', text: 'Terraform не работает в PR' },
                  { id: 'b', text: 'Чтобы несколько PR не конкурировали за state и изменения ревьюились до применения' },
                  { id: 'c', text: 'Это требование S3' },
                  { id: 'd', text: 'В PR нет доступа к AWS' },
                ],
                correct: ['b'],
                explanation:
                  'Если apply в PR — 5 PR одновременно попытаются менять state, конфликты и race conditions. Плюс изменения должны пройти ревью. Стандарт: plan в PR (для review), apply в main (после merge).',
              },
            },
            {
              id: 'tf-l16-s4',
              title: 'OIDC: без долгоживущих ключей',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Классика: AWS_ACCESS_KEY_ID в GitHub Secrets. Плохо — ключ живёт годами, утечёт — катастрофа. OIDC: GitHub Actions генерирует JWT на время job-а, AWS проверяет и выдаёт временные креды на 1 час. Нет ключей — нечего красть.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions + OIDC → AWS',
                  code: 'permissions:\n  id-token: write   # обязательно для OIDC\n  contents: read\n\nsteps:\n  - uses: aws-actions/configure-aws-credentials@v4\n    with:\n      role-to-assume: arn:aws:iam::123456789:role/GitHubTerraform\n      aws-region: eu-central-1\n  - run: terraform apply -auto-approve\n  # Никаких AWS_ACCESS_KEY_ID в secrets!',
                },
                {
                  type: 'list',
                  items: [
                    'OIDC — JWT на 5 минут → временные креды на 1 час',
                    'Нет долгоживущих ключей в GitHub Secrets',
                    'В IAM-роль — trust policy на конкретный репозиторий и ветку',
                    'Так же работает для GCP и Azure (Workload Identity Federation)',
                  ],
                },
                { type: 'note', text: 'В 2025 OIDC — стандарт для CI → cloud. «Положить ключ в GitHub Secrets, они же шифрованы» — устаревший ответ. Ключ живёт годами, утечка = катастрофа. OIDC: утёк — истёк через час.' },
              ],
            },
            {
              id: 'tf-l16-s5',
              title: 'Проверь себя: OIDC',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему OIDC безопаснее долгоживущих AWS-ключей в GitHub Secrets?',
                options: [
                  { id: 'a', text: 'OIDC быстрее' },
                  { id: 'b', text: 'Выдаёт временные креды (1 час), а не ключ на годы — утечка ограничена по времени' },
                  { id: 'c', text: 'GitHub Secrets не шифрует' },
                  { id: 'd', text: 'OIDC не требует интернета' },
                ],
                correct: ['b'],
                explanation:
                  'Долгоживущий ключ утёк — катастрофа на годы. OIDC: JWT на 5 минут, креды на 1 час. Утекли — истекут. Плюс в IAM trust policy — только конкретный репозиторий/ветка. Стандарт для CI в 2025.',
              },
            },
          ],
        },
        {
          id: 'tf-l17',
          title: 'Drift detection и безопасность',
          minutes: 25,
          steps: [
            {
              id: 'tf-l17-s1',
              title: 'Drift: что это и как ловить',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Drift — расхождение между state и реальной инфраструктурой. Кто-то поменял security group руками в консоли, или удалил EC2, а state этого не знает. Terraform при следующем plan покажет diff и «починит» (пересоздаст или вернёт настройки).' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка drift',
                  code: '# В CI — периодический plan\nterraform plan -detailed-exitcode\n# 0 — нет изменений\n# 2 — есть drift, надо разобраться\n\n# Полное обновление state (небезопасно, но иногда нужно)\nterraform refresh\n# Лучше: terraform apply -refresh-only',
                },
                { type: 'note', text: 'Лучший способ ловить drift — ежедневный plan в CI. Если ночью plan показал diff, а PR не было — кто-то поменял руками. Алерт в Slack. Это стандарт в зрелых командах.' },
              ],
            },
            {
              id: 'tf-l17-s2',
              title: 'Секреты в Terraform',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Не хардкодить секреты в .tf — только через переменные / env vars',
                    'sensitive = true на переменных и outputs — скрывает из plan/log',
                    'State всё равно содержит секреты — только зашифрованный backend',
                    'HashiCorp Vault provider — секреты из Vault в Terraform',
                    'AWS Secrets Manager / GCP Secret Manager — через data sources',
                    'Никогда не коммитить terraform.tfvars с секретами — только .tfvars.example',
                  ],
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'Секреты из внешнего хранилища',
                  code: '# AWS Secrets Manager\ndata "aws_secretsmanager_secret_version" "db" {\n  secret_id = "prod/db/password"\n}\n\nresource "aws_db_instance" "main" {\n  # ...\n  password = data.aws_secretsmanager_secret_version.db.secret_string\n}\n\n# HashiCorp Vault\ndata "vault_generic_secret" "db" {\n  path = "secret/prod/db"\n}\n\nresource "aws_db_instance" "main" {\n  password = data.vault_generic_secret.db.data["password"]\n}',
                },
              ],
            },
            {
              id: 'tf-l17-s3',
              title: 'Проверь себя: секреты',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики безопасной работы с секретами в Terraform?',
                options: [
                  { id: 'a', text: 'Передавать секреты через env vars / Vault / Secrets Manager' },
                  { id: 'b', text: 'Использовать sensitive = true для переменных' },
                  { id: 'c', text: 'Коммитить terraform.tfvars с паролями в Git' },
                  { id: 'd', text: 'Хранить state в зашифрованном backend' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'Секреты — только через внешние хранилища (Vault, Secrets Manager) или env vars. sensitive = true скрывает из логов. State — обязательно в зашифрованном backend (S3 с SSE). Коммитить .tfvars с паролями — катастрофа.',
              },
            },
            {
              id: 'tf-l17-s4',
              title: 'sensitive и state: тонкости',
              type: 'theory',
              blocks: [
                { type: 'p', text: '`sensitive = true` — это косметика: он скрывает значение в выводе plan/apply, но в state оно всё равно лежит открытым текстом. Шифрование state (S3 SSE, GCS CMEK) — обязательное, а не «желательное».' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверить state на секреты',
                  code: '# state в plain text (JSON), можно грепнуть\nterraform show -json | jq \'.. | strings\' | grep -i "password"   # утечка\n\n# Проверить, что S3 bucket зашифрован\naws s3api get-bucket-encryption --bucket my-tf-state\n\n# Проверить versioning (для отката)\naws s3api get-bucket-versioning --bucket my-tf-state',
                },
                {
                  type: 'list',
                  items: [
                    'sensitive = true — скрывает из plan/log, но не из state',
                    'State — всегда шифруется (S3 SSE-KMS, GCS CMEK, Azure SSE)',
                    'Доступ к state — только у CI и админов (IAM policy на bucket)',
                    'Регулярно проверяйте: кто имеет доступ к S3 bucket со state',
                    'Для аудита — CloudTrail access logs на bucket',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «Как защитить секреты в Terraform?» — «Vault/Secrets Manager для доступа, sensitive для логов, шифрованный backend для state, ограниченный IAM». Ответ «положить в tfvars» — мимо.' },
              ],
            },
            {
              id: 'tf-l17-s5',
              title: 'Проверь себя: sensitive',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `sensitive = true` на переменной?',
                options: [
                  { id: 'a', text: 'Шифрует значение в state' },
                  { id: 'b', text: 'Скрывает значение в plan/apply, но в state оно остаётся открытым (state нужно шифровать отдельно)' },
                  { id: 'c', text: 'Запрещает использование переменной' },
                  { id: 'd', text: 'Удаляет переменную после apply' },
                ],
                correct: ['b'],
                explanation:
                  'sensitive — только маскировка в выводе. В state значение лежит plain text (JSON). Поэтому state ОБЯЗАТЕЛЬНО в зашифрованном backend. sensitive + незашифрованный backend = утечка.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m7 — Практикум
    // ─────────────────────────────────────────────
    {
      id: 'tf-m7',
      title: 'Практикум',
      lessons: [
        {
          id: 'tf-l18',
          title: 'Практика: полный сценарий',
          minutes: 35,
          steps: [
            {
              id: 'tf-l18-s1',
              title: 'Разбор реального проекта',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура проекта',
                  code: 'myapp-infra/\n├── modules/\n│   ├── vpc/           # общий модуль VPC\n│   ├── eks/           # модуль EKS\n│   └── rds/           # модуль RDS\n├── envs/\n│   ├── dev/\n│   │   ├── main.tf    # вызов модулей\n│   │   ├── backend.tf # S3: dev/terraform.tfstate\n│   │   └── terraform.tfvars\n│   ├── staging/\n│   │   └── ...\n│   └── prod/\n│       ├── main.tf\n│       ├── backend.tf # S3: prod/terraform.tfstate\n│       └── terraform.tfvars\n└── README.md',
                },
                {
                  type: 'code',
                  lang: 'hcl',
                  caption: 'envs/prod/main.tf',
                  code: 'module "vpc" {\n  source  = "../../modules/vpc"\n  cidr    = "10.0.0.0/16"\n  env     = "prod"\n}\n\nmodule "rds" {\n  source     = "../../modules/rds"\n  vpc_id     = module.vpc.vpc_id\n  subnet_ids = module.vpc.private_subnet_ids\n  env        = "prod"\n\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n\nmodule "eks" {\n  source  = "../../modules/eks"\n  vpc_id  = module.vpc.vpc_id\n  env     = "prod"\n  version = "1.30"\n}',
                },
                {
                  type: 'list',
                  items: [
                    'modules/ — переиспользуемые модули (без state)',
                    'envs/dev, envs/staging, envs/prod — по своему state в S3',
                    'backend.tf — ссылка на S3 (разные key для окружений)',
                    'terraform.tfvars — параметры окружения (не секреты!)',
                    'CI: plan в PR (для каждого envs/*), apply в main',
                  ],
                },
              ],
            },
            {
              id: 'tf-l18-s2',
              title: 'Проверь себя: команды',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делать в первую очередь перед `terraform apply` на проде?',
                options: [
                  { id: 'a', text: 'Сразу применить — быстрее' },
                  { id: 'b', text: 'Посмотреть `terraform plan` — что именно изменится' },
                  { id: 'c', text: 'Удалить state' },
                  { id: 'd', text: 'Запустить apply с -auto-approve' },
                ],
                correct: ['b'],
                explanation:
                  'Plan — обязательный шаг перед apply, особенно на проде. Он показывает: + создать, ~ изменить, - удалить. Если plan неожиданно удаляет БД — вы это увидите и остановитесь. `-auto-approve` без plan — «выстрел в ногу».',
              },
            },
            {
              id: 'tf-l18-s3',
              title: 'Проверь себя: state',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда скачивает провайдеры и инициализирует backend перед первым `terraform plan`?',
                accepted: ['terraform init', 'init'],
                placeholder: 'terraform ...',
                hint: 'от английского «инициализировать»',
                explanation:
                  'terraform init — первая команда в любом новом проекте: скачивает провайдеры, настраивает backend, создаёт .terraform.lock.hcl. Без неё plan/apply не работают.',
              },
            },
            {
              id: 'tf-l18-s4',
              title: 'Типичные ошибки новичков',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Пять ошибок, на которых «спотыкаются» почти все, кто начинает с Terraform в команде. Каждая из них — реальный инцидент в проде или час отладки.' },
                {
                  type: 'list',
                  items: [
                    'Локальный state в Git — утечка секретов. Фикс: S3 + DynamoDB (remote backend)',
                    'Нет versioning в S3 — потеряли state, не откатить. Фикс: включить versioning',
                    'Apply без plan на проде — сюрпризы. Фикс: всегда plan + review + saved plan',
                    'Секреты в .tfvars / .tf — утечка. Фикс: env vars / Vault / Secrets Manager',
                    'Нет concurrency в CI — два apply одновременно, state lock. Фикс: concurrency group',
                  ],
                },
                { type: 'note', text: 'Также: `-target` для «быстро поправить» — зло. Он оставляет state в рассогласованном виде (часть ресурсов вне state). Используйте только в крайнем случае, потом — полный apply.' },
              ],
            },
            {
              id: 'tf-l18-s5',
              title: 'Проверь себя: антипаттерны',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики считаются антипаттернами в Terraform?',
                options: [
                  { id: 'a', text: 'Хранить локальный terraform.tfstate в Git' },
                  { id: 'b', text: 'Применять `terraform apply` без предварительного `plan` на проде' },
                  { id: 'c', text: 'Использовать remote backend с блокировкой' },
                  { id: 'd', text: 'Использовать `-target` для «быстрого фикса» в проде' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'State в Git — утечка (a). Apply без plan — сюрпризы (b). -target — рассогласованный state (d). Remote backend с блокировкой (c) — наоборот, правильная практика, а не антипаттерн.',
              },
            },
          ],
        },
      ],
    },
  ],
};