# Security

## Офлайн-приложение без бэкенда

ДевАкадемия — статическое офлайн-приложение. Нет сервера, нет пользовательского ввода на бэкенде, нет аутентификации. Риск эксплуатации веб-уязвимостей минимален.

## Аудит зависимостей

\`\`\`bash
npm audit --omit=dev   # production: 0 vulnerabilities
npm audit              # с devDeps: 21 moderate/low
\`\`\`

Все известные уязвимости — в `devDependencies`:

| Пакет | Откуда | Почему не опасно |
|---|---|---|
| deepmerge | vite-plugin-pwa → workbox-build | Build-time, нет пользовательского ввода |
| glob | vite-plugin-pwa → workbox-build | Build-time, паттерны фиксированы |
| minimatch | eslint, typescript-eslint, ejs | Build-time, паттерны — правила линтера |

Они **не попадают в production bundle** и не исполняются в браузере пользователя.

## Почему не `npm audit fix --force`

`--force` устанавливает **даунгрейды** `vite-plugin-pwa@1.1.0` и `typescript-eslint@8.36.0`, несовместимые с текущим кодом. Сборка и линтер ломаются.

Стратегия:
1. \`npm audit fix\` — безопасные патчи
2. Остальное — принять, документировать, пересматривать раз в 3–6 месяцев
3. \`npm audit --omit=dev\` — всегда должен быть 0