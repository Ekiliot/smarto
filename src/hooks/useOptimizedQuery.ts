import { useState, useEffect, useCallback, useRef } from 'react'

interface QueryOptions<T> {
  queryFn: () => Promise<T>
  enabled?: boolean
  staleTime?: number // время в мс, после которого данные считаются устаревшими
  cacheTime?: number // время в мс, сколько хранить данные в кэше
  retry?: number
  retryDelay?: number
}

interface QueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  isStale: boolean
}

// Простой кэш для запросов
const queryCache = new Map<string, { data: any; timestamp: number; staleTime: number }>()

export function useOptimizedQuery<T>(key: string, options: QueryOptions<T>): QueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStale, setIsStale] = useState(false)
  
  const { queryFn, enabled = true, staleTime = 5 * 60 * 1000, cacheTime = 10 * 60 * 1000, retry = 3, retryDelay = 1000 } = options
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const isDataStale = useCallback((timestamp: number) => {
    return Date.now() - timestamp > staleTime
  }, [staleTime])

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return

    // Проверяем кэш
    const cached = queryCache.get(key)
    if (cached && !force && !isDataStale(cached.timestamp)) {
      setData(cached.data)
      setIsStale(false)
      return
    }

    // Если данные устарели, показываем их, но помечаем как устаревшие
    if (cached && !force) {
      setData(cached.data)
      setIsStale(true)
    }

    try {
      setLoading(true)
      setError(null)
      
      // Отменяем предыдущий запрос
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      const result = await queryFn()
      
      // Сохраняем в кэш
      queryCache.set(key, {
        data: result,
        timestamp: Date.now(),
        staleTime
      })
      
      setData(result)
      setIsStale(false)
      retryCountRef.current = 0
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Запрос был отменен
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      
      // Retry logic
      if (retryCountRef.current < retry) {
        retryCountRef.current++
        setTimeout(() => {
          fetchData(force)
        }, retryDelay)
      }
    } finally {
      setLoading(false)
    }
  }, [key, queryFn, enabled, staleTime, retry, retryDelay, isDataStale])

  const refetch = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  // Очистка старых записей кэша
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now()
      queryCache.forEach((cacheEntry, cacheKey) => {
        if (now - cacheEntry.timestamp > cacheTime) {
          queryCache.delete(cacheKey)
        }
      })
    }
    
    const interval = setInterval(cleanup, 60000) // Проверяем каждую минуту
    return () => clearInterval(interval)
  }, [cacheTime])

  return {
    data,
    loading,
    error,
    refetch,
    isStale
  }
}

// Утилита для очистки кэша
export const clearQueryCache = (key?: string) => {
  if (key) {
    queryCache.delete(key)
  } else {
    queryCache.clear()
  }
} 