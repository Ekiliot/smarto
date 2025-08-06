import type { Metadata } from 'next'
import './globals.css'
import { SupabaseAuthProvider } from '@/components/SupabaseAuthProvider'

export const metadata: Metadata = {
  title: 'Smarto - Техника умного дома в Молдове',
  description: 'Маркетплейс техники умного дома Smarto в Молдове. Широкий выбор умных устройств для вашего дома.',
  keywords: 'умный дом, техника, Молдова, Smarto, автоматизация, IoT',
  authors: [{ name: 'Smarto Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className="min-h-screen bg-gray-50">
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
} 