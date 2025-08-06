'use client'

import { ReactNode, useEffect } from 'react'
import { useAuth } from './SupabaseAuthProvider'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, supabaseUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !supabaseUser)) {
      router.push('/login')
    }
  }, [user, isLoading, router, supabaseUser])

  if (isLoading || !user || !supabaseUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return <>{children}</>
} 