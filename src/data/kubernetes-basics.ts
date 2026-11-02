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
          minutes: 20,
          steps: [
            {
              id: 'k8-l1-s1',
              title: 'Control plane и узлы',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Кластер Kubernetes состоит из управляющего слоя (control plane) и рабочих узлов (nodes). Control plane — мозг: API-сервер принимает команды, etcd хранит состояние кластера, scheduler выбирает, на каком узле запустить под, а контроллеры непрерывно приводят фактическое состояние к желаемому.',
                },
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
                    K2 --> P2`
                },
                {
                  type: 'h3',
                  text: 'Главная идея: декларативность',
                },
                {
                  type: 'p',
                  text: 'Вы не говорите Kubernetes «запусти контейнер на сервере X». Вы описываете желаемое состояние: «должно быть 3 реплики приложения версии 1.4». Контроллеры сами следят, чтобы оно выполнялось: упал под — поднимут новый, умер узел — перенесут поды на живые.',
                },
                {
                  type: 'note',
                  text: 'Это называется reconciliation loop: наблюдаем → сравниваем с желаемым → исправляем расхождение. Поняв этот цикл, вы поняли Kubernetes.',
                },
              ],
            },
            {
              id: 'k8-l1-s2',
              title: 'Под — минимальная единица',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Под (pod) — наименьший объект, которым оперирует Kubernetes. Обычно это один контейнер, но может быть и несколько тесно связанных (например, приложение + sidecar-прокси). Контейнеры пода делят сеть и могут делить volume.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Работа с подами через kubectl',
                  code: 'kubectl get pods                    # список подов\nkubectl describe pod web-xxx        # подробности и события\nkubectl logs web-xxx                # логи\nkubectl exec -it web-xxx -- sh      # shell внутри пода\nkubectl delete pod web-xxx          # удалить (деплоймент пересоздаст)',
                },
                {
                  type: 'p',
                  text: 'Поды эфемерны: у каждого свой IP, при пересоздании IP меняется. Поэтому напрямую на поды никто не ссылается — для стабильного доступа есть сервисы.',
                },
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
          ],
        },
        {
          id: 'k8-l2',
          title: 'Deployment: желаемое состояние приложения',
          minutes: 25,
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
                  code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: registry.example.com/web:1.4.0\n          ports:\n            - containerPort: 8000\n          resources:\n            requests:\n              cpu: 100m\n              memory: 128Mi\n            limits:\n              cpu: 500m\n              memory: 256Mi',
                },
                {
                  type: 'p',
                  text: 'Применяем манифест командой kubectl apply -f deployment.yaml. Kubernetes создаст 3 пода с меткой app: web. Selector связывает деплоймент с его подами по этим меткам.',
                },
                {
                  type: 'h3',
                  text: 'Requests и limits — обязательны',
                },
                {
                  type: 'p',
                  text: 'Requests — сколько ресурсов гарантированно зарезервировать поду (по ним scheduler выбирает узел). Limits — потолок: при превышении CPU контейнер душится (throttling), при превышении памяти — убивается (OOMKilled).',
                },
              ],
            },
            {
              id: 'k8-l2-s2',
              title: 'Обновления и откаты',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Смена образа на новую версию запускает rolling update: Kubernetes постепенно поднимает новые поды и гасит старые, не роняя приложение. Параметры maxSurge и maxUnavailable контролируют скорость и доступность во время выкатки.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Выкатка и откат',
                  code: 'kubectl set image deployment/web web=registry.example.com/web:1.5.0\nkubectl rollout status deployment/web\nkubectl rollout history deployment/web\nkubectl rollout undo deployment/web        # откат на прошлую версию',
                },
                {
                  type: 'note',
                  text: 'Readiness probe говорит, готов ли под принимать трафик. Без неё запросы могут уйти в ещё не прогретый контейнер — классический источник ошибок при выкатке.',
                },
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
          minutes: 20,
          steps: [
            {
              id: 'k8-l3-s1',
              title: 'Зачем нужен сервис',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Поды рождаются и умирают, их IP меняются. Service — стабильный виртуальный IP и DNS-имя, которые балансируют трафик между живыми подами, отобранными по меткам.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'service.yaml',
                  code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web          # те же метки, что у подов деплоймента\n  ports:\n    - port: 80        # порт сервиса\n      targetPort: 8000 # порт контейнера',
                },
                {
                  type: 'h3',
                  text: 'Типы сервисов',
                },
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
          ],
        },
        {
          id: 'k8-l4',
          title: 'ConfigMap и Secret',
          minutes: 20,
          steps: [
            {
              id: 'k8-l4-s1',
              title: 'Конфигурация вне образа',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Образ должен быть одинаковым на всех окружениях, а настройки — разными. ConfigMap хранит несекретную конфигурацию (адреса, флаги, лимиты), Secret — чувствительные данные (пароли, токены). Подключаются как переменные окружения или файлы.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Подключение конфигурации к деплойменту',
                  code: 'spec:\n  containers:\n    - name: web\n      image: web:1.4.0\n      envFrom:\n        - configMapRef:\n            name: web-config\n      env:\n        - name: DB_PASSWORD\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: password',
                },
                {
                  type: 'note',
                  text: 'Secret в Kubernetes — это base64, а не шифрование: любой, кто может прочитать объект, видит значение. Для настоящей защиты включайте encryption at rest и настраивайте RBAC, либо используйте внешние хранилища секретов.',
                },
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
          minutes: 25,
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
                  code: 'spec:\n  containers:\n    - name: web\n      image: web:1.4.0\n      ports:\n        - containerPort: 8000\n      startupProbe:\n        httpGet: { path: /healthz, port: 8000 }\n        failureThreshold: 30\n        periodSeconds: 2\n      readinessProbe:\n        httpGet: { path: /ready, port: 8000 }\n        periodSeconds: 5\n      livenessProbe:\n        httpGet: { path: /live, port: 8000 }\n        periodSeconds: 10',
                },
                {
                  type: 'note',
                  text: 'Классическая ошибка: liveness на тот же эндпоинт, что readiness. Если приложение перегружено и отвечает медленно — liveness начнёт его перезапускать, только усугубляя ситуацию. liveness должна проверять «не завис ли процесс», а не «справляется ли с нагрузкой».',
                },
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
          ],
        },
        {
          id: 'k8-l6',
          title: 'Resource requests/limits и HPA',
          minutes: 25,
          steps: [
            {
              id: 'k8-l6-s1',
              title: 'Как K8s планирует и масштабирует',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'requests — то, что зарезервировано для пода. По ним scheduler выбирает узел: если на узле нет свободных requests, под туда не встанет. limits — потолок: превысил CPU — троттлинг, превысил память — OOMKilled.',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'resources + HPA',
                  code: 'spec:\n  containers:\n    - name: web\n      resources:\n        requests: { cpu: 100m, memory: 128Mi }\n        limits:   { cpu: 500m, memory: 256Mi }\n---\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: web\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: web\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70',
                },
                {
                  type: 'note',
                  text: 'HPA масштабирует по среднему потреблению от requests. Если requests=cpu: 100m, а HPA target=70% — масштабирование начнётся, когда средний под потребляет 70m. Без requests HPA не работает вовсе.',
                },
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
          ],
        },
        {
          id: 'k8-l7',
          title: 'Отладка: под не запускается',
          minutes: 30,
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
                  code: 'Pending              → нет ресурсов / nodeSelector / taints / PVC не привязан\nImagePullBackOff      → опечатка в имени образа / нет imagePullSecret / registry недоступен\nCrashLoopBackOff      → приложение падает при старте, смотри logs --previous\nCreateContainerError  → проблема с volume, env, securityContext\nRunning, но не Ready   → readiness probe падает, смотри describe → Events\nOOMKilled             → превышен memory limit, увеличь или оптимизируй',
                },
                {
                  type: 'note',
                  text: 'Секция Events в describe pod почти всегда содержит прямую подсказку: "Insufficient cpu", "Failed to pull image", "Readiness probe failed: connection refused". Читайте снизу вверх — свежие события в конце.',
                },
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
          minutes: 25,
          steps: [
            {
              id: 'k8-l8-s1',
              title: 'Чем StatefulSet отличается от Deployment',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Deployment создаёт поды с случайными именами (web-7d9f8c-x7k2p) и не гарантирует порядок запуска — они взаимозаменяемы. StatefulSet создаёт поды с предсказуемыми именами (web-0, web-1, web-2), запускает их по порядку и даёт каждому собственный стабильный сетевой идентификатор и volume. Это нужно для распределённых систем, где «кто я» и «мои данные» — важны.',
                },
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
                  code: 'apiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres-headless   # обязательно, см. ниже\n  replicas: 3\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          env:\n            - name: POSTGRES_PASSWORD\n              value: secret\n          ports:\n            - containerPort: 5432\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:      # шаблон PVC — по одному на под\n    - metadata:\n        name: data\n      spec:\n        accessModes: [ReadWriteOnce]\n        resources:\n          requests:\n            storage: 10Gi',
                },
                {
                  type: 'note',
                  text: 'serviceName: postgres-headless — обязателен. Без него поды не получат DNS-имена. Headless Service (clusterIP: None) создаёт DNS-записи postgres-0.postgres-headless, postgres-1.postgres-headless — по одной на каждый под. Это позволяет приложению обращаться к конкретному поду (например, master-ноде Postgres).',
                },
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
                  code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  clusterIP: None       # ← headless\n  selector:\n    app: postgres\n  ports:\n    - port: 5432',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'DNS-записи в кластере',
                  code: 'postgres-0.postgres-headless      → IP пода postgres-0\npostgres-1.postgres-headless      → IP пода postgres-1\npostgres-2.postgres-headless      → IP пода postgres-2\npostgres-headless                 → IP всех подов (SRV-запись)\n\nПриложение может подключаться к мастеру:\n  psql -h postgres-0.postgres-headless -U admin',
                },
                {
                  type: 'note',
                  text: 'С Headless Service клиент получает IP всех подов (round-robin через DNS). Приложение само решает, к кому идти. Для stateless-сервисов это редко нужно — обычный ClusterIP балансирует трафик. Для StatefulSet — Headless обязателен.',
                },
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
          ],
        },
        {
          id: 'k8-l9',
          title: 'DaemonSet: по одному поду на узел',
          minutes: 20,
          steps: [
            {
              id: 'k8-l9-s1',
              title: 'Зачем DaemonSet',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'DaemonSet гарантирует, что на каждом узле кластера (или на выбранных узлах) запущена ровно одна копия пода. Когда узел добавляется — DaemonSet создаёт на нём под. Когда узел удаляется — под удаляется. Используется для системных агентов, которые должны быть везде.',
                },
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
                  code: 'apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: node-exporter\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: node-exporter\n  template:\n    metadata:\n      labels:\n        app: node-exporter\n    spec:\n      hostNetwork: true        # использует сеть узла\n      hostPID: true            # видит процессы узла\n      tolerations:             # разрешает запуск на master-нодах\n        - operator: Exists\n      containers:\n        - name: node-exporter\n          image: prom/node-exporter:latest\n          ports:\n            - containerPort: 9100\n              hostPort: 9100\n          volumeMounts:\n            - name: proc\n              mountPath: /host/proc\n              readOnly: true\n      volumes:\n        - name: proc\n          hostPath:\n            path: /proc',
                },
                {
                  type: 'note',
                  text: 'tolerations с operator: Exists обязательны, если хотите, чтобы DaemonSet запускался и на master-нодах. По умолчанию master имеют taint node-role.kubernetes.io/control-plane:NoSchedule — обычные поды туда не попадают.',
                },
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
                  code: 'spec:\n  template:\n    spec:\n      nodeSelector:\n        accelerator: nvidia-gpu\n      # или через nodeAffinity для более сложных условий\n      affinity:\n        nodeAffinity:\n          requiredDuringSchedulingIgnoredDuringExecution:\n            nodeSelectorTerms:\n              - matchExpressions:\n                  - key: node-type\n                    operator: In\n                    values: [gpu-worker, ml-worker]',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Управление обновлениями DaemonSet',
                  code: '# RollingUpdate (по умолчанию) — по одному поду за раз\nkubectl set image daemonset/node-exporter \\\n  node-exporter=prom/node-exporter:v1.8.0\n\n# Статус\nkubectl rollout status daemonset/node-exporter\nkubectl rollout undo daemonset/node-exporter\n\n# OnDelete — обновляется только при ручном удалении пода\n# (полезно, если не хотите дёргать сетевые плагины автоматически)',
                },
                {
                  type: 'note',
                  text: 'DaemonSet не использует replicas — количество подов равно количеству подходящих узлов. Если у вас 10 узлов — будет 10 подов. Нет смысла указывать replicas: 5.',
                },
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
          ],
        },
        {
          id: 'k8-l10',
          title: 'Job и CronJob',
          minutes: 25,
          steps: [
            {
              id: 'k8-l10-s1',
              title: 'Job: одноразовая задача',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Job создаёт поды, которые должны успешно завершиться (exit 0) и после этого больше не перезапускаться. Используется для миграций БД, batch-обработки, однократных скриптов. Ключевое отличие от Deployment: Deployment поддерживает «сколько подов работает», Job — «сколько подов успешно завершилось».',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Job для миграции БД',
                  code: 'apiVersion: batch/v1\nkind: Job\nmetadata:\n  name: db-migrate\nspec:\n  completions: 1          # сколько успешных завершений нужно\n  parallelism: 1          # сколько подов работать одновременно\n  backoffLimit: 3         # сколько раз повторить при падении\n  ttlSecondsAfterFinished: 3600   # удалить через час после завершения\n  template:\n    spec:\n      restartPolicy: OnFailure   # ← обязательно, не Always\n      containers:\n        - name: migrate\n          image: myapp:1.4.2\n          command: ["python", "manage.py", "migrate"]\n          env:\n            - name: DATABASE_URL\n              valueFrom:\n                secretKeyRef:\n                  name: db-secret\n                  key: url',
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
                {
                  type: 'note',
                  text: 'parallelism + completions = «сколько параллельно» × «сколько всего». Например, completions: 100, parallelism: 10 — 100 задач, по 10 одновременно. Классический паттерн для batch-обработки: каждый под берёт задачу из очереди (SQS, Redis).',
                },
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
                  code: 'apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: postgres-backup\nspec:\n  schedule: "0 2 * * *"          # каждый день в 02:00\n  concurrencyPolicy: Forbid       # не запускать новый, если предыдущий ещё идёт\n  successfulJobsHistoryLimit: 3   # хранить 3 успешных Job\n  failedJobsHistoryLimit: 1\n  startingDeadlineSeconds: 300    # не запускать, если опоздали > 5 мин\n  suspend: false                  # true — пауза\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers:\n            - name: backup\n              image: postgres:16\n              command:\n                - /bin/sh\n                - -c\n                - |\n                  pg_dump -h postgres -U app appdb | \\\n                  gzip > /backup/db-$(date +%F).sql.gz\n              volumeMounts:\n                - name: backup\n                  mountPath: /backup\n          volumes:\n            - name: backup\n              persistentVolumeClaim:\n                claimName: backup-pvc',
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
                {
                  type: 'note',
                  text: 'CronJob schedule — в UTC (по умолчанию). Формат: минута час день_месяца месяц день_недели. "0 2 * * *" = 02:00 UTC ежедневно. Для локального времени используйте timeZone: "Europe/Moscow" (K8s 1.27+).',
                },
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
          ],
        },
        {
          id: 'k8-l11',
          title: 'Какой контроллер выбрать',
          minutes: 20,
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
                  code: 'Приложение должно работать постоянно?\n├── Да\n│   ├── Есть ли состояние (БД, файлы, идентичность)?\n│   │   ├── Да  → StatefulSet (postgres, kafka, zookeeper)\n│   │   └── Нет → Deployment (API, фронтенд, воркеры)\n│   └──\n└── Нет\n    ├── Нужно по одному поду на узел?  → DaemonSet (агенты, плагины)\n    ├── Одноразовая задача?             → Job (миграция, batch)\n    └── По расписанию?                  → CronJob (бэкап, отчёты)',
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
                {
                  type: 'note',
                  text: 'Типичная ошибка новичков: «база данных в Kubernetes — это же Deployment!». Нет, БД в K8s — всегда StatefulSet. Она требует стабильного имени, стабильного диска и порядка запуска. Deployment не даёт ни того, ни другого, ни третьего.',
                },
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