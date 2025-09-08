@echo off
echo Загрузка проекта Telegram Web App в GitHub...
echo.

echo Получение изменений из удаленного репозитория...
git pull origin main --allow-unrelated-histories --no-edit

echo Добавление всех файлов...
git add -A

echo Создание коммита...
git commit -m "Add Telegram Web App project files"

echo Принудительная загрузка в GitHub...
git push origin main --force

echo.
echo Готово! Проект загружен в https://github.com/modeqlz/telegramweb
echo.
pause
