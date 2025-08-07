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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      logger.info('Starting Google sign in...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        logger.error('Google sign in error:', error)
        onError?.(error.message)
        return
      }

      logger.info('Google sign in initiated successfully')
      onSuccess?.()
    } catch (error) {
      logger.error('Unexpected error during Google sign in:', error)
      onError?.(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLinkSignIn = async () => {
    if (!email) {
      onError?.('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      logger.info('Sending magic link to:', email)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        logger.error('Magic link error:', error)
        onError?.(error.message)
        return
      }

      logger.info('Magic link sent successfully')
      onSuccess?.()
    } catch (error) {
      logger.error('Unexpected error during magic link sign in:', error)
      onError?.(error instanceof Error ? error.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async () => {
    if (!email) {
      onError?.('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      logger.info('Starting email sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true, // Создаем пользователя если его нет
        },
      })

      if (error) {
        logger.error('Email sign in error:', error)
        onError?.(error.message)
        return
      }

      logger.info('Email sign in initiated successfully')
      onSuccess?.()
    } catch (error) {
      logger.error('Unexpected error during email sign in:', error)
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

      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>

      {/* Magic Link Button */}
      <button
        onClick={handleMagicLinkSignIn}
        disabled={loading || !email}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>

      {/* Email Sign In Button */}
      <button
        onClick={handleEmailSignIn}
        disabled={loading || !email}
        className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        {loading ? 'Signing in...' : 'Sign in with Email'}
      </button>
    </div>
  )
} 