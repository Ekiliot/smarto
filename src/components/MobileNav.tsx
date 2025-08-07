'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useSupabase'
import { Home, ShoppingCart, User, Grid3X3, Heart } from 'lucide-react'
import Link from 'next/link'

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { supabaseUser } = useSupabaseAuth()
  const { getCartCount } = useCart()
  const { wishlistItems } = useWishlist()
  const cartCount = getCartCount()
  const wishlistCount = wishlistItems.length

  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      window.location.href = href
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
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
} 