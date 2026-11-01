import type { Course } from './types';

export const gitCourse: Course = {
  slug: 'git-basics',
  title: 'Git и командная работа',
  subtitle: 'Версионирование, ветки, PR и разрешение конфликтов — база любого инженера',
  description:
    'Курс для тех, кто хочет уверенно работать с Git в команде. Разберём три состояния, ветки, слияния и конфликты, удалённые репозитории и pull request, а также продвинутые приёмы: rebase, reset, revert, stash, reflog. Всё на конкретных примерах — от первого commit до спасения потерянных коммитов.',
  level: 'Новичок',
  tags: ['Git', 'VCS', 'Командная работа'],
  accent: '#f05032',
  icon: 'git',
  outcomes: [
    'Понимать, что такое commit, ветка и три состояния файлов',
    'Работать с локальным репозиторием: init, add, commit, log',
    'Создавать ветки, сливать изменения, разрешать конфликты',
    'Работать с удалённым репозиторием и pull request',
    'Использовать rebase, reset, revert и reflog осознанно',
  ],
  requirements: ['Уверенная работа в командной строке', 'Установленный Git (git-scm.com)'],
  modules: [
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
                  code: `# 1. Рабочая директория — изменили файл
echo "print('hello')" > app.py

# 2. Staging — подготовили к коммиту
git add app.py

# 3. Repository — зафиксировали
git commit -m "Add hello world"

# Посмотреть, что где: git status покажет все три состояния`,
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
                  code: `# Инициализация — создаёт папку .git в текущей директории
git init

# Настройка автора (один раз на машину)
git config --global user.name "Анна Иванова"
git config --global user.email "anna@example.com"

# Проверить, что происходит
git status

# Добавить все файлы в staging
git add .

# Зафиксировать
git commit -m "Initial commit"

# Посмотреть историю
git log
git log --oneline --graph`,
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
                  code: `# Зависимости
node_modules/
venv/
__pycache__/

# Артефакты сборки
dist/
build/
*.pyc

# Локальные настройки и секреты
.env
.env.local
*.log

# IDE
.vscode/
.idea/
.DS_Store`,
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
                  code: `# Создать ветку (но не переключаться)
git branch feature/login

# Создать и сразу переключиться
git switch -c feature/login
# (или старое: git checkout -b feature/login)

# Посмотреть все ветки
git branch

# Переключиться на существующую
git switch main

# Слить ветку feature/login в текущую (main)
git switch main
git merge feature/login

# Удалить слитую ветку
git branch -d feature/login`,
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
                  code: `Fast-forward:
  main:    A ← B
                 ↖
  feature:        C ← D

  После merge: main: A ← B ← C ← D (указатель сдвинулся)

Three-way merge:
  main:    A ← B ← E
                 ↖
  feature:        C ← D

  После merge: создаётся M (merge-commit) с родителями E и D
  main:    A ← B ← E ← M
                 ↖    ↙
                  C ← D`,
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
                  code: `<<<<<<< HEAD
print("Hello, Anna")
=======
print("Hi, Anna")
>>>>>>> feature/greeting

# <<<<<<< HEAD — текущая ветка (куда сливаем)
# ======= — разделитель
# >>>>>>> feature/greeting — сливаемая ветка
# Надо оставить одну версию (или объединить) и удалить все маркеры`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'Как Git сообщает о конфликте',
                  code: `git merge feature/greeting
# Auto-merging app.py
# CONFLICT (content): Merge conflict in app.py
# Automatic merge failed; fix conflicts and then commit the result.

git status
# both modified:   app.py    ← «both» — конфликт`,
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
                  code: `# 1. Открыть файл и найти маркеры <<<<<<<
# 2. Решить, что оставить — обычно объединить оба изменения
# 3. Удалить маркеры конфликта
# 4. Добавить файл в staging — это «сигнал», что конфликт решён
git add app.py

# 5. Завершить merge
git commit

# Или отменить merge совсем
git merge --abort`,
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
                  code: `# Клонировать репозиторий (создаёт папку и .git)
git clone https://github.com/user/repo.git

# Посмотреть, откуда тянуть/куда пушить
git remote -v

# Добавить ещё один remote (например, upstream)
git remote add upstream https://github.com/original/repo.git

# Отправить свои коммиты в origin (main)
git push origin main

# Забрать изменения из origin/main и слить в текущую ветку
git pull origin main

# Забрать изменения, но НЕ сливать — только показать
git fetch origin
git log origin/main --oneline -5`,
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
                  code: `# 1. Создать ветку от актуальной main
git switch main
git pull
git switch -c feature/add-login

# 2. Работать, коммитить
git add .
git commit -m "Add login form"
git push -u origin feature/add-login

# 3. Открыть PR на GitHub/GitLab
#    (в браузере: compare & pull request)

# 4. После ревью — merge (через UI или локально)
#    и удалить ветку

# 5. Подтянуть изменения к себе
git switch main
git pull`,
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
    {
      id: 'git-m3',
      title: 'Продвинутое',
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
                  type: 'code',
                  lang: 'text',
                  caption: 'merge vs rebase',
                  code: `Исходное:
  main:    A ← B ← E
                 ↖
  feature:        C ← D

git merge main (в feature):
  main:    A ← B ← E
                 ↖    ↖
  feature:        C ← D ← M   (M — merge-commit)

git rebase main (в feature):
  main:    A ← B ← E
                     ↖
  feature:            C' ← D'  (C', D' — «пересаженные» C, D)`,
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
                  code: `# Переписать последние 3 коммита
git rebase -i HEAD~3

# Откроется редактор:
# pick a3f4d2e Add login form
# pick b7c8e1d Fix typo
# pick d9e2f4a WIP
#
# pick   — оставить как есть
# squash — слить с предыдущим (s)
# reword — изменить сообщение (r)
# edit   — остановиться для правки (e)
# drop   — удалить (d)
# reorder — поменять строки местами`,
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
                  code: `# reset --soft — «убрать commit, оставить в staging»
git reset --soft HEAD~1
# Коммит исчез, изменения готовы к новому коммиту

# reset --mixed (по умолчанию) — «убрать commit и staging, оставить в файлах»
git reset HEAD~1
# Коммит исчез, файлы изменены, но не в staging

# reset --hard — «стереть и commit, и staging, и файлы»
git reset --hard HEAD~1
# ОПАСНО: изменения безвозвратно потеряны`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'revert — безопасная отмена запушенного',
                  code: `# Создаёт НОВЫЙ commit, который отменяет изменения предыдущего
git revert a3f4d2e

# История сохранилась, ничего не переписано
# Можно пушить — безопасно`,
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
                  code: `# Срочно переключиться на другую ветку, но не хочется коммитить
git stash
# (или git stash push -m "WIP login form")

git switch main
# ... поработали ...

git switch feature/login
git stash pop   # вернуть и удалить из stash
git stash list  # посмотреть все «отложенные»
git stash apply # вернуть, но оставить в stash`,
                },
                {
                  type: 'code',
                  lang: 'bash',
                  caption: 'git reflog — «спасатель»',
                  code: `# Лог всех перемещений HEAD: коммиты, checkout, reset, merge...
git reflog
# a3f4d2e HEAD@{0}: reset: moving to HEAD~1
# b7c8e1d HEAD@{1}: commit: WIP
# d9e2f4a HEAD@{2}: commit: Fix typo
# ...

# «Я сделал reset --hard и потерял коммит!»
git reset --hard b7c8e1d
# Всё вернулось. Git не удаляет коммиты сразу — они висят в reflog 30–90 дней.`,
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
        {
      id: 'git-m4',
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