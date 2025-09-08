'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Auto-redirect to profile page when opened in Telegram
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.location.href = '/profile';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <svg width="80" height="80" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <circle cx="120" cy="120" r="120" fill="#229ED9"/>
            <path d="m81.229 128.772 14.237 39.406s1.78 3.687 3.686 3.687 30.255-29.492 30.255-29.492l31.525-60.89L81.737 118.6l-.508 10.172z" fill="#fff"/>
            <path d="m100.106 138.878-2.733 29.046s-1.144 8.9 7.754 0 17.415-15.763 17.415-15.763" fill="#D2E5F1"/>
            <path d="m81.486 130.178 37.65-24.053s4.569-2.727 4.569-.763c0 1.964-4.569 4.691-4.569 4.691l-29.492 26.017-8.158-5.892z" fill="#B5CFE4"/>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Telegram Web App
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md">
          Откройте это приложение в Telegram для автоматической авторизации
        </p>
        
        <div className="space-y-4">
          <a 
            href="/profile" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Перейти к профилю
          </a>
          
          <div className="text-sm text-gray-500">
            Или откройте в Telegram для полной функциональности
          </div>
        </div>
      </div>
    </div>
  );
}
