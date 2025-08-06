'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/SupabaseAuthProvider'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useSupabase'
import {
  Home,
  ShoppingCart,
  User,
  Grid3X3,
  Menu,
  X,
  Heart
} from 'lucide-react'

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems } = useCart()
  const { getWishlistCount } = useWishlist()

  const cartItemsCount = cartItems.length
  const wishlistCount = getWishlistCount()

  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      window.location.href = href
    }
  }

  const navItems = [
    {
      icon: Home,
      label: 'Acasă',
      href: '/',
      active: pathname === '/'
    },
    {
      icon: Grid3X3,
      label: 'Categorii',
      href: '/products',
      active: pathname.startsWith('/products')
    },
    {
      icon: Heart,
      label: 'Favorite',
      href: '/wishlist',
      active: pathname === '/wishlist',
      badge: wishlistCount > 0 ? wishlistCount : undefined
    },
    {
      icon: ShoppingCart,
      label: 'Coș',
      href: '/cart',
      active: pathname === '/cart',
      badge: cartItemsCount > 0 ? cartItemsCount : undefined
    },
    {
      icon: User,
      label: 'Profil',
      href: user ? '/account' : '/login',
      active: pathname === '/account' || pathname === '/login'
    }
  ]

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
                              <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Meniu</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Acasă</span>
              </Link>

              <Link
                href="/products"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Grid3X3 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Toate produsele</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Contact</span>
              </Link>

              {user ? (
                <Link
                  href="/account"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Contul meu</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Conectare</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding for mobile content */}
      <div className="pb-20 md:pb-0" />
    </>
  )
} 