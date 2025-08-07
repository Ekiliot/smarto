'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useSupabase'
import { Home, ShoppingCart, User, Grid3X3, Menu, X, Heart, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { supabaseUser, signOut, isLoading } = useSupabaseAuth()
  const { getCartCount } = useCart()
  const { wishlistItems } = useWishlist()
  const cartCount = getCartCount()
  const wishlistCount = wishlistItems.length

  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      window.location.href = href
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { icon: Home, label: 'Acasă', href: '/', active: pathname === '/' },
    { icon: Grid3X3, label: 'Produse', href: '/products', active: pathname === '/products' },
    { icon: ShoppingCart, label: 'Coș', href: '/cart', active: pathname === '/cart', badge: cartCount > 0 ? cartCount : undefined },
    { icon: Heart, label: 'Favorite', href: '/wishlist', active: pathname === '/wishlist', badge: wishlistCount > 0 ? wishlistCount : undefined },
    { icon: User, label: 'Profil', href: '/account', active: pathname === '/account' }
  ]

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                item.active ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {supabaseUser ? (
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <p className="font-medium">{supabaseUser.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{supabaseUser.email}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">Please sign in to access your account</p>
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In with Magic Link
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 