// Supabase Configuration
class SupabaseManager {
    constructor() {
        // Замените на ваши реальные URL и ключи из Supabase Dashboard
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        
        // Инициализация Supabase клиента
        this.supabase = null;
        this.initSupabase();
    }

    initSupabase() {
        try {
            if (typeof supabase !== 'undefined') {
                this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
                console.log('Supabase инициализирован успешно');
            } else {
                console.error('Supabase SDK не загружен');
            }
        } catch (error) {
            console.error('Ошибка инициализации Supabase:', error);
        }
    }

    // Сохранение данных пользователя при входе
    async saveUserData(userData) {
        if (!this.supabase) {
            console.error('Supabase не инициализирован');
            return { success: false, error: 'Supabase не инициализирован' };
        }

        try {
            const userRecord = {
                telegram_id: userData.id,
                first_name: userData.first_name || null,
                last_name: userData.last_name || null,
                username: userData.username || null,
                language_code: userData.language_code || 'ru',
                photo_url: userData.photo_url || null,
                is_bot: userData.is_bot || false,
                is_premium: userData.is_premium || false,
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            // Попытка обновить существующего пользователя или создать нового
            const { data, error } = await this.supabase
                .from('telegram_users')
                .upsert(userRecord, { 
                    onConflict: 'telegram_id',
                    ignoreDuplicates: false 
                })
                .select();

            if (error) {
                console.error('Ошибка сохранения пользователя:', error);
                return { success: false, error: error.message };
            }

            console.log('Пользователь сохранен успешно:', data);
            return { success: true, data: data };

        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            return { success: false, error: error.message };
        }
    }

    // Получение данных пользователя
    async getUserData(telegramId) {
        if (!this.supabase) {
            console.error('Supabase не инициализирован');
            return { success: false, error: 'Supabase не инициализирован' };
        }

        try {
            const { data, error } = await this.supabase
                .from('telegram_users')
                .select('*')
                .eq('telegram_id', telegramId)
                .single();

            if (error) {
                console.error('Ошибка получения пользователя:', error);
                return { success: false, error: error.message };
            }

            return { success: true, data: data };

        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
            return { success: false, error: error.message };
        }
    }

    // Поиск пользователей по username
    async searchUsers(query) {
        if (!this.supabase) {
            console.error('Supabase не инициализирован');
            return { success: false, error: 'Supabase не инициализирован' };
        }

        try {
            const { data, error } = await this.supabase
                .from('telegram_users')
                .select('telegram_id, first_name, last_name, username, photo_url')
                .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
                .limit(20);

            if (error) {
                console.error('Ошибка поиска пользователей:', error);
                return { success: false, error: error.message };
            }

            return { success: true, data: data || [] };

        } catch (error) {
            console.error('Ошибка при поиске пользователей:', error);
            return { success: false, error: error.message };
        }
    }

    // Обновление времени последнего входа
    async updateLastLogin(telegramId) {
        if (!this.supabase) {
            return { success: false, error: 'Supabase не инициализирован' };
        }

        try {
            const { data, error } = await this.supabase
                .from('telegram_users')
                .update({ last_login: new Date().toISOString() })
                .eq('telegram_id', telegramId);

            if (error) {
                console.error('Ошибка обновления времени входа:', error);
                return { success: false, error: error.message };
            }

            return { success: true, data: data };

        } catch (error) {
            console.error('Ошибка при обновлении времени входа:', error);
            return { success: false, error: error.message };
        }
    }
}

// Экспорт для использования в других файлах
window.SupabaseManager = SupabaseManager;
