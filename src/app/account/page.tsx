'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/SupabaseAuthProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  LogOut,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function AccountPage() {
  const { user, supabaseUser, logout, refreshUserData } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isMagicLinkAuth, setIsMagicLinkAuth] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [isStatusExpanded, setIsStatusExpanded] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  // Handle Magic Link authentication
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setIsMagicLinkAuth(true)
      setMessage({ type: 'success', text: 'Autentificare reușită! Veți fi redirecționat pe pagina principală.' })
      
      // Сразу перенаправляем на главную страницу
      setTimeout(() => {
        router.push('/')
      }, 1000) // Небольшая задержка чтобы пользователь увидел сообщение об успехе
    }
  }, [searchParams, router])

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      setFormData({
        firstName,
        lastName,
        email: user.email
      })
      
      setOriginalData({
        firstName,
        lastName,
        email: user.email
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setMessage(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      email: originalData.email
    })
    setMessage(null)
  }

  const handleSave = async () => {
    if (!user || !formData.firstName.trim()) {
      setMessage({ type: 'error', text: 'Numele este obligatoriu' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
      
      // Update in users table only
      const { error: userError } = await supabase
        .from('users')
        .update({ name: fullName })
        .eq('id', user.id)

      if (userError) throw userError

      setOriginalData({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email
      })
      
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Profilul a fost actualizat cu succes!' })
      
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Eroare la actualizarea profilului' })
    } finally {
      setIsLoading(false)
    }

    // Refresh user data immediately
    try {
      await refreshUserData()
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header - Hidden on mobile */}
        <div className="hidden md:block">
        <Header />
        </div>
        
        <main className="py-4 md:py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Magic Link Success Message */}
            {isMagicLinkAuth && (
              <div className="mb-6 md:mb-8 bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  <div>
                    <h3 className="text-base md:text-lg font-medium text-green-800">
                      Autentificare reușită!
                    </h3>
                    <p className="text-sm md:text-base text-green-700">
                      Veți fi redirecționat pe pagina principală...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contul meu</h1>
                  <p className="text-sm md:text-base text-gray-600">Gestionați informațiile personale și setările contului</p>
                </div>
              </div>
            </div>

            {/* Mobile Compact Layout */}
            <div className="md:hidden space-y-4">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-xs text-gray-600">{formData.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {isProfileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isProfileExpanded && (
                  <div className="p-4 space-y-4">
                    {message && !isMagicLinkAuth && (
                      <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm ${
                        message.type === 'success' 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                      {message.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-medium">{message.text}</span>
                    </div>
                    )}

                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Prenume *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Introduceți prenumele"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{formData.firstName || 'Nu este specificat'}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nume</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Introduceți numele"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{formData.lastName || 'Nu este specificat'}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 flex-1 truncate">{formData.email}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verificat
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      {!isEditing ? (
                        <button
                          onClick={handleEdit}
                          className="inline-flex items-center space-x-1 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Editează</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center space-x-1 px-3 py-2 text-gray-700 bg-gray-100 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                            <span>Anulează</span>
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            <span>{isLoading ? 'Se salvează...' : 'Salvează'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Status cont</h3>
                    <button
                      onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {isStatusExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isStatusExpanded && (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Verificat</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Da
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Rol</span>
                      <span className="text-xs text-gray-900 capitalize">{user?.role}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Cont creat</span>
                      <span className="text-xs text-gray-900">
                        {supabaseUser?.created_at 
                          ? new Date(supabaseUser.created_at).toLocaleDateString('ro-RO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Nu disponibil'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Acțiuni rapide</h3>
                </div>
                <div className="p-4 space-y-3">
                  <a
                    href="/support"
                    className="w-full flex items-center space-x-3 p-3 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Suport tehnic</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Deconectare</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Informații personale</h2>
                          <p className="text-sm text-gray-600">Actualizați numele și informațiile de contact</p>
                        </div>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={handleEdit}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editează</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {message && !isMagicLinkAuth && (
                      <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
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

                    <div className="space-y-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prenume *
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="Introduceți prenumele"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{formData.firstName || 'Nu este specificat'}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nume
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="Introduceți numele"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{formData.lastName || 'Nu este specificat'}</span>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresa de email
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{formData.email}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verificat
                          </span>
                        </div>
                      </div>

                      {/* Account Created */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cont creat
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">
                            {supabaseUser?.created_at 
                              ? new Date(supabaseUser.created_at).toLocaleDateString('ro-RO', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'Nu disponibil'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rol
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 capitalize">{user?.role}</span>
                          {user?.role === 'admin' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Administrator
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isEditing && (
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Anulează</span>
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>{isLoading ? 'Se salvează...' : 'Salvează'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Acțiuni rapide</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <a
                      href="/support"
                      className="w-full flex items-center space-x-3 p-3 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Suport tehnic</span>
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Deconectare</span>
                    </button>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Status cont</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verificat</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Da
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ultima activitate</span>
                      <span className="text-sm text-gray-900">Acum</span>
                    </div>
                  </div>
                </div>
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
    </AuthGuard>
  )
} 