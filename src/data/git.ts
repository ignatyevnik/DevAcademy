import type { Course } from './types';

export const gitCourse: Course = {
  slug: 'git-basics',
  title: 'Git и командная работа',
  subtitle: 'Версионирование, ветки, PR, хуки, bisect, submodules и модели ветвления',
  description:
    'Курс для тех, кто хочет уверенно работать с Git в команде. Разберём три состояния, ветки, слияния и конфликты, удалённые репозитории и pull request, а также продвинутые приёмы: rebase, reset, revert, stash, reflog, git hooks, worktree, bisect, signing, submodules/subtree и модели ветвления. Всё на конкретных примерах — от первого commit до спасения потерянных коммитов.',
  level: 'Средний',
  tags: ['Git', 'VCS', 'Командная работа'],
  accent: '#f05032',
  icon: 'git',
  outcomes: [
    'Понимать, что такое commit, ветка и три состояния файлов',
    'Работать с локальным репозиторием: init, add, commit, log',
    'Создавать ветки, сливать изменения, разрешать конфликты',
    'Работать с удалённым репозиторием и pull request',
    'Использовать rebase, reset, revert и reflog осознанно',
    'Автоматизировать проверки через git hooks (pre-commit, commit-msg, pre-push)',
    'Применять git worktree, bisect и signing в ежедневной работе',
    'Работать с вложенными репозиториями (submodules, subtree)',
    'Выбирать модель ветвления: git flow, trunk-based, GitHub flow',
  ],
  requirements: ['Уверенная работа в командной строке', 'Установленный Git (git-scm.com)'],
  modules: [
    // ─────────────────────────────────────────────
    // m1 — Основы Git
    // ─────────────────────────────────────────────
    {
      id: 'git-m1',
      title: 'Основы Git',
      lessons: [
        {
          id: 'git-l1',
          title: 'Зачем Git и как он думает',
          minutes: 20,
          steps: [
            {
              id: 'git-l1-s1',
              title: 'Снимки, а не изменения',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Git — это распределённая система контроля версий. Каждый commit в Git — это снимок (snapshot) всего проекта на момент времени, а не набор изменений (diff). Это важное отличие от SVN и Mercurial: Git «фотографирует» всё состояние, а не запоминает «что изменилось».',
                },
                {
                  type: 'p',
                  text: 'Каждый commit имеет уникальный хэш — SHA-1 (или SHA-256 в новых версиях), например `a3f4d2e`. По хэшу можно однозначно найти commit в любом репозитории мира. Это основа для веток, слияний и откатов.',
                },
                {
                  type: 'note',
                  text: 'Git — распределённый: у каждого разработчика полная копия истории. Нет «главного сервера» в архитектурном смысле — есть договорённость, что такой-то репозиторий на GitHub считается основным. Даже если GitHub упадёт, вся история у вас локально.',
                },
              ],
            },
            {
              id: 'git-l1-s2',
              title: 'Три состояния файлов',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Git отслеживает файлы в трёх «местах». Понимание этой модели — половина успеха в работе с Git.',
                },
                {
                  type: 'table',
                  caption: 'Три состояния',
                  head: ['Состояние', 'Что это', 'Как попасть'],
                  rows: [
                    ['Working directory', 'Ваши файлы на диске', 'Редактируете в редакторе'],
                    ['Staging area (index)', 'Подготовленные к коммиту изменения', 'git add'],
                    ['Repository', 'История commit-ов', 'git commit'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Жизненный цикл изменения',
                  code: `# 1. Рабочая директория — изменили файл\necho "print('hello')" > app.py\n\n# 2. Staging — подготовили к коммиту\ngit add app.py\n\n# 3. Repository — зафиксировали\ngit commit -m "Add hello world"\n\n# Посмотреть, что где: git status покажет все три состояния`,
                },
                {
                  type: 'note',
                  text: 'Зачем staging? Чтобы коммитить не «всё подряд», а осмысленные куски. Изменили два файла по разным задачам — добавили один, закоммитили, потом второй. Атомарные коммиты проще ревьюить и откатывать.',
                },
              ],
            },
            {
              id: 'git-l1-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое commit в Git?',
                options: [
                  { id: 'a', text: 'Набор изменений (diff) относительно предыдущей версии' },
                  { id: 'b', text: 'Снимок всего проекта на момент времени с уникальным хэшем' },
                  { id: 'c', text: 'Копия удалённого репозитория' },
                  { id: 'd', text: 'Резервная копия базы данных' },
                ],
                correct: ['b'],
                explanation:
                  'Git хранит снимки (snapshot), а не diff-ы. Каждый commit — полное состояние проекта с уникальным SHA-хэшем. Это позволяет мгновенно переключаться на любую версию.',
              },
            },
          ],
        },
        {
          id: 'git-l2',
          title: 'Первый репозиторий',
          minutes: 25,
          steps: [
            {
              id: 'git-l2-s1',
              title: 'init, add, commit, log',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Создание репозитория с нуля',
                  code: `# Инициализация — создаёт папку .git в текущей директории\ngit init\n\n# Настройка автора (один раз на машину)\ngit config --global user.name "Анна Иванова"\ngit config --global user.email "anna@example.com"\n\n# Проверить, что происходит\ngit status\n\n# Добавить все файлы в staging\ngit add .\n\n# Зафиксировать\ngit commit -m "Initial commit"\n\n# Посмотреть историю\ngit log\ngit log --oneline --graph`,
                },
                {
                  type: 'list',
                  items: [
                    'git init — создать репозиторий в текущей папке',
                    'git add <file> — добавить файл в staging, git add . — все',
                    'git commit -m "..." — зафиксировать staging с сообщением',
                    'git log — история commit-ов, --oneline короче, --graph — ветки',
                    'git status — что в каком состоянии прямо сейчас',
                  ],
                },
                {
                  type: 'note',
                  text: 'Сообщение коммита — важно. Плохо: «fix», «update», «WIP». Хорошо: «Fix login redirect after password reset». Первая строка — до 50–72 символов, повелительное наклонение: «Add», «Fix», «Remove», а не «Added».',
                },
              ],
            },
            {
              id: 'git-l2-s2',
              title: 'Что не коммитить: .gitignore',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Не всё, что лежит в папке, надо версионировать. Секреты, зависимости, артефакты сборки, локальные настройки — всё это в `.gitignore`.',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: '.gitignore',
                  code: `# Зависимости\nnode_modules/\nvenv/\n__pycache__/\n\n# Артефакты сборки\ndist/\nbuild/\n*.pyc\n\n# Локальные настройки и секреты\n.env\n.env.local\n*.log\n\n# IDE\n.vscode/\n.idea/\n.DS_Store`,
                },
                {
                  type: 'note',
                  text: 'Если файл уже закоммичен, добавление в .gitignore его не уберёт. Нужно: git rm --cached <file>, затем git commit. .gitignore не «удаляет» — только перестаёт отслеживать новые изменения.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Убрать файл из-под слежки, оставив на диске',
                  code: 'git rm --cached .env\ngit commit -m "Stop tracking .env"',
                },
              ],
            },
            {
              id: 'git-l2-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда покажет состояние файлов: что в staging, что изменено, что не отслеживается?',
                accepted: ['git status', 'status'],
                placeholder: 'git ...',
                hint: 'Короткая команда из двух слов',
                explanation:
                  'git status — главный инструмент «где я и что происходит». Запускайте его после каждого add/commit, если не уверены. Привычка проверять status — половина навыка работы с Git.',
              },
            },
          ],
        },
        {
          id: 'git-l3',
          title: 'Проверь себя: основы',
          minutes: 10,
          steps: [
            {
              id: 'git-l3-s1',
              title: 'Три состояния',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте состояние и команду, которая переводит в него',
                pairs: [
                  { left: 'Working directory', right: 'Редактирование в файле' },
                  { left: 'Staging area', right: 'git add' },
                  { left: 'Repository', right: 'git commit' },
                  { left: 'Удалённый репозиторий', right: 'git push' },
                ],
                explanation:
                  'Классический поток: изменили → add → commit → push. Каждый шаг явный, можно остановиться и посмотреть, что получилось.',
              },
            },
            {
              id: 'git-l3-s2',
              title: 'Хорошие коммиты',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие сообщения коммитов считаются хорошими?',
                options: [
                  { id: 'a', text: 'Fix login redirect after password reset' },
                  { id: 'b', text: 'fix' },
                  { id: 'c', text: 'Add validation for empty email field' },
                  { id: 'd', text: 'WIP' },
                ],
                correct: ['a', 'c'],
                explanation:
                  '«Fix login redirect after password reset» и «Add validation for empty email field» — понятны без контекста, повелительное наклонение, до 72 символов. «fix» и «WIP» — бесполезны: через месяц вы сами не вспомните, что это.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m2 — Ветки и команда
    // ─────────────────────────────────────────────
    {
      id: 'git-m2',
      title: 'Ветки и команда',
      lessons: [
        {
          id: 'git-l4',
          title: 'Ветки: branch, switch, merge',
          minutes: 25,
          steps: [
            {
              id: 'git-l4-s1',
              title: 'Что такое ветка',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Ветка в Git — это лёгкий указатель на commit. Создать ветку = записать в файл `.git/refs/heads/<name>` один хэш. Поэтому ветки в Git мгновенные, в отличие от SVN, где копирование — это реальное копирование файлов.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Работа с ветками',
                  code: `# Создать ветку (но не переключаться)\ngit branch feature/login\n\n# Создать и сразу переключиться\ngit switch -c feature/login\n# (или старое: git checkout -b feature/login)\n\n# Посмотреть все ветки\ngit branch\n\n# Переключиться на существующую\ngit switch main\n\n# Слить ветку feature/login в текущую (main)\ngit switch main\ngit merge feature/login\n\n# Удалить слитую ветку\ngit branch -d feature/login`,
                },
                {
                  type: 'note',
                  text: 'git switch (2019) — новая команда специально для переключения веток. Старая git checkout делает то же, но ещё и «восстанавливает файлы» — путаница. В новом коде используйте switch, а checkout оставьте для отката файлов.',
                },
              ],
            },
            {
              id: 'git-l4-s2',
              title: 'Fast-forward и three-way merge',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Когда вы сливаете ветку, Git использует один из двух алгоритмов. Понимать разницу важно: от неё зависит форма истории и поведение при конфликтах.',
                },
                {
                  type: 'table',
                  caption: 'Два вида merge',
                  head: ['Тип', 'Когда', 'Что происходит'],
                  rows: [
                    ['Fast-forward', 'main не менялся с момента создания ветки', 'Указатель main просто сдвигается на новый commit'],
                    ['Three-way merge', 'main и ветка разошлись', 'Создаётся новый merge-commit с двумя родителями'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Fast-forward vs three-way',
                  code: `Fast-forward:\n  main:    A ← B\n                 ↖\n  feature:        C ← D\n\n  После merge: main: A ← B ← C ← D (указатель сдвинулся)\n\nThree-way merge:\n  main:    A ← B ← E\n                 ↖\n  feature:        C ← D\n\n  После merge: создаётся M (merge-commit) с родителями E и D\n  main:    A ← B ← E ← M\n                 ↖    ↙\n                  C ← D`,
                },
                {
                  type: 'mermaid',
                  caption: 'Fast-forward merge',
                  code: `gitGraph
                    commit id: "A"
                    commit id: "B"
                    branch feature
                    checkout feature
                    commit id: "C"
                    commit id: "D"
                    checkout main
                    merge feature`,
                },
                {
                  type: 'note',
                  text: 'Fast-forward «чище» — линейная история. Three-way merge сохраняет факт ветвления, но добавляет «шум» в граф. git merge --no-ff заставляет всегда создавать merge-commit, даже если можно fast-forward — так делают в некоторых командах, чтобы видеть, где была ветка.',
                },
              ],
            },
            {
              id: 'git-l4-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Когда Git делает fast-forward merge?',
                options: [
                  { id: 'a', text: 'Всегда, когда сливаете ветки' },
                  { id: 'b', text: 'Когда main не менялся с момента создания ветки — можно просто сдвинуть указатель' },
                  { id: 'c', text: 'Только если ветка создана в тот же день' },
                  { id: 'd', text: 'Только при rebase' },
                ],
                correct: ['b'],
                explanation:
                  'Fast-forward возможен, когда целевая ветка не ушла вперёд — история линейна, и Git просто переставляет указатель. Если обе ветки менялись — нужен three-way merge с новым merge-commit.',
              },
            },
          ],
        },
        {
          id: 'git-l5',
          title: 'Конфликты и как их решать',
          minutes: 25,
          steps: [
            {
              id: 'git-l5-s1',
              title: 'Что такое конфликт',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Конфликт возникает, когда два человека изменили одни и те же строки в одном файле. Git не может решить, чью версию оставить — и просит вас. Это нормальный рабочий момент, а не «что-то сломалось».',
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'Как выглядит конфликт в файле',
                  code: `<<<<<<< HEAD\nprint("Hello, Anna")\n=======\nprint("Hi, Anna")\n>>>>>>> feature/greeting\n\n# <<<<<<< HEAD — текущая ветка (куда сливаем)\n# ======= — разделитель\n# >>>>>>> feature/greeting — сливаемая ветка\n# Надо оставить одну версию (или объединить) и удалить все маркеры`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как Git сообщает о конфликте',
                  code: `git merge feature/greeting\n# Auto-merging app.py\n# CONFLICT (content): Merge conflict in app.py\n# Automatic merge failed; fix conflicts and then commit the result.\n\ngit status\n# both modified:   app.py    ← «both» — конфликт`,
                },
              ],
            },
            {
              id: 'git-l5-s2',
              title: 'Разрешение конфликта',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Пошагово',
                  code: `# 1. Открыть файл и найти маркеры <<<<<<<\n# 2. Решить, что оставить — обычно объединить оба изменения\n# 3. Удалить маркеры конфликта\n# 4. Добавить файл в staging — это «сигнал», что конфликт решён\ngit add app.py\n\n# 5. Завершить merge\ngit commit\n\n# Или отменить merge совсем\ngit merge --abort`,
                },
                {
                  type: 'note',
                  text: 'git merge --abort — «кнопка отмены». Если запутались в конфликтах и хотите начать заново — это самый безопасный способ. В отличие от reset, --abort не трогает вашу работу до merge.',
                },
                {
                  type: 'list',
                  items: [
                    'Не пугайтесь маркеров — их надо «раскрасить» руками',
                    'Обычно оставляют объединение обоих вариантов, а не один',
                    'git add после правки — это «я решил конфликт»',
                    'git merge --abort — если хотите отменить всё и вернуться',
                    'Конфликты в бинарных файлах (изображения) — придётся выбрать одну версию целиком',
                  ],
                },
              ],
            },
            {
              id: 'git-l5-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'После разрешения конфликта в файле — что сделать, чтобы Git понял, что конфликт решён?',
                options: [
                  { id: 'a', text: 'Просто сохранить файл' },
                  { id: 'b', text: 'git add <file> — добавить в staging, затем git commit' },
                  { id: 'c', text: 'git push' },
                  { id: 'd', text: 'git merge --continue' },
                ],
                correct: ['b'],
                explanation:
                  'Git понимает, что конфликт решён, когда файл попал в staging (git add). Только после этого git commit завершит merge. Простое сохранение файла Git не видит как решение.',
              },
            },
          ],
        },
        {
          id: 'git-l6',
          title: 'Удалённые репозитории и pull request',
          minutes: 30,
          steps: [
            {
              id: 'git-l6-s1',
              title: 'clone, remote, push, pull, fetch',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: `# Клонировать репозиторий (создаёт папку и .git)\ngit clone https://github.com/user/repo.git\n\n# Посмотреть, откуда тянуть/куда пушить\ngit remote -v\n\n# Добавить ещё один remote (например, upstream)\ngit remote add upstream https://github.com/original/repo.git\n\n# Отправить свои коммиты в origin (main)\ngit push origin main\n\n# Забрать изменения из origin/main и слить в текущую ветку\ngit pull origin main\n\n# Забрать изменения, но НЕ сливать — только показать\ngit fetch origin\ngit log origin/main --oneline -5`,
                },
                {
                  type: 'note',
                  text: 'pull = fetch + merge. Иногда это сюрприз: вы хотели «просто посмотреть», а Git уже слил и создал конфликты. Если хотите сначала посмотреть — git fetch, потом git log origin/main, и только потом git merge или git rebase.',
                },
              ],
            },
            {
              id: 'git-l6-s2',
              title: 'Fork и Pull Request',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Pull Request (PR, он же Merge Request в GitLab) — это предложение влить вашу ветку в main. Главный инструмент командной работы и код-ревью. На GitHub поток такой:',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Типичный PR-workflow',
                  code: `# 1. Создать ветку от актуальной main\ngit switch main\ngit pull\ngit switch -c feature/add-login\n\n# 2. Работать, коммитить\ngit add .\ngit commit -m "Add login form"\ngit push -u origin feature/add-login\n\n# 3. Открыть PR на GitHub/GitLab\n#    (в браузере: compare & pull request)\n\n# 4. После ревью — merge (через UI или локально)\n#    и удалить ветку\n\n# 5. Подтянуть изменения к себе\ngit switch main\ngit pull`,
                },
                {
                  type: 'list',
                  items: [
                    'Fork — копия чужого репозитория в ваш аккаунт (для open-source)',
                    'Branch — ветка внутри одного репозитория (для своей команды)',
                    'PR — запрос на слияние ветки, с обсуждением и ревью',
                    'Мержит автор PR (или мейнтейнер) — после approve',
                    'После merge ветку удаляют — чтобы не плодить «зомби-ветки»',
                  ],
                },
                {
                  type: 'note',
                  text: 'Хорошая практика: PR не больше 200–400 строк. Большой PR никто не отревьюит качественно — все смотрят «по диагонали». Если задача большая — разбейте на 3 PR по слоям: бэкенд → API → фронтенд.',
                },
              ],
            },
            {
              id: 'git-l6-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Чем git pull отличается от git fetch?',
                options: [
                  { id: 'a', text: 'pull = fetch + merge, сразу сливает изменения' },
                  { id: 'b', text: 'fetch только скачивает, но не меняет вашу рабочую ветку' },
                  { id: 'c', text: 'fetch работает только с GitHub' },
                  { id: 'd', text: 'pull безопаснее, потому что не может создать конфликтов' },
                ],
                correct: ['a', 'b'],
                explanation:
                  'fetch — «посмотреть», ничего не меняя. pull — «забрать и слить», может создать конфликты или неожиданно изменить файлы. Для «сначала посмотреть» — fetch, для «забрать и работать» — pull.',
              },
            },
          ],
        },
        {
          id: 'git-l7',
          title: 'Проверь себя: команда',
          minutes: 10,
          steps: [
            {
              id: 'git-l7-s1',
              title: 'Команды и действия',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и что она делает',
                pairs: [
                  { left: 'git clone', right: 'Скачать репозиторий целиком' },
                  { left: 'git fetch', right: 'Скачать изменения, не сливая' },
                  { left: 'git push', right: 'Отправить коммиты на сервер' },
                  { left: 'git pull', right: 'Скачать и слить в текущую ветку' },
                ],
                explanation:
                  'clone — разово, при первом знакомстве. Дальше — push/pull для синхронизации, fetch — если хотите сначала посмотреть. Это ежедневный набор.',
              },
            },
            {
              id: 'git-l7-s2',
              title: 'PR-workflow',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Какие практики полезны при работе с Pull Request?',
                options: [
                  { id: 'a', text: 'Маленькие PR — до 200–400 строк' },
                  { id: 'b', text: 'Всегда пушить напрямую в main, минуя ветки' },
                  { id: 'c', text: 'Удалять ветку после merge' },
                  { id: 'd', text: 'Добавлять в описание PR контекст: задачу, скриншоты, что проверять ревьюеру' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'Маленькие PR, удаление веток после merge, осмысленное описание — три привычки, которые сильно облегчают жизнь. Прямой push в main (b) — антипаттерн: ломает ревью, CI и историю.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m3 — Продвинутое (rebase, reset, reflog)
    // ─────────────────────────────────────────────
    {
      id: 'git-m3',
      title: 'Продвинутое: rebase, reset, reflog',
      lessons: [
        {
          id: 'git-l8',
          title: 'Rebase vs merge',
          minutes: 25,
          steps: [
            {
              id: 'git-l8-s1',
              title: 'Что делает rebase',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'rebase «пересаживает» ваши commit-ы на новую базу. В отличие от merge, который создаёт merge-commit, rebase переписывает историю: ваши изменения выглядят так, будто вы начали работу с последней версии main. История становится линейной.',
                },
                {
                  type: 'mermaid',
                  caption: 'Three-way merge: появляется merge-commit M',
                  code: `gitGraph
                    commit id: "A"
                    commit id: "B"
                    branch feature
                    checkout feature
                    commit id: "C"
                    commit id: "D"
                    checkout main
                    commit id: "E"
                    merge feature id: "M (merge commit)"`,
                },
                {
                  type: 'code',
                  lang: 'text',
                  caption: 'merge vs rebase',
                  code: `Исходное:\n  main:    A ← B ← E\n                 ↖\n  feature:        C ← D\n\ngit merge main (в feature):\n  main:    A ← B ← E\n                 ↖    ↖\n  feature:        C ← D ← M   (M — merge-commit)\n\ngit rebase main (в feature):\n  main:    A ← B ← E\n                     ↖\n  feature:            C' ← D'  (C', D' — «пересаженные» C, D)`,
                },
                {
                  type: 'note',
                  text: 'Правило золотого ствола: не делайте rebase веток, которые уже кто-то другой использует. rebase переписывает хэши — у коллеги будут «другие коммиты», и следующий pull превратится в хаос. rebase — только для своей локальной ветки.',
                },
              ],
            },
            {
              id: 'git-l8-s2',
              title: 'Когда что',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'merge vs rebase',
                  head: ['Ситуация', 'merge', 'rebase'],
                  rows: [
                    ['Своя ветка, хочу актуальную main', 'Много merge-коммитов', 'Чистая линейная история'],
                    ['Сливаю в main чужой PR', 'Сохраняет факт ветвления', 'Перепишет чужие коммиты — нельзя'],
                    ['Скрыть «WIP» коммиты перед PR', 'Можно, но грязно', 'git rebase -i для squash'],
                    ['Ветка уже запушена и её видят другие', 'Безопасно', 'Сломает коллегам pull'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'git rebase -i: интерактивный rebase',
                  code: `# Переписать последние 3 коммита\ngit rebase -i HEAD~3\n\n# Откроется редактор:\n# pick a3f4d2e Add login form\n# pick b7c8e1d Fix typo\n# pick d9e2f4a WIP\n#\n# pick   — оставить как есть\n# squash — слить с предыдущим (s)\n# reword — изменить сообщение (r)\n# edit   — остановиться для правки (e)\n# drop   — удалить (d)\n# reorder — поменять строки местами`,
                },
                {
                  type: 'note',
                  text: 'Перед PR: rebase -i, чтобы «причесать» историю — 5 WIP-коммитов превратить в 2 осмысленных. Это стандарт в большинстве команд: в main должна попадать чистая история, а не рабочий мусор.',
                },
              ],
            },
            {
              id: 'git-l8-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Почему нельзя делать rebase ветки, которую используют другие?',
                options: [
                  { id: 'a', text: 'rebase работает только с main' },
                  { id: 'b', text: 'rebase переписывает хэши — у коллег «другие коммиты», pull сломается' },
                  { id: 'c', text: 'rebase медленнее merge' },
                  { id: 'd', text: 'rebase удаляет коммиты' },
                ],
                correct: ['b'],
                explanation:
                  'rebase создаёт новые commit-ы с новыми хэшами. Если ветка уже запушена и её видят другие — у них локальные C, D, а у вас C\', D\'. При следующем pull они получат «расхождение истории» и будут разбираться. rebase — только для своих локальных веток.',
              },
            },
          ],
        },
        {
          id: 'git-l9',
          title: 'Отмена: reset, revert, stash, reflog',
          minutes: 30,
          steps: [
            {
              id: 'git-l9-s1',
              title: 'reset и revert',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Два разных «отката»: reset переписывает историю (убирает commit), revert создаёт новый commit, отменяющий изменения. Правило: reset — для локальной истории, revert — для того, что уже запушено.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Три режима reset',
                  code: `# reset --soft — «убрать commit, оставить в staging»\ngit reset --soft HEAD~1\n# Коммит исчез, изменения готовы к новому коммиту\n\n# reset --mixed (по умолчанию) — «убрать commit и staging, оставить в файлах»\ngit reset HEAD~1\n# Коммит исчез, файлы изменены, но не в staging\n\n# reset --hard — «стереть и commit, и staging, и файлы»\ngit reset --hard HEAD~1\n# ОПАСНО: изменения безвозвратно потеряны`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'revert — безопасная отмена запушенного',
                  code: `# Создаёт НОВЫЙ commit, который отменяет изменения предыдущего\ngit revert a3f4d2e\n\n# История сохранилась, ничего не переписано\n# Можно пушить — безопасно`,
                },
                {
                  type: 'mermaid',
                  caption: 'Что использовать для отмены в зависимости от ситуации',
                  code: `graph TD
                    Q{"Что отменить?"} -->|"незакоммиченные<br/>изменения"| Stash["git stash"]
                    Q -->|"локальный commit,<br/>не запушен"| Reset["git reset --soft<br/>или --mixed"]
                    Q -->|"запушенный commit"| Revert["git revert<br/>(новый commit)"]
                    Q -->|"уже сделал<br/>reset --hard"| Reflog["git reflog →<br/>reset --hard &lt;hash&gt;"]
                    Stash --> Done["Готово"]
                    Reset --> Done
                    Revert --> Done
                    Reflog --> Done`,
                },
                {
                  type: 'note',
                  text: 'reset --hard — единственная команда Git, которая реально удаляет работу. Если сделали и поняли, что «не то» — спасает reflog (следующий шаг). revert — стандарт для прода: не переписывает историю, работает для уже запушенных коммитов.',
                },
              ],
            },
            {
              id: 'git-l9-s2',
              title: 'stash и reflog',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'git stash — «отложить в сторону»',
                  code: `# Срочно переключиться на другую ветку, но не хочется коммитить\ngit stash\n# (или git stash push -m "WIP login form")\n\ngit switch main\n# ... поработали ...\n\ngit switch feature/login\ngit stash pop   # вернуть и удалить из stash\ngit stash list  # посмотреть все «отложенные»\ngit stash apply # вернуть, но оставить в stash`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'git reflog — «спасатель»',
                  code: `# Лог всех перемещений HEAD: коммиты, checkout, reset, merge...\ngit reflog\n# a3f4d2e HEAD@{0}: reset: moving to HEAD~1\n# b7c8e1d HEAD@{1}: commit: WIP\n# d9e2f4a HEAD@{2}: commit: Fix typo\n# ...\n\n# «Я сделал reset --hard и потерял коммит!»\ngit reset --hard b7c8e1d\n# Всё вернулось. Git не удаляет коммиты сразу — они висят в reflog 30–90 дней.`,
                },
                {
                  type: 'list',
                  items: [
                    'git stash — «карман» для незакоммиченных изменений',
                    'git stash pop — достать и удалить',
                    'git stash list — что лежит в кармане',
                    'git reflog — история всех перемещений HEAD',
                    'git reflog спасает после reset --hard, неудачного rebase, потери ветки',
                  ],
                },
                {
                  type: 'note',
                  text: 'reflog — главный «спасатель» в Git. Любой коммит, который был хоть раз создан, висит в reflog 30–90 дней. Если потеряли работу — не паникуйте, откройте git reflog. Это отличает Git от «настоящих» файловых систем: тут почти ничего не удаляется навсегда.',
                },
              ],
            },
            {
              id: 'git-l9-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Вы сделали `git reset --hard HEAD~1` и потеряли важный коммит. Что делать?',
                options: [
                  { id: 'a', text: 'git reflog — найти хэш потерянного коммита и вернуться через git reset --hard <hash>' },
                  { id: 'b', text: 'Паниковать — коммит удалён навсегда' },
                  { id: 'c', text: 'git revert HEAD — отменить reset' },
                  { id: 'd', text: 'Проверить, что коммит есть в git reflog и восстановить' },
                ],
                correct: ['a', 'd'],
                explanation:
                  'После reset --hard коммит живёт в reflog 30–90 дней. git reflog покажет все перемещения HEAD, вы найдёте хэш, и git reset --hard <hash> вернёт всё. Это главный приём «спасения» в Git. revert здесь не поможет (он для отмены содержимого, а не reset).',
              },
            },
          ],
        },
        {
          id: 'git-l10',
          title: 'Проверь себя: продвинутое',
          minutes: 10,
          steps: [
            {
              id: 'git-l10-s1',
              title: 'Инструменты отмены',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте ситуацию и инструмент',
                pairs: [
                  { left: 'Срочно переключиться, изменения не готовы', right: 'git stash' },
                  { left: 'Отменить уже запушенный коммит', right: 'git revert' },
                  { left: 'Убрать локальный коммит, оставив файлы', right: 'git reset --soft HEAD~1' },
                  { left: 'Восстановить после reset --hard', right: 'git reflog' },
                ],
                explanation:
                  'stash — «карман». revert — для прода (новый коммит). reset --soft — безопасный локальный откат. reflog — «чёрный ящик», спасает почти всё.',
              },
            },
            {
              id: 'git-l10-s2',
              title: 'Философия Git',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Как называется лог всех перемещений HEAD, который позволяет восстановить «потерянные» коммиты?',
                accepted: ['reflog', 'git reflog'],
                placeholder: 'одно слово',
                hint: 'ref... log',
                explanation:
                  'git reflog — «журнал ссылок». Каждое движение HEAD (commit, reset, checkout, rebase) пишется сюда. Хранится 30–90 дней. Это и есть ответ на «что делать, если потерял работу».',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m4 — Продвинутые инструменты (НОВЫЙ)
    // ─────────────────────────────────────────────
    {
      id: 'git-m4',
      title: 'Продвинутые инструменты',
      lessons: [
        {
          id: 'git-l12',
          title: 'Git hooks: автоматизация перед коммитом',
          minutes: 25,
          steps: [
            {
              id: 'git-l12-s1',
              title: 'Что такое hooks',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Git hooks — скрипты, которые автоматически запускаются на определённые события: перед коммитом, перед пушем, при получении изменений. Они живут в `.git/hooks/` и по умолчанию не версионируются — это важно помнить.',
                },
                {
                  type: 'mermaid',
                  caption: 'Где срабатывают хуки в жизненном цикле коммита',
                  code: `graph LR
                    Edit["Редактирование"] --> Add["git add"]
                    Add --> PreCommit["pre-commit<br/>линтеры"]
                    PreCommit --> CommitMsg["commit-msg<br/>валидация"]
                    CommitMsg --> Commit["git commit"]
                    Commit --> PrePush["pre-push<br/>тесты"]
                    PrePush --> Push["git push"]`,
                },
                {
                  type: 'table',
                  caption: 'Главные хуки',
                  head: ['Хук', 'Когда', 'Типичное применение'],
                  rows: [
                    ['pre-commit', 'Перед созданием коммита', 'Линтеры, форматтеры, проверка секретов'],
                    ['commit-msg', 'После ввода сообщения', 'Валидация формата (Conventional Commits)'],
                    ['pre-push', 'Перед push', 'Тесты, проверка типов'],
                    ['post-merge', 'После merge', 'Установка зависимостей'],
                    ['pre-rebase', 'Перед rebase', 'Защита от rebase запушенных веток'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Ручной pre-commit',
                  code: `# .git/hooks/pre-commit (исполняемый!)\n#!/bin/sh\nset -e\n\n# Запустить линтер на изменённых файлах\necho "Running linter..."\npython -m ruff check .\n\nif [ $? -ne 0 ]; then\n  echo "Lint failed. Commit aborted."\n  exit 1\nfi`,
                },
                {
                  type: 'note',
                  text: 'Проблема .git/hooks/: файлы не коммитятся, значит у коллеги хука не будет. Каждый должен установить вручную. Решение — husky (JS-экосистема) или lefthook (Go, для любого языка).',
                },
              ],
            },
            {
              id: 'git-l12-s2',
              title: 'husky и lefthook: hooks для команды',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'husky — самый популярный способ версионировать хуки в JS-проектах. lefthook — кроссплатформенная альтернатива на Go, работает быстрее и не зависит от Node.js. Оба хранят конфиг в репозитории и устанавливают хуки при `npm install` / `lefthook install`.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'husky (JS-проект)',
                  code: `npm install --save-dev husky\nnpx husky init\n\n# .husky/pre-commit\necho "npx lint-staged" > .husky/pre-commit\n\n# package.json (lint-staged)\n"lint-staged": {\n  "*.{js,ts}": ["eslint --fix", "prettier --write"],\n  "*.py": ["ruff check --fix", "ruff format"]\n}`,
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  caption: 'lefthook (любой проект)',
                  code: `# lefthook.yml\npre-commit:\n  parallel: true\n  commands:\n    ruff:\n      glob: "*.py"\n      run: ruff check --fix {staged_files}\n    mypy:\n      run: mypy src/\n\ncommit-msg:\n  commands:\n    conventional:\n      run: |\n        head -1 {1} | grep -qE '^(feat|fix|docs|chore|refactor|test)(\\(.+\\))?: ' || \\\n        (echo "Сообщение должно быть в формате Conventional Commits" && exit 1)`,
                },
                {
                  type: 'list',
                  items: [
                    'husky — если проект на Node.js (JS/TS, React, Vue)',
                    'lefthook — если проект на Python/Go/любом (нет зависимости от Node)',
                    'pre-commit (Python) — если проект на Python, альтернатива lefthook',
                    'Все три хранят конфиг в репо — установка автоматическая для новых разработчиков',
                    'Hooks можно обойти: git commit --no-verify. Не полагайтесь на них как на единственную защиту',
                  ],
                },
                {
                  type: 'note',
                  text: 'Хук — это «вежливая просьба», а не «жёсткий барьер». Опытный разработчик обойдёт --no-verify. Поэтому критичные проверки (тесты, безопасность) должны дублироваться в CI. Hooks — для быстрой обратной связи, CI — для гарантии.',
                },
              ],
            },
            {
              id: 'git-l12-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Где по умолчанию лежат git hooks и почему их надо версионировать через husky/lefthook?',
                options: [
                  { id: 'a', text: 'В .git/hooks/, но они не попадают в Git — нужен инструмент для шеринга' },
                  { id: 'b', text: 'В корне репозитория, Git их видит' },
                  { id: 'c', text: 'В .github/, GitHub Actions их подхватывает' },
                  { id: 'd', text: 'В отдельном сервисе, Git не при чём' },
                ],
                correct: ['a'],
                explanation:
                  '.git/ не версионируется. Файлы в .git/hooks/ существуют только у вас. husky/lefthook хранят конфиг в репо и устанавливают хуки автоматически — так вся команда получает одинаковые проверки.',
              },
            },
          ],
        },
        {
          id: 'git-l13',
          title: 'Git worktree: несколько рабочих копий',
          minutes: 25,
          steps: [
            {
              id: 'git-l13-s1',
              title: 'Проблема переключения веток',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Сценарий: вы пишете фичу, вдруг срочно нужен hotfix из main. Что делать? git stash — но незакоммиченные изменения в нескольких файлах. git switch main — но тогда надо закрыть редактор, потом вернуться. git worktree решает это: один `.git`, несколько рабочих директорий.',
                },
                {
                  type: 'mermaid',
                  caption: 'Один .git — несколько рабочих директорий',
                  code: `graph LR
                    Git[(".git<br/>(общая история)")]
                    W1["~/myapp<br/>feature/login"] -.-> Git
                    W2["~/myapp-hotfix<br/>main"] -.-> Git`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Два worktree одновременно',
                  code: `# Основная директория: ~/myapp (ветка feature/login)\ncd ~/myapp\n\n# Создать вторую директорию для hotfix\ngit worktree add ../myapp-hotfix main\n\n# Теперь две папки:\n#   ~/myapp           — feature/login (ваша фича)\n#   ~/myapp-hotfix    — main (срочный hotfix)\n\ncd ../myapp-hotfix\n# ... правите hotfix, коммитите, пушите ...\n\ngit worktree remove ../myapp-hotfix`,
                },
                {
                  type: 'list',
                  items: [
                    'Один .git на все worktree — история, ветки, stash общие',
                    'Разные рабочие директории — можно держать несколько веток открытыми',
                    'Не надо stash / switch при переключении контекста',
                    'Идеально для: hotfix во время фичи, review чужого PR, сборка релиза',
                    'git worktree list — показать все worktree',
                    'git worktree remove <path> — удалить',
                  ],
                },
                {
                  type: 'note',
                  text: 'Не путать с clone. git clone — полностью независимый репозиторий (свой .git, своя история). git worktree — тот же .git, общая история. Удаление основного worktree может сломать остальные, удаление вторичного — безопасно.',
                },
              ],
            },
            {
              id: 'git-l13-s2',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем git worktree отличается от git clone?',
                options: [
                  { id: 'a', text: 'Ничем' },
                  { id: 'b', text: 'worktree использует тот же .git (общая история), clone — полностью независимый репозиторий' },
                  { id: 'c', text: 'worktree работает только на macOS' },
                  { id: 'd', text: 'clone быстрее' },
                ],
                correct: ['b'],
                explanation:
                  'worktree — «вторая рабочая директория с общим .git». История, ветки, stash — общие. clone — отдельный репозиторий, независимая история. worktree удобнее для быстрого переключения контекста.',
              },
            },
          ],
        },
        {
          id: 'git-l14',
          title: 'Git bisect: бинарный поиск бага',
          minutes: 30,
          steps: [
            {
              id: 'git-l14-s1',
              title: 'Бинарный поиск по коммитам',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Баг есть в текущей версии, но не было месяц назад. Между ними — 200 коммитов. Вручную искать, какой именно сломал — долго. git bisect делает бинарный поиск: делит историю пополам, спрашивает «тут баг есть?», снова делит. 200 коммитов → 8 итераций (log₂ 200 ≈ 7.6).',
                },
                {
                  type: 'mermaid',
                  caption: 'Бинарный поиск: 200 → 100 → 50 → 25 → 12 → 6 → 3 → 1',
                  code: `graph LR
                    A["200 коммитов"] --> B["100"]
                    B --> C["50"]
                    C --> D["25"]
                    D --> E["12"]
                    E --> F["6"]
                    F --> G["3"]
                    G --> H["1<br/>виновник"]`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Ручной bisect',
                  code: `git bisect start\n\ngit bisect bad              # текущий коммит — плохой (есть баг)\ngit bisect good v1.2.0      # тег/коммит, где бага не было\n\n# Git переключит на середину. Проверяете — есть баг?\ngit bisect good   # или git bisect bad\n\n# ... повторяете, пока Git не скажет:\n# <hash> is the first bad commit\n\ngit bisect reset            # вернуться в исходное состояние`,
                },
                {
                  type: 'note',
                  text: 'После bisect Git покажет первый плохой коммит и его diff. Сразу видно, что сломалось. Это в разы быстрее, чем «git log и листать».',
                },
              ],
            },
            {
              id: 'git-l14-s2',
              title: 'Автоматизация: git bisect run',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Если у вас есть тест, который падает при баге, bisect можно автоматизировать: `git bisect run <скрипт>`. Git сам прогонит скрипт на каждом коммите (exit 0 = good, не 0 = bad) и найдёт виновника без вашего участия.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Автоматический bisect',
                  code: `# test.sh: exit 0 — тест прошёл, exit 1 — упал\ngit bisect start\ngit bisect bad\ngit bisect good v1.2.0\ngit bisect run pytest tests/test_login.py::test_redirect\n\n# Git сам пройдёт log₂(N) итераций\n# В конце: "abc123 is the first bad commit"`,
                },
                {
                  type: 'list',
                  items: [
                    'exit 0 = good (бага нет), exit 125 = skip (пропустить коммит, например, сломанная сборка)',
                    'exit 1-124, 126, 127 = bad (баг есть)',
                    'skip полезен, если на каком-то коммите сборка вообще не работает — не из-за бага',
                    'Находит виновника среди 1000 коммитов за 10 итераций',
                    'Работает с любым тестовым фреймворком: pytest, jest, go test',
                  ],
                },
                {
                  type: 'note',
                  text: 'git bisect — «секретное оружие» senior-разработчика. На собеседовании: «Баг появился где-то за месяц, как найти?» — правильный ответ: «git bisect run с тестом, который воспроизводит баг». «git log и смотреть» — плохой.',
                },
              ],
            },
            {
              id: 'git-l14-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько итераций нужно git bisect, чтобы найти баг среди 1000 коммитов? (log₂ 1000, округлить вверх)',
                correct: 10,
                explanation:
                  'log₂ 1000 ≈ 9.97, округляем до 10. 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1. Десять итераций вместо тысячи проверок вручную.',
              },
            },
          ],
        },
        {
          id: 'git-l15',
          title: 'Подпись коммитов и тегов',
          minutes: 25,
          steps: [
            {
              id: 'git-l15-s1',
              title: 'Зачем подписывать',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Git-коммит содержит имя и email автора, но их можно указать любые: `git commit --author="Linus Torvalds <torvalds@linux.com>"`. Без подписи нельзя доказать, что коммит сделан именно вами. GPG/SSH-подпись привязывает коммит к ключу, который есть только у вас.',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'GPG-подпись',
                  code: `# 1. Сгенерировать GPG-ключ (если ещё нет)\ngpg --full-generate-key\n\n# 2. Узнать ID ключа\ngpg --list-secret-keys --keyid-format=long\n# sec   rsa4096/ABC123DEF456 2025-01-01 [SC]\n#                            ^^^^^^^^^^^^^ — это key ID\n\n# 3. Настроить Git\ngit config --global user.signingkey ABC123DEF456\ngit config --global commit.gpgsign true     # все коммиты подписываются\ngit config --global tag.gpgsign true        # все теги\n\n# 4. Подписать один коммит вручную\ngit commit -S -m "Signed commit"`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'SSH-подпись (проще, Git 2.34+)',
                  code: `# Использует ваш существующий SSH-ключ для GitHub/GitLab\ngit config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true\n\n# Проверка\nssh-keygen -Y sign -n git -f ~/.ssh/id_ed25519 /tmp/file`,
                },
                {
                  type: 'note',
                  text: 'GitHub и GitLab показывают "Verified" у подписанных коммитов. Это защита от подмены авторства: злоумышленник не сможет выдать свой коммит за ваш. В enterprise и open-source часто требуют подписи для мержа в main.',
                },
              ],
            },
            {
              id: 'git-l15-s2',
              title: 'Проверка подписи',
              type: 'theory',
              blocks: [
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'verify-commit и verify-tag',
                  code: `# Проверить подпись коммита\ngit verify-commit a3f4d2e\n\n# Проверить подпись тега\ngit verify-tag v1.4.2\n\n# В git log — показать статус подписи\ngit log --show-signature -1`,
                },
                {
                  type: 'list',
                  items: [
                    'Подпись гарантирует: коммит создан владельцем ключа',
                    'Подпись НЕ гарантирует: что код хороший, что автор — хороший человек',
                    'GPG — стандарт, но сложная настройка (gpg-agent, keyring)',
                    'SSH-подпись — проще для тех, кто уже настроил SSH к GitHub',
                    'Подпись коммита ≠ подпись артефакта (cosign для Docker-образов — отдельная история)',
                  ],
                },
              ],
            },
            {
              id: 'git-l15-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что даёт подпись коммита? (выберите все подходящие)',
                options: [
                  { id: 'a', text: 'Доказывает, что коммит создан владельцем ключа' },
                  { id: 'b', text: 'Гарантирует, что код в коммите корректный' },
                  { id: 'c', text: 'Защищает от подмены авторства' },
                  { id: 'd', text: 'Позволяет GitHub/GitLab показать "Verified"' },
                ],
                correct: ['a', 'c', 'd'],
                explanation:
                  'Подпись — про авторство и целостность коммита. Не про качество кода (b). Если код плохой, но коммит подписан — подпись всё равно пройдёт. Подпись — это «кто», а не «что».',
              },
            },
          ],
        },
        {
          id: 'git-l16',
          title: 'Git submodules: вложенные репозитории',
          minutes: 25,
          steps: [
            {
              id: 'git-l16-s1',
              title: 'Что такое submodule',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Submodule — это Git-репозиторий внутри другого Git-репозитория. Родитель хранит не файлы, а ссылку на конкретный коммит дочернего репо. Классический пример: главный проект + общая библиотека, которая живёт отдельно.',
                },
                {
                  type: 'mermaid',
                  caption: 'Submodule: главный репо ссылается на коммит вложенного',
                  code: `graph LR
                    Main[("main-repo<br/>.gitmodules")] -->|"SHA abc123"| Sub[("shared-lib<br/>(отдельный Git)")]
                    Main --> Code["src/"]
                    Main --> Lib["libs/shared-lib/"]`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Добавление и клонирование',
                  code: `# Добавить submodule\ngit submodule add https://github.com/myorg/shared-lib libs/shared-lib\ngit commit -m "Add shared-lib submodule"\n\n# Клонирование репо с submodules\ngit clone --recurse-submodules https://github.com/myorg/main-repo\n\n# Если забыли --recurse-submodules\ngit submodule update --init --recursive\n\n# Обновить все submodules до последних коммитов\ngit submodule update --remote --merge`,
                },
                {
                  type: 'list',
                  items: [
                    '.gitmodules — файл в корне главного репо: какой submodule куда и откуда',
                    'В главном репо хранится только SHA коммита submodule, не файлы',
                    'git submodule status — состояние всех submodules',
                    'git submodule update --init — инициализировать и скачать',
                    'git submodule foreach \'git pull\' — обновить все',
                  ],
                },
              ],
            },
            {
              id: 'git-l16-s2',
              title: 'Проблемы submodules',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Submodules мощные, но с ними легко «выстрелить в ногу». Классические проблемы: забыли `--recurse-submodules` при клоне (пустые папки), забыли закоммитить обновление submodule (в главном репо старый SHA), submodule в detached HEAD (коммиты «теряются»).',
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Типичный workflow',
                  code: `# Обновить submodule до свежего коммита\ngit submodule update --remote --merge\ngit add libs/shared-lib   # закоммитить новый SHA\ngit commit -m "Bump shared-lib to latest"\ngit push\n\n# Если submodule в detached HEAD (после update)\ncd libs/shared-lib\ngit switch main   # вернуться на ветку`,
                },
                {
                  type: 'note',
                  text: 'Правило: submodules оправданы, когда вложенный репо большой, активно развивается отдельно и нужен именно «пин» на конкретный коммит. Для мелких библиотек — package manager (npm, pip) или vendor-копирование. Для монорепо — git subtree (следующий урок).',
                },
                {
                  type: 'list',
                  items: [
                    'Плюс: чёткая граница, независимая история, «пин» на коммит',
                    'Минус: сложно клонировать (нужен --recurse-submodules)',
                    'Минус: detached HEAD после update — легко потерять коммиты',
                    'Минус: обновление требует двух коммитов (в submodule и в главном)',
                    'Альтернативы: git subtree, package manager, monorepo',
                  ],
                },
              ],
            },
            {
              id: 'git-l16-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что хранит главный репозиторий про submodule?',
                options: [
                  { id: 'a', text: 'Все файлы submodule целиком' },
                  { id: 'b', text: 'Ссылку на конкретный коммит (SHA) submodule и путь в .gitmodules' },
                  { id: 'c', text: 'Только имя submodule' },
                  { id: 'd', text: 'Ничего, submodule подключается в рантайме' },
                ],
                correct: ['b'],
                explanation:
                  'В главном репо — .gitmodules (URL, путь) и SHA коммита submodule. Именно поэтому submodule «запинен» на конкретную версию: git submodule update ставит ровно этот SHA. Чтобы обновить — нужно явно git submodule update --remote и закоммитить.',
              },
            },
          ],
        },
        {
          id: 'git-l17',
          title: 'Git subtree: submodules без боли',
          minutes: 25,
          steps: [
            {
              id: 'git-l17-s1',
              title: 'Subtree: вложенный репо без .gitmodules',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Subtree — альтернатива submodules. В отличие от submodules, содержимое вложенного репо физически копируется в главный (в подпапку). Нет .gitmodules, нет detached HEAD, клонирование — обычное. Плата: история «размывается», размер главного репо растёт.',
                },
                {
                  type: 'table',
                  caption: 'Submodules vs Subtree',
                  head: ['Критерий', 'Submodules', 'Subtree'],
                  rows: [
                    ['Хранение', 'Ссылка на SHA', 'Полная копия файлов + история'],
                    ['Клонирование', 'Нужен --recurse-submodules', 'Обычное git clone'],
                    ['Обновление', 'git submodule update + 2 коммита', 'git subtree pull'],
                    ['Detached HEAD', 'Часто', 'Никогда'],
                    ['Размер главного репо', 'Маленький', 'Растёт'],
                    ['История вложенного', 'Отдельно', 'Смешана с главной'],
                  ],
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Основные команды',
                  code: `# Добавить subtree\ngit subtree add --prefix=libs/shared-lib \\\n  https://github.com/myorg/shared-lib main --squash\n\n# Обновить до последней версии\ngit subtree pull --prefix=libs/shared-lib \\\n  https://github.com/myorg/shared-lib main --squash\n\n# Запушить изменения обратно в отдельный репо\ngit subtree push --prefix=libs/shared-lib \\\n  https://github.com/myorg/shared-lib main\n\n# --squash — «схлопнуть» историю в один коммит (меньше мусора)`,
                },
              ],
            },
            {
              id: 'git-l17-s2',
              title: 'Когда что',
              type: 'theory',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Subtree — если вложенный репо нужен «как библиотека» и редко меняется',
                    'Subtree — если команда маленькая и не хочет разбираться с submodules',
                    'Subtree — если хочется обычный git clone без сюрпризов',
                    'Submodules — если вложенный репо активно развивается отдельной командой',
                    'Submodules — если нужна чёткая граница и независимая история',
                    'Монорепо (Nx, Turborepo, Bazel) — если компонентов много и они связаны',
                  ],
                },
                {
                  type: 'note',
                  text: 'На собеседовании: «Чем subtree отличается от submodules?» — «subtree копирует файлы и историю в главный репо (проще клонировать), submodules хранят только ссылку (чище границы, сложнее клон)». Оба — компромисс, выбор зависит от размера команды и активности вложенного репо.',
                },
              ],
            },
            {
              id: 'git-l17-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Чем git subtree отличается от git submodule?',
                options: [
                  { id: 'a', text: 'Subtree физически копирует файлы и историю в главный репо, submodule — только ссылку на SHA' },
                  { id: 'b', text: 'Subtree работает только на macOS' },
                  { id: 'c', text: 'Это одно и то же' },
                  { id: 'd', text: 'Submodule быстрее' },
                ],
                correct: ['a'],
                explanation:
                  'Subtree: содержимое вложенного репо + история лежат внутри главного. Клонирование — обычное git clone. Submodule: только ссылка на коммит, нужен --recurse-submodules. Subtree проще для потребителя, submodules — для независимой разработки.',
              },
            },
          ],
        },
        {
          id: 'git-l18',
          title: 'Git flow vs trunk-based: модели ветвления',
          minutes: 30,
          steps: [
            {
              id: 'git-l18-s1',
              title: 'Две философии',
              type: 'theory',
              blocks: [
                {
                  type: 'p',
                  text: 'Как организовать ветки в команде — вопрос стратегии. Два подхода: Git flow (много долгоживущих веток) и trunk-based (одна main, короткие ветки). У каждого — свои плюсы и своя цена.',
                },
                {
                  type: 'mermaid',
                  caption: 'Git flow: main, develop, release, feature, hotfix',
                  code: `graph LR
                    Feature["feature/*<br/>от develop"] -->|"merge"| Develop["develop"]
                    Develop -->|"branch"| Release["release/*"]
                    Release -->|"merge + tag"| Main["main"]
                    Release -->|"merge back"| Develop
                    Hotfix["hotfix/*<br/>от main"] -->|"merge + tag"| Main
                    Hotfix -->|"merge back"| Develop`,
                },
                {
                  type: 'mermaid',
                  caption: 'Trunk-based: одна main, короткие ветки на 1–2 дня',
                  code: `graph LR
                    Feature["feature/*<br/>1–2 дня"] -->|"PR merge"| Main["main"]
                    Main -->|"auto-deploy"| Prod["prod"]
                    Main -->|"feature flags"| Prod`,
                },
              ],
            },
            {
              id: 'git-l18-s2',
              title: 'Когда что',
              type: 'theory',
              blocks: [
                {
                  type: 'table',
                  caption: 'Сравнение',
                  head: ['Критерий', 'Git flow', 'Trunk-based'],
                  rows: [
                    ['Ветки', 'main, develop, release/*, feature/*, hotfix/*', 'main + короткие feature/* (1–2 дня)'],
                    ['Релизы', 'Отдельная ветка release, стабилизация', 'Из main, feature flags'],
                    ['Ревью', 'На develop', 'На main (маленькие PR)'],
                    ['Hotfix', 'hotfix/* от main, слияние в main + develop', 'Прямо в main, потом в feature'],
                    ['Для чего', 'Версионируемые релизы, mobile, on-prem', 'SaaS, веб, CI/CD с авто-деплоем'],
                    ['DORA-метрики', 'Хуже (долгие ветки)', 'Лучше (частые мелкие мержи)'],
                  ],
                },
                {
                  type: 'list',
                  items: [
                    'Git flow: классика 2010-х, хорош для версионируемых продуктов (десктоп, mobile, on-prem)',
                    'Trunk-based: стандарт 2020-х, для SaaS и CI/CD, где релиз — каждый день',
                    'GitHub flow — упрощённый trunk-based: main + feature/*, без release/develop',
                    'GitLab flow — trunk-based + environment-ветки (staging, production)',
                    'Выбор зависит от продукта: если «релиз раз в месяц» — git flow оправдан; если «деплой 10 раз в день» — trunk-based',
                  ],
                },
                {
                  type: 'note',
                  text: 'На собеседовании: «Какая у вас модель ветвления?» — правильный ответ: «trunk-based с feature flags, PR живут 1–2 дня». «Git flow с develop и release» — устаревший ответ для 2025, но всё ещё используется в enterprise с версионируемыми релизами.',
                },
              ],
            },
            {
              id: 'git-l18-s3',
              title: 'Проверь себя',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте модель ветвления и её особенность',
                pairs: [
                  { left: 'Git flow', right: 'main, develop, release, feature, hotfix — много долгоживущих веток' },
                  { left: 'Trunk-based', right: 'Одна main, короткие feature-ветки на 1–2 дня' },
                  { left: 'GitHub flow', right: 'main + feature, упрощённый trunk-based' },
                  { left: 'GitLab flow', right: 'Trunk-based + environment-ветки' },
                ],
                explanation:
                  'Git flow — для версионируемых релизов. Trunk-based — для SaaS с частыми деплоями. GitHub flow — минимализм. GitLab flow — компромисс с environment-ветками. Выбор — по продукту и частоте релизов.',
              },
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────
    // m5 — Практикум (переименован из git-m4)
    // ─────────────────────────────────────────────
    {
      id: 'git-m5',
      title: 'Практикум',
      lessons: [
        {
          id: 'git-l11',
          title: 'Практика: от init до PR',
          minutes: 35,
          steps: [
            {
              id: 'git-l11-s1',
              title: 'Создание репозитория',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Какая команда создаёт новый Git-репозиторий в текущей папке?',
                options: [
                  { id: 'a', text: 'git start' },
                  { id: 'b', text: 'git init' },
                  { id: 'c', text: 'git new' },
                  { id: 'd', text: 'git create' },
                ],
                correct: ['b'],
                explanation: 'git init создаёт папку .git и превращает текущую директорию в репозиторий. Других команд для инициализации нет.',
              },
            },
            {
              id: 'git-l11-s2',
              title: 'Состояние файлов',
              type: 'quiz',
              quiz: {
                kind: 'fill',
                question: 'Какая команда покажет, какие файлы изменены, какие в staging, а какие не отслеживаются?',
                accepted: ['git status', 'status'],
                placeholder: 'git ...',
                hint: 'Два слова, начинается с git',
                explanation: 'git status — главный инструмент «где я и что происходит». Запускайте после каждого add/commit, если не уверены.',
              },
            },
            {
              id: 'git-l11-s3',
              title: 'Порядок действий',
              type: 'quiz',
              quiz: {
                kind: 'sorting',
                question: 'Расставьте команды в правильном порядке для отправки изменений на сервер',
                items: ['git add .', 'git commit -m "msg"', 'git push'],
                correct: ['git add .', 'git commit -m "msg"', 'git push'],
                explanation: 'Сначала индексируем (add), потом фиксируем локально (commit), потом отправляем на сервер (push).',
              },
            },
            {
              id: 'git-l11-s4',
              title: 'Создание ветки',
              type: 'quiz',
              quiz: {
                kind: 'cloze',
                question: 'Заполните команду для создания ветки и переключения на неё:',
                text: 'git ____ ____ feature/login',
                blanks: [
                  { accepted: ['switch'], hint: 'переключение' },
                  { accepted: ['-c'], hint: 'флаг create' },
                ],
                explanation: 'git switch -c feature/login — создаёт ветку и сразу переключается. Старая альтернатива: git checkout -b.',
              },
            },
            {
              id: 'git-l11-s5',
              title: 'Команды и действия',
              type: 'quiz',
              quiz: {
                kind: 'matching',
                question: 'Сопоставьте команду и что она делает',
                pairs: [
                  { left: 'git add', right: 'Добавить в staging' },
                  { left: 'git commit', right: 'Зафиксировать в локальной истории' },
                  { left: 'git push', right: 'Отправить на удалённый сервер' },
                  { left: 'git pull', right: 'Забрать и слить изменения' },
                ],
                explanation: 'add → staging, commit → локально, push → на сервер, pull = fetch + merge.',
              },
            },
            {
              id: 'git-l11-s6',
              title: 'Короткий SHA',
              type: 'quiz',
              quiz: {
                kind: 'number',
                question: 'Сколько символов в коротком хэше коммита, который показывает `git log --oneline` по умолчанию?',
                correct: 7,
                explanation: 'По умолчанию git сокращает SHA-1 до 7 символов. Полный хэш — 40 символов.',
              },
            },
            {
              id: 'git-l11-s7',
              title: '.gitignore',
              type: 'quiz',
              quiz: {
                kind: 'multiple',
                question: 'Что верно про .gitignore?',
                options: [
                  { id: 'a', text: 'Исключает файлы из отслеживания' },
                  { id: 'b', text: 'Удаляет файлы с диска' },
                  { id: 'c', text: 'Не действует на уже закоммиченные файлы' },
                  { id: 'd', text: 'Обычно содержит node_modules, venv, .env' },
                ],
                correct: ['a', 'c', 'd'],
                explanation: '.gitignore не удаляет файлы (b) — только перестаёт их отслеживать. Уже закоммиченные файлы надо убирать через git rm --cached.',
              },
            },
            {
              id: 'git-l11-s8',
              title: 'merge vs rebase',
              type: 'quiz',
              quiz: {
                kind: 'table',
                question: 'Отметьте, что верно для каждого способа',
                columns: ['merge', 'rebase'],
                rows: [
                  { label: 'Создаёт merge-commit', correct: ['merge'] },
                  { label: 'Переписывает историю', correct: ['rebase'] },
                  { label: 'Безопасен для общих веток', correct: ['merge'] },
                  { label: 'Даёт линейную историю', correct: ['rebase'] },
                ],
                explanation: 'merge сохраняет факт ветвления и безопасен для запушенных веток. rebase переписывает историю — только для своих локальных веток.',
              },
            },
            {
              id: 'git-l11-s9',
              title: 'Спасти потерянный коммит',
              type: 'quiz',
              quiz: {
                kind: 'code',
                question: 'После `git reset --hard HEAD~1` вы потеряли коммит. Напишите команду, которая покажет все перемещения HEAD — чтобы найти его хэш.',
                starterCode: 'git ',
                mustInclude: [
                  { pattern: '^git reflog', message: 'Нужна команда git reflog' },
                ],
                explanation: 'git reflog — журнал всех перемещений HEAD. Хранится 30–90 дней. Находите хэш и делаете git reset --hard <hash> — коммит вернётся.',
              },
            },
            {
              id: 'git-l11-s10',
              title: 'Что такое HEAD',
              type: 'quiz',
              quiz: {
                kind: 'single',
                question: 'Что такое HEAD в Git?',
                options: [
                  { id: 'a', text: 'Первый коммит в репозитории' },
                  { id: 'b', text: 'Указатель на текущий коммит (обычно — на вершину текущей ветки)' },
                  { id: 'c', text: 'Имя главной ветки' },
                  { id: 'd', text: 'Сервер, куда пушим' },
                ],
                correct: ['b'],
                explanation: 'HEAD — «где вы сейчас». Обычно указывает на вершину текущей ветки. При checkout на конкретный коммит — detached HEAD.',
              },
            },
          ],
        },
      ],
    },
  ],
};