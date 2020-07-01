## Запуск приложения в docker-контейнере на локальном компьютере
На компьютере должен быть установлен docker и docker-compose
```
docker-compose up --build
```

### Документация

#### Настройка
Вам необходимо создать [Slack приложение](https://api.slack.com/apps) с ботом
И настроить его по шагам указанным ниже

##### Обозначения
* your-domain - доменное имя backend (https://daily-bot.b2bfamily.com)
* your-front-domain - доменное имя frontend (https://daily-bot-front.b2bfamily.com)

##### Настройка Scopes
Переходим во вкладку *OAuth & Permissions*. Находим блок *Scopes*.
Настраиваем следующим образом:

* Bot Token Scopes:
    * `chat:write`
    * `commands`
    * `im:history`
    * `im:write`
    * `incoming-webhook`
    * `users:read`
* User Token Scopes
    * `identify`

##### Настройка Redirect URLs
На той же вкладке находим блок *Redirect URLs*.  
Добавляем значения
* `your-domain/auth/callback`
* `your-front-domain/auth/callback`

##### Настройка Incoming Webhooks
Переходим на вкладку *Incoming Webhooks* и активируем Incoming Webhooks

##### Настройка Interactivity & Shortcuts
Переходим на вкладку *Interactivity & Shortcuts* и включаем Interactivity.  
Далее в поле `Request URL` указываем `your-domain/api/slack/actions`

##### Настройка Slash Commands
Переходим на вкладку *Slash Commands* и создаем новую команду. 
В параметре `Request URL` указываем следующее значение `your-domain/api/slack/commands`

##### Настройка Event Subscriptions
Переходим на вкладку *Event Subscriptions* и активируем *Events*. 
В поле `Request URL` указываем `your-domain/api/slack/events`. Будет произведена валидация роута.  
После в блоке *Subscribe to bot events* необходимо добавить событие `message.im`.

##### Настройка бота
* Во вкладке *App Home* в блоке *Your App’s Presence in Slack* активируем флаг *Always Show My Bot as Online
*, чтобы наше приложение отображалось, как подключенное.
* На вкладке *Basic Information* в блоке *Display Information* настраиваем отображение (иконку, название, описание и цвет фона).

##### Установка приложения в WorkSpace
Теперь переходим во вкладку *OAuth & Permissions* и устанавливаем приложение.

##### Настройка backend
Необходимо настроить `.env.production` файл
> Важно! При настройке файла нужно также указать параметры подключения к БД и путь к `mystem`.
Перечисление параметров есть в `.env.example`
* Переменную `APP_URL` нужно заполнить значением адреса приложения с постфиксом `/api`
* Переменную `APP_DOMAIN` нужно заполнить значением адреса приложения без постфикса `/api`
* Переменную `APP_KEY` нужно заполнить ключом шифрования (рекомендуемая длина от 64 бит). Ключ используется для шифрования jwt токена.
* Переменную `SLACK_CLIENT_ID` нужно заполнить значением *Client ID* из вкладки *Basic Information*
вашего приложения
* Переменную `SLACK_CLIENT_SECRET` нужно заполнить значением *Client Secret* из вкладки *Basic Information*
* Переменную `SLACK_SIGNING_SECRET` нужно заполнить значением *Signing Secret* из вкладки *Basic Information*
вашего приложения
* Переменную `SLACK_BOT_ACCESS_TOKEN` нужно заполнить значением *Bot User OAuth Access Token*
из вкладки *OAuth & Permissions*

#### Команды

На данный момент доступно 4 команды:
* `/<команда> start` - регистрирует пользователя в приложении и создает приватную беседу. При регистрации инициирует первый daily
* `/<команда> create` - выводит окно создания задачи
* `/<команда> help` - выводит информацию по приложению
* `/<команда> list` - выводит список активных задач

#### Daily митинг

* Оповещения высылаются по будням с 10 до 18 часов (не распространяется на первый митинг)
* Оповещение содержит кнопки старта и откладывания митинга
* Вначале при наличии незавершенных задач вам выводится их список с возможностью закрыть или отложить задачу
* После вам выводится сообщение о начале слушания новых задач. Сообщение содержит команду о остановке ожидания новых задач (по умолчанию `exit`)
* Далее в течение получаса (если не отправить команду остановки) бот ожидает новых задач в чате. Имеется оповещение при создании.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```