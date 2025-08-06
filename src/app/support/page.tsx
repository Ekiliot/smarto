'use client'

import { useAuth } from '@/components/SupabaseAuthProvider'
import AuthGuard from '@/components/AuthGuard'
import FullScreenChat from '@/components/FullScreenChat'
import TawkToChat from '@/components/TawkToChat'

export default function SupportPage() {
  return (
    <AuthGuard>
      <TawkToChat />
      <FullScreenChat />
    </AuthGuard>
  )
} 