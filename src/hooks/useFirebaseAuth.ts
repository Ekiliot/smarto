import { useState, useEffect, useCallback } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { supabase } from '@/lib/supabase'
import { auth, signInWithGoogle, signOutFromFirebase, onFirebaseAuthStateChanged } from '@/lib/firebase'

export interface FirebaseAuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  isActive: boolean
  marketingConsent?: boolean
}

export function useFirebaseAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<FirebaseAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sync Firebase user with Supabase
  const syncUserWithSupabase = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setSupabaseUser(null)
      return
    }

    try {
      // Get Firebase JWT token
      const token = await firebaseUser.getIdToken()
      
      // Set the token in Supabase
      const { data: { user }, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: ''
      })

      if (error) {
        console.error('Error setting Supabase session:', error)
        return
      }

      if (user) {
        // Check if user exists in users table
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error checking existing user:', userError)
        }

        if (!existingUser) {
          // Create user record if doesn't exist
          const userData = firebaseUser.providerData[0]
          const fullName = userData?.displayName || userData?.email?.split('@')[0] || 'User'
          
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: firebaseUser.email!,
                name: fullName,
                role: 'user',
                is_active: true
              }
            ])

          if (insertError) {
            console.error('Error creating user record:', insertError)
          }
        }

        // Fetch user data
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          console.error('Error fetching user data:', fetchError)
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
      }
    } catch (error) {
      console.error('Error syncing user with Supabase:', error)
    }
  }, [])

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged(async (user) => {
      setFirebaseUser(user)
      await syncUserWithSupabase(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [syncUserWithSupabase])

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await signInWithGoogle()
      console.log('Google sign in successful:', result.user.email)
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOutFromFirebase()
      await supabase.auth.signOut()
      setFirebaseUser(null)
      setSupabaseUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [])

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    if (firebaseUser) {
      await syncUserWithSupabase(firebaseUser)
    }
  }, [firebaseUser, syncUserWithSupabase])

  return {
    firebaseUser,
    user: supabaseUser,
    isLoading,
    loginWithGoogle,
    logout,
    refreshUserData
  }
} 