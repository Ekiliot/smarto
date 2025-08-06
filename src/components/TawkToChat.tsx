'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export default function TawkToChat() {
  const pathname = usePathname()

  useEffect(() => {
    // Загружаем Tawk.to только на странице /support
    if (pathname !== '/support') {
      return
    }

    // Проверяем, не загружен ли уже скрипт
    if (window.Tawk_API) {
      return
    }

    // Создаем скрипт Tawk.to
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://embed.tawk.to/688c881fc001281928a1dd0f/1j1if7eu5'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')

    // Добавляем скрипт в head
    document.head.appendChild(script)

    // Инициализируем Tawk_API
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    // Очистка при размонтировании компонента
    return () => {
      // Удаляем скрипт при размонтировании
      const existingScript = document.querySelector('script[src*="tawk.to"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [pathname])

  return null // Компонент не рендерит ничего видимого
} 