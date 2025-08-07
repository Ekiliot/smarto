// Logger utility for development and production
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || '')
    }
  },
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '')
    }
    // В продакшене можно отправлять в сервис мониторинга
  },
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '')
    }
  },
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
  }
} 