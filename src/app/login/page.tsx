'use client'

import { useState, useEffect, Suspense } from 'react'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { supabase } from '@/lib/supabase'
import { getEmailProvider, openEmailProvider } from '@/lib/emailProviders'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import Link from 'next/link'
import {
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  User,
  ExternalLink
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const { loginWithGoogle, isLoading: isFirebaseLoading } = useFirebaseAuth()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailProvider, setEmailProvider] = useState<{ name: string; url: string } | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Проверяем ошибки авторизации
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'auth_failed') {
      setMessage({ 
        type: 'error', 
        text: 'Eroare la autentificare. Încercați din nou.' 
      })
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    if (!termsAccepted) {
      setMessage({ type: 'error', text: 'Trebuie să acceptați termenii și condițiile pentru a continua' })
      return
    }

    setIsGoogleLoading(true)
    setMessage(null)

    try {
      await loginWithGoogle()
      // Успешная авторизация - пользователь будет перенаправлен автоматически
    } catch (error: any) {
      console.error('Google login error:', error)
      
      let errorMessage = 'Eroare la autentificarea cu Google. Încercați din nou.'
      
      if (error?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Fereastra de autentificare a fost închisă. Încercați din nou.'
      } else if (error?.code === 'auth/popup-blocked') {
        errorMessage = 'Fereastra de autentificare a fost blocată. Permiteți popup-urile pentru acest site.'
      } else if (error?.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Cererea de autentificare a fost anulată.'
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Introduceți adresa de email' })
      return
    }

    if (!termsAccepted) {
      setMessage({ type: 'error', text: 'Trebuie să acceptați termenii și condițiile pentru a continua' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Определяем, является ли устройство мобильным
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      
      // Настраиваем redirect URL в зависимости от устройства
      const redirectUrl = isMobile 
        ? `${window.location.origin}/account`
        : `${window.location.origin}/account`

      console.log('Sending magic link to:', email.trim())
      console.log('Redirect URL:', redirectUrl)
      console.log('Is mobile:', isMobile)

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          // Добавляем дополнительные опции для мобильных устройств
          data: {
            device_type: isMobile ? 'mobile' : 'desktop',
            user_agent: navigator.userAgent
          }
        }
      })

      if (error) {
        console.error('Supabase magic link error:', error)
        throw error
      }

      // Определяем почтовый провайдер
      const provider = getEmailProvider(email.trim())
      setEmailProvider(provider)

      setMessage({ 
        type: 'success', 
        text: 'Link-ul de conectare a fost trimis pe email! Verificați inbox-ul și spam-ul.' 
      })
      
      // Сразу открываем почту в новой вкладке (только на десктопе)
      if (provider && !isMobile) {
        setTimeout(() => {
          openEmailProvider(email.trim())
        }, 500) // Небольшая задержка для лучшего UX
      }
      
      setEmail('')
    } catch (error: any) {
      console.error('Magic link error:', error)
      
      // Более детальная обработка ошибок
      let errorMessage = 'Eroare la trimiterea link-ului. Încercați din nou.'
      
      if (error?.message) {
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Adresa de email nu este validă.'
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Prea multe încercări. Așteptați câteva minute.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Eroare de rețea. Verificați conexiunea la internet.'
        }
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Conectare
            </h2>
            <p className="text-gray-600">
              Alegeți metoda de conectare preferată
            </p>
          </div>

          {/* Google Login Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isFirebaseLoading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGoogleLoading || isFirebaseLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Se conectează...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Conectare cu Google (Firebase)</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">sau</span>
              </div>
            </div>

            {/* Terms and Conditions - Move to top for Google login */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  disabled={isLoading || isGoogleLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  Sunt de acord cu{' '}
                  <Link 
                    href="/terms" 
                    target="_blank"
                    className="text-orange-600 hover:text-orange-500 font-medium inline-flex items-center"
                  >
                    termenii și condițiile
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                  {' '}și{' '}
                  <Link 
                    href="/privacy" 
                    target="_blank"
                    className="text-orange-600 hover:text-orange-500 font-medium inline-flex items-center"
                  >
                    politica de confidențialitate
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </label>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkLogin} className="space-y-6">
              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresa de email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="exemplu@email.com"
                    disabled={isLoading}
                  />
                  {email && getEmailProvider(email) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getEmailProvider(email)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Se trimite...</span>
                  </>
                ) : (
                  <>
                    <span>Trimite link-ul și deschide email-ul</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Cum funcționează?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Alegeți Google pentru conectare rapidă (Firebase)</li>
                    <li>• Sau introduceți email-ul pentru Magic Link</li>
                    <li>• Verificați inbox-ul și spam-ul</li>
                    <li>• Faceți click pe link-ul din email</li>
                    <li>• Veți fi conectat automat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Nu aveți cont?{' '}
                <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                  Înregistrați-vă
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Se încarcă...</h2>
          <p className="text-gray-600">Se pregătește pagina de conectare...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
} 