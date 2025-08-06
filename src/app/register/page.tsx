'use client'

import { useState } from 'react'
import { useAuth } from '@/components/SupabaseAuthProvider'
import { supabase } from '@/lib/supabase'
import { getEmailProvider, openEmailProvider } from '@/lib/emailProviders'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import Link from 'next/link'
import {
  Mail,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus,
  ExternalLink
} from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailProvider, setEmailProvider] = useState<{ name: string; url: string } | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim() || !formData.firstName.trim()) {
      setMessage({ type: 'error', text: 'Completați toate câmpurile obligatorii' })
      return
    }

    if (!termsAccepted) {
      setMessage({ type: 'error', text: 'Trebuie să acceptați termenii și condițiile pentru a continua' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
      
      // Register with magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email.trim(),
        options: {
          data: {
            name: fullName,
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            marketing_consent: marketingConsent
          },
          emailRedirectTo: `${window.location.origin}/account`
        }
      })

      if (error) {
        throw error
      }

      // Определяем почтовый провайдер
      const provider = getEmailProvider(formData.email.trim())
      setEmailProvider(provider)

      setMessage({ 
        type: 'success', 
        text: 'Link-ul de înregistrare a fost trimis pe email! Verificați inbox-ul și spam-ul.' 
      })
      
      // Сразу открываем почту в новой вкладке
      if (provider) {
        setTimeout(() => {
          openEmailProvider(formData.email.trim())
        }, 500) // Небольшая задержка для лучшего UX
      }
      
      // Clear form
      setFormData({
        email: '',
        firstName: '',
        lastName: ''
      })
    } catch (error) {
      console.error('Registration error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Eroare la înregistrare. Încercați din nou.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Înregistrare
            </h2>
            <p className="text-gray-600">
              Creați un cont nou pentru a accesa toate funcționalitățile
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleRegister} className="space-y-6">
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prenume *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Prenumele"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nume
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Numele"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresa de email *
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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="exemplu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    disabled={isLoading}
                    required
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
                    {' '}*
                  </label>
                </div>

                {/* Marketing Consent */}
                <div className="flex items-start space-x-3">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="marketing" className="text-sm text-gray-700">
                    Sunt de acord să primesc comunicări de marketing (newsletter, oferte speciale, 
                    actualizări despre produse) pe adresa de email furnizată. Pot renunța oricând 
                    din setările contului.
                  </label>
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
                    <span>Se înregistrează...</span>
                  </>
                ) : (
                  <>
                    <span>Creează cont și deschide email-ul</span>
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
                  <p className="font-medium mb-1">Cum funcționează înregistrarea?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Completați formularul</li>
                    <li>• Email-ul se va deschide automat</li>
                    <li>• Verificați email-ul pentru link-ul de confirmare</li>
                    <li>• Faceți click pe link pentru a activa contul</li>
                    <li>• Veți fi conectat automat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Aveți deja cont?{' '}
                <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                  Conectați-vă
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