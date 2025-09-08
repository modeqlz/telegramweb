'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        colorScheme: 'light' | 'dark'
        initData: string
        initDataUnsafe: any
      }
    }
  }
}

export default function TelegramWebApp({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        
        // Initialize Telegram Web App
        tg.ready()
        tg.expand()
        
        // Apply theme colors as CSS variables
        const root = document.documentElement
        const theme = tg.themeParams
        
        if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color)
        if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color)
        if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color)
        if (theme.link_color) root.style.setProperty('--tg-theme-link-color', theme.link_color)
        if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color)
        if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color)
        
        // Apply dark/light theme
        if (tg.colorScheme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        
        // Force CSS recalculation
        document.body.style.display = 'none'
        document.body.offsetHeight // Trigger reflow
        document.body.style.display = ''
      }
    }

    // Try to initialize immediately
    initTelegram()
    
    // Also try after a short delay in case script is still loading
    const timer = setTimeout(initTelegram, 100)
    
    // Listen for script load
    const script = document.querySelector('script[src*="telegram-web-app.js"]')
    if (script) {
      script.addEventListener('load', initTelegram)
    }
    
    return () => {
      clearTimeout(timer)
      if (script) {
        script.removeEventListener('load', initTelegram)
      }
    }
  }, [])

  return <>{children}</>
}
