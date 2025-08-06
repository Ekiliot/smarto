import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface SupabaseAuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  isActive: boolean
  marketingConsent?: boolean
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserData(session.user.id)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth state change:', event, session?.user?.email)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserData(session.user.id)
        } else {
          setSupabaseUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return
      }

      if (userData) {
        setSupabaseUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isActive: userData.is_active
        })
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error)
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const redirectUrl = isMobile
        ? `${window.location.origin}/account`
        : `${window.location.origin}/account`

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            device_type: isMobile ? 'mobile' : 'desktop',
            user_agent: navigator.userAgent
          }
        }
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Magic link error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    supabaseUser,
    isLoading,
    signInWithMagicLink,
    signOut
  }
} 