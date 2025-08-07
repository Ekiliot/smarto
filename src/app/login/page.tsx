'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/SupabaseAuthProvider'
import AuthButtons from '@/components/AuthButtons'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import Link from 'next/link'
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  User
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем
    if (user && !isLoading) {
      router.push('/account')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setMessage({
        type: 'error',
        text: `Eroare la autentificare: ${error}`
      })
    }
  }, [searchParams])

  const handleAuthSuccess = () => {
    setMessage({
      type: 'success',
      text: 'Autentificare reușită! Veți fi redirecționat în curând...'
    })
    setTimeout(() => {
      router.push('/account')
    }, 2000)
  }

  const handleAuthError = (error: string) => {
    setMessage({
      type: 'error',
      text: error
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-500" />
          <p className="text-gray-600">Sunteți deja autentificat!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Autentificare
              </h1>
              <p className="text-gray-600">
                Conectați-vă la contul dvs. Smarto
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Accept{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-500">
                    termenii și condițiile
                  </Link>{' '}
                  și{' '}
                  <Link href="/privacy" className="text-orange-600 hover:text-orange-500">
                    politica de confidențialitate
                  </Link>
                </span>
              </label>
            </div>

            {/* Auth Buttons */}
            {termsAccepted ? (
              <AuthButtons 
                onSuccess={handleAuthSuccess}
                onError={handleAuthError}
              />
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Trebuie să acceptați termenii și condițiile pentru a continua
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">sau</span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Nu aveți un cont?{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Înregistrați-vă
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center"
            >
              <User className="w-4 h-4 mr-1" />
              Înapoi la pagina principală
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
} 