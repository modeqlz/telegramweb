# Настройка Supabase для Telegram Web App

## 🚀 Быстрая настройка

### 1. Создание проекта в Supabase

1. Перейдите на https://supabase.com
2. Создайте аккаунт или войдите
3. Нажмите "New Project"
4. Выберите организацию и введите:
   - **Name**: `telegram-web-app`
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший регион
5. Нажмите "Create new project"

### 2. Создание таблицы пользователей

Выполните этот SQL код в Supabase SQL Editor:

```sql
-- Создание таблицы пользователей Telegram
CREATE TABLE telegram_users (
    id BIGSERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    language_code TEXT DEFAULT 'ru',
    photo_url TEXT,
    is_bot BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание индексов для быстрого поиска
CREATE INDEX idx_telegram_users_telegram_id ON telegram_users(telegram_id);
CREATE INDEX idx_telegram_users_username ON telegram_users(username);
CREATE INDEX idx_telegram_users_name ON telegram_users(first_name, last_name);

-- Включение Row Level Security (RLS)
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;

-- Политика для чтения данных (все могут читать)
CREATE POLICY "Allow read access for all users" ON telegram_users
    FOR SELECT USING (true);

-- Политика для вставки данных (все могут добавлять)
CREATE POLICY "Allow insert for all users" ON telegram_users
    FOR INSERT WITH CHECK (true);

-- Политика для обновления данных (все могут обновлять)
CREATE POLICY "Allow update for all users" ON telegram_users
    FOR UPDATE USING (true);
```

### 3. Получение ключей API

1. В панели Supabase перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL**
   - **anon public key**

### 4. Настройка в коде

Откройте файл `supabase-config.js` и замените:

```javascript
// Замените на ваши реальные значения
this.supabaseUrl = 'https://your-project-id.supabase.co';
this.supabaseKey = 'your-anon-key-here';
```

## 📊 Структура таблицы

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGSERIAL | Автоинкрементный ID |
| `telegram_id` | BIGINT | ID пользователя в Telegram |
| `first_name` | TEXT | Имя пользователя |
| `last_name` | TEXT | Фамилия пользователя |
| `username` | TEXT | Username в Telegram |
| `language_code` | TEXT | Код языка (ru, en, etc.) |
| `photo_url` | TEXT | URL аватарки |
| `is_bot` | BOOLEAN | Является ли ботом |
| `is_premium` | BOOLEAN | Premium аккаунт |
| `last_login` | TIMESTAMPTZ | Время последнего входа |
| `created_at` | TIMESTAMPTZ | Время создания записи |

## 🔧 Функции приложения

### Автоматическое сохранение пользователей
- При входе через Telegram данные автоматически сохраняются в базу
- Если пользователь уже существует - обновляется время последнего входа
- Все поля профиля синхронизируются с Telegram

### Поиск пользователей
- Поиск по username, имени и фамилии
- Результаты отображаются в реальном времени
- Поддержка частичного совпадения (ILIKE)

### Безопасность
- Row Level Security (RLS) включен
- Политики доступа настроены для публичного чтения
- Anon key используется для безопасного доступа

## 🐛 Отладка

### Проверка подключения
Откройте консоль браузера и проверьте:
```javascript
console.log('Supabase URL:', window.telegramApp.supabaseManager.supabaseUrl);
console.log('Supabase Client:', window.telegramApp.supabaseManager.supabase);
```

### Тестирование сохранения
```javascript
// Тест сохранения пользователя
window.telegramApp.saveUserToDatabase();
```

### Тестирование поиска
```javascript
// Тест поиска пользователей
window.telegramApp.supabaseManager.searchUsers('demo').then(console.log);
```

## 📈 Мониторинг

В панели Supabase вы можете:
- Просматривать таблицу пользователей в **Table Editor**
- Отслеживать запросы в **Logs**
- Мониторить производительность в **Reports**

## 🔄 Обновления

При обновлении структуры таблицы выполните миграции через SQL Editor:

```sql
-- Пример добавления нового поля
ALTER TABLE telegram_users ADD COLUMN phone_number TEXT;
```

## ⚠️ Важные замечания

1. **Никогда не коммитьте реальные ключи API в Git**
2. **Используйте переменные окружения для продакшена**
3. **Регулярно обновляйте ключи доступа**
4. **Мониторьте использование API для избежания лимитов**

---

После настройки Supabase ваше приложение будет автоматически сохранять всех пользователей, которые входят через Telegram!
