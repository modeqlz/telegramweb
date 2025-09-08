// Telegram Web App JavaScript
class TelegramWebApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.user = null;
        this.init();
    }

    init() {
        // Инициализация Telegram Web App
        if (this.tg) {
            this.tg.ready();
            this.tg.expand();
            
            // Применяем тему Telegram
            this.applyTelegramTheme();
            
            // Получаем данные пользователя
            this.user = this.tg.initDataUnsafe?.user;
            
            if (this.user) {
                this.showProfile();
            } else {
                this.showLogin();
            }
        } else {
            // Для тестирования вне Telegram
            console.log('Telegram Web App не обнаружен. Используем тестовые данные.');
            this.showLogin();
        }

        this.setupEventListeners();
    }

    applyTelegramTheme() {
        if (!this.tg) return;

        const root = document.documentElement;
        const themeParams = this.tg.themeParams;

        if (themeParams.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        }
        if (themeParams.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
        }
        if (themeParams.text_color) {
            root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        }
        if (themeParams.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
        }
        if (themeParams.button_color) {
            root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
            root.style.setProperty('--tg-accent-color', themeParams.button_color);
        }
        if (themeParams.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        }
        if (themeParams.header_bg_color) {
            root.style.setProperty('--tg-theme-header-bg-color', themeParams.header_bg_color);
        }
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const backToMain = document.getElementById('backToMain');
        const menuBtn = document.querySelector('.menu-btn');
        const cloudeChat = document.querySelector('[data-chat="cloude"]');

        loginBtn?.addEventListener('click', () => this.handleLogin());
        logoutBtn?.addEventListener('click', () => this.handleLogout());
        backToMain?.addEventListener('click', () => this.switchScreen('mainScreen'));
        menuBtn?.addEventListener('click', () => this.switchScreen('profileScreen'));
        cloudeChat?.addEventListener('click', () => this.openCloudeChat());

        // Обработка вкладок фильтров
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterChats(tab.dataset.filter);
            });
        });

        // Обработка изменения темы
        if (this.tg) {
            this.tg.onEvent('themeChanged', () => {
                this.applyTelegramTheme();
            });
        }
    }

    handleLogin() {
        if (this.tg && this.tg.initDataUnsafe?.user) {
            this.user = this.tg.initDataUnsafe.user;
            this.showProfile();
        } else {
            // Демо-режим для тестирования
            this.user = {
                id: 123456789,
                first_name: 'Демо',
                last_name: 'Пользователь',
                username: 'demo_user',
                language_code: 'ru',
                photo_url: null
            };
            this.showProfile();
        }
    }

    handleLogout() {
        this.user = null;
        this.showLogin();
        
        if (this.tg) {
            this.tg.close();
        }
    }

    showLogin() {
        this.switchScreen('loginScreen');
    }

    showProfile() {
        if (!this.user) return;

        // Обновляем информацию о пользователе
        this.updateUserInfo();
        this.switchScreen('mainScreen');
    }

    updateUserInfo() {
        if (!this.user) return;

        const elements = {
            userName: document.getElementById('userName'),
            userUsername: document.getElementById('userUsername'),
            userId: document.getElementById('userId'),
            userFirstName: document.getElementById('userFirstName'),
            userLastName: document.getElementById('userLastName'),
            userLanguage: document.getElementById('userLanguage'),
            userAvatar: document.getElementById('userAvatar'),
            headerUserAvatar: document.getElementById('headerUserAvatar'),
            headerTitle: document.getElementById('headerTitle')
        };

        // Обновляем текстовую информацию
        const fullName = [this.user.first_name, this.user.last_name].filter(Boolean).join(' ');
        
        if (elements.userName) {
            elements.userName.textContent = fullName || 'Пользователь';
        }

        if (elements.headerTitle) {
            elements.headerTitle.textContent = fullName || 'Telegram Web App';
        }

        if (elements.userUsername) {
            elements.userUsername.textContent = this.user.username ? `@${this.user.username}` : 'Нет username';
        }

        if (elements.userId) {
            elements.userId.textContent = this.user.id?.toString() || '-';
        }

        if (elements.userFirstName) {
            elements.userFirstName.textContent = this.user.first_name || '-';
        }

        if (elements.userLastName) {
            elements.userLastName.textContent = this.user.last_name || '-';
        }

        if (elements.userLanguage) {
            const languages = {
                'ru': 'Русский',
                'en': 'English',
                'uk': 'Українська',
                'de': 'Deutsch',
                'fr': 'Français',
                'es': 'Español'
            };
            elements.userLanguage.textContent = languages[this.user.language_code] || this.user.language_code || '-';
        }

        // Обновляем аватар
        this.updateAvatar();
        this.updateHeaderAvatar();
    }

    updateAvatar() {
        const avatarImg = document.getElementById('userAvatar');
        const avatarPlaceholder = document.querySelector('.avatar-placeholder');
        
        if (!avatarImg || !this.user) return;

        if (this.user.photo_url) {
            avatarImg.src = this.user.photo_url;
            avatarImg.onload = () => {
                avatarImg.classList.add('loaded');
                if (avatarPlaceholder) {
                    avatarPlaceholder.style.display = 'none';
                }
            };
            avatarImg.onerror = () => {
                avatarImg.classList.remove('loaded');
                if (avatarPlaceholder) {
                    avatarPlaceholder.style.display = 'flex';
                }
            };
        } else {
            // Пытаемся получить аватар через Telegram API
            if (this.tg && this.user.id) {
                this.getProfilePhoto();
            }
        }
    }

    updateHeaderAvatar() {
        const headerAvatarImg = document.getElementById('headerUserAvatar');
        const headerAvatarPlaceholder = document.querySelector('.avatar-placeholder-small');
        
        if (!headerAvatarImg || !this.user) return;

        if (this.user.photo_url) {
            headerAvatarImg.src = this.user.photo_url;
            headerAvatarImg.onload = () => {
                headerAvatarImg.classList.add('loaded');
                if (headerAvatarPlaceholder) {
                    headerAvatarPlaceholder.style.display = 'none';
                }
            };
            headerAvatarImg.onerror = () => {
                headerAvatarImg.classList.remove('loaded');
                if (headerAvatarPlaceholder) {
                    headerAvatarPlaceholder.style.display = 'flex';
                }
            };
        }
    }

    async getProfilePhoto() {
        // В реальном приложении здесь должен быть запрос к серверу
        // который получит фото профиля через Telegram Bot API
        console.log('Попытка получить фото профиля для пользователя:', this.user.id);
    }

    switchScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 100);
        }
    }

    // Утилиты для работы с Telegram Web App
    showAlert(message) {
        if (this.tg) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    showConfirm(message, callback) {
        if (this.tg) {
            this.tg.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    }

    hapticFeedback(type = 'impact') {
        if (this.tg?.HapticFeedback) {
            switch (type) {
                case 'light':
                    this.tg.HapticFeedback.impactOccurred('light');
                    break;
                case 'medium':
                    this.tg.HapticFeedback.impactOccurred('medium');
                    break;
                case 'heavy':
                    this.tg.HapticFeedback.impactOccurred('heavy');
                    break;
                case 'success':
                    this.tg.HapticFeedback.notificationOccurred('success');
                    break;
                case 'warning':
                    this.tg.HapticFeedback.notificationOccurred('warning');
                    break;
                case 'error':
                    this.tg.HapticFeedback.notificationOccurred('error');
                    break;
                default:
                    this.tg.HapticFeedback.impactOccurred('medium');
            }
        }
    }

    // Новые методы для работы с чатами
    openCloudeChat() {
        this.showAlert('Открытие чата с Cloude...');
        this.hapticFeedback('light');
        // Здесь можно добавить логику открытия чата
    }

    filterChats(filter) {
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            switch(filter) {
                case 'my':
                    // Показываем только личные чаты
                    item.style.display = item.dataset.chat === 'cloude' ? 'flex' : 'none';
                    break;
                case 'personal':
                    // Показываем персональные чаты
                    const hasPersonalTag = item.querySelector('.personal-tag');
                    item.style.display = hasPersonalTag ? 'flex' : 'none';
                    break;
                case 'secondary':
                    // Показываем вторичные чаты (боты и каналы)
                    const hasOpenBtn = item.querySelector('.open-btn');
                    item.style.display = hasOpenBtn ? 'flex' : 'none';
                    break;
                case 'all':
                default:
                    // Показываем все чаты
                    item.style.display = 'flex';
                    break;
            }
        });
        
        this.hapticFeedback('light');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.telegramApp = new TelegramWebApp();
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Ошибка в приложении:', event.error);
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.telegramApp?.tg) {
        window.telegramApp.tg.expand();
    }
});
