'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface TelegramWebApp {
  initData: string;
  ready: () => void;
  expand: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          return;
        }

        // Check if Telegram WebApp is available
        const telegramWebApp = window.Telegram?.WebApp;
        let initData = 'demo_data';

        if (telegramWebApp && telegramWebApp.initData) {
          initData = telegramWebApp.initData;
          console.log('Using Telegram WebApp data');
        } else {
          console.log('Using demo data for testing');
        }

        // Call /api/me endpoint
        const response = await fetch(`/api/me?initData=${encodeURIComponent(initData)}`);
        const result = await response.json();

        if (!result.ok) {
          throw new Error(result.error || 'Failed to load user profile');
        }

        setUser(result.user);
      } catch (err) {
        console.error('Profile load error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Пользователь не найден</p>
        </div>
      </div>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="text-center">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white bg-blue-500 flex items-center justify-center text-2xl font-bold">
                {fullName ? fullName.charAt(0).toUpperCase() : '👤'}
              </div>
            )}
            <h1 className="text-xl font-bold">{fullName || 'Пользователь'}</h1>
            {user.username && (
              <p className="text-blue-200">@{user.username}</p>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация профиля</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">ID пользователя:</span>
              <span className="font-mono text-sm">{user.id}</span>
            </div>
            
            {user.first_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Имя:</span>
                <span>{user.first_name}</span>
              </div>
            )}
            
            {user.last_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Фамилия:</span>
                <span>{user.last_name}</span>
              </div>
            )}
            
            {user.username && (
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span>@{user.username}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Дата регистрации:</span>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString('ru-RU')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Последнее обновление:</span>
              <span className="text-sm">
                {new Date(user.updated_at).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Возможности</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              <span>Синхронизация с Telegram</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">🔒</span>
              <span>Безопасная авторизация</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">⚡</span>
              <span>Автоматический вход</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
