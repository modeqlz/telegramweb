import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Telegram Web App',
  description: 'Telegram Web App with Supabase integration',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
        <meta name="theme-color" content="#0088cc" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
