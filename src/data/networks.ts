import type { Course } from './types';

export const networksCourse: Course = {
  slug: 'networks-http',
  title: 'Сети и HTTP',
  subtitle: 'OSI, TCP/IP, DNS, HTTP/2, TLS и WebSocket — как на самом деле работает интернет',
  description:
    'Курс для тех, кто хочет понимать, что происходит между браузером и сервером. Разберём модель OSI, IP-адресацию и порты, DNS, TCP и UDP, HTTP-методы и статусы, HTTPS и TLS-рукопожатие, HTTP/2 и HTTP/3, прокси и балансировщики. Каждая тема — с практикой: curl, dig, traceroute, tcpdump. Без этого курса API-тестирование и DevOps — магия.',
  level: 'Средний',
  tags: ['Сети', 'HTTP', 'DevOps'],
  accent: '#4a90d9',
  icon: 'network',
  outcomes: [
    'Объяснять путь запроса от браузера до сервера: DNS → TCP → TLS → HTTP',
    'Читать HTTP-запросы и ответы: методы, статусы, заголовки, cookies',
    'Понимать разницу TCP и UDP, когда что использовать',
    'Объяснять, как работает HTTPS и TLS-рукопожатие',
    'Диагностировать проблемы: dig, curl, traceroute, tcpdump',
  ],
  requirements: ['Базовое понимание Linux (курс Linux)', 'Любой терминал с curl'],
  modules: [
    {
      id: 'nw-m1',
      title: 'Основы сетей',
      lessons: [
        {
          id: 'nw-l1',
          title: 'OSI и TCP/IP: как устроен интернет',
          minutes: 30,
          steps: [
            {
              id: 'nw-l1-s1',
              title: 'Две модели: OSI и TCP/IP',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Любая сетевая передача — это слои. Каждый слой делает одно и передаёт данные следующему. Модель OSI (7 слоёв) — теоретическая, для обучения. Модель TCP/IP (4 слоя) — практическая, по ней реально работает интернет.' },
                {
                  type: 'mermaid',
                  caption: 'Соответствие слоёв OSI и TCP/IP',
                  code: 'graph TD\n    subgraph OSI["OSI — 7 уровней"]\n        direction TB\n        O7["7. Application<br/>HTTP, DNS, SSH"]\n        O6["6. Presentation<br/>TLS, gzip"]\n        O5["5. Session"]\n        O4["4. Transport<br/>TCP, UDP"]\n        O3["3. Network<br/>IP, ICMP"]\n        O2["2. Data Link<br/>Ethernet"]\n        O1["1. Physical<br/>кабели"]\n    end\n    subgraph TCPIP["TCP/IP — 4 уровня"]\n        direction TB\n        T4["Application"]\n        T3["Transport"]\n        T2["Internet"]\n        T1["Link"]\n    end\n    O7 --> T4\n    O6 --> T4\n    O5 --> T4\n    O4 --> T3\n    O3 --> T2\n    O2 --> T1\n    O1 --> T1',
                },
                {
                  type: 'table',
                  caption: 'OSI (7 слоёв) vs TCP/IP (4 слоя)',
                  head: ['OSI', 'TCP/IP', 'Примеры', 'Что делает'],
                  rows: [
                    ['7. Application', 'Application', 'HTTP, DNS, SSH, FTP', 'Протоколы приложений'],
                    ['6. Presentation', 'Application', 'TLS, gzip', 'Шифрование, сжатие'],
                    ['5. Session', 'Application', 'сессии, cookies', 'Управление соединением'],
                    ['4. Transport', 'Transport', 'TCP, UDP', 'Порты, надёжность, порядок'],
                    ['3. Network', 'Internet', 'IP, ICMP', 'Адресация, маршрутизация'],
                    ['2. Data Link', 'Link', 'Ethernet, Wi-Fi', 'Кадры, MAC-адреса'],
                    ['1. Physical', 'Link', 'кабели, радиоволны', 'Биты по проводу'],
                  ],
                },
                { type: 'note', text: 'Зачем это знать: на собеседовании QA/DevOps часто просят «объяснить, что происходит, когда вы вводите google.com в браузере». Правильный ответ — пройти по слоям: DNS → TCP → TLS → HTTP → рендер. Если не знаете слоёв — не сможете структурировать ответ.' },
              ],
            },
            {
              id: 'nw-l1-s2',
              title: 'Путь запроса: от браузера до сервера',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что происходит, когда вы вводите google.com',
                  code: '1. DNS-резолвинг (Application)\n   google.com → 142.250.185.78\n\n2. TCP-соединение (Transport)\n   3-way handshake: SYN → SYN-ACK → ACK\n   (если HTTPS — то на порт 443)\n\n3. TLS-рукопожатие (Application, поверх TCP)\n   ClientHello → ServerHello + сертификат → обмен ключами\n   → зашифрованное соединение\n\n4. HTTP-запрос (Application)\n   GET / HTTP/2\n   Host: google.com\n   User-Agent: Chrome/...\n\n5. HTTP-ответ (Application)\n   200 OK\n   Content-Type: text/html\n   <html>...\n\n6. Рендер в браузере\n   HTML → DOM → CSSOM → JS → отрисовка\n\nИтого: DNS → TCP → TLS → HTTP → рендер.\nКаждый слой можно диагностировать отдельно.',
                },
                { type: 'note', text: 'Если «сайт не открывается» — почти всегда можно понять, где сломалось: dig google.com (DNS), ping google.com (ICMP), curl -v https://google.com (TCP+TLS+HTTP). Три команды — три слоя — 90% диагностики.' },
              ],
            },
            {
              id: 'nw-l1-s3',
              title: 'Инкапсуляция: как данные спускаются по слоям',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда вы отправляете HTTP-запрос, он не «летит» в сеть целиком. Каждый слой заворачивает данные предыдущего в свой заголовок — это инкапсуляция. На приёмной стороне — обратный процесс: каждый слой снимает свой заголовок.' },
                {
                  type: 'mermaid',
                  caption: 'Инкапсуляция: каждый слой добавляет заголовок',
                  code: 'graph LR\n    App["HTTP-запрос<br/>GET / (данные)"]\n    TCP["TCP<br/>[TCP-заголовок | данные]"]\n    IP["IP<br/>[IP-заголовок | TCP | данные]"]\n    Eth["Ethernet<br/>[Ethernet | IP | TCP | данные]"]\n    Wire["Провод<br/>биты"]\n    App --> TCP --> IP --> Eth --> Wire',
                },
                {
                  type: 'list',
                  items: [
                    'Application: HTTP-запрос — просто текст',
                    'Transport: TCP добавляет порты (src, dst) и sequence numbers',
                    'Network: IP добавляет src IP, dst IP',
                    'Data Link: Ethernet добавляет MAC-адреса',
                    'Каждый заголовок — «конверт» для предыдущего слоя',
                  ],
                },
                { type: 'note', text: 'На собеседовании junior сети: «что такое инкапсуляция?» — «каждый слой заворачивает данные предыдущего в свой заголовок; на приёме — распаковывает». Это объясняет, почему «не работает сайт» может быть из-за любого слоя: Ethernet, IP, TCP, TLS или HTTP.' },
              ],
            },
            {
              id: 'nw-l1-s4',
              title: 'Проверь себя: порядок',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В каком порядке происходит открытие HTTPS-сайта?',
                options: [
                  { id: 'a', text: 'HTTP → TLS → TCP → DNS' },
                  { id: 'b', text: 'DNS → TCP → TLS → HTTP' },
                  { id: 'c', text: 'TCP → DNS → HTTP → TLS' },
                  { id: 'd', text: 'DNS → HTTP → TCP → TLS' },
                ],
                correct: ['b'],
                explanation:
                  'Сначала DNS (имя → IP), потом TCP-соединение (3-way handshake), потом TLS-рукопожатие (шифрование), и только потом HTTP-запрос. Каждый следующий слой «оборачивает» предыдущий. Если что-то сломалось — можно проверить каждый шаг отдельно: dig, telnet, openssl s_client, curl.',
              },
            },
            {
              id: 'nw-l1-s5',
              title: 'Проверь себя: слои',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте протокол и слой TCP/IP',
                pairs: [
                  { left: 'HTTP', right: 'Application' },
                  { left: 'TCP / UDP', right: 'Transport' },
                  { left: 'IP / ICMP', right: 'Internet' },
                  { left: 'Ethernet / Wi-Fi', right: 'Link' },
                ],
                explanation:
                  'HTTP — Application (7 по OSI). TCP/UDP — Transport (4). IP/ICMP — Internet (3). Ethernet/Wi-Fi — Link (2+1). Понимание, на каком слое что работает, помогает диагностировать: «не пингуется» — Internet/Link, «порт закрыт» — Transport, «ошибка 500» — Application.',
              },
            },
          ],
        },
        {
          id: 'nw-l2',
          title: 'IP-адреса, маски, порты',
          minutes: 30,
          steps: [
            {
              id: 'nw-l2-s1',
              title: 'IPv4: адрес и маска',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `IPv4-адрес — 32 бита, записывается как 4 числа 0–255 через точку: 192.168.1.10. Адрес состоит из двух частей: сеть и хост. Где граница — задаёт маска подсети.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Адрес и маска',
                  code: `192.168.1.10/24
│         │  │
│         │  └─ /24 = маска 255.255.255.0 = первые 24 бита — сеть
│         └─ последний октет — номер хоста в сети
└─ сеть: 192.168.1.0

В подсети /24:
  192.168.1.0     — адрес сети (не назначается)
  192.168.1.1     — обычно шлюз
  192.168.1.2..254 — хосты
  192.168.1.255   — broadcast (не назначается)

Итого 254 доступных адреса.`,
                },
                {
                  type: 'table',
                  caption: 'Частные (private) диапазоны',
                  head: ['Диапазон', 'Маска', 'Кто использует'],
                  rows: [
                    ['10.0.0.0 – 10.255.255.255', '/8', 'Крупные сети, корпорации, облака'],
                    ['172.16.0.0 – 172.31.255.255', '/12', 'Средние сети'],
                    ['192.168.0.0 – 192.168.255.255', '/16', 'Домашние роутеры, офисы'],
                    ['127.0.0.0/8', '/8', 'Loopback (127.0.0.1 = localhost)'],
                    ['169.254.0.0/16', '/16', 'Link-local (когда DHCP не сработал)'],
                  ],
                },
                {
                  type: 'note',
                  text: `Частные адреса не маршрутизируются в интернете. Роутер делает NAT: подменяет ваш 192.168.1.10 на свой публичный IP. Поэтому «у меня дома 192.168.1.10» и «у вас дома 192.168.1.10» — не конфликт.`,
                },
              ],
            },
            {
              id: 'nw-l2-s2',
              title: 'IPv6: зачем и как',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `IPv4-адресов 4 миллиарда — кончились в 2011. IPv6 — 128 бит, это 340 ундециллионов адресов. Записывается как 8 групп по 4 hex-цифры: 2001:0db8:85a3:0000:0000:8a2e:0370:7334. Сокращается: 2001:db8:85a3::8a2e:370:7334 (двойное двоеточие = сколько угодно нулей).`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'IPv6 адреса',
                  code: `::1                     — loopback (аналог 127.0.0.1)
fe80::/10               — link-local (автоматически)
2001:db8::/32           — документация (RFC 3849)
2000::/3                — глобальные (публичные)

Сокращение:
  2001:0db8:0000:0000:0000:0000:0000:0001
  → 2001:db8::1

В URL — в квадратных скобках:
  http://[2001:db8::1]:8080/`,
                },
                {
                  type: 'note',
                  text: `IPv6 почти не требует NAT (адресов хватает всем), поддерживает autoconfiguration (SLAAC — устройство само получает адрес), лучше для мобильных сетей. Но: многие сети до сих пор IPv4-only, и dual-stack (IPv4+IPv6 одновременно) — стандарт переходного периода.`,
                },
              ],
            },
            {
              id: 'nw-l2-s3',
              title: 'Порты: как один IP обслуживает много сервисов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Один сервер = один IP. Но на нём работают десятки сервисов: nginx на 80/443, SSH на 22, PostgreSQL на 5432. Различаются они по портам — числу от 0 до 65535.`,
                },
                {
                  type: 'table',
                  caption: 'Известные порты',
                  head: ['Порт', 'Протокол', 'Сервис'],
                  rows: [
                    ['20, 21', 'TCP', 'FTP (данные, управление) — устарел'],
                    ['22', 'TCP', 'SSH'],
                    ['25', 'TCP', 'SMTP (почта)'],
                    ['53', 'TCP/UDP', 'DNS'],
                    ['80', 'TCP', 'HTTP'],
                    ['443', 'TCP', 'HTTPS'],
                    ['3306', 'TCP', 'MySQL / MariaDB'],
                    ['5432', 'TCP', 'PostgreSQL'],
                    ['6379', 'TCP', 'Redis'],
                    ['8080, 8443', 'TCP', 'Альтернативные HTTP/HTTPS (прокси, dev)'],
                    ['27017', 'TCP', 'MongoDB'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Порты в действии',
                  code: `# Какой процесс слушает порт 80?
sudo ss -tlnp | grep :80

# Открыт ли порт на удалённом сервере?
nc -zv server.com 443
telnet server.com 443     # старый способ

# Соединение с сервером: IP:порт
curl https://server.com:8443/api

# В URL: схема://хост:порт/путь
# https://example.com:443/api — стандартный 443, можно не писать
# http://localhost:3000 — нестандартный 3000, обязателен`,
                },
                {
                  type: 'note',
                  text: `Порты 0–1023 — «привилегированные», требуют root для прослушивания. Поэтому nginx на 80 запускается от root (или через capabilities/systemd), а потом сбрасывает привилегии. Порты 1024–65535 — обычные.`,
                },
              ],
            },
            {
              id: 'nw-l2-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Сколько хостов можно адресовать в подсети `192.168.1.0/24`?',
                options: [
                  { id: 'a', text: '256' },
                  { id: 'b', text: '254 (256 минус адрес сети и broadcast)' },
                  { id: 'c', text: '255' },
                  { id: 'd', text: '512' },
                ],
                correct: ['b'],
                explanation:
                  '/24 = 8 бит на хоста (последний октет). 2^8 = 256 адресов. Но .0 — адрес сети, .255 — broadcast, они не назначаются хостам. Итого 254. Для /25 — 126, для /16 — 65534.',
              },
            },
            {
              id: 'nw-l2-s5',
              title: 'Проверь себя: порты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте порт и сервис',
                pairs: [
                  { left: '22', right: 'SSH' },
                  { left: '80', right: 'HTTP' },
                  { left: '443', right: 'HTTPS' },
                  { left: '5432', right: 'PostgreSQL' },
                ],
                explanation:
                  'SSH — 22, HTTP — 80, HTTPS — 443, PostgreSQL — 5432. На собеседовании junior DevOps/QA это база. Дополнительно: MySQL — 3306, Redis — 6379, MongoDB — 27017.',
              },
            },
          ],
        },
        {
          id: 'nw-l3',
          title: 'DNS: как имя превращается в адрес',
          minutes: 35,
          steps: [
            {
              id: 'nw-l3-s1',
              title: 'Иерархия DNS',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'DNS — «телефонная книга интернета». Превращает google.com в IP. Иерархия: корневые серверы (13 кластеров), TLD (com, org, ru), авторитетные серверы домена.' },
                {
                  type: 'mermaid',
                  caption: 'Путь DNS-запроса от клиента до авторитетного сервера',
                  code: 'sequenceDiagram\n    participant C as Клиент\n    participant R as Рекурсивный<br/>резолвер\n    participant Root as Корневой<br/>(.)\n    participant TLD as TLD-сервер<br/>(.com)\n    participant Auth as Авторитетный<br/>(example.com)\n\n    C->>R: IP для example.com?\n    Note over R: кэш пуст\n    R->>Root: кто отвечает за .com?\n    Root-->>R: a.gtld-servers.net\n    R->>TLD: кто отвечает за example.com?\n    TLD-->>R: ns1.example.com\n    R->>Auth: какой IP у example.com?\n    Auth-->>R: 93.184.216.34\n    R-->>C: 93.184.216.34\n    Note over R: кэширует на TTL секунд',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Путь резолвинга',
                  code: 'Хотим узнать IP для example.com\n\n1. Браузер → кэш браузера → кэш ОС → hosts → DNS-сервер провайдера (обычно 8.8.8.8 или 1.1.1.1)\n\n2. Если в кэше нет — рекурсивный резолвер спрашивает:\n   → корневой сервер (.) : «кто отвечает за .com?»\n   ← «a.gtld-servers.net»\n   → TLD-сервер (.com) : «кто отвечает за example.com?»\n   ← «ns1.example.com»\n   → авторитетный сервер example.com : «какой IP у example.com?»\n   ← «93.184.216.34»\n\n3. Ответ кэшируется на TTL секунд (у example.com — обычно 3600)\n\nИтого: 3 запроса, но кэш экономит 99% времени.',
                },
              ],
            },
            {
              id: 'nw-l3-s2',
              title: 'Типы записей',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Основные типы DNS-записей',
                  head: ['Тип', 'Что означает', 'Пример'],
                  rows: [
                    ['A', 'IPv4-адрес', 'example.com → 93.184.216.34'],
                    ['AAAA', 'IPv6-адрес', 'example.com → 2606:2800:220:1::'],
                    ['CNAME', 'Псевдоним (алиас)', 'www.example.com → example.com'],
                    ['MX', 'Почтовый сервер', 'example.com → mail.example.com (приоритет 10)'],
                    ['TXT', 'Текст (SPF, DKIM, верификация)', '"v=spf1 include:_spf.google.com ~all"'],
                    ['NS', 'DNS-сервер домена', 'example.com → ns1.example.com'],
                    ['SOA', 'Метаданные зоны', 'первичный NS, email админа, TTL'],
                    ['CAA', 'Какие CA могут выдавать сертификаты', 'issue "letsencrypt.org"'],
                    ['SRV', 'Сервис с портом', '_sip._tcp.example.com → 5060'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'dig — главный инструмент',
                  code: '# Базовый запрос (A по умолчанию)\ndig example.com\ndig +short example.com             # только ответ\n\n# Конкретный тип записи\ndig example.com MX\ndig example.com TXT\ndig example.com AAAA\n\n# Через конкретный DNS-сервер (проверить, что отдают разные DNS)\ndig @8.8.8.8 example.com\ndig @1.1.1.1 example.com\n\n# Проследить путь резолвинга\ndig +trace example.com\n\n# Обратный резолвинг (IP → имя)\ndig -x 8.8.8.8',
                },
                { type: 'note', text: 'TTL (Time To Live) — сколько секунд DNS-ответ кэшируется. Низкий TTL (60–300) — быстрые изменения, но больше нагрузки на DNS. Высокий (3600–86400) — быстрее для клиентов, но изменения «доходят» медленно. При переезде сайта TTL снижают за день до переезда, чтобы старый IP «отпустил» быстрее.' },
              ],
            },
            {
              id: 'nw-l3-s3',
              title: 'CNAME vs A: когда что',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'CNAME — псевдоним, A — конкретный IP. Разница важна: CNAME нельзя ставить на apex-домен (example.com), только на поддомены. Это ограничение стандарта DNS: apex уже имеет обязательные NS и SOA записи, а CNAME не может сосуществовать с другими записями.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'CNAME vs A',
                  code: 'A-запись (конкретный IP):\n  example.com        → 93.184.216.34\n  www.example.com    → 93.184.216.34\n\nCNAME (псевдоним):\n  www.example.com    → CNAME → example.com\n  (при запросе www.example.com DNS идёт по цепочке: www → example.com → IP)\n\nПроблема CNAME на apex:\n  example.com не может быть CNAME, потому что у него уже есть:\n    example.com NS   ns1.example.com\n    example.com SOA  ...\n  DNS-стандарт: CNAME не сосуществует с другими записями.\n\nРешение для apex (ALIAS / ANAME):\n  Некоторые провайдеры (Cloudflare, Route53) поддерживают\n  ALIAS — «CNAME на apex», работающий на уровне DNS-провайдера.',
                },
                {
                  type: 'list',
                  items: [
                    'A — конкретный IP, можно на apex',
                    'CNAME — псевдоним, только на поддомены',
                    'CNAME на apex ломает NS/SOA — стандарт запрещает',
                    'ALIAS/ANAME — «CNAME на apex» от провайдера (Cloudflare, Route53)',
                    'При смене IP: A — править везде, CNAME — в одном месте (родительский домен)',
                  ],
                },
                { type: 'note', text: 'На собеседовании junior DevOps: «почему CNAME нельзя на apex?» — «потому что apex уже имеет NS и SOA, а стандарт запрещает CNAME с другими записями». «Как обойти?» — «ALIAS/ANAME у провайдера». Частый вопрос.' },
              ],
            },
            {
              id: 'nw-l3-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая DNS-запись указывает, что `www.example.com` — это тот же сайт, что `example.com`?',
                options: [
                  { id: 'a', text: 'A-запись' },
                  { id: 'b', text: 'CNAME-запись' },
                  { id: 'c', text: 'MX-запись' },
                  { id: 'd', text: 'TXT-запись' },
                ],
                correct: ['b'],
                explanation:
                  'CNAME — «каноническое имя», псевдоним. www.example.com → CNAME → example.com. A-запись — конкретный IP, MX — почта, TXT — текст (SPF/DKIM). CNAME нельзя ставить на apex-домен (example.com), только на поддомены.',
              },
            },
            {
              id: 'nw-l3-s5',
              title: 'Проверь себя: записи',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте DNS-запись и её назначение',
                pairs: [
                  { left: 'A', right: 'IPv4-адрес (example.com → 1.2.3.4)' },
                  { left: 'MX', right: 'Почтовый сервер домена' },
                  { left: 'TXT', right: 'SPF / DKIM / верификация' },
                  { left: 'CAA', right: 'Какие CA могут выдавать сертификаты' },
                ],
                explanation:
                  'A — IPv4. MX — почта. TXT — текст (SPF, DKIM, verification). CAA — какие Certificate Authority имеют право выдавать сертификат. Ещё важны: AAAA (IPv6), CNAME (псевдоним), NS (DNS-сервер домена), SOA (метаданные зоны).',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'nw-m2',
      title: 'Транспорт и HTTP',
      lessons: [
        {
          id: 'nw-l4',
          title: 'TCP и UDP',
          minutes: 30,
          steps: [
            {
              id: 'nw-l4-s1',
              title: 'Два транспорта — два компромисса',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'TCP vs UDP',
                  head: ['Свойство', 'TCP', 'UDP'],
                  rows: [
                    ['Соединение', 'Устанавливается (3-way handshake)', 'Нет, «выстрелил и забыл»'],
                    ['Надёжность', 'Гарантирует доставку, порядок', 'Не гарантирует ни доставку, ни порядок'],
                    ['Скорость', 'Медленнее (заголовки, ACK)', 'Быстрее'],
                    ['Повторы', 'Переспрашивает потерянные пакеты', 'Не переспрашивает'],
                    ['Применение', 'HTTP/1.1, HTTP/2, SSH, почта, БД', 'DNS, VoIP, видео, игры, HTTP/3 (QUIC)'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Установка TCP-соединения (3-way handshake)',
                  code: 'sequenceDiagram\n    participant C as Клиент\n    participant S as Сервер\n\n    C->>S: SYN (я хочу соединиться)\n    S->>C: SYN-ACK (согласен)\n    C->>S: ACK (подтверждаю)\n\n    Note over C,S: Соединение установлено\n    C->>S: Данные\n    S->>C: Данные',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: '3-way handshake (TCP)',
                  code: 'Клиент                          Сервер\n   │                              │\n   │──── SYN (seq=100) ──────────▶│\n   │                              │\n   │◀─── SYN-ACK (seq=300, ack=101)│\n   │                              │\n   │──── ACK (ack=301) ──────────▶│\n   │                              │\n   │◀══════ данные ══════════════▶│\n   │                              │\n\nЗачем: убедиться, что обе стороны могут отправлять и принимать.\nОдна «полуоткрытая» отправка — не гарантирует, что сервер ответит.\n\nПри закрытии — 4-way: FIN → ACK → FIN → ACK.',
                },
                { type: 'note', text: 'HTTP/3 использует QUIC — это UDP + собственная реализация надёжности в userspace. Плюс: не блокируется при потере пакета (в TCP все следующие пакеты ждут потерянный — «head-of-line blocking»). На собеседовании «почему HTTP/3 на UDP» — ответ QUIC.' },
              ],
            },
            {
              id: 'nw-l4-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте протокол и транспорт, на котором он работает',
                pairs: [
                  { left: 'HTTP/1.1, HTTP/2', right: 'TCP' },
                  { left: 'HTTP/3', right: 'QUIC (поверх UDP)' },
                  { left: 'DNS (обычный)', right: 'UDP' },
                  { left: 'SSH', right: 'TCP' },
                ],
                explanation:
                  'HTTP/1.1, 2 и SSH — TCP (надёжность важнее). HTTP/3 — QUIC поверх UDP (независимые потоки, быстрее на плохих сетях). DNS — обычно UDP (короткий запрос, повтор при потере). На собеседовании «почему HTTP/3 на UDP» — ответ QUIC.',
              },
            },
            {
              id: 'nw-l4-s3',
              title: 'Когда TCP, а когда UDP',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Выбор между TCP и UDP — не «что лучше», а «что важнее в задаче». Надёжность и порядок (TCP) или скорость и низкая задержка (UDP).' },
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Сценарий', 'Транспорт', 'Почему'],
                  rows: [
                    ['HTTP API, сайты, БД', 'TCP', 'Потеря пакета — ошибка, порядок критичен'],
                    ['SSH, Git по SSH', 'TCP', 'Интерактивность, надёжность'],
                    ['Видеозвонки, стриминг', 'UDP', 'Потеря кадра — не критично, задержка критична'],
                    ['Онлайн-игры', 'UDP', 'Задержка важнее, потеря пакета — не страшна'],
                    ['DNS', 'UDP (обычно)', 'Короткий запрос, повтор при потере дешевле'],
                    ['VPN (WireGuard)', 'UDP', 'Скорость, туннелирование'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'TCP: гарантированная доставка, порядок, контроль потока',
                    'UDP: скорость, низкая задержка, приложение само решает, что делать с потерями',
                    'TCP не «лучше» — для real-time UDP выигрывает',
                    'HTTP/3 — попытка взять лучшее из обоих: UDP + надёжность в QUIC',
                  ],
                },
                { type: 'note', text: 'Правило: если «потеря одного пакета = катастрофа» — TCP. Если «потеря = лёгкое ухудшение, но задержка критична» — UDP. Для real-time (звонки, игры) TCP создаёт «заторы»: пакет потерян, TCP ждёт его переотправки, всё останавливается. UDP — просто пропускает и идёт дальше.' },
              ],
            },
            {
              id: 'nw-l4-s4',
              title: 'Порты: как один IP обслуживает много сервисов',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'IP-адрес идентифицирует хост, порт — сервис на нём. Один сервер с одним IP может держать nginx на 80/443, SSH на 22, PostgreSQL на 5432 — и всё это одновременно. Порты — часть Transport-слоя (TCP/UDP).' },
                {
                  type: 'table',
                  caption: 'Известные порты',
                  head: ['Порт', 'Протокол', 'Сервис'],
                  rows: [
                    ['22', 'TCP', 'SSH'],
                    ['53', 'TCP/UDP', 'DNS'],
                    ['80', 'TCP', 'HTTP'],
                    ['443', 'TCP', 'HTTPS'],
                    ['3306', 'TCP', 'MySQL / MariaDB'],
                    ['5432', 'TCP', 'PostgreSQL'],
                    ['6379', 'TCP', 'Redis'],
                    ['27017', 'TCP', 'MongoDB'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка портов',
                  code: '# Какой процесс слушает порт 80?\nsudo ss -tlnp | grep :80\n\n# Открыт ли порт на удалённом сервере?\nnc -zv server.com 443\ntelnet server.com 443     # старый способ\n\n# Соединение с сервером: IP:порт\ncurl https://server.com:8443/api',
                },
                { type: 'note', text: 'Порты 0–1023 — привилегированные (нужен root). Поэтому nginx на 80 запускается от root (или через capabilities/systemd), потом сбрасывает привилегии. Порты 1024–65535 — обычные. На собеседовании junior DevOps: «где живёт порт — на каком слое?» — «Transport (4 по OSI)».' },
              ],
            },
            {
              id: 'nw-l4-s5',
              title: 'Проверь себя: когда UDP',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему видеозвонки (Zoom, Google Meet) используют UDP, а не TCP?',
                options: [
                  { id: 'a', text: 'UDP безопаснее' },
                  { id: 'b', text: 'Потеря пакета — не критична, а задержка критична; TCP создаёт «заторы» при потерях' },
                  { id: 'c', text: 'TCP не поддерживает видео' },
                  { id: 'd', text: 'UDP быстрее на всех задачах' },
                ],
                correct: ['b'],
                explanation:
                  'В реальном времени важнее задержка. Если TCP теряет пакет, он останавливает все следующие, пока не переспросит — звонок «зависает». UDP просто пропускает потерянный кадр (лёгкое ухудшение качества), но не останавливает поток. Для real-time UDP выигрывает.',
              },
            },
          ],
        },
        {
          id: 'nw-l5',
          title: 'HTTP: методы, статусы, заголовки',
          minutes: 35,
          steps: [
            {
              id: 'nw-l5-s1',
              title: 'Структура HTTP-сообщения',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'HTTP/1.1 запрос и ответ',
                  code: `GET /users/1 HTTP/1.1
Host: api.example.com
User-Agent: curl/8.0
Accept: application/json
Authorization: Bearer eyJhbGci...
Cookie: session=abc123

{  ← пустое тело у GET
}  ←

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45
Cache-Control: max-age=3600
Set-Cookie: session=def456; HttpOnly

{"id": 1, "name": "Anna", "email": "a@x.com"}`,
                },
                {
                  type: 'list',
                  items: [
                    'Request line: METHOD путь HTTP/версия',
                    'Headers: Key: Value — метаданные запроса',
                    'Пустая строка',
                    'Body (тело): данные для POST/PUT/PATCH',
                    'Response line: HTTP/версия STATUS REASON',
                  ],
                },
              ],
            },
            {
              id: 'nw-l5-s2',
              title: 'HTTP-методы',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Методы и их семантика',
                  head: ['Метод', 'Безопасный?', 'Идемпотентный?', 'Что делает'],
                  rows: [
                    ['GET', 'Да', 'Да', 'Получить ресурс. Не меняет состояние'],
                    ['HEAD', 'Да', 'Да', 'Как GET, но без тела ответа'],
                    ['POST', 'Нет', 'Нет', 'Создать ресурс / выполнить действие'],
                    ['PUT', 'Нет', 'Да', 'Заменить ресурс целиком'],
                    ['PATCH', 'Нет', 'Нет', 'Частично обновить ресурс'],
                    ['DELETE', 'Нет', 'Да', 'Удалить ресурс'],
                    ['OPTIONS', 'Да', 'Да', 'Узнать допустимые методы (CORS preflight)'],
                  ],
                },
                {
                  type: 'p',
                  text: `Безопасный (safe) — не меняет состояние на сервере. Идемпотентный — повторный вызов даёт тот же результат. GET, HEAD, PUT, DELETE — идемпотентные. POST — нет: два POST создадут два заказа. PATCH — тоже нет, если внутри «инкремент».`,
                },
                {
                  type: 'note',
                  text: `На собеседовании QA: «Почему GET не должен менять состояние?» — потому что GET кэшируется, индексируется краулерами, повторяется браузером при F5. Если GET делает DELETE — краулер удалит данные. Поэтому «изменить состояние — POST/PUT/PATCH/DELETE».`,
                },
              ],
            },
            {
              id: 'nw-l5-s3',
              title: 'HTTP-статусы',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Категории статусов',
                  head: ['Диапазон', 'Смысл', 'Примеры'],
                  rows: [
                    ['1xx', 'Информационные', '100 Continue, 101 Switching Protocols (WebSocket)'],
                    ['2xx', 'Успех', '200 OK, 201 Created, 204 No Content'],
                    ['3xx', 'Редиректы', '301 Moved Permanently, 302 Found, 304 Not Modified'],
                    ['4xx', 'Ошибка клиента', '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 429 Too Many Requests'],
                    ['5xx', 'Ошибка сервера', '500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что важно различать',
                  code: `401 Unauthorized — «не аутентифицирован» (нет токена, токен истёк)
403 Forbidden      — «аутентифицирован, но прав нет»

400 Bad Request    — синтаксическая ошибка в запросе
422 Unprocessable  — синтаксис ок, но данные невалидны

301 Moved Permanently — «навсегда», кэшируется
302 Found             — «временно», не кэшируется
304 Not Modified      — «не изменилось, бери из кэша»

502 Bad Gateway       — nginx не достучался до бэкенда
504 Gateway Timeout   — nginx достучался, но бэкенд не ответил вовремя`,
                },
                {
                  type: 'note',
                  text: `Разница 401/403 — классический вопрос. 401 = «кто ты?» (нужна аутентификация). 403 = «я знаю, кто ты, но тебе нельзя» (авторизация). Оба возвращают 401, если токен невалиден; 403 — если токен валиден, но прав нет.`,
                },
              ],
            },
            {
              id: 'nw-l5-s4',
              title: 'Заголовки: самые важные',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Ключевые заголовки',
                  head: ['Заголовок', 'Направление', 'Зачем'],
                  rows: [
                    ['Host', 'Запрос', 'Какой домен запрашивается (виртуальные хосты)'],
                    ['User-Agent', 'Запрос', 'Браузер/клиент — для аналитики и совместимости'],
                    ['Accept', 'Запрос', 'Какие типы ответа клиент понимает'],
                    ['Authorization', 'Запрос', 'Bearer-токен или Basic-креды'],
                    ['Cookie', 'Запрос', 'Сессионные данные'],
                    ['Content-Type', 'Оба', 'Тип тела: application/json, text/html, multipart/form-data'],
                    ['Content-Length', 'Оба', 'Размер тела в байтах'],
                    ['Cache-Control', 'Ответ', 'Как кэшировать: max-age=3600, no-cache'],
                    ['Set-Cookie', 'Ответ', 'Установить cookie (с HttpOnly, Secure, SameSite)'],
                    ['Location', 'Ответ', 'Куда редирект (3xx)'],
                    ['ETag', 'Ответ', 'Хэш версии ресурса для кэша'],
                    ['Access-Control-Allow-Origin', 'Ответ', 'CORS — каким доменам разрешено'],
                  ],
                },
                {
                  type: 'note',
                  text: `Content-Type: application/json; charset=utf-8 — важно указывать. Без Content-Type сервер может «не понять» тело или интерпретировать как text/plain. Для multipart/form-data (загрузка файлов) — обязательно с boundary (браузер сам добавляет).`,
                },
              ],
            },
            {
              id: 'nw-l5-s5',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём разница между 401 Unauthorized и 403 Forbidden?',
                options: [
                  { id: 'a', text: 'Никакой, это синонимы' },
                  { id: 'b', text: '401 — не аутентифицирован («кто ты?»), 403 — аутентифицирован, но прав нет («тебе нельзя»)' },
                  { id: 'c', text: '401 — ошибка клиента, 403 — ошибка сервера' },
                  { id: 'd', text: '401 — для API, 403 — для веба' },
                ],
                correct: ['b'],
                explanation:
                  '401 = «нужна аутентификация» (нет токена, токен невалиден). 403 = «токен валиден, но доступ запрещён» (например, обычный пользователь хочет в /admin). На собеседовании QA/backend это спрашивают часто.',
              },
            },
            {
              id: 'nw-l5-s6',
              title: 'Проверь себя: идемпотентность',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие методы идемпотентны (повторный вызов даёт тот же результат)?',
                options: [
                  { id: 'a', text: 'GET' },
                  { id: 'b', text: 'PUT' },
                  { id: 'c', text: 'POST' },
                  { id: 'd', text: 'DELETE' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'GET, PUT, DELETE идемпотентны: 10 раз GET /users/1 — тот же результат, 10 раз DELETE /users/1 — первое удалит, остальные вернут 404 (но состояние не меняется). POST — нет: 10 раз POST /orders создадут 10 заказов.',
              },
            },
          ],
        },
        {
          id: 'nw-l6',
          title: 'HTTP/2 и HTTP/3',
          minutes: 30,
          steps: [
            {
              id: 'nw-l6-s1',
              title: 'Проблема HTTP/1.1',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'HTTP/1.1 — один запрос за раз на соединение. Браузер открывает 6 соединений на домен — параллелизм ограничен. Каждый запрос тащит заголовки (500+ байт). На мобильных и медленных сетях — медленно.' },
                {
                  type: 'table',
                  caption: 'Эволюция HTTP',
                  head: ['Версия', 'Транспорт', 'Параллелизм', 'Заголовки'],
                  rows: [
                    ['HTTP/1.0', 'TCP', 'Один запрос на соединение', 'Текстовые, каждый раз'],
                    ['HTTP/1.1', 'TCP', '6 соединений на домен', 'Текстовые, каждый раз'],
                    ['HTTP/2', 'TCP', 'Мультиплексирование (1 соединение, много потоков)', 'HPACK (сжатые)'],
                    ['HTTP/3', 'UDP (QUIC)', 'Мультиплексирование без head-of-line', 'QPACK'],
                  ],
                },
                { type: 'note', text: 'HTTP/2 мультиплексирует — в одном TCP-соединении идут параллельные запросы. Но: если один пакет потерян, TCP останавливает ВСЁ (head-of-line blocking). HTTP/3 на QUIC решает это: потоки независимы.' },
              ],
            },
            {
              id: 'nw-l6-s2',
              title: 'HTTP/2: что изменилось',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Мультиплексирование: много запросов в одном TCP-соединении',
                    'HPACK: сжатие заголовков (одинаковые заголовки сжимаются в 1 байт)',
                    'Server Push: сервер сам отправляет ресурсы (устарело, редко используется)',
                    'Приоритеты потоков (stream priority)',
                    'Бинарный протокол (не текст) — быстрее парсить, но сложнее дебажить',
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как проверить версию',
                  code: `# Через curl\ncurl -I --http2 https://example.com\n# HTTP/2 200\n\ncurl -I --http3 https://cloudflare.com\n# HTTP/3 200 (нужен curl с поддержкой HTTP/3)\n\n# В браузере: DevTools → Network → колонка Protocol\n# h2 = HTTP/2, h3 = HTTP/3, http/1.1\n\n# Через nghttp (если установлен)\nnghttp -v https://example.com`,
                },
                { type: 'note', text: 'HTTP/2 обязателен по факту: почти все сайты с HTTPS работают на нём. Если ваш сайт на HTTP/1.1 — вы теряете скорость на каждом запросе. Включение HTTP/2 в nginx — одна строка в конфиге (listen 443 ssl http2).' },
              ],
            },
            {
              id: 'nw-l6-s3',
              title: 'Проверь себя: HTTP/2 vs HTTP/3',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему HTTP/3 работает на UDP, а не на TCP?',
                options: [
                  { id: 'a', text: 'UDP быстрее, но ненадёжнее — и это не важно' },
                  { id: 'b', text: 'QUIC (поверх UDP) реализует надёжность и порядок сам, без head-of-line blocking TCP' },
                  { id: 'c', text: 'Это историческое недоразумение' },
                  { id: 'd', text: 'UDP безопаснее TCP' },
                ],
                correct: ['b'],
                explanation:
                  'QUIC — транспорт поверх UDP: сам управляет доставкой, порядком, шифрованием. Потоки в QUIC независимы: потеря в одном не блокирует другие. Это решает head-of-line blocking HTTP/2 (на TCP). На собеседовании «почему HTTP/3 на UDP» — ответ QUIC.',
              },
            },
            {
              id: 'nw-l6-s4',
              title: 'Head-of-line blocking: главная проблема',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Head-of-line blocking (HOL) — «блокировка головой очереди». В TCP пакеты должны прийти по порядку: если пакет №5 потерян, пакеты №6, 7, 8 ждут, пока №5 не будет переотправлен. Для HTTP/2 это катастрофа: один потерянный пакет останавливает все параллельные потоки в соединении.' },
                {
                  type: 'mermaid',
                  caption: 'HOL blocking в TCP: один потерянный пакет блокирует всё',
                  code: 'graph LR\n    P1["Пакет 1<br/>✅"] --> P2["Пакет 2<br/>✅"]\n    P2 --> P3["Пакет 3<br/>❌ потерян"]\n    P3 -.->|"все ждут"| P4["Пакет 4<br/>⏸ ждёт"]\n    P3 -.->|"все ждут"| P5["Пакет 5<br/>⏸ ждёт"]\n    P3 -.->|"переотправка"| P3b["Пакет 3<br/>✅ (retry)"]\n    P3b --> P4b["Пакет 4<br/>✅"]',
                },
                {
                  type: 'list',
                  items: [
                    'HTTP/2 на TCP: один потерянный пакет = все потоки стоят',
                    'Особенно больно на мобильных (потери 1–5%)',
                    'QUIC (HTTP/3) решает: каждый поток независим',
                    'Потеря в потоке A не блокирует поток B',
                    'Отсюда HTTP/3 быстрее на плохих сетях в 2–3 раза',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «почему HTTP/3 быстрее HTTP/2?» — ответ «решает head-of-line blocking TCP, потоки независимы». На хорошем Wi-Fi разница незаметна, на мобильной сети с потерями — в разы. Именно поэтому Google, Cloudflare, Facebook отдают h3.' },
              ],
            },
            {
              id: 'nw-l6-s5',
              title: 'Проверь себя: HOL blocking',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какую проблему HTTP/2 решает HTTP/3?',
                options: [
                  { id: 'a', text: 'Сжатие заголовков' },
                  { id: 'b', text: 'Head-of-line blocking: потеря одного пакета не блокирует остальные потоки' },
                  { id: 'c', text: 'TLS-шифрование' },
                  { id: 'd', text: 'Поддержку cookies' },
                ],
                correct: ['b'],
                explanation:
                  'HTTP/2 мультиплексирует потоки в одном TCP-соединении, но HOL blocking TCP блокирует все потоки при потере пакета. HTTP/3 (QUIC) даёт независимые потоки: потеря в одном не тормозит остальные. Сжатие (HPACK/QPACK) и TLS есть в обоих, cookies — это Application-уровень, не Transport.',
              },
            },
          ],
        },
        {
          id: 'nw-l7',
          title: 'HTTPS и TLS',
          minutes: 35,
          steps: [
            {
              id: 'nw-l7-s1',
              title: 'Что даёт HTTPS',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Шифрование — никто по пути не прочитает трафик',
                    'Аутентификация — сервер тот, за кого себя выдаёт (сертификат)',
                    'Целостность — данные не подменены по пути (MAC)',
                  ],
                },
                { type: 'p', text: 'HTTPS = HTTP + TLS. Порт 443. Раньше был SSL (устарел), сейчас TLS 1.2 / TLS 1.3. Браузер и сервер договариваются через TLS-рукопожатие.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'TLS 1.3 handshake (упрощённо)',
                  code: `Клиент                                Сервер\n   │                                    │\n   │──── ClientHello ──────────────────▶│\n   │     (версии TLS, шифры, SNI=домен) │\n   │                                    │\n   │◀─── ServerHello ──────────────────│\n   │     (выбранный шифр, сертификат)   │\n   │                                    │\n   │  [проверка сертификата]            │\n   │  [обмен ключами через ECDHE]       │\n   │                                    │\n   │◀══════ шифрованный HTTP ═════════▶│\n   │                                    │\n\nTLS 1.2 — 2 RTT, TLS 1.3 — 1 RTT (быстрее).\n0-RTT (resumption) — ещё быстрее при повторном подключении.`,
                },
                { type: 'note', text: 'SNI (Server Name Indication) — в ClientHello клиент передаёт домен, чтобы сервер знал, какой сертификат отдать. Без SNI на одном IP нельзя было бы держать 100 HTTPS-сайтов. С SNI — можно (и это стандарт).' },
              ],
            },
            {
              id: 'nw-l7-s2',
              title: 'Сертификаты и цепочка доверия',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Сертификат — это «паспорт» сервера, подписанный удостоверяющим центром (CA — Certificate Authority). Браузеры доверяют ~150 корневым CA (Let\'s Encrypt, DigiCert, GlobalSign). CA подписывает сертификат сервера своим ключом — цепочка доверия.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Цепочка доверия',
                  code: `Корневой сертификат (встроен в ОС/браузер)\n  └── Intermediate CA (подписан корневым)\n        └── Сертификат сервера example.com\n              (подписан Intermediate)\n\nБраузер проверяет: сервер → Intermediate → Корневой (в trust store)\nЕсли цепочка сходится и сертификат не истёк и домен совпадает — ОК`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка сертификата',
                  code: `# Показать сертификат сервера\necho | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -text\n\n# Только даты и CN\nopenssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject\n\n# Что отдаёт цепочку\nopenssl s_client -connect example.com:443 -showcerts\n\n# curl с проверкой\ncurl -vI https://example.com 2>&1 | grep -i "SSL certificate"\n\n# Проверить срок через curl\ncurl -vI https://example.com 2>&1 | grep expire`,
                },
                { type: 'note', text: '«Сертификат истёк» — самая частая проблема. Let\'s Encrypt — 90 дней, автопродление через certbot/acme.sh. Просрочка = браузер показывает предупреждение, API-клиенты отказываются. В CI — проверка «сертификат истекает в ближайшие 30 дней» — стандартная практика.' },
              ],
            },
            {
              id: 'nw-l7-s3',
              title: 'TLS: практические вопросы',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'HSTS (Strict-Transport-Security) — «всегда HTTPS для этого домена», даже при вводе http://',
                    'Let\'s Encrypt — бесплатные сертификаты, 90 дней, автопродление',
                    'Wildcard (*.example.com) — один сертификат на все поддомены',
                    'SNI — несколько доменов на одном IP',
                    'Certificate Pinning — жёсткая привязка к сертификату (мобильные приложения)',
                    'OCSP Stapling — быстрая проверка «сертификат не отозван»',
                  ],
                },
                { type: 'note', text: 'TLS не «шифрует всё подряд»: после рукопожатия HTTP-данные шифруются, но IP-адреса и порты — видны. DPI (глубокий анализ трафика) может видеть SNI (домен). ECH (Encrypted Client Hello) — новая технология, скрывает и SNI.' },
              ],
            },
            {
              id: 'nw-l7-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что проверяет браузер при TLS-соединении?',
                options: [
                  { id: 'a', text: 'Только срок действия сертификата' },
                  { id: 'b', text: 'Срок, соответствие домену, цепочку до доверенного CA, отзыв' },
                  { id: 'c', text: 'Только домен' },
                  { id: 'd', text: 'Ничего, TLS — только про шифрование' },
                ],
                correct: ['b'],
                explanation:
                  'Браузер проверяет 4 вещи: (1) срок действия, (2) домен в сертификате = домен запроса (CN/SAN), (3) цепочка до доверенного корневого CA, (4) сертификат не отозван (OCSP/CRL). Если хоть одно не сходится — предупреждение или отказ.',
              },
            },
            {
              id: 'nw-l7-s5',
              title: 'Проверь себя: 0-RTT и SNI',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте термин и его назначение',
                pairs: [
                  { left: 'SNI', right: 'Несколько доменов на одном IP (передаётся в ClientHello)' },
                  { left: '0-RTT', right: 'Быстрое повторное подключение без полного handshake' },
                  { left: 'HSTS', right: 'Всегда HTTPS для домена, даже при http://' },
                  { left: 'OCSP Stapling', right: 'Сервер сам прикладывает «сертификат не отозван»' },
                ],
                explanation:
                  'SNI — «какой домен просит клиент». 0-RTT — «повторное подключение без ожидания». HSTS — «принудительный HTTPS». OCSP Stapling — «быстрая проверка отзыва». 0-RTT уязвим к replay: не использовать для POST/платежей. На собеседовании senior DevOps это любят.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'nw-m3',
      title: 'Прокси, WebSocket, диагностика',
      lessons: [
        {
          id: 'nw-l8',
          title: 'Прокси, CDN, балансировщики',
          minutes: 35,
          steps: [
            {
              id: 'nw-l8-s1',
              title: 'Прямой и обратный прокси',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Forward proxy скрывает клиента, reverse — бэкенд',
                  code: 'graph LR\n    subgraph Forward["Forward proxy<br/>(скрывает клиента)"]\n        C1["Клиент"] -->|"настраивает<br/>клиент"| FP["VPN,<br/>корпоративный прокси"]\n        FP --> Internet["Интернет"]\n    end\n    subgraph Reverse["Reverse proxy<br/>(скрывает бэкенд)"]\n        Internet2["Интернет"] --> RP["Nginx, HAProxy,<br/>ALB"]\n        RP --> B1["Backend 1"]\n        RP --> B2["Backend 2"]\n    end',
                },
                {
                  type: 'table',
                  caption: 'Forward vs Reverse proxy',
                  head: ['Тип', 'Кто настраивает', 'Что делает', 'Пример'],
                  rows: [
                    ['Forward (прямой)', 'Клиент', 'Клиент → прокси → интернет. Скрывает клиента', 'VPN, корпоративный прокси, Tor'],
                    ['Reverse (обратный)', 'Сервер', 'Интернет → прокси → N серверов. Скрывает бэкенд', 'Nginx, HAProxy, Envoy, AWS ALB'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Reverse proxy: зачем',
                  code: `Интернет\n   │\n   ▼\n[ Nginx — 1 публичный IP :443 ]\n   │  TLS-терминация здесь\n   │  маршрутизация по пути/домену\n   │  rate limiting\n   │  кэширование статики\n   │\n   ├── /api/*     → backend:8000\n   ├── /static/*  → файлы на диске\n   └── /          → frontend:3000\n\nЗачем:\n  • Один IP/порт для всех сервисов\n  • TLS в одном месте (certbot обновляет сертификаты здесь)\n  • Кэширование, сжатие, HTTP/2\n  • Rate limiting, защита от DDoS\n  • Балансировка между репликами backend\n  • Голубой/зелёный деплой (переключение upstream)`,
                },
                { type: 'note', text: 'nginx — самый популярный reverse proxy. В K8s ту же роль выполняет Ingress (обычно nginx-ingress-controller). В облаках — AWS ALB, GCP LB. Всё это — reverse proxy с разной степенью «умности».' },
              ],
            },
            {
              id: 'nw-l8-s2',
              title: 'CDN и балансировка',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'CDN (Content Delivery Network) — сеть серверов по миру, которые кэшируют ваш контент ближе к пользователю. Cloudflare, Akamai, AWS CloudFront, Fastly. Пользователь из Москвы получает файл с сервера в Москве, а не из США.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как работает CDN',
                  code: `Пользователь в Москве → ближайший edge-сервер CDN (Москва)\n   │\n   │ Если в кэше есть → отдаёт сразу (10 мс)\n   │\n   └ Если нет → идёт к origin (сервер в США)\n                  ↓\n               кэширует у себя\n                  ↓\n               отдаёт пользователю (500 мс в первый раз, 10 мс потом)\n\nКэширование:\n  Cache-Control: max-age=3600 — кэшировать 1 час\n  ETag — проверка «изменилось ли»\n  Vary: Accept-Encoding — разные версии для gzip/br\n\nЧто кэшируют: статику (js, css, картинки), иногда HTML/API\nЧто НЕ кэшируют: персональные данные, авторизованные запросы`,
                },
                {
                  type: 'table',
                  caption: 'Алгоритмы балансировки',
                  head: ['Алгоритм', 'Как работает', 'Когда'],
                  rows: [
                    ['Round Robin', 'По кругу: 1 → 2 → 3 → 1', 'Все серверы равны'],
                    ['Least Connections', 'На сервер с минимумом активных соединений', 'Разная нагрузка запросов'],
                    ['IP Hash', 'Один клиент всегда на один сервер', 'Sticky sessions'],
                    ['Weighted', 'Сервер с весом 2 получает 2× запросов', 'Разная мощность'],
                    ['Random', 'Случайно', 'Просто'],
                  ],
                },
                { type: 'note', text: 'CDN — не только про статику. Cloudflare, Fastly умеют кэшировать API (с Vary), делать WAF, защиту от DDoS, edge-compute. «Положили за Cloudflare» — стандарт для публичных сайтов.' },
              ],
            },
            {
              id: 'nw-l8-s3',
              title: 'Проверь себя: reverse proxy',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем reverse proxy отличается от forward proxy?',
                options: [
                  { id: 'a', text: 'Reverse работает только с HTTPS' },
                  { id: 'b', text: 'Forward настраивает клиент (скрывает клиента), reverse — сервер (скрывает бэкенд)' },
                  { id: 'c', text: 'Forward быстрее' },
                  { id: 'd', text: 'Это одно и то же' },
                ],
                correct: ['b'],
                explanation:
                  'Forward proxy: клиент говорит «сходи в интернет за меня», прокси скрывает клиента (VPN, корпоративный прокси). Reverse proxy: интернет приходит на прокси, он раздаёт запросы бэкенду, скрывает серверы (nginx, ALB). На собеседовании DevOps это база.',
              },
            },
            {
              id: 'nw-l8-s4',
              title: 'Load balancing: L4 vs L7',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Балансировщики работают на разных уровнях OSI. L4 (TCP/UDP) — быстрее, но «глупее». L7 (HTTP) — умнее, но медленнее. Выбор зависит от задачи.' },
                {
                  type: 'table',
                  caption: 'L4 vs L7',
                  head: ['Уровень', 'Что видит', 'Плюсы', 'Минусы'],
                  rows: [
                    ['L4 (TCP/UDP)', 'IP и порт', 'Быстро, любой протокол', 'Не видит HTTP, не умеет маршрутизировать по пути'],
                    ['L7 (HTTP)', 'HTTP-заголовки, URL, cookies', 'Маршрутизация по пути/хосту, sticky по cookie, WAF', 'Медленнее, только HTTP/HTTPS'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'L4: AWS NLB, HAProxy в TCP-режиме, IPVS в K8s',
                    'L7: AWS ALB, nginx, Envoy, Traefik, Ingress в K8s',
                    'L4 — для TCP-балансировки (БД, gRPC, WebSocket)',
                    'L7 — для HTTP-маршрутизации (по path, host, headers)',
                    'В K8s Service типа LoadBalancer — обычно L4, Ingress — L7',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior DevOps: «чем L4 отличается от L7 балансировщика?» — «L4 видит только IP/порт, L7 — HTTP-запросы и может маршрутизировать по path/host». AWS ALB — L7, NLB — L4. nginx может работать в обоих режимах (stream {} — L4, http {} — L7).' },
              ],
            },
            {
              id: 'nw-l8-s5',
              title: 'Проверь себя: балансировка',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте алгоритм и его поведение',
                pairs: [
                  { left: 'Round Robin', right: 'По кругу: 1 → 2 → 3 → 1' },
                  { left: 'Least Connections', right: 'На сервер с минимумом активных соединений' },
                  { left: 'IP Hash', right: 'Один клиент всегда на один сервер (sticky)' },
                  { left: 'Weighted', right: 'Сервер с весом 2 получает 2× запросов' },
                ],
                explanation:
                  'Round Robin — по очереди. Least Connections — на самый свободный. IP Hash — sticky sessions. Weighted — разная мощность серверов. На собеседовании спросят «какой алгоритм выбрать для sticky?» — IP Hash или cookie-based affinity (L7).',
              },
            },
          ],
        },
        {
          id: 'nw-l9',
          title: 'WebSocket и realtime',
          minutes: 30,
          steps: [
            {
              id: 'nw-l9-s1',
              title: 'Проблема realtime по HTTP',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'HTTP — «запрос-ответ». Сервер не может «прислать» данные клиенту по своей инициативе. Для чата, нотификаций, биржевых котировок нужен push. Исторически — polling (клиент спрашивает каждую секунду), SSE (Server-Sent Events), WebSocket (двусторонний канал).' },
                {
                  type: 'table',
                  caption: 'Способы realtime',
                  head: ['Способ', 'Направление', 'Когда'],
                  rows: [
                    ['Short polling', 'Клиент → сервер, каждые N сек', 'Просто, но нагрузка и задержка'],
                    ['Long polling', 'Клиент держит запрос открытым', 'Лучше short, но сложнее'],
                    ['SSE (Server-Sent Events)', 'Сервер → клиент, однонаправленно', 'Уведомления, лента, прогресс'],
                    ['WebSocket', 'Двусторонний, постоянно открыт', 'Чат, игры, совместное редактирование'],
                  ],
                },
                { type: 'note', text: 'SSE — недооценённый. Работает по обычному HTTP, проходит через прокси, поддерживается браузерами (EventSource). Для «обновлений в одну сторону» — SSE проще WebSocket. WebSocket — когда нужен realtime в обе стороны.' },
              ],
            },
            {
              id: 'nw-l9-s2',
              title: 'WebSocket: handshake и жизнь',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'WebSocket handshake (HTTP Upgrade)',
                  code: `Клиент → сервер:\nGET /chat HTTP/1.1\nHost: example.com\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\nSec-WebSocket-Version: 13\n\nСервер → клиент:\nHTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\n\nПосле 101 Switching Protocols — TCP-соединение превращается в двусторонний канал.\nБольше не HTTP — WebSocket-фреймы в обе стороны.`,
                },
                {
                  type: 'code',
                  lang: 'javascript',
                  caption: 'Клиент на JS',
                  code: `const ws = new WebSocket('wss://example.com/chat');\n\nws.onopen = () => {\n  console.log('соединение открыто');\n  ws.send(JSON.stringify({ type: 'join', room: 'general' }));\n};\n\nws.onmessage = (event) => {\n  const data = JSON.parse(event.data);\n  console.log('получено:', data);\n};\n\nws.onerror = (error) => {\n  console.error('ошибка:', error);\n};\n\nws.onclose = (event) => {\n  console.log('закрыто:', event.code, event.reason);\n  // авто-reconnect через backoff\n};\n\n// ping для проверки «жив ли» (или сервер присылает)\nsetInterval(() => ws.send(JSON.stringify({ type: 'ping' })), 30000);`,
                },
                {
                  type: 'list',
                  items: [
                    'ws:// — незашифрованный, wss:// — через TLS (как http/https)',
                    'Upgrade: websocket — тот самый заголовок',
                    'Sec-WebSocket-Key — случайный ключ клиента',
                    'Sec-WebSocket-Accept — HMAC ключа + магическая строка, подтверждение',
                    'После 101 — двусторонние фреймы',
                    'Ping/pong — heartbeats, чтобы прокси не закрыли «мёртвое» соединение',
                  ],
                },
                { type: 'note', text: 'WebSocket не работает «сам по себе» через прокси и балансировщики: нужно явно включить Upgrade. nginx по умолчанию не проксирует WebSocket — нужны заголовки Upgrade/Connection. В K8s Ingress — аннотация. «WebSocket не работает за nginx» — классическая проблема.' },
              ],
            },
            {
              id: 'nw-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Каким HTTP-статусом отвечает сервер при успешном WebSocket handshake?',
                options: [
                  { id: 'a', text: '200 OK' },
                  { id: 'b', text: '101 Switching Protocols' },
                  { id: 'c', text: '301 Moved Permanently' },
                  { id: 'd', text: '426 Upgrade Required' },
                ],
                correct: ['b'],
                explanation:
                  '101 Switching Protocols — «переключаюсь на другой протокол». Это единственный случай, когда HTTP-соединение «превращается» в не-HTTP. 426 — наоборот, «клиент должен использовать Upgrade» (если не прислал).',
              },
            },
            {
              id: 'nw-l9-s4',
              title: 'Масштабирование WebSocket',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'WebSocket — stateful-соединение: клиент держит TCP-канал с конкретным сервером. Это ломает обычное горизонтальное масштабирование: если клиент А на сервере 1, а клиент Б на сервере 2 — как переслать сообщение от А к Б?' },
                {
                  type: 'mermaid',
                  caption: 'WebSocket + pub/sub для масштабирования',
                  code: `graph LR\n    C1["Клиент 1"] -->|"WebSocket"| S1["Server 1"]\n    C2["Клиент 2"] -->|"WebSocket"| S2["Server 2"]\n    S1 -->|"publish"| Redis[("Redis Pub/Sub<br/>или Kafka")]\n    S2 -->|"subscribe"| Redis\n    Redis -->|"message to Client 2"| S2`,
                },
                {
                  type: 'list',
                  items: [
                    'Sticky sessions (IP Hash) — клиент всегда на одном сервере (просто, но не отказоустойчиво)',
                    'Pub/sub (Redis, Kafka, NATS) — сервера обмениваются сообщениями (стандарт)',
                    'Server 1 публикует в канал «room:42», все серверы подписаны',
                    'Клиент Б получит сообщение, даже если он на Server 2',
                    'Load balancer должен поддерживать WebSocket (Upgrade)',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior backend: «как масштабировать WebSocket?» — «pub/sub (Redis/Kafka) между инстансами, sticky sessions — временное решение». Без pub/sub — сообщения не дойдут до клиентов на других серверах. Это ключевой архитектурный вопрос.' },
              ],
            },
            {
              id: 'nw-l9-s5',
              title: 'Проверь себя: масштабирование',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как масштабировать WebSocket на несколько серверов?',
                options: [
                  { id: 'a', text: 'Никак, WebSocket не масштабируется' },
                  { id: 'b', text: 'Pub/sub (Redis, Kafka, NATS) между серверами + sticky sessions на балансировщике' },
                  { id: 'c', text: 'Просто добавить серверов — WebSocket сам синхронизируется' },
                  { id: 'd', text: 'Заменить WebSocket на HTTP polling' },
                ],
                correct: ['b'],
                explanation:
                  'WebSocket — stateful. Клиент привязан к одному серверу. Чтобы сообщения доходили между серверами — pub/sub (Redis, Kafka) или sticky sessions. Sticky — временное решение (сервер упал — клиент переподключается к другому). Pub/sub — стандарт.',
              },
            },
          ],
        },
        {
          id: 'nw-l10',
          title: 'Диагностика: curl, traceroute, tcpdump',
          minutes: 35,
          steps: [
            {
              id: 'nw-l10-s1',
              title: 'curl: главный инструмент',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'curl для отладки',
                  code: `# -v — verbose: показать DNS, TCP, TLS, HTTP\ncurl -v https://api.example.com/users\n\n# -I — только заголовки ответа\ncurl -I https://example.com\n\n# -i — заголовки + тело\ncurl -i https://example.com\n\n# Показать время каждого этапа\ncurl -w "DNS: %{time_namelookup}s, TCP: %{time_connect}s, TLS: %{time_appconnect}s, Total: %{time_total}s\\n" -o /dev/null -s https://example.com\n\n# POST с JSON\ncurl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer TOKEN" \\\n  -d '{"name": "Anna"}'\n\n# Следовать редиректам\ncurl -L https://example.com\n\n# Игнорировать ошибки TLS (только для отладки!)\ncurl -k https://self-signed.local\n\n# Проверить, что сертификат валиден\ncurl --fail --silent --show-error https://example.com || echo "ОШИБКА"\n\n# HTTP-код только\ncurl -s -o /dev/null -w "%{http_code}" https://example.com/health`,
                },
                { type: 'note', text: 'curl -v — лучший друг при отладке API. Показывает: DNS-резолвинг, TCP-соединение, TLS-рукопожатие, отправленные заголовки, ответ сервера. Если «API не работает» — сначала curl -v с сервера, потом уже смотреть в код.' },
              ],
            },
            {
              id: 'nw-l10-s2',
              title: 'traceroute, mtr, tcpdump',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'traceroute и mtr',
                  code: `# Путь пакета до сервера (какие роутеры проходит)\ntraceroute google.com\ntraceroute -T -p 443 google.com    # через TCP на 443 (обходит блокировки ICMP)\n\n# mtr — traceroute + ping в одном, обновляется\nmtr google.com\nmtr --report google.com            # однократный отчёт\n\n# Где теряются пакеты, где растёт задержка — видно сразу`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'tcpdump',
                  code: `# Весь трафик на порт 443\nsudo tcpdump -i any port 443\n\n# Только к конкретному хосту\nsudo tcpdump -i any host 8.8.8.8\n\n# С записью в файл (для разбора в Wireshark)\nsudo tcpdump -i any port 80 -w capture.pcap\n\n# Показать содержимое (не только заголовки)\nsudo tcpdump -i any -A port 80\n\n# Фильтры: tcp, udp, icmp, port, host, net\nsudo tcpdump -i any 'tcp port 443 and host api.example.com'`,
                },
                { type: 'note', text: 'tcpdump требует root (или CAP_NET_RAW). На macOS — /usr/sbin/tcpdump. На Windows — WinDump или Wireshark. pcap-файл из tcpdump открывается в Wireshark: там видно каждый пакет, каждый TLS-handshake, каждый HTTP-заголовок.' },
              ],
            },
            {
              id: 'nw-l10-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что покажет `curl -v https://api.example.com` при успешном соединении?',
                options: [
                  { id: 'a', text: 'Только тело ответа' },
                  { id: 'b', text: 'DNS-резолвинг, TCP-соединение, TLS-рукопожатие, HTTP-запрос и ответ' },
                  { id: 'c', text: 'Только HTTP-статус' },
                  { id: 'd', text: 'Ничего, это флаг для загрузки файлов' },
                ],
                correct: ['b'],
                explanation:
                  '-v (verbose) — пошаговая отладка: DNS → TCP → TLS (сертификат, шифры) → отправленные заголовки → ответ сервера. Это главный инструмент отладки API и HTTPS. Если сайт «не открывается» — curl -v покажет, на каком шаге сломалось.',
              },
            },
            {
              id: 'nw-l10-s4',
              title: 'Алгоритм диагностики: что и в каком порядке',
              type: 'theory',
              blocks: [
                { type: 'p', text: '«Сайт не открывается» — с чего начать? Не с «перезапустить сервер». С пошаговой диагностики по слоям: DNS → TCP → TLS → HTTP. Каждый шаг — своя команда, свой ответ.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Алгоритм диагностики по слоям',
                  code: `1. DNS: имя → IP\ndig example.com\n→ нет ответа: проблема с DNS-сервером или доменом\n→ есть IP: идём дальше\n\n2. TCP: открыт ли порт?\nnc -zv example.com 443\ntelnet example.com 443\n→ Connection refused: сервис не слушает (упал)\n→ Timeout: firewall блокирует\n→ Connected: идём дальше\n\n3. TLS: рукопожатие и сертификат\nopenssl s_client -connect example.com:443 -servername example.com\ncurl -vI https://example.com\n→ certificate expired: обновить сертификат\n→ self-signed: недоверенный CA\n→ OK: идём дальше\n\n4. HTTP: что возвращает сервер?\ncurl -v https://example.com/health\n→ 200 OK: сервер работает, проблема в клиенте\n→ 500: ошибка приложения, смотреть логи\n→ 502: nginx не достучался до бэкенда\n→ 504: nginx достучался, бэкенд не ответил вовремя`,
                },
                {
                  type: 'list',
                  items: [
                    'DNS → IP: dig, nslookup',
                    'TCP → порт: nc, telnet',
                    'TLS → сертификат: openssl s_client, curl -v',
                    'HTTP → ответ: curl -i',
                    'Прокси/маршрут: traceroute, mtr',
                    'Пакеты: tcpdump, Wireshark',
                  ],
                },
                { type: 'note', text: 'Правило: сначала проверяйте с сервера (curl, dig с самого сервера), потом с клиента. Если с сервера работает, а с клиента нет — проблема в сети/прокси/DNS клиента. Если и с сервера не работает — проблема в приложении. Это разделение экономит часы.' },
              ],
            },
            {
              id: 'nw-l10-s5',
              title: 'Проверь себя: диагностика',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте симптом и инструмент диагностики',
                pairs: [
                  { left: 'Домен не резолвится', right: 'dig / nslookup (DNS-слой)' },
                  { left: 'Порт закрыт / timeout', right: 'nc -zv / telnet (TCP-слой)' },
                  { left: 'Сертификат истёк', right: 'openssl s_client / curl -v (TLS-слой)' },
                  { left: 'HTTP 502/504', right: 'curl -i + логи nginx (Application-слой)' },
                ],
                explanation:
                  'Каждый симптом — на своём слое. DNS → dig. TCP → nc/telnet. TLS → openssl s_client. HTTP → curl. Правильный порядок: сверху вниз (DNS → TCP → TLS → HTTP). Не «перезапустить и надеяться», а проверить каждый слой.',
              },
            },
          ],
        },
      ],
    },
        {
      id: 'nw-m4',
      title: 'Практикум',
      lessons: [
        {
          id: 'nw-l11',
          title: 'Практика: OSI, DNS, HTTP, TCP',
          minutes: 35,
          steps: [
            {
              id: 'nw-l11-s1',
              title: 'Уровни OSI',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'На каком уровне модели OSI работает протокол TCP?',
                options: [
                  { id: 'a', text: 'Application (7)' },
                  { id: 'b', text: 'Transport (4)' },
                  { id: 'c', text: 'Network (3)' },
                  { id: 'd', text: 'Data Link (2)' },
                ],
                correct: ['b'],
                explanation: 'TCP — транспортный уровень (4). IP — сетевой (3). HTTP — прикладной (7).',
              },
            },
            {
              id: 'nw-l11-s2',
              title: 'Путь DNS-запроса',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте шаги DNS-резолвинга в правильном порядке',
                items: ['Кэш браузера', 'Кэш ОС', 'DNS-резолвер (провайдер)', 'Корневой сервер', 'TLD-сервер (.com)', 'Авторитетный сервер домена'],
                correct: ['Кэш браузера', 'Кэш ОС', 'DNS-резолвер (провайдер)', 'Корневой сервер', 'TLD-сервер (.com)', 'Авторитетный сервер домена'],
                explanation: 'Сначала ищем в кэше. Если нет — идём к рекурсивному резолверу, который опрашивает иерархию DNS.',
              },
            },
            {
              id: 'nw-l11-s3',
              title: 'Количество хостов',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько хостов можно адресовать в подсети /24? (не считая адрес сети и broadcast)',
                correct: 254,
                explanation: '/24 = 256 адресов. 256 - 2 (сеть и broadcast) = 254 хоста.',
              },
            },
            {
              id: 'nw-l11-s4',
              title: 'HTTP-запрос',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в HTTP-запросе',
                text: '____ /api/users HTTP/1.1\n____: example.com',
                blanks: [
                  { accepted: ['GET', 'POST'], hint: 'метод' },
                  { accepted: ['Host'], hint: 'заголовок с доменом' },
                ],
                explanation: 'GET /api/users HTTP/1.1 — строка запроса. Host: example.com — обязательный заголовок для HTTP/1.1.',
              },
            },
                        {
              id: 'nw-l11-s5',
              title: 'TCP vs UDP',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте протоколы и транспорт, на котором они работают',
                pairs: [
                  { left: 'HTTP/1.1 и SSH', right: 'TCP' },
                  { left: 'HTTP/3', right: 'QUIC (поверх UDP)' },
                  { left: 'DNS (запрос)', right: 'UDP' },
                ],
                explanation: 'HTTP/1.1 и SSH — TCP (надёжность). HTTP/3 — QUIC поверх UDP (скорость). DNS — UDP (короткий запрос).',
              },
            },
            {
              id: 'nw-l11-s6',
              title: 'TCP Handshake',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько пакетов нужно для установки TCP-соединения (3-way handshake)?',
                correct: 3,
                explanation: 'SYN → SYN-ACK → ACK. Три пакета — поэтому handshake называется 3-way.',
              },
            },
            {
              id: 'nw-l11-s7',
              title: 'Коды 4xx',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие коды относятся к классу 4xx (ошибка клиента)?',
                options: [
                  { id: 'a', text: '400 Bad Request' },
                  { id: 'b', text: '401 Unauthorized' },
                  { id: 'c', text: '502 Bad Gateway' },
                  { id: 'd', text: '429 Too Many Requests' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: '4xx — ошибки клиента. 502 — ошибка сервера (5xx, неверный ответ от upstream).',
              },
            },
            {
              id: 'nw-l11-s8',
              title: 'TCP vs UDP свойства',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого протокола',
                columns: ['TCP', 'UDP'],
                rows: [
                  { label: 'Устанавливает соединение', correct: ['TCP'] },
                  { label: 'Гарантирует доставку', correct: ['TCP'] },
                  { label: 'Быстрее', correct: ['UDP'] },
                  { label: 'Используется в DNS', correct: ['UDP'] },
                ],
                explanation: 'TCP — соединение, надёжность, порядок. UDP — быстрота, без гарантий. DNS — UDP.',
              },
            },
            {
              id: 'nw-l11-s9',
              title: 'curl на практике',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите команду curl, которая делает GET-запрос к https://api.example.com/users с заголовком Authorization: Bearer TOKEN.',
                starterCode: 'curl ',
                mustInclude: [
                  { pattern: 'https://api\\.example\\.com/users', message: 'Нужен правильный URL' },
                  { pattern: '-H\\s+["\']Authorization: Bearer TOKEN["\']', message: 'Нужен заголовок Authorization' },
                ],
                explanation: 'curl -H "Authorization: Bearer TOKEN" https://api.example.com/users',
              },
            },
            {
              id: 'nw-l11-s10',
              title: 'HTTPS порт',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'На каком порту по умолчанию работает HTTPS? (только число)',
                accepted: ['443'],
                placeholder: 'число',
                hint: 'HTTP — 80',
                explanation: 'HTTPS — 443. HTTP — 80. SSH — 22. PostgreSQL — 5432.',
              },
            },
          ],
        },
      ],
    },
  ],
};