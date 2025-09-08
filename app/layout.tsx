import type { Metadata } from 'next'
import './globals.css'
import TelegramWebApp from './components/TelegramWebApp'

export const metadata: Metadata = {
  title: 'Telegram Web App',
  description: 'Telegram Web App with Supabase integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0088cc" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white telegram-web-app">
        <TelegramWebApp>
          <div className="min-h-screen w-full">
            {children}
          </div>
        </TelegramWebApp>
      </body>
    </html>
  )
}
