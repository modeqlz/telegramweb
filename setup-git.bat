@echo off
echo Настройка Git репозитория для telegramweb...
echo.

echo Инициализация Git репозитория...
git init

echo Добавление всех файлов...
git add .

echo Создание первого коммита...
git commit -m "Initial commit: Telegram Web App project with dark theme"

echo.
echo Репозиторий готов!
echo.
echo Теперь создайте репозиторий на GitHub:
echo 1. Перейдите на https://github.com
echo 2. Нажмите "New repository"
echo 3. Название: telegramweb
echo 4. Описание: Telegram Web App with dark theme and user authentication
echo 5. Выберите Public или Private
echo 6. НЕ добавляйте README, .gitignore, license
echo 7. Нажмите "Create repository"
echo.
echo После создания репозитория выполните:
echo git remote add origin https://github.com/ВАШ_USERNAME/telegramweb.git
echo git branch -M main
echo git push -u origin main
echo.
pause
