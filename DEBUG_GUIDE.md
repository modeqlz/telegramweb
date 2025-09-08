# 🔍 Диагностика проблем с сохранением данных

## Возможные причины пустой таблицы:

### 1. ❌ Переменные окружения не настроены в Vercel
**Проверьте:**
- В Vercel Dashboard → Settings → Environment Variables
- Должны быть: `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- Отмечены все окружения (Production, Preview, Development)

### 2. ❌ Таблица не создана в Supabase
**Выполните SQL в Supabase:**
```sql
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

ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON telegram_users FOR ALL USING (true);
```

### 3. ❌ Приложение не запускается в Telegram
**Проверьте:**
- Приложение должно открываться ТОЛЬКО в Telegram Web App
- В обычном браузере данные пользователя недоступны

### 4. ❌ Ошибки в консоли браузера
**Откройте консоль (F12) и проверьте:**
```javascript
// Проверка переменных окружения
console.log('URL:', window.telegramApp?.supabaseManager?.supabaseUrl);
console.log('Key:', window.telegramApp?.supabaseManager?.supabaseKey?.substring(0, 20));

// Проверка подключения
window.telegramApp?.supabaseManager?.testConnection();

// Ручное сохранение (если есть данные пользователя)
window.telegramApp?.saveUserToDatabase();
```

## 🚀 Пошаговая диагностика:

### Шаг 1: Проверьте Vercel Environment Variables
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Шаг 2: Проверьте таблицу в Supabase
- Перейдите в Table Editor
- Найдите таблицу `telegram_users`
- Если её нет - создайте через SQL Editor

### Шаг 3: Проверьте RLS политики
```sql
-- Посмотреть политики
SELECT * FROM pg_policies WHERE tablename = 'telegram_users';

-- Если политик нет, создать:
CREATE POLICY "Allow all operations" ON telegram_users FOR ALL USING (true);
```

### Шаг 4: Тестируйте в Telegram
- Откройте приложение ТОЛЬКО через Telegram
- Проверьте консоль браузера на ошибки
- Должны появиться логи с эмодзи (🔧, 💾, ✅)

### Шаг 5: Ручная проверка
В консоли браузера выполните:
```javascript
// Проверка инициализации
console.log('App:', window.telegramApp);
console.log('Supabase:', window.telegramApp?.supabaseManager?.supabase);

// Проверка пользователя
console.log('User:', window.telegramApp?.user);

// Ручное сохранение
if (window.telegramApp?.user) {
    window.telegramApp.saveUserToDatabase();
}
```

## 🔧 Частые ошибки:

### "Supabase ключи не настроены"
- Переменные окружения не добавлены в Vercel
- Неправильные названия переменных (нужен префикс VITE_)

### "Ошибка подключения к таблице"
- Таблица не создана
- Неправильное название таблицы
- RLS блокирует доступ

### "Данные пользователя отсутствуют"
- Приложение открыто не в Telegram
- Telegram Web App SDK не загружен

### "Permission denied"
- RLS политики не настроены
- Неправильные права доступа

## ✅ Признаки успешной работы:

В консоли должны появиться логи:
```
🔧 Инициализация Supabase...
📍 URL: https://your-project.supabase.co
🔑 Key (первые 20 символов): eyJhbGciOiJIUzI1NiIsI...
✅ Supabase клиент создан успешно
🧪 Тестируем подключение к Supabase...
✅ Подключение к базе данных работает
🚀 Начинаем сохранение пользователя в базу данных...
💾 Сохраняем данные пользователя: {...}
✅ Пользователь сохранен успешно
```

После этого в таблице Supabase появятся данные пользователя!
