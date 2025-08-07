'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

interface AuthButtonsProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export default function AuthButtons({ onSuccess, onError }: AuthButtonsProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      onError?.('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      logger.info('Sending magic link to:', email)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      })

      if (error) {
        logger.error('Magic link error:', error)
        onError?.(error.message)
        return
      }

      logger.info('Magic link sent successfully')
      setMessage('Check your email for the magic link!')
      onSuccess?.()
    } catch (error) {
      logger.error('Unexpected error during magic link sign in:', error)
      onError?.(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Magic Link Button */}
      <button
        onClick={handleMagicLinkSignIn}
        disabled={loading || !email}
        className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
      </button>

      {/* Success Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {/* Info Text */}
      <div className="text-center text-sm text-gray-600">
        <p>No password required! We'll send you a secure link to sign in.</p>
      </div>
    </div>
  )
} 