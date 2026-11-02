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
          minutes: 25,
          steps: [
            {
              id: 'nw-l1-s1',
              title: 'Две модели: OSI и TCP/IP',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Любая сетевая передача — это слои. Каждый слой делает одно и передаёт данные следующему. Модель OSI (7 слоёв) — теоретическая, для обучения. Модель TCP/IP (4 слоя) — практическая, по ней реально работает интернет.`,
                },
                {
                  type: 'mermaid',
                  caption: 'Соответствие слоёв OSI и TCP/IP',
                  code: `graph TD
                    subgraph OSI["OSI — 7 уровней"]
                        direction TB
                        O7["7. Application<br/>HTTP, DNS, SSH"]
                        O6["6. Presentation<br/>TLS, gzip"]
                        O5["5. Session"]
                        O4["4. Transport<br/>TCP, UDP"]
                        O3["3. Network<br/>IP, ICMP"]
                        O2["2. Data Link<br/>Ethernet"]
                        O1["1. Physical<br/>кабели"]
                    end
                    subgraph TCPIP["TCP/IP — 4 уровня"]
                        direction TB
                        T4["Application"]
                        T3["Transport"]
                        T2["Internet"]
                        T1["Link"]
                    end
                    O7 --> T4
                    O6 --> T4
                    O5 --> T4
                    O4 --> T3
                    O3 --> T2
                    O2 --> T1
                    O1 --> T1`
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
                {
                  type: 'note',
                  text: `Зачем это знать: на собеседовании QA/DevOps часто просят «объяснить, что происходит, когда вы вводите google.com в браузере». Правильный ответ — пройти по слоям: DNS → TCP → TLS → HTTP → рендер. Если не знаете слоёв — не сможете структурировать ответ.`,
                },
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
                  code: `1. DNS-резолвинг (Application)
   google.com → 142.250.185.78

2. TCP-соединение (Transport)
   3-way handshake: SYN → SYN-ACK → ACK
   (если HTTPS — то на порт 443)

3. TLS-рукопожатие (Application, поверх TCP)
   ClientHello → ServerHello + сертификат → обмен ключами
   → зашифрованное соединение

4. HTTP-запрос (Application)
   GET / HTTP/2
   Host: google.com
   User-Agent: Chrome/...

5. HTTP-ответ (Application)
   200 OK
   Content-Type: text/html
   <html>...

6. Рендер в браузере
   HTML → DOM → CSSOM → JS → отрисовка

Итого: DNS → TCP → TLS → HTTP → рендер.
Каждый слой можно диагностировать отдельно.`,
                },
                {
                  type: 'note',
                  text: `Если «сайт не открывается» — почти всегда можно понять, где сломалось: dig google.com (DNS), ping google.com (ICMP), curl -v https://google.com (TCP+TLS+HTTP). Три команды — три слоя — 90% диагностики.`,
                },
              ],
            },
            {
              id: 'nw-l1-s3',
              title: 'Проверь себя',
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
          minutes: 30,
          steps: [
            {
              id: 'nw-l3-s1',
              title: 'Иерархия DNS',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `DNS — «телефонная книга интернета». Превращает google.com в IP. Иерархия: корневые серверы (13 кластеров), TLD (com, org, ru), авторитетные серверы домена.`,
                },
                {
                  type: 'mermaid',
                  caption: 'Путь DNS-запроса от клиента до авторитетного сервера',
                  code: `sequenceDiagram
                    participant C as Клиент
                    participant R as Рекурсивный<br/>резолвер
                    participant Root as Корневой<br/>(.)
                    participant TLD as TLD-сервер<br/>(.com)
                    participant Auth as Авторитетный<br/>(example.com)

                    C->>R: IP для example.com?
                    Note over R: кэш пуст
                    R->>Root: кто отвечает за .com?
                    Root-->>R: a.gtld-servers.net
                    R->>TLD: кто отвечает за example.com?
                    TLD-->>R: ns1.example.com
                    R->>Auth: какой IP у example.com?
                    Auth-->>R: 93.184.216.34
                    R-->>C: 93.184.216.34
                    Note over R: кэширует на TTL секунд`
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Путь резолвинга',
                  code: `Хотим узнать IP для example.com

1. Браузер → кэш браузера → кэш ОС → hosts → DNS-сервер провайдера (обычно 8.8.8.8 или 1.1.1.1)

2. Если в кэше нет — рекурсивный резолвер спрашивает:
   → корневой сервер (.) : «кто отвечает за .com?»
   ← «a.gtld-servers.net»
   → TLD-сервер (.com) : «кто отвечает за example.com?»
   ← «ns1.example.com»
   → авторитетный сервер example.com : «какой IP у example.com?»
   ← «93.184.216.34»

3. Ответ кэшируется на TTL секунд (у example.com — обычно 3600)

Итого: 3 запроса, но кэш экономит 99% времени.`,
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
                  code: `# Базовый запрос (A по умолчанию)
dig example.com
dig +short example.com             # только ответ

# Конкретный тип записи
dig example.com MX
dig example.com TXT
dig example.com AAAA

# Через конкретный DNS-сервер (проверить, что отдают разные DNS)
dig @8.8.8.8 example.com
dig @1.1.1.1 example.com

# Проследить путь резолвинга
dig +trace example.com

# Обратный резолвинг (IP → имя)
dig -x 8.8.8.8`,
                },
                {
                  type: 'note',
                  text: `TTL (Time To Live) — сколько секунд DNS-ответ кэшируется. Низкий TTL (60–300) — быстрые изменения, но больше нагрузки на DNS. Высокий (3600–86400) — быстрее для клиентов, но изменения «доходят» медленно. При переезде сайта TTL снижают за день до переезда, чтобы старый IP «отпустил» быстрее.`,
                },
              ],
            },
            {
              id: 'nw-l3-s3',
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
          minutes: 25,
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
                  code: `sequenceDiagram
                    participant C as Клиент
                    participant S as Сервер
                    
                    C->>S: SYN (я хочу соединиться)
                    S->>C: SYN-ACK (согласен)
                    C->>S: ACK (подтверждаю)
                    
                    Note over C,S: Соединение установлено
                    C->>S: Данные
                    S->>C: Данные`
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: '3-way handshake (TCP)',
                  code: `Клиент                          Сервер
   │                              │
   │──── SYN (seq=100) ──────────▶│
   │                              │
   │◀─── SYN-ACK (seq=300, ack=101)│
   │                              │
   │──── ACK (ack=301) ──────────▶│
   │                              │
   │◀══════ данные ══════════════▶│
   │                              │

Зачем: убедиться, что обе стороны могут отправлять и принимать.
Одна «полуоткрытая» отправка — не гарантирует, что сервер ответит.

При закрытии — 4-way: FIN → ACK → FIN → ACK (FIN, ACK, FIN, ACK).`,
                },
                {
                  type: 'note',
                  text: `HTTP/3 использует QUIC — это UDP + собственная реализация надёжности в userspace. Плюс: не блокируется при потере пакета (в TCP все следующие пакеты ждут потерянный — «head-of-line blocking»). На собеседовании «почему HTTP/3 на UDP» — ответ QUIC.`,
                },
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
                ],
                explanation:
                  'HTTP/1.1 и 2 — TCP (надёжность важнее). HTTP/3 — QUIC поверх UDP (независимые потоки, быстрее на плохих сетях). DNS — обычно UDP (короткий запрос, повтор при потере). SSH тоже TCP, но он вынесен из вопроса, чтобы не было двух одинаковых ответов.',
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
          minutes: 25,
          steps: [
            {
              id: 'nw-l6-s1',
              title: 'Проблема HTTP/1.1',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `HTTP/1.1 — один запрос за раз на соединение. Браузер открывает 6 соединений на домен — параллелизм ограничен. Каждый запрос тащит заголовки (500+ байт). На мобильных и медленных сетях — медленно.`,
                },
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
                {
                  type: 'note',
                  text: `HTTP/2 мультиплексирует — в одном TCP-соединении идут параллельные запросы. Но: если один пакет потерян, TCP останавливает ВСЁ (head-of-line blocking). HTTP/3 на QUIC решает это: потоки независимы.`,
                },
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
                  code: `curl -I --http2 https://example.com
# HTTP/2 200

curl -I --http3 https://cloudflare.com
# HTTP/3 200 (нужен curl с поддержкой HTTP/3)

# В браузере: DevTools → Network → колонка Protocol
# h2 = HTTP/2, h3 = HTTP/3, http/1.1

# Через nghttp (если установлен)
nghttp -v https://example.com`,
                },
                {
                  type: 'list',
                  items: [
                    'HTTP/2 мультиплексирует потоки в одном TCP-соединении',
                    'HTTP/3 использует QUIC (UDP) — потоки независимы, нет head-of-line blocking',
                    'QUIC поддерживает 0-RTT (как TLS 1.3), но с оговоркой про replay-атаки',
                    'HTTP/3 требует HTTPS (TLS 1.3), без шифрования не работает',
                  ],
                },
                {
                  type: 'note',
                  text: 'HTTP/2 обязателен по факту: почти все сайты с HTTPS работают на нём. HTTP/3 растёт: Cloudflare, Google, Facebook отдают h3. 0-RTT в QUIC ускоряет повторные подключения, но уязвим к replay — не для неидемпотентных запросов (POST, платежи).',
                },
              ],
            },
            {
              id: 'nw-l6-s3',
              title: 'Проверь себя',
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
          ],
        },
        {
          id: 'nw-l7',
          title: 'HTTPS и TLS',
          minutes: 30,
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
                {
                  type: 'p',
                  text: `HTTPS = HTTP + TLS. Порт 443. Раньше был SSL (устарел), сейчас TLS 1.2 / TLS 1.3. Браузер и сервер договариваются через TLS-рукопожатие.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'TLS 1.3 handshake (упрощённо)',
                  code: `Клиент                                Сервер
   │                                    │
   │──── ClientHello ──────────────────▶│
   │     (версии TLS, шифры, SNI=домен) │
   │                                    │
   │◀─── ServerHello ──────────────────│
   │     (выбранный шифр, сертификат)   │
   │                                    │
   │  [проверка сертификата]            │
   │  [обмен ключами через ECDHE]       │
   │                                    │
   │◀══════ шифрованный HTTP ═════════▶│
   │                                    │

TLS 1.2 — 2 RTT, TLS 1.3 — 1 RTT (быстрее).
0-RTT (resumption) — ещё быстрее при повторном подключении.`,
                },
                {
                  type: 'note',
                  text: `SNI (Server Name Indication) — в ClientHello клиент передаёт домен, чтобы сервер знал, какой сертификат отдать. Без SNI на одном IP нельзя было бы держать 100 HTTPS-сайтов. С SNI — можно (и это стандарт).`,
                },
                {
                  type: 'note',
                  text: 'TLS 1.3 поддерживает 0-RTT (zero round-trip time) при повторном подключении — клиент отправляет данные сразу, не дожидаясь handshake. Это ускоряет, но есть риск: 0-RTT-данные уязвимы к replay-атакам (злоумышленник может повторить перехваченный запрос). Поэтому 0-RTT не используют для неидемпотентных операций (POST, платежи) — только для GET и статики. В HTTP/3 (QUIC) 0-RTT есть, но с теми же ограничениями.',
                },
              ],
            },
            {
              id: 'nw-l7-s2',
              title: 'Сертификаты и цепочка доверия',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Сертификат — это «паспорт» сервера, подписанный удостоверяющим центром (CA — Certificate Authority). Браузеры доверяют ~150 корневым CA (Let's Encrypt, DigiCert, GlobalSign). CA подписывает сертификат сервера своим ключом — цепочка доверия.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Цепочка доверия',
                  code: `Корневой сертификат (встроен в ОС/браузер)
  └── Intermediate CA (подписан корневым)
        └── Сертификат сервера example.com
              (подписан Intermediate)

Браузер проверяет: сервер → Intermediate → Корневой (в trust store)
Если цепочка сходится и сертификат не истёк и домен совпадает — ОК`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка сертификата',
                  code: `# Показать сертификат сервера
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -text

# Только даты и CN
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject

# Что отдаёт цепочку
openssl s_client -connect example.com:443 -showcerts

# curl с проверкой
curl -vI https://example.com 2>&1 | grep -i "SSL certificate"

# Проверить срок через curl
curl -vI https://example.com 2>&1 | grep expire`,
                },
                {
                  type: 'note',
                  text: `«Сертификат истёк» — самая частая проблема. Let's Encrypt — 90 дней, автопродление через certbot/acme.sh. Просрочка = браузер показывает предупреждение, API-клиенты отказываются. В CI — проверка «сертификат истекает в ближайшие 30 дней» — стандартная практика.`,
                },
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
                {
                  type: 'note',
                  text: `TLS не «шифрует всё подряд»: после рукопожатия HTTP-данные шифруются, но IP-адреса и порты — видны. DPI (глубокий анализ трафика) может видеть SNI (домен). ECH (Encrypted Client Hello) — новая технология, скрывает и SNI.`,
                },
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
          minutes: 30,
          steps: [
            {
              id: 'nw-l8-s1',
              title: 'Прямой и обратный прокси',
              type: 'theory',
              blocks: [
                {
                  type: 'mermaid',
                  caption: 'Forward proxy скрывает клиента, reverse — бэкенд',
                  code: `graph LR
                    subgraph Forward["Forward proxy<br/>(скрывает клиента)"]
                        C1["Клиент"] -->|"настраивает<br/>клиент"| FP["VPN,<br/>корпоративный прокси"]
                        FP --> Internet["Интернет"]
                    end
                    subgraph Reverse["Reverse proxy<br/>(скрывает бэкенд)"]
                        Internet2["Интернет"] --> RP["Nginx, HAProxy,<br/>ALB"]
                        RP --> B1["Backend 1"]
                        RP --> B2["Backend 2"]
                    end`
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
                  code: `Интернет
   │
   ▼
[ Nginx — 1 публичный IP :443 ]
   │  TLS-терминация здесь
   │  маршрутизация по пути/домену
   │  rate limiting
   │  кэширование статики
   │
   ├── /api/*     → backend:8000
   ├── /static/*  → файлы на диске
   └── /          → frontend:3000

Зачем:
  • Один IP/порт для всех сервисов
  • TLS в одном месте (certbot обновляет сертификаты здесь)
  • Кэширование, сжатие, HTTP/2
  • Rate limiting, защита от DDoS
  • Балансировка между репликами backend
  • Голубой/зелёный деплой (переключение upstream)`,
                },
                {
                  type: 'note',
                  text: `nginx — самый популярный reverse proxy. В K8s ту же роль выполняет Ingress (обычно nginx-ingress-controller). В облаках — AWS ALB, GCP LB. Всё это — reverse proxy с разной степенью «умности».`,
                },
              ],
            },
            {
              id: 'nw-l8-s2',
              title: 'CDN и балансировка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `CDN (Content Delivery Network) — сеть серверов по миру, которые кэшируют ваш контент ближе к пользователю. Cloudflare, Akamai, AWS CloudFront, Fastly. Пользователь из Москвы получает файл с сервера в Москве, а не из США.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как работает CDN',
                  code: `Пользователь в Москве → ближайший edge-сервер CDN (Москва)
   │
   │ Если в кэше есть → отдаёт сразу (10 мс)
   │
   └ Если нет → идёт к origin (сервер в США)
                  ↓
               кэширует у себя
                  ↓
               отдаёт пользователю (500 мс в первый раз, 10 мс потом)

Кэширование:
  Cache-Control: max-age=3600 — кэшировать 1 час
  ETag — проверка «изменилось ли»
  Vary: Accept-Encoding — разные версии для gzip/br

Что кэшируют: статику (js, css, картинки), иногда HTML/API
Что НЕ кэшируют: персональные данные, авторизованные запросы`,
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
                {
                  type: 'note',
                  text: `CDN — не только про статику. Cloudflare, Fastly умеют кэшировать API (с Vary), делать WAF, защиту от DDoS, edge-compute. «Положили за Cloudflare» — стандарт для публичных сайтов.`,
                },
              ],
            },
            {
              id: 'nw-l8-s3',
              title: 'Проверь себя',
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
          ],
        },
        {
          id: 'nw-l9',
          title: 'WebSocket и realtime',
          minutes: 25,
          steps: [
            {
              id: 'nw-l9-s1',
              title: 'Проблема realtime по HTTP',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `HTTP — «запрос-ответ». Сервер не может «прислать» данные клиенту по своей инициативе. Для чата, нотификаций, биржевых котировок нужен push. Исторически — polling (клиент спрашивает каждую секунду), SSE (Server-Sent Events), WebSocket (двусторонний канал).`,
                },
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
                {
                  type: 'note',
                  text: `SSE — недооценённый. Работает по обычному HTTP, проходит через прокси, поддерживается браузерами (EventSource). Для «обновлений в одну сторону» — SSE проще WebSocket. WebSocket — когда нужен realtime в обе стороны.`,
                },
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
                  code: `Клиент → сервер:
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

Сервер → клиент:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

После 101 Switching Protocols — TCP-соединение превращается в двусторонний канал.
Больше не HTTP — WebSocket-фреймы в обе стороны.`,
                },
                {
                  type: 'code',
                  lang: 'javascript',
                  caption: 'Клиент на JS',
                  code: `const ws = new WebSocket('wss://example.com/chat');

ws.onopen = () => {
  console.log('соединение открыто');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('получено:', data);
};

ws.onerror = (error) => {
  console.error('ошибка:', error);
};

ws.onclose = (event) => {
  console.log('закрыто:', event.code, event.reason);
  // авто-reconnect через backoff
};

// ping для проверки «жив ли» (или сервер присылает)
setInterval(() => ws.send(JSON.stringify({ type: 'ping' })), 30000);`,
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
                {
                  type: 'note',
                  text: `WebSocket не работает «сам по себе» через прокси и балансировщики: нужно явно включить Upgrade. nginx по умолчанию не проксирует WebSocket — нужны заголовки Upgrade/Connection. В K8s Ingress — аннотация. «WebSocket не работает за nginx» — классическая проблема.`,
                },
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
          ],
        },
        {
          id: 'nw-l10',
          title: 'Диагностика: curl, traceroute, tcpdump',
          minutes: 30,
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
                  code: `# -v — verbose: показать DNS, TCP, TLS, HTTP
curl -v https://api.example.com/users

# -I — только заголовки ответа
curl -I https://example.com

# -i — заголовки + тело
curl -i https://example.com

# Показать время каждого этапа
curl -w "DNS: %{time_namelookup}s, TCP: %{time_connect}s, TLS: %{time_appconnect}s, Total: %{time_total}s\\n" -o /dev/null -s https://example.com

# POST с JSON
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{"name": "Anna"}'

# Следовать редиректам
curl -L https://example.com

# Игнорировать ошибки TLS (только для отладки!)
curl -k https://self-signed.local

# Проверить, что сертификат валиден
curl --fail --silent --show-error https://example.com || echo "ОШИБКА"

# HTTP-код только
curl -s -o /dev/null -w "%{http_code}" https://example.com/health`,
                },
                {
                  type: 'note',
                  text: `curl -v — лучший друг при отладке API. Показывает: DNS-резолвинг, TCP-соединение, TLS-рукопожатие, отправленные заголовки, ответ сервера. Если «API не работает» — сначала curl -v с сервера, потом уже смотреть в код.`,
                },
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
                  code: `# Путь пакета до сервера (какие роутеры проходит)
traceroute google.com
traceroute -T -p 443 google.com    # через TCP на 443 (обходит блокировки ICMP)

# mtr — traceroute + ping в одном, обновляется
mtr google.com
mtr --report google.com            # однократный отчёт

# Где теряются пакеты, где растёт задержка — видно сразу`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'tcpdump',
                  code: `# Весь трафик на порт 443
sudo tcpdump -i any port 443

# Только к конкретному хосту
sudo tcpdump -i any host 8.8.8.8

# С записью в файл (для разбора в Wireshark)
sudo tcpdump -i any port 80 -w capture.pcap

# Показать содержимое (не только заголовки)
sudo tcpdump -i any -A port 80

# Фильтры: tcp, udp, icmp, port, host, net
sudo tcpdump -i any 'tcp port 443 and host api.example.com'`,
                },
                {
                  type: 'note',
                  text: `tcpdump требует root (или CAP_NET_RAW). На macOS — /usr/sbin/tcpdump. На Windows — WinDump или Wireshark. pcap-файл из tcpdump открывается в Wireshark: там видно каждый пакет, каждый TLS-handshake, каждый HTTP-заголовок.`,
                },
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