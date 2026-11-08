# Как внести вклад в DevAcademy

Полное руководство — в корневом [`CONTRIBUTING.md`](../CONTRIBUTING.md). Ниже — краткая шпаргалка.

## Перед PR обязательно

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest
npm run build       # прод-сборка
```

# Контент

    Минимум 5 шагов в уроке (кроме *-l0 и практикумов — там 10+).

    pairs.right уникальны.

    single: ровно один correct, и он есть в options.

    sorting: items и correct содержат одни и те же элементы.

    В code — только одинарные кавычки и \n, если внутри есть ${{ ... }}.

# Ветки и коммиты

    Ветка: feat/..., fix/..., docs/....

    Коммит: feat: add lesson about X, fix: ....