'use client'

import { useAuth } from './SupabaseAuthProvider'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AuthStatus() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Se verifică autentificarea...</span>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span>Conectat ca {user.name}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-orange-600">
      <AlertCircle className="w-4 h-4" />
      <span>Nu sunteți conectat</span>
    </div>
  )
} 