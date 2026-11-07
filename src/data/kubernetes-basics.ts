import type { Course } from './types';

export const k8sBasicsCourse: Course = {
  slug: 'kubernetes-basics',
  title: 'Kubernetes: основы',
  subtitle: 'Поды, деплойменты, сервисы, конфигурация и первые шаги в оркестрации',
  description:
    'Kubernetes стал стандартом запуска контейнеров в продакшене. Курс объясняет ключевые абстракции на простых примерах: как описать желаемое состояние приложения, как Kubernetes сам восстанавливает упавшие поды, как отделить конфигурацию от кода, как работают probes и как выбрать правильный контроллер (Deployment, StatefulSet, DaemonSet, Job, CronJob). Практикум — комплексная практика.',
  level: 'Средний',
  tags: ['Kubernetes', 'DevOps', 'Оркестрация'],
  accent: '#7c5cff',
  icon: 'helm',
  outcomes: [
    'Объяснять устройство кластера: control plane и узлы',
    'Работать с подами, деплойментами и сервисами через kubectl',
    'Отделять конфигурацию от кода через ConfigMap и Secret',
    'Настраивать probes и ресурсы (requests/limits)',
    'Выбирать правильный контроллер: Deployment, StatefulSet, DaemonSet, Job, CronJob',
    'Отлаживать поды: Pending, CrashLoopBackOff, ImagePullBackOff',
  ],
  requirements: ['Понимание контейнеров и Docker', 'Базовый YAML', 'Умение работать в терминале'],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Архитектура и первые объекты (было k8-m1)
    // ─────────────────────────────────────────────
    {
      id: 'k8-b-m1',
      title: 'Архитектура и первые объекты',
      lessons: [
        {
          id: 'k8-l1',
          title: 'Как устроен кластер',
          minutes: 25,
          steps: [
            {
              id: 'k8-l1-s1',
              title: 'Control plane и узлы',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Кластер Kubernetes состоит из управляющего слоя (control plane) и рабочих узлов (nodes). Control plane — мозг: API-сервер принимает команды, etcd хранит состояние кластера, scheduler выбирает, на каком узле запустить под, а контроллеры непрерывно приводят фактическое состояние к желаемому.' },
                {
                  type: 'mermaid',
                  caption: 'Компоненты кластера Kubernetes',
                  code: `graph TD
                    subgraph CP["Control Plane"]
                      API[API Server]
                      ETCD[etcd]
                      Sched[Scheduler]
                      CM[Controller Manager]
                    end

                    subgraph Node1["Worker Node 1"]
                      K1[Kubelet]
                      P1[Pods]
                    end

                    subgraph Node2["Worker Node 2"]
                      K2[Kubelet]
                      P2[Pods]
                    end

                    API --> ETCD
                    API --> Sched
                    API --> CM
                    API --> K1
                    API --> K2
                    K1 --> P1
                    K2 --> P2`,
                },
                { type: 'h3', text: 'Главная идея: декларативность' },
                { type: 'p', text: 'Вы не говорите Kubernetes «запусти контейнер на сервере X». Вы описываете желаемое состояние: «должно быть 3 реплики приложения версии 1.4». Контроллеры сами следят, чтобы оно выполнялось: упал под — поднимут новый, умер узел — перенесут поды на живые.' },
                { type: 'note', text: 'Это называется reconciliation loop: наблюдаем → сравниваем с желаемым → исправляем расхождение. Поняв этот цикл, вы поняли Kubernetes.' },
              ],
            },
            {
              id: 'k8-l1-s2',
              title: 'Под — минимальная единица',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Под (pod) — наименьший объект, которым оперирует Kubernetes. Обычно это один контейнер, но может быть и несколько тесно связанных (например, приложение + sidecar-прокси). Контейнеры пода делят сеть и могут делить volume.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Работа с подами через kubectl',
                  code: `kubectl get pods                    # список подов
kubectl describe pod web-xxx        # подробности и события
kubectl logs web-xxx                # логи
kubectl exec -it web-xxx -- sh      # shell внутри пода
kubectl delete pod web-xxx          # удалить (деплоймент пересоздаст)`,
                },
                { type: 'p', text: 'Поды эфемерны: у каждого свой IP, при пересоздании IP меняется. Поэтому напрямую на поды никто не ссылается — для стабильного доступа есть сервисы.' },
              ],
            },
            {
              id: 'k8-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если удалить под, управляемый деплойментом?',
                options: [
                  { id: 'a', text: 'Приложение исчезнет навсегда' },
                  { id: 'b', text: 'Контроллер деплоймента заметит расхождение и создаст новый под' },
                  { id: 'c', text: 'Под восстановится сам собой с тем же IP' },
                  { id: 'd', text: 'Кластер потребует ручного вмешательства' },
                ],
                correct: ['b'],
                explanation:
                  'Это и есть reconciliation: желаемое число реплик — например 3, фактическое после удаления — 2, поэтому контроллер немедленно создаст недостающий под.',
              },
            },
            {
              id: 'k8-l1-s4',
              title: 'Компоненты control plane',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Четыре компонента control plane — что каждый делает и что будет, если он упадёт. Это классический вопрос на собеседовании DevOps.' },
                {
                  type: 'table',
                  caption: 'Control plane components',
                  head: ['Компонент', 'Что делает', 'Что если упадёт'],
                  rows: [
                    ['kube-apiserver', 'Принимает все команды (kubectl, контроллеры). REST API + auth', 'Кластер «замирает»: поды работают, но ничего не меняется'],
                    ['etcd', 'Хранит состояние кластера (key-value, Raft)', 'Кластер не может читать/писать состояние — критично'],
                    ['kube-scheduler', 'Выбирает узел для нового пода', 'Новые поды висят в Pending'],
                    ['kube-controller-manager', 'Reconciliation loop (Deployment, ReplicaSet, Node)', 'Не пересоздаются упавшие поды, не работают обновления'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'etcd — самое важное: бэкап etcd = бэкап всего кластера',
                    'apiserver — единственный, с кем общаются kubectl и kubelet',
                    'scheduler и controller-manager — «мозги»: решают и действуют',
                    'На managed-кластерах (EKS, GKE) control plane обслуживает облако',
                    'kubelet на узле — «агент», который запускает поды и следит за ними',
                  ],
                },
                { type: 'note', text: 'На собеседовании junior DevOps: «что произойдёт, если упадёт etcd?» — «кластер не сможет читать/писать состояние: kubectl не работает, новые поды не создаются; существующие поды работают, пока kubelet их не трогает». «Что делать?» — «восстановить из бэкапа etcd». Регулярный бэкап etcd — must-have в проде.' },
              ],
            },
            {
              id: 'k8-l1-s5',
              title: 'Проверь себя: control plane',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте компонент и его роль',
                pairs: [
                  { left: 'kube-apiserver', right: 'Принимает команды kubectl и контроллеров' },
                  { left: 'etcd', right: 'Хранит состояние кластера' },
                  { left: 'kube-scheduler', right: 'Выбирает узел для нового пода' },
                  { left: 'kube-controller-manager', right: 'Reconciliation loop (Deployment, Node)' },
                ],
                explanation:
                  'apiserver — «входная дверь». etcd — «база состояния». scheduler — «распределяет по узлам». controller-manager — «приводит к желаемому». kubelet на узле — «запускает поды». На собеседовании junior DevOps спросят про 3–4 из них.',
              },
            },
          ],
        },
        {
          id: 'k8-l2',
          title: 'Deployment: желаемое состояние приложения',
          minutes: 30,
          steps: [
            {
              id: 'k8-l2-s1',
              title: 'Манифест деплоймента',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'deployment.yaml',
                  code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: registry.example.com/web:1.4.0
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi`,
                },
                { type: 'p', text: 'Применяем манифест командой kubectl apply -f deployment.yaml. Kubernetes создаст 3 пода с меткой app: web. Selector связывает деплоймент с его подами по этим меткам.' },
                { type: 'h3', text: 'Requests и limits — обязательны' },
                { type: 'p', text: 'Requests — сколько ресурсов гарантированно зарезервировать поду (по ним scheduler выбирает узел). Limits — потолок: при превышении CPU контейнер душится (throttling), при превышении памяти — убивается (OOMKilled).' },
              ],
            },
            {
              id: 'k8-l2-s2',
              title: 'Обновления и откаты',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Смена образа на новую версию запускает rolling update: Kubernetes постепенно поднимает новые поды и гасит старые, не роняя приложение. Параметры maxSurge и maxUnavailable контролируют скорость и доступность во время выкатки.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Выкатка и откат',
                  code: `kubectl set image deployment/web web=registry.example.com/web:1.5.0
kubectl rollout status deployment/web
kubectl rollout history deployment/web
kubectl rollout undo deployment/web        # откат на прошлую версию`,
                },
                { type: 'note', text: 'Readiness probe говорит, готов ли под принимать трафик. Без неё запросы могут уйти в ещё не прогретый контейнер — классический источник ошибок при выкатке.' },
              ],
            },
            {
              id: 'k8-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что произойдёт при превышении лимитов ресурсов контейнером? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'Превышение CPU → троттлинг (замедление)' },
                  { id: 'b', text: 'Превышение CPU → немедленное убийство пода' },
                  { id: 'c', text: 'Превышение памяти → OOMKilled' },
                  { id: 'd', text: 'Превышение памяти → троттлинг' },
                ],
                correct: ['a', 'c'],
                explanation:
                  'CPU — сжимаемый ресурс: превысил — работаешь медленнее. Память несжимаема: выдать «меньше памяти» нельзя, поэтому ядро убивает процесс (OOMKilled).',
              },
            },
            {
              id: 'k8-l2-s4',
              title: 'Selector и labels: как Deployment находит свои поды',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Связь между Deployment и подами — только через labels (метки) и selector (селектор). Никаких «имён» или «ID». Это даёт гибкость (можно менять поды) и создаёт ловушки (два Deployment с одинаковым selector начнут «драться» за одни поды).' },
                {
                  type: 'mermaid',
                  caption: 'Selector связывает Deployment с подами по labels',
                  code: `graph LR
                    Dep["Deployment web<br/>selector: app=web"]
                    Pod1["Pod<br/>labels: app=web"]
                    Pod2["Pod<br/>labels: app=web"]
                    Pod3["Pod<br/>labels: app=web"]
                    Pod4["Pod<br/>labels: app=api"]
                    Dep -.->|"управляет"| Pod1
                    Dep -.->|"управляет"| Pod2
                    Dep -.->|"управляет"| Pod3
                    Dep -.->|"НЕ управляет"| Pod4`,
                },
                {
                  type: 'list',
                  items: [
                    'matchLabels — точное совпадение: app=web',
                    'matchExpressions — условия: In, NotIn, Exists',
                    'Selector неизменяем после создания Deployment (только пересоздать)',
                    'Два Deployment с одинаковым selector — конфликт, поды «перетягиваются»',
                    'kubectl get pods -l app=web — фильтр по labels',
                  ],
                },
                { type: 'note', text: 'Классический инцидент: разработчик скопировал deployment.yaml, поменял только name (web → api), но забыл selector и labels. Теперь два Deployment претендуют на одни поды. Проявление: «поды исчезают и появляются», «replicas не сходится». На собеседовании junior DevOps: «как Deployment связан с подами?» — «через selector и labels, не по имени».' },
              ],
            },
            {
              id: 'k8-l2-s5',
              title: 'Проверь себя: стратегии',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая стратегия обновления (strategy.type) в Deployment недоступна?',
                options: [
                  { id: 'a', text: 'RollingUpdate (по умолчанию)' },
                  { id: 'b', text: 'Recreate (сначала удалить все, потом создать)' },
                  { id: 'c', text: 'BlueGreen (два окружения, переключение трафика)' },
                  { id: 'd', text: 'Все перечисленные есть в стандартном Deployment' },
                ],
                correct: ['c'],
                explanation:
                  'В стандартном Deployment только RollingUpdate и Recreate. BlueGreen и Canary — это паттерны поверх (Ingress, Service, Argo Rollouts, Flagger), не «strategy.type». На собеседовании middle DevOps: «как сделать blue-green в K8s?» — «через два Deployment + Service с selector, или Argo Rollouts».',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — Сеть и конфигурация (было k8-m2)
    // ─────────────────────────────────────────────
    {
      id: 'k8-b-m2',
      title: 'Сеть и конфигурация',
      lessons: [
        {
          id: 'k8-l3',
          title: 'Service: стабильная точка входа',
          minutes: 25,
          steps: [
            {
              id: 'k8-l3-s1',
              title: 'Зачем нужен сервис',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Поды рождаются и умирают, их IP меняются. Service — стабильный виртуальный IP и DNS-имя, которые балансируют трафик между живыми подами, отобранными по меткам.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'service.yaml',
                  code: `apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web          # те же метки, что у подов деплоймента
  ports:
    - port: 80        # порт сервиса
      targetPort: 8000 # порт контейнера`,
                },
                { type: 'h3', text: 'Типы сервисов' },
                {
                  type: 'list',
                  items: [
                    'ClusterIP (по умолчанию) — доступен только внутри кластера. Стандарт для межсервисного общения.',
                    'NodePort — открывает порт на каждом узле, пробрасывая его на сервис.',
                    'LoadBalancer — просит у облака внешний балансировщик с публичным IP.',
                  ],
                },
              ],
            },
            {
              id: 'k8-l3-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Как Service находит поды, на которые нужно пересылать трафик?',
                options: [
                  { id: 'a', text: 'По IP-адресам из манифеста' },
                  { id: 'b', text: 'По имени деплоймента' },
                  { id: 'c', text: 'По совпадению selector с метками подов' },
                  { id: 'd', text: 'По порядку создания подов' },
                ],
                correct: ['c'],
                explanation:
                  'Связь только через метки: selector сервиса должен совпадать с labels подов. Имена не имеют значения — поэтому смена меток ломает трафик, это частая ошибка новичков.',
              },
            },
            {
              id: 'k8-l3-s3',
              title: 'DNS: как поды находят сервис',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Kubernetes запускает CoreDNS — внутренний DNS. Каждый Service получает DNS-имя. Поды обращаются друг к другу по этим именам, не по IP: бэкенд ищет postgres, а не 10.96.45.12. Это делает инфраструктуру переносимой: IP меняются, DNS-имена — нет.' },
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
                { type: 'note', text: 'Классическая проблема: «сервис не пингуется». Это нормально — ClusterIP виртуальный, ICMP не работает. Проверяйте через nslookup (DNS) и curl/wget на порт (TCP). Если DNS не резолвится — проверьте CoreDNS и selector сервиса.' },
              ],
            },
            {
              id: 'k8-l3-s4',
              title: 'Проверь себя: DNS',
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
              id: 'k8-l3-s5',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип Service и его доступ',
                pairs: [
                  { left: 'ClusterIP', right: 'Только внутри кластера' },
                  { left: 'NodePort', right: 'Порт на каждом узле (30000–32767)' },
                  { left: 'LoadBalancer', right: 'Публичный IP через облако' },
                  { left: 'ExternalName', right: 'DNS CNAME на внешний домен' },
                ],
                explanation:
                  'ClusterIP — внутри. NodePort — на узле. LoadBalancer — облачный LB. ExternalName — мост к внешнему сервису (без selector). На собеседовании junior DevOps: «какой тип Service выбрать для внешнего доступа?» — «LoadBalancer или Ingress».',
              },
            },
          ],
        },
        {
          id: 'k8-l4',
          title: 'ConfigMap и Secret',
          minutes: 25,
          steps: [
            {
              id: 'k8-l4-s1',
              title: 'Конфигурация вне образа',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Образ должен быть одинаковым на всех окружениях, а настройки — разными. ConfigMap хранит несекретную конфигурацию (адреса, флаги, лимиты), Secret — чувствительные данные (пароли, токены). Подключаются как переменные окружения или файлы.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Подключение конфигурации к деплойменту',
                  code: `spec:
  containers:
    - name: web
      image: web:1.4.0
      envFrom:
        - configMapRef:
            name: web-config
      env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password`,
                },
                { type: 'note', text: 'Secret в Kubernetes — это base64, а не шифрование: любой, кто может прочитать объект, видит значение. Для настоящей защиты включайте encryption at rest и настраивайте RBAC, либо используйте внешние хранилища секретов.' },
              ],
            },
            {
              id: 'k8-l4-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему нельзя зашивать конфигурацию окружения прямо в образ?',
                options: [
                  { id: 'a', text: 'Образы не умеют хранить переменные' },
                  { id: 'b', text: 'Тогда на каждое окружение нужен свой образ — ломается принцип «собрал один раз, запускай везде»' },
                  { id: 'c', text: 'Kubernetes запрещает ENV в Dockerfile' },
                  { id: 'd', text: 'ConfigMap работает быстрее' },
                ],
                correct: ['b'],
                explanation:
                  'Один и тот же проверенный образ должен идти через все окружения: dev → stage → prod. Различия выносим в ConfigMap/Secret. Иначе на прод уезжает не тот артефакт, что тестировался.',
              },
            },
            {
              id: 'k8-l4-s3',
              title: 'Secret: типы и способы создания',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Secret — не «один тип», а несколько: Opaque (обычные пары ключ-значение), docker-registry (креды для приватного registry), tls (сертификат + ключ), service-account-token. Kubernetes понимает тип и использует его по-разному.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Создание Secret',
                  code: `# 1. Из командной строки (base64 кодируется автоматически)
kubectl create secret generic db-secret \\
  --from-literal=username=app \\
  --from-literal=password=secret123

# 2. Из файла
kubectl create secret generic tls-secret \\
  --from-file=tls.crt=./cert.pem \\
  --from-file=tls.key=./key.pem

# 3. Docker registry (для приватного registry)
kubectl create secret docker-registry regcred \\
  --docker-server=ghcr.io \\
  --docker-username=myuser \\
  --docker-password=$TOKEN

# 4. Из YAML (значения должны быть base64!)
echo -n 'secret123' | base64   # c2VjcmV0MTIz`,
                },
                {
                  type: 'list',
                  items: [
                    'Opaque — обычные пары ключ-значение (дефолт)',
                    'kubernetes.io/dockerconfigjson — креды для registry',
                    'kubernetes.io/tls — сертификат + приватный ключ (для Ingress)',
                    'kubernetes.io/service-account-token — токен SA (для K8s API)',
                    'base64 — это НЕ шифрование: kubectl get secret -o yaml покажет всё',
                  ],
                },
                { type: 'note', text: 'На собеседовании junior DevOps: «Secret в Kubernetes шифрует данные?» — «нет, base64 — это кодирование, не шифрование; для шифрования — encryption at rest (EncryptionConfiguration) или внешние Vault/Sealed Secrets». Правильный ответ «base64 — не шифрование» — важный сигнал, что вы понимаете разницу.' },
              ],
            },
            {
              id: 'k8-l4-s4',
              title: 'Проверь себя: Secret',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Secret в Kubernetes хранит данные в base64. Это…',
                options: [
                  { id: 'a', text: 'Шифрование: без ключа не прочитать' },
                  { id: 'b', text: 'Кодирование: любой с доступом к объекту видит значение через kubectl get secret -o yaml' },
                  { id: 'c', text: 'Хэширование: необратимо' },
                  { id: 'd', text: 'Сжатие: уменьшает размер' },
                ],
                correct: ['b'],
                explanation:
                  'base64 — обратимое кодирование, не шифрование. Любой, у кого есть RBAC-доступ к Secret, прочитает значение. Настоящая защита: encryption at rest (EncryptionConfiguration), RBAC (кто может читать), внешние Vault/Sealed Secrets.',
              },
            },
            {
              id: 'k8-l4-s5',
              title: 'Проверь себя: монтирование',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте способ подключения и его особенность',
                pairs: [
                  { left: 'envFrom.configMapRef', right: 'Все ключи ConfigMap как переменные' },
                  { left: 'env.valueFrom.secretKeyRef', right: 'Один ключ Secret как переменная' },
                  { left: 'volumeMounts + volumes.configMap', right: 'ConfigMap как файлы в поде' },
                  { left: 'volumeMounts + volumes.secret', right: 'Secret как файлы (монтируются tmpfs)' },
                ],
                explanation:
                  'envFrom — все ключи разом. secretKeyRef — один ключ. ConfigMap/Secret как volume — файлы в поде. Secret-файлы монтируются в tmpfs (в RAM) и не пишутся на диск узла. Обновление ConfigMap/Secret: env — только при рестарте пода, volume — через несколько секунд автоматически (kubelet синхронизирует).',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Наблюдаемость и продакшн (было k8-m3)
    // ─────────────────────────────────────────────
    {
      id: 'k8-b-m3',
      title: 'Наблюдаемость и продакшн',
      lessons: [
        {
          id: 'k8-l5',
          title: 'Probes: как K8s понимает, что под жив',
          minutes: 30,
          steps: [
            {
              id: 'k8-l5-s1',
              title: 'liveness, readiness, startup',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три типа проб',
                  head: ['Проба', 'Вопрос', 'Что делает K8s при провале'],
                  rows: [
                    ['liveness', 'Жив ли процесс?', 'Перезапускает контейнер'],
                    ['readiness', 'Готов ли принимать трафик?', 'Убирает из endpoints сервиса (не убивает)'],
                    ['startup', 'Стартовал ли?', 'Ждёт (даёт время), при провале — перезапуск'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Все три пробы в манифесте',
                  code: `spec:
  containers:
    - name: web
      image: web:1.4.0
      ports:
        - containerPort: 8000
      startupProbe:
        httpGet: { path: /healthz, port: 8000 }
        failureThreshold: 30
        periodSeconds: 2
      readinessProbe:
        httpGet: { path: /ready, port: 8000 }
        periodSeconds: 5
      livenessProbe:
        httpGet: { path: /live, port: 8000 }
        periodSeconds: 10`,
                },
                { type: 'note', text: 'Классическая ошибка: liveness на тот же эндпоинт, что readiness. Если приложение перегружено и отвечает медленно — liveness начнёт его перезапускать, только усугубляя ситуацию. liveness должна проверять «не завис ли процесс», а не «справляется ли с нагрузкой».' },
              ],
            },
            {
              id: 'k8-l5-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт, если readiness-проба начнёт падать у всех подов сервиса?',
                options: [
                  { id: 'a', text: 'Поды перезапустятся' },
                  { id: 'b', text: 'Поды будут исключены из endpoints, сервис останется без трафика' },
                  { id: 'c', text: 'Ничего не изменится' },
                  { id: 'd', text: 'Увеличится число реплик' },
                ],
                correct: ['b'],
                explanation:
                  'Readiness убирает под из списка endpoints сервиса. Поды продолжают работать, но трафик на них не идёт. Это правильное поведение при перегрузке: K8s не убивает поды, а перестаёт слать им запросы, пока они не восстановятся.',
              },
            },
            {
              id: 'k8-l5-s3',
              title: 'Типы проверок: httpGet, exec, tcpSocket, grpc',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Проба — это не только HTTP. Kubernetes умеет 4 типа проверок. Выбор зависит от того, что именно вы проверяете.' },
                {
                  type: 'table',
                  caption: 'Типы probe',
                  head: ['Тип', 'Как работает', 'Когда'],
                  rows: [
                    ['httpGet', 'HTTP GET на путь и порт, ожидает 2xx', 'Веб-приложения, API'],
                    ['exec', 'Запускает команду внутри контейнера, exit 0 = OK', 'БД (pg_isready), не-HTTP сервисы'],
                    ['tcpSocket', 'Открывает TCP-соединение, OK если порт открыт', 'Любой TCP-сервис (Redis, MySQL)'],
                    ['grpc', 'gRPC health check (K8s 1.24+)', 'gRPC-сервисы'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Примеры',
                  code: `# HTTP — самый частый
livenessProbe:
  httpGet:
    path: /healthz
    port: 8000

# exec — для БД
readinessProbe:
  exec:
    command: ["pg_isready", "-U", "postgres"]
  periodSeconds: 10

# TCP — для Redis
readinessProbe:
  tcpSocket:
    port: 6379

# gRPC — для микросервисов
livenessProbe:
  grpc:
    port: 9000`,
                },
                { type: 'note', text: 'httpGet — стандарт для веб/API. exec — для БД (pg_isready, mysqladmin ping). tcpSocket — «открыт ли порт» (не значит «сервис работает»). grpc — для gRPC-сервисов, с 1.24. На собеседовании junior DevOps: «какие типы probe знаете?» — 4 из этого списка.' },
              ],
            },
            {
              id: 'k8-l5-s4',
              title: 'startupProbe: зачем и когда',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'startupProbe — для «медленно стартующих» приложений (JVM, ML-модели, большие кэши). Пока она не прошла, liveness не запускается: K8s даёт приложению время на прогрев, а не перезапускает его каждые 10 секунд.' },
                {
                  type: 'list',
                  items: [
                    'startupProbe → livenessProbe → readinessProbe (порядок)',
                    'startupProbe: failureThreshold × periodSeconds = максимум времени на старт',
                    'Без startupProbe: JVM стартует 60 сек, liveness с periodSeconds: 10 убивает через 30',
                    'С startupProbe: K8s ждёт 30 × 2 = 60 сек (failureThreshold × periodSeconds)',
                    'Один раз прошла — больше не запускается (только при рестарте контейнера)',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'startupProbe для JVM',
                  code: `startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30      # 30 попыток
  periodSeconds: 2          # каждые 2 сек
  # = до 60 сек на старт
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10
  failureThreshold: 3       # 3 провала = 30 сек → restart`,
                },
                { type: 'note', text: 'Правило: если приложение стартует > 30 сек — ставьте startupProbe. Иначе liveness будет убивать его на старте. Классический инцидент: «JVM в K8s перезапускается каждые 30 сек» — забыли startupProbe. На собеседовании middle DevOps это спрашивают.' },
              ],
            },
            {
              id: 'k8-l5-s5',
              title: 'Проверь себя: startupProbe',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Приложение (JVM) стартует 60 секунд. liveness с periodSeconds: 10 и failureThreshold: 3. Что произойдёт без startupProbe?',
                options: [
                  { id: 'a', text: 'Ничего, liveness подождёт' },
                  { id: 'b', text: 'Liveness убьёт контейнер через 30 сек (3 × 10), JVM не успеет стартовать — бесконечный рестарт' },
                  { id: 'c', text: 'Kubernetes автоматически добавит startupProbe' },
                  { id: 'd', text: 'Readiness решит проблему' },
                ],
                correct: ['b'],
                explanation:
                  'Liveness не знает про «медленный старт»: 3 провала × 10 сек = 30 сек, контейнер убит. JVM не успела — рестарт — снова 30 сек — снова убийство. Бесконечный CrashLoop. Решение — startupProbe с failureThreshold × periodSeconds ≥ 60.',
              },
            },
          ],
        },
        {
          id: 'k8-l6',
          title: 'Resource requests/limits и HPA',
          minutes: 30,
          steps: [
            {
              id: 'k8-l6-s1',
              title: 'Как K8s планирует и масштабирует',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'requests — то, что зарезервировано для пода. По ним scheduler выбирает узел: если на узле нет свободных requests, под туда не встанет. limits — потолок: превысил CPU — троттлинг, превысил память — OOMKilled.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'resources + HPA',
                  code: `spec:
  containers:
    - name: web
      resources:
        requests: { cpu: 100m, memory: 128Mi }
        limits:   { cpu: 500m, memory: 256Mi }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`,
                },
                { type: 'note', text: 'HPA масштабирует по среднему потреблению от requests. Если requests=cpu: 100m, а HPA target=70% — масштабирование начнётся, когда средний под потребляет 70m. Без requests HPA не работает вовсе.' },
              ],
            },
            {
              id: 'k8-l6-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт с подом, если он потребляет больше memory, чем указано в limits?',
                options: [
                  { id: 'a', text: 'Ему будет выделено больше памяти' },
                  { id: 'b', text: 'Он будет убит (OOMKilled)' },
                  { id: 'c', text: 'Он замедлится (throttling)' },
                  { id: 'd', text: 'K8s автоматически поднимет limits' },
                ],
                correct: ['b'],
                explanation:
                  'Память несжимаема: превысил лимит — ядро убивает процесс (OOMKilled). CPU, наоборот, сжимаемый: превысил — троттлинг. Поэтому по памяти limits ставят аккуратно, а по CPU можно свободнее.',
              },
            },
            {
              id: 'k8-l6-s3',
              title: 'QoS-классы: как K8s решает, кого убить первым',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Когда на узле заканчивается память, kubelet выбирает, кого убить. Не «случайного» — по QoS-классу (Quality of Service). Это определяется соотношением requests и limits.' },
                {
                  type: 'table',
                  caption: 'Три QoS-класса',
                  head: ['Класс', 'Когда', 'Кого убивают первым'],
                  rows: [
                    ['Guaranteed', 'requests == limits для CPU и memory', 'Последним (самые защищённые)'],
                    ['Burstable', 'requests < limits (или заданы только requests)', 'Средним'],
                    ['BestEffort', 'Нет ни requests, ни limits', 'Первым (самые уязвимые)'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'QoS на практике',
                  code: `# Guaranteed — БД, критичные сервисы
resources:
  requests: { cpu: 500m, memory: 1Gi }
  limits:   { cpu: 500m, memory: 1Gi }

# Burstable — обычные веб-сервисы
resources:
  requests: { cpu: 100m, memory: 128Mi }
  limits:   { cpu: 1,    memory: 512Mi }

# BestEffort — batch, dev (не для прода)
# (нет секции resources вообще)`,
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «какие QoS-классы знаете?» — Guaranteed, Burstable, BestEffort. «Как защитить БД от OOMKilled при нехватке памяти на узле?» — «Guaranteed QoS: requests == limits». Это архитектурное решение, а не случайность.' },
              ],
            },
            {
              id: 'k8-l6-s4',
              title: 'Проверь себя: QoS',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какой QoS-класс у пода, если requests.cpu=100m, limits.cpu=500m, requests.memory=128Mi, limits.memory=512Mi?',
                options: [
                  { id: 'a', text: 'Guaranteed' },
                  { id: 'b', text: 'Burstable' },
                  { id: 'c', text: 'BestEffort' },
                  { id: 'd', text: 'Нет QoS' },
                ],
                correct: ['b'],
                explanation:
                  'Burstable: requests < limits хоть по одному ресурсу. Guaranteed — только когда requests == limits для всех ресурсов. BestEffort — когда resources вообще нет. Burstable — самый частый класс для веб-сервисов.',
              },
            },
            {
              id: 'k8-l6-s5',
              title: 'Проверь себя: requests vs limits',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте параметр и его поведение',
                pairs: [
                  { left: 'requests', right: 'Резервируется, по нему scheduler выбирает узел' },
                  { left: 'limits.cpu', right: 'При превышении — троттлинг (замедление)' },
                  { left: 'limits.memory', right: 'При превышении — OOMKilled' },
                  { left: 'HPA target=70%', right: 'Масштабирование при среднем потреблении 70% от requests' },
                ],
                explanation:
                  'requests — бронь. limits.cpu — «душим» (сжимаемый). limits.memory — «убиваем» (несжимаемый). HPA target — % от requests. На собеседовании junior: «чем requests отличается от limits?» — это базовый вопрос.',
              },
            },
          ],
        },
        {
          id: 'k8-l7',
          title: 'Отладка: под не запускается',
          minutes: 35,
          steps: [
            {
              id: 'k8-l7-s1',
              title: 'Алгоритм из 5 шагов',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'kubectl get pods — какой статус? Pending, CrashLoopBackOff, ImagePullBackOff, Running?',
                    'kubectl describe pod <name> — секция Events внизу: там 90% ответов',
                    'kubectl logs <name> (и --previous для упавшего) — что приложение само говорит',
                    'kubectl exec -it <name> -- sh — живой ли контейнер, можно ли достучаться до зависимостей',
                    'kubectl get events --sort-by=.lastTimestamp -n <ns> — что происходит в namespace',
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Диагностика по статусам',
                  code: `Pending              → нет ресурсов / nodeSelector / taints / PVC не привязан
ImagePullBackOff      → опечатка в имени образа / нет imagePullSecret / registry недоступен
CrashLoopBackOff      → приложение падает при старте, смотри logs --previous
CreateContainerError  → проблема с volume, env, securityContext
Running, но не Ready  → readiness probe падает, смотри describe → Events
OOMKilled             → превышен memory limit, увеличь или оптимизируй`,
                },
                { type: 'note', text: 'Секция Events в describe pod почти всегда содержит прямую подсказку: "Insufficient cpu", "Failed to pull image", "Readiness probe failed: connection refused". Читайте снизу вверх — свежие события в конце.' },
              ],
            },
            {
              id: 'k8-l7-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Под в статусе CrashLoopBackOff. Куда смотреть в первую очередь?',
                options: [
                  { id: 'a', text: 'В логи предыдущего запуска: kubectl logs <pod> --previous' },
                  { id: 'b', text: 'В конфиг кластера' },
                  { id: 'c', text: 'Удалить и пересоздать под' },
                  { id: 'd', text: 'Перезапустить весь кластер' },
                ],
                correct: ['a'],
                explanation:
                  'CrashLoopBackOff — приложение падает при старте. Текущий контейнер уже мёртв, поэтому смотрим логи предыдущего инстанса через --previous. Удалить под бессмысленно: Deployment пересоздаст его, и он снова упадёт.',
              },
            },
            {
              id: 'k8-l7-s3',
              title: 'kubectl debug и ephemeral containers',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'В поде может не быть shell (distroless) или нужных утилит (nslookup, curl, tcpdump). Тогда kubectl exec не поможет. Решение — kubectl debug с ephemeral container: в работающий под добавляется контейнер с инструментами, не меняя основной образ.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'kubectl debug',
                  code: `# 1. Добавить ephemeral-контейнер с shell в работающий под
kubectl debug -it myapp-pod \\
  --image=nicolaka/netshoot \\
  --target=myapp

# Внутри netshoot: nslookup, curl, dig, tcpdump, ss

# 2. Создать копию пода с другим образом (для отладки)
kubectl debug myapp-pod \\
  --copy-to=myapp-debug \\
  --image=ubuntu \\
  --share-processes \\
  -- sleep infinity

# 3. Отладка узла (node)
kubectl debug node/node1 -it --image=ubuntu`,
                },
                {
                  type: 'list',
                  items: [
                    'ephemeral container — добавляется в работающий под (не в spec)',
                    'nicolaka/netshoot — «швейцарский нож» (curl, dig, tcpdump, ss, nmap)',
                    '--target=myapp — видит процессы и сеть основного контейнера',
                    'kubectl debug --copy-to — копия пода с другим образом',
                    'kubectl debug node/... — отладка узла кластера',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «как отладить distroless-под без shell?» — «kubectl debug с ephemeral container, nicolaka/netshoot». Плохой ответ «kubectl exec sh» — sh там нет. Это критическое отличие в K8s 1.24+.' },
              ],
            },
            {
              id: 'k8-l7-s4',
              title: 'OOMKilled: почему и что делать',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'OOMKilled — контейнер превысил memory limit, ядро убило процесс. exit code 137 (128 + 9 = SIGKILL). Это не баг K8s — это защита узла от одного «прожорливого» пода.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Диагностика OOMKilled',
                  code: `# 1. Проверить, что OOMKilled
kubectl describe pod myapp-pod | grep -A2 "Last State"
# Last State: Terminated
#   Reason:   OOMKilled
#   Exit Code: 137

# 2. Проверить текущий memory limit
kubectl get pod myapp-pod -o jsonpath='{.spec.containers[0].resources.limits.memory}'
# 256Mi

# 3. Посмотреть фактическое потребление (если есть metrics-server)
kubectl top pod myapp-pod
# NAME        CPU(cores)   MEMORY(bytes)
# myapp-pod   10m          245Mi  ← близко к лимиту

# 4. Посмотреть историю (если Prometheus/Grafana)
# В Grafana: container_memory_usage_bytes{container="myapp"}`,
                },
                {
                  type: 'list',
                  items: [
                    'Причины: утечка памяти, мало лимита, тяжёлый запрос, кэш без ограничения',
                    'Решение 1: поднять лимит (если узел позволяет)',
                    'Решение 2: найти утечку (профилировщик, heap dump)',
                    'Решение 3: ограничить кэш (LRU, max_size)',
                    'Решение 4: увеличить requests, чтобы QoS был выше',
                  ],
                },
                { type: 'note', text: 'OOMKilled ≠ «плохой K8s». Это K8s защищает узел: без лимита один под съел бы всю память — упали бы все. Правильный ответ: «найти причину утечки, а не просто поднять лимит». На собеседовании middle DevOps проверяют именно это.' },
              ],
            },
            {
              id: 'k8-l7-s5',
              title: 'Проверь себя: отладка',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте статус пода и первое действие',
                pairs: [
                  { left: 'CrashLoopBackOff', right: 'kubectl logs --previous' },
                  { left: 'ImagePullBackOff', right: 'Проверить имя образа и imagePullSecret' },
                  { left: 'Pending', right: 'kubectl describe pod → Events (нет ресурсов / taint)' },
                  { left: 'OOMKilled', right: 'Поднять memory limit или найти утечку' },
                ],
                explanation:
                  'CrashLoop — логи прошлого запуска. ImagePull — образ/секрет. Pending — describe+Events. OOMKilled — лимит/утечка. На собеседовании junior DevOps: «под не запускается, что делать?» — это дерево решений.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Workload controllers (было k8-m4)
    // ─────────────────────────────────────────────
    {
      id: 'k8-b-m4',
      title: 'Workload controllers',
      lessons: [
        {
          id: 'k8-l8',
          title: 'StatefulSet: стабильная идентичность',
          minutes: 30,
          steps: [
            {
              id: 'k8-l8-s1',
              title: 'Чем StatefulSet отличается от Deployment',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Deployment создаёт поды с случайными именами (web-7d9f8c-x7k2p) и не гарантирует порядок запуска — они взаимозаменяемы. StatefulSet создаёт поды с предсказуемыми именами (web-0, web-1, web-2), запускает их по порядку и даёт каждому собственный стабильный сетевой идентификатор и volume. Это нужно для распределённых систем, где «кто я» и «мои данные» — важны.' },
                {
                  type: 'table',
                  caption: 'Deployment vs StatefulSet',
                  head: ['Свойство', 'Deployment', 'StatefulSet'],
                  rows: [
                    ['Имена подов', 'web-7d9f8c-x7k2p (случайные)', 'web-0, web-1, web-2 (стабильные)'],
                    ['Порядок создания', 'Параллельно', 'Строго по порядку: 0 → 1 → 2'],
                    ['Порядок удаления', 'Параллельно', 'Обратный: 2 → 1 → 0'],
                    ['Сеть', 'Один Service на всех', 'Headless Service + уникальный DNS на каждый под'],
                    ['Хранилище', 'Один общий PVC (если нужно)', 'Свой PVC на каждый под'],
                    ['Когда', 'Stateless: API, фронтенд', 'Stateful: БД, Kafka, ZooKeeper, Elasticsearch'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'StatefulSet для PostgreSQL',
                  code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-headless   # обязательно, см. ниже
  replicas: 3
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
          env:
            - name: POSTGRES_PASSWORD
              value: secret
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:      # шаблон PVC — по одному на под
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        resources:
          requests:
            storage: 10Gi`,
                },
                { type: 'note', text: 'serviceName: postgres-headless — обязателен. Без него поды не получат DNS-имена. Headless Service (clusterIP: None) создаёт DNS-записи postgres-0.postgres-headless, postgres-1.postgres-headless — по одной на каждый под. Это позволяет приложению обращаться к конкретному поду (например, master-ноде Postgres).' },
              ],
            },
            {
              id: 'k8-l8-s2',
              title: 'Headless Service и DNS',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Headless Service для StatefulSet',
                  code: `apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
spec:
  clusterIP: None       # ← headless
  selector:
    app: postgres
  ports:
    - port: 5432`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'DNS-записи в кластере',
                  code: `postgres-0.postgres-headless      → IP пода postgres-0
postgres-1.postgres-headless      → IP пода postgres-1
postgres-2.postgres-headless      → IP пода postgres-2
postgres-headless                 → IP всех подов (SRV-запись)

Приложение может подключаться к мастеру:
  psql -h postgres-0.postgres-headless -U admin`,
                },
                { type: 'note', text: 'С Headless Service клиент получает IP всех подов (round-robin через DNS). Приложение само решает, к кому идти. Для stateless-сервисов это редко нужно — обычный ClusterIP балансирует трафик. Для StatefulSet — Headless обязателен.' },
              ],
            },
            {
              id: 'k8-l8-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему для StatefulSet обязателен Headless Service (clusterIP: None)?',
                options: [
                  { id: 'a', text: 'Без него StatefulSet не запустится' },
                  { id: 'b', text: 'Он создаёт стабильные DNS-имена для каждого пода (postgres-0, postgres-1...)' },
                  { id: 'c', text: 'Он ускоряет сеть' },
                  { id: 'd', text: 'Он нужен только для TLS' },
                ],
                correct: ['b'],
                explanation:
                  'Headless Service не балансирует трафик, а даёт DNS-запись на каждый под: postgres-0.postgres-headless, postgres-1.postgres-headless и т.д. Без этого поды в StatefulSet не смогут найти друг друга по стабильным именам (нужно для репликации, кластеров).',
              },
            },
            {
              id: 'k8-l8-s4',
              title: 'PVC и volumeClaimTemplates: данные переживают под',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Главная ценность StatefulSet — данные переживают пересоздание пода. Каждый под получает свой PVC из шаблона volumeClaimTemplates. При удалении пода PVC остаётся, при пересоздании — подключается к тому же PVC.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как это выглядит',
                  code: `# StatefulSet с 3 репликами создаёт:
kubectl get pvc
# NAME           STATUS   VOLUME                                     CAPACITY
# data-postgres-0  Bound    pvc-abc123...                              10Gi
# data-postgres-1  Bound    pvc-def456...                              10Gi
# data-postgres-2  Bound    pvc-ghi789...                              10Gi

# Удалить под postgres-0
kubectl delete pod postgres-0
# StatefulSet пересоздаст postgres-0
# → он подключится к data-postgres-0
# → данные сохранятся

# Удалить StatefulSet
kubectl delete statefulset postgres
# PVC data-postgres-0/1/2 ОСТАНУТСЯ (защита от потери данных)
# Удалять вручную:
kubectl delete pvc data-postgres-0 data-postgres-1 data-postgres-2`,
                },
                {
                  type: 'list',
                  items: [
                    'volumeClaimTemplates → по PVC на каждый под (data-postgres-0, 1, 2)',
                    'PVC переживают удаление пода и StatefulSet',
                    'При пересоздании под подключается к тому же PVC',
                    'Удалить PVC — только вручную (защита от потери данных)',
                    'StorageClass определяет, где физически лежит диск (EBS, GCE PD, локальный)',
                  ],
                },
                { type: 'note', text: 'Классический инцидент: «удалили StatefulSet с БД — данные пропали?» — «нет, PVC остались, но если удалите PVC — данные уйдут». На собеседовании middle DevOps: «как удалить StatefulSet с БД, не потеряв данные?» — «сначала бэкап, потом удалить StatefulSet (PVC остаются), проверить, что данные на месте, только потом — PVC».' },
              ],
            },
            {
              id: 'k8-l8-s5',
              title: 'Проверь себя: PVC',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что произойдёт с PVC при удалении StatefulSet с volumeClaimTemplates?',
                options: [
                  { id: 'a', text: 'Удалятся вместе со StatefulSet' },
                  { id: 'b', text: 'Останутся — данные сохранятся, удалять вручную' },
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
          id: 'k8-l9',
          title: 'DaemonSet: по одному поду на узел',
          minutes: 25,
          steps: [
            {
              id: 'k8-l9-s1',
              title: 'Зачем DaemonSet',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'DaemonSet гарантирует, что на каждом узле кластера (или на выбранных узлах) запущена ровно одна копия пода. Когда узел добавляется — DaemonSet создаёт на нём под. Когда узел удаляется — под удаляется. Используется для системных агентов, которые должны быть везде.' },
                {
                  type: 'list',
                  items: [
                    'Сбор логов: fluent-bit, fluentd, filebeat — по одному на узел',
                    'Мониторинг: node-exporter — метрики узла (CPU, RAM, диск)',
                    'Сеть: Calico, Cilium, kube-proxy — сетевые плагины',
                    'Хранилища: Ceph, GlusterFS — демоны хранилища',
                    'Безопасность: Falco, Tetragon — runtime-защита',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'DaemonSet для node-exporter',
                  code: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true        # использует сеть узла
      hostPID: true            # видит процессы узла
      tolerations:             # разрешает запуск на master-нодах
        - operator: Exists
      containers:
        - name: node-exporter
          image: prom/node-exporter:latest
          ports:
            - containerPort: 9100
              hostPort: 9100
          volumeMounts:
            - name: proc
              mountPath: /host/proc
              readOnly: true
      volumes:
        - name: proc
          hostPath:
            path: /proc`,
                },
                { type: 'note', text: 'tolerations с operator: Exists обязательны, если хотите, чтобы DaemonSet запускался и на master-нодах. По умолчанию master имеют taint node-role.kubernetes.io/control-plane:NoSchedule — обычные поды туда не попадают.' },
              ],
            },
            {
              id: 'k8-l9-s2',
              title: 'Как ограничить узлы',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Только на узлы с GPU',
                  code: `spec:
  template:
    spec:
      nodeSelector:
        accelerator: nvidia-gpu
      # или через nodeAffinity для более сложных условий
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: node-type
                    operator: In
                    values: [gpu-worker, ml-worker]`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Управление обновлениями DaemonSet',
                  code: `# RollingUpdate (по умолчанию) — по одному поду за раз
kubectl set image daemonset/node-exporter \\
  node-exporter=prom/node-exporter:v1.8.0

# Статус
kubectl rollout status daemonset/node-exporter
kubectl rollout undo daemonset/node-exporter

# OnDelete — обновляется только при ручном удалении пода
# (полезно, если не хотите дёргать сетевые плагины автоматически)`,
                },
                { type: 'note', text: 'DaemonSet не использует replicas — количество подов равно количеству подходящих узлов. Если у вас 10 узлов — будет 10 подов. Нет смысла указывать replicas: 5.' },
              ],
            },
            {
              id: 'k8-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Сколько подов создаст DaemonSet, если в кластере 8 узлов, из которых 2 master с taint, а tolerations НЕ указаны?',
                options: [
                  { id: 'a', text: '8' },
                  { id: 'b', text: '6 (только на worker-нодах)' },
                  { id: 'c', text: '2 (только на master)' },
                  { id: 'd', text: '1' },
                ],
                correct: ['b'],
                explanation:
                  'Без tolerations поды DaemonSet не попадут на master-ноды (у них taint NoSchedule). Получится 6 подов на 6 worker-нодах. Если нужны на master — добавить tolerations с operator: Exists.',
              },
            },
            {
              id: 'k8-l9-s4',
              title: 'Сетевые плагины как DaemonSet',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Самый важный DaemonSet в кластере — CNI-плагин (Calico, Cilium, Flannel). Без него поды не могут общаться друг с другом. Он запускается как DaemonSet на каждом узле и настраивает сеть: маршруты, iptables, eBPF-программы.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'DaemonSet в кластере',
                  code: `# Все DaemonSet в кластере
kubectl get daemonsets -A
# NAMESPACE     NAME          DESIRED   CURRENT   READY
# kube-system   calico-node   3         3         3
# kube-system   kube-proxy    3         3         3
# monitoring    node-exporter 3         3         3
# logging       fluent-bit    3         3         3

# Если DaemonSet не на всех узлах — смотреть Events
kubectl describe daemonset calico-node -n kube-system`,
                },
                {
                  type: 'list',
                  items: [
                    'CNI (Calico, Cilium, Flannel) — DaemonSet на каждом узле',
                    'kube-proxy — DaemonSet (или eBPF-замена в Cilium)',
                    'node-exporter — DaemonSet для метрик узла',
                    'fluent-bit / filebeat — DaemonSet для логов',
                    'Если DaemonSet не на всех узлах — проверьте taints/tolerations',
                  ],
                },
                { type: 'note', text: 'На собеседовании middle DevOps: «какой DaemonSet самый важный в кластере?» — «CNI-плагин (Calico, Cilium), без него нет сети». «Почему под не запускается на master?» — «taint, нужны tolerations». Это два классических вопроса.' },
              ],
            },
            {
              id: 'k8-l9-s5',
              title: 'Проверь себя: DaemonSet',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте задачу и контроллер',
                pairs: [
                  { left: 'Сбор логов и метрик на каждом узле', right: 'DaemonSet' },
                  { left: 'Веб-приложение с 3 репликами', right: 'Deployment' },
                  { left: 'БД с 3 репликами и своими дисками', right: 'StatefulSet' },
                  { left: 'Ежедневный бэкап в 02:00', right: 'CronJob' },
                ],
                explanation:
                  'DaemonSet — «по одному на узел» (логи, метрики, CNI). Deployment — stateless с репликами. StatefulSet — stateful с дисками и идентичностью. На собеседовании junior DevOps: «какой контроллер для логов?» — DaemonSet.',
              },
            },
          ],
        },
        {
          id: 'k8-l10',
          title: 'Job и CronJob',
          minutes: 30,
          steps: [
            {
              id: 'k8-l10-s1',
              title: 'Job: одноразовая задача',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Job создаёт поды, которые должны успешно завершиться (exit 0) и после этого больше не перезапускаться. Используется для миграций БД, batch-обработки, однократных скриптов. Ключевое отличие от Deployment: Deployment поддерживает «сколько подов работает», Job — «сколько подов успешно завершилось».' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Job для миграции БД',
                  code: `apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
spec:
  completions: 1          # сколько успешных завершений нужно
  parallelism: 1          # сколько подов работать одновременно
  backoffLimit: 3         # сколько раз повторить при падении
  ttlSecondsAfterFinished: 3600   # удалить через час после завершения
  template:
    spec:
      restartPolicy: OnFailure   # ← обязательно, не Always
      containers:
        - name: migrate
          image: myapp:1.4.2
          command: ["python", "manage.py", "migrate"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url`,
                },
                {
                  type: 'list',
                  items: [
                    'restartPolicy: OnFailure или Never — обязательны для Job (Always запрещён)',
                    'completions — сколько успешных завершений нужно (для batch-обработки)',
                    'parallelism — сколько подов одновременно (для ускорения)',
                    'backoffLimit — сколько раз повторить, прежде чем считать Job проваленным',
                    'ttlSecondsAfterFinished — автоудаление после завершения (иначе копятся)',
                  ],
                },
                { type: 'note', text: 'parallelism + completions = «сколько параллельно» × «сколько всего». Например, completions: 100, parallelism: 10 — 100 задач, по 10 одновременно. Классический паттерн для batch-обработки: каждый под берёт задачу из очереди (SQS, Redis).' },
              ],
            },
            {
              id: 'k8-l10-s2',
              title: 'CronJob: по расписанию',
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
  schedule: "0 2 * * *"          # каждый день в 02:00
  concurrencyPolicy: Forbid       # не запускать новый, если предыдущий ещё идёт
  successfulJobsHistoryLimit: 3   # хранить 3 успешных Job
  failedJobsHistoryLimit: 1
  startingDeadlineSeconds: 300    # не запускать, если опоздали > 5 мин
  suspend: false                  # true — пауза
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
                  pg_dump -h postgres -U app appdb | \\
                  gzip > /backup/db-$(date +%F).sql.gz
              volumeMounts:
                - name: backup
                  mountPath: /backup
          volumes:
            - name: backup
              persistentVolumeClaim:
                claimName: backup-pvc`,
                },
                {
                  type: 'table',
                  caption: 'concurrencyPolicy',
                  head: ['Значение', 'Поведение'],
                  rows: [
                    ['Allow (по умолчанию)', 'Запускать новый, даже если предыдущий идёт'],
                    ['Forbid', 'Пропустить запуск, если предыдущий ещё не закончился'],
                    ['Replace', 'Убить предыдущий и запустить новый'],
                  ],
                },
                { type: 'note', text: 'CronJob schedule — в UTC (по умолчанию). Формат: минута час день_месяца месяц день_недели. "0 2 * * *" = 02:00 UTC ежедневно. Для локального времени используйте timeZone: "Europe/Moscow" (K8s 1.27+).' },
              ],
            },
            {
              id: 'k8-l10-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие поля относятся к Job/CronJob, а не к Deployment?',
                options: [
                  { id: 'a', text: 'restartPolicy: OnFailure' },
                  { id: 'b', text: 'completions' },
                  { id: 'c', text: 'replicas' },
                  { id: 'd', text: 'backoffLimit' },
                ],
                correct: ['a', 'b', 'd'],
                explanation:
                  'restartPolicy, completions и backoffLimit — специфичны для Job. replicas — поле Deployment/StatefulSet/ReplicaSet; в Job его нет (там completions + parallelism).',
              },
            },
            {
              id: 'k8-l10-s4',
              title: 'Паттерны параллельной обработки',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Job может обрабатывать batch-задачи параллельно. Три паттерна — в зависимости от того, откуда берутся задачи и сколько их.' },
                {
                  type: 'table',
                  caption: 'Паттерны Job',
                  head: ['Паттерн', 'completions + parallelism', 'Когда'],
                  rows: [
                    ['Один под', '1 + 1', 'Миграция БД, одноразовый скрипт'],
                    ['Фиксированное число', '10 + 10', 'Обработать 10 файлов, по 10 параллельно'],
                    ['Очередь', 'не задано + 5', 'Под берёт задачу из очереди (SQS, Redis) до пустой'],
                    ['CronJob', 'Job по расписанию', 'Бэкап, отчёты, очистка'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Job из очереди',
                  code: `spec:
  parallelism: 5
  # completions НЕ задан: Job завершится, когда все поды
  # завершатся с exit 0 (после того как очередь опустеет)
  template:
    spec:
      containers:
        - name: worker
          image: myworker:1.0
          command: ["python", "worker.py"]
          # worker.py берёт задачу из SQS/Redis
          # и завершается (exit 0), когда очередь пуста`,
                },
                { type: 'note', text: 'Паттерн «очередь» — стандарт для batch-обработки: 5 воркеров параллельно берут задачи из SQS/Redis. Когда очередь пуста — все завершаются, Job done. Без completions Job ждёт, пока все поды успешно завершатся. На собеседовании middle DevOps это спрашивают.' },
              ],
            },
            {
              id: 'k8-l10-s5',
              title: 'Проверь себя: параллелизм',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Job с parallelism: 5, completions: 100. Сколько подов будет работать одновременно и сколько всего нужно?',
                options: [
                  { id: 'a', text: '5 одновременно, 100 успешных завершений' },
                  { id: 'b', text: '100 одновременно, 5 успешных завершений' },
                  { id: 'c', text: '5 одновременно, 5 успешных завершений' },
                  { id: 'd', text: 'Нельзя задать оба параметра' },
                ],
                correct: ['a'],
                explanation:
                  'parallelism — «сколько одновременно». completions — «сколько всего успешных завершений». 5 одновременно, 100 всего. Классический паттерн batch-обработки: 100 задач, по 5 параллельно. Job завершится, когда все 100 успешно завершатся.',
              },
            },
          ],
        },
        {
          id: 'k8-l11',
          title: 'Какой контроллер выбрать',
          minutes: 25,
          steps: [
            {
              id: 'k8-l11-s1',
              title: 'Дерево решений',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Чек-лист',
                  code: `Приложение должно работать постоянно?
├── Да
│   ├── Есть ли состояние (БД, файлы, идентичность)?
│   │   ├── Да  → StatefulSet (postgres, kafka, zookeeper)
│   │   └── Нет → Deployment (API, фронтенд, воркеры)
│   └──
└── Нет
    ├── Нужно по одному поду на узел?  → DaemonSet (агенты, плагины)
    ├── Одноразовая задача?             → Job (миграция, batch)
    └── По расписанию?                  → CronJob (бэкап, отчёты)`,
                },
                {
                  type: 'table',
                  caption: 'Итоговая таблица',
                  head: ['Контроллер', 'Stateless?', 'Идентичность?', 'Порядок?', 'Типичное применение'],
                  rows: [
                    ['Deployment', 'Да', 'Нет', 'Нет', 'Веб-приложения, API, stateless-воркеры'],
                    ['StatefulSet', 'Нет', 'Да', 'Да', 'БД, Kafka, ZooKeeper, Elasticsearch'],
                    ['DaemonSet', '—', 'Нет', '—', 'Node-exporter, fluent-bit, CNI'],
                    ['Job', '—', '—', '—', 'Миграции, batch-обработка'],
                    ['CronJob', '—', '—', '—', 'Бэкапы, отчёты, очистка'],
                  ],
                },
              ],
            },
            {
              id: 'k8-l11-s2',
              title: 'Практика: разбираем кейсы',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Интернет-магазин, фронтенд + API → Deployment',
                    'Redis в режиме кластера (3 ноды, каждая со своими данными) → StatefulSet',
                    'Микросервис, который перезапускается каждые 10 минут по крону → CronJob',
                    'Prometheus node-exporter (метрики на каждом узле) → DaemonSet',
                    'Одноразовая миграция схемы БД при деплое → Job',
                    'Kafka с 3 брокерами и партициями → StatefulSet',
                    'Nginx как reverse-proxy → Deployment (не StatefulSet, хотя «сервер» звучит солидно)',
                    'Fluent-bit (сбор логов со всех узлов) → DaemonSet',
                  ],
                },
                { type: 'note', text: 'Типичная ошибка новичков: «база данных в Kubernetes — это же Deployment!». Нет, БД в K8s — всегда StatefulSet. Она требует стабильного имени, стабильного диска и порядка запуска. Deployment не даёт ни того, ни другого, ни третьего.' },
              ],
            },
            {
              id: 'k8-l11-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте задачу и контроллер',
                pairs: [
                  { left: 'Frontend на 3 реплики', right: 'Deployment' },
                  { left: 'PostgreSQL с 3 нодами', right: 'StatefulSet' },
                  { left: 'Сбор логов с каждого узла', right: 'DaemonSet' },
                  { left: 'Ежедневный бэкап', right: 'CronJob' },
                ],
                explanation:
                  'Deployment — stateless. StatefulSet — состояние и идентичность. DaemonSet — по одному на узел. CronJob — по расписанию. Это базовый выбор на собеседовании: не ошибитесь с БД в Deployment.',
              },
            },
            {
              id: 'k8-l11-s4',
              title: 'Операторы: когда контроллеров недостаточно',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Встроенные контроллеры (Deployment, StatefulSet) — универсальные. Но для сложных систем (Postgres, Kafka, Elasticsearch, Prometheus) нужна специфичная логика: репликация, failover, бэкапы, обновления. Это описывают в Operator — «custom controller» с domain-знанием.' },
                {
                  type: 'list',
                  items: [
                    'Operator = CRD (Custom Resource Definition) + Controller',
                    'CRD — новый тип объекта (например, kind: PostgresCluster)',
                    'Controller — reconciliation loop для CRD',
                    'Примеры: CloudNativePG (Postgres), Strimzi (Kafka), Elastic Cloud on K8s',
                    'Operator знает, как настроить репликацию, failover, бэкапы',
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'CRD PostgresCluster (CloudNativePG)',
                  code: `apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres
spec:
  instances: 3
  storage:
    size: 10Gi
  backup:
    barmanObjectStore:
      destinationPath: s3://my-backups/postgres
      s3Credentials:
        accessKeyId:
          name: backup-creds
          key: ACCESS_KEY_ID`,
                },
                { type: 'note', text: 'На собеседовании senior DevOps: «как развернуть Postgres в K8s?» — плохой ответ «StatefulSet». Хороший: «оператор CloudNativePG или Zalando postgres-operator: он умеет репликацию, failover, бэкапы, обновления». StatefulSet — «кирпичики», оператор — «дом». В 2025 стандарт для БД в K8s — оператор.' },
              ],
            },
            {
              id: 'k8-l11-s5',
              title: 'Проверь себя: операторы',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Зачем нужен Operator для PostgreSQL в Kubernetes, если есть StatefulSet?',
                options: [
                  { id: 'a', text: 'Он быстрее' },
                  { id: 'b', text: 'Operator знает domain-логику: репликация, failover, бэкапы, обновления — StatefulSet этого не умеет' },
                  { id: 'c', text: 'StatefulSet не работает с БД' },
                  { id: 'd', text: 'Operator заменяет K8s API' },
                ],
                correct: ['b'],
                explanation:
                  'StatefulSet даёт «кирпичики» (поды, PVC, DNS), но не знает, как настроить streaming replication, выбрать master, сделать failover, бэкап. Operator (CloudNativePG, Zalando) — это CRD + controller, который знает domain-логику. Для БД в K8s в 2025 стандарт — оператор.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Практикум (было k8-m10)
    // ─────────────────────────────────────────────
    {
      id: 'k8-b-m5',
      title: 'Практикум',
      lessons: [
        {
          id: 'k8-l29',
          title: 'Практика: поды, деплойменты, сервисы',
          minutes: 35,
          steps: [
            {
              id: 'k8-l29-s1',
              title: 'Что такое под',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое Pod в Kubernetes?',
                options: [
                  { id: 'a', text: 'Физический сервер' },
                  { id: 'b', text: 'Минимальная единица: один или несколько контейнеров' },
                  { id: 'c', text: 'Docker-образ' },
                  { id: 'd', text: 'База данных' },
                ],
                correct: ['b'],
                explanation: 'Pod — минимальная единица в K8s. Обычно один контейнер, но может быть несколько тесно связанных (sidecar).',
              },
            },
            {
              id: 'k8-l29-s2',
              title: 'Список подов',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда покажет все поды в текущем namespace?',
                accepted: ['kubectl get pods', 'kubectl get pod'],
                placeholder: 'kubectl ...',
                hint: 'get + pods',
                explanation: 'kubectl get pods — стандартная команда. С -o wide — больше информации, с -A — все namespace.',
              },
            },
            {
              id: 'k8-l29-s3',
              title: 'Порядок деплоя',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте шаги деплоя приложения в правильном порядке',
                items: ['kubectl apply -f deployment.yaml', 'kubectl get pods', 'kubectl get svc', 'kubectl port-forward'],
                correct: ['kubectl apply -f deployment.yaml', 'kubectl get pods', 'kubectl get svc', 'kubectl port-forward'],
                explanation: 'Применили манифест → проверили поды → проверили сервис → пробросили порт для проверки.',
              },
            },
            {
              id: 'k8-l29-s4',
              title: 'Манифест Deployment',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните пропуски в манифесте',
                text: 'apiVersion: apps/v1\n____: Deployment\nmetadata:\n  name: web\nspec:\n  ____: 3',
                blanks: [
                  { accepted: ['kind'], hint: 'тип объекта' },
                  { accepted: ['replicas'], hint: 'количество копий' },
                ],
                explanation: 'kind: Deployment — тип. replicas: 3 — три копии пода. Обязательные поля для любого манифеста.',
              },
            },
            {
              id: 'k8-l29-s5',
              title: 'Объекты K8s',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте объект и его роль',
                pairs: [
                  { left: 'Pod', right: 'Минимальная единица' },
                  { left: 'Deployment', right: 'Управление репликами' },
                  { left: 'Service', right: 'Стабильная точка входа' },
                  { left: 'Ingress', right: 'Маршрутизация L7' },
                ],
                explanation: 'Pod — единица, Deployment — реплики, Service — стабильный доступ, Ingress — маршрутизация по host/path.',
              },
            },
            {
              id: 'k8-l29-s6',
              title: 'Реплики по умолчанию',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько реплик создаст Deployment, если в манифесте не указано поле `replicas`?',
                correct: 1,
                explanation: 'По умолчанию replicas: 1. Если нужно больше — указывайте явно. Для HA-сервисов обычно 2+ реплики.',
              },
            },
            {
              id: 'k8-l29-s7',
              title: 'Probes',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие типы probes существуют в Kubernetes?',
                options: [
                  { id: 'a', text: 'liveness' },
                  { id: 'b', text: 'readiness' },
                  { id: 'c', text: 'startup' },
                  { id: 'd', text: 'performance' },
                ],
                correct: ['a', 'b', 'c'],
                explanation: 'liveness — жив ли процесс, readiness — готов ли принимать трафик, startup — стартовал ли. performance — не существует.',
              },
            },
            {
              id: 'k8-l29-s8',
              title: 'Типы Service',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого типа Service',
                columns: ['ClusterIP', 'NodePort', 'LoadBalancer'],
                rows: [
                  { label: 'Доступен только внутри кластера', correct: ['ClusterIP'] },
                  { label: 'Открывает порт на каждом узле', correct: ['NodePort'] },
                  { label: 'Внешний IP через облако', correct: ['LoadBalancer'] },
                  { label: 'Тип по умолчанию', correct: ['ClusterIP'] },
                ],
                explanation: 'ClusterIP — только внутри, NodePort — порт на узлах (30000-32767), LoadBalancer — облачный LB. По умолчанию — ClusterIP.',
              },
            },
            {
              id: 'k8-l29-s9',
              title: 'Напишите манифест',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите Deployment-манифест: имя web, образ nginx:1.27, 3 реплики.',
                starterCode: 'apiVersion: apps/v1\nkind: Deployment\n',
                mustInclude: [
                  { pattern: 'kind:\\s*Deployment', message: 'Нужен kind: Deployment' },
                  { pattern: 'replicas:\\s*3', message: 'Нужно replicas: 3' },
                  { pattern: 'image:\\s*nginx:1\\.27', message: 'Нужен image: nginx:1.27' },
                  { pattern: 'name:\\s*web', message: 'Нужно name: web' },
                ],
                explanation: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels: {app: web}\n  template:\n    metadata: {labels: {app: web}}\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27',
              },
            },
            {
              id: 'k8-l29-s10',
              title: 'StatefulSet',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем StatefulSet отличается от Deployment?',
                options: [
                  { id: 'a', text: 'Быстрее работает' },
                  { id: 'b', text: 'Даёт стабильные имена подов и свой volume на каждый под' },
                  { id: 'c', text: 'Не поддерживает реплики' },
                  { id: 'd', text: 'Работает только с БД' },
                ],
                correct: ['b'],
                explanation: 'StatefulSet — для stateful-приложений (БД, Kafka): стабильные имена (web-0, web-1), свой PVC на каждый под, порядок запуска. Deployment — для stateless.',
              },
            },
          ],
        },
      ],
    },
  ],
};