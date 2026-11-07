import type { Course } from './types';

export const gitopsCourse: Course = {
  slug: 'gitops',
  title: 'GitOps и деплой',
  subtitle: 'ArgoCD, Flux, стратегии деплоя, feature flags, supply chain и secrets',
  description:
    'Продвинутый курс по доставке в прод. Разберём стратегии деплоя (rolling, blue-green, canary) и feature flags, GitOps-подход (ArgoCD и Flux — Git как единственный источник правды), supply chain security (SBOM, cosign, SLSA), управление секретами (Vault, OIDC, sealed-secrets) и DORA-метрики для мониторинга самого пайплайна. Практикум — комплексная практика.',
  level: 'Продвинутый',
  tags: ['GitOps', 'ArgoCD', 'Flux', 'Supply chain', 'DevOps'],
  accent: '#f97316',
  icon: 'gitops',
  outcomes: [
    'Выбирать стратегию деплоя: rolling, blue-green, canary',
    'Применять feature flags и понимать «деплой ≠ релиз»',
    'Настраивать ArgoCD: Application, sync policies, self-heal',
    'Настраивать Flux: GitRepository, Kustomization, HelmRelease',
    'Защищать supply chain: SBOM, cosign, SLSA, верификация при деплое',
    'Управлять секретами: Vault, OIDC, sealed-secrets, SOPS',
    'Измерять DORA-метрики и улучшать пайплайн по данным',
  ],
  requirements: [
    'Пройден курс «CI/CD: основы»',
    'Понимание Kubernetes (курсы K8s: основы и продвинуто)',
    'Опыт с GitHub Actions или GitLab CI',
  ],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Стратегии деплоя и feature flags
    // ─────────────────────────────────────────────
    {
      id: 'cd-g-m1',
      title: 'Стратегии деплоя и feature flags',
      lessons: [
        {
          id: 'cd-l7',
          title: 'Стратегии деплоя и rollback',
          minutes: 35,
          steps: [
            {
              id: 'cd-l7-s1',
              title: 'Rolling, blue-green, canary',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три стратегии',
                  head: ['Стратегия', 'Как работает', 'Откат'],
                  rows: [
                    ['Rolling update', 'Постепенно заменять старые поды новыми (K8s default)', 'kubectl rollout undo'],
                    ['Blue-green', 'Два окружения: blue (старое) и green (новое). Переключение трафика', 'Переключить обратно'],
                    ['Canary', '5% трафика на новую версию, потом 25%, 50%, 100%', 'Уменьшить долю до 0'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Blue-green: переключение трафика',
                  code: `graph LR
                    subgraph Before["До деплоя"]
                        LB1["LB"] -->|"100%"| B1["Blue v1.0"]
                        LB1 -.->|"0%"| G1["Green — пусто"]
                    end
                    subgraph After["После деплоя"]
                        LB2["LB"] -.->|"0%"| B2["Blue v1.0<br/>(откат за секунду)"]
                        LB2 -->|"100%"| G2["Green v1.1"]
                    end`,
                },
                {
                  type: 'mermaid',
                  caption: 'Canary: постепенная раскатка',
                  code: `graph LR
                    S1["5%"] --> S2["25%"]
                    S2 --> S3["50%"]
                    S3 --> S4["100%"]
                    S1 -.->|"плохо"| Stop["0%<br/>(автооткат)"]
                    S2 -.->|"плохо"| Stop
                    S3 -.->|"плохо"| Stop`,
                },
              ],
            },
            {
              id: 'cd-l7-s2',
              title: 'Feature flags и rollback',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Feature flag (feature toggle) — «переключатель» в коде, который включает/выключает функциональность без деплоя. Позволяет деплоить «выключенным», включать для 1% пользователей, откатывать за секунды.' },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Feature flag в коде',
                  code: `from launchdarkly import LDClient

ld = LDClient(sdk_key=os.environ["LD_SDK_KEY"])

def new_checkout(user):
    if ld.variation("new-checkout-flow", user, default=False):
        return new_flow(user)   # новая версия
    return old_flow(user)       # старая версия

# В LaunchDarkly UI: включить для 5% → 25% → 100%
# Если плохо — выключить за секунды, без деплоя и rollback`,
                },
                {
                  type: 'list',
                  items: [
                    'Деплой ≠ релиз. Код в проде, но «выключен» флагом',
                    'Rollback за секунды — переключить флаг',
                    'A/B-тесты: 50% на новую, 50% на старую',
                    'Feature flags — это технический долг: удаляйте после полного раската',
                    'Инструменты: LaunchDarkly, Unleash, Flagsmith (Open Source), GrowthBook',
                  ],
                },
                { type: 'note', text: 'Canary + feature flags — стандарт крупных компаний. Canary — для инфраструктурных изменений (новый сервер, новая БД). Feature flags — для бизнес-фич.' },
              ],
            },
            {
              id: 'cd-l7-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте стратегию деплоя и её особенность',
                pairs: [
                  { left: 'Rolling update', right: 'Постепенная замена подов, K8s default' },
                  { left: 'Blue-green', right: 'Два окружения, мгновенное переключение трафика' },
                  { left: 'Canary', right: '5% → 25% → 100% с проверкой метрик' },
                  { left: 'Feature flag', right: 'Включение фичи в рантайме, без деплоя' },
                ],
                explanation: 'Rolling — стандарт K8s. Blue-green — два окружения, откат за секунду, дорого. Canary — постепенная раскатка с метриками. Feature flag — «деплой ≠ релиз».',
              },
            },
            {
              id: 'cd-l7-s4',
              title: 'Когда какую стратегию выбирать',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Стратегия — не «что моднее», а «что подходит задаче». Три вопроса: сколько стоит откат, сколько трафика можно потерять, есть ли инфраструктура для двух окружений.' },
                {
                  type: 'table',
                  caption: 'Выбор стратегии',
                  head: ['Ситуация', 'Стратегия', 'Почему'],
                  rows: [
                    ['Обычный stateless-сервис', 'RollingUpdate', 'Стандарт K8s, просто, откат через undo'],
                    ['Критичный сервис (деньги)', 'Blue-green', 'Мгновенный откат, два окружения'],
                    ['Новая фича с риском', 'Canary + feature flags', 'Постепенно, с метриками, откат за секунды'],
                    ['БД с миграцией схемы', 'Expand-contract + feature flags', 'Миграция не ломает старую версию'],
                    ['Mobile-приложение', 'Feature flags', 'Релиз в App Store нельзя откатить'],
                  ],
                },
                { type: 'note', text: 'На собеседовании: «как деплоить критичный сервис?» — правильный ответ «blue-green или canary с feature flags, не rolling». Rolling — для «не страшно, если 30 секунд будет 50% ошибок». Для денег — blue-green.' },
              ],
            },
            {
              id: 'cd-l7-s5',
              title: 'Проверь себя: когда что',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Платёжный сервис, где каждая ошибка = потерянные деньги. Какую стратегию выбрать?',
                options: [
                  { id: 'a', text: 'Rolling update (K8s default)' },
                  { id: 'b', text: 'Blue-green (два окружения, переключение трафика за секунду)' },
                  { id: 'c', text: 'Recreate (удалить все поды, создать новые)' },
                  { id: 'd', text: 'Никакую — деплоить руками ночью' },
                ],
                correct: ['b'],
                explanation:
                  'Blue-green: пока green не проверен, все деньги идут через blue. Откат — переключить трафик обратно за секунду. Rolling может пропустить 5% ошибочных запросов — для платежей это неприемлемо. Recreate = полный простой. «Руками ночью» — не стратегия.',
              },
            },
          ],
        },
        {
          id: 'cd-l13',
          title: 'Feature flags: LaunchDarkly, Unleash, GrowthBook',
          minutes: 30,
          steps: [
            {
              id: 'cd-l13-s1',
              title: 'Типы feature flags',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Feature flag — не одна сущность, а четыре разных паттерна с разным жизненным циклом. Путать их — источник технического долга.' },
                {
                  type: 'table',
                  caption: 'Четыре типа флагов',
                  head: ['Тип', 'Что делает', 'Живёт'],
                  rows: [
                    ['Release toggle', 'Включает новую фичу для части пользователей', 'Дни–недели (удаляется после раската)'],
                    ['Experiment toggle', 'A/B-тест: 50% на новую, 50% на старую', 'Недели (удаляется после выбора победителя)'],
                    ['Ops toggle', 'Kill switch: выключить фичу при инциденте', 'Навсегда (это страховка)'],
                    ['Permission toggle', 'Разные фичи для free / pro / enterprise', 'Навсегда (часть бизнес-логики)'],
                  ],
                },
                {
                  type: 'mermaid',
                  caption: 'Раскатка фичи через release toggle',
                  code: `graph LR
                    Off["0%<br/>deploy в прод"] --> Canary["5%<br/>внутренние"]
                    Canary --> Small["25%<br/>ранние"]
                    Small --> Half["50%<br/>половина"]
                    Half --> Full["100%<br/>удалить флаг"]
                    Canary -.->|"ошибка"| Off
                    Small -.->|"ошибка"| Off
                    Half -.->|"ошибка"| Off`,
                },
              ],
            },
            {
              id: 'cd-l13-s2',
              title: 'Инструменты: LaunchDarkly, Unleash, GrowthBook',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Инструмент', 'Лицензия', 'Плюсы', 'Минусы'],
                  rows: [
                    ['LaunchDarkly', 'SaaS', 'Стандарт индустрии, SDK на всё, аналитика', 'Дорого ($10+/мес за seat)'],
                    ['Unleash', 'Open Source (Apache 2)', 'Self-hosted, бесплатно, простой', 'Своя инфра (Postgres + сервер)'],
                    ['Flagsmith', 'Open Source + Cloud', 'Self-hosted или облако', 'Меньше SDK'],
                    ['GrowthBook', 'Open Source + Cloud', 'Сильный A/B-анализ', 'Фокус на эксперименты, не на kill-switch'],
                  ],
                },
                { type: 'note', text: 'В РФ — Unleash self-hosted или Flagsmith. LaunchDarkly недоступен. Для маленькой команды — Unleash за полчаса в Docker.' },
              ],
            },
            {
              id: 'cd-l13-s3',
              title: 'Kill switch — практика',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Kill switch — самый важный тип флага в проде. Сценарий: пятница, 18:00, новая фича валит прод. Нет времени на rollback деплоя (5 минут). Kill switch — 5 секунд.' },
                {
                  type: 'code',
                  lang: 'python',
                  caption: 'Kill switch на внешний сервис',
                  code: `def call_payment_service(order):
    # Если фича "new-psp" выключена — идём в старый PSP
    if not flags.is_enabled("new-psp", default=True):
        return legacy_psp.charge(order)

    try:
        return new_psp.charge(order)
    except Exception:
        # Автоматический fallback на старый PSP
        flags.track_failure("new-psp")
        return legacy_psp.charge(order)`,
                },
                {
                  type: 'list',
                  items: [
                    'Kill switch должен быть на границе с внешним сервисом',
                    'Автоматический fallback: при ошибке — старый путь',
                    'Метрики: как часто kill switch активируется (аномалия = проблема)',
                    'Kill switch не удаляют никогда — это страховка',
                    'Флаг всегда по умолчанию «включён» — если сервер флагов упал, работает старый путь',
                  ],
                },
              ],
            },
            {
              id: 'cd-l13-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем kill switch отличается от release toggle?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'Kill switch живёт навсегда (страховка от инцидентов), release toggle удаляется после полного раската' },
                  { id: 'c', text: 'Kill switch только для permission' },
                  { id: 'd', text: 'Kill switch работает только в Kubernetes' },
                ],
                correct: ['b'],
                explanation: 'Release toggle — на дни/недели, удаляется после 100% раската. Kill switch — навсегда: если фича валит прод, выключить за секунды. Не удалять: страховка.',
              },
            },
            {
              id: 'cd-l13-s5',
              title: 'Проверь себя: типы',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте тип флага и его назначение',
                pairs: [
                  { left: 'Release toggle', right: 'Раскатывает новую фичу постепенно' },
                  { left: 'Experiment toggle', right: 'A/B-тест: 50/50' },
                  { left: 'Ops toggle', right: 'Kill switch при инциденте' },
                  { left: 'Permission toggle', right: 'Разные фичи для free / pro / enterprise' },
                ],
                explanation: 'Release — раскатка. Experiment — A/B. Ops (kill switch) — страховка. Permission — тарифы. На собеседовании middle: «зачем четыре типа?» — «у каждого свой жизненный цикл; release удаляется, kill switch — навсегда».',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m2 — GitOps (ArgoCD, Flux)
    // ─────────────────────────────────────────────
    {
      id: 'cd-g-m2',
      title: 'GitOps: ArgoCD и Flux',
      lessons: [
        {
          id: 'cd-l14',
          title: 'ArgoCD: установка, Application, sync',
          minutes: 35,
          steps: [
            {
              id: 'cd-l14-s1',
              title: 'Что такое GitOps',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitOps — подход, при котором Git — единственный источник правды для состояния кластера. Хотите изменить деплой — коммит в Git. Специальный агент в кластере (ArgoCD, Flux) непрерывно сравнивает желаемое (Git) с фактическим (кластер) и применяет изменения.' },
                {
                  type: 'mermaid',
                  caption: 'Sync loop: ArgoCD тянет Git, применяет в кластер',
                  code: `sequenceDiagram
                    participant Dev as Разработчик
                    participant Git as Git<br/>(манифесты)
                    participant Argo as ArgoCD<br/>(в кластере)
                    participant K8s as K8s API

                    Dev->>Git: git push (изменение)
                    loop каждые 3 мин
                        Argo->>Git: pull
                        Argo->>Argo: diff желаемое ↔ фактическое
                        alt есть расхождение
                            Argo->>K8s: apply
                            K8s-->>Argo: OK
                            Argo->>Argo: status: Synced
                        else нет расхождения
                            Argo->>Argo: status: Synced (no-op)
                        end
                    end`,
                },
                {
                  type: 'list',
                  items: [
                    'Git — source of truth: что в main, то и в кластере',
                    'Pull-based: агент в кластере сам тянет Git (не CI пушит в кластер)',
                    'Continuous reconciliation: каждые 3 минуты проверка diff',
                    'Drift detection: если кто-то руками поправил кластер — ArgoCD вернёт как в Git',
                    'Audit trail: git log = история всех деплоев',
                  ],
                },
              ],
            },
            {
              id: 'cd-l14-s2',
              title: 'Установка и Application',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Установка ArgoCD',
                  code: `kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Пароль admin
kubectl -n argocd get secret argocd-initial-admin-secret \\
  -o jsonpath="{.data.password}" | base64 -d

# UI
kubectl port-forward svc/argocd-server -n argocd 8080:443`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Application — «что и откуда синхронизировать»',
                  code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-manifests
    targetRevision: main
    path: apps/myapp
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true        # удалять объекты, которых нет в Git
      selfHeal: true     # возвращать кластер к Git, если кто-то поправил руками
    syncOptions:
      - CreateNamespace=true`,
                },
                { type: 'note', text: 'selfHeal: true — главное отличие GitOps от классического CD. Если разработчик руками сделал kubectl edit — ArgoCD через 3 минуты вернёт как в Git. Никакого «дрифта» конфигурации.' },
              ],
            },
            {
              id: 'cd-l14-s3',
              title: 'App of Apps и ApplicationSet',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Один Application на один сервис — плохо масштабируется: 50 сервисов = 50 YAML. Два паттерна: App of Apps (один Application, который создаёт другие) и ApplicationSet (генератор Application по шаблону).' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'ApplicationSet — Application на каждую папку',
                  code: `apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: all-apps
  namespace: argocd
spec:
  generators:
    - git:
        repoURL: https://github.com/myorg/k8s-manifests
        revision: main
        directories:
          - path: apps/*
  template:
    metadata:
      name: '{{path.basename}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/k8s-manifests
        targetRevision: main
        path: '{{path}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: production
      syncPolicy:
        automated: { prune: true, selfHeal: true }`,
                },
                { type: 'note', text: 'ApplicationSet — стандарт в 2025. Один YAML генерирует N Application для N папок. Добавили папку apps/new-service — ArgoCD сам создал Application.' },
              ],
            },
            {
              id: 'cd-l14-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что делает `selfHeal: true` в ArgoCD?',
                options: [
                  { id: 'a', text: 'Автоматически поднимает упавшие поды' },
                  { id: 'b', text: 'Возвращает кластер к состоянию из Git, если кто-то поправил руками' },
                  { id: 'c', text: 'Удаляет старые ревизии' },
                  { id: 'd', text: 'Ускоряет синхронизацию' },
                ],
                correct: ['b'],
                explanation: 'selfHeal — «drift correction»: если кто-то сделал kubectl edit в обход Git, ArgoCD через 3 минуты вернёт как в Git. Это ключевое свойство GitOps: Git — единственный источник правды.',
              },
            },
            {
              id: 'cd-l14-s5',
              title: 'Проверь себя: Application и sync',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте поле Application и его назначение',
                pairs: [
                  { left: 'source.repoURL + path', right: 'Откуда брать манифесты в Git' },
                  { left: 'destination', right: 'Куда деплоить (кластер + namespace)' },
                  { left: 'syncPolicy.automated', right: 'Автоматически синхронизировать с Git' },
                  { left: 'selfHeal', right: 'Возвращать кластер к Git при ручных правках' },
                ],
                explanation: 'source — «откуда». destination — «куда». automated — «синхронизировать автоматически». selfHeal — «защита от дрифта». Ещё важны: prune (удалять лишнее), syncOptions (CreateNamespace). На собеседовании middle DevOps это база.',
              },
            },
          ],
        },
        {
          id: 'cd-l15',
          title: 'Flux и сравнение с ArgoCD',
          minutes: 30,
          steps: [
            {
              id: 'cd-l15-s1',
              title: 'Flux: pull-based GitOps',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Flux — второй по популярности GitOps-инструмент (CNCF graduated). В отличие от ArgoCD с его UI и Application CRD, Flux — «набор операторов»: GitRepository, Kustomization, HelmRelease, ImagePolicy. Каждый делает одно.' },
                {
                  type: 'mermaid',
                  caption: 'Flux: три CRD в цепочке',
                  code: `graph LR
                    Git[("Git repo")] --> GR["GitRepository<br/>«где лежит»"]
                    GR --> K["Kustomization<br/>«что применить»"]
                    GR --> HR["HelmRelease<br/>«какой чарт»"]
                    K --> K8s["K8s API"]
                    HR --> K8s
                    IP["ImagePolicy<br/>«новая версия»"] -.->|"image automation"| K`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitRepository + Kustomization',
                  code: `apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: myapp
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/myorg/k8s-manifests
  ref:
    branch: main
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: myapp
  namespace: flux-system
spec:
  interval: 10m
  targetNamespace: production
  sourceRef:
    kind: GitRepository
    name: myapp
  path: ./apps/myapp
  prune: true
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: myapp
      namespace: production`,
                },
              ],
            },
            {
              id: 'cd-l15-s2',
              title: 'ArgoCD vs Flux',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Когда что',
                  head: ['Критерий', 'ArgoCD', 'Flux'],
                  rows: [
                    ['Подход', 'Application CRD + UI', 'Набор операторов, CLI-first'],
                    ['UI', 'Богатый (граф, diff, sync)', 'Минимальный, через CLI/Flux CD UI'],
                    ['Multi-tenancy', 'Projects + RBAC', 'Namespaces + service accounts'],
                    ['Image automation', 'Есть (через Image Updater)', 'Из коробки (ImagePolicy)'],
                    ['Кривая обучения', 'Низкая (UI помогает)', 'Выше (нет UI, надо понимать CRD)'],
                    ['Helm', 'Поддерживает', 'HelmRelease — нативно'],
                    ['Когда', 'Команда с разными ролями (QA/PM/DevOps)', 'CLI-first, GitOps-only команды'],
                  ],
                },
                { type: 'note', text: 'На собеседовании: «Какой GitOps выбрать?» — «ArgoCD, если команде нужен UI для наблюдаемости; Flux, если CLI-first и автоматизация образов. Оба CNCF graduated».' },
              ],
            },
            {
              id: 'cd-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'В чём ключевое отличие Flux от ArgoCD?',
                options: [
                  { id: 'a', text: 'Flux только для K8s' },
                  { id: 'b', text: 'Flux — набор мелких операторов (GitRepository, Kustomization, HelmRelease), ArgoCD — единый Application CRD с богатым UI' },
                  { id: 'c', text: 'Flux платный' },
                  { id: 'd', text: 'ArgoCD не поддерживает Helm' },
                ],
                correct: ['b'],
                explanation: 'Flux — «Unix way»: каждый CRD делает одно. ArgoCD — «одно приложение, богатый UI». Оба — GitOps, оба CNCF graduated. Выбор зависит от культуры команды.',
              },
            },
            {
              id: 'cd-l15-s4',
              title: 'Image Automation и drift detection',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Оба инструмента умеют обнаруживать расхождения (drift) и показывать diff. Flux дополнительно умеет автоматически обновлять образы в Git: ImagePolicy сканирует registry, ImageUpdateAutomation коммитит новый тег в репозиторий.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Flux Image Automation',
                  code: `apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: myapp
  namespace: flux-system
spec:
  image: ghcr.io/myorg/myapp
  interval: 5m
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: myapp
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: myapp
  policy:
    semver:
      range: '>=1.4.0'
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageUpdateAutomation
metadata:
  name: myapp
  namespace: flux-system
spec:
  interval: 30m
  update:
    strategy: Setters
    path: ./apps/myapp`,
                },
                {
                  type: 'list',
                  items: [
                    'ImageRepository — сканирует registry (каждые 5 минут)',
                    'ImagePolicy — выбирает версию (semver, alphabetical, numerical)',
                    'ImageUpdateAutomation — коммитит новый тег в Git',
                    'Полный цикл: новый образ в registry → Flux коммитит новый тег → ArgoCD/Flux деплоит',
                    'Image automation — killer feature Flux, в ArgoCD — через Image Updater (менее нативный)',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior: «как автоматизировать деплой нового образа в GitOps?» — «Flux ImagePolicy + ImageUpdateAutomation, или Argo CD Image Updater». Это разница между «деплой по кнопке» и «деплой по пушу образа».' },
              ],
            },
            {
              id: 'cd-l15-s5',
              title: 'Проверь себя: image automation',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте CRD Flux и его назначение',
                pairs: [
                  { left: 'GitRepository', right: 'Откуда брать манифесты (URL Git)' },
                  { left: 'Kustomization', right: 'Что применить из репозитория' },
                  { left: 'HelmRelease', right: 'Установить Helm-чарт' },
                  { left: 'ImagePolicy', right: 'Выбрать версию образа из registry' },
                ],
                explanation: 'GitRepository — «где лежит». Kustomization — «что применить». HelmRelease — «какой чарт». ImagePolicy — «какая версия образа». Ещё: ImageUpdateAutomation — «закоммитить новый тег в Git». Flux — «Unix way»: каждый CRD делает одно.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m3 — Supply chain и secrets
    // ─────────────────────────────────────────────
    {
      id: 'cd-g-m3',
      title: 'Supply chain и secrets',
      lessons: [
        {
          id: 'cd-l16',
          title: 'Supply chain: SBOM, cosign, SLSA',
          minutes: 35,
          steps: [
            {
              id: 'cd-l16-s1',
              title: 'Атаки на supply chain',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Supply chain attack — компрометация не вашего кода, а зависимости или CI/CD. Примеры: SolarWinds (2020, 18 000 организаций), event-stream (2018, кража крипто-кошельков), ua-parser-js (2021, майнер), xz-utils (2024, бэкдор в sshd). Ваш код может быть идеален — а прод скомпрометирован через библиотеку.' },
                {
                  type: 'mermaid',
                  caption: 'Цепочка поставки: где можно атаковать',
                  code: `graph LR
                    Src["Source<br/>(git)"] --> Build["Build<br/>(CI runner)"]
                    Build --> Reg[("Registry")]
                    Reg --> Deploy["Deploy<br/>(K8s)"]
                    Deps["Зависимости<br/>(npm, pip)"] -.->|"1. подмена"| Build
                    Build -.->|"2. компрометация<br/>раннера"| Build
                    Reg -.->|"3. подмена<br/>образа"| Deploy
                    Src -.->|"4. подмена<br/>исходника"| Src`,
                },
              ],
            },
            {
              id: 'cd-l16-s2',
              title: 'SBOM, cosign, SLSA',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Три инструмента защиты',
                  head: ['Инструмент', 'Что делает', 'Как работает'],
                  rows: [
                    ['SBOM', 'Состав образа: все пакеты и версии', 'Trivy/Syft генерирует JSON (CycloneDX/SPDX)'],
                    ['cosign', 'Подпись образа', 'Криптоподпись; verify при деплое'],
                    ['SLSA', 'Уровни гарантии происхождения (1–4)', 'Provenance-аттестат: кто, когда, из какого коммита собрал'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Полный pipeline защиты образа',
                  code: `# 1. Собрать с provenance (кто и из чего собрал)
docker buildx build \\
  --provenance=true \\
  --sbom=true \\
  -t ghcr.io/myorg/myapp:1.4.2 --push .

# 2. Подписать образ
cosign sign --yes ghcr.io/myorg/myapp:1.4.2

# 3. Сгенерировать отдельный SBOM (если нужен как файл)
trivy image -f cyclonedx -o sbom.cdx.json ghcr.io/myorg/myapp:1.4.2

# 4. При деплое — проверить подпись
cosign verify --certificate-identity-regexp='.*@myorg.com' \\
              --certificate-oidc-issuer=https://token.actions.githubusercontent.com \\
              ghcr.io/myorg/myapp:1.4.2`,
                },
                { type: 'note', text: 'SLSA (Supply-chain Levels for Software Artifacts) — «сколько гарантий, что артефакт не подменён». Уровень 1 — есть provenance, 2 — сборка на защищённом раннере, 3 — провенанс нельзя подделать, 4 — reproducible builds. Начинайте с 1–2.' },
              ],
            },
            {
              id: 'cd-l16-s3',
              title: 'Admission controller: verify при деплое',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'cosign verify полезен только если его кто-то вызывает. Идеально — admission controller в K8s (Kyverno, OPA Gatekeeper, Sigstore policy-controller), который при создании Pod проверяет подпись образа. Неподписанный образ — деплой блокируется.' },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'Kyverno: только подписанные образы',
                  code: `apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-signature
      match:
        any:
          - resources:
              kinds: [Pod]
      verifyImages:
        - imageReferences:
            - "ghcr.io/myorg/*"
          attestors:
            - entries:
                - keyless:
                    subject: "https://github.com/myorg/*"
                    issuer: "https://token.actions.githubusercontent.com"`,
                },
                { type: 'note', text: 'Без admission controller подпись образа — просто «запись в registry». С Kyverno — реальная гарантия: злоумышленник не сможет задеплоить подменённый образ.' },
              ],
            },
            {
              id: 'cd-l16-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры защищают supply chain?',
                options: [
                  { id: 'a', text: 'SBOM: знать, какие пакеты в образе' },
                  { id: 'b', text: 'Подпись образа через cosign' },
                  { id: 'c', text: 'Использовать только публичные образы с Docker Hub' },
                  { id: 'd', text: 'Admission controller проверяет подпись при деплое' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'SBOM — состав. cosign — подпись. Admission controller — проверка подписи при деплое. «Только публичные образы с Docker Hub» — наоборот, риск: любой может залить подменённый.',
              },
            },
            {
              id: 'cd-l16-s5',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его роль',
                pairs: [
                  { left: 'Syft', right: 'Генерация SBOM (состав образа)' },
                  { left: 'cosign', right: 'Подпись образа и проверка подписи' },
                  { left: 'Kyverno', right: 'Admission controller: блокирует неподписанные образы' },
                  { left: 'SLSA', right: 'Уровни гарантии происхождения артефакта' },
                ],
                explanation: 'Syft — SBOM. cosign — подпись. Kyverno — проверка при деплое. SLSA — уровни гарантии (1–4). Все четыре — строительные блоки supply-chain security.',
              },
            },
          ],
        },
        {
          id: 'cd-l17',
          title: 'Secrets в CI: Vault, OIDC, sealed-secrets',
          minutes: 35,
          steps: [
            {
              id: 'cd-l17-s1',
              title: 'Проблема хранения секретов',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitHub Secrets, GitLab Variables — удобны, но это «секреты в облаке». Для enterprise нужен свой control plane: ротация, аудит, разграничение по проектам. Плюс — не все секреты в CI: часть нужна приложениям в рантайме (БД, API-ключи).' },
                {
                  type: 'table',
                  caption: 'Пять подходов',
                  head: ['Подход', 'Где живут', 'Когда'],
                  rows: [
                    ['CI secrets', 'GitHub/GitLab', 'Простые проекты, стартапы'],
                    ['Vault', 'Отдельный сервис', 'Enterprise: аудит, ротация, multi-tenancy'],
                    ['OIDC', 'Нет хранения', 'GitHub Actions → AWS/GCP/Azure без долгих ключей'],
                    ['sealed-secrets', 'Git (зашифровано)', 'K8s-манифесты в GitOps-репо'],
                    ['SOPS', 'Git (зашифровано)', 'Любые YAML, не только K8s'],
                  ],
                },
              ],
            },
            {
              id: 'cd-l17-s2',
              title: 'OIDC: краткоживущие креды',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'Классика: положить AWS_ACCESS_KEY_ID в GitHub Secrets. Плохо: ключ живёт годами, утечёт — catastrophe. OIDC: GitHub Actions генерирует JWT на время job-а, AWS его проверяет и выдаёт временные креды на 1 час. Нет ключей — нечего красть.' },
                {
                  type: 'mermaid',
                  caption: 'OIDC: GitHub Actions → AWS',
                  code: `sequenceDiagram
                    participant Job as GitHub Job
                    participant GH as GitHub<br/>(OIDC issuer)
                    participant AWS as AWS STS
                    participant S3 as S3

                    Job->>GH: запрос JWT
                    GH-->>Job: JWT (подписан GitHub, 5 мин)
                    Job->>AWS: AssumeRoleWithWebIdentity(JWT)
                    AWS->>GH: проверка подписи JWT
                    AWS-->>Job: временные креды (1 час)
                    Job->>S3: upload (с временными кредами)`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'GitHub Actions с OIDC в AWS',
                  code: `permissions:
  id-token: write   # обязательно для OIDC
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789:role/GitHubDeploy
      aws-region: eu-west-1
    # Никаких AWS_ACCESS_KEY_ID в secrets!`,
                },
                { type: 'note', text: 'На собеседовании: «Как безопасно передать AWS-креды в CI?» — правильный ответ «OIDC, без хранения ключей». Плохой — «положить в GitHub Secrets, они же шифрованы».' },
              ],
            },
            {
              id: 'cd-l17-s3',
              title: 'sealed-secrets и SOPS',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'GitOps требует, чтобы всё было в Git. Но пароли в Git — нельзя. Компромисс: зашифровать секрет локально, положить в Git, а в кластере — оператор, который расшифровывает и создаёт обычный Secret.' },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'sealed-secrets: зашифровать Secret',
                  code: `# 1. Установить controller в кластер
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.27.0/controller.yaml

# 2. Зашифровать Secret публичным ключом кластера
kubeseal --format yaml < my-secret.yaml > my-sealed-secret.yaml

# 3. Коммитим my-sealed-secret.yaml в Git — безопасно
# 4. Controller в кластере расшифрует и создаст обычный Secret`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'SOPS: зашифрованные значения в YAML',
                  code: `# Исходный манифест
apiVersion: v1
kind: Secret
metadata:
  name: db
stringData:
  password: supersecret    # ← будет зашифровано

# После sops -e:
apiVersion: v1
kind: Secret
metadata:
  name: db
stringData:
  password: ENC[AES256_GCM,data:...,iv:...,tag:...,type:str]`,
                },
                {
                  type: 'list',
                  items: [
                    'sealed-secrets — K8s-only, привязан к кластеру',
                    'SOPS — любые файлы, ключи в AWS KMS / GCP KMS / age',
                    'Оба — GitOps-friendly: зашифрованное лежит в Git',
                    'Ключ расшифровки НЕ в Git — в кластере / KMS',
                  ],
                },
              ],
            },
            {
              id: 'cd-l17-s4',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему OIDC безопаснее хранения AWS-ключей в GitHub Secrets?',
                options: [
                  { id: 'a', text: 'OIDC быстрее' },
                  { id: 'b', text: 'OIDC выдаёт временные креды (1 час), а не долгоживущий ключ — утечка ограничена' },
                  { id: 'c', text: 'GitHub Secrets не шифрует' },
                  { id: 'd', text: 'OIDC не требует интернета' },
                ],
                correct: ['b'],
                explanation: 'Ключ в GitHub Secrets живёт годами: утёк — catastrophe. OIDC: JWT на 5 минут → временные креды на 1 час. Если утекут — истекут через час.',
              },
            },
            {
              id: 'cd-l17-s5',
              title: 'Проверь себя: инструменты',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его особенность',
                pairs: [
                  { left: 'Vault', right: 'Отдельный сервис: аудит, ротация, multi-tenancy' },
                  { left: 'OIDC', right: 'Временные креды без хранения ключей' },
                  { left: 'sealed-secrets', right: 'Зашифрованные Secret в Git, расшифровка в кластере' },
                  { left: 'SOPS', right: 'Любые YAML с зашифрованными значениями' },
                ],
                explanation: 'Vault — enterprise control plane. OIDC — «секреты без секретов». sealed-secrets — K8s-only GitOps. SOPS — универсально для любых YAML. Выбор — по задаче: CI → OIDC, K8s-манифесты в Git → sealed-secrets/SOPS, enterprise → Vault.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m4 — Observability пайплайнов
    // ─────────────────────────────────────────────
    {
      id: 'cd-g-m4',
      title: 'Observability пайплайнов',
      lessons: [
        {
          id: 'cd-l19',
          title: 'DORA-метрики и мониторинг пайплайнов',
          minutes: 30,
          steps: [
            {
              id: 'cd-l19-s1',
              title: 'Четыре метрики DORA',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'DORA (DevOps Research and Assessment) — стандарт измерения эффективности доставки. Четыре метрики, которые предсказывают успех IT-организации лучше, чем что-либо ещё.' },
                {
                  type: 'mermaid',
                  caption: 'DORA: скорость + стабильность',
                  code: `graph LR
                    DF["Deployment Frequency<br/>↑ элита: по требованию"] --> Perf["DORA:<br/>скорость + стабильность"]
                    LT["Lead Time for Changes<br/>↓ элита: менее 1 дня"] --> Perf
                    CFR["Change Failure Rate<br/>↓ элита: около 5%"] --> Perf
                    MTTR["Failed Deployment Recovery<br/>↓ элита: менее 1 часа"] --> Perf`,
                },
                {
                  type: 'table',
                  caption: 'Пороги (DORA 2024)',
                  head: ['Метрика', 'Элита', 'High', 'Medium'],
                  rows: [
                    ['Deployment Frequency', 'По требованию', 'От 1/день до 1/неделя', '1/неделя – 1/месяц'],
                    ['Lead Time for Changes', '< 1 дня', '1 день – 1 неделя', '1 неделя – 1 месяц'],
                    ['Change Failure Rate', '~5%', '~10%', '~15%'],
                    ['Failed Deployment Recovery', '< 1 часа', '< 1 дня', '< 1 недели'],
                  ],
                },
                { type: 'note', text: '«Элита» — не «все должны быть тут». Но тренд важен: DF растёт, LT падает, CFR падает, MTTR падает — команда движется в правильном направлении.' },
              ],
            },
            {
              id: 'cd-l19-s2',
              title: 'Как измерять и что улучшать',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Инструменты',
                  head: ['Инструмент', 'Что даёт'],
                  rows: [
                    ['GitHub Insights', 'Встроенные метрики репо: PR frequency, lead time, review time'],
                    ['LinearB', 'DORA-дашборд из GitHub/GitLab/Jira'],
                    ['Sleuth', 'DORA + deploy tracking'],
                    ['Four Keys (Google)', 'Open-source сбор DORA из GitHub/GitLab'],
                    ['Grafana + Prometheus', 'Кастомные метрики (deploy count, MTTR)'],
                  ],
                },
                { type: 'p', text: 'Что улучшать по метрикам:' },
                {
                  type: 'list',
                  items: [
                    'DF низкая → уменьшить PR size, автоматизировать деплой, feature flags',
                    'LT высокий → CI дольше 15 мин? Ручные approve? Медленные ревью?',
                    'CFR высокий → слабые автотесты, нет canary, ручные деплои',
                    'MTTR высокий → нет rollback, нет алертов, нет runbook',
                  ],
                },
                { type: 'note', text: 'DORA измеряет процесс, а не людей. Метрики — для улучшения, а не для рейтинга команд. «Наказать за высокий CFR» = «скрыть деплои» — так не работает.' },
              ],
            },
            {
              id: 'cd-l19-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Change Failure Rate 30%, Deployment Frequency падает. Какая первая гипотеза?',
                options: [
                  { id: 'a', text: 'Нанять больше QA' },
                  { id: 'b', text: 'Проблемы в CI/CD: слабые автотесты, нет rollback, ручные деплои' },
                  { id: 'c', text: 'Купить другой облачный провайдер' },
                  { id: 'd', text: 'Уволить разработчиков' },
                ],
                correct: ['b'],
                explanation: 'Высокий CFR + падающая DF = «страшно релизить». Причины: нет автотестов на регресс, нет feature flags, rollback руками. Нанимать QA — лечить симптом. Senior смотрит на процесс.',
              },
            },
            {
              id: 'cd-l19-s4',
              title: 'DORA и SRE: как связаны',
              type: 'theory',
              blocks: [
                { type: 'p', text: 'DORA измеряет «как быстро и стабильно мы доставляем». SRE (Site Reliability Engineering) — «как обеспечить надёжность». Они дополняют друг друга: DORA — про процесс, SRE — про результат для пользователя.' },
                {
                  type: 'table',
                  caption: 'DORA vs SRE',
                  head: ['Аспект', 'DORA', 'SRE'],
                  rows: [
                    ['Фокус', 'Процесс доставки (CI/CD)', 'Надёжность сервиса (SLO, SLI, SLA)'],
                    ['Метрики', 'DF, LT, CFR, MTTR', 'SLO (availability, latency), error budget'],
                    ['Цель', 'Быстрее и стабильнее доставлять', 'Держать надёжность на заданном уровне'],
                    ['Кто', 'Вся команда разработки', 'SRE-команда или DevOps-инженеры'],
                    ['Связь', 'Высокий CFR → SLO падает → бюджет сгорает', 'SLO задаёт «сколько можно ломать»'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'SLO (Service Level Objective) — «99.9% доступности»',
                    'Error budget — «сколько можно ломать» = 100% − SLO',
                    'Если error budget сгорает — замораживаем релизы, чиним надёжность',
                    'DORA-метрики показывают, почему бюджет сгорает',
                    'DORA + SRE — полная картина: процесс + результат',
                  ],
                },
                { type: 'note', text: 'На собеседовании senior DevOps/SRE: «как связаны DORA и SLO?» — «DORA — процесс доставки; SLO — результат. Высокий CFR → SLO падает → error budget сгорает → заморозка релизов». Это показывает, что вы понимаете всю картину, а не только «деплой быстрее».' },
              ],
            },
            {
              id: 'cd-l19-s5',
              title: 'Проверь себя: SLO',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте метрику и её назначение',
                pairs: [
                  { left: 'Deployment Frequency', right: 'Как часто деплоим в прод' },
                  { left: 'Lead Time for Changes', right: 'Время от коммита до прода' },
                  { left: 'Change Failure Rate', right: 'Доля деплоев, вызвавших сбой' },
                  { left: 'SLO (error budget)', right: 'Сколько можно ломать до заморозки релизов' },
                ],
                explanation: 'DF, LT, CFR — DORA-метрики процесса. SLO/error budget — SRE-метрика результата. Вместе дают полную картину: «доставляем быстро, ломаем редко, держим надёжность». На собеседовании senior это ключевые понятия.',
              },
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // m5 — Практикум
    // ─────────────────────────────────────────────
    {
      id: 'cd-g-m5',
      title: 'Практикум',
      lessons: [
        {
          id: 'cd-l20',
          title: 'Практика: GitOps, supply chain, secrets',
          minutes: 35,
          steps: [
            {
              id: 'cd-l20-s1',
              title: 'Стратегии деплоя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое canary deployment?',
                options: [
                  { id: 'a', text: 'Полная замена версии сразу' },
                  { id: 'b', text: 'Постепенная раскатка: 5% → 25% → 100% трафика с проверкой метрик' },
                  { id: 'c', text: 'Два окружения с переключением' },
                  { id: 'd', text: 'Откат после релиза' },
                ],
                correct: ['b'],
                explanation: 'Canary — постепенная раскатка с метриками. Blue-green — два окружения. Rolling — стандарт K8s. Полная замена — это не canary.',
              },
            },
            {
              id: 'cd-l20-s2',
              title: 'Kill switch',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как называется feature flag, который выключает фичу при инциденте за секунды и живёт в проде навсегда? (два слова через дефис)',
                accepted: ['kill-switch', 'kill switch', 'kill_switch'],
                placeholder: 'два слова',
                hint: 'kill + переключатель',
                explanation: 'Kill switch — страховка от инцидентов. Не удаляется после раската, в отличие от release toggle.',
              },
            },
            {
              id: 'cd-l20-s3',
              title: 'Sync loop в ArgoCD',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте шаги sync loop ArgoCD по порядку',
                items: ['ArgoCD тянет Git', 'Сравнивает желаемое и фактическое', 'Если есть diff — apply в кластер', 'Обновляет статус Synced'],
                correct: ['ArgoCD тянет Git', 'Сравнивает желаемое и фактическое', 'Если есть diff — apply в кластер', 'Обновляет статус Synced'],
                explanation: 'Pull → diff → apply (если есть расхождение) → статус. Каждые 3 минуты. Если diff нет — no-op, статус Synced.',
              },
            },
            {
              id: 'cd-l20-s4',
              title: 'Синтаксис ArgoCD',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните поле, которое возвращает кластер к Git при ручных правках',
                text: 'syncPolicy:\n  automated:\n    prune: true\n    ____: true',
                blanks: [
                  { accepted: ['selfHeal'], hint: 'self + лечить' },
                ],
                explanation: 'selfHeal: true — «drift correction»: если кто-то руками поправил кластер, ArgoCD через 3 минуты вернёт как в Git.',
              },
            },
            {
              id: 'cd-l20-s5',
              title: 'Flux vs ArgoCD',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте инструмент и его особенность',
                pairs: [
                  { left: 'ArgoCD', right: 'Application CRD + богатый UI' },
                  { left: 'Flux', right: 'GitRepository + Kustomization + HelmRelease' },
                  { left: 'Both', right: 'CNCF graduated, pull-based GitOps' },
                  { left: 'Flux ImagePolicy', right: 'Автоматическое обновление образов' },
                ],
                explanation: 'ArgoCD — единый Application + UI. Flux — набор операторов (GitRepository, Kustomization, HelmRelease). Оба CNCF graduated.',
              },
            },
            {
              id: 'cd-l20-s6',
              title: 'Уровни SLSA',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько уровней в SLSA (Supply-chain Levels for Software Artifacts)?',
                correct: 4,
                explanation: 'SLSA 1–4. 1 — есть provenance, 2 — защищённый раннер, 3 — провенанс нельзя подделать, 4 — reproducible builds. Начинают с 1–2.',
              },
            },
            {
              id: 'cd-l20-s7',
              title: 'Подпись и SBOM',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие меры защищают supply chain?',
                options: [
                  { id: 'a', text: 'Подпись образа через cosign' },
                  { id: 'b', text: 'SBOM — состав образа' },
                  { id: 'c', text: 'Использовать только latest-теги' },
                  { id: 'd', text: 'Admission controller (Kyverno) проверяет подпись при деплое' },
                ],
                correct: ['a', 'b', 'd'],
                explanation: 'Подпись, SBOM и admission controller — три уровня. latest-теги — наоборот, риск: не знаешь, что запустится.',
              },
            },
            {
              id: 'cd-l20-s8',
              title: 'OIDC',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему OIDC безопаснее хранения AWS-ключей в GitHub Secrets?',
                options: [
                  { id: 'a', text: 'OIDC быстрее' },
                  { id: 'b', text: 'OIDC выдаёт временные креды (1 час), утечка ограничена по времени' },
                  { id: 'c', text: 'GitHub Secrets не шифрует' },
                  { id: 'd', text: 'OIDC не требует интернета' },
                ],
                correct: ['b'],
                explanation: 'Долгоживущий ключ утёк — catastrophe на годы. OIDC: JWT на 5 минут → креды на час. Утекли — истекут.',
              },
            },
            {
              id: 'cd-l20-s9',
              title: 'DORA-метрика',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая DORA-метрика показывает долю деплоев, вызвавших сбой? (три слова или аббревиатура)',
                accepted: ['Change Failure Rate', 'CFR', 'change failure rate'],
                placeholder: 'название метрики',
                hint: 'Change + Failure + Rate',
                explanation: 'Change Failure Rate (CFR) — доля деплоев, после которых пришлось откатывать или чинить. Элита — ~5%, high — ~10%.',
              },
            },
            {
              id: 'cd-l20-s10',
              title: 'YAML для Kyverno',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'Напишите ClusterPolicy для Kyverno: разрешать только подписанные образы из `ghcr.io/myorg/*`. Минимум — imageReferences и verifyImages.',
                starterCode: 'apiVersion: kyverno.io/v1\nkind: ClusterPolicy\n',
                mustInclude: [
                  { pattern: 'verifyImages', message: 'Нужна секция verifyImages' },
                  { pattern: 'ghcr\\.io/myorg', message: 'Нужен imageReferences с ghcr.io/myorg/*' },
                ],
                explanation: 'apiVersion: kyverno.io/v1\nkind: ClusterPolicy\nmetadata:\n  name: verify-signature\nspec:\n  validationFailureAction: Enforce\n  rules:\n    - name: check\n      match:\n        any:\n          - resources: { kinds: [Pod] }\n      verifyImages:\n        - imageReferences:\n            - "ghcr.io/myorg/*"\n          attestors:\n            - entries:\n                - keyless:\n                    issuer: "https://token.actions.githubusercontent.com"',
              },
            },
          ],
        },
      ],
    },
  ],
};