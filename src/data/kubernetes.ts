import type { Course } from './types';

export const k8sCourse: Course = {
  slug: 'kubernetes-essentials',
  title: 'Kubernetes: основы оркестрации',
  subtitle: 'Поды, деплойменты, сервисы и конфигурация — минимум для уверенной работы',
  description:
    'Kubernetes стал стандартом запуска контейнеров в продакшене. Курс объясняет его ключевые абстракции на простых примерах: как описать желаемое состояние приложения, как Kubernetes сам восстанавливает упавшие поды и как выкатывать обновления без простоя.',
  level: 'Средний',
  tags: ['Kubernetes', 'DevOps', 'Оркестрация'],
  accent: '#7c5cff',
  icon: 'helm',
  outcomes: [
    'Объяснять устройство кластера: control plane и узлы',
    'Работать с подами, деплойментами и сервисами через kubectl',
    'Отделять конфигурацию от кода через ConfigMap и Secret',
    'Выкатывать обновления и откатываться при проблемах',
  ],
  requirements: ['Понимание контейнеров и Docker', 'Базовый YAML'],
  modules: [
    {
      id: 'k8-m1',
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
    {
      id: 'k8-m2',
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
    {
      id: 'k8-m3',
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
        },     // ← конец k8-m3
    {
      id: 'k8-m4',
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
        {
      id: 'k8-m5',
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
        {
      id: 'k8-m6',
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
                  code: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: postgres-secret\ntype: Opaque\nstringData:\n  POSTGRES_PASSWORD: "super-secret"\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  clusterIP: None\n  selector:\n    app: postgres\n  ports:\n    - port: 5432\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres-headless\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          ports:\n            - containerPort: 5432\n          env:\n            - name: POSTGRES_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: postgres-secret\n                  key: POSTGRES_PASSWORD\n            - name: PGDATA\n              value: /var/lib/postgresql/data/pgdata   # подкаталог, иначе initdb ругается\n          resources:\n            requests: { cpu: 200m, memory: 256Mi }\n            limits:   { cpu: 1,    memory: 1Gi }\n          readinessProbe:\n            exec:\n              command: [\"pg_isready\", \"-U\", \"postgres\"]\n            initialDelaySeconds: 5\n            periodSeconds: 10\n          livenessProbe:\n            exec:\n              command: [\"pg_isready\", \"-U\", \"postgres\"]\n            initialDelaySeconds: 30\n            periodSeconds: 15\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:\n    - metadata:\n        name: data\n      spec:\n        accessModes: [ReadWriteOnce]\n        storageClassName: fast-ssd\n        resources:\n          requests:\n            storage: 20Gi',
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
        {
      id: 'k8-m7',
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
        {
      id: 'k8-m8',
      title: 'Helm и Kustomize',
      lessons: [
        {
          id: 'k8-l22',
          title: 'Helm: пакетный менеджер для Kubernetes',
          minutes: 30,
          steps: [
            {
              id: 'k8-l22-s1',
              title: 'Зачем Helm',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Манифест на 200 строк для одного приложения — это уже 6+ файлов (Deployment, Service, Ingress, ConfigMap, Secret, HPA). Для трёх окружений (dev/staging/prod) — 18 файлов с почти одинаковым содержимым, отличающимся парой параметров. Helm упаковывает всё это в chart с параметризацией через values.yaml.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Структура chart',
                  code: 'mychart/\n├── Chart.yaml          # метаданные: имя, версия, зависимости\n├── values.yaml         # значения по умолчанию (переопределяются при установке)\n├── templates/\n│   ├── deployment.yaml\n│   ├── service.yaml\n│   ├── ingress.yaml\n│   ├── _helpers.tpl    # вспомогательные шаблоны\n│   └── NOTES.txt       # сообщение после установки\n└── charts/             # subcharts (зависимости)',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'values.yaml',
                  code: 'replicaCount: 3\n\nimage:\n  repository: ghcr.io/myorg/myapp\n  tag: "1.4.2"\n  pullPolicy: IfNotPresent\n\nservice:\n  type: ClusterIP\n  port: 80\n\nresources:\n  requests:\n    cpu: 100m\n    memory: 128Mi\n  limits:\n    cpu: 500m\n    memory: 256Mi\n\ningress:\n  enabled: false\n  host: ""',
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'templates/deployment.yaml (с шаблонизацией)',
                  code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include "mychart.fullname" . }}\n  labels:\n    {{- include "mychart.labels" . | nindent 4 }}\nspec:\n  replicas: {{ .Values.replicaCount }}\n  selector:\n    matchLabels:\n      app: {{ include "mychart.name" . }}\n  template:\n    metadata:\n      labels:\n        app: {{ include "mychart.name" . }}\n    spec:\n      containers:\n        - name: {{ .Chart.Name }}\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n          ports:\n            - containerPort: {{ .Values.service.port }}\n          resources:\n            {{- toYaml .Values.resources | nindent 12 }}',
                },
              ],
            },
            {
              id: 'k8-l22-s2',
              title: 'Команды Helm',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка и обновление',
                  code: '# Из chart в локальной папке\nhelm install myapp ./mychart -n production --create-namespace\n\n# С override values\nhelm install myapp ./mychart \\\n  -n production \\\n  --set image.tag=1.4.3 \\\n  --set replicaCount=5\n\n# Или из файла\nhelm install myapp ./mychart -n production -f prod-values.yaml\n\n# Из публичного репозитория\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\nhelm install postgres bitnami/postgresql -n db \\\n  --set auth.password=secret',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Upgrade, rollback, uninstall',
                  code: 'helm list -n production\nhelm status myapp -n production\nhelm get values myapp -n production\nhelm get manifest myapp -n production\n\nhelm upgrade myapp ./mychart -n production -f prod-values.yaml\n\nhelm history myapp -n production\nhelm rollback myapp 1 -n production\n\nhelm uninstall myapp -n production',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Полезное',
                  code: '# Сгенерировать манифесты без установки (dry-run)\nhelm template myapp ./mychart -f prod-values.yaml\n\n# Проверить на ошибки\nhelm lint ./mychart\n\n# Diff между текущим и новым релизом\nhelm diff upgrade myapp ./mychart -f prod-values.yaml\n\n# Скачать chart\nhelm pull bitnami/postgresql --version 16.0.0\nhelm show values bitnami/postgresql',
                },
              ],
            },
            {
              id: 'k8-l22-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое values.yaml в Helm?',
                options: [
                  { id: 'a', text: 'Список установленных релизов' },
                  { id: 'b', text: 'Файл с параметрами по умолчанию, которые шаблоны используют через {{ .Values }}' },
                  { id: 'c', text: 'Манифест Kubernetes для чарта' },
                  { id: 'd', text: 'Конфиг для Helm-сервера' },
                ],
                correct: ['b'],
                explanation:
                  'values.yaml — значения по умолчанию. При установке их можно переопределить через --set или -f prod-values.yaml. В templates/ используются через {{ .Values.xxx }}. Это и есть параметризация Helm.',
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
      id: 'k8-m9',
      title: 'Helm: пакетный менеджер',
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
      ],
    },
        {
      id: 'k8-m10',
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