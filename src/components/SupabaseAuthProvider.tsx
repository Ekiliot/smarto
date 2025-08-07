'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  isActive: boolean
  marketingConsent?: boolean
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<boolean>
  refreshUserData: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Получаем данные пользователя из базы данных
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('AUTH: Error fetching user data:', error)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isActive: data.is_active
        })
      }
    } catch (error) {
      console.error('AUTH: Error in fetchUserData:', error)
    }
  }, [])

  // Инициализация и слушатель изменений аутентификации
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Получаем текущую сессию
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('AUTH: Error getting session:', error)
        }

        if (mounted && session?.user) {
          setSupabaseUser(session.user)
          
          // Проверяем/создаем пользователя в базе
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError && userError.code !== 'PGRST116') {
            console.error('AUTH: Error checking existing user:', userError)
          }

          if (!existingUser) {
            const userData = session.user.user_metadata
            const fullName = userData?.name || userData?.first_name || 'User'
            
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email!,
                  name: fullName,
                  role: 'user',
                  is_active: true
                }
              ])

            if (insertError) {
              console.error('AUTH: Error creating user record:', insertError)
            }
          }
          
          await fetchUserData(session.user.id)
        }
      } catch (error) {
        console.error('AUTH: Error in initializeAuth:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (session?.user) {
          setSupabaseUser(session.user)
          await fetchUserData(session.user.id)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.warn('Login with password is deprecated. Use Magic Link instead.')
    return false
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setSupabaseUser(null)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUserData = async () => {
    if (supabaseUser) {
      await fetchUserData(supabaseUser.id)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    console.warn('Register with password is deprecated. Use Magic Link instead.')
    return false
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      login, 
      logout, 
      register, 
      refreshUserData,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider')
  }
  return context
} 