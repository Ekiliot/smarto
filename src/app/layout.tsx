'use client'

import './globals.css'
import MobileNav from '@/components/MobileNav'
import { SupabaseAuthProvider } from '@/components/SupabaseAuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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