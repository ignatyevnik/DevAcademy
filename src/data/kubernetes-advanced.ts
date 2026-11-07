import type { Course } from './types';

export const k8sAdvancedCourse: Course = {
  slug: 'kubernetes-advanced',
  title: 'Kubernetes: продвинуто',
  subtitle: 'Ingress, NetworkPolicy, хранилища, RBAC, безопасность, Helm и Kustomize',
  description:
    'Продвинутый курс по Kubernetes для тех, кто уже освоил базовые абстракции. Разберём сеть глубоко (Service types, Ingress, NetworkPolicy, DNS), хранилища (PV, PVC, StorageClass, StatefulSet + PVC), RBAC и безопасность (ServiceAccount, роли, Pod Security Standards, securityContext), а также пакетные менеджеры для Kubernetes — Helm (шаблонизация, релизы) и Kustomize (overlays). Практика на реальных манифестах: PostgreSQL в StatefulSet, Ingress с TLS, NetworkPolicy.',
  level: 'Продвинутый',
  tags: ['Kubernetes', 'DevOps', 'Ingress', 'Helm', 'Безопасность'],
  accent: '#7c5cff',
  icon: 'helm-advanced',
  outcomes: [
    'Настраивать сеть: ClusterIP, NodePort, LoadBalancer, Headless, Ingress, NetworkPolicy',
    'Управлять хранилищами через PV, PVC, StorageClass, PVC templates',
    'Настраивать RBAC: Role, ClusterRole, RoleBinding, ServiceAccount',
    'Применять securityContext и Pod Security Standards',
    'Упаковывать манифесты в Helm-чарты и управлять релизами',
    'Использовать Kustomize для оверлеев окружений',
  ],
  requirements: [
    'Пройден курс «Kubernetes: основы»',
    'Понимание подов, деплойментов, сервисов',
    'Опыт работы с kubectl',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Сеть (было k8-m5)
    // ─────────────────────────────────────────────
    {
      id: 'k8-a-m1',
      title: 'Сеть: Service, Ingress, NetworkPolicy',
      lessons: [
        {
          id: 'k8-l12',
          title: 'Service types глубоко',
          minutes: 30,
          steps: [
            {
              id: 'k8-l12-s1',
              title: 'Четыре типа Service',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Service types',
                  head: ['Тип', 'Доступ', 'Для чего'],
                  rows: [
                    ['ClusterIP', 'Только внутри кластера', 'Стандарт для межсервисного общения'],
                    ['NodePort', 'Порт на каждом узле (30000–32767)', 'Быстрый доступ без облачного LB'],
                    ['LoadBalancer', 'Внешний IP через облако', 'Публичные сервисы в облаке'],
                    ['ExternalName', 'DNS CNAME на внешний домен', 'Мост к внешнему сервису'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Все четыре типа',
                  code: `# ClusterIP (по умолчанию)
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 8000
---
# NodePort
apiVersion: v1
kind: Service
metadata:
  name: backend-np
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 8000
      nodePort: 30080    # опционально; иначе выделится случайный
---
# LoadBalancer (в облаке — выдаст внешний IP)
apiVersion: v1
kind: Service
metadata:
  name: backend-lb
spec:
  type: LoadBalancer
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 8000
---
# ExternalName (без selector!)
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: db.prod.example.com`,
                },
                { type: 'note', text: 'LoadBalancer в облаке (EKS, GKE, AKS) создаёт реальный LB с публичным IP — это дорого, если сервисов много. Для множества сервисов — один Ingress + внутри ClusterIP. Это стандартная практика.' },
              ],
            },
            {
              id: 'k8-l12-s2',
              title: 'Headless и sessionAffinity',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Headless (clusterIP: None)',
                  code: `apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
spec:
  clusterIP: None         # ← headless
  selector:
    app: postgres
  ports:
    - port: 5432

# DNS:
#   postgres-0.postgres-headless → IP пода postgres-0
#   postgres-1.postgres-headless → IP пода postgres-1
#   postgres-headless → все IP (round-robin)`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'sessionAffinity: клиент ходит на тот же под',
                  code: `apiVersion: v1
kind: Service
metadata:
  name: sticky-svc
spec:
  selector:
    app: myapp
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800    # 3 часа`,
                },
                {
                  type: 'list',
                  items: [
                    'Headless — DNS на каждый под, для StatefulSet и сервисов, где клиент сам выбирает',
                    'sessionAffinity: ClientIP — «липкие» сессии: один клиент → один под',
                    'sessionAffinity: None (по умолчанию) — каждый запрос может уйти на любой под',
                    'Sticky-сессии — компромисс, если приложение не умеет stateless. Лучше — вынести сессию в Redis',
                  ],
                },
              ],
            },
            {
              id: 'k8-l12-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Вы развернули StatefulSet с 3 подами postgres. Какой тип Service нужен, чтобы приложение обращалось к конкретному поду?',
                options: [
                  { id: 'a', text: 'ClusterIP — он даст стабильный IP' },
                  { id: 'b', text: 'Headless Service (clusterIP: None)' },
                  { id: 'c', text: 'LoadBalancer' },
                  { id: 'd', text: 'NodePort' },
                ],
                correct: ['b'],
                explanation:
                  'Headless Service создаёт DNS-имена вида postgres-0.postgres-headless, postgres-1.postgres-headless — на каждый под. Только так можно обратиться к конкретной ноде кластера БД (например, к master).',
              },
            },
            {
              id: 'k8-l12-s4',
              title: 'LoadBalancer в облаке: аннотации',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Service типа LoadBalancer в облаке создаёт реальный облачный балансировщик. Через аннотации можно настроить его: internal/external, тип (NLB/ALB), SSL-сертификат, static IP.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'AWS LoadBalancer Service',
                  code: `apiVersion: v1
kind: Service
metadata:
  name: web-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:...
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - name: https
      port: 443
      targetPort: 8000`,
                },
                {
                  type: 'list',
                  items: [
                    'aws-load-balancer-type: nlb (L4) / alb (L7, через Ingress)',
                    'scheme: internal (приватный) / internet-facing (публичный)',
                    'ssl-cert + ssl-ports — терминация TLS на LB',
                    'static IP — через allocation ID (Elastic IP)',
                    'В GCP — свой набор аннотаций (cloud.google.com/load-balancer-type)',
                  ],
                },
                { type: 'note', text: 'На собеседовании: «что такое internal LoadBalancer?» — «Service с аннотацией internal — публичного IP нет, только из VPC». Частый вопрос для enterprise: «внутренний сервис не должен быть доступен из интернета, но доступен из других сервисов VPC».' },
              ],
            },
            {
              id: 'k8-l12-s5',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип Service и его особенность',
                pairs: [
                  { left: 'ClusterIP', right: 'Виртуальный IP внутри кластера' },
                  { left: 'Headless (clusterIP: None)', right: 'DNS на каждый под (для StatefulSet)' },
                  { left: 'NodePort', right: 'Порт на каждом узле (30000–32767)' },
                  { left: 'LoadBalancer', right: 'Публичный IP через облако' },
                ],
                explanation: 'ClusterIP — внутри. Headless — DNS на каждый под. NodePort — порт на узле. LoadBalancer — облачный LB. ExternalName — CNAME на внешний домен. На собеседовании middle: «чем Headless отличается от ClusterIP?» — «DNS на каждый под vs один виртуальный IP».',
              },
            },
          ],
        },
        {
          id: 'k8-l13',
          title: 'Ingress: единая точка входа',
          minutes: 35,
          steps: [
            {
              id: 'k8-l13-s1',
              title: 'Зачем Ingress',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'LoadBalancer на каждый сервис — дорого (10 сервисов = 10 публичных IP = 10 облачных LB). Ingress — единая точка входа: один LB + правила маршрутизации по host и path. Внутри кластера сервисы остаются ClusterIP.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как это работает',
                  code: `Интернет
    ↓
[ Облачный LoadBalancer — 1 публичный IP ]
    ↓
[ Ingress Controller — nginx, traefik, ALB ]
    ↓ (маршрутизация по правилам)
├── api.example.com     → Service backend (ClusterIP)
├── example.com/app     → Service frontend (ClusterIP)
└── example.com/admin   → Service admin (ClusterIP)`,
                },
                { type: 'note', text: 'Ingress — это не сам контроллер, а ресурс (правила). Нужен Ingress Controller: nginx-ingress, Traefik, ALB Ingress, GCE Ingress. В managed-кластерах (EKS, GKE, AKS) — часто включён по умолчанию, но не всегда. Уточните у облака.' },
              ],
            },
            {
              id: 'k8-l13-s2',
              title: 'Правила маршрутизации',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Ingress с host и path',
                  code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - example.com
      secretName: example-tls    # Secret с tls.crt и tls.key
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend
                port:
                  number: 8000
    - host: admin.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin
                port:
                  number: 80`,
                },
                {
                  type: 'table',
                  caption: 'pathType',
                  head: ['pathType', 'Поведение'],
                  rows: [
                    ['Prefix', '/api → /api, /api/users, /api/users/1 (по префиксу)'],
                    ['Exact', '/api → только /api, /api/users не подходит'],
                    ['ImplementationSpecific', 'Зависит от Ingress Controller (обычно regex)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'TLS через cert-manager (автоматический Let\'s Encrypt)',
                  code: `# Установить cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.0/cert-manager.yaml

# В Ingress — аннотация:
#   cert-manager.io/cluster-issuer: letsencrypt-prod
# cert-manager сам создаст Secret с сертификатом`,
                },
              ],
            },
            {
              id: 'k8-l13-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем Ingress отличается от LoadBalancer Service?',
                options: [
                  { id: 'a', text: 'Ingress — это то же самое, просто новее' },
                  { id: 'b', text: 'Ingress — единая точка входа с маршрутизацией по host/path; LoadBalancer — публичный IP на каждый сервис' },
                  { id: 'c', text: 'Ingress работает только с HTTP/2' },
                  { id: 'd', text: 'LoadBalancer быстрее' },
                ],
                correct: ['b'],
                explanation:
                  'LoadBalancer даёт отдельный публичный IP на каждый сервис (дорого). Ingress — один LB с правилами: example.com/api → backend, example.com/ → frontend. Внутри кластера — ClusterIP.',
              },
            },
            {
              id: 'k8-l13-s4',
              title: 'Ingress Controller: какой выбрать',
              type: 'theory',
              blocks: [
                { type: 'table',
                  caption: 'Популярные Ingress Controller',
                  head: ['Controller', 'Плюсы', 'Минусы'],
                  rows: [
                    ['ingress-nginx', 'Стандарт, огромное сообщество, много аннотаций', 'Конфигурация через аннотации — иногда сложно'],
                    ['Traefik', 'Автоматический TLS, middleware, dashboard', 'Меньше примеров для сложных сценариев'],
                    ['AWS ALB Ingress', 'Нативный L7 LB в AWS, WAF, ACM', 'Только AWS, vendor lock-in'],
                    ['GCE Ingress', 'Нативный в GCP, Global LB', 'Только GCP'],
                    ['Istio Gateway', 'Часть service mesh, mTLS, traffic splitting', 'Тяжёлый, только если уже есть Istio'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'ingress-nginx — «дефолт» для self-hosted и большинства managed',
                    'Traefik — если нужен простой auto-TLS и middleware (rate limit, auth)',
                    'AWS ALB — если полностью в AWS, нужен WAF/ACM/access logs из коробки',
                    'Istio — если уже используется service mesh (canary, mTLS, observability)',
                    'На собеседовании: «какой Ingress Controller использовали?» — ingress-nginx самый частый ответ',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «какой Ingress Controller выбрать?» — «зависит от облака: в AWS — ALB Ingress, в GCP — GCE, для self-hosted — ingress-nginx или Traefik». «Можно ли несколько?» — «да, через ingressClassName, но обычно один».' },
              ],
            },
            {
              id: 'k8-l13-s5',
              title: 'Проверь себя: pathType',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте pathType и его поведение',
                pairs: [
                  { left: 'Prefix', right: '/api → /api, /api/users, /api/users/1' },
                  { left: 'Exact', right: '/api → только /api, /api/users не подходит' },
                  { left: 'ImplementationSpecific', right: 'Зависит от Ingress Controller' },
                  { left: 'TLS в Ingress', right: 'Секция tls с secretName' },
                ],
                explanation: 'Prefix — по префиксу. Exact — точное совпадение. ImplementationSpecific — на усмотрение контроллера (regex). TLS — секция tls с secretName (Secret с tls.crt/tls.key). На собеседовании middle: «что такое pathType?» — это ответ.',
              },
            },
          ],
        },
        {
          id: 'k8-l14',
          title: 'NetworkPolicy: изоляция трафика',
          minutes: 30,
          steps: [
            {
              id: 'k8-l14-s1',
              title: 'Зачем NetworkPolicy',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'По умолчанию в Kubernetes все поды видят друг друга: любой под может обратиться к любому. Это удобно для разработки, но опасно в проде: скомпрометированный фронтенд получит доступ к БД, Kafka, внутренним API. NetworkPolicy — правила фаервола на уровне подов.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Default deny all — блокируем всё',
                  code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}         # все поды в namespace
  policyTypes:
    - Ingress
    - Egress`,
                },
                { type: 'note', text: 'default-deny-all — первое, что настраивают в проде. Потом открывают доступ по одному: «frontend → backend на порт 8000», «backend → БД на 5432». Иначе любой под может сканировать сеть кластера.' },
              ],
            },
            {
              id: 'k8-l14-s2',
              title: 'Разрешаем конкретный трафик',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Backend принимает только от frontend',
                  code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-allow-frontend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8000`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Backend сам ходит только в БД',
                  code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-egress-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system   # DNS
      ports:
        - protocol: UDP
          port: 53`,
                },
                {
                  type: 'list',
                  items: [
                    'podSelector — какие поды применяют правило',
                    'from / to — откуда / куда разрешено',
                    'podSelector внутри from — поды в том же namespace',
                    'namespaceSelector — поды в namespace с меткой',
                    'ipBlock — CIDR (внешние адреса)',
                    'Если X egress не открыт, а default-deny egress включён — под не сможет обратиться к DNS (kube-system) и сломается',
                  ],
                },
              ],
            },
            {
              id: 'k8-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что нужно для работы NetworkPolicy в кластере?',
                options: [
                  { id: 'a', text: 'CNI-плагин с поддержкой NetworkPolicy: Calico, Cilium, Weave' },
                  { id: 'b', text: 'Ingress Controller' },
                  { id: 'c', text: 'Правила применены через kubectl apply' },
                  { id: 'd', text: 'Разрешить DNS в egress, если включён default-deny egress' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'NetworkPolicy работает только с CNI, который её поддерживает (Calico, Cilium, Antrea). Flannel, например, не поддерживает — правила будут проигнорированы. Плюс, при default-deny egress не забудьте разрешить DNS (UDP 53).',
              },
            },
            {
              id: 'k8-l14-s4',
              title: 'Визуализация: кто куда может ходить',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'После настройки NetworkPolicy полезно визуализировать граф разрешённых связей: кто с кем может общаться. Это помогает найти «забытые» правила (например, frontend → kafka, которого не должно быть) и понять, почему что-то не работает.' },
                {
                  type: 'mermaid',
                  caption: 'Граф NetworkPolicy: кто куда может',
                  code: `graph LR
                    Inet["Internet"] -->|"ingress :443"| Ing["Ingress"]
                    Ing -->|":8000"| FE["Frontend"]
                    Ing -->|":8000"| BE["Backend"]
                    FE -->|":8000"| BE
                    BE -->|":5432"| DB[("PostgreSQL")]
                    BE -->|":6379"| Redis[("Redis")]
                    BE -->|":53<br/>(DNS)"| DNS["CoreDNS"]
                    style BE fill:#c8e6c9
                    style DB fill:#c8e6c9
                    style Redis fill:#c8e6c9`,
                },
                {
                  type: 'list',
                  items: [
                    'Инструменты визуализации: Cilium Hubble, Calico Observability',
                    'Cilium Hubble — «граф сервисов» в реальном времени (eBPF)',
                    'kubectl get networkpolicy -o yaml — прочитать правила',
                    'kubectl describe networkpolicy <name> — человекочитаемо',
                    'Для отладки — запустить временный под в namespace и проверить связь (kubectl run test --rm -it --image=nicolaka/netshoot)',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «как отладить NetworkPolicy?» — «запустить netshoot-под в namespace, проверить nslookup/curl/telnet до целевого пода». «Почему не работает?» — «Flannel не поддерживает NetworkPolicy; правила применяются, но игнорируются». Это классическая ловушка.' },
              ],
            },
            {
              id: 'k8-l14-s5',
              title: 'Проверь себя: отладка',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его назначение',
                pairs: [
                  { left: 'kubectl describe networkpolicy', right: 'Человекочитаемые правила' },
                  { left: 'Cilium Hubble', right: 'Граф сервисов в реальном времени' },
                  { left: 'netshoot-под', right: 'Отладка связи изнутри namespace' },
                  { left: 'Flannel CNI', right: 'Не поддерживает NetworkPolicy' },
                ],
                explanation: 'describe — читать правила. Hubble — визуализация. netshoot — отладка. Flannel — «не поддерживает»: частая причина «правила есть, но не работают». На собеседовании middle: «почему NetworkPolicy не работает?» — «проверьте CNI».',
              },
            },
          ],
        },
        {
          id: 'k8-l15',
          title: 'DNS и Service Discovery',
          minutes: 25,
          steps: [
            {
              id: 'k8-l15-s1',
              title: 'Как поды находят друг друга',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Kubernetes запускает CoreDNS — внутренний DNS-сервер. Каждый Service получает DNS-имя. Поды обращаются друг к другу по этим именам, не по IP: бэкенд ищет `postgres`, а не `10.96.45.12`. Это делает инфраструктуру переносимой: IP меняются при пересоздании, DNS-имена — нет.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Форматы DNS',
                  code: `Сервис в том же namespace:
  backend                      → ClusterIP сервиса backend
  backend.default              → в namespace default

Полный FQDN:
  backend.default.svc.cluster.local

Порт (если Service имеет name: http):
  http://backend:8000
  http://backend.default.svc.cluster.local:8000

Headless (на каждый под):
  postgres-0.postgres-headless
  postgres-1.postgres-headless`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Диагностика DNS',
                  code: `# Изнутри пода
kubectl exec -it myapp -- nslookup backend
kubectl exec -it myapp -- nslookup backend.default.svc.cluster.local
kubectl exec -it myapp -- getent hosts backend

# Если nslookup недоступен (distroless), запустить временный под:
kubectl run -it --rm --image=alpine -- sh
apk add bind-tools
nslookup backend`,
                },
              ],
            },
            {
              id: 'k8-l15-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какое полное DNS-имя (FQDN) у сервиса `backend` в namespace `production`?',
                accepted: [
                  'backend.production.svc.cluster.local',
                  'backend.production.svc.cluster.local.',
                ],
                placeholder: 'полное имя',
                hint: 'формат: <service>.<namespace>.svc.cluster.local',
                explanation:
                  'backend.production.svc.cluster.local. Внутри того же namespace достаточно короткого имени backend (или backend.production). FQDN нужен, когда обращаетесь из другого namespace.',
              },
            },
            {
              id: 'k8-l15-s3',
              title: 'CoreDNS: как работает',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'CoreDNS — это DNS-сервер, который работает как Deployment в namespace `kube-system` и смотрит за изменениями Service/Endpoint. Когда создаётся Service — CoreDNS автоматически добавляет DNS-запись. Когда Service удаляется — запись исчезает.' },
                {
                  type: 'mermaid',
                  caption: 'Путь DNS-запроса внутри кластера',
                  code: `sequenceDiagram
                    participant Pod as Под
                    participant DNS as CoreDNS
                    participant API as kube-apiserver

                    Pod->>DNS: nslookup backend
                    DNS->>DNS: ищет в зоне cluster.local
                    DNS-->>Pod: 10.96.45.12 (ClusterIP)
                    Pod->>API: curl http://backend:8000
                    Note over Pod,API: kube-proxy на узле<br/>знает ClusterIP → Pod IP`,
                },
                {
                  type: 'list',
                  items: [
                    'CoreDNS — Deployment в kube-system (обычно 2 реплики)',
                    'Зона `cluster.local` — внутренняя зона кластера',
                    'Запись создаётся автоматически при создании Service',
                    'Headless Service → несколько A-записей (по одной на под)',
                    'Если CoreDNS упал — поды не могут резолвить имена, но TCP к известному IP работает',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle: «что будет, если CoreDNS упадёт?» — «поды не смогут резолвить имена сервисов (nslookup не работает), но прямые IP-соединения продолжат работать; новые поды не смогут подключиться к сервисам по имени». «Что делать?» — «проверить CoreDNS, перезапустить, посмотреть логи».' },
              ],
            },
            {
              id: 'k8-l15-s4',
              title: 'Проверь себя: проблемы DNS',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие причины могут быть у «DNS не работает в поде»?',
                options: [
                  { id: 'a', text: 'CoreDNS не запущен или в CrashLoop' },
                  { id: 'b', text: 'NetworkPolicy блокирует egress на UDP 53' },
                  { id: 'c', text: 'У пода не указан dnsPolicy' },
                  { id: 'd', text: 'resolv.conf с неверным nameserver' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'DNS может не работать из-за CoreDNS (a), NetworkPolicy на UDP 53 (b) или неправильного resolv.conf (d). `dnsPolicy` по умолчанию `ClusterFirst` — специально не указывать не нужно (c).',
              },
            },
            {
              id: 'k8-l15-s5',
              title: 'Проверь себя: dnsPolicy',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте dnsPolicy и его поведение',
                pairs: [
                  { left: 'ClusterFirst (по умолчанию)', right: 'Сначала CoreDNS, потом upstream' },
                  { left: 'Default', right: 'DNS узла (как у хоста)' },
                  { left: 'None', right: 'Свой nameserver через dnsConfig' },
                  { left: 'ClusterFirstWithHostNet', right: 'Для hostNetwork подов: сначала CoreDNS' },
                ],
                explanation:
                  'ClusterFirst — стандарт. Default — DNS узла (для hostNetwork). None — свой DNS. ClusterFirstWithHostNet — для hostNetwork подов, чтобы они видели CoreDNS. На собеседовании middle: «какой dnsPolicy по умолчанию?» — ClusterFirst.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Хранилища (было k8-m6)
    // ─────────────────────────────────────────────
    {
      id: 'k8-a-m2',
      title: 'Хранилища: PV, PVC, StorageClass',
      lessons: [
        {
          id: 'k8-l16',
          title: 'Volumes и PersistentVolume',
          minutes: 30,
          steps: [
            {
              id: 'k8-l16-s1',
              title: 'Эфемерные volumes и когда их мало',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Типы volumes в поде',
                  code: `volumes:
  # emptyDir — временное хранилище, умирает с подом
  - name: cache
    emptyDir: {}

  # hostPath — каталог на узле (для DaemonSet)
  - name: proc
    hostPath:
      path: /proc

  # configMap — конфиг как файлы
  - name: config
    configMap:
      name: app-config

  # secret — секреты как файлы
  - name: tls
    secret:
      secretName: my-tls

  # persistentVolumeClaim — постоянное хранилище
  - name: data
    persistentVolumeClaim:
      claimName: my-pvc`,
                },
                { type: 'p', text: 'emptyDir, configMap, secret — эфемерные: умирают вместе с подом. Для БД, загрузок, кэша между перезапусками нужны PersistentVolume (PV) — постоянные диски, которые переживают под.' },
                { type: 'note', text: 'PV — кластерный ресурс, как узел или namespace. Он живёт независимо от подов. PVC (PersistentVolumeClaim) — «заявка» от пода на PV. Под создаёт PVC, Kubernetes находит подходящий PV и связывает их (binding).' },
              ],
            },
            {
              id: 'k8-l16-s2',
              title: 'PV и PVC: bind',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PV (админ создаёт вручную) и PVC (пользователь)',
                  code: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual     # должен совпадать с PVC
  hostPath:                    # для локального теста; в облаке — EBS/GCE PD
    path: /mnt/data
    type: DirectoryOrCreate
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi            # ≤ 10Gi в PV
  storageClassName: manual    # должен совпадать с PV`,
                },
                {
                  type: 'table',
                  caption: 'Access modes',
                  head: ['Режим', 'Смысл', 'Типичный бэкенд'],
                  rows: [
                    ['ReadWriteOnce (RWO)', 'Один узел читает и пишет', 'EBS, GCE PD, локальный диск'],
                    ['ReadOnlyMany (ROX)', 'Много узлов читают', 'NFS, CephFS, EFS'],
                    ['ReadWriteMany (RWX)', 'Много узлов читают и пишут', 'NFS, CephFS, EFS'],
                    ['ReadWriteOncePod (RWOP)', 'Один под читает и пишет (1.22+)', 'Блочные диски'],
                  ],
                },
                { type: 'note', text: 'RWO — самый частый случай (диски в облаке). Если БД в StatefulSet на 3 ноды, каждая нода получает свой RWO-диск. RWX нужен для shared-хранилищ (например, для ML-данных или статики на нескольких подах).' },
              ],
            },
            {
              id: 'k8-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём разница между PV и PVC?',
                options: [
                  { id: 'a', text: 'PV — для БД, PVC — для статики' },
                  { id: 'b', text: 'PV — ресурс кластера (создаёт админ); PVC — заявка от пользователя/пода на PV' },
                  { id: 'c', text: 'Это одно и то же' },
                  { id: 'd', text: 'PVC работает только в облаке' },
                ],
                correct: ['b'],
                explanation:
                  'PV — «диск» в кластере, PVC — «мне нужен диск такого размера». Kubernetes находит подходящий PV и связывает их. С динамическим выделением PV создаётся автоматически по StorageClass.',
              },
            },
            {
              id: 'k8-l16-s4',
              title: 'reclaimPolicy: что будет с диском при удалении PVC',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Reclaim policy определяет судьбу PV (и физического диска) после удаления PVC. Это критично: Retain = «не удаляй данные», Delete = «удали вместе с PVC».' },
                {
                  type: 'table',
                  caption: 'reclaimPolicy',
                  head: ['Политика', 'Что делает', 'Когда'],
                  rows: [
                    ['Retain', 'PV остаётся, но status = Released; данные сохраняются; админ разбирается вручную', 'Прод-БД, любые важные данные'],
                    ['Delete', 'PV и физический диск удаляются', 'Временные диски, dev'],
                    ['Recycle', 'Устарело (deprecated) — был «rm -rf» внутри PV', 'Не использовать'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'PV в статусе Released — что делать',
                  code: `# PVC удалён, PV остался в Released
kubectl get pv
# NAME    CAPACITY   STATUS     CLAIM
# my-pv   10Gi       Released   default/my-pvc

# Вариант 1: переиспользовать PV для нового PVC
kubectl patch pv my-pv -p '{"spec":{"claimRef":null}}'
# теперь PV = Available, новый PVC может его взять

# Вариант 2: удалить PV, если данные не нужны
kubectl delete pv my-pv`,
                },
                { type: 'note', text: 'На собеседовании middle: «что произойдёт с PV после удаления PVC?» — «зависит от reclaimPolicy: Retain — PV в Released, данные целы; Delete — PV и диск удалены». «Как переиспользовать PV?» — «убрать claimRef, статус станет Available». Это критично для БД.' },
              ],
            },
            {
              id: 'k8-l16-s5',
              title: 'Проверь себя: reclaimPolicy',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте reclaimPolicy и её поведение',
                pairs: [
                  { left: 'Retain', right: 'PV остаётся в Released, данные целы' },
                  { left: 'Delete', right: 'PV и физический диск удаляются' },
                  { left: 'Released', right: 'Статус PV после удаления PVC при Retain' },
                  { left: 'Available', right: 'Статус PV после очистки claimRef' },
                ],
                explanation:
                  'Retain — данные сохранены. Delete — диск удалён. Released — PV «освобождён», но не переиспользуется. Available — PV готов к новому PVC (после claimRef = null). Для прода — Retain.',
              },
            },
          ],
        },
        {
          id: 'k8-l17',
          title: 'StorageClass и динамическое выделение',
          minutes: 30,
          steps: [
            {
              id: 'k8-l17-s1',
              title: 'Динамическое выделение',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Создавать PV вручную неудобно: заканчиваются, не подходят по размеру, нужно заботиться о них. StorageClass — «шаблон», по которому PV создаётся автоматически при появлении PVC. Кластерный админ настраивает 2–3 класса, пользователи просто заказывают PVC.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'StorageClass (обычно создаёт админ/облако)',
                  code: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com     # AWS EBS; для GCP — pd.csi.storage.gke.io
parameters:
  type: gp3
  encrypted: "true"
reclaimPolicy: Delete            # Delete | Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true       # можно расширять`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PVC — PV создастся автоматически',
                  code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: fast-ssd    # ← здесь
  resources:
    requests:
      storage: 20Gi`,
                },
                {
                  type: 'list',
                  items: [
                    'provisioner — CSI-драйвер (aws-ebs, gce-pd, csi.vsphere, nfs.csi)',
                    'reclaimPolicy: Delete — PV и диск удаляются при удалении PVC; Retain — остаются',
                    'volumeBindingMode: Immediate (по умолчанию) — сразу создаёт диск',
                    'volumeBindingMode: WaitForFirstConsumer — ждёт, когда под запланируется на узел (важно для zone-aware дисков)',
                    'allowVolumeExpansion: true — PVC можно увеличивать без пересоздания',
                  ],
                },
                { type: 'note', text: 'Обычно в кластере есть default StorageClass — если в PVC не указать storageClassName, используется он. Проверьте: kubectl get storageclass — у одного из них будет (default).' },
              ],
            },
            {
              id: 'k8-l17-s2',
              title: 'StatefulSet + PVC template',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В StatefulSet volumeClaimTemplates автоматически создаёт PVC на каждый под: data-postgres-0, data-postgres-1, data-postgres-2. При пересоздании пода PVC переиспользуется — данные сохраняются.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PVC на каждый под',
                  code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless
  replicas: 3
  selector:
    matchLabels: { app: postgres }
  template:
    metadata:
      labels: { app: postgres }
    spec:
      containers:
        - name: postgres
          image: postgres:16
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 20Gi`,
                },
                { type: 'note', text: 'При удалении StatefulSet PVC НЕ удаляются автоматически — это защита от потери данных. Приходится удалять вручную: kubectl delete pvc data-postgres-0. Считайте это фичей, а не багом.' },
              ],
            },
            {
              id: 'k8-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт при удалении StatefulSet с 3 репликами и volumeClaimTemplates?',
                options: [
                  { id: 'a', text: 'PVC и их диски удалятся вместе со StatefulSet' },
                  { id: 'b', text: 'PVC останутся — данные сохранятся, удалять вручную' },
                  { id: 'c', text: 'StatefulSet нельзя удалить, пока есть PVC' },
                  { id: 'd', text: 'PVC удалятся только через kubectl delete pvc --all' },
                ],
                correct: ['b'],
                explanation:
                  'Это защита от случайной потери данных: StatefulSet удалили, PVC (и данные на дисках) остались. Приходится удалять вручную через kubectl delete pvc data-postgres-0, data-postgres-1 и т.д.',
              },
            },
            {
              id: 'k8-l17-s4',
              title: 'WaitForFirstConsumer: зачем',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Облачные диски (EBS, GCE PD) привязаны к зоне (zone). Если PV создан в zone-a, а под запланирован на узел в zone-b — под не сможет подключить диск. WaitForFirstConsumer решает: сначала планируется под, потом создаётся диск в той же зоне.' },
                {
                  type: 'mermaid',
                  caption: 'Immediate vs WaitForFirstConsumer',
                  code: `graph TB
                    subgraph Immediate["Immediate (по умолчанию)"]
                        I1["PVC создан"] --> I2["PV в zone-a"]
                        I3["Под хочу в zone-b"] --> I4["❌ не может подключить"]
                    end
                    subgraph Wait["WaitForFirstConsumer"]
                        W1["PVC создан"] --> W2["Под планируется"]
                        W2 --> W3["Под в zone-b"]
                        W3 --> W4["PV в zone-b"]
                        W4 --> W5["✅ работает"]
                    end`,
                },
                {
                  type: 'list',
                  items: [
                    'Облачные диски привязаны к зоне (EBS, GCE PD)',
                    'Immediate: PV создаётся сразу, может оказаться не в той зоне',
                    'WaitForFirstConsumer: PV создаётся после планирования пода',
                    'Стандарт для multi-zone кластеров',
                    'В managed-кластерах обычно уже настроено правильно',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle: «что такое WaitForFirstConsumer?» — «PV создаётся после планирования пода, чтобы диск оказался в той же зоне». «Зачем?» — «EBS/GCE PD привязаны к зоне; без этого под не сможет подключить диск». Это частая проблема при самодельных кластерах.' },
              ],
            },
            {
              id: 'k8-l17-s5',
              title: 'Проверь себя: StorageClass',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте параметр StorageClass и его назначение',
                pairs: [
                  { left: 'provisioner', right: 'CSI-драйвер (aws-ebs, gce-pd)' },
                  { left: 'reclaimPolicy: Delete', right: 'Удалить PV и диск при удалении PVC' },
                  { left: 'volumeBindingMode: WaitForFirstConsumer', right: 'Создать PV в зоне, где запланирован под' },
                  { left: 'allowVolumeExpansion: true', right: 'Можно расширять PVC без пересоздания' },
                ],
                explanation:
                  'provisioner — «кто создаёт диск». reclaimPolicy — «что с ним после PVC». WaitForFirstConsumer — «создать в нужной зоне». allowVolumeExpansion — «можно ли увеличить». На собеседовании middle: «как расширить PVC?» — «если allowVolumeExpansion: true — edit PVC, увеличить storage».',
              },
            },
          ],
        },
        {
          id: 'k8-l18',
          title: 'Практика: PostgreSQL в Kubernetes',
          minutes: 35,
          steps: [
            {
              id: 'k8-l18-s1',
              title: 'Полный манифест',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'StatefulSet + Headless Service + PVC template',
                  code: `apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: "super-secret"
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
    - port: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata   # подкаталог, иначе initdb ругается
          resources:
            requests: { cpu: 200m, memory: 256Mi }
            limits:   { cpu: 1,    memory: 1Gi }
          readinessProbe:
            exec:
              command: ["pg_isready", "-U", "postgres"]
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", "postgres"]
            initialDelaySeconds: 30
            periodSeconds: 15
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 20Gi`,
                },
                {
                  type: 'list',
                  items: [
                    'PGDATA=/var/lib/postgresql/data/pgdata — обязательно! Иначе initdb упадёт на пустом каталоге',
                    'readinessProbe через pg_isready — K8s не шлёт трафик, пока БД не готова',
                    'livenessProbe — перезапускает, если БД зависла (но не путать с «медленно грузится»)',
                    'requests/limits — обязательно, иначе под может съесть весь узел',
                    'Secret для пароля — не ENV в манифесте',
                  ],
                },
                { type: 'note', text: 'Postgres в K8s — это не «задеплоил и забыл». С 1 репликой всё просто. С репликацией — нужен Patroni, Zalando postgres-operator или CloudNativePG. В продакшене чаще берут managed (RDS, Cloud SQL), а не разворачивают в кластере. Но для понимания StatefulSet и PVC — это классический пример.' },
              ],
            },
            {
              id: 'k8-l18-s2',
              title: 'Резервное копирование',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'CronJob для бэкапа',
                  code: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: postgres:16
              command:
                - /bin/sh
                - -c
                - |
                  pg_dump -h postgres-0.postgres-headless \\
                          -U postgres appdb | \\
                  gzip > /backup/db-$(date +%F).sql.gz
              env:
                - name: PGPASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: postgres-secret
                      key: POSTGRES_PASSWORD
              volumeMounts:
                - name: backup
                  mountPath: /backup
          volumes:
            - name: backup
              persistentVolumeClaim:
                claimName: backup-pvc`,
                },
                {
                  type: 'list',
                  items: [
                    'pg_dump — логический бэкап (SQL-дамп)',
                    'gzip — сжать, иначе диск забьётся',
                    'concurrencyPolicy: Forbid — не запускать новый бэкап, если предыдущий идёт',
                    'backup-pvc — отдельный PVC для бэкапов (не тот же, что у БД!)',
                    'Для восстановления: gunzip -c dump.sql.gz | psql -U postgres appdb',
                  ],
                },
                { type: 'note', text: 'PVC с бэкапами — это НЕ бэкап в смысле disaster recovery. Если узел умрёт или кластер сломается — PVC тоже может пропасть. Настоящий бэкап — в Object Storage (S3, GCS), откуда его можно восстановить на любом кластере. Для продакшена — pgBackRest, Barman, Velero.' },
              ],
            },
            {
              id: 'k8-l18-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что обязательно для PostgreSQL в StatefulSet?',
                options: [
                  { id: 'a', text: 'Service с clusterIP: None (Headless)' },
                  { id: 'b', text: 'volumeClaimTemplates для хранения данных' },
                  { id: 'c', text: 'Deployment вместо StatefulSet' },
                  { id: 'd', text: 'readinessProbe через pg_isready' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'БД в K8s — всегда StatefulSet (не Deployment!), с Headless Service для стабильных DNS, с PVC для данных, с readiness/liveness probes. Deployment для БД — классическая ошибка, которая приведёт к потере данных.',
              },
            },
            {
              id: 'k8-l18-s4',
              title: 'Проверь себя: восстановление',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему pg_dump + PVC с бэкапами — это НЕ настоящий бэкап (disaster recovery)?',
                options: [
                  { id: 'a', text: 'pg_dump медленный' },
                  { id: 'b', text: 'PVC привязан к кластеру/зоне: при потере кластера бэкапы тоже пропадут' },
                  { id: 'c', text: 'pg_dump не работает в CronJob' },
                  { id: 'd', text: 'PVC нельзя монтировать в CronJob' },
                ],
                correct: ['b'],
                explanation:
                  'PVC живёт в том же кластере (и обычно в той же зоне). Если кластер сломался или зона недоступна — и БД, и бэкапы пропали. Настоящий бэкап — в Object Storage (S3, GCS), вне кластера. Для K8s — Velero (бэкап ресурсов + PV в S3).',
              },
            },
            {
              id: 'k8-l18-s5',
              title: 'Проверь себя: PGDATA',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какую переменную окружения нужно указать в Postgres, чтобы `initdb` не падал на непустом каталоге (например, `/var/lib/postgresql/data/pgdata`)?',
                accepted: ['PGDATA', 'pgdata', 'PGDATA=/var/lib/postgresql/data/pgdata'],
                placeholder: 'переменная',
                hint: 'Postgres Data Directory',
                explanation:
                  'PGDATA — путь к каталогу данных. Если монтировать PVC прямо в /var/lib/postgresql/data, там может быть lost+found — initdb упадёт («directory not empty»). Решение: PGDATA=/var/lib/postgresql/data/pgdata (подкаталог). Классическая ошибка при запуске Postgres в K8s.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — RBAC и безопасность (было k8-m7)
    // ─────────────────────────────────────────────
    {
      id: 'k8-a-m3',
      title: 'RBAC и безопасность',
      lessons: [
        {
          id: 'k8-l19',
          title: 'ServiceAccount: идентичность пода',
          minutes: 25,
          steps: [
            {
              id: 'k8-l19-s1',
              title: 'Зачем ServiceAccount',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда под хочет обратиться к Kubernetes API (например, посмотреть другие поды, обновить ConfigMap), ему нужна идентичность. ServiceAccount — это «пользователь» для пода. Каждый под получает токен ServiceAccount (mount в /var/run/secrets/kubernetes.io/serviceaccount/token).' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Явный ServiceAccount',
                  code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: myapp-sa
  namespace: production
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    spec:
      serviceAccountName: myapp-sa    # ← указать
      containers:
        - name: myapp
          image: myapp:1.4.2`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Отключить монтирование токена (если API не нужен)',
                  code: `spec:
  template:
    spec:
      automountServiceAccountToken: false    # ← не монтировать токен
      containers:
        - name: myapp
          image: myapp:1.4.2`,
                },
                { type: 'note', text: 'По умолчанию в каждый под монтируется токен default ServiceAccount. Если приложению НЕ нужен доступ к K8s API (99% случаев) — отключите автомонтирование: automountServiceAccountToken: false. Это уменьшает поверхность атаки.' },
              ],
            },
            {
              id: 'k8-l19-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Приложению не нужен доступ к Kubernetes API. Что сделать с ServiceAccount?',
                options: [
                  { id: 'a', text: 'Удалить ServiceAccount default' },
                  { id: 'b', text: 'Установить automountServiceAccountToken: false' },
                  { id: 'c', text: 'Ничего, это безопасно по умолчанию' },
                  { id: 'd', text: 'Поставить clusterIP: None' },
                ],
                correct: ['b'],
                explanation:
                  'automountServiceAccountToken: false отключает монтирование токена в под. Если токен не нужен — его не должно быть. Это одна из базовых практик безопасности (не оставлять лишние креды).',
              },
            },
            {
              id: 'k8-l19-s3',
              title: 'Проверь себя: идентичность',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какое поле в spec пода указывает, какой ServiceAccount использовать?',
                accepted: ['serviceAccountName', 'serviceAccountName:', 'spec.serviceAccountName'],
                placeholder: 'поле',
                hint: 'camelCase, начинается с service',
                explanation:
                  'spec.serviceAccountName: myapp-sa — указывает, чей токен монтировать в под. По умолчанию — default ServiceAccount в namespace. На собеседовании junior DevOps: «как под аутентифицируется в K8s API?» — «через токен ServiceAccount».',
              },
            },
            {
              id: 'k8-l19-s4',
              title: 'Token projection и audience',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Раньше токен ServiceAccount был долгоживущим JWT, который «жил» в Secret. В новых версиях K8s — token projection: короткоживущий токен, автоматически обновляемый kubelet, с указанием audience (кому он предназначен). Это безопаснее.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Token projection',
                  code: `spec:
  containers:
    - name: myapp
      image: myapp:1.4.2
      volumeMounts:
        - name: token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: token
      projected:
        sources:
          - serviceAccountToken:
              path: vault-token
              audience: vault.example.com
              expirationSeconds: 3600    # 1 час, автообновление`,
                },
                {
                  type: 'list',
                  items: [
                    'Token projection — короткоживущие токены (1 час)',
                    'Audience — кому токен (Vault, AWS, свой API)',
                    'Автообновление — kubelet обновляет токен до истечения',
                    'ServiceAccountTokenVolumeProjection — стандарт с 1.20+',
                    'Старые Secrets с токеном (kubernetes.io/service-account-token) — deprecated',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle: «как под получает токен для Vault?» — «token projection с audience=vault.example.com». «Почему не старый Secret?» — «старый долгоживущий, projection — короткоживущий с автообновлением». Это про безопасность: утёк токен — истечёт через час.' },
              ],
            },
            {
              id: 'k8-l19-s5',
              title: 'Проверь себя: token projection',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте поле и его назначение',
                pairs: [
                  { left: 'serviceAccountName', right: 'Какой SA использовать для пода' },
                  { left: 'audience', right: 'Кому предназначен токен (Vault, AWS)' },
                  { left: 'expirationSeconds', right: 'Время жизни токена (автообновление)' },
                  { left: 'automountServiceAccountToken', right: 'Монтировать ли токен вообще' },
                ],
                explanation:
                  'serviceAccountName — «кто». audience — «кому». expirationSeconds — «сколько живёт». automountServiceAccountToken — «монтировать ли». Token projection — безопасный способ: короткоживущие токены с аудиторией.',
              },
            },
          ],
        },
        {
          id: 'k8-l20',
          title: 'RBAC: кто что может',
          minutes: 35,
          steps: [
            {
              id: 'k8-l20-s1',
              title: 'Role, ClusterRole, Bindings',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'RBAC (Role-Based Access Control) — правила «кто что может делать». Четыре объекта: Role, ClusterRole, RoleBinding, ClusterRoleBinding. Отличие Role и ClusterRole — область действия: Role работает в одном namespace, ClusterRole — во всех (или для cluster-scoped ресурсов: узлы, PV).' },
                {
                  type: 'table',
                  caption: 'Что где',
                  head: ['Объект', 'Область', 'Что определяет'],
                  rows: [
                    ['Role', 'Namespace', 'Права на ресурсы в namespace'],
                    ['ClusterRole', 'Кластер', 'Права на cluster-scoped ресурсы или на все namespace'],
                    ['RoleBinding', 'Namespace', 'Связывает Role/ClusterRole с subject в namespace'],
                    ['ClusterRoleBinding', 'Кластер', 'Связывает ClusterRole с subject глобально'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Role и RoleBinding',
                  code: `# Role: можно читать поды и логи в namespace production
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
---
# RoleBinding: связываем с пользователем anna
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: anna-pod-reader
  namespace: production
subjects:
  - kind: User
    name: anna                    # имя в сертификате/OIDC
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'ClusterRole и ClusterRoleBinding',
                  code: `# ClusterRole: можно смотреть узлы (cluster-scoped)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-viewer
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "watch"]
---
# ClusterRoleBinding: даём это group ops-team
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ops-node-viewer
subjects:
  - kind: Group
    name: ops-team
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: node-viewer
  apiGroup: rbac.authorization.k8s.io`,
                },
              ],
            },
            {
              id: 'k8-l20-s2',
              title: 'Verbs и subject kinds',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Основные verbs',
                  head: ['Verb', 'Что разрешает'],
                  rows: [
                    ['get', 'Получить один объект по имени'],
                    ['list', 'Получить список объектов'],
                    ['watch', 'Следить за изменениями (поток)'],
                    ['create', 'Создать объект'],
                    ['update', 'Обновить объект (полная замена)'],
                    ['patch', 'Частично обновить объект'],
                    ['delete', 'Удалить объект'],
                    ['deletecollection', 'Удалить все объекты (kubectl delete pods --all)'],
                  ],
                },
                {
                  type: 'table',
                  caption: 'Kinds для subject',
                  head: ['Kind', 'Кто это'],
                  rows: [
                    ['User', 'Человек (по имени в сертификате/OIDC)'],
                    ['Group', 'Группа людей (system:masters, ops-team)'],
                    ['ServiceAccount', 'Идентичность пода (namespace/name)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка прав',
                  code: `# Могу ли я (текущий контекст) делать X?
kubectl auth can-i create pods
kubectl auth can-i delete deployments --namespace production

# Могу ли я от имени другого?
kubectl auth can-i list pods --as=system:serviceaccount:production:myapp-sa
kubectl auth can-i get secrets --as=anna --namespace production

# Что вообще могу?
kubectl auth can-i --list`,
                },
                { type: 'note', text: 'Принцип наименьших привилегий: давайте ровно те права, которые нужны, и не больше. Не давайте cluster-admin, если хватит pod-reader в одном namespace. Это защита от «случайно удалил прод» и от компрометации.' },
              ],
            },
            {
              id: 'k8-l20-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какому subject нужно дать права через ClusterRoleBinding, чтобы под мог читать узлы?',
                options: [
                  { id: 'a', text: 'kind: User — имя разработчика' },
                  { id: 'b', text: 'kind: ServiceAccount — идентичность пода' },
                  { id: 'c', text: 'kind: Pod' },
                  { id: 'd', text: 'kind: Namespace' },
                ],
                correct: ['b'],
                explanation:
                  'Под имеет идентичность ServiceAccount. Чтобы под мог читать узлы, нужно дать права ServiceAccount (kind: ServiceAccount в subject). User — для людей, Group — для групп людей.',
              },
            },
            {
              id: 'k8-l20-s4',
              title: 'Aggregated ClusterRole и встроенные роли',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В K8s есть встроенные ClusterRole — не пишите их с нуля. Плюс Aggregated ClusterRole: одна роль собирается из нескольких по label-селектору. Это стандарт для операторов (каждый добавляет свои правила).' },
                {
                  type: 'table',
                  caption: 'Встроенные ClusterRole',
                  head: ['Роль', 'Что даёт'],
                  rows: [
                    ['cluster-admin', 'Полный доступ ко всему (суперпользователь)'],
                    ['admin', 'Полный доступ в namespace, кроме RBAC/квот'],
                    ['edit', 'Изменение ресурсов в namespace (без RBAC)'],
                    ['view', 'Только чтение в namespace'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Aggregated ClusterRole',
                  code: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
    - matchLabels:
        rbac.example.com/aggregate-to-monitoring: "true"
rules: []   # заполняется автоматически из ролей с этим label
---
# Любая роль с этим label автоматически попадёт в monitoring
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-prometheus
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "endpoints"]
    verbs: ["get", "list", "watch"]`,
                },
                {
                  type: 'list',
                  items: [
                    'Встроенные роли: cluster-admin, admin, edit, view',
                    'cluster-admin — «бог», не давайте приложениям',
                    'view/edit/admin — на namespace, для людей',
                    'Aggregated ClusterRole — «роль из ролей», для операторов',
                    'kubectl get clusterrole — посмотреть все',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «как оператор добавляет права, не редактируя чужие ClusterRole?» — «Aggregated ClusterRole: оператор добавляет роль с label, она автоматически попадает в агрегированную». Это архитектурный паттерн K8s.' },
              ],
            },
            {
              id: 'k8-l20-s5',
              title: 'Проверь себя: объекты RBAC',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте объект RBAC и его назначение',
                pairs: [
                  { left: 'Role', right: 'Права в одном namespace' },
                  { left: 'ClusterRole', right: 'Права на cluster-scoped ресурсы или все namespace' },
                  { left: 'RoleBinding', right: 'Связывает роль с subject в namespace' },
                  { left: 'ClusterRoleBinding', right: 'Связывает ClusterRole с subject глобально' },
                ],
                explanation:
                  'Role — namespace. ClusterRole — кластер. RoleBinding — «связать в namespace». ClusterRoleBinding — «связать глобально». На собеседовании middle: «чем Role отличается от ClusterRole?» — «областью действия».',
              },
            },
          ],
        },
        {
          id: 'k8-l21',
          title: 'SecurityContext и Pod Security Standards',
          minutes: 35,
          steps: [
            {
              id: 'k8-l21-s1',
              title: 'securityContext в поде',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'По умолчанию под запускается с правами root и без ограничений. Это опасно: при компрометации контейнера злоумышленник получает root на хосте. securityContext позволяет ограничить процесс: non-root, read-only ФС, capabilities, seccomp.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Безопасный pod',
                  code: `spec:
  securityContext:              # на уровне пода
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: myapp
      image: myapp:1.4.2
      securityContext:          # на уровне контейнера
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
      volumeMounts:
        - name: tmp
          mountPath: /tmp       # writable tmp для readOnlyRootFilesystem
  volumes:
    - name: tmp
      emptyDir: {}`,
                },
                {
                  type: 'table',
                  caption: 'Что делают поля',
                  head: ['Поле', 'Что делает'],
                  rows: [
                    ['runAsNonRoot: true', 'Запрет запуска от root — под упадёт, если образ пытается'],
                    ['runAsUser: 1000', 'Запустить от конкретного UID'],
                    ['readOnlyRootFilesystem: true', 'Корневая ФС только на чтение — защита от подмены файлов'],
                    ['allowPrivilegeEscalation: false', 'Запрет sudo/setuid — нельзя повысить привилегии'],
                    ['capabilities.drop: [ALL]', 'Убрать все Linux capabilities (NET_RAW, SYS_ADMIN, ...)'],
                    ['seccompProfile: RuntimeDefault', 'Ограничить системные вызовы (защита от эксплойтов)'],
                  ],
                },
              ],
            },
            {
              id: 'k8-l21-s2',
              title: 'Pod Security Standards',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Проверять securityContext в каждом манифесте вручную — утомительно. Pod Security Standards (PSS) — три уровня безопасности, которые применяются к namespace целиком: Privileged, Baseline, Restricted.' },
                {
                  type: 'table',
                  caption: 'Три уровня',
                  head: ['Уровень', 'Разрешает', 'Для чего'],
                  rows: [
                    ['Privileged', 'Всё (root, hostPath, hostNetwork)', 'kube-system, CNI, мониторинг'],
                    ['Baseline', 'Обычные приложения, без root и hostNetwork', 'Большинство приложений'],
                    ['Restricted', 'Только non-root, read-only ФС, drop ALL', 'Наиболее чувствительные namespace'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Применяем Restricted к namespace',
                  code: `apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted    # блокирует несоответствующие
    pod-security.kubernetes.io/audit: restricted      # логирует
    pod-security.kubernetes.io/warn: restricted       # предупреждает`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что проверяет Restricted',
                  code: `✓ runAsNonRoot: true
✓ allowPrivilegeEscalation: false
✓ capabilities.drop: [ALL]
✓ seccompProfile: RuntimeDefault или Localhost
✓ readOnlyRootFilesystem: true (рекомендуется)
✗ hostNetwork, hostPID, hostIPC
✗ privileged: true
✗ hostPath volumes`,
                },
                { type: 'note', text: 'PSS — это «policy enforcement» на уровне admission controller. Если namespace помечен enforce: restricted, а под не соответствует — под не запустится с ошибкой. Это защита от «забыл securityContext». На собеседовании по безопасности K8s это спрашивают.' },
              ],
            },
            {
              id: 'k8-l21-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем в securityContext ставится readOnlyRootFilesystem: true?',
                options: [
                  { id: 'a', text: 'Ускоряет чтение файлов' },
                  { id: 'b', text: 'Запрещает приложению изменять файлы в контейнере — защита от подмены' },
                  { id: 'c', text: 'Уменьшает размер образа' },
                  { id: 'd', text: 'Это требование Kubernetes' },
                ],
                correct: ['b'],
                explanation:
                  'Если корневая ФС только на чтение, злоумышленник не сможет подменить бинарник, дописать скрипт в PATH, установить бэкдор. Для временных файлов — отдельный emptyDir на /tmp. Одна из самых эффективных мер защиты.',
              },
            },
            {
              id: 'k8-l21-s4',
              title: 'Проверь себя: PSS',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте уровень PSS и его требования',
                pairs: [
                  { left: 'Privileged', right: 'Разрешает всё (root, hostPath)' },
                  { left: 'Baseline', right: 'Без root и hostNetwork' },
                  { left: 'Restricted', right: 'Non-root, read-only ФС, drop ALL' },
                  { left: 'enforce', right: 'Блокирует поды, не соответствующие уровню' },
                ],
                explanation:
                  'Privileged — всё. Baseline — обычные приложения. Restricted — максимально строго. enforce — «блокировать», audit — «логировать», warn — «предупреждать». На собеседовании middle: «какой уровень для прода?» — «Baseline или Restricted, в зависимости от чувствительности».',
              },
            },
            {
              id: 'k8-l21-s5',
              title: 'Применяем Restricted на практике',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда namespace помечен enforce: restricted, все новые поды проверяются на соответствие. Проблема: старые поды остаются работать (PSS не пересматривает существующие). Плюс: некоторые приложения требуют root — их надо явно вынести в отдельный namespace с Baseline.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Проверка соответствия PSS',
                  code: `# Посмотреть, какие label у namespace
kubectl get ns production --show-labels

# Проверить, какие поды нарушают restricted
kubectl label --dry-run=server --overwrite ns production \\
  pod-security.kubernetes.io/enforce=restricted
# Выведет предупреждения, если есть несоответствия

# Временно ослабить для конкретного namespace (не для прода!)
kubectl label ns legacy-app \\
  pod-security.kubernetes.io/enforce=privileged \\
  --overwrite

# Проверить, какие capabilities и UID у пода
kubectl get pod myapp -o jsonpath='{.spec.securityContext}'
kubectl get pod myapp -o jsonpath='{.spec.containers[0].securityContext}'`,
                },
                {
                  type: 'list',
                  items: [
                    'PSS применяется к новым подам — старые продолжают работать',
                    'Временно ослабить для legacy — label на namespace',
                    'Не все приложения работают под Restricted (нужен root) — вынести в отдельный namespace',
                    'kubectl label --dry-run=server — «что будет, если применить»',
                    'PSS + NetworkPolicy + RBAC — тройка безопасности K8s',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «как внедрить PSS в существующий кластер?» — «сначала audit/warn на всех namespace (не блокирует), потом enforce по одному namespace, начиная с новых; для legacy — отдельный namespace с Baseline». Миграция PSS — это процесс, а не «включили restricted везде».' },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Helm и Kustomize (было k8-m8 + k8-m9, без дубля k8-l22)
    // ─────────────────────────────────────────────
    {
      id: 'k8-a-m4',
      title: 'Helm и Kustomize',
      lessons: [
        {
          id: 'k8-l26',
          title: 'Зачем нужен Helm и структура чарта',
          minutes: 30,
          steps: [
            {
              id: 'k8-l26-s1',
              title: 'Проблема без Helm',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Приложение в K8s — это не один YAML, а 5–10 (Deployment, Service, Ingress, ConfigMap, Secret, HPA). Для 3 окружений (dev, staging, prod) это 30 файлов с почти одинаковым содержимым. Helm упаковывает всё в chart с параметризацией через values.yaml.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура чарта',
                  code: `mychart/
├── Chart.yaml          # имя, версия, зависимости
├── values.yaml         # значения по умолчанию
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── _helpers.tpl    # вспомогательные шаблоны
└── charts/             # subcharts (зависимости)`,
                },
                { type: 'note', text: 'Helm — де-факто стандарт для установки сторонних приложений (nginx-ingress, cert-manager, prometheus). Публичные чарты лежат в Artifact Hub. На собеседовании DevOps: «как ставите ingress-nginx?» — ответ «helm install».' },
              ],
            },
            {
              id: 'k8-l26-s2',
              title: 'Проверь себя: Chart.yaml',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен файл `Chart.yaml` в Helm-чарте?',
                options: [
                  { id: 'a', text: 'Хранит секреты приложения' },
                  { id: 'b', text: 'Содержит метаданные: имя чарта, версию, описание, зависимости' },
                  { id: 'c', text: 'Описывает Deployment' },
                  { id: 'd', text: 'Это конфиг для kubectl' },
                ],
                correct: ['b'],
                explanation: 'Chart.yaml — «паспорт» чарта: name, version, appVersion, dependencies. Без него Helm не поймёт, что это чарт. values.yaml — параметры, templates/ — манифесты.',
              },
            },
            {
              id: 'k8-l26-s3',
              title: 'Chart.yaml на практике',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Полный Chart.yaml',
                  code: `apiVersion: v2                      # Helm 3
name: myapp
description: My application chart
version: 1.4.2                      # версия чарта (меняется при изменении шаблонов)
appVersion: "1.4.0"                 # версия приложения (меняется при деплое)
type: application                    # application | library
kubeVersion: ">=1.27.0"             # минимальная версия K8s
keywords: [web, api]
home: https://github.com/myorg/myapp
sources:
  - https://github.com/myorg/myapp
maintainers:
  - name: Platform Team
    email: platform@myorg.com
dependencies:
  - name: postgresql
    version: "~> 15.0"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled`,
                },
                {
                  type: 'list',
                  items: [
                    'apiVersion: v2 — обязателен для Helm 3',
                    'version — SEMVER версия чарта (не приложения!)',
                    'appVersion — версия приложения (то, что в Docker-образе)',
                    'type: application — обычный чарт; library — общий набор шаблонов',
                    'kubeVersion — минимальная версия K8s',
                    'dependencies — subcharts (зависимости, ставятся вместе)',
                  ],
                },
                { type: 'note', text: 'На собеседовании junior/middle DevOps: «чем version отличается от appVersion?» — «version — версия чарта (шаблонов), appVersion — версия приложения (образа)». При смене образа меняем appVersion, при изменении шаблона — version. Классический вопрос.' },
              ],
            },
            {
              id: 'k8-l26-s4',
              title: 'Установка сторонних чартов',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Публичные чарты',
                  code: `# Добавить репозиторий
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Обновить индекс
helm repo update

# Найти чарт
helm search repo nginx
helm search hub prometheus   # поиск по Artifact Hub

# Посмотреть values по умолчанию
helm show values bitnami/postgresql

# Установить сторонний чарт
helm install postgres bitnami/postgresql -n db --set auth.password=secret`,
                },
                { type: 'note', text: 'Artifact Hub (artifacthub.io) — центральный поисковик чартов. Для продакшена: ставьте популярные чарты (bitnami, ingress-nginx, cert-manager, prometheus-community). Свои — публикуйте в OCI-registry (ghcr.io, ECR).' },
              ],
            },
            {
              id: 'k8-l26-s5',
              title: 'Проверь себя: репозитории',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду Helm и её действие',
                pairs: [
                  { left: 'helm repo add', right: 'Подключить репозиторий чартов' },
                  { left: 'helm search repo', right: 'Найти чарт в подключённых репозиториях' },
                  { left: 'helm show values', right: 'Показать values по умолчанию' },
                  { left: 'helm install', right: 'Установить чарт в кластер' },
                ],
                explanation: 'repo add — подключить. search repo — найти. show values — посмотреть параметры. install — установить. Ещё важны: helm upgrade (обновить), helm list (список релизов), helm uninstall (удалить).',
              },
            },
          ],
        },
        {
          id: 'k8-l27',
          title: 'Шаблонизация в Helm',
          minutes: 35,
          steps: [
            {
              id: 'k8-l27-s1',
              title: 'Go templates и .Values',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'values.yaml',
                  code: `replicaCount: 3

image:
  repository: ghcr.io/myorg/myapp
  tag: "1.4.2"

service:
  port: 80`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'templates/deployment.yaml',
                  code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          ports:
            - containerPort: {{ .Values.service.port }}`,
                },
                {
                  type: 'list',
                  items: [
                    '.Values — доступ к values.yaml (и переопределениям)',
                    '.Release.Name — имя релиза (задаётся при helm install my-release)',
                    '.Chart.Name / .Chart.Version — из Chart.yaml',
                    '.Capabilities.KubeVersion — версия кластера (для условий)',
                    '{{- ... }} — обрезка пробелов слева, {{ ... -}} — справа',
                  ],
                },
              ],
            },
            {
              id: 'k8-l27-s2',
              title: 'Условия и циклы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Условия (if) и циклы (range)',
                  code: `{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-ingress
spec:
  rules:
    - host: {{ .Values.ingress.host }}
{{- end }}

env:
{{- range $key, $value := .Values.env }}
  - name: {{ $key }}
    value: {{ $value | quote }}
{{- end }}`,
                },
                { type: 'note', text: '`| quote` — обернуть значение в кавычки. Важно для строк, которые могут выглядеть как числа или boolean (например, `"true"` без кавычек станет boolean true и сломает env).' },
              ],
            },
            {
              id: 'k8-l27-s3',
              title: 'Проверь себя: синтаксис',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как в шаблоне Helm обратиться к параметру `replicaCount` из values.yaml?',
                accepted: ['{{ .Values.replicaCount }}', '{{.Values.replicaCount}}', '.Values.replicaCount'],
                placeholder: '{{ ... }}',
                hint: 'Точка, Values, точка, имя',
                explanation: '{{ .Values.replicaCount }} — стандартный доступ. Точка в начале означает "текущий контекст", Values — корневой объект с values.yaml.',
              },
            },
            {
              id: 'k8-l27-s4',
              title: '_helpers.tpl и named templates',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Чтобы не дублировать одинаковые фрагменты (лейблы, имя, селекторы), в Helm используют named templates — функции в `_helpers.tpl`. Их вызывают через `include "имя" .`. Это стандарт для production-чартов.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'templates/_helpers.tpl',
                  code: `{{- define "myapp.name" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end -}}

{{- define "myapp.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Использование в deployment.yaml',
                  code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.name" . }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ .Chart.Name }}
      app.kubernetes.io/instance: {{ .Release.Name }}
  template:
    metadata:
      labels:
        {{- include "myapp.labels" . | nindent 8 }}`,
                },
                {
                  type: 'list',
                  items: [
                    'define "имя" — объявить шаблон',
                    'include "имя" . — вызвать шаблон (с текущим контекстом)',
                    'nindent N — добавить N пробелов перед каждой строкой',
                    'indent N — добавить N пробелов (без перевода строки в начале)',
                    'tpl — выполнить строку как шаблон (для динамических значений)',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «как избежать дублирования labels в Helm?» — «_helpers.tpl + include + nindent». «Чем include отличается от template?» — «include возвращает строку (можно применить pipe), template — нет». Это классический вопрос.' },
              ],
            },
            {
              id: 'k8-l27-s5',
              title: 'Проверь себя: helpers',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте функцию Helm и её действие',
                pairs: [
                  { left: 'define', right: 'Объявить named template в _helpers.tpl' },
                  { left: 'include', right: 'Вызвать шаблон, вернуть строку (можно pipe)' },
                  { left: 'nindent', right: 'Добавить N пробелов к каждой строке' },
                  { left: 'quote', right: 'Обернуть значение в кавычки' },
                ],
                explanation: 'define — объявить. include — вызвать. nindent — отступ. quote — кавычки. Без nindent вложенные labels «съедут» и YAML станет невалидным. Это самая частая ошибка при написании чартов.',
              },
            },
          ],
        },
        {
          id: 'k8-l28',
          title: 'Управление релизами (install, upgrade, rollback)',
          minutes: 30,
          steps: [
            {
              id: 'k8-l28-s1',
              title: 'Основные команды',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Жизненный цикл релиза',
                  code: `# Установка из локальной папки
helm install myapp ./mychart -n production --create-namespace

# С override values
helm install myapp ./mychart -n production \\
  --set image.tag=1.4.3 \\
  -f prod-values.yaml

# Обновление
helm upgrade myapp ./mychart -n production -f prod-values.yaml

# Install or upgrade (идемпотентно — для CI)
helm upgrade --install myapp ./mychart -n production

# История и откат
helm history myapp -n production
helm rollback myapp 1 -n production

# Удаление
helm uninstall myapp -n production`,
                },
                {
                  type: 'list',
                  items: [
                    'helm install — первый деплой',
                    'helm upgrade — обновление (создаёт новую ревизию)',
                    'helm upgrade --install — идемпотентно, для CI',
                    'helm rollback N — откат к ревизии N',
                    'helm template — отрендерить YAML без установки (для отладки)',
                    'helm diff upgrade — показать, что изменится (плагин)',
                  ],
                },
                { type: 'note', text: 'Helm хранит историю ревизий (по умолчанию 10) в Secret-ах в namespace. `helm rollback` — это не "откат состояния", а деплой старой ревизии. Kubernetes делает rolling update до предыдущей версии.' },
              ],
            },
            {
              id: 'k8-l28-s2',
              title: 'Проверь себя: команды',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду Helm и её действие',
                pairs: [
                  { left: 'helm install', right: 'Первый деплой чарта' },
                  { left: 'helm upgrade', right: 'Обновление с созданием новой ревизии' },
                  { left: 'helm rollback', right: 'Откат к предыдущей ревизии' },
                  { left: 'helm template', right: 'Отрендерить YAML без установки' },
                ],
                explanation: 'install — первый раз. upgrade — обновление. rollback — откат. template — "сухой прогон" для отладки шаблонов (часто с --debug).',
              },
            },
            {
              id: 'k8-l28-s3',
              title: 'helm template и helm diff',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Перед helm upgrade полезно увидеть, что изменится. `helm template` рендерит YAML (без деплоя), `helm diff upgrade` (плагин) показывает diff с текущим состоянием кластера. Это обязательно в CI перед apply.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Сухой прогон',
                  code: `# Отрендерить YAML с values
helm template myapp ./mychart -f prod-values.yaml > rendered.yaml

# То же, но с реальными values из кластера (учёт --set из прошлого релиза)
helm template myapp ./mychart -n production --debug > rendered.yaml

# Diff между текущим релизом и новым (нужен плагин helm-diff)
helm plugin install https://github.com/databus23/helm-diff
helm diff upgrade myapp ./mychart -n production -f prod-values.yaml

# Lint чарта (проверка синтаксиса и практик)
helm lint ./mychart`,
                },
                {
                  type: 'list',
                  items: [
                    'helm template — «что получится из шаблонов»',
                    '--debug — вывести финальные values (с учётом всех override)',
                    'helm diff upgrade — «что изменится в кластере»',
                    'helm lint — синтаксис и best practices',
                    'helm install --dry-run --debug — полный dry-run деплоя',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «как безопасно обновить Helm-релиз?» — «helm diff upgrade → посмотреть diff → helm upgrade». «Что делать, если что-то пошло не так?» — «helm rollback N». Без diff — как «git push --force» в прод.' },
              ],
            },
            {
              id: 'k8-l28-s4',
              title: 'Проверь себя: безопасное обновление',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая команда покажет, что изменится в кластере при `helm upgrade`, без самого обновления?',
                options: [
                  { id: 'a', text: 'helm install --dry-run' },
                  { id: 'b', text: 'helm diff upgrade (плагин) или helm template + ручное сравнение' },
                  { id: 'c', text: 'helm history' },
                  { id: 'd', text: 'kubectl get all' },
                ],
                correct: ['b'],
                explanation:
                  'helm diff upgrade (плагин) показывает diff между текущим релизом и новым — «что изменится». Альтернатива — helm template (отрендерить YAML) и сравнить с kubectl get -o yaml. helm history — список ревизий, не diff.',
              },
            },
            {
              id: 'k8-l28-s5',
              title: 'OCI registry для Helm-чартов',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'С версии 3.8 Helm поддерживает OCI-registry: чарты хранятся как OCI-артефакты в ghcr.io, ECR, GAR — рядом с Docker-образами. Это удобнее, чем отдельный Helm-репозиторий (ChartMuseum).' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Публикация и установка OCI-чарта',
                  code: `# Логин в registry
helm registry login ghcr.io -u myuser --password-stdin < token.txt

# Упаковать и запушить
helm package ./mychart
helm push mychart-1.4.2.tgz oci://ghcr.io/myorg/charts

# Установить из OCI
helm install myapp oci://ghcr.io/myorg/charts/mychart --version 1.4.2 -n production

# В CI — GitHub Actions
# helm push mychart-*.tgz oci://ghcr.io/\${{ github.repository_owner }}/charts`,
                },
                {
                  type: 'list',
                  items: [
                    'OCI-чарты — в том же registry, что Docker-образы',
                    'helm package → helm push oci://...',
                    'helm install oci://... --version X',
                    'Версия чарта — SEMVER, обязательна',
                    'Artifact Hub индексирует OCI-чарты (с 2024)',
                  ],
                },
                { type: 'note', text: 'OCI-registry для Helm — стандарт 2025. Отдельный Helm-репозиторий (ChartMuseum) — legacy. GitHub Actions + ghcr.io — самый простой путь: один registry для образов и чартов. На собеседовании middle: «где хранить чарты?» — «OCI registry».' },
              ],
            },
          ],
        },
        {
          id: 'k8-l23',
          title: 'Kustomize и сравнение с Helm',
          minutes: 30,
          steps: [
            {
              id: 'k8-l23-s1',
              title: 'Kustomize: overlays',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Kustomize — альтернативный подход: не шаблоны, а наслоение (overlays). Есть base (общие манифесты) и overlays (для dev/staging/prod — только отличия). Встроен в kubectl с 1.14, не требует установки.' },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура',
                  code: `app/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   └── service.yaml
└── overlays/
    ├── dev/
    │   ├── kustomization.yaml
    │   └── replica-patch.yaml
    ├── staging/
    │   └── kustomization.yaml
    └── prod/
        ├── kustomization.yaml
        └── replica-patch.yaml`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'base/kustomization.yaml и overlays/prod/kustomization.yaml',
                  code: `# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
commonLabels:
  app: myapp
---
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: production
resources:
  - ../../base
patches:
  - path: replica-patch.yaml
images:
  - name: myapp
    newTag: "1.4.2"`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'overlays/prod/replica-patch.yaml',
                  code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 10`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Применение',
                  code: `# Превью (что получится)
kubectl kustomize overlays/prod

# Применить
kubectl apply -k overlays/prod

# Удалить
kubectl delete -k overlays/prod`,
                },
              ],
            },
            {
              id: 'k8-l23-s2',
              title: 'Helm vs Kustomize',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Критерий', 'Helm', 'Kustomize'],
                  rows: [
                    ['Подход', 'Шаблоны (templating)', 'Наслоение (overlays)'],
                    ['Параметризация', 'Мощная: условия, циклы, функции', 'Ограниченная: patch, images, namespace'],
                    ['Публикация', 'Chart-репозиторий, versioning', 'Только Git'],
                    ['Rollback', 'helm rollback — из истории', 'Нет (через git revert)'],
                    ['Установка', 'helm (внешний бинарник)', 'Встроен в kubectl (-k)'],
                    ['Порог входа', 'Выше (нужно знать шаблоны)', 'Ниже (обычные YAML)'],
                    ['Когда', 'Публичные charts, сложная параметризация', 'Свои приложения, GitOps'],
                  ],
                },
                { type: 'note', text: 'В реальных командах часто Helm для сторонних приложений (bitnami/postgresql, nginx-ingress) и Kustomize для своих — манифесты читаемые, не надо учить шаблоны. ArgoCD и Flux поддерживают оба. Если сомневаетесь — Kustomize проще для собственного кода.' },
              ],
            },
            {
              id: 'k8-l23-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что лучше выбрать для установки стороннего chart (например, bitnami/postgresql)?',
                options: [
                  { id: 'a', text: 'Kustomize — проще' },
                  { id: 'b', text: 'Helm — chart уже готов, публикуется в репозитории' },
                  { id: 'c', text: 'kubectl apply — вручную' },
                  { id: 'd', text: 'Ни то, ни другое — только оператор' },
                ],
                correct: ['b'],
                explanation:
                  'Для сторонних приложений Helm — стандарт: chart уже написан, поддерживается, публикуется в репозитории. Kustomize хорош для своих манифестов. Операторы — тоже вариант, но это отдельный уровень (для БД, Kafka часто используют операторы).',
              },
            },
            {
              id: 'k8-l23-s4',
              title: 'kustomize edit: как создавать overlays',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Kustomize можно использовать без ручного написания kustomization.yaml: команды `kustomize edit set image`, `kustomize edit set replicas`, `kustomize edit add resource` — изменяют файл программно. Удобно в CI: `kustomize edit set image myapp=ghcr.io/myorg/myapp:$SHA`.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'kustomize edit',
                  code: `cd overlays/prod

# Установить новый тег образа (для CI)
kustomize edit set image myapp=ghcr.io/myorg/myapp:1.4.2

# Установить replicas
kustomize edit set replicas myapp --replicas=10

# Установить namespace
kustomize edit set namespace production

# Добавить ресурс
kustomize edit add resource ../base

# Всё это меняет kustomization.yaml — можно коммитить в Git`,
                },
                {
                  type: 'list',
                  items: [
                    'kustomize edit — CLI для изменения kustomization.yaml',
                    'set image — «заменить тег образа» (для CI)',
                    'set replicas — «изменить число реплик»',
                    'В ArgoCD Image Updater — то же через Kustomize',
                    'Flux Image Automation тоже умеет править Kustomize',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle: «как автоматизировать обновление образа в Kustomize?» — «kustomize edit set image ... && git commit && git push» (в GitOps-репо). Или ArgoCD Image Updater / Flux Image Automation — автоматически. Helm для этого использует --set image.tag.' },
              ],
            },
            {
              id: 'k8-l23-s5',
              title: 'Проверь себя: Kustomize',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте элемент Kustomize и его роль',
                pairs: [
                  { left: 'base/', right: 'Общие манифесты' },
                  { left: 'overlays/<env>/', right: 'Отличия для окружения' },
                  { left: 'patches:', right: 'Точечные изменения в base' },
                  { left: 'kustomize edit set image', right: 'Заменить тег образа (для CI)' },
                ],
                explanation:
                  'base — общее. overlays — отличия. patches — точечные изменения. kustomize edit set image — автоматизация в CI. На собеседовании middle: «чем Kustomize отличается от Helm?» — «наслоение vs шаблоны; Kustomize проще, Helm мощнее».',
              },
            },
          ],
        },
      ],
    },
    {
  id: 'k8-a-m5',
  title: 'Практикум',
  lessons: [
    {
      id: 'k8-l30',
      title: 'Практика: сеть, хранилища, RBAC, Helm',
      minutes: 35,
      steps: [
        {
          id: 'k8-l30-s1',
          title: 'Service types',
          type: 'quiz',
          quiz: {
            kind: 'matching',
            question: 'Сопоставьте тип Service и его назначение',
            pairs: [
              { left: 'ClusterIP', right: 'Только внутри кластера' },
              { left: 'NodePort', right: 'Порт на каждом узле (30000–32767)' },
              { left: 'LoadBalancer', right: 'Публичный IP через облако' },
              { left: 'Headless (clusterIP: None)', right: 'DNS-запись на каждый под (для StatefulSet)' },
            ],
            explanation: 'ClusterIP — дефолт для межсервисного общения. NodePort — быстрый доступ без облака. LoadBalancer — один публичный IP на сервис (дорого). Headless — не балансирует, а даёт DNS на каждый под.',
          },
        },
        {
          id: 'k8-l30-s2',
          title: 'FQDN сервиса',
          type: 'quiz',
          quiz: {
            kind: 'fill',
            question: 'Какое полное DNS-имя (FQDN) у сервиса `backend` в namespace `production`?',
            accepted: [
              'backend.production.svc.cluster.local',
              'backend.production.svc.cluster.local.',
            ],
            placeholder: 'полное имя',
            hint: 'формат: <service>.<namespace>.svc.cluster.local',
            explanation: 'backend.production.svc.cluster.local. Внутри того же namespace достаточно backend (или backend.production). FQDN нужен при обращении из другого namespace.',
          },
        },
        {
          id: 'k8-l30-s3',
          title: 'Ingress vs LoadBalancer',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Чем Ingress отличается от LoadBalancer Service?',
            options: [
              { id: 'a', text: 'Это одно и то же' },
              { id: 'b', text: 'Ingress — единая точка входа с маршрутизацией по host/path; LoadBalancer — отдельный публичный IP на каждый сервис' },
              { id: 'c', text: 'Ingress работает только с HTTPS' },
              { id: 'd', text: 'LoadBalancer быстрее' },
            ],
            correct: ['b'],
            explanation: 'LoadBalancer — по публичному IP на каждый сервис (дорого). Ingress — один LB с правилами: example.com/api → backend, example.com/ → frontend. Внутри кластера — ClusterIP.',
          },
        },
        {
          id: 'k8-l30-s4',
          title: 'NetworkPolicy',
          type: 'quiz',
          quiz: {
            kind: 'multiple',
            question: 'Что нужно для работы NetworkPolicy в кластере?',
            options: [
              { id: 'a', text: 'CNI-плагин с поддержкой NetworkPolicy (Calico, Cilium, Antrea)' },
              { id: 'b', text: 'Ingress Controller' },
              { id: 'c', text: 'Правила применены через kubectl apply' },
              { id: 'd', text: 'При default-deny egress — разрешить DNS (UDP 53) в egress' },
            ],
            correct: ['a', 'c', 'd'],
            explanation: 'NetworkPolicy работает только с CNI, который её поддерживает. Flannel, например, не поддерживает. Плюс при default-deny egress не забудьте разрешить DNS.',
          },
        },
        {
          id: 'k8-l30-s5',
          title: 'PV vs PVC',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Чем PV отличается от PVC?',
            options: [
              { id: 'a', text: 'PV — для БД, PVC — для статики' },
              { id: 'b', text: 'PV — «диск» в кластере; PVC — заявка от пода на диск' },
              { id: 'c', text: 'Это синонимы' },
              { id: 'd', text: 'PVC работает только в облаке' },
            ],
            correct: ['b'],
            explanation: 'PV — ресурс кластера, создаётся админом (или автоматически по StorageClass). PVC — запрос от пода («мне нужен диск 20Gi»). Kubernetes находит подходящий PV и связывает их.',
          },
        },
        {
          id: 'k8-l30-s6',
          title: 'Удаление StatefulSet',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Что произойдёт с PVC при удалении StatefulSet с volumeClaimTemplates?',
            options: [
              { id: 'a', text: 'Удалятся вместе со StatefulSet' },
              { id: 'b', text: 'Останутся, данные сохранятся, удалять вручную' },
              { id: 'c', text: 'StatefulSet нельзя удалить, пока есть PVC' },
              { id: 'd', text: 'PVC удалятся только через kubectl delete pvc --all' },
            ],
            correct: ['b'],
            explanation: 'Защита от случайной потери данных: StatefulSet удалили — PVC остались. Удалять вручную: kubectl delete pvc data-postgres-0, data-postgres-1 и т.д.',
          },
        },
        {
          id: 'k8-l30-s7',
          title: 'Headless Service',
          type: 'quiz',
          quiz: {
            kind: 'cloze',
            question: 'Заполните манифест Headless Service (одно поле, чтобы Service не балансировал трафик)',
            text: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  ____: None\n  selector:\n    app: postgres',
            blanks: [
              { accepted: ['clusterIP'], hint: 'IP-адрес, но None = «без IP»' },
            ],
            explanation: 'clusterIP: None отключает балансировку — Service начинает возвращать DNS-записи на каждый под: postgres-0.postgres-headless, postgres-1.postgres-headless. Обязательно для StatefulSet.',
          },
        },
        {
          id: 'k8-l30-s8',
          title: 'readOnlyRootFilesystem',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Зачем в securityContext ставят readOnlyRootFilesystem: true?',
            options: [
              { id: 'a', text: 'Ускоряет чтение файлов' },
              { id: 'b', text: 'Запрещает приложению изменять файлы в контейнере — защита от подмены' },
              { id: 'c', text: 'Уменьшает размер образа' },
              { id: 'd', text: 'Это требование Kubernetes' },
            ],
            correct: ['b'],
            explanation: 'Корневая ФС только на чтение — злоумышленник не сможет подменить бинарник, дописать скрипт в PATH, установить бэкдор. Для временных файлов — отдельный emptyDir на /tmp.',
          },
        },
        {
          id: 'k8-l30-s9',
          title: 'ServiceAccount для пода',
          type: 'quiz',
          quiz: {
            kind: 'single',
            question: 'Какой kind использовать в subject, чтобы дать права поду (а не человеку)?',
            options: [
              { id: 'a', text: 'User' },
              { id: 'b', text: 'Group' },
              { id: 'c', text: 'ServiceAccount' },
              { id: 'd', text: 'Namespace' },
            ],
            correct: ['c'],
            explanation: 'Поды аутентифицируются как ServiceAccount. Чтобы под мог читать узлы, нужно дать права ServiceAccount через ClusterRoleBinding с kind: ServiceAccount.',
          },
        },
        {
          id: 'k8-l30-s10',
          title: 'Синтаксис Helm',
          type: 'quiz',
          quiz: {
            kind: 'fill',
            question: 'Как в шаблоне Helm обратиться к параметру `replicaCount` из values.yaml?',
            accepted: ['{{ .Values.replicaCount }}', '{{.Values.replicaCount}}', '.Values.replicaCount'],
            placeholder: '{{ ... }}',
            hint: 'Точка, Values, точка, имя',
            explanation: '{{ .Values.replicaCount }} — стандартный доступ. .Values — корневой объект с values.yaml. .Release.Name — имя релиза, .Chart.Name — имя чарта.',
          },
        },
      ],
    },
  ],
},
  ],
};