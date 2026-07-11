# VendingMachine API

REST API для управления вендинговым автоматом (Vending Machine), разработанный на Node.js с использованием Express.

---
## Model

Содержит модели данных:

* `machine.js` — сам вендинговый автомат;
* `slot.js` — описание товара в ячейке.

Модели отвечают за хранение данных и выполнение операций над ними.

---

## Controller

Выполняет проверку валидности входных данных, а так же вызывает функции для выполнения запросов

---

## Routes

Содержит описание HTTP маршрутов и связывает запросы с контроллерами.

---
---
## Tools

Middleware для логирования HTTP-запросов

### Логируются:

* дата и время запроса
* HTTP-метод
* URL
* параметры маршрута
* query-параметры
* тело запроса
* HTTP-статус ответа
* тело ответа
* время выполнения запроса

После выполнения каждого запроса данные добавляются в файл:


### Формат записи:
```json
{
  "timestamp": "2026-07-11T10:20:30.000Z",
  "method": "POST",
  "url": "/machine/buy",
  "params": {},
  "query": {},
  "body": {
    "slotId": 1
  },
  "status": 200,
  "response": {
    "product": "Water"
  },
  "duration": "12 ms"
}
```

Каждый запрос сохраняется отдельной JSON-строкой


# Установка и запуск

## Локальный запуск

Клонирование проекта:

```bash
git clone <repository-url>
```

Переход в папку проекта:

```bash
cd WedingMachine
```

Установка зависимостей:

```bash
npm install
```

Запуск приложения:

```bash
npm start
```

После запуска API доступно:

```
http://localhost:3000
```

---

# Запуск через Docker

## Сборка образа

```bash
docker build -t vending_machine .
```

## Запуск контейнера

```bash
docker run -p 3000:3000 vending_machine
```

После запуска:

```
http://localhost:3000
```

---

# API

## Получение состояния автомата

### GET

```
/machine
```

Возвращает текущее состояние автомата:

* список товаров
* температуру
* выручку
* статус
* текущий баланс

Пример:

```bash
curl http://localhost:3000/machine
```
```json
{
  "temperature": 20,
  "credit": 0,
  "revenue": 0,
  "status": "operational",
  "slots": []
}
```

---

## Добавление товара

### POST

```
/machine/restock
```
Запрос
```json
{
  "id": 1,
  "product": "COLA",
  "price": 70,
  "stock": 3
}
```
Ответ
```json
{
  "id": 1,
  "product": "COLA",
  "price": 70,
  "stock": 3,
  "freshness": 100
}
```

---

## Добавление денег

### POST

```
/machine/insert
```

Тело запроса:

```json
{
  "amount": 100
}
```
Ответ
```json
{
  "credit": 100
}
```
---

## Покупка товара

### POST

```
/machine/select
```

Тело запроса:

```json
{
  "slotId": 1
}
```

Ответ:

```json
{
  "product": "COLA",
  "remaining_credit": 30
}
```

---

# Примеры запросов

### Проверка состояния
```curl -X GET http://localhost:3000/machine```
### Добавить товар
```curl -X POST http://localhost:3000/machine/restock -H "Content-Type: application/json" -d "{\"id\":1,\"product\":\"COLA\",\"price\":70,\"stock\":3}"```
### Внести деньги
```curl -X POST http://localhost:3000/machine/insert -H "Content-Type: application/json" -d "{\"amount\":100}"```
### Купить товар
```curl.exe -X POST http://localhost:3000/machine/select -H "Content-Type: application/json" -d "{\"slotId\":1}"```
### Починить автомат
```curl.exe -X POST http://localhost:3000/machine/maintain ```

## Пример обработки ошибок

## Недостаточно средств, чтобы купить товар
```curl.exe -X POST http://localhost:3000/machine/select -H "Content-Type: application/json" -d "{\"slotId\":1}" ```
## Не существует товара с данным id
```curl.exe -X POST http://localhost:3000/machine/select -H "Content-Type: application/json" -d "{\"slotId\":2}" ```