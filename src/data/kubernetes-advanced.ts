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
  icon: 'helm',
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
          minutes: 25,
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
                  code: '# ClusterIP (по умолчанию)\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend\nspec:\n  type: ClusterIP\n  selector:\n    app: backend\n  ports:\n    - port: 80\n      targetPort: 8000\n\n---\n# NodePort\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-np\nspec:\n  type: NodePort\n  selector:\n    app: backend\n  ports:\n    - port: 80\n      targetPort: 8000\n      nodePort: 30080    # опционально; иначе выделится случайный\n\n---\n# LoadBalancer (в облаке — выдаст внешний IP)\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-lb\nspec:\n  type: LoadBalancer\n  selector:\n    app: backend\n  ports:\n    - port: 80\n      targetPort: 8000\n\n---\n# ExternalName (без selector!)\napiVersion: v1\nkind: Service\nmetadata:\n  name: external-db\nspec:\n  type: ExternalName\n  externalName: db.prod.example.com',
                },
                {
                  type: 'note',
                  text: 'LoadBalancer в облаке (EKS, GKE, AKS) создаёт реальный LB с публичным IP — это дорого, если сервисов много. Для множества сервисов — один Ingress + внутри ClusterIP. Это стандартная практика.',
                },
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
                  code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  clusterIP: None         # ← headless\n  selector:\n    app: postgres\n  ports:\n    - port: 5432\n\n# DNS:\n#   postgres-0.postgres-headless → IP пода postgres-0\n#   postgres-1.postgres-headless → IP пода postgres-1\n#   postgres-headless → все IP (round-robin)',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'sessionAffinity: клиент ходит на тот же под',
                  code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: sticky-svc\nspec:\n  selector:\n    app: myapp\n  sessionAffinity: ClientIP\n  sessionAffinityConfig:\n    clientIP:\n      timeoutSeconds: 10800    # 3 часа',
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
          ],
        },
        {
          id: 'k8-l13',
          title: 'Ingress: единая точка входа',
          minutes: 30,
          steps: [
            {
              id: 'k8-l13-s1',
              title: 'Зачем Ingress',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'LoadBalancer на каждый сервис — дорого (10 сервисов = 10 публичных IP = 10 облачных LB). Ingress — единая точка входа: один LB + правила маршрутизации по host и path. Внутри кластера сервисы остаются ClusterIP.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как это работает',
                  code: 'Интернет\n    ↓\n[ Облачный LoadBalancer — 1 публичный IP ]\n    ↓\n[ Ingress Controller — nginx, traefik, ALB ]\n    ↓ (маршрутизация по правилам)\n├── api.example.com     → Service backend (ClusterIP)\n├── example.com/app     → Service frontend (ClusterIP)\n└── example.com/admin   → Service admin (ClusterIP)',
                },
                {
                  type: 'note',
                  text: 'Ingress — это не сам контроллер, а ресурс (правила). Нужен Ingress Controller: nginx-ingress, Traefik, ALB Ingress, GCE Ingress. В managed-кластерах (EKS, GKE, AKS) — часто включён по умолчанию, но не всегда. Уточните у облака.',
                },
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
                  code: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: main-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - example.com\n      secretName: example-tls    # Secret с tls.crt и tls.key\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: frontend\n                port:\n                  number: 80\n          - path: /api\n            pathType: Prefix\n            backend:\n              service:\n                name: backend\n                port:\n                  number: 8000\n    - host: admin.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: admin\n                port:\n                  number: 80',
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
                  code: '# Установить cert-manager\nkubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.0/cert-manager.yaml\n\n# В Ingress — аннотация:\n#   cert-manager.io/cluster-issuer: letsencrypt-prod\n# cert-manager сам создаст Secret с сертификатом',
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
          ],
        },
        {
          id: 'k8-l14',
          title: 'NetworkPolicy: изоляция трафика',
          minutes: 25,
          steps: [
            {
              id: 'k8-l14-s1',
              title: 'Зачем NetworkPolicy',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'По умолчанию в Kubernetes все поды видят друг друга: любой под может обратиться к любому. Это удобно для разработки, но опасно в проде: скомпрометированный фронтенд получит доступ к БД, Kafka, внутренним API. NetworkPolicy — правила фаервола на уровне подов.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Default deny all — блокируем всё',
                  code: 'apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: default-deny-all\n  namespace: production\nspec:\n  podSelector: {}         # все поды в namespace\n  policyTypes:\n    - Ingress\n    - Egress',
                },
                {
                  type: 'note',
                  text: 'default-deny-all — первое, что настраивают в проде. Потом открывают доступ по одному: «frontend → backend на порт 8000», «backend → БД на 5432». Иначе любой под может сканировать сеть кластера.',
                },
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
                  code: 'apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: backend-allow-frontend\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  policyTypes:\n    - Ingress\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: frontend\n      ports:\n        - protocol: TCP\n          port: 8000',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Backend сам ходит только в БД',
                  code: 'apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: backend-egress-db\n  namespace: production\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  policyTypes:\n    - Egress\n  egress:\n    - to:\n        - podSelector:\n            matchLabels:\n              app: postgres\n      ports:\n        - protocol: TCP\n          port: 5432\n    - to:\n        - namespaceSelector:\n            matchLabels:\n              name: kube-system   # DNS\n      ports:\n        - protocol: UDP\n          port: 53',
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
          ],
        },
        {
          id: 'k8-l15',
          title: 'DNS и Service Discovery',
          minutes: 20,
          steps: [
            {
              id: 'k8-l15-s1',
              title: 'Как поды находят друг друга',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Kubernetes запускает CoreDNS — внутренний DNS-сервер. Каждый Service получает DNS-имя. Поды обращаются друг к другу по этим именам, не по IP: бэкенд ищет `postgres`, а не `10.96.45.12`. Это делает инфраструктуру переносимой: IP меняются при пересоздании, DNS-имена — нет.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Форматы DNS',
                  code: 'Сервис в том же namespace:\n  backend                      → ClusterIP сервиса backend\n  backend.default              → в namespace default\n\nПолный FQDN:\n  backend.default.svc.cluster.local\n\nПорт (если Service имеет name: http):\n  http://backend:8000\n  http://backend.default.svc.cluster.local:8000\n\nHeadless (на каждый под):\n  postgres-0.postgres-headless\n  postgres-1.postgres-headless',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Диагностика DNS',
                  code: '# Изнутри пода\nkubectl exec -it myapp -- nslookup backend\nkubectl exec -it myapp -- nslookup backend.default.svc.cluster.local\nkubectl exec -it myapp -- getent hosts backend\n\n# Если nslookup недоступен (distroless), запустить временный под:\nkubectl run -it --rm --image=alpine -- sh\napk add bind-tools\nnslookup backend',
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
          minutes: 25,
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
                  code: 'volumes:\n  # emptyDir — временное хранилище, умирает с подом\n  - name: cache\n    emptyDir: {}\n\n  # hostPath — каталог на узле (для DaemonSet)\n  - name: proc\n    hostPath:\n      path: /proc\n\n  # configMap — конфиг как файлы\n  - name: config\n    configMap:\n      name: app-config\n\n  # secret — секреты как файлы\n  - name: tls\n    secret:\n      secretName: my-tls\n\n  # persistentVolumeClaim — постоянное хранилище\n  - name: data\n    persistentVolumeClaim:\n      claimName: my-pvc',
                },
                {
                  type: 'p',
                  text: 'emptyDir, configMap, secret — эфемерные: умирают вместе с подом. Для БД, загрузок, кэша между перезапусками нужны PersistentVolume (PV) — постоянные диски, которые переживают под.',
                },
                {
                  type: 'note',
                  text: 'PV — кластерный ресурс, как узел или namespace. Он живёт независимо от подов. PVC (PersistentVolumeClaim) — «заявка» от пода на PV. Под создаёт PVC, Kubernetes находит подходящий PV и связывает их (binding).',
                },
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
                  caption: 'PV (админ создаёт вручную)',
                  code: 'apiVersion: v1\nkind: PersistentVolume\nmetadata:\n  name: my-pv\nspec:\n  capacity:\n    storage: 10Gi\n  accessModes:\n    - ReadWriteOnce\n  persistentVolumeReclaimPolicy: Retain\n  storageClassName: manual     # должен совпадать с PVC\n  hostPath:                    # для локального теста; в облаке — EBS/GCE PD\n    path: /mnt/data\n    type: DirectoryOrCreate',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PVC (пользователь создаёт)',
                  code: 'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: my-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 5Gi            # ≤ 10Gi в PV\n  storageClassName: manual    # должен совпадать с PV',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Под использует PVC',
                  code: 'spec:\n  containers:\n    - name: app\n      image: myapp:1.4.2\n      volumeMounts:\n        - name: data\n          mountPath: /var/lib/data\n  volumes:\n    - name: data\n      persistentVolumeClaim:\n        claimName: my-pvc',
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
                {
                  type: 'note',
                  text: 'RWO — самый частый случай (диски в облаке). Если БД в StatefulSet на 3 ноды, каждая нода получает свой RWO-диск. RWX нужен для shared-хранилищ (например, для ML-данных или статики на нескольких подах).',
                },
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
          ],
        },
        {
          id: 'k8-l17',
          title: 'StorageClass и динамическое выделение',
          minutes: 25,
          steps: [
            {
              id: 'k8-l17-s1',
              title: 'Динамическое выделение',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Создавать PV вручную неудобно: заканчиваются, не подходят по размеру, нужно заботиться о них. StorageClass — «шаблон», по которому PV создаётся автоматически при появлении PVC. Кластерный админ настраивает 2–3 класса, пользователи просто заказывают PVC.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'StorageClass (обычно создаёт админ/облако)',
                  code: 'apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: fast-ssd\nprovisioner: ebs.csi.aws.com     # AWS EBS; для GCP — pd.csi.storage.gke.io\nparameters:\n  type: gp3\n  encrypted: "true"\nreclaimPolicy: Delete            # Delete | Retain\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true       # можно расширять',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PVC — PV создастся автоматически',
                  code: 'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: postgres-data\nspec:\n  accessModes: [ReadWriteOnce]\n  storageClassName: fast-ssd    # ← здесь\n  resources:\n    requests:\n      storage: 20Gi',
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
                {
                  type: 'note',
                  text: 'Обычно в кластере есть default StorageClass — если в PVC не указать storageClassName, используется он. Проверьте: kubectl get storageclass — у одного из них будет (default).',
                },
              ],
            },
            {
              id: 'k8-l17-s2',
              title: 'StatefulSet + PVC template',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'В StatefulSet volumeClaimTemplates автоматически создаёт PVC на каждый под: data-postgres-0, data-postgres-1, data-postgres-2. При пересоздании пода PVC переиспользуется — данные сохраняются.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'PVC на каждый под',
                  code: 'apiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres-headless\n  replicas: 3\n  selector:\n    matchLabels: { app: postgres }\n  template:\n    metadata:\n      labels: { app: postgres }\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:\n    - metadata:\n        name: data\n      spec:\n        accessModes: [ReadWriteOnce]\n        storageClassName: fast-ssd\n        resources:\n          requests:\n            storage: 20Gi\n\n# После применения:\n#   data-postgres-0 — PVC, привязанный к postgres-0\n#   data-postgres-1 — PVC, привязанный к postgres-1\n#   data-postgres-2 — PVC, привязанный к postgres-2',
                },
                {
                  type: 'note',
                  text: 'При удалении StatefulSet PVC НЕ удаляются автоматически — это защита от потери данных. Приходится удалять вручную: kubectl delete pvc data-postgres-0. Считайте это фичей, а не багом.',
                },
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
          ],
        },
        {
          id: 'k8-l18',
          title: 'Практика: PostgreSQL в Kubernetes',
          minutes: 30,
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
                  code: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: postgres-secret\ntype: Opaque\nstringData:\n  POSTGRES_PASSWORD: "super-secret"\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  clusterIP: None\n  selector:\n    app: postgres\n  ports:\n    - port: 5432\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres-headless\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          ports:\n            - containerPort: 5432\n          env:\n            - name: POSTGRES_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: postgres-secret\n                  key: POSTGRES_PASSWORD\n            - name: PGDATA\n              value: /var/lib/postgresql/data/pgdata   # подкаталог, иначе initdb ругается\n          resources:\n            requests: { cpu: 200m, memory: 256Mi }\n            limits:   { cpu: 1,    memory: 1Gi }\n          readinessProbe:\n            exec:\n              command: ["pg_isready", "-U", "postgres"]\n            initialDelaySeconds: 5\n            periodSeconds: 10\n          livenessProbe:\n            exec:\n              command: ["pg_isready", "-U", "postgres"]\n            initialDelaySeconds: 30\n            periodSeconds: 15\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:\n    - metadata:\n        name: data\n      spec:\n        accessModes: [ReadWriteOnce]\n        storageClassName: fast-ssd\n        resources:\n          requests:\n            storage: 20Gi',
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
                {
                  type: 'note',
                  text: 'Postgres в K8s — это не «задеплоил и забыл». С 1 репликой всё просто. С репликацией — нужен Patroni, Zalando postgres-operator или CloudNativePG. В продакшене чаще берут managed (RDS, Cloud SQL), а не разворачивают в кластере. Но для понимания StatefulSet и PVC — это классический пример.',
                },
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
                  code: 'apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: postgres-backup\nspec:\n  schedule: "0 2 * * *"\n  concurrencyPolicy: Forbid\n  successfulJobsHistoryLimit: 3\n  failedJobsHistoryLimit: 1\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n            - name: backup\n              image: postgres:16\n              command:\n                - /bin/sh\n                - -c\n                - |\n                  pg_dump -h postgres-0.postgres-headless \\\n                          -U postgres appdb | \\\n                  gzip > /backup/db-$(date +%F).sql.gz\n              env:\n                - name: PGPASSWORD\n                  valueFrom:\n                    secretKeyRef:\n                      name: postgres-secret\n                      key: POSTGRES_PASSWORD\n              volumeMounts:\n                - name: backup\n                  mountPath: /backup\n          volumes:\n            - name: backup\n              persistentVolumeClaim:\n                claimName: backup-pvc',
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
                {
                  type: 'note',
                  text: 'PVC с бэкапами — это НЕ бэкап в смысле disaster recovery. Если узел умрёт или кластер сломается — PVC тоже может пропасть. Настоящий бэкап — в Object Storage (S3, GCS), откуда его можно восстановить на любом кластере. Для продакшена — pgBackRest, Barman, Velero.',
                },
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
          minutes: 20,
          steps: [
            {
              id: 'k8-l19-s1',
              title: 'Зачем ServiceAccount',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда под хочет обратиться к Kubernetes API (например, посмотреть другие поды, обновить ConfigMap), ему нужна идентичность. ServiceAccount — это «пользователь» для пода. Каждый под получает токен ServiceAccount (mount в /var/run/secrets/kubernetes.io/serviceaccount/token).',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Явный ServiceAccount',
                  code: 'apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: myapp-sa\n  namespace: production\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  template:\n    spec:\n      serviceAccountName: myapp-sa    # ← указать\n      containers:\n        - name: myapp\n          image: myapp:1.4.2',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Отключить монтирование токена (если API не нужен)',
                  code: 'spec:\n  template:\n    spec:\n      automountServiceAccountToken: false    # ← не монтировать токен\n      containers:\n        - name: myapp\n          image: myapp:1.4.2',
                },
                {
                  type: 'note',
                  text: 'По умолчанию в каждый под монтируется токен default ServiceAccount. Если приложению НЕ нужен доступ к K8s API (99% случаев) — отключите автомонтирование: automountServiceAccountToken: false. Это уменьшает поверхность атаки.',
                },
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
          ],
        },
        {
          id: 'k8-l20',
          title: 'RBAC: кто что может',
          minutes: 30,
          steps: [
            {
              id: 'k8-l20-s1',
              title: 'Role, ClusterRole, Bindings',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'RBAC (Role-Based Access Control) — правила «кто что может делать». Четыре объекта: Role, ClusterRole, RoleBinding, ClusterRoleBinding. Отличие Role и ClusterRole — область действия: Role работает в одном namespace, ClusterRole — во всех (или для cluster-scoped ресурсов: узлы, PV).',
                },
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
                  code: '# Role: можно читать поды и логи в namespace production\napiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata:\n  namespace: production\n  name: pod-reader\nrules:\n  - apiGroups: [""]\n    resources: ["pods", "pods/log"]\n    verbs: ["get", "list", "watch"]\n---\n# RoleBinding: связываем с пользователем anna\napiVersion: rbac.authorization.k8s.io/v1\nkind: RoleBinding\nmetadata:\n  name: anna-pod-reader\n  namespace: production\nsubjects:\n  - kind: User\n    name: anna                    # имя в сертификате/OIDC\n    apiGroup: rbac.authorization.k8s.io\nroleRef:\n  kind: Role\n  name: pod-reader\n  apiGroup: rbac.authorization.k8s.io',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'ClusterRole и ClusterRoleBinding',
                  code: '# ClusterRole: можно смотреть узлы (cluster-scoped)\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: node-viewer\nrules:\n  - apiGroups: [""]\n    resources: ["nodes"]\n    verbs: ["get", "list", "watch"]\n---\n# ClusterRoleBinding: даём это group ops-team\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: ops-node-viewer\nsubjects:\n  - kind: Group\n    name: ops-team\n    apiGroup: rbac.authorization.k8s.io\nroleRef:\n  kind: ClusterRole\n  name: node-viewer\n  apiGroup: rbac.authorization.k8s.io',
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
                  code: '# Могу ли я (текущий контекст) делать X?\nkubectl auth can-i create pods\nkubectl auth can-i delete deployments --namespace production\n\n# Могу ли я от имени другого?\nkubectl auth can-i list pods --as=system:serviceaccount:production:myapp-sa\nkubectl auth can-i get secrets --as=anna --namespace production\n\n# Что вообще могу?\nkubectl auth can-i --list',
                },
                {
                  type: 'note',
                  text: 'Принцип наименьших привилегий: давайте ровно те права, которые нужны, и не больше. Не давайте cluster-admin, если хватит pod-reader в одном namespace. Это защита от «случайно удалил прод» и от компрометации.',
                },
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
          ],
        },
        {
          id: 'k8-l21',
          title: 'SecurityContext и Pod Security Standards',
          minutes: 30,
          steps: [
            {
              id: 'k8-l21-s1',
              title: 'securityContext в поде',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'По умолчанию под запускается с правами root и без ограничений. Это опасно: при компрометации контейнера злоумышленник получает root на хосте. securityContext позволяет ограничить процесс: non-root, read-only ФС, capabilities, seccomp.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Безопасный pod',
                  code: 'spec:\n  securityContext:              # на уровне пода\n    runAsNonRoot: true\n    runAsUser: 1000\n    runAsGroup: 1000\n    fsGroup: 1000\n    seccompProfile:\n      type: RuntimeDefault\n  containers:\n    - name: myapp\n      image: myapp:1.4.2\n      securityContext:          # на уровне контейнера\n        allowPrivilegeEscalation: false\n        readOnlyRootFilesystem: true\n        capabilities:\n          drop:\n            - ALL\n      volumeMounts:\n        - name: tmp\n          mountPath: /tmp       # writable tmp для readOnlyRootFilesystem\n  volumes:\n    - name: tmp\n      emptyDir: {}',
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
                {
                  type: 'p',
                  text: 'Проверять securityContext в каждом манифесте вручную — утомительно. Pod Security Standards (PSS) — три уровня безопасности, которые применяются к namespace целиком: Privileged, Baseline, Restricted.',
                },
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
                  code: 'apiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  labels:\n    pod-security.kubernetes.io/enforce: restricted    # блокирует несоответствующие\n    pod-security.kubernetes.io/audit: restricted      # логирует\n    pod-security.kubernetes.io/warn: restricted       # предупреждает',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Что проверяет Restricted',
                  code: '✓ runAsNonRoot: true\n✓ allowPrivilegeEscalation: false\n✓ capabilities.drop: [ALL]\n✓ seccompProfile: RuntimeDefault или Localhost\n✓ readOnlyRootFilesystem: true (рекомендуется)\n✗ hostNetwork, hostPID, hostIPC\n✗ privileged: true\n✗ hostPath volumes',
                },
                {
                  type: 'note',
                  text: 'PSS — это «policy enforcement» на уровне admission controller. Если namespace помечен enforce: restricted, а под не соответствует — под не запустится с ошибкой. Это защита от «забыл securityContext». На собеседовании по безопасности K8s это спрашивают.',
                },
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
          minutes: 25,
          steps: [
            {
              id: 'k8-l26-s1',
              title: 'Проблема без Helm',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: `Приложение в K8s — это не один YAML, а 5–10 (Deployment, Service, Ingress, ConfigMap, Secret, HPA). Для 3 окружений (dev, staging, prod) это 30 файлов с почти одинаковым содержимым. Helm упаковывает всё в **chart** с параметризацией через \`values.yaml\`.`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура чарта',
                  code: 'mychart/\n├── Chart.yaml          # имя, версия, зависимости\n├── values.yaml         # значения по умолчанию\n├── templates/\n│   ├── deployment.yaml\n│   ├── service.yaml\n│   ├── ingress.yaml\n│   └── _helpers.tpl    # вспомогательные шаблоны\n└── charts/             # subcharts (зависимости)',
                },
                {
                  type: 'note',
                  text: 'Helm — де-факто стандарт для установки сторонних приложений (nginx-ingress, cert-manager, prometheus). Публичные чарты лежат в Artifact Hub. На собеседовании DevOps: "как ставите ingress-nginx?" — ответ "helm install".',
                },
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
                explanation: 'Chart.yaml — "паспорт" чарта: name, version, appVersion, dependencies. Без него Helm не поймёт, что это чарт. values.yaml — параметры, templates/ — манифесты.',
              },
            },
          ],
        },
        {
          id: 'k8-l27',
          title: 'Шаблонизация в Helm',
          minutes: 30,
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
                  code: 'replicaCount: 3\n\nimage:\n  repository: ghcr.io/myorg/myapp\n  tag: "1.4.2"\n\nservice:\n  port: 80',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'templates/deployment.yaml',
                  code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}-app\nspec:\n  replicas: {{ .Values.replicaCount }}\n  template:\n    spec:\n      containers:\n        - name: app\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n          ports:\n            - containerPort: {{ .Values.service.port }}',
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
                  caption: 'Условия (if)',
                  code: '{{- if .Values.ingress.enabled }}\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: {{ .Release.Name }}-ingress\nspec:\n  rules:\n    - host: {{ .Values.ingress.host }}\n{{- end }}',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Циклы (range)',
                  code: 'env:\n{{- range $key, $value := .Values.env }}\n  - name: {{ $key }}\n    value: {{ $value | quote }}\n{{- end }}',
                },
                {
                  type: 'note',
                  text: '`| quote` — обернуть значение в кавычки. Важно для строк, которые могут выглядеть как числа или boolean (например, `"true"` без кавычек станет boolean true и сломает env).',
                },
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
          ],
        },
        {
          id: 'k8-l28',
          title: 'Управление релизами (install, upgrade, rollback)',
          minutes: 25,
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
                  code: '# Установка из локальной папки\nhelm install myapp ./mychart -n production --create-namespace\n\n# С override values\nhelm install myapp ./mychart -n production \\\n  --set image.tag=1.4.3 \\\n  -f prod-values.yaml\n\n# Обновление\nhelm upgrade myapp ./mychart -n production -f prod-values.yaml\n\n# Install or upgrade (идемпотентно — для CI)\nhelm upgrade --install myapp ./mychart -n production\n\n# История и откат\nhelm history myapp -n production\nhelm rollback myapp 1 -n production\n\n# Удаление\nhelm uninstall myapp -n production',
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
                {
                  type: 'note',
                  text: 'Helm хранит историю ревизий (по умолчанию 10) в Secret-ах в namespace. `helm rollback` — это не "откат состояния", а деплой старой ревизии. Kubernetes делает rolling update до предыдущей версии.',
                },
              ],
            },
            {
              id: 'k8-l28-s2',
              title: 'Репозитории и поиск',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Публичные чарты',
                  code: '# Добавить репозиторий\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx\n\n# Обновить индекс\nhelm repo update\n\n# Найти чарт\nhelm search repo nginx\nhelm search hub prometheus   # поиск по Artifact Hub\n\n# Посмотреть values по умолчанию\nhelm show values bitnami/postgresql\n\n# Установить сторонний чарт\nhelm install postgres bitnami/postgresql -n db \\\n  --set auth.password=secret',
                },
                {
                  type: 'note',
                  text: 'Artifact Hub (artifacthub.io) — центральный поисковик чартов. Для продакшена: ставьте популярные чарты (bitnami, ingress-nginx, cert-manager, prometheus-community). Свои — публикуйте в OCI-registry (ghcr.io, ECR).',
                },
              ],
            },
            {
              id: 'k8-l28-s3',
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
          ],
        },
        {
          id: 'k8-l23',
          title: 'Kustomize и сравнение с Helm',
          minutes: 25,
          steps: [
            {
              id: 'k8-l23-s1',
              title: 'Kustomize: overlays',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Kustomize — альтернативный подход: не шаблоны, а наслоение (overlays). Есть base (общие манифесты) и overlays (для dev/staging/prod — только отличия). Встроен в kubectl с 1.14, не требует установки.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура',
                  code: 'app/\n├── base/\n│   ├── kustomization.yaml\n│   ├── deployment.yaml\n│   └── service.yaml\n└── overlays/\n    ├── dev/\n    │   ├── kustomization.yaml\n    │   └── replica-patch.yaml\n    ├── staging/\n    │   └── kustomization.yaml\n    └── prod/\n        ├── kustomization.yaml\n        └── replica-patch.yaml',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'base/kustomization.yaml',
                  code: 'apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources:\n  - deployment.yaml\n  - service.yaml\ncommonLabels:\n  app: myapp',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'overlays/prod/kustomization.yaml',
                  code: 'apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nnamespace: production\nresources:\n  - ../../base\npatches:\n  - path: replica-patch.yaml\nimages:\n  - name: myapp\n    newTag: "1.4.2"',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'overlays/prod/replica-patch.yaml',
                  code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 10',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Применение',
                  code: '# Превью (что получится)\nkubectl kustomize overlays/prod\n\n# Применить\nkubectl apply -k overlays/prod\n\n# Удалить\nkubectl delete -k overlays/prod',
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
                {
                  type: 'note',
                  text: 'В реальных командах часто Helm для сторонних приложений (bitnami/postgresql, nginx-ingress) и Kustomize для своих — манифесты читаемые, не надо учить шаблоны. ArgoCD и Flux поддерживают оба. Если сомневаетесь — Kustomize проще для собственного кода.',
                },
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