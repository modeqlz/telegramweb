# Пошаговая инструкция загрузки проекта на GitHub

## Шаг 1: Откройте командную строку или Git Bash

Откройте командную строку (cmd) или Git Bash в папке проекта:
- Зайдите в папку `d:\telegramweb`
- Зажмите Shift + правый клик мыши
- Выберите "Открыть окно PowerShell здесь" или "Git Bash Here"

## Шаг 2: Выполните команды Git

Скопируйте и выполните следующие команды по порядку:

### 1. Инициализация репозитория
```bash
git init
```

### 2. Настройка пользователя (если не настроено)
```bash
git config --global user.name "Ваше имя"
git config --global user.email "ваш@email.com"
```

### 3. Добавление всех файлов
```bash
git add .
```

### 4. Создание первого коммита
```bash
git commit -m "Initial commit: Telegram Web App project with dark theme"
```

## Шаг 3: Создание репозитория на GitHub

1. Перейдите на https://github.com
2. Нажмите зеленую кнопку "New" или "New repository"
3. Заполните форму:
   - **Repository name**: `telegramweb`
   - **Description**: `Telegram Web App with dark theme and user authentication`
   - **Visibility**: Public (или Private, если хотите)
   - **НЕ ставьте галочки** на "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите "Create repository"

## Шаг 4: Подключение к GitHub

После создания репозитория GitHub покажет вам команды. Выполните их:

### Замените YOUR_USERNAME на ваш GitHub username
```bash
git remote add origin https://github.com/YOUR_USERNAME/telegramweb.git
git branch -M main
git push -u origin main
```

## Шаг 5: Проверка

После выполнения команд:
1. Обновите страницу репозитория на GitHub
2. Вы должны увидеть все файлы проекта
3. README.md будет отображаться на главной странице

## Файлы в репозитории

После загрузки в репозитории будут следующие файлы:
- `index.html` - главная страница приложения
- `styles.css` - стили в темной теме Telegram
- `app.js` - JavaScript логика
- `README.md` - документация проекта
- `netlify.toml` - конфигурация для деплоя
- `.gitignore` - файлы для исключения из Git
- `git-commands.txt` - справочник команд Git
- `setup-git.bat` - скрипт автоматической настройки

## Возможные проблемы

### Если Git не найден:
- Убедитесь, что Git установлен: https://git-scm.com/download/win
- Перезапустите командную строку после установки

### Если нужна аутентификация:
- GitHub может потребовать Personal Access Token вместо пароля
- Создайте токен в Settings > Developer settings > Personal access tokens

### Если репозиторий уже существует:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/telegramweb.git
git push -u origin main
```

## Следующие шаги

После загрузки на GitHub вы сможете:
1. **Настроить GitHub Pages** для бесплатного хостинга
2. **Деплоить на Netlify** одним кликом
3. **Поделиться проектом** с другими разработчиками
4. **Настроить автоматический деплой** при изменениях

Удачи! 🚀
