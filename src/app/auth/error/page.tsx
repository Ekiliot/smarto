'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>('')
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth_failed':
        return 'Eroare la autentificare. Vă rugăm să încercați din nou.'
      case 'no_session':
        return 'Sesiunea nu a fost creată. Vă rugăm să verificați link-ul.'
      case 'unexpected':
        return 'A apărut o eroare neașteptată. Vă rugăm să încercați din nou.'
      default:
        return 'A apărut o eroare la autentificare.'
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    // Перезагружаем страницу
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Eroare de autentificare
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isRetrying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isRetrying ? 'Se încarcă...' : 'Încercați din nou'}</span>
            </button>

            <Link
              href="/login"
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Înapoi la autentificare</span>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Dacă problema persistă, vă rugăm să:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Verificați conexiunea la internet</li>
              <li>• Încercați să deschideți link-ul în alt browser</li>
              <li>• Contactați suportul tehnic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 