'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Сначала проверим, есть ли уже активная сессия
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log('Session already exists for user:', session.user.email)
          setStatus('success')
          setTimeout(() => {
            router.push('/account')
          }, 1000)
          return
        }

        // Получаем токены из URL fragment (клиентская сторона)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const error = searchParams.get('error')

        console.log('Auth callback processing:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error,
          hash: hash.substring(0, 50) + '...' // Показываем начало hash для отладки
        })

        // Если есть ошибка
        if (error) {
          setError(error)
          setStatus('error')
          return
        }

        // Если есть токены (Magic Link)
        if (accessToken && refreshToken) {
          console.log('Setting session from Magic Link tokens...')
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('Error setting session:', sessionError)
            setError(sessionError.message)
            setStatus('error')
            return
          }

          if (!data.session) {
            console.error('No session created')
            setError('Failed to create session')
            setStatus('error')
            return
          }

          console.log('Session created successfully for user:', data.user?.email)
          setStatus('success')
          
          // Перенаправляем на аккаунт
          setTimeout(() => {
            router.push('/account')
          }, 1000)
          
          return
        }

        // Если нет токенов и нет ошибки, но сессия есть
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession) {
          console.log('Session found after retry for user:', currentSession.user.email)
          setStatus('success')
          setTimeout(() => {
            router.push('/account')
          }, 1000)
          return
        }

        // Если нет токенов и нет сессии
        setError('No authorization tokens received')
        setStatus('error')

      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        setError(error instanceof Error ? error.message : 'Unexpected error')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <div className="w-6 h-6 bg-blue-600 rounded animate-spin"></div>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Signing you in...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we complete your authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Successfully signed in!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting you to your account...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Try Again
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Loading...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Processing authentication...
              </p>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 