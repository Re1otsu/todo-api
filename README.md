# Todo API

REST API для управления задачами с JWT-аутентификацией, валидацией входных данных, сортировкой, фильтрацией и пагинацией. Построен на архитектуре Controller/Service.

## Технологии

Node.js · Express · PostgreSQL · JWT · bcrypt · Joi

## Установка и запуск

```bash
git clone https://github.com/Re1otsu/nodejs
cd todo-api
npm install
```

Создай файл `.env` в корне проекта (см. раздел [Переменные окружения](#переменные-окружения)).

Создай базу данных и таблицы:

```bash
psql -U postgres -c "CREATE DATABASE todo_db;"
psql -U postgres -d todo_db -f schema.sql
```

Запусти сервер:

```bash
npm run dev
```

## Переменные окружения

| Переменная     | Описание                              | Пример                                              |
|----------------|---------------------------------------|-----------------------------------------------------|
| DATABASE_URL   | Строка подключения к PostgreSQL       | postgresql://postgres:пароль@localhost:5432/todo_db |
| JWT_SECRET     | Секретный ключ для подписи JWT токенов| любая_длинная_случайная_строка                      |
| PORT           | Порт сервера                          | 3000                                                |

## Эндпоинты

### Аутентификация

| Метод | Путь             | Описание      |
|-------|------------------|---------------|
| POST  | /auth/register   | Регистрация   |
| POST  | /auth/login      | Вход в систему |

### Задачи (требуют Bearer токен)

| Метод  | Путь          | Описание                              |
|--------|---------------|---------------------------------------|
| GET    | /tasks        | Получить все задачи                   |
| POST   | /tasks        | Создать задачу                        |
| PATCH  | /tasks/:id    | Обновить задачу                       |
| DELETE | /tasks/:id    | Удалить задачу                        |

#### Параметры GET /tasks

| Параметр | Тип     | По умолчанию | Описание                              |
|----------|---------|--------------|---------------------------------------|
| sort     | string  | created_at   | Поле сортировки (created_at, title, is_done) |
| order    | string  | desc         | Направление (asc, desc)               |
| page     | number  | 1            | Номер страницы                        |
| limit    | number  | 10           | Количество задач на странице          |
| is_done  | boolean | —            | Фильтр по статусу выполнения          |

## Примеры запросов

### Регистрация

```
POST /auth/register
Content-Type: application/json
```

```json
{
    "email": "user@mail.com",
    "password": "12345"
}
```

Ответ `201`:
```json
{
    "id": 1,
    "email": "user@mail.com"
}
```

### Вход

```
POST /auth/login
Content-Type: application/json
```

```json
{
    "email": "user@mail.com",
    "password": "12345"
}
```

Ответ `200`:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Создать задачу

```
POST /tasks
Authorization: Bearer <токен>
Content-Type: application/json
```

```json
{
    "title": "Купить продукты"
}
```

Ответ `201`:
```json
{
    "id": 1,
    "title": "Купить продукты"
}
```

### Получить задачи с фильтрацией

```
GET /tasks?sort=title&order=asc&page=1&limit=5&is_done=false
Authorization: Bearer <токен>
```
