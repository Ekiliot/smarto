'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/SupabaseAuthProvider'
import { ArrowLeft, MessageCircle, User, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export default function FullScreenChat() {
  const { user } = useAuth()
  const [isChatLoaded, setIsChatLoaded] = useState(false)

  useEffect(() => {
    // Ждем загрузки Tawk.to скрипта
    const checkTawkLoaded = () => {
      if (window.Tawk_API) {
        // Устанавливаем данные пользователя
        if (user) {
          window.Tawk_API.visitor = {
            name: user.name,
            email: user.email
          }
        }

        // Открываем чат автоматически
        setTimeout(() => {
          if (window.Tawk_API && window.Tawk_API.maximize) {
            window.Tawk_API.maximize()
          }
          setIsChatLoaded(true)
        }, 1000)
      } else {
        // Если скрипт еще не загружен, проверяем через 500ms
        setTimeout(checkTawkLoaded, 500)
      }
    }

    checkTawkLoaded()
  }, [user])

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      value: "+373 600 00 000",
      description: "Luni-Vineri: 9:00-18:00"
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@smarto.md",
      description: "Răspuns în 24 de ore"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Înapoi</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-green-600 font-medium">Cont verificat</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Chat live cu suportul</h2>
                <p className="text-sm text-gray-600">
                  {isChatLoaded ? 'Chat-ul este gata. Scrieți mesajul dvs.' : 'Se încarcă chat-ul...'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-96 bg-gray-50 flex items-center justify-center">
            {!isChatLoaded ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Se încarcă chat-ul...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chat-ul este gata!</h3>
                <p className="text-gray-600 mb-4">
                  Echipa noastră de suport vă așteaptă să vă ajute.
                </p>
                <button
                  onClick={() => {
                    if (window.Tawk_API && window.Tawk_API.maximize) {
                      window.Tawk_API.maximize()
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Deschide chat-ul</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <info.icon className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{info.title}</h3>
                  <p className="text-sm text-gray-600">{info.value}</p>
                  <p className="text-xs text-gray-500">{info.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informații importante:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Chat-ul este disponibil în timpul programului de lucru</li>
                <li>• Pentru suport urgent în afara programului, contactați-ne prin email</li>
                <li>• Răspunsul în maxim 5 minute în timpul programului</li>
                <li>• Puteți atașa imagini pentru a explica mai bine problema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 