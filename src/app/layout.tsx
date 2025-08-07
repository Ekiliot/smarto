'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './globals.css'
import MobileNav from '@/components/MobileNav'
import { SupabaseAuthProvider } from '@/components/SupabaseAuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('=== LAYOUT: Component mounted ===')
    console.log('Current pathname:', pathname)
    
    const checkSession = async () => {
      try {
        console.log('=== LAYOUT: Checking session ===')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('LAYOUT: Session check error:', error)
        }
        
        console.log('LAYOUT: Session check result:', { 
          hasSession: !!session, 
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at,
          pathname
        })
        
        setSession(session)
      } catch (error) {
        console.error('LAYOUT: Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== LAYOUT: Auth state change ===')
        console.log('Event:', event)
        console.log('Session user:', session?.user?.email)
        console.log('Current pathname:', pathname)
        
        setSession(session)
        
        if (event === 'SIGNED_IN') {
          console.log('LAYOUT: User signed in, session established')
        } else if (event === 'SIGNED_OUT') {
          console.log('LAYOUT: User signed out, session cleared')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('LAYOUT: Token refreshed')
        }
      }
    )

    return () => {
      console.log('LAYOUT: Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [pathname])

  useEffect(() => {
    console.log('=== LAYOUT: Session state changed ===')
    console.log('Session:', session ? 'exists' : 'null')
    console.log('IsLoading:', isLoading)
    console.log('Pathname:', pathname)
  }, [session, isLoading, pathname])

  if (isLoading) {
    console.log('LAYOUT: Showing loading state')
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-500 rounded animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  console.log('LAYOUT: Rendering main layout')
  console.log('Children will render for pathname:', pathname)

  return (
    <html lang="en">
      <body>
        <SupabaseAuthProvider>
          <div className="min-h-screen bg-gray-50">
            <main className="pb-16 md:pb-0">
              {children}
            </main>
            <MobileNav />
          </div>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
} 