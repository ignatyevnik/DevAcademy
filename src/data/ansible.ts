import type { Course } from './types';

export const ansibleBasicsCourse: Course = {
  slug: 'ansible-basics',
  title: 'Ansible: конфигурация и автоматизация',
  subtitle: 'Inventory, playbooks, роли, Jinja2, vault, collections и molecule',
  description:
    'Ansible — де-факто стандарт configuration management без агентов: только SSH и Python на целевых хостах. Курс объясняет, как описывать состояние серверов в playbooks и ролях: inventory (INI/YAML), ad-hoc команды, модули и handlers, идемпотентность, переменные и приоритеты, Jinja2-шаблоны, ansible-vault, collections и ansible-galaxy, strategies и delegate_to, тестирование через molecule и ansible-lint. Практикум — полный сценарий: nginx + БД + деплой приложения.',
  level: 'Средний',
  tags: ['Ansible', 'DevOps', 'Configuration Management', 'IaC'],
  accent: '#EE0000',
  icon: 'ansible',
  outcomes: [
    'Объяснять, чем Ansible отличается от Chef/Puppet и почему он agentless',
    'Писать inventory (INI/YAML) и группировать хосты',
    'Писать playbooks: tasks, handlers, notify, идемпотентность',
    'Использовать переменные, register, when, циклы',
    'Создавать роли по стандартной структуре и переиспользовать их',
    'Писать Jinja2-шаблоны и управлять файлами (template, copy, file)',
    'Понимать приоритет переменных и шифровать секреты через ansible-vault',
    'Подключать collections и ставить их через ansible-galaxy',
    'Использовать strategies, delegate_to, serial, run_once',
    'Тестировать роли через molecule и ansible-lint',
  ],
  requirements: [
    'Уверенная работа в Linux и SSH (курс Linux)',
    'Базовое понимание YAML',
    'Несколько VM или Docker-контейнеров для практики (опционально)',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы
    // ─────────────────────────────────────────────
    {
      id: 'ans-m1',
      title: 'Основы Ansible',
      lessons: [
        {
          id: 'ans-l1',
          title: 'Что такое Ansible и зачем он нужен',
          minutes: 20,
          steps: [
            {
              id: 'ans-l1-s1',
              title: 'Agentless и push-модель',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Ansible — система управления конфигурациями (configuration management). Ключевое отличие от Chef, Puppet, SaltStack: **agentless** — на целевых хостах не нужно устанавливать агент. Только SSH и Python (обычно уже есть). Это резко снижает порог входа: не надо «сначала настроить агент, чтобы он настроил остальное».',
                },
                {
                  type: 'mermaid',
                  caption: 'Push-модель: control node → managed hosts через SSH',
                  code: `graph LR
                    Control["Control node<br/>(ansible-playbook)"] -->|"SSH + Python"| H1["Managed host 1"]
                    Control -->|"SSH + Python"| H2["Managed host 2"]
                    Control -->|"SSH + Python"| H3["Managed host 3"]
                    Local["localhost<br/>(опционально)"] -.-> Control`,
                },
                {
                  type: 'table',
                  caption: 'Ansible vs альтернативы',
                  head: ['Инструмент', 'Модель', 'Агент на хосте'],
                  rows: [
                    ['Ansible', 'Push (SSH)', 'Нет (agentless)'],
                    ['Chef', 'Pull (агент опрашивает сервер)', 'Да (chef-client)'],
                    ['Puppet', 'Pull (агент опрашивает сервер)', 'Да (puppet-agent)'],
                    ['SaltStack', 'И push, и pull', 'Опционально (salt-minion)'],
                  ],
                },
                {
                  type: 'note',
                  text: 'Push-модель проще для аудита: «кто запустил, что изменилось, в какое время». Pull-модель удобна для сотен тысяч машин (агент сам приходит за конфигом), но Ansible тоже масштабируется через AWX/Tower и ansible-pull.',
                },
              ],
            },
            {
              id: 'ans-l1-s2',
              title: 'Идемпотентность и декларативность',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Ansible описывает **желаемое состояние**: «пакет nginx должен быть установлен», «файл /etc/nginx/nginx.conf должен содержать такой-то контент». Если состояние уже такое — задача вернёт `ok` и **ничего не сделает**. Если отличается — вернёт `changed` и приведёт к желаемому. Это и есть идемпотентность.',
                },
                {
                  type: 'mermaid',
                  caption: 'Идемпотентность: повторный запуск не меняет систему',
                  code: `graph LR
                    R1["1-й запуск"] -->|"changed"| S["nginx установлен,<br/>конфиг на месте"]
                    R2["2-й запуск"] -->|"ok (без изменений)"| S
                    R3["3-й запуск"] -->|"ok"| S`,
                },
                {
                  type: 'list',
                  items: [
                    'Модули Ansible спроектированы идемпотентно: `apt: name=nginx state=present` проверит, установлен ли пакет',
                    'Custom shell-скрипты — НЕ идемпотентны: `shell: apt install nginx` выполнится каждый раз',
                    'Правило: используйте модули, а не `shell`/`command`, где возможно',
                    'Если без shell не обойтись — добавляйте `creates:` или `changed_when:` для идемпотентности',
                  ],
                },
                {
                  type: 'note',
                  text: 'Идемпотентность — главное отличие Ansible от shell-скриптов. Скрипт «настроить сервер» при повторном запуске может что-то сломать. Playbook — нет: он приведёт систему к состоянию и остановится. На собеседовании: «чем Ansible лучше bash-скрипта?» — ответ про идемпотентность.',
                },
              ],
            },
            {
              id: 'ans-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое идемпотентность в контексте Ansible?',
                options: [
                  { id: 'a', text: 'Задача выполняется быстрее при повторном запуске' },
                  { id: 'b', text: 'Повторный запуск не меняет систему, если она уже в желаемом состоянии' },
                  { id: 'c', text: 'Ansible не требует SSH' },
                  { id: 'd', text: 'Задачи выполняются параллельно' },
                ],
                correct: ['b'],
                explanation:
                  'Идемпотентность — «повторный запуск безопасен». Если nginx уже установлен и конфиг совпадает — задача вернёт `ok` и ничего не изменит. Shell-команды этим не обладают, поэтому в Ansible предпочитают модули, а не `shell`/`command`.',
              },
            },
          ],
        },
        {
          id: 'ans-l2',
          title: 'Inventory: хосты и группы',
          minutes: 25,
          steps: [
            {
              id: 'ans-l2-s1',
              title: 'INI-формат',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'inventory.ini',
                  code: `# Отдельные хосты\nweb1.example.com\nweb2.example.com ansible_user=deploy ansible_port=2222\n\n# Группы\n[web]\nweb1.example.com\nweb2.example.com\n\n[db]\ndb1.example.com\n\n# Группа групп\n[production:children]\nweb\ndb\n\n# Переменные для всех в группе\n[web:vars]\nansible_user=deploy\nhttp_port=80`,
                },
                {
                  type: 'list',
                  items: [
                    'Хост — конкретная машина: `web1.example.com` или `192.168.1.10`',
                    'Группа — `[web]`, `[db]`, `[production:children]`',
                    'Переменные хоста — на той же строке: `web2.example.com ansible_user=deploy`',
                    'Переменные группы — секция `[group:vars]`',
                    'Спецгруппы: `all` (все хосты), `ungrouped` (не в группах)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Inventory может быть динамическим: из AWS (aws_ec2), GCP (gcp_compute), Kubernetes — плагины сами находят хосты по тегам. Это стандарт в облаке. Статический INI — для маленьких фиксированных окружений.',
                },
              ],
            },
            {
              id: 'ans-l2-s2',
              title: 'YAML-формат и проверка',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'inventory.yml',
                  code: `all:\n  children:\n    web:\n      hosts:\n        web1.example.com:\n        web2.example.com:\n          ansible_user: deploy\n          ansible_port: 2222\n      vars:\n        http_port: 80\n    db:\n      hosts:\n        db1.example.com:\n    production:\n      children:\n        web:\n        db:`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверить inventory',
                  code: `# Список всех хостов\nansible-inventory -i inventory.ini --list\n\n# Граф групп\nansible-inventory -i inventory.ini --graph\n\n# Пинг всех хостов (проверка SSH и Python)\nansible all -i inventory.ini -m ping\n\n# ad-hoc: uptime\nansible web -i inventory.ini -m command -a "uptime"`,
                },
                {
                  type: 'note',
                  text: '`ansible all -m ping` — первое, что нужно запустить на новом inventory. Если ping не проходит — проблема в SSH-ключах, `ansible_user`, или отсутствии Python на целевых хостах. Дальше идти нет смысла.',
                },
              ],
            },
            {
              id: 'ans-l2-s3',
              title: 'Проверь себя: inventory',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает команда `ansible all -i inventory.ini -m ping`?',
                options: [
                  { id: 'a', text: 'Пингует через ICMP (как ping)' },
                  { id: 'b', text: 'Проверяет SSH-подключение и наличие Python на всех хостах через модуль ping' },
                  { id: 'c', text: 'Устанавливает пакет ping' },
                  { id: 'd', text: 'Проверяет DNS' },
                ],
                correct: ['b'],
                explanation:
                  'Модуль `ping` в Ansible — это не ICMP, а проверка: подключаемся по SSH, запускаем Python и возвращаем `pong`. Если не проходит — проблема в SSH-доступе, ключах или Python.',
              },
            },
            {
              id: 'ans-l2-s4',
              title: 'Проверь себя: группы',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая специальная группа содержит ВСЕ хосты в inventory?',
                accepted: ['all'],
                placeholder: 'одно слово',
                hint: 'по-английски «все»',
                explanation:
                  'Группа `all` есть всегда, в неё входят все хосты. Ещё есть `ungrouped` — хосты, не попавшие ни в какую группу. `ansible all -m ping` = «на все хосты».',
              },
            },
          ],
        },
        {
          id: 'ans-l3',
          title: 'Ad-hoc команды',
          minutes: 20,
          steps: [
            {
              id: 'ans-l3-s1',
              title: 'Синтаксис',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Ad-hoc',
                  code: `# Общий синтаксис\nansible <pattern> -i inventory -m <module> -a "<args>"\n\n# Проверка uptime\nansible web -i inventory.ini -m command -a "uptime"\n\n# Установить пакет\nansible web -i inventory.ini -m apt -a "name=nginx state=present" --become\n\n# Создать пользователя\nansible all -i inventory.ini -m user -a "name=deploy state=present"\n\n# Скопировать файл\nansible web -m copy -a "src=./app.py dest=/opt/app.py mode=0644"`,
                },
                {
                  type: 'list',
                  items: [
                    '`pattern` — `all`, `web`, `web:db` (объединение), `web:&production` (пересечение)',
                    '`-m` — модуль (`apt`, `yum`, `copy`, `template`, `service`, `user`, `command`, `shell`)',
                    '`-a` — аргументы модуля в формате `key=value`',
                    '`--become` — выполнить с sudo (аналог `-b`)',
                    '`-i` — путь к inventory',
                    '`-u` — SSH-пользователь',
                  ],
                },
                {
                  type: 'note',
                  text: 'Ad-hoc удобны для разовых операций: «проверить uptime», «установить пакет на 3 сервера», «посмотреть свободное место». Для повторяемых задач — playbook. Правило: если делаете ad-hoc дважды — пора писать playbook.',
                },
              ],
            },
            {
              id: 'ans-l3-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `ansible all -m apt -a "name=nginx state=present" --become`?',
                options: [
                  { id: 'a', text: 'Удаляет nginx' },
                  { id: 'b', text: 'Устанавливает nginx на все хосты через apt, с sudo' },
                  { id: 'c', text: 'Проверяет, установлен ли nginx, и падает, если нет' },
                  { id: 'd', text: 'Перезапускает nginx' },
                ],
                correct: ['b'],
                explanation:
                  '`apt: name=nginx state=present` — «пакет nginx должен быть». `--become` — через sudo. Идемпотентно: если уже установлен — `ok`, если нет — `changed`.',
              },
            },
            {
              id: 'ans-l3-s3',
              title: 'Проверь себя: ad-hoc',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте флаг ad-hoc команды и назначение',
                pairs: [
                  { left: '-m', right: 'Модуль (apt, copy, command)' },
                  { left: '-a', right: 'Аргументы модуля' },
                  { left: '--become', right: 'Выполнить с sudo' },
                  { left: '-i', right: 'Путь к inventory' },
                ],
                explanation:
                  '`-m module -a args` — базовый синтаксис. `--become` (или `-b`) — sudo. `-i` — inventory. `-u` — SSH-пользователь. Ad-hoc — быстрый способ сделать что-то на группе хостов без playbook.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m2 — Playbooks
    // ─────────────────────────────────────────────
    {
      id: 'ans-m2',
      title: 'Playbooks',
      lessons: [
        {
          id: 'ans-l4',
          title: 'Первый playbook',
          minutes: 25,
          steps: [
            {
              id: 'ans-l4-s1',
              title: 'Структура playbook',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Playbook — YAML-файл со списком **plays**. Каждый play — «на какой группе хостов выполнить какие tasks». Внутри play — `hosts`, `become`, `vars`, `tasks`, `handlers`, `roles`.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'site.yml — простой playbook',
                  code: `---\n- name: Настроить web-серверы\n  hosts: web\n  become: true\n  vars:\n    http_port: 80\n\n  tasks:\n    - name: Установить nginx\n      apt:\n        name: nginx\n        state: present\n\n    - name: Запустить nginx\n      service:\n        name: nginx\n        state: started\n        enabled: true\n\n    - name: Открыть порт 80 в ufw\n      ufw:\n        rule: allow\n        port: "{{ http_port }}"\n        proto: tcp`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск',
                  code: `# Проверка синтаксиса\nansible-playbook -i inventory.ini site.yml --syntax-check\n\n# Dry-run (ничего не меняет, но показывает, что было бы сделано)\nansible-playbook -i inventory.ini site.yml --check\n\n# С diff (что именно изменится в файлах)\nansible-playbook -i inventory.ini site.yml --check --diff\n\n# Реальный запуск\nansible-playbook -i inventory.ini site.yml\n\n# С логированием\nansible-playbook -i inventory.ini site.yml -v     # verbose\nansible-playbook -i inventory.ini site.yml -vvv   # очень подробно`,
                },
              ],
            },
            {
              id: 'ans-l4-s2',
              title: 'Результаты: ok, changed, failed',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Что значит каждый статус',
                  head: ['Статус', 'Значение'],
                  rows: [
                    ['ok', 'Желаемое состояние уже достигнуто, ничего не изменилось'],
                    ['changed', 'Состояние отличалось — Ansible привёл к желаемому'],
                    ['failed', 'Задача упала (ошибка), выполнение playbook остановлено (если не `ignore_errors`)'],
                    ['skipped', 'Задача пропущена (например, по `when`)'],
                    ['unreachable', 'Хост не отвечает по SSH'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'PLAY RECAP — итог',
                  code: `PLAY RECAP *****************************************\nweb1.example.com  : ok=5 changed=2 unreachable=0 failed=0 skipped=0 rescued=0 ignored=0\nweb2.example.com  : ok=5 changed=0 unreachable=0 failed=0 skipped=0 rescued=0 ignored=0\n\ndb1.example.com   : ok=3 changed=1 unreachable=0 failed=0 skipped=0 rescued=0 ignored=0`,
                },
                {
                  type: 'note',
                  text: '`changed=0` при повторном запуске — признак идемпотентности. Если changed > 0 при каждом запуске, где не должно быть изменений — где-то `shell`/`command` без `creates`/`changed_when`. Это классическая ошибка новичков.',
                },
              ],
            },
            {
              id: 'ans-l4-s3',
              title: 'Проверь себя: playbook',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает флаг `--check` в `ansible-playbook`?',
                options: [
                  { id: 'a', text: 'Проверяет синтаксис YAML' },
                  { id: 'b', text: 'Dry-run: показывает, что было бы сделано, но не меняет систему' },
                  { id: 'c', text: 'Включает подробный вывод' },
                  { id: 'd', text: 'Останавливается на первой ошибке' },
                ],
                correct: ['b'],
                explanation:
                  '`--check` — dry-run: задачи симулируются, но реальных изменений нет. Полезно перед `apply` на проде. Синтаксис — `--syntax-check`. Подробный вывод — `-v`/`-vv`/`-vvv`.',
              },
            },
            {
              id: 'ans-l4-s4',
              title: 'Проверь себя: статусы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте статус и значение',
                pairs: [
                  { left: 'ok', right: 'Уже в желаемом состоянии' },
                  { left: 'changed', right: 'Состояние изменено' },
                  { left: 'failed', right: 'Задача упала с ошибкой' },
                  { left: 'skipped', right: 'Задача пропущена по when' },
                ],
                explanation:
                  '`changed=0` при повторном запуске — идемпотентность. `failed` останавливает play (если не `ignore_errors`). `skipped` — пропущено по условию. `unreachable` — SSH не дошёл.',
              },
            },
          ],
        },
        {
          id: 'ans-l5',
          title: 'Модули, handlers и notify',
          minutes: 30,
          steps: [
            {
              id: 'ans-l5-s1',
              title: 'handlers: реакция на изменения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Handler — задача, которая запускается **только если** изменилась другая задача (через `notify`). Классика: изменили `nginx.conf` → перезагрузить nginx. Если конфиг не менялся — handler не запустится. Это экономит время и не дёргает сервис зря.',
                },
                {
                  type: 'mermaid',
                  caption: 'handler запускается только при changed',
                  code: `sequenceDiagram
                    participant P as Playbook
                    participant T as Tasks
                    participant H as Handlers
                    P->>T: apt install nginx
                    T-->>P: ok (уже установлен)
                    P->>T: template nginx.conf
                    T-->>P: changed → notify
                    P->>H: reload nginx
                    H-->>P: ok`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Handler + notify',
                  code: `- name: Настроить nginx\n  hosts: web\n  become: true\n  tasks:\n    - name: Установить nginx\n      apt:\n        name: nginx\n        state: present\n\n    - name: Конфиг nginx\n      template:\n        src: nginx.conf.j2\n        dest: /etc/nginx/nginx.conf\n        mode: "0644"\n      notify: reload nginx\n\n  handlers:\n    - name: reload nginx\n      service:\n        name: nginx\n        state: reloaded`,
                },
                {
                  type: 'list',
                  items: [
                    'Handler объявляется в секции `handlers`',
                    'Задача ссылается на handler через `notify: <name>`',
                    'Handler запускается **один раз** в конце play, даже если notify был от нескольких задач',
                    'Если задача вернула `ok` (не `changed`) — handler не запустится',
                    'Порядок handlers — порядок объявления, не порядок notify',
                  ],
                },
              ],
            },
            {
              id: 'ans-l5-s2',
              title: 'Полезные модули',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Топ-12 модулей',
                  head: ['Модуль', 'Что делает'],
                  rows: [
                    ['apt / yum / dnf', 'Пакеты'],
                    ['service / systemd', 'Сервисы (start, restart, reload, enabled)'],
                    ['copy', 'Скопировать файл с control node'],
                    ['template', 'Скопировать Jinja2-шаблон (переменные подставятся)'],
                    ['file', 'Управление файлами/каталогами (state=directory/touch/absent)'],
                    ['lineinfile', 'Заменить/добавить строку в файле'],
                    ['user / group', 'Пользователи и группы'],
                    ['git', 'Клонировать/обновить репозиторий'],
                    ['command / shell', 'Команда (shell — через shell, с пайпами)'],
                    ['docker_container', 'Docker-контейнер'],
                    ['ufw / firewalld', 'Файрвол'],
                    ['cron', 'Cron-задачи'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Идемпотентность в copy/template',
                  code: `# copy — если файл уже такой же, changed не будет\n- name: Конфиг приложения\n  copy:\n    src: ./app.conf\n    dest: /etc/app/app.conf\n    owner: app\n    group: app\n    mode: "0640"\n    backup: true           # сохранить старую версию в .<timestamp>\n  notify: restart app`,
                },
                {
                  type: 'note',
                  text: 'copy vs template: `copy` переносит файл «как есть», `template` — рендерит Jinja2 (подставляет переменные, выполняет циклы). Для статики — copy, для конфигов с переменными — template. `lineinfile` — когда надо поменять одну строку, не копируя весь файл.',
                },
              ],
            },
            {
              id: 'ans-l5-s3',
              title: 'Проверь себя: handlers',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда handler запустится?',
                options: [
                  { id: 'a', text: 'Всегда после каждой задачи' },
                  { id: 'b', text: 'Только если задача, вызвавшая notify, вернула `changed`' },
                  { id: 'c', text: 'Только при `--check`' },
                  { id: 'd', text: 'Если задача упала' },
                ],
                correct: ['b'],
                explanation:
                  'Handler — реакция на изменение. Если задача `template` вернула `ok` (конфиг уже такой) — notify не сработает, handler не запустится. Если `changed` — handler запустится **один раз** в конце play, даже если notify был от нескольких задач.',
              },
            },
            {
              id: 'ans-l5-s4',
              title: 'Проверь себя: copy vs template',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем `template` отличается от `copy`?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: '`template` рендерит Jinja2 (переменные, циклы), `copy` копирует как есть' },
                  { id: 'c', text: '`copy` быстрее' },
                  { id: 'd', text: '`template` работает только с nginx' },
                ],
                correct: ['b'],
                explanation:
                  '`template` — «умное копирование»: Jinja2 подставляет `{{ var }}`, выполняет `{% for %}`, `{% if %}`. `copy` — просто «как есть». Для конфигов с переменными — `template`, для статики — `copy`.',
              },
            },
          ],
        },
        {
          id: 'ans-l6',
          title: 'Переменные, register, when, циклы',
          minutes: 30,
          steps: [
            {
              id: 'ans-l6-s1',
              title: 'Переменные в playbook',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'vars, register, when',
                  code: `- hosts: web\n  become: true\n  vars:\n    packages:\n      - nginx\n      - curl\n      - jq\n\n  tasks:\n    - name: Проверить версию ОС\n      command: lsb_release -cs\n      register: os_release\n      changed_when: false    # не считать changed\n\n    - name: Показать версию\n      debug:\n        msg: "ОС: {{ os_release.stdout }}"\n\n    - name: Установить пакеты\n      apt:\n        name: "{{ item }}"\n        state: present\n      loop: "{{ packages }}"\n\n    - name: Перезапустить nginx только на Ubuntu\n      service:\n        name: nginx\n        state: restarted\n      when: os_release.stdout == "jammy"`,
                },
                {
                  type: 'list',
                  items: [
                    '`vars` — переменные play, доступны во всех tasks',
                    '`register` — сохранить результат задачи в переменную (`.stdout`, `.rc`, `.changed`)',
                    '`when` — условие выполнения задачи',
                    '`loop` — цикл (`with_items` — устаревший алиас)',
                    '`changed_when: false` — «эта задача не меняет систему» (для read-only `command`)',
                    '`failed_when` — своё условие провала',
                  ],
                },
              ],
            },
            {
              id: 'ans-l6-s2',
              title: 'Conditions и facts',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'when и ansible_facts',
                  code: `- hosts: all\n  tasks:\n    - name: Только Debian/Ubuntu\n      apt:\n        name: nginx\n        state: present\n      when: ansible_os_family == "Debian"\n\n    - name: Только RedHat/CentOS\n      dnf:\n        name: nginx\n        state: present\n      when: ansible_os_family == "RedHat"\n\n    - name: Только если RAM > 2GB\n      debug:\n        msg: "Хватит RAM"\n      when: ansible_memtotal_mb > 2048\n\n    - name: Показать все facts\n      debug:\n        var: ansible_facts`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'register и failed_when',
                  code: `- name: Проверить, есть ли файл\n  stat:\n    path: /etc/myapp/config\n  register: config_file\n\n- name: Создать, если нет\n  copy:\n    content: "default" \n    dest: /etc/myapp/config\n  when: not config_file.stat.exists\n\n- name: Упасть, если команда вернула не 0 и не 1\n  command: /opt/check.sh\n  register: check_result\n  failed_when: check_result.rc not in [0, 1]`,
                },
                {
                  type: 'note',
                  text: 'Facts — автоматически собранные данные о хосте: `ansible_os_family`, `ansible_memtotal_mb`, `ansible_distribution_version`. Их можно использовать в `when` и `template`. Собрать явно: `ansible all -m setup`.',
                },
              ],
            },
            {
              id: 'ans-l6-s3',
              title: 'Проверь себя: register',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен `register` в Ansible?',
                options: [
                  { id: 'a', text: 'Зарегистрировать хост в inventory' },
                  { id: 'b', text: 'Сохранить результат задачи в переменную для использования дальше' },
                  { id: 'c', text: 'Зарегистрировать handler' },
                  { id: 'd', text: 'Включить логирование' },
                ],
                correct: ['b'],
                explanation:
                  '`register` сохраняет результат: `.stdout`, `.stderr`, `.rc`, `.changed`, `.stat`. Дальше можно в `when`, `debug`, `template`. Пример: `command: lsb_release -cs` + `register: os` → `{{ os.stdout }}` = «jammy».',
              },
            },
            {
              id: 'ans-l6-s4',
              title: 'Проверь себя: loop',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какое ключевое слово в Ansible используется для цикла по списку? (одно слово)',
                accepted: ['loop', 'with_items'],
                placeholder: 'ключевое слово',
                hint: 'в Python — for, в Ansible — ...',
                explanation:
                  '`loop` — современный способ (`with_items` устарел, но работает). Внутри задачи доступен `{{ item }}`. Пример: `apt: name={{ item }}` + `loop: [nginx, curl]`.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m3 — Роли и шаблоны
    // ─────────────────────────────────────────────
    {
      id: 'ans-m3',
      title: 'Роли и шаблоны',
      lessons: [
        {
          id: 'ans-l7',
          title: 'Роли: структура и переиспользование',
          minutes: 30,
          steps: [
            {
              id: 'ans-l7-s1',
              title: 'Стандартная структура роли',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Роль — это «упаковка» для задач, переменных, шаблонов и handlers, сгруппированных по смыслу («nginx», «postgresql», «app»). Стандартная структура директорий позволяет переиспользовать роль в разных playbooks без копипасты.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'roles/nginx/',
                  code: `roles/nginx/\n├── tasks/main.yml          # задачи\n├── handlers/main.yml       # handlers\n├── templates/nginx.conf.j2 # Jinja2-шаблоны\n├── files/                  # статические файлы\n├── vars/main.yml           # переменные с высоким приоритетом\n├── defaults/main.yml       # переменные с низким приоритетом (переопределяемые)\n├── meta/main.yml           # зависимости от других ролей\n└── README.md`,
                },
                {
                  type: 'mermaid',
                  caption: 'Playbook вызывает роли',
                  code: `graph TD
                    Playbook["site.yml"] --> R1["role: nginx"]
                    Playbook --> R2["role: postgresql"]
                    Playbook --> R3["role: app"]
                    R1 --> T1["tasks/main.yml"]
                    R1 --> H1["handlers/main.yml"]
                    R1 --> TPL["templates/nginx.conf.j2"]
                    TPL -->|"рендерится с vars"| F1["/etc/nginx/nginx.conf"]`,
                },
                {
                  type: 'list',
                  items: [
                    '`tasks/main.yml` — основной список задач',
                    '`handlers/main.yml` — handlers (reload/restart)',
                    '`templates/*.j2` — Jinja2-шаблоны',
                    '`files/` — статика для `copy`',
                    '`defaults/main.yml` — легко переопределяемые значения',
                    '`vars/main.yml` — значения, которые почти не меняют',
                    '`meta/main.yml` — зависимости (`dependencies:`)',
                  ],
                },
              ],
            },
            {
              id: 'ans-l7-s2',
              title: 'Использование роли',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'roles/nginx/tasks/main.yml',
                  code: `---\n- name: Установить nginx\n  apt:\n    name: nginx\n    state: present\n\n- name: Конфиг\n  template:\n    src: nginx.conf.j2\n    dest: /etc/nginx/nginx.conf\n    mode: "0644"\n  notify: reload nginx\n\n- name: Запустить\n  service:\n    name: nginx\n    state: started\n    enabled: true`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'roles/nginx/handlers/main.yml',
                  code: `---\n- name: reload nginx\n  service:\n    name: nginx\n    state: reloaded`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'roles/nginx/defaults/main.yml',
                  code: `---\nnginx_worker_processes: auto\nnginx_worker_connections: 1024\nnginx_port: 80`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'site.yml — вызов роли',
                  code: `---\n- hosts: web\n  become: true\n  roles:\n    - nginx\n\n# Или через tasks/include:\n- hosts: web\n  become: true\n  tasks:\n    - name: Nginx\n      include_role:\n        name: nginx\n      vars:\n        nginx_port: 8080   # переопределяем default`,
                },
              ],
            },
            {
              id: 'ans-l7-s3',
              title: 'Проверь себя: роли',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужны роли в Ansible?',
                options: [
                  { id: 'a', text: 'Ускоряют выполнение' },
                  { id: 'b', text: 'Упаковывают задачи/переменные/handlers по смыслу для переиспользования' },
                  { id: 'c', text: 'Требуются для работы inventory' },
                  { id: 'd', text: 'Заменяют playbook' },
                ],
                correct: ['b'],
                explanation:
                  'Роль — это переиспользуемый «модуль»: nginx, postgresql, app. Один раз написали — используете в 10 playbooks. Внутри роли стандартная структура: tasks, handlers, templates, defaults, vars, meta.',
              },
            },
            {
              id: 'ans-l7-s4',
              title: 'Проверь себя: структура',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте директорию роли и её содержимое',
                pairs: [
                  { left: 'tasks/', right: 'Основные задачи (main.yml)' },
                  { left: 'handlers/', right: 'Handler-задачи (reload/restart)' },
                  { left: 'templates/', right: 'Jinja2-шаблоны для template' },
                  { left: 'defaults/', right: 'Легко переопределяемые переменные' },
                ],
                explanation:
                  '`tasks/` — что делать. `handlers/` — реакции на изменения. `templates/` — Jinja2. `defaults/` — значения по умолчанию (низкий приоритет). `vars/` — высокий приоритет. `meta/` — зависимости.',
              },
            },
          ],
        },
        {
          id: 'ans-l8',
          title: 'Jinja2 в шаблонах',
          minutes: 25,
          steps: [
            {
              id: 'ans-l8-s1',
              title: 'Переменные и выражения',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'jinja2',
                  caption: 'templates/nginx.conf.j2',
                  code: `user www-data;\nworker_processes {{ nginx_worker_processes }};\n\nevents {\n    worker_connections {{ nginx_worker_connections }};\n}\n\nhttp {\n    server {\n        listen {{ nginx_port }};\n        server_name {{ ansible_hostname }};\n\n        location / {\n            proxy_pass http://127.0.0.1:{{ app_port | default(8000) }};\n        }\n    }\n}`,
                },
                {
                  type: 'list',
                  items: [
                    '`{{ var }}` — подставить переменную',
                    '`{{ var | default(8000) }}` — значение по умолчанию, если переменная не задана',
                    '`{{ var | upper }}`, `| lower`, `| length` — фильтры',
                    '`{% if cond %}...{% endif %}` — условие',
                    '`{% for item in list %}...{% endfor %}` — цикл',
                    '`{# comment #}` — комментарий (не попадёт в файл)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Jinja2 — это тот же движок, что в Flask/Django. В Ansible переменные из inventory, `vars`, `defaults` доступны в шаблоне автоматически. `ansible_facts` — тоже (`ansible_hostname`, `ansible_default_ipv4.address`).',
                },
              ],
            },
            {
              id: 'ans-l8-s2',
              title: 'Условия и циклы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'jinja2',
                  caption: 'Условия и циклы в шаблоне',
                  code: `{% if nginx_ssl_enabled %}\nserver {\n    listen 443 ssl;\n    ssl_certificate /etc/ssl/{{ domain }}.crt;\n    ssl_certificate_key /etc/ssl/{{ domain }}.key;\n}\n{% else %}\nserver {\n    listen 80;\n}\n{% endif %}\n\nupstream app {\n{% for host in groups['app'] %}\n    server {{ host }}:{{ app_port }};\n{% endfor %}\n}`,
                },
                {
                  type: 'code',
                  lang: 'jinja2',
                  caption: 'Использование групп из inventory',
                  code: `{# groups['app'] — все хосты группы app из inventory #}\n{% for host in groups['app'] %}\n  server {{ host }}:8000;\n{% endfor %}`,
                },
                {
                  type: 'note',
                  text: '`groups` — магическая переменная Ansible: `groups[\'web\']` даёт список всех хостов группы web. `hostvars[host][\'ansible_default_ipv4\'][\'address\']` — IP конкретного хоста. Классика для генерации upstream-блоков nginx и HAProxy.',
                },
              ],
            },
            {
              id: 'ans-l8-s3',
              title: 'Проверь себя: Jinja2',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `{{ nginx_port | default(80) }}` в Jinja2-шаблоне?',
                options: [
                  { id: 'a', text: 'Всегда подставляет 80' },
                  { id: 'b', text: 'Подставляет nginx_port, а если переменная не задана — 80' },
                  { id: 'c', text: 'Проверяет, что nginx_port = 80' },
                  { id: 'd', text: 'Это синтаксическая ошибка' },
                ],
                correct: ['b'],
                explanation:
                  '`| default(80)` — фильтр «значение по умолчанию». Если `nginx_port` определён — подставит его. Если нет — 80. Защищает шаблон от `undefined variable`.',
              },
            },
            {
              id: 'ans-l8-s4',
              title: 'Проверь себя: groups',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая магическая переменная Ansible содержит словарь всех групп inventory? (одно слово)',
                accepted: ['groups'],
                placeholder: 'одно слово',
                hint: 'группы во множественном числе',
                explanation:
                  '`groups` — словарь: `groups[\'web\']` → список хостов группы web. Используется в шаблонах для генерации upstream/backend-списков. Парная: `group_names` — группы, в которые входит текущий хост.',
              },
            },
          ],
        },
        {
          id: 'ans-l9',
          title: 'template, copy, file: управление файлами',
          minutes: 25,
          steps: [
            {
              id: 'ans-l9-s1',
              title: 'Три модуля для файлов',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Модуль', 'Когда'],
                  rows: [
                    ['copy', 'Статический файл с control node на хост (не меняется)'],
                    ['template', 'Jinja2-шаблон с переменными (конфиг)'],
                    ['file', 'Каталог, права, symlink, отсутствие (без содержимого)'],
                    ['lineinfile', 'Заменить/добавить одну строку в существующем файле'],
                    ['blockinfile', 'Заменить/добавить блок (с маркерами)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'copy с правами и backup',
                  code: `- name: Конфиг приложения\n  copy:\n    src: files/app.conf\n    dest: /etc/app/app.conf\n    owner: app\n    group: app\n    mode: "0640"\n    backup: true           # бэкап старой версии\n    validate: /usr/sbin/app --check-config %s   # проверить до применения\n  notify: restart app`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'file для каталогов',
                  code: `- name: Каталог для логов\n  file:\n    path: /var/log/myapp\n    state: directory\n    owner: app\n    group: app\n    mode: "0755"\n\n- name: Symlink\n  file:\n    src: /etc/app/app.conf.prod\n    dest: /etc/app/app.conf\n    state: link\n\n- name: Удалить старый конфиг\n  file:\n    path: /etc/app/old.conf\n    state: absent`,
                },
              ],
            },
            {
              id: 'ans-l9-s2',
              title: 'lineinfile и validate',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'lineinfile',
                  code: `# Заменить/добавить параметр в sshd_config\n- name: Отключить пароль для root\n  lineinfile:\n    path: /etc/ssh/sshd_config\n    regexp: '^PermitRootLogin'\n    line: 'PermitRootLogin no'\n    validate: /usr/sbin/sshd -t -f %s\n  notify: restart sshd`,
                },
                {
                  type: 'note',
                  text: '`validate` — критичная опция: запускает проверку синтаксиса ДО замены файла. Если конфиг сломан — Ansible откатит изменение и упадёт. Без `validate` можно «положить» sshd или nginx с невалидным конфигом.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'blockinfile',
                  code: `- name: Настройки в nginx.conf\n  blockinfile:\n    path: /etc/nginx/nginx.conf\n    marker: "# {mark} ANSIBLE MANAGED BLOCK"\n    block: |\n      client_max_body_size 20m;\n      keepalive_timeout 65;`,
                },
              ],
            },
            {
              id: 'ans-l9-s3',
              title: 'Проверь себя: validate',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен `validate` в модуле `copy`/`template`?',
                options: [
                  { id: 'a', text: 'Ускоряет копирование' },
                  { id: 'b', text: 'Проверяет синтаксис файла ДО замены, откатывает если невалиден' },
                  { id: 'c', text: 'Шифрует файл' },
                  { id: 'd', text: 'Создаёт бэкап' },
                ],
                correct: ['b'],
                explanation:
                  '`validate: nginx -t -c %s` (или sshd -t) — проверка конфига до применения. Если проверка падает — файл не заменяется, система остаётся рабочей. Без `validate` можно положить сервис «невалидным» конфигом.',
              },
            },
            {
              id: 'ans-l9-s4',
              title: 'Проверь себя: модули файлов',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте модуль и задачу',
                pairs: [
                  { left: 'copy', right: 'Скопировать статический файл' },
                  { left: 'template', right: 'Отрендерить Jinja2-шаблон' },
                  { left: 'file', right: 'Создать каталог / symlink / удалить' },
                  { left: 'lineinfile', right: 'Заменить одну строку в файле' },
                ],
                explanation:
                  '`copy` — статика. `template` — Jinja2. `file` — структура ФС (каталоги, права, symlink). `lineinfile` — одна строка. `blockinfile` — блок. Выбор — по задаче.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m4 — Переменные и секреты
    // ─────────────────────────────────────────────
    {
      id: 'ans-m4',
      title: 'Переменные и секреты',
      lessons: [
        {
          id: 'ans-l10',
          title: 'Приоритет переменных',
          minutes: 25,
          steps: [
            {
              id: 'ans-l10-s1',
              title: 'Откуда берутся переменные',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Приоритет (упрощённо, от низшего к высшему)',
                  code: `graph LR
                    D["role defaults"] -->|"1<br/>низший"| X["..."]
                    X --> GI["group_vars/all"]
                    GI --> GH["group_vars/web"]
                    GH --> HV["host_vars/web1"]
                    HV --> PV["play vars"]
                    PV --> EV["extra vars -e"]
                    EV -->|"6<br/>высший"| Done["Итог"]`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Порядок загрузки',
                  code: `role/defaults/main.yml           ← самый низкий приоритет\ninventory group_vars/all\ninventory group_vars/<group>\ninventory host_vars/<host>\nplaybook vars\nrole vars/main.yml\nset_fact / register\n-e / --extra-vars               ← самый высокий приоритет`,
                },
                {
                  type: 'note',
                  text: 'Правило: `defaults` — «значения по умолчанию, которые можно переопределить». `vars` — «настройки, которые почти не меняют». Если нужно быстро переопределить всё для теста — `-e`. На собеседовании: «где хранить переменные, которые меняются между окружениями?» — `group_vars/<env>` или `host_vars`.',
                },
              ],
            },
            {
              id: 'ans-l10-s2',
              title: 'group_vars и host_vars',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура',
                  code: `inventory/\n├── production/\n│   ├── hosts.ini\n│   ├── group_vars/\n│   │   ├── all.yml            # для всех\n│   │   ├── web.yml            # для группы web\n│   │   └── db.yml\n│   └── host_vars/\n│       └── web1.example.com.yml   # для конкретного хоста\n└── staging/\n    └── ...`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'group_vars/web.yml',
                  code: `---\nhttp_port: 80\nnginx_worker_processes: 4\napp_port: 8000\n\n# Секреты — не здесь! См. ansible-vault (следующий урок)`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверить, что переменная применилась',
                  code: `# Посмотреть все переменные для хоста\nansible web1.example.com -m debug -a "var=hostvars[inventory_hostname]"\n\n# Отладка одной переменной\nansible web1.example.com -m debug -a "var=http_port"\n\n# Из playbook\n- debug:\n    var: http_port`,
                },
                {
                  type: 'note',
                  text: 'Правило: `group_vars/all.yml` — общие настройки для всего окружения. `group_vars/<group>.yml` — специфика группы. `host_vars/<host>.yml` — редкие случаи, когда один хост отличается. Не дублируйте: если переменная одинакова для всех — в `all.yml`.',
                },
              ],
            },
            {
              id: 'ans-l10-s3',
              title: 'Проверь себя: приоритет',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какие переменные имеют самый ВЫСОКИЙ приоритет в Ansible?',
                options: [
                  { id: 'a', text: 'defaults роли' },
                  { id: 'b', text: 'group_vars' },
                  { id: 'c', text: '-e / --extra-vars' },
                  { id: 'd', text: 'vars роли' },
                ],
                correct: ['c'],
                explanation:
                  '`-e` (extra vars) — самый высокий приоритет. Их нельзя переопределить ничем в playbook. Порядок: defaults < group_vars < host_vars < play vars < vars роли < set_fact < extra_vars.',
              },
            },
            {
              id: 'ans-l10-s4',
              title: 'Проверь себя: group_vars',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где хранить переменные, разные для staging и production?',
                options: [
                  { id: 'a', text: 'В `vars/main.yml` роли' },
                  { id: 'b', text: 'В `group_vars/all.yml`' },
                  { id: 'c', text: 'В `inventory/<env>/group_vars/`' },
                  { id: 'd', text: 'В `defaults/main.yml`' },
                ],
                correct: ['c'],
                explanation:
                  '`inventory/production/group_vars/` и `inventory/staging/group_vars/` — стандарт. Один и тот же playbook, разные inventory → разные значения. `-e` для разовых override, `defaults` — для значений «по умолчанию».',
              },
            },
          ],
        },
        {
          id: 'ans-l11',
          title: 'ansible-vault и безопасность',
          minutes: 25,
          steps: [
            {
              id: 'ans-l11-s1',
              title: 'Шифрование секретов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Пароли БД, API-токены, ключи — нельзя хранить открытым текстом в Git. `ansible-vault` шифрует файл симметричным ключом (AES256). В репозитории лежит зашифрованный файл, пароль vault-а — вне репозитория (CI secrets, `.vault_pass`).',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Жизненный цикл vault',
                  code: `# Зашифровать новый файл (спросит пароль)\nansible-vault create group_vars/production/vault.yml\n\n# Зашифровать существующий\nansible-vault encrypt group_vars/production/secrets.yml\n\n# Расшифровать (осторожно!)\nansible-vault decrypt secrets.yml\n\n# Отредактировать (расшифрует → редактор → зашифрует)\nansible-vault edit group_vars/production/vault.yml\n\n# Сменить пароль\nansible-vault rekey vault.yml\n\n# Посмотреть, не расшифровывая\nansible-vault view vault.yml`,
                },
                {
                  type: 'note',
                  text: '`encrypt` шифрует файл целиком. Для YAML-переменных удобнее `ansible-vault encrypt_string` — шифрует только значение, файл остаётся читаемым. Пример: `ansible-vault encrypt_string --name \'db_password\'` → вставите `!vault |` в `group_vars`.',
                },
              ],
            },
            {
              id: 'ans-l11-s2',
              title: 'Использование vault в playbook',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Запуск playbook с vault',
                  code: `# Спросит пароль\nansible-playbook -i inventory.ini site.yml --ask-vault-pass\n\n# Пароль из файла (для CI)\nansible-playbook -i inventory.ini site.yml --vault-password-file ~/.vault_pass\n\n# Или из переменной окружения\nexport ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass\nansible-playbook -i inventory.ini site.yml`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Частичное шифрование: encrypt_string',
                  code: `# В group_vars/production/vault.yml\ndb_password: !vault |\n          $ANSIBLE_VAULT;1.1;AES256\n          66386439653236336...\n\n# В playbook — обычное использование\n- name: Подключиться к БД\n  postgresql_db:\n    login_password: "{{ db_password }}"\n    ...`,
                },
                {
                  type: 'list',
                  items: [
                    '`.vault_pass` — НЕ коммитить в Git!',
                    'Пароль vault-а — в CI secrets (GitHub Actions, GitLab CI) или менеджере секретов',
                    '`.gitignore` — добавить `*.vault_pass`, `.vault_pass`',
                    'Для CI: `--vault-password-file` + файл из secrets',
                    'Альтернатива — внешние секреты: HashiCorp Vault, AWS Secrets Manager (через lookup)',
                  ],
                },
                {
                  type: 'note',
                  text: 'Vault ≠ «секрет в безопасности навсегда». Пароль vault-а где-то лежит. В зрелых командах используют внешние секрет-хранилища (Vault, AWS Secrets Manager) через `lookup(\'aws_secret\', ...)`. ansible-vault — для маленьких команд и «базового» шифрования в Git.',
                },
              ],
            },
            {
              id: 'ans-l11-s3',
              title: 'Проверь себя: vault',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `ansible-vault encrypt_string --name "db_password"`?',
                options: [
                  { id: 'a', text: 'Шифрует весь файл' },
                  { id: 'b', text: 'Шифрует только значение, которое вы вставите в YAML-файл' },
                  { id: 'c', text: 'Создаёт новый файл с паролем' },
                  { id: 'd', text: 'Меняет пароль vault' },
                ],
                correct: ['b'],
                explanation:
                  '`encrypt_string` шифрует одно значение (пароль, токен) и выдаёт `!vault |`-блок для вставки в YAML. Файл остаётся читаемым (кроме значения). Удобно для `group_vars`, где нужно скрыть только пароль, а не всё.',
              },
            },
            {
              id: 'ans-l11-s4',
              title: 'Проверь себя: безопасность',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что важно НЕ делать с ansible-vault в Git-репозитории?',
                options: [
                  { id: 'a', text: 'Коммитить `.vault_pass`' },
                  { id: 'b', text: 'Коммитить зашифрованный `vault.yml`' },
                  { id: 'c', text: 'Хранить пароль vault-а в README' },
                  { id: 'd', text: 'Расшифровывать секреты в CI логах' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  '`.vault_pass`, пароль в README, расшифровка в логах — утечка. Зашифрованный `vault.yml` в Git — норма. Пароль vault-а — в CI secrets / менеджере секретов, не в репозитории.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m5 — Продвинутое
    // ─────────────────────────────────────────────
    {
      id: 'ans-m5',
      title: 'Продвинутое',
      lessons: [
        {
          id: 'ans-l12',
          title: 'Collections и ansible-galaxy',
          minutes: 25,
          steps: [
            {
              id: 'ans-l12-s1',
              title: 'Что такое collections',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Collections — способ упаковки модулей, ролей, плагинов в namespace. С Ansible 2.10 «всё» разложено по коллекциям: `ansible.builtin.apt` (встроенное), `community.general.ufw`, `community.docker.docker_container`, `amazon.aws.ec2_instance`. Раньше модули жили прямо в Ansible, теперь — в коллекциях.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'ansible-galaxy',
                  code: `# Список установленных\nansible-galaxy collection list\n\n# Установить из Galaxy\nansible-galaxy collection install community.general\nansible-galaxy collection install community.docker\nansible-galaxy collection install amazon.aws\n\n# Установить из Git\nansible-galaxy collection install git+https://github.com/myorg/mycollection.git\n\n# Установить из requirements.yml\nansible-galaxy collection install -r requirements.yml -p ./collections`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'requirements.yml',
                  code: `---\ncollections:\n  - name: community.general\n    version: ">=8.0.0"\n  - name: community.docker\n    version: "3.10.0"\n  - name: ansible.posix\n\nroles:\n  - name: geerlingguy.nginx\n    version: "3.1.4"`,
                },
              ],
            },
            {
              id: 'ans-l12-s2',
              title: 'Использование',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'FQCN (fully qualified collection name)',
                  code: `# Современный синтаксис — с namespace\n- name: Установить nginx (builtin)\n  ansible.builtin.apt:\n    name: nginx\n    state: present\n\n- name: Открыть порт (community.general)\n  community.general.ufw:\n    rule: allow\n    port: "80"\n    proto: tcp\n\n- name: Docker-контейнер (community.docker)\n  community.docker.docker_container:\n    name: myapp\n    image: myapp:1.0\n    state: started`,
                },
                {
                  type: 'note',
                  text: 'FQCN (`ansible.builtin.apt` вместо `apt`) — стандарт с Ansible 2.10. Работает и без namespace, но: (1) `ansible-lint` требует FQCN, (2) яснее, откуда модуль. На собеседовании: «что такое FQCN?» — ответ: `namespace.collection.module`.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'collection в meta/requirements',
                  code: `# roles/myrole/meta/main.yml\n---\ndependencies: []\n\ngalaxy_info:\n  role_name: myrole\n  min_ansible_version: "2.14"\n  galaxy_tags: [myapp]`,
                },
              ],
            },
            {
              id: 'ans-l12-s3',
              title: 'Проверь себя: collections',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое FQCN в Ansible?',
                options: [
                  { id: 'a', text: 'Fully Qualified Class Name в Python' },
                  { id: 'b', text: 'Fully Qualified Collection Name: namespace.collection.module (например, community.general.ufw)' },
                  { id: 'c', text: 'Тип inventory' },
                  { id: 'd', text: 'Способ запуска playbook' },
                ],
                correct: ['b'],
                explanation:
                  'FQCN — `namespace.collection.module`. `ansible.builtin.apt`, `community.general.ufw`, `community.docker.docker_container`. Стандарт с Ansible 2.10, требуется `ansible-lint`.',
              },
            },
            {
              id: 'ans-l12-s4',
              title: 'Проверь себя: galaxy',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда ставит коллекции из файла `requirements.yml`? (ansible-...)',
                accepted: ['ansible-galaxy collection install -r requirements.yml', 'ansible-galaxy collection install --requirements-file requirements.yml'],
                placeholder: 'ansible-galaxy ...',
                hint: 'install + -r',
                explanation:
                  '`ansible-galaxy collection install -r requirements.yml` — стандарт для CI: все зависимости ставятся одной командой. В Dockerfile или CI первым шагом.',
              },
            },
          ],
        },
        {
          id: 'ans-l13',
          title: 'Strategies, delegate_to, serial',
          minutes: 30,
          steps: [
            {
              id: 'ans-l13-s1',
              title: 'Стратегии выполнения',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'strategies',
                  head: ['Стратегия', 'Как работает'],
                  rows: [
                    ['linear (дефолт)', 'Task 1 на всех хостах → Task 2 на всех хостах → ...'],
                    ['free', 'Каждый хост идёт по tasks независимо, не ждёт остальных'],
                    ['host_pinned', 'Как free, но хост не переключается между задачами'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'strategy и serial',
                  code: `- hosts: web\n  strategy: free\n  serial: "25%"     # обновлять по 25% хостов за раз\n  max_fail_percentage: 10   # если > 10% упало — стоп\n\n  tasks:\n    - name: Deploy new version\n      ...`,
                },
                {
                  type: 'list',
                  items: [
                    '`serial` — rolling update: по N хостов (число или процент)',
                    '`serial: [1, 5, "100%"]` — сначала 1 (canary), потом 5, потом все',
                    '`max_fail_percentage` — сколько может упасть до остановки',
                    '`strategy: free` — быстрее, но менее предсказуемо',
                    '`any_errors_fatal` — упасть на весь play при ошибке на одном хосте',
                  ],
                },
                {
                  type: 'note',
                  text: '`serial` — must-have для rolling update: обновляем по 1 хосту, проверяем, идём дальше. Если упало — остальные не тронуты. Классика для деплоя nginx/приложения без простоя.',
                },
              ],
            },
            {
              id: 'ans-l13-s2',
              title: 'delegate_to и run_once',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'delegate_to',
                  code: `- hosts: web\n  tasks:\n    - name: Снять с балансировщика\n      community.general.haproxy:\n        state: disabled\n        host: "{{ inventory_hostname }}"\n        socket: /var/run/haproxy.sock\n      delegate_to: lb1.example.com   # выполнить на LB, а не на web\n\n    - name: Обновить приложение\n      ...\n\n    - name: Вернуть на балансировщик\n      community.general.haproxy:\n        state: enabled\n        host: "{{ inventory_hostname }}"\n      delegate_to: lb1.example.com`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'run_once',
                  code: `- name: Выполнить миграцию БД только один раз\n  command: /opt/app/migrate.sh\n  run_once: true\n  delegate_to: db1.example.com`,
                },
                {
                  type: 'list',
                  items: [
                    '`delegate_to` — выполнить задачу на ДРУГОМ хосте (LB, db, localhost)',
                    '`run_once: true` — выполнить только на первом хосте группы',
                    '`delegate_facts: true` — собрать facts с делегированного хоста',
                    'Классика: снятие с балансировщика → обновление → возврат',
                    '`delegate_to: localhost` — выполнить на control node',
                  ],
                },
                {
                  type: 'note',
                  text: '`delegate_to` + `serial` — стандарт rolling deploy: по одному хосту снимаем с LB, обновляем, возвращаем. `run_once` — для миграций БД, однократных скриптов, регистрации в Consul.',
                },
              ],
            },
            {
              id: 'ans-l13-s3',
              title: 'Проверь себя: serial',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен `serial: 1` в playbook?',
                options: [
                  { id: 'a', text: 'Ускоряет выполнение' },
                  { id: 'b', text: 'Обновляет по одному хосту — rolling update без простоя' },
                  { id: 'c', text: 'Запускает только на одном хосте' },
                  { id: 'd', text: 'Включает debug' },
                ],
                correct: ['b'],
                explanation:
                  '`serial: 1` — «обновляй по одному хосту»: обновили web1, проверили, обновили web2. Если web1 упал — остальные не тронуты. Rolling update — стандарт для nginx, приложений, LB.',
              },
            },
            {
              id: 'ans-l13-s4',
              title: 'Проверь себя: delegate_to',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `delegate_to: lb1.example.com` в задаче?',
                options: [
                  { id: 'a', text: 'Копирует задачу на lb1' },
                  { id: 'b', text: 'Выполняет задачу на lb1, а не на текущем хосте play' },
                  { id: 'c', text: 'Добавляет lb1 в inventory' },
                  { id: 'd', text: 'Пропускает задачу, если lb1 недоступен' },
                ],
                correct: ['b'],
                explanation:
                  '`delegate_to` — «выполни на другом хосте». Классика: play по web, но снятие с балансировщика — на lb1. `{{ inventory_hostname }}` внутри задачи = текущий хост play (web1), а команда идёт на lb1.',
              },
            },
          ],
        },
        {
          id: 'ans-l14',
          title: 'Тестирование ролей: molecule и ansible-lint',
          minutes: 25,
          steps: [
            {
              id: 'ans-l14-s1',
              title: 'ansible-lint',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'ansible-lint',
                  code: `# Установка\npip install ansible-lint\n\n# Запуск в текущей папке\nansible-lint\n\n# С конкретным файлом\nansible-lint site.yml\n\n# Автофикс (не всё, но многое)\nansible-lint --fix\n\n# В CI — как pre-commit hook`,
                },
                {
                  type: 'list',
                  items: [
                    'Проверяет стиль, FQCN, идемпотентность, устаревшие модули',
                    'Требует FQCN (`ansible.builtin.apt`, а не `apt`)',
                    'Ловит `command`/`shell` без `changed_when`/`creates`',
                    'Проверяет YAML-синтаксис и структуру ролей',
                    'Стандарт в CI — `ansible-lint` + `yamllint`',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: '.ansible-lint (конфиг)',
                  code: `---\n# .ansible-lint\nexclude_paths:\n  - .cache/\n  - .github/\n\nskip_list:\n  - no-changed-when      # разрешить shell без changed_when\n  - command-instead-of-module   # разрешить command вместо модуля\n\nwarn_list:\n  - experimental`,
                },
              ],
            },
            {
              id: 'ans-l14-s2',
              title: 'molecule',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Molecule — фреймворк для тестирования ролей: поднимает изолированное окружение (Docker-контейнер, VM), применяет роль, запускает проверки (idempotence, verify), сносит. Позволяет тестировать роли локально, не трогая прод.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'molecule workflow',
                  code: `# Инициализация (внутри роли)\ncd roles/nginx\nmolecule init scenario --driver-name docker\n\n# Структура\n# molecule/default/\n# ├── molecule.yml    — конфиг (какой образ, как поднять)\n# ├── converge.yml    — playbook, применяющий роль\n# └── verify.yml      — проверки (assert, serverspec)\n\n# Запуск: создать → применить → проверить → снести\nmolecule test\n\n# Только поднять и применить\nmolecule converge\n\n# Зайти внутрь контейнера\nmolecule login\n\n# Удалить\nmolecule destroy`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'molecule/default/converge.yml',
                  code: `---\n- name: Converge\n  hosts: all\n  become: true\n  roles:\n    - nginx`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'molecule/default/verify.yml',
                  code: `---\n- name: Verify\n  hosts: all\n  tasks:\n    - name: Nginx должен быть установлен\n      ansible.builtin.package_facts:\n        manager: auto\n      failed_when: "'nginx' not in ansible_facts.packages"\n\n    - name: Nginx должен слушать 80\n      ansible.builtin.wait_for:\n        port: 80\n        timeout: 5`,
                },
                {
                  type: 'note',
                  text: '`molecule test` в CI на каждый PR — стандарт для ролей. Ловит сломанные роли до прода. Idempotence step (повторный `converge`) — проверяет, что роль идемпотентна (второй прогон — `changed=0`).',
                },
              ],
            },
            {
              id: 'ans-l14-s3',
              title: 'Проверь себя: molecule',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что проверяет шаг `idempotence` в `molecule test`?',
                options: [
                  { id: 'a', text: 'Что роль работает на разных ОС' },
                  { id: 'b', text: 'Что повторный прогон роли не вносит изменений (changed=0)' },
                  { id: 'c', text: 'Что ansible-lint проходит' },
                  { id: 'd', text: 'Скорость выполнения' },
                ],
                correct: ['b'],
                explanation:
                  '`idempotence` — повторно применяет роль и проверяет, что `changed=0`. Если есть `changed` — роль не идемпотентна (где-то `shell` без `creates`). Классический тест — ловит «скрипты вместо модулей».',
              },
            },
            {
              id: 'ans-l14-s4',
              title: 'Проверь себя: lint',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какое требование `ansible-lint` предъявляет к именам модулей?',
                options: [
                  { id: 'a', text: 'Всегда FQCN (namespace.collection.module)' },
                  { id: 'b', text: 'Только короткие имена (apt, copy)' },
                  { id: 'c', text: 'С заглавной буквы' },
                  { id: 'd', text: 'С дефисом вместо подчёркивания' },
                ],
                correct: ['a'],
                explanation:
                  '`ansible-lint` требует FQCN: `ansible.builtin.apt` вместо `apt`, `community.general.ufw` вместо `ufw`. Это делает код явным и защищает от конфликтов имён между коллекциями.',
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
      id: 'ans-m6',
      title: 'Практикум',
      lessons: [
        {
          id: 'ans-l15',
          title: 'Полный сценарий: nginx + БД + деплой',
          minutes: 35,
          steps: [
            {
              id: 'ans-l15-s1',
              title: 'Структура проекта',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура проекта',
                  code: `infra/\n├── ansible.cfg\n├── inventory/\n│   ├── production/\n│   │   ├── hosts.ini\n│   │   ├── group_vars/\n│   │   │   ├── all.yml\n│   │   │   ├── web.yml\n│   │   │   ├── db.yml\n│   │   │   └── vault.yml          # зашифрован\n│   │   └── host_vars/\n│   └── staging/\n│       └── ...\n├── roles/\n│   ├── nginx/\n│   ├── postgresql/\n│   └── app/\n├── site.yml\n└── requirements.yml`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'site.yml',
                  code: `---\n- name: Настроить БД\n  hosts: db\n  become: true\n  roles:\n    - postgresql\n\n- name: Настроить web + приложение\n  hosts: web\n  become: true\n  serial: 1                    # rolling update\n  roles:\n    - nginx\n    - app\n\n- name: Применить миграции БД\n  hosts: db[0]                 # только первая БД\n  become: true\n  tasks:\n    - name: Миграция\n      command: /opt/app/migrate.sh\n      args:\n        creates: /opt/app/.migrated   # идемпотентность\n      run_once: true`,
                },
                {
                  type: 'note',
                  text: 'Порядок: сначала БД (роль postgresql), потом web (nginx + app), потом миграции (`run_once` на первой БД). `serial: 1` на web — rolling update. `creates:` — защита от повторного запуска миграции.',
                },
              ],
            },
            {
              id: 'ans-l15-s2',
              title: 'Проверь себя: rolling update',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что нужно добавить в play для rolling update по одному хосту?',
                options: [
                  { id: 'a', text: '`serial: 1`' },
                  { id: 'b', text: '`strategy: free`' },
                  { id: 'c', text: '`run_once: true`' },
                  { id: 'd', text: '`delegate_to: localhost`' },
                ],
                correct: ['a'],
                explanation:
                  '`serial: 1` — обновлять по одному хосту. Если web1 упал — web2 не тронут. `strategy: free` — параллельно и непредсказуемо. `run_once` — только один хост. `delegate_to` — выполнить на другом хосте.',
              },
            },
            {
              id: 'ans-l15-s3',
              title: 'Проверь себя: миграции',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как сделать миграцию БД идемпотентной в Ansible?',
                options: [
                  { id: 'a', text: '`command` без `creates`' },
                  { id: 'b', text: '`command: migrate.sh` + `args: { creates: /opt/.migrated }`' },
                  { id: 'c', text: '`shell` с `changed_when: false`' },
                  { id: 'd', text: 'Просто `command: migrate.sh`' },
                ],
                correct: ['b'],
                explanation:
                  '`creates:` — «не выполняй, если файл существует». После первой миграции создаётся маркер `/opt/.migrated`, и повторный запуск вернёт `ok` (skipped). Альтернатива — `changed_when: false` + `failed_when` (менее надёжно).',
              },
            },
          ],
        },
        {
          id: 'ans-l16',
          title: 'Troubleshooting и best practices',
          minutes: 30,
          steps: [
            {
              id: 'ans-l16-s1',
              title: 'Типичные ошибки',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Проблема → решение',
                  head: ['Симптом', 'Причина', 'Решение'],
                  rows: [
                    ['`unreachable` на всех хостах', 'SSH-ключ, пользователь, порт', '`ansible -m ping` с `-u`, `-k` (пароль), `-vvv`'],
                    ['`changed` при каждом запуске', '`shell`/`command` без `creates`', '`creates:`, `changed_when:`, заменить на модуль'],
                    ['`permission denied`', 'Нет `--become`', '`become: true` в play или `-b` в ad-hoc'],
                    ['Медленно', '`gather_facts` на каждой задаче', '`gather_facts: false`, facts только где нужны'],
                    ['`failed` на `template`', 'Невалидный Jinja2', '`--check` + `--diff`, синтаксис Jinja2'],
                    ['Не находит роль', 'Неверный `roles_path`', '`roles_path` в `ansible.cfg` или `-p`'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Debug',
                  code: `# Синтаксис\nansible-playbook --syntax-check site.yml\n\n# Dry-run + diff\nansible-playbook --check --diff site.yml\n\n# Подробный вывод\nansible-playbook -vvv site.yml\n\n# Только конкретные теги\nansible-playbook --tags=nginx site.yml\n\n# Отладка переменной\nansible web1 -m debug -a "var=hostvars[inventory_hostname]"\n\n# Увеличить timeout\nansible-playbook -T 60 site.yml`,
                },
              ],
            },
            {
              id: 'ans-l16-s2',
              title: 'Best practices',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Модули вместо `shell`/`command` — идемпотентность из коробки',
                    'FQCN для всех модулей — совместимость с `ansible-lint`',
                    '`defaults/` для значений «по умолчанию», `vars/` для «настроек»',
                    'Секреты — через `ansible-vault` или внешние secret-хранилища (никогда в Git)',
                    '`serial` для rolling update, `delegate_to` для LB, `run_once` для миграций',
                    '`validate:` для конфигов (nginx, sshd, postgresql)',
                    '`molecule test` + `ansible-lint` в CI на каждый PR',
                    '`requirements.yml` — фиксируйте версии коллекций и ролей',
                    '`ansible.cfg` в репозитории — единые настройки для команды',
                  ],
                },
                {
                  type: 'code',
                  lang: 'ini',
                  caption: 'ansible.cfg — типичный',
                  code: `[defaults]\ninventory = ./inventory/production/hosts.ini\nroles_path = ./roles\nhost_key_checking = False\nretry_files_enabled = False\nstdout_callback = yaml\n\n[privilege_escalation]\nbecome = True\nbecome_method = sudo\nbecome_user = root\n\n[ssh_connection]\npipelining = True       # ускорение`,
                },
                {
                  type: 'note',
                  text: '`ansible.cfg` в корне проекта — приоритет над `/etc/ansible/ansible.cfg`. Настройки читаются автоматически при запуске `ansible`/`ansible-playbook` из этой папки. `stdout_callback = yaml` — читаемый вывод. `pipelining = True` — ускорение в 1.5–2 раза (но нужен `requiretty` off на целевых хостах).',
                },
              ],
            },
            {
              id: 'ans-l16-s3',
              title: 'Проверь себя: changed',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Playbook показывает `changed=1` при каждом запуске, хотя система не должна меняться. Что проверить?',
                options: [
                  { id: 'a', text: 'Инвентарь' },
                  { id: 'b', text: 'Есть ли `shell`/`command` без `creates` или `changed_when`' },
                  { id: 'c', text: 'Версию Ansible' },
                  { id: 'd', text: 'Facts' },
                ],
                correct: ['b'],
                explanation:
                  'Главная причина ложного `changed` — `shell`/`command` без `creates` или `changed_when`. Ansible считает, что команда «изменила систему», потому что shell всегда возвращает rc=0. Решение: `creates:` (файл-маркер), `changed_when: false` (read-only), или заменить на модуль.',
              },
            },
            {
              id: 'ans-l16-s4',
              title: 'Проверь себя: best practices',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики стоит применять в Ansible-проекте?',
                options: [
                  { id: 'a', text: 'FQCN для модулей' },
                  { id: 'b', text: '`serial` для rolling update' },
                  { id: 'c', text: 'Секреты открытым текстом в group_vars' },
                  { id: 'd', text: '`ansible-lint` + `molecule test` в CI' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'FQCN — совместимость с lint. `serial` — rolling update. `molecule` + `ansible-lint` — тесты. Секреты открытым текстом — антипаттерн, использовать `ansible-vault` или внешние хранилища.',
              },
            },
            {
              id: 'ans-l16-s5',
              title: 'Проверь себя: debug',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте флаг и что он делает',
                pairs: [
                  { left: '--syntax-check', right: 'Проверка синтаксиса YAML' },
                  { left: '--check', right: 'Dry-run, ничего не меняет' },
                  { left: '--diff', right: 'Показать diff изменений в файлах' },
                  { left: '-vvv', right: 'Максимально подробный вывод' },
                ],
                explanation:
                  '`--syntax-check` — синтаксис. `--check` — dry-run. `--diff` — показать diff. `-vvv` — debug. Всё вместе: `--check --diff -vvv` для глубокой отладки playbook.',
              },
            },
          ],
        },
      ],
    },
  ],
};