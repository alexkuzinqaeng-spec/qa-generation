# QA-Generation — Architecture

Бесплатная платформа подготовки QA-инженеров.
Стек: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
Прогресс пользователя хранится в localStorage. Бэкенд — только для API-тренажёра (Route Handlers).

## Принципы проекта

1. Данные отделены от движка: весь контент — JSON/MDX в /content, движки — один раз в /src/lib.
2. Контракт-фёрст: типы всех сущностей — в /src/contracts/types.ts. Файл почти не меняется.
3. Фича-фолдеры: модули в /src/features не импортируют друг друга.

## Структура

- /src/contracts — типы и дизайн-токены (опорные файлы)
- /src/lib — общий код: sql-engine, quiz-engine, progress-storage
- /src/features — istqb-trainer, sql-playground, api-trainer, ai-lab, automation-lab
- /src/app — маршрутизация (тонкий слой, только сборка страниц)
- /content — контент по модулям (JSON)

## Модули и статус

- [ ] ISTQB-тренер (викторины, экзамены)
- [ ] SQL-тренажёр (sql.js в браузере, 3 уровня)
- [ ] API-тренажёр (мок-бэкенд, 3 уровня)
- [ ] AI для QA (контент + интерактив)
- [ ] Автотесты и языки программирования

## Дизайн

Тёмная тема (#0A0E14), акцент — бирюзовый #2DD4BF (цвет «пройденного теста»),
ошибка — #F87171. Шрифты: Inter/Unbounded (заголовки), JetBrains Mono (код).
Bento-grid на главной, анимации через Framer Motion.
